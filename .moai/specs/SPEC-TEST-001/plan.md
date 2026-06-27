# SPEC-TEST-001 — Implementation Plan

## Teknik Yaklasim (Genel)

Enforcement-first kalite kapilarini **baseline-then-ratchet** ile kurar. Hicbir kapi mevcut ihlalleri tek seferde `error`'a cevirmez; once olculen durum dondurulur, yeni regresyon engellenir, ihlal sifirlandikca esik yukselir. Tum CI degisiklikleri yalnizca `.github/workflows/ci.yml` icinde kalir (release.yml / deploy.yml'e dokunulmaz).

## Teknoloji / Surum

| Bilesen | Teknoloji / Surum | Durum |
|---------|-------------------|-------|
| Coverage provider (web) | `@vitest/coverage-v8` | EKLENECEK — pnpm-lock.yaml'da YOK (grep count=0) |
| E2E runner | `@playwright/test ^1.59.1` | MEVCUT — lockfile'da var, `apps/web/playwright.config.ts` var; CI job eksik |
| Mobil coverage | Jest 29.x `coverageThreshold` + `jest-expo` | jest.config.js mevcut; threshold + `src/test/setup.ts` eksik |
| Plugin self-test | ESLint `RuleTester` (yerlesik) | EKLENECEK — 19 kural icin 0 test |
| Scaffolding smoke | bats-core | EKLENECEK — 0 .bats dosyasi |
| Lint gate | ESLint 9 flat config + `--max-warnings` | recommended.js flat-config fix gerekli |
| MSW fixture | (SPEC-API-001'den gelir) | BAGIMLILIK — bu SPEC tuketir, uretmez |

## Gorev Decomposition (Priority sirasi)

### Priority High — Faz 3 baslangici (CI gercekten gate eder)

**T1. bp-rule severity tek-kaynak + flat-config fix (REQ-LINT-001)**
- `packages/eslint-plugin-bp/src/configs/recommended.js`: gecersiz `plugins: ['@project/bp']` array sozdizimini kaldir, yalniz `rules` birak (flat-config'de plugin registration config tuketici tarafinda yapilir).
- `eslint.config.js:117-144`: inline 19x `warn` override'i kaldir, recommended config'i extend et.
- Reference: `eslint.config.js:124-143`, `recommended.js:6-29`, `index.js:55-57`

**T2. Generic error temizligi + lint gate baseline (REQ-LINT-001)**
- 29 generic error duzelt: 24x `@typescript-eslint/no-explicit-any` (web 2 + mobile 22 + ui 5'in any kismi) + 4x `no-console` + 1x `no-undef`.
- Workspace lint script'lerine `--max-warnings <BASELINE>` ekle (`apps/web`, `apps/mobile`, `packages/ui` package.json `lint` script'leri).
- Reference: `apps/web/package.json:11`, `apps/mobile/package.json:9`, `.github/workflows/ci.yml:178`

### Priority High — coverage kapisi

**T3. Web coverage threshold (REQ-COV-001)**
- `@vitest/coverage-v8` ekle (web devDependency), `pnpm install` ile lockfile'a yaz.
- `apps/web/vitest.config.ts`: `test.coverage.provider = 'v8'` + `thresholds` bloku (Open Decision OD-1 olcumune gore).
- `apps/web/package.json` test script: `vitest run --coverage`.
- Reference: `apps/web/vitest.config.ts:12-17`, `apps/web/package.json:12`

**T4. Mobil coverage + setup (REQ-COV-001)**
- `apps/mobile/src/test/setup.ts` olustur (jest-expo uyumlu, `@testing-library/react-native` matchers).
- `apps/mobile/jest.config.js`: `coverageThreshold` + `collectCoverageFrom` ekle.
- `apps/mobile/package.json` test script: `jest --coverage` (`--passWithNoTests` kaldir, en az 1 smoke test eklendiginde).
- Reference: `apps/mobile/jest.config.js:11`, `apps/mobile/package.json:10`

### Priority High — davranis dogrulama

**T5. E2E davranis donusumu + CI job (REQ-E2E-001)**
- `apps/web/e2e/auth-flow.spec.ts`: `heading visible` -> `getByLabel().fill()` -> `getByRole('button').click()` -> `toHaveURL()` deseni. 13 testin tamami davranis-odakli yeniden yazilir.
- `ci.yml`: yeni `e2e` job (Playwright kurulum + `pnpm exec playwright test`). MSW fixture deterministik (basari/401/500/bos).
- Reference: `apps/web/e2e/auth-flow.spec.ts:5-8`, `.github/workflows/ci.yml` (e2e job yok)

### Priority Medium — regresyon kilidi

**T6. eslint-plugin-bp RuleTester matrisi (REQ-PLUGIN-001)**
- 19 kural icin `*.test.js` (RuleTester): her kuralda en az 1 valid + 1 invalid case.
- Test job'a dahil et.
- Reference: `packages/eslint-plugin-bp/src/rules/` (19 dosya, 0 test)

**T7. Scaffolding/sync bats smoke (REQ-SCAFFOLD-001)**
- `tooling/derive/*.bats`: gecici dizinde `create-project.sh --skip-install` calistir, ciktida `boilerplate`/`@project` kalintisi ara (deep-link prefix `AppNavigator.tsx:192` dahil).
- CI'da `grep -> exit 1` deseni (boundary/secret-leak job sablonu).
- Reference: `tooling/derive/create-project.sh:179,549`, `tooling/sync/upstream-sync.sh:79`, `apps/mobile/src/navigation/AppNavigator.tsx:192`

## Riskler ve Azaltma

| Risk | Etki | Azaltma |
|------|------|---------|
| Severity tek seferde `error` -> CI kilitlenir | UI refactor (241 var(--color)) sirasinda butun PR'lar bloklanir | Baseline-then-ratchet: mevcut warning sayisi `--max-warnings` baseline olarak dondurulur, yalniz yukari ratchet |
| Coverage esigi cok yuksek baslar -> CI aninda kirar | Faz 3 baslar baslamaz test job kirmizi | OD-1: once olc, sonra dondur; global %85 dayatma yok |
| E2E gercek backend ister | Deterministik degil, flaky | MSW fixture (SPEC-API-001); gercek cagri yasak |
| `ci.yml` cakismasi (INFRA/DEPLOY) | Merge conflict | Yalniz `ci.yml` lint/test/e2e job; release.yml/deploy.yml'e dokunulmaz; farkli faz/job |
| `grep -oP` GNU-only (macOS bos) | upstream-sync her seferinde FULL_SYNC | bats smoke bu davranisı yakalar; fix INFRA SPEC'inde (`sed -nE`) |
| bp-v tag yok -> upstream-sync test edilemez | Smoke testi calismaz | Tag uretimi INFRA bagimliligi; bu SPEC tag varligini varsayar |

## MX Tag Plani

- `recommended.js` severity tablosu: `@MX:ANCHOR` (fan_in: eslint.config.js + tum tuketici projeler; severity gradyani invariant) + `@MX:REASON`.
- `ci.yml` yeni `e2e` job + `--max-warnings` gate: `@MX:NOTE` (baseline-then-ratchet niyeti, ratchet hedefi 0).
- `vitest.config.ts` coverage thresholds: `@MX:NOTE` (OD-1 baseline kaynagi, ratchet yonu yukari).
- `create-project.sh` verify genisletme: `@MX:WARN` (deep-link prefix rename eksigi turetilen projeyi kirar) + `@MX:REASON`.
- 19 RuleTester dosyasi: `@MX:TODO` -> GREEN'de cozulur (her kural test edildikce kaldirilir).

## Bagimlilik Sirasi (Faz 3 ici)

T1 -> T2 (lint baz temiz olmali) -> T3/T4 (coverage paralel) -> T5 (E2E, API/AUTH fixture hazir) -> T6/T7 (regresyon kilidi, paralel).
