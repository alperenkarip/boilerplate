# SPEC-MOBILE-001 — Uygulama Plani

İlgili SPEC: `spec.md` (SPEC-MOBILE-001, P0, Faz 1, deps: yok)

## Teknoloji ve Surumler

| Bilesen | Surum / Kaynak | Kanit |
|---------|----------------|-------|
| Expo SDK | `~55.0.0` | `apps/mobile/package.json:18` |
| react-native | catalog `~0.83.0` | `pnpm-workspace.yaml:25` |
| react-native-reanimated | catalog `^4.0.0` (Reanimated 4 hatti) | `pnpm-workspace.yaml:32` |
| react-native-worklets | `0.7.2` (pinli) | `apps/mobile/package.json:31` |
| react-native-gesture-handler | catalog `~2.30.1` | `pnpm-workspace.yaml:26`, dep `package.json:26` |
| @sentry/react-native | catalog `^10.0.0` (mobile dep DEGIL) | `pnpm-workspace.yaml:10` |
| Jest | `^29.7.0` + `jest-expo ^55.0.13` | `package.json:37-38` |
| New Architecture | acik (Fabric/JSI/TurboModules/Hermes V1) | `app.json:26-27`, ADR-018 |
| Paket yoneticisi | pnpm 10 workspace + Turborepo 2 | proje koku |

**Surum riski (research):** worklets `0.7.2` pinli ile reanimated `^4.0.0` katalog araligi minor-mismatch yaratabilir. babel config olusturulurken `npx expo install --check` ile uyum dogrulanmali; gerekirse worklets de catalog'a tasinmali.

## Gorev Decomposition (oncelik sirali, sure tahmini yok)

Research branch'leri B1-B6 ile hizali. Faz ici sira:

### Oncelik 1 — Build Config (REQ-BUILD-001..004)
- `apps/mobile/babel.config.js` olustur: `babel-preset-expo` preset + `react-native-worklets/plugin` EN SON + `api.cache(true)`.
- `apps/mobile/metro.config.js` olustur: `expo/metro-config` `getDefaultConfig(__dirname)` + pnpm monorepo `watchFolders` (workspace root) + `nodeModulesPaths`. NativeWind genisletme noktasi icin yorum birak (aktif sarma yok).
- Dogrula: `npx expo start --clear` -> bundling success; `npx expo install --check` -> reanimated/worklets uyum.

### Oncelik 2 — Asset Placeholder (REQ-ASSET-001..002)
- `assets/icon.png` (1024x1024), `splash.png` (1284x2778), `adaptive-icon.png` (1024x1024) placeholder gorseller ekle.
- `app.json` referanslarini dogrula; placeholder degerleri (`updates.url`, `associatedDomains`) derive-time TODO olarak isaretle.

### Oncelik 3 — Bootstrap Orkestrasyon (REQ-BOOT-001..005)
- `apps/mobile/src/bootstrap.ts` olustur: `initSentry()` -> `await initEncryptedStorage()` -> `setupOfflineQueue(queryClient)`; try/catch guard (REQ-BOOT-005).
- `App.tsx`'i `GestureHandlerRootView` ile sar; `react-native-gesture-handler` import en uste.
- `App.tsx` entry mount'ta bootstrap sekansini cagir (SplashScreen.preventAutoHideAsync deseni ile interaktif render oncesi).
- `package.json` dependencies'e `expo-constants` ekle.

