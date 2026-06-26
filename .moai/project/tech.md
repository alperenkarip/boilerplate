# Teknoloji Stack'i

Son Güncelleme: 2026-06-26

## Genel Bakış

Bu proje, React ve React Native (Expo) uzerine kurulu cross-platform bir boilerplate'tir. Web tarafi Vite 8 ile derlenen React 19 SPA olarak, mobil taraf ise Expo SDK 55 uzerinde calisan React Native 0.83 uygulamasi olarak konumlandirilmistir. Tüm teknoloji secimleri ADR-001'den ADR-021'e kadar uzanan mimari karar kayitlariyla kilitlenmis olup alternatif öneri veya tartisma yasaktir. Backend, database ve auth Firebase'e kilitlenmistir (ADR-020, ADR-021).

Monorepo yapisi pnpm 10 ve Turborepo 2 ile yonetilmektedir. TypeScript 5.9 strict mode tüm platformlarda zorunludur. State yonetiminden test altyapisina, kimlik dogrulamadan gizlilik uyumuna kadar her katman için canonical bir seçim belirlenmis ve governance dokumanlariyla güvence altina alinmistir.

---

## Runtime ve Framework'ler

| Teknoloji | Versiyon | Platform | ADR |
|-----------|----------|----------|-----|
| TypeScript | 5.9.x | Tüm platformlar | — |
| React | 19.2.0 | Web + Mobile | ADR-001, ADR-002 |
| React DOM | 19.2.0 | Web | ADR-001 |
| React Native | ~0.83 | Mobile | ADR-002 |
| Expo SDK | ~55.0.0 | Mobile | ADR-002 |
| Vite | 8.x | Web build araci | ADR-001 |
| Turborepo | 2.x | Monorepo orkestrasyon | ADR-003 |
| pnpm | 10.x | Paket yoneticisi | ADR-003 |

**Not:** `react-dom` 19.2.0 ile `react` 19.2.0 pnpm `overrides` ile birlikte sabitlenmistir. Gecikmeli bağımlılıklar `react-dom@19.2.4` cekmekteydi; override bu uyumsuzlugu kapatir.

Web runtime olarak React 19 + Vite 8 + React Router 7 SPA-first yaklasimla (ADR-001), mobil runtime olarak React Native 0.83 + Expo SDK 55 (ADR-002) secilmistir. Monorepo yönetimi pnpm 10.x + Turborepo 2.x kombinasyonuyla saglanmaktadir (ADR-003). Guvenli kurulum için `minimum-release-age=3d`, `onlyBuiltDependencies` allowlist (esbuild, @swc/core) politikalari aktiftir.

---

## State Management

ADR-004 (client state) ve ADR-005 (server state) ile belirlenmis iki katmanli state mimarisi kullanilmaktadir. Client state için Zustand tercih edilmis, server state, onbellekleme ve mutation yönetimi için TanStack Query benimsenmistir. Veri çekme katmaninda fetch-first yaklasim varsayilan olup TanStack Query kosullu query-layer track'i ile uygulanmaktadir.

| Teknoloji | Versiyon | Amac |
|-----------|----------|------|
| Zustand | 5.x | Client state yönetimi |
| TanStack Query | 5.x | Server state, onbellekleme, mutation |

---

## Forms ve Validation

ADR-006 ile belirlenmis form katmanı, React Hook Form ve Zod'un birlikte kullanimina dayanmaktadir. Zod, schema authority olarak tanimlanmistir; tüm validasyon kurallari Zod schema'larinda merkezi olarak tutulur ve `@hookform/resolvers` araciligiyla RHF ile entegre edilir.

| Teknoloji | Versiyon | Amac |
|-----------|----------|------|
| React Hook Form | 7.x | Form state yönetimi |
| Zod | 4.x | Schema validasyonu (authority) |
| @hookform/resolvers | — | RHF + Zod entegrasyon koprusu |

---

## Styling ve Design System

ADR-007 ile tanimlanan semantic token-first yaklasim benimsenmistir. Web'de Tailwind CSS 4.x, mobilde NativeWind 5.x candidate track kullanilmaktadir. Hardcoded renk, spacing veya font değerleri yasaktir; tüm degerler design token katmanindan gelmelidir.

