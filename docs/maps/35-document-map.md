# 35-document-map.md

## Doküman Kimliği

- **Doküman adı:** Document Map
- **Dosya adı:** `35-document-map.md`
- **Doküman türü:** Map / reading order / authority map / documentation navigation document
- **Durum:** Accepted
- **Tarih:** 2026-03-31
- **Kapsam:** Bu belge, tüm doküman setinin güncel otorite sırasını, okuma sırasını, belge ailelerini, hangi belgelerin artık canonical karar katmanı sayıldığını, hangi belgelerin implementasyon öncesi bloklayıcı olduğunu, hangi görev için hangi belgelere dönülmesi gerektiğini ve yeni belge/ADR eklendiğinde haritanın nasıl güncelleneceğini tanımlar.
- **Bağlı olduğu üst dokümanlar:** Tüm ana doküman seti
- **Doğrudan etkileyeceği dokümanlar:** Tüm ana doküman seti

---

# 1. Bu Dokümanın Revize Edilme Nedeni

Önceki versiyon belge setini genel olarak iyi haritalıyordu.  
Ama artık önemli bir fark var:

- çekirdek ADR katmanı tamamlandı,
- dependency policy yazıldı,
- compatibility matrix yazıldı,
- teknoloji kararı artık açık alan olmaktan çıktı,
- implementasyon belgeleri revize edildi.

Bu nedenle document map artık yalnızca “hangi belge ne işe yarar?” metni değildir.  
Yeni rolü şudur:

> **Belge sisteminde hangi katmanın artık canonical karar otoritesi olduğunu, hangi belgelerin operasyonel uygulama belgesi olduğunu ve implementasyon öncesi neyin bloklayıcı hale geldiğini net biçimde göstermek.**

---

# 2. Amaç

Bu dokümanın amacı, tüm doküman setini:

- bağımsız md dosyaları koleksiyonu,
- sırasız okuma listesi,
- yalnızca arşiv niteliğinde belge yığını

olmaktan çıkarıp;  
**otorite sırası, karar bağımlılığı, okuma sırası ve görev bazlı kullanım modeli olan yaşayan bir sistem** haline getirmektir.

Bu belge şu sorulara net cevap verir:

1. Artık en üst otorite belgeler hangileri?
2. Canonical karar katmanı hangi dosyalardan oluşur?
3. Hangi belgeler implementasyon öncesi bloklayıcıdır?
4. Bir görev için hangi belge ailesine dönülmelidir?
5. Bir çelişki varsa önce nereye bakılır?
6. Yeni ADR veya yeni ana belge eklendiğinde bu harita nasıl güncellenir?
7. Bu sistemde “önce okunacaklar” ile “iş sırasında referans alınacaklar” nasıl ayrılır?

---

# 3. Temel Tez

Bu proje kapsamında temel tez şudur:

> Dokümantasyon-first yaklaşımın çalışabilmesi için belgeler yalnızca var olmamalı; birbirleriyle hangi sırayla ve hangi otorite ilişkisiyle okunacağı görünür olmalıdır. Özellikle canonical kararlar, uygulama standardı belgeleri, checklist’ler ve audit/DoD belgeleri birbirine karıştırılmamalıdır.

Bu tez şu sonuçları doğurur:

1. Tüm belgeler aynı seviyede değildir.
2. ADR seti artık merkezi karar katmanıdır.
3. Dependency policy ve compatibility matrix artık yalnızca ek belge değil, karar otoritesi katmanıdır.
4. Roadmap/checklist/repo structure belgeleri artık karar üretmek için değil, kararı uygulamak için okunur.
5. Document map güncellenmeden yeni ana belge eklemek zayıf yaklaşımdır.

---

# 4. Güncel Belge Aileleri

Bu repo için belge ailesi artık şu şekilde okunmalıdır:

1. Foundation documents
2. Product / platform documents
3. Design system and UX documents
4. Architecture and runtime documents
5. Governance and decision documents
6. Canonical ADR and stack governance documents
7. Implementation transition and bootstrap documents
8. Operational quality documents
9. Audit and completion documents
10. Boilerplate-Project Governance documents

Bu yeni aile ayrımı, eski versiyondan farklı olarak ADR + dependency + compatibility katmanını ayrı görünür yapar.

### Boilerplate-Project Governance Ailesi

Bu aile, boilerplate ile türetilen projeler arasındaki sınırları, dallanma stratejisini, yeni proje türetme sürecini ve istisna politikasını tanımlar.

| Dosya                                         | Açıklama                                              | Tür        |
| --------------------------------------------- | ----------------------------------------------------- | ---------- |
| `45-boilerplate-project-boundary-contract.md` | Boilerplate-project sınır sözleşmesi                  | Governance |
| `42-branching-and-merge-strategy.md`          | Branching ve merge stratejisi                         | Process    |
| `43-derived-project-creation-guide.md`        | Türetilen proje oluşturma rehberi                     | Guide      |
| `44-exception-and-exemption-policy.md`        | İstisna ve muafiyet politikası                        | Governance |
| `48-expo-sdk-upgrade-strategy.md`             | Expo SDK major upgrade operasyonel stratejisi         | Governance |
| `49-upstream-sync-strategy.md`                | Boilerplate → derived proje upstream sync mekanizması | Governance |

### Operations Ailesi

Bu aile, production ortamındaki operasyonel prosedürleri ve incident yönetimini tanımlar.

| Dosya                                              | Açıklama                                     | Tür        |
| -------------------------------------------------- | -------------------------------------------- | ---------- |
| `docs/operations/runbook-and-incident-response.md` | Operasyonel prosedürler ve incident response | Operations |

### AI Guardrail Ailesi

Bu aile, AI araçlarının kod üretirken boilerplate standartlarına uyumunu garanti eden guardrail çerçevesini tanımlar.

| Dosya                                    | Açıklama                                  | Tür        |
| ---------------------------------------- | ----------------------------------------- | ---------- |
| `47-ai-guardrail-governance.md`          | AI guardrail çerçevesi ana dokümanı       | Governance |
| `docs/ai-guardrails/domain/D-XXX-*.md`   | Domain guardrail'ler (26 adet)            | Guardrail  |
| `docs/ai-guardrails/activity/A-XXX-*.md` | Aktivite guardrail'ler (30 adet)          | Guardrail  |
| `.claude/skills/*/SKILL.md`              | Claude Code guardrail skill'leri (7 adet) | Skill      |
| `.claude/settings.json`                  | Claude Code hook tanımları                | Config     |