### Oncelik 4 — Native Sinir Netlestirme (REQ-NATIVE-001..003)
- `offlineQueue.ts:23-31` netinfo yorum-stub'ini conditional-require sinir isaretine cevir (sentry.ts deseni); `navigator.onLine` fallback aktif kalir.
- Native entegrasyonlar icin "kurulu / kurulu-degil + no-op abstraction" kararini belgele (Sentry: catalog'da ama mobile dep degil; push/IAP: yok; netinfo: yok).

### Oncelik 5 — Dogrulama Kapisi + Test (REQ-GATE-001..004)
- `src/test/setup.ts` olustur: `@testing-library/react-native` matchers + mock (expo-secure-store, react-native-mmkv, expo-local-authentication).
- En az 1 smoke test (App render veya bootstrap fonksiyon testi) ki `--passWithNoTests` maskelemesi kalksin.
- Hermes dogrulamasi: `global.HermesInternal !== undefined` dev-time kontrol (ADR-018 14.1.4).
- `npx expo-doctor` temiz cikti dogrula (lokal komut seviyesinde; CI gate disi).

## Referans Implementasyonlar

- **Conditional-require + no-op altin deseni**: `apps/mobile/src/observability/sentry.ts:167-180` (`loadSentry` cache + `loadAttempted`), `analytics.ts` noopAdapter. Native sinir netlestirmesinin (REQ-NATIVE-001/002) kanonik kaynagi.
- **Lazy async init + singleton guard**: `apps/mobile/src/storage/mmkv.ts:90-106` (`initEncryptedStorage`, `encryptedMMKV` guard). Bootstrap'ta await edilecek deserin referansi (REQ-BOOT-001/002).
- **Sessiz no-op davranisi**: `apps/mobile/src/storage/mmkv.ts:118-134` (init oncesi setItem `return;`). REQ-BOOT-002 "init sonrasi veri kaybi yok" kriterinin kaynagi.
- **Navigator wrapper adapteri**: `apps/mobile/src/navigation/AppNavigator.tsx:64-104`. UI port sonrasi korunacak desen; deep-link literal de bu dosyada (`AppNavigator.tsx:192`).
- **Default Expo babel/metro sablonu**: context7 `/websites/expo_dev_versions_v55_0_0` (babel-preset-expo + `expo/metro-config` getDefaultConfig) + `/software-mansion/react-native-reanimated` (worklets plugin EN SON). REQ-BUILD-001/002 kaynagi.
- **ADR-018 bootstrap dogrulama kapisi**: `docs/adr/ADR-018-...:711-763` (bolum 14). REQ-GATE-001..003 birebir kaynagi.

## Risk + Azaltma

| Risk | Etki | Azaltma |
|------|------|---------|
| `@project/ui` web-only -> ekranlar Hermes'te crash | Bu SPEC tek basina calisan app uretmez | SPEC-UI-001'e SERT bagimlilik isaretlendi; bu SPEC "Metro boot + dogrulama" garanti eder, "ekran render" UI'a devredilir |
| worklets `0.7.2` ↔ reanimated `^4.0.0` minor-mismatch | babel plugin sessiz kirilir | `npx expo install --check` + expo-doctor; gerekirse worklets catalog'a tasi |
| pnpm 10 hoisting + Metro symlink | workspace paketleri transform edilmeden kalir | metro.config'e workspace root `watchFolders` + `nodeModulesPaths`; `unstable_enableSymlinks` kontrol |
| `initEncryptedStorage` await edilmezse | encrypted storage sessiz no-op, veri kaybi (`mmkv.ts:126`) | orchestrator'da `await` + SplashScreen ile esle; `mmkv.ts:84-85` @MX:WARN'i try/catch guard |
| `app.json` placeholder ile prebuild | EAS build/submit hatasi | placeholder'lari "derive-time doldur" isaretle; magaza submit kapsam disi, sadece local boot garantili |
| expo-doctor CI gate'li (`ci.yml:119`) | upstream'de babel/metro/dep regresyonu yakalanmaz | gate gevsetme governance/enforcement temasina devredildi; bu SPEC lokal komut dogrulamasi yapar |

## MX Tag Plani

- **`bootstrap.ts` orchestrator** (yeni, App mount'tan cagrilir, fan_in artar): `@MX:ANCHOR` — init sekansi invariant'i (initSentry -> await initEncryptedStorage -> setupOfflineQueue sirasi). `@MX:REASON`: sira bozulursa encrypted storage no-op kalir.
- **`bootstrap.ts` try/catch guard**: `@MX:WARN` — SecureStore rejection yutulursa yari-init state. `@MX:REASON`: `mmkv.ts:84-85` unhandled-rejection riski.
- **`offlineQueue.ts` netinfo sinir noktasi**: `@MX:NOTE` — conditional-require aktivasyon noktasi (kurulu degil isareti).
- **`App.tsx` GestureHandlerRootView sarma**: `@MX:NOTE` — import sirasi (gesture-handler en ustte) invariant'i.
- **Korunan mevcut tag'ler**: `sentry.ts:2` @MX:ANCHOR (observability entrypoint), `mmkv.ts:84-85` @MX:WARN korunur/guncellenir.

## Tamamlama Kriteri (DoD ozet)

- `babel.config.js` + `metro.config.js` mevcut; `npx expo start --clear` bundling success.
- 3 asset placeholder mevcut; `app.json` referans hatasi yok.
- `App.tsx` bootstrap sekansini cagiriyor; `GestureHandlerRootView` sariyor; `expo-constants` declared.
- `offlineQueue` netinfo sinir noktasi conditional-require deseninde.
- `src/test/setup.ts` + >=1 smoke test; `pnpm --filter @project/mobile test` gercek test calistiriyor.
- `npx expo-doctor` temiz; `global.HermesInternal` dev-time dogrulamasi wire.
- Detayli kabul: `acceptance.md`.
