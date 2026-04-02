# Cross-Platform Boilerplate

React (web) ve React Native/Expo (mobil) uzerinde kurulu, documentation-first, kalite standartli cross-platform urun gelistirme temeli.

---

## Icindekiler

- [Proje Tanitimi](#proje-tanitimi)
- [Baslangic Rehberi](#baslangic-rehberi)
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

| Alan | Teknoloji | Versiyon | ADR |
|------|-----------|----------|-----|
| Web runtime | React + Vite + React Router | 7.x | ADR-001 |
| Mobil runtime | React Native + Expo | SDK 55.x | ADR-002 |
| Monorepo | pnpm + Turborepo | 10.x / 2.x | ADR-003 |
| State management | Zustand | 5.x | ADR-004 |
| Data fetching | fetch-first + TanStack Query | 5.x | ADR-005 |
| Forms | React Hook Form + Zod | 7.x / 4.x | ADR-006 |
| Styling/tokens | Tailwind CSS + NativeWind | 4.x / 5.x | ADR-007 |
| Testing | Vitest + Jest + Playwright | 4.x / 30.x / 1.58.x | ADR-008 |
| Component lab | Storybook + Storybook Test | 10.x | ADR-008 |
| Observability | Sentry + vendor-agnostic analytics | - | ADR-009 |
| Auth | HttpOnly cookies (web) + SecureStore (mobil) + Biometric | - | ADR-010 |
| i18n | i18next, namespace-based | 26.x | ADR-011 |
| Navigation | React Router (web) + React Navigation (mobil) | 7.x / 7.x | ADR-012 |
| Push notification | expo-notifications + FCM/APNs | - | ADR-013 |
| Deep linking | expo-linking + Universal Links + App Links | - | ADR-014 |
| OTA update | EAS Update | - | ADR-015 |
| In-app purchase | RevenueCat (react-native-purchases) | - | ADR-016 |
| Privacy/compliance | GDPR + KVKK uyum cercevesi | - | ADR-017 |
| New architecture | Fabric + JSI + TurboModules + Hermes V1 | - | ADR-018 |
| Local storage | MMKV + Expo SecureStore + Zustand persist | - | ADR-019 |

**Watchlist** (henuz canonical degil, izleniyor): React Compiler, Biome 2.x, @expo/ui 1.0

---

## Baslangic Rehberi

### On Kosullar

| Arac | Minimum Versiyon | Kontrol Komutu |
|------|-----------------|----------------|
| Node.js | 20.x | `node --version` |
| pnpm | 10.x | `pnpm --version` |
| Git | 2.40+ | `git --version` |

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

### Ilk Calistirma

```bash
# Web development server
pnpm dev:web
# http://localhost:5173 adresinde acilir

# Mobile development server (Expo)
pnpm dev:mobile
# Expo Go ile QR kodunu okuyun

# Kalite kontrolleri
pnpm typecheck        # TypeScript tip kontrolu
pnpm lint             # ESLint kontrolu
pnpm test             # Tum testler
pnpm build            # Tum workspace'i derle
```

### Ortam Degiskenleri

`.env.example` dosyasini `.env.local` olarak kopyalayin. Asagidaki degiskenler tanimlanmalidir:

| Degisken | Aciklama | Ornek |
|----------|----------|-------|
| `VITE_API_BASE_URL` | Backend API adresi | `https://api.example.com` |
| `SENTRY_DSN` | Sentry hata izleme | `https://xxx@sentry.io/xxx` |
| `EXPO_PUBLIC_API_URL` | Mobil API adresi | `https://api.example.com` |

> `.env` dosyalari `.gitignore` ile korunur. Gercek credential'lar asla repo'ya girmez.

---

## Proje Yapisi

### Dizin Agaci

```
/
├── apps/                          # Uygulamalar
│   ├── web/                       # React + Vite web uygulamasi
│   │   └── src/
│   │       ├── features/          # Feature-first organizasyon
│   │       ├── routes/            # Route tanimlari
│   │       └── app.tsx            # Uygulama giris noktasi
│   └── mobile/                    # React Native + Expo uygulamasi
│       └── src/
│           ├── features/          # Feature-first organizasyon
│           ├── navigation/        # React Navigation tanimlari
│           └── App.tsx            # Uygulama giris noktasi
│
├── packages/                      # Paylasilan paketler
│   ├── design-tokens/             # Semantic token tanimlari
│   ├── ui/                        # Cross-platform UI component'leri
│   └── utils/                     # Utility fonksiyonlari
│
├── docs/                          # Dokumantasyon (130+ dosya)
│   ├── foundation/                # Proje vizyonu ve prensipler
│   ├── adr/                       # Architecture Decision Records (ADR-001 → ADR-019)
│   ├── architecture/              # Mimari kurallar ve sinirlar
│   ├── design-system/             # Design system standartlari
│   ├── quality/                   # Kalite, guvenlik, performans
│   ├── governance/                # Policy, release, dependency kurallari
│   ├── ai-guardrails/             # AI agent kurallari (domain + aktivite)
│   ├── checklists/                # Audit ve Definition of Done
│   ├── implementation/            # Kurulum rehberi ve repo yapisi
│   ├── onboarding/                # Baslangic rehberleri
│   └── maps/                      # Dokuman haritasi
│
├── tooling/                       # Araclar ve otomasyon
│   ├── ci/                        # CI pipeline sablonlari
│   ├── sync/                      # Upstream sync mekanizmasi
│   ├── agents/                    # Dizin-bazli agent talimatlari
│   └── governance/                # Exception sablonlari
│
├── .claude/                       # Claude AI altyapisi
│   ├── hooks/                     # Pre/post edit guardrail hook'lari
│   ├── skills/                    # 7 guardrail skill'i
│   └── settings.json              # Hook konfigurasyonu
│
├── .github/workflows/             # CI/CD pipeline'lari
├── CLAUDE.md                      # AI proje talimatlari
├── AGENTS.md                      # AI review kurallari
├── CHANGELOG.md                   # Versiyonlanmis degisiklik kaydi
└── BOUNDARY.md                    # Derived project sinir sozlesmesi (turetilmis projelerde)
```

### Import Yonu Kurallari

```
apps/web   ──→ packages/ui     ✓ OK
apps/mobile──→ packages/utils  ✓ OK
packages/ui──→ apps/web        ✗ YASAK
feature A  ──→ feature B       ✗ YASAK (ortak ihtiyac packages/'a tasinir)
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

| Kural | Aciklama |
|-------|----------|
| TypeScript strict mode | Zorunlu — `any` tipi yasak |
| Semantic token | Hardcoded renk, spacing, font degeri yasak |
| i18n | Inline user-facing string yasak, i18n key kullan |
| Component naming | PascalCase, dosya adi ile eslesir |
| Test dosyasi | `*.test.ts(x)` kaynak dosyanin yaninda |
| Exception policy | `eslint-disable` / `@ts-ignore` icin exception kaydi zorunlu |

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

| Test Turu | Arac | Nerede |
|-----------|------|--------|
| Unit test | Vitest (web) / Jest (mobil) | Yeni utility, hook, helper |
| Component test | React Testing Library | Yeni component |
| Integration test | Vitest / Jest | API entegrasyonu |
| E2E test | Playwright | Kritik kullanici akislari |

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

| Ortam | Amac | Config |
|-------|------|--------|
| `development` | Lokal gelistirme | `.env.local` |
| `staging` | Test ve QA | `.env.staging` |
| `production` | Canli ortam | `.env.production` |

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

| Kontrol | Basarisizlik |
|---------|-------------|
| TypeScript type-check | Merge engellenir |
| ESLint | Merge engellenir |
| Unit/integration testler | Merge engellenir |
| Build | Merge engellenir |
| Boundary check (import yonu) | Merge engellenir |
| Security scan (secret leak) | Merge engellenir |
| Doc reference integrity | Uyari |

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

```bash
# 1. Boilerplate'i klonla
git clone <boilerplate-url> my-new-project
cd my-new-project

# 2. Git gecmisini temizle
rm -rf .git && git init

# 3. Upstream remote ekle (sync icin zorunlu)
git remote add upstream <boilerplate-url>

# 4. Proje-ozel yapilandirma
# CLAUDE.md, AGENTS.md, package.json guncelle

# 5. BOUNDARY.md olustur
# 6. .sync-config.yaml olustur

# Detay: docs/implementation/43-derived-project-creation-guide.md
```

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

| Dokuman | Aciklama |
|---------|----------|
| `docs/onboarding/ilk-30-dakika.md` | Ilk 30 dakikada calisir sistem gormek |
| `docs/onboarding/rol-bazli-okuma-rehberi.md` | Rolunuze gore okuma sirasi |
| `docs/onboarding/upstream-sync-rehberi.md` | Boilerplate guncellemelerini alma |

### Mimari ve Tasarim

| Dokuman | Aciklama |
|---------|----------|
| `docs/architecture/06-application-architecture.md` | Katmanli mimari |
| `docs/architecture/07-module-boundaries-and-code-organization.md` | Modul sinirlari |
| `docs/design-system/04-design-system-architecture.md` | Design system mimarisi |
| `docs/design-system/22-design-tokens-spec.md` | Token spec ve naming |

### Kalite ve Guvenlik

| Dokuman | Aciklama |
|---------|----------|
| `docs/quality/12-accessibility-standard.md` | WCAG AA baseline |
| `docs/quality/13-performance-standard.md` | Performans budgetlari |
| `docs/quality/14-testing-strategy.md` | Test piramidi |
| `docs/quality/27-security-and-secrets-baseline.md` | Guvenlik kurallari |

### Governance

| Dokuman | Aciklama |
|---------|----------|
| `docs/governance/36-canonical-stack-decision.md` | Kilitli teknoloji kararlari |
| `docs/governance/37-dependency-policy.md` | Paket ekleme kurallari |
| `docs/governance/45-boilerplate-project-boundary-contract.md` | Miras modeli |
| `docs/governance/49-upstream-sync-strategy.md` | Upstream sync stratejisi |
| `docs/checklists/32-definition-of-done.md` | Is tamamlama kriterleri |

### Tam Dokuman Haritasi

Tum 130+ dokumanin hiyerarsik listesi: `docs/maps/35-document-map.md`