Bu aile `40-ai-workflow-and-tooling.md` ve `41-ai-instruction-standards.md` ile doğrudan bağlıdır. Guardrail dokümanları mevcut boilerplate dokümanlarının AI-native özetidir, alternatifi değildir. Çelişki durumunda kaynak doküman kazanır.

### Onboarding Ailesi

Bu aile, yeni ekip üyelerinin projeye hızlı adaptasyonunu sağlayan rehber dokümanları içerir.

| Dosya                                        | Açıklama                              | Tür        |
| -------------------------------------------- | ------------------------------------- | ---------- |
| `docs/onboarding/ilk-30-dakika.md`           | İlk 30 dakika hızlı başlangıç rehberi | Onboarding |
| `docs/onboarding/rol-bazli-okuma-rehberi.md` | Rol bazlı doküman okuma sırası        | Onboarding |

### AI Entegrasyon Dokümantasyonu

| Dosya                                                  | Açıklama                                                        | Tür        |
| ------------------------------------------------------ | --------------------------------------------------------------- | ---------- |
| `docs/governance/ai-integration-documentation-plan.md` | AI araç entegrasyonu ve türetilen projelerde AI konumlandırması | Governance |

### Önemli Ayrım: Boilerplate Dökümanları vs Proje Dökümanları

Bu belge haritası yalnızca boilerplate seviyesindeki dökümanları kapsar. Boilerplate'ten türetilen her projenin kendine ait dökümanları `project/` dizininde yaşar. İki alan arasındaki ayrım kesindir:

- **`docs/`** → boilerplate standartları, kuralları, ADR'leri, audit ve governance belgeleri. Otorite kaynağı boilerplate'tir.
- **`project/`** → projeye özel kapsam, gereksinimler, spec'ler, kararlar. Otorite kaynağı proje ekibidir.

`project/` dizini proje ekibinin otoritesindedir; ancak boilerplate burada **minimum birlikte çalışabilirlik sözleşmesi** tanımlar. Özellikle `project/adr/` altında proje ADR'leri için yer açılması, gerekirse `project/project-charter.md` kullanılması ve root seviyesinde `BOUNDARY.md` ile boilerplate sınır manifestinin görünür tutulması önerilen default sözleşmedir. Bu, proje alanının tamamını boilerplate'e bağlamak anlamına gelmez; yalnızca boilerplate–derived project etkileşim noktalarını standartlaştırır. Proje dökümanları canonical karar katmanını (ADR-001→ADR-019 + 36/37/38 canonical governance belgeleri) açamaz veya çelişemez — yalnızca daraltabilir veya somutlaştırabilir.

---

# 5. Güncel Üst Otorite Sırası

Bir çelişki olduğunda belgeler aşağıdaki sırayla yorumlanmalıdır:

## 5.1. Birinci katman — En üst niyet ve çalışma rejimi

1. `00-project-charter.md`
2. `01-working-principles.md`

## 5.2. İkinci katman — Ürün ve kalite yönü

3. `02-product-platform-philosophy.md`
4. alanın ilgili ana standardı (`03`–`16` arası)

## 5.3. Üçüncü katman — Karar yönetim rejimi

5. `17-technology-decision-framework.md`
6. `18-adr-template.md`

## 5.4. Dördüncü katman — Canonical karar otoritesi

7. `ADR-001` → `ADR-019`
8. `36-canonical-stack-decision.md` _(canonical stack index / bridge belgesi)_
9. `37-dependency-policy.md`
10. `38-version-compatibility-matrix.md`

## 5.5. Beşinci katman — Uygulama geçiş ve bootstrap belgeleri

11. `19-roadmap-to-implementation.md`
12. `20-initial-implementation-checklist.md`
13. `21-repo-structure-spec.md`

## 5.6. Altıncı katman — Operasyonel standartlar

13. `22` → `29` arası alan belgeleri
14. `30-contribution-guide.md`

## 5.7. Yedinci katman — Denetim ve tamamlanma

15. `31-audit-checklist.md`
16. `32-definition-of-done.md`
17. `33-visual-implementation-contract.md`
18. `34-hig-enforcement-strategy.md`
19. `35-document-map.md`

---

# 6. Çok Kritik Yorum: ADR Katmanı Artık Merkezi

Önceki haritada ADR’ler daha çok tarihsel/özel karar alanı gibi okunuyordu.  
Bu artık eksik yorum olur.

Şu andan sonra:

> **ADR-001 → ADR-019 ile birlikte `36-canonical-stack-decision.md`, `37-dependency-policy.md` ve `38-version-compatibility-matrix.md` canonical technical decision layer olarak yorumlanmalıdır.**

Bu ne demektir?

- yeni teknoloji tartışması açıldığında buraya dönülür
- state/data/forms/styling/testing/auth/i18n gibi alanlarda “acaba” dili burada kapanır
- contribution ve repo bootstrap belgeleri bu seti varsaymak zorundadır

---

# 7. Bir Çelişki Görünürse Ne Yapılır?

Aşağıdaki sıra izlenir:

1. Gerçek çelişki mi, yoksa genel ilke / özel uygulama farkı mı?
2. Alan standardı ADR ile çelişiyor mu?
3. Eğer çelişiyorsa:
   - standard eski kalmış olabilir
   - operational belge güncellenmemiş olabilir
   - ya da ADR sınırlı özel durum olabilir
4. Eğer gerçek çelişkiyse:
   - ilgili operational belge revize edilir
   - gerekiyorsa üst belge veya ADR supersede edilir

### Kural

PR notu, chat cevabı veya geçici yorum, bu belge setini sessizce geçersiz kılamaz.

---

# 8. İlk Kez Okuyacak Biri İçin Güncel Okuma Sırası

Bu sıralama artık yeni canonical katmanı da içerir.

## 8.1. Başlangıç zemini

1. `00-project-charter.md`
2. `01-working-principles.md`
3. `02-product-platform-philosophy.md`