| Teknoloji | Versiyon | Platform |
|-----------|----------|----------|
| Tailwind CSS | 4.x | Web |
| NativeWind | 5.x | Mobile (candidate track) |
| packages/design-tokens | Özel paket | Cross-platform |

Design token paketi `packages/design-tokens/` altinda konumlandirilmistir. Token katmanları: raw → semantic → themes. Web için `css.ts` (generateCSSVariables, flattenTokens) CSS variable export'u saglar. Token ciktilari `docs/design-system/22-design-tokens-spec.md` katmanlariyla eslesmis olmalidir.

---

## Navigation

ADR-012 ile platform bazli navigasyon mimarisi belirlenmistir. Web'de React Router 7.x, mobilde React Navigation 7.x kullanilmaktadir.

| Teknoloji | Versiyon | Platform |
|-----------|----------|----------|
| React Router | 7.x | Web |
| React Navigation | 7.x | Mobile |

Navigasyon kurallari ve pattern'ler için `docs/architecture/08-navigation-and-flow-rules.md` referans alinmalidir.

---

## Testing

ADR-008 ile uc katmanli test piramidi tanimlanmistir. Web birim ve component testleri için Vitest (jsdom ortami), mobil birim testleri için jest-expo, web E2E testleri için Playwright kullanilmaktadir. Component testing için her iki platformda da Testing Library tercih edilmistir. Storybook, component lab ve canli dokumantasyon ortami olarak hizmet vermektedir.

| Teknoloji | Versiyon | Amac |
|-----------|----------|------|
| Vitest | 4.x | Web birim/component testleri (jsdom) |
| jest-expo | — | Mobile birim testleri |
| Playwright | 1.58.x | Web E2E testleri |
| Testing Library React | — | Web component testing |
| Testing Library RN | — | Mobile component testing |
| Storybook | 8.6.x | Component lab ve dokumantasyon |

Test dosyalari kaynak dosyanin yaninda `*.test.ts(x)` uzantiyla konumlandirilir. Minimum kapsam hedefi %85'tir.

---

## Observability

ADR-009 ile tanimlanan observability katmanı, Sentry 10.x tabanli hata takibi ve vendor-agnostic analytics soyutlamasindan olusturmaktadir. Web ve mobile için ayri Sentry paketleri kullanilmakta, analytics katmanı ise belirli bir vendor'a bagimli olmayan bir abstraction arkasindan tutulmaktadir. Sentry payload'larinda hassas veri bulundurulmamalidir.

| Teknoloji | Versiyon | Platform | Amac |
|-----------|----------|----------|------|
| @sentry/react | 10.x | Web | Hata takibi, performans izleme |
| @sentry/react-native | 10.x | Mobile | Hata takibi, performans izleme |
| Custom analytics abstraction | — | Cross-platform | Vendor-agnostic analytics |
| Custom logger | — | Cross-platform | Merkezi logging katmanı |

---

## Backend & Database

ADR-020 ile backend ve data platform Firebase (BaaS) olarak zorunlu canonical kabul edilmistir. Database Cloud Firestore (NoSQL, koleksiyon-merkezli), server logic Cloud Functions'tir. Read/write contract nettir: yazma (create/update/delete) ve is mantigi Cloud Functions (callable `onCall` / HTTPS `onRequest`) uzerinden yurur; client dogrudan Firestore'a yazmaz (Security Rules write varsayilan-reddet). Okuma client SDK ile dogrudan Firestore'dan yapilir (Rules korumali) ve realtime ihtiyacinda `onSnapshot` kullanilir. Zamanli isler Cloud Scheduler, async isler Cloud Tasks ile yurur (Inngest/BullMQ yasak).

| Teknoloji | Amac | Platform | ADR |
|-----------|------|----------|-----|
| Firebase Auth | Kimlik dogrulama (client SDK + ID token) | Web + Mobile | ADR-021 |
| Cloud Firestore | NoSQL document database (koleksiyon-merkezli) | Cross-platform | ADR-020 |
| Cloud Functions | Server logic ve canonical yazma yolu (onCall/onRequest) | Backend | ADR-020 |
| Cloud Storage for Firebase | Object/blob storage | Cross-platform | ADR-020 |
| Cloud Scheduler + Cloud Tasks | Zamanli (cron) ve async queue isler | Backend | ADR-020 |
| FCM (Firebase Cloud Messaging) | Push delivery | Mobile | ADR-013 / ADR-020 |

