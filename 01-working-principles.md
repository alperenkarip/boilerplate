# 01-working-principles.md

## Doküman Kimliği

* **Doküman adı:** Working Principles
* **Dosya adı:** `01-working-principles.md`
* **Doküman türü:** Principle / governance foundation document
* **Durum:** Accepted
* **Kapsam:** Bu boilerplate kapsamında düşünme biçimini, karar alma disiplinini, kalite eşiğini, kabul edilen ve reddedilen yaklaşımları tanımlar.
* **Bağımlılık seviyesi:** Çok yüksek
* **Bağlı olduğu üst doküman:** `00-project-charter.md`
* **Doğrudan etkileyeceği dokümanlar:**

  * `02-product-platform-philosophy.md`
  * `03-ui-ux-quality-standard.md`
  * `04-design-system-architecture.md`
  * `05-theming-and-visual-language.md`
  * `06-application-architecture.md`
  * `07-module-boundaries-and-code-organization.md`
  * `08-navigation-and-flow-rules.md`
  * `09-state-management-strategy.md`
  * `10-data-fetching-cache-sync.md`
  * `11-forms-inputs-and-validation.md`
  * `12-accessibility-standard.md`
  * `13-performance-standard.md`
  * `14-testing-strategy.md`
  * `15-quality-gates-and-ci-rules.md`
  * `16-tooling-and-governance.md`
  * `17-technology-decision-framework.md`
  * `19-roadmap-to-implementation.md`

---

# 1. Amaç

Bu dokümanın amacı, boilerplate kapsamında üretilecek her kararın, her dokümanın, her teknik önerinin ve ileride yazılacak her implementasyonun hangi çalışma prensipleri altında değerlendirileceğini sabitlemektir.

Bu doküman “genel iyi uygulamalar listesi” değildir.
Bu doküman, kalite eşiğini ve karar alma refleksini yazılı hale getiren temel yönetim metnidir.

Bu nedenle burada yazılan kurallar:

* isteğe bağlı öneri olarak değil,
* proje standardı olarak,
* sonraki dokümanları sınırlandıran kural seti olarak,
* gerektiğinde denetim kriteri olarak

ele alınmalıdır.

Bu doküman şu sorulara net cevap verir:

1. Bu proje kapsamında nasıl düşünülmeli?
2. Hangi tür cevap ve öneriler kabul edilir?
3. Hangi tür yaklaşımlar zayıf veya hatalı kabul edilir?
4. Kararlar hangi kriterlere göre alınmalıdır?
5. Belirsizlik nasıl yönetilmelidir?
6. Erken aşamada neler yapılmamalıdır?
7. Kalite nasıl korunmalıdır?

---

# 2. Neden Bu Doküman Gerekli

Cross-platform, design-system-first ve documentation-first çalışan projelerde en büyük sorunlardan biri, kalite standardının kişisel dikkat seviyesine bırakılmasıdır.

Bu durumda şu bozulmalar ortaya çıkar:

* aynı projede farklı konuşmalarda farklı kalite standardı kullanılır,
* karar verme biçimi kişiye, zamana veya ruh haline göre değişir,
* bir gün çok sert olan kural ertesi gün esnetilir,
* dokümanlar aynı dili konuşmaz,
* mimari ve UI kararları arasında tutarsızlık oluşur,
* “bunu neden böyle yaptık?” sorusu cevapsız kalır,
* projede neyin kabul edilebilir, neyin zayıf olduğu belirsizleşir.

Bu dokümanın amacı tam olarak bu dağınıklığı engellemektir.

Bu belge olmadan proje şu riske girer:

* charter hedef koyar ama uygulama disiplini oluşmaz,
* sonraki dokümanlar teknik olarak dolu görünür ama aynı çalışma mantığını taşımaz,
* boilerplate kurallı değil, yalnızca metin olarak zengin hale gelir.

Bu nedenle `01-working-principles.md`, proje charter’dan sonra gelen ilk zorunlu belgedir.

---

# 3. Üst Düzey Çalışma İlkesi

Bu boilerplate kapsamında temel çalışma ilkesi şudur:

> Hızlı ama gevşek başlangıç yerine, kararları açık, kalite eşiği net, dokümantasyonla yönlendirilen, denetlenebilir ve sürdürülebilir başlangıç tercih edilir.

Bu cümle basit görünse de, proje boyunca çok sayıda kararı etkiler.

