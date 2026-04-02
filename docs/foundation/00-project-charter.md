# 00-project-charter.md

## Doküman Kimliği

* **Doküman adı:** Project Charter
* **Dosya adı:** `00-project-charter.md`
* **Doküman türü:** Charter / foundation document
* **Durum:** Accepted
* **Kapsam:** Boilerplate seviyesinde temel yön, amaç, kapsam, başarı kriterleri ve sınırlar
* **Bağımlılık seviyesi:** En yüksek
* **Bu dokümana bağlı olacak dokümanlar:**

  * `01-working-principles.md`
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

Bu dokümanın amacı, oluşturulacak cross-platform boilerplate için en üst seviye yön belgesini tanımlamaktır. Bu belge, boilerplate’in neden var olduğunu, hangi problemi çözdüğünü, hangi kalite düzeyini hedeflediğini, hangi sınırlar içinde çalışacağını ve hangi durumların bu boilerplate kapsamında kabul edilip edilmeyeceğini sabitler.

Bu belge açıklama notu değildir. Bu belge, sonraki bütün dokümanların hangi çerçevede yazılacağını belirleyen ana referanstır.

Bu nedenle bu doküman şu sorulara açık ve denetlenebilir cevap vermek zorundadır:

1. Bu boilerplate neden oluşturuluyor?
2. Hangi ürün sınıfları için temel oluşturacak?
3. Hangi kalite standardını varsayılan kabul edecek?
4. Hangi problemleri baştan çözmek zorunda?
5. Hangi problemleri çözmeyi hedeflemiyor?
6. Hangi kararlar bu seviyede alınmalı, hangileri daha sonra ele alınmalı?
7. Hangi başarısızlık türleri bu boilerplate için kabul edilemez?

---

# 2. Arka Plan ve Problem Tanımı

## 2.1. Bağlam

Cross-platform ürün geliştirme süreçlerinde en sık görülen yapısal hata, başlangıç aşamasında hızlı repo kurulumuna odaklanılıp karar sisteminin sonraya bırakılmasıdır. Bunun sonucu genellikle aşağıdaki sorunlardır:

* web ve mobil tarafının kısa sürede birbirinden kopması,
* ortak ürün mantığı yerine ayrı ayrı uygulama davranışları oluşması,
* shared code kavramının yanlış kullanılması,
* tasarım sisteminin sonradan toparlanmaya çalışılması,
* kalite kapılarının proje ilerledikten sonra eklenmeye çalışılması,
* teknoloji seçiminin belgesiz ve kişisel tercihlere dayanması,
* mimari sınırların geç tanımlanması,
* test, erişilebilirlik ve performansın ikincil alanlara itilmesi,
* ekip büyüdükçe proje kalitesinin hızla bozulması.

Bu boilerplate, tam olarak bu yanlış başlangıç modelini engellemek için tasarlanacaktır.

## 2.2. Çözülmesi Gereken Temel Problem

Bu boilerplate’in çözmesi gereken ana problem, “yeni projeye çabuk başlamak” değildir.

Asıl problem şudur:

> Web ve mobil için birlikte düşünebilen, yüksek kalite standardını baştan kuran, Apple HIG uyumunu ciddiye alan, design system disiplinini merkezde tutan, mimari sapmayı erken engelleyen, dokümantasyon-first yaklaşımıyla yönetilen ve uzun vadede sürdürülebilir ürün geliştirme zemini oluşturan tekrar kullanılabilir bir başlangıç sistemi kurmak.

Bu tanım bilinçli olarak geniş tutulmuştur. Çünkü burada hedef tek kullanımlık starter template değil, kalite standardı korunmuş bir üretim zemini oluşturmaktır.

## 2.3. Bu Problem Neden Kritik

Bu problem kritik, çünkü boilerplate seviyesinde yapılan hatalar çarpan etkisi üretir.

Boilerplate düzeyinde alınan zayıf kararların sonuçları şunlardır:

* her yeni projede aynı tartışmaların yeniden yaşanması,
* UI/UX kalitesinin kişisel dikkat seviyesine bağlı kalması,
* ekip genişlediğinde standardın dağılması,
* refactor maliyetinin gereksiz biçimde yükselmesi,
* ürün hızının kısa vadede yüksek görünmesine rağmen orta vadede düşmesi,
* web ve mobilin aynı ürün olmaktan çıkması,
* tasarım sistemi ve kalite kapılarının “sonradan eklenmeye çalışılan ek iş” haline gelmesi.

Bu nedenle bu boilerplate’in temel değeri, yalnızca kod sağlamak değil; yanlış karar alma alanlarını sistematik biçimde daraltmaktır.

---

# 3. Vizyon

## 3.1. Boilerplate Vizyonu

Bu boilerplate’in vizyonu şudur:

> Modern, sürdürülebilir, yüksek kalite standartlı, documentation-first geliştirilen, web ve mobil arasında yüksek davranışsal ve tasarımsal uyumluluk sağlayan, Apple HIG ve erişilebilirlik ilkelerini ciddiye alan, design system merkezli, test ve kalite kapıları ile denetlenebilir bir cross-platform ürün temeli sunmak.

## 3.2. Vizyonun Yorumlanma Şekli

Bu vizyon şu anlama gelir:

* Boilerplate sadece repo yapısı sağlamaz.
* Boilerplate sadece teknoloji yığını sağlamaz.
* Boilerplate sadece component başlangıcı sağlamaz.
* Boilerplate aynı zamanda karar alma sistemi, kalite disiplini ve uygulama standardı sağlar.

Vizyonun pratiğe dönüşmüş hali şu özellikleri içermelidir:

* ürün fikri geldiğinde sıfırdan düşünmeden başlanabilecek net temel,
* web ve mobilin ürün olarak birlikte tasarlanabileceği omurga,
* rastgele değil yönlendirilmiş teknoloji seçimi,
* keyfi değil denetlenebilir UI üretimi,
* mimari olarak ölçeklenebilir sınırlar,
* kaliteyi kişisel dikkatten bağımsız kılan süreçler.

---

# 4. Misyon

Bu boilerplate’in misyonu, yeni bir fikir üzerine geliştirilecek cross-platform bir ürün için başlangıçtaki belirsizliği azaltmak, kalite standardını baştan sabitlemek ve implementasyon öncesi karar alanlarını görünür kılmaktır.

Bu misyon üç temel eksenden oluşur:

## 4.1. Karar Tekrarını Azaltmak

Her projede yeniden tartışılmaması gereken temel alanlar önceden tanımlanmalıdır:

* kalite standardı,
* design system disiplini,
* cross-platform yaklaşımı,
* teknik değerlendirme çerçevesi,
* mimari sınırlama mantığı,
* audit ve kalite kapıları.

## 4.2. Yanlış Özgürlüğü Sınırlandırmak

Bu boilerplate geliştiriciye “her şeyi istediği gibi yapma özgürlüğü” vermez. Bunun yerine:

* doğru soyutlama seviyesini,
* doğru komponentleşme mantığını,
* doğru paylaşılan kod sınırlarını,
* doğru erişilebilirlik ve performans çıtasını,
* doğru dokümantasyon ve karar akışını

kurallı hale getirmeyi hedefler.

## 4.3. Üretim Kalitesini Tekrarlanabilir Kılmak

Amaç tek bir projede iyi sonuç almak değil, farklı fikirlerde de aynı kalite standardına yakın başlangıç yapabilmektir.

---

# 5. Temel İlkeler

Bu bölüm, boilerplate’in bütün karar mantığını yöneten üst düzey ilkeleri sabitler.

## 5.1. Documentation-first

Koddan önce şu alanlar netleşmelidir:

* problem tanımı,
* ürün yaklaşımı,
* platform ilişkisi,
* kalite standardı,
* tasarım sistemi mantığı,
* mimari sınırlar,
* veri ve state yaklaşımı,
* test ve governance modeli.

Bu ilke, dokümanın kodu açıklayan ek metin değil, kodu yöneten ana sistem olduğu anlamına gelir.

