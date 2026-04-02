# 16-tooling-and-governance.md

## Doküman Kimliği

- **Doküman adı:** Tooling and Governance
- **Dosya adı:** `16-tooling-and-governance.md`
- **Doküman türü:** Governance / tooling strategy / enforcement operations document
- **Durum:** Accepted
- **Kapsam:** Bu boilerplate kapsamında kaliteyi, mimari sınırları, design system disiplinini, erişilebilirlik minimumlarını, test stratejisini ve dokümantasyon-first çalışma modelini ayakta tutacak araçları, kural setlerini, denetim akışlarını, exception mekanizmasını, review disiplinini ve operasyonel governance modelini tanımlar.
- **Bağlı olduğu üst dokümanlar:**
  - `00-project-charter.md`
  - `01-working-principles.md`
  - `04-design-system-architecture.md`
  - `06-application-architecture.md`
  - `07-module-boundaries-and-code-organization.md`
  - `12-accessibility-standard.md`
  - `14-testing-strategy.md`
  - `15-quality-gates-and-ci-rules.md`
- **Doğrudan etkileyeceği dokümanlar:**
  - `17-technology-decision-framework.md`
  - `18-adr-template.md`
  - `21-repo-structure-spec.md`
  - `22-design-tokens-spec.md`
  - `23-component-governance-rules.md`
  - `30-contribution-guide.md`
  - `31-audit-checklist.md`
  - `32-definition-of-done.md`
  - `34-hig-enforcement-strategy.md`
  - `35-document-map.md`

---

# 1. Amaç

Bu dokümanın amacı, boilerplate kapsamında daha önce tanımlanmış standartların yalnızca yazılı metin olarak kalmamasını; günlük geliştirme pratiği, araç zinciri, review akışı, denetim sistemi ve istisna yönetimi yoluyla **işletilebilir** hale gelmesini sağlamaktır.

Bu belge şu sorulara net cevap verir:

1. Tooling bu projede ne işe yarar?
2. Governance neden yalnızca ekip disiplini değil, sistem disiplini olarak ele alınmalıdır?
3. Hangi standartlar araçlarla enforce edilmelidir, hangileri audit/review ile korunmalıdır?
4. Lint, typecheck, boundary enforcement, design system kuralları, a11y sinyalleri, test altyapısı ve CI nasıl aynı governance sistemine bağlanmalıdır?
5. Exception nasıl verilir, nasıl takip edilir, ne zaman kaldırılır?
6. Review ve CI birbirinin yerini almadan nasıl birlikte çalışır?
7. Dokümantasyon-first yaklaşımı operasyonel olarak nasıl korunur?
8. Hangi tooling ve governance davranışları doğrudan zayıf kabul edilir?

Bu belge, belirli tool isimlerini dayatmaz.
Ama hangi problem alanı için ne tür bir araç veya kontrol mekanizması gerektiğini tanımlar.
Araç seçimi daha sonra yapılabilir; fakat governance modeli şimdiden sabitlenmelidir.

---

# 2. Neden Bu Doküman Gerekli

Bir projede iyi dokümanlar olabilir.
İyi niyetli geliştiriciler de olabilir.
Ama governance yoksa kalite zamanla bozulur.

Bu bozulma genelde şu sırayla olur:

1. İlk feature’lar dikkatle yazılır.
2. Sonra zaman baskısı artar.
3. Bazı kurallar “şimdilik” esnetilir.
4. Aynı istisna birkaç kez tekrar eder.
5. Review yapan kişilere göre standart değişir.
6. Design system delinir.
7. Boundary ihlalleri normalleşir.
8. A11y ve test eksikleri birikmeye başlar.
9. Ekip, dokümanların gerçek değil teorik olduğunu hissetmeye başlar.
10. Sonunda yazılı standart ile gerçek repo davranışı birbirinden kopar.

Bu proje kapsamında bu kopuş kabul edilmez.

Tooling ve governance bu yüzden vardır:
- geliştiriciyi cezalandırmak için değil,
- kaliteyi kişisel hafızaya bırakmamak için,
- doğru davranışı kolaylaştırmak,
- yanlış davranışı görünür kılmak,
- kritik ihlalleri erken durdurmak,
- istisnaları kayıt altına almak,
- kaliteyi sürdürülebilir hale getirmek için.

---

# 3. Temel Tez

Bu proje kapsamında temel tez şudur:

> Yüksek kalite standardı, yalnızca iyi mimari ve iyi niyetli geliştirme ile korunamaz; standartları günlük geliştirme akışına gömen, ihlalleri erken sinyalleyen, kritik bozulmaları durduran ve istisnaları izlenebilir hale getiren tooling ve governance sistemi gerekir.

Bu tez şu sonuçları doğurur:

1. Doküman varsa enforcement da olmalıdır.
2. Enforcement mümkün değilse audit/checklist mekanizması olmalıdır.
3. Review, mekanik hataları tek başına avlamak zorunda kalmamalıdır.
4. Tooling geliştiriciye yardım etmeli, ama kuralları sulandırmamalıdır.
5. Exception kültürü kayıtlı, sınırlı ve süreli olmalıdır.
6. Governance olmadan design system ve mimari sınırlar kalıcı korunamaz.

---

# 4. Tooling ve Governance Ayrımı

## 4.1. Tooling nedir?

Tooling, proje kalitesini destekleyen teknik araçlar ve otomasyon yüzeyleridir.

Örnek:
- type checker
- linter
- formatter
- import boundary checker
- test runner
- CI pipelines
- bundle / build tools
- a11y check araçları
- kod üretim / validation script’leri
- commit hooks
- code ownership destekleri
- audit script’leri

## 4.2. Governance nedir?

Governance, kuralların nasıl işletileceğini belirleyen süreç, sorumluluk, review, exception, approval ve denetim modelidir.

Örnek:
- hangi ihlal blocker sayılır
- exception kim verebilir
- hangi değişiklik ADR gerektirir
- hangi alanlar checklist ile denetlenir
- hangi review kriteri zorunludur
- hangi doküman güncellemesi hangi tip değişiklikte beklenir

## 4.3. Neden ayrım önemli?

Tooling olmadan governance soyut kalır.
Governance olmadan tooling anlamsız komut listesine dönüşür.

Doğru sistem şu olur:
- tooling kuralları uygular veya sinyal üretir
- governance bu sinyallerin nasıl değerlendirileceğini ve nasıl işletileceğini tanımlar

---

# 5. Governance Hedefleri

Bu boilerplate kapsamında governance sisteminin ana hedefleri şunlardır:

## 5.1. Standartların gerçek hayatta yaşamasını sağlamak

Dokümanlarda yazılı olan kuralların repo davranışına yansıması gerekir.

## 5.2. Karar tekrarını azaltmak

Sürekli aynı mimari, style, a11y, review ve boundary tartışmalarını tekrar tekrar yaşamamak için.

## 5.3. Sinyal kalitesini yükseltmek

Sorunları:
- geç değil,
- anlaşılır biçimde,
- doğru şiddet seviyesinde,
- bağlamı belli şekilde
görmek gerekir.

## 5.4. İstisna kültürünü kontrol altına almak

İstisna kaçınılmaz olabilir.
Ama sessiz ve sınırsız olmamalıdır.

## 5.5. Kaliteyi kişiselleşmekten çıkarmak

“Şu reviewer dikkatliyse geçmez, diğeri görmeyebilir” kültürü governance başarısızlığıdır.

## 5.6. Geliştirici deneyimini bozmak değil, yönlendirmek

Governance sisteminin amacı üretimi felç etmek değil; doğru davranışı varsayılan hale getirmektir.

---

# 6. Governance Alanları

Bu proje kapsamında governance şu alanları kapsar:

1. Code quality governance
2. Architectural governance
3. Design system governance
4. Accessibility governance
5. Testing governance
6. Documentation governance
7. Review governance
8. Exception governance
9. Release / merge governance
10. Audit governance

Bu alanlar birbirinden bağımsız işletilmemelidir.

### Enforcement Config Pack

Aşağıdaki enforcement araçları boilerplate starter config'inde tanımlanmıştır:

- **Token tüketim kontrolü:** ESLint custom rule — hardcoded renk, spacing, font değeri tespiti
- **Boundary enforcement:** Import yönü kontrolü — `packages/` → `apps/` yasak
- **A11y lint:** `eslint-plugin-jsx-a11y` + React Native a11y kuralları
- **Secret scanning:** Pre-commit hook ile hassas veri tespiti
- **Exception tracking:** `exceptions/` dizini + CI scheduled audit — `44-exception-and-exemption-policy.md`

Bu araçların CI entegrasyonu `tooling/ci/ci.yml` ve `tooling/ci/scheduled-audit.yml` workflow dosyalarında tanımlanmıştır.

---

# 7. Tooling Katmanları

Bu boilerplate kapsamında tooling en az şu katmanlarda düşünülmelidir:

1. Editor-time tooling
2. Local development tooling
3. Pre-commit / pre-push tooling
4. CI-time tooling
5. Scheduled / audit tooling
6. Reporting / diagnostics tooling

Bu ayrım önemlidir.
Çünkü her kontrol aynı anda ve aynı yerde çalıştırılmamalıdır.

---

# 8. Editor-Time Tooling

## 8.1. Tanım

Kod yazarken geliştiriciye anlık sinyal veren araçlardır.

## 8.2. Amaç

- hatayı erkenden göstermek
- yanlış pattern’i yazıldığı anda fark ettirmek
- token / style / import / type problemlerini bekletmeden görünür kılmak

## 8.3. Örnek ihtiyaç alanları

- type errors
- lint hints
- forbidden import uyarıları
- a11y prop eksikleri
- style / design system ihlali sinyalleri
- formatting guidance

## 8.4. Kural

Editor-time tooling mümkün olduğunca geliştiriciye hızlı ve açıklayıcı olmalıdır.
Sinyal çok gürültülü ve belirsizse ekip onu görmezden gelmeye başlar.

## 8.5. Zayıf davranışlar

- editor sinyallerinin çalışmaması
- local ile CI kurallarının farklı olması
- aynı kuralın editor’de bir şey, CI’da başka şey söylemesi
- sürekli false positive üreten uyarılar

---

# 9. Local Development Tooling

## 9.1. Tanım

Geliştirici kendi makinesinde, commit veya push öncesi doğrulama yapabilmelidir.

## 9.2. Neden önemli?

Çünkü her şeyi CI’a bırakmak:
- yavaş geri bildirim,
- gereksiz bekleme,
- daha fazla kırık PR
üretir.

## 9.3. Beklenen alanlar

- hızlı lint
- hızlı typecheck
- ilgili test subset’leri
- sınır ihlali kontrolleri
- dev audit script’leri
- package / module health kontrolleri

## 9.4. Kural

Local tooling:
- hızlı olmalı
- anlamlı olmalı
- geliştiriciye “neden fail olduğunu” net söylemeli

---

# 10. Pre-Commit ve Pre-Push Tooling

## 10.1. Neden ayrı düşünülmeli?

Çünkü commit anında çalışan kontrol ile push anında çalışan kontrol aynı maliyeti taşımamalıdır.

## 10.2. Pre-commit için güçlü adaylar

- formatting
- staged lint subset
- çok hızlı rule checks
- basit static verification

## 10.3. Pre-push için güçlü adaylar

- daha geniş lint
- targetlı typecheck
- ilgili test grupları
- hızlı boundary checks

## 10.4. Kural

Pre-commit çok ağır olursa ekip bypass etmeye başlar.
Pre-push tamamen boş olursa kalite local’de korunamaz.

---

# 11. CI-Time Tooling

## 11.1. Rolü

CI, resmi doğrulama yüzeyidir.
Local sinyallerin yerini almaz ama nihai kapı işlevi görür.

## 11.2. Temel alanlar

- tam typecheck
- resmi lint kuralları
- boundary / import checks
- test koşuları
- build sanity
- güvenlik hijyeni kontrolleri
- gerekiyorsa a11y / visual / perf sinyalleri
- raporlama

## 11.3. Kural

CI:
- deterministik olmalı
- anlamlı hata mesajı vermeli
- gürültü yerine sinyal üretmeli
- aşırı yavaş olmamalı
- ama kritik bozulmaları da kaçırmamalı

---

# 12. Scheduled / Audit Tooling

## 12.1. Neden gerekir?

Her kontrol her PR’da çalıştırılmak zorunda değildir.
Bazı daha ağır veya trend odaklı kontroller periyodik çalışabilir.

## 12.2. Örnek alanlar

- daha ağır a11y taramaları
- dependency health scan
- stale exception raporları
- baseline drift kontrolü
- bundle trend raporları
- rule adoption raporları
- documentation drift sinyalleri

## 12.3. Kural

Scheduled tooling, kaliteyi görünür kılan uzun vadeli sinyal yüzeyi olarak düşünülmelidir.

---

# 13. Reporting ve Diagnostics Tooling

## 13.1. Neden önemli?

Kötü raporlanan kural, iyi kural değildir.
Geliştirici neyin bozulduğunu, neden bozulduğunu ve ne yapması gerektiğini anlamalıdır.

## 13.2. Raporlama özellikleri

- ihlalin hangi dosyada olduğu
- hangi kuralın kırıldığı
- neden riskli olduğu
- mümkünse düzeltme yönü
- blocker/major/minor sınıfı
- gerekiyorsa doküman referansı

## 13.3. Kural

“failed” yazan ama nedenini anlatmayan sistem uzun vadede güven kaybı üretir.

---

# 14. Architectural Governance

## 14.1. Amaç

Mimari sınırların zamanla delinmesini engellemek.

## 14.2. Yönetilmesi gereken alanlar

- feature boundaries
- app vs package ayrımı
- deep import yasağı
- private/public module surface
- UI → domain → data → infra yönleri
- platform-specific boundary kontrolü
- shared/common/utils çöplüğü oluşumu

