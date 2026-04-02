# Rol Bazlı Belge Okuma Rehberi

> 35-document-map.md'nin 50 maddelik tam listesi yerine, rolünüze göre 5 belgelik hızlı başlangıç.

---

## Developer Fast Track (2 saat)

Amacınız: Kod yazmaya başlamak için gereken minimum bağlamı edinmek.

| Sıra | Belge | Süre | Ne Öğrenirsiniz |
|------|-------|------|-----------------|
| 1 | `00-project-charter.md` | 20 dk | Proje neden var, neyi çözer |
| 2 | `36-canonical-stack-decision.md` | 20 dk | Hangi teknolojiler kilitli |
| 3 | `21-repo-structure-spec.md` | 20 dk | Kod nereye yazılır |
| 4 | `07-module-boundaries-and-code-organization.md` | 20 dk | Import kuralları, shared-by-proof |
| 5 | `30-contribution-guide.md` | 20 dk | PR nasıl açılır, review süreci |

**Bonus:** İlk feature'ınızdan önce `32-definition-of-done.md`'deki ilgili iş türü checklist'ini okuyun.

---

## Frontend Developer Deep Dive (ek 2 saat)

Developer Fast Track sonrası, frontend özelinde:

| Sıra | Belge | Süre | Ne Öğrenirsiniz |
|------|-------|------|-----------------|
| 1 | `09-state-management-strategy.md` | 20 dk | Zustand kullanım kuralları |
| 2 | `10-data-fetching-cache-sync.md` | 25 dk | ADR-005 server-state / fetch-first vs query-layer karar modeli |
| 3 | `11-forms-inputs-and-validation.md` | 20 dk | React Hook Form + Zod |
| 4 | `08-navigation-and-flow-rules.md` | 20 dk | Navigasyon parity kuralları |
| 5 | `25-error-empty-loading-states.md` | 15 dk | Error/empty/loading pattern'leri |

---

## Designer Fast Track (1.5 saat)

Amacınız: Design system ve token mimarisini anlamak.

| Sıra | Belge | Süre | Ne Öğrenirsiniz |
|------|-------|------|-----------------|
| 1 | `03-ui-ux-quality-standard.md` | 20 dk | Kalite standardı, premium hissiyat |
| 2 | `04-design-system-architecture.md` | 25 dk | Token → component → pattern zinciri |
| 3 | `22-design-tokens-spec.md` | 20 dk | Token aileleri, isimlendirme kuralları |
| 4 | `05-theming-and-visual-language.md` | 15 dk | Tema, renk, tipografi |
| 5 | `33-visual-implementation-contract.md` | 15 dk | Design-to-code doğruluk sözleşmesi |

---

## Tech Lead Fast Track (2.5 saat)

Amacınız: Mimari kararları, governance'ı ve kalite mekanizmalarını anlamak.

| Sıra | Belge | Süre | Ne Öğrenirsiniz |
|------|-------|------|-----------------|
| 1 | `01-working-principles.md` | 20 dk | Çalışma ilkeleri, karar alma |
| 2 | `06-application-architecture.md` | 25 dk | Katman mimarisi |
| 3 | `17-technology-decision-framework.md` | 20 dk | Teknoloji karar modeli |
| 4 | `15-quality-gates-and-ci-rules.md` | 20 dk | CI gates, blocker/major/minor |
| 5 | `45-boilerplate-project-boundary-contract.md` | 20 dk | Miras kuralları, override izinleri |

**Bonus okuma:** `37-dependency-policy.md`, `38-version-compatibility-matrix.md`, `31-audit-checklist.md`

---

## Mobile Developer Ek Okuma (1 saat)

Developer Fast Track sonrası, mobile özelinde:

| Sıra | Belge | Süre | Ne Öğrenirsiniz |
|------|-------|------|-----------------|
| 1 | `26-platform-adaptation-rules.md` | 20 dk | iOS/Android platform farkları |
| 2 | `34-hig-enforcement-strategy.md` | 15 dk | Apple HIG uyumu |
| 3 | `24-motion-and-interaction-standard.md` | 15 dk | Animasyon, gesture kuralları |
| 4 | `12-accessibility-standard.md` | 15 dk | Touch target, VoiceOver/TalkBack |
| 5 | `ADR-018-new-architecture-migration-and-readiness-strategy.md` | 15 dk | Fabric, JSI, TurboModules, Hermes V1 zorunlulukları |
| 6 | `ADR-019-local-storage-and-offline-first-strategy.md` | 10 dk | MMKV, SecureStore, Zustand persist, offline-first |

---

## QA / Test Mühendisi (1.5 saat)

| Sıra | Belge | Süre | Ne Öğrenirsiniz |
|------|-------|------|-----------------|
| 1 | `14-testing-strategy.md` | 25 dk | Test piramidi, katman seçimi |
| 2 | `32-definition-of-done.md` | 20 dk | Done kriterleri |
| 3 | `31-audit-checklist.md` | 20 dk | Audit ailesi, severity modeli |
| 4 | `13-performance-standard.md` | 15 dk | Performance budget'ları |
| 5 | `12-accessibility-standard.md` | 15 dk | A11y test gereksinimleri |