## 5.2. Specification-first

Belirsiz fikirden doğrudan implementasyona geçilmez. Önce kararların ve beklentilerin tanımlı olduğu teknik/davranışsal spesifikasyon zemini kurulur.

## 5.3. Quality-first

Hız, kaliteyi ezemez. Hız ancak kalite standardı içinde anlamlıdır.

## 5.4. System over taste

UI, mimari, component veya teknoloji kararları kişisel beğeni üzerinden değil; sistematik kriterler üzerinden alınır.

## 5.5. Shared by intent, not by obsession

Paylaşılan kod oranı başarı metriği değildir. Ortaklaştırma ancak şu durumda anlamlıdır:

* aynı problemi gerçekten çözüyor olması,
* kaliteyi düşürmemesi,
* bakım maliyetini azaltması,
* platformu yapay şekilde bastırmaması.

## 5.6. Governance must be executable

Standartlar yalnızca yazılı olmamalıdır. Mümkün olduğunda enforce edilebilir olmalıdır:

* lint,
* typecheck,
* test,
* CI gate,
* checklist,
* audit,
* rulebook,
* component contract,
* token policy.

## 5.7. Native quality is non-negotiable

Cross-platform yaklaşım, native kaliteyi zayıflatmak için bahane olarak kullanılamaz.

---

# 6. Kapsam

## 6.1. Kapsam Dahili Alanlar

Bu boilerplate aşağıdaki alanları kapsar:

### A. Ürün ve platform zemini

* web + mobil birlikte düşünme modeli,
* parity yaklaşımı,
* shared vs platform-specific sınırları,
* başlangıç seviyesinde ürün davranış omurgası.

### B. UI / UX kalite standardı

* Apple HIG hassasiyeti,
* tasarım sistemi disiplini,
* görsel tutarlılık,
* premium hissiyat,
* interaction kuralları,
* accessibility beklentileri,
* motion ve reduced motion farkındalığı.

### C. Mimari yönlendirme

* uygulama katmanları,
* modül sınırları,
* bağımlılık yönleri,
* reusable yapıların kriterleri,
* shared logic sınırları.

### D. Teknik karar çerçevesi

* framework ve kütüphane değerlendirme sistemi,
* POC gerektiren alanlar,
* erken kilitlenmemesi gereken kararlar,
* ADR mantığı.

### E. Kalite işletim sistemi

* test stratejisi,
* lint ve static analysis,
* type safety,
* CI kalite kapıları,
* audit yaklaşımı,
* geliştirme kuralları.

### F. Repo başlangıç omurgası

* apps/packages/docs yapısı,
* başlangıç paket sınırları,
* environment ve config yaklaşımı,
* doküman-kod ilişki zemini.

## 6.2. Kapsam Dışı Alanlar

Bu dokümanın ve ilk faz boilerplate charter’ının kapsamı dışında kalan alanlar şunlardır:

* belirli bir ürün fikrine ait feature detayları,
* proje-spesifik ekran akışları,
* nihai marka kimliği,
* proje-spesifik API sözleşmeleri,
* ürün bazlı içerik modeli,
* ilk aşamada belirli backend mimarisi kararı,
* her kullanım senaryosunu kapsayacak aşırı jenerik sistem kurma çabası.

Bu ayrım kritik. Çünkü boilerplate kapsamı ile ürün kapsamı birbirine karıştırılırsa sistem gereksiz şişer.

## 6.3. Kapsam Dışı Alanlar (Anti-Scope)

Bu boilerplate'in bilinçli olarak kapsam dışı bıraktığı alanlar aşağıda listelenmiştir. Bu alanlar "henüz yapılmadı" anlamına gelmez; yapılması planlanmayan, boilerplate'in mimari kararları ve odak alanıyla uyumsuz veya derived project'e bırakılması gereken konulardır. Her madde, kapsam dışı bırakılma gerekçesiyle birlikte sunulmaktadır.

