# Web Uygulamasi

Bu dizin, boilerplate projesinin web uygulamasini icerir. React 19, Vite 8, React Router 7, Tailwind CSS 4, i18next 26, Zustand 5 ve TanStack Query 5 uzerine kurulmus tek sayfa uygulamasidir (SPA).

## Hizli Baslatma

```bash
# Bagimlilik kurulumu (proje kokunden)
pnpm install

# Gelistirme sunucusu (localhost:3000)
pnpm dev

# Production build
pnpm build
```

Build ciktisi `dist/` dizinine yazilir.

## Ortam Degiskenleri

`.env.example` dosyasini `.env.local` olarak kopyalayarak baslayin:

```bash
cp .env.example .env.local
```

Vite'in client tarafinda erisilebilir kilmasi icin tum ortam degiskenlerinin `VITE_` prefix'i ile baslamasi gerekir. Ornek:

```
VITE_API_BASE_URL=https://api.example.com
VITE_SENTRY_DSN=https://...@sentry.io/...
```

## Dizin Yapisi

```
src/
  pages/          # Sayfa (route) componentleri
  features/       # Feature modulleri (domain bazli is mantigi)
  components/     # Paylasilan UI componentleri
  auth/           # Kimlik dogrulama katmani (HttpOnly cookie session)
  i18n/           # Coklu dil yapilandirmasi ve ceviri dosyalari
  layouts/        # Sayfa iskelet duzenleri (header, sidebar, footer vb.)
  observability/  # Sentry ve izleme entegrasyonu
  state/          # Zustand store tanimlari
  styles/         # Global stiller ve Tailwind yapilandirmasi
  test/           # Test yardimci dosyalari ve setup
```

## Kimlik Dogrulama (Auth)

`src/auth/` dizini HttpOnly cookie tabanli oturum yonetimini icerir. Token'lar JavaScript tarafindan okunamaz; backend tarafindan Set-Cookie header'i ile yonetilir. Bu yaklasim XSS saldirilarina karsi ek koruma saglar.

## State Yonetimi

`src/state/stores.ts` dosyasinda Zustand store'lari tanimlanir. Global uygulama durumu (auth state, tema tercihleri, UI state vb.) burada merkezi olarak yonetilir.

## Tasarim Tokenlari

Renk, spacing, tipografi gibi tasarim degerleri `@project/design-tokens` paketinden alinir. Hardcoded deger kullanmak yerine her zaman semantic token referanslari tercih edilmelidir.

## Coklu Dil (i18n)

`src/i18n/` altinda i18next 26 yapilandirmasi bulunur. Ceviri dosyalari namespace bazli organize edilmistir:

```
src/i18n/locales/
  tr/
    auth.json        # Giris, kayit, sifre islemleri
    common.json      # Genel arayuz metinleri
    shell.json       # Uygulama iskeleti (header, sidebar, footer)
    validation.json  # Form dogrulama mesajlari
  en/
    auth.json
    common.json
    shell.json
    validation.json
```

Desteklenen diller: Turkce (`tr`) ve Ingilizce (`en`). Kullanici arayuzunde gorunen tum metinler i18n key'leri uzerinden cekilmelidir; inline string kullanimi yasaktir.

## Gozlemlenebilirlik (Observability)

`src/observability/sentry.ts` dosyasinda Sentry yapilandirmasi yer alir. DSN degeri `.env.local` dosyasindaki `VITE_SENTRY_DSN` degiskeninden okunur. Sentry, hata izleme ve performans olcumu icin kullanilir.

## Storybook

Projede 85'ten fazla component story'si bulunur. Storybook'u baslatmak icin:

```bash
npx storybook dev -p 6006
```

Storybook, `http://localhost:6006` adresinde acilir. Yeni story yazarken:

- Story dosyalari component dosyasinin yanina `*.stories.tsx` uzantisiyla eklenir.
- Her component icin en az bir default story ve onemli varyantlarin story'leri yazilmalidir.
- Storybook Test ile component testleri story uzerinden de calistirilabilir.

## Testler

### Unit Testler

Vitest ile calistirilir:

```bash
pnpm test
```

Test dosyalari kaynak dosyanin yaninda `*.test.ts(x)` uzantisiyla bulunur. Yapilandirma: `vitest.config.ts`.

### E2E Testler

Playwright ile calistirilir:

```bash
npx playwright test
```

- Yapilandirma: `playwright.config.ts`
- Test dizini: `e2e/`
- Testler production build uzerinde veya dev server'a karsi calistirilabilir.

## Build

```bash
pnpm build
```

Vite, optimize edilmis production ciktisini `dist/` dizinine olusturur. Bu dizin dogrudan statik hosting servislerine deploy edilebilir.
