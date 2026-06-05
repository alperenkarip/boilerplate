# Modül Tanımları

Son güncelleme: 2026-06-05
Versiyon: 1.1.0

---

## packages/* — Paylaşılan Paketler

### packages/ui

**Sorumluluk:** Cross-platform UI bileşen kütüphanesi. Web (React + Tailwind CSS 4.x) ve mobile (React Native + NativeWind 5.x) için tek kaynak bileşenler üretir. Yalnızca `@project/design-tokens` paketine bağımlıdır; `@project/core`'a bağımlılık yasaktır.

**Toplam dışa aktarım:** 62 bileşen — 12 primitive + 50 Tier2-3.

**Primitive Katmanı (12 bileşen):**

```
packages/ui/src/primitives/
├── Text                    # Tipografi temel birimi
├── Heading                 # Başlık seviyeleri (fan-in: 47)
├── Box                     # Temel kapsayıcı (div / View)
├── Stack                   # Dikey düzen (fan-in: 49 — ANCHOR)
├── Inline                  # Yatay düzen
├── Spacer                  # Boşluk yönetimi
├── Pressable               # Dokunma/tıklama hedefi
├── Icon                    # İkon sistemi (Phosphor/vector-icons wrapper)
├── Divider                 # Ayırıcı çizgi
├── ScrollContainer         # Kaydırılabilir kapsayıcı
├── SafeAreaContainer       # Güvenli alan yönetimi
└── KeyboardAvoidingContainer # Klavye kaçınma
```

**Tier2-3 Bileşen Kataloğu (50 bileşen, 9 kategori):**

| Kategori | Adet | Bileşenler |
|----------|------|------------|
| form | 11 | Button (fan-in:36), IconButton, TextField (fan-in:18), TextArea, FieldShell, Switch, Select, Checkbox, Radio, FormGroup, FormActions |
| feedback | 4 | Toast, Banner, ConsentBanner, NetworkStatusBanner |
| state | 6 | Skeleton, Spinner, ProgressBar, EmptyState, ErrorState, LoadingState |
| data | 7 | Avatar, Badge, Chip, Card (fan-in:15), ListItem, SectionHeader, KeyValueRow |
| overlay | 7 | Modal, ConfirmDialog, BottomSheet, ActionSheet, Drawer, Tooltip, Popover |
| input | 5 | PasswordField, PhoneInput, SearchBar, DatePicker, Slider |
| navigation | 4 | StepIndicator, SegmentedControl, Header, TabBar |
| utility | 8 | Accordion, CountdownTimer, WebViewPlaceholder, DividerWithLabel, PullToRefreshWrapper, InfiniteScrollList, StickyFooter, SkipToContent |
| quality | 1 | AppLockScreen |

**Yardımcı Modüller:**

```
packages/ui/src/
├── providers/     # ThemeProvider + useTheme hook
├── quality/       # ErrorBoundary, AuthGuard, ScreenContainer
└── index.ts       # 62 bileşenin barrel export noktası
```

**Public Interface:** `packages/ui/src/index.ts` — Tüm dışa aktarılan bileşenler bu dosyadan geçer. Doğrudan iç dosya importu yasaktır (`no-barrel-import` kuralı).

**Bağımlılıklar:** `packages/design-tokens` (token tüketimi), `packages/config-typescript` (dev), `packages/config-eslint` (dev)

**Yüksek Fan-in Bileşenler (ANCHOR adayları):** Stack (49), Heading (47), Text (40), Button (36), TextField (18), Card (15)

---

### packages/core

**Sorumluluk:** Uygulama genelinde paylaşılan domain mantığı, tip tanımları, API client ve doğrulama fonksiyonları. Platform-agnostik; UI bağımlılığı yoktur, router veya auth SDK içermez. Yalnızca React peer dependency olarak bulunur.

**Modül Yapısı:**

```
packages/core/src/
├── api/
│   ├── client.ts   # createApiClient: fetch-first, retry 3× üstel geri çekilme,
│   │               # 401 callback, AbortSignal timeout desteği
│   └── types.ts    # ApiClient, ApiResponse<T>, ApiError
├── auth/
│   └── types.ts    # AuthStatus ('authenticated'|'unauthenticated'|'refreshing'|'expired'),
│                   # AuthSummary, LogoutCleanupContract
├── hooks/
│   ├── useDebounce.ts
│   ├── useThrottle.ts
│   ├── usePrevious.ts
│   └── useAsync.ts
├── validation/
│   ├── isEmail.ts
│   ├── isPhoneNumber.ts
│   ├── isStrongPassword.ts
│   ├── isURL.ts
│   ├── isEmpty.ts
│   ├── minLength.ts
│   └── maxLength.ts
└── index.ts        # Public API barrel
```

**Public Interface:** API client factory, auth tipleri, utility hook'lar, doğrulama fonksiyonları.

---

### packages/design-tokens

