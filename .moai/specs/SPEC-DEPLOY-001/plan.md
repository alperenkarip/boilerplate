# SPEC-DEPLOY-001 — Implementation Plan

> Uretime gecis: gercek web deploy + SPA fallback + cross-platform env sema + EAS paritesi + Turbo env.
> ACIK KARAR: web deploy host (Vercel onerilen / Netlify / Cloudflare / placeholder-agnostik). Plan host-agnostik; somut host config Run fazinda secim onayindan sonra.

---

## Teknoloji ve Surum Secimleri

| Alan | Secim | Gerekce / Kanit |
|------|-------|-----------------|
| Env sema | `@t3-oss/env-core` (framework-agnostik `createEnv`) | Cross-platform: web `clientPrefix: VITE_` + mobil `EXPO_PUBLIC_`; `runtimeEnv` platform-bazli; build-time fail-fast; `emptyStringAsUndefined`. Ham `zod` reddedildi (clientPrefix/server-client ayrimi/runtimeEnv mapping'i elle yazmak hata kaynagi). `zod` zaten catalog'da (`^4.x`). |
| Web deploy host (default ref) | **Vercel CLI-mode** (official action, API-mode DEGIL) | SPA-first ADR-001 ile birebir uyumlu; `vercel.json` `rewrites` SPA fallback; preview/production native; React+Vite icin en olgun. ACIK KARAR — derived project secer. |
| Web deploy host (alt) | Netlify (`netlify.toml` + `_redirects`) / Cloudflare Pages | Netlify: `_redirects` tek satir SPA fallback. Cloudflare: edge + SPA mode + olasi `_routes.json`. |
| SPA fallback | host-spesifik rewrite -> `/index.html` | Vercel `rewrites` / Netlify `/* /index.html 200` / Cloudflare SPA mode. Host-agnostik contract (REQ-SPA-003). |
| Turbo env | Turborepo 2.x `task.env` + `globalEnv` | Cache hash'i env'e duyarli yapar (stale build engeller). Dusuk efor, yuksek deger. |
| Mobil env | EAS env (`eas env` / `eas env:pull`) + `EXPO_PUBLIC_*` | EAS-native; web `VITE_*` (GitHub secrets) ile parite tek dokumanda. |
| Node | 20 (host build ayari `.node-version`/engines ile hizali) | `package.json:7-9` `engines node >=20.19.0 <21`, `.nvmrc`, `.node-version` 3 yerde tutarli. |

---

## Gorev Decomposition (oncelik sirali, sure tahmini YOK)

### Faz A — Env Sema (temel, deploy oncesi sart)
1. `@t3-oss/env-core` + `zod` ile `createEnv` semasi tasarla (server/client/shared + `clientPrefix`). Hedef konum: `packages/core` veya yeni `packages/env`. **(REQ-ENV-001, REQ-ENV-002)**
2. `runtimeEnv` platform adapter: web -> `import.meta.env`, mobil -> `Constants.expoConfig.extra`/`process.env`. Referans: `sentry.ts` platform-split. **(REQ-ENV-002)**
3. `apps/web/src/vite-env.d.ts`'e typed `ImportMetaEnv` interface ekle. **(REQ-ENV-003)**
4. `emptyStringAsUndefined: true` + `onValidationError` ile build-time fail-fast. **(REQ-ENV-005)**
5. `VITE_API_BASE_URL` -> `createApiClient(config)` wire-up **noktasini** sabitle (tuketim degil, kontrat). **(REQ-ENV-004)**

### Faz B — SPA Fallback (uretim-blocker, host secimi gerekir)
6. [GATE] Web deploy host kararini al (AskUserQuestion orchestrator tarafindan; bu SPEC host-agnostik). **(Acik Karar)**
7. Secilen hosta gore SPA fallback config olustur (`vercel.json` rewrites VEYA `netlify.toml`/`_redirects` VEYA Cloudflare SPA). **(REQ-SPA-001)**
8. Asset cache stratejisi: hashed asset'lere `immutable`, `index.html`'e `no-cache`. **(REQ-WEBDEPLOY-004)**
9. Deep-link smoke kontrati tanimla (`/login`, `/profile` -> 200, 404 degil). **(REQ-SPA-002)**

### Faz C — Web Deploy Job (echo stub -> gercek)
10. `deploy.yml` `web-deploy` job'undaki `echo` stub'i secilen host official action ile degistir (preview/production input'una bagli). **(REQ-WEBDEPLOY-001)**
11. `environment:` (preview|production) + host secret'lari ekle (Vercel ref: `VERCEL_TOKEN`/`VERCEL_ORG_ID`/`VERCEL_PROJECT_ID`). **(REQ-WEBDEPLOY-002)**
12. Validated `VITE_*` env injection build adimina ekle. **(REQ-WEBDEPLOY-003)**

### Faz D — EAS Parite + Turbo + Zincir
13. Mobil deploy on-kosul gate'i (babel/metro/asset varligi -> net hata). On-kosul SPEC-MOBILE-001'e bagli. **(REQ-EAS-001)**
14. EAS build dry-run / `expo prebuild` dogrulamasi (parite garantisi, store submit yok). **(REQ-EAS-002)**
15. EAS env <-> GitHub secrets parite dokumani (`eas env:pull` dahil). **(REQ-EAS-003)**
16. `turbo.json` `build`/`typecheck` task'larina `env` (`VITE_*`, `EXPO_PUBLIC_*`) + gerekirse `globalEnv` ekle. **(REQ-CHAIN-001)**
17. Repo-mode (`bootstrap_ready`) guard'ini web-deploy + env-validation job'larina uygula (canonical repo'da no-op). **(REQ-CHAIN-002)**
18. `runbook`'a web deploy rollback prosedurü ekle. **(REQ-CHAIN-003)**
19. Production environment protection rule (manual approval) onerisi + trigger varsayilani `workflow_dispatch` koru. **(REQ-CHAIN-004)**

> Bagimlilik sirasi: Faz A (env) -> Faz B (SPA, host gate) -> Faz C (deploy job) -> Faz D (parite/zincir). Faz A diger her seyden once cunku env injection (C) ve Turbo hash (D) validated env'e bagli.

---

## Bagimliliklar (SPEC-arasi)

- **SPEC-MOBILE-001 (SERT on-kosul):** `babel.config.js` + `metro.config.js` + asset olmadan REQ-EAS-001/002 gercek parite saglayamaz. Bu SPEC on-kosulu gate eder, uretmez.
- **SPEC-API-001 (interface bagi):** REQ-ENV-004 yalniz wire-up noktasini sabitler; gercek API tuketimi API-001'e devredilir.
- **SPEC-INFRA-DERIVE-001 (opsiyonel zincir):** `bp-v*` tag/release event'ine deploy baglama opsiyonel; tag uretme INFRA-001'e ait.

---

## Riskler ve Azaltma

| Risk | Etki | Azaltma |
|------|------|---------|
| **SPA 404 (uretim-blocker)** | `/login` deep-link static host'ta 404; uretim kirik | SPA fallback config'i host-agnostik EARS contract (REQ-SPA-001/002/003) olarak sabitle; deploy-sonrasi deep-link smoke adimi ekle. Host degisse de contract korunur. |
| **Stale env cache** | Farkli env ile ayni Turbo cache hit -> yanlis env'li build | `turbo.json` `task.env`'e `VITE_*` ekle; env listesini minimal tut (sadece build ciktisini etkileyenler); tek seferlik cache invalidation kabul. |
| **Vendor lock** | Boilerplate belirli host'a kilitlenir | Adapter-agnostik: tek referans (Vercel) + dokumante placeholder; SPA contract host-bagimsiz; derived project override eder. |
| **t3-env web/mobil model catismasi** | Web build-time inline vs mobil runtime `Constants.extra`; mobilde `import.meta.env` yok | `runtimeEnv` platform adapter ile besle; SPA icin yalniz client+shared scope kullan (server scope SPA'da anlamsiz). |
| **EAS "parite" yaniltici** | Workflow var ama babel/metro/asset eksik -> build patlar | On-kosulu SPEC-MOBILE-001 bagimliligi olarak gate et; DoD'a "EAS dry-run / prebuild gecmeli" kriteri ekle (REQ-EAS-002). |
| **Scope creep (API)** | `VITE_API_BASE_URL` baglama auth/veri katmaniyla cakisir | Yalniz wire-up kontrati; gercek API tuketimi out-of-scope (SPEC-API-001). Interface sabitlenir, consumer yazilmaz. |
| **Tag-bazli yanlis deploy** | Release zincirine baglanirsa kazara production deploy | Varsayilan `workflow_dispatch` (manuel); production'a environment protection (manual approval); tag-deploy opsiyonel/dokumante. |
| **Cift build** | CI `pnpm build` + deploy ayri build (`deploy.yml` bagimsiz checkout+build) | Run fazinda karar: CI artifact passing (karmasiklik) vs deploy kendi build'i (basitlik). Trade-off acik birakilir; bu SPEC sema/contract'i sabitler. |

---

## Reference: Dosya:Satir (dogrulanmis)

- `.github/workflows/deploy.yml:43-44` — `Deploy to hosting` / `echo "Web build tamamlandi..."` (web stub).
- `.github/workflows/deploy.yml:60-71` — `mobile-deploy` EAS job (gercek ama on-kosulsuz).
- `.github/workflows/ci.yml:24-40` — `repo-mode` job, `bootstrap_ready` outputs.
- `.github/workflows/ci.yml:119` — `if: needs.repo-mode.outputs.bootstrap_ready == 'true'` gate deseni.
- `apps/web/vite.config.ts` — proxy yok, `define`/`envPrefix`/`loadEnv` yok (tam icerik dogrulandi).
- `turbo.json:4-7` — `tasks.build` yalniz `dependsOn`/`outputs`, `env`/`globalEnv` yok.
- `apps/web/src/vite-env.d.ts` — tek satir `/// <reference types="vite/client" />` (typed interface yok).
- `apps/mobile/eas.json` — MEVCUT (placeholder submit blok).
- `apps/mobile/babel.config.js`, `metro.config.js` — YOK (SPEC-MOBILE-001 on-kosulu, varlik kontrolu ile dogrulandi).
- `vercel.json`/`netlify.toml`/`apps/web/public/_redirects`/`wrangler.toml` — HICBIRI YOK (SPA fallback blocker).
- `packages/core/src/api/client.ts` — `createApiClient(config)` `baseURL`/`timeout`/`onUnauthorized` (fan_in=0, temiz wire-up).
- `apps/web/src/observability/sentry.ts` + `apps/mobile/src/observability/sentry.ts` — platform-split env okuma referansi.
- `.env.example` — `VITE_APP_NAME`, `VITE_API_BASE_URL`, `VITE_SENTRY_DSN`, `VITE_ANALYTICS_KEY`, `VITE_DEEP_LINK_DOMAIN`, `EXPO_PUBLIC_*` (8 adet); 0 sema validation (research kanit).
- `package.json:7-9` — `engines node >=20.19.0 <21`; `.nvmrc`, `.node-version`.
- `docs/operations/runbook-and-incident-response.md` §4.1 — sadece OTA/native rollback (web rollback yok).

---

## MX Tag Plani

- `@MX:ANCHOR` — env `createEnv` cikis modulu (fan_in artacak: web + mobil tuketir; `@MX:REASON` cross-platform env tek kaynak).
- `@MX:ANCHOR` — `createApiClient` wire-up noktasi (REQ-ENV-004; `@MX:REASON` mock->gercek API tek baglama noktasi, fan_in artisi beklenir).
- `@MX:WARN` — `deploy.yml` secret injection adimi (`@MX:REASON` yanlis secret/env scope production'a sizar; environment protection ile guard).
- `@MX:NOTE` — SPA fallback config (host-agnostik contract; `@MX:REASON` host degisse de `/index.html` rewrite invariant'i korunur).
- `@MX:NOTE` — `turbo.json` `env` declaration (cache hash dogrulugu; neden: stale env build engeli).
- `@MX:TODO` — EAS on-kosul gate (REQ-EAS-001); SPEC-MOBILE-001 tamamlaninca cozulur.

> Not: Bu SPEC'in dosyalarinin cogu YAML/JSON workflow ve config; MX tag yorum sozdizimi kod dosyalari (env modulu TS, wire-up TS) icin gecerlidir. Workflow/JSON dosyalarinda MX yerine yapilandirilmis yorum/dokumantasyon kullanilir.
