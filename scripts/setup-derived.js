#!/usr/bin/env node
// setup-derived.js
//
// Firebase-aware bootstrap tool for projects derived from this boilerplate.
// It injects project identity and the canonical Firebase backend configuration
// (ADR-020 / ADR-021) into a freshly cloned copy. See the contract in
// docs/implementation/43-derived-project-creation-guide.md sections 9.3 / 9.4 / 9.7.
//
// Design constraints:
//   - Zero runtime dependencies. Uses only Node 20 built-ins (readline/promises,
//     util.parseArgs, fs, path). Adding a dependency would violate the boilerplate
//     dependency policy and require editing package.json.
//   - This is a DERIVATION tool: it must never break the boilerplate. Template
//     files (.env.example, *.example.json, *.example.plist) are never modified or
//     deleted; the script only produces new gitignored files.
//   - Idempotent: re-running with the same answers yields no further changes.
//   - Secrets (API keys, native config) are written only to gitignored targets
//     (.env.local, google-services.json, GoogleService-Info.plist), never to the
//     committed templates.
//
// Usage:
//   node scripts/setup-derived.js                 # interactive
//   node scripts/setup-derived.js --dry-run       # show planned changes only
//   node scripts/setup-derived.js --yes --project-name=my-app \
//        --firebase-project-id=my-app --firebase-api-key=AIza... ...   # CI / scripted
//
// Mobile note: @react-native-firebase reads its config from the native
// google-services.json / GoogleService-Info.plist files, NOT from .env. The web
// app reads VITE_FIREBASE_* from .env.local. There are deliberately no
// EXPO_PUBLIC_FIREBASE_* variables to inject on the mobile side.

import { createInterface } from 'node:readline/promises';
import { parseArgs } from 'node:util';
import { execSync } from 'node:child_process';
import {
  existsSync,
  readFileSync,
  writeFileSync,
  copyFileSync,
} from 'node:fs';
import { join } from 'node:path';

const REPO_ROOT = process.cwd();

// --- Relative paths the script touches (resolved from REPO_ROOT) -------------

const PATHS = {
  rootPackage: 'package.json',
  appJson: 'apps/mobile/app.json',
  firebaserc: '.firebaserc',
  envExample: '.env.example',
  envLocal: '.env.local',
  googleServicesExample: 'apps/mobile/google-services.example.json',
  googleServices: 'apps/mobile/google-services.json',
  plistExample: 'apps/mobile/GoogleService-Info.example.plist',
  plist: 'apps/mobile/GoogleService-Info.plist',
  boundary: 'BOUNDARY.md',
};

// --- Small console helpers ---------------------------------------------------

const c = {
  reset: '[0m',
  dim: '[2m',
  bold: '[1m',
  green: '[32m',
  yellow: '[33m',
  red: '[31m',
  cyan: '[36m',
};

function info(msg) {
  console.log(msg);
}
function ok(msg) {
  console.log(`${c.green}OK${c.reset}    ${msg}`);
}
function skip(msg) {
  console.log(`${c.dim}SKIP  ${msg}${c.reset}`);
}
function warn(msg) {
  console.log(`${c.yellow}WARN${c.reset}  ${msg}`);
}
function planned(msg) {
  console.log(`${c.cyan}PLAN${c.reset}  ${msg}`);
}
function fail(msg) {
  console.error(`${c.red}ERROR${c.reset} ${msg}`);
}

// --- Generic file helpers ----------------------------------------------------

