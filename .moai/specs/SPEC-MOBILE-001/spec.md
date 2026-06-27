---
id: SPEC-MOBILE-001
version: 0.1.0
status: draft
created: 2026-06-05
updated: 2026-06-05
author: alp
priority: P0
issue_number: 0
---

# SPEC-MOBILE-001 — Mobil Runtime Bootstrap

## HISTORY

- 2026-06-05 (v0.1.0): Ilk taslak. velocity-remediation-roadmap.md + mobile-runtime-bootstrap research temasi + gercek kod dogrulamasi (apps/mobile) temel alindi. Yol B cross-platform karari ve ADR-018 (New Architecture) ile hizalandi.

---

## Overview

Bu SPEC, `apps/mobile` Expo SDK 55 uygulamasinin **runtime bootstrap** katmanini canlandirir. Su an mobil app **Metro bundle dahi uretemez** cunku `babel.config.js` ve `metro.config.js` tamamen yoktur; bunlar olmadan Reanimated 4 worklet'leri kirilir ve pnpm monorepo symlink cozumlemesi yapilamaz.

Ek olarak uretim kalitesinde yazilmis ama hicbir yerden cagrilmayan (fan_in=0) uc bootstrap fonksiyonu vardir: `initSentry`, `initEncryptedStorage`, `setupOfflineQueue`. Encrypted MMKV init edilmediginden tum sifreli kalici depolama yazimlari sessizce no-op olur (`mmkv.ts:126`). `assets/` dizini sadece `.gitkeep` icerir ama `app.json` icon/splash/adaptive-icon referanslari verir (olu referans). `jest.config.js:10` var olmayan `./src/test/setup.ts` dosyasina isaret eder.

Bu SPEC, bu temel katmani kurar: build config dosyalari, asset placeholder seti, bootstrap orkestrasyonu, native entegrasyon sinirlarinin "kurulu / kurulu-degil + no-op abstraction" karariyla netlestirilmesi, ve ADR-018 bootstrap dogrulama kapisi (expo-doctor + Hermes). Amac time-to-product: mobil iskeletin **Metro boot eden, dogrulanabilir** bir tabana oturmasi.

**Bagimlilik notu:** Bu SPEC bagimsizdir (deps: yok) ve Faz 1'de uretilir. Ancak `@project/ui` su an %100 web-only (Pressable = `<button>`, 0 adet `.native`/`.web` split) oldugundan, bu SPEC tamamlansa bile **ekranlar Hermes'te render edilemez**. Bu SPEC yalniz "Metro boot + bootstrap orkestrasyonu + dogrulama altyapisi" garantisi verir; "ekranlar crash etmeden render eder" kriteri SPEC-UI-001'e devredilir. SPEC-UI-001 bu SPEC'e bagimlidir.

**ADR-018 uyumu:** app.json zaten New Architecture'i acmistir (`newArchEnabled: true`, ios+android, `app.json:26-27`). Bu SPEC New Architecture'i (Fabric, JSI, TurboModules, Hermes V1) tek desteklenen mobil runtime kabul eder ve ADR-018 bolum 14 bootstrap dogrulama kapisini somutlastirir.

### Delta Markeri Aciklamasi (BROWNFIELD)

- `[EXISTING]`: Mevcut, degismeyecek (referans/baglam).
- `[MODIFY]`: Mevcut dosya degisecek.
- `[NEW]`: Yeni olusturulacak dosya/yapi.
- `[REMOVE]`: Kaldirilacak/temizlenecek.

---

## Requirements (EARS)

Modul sayisi: 5. REQ numaralandirmasi modul bazlidir.

### Modul 1 — Build Config (babel + metro)

- **REQ-BUILD-001** (Ubiquitous): The system SHALL include a `babel.config.js` in `apps/mobile` using `babel-preset-expo` with `react-native-worklets/plugin` as the **last** plugin and `api.cache(true)` enabled.
  - `[NEW]` `apps/mobile/babel.config.js`
- **REQ-BUILD-002** (Ubiquitous): The system SHALL include a `metro.config.js` in `apps/mobile` extending `expo/metro-config` `getDefaultConfig(__dirname)`, with pnpm monorepo `watchFolders` and `nodeModulesPaths` configured so that `@project/ui` and `@project/design-tokens` resolve.
  - `[NEW]` `apps/mobile/metro.config.js`
