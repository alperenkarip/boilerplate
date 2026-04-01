# 19-roadmap-to-implementation.md

## Doküman Kimliği

- **Doküman adı:** Roadmap to Implementation
- **Dosya adı:** `19-roadmap-to-implementation.md`
- **Doküman türü:** Roadmap / sequencing / delivery readiness document
- **Durum:** Accepted
- **Tarih:** 2026-03-31
- **Kapsam:** Bu belge, artık yazılmış foundation dokümanları, çekirdek ADR seti, dependency policy ve version compatibility matrix sonrası; gerçek repo bootstrap ve controlled boilerplate implementation sürecine hangi sırayla geçileceğini tanımlar. Belge, “henüz düşünme aşaması” ile “artık koda geçiş için hazırız” eşiği arasındaki farkı ve bundan sonraki zorunlu geçiş kapılarını netleştirir.
- **Bağlı olduğu üst dokümanlar:**
  - `00-project-charter.md`
  - `01-working-principles.md`
  - `02-product-platform-philosophy.md`
  - `03-ui-ux-quality-standard.md`
  - `04-design-system-architecture.md`
  - `06-application-architecture.md`
  - `15-quality-gates-and-ci-rules.md`
  - `16-tooling-and-governance.md`
  - `17-technology-decision-framework.md`
  - `18-adr-template.md`
  - `37-dependency-policy.md`
  - `38-version-compatibility-matrix.md`
  - `ADR-001` → `ADR-017`
- **Doğrudan etkileyeceği dokümanlar:**
  - `20-initial-implementation-checklist.md`
  - `21-repo-structure-spec.md`
  - `30-contribution-guide.md`
  - `31-audit-checklist.md`
  - `32-definition-of-done.md`
  - `35-document-map.md`

---

# 1. Bu Dokümanın Revize Edilme Nedeni

Önceki versiyon büyük ölçüde genel document-first → implementation geçiş sırasını anlatıyordu.  
Şimdi proje şu aşamaya gelmiştir:

- ana foundation belgeleri yazıldı,
- runtime ve mimari yönleri yazıldı,
- kalite ve governance belgeleri yazıldı,
- çekirdek ADR seti tamamlandı,
- dependency policy yazıldı,
- compatibility matrix yazıldı,
- bunların ışığında kritik 5 operasyonel belge revize edilmektedir.

Bu nedenle bu belge artık yalnızca “ileride bir gün koda nasıl geçeriz?” metni değildir.  
Artık bu belge:

> **Mevcut doküman seti tamamlandıktan sonra, bundan hemen sonra hangi işlerin hangi sırayla yapılacağını ve hangi kapıdan geçmeden repo bootstrap ile gerçek boilerplate implementasyonuna girilemeyeceğini tanımlayan operasyonel yol haritasıdır.**

---

# 2. Amaç

Bu dokümanın amacı, “artık yeterince konuştuk, koda başlayalım” refleksini reddedip;  
**tamamlanmış karar katmanını kontrollü şekilde repo ve implementation katmanına indiren aşamalı geçiş planını** tanımlamaktır.

Bu belge şu sorulara net cevap verir:

1. Şu an bulunduğumuz nokta hangi aşamadır?
2. Hangi belgeler artık kapanmış kabul edilir?
3. Hangi belgeler revize edilmeden koda geçilemez?
4. Revizyon sonrası hangi audit yapılmalıdır?
5. Repo bootstrap hangi sırayla başlamalıdır?
6. İlk gerçek implementation ne zaman meşru hale gelir?
7. Vertical slice ne zaman kurulmalıdır?
8. Hangi aşamada “hala kod yazmak erken” denmelidir?

---

# 3. Mevcut Durumun Net Tespiti

Bu proje artık erken yön arama aşamasında değildir.  
Şu katmanlar artık büyük ölçüde kapanmıştır:

## 3.1. Foundation katmanı
- charter
- working principles
- cross-platform product yaklaşımı
- UI/UX kalite yönü
- design system yönü
- a11y / performance / governance mantığı

## 3.2. Runtime ve mimari karar katmanı
- application architecture
- module boundaries
- navigation/state/data/forms yönleri