## 8.2. Kalite ve sistem yönü

4. `03-ui-ux-quality-standard.md`
5. `04-design-system-architecture.md`
6. `05-theming-and-visual-language.md`
7. `12-accessibility-standard.md`
8. `13-performance-standard.md`

## 8.3. Mimari ve runtime yönü

9. `06-application-architecture.md`
10. `07-module-boundaries-and-code-organization.md`
11. `08-navigation-and-flow-rules.md`
12. `09-state-management-strategy.md`
13. `10-data-fetching-cache-sync.md`
14. `11-forms-inputs-and-validation.md`

## 8.4. Governance ve karar sistemi

15. `14-testing-strategy.md`
16. `15-quality-gates-and-ci-rules.md`
17. `16-tooling-and-governance.md`
18. `17-technology-decision-framework.md`
19. `18-adr-template.md`

## 8.5. Canonical teknik karar katmanı

20. `ADR-001-web-runtime-and-application-shell.md` _(Web Runtime)_
21. `ADR-002-mobile-runtime-and-native-strategy.md` _(Mobile Runtime)_
22. `ADR-003-monorepo-package-manager-and-build-orchestration.md` _(Monorepo)_
23. `ADR-004-state-management.md` _(State Management)_
24. `ADR-005-data-fetching-cache-and-mutation-model.md` _(Data Fetching)_
25. `ADR-006-forms-and-validation.md` _(Forms)_
26. `ADR-007-styling-tokens-and-theming-implementation.md` _(Styling/Tokens)_
27. `ADR-008-testing-stack.md` _(Testing)_
28. `ADR-009-observability-stack.md` _(Observability)_
29. `ADR-010-auth-session-and-secure-storage-baseline.md` _(Auth/Session)_
30. `ADR-011-internationalization-baseline.md` _(i18n)_
31. `ADR-012-navigation-baseline.md` _(Navigation)_
32. `ADR-013-push-notification-strategy.md` _(Push Notification)_
33. `ADR-014-deep-linking-and-universal-links.md` _(Deep Linking)_
34. `ADR-015-ota-update-strategy.md` _(OTA Update)_
35. `ADR-016-in-app-purchase-and-subscription.md` _(In-App Purchase)_
36. `ADR-017-privacy-and-data-protection-framework.md` _(Privacy/GDPR/KVKK)_
37. `ADR-018-new-architecture-migration-and-readiness-strategy.md` _(New Architecture Migration)_
38. `ADR-019-local-storage-and-offline-first-strategy.md` _(Local Storage/Offline-First)_
39. `36-canonical-stack-decision.md`
40. `37-dependency-policy.md`
41. `38-version-compatibility-matrix.md`

## 8.6. Uygulama geçiş belgeleri

42. `19-roadmap-to-implementation.md`
43. `20-initial-implementation-checklist.md`
44. `21-repo-structure-spec.md`
45. `39-default-screens-and-components-spec.md`

## 8.7. Derin uygulama standartları

46. `22-design-tokens-spec.md`
47. `23-component-governance-rules.md`
48. `24-motion-and-interaction-standard.md`
49. `25-error-empty-loading-states.md`
50. `26-platform-adaptation-rules.md`
51. `27-security-and-secrets-baseline.md`
52. `28-observability-and-debugging.md`
53. `29-release-and-versioning-rules.md`

## 8.8. AI workflow ve talimat standartları

54. `40-ai-workflow-and-tooling.md`
55. `41-ai-instruction-standards.md`
56. `46-stitch-pipeline-spec.md`
57. `docs/governance/ai-integration-documentation-plan.md`

## 8.9. Onboarding

58. `docs/onboarding/ilk-30-dakika.md`
59. `docs/onboarding/rol-bazli-okuma-rehberi.md`

## 8.10. Operasyon ve denetim

60. `30-contribution-guide.md`
61. `31-audit-checklist.md`
62. `32-definition-of-done.md`
63. `33-visual-implementation-contract.md`
64. `34-hig-enforcement-strategy.md`
65. `35-document-map.md`

---

# 9. Implementasyon Öncesi Güncel Bloklayıcı Set

Artık implementasyon öncesi bloklayıcı set eski halinden daha geniştir.  
Çünkü canonical decision layer eklenmiştir.

Aşağıdaki belgeler repo bootstrap öncesi bloklayıcı kabul edilmelidir:

- `00-project-charter.md`
- `01-working-principles.md`
- `02-product-platform-philosophy.md`
- `03-ui-ux-quality-standard.md`
- `04-design-system-architecture.md`
- `05-theming-and-visual-language.md`
- `06-application-architecture.md`
- `07-module-boundaries-and-code-organization.md`
- `08-navigation-and-flow-rules.md`
- `09-state-management-strategy.md`
- `10-data-fetching-cache-sync.md`
- `11-forms-inputs-and-validation.md`
- `12-accessibility-standard.md`
- `13-performance-standard.md`
- `14-testing-strategy.md`
- `15-quality-gates-and-ci-rules.md`
- `16-tooling-and-governance.md`
- `17-technology-decision-framework.md`
- `18-adr-template.md`
- `ADR-001` → `ADR-019`
- `36-canonical-stack-decision.md` _(canonical stack index / bridge)_
- `37-dependency-policy.md`
- `38-version-compatibility-matrix.md`
- `19-roadmap-to-implementation.md`
- `20-initial-implementation-checklist.md`
- `21-repo-structure-spec.md`
- `40-ai-workflow-and-tooling.md`

### Not

Eski sürümde `20` ve `21` daha çok “destekleyici ama kritik” gibi okunabiliyordu.  
Artık bu zayıf olur. Çünkü bunlar doğrudan bootstrap’ın uygulama belgeleridir.
`40` ise AI araçlarının geliştirme sürecindeki konumunu tanımlar; AI araçları kullanılmadan repo bootstrap’ına başlanamaz.

---

# 10. “Şu İş İçin Hangi Belgelere Döneceğim?” Haritası

---

## 10.1. Yeni teknoloji veya dependency öneriyorum

Oku:

- `17-technology-decision-framework.md`
- ilgili ADR
- `37-dependency-policy.md`
- `38-version-compatibility-matrix.md`
- gerekiyorsa `18-adr-template.md`

---

