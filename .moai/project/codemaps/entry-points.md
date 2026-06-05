# Uygulama Giriş Noktaları

Son güncelleme: 2026-06-05
Versiyon: 1.1.0

---

## Web: apps/web

### index.html → src/main.tsx — Birinci Giriş Noktası

```
apps/web/index.html
  └── <script type="module" src="/src/main.tsx">
        └── Sentry.init() — hata izleme başlatma (render öncesi)
        └── ReactDOM.createRoot(document.getElementById('root'))
              .render(<App />)
```

Sentry başlatma, React render döngüsünden önce gerçekleşir; bu sayede ilk render hataları da yakalanır.

### App.tsx — Provider Zinciri (Sıralama Önemlidir)

```
<ErrorBoundary>                    ← Tüm render hatalarını yakalar
  <ThemeProvider>                  ← design-tokens tema bağlamı
    <QueryClientProvider>          ← TanStack Query 5 client
      <RouterProvider>             ← React Router 7 (27 route)
```

Sıralama kasıtlıdır: dış katmanlar hata ve tema sınırları, iç katmanlar veri ve navigasyon bağlamlarıdır.

### router.tsx — 27 Route Tanımı

Tüm route'lar `lazy()` ile dinamik içe aktarılır; ilk yükleme bundle'ı küçük kalır.

**Onboarding Bölümü (S14-S16):**

| Yol | Bileşen | Ekran |
|-----|---------|-------|
| `/onboarding` | WelcomeSlidesPage | S14 |
| `/onboarding/permissions` | PermissionPrimerPage | S15 |
| `/onboarding/profile-setup` | ProfileSetupPage | S16 |

**Auth Bölümü (S08-S12):**

| Yol | Bileşen | Ekran |
|-----|---------|-------|
| `/auth/login` | LoginPage | S08 |
| `/auth/register` | RegisterPage | S09 |
| `/auth/forgot-password` | ForgotPasswordPage | S10 |
| `/auth/reset-password` | ResetPasswordPage | S11 |
| `/auth/verify-email` | EmailVerificationPage | S12 |

**Protected App Shell (S17-S24):**

| Yol | Bileşen | Ekran |
|-----|---------|-------|
| `/` (index) | HomePage | S17 |
| `/profile` | ProfilePage | S18 |
| `/profile/edit` | EditProfilePage | S19 |
| `/settings` | SettingsPage | S20 |
| `/settings/notifications` | NotificationPreferencesPage | S21 |
| `/settings/change-password` | ChangePasswordPage | S22 |
| `/settings/delete-account` | DeleteAccountPage | S23 |
| `/about` | AboutPage | S24 |

**Feature Sample — Dikey Dilim (S25-S27):**

| Yol | Bileşen | Ekran |
|-----|---------|-------|
| `/sample` | features/sample/SampleListScreen | S25 |
| `/sample/new` | features/sample/SampleFormScreen | S26 |
| `/sample/:id` | features/sample/SampleDetailScreen | S27 |

**System Sayfaları (S03-S05):**

| Yol | Bileşen | Ekran |
|-----|---------|-------|
| `/offline` | OfflineScreen | S03 |
| `/maintenance` | MaintenancePage | S04 |
| `*` (404) | NotFoundPage | S05 |

---

## Mobile: apps/mobile

### src/App.tsx — Provider Zinciri (Sıralama Önemlidir)

```
<ErrorBoundary>                    ← Tüm render hatalarını yakalar
  <SafeAreaProvider>               ← expo-safe-area-context
    <ThemeProvider>                ← design-tokens tema bağlamı
      <QueryClientProvider>        ← TanStack Query 5 client
        <NavigationContainer>      ← React Navigation 7 kökü
          <AppNavigator />         ← navigation/AppNavigator.tsx
```

Sıralama kasıtlıdır: SafeAreaProvider NavigationContainer'dan önce gelmek zorundadır; ThemeProvider navigasyon bileşenlerinin token erişimine ihtiyaç duyması nedeniyle NavigationContainer'dan önce yerleştirilir.

### navigation/AppNavigator.tsx — Kök Navigatör