## 3.3. Canonical karar katmanı
- `ADR-001` → `ADR-017`

## 3.4. Governance tamamlayıcıları
- `37-dependency-policy.md`
- `38-version-compatibility-matrix.md`

### Sonuç
Artık eksik olan şey “hangi stack’i seçeceğiz?” değildir.  
Eksik olan şey:

- kararların kalan operasyonel belgelere işlenmesi,
- tam tutarlılık denetimi,
- repo bootstrap ve implementation sırasının somutlaştırılmasıdır.

---

# 4. Temel Tez

Bu proje kapsamında temel tez şudur:

> Koda geçiş için gerekli asıl eşik artık teknoloji seçimi değil, karar senkronizasyonu ve repo-uygulanabilirlik eşiğidir. Yani önce operasyonel belgeler yeni karar setiyle hizalanmalı, sonra bütün set sert bir tutarlılık denetiminden geçirilmeli, ancak ondan sonra controlled bootstrap başlatılmalıdır.

Bu tez şu sonuçları doğurur:

1. ADR seti bitti diye doğrudan repo kurmak doğru değildir.
2. Revize edilmemiş operasyonel belgeler implementasyonda çelişki üretir.
3. Repo bootstrap, belge senkronizasyonundan sonra gelir.
4. Vertical slice, bootstrap’tan hemen sonra ama checklist’e bağlı kurulmalıdır.
5. İlk audit olmadan “foundation başarılı” denemez.

---

# 5. Güncellenmiş Ana Aşamalar

Bu proje için artık geçerli olan sıra aşağıdaki gibidir:

1. Foundation completion
2. Runtime and governance completion
3. Canonical decision closure
4. Dependency and compatibility closure
5. Document synchronization
6. Full consistency audit
7. Repo bootstrap
8. Quality baseline activation
9. Design system and theme foundation
10. App shells
11. Navigation + state/data/form/auth/i18n/observability foundations
12. Sample vertical slice
13. First audit and stabilization

Bu belge esas olarak 5. adımdan sonraki geçişi yönetir.

---

# 6. Aşama 1 — Foundation Completion

## 6.1. Amaç
Üst seviye çalışma rejimi ve ürün yaklaşımının kapanmış olması.

## 6.2. Zaten tamamlanmış kabul edilen ana alanlar
- `00-project-charter.md`
- `01-working-principles.md`
- `02-product-platform-philosophy.md`
- `03-ui-ux-quality-standard.md`
- `04-design-system-architecture.md`
- `05-theming-and-visual-language.md`

## 6.3. Bu aşama kapanmadan neden koda geçilmez?
Çünkü kalite eşiği ve cross-platform ürünü nasıl düşündüğümüz netleşmeden atılan kod, foundation kararlarını fiilen kodla verir.

---

# 7. Aşama 2 — Runtime and Governance Completion

## 7.1. Amaç
Mimari ve runtime davranış yönünü yeterince netleştirmek.

## 7.2. Ana belgeler
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

## 7.3. Yorum
Bu aşama olmadan repo structure bile spekülatif kalır.

---

# 8. Aşama 3 — Canonical Decision Closure

## 8.1. Amaç
Artık temel teknoloji ve mimari taşıyıcıların fiilen kilitlenmesi.

## 8.2. Bu aşamada tamamlanan set
- `ADR-001` → `ADR-017`

## 8.3. Sonuç
Aşağıdaki alanlar artık exploratory değil:
- web runtime
- mobile runtime
- monorepo/workspace
- state
- data
- forms
- styling
- testing
- observability
- auth/session
- i18n

Bu çok kritik dönüm noktasıdır.  
Bu aşamadan sonra “alternatifleri de düşünelim” dili ancak sınırlı alanlarda meşrudur.

---

# 9. Aşama 4 — Dependency and Compatibility Closure

## 9.1. Amaç
Karar setini paket ve sürüm yönetişimiyle bağlamak.

## 9.2. Tamamlanan belgeler
- `37-dependency-policy.md`
- `38-version-compatibility-matrix.md`