| Alan | Gerekçe |
|------|---------|
| **Backend / API geliştirme** | Boilerplate frontend-only mimari kararıyla sınırlandırılmıştır. Backend teknolojisi (Node.js, Go, Python, .NET vb.) derived project'in iş gereksinimlerine ve ekip yetkinliğine göre belirlenir. Boilerplate yalnızca API contract standardını (`10-data-fetching-cache-sync.md` Bölüm 5.5) tanımlar; backend implementasyonuna karışmaz. |
| **CMS / Admin panel** | Admin paneli, ürüne özgü veri yönetim ihtiyaçlarına göre şekillenir ve boilerplate seviyesinde genelleştirilemez. Boilerplate'in sunduğu form mimarisi, validation stratejisi ve design system altyapısı admin panel geliştirmek için temel sağlasa da, CMS seçimi veya admin panel scaffold'u derived project sorumluluğundadır. |
| **Backend-as-a-Service tam entegrasyonu** | Firebase, Supabase, Appwrite gibi BaaS platformlarının tam entegrasyonu kapsam dışıdır. Firebase yalnızca auth/push notification referans implementasyonu olarak ADR'lerde (ADR-010, ADR-013) yer alır. Tam BaaS entegrasyonu derived project'in veri modeli ve ölçek kararına bağlıdır. |
| **E-commerce altyapısı** | Ödeme akışı, sepet yönetimi, stok takibi, fiyatlandırma motoru gibi e-commerce domain mantığı ürüne özgüdür. Boilerplate yalnızca in-app purchase entegrasyonu için RevenueCat referansını (ADR-016) sunar; e-commerce backend ve domain mantığı kapsam dışıdır. |
| **Masaüstü uygulamalar (Electron, Tauri)** | Boilerplate web (tarayıcı) + mobil (iOS/Android) hedefler. Masaüstü uygulama ihtiyacı farklı dağıtım, güncelleme, dosya sistemi erişimi ve pencere yönetimi gereksinimleri doğurur. Bu karmaşıklık, cross-platform web+mobil odağını sulandırır. İhtiyaç doğarsa ayrı bir ADR ile değerlendirilir. |
| **Wearable (watchOS, Wear OS)** | Wearable platformları tamamen farklı UI paradigması (glance, complication, küçük ekran), farklı SDK (WatchKit, Wear OS Compose) ve farklı yaşam döngüsü gerektirir. Companion app ihtiyacı doğarsa ayrı bir ADR açılmalı ve bağımsız bir modül olarak ele alınmalıdır. |
| **TV platformları (tvOS, Android TV)** | TV platformları focus-driven navigation, 10-foot UI, D-pad/remote kontrol ve farklı içerik sunumu gerektiren özel bir alan olup touch-first/pointer-first yaklaşımla çelişir. Media/streaming uygulaması ihtiyacı doğarsa ayrı değerlendirilir. |
| **Oyun motoru entegrasyonu** | Boilerplate standart uygulama UI/UX'i hedefler. Oyun motoru (Unity, Unreal) veya canvas-based render mantığı tamamen farklı bir mimari paradigmadır ve React/React Native ekosistemiyle doğrudan uyumlu değildir. |
| **Blockchain / Web3 entegrasyonu** | Cüzdan bağlantısı, smart contract etkileşimi, token yönetimi gibi Web3 gereksinimleri özel SDK'lar, güvenlik modelleri ve kullanıcı deneyimi pattern'leri gerektirir. Bu alan boilerplate'in genel amaçlı frontend odağıyla uyumsuz olup derived project'te ihtiyaç duyulursa bağımsız olarak ele alınmalıdır. |

Bu anti-scope listesi sabit değildir. İş gereksinimleri veya teknoloji evrimi nedeniyle bir alanın kapsama alınması gerektiğinde, önce ilgili ADR açılmalı, maliyet-fayda analizi yapılmalı ve charter revizyonu tetiklenmelidir.

---

# 7. Hedef Kullanım Alanı

## 7.1. Birincil Hedef

Bu boilerplate, yeni bir fikir üzerine inşa edilecek cross-platform ürünlerin başlangıç zemini olmak içindir.

