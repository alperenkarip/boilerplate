# 21-repo-structure-spec.md

## Doküman Kimliği

- **Doküman adı:** Repo Structure Specification
- **Dosya adı:** `21-repo-structure-spec.md`
- **Doküman türü:** Specification / repository architecture / package topology document
- **Durum:** Accepted
- **Tarih:** 2026-03-31
- **Kapsam:** Bu belge, canonical monorepo kararını fiziksel repo topolojisine çevirir; exact başlangıç üst dizinlerini, apps ve packages ailelerini, hangi package’lerin başlangıçta açılacağını, hangi alanların app içinde kalacağını, docs/tooling/scripts/config yerleşimini, test ve asset placement kurallarını ve shared-by-proof ilkesinin fiziksel karşılığını tanımlar.
- **Bağlı olduğu üst dokümanlar:**
  - `06-application-architecture.md`
  - `07-module-boundaries-and-code-organization.md`
  - `17-technology-decision-framework.md`
  - `19-roadmap-to-implementation.md`
  - `20-initial-implementation-checklist.md`
  - `37-dependency-policy.md`
  - `38-version-compatibility-matrix.md`
  - `ADR-003 — Monorepo, Package Manager and Build Orchestration`
  - `ADR-007 — Styling, Tokens and Theming Implementation`
  - `ADR-008 — Testing Stack`
  - `ADR-010 — Auth, Session and Secure Storage Baseline`
- **Doğrudan etkileyeceği dokümanlar:**
  - `22-design-tokens-spec.md`
  - `23-component-governance-rules.md`
  - `28-observability-and-debugging.md`
  - `30-contribution-guide.md`
  - `31-audit-checklist.md`
  - `32-definition-of-done.md`
  - `35-document-map.md`

---

# 1. Bu Dokümanın Revize Edilme Nedeni

Önceki versiyon repo topolojisi için iyi bir yön veriyordu ama artık yeterli değildir.  
Çünkü artık:

- monorepo kararı kapandı,
- pnpm + Turborepo hattı kapandı,
- state/data/forms/styling/testing/auth/i18n yönleri kapandı,
- dependency ve compatibility kuralları yazıldı.

Bu nedenle repo structure artık soyut “güçlü adaylar” diliyle kalamaz.  
Artık daha somut olmak zorundadır.

Bu belgenin yeni görevi:

> **Bu repo’da ilk gün hangi exact üst alanların, hangi başlangıç package ailelerinin ve hangi placement kurallarının uygulanacağını netleştirmek.**

---

# 2. Amaç

Bu dokümanın amacı, repo yapısını:

- klasör estetiği,
- “bence böyle daha temiz”,
- alışkanlık,
- framework template’inin bıraktığı yapı

gibi zayıf temellerden çıkarıp;  
**mimari sınırları fiziksel olarak görünür kılan, docs-first yaklaşımı repo topolojisine bağlayan ve canonical stack’in gerçek yerleşimini tanımlayan** teknik spesifikasyona dönüştürmektir.

Bu belge şu sorulara net cevap verir:

1. Root’ta hangi ana alanlar olacak?
2. Başlangıçta exact hangi app’ler olacak?
3. Başlangıçta exact hangi package’ler olacak?
4. Hangi şeyler package olacak, hangileri app içinde kalacak?
5. Feature code nereye konacak?
6. Auth/session/query/i18n gibi alanlar fiziksel olarak nerede yer alacak?
7. Docs, tooling ve scripts nasıl ayrılacak?
8. Test, assets ve config placement nasıl yapılacak?
9. Hangi placement kararları doğrudan zayıf kabul edilecek?

---

# 3. Temel Tez

Bu proje kapsamında temel tez şudur:

> Repo topolojisi, uygulama mantığını klasörlere dökme işi değildir; karar verilmiş mimariyi, design system sınırlarını, tooling/governance yüzeylerini ve cross-platform ürün mantığını görünür kılan fiziksel sistemdir. Bu nedenle repo yapısı erken doğaçlama ile değil, canonical karar setinin fiziksel karşılığı olarak kurulmalıdır.

Bu tez şu sonuçları doğurur:

1. `apps/` ile `packages/` ayrımı gerçek olmalıdır.
2. Her ortak şey package olmaz.
3. Gerçek shared alanlar app içine gömülmez.
4. Docs repo dışı düşünülmez.
5. Tooling uygulama runtime kodu ile karıştırılmaz.
6. Root alanı çöplük olamaz.
7. “shared/common/utils” belirsizliği kabul edilmez.