Bu ilkenin pratik anlamı şudur:

* koddan önce düşünce sistemi kurulmalıdır,
* teknoloji seçiminden önce karar kriteri yazılmalıdır,
* component üretmeden önce design system sınırları çizilmelidir,
* repo oluşturmadan önce mimari ve package mantığı tanımlanmalıdır,
* “çalışıyor olması” kalite için yeterli sayılmamalıdır,
* gelecekte sorun doğuracak zayıf başlangıçlar erken aşamada reddedilmelidir.

---

# 4. Temel Çalışma Prensipleri

## 4.1. Documentation-first

Bu proje kapsamında dokümantasyon ikincil açıklama katmanı değildir.
Dokümantasyon, kararı veren ve implementasyonu yöneten ana sistemdir.

### Bu ilkenin zorunlu sonucu

Aşağıdaki alanlar mümkün olduğunca implementasyondan önce yazılı hale getirilmelidir:

* problem tanımı,
* ürün yaklaşımı,
* platform ilişkisi,
* UI/UX kalite standardı,
* design system yapısı,
* mimari sınırlar,
* state ve veri stratejisi,
* test ve kalite kapıları,
* teknoloji karar kriterleri.

### Bu ilkenin reddettiği yaklaşım

Aşağıdaki yaklaşım bu proje kapsamında zayıf kabul edilir:

* önce kodlayalım,
* sonra dokümana dökeriz,
* önce fikir otursun sonra kural yazarız,
* önce repo çıksın sonra düzenleriz.

Bu yaklaşım kısa vadede pratik görünür ama orta vadede kaliteyi bozar.

## 4.2. Specification-first

Her önemli alan için belirsiz anlatım yeterli kabul edilmez.
Önemli alanlarda beklentinin, sınırın ve kullanım niyetinin spesifik biçimde tanımlanması gerekir.

### Uygulama alanları

* component davranışı,
* form davranışı,
* navigation akışı,
* shared vs platform-specific kararları,
* theming ve token mantığı,
* test kapsamı,
* kalite kapıları.

### Bu ilkenin amacı

Yorum farkını azaltmak.
Aynı cümleyi üç kişi üç farklı anlamda yorumlayabiliyorsa, doküman eksik kabul edilmelidir.

## 4.3. Governance-first

Kalite yalnızca iyi niyetle korunmaz. Kural, denetim ve enforcement ile korunur.

### Bunun anlamı

Mümkün olan her alanda kalite şu yollarla işletilebilir hale getirilmelidir:

* lint kuralları,
* typecheck,
* component contract,
* design token sistemi,
* CI gate,
* checklist,
* audit,
* exemption policy,
* ADR kayıtları.

### Reddedilen yaklaşım

* ekip dikkat ederse olur,
* review’da bakarız,
* şimdilik elle kontrol edelim,
* kural yazmaya gerek yok, herkes bilir.

Bu yaklaşım ölçeklenmez.

## 4.4. System over taste

Bu proje kapsamında kişisel zevk, sistemin önüne geçemez.

### Ne demek?

Aşağıdaki kararlar kişisel beğeni üzerinden alınamaz:

* spacing kullanımı,
* typography seçimi,
* color kullanımı,
* component varyasyonları,
* navigation davranışları,
* platform farklılaştırma kararı,
* animasyon kullanımı,
* layout kuralları.

### Ne üzerinden alınmalı?

* ürün davranış ihtiyacı,
* platform ilkeleri,
* design system standardı,
* accessibility gereksinimi,
* performans etkisi,
* bakım maliyeti,
* test edilebilirlik.

## 4.5. Native quality is non-negotiable

Cross-platform yaklaşım, native kaliteyi düşürmek için mazeret olarak kullanılamaz.

### Uygulamadaki sonucu

* ortaklaştırma kalitesizliği meşrulaştırmamalıdır,
* platform davranış farkları yok sayılmamalıdır,
* mobile için doğal olan bir etkileşim web’e kör biçimde taşınmamalıdır,
* web’in güçlü olduğu davranışlar mobile zorla dayatılmamalıdır.

## 4.6. Long-term sustainability over short-term convenience

Kısa vadede kolay görünen ama uzun vadede borç çıkaran kararlar bu proje kapsamında dikkatle sorgulanmalıdır.

### Örnekler

