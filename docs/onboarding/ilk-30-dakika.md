# İlk 30 Dakika Rehberi

> Hiçbir belge okumadan, çalışan sistemi görün.

---

## 1. Ön Koşullar (5 dakika)

Aşağıdakilerin kurulu olduğundan emin olun:

| Araç | Minimum Versiyon | Kontrol Komutu |
|------|-----------------|----------------|
| Node.js | 20.x | `node --version` |
| pnpm | 10.x | `pnpm --version` |
| Git | 2.40+ | `git --version` |

**Node.js yoksa:**
```bash
# nvm ile kurulum
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
nvm install 20
```

**pnpm yoksa:**
```bash
corepack enable
corepack prepare pnpm@latest --activate
```

---

## 2. Projeyi Klonla ve Kur (5 dakika)

```bash
# Repo'yu klonla
git clone <REPO_URL> my-project
cd my-project

# Bağımlılıkları kur
pnpm install

# Node versiyonunu doğrula
cat .nvmrc
```

Beklenen çıktı: Hatasız kurulum, `node_modules/` oluşmuş olmalı.

---

## 3. Development Server'ları Başlat (5 dakika)

### Web
```bash
pnpm dev:web
```
Tarayıcıda `http://localhost:5173` açılmalı.

### Mobile (Expo)
```bash
pnpm dev:mobile
```
QR kodu tarayın veya emulator'da açın.

---

## 4. Kalite Kontrollerini Çalıştır (5 dakika)

```bash
# TypeScript tip kontrolü
pnpm typecheck

# Lint kontrolü
pnpm lint

# Testleri çalıştır
pnpm test

# Build
pnpm build
```

Tümü hatasız geçmeli. Herhangi biri fail olursa `30-contribution-guide.md` bölüm 5.8.5'teki sık sorunlara bakın.

---

## 5. İlk Değişikliğinizi Yapın (10 dakika)

### Yeni bir component oluşturun:
```bash
# Component scaffold (proje bootstrap sonrası)
# pnpm generate:component MyComponent

# veya manuel:
mkdir -p packages/ui/src/MyComponent
```

Dosya yapısı:
```
packages/ui/src/MyComponent/
├── index.tsx          # Component kodu
├── types.ts           # Prop tipleri
└── MyComponent.test.tsx  # Test
```

### Component'i yazın:
```tsx
// packages/ui/src/MyComponent/index.tsx
import { type MyComponentProps } from './types';

export function MyComponent({ label }: MyComponentProps) {
  return <div>{label}</div>;
}
```

### Test edin:
```bash
pnpm test -- --filter packages/ui
```

---

## 6. Sonraki Adımlar

Artık çalışan bir sisteminiz var. Şimdi rolünüze göre belgeleri okuyun:

- **Developer** → `docs/onboarding/rol-bazli-okuma-rehberi.md` § Developer Fast Track
- **Designer** → `docs/onboarding/rol-bazli-okuma-rehberi.md` § Designer Fast Track
- **Tech Lead** → `docs/onboarding/rol-bazli-okuma-rehberi.md` § Tech Lead Fast Track

---

## Bu Boilerplate'te Yapma — 10 Anti-Pattern

| # | Anti-Pattern | Doğrusu | Referans |
|---|-------------|---------|----------|
| 1 | Hardcoded renk (`#fff`) kullanma | Semantic token kullan | `22-design-tokens-spec.md` |
| 2 | Global state'e server data koyma | ADR-005 uyarınca fetch-first veya query-layer modeli kullan; generic store'a kopyalama | `10-data-fetching-cache-sync.md` |
| 3 | `any` tipi kullanma | Doğru tipi yaz | `36-canonical-stack-decision.md` |
| 4 | Inline string yazma (`"Kaydet"`) | i18n key kullan | `ADR-011` |
| 5 | `packages/` → `apps/` import | Tersini kullan | `07-module-boundaries-and-code-organization.md` |
| 6 | Feature kodu `packages/`'a taşıma | Shared-by-proof ilkesi | `07-module-boundaries-and-code-organization.md` |
| 7 | `eslint-disable` exception'sız | Exception kaydı oluştur | `44-exception-and-exemption-policy.md` |
| 8 | Test yazmadan PR açma | İlgili test türünü yaz | `14-testing-strategy.md` |
| 9 | Canonical stack dışı kütüphane ekleme | ADR sürecini başlat | `17-technology-decision-framework.md` |
| 10 | `.env` değerini koda hardcode etme | Environment variable kullan | `27-security-and-secrets-baseline.md` |

---

## İlk Görev Rehberi — Hands-on Onboarding

Bu bölüm, yeni katılan geliştiricinin ilk 30 dakikada yapması gereken somut adımları tanımlar.

### Adım 1: Ortam Doğrulama (İlk 5 dk)

```bash
# Node versiyonunu doğrula (22.x olmalı)
node --version

# pnpm versiyonunu doğrula (10.x olmalı)
pnpm --version

# VS Code extensions kontrolü
# Zorunlu: ESLint, Prettier, Tailwind CSS IntelliSense
# Önerilen: Error Lens, GitLens, Todo Tree
code --list-extensions | grep -i "eslint\|prettier\|tailwind"
```

Herhangi biri eksikse:
- Node: `nvm install 22`
- pnpm: `corepack enable && corepack prepare pnpm@latest --activate`
- Extensions: VS Code'da Extensions panelinden kur

### Adım 2: Projeyi Çalıştır ve Tanı (İlk 15 dk)

```bash
# Bağımlılıkları kur
pnpm install

# Web development server başlat
pnpm dev:web
# Tarayıcıda http://localhost:5173 açılmalı

# (Ayrı terminal) Kalite kontrollerini çalıştır
pnpm typecheck && pnpm lint
```

Bu sırada şu dokümanları tara:
1. `CLAUDE.md` — Proje talimatlarını oku (~5 dk)
2. `docs/maps/35-document-map.md` — Doküman haritasını incele (~5 dk)
3. Rolüne göre `docs/onboarding/rol-bazli-okuma-rehberi.md`'den başlangıç listeni belirle

### Adım 3: İlk Değişiklik ve PR (İlk 30 dk)

**Görev:** Mevcut bir component'e Storybook story ekle ve token değiştir.

```bash
# 1. Yeni branch oluştur
git checkout -b feature/onboarding-ilk-gorev

# 2. Mevcut bir component'i bul
ls packages/ui/src/

# 3. Component'e story ekle (varsa güncelle, yoksa oluştur)
# Örnek: packages/ui/src/Button/Button.stories.tsx

# 4. Design token değişikliği yap (semantic token kullan!)
# packages/design-tokens/ altında bir değer değiştir

# 5. Kalite kontrollerini çalıştır
pnpm typecheck
pnpm lint
pnpm test

# 6. Değişiklikleri commit et
git add -A
git commit -m "onboarding: ilk görev tamamlandı"
```

### Kontrol Listesi

İlk 30 dakika sonunda aşağıdakilerin hepsi tamamlanmış olmalı:

- [ ] Node 22 ve pnpm 10 kurulu ve doğrulandı
- [ ] VS Code zorunlu extensions kurulu
- [ ] `pnpm install` hatasız tamamlandı
- [ ] `pnpm dev:web` çalışıyor, tarayıcıda sayfa görünüyor
- [ ] CLAUDE.md okundu
- [ ] Doküman haritası incelendi
- [ ] Bir component'e story eklendi veya güncellendi
- [ ] `pnpm typecheck` ve `pnpm lint` hatasız geçiyor
- [ ] İlk commit yapıldı