Bu kullanım modeli şu tip projeleri hedefler:

* web + mobil birlikte tasarlanacak ürünler,
* tek kullanıcıya değil zamanla büyüyebilecek sistemler,
* UI kalitesine önem veren uygulamalar,
* ürün davranış tutarlılığı kritik olan projeler,
* tasarım sistemi ve kalite kapıları ile büyümesi gereken yapılar.

## 7.2. Uygun Proje Profilleri

Aşağıdaki proje türleri bu boilerplate için uygun adaylardır:

* consumer-facing uygulamalar,
* workflow / productivity uygulamaları,
* veri girişi ve durum takibi içeren ürünler,
* karar akışı ve form yoğun yapılar,
* tasarım sistemi ile büyümesi gereken dijital ürünler,
* çok ekranlı, çok akışlı ama kontrolsüz dağılmaması gereken uygulamalar.

## 7.3. Uygun Olmayan Proje Profilleri

Aşağıdaki alanlar bu boilerplate için ya zayıf uyum gösterir ya da ayrı değerlendirme gerektirir:

* çok düşük kalite çıtasıyla hızlı prototipleme,
* tek ekranlık kısa ömürlü kampanya işleri,
* sadece web için geçici landing page tarzı projeler,
* oyun motoru mantığı gerektiren ürünler,
* ağır native cihaz bağımlılığı olan çok spesifik uygulamalar,
* platform bağımsız değil platform merkezli geliştirilecek sistemler.

---

# 8. Kullanıcı ve Paydaş Varsayımları

## 8.1. Geçmiş Konuşmalardan Çıkarım

Bu boilerplate’in temel kullanıcısı, kaliteye yüksek önem veren, document-first çalışan, UI/UX standardını kişisel zevke bırakmak istemeyen, React ve React Native ekseninde ilerleyen bir geliştirici veya küçük ekip yapısıdır.

## 8.2. Varsayım

Bu boilerplate ileride sadece tek projede değil, birden fazla fikir üzerinde referans alınabilecek kalite omurgası olarak kullanılacaktır.

## 8.3. Varsayım

Kullanıcı tarafında erken kod yerine erken karar netliği tercih edilmektedir. Bu nedenle ilk fazda doküman yoğunluğu kabul edilebilir, hatta gereklidir.

## 8.4. Varsayım

Hedef ekip yapısı başlangıçta solo veya küçük ekip ölçeğinde olsa da, boilerplate tasarımı orta ölçeğe doğru genişleyebilecek şekilde düşünülmelidir.

---

# 9. Başarı Tanımı

## 9.1. Yüksek Seviye Başarı Tanımı

Bu boilerplate başarılı sayılacaktır eğer:

* yeni ürün fikrine başlarken tekrar tekrar temel tartışmalar açılmıyorsa,
* web ve mobil için ortak ürün omurgası kurulabiliyorsa,
* UI/UX kalitesi kişisel dikkat yerine sistem kurallarıyla korunabiliyorsa,
* shared ve platform-specific sınırlar erken belirlenebiliyorsa,
* teknoloji seçimi tartışmaları keyfiyetten çıkıyorsa,
* kod öncesi doküman ve karar zemini netleşiyorsa,
* ilerleyen aşamada kalite kapıları enforce edilebiliyorsa.

## 9.2. Ölçülebilir Başarı Sinyalleri

Başarıyı değerlendirmek için aşağıdaki sinyaller kullanılmalıdır:

### A. Karar netliği

* kritik karar alanları dokümante edilmiş mi,
* belirsiz alanlar etiketlenmiş mi,
* hangi kararın neden alındığı izlenebilir mi.

### B. Yapısal tutarlılık

* apps/packages/docs ayrımı mantıklı mı,
* shared ve platform-specific sınırlar belirsiz değil mi,
* design system katmanları ayrılmış mı.

### C. Kalite yönetişimi

* lint/typecheck/test/CI zemini planlanmış mı,
* a11y ve performance ilkeleri erken aşamada tanımlanmış mı,
* audit yaklaşımı tasarlanmış mı.