**SDK stratejisi:**

| Katman | SDK | Sorumluluk |
|--------|-----|------------|
| `apps/web` | `firebase` JS SDK (modular, v11.x) | Web adapter |
| `apps/mobile` | `@react-native-firebase` (~v21.x, native) | Mobile adapter (Expo development build zorunlu) |
| `packages/core` | SDK-free port/adapter | `AuthPort`, `DataReadPort`, `FunctionsCallPort` arayuzleri |

`packages/core` hicbir Firebase SDK'sini import etmez; cross-platform parity port/adapter seviyesinde saglanir (ADR-020). `@react-native-firebase` native modulleri nedeniyle Expo development build zorunludur, Expo Go desteklenmez (ADR-002 / ADR-018 New Architecture uyumu).

---

## Auth ve Security

ADR-021 ile kimlik doğrulama mimarisi saf Firebase Auth olarak belirlenmistir (ADR-010 supersede edilmistir). Kullanici client SDK ile giris yapar (web `firebase/auth`, mobile `@react-native-firebase/auth`), kimlik Firebase ID token ile tasinir; kendi backend session/cookie modeli yoktur. Yetkilendirme Firestore Security Rules (`request.auth`, okuma) ve Cloud Functions `context.auth` (yazma) ile yapilir. Auth lifecycle `onAuthStateChanged` ile yonetilir. Hassas uygulama verisi icin `expo-secure-store`, yerel unlock icin biyometrik kimlik doğrulama korunur. Auth token'lari (ID token dahil) kesinlikle log'lara yazilmaz ve UI'ya sizmaz.

| Teknoloji | Platform | Amac |
|-----------|----------|------|
| Firebase Auth (firebase/auth) | Web | Kimlik dogrulama (ID token, Firebase persistence) |
| Firebase Auth (@react-native-firebase/auth) | Mobile | Kimlik dogrulama (ID token, otomatik persistence) |
| expo-secure-store | Mobile | Hassas yerel veri (Firebase oturumu disi) |
| expo-local-authentication | Mobile | Biyometrik yerel unlock |

Detay için: `docs/adr/ADR-021-authentication-platform.md`, `docs/adr/ADR-020-backend-and-data-platform.md` ve `docs/quality/27-security-and-secrets-baseline.md`

---

## i18n

ADR-011 ile namespace tabanli uluslararasılastirma mimarisi belirlenmistir. i18next 26.x framework olarak, react-i18next ise React binding olarak kullanilmaktadir. Namespace'ler: `common`, `shell`, `auth`, `validation` — her ikisi de Turkce (tr) ve Ingilizce (en) desteklenmektedir. Inline user-facing string yasaktir; tüm metinler i18n key araciligiyla yonetilmelidir.

| Teknoloji | Versiyon | Amac |
|-----------|----------|------|
| i18next | 26.x | i18n framework |
| react-i18next | 17.x | React binding |

---

## Native Modules (Mobile)

Mobil platformda performans kritik yerel moduller kullanilmaktadir. Yerel depolama için MMKV canonical default olarak belirlenmistir (ADR-019). Animasyon katmanı Reanimated 4.x ile saglanmakta, hareket algilama Gesture Handler ile yonetilmektedir.

| Teknoloji | Versiyon | Amac |
|-----------|----------|------|
| react-native-mmkv | 3.3.3 | Yüksek performansli yerel depolama (canonical) |
| react-native-reanimated | 4.x | Animasyon motoru |
| react-native-gesture-handler | ~2.30.x | Jest algilama |
| react-native-screens | — | Native ekran container'lari |
| react-native-safe-area-context | — | Safe area yönetimi |

New Architecture (Fabric + JSI + TurboModules + Hermes V1) zorunludur ve kapatılamaz (ADR-018). Yerel depolama stratejisi için `docs/adr/ADR-019-local-storage-and-offline-first-strategy.md` referans alinmalidir.

---

## Linting ve Kod Kalitesi

ESLint 9 flat config mimarisi benimsenmistir. `packages/config-eslint`, platform bazinda (web/mobile/library) `createConfig()` factory fonksiyonu saglar. `packages/eslint-plugin-bp` ise projeye özel 19 kurali barindiran özel ESLint plugin'idir.

