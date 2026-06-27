# SPEC-DEPLOY-001 (Compact)

**Baslik:** Uretime gecis — gercek web deploy + SPA fallback + cross-platform env sema (t3-env) + EAS paritesi + Turbo env.
**Oncelik:** P0 | **Faz:** 4 | **Deps:** SPEC-MOBILE-001 (sert on-kosul), SPEC-API-001 (interface bagi) | **Tip:** BROWNFIELD
**ACIK KARAR:** web deploy host (Vercel onerilen/default ref / Netlify / Cloudflare Pages / placeholder-agnostik). SPEC host-agnostik; SPA contract host-bagimsiz.

---

## REQ Ozeti

**Modul 1 — Web Deploy Hedefi**
- REQ-WEBDEPLOY-001: WHEN web-prod/preview dispatch -> build + deploy to configured host (echo stub DEGIL).
- REQ-WEBDEPLOY-002: GitHub Environment + host secret injection (no hardcode).
- REQ-WEBDEPLOY-003: IF deploy THEN validated VITE_* env build'e enjekte.
- REQ-WEBDEPLOY-004: hashed asset immutable / index.html no-cache.

**Modul 2 — SPA Fallback (uretim-blocker)**
- REQ-SPA-001: non-asset route -> /index.html rewrite (config su an YOK).
- REQ-SPA-002: WHEN /login deep-link -> 200 (404 DEGIL).
- REQ-SPA-003: IF host degisir THEN rewrite contract korunur (host-agnostik invariant).

**Modul 3 — Cross-Platform Env Sema (t3-env)**
- REQ-ENV-001: @t3-oss/env-core typed sema, build-time fail-fast, degisken adi raporu.
- REQ-ENV-002: web VITE_ + mobil EXPO_PUBLIC_ tek soyutlama; runtimeEnv platform adapter.
- REQ-ENV-003: vite-env.d.ts typed ImportMetaEnv.
- REQ-ENV-004: VITE_API_BASE_URL -> createApiClient wire-up NOKTASI (tuketim degil).
- REQ-ENV-005: IF env invalid THEN abort, undefined'a sessiz dusus YOK.

**Modul 4 — EAS Parite**
- REQ-EAS-001: IF babel/metro/asset eksik THEN precondition error (on-kosul SPEC-MOBILE-001).
- REQ-EAS-002: WHEN gate gecer -> EAS build dry-run/prebuild basarili (store submit yok).
- REQ-EAS-003: EAS env <-> GitHub secrets parite tek dokuman (eas env:pull).

**Modul 5 — Turbo + Zincir + Guard**
- REQ-CHAIN-001: WHILE Turbo build -> VITE_*/EXPO_PUBLIC_* cache hash'te (stale build engeli).
- REQ-CHAIN-002: WHILE bootstrap_ready=false -> web-deploy/env-validation no-op (CI yesil).
- REQ-CHAIN-003: web deploy rollback runbook (su an sadece OTA/native).
- REQ-CHAIN-004: trigger default workflow_dispatch + production environment protection onerisi.

---

## Acceptance (ozet)

1. Deep-link /login deploy-sonrasi 200 (404 degil). [SPA]
2. Eksik/gecersiz env build-fail + degisken adi raporu. [ENV fail-fast]
3. EAS on-kosul (babel/metro/asset) gate + dry-run/prebuild gecer. [EAS parite]
4. Web deploy echo stub kalkti -> gercek host deploy + environment + secret. [WEBDEPLOY]
5. Turbo env: farkli env -> farkli cache key (stale yok). [CHAIN]
6. Canonical repo'da deploy/env job'lari no-op (CI yesil). [guard]

---

## Degisecek / Yeni Dosyalar

| Dosya | Delta | REQ |
|-------|-------|-----|
| `.github/workflows/deploy.yml:43-44` | MODIFY (echo -> host action) | WEBDEPLOY-001/002/003 |
| host SPA config (`vercel.json` / `netlify.toml`+`_redirects` / Cloudflare) | NEW (su an YOK) | SPA-001 |
| env modulu (`packages/core` veya `packages/env`) `createEnv` | NEW | ENV-001/002/005 |
| `apps/web/src/vite-env.d.ts` | MODIFY (typed ImportMetaEnv) | ENV-003 |
| `packages/core/src/api/client.ts` wire-up noktasi | EXISTING (fan_in=0 baglama) | ENV-004 |
| `turbo.json:4-7` `tasks.build`/`typecheck` `env` | MODIFY | CHAIN-001 |
| `.github/workflows/deploy.yml` web-deploy `bootstrap_ready` guard | MODIFY | CHAIN-002 |
| `docs/operations/runbook-and-incident-response.md` | MODIFY (web rollback) | CHAIN-003 |
| `apps/mobile/babel.config.js`, `metro.config.js`, `assets/*` | BLOCKED-BY SPEC-MOBILE-001 (gate, uretim YOK) | EAS-001 |
| `apps/mobile/eas.json` | EXISTING (placeholder isaret) | EAS-003 |

---

## Kapsam Disi

- Gercek API entegrasyonu/backend tuketimi (yalniz wire-up noktasi) -> SPEC-API-001.
- Magaza submit / phased rollout (EAS dry-run garanti) -> kapsam disi.
- babel/metro/asset uretimi (yalniz gate) -> SPEC-MOBILE-001.
- bp-v* tag / release siniflandirma -> SPEC-INFRA-DERIVE-001.
- Vendor kilitlenme (adapter-agnostik, referans + placeholder).
- 27 ekran UI portu / .native.tsx split -> SPEC-UI-001.
- Lint/coverage/E2E enforcement ratchet (deep-link smoke bu SPEC'te dogrulama adimi) -> SPEC-TEST-001.