```
AppNavigator (Stack)
  ├── AuthStack (kimlik doğrulama gerekmiyor)
  │   ├── LoginScreen
  │   ├── RegisterScreen
  │   └── ForgotPasswordScreen
  │
  ├── OnboardingStack (ilk açılış)
  │   ├── WelcomeSlidesScreen
  │   └── PermissionPrimerScreen
  │
  ├── MainTab (kimlik doğrulandı)
  │   ├── HomeScreen (Tab)
  │   ├── ProfileScreen (Tab)
  │   └── SettingsScreen (Tab + Stack)
  │
  ├── SampleStack
  │   ├── SampleListScreen
  │   ├── SampleFormScreen
  │   └── SampleDetailScreen
  │
  └── SystemScreens (Modal / Overlay)
      ├── SplashScreen
      ├── ForceUpdateScreen
      └── BiometricPromptScreen
```

**Deep link yapılandırması:** `navigation/linking.ts` — expo-linking ile evrensel bağlantı şemaları (ADR-014).

---

## Paket Barrel Giriş Noktaları

| Paket | Giriş Noktası | Tip |
|-------|---------------|-----|
| packages/ui | `packages/ui/src/index.ts` | TypeScript barrel |
| packages/core | `packages/core/src/index.ts` | TypeScript barrel |
| packages/design-tokens | `packages/design-tokens/src/index.ts` | TypeScript barrel |
| packages/testing | `packages/testing/src/index.ts` | TypeScript barrel |
| packages/config-typescript | `packages/config-typescript/tsconfig.base.json` | JSON config |
| packages/config-eslint | `packages/config-eslint/src/index.js` | JavaScript |
| packages/eslint-plugin-bp | `packages/eslint-plugin-bp/src/index.js` | JavaScript (ESLint plugin) |

**Kural:** Paket içi dosyalara doğrudan import yasaktır. Her import barrel üzerinden geçmelidir (`no-barrel-import` kuralı).

---

## Storybook: apps/web

### .storybook/main.ts

```
Framework: @storybook/react-vite
Addons: a11y, controls, actions, interactions, docs
Stories: packages/ui/src/**/*.stories.{ts,tsx}
```

### .storybook/preview.ts

Provider sarmalı render: `ThemeProvider` tüm story'lerde aktiftir; bu sayede bileşenler gerçek uygulama bağlamında test edilir.

---

## Test Giriş Noktaları

### vitest.config.ts (web)

```
Ortam: jsdom
Kurulum: packages/testing/src/setup.ts
Kapsam: apps/web/src/**/*.test.{ts,tsx}
```

### jest.config.js (mobile)

```
Ön ayar: jest-expo (Hermes uyumlu)
Kurulum: packages/testing/src/setup-native.ts
Kapsam: apps/mobile/src/**/*.test.{ts,tsx}
```

### playwright.config.ts (E2E)

```
Tarayıcılar: chromium, firefox, webkit
Temel URL: http://localhost:5173 (Vite dev server)
Test dizini: apps/web/e2e/
```

---

## CI Giriş Noktaları

Her workflow bağımsız tetikleyiciye sahiptir; commit path filtresi gereksiz çalışmaları önler.

| Workflow | Tetikleyici | Temel Görevler |
|----------|-------------|----------------|
| `ci.yml` | push/PR (main, develop) | typecheck, lint, test, build |
| `mobile.yml` | push/PR (apps/mobile/**) | expo-doctor, EAS build check |
| `e2e.yml` | PR (main) | Playwright E2E |
| `security.yml` | haftalık zamanlı | OWASP bağımlılık taraması |
| `boundary.yml` | push (packages/**, apps/**) | Import yönü doğrulaması |

**CI Aşama Zinciri:**

```
repo-mode
  └── docs-sanity            (CLAUDE.md, ADR format kontrolü)
       └── setup             (pnpm install --frozen-lockfile)
            └── typecheck    (tsc --noEmit tüm workspace)
                 └── lint    (ESLint flat config + eslint-plugin-bp)
                      └── test    (Vitest + jest-expo)
                           └── build     (Vite + Expo)
                                └── expo-doctor   (Expo uyumluluk)
                                     └── boundary  (import yönü)
                                          └── security   (OWASP)
```