## 10.2. Repo bootstrap başlatacağım

Oku:

- `19-roadmap-to-implementation.md`
- `20-initial-implementation-checklist.md`
- `21-repo-structure-spec.md`
- `37-dependency-policy.md`
- `38-version-compatibility-matrix.md`

---

## 10.3. Yeni reusable component açacağım

Oku:

- `04-design-system-architecture.md`
- `05-theming-and-visual-language.md`
- `22-design-tokens-spec.md`
- `23-component-governance-rules.md`
- `24-motion-and-interaction-standard.md`
- `33-visual-implementation-contract.md`
- `34-hig-enforcement-strategy.md`
- `32-definition-of-done.md`

---

## 10.4. Yeni feature flow açacağım

Oku:

- `02-product-platform-philosophy.md`
- `08-navigation-and-flow-rules.md`
- `09-state-management-strategy.md`
- `10-data-fetching-cache-sync.md`
- `11-forms-inputs-and-validation.md`
- `25-error-empty-loading-states.md`
- `26-platform-adaptation-rules.md`
- `32-definition-of-done.md`

---

## 10.5. Auth/session ile ilgili iş yapacağım

Oku:

- `ADR-010`
- `27-security-and-secrets-baseline.md`
- `28-observability-and-debugging.md`
- `09-state-management-strategy.md`
- `10-data-fetching-cache-sync.md`
- `32-definition-of-done.md`

---

## 10.6. i18n / copy / locale işi yapacağım

Oku:

- `ADR-011`
- `ADR-012` (navigation title, tab label, locale-aware route metadata etkisi varsa)
- `11-forms-inputs-and-validation.md` (form copy etkisi varsa)
- `12-accessibility-standard.md`
- `23-component-governance-rules.md`
- `32-definition-of-done.md`

---

## 10.7. Testing veya CI ile ilgili iş yapacağım

Oku:

- `ADR-008`
- `14-testing-strategy.md`
- `15-quality-gates-and-ci-rules.md`
- `31-audit-checklist.md`
- `32-definition-of-done.md`

---

## 10.8. AI aracıyla iş yapacağım

Oku:

- `40-ai-workflow-and-tooling.md`
- `41-ai-instruction-standards.md`
- `CLAUDE.md` (proje talimatı)
- `AGENTS.md` (denetim talimatı)
- İlgili SPEC varsa: `.moai/specs/<SPEC-ID>.md`
- Stitch işi varsa: `46-stitch-pipeline-spec.md` + `DESIGN.md`

---

## 10.9. Yeni derived project türetme

Oku:

- `43-derived-project-creation-guide.md`
- `45-boilerplate-project-boundary-contract.md`
- `20-initial-implementation-checklist.md`
- `21-repo-structure-spec.md`
- `42-branching-and-merge-strategy.md`

---

## 10.10. Push notification geliştireceğim

Oku:

- `ADR-013-push-notification-strategy.md`
- `ADR-014-deep-linking-and-universal-links.md` (notification → deep link entegrasyonu)
- `27-security-and-secrets-baseline.md`
- `28-observability-and-debugging.md`
- `32-definition-of-done.md`

---

## 10.11. Deep linking implementasyonu yapacağım

Oku:

- `ADR-014-deep-linking-and-universal-links.md`
- `ADR-012-navigation-baseline.md`
- `08-navigation-and-flow-rules.md`
- `26-platform-adaptation-rules.md`
- `32-definition-of-done.md`

---

## 10.12. In-app purchase / ödeme entegrasyonu yapacağım

Oku:

- `ADR-016-in-app-purchase-and-subscription.md`
- `ADR-010-auth-session-and-secure-storage-baseline.md`
- `ADR-017-privacy-and-data-protection-framework.md`
- `27-security-and-secrets-baseline.md`
- `32-definition-of-done.md`

---

## 10.13. OTA güncelleme yapacağım

Oku:

- `ADR-015-ota-update-strategy.md`
- `29-release-and-versioning-rules.md`
- `28-observability-and-debugging.md`
- `15-quality-gates-and-ci-rules.md`
- `32-definition-of-done.md`

---

## 10.14. Privacy / GDPR / KVKK uyum çalışması yapacağım

Oku:

- `ADR-017-privacy-and-data-protection-framework.md`
- `27-security-and-secrets-baseline.md`
- `28-observability-and-debugging.md`
- `ADR-009-observability-stack.md`
- `32-definition-of-done.md`

---

## 10.15. Production incident / sorun müdahalesi yapacağım

Oku:

- `docs/operations/runbook-and-incident-response.md`
- `28-observability-and-debugging.md`
- `ADR-009-observability-stack.md`
- `29-release-and-versioning-rules.md`
- `ADR-015-ota-update-strategy.md`

---

## 10.16. Güvenlik denetimi / pentest hazırlığı yapacağım

Oku:

- `27-security-and-secrets-baseline.md` (§39-41: encryption, pentest, cert pinning)
- `ADR-010-auth-session-and-secure-storage-baseline.md`
- `ADR-017-privacy-and-data-protection-framework.md`
- `37-dependency-policy.md` (§44: license audit, SBOM)

---

## 10.17. Onboarding / first-time user experience tasarlayacağım

Oku:

- `03-ui-ux-quality-standard.md` (§31: Onboarding ve FTUE)
- `26-platform-adaptation-rules.md` (§37: AppState lifecycle)
- `ADR-019-local-storage-and-offline-first-strategy.md` (onboarding state persistence)
- `24-motion-and-interaction-standard.md`

---

# 11. Belge Bağımlılık Haritasının Yeni Özeti

## 11.1. Foundation zinciri

- `00`
- `01`
- `02`

Bunlar en üst niyet ve çalışma rejimidir.

## 11.2. UX / design system zinciri

- `03`
- `04`
- `05`
- `12`
- `22`
- `23`
- `24`
- `33`
- `34`

## 11.3. Mimari / runtime zinciri

- `06`
- `07`
- `08`
- `09`
- `10`
- `11`
- `21`

## 11.4. Governance / decision zinciri

- `14`
- `15`
- `16`
- `17`
- `18`

## 11.5. Canonical technical decision layer

- `ADR-001` → `ADR-019`
- `36`
- `37`
- `38`