| Teknoloji | Versiyon | Amac |
|-----------|----------|------|
| ESLint | 9.x | Statik kod analizi (flat config) |
| packages/config-eslint | Özel paket | Platform bazli ESLint factory |
| packages/eslint-plugin-bp | Özel paket | 19 kuralli özel plugin |
| Prettier | 3.x | Kod formatlama |
| Husky | — | Pre-commit hook yönetimi |
| lint-staged | — | Commit oncesi staged dosya kontrolu |

### eslint-plugin-bp Kural Kategorileri

| Kural Grubu | Kurallari | Amac |
|---|---|---|
| Token disiplini | `no-hardcoded-color`, `no-hardcoded-spacing`, `no-hardcoded-font-size`, `no-hardcoded-font-weight`, `no-hardcoded-dimension`, `require-design-token`, `no-token-category-mismatch` | Hardcoded değer kullanimi engelleme |
| Mimari sinir | `no-direct-repo-import` | `packages→apps` ve `apps↔apps` sinir zorlamasi |
| Mobile ham API | `no-raw-pressable`, `no-raw-touchable`, `no-rn-text`, `no-raw-modal`, `no-animated-api` | Platform primitive kullanimi yerine UI paket zorlama |
| Form disiplini | `require-form-hook` | Dogrudan input state yönetimi yerine RHF zorlama |
| Erisilebilirlik | `require-accessibility-props` | a11y prop eksikligini yakalama |
| Import kalitesi | `no-barrel-import`, `no-direct-phosphor-import`, `no-direct-vector-icons-import`, `no-inline-text-style` | Import temizligi ve stil disiplini |

TypeScript strict mode zorunludur; `any` tipi yasaktir. ESLint `disable` ve `@ts-ignore` kullanimi `44-exception-and-exemption-policy.md` kapsaminda exception policy gerektirir.

---

## Development Environment

**Zorunlu Sürüm Gereksinimleri:**

| Arac | Gereksinim |
|------|-----------|
| Node.js | >=20.19.0 <21.0.0 (LTS zorunlu) |
| pnpm | >=10.0.0 <11.0.0 |

---

## Turbo Pipeline

Turborepo pipeline sirasi (turbo.json):

```
typecheck → lint → test → build
```

Ayrica: `dev` (paralel geliştirme sunuculari), `verify` (boundary ve SDK saglik kontrolleri), `clean` (artifact temizleme).

---

## CI/CD Pipeline

GitHub Actions tabanli otomasyon pipeline'i dort is akisindan olusturmaktadir:

| Workflow | Tetikleyici | Kapsam |
|----------|-------------|--------|
| `ci.yml` | PR + push | typecheck → lint → test → build → security |
| `deploy.yml` | Main branch merge | Deployment otomasyonu |
| `scheduled-audit.yml` | Periyodik (cron) | Güvenlik taramasi |
| Boundary check | CI ici | Import yonu doğrulama (eslint-plugin-bp) |
| expo-doctor | CI ici | SDK saglik kontrolu |

expo-doctor temiz gecmeden SDK upgrade merge edilmez. Boundary check, `no-direct-repo-import` kurali araciligiyla import yonu kuralini otomatik olarak dogrular.

---

## Build ve Deploy

**Web:**

- Geliştirme: `pnpm dev:web` (Vite dev server)
- Production build: Vite tabanli statik çıktı

**Mobile:**

- Geliştirme: `pnpm dev:mobile` (Expo Go / development build)
- Production build: EAS Build (ADR-002)
- OTA güncelleme: EAS Update (ADR-015)

**Monorepo:**

- Orkestrasyon: Turborepo 2.x pipeline
- Komutlar: `pnpm build`, `pnpm typecheck`, `pnpm lint`, `pnpm test`

EAS Update stratejisi ve OTA uyumluluk etkisi için `docs/adr/ADR-015-ota-update-strategy.md` referans alinmalidir. `runtimeVersion` degisikligi OTA uyumluluk etkisiyle birlikte degerlendirilir.

---

## pnpm Güvenlik Baseline

