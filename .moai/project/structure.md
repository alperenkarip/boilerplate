# Proje Yapısı

Son Güncelleme: 2026-06-05

## Mimari Pattern

**Temel Pattern:** pnpm Monorepo + Turborepo orkestrasyon

Bu proje, tek bir depoda hem web hem de mobil uygulamaları barındıran bir monorepo mimarisi kullanır. `apps/*` altındaki uygulamalar, `packages/*` altındaki paylaşılan kütüphaneleri tüketir. Turborepo, görevleri (build, test, lint) pipeline halinde paralel veya sıralı çalıştırır. pnpm workspace katalogu (`pnpm-workspace.yaml`) bağımlılık versiyonlarını merkezi olarak yönetir.

**Çalışma Zamanı Dağılımı:**
- Web: React 19 + Vite 8 + React Router 7 (SPA-first)
- Mobil: React Native 0.83 + Expo SDK 55 (New Architecture — Fabric + JSI + TurboModules + Hermes V1)
- Ortak: TypeScript strict mode, Zod 4.x şema otoritesi, i18next 26.x lokalizasyon

---

## Dizin Ağacı

```
boilerplate/
├── apps/
│   ├── web/                        # React web uygulaması (Vite 8 + React Router 7)
│   │   ├── .storybook/             # Storybook 8.6 konfigürasyonu
│   │   ├── e2e/                    # Playwright E2E testleri (3 spec dosyası)
│   │   ├── public/                 # Statik dosyalar (favicon, manifest vb.)
│   │   └── src/
│   │       ├── auth/               # Auth logic: useAuth hook, session yönetimi
│   │       ├── components/         # Uygulamaya özel yerel componentler + birim testleri
│   │       ├── features/           # Feature slice'ları (örn. sample CRUD feature)
│   │       │   └── sample/         # schema, types, api, hooks, List/Form/DetailScreen
│   │       ├── i18n/               # i18next konfigürasyonu + locale JSON dosyaları
│   │       │                       # Namespace'ler: common, shell, auth, validation × tr, en
│   │       ├── layouts/            # Layout wrapper'lar (RootLayout vb.)
│   │       ├── observability/      # Sentry entegrasyonu, analytics, logger altyapısı
│   │       ├── pages/              # Route sayfaları (27 ekran)
│   │       │   ├── auth/           # Login, Register, ForgotPassword, ResetPassword, EmailVerification
│   │       │   ├── onboarding/     # WelcomeSlides, PermissionPrimer
│   │       │   ├── profile/        # Profile, EditProfile, ProfileSetup
│   │       │   ├── settings/       # Settings, NotificationPreferences, ChangePassword, DeleteAccount, About
│   │       │   └── system/         # ErrorBoundary, Loading, Maintenance, NotFound, Offline
│   │       ├── state/              # Zustand 5.x store'ları (stores.ts)
│   │       ├── styles/             # Global Tailwind CSS 4.x stilleri
│   │       └── test/               # Vitest test setup ve global helper'lar
│   │
│   └── mobile/                     # React Native / Expo mobil uygulaması
│       └── src/
│           ├── App.tsx             # Uygulama kök componenti
│           ├── auth/               # Expo SecureStore entegrasyonu, biyometrik auth
│           ├── navigation/         # React Navigation 7.x stack'leri ve tab navigator
│           ├── observability/      # Sentry mobile entegrasyonu
│           ├── screens/            # Ekran componentleri (24 ekran)
│           │   ├── auth/           # Login, Register, ForgotPassword, ResetPassword, EmailVerification
│           │   ├── main/           # Home, Profile, EditProfile, Settings, ChangePassword,
│           │   │                   # DeleteAccount, About, NotificationPrefs
│           │   ├── onboarding/     # WelcomeSlides, ProfileSetup, PermissionPrimer
│           │   ├── sample/         # List, Detail, Form (örnek feature ekranları)
│           │   └── system/         # Error, Loading, Maintenance, NotFound, Offline
│           ├── state/              # Zustand store'ları + persist konfigürasyonu (MMKV)
│           ├── storage/            # MMKV wrapper — mmkv.ts (hızlı yerel depolama)
│           └── theme/              # NativeWind 5.x tema konfigürasyonu
│
├── packages/
│   ├── ui/                         # Cross-platform UI component kütüphanesi (62 export)
│   │   └── src/
│   │       ├── primitives/         # 12 temel layout primitive
│   │       │                       # Box, Stack, Text, Heading, Icon, Pressable,
│   │       │                       # Spacer, Divider, Inline, ScrollContainer,
│   │       │                       # SafeAreaContainer, KeyboardAvoidingContainer
│   │       ├── components/         # 50 Tier2-3 component, 9 kategoride
│   │       │   ├── data/           # Avatar, Badge, Card, Chip, KeyValueRow, ListItem, SectionHeader (7)
│   │       │   ├── feedback/       # Banner, Toast, InlineMessage, NotificationBadge (4)
│   │       │   ├── form/           # Button, IconButton, TextField, Select, Switch,
│   │       │   │                   # FieldShell ve 5 ek form elementi (11 toplam)
│   │       │   ├── input/          # DatePicker, TimePicker, FilePicker, ColorPicker, RatingInput (5)
│   │       │   ├── navigation/     # Header, TabBar, SegmentedControl, StepIndicator (4)
│   │       │   ├── overlay/        # Modal, BottomSheet, ActionSheet, ConfirmDialog,
│   │       │   │                   # Drawer, Popover, Tooltip (7)
│   │       │   ├── state/          # EmptyState, ErrorState, LoadingState, Skeleton, Spinner, ProgressBar (6)
│   │       │   ├── utility/        # Accordion, InfiniteScrollList, PullToRefresh,
│   │       │   │                   # StickyFooter, CountdownTimer, DividerWithLabel ve 2 ek (8)
│   │       │   └── quality/        # AccessibilityAudit — kalite guard componenti (1)
│   │       ├── providers/          # ThemeProvider, useTheme hook'u
│   │       └── quality/            # AuthGuard, ErrorBoundary, ScreenContainer
│   │
│   ├── core/                       # Paylaşılan domain mantığı — platform-agnostic
│   │   └── src/
│   │       ├── api/client.ts       # createApiClient: fetch-first, retry 3x, 401 callback, AbortSignal timeout
│   │       ├── auth/types.ts       # AuthStatus union: authenticated | unauthenticated | refreshing | expired
│   │       ├── hooks/              # useDebounce, useThrottle, usePrevious, useAsync
│   │       └── validation/         # isEmail, isPhoneNumber, isStrongPassword, isURL,
│   │                               # isEmpty, minLength, maxLength
│   │
│   ├── design-tokens/              # Design token sistemi (tek kaynak of truth)
│   │   └── src/
│   │       ├── raw/                # Ham token'lar: 4px-grid spacing, colors, typography,
│   │       │                       # radius, elevation, motion, border, opacity
│   │       ├── semantic/           # Semantic token katmanı:
│   │       │                       # ContentTokens, SurfaceTokens, BorderTokens,
│   │       │                       # InteractiveTokens, FeedbackTokens, OverlayTokens
│   │       ├── themes/             # lightTheme, darkTheme tanımları
│   │       └── css.ts              # generateCSSVariables, flattenTokens (web CSS variable export)
│   │
│   ├── testing/                    # Test utility'leri — waitFor, createMockResponse, createMockError
│   │
│   ├── config-typescript/          # TypeScript konfigürasyonları
│   │                               # base.json (strict, ES2022, react-jsx), web.json, mobile.json, library.json
│   │
│   ├── config-eslint/              # ESLint paylaşılan flat config factory
│   │                               # createConfig(type: 'web' | 'mobile' | 'library')
│   │
│   └── eslint-plugin-bp/           # Projeye özel ESLint plugin (19 kural)
│       └── src/
│           ├── rules/              # 19 kural dosyası — token disiplini + mimari sınır zorlaması
│           │                       # no-hardcoded-color, no-hardcoded-spacing,
│           │                       # no-hardcoded-font-size, no-hardcoded-font-weight,
│           │                       # no-hardcoded-dimension, no-direct-repo-import,
│           │                       # no-raw-pressable, no-raw-touchable, no-rn-text,
│           │                       # no-raw-modal, require-form-hook, require-design-token,
│           │                       # require-accessibility-props, no-barrel-import,
│           │                       # no-token-category-mismatch,
│           │                       # no-direct-phosphor-import, no-direct-vector-icons-import,
│           │                       # no-inline-text-style, no-animated-api
│           ├── configs/
│           │   └── recommended.js  # Önerilen kural seti (warn seviyesi)
│           ├── utils/
│           │   ├── ast-helpers.js  # AST traversal yardımcı fonksiyonları
│           │   └── token-whitelist.js  # İzin verilen token değer beyaz listesi
│           └── index.js            # Plugin giriş noktası ve kural kaydı
│
├── docs/                           # 130+ markdown doküman, 15 kategori
│   ├── adr/                        # 20 Mimari Karar Kaydı (ADR-001 → ADR-020)
│   ├── governance/                 # 18 yönetişim dokümanı (dep policy, AI workflow vb.)
│   ├── ai-guardrails/              # 56 AI guardrail dokümanı (domain + aktivite)
│   ├── architecture/               # 6 mimari doküman (navigation, boundary vb.)
│   ├── design-system/              # 11 design system standardı (token, component gov. vb.)
│   ├── quality/                    # 7 kalite standardı (security, a11y, performance vb.)
│   ├── foundation/                 # 5 temel ilke dokümanı
│   ├── implementation/             # 6 uygulama detayı
│   ├── onboarding/                 # 5 geliştirici onboarding rehberi
│   └── operations/                 # 3 operasyonel rehber
│
├── .github/                        # GitHub Actions, PR şablonu, CODEOWNERS
│   └── workflows/
│       ├── ci.yml                  # Sürekli entegrasyon pipeline'ı
│       ├── deploy.yml              # Deployment workflow'u
│       ├── notify-derived-projects.yml  # Türetilen projelere upstream bildirim
│       └── scheduled-audit.yml     # Zamanlanmış güvenlik ve kalite denetimi
│
├── .moai/                          # MoAI-ADK ajan konfigürasyonları ve durum
├── .claude/                        # Claude Code kuralları, skill'ler ve hook'lar
│
├── turbo.json                      # Turborepo pipeline konfigürasyonu
├── pnpm-workspace.yaml             # Workspace tanımları + bağımlılık katalogu
├── package.json                    # Root script'leri (dev, build, test, lint)
├── tsconfig.json                   # Root TypeScript konfigürasyonu
└── eslint.config.js                # Root ESLint konfigürasyonu (flat config)
                                    # eslint-plugin-bp warn seviyesinde bağlıdır
```