### D. Uygulanabilirlik

* dokümanlar implementasyonu yönlendiriyor mu,
* dokümanlar birbirini çürütmüyor mu,
* boilerplate sadece teorik değil pratik başlangıç zemini sunuyor mu.

## 9.3. Başarısızlık Sinyalleri

Aşağıdaki durumlar başarısızlık göstergesi olarak kabul edilmelidir:

* doküman olmasına rağmen kararlar hâlâ muğlaksa,
* dokümanlar birbirini tekrar ediyor veya çelişiyorsa,
* teknoloji seçimi hâlâ kişisel sezgiyle yapılıyorsa,
* UI standardı token ve component seviyesine inmemişse,
* platform ilişkisi hâlâ belirsizse,
* kalite kapıları yalnızca niyet düzeyinde kalmışsa,
* boilerplate düzeyinde gereksiz soyutlama veya gereksiz basitlik oluşmuşsa.

## 9.4. Başarı Metrikleri (KPI'lar)

Boilerplate'in başarısını somut ve ölçülebilir biçimde değerlendirmek için aşağıdaki anahtar performans göstergeleri (KPI) tanımlanmıştır. Her KPI için hedef değer, ölçüm yöntemi ve değerlendirme periyodu belirtilmiştir.

| KPI | Hedef Değer | Ölçüm Yöntemi | Periyot |
|-----|-------------|----------------|---------|
| **Derived project bootstrap süresi** | < 2 saat | Boilerplate'ten fork/clone sonrası `pnpm install` + `pnpm dev:web` + `pnpm dev:mobile` çalışır hale gelene kadar geçen süre. Adım 1-3 (`43-derived-project-creation-guide.md`) toplam süresi ölçülür. Otomasyon script'i varsa script çalışma süresi baz alınır. | Her derived project oluşturulduğunda |
| **İlk feature'dan production'a süre** | < 1 hafta | Vertical slice (ilk anlamlı feature) implementasyonunun başlangıcından, tüm kalite kapılarını (typecheck, lint, test, build, a11y) geçerek production-ready hale gelmesine kadar geçen süre. `32-definition-of-done.md` kriterlerinin tamamının sağlanması zorunludur. | İlk vertical slice tamamlandığında |
| **Derived project sayısı** | İlk yıl ≥ 2 | Bu boilerplate'ten başarıyla türetilmiş ve aktif geliştirme sürecinde olan proje sayısı. `BOUNDARY.md` dosyası mevcut ve quarterly audit'ten geçmiş projeler sayılır. | Yıllık |
| **Boilerplate sapma (deviation) oranı** | < %15 | Derived project'teki boilerplate zorunlu miras kurallarından sapma sayısı / toplam zorunlu kural sayısı. `45-boilerplate-project-boundary-contract.md` audit sonuçları ile ölçülür. `44-exception-and-exemption-policy.md` ile belgelenmiş sapmalar kabul edilir, belgelenmemiş sapmalar ihlal sayılır. | Quarterly audit |
| **Yeni geliştirici onboarding süresi** | < 1 iş günü | Yeni bir geliştiricinin projeye katılmasından itibaren lokal geliştirme ortamını kurup ilk anlamlı PR açabilecek duruma gelmesine kadar geçen süre. Ölçüm self-report veya mentor gözlemi ile yapılır. Doküman okunabilirliği, README netliği ve `43-derived-project-creation-guide.md` kalitesi doğrudan etkiler. | Her yeni geliştirici eklendiğinde |
| **CI pipeline ilk çalışma süresi** | < 15 dakika | Derived project oluşturulduktan sonra CI pipeline'ının (typecheck + lint + test + build) ilk başarılı çalışmasına kadar geçen süre. `.github/workflows/` altındaki workflow dosyalarının boilerplate'ten doğru aktarıldığını ve ilk push'ta çalıştığını doğrular. | Her derived project oluşturulduğunda |
| **Kalite kapısı pass oranı** | > %95 | Main branch'e merge edilen PR'ların CI kalite kapılarını (typecheck, lint, test, build, boundary check) ilk denemede geçme oranı. Düşük oran, boilerplate kurallarının yeterince açık olmadığını veya geliştirici deneyiminin iyileştirilmesi gerektiğini gösterir. | Aylık |
| **Doküman-implementasyon tutarlılığı** | %100 | Quarterly audit'te tespit edilen doküman-kod çelişki sayısı. Doküman bir davranış tanımlıyor ama kod farklı çalışıyorsa veya doküman güncellenmiş ama kod güncellenmemişse tutarsızlık sayılır. Hedef sıfır tutarsızlıktır. | Quarterly audit |

