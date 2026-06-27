# SPEC-API-001 (Compact) — Backend-agnostik veri katmani

P0 | Faz 2 | deps: SPEC-MOBILE-001 | BROWNFIELD

## REQ Ozeti

- **REQ-API-001** (Ubiquitous): Tum HTTP veri erisimi `packages/core` `createApiClient` uzerinden; feature/screen icinde ham `fetch` YASAK (ADR-005 §11/§32).
- **REQ-API-002** (Ubiquitous): Tek paylasilan `handlers` modulu — browser/test/Storybook tek kaynak; `/api/auth/*` + sample CRUD.
- **REQ-API-003** (Event+State): `VITE_API_MOCKING=enabled` -> MSW worker `/api/*` intercept; disabled -> Vite proxy `/api` -> `VITE_API_BASE_URL`.
- **REQ-API-004** (Optional): RN (Expo) -> core-client injectable fetch + AYNI fixture modulu; web+mobil AYNI `SampleItem` + query-key (`packages/core`).
- **REQ-API-005** (Unwanted): Mock->real gecişte consumer hook + `checkSession {status,userId}` boundary DEGISMEZ; POST auto-retry YOK.

## Acceptance (ozet)

1. `createApiClient` `fan_in>=1`; `session.ts` + `sample/api.ts` ham fetch sifir; client test gecer; `@MX:TODO` kalkar.
2. Tek `handlers.ts` browser+server import; `mockServiceWorker.js` var; vitest backend'siz deterministik; 5 fixture (basari/bos/401/500/gecikme).
3. Mock->real gecis yalnizca env+transport noktasinda degisir; hook + checkSession boundary AYNEN; POST retry yok.
4. `SampleItem`+query-key+staleTime `packages/core`'dan; mobil duplicate kalkar; core'a UI/setup/SDK sizmaz.

## Degisecek Dosyalar

- `packages/core/src/api/client.ts` — test ekle (`:6` `@MX:TODO` kapat); kod degismez.
- `packages/core/src/api/client.test.ts` — YENI.
- `packages/core/src/index.ts` — `SampleItem` + query-key factory + staleTime export.
- `packages/core/mocks/fixtures/` — YENI (paylasilan fixture data).
- `apps/web/src/auth/session.ts` — ham fetch (`:16`,`:45`) -> core client; `{status,userId}` korunur.
- `apps/web/src/features/sample/api.ts` — `mockItems` (`:34`,`:66`) kaldir -> core client `/api/sample`.
- `apps/web/src/features/sample/hooks.ts` — `QUERY_KEY` (`:8`) core factory'den okur; imza degismez.
- `apps/web/src/features/sample/types.ts` — `SampleItem` core'a tasinir (re-export).
- `apps/web/src/api/client.ts` — YENI app-level singleton (baseURL env'den).
- `apps/web/src/mocks/{handlers,browser,server}.ts` — YENI.
- `apps/web/public/mockServiceWorker.js` — YENI (`npx msw init`).
- `apps/web/vite.config.ts` (`:13-15`) — `server.proxy` ekle.
- `apps/web/src/main.tsx` — kosullu `worker.start()`.
- `apps/web/.env.example` + `vite-env.d.ts` — `VITE_API_BASE_URL` + `VITE_API_MOCKING` tip.
- `apps/web/src/test/setup.ts` — `setupServer` lifecycle.
- `apps/mobile/src/screens/sample/ListScreen.tsx` (`:5-17`) — duplicate `SampleItem` + inline mock kaldir.
- `pnpm-workspace.yaml` — `msw` catalog.
- `packages/eslint-plugin-bp/src/rules/no-raw-fetch-in-component.*` — YENI.

## Kapsam Disi

- Gercek backend impl (boilerplate "kendi backend'ini getir").
- AuthProvider / auth state machine / route guard / form canlandirma (SPEC-AUTH-001).
- Query-options factory tam soyutlama (erken soyutlama; sadece query-key + staleTime sabit).
- Mobil ekran UI portu (`onClick`->`onPress`, RN render) (SPEC-UI-001).
- Env validation semasi (t3-env) (SPEC-DEPLOY-001) — sadece wire-up noktasi burada.
- MSW-native (RN) production yolu (ayri POC).
