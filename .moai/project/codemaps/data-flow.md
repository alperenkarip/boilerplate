# Veri Akış Yolları

Son güncelleme: 2026-04-03
Versiyon: 1.0.0

---

## 1. Request Yaşam Döngüsü (API Call → TanStack Query → Component)

```
Kullanıcı etkileşimi
  │
  ▼
Component (useQuery / useMutation çağrısı)
  │
  ▼
TanStack Query 5 — QueryClient
  ├── Önbellekte veri var mı?
  │     ├── Evet → önbellekten döndür (stale ise arka planda refetch)
  │     └── Hayır → queryFn'i çağır
  │
  ▼
queryFn: fetch() tabanlı servis fonksiyonu
  │   packages/core/src/api içindeki tip tanımları kullanılır
  │
  ▼
HTTP İsteği → Backend API
  │
  ▼
Yanıt: JSON → Zod şemasıyla doğrulama (packages/core/src/validation)
  │
  ▼
TanStack Query — Cache güncelleme
  │
  ▼
Component yeniden render → UI güncellenir

Hata durumunda:
  TanStack Query error state → <ErrorState> bileşeni
  Sentry.captureException() → izleme kaydı
```

**Kod konum:** `apps/{app}/src/features/{feature}/{feature}.service.ts` — API çağrıları burada tanımlanır. Tip tanımları `packages/core/src/api/` içinden içe aktarılır.

---

## 2. State Yönetimi Akışı (Zustand → Component → Action)

```
packages/core/src/hooks veya apps/{app}/src/state/
  │
  ▼
Zustand store tanımı
  ├── State alanları (appearance, locale vd.)
  └── Action fonksiyonları (setDensity, setLocale vd.)
  │
  ▼
Component: useAppearanceStore() / useLocaleStore() hook çağrısı
  │
  ├── Seçici (selector) ile yalnızca gerekli alan okunur
  │   (gereksiz yeniden render önlenir)
  │
  ▼
Kullanıcı aksiyonu → action fonksiyonu çağrısı
  │
  ▼
Store güncellemesi → ilgili component'ler yeniden render
  │
  ▼
Kalıcı state (MMKV + Zustand persist middleware):
  apps/mobile/src/storage/ → MMKV
  apps/web → localStorage (persist middleware)
```

**Aktif store'lar:**
- `useAppearanceStore` — Ekran yoğunluğu (density) tercihi
- `useLocaleStore` — Aktif dil tercihi

---

## 3. Auth Akışı

### Web Auth Akışı (HttpOnly Cookie)

```
Kullanıcı: Login formu gönderme
  │
  ▼
React Hook Form → Zod şeması doğrulama
  │
  ▼
useMutation → POST /auth/login
  │
  ▼
Backend: credentials doğrulama → HttpOnly cookie set
  │   (cookie JavaScript erişimine kapalı — XSS koruması)
  │
  ▼
apps/web/src/auth/session.ts
  ├── useAuth hook → oturum durumu yönetimi
  └── Korumalı route'lar için auth guard
  │
  ▼
Başarılı → React Router: / (Home) yönlendirme
  │
  ▼
Oturum süresi doldu → /auth/login yönlendirme
  │   (TanStack Query 401 yanıtı interceptor'ı)
```

### Mobile Auth Akışı (SecureStore + Biometric)

```
Kullanıcı: Login ekranı
  │
  ▼
Biyometrik uygun mu? (expo-local-authentication)
  ├── Evet → Face ID / Touch ID doğrulama
  └── Hayır → email + şifre formu
  │
  ▼
apps/mobile/src/auth/ → token yönetimi
  │
  ▼
Token → expo-secure-store (şifreli depolama)
  │   (Keychain / Keystore yedeklenir)
  │
  ▼
Sonraki açılış: token SecureStore'dan okunur
  └── Geçerli → NavigationContainer: Ana ekran
  └── Geçersiz → Auth stack
```

---

## 4. Form Veri Akışı