## 14.3. Araç + süreç kombinasyonu

Bu alan yalnızca review ile korunamaz.
Mümkün olan yerlerde:
- import rules
- module boundary checks
- forbidden dependency graphs
- code placement auditleri
kullanılmalıdır.

## 14.4. Zayıf governance davranışları

- boundary ihlallerini reviewer dikkatine bırakmak
- shared alan şişmesini fark etmemek
- private dosyaların dışarı açılmasını normal görmek

---

# 15. Design System Governance

## 15.1. Amaç

Design system’in yalnızca başlangıçta güzel kurulup sonra dağılmasını engellemek.

## 15.2. Yönetilmesi gereken alanlar

- token kullanımı
- semantic token disiplini
- primitive bypass’ları
- hardcoded stil değerleri
- yeni component açma politikası
- varyant şişmesi
- screen-specific pseudo-system bileşenler
- theming uyumu
- visual consistency exceptions

## 15.3. Tooling destekleri

- hardcoded value rules
- raw color usage checks
- forbidden inline style patterns
- component usage policy
- naming / placement audits
- design system rule lints

## 15.4. Review destekleri

- yeni component açma checklist’i
- varyant gerekçe incelemesi
- exception kayıt zorunluluğu
- screenshot / visual audit gerektiren alanlar

---

# 16. Accessibility Governance

## 16.1. Amaç

A11y’nin “ekip dikkat ederse olur” düzeyinde kalmasını engellemek.

## 16.2. Yönetilmesi gereken alanlar

- labels / roles / hints
- icon button erişilebilirliği
- focus görünürlüğü
- keyboard akışı
- modal/dialog focus yönetimi
- form helper/error ilişkileri
- contrast ve color-only meaning riskleri
- reduced motion
- dynamic type toleransı
- touch target minimumları

## 16.3. Tooling destekleri

- a11y lint rules
- component contract checks
- form pattern denetimleri
- bazı contrast / role / prop sinyalleri
- manual audit checklist entegrasyonu

## 16.4. Zayıf governance davranışları

- erişilebilirliği tamamen manuel test gününe bırakmak
- a11y issue’larını low priority diye sürüklemek
- component kontratlarında a11y alanını tanımlamamak

---

# 17. Testing Governance

## 17.1. Amaç

Testin ya hiç yazılmamasını ya da anlamsız coverage oyununa dönüşmesini engellemek.

## 17.2. Yönetilmesi gereken alanlar

- hangi risk için hangi test türü beklenecek
- flaky test yönetimi
- test naming / placement
- fixture ve mock hijyeni
- kritik akışlar için E2E zorunluluğu
- a11y ve visual regression katmanı
- failing tests with merge yasağı

## 17.3. Tooling destekleri

- test selection
- test health raporları
- flaky detection/workflow
- coverage trend only as signal
- failed critical suites as blockers

## 17.4. Zayıf governance davranışları

- kritik akışlarda test boşluğu
- failing testleri skip ederek ilerlemek
- coverage yüksek diye güven sanmak
- fixture çöplüğü oluşması

---

# 18. Documentation Governance

## 18.1. Amaç

Documentation-first yaklaşımın gerçek kalmasını sağlamak.

## 18.2. Yönetilmesi gereken alanlar

- kritik kararların dokümante edilmesi
- mimari ve süreç değişikliklerinde doc drift olmaması
- ADR ihtiyacı olan kararların kaydı
- stale dokümanların temizliği
- document map güncelliği
- kural değiştiyse onun yaşayan karşılığının güncellenmesi

## 18.3. Kural

Her küçük kod değişikliği doküman güncellemesi gerektirmez.
Ama kritik karar değişip doküman sessiz kalıyorsa governance başarısızdır.

## 18.4. Zayıf davranışlar

- mimariyi değiştirip dokümana dokunmamak
- yeni kural getirip hiçbir yere yazmamak
- eskimiş dokümanları referans bırakmak
- ADR gereken kararı chat mesajı seviyesinde bırakmak

---

# 19. Review Governance

## 19.1. Review neden governance konusudur?

Çünkü review yalnızca kişisel yorum alanı değil; proje standardını koruma kapısıdır.

## 19.2. Review’ın odaklanması gereken alanlar

Gate’lerle zaten yakalanan mekanik ihlallerden çok:
- ürün kararı doğruluğu
- mimari yön
- component/system uyumu
- UX sürtünmeleri
- premium hissiyat
- bilişsel yük
- istisna gerekçesi
- risk görünürlüğü

## 19.3. Kural

Review checklist destekli olmalıdır.
Aksi halde reviewer’lar her seferinde farklı şeylere bakar.

## 19.4. Zayıf review davranışları

- gate’lerin yapması gereken mekanik işleri elle aramak
- yorumları tamamen kişisel zevke göre vermek
- aynı tür ihlali bazen önemsemek bazen görmezden gelmek

---

# 20. Exception Governance

## 20.1. Neden en kritik alanlardan biri?

Çünkü hiçbir sistem exceptionsız yaşamaz.
Ama exception kontrolsüzse sistem çürür.

## 20.2. İstisna türleri

- tooling exception
- lint disable
- boundary exception
- design system exception
- a11y temporary exception
- performance tradeoff exception
- legacy baseline exception

## 20.3. Her exception için kayıtlanması gerekenler

- neyin exception olduğu
- neden gerektiği
- risk ne olduğu
- kim onayladığı
- süresi / kaldırılma koşulu
- takip issue/ADR/reference

## 20.4. Kural

Exception:
- sessiz olamaz
- sınırsız olamaz
- sebepsiz olamaz
- kalıcı varsayılan haline gelemez

## 20.5. Zayıf davranışlar

- `eslint-disable` yorumlarını bırakıp unutmak
- hardcoded istisnayı açıklamamak
- aynı exception’ı tekrar tekrar üretmek
- “legacy” bahanesiyle yeni kodda da exception açmak

---

# 21. Baseline Governance

## 21.1. Baseline neden gerekir?

Bazı büyük veya göç halindeki projelerde geçmiş borç olabilir.
Bunu görmezden gelmek gerçekçi değildir.

## 21.2. Kural

Baseline yalnızca mevcut borcu kayıt altına almak içindir.
Yeni borç üretmek için kalkan değildir.

## 21.3. Sağlıklı yaklaşım

- mevcut ihlaller kayıtlı
- yeni kod daha sıkı
- zaman içinde baseline azaltılıyor
- trend görünür tutuluyor

## 21.4. Zayıf yaklaşım

- baseline’ı sınırsız af belgesine çevirmek
- eski borç var diye yeni ihlalleri de normalleştirmek
- azaltma planı olmadan baseline tutmak

---

# 22. Ownership ve Sorumluluk Modeli

## 22.1. Governance kimin işi?

Herkesin.
Ama sorumluluklar görünür olmalıdır.

## 22.2. Düşünülmesi gereken roller

- feature geliştiricisi
- reviewer
- design system sahibi / bakımcısı
- mimari kalite sahibi
- release/CI sorumlusu
- dokümantasyon bakımcısı

Küçük ekipte aynı kişi bunların çoğunu taşıyabilir.
Ama roller kavramsal olarak ayrılmalıdır.

## 22.3. Kural

“Kimin bakacağı belli değil” alanlar zamanla bozulur.

---

# 23. Governance ve Developer Experience Dengesi

## 23.1. Neden önemli?

Aşırı ağır ve anlamsız governance sistemi bypass kültürü üretir.

## 23.2. Kural

Governance şu dengeleri kurmalıdır:
- hızlı sinyal
- düşük yanlış pozitif
- açık hata mesajı
- kayıtlı exception
- otomatikleştirilebilen yerde otomasyon
- manuel gereken yerde checklist

## 23.3. Zayıf davranışlar

- onlarca yavaş script
- neden fail olduğu anlaşılmayan pipeline
- her küçük ayrıntıyı blocker yapmak
- geliştiricinin sistemi kapatma isteği duyacağı gürültü düzeyi

---

# 24. Tooling Seçim Kriterleri

Bu doküman tool ismi seçmez, ama şu kriterleri zorunlu kılar:

1. Araç gerçek problemi çözüyor mu?
2. Yanlış pozitif oranı yönetilebilir mi?
3. Ekosistem ve bakım gücü yeterli mi?
4. CI ve local akışa entegre olabilir mi?
5. Cross-platform repo yapısına uyuyor mu?
6. Rule extensibility var mı?
7. Debug etmek ve hata mesajını anlamak mümkün mü?
8. Geliştirici deneyimini makul seviyede tutuyor mu?

Bu alan detaylı teknoloji değerlendirmede kullanılmalıdır.

---

# 25. Rule Lifecycle Yönetimi

## 25.1. Neden gerekir?

Kurallar bir kez yazılıp unutulmaz.
Yanlış, gürültülü veya etkisiz kurallar zamanla direnç üretir.

## 25.2. Rule lifecycle aşamaları

1. ihtiyaç tespiti
2. kural tasarımı
3. pilot / sinyal dönemi
4. warning aşaması
5. blocker aşaması (uygunsa)
6. düzenli gözden geçirme
7. gerekiyorsa sadeleştirme veya kaldırma

## 25.3. Kural

Kurallar keyfi çoğaltılmamalı.
Her yeni kuralın:
- açık problemi
- kabul edilen çözüm alanı
- beklenen faydası
olmalıdır.

---

# 26. Change Management Governance

## 26.1. Neden gerekli?

Yeni rule, yeni package, yeni component family, yeni quality gate gibi değişiklikler repo davranışını etkiler.

## 26.2. Yönetilmesi gereken değişiklikler

- yeni lint rules
- stricter CI policy
- design system breaking changes
- module boundary değişiklikleri
- new required docs
- test strategy changes
- exception policy changes

## 26.3. Kural

Bu tür değişiklikler sessizce merge edilmemelidir.
Gerekirse ADR, migration note veya rollout plan gerektirir.

---

# 27. Audit Governance

## 27.1. Audit neden gerekir?

Her şey otomatik enforce edilemez.
Özellikle:
- premium hissiyat
- görsel hiyerarşi
- bilişsel yük
- gerçek UX sürtünmesi
- a11y’nin bazı yönleri
- pattern sapmaları
manuel audit gerektirir.

## 27.2. Kural

Audit gelişi güzel yorumlaşma değildir.
Checklist veya belirli review eksenleriyle yürütülmelidir.

## 27.3. Audit çıktıları

- blocker issue
- major improvement need
- minor cleanup
- trend warning
- doc mismatch note

---

# 28. Code Generation ve Scaffolding Standardı

## 28.1. Nedir ve neden gerekli?