## 11.6. Implementation transition zinciri

- `19`
- `20`
- `21`

## 11.7. Operational quality zinciri

- `25`
- `26`
- `27`
- `28`
- `29`
- `30`

## 11.8. Audit / completion zinciri

- `31`
- `32`
- `33`
- `34`
- `35`

## 11.9. AI tooling zinciri

- `40`
- `41`
- `42`
- `46` _(Stitch pipeline: MCP, skill ekosistemi, DESIGN.md rehberi, kapasite, RN sinirliliklari)_
- `47` _(AI guardrail governance)_
- `ai-integration-documentation-plan.md`

## 11.10. Onboarding zinciri

- `docs/onboarding/ilk-30-dakika.md`
- `docs/onboarding/rol-bazli-okuma-rehberi.md`

Bu zincirler operasyonel kalite zinciriyle (11.7) aynı katmandadır.
Talimat dosyaları (CLAUDE.md, AGENTS.md, DESIGN.md, `.moai/config/`) bu dokümanların çıktılarıdır ve hiçbir boilerplate dokümanını geçersiz kılamaz. Bu adların bir kısmı bu arşivde fiziksel dosya olarak yer almayabilir; generated veya derived-project artifact olarak beklenir.

---

# 12. Çok Kritik Kural: Operational Belge, Canonical Kararı Açamaz

Bu haritadaki en önemli disiplinlerden biri şudur:

> Checklist, roadmap, contribution guide, repo structure spec veya herhangi bir operational belge; canonical ADR ve dependency/compatibility katmanında kapanmış bir kararı yeniden “açık seçenek” gibi yazamaz.

Örnek yanlışlar:

- checklist içinde ikinci state library konuşmak
- repo structure spec içinde package manager alternatif sunmak
- contribution guide içinde “gerekirse başka query library de olabilir” demek

Bu belge böyle sapmaları görünür kılmak için vardır.

---

# 13. Yeni Belge veya Yeni ADR Eklenirse Ne Olur?

Aşağıdaki durumlarda `35-document-map.md` zorunlu olarak güncellenmelidir:

1. yeni ana standart belge eklenirse
2. yeni ADR eklenirse
3. bir belge bloklayıcı setin parçası haline gelirse
4. otorite sırası etkilenirse
5. okuma sırası değişirse
6. görev bazlı hızlı harita değişirse

### Kural

Document map güncellenmeden doküman sistemi tamam sayılmaz.

---

# 14. En Çok Drift Riski Taşıyan Belgeler — Güncel Liste

Aşağıdaki belgeler artık özellikle sık drift riski taşır:

- `17-technology-decision-framework.md`
- `19-roadmap-to-implementation.md`
- `20-initial-implementation-checklist.md`
- `21-repo-structure-spec.md`
- `27-security-and-secrets-baseline.md`
- `28-observability-and-debugging.md`
- `29-release-and-versioning-rules.md`
- `30-contribution-guide.md`
- `31-audit-checklist.md`
- `32-definition-of-done.md`
- `35-document-map.md`
- `37-dependency-policy.md`
- `38-version-compatibility-matrix.md`

Neden?
Çünkü bunlar doğrudan gerçek repo yaşamı ve karar setiyle birlikte evrilir.

---

# 15. Bu Haritada Bilinçli Olarak Ayrı Tutulan Şeyler

## 15.1. Genel ilke belgeleri

Bunlar neden ve nasıl çalıştığımızı söyler.

## 15.2. Alan standartları

Bunlar UI, a11y, perf, data, forms gibi domain-standard alanları tanımlar.

## 15.3. Canonical ADR seti

Bunlar çekirdek teknik kararları kilitler.

## 15.4. Operational belgeler

Bunlar kararı günlük işe ve repo’ya indirir.

## 15.5. Audit/DoD belgeleri

Bunlar uygulananın doğru yapılıp yapılmadığını denetler.

Bu ayrım korunmazsa document-first sistem bulanır.

---

# 16. Çelişki Çözüm Mantığı — Güncel Basit Rehber

Bir iş sırasında belge çelişkisi hissedilirse:

1. Önce `00` ve `01`e bak
2. Sonra alan standardına bak
3. Sonra ilgili ADR’ye bak
4. Sonra `37` ve `38`e bak
5. Sonra operational belgeye bak
6. Hâlâ çelişki varsa belge senkronizasyonu sorunu var demektir

“Ben şöyle yorumladım” çözüm değildir.  
Belge güncellenmelidir.

---

# 17. Onay Kriterleri

Bu doküman yeterli kabul edilir eğer:

1. Yeni canonical technical decision layer görünür kılınmışsa
2. Güncel otorite sırası netse
3. Implementasyon öncesi bloklayıcı set güncellenmişse
4. Görev bazlı hangi belgelere dönüleceği netleşmişse
5. Operational belgelerin canonical kararı açamayacağı açıkça yazılmışsa
6. New doc / new ADR eklendiğinde haritanın güncellenmesi zorunlu kılınmışsa
7. Bu belge tüm sistemin gerçek navigasyon haritası olarak kullanılabilecek netlikteyse

---

# 18. Son Revizyon Notu (2026-03-31)

Bu harita, kapsamlı belge denetimi sonrası aşağıdaki düzeltmelerle güncellenmiştir:

1. Canonical technical decision layer bölümüne (11.5) `36-canonical-stack-decision.md` eksikliği kapatıldı
2. Tüm alan standardı belgeleri (09–11, 13–14, 22–26) ilgili ADR referanslarıyla senkronize edildi
3. Operational/enforcement belgeleri (30–34) cross-reference eksiklikleri kapatıldı
4. 17-technology-decision-framework.md kapalı alan listesine Navigation eklendi
5. 36, 37, 38 canonical katman belgelerinde sürüm notasyonu ve Zustand sürümü netleştirildi

Bu düzeltmeler sonrası belge seti, bootstrap-ready olarak kabul edilebilir.

## 18.1. Revizyon Notu (2026-04-01)

Kapsamlı gap analizi sonrası aşağıdaki genişletmeler yapılmıştır:

1. **5 yeni ADR eklendi:** ADR-013 (Push Notification), ADR-014 (Deep Linking), ADR-015 (OTA Update), ADR-016 (In-App Purchase), ADR-017 (Privacy/Data Protection)
2. **ADR-010 genişletildi:** Biometric Authentication bölümü eklendi
3. **5 yeni domain guardrail eklendi:** D-NTF, D-DPL, D-PAY, D-PRI, D-BIO
4. **5 yeni activity guardrail eklendi:** A-NOTIFICATION, A-DEEPLINK, A-PAYMENT, A-OTA, A-PRIVACY
5. **8 mevcut doküman genişletildi:**
   - 24: Haptic feedback standardı
   - 05: Dark mode ve sistem tercihi senkronizasyonu
   - 39: Onboarding deneyimi ve kullanıcı tutma stratejisi
   - 26: Background tasks, share extension, app clips
   - 27: Web güvenlik başlıkları (CSP), API güvenliği, certificate pinning, jailbreak detection
   - 28: OpenTelemetry, structured logging, RUM, Core Web Vitals
   - 15: Build otomasyonu, Fastlane, EAS Build, code signing, CI/CD workflow
   - 29: OTA güncelleme disiplini, ASO, store listing
6. **Canonical technical decision layer** ADR-001→ADR-017 olarak güncellendi
7. **47-ai-guardrail-governance.md** domain ve aktivite tabloları güncellendi
8. **CLAUDE.md** yeni ADR referansları ve aktivasyon tablosu güncellendi

## 18.2. Revizyon Notu (2026-04-02)

Doküman seti tutarlılık denetimi (guardrail audit) sonrası aşağıdaki düzeltmeler yapılmıştır:

1. **Onboarding Ailesi eklendi:** `docs/onboarding/ilk-30-dakika.md` ve `rol-bazli-okuma-rehberi.md` haritaya dahil edildi
2. **AI entegrasyon dokümanı eklendi:** `ai-integration-documentation-plan.md` AI tooling ailesine ve okuma sırasına eklendi
3. **ADR tam dosya adları eklendi:** Bölüm 8.5'teki ADR-001→ADR-017 referansları tam dosya adı formatına (`ADR-XXX-description.md`) güncellendi
4. **Activity guardrail sayısı düzeltildi:** 28 → 29 (A-AI-FEAT eksikti)
5. **Belge bağımlılık haritası genişletildi:** 11.9 AI tooling zincirine `46`, `47`, `ai-integration-documentation-plan.md` eklendi; 11.10 Onboarding zinciri oluşturuldu
6. **Okuma sırası güncellendi:** 8.9 Onboarding ve 8.10 Operasyon bölümleri eklendi/yeniden numaralandı

## 18.3. Revizyon Notu (2026-04-02)

ADR genişlemesi ve yeni governance dokümanları sonrası aşağıdaki güncellemeler yapılmıştır:

1. **Canonical technical decision layer** ADR-001→ADR-019 olarak genişletildi
2. **2 yeni ADR eklendi:** ADR-018 (New Architecture Migration), ADR-019 (Local Storage/Offline-First)
3. **Governance ailesine eklendi:** `48-expo-sdk-upgrade-strategy.md`
4. **AI Guardrail sayıları güncellendi:** Domain guardrail'ler 25→26, Aktivite guardrail'ler 29→30
5. **Okuma sırası (8.5)** ADR-018 ve ADR-019 ile genişletildi, numaralandırma düzeltildi
6. **Tüm ADR-017 referansları** ADR-019 olarak güncellendi (5.4, 6, 9, 11.5, 19)

---

# 18.4. Otomatik Harita Doğrulama (2026-04-02 Eki)

Bu bölüm, doküman haritası ile `docs/` dizini arasındaki tutarlılığı otomatik olarak doğrulayan CI mekanizmasını tanımlar.

## 18.4.1. Doğrulama Mekanizması

CI pipeline'da `pnpm docs:validate-map` komutu çalıştırılarak aşağıdaki kontroller yapılır:

| Kontrol               | Açıklama                                                              | Sonuç              |
| --------------------- | --------------------------------------------------------------------- | ------------------ |
| Eksik doküman         | `docs/` dizininde dosya var ama haritada referans yok                 | ⚠️ Uyarı (warning) |
| Fazla referans        | Haritada referans var ama `docs/` dizininde dosya yok                 | ❌ Hata (error)    |
| ADR tutarlılığı       | `docs/adr/` dizinindeki ADR sayısı ile haritadaki ADR listesi         | ⚠️ Uyarı           |
| Guardrail tutarlılığı | `docs/ai-guardrails/` dizin içeriği ile haritadaki guardrail sayıları | ⚠️ Uyarı           |

## 18.4.2. Komut

```bash
# Doküman haritası doğrulama
pnpm docs:validate-map
```

Bu komut:

1. `docs/` dizinindeki tüm `.md` dosyalarını listeler.
2. `35-document-map.md` dosyasındaki referansları parse eder.
3. Eşleşmeyen dosyaları ve referansları raporlar.
4. Fazla referans (dosyası olmayan referans) varsa exit code 1 ile çıkar.

## 18.4.3. CI Entegrasyonu

- PR'da `docs/` dizininde değişiklik varsa doğrulama otomatik tetiklenir.
- Uyarılar PR comment olarak eklenir.
- Hatalar (fazla referans) CI'ı bloklar.
- Yeni doküman eklendiğinde haritaya ekleme hatırlatması yapılır.

## 18.4.4. Scope

Doğrulama kapsamı:

- `docs/` kök dizini ve tüm alt dizinleri
- `docs/adr/`, `docs/governance/`, `docs/quality/`, `docs/checklists/`, `docs/maps/`, `docs/onboarding/`, `docs/ai-guardrails/`
- `.md` uzantılı dosyalar

Kapsam dışı:

- `docs/audits/` (arşiv dosyaları, haritada yer almaz)
- `docs/design-system/` içindeki generated dosyalar
- `DESIGN.md` (Stitch çıktısı, haritada ayrı işlenir)

---

# 19. Fiziksel Dizin Yapısı Haritası

Bu bölüm, doküman setindeki kısa dosya adları ile gerçek dizin yollarını eşleştirir. Agent, yeni geliştirici veya CI aracı, bir dokümana ulaşmak istediğinde bu tabloya başvurmalıdır.