```
Kullanıcı girişi (input, select, checkbox)
  │
  ▼
React Hook Form 7 — Controller / register
  ├── Anlık doğrulama (onChange modu)
  └── Alan durumları: dirty, touched, error
  │
  ▼
Zod şeması (packages/core/src/validation veya feature şeması)
  ├── tip güvenli doğrulama
  ├── Başarısız → alan hata mesajları (i18n key ile)
  └── Başarılı → handleSubmit tetiklenir
  │
  ▼
handleSubmit(onValid) çağrısı
  │
  ▼
useMutation (TanStack Query) → API isteği
  │
  ▼
Başarılı:
  ├── QueryClient.invalidateQueries() → ilgili cache temizlenir
  └── Router yönlendirme veya toast bildirimi
  │
Hata:
  ├── setError() → form alanı hatası
  └── Toast / ErrorState bileşeni
```

---

## 5. Tasarım Token Akışı

```
packages/design-tokens/src/raw/
  ├── colors.ts     (tam renk paleti: sayısal değerler)
  ├── spacing.ts    (4px tabanlı ölçek)
  ├── typography.ts (font ailesi, boyut, ağırlık, satır yüksekliği)
  ├── motion.ts     (süre: fast/normal/slow, easing fonksiyonları)
  ├── border.ts     (genişlik seviyeleri)
  ├── elevation.ts  (gölge seviyeleri)
  ├── radius.ts     (köşe yuvarlaklığı ölçeği)
  └── opacity.ts    (opaklık değerleri)
  │
  ▼
packages/design-tokens/src/semantic/
  └── Anlamlı isimler: primary, onPrimary, surface, onSurface,
      error, warning, success, outline, scrim...
  │
  ▼
packages/design-tokens/src/themes/
  ├── light.ts  (açık tema: semantic → ham değer eşlemesi)
  └── dark.ts   (koyu tema: semantic → ham değer eşlemesi)
  │
  ├── WEB ▼
  │   packages/design-tokens/src/css.ts
  │     → CSS özel değişkenleri: --color-primary: #...
  │     → Tailwind CSS 4 token entegrasyonu
  │     → apps/web/src/styles/globals.css import eder
  │
  └── MOBILE ▼
      packages/design-tokens/src/theme.css.ts
        → NativeWind tema nesnesi
        → apps/mobile/src/theme/ import eder

Component kullanımı:
  Web:    <Box className="bg-primary text-on-primary" />
  Mobile: <Box className="bg-primary text-on-primary" />
          (NativeWind Tailwind sınıflarını StyleSheet'e çevirir)
```

**Kural:** Hardcoded renk veya spacing değeri yasaktır. Her değer token üzerinden geçmelidir.

---

## 6. i18n Akışı

```
apps/{app}/src/i18n/
  ├── i18next yapılandırması (dil algılama, namespace'ler)
  └── locales/
       ├── tr/          (Türkçe namespace dosyaları)
       │   ├── common.json
       │   ├── auth.json
       │   └── ...
       └── en/          (İngilizce namespace dosyaları)
            ├── common.json
            └── ...
  │
  ▼
apps/{app}/src/App.tsx — <i18nProvider> ile sarmalanır
  │
  ▼
Component: useTranslation('auth') hook çağrısı
  │
  ▼
t('login.title') → namespace araması → dile göre anahtar çözümü
  │
  ▼
Biçimlendirilmiş string → Component render
  │
  ▼
Dil değişimi:
  useLocaleStore().setLocale('en')
    └── i18next.changeLanguage('en')
         └── Tüm bağlı component'ler yeniden render
              └── Seçim MMKV / localStorage'a kalıcı kayıt

Eksik anahtar:
  → i18next fallback: İngilizce namespace denenır
  → Hâlâ bulunamazsa: anahtar string olarak gösterilir
  → Sentry uyarısı (üretimde)
```

**Kural:** Kullanıcıya gösterilen hiçbir string hardcoded yazılamaz; her metin i18n anahtarı üzerinden geçmelidir.