---

## Anahtar Dizinler

### apps/web/src/

| Dizin | Amaç |
|---|---|
| `auth/` | HttpOnly cookie tabanlı auth mantığı, `useAuth` hook'u, session yönetimi |
| `components/` | Uygulamaya özel, yeniden kullanılabilir UI parçaları ve birim testleri |
| `features/` | Kendi içinde kapalı feature modülleri (state, UI, API çağrısı bir arada) |
| `i18n/` | i18next konfigürasyonu, namespace'ler (common/shell/auth/validation), Türkçe/İngilizce locale dosyaları |
| `layouts/` | Sayfa çerçevesi wrapper'ları (header, sidebar, footer bileşimi) |
| `observability/` | Sentry hata takibi, analytics soyutlama katmanı, yapılandırılmış logger |
| `pages/` | React Router 7 route'larına karşılık gelen sayfa componentleri (27 ekran) |
| `state/` | Global Zustand store tanımları (stores.ts) |
| `styles/` | Tailwind CSS 4.x global direktifler ve tema genişlemeleri |

### apps/mobile/src/

| Dizin | Amaç |
|---|---|
| `auth/` | Expo SecureStore ile token saklama, `expo-local-authentication` biyometrik akış |
| `navigation/` | React Navigation stack'leri: Auth, Onboarding, Main Tab, Modal |
| `observability/` | Sentry React Native entegrasyonu |
| `screens/` | Her navigasyon ekranına karşılık gelen screen componentleri (24 ekran) |
| `state/` | Zustand store'ları + MMKV tabanlı persist konfigürasyonu |
| `storage/` | MMKV wrapper — hızlı senkron yerel depolama API'si (mmkv.ts) |
| `theme/` | NativeWind tema ayarları ve karanlık mod konfigürasyonu |

