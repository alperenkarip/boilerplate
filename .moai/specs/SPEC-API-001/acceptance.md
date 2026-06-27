# SPEC-API-001 — Acceptance Criteria

> Given-When-Then senaryolari (gozlemlenebilir kanit). Min 4 senaryo, edge case ve kalite kapisi.

## Senaryo 1 — Ortak HTTP client wire + test (REQ-API-001)

**Given** `packages/core` icinde `createApiClient` mevcut ve `apps/web/src/auth/session.ts` ile `sample/api.ts` ham fetch / in-memory mock kullaniyor,
**When** veri katmani bu SPEC ile canlandirilir,
**Then**:
- `apps/` icinde `createApiClient` `fan_in >= 1` (en az `session.ts` + `sample/api.ts` tuketir; `grep createApiClient apps/` bos donmez).
- `apps/web/src/auth/session.ts` ve `apps/web/src/features/sample/api.ts` icinde dogrudan `fetch(` cagrisi KALMAZ (`grep -n "fetch(" apps/web/src/auth apps/web/src/features/sample` -> sifir).
- `createApiClient` test dosyasi mevcut ve gecer; retry/timeout/abort/401-callback/5xx-vs-4xx/POST-no-retry senaryolarini kapsar.
- `client.ts:6` `@MX:TODO: No test file` tagi KALDIRILMIS.

## Senaryo 2 — MSW deterministik mock (web + test) (REQ-API-002, REQ-API-003)

**Given** projede MSW kurulu degil ve `public/mockServiceWorker.js` yok,
**When** MSW gomulu mock backend eklenir ve dev server `VITE_API_MOCKING=enabled` ile baslar,
**Then**:
- Tek `src/mocks/handlers.ts` modulu hem `browser.ts` (setupWorker) hem `server.ts` (setupServer) tarafindan import edilir (tek kaynak).
- Handler seti `/api/auth/me|login|logout|register` + sample CRUD (GET liste, GET :id, POST, PUT, DELETE) kapsar.
- `apps/web/public/mockServiceWorker.js` mevcut.
- Vitest calistiginda backend olmadan testler deterministik gecer (`setupServer` `beforeAll/afterEach(resetHandlers)/afterAll` lifecycle aktif).
- Fixture'lar basari / bos liste / 401 / 500 / gecikmeli senaryolarini saglar (loading/error/empty UI state'leri tetiklenebilir).

## Senaryo 3 — Mock-to-real gecişte tuketici hook DEGISMEZ (REQ-API-005)

**Given** `sample/hooks.ts` (`useSampleItems`/`useSampleItem`/`useCreateSampleItem`) ve `session.ts` `checkSession` `{status,userId}` boundary'si tuketiciler tarafindan kullaniliyor,
**When** mock katmani gercek backend ile degistirilir (`VITE_API_MOCKING=disabled`, `/api` -> `VITE_API_BASE_URL` proxy),
**Then**:
- `sample/hooks.ts` icindeki hicbir hook imzasi/govdesi degismez (yalnizca altindaki `api.ts` transport binding'i degisir).
- `checkSession` return-shape `{status: AuthStatus, userId: string | null}` AYNEN korunur; 401->`unauthenticated`, diger->`expired`, network-hatasi->`expired` (recoverable) mapping bozulmaz.
- `git diff` ile dogrulandiginda mock<->real gecisi yalnizca env bayragi + transport binding noktasinda degisiklik gosterir; consumer katmaninda sifir degisiklik.

## Senaryo 4 — Cross-platform tek veri sozlesmesi (REQ-API-004)

**Given** mobil `apps/mobile/src/screens/sample/ListScreen.tsx:5-17` kendi duplicate `SampleItem` tipini + inline mock dizisini tasiyor,
**When** veri sozlesmesi `packages/core`'a tasinir,
**Then**:
- `SampleItem` tipi + query-key factory + ADR-005 staleTime sabitleri `packages/core`'dan export edilir.
- Mobil ekranlardaki duplicate `interface SampleItem` ve inline `mockItems` KALDIRILMIS (`grep -n "interface SampleItem\|const mockItems" apps/mobile/src/screens/sample` -> sifir).
- Web ve mobil AYNI `SampleItem` tipini ve query-key'i `@project/core`'dan tuketir.
- Mobil mock, core client'a injectable `fetch` ile AYNI `packages/core/mocks/fixtures` data modulunu paylasir (MSW-native bagimliligi yok).
- `packages/core`'a UI / `setupWorker` / `setupServer` / auth-provider-SDK import'u sizmaz (platform-spesifik setup `apps/` icinde kalir).

## Edge Case'ler

- **POST retry yapilmamali**: Non-idempotent POST'ta `createApiClient` auto-retry yapmaz (`RETRYABLE_METHODS` invariant; test ile dogrulanir).
- **Prod'a mock sizmasi**: Production build'de `VITE_API_MOCKING=enabled` olsa bile `import.meta.env.DEV` false oldugundan worker baslamaz; `mockServiceWorker.js` dynamic import ile tree-shake edilir.
- **Bos liste vs hata ayrimi**: `GET /api/sample` bos dizi dondurdugunde (200 + `[]`) bu "empty" state'tir, error degil (ADR-005 Bolum 21); 500 ile karistirilmaz.
- **Network-hatasi != logout**: `checkSession` network/offline hatasinda `expired` (recoverable) doner, kullaniciyi login'e zorlamaz (mevcut davranis korunur).
- **Mutation sonrasi invalidation**: `useCreateSampleItem` basarisinda `sample-items` query-key invalidate edilir (ADR-005 Bolum 16); test ile dogrulanir.
- **Handler lifecycle drift**: Her test `afterEach(resetHandlers)` ile izole; mutation state testler arasi sizmaz.

## Kalite Kapisi (Quality Gate)

- [ ] `createApiClient` test coverage esigi karsilanir; tum dallar (retry/timeout/abort/401/5xx/4xx/POST) test edilir.
- [ ] `no-raw-fetch-in-component` lint kurali aktif; feature/screen icinde ham fetch CI'da error verir.
- [ ] MSW handler contract-test: tum handler response'lari ilgili Zod schema'ya uyumlu (CI).
- [ ] `pnpm typecheck` ve `pnpm lint` sifir hata.
- [ ] Mock<->real gecis matrisi (dev+mock / dev+real / test / prod) belgeli.

## Definition of Done

- 5 modul (M1-M5) tamamlandi; 5 REQ acceptance senaryolariyla dogrulandi.
- `createApiClient` `fan_in >= 1`; iki ham fetch noktasi (session + sample) core client'a tasindi.
- MSW tek-kaynak handler seti web + test'te calisir; fixture'lar 5 senaryoyu kapsar.
- `VITE_API_MOCKING` bayragi ile mock-to-real kopru calisir; prod'a mock sizma testle engellendi.
- Cross-platform veri sozlesmesi `packages/core`'da; mobil duplicate kaldirildi.
- Ilgili `@MX:TODO` ve `@MX:WARN` tagleri kaldirildi; boundary `@MX:ANCHOR` korundu.
- Kapsam disi maddeler (gercek backend, AuthProvider, mobil ekran UI portu, env semasi) bu SPEC'te EL DEGMEDEN birakildi.