| Politika | Değer | Amac |
|---|---|---|
| `minimum-release-age` | 3 gun | Yeni yayinlanan paketlerin otomatik cekilmesini engeller |
| `onlyBuiltDependencies` allowlist | esbuild, @swc/core | Yalnizca izin verilen native build paketlerine izin verir |
| `trustPolicy` | — | Paket guven politikasi |

---

## Tam Versiyon Tablosu

| Teknoloji | Sabitlenen Versiyon | Kategori |
|-----------|---------------------|---------|
| React | 19.2.0 | Runtime |
| react-dom | 19.2.0 (pnpm override ile sabitlenmis) | Runtime |
| React Native | ~0.83 | Runtime |
| Expo SDK | ~55.0.0 | Runtime |
| Vite | 8.x | Build |
| React Router | 7.x | Navigation |
| React Navigation | 7.x | Navigation |
| TanStack Query | 5.x | State |
| Zustand | 5.x | State |
| React Hook Form | 7.x | Forms |
| Zod | 4.x | Validation |
| i18next | 26.x | i18n |
| react-i18next | 17.x | i18n |
| Tailwind CSS | 4.x | Styling |
| NativeWind | 5.x | Styling |
| react-native-mmkv | 3.3.3 | Storage |
| react-native-reanimated | 4.x | Animation |
| react-native-gesture-handler | ~2.30.x | Gesture |
| @sentry/react | 10.x | Observability |
| @sentry/react-native | 10.x | Observability |
| Playwright | 1.58.x | Testing |
| Storybook | 8.6.x | Testing |
| TypeScript | 5.9.x | Tooling |
| ESLint | 9.x | Tooling |
| Prettier | 3.x | Tooling |
| pnpm | 10.x | Tooling |
| Turborepo | 2.x | Tooling |
| Node.js | >=20.19.0 <21.0.0 | Environment |

---

## Canonical Stack Referanslari

Tüm teknoloji secimleri asagidaki ADR'larla kilitlenmistir. Alternatifleri tartismak veya bypass etmek yasaktir:

| ADR | Konu |
|-----|------|
| ADR-001 | Web runtime (React 19 + Vite 8 + React Router 7.x, SPA-first) |
| ADR-002 | Mobile runtime (React Native 0.83 + Expo SDK 55.x) |
| ADR-003 | Monorepo (pnpm 10.x + Turborepo 2.x) |
| ADR-004 | State management (Zustand 5.x) |
| ADR-005 | Data fetching (fetch-first + TanStack Query 5.x) |
| ADR-006 | Forms (React Hook Form 7.x + Zod 4.x) |
| ADR-007 | Styling/tokens (Tailwind CSS 4.x + NativeWind 5.x) |
| ADR-008 | Testing (Vitest 4.x + jest-expo + Playwright 1.58.x) |
| ADR-009 | Observability (Sentry 10.x + vendor-agnostic analytics) |
| ADR-010 | Auth baseline (ADR-021 ile supersede edildi) |
| ADR-011 | i18n (i18next 26.x, namespace-based) |
| ADR-012 | Navigation (React Router 7.x web + React Navigation 7.x mobile) |
| ADR-013 | Push Notification (expo-notifications + FCM/APNs) |
| ADR-014 | Deep Linking (expo-linking + Universal Links + App Links) |
| ADR-015 | OTA Update (EAS Update) |
| ADR-016 | In-App Purchase (RevenueCat) |
| ADR-017 | Privacy/Compliance (GDPR + KVKK) |
| ADR-018 | New Architecture (Fabric + JSI + TurboModules + Hermes V1) |
| ADR-019 | Local Storage (MMKV + SecureStore + Zustand persist) |
| ADR-020 | Backend & Data Platform (Firebase: Firestore + Cloud Functions + Storage + Scheduler/Tasks + FCM) |
| ADR-021 | Authentication Platform (saf Firebase Auth: client SDK + ID token) |

**Governance dokumanlari:**

- `docs/governance/36-canonical-stack-decision.md` — Canonical stack kararlari
- `docs/governance/37-dependency-policy.md` — Dependency ekleme politikasi
- `docs/governance/38-version-compatibility-matrix.md` — Versiyon uyumluluk matrisi
- `docs/governance/48-expo-sdk-upgrade-strategy.md` — SDK upgrade stratejisi
