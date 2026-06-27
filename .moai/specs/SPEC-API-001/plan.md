# SPEC-API-001 — Implementation Plan

> Plan dosyasi WHAT/WHY degil, HOW odaklidir. Gorev decomposition, teknoloji secimi, riskler ve MX tag plani.

## Teknoloji ve Surum

| Bilesen | Secim / Surum | Not |
|---------|---------------|-----|
| HTTP client | MEVCUT `createApiClient` (fetch-first, 3rd-party yok) | `packages/core/src/api/client.ts`, degistirilmez; wire + test |
| Mock backend (web/test) | MSW v2 (`^2.4.9`) | KURULU DEGIL — `pnpm-workspace.yaml` catalog'a eklenecek. `npx msw init` ile `public/mockServiceWorker.js` |
| Browser interception | `msw/browser` `setupWorker` | `src/mocks/browser.ts`, kosullu start |
| Node/test interception | `msw/node` `setupServer` | `src/mocks/server.ts`, vitest `setup.ts` lifecycle |
| Query layer | `@tanstack/react-query ^5.0.0` (MEVCUT) | `hooks.ts` deseni degismez |
| Validation | Zod (MEVCUT, `sample/schema.ts`) | Handler request/response Zod-uyum |
| Mobil mock | core-client injectable `fetch` | RN'de MSW-native olgun degil; paylasilan fixture data modulu |
| Env | `VITE_API_BASE_URL` + `VITE_API_MOCKING` | `.env.example` + `vite-env.d.ts` tip; sema DEPLOY'da |

## Gorev Decomposition (modul -> gorev)

### M1 — Ortak HTTP client canlandirma (REQ-API-001)
1. `createApiClient` icin test dosyasi yaz: retry/backoff, timeout (AbortSignal.timeout), abort (AbortSignal.any), 401 `onUnauthorized` callback, 5xx-retry vs 4xx-no-retry, POST-no-retry. `client.ts:6` `@MX:TODO` kapanir.
2. `apps/web/src/auth/session.ts` ham fetch'lerini (`:16`, `:45`) core client uzerine tasi; 401 mapping `onUnauthorized` ile merkezilesir; `{status,userId}` return-shape KORUNUR.
3. `apps/web/src/features/sample/api.ts`'i core client `.get/.post` cagrilarina cevir; `mockItems` (`:34`, `:66`) + `resetSampleItems` KALDIRILIR; `/api/sample` endpoint'lerine baglanir.
4. App-level client factory: baseURL'i env'den okuyan singleton (`apps/web/src/api/client.ts`).

