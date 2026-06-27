---
id: SPEC-API-001
version: 0.1.0
status: draft
created: 2026-06-05
updated: 2026-06-05
author: alp
priority: P0
issue_number: 0
---

# SPEC-API-001 — Backend-agnostik veri katmani

> Ortak HTTP client canlandirma + MSW gomulu mock backend + Vite proxy mock-to-real kopru + cross-platform veri sozlesmesi.

## HISTORY

- 2026-06-05 (v0.1.0): Ilk taslak. Kaynak: velocity-remediation-roadmap.md (SPEC-API-001 karti) + velocity-research-raw.json (tema: API-DATA-LAYER). Cross-platform karari Yol B (platform-split, react-native-web reddedildi). BROWNFIELD.

---

## Overview

### Amac

Boilerplate "kendi backend'ini getir" felsefesinde calisir; gercek bir backend yoktur. Bu SPEC, gercek backend olmadan dahi gercekci veri akislarina (loading / bos / 401 / 500 / gecikme) karsi gelistirme ve test yapilabilen, **mock-to-real gecişte tuketici kodun degismedigi** backend-agnostik bir veri katmani kurar.

Su anki durum (BROWNFIELD, dogrulanmis):
- `packages/core` icinde uretim kalitesinde `createApiClient` mevcut (retry/exponential-backoff/timeout/AbortSignal/401 callback) ama `fan_in=0` — hicbir `apps/` kodu tuketmiyor. `client.ts:6` zaten `@MX:TODO: No test file` tasiyor.
- `apps/web/src/features/sample/api.ts` core client'i bypass edip modul-seviyesi in-memory `mockItems` dizisi mutate ediyor (`:34` `let mockItems`, `:66` `mockItems.push`).
- `apps/web/src/auth/session.ts` ham `fetch` kullaniyor (`:16`, `:45`); core client'in transport mantigini cigniyor (ADR-005 "raw fetch dagilmaz" ihlali).
- MSW projede **kurulu degil** (node_modules'ta yok; pnpm-lock'ta yalnizca `@vitest/mocker`'in opsiyonel peer-dep referansi). `public/mockServiceWorker.js` yok.
- `apps/web/vite.config.ts:13-15` proxy bloku yok; `VITE_API_BASE_URL` kodda olu.
- `apps/mobile/src/screens/sample/ListScreen.tsx:5-17` web contract'ini paylasmiyor — duplicate `SampleItem` tipi + inline mock dizisi tasiyor; mobil'de `api.ts`/`hooks.ts` yok.

### Kapsam (5 modul)

1. **M1 — Ortak HTTP client canlandirma**: `createApiClient` icin test yaz (`client.ts:6` `@MX:TODO` kapat); `session.ts` ham fetch + `sample/api.ts` in-memory mock'u core client uzerine tasi.
2. **M2 — MSW gomulu mock backend**: tek `handlers.ts` (`/api/auth/*` + sample CRUD), `public/mockServiceWorker.js`, `browser.ts` (setupWorker) + `server.ts` (setupServer), basari/bos/401/500/gecikme fixture'lari.
3. **M3 — Vite proxy + mock-to-real kopru**: `VITE_API_MOCKING` bayragi ile kosullu `worker.start()`; `/api` -> `VITE_API_BASE_URL` dev proxy.
4. **M4 — Cross-platform veri sozlesmesi**: `packages/core`'a `SampleItem` tipi + query-key factory + ADR-005 staleTime sabitleri; mobil duplicate kaldir; mobil mock = core client'a injectable fetch (paylasilan fixture data modulu).
5. **M5 — Enforcement**: `no-raw-fetch-in-component` lint kurali + MSW handler Zod-uyum contract-test.

### Hedeflenen sonuc

Tek transport noktasi, network-seviyesi deterministik mock, tek-degisken (`VITE_API_MOCKING`) ile mock<->real gecis, web ve mobil icin tek veri sozlesmesi.

---

## EARS Requirements

### REQ-API-001 — Tek transport noktasi (Ubiquitous)

The system **shall** route all HTTP data access through the shared `createApiClient` in `packages/core` and **shall not** allow raw `fetch` in feature or screen components (ADR-005 Bolum 11/32).

Delta (BROWNFIELD): MEVCUT `createApiClient` korunur (degistirilmez); `session.ts` ve `sample/api.ts` ham fetch noktalari bu client uzerine TASINIR.

### REQ-API-002 — Tek kaynak MSW handler seti (Ubiquitous)

The system **shall** define all API mock behavior in a single shared `handlers` module that serves as the source of truth for browser, test, and Storybook environments, covering `/api/auth/*` and sample CRUD endpoints.

Delta (BROWNFIELD): YENI modul. `INITIAL_ITEMS` (mevcut `sample/api.ts:5-27`) verisi fixture moduluce devralinir; `mockItems` modul-state mutasyonu KALDIRILIR.

### REQ-API-003 — Mock baslatma ve mock-to-real kopru (Event + State)

**When** the dev server starts with `VITE_API_MOCKING=enabled`, the system **shall** register the MSW worker and intercept `/api/*` requests with fixture responses. **While** `VITE_API_MOCKING` is disabled, the system **shall** forward `/api/*` through the Vite dev proxy to `VITE_API_BASE_URL`.

Delta (BROWNFIELD): YENI. `vite.config.ts:13-15`'e `server.proxy` eklenir; olu `VITE_API_BASE_URL` canlandirilir.

### REQ-API-004 — Cross-platform veri sozlesmesi (Optional)

**Where** the platform is React Native (Expo), the system **shall** provide mock responses via core-client injectable `fetch` sharing the **same** fixture data module (native service-worker interception olgun degil), consuming the **same** `SampleItem` type and query-key factory exported from `packages/core`.

Delta (BROWNFIELD): mobil `ListScreen.tsx:5-17` duplicate `SampleItem` + inline mock KALDIRILIR; `packages/core`'a tasinmis sozlesmeden okunur.

### REQ-API-005 — Mock-to-real gecişte tuketici degismezligi (Unwanted Behavior)

**If** the mock layer is replaced by a real backend, **then** no consumer hook (`useSampleItems` / `useSampleItem` / `useCreateSampleItem`) and no session boundary (`checkSession` `{status,userId}` return-shape) **shall** require any change — only the transport binding (queryFn / baseURL) changes. **If** a request uses a non-idempotent method (POST), **then** the system **shall not** auto-retry it (mevcut `RETRYABLE_METHODS` invariant'i korunur).

Delta (BROWNFIELD): `hooks.ts:8-41` ve `session.ts:14-35` boundary'leri SOZLESME olarak DONDURULUR; altlari degisir, yuzeyleri sabit kalir.

---

## Kapsam Disi (What NOT to Build)

- **Gercek backend implementasyonu**: Boilerplate "kendi backend'ini getir". Sadece transport + MSW handler + fixture saglanir; gercek sunucu yazilmaz.
- **AuthProvider / auth state machine / route guard**: SPEC-AUTH-001'e aittir. Bu SPEC yalnizca `/api/auth/*` MSW handler + transport saglar; provider, context, RequireAuth/PublicOnly, form canlandirma YAZILMAZ.
- **Query-options factory tam soyutlamasi**: Erken soyutlama riski (tek `sample` feature var). Yalnizca query-key factory + staleTime SABIT modulu eklenir; tam queryOptions factory soyutlamasi ikinci feature gelince ertelenir.
- **Mobil ekran UI portu**: `onClick`->`onPress`, packages/ui RN tasima, ekran render'i SPEC-UI-001'e aittir. Bu SPEC mobil tarafta yalnizca veri sozlesmesi + injectable fetch mock saglar.
- **Env semasi sahipligi**: `VITE_API_BASE_URL` wire-up noktasi burada; ancak t3-env build-time env validation semasi SPEC-DEPLOY-001'de tanimlanir (cift-tanim yasak). Bu SPEC yalnizca `.env.example` + `vite-env.d.ts` tip tanimini ekler.
- **MSW-native (RN) production destegi**: Expo SDK 55'te MSW-native interception olgun degil; bu SPEC injectable-fetch melez yolunu kullanir, MSW-native production yolu kapsamda degildir (ayri POC).

---

## Bagimliliklar

- **deps: SPEC-MOBILE-001** (Faz 1) — mobil bootstrap (Metro/Hermes/babel) hazir olmadan mobil injectable-fetch mock dogrulanamaz.
- **Gerilim (SPEC-AUTH-001 ile)**: SPEC-API-001 ONCE gelir (transport + `/api/auth/*` handler + `checkSession` return-shape contract'ini fixture'larla besler); SPEC-AUTH-001 SONRA gelir (ustune provider/guard/form ekler, kendi endpoint'ini yazmaz).
- **Gerilim (SPEC-DEPLOY-001 ile)**: `VITE_API_BASE_URL` wire-up noktasi burada, env validation semasi DEPLOY'da — cift-tanim olmamali.
- **Hizalama**: ADR-005 (data-fetching/cache/mutation) + ADR-010 (cookie-preferred auth) canonical hukumleri implemente edilir; ADR degisikligi gerektirmez.