function abs(rel) {
  return join(REPO_ROOT, rel);
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function readText(rel) {
  return readFileSync(abs(rel), 'utf8');
}

function writeText(rel, content) {
  writeFileSync(abs(rel), content, 'utf8');
}

function readJson(rel) {
  return JSON.parse(readText(rel));
}

// Writes JSON with 2-space indent and a trailing newline (matches repo style).
function writeJson(rel, obj) {
  writeText(rel, `${JSON.stringify(obj, null, 2)}\n`);
}

// Upserts a single KEY=value line into dotenv-style content.
function upsertEnvKey(content, key, value) {
  const line = `${key}=${value}`;
  const re = new RegExp(`^${escapeRegExp(key)}=.*$`, 'm');
  if (re.test(content)) return content.replace(re, line);
  const sep = content.length === 0 || content.endsWith('\n') ? '' : '\n';
  return `${content}${sep}${line}\n`;
}

// Applies a list of [from, to] literal string replacements across the text.
function applyReplacements(text, replacements) {
  let out = text;
  for (const [from, to] of replacements) {
    out = out.split(from).join(to);
  }
  return out;
}

// Best-effort detection of the upstream boilerplate baseline tag (bp-v*).
function detectBoilerplateVersion() {
  try {
    const tag = execSync('git describe --tags --match "bp-v*" --abbrev=0', {
      cwd: REPO_ROOT,
      stdio: ['ignore', 'pipe', 'ignore'],
    })
      .toString()
      .trim();
    return tag || 'unknown';
  } catch {
    return 'unknown';
  }
}

// --- Input collection (CLI flags + interactive prompts) ----------------------

const CLI_OPTIONS = {
  'dry-run': { type: 'boolean', default: false },
  force: { type: 'boolean', default: false },
  yes: { type: 'boolean', default: false },
  help: { type: 'boolean', default: false },
  'project-name': { type: 'string' },
  'display-name': { type: 'string' },
  'ios-bundle-id': { type: 'string' },
  'android-app-id': { type: 'string' },
  'default-locale': { type: 'string' },
  'extra-locales': { type: 'string' },
  'brand-color': { type: 'string' },
  'firebase-project-id': { type: 'string' },
  'firebase-api-key': { type: 'string' },
  'firebase-sender-id': { type: 'string' },
  'firebase-app-id': { type: 'string' },
  'firebase-region': { type: 'string' },
  'sentry-dsn': { type: 'string' },
};

const DEFAULTS = {
  'default-locale': 'tr',
  'extra-locales': 'en',
  'brand-color': '#2563EB',
  'firebase-region': 'us-central1',
  'sentry-dsn': '',
};

function printHelp() {
  info(`${c.bold}setup-derived.js${c.reset} — Firebase-aware derived project bootstrap

Flags:
  --dry-run                 Show planned changes without writing any file
  --force                   Overwrite existing gitignored outputs (.env.local,
                            native config, BOUNDARY.md)
  --yes                     Non-interactive; all values must come from flags
  --help                    Show this help

Value flags (asked interactively when omitted):
  --project-name            kebab-case slug, e.g. my-awesome-app
  --display-name            Human app name, e.g. "My Awesome App"
  --ios-bundle-id           iOS bundle identifier, e.g. com.myapp.awesome
  --android-app-id          Android application ID, e.g. com.myapp.awesome
  --default-locale          Default locale (default: tr)
  --extra-locales           Comma list of extra locales (default: en)
  --brand-color             Primary brand color hex (default: #2563EB)
  --firebase-project-id     Firebase project ID
  --firebase-api-key        Firebase Web API key
  --firebase-sender-id      Firebase messaging sender ID (project number)
  --firebase-app-id         Firebase Web app ID
  --firebase-region         Cloud Functions region (default: us-central1)
  --sentry-dsn              Sentry DSN (optional)`);
}

// Fields required before any change can be applied.
const REQUIRED_FIELDS = [
  ['project-name', 'Project name (kebab-case)'],
  ['display-name', 'App display name'],
  ['ios-bundle-id', 'iOS bundle identifier'],
  ['android-app-id', 'Android application ID'],
  ['firebase-project-id', 'Firebase project ID'],
  ['firebase-api-key', 'Firebase Web API key'],
  ['firebase-sender-id', 'Firebase messaging sender ID'],
  ['firebase-app-id', 'Firebase Web app ID'],
];

const OPTIONAL_FIELDS = [
  ['default-locale', 'Default locale'],
  ['extra-locales', 'Extra locales (comma-separated)'],
  ['brand-color', 'Primary brand color (hex)'],
  ['firebase-region', 'Cloud Functions region'],
  ['sentry-dsn', 'Sentry DSN (leave blank to skip)'],
];

async function collectInputs(flags) {
  const values = { ...flags };

  if (flags.yes) {
    // Non-interactive: apply defaults, then verify required flags are present.
    for (const [key, def] of Object.entries(DEFAULTS)) {
      if (values[key] === undefined) values[key] = def;
    }
    const missing = REQUIRED_FIELDS.filter(([key]) => !values[key]).map(
      ([key]) => `--${key}`,
    );
    if (missing.length > 0) {
      fail(`--yes given but required flags missing: ${missing.join(', ')}`);
      process.exit(1);
    }
    return normalizeInputs(values);
  }

  // Interactive: ask for any field not provided as a flag.
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  try {
    info(`${c.bold}Derived project setup${c.reset} — answer the prompts (Enter accepts the default).\n`);

    for (const [key, label] of REQUIRED_FIELDS) {
      if (values[key]) continue;
      let answer = '';
      while (!answer.trim()) {
        answer = await rl.question(`${label}: `);
        if (!answer.trim()) warn('This field is required.');
      }
      values[key] = answer.trim();
    }

    for (const [key, label] of OPTIONAL_FIELDS) {
      if (values[key] !== undefined) continue;
      const def = DEFAULTS[key] ?? '';
      const suffix = def ? ` [${def}]` : '';
      const answer = await rl.question(`${label}${suffix}: `);
      values[key] = answer.trim() || def;
    }
  } finally {
    rl.close();
  }

  return normalizeInputs(values);
}

// Derives computed values and runs light validation (warnings only — never block).
function normalizeInputs(values) {
  const projectId = values['firebase-project-id'];
  const input = {
    projectName: values['project-name'],
    displayName: values['display-name'],
    iosBundleId: values['ios-bundle-id'],
    androidAppId: values['android-app-id'],
    defaultLocale: values['default-locale'] || DEFAULTS['default-locale'],
    extraLocales: values['extra-locales'] ?? DEFAULTS['extra-locales'],
    brandColor: values['brand-color'] || DEFAULTS['brand-color'],
    firebaseProjectId: projectId,
    firebaseApiKey: values['firebase-api-key'],
    firebaseSenderId: values['firebase-sender-id'],
    firebaseAppId: values['firebase-app-id'],
    firebaseRegion: values['firebase-region'] || DEFAULTS['firebase-region'],
    sentryDsn: values['sentry-dsn'] ?? '',
    // Conventionally derived from the project ID — not asked separately.
    firebaseAuthDomain: `${projectId}.firebaseapp.com`,
    firebaseStorageBucket: `${projectId}.appspot.com`,
  };

  if (!/^[a-z0-9-]+$/.test(input.projectName)) {
    warn(`project-name "${input.projectName}" is not strict kebab-case (a-z, 0-9, -).`);
  }
  for (const [label, id] of [
    ['ios-bundle-id', input.iosBundleId],
    ['android-app-id', input.androidAppId],
  ]) {
    if (!/^[a-zA-Z][\w]*(\.[a-zA-Z][\w]*)+$/.test(id)) {
      warn(`${label} "${id}" does not look like a reverse-DNS identifier (com.org.app).`);
    }
  }
  if (!/^#[0-9a-fA-F]{6}$/.test(input.brandColor)) {
    warn(`brand-color "${input.brandColor}" is not a 6-digit hex color.`);
  }
  return input;
}

// --- Mutation steps ----------------------------------------------------------
// Each step returns { status: 'changed' | 'skipped' | 'missing', note }.

// 1. Root package.json display name (workspace @project/* scope is intentionally
//    left untouched here — see the deferred manual steps in the final report).
function stepRootPackageName(ctx) {
  if (!existsSync(abs(PATHS.rootPackage))) {
    return { status: 'missing', note: `${PATHS.rootPackage} not found` };
  }
  const pkg = readJson(PATHS.rootPackage);
  if (pkg.name === ctx.input.projectName) {
    return { status: 'skipped', note: `name already "${pkg.name}"` };
  }
  const from = pkg.name;
  if (ctx.dryRun) {
    return { status: 'changed', note: `name "${from}" -> "${ctx.input.projectName}"` };
  }
  pkg.name = ctx.input.projectName;
  writeJson(PATHS.rootPackage, pkg);
  return { status: 'changed', note: `name "${from}" -> "${ctx.input.projectName}"` };
}

// 2. Mobile app.json: name, slug, scheme, iOS bundle id, Android package.
function stepAppJson(ctx) {
  if (!existsSync(abs(PATHS.appJson))) {
    return { status: 'missing', note: `${PATHS.appJson} not found` };
  }
  const cfg = readJson(PATHS.appJson);
  const expo = cfg.expo ?? (cfg.expo = {});
  expo.ios ??= {};
  expo.android ??= {};

  const desired = {
    name: ctx.input.displayName,
    slug: ctx.input.projectName,
    scheme: ctx.input.projectName,
    iosBundle: ctx.input.iosBundleId,
    androidPackage: ctx.input.androidAppId,
  };
  const current = {
    name: expo.name,
    slug: expo.slug,
    scheme: expo.scheme,
    iosBundle: expo.ios.bundleIdentifier,
    androidPackage: expo.android.package,
  };
  const changed = Object.keys(desired).some((k) => desired[k] !== current[k]);
  if (!changed) {
    return { status: 'skipped', note: 'app.json already matches inputs' };
  }
  if (ctx.dryRun) {
    return {
      status: 'changed',
      note: `set name/slug/scheme/bundleIdentifier(${desired.iosBundle})/package(${desired.androidPackage})`,
    };
  }
  expo.name = desired.name;
  expo.slug = desired.slug;
  expo.scheme = desired.scheme;
  expo.ios.bundleIdentifier = desired.iosBundle;
  expo.android.package = desired.androidPackage;
  writeJson(PATHS.appJson, cfg);
  return { status: 'changed', note: 'name/slug/scheme/bundle/package updated' };
}

// 3. .firebaserc default project ID.
function stepFirebaserc(ctx) {
  if (!existsSync(abs(PATHS.firebaserc))) {
    return { status: 'missing', note: `${PATHS.firebaserc} not found` };
  }
  const rc = readJson(PATHS.firebaserc);
  rc.projects ??= {};
  if (rc.projects.default === ctx.input.firebaseProjectId) {
    return { status: 'skipped', note: `default already "${ctx.input.firebaseProjectId}"` };
  }
  const from = rc.projects.default ?? '(unset)';
  if (ctx.dryRun) {
    return { status: 'changed', note: `default "${from}" -> "${ctx.input.firebaseProjectId}"` };
  }
  rc.projects.default = ctx.input.firebaseProjectId;
  writeJson(PATHS.firebaserc, rc);
  return { status: 'changed', note: `default "${from}" -> "${ctx.input.firebaseProjectId}"` };
}

// 4. .env.local web Firebase config. Templated from .env.example (or the existing
//    .env.local) and upserted key-by-key so unrelated variables are preserved.
function stepEnvLocal(ctx) {
  let base = '';
  let source = 'scratch';
  if (existsSync(abs(PATHS.envLocal))) {
    base = readText(PATHS.envLocal);
    source = PATHS.envLocal;
  } else if (existsSync(abs(PATHS.envExample))) {
    base = readText(PATHS.envExample);
    source = PATHS.envExample;
  }

  const entries = [
    ['VITE_FIREBASE_API_KEY', ctx.input.firebaseApiKey],
    ['VITE_FIREBASE_AUTH_DOMAIN', ctx.input.firebaseAuthDomain],
    ['VITE_FIREBASE_PROJECT_ID', ctx.input.firebaseProjectId],
    ['VITE_FIREBASE_STORAGE_BUCKET', ctx.input.firebaseStorageBucket],
    ['VITE_FIREBASE_MESSAGING_SENDER_ID', ctx.input.firebaseSenderId],
    ['VITE_FIREBASE_APP_ID', ctx.input.firebaseAppId],
    ['VITE_FIREBASE_FUNCTIONS_REGION', ctx.input.firebaseRegion],
    ['VITE_FIREBASE_USE_EMULATOR', 'true'],
  ];
  if (ctx.input.sentryDsn) entries.push(['VITE_SENTRY_DSN', ctx.input.sentryDsn]);

  let next = base;
  for (const [key, value] of entries) {
    next = upsertEnvKey(next, key, value);
  }
  if (next === base && existsSync(abs(PATHS.envLocal))) {
    return { status: 'skipped', note: '.env.local already up to date' };
  }
  if (ctx.dryRun) {
    return { status: 'changed', note: `write .env.local from ${source} (+${entries.length} keys)` };
  }
  writeText(PATHS.envLocal, next);
  return { status: 'changed', note: `.env.local written from ${source}` };
}

// Shared helper for the two native config files. Existing real files are NOT
// overwritten unless --force, because a developer may have downloaded the real
// one from the Firebase Console (overwriting would lose api_key / app_id).
function copyNativeConfig(ctx, exampleRel, targetRel, replacements, leftoverHint) {
  if (!existsSync(abs(exampleRel))) {
    return { status: 'missing', note: `${exampleRel} not found` };
  }
  if (existsSync(abs(targetRel)) && !ctx.force) {
    return { status: 'skipped', note: `${targetRel} exists (use --force to overwrite)` };
  }
  if (ctx.dryRun) {
    return { status: 'changed', note: `copy ${exampleRel} -> ${targetRel}, fill known placeholders` };
  }
  copyFileSync(abs(exampleRel), abs(targetRel));
  const filled = applyReplacements(readText(targetRel), replacements);
  writeText(targetRel, filled);
  return {
    status: 'changed',
    note: `${targetRel} created; ${leftoverHint}`,
  };
}

// 5. Android google-services.json.
function stepGoogleServices(ctx) {
  return copyNativeConfig(
    ctx,
    PATHS.googleServicesExample,
    PATHS.googleServices,
    [
      ['PLACEHOLDER_PROJECT_ID', ctx.input.firebaseProjectId],
      ['PLACEHOLDER_PROJECT_NUMBER', ctx.input.firebaseSenderId],
      ['com.project.boilerplate', ctx.input.androidAppId],
    ],
    'api_key / mobilesdk_app_id remain placeholders — replace with the real download',
  );
}

// 6. iOS GoogleService-Info.plist.
function stepPlist(ctx) {
  return copyNativeConfig(
    ctx,
    PATHS.plistExample,
    PATHS.plist,
    [
      ['PLACEHOLDER_PROJECT_ID', ctx.input.firebaseProjectId],
      ['PLACEHOLDER_PROJECT_NUMBER', ctx.input.firebaseSenderId],
      ['com.project.boilerplate', ctx.input.iosBundleId],
    ],
    'API_KEY / GOOGLE_APP_ID remain placeholders — replace with the real download',
  );
}

// 7. BOUNDARY.md (43-guide section 9.6 format). Content is Turkish on purpose:
//    it is a derived-project document, and project docs are written in Turkish.
function stepBoundaryMd(ctx) {
  if (existsSync(abs(PATHS.boundary)) && !ctx.force) {
    return { status: 'skipped', note: `${PATHS.boundary} exists (use --force to overwrite)` };
  }
  const today = new Date().toISOString().slice(0, 10);
  const version = detectBoilerplateVersion();
  const extra = ctx.input.extraLocales ? ctx.input.extraLocales : '(yok)';
  const content = `# BOUNDARY.md

## Boilerplate Surumu
- Kaynak: boilerplate
- Surum: ${version}
- Turetme tarihi: ${today}

## Aktif Override'lar
(Henuz yok — override gerektiginde bu bolum guncellenir)

## Proje-Ozel Eklemeler
(Boilerplate'te olmayan, projeye ozel eklenen dependency/config/kural)
- Varsayilan dil: ${ctx.input.defaultLocale}; ek diller: ${extra}
- Birincil marka rengi: ${ctx.input.brandColor}

## Son Audit
- Tarih: ${today}
- Sonuc: Baslangic — ilk audit henuz yapilmadi
`;
  if (ctx.dryRun) {
    return { status: 'changed', note: `write BOUNDARY.md (boilerplate ${version})` };
  }
  writeText(PATHS.boundary, content);
  return { status: 'changed', note: `BOUNDARY.md written (boilerplate ${version})` };
}

const STEPS = [
  ['Root package name', stepRootPackageName],
  ['Mobile app.json', stepAppJson],
  ['.firebaserc', stepFirebaserc],
  ['.env.local (web Firebase)', stepEnvLocal],
  ['google-services.json', stepGoogleServices],
  ['GoogleService-Info.plist', stepPlist],
  ['BOUNDARY.md', stepBoundaryMd],
];

// --- Main --------------------------------------------------------------------

async function main() {
  let parsed;
  try {
    parsed = parseArgs({ options: CLI_OPTIONS, allowPositionals: false });
  } catch (err) {
    fail(err.message);
    printHelp();
    process.exit(1);
  }
  const flags = parsed.values;

  if (flags.help) {
    printHelp();
    return;
  }

  const dryRun = Boolean(flags['dry-run']);
  const force = Boolean(flags.force);

  if (dryRun) info(`${c.cyan}Dry run${c.reset} — no files will be written.\n`);

  const input = await collectInputs(flags);
  const ctx = { input, dryRun, force };

  info(`\n${c.bold}Applying derived project configuration${c.reset}`);
  info(`${c.dim}repo: ${REPO_ROOT}${c.reset}\n`);

  const results = [];
  for (const [label, step] of STEPS) {
    let result;
    try {
      result = step(ctx);
    } catch (err) {
      result = { status: 'error', note: err.message };
    }
    results.push([label, result]);
    const line = `${label}: ${result.note}`;
    if (result.status === 'changed') dryRun ? planned(line) : ok(line);
    else if (result.status === 'skipped') skip(line);
    else if (result.status === 'missing') warn(line);
    else fail(line);
  }

  // Summary
  const changed = results.filter(([, r]) => r.status === 'changed').length;
  const skipped = results.filter(([, r]) => r.status === 'skipped').length;
  const missing = results.filter(([, r]) => r.status === 'missing').length;
  const errored = results.filter(([, r]) => r.status === 'error').length;

  info('');
  info(`${c.bold}Summary${c.reset}: ${changed} ${dryRun ? 'planned' : 'changed'}, ${skipped} skipped, ${missing} missing, ${errored} error`);

  // Deferred manual steps that this tool intentionally does NOT automate.
  info(`\n${c.bold}Manual follow-up (not automated by this tool):${c.reset}`);
  info('  1. Download the REAL google-services.json and GoogleService-Info.plist');
  info('     from the Firebase Console — the script cannot fill platform api_key');
  info('     and app_id, which are absent from the web config.');
  info('  2. Enable Authentication, Firestore, Cloud Functions and Storage in the');
  info('     Firebase Console (Cloud Functions deploy needs the Blaze plan).');
  info('  3. Deploy: firebase deploy --only firestore:rules,firestore:indexes,storage,functions');
  info('  4. Rename the @project/* workspace scope if desired. This also requires');
  info('     updating firebase.json predeploy filters (@project/functions) and is');
  info('     left manual to avoid breaking the build.');
  info('  5. Fill i18n locale namespaces and design-token brand values.');

  if (errored > 0) process.exit(1);
}

main().catch((err) => {
  fail(err.stack || String(err));
  process.exit(1);
});