---

# 4. Canonical Root Topology

Bu repo için canonical root topolojisi aşağıdaki ana ailelerden oluşur:

```text
/
├─ apps/
├─ packages/
├─ docs/
├─ project/
├─ tooling/
│  └─ ai/
│     ├─ stitch/
│     │  ├─ templates/       # Stitch talimat şablonları
│     │  └─ exports/         # Stitch HTML çıktıları (geçici)
│     └─ codex/
│        └─ review-rules/    # Dizin-spesifik AGENTS.md örnekleri
├─ scripts/
├─ .github/
├─ .moai/                    # MoAI-ADK (moai init tarafından üretilir)
│  ├─ config/sections/       # quality.yaml, methodology seçimi
│  ├─ memory/                # Ajan hafızası (.gitignore'da)
│  ├─ specs/                 # SPEC-001.md, SPEC-002.md...
│  └─ docs/                  # Otomatik üretilen dokümanlar
├─ .claude/                  # Claude Code + MoAI-ADK ortak
│  ├─ agents/                # Ajan tanımları
│  ├─ commands/              # Slash command tanımları (MoAI dahil)
│  ├─ hooks/                 # Pre/post hook konfigürasyonları
│  └─ settings.json          # MCP sunucu tanımları dahil
├─ CLAUDE.md                 # Claude Code proje talimatı
├─ AGENTS.md                 # Codex CLI proje talimatı
├─ DESIGN.md                 # Stitch tasarım sistemi (Stitch'ten export)
├─ package.json
├─ pnpm-workspace.yaml
├─ turbo.json
├─ tsconfig.base.json
├─ eslint.config.js
├─ prettier.config.*   (varsa)
├─ .gitignore
├─ .claudeignore             # AI aracının okumaması gereken dosyalar
├─ .nvmrc              (veya eşdeğeri)
└─ env template files
```

Bu üst aileler başlangıç için default kabul edilir.

### AI Dizin Placement Kuralları

- `.moai/` → `moai init` tarafından üretilir. Bootstrap sırasında boilerplate konfigürasyonuyla merge edilmeli (40-ai-workflow-and-tooling.md bölüm 13).
- `.moai/specs/` → SPEC dokümanları yalnızca buraya yazılır, başka yere dağıtılmaz.
- `.moai/memory/` → Ajan hafızası. `.gitignore`'da tutulur — sensitive veri içerebilir.
- `.claude/` → Claude Code ve MoAI-ADK ortak kullanır. `moai init` ve boilerplate konfigürasyonu merge edilir.
- `CLAUDE.md` → Claude Code'un her oturumda otomatik okuduğu proje talimatı. Proje kökünde yaşar.
- `AGENTS.md` → Codex CLI'ın her iş öncesi okuduğu talimat dosyası. Hiyerarşik: alt dizinlere daha spesifik AGENTS.md yerleştirilebilir (ör. `packages/ui/AGENTS.md`).
- `DESIGN.md` → Stitch'ten export edilir, elle düzenlenmez. Değişiklik Stitch'te yapılır. 22-design-tokens-spec.md ile çelişirse 22 kazanır.
- `.claudeignore` → `.env`, credentials ve secret dosyalarının AI aracının context'ine girmesini engeller.
- `tooling/ai/` → AI araç şablonları ve çıktıları. `stitch/exports/` geçici çıktıdır, `codex/review-rules/` dizin-spesifik AGENTS.md örnekleri barındırır.

---

# 5. Root Alanlarının Rolleri

## 5.1. `apps/`
Çalıştırılabilir uygulama kabukları.

## 5.2. `packages/`
Gerçek shared ve sınırı anlamlı package’ler.

## 5.3. `docs/`
Yaşayan karar, standart ve audit sistemi. Yalnızca boilerplate seviyesindeki belgeleri barındırır.

## 5.4. `project/`
Projeye ait dökümanlar. Bu dizin boilerplate'ten türetilen her projenin kendi kapsamına, gereksinimlerine ve kararlarına aittir. `docs/` ile `project/` arasındaki ayrım kesindir: `docs/` boilerplate standart ve kurallarını taşır, `project/` projenin kendine ait dökümanlarını taşır. İç yapısı, dosya isimlendirmesi ve organizasyonu tamamen projeye bırakılır — boilerplate bu dizinin içeriğine kural koymaz.