---

## Derived Proje Maintainer (1 saat)

Amacınız: Boilerplate güncellemelerini projenize nasıl alacağınızı öğrenmek.

| Sıra | Belge | Süre | Ne Öğrenirsiniz |
|------|-------|------|-----------------|
| 1 | `upstream-sync-rehberi.md` | 10 dk | Sync komutları, conflict çözme (hızlı başlangıç) |
| 2 | `45-boilerplate-project-boundary-contract.md` | 20 dk | Miras modeli, override izinleri |
| 3 | `49-upstream-sync-strategy.md` | 15 dk | Versiyonlama, manifest, drift detection |
| 4 | `43-derived-project-creation-guide.md` | 15 dk | İlk kurulum adımları, BOUNDARY.md |

**Günlük iş:** `CHANGELOG.md`'yi takip edin, `upstream-sync` issue'larını çözün.

---

## AI Agent Rolü

AI agent'ların (Claude Code, Codex CLI vb.) projeye katılımında okuması gereken dokümanlar:

| Öncelik | Doküman | Gerekçe |
|---------|--------|---------|
| 🔴 Zorunlu | `CLAUDE.md` | Proje talimat sözleşmesi, canonical kararlar, kodlama standartları |
| 🔴 Zorunlu | `AGENTS.md` | Agent-spesifik talimatlar, review guidelines |
| 🔴 Zorunlu | `47-ai-guardrail-governance.md` | Guardrail protokolü, skill/hook entegrasyonu, ihlal yönetimi |
| 🟠 Yüksek | `36-canonical-stack-decision.md` | Teknoloji kararları, kilitli kütüphaneler |
| 🟠 Yüksek | `37-dependency-policy.md` | Bağımlılık kuralları, yeni paket ekleme süreci |
| 🟠 Yüksek | `38-version-compatibility-matrix.md` | Versiyon uyumluluğu, SDK eşleşmeleri |
| 🟡 Orta | İlgili ADR (ADR-001 → ADR-019) | Karar bağlamı, neden bu teknoloji seçildi (ADR-018: New Architecture, ADR-019: Local Storage dahil) |
| 🟡 Orta | `40-ai-workflow-and-tooling.md` | AI workflow kuralları, token bütçesi |
| 🟡 Orta | `41-ai-instruction-standards.md` | Talimat dosyası standartları, context bütçesi |
| 🟢 Düşük | `44-exception-and-exemption-policy.md` | İhlal düzeltilemediğinde exception süreci |

**Not:** AI agent'lar CLAUDE.md ve AGENTS.md'yi her oturumda otomatik olarak okur. Diğer dokümanlar iş türüne göre guardrail skill'leri tarafından yüklenir.

---

## Tahmini Okuma Süreleri

Doküman aileleri ve tahmini okuma süreleri:

| Doküman Ailesi | Doküman Sayısı | Tahmini Süre | İçerik |
|---------------|---------------|-------------|--------|
| Foundation (00-02) | 3 | ~30 dakika | Charter, ilkeler, UI/UX kalite standardı |
| Architecture (03-10) | 8 | ~2 saat | Mimari, design system, state, data fetching |
| Standards (11-14) | 4 | ~1 saat | Forms, a11y, performance, testing |
| Governance (15-17) | 3 | ~45 dakika | CI rules, tooling, decision framework |
| ADR (ADR-001 → ADR-019) | 19 | ~3 saat | Tüm canonical kararlar |
| Design System (22-26) | 5 | ~1.5 saat | Tokens, components, motion, platform |
| Quality (27-28) | 2 | ~1 saat | Security, observability |
| Operations (29-34) | 6 | ~1.5 saat | Release, contribution, audit, DoD |
| Governance (36-48) | 13 | ~2.5 saat | Stack, dependency, branching, AI, guardrail |
| AI Guardrails | ~26 domain + ~30 aktivite | ~2 saat | Domain ve aktivite kuralları |
| Onboarding | 3 | ~40 dakika | İlk adımlar, okuma rehberi, upstream sync rehberi |

### Hedef Okuma Süreleri

| Profil | Minimum (çalışmaya başlamak için) | Tam Resim |
|--------|----------------------------------|-----------|
| Developer | ~2 saat (Fast Track) | ~6-8 saat |
| Frontend Developer | ~4 saat (Fast Track + Deep Dive) | ~8-10 saat |
| Mobile Developer | ~3 saat (Fast Track + Mobile) | ~8-10 saat |
| Designer | ~1.5 saat | ~4-6 saat |
| Tech Lead | ~2.5 saat | ~10-12 saat |
| QA Mühendisi | ~1.5 saat | ~6-8 saat |
| AI Agent | ~10 dakika (CLAUDE.md + AGENTS.md) | Guardrail skill'ler ile on-demand |

---

## Tam Belge Seti

Tüm belgelerin tam listesi ve otorite sırası için: `35-document-map.md`
