# Veri Akış Yolları

Son güncelleme: 2026-06-05
Versiyon: 1.1.0

---

## 1. Web Uygulama Bootstrap Akışı

```
apps/web/index.html
  └── src/main.tsx
        ├── Sentry.init()             ← izleme, render öncesi başlatılır
        └── ReactDOM.createRoot()
              └── <App />
                    ├── ErrorBoundary
                    ├── ThemeProvider   ← design-tokens lightTheme/darkTheme
                    ├── QueryClientProvider
                    └── RouterProvider
                          └── router.tsx (createBrowserRouter)
                                └── lazy() → sayfa bileşenleri
                                      └── RootLayout.tsx
                                            └── feature bileşenleri
```

---

## 2. Mobile Uygulama Bootstrap Akışı

```
apps/mobile/src/App.tsx
  ├── ErrorBoundary
  ├── SafeAreaProvider        ← expo-safe-area-context
  ├── ThemeProvider           ← design-tokens tema bağlamı
  ├── QueryClientProvider
  └── NavigationContainer     ← React Navigation 7
        └── AppNavigator.tsx
              ├── AuthStack / OnboardingStack / MainTab / SampleStack
              └── SystemScreens (Modal)

Paralel başlatmalar:
  storage/mmkv.ts         ← react-native-mmkv başlatma
  observability/          ← Sentry mobile init
  auth/                   ← SecureStore token kontrolü
```

---

## 3. React Query Veri Çekme Boru Hattı

Bu, projede en yaygın kullanılan veri akışıdır.

```
Kullanıcı etkileşimi veya sayfa yüklenmesi
  │
  ▼
Feature hook (örnek: useSample.ts)
  └── useQuery({ queryKey, queryFn })
        │
        ▼
TanStack Query 5 — QueryClient
  ├── Önbellekte güncel veri var mı?
  │     ├── Evet → önbellekten döndür (stale ise arka planda refetch)
  │     └── Hayır → queryFn çağrısı
  │
  ▼
queryFn: feature.api.ts
  └── createApiClient().get('/api/resource')
        │
        ▼
packages/core/api/client.ts — createApiClient
  ├── fetch() ile HTTP isteği gönderilir
  ├── Hata durumunda: retry 3× (üstel geri çekilme)
  ├── 401 yanıtı: onUnauthorized callback tetiklenir
  │     └── Token yenileme girişimi veya logout
  └── AbortSignal timeout: istek iptal edilir
        │
        ▼
Backend API
  │
  ▼
ApiResponse<T> | ApiError (packages/core/api/types.ts)
  │
  ▼
TanStack Query — cache güncelleme
  │
  ▼
Component yeniden render
  ├── isPending → <Spinner /> veya <Skeleton />
  ├── isError   → <ErrorState />
  └── data      → özelliğe ait UI bileşenleri
        (packages/ui Stack, Card, ListItem vb.)
```

---

## 4. State Yönetimi Akışı (Zustand)

```
apps/{app}/src/state/stores.ts
  └── Zustand store tanımları
        ├── State alanları
        └── Action fonksiyonları
        │
        ▼
Component: useStore() hook çağrısı
  └── Seçici (selector) ile yalnızca gerekli alan okunur
      (gereksiz yeniden render önlenir)
        │
        ▼
Kullanıcı aksiyonu → action fonksiyonu çağrısı
  │
  ▼
Store güncellemesi → ilgili component'ler yeniden render

Kalıcı state:
  apps/mobile → MMKV (react-native-mmkv 3.3.3, Zustand persist middleware)
  apps/web    → localStorage (Zustand persist middleware)
```

---

## 5. Web Auth Akışı (HttpOnly Cookie)

```
Kullanıcı: Login formu gönderme
  │
  ▼
React Hook Form 7 — Controller + register
  └── Zod şeması doğrulama (packages/core/validation)
        ├── Başarısız → alan hata mesajları (i18n key ile)
        └── Başarılı → handleSubmit tetiklenir
              │
              ▼
useMutation → POST /auth/login (createApiClient üzerinden)
  │
  ▼
Backend: credentials doğrulama → HttpOnly cookie set
  │   (cookie JavaScript erişimine kapalı — XSS koruması, ADR-010)
  │
  ▼
apps/web/src/auth/
  ├── useAuth hook → AuthStatus güncelleme ('authenticated')
  └── Korumalı route'lar için AuthGuard (packages/ui/quality)
        │
        ▼
Başarılı → React Router: / (Home) yönlendirme
  │
Oturum süresi doldu:
  TanStack Query 401 interceptor → onUnauthorized callback
    └── useAuth: AuthStatus = 'expired'
          └── React Router: /auth/login yönlendirme
```

---

## 6. Mobile Auth Akışı (SecureStore + Biometric)

