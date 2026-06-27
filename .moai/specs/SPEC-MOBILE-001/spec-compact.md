# SPEC-MOBILE-001 (Compact)

P0 | Faz 1 | deps: yok | ADR-018 (New Architecture) uyumlu

## Gereksinimler (REQ)

### Build Config
- **REQ-BUILD-001**: `babel.config.js` = `babel-preset-expo` + `react-native-worklets/plugin` (EN SON) + `api.cache(true)`.
- **REQ-BUILD-002**: `metro.config.js` = `expo/metro-config` `getDefaultConfig(__dirname)` + pnpm `watchFolders`/`nodeModulesPaths`.
- **REQ-BUILD-003**: WHEN `npx expo start --clear` -> Metro bundle worklet/resolution hatasi olmadan basarili.
- **REQ-BUILD-004**: IF reanimated 4.x THEN `react-native-worklets/plugin` (eski `react-native-reanimated/plugin` DEGIL).

### Asset
- **REQ-ASSET-001**: WHERE app.json asset referansi -> `icon.png`/`splash.png`/`adaptive-icon.png` placeholder mevcut, prebuild hatasiz.
- **REQ-ASSET-002**: IF app.json placeholder (YOUR_PROJECT_ID/example.com) THEN derive-time TODO, local boot bloklamaz.

### Bootstrap
- **REQ-BOOT-001**: WHEN entry mount -> `initSentry()` -> `await initEncryptedStorage()` -> `setupOfflineQueue(queryClient)` (interaktif render oncesi).
- **REQ-BOOT-002**: WHILE encrypted MMKV init degil -> safe no-op; init sonrasi yazimlar persist (veri kaybi yok).
- **REQ-BOOT-003**: WHERE gesture-handler dep -> `GestureHandlerRootView` root sarma + import en ustte.
- **REQ-BOOT-004**: Her native paket package.json'da declared (`expo-constants` dahil — su an eksik).
- **REQ-BOOT-005**: IF `initEncryptedStorage()` reject THEN orchestrator catch eder, yari-init state olmaz.

### Native Sinir
- **REQ-NATIVE-001**: WHILE native paket (Sentry/push/IAP/netinfo) kurulu degil -> documented no-op abstraction + "not installed" isareti (sentry.ts conditional-require deseni).
- **REQ-NATIVE-002**: WHERE netinfo yok -> `navigator.onLine` fallback aktif; aktivasyon noktasi conditional-require (yorum-stub degil).
- **REQ-NATIVE-003**: IF yeni native dep THEN reactnativepackagedb + expo-doctor ile NewArch uyum dogrula (ADR-018 11.5).

### Dogrulama Kapisi
- **REQ-GATE-001**: WHEN `npx expo-doctor` -> sifir NewArch uyumsuzluk hatasi (ADR-018 14.1.1).
- **REQ-GATE-002**: WHEN dev build -> `global.HermesInternal !== undefined` dogrulanir (ADR-018 14.1.4).
- **REQ-GATE-003**: IF gate basarisiz (doctor/crash/Hermes) THEN mobil temel "hazir" sayilmaz (ADR-018 14.2).
- **REQ-GATE-004**: WHERE smoke test setup -> `src/test/setup.ts` (matchers + native mock) + >=1 smoke test; `--passWithNoTests` maskelemesi kalkar.

## Acceptance (ozet)

1. `npx expo start --clear` bundling success + `expo install --check` uyum (REQ-BUILD).
2. Entry mount init sekansi calisir; init sonrasi encryptedStorage persist eder (REQ-BOOT-001/002/004).
3. `App.tsx` `GestureHandlerRootView` sariyor, import en ustte (REQ-BOOT-003).
4. `pnpm --filter @project/mobile test` >=1 gercek test gecer (REQ-GATE-004).
5. `npx expo-doctor` temiz + `global.HermesInternal` true (REQ-GATE-001/002/003).
6. 3 asset placeholder mevcut, cozumleme hatasiz (REQ-ASSET-001).

Edge: init reject -> catch (EC-1); netinfo yok -> navigator.onLine (EC-2); plugin eski ad -> kabul edilmez (EC-3); Sentry yok -> no-op (EC-4); app.json placeholder boot bloklamaz (EC-5).

## Degisecek Dosyalar

| Dosya | Delta | Not |
|-------|-------|-----|
| `apps/mobile/babel.config.js` | NEW | worklets plugin EN SON + api.cache(true) |
| `apps/mobile/metro.config.js` | NEW | expo/metro-config + pnpm watchFolders; NativeWind genisletme yorum-noktasi |
| `apps/mobile/assets/icon.png`, `splash.png`, `adaptive-icon.png` | NEW | placeholder (1024/1284x2778/1024) |
| `apps/mobile/src/bootstrap.ts` | NEW | init orchestrator + try/catch guard |
| `apps/mobile/src/test/setup.ts` | NEW | matchers + native mock (jest.config.js:10 referansi) |
| `apps/mobile/src/**/*.test.tsx` | NEW | >=1 smoke test |
| `apps/mobile/src/App.tsx` | MODIFY | bootstrap cagri + GestureHandlerRootView sarma |
| `apps/mobile/package.json` | MODIFY | `expo-constants` dependency ekle |
| `apps/mobile/src/state/offlineQueue.ts` | MODIFY | netinfo yorum-stub -> conditional-require sinir isareti |
| `apps/mobile/jest.config.js` | EXISTING | setup.ts referansi (satir 10) korunur |
| `apps/mobile/app.json` | EXISTING | asset referanslari korunur; placeholder derive-time TODO |
| `apps/mobile/src/observability/sentry.ts` | EXISTING | conditional-require altin deseni (kanonik referans) |
| `apps/mobile/src/storage/mmkv.ts` | EXISTING | initEncryptedStorage + no-op guard (referans) |
| `apps/mobile/src/navigation/AppNavigator.tsx` | EXISTING | deep-link literal (satir 192) sadece belgelenir, turetme INFRA'da |

## Kapsam Disi

- 27 ekran RN portu (onClick->onPress, .native/.web split) -> SPEC-UI-001.
- `@project/ui` cross-platform donusumu -> SPEC-UI-001 (ekranlar bu SPEC ile render edilemez).
- NativeWind v5 production (PDR-001 ertelendi; sadece metro yorum-noktasi).
- Magaza submit / EAS production build (app.json placeholder derive-time).
- Auth wiring (AuthProvider/guard/form/biometric) -> SPEC-AUTH-001.
- Veri katmani / HTTP client / MSW -> SPEC-API-001.
- Deep-link literal turetme (AppNavigator.tsx:192 src/ tarama) -> SPEC-INFRA-DERIVE-001.
- CI expo-doctor gate gevsetme (ci.yml:119) -> enforcement temasi.
- Mobil coverage threshold enforcement -> SPEC-TEST-001.
