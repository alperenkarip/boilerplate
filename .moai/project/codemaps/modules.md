# Modül Tanımları

Son güncelleme: 2026-04-03
Versiyon: 1.0.0

---

## packages/* — Paylaşılan Paketler

### packages/ui

**Sorumluluk:** Cross-platform UI bileşen kütüphanesi. Web (React + Tailwind CSS 4.x) ve mobile (React Native + NativeWind 5.x) için tek kaynak bileşenler üretir.

**Bileşen Hiyerarşisi:**

```
packages/ui/src/
├── primitives/          # Temel yapı taşları
│   ├── Box              # Temel kapsayıcı (div / View)
│   ├── Stack            # Dikey düzen
│   ├── Inline           # Yatay düzen
│   ├── Text             # Tipografi
│   ├── Heading          # Başlık seviyeleri
│   ├── Spacer           # Boşluk yönetimi
│   ├── Divider          # Ayırıcı çizgi
│   ├── Pressable        # Dokunma/tıklama hedefi
│   ├── Icon             # İkon sistemi
│   ├── ScrollContainer  # Kaydırılabilir kapsayıcı
│   ├── SafeAreaContainer # Güvenli alan yönetimi
│   └── KeyboardAvoidingContainer # Klavye kaçınma
│
├── components/
│   ├── data/            # Veri gösterimi (liste, tablo, kart)
│   ├── feedback/        # Kullanıcı geri bildirimi (toast, alert, progress)
│   ├── form/            # Form bileşenleri (input, select, checkbox)
│   ├── navigation/      # Navigasyon öğeleri (tab bar, breadcrumb)
│   ├── overlay/         # Üst katman bileşenler (modal, drawer, popover)
│   ├── state/           # Durum gösterimi (skeleton, empty, error)
│   └── utility/         # Yardımcı bileşenler
│
├── providers/           # Context sağlayıcılar (tema, locale)
├── quality/             # Erişilebilirlik ve kalite yardımcıları
└── index.ts             # Public API
```

**Public Interface:** `packages/ui/src/index.ts` — Tüm dışa aktarılan bileşenler bu dosyadan geçer. Doğrudan iç dosya importu yasaktır.

**Bağımlılıklar:** `packages/design-tokens` (token tüketimi), `packages/config-typescript` (tip yapılandırması)

---

### packages/core

**Sorumluluk:** Uygulama genelinde paylaşılan iş mantığı, tip tanımları ve doğrulama şemaları. Platform-agnostik; Node.js ve tarayıcı ortamlarında çalışır.

**Modül Yapısı:**

```
packages/core/src/
├── auth/        # Auth tip tanımları (User, Session, Token)
├── api/         # API sözleşme tipleri, hata tipleri
├── hooks/       # Platform-agnostik React hook'ları
├── validation/  # Zod şemaları (form ve API doğrulama)
└── index.ts     # Public API
```

**Public Interface:** Auth tipleri, doğrulama şemaları ve paylaşılan hook'lar.

---

### packages/design-tokens

**Sorumluluk:** Tasarım token sistemi. Ham değerler → Semantic tokenlar → Temalar zinciriyle üretilir. Token sistemi `packages/ui` ve uygulama stil katmanlarının tek gerçek kaynağıdır.

**Token Akış Katmanları:**

```
packages/design-tokens/src/
├── raw/           # Ham değerler (sayısal, renk paleti, ölçek)
│   ├── colors     # Tüm renk paleti
│   ├── spacing    # Boşluk ölçeği
│   ├── typography # Font ailesi, boyut, ağırlık
│   ├── motion     # Süre ve easing değerleri
│   ├── border     # Sınır genişlikleri
│   ├── elevation  # Gölge seviyeleri
│   ├── radius     # Köşe yuvarlaklığı
│   └── opacity    # Opaklık değerleri
│
├── semantic/      # Anlamlı isimler (primary, surface, onSurface)
├── themes/        # Açık ve koyu tema oluşumu
├── css.ts         # Web CSS değişkenleri (Tailwind entegrasyonu)
└── theme.css.ts   # React Native (NativeWind) tema nesnesi
```

**Public Interface:** `css.ts` (web), `theme.css.ts` (mobile), `index.ts` (tip tanımları).

---

