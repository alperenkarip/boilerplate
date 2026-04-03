# Uygulama Giriş Noktaları

Son güncelleme: 2026-04-03
Versiyon: 1.0.0

---

## Web: apps/web

### main.tsx — İlk Giriş Noktası

```
apps/web/src/main.tsx
  └── Sentry.init() çağrısı (izleme başlatma)
  └── React DOM render → <App />
```

Sentry başlatma, React render döngüsünden önce gerçekleşir; bu sayede ilk render hataları da yakalanır.

### App.tsx — Provider Zinciri

```
<ErrorBoundary>
  <Sentry.ErrorBoundary>
    <QueryClientProvider>        ← TanStack Query 5
      <ThemeProvider>            ← Tasarım token teması
        <i18nProvider>           ← i18next 26 dil sağlayıcı
          <RouterProvider>       ← React Router 7 (27 route)
```

Sıralama kasıtlıdır: dış katmanlar hata sınırları, iç katmanlar veri ve stil bağlamlarıdır.

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
| `/sample` | features/sample/ListScreen | S25 |
| `/sample/new` | features/sample/FormScreen | S26 |
| `/sample/:id` | features/sample/DetailScreen | S27 |

**System Sayfaları (S03-S05):**
| Yol | Bileşen | Ekran |
|-----|---------|-------|
| `/offline` | OfflineScreen | S03 |
| `/maintenance` | MaintenancePage | S04 |
| `*` (404) | NotFoundPage | S05 |

---

## Mobile: apps/mobile

### App.tsx — Provider Zinciri

```
<ErrorBoundary>
  <SafeAreaProvider>           ← Güvenli alan yönetimi
    <NavigationContainer>      ← React Navigation 7
      <RootNavigator>          ← Ana navigasyon kökü
```

### Ekran Grupları

| Grup | Ekranlar | Navigatör Türü |
|------|----------|----------------|
| Onboarding | WelcomeSlides, PermissionPrimer | Stack |
| Auth | Login, Register, ForgotPassword | Stack |
| Main | Home, Profile, Settings | Tab + Stack |
| Sample | List, Form, Detail | Stack |
| System | Splash, ForceUpdate, BiometricPrompt | Modal / Overlay |

---

## Storybook: apps/web

### .storybook/main.ts

```
Framework: @storybook/react-vite
Addons: a11y, controls, actions, interactions, docs
Stories: packages/ui/src/**/*.stories.{ts,tsx}
```

### .storybook/preview.ts

Provider sarmalı render: `ThemeProvider` ve `i18nProvider` tüm story'lerde aktiftir; bu sayede bileşenler gerçek uygulama bağlamında test edilir.

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
Ön ayar: expo/jest-preset (Hermes uyumlu)
Kurulum: packages/testing/src/setup-native.ts
Kapsam: apps/mobile/src/**/*.test.{ts,tsx}
```

### playwright.config.ts (E2E)

```
Tarayıcılar: chromium, firefox, webkit
Temel URL: http://localhost:5173 (web dev server)
Test dizini: apps/web/e2e/
```

---

## CI Giriş Noktaları

### .github/workflows/

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
  └── docs-sanity          (CLAUDE.md, ADR formatı kontrolü)
       └── setup            (pnpm install --frozen-lockfile)
            └── typecheck   (tsc --noEmit tüm workspace)
                 └── lint   (ESLint flat config)
                      └── test  (Vitest + Jest)
                           └── build  (Vite + Expo)
                                └── expo-doctor  (Expo uyumluluk)
                                     └── boundary  (import yönü)
                                          └── security  (OWASP)
```

---

## Storybook ve Bileşen Lab Başlatma

```bash
# Storybook geliştirme sunucusu
pnpm storybook

# Storybook static build
pnpm build-storybook
```

Storybook yalnızca `apps/web` altında yapılandırılmıştır; `packages/ui` story dosyaları buradan otomatik keşfedilir.
