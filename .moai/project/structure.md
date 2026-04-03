# Proje Yapısı

Son Güncelleme: 2026-04-03

## Mimari Pattern

**Temel Pattern:** pnpm Monorepo + Turborepo orkestrasyon

Bu proje, tek bir depoda hem web hem de mobil uygulamaları barındıran bir monorepo mimarisi kullanır. `apps/*` altındaki uygulamalar, `packages/*` altındaki paylaşılan kütüphaneleri tüketir. Turborepo, görevleri (build, test, lint) pipeline halinde paralel veya sıralı çalıştırır. pnpm workspace katalogu (`pnpm-workspace.yaml`) bağımlılık versiyonlarını merkezi olarak yönetir.

**Çalışma Zamanı Dağılımı:**
- Web: React + Vite + React Router 7.x (SPA-first)
- Mobil: React Native + Expo SDK 55.x (New Architecture — Fabric + JSI + TurboModules + Hermes V1)
- Ortak: TypeScript strict mode, Zod 4.x şema otoritesi, i18next 26.x lokalizasyon

---

## Dizin Ağacı

```
boilerplate/
├── apps/
│   ├── web/                        # React web uygulaması (Vite + React Router 7)
│   │   ├── .storybook/             # Storybook 10.x konfigürasyonu
│   │   ├── e2e/                    # Playwright E2E testleri (3 spec dosyası)
│   │   ├── public/                 # Statik dosyalar (favicon, manifest vb.)
│   │   └── src/
│   │       ├── auth/               # Auth logic: useAuth hook, session yönetimi
│   │       ├── components/         # Uygulamaya özel yerel componentler + birim testleri
│   │       ├── features/           # Feature slice'ları (örn. sample CRUD feature)
│   │       ├── i18n/               # i18next konfigürasyonu + locale JSON dosyaları
│   │       ├── layouts/            # Layout wrapper'lar (RootLayout vb.)
│   │       ├── observability/      # Sentry entegrasyonu, analytics, logger altyapısı
│   │       ├── pages/              # Route sayfaları (27 ekran)
│   │       │   ├── auth/           # Login, Register, ForgotPassword, ResetPassword, EmailVerification
│   │       │   ├── onboarding/     # WelcomeSlides, PermissionPrimer
│   │       │   ├── profile/        # Profile, EditProfile, ProfileSetup
│   │       │   ├── settings/       # Settings, NotificationPreferences, ChangePassword, DeleteAccount, About
│   │       │   └── system/         # ErrorBoundary, Loading, Maintenance, NotFound, Offline
│   │       ├── state/              # Zustand 5.x store'ları
│   │       ├── styles/             # Global Tailwind CSS 4.x stilleri
│   │       └── test/               # Vitest test setup ve global helper'lar
│   │
│   └── mobile/                     # React Native / Expo mobil uygulaması
│       └── src/
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
│           ├── storage/            # MMKV wrapper (hızlı yerel depolama)
│           └── theme/              # NativeWind 5.x tema konfigürasyonu
│
├── packages/
│   ├── ui/                         # Cross-platform UI component kütüphanesi
│   │   └── src/
│   │       ├── primitives/         # 12+ temel layout primitive
│   │       │                       # Box, Stack, Text, Heading, Icon, Pressable,
│   │       │                       # Spacer, Divider, Inline, ScrollContainer,
│   │       │                       # SafeAreaContainer, KeyboardAvoidingContainer
│   │       ├── components/         # 8 kategoride üst düzey componentler
│   │       │   ├── data/           # Avatar, Badge, Card, Chip, KeyValueRow, ListItem, SectionHeader
│   │       │   ├── feedback/       # Banner, Toast
│   │       │   ├── form/           # Button, IconButton, TextField, Select, Switch,
│   │       │   │                   # FieldShell ve diğer form elementleri
│   │       │   ├── navigation/     # Header, TabBar, SegmentedControl, StepIndicator
│   │       │   ├── overlay/        # Modal, BottomSheet, ActionSheet, ConfirmDialog, Drawer
│   │       │   ├── state/          # EmptyState, ErrorState, LoadingState, Skeleton, Spinner, ProgressBar
│   │       │   └── utility/        # Accordion, InfiniteScrollList, PullToRefresh,
│   │       │                       # StickyFooter, CountdownTimer, DividerWithLabel
│   │       ├── providers/          # Context provider'lar ve paylaşılan hook'lar
│   │       └── quality/            # AuthGuard, ErrorBoundary, ScreenContainer
│   │
│   ├── core/                       # Paylaşılan iş mantığı ve TypeScript tipleri
│   │   └── src/
│   │       ├── auth/types.ts       # AuthStatus, AuthSummary, LogoutCleanupContract
│   │       └── index.ts            # Barrel export (tek giriş noktası)
│   │
│   ├── design-tokens/              # Design token sistemi (tek kaynak of truth)
│   │   └── src/
│   │       ├── raw/                # Ham token'lar: colors, spacing, typography,
│   │       │                       # motion, border, elevation, radius, opacity
│   │       ├── semantic/           # Semantic token eşlemeleri (raw → anlam)
│   │       ├── themes/             # Light / dark tema tanımları
│   │       ├── css.ts              # CSS variable export'ları (web)
│   │       └── theme.css.ts        # Tema CSS üretimi
│   │
│   ├── testing/                    # Test utility'leri ve ortak helper'lar
│   ├── config-typescript/          # TypeScript konfigürasyonları
│   │                               # base.json, web.json, mobile.json, library.json
│   └── config-eslint/              # ESLint paylaşılan flat config
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
```

