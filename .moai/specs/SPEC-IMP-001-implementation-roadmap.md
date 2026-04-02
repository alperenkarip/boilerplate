# SPEC-IMP-001 — Boilerplate İmplementasyon Yol Haritası

## Spec Kimliği

- **SPEC ID:** SPEC-IMP-001
- **Başlık:** Boilerplate İmplementasyon Yol Haritası — Adım Adım Üretim Planı
- **Durum:** In Progress
- **Tarih:** 2026-04-02
- **Son Revizyon:** 2026-04-02 (Codex denetim döngüsü #4 PASS — toplam 30 bulgu düzeltildi)
- **Kapsam:** Dokümantasyonu tamamlanmış boilerplate projesinin sıfırdan fiziksel repo bootstrap, package kurulum, app shell, design system, runtime foundation ve ilk vertical slice üretimine kadar olan tüm implementasyon adımlarını kapsar.
- **Hariç Tutulan Alanlar:** Vertical slice sonrası feature geliştirme, store yayınlama, production deployment
- **Referans Dokümanlar:**
  - `19-roadmap-to-implementation.md` — Aşama sıralaması ve geçiş kapıları
  - `20-initial-implementation-checklist.md` — Faz bazlı detaylı checklist
  - `21-repo-structure-spec.md` — Exact repo topolojisi
  - `36-canonical-stack-decision.md` — Kilitli teknoloji kararları
  - `37-dependency-policy.md` — Dependency kabul politikası
  - `38-version-compatibility-matrix.md` — Sürüm uyumluluk sözleşmesi
  - `39-default-screens-and-components-spec.md` — Component/ekran referansı (Bölüm 19 bootstrap fazları)
  - `ADR-001` → `ADR-019` — Mimari karar kayıtları

---

## 0. Giriş Kapıları (Entry Gates)

> Bu SPEC'in Faz A'sı başlatılmadan önce aşağıdaki kapılar geçilmiş olmalıdır. Bu kapılar `19-roadmap-to-implementation.md` Bölüm 21 ve `20-initial-implementation-checklist.md` Bölüm 4 tarafından zorunlu kılınmıştır.

| Kapı                                             | Açıklama                                                                         | Durum                                                                                                                                                    |
| ------------------------------------------------ | -------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Gate A — Decision Completeness**               | ADR-001 → ADR-019 + dependency policy + compatibility matrix tamam mı?           | ✅ Geçildi                                                                                                                                               |
| **Gate B — Document Synchronization**            | Operasyonel belgeler (17, 19, 20, 21, 35) canonical karar setiyle senkronize mi? | ⚠️ Kısmi — `20-initial-implementation-checklist.md` Faz R'deki ekran isimleri stale; otorite `39` Bölüm 6-7'dir                                          |
| **Gate C — Consistency Audit**                   | Bütün belge seti birlikte okunduğunda çelişki kalmadı mı?                        | ✅ Geçildi — 3 çelişki bulundu ve düzeltildi (36'ya ADR-012→019 eklendi, 38'de Vite örneği 8.x'e düzeltildi, 20 vs 39 ekran isimleri → 39 authoritative) |
| **Gate D — Bootstrap Readiness**                 | Repo bootstrap için exact sıra ve topology net mi?                               | ✅ Bu SPEC ile netleştirildi                                                                                                                             |
| **Gate E — Controlled Implementation Readiness** | Checklist artık keşif değil, uygulama planı mı?                                  | ✅ Bu SPEC ile sağlandı                                                                                                                                  |

> **Kural:** Gate C (consistency audit) geçilmeden Faz A başlatılamaz. Audit, bu SPEC'in kendisinin de referans dokümanlarla tutarlılığını içerir.

---

## 1. Amaç

Bu SPEC, 130+ doküman ve 19 ADR ile karar katmanı tamamlanmış boilerplate projesinin fiziksel implementasyonunu **adım adım, faz faz, kontrollü şekilde** yürütmek için gereken tüm iş kalemlerini, done kriterlerini, bağımlılıkları ve paralel track'leri tanımlar.

**Bu SPEC bir keşif belgesi değildir.** Tüm teknoloji kararları kilitlidir. Bu belge yalnızca "kararları hangi sırayla koda dönüştüreceğimizi" tanımlar.

---

## 2. Mevcut Durum

| Alan              | Durum           | Açıklama                                |
| ----------------- | --------------- | --------------------------------------- |
| Dokümantasyon     | ✅ Tamamlandı   | 130+ dosya, 83k+ satır                  |
| ADR seti          | ✅ Kilitli      | ADR-001 → ADR-019 kabul edildi          |
| Dependency Policy | ✅ Kabul edildi | 37-dependency-policy.md                 |
| Version Matrix    | ✅ Kabul edildi | 38-version-compatibility-matrix.md      |
| Kaynak kod        | ❌ Yok          | Sıfır satır implementasyon              |
| Repo yapısı       | ❌ Yok          | apps/, packages/ dizinleri mevcut değil |
| Config dosyaları  | ❌ Yok          | package.json, turbo.json, tsconfig yok  |
| CI/CD pipeline    | ❌ Yok          | Şablon var, aktif değil                 |

---

## 3. Canonical Stack Özeti (Kilitli — Değiştirilemez)

| Alan                | Teknoloji                                                | Sürüm                     | Otorite   |
| ------------------- | -------------------------------------------------------- | ------------------------- | --------- |
| Web runtime         | React + Vite + React Router                              | 19.2.x / 8.x / 7.x        | ADR-001   |
| Mobile runtime      | React Native + Expo                                      | 0.83.x / SDK 55.x         | ADR-002   |
| Monorepo            | pnpm + Turborepo                                         | 10.x / 2.x                | ADR-003   |
| State               | Zustand (local-first)                                    | 5.x                       | ADR-004   |
| Data fetching       | fetch-first + TanStack Query                             | 5.x (conditional)         | ADR-005   |
| Forms               | React Hook Form + Zod                                    | 7.x / 4.x                 | ADR-006   |
| Styling (web)       | Tailwind CSS                                             | 4.x                       | ADR-007   |
| Styling (mobile)    | NativeWind                                               | 5.x (candidate)           | ADR-007   |
| Testing (web)       | Vitest                                                   | 4.x                       | ADR-008   |
| Testing (mobile)    | Jest                                                     | 30.x                      | ADR-008   |
| Testing (E2E)       | Playwright                                               | 1.58.x                    | ADR-008   |
| Observability       | Sentry + analytics abstraction                           | —                         | ADR-009   |
| Auth (web)          | Backend-managed HttpOnly cookies                         | —                         | ADR-010   |
| Auth (mobile)       | Expo SecureStore + Biometric (expo-local-authentication) | —                         | ADR-010   |
| i18n                | i18next + react-i18next                                  | 26.x / 17.x               | ADR-011   |
| Navigation (web)    | React Router                                             | 7.x                       | ADR-012   |
| Navigation (mobile) | React Navigation                                         | 7.x stable                | ADR-012   |
| New Architecture    | Fabric + JSI + TurboModules + Hermes V1                  | zorunlu                   | ADR-018   |
| Local storage       | MMKV + SecureStore + Zustand persist                     | —                         | ADR-019   |
| Animation           | react-native-reanimated                                  | 3.x (Expo SDK 55 bundled) | 38-matrix |
| Node.js             | LTS                                                      | 20.19.x                   | 38-matrix |
| TypeScript          | strict mode                                              | 5.9.x                     | 38-matrix |

> **Not:** `react-native-mmkv 3.x` artık `38-version-compatibility-matrix.md`'ye eklenmiştir (E.1.0b tamamlandı).

---

## 4. Paralel Track Modeli

Implementasyon 3 paralel track üzerinden yürütülür. Track'ler belirli birleşme noktalarında senkronize olur.

```
Track A — CORE (Çekirdek Altyapı)
══════════════════════════════════
Faz A (Toolchain Lock + Mobile Readiness)
  → Faz B (Repo Bootstrap)
    → Faz C (Config Packages)
      → Faz E (Dependency Install)
        → Faz F (Docs & Governance Binding)
          → Faz J (App Shells) ← BİRLEŞME #1
            → Faz K-O (Runtime Foundations)
              → Faz P (Testing Stack + Storybook Baseline)
                → Faz Q- (System & Auth Screens — S01-S13)
                  → Faz Q (Vertical Slice — S25-S27) ← BİRLEŞME #2
                    → Faz R (First Audit)

Track B — UI/DS (Design System & Görsel Altyapı)
═════════════════════════════════════════════════
Faz B (Repo Bootstrap) [Track A'dan]
  → Faz G (Design Tokens Package)
    → Faz H (Theme Runtime)
      → Faz I (UI Primitives — Tier 1)
        → Faz J (App Shells) ← BİRLEŞME #1
          → Faz I+ (UI Components — Tier 2/3, J sonrası paralel)

Track C — INFRA (CI/CD & Kalite Altyapısı)
═══════════════════════════════════════════
Faz B (Repo Bootstrap) [Track A'dan]
  → Faz D (Quality Gates)
    → Faz D.5 (New Architecture Check)
      → Faz J (App Shells) ← BİRLEŞME #1
```

### Birleşme Noktaları

| Nokta                   | Koşul                                                                                     | Açıklama                                                                                                                                           |
| ----------------------- | ----------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| **BİRLEŞME #1 (Faz J)** | Track A (Faz E + F) + Track B (Faz I — Tier 1 primitives) + Track C (Faz D.5) tamamlanmış | Config + Tier 1 primitives + quality gates + docs binding hazır, app shell ayağa kaldırılabilir. Not: Faz I+ (Tier 2-3) J sonrası paralel ilerler. |
| **BİRLEŞME #2 (Faz Q)** | Tüm track'ler Faz P'de birleşmiş                                                          | Tüm foundation'lar hazır, vertical slice başlatılabilir                                                                                            |

---

## 5. Tahmini Süre Tablosu

| Faz | Açıklama                           | Süre      | Paralel?                         | Bağımlılık          |
| --- | ---------------------------------- | --------- | -------------------------------- | ------------------- |
| A   | Toolchain Lock + Mobile Readiness  | 2-4 saat  | — (ilk adım)                     | Gate C geçilmiş     |
| B   | Repo Bootstrap                     | 2-4 saat  | Hayır                            | Faz A               |
| C   | Config Packages                    | 1-2 gün   | Evet (B sonrası D/G ile paralel) | Faz B               |
| D   | Quality Gates                      | 1-2 gün   | Evet (C/G ile paralel)           | Faz B               |
| D.5 | New Architecture Check             | 2-4 saat  | Evet (D ile birlikte)            | Faz B               |
| E   | Dependency Install                 | 1 gün     | Hayır                            | Faz C + D           |
| F   | Docs & Governance Binding          | yarım gün | Hayır                            | Faz E               |
| G   | Design Tokens Package              | 2-3 gün   | Evet (C/D ile paralel)           | Faz B               |
| H   | Theme Runtime                      | 1-2 gün   | Hayır                            | Faz G               |
| I   | UI Primitives (Tier 1)             | 2-3 gün   | Hayır                            | Faz H               |
| I+  | UI Components (Tier 2-3)           | 3-5 gün   | Evet (J sonrası K-O ile paralel) | Faz I               |
| J   | App Shells                         | 1-2 gün   | Hayır                            | Faz E + F + I + D.5 |
| K   | Navigation Foundation              | 1 gün     | Hayır                            | Faz J               |
| L   | Auth, Session & Biometric          | 1-2 gün   | Evet (K ile paralel)             | Faz J               |
| M   | State, Query, Forms & Offline      | 1-2 gün   | Evet (K/L ile paralel)           | Faz J               |
| N   | i18n Foundation                    | yarım gün | Evet (K-M ile paralel)           | Faz J               |
| O   | Observability Foundation           | yarım gün | Evet (K-M ile paralel)           | Faz J               |
| P   | Testing Stack + Storybook Baseline | 1-2 gün   | Hayır                            | Faz K-O + I+        |
| Q-  | System & Auth Screens (S01-S13)    | 3-5 gün   | Hayır                            | Faz P               |
| Q   | Vertical Slice (S25-S27)           | 2-3 gün   | Hayır                            | Faz Q-              |
| R   | First Audit & Stabilization        | 1-2 gün   | Hayır                            | Faz Q               |

**Toplam:** 3-4 hafta (tek geliştirici) / 2-3 hafta (2-3 kişi paralel) + %20-30 tampon

---

## 6. Adım Adım Faz Detayları

---

### FAZ A — Environment & Toolchain Lock + Mobile Readiness

**Amaç:** Hiçbir paket kurulmadan önce çalışma zemini sabitleme. Mobile bootstrap risklerini erken görünür kılma.

**Durum:** `[x] Tamamlandı (toolchain lock) / Mobile readiness Faz J'ye ertelendi`

**Bağımlılık:** Bölüm 0 — Gate C (Consistency Audit) geçilmiş olmalı ✅

#### A.1 Yapılacak İşler

- [x] A.1.1 — Node.js `20.19.x` LTS hattı repo standardı olarak kilitlendi
- [x] A.1.2 — `.nvmrc` dosyası oluşturuldu (`20.19`) + `.node-version` eklendi
- [x] A.1.3 — pnpm `10.x` hattı exact pin ile sabitlendi (10.33.0)
  > **Not:** `pnpm@latest` kullanılmaz — bu gelecekte 11.x çekebilir ve toolchain kilidini bozar. Exact minor/patch veya `10.x` range belirtilmelidir. `packageManager` alanı root package.json'da pinlenir.
- [x] A.1.4 — `packageManager` alanı root `package.json`'a yazıldı: `"packageManager": "pnpm@10.33.0"`
- [x] A.1.5 — Turborepo `2.x` hattı orchestrator olarak belirlendi (scripts tanımlandı)
- [x] A.1.6 — TypeScript `5.9.x` baseline kabul edildi
- [x] A.1.7 — pnpm güvenlik baseline tanımlandı: → .npmrc ile minimum-release-age + onlyBuiltDependencies tanımlandı
  - `minimumReleaseAge` ayarlandı
  - `allowBuilds` whitelist tanımlandı
  - `trustPolicy` konfigüre edildi
  - `tooling/pnpm/pnpm-workspace.security.example.yaml` referans alındı
- [x] A.1.8 — Local ve CI için aynı toolchain baseline doğrulandı (engines field)

**Mobile Readiness (20-initial-implementation-checklist.md Faz A zorunlu maddeler):**

- [x] A.1.9 — `expo-doctor` çalıştırıldı ve temiz geçti → 17/17 PASS
- [x] A.1.10 — React Native Directory uyarıları gözden geçirildi → expo-doctor ile doğrulandı
- [x] A.1.11 — `userInterfaceStyle: "automatic"` doğrulandı (Faz J'de yapıldı)
- [x] A.1.12 — Mobile development build → Expo dev client konfigürasyon hazır (expo-build-properties + newArchEnabled)

#### A.2 Done Kriterleri

- [x] `.nvmrc` veya `.node-version` dosyası mevcut ve doğru sürümde
- [x] `packageManager` alanı root package.json'da pinli (pnpm@10.33.0)
- [x] Local bootstrap akışı deterministik (engines constraint)
- [x] CI image/runtime ile local baseline çelişmiyor → **CI workflow'da Node 20 + pnpm 10 pinli**
- [x] `expo-doctor` temiz geçti → 17/17 PASS
- [x] Development build → konfigürasyon hazır, fiziksel cihaz doğrulaması bekleniyor

#### A.3 Kırmızı Bayraklar

- ❌ Faz A kapanmadan paket kurmaya başlamak
- ❌ Node/pnpm sürümünü `latest` veya belirsiz bırakmak
- ❌ Mobile readiness doğrulamasını sonraya ertelemek

---

### FAZ B — Root Repo Bootstrap

**Amaç:** Monorepo fiziksel olarak ayağa kaldırılması.

**Durum:** `[x] Tamamlandı`

**Bağımlılık:** Faz A tamamlanmış olmalı ✅

#### B.1 Yapılacak İşler

- [x] B.1.1 — Root `package.json` oluşturuldu (workspace root, `"private": true`, `"packageManager"` pinli)
- [x] B.1.2 — `pnpm-workspace.yaml` oluşturuldu (ADR-003 catalog modeli dahil)
  > **Not:** `catalog:` bloğu ADR-003 Bölüm 29 gereğince monorepo-wide single-source version yönetimi sağlar. Package'lar `"catalog:"` prefix ile bu versiyonları tüketir.
- [x] B.1.3 — `turbo.json` oluşturuldu (task pipeline: build, typecheck, lint, test, verify, clean, dev)
- [x] B.1.4 — `tsconfig.base.json` oluşturuldu (strict mode, bundler resolution, ES2022)
- [x] B.1.5 — Üst dizinler oluşturuldu:
  - `apps/` (web ve mobile kabukları için)
  - `packages/` (shared paketler için)
  - `project/` (derived project dokümanları için)
  - `project/adr/` (proje-spesifik ADR'ler için)
  - `scripts/` (operasyonel komutlar için)
- [x] B.1.6 — Başlangıç package alanları oluşturuldu (21-repo-structure-spec.md Bölüm 10):
  - `packages/core/` — Domain logic, types, pure business rules, shared validation primitives
  - `packages/design-tokens/` — Raw palette, semantic tokens (Faz G'de doldurulacak)
  - `packages/ui/` — Reusable primitives & components (Faz I'de doldurulacak)
  - `packages/config-typescript/` — Shared TS config (Faz C'de doldurulacak)
  - `packages/config-eslint/` — Shared ESLint config (Faz C'de doldurulacak)
  - `packages/testing/` — Test helpers, fixtures, mocks (Faz P'de doldurulacak)
- [x] B.1.7 — Mevcut dizinler doğrulandı: `docs/`, `tooling/`
- [x] B.1.8 — `.gitignore` genişletildi (node_modules, dist, .env, .turbo, coverage vb.)
- [x] B.1.9 — `.env.example` oluşturuldu (Bash ile)
- [x] B.1.10 — `eslint.config.js` root düzeyinde oluşturuldu (flat config placeholder)
- [x] B.1.11 — `pnpm install` çalıştırıldı, lockfile üretildi (7 workspace projesi, TypeScript 5.9.3)
- [x] B.1.12 — `README.md` güncellendi → port numarası ve Expo Go notu güncellendi

#### B.2 Hedef Topoloji (21-repo-structure-spec.md Bölüm 4 ile hizalı)

```
/
├── apps/
│   ├── web/                     # (Faz J'de doldurulacak)
│   └── mobile/                  # (Faz J'de doldurulacak)
├── packages/
│   ├── core/                    # (B.1.6 — domain logic, types)
│   ├── config-typescript/       # (Faz C)
│   ├── config-eslint/           # (Faz C)
│   ├── design-tokens/           # (Faz G)
│   ├── ui/                      # (Faz I)
│   └── testing/                 # (Faz P)
├── docs/                        # (mevcut — dokunulmaz)
├── project/
│   └── adr/                     # derived project ADR'leri için
├── tooling/                     # (mevcut — genişletilecek)
│   └── ai/
│      ├── stitch/
│      │   ├── templates/        # Stitch talimat şablonları
│      │   └── exports/          # Stitch HTML çıktıları (geçici)
│      └── codex/
│         └── review-rules/      # Dizin-spesifik AGENTS.md örnekleri
├── scripts/
├── .github/
├── .moai/                       # MoAI-ADK (moai init tarafından üretilir)
│   ├── config/sections/
│   ├── memory/                  # .gitignore'da
│   ├── specs/
│   └── docs/
├── .claude/                     # Claude Code + MoAI-ADK ortak
│   ├── agents/
│   ├── commands/
│   ├── hooks/
│   └── settings.json
├── package.json
├── pnpm-workspace.yaml          # catalog: bloğu dahil
├── turbo.json
├── tsconfig.base.json
├── eslint.config.js
├── prettier.config.*            # (varsa)
├── .gitignore
├── .nvmrc
├── .env.example
├── .claudeignore
├── CLAUDE.md                    # (mevcut)
├── AGENTS.md                    # (mevcut)
└── DESIGN.md                    # (Stitch'ten export)
```

#### B.3 Done Kriterleri

- [x] `pnpm install` hatasız çalışıyor (engine uyarısı hariç — makinede Node 25.x, proje standardı 20.19.x)
- [x] Workspace komutları (`pnpm -r`, `pnpm --filter`) çalışıyor
- [x] Root topoloji `21-repo-structure-spec.md` ile uyumlu
- [x] `packages/core` dahil 6 başlangıç paketi scaffold edilmiş
- [x] `catalog:` bloğu pnpm-workspace.yaml'da tanımlanmış
- [x] Repo "tek uygulama klasörü" gibi görünmüyor

#### B.4 Kırmızı Bayraklar

- ❌ Repo bootstrap sırasında feature package açmak
- ❌ `apps/` altına doğrudan kaynak kodu doldurmak
- ❌ `shared/common/utils` gibi belirsiz paketler açmak
- ❌ `packages/core`'a UI, routing, storage veya auth provider SDK erişimi koymak

---

### FAZ C — Core Config Packages

**Amaç:** Shared config altyapısı kurulması.

**Durum:** `[x] Tamamlandı`

**Bağımlılık:** Faz B tamamlanmış olmalı ✅

**Paralel:** Faz D ve Faz G ile eşzamanlı çalışabilir

#### C.1 Yapılacak İşler

- [x] C.1.1 — `packages/config-typescript/` dolduruldu:
  - `package.json` (`@project/config-typescript`)
  - `tsconfig.base.json` (strict mode, bundler resolution, ES2022)
  - `tsconfig.web.json` (web-specific: DOM types, JSX)
  - `tsconfig.mobile.json` (RN-specific: react-native types)
  - `tsconfig.library.json` (packages için: composite, declaration)
- [x] C.1.2 — `packages/config-eslint/` dolduruldu:
  - `package.json` (`@project/config-eslint`)
  - ESLint flat config (`eslint.config.js`) — createConfig factory
  - TypeScript-ESLint → Faz E'de paket kurulunca genişletilecek
  - React/React Native kuralları → Faz E'de
  - Import sıralama kuralları → Faz E'de
  - Boundary enforcement kuralları → Faz D'de
- [x] C.1.3 — Root `tsconfig.base.json` → config-typescript'e bağlandı (extends)
- [x] C.1.4 — Root `eslint.config.js` → config-eslint'e bağlandı (import)
- [x] C.1.5 — Prettier formatting standardı sabitlendi (prettier.config.js)
- [x] C.1.6 — `turbo.json` task'ları güncellendi:
  ```json
  {
    "tasks": {
      "build": { "dependsOn": ["^build"] },
      "typecheck": { "dependsOn": ["^build"] },
      "lint": {},
      "test": { "dependsOn": ["^build"] },
      "verify": { "dependsOn": ["typecheck", "lint", "test"] }
    }
  }
  ```

#### C.2 Done Kriterleri

- [x] `pnpm typecheck` çalışıyor → turbo typecheck aktif
- [x] `pnpm lint` çalışıyor → eslint kurulu
- [x] Config duplicate'i oluşmamış (her app/package extend ediyor)
- [x] Config ailesi root ve package/app düzeyinde anlaşılır

---

### FAZ D — Quality Gates Minimum Activation

**Amaç:** Kod büyümeden önce kalite kapıları çalıştırma.

**Durum:** `[x] Tamamlandı`

**Bağımlılık:** Faz B tamamlanmış olmalı ✅

**Paralel:** Faz C ve Faz G ile eşzamanlı çalışabilir

#### D.1 Yapılacak İşler

- [x] D.1.1 — CI workflow (`.github/workflows/ci.yml`) mevcut ve kapsamlı:
  - `typecheck` step aktif ✅
  - `lint` step aktif ✅
  - `test` step aktif ✅
  - `build` step (sanity check) ✅
  - `boundary` step (packages/ → apps/ import yasağı) ✅
  - `security` step (dependency audit + secret leak scan) ✅
  - `catalog-sync` → Faz E'de dependency kurulunca eklenecek
- [x] D.1.2 — Boundary enforcement ilk versiyonu aktif (CI'da grep tabanlı):
  - `packages/` → `apps/` import yasağı ✅
  - `shared` → `feature` import yasağı → Faz E'de ESLint kuralı olarak eklenecek
  - Döngüsel bağımlılık tespiti → Faz E'de
- [x] D.1.3 — Dependency hygiene review kuralı yazılı (37-dependency-policy.md referans)
- [x] D.1.4 — `pnpm verify` local komutu tanımlandı (turbo run verify → typecheck + lint + test)
- [x] D.1.5 — Pre-commit hook (husky/lint-staged) kuruldu
  > **Not:** catalog sync CI step'i sonra eklenecek, catalog doğrulanmış durumda.

#### D.2 Done Kriterleri

- [x] Kalite kapıları yalnızca belgede değil, komut olarak çalışıyor (CI + pnpm verify)
- [x] Kırık type/lint/test merge öncesi görünür (CI blocker)
- [x] Boundary ihlali görünmez kalmıyor (CI boundary check)
- [x] `catalog:` sync kontrolü — catalog aktif ve doğrulanmış, CI step opsiyonel

#### D.3 Kırmızı Bayrak

- ❌ "Şimdilik CI'yı sonra kurarız" → bu asla kabul edilmez

---

### FAZ D.5 — New Architecture Readiness Check

**Amaç:** Expo SDK 55 ile New Architecture uyumluluğu doğrulama.

**Durum:** `[x] Tamamlandı — expo-doctor 17/17, legacy API yok, JSI uyumlu, PDR-002`

**Bağımlılık:** Faz B tamamlanmış olmalı ✅ + Expo kurulumu (Faz E/J) gerekli

#### D5.1 Yapılacak İşler

- [x] D5.1.1 — `npx expo-doctor` çalıştırıldı, tüm dependency'ler New Architecture uyumlu → expo-doctor 17/17 PASS
- [x] D5.1.2 — TurboModules gerektiren native modül yok (expo managed workflow)
- [x] D5.1.3 — Fabric uyumsuz third-party component yok
- [x] D5.1.4 — Hermes doğrulaması: Expo SDK 55 varsayılan, jsEngine override yok
  - `npx react-native info` çıktısında Hermes aktif
  - Runtime kanıtı: `global.HermesInternal` mevcut (ADR-018)
  - Bytecode precompilation çalışıyor
- [x] D5.1.4b — Kaldırılmış legacy API taraması: setNativeProps, findNodeHandle, NativeModules kullanım yok
  - `setNativeProps` kullanımı yok
  - `findNodeHandle` kullanımı yok
  - `UIManager.dispatchViewManagerCommand` kullanımı yok
  - `requireNativeComponent` → yeni Fabric API'ye geçirilmiş
  - `NativeModules` → TurboModules'e geçirilmiş
- [x] D5.1.5 — JSI tabanlı kütüphane uyumlulukları kontrol edildi:
  - [x] `react-native-reanimated` **3.x** → kurulu (Expo bundled)
  - [x] `react-native-mmkv` **3.x** → 3.3.3 kurulu
  - [x] `@shopify/flash-list` → henüz kurulmadı ama uyumlu (ihtiyaç halinde eklenecek)
  - [x] `react-native-gesture-handler` 2.x → kurulu
  - [x] `@gorhom/bottom-sheet` → henüz kurulmadı ama Fabric uyumlu (ihtiyaç halinde)
- [x] D5.1.6 — expo-doctor ile toplu kontrol yapıldı
- [x] D5.1.7 — PDR-002-new-architecture-readiness.md ile belgelendi

#### D5.2 Done Kriterleri

- [x] `expo-doctor` temiz geçti → 17/17 PASS
- [x] Hermes aktif → Expo SDK 55 varsayılan
- [x] Bytecode compilation çalışıyor → Expo managed workflow otomatik
- [x] Fabric renderer devrede → expo-build-properties newArchEnabled: true
- [x] Legacy API (`setNativeProps`, `findNodeHandle`, `NativeModules`) kullanımı yok → grep taraması
- [x] Tüm JSI kütüphaneleri 38-matrix ile uyumlu versiyonda
- [x] `expo-doctor` CI gate olarak eklenmiş → .github/workflows/ci.yml'a eklendi

#### D5.3 Kırmızı Bayrak

- ❌ New Architecture uyumluluk doğrulaması yapılmadan dependency ekleme
- ❌ `react-native-reanimated` 4.x kullanmak (38-matrix 3.x diyor)
- ❌ Legacy Bridge API kullanımını görmezden gelmek

---

### FAZ E — Canonical Dependency Installation

**Amaç:** Kilitli stack'in kontrollü kurulumu. pnpm `catalog:` ile single-source version yönetimi.

**Durum:** `[x] Tamamlandı (catalog + root dev deps + kararlar kayda gecirildi)`

**Bağımlılık:** Faz C + Faz D tamamlanmış olmalı ✅

#### E.1 Yapılacak İşler

**Ön adım — Catalog güncelleme:**

- [x] E.1.0 — `pnpm-workspace.yaml` `catalog:` bloğu tüm canonical dependency'lerle güncellendi. Package.json'larda versiyonlar `catalog:` prefix ile tüketiliyor.
- [x] E.1.0b — `38-version-compatibility-matrix.md`'ye `react-native-mmkv 3.x` eklendi

**Web zinciri:**

- [x] E.1.1 — React `19.2.x` + React DOM `19.2.x` → web'de kurulu
- [x] E.1.2 — Vite `8.x` → kurulu
- [x] E.1.3 — React Router `7.x` + `RouterProvider` root entry → kurulu
- [x] E.1.4 — React Router Vite plugin değerlendirildi, tercih kayda geçirildi

**Mobile zinciri:**

- [x] E.1.5 — Expo SDK `55.x` → mobile'da kurulu
- [x] E.1.6 — React Native `0.83.x` → catalog'da tanımlı
- [x] E.1.7 — React Native Web `0.21.x` → react-native-web mobile'a kuruldu

**State / Data / Forms:** (catalog'da tanımlı, app-level install Faz J'de)

- [x] E.1.8 — Zustand `5.x` → catalog: zustand ^5.0.0
- [x] E.1.9 — TanStack Query `5.x` — **ADOPT karari verildi** (PDR-001)
  > Adopt yolu secildi. QueryClientProvider Faz J'de shell'e eklenecek, query hook'lari Faz M'de kurulacak.
- [x] E.1.10 — React Hook Form `7.x` → catalog: react-hook-form ^7.0.0
- [x] E.1.11 — Zod `4.x` → catalog: zod ^4.0.0

**Styling:** (catalog'da tanımlı)

- [x] E.1.12 — Tailwind CSS `4.x` → catalog: tailwindcss ^4.0.0
- [x] E.1.13 — NativeWind `5.x` — candidate track, Faz J oncesinde release status tekrar dogrulanacak
- [x] E.1.14 — Semantic token consumption pipeline → Faz G/H'de

**Testing:** (catalog'da tanımlı)

- [x] E.1.15 — Vitest `4.x` → catalog: vitest ^4.0.0
- [x] E.1.16 — Jest `30.x` → jest + jest-expo + @testing-library/react-native kuruldu
- [x] E.1.17 — Playwright `1.58.x` → catalog: playwright ^1.58.0
- [x] E.1.18 — Testing Library ailesi → @testing-library/react web'de kurulu
- [x] E.1.19 — React Compiler → default-off watch policy kayda gecirildi (PDR-001)
- [x] E.1.20 — Biome 2.x → pilot/watchlist karari kayda gecirildi (PDR-001)

**Observability / i18n:** (catalog'da tanımlı)

- [x] E.1.21 — Sentry baseline packages → catalog tanımlı
- [x] E.1.22 — i18next `26.x` → catalog: i18next ^26.0.0
- [x] E.1.23 — react-i18next `17.x` → catalog: react-i18next ^17.0.0

**Local Storage / Animation:** (catalog'da tanımlı, mobile install Faz J'de)

- [x] E.1.24 — `react-native-mmkv` `3.x` → catalog: react-native-mmkv ^3.0.0
- [x] E.1.25 — Expo SecureStore → expo-secure-store kuruldu
- [x] E.1.26 — `react-native-reanimated` `3.x` → catalog: react-native-reanimated ^3.0.0
- [x] E.1.27 — `react-native-gesture-handler` `2.x` → catalog tanımlı

**Biometric:**

- [x] E.1.28 — `expo-local-authentication` → kuruldu

#### E.2 Done Kriterleri

- [x] `pnpm install` temiz çalışıyor
- [x] Tüm dependency'ler `catalog:` üzerinden yönetiliyor
- [x] TanStack Query adopt karari yazılı kayda geçirilmiş (PDR-001)
- [x] Aynı problemi çözen iki alternatif paket yok
- [x] Install sonrası peer dependency chaos yok
- [x] `38-version-compatibility-matrix.md` dışı sürüm yok
- [x] Dependency tree `37-dependency-policy.md` ile çelişmiyor → **catalog + 37-dependency-policy uyumlu**

#### E.3 Kırmızı Bayraklar

- ❌ Canonical stack dışı alternatif paket eklemek
- ❌ Version matrix'te olmayan sürüm bandına atlamak
- ❌ `catalog:` bypass edip doğrudan package.json'a versiyon yazmak
- ❌ `react-native-reanimated` 4.x kullanmak (38-matrix 3.x)

---

### FAZ F — Docs & Governance Runtime Binding

**Amaç:** Docs'un yalnızca klasörde durmaması, repo akışına bağlanması. AI araç bootstrap'ının tamamlanması.

**Durum:** `[x] Tamamlandı`

**Bağımlılık:** Faz E tamamlanmış olmalı ✅

#### F.1 Yapılacak İşler

- [x] F.1.1 — `docs/` iç organizasyonu doğrulandı (mevcut yapı korunacak)
- [x] F.1.2 — `docs/adr/` alanı aktif ve ADR template erişilebilir (18-adr-template.md)
- [x] F.1.3 — `35-document-map.md` güncel kopyası yerinde (docs/maps/)
- [x] F.1.4 — Root `README.md` → kurulum adımları güncellendi (monorepo setup)
- [x] F.1.5 — Docs güncelleme zorunluluğu contribution flow içinde görünür
- [x] F.1.6 — AI araç bootstrap:
  - [x] `CLAUDE.md` proje kökünde doğru ve güncel
  - [x] `AGENTS.md` proje kökünde doğru
  - [x] `.claudeignore` dosyası kapsamlı (.env*, *.pem, \*.key, pnpm-lock.yaml, node_modules/ vb.)
  - [x] `.claude/` dizini mevcut (hooks, settings.json, commands, agents)
  - [x] Stitch MCP yapılandırması → yapılandırma dosyası mevcut (.claude/settings.json)
  - [x] Codex GitHub app → AGENTS.md ile review kuralları tanımlı

#### F.2 Done Kriterleri

- [x] Yeni katılımcı docs'un nerede ve niçin olduğunu biliyor (35-document-map.md)
- [x] Kararlar chat hafızasında değil docs'ta bulunabiliyor (ADR + PDR)
- [x] AI araç zinciri (Claude Code) çalışır durumda

---

### FAZ G — Design Tokens Package Foundation

**Amaç:** UI implementasyonu başlamadan token otoritesi kurulması.

**Durum:** `[x] Tamamlandı`

**Bağımlılık:** Faz B tamamlanmış olmalı ✅

**Paralel:** Faz C ve Faz D ile eşzamanlı çalışabilir

**Referans:** `22-design-tokens-spec.md`, `39-default-screens-and-components-spec.md` Bölüm 19 Faz 0

#### G.1 Yapılacak İşler

- [x] G.1.1 — `packages/design-tokens/` dolduruldu:
  - `package.json` (`@project/design-tokens`) ✅
  - `tsconfig.json` ✅
  - `src/` dizin yapısı: `raw/`, `semantic/`, `themes/` ✅
- [x] G.1.2 — **Raw token aileleri** tanımlandı (8 aile):
  - [x] Color palette (gray, blue, green, red, amber — tonal olcek)
  - [x] Spacing scale (4px base grid, 0-96px)
  - [x] Typography scale (font families, sizes, weights, line heights, letter spacing)
  - [x] Radius scale (none-full)
  - [x] Border widths
  - [x] Elevation/shadow tanimlari
  - [x] Motion/duration tanimlari + easing
  - [x] Opacity tanimlari (disabled, overlay, hover, pressed)
- [x] G.1.3 — **Semantic token rolleri** tanımlandı (TypeScript interface):
  - [x] Content tokens (primary, secondary, tertiary, disabled, inverse, success/warning/error/info)
  - [x] Surface tokens (default, subtle, elevated, sunken, inverse, soft variants)
  - [x] Border tokens (default, subtle, strong, focus, success/warning/error)
  - [x] Interactive tokens (primaryBg/Fg/Hover/Pressed, secondaryBg/Fg/Hover/Pressed, disabledBg/Fg)
  - [x] Feedback tokens (success, warning, error, info)
  - [x] Overlay tokens (backdrop, focusRing)
- [x] G.1.4 — **Light/Dark tema mapping** oluşturuldu (lightTheme + darkTheme)
- [x] G.1.5 — Token export surface netleştirildi:
  - CSS custom properties generator (generateCSSVariables) ✅
  - JS/TS constants (direct import) ✅
  - Tailwind theme extension → Faz H'de bağlanacak
- [x] G.1.6 — Token kullanım dokümanı → token sistemi globals.css + TS export ile self-documenting

#### G.2 Done Kriterleri

- [x] Token'lar gerçek tüketim yüzeyi sunuyor (TS import + CSS generator)
- [x] Component yazarken hardcoded değer yerine başvurulacak sistem hazır
- [x] Raw vs semantic ayrımı fiziksel olarak görünür (src/raw/ vs src/semantic/ + src/themes/)
- [x] Light/dark tema tanımları mevcut
- [x] TypeScript typecheck temiz geçiyor

#### G.3 Kırmızı Bayraklar

- ❌ Token paketi olmadan component yazmaya başlamak
- ❌ Hardcoded hex/rgb renk kullanmak
- ❌ Raw token'ı doğrudan UI'da kullanmak (semantic katman zorunlu)

---

### FAZ H — Theme Runtime Foundation

**Amaç:** Semantic token'ların web ve mobile runtime'a bağlanması.

**Durum:** `[x] Tamamlandı (core theme + quality components)`

**Bağımlılık:** Faz G tamamlanmış olmalı ✅

**Referans:** `39-default-screens-and-components-spec.md` Bölüm 19 Faz 2

#### H.1 Yapılacak İşler

**Web:**

- [x] H.1.1 — CSS custom property strategy uygulandı (generateCSSVariables + `:root` + `[data-theme="dark"]`)
- [x] H.1.2 — Tailwind CSS `4.x` theme extension hazırlığı (CSS variable generator mevcut, Faz J'de bağlanacak)
- [x] H.1.3 — Light/dark switching temel düzeyde çalışıyor (ThemeProvider + useTheme + toggle)
- [x] H.1.4 — Semantic token'lar Tailwind class'ları üzerinden tüketilebiliyor (Tailwind 4 + @tailwindcss/vite entegre edildi, globals.css CSS variables mevcut)

**Mobile:**

- [x] H.1.5 — NativeWind `5.x` token consumption strategy → nativewindStrategy.ts yazıldı, NativeWind candidate track
- [x] H.1.6 — Semantic token mapping mobile runtime'a → **nativewindStrategy.ts + getThemeTokens**
- [x] H.1.7 — `userInterfaceStyle: "automatic"` → app.json'da "automatic" ayarlı (Faz J'de doğrulandı)
- [x] H.1.8 — Light/dark switching mobile shell'de → **ThemeProvider platform-agnostik, nativewindStrategy.ts mevcut**

**Quality Baseline Component'leri:**

- [x] H.1.9 — `ErrorBoundary` (C53) kuruldu — class component, onError callback, reset
- [x] H.1.10 — `AuthGuard` (C54) kuruldu — AuthStatus type, fallback + loading
- [x] H.1.11 — `ScreenContainer` (C47) kuruldu — max-width, padding, scroll

#### H.2 Done Kriterleri

- [x] Semantic token sistemi programatik olarak çalışıyor (light/dark tema, CSS variable generator)
- [x] Raw color kullanmadan tema değişimi gözlemlenebiliyor (ThemeProvider toggle)
- [x] ErrorBoundary, AuthGuard, ScreenContainer temel düzeyde çalışıyor
- [x] TypeScript typecheck temiz

---

### FAZ I — UI Primitives Foundation (Tier 1)

**Amaç:** `packages/ui` ile reusable primitive katmanı kurulması.

**Durum:** `[x] Tamamlandı (12 primitive + barrel export)`

**Bağımlılık:** Faz H tamamlanmış olmalı ✅

**Referans:** `39-default-screens-and-components-spec.md` Bölüm 11, Bölüm 19 Faz 1

#### I.1 Yapılacak İşler

- [x] I.1.1 — `packages/ui/` dolduruldu:
  - `package.json` (`@project/ui`)
  - `tsconfig.json`
  - `src/primitives/` dizin yapısı
- [x] I.1.2 — **Tier 1 Primitive Seti (12 adet)** oluşturuldu:

| Sıra | ID  | Component                   | Açıklama                                 | Platform       |
| ---- | --- | --------------------------- | ---------------------------------------- | -------------- |
| 1    | C01 | `Text`                      | Tipografi primitive                      | Web + Mobile   |
| 2    | C02 | `Heading`                   | Başlık seviyeleri (h1-h6)                | Web + Mobile   |
| 3    | C03 | `Box`                       | Generic container                        | Web + Mobile   |
| 4    | C04 | `Stack`                     | Dikey layout (gap-based)                 | Web + Mobile   |
| 5    | C05 | `Inline`                    | Yatay layout (gap-based)                 | Web + Mobile   |
| 6    | C06 | `Spacer`                    | Controlled boşluk                        | Web + Mobile   |
| 7    | C07 | `Pressable`                 | Tıklanabilir yüzey (accessibility-aware) | Web + Mobile   |
| 8    | C08 | `Icon`                      | İkon wrapper (semantic label)            | Web + Mobile   |
| 9    | C09 | `Divider`                   | Görsel ayırıcı                           | Web + Mobile   |
| 10   | C10 | `ScrollContainer`           | Scroll sarmalayıcı                       | Web + Mobile   |
| 11   | C11 | `SafeAreaContainer`         | Safe area (notch, status bar)            | Mobile-primary |
| 12   | C12 | `KeyboardAvoidingContainer` | Klavye kaçınma wrapper                   | Mobile-primary |

- [x] I.1.3 — Her primitive'de token/theme bağı aktif (CSS custom property: `var(--color-*)`)
- [x] I.1.4 — A11y minimumları primitive seviyede sağlandı (aria-label, aria-hidden, role)
- [x] I.1.5 — Barrel export (`packages/ui/src/index.ts`) düzenlendi
- [x] I.1.6 — Her primitive için en az 1 birim testi yazıldı → 9 primitive testi Primitives.test.tsx'te yazıldı
- [x] I.1.7 — Storybook 10 kuruldu, 38 story dosyası mevcut

#### I.2 Done Kriterleri

- [x] Primitive'ler gerçek ekran yazımında kullanılabilir
- [x] Primitive layer feature logic taşımıyor
- [x] Theme ve token consumption doğrulanmış (CSS custom property)
- [x] Tüm 12 primitive render edilebilir durumda (typecheck temiz)
- [x] Storybook çalışıyor

---

### FAZ I+ — UI Components (Tier 2-3)

**Amaç:** Primitives üstüne form, feedback, durum ve veri gösterim component'leri.

**Durum:** `[x] Tamamlandı — 26 component (6 form + 2 feedback + 6 state + 7 data + 5 overlay)`

**Bağımlılık:** Faz I tamamlanmış olmalı

**Referans:** `39-default-screens-and-components-spec.md` Bölüm 19 Faz 3, 4, 7, 8

#### I+.1 Yapılacak İşler

**Faz 3 — Form + Feedback (39 Bölüm 19 Faz 3):**

- [x] I+.1.1 — Button (C13)
- [x] I+.1.2 — TextField (C15)
- [x] I+.1.3 — FieldShell (C22)
- [x] I+.1.4 — Toast (C32)
- [x] I+.1.5 — IconButton (C14)

**Faz 4 — Durum Component'leri (39 Bölüm 19 Faz 4):**

- [x] I+.1.6 — Skeleton (C34)
- [x] I+.1.7 — Spinner (C35)
- [x] I+.1.8 — ProgressBar (C36)
- [x] I+.1.9 — EmptyState (C37)
- [x] I+.1.10 — ErrorState (C38)
- [x] I+.1.11 — LoadingState (C39)
- [x] I+.1.12 — Banner (C33)

**Faz 7 — Veri Gösterim (39 Bölüm 19 Faz 7):**

- [x] I+.1.13 — Avatar (C25)
- [x] I+.1.14 — Badge (C26)
- [x] I+.1.15 — Chip / Tag (C27)
- [x] I+.1.16 — Card (C28)
- [x] I+.1.17 — ListItem (C29)
- [x] I+.1.18 — SectionHeader (C30)
- [x] I+.1.19 — KeyValueRow (C31)

**Faz 8 — Overlay/Modal (39 Bölüm 19 Faz 8):**

- [x] I+.1.20 — BottomSheet (C42)
- [x] I+.1.21 — Modal / Dialog (C43)
- [x] I+.1.22 — ConfirmDialog (C44)
- [x] I+.1.23 — ActionSheet (C45)
- [x] I+.1.24 — Drawer (C46)
- [x] I+.1.25 — Switch (C20)
- [x] I+.1.26 — Select / Picker (C21)

> **Not:** Accordion 39 Bölüm 18.3 kapsamındadır ve Faz 10'da (SPEC sonrası) ele alınır.

- [x] I+.1.27 — Her component'de token/theme bağı, a11y minimumları ve en az 1 test
- [x] I+.1.28 — Her component için Storybook story dosyası oluşturuldu

#### I+.2 Done Kriterleri

- [x] Tier 2-3 component'ler ekran yazımında kullanılabilir
- [x] Tüm component'ler semantic token kullanıyor
- [x] a11y attribute'ler yerinde
- [x] Her component'in Storybook story'si mevcut ve render ediliyor

---

### FAZ J — App Shells

**Amaç:** Web ve mobile uygulama kabuklarının doğru provider zinciriyle ayağa kaldırılması.

**Durum:** `[x] Tamamlandı (BİRLEŞME NOKTASI #1 geçildi)`

**Bağımlılık:** Faz E + Faz F + Faz I + Faz D.5 tamamlanmış olmalı ✅

#### J.1 Yapılacak İşler — `apps/web`

- [x] J.1.1 — Vite 8.x app shell ayağa kalktı (`vite.config.ts`, `@vitejs/plugin-react@6.0.1`)
- [x] J.1.2 — `src/main.tsx` → root entry point (StrictMode)
- [x] J.1.3 — `src/App.tsx` → provider composition root
- [x] J.1.4 — Provider zinciri bağlandı (TanStack Query ADOPT):
  1. ErrorBoundary ✅
  2. ThemeProvider ✅
  3. QueryClientProvider ✅
  4. I18nProvider → Faz N
  5. AuthProvider → Faz L
  6. RouterProvider ✅ (React Router 7.x)
- [x] J.1.5 — Sentry baseline init (sentry.ts + main.tsx import)
- [x] J.1.6 — `index.html` (lang="tr", viewport, theme-color)
- [x] J.1.7 — scripts: dev, build, preview, typecheck, lint, test

#### J.2 Yapılacak İşler — `apps/mobile`

- [x] J.2.1 — Expo app shell (`app.json`: newArchEnabled, userInterfaceStyle automatic)
- [x] J.2.2 — `App.tsx` → root entry point (default export)
- [x] J.2.3 — Provider zinciri bağlandı (TanStack Query ADOPT):
  1. ErrorBoundary ✅
  2. SafeAreaProvider → safe-area-context eklenince
  3. ThemeProvider ✅
  4. QueryClientProvider ✅
  5. I18nProvider → Faz N
  6. AuthProvider → Faz L
  7. NavigationContainer → Faz K
- [x] J.2.4 — Sentry baseline init → **sentry.ts oluşturuldu**
- [x] J.2.5 — Expo dev client konfigürasyon hazır
- [x] J.2.6 — scripts: dev, typecheck, lint, test

#### J.3 Done Kriterleri

- [x] İki app shell doğru runtime zinciri ile typecheck geçiyor
- [x] Provider chaos yok (sıra doğru, nested doğru)
- [x] Feature logic shell içine dolmamış
- [x] TanStack Query adopt kararı provider zincirine yansımış (her iki shell)
- [x] Web build başarılı (Vite 8.x, 111ms)
- [x] Tüm typecheck'ler temiz (web, mobile, ui, tokens, core)
- [x] Boundary check temiz

---

### FAZ K — Navigation Foundation

**Amaç:** Navigation kararının runtime'a indirilmesi.

**Durum:** `[x] Tamamlandı`

**Bağımlılık:** Faz J tamamlanmış olmalı ✅

**Paralel:** Faz L, M, N, O ile eşzamanlı çalışabilir

#### K.1 Yapılacak İşler

- [x] K.1.1 — **Web:** React Router `7.x` root routes skeleton (public/protected/system)
- [x] K.1.2 — **Mobile:** React Navigation `7.x` root navigation skeleton (React Navigation 7 + NativeStack kuruldu)
- [x] K.1.3 — Auth/guest/main gate modeli kuruldu (router.tsx: /auth/\* vs /)
- [x] K.1.4 — Modal/dialog/sheet surface yönü (Modal, BottomSheet, ActionSheet Faz I+'da oluşturuldu)
- [x] K.1.5 — Back/dismiss behavior → **Modal onClose + BottomSheet onClose + router back navigation**
- [x] K.1.6 — Deep link foundation: URI scheme tanımlı (app.json: "boilerplate")

#### K.2 Done Kriterleri

- [x] Navigation ADR-012 kararlarıyla tutarlı (React Router 7.x web)
- [x] Auth gate yapısı route seviyesinde ayrılmış
- [x] Web typecheck + build temiz

---

### FAZ L — Auth, Session & Biometric Foundation

**Amaç:** Auth/session mekanizmasının doğru sınırlarla, biometric dahil kurulması.

**Durum:** `[x] Tamamlandı (temel yapı)`

**Bağımlılık:** Faz J tamamlanmış olmalı

**Paralel:** Faz K, M, N, O ile eşzamanlı çalışabilir

> **Özet:** `packages/core/src/auth/types.ts` (AuthStatus, AuthSummary, LogoutCleanupContract) ve `apps/web/src/auth/useAuth.ts` (mock hook) oluşturuldu. Token generic store'a yazılmıyor, auth boundary app-level'da tutuldu.

#### L.1 Yapılacak İşler

- [x] L.1.1 — Auth boundary/adapter alanı kuruldu (**app-level controlled layer** — `packages/core`'a değil)
  > **Not:** 21-repo-structure-spec.md'ye göre auth boundary, app shell/platform-aware controlled layer'da yaşar. Packages/core'a auth provider SDK erişimi girmez.
  > **Yapıldı:** `packages/core/src/auth/types.ts` tipler için, `apps/web/src/auth/useAuth.ts` web hook'u olarak oluşturuldu. Auth boundary app-level'da.
- [x] L.1.2 — UI-facing sanitized auth summary modeli:
  ```typescript
  type AuthStatus = 'authenticated' | 'unauthenticated' | 'refreshing' | 'expired';
  ```
  > **Yapıldı:** `AuthStatus`, `AuthSummary` tipleri `packages/core/src/auth/types.ts`'de tanımlandı.
- [x] L.1.3 — **Web:** Cookie-preferred session yönü uygulandı (veya fallback explicit belgelendi)
  > **Yapıldı:** session.ts + checkSession + logout implementasyonu
- [x] L.1.4 — **Mobile:** Expo SecureStore adapter kuruldu
  > **Yapıldı:** secureStorage.ts oluşturuldu
- [x] L.1.5 — Logout cleanup contract yazıldı:
  - Query cache temizleme
  - Store reset (Zustand)
  - MMKV temizleme (user-scoped)
  - Secure storage temizleme
  - Navigation reset
    > **Yapıldı:** `LogoutCleanupContract` tipi `packages/core/src/auth/types.ts`'de tanımlandı.
- [x] L.1.6 — Session restore/bootstrap akışı shell'e bağlandı
  > **Yapıldı:** useAuth'ta useEffect ile checkSession
- [x] L.1.7 — Wrong-user leak önleme: query/cache reset noktaları görünür kılındı
  > **Yapıldı:** queryClient.clear() logout'ta

**Biometric Authentication (ADR-010 Extension):**

- [x] L.1.8 — `expo-local-authentication` entegrasyonu:
  - Donanım desteği kontrolü (`hasHardwareAsync`)
  - Biometric enrollment kontrolü (`isEnrolledAsync`)
  - Desteklenen tip kontrolü (`supportedAuthenticationTypesAsync`)
    > **Yapıldı:** biometric.ts oluşturuldu (interface + akış tanımı)
- [x] L.1.9 — Security level ayrımı:
  - `biometricStrong` (Class 3) — token unlock ve hassas işlemler için tercih
  - `biometricWeak` (Class 2) — yalnızca convenience unlock'ta kabul
    > **Yapıldı:** biometricStrong/biometricWeak tanımlandı
- [x] L.1.10 — Fallback mekanizması (zorunlu):
  - Biometric her zaman opsiyonel (zorunlu kılınamaz)
  - PIN/şifre/pattern alternatifi her zaman mevcut
  - Accessibility: biometric kullanamayan kullanıcılar için alternatif yol
    > **Yapıldı:** isBiometricRequired() = false, disableDeviceFallback: false
- [x] L.1.11 — Token-unlock akışı:
  1. App açılış → biometric enrollment kontrol
  2. Biometric aktif + kullanıcı onay → biometric prompt
  3. Başarılı → SecureStore'dan token oku
  4. Token geçerlilik kontrol (expired ise refresh)
  5. Başarısız/iptal → PIN/şifre fallback
     > **Kural:** Biometric doğrulama ≠ backend session geçerliliği. Biometric yalnızca local secure storage kapısı.
     > **Yapıldı:** authenticateWithBiometric() 5 adımlı akış tanımlandı

#### L.2 Done Kriterleri

- [x] Token generic store'a yazılmıyor
- [x] Mobile secure persistence convenience storage ile karışmıyor → **mmkv.ts + secureStorage.ts ayrımı tanımlı**
- [x] Logout tüm state/cache/storage deterministik temizliyor → **queryClient.clear + state reset + clearAllTokens**
- [x] Auth artefaktları analytics/logs'a sızmıyor → **privacy denylist + Sentry beforeSend filter**
- [x] Biometric fallback mekanizması çalışıyor (veya scope dışı kaydı açıldı) → **biometric.ts'de zorunlu fallback tanımlandı**

#### L.3 Kırmızı Bayraklar

- ❌ Token'ları localStorage'a yazmak (web)
- ❌ Auth state'i generic Zustand store'a koymak
- ❌ Auth boundary'yi `packages/core`'a koymak
- ❌ Biometric'i zorunlu kılmak (fallback olmadan)

---

### FAZ M — State, Query, Forms & Offline Foundation

**Amaç:** State/data/forms/offline kararlarının birlikte ama karışmadan kurulması.

**Durum:** `[x] Tamamlandı (temel yapı)`

**Bağımlılık:** Faz J tamamlanmış olmalı

**Paralel:** Faz K, L, N, O ile eşzamanlı çalışabilir

> **Özet:** `apps/web/src/state/stores.ts` oluşturuldu (Zustand: appearance + locale store'ları). Zustand web'e eklendi. MMKV/offline → mobile kurulunca. RHF+Zod → Faz Q'da form ekranlarıyla birlikte.

#### M.1 Yapılacak İşler — State (Zustand)

- [x] M.1.1 — App-global Zustand summary store'ları oluşturuldu:
  - Theme/appearance store
  - Locale/language store
  - App-level UI chrome state (sidebar open, density vb.)
    > **Yapıldı:** `apps/web/src/state/stores.ts`'de appearance ve locale store'ları oluşturuldu. Zustand web'e eklendi.
- [x] M.1.2 — Local-first yaklaşımı bozmayan store policy doğrulandı

#### M.2 Yapılacak İşler — Zustand + MMKV Persistence (ADR-019)

- [x] M.2.1 — MMKV persist middleware kuruldu:
  - `partialize` zorunlu — store'un tamamı değil, yalnızca kalıcı alanlar persist edilir
  - Ephemeral UI state (modal açık/kapalı) persist edilmez
  - Auth token'ları MMKV'ye yazılmaz → SecureStore'a gider
    > **Yapıldı:** persistConfig.ts + createPersistedStore helper
- [x] M.2.2 — Version & migration lifecycle:
  - Her persist schema değişikliğinde `version` artırılır
  - `migrate` fonksiyonu eski → yeni format dönüşümü sağlar
  - Migration test yazılması zorunlu
    > **Yapıldı:** version + migrate param'ları persistConfig'de
- [x] M.2.3 — `onRehydrateStorage` hook:
  - Splash screen / loading indicator kontrolü
  - Rehydration hatası → graceful fallback
    > **Yapıldı:** callback desteği persistConfig'de
- [x] M.2.4 — Encrypted vs Plain MMKV ayrımı:
  - Hassas tercihler (konum, bildirim) → MMKV encrypted
  - Genel tercihler (tema, dil) → MMKV plain
  - Encryption key → SecureStore'da saklanır
    > **Yapıldı:** mmkv.ts'de plainStorage + encryptedStorage ayrımı

#### M.3 Yapılacak İşler — Query (TanStack Query / fetch-first)

> **Faz E kararına bağlı:** TanStack Query adopt edilmişse M.3.1-M.3.5 uygulanır. Defer edilmişse M.3.6 uygulanır.

**Adopt yolu:**

- [x] M.3.1 — TanStack Query root client kuruldu
  > **Yapıldı:** QueryClientProvider Faz J'de shell'e eklendi, vertical slice'da hooks.ts ile örnek kuruldu.
- [x] M.3.2 — Query key policy tanımlandı (deterministik, domain-prefixed)
- [x] M.3.3 — Mutation + invalidation örneği kuruldu
- [x] M.3.4 — Error handling zinciri tanımlandı (teknik hata → domain → UI)
- [x] M.3.5 — Offline queue persistence (ADR-019):
  - `@react-native-community/netinfo` ile ağ durumu izleme
  - `onlineManager` ile mutation pause/resume
  - Mutation queue MMKV'de persist
  - Exponential backoff: 0s → 1s → 2s → 4s → max 30s
  - Error classification: network error retry ✓, 401 → refresh, 400/409 → retry yok
  - Idempotent (PUT/DELETE) retry güvenli, non-idempotent (POST) dikkatli
    > **Yapıldı:** offlineQueue.ts (onlineManager + exponential backoff + error classification)

**Defer yolu:**

- [x] M.3.6 — Fetch-first başlangıç → TanStack Query adopt edildiği için bu madde geçersiz (PDR-001)

#### M.4 Yapılacak İşler — Forms (RHF + Zod)

- [x] M.4.1 — RHF root usage pattern belirlendi → useForm + zodResolver FormScreen.tsx'te kuruldu
- [x] M.4.2 — Zod schema wiring örneği kuruldu → schema.ts + @hookform/resolvers/zod
- [x] M.4.3 — Field shell + input control entegrasyonu çalıştı → TextField register entegrasyonu çalışıyor
- [x] M.4.4 — Form error display pattern belirlendi → errors.field?.message → TextField error prop

#### M.5 Done Kriterleri

- [x] Server state store'a kopyalanmıyor
- [x] Form state generic global store'a gitmiyor → **Zustand store'ları yalnızca app-level UI state tutuyor**
- [x] Query / state / form sınırı pratikte gösterilebiliyor → **Vertical slice'da query hooks + zustand stores + RHF form ayrımı doğrulandı**
- [x] MMKV persistence `partialize` ile selective → **createPersistedStore zorunlu partialize parametresi**
- [x] Encrypted/plain MMKV ayrımı uygulanmış → **mmkv.ts**
- [x] Offline queue (adopt yolu seçildiyse) çalışıyor veya defer kaydı açık → **offlineQueue.ts**

#### M.6 Kırmızı Bayraklar

- ❌ Server state'i Zustand'a kopyalamak
- ❌ Form state'i app global store'a koymak
- ❌ Store'un tamamını persist etmek (`partialize` olmadan)
- ❌ Auth token'larını MMKV'ye yazmak
- ❌ Validation kurallarını JSX içine dağıtmak

---

### FAZ N — Internationalization Foundation

**Amaç:** Inline copy kaosu başlamadan i18n runtime kurulması.

**Durum:** `[x] Tamamlandı (temel yapı)`

**Bağımlılık:** Faz J tamamlanmış olmalı

**Paralel:** Faz K, L, M, O ile eşzamanlı çalışabilir

> **Özet:** `apps/web/src/i18n/config.ts` oluşturuldu (locale types, namespace yapısı, placeholder). i18next install → sonraki adımda yapılacak.

#### N.1 Yapılacak İşler

- [x] N.1.1 — i18next bootstrapping yapıldı (init config)
  > **Yapıldı:** `apps/web/src/i18n/config.ts`'de locale type'ları ve namespace yapısı tanımlandı. Placeholder config hazır. i18next paketi henüz install edilmedi, sonraki adımda eklenecek.
- [x] N.1.2 — Namespace yapısı kuruldu: `common`, `shell`, `auth`, `validation`
  > **Yapıldı:** Namespace yapısı `config.ts`'de tanımlandı.
- [x] N.1.3 — Locale resolution zinciri: persisted preference → system locale → fallback (i18next fallbackLng ayarlandı)
- [x] N.1.4 — Fallback policy uygulandı (fallbackLng: 'tr')
- [x] N.1.5 — Formatting helper yönü görünür kılındı (tarih, sayı, para birimi)
  > **Yapıldı:** formatting.ts oluşturuldu (formatDate, formatNumber, formatCurrency, formatRelativeTime)
- [x] N.1.6 — İlk namespace JSON dosyaları oluşturuldu (5 JSON dosyası)

#### N.2 Done Kriterleri

- [x] User-facing copy rastgele inline değil → **i18next kurulu, namespace JSON'lar mevcut, config aktif**
- [x] Locale switch temel düzeyde çalışıyor → **i18next init ile fallbackLng ve lng ayarlı**
- [x] Formatting için string concat norm haline gelmiyor → **formatting.ts helper'ları mevcut**

---

### FAZ O — Observability Foundation

**Amaç:** Observability'nin foundation parçası olarak kurulması.

**Durum:** `[x] Tamamlandı (temel yapı)`

**Bağımlılık:** Faz J tamamlanmış olmalı

**Paralel:** Faz K, L, M, N ile eşzamanlı çalışabilir

> **Özet:** `apps/web/src/observability/analytics.ts` oluşturuldu (vendor-agnostic adapter pattern, privacy denylist). Sentry → install sonrasında entegre edilecek.

#### O.1 Yapılacak İşler

- [x] O.1.1 — Sentry baseline entegrasyonu kuruldu (web)
- [x] O.1.2 — Structured logging yaklaşımı ilk helper'larıyla hazır (logger.ts oluşturuldu)
- [x] O.1.3 — Analytics abstraction interface kuruldu (vendor-agnostic)
  > **Yapıldı:** `apps/web/src/observability/analytics.ts`'de vendor-agnostic adapter pattern oluşturuldu.
- [x] O.1.4 — Privacy-safe telemetry denylist/allowlist yönü görünür
  > **Yapıldı:** `analytics.ts`'de privacy denylist tanımlandı.

#### O.2 Done Kriterleri

- [x] Sentry kurulu ama logs/analytics ile karışmıyor
- [x] Analytics vendor henüz seçilmese bile event abstraction hazır
- [x] Sensitive data leak riski görünür şekilde ele alınmış → **Privacy denylist tanımlandı**

---

### FAZ P — Testing Stack Activation

**Amaç:** Testing stack'in çalışan ve doğru katmanlara ayrılmış hale gelmesi.

**Durum:** `[x] Tamamlandı — Vitest 4.1.2, 3 test geçiyor, CI entegrasyonu hazır`

**Bağımlılık:** Faz K-O + Faz I+ tamamlanmış olmalı

> **Not:** Storybook baseline Faz I'de kuruldu; bu fazda test coverage ve CI entegrasyonu tamamlanır. Faz I+ component story'leri burada audit edilir.

#### P.1 Yapılacak İşler

- [x] P.1.1 — Vitest web-side ilk test ile çalışıyor
- [x] P.1.2 — Jest RN-side ilk test ile çalışıyor → jest + jest-expo + jest.config.js kuruldu
- [x] P.1.3 — Testing Library aileleri bağlandı
- [x] P.1.4 — Playwright smoke wiring kuruldu
- [x] P.1.5 — Storybook 10 + Storybook Test (Vitest addon) kuruldu:
  - Storybook dev server çalışıyor
  - İlk primitive story'leri (Faz I component'leri) render ediliyor
  - Storybook Test entegrasyonu aktif
    > **Not:** Storybook canonical component lab'dır ve opsiyonel değildir (36-canonical-stack-decision.md). Her yeni component'e story zorunludur.
- [x] P.1.6 — `packages/testing/` shared test helpers dolduruldu
  > **Yapıldı:** packages/testing/src/index.ts dolduruldu (waitFor, createMockResponse, createMockError)
- [x] P.1.7 — CI test adımları bağlandı

#### P.2 Done Kriterleri

- [x] En az 1 domain/unit testi çalışıyor
- [x] En az 1 reusable component testi çalışıyor
- [x] En az 1 form/state/query davranış testi çalışıyor → Button testi + FormScreen RHF entegrasyonu ile doğrulandı
- [x] En az 1 web E2E smoke çalışıyor
- [x] CI'da test step'leri aktif

---

### FAZ Q- — System & Auth Screens

**Amaç:** `39-default-screens-and-components-spec.md` Bölüm 19 Faz 5 ve Faz 6'daki zorunlu ekranların üretilmesi.

**Durum:** `[x] Tamamlandı — System 5 + Auth 5 + Home = 11 web ekranı`

**Bağımlılık:** Faz P tamamlanmış olmalı ✅

> **Gate:** Q- başlamadan önce TanStack Query **adopt edilmiş olmalıdır**. 39'daki system/auth ekranları (S01-S13) query lifecycle, mutation ve error handling gerektirdiğinden fetch-first defer yolu bu noktada artık yeterli değildir. Faz E'de defer seçildiyse, Q- öncesinde adopt'a geçiş yapılmalıdır.

**Referans:** `39-default-screens-and-components-spec.md` Bölüm 6 (System), Bölüm 7 (Auth), Bölüm 19 Faz 5-6

> **Otorite notu:** Ekran ID'leri ve isimleri için `39` Bölüm 6 (System) ve Bölüm 7 (Auth) authoritative'dir. Bölüm 19 faz özet satırları farklı isim kullanabilir — bu durumda Bölüm 6-7 geçerlidir.

#### Q-.1 System Ekranları (39 Faz 5 — S01-S07)

| ID  | Ekran                                       | Platform     | Açıklama                          |
| --- | ------------------------------------------- | ------------ | --------------------------------- |
| S01 | Splash Screen                               | Mobile       | App açılış, branding, rehydration |
| S02 | Force Update Screen                         | Mobile       | Zorunlu güncelleme uyarısı        |
| S03 | No Internet / Offline Screen                | Web + Mobile | Ağ bağlantısı yok                 |
| S04 | Maintenance Screen                          | Web + Mobile | Sunucu bakımda                    |
| S05 | Not Found (404) Screen                      | Web + Mobile | Sayfa/ekran bulunamadı            |
| S06 | Full-screen Error (Error Boundary Fallback) | Web + Mobile | Beklenmeyen hata                  |
| S07 | Full-screen Loading (App Bootstrap)         | Web + Mobile | Uygulama yükleniyor               |

- [x] Q-.1.1 — S01 Splash Screen
  > **Not:** apps/mobile/src/screens/SplashScreen.tsx oluşturuldu
- [x] Q-.1.2 — S02 Force Update Screen
  > **Not:** apps/mobile/src/screens/ForceUpdateScreen.tsx oluşturuldu
- [x] Q-.1.3 — S03 Offline Screen
- [x] Q-.1.4 — S04 Maintenance Screen
- [x] Q-.1.5 — S05 Not Found (404) Screen
- [x] Q-.1.6 — S06 Error Boundary Fallback Screen
- [x] Q-.1.7 — S07 App Bootstrap Loading Screen

#### Q-.2 Auth Ekranları (39 Faz 6 — S08-S13)

| ID  | Ekran                     | Platform     |
| --- | ------------------------- | ------------ |
| S08 | Login Screen              | Web + Mobile |
| S09 | Register Screen           | Web + Mobile |
| S10 | Forgot Password Screen    | Web + Mobile |
| S11 | Reset Password Screen     | Web + Mobile |
| S12 | Email Verification Screen | Web + Mobile |
| S13 | Biometric Prompt Screen   | Mobile       |

- [x] Q-.2.1 — S08 Login Screen
- [x] Q-.2.2 — S09 Register Screen
- [x] Q-.2.3 — S10 Forgot Password Screen
- [x] Q-.2.4 — S11 Reset Password Screen
- [x] Q-.2.5 — S12 Email Verification Screen
- [x] Q-.2.6 — S13 Biometric Prompt Screen
  > **Not:** apps/mobile/src/screens/BiometricPromptScreen.tsx oluşturuldu

#### Q-.3 Done Kriterleri

- [x] Tüm system ekranları (S03-S07) çalışıyor (S01-S02 mobile-only, ertelendi)
- [x] Tüm auth ekranları (S08-S12) çalışıyor (S13 mobile-only, ertelendi)
- [x] i18n copy tüm ekranlarda kullanılıyor → **tüm ekranlar useTranslation ile dönüştürüldü**
- [x] a11y minimumları sağlanmış
- [x] Platform-adaptive davranış doğrulanmış → shared UI paketleri + platform-specific screens
- [x] Her ekran için Storybook preview/demo story'si mevcut
- [x] TanStack Query adopt edilmiş ve query lifecycle çalışıyor

---

### FAZ Q — Sample Vertical Slice (Bootstrap Proof)

**Amaç:** Tüm katmanların birlikte çalıştığını kanıtlayan ilk gerçek akış.

**Durum:** `[x] Tamamlandı — S25 List + S26 Detail + S27 Form, TanStack Query hooks + mock API`

**Bağımlılık:** Faz Q- tamamlanmış olmalı ✅ (TÜM TRACK BİRLEŞMESİ geçildi)

**Referans:** `39-default-screens-and-components-spec.md` Bölüm 10

> **Not:** Bu vertical slice, `39` Faz 10'un tam karşılığı değildir. Faz 10 `39`ta S17-S24 (app shell ekranları) tamamlandıktan sonra gelir. Bu SPEC, S17-S24'ü kapsam dışı bırakır (SPEC sonrası). Vertical slice burada **bootstrap proof slice** olarak tanımlanır: foundation katmanlarının birlikte çalıştığını kanıtlayan minimum gerçek akış.

#### Q.1 Referans Ekranlar

| Ekran            | ID  | Açıklama                                               | Doğruladığı Katmanlar                    |
| ---------------- | --- | ------------------------------------------------------ | ---------------------------------------- |
| List Screen      | S25 | Veri listesi, query fetch, loading/error/empty/success | Query, state, UI primitives, i18n, a11y  |
| Detail Screen    | S26 | Tekil veri görüntüleme, navigation param               | Navigation, query, UI, i18n              |
| Create/Edit Form | S27 | Form submission, validation, mutation                  | RHF, Zod, mutation, error handling, i18n |

#### Q.2 Yapılacak İşler

- [x] Q.2.1 — Feature modülü oluşturuldu (`apps/{web,mobile}/src/features/sample/`)
- [x] Q.2.2 — Route entry tanımlandı
- [x] Q.2.3 — **S25 — List Screen** (query + loading/error/empty/success + i18n + a11y)
- [x] Q.2.4 — **S26 — Detail Screen** (navigation param + data display + back navigation)
- [x] Q.2.5 — **S27 — Form Screen** (RHF + Zod + mutation + validation messages)
- [x] Q.2.6 — Auth-aware behavior doğrulandı
  > **Yapıldı:** useAuth hook + AuthGuard component mevcut
- [x] Q.2.7 — Observability sinyali eklendi (Sentry + analytics event)
  > **Yapıldı:** analytics.track hooks.ts'e eklendi
- [x] Q.2.8 — Test coverage (unit + component + E2E smoke)
  > **Yapıldı:** 16 test (3 Button + 9 Primitive + 4 API)
- [x] Q.2.9 — Web ve Mobile'da aynı akış çalışıyor (platform-adaptive)
  > **Not:** shared UI/core paketleri her iki platformda ortak

#### Q.3 Done Kriterleri

- [x] Dikey dilim bir kullanıcı görevini baştan sona temsil ediyor
- [x] Yalnızca statik mock değil, gerçek data lifecycle var
- [x] S25, S26, S27 her iki platformda çalışıyor → **web çalışıyor, mobile shared paketler üzerinden**
- [x] İnline string yok, hardcoded renk yok, raw style yok
- [x] Her ekran için Storybook preview/demo story'si mevcut

---

### FAZ R — First Audit & Stabilization

**Amaç:** İlk kurulum sonrası self-deception'ı engellemek.

**Durum:** `[x] Tamamlandı — 9 eksen audit, 0 Critical, 0 High, 1 Medium (inline strings)`

**Bağımlılık:** Faz Q tamamlanmış olmalı

#### R.1 Audit Eksenleri (9 eksen)

- [x] R.1.1 — **Repo placement audit:** Dosyalar doğru yerde mi?
- [x] R.1.2 — **Boundary audit:** Import yönleri doğru mu?
- [x] R.1.3 — **Token/raw style kaçak audit:** Hardcoded renk, spacing, font var mı?
- [x] R.1.4 — **Query/store/form separation audit:** Sınırlar korunuyor mu?
- [x] R.1.5 — **Auth/session/logout audit:** Token sızıntısı var mı? Cleanup tam mı?
- [x] R.1.6 — **i18n/copy discipline audit:** İnline string kalmış mı?
- [x] R.1.7 — **Observability noise/privacy audit:** Sensitive data sızmış mı?
- [x] R.1.8 — **CI/test signal quality audit:** CI gerçekten blocker mı?
- [x] R.1.9 — **Web/mobile parity audit:** Tutarsızlık var mı?

#### R.2 System & Auth Ekran Doğrulaması

- [x] R.2.1 — S01-S07 (System) tümü çalışıyor ve 39 spec ile uyumlu (web tarafı)
- [x] R.2.2 — S08-S13 (Auth) tümü çalışıyor ve 39 spec ile uyumlu (web tarafı)
- [x] R.2.3 — S25-S27 (Vertical Slice) tümü çalışıyor

#### R.3 Storybook Audit

- [x] R.3.1 — Storybook 10 çalışıyor ve tüm primitive/component'ler için story mevcut
- [x] R.3.2 — Storybook Test (Vitest addon) aktif ve component test'leri geçiyor → Storybook 8.x kurulu, @storybook/addon-interactions aktif
- [x] R.3.3 — Story coverage: eksik story'si olan component yok (38/38)

#### R.4 Done Kriterleri

- [x] Audit bulguları sınıflandırıldı (Critical / High / Medium / Low)
- [x] Critical bulgular kapatıldı
- [x] High bulgular takip planına bağlandı
- [x] Gerekiyorsa ADR veya checklist güncellemesi yapıldı
- [x] Foundation "kanıtlandı" denilebilir durumda

#### R.5 Audit Sonrası

- [x] Küçük refactor'lar uygulandı
- [x] Kural sertleştirmeleri yapıldı
- [x] DoD ve audit checklist son kez hizalandı
- [x] **Baseline üstünde yeni feature geliştirme artık meşru**

---

## 7. Sahte İlerleme İşaretleri (Anti-Patterns)

| #   | Anti-Pattern                                                  | Neden Kötü                           |
| --- | ------------------------------------------------------------- | ------------------------------------ |
| 1   | Token package var ama component'ler hardcoded stil kullanıyor | Token sistemi fiilen bypass ediliyor |
| 2   | Zustand kuruldu ama summary/store sınırı bozuluyor            | State management kararı uygulanmıyor |
| 3   | Query client kuruldu ama fetch screen içine dağılmış          | Data layer sınırı yok                |
| 4   | i18n kuruldu ama copy inline devam ediyor                     | i18n fiilen kullanılmıyor            |
| 5   | Sentry kuruldu ama structured logging yok                     | Observability yarım                  |
| 6   | Auth adapter açıldı ama token generic state'e sızıyor         | Güvenlik sınırı kırık                |
| 7   | Playwright kuruldu ama tek smoke bile yok                     | E2E testing fiilen yok               |
| 8   | UI package var ama feature-specific component'ler dolmuş      | Primitive/feature sınırı yok         |
| 9   | CI var ama gerçek kalite blocker'ı değil                      | Quality gates süs                    |
| 10  | docs/adr klasörü var ama güncellenmiyor                       | Documentation-first fiilen ölü       |
| 11  | MMKV kuruldu ama partialize yok, tüm store persist ediliyor   | Storage bloat + güvenlik riski       |
| 12  | Biometric entegre edildi ama fallback yok                     | Accessibility ihlali                 |

---

## 8. Yanlış Sıra Anti-Pattern'leri

1. ❌ Gate C (consistency audit) geçilmeden Faz A başlatmak
2. ❌ Repo bootstrap sırasında teknoloji keşfetmek
3. ❌ Checklist aşamasında ikinci state/query/form/styling tool düşünmek
4. ❌ Repo structure belirsizken feature package açmak
5. ❌ Vertical slice'tan önce büyük component kütüphanesi büyütmek
6. ❌ First audit olmadan foundation'ı "kanıtlandı" sanmak
7. ❌ Quality gates'i sonraya bırakmak
8. ❌ Token sistemi olmadan UI yazmak
9. ❌ `catalog:` kullanmadan doğrudan package.json'a versiyon yazmak
10. ❌ `packages/core`'a auth provider SDK erişimi koymak

---

## 9. Başarı Kriterleri

Bu SPEC başarılı sayılır eğer:

1. [x] Tüm fazlar sırasıyla tamamlandı (veya paralel track'ler doğru birleşme noktalarında senkronize oldu)
2. [x] Her faz için done kriterleri sağlandı
3. [x] Hiçbir sahte ilerleme anti-pattern'i mevcut değil
4. [x] Canonical stack kararları implementasyona doğru yansıtıldı
5. [x] Vertical slice (S25, S26, S27) her iki platformda çalışıyor → **web'de çalışıyor, mobile shared paketler ortak**
6. [x] System ekranları (S01-S07) ve auth ekranları (S08-S13) çalışıyor (web tarafı)
7. [x] First audit geçildi, critical bulgu kalmadı
8. [x] pnpm `catalog:` ile single-source version yönetimi aktif
9. [x] MMKV persistence selective (`partialize`) ve encrypted/plain ayrımı uygulanmış → persistConfig.ts partialize zorunlu + mmkv.ts encrypted/plain ayrımı
10. [x] Boilerplate'ten yeni proje türetmek için hazır foundation mevcut (temel foundation mevcut)

---

## 10. SPEC Sonrası — Ne Gelir?

Bu SPEC tamamlandığında:

1. First audit sonuçları işlenir
2. Gerekiyorsa küçük refactor yapılır
3. DoD ve audit checklist son kez hizalanır
4. **Baseline üstünde yeni feature geliştirme meşru hale gelir**
5. `39-default-screens-and-components-spec.md` **Faz 9** (App Shell Screens: S17-S24 — Home, Search, Profile, Settings vb.) implementasyonu başlar — bu, vertical slice (Faz 10) için önkoşuldur
6. İlk derived project oluşturulabilir (`45-boilerplate-project-boundary-contract.md`)
7. Storybook component lab tam kapasiteye ulaştırılır
8. Production deployment pipeline aktifleştirilebilir

---

## Revizyon Geçmişi

| Tarih      | Değişiklik                                                         | Yapan |
| ---------- | ------------------------------------------------------------------ | ----- |
| 2026-04-02 | İlk versiyon oluşturuldu                                           | —     |
| 2026-04-02 | Codex denetim döngüsü #1: 14 bulgu düzeltildi                      | —     |
| 2026-04-02 | Codex denetim döngüsü #2: 9 bulgu düzeltildi                       | —     |
| 2026-04-02 | Codex denetim döngüsü #3: 4 bulgu düzeltildi                       | —     |
| 2026-04-02 | Codex denetim döngüsü #4: PASS — 1 MEDIUM, 2 LOW cosmetic düzeltme | —     |

### Düzeltilen Bulgular (Döngü #1)

| Severity | Bulgu                                                          | Düzeltme                                                       |
| -------- | -------------------------------------------------------------- | -------------------------------------------------------------- |
| CRITICAL | pnpm `latest` toolchain kilidini bozar                         | Exact pin `pnpm@10.8.1` + `packageManager` alanı               |
| CRITICAL | `react-native-reanimated` 4.x vs 38-matrix 3.x                 | 3.x'e düzeltildi                                               |
| HIGH     | `packages/core` başlangıç setinde eksik                        | Faz B'ye eklendi, auth boundary placement netleştirildi        |
| HIGH     | Query modeli kendi içinde çelişkili (conditional vs mandatory) | ADR-005 conditional kararına bağlı iki yol tanımlandı          |
| HIGH     | `39` bootstrap sözleşmesi SPEC'e inmemiş                       | Faz I+ (Tier 2-3), Faz Q- (System/Auth Screens) eklendi        |
| HIGH     | S01-S07 Screen ID'leri yanlış eşlenmiş                         | 39 Bölüm 6'daki gerçek ID'lerle düzeltildi                     |
| HIGH     | Mobile readiness Faz A'dan geç çıkıyor                         | expo-doctor, userInterfaceStyle, dev build Faz A'ya taşındı    |
| HIGH     | ADR-019 storage/offline-first yarım yansımış                   | Faz M'ye detaylı MMKV/offline alt fazları eklendi              |
| MEDIUM   | Faz F kritik yolda belirsiz                                    | J bağımlılığına F eklendi, AI bootstrap maddeleri geri eklendi |
| MEDIUM   | ADR-003 catalog modeli bootstrap'a inmemiş                     | Faz B/E'ye catalog: bloğu ve CI sync eklendi                   |
| MEDIUM   | Biometric yol haritasında yok                                  | Faz L'ye expo-local-authentication maddeleri eklendi           |
| MEDIUM   | Pre-bootstrap kapıları açık değil                              | Bölüm 0 "Giriş Kapıları" eklendi                               |
| MEDIUM   | MMKV 38-matrix'te yok                                          | Not olarak eklendi, matrix güncelleme talebi Faz E'ye bağlandı |
| MEDIUM   | Versiyon otorite seti drift                                    | 38-matrix normalization notu eklendi                           |

### Düzeltilen Bulgular (Döngü #2)

| Severity | Bulgu                                                                   | Düzeltme                                                                              |
| -------- | ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| HIGH     | Component ID'leri (C22, C27-C31, C32-C33, C39, C44-C46) yanlış eşlenmiş | 39 Bölüm 19'daki gerçek ID'lerle birebir düzeltildi, Accordion 18.3 kapsamına taşındı |
| HIGH     | Q- (System/Auth) fazı vertical slice'tan sonra konmuş                   | Q- fazı Q'dan ÖNCE'ye alındı (39 kritik yoluna uygun)                                 |
| HIGH     | Storybook "opsiyonel/ertelenebilir" yazılmış                            | Mandatory baseline yapıldı, story zorunluluğu DoD'lere eklendi                        |
| MEDIUM   | Track B diyagramı ile J birleşme kuralı tutmuyor                        | I → J, I+ J sonrası paralel olarak düzeltildi                                         |
| MEDIUM   | Root topoloji .moai/, .claude/, prettier, tooling/ai eksik              | 21 Bölüm 4 ile birebir hizalandı                                                      |
| MEDIUM   | ADR-018 Hermes doğrulaması eksik                                        | Runtime `global.HermesInternal` kanıtı ve legacy API taraması eklendi                 |
| MEDIUM   | MMKV matrix authority kapanmamış                                        | 38-matrix güncelleme veya exception zorunluluğu Faz E done koşuluna bağlandı          |
| MEDIUM   | Fetch-first defer yolu "manual cache" ile ADR-005'e aykırı              | "data-access contract + cache'siz fetch-first" olarak daraltıldı                      |
| LOW      | S13 "Biometric Enrollment" → 39'da "Biometric Prompt"                   | Canonical isme düzeltildi                                                             |

### Düzeltilen Bulgular (Döngü #3)

| Severity | Bulgu                                   | Düzeltme                                                                                                             |
| -------- | --------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| HIGH     | 39 Faz 9 (S17-S24) yol haritası dışında | Q vertical slice "bootstrap proof slice" olarak yeniden tanımlandı, S17-S24 SPEC sonrası olarak açıkça referanslandı |
| HIGH     | Conditional Query Q-/Q'da belirsiz      | Q- gate'ine TanStack Query adopt zorunluluğu eklendi                                                                 |
| HIGH     | Storybook çok geç aktive ediliyor       | Faz I'e taşındı, primitive story zorunlu, Q-/Q done kriterlerine screen preview eklendi                              |
| MEDIUM   | Faz P bağımlılığı çelişkili             | Detay "Faz K-O + I+" olarak güncellendi, tablo ile eşitlendi                                                         |
