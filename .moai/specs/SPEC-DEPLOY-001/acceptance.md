# SPEC-DEPLOY-001 — Acceptance Criteria

> Given/When/Then senaryolari. Tum host-spesifik dogrulamalar "configured hosting target" uzerinden host-agnostik ifade edilmistir (bkz. spec.md Acik Karar).
> ACIK KARAR: web deploy host (Vercel onerilen / Netlify / Cloudflare / placeholder-agnostik) — senaryolar host secimine bagimli degildir.

---

## Senaryo 1 — Deep-link SPA fallback (uretim-blocker) [REQ-SPA-001, REQ-SPA-002]

**Given** `apps/web` build edilmis ve configured hosting target'a deploy edilmis, ve React Router 7 client-side routing aktif (`dist/assets/LoginPage-*.js` lazy chunk uretilmis),
**When** kullanici dogrudan `/login` deep-link'ine static host uzerinden istek yapar (sayfa yenileme veya yer imi),
**Then** host `index.html`'i **HTTP 200** ile dondurur (client-side router devralir) ve **HTTP 404 DONMEZ**.

- Karsi-durum (mevcut, kirik): rewrite config yok -> `/login` 404. Bu senaryo gecmeden uretim kabul edilemez.
- Dogrulama: deploy-sonrasi deep-link smoke adimi (`/login`, `/profile` -> 200).

---

## Senaryo 2 — Eksik env build-fail (fail-fast) [REQ-ENV-001, REQ-ENV-005]

**Given** env sema `@t3-oss/env-core` `createEnv` ile tanimli ve `VITE_API_BASE_URL` required isaretli,
**When** `VITE_API_BASE_URL` tanimsiz (veya bos string) iken `pnpm --filter @project/web build` calistirilir,
**Then** build **fail eder**, hata mesaji **eksik degisken adini** (`VITE_API_BASE_URL`) raporlar, ve **undefined'a sessizce dusen bir build URETILMEZ** (`emptyStringAsUndefined` + `onValidationError`).

- Pozitif durum: tum required env'ler gecerli iken build basarili.
- Karsi-durum (mevcut): 0 sema validation -> eksik env sessizce gecer, runtime'da kirilir.

---

## Senaryo 3 — EAS mobil on-kosul gate [REQ-EAS-001, REQ-EAS-002]

**Given** `mobile-production` deploy hedefi dispatch edilmis,
**When** deploy job mobil on-kosulu kontrol eder ve `apps/mobile/babel.config.js`, `metro.config.js` veya `app.json` referansli asset'ler (`icon.png`, `splash.png`, `adaptive-icon.png`) eksikse,
**Then** job **net bir precondition hatasi** ile durur (EAS build icinde opak sekilde patlamaz) ve eksik on-kosul SPEC-MOBILE-001'e isaret edilir.

- Pozitif durum: on-kosul saglandiginda EAS build dry-run / `expo prebuild` basarili olur (store submit yok) -> web/mobil parite iddiasi gecerli.
- Not: bu SPEC babel/metro/asset URETMEZ; yalniz gate eder (on-kosul SPEC-MOBILE-001).

---

## Senaryo 4 — Web deploy gercek (echo stub kalkti) + secret injection [REQ-WEBDEPLOY-001, REQ-WEBDEPLOY-002, REQ-WEBDEPLOY-003]

**Given** `bootstrap_ready=true` (derived project) ve configured hosting target secret'lari GitHub Environment'a tanimli,
**When** `web-production` hedefi dispatch edilir,
**Then** `deploy.yml` `web-deploy` job'u `apps/web`'i build eder, ciktiyi **configured hosting target'a deploy eder** (echo stub DEGIL), `environment: production`'a bagli calisir ve **validated `VITE_*` env'leri build'e enjekte eder** (hardcode yok).

- Karsi-durum (mevcut): `deploy.yml:44` `echo "..."` -> production'a hicbir sey gitmez; web icin tek secret bile yok.

---

## Senaryo 5 — Turbo env cache hash dogrulugu [REQ-CHAIN-001]