---

## Anahtar Dizinler

### apps/web/src/

| Dizin | Amaç |
|---|---|
| `auth/` | HttpOnly cookie tabanlı auth mantığı, `useAuth` hook'u, session yönetimi |
| `components/` | Uygulamaya özel, yeniden kullanılabilir UI parçaları ve birim testleri |
| `features/` | Kendi içinde kapalı feature modülleri (state, UI, API çağrısı bir arada) |
| `i18n/` | i18next konfigürasyonu, namespace'ler, Türkçe/İngilizce locale dosyaları |
| `layouts/` | Sayfa çerçevesi wrapper'ları (header, sidebar, footer bileşimi) |
| `observability/` | Sentry hata takibi, analytics soyutlama katmanı, yapılandırılmış logger |
| `pages/` | React Router 7 route'larına karşılık gelen sayfa componentleri |
| `state/` | Global Zustand store tanımları |
| `styles/` | Tailwind CSS 4.x global direktifler ve tema genişlemeleri |

### apps/mobile/src/

| Dizin | Amaç |
|---|---|
| `auth/` | Expo SecureStore ile token saklama, `expo-local-authentication` biyometrik akış |
| `navigation/` | React Navigation stack'leri: Auth, Onboarding, Main Tab, Modal |
| `observability/` | Sentry React Native entegrasyonu |
| `screens/` | Her navigasyon ekranına karşılık gelen screen componentleri |
| `state/` | Zustand store'ları + MMKV tabanlı persist konfigürasyonu |
| `storage/` | MMKV wrapper — hızlı senkron yerel depolama API'si |
| `theme/` | NativeWind tema ayarları ve karanlık mod konfigürasyonu |

### packages/

| Paket | Amaç |
|---|---|
| `ui` | Web ve mobil arasında paylaşılan cross-platform component kütüphanesi |
| `core` | Platform-agnostic iş mantığı tipleri ve sözleşmeleri |
| `design-tokens` | Tasarım sistemi için tek kaynak — renk, tipografi, aralık, motion token'ları |
| `testing` | Render helper'lar, mock factory'ler, test provider wrapper'ları |
| `config-typescript` | Extend edilebilir tsconfig base'leri (web, mobile, library) |
| `config-eslint` | Tüm workspace'lerde paylaşılan ESLint flat config presetleri |

### docs/

| Kategori | İçerik |
|---|---|
| `adr/` | ADR-001 → ADR-020: canonical stack, auth, navigation, push, deep link, OTA, IAP, privacy, new architecture, local storage kararları |
| `governance/` | Bağımlılık politikası, AI workflow, AI guardrail yönetişimi, exception policy, upstream sync stratejisi |
| `ai-guardrails/` | Domain (D-UIX, D-SEC, D-TST vb.) ve aktivite (A-NEW-COMP, A-FIX vb.) guardrail dokümanları |
| `design-system/` | Component governance, platform adaptation, error/empty/loading states, motion standartı, design token spec |
| `quality/` | Security baseline, accessibility standard, performance standard |

---

## Modül Organizasyonu

### Dizin Düzeni Kuralları

- **Feature kodu:** `apps/{app}/src/features/{feature}/` — Feature modülü kendi state, hook ve UI'ını içerir
- **Paylaşılan paket:** `packages/{package}/src/` — Platform-agnostic mantık ve component'ler
- **Test dosyası:** Kaynak dosyayla aynı dizinde, `*.test.ts(x)` uzantısıyla

### Import Yönü Kuralları

```
apps/web        -->  packages/*          IZINLI
apps/mobile     -->  packages/*          IZINLI
packages/ui     -->  packages/design-tokens  IZINLI

packages/*      -->  apps/*              YASAK
apps/web        <->  apps/mobile         YASAK
```

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
| `turbo.json` | Turborepo görev pipeline'ı: `build`, `test`, `lint`, `typecheck` görevleri arası bağımlılıklar |
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
| `eslint.config.js` (root) | Flat config entry — workspace'lerin ortak ESLint preset'ini referans alır |
| `packages/config-eslint/` | Platform bazında (web, mobile, library) paylaşılan ESLint preset'leri |

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