### M2 — MSW gomulu mock backend (REQ-API-002)
1. `msw` catalog'a ekle; `npx msw init apps/web/public` ile worker dosyasi.
2. Paylasilan `src/mocks/handlers.ts`: `/api/auth/me|login|logout|register` + sample CRUD (`GET` liste, `GET :id`, `POST`, `PUT`, `DELETE`); `http.*` + `HttpResponse.json` + `delay()`.
3. Fixture modulu (`src/mocks/fixtures/`): `INITIAL_ITEMS` (`sample/api.ts:5-27`'den tasi) + basari/bos/401/500/gecikme senaryolari. Stateful degil; mutation handler-scope'ta, test `resetHandlers` ile sifirlanir.
4. `src/mocks/browser.ts` (`setupWorker`) + `src/mocks/server.ts` (`setupServer`).
5. Vitest `setup.ts`: `beforeAll(listen)` / `afterEach(resetHandlers)` / `afterAll(close)`.

### M3 — Vite proxy + mock-to-real kopru (REQ-API-003)
1. `vite.config.ts:13-15` `server`'a `proxy: { '/api': VITE_API_BASE_URL }` ekle.
2. `.env.example`: `VITE_API_BASE_URL` + `VITE_API_MOCKING=enabled|disabled`; `vite-env.d.ts` `ImportMetaEnv` tip tanimi.
3. `main.tsx`: `worker.start()` yalnizca `import.meta.env.DEV && VITE_API_MOCKING==='enabled'` (dynamic import, `onUnhandledRequest:'bypass'`).
4. Karar matrisi belgele: dev+mock / dev+real / test(MSW zorunlu) / prod(real).

### M4 — Cross-platform veri sozlesmesi (REQ-API-004, REQ-API-005)
1. `SampleItem` tipi + sample data-access contract'i `packages/core`'a tasi.
2. Query-key factory + ADR-005 staleTime SABITLERI (Bolum 45) `packages/core`'a; web `hooks.ts:8` `QUERY_KEY` buradan okur.
3. Mobil `ListScreen.tsx:5-17` duplicate `SampleItem` + inline mock KALDIR; sozlesmeden oku (ekran portu SPEC-UI-001).
4. Mobil mock: core client'a injectable `fetch`; `packages/core/mocks/fixtures` paylas.

### M5 — Enforcement (REQ-API-001, REQ-API-002)
1. `eslint-plugin-bp`: `no-raw-fetch-in-component` kurali (feature/screen icinde `fetch` yasak).
2. Contract-test: MSW handler response'lari Zod schema'ya uyumlu mu (CI).

## Milestone Sirasi (oncelik bazli, sure tahmini yok)

- **Oncelik 1 (cekirdek)**: M1 -> M2 (transport + handler hazir olmadan digerleri anlamsiz).
- **Oncelik 2 (kopru)**: M3 (mock-to-real, dev deneyimi).
- **Oncelik 3 (paylasim)**: M4 (cross-platform sozlesme; mobil ekran portu UI'yi bekler).
- **Oncelik 4 (koruma)**: M5 (erozyon onleme).

## Riskler ve Azaltma

| Risk | Azaltma |
|------|---------|
| In-memory mock mutasyonu gercek API'ye gecişte server-persistence bug'larini maskeler (mevcut `@MX:WARN`) | MSW handler'lar deterministik fixture-tabanli; mutation handler-scope; test `resetHandlers`. `mockItems` modul-state'i tamamen kaldir |
| RN'de MSW-native interception olgun degil; mobil sessizce gercek network'e duser | Mobil core-client injectable fetch; paylasilan fixture. MSW-native opsiyonu ayri POC; riskli ise M4'ten cikar |
| Env bayragi disiplini bozulursa prod'a mock worker sizar (guvenlik) | `worker.start()` yalnizca `DEV && enabled`; dynamic import (tree-shake); CI build'de bayrak asla enabled; lint/test dogrular |
| M4 `packages/core`'a UI/transport kaciragi (auth/types.ts "provider SDK YASAK" kurali) | core'a yalnizca platform-agnostik tip + fetch fn + query-key/staleTime sabit; `setupWorker`/`setupServer` apps icinde kalir; boundary-check |
| Query-options factory erken soyutlama (tek feature) | Once minimal: sample + auth query-key; staleTime sabit modul; tam factory ikinci feature'a ertele |
| Uc ortam (browser/test/storybook) handler lifecycle drift | Tek `handlers.ts`, her ortam import eder; CI ayni handler tuketimini dogrular |

## Reference (dosya:satir)

- `packages/core/src/api/client.ts:35` `createApiClient` (fan_in=0); `:6` `@MX:TODO` test yok; `:19` `RETRYABLE_METHODS` invariant.
- `packages/core/src/api/types.ts:42-52` `ApiError`.
- `packages/core/src/index.ts:15-16` `createApiClient` re-export.
- `apps/web/src/features/sample/api.ts:5-27` `INITIAL_ITEMS`; `:34` `let mockItems`; `:55-56` `@MX:WARN`; `:66` `push`.
- `apps/web/src/features/sample/hooks.ts:8` `QUERY_KEY` sabit (factory degil); `:8-41` tuketici boundary.
- `apps/web/src/features/sample/types.ts:2-8` web `SampleItem`.
- `apps/web/src/auth/session.ts:14-35` `checkSession` `@MX:ANCHOR` boundary; `:16`,`:45` ham fetch.
- `apps/web/vite.config.ts:13-15` proxy yok.
- `apps/web/src/App.tsx:18-25` QueryClient sabit `staleTime:60000,retry:1`.
- `apps/mobile/src/screens/sample/ListScreen.tsx:5-17` duplicate `SampleItem` + inline mock.
- `docs/adr/ADR-005-...md` Bolum 11 (raw fetch dagilmaz), Bolum 16 (invalidation), Bolum 45 (staleTime tablosu).
- `pnpm-lock.yaml:2280` `msw: ^2.4.9` — yalnizca `@vitest/mocker` opsiyonel peer-dep; gercek kurulum YOK (node_modules dogrulandi).

## MX Tag Plani

- `packages/core/src/api/client.ts:6` `@MX:TODO` (test yok) -> test eklenince **KALDIR**.
- `apps/web/src/features/sample/api.ts:55-56` `@MX:WARN` (mockItems mutasyon) -> in-memory mock kaldirilinca **KALDIR**.
- `apps/web/src/auth/session.ts:12-13` `@MX:ANCHOR` (checkSession boundary) -> KORU; transport core client'a tasininca `@MX:REASON` guncellenir (fan_in degisirse).
- Core'a tasinan query-key factory + app-level client singleton -> yeni exported fonksiyonlar fan_in artacagindan `@MX:ANCHOR` adayi (M4 sonrasi degerlendir).
- `apps/web/src/App.tsx:39` Provider root `@MX:ANCHOR` -> DOKUNULMAZ (bu SPEC provider zincirini degistirmez).
