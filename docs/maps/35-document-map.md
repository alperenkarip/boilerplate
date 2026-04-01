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

| Dosya | Açıklama | Tür |
|---|---|---|
| `45-boilerplate-project-boundary-contract.md` | Boilerplate-project sınır sözleşmesi | Governance |
| `42-branching-and-merge-strategy.md` | Branching ve merge stratejisi | Process |
| `43-derived-project-creation-guide.md` | Türetilen proje oluşturma rehberi | Guide |
| `44-exception-and-exemption-policy.md` | İstisna ve muafiyet politikası | Governance

### Önemli Ayrım: Boilerplate Dökümanları vs Proje Dökümanları

Bu belge haritası yalnızca boilerplate seviyesindeki dökümanları kapsar. Boilerplate'ten türetilen her projenin kendine ait dökümanları `project/` dizininde yaşar. İki alan arasındaki ayrım kesindir:

- **`docs/`** → boilerplate standartları, kuralları, ADR'leri, audit ve governance belgeleri. Otorite kaynağı boilerplate'tir.
- **`project/`** → projeye özel kapsam, gereksinimler, spec'ler, kararlar. Otorite kaynağı proje ekibidir.

`project/` dizininin iç yapısı, dosya isimlendirmesi ve organizasyonu tamamen projeye bırakılır. Boilerplate bu dizinin içeriğine kural koymaz. Proje dökümanları boilerplate kararlarını referans alabilir ama canonical karar katmanını (ADR-001→011, 36, 37, 38) açamaz veya çelişemez — yalnızca daraltabilir veya somutlaştırabilir.

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
7. `ADR-001` → `ADR-011`
8. `36-canonical-stack-decision.md` *(canonical stack index / bridge belgesi)*
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

> **ADR-001 → ADR-011 + 36 + 37 + 38 birlikte canonical technical decision layer olarak yorumlanmalıdır.**

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
20. `ADR-001`
21. `ADR-002`
22. `ADR-003`
23. `ADR-004`
24. `ADR-005`
25. `ADR-006`
26. `ADR-007`
27. `ADR-008`
28. `ADR-009`
29. `ADR-010`
30. `ADR-011`
31. `36-canonical-stack-decision.md`
32. `37-dependency-policy.md`
33. `38-version-compatibility-matrix.md`

## 8.6. Uygulama geçiş belgeleri
34. `19-roadmap-to-implementation.md`
35. `20-initial-implementation-checklist.md`
36. `21-repo-structure-spec.md`
37. `39-default-screens-and-components-spec.md`

## 8.7. Derin uygulama standartları
37. `22-design-tokens-spec.md`
38. `23-component-governance-rules.md`
39. `24-motion-and-interaction-standard.md`
40. `25-error-empty-loading-states.md`
41. `26-platform-adaptation-rules.md`
42. `27-security-and-secrets-baseline.md`
43. `28-observability-and-debugging.md`
44. `29-release-and-versioning-rules.md`

## 8.8. AI workflow ve talimat standartları
45. `40-ai-workflow-and-tooling.md`
46. `41-ai-instruction-standards.md`
47. `46-stitch-pipeline-spec.md`

## 8.9. Operasyon ve denetim
48. `30-contribution-guide.md`
49. `31-audit-checklist.md`
50. `32-definition-of-done.md`
51. `33-visual-implementation-contract.md`
52. `34-hig-enforcement-strategy.md`
53. `35-document-map.md`

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
- `ADR-001` → `ADR-011`
- `36-canonical-stack-decision.md` *(canonical stack index / bridge)*
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
- İlgili SPEC varsa: `.moai/specs/SPEC-XXX.md`
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
- `ADR-001` → `ADR-011`
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

Bu zincir operasyonel kalite zinciriyle (11.7) aynı katmandadır.
Talimat dosyaları (CLAUDE.md, AGENTS.md, DESIGN.md, `.moai/config/`) bu dokümanların çıktılarıdır ve hiçbir boilerplate dokümanını geçersiz kılamaz.

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

---

# 19. Kısa Sonuç

Bu dokümanın ana çıktısı şudur:

> Bu boilerplate’te dokümantasyon seti artık yalnızca standart ve checklist yığını değildir. `ADR-001` → `ADR-011` ile `37-dependency-policy.md` ve `38-version-compatibility-matrix.md` birlikte canonical technical decision layer’ı oluşturur; roadmap, checklist ve repo structure bu katmanı uygular; audit ve DoD belgeleri ise bu uygulamanın gerçekten doğru yapıldığını denetler. Document map, bu katmanlar arasındaki otorite ve okuma sırasını görünür kılan resmi navigasyon belgesidir.