**Sorumluluk:** Token sistemi tüm projenin stilizasyon tek gerçek kaynağıdır. Ham değerler → semantic tokenlar → tema nesneleri zinciriyle üretilir. Hiçbir harici bağımlılığı yoktur (pure data).

**Token Akış Katmanları:**

```
packages/design-tokens/src/
├── raw/
│   ├── colors      # Tam renk paleti (sayısal değerler)
│   ├── spacing     # 4px tabanlı ızgara sistemi
│   ├── typography  # Font ailesi, boyut, ağırlık, satır yüksekliği
│   ├── radius      # Köşe yuvarlaklığı ölçeği
│   ├── elevation   # Gölge seviyeleri
│   ├── motion      # Süre (fast/normal/slow) + easing
│   ├── border      # Sınır genişlikleri
│   └── opacity     # Opaklık değerleri
│
├── semantic/
│   ├── ContentTokens   # Metin ve ikon renkleri
│   ├── SurfaceTokens   # Yüzey ve arka plan renkleri
│   ├── BorderTokens    # Sınır renkleri
│   ├── InteractiveTokens # Etkileşimli öğe renkleri
│   ├── FeedbackTokens  # Başarı/uyarı/hata renkleri
│   └── OverlayTokens   # Üst katman ve scrim renkleri
│
├── themes/
│   ├── lightTheme      # Açık tema: semantic → ham değer eşlemesi
│   └── darkTheme       # Koyu tema: semantic → ham değer eşlemesi
│
└── css.ts              # generateCSSVariables, flattenTokens (Tailwind entegrasyonu)
```

**Public Interface:** `css.ts` (web CSS değişkenleri), `index.ts` (tip tanımları + tema nesneleri).

---

### packages/testing

**Sorumluluk:** Test yardımcı fonksiyonları. Tekrarlayan test altyapısını merkezi hale getirir. Harici bağımlılığı yoktur.

**Dışa aktarılanlar:** `waitFor`, `createMockResponse`, `createMockError`

---

### packages/config-typescript

**Sorumluluk:** TypeScript yapılandırma presetleri. Tüm uygulama ve paket `tsconfig.json` dosyaları bu presetleri genişletir.

**Presetler:**
- `tsconfig.base.json` — strict, ES2022, react-jsx
- `tsconfig.web.json` — Vite + DOM tipleri
- `tsconfig.mobile.json` — React Native tipleri
- `tsconfig.library.json` — Paket yayını için çıktı optimizasyonu

---

### packages/config-eslint

**Sorumluluk:** ESLint flat-config fabrikası. `createConfig(type: 'web' | 'mobile' | 'library')` fonksiyonu platform bazında kural setleri döndürür. Kök `eslint.config.js` bu fabrikayı kullanır; 19 `eslint-plugin-bp` kuralını `warn` seviyesinde uygular.

---

### packages/eslint-plugin-bp

**Sorumluluk:** Proje genelinde token disiplinini ve modül sınırlarını zorunlu kılan 19 özel ESLint kuralını barındırır. ESLint 9 peer bağımlılığı gerektirir.

**Modül Yapısı:**

```
packages/eslint-plugin-bp/
├── src/
│   ├── rules/
│   │   ├── no-hardcoded-color.js
│   │   ├── no-hardcoded-spacing.js
│   │   ├── no-hardcoded-font-size.js
│   │   ├── no-hardcoded-font-weight.js
│   │   ├── no-hardcoded-dimension.js
│   │   ├── no-direct-repo-import.js        # Modül sınırı: apps→packages YOK dışı
│   │   ├── no-raw-pressable.js             # mobile: Pressable wrapper zorunlu
│   │   ├── no-raw-touchable.js             # mobile: TouchableOpacity yasak
│   │   ├── no-raw-rn-text.js               # mobile: RN Text doğrudan kullanım yasak
│   │   ├── no-raw-modal.js                 # mobile: RN Modal doğrudan kullanım yasak
│   │   ├── require-form-hook.js            # Form bileşeni için RHF hook zorunlu
│   │   ├── require-design-token.js         # Stil değerlerinde token zorunlu
│   │   ├── require-accessibility-props.js  # a11y prop'ları zorunlu
│   │   ├── no-barrel-import.js             # İç dosya importu yasak, barrel zorunlu
│   │   ├── no-token-category-mismatch.js   # Yanlış token kategorisi kullanımı yasak
│   │   ├── no-direct-phosphor-import.js    # Phosphor icon doğrudan import yasak
│   │   ├── no-direct-vector-icons-import.js # vector-icons doğrudan import yasak
│   │   ├── no-inline-text-style.js         # Satır içi text stili yasak
│   │   └── no-animated-api.js              # RN Animated API doğrudan kullanım yasak
│   │
│   ├── configs/
│   │   └── recommended.js                  # 19 kuralın önerilen preset yapılandırması
│   │
│   ├── utils/
│   │   ├── ast-helpers.js
│   │   └── token-whitelist.js
│   │
│   └── index.js                            # Plugin giriş noktası
```

**19 Kural Özeti:**