Code generation (kod üretimi) ve scaffolding (iskele kurma), yeni bir component, feature, screen veya hook oluştururken önceden tanımlanmış şablonlar (template'ler) üzerinden tutarlı dosya yapısı üretme pratiğidir.

Neden gereklidir:

Bir projede birden fazla geliştirici çalıştığında, her geliştirici yeni bir component veya feature oluştururken kendi alışkanlıklarına göre hareket eder. Biri dosya adını PascalCase yapar, diğeri camelCase. Biri test dosyasını yanına koyar, diğeri ayrı bir klasöre taşır. Biri barrel export (index.ts) oluşturur, diğeri doğrudan import yolunu kullanır. Biri TypeScript tipi tanımlar, diğeri `any` ile başlar.

Bu tutarsızlık zamanla şu sorunları üretir:
- Kod tabanında aynı türdeki yapılar farklı görünür. Yeni gelen geliştirici hangisinin doğru olduğunu anlayamaz.
- PR review'larda "dosya yapısı yanlış, şuraya koy, şöyle adlandır" gibi tekrar eden yorumlar oluşur.
- Convention (uzlaşı) belgesi yazılsa bile elle uygulamak unutulmaya açıktır.
- Refactoring ve toplu değişiklik (bulk rename, bulk move) zorlaşır çünkü yapı tutarsızdır.

Code generation bu problemleri çözer: Geliştirici tek bir komut çalıştırır, şablon sistemi doğru dosya yapısını, doğru isimlendirmeyi, doğru import'ları ve doğru temel test scaffold'unu otomatik üretir. Böylece convention yazılı belgede kalmaz; her dosya oluşturmada fiilen uygulanır.

## 28.2. Araç tercihi

Bu proje kapsamında **plop.js** tercih edilir.

Plop.js nedir: Node.js tabanlı, template-driven bir micro-generator aracıdır. Handlebars şablon motoru kullanır. Küçük bir config dosyası (`plopfile.js` veya `plopfile.ts`) ile generator tanımlanır. Geliştirici terminalde interaktif prompt'lara cevap verir (component adı, feature adı gibi), plop bu cevaplara göre dosyaları üretir.

Neden plop.js:
- Kurulumu ve öğrenilmesi basittir. Karmaşık konfigürasyon gerektirmez.
- Template tabanlı çalışır. Şablonu doğrudan görebilir ve düzenleyebilirsiniz.
- Monorepo yapısına uygundur. Farklı paketler için farklı generator'lar tanımlanabilir.
- Handlebars helper'ları ile isimlendirme dönüşümleri (PascalCase, camelCase, kebab-case) otomatik yapılır.

Alternatif araçlar:
- **Hygen**: Dosya sistemi tabanlı şablonlar kullanır. Plop'a göre daha dosya odaklıdır. Template'ler `_templates/` dizininde yaşar.
- **Turbo gen (Turborepo generator)**: Turborepo kullanıyorsanız entegre generator desteği sunar. Monorepo'ya özgüdür.

Araç seçimi değişebilir, ama scaffolding pratiğinin kendisi zorunludur.

## 28.3. Generator türleri

Bu proje kapsamında en az şu generator türleri tanımlanmalıdır:

### (a) Component generator

Kullanım: `pnpm generate component MyButton`

Ürettiği dosyalar:
- `MyButton.tsx` — Component dosyası. Doğru import'lar, TypeScript props interface'i, default export.
- `MyButton.test.tsx` — Test dosyası. Temel render testi scaffold'u, testing-library import'ları.
- `index.ts` — Barrel export. Component'i re-export eder.

Bu generator, `packages/ui/src/components/` altında veya feature'ın `ui/` dizininde çalışır (kullanım yerine göre). Önemli olan her component'in aynı yapıda oluşmasıdır.

### (b) Feature generator

Kullanım: `pnpm generate feature auth`

Ürettiği dizin yapısı:
- `auth/ui/` — Feature'a ait screen ve component dosyaları.
- `auth/state/` — State management dosyaları (store, slice, context gibi).
- `auth/data/` — API çağrıları, repository pattern dosyaları.
- `auth/model/` — TypeScript type/interface tanımları, domain modeli.
- `auth/tests/` — Feature seviyesinde integration test scaffold'u.
- `auth/index.ts` — Feature'ın public API'si (dışarıya ne expose ettiği).

Bu yapı, `07-module-boundaries-and-code-organization.md` dokümanında tanımlanan feature-based modüler yapıya birebir uymalıdır.

### (c) Screen generator

Kullanım: `pnpm generate screen auth/LoginScreen`

Bir feature'ın `ui/` dizini içinde yeni bir screen dosyası üretir. Screen generator, feature generator'dan bağımsız çalışır çünkü mevcut bir feature'a yeni ekran eklemek sık yapılan bir işlemdir.

### (d) Hook generator

Kullanım: `pnpm generate hook useAuth`

Ürettiği dosyalar:
- `useAuth.ts` — Custom hook dosyası. Doğru React import'ları, TypeScript return tipi.
- `useAuth.test.ts` — Hook test dosyası. `renderHook` kullanımlı temel test scaffold'u.

## 28.4. Template içeriği

Template'ler boş dosya üretmemelidir. Her template şunları içermelidir:

- **Doğru import'lar**: React, testing-library, proje-spesifik utility import'ları şablonda hazır olmalıdır.
- **Naming convention**: Dosya adı, component adı, props interface adı, test describe bloğu adı şablonda tutarlı üretilmelidir (örneğin component adı PascalCase, dosya adı PascalCase, props interface'i `ComponentNameProps`).
- **TypeScript type'lar**: Props interface'i, return type'ı şablonda tanımlı olmalıdır. `any` kullanımı template'de bulunmamalıdır.
- **Basic test scaffold**: En azından "component render edilebilir" seviyesinde bir test şablonda yer almalıdır. Geliştirici üzerine ekler, ama başlangıç noktası boş olmamalıdır.

Template'ler proje root'unda `plop-templates/` veya `tools/generators/templates/` dizininde tutulmalıdır. Template dosyaları `.hbs` (Handlebars) uzantılıdır.

## 28.5. Convention enforcement

Generator kullanımı **önerilir ama zorunlu tutulmaz**. Bunun sebebi şudur: Bazen geliştirici mevcut bir component'i kopyalayıp düzenler veya IDE'nin kendi scaffolding özelliğini kullanır. Bu kabul edilebilir — **ancak sonuç yapı, generator'ın üreteceği yapıyla aynı olmalıdır.**

Yani önemli olan aracın kendisi değil, çıktının tutarlılığıdır.

Bu tutarlılık PR review'da kontrol edilir:
- Dosya yerleşimi doğru mu?
- Isimlendirme convention'a uygun mu?
- Barrel export var mı?
- Test dosyası var mı?
- TypeScript tipleri tanımlı mı?

Eğer elle oluşturulan yapı sürekli convention'dan sapıyorsa, generator kullanımı o alan için zorunlu hale getirilebilir.

## 28.6. Hatalı yaklaşımlar

- **Generator kullanmadan her seferinde elle oluşturmak**: İlk birkaç component'te sorun olmaz, ama 50. component'te tutarsızlık birikmaya başlar. En azından convention'ı bilen bir generator mevcut olmalıdır.
- **Template'i güncel tutmamak**: Proje convention'ı değişir (yeni import pattern, yeni test yaklaşımı), ama template eski kalır. Generator eski yapıda dosya üretir, geliştirici elle düzeltir. Bu durumda generator zarar verir. Template bakımı düzenli yapılmalıdır.
- **Her küçük dosya için generator tanımlamak (overengineering)**: Bir utility fonksiyonu veya bir sabit dosyası için generator gereksizdir. Generator, tekrar eden ve yapısal tutarlılık gerektiren dosya grupları içindir (component, feature, screen, hook gibi).
- **Generator'ı karmaşık iş mantığı üretecek şekilde tasarlamak**: Generator yapı üretir, iş mantığı üretmez. Template'e API çağrısı, state yönetimi detayı, karmaşık logic koymak template'i anlaşılmaz ve bakımı zor hale getirir.

---

# 29. Storybook ve Component Catalog Standardı

## 29.1. Nedir ve neden gerekli?

Storybook, reusable (yeniden kullanılabilir) UI component'lerin uygulama bağlamından bağımsız olarak izole bir ortamda geliştirilmesini, test edilmesini ve dokümante edilmesini sağlayan bir araçtır. Component catalog (bileşen kataloğu) ise bu component'lerin tüm varyantlarını, state'lerini ve kullanım örneklerini bir arada sunan görsel referans sistemidir.

Neden gereklidir:

1. **İzole geliştirme**: Bir Button component'ini test etmek için tüm uygulamayı ayağa kaldırmak gerekmez. Storybook, component'i kendi başına render eder. Bu sayede geliştirici component'in her durumunu (normal, hover, disabled, loading, error) hızlıca görebilir ve geliştirebilir.

2. **Görsel dokümantasyon**: Design system'deki component'lerin ne yaptığını, nasıl göründüğünü ve hangi prop'ları kabul ettiğini kod okumadan görmek mümkün olur. Yeni gelen geliştirici veya designer, mevcut component'leri Storybook üzerinden keşfedebilir.

3. **Design system iletişimi**: Designer ve geliştirici arasındaki "bu component'in disabled hali nasıl görünüyor?" sorusu Storybook'ta cevap bulur. Figma'daki tasarım ile koddaki gerçek görünüm karşılaştırılabilir.

4. **Visual regression testi**: Storybook story'leri, visual regression araçlarının (Chromatic gibi) test yüzeyi olarak kullanılır. Her PR'da component'lerin görsel olarak değişip değişmediği otomatik kontrol edilir.

5. **Tekrar kullanımı teşvik etme**: Geliştirici yeni bir UI öğesine ihtiyaç duyduğunda önce Storybook'a bakar. Mevcut bir component işini görüyorsa yenisini yazmaz. Bu, component çoğalmasını (duplication) engeller.

## 29.2. Storybook web kurulumu

Bu proje kapsamında React + Vite altyapısı için **Storybook 10.x** kullanılır.

Bu kararın gerekçesi:
- Storybook 10 hattı güncel bakım hattıdır ve **ESM-only** dağıtım modeline geçmiştir. Bu, canonical Vite 8 + ESM-first web zinciri ile daha doğal hizalanır.
- React + Vite için resmi framework/builder hattı güçlüdür; component catalog, docs ve preview yüzeyi bu zincirde ayrı webpack karmaşası oluşturmadan çalışır.
- **Storybook Test + Vitest addon** hattı ile story'ler gerçek browser ortamında test yüzeyine dönüşebilir. Bu, interaction testleri, selected component-browser doğrulamaları ve coverage görünürlüğü için güçlü tamamlayıcıdır.

Canonical kural:
- Storybook component lab / docs / preview yüzeyidir.
- Storybook Test + Vitest addon, story'leri browser-mode test yüzeyine çevirmek için tercih edilen entegrasyondur.
- Chromatic veya eşdeğer görsel fark servisleri opsiyonel ama güçlü adaydır; baseline kalite yüzeyi story'lerin kendisidir.

Story dosyaları `packages/ui/` altında, ilgili component'in yanında tutulur. Örnek dizin yapısı:

```
packages/ui/src/components/Button/
├── Button.tsx
├── Button.test.tsx
├── Button.stories.tsx   ← Story dosyası burada
└── index.ts
```

Her story dosyası CSF (Component Story Format) 3 formatında yazılır. Bu format, her story'yi bir named export olarak tanımlar:

```tsx
// Button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
};
export default meta;

type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: { variant: 'primary', children: 'Kaydet' },
};

export const Disabled: Story = {
  args: { variant: 'primary', children: 'Kaydet', disabled: true },
};
```

## 29.2.1. Builder ve test entegrasyonu

- Web component catalog için resmi **React + Vite Storybook framework** kullanılır. Vite config ile ayrışan özel alias veya plugin ihtiyacı varsa mümkün olduğunca Storybook içinde yeniden tanımlanmaz; ana Vite config ile hizalanır.
- Storybook Test kullanılıyorsa, story'ler **Vitest browser mode** üzerinden çalıştırılır. Bu sayede interaction testleri, selected accessibility kontrolleri ve coverage raporu aynı story yüzeyinden türetilebilir.
- Storybook, test runner'ın yerine geçmez. Ancak story tabanlı browser testleri ile UI contract görünürlüğü ciddi biçimde güçlenir.

## 29.3. Story yazım kuralları

Aşağıdaki kurallar her story dosyası için geçerlidir:

### Her reusable component en az 1 story içermelidir

Eğer bir component `packages/ui/` altında yaşıyorsa ve birden fazla yerde kullanılıyorsa (veya kullanılması amaçlanıyorsa), story dosyası zorunludur. Story olmayan reusable component, PR review'da eksik kabul edilir.

### Gerçekçi prop değerleri kullanılmalıdır

Story'lerdeki prop değerleri "test", "lorem ipsum", "asdf" gibi anlamsız değerler olmamalıdır. Gerçek kullanım senaryosunu yansıtan değerler tercih edilmelidir. Örneğin bir Button story'sinde children olarak "Kaydet", "İptal", "Devam Et" gibi gerçek etiketler kullanılmalıdır.

### Tüm görsel state'ler kapsanmalıdır

Bir component'in kullanıcıya gösterebileceği tüm durumlar story olarak tanımlanmalıdır:
- **Idle (varsayılan)**: Component'in normal görünümü.
- **Hover**: Fare üzerine geldiğindeki görünüm (CSS :hover state'i).
- **Focus**: Klavye ile odaklandığındaki görünüm (focus ring, outline).
- **Active**: Tıklama anındaki görünüm.
- **Disabled**: Devre dışı durumu. Opacity, cursor değişikliği, tıklanamama.
- **Loading**: Yüklenme durumu. Spinner, skeleton, progress indicator.
- **Error**: Hata durumu. Kırmızı border, hata mesajı, ikon değişimi.

Her state için ayrı bir story export'u oluşturulur. Bu sayede visual regression testi her state'i bağımsız yakalar.

### Dark mode varyantı eklenmelidir

Proje dark mode destekliyorsa, her component'in dark mode görünümü de story olarak tanımlanmalıdır. Storybook'un decorator mekanizması kullanılarak dark mode wrapper uygulanabilir.

## 29.4. Ne zaman story gerekmez?

Story yazımı **her component için zorunlu değildir**. Şu component türleri Storybook'a eklenmek zorunda değildir:

- **Feature-specific component'ler**: Yalnızca tek bir ekranda kullanılan, genel amaçlı olmayan component'ler. Örneğin `LoginForm` yalnızca login ekranında yaşıyorsa story zorunlu değildir.
- **Layout wrapper'lar**: Yalnızca children'ı saran ve padding/margin uygulayan basit layout bileşenleri.
- **Page-level composition component'ler**: Birden fazla component'i birleştiren sayfa seviyesindeki yapılar.

Kural basittir: **Yalnızca shared/reusable component'ler Storybook'a eklenir.** `packages/ui/` altında yaşayan component'ler reusable kabul edilir ve story zorunludur. Feature içindeki yerel component'ler opsiyoneldir.

## 29.5. Deployment

Storybook, statik bir web sitesi olarak build edilir ve deploy edilir. Bu sayede ekipteki herkes (geliştirici, designer, ürün yöneticisi) component catalog'a tarayıcıdan erişebilir.

Deployment seçenekleri:
- **Chromatic**: Storybook'un resmi hosting ve visual regression platformu. Story deploy + screenshot karşılaştırması tek araçta.
- **Vercel / Netlify**: Storybook static build'i (`storybook build` çıktısı) herhangi bir static hosting servisine deploy edilebilir.

PR akışında Storybook preview link'i otomatik oluşturulmalıdır. Reviewer, PR'daki component değişikliklerini preview link üzerinden görsel olarak inceleyebilmelidir.

## 29.6. Visual regression

Storybook story'leri, visual regression testinin temel yüzeyidir.

**Chromatic entegrasyonu** kullanıldığında (opsiyonel ama güçlü aday):
- Her PR'da tüm story'lerin ekran görüntüsü alınır.
- Önceki ekran görüntüsüyle piksel bazında karşılaştırılır.
- Değişiklik varsa reviewer'a diff gösterilir.
- Beklenmeyen görsel değişiklikler blocker olarak işaretlenebilir.

Bu mekanizma, "başka bir component'i düzenlediğimde farkında olmadan bu component'in görünümünü bozdum" senaryolarını yakalar.

## 29.7. Hatalı yaklaşımlar

- **Her component'e story yazmak**: Feature-specific, tek kullanımlık component'lere story yazmak bakım yükü oluşturur ve Storybook'u kalabalıklaştırır. Yalnızca reusable component'ler eklenir.
- **Story'leri güncel tutmamak**: Component'e yeni prop eklenir, yeni state eklenir, ama story güncellenmez. Storybook gerçeği yansıtmaz hale gelir. Story güncellemesi, component değişikliğinin parçası olmalıdır.
- **Storybook'u test yerine kullanmak**: Storybook görsel geliştirme ve dokümantasyon aracıdır. Unit test, integration test, a11y test yerine geçmez. "Storybook'ta çalışıyor" ifadesi "test edildi" anlamına gelmez.
- **Story'leri anlamsız prop'larla doldurmak**: `children="test"`, `label="asdf"` gibi değerler story'yi dokümantasyon olarak kullanışsız kılar.

---

# 30. Figma → Kod Geçiş Standardı

## 30.1. Nedir?

Figma → Kod geçiş standardı, tasarım aracında (Figma) oluşturulan görsel kararların koda aktarılma sürecini tanımlar. Bu süreç üç ana eksenden oluşur:
1. **Token sync**: Figma'daki renk, tipografi, spacing, shadow gibi design token'ların kod tarafındaki token dosyalarıyla senkronize edilmesi.
2. **Component spec handoff**: Figma'daki component tasarımlarının geliştirici tarafından doğru anlaşılması için gerekli bilgilerin aktarılması.
3. **Asset export**: İkon, illüstrasyon, resim gibi görsel varlıkların Figma'dan dışarı aktarılması ve optimize edilmesi.

Bu standart olmadan tasarım ile kod arasında "drift" (sapma) oluşur. Designer bir rengi değiştirir ama geliştirici eski rengi kullanmaya devam eder. Spacing değerleri Figma'da 16px iken kodda 15px olur. Bu küçük sapmalar biriktiğinde ürün görsel tutarsızlığa düşer.

## 30.2. Design token sync

Design token'lar (renkler, font boyutları, spacing değerleri, shadow tanımları, border radius değerleri vb.) Figma'da tanımlanır ve kod tarafına aktarılır.

### Araç zinciri

1. **Figma Tokens plugin (Tokens Studio)**: Figma içinde token'ları yapılandırılmış veri olarak tanımlar. Her token bir ad, değer ve kategoriye sahiptir. Plugin, token'ları JSON formatında export edebilir.

2. **JSON export**: Tokens Studio'dan çıkan JSON dosyası, token'ların ham veri temsilidir. Bu dosya doğrudan kullanılmaz; bir dönüştürme aracından geçirilir.

3. **style-dictionary**: Amazon'un geliştirdiği, platform-agnostic token dönüştürme aracıdır. JSON token tanımını alır ve hedef platforma uygun çıktıya dönüştürür:
   - Web için: CSS custom properties (`--color-primary: #007AFF;`)
   - React Native için: TypeScript objesi (`export const colorPrimary = '#007AFF';`)
   - Her iki platform için de aynı kaynak JSON'dan üretilir.

### Token değişiklik akışı

Token değişikliği şu sırayla akar:

1. Designer, Figma'da token değerini değiştirir (örneğin primary rengi günceller).
2. Tokens Studio plugin'i ile güncel token'lar JSON olarak export edilir.
3. Bu JSON, kod reposuna bir PR olarak sunulur.
4. style-dictionary çalışır ve platform-spesifik token dosyalarını yeniden üretir.
5. PR review edilir. Değişiklik onaylanırsa merge edilir.
6. Token değişikliği tüm component'lere otomatik yansır (çünkü component'ler token referansı kullanır, hardcoded değer kullanmaz).

### Tek source of truth kuralı

- **Figma** → Design tarafının source of truth'udur. Token'ların görsel anlamı ve kullanım amacı burada tanımlanır.
- **Token dosyası (JSON → generated output)** → Kod tarafının source of truth'udur. Component'ler bu dosyaya referans verir.

İkisi arasında drift (sapma) olmamalıdır. Figma'da bir token 16px ise, kodda da 16px olmalıdır. Bu senkronizasyon yukarıdaki akışla sağlanır.

## 30.3. Component spec handoff

Designer bir component tasarladığında, geliştiricinin doğru implementasyon yapabilmesi için şu bilgilere ihtiyacı vardır:

### Figma Dev Mode ile aktarılan bilgiler

- **Boyutlar ve spacing**: Component'in genişliği, yüksekliği, iç padding'leri, child elemanlar arası gap değerleri. Piksel değeri yerine token adı kullanılmalıdır (16px değil `tokens.spacing.4`).
- **Token adları**: Hangi renk token'ı, hangi tipografi token'ı, hangi shadow token'ı kullanıldığı. Bu sayede geliştirici hex kodu kopyalamak yerine doğru token'a referans verir.
- **State matrisi**: Component'in hangi state'leri var (default, hover, pressed, disabled, focused, error, loading). Her state'in görsel farkları (renk değişimi, opacity, border değişimi vb.).
- **Responsive davranış**: Component farklı ekran boyutlarında nasıl davranıyor? Sabit mi, esnek mi? Metin taşarsa ne oluyor? Minimum ve maksimum boyutlar nedir?

Bu bilgiler Figma'nın Dev Mode özelliğinde inspect panelinde görünür. Designer'ın component'i doğru token'larla ve variant'larla kurmuş olması gerekir.

## 30.4. Asset export

Figma'dan dışarı aktarılan görsel varlıkların (ikon, illüstrasyon, resim) optimize edilmesi gerekir.

### SVG varlıklar

- Figma'dan SVG olarak export edilir.
- **SVGO** (SVG Optimizer) ile gereksiz metadata, editor bilgisi, boş grup'lar temizlenir.
- Dosya boyutu küçülür, render performansı artar.
- Optimize edilmiş SVG, React component'ine dönüştürülebilir (SVGR gibi araçlarla) veya doğrudan kullanılır.

### Raster varlıklar (PNG, JPG)

- Figma'dan **@2x** çözünürlükte export edilir (Retina ekranlar için).
- **sharp** veya benzeri bir araçla optimize edilir (dosya boyutu küçültme, kalite dengesi).
- WebP gibi modern formatlara dönüştürme değerlendirilir.

### Export → optimize → commit akışı

1. Designer veya geliştirici varlığı Figma'dan export eder.
2. Optimizasyon aracı çalıştırılır (SVGO, sharp).
3. Optimize edilmiş dosya repoya commit edilir.
4. PR'da asset değişikliği review edilir.

Ham (optimize edilmemiş) asset doğrudan commit edilmemelidir. Bu kural pre-commit hook veya CI kontrolü ile desteklenebilir.

## 30.5. Design review

Büyük veya görsel olarak kritik UI değişikliklerinde (yeni ekran, component redesign, tema değişikliği) designer review **önerilir**.

Design review akışı:
- PR açıklamasına Figma frame link'i eklenir.
- PR'daki ekran görüntüsü (veya Storybook preview link'i) ile Figma tasarımı karşılaştırılır.
- Designer, implementasyonun tasarıma uygunluğunu onaylar veya geri bildirim verir.

Her PR'da design review zorunlu değildir. Ama şu durumlarda önerilir:
- Yeni component oluşturulduğunda.
- Mevcut component'in görsel davranışı değiştiğinde.
- Yeni ekran eklendiğinde.
- Tema veya token değişikliği yapıldığında.

## 30.6. Drift önleme

Figma'daki token tanımları ile koddaki token dosyası arasında sapma (drift) olmaması gerekir. Bu senkronizasyonu doğrulamak için:

- CI pipeline'ına token sync kontrolü eklenebilir. Figma'dan export edilen JSON ile repodaki JSON karşılaştırılır. Fark varsa CI uyarı verir.
- Periyodik olarak (iki haftada bir, sprint başında) token senkronizasyonu gözden geçirilir.
- Token değişikliği yapıldığında hem Figma hem kod tarafı aynı PR/süreçte güncellenir.

## 30.7. Hatalı yaklaşımlar

- **"Göz kararı" kodlama**: Figma'ya bakmadan veya token kullanmadan "yaklaşık şöyle görünüyordu" diye kodlama yapmak. Bu, tasarım ile kod arasında görünmez sapma üretir.
- **Token sync yapmadan hex kopyalama**: Figma'dan renk değerini (`#007AFF`) alıp doğrudan koda yapıştırmak. Token adı yerine hardcoded değer kullanmak. Token değiştiğinde bu değer güncellenmez ve drift oluşur.
- **Optimize etmeden asset commit etmek**: Figma'dan export edilen ham SVG veya PNG dosyasını doğrudan repoya eklemek. Gereksiz metadata, büyük dosya boyutu, yavaş yükleme.
- **Component spec olmadan kodlamaya başlamak**: Designer'ın component'i henüz state matrisi, spacing tokenları ve responsive davranış bilgisiyle tamamlamadan kodlamaya başlamak. Eksik bilgiyle yazılan kod, daha sonra büyük ölçüde düzenlenmek zorunda kalır.

---

# 31. Teknik Borç Takip Standardı

## 31.1. Nedir ve neden gerekli?

Teknik borç (tech debt), yazılım geliştirme sürecinde bilinçli veya bilinçsiz olarak kabul edilen, kısa vadede çalışan ama uzun vadede bakım maliyetini artıran teknik kararların birikmesidir.

Teknik borç kaçınılmazdır. Her projede zaman baskısı, bilgi eksikliği, değişen gereksinimler veya bilinçli tradeoff'lar nedeniyle "şimdilik böyle kalsın" kararları verilir. Sorun borcun varlığı değil; **takip edilmemesi, biriktirilmesi ve görünmez kalmasıdır**.

Takip edilmeyen teknik borç şu sırayla zarar verir:
1. Kod tabanının belirli bölümleri "dokunması tehlikeli" hale gelir.
2. Yeni feature'lar eklenmesi yavaşlar çünkü mevcut yapı direnir.
3. Bug oranı artar çünkü karmaşık ve kırılgan yapılara müdahale riski yüksektir.
4. Geliştirici motivasyonu düşer çünkü "zaten bozuk" algısı oluşur.
5. Bir noktada "her şeyi baştan yazalım" tartışması başlar (ki bu genellikle yanlış çözümdür).

Teknik borç takip standardı, bu birikimi görünür, ölçülebilir ve yönetilebilir kılar.

## 31.2. Kayıt yöntemi

Teknik borç üç seviyede kayıt altına alınır:

### (1) Kodda: TODO yorumu

```typescript
// TODO(tech-debt): Bu fonksiyon n+1 sorgu yapıyor. Batch fetch'e geçilmeli.
// Ticket: PROJ-1234
// Öncelik: Yüksek
```

Kural: Her `TODO(tech-debt)` yorumu bir issue tracker referansı içermelidir. Referanssız TODO, takip edilemeyen borçtur. PR review'da referanssız TODO kabul edilmemelidir.

`TODO(tech-debt)` etiketi, normal `TODO` yorumlarından ayrılır. Normal TODO bir geliştirme notu olabilir, ama `tech-debt` etiketi bilinçli olarak kabul edilmiş bir borcu işaret eder.

### (2) Issue tracker'da: "tech-debt" label

Her teknik borç, issue tracker'da (Jira, Linear, GitHub Issues vb.) bir issue olarak kaydedilmelidir. Issue şu bilgileri içermelidir:

- **Ne**: Borcun ne olduğu, hangi dosya/modül/sistemi etkilediği.
- **Neden**: Bu borç neden oluştu? Zaman baskısı mı, bilgi eksikliği mi, bilinçli tradeoff mı?
- **Etki**: Bu borç devam ederse ne olur? Hangi akışları yavaşlatır, hangi riskleri artırır?
- **Efor tahmini**: Düzeltmek yaklaşık ne kadar sürer? (T-shirt sizing: S/M/L/XL)
- **Öncelik**: Kritik, Yüksek, Orta, Düşük (aşağıdaki önceliklendirme kriterlerine göre).

Issue'ya `tech-debt` label'ı eklenir. Bu sayede tüm teknik borçlar tek bir filtre ile listelenebilir.

### (3) ADR (Architecture Decision Record)

Eğer teknik borç bilinçli bir mimari kararın sonucuysa (örneğin "şu anda Zustand kullanıyoruz ama ileride Redux Toolkit'e geçmeyi planlıyoruz"), bu karar bir ADR olarak belgelenir. ADR'ın "known limitations" veya "consequences" bölümüne borç açıkça yazılır.

Bu sayede borç "unutulmuş bir hata" değil, "bilinçli kabul edilmiş ve kaydedilmiş bir tradeoff" olarak yaşar.

## 31.3. Önceliklendirme

Teknik borçlar dört öncelik seviyesinde sınıflandırılır:

### Kritik

Güvenlik riski veya veri kaybı riski taşıyan borçlar. Örneğin: sanitize edilmemiş kullanıcı girdisi, encrypt edilmemiş hassas veri, race condition'a açık state yönetimi.

**Aksiyon**: Hemen düzeltilir. Sprint'e alınmayı beklemez. Hotfix olarak ele alınır.

### Yüksek

Mimari coupling, yanlış abstraction, performans darboğazı gibi borçlar. Teknik olarak çalışıyor ama yeni feature geliştirmeyi engelliyor veya yavaşlatıyor.

**Aksiyon**: Mevcut sprint veya bir sonraki sprint'te ele alınır. Backlog'da uzun süre beklememelidir.

### Orta

Rahatsız edici ama acil olmayan borçlar. Kod okunabilirliğini düşüren yapılar, tekrar eden kod blokları, eksik type tanımları, yetersiz hata yönetimi.

**Aksiyon**: Backlog'a eklenir. Sprint planlamasında kapasite olduğunda alınır. Boy scout rule (bölgeyi bulduğundan temiz bırak) ile parça parça iyileştirilebilir.

### Düşük

Kozmetik iyileştirmeler. Değişken isimlendirme tutarsızlıkları, gereksiz yorumlar, küçük stil farklılıkları.

**Aksiyon**: Boy scout rule ile fırsatçı düzeltme. Ayrı bir iş kalemi olarak planlanmaz. İlgili dosyaya dokunulduğunda düzeltilir.

## 31.4. Sprint ayrımı

Her sprint'in **%10-20 kapasitesi** teknik borç azaltmaya ayrılmalıdır. Bu ayrım şu şekilde uygulanır:

- Sprint planlamasında en az 1-2 tech debt issue'su sprint backlog'una alınır.
- "Tech debt sprint'i" veya "refactoring haftası" planlanmaz. Bu yaklaşım pratikte başarısızdır çünkü ürün öncelikleri her zaman öne geçer ve tech debt sprint'i sürekli ertelenir.
- Bunun yerine **düzenli, küçük, sürekli azaltma** uygulanır. Her sprint biraz borç kapatılır.
- Boy scout rule aktif olarak teşvik edilir: Bir dosyaya dokunduğunda küçük iyileştirmeleri (isimlendirme, type ekleme, gereksiz code silme) o PR'da yap.

## 31.5. Ratchet pattern

Ratchet (cırcır) pattern, teknik borç birikimini kontrol altında tutmak için kullanılan bir disiplin mekanizmasıdır.

Kural: **Yeni bir teknik borç eklendiğinde, mevcut bir teknik borcun kapatılması beklenir.**

Bu kural opsiyoneldir ve katı şekilde uygulanması gerekmez. Ama disiplinli ekiplerde etkili bir mekanizmadır çünkü toplam borç sayısının artmasını engeller. "Bir borç ekle, bir borç kapat" prensibi, borç birikimini dengelenmiş tutar.

Uygulanması: PR açıklamasına "eklenen borç: X, kapatılan borç: Y" bilgisi yazılır. Review'da değerlendirilir.

## 31.6. Ölçüm

Teknik borç yönetiminin sağlıklı olup olmadığını anlamak için iki metrik izlenir:

- **Issue sayısı trendi**: Toplam açık tech-debt issue sayısı aydan aya artıyor mu, azalıyor mu, sabit mi? Sürekli artan trend, borç birikiminin kontrol dışı olduğunu gösterir.
- **Ortalama yaşı**: Açık tech-debt issue'larının ortalama yaşı kaç gün/hafta? Ortalama yaş sürekli artıyorsa, borçlar açılıp kapatılmıyor, sadece biriktiriliyordur.

Bu metrikler sprint retrospective'de veya aylık teknik sağlık toplantısında gözden geçirilir.

## 31.7. Hatalı yaklaşımlar

- **Hiç takip etmemek**: Teknik borçları kayıt altına almamak, "kafamızda biliyoruz" demek. Ekip üyesi ayrıldığında bilgi kaybolur. Yeni gelen borcu göremez.
- **"Refactoring sprint" planlamak**: Tüm teknik borçları bir sprint'te temizlemeye çalışmak. Bu yaklaşım hemen her zaman başarısız olur çünkü (a) ürün öncelikleri araya girer, (b) büyük refactoring riskleri küçümsenir, (c) bir sprint yetmez ve motivasyon düşer.
- **Her şeyi tech debt saymak**: "Bu kodu beğenmiyorum" ile "bu kod güvenlik riski taşıyor" aynı kategoride değildir. Kişisel tercih farklılıkları tech debt değildir. Gerçek teknik borç, ölçülebilir negatif etkisi olan yapılardır.
- **TODO'ları issue'ya dönüştürmemek**: Kodda `// TODO: fix this` yazıp bırakmak. Issue tracker'da karşılığı olmayan TODO, hiçbir zaman ele alınmaz. Zamanla kodda yüzlerce atıl TODO birikir.
- **Borcun yaşını görmezden gelmek**: 6 aydan eski tech-debt issue'ları ya gerçekten önemli değildir (kapatılmalı) ya da sürekli ertelenmektedir (öncelik yükseltilmeli). Yaşlı borçlar periyodik olarak gözden geçirilmelidir.

---

# 32. Feature Flags ve Remote Config Stratejisi

## 32.1. Feature Flag Nedir?

Feature flag (diger adlariyla feature toggle, feature switch veya feature gate), kodda yeni bir ozelligi acip kapatmayi saglayan bir mekanizmadir. Ozellik kodu deploy edilmis olsa bile flag kapaliysa kullanici bu ozelligi gormez. Flag acilinca ozellik aktif olur.

En basit haliyle bir feature flag sudur:

```typescript
if (featureFlags.isEnabled('new-checkout-flow')) {
  return <NewCheckoutFlow />;
} else {
  return <OldCheckoutFlow />;
}
```

Ama modern feature flag sistemleri bunun cok otesine gecer: kullanici segmentasyonu, gradual rollout, A/B testing, remote config ve instant rollback imkani sunar.

## 32.2. Neden Feature Flag Gerekli?

1. **Trunk-based development destegi:** Bu boilerplate trunk-based development stratejisi kullanir (42-branching-and-merge-strategy.md). Bu modelde uzun omurlu feature branch'ler yerine, tamamlanmamis ozellikler flag arkasinda main branch'e merge edilir. Flag kapaliyken ozellik production'da gorunmez, tamamlaninca flag acilir.

2. **Guvenli deployment:** Yeni ozellik sorun cikarirsa flag kapatilarak aninda geri alinir. Rollback icin yeni deploy gerekmez.

3. **Gradual rollout:** Ozellik once %5 kullaniciya, sonra %25'e, sonra %100'e acilir. Sorun erken tespit edilir.

4. **A/B testing altyapisi:** Iki farkli ozellik varyanti farkli kullanici gruplarina gosterilir, metrikler karsilastirilir.

5. **Platform-specific feature gating:** Ayni ozellik iOS'ta acik, Android'de kapali olabilir. Veya web'de acik, mobile'da kapali.

6. **Operasyonel guvenlik:** Sistem yogunlugu yuksekse agir ozellikler flag ile kapatilabilir (kill switch).

## 32.3. Feature Flag Turleri

### Release flag (kisa omurlu)

Yeni ozellik deploy edildiginde kapali baslar. Test ve dogrulama sonrasi acilir. Ozellik stable olduktan sonra flag kodu kaldirilir.

- **Omur:** 1-4 hafta
- **Ornek:** Yeni profil sayfasi gelistiriliyor. Kod merge edilir ama `new-profile` flag'i kapalidir. Tamamlaninca flag acilir, kararli calistigi dogrulandiktan sonra flag tamamen kaldirilir.

### Experiment flag (orta omurlu)

A/B test icin olusturulur. Iki veya daha fazla varyant barindirir. Test sonuclandiginda kazanan varyant kalir, flag kaldirilir.

- **Omur:** 2-8 hafta
- **Ornek:** Onboarding akisinin A ve B varyanti test ediliyor. `onboarding-variant` flag'i ile kullanicilar rastgele A veya B grubuna yonlendirilir. Test tamamlandiginda kazanan varyant kalir, flag kaldirilir.

### Ops flag (uzun omurlu)

Operasyonel kontrol icin kullanilir (kill switch, maintenance mode). Sistemde kalici olarak bulunur.

- **Omur:** suresiz
- **Ornek:** `enable-real-time-sync` flag'i. Normalde aciktir, ama WebSocket sunucusu sorun cikarirsa flag kapatilarak polling moduna dusulur.

### Permission flag (uzun omurlu)

Kullanici planina veya rolune gore ozellik erisimi kontrol eder. Premium/freemium ayrimi saglar.

- **Omur:** suresiz
- **Ornek:** `premium-analytics` flag'i. Yalnizca premium aboneligi olan kullanicilara aciktir.

## 32.4. Canonical Arac Degerlendirmesi

Bu boilerplate canonical feature flag araci konusunda su anda acik karar vermemistir. Aday araclar ve degerlendirmeleri:

### Firebase Remote Config
- **Avantajlar:** Ucretsiz, Firebase ekosistemiyle entegre, Expo SDK uyumlu, real-time guncelleme
- **Dezavantajlar:** UI/dashboard zayif, segmentasyon sinirli, analytics entegrasyonu dolayli
- **Boilerplate uyumu:** Firebase zaten ekosistemde (D-FIR), ek dependency yok

### PostHog
- **Avantajlar:** Feature flags + analytics + session replay tek pakette, acik kaynak, self-host imkani
- **Dezavantajlar:** Ucretli (olcege gore), React Native SDK olgunlugu orta
- **Boilerplate uyumu:** Vendor-agnostic analytics karari (ADR-009) ile uyumlu

### LaunchDarkly
- **Avantajlar:** Enterprise-grade, guclu segmentasyon, real-time, React Native SDK mevcut
- **Dezavantajlar:** Pahali, vendor lock-in riski yuksek
- **Boilerplate uyumu:** Enterprise projelerde aday, boilerplate default olarak agir

### Custom Cozum (JSON config + API)
- **Avantajlar:** Tam kontrol, vendor bagimliligi yok, basit projeler icin yeterli
- **Dezavantajlar:** Gradual rollout, segmentasyon, real-time guncelleme altyapisi yazilmali
- **Boilerplate uyumu:** Basit flag ihtiyaci icin makul, karmasik senaryolarda yetersiz

## 32.5. Boilerplate Icin Onerilen Yaklasim

1. **Abstraction-first:** Tipki analytics kararinda (ADR-009) oldugu gibi, feature flag vendor'ina dogrudan baglanma. Vendor-agnostic abstraction layer olustur:

   ```typescript
   // packages/shared/src/feature-flags/types.ts
   interface FeatureFlagProvider {
     isEnabled(flagKey: string): boolean;
     getVariant(flagKey: string): string | undefined;
     getAllFlags(): Record<string, boolean>;
   }
   ```

2. **Varsayilan implementasyon:** Bootstrap asamasinda basit JSON-based flag sistemi yeterli. Production'da vendor entegrasyonu projeye gore secilir.

3. **Flag lifecycle:** Her flag olusturuldugunda:
   - olusturma tarihi
   - beklenen kaldirma tarihi
   - sahip (owner)
   - tur (release/experiment/ops/permission)

   kaydedilmeli.

## 32.6. Implementasyon Detaylari

### (a) Proje baslangici: Build-time flag

Projenin ilk asamalarinda karmasik bir feature flag altyapisina gerek yoktur. Ortam degiskenleri (environment variables) yeterlidir.

```typescript
// .env dosyasi
VITE_FEATURE_NEW_PROFILE=true
VITE_FEATURE_DARK_MODE=false
```

```typescript
// Kullanim
const isNewProfileEnabled = import.meta.env.VITE_FEATURE_NEW_PROFILE === 'true';
```

Bu yaklasimin ozellikleri:
- Basittir, ek bagimlilik gerektirmez.
- Flag degisikligi yeni deploy gerektirir (build-time'da deger sabitlenir).
- Kullanici bazli segmentasyon yapilamaz.
- Kucuk ekip ve az sayida flag icin yeterlidir.

### (b) Buyudukce: Remote config

Proje buyudugunde, flag sayisi arttiginda veya kullanici bazli segmentasyon gerektiginde remote config (uzaktan yapilandirma) sistemine gecilir.

Remote config'in avantajlari:
- Deploy etmeden flag degistirilebilir (aninda etki).
- Kullanici bazli, bolge bazli, yuzde bazli segmentasyon mumkundur.
- Flag degisiklik gecmisi (audit log) tutulur.
- A/B test altyapisi hazirdir.

## 32.7. Kod Pattern'i

Feature flag kontrolu kod icinde su sekilde uygulanir:

```tsx
// Dogru yaklasim: Component render seviyesinde
function ProfileScreen() {
  if (isFeatureEnabled('new-profile')) {
    return <NewProfileScreen />;
  }
  return <OldProfileScreen />;
}
```

Onemli kurallar:

- **Flag kontrolu component render'inda yapilir**, is mantığının derinliklerine gomulmez. Bu sayede flag kaldirildiginda hangi kodu silmek gerektigi aciktir.
- **Flag kontrolu mumkun oldugunca ust seviyede tutulur**. Bir component'in icindeki 5 farkli yerde flag kontrol etmek yerine, component seviyesinde tek bir kontrol tercih edilir.
- **Nested (ic ice) flag kontrolunden kacinilir**: `if (flagA && flagB)` gibi kombinasyonlar test matrisini patlatir ve davranisi ongorulemez kilar.

## 32.8. Flag Yasam Dongusu ve Temizleme

Feature flag'ler temizlenmezse technical debt'e donusur. Bu proje kapsaminda:

### Yasam dongusu adimlari

Her feature flag su yasam dongusunden gecer:

1. **Olustur**: Flag tanimlanir. Adi, turu, varsayilan degeri, sahibi belirlenir.
2. **Kodu wrap et**: Ilgili kod, flag kontrolune sarilir.
3. **Merge / deploy**: Kod ana branch'e merge edilir ve deploy edilir. Flag kapalidir, ozellik gizlidir.
4. **Remote'dan ac**: Flag acilir (build-time ise yeni deploy ile, remote config ise dashboard'dan). Ozellik kullanicilara gosterilir.
5. **Stabil**: Ozellik sorunsuz calistigi dogrulanir. Belirli bir sure izlenir.
6. **Flag kaldir**: Flag kontrolu koddan tamamen silinir. Eski kod yolu (flag kapaliyken calisan kod) da silinir. Flag tanimi remote config'den de kaldirilir.

**6. adim zorunludur.** Flag kaldirilmadan birakilirsa "flag debt" (bayrak borcu) olusur. Zamanla kodda duzinelerce olu flag birikir, okunabilirlik duser, test karmasikligi artar.

### Temizleme sureler

- **Release flag:** Ozellik stable olduktan sonra 2 hafta icinde flag kodu kaldirilmali
- **Experiment flag:** Test sonuclandiktan sonra 1 hafta icinde kazanan varyant sabitlenip flag kaldirilmali
- **Stale flag tespiti:** 30 gunden uzun suredir degistirilmemis release/experiment flag'ler stale kabul edilir
- **CI entegrasyonu:** Stale flag uyarisi CI'da otomatik uretilmeli
- **Flag sayisi limiti:** Aktif release + experiment flag sayisi 20'yi gecmemeli (yonetilebilirlik siniri)

Her sprint'te **"stale flag review"** yapilir:
- Suresi dolmus flag'ler listelenir.
- Her birinin kaldirilmasi icin issue acilir veya o sprint'te kaldirilir.
- Remote config dashboard'undaki aktif flag sayisi izlenir. Surekli artan sayi tehlike isaretdir.

## 32.9. Test

Feature flag'li kodun test edilmesinde su kurallar gecerlidir:

- **Her flag icin hem acik hem kapali durumda test yazilir.** Yalnizca flag acikken test etmek, flag kapaliyken bozulan kodu gormezden gelmektir.
- **Default deger guvenli olmalidir.** Yeni bir ozelligin varsayilan degeri **kapali** olmalidir. Bu sayede flag sistemi cokse bile yeni (ve potansiyel olarak sorunlu) ozellik production'da kullaniciya gosterilmez.
- **Test dosyasinda flag mock'lanir.** Remote config SDK'si veya environment variable mock edilerek her iki durumda test kosulur.

```typescript
// Test ornegi
describe('ProfileScreen', () => {
  it('yeni profil ekranini gosterir (flag acik)', () => {
    mockFeatureFlag('new-profile', true);
    render(<ProfileScreen />);
    expect(screen.getByTestId('new-profile')).toBeTruthy();
  });

  it('eski profil ekranini gosterir (flag kapali)', () => {
    mockFeatureFlag('new-profile', false);
    render(<ProfileScreen />);
    expect(screen.getByTestId('old-profile')).toBeTruthy();
  });
});
```

## 32.10. Guardrail Entegrasyonu

Feature flag kullanimi su guardrail kurallarina tabidir:

- A-NEW-FEAT aktivitesinde flag kullanim zorunlulugu degerlendirilmeli
- Trunk-based development (42-branching) ile flag disiplini birlikte calismali
- Flag arkasinda kalan tamamlanmamis kod, test kapsamından muaf degildir
- Flag degisikligi production'da yapiliyorsa (remote config), deployment log'una kaydedilmeli

## 32.11. Hatali yaklasimlar

- **Flag'i hic kaldirmamak (flag debt)**: En yaygin ve en zararli hata. Flag eklenir ama asla kaldirilmaz. Zamanla kodda onlarca olu flag birikir. Hangi flag'in aktif, hangisinin olu oldugu anlasilmaz. Yeni gelistirici hangi kodu silmesi gerektigini bilemez.
- **Nested flag kontrolu**: `if (flagA && flagB && !flagC)` gibi ic ice flag kombinasyonlari test matrisini ustel olarak buyutur. 3 flag'in kombinasyonu 8 farkli senaryo demektir. Bu senaryolarin hepsini test etmek ve davranislarini anlamak pratik olarak imkansizlasir.
- **Default degeri riskli yapmak**: Yeni ozelligin varsayilan degerini "acik" yapmak. Flag sistemi cokerse veya remote config'e erisilemezse tamamlanmamis veya test edilmemis ozellik production'da kullaniciya gosterilir.
- **Flag'i is mantığının derinliklerine gommek**: Flag kontrolunu 10 farkli dosyada, 20 farkli if blogunda yapmak. Flag kaldirilacagi zaman tum bu noktalari bulmak ve temizlemek son derece zor ve hata yapmaya acik hale gelir.
- **Her kucuk degisiklik icin flag olusturmak**: Bir butonun rengini degistirmek icin flag olusturmak overengineering'dir. Flag, anlamli ve riskli ozellik degisiklikleri icin kullanilmalidir.

---

# 33. Monorepo Bağımlılık Grafiği Görselleştirme

## 33.1. Nedir ve neden gerekli?

Monorepo (tek repo içinde birden fazla paket/uygulama barındıran yapı) büyüdükçe, paketler arasındaki bağımlılık ilişkileri karmaşıklaşır. Hangi paketin hangisine bağımlı olduğu, bir paketteki değişikliğin hangi diğer paketleri etkileyeceği, döngüsel bağımlılıkların (circular dependency) olup olmadığı gözle takip edilemez hale gelir.

Bağımlılık grafiği görselleştirme, paketler arası ilişkileri grafiksel olarak gösterir ve şu soruları cevaplamasını sağlar:

1. **Circular dependency var mı?** A paketi B'ye, B paketi C'ye, C paketi tekrar A'ya mı bağımlı? Bu döngüsel bağımlılıklar build sorunlarına, runtime hatalarına ve refactoring zorluğuna neden olur.

2. **Değişiklik etki analizi**: `packages/ui/` paketinde bir değişiklik yapıldığında hangi diğer paketler etkilenir? Yalnızca etkilenen paketlerin test edilmesi ve build edilmesi CI süresini önemli ölçüde kısaltır.

3. **"God package" tespiti**: Her paketin bağımlı olduğu, aşırı büyümüş bir paket var mı? Bu paket darboğaz oluşturur: her değişiklikte tüm proje etkilenir, bakımı zorlaşır, sorumluluk sınırları belirsizleşir.

4. **Mimari sağlık değerlendirmesi**: Bağımlılık grafiği, monorepo'nun mimari sağlığının görsel bir temsilidir. Sağlıklı bir grafik, katmanlı ve yönlü bağımlılıklar gösterir (yukarıdan aşağıya). Sağlıksız bir grafik, çapraz, döngüsel ve spaghetti benzeri bağlantılar gösterir.

## 33.2. Araçlar

Monorepo bağımlılık grafiğini görselleştirmek ve analiz etmek için üç ana araç kullanılabilir:

### (1) Turborepo: `turbo run build --graph`

Turborepo, monorepo build ve task yönetimi aracıdır. `--graph` parametresi ile task bağımlılık grafiğini DOT formatında çıktı verir. DOT formatı, Graphviz ile SVG veya PNG'ye dönüştürülebilir.

```bash
# DOT formatında graph üret
turbo run build --graph=graph.dot

# SVG'ye dönüştür (Graphviz gerekli)
dot -Tsvg graph.dot -o graph.svg
```

Bu grafik, hangi paketin hangi sırayla build edileceğini ve paketler arası bağımlılık yönünü gösterir.

### (2) dependency-cruiser

dependency-cruiser, JavaScript/TypeScript projeleri için bağımlılık analiz aracıdır. Dosya seviyesinde veya paket seviyesinde bağımlılık grafiği üretir. En güçlü özelliği **kural tanımlama** yeteneğidir:

- Circular dependency tespiti ve raporlama.
- Forbidden dependency kuralları (örneğin "ui paketi doğrudan data paketine bağımlı olamaz").
- Orphan dosya tespiti (hiçbir yerden import edilmeyen dosyalar).
- SVG, DOT, HTML formatlarında görsel çıktı.

```bash
# Circular dependency kontrolü
npx depcruise --validate .dependency-cruiser.cjs packages/

# SVG graph üret
npx depcruise --output-type dot packages/ | dot -Tsvg > dependency-graph.svg
```

dependency-cruiser, `.dependency-cruiser.cjs` veya `.dependency-cruiser.json` dosyasında kural tanımı yapılmasına izin verir. Bu kurallar CI'da otomatik çalıştırılabilir.

### (3) Nx graph

Nx, monorepo yönetim aracıdır. `nx graph` komutu, tarayıcıda açılan interaktif bir web UI sunar. Bu UI'da:

- Paketler arası bağımlılıklar görsel olarak gösterilir.
- Bir pakete tıklandığında o paketin bağımlılıkları ve onu kullanan paketler vurgulanır.
- Affected (etkilenen) paketler filtrelenebilir.
- Circular dependency'ler işaretlenir.

Nx kullanmıyorsanız bu aracı yalnızca graph için eklemek gereksiz olabilir. Turborepo + dependency-cruiser kombinasyonu yeterlidir.

## 33.3. CI entegrasyonu

Bağımlılık grafiği analizi yalnızca görsel kontrol aracı olarak kullanılmamalıdır. CI pipeline'ına entegre edilmelidir.

### Circular dependency kontrolü

Her PR'da dependency-cruiser çalıştırılır. Eğer yeni bir circular dependency tespit edilirse PR **blocker** olarak işaretlenir. Mevcut circular dependency'ler (varsa) baseline olarak kaydedilir ama yeni eklenmesine izin verilmez.

```yaml
# CI pipeline adımı (kavramsal)
- name: Circular dependency kontrolü
  run: npx depcruise --validate .dependency-cruiser.cjs packages/
```

Bu kontrol, circular dependency'nin "gizlice" koda girmesini engeller. Geliştirici, döngüsel bağımlılık oluşturan import'u eklediği anda CI fail eder ve düzeltmesi istenir.

### Yeni circular dependency blocker

Kural açıktır: **Yeni circular dependency eklenmesi engellenir.** Mevcut circular dependency'ler (eski koddan kalan) ayrı bir temizlik planıyla ele alınır ama yeni eklenmesine tolerans gösterilmez.

### Affected packages: Yalnızca etkilenen paketleri build/test et

Turborepo'nun `--filter` mekanizması ile yalnızca değişen dosyaların etkilediği paketler build ve test edilir:

```bash
# Yalnızca etkilenen paketleri test et
turbo run test --filter=...[origin/main]
```

Bu sayede 20 paketlik bir monorepo'da tek bir pakette değişiklik yapıldığında 20 paketin tamamı değil, yalnızca etkilenen 3-4 paket test edilir. CI süresi önemli ölçüde kısalır.

## 33.4. Periyodik review

Bağımlılık grafiği **ayda bir** gözden geçirilmelidir. Bu review'da şu sorular sorulur:

- **Beklenmeyen coupling var mı?** Normalde birbirinden bağımsız olması gereken iki paket arasında bağımlılık oluşmuş mu? Örneğin `packages/analytics` paketi `packages/ui` paketine bağımlı hale gelmiş mi?
- **"God package" oluşumu var mı?** Bir paket, diğer tüm paketlerin bağımlı olduğu dev bir yapıya dönüşmüş mü? Bu paket darboğaz oluşturur ve bölünmesi gerekebilir.
- **Grafik karmaşıklığı artıyor mu?** Paket sayısı artarken bağımlılık çizgileri de orantısız artıyorsa, mimari sınırlar gevşiyor demektir.
- **Katmanlı yapı korunuyor mu?** Bağımlılıklar yukarıdan aşağıya (ui → domain → data → infra) mı akıyor, yoksa her yönde karışık bağlantılar mı oluşmuş?

Bu review'un çıktısı, gerekiyorsa paket bölme, bağımlılık kaldırma veya interface tanımlama gibi aksiyonlardır.

## 33.5. Hatalı yaklaşımlar

- **Graph'ı hiç kontrol etmemek**: Monorepo büyüdükçe bağımlılıklar karmaşıklaşır. Graph kontrol edilmezse circular dependency, God package ve spaghetti bağımlılıklar fark edilmeden birikir. Bir gün build'in neden 45 dakika sürdüğünü veya bir paketin değişikliğinin neden tüm projeyi etkilediğini anlamak zorlaşır.
- **Circular dependency'yi "çalışıyor" diye bırakmak**: Circular dependency bazı durumlarda runtime'da sorun çıkarmayabilir (JavaScript module resolution bunu çözebilir). Ama bu, doğru olduğu anlamına gelmez. Circular dependency refactoring'i zorlaştırır, build order'ı belirsizleştirir, test isolation'ı bozar. "Şimdilik çalışıyor" ile "doğru" arasında fark vardır.
- **Her paketin her pakete bağımlı olduğu spaghetti monorepo**: Tüm paketler birbirine bağımlıysa, monorepo'nun sağladığı isolation ve modularity avantajı kaybolur. Bu durumda monorepo aslında "tek büyük uygulama"dan farksızdır, sadece dosyalar farklı klasörlerde durur. Bağımlılık yönü ve sınırları bilinçli şekilde tasarlanmalıdır.
- **Graph'ı yalnızca görsel olarak kullanıp CI'a entegre etmemek**: Graph'a bakıp "güzel görünüyor" demek yetmez. CI'da otomatik kontrol yoksa, bir sonraki PR'da yeni circular dependency eklenebilir. Görsel inceleme periyodik review içindir; günlük koruma CI'ın işidir.

---

# 34. Governance Anti-Pattern Listesi

Aşağıdaki davranışlar bu proje kapsamında zayıf kabul edilir:

1. Doküman yazıp hiçbir enforcement kurmamak
2. Her şeyi sadece review’a bırakmak
3. Tooling ile her şeyi çözebileceğini sanmak
4. Exception’ları kayıtsız bırakmak
5. Boundary ve design system ihlallerini küçük mesele görmek
6. A11y’yi “ileride bakarız” alanı gibi yönetmek
7. Rule gürültüsünü kontrol etmemek
8. Baseline’ı af belgesine çevirmek
9. Flaky veya anlamsız CI sinyallerini normalleştirmek
10. Rule’ları neden-sonuç açıklamadan sertleştirmek
11. Governance’ı kişisel reviewer alışkanlığına bırakmak
12. Tooling seçimini popülerlik üzerinden yapmak
13. Ağır pipeline yüzünden ekibi bypass kültürüne itmek
14. Manual audit gerektiren alanları hiç tanımlamamak
15. Dokümantasyon-first yaklaşımını operasyonel sürece bağlamamak

---

# 35. Governance Kararı Verirken Sorulacak Sorular

Bir kural, araç veya süreç tanımlarken şu sorular sorulmalıdır:

1. Bu hangi kalite riskini azaltıyor?
2. Bu risk otomatik mi, yarı otomatik mi, manuel mi yönetilmeli?
3. Bu kuralın yanlış pozitif maliyeti nedir?
4. Bu kural geliştirici davranışını iyileştirir mi, yoksa sadece rahatsız eder mi?
5. Bu kuralın dokümanda açık karşılığı var mı?
6. Bu alan exception üretecekse nasıl takip edilecek?
7. Bu kontrol local mi, CI mı, audit mi olmalı?
8. Bu sistem ekip büyürse de çalışır mı?
9. Bu kural kaliteyi gerçekten koruyor mu, yoksa kozmetik mi?
10. Bu mekanizma sürdürülebilir mi?

---

# 36. Sonraki Dokümanlara Etkisi

## 36.1. Technology decision framework
`17-technology-decision-framework.md`, seçilecek araçların bu governance modelini destekleyip desteklemediğini değerlendirmelidir.

## 36.2. ADR template
`18-adr-template.md`, governance değişikliği gerektiren kararların nasıl kayıt altına alınacağını desteklemelidir.

## 36.3. Repo structure spec
`21-repo-structure-spec.md`, tooling, scripts, config ve quality support dosyalarının repo içinde nerede yaşayacağını bu belgeye göre düzenlemelidir.

## 36.4. Component governance rules
`23-component-governance-rules.md`, design system ve component lifecycle’ını bu governance modeline bağlamalıdır.

## 36.5. Contribution guide
`30-contribution-guide.md`, local doğrulama, PR beklentisi, exception politikası ve review akışını bu belgeye göre operasyonelleştirmelidir.

## 36.6. Audit checklist
`31-audit-checklist.md`, tooling ile yakalanamayan alanların audit yüzeyini bu governance modeline göre açmalıdır.

## 36.7. Definition of done
`32-definition-of-done.md`, bir işin tamamlanmış sayılması için hangi governance ve quality kriterlerinden geçmiş olması gerektiğini bu belgeye bağlamalıdır.

## 36.8. AI workflow and tooling
`40-ai-workflow-and-tooling.md`, AI araçlarının governance sistemi içindeki konumunu, talimat dosyalarının otorite sırasını ve çift ajan denetim modelini bu belgeye bağlamalıdır.

---

# 37. AI Araç Governance Modeli

Bu bölüm, AI araçlarının bu boilerplate'in tooling ve governance sistemindeki konumunu tanımlar. Detaylı AI workflow kuralları `40-ai-workflow-and-tooling.md` tarafından yönetilir; bu bölüm yalnızca governance entegrasyonunu sabitler.

## 37.1. Kapsam

Bu projede dört AI aracı aktif olarak kullanılır:

- **Claude Code:** Merkezi geliştirme motoru. CLAUDE.md talimat dosyası ile yönlendirilir.
- **MoAI-ADK:** SPEC üretimi ve modüler geliştirme orkestratörü. Claude Code'un slash command sistemi üzerinden çalışır (`/moai plan`, `/moai run`, `/moai sync`).
- **OpenAI Codex CLI:** Bağımsız kod denetimi ve PR review. AGENTS.md talimat dosyası ile yönlendirilir.
- **Google Stitch:** Arayüz tasarımı ve tema token üretimi. DESIGN.md dosyası üretir.

Bu araçlar tooling zincirinin parçasıdır. Governance kuralları aynen geçerlidir.

## 37.2. AI Çıktısı İçin Quality Gate Kuralı

AI araçlarının ürettiği kod, insan yazımı kodla birebir aynı quality gate'lerden geçer. Kaynak ayrımı yapılmaz.

Aşağıdaki bypass'lar AI aracı tarafından yapılsa dahi kabul edilmez:

- `--no-verify` ile commit
- `eslint-disable` ile lint suppress
- `@ts-ignore` ile type bypass
- test skip (`it.skip`, `describe.skip`)
- `any` type kullanımı

MoAI-ADK'nın TRUST 5 pre-submission quality gate'i (test, okunabilirlik, güvenlik, izlenebilirlik kontrolü) bu projenin CI gate'leriyle tutarlı çalışmalıdır.

## 37.3. Talimat Dosyaları Versiyon Kontrolünde Tutulur

Aşağıdaki dosyalar git'te tutulur ve PR review kapsamındadır:

- `CLAUDE.md` (Claude Code talimatları)
- `AGENTS.md` (Codex CLI talimatları)
- `.moai/config/` (MoAI-ADK konfigürasyonu)
- `DESIGN.md` (Stitch tasarım sistemi — Stitch'ten export edilir, elle düzenlenmez)

Bu dosyalardaki değişiklik, canonical katmanla (ADR-001 → ADR-017 + 36/37/38 canonical governance belgeleri) tutarlılık açısından review edilir.

## 37.4. Otorite Sırası

Talimat dosyaları (CLAUDE.md, AGENTS.md, `.moai/config/`, DESIGN.md) bu doküman setinin hiçbir katmanını geçersiz kılamaz. 35-document-map.md'deki otorite sırasında en alt seviyededirler.

Çelişki kuralı:

- Talimat dosyası ↔ boilerplate dokümanı çelişirse → talimat dosyası güncellenir.
- DESIGN.md ↔ `22-design-tokens-spec.md` çelişirse → 22 kazanır, DESIGN.md Stitch'te yeniden export edilir.
- Codex bulgusu ↔ Claude Code önerisi çelişirse → boilerplate dokümanı hakemdir.

## 37.5. Çift Ajan Denetimi

Claude Code ile yazılan kod, Codex CLI ile bağımsız review'dan geçer. İki ajanın aynı repo'da farklı talimat dosyaları (CLAUDE.md vs AGENTS.md) üzerinden çalışması, çapraz denetim sağlar.

Bu model, bu belgenin bölüm 3'teki "enforcement + audit" ikili yapısıyla örtüşür.

## 37.6. AI Araç Güvenlik Kuralları

- `.env`, credentials ve secret dosyaları AI aracının context'ine girmemeli — `.claudeignore` yapılandırılmalıdır.
- Stitch'e yüklenen tasarımlarda gerçek kullanıcı verisi kullanılmamalıdır.
- `.moai/memory/` dizini `.gitignore`'da tutulmalıdır.
- AGENTS.md review guidelines'a secret pattern tarama kuralı eklenmelidir.
- 27-security-and-secrets-baseline.md'deki kurallar AI araçları için de geçerlidir.

## 37.7. Araç Bağımsızlık İlkesi

AI araçları boilerplate'in değerini taşımaz; doküman seti taşır. Araçlar değişebilir, dokümanlar kalır. Hiçbir araç, boilerplate doküman setini veya canonical kararları kendi formatına kilitleyemez.

Bir araç kullanılamaz hale geldiğinde, o aracın talimat dosyası (CLAUDE.md, AGENTS.md vb.) ve çıktıları (SPEC'ler, DESIGN.md) repoda kalır ve insani veya alternatif araç yoluyla kullanılmaya devam eder.

---

# 38. Onay Kriterleri

Bu doküman yeterli kabul edilir eğer:

1. Tooling ve governance ayrımı net kurulmuşsa,
2. Enforce edilecek ve audit edilecek alanlar ayrılmışsa,
3. Mimari, design system, a11y, test ve dokümantasyon governance’i görünür kılınmışsa,
4. Exception ve baseline yönetimi açıkça tanımlanmışsa,
5. Local, CI ve scheduled tooling ayrımı yapılmışsa,
6. Rule lifecycle ve change management düşünülmüşse,
7. Sonraki teknoloji, contribution, audit ve DoD dokümanlarına uygulanabilir temel sağlanmışsa,
8. AI araçlarının governance içindeki konumu, otorite sırası ve güvenlik kuralları tanımlanmışsa.

---

# 39. Kısa Sonuç

Bu dokümanın ana çıktısı şudur:

> Bu boilerplate kapsamında tooling ve governance, standartları yazılı metin olarak bırakmayan; onları editor’den CI’a, review’dan audit’e, exception kaydından rule lifecycle yönetimine kadar çalışan ve sürdürülebilir kalite sistemine dönüştüren operasyonel omurgadır.

Bu nedenle bundan sonraki hiçbir doküman:
- kaliteyi yalnızca iyi niyet ve review kültürüne bırakamaz,
- exception’ları görünmez kılamaz,
- design system ve mimari governance’i toolsuz düşünemez,
- dokümantasyon-first yaklaşımını operasyonel süreçten koparamaz,
- tooling seçimini problem tanımı olmadan yapamaz.


---

# 37. Biome 2.x Pilot Politikası (2026-04-02 Eki)

Biome 2.x formatter, import organization ve commodity lint alanında güçlü adaydır; ancak bu boilerplate'te **ESLint custom governance/HIG rule engine yerine varsayılan geçiş** olarak kabul edilmez.

Kural:
- ESLint custom rule zinciri korunur
- Biome ancak pilot olarak formatter/import sorting/commodity lint yüzeyinde değerlendirilir
- Pilot kararı olmadan `.eslintrc`/flat-config ve custom plugin zinciri sökülemez
- Pilot çıktısı; performans, suppressions, editor uyumu ve custom rule coverage karşılaştırmasıyla belgelenir

---

# 38. Biome 2.x Pilot Değerlendirme Prosedürü (2026-04-02 Eki)

Watchlist'teki Biome'un ESLint + Prettier yerine değerlendirilmesi için detaylı prosedür.

## 38.1. Değerlendirme Koşulları

Biome'un Candidate statüsüne terfisi için aşağıdaki tüm koşulların sağlanması gerekir:

- [ ] Biome 2.x stable release çıktı mı?
- [ ] TypeScript 5.8+ tam destek mevcut mu?
- [ ] React/JSX lint kuralları ESLint eşdeğeri mi? (false positive/negative karşılaştırması)
- [ ] Import sorting (isort benzeri) mevcut mu?
- [ ] Tailwind CSS class sorting desteği var mı?
- [ ] CI entegrasyonu kolay mı? (`--ci` flag, JSON output, exit code davranışı)
- [ ] VS Code extension stabil mi? (formatter, lint gutter, code action)
- [ ] Migration aracı mevcut mu? (ESLint config → Biome config dönüşümü)
- [ ] Community adoption yeterli mi? (npm weekly downloads >100K, GitHub stars >10K)

## 38.2. Pilot Test Planı

1. **Kapsam seçimi:** Bir shared package'ta (ör. `packages/utils`) Biome ile ESLint/Prettier paralel çalıştırılır. Production kodu etkilenmez.
2. **Rule uyumu karşılaştırması:**
   - ESLint canonical rule set'inin Biome karşılıkları tespit edilir.
   - Biome'da karşılığı olmayan kurallar listelenir (coverage gap).
   - False positive/negative analizi: Aynı dosyalarda iki araç karşılaştırılır.
3. **Performans benchmark:**
   - Lint süresi karşılaştırması (ESLint vs Biome, aynı dosya kümesi üzerinde).
   - Beklenti: Biome'un Rust tabanlı olması nedeniyle 10-100x hızlı olması.
   - CI pipeline toplam süresine etkisi ölçülür.
4. **Deneyim süreci:** 2 sprint (4 hafta) boyunca pilot package'ta Biome kullanılır, geliştirici feedback'i toplanır.
5. **Karar:** Pilot sonuçlarına göre üç yoldan biri izlenir:
   - Başarılı → ADR yazılır, Canonical'a terfi planlanır
   - Kısmi başarılı → Yalnızca formatter/import sorting için Biome, lint için ESLint hibrit model değerlendirilir
   - Başarısız → Watchlist'te kalır, 6 ay sonra yeniden değerlendirilir

## 38.3. Kısıtlamalar

- ESLint custom governance/HIG rule engine Biome'a taşınamadığı sürece tam geçiş yapılamaz.
- Biome pilot süresince canonical ESLint konfigürasyonu korunur, paralel çalışma modeli uygulanır.
- Pilot sonucu ne olursa olsun belgelenir ve `17-technology-decision-framework.md`'de referans edilir.

---

# 39. Feature Flag Canonical Araç Değerlendirmesi (2026-04-02 Eki)

Feature flag yönetimi için araç karşılaştırması ve boilerplate kararı.

## 39.1. Araç Karşılaştırma Tablosu

| Araç | Avantaj | Dezavantaj | Maliyet | Durum |
|------|---------|-----------|---------|-------|
| Firebase Remote Config | Firebase zaten stack'te, kolay entegrasyon, real-time güncelleme | Karmaşık targeting sınırlı, A/B test desteği temel | Ücretsiz | Candidate |
| PostHog | Açık kaynak, self-host, analytics + flag birleşik | Ek altyapı gereksinimi, bakım efortu | Ücretsiz (self-host) | Watchlist |
| LaunchDarkly | Enterprise-grade, güçlü targeting, SDK kalitesi | Yüksek maliyet, küçük proje için overkill | Ücretli | Kapsam dışı |
| Unleash | Açık kaynak, self-host, güçlü API | Kurulum ve bakım efortu, UI sınırlı | Ücretsiz (self-host) | Watchlist |
| Custom (Zustand + MMKV) | Bağımlılık yok, tam kontrol, basit implementasyon | Targeting yok, analytics yok, dashboard yok | Ücretsiz | Fallback |

## 39.2. Boilerplate Kararı

- **Canonical candidate:** Firebase Remote Config (Firebase zaten canonical stack'te, ek dependency yükü minimal).
- **Custom fallback:** Basit boolean flag'ler için Zustand store + MMKV persist. Backend bağımlılığı gerektirmez.
- **Derived project esnekliği:** İhtiyaca göre PostHog veya LaunchDarkly tercih edebilir (dependency policy'ye tabi).

## 39.3. Kullanım Senaryoları

| Senaryo | Önerilen Araç | Gerekçe |
|---------|--------------|---------|
| Basit on/off feature toggle | Custom (Zustand + MMKV) | Ek altyapı gerektirmez |
| A/B test | Firebase Remote Config | Kullanıcı segmentasyonu desteği |
| Kademeli rollout (%5 → %100) | Firebase Remote Config | Yüzde bazlı targeting |
| Enterprise multi-environment | LaunchDarkly (derived project) | Gelişmiş targeting ve audit |

## 39.4. ADR Gerekliliği

Feature flag araç seçimi canonical stack'e yeni runtime dependency ekleyebileceğinden, seçim finalize edildiğinde ADR yazılmalıdır. Custom fallback için ADR gerekmez.

---

# 40. Debug Menu ve Developer Tools (2026-04-02 Eki)

Bu bölüm, development ve staging ortamlarında geliştiriciye hızlı erişim sağlayan, production'da otomatik kaldırılan debug araçlarının kapsamını, erişim mekanizmasını, içerik öğelerini, araç tercihlerini ve güvenlik kurallarını tanımlar.

---

## 40.1. Amaç

Debug menu, geliştiricilerin ve QA ekibinin development/staging ortamlarında uygulama durumunu hızlıca incelemesini, test senaryolarını kolaylaştırmasını ve sorun tespitini hızlandırmasını sağlayan merkezi bir araç panelidir.

**Temel hedefler:**
- Geliştirme süresini kısaltmak (cache temizleme, state sıfırlama, ortam bilgisi).
- QA sürecini kolaylaştırmak (push token kopyalama, crash simülasyonu, feature flag toggle).
- Debug bilgilerini tek bir noktadan sunmak (dağınık console.log yerine yapılandırılmış bilgi).
- Production güvenliğini garanti etmek (debug menu kodu production bundle'a dahil edilmez).

---

## 40.2. Debug Menu İçerik Öğeleri

| Öğe | Açıklama | Kullanım Senaryosu |
|-----|---------|-------------------|
| **Ortam Bilgisi** | App version, build number, ortam adı (`DEV`/`STG`), API base URL, Expo SDK version | Hangi build'de olduğunu hızlıca anlamak; QA raporlarında ortam bilgisi paylaşmak |
| **Feature Flag Toggle** | Aktif feature flag'leri geçici olarak açma/kapama | Geliştirme sırasında henüz release edilmemiş feature'ları test etmek |
| **Cache Invalidate All** | TanStack Query cache + MMKV persistent storage temizleme | Stale data sorunlarını debug etmek; fresh state ile test tekrarlamak |
| **Push Token Kopyala** | Expo push token'ı clipboard'a kopyalar | Push notification testi için token'ı backend veya FCM console'a yapıştırmak |
| **Crash Simulate** | Sentry test crash tetikleme (`Sentry.nativeCrash()`) | Error boundary davranışını ve Sentry entegrasyonunu doğrulamak |
| **Network Inspector** | Son N isteğin request/response logunu görme (URL, method, status, süre) | API iletişim sorunlarını yerinde debug etmek |
| **Auth State Özeti** | Mevcut auth durumu (authenticated/unauthenticated), token expiry zamanı, user ID | Auth flow sorunlarını debug etmek; token yenileme davranışını doğrulamak |
| **Store Reset** | Tüm Zustand store'ları initial state'e sıfırlama | Clean state ile test; state corruption sorunlarını izole etmek |
| **Tema Değiştir** | Light / dark / system tema modunu zorla değiştirme | Tema implementasyonunu her modda test etmek |
| **Dil Değiştir** | Uygulama dilini i18next üzerinden runtime'da değiştirme | i18n çevirilerini ve RTL layout'u test etmek |

**Genişletilebilirlik:**
- Debug menu öğeleri plugin pattern ile eklenebilir olmalıdır.
- Her öğe `label`, `action`, `category` alanlarına sahiptir.
- Kategoriler: `info`, `state`, `network`, `testing`, `ui`.

---

## 40.3. Erişim Mekanizması

### 40.3.1. Mobile (React Native / Expo)

- **Giriş yöntemi:** Settings ekranında uygulama logo'suna 7 kez art arda tap (Easter egg pattern).
- **Koşul:** `__DEV__ === true` veya `Constants.expoConfig.extra.appEnv !== "production"` iken erişilebilir.
- **Alternatif:** Shake gesture ile açılabilir (`DevSettings` API üzerinden).
- **UX:** Toast veya haptic feedback ile "Debug menu aktif" onayı gösterilir.

### 40.3.2. Web

- **Giriş yöntemi:** `Ctrl+Shift+D` (Windows/Linux) veya `Cmd+Shift+D` (macOS) keyboard shortcut.
- **Koşul:** `import.meta.env.MODE !== "production"` veya `import.meta.env.DEV === true` iken erişilebilir.
- **UX:** Ekranın sağ alt köşesinde floating panel olarak açılır; draggable ve minimize edilebilir.

### 40.3.3. Ortam Etiketi (Görsel İpucu)

- Development ve staging build'lerinde status bar'da (mobile) veya sayfa köşesinde (web) küçük bir ortam etiketi gösterilir.
- Etiket değerleri: `DEV` (yeşil), `STG` (turuncu).
- Production build'de etiket kesinlikle gösterilmez.
- Etiket boyutu küçüktür ve kullanıcı deneyimini engellemez; ancak hangi ortamda olunduğunu anında belli eder.

---

## 40.4. React Native DevTools / Flipper Pozisyonu

Bu projede debug araç tercih sırası ve pozisyonları aşağıdaki gibidir:

### 40.4.1. React Native DevTools — Canonical Birincil Araç

- React Native community'nin resmi debug aracıdır.
- **Özellikler:** Component inspector, profiler, network tab, console, layout inspector.
- Expo Dev Client ile doğrudan entegre çalışır; ek konfigürasyon gerektirmez.
- `npx react-native start` ile otomatik başlatılır.
- **Karar:** Tüm geliştiriciler birincil debug aracı olarak React Native DevTools kullanır.

### 40.4.2. Flipper — Deprecated / İkincil

- Meta'nın geliştirdiği masaüstü debug uygulamasıdır.
- React Native community Flipper'dan aktif olarak uzaklaşmaktadır (bakım azaldı, plugin ekosistemi zayıfladı).
- **Karar:** Yeni projede Flipper kullanılmaz. Mevcut derived projelerde legacy sebeplerle kullanılabilir ancak önerilmez.
- Migration yolu: Flipper plugin'leri yerine React Native DevTools + custom debug menu karşılıkları kullanılır.

### 40.4.3. Standalone react-devtools

- `npx react-devtools` ile çalıştırılan bağımsız React DevTools uygulaması.
- React Native DevTools yeterli olduğunda kullanılması gerekmez.
- Geri uyumluluk veya spesifik profiling ihtiyaçları için mevcuttur.

### 40.4.4. Reactotron — Watchlist

- Zustand store inspector olarak değerlendirilebilir.
- **Durum:** Watchlist — canonical araç değildir ama derived projelerde pilot yapılabilir.
- Zustand DevTools middleware (`devtools`) zaten browser/React Native DevTools ile entegre çalıştığından öncelik düşüktür.

---

## 40.5. Production'da Kaldırma Garantisi

Debug menu ve developer tools kodunun production build'e sızmaması kritik güvenlik ve performans gereksinimidir.

### 40.5.1. Conditional Import

- Debug menu component'i `__DEV__` flag veya `process.env.NODE_ENV` kontrolü ile conditional import edilir.
- Örnek pattern:

```typescript
// apps/mobile/src/components/DebugMenu/index.ts
let DebugMenu: React.ComponentType | null = null;

if (__DEV__) {
  // Yalnızca development'ta import edilir
  DebugMenu = require("./DebugMenuPanel").DebugMenuPanel;
}

export { DebugMenu };
```

### 40.5.2. Tree-Shaking

- Production build'de `__DEV__` dalı dead code olarak işaretlenir.
- Metro (mobile) ve Vite/Rollup (web) tree-shaking ile bu kodu bundle'dan çıkarır.
- `sideEffects: false` package.json ayarı tree-shaking etkinliğini artırır.

### 40.5.3. CI Sanity Check

- Production bundle oluşturulduktan sonra otomatik string taraması yapılır.
- Taranan string'ler: `"debug-menu"`, `"DebugMenu"`, `"debugMode"`, `"DebugPanel"`, `"__debug__"`.
- Bu string'lerden herhangi biri production bundle'da bulunursa → CI uyarı üretir.
- Kural: CI uyarısı halinde debug menu kodu production'a sızmış demektir; merge bloklanır.

### 40.5.4. Bundle Analyzer Doğrulaması

- Bundle analyzer çıktısında debug-related chunk veya modül görülmemelidir.
- `vite-bundle-analyzer` (web) ve `react-native-bundle-visualizer` (mobile) ile periyodik kontrol.
- Debug menu kaynak dosyaları bundle graph'ta görünüyorsa → leak tespit edilmiştir.

---

## 40.6. Debug Menu Anti-Pattern Listesi

Aşağıdaki davranışlar bu repo'da doğrudan zayıf kabul edilir ve kabul edilemezdir:

1. **Debug menu'yü production build'de erişilebilir bırakmak** — Kullanıcıya internal araçları açmak güvenlik ve UX açısından kabul edilemez.
2. **Debug menu içinde production API key veya user token göstermek** — Secret sızıntısı riski; debug menu'de yalnızca non-sensitive bilgiler gösterilir (ortam adı, version, expiry zamanı — token kendisi değil).
3. **`console.log` ile debugging yapıp production'da bırakmak** — Console çıktısı production'da strip edilir; kalıcı log ihtiyacı varsa Sentry breadcrumb veya yapılandırılmış logger kullanılır.
4. **Debug menu'yü her ekrana ayrı ayrı eklemek** — Debug menu global (app root seviyesinde) tek noktadan mount edilir; ekran bazlı dağılım bakım yükünü artırır ve tutarsızlık oluşturur.
5. **Debug menu'den production API'ye istek göndermek** — Debug araçları yalnızca mevcut ortamın API'sine istek gönderir; cross-environment erişim yasaktır.
6. **Debug menu'yü test etmemek** — Debug menu de bir component'tir; temel render ve action testleri yazılmalıdır (ancak sadece development test suite'inde).
7. **Flipper'ı yeni projede canonical araç olarak kurmak** — Flipper deprecated pozisyondadır; React Native DevTools canonical birincil araçtır.

---

# 41. Developer Experience (DX) Standardı

Bu bölüm, geliştirici deneyiminin ölçülebilir hedeflerini, izlenmesi gereken metrikleri ve önerilen araç setini tanımlar. DX iyileştirmesi, governance kurallarının sürdürülebilirliğinin ön koşuludur.

## 41.1. DX Metrikleri ve Hedefler

| Metrik | Hedef | Ölçüm Yöntemi |
|--------|-------|----------------|
| Dev server başlatma süresi (web) | < 5 saniye | `pnpm dev` komutundan "ready" mesajına kadar |
| Dev server başlatma süresi (mobile) | < 15 saniye | `pnpm dev:mobile` komutundan QR kod gösterimine kadar |
| Hot reload / Fast Refresh başarı oranı | > %95 | Manuel gözlem + Expo Dev Client istatistikleri |
| TypeScript incremental type-check | < 30 saniye | `pnpm typecheck` süresi (warm cache) |
| ESLint check (incremental) | < 15 saniye | `pnpm lint` süresi (changed files) |
| PR CI feedback süresi | < 5 dakika | CI başlangıcından sonuç bildirimine kadar |
| Full build süresi (from cache) | < 2 dakika | Turborepo cache hit durumunda |

## 41.2. IDE Önerileri

Aşağıdaki VS Code extension'ları geliştirici deneyimini doğrudan iyileştirir ve önerilir:

| Extension | Açıklama |
|-----------|----------|
| ESLint | Kod kalitesi ve hata tespiti |
| Prettier | Otomatik format |
| Tailwind CSS IntelliSense | Tailwind class otomatik tamamlama |
| TypeScript Nightly | Güncel TypeScript dil desteği |
| Error Lens | Hataları satır içinde gösterme |
| Pretty TypeScript Errors | TypeScript hatalarını okunabilir yapma |
| GitLens | Git history ve blame görünürlüğü |

JetBrains IDE'ler (WebStorm) de desteklenir; eşdeğer plugin'ler mevcuttur.

## 41.3. Debug Araçları

| Araç | Kullanım | Platform |
|------|----------|----------|
| React Native DevTools | Component tree, profiler, network | iOS + Android |
| Expo Dev Client | Hot reload, dev menu, native log | iOS + Android |
| React DevTools (standalone) | Component inspection, profiling | Web + Mobile |
| Chrome DevTools | Network, console, performance | Web |
| Reactotron | State inspection, API monitoring | iOS + Android (opsiyonel) |

**Kural:** Flipper deprecated pozisyondadır; yeni projelerde canonical olarak kurulmaz. React Native DevTools birincil araçtır.

## 41.4. DX Anti-pattern'ler

- CI'da 10+ dakika bekletmek (bağlam değişikliği maliyeti çok yüksek)
- Hata mesajı vermeyen lint kuralları (geliştirici neden fail ettiğini anlamaz)
- Development ortamında production-only kontrolleri çalıştırmak (gereksiz yavaşlama)
- Readme ve onboarding dokümanlarını güncel tutmamak (yeni geliştiriciler zorluk çeker)
- Tek bir config hatası için tüm CI'ı tekrar çalıştırmak (izole task çalıştırma eksikliği)