### Ölçüm ve İzleme Sorumluluğu

Bu KPI'lar pasif metrik değildir; aktif olarak izlenmelidir. Her derived project oluşturulduğunda bootstrap ve CI süresi kaydedilir. Quarterly audit'lerde sapma oranı ve doküman tutarlılığı değerlendirilir. KPI'ların hedef değerin altına düşmesi durumunda root cause analizi yapılır ve iyileştirme eylemi planlanır. KPI sonuçları `31-audit-checklist.md` kapsamında raporlanır.

---

# 10. Non-Goals

Bu bölüm özellikle önemlidir. Çünkü çoğu boilerplate, hedefleri kadar hedef olmayan alanları net tanımlamadığı için şişer.

Bu boilerplate’in non-goal alanları şunlardır:

## 10.1. Her tür projeye uymak

Bu boilerplate her türlü projeyi kapsamak zorunda değildir. Evrensel olmaya çalışmak çoğu zaman kaliteyi düşürür.

## 10.2. En çok shared code oranını yakalamak

Amaç maksimum kod paylaşımı değildir. Amaç doğru paylaşım, doğru ayrım ve yüksek kaliteyi korumaktır.

## 10.3. En hızlı kurulumu sağlamak

Hızlı kurulum tek başına başarı değildir. Hatalı hızlı başlangıç, kaliteli yavaş başlangıçtan daha değerli değildir.

## 10.4. Teknoloji vitrini olmak

Bu boilerplate modern teknoloji gösterisi yapmak için kurulmayacaktır. Her araç seçimi gerekçeli ve sürdürülebilir olmalıdır.

## 10.5. İlk günden aşırı kapsamlı kod üretmek

Bu boilerplate, ilk günde bütün feature’ları çözen dev template olmayacaktır.

## 10.6. Tasarım sistemini sonradan eklemek

Design system bu yapıda sonradan takılan bir katman değildir. Başlangıç mantığının merkezindedir.

---

# 11. Kalite İddiası

Bu boilerplate aşağıdaki kalite iddialarını taşır. Bu iddialar slogan olarak değil, ileride doküman ve implementasyon ile doğrulanması gereken taahhütler olarak ele alınmalıdır.

## 11.1. UI / UX Kalite İddiası

* Apple HIG duyarlılığı yüksek olacaktır.
* Rastgele UI kararları normalleştirilmeyecektir.
* Premium hissiyat sistematik görsel ve davranışsal kalite ile üretilecektir.
* Accessibility opsiyonel değil temel kalite boyutu olacaktır.

## 11.2. Mimari Kalite İddiası

* Yapı modüler olacaktır.
* Sorumluluk ayrımı net olacaktır.
* Shared ve platform-specific sınırlar bilinçli kurulacaktır.
* Geçici çözümler ana yol gibi meşrulaştırılmayacaktır.

## 11.3. Süreç Kalite İddiası

* Dokümanlar implementasyondan önce yön belirleyecektir.
* Kritik teknik kararlar ADR benzeri mantıkla kayda geçirilecektir.
* Kalite kapıları sonradan değil baştan planlanacaktır.

## 11.4. Teknoloji Kalite İddiası

* Teknoloji seçimleri hype üzerinden yapılmayacaktır.
* Değerlendirme kriterleri açık olacaktır.
* Ekosistem gücü, sürdürülebilirlik, performans ve test edilebilirlik birlikte ele alınacaktır.