## 19.1. Dizin Yapısı

```
docs/
├── adr/                          # ADR'ler ve ADR şablonu
│   ├── 18-adr-template.md
│   ├── ADR-001-web-runtime-and-application-shell.md
│   ├── ADR-002-mobile-runtime-and-native-strategy.md
│   ├── ADR-003-monorepo-package-manager-and-build-orchestration.md
│   ├── ADR-004-state-management.md
│   ├── ADR-005-data-fetching-cache-and-mutation-model.md
│   ├── ADR-006-forms-and-validation.md
│   ├── ADR-007-styling-tokens-and-theming-implementation.md
│   ├── ADR-008-testing-stack.md
│   ├── ADR-009-observability-stack.md
│   ├── ADR-010-auth-session-and-secure-storage-baseline.md
│   ├── ADR-011-internationalization-baseline.md
│   ├── ADR-012-navigation-baseline.md
│   ├── ADR-013-push-notification-strategy.md
│   ├── ADR-014-deep-linking-and-universal-links.md
│   ├── ADR-015-ota-update-strategy.md
│   ├── ADR-016-in-app-purchase-and-subscription.md
│   ├── ADR-017-privacy-and-data-protection-framework.md
│   ├── ADR-018-new-architecture-migration-and-readiness-strategy.md
│   └── ADR-019-local-storage-and-offline-first-strategy.md
├── ai-guardrails/                # AI guardrail kuralları
│   ├── domain/                   # Domain guardrail'ler (26 adet)
│   │   ├── D-3RD-third-party.md
│   │   ├── D-A11-accessibility.md
│   │   ├── D-AIX-ai-intelligence-ux.md
│   │   ├── D-BIO-biometric-auth.md
│   │   ├── D-DAT-data-fetching.md
│   │   ├── D-DPL-deep-linking.md
│   │   ├── D-DSY-design-system.md
│   │   ├── D-ERR-error-empty-loading.md
│   │   ├── D-FIR-firebase-firestore.md
│   │   ├── D-FRM-forms-validation.md
│   │   ├── D-I18-internationalization.md
│   │   ├── D-MOT-motion-interaction.md
│   │   ├── D-NAV-navigation.md
│   │   ├── D-NTF-push-notification.md
│   │   ├── D-OBS-observability.md
│   │   ├── D-OFL-offline-local-storage.md
│   │   ├── D-PAY-payment-subscription.md
│   │   ├── D-PLT-platform-adaptation.md
│   │   ├── D-PRF-performance.md
│   │   ├── D-PRI-privacy-compliance.md
│   │   ├── D-SEC-security.md
│   │   ├── D-STA-state-management.md
│   │   ├── D-STY-styling.md
│   │   ├── D-TST-testing.md
│   │   ├── D-UIX-ui-ux-hig.md
│   │   └── D-VIS-visual-fidelity.md
│   └── activity/                 # Aktivite guardrail'ler (30 adet)
│       ├── A-3RD-third-party-integration.md
│       ├── A-AI-FEAT-ai-ml-feature.md
│       ├── A-ANALYTICS-event-tracking.md
│       ├── A-AUTH-auth-changes.md
│       ├── A-CONFIG-config-ci-changes.md
│       ├── A-DEEPLINK-deep-linking.md
│       ├── A-DEP-dependency-changes.md
│       ├── A-DOCS-documentation.md
│       ├── A-FIREBASE-firebase-operations.md
│       ├── A-FIX-bug-fix.md
│       ├── A-FORM-form-development.md
│       ├── A-MEDIA-file-media.md
│       ├── A-MIGRATION-migration.md
│       ├── A-NAV-navigation-changes.md
│       ├── A-NEW-API-new-api-integration.md
│       ├── A-NEW-COMP-new-component.md
│       ├── A-NEW-FEAT-new-feature.md
│       ├── A-NEW-HOOK-new-hook-utility.md
│       ├── A-NEW-SCRN-new-screen.md
│       ├── A-NOTIFICATION-push-notification.md
│       ├── A-OFFLINE-offline-support.md
│       ├── A-OTA-over-the-air-update.md
│       ├── A-PAYMENT-in-app-purchase.md
│       ├── A-PRIVACY-compliance.md
│       ├── A-REALTIME-realtime-push.md
│       ├── A-REFACTOR-refactoring.md
│       ├── A-RELEASE-release-prep.md
│       ├── A-SDK-UPGRADE-sdk-framework-upgrade.md
│       ├── A-STATE-state-changes.md
│       └── A-STYLE-styling-theming.md
├── architecture/                 # Mimari standartlar
│   ├── 06-application-architecture.md
│   ├── 07-module-boundaries-and-code-organization.md
│   ├── 08-navigation-and-flow-rules.md
│   ├── 09-state-management-strategy.md
│   ├── 10-data-fetching-cache-sync.md
│   └── 11-forms-inputs-and-validation.md
├── checklists/                   # Denetim ve tamamlanma
│   ├── 31-audit-checklist.md
│   └── 32-definition-of-done.md
├── design-system/                # Tasarım sistemi
│   ├── 03-ui-ux-quality-standard.md
│   ├── 04-design-system-architecture.md
│   ├── 05-theming-and-visual-language.md
│   ├── 22-design-tokens-spec.md
│   ├── 23-component-governance-rules.md
│   ├── 24-motion-and-interaction-standard.md
│   ├── 25-error-empty-loading-states.md
│   ├── 26-platform-adaptation-rules.md
│   ├── 33-visual-implementation-contract.md
│   ├── 34-hig-enforcement-strategy.md
│   └── 39-default-screens-and-components-spec.md
├── foundation/                   # Temel ilkeler
│   ├── 00-project-charter.md
│   ├── 01-working-principles.md
│   └── 02-product-platform-philosophy.md
├── governance/                   # Yönetişim ve politika
│   ├── 15-quality-gates-and-ci-rules.md
│   ├── 16-tooling-and-governance.md
│   ├── 17-technology-decision-framework.md
│   ├── 29-release-and-versioning-rules.md
│   ├── 30-contribution-guide.md
│   ├── 36-canonical-stack-decision.md
│   ├── 37-dependency-policy.md
│   ├── 38-version-compatibility-matrix.md
│   ├── 40-ai-workflow-and-tooling.md
│   ├── 41-ai-instruction-standards.md
│   ├── 42-branching-and-merge-strategy.md
│   ├── 44-exception-and-exemption-policy.md
│   ├── 45-boilerplate-project-boundary-contract.md
│   ├── 46-stitch-pipeline-spec.md
│   ├── 47-ai-guardrail-governance.md
│   ├── 48-expo-sdk-upgrade-strategy.md
│   ├── 49-upstream-sync-strategy.md
│   └── ai-integration-documentation-plan.md
├── implementation/               # Uygulama geçiş belgeleri
│   ├── 19-roadmap-to-implementation.md
│   ├── 20-initial-implementation-checklist.md
│   ├── 21-repo-structure-spec.md
│   └── 43-derived-project-creation-guide.md
├── maps/                         # Navigasyon
│   └── 35-document-map.md
├── onboarding/                   # Adaptasyon rehberleri
│   ├── ilk-30-dakika.md
│   └── rol-bazli-okuma-rehberi.md
├── operations/                   # Operasyonel prosedürler
│   └── runbook-and-incident-response.md
└── quality/                      # Kalite standartları
    ├── 12-accessibility-standard.md
    ├── 13-performance-standard.md
    ├── 14-testing-strategy.md
    ├── 27-security-and-secrets-baseline.md
    └── 28-observability-and-debugging.md
```