* her şeyi tek app içine koymak,
* package ayrımını düşünmeden ilerlemek,
* token yerine hardcoded değer kullanmak,
* state türlerini karıştırmak,
* form davranışını feature bazında rastgele çözmek,
* test stratejisini sonraya bırakmak.

Bu kararlar erken aşamada pratik görünür ama maliyet biriktirir.

---

# 5. Cevap ve Yönlendirme Standardı

Bu bölüm, proje kapsamında üretilecek analizlerin, önerilerin ve dokümanların nasıl bir dil ve yapı ile üretilmesi gerektiğini tanımlar.

## 5.1. Netlik zorunluluğu

Cevaplar:

* kısa olmak zorunda değildir,
* ama açık olmak zorundadır,
* teknik olmak zorundadır,
* operasyonel olmak zorundadır,
* denetlenebilir olmak zorundadır.

Yüzeysel ama kısa cevap, bu proje için değerli kabul edilmez.

## 5.2. Muğlaklık yasağı

Aşağıdaki tür cümleler kendi başına yeterli kabul edilmez:

* duruma göre değişir,
* şöyle de olabilir,
* buna bakmak lazım,
* genel olarak böyle önerilir,
* genelde ekipler bunu yapar.

Bu tür ifadeler ancak şu durumda kabul edilir:

* gerçekten belirsiz alan varsa,
* belirsizliğin nedeni açıklanıyorsa,
* hangi karar bilgisinin eksik olduğu söyleniyorsa,
* nasıl netleştirileceği öneriliyorsa.

## 5.3. Gerekçesiz öneri yasağı

Bu proje kapsamında hiçbir kritik öneri yalnızca sonuç cümlesi olarak verilmemelidir.

Her önemli öneri en az şu soruların çoğuna cevap vermelidir:

* neden bu yön?
* neyi çözüyor?
* neyi engelliyor?
* alternatifine göre farkı ne?
* riskleri ne?
* hangi doküman veya kural alanına bağlanıyor?

## 5.4. Sert ama teknik değerlendirme ilkesi

Bir yaklaşım zayıfsa açıkça zayıf denmelidir.

Yumuşatılmaması gereken durumlar:

* erken teknoloji kilidi,
* tasarım sistemi dışı UI üretimi,
* hardcoded değer normalleştirme,
* belgesiz mimari kararı,
* shared code takıntısı,
* sonradan düzeltiriz yaklaşımı,
* kalite kapısı olmadan production-ready söylemi.

Bu proje kapsamında “nazik ama boş” değerlendirme yerine “sert ama teknik” değerlendirme tercih edilir.

## 5.5. Yapılandırılmış çıktı tercihi

Mümkün olduğunda cevaplar şu düzenle verilmelidir:

* net değerlendirme,
* gerekçeler,
* riskler,
* açık noktalar,
* önerilen sonraki adım.

Bu yapı zorunlu kalıp değildir ama varsayılan tercih olmalıdır.

---

# 6. Çıkarım, Varsayım, Öneri ve Karar Alanı Ayrımı

Bu proje kapsamında dört kavram birbirine karıştırılmamalıdır.

## 6.1. Geçmiş konuşmalardan çıkarım

Bu, kullanıcının daha önce net biçimde ortaya koyduğu eğilimlerden türetilen sonuçtur.

### Örnek

* design system disiplini önemli,
* Apple HIG hassasiyeti yüksek,
* erkenden kod yerine dokümantasyon tercih ediliyor,
* shared code körlemesine istenmiyor.

Bu tür çıkarımlar güçlü referans sayılabilir.

## 6.2. Varsayım

Bu, henüz doğrudan kanıtı olmayan ama bağlama göre güçlü görünen yorumdur.

### Varsayım kullanırken yapılması gereken

* varsayım olduğu açıkça yazılmalı,
* sanki kesin bilgiymiş gibi sunulmamalı,
* mümkünse nasıl doğrulanacağı belirtilmeli.

## 6.3. Öneri

Bu, mevcut bağlama göre en doğru yön olarak sunulan öneridir.

Öneri, geçmiş çıkarım veya varsayımla karıştırılmamalıdır.

## 6.4. Kritik karar alanı

Bu, henüz kesinleştirilmeden ilerlenirse ileride maliyet üretecek alandır.

Örneğin:

* navigation yaklaşımı,
* state stratejisi,
* theming mantığı,
* package ayrımı,
* parity seviyesi,
* test stratejisi.