**Given** `turbo.json` `build` task'inda `VITE_*` env declaration mevcut,
**When** ayni kaynak kodu farkli `VITE_API_BASE_URL` degeriyle iki kez build edilir,
**Then** ikinci build **stale cache hit ALMAZ** (env hash'e dahil oldugu icin yeniden build edilir) — farkli env -> farkli cache key.

---

## Senaryo 6 — Canonical repo no-op (repo-mode guard) [REQ-CHAIN-002]

**Given** canonical docs-only repo (`bootstrap_ready=false`),
**When** CI calisir,
**Then** web-deploy ve env-validation job'lari **CI'i fail etmeden atlanir** (mevcut `ci.yml` repo-mode guard deseni miras alinir).

---

## Edge Cases

- **Bos string env:** `VITE_API_BASE_URL=""` -> `emptyStringAsUndefined` ile undefined sayilir, required ise build-fail (Senaryo 2 ile tutarli).
- **Asset uzantisi olan deep-link:** `/assets/LoginPage-*.js` istegi SPA fallback'e DUSMEZ (gercek asset dondurulur); yalniz non-asset route'lar `index.html`'e rewrite olur (REQ-SPA-001 "non-asset routes").
- **Host degisimi:** Vercel -> Netlify gecisinde SPA contract korunur; yalniz host-spesifik config dosyasi degisir, deep-link 200 invariant'i bozulmaz (REQ-SPA-003).
- **Mobil `import.meta.env` yoklugu:** Env modulu mobilde `import.meta.env`'e ERISMEZ; `runtimeEnv` `Constants.expoConfig.extra`/`process.env`'den beslenir (REQ-ENV-002).
- **`createApiClient` 0 consumer:** Wire-up noktasi sabitlenir ama gercek API cagrilmaz; sample feature in-memory mock kalir (tuketim SPEC-API-001).
- **Production manual approval:** Environment protection rule varsa deploy onay bekler; `workflow_dispatch` default korunur (REQ-CHAIN-004).

---

## Kalite Kapisi (Quality Gate)

- [ ] Deep-link (`/login`, `/profile`) deploy-sonrasi 200 doner (404 degil) — Senaryo 1.
- [ ] Eksik/gecersiz env build'i fail eder, degisken adi raporlanir — Senaryo 2.
- [ ] EAS mobil on-kosulu (babel/metro/asset) gate eder; dry-run/prebuild gecer — Senaryo 3.
- [ ] `deploy.yml` web-deploy echo stub kaldirildi; gercek host deploy + environment + secret injection — Senaryo 4.
- [ ] `turbo.json` env declaration: farkli env -> farkli cache key — Senaryo 5.
- [ ] Canonical repo'da web-deploy/env-validation job'lari no-op (CI yesil) — Senaryo 6.
- [ ] SPA fallback contract host-agnostik (host degisse de korunur).
- [ ] `vite-env.d.ts` typed `ImportMetaEnv` (import.meta.env.VITE_* tipli).
- [ ] Web deploy rollback runbook prosedurü dokumante.
- [ ] Vendor-agnostik: referans (Vercel) + dokumante placeholder; derived project override edebilir.

---

## Definition of Done

1. Tum 6 senaryo (Given/When/Then) gecer.
2. spec.md'deki 5 modul (REQ-WEBDEPLOY, REQ-SPA, REQ-ENV, REQ-EAS, REQ-CHAIN) tum REQ'leri karsilanir.
3. SPA fallback uretim-blocker'i cozulmus (deep-link 200).
4. Cross-platform env sema build-time fail-fast calisir; `VITE_API_BASE_URL` wire-up noktasi sabit (tuketim degil).
5. EAS parite on-kosulu gate edilir (SPEC-MOBILE-001 bagimliligi acik).
6. Turbo env declaration + repo-mode guard yerinde; cift build kararininin trade-off'u dokumante.
7. Web deploy rollback runbook ve production environment protection onerisi dokumante.
8. Acik Karar (web deploy host) Run fazinda onaylanip somut config olusturulmus; karar verilene kadar host-agnostik contract korunur.