## 19.2. Kısa Ad → Tam Yol Eşleştirme Tablosu

Bu haritada dosyalar kısa numara/adlarıyla referans edilir. Aşağıdaki tablo kısa adı gerçek dizin yoluyla eşleştirir.

| Kısa Ad | Tam Yol                                                           |
| ------- | ----------------------------------------------------------------- |
| `00`    | `docs/foundation/00-project-charter.md`                           |
| `01`    | `docs/foundation/01-working-principles.md`                        |
| `02`    | `docs/foundation/02-product-platform-philosophy.md`               |
| `03`    | `docs/design-system/03-ui-ux-quality-standard.md`                 |
| `04`    | `docs/design-system/04-design-system-architecture.md`             |
| `05`    | `docs/design-system/05-theming-and-visual-language.md`            |
| `06`    | `docs/architecture/06-application-architecture.md`                |
| `07`    | `docs/architecture/07-module-boundaries-and-code-organization.md` |
| `08`    | `docs/architecture/08-navigation-and-flow-rules.md`               |
| `09`    | `docs/architecture/09-state-management-strategy.md`               |
| `10`    | `docs/architecture/10-data-fetching-cache-sync.md`                |
| `11`    | `docs/architecture/11-forms-inputs-and-validation.md`             |
| `12`    | `docs/quality/12-accessibility-standard.md`                       |
| `13`    | `docs/quality/13-performance-standard.md`                         |
| `14`    | `docs/quality/14-testing-strategy.md`                             |
| `15`    | `docs/governance/15-quality-gates-and-ci-rules.md`                |
| `16`    | `docs/governance/16-tooling-and-governance.md`                    |
| `17`    | `docs/governance/17-technology-decision-framework.md`             |
| `18`    | `docs/adr/18-adr-template.md`                                     |
| `19`    | `docs/implementation/19-roadmap-to-implementation.md`             |
| `20`    | `docs/implementation/20-initial-implementation-checklist.md`      |
| `21`    | `docs/implementation/21-repo-structure-spec.md`                   |
| `22`    | `docs/design-system/22-design-tokens-spec.md`                     |
| `23`    | `docs/design-system/23-component-governance-rules.md`             |
| `24`    | `docs/design-system/24-motion-and-interaction-standard.md`        |
| `25`    | `docs/design-system/25-error-empty-loading-states.md`             |
| `26`    | `docs/design-system/26-platform-adaptation-rules.md`              |
| `27`    | `docs/quality/27-security-and-secrets-baseline.md`                |
| `28`    | `docs/quality/28-observability-and-debugging.md`                  |
| `29`    | `docs/governance/29-release-and-versioning-rules.md`              |
| `30`    | `docs/governance/30-contribution-guide.md`                        |
| `31`    | `docs/checklists/31-audit-checklist.md`                           |
| `32`    | `docs/checklists/32-definition-of-done.md`                        |
| `33`    | `docs/design-system/33-visual-implementation-contract.md`         |
| `34`    | `docs/design-system/34-hig-enforcement-strategy.md`               |
| `35`    | `docs/maps/35-document-map.md`                                    |
| `36`    | `docs/governance/36-canonical-stack-decision.md`                  |
| `37`    | `docs/governance/37-dependency-policy.md`                         |
| `38`    | `docs/governance/38-version-compatibility-matrix.md`              |
| `39`    | `docs/design-system/39-default-screens-and-components-spec.md`    |
| `40`    | `docs/governance/40-ai-workflow-and-tooling.md`                   |
| `41`    | `docs/governance/41-ai-instruction-standards.md`                  |
| `42`    | `docs/governance/42-branching-and-merge-strategy.md`              |
| `43`    | `docs/implementation/43-derived-project-creation-guide.md`        |
| `44`    | `docs/governance/44-exception-and-exemption-policy.md`            |
| `45`    | `docs/governance/45-boilerplate-project-boundary-contract.md`     |
| `46`    | `docs/governance/46-stitch-pipeline-spec.md`                      |
| `47`    | `docs/governance/47-ai-guardrail-governance.md`                   |
| `48`    | `docs/governance/48-expo-sdk-upgrade-strategy.md`                 |
| `49`    | `docs/governance/49-upstream-sync-strategy.md`                    |

---

# 20. Kısa Sonuç

Bu dokümanın ana çıktısı şudur:

> Bu boilerplate’te dokümantasyon seti artık yalnızca standart ve checklist yığını değildir. `ADR-001` → `ADR-019` ile `37-dependency-policy.md` ve `38-version-compatibility-matrix.md` birlikte canonical technical decision layer’ı oluşturur; roadmap, checklist ve repo structure bu katmanı uygular; audit ve DoD belgeleri ise bu uygulamanın gerçekten doğru yapıldığını denetler. Document map, bu katmanlar arasındaki otorite ve okuma sırasını görünür kılan resmi navigasyon belgesidir.