Bu alanlar, doğrudan cevap yerine önce karar çerçevesi gerektirebilir.

---

# 7. Belirsizlik Yönetimi Prensipleri

Bu proje kapsamında belirsizlik saklanmamalıdır.

## 7.1. Belirsizlik varsa açıkça işaretlenir

Bir konu net değilse, şu netlikle yazılmalıdır:

* hangi alan belirsiz,
* neden belirsiz,
* bu belirsizlik neden kritik,
* netleşmeden karar verilirse ne olur,
* netleştirmek için hangi bilgi gerekir.

## 7.2. Uydurma kesinlik yasaktır

Eksik veri varken kesin cümle kurmak, kaliteli analiz değildir.
Bu proje kapsamında bu davranış doğrudan hatalı kabul edilir.

## 7.3. Belirsizlik karar erteleme bahanesi de olmamalıdır

Her belirsizlikte durup kalınmaz.
Bazı durumlarda yapılması gereken şudur:

* belirsiz alanı etiketlemek,
* kritik değilse geçici karar almak,
* bunu “geçici karar” diye işaretlemek,
* yeniden değerlendirme tetikleyicisi yazmak.

## 7.4. Kritik belirsizlik tanımı

Aşağıdaki alanlar kritik belirsizlik sayılır:

* ürün tipi ve hedef kullanım yoğunluğu,
* parity seviyesi,
* shared vs platform-specific sınırı,
* package/monorepo ihtiyacı,
* state/data stratejisi,
* theming modeli,
* navigation yapısı.

Bu alanlarda hızlı ama belirsiz karar tehlikelidir.

---

# 8. Erken Aşama Yasakları

Bu bölüm özellikle önemlidir. Çünkü proje kalitesini en çok bozan şey, yanlış sırayla yapılan doğru işlerdir.

## 8.1. Erken kod yasağı

Kullanıcı açıkça istemedikçe ve dokümantasyon zemini oluşmadıkça şu alanlarda öneri yapılmamalıdır:

* boilerplate kodu,
* repo skeleton’ı,
* klasör ağacı,
* component implementasyonu,
* örnek screen yapısı,
* framework kurulumu,
* seçilmiş stack üzerinden başlangıç komutu.

Bu yasak mutlak değildir. Ancak varsayılan davranıştır.

## 8.2. Erken teknoloji kilidi yasağı

Aşağıdaki alanlarda kriter ve karar çerçevesi yazılmadan nihai seçim yapılması zayıf kabul edilir:

* navigation çözümü,
* state aracı,
* data/cache çözümü,
* form/validation omurgası,
* theming/styling sistemi,
* monorepo/package modeli,
* visual regression yaklaşımı,
* analytics/observability altyapısı.

## 8.3. Erken soyutlama yasağı

Henüz problem yeterince net değilken aşırı jenerik abstraction kurmak, bu proje kapsamında hatalıdır.

### Örnek zayıf soyutlamalar

* her ekrana uysun diye anlamsız container sistemleri,
* her state tipini aynı katmanda toplamaya çalışma,
* UI primitive ile gerçek component sınırını bulanıklaştırma,
* platform farklılıklarını baştan aşırı soyutlama.

## 8.4. Erken production-grade iddiası yasağı

Kalite kapıları, test yaklaşımı, a11y ve performans standardı netleşmeden “production-ready” ifadesi kullanılmamalıdır.

---

# 9. Kabul Edilen Güçlü Yaklaşımlar

Bu bölüm, projede desteklenecek düşünme ve üretim biçimlerini sabitler.

## 9.1. Karar çerçevesi ile ilerlemek

Önce seçenekleri, kriterleri ve riskleri görünür kılmak; sonra seçim yapmak güçlü yaklaşımdır.

## 9.2. Document map mantığı

Dokümanlar birbirinden bağımsız değil, birbirini yöneten ağ yapısı olarak ele alınmalıdır.

## 9.3. Kural seti ile UI üretmek

Tokens, semantic tokens, primitives, components, patterns ve screen/flow düzeylerinin ayrılması güçlü yaklaşımdır.

## 9.4. Shared vs platform-specific kararı gerekçeli vermek

Kör ortaklaştırma değil; gerekçeli ayrım güçlü yaklaşımdır.

## 9.5. Riskleri erken yazmak

