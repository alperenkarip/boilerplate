# Mobile Uygulama

Bu dizin, boilerplate projesinin mobil uygulamasini icerir. React Native, Expo SDK 55, React Navigation 7, Zustand 5 ve MMKV uzerine kurulmustur. New Architecture (Fabric, JSI, TurboModules, Hermes V1) aktif ve zorunludur.

## Hizli Baslatma

```bash
# Bagimlilik kurulumu (proje kokunden)
pnpm install

# Native proje dosyalarini olustur
npx expo prebuild

# iOS'ta calistir (macOS + Xcode gerektirir)
npx expo run:ios

# Android'de calistir (Android Studio + SDK gerektirir)
npx expo run:android

# Gelistirme sunucusu (dev client ile)
pnpm dev
```

### Development Client ve Expo Go Farki

Bu projede Expo Go kullanilmaz. New Architecture (Fabric, JSI) ve native moduller (MMKV, expo-local-authentication vb.) nedeniyle development client olusturmak zorunludur. Expo Go bu native modulleri desteklemez.

`npx expo prebuild` komutu ios/ ve android/ dizinlerini olusturur. Ardindan `npx expo run:ios` veya `npx expo run:android` ile cihaz ya da simulatorde development client derlenir. Sonraki gelistirme dongulerinde `pnpm dev` (expo start --dev-client) yeterlidir.

## Expo Hesap ve Proje Kurulumu

EAS (Expo Application Services) kullanmak icin Expo hesabi gereklidir:

```bash
# EAS CLI kurulumu
npm install -g eas-cli

# Expo hesabina giris
eas login

# Proje baslat ve Project ID al
eas init
```

`eas init` komutu bir Project ID olusturur. Bu ID, `app.json` dosyasindaki `extra.eas.projectId` alanina yazilmalidir.

## EAS Build Profilleri

`eas.json` dosyasinda uc build profili tanimlidir:

- **development**: Gelistirme amacli dev client build'i. Simulatorde veya fiziksel cihazda calistirilir.
- **preview**: Dahici dagilim icin (internal distribution). Test ekibine veya paydaSlara dagilim yapilir.
- **production**: App Store ve Google Play'e gonderilecek nihai build.

```bash
# Development build
eas build --profile development --platform ios

# Preview build
eas build --profile preview --platform android

# Production build
eas build --profile production --platform all
```

## EAS Submit

Uygulamayi magazalara gondermek icin `eas.json` icerisindeki submit yapilandirmasini doldurun:

- **iOS**: `appleId` (Apple ID e-posta), `ascAppId` (App Store Connect App ID), `appleTeamId`
- **Android**: `serviceAccountKeyPath` (Google Play Console servis hesabi JSON dosyasinin yolu)

```bash
eas submit --platform ios
eas submit --platform android
```

## Apple Developer Gereksinimleri

- Apple Developer Program uyeligine ihtiyaciniz vardir (yillik ucretli).
- Xcode'da Bundle ID olusturun ve Apple Developer portal'da kaydedin.
- Provisioning profile ve signing certificate'leri yapilandirin. EAS Build bunlari otomatik yonetebilir (managed credentials).

## Google Play Console Gereksinimleri

- Google Play Console hesabi gereklidir (tek seferlik ucret).
- `app.json` icindeki package name ile Google Play Console'da uygulama olusturun.
- Upload key icin keystore olusturun (EAS otomatik yapabilir).
- API erisimi icin `google-services-key.json` servis hesabi dosyasini olusturun ve `eas.json`'da yolunu belirtin.

## Asset Gereksinimleri

Uygulama ikonu ve splash ekrani icin asagidaki gorseller gereklidir:

| Dosya               | Boyut     | Aciklama                        |
| ------------------- | --------- | ------------------------------- |
| `icon.png`          | 1024x1024 | Ana uygulama ikonu              |
| `splash.png`        | 1284x2778 | Splash (acilis) ekrani gorseli  |
| `adaptive-icon.png` | 1024x1024 | Android adaptive icon (on plan) |

Ikon olusturmak icin kullanilabilecek araclar:

- https://icon.kitchen (ucretsiz, hizli)
- Figma (detayli tasarim icin)

Gorseller `assets/` dizininde bulunmali ve `app.json` icinde referans verilmelidir.

## Dizin Yapisi

```
src/
  screens/        # Ekran componentleri
    auth/           # Giris, kayit, sifre islemleri ekranlari
    main/           # Ana uygulama ekranlari (home, profil, ayarlar)
    onboarding/     # Ilk kullanim adimlari ekranlari
    sample/         # Ornek/demo ekranlar (list, detail, form)
    system/         # Sistem ekranlari (hata, yukleniyor, bakim, 404, cevrimdisi)
  auth/           # Kimlik dogrulama mantigi
  navigation/     # React Navigation yapilandirmasi ve navigator tanimlari
  observability/  # Sentry ve izleme entegrasyonu
  state/          # Zustand store tanimlari
  storage/        # MMKV ve SecureStore yardimci fonksiyonlari
  theme/          # Tema tokenlari ve renk palet tanimlari
```

Kok dizinde ayrica su dosyalar bulunur:

- `app.json` — Expo yapilandirmasi (bundle ID, scheme, permissions, assets)
- `eas.json` — EAS Build ve Submit profilleri
- `jest.config.js` — Jest test yapilandirmasi

## Biyometrik Kimlik Dogrulama

`expo-local-authentication` ile Face ID ve parmak izi destegi saglanir. iOS icin `app.json` dosyasindaki `infoPlist` alanina `NSFaceIDUsageDescription` eklenmis olmalidir:

