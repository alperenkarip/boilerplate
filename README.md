# Cross-Platform Boilerplate

React (web) ve React Native/Expo (mobil) uzerinde kurulu, documentation-first, kalite standartli cross-platform urun gelistirme temeli.

---

## Icindekiler

- [Proje Tanitimi](#proje-tanitimi)
- [Baslangic Rehberi](#baslangic-rehberi)
- [Yeni Proje Turetme Rehberi](#yeni-proje-turetme-rehberi)
- [Proje Yapisi](#proje-yapisi)
- [Gelistirme Sureci](#gelistirme-sureci)
- [Build, Deploy ve Ortam Yonetimi](#build-deploy-ve-ortam-yonetimi)
- [Kullanim Kilavuzu](#kullanim-kilavuzu)
- [Sik Karsilasilan Sorunlar](#sik-karsilasilan-sorunlar)
- [Ilgili Dokumanlar](#ilgili-dokumanlar)

---

## Proje Tanitimi

### Nedir?

Bu boilerplate, cross-platform urun gelistirme baslangicindan itibaren dogru mimari kararlar, kalite standartlari ve governance mekanizmalariyla donatilmis bir temeldir. Amaci:

- Yanlis teknoloji secimleri ve mimari drift'i onlemek
- Web ve mobil arasinda urun mantigi ve kalite standardinda birlik saglamak
- Apple HIG uyumlu, erisilebilir, performansli urunler uretmek
- Ekip buyudukce kalite korumasini otomatik hale getirmek

### Platform Felsefesi

Web ve mobil ayni urun sisteminin iki farkli platform yorumudur. Amac "maksimum shared code" degil, **urun mantigi ve kalite standardinda birliktir**. Platform dogal kullanim modelini bastirmak kabul edilmez — gerekli yerde platform-spesifik ayrisma bilincli yapilir.

### Teknoloji Stack'i (Canonical — Degistirilemez)

Bu kararlar ADR-001 → ADR-019 ile kilitlenmistir. Alternatif onermek, sorgulatmak veya bypass etmek yasaktir.

| Alan               | Teknoloji                                                | Versiyon            | ADR     |
| ------------------ | -------------------------------------------------------- | ------------------- | ------- |
| Web runtime        | React + Vite + React Router                              | 7.x                 | ADR-001 |
| Mobil runtime      | React Native + Expo                                      | SDK 55.x            | ADR-002 |
| Monorepo           | pnpm + Turborepo                                         | 10.x / 2.x          | ADR-003 |
| State management   | Zustand                                                  | 5.x                 | ADR-004 |
| Data fetching      | fetch-first + TanStack Query                             | 5.x                 | ADR-005 |
| Forms              | React Hook Form + Zod                                    | 7.x / 4.x           | ADR-006 |
| Styling/tokens     | Tailwind CSS + NativeWind                                | 4.x / 5.x           | ADR-007 |
| Testing            | Vitest + Jest + Playwright                               | 4.x / 30.x / 1.58.x | ADR-008 |
| Component lab      | Storybook + Storybook Test                               | 8.x                 | ADR-008 |
| Observability      | Sentry + vendor-agnostic analytics                       | -                   | ADR-009 |
| Auth               | HttpOnly cookies (web) + SecureStore (mobil) + Biometric | -                   | ADR-010 |
| i18n               | i18next, namespace-based                                 | 26.x                | ADR-011 |
| Navigation         | React Router (web) + React Navigation (mobil)            | 7.x / 7.x           | ADR-012 |
| Push notification  | expo-notifications + FCM/APNs                            | -                   | ADR-013 |
| Deep linking       | expo-linking + Universal Links + App Links               | -                   | ADR-014 |
| OTA update         | EAS Update                                               | -                   | ADR-015 |
| In-app purchase    | RevenueCat (react-native-purchases)                      | -                   | ADR-016 |
| Privacy/compliance | GDPR + KVKK uyum cercevesi                               | -                   | ADR-017 |
| New architecture   | Fabric + JSI + TurboModules + Hermes V1                  | -                   | ADR-018 |
| Local storage      | MMKV + Expo SecureStore + Zustand persist                | -                   | ADR-019 |

**Watchlist** (henuz canonical degil, izleniyor): React Compiler, Biome 2.x, @expo/ui 1.0

---

## Baslangic Rehberi

### On Kosullar

| Arac    | Minimum Versiyon | Kontrol Komutu   |
| ------- | ---------------- | ---------------- |
| Node.js | 20.x             | `node --version` |
| pnpm    | 10.x             | `pnpm --version` |
| Git     | 2.40+            | `git --version`  |

```bash
# Node.js yoksa
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
nvm install 20

# pnpm yoksa
corepack enable
corepack prepare pnpm@latest --activate
```

### Kurulum

```bash
# 1. Repo'yu klonla
git clone <REPO_URL> my-project
cd my-project

# 2. Bagimliliklari kur
pnpm install

# 3. Ortam degiskenlerini ayarla
cp .env.example .env.local
# .env.local dosyasini proje-ozel degerlerle doldur

# 4. Saglik kontrolu
pnpm turbo run build --dry-run
```

### Ortam Degiskenleri

`.env.example` dosyasini `.env.local` olarak kopyalayin. Asagidaki tum degiskenleri yapilandirin:

| Degisken                         | ADR     | Aciklama                 | Nereden Alinir                         |
| -------------------------------- | ------- | ------------------------ | -------------------------------------- |
| `VITE_APP_NAME`                  | —       | Uygulama adi             | Proje adi                              |
| `VITE_API_BASE_URL`              | —       | Backend API adresi       | Backend ekibi                          |
| `VITE_SENTRY_DSN`                | ADR-009 | Web Sentry DSN           | sentry.io → Proje → Client Keys        |
| `EXPO_PUBLIC_SENTRY_DSN`         | ADR-009 | Mobile Sentry DSN        | Ayni Sentry projesi                    |
| `VITE_ANALYTICS_KEY`             | ADR-009 | Web analytics API key    | Vendor paneli (Segment, Amplitude vb.) |
| `EXPO_PUBLIC_ANALYTICS_KEY`      | ADR-009 | Mobile analytics key     | Ayni vendor                            |
| `VITE_DEEP_LINK_DOMAIN`          | ADR-014 | Universal Links domain   | Proje domain'i                         |
| `EXPO_PUBLIC_DEEP_LINK_DOMAIN`   | ADR-014 | App Links domain         | Ayni domain                            |
| `EXPO_PUBLIC_EAS_PROJECT_ID`     | ADR-015 | EAS Update proje ID      | `eas init` komutu                      |
| `EXPO_PUBLIC_FCM_SENDER_ID`      | ADR-013 | Firebase Cloud Messaging | Firebase Console → Project settings    |
| `EXPO_PUBLIC_REVENUECAT_API_KEY` | ADR-016 | In-app purchase API key  | app.revenuecat.com                     |
| `VITE_PRIVACY_POLICY_URL`        | ADR-017 | Gizlilik politikasi URL  | Hukuk ekibi                            |
| `VITE_TERMS_OF_SERVICE_URL`      | ADR-017 | Kullanim sartlari URL    | Hukuk ekibi                            |

> `.env` dosyalari `.gitignore` ile korunur. Gercek credential'lar asla repo'ya girmez.

### Ilk Calistirma

```bash
# Web development server
pnpm dev:web
# http://localhost:3000 adresinde acilir

# Mobile development server (Expo dev client)
pnpm dev:mobile
# Development build gereklidir (Expo Go yeterli degildir)
```

### Storybook (Component Lab)

Projede 85+ component, her birinin Storybook story'si bulunur.

```bash
cd apps/web && npx storybook dev -p 6006
# http://localhost:6006 adresinde acilir
```

**Story yazma convention:** Her component'in yaninda `ComponentName.stories.tsx` dosyasi bulunur. Yeni component olustururken story dosyasi zorunludur.

```typescript
// Ornek: Button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  component: Button,
  title: 'Form/Button',
};
export default meta;

type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: { children: 'Tikla', variant: 'primary' },
};
```

Detay: `apps/web/.storybook/` (main.ts, preview.ts)

### Mobile Ilk Build (Zorunlu)

Expo Go, New Architecture (Fabric, JSI, TurboModules) ve native moduller nedeniyle **yeterli degildir**. Development client build gereklidir:

```bash
cd apps/mobile

# 1. Native projeleri olustur
npx expo prebuild

# 2. iOS simulator'da calistir
npx expo run:ios

# 3. Android emulator'da calistir
npx expo run:android

# 4. Saglik kontrolu
npx expo-doctor
```

**Ne zaman `prebuild` tekrar gerekir:**

- Yeni native modul eklediginde (expo install ile)
- app.json'da plugin degisikligi yaptiginda
- Expo SDK upgrade yaptiginda

### Expo Hesap ve EAS Kurulumu

EAS (Expo Application Services) build, submit ve OTA update icin gereklidir.

```bash
# 1. EAS CLI kur
npm install -g eas-cli

# 2. Expo hesabina giris yap
eas login

# 3. Proje olustur (Project ID alinir)
cd apps/mobile
eas init

# 4. app.json'a Project ID yaz
# expo.updates.url → "https://u.expo.dev/<PROJECT_ID>"
```

**EAS Build profilleri** (`apps/mobile/eas.json`):

| Profil        | Amac                               | Komut                             |
| ------------- | ---------------------------------- | --------------------------------- |
| `development` | Dev client build, internal dagitim | `eas build --profile development` |
| `preview`     | Test build, iOS simulator destekli | `eas build --profile preview`     |
| `production`  | Store submission, auto-increment   | `eas build --profile production`  |

### App Store / Play Store Hazirligi

**iOS — Apple Developer Account:**

1. developer.apple.com'da hesap olustur veya ekibe katil
2. Bundle ID olustur (Certificates, Identifiers & Profiles)
3. `eas.json`'da `appleId` ve `ascAppId` degerlerini doldur
4. Provisioning profile ve signing certificate EAS tarafindan yonetilir

**Android — Google Play Console:**

1. play.google.com/console'da hesap olustur
2. Uygulama olustur, package name gir (app.json'daki `android.package`)
3. Service account key olustur → `google-services-key.json` olarak kaydet
4. `eas.json`'da `serviceAccountKeyPath`'i dogrula

### Uygulama Ikon ve Splash Ekrani

Asset dosyalari `apps/mobile/assets/` altindadir:

| Dosya               | Boyut        | Kullanim                         |
| ------------------- | ------------ | -------------------------------- |
| `icon.png`          | 1024x1024 px | iOS ve Android uygulama ikonu    |
| `adaptive-icon.png` | 1024x1024 px | Android adaptive icon foreground |
| `splash.png`        | 1284x2778 px | Splash screen gorseli            |

Olusturma araclari: [icon.kitchen](https://icon.kitchen), Figma, veya tasarim ekibinden alinir.

### Analytics Vendor Secimi

Projede vendor-agnostic analytics abstraction katmani kullanilir (ADR-009). Varsayilan olarak no-op adapter aktiftir.

Vendor secimi yapildiginda:

1. Vendor SDK'sini yukle (orn: `pnpm add @segment/analytics-react-native`)
2. `apps/*/src/observability/analytics.ts` dosyasindaki adapter'i implement et
3. `.env`'deki `VITE_ANALYTICS_KEY` / `EXPO_PUBLIC_ANALYTICS_KEY` degerlerini doldur

Desteklenen vendor ornekleri: Segment, Amplitude, Mixpanel, PostHog.

### Sentry Kurulumu

**Web** (hazir): `@sentry/react` dependency'de, `apps/web/src/observability/sentry.ts` config hazir. Sadece `VITE_SENTRY_DSN` degiskeni doldurulmali.

**Mobile** (kurulum gerekli):

1. `cd apps/mobile && pnpm add @sentry/react-native`
2. `apps/mobile/src/observability/sentry.ts` dosyasindaki conditional import otomatik aktif olacak
3. `EXPO_PUBLIC_SENTRY_DSN` degiskenini doldur

Sentry DSN almak: sentry.io → Proje olustur → Settings → Client Keys (DSN)

### Kalite Kontrolleri

```bash
pnpm typecheck        # TypeScript tip kontrolu
pnpm lint             # ESLint kontrolu
pnpm test             # Tum testler (Vitest web, Jest mobile)
pnpm build            # Tum workspace'i derle
pnpm verify           # typecheck + lint + test hepsini calistirir
```

### Workspace Komutlari

```bash
# Workspace komutlari
pnpm dev:web              # Web dev server (port 3000)
pnpm dev:mobile           # Expo dev client
pnpm build                # Tum workspace build
pnpm typecheck            # TypeScript kontrolu
pnpm lint                 # ESLint kontrolu
pnpm test                 # Tum testler (Vitest + Jest)
pnpm verify               # typecheck + lint + test (CI gate)
pnpm clean                # node_modules + dist temizligi
```

### AI Workflow ve Arac Zinciri

Bu projede AI-assisted gelistirme altyapisi aktiftir. Ilk kurulumda asagidaki adimlari tamamlayin.

#### MoAI-ADK Kurulumu

```bash
# 1. MoAI-ADK'yi kur
npm install -g moai-adk

# 2. Proje icinde init et (mevcut CLAUDE.md korunur, .moai/ dizini olusur)
moai init

# 3. Calistigini dogrula
/moai project

# 4. Karmasik gorevlerde SPEC olustur
/moai plan "gorev aciklamasi"
# SPEC dosyasi .moai/specs/ altinda olusur
```

- SPEC-first yaklasim: karmasik gorevlerde once `/moai plan` ile SPEC olusturulur
- TRUST 5 kalite kurallari gecerlidir
- `.moai/specs/` dizininde implementasyon planlari tutulur
- Referans: `.moai/specs/SPEC-IMP-001-implementation-roadmap.md` (bu projenin implementasyon plani)

#### Claude Code Kurulumu

```bash
# 1. Claude Code CLI'yi kur
npm install -g @anthropic-ai/claude-code

# 2. Proje dizininde calistir — CLAUDE.md otomatik okunur
claude

# 3. Hook'lari dogrula (pre/post edit guardrail)
ls .claude/hooks/
# pre-edit-guardrail.sh ve post-edit-guardrail.sh mevcut olmali

# 4. Settings dogrula
cat .claude/settings.json
# hooks ve MCP konfigurasyonu gorunur
```

- `CLAUDE.md` proje talimatlari, `AGENTS.md` review kurallari
- `.claude/hooks/` ile pre/post edit guardrail hook'lari otomatik calisir
- `.claude/settings.json` ile hook + MCP konfigurasyonu

#### Stitch MCP Kurulumu

```bash
# 1. .claude/settings.json icinde Stitch MCP yapilandirmasi dogrula
cat .claude/settings.json | grep -A5 "stitch"

# 2. Figma'dan tasarim verisi cekmek icin:
# - Figma dosyasini ac
# - Stitch plugin'i calistir
# - DESIGN.md dosyasi proje kokune export et

# 3. Component uretiminde DESIGN.md otomatik referans alinir
```

#### Codex Kurulumu

```bash
# 1. GitHub repo'ya Codex app ekle
# https://github.com/apps/codex adresinden Install

# 2. Repo'yu sec ve yetkilendir

# 3. Dogrula: PR acildiginda @codex otomatik review yapmali
# AGENTS.md dosyasi review kurallarini tanimlar
```

#### Guardrail Sistemi

Kod uretimi veya duzenleme yapmadan ONCE guardrail protokolu otomatik tetiklenir:

| Asama                  | Skill              | Aciklama                      |
| ---------------------- | ------------------ | ----------------------------- |
| Is baslangici          | `/guardrail-check` | Ilgili domain kurallarini oku |
| Is tamamlandiginda     | `/guardrail-audit` | Toplu denetim raporu          |
| Dependency degisikligi | `/dep-check`       | Policy kontrolu               |
| PR/commit oncesi       | `/pre-pr`          | Kapsamli kalite kontrolu      |

Guardrail dokumanlari: `docs/ai-guardrails/domain/` ve `docs/ai-guardrails/activity/`

Detay: `docs/governance/47-ai-guardrail-governance.md`

#### Sentry Kurulumu

```bash
# 1. Sentry'de yeni proje olustur (React + React Native)
# https://sentry.io → Create Project

# 2. DSN'yi .env.local'a ekle
VITE_SENTRY_DSN=https://xxx@o123.ingest.sentry.io/456
EXPO_PUBLIC_SENTRY_DSN=https://xxx@o123.ingest.sentry.io/456

# 3. Sentry otomatik baslatilir (apps/web/src/main.tsx icinde initSentry)
# 4. Hassas veri filtreleme beforeSend ile aktif (Authorization, Cookie header'lari)
```

#### EAS (Expo Application Services) Kurulumu

```bash
# 1. EAS CLI kur
npm install -g eas-cli

# 2. Expo hesabina giris yap
eas login

# 3. EAS projesi olustur
cd apps/mobile
eas build:configure

# 4. eas.json zaten mevcut (development, preview, production profilleri)
# 5. Ilk build
eas build --platform ios --profile development
```

Detay: `docs/adr/ADR-015-ota-update-strategy.md`

#### pnpm Catalog (Single-Source Versioning)

Tum canonical dependency versiyonlari `pnpm-workspace.yaml` icindeki `catalog:` bloğunda tanimlidir. Package.json'larda `"react": "catalog:"` seklinde tuketilir — versiyon tek noktadan yonetilir.

```yaml
# pnpm-workspace.yaml ornegi
catalog:
  react: 19.2.0
  typescript: ^5.9.3
  zustand: ^5.0.12
  # ... diger canonical dependency'ler
```

#### Implementasyon Yol Haritasi

Bu projenin implementasyon plani SPEC-IMP-001 olarak belgelenmistir:

- **Dosya:** `.moai/specs/SPEC-IMP-001-implementation-roadmap.md`
- **Kapsam:** Gate C → Faz A-R (bootstrap → vertical slice → first audit)
- **Durum:** 395/395 checkbox tamamlandi
- **Referans:** `docs/roadmap/19-roadmap-to-implementation.md`, `docs/implementation/20-initial-implementation-checklist.md`

### Ortam Degiskenleri

Ortam degiskenleri detayli tablosu icin yukardaki [Ortam Degiskenleri](#ortam-degiskenleri) bolumune bakin.

---

## Yeni Proje Turetme Rehberi

Bu boilerplate'ten yeni bir proje turetmek icin asagidaki adimlari izleyin. Surecin buyuk bolumu `create-project.sh` scripti ile otomatize edilmistir.

### On Kosullar

| Gereksinim          | Aciklama                                               |
| ------------------- | ------------------------------------------------------ |
| Node.js 20.x        | `nvm use` veya `.nvmrc` ile saglanan exact hat         |
| pnpm 10.x           | `corepack enable && corepack prepare` ile saglanir     |
| Git 2.40+           | Repo olusturmak ve upstream remote tanimlamak icin     |
| jq                  | JSON dosyalarini donusturmek icin (script bagimliligi) |
| Boilerplate erisimi | Bu repo'yu clone edebilme veya fork yapabilme          |

### Hizli Baslangic (Otomatik)

```bash
# 1. Boilerplate'i klonla
git clone <BOILERPLATE_REPO_URL> my-project
cd my-project

# 2. Git gecmisini temizle (temiz baslangic icin)
rm -rf .git
git init
git add -A
git commit -m "Boilerplate'ten turetildi"

# 3. Turetme scriptini calistir
./tooling/derive/create-project.sh \
  --name "myapp" \
  --scope "@myapp" \
  --display-name "My App" \
  --bundle-id "com.myorg.myapp" \
  --domain "myapp.com" \
  --description "Proje aciklamasi" \
  --upstream-url "https://github.com/org/boilerplate.git"

# 4. Ilk commit
git add -A
git commit -m "Proje olusturuldu: My App"

# 5. Remote'a push
git remote add origin <PROJE_REPO_URL>
git push -u origin main
```

### Script Ne Yapar?

`create-project.sh` tek komutla su islemleri gerceklestirir:

| Faz           | Islem                | Detay                                                           |
| ------------- | -------------------- | --------------------------------------------------------------- |
| **Kimlik**    | Scope rename         | Tum `package.json` dosyalarinda `@project/` → `@{scope}/`       |
| **Kimlik**    | Import guncelleme    | Kaynak koddaki `@project/` referanslarini gunceller             |
| **Platform**  | Expo config          | `app.json`'da ad, slug, bundle ID, domain gunceller             |
| **Platform**  | Web config           | `index.html` title, `.env.example` app name gunceller           |
| **Platform**  | CI/CD                | Workflow dosyalarindaki scope ve yorum referanslarini gunceller |
| **Dokuman**   | BOUNDARY.md          | Upstream sync contract dosyasini olusturur                      |
| **Dokuman**   | .sync-config.yaml    | Adaptive sync degiskenlerini olusturur                          |
| **Dokuman**   | CHANGELOG.md         | Projenin ilk CHANGELOG girdisini olusturur                      |
| **Dokuman**   | CLAUDE.md            | Proje Kimligi bolumunu gunceller                                |
| **Dokuman**   | AGENTS.md            | Basligi gunceller                                               |
| **Uyarlama**  | derived-projects.txt | Boilerplate listesini temizler                                  |
| **Uyarlama**  | notify workflow      | Push trigger'i devre disi birakir                               |
| **Uyarlama**  | PDR dosyalari        | Icerik sifirlanir, sablon birakilir                             |
| **Dogrulama** | Kontrol              | Kalan referanslari tarar, typecheck ve build calistirir         |

### Script Parametreleri

| Parametre        | Zorunlu | Aciklama               | Ornek                           |
| ---------------- | ------- | ---------------------- | ------------------------------- |
| `--name`         | Evet    | Proje slug'i           | `myapp`                         |
| `--scope`        | Evet    | npm scope              | `@myapp`                        |
| `--display-name` | Evet    | Insan-okur ad          | `My App`                        |
| `--bundle-id`    | Evet    | iOS/Android identifier | `com.myorg.myapp`               |
| `--domain`       | Evet    | Deep link domain       | `myapp.com`                     |
| `--description`  | Hayir   | Proje aciklamasi       | `E-ticaret uygulamasi`          |
| `--upstream-url` | Hayir   | Boilerplate repo URL   | `https://github.com/org/bp.git` |
| `--skip-install` | Hayir   | pnpm install atla      | —                               |
| `--skip-verify`  | Hayir   | Dogrulama atla         | —                               |

### Script Sonrasi Manuel Adimlar

Script mekanik donusumleri halleder. Asagidaki adimlar manuel tamamlanmalidir:

#### 1. Ortam Degiskenleri

```bash
cp .env.example .env.local
# .env.local dosyasini gercek degerlerle doldurun
```

#### 2. Design Token'lar

Projenin gorsel kimligini design token sistemine girin. Token dosyalari `packages/design-tokens/src/` altindadir.

| Dosya               | Icerigi                                |
| ------------------- | -------------------------------------- |
| `raw/colors.ts`     | Renk paleti (brand, neutral, semantic) |
| `raw/typography.ts` | Font ailesi, boyut, satir yuksekligi   |
| `raw/spacing.ts`    | Spacing scale                          |
| `themes/light.ts`   | Light tema semantic degerleri          |
| `themes/dark.ts`    | Dark tema semantic degerleri           |

Token hiyerarsisi: `raw (palette) → semantic (roles) → component (consumption)`. Bu yapi degistirilemez.

#### 3. EAS Yapilandirmasi

`apps/mobile/eas.json` dosyasindaki placeholder'lari doldurun:

```json
{
  "submit": {
    "production": {
      "ios": {
        "appleId": "GERCEK_APPLE_ID",
        "ascAppId": "GERCEK_ASC_APP_ID"
      }
    }
  }
}
```

#### 4. README Guncelleme

Bu README dosyasini projenize uygun iceritle guncelleyin. "Proje Tanitimi" bolumundeki boilerplate aciklamasini projenizin tanitimi ile degistirin.

#### 5. AI ile Yeniden Olusturulmasi Gereken Dosyalar

Turetme sonrasi asagidaki dosyalar hala boilerplate icerigi tasir. Claude Code veya MoAI ile projeye ozel yeniden uretilmelidir:

**Hemen (turetme sonrasi):**

| Dosya                         | Komut / Yontem   | Aciklama                                    |
| ----------------------------- | ---------------- | ------------------------------------------- |
| `.moai/project/product.md`    | `/moai project`  | Boilerplate urun tanimi → proje urun tanimi |
| `.moai/project/structure.md`  | `/moai project`  | Dizin yapisi haritasi                       |
| `.moai/project/tech.md`       | `/moai project`  | Teknik detaylar                             |
| `.moai/project/codemaps/*.md` | `/moai codemaps` | Kod haritalari (5 dosya)                    |

**Ilk hafta:**

| Dosya                                        | Yontem                            | Aciklama                                  |
| -------------------------------------------- | --------------------------------- | ----------------------------------------- |
| `docs/onboarding/ilk-30-dakika.md`           | Manuel veya AI ile yaz            | Projeye ozel onboarding rehberi           |
| `docs/onboarding/rol-bazli-okuma-rehberi.md` | Manuel veya AI ile yaz            | Ekip yapisina gore okuma rehberi          |
| `.moai/design/system.md`                     | Design token doldurulduktan sonra | Projenin gorsel kimlik dokumani           |
| `README.md` Proje Tanitimi bolumu            | Manuel                            | Boilerplate aciklamasi → proje aciklamasi |

#### 6. Kalite Kontrolu

```bash
pnpm typecheck   # TypeScript kontrolu
pnpm lint        # ESLint kontrolu
pnpm test        # Test suite
pnpm build       # Production build
```

Tum komutlar basariyla gecmelidir. CI pipeline (`.github/workflows/ci.yml`) push ve PR'larda bu kontrolleri otomatik calistirir.

### Upstream Sync (Surekli Guncel Kalma)

Turetilen proje, boilerplate guncellemelerini periyodik olarak alir. Bu mekanizma otomatik kurulur:

```bash
# Boilerplate'in yeni versiyonunu al
git fetch upstream --tags
git tag -l 'bp-v*' --sort=-v:refname | head -5

# Sync calistir
./tooling/sync/upstream-sync.sh bp-v1.2.0
```

Sync mekanizmasinin detaylari: `docs/governance/49-upstream-sync-strategy.md`
Sync rehberi: `docs/onboarding/upstream-sync-rehberi.md`

### Detayli Rehber

Adim adim tum surec (10 adim, dogrulama kriterleriyle): `docs/implementation/43-derived-project-creation-guide.md`

---

## Proje Yapisi

### Dizin Agaci

```
/
├── apps/
│   ├── web/                        # React + Vite 8 web uygulamasi
│   │   ├── src/
│   │   │   ├── pages/              # Sayfa component'leri (S01-S27)
│   │   │   ├── features/           # Feature modulleri
│   │   │   ├── auth/               # Auth hook + session
│   │   │   ├── state/              # Zustand store'lar
│   │   │   ├── i18n/               # i18next config + locale JSON'lar
│   │   │   ├── observability/      # Sentry + analytics + logger
│   │   │   ├── styles/             # globals.css (Tailwind + CSS variables)
│   │   │   ├── layouts/            # RootLayout
│   │   │   ├── App.tsx             # Provider composition root
│   │   │   ├── main.tsx            # Entry point
│   │   │   └── router.tsx          # React Router 7.x routes
│   │   ├── e2e/                    # Playwright E2E testler
│   │   ├── .storybook/             # Storybook config
│   │   └── vite.config.ts
│   └── mobile/                     # React Native + Expo SDK 55
│       ├── src/
│       │   ├── screens/            # Mobile ekranlar (S01-S27)
│       │   ├── auth/               # Biometric + SecureStore
│       │   ├── state/              # Zustand persist + offline queue
│       │   ├── storage/            # MMKV (plain + encrypted)
│       │   ├── theme/              # NativeWind strategy
│       │   ├── observability/      # Sentry mobile
│       │   └── App.tsx             # Provider composition root
│       ├── app.json                # Expo config
│       └── eas.json                # EAS Build config
├── packages/
│   ├── core/                       # Domain logic, types, auth boundary
│   ├── design-tokens/              # Raw + semantic tokens, light/dark tema
│   ├── ui/                         # 65 component (12 primitive + 53 tier 2-3+)
│   ├── config-typescript/          # Shared TS config (base, web, mobile, library)
│   ├── config-eslint/              # Shared ESLint flat config
│   └── testing/                    # Test helpers, fixtures, mocks
├── project/
│   └── adr/                        # Proje-spesifik karar kayitlari (PDR)
├── scripts/                        # Operasyonel scriptler
├── docs/                           # 130+ dokuman
├── tooling/                        # CI sablonlari, sync scriptleri, AI araclar
├── .claude/                        # Claude Code hooks + skills + settings
├── .moai/                          # MoAI-ADK config + specs
├── .github/workflows/              # CI (ci.yml) + Deploy (deploy.yml)
├── .husky/                         # Pre-commit hooks (lint-staged)
├── package.json                    # Workspace root (pnpm@10.33.0)
├── pnpm-workspace.yaml             # Workspace + catalog: tanimlari
├── turbo.json                      # Turborepo task pipeline
├── tsconfig.base.json              # → config-typescript extends
├── eslint.config.js                # → config-eslint extends
├── prettier.config.js              # Formatting standartlari
├── .nvmrc                          # Node 20.19
├── .npmrc                          # pnpm guvenlik baseline
├── .env.example                    # Ortam degisken sablonu
├── CLAUDE.md                       # AI proje talimatlari
└── AGENTS.md                       # AI review kurallari
```

### Import Yonu Kurallari

```
apps/web   ──→ packages/ui      ✓ OK
apps/mobile──→ packages/core    ✓ OK
packages/ui──→ apps/web         ✗ YASAK
feature A  ──→ feature B        ✗ YASAK (ortak ihtiyac packages/'a tasinir)
```

Bu kurallar CI'da otomatik olarak denetlenir. Ihlal tespit edildiginde pipeline FAIL olur.

### Feature-First Organizasyon

Her feature kendi dizininde, kendi dosya yapisiyla organize edilir:

```
apps/web/src/features/auth/
├── components/           # Feature-spesifik component'ler
├── hooks/                # Feature-spesifik hook'lar
├── utils/                # Feature-spesifik yardimci fonksiyonlar
├── auth.test.tsx         # Testler
└── index.ts              # Public API (feature siniri)
```

Feature disina actigi her sey `index.ts` uzerinden export edilir. Internal dosyalara dogrudan import **yasaktir**.

---

## Gelistirme Sureci

### Kodlama Standartlari

| Kural                  | Aciklama                                                     |
| ---------------------- | ------------------------------------------------------------ |
| TypeScript strict mode | Zorunlu — `any` tipi yasak                                   |
| Semantic token         | Hardcoded renk, spacing, font degeri yasak                   |
| i18n                   | Inline user-facing string yasak, i18n key kullan             |
| Component naming       | PascalCase, dosya adi ile eslesir                            |
| Test dosyasi           | `*.test.ts(x)` kaynak dosyanin yaninda                       |
| Exception policy       | `eslint-disable` / `@ts-ignore` icin exception kaydi zorunlu |

### Katmanli Mimari

```
UI Layer          → Component'ler ve screen'ler
Feature Layer     → Feature-level is mantigi
Domain Layer      → Business kurallari
Data Layer        → API, cache, sync (fetch-first + TanStack Query)
Platform Layer    → Native API'ler, platform-spesifik kod
```

Her katmanin sorumlulugu net ve siniri gorunurdur. UI katmani veri cekme veya business rule uygulamaz.

### Design Token Kullanimi

Token hiyerarsisi 3 katmanlidir ve **degistirilemez**:

```
Raw Token      →  color-blue-500, spacing-16
     ↓
Semantic Token →  bg-interactive-primary, spacing-md
     ↓
Component      →  Button background, Card padding
```

- Raw token dogrudan kullanilmaz
- Her zaman semantic token uzerinden tuketilir
- Dark/light tema mapping otomatik

```tsx
// YANLIS
<View style={{ backgroundColor: '#2563EB', padding: 16 }} />

// DOGRU
<View className="bg-interactive-primary p-md" />
```

### Test Stratejisi

| Test Turu        | Arac                        | Nerede                     |
| ---------------- | --------------------------- | -------------------------- |
| Unit test        | Vitest (web) / Jest (mobil) | Yeni utility, hook, helper |
| Component test   | React Testing Library       | Yeni component             |
| Integration test | Vitest / Jest               | API entegrasyonu           |
| E2E test         | Playwright                  | Kritik kullanici akislari  |

Test dosyalari kaynak dosyanin yaninda tutulur: `Button.tsx` → `Button.test.tsx`

### State Management

Zustand ile minimal, focused store'lar olusturulur:

- Client state → Zustand store
- Server state → fetch-first default, gerektiginde TanStack Query
- Form state → React Hook Form (store'a tasinmaz)

Global store'a server data koymak **yasaktir**.

### Erisilebilirlik (Accessibility)

WCAG AA minimum esiktir, gevsetilemez:

- Her interaktif element'te `role` ve `aria-label` zorunlu
- Touch target minimum 44x44pt (mobil)
- VoiceOver/TalkBack ile test edilmeli
- Reduced motion guard uygulanmali
- Renk kontrast orani minimum 4.5:1

### PR Sureci

1. Feature branch olustur (`feature/`, `fix/`, `hotfix/`)
2. Kodu yaz, testlerini yaz
3. Kalite kontrollerini calistir: `pnpm typecheck && pnpm lint && pnpm test`
4. PR ac — `32-definition-of-done.md` checklist'ini uygula
5. Review al
6. CI tum gate'leri gectiginde merge (GitHub merge queue uzerinden)

---

## Build, Deploy ve Ortam Yonetimi

### Build

```bash
# Tum workspace'i derle
pnpm build

# Sadece web
pnpm --filter web build

# Sadece mobil
pnpm --filter mobile build
```

### Ortam Yonetimi

| Ortam         | Amac             | Config            |
| ------------- | ---------------- | ----------------- |
| `development` | Lokal gelistirme | `.env.local`      |
| `staging`     | Test ve QA       | `.env.staging`    |
| `production`  | Canli ortam      | `.env.production` |

Her ortam icin ayri `.env` dosyasi kullanilir. Ortam degiskenleri CI/CD pipeline'inda secret olarak tanimlanir.

### Web Deploy

```bash
# Production build
pnpm --filter web build

# Build ciktisi: apps/web/dist/
# Statik hosting'e deploy edilir (Vercel, Netlify, Cloudflare Pages vb.)
```

### Mobil Deploy

```bash
# EAS Build (Expo Application Services)
eas build --platform ios
eas build --platform android

# EAS Submit (store'a gonderme)
eas submit --platform ios
eas submit --platform android

# OTA Update (store onaysiz guncelleme)
eas update --branch production --message "Bug fix v1.2.1"
```

**OTA Guncelleme Kurallari (ADR-015):**

- `runtimeVersion` degisikligi OTA uyumluluguyla birlikte degerlendirilir
- Native kod degisikligi → yeni binary build zorunlu
- JavaScript-only degisiklik → OTA update mumkun

### Release Sureci

```
1. Tum kalite kapilari gecildi mi?           → pnpm typecheck && lint && test && build
2. Changelog yazildi mi?                      → CHANGELOG.md guncelle
3. Canonical stack degisikligi var mi?         → Compatibility review zorunlu
4. Docs sync yapildi mi?                      → Docs sync olmadan release tam sayilmaz
5. Versiyonu artir                            → Semantic versioning (major.minor.patch)
6. Tag olustur                                → git tag -a v1.2.0 -m "Release v1.2.0"
7. Deploy et                                  → CI/CD pipeline tetiklenir
```

### CI Pipeline

CI otomatik olarak su kontrolleri yapar:

| Kontrol                      | Basarisizlik     |
| ---------------------------- | ---------------- |
| TypeScript type-check        | Merge engellenir |
| ESLint                       | Merge engellenir |
| Unit/integration testler     | Merge engellenir |
| Build                        | Merge engellenir |
| Boundary check (import yonu) | Merge engellenir |
| Security scan (secret leak)  | Merge engellenir |
| Doc reference integrity      | Uyari            |

Ek olarak haftalik scheduled audit calisir: dependency guvenlik taramasi, lisans uyumlulugu, belge guncellik kontrolu, exception suresi kontrolu.

---

## Kullanim Kilavuzu

### Yeni Feature Ekleme

```bash
# 1. Feature dizini olustur
mkdir -p apps/web/src/features/my-feature/{components,hooks}

# 2. Component, hook, test dosyalarini yaz
# 3. Public API'yi index.ts'ten export et
# 4. Route'u ekle (React Router / React Navigation)
# 5. i18n key'lerini ekle
# 6. Testleri yaz ve calistir
```

### Yeni Shared Component Ekleme

```bash
# packages/ui/src/ altinda olustur
# Component governance kurallarini takip et (23-component-governance-rules.md)
# Lifecycle: proposal → draft → stable → deprecated
```

Yeni component icin:

- Semantic token kullan (hardcoded deger yasak)
- Accessibility prop'lari ekle (`role`, `aria-label`, `accessibilityLabel`)
- Storybook story yaz
- Test yaz
- Platform adaptation kontrol et (web/iOS/Android farkliliklari)

### Yeni Dependency Ekleme

Yeni paket eklemeden **once**:

1. `37-dependency-policy.md` oku — paket kurallarina uyuyor mu?
2. `38-version-compatibility-matrix.md` kontrol et — versiyon uyumlu mu?
3. Canonical stack'te alternatifi var mi? (varsa, canonical olan kullanilir)

```bash
# Dependency ekle
pnpm add <package-name> --filter <workspace>

# Guvenlik kontrolu
pnpm audit
```

### Form Olusturma

React Hook Form + Zod schema-first yaklasimi:

```tsx
// 1. Zod schema tanimla
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

// 2. React Hook Form ile kullan
const form = useForm({ resolver: zodResolver(loginSchema) });
```

### i18n (Coklu Dil)

i18next namespace-based yaklasim:

```tsx
// YANLIS — inline string
<Text>Hosgeldiniz</Text>

// DOGRU — i18n key
<Text>{t('welcome.title')}</Text>
```

Namespace dosyalari: `apps/{app}/src/locales/{locale}/{namespace}.json`

### Exception Olusturma

Kural ihlali kacinilmazsa (ornegin `eslint-disable` kullanmak zorundaysaniz):

1. `tooling/governance/exception-template.yaml` sablonunu kullan
2. Severity belirle (Minor/Major/Blocker)
3. Exception kaydi olustur: `exceptions/<tarih>-<aciklama>.yaml`
4. PR'a exception referansini ekle

Exception olmadan kural bypass'i kabul edilmez.

### Turetilmis Proje (Derived Project) Olusturma

Proje turetme islemini otomatize eden script mevcuttur:

```bash
git clone <boilerplate-url> my-new-project
cd my-new-project
rm -rf .git && git init && git add -A && git commit -m "init"

./tooling/derive/create-project.sh \
  --name "myapp" --scope "@myapp" --display-name "My App" \
  --bundle-id "com.myorg.myapp" --domain "myapp.com" \
  --upstream-url "<boilerplate-url>"
```

Detay: Yukardaki [Yeni Proje Turetme Rehberi](#yeni-proje-turetme-rehberi) bolumu ve `docs/implementation/43-derived-project-creation-guide.md`

### Upstream Sync (Boilerplate Guncellemelerini Alma)

Boilerplate'te yeni kural, ADR veya guardrail eklendiginde:

```bash
# 1. Guncel tag'leri gor
git fetch upstream --tags
git tag -l 'bp-v*' --sort=-v:refname

# 2. Sync calistir
./tooling/sync/upstream-sync.sh bp-v1.2.0

# 3. Conflict varsa coz
grep -rn '<<<<<<< derived-proje' . --include='*.md'

# 4. PR ac
git add -A && git commit -m 'chore: upstream sync bp-v1.2.0'
```

Detay: `docs/onboarding/upstream-sync-rehberi.md`

---

## Sik Karsilasilan Sorunlar

### Hardcoded deger uyarisi aliyor

**Sorun:** Post-edit hook `#fff` gibi hex deger veya `16px` gibi spacing tespit etti.

**Cozum:** Semantic token kullanin:

```tsx
// Onceki
style={{ color: '#333', padding: 16 }}

// Sonraki
className="text-foreground-primary p-md"
```

### `any` type hatasi

**Sorun:** TypeScript strict mode `any` tipini reddediyor.

**Cozum:** Dogru tipi yazin. Tip bilinmiyorsa `unknown` kullanip type guard ile daralttin. `any` gercekten kacinilmazsa exception kaydi olusturun.

### Import yonu ihlali (CI FAIL)

**Sorun:** `packages/` icinden `apps/` dizinine import yapilmis.

**Cozum:** Import yonunu tersten yapin. Paylasilan kod `packages/` altinda, uygulamaya ozel kod `apps/` altinda olmali. Eger bir feature'dan paylasilan koda ihtiyac varsa, o kodu `packages/`'a tasiyin.

### `pnpm install` basarisiz oluyor

**Sorun:** Peer dependency uyarisi veya versiyon catismasi.

**Cozum:**

```bash
# Node versiyonunu kontrol et
node --version  # 20.x olmali

# pnpm versiyonunu kontrol et
pnpm --version  # 10.x olmali

# Cache temizle
pnpm store prune
pnpm install
```

### Expo/React Native build hatasi

**Sorun:** Mobil build basarisiz.

**Cozum:**

```bash
# Expo doctor ile kontrol et
npx expo-doctor

# Cache temizle
npx expo start --clear
```

### Dependency policy ihlali

**Sorun:** Yeni paket eklerken `dep-check` skill'i uyari veriyor.

**Cozum:** `37-dependency-policy.md`'yi okuyun. Paket canonical stack'teki bir kutuphaneye alternatifse reddedilir. Gercekten gerekiyorsa ADR sureci baslatin.

### CI'da upstream drift uyarisi

**Sorun:** `upstream-drift-check` job uyari veya hata veriyor.

**Cozum:** Boilerplate'te yeni degisiklikler var. Sync yapin:

```bash
./tooling/sync/upstream-sync.sh <guncel-tag>
```

### Exception suresi dolmus

**Sorun:** Scheduled audit "suresi dolmus exception" raporluyor.

**Cozum:** `exceptions/` altindaki ilgili YAML dosyasini inceleyin. Ya exception'i kapatip kurali uygulyin, ya da gerekcesiyle uzatin (max 1 uzatma, max 60 gun).

---

## Ilgili Dokumanlar

### Hizli Baslangic

| Dokuman                                      | Aciklama                              |
| -------------------------------------------- | ------------------------------------- |
| `docs/onboarding/ilk-30-dakika.md`           | Ilk 30 dakikada calisir sistem gormek |
| `docs/onboarding/rol-bazli-okuma-rehberi.md` | Rolunuze gore okuma sirasi            |
| `docs/onboarding/upstream-sync-rehberi.md`   | Boilerplate guncellemelerini alma     |

### Mimari ve Tasarim

| Dokuman                                                           | Aciklama               |
| ----------------------------------------------------------------- | ---------------------- |
| `docs/architecture/06-application-architecture.md`                | Katmanli mimari        |
| `docs/architecture/07-module-boundaries-and-code-organization.md` | Modul sinirlari        |
| `docs/design-system/04-design-system-architecture.md`             | Design system mimarisi |
| `docs/design-system/22-design-tokens-spec.md`                     | Token spec ve naming   |

### Kalite ve Guvenlik

| Dokuman                                            | Aciklama              |
| -------------------------------------------------- | --------------------- |
| `docs/quality/12-accessibility-standard.md`        | WCAG AA baseline      |
| `docs/quality/13-performance-standard.md`          | Performans budgetlari |
| `docs/quality/14-testing-strategy.md`              | Test piramidi         |
| `docs/quality/27-security-and-secrets-baseline.md` | Guvenlik kurallari    |

### Governance

| Dokuman                                                       | Aciklama                    |
| ------------------------------------------------------------- | --------------------------- |
| `docs/governance/36-canonical-stack-decision.md`              | Kilitli teknoloji kararlari |
| `docs/governance/37-dependency-policy.md`                     | Paket ekleme kurallari      |
| `docs/governance/45-boilerplate-project-boundary-contract.md` | Miras modeli                |
| `docs/governance/49-upstream-sync-strategy.md`                | Upstream sync stratejisi    |
| `docs/checklists/32-definition-of-done.md`                    | Is tamamlama kriterleri     |

### Proje Turetme ve Tooling

| Dokuman                                                    | Aciklama                           |
| ---------------------------------------------------------- | ---------------------------------- |
| `docs/implementation/43-derived-project-creation-guide.md` | Turetme sureci (10 adim)           |
| `tooling/derive/README.md`                                 | create-project.sh kullanim rehberi |
| `tooling/ci/README.md`                                     | CI/CD pipeline aciklamasi          |
| `CONTRIBUTING.md`                                          | Katki rehberi                      |

### Alt Dizin Dokumanlari

| Dokuman                            | Aciklama                           |
| ---------------------------------- | ---------------------------------- |
| `apps/web/README.md`               | Web uygulamasi setup ve gelistirme |
| `apps/mobile/README.md`            | Mobile uygulama, Expo, EAS rehberi |
| `packages/design-tokens/README.md` | Design token sistemi kullanimi     |
| `packages/ui/README.md`            | Component library rehberi          |
| `packages/core/README.md`          | Shared utilities ve hook'lar       |

### Tam Dokuman Haritasi

Tum 130+ dokumanin hiyerarsik listesi: `docs/maps/35-document-map.md`