| Kural Grubu | Kurallar | Amaç |
|-------------|----------|-------|
| Token disiplini | no-hardcoded-{color,spacing,font-size,font-weight,dimension}, require-design-token, no-token-category-mismatch | Hardcoded stil değerlerini engeller |
| Modül sınırı | no-direct-repo-import | apps→packages dışı yönleri engeller |
| Mobile platform | no-raw-{pressable,touchable,rn-text,modal}, no-animated-api | RN primitive doğrudan kullanımını engeller |
| Form | require-form-hook | React Hook Form kullanımını zorunlu kılar |
| Erişilebilirlik | require-accessibility-props | a11y prop eksikliğini engeller |
| İkon | no-direct-{phosphor,vector-icons}-import | İkon wrapper kullanımını zorunlu kılar |
| Yapı | no-barrel-import, no-inline-text-style | Kod yapısı tutarlılığı |

---

## apps/web — Web Uygulaması

**Runtime:** React 19.2.0 + Vite 8 + React Router 7, SPA (ADR-001)

**Modül Yapısı:**

```
apps/web/
├── index.html              # HTML giriş noktası (script: src/main.tsx)
└── src/
    ├── main.tsx            # ReactDOM.createRoot + Sentry.init → <App /> render
    ├── App.tsx             # Provider zinciri kökü
    ├── router.tsx          # createBrowserRouter, 27 lazy route tanımı
    │
    ├── features/
    │   └── sample/         # Dikey dilim örneği
    │       ├── sample.schema.ts
    │       ├── sample.types.ts
    │       ├── sample.api.ts
    │       ├── useSample.ts
    │       ├── SampleListScreen.tsx
    │       ├── SampleFormScreen.tsx
    │       └── SampleDetailScreen.tsx
    │
    ├── pages/              # 27 route seviyesi sayfa bileşeni (S01-S27)
    ├── layouts/
    │   └── RootLayout.tsx  # Paylaşılan sayfa iskeleti
    ├── auth/               # Auth hook ve oturum yönetimi
    ├── state/
    │   └── stores.ts       # Zustand store tanımları
    ├── i18n/               # i18next yapılandırması
    │   └── locales/        # 4 namespace × tr + en
    │       ├── tr/ {common,shell,auth,validation}.json
    │       └── en/ {common,shell,auth,validation}.json
    ├── observability/
    │   ├── sentry.ts
    │   ├── analytics.ts
    │   └── logger.ts
    └── styles/
        └── globals.css     # Tailwind direktifleri + CSS değişkenleri
```

**Yapılandırma Dosyaları:**
- `vite.config.ts` — Vite 8 build ve plugin yapılandırması
- `vitest.config.ts` — jsdom ortamı, unit testler
- `playwright.config.ts` — E2E test yapılandırması

---

## apps/mobile — Mobile Uygulaması

**Runtime:** React Native 0.83 + Expo SDK 55 + New Architecture (ADR-002, ADR-018)

**Modül Yapısı:**

```
apps/mobile/
├── app.json            # Expo config (newArch: true, plugins)
├── eas.json            # EAS Build kanalları
├── jest.config.js      # jest-expo preset
└── src/
    ├── App.tsx         # Provider zinciri kökü
    │
    ├── navigation/
    │   ├── AppNavigator.tsx  # Kök navigator
    │   ├── linking.ts        # Deep link şema yapılandırması
    │   └── types.ts          # Navigation param tipleri
    │
    ├── screens/
    │   ├── auth/       # Login, Register, ForgotPassword ekranları
    │   ├── main/       # Home, Dashboard ekranları
    │   ├── onboarding/ # Welcome, PermissionPrimer ekranları
    │   ├── sample/     # List, Form, Detail ekranları
    │   └── system/     # Splash, ForceUpdate ekranları
    │
    ├── auth/           # expo-local-authentication (biometric) + expo-secure-store
    ├── state/          # Zustand store'ları (mobile)
    ├── storage/
    │   └── mmkv.ts     # react-native-mmkv 3.3.3 yapılandırması
    ├── theme/          # NativeWind tema uygulaması
    └── observability/  # Sentry mobile entegrasyonu
```

---

## Feature Slice Örüntüsü (Genel)

Her feature dilimi aşağıdaki dosya yapısını takip eder:

```
features/{feature}/
├── {feature}.schema.ts       # Zod doğrulama şemaları
├── {feature}.types.ts        # TypeScript tip tanımları
├── {feature}.api.ts          # API çağrıları (core createApiClient kullanır)
├── use{Feature}.ts           # Feature-özel React Query hook
├── {Feature}ListScreen.tsx   # Liste/indeks görünümü
├── {Feature}FormScreen.tsx   # Oluşturma/düzenleme formu
└── {Feature}DetailScreen.tsx # Detay görünümü
```

**Kural:** Feature kodları yalnızca `packages/*` paketlerini import edebilir. Başka feature dilimlerini doğrudan import etmek yasaktır.