- **REQ-BUILD-003** (Event-Driven): WHEN `npx expo start --clear` is run, the system SHALL produce a successful Metro bundle without worklet or module-resolution errors.
- **REQ-BUILD-004** (IF-THEN / Unwanted): IF `react-native-reanimated` is on the 4.x line (catalog `^4.0.0`, `pnpm-workspace.yaml:32`), THEN the babel config SHALL reference `react-native-worklets/plugin` and SHALL NOT reference the renamed `react-native-reanimated/plugin`.

### Modul 2 — Asset Placeholder Seti

- **REQ-ASSET-001** (WHERE): WHERE assets are referenced in `app.json` (`icon`, `splash.image`, `android.adaptiveIcon.foregroundImage`), the system SHALL provide `icon.png`, `splash.png` and `adaptive-icon.png` placeholder images under `apps/mobile/assets/` so that `expo prebuild` resolves assets without error.
  - `[NEW]` `apps/mobile/assets/icon.png`, `splash.png`, `adaptive-icon.png`
  - `[EXISTING]` `app.json:10-14,36,45` asset referanslari korunur.
- **REQ-ASSET-002** (IF-THEN / Unwanted): IF `app.json` contains placeholder values (`updates.url` = `YOUR_PROJECT_ID`, `associatedDomains` = `applinks:example.com`, intentFilter host = `example.com`), THEN the system SHALL mark these as derive-time TODO and SHALL NOT block local Metro boot on store-submit values (store submit kapsam disi).

### Modul 3 — Bootstrap Orkestrasyon

- **REQ-BOOT-001** (Event-Driven): WHEN the app entry point mounts, the system SHALL execute the bootstrap sequence `initSentry()` then `await initEncryptedStorage()` then `setupOfflineQueue(queryClient)` before rendering interactive screens.
  - `[MODIFY]` `apps/mobile/src/App.tsx`
  - `[NEW]` bootstrap orchestrator (orn. `apps/mobile/src/bootstrap.ts`)
  - `[EXISTING]` `initSentry` (`sentry.ts:209`), `initEncryptedStorage` (`mmkv.ts:90`), `setupOfflineQueue` (`offlineQueue.ts:22`) — su an fan_in=0.
- **REQ-BOOT-002** (State-Driven): WHILE the encrypted MMKV instance is not yet initialized, the system SHALL treat encrypted storage reads/writes as safe no-ops (`mmkv.ts:118-134`) and SHALL guarantee that after `initEncryptedStorage()` completes, subsequent writes persist (no silent data loss).
- **REQ-BOOT-003** (WHERE): WHERE `react-native-gesture-handler` is a dependency (`package.json:26`), the system SHALL wrap the app root in `GestureHandlerRootView` and SHALL import `react-native-gesture-handler` at the top of the entry module.
  - `[MODIFY]` `apps/mobile/src/App.tsx`
- **REQ-BOOT-004** (Ubiquitous): The system SHALL declare every imported native package in `apps/mobile/package.json` dependencies, including `expo-constants` (required by `sentry.ts:192` `require('expo-constants')` but currently missing).
  - `[MODIFY]` `apps/mobile/package.json`
- **REQ-BOOT-005** (IF-THEN / Unwanted): IF `initEncryptedStorage()` rejects (SecureStore failure, `mmkv.ts:84-85` @MX:WARN unhandled-rejection riski), THEN the orchestrator SHALL catch the rejection and SHALL NOT leave the app in a half-initialized interactive state.

### Modul 4 — Native Entegrasyon Sinir Netlestirme

- **REQ-NATIVE-001** (State-Driven): WHILE a native integration package (Sentry, push, IAP, netinfo) is not installed, the system SHALL operate via a documented no-op abstraction with a clear "not installed" signal, following the canonical conditional-require pattern in `sentry.ts:167-180` (`loadSentry` cache + `loadAttempted`) and `analytics.ts` noop adapter.
  - `[EXISTING]` `sentry.ts` conditional-require altin deseni — kanonik kabul edilir.
- **REQ-NATIVE-002** (WHERE): WHERE `@react-native-community/netinfo` is not installed, the system SHALL keep the `navigator.onLine` web fallback active (`offlineQueue.ts:33-45`) and SHALL expose the netinfo activation point via the same conditional-require pattern rather than a commented-out stub.
  - `[MODIFY]` `apps/mobile/src/state/offlineQueue.ts` (yorum-stub `offlineQueue.ts:23-31` -> conditional-require sinir isareti)