```
Uygulama açılışı
  │
  ▼
apps/mobile/src/auth/
  └── SecureStore'dan token okuma (expo-secure-store)
        ├── Token geçerli → MainTab Navigator
        └── Token yok / geçersiz → AuthStack
              │
              ▼
Kullanıcı: Login ekranı
  │
  ▼
Biyometrik uygun mu? (expo-local-authentication, ADR-010)
  ├── Evet → Face ID / Touch ID doğrulama
  └── Hayır → email + şifre formu

  └── createApiClient().post('/auth/login')
        │
        ▼
Token → expo-secure-store (şifreli depolama, Keychain/Keystore)
  │
  ▼
AuthStatus = 'authenticated' → AppNavigator: MainTab
  │
Sonraki açılış:
  SecureStore token okunur → API ile doğrulama
    ├── Geçerli → MainTab
    └── Geçersiz (refresh başarısız) → AuthStack
```

---

## 7. Form Veri Akışı

```
Kullanıcı girişi (input, select, checkbox)
  │
  ▼
React Hook Form 7 — Controller / register
  ├── Anlık doğrulama (onChange modu)
  └── Alan durumları: dirty, touched, error
        │
        ▼
Zod şeması (features/{feature}/{feature}.schema.ts)
  ├── tip güvenli doğrulama
  ├── Başarısız → alan hata mesajları (i18n key ile)
  └── Başarılı → handleSubmit tetiklenir
        │
        ▼
useMutation (TanStack Query)
  └── createApiClient().post() veya .put()
        │
        ▼
Başarılı:
  ├── QueryClient.invalidateQueries() → ilgili cache temizlenir
  └── Router yönlendirme veya Toast bildirimi (packages/ui feedback)

Hata:
  ├── setError() → form alanı hatası
  └── Toast / ErrorState bileşeni (packages/ui)
```

---

## 8. Tasarım Token Akış Zinciri

```
packages/design-tokens/src/raw/
  ├── colors, spacing (4px grid), typography, radius,
      elevation, motion, border, opacity
  │
  ▼
packages/design-tokens/src/semantic/
  ├── ContentTokens   (metin, ikon renkleri)
  ├── SurfaceTokens   (yüzey, arka plan)
  ├── BorderTokens    (sınır renkleri)
  ├── InteractiveTokens (etkileşimli öğeler)
  ├── FeedbackTokens  (başarı/uyarı/hata)
  └── OverlayTokens   (modal, scrim)
  │
  ▼
packages/design-tokens/src/themes/
  ├── lightTheme (semantic → ham değer eşlemesi)
  └── darkTheme  (semantic → ham değer eşlemesi)
  │
  ├── WEB ▼
  │   packages/design-tokens/src/css.ts
  │     → generateCSSVariables(): --color-primary: #...
  │     → flattenTokens(): Tailwind 4 token entegrasyonu
  │     → apps/web/src/styles/globals.css import eder
  │
  └── MOBILE ▼
      packages/design-tokens tema nesnesi
        → NativeWind 5 tema yapılandırması
        → apps/mobile/src/theme/ import eder

packages/ui bileşen kullanımı:
  Web:    <Stack className="bg-surface p-4" />
  Mobile: <Stack className="bg-surface p-4" />
          (NativeWind Tailwind sınıflarını StyleSheet'e çevirir)

Token doğrulama:
  ESLint → eslint-plugin-bp kuralları
    ├── no-hardcoded-color    ← HEX/RGB doğrudan kullanım engellenir
    ├── no-hardcoded-spacing  ← px değerleri doğrudan kullanım engellenir
    └── no-token-category-mismatch ← yanlış kategori (spacing token renk olarak) engellenir
```

---

## 9. i18n Akışı

```
apps/{app}/src/i18n/
  └── i18next yapılandırması
        ├── dil algılama (tarayıcı/cihaz locale)
        ├── namespace yükleme
        └── fallback: tr → en
  │
  locales/
    ├── tr/ {common,shell,auth,validation}.json
    └── en/ {common,shell,auth,validation}.json
  │
  ▼
apps/{app}/src/App.tsx — i18next provider
  │
  ▼
Component: useTranslation('auth') hook çağrısı
  └── t('login.title') → namespace araması → dile göre anahtar çözümü
        │
        ▼
Biçimlendirilmiş string → Component render

Dil değişimi:
  useLocaleStore().setLocale('en')  (Zustand store)
    └── i18next.changeLanguage('en')
          └── Tüm bağlı component'ler yeniden render
                └── Seçim MMKV (mobile) / localStorage (web) kalıcı kayıt

Eksik anahtar:
  i18next fallback → İngilizce namespace denenir
  Hâlâ bulunamazsa → anahtar string olarak gösterilir
  Üretimde → Sentry.captureMessage() uyarısı

Kural: Kullanıcıya gösterilen hiçbir string hardcoded yazılamaz.
```
