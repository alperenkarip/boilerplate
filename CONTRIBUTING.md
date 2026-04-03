# Katki Rehberi

Bu belge, boilerplate projesine katki yapacak gelistiriciler icin standartlari ve surecleri tanimlar.

## On Kosullar

- Node.js 20.x
- pnpm 10.x
- Git

## Gelistirme Ortami Kurulumu

```bash
# Repoyu klonla
git clone <repo-url>
cd boilerplate

# Bagimliliklari kur
pnpm install

# Ortam degiskenlerini ayarla
cp .env.example .env.local
# .env.local dosyasini duzenleyerek gerekli degiskenleri doldurun

# Gelistirme sunucularini baslat
pnpm dev:web        # Web development server
pnpm dev:mobile     # Mobile development server
```

## Branch Kurallari

Trunk-based development modeli kullanilir. Branch'ler kisa omurlu olmalidir.

**Branch isimlendirme:**

| Nek        | Kullanim                 | Ornek                     |
| ---------- | ------------------------ | ------------------------- |
| `feature/` | Yeni ozellik             | `feature/auth-login`      |
| `fix/`     | Bug duzeltme             | `fix/header-overflow`     |
| `hotfix/`  | Acil production duzeltme | `hotfix/crash-on-startup` |
| `release/` | Release hazirligi        | `release/1.2.0`           |
| `chore/`   | Bakim, refactoring, CI   | `chore/update-deps`       |

Detay: `docs/governance/42-branching-and-merge-strategy.md`

## Commit Kurallari

- Commit mesajlari Turkce yazilir
- Kisa ve aciklayici olmalidir
- Yapilan degisikligi net sekilde ifade etmelidir

Ornekler:

```
Auth ekraninda form validasyonu eklendi
Header component'inde responsive duzeltme
Dependency guncellemeleri (React 19, Expo SDK 55)
CI pipeline'a boundary check eklendi
```

## PR Sureci

1. Feature branch'inizi olusturun ve degisikliklerinizi yapin
2. PR acarken aciklayici bir baslik ve icerik yazin
3. CI pipeline'in tum job'larinin gectiginden emin olun
4. En az bir reviewer'dan onay alin
5. GitHub merge queue uzerinden birlestirin

PR acilirken kontrol listesi:

- [ ] TypeScript tip hatalari yok (`pnpm typecheck`)
- [ ] Lint hatalari yok (`pnpm lint`)
- [ ] Testler geciyor (`pnpm test`)
- [ ] Build basarili (`pnpm build`)
- [ ] Boundary ihlali yok (packages/ dizininden apps/ dizinine import yok)

## Kod Standartlari

### TypeScript

- **Strict mode** zorunludur
- `any` tipi kullanimi **yasaktir**
- `eslint-disable` ve `@ts-ignore` kullanimi exception policy gerektirir (`docs/governance/44-exception-and-exemption-policy.md`)

### Stil ve Token Kullanimi

- Hardcoded renk degeri **yasaktir** — semantic token kullanin
- Hardcoded spacing degeri **yasaktir** — spacing token kullanin
- Hardcoded font degeri **yasaktir** — typography token kullanin

Referans: `docs/design-system/22-design-tokens-spec.md`

### Lokalizasyon

- Inline user-facing string **yasaktir** — i18n key kullanin
- i18n namespace-based yapiyi takip edin

Referans: ADR-011

### Isimlendirme

- Component isimleri: PascalCase, dosya adi ile eslesmeli
- Degisken ve fonksiyon adlari: Ingilizce (camelCase)
- Kod yorumlari: Turkce

### Dosya Organizasyonu

- Feature kodu: `apps/{app}/src/features/{feature}/`
- Shared paket: `packages/{package}/src/`
- Test dosyasi: kaynak dosyanin yaninda `*.test.ts(x)`
- Import yonu: `feature` -> `shared` gecerli, `shared` -> `feature` **yasaktir**

## Test Beklentisi

- Yeni utility veya hook: Unit test zorunlu
- Yeni component: Render test zorunlu
- Yeni API entegrasyonu: Integration test zorunlu
- Test dosya formati: `*.test.ts(x)`, kaynak dosyanin yaninda

Referans: `docs/quality/14-testing-strategy.md`

## Design System Kurallari

Component olusturma ve duzenleme `docs/design-system/23-component-governance-rules.md` belgesindeki kurallara uygun olmalidir.

Temel kurallar:

- Platform adaptation kurallarina uyun (`docs/design-system/26-platform-adaptation-rules.md`)
- Error, empty ve loading state'leri tanimlayin (`docs/design-system/25-error-empty-loading-states.md`)
- Motion ve interaction standartlarina uyun (`docs/design-system/24-motion-and-interaction-standard.md`)
- Erisebilirlik standartlarini karsilayin (`docs/quality/12-accessibility-standard.md`)

## AI Workflow

Bu projede MoAI-ADK aktiftir. Kod uretimi ve duzenleme sirasinda guardrail protokolu gecerlidir.

- Kodlama oncesi guardrail kontrolu otomatik tetiklenir
- Her edit oncesi ve sonrasi hook'lar calisir
- Is tamamlandiginda guardrail audit yapilir
- PR oncesinde kapsamli kalite kontrolu (pre-pr) uygulanir

Detay: `docs/governance/47-ai-guardrail-governance.md`

## Dependency Ekleme

Yeni dependency eklemeden once:

1. `docs/governance/37-dependency-policy.md` belgesini kontrol edin
2. `docs/governance/38-version-compatibility-matrix.md` ile versiyon uyumlulugunu dogrulayin
3. Canonical stack'teki kutuphanelerin alternatiflerini onermeyin — canonical kararlar kilitlidir

## Exception Policy

Bir kurali ihlal etmeniz gerekiyorsa:

1. `docs/governance/44-exception-and-exemption-policy.md` belgesini okuyun
2. `tooling/governance/exception-template.yaml` sablonunu kopyalayin
3. Exception kaydini doldurun ve `exceptions/` dizinine yerlestirin
4. Dosya adi formati: `EXC-NNN-kisa-aciklama.yaml`

## Canonical Stack

Bu projenin teknoloji kararlari ADR-001 ile ADR-019 arasinda kilitlenmistir. Bu kararlarin alternatiflerini tartismak, sorgulamak veya bypass etmek yasaktir.

Detay: `docs/governance/36-canonical-stack-decision.md`

## Yararli Komutlar

```bash
pnpm install          # Bagimlilik kurulumu
pnpm dev:web          # Web development server
pnpm dev:mobile       # Mobile development server
pnpm typecheck        # TypeScript tip kontrolu
pnpm lint             # ESLint kontrolu
pnpm test             # Tum testleri calistir
pnpm build            # Tum workspace'i derle
```