## 9.3. Bu aşamanın önemi
Artık yalnızca “neyi seçtik?” değil, şunlar da kapanmıştır:
- neyi alamayız?
- hangi sürüm hatları birlikte meşru?
- hangi upgrade zinciri hangi sırayı izler?

Bu aşama olmadan repo bootstrap erken olurdu.

---

# 10. Aşama 5 — Document Synchronization

## 10.1. Amaç
Önceden yazılmış ama artık eskimiş operasyonel belgeleri yeni karar setiyle senkronize etmek.

## 10.2. Revize edilmesi gereken ana belgeler
- `17-technology-decision-framework.md`
- `19-roadmap-to-implementation.md`
- `20-initial-implementation-checklist.md`
- `21-repo-structure-spec.md`
- `35-document-map.md`

## 10.3. Neden bunlar?
Çünkü bunlar:
- karar alma,
- koda geçiş sırası,
- repo fiziksel yapısı,
- belge otorite haritası
üzerinde belirleyici rol taşır.

Bunlar eski halde kalırsa:
- eski açık karar alanları var sanılır,
- repo topolojisi soyut kalır,
- checklist teknoloji keşfi yapmaya devam eder,
- document map authority zincirini yanlış gösterir.

## 10.4. Bu aşamanın çıktısı
Yeni canonical katmanla uyumlu 5 revize belge.

---

# 11. Aşama 6 — Full Consistency Audit

## 11.1. Amaç
Artık bütün belge setinin tek sistem gibi çalışıp çalışmadığını sert biçimde doğrulamak.

## 11.2. Denetlenecek ana eksenler

### 11.2.1. Otorite ve çelişki denetimi
- bir belge diğerini sessizce boşa düşürüyor mu?
- kapalı karar alanları başka yerde açık gibi konuşuluyor mu?

### 11.2.2. Terminoloji denetimi
- aynı kavram farklı yerlerde farklı isimle mi geçiyor?
- “shared”, “platform-specific”, “feature”, “core”, “shell”, “primitive”, “pattern” gibi terimler tutarlı mı?

### 11.2.3. Karar boşluğu denetimi
- hâlâ kritik ama kapatılmamış alan var mı?
- mobile E2E vendor, analytics vendor, exact auth provider gibi sınırlı açık alanlar dışında kritik boşluk kalmış mı?

### 11.2.4. Repo-uygulanabilirlik denetimi
- repo structure spec checklist’e bağlanıyor mu?
- compatibility matrix ile repo bootstrap sırası çelişiyor mu?

### 11.2.5. Operational readiness denetimi
- contribution, DoD, audit, checklist, roadmap birbiriyle uyumlu mu?

## 11.3. Bu aşama kapanmadan neden repo bootstrap başlamaz?
Çünkü tutarsız belge seti ile kurulmuş repo, birkaç gün sonra belgeye göre değil fiili koda göre yön almaya başlar.

---

# 12. Aşama 7 — Repo Bootstrap

## 12.1. Amaç
Karar verilmiş yapıyı fiziksel repo topolojisine dönüştürmek.

## 12.2. Bu aşamada artık keşif yapılmaz
Bu aşamada yapılacak iş:
- monorepo kurmak,
- apps/packages/docs/tooling/scripts omurgasını kurmak,
- root config yüzeyini kurmak,
- dependency ve version track’i uygulamak,
- package ailelerini somutlaştırmaktır.

## 12.3. Repo bootstrap ne değildir?
- feature geliştirme
- ekran üretme
- random dependency deneme
- form veya state yönünü keşfetme

## 12.4. Repo bootstrap çıktıları
- çalışan workspace
- canonical Node/pnpm/turbo baseline
- root config ve quality baseline’ın ilk ayağı
- docs/adr structure
- apps/web ve apps/mobile boş ama doğru shell zemini
- initial packages

---

# 13. Aşama 8 — Quality Baseline Activation

## 13.1. Amaç
Kod üretimi büyümeden önce kuralları çalıştırmak.

## 13.2. Kurulması gereken minimum şeyler
- typecheck
- lint
- boundary checks
- basic test wiring
- CI first gate
- dependency hygiene discipline

