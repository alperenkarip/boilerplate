---
id: SPEC-DEPLOY-001
version: 0.1.0
status: draft
created: 2026-06-05
updated: 2026-06-05
author: alp
priority: P0
issue_number: 0
---

# SPEC-DEPLOY-001 — Uretime Gecis: Web Deploy + SPA Fallback + Cross-Platform Env Sema + EAS Paritesi + Turbo Env

## HISTORY

- 2026-06-05 (v0.1.0): Ilk taslak. velocity-remediation-roadmap.md (SPEC-DEPLOY-001 karti) + velocity-research-raw.json `DEPLOY-PROD-PARITY` temasi + gercek kod dogrulamasi (deploy.yml, ci.yml, vite.config.ts, turbo.json, eas.json, vite-env.d.ts varlik kontrolu) temel alindi. Yol B cross-platform karari ve ADR-001 (SPA-first) ile hizalandi. Web deploy host secimi ACIK KARAR olarak isaretlendi; SPEC host-agnostik yazildi.

---

## Overview

Bu SPEC, boilerplate'in **uretime gecis** katmanini kurar. Su an web deploy tamamen sahte: `deploy.yml:44` web build'i uretip `echo "Web build tamamlandi. Hosting deploy adimi buraya eklenecek."` ile bitiriyor — production'a hicbir sey gitmiyor. Buna karsin mobil `mobile-deploy` job'u workflow seviyesinde gercek (`expo/expo-github-action@v8` + `EXPO_TOKEN` + profile bazli `eas build`) ama pratikte PATLAR cunku `apps/mobile/babel.config.js` ve `metro.config.js` yoktur ve `app.json` referansli asset'ler eksiktir (bu on-kosul SPEC-MOBILE-001'e baglidir). Yani su an web ile mobil arasinda buyuk paritesizlik (web stub, mobil "var ama calismaz") vardir.

Ek olarak SPA-first (ADR-001) olmasina ragmen hicbir SPA fallback/rewrite konfigurasyonu yoktur (`vercel.json`, `netlify.toml`, `_redirects`, `wrangler.toml` — hicbiri yok, varlik kontrolu ile dogrulandi). React Router 7 client-side routing + code-split lazy chunk'lar (LoginPage, HomePage, ProfilePage ayri `.js`) uretiliyor; static host'ta `/login` gibi bir **deep-link rewrite olmadan 404 dondurur** — bu bir **uretim-blocker**dir.

Env tarafinda `.env.example` 13+ degisken (web `VITE_*`, mobil `EXPO_PUBLIC_*`) tanimlar ama **0 sema dogrulamasi** vardir. `import.meta.env` yalnizca `sentry.ts`'de ham ve tipsiz okunur (`vite-env.d.ts` tek satir, typed `ImportMetaEnv` yok). `VITE_API_BASE_URL` tanimli ama hicbir uygulama kodunda OKUNMAZ (`createApiClient` fan_in=0, sample %100 in-memory mock). `turbo.json` build task'inda `env`/`globalEnv` yoktur; `VITE_*` degiskenleri cache hash'ine girmedigi icin farkli env ile ayni cache hit olabilir (stale build riski).

Bu SPEC bu katmani kurar: secilen hosta gercek web deploy (echo stub yerine), host-bagimsiz SPA fallback contract'i, t3-env tabanli cross-platform env sema (build-time fail-fast), `VITE_API_BASE_URL` icin `createApiClient` wire-up **noktasi** (tuketim degil), EAS mobil gercek-calisabilirlik on-kosulu (SPEC-MOBILE-001'e bagimlilik) ve EAS env<->GitHub secrets paritesi, Turbo env declaration, ve repo-mode (`bootstrap_ready`) guard'i. Amac time-to-product: turetilen projenin gercekten **uretime cikabilir** bir tabana oturmasi.

### Acik Karar — Web Deploy Host (ACIK KARAR)