- **REQ-NATIVE-003** (IF-THEN / Unwanted): IF a new native dependency is added, THEN the system SHALL verify New Architecture compatibility via reactnativepackagedb.com and `npx expo-doctor` before merge, per ADR-018 bolum 11.5; an unverified native package SHALL NOT pass review.

### Modul 5 — Bootstrap Dogrulama Kapisi (ADR-018)

- **REQ-GATE-001** (Event-Driven): WHEN `npx expo-doctor` is run, the system SHALL report zero New Architecture incompatibility errors (ADR-018 bolum 14.1.1, `ADR-018:717-729`).
- **REQ-GATE-002** (Event-Driven): WHEN the dev build starts, the system SHALL verify `global.HermesInternal !== undefined` (ADR-018 bolum 14.1.4, `ADR-018:752-756`) and surface a clear signal if Hermes is not active.
- **REQ-GATE-003** (IF-THEN / Unwanted): IF the bootstrap verification gate fails (expo-doctor errors, dev build crash, or `global.HermesInternal` undefined), THEN the system SHALL NOT consider the mobile foundation ready (ADR-018 bolum 14.2, `ADR-018:761-763`).
- **REQ-GATE-004** (WHERE): WHERE a smoke test setup is present, the system SHALL provide `src/test/setup.ts` loading `@testing-library/react-native` matchers and native module mocks (expo-secure-store, react-native-mmkv, expo-local-authentication), satisfying the existing `jest.config.js:10` `setupFilesAfterFramework` reference, plus at least one smoke test so that `--passWithNoTests` no longer masks an empty suite.
  - `[NEW]` `apps/mobile/src/test/setup.ts`
  - `[NEW]` en az 1 smoke test (`apps/mobile/src/**/*.test.tsx`)
  - `[EXISTING]` `jest.config.js:10` referansi korunur.

---

## Kapsam Disi (What NOT to Build)

- **27 ekran RN portu** (onClick -> onPress donusumu, `.native.tsx`/`.web.tsx` split) — SPEC-UI-001. Bu SPEC mobil boot'u saglar ama ekranlarin Hermes'te render edilmesi UI portuna baglidir (`apps/mobile/src` su an 22 dosyada `onClick`, 0 `onPress`).
- **`@project/ui` cross-platform donusumu** (Pressable -> RN primitive) — SPEC-UI-001.
- **NativeWind v5 production entegrasyonu** — ertelendi (PDR-001, JS-token fallback). `metro.config.js`'te yalnizca gelecek `withNativeWind` sarmasi icin genisletme noktasi (yorum) birakilir; aktif entegrasyon yapilmaz.
- **Magaza submit / EAS production build** — `app.json` placeholder degerleri (`updates.url`, `associatedDomains`, store credentials) derive-time'a birakilir; bu SPEC yalnizca LOCAL Metro boot'u garanti eder.
- **Auth wiring** (AuthProvider, route guard, form canlandirma, biometric akis) — SPEC-AUTH-001. `initEncryptedStorage` bootstrap'ta wire edilir ama auth is-mantigi baglanmaz.
- **Veri katmani / HTTP client / MSW** — SPEC-API-001.
- **Deep-link literal turetme** (`AppNavigator.tsx:192` `boilerplate://` hardcode) — bu literal'in `app.json` scheme'inden turetilmesi derive/governance temasi (SPEC-INFRA-DERIVE-001) sorumlulugundadir; bu SPEC sadece literal'in varligini ve riskini belgeler, src/ tarama mantigini yazmaz.
- **CI expo-doctor gate gevsetme** (`ci.yml:119` `bootstrap_ready == 'true'` gate'i nedeniyle boilerplate modunda atlanir) — enforcement/governance temasi (SPEC-TEST-001 / SPEC-INFRA-DERIVE-001). Bu SPEC dogrulamayi lokal/komut seviyesinde garanti eder, CI gate'ini degistirmez.
- **Mobil coverage threshold enforcement** — SPEC-TEST-001. Bu SPEC sadece test altyapisini (setup.ts + 1 smoke test) kurar.