## 13.3. Kural
Quality gates sonradan eklenmez; erken çalışır.

---

# 14. Aşama 9 — Design System and Theme Foundation

## 14.1. Amaç
UI implementasyonu başlamadan token/theme/runtime zemini kurmak.

## 14.2. Gerekli ana iş kalemleri
- design tokens package
- semantic token mapping
- web theme runtime
- mobile theme runtime
- primitive surface foundations

## 14.3. Kural
Token/theme foundation olmadan gerçek UI yüzeyi büyütülmez.

---

# 15. Aşama 10 — App Shells

## 15.1. Amaç
Web ve mobile uygulama kabuklarını doğru provider ve runtime zinciriyle ayağa kaldırmak.

## 15.2. İçerik
- app entry
- theme wiring
- query client wiring
- auth/session shell wiring
- i18n bootstrapping
- error boundary / Sentry baseline
- navigation root entry

---

# 16. Aşama 11 — Navigation + State/Data/Form/Auth/I18n/Observability Foundations

## 16.1. Amaç
Shell’leri gerçek ürün davranışı için hazır hale getirmek.

## 16.2. Ana alt alanlar
- navigation root model
- Zustand summary stores
- ADR-005 kararı doğrultusunda fetch-first wiring veya TanStack Query wiring
- RHF + Zod foundation
- auth boundary / session restore baseline
- i18next bootstrapping
- observability abstraction + Sentry binding
- secure storage adapter
- loading/error/empty state surfaces

## 16.3. Kural
Bu aşama feature yazarken keşfedilmez.  
Önce foundation kurulmalıdır.

---

# 17. Aşama 12 — Sample Vertical Slice

## 17.1. Amaç
Tüm teorik foundation’ın pratikte birlikte çalıştığını gösterecek tek gerçek örnek dilimi kurmak.

## 17.2. Minimum içerik
Vertical slice mümkün olduğunca şu yüzeylerin çoğunu içermelidir:
- route entry
- query fetch + loading/error/empty/success
- one form interaction
- one mutation
- design system primitives/components
- auth-aware or session-aware shell behavior
- i18n copy
- observability signal
- test coverage
- a11y değerlendirmesi

## 17.3. Kural
Vertical slice statik demo ekranı değildir.  
Sistemin beraber çalıştığını kanıtlayan küçük ama gerçek akıştır.

### 17.4. Ekran Referansı

Vertical slice'ın somut ekran referansı `39-default-screens-and-components-spec.md` Bölüm 10'da tanımlanmıştır: List Screen (S25), Detail Screen (S26) ve Create/Edit Form Screen (S27). Bu üç ekran, tüm katmanların (query, state, form, component, a11y, i18n, observability) birlikte çalıştığını kanıtlayan minimum referans implementasyondur.

---

# 18. Aşama 13 — First Audit and Stabilization

## 18.1. Amaç
İlk vertical slice sonrası sistemin gerçekten çalışıp çalışmadığını sert biçimde test etmek.

## 18.2. Denetlenecek ana alanlar
- repo placement doğruluğu
- boundary ihlali
- token kaçakları
- theme/runtime tutarlılığı
- query/store/form ayrımı
- auth cleanup ve secure storage kullanımı
- i18n copy disiplini
- observability noise
- test ve CI sinyal kalitesi
- web/mobile parity

## 18.3. Çıktı
- küçük refactor’lar
- rule sertleştirmeleri
- gerekiyorsa yeni ADR
- gerekiyorsa checklist veya DoD güncellemesi

---

# 19. Bugün İtibarıyla Doğru Sonraki Adım

Bu belge revizyonu tamamlandıktan sonra doğru sıra şudur:

1. Revize edilen 5 belgenin son okunması
2. Tam belge seti için sert consistency audit
3. Gerekirse son küçük doküman düzeltmeleri
4. Repo bootstrap planının net kilitlenmesi
5. Controlled implementation checklist üzerinden fiziksel başlangıç

Yani bugün itibarıyla **doğru sonraki teknik aşama**:
> **full consistency audit → repo bootstrap**

---

# 20. Bu Noktada Hâlâ Koda Geçmeyi Engelleyen Durumlar