> Web deploy host'u **henuz secilmedi**. Bu SPEC host-agnostik yazilmistir: tum EARS gereksinimleri "the configured hosting target" uzerinden host-bagimsiz ifade edilmistir. Belirli bir host config dosyasi (`vercel.json` / `netlify.toml` / `_redirects` / `wrangler.toml`) Run fazinda secim onaylandiginda somutlasir.
>
> **Onerilen referans/default (placeholder): Vercel** — CLI-mode (stable, API-mode degil), official action. Gerekce: SPA-first ADR-001 ile en uyumlu (`vercel.json` `rewrites` -> tum route `/index.html`), preview/production ayrimi native, React+Vite SPA icin en olgun hosting.
>
> **Alternatifler:** Netlify (`netlify.toml` + `_redirects` `/* /index.html 200`), Cloudflare Pages (Pages action + SPA mode + olasi `_routes.json`), veya tam **placeholder-agnostik** (referans implementasyon yerine yalniz dokumante edilmis bos slot).
>
> **Karar sahibi:** derived project. Boilerplate vendor-agnostik kalir: tek referans implementasyon (Vercel onerilen) + diger hostlar icin dokumante placeholder. **SPA-fallback rewrite contract'i host'tan bagimsiz bir EARS kuralidir** (deep link mutlaka `index.html`'e cozulmeli) ve host degisse de korunur (bkz. REQ-SPA-003).

### Delta Markeri Aciklamasi (BROWNFIELD)

- `[EXISTING]`: Mevcut, degismeyecek (referans/baglam).
- `[MODIFY]`: Mevcut dosya degisecek.
- `[NEW]`: Yeni olusturulacak dosya/yapi.
- `[BLOCKED-BY]`: Baska bir SPEC'in on-kosulu (bu SPEC'te yazilmaz, bagimlilik olarak isaretlenir).

---

## Requirements (EARS)

Modul sayisi: 5. REQ numaralandirmasi modul bazlidir. Tum host-spesifik gereksinimler "configured hosting target" uzerinden ifade edilir.

### Modul 1 — Web Deploy Hedefi (echo stub -> gercek deploy)

- **REQ-WEBDEPLOY-001** (Event-Driven): WHEN the `web-production` or `web-preview` deploy target is dispatched, the system SHALL build `apps/web` and deploy the output to the **configured hosting target** instead of running a stub echo step.
  - `[MODIFY]` `.github/workflows/deploy.yml:43-44` (`Deploy to hosting` / `echo ...` -> secilen host official action)
  - `[EXISTING]` `deploy.yml:18-21` `web-preview`/`web-production` input secenekleri korunur.
