# SPEC-MOBILE-001 — Kabul Kriterleri

İlgili SPEC: `spec.md` | İlgili Plan: `plan.md`

Format: Given-When-Then. Tum senaryolar gozlemlenebilir kanit (komut ciktisi, dosya varligi, runtime kontrolu) ile dogrulanir.

---

## Senaryo 1 — Metro temiz boot (REQ-BUILD-001..004)

- **Given** `apps/mobile/babel.config.js` ve `apps/mobile/metro.config.js` mevcuttur; babel config'te `react-native-worklets/plugin` plugin listesinin EN SON elemanidir ve `api.cache(true)` aktiftir.
- **When** `npx expo start --clear` calistirilir (apps/mobile dizininde).
- **Then** Metro bundle worklet veya module-resolution hatasi olmadan basariyla uretilir; `@project/ui` ve `@project/design-tokens` workspace paketleri cozulur.
- **Kanit:** Metro "bundling success" ciktisi; `npx expo install --check` reanimated/worklets uyum onayi.

## Senaryo 2 — Bootstrap init sekansi calisir (REQ-BOOT-001/002/004)

- **Given** `App.tsx` entry mount'ta bootstrap orchestrator'i cagirir ve `expo-constants` `package.json` dependencies'tedir.
- **When** uygulama acilir (entry point mount).
- **Then** sira ile `initSentry()` -> `await initEncryptedStorage()` -> `setupOfflineQueue(queryClient)` calisir; init tamamlandiktan sonra `encryptedStorage.setItem` cagrisi gercekten persist eder (init oncesi sessiz no-op `mmkv.ts:126` davranisi init sonrasi kalkar).
- **Kanit:** smoke test bootstrap sekansini dogrular; init sonrasi yazilan deger okunabilir (`mmkv.ts:122` getString non-null doner).

## Senaryo 3 — GestureHandlerRootView root sarma (REQ-BOOT-003)

- **Given** `react-native-gesture-handler` dependency olarak vardir (`package.json:26`) ama su an `GestureHandlerRootView` HIC kullanilmaz (grep = 0 sonuc).
- **When** `App.tsx` render edilir.
- **Then** app agaci en dista `GestureHandlerRootView` ile sarilidir ve `react-native-gesture-handler` import'u entry modulunun en ust satirindadir.
- **Kanit:** `grep -n GestureHandlerRootView apps/mobile/src/App.tsx` >=1 sonuc; import sirasi en ustte.

## Senaryo 4 — Test altyapisi maskelemeyi kaldirir (REQ-GATE-004)

- **Given** `jest.config.js:10` `setupFilesAfterFramework: ['./src/test/setup.ts']` referans verir ama dosya su an YOKtur ve suite bostur (`--passWithNoTests` maskeler).
- **When** `pnpm --filter @project/mobile test` calistirilir.
- **Then** `src/test/setup.ts` yuklenir (testing-library matchers + native mock'lar) ve en az 1 gercek smoke test calisir/gecer; `--passWithNoTests` artik bos suite'i maskelemez.
- **Kanit:** jest ciktisi ">=1 passed" gosterir; `ls apps/mobile/src/test/setup.ts` mevcut.

## Senaryo 5 — ADR-018 dogrulama kapisi (REQ-GATE-001/002/003)

- **Given** New Architecture acik (`app.json:26-27`) ve ADR-018 bolum 14 dogrulama kapisi tanimlidir.
- **When** `npx expo-doctor` ve dev build calistirilir.
- **Then** expo-doctor sifir New Architecture uyumsuzluk hatasi raporlar VE `global.HermesInternal !== undefined` dev-time true doner; bu adimlardan biri basarisizsa mobil temel "hazir" sayilmaz.
- **Kanit:** expo-doctor temiz cikti; Hermes kontrolu true (ADR-018:752-756).

## Senaryo 6 — Asset cozumleme (REQ-ASSET-001)

- **Given** `assets/` su an sadece `.gitkeep` icerir ama `app.json` icon/splash/adaptive-icon referansi verir (olu referans).
- **When** asset placeholder'lari eklenir ve `expo prebuild` (veya asset cozumleme) calistirilir.
- **Then** `icon.png`, `splash.png`, `adaptive-icon.png` mevcuttur ve asset cozumleme hatasi olusmaz.
- **Kanit:** `ls apps/mobile/assets/` uc png dosyasini listeler; prebuild asset hatasi yok.

---

## Edge Case'ler

- **EC-1 (REQ-BOOT-005):** `initEncryptedStorage()` SecureStore hatasiyla reject ederse, orchestrator hatayi yakalar ve app yari-init interaktif state'e dusmez (`mmkv.ts:84-85` @MX:WARN). Beklenen: hata loglanir, app guvenli degrade eder, crash etmez.
- **EC-2 (REQ-NATIVE-002):** `@react-native-community/netinfo` kurulu degilken `navigator.onLine` fallback aktif kalir (`offlineQueue.ts:33-45`); netinfo kurulursa conditional-require ile devreye girer, yorum-stub'a geri donulmez.
- **EC-3 (REQ-BUILD-004):** babel config yanlislikla `react-native-reanimated/plugin` (eski ad) referans ederse worklet'ler sessiz kirilir — bu durum kabul edilmez; plugin adi `react-native-worklets/plugin` olmali.
- **EC-4 (REQ-NATIVE-001):** Sentry catalog'da (`^10.0.0`) ama mobile dep degil; `initSentry` DSN/paket yoksa guvenli no-op (`sentry.ts:212-227`), crash etmez.
- **EC-5 (REQ-ASSET-002):** `app.json` placeholder degerleri (`YOUR_PROJECT_ID`, `example.com`) ile local Metro boot bloklanmaz; bu degerler derive-time TODO, magaza submit kapsam disi.

## Kalite Kapisi (Quality Gate)

- [ ] `npx expo start --clear` bundling success (REQ-BUILD-003).
- [ ] `npx expo install --check` reanimated/worklets uyumu onayli (surum-mismatch riski).
- [ ] `npx expo-doctor` sifir New Architecture hatasi (REQ-GATE-001).
- [ ] `global.HermesInternal !== undefined` dev-time true (REQ-GATE-002).
- [ ] `pnpm --filter @project/mobile test` >=1 gercek test gecer (REQ-GATE-004).
- [ ] `pnpm --filter @project/mobile typecheck` (tsc --noEmit) hatasiz.
- [ ] `pnpm --filter @project/mobile lint` hatasiz.
- [ ] Bootstrap fonksiyonlari (initSentry/initEncryptedStorage/setupOfflineQueue) fan_in >=1 (artik cagriliyor).
- [ ] @MX tag'leri eklendi: `bootstrap.ts` @MX:ANCHOR (init sekansi) + @MX:WARN (rejection guard).

## Definition of Done

- 5 modulun tum REQ'leri karsilandi (BUILD 4, ASSET 2, BOOT 5, NATIVE 3, GATE 4).
- 6 kabul senaryosu + 5 edge case dogrulandi.
- Kalite kapisi tum maddeleri yesil.
- Kapsam disi sinirlari ihlal edilmedi (UI portu, NativeWind, auth wiring, magaza submit, deep-link literal turetme dahil edilmedi).
- ADR-018 New Architecture uyumu korundu; mobil temel "hazir" kabul kriteri (REQ-GATE-003) saglandi.
- **Not:** "Mobil ekranlar crash etmeden render eder" kriteri bu SPEC'in DoD'sinde DEGILDIR; SPEC-UI-001'e devredilir.