Zayıf görünen alanları konuşmanın başında görünür kılmak güçlü yaklaşımdır.

## 9.6. Audit zihniyetiyle tasarlamak

“Bu uygulanınca nasıl denetlenecek?” sorusunu baştan sormak güçlü yaklaşımdır.

## 9.7. Type-safe, testable, enforceable yapı hedeflemek

Bu üçlü birlikte düşünülmelidir. Bunlardan biri eksikse kalite modeli yarım kalır.

---

# 10. Reddedilen Zayıf Yaklaşımlar

Aşağıdaki yaklaşım türleri bu proje kapsamında doğrudan zayıf kabul edilir.

## 10.1. Mimari zayıflıklar

* her şeyin shared alanına atılması,
* UI, domain, data ve state’in iç içe geçmesi,
* package ayrımı hiç düşünülmeden tek uygulama mantığında ilerlenmesi,
* “sonra ayırırız” yaklaşımı,
* reusable gibi görünen ama bağlama gömülü yapılar.

## 10.2. UI / UX zayıflıkları

* hardcoded değerler,
* tasarım sistemi dışında rastgele bileşenler,
* tutarsız touch target,
* safe area ihlali,
* accessibility sonradan eklenir yaklaşımı,
* navigation davranışlarını platformdan kopuk tasarlamak,
* motion kullanıp reduced motion düşünmemek.

## 10.3. Süreç zayıflıkları

* belgesiz sistem önerisi,
* neden açıklanmadan teknoloji seçimi,
* review’a güvenip kural yazmamak,
* dokümanla implementasyon arasındaki bağı kurmamak,
* kaliteyi niyet düzeyinde bırakmak.

## 10.4. Dil ve analiz zayıflıkları

* fazla genel anlatım,
* süslü ama boş ifade,
* gerçek risk yazmamak,
* karşılaştırma yapmadan öneri vermek,
* belirsizliği saklamak,
* sert değerlendirilmesi gereken alanı yumuşatmak.

---

# 11. Definition of Acceptable

Bu proje kapsamında bir öneri, doküman veya karar aşağıdaki koşulları sağlıyorsa kabul edilebilir sayılır:

1. Problemi net tanımlıyorsa,
2. Kapsamı belirliyorsa,
3. Gerekçesi varsa,
4. Risklerini saklamıyorsa,
5. Hangi diğer dokümanlara bağlandığı görünüyorsa,
6. Uygulanabilir ve denetlenebilir ise,
7. UI/UX, mimari ve sürdürülebilirlik açısından tutarlıysa,
8. Gereksiz hype, gereksiz abstraction veya gereksiz komplekslik içermiyorsa.

---

# 12. Definition of Rejected

Aşağıdaki özellikleri taşıyan bir öneri veya karar reddedilmiş kabul edilir:

1. Belgesiz ise,
2. Gerekçesiz ise,
3. Kısa vadeli rahatlık uğruna uzun vadeli borç üretiyorsa,
4. Shared code oranını kalite önüne koyuyorsa,
5. Native kaliteyi zayıflatıyorsa,
6. Tasarım sistemi disiplinini deliyorsa,
7. A11y, test veya performansı sonradan ele alınacak konu gibi görüyorsa,
8. Kişisel zevki sistemin önüne koyuyorsa,
9. Belirsizliği saklıyorsa,
10. “sonra toparlarız” yaklaşımına dayanıyorsa.

---

# 13. Geçici Çözüm Politikası

Bu proje kapsamında geçici çözümler tamamen yasak değildir. Ancak kontrolsüz geçici çözüm yasaktır.

## 13.1. Geçici çözüm ne zaman kabul edilebilir?

Sadece şu durumda:

* kritik blokajı aşmak için gerçekten gerekiyorsa,
* ana standardı kalıcı biçimde bozmuyorsa,
* açıkça geçici olduğu yazılıyorsa,
* kaldırılma koşulu tanımlanıyorsa,
* kalıcı çözüm için yol haritası varsa.

## 13.2. Geçici çözüm etiketi zorunluluğu

Geçici karar verildiyse şunlar yazılmalıdır:

* neden geçici,
* hangi riski alıyor,
* ne zaman kaldırılacak,
* ne olursa yeniden değerlendirilecek.

## 13.3. Reddedilen geçici çözüm davranışı

* sessiz workaround,
* kod içine gömülü açıklamasız istisna,
* geçici çözümün normal akışa dönüşmesi,
* “şimdilik dursun” deyip iz bırakmamak.