### packages/testing

**Sorumluluk:** Test yardımcı fonksiyonları, mock'lar ve kurulum dosyaları. Tekrarlayan test altyapısını merkezi hale getirir.

**İçerik:** Custom render fonksiyonları (provider sarmalı), mock factory'ler, test fixtures, MSW handler yardımcıları.

---

### packages/config-typescript

**Sorumluluk:** TypeScript yapılandırma presetleri. Her proje türü için özelleştirilmiş `tsconfig.json` dosyaları içerir.

**Presetler:**
- `base` — Strict mode, temel kurallar
- `web` — Vite ve DOM tipleri
- `mobile` — React Native tipleri
- `library` — Paket yayını için çıktı optimizasyonu

---

### packages/config-eslint

**Sorumluluk:** ESLint flat config presetleri. Platform bazlı kurallar (web/mobile), import yönü kontrolleri ve proje genelinde stil tutarlılığı.

---

## apps/web — Web Uygulaması

**Runtime:** React 19 + Vite + React Router 7, SPA (ADR-001)

**Modül Yapısı:**

```
apps/web/src/
├── main.tsx          # Giriş noktası: Sentry.init → App.tsx render
├── App.tsx           # Provider zinciri + RouterProvider
├── router.tsx        # 27 route tanımı (lazy-loaded)
│
├── features/         # Feature slice'lar (özellik bazlı modüller)
│   └── sample/       # Dikey dilim örneği (liste, form, detay)
│
├── pages/            # Sayfa bileşenleri (route seviyesi)
│   ├── auth/         # Giriş, kayıt, şifre sıfırlama
│   ├── onboarding/   # Karşılama, izin, profil kurulumu
│   ├── profile/      # Profil görüntüleme ve düzenleme
│   ├── settings/     # Ayarlar, bildirimler, hesap
│   └── system/       # Çevrimdışı, bakım, 404
│
├── layouts/          # Paylaşılan düzen bileşenleri
├── auth/             # Auth hook ve oturum yönetimi
├── state/            # Zustand store'ları
├── i18n/             # i18next yapılandırması ve namespace'ler
├── observability/    # Sentry ve analytics entegrasyonu
└── styles/           # Global CSS ve Tailwind direktifleri
```

**Feature Slice Örüntüsü:** `apps/web/src/features/{feature}/`
Her dilim kendi `ListScreen.tsx`, `FormScreen.tsx`, `DetailScreen.tsx` ve varsa hook + servis dosyalarını içerir.

---

## apps/mobile — Mobile Uygulaması

**Runtime:** React Native + Expo SDK 55 + New Architecture (ADR-002, ADR-018)

**Modül Yapısı:**

```
apps/mobile/src/
├── App.tsx           # Giriş noktası: ErrorBoundary → SafeArea → Navigation
│
├── screens/          # Ekran bileşenleri (navigasyon seviyesi)
│   ├── main/         # Ana uygulama ekranları (home, dashboard)
│   ├── auth/         # Kimlik doğrulama ekranları
│   ├── onboarding/   # Karşılama ve izin ekranları
│   ├── sample/       # Örnek dikey dilim
│   └── system/       # Splash, force update
│
├── navigation/       # React Navigation yapılandırması
├── auth/             # SecureStore + biometric auth
├── state/            # Zustand store'ları (mobile)
├── storage/          # MMKV + SecureStore
├── observability/    # Sentry mobile entegrasyonu
└── theme/            # NativeWind tema uygulaması
```

---

## Feature Slice Örüntüsü (Genel)

Her feature dilimi aşağıdaki dosya yapısını takip eder:

```
features/{feature}/
├── {Feature}ListScreen.tsx   # Liste/indeks görünümü
├── {Feature}FormScreen.tsx   # Oluşturma/düzenleme formu
├── {Feature}DetailScreen.tsx # Detay görünümü
├── use{Feature}.ts           # Feature-özel hook
├── {feature}.schema.ts       # Zod doğrulama şemaları
├── {feature}.service.ts      # API çağrıları (varsa)
└── {feature}.test.ts(x)      # Bağlı test dosyası
```

**Kural:** Feature kodları yalnızca `packages/*` paketlerini import edebilir. Başka feature dilimlerini doğrudan import etmek yasaktır.