```json
{
  "expo": {
    "ios": {
      "infoPlist": {
        "NSFaceIDUsageDescription": "Guvenli giris icin Face ID kullanilir."
      }
    }
  }
}
```

`BiometricPromptScreen.tsx` ekrani biyometrik dogrulama akisini yonetir.

## Depolama (Storage)

Iki farkli depolama mekanizmasi kullanilir:

- **MMKV**: Yuksek performansli key-value deposu. Kullanici tercihleri, cache verileri, uygulama ayarlari gibi genel amacli veriler icin kullanilir.
- **Expo SecureStore**: Hassas veriler (token, sifre, biyometrik referans) icin sifrelenmis depolama. iOS Keychain ve Android Keystore uzerine kurulmustur.

`src/storage/` dizininde her iki mekanizma icin yardimci fonksiyonlar bulunur.

## Deep Linking

`app.json` icinde deep linking yapilandirmasi yapilir:

- `scheme`: Uygulama URL semasi (orn: `myapp://`)
- `associatedDomains`: iOS Universal Links icin (orn: `applinks:example.com`)
- `intentFilters`: Android App Links icin

Bu yapilandirma sayesinde web URL'leri veya ozel sema URL'leri dogrudan uygulamanin ilgili ekranina yonlendirilir.

## i18n Durumu

Mobile tarafta i18n entegrasyonu henuz yapilmamistir. Web uygulamasindaki i18next 26.x pattern'i (namespace bazli ceviri dosyalari, dil degistirme, interpolation) mobile'a da uygulanacaktir. Gecici olarak ekran metinleri dogrudan component icinde tanimlidir.

## Sentry Durumu

`@sentry/react-native` henuz dependency listesine eklenmemistir. `src/observability/` dizininde conditional import altyapisi hazirdir; paket eklendikten sonra yapilandirma dosyasindaki DSN degeri ile aktif hale gelecektir.

## Testler

Jest 30 ile calistirilir:

```bash
pnpm test
```

Test dosyalari kaynak dosyanin yaninda `*.test.ts(x)` uzantisiyla bulunur. Yapilandirma: `jest.config.js`.

## Firebase Entegrasyonu (ADR-020 / ADR-021)

Backend canonical olarak Firebase'dir. Mobil taraf `@react-native-firebase` native SDK'sini kullanir:

- `@react-native-firebase/app`, `@react-native-firebase/auth`, `@react-native-firebase/firestore`, `@react-native-firebase/functions` (sabit `21.14.0` hatti — RN 0.83 / Expo 55 uyumlu, namespaced API).

### Development Build Zorunlulugu

`@react-native-firebase` native modul icerir; **Expo Go DESTEKLENMEZ** (ADR-002 amendment / ADR-020 Bolum 16). New Architecture zaten development build gerektiriyordu; Firebase bunu pekistirir. Akis degismez: `npx expo prebuild` -> `npx expo run:ios` / `run:android` -> sonraki dongulerde `pnpm dev`.

### google-services.json / GoogleService-Info.plist

Native Firebase config dosyalari **commit edilmez** (`.gitignore`'dadir). Repoda yalnizca PLACEHOLDER ornekleri bulunur:

```bash
# Android: Firebase Console > Project Settings > Android app > google-services.json indir
cp google-services.example.json google-services.json

# iOS: Firebase Console > Project Settings > iOS app > GoogleService-Info.plist indir
cp GoogleService-Info.example.plist GoogleService-Info.plist
```

Ardindan indirilen gercek dosyalari bu konumlara koyun. `app.json` bunlari `ios.googleServicesFile` / `android.googleServicesFile` ile referans alir ve `@react-native-firebase/app` config plugin'i prebuild sirasinda native projeye yerlestirir.

### iOS Static Frameworks

`@react-native-firebase` iOS'ta static framework gerektirir. `app.json` icindeki `expo-build-properties` plugin'i bunu ayarlar:

```json
["expo-build-properties", { "ios": { "newArchEnabled": true, "useFrameworks": "static" } }]
```

### Yerel Emulator Suite

Gelistirme sirasinda kok dizindeki `firebase.json` emulator yapilandirmasi kullanilir (auth 9099, firestore 8080, functions 5001):

```bash
# Proje kokunden (firebase-tools gerekir)
firebase emulators:start
```

`src/firebase/config.ts` icindeki `connectFirebaseEmulators()`, `__DEV__` modunda SDK'lari otomatik emulator'a baglar. iOS simulator `localhost`, Android emulator host makineye `10.0.2.2` uzerinden erisir (kod bunu otomatik secer).

### Adapter Mimarisi (Port/Adapter — ADR-020 Bolum 14)

`packages/core` SDK-free port sozlesmelerini tanimlar; mobil adapter'lar `src/firebase/` altinda bunlari `@react-native-firebase` ile uygular:

- `authAdapter.ts` -> `AuthPort` (giris/kayit/cikis, sanitize edilmis `AuthSummary`)
- `dataReadAdapter.ts` -> `DataReadPort` (client SDK okuma + `onSnapshot`; yazma YOK)
- `functionsAdapter.ts` -> `FunctionsCallPort` (callable Cloud Functions; `HttpsError` -> `CallableError`)

KURAL: Okuma client SDK + owner-scoped (`ownerId == uid`, Security Rules); yazma YALNIZCA callable Cloud Functions. Client dogrudan Firestore'a yazmaz.

Auth state `src/auth/AuthProvider.tsx` (context + `useAuth()`) ile uygulamaya saglanir.