---

# 12. Çalışma Varsayımları ve Açık Noktalar

## 12.1. Açık Nokta: Hedef ürün sınıfı

Bu boilerplate’in daha çok hangi ürün ailelerine optimize edileceği henüz tam sabit değildir.

Örnek ayrımlar:

* consumer app,
* workflow app,
* dashboard-heavy ürün,
* form-heavy uygulama,
* content-heavy uygulama.

Bu alan daha sonraki dokümanlarda netleşmelidir.

## 12.2. Açık Nokta: Parity seviyesi

Web ve mobil arasında hedeflenen parity düzeyi detaylandırılmalıdır:

* behavior parity,
* visual parity,
* information architecture parity,
* implementation parity.

## 12.3. Açık Nokta: Governance seviyesi

Başlangıçta hedeflenen ekip ölçeğine göre governance sertliği kademelendirilmelidir.

## 12.4. Açık Nokta: Monorepo/package derinliği

Package ayrımının hangi seviyede başlayacağı detay karar gerektirir.

Bu alanların henüz tam sabit olmaması, charter için sorun değildir. Sorun ancak bunlar sabitmiş gibi davranılması halinde oluşur.

---

# 13. Bu Dokümanın Çıktısı Olarak Sabitlenen Kararlar

Bu charter ile aşağıdaki kararlar sabitlenmiş kabul edilir:

1. Bu proje code-first değil document-first ilerleyecektir.
2. Bu boilerplate’in amacı yalnızca hızlı başlangıç değildir.
3. Bu boilerplate kalite standardı taşıyan bir üretim zemini olacaktır.
4. Apple HIG, accessibility, performance ve design system merkezi önemdedir.
5. Web ve mobil birlikte düşünülmelidir; ancak kör ortaklaştırma yapılmayacaktır.
6. Dokümansız teknoloji kararı kabul edilmeyecektir.
7. Quality governance, boilerplate seviyesinde baştan ele alınacaktır.
8. Sonraki bütün dokümanlar bu charter ile tutarlı olmak zorundadır.

---

# 14. Sonraki Dokümanlara Etkisi

Bu doküman tamamlandıktan sonra yazılacak her doküman aşağıdaki soruya bu charter ile uyumlu cevap vermelidir:

* Bu doküman charter’da tanımlanan problemi çözmeye nasıl katkı veriyor?
* Bu doküman charter’daki kalite iddialarını nasıl somutlaştırıyor?
* Bu doküman boilerplate’in kapsamını gereksiz genişletiyor mu?
* Bu doküman shared vs platform-specific ayrımını bilinçli ele alıyor mu?
* Bu doküman system-over-taste ilkesini koruyor mu?

Bu yüzden charter, dekoratif giriş dokümanı değil; yön belirleyen ana kaynaktır.

---

# 15. Onay Kriterleri

Bu doküman aşağıdaki koşullar sağlandığında yeterli kabul edilir:

* boilerplate’in amacı tek cümleyle net ifade edilebiliyorsa,
* kapsam ve non-goal ayrımı karışmıyorsa,
* kalite iddiaları slogan düzeyinde bırakılmamışsa,
* sonraki dokümanlara yön verecek kadar açık çerçeve kurulmuşsa,
* belirsiz alanlar gizlenmeden işaretlenmişse,
* implementasyon öncesi karar zemini için yeterli çapa sağlanmışsa.

---

# 16. Kısa Sonuç

Bu boilerplate’in temel amacı, yeni bir cross-platform ürün fikrine yalnızca teknik başlangıç vermek değil; yüksek kalite standardını baştan kuran, karar kaosunu azaltan, mimari sapmayı engelleyen ve dokümantasyon ile yönlendirilen sürdürülebilir bir üretim zemini oluşturmaktır.

Bu dokümanın ana çıktısı şudur:

> Bundan sonra üretilecek hiçbir doküman ve hiçbir teknik öneri, bu charter’da tanımlanan kalite, kapsam ve çalışma mantığı ile çelişemez.