---

# 14. Teknoloji Kararı İçin Çalışma Prensipleri

Bu bölüm teknoloji seçim belgesinin yerine geçmez. Ancak teknoloji seçimlerinin hangi zihniyetle ele alınacağını sabitler.

## 14.1. Modernlik tek başına kriter değildir

Yeni olması doğru olduğu anlamına gelmez.

## 14.2. Popülerlik tek başına kriter değildir

Çok kullanılıyor olması proje için doğru olduğu anlamına gelmez.

## 14.3. DX tek başına yeterli değildir

Geliştirici deneyimi iyi olsa bile:

* sürdürülebilirlik,
* test edilebilirlik,
* lock-in riski,
* a11y desteği,
* performans,
* bakım yükü

değerlendirilmeden seçim yapılamaz.

## 14.4. Erken seçim yerine önce kriter

Kritik teknolojilerde önce değerlendirme kriteri yazılmalıdır, sonra seçim yapılmalıdır.

## 14.5. POC gerektiğinde bunu açıkça söylemek gerekir

Teorik tartışma ile çözülemeyecek alanlarda POC ihtiyacı açıkça belirtilmelidir.

---

# 15. Çalışma Sırası Disiplini

Bu proje kapsamında sıranın korunması kaliteyi doğrudan etkiler.

## 15.1. Varsayılan sıralama

1. problem tanımı,
2. çalışma ilkeleri,
3. ürün/platform felsefesi,
4. UI/UX kalite standardı,
5. design system mimarisi,
6. application architecture,
7. state/data stratejisi,
8. navigation ve flow,
9. forms/validation,
10. accessibility,
11. performance,
12. testing ve quality gates,
13. tooling ve governance,
14. technology decision framework,
15. roadmap to implementation,
16. implementasyon.

## 15.2. Sıra neden önemlidir?

Çünkü yanlış sırayla yapılan doğru işler bile maliyet üretir.

Örnek:

* design system tanımlamadan component yazmak,
* state stratejisi olmadan data layer konuşmak,
* parity kararı vermeden navigation tasarlamak,
* quality gates olmadan boilerplate’i production-ready görmek.

---

# 16. Bu Dokümanın Zorunlu Sonuçları

Bu doküman tamamlandığında aşağıdaki sonuçlar sabitlenmiş kabul edilir:

1. Bu proje kapsamında yüzeysel, muğlak ve blogvari yönlendirme kabul edilmeyecektir.
2. Çıkarım, varsayım, öneri ve karar alanı birbirinden ayrılacaktır.
3. Belirsizlik saklanmayacak, görünür kılınacaktır.
4. Erken kod ve erken teknoloji kilidi varsayılan olarak reddedilecektir.
5. Kural, zevkin önünde tutulacaktır.
6. Quality governance baştan düşünülmek zorundadır.
7. Dokümansız sistem önerisi kabul edilmeyecektir.
8. Sonraki tüm dokümanlar bu çalışma prensiplerine uymak zorundadır.

---

# 17. Sonraki Dokümanlara Rehberlik Soruları

Bu dokümandan sonra üretilecek her belge şu sorulara cevap verebilmelidir:

* Bu doküman hangi problemi çözüyor?
* Karar alanı net mi?
* Gerekçe yeterince açık mı?
* Uygulanabilirlik var mı?
* Denetim zemini var mı?
* Belirsiz alanlar işaretlenmiş mi?
* System-over-taste ilkesi korunmuş mu?
* Kısa vadeli kolaylık uğruna kalite zayıflatılmış mı?

Bu sorulara tatmin edici cevap veremeyen belge, içerik olarak dolu görünse bile kalite olarak zayıf kabul edilmelidir.

---

# 18. Kısa Sonuç

Bu dokümanın ana işlevi, boilerplate kapsamında üretilecek her şey için ortak çalışma zihniyetini sabitlemektir.

Bu belgenin en net çıktısı şudur:

> Bu projede doğru cevap vermek yetmez; doğru sırayla, doğru gerekçeyle, doğru kalite standardında ve doğru denetim mantığıyla ilerlemek gerekir.

Bu nedenle `01-working-principles.md`, yalnızca prensip listesi değil; bundan sonraki bütün teknik, tasarımsal ve süreç kararlarının referans çalışma rejimidir.