Aşağıdaki durumlar varsa hâlâ koda geçmek erkendir:

1. Revize edilen 5 belge ile ADR/dependency/compatibility seti arasında çelişki varsa
2. Repo structure hâlâ exact package listesi ve placement mantığı açısından belirsizse
3. Initial implementation checklist hâlâ “ne seçelim” dilinde kalıyorsa
4. Document map authority zincirini yanlış gösteriyorsa
5. Contribution/DoD/Audit tarafı yeni canonical karar setine göre senkron değilse

---

# 21. Hazır Olma Kapıları

Bu aşamadan sonra geçilecek kapılar artık şu şekilde yorumlanmalıdır:

## 21.1. Gate A — Decision Completeness
ADR seti + dependency policy + compatibility matrix tamam mı?

## 21.2. Gate B — Document Synchronization
Operasyonel belgeler bu setle hizalandı mı?

## 21.3. Gate C — Consistency Audit
Bütün set birlikte okunduğunda çelişki kalmadı mı?

## 21.4. Gate D — Bootstrap Readiness
Repo bootstrap için exact sıra ve topology net mi?

## 21.5. Gate E — Controlled Implementation Readiness
Checklist artık keşif değil, uygulama planı mı?

Bu kapılar geçilmeden “başlayalım” denmez.

---

# 22. Bu Belgenin `20-initial-implementation-checklist.md` ile İlişkisi

Bu belge sıra ve geçiş mantığını belirler.  
Checklist ise bu sıralamayı operasyonel görevlere çevirir.

## 22.1. Bu belge neyi söyler?
- önce ne gelir
- ne bloklayıcıdır
- ne zaman bir faz kapanır

## 22.2. Checklist neyi söyler?
- hangi iş yapılacak
- done kriteri ne
- hangi teknik adım hangi sırayla uygulanacak

Bu iki belge birbirinin yerine geçmez.

---

# 23. Bu Belgenin `21-repo-structure-spec.md` ile İlişkisi

Bu belge repo bootstrap’ın ne zaman meşru olduğunu söyler.  
Repo structure spec ise fiziksel topolojiyi exact olarak tarif eder.

Roadmap olmadan repo structure erken kalır.  
Repo structure olmadan roadmap soyut kalır.

---

# 24. Yanlış Sıra Anti-Pattern’leri

Aşağıdaki davranışlar artık doğrudan zayıf kabul edilir:

1. ADR seti tamamlandı diye doğrudan repo kurmak
2. 37/38 yazıldı diye compatibility audit yapmadan dependency eklemek
3. Repo bootstrap sırasında hâlâ teknoloji keşfetmek
4. Checklist aşamasında ikinci state/query/form/styling tool düşünmek
5. Repo structure belirsizken feature package’ları açmak
6. Vertical slice’tan önce büyük component kütüphanesi büyütmek
7. First audit olmadan foundation’ı “kanıtlandı” sanmak

---

# 25. Onay Kriterleri

Bu doküman yeterli kabul edilir eğer:

1. Mevcut proje durumunu doğru seviyede tanımlıyorsa
2. ADR + dependency + compatibility sonrası yeni doğru sırayı netleştiriyorsa
3. Document synchronization ve consistency audit aşamalarını açıkça zorunlu kılıyorsa
4. Repo bootstrap ile controlled implementation arasındaki farkı görünür kılıyorsa
5. Vertical slice ve first audit’in doğru konumunu netleştiriyorsa
6. Bu belge artık gerçek geçiş planı olarak kullanılabilecek netlikteyse

---

# 26. Kısa Sonuç

Bu dokümanın ana çıktısı şudur:

> Bu boilerplate için teknoloji ve mimari yön arama aşaması büyük ölçüde kapanmıştır. Bundan sonraki doğru sıra; operasyonel belgelerin senkronizasyonu, tam tutarlılık denetimi, repo bootstrap, quality baseline activation, design system/runtime foundations, sample vertical slice ve first audit şeklindedir. ADR seti bitti diye doğrudan koda geçmek doğru değildir; önce sistemin belge katmanı tek parça çalışır hale gelmelidir.