## 5.5. `tooling/`
Custom lint, HIG enforcement, codemod ve governance destek araçları.

## 5.6. `scripts/`
Operasyonel komutlar ve yardımcı repo işlemleri.

## 5.7. `.github/`
CI/workflow, PR template ve repo operasyon altyapısı.

## 5.8. Root config files
Workspace, lint, TS, turbo ve repo-level metadata.

---

# 6. Exact Başlangıç App Seti

Bu repo için başlangıçta canonical app seti şudur:

```text
apps/
├─ web/
└─ mobile/
```

Başlangıçta üçüncü bir “playground” veya “storybook app” zorunlu değildir.  
Gerekiyorsa sonradan açılır.

---

# 7. `apps/web` Exact Rolü

## 7.1. `apps/web` içine girenler
- Vite web shell
- React DOM entry
- web router assembly
- app-level providers
- web-specific runtime wiring
- web-specific assets
- web-specific route/screens composition
- web-specific platform adapters

## 7.2. `apps/web` içine girmeyenler
- shared token authority
- reusable UI package’in asıl kaynağı
- cross-app domain core
- global config packages
- generic testing helpers ana kaynağı

## 7.3. İlk önerilen iç yapı

```text
apps/web/
├─ src/
│  ├─ app/
│  ├─ navigation/
│  ├─ features/
│  ├─ providers/
│  ├─ platform/
│  ├─ assets/
│  └─ test-support/   (gerekirse app-private)
├─ public/
├─ vite.config.*
├─ tsconfig.json
└─ package.json
```

---

# 8. `apps/mobile` Exact Rolü

## 8.1. `apps/mobile` içine girenler
- Expo app shell
- React Native entry
- mobile navigation assembly
- root providers
- mobile-specific runtime wiring
- safe area and mobile platform boot code
- mobile assets
- mobile-specific platform adapters

## 8.2. `apps/mobile` içine girmeyenler
- shared token authority
- reusable UI package’in asıl kaynağı
- generic domain core
- global config packages
- auth artefact’ların dağınık storage erişimi

## 8.3. İlk önerilen iç yapı

```text
apps/mobile/
├─ src/
│  ├─ app/
│  ├─ navigation/
│  ├─ features/
│  ├─ providers/
│  ├─ platform/
│  ├─ assets/
│  └─ test-support/   (gerekirse app-private)
├─ app.json / app.config.*
├─ metro.config.*
├─ babel.config.*
├─ tsconfig.json
└─ package.json
```

---

# 9. Exact Başlangıç Package Seti

Başlangıçta canonical package ailesi şu şekilde kabul edilir:

```text
packages/
├─ core/
├─ design-tokens/
├─ ui/
├─ config-typescript/
├─ config-eslint/
└─ testing/
```

## 9.1. Neden yalnızca bunlar?
Çünkü başlangıçta amaç:
- her şeyi package yapmak değil,
- gerçek shared foundation’ı görünür kılmaktır.

## 9.2. Monorepo Package Publish Stratejisi

Bu proje kapsamında package'ların npm'e publish edilip edilmeyeceği, ne zaman publish düşünüleceği ve publish'e geçiş sürecinin nasıl yönetileceği net kurallarla tanımlanmalıdır.

### 9.2.1. Varsayılan: Internal-Only

Başlangıçta hiçbir package npm'e publish **edilmez**. Tüm package'lar workspace protocol (`workspace:*`) ile birbirine bağlıdır ve yalnızca bu monorepo içinde tüketilir.

Bu, `package.json`'daki dependency tanımlarında şu şekilde görünür:

```json
{
  "dependencies": {
    "@proje/core": "workspace:*",
    "@proje/ui": "workspace:*",
    "@proje/design-tokens": "workspace:*"
  }
}
```

`workspace:*` ifadesi pnpm'e "bu dependency'yi npm registry'den değil, bu monorepo'daki ilgili workspace'ten çöz" der. Bu sayede:
- Package'lar arasında anlık değişiklik yansıması olur (build gerekmeden).
- Versiyon uyumsuzluğu riski yoktur çünkü hepsi aynı repo'dadır.
- Publish, registry, versiyon yönetimi gibi overhead'ler ortadan kalkar.