- **REQ-WEBDEPLOY-002** (Ubiquitous): The system SHALL bind the web deploy job to a GitHub Environment (`preview` or `production`) and inject the host credentials as secrets (e.g. for the Vercel reference: `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`) so that no host token is hardcoded in the workflow.
  - `[MODIFY]` `deploy.yml` `web-deploy` job (su an `environment:` yok, web icin tek bir secret bile yok — yalniz `mobile-deploy`'da `EXPO_TOKEN`).
- **REQ-WEBDEPLOY-003** (IF-THEN / Unwanted): IF a web deploy occurs, THEN the system SHALL inject the validated `VITE_*` variables into the build step so that secrets and config are not hardcoded into source.
- **REQ-WEBDEPLOY-004** (WHERE): WHERE the deployed web host serves hashed build assets, the system SHALL apply an `immutable` long-lived cache header to hashed assets and a `no-cache` header to `index.html`, so that route deep-links always fetch a fresh shell.

### Modul 2 — SPA Fallback / Client-Side Routing Rewrite (uretim-blocker)

- **REQ-SPA-001** (Ubiquitous): The system SHALL ship an SPA-fallback configuration for the configured hosting target that rewrites all non-asset routes to `/index.html`.
  - `[NEW]` host-spesifik config (orn. `vercel.json` `rewrites`, VEYA `netlify.toml`/`apps/web/public/_redirects`, VEYA Cloudflare `_routes.json`/SPA mode) — su an HICBIRI yok (varlik kontrolu ile dogrulandi).
- **REQ-SPA-002** (Event-Driven): WHEN a deep-link route such as `/login` or `/profile` is requested directly on the deployed web host, the system SHALL serve `index.html` with HTTP 200 (client-side routing takes over) instead of returning HTTP 404.
  - `[EXISTING]` React Router 7 client-side routing + `dist/assets/` lazy chunk'lar (`LoginPage-*.js`, `HomePage-*.js`, `ProfilePage-*.js`) — kanit: code-split aktif.
- **REQ-SPA-003** (IF-THEN / Unwanted): IF the deploy host is changed (Vercel -> Netlify -> Cloudflare vb.), THEN the system SHALL keep the SPA-fallback rewrite contract intact, so that deep links continue to resolve to `index.html` regardless of host (host-agnostik invariant; bkz. Acik Karar).

### Modul 3 — Cross-Platform Env Sema (t3-env, build-time fail-fast)

- **REQ-ENV-001** (Ubiquitous): The system SHALL validate all environment variables against a single typed schema (built on `@t3-oss/env-core`) and SHALL fail the build when a required variable is missing or invalid (fail-fast), reporting the offending variable name.
  - `[NEW]` env modulu (orn. `packages/core` veya yeni `packages/env`) — `createEnv` semasi.
  - `[EXISTING]` `zod` catalog'da mevcut (`^4.x`); ham `zod` yerine `env-core` clientPrefix/runtimeEnv enforcement icin secildi.
- **REQ-ENV-002** (Ubiquitous): The system SHALL expose web environment variables via the `VITE_` prefix and mobile environment variables via the `EXPO_PUBLIC_` prefix through one cross-platform env abstraction, mapping `runtimeEnv` to `import.meta.env` on web and to `Constants.expoConfig.extra` / `process.env` on mobile.
  - `[EXISTING]` platform-split env okuma referansi: `apps/web/src/observability/sentry.ts` (`import.meta.env`) ve `apps/mobile/src/observability/sentry.ts` (`Constants.expoConfig.extra`).
- **REQ-ENV-003** (Ubiquitous): The system SHALL provide a typed `ImportMetaEnv` interface in `apps/web/src/vite-env.d.ts` so that `import.meta.env.VITE_*` access is type-checked instead of `any`.
  - `[MODIFY]` `apps/web/src/vite-env.d.ts` (su an tek satir `/// <reference types="vite/client" />`, typed interface yok).
- **REQ-ENV-004** (WHERE): WHERE a `VITE_API_BASE_URL` value is provided and validated, the system SHALL define the single wire-up point that passes it into `createApiClient(config)` so the application can target a real API instead of in-memory mocks — defining the **wire-up contract only**, not consuming a real backend.
  - `[EXISTING]` `packages/core/src/api/client.ts` `createApiClient(config)` `baseURL` param alir, su an 0 consumer (temiz baglama noktasi).
  - Gercek API tuketimi SPEC-API-001'e devredilir (Kapsam Disi).
- **REQ-ENV-005** (IF-THEN / Unwanted): IF an environment variable fails schema validation, THEN the system SHALL abort the build/deploy and SHALL NOT produce a build that silently falls back to undefined values (`emptyStringAsUndefined` + `onValidationError` ile net hata).

### Modul 4 — EAS Mobil Parite (on-kosul + env parite)

- **REQ-EAS-001** (IF-THEN / Unwanted): IF `apps/mobile` lacks `babel.config.js`, `metro.config.js`, or the assets referenced by `app.json` (`icon.png`, `splash.png`, `adaptive-icon.png`), THEN the system SHALL block the mobile EAS deploy with a clear precondition error rather than failing opaquely inside the EAS build.
  - `[BLOCKED-BY]` SPEC-MOBILE-001 (babel/metro/asset on-kosulu). Bu SPEC on-kosulu **dogrular ve gate eder**, kendisi babel/metro/asset uretmez.
  - `[EXISTING]` `deploy.yml:60-71` `mobile-deploy` job (gercek ama on-kosulsuz patlar).
- **REQ-EAS-002** (Event-Driven): WHEN the mobile deploy precondition gate passes, the system SHALL guarantee an EAS build dry-run (or `expo prebuild` validation) succeeds before claiming web/mobile deploy parity (no store submit required at this stage).
- **REQ-EAS-003** (WHERE): WHERE EAS environment variables are managed in the Expo dashboard (`EXPO_PUBLIC_*`) and web variables are managed as GitHub secrets (`VITE_*`), the system SHALL document the parity between the two sources in a single source of truth, including the `eas env:pull` local-parity path.
  - `[EXISTING]` `apps/mobile/eas.json` mevcut (placeholder submit blok). Placeholder'lar (orn. `APPLE_ID_HERE`, `ASC_APP_ID_HERE`) derive-time doldurma noktasi olarak isaretlenir.

### Modul 5 — Turbo Env + Deploy Zinciri + Repo-Mode Guard

- **REQ-CHAIN-001** (State-Driven): WHILE building with Turborepo, the system SHALL include the declared env variables (`VITE_*`, `EXPO_PUBLIC_*`) in the `build`/`typecheck` task `env` (and `globalEnv` where appropriate) cache hash, so that a build with different env values does not reuse a stale cached output.
  - `[MODIFY]` `turbo.json` `tasks.build` / `tasks.typecheck` (su an `env`/`globalEnv` yok — sadece `dependsOn` + `outputs`).
- **REQ-CHAIN-002** (State-Driven): WHILE running in the canonical docs-only repo (`bootstrap_ready=false`), the system SHALL skip the web-deploy and env-validation jobs without failing CI, reusing the existing repo-mode guard pattern.
  - `[EXISTING]` `ci.yml:24-40` `repo-mode` job (`bootstrap_ready` outputs) ve `ci.yml:119` `if: needs.repo-mode.outputs.bootstrap_ready == 'true'` gate — yeni job'lar bu deseni miras alir.
- **REQ-CHAIN-003** (WHERE): WHERE a web deploy rollback is needed, the system SHALL document a web deploy rollback runbook procedure (re-deploy previous build / host rollback), since the existing runbook (`docs/operations/runbook-and-incident-response.md` §4.1) covers only OTA/native rollback.
  - `[MODIFY]` `docs/operations/runbook-and-incident-response.md` (web deploy rollback bolumu ekle).
- **REQ-CHAIN-004** (WHERE): WHERE production deploys are dispatched, the system SHALL keep the default trigger as `workflow_dispatch` (manual/safe) and SHALL recommend a GitHub Environment protection rule (manual approval) for the `production` environment; tag/release-based auto-deploy remains an optional, documented derived-project decision (consistent with `bp-v*` tag wiring owned by SPEC-INFRA-DERIVE-001).
  - `[EXISTING]` `deploy.yml:11` `on: workflow_dispatch` korunur (tag-bazli otomatik deploy opsiyonel/dokumante).

---

## Kapsam Disi (What NOT to Build)

- **Gercek API entegrasyonu / backend tuketimi** — SPEC-API-001. Bu SPEC yalniz `VITE_API_BASE_URL`'in `createApiClient`'a baglanacagi **wire-up noktasini** (interface kontrati) sabitler; gercek HTTP istegi, MSW->gercek API gecisi ve veri katmani tuketimi SPEC-API-001'e aittir.
- **Magaza submit / phased rollout / App Store / Play Store yayini** — bu SPEC EAS build dry-run / prebuild dogrulamasini garanti eder; magaza submit, credential yonetimi ve phased rollout kapsam disidir.
- **`apps/mobile/babel.config.js` + `metro.config.js` + asset uretimi** — SPEC-MOBILE-001. Bu SPEC bunlari yalniz **on-kosul olarak gate eder** (REQ-EAS-001), kendisi uretmez.
- **`bp-v*` tag / release siniflandirma / `notify-derived-projects` tetikleme** — SPEC-INFRA-DERIVE-001. Deploy'un release event'ine baglanmasi opsiyonel/dokumante bir karardir; tag uretme/versiyonlama bu SPEC'in disindadir (`git tag -l` su an bos).
- **Vendor kilitlenme / belirli host'a baglilik** — boilerplate adapter-agnostik kalir. Tek referans implementasyon (Vercel onerilen) + diger hostlar icin dokumante placeholder; host-spesifik config derived project tarafindan override edilebilir (bkz. Acik Karar + REQ-SPA-003).
- **Cross-platform UI portu / 27 ekran / `.native.tsx` split** — SPEC-UI-001. EAS build'in "calisabilir" olmasi bu SPEC'in on-kosulu degil; mobil ekranlarin render edilebilirligi UI portuna baglidir.
- **Lint/coverage/E2E enforcement gate** — SPEC-TEST-001. Deep-link smoke test bu SPEC'te bir deploy-sonrasi dogrulama adimi olarak tanimlanir ama CI enforcement ratchet'i SPEC-TEST-001'e aittir.