### packages/

| Paket | Amaç |
|---|---|
| `ui` | Web ve mobil arasında paylaşılmış cross-platform component kütüphanesi (62 export, 9 kategori) |
| `core` | Platform-agnostic iş mantığı, API istemcisi, tip sözleşmeleri, validation ve custom hook'lar |
| `design-tokens` | Tasarım sistemi için tek kaynak — raw → semantic → theme katmanlı token mimarisi |
| `testing` | waitFor, createMockResponse, createMockError — bağımsız test utility'leri |
| `config-typescript` | Extend edilebilir tsconfig base'leri (base/web/mobile/library) |
| `config-eslint` | Platform bazında (web/mobile/library) paylaşılmış ESLint flat config factory |
| `eslint-plugin-bp` | 19 kurallı özel ESLint plugin: token disiplini + mimari sınır zorlaması |

### docs/

| Kategori | İçerik |
|---|---|
| `adr/` | ADR-001 → ADR-020: canonical stack, auth, navigation, push, deep link, OTA, IAP, privacy, new architecture, local storage kararları |
| `governance/` | Bağımlılık politikası, AI workflow, AI guardrail yönetişimi, exception policy, upstream sync stratejisi |
| `ai-guardrails/` | Domain (D-UIX, D-SEC, D-TST vb.) ve aktivite (A-NEW-COMP, A-FIX vb.) guardrail dokümanları |
| `design-system/` | Component governance, platform adaptation, error/empty/loading states, motion standardı, design token spec |
| `quality/` | Security baseline, accessibility standard, performance standard |