### 9.2.2. Neden Başlangıçta Publish Etmiyoruz?

- **Tek ürün, tek repo:** Bu boilerplate tek bir ürünün (web + mobile) monorepo'sudur. Tüm consumer'lar aynı repo içindedir. Harici bir consumer yoktur; dolayısıyla npm'e publish etmenin sağlayacağı bir fayda yoktur.
- **Publish overhead gereksiz:** npm publish süreci versiyon yönetimi, changelog, registry authentication, publish CI adımı, semver uyumu kontrolü gibi ek karmaşıklık getirir. Bu karmaşıklık ancak harici tüketim olduğunda karşılığını verir.
- **Workspace protocol yeterli:** pnpm workspace protocol, monorepo içi package tüketimi için publish'in sağladığı her şeyi (ve daha fazlasını) zaten sağlar. Değişiklikler anında yansır, versiyon senkronizasyonu otomatiktir.

### 9.2.3. Ne Zaman Publish Düşünülür?

Publish ancak aşağıdaki senaryolardan biri gerçekleştiğinde gündeme gelmelidir:

- **Package başka bir projede kullanılacaksa:** Örneğin `@proje/design-tokens` veya `@proje/ui` package'ı farklı bir repo'daki başka bir projede de kullanılmak isteniyorsa, o package'ın npm'e (veya private registry'ye) publish edilmesi gerekir.
- **Açık kaynak yapılacaksa:** Örneğin `@proje/ui` açık kaynak bir design system olarak toplulukla paylaşılacaksa, npm'e public olarak publish edilmesi gerekir.
- **Micro-frontend gerekirse:** İleride micro-frontend mimarisine geçilirse ve package'lar bağımsız deploy edilen uygulamalar tarafından tüketilecekse, publish gerekebilir.

Bu senaryolardan hiçbiri gündemde değilken "belki lazım olur" diye publish altyapısı kurmak gereksiz erken optimizasyondur.

### 9.2.4. Publish'e Geçiş Süreci

Bir package'ın publish edilmesine karar verildiğinde aşağıdaki adımlar izlenmelidir:

**Changeset ile versiyon yönetimi:**
- [Changesets](https://github.com/changesets/changesets) aracı kullanılır. Her değişiklik için bir changeset dosyası oluşturulur ve bu dosya değişikliğin major/minor/patch olduğunu belirtir.
- Changeset'ler merge sonrası toplanır ve version bump otomatik hesaplanır.

**package.json hazırlığı:**
- `version` alanı doğru ve güncel olmalıdır.
- `main` alanı CommonJS entry point'i göstermelidir.
- `types` alanı TypeScript type declaration entry point'i göstermelidir.
- `exports` alanı modern Node.js export map'i ile tüm public entry point'leri tanımlamalıdır.
- Bu alanlardan herhangi biri eksik veya yanlışsa, consumer'lar package'ı doğru şekilde import edemez.

**CI publish akışı:**
- Main branch'e merge → changeset toplanır → version bump hesaplanır → yeni versiyon commit edilir → npm publish tetiklenir.
- Bu akış CI'da otomatik çalışmalıdır. Manuel publish kabul edilmez çünkü insan hatası riski taşır.

**Semantic versioning zorunludur:**
- Major: breaking change (API değişikliği, kaldırılan export, davranış değişikliği).
- Minor: geriye uyumlu yeni özellik.
- Patch: geriye uyumlu hata düzeltmesi.
- Semver ihlali (breaking change'i minor olarak yayınlamak gibi) consumer'ların build'ini beklenmedik şekilde kırabilir.

**Registry seçimi:**
- Şirket içi kullanım için private registry (GitHub Packages, npm organization private scope, Verdaccio vb.) tercih edilir.
- Açık kaynak yapılacaksa public npm registry kullanılır.
- Registry seçimi publish kararı ile birlikte yapılmalıdır.

### 9.2.5. Private Flag Kuralı

Tüm package'lar başlangıçta `package.json`'da `"private": true` olarak işaretlenir:

```json
{
  "name": "@proje/core",
  "private": true,
  "version": "0.0.0"
}
```

`"private": true` flag'i npm'in bu package'ı yanlışlıkla publish etmesini engeller. `npm publish` komutu çalıştırılsa bile npm bu package'ı reddeder.

Bir package için publish kararı alındığında:
1. `"private": true` satırı kaldırılır.
2. `version`, `main`, `types`, `exports` alanları doğru şekilde doldurulur.
3. Changeset altyapısı kurulur.
4. CI publish adımı eklenir.

Bu geçiş bilinçli ve planlı olmalıdır; kazara publish riski minimize edilmelidir.

### 9.2.6. Hatalı Yaklaşımlar

- **"Belki lazım olur" diye publish:** Henüz harici consumer yokken publish altyapısı kurmak, versiyon yönetimi, changelog, registry bakımı gibi gereksiz overhead yaratır. İhtiyaç kanıtlanmadan publish'e geçilmemelidir.
- **Versioning olmadan publish:** Semantic versioning uygulamadan package publish etmek, consumer'ların hangi versiyonun ne içerdiğini bilememesine ve beklenmedik breaking change'lerle karşılaşmasına yol açar.
- **Workspace protocol'ü publish edilecek pakette bırakmak:** `workspace:*` dependency'si yalnızca monorepo içinde çalışır. npm'e publish edilen bir package'ta `"@proje/core": "workspace:*"` kalırsa, bu package'ı dışarıdan install eden hiç kimse dependency'yi çözemez. Publish öncesi workspace protocol referansları gerçek semver aralıklarına dönüştürülmelidir. Changesets ve pnpm publish bu dönüşümü otomatik yapabilir; ama doğrulanmalıdır.

## 9.3. Özellikle başlangıçta package OLMAYAN bazı alanlar
Aşağıdakiler varsayılan olarak app-level kalır:
- feature modülleri
- auth provider-specific runtime wiring
- route composition
- app shell providers
- query hooks’un büyük kısmı
- screen-level composition
- app-private assets
- platform adaptation glue code

---

# 10. `packages/core` Exact Rolü

## 10.1. İçine girenler
- domain models
- pure business rules
- selectors/calculations
- reusable domain-safe helpers
- shared validation primitives (uygunsa)
- feature-agnostic core contracts

## 10.2. İçine girmeyenler
- UI
- routing
- platform APIs
- storage access
- app shell wiring
- raw network clients
- analytics vendor binding
- auth provider SDK erişimi

## 10.3. Önerilen iç yapı

```text
packages/core/
├─ src/
│  ├─ entities/
│  ├─ rules/
│  ├─ selectors/
│  ├─ calculations/
│  ├─ contracts/
│  ├─ mappers/       (yalnızca domain-safe ise)
│  └─ index.ts
├─ tests/
├─ tsconfig.json
└─ package.json
```

---

# 11. `packages/design-tokens` Exact Rolü

## 11.1. İçine girenler
- raw palette
- semantic color roles
- spacing scale
- typography scale
- border/radius tokens
- motion timing/easing tokens
- exported token contracts
- theme role definitions

## 11.2. İçine girmeyenler
- actual component code
- route or feature logic
- app-specific theme preferences
- raw StyleSheet/CSS implementation helpers

## 11.3. Önerilen iç yapı

```text
packages/design-tokens/
├─ src/
│  ├─ raw/
│  ├─ semantic/
│  ├─ typography/
│  ├─ spacing/
│  ├─ motion/
│  └─ index.ts
├─ tsconfig.json
└─ package.json
```

---

# 12. `packages/ui` Exact Rolü

## 12.1. İçine girenler
- primitives
- reusable components
- field shells
- controlled variant systems
- common feedback surfaces
- DS-level a11y-aware interaction surfaces

## 12.2. İçine girmeyenler
- feature-specific cards/screens
- auth flow UI composition
- route-level wrappers
- query hooks
- business logic
- platform-specific shell glue

## 12.3. Önerilen iç yapı

```text
packages/ui/
├─ src/
│  ├─ primitives/
│  ├─ components/
│  ├─ form/
│  ├─ feedback/
│  ├─ layout/
│  ├─ internal/      (private helpers)
│  └─ index.ts
├─ tests/
├─ tsconfig.json
└─ package.json
```

### Not
`internal/` alanı private olmalıdır.  
Doğrudan import edilmez.

### Başlangıç Component Seti Referansı

`packages/ui` altındaki başlangıç component seti `39-default-screens-and-components-spec.md` Bölüm 11-17'de tanımlanmıştır. Primitive'ler (C01-C12) `packages/ui/primitives/` altında, core component'ler (C13-C56) `packages/ui/components/` altında yer alır. Layout component'leri (C47-C50) ekran wrapper pattern'leri olarak `packages/ui/layouts/` altında organize edilir.

---

# 13. `packages/config-typescript` Exact Rolü

## 13.1. İçine girenler
- base TS config
- app-level TS config presets
- package-level TS config presets

## 13.2. İçine girmeyenler
- runtime code
- lint rules
- scripts
- feature code

---

# 14. `packages/config-eslint` Exact Rolü

## 14.1. İçine girenler
- repo-wide lint config pieces
- rule composition
- possible custom plugin consumption glue

## 14.2. İçine girmeyenler
- runtime code
- project features
- raw scripts

---

# 15. `packages/testing` Exact Rolü

## 15.1. İçine girenler
- shared test helpers
- custom render utilities
- shared fixtures that are truly shared
- test-only helper builders
- cross-app test support contracts

## 15.2. İçine girmeyenler
- feature-private mocks
- app-private test boot code
- production code

## 15.3. Kural
Shared test support gerçek shared ise package olur.  
Yoksa app içinde kalır.

---

# 16. `docs/` Exact Organizasyonu

Bu repo için `docs/` altında en az aşağıdaki aileler görünür olmalıdır:

```text
docs/
├─ foundation/
├─ architecture/
├─ design-system/
├─ quality/
├─ governance/
├─ implementation/
├─ adr/
├─ checklists/
└─ maps/
```

## 16.1. Neden?
Çünkü 30+ belge tek düz klasörde uzun vadede okunabilir kalmaz.

## 16.2. Minimum kural
Belge aileleri görünür olacak.  
Belge isimleri yalnızca numaraya bırakılmayacak; klasör semantiği de yardımcı olacak.

---

# 17. `tooling/` Exact Rolü

## 17.1. İçine girebilecek güçlü aday alanlar

```text
tooling/
├─ hig-lint/
├─ hig-runtime/
├─ hig-codemod/
├─ boundary-tools/
└─ repo-validators/
```

### Not
Bunların hepsinin ilk gün dolu olması gerekmez.  
Ama tooling alanı app runtime kodundan ayrı yaşamalıdır.

## 17.2. Neden kritik?
Bu proje custom governance ve enforcement hedefliyor.  
Tooling bu nedenle bir yan klasör değil, kalite omurgasıdır.

---

# 18. `scripts/` Exact Rolü

## 18.1. İçine girebilecek güçlü aday alanlar

```text
scripts/
├─ bootstrap/
├─ verify/
├─ docs/
├─ maintenance/
├─ release/
└─ migrations/
```

## 18.2. Kural
Scripts alanı operational olmalıdır.  
Business logic veya app runtime glue burada yaşamaz.

---

# 19. Feature Placement Kuralı

## 19.1. Varsayılan kural
Feature code **app içinde** yaşar.

## 19.2. Neden?
Çünkü feature çoğu zaman:
- route/screen composition,
- local orchestration,
- query hooks,
- mutation behavior,
- app shell capabilities,
- platform adaptation
ile yakından bağlıdır.

## 19.3. Feature ne zaman package’a çıkar?
Sadece şu durumda:
- birden fazla app gerçekten aynı feature modülünü anlamlı biçimde kullanıyorsa
- public surface net ise
- app içinde kalması mimariyi gerçekten bozuyorsa
- taşımanın bakım faydası kanıtlıysa

## 19.4. Red flag
“Belki sonra kullanırız” diye feature package açmak.

---

# 20. Shared-by-Proof Placement Kuralı

Bu repo’nun temel fiziksel ilkesi şudur:

> **Shared-by-proof, not shared-by-ambition**

## 20.1. Ne demek?
Bir şey:
- iki yerde kullanılıyor diye otomatik package olmaz
- teorik reuse ihtimali var diye shared yapılmaz
- bir app’te duruyor diye de orada kalmaz

## 20.2. Soru
Bu kodu package yapınca gerçekten:
- boundary netleşiyor mu?
- duplicate risk düşüyor mu?
- testability artıyor mu?
- ownership temizleniyor mu?

Cevap hayırsa erken paylaşım vardır.

---

# 21. State / Query / Forms / Auth Placement Kuralı

## 21.1. Zustand stores
- app-global summary stores: app shell’e yakın veya kontrollü application-state alanında
- feature stores: ilgili feature içinde
- core package içinde generic global store authority kurulmaz

## 21.2. TanStack Query usage
- root QueryClient: app shell/provider düzeyi
- feature query hooks and orchestration: app feature düzeyi
- raw network transport veya domain mapping: controlled data access boundary
- query data `packages/core` içine rastgele taşınmaz

## 21.3. RHF + Zod usage
- shared field shell: `packages/ui`
- form orchestration: app feature
- generic shared schemas yalnızca gerçekten shared ise `packages/core` benzeri yerde
- feature-specific form schemas app feature içinde

## 21.4. Auth/session
- auth boundary and adapter: app shell/platform-aware controlled layer
- secure storage adapter: app/platform/security boundary
- sanitized auth summary: app-level controlled state surface
- raw auth artefact package/shared helper gibi yayılmaz

---

# 22. i18n Placement Kuralı

## 22.1. Runtime bootstrapping
- app shell/provider düzeyinde

## 22.2. Shared/common copy contracts
- ortak namespace ve ortak terminology yönetimi kontrollü shared content alanında olabilir

## 22.3. Feature-specific translations
- ilgili feature ownership’i ile organize edilir

## 22.4. Formatting helpers
- shared utility/contract alanında, string concat kaosu olmadan

## 22.5. Kural
i18n messages “her component kendi yanında tutar” serbestliği ile yönetilmez.  
Ama tüm kopyayı tek dosyada toplamak da yanlış olur.

---

# 23. Observability Placement Kuralı

## 23.1. Sentry / error boundary bindings
- app shell / provider / runtime integration düzeyinde

## 23.2. Analytics abstraction
- shared contract / controlled adapter alanında

## 23.3. Structured logging helpers
- shared utility veya controlled runtime support katmanında

## 23.4. Feature events
- feature code içinde, abstraction üstünden

## 23.5. Kural
Vendor SDK’ları feature dosyalarına doğrudan saçılmaz.

---

# 24. Test Placement Kuralı

## 24.1. Unit and component tests
- ilgili modül veya package yakınında

## 24.2. Shared test helpers
- `packages/testing`

## 24.3. App-private test harness
- ilgili app içinde

## 24.4. E2E
- repo-level veya app-level açık yüzey
- feature testleri ile karıştırılmaz

## 24.5. Önerilen alan

```text
tests/
└─ e2e/
```

veya

```text
apps/web-e2e/
```

gibi açık bir model.

---

# 25. Assets Placement Kuralı

## 25.1. App-private assets
- ilgili app içinde

## 25.2. Truly shared assets
- kontrollü ortak asset alanında
- gerçekten iki app kullanıyorsa

## 25.3. Kural
Asset paylaşımı da shared-by-proof ilkesine tabidir.

---

# 26. Environment and Secrets Placement Kuralı

## 26.1. Root’ta bulunabilecekler
- env example/template files
- non-secret config shape hints

## 26.2. Bulunmaması gerekenler
- gerçek secrets
- kişisel development secrets
- raw credential dumps

## 26.3. App-private env usage
- ilgili app runtime config yüzeyine yakın
- auth/session/security docs ile uyumlu

## 26.4. Kural
Secrets placement convenience-first değil, security-first ele alınır.

---

# 27. Public / Private Surface Kuralı

Her package ve mümkün olduğunca app içi önemli modül şu ayrımı görünür kılmalıdır:

- **public surface**
- **private internals**

## 27.1. Ne demek?
- dışarı açılan API net olmalı
- internal helper dosyalar deep import ile tüketilmemeli
- index/export map disiplinli kurulmalı

## 27.2. Red flag
`packages/ui/src/internal/...` dosyasının başka yerlerden import edilmesi.

---

# 28. Exact Önerilen Başlangıç Repo Ağacı

Aşağıdaki ağaç, v1 bootstrap için canonical başlangıç yönüdür:

```text
/
├─ apps/
│  ├─ web/
│  │  ├─ src/
│  │  │  ├─ app/
│  │  │  ├─ navigation/
│  │  │  ├─ features/
│  │  │  ├─ providers/
│  │  │  ├─ platform/
│  │  │  └─ assets/
│  │  ├─ public/
│  │  ├─ package.json
│  │  ├─ tsconfig.json
│  │  └─ vite.config.ts
│  └─ mobile/
│     ├─ src/
│     │  ├─ app/
│     │  ├─ navigation/
│     │  ├─ features/
│     │  ├─ providers/
│     │  ├─ platform/
│     │  └─ assets/
│     ├─ package.json
│     ├─ tsconfig.json
│     ├─ app.config.ts
│     ├─ babel.config.js
│     └─ metro.config.js
├─ packages/
│  ├─ core/
│  ├─ design-tokens/
│  ├─ ui/
│  ├─ config-typescript/
│  ├─ config-eslint/
│  └─ testing/
├─ docs/
│  ├─ foundation/
│  ├─ architecture/
│  ├─ design-system/
│  ├─ quality/
│  ├─ governance/
│  ├─ implementation/
│  ├─ adr/
│  ├─ checklists/
│  └─ maps/
├─ project/            ← projeye ait dökümanlar (yapısı projeye bırakılır)
├─ tooling/
│  ├─ hig-lint/
│  ├─ hig-runtime/
│  └─ hig-codemod/
├─ scripts/
│  ├─ bootstrap/
│  ├─ verify/
│  ├─ docs/
│  ├─ maintenance/
│  └─ release/
├─ tests/
│  └─ e2e/
├─ .github/
├─ package.json
├─ pnpm-workspace.yaml
├─ turbo.json
├─ tsconfig.base.json
├─ eslint.config.js
├─ .gitignore
└─ .nvmrc
```

### Not
Bu exact tree bir framework template kopyası değildir.  
Bu repo için verilmiş kararların fiziksel sonucudur.

---

# 29. Placement Kararı Verirken Sorulacak Sorular

Her yeni klasör, package veya modül eklenirken şu sorular sorulmalıdır:

1. Bu şey app runtime mı, shared package mi, tooling mi, docs mu?
2. Bunun sahibi kim?
3. Bu gerçekten birden fazla consumer taşıyor mu?
4. Feature mi, foundation mı?
5. Platform-specific mi, platform-agnostic mi?
6. Burada kalırsa boundary temiz mi?
7. Package olursa fayda gerçek mi?
8. Deep import ve public/private surface net mi?
9. Testi bağlamına yakın mı?
10. Yarın biri repo’ya bakınca bu yerleşimi açıklayabilir miyiz?

---

# 30. Repo Structure Anti-Pattern Listesi

Aşağıdaki davranışlar bu repo’da doğrudan zayıf kabul edilir:

1. `shared/`, `common/`, `utils/`, `lib/` gibi belirsiz depo klasörleri açmak
2. Tüm feature’ları package’laştırmak
3. Shared foundation’ı app içine gömmek
4. UI package içine feature card/screen taşımak
5. Core package içine network/storage/router koymak
6. Token authority’yi UI veya app içine dağıtmak
7. Auth artefact kullanımını her yere saçmak
8. SDK vendor binding’lerini feature dosyalarına yaymak
9. Tooling ile runtime code’u karıştırmak
10. Root’u config çöplüğü haline getirmek
11. Docs’u repo dışında düşünmek
12. Package public/private surface’ini görünmez bırakmak

---

# 31. Onay Kriterleri

Bu doküman yeterli kabul edilir eğer:

1. Monorepo topolojisi soyut değil, exact başlangıç aileleriyle tarif edilmişse
2. `apps/web`, `apps/mobile` ve başlangıç package seti net tanımlanmışsa
3. Feature, shared, platform-specific ve tooling/docs placement kuralları görünürse
4. State/query/forms/auth/i18n/observability placement kararları fiziksel karşılık bulmuşsa
5. Exact başlangıç repo ağacı verilmişse
6. Anti-pattern listesi placement seviyesinde netse
7. Bu belge repo bootstrap sırasında gerçek referans olarak kullanılabilecek netlikteyse

---

# 32. Kısa Sonuç

Bu dokümanın ana çıktısı şudur:

> Bu boilerplate için repo yapısı artık soyut klasör önerisi değildir. Canonical başlangıç topolojisi; `apps/web`, `apps/mobile`, `packages/core`, `packages/design-tokens`, `packages/ui`, `packages/config-typescript`, `packages/config-eslint`, `packages/testing`, `docs`, `tooling`, `scripts` ve repo-level config yüzeyleri üzerinden tanımlanmıştır. Feature code varsayılan olarak app içinde kalır; shared alanlar ancak kanıtlı fayda ile package olur.