---

## Modül Organizasyonu

### Dizin Düzeni Kuralları

- **Feature kodu:** `apps/{app}/src/features/{feature}/` — Feature modülü kendi state, hook ve UI'ını içerir
- **Paylaşılmış paket:** `packages/{package}/src/` — Platform-agnostic mantık ve component'ler
- **Test dosyası:** Kaynak dosyayla aynı dizinde, `*.test.ts(x)` uzantısıyla

### Import Yönü Kuralları

```
apps/web        -->  packages/*              İZİNLİ
apps/mobile     -->  packages/*              İZİNLİ
packages/ui     -->  packages/design-tokens  İZİNLİ

packages/*      -->  apps/*                  YASAK
apps/web        <->  apps/mobile             YASAK
packages/ui     -->  packages/core           YASAK
```

Bu kurallar `eslint-plugin-bp` içindeki `no-direct-repo-import` kuralı tarafından otomatik olarak zorlanır. Root `eslint.config.js` dosyasında warn seviyesinde bağlı olan bu kural, sınır ihlallerini CI aşamasında yakalar.

### Boundary Contract

`packages/*` → `apps/*` yönünde import **kesinlikle yasaktır.** Bu kural `45-boilerplate-project-boundary-contract.md` ile kilitlenmiştir. İhlaller `44-exception-and-exemption-policy.md` kapsamında exception kaydı gerektirmektedir.

### Adlandırma Kuralları

| Kural | Örnek |
|---|---|
| Component dosya adı PascalCase | `UserProfileCard.tsx` |
| Hook dosya adı camelCase, `use` önekiyle | `useAuthSession.ts` |
| Store dosya adı camelCase, `store` sonekiyle | `authStore.ts` |
| Test dosyası kaynak adıyla aynı + `.test` | `UserProfileCard.test.tsx` |
| i18n namespace küçük harf, tire ayrımlı | `auth-form`, `settings-page` |

---

## Konfigürasyon Dosyaları

### Monorepo Konfigürasyonu

| Dosya | Amaç |
|---|---|
| `pnpm-workspace.yaml` | Workspace üyeleri (`apps/*`, `packages/*`) + bağımlılık katalogu (sürüm sabitleme) |
| `turbo.json` | Turborepo görev pipeline'ı: `typecheck → lint → test → build` görevleri arası bağımlılıklar |
| `package.json` (root) | Workspace kök script'leri: `dev:web`, `dev:mobile`, `build`, `test`, `typecheck`, `lint` |

### TypeScript Konfigürasyonu

| Dosya | Amaç |
|---|---|
| `tsconfig.json` (root) | Proje referans hub'ı — tüm workspace tsconfig'lerini referans alır |
| `packages/config-typescript/base.json` | Strict mode, path alias, ES2022 target — tüm paketler extend eder |
| `packages/config-typescript/web.json` | Web'e özgü DOM lib ve JSX ayarları |
| `packages/config-typescript/mobile.json` | React Native için özelleştirilmiş ayarlar |
| `packages/config-typescript/library.json` | Paket üretimi için declaration emit ayarları |

### ESLint Konfigürasyonu

| Dosya | Amaç |
|---|---|
| `eslint.config.js` (root) | Flat config entry — config-eslint factory + eslint-plugin-bp warn seviyesinde bağlıdır |
| `packages/config-eslint/` | Platform bazında (web, mobile, library) paylaşılmış ESLint flat config factory |
| `packages/eslint-plugin-bp/` | 19 kurallı özel plugin: token disiplini, mimari sınır, erişilebilirlik zorlaması |

### CI/CD Konfigürasyonu

| Dosya | Amaç |
|---|---|
| `.github/workflows/ci.yml` | PR üzerinde typecheck, lint, test, build adımlarını çalıştırır |
| `.github/workflows/deploy.yml` | `main` branch merge'ünde web ve mobile build + deploy tetikler |
| `.github/workflows/notify-derived-projects.yml` | Upstream değişikliklerde türetilen projelere bildirim gönderir |
| `.github/workflows/scheduled-audit.yml` | Haftalık güvenlik ve bağımlılık denetimi |

### Sentry ve Observability

| Konfigürasyon | Konum |
|---|---|
| Web Sentry init | `apps/web/src/observability/` |
| Mobile Sentry init | `apps/mobile/src/observability/` |
| Analytics soyutlama | `apps/web/src/observability/` — vendor-agnostic event interface |
