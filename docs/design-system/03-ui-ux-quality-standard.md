# 03-ui-ux-quality-standard.md

## Doküman Kimliği

- **Doküman adı:** UI / UX Quality Standard
- **Dosya adı:** `03-ui-ux-quality-standard.md`
- **Doküman türü:** Standard / rulebook / quality baseline document
- **Durum:** Accepted
- **Kapsam:** Bu boilerplate kapsamında UI ve UX kalitesinin nasıl tanımlanacağını, hangi standartların zorunlu olduğunu, hangi yaklaşımların zayıf kabul edileceğini ve tasarım-implementasyon ilişkisinin nasıl yönetileceğini tanımlar.
- **Bağlı olduğu üst dokümanlar:**
  - `00-project-charter.md`
  - `01-working-principles.md`
  - `02-product-platform-philosophy.md`
- **Doğrudan etkileyeceği dokümanlar:**
  - `04-design-system-architecture.md`
  - `05-theming-and-visual-language.md`
  - `08-navigation-and-flow-rules.md`
  - `11-forms-inputs-and-validation.md`
  - `12-accessibility-standard.md`
  - `13-performance-standard.md`
  - `15-quality-gates-and-ci-rules.md`
  - `16-tooling-and-governance.md`
  - `21-repo-structure-spec.md`
  - `23-component-governance-rules.md`
  - `24-motion-and-interaction-standard.md`
  - `25-error-empty-loading-states.md`
  - `33-visual-implementation-contract.md`
  - `34-hig-enforcement-strategy.md`

---

# 1. Amaç

Bu dokümanın amacı, oluşturulacak boilerplate içinde **yüksek UI/UX kalitesi** ifadesinin ne anlama geldiğini belirsizlikten çıkarmaktır.

“UI/UX’e önem veriyoruz” gibi cümleler bu proje kapsamında yeterli değildir.
Bu standardın açık, denetlenebilir, uygulanabilir ve tekrar üretilebilir olması gerekir.

Bu belge şu sorulara net cevap verir:

1. Bu projede iyi UI ne demektir?
2. Bu projede iyi UX ne demektir?
3. Apple HIG hassasiyeti pratikte neye dönüşür?
4. Premium hissiyat hangi somut kurallarla üretilir?
5. Görsel kalite ile kullanılabilirlik ilişkisi nasıl kurulur?
6. Hangi UI kararları kabul edilir, hangileri reddedilir?
7. Tasarım sistemi, etkileşim modeli, accessibility ve navigation kalitesi nasıl birlikte ele alınır?
8. Bir ekranın, bileşenin veya akışın kaliteli sayılması için hangi koşullar gerekir?

Bu belge tasarım ilham metni değildir.
Bu belge, UI/UX kalitesinin **duygusal beğeni konusu değil, sistematik kalite alanı** olduğunu sabitleyen ana standarttır.

---

# 2. Neden Bu Doküman Gerekli

UI/UX konusu çoğu projede en çok konuşulan ama en az tanımlanan alandır.

Genellikle şu hatalar yapılır:

- “güzel görünüyorsa yeter” yaklaşımı,
- görsel kalite ile kullanılabilirliği birbirinden koparmak,
- accessibility’yi ayrı iş gibi görmek,
- HIG’i dekoratif referans gibi ele almak,
- component üretimini tasarım sisteminden bağımsız yapmak,
- platform farklarını UI kalitesini düşürmek için bahane olarak kullanmak,
- premium hissiyatı sadece animasyon veya renk paleti sanmak,
- tasarımı Figma’ya, uygulamayı geliştirici inisiyatifine bırakmak.

Bu hatalar sonucunda şu bozulmalar görülür:

- ekranlar birbirine benzemeyen ürün parçalarına dönüşür,
- kullanıcı bir yerde akıcı ilerlerken başka bir yerde sürtünme yaşar,
- hata, loading, success, empty state davranışları tutarsızlaşır,
- bileşenler aynı sistemin parçası gibi davranmaz,
- mobilde native olmayan his oluşur,
- web’de yoğunluk ve kullanılabilirlik bozulur,
- görsel doğruluk ile erişilebilirlik çatışır,
- uygulama “çalışıyor” olsa da kalitesiz hissedilir.

Bu belge, UI/UX alanını kişisel zevk veya sonradan toparlanacak tasarım kalemi olmaktan çıkarmak için gereklidir.

---

# 3. Temel Tez

Bu proje kapsamında temel tez şudur:

> Yüksek UI/UX kalitesi; Apple HIG duyarlılığı, tasarım sistemi disiplini, tutarlı görsel hiyerarşi, güçlü interaction mantığı, erişilebilirlik, platform ergonomisi, performans hassasiyeti ve denetlenebilir kural setlerinin birlikte çalışmasıyla oluşur.

Bu tez şu sonuçları doğurur:

1. İyi UI tek başına estetik değildir.
2. İyi UX tek başına akış şeması değildir.
3. Güzel görünen ama okunmayan, anlaşılmayan veya erişilemeyen arayüz kaliteli sayılmaz.
4. Çok kullanılabilir ama tasarım sistemi dışına taşmış ve görsel olarak dağınık arayüz de kaliteli sayılmaz.
5. UI ve UX bu projede ayrı değil, aynı kalite sisteminin iki yönüdür.

---

# 4. Üst Düzey UI / UX İlkeleri

## 4.1. Platforma saygılı kalite

Arayüz, platform davranışlarını görmezden gelemez.
Özellikle mobile tarafta Apple HIG duyarlılığı, ergonomi, spacing, hit target, safe area, motion ve bilgi yoğunluğu konuları zorunludur.

## 4.2. Sistematik tutarlılık

Aynı ürün içinde:
- aynı eylem aynı anlamı taşımalı,
- aynı görsel vurgu aynı önceliği temsil etmeli,
- aynı component ailesi benzer davranmalı,
- aynı hata/success dili aynı sistem tonunda ilerlemeli.

## 4.3. Kullanılabilirlik görsel tasarımın önündedir ama karşıtı değildir

UI/UX kararlarında kullanılabilirlik önceliklidir.
Ancak bu, görsel kaliteyi önemsiz hale getirmez.
Bu projede doğru hedef:
- kullanılabilir,
- okunabilir,
- erişilebilir,
- güven veren,
- premium hissettiren
arayüzler üretmektir.

## 4.4. Rastgelelik yasağı

Bir ekran veya component şu gerekçelerle şekillendirilemez:
- geliştiricinin anlık tercihi,
- başka projeden alışkanlık,
- “göze böyle hoş geldi”,
- “çok da fark etmez”.

Her UI kararı bir standarda bağlı olmalıdır:
- design token,
- semantic token,
- component contract,
- pattern rule,
- accessibility kuralı,
- platform kuralı,
- HIG duyarlılığı.

## 4.5. Premium hissiyat bir sistem sonucudur

Premium his şu unsurların birleşiminden doğar:
- kontrollü görsel hiyerarşi,
- sade ama güçlü spacing,
- temiz tipografi,
- iyi durum yönetimi,
- kararlı etkileşimler,
- akıcı ama gereksiz olmayan motion,
- güven veren input ve feedback kalitesi,
- ekranlar arasında kopmayan ürün dili.

Bu his, yalnızca koyu tema, blur, shadow veya animasyonla üretilemez.

---

# 5. Kalite Boyutları

Bu projede UI/UX kalitesi aşağıdaki boyutların toplamı olarak ele alınır:

1. Görsel hiyerarşi
2. Interaction kalitesi
3. Bilgi mimarisi ve görev akışı
4. Accessibility
5. Platform ergonomisi
6. Durum yönetimi
7. Navigation kullanılabilirliği
8. Performans hissi
9. Design system uyumu
10. Hata önleme ve hata toparlama kalitesi

Bu boyutlardan biri eksikse kalite yarımdır.

---

# 6. Görsel Kalite Standardı

## 6.1. Görsel kalite nedir?

Görsel kalite; ekrandaki öğelerin estetik görünmesinden ibaret değildir.
Aşağıdakilerin birlikte düzgün çalışmasıdır:

- hiyerarşi,
- okunabilirlik,
- odak noktası,
- tutarlılık,
- yüzey ilişkisi,
- boşluk kullanımı,
- ağırlık dengesi,
- vurgu sistemi,
- bileşen ailesi bütünlüğü.

## 6.2. Görsel kalite için zorunlu kurallar

### A. Hiyerarşi net olmalı
Kullanıcı ilk bakışta şunları ayırt edebilmelidir:
- ekran başlığı,
- birincil bilgi,
- ikincil bilgi,
- yardımcı metin,
- eylem alanı,
- sistem geri bildirimi.

### B. Spacing sistematik olmalı
Boşluklar rastgele verilemez.
Aynı seviyedeki içerik blokları aynı spacing mantığını izlemelidir.

### C. Yüzey mantığı net olmalı
Arka plan, container, elevated surface, grouped content ve interactive area birbirine karışmamalıdır.

### D. Vurgu kontrollü olmalı
Her şey dikkat çekemez.
Primary vurgu sınırlı sayıda kullanılmalıdır.

### E. Gürültü düşük olmalı
Gereksiz border, gereksiz icon, gereksiz metin, gereksiz renk vurgusu kaliteyi düşürür.

## 6.3. Reddedilen görsel yaklaşım türleri

- aynı ekranda birbirini boğan çok fazla vurgu,
- düzensiz spacing,
- semantic olmayan renk kullanımı,
- tipografik rollerin karışması,
- kart, liste, form ve aksiyon alanlarının görsel olarak aynılaşması,
- kontrastı yetersiz veya aşırı düşük ayrışan alanlar,
- bir yerde aşırı minimal, başka yerde aşırı yoğun parçalı görünüm.

---

# 7. Typography Standardı

## 7.1. Tipografi bu projede neden kritik?

Tipografi yalnızca metni göstermenin yolu değildir.
Şunları belirler:
- bilgi hiyerarşisi,
- taranabilirlik,
- ürün ciddiyeti,
- güven algısı,
- görev tamamlama hızı,
- hata okuma kolaylığı.

## 7.2. Tipografi için zorunlu prensipler

### A. Rol tabanlı kullanım
Yazı boyutu ve ağırlığı rastgele verilemez.
Her metin bir role bağlı olmalıdır:
- display,
- screen title,
- section title,
- body primary,
- body secondary,
- caption,
- helper,
- overline,
- status text,
- actionable text.

### B. Aynı rol, aynı davranış
Aynı rol farklı ekranlarda anlamsız biçimde değişmemelidir.

### C. Okunabilirlik öncelikli
Özellikle:
- body text çok küçük olmamalı,
- yardımcı metin görünmez hale gelmemeli,
- contrast düşük olmamalı,
- satır aralığı sıkışık olmamalı.

### D. Tipografik yoğunluk kontrol edilmeli
Her metni bold veya büyük yapmak kaliteyi artırmaz.
Asıl kalite, sınırlı ve tutarlı tipografi rolleri kullanmaktır.

## 7.3. Tipografide zayıf yaklaşımlar

- bir component’te text size’in bağlamsız değiştirilmesi,
- helper text’in neredeyse okunmaz olması,
- başlıkların body text gibi görünmesi,
- her şeyi uppercase yapmak,
- ikonla metin arasındaki hizayı önemsememek,
- input, button, title, list item text rollerini karıştırmak.

---

# 8. Spacing ve Layout Standardı

## 8.1. Spacing neden ana kalite alanıdır?

Spacing, UI kalitesinde en çok hissedilen ama en az bilinçli tarif edilen alandır.
Kötü spacing şunlara yol açar:

- gergin ekran hissi,
- anlamsız boşluklar,
- odak kaybı,
- tutarsız component algısı,
- düşük premium hissi.

## 8.2. Zorunlu spacing prensipleri

### A. Token tabanlı boşluk
Boşluklar sistematik scale ile verilmelidir.
Hardcoded rastgele spacing bu projede zayıf yaklaşımdır.

### B. Yakınlık mantığı
Birbirine ait öğeler yakın, farklı bloklar anlamlı derecede ayrı olmalıdır.

### C. İç boşluk ve dış boşluk ayrımı
Container padding ile block spacing karıştırılmamalıdır.

### D. Grid / hizalama disiplini
Özellikle web tarafında içerik hizası, alan derinliği ve layout kırılma mantığı sistematik olmalıdır.

### E. Mobile ergonomisi
Mobilde yatay ve dikey boşluklar:
- dokunma kolaylığı,
- görsel nefes,
- başlık/aksiyon ayrımı,
- safe area saygısı
üretecek şekilde düşünülmelidir.

## 8.3. Reddedilen spacing davranışları

- aynı ekran içinde farklı mantıkta yatay padding kullanımı,
- component içinde keyfi boşluklar,
- dokunulabilir alanı azaltan sıkışık yapı,
- okunabilirliği düşüren aşırı dar layout,
- tüm sayfaya tek padding verip her şeyi çözdüğünü sanmak.

---

# 9. Color ve Visual Semantics Standardı

## 9.1. Renk bu projede nasıl ele alınır?

Renk dekoratif katman değildir.
Şunları temsil eder:
- yüzey ilişkisi,
- durum anlamı,
- aksiyon önceliği,
- bilgi hiyerarşisi,
- okuma kolaylığı,
- erişilebilirlik.

## 9.2. Zorunlu ilkeler

### A. Raw color yerine semantic color
Renkler mümkün olduğunca şu semantiklerle kullanılmalıdır:
- surface,
- background,
- content primary,
- content secondary,
- border subtle,
- border strong,
- accent,
- success,
- warning,
- error,
- disabled,
- overlay,
- focus,
- pressed/hover/active state.

### B. Anlam kararlılığı
Aynı renk veya renk ailesi farklı yerlerde farklı ürün anlamı taşımamalıdır.

### C. State renkleri kontrollü kullanılmalı
Error, warning, success gibi durumlar yalnızca anlam gerçekten gerektiğinde kullanılmalıdır.

### D. Kontrast asla ikinci plana atılmamalı
Renk uyumu adına okunabilirlik bozulamaz.

## 9.3. Reddedilen renk kullanımları

- semantic olmayan keyfi tonlar,
- tasarım sistemi dışı tekil renk kararı,
- düşük kontrastlı secondary text,
- error görünmesi gereken yerde sadece soluk vurgu,
- primary action ile destructive action’ın görsel ayrımının yetersiz olması.

---

# 10. Iconography ve Görsel Yardımcı Unsurlar

## 10.1. İkon kullanımı ne için vardır?

İkonlar:
- destekleyici anlam,
- tarama kolaylığı,
- hızlı aksiyon tanımı,
- durum göstergesi
için kullanılabilir.

Ama ikon, metin yerine düşünmeden kullanılamaz.

## 10.2. Zorunlu kurallar

- ikon, tek başına anlaşılmıyorsa label’sız bırakılmamalı,
- ikon boyutları rol bazlı kullanılmalı,
- aksiyon ikonları ile dekoratif ikonlar aynı mantıkta ele alınmamalı,
- ikon yoğunluğu düşük tutulmalı,
- kritik aksiyonlar sadece ikona indirgenmemeli.

## 10.3. Zayıf kullanımlar

- her başlığın yanına anlamsız ikon koymak,
- aynı ikona farklı anlam yüklemek,
- tıklanabilir ikonların hit area’sını küçük bırakmak,
- destructive ile neutral action ikonlarını ayırmamak.

---

# 11. Interaction Standardı

## 11.1. Interaction kalitesi nedir?

Interaction kalitesi, kullanıcının arayüzle etkileşime geçtiğinde yaşadığı sürtünme düzeyini ve sistemin verdiği yanıtın kalitesini ifade eder.

İyi interaction:
- tahmin edilebilir,
- kararlı,
- geri bildirim veren,
- aşırı dikkat istemeyen,
- hata toleranslı,
- platforma saygılı olandır.

## 11.2. Her interactive element için zorunlu beklentiler

Her etkileşimli öğe için şu soruların cevabı bulunmalıdır:
- tıklanabilir mi / dokunulabilir mi?
- görsel olarak anlaşılır mı?
- basılınca ne olur?
- pressed / hover / focus / disabled hali var mı?
- erişilebilir adı ve rolü var mı?
- hata veya loading durumunda ne yapar?
- kullanıcı geri dönebilir mi?
- yanlışlıkla tetiklenmesi kolay mı?

## 11.3. Reddedilen interaction sorunları

- tıklanabilir olduğu anlaşılmayan alanlar,
- feedback vermeyen aksiyonlar,
- basınca hiçbir görsel değişim olmaması,
- disabled ile loading durumunun karışması,
- destructive aksiyonun yetersiz ayırt edilmesi,
- form submit sonrası belirsizlik,
- scroll, swipe, press davranışlarının çakışması.

---

# 12. Touch Target ve Ergonomi Standardı

## 12.1. Touch target neden kritik?

Özellikle mobilde dokunulabilir alan küçükse:
- yanlış basma artar,
- güven azalır,
- hız düşer,
- kalite hissi bozulur,
- accessibility zarar görür.

## 12.2. Zorunlu prensipler

- interactive öğeler yeterli hit area’ya sahip olmalı,
- görsel boyut küçük olsa bile dokunma alanı yeterli tutulmalı,
- birbirine çok yakın aksiyonlar ayrıştırılmalı,
- ekran kenarları ve safe area yakınında ergonomi korunmalı,
- sırf kompakt görünmek için dokunma kalitesi düşürülmemeli.

## 12.3. Zayıf örnekler

- küçük icon button’lar,
- list item trailing action’larının dar tutulması,
- chip ve pill aksiyonlarının sıkıştırılması,
- destructive / secondary aksiyonların birbirine çok yakın olması.

---

# 13. Safe Area ve Edge Handling Standardı

## 13.1. Safe area neden sadece teknik konu değildir?

Safe area, görsel düzgünlük ve kullanım ergonomisinin parçasıdır.
Özellikle mobile tarafta ekranın gerçek kullanılabilir alanını doğru yönetmek zorunludur.

## 13.2. Kurallar

- root seviyedeki ekranlar safe area mantığına saygı göstermeli,
- bottom action alanları home indicator veya alt sistem alanlarıyla çakışmamalı,
- sticky header / footer yapıları güvenli mesafeleri korumalı,
- tam ekran içerik varsa bile kontrol alanları ergonomik konumlanmalı,
- safe area “rastgele padding ekleyelim” mantığıyla yönetilmemeli.

## 13.3. Zayıf kullanımlar

- CTA’nın alt sistem alanına çok yakın konması,
- header içeriğinin notch/delme alanı ile çakışması,
- scroll alanı ile bottom action’ın örtüşmesi,
- farklı ekranlarda farklı safe area mantıkları.

---

# 14. Navigation Kullanılabilirlik Standardı

## 14.1. Navigation kalitesi ne demektir?

Kullanıcı:
- nerede olduğunu,
- nereye gidebileceğini,
- nasıl geri döneceğini,
- bulunduğu ekrandaki ana görevin ne olduğunu
kolayca anlayabilmelidir.

## 14.2. Zorunlu kurallar

### A. Konum hissi
Kullanıcı ekrandaki bağlamı anlamalıdır.

### B. Geri davranışı tahmin edilebilir olmalı
Back davranışı sürpriz üretmemelidir.

### C. Ana aksiyon görünür olmalı
Navigation, ana görevi gölgelememelidir.

### D. Platforma saygı
Web route mantığı ile mobile navigation pattern’i gerektiğinde farklılaşabilir.
Ama ürün akışı çelişmemelidir.

## 14.3. Navigation’da zayıf örnekler

- geri butonunun anlamsız yere atması,
- bir yerde modal, bir yerde route, bir yerde nested state ile aynı işin çözülmesi,
- kullanıcıyı akış içinde kaybettiren fazla seviye,
- mobile’da aşırı yoğun üst bar alanı,
- web’de gizlenmiş temel yön bulma öğeleri.

---

# 15. Feedback States Standardı

## 15.1. Sistem geri bildirimi neden kritik?

Kullanıcı arayüzle etkileşimde bulunduğunda sistemin ne yaptığını anlamak zorundadır.
Aksi halde ürün güvensiz hissedilir.

## 15.2. Zorunlu durumlar

Aşağıdaki durumlar sistematik düşünülmelidir:
- idle,
- hover,
- focus,
- pressed,
- active,
- selected,
- disabled,
- loading,
- success,
- warning,
- error,
- empty.

## 15.3. Feedback kalitesi için kurallar

- loading ile disabled karışmamalı,
- success görünür ama abartısız olmalı,
- error açık olmalı ama panik üretmemeli,
- retry varsa anlamlı şekilde sunulmalı,
- mikro geri bildirimler sistemli olmalı,
- sadece renk değişimiyle kritik bilgi verilmemeli.

## 15.4. Zayıf geri bildirim örnekleri

- submit basıldıktan sonra hiçbir şey olmaması,
- buton disabled mı loading mi anlaşılmaması,
- error state’in yalnızca küçük kırmızı text ile geçiştirilmesi,
- başarılı işlemin görünmez kalması,
- empty state ile hata state’in birbirine benzemesi.

---

# 16. Loading, Empty, Error, Success Standardı

## 16.1. Loading state

Loading, bekleme hissini yönetir.
İyi loading:
- kullanıcıyı kararsız bırakmaz,
- tahmin edilebilir alanları skeleton ile temsil eder,
- gereksiz spinners ile ekranı doldurmaz,
- uzun süren beklemede açıklama sunar.

### Loading için kurallar
- kısa yüklemelerde flicker yaratılmamalı,
- uzun yüklemelerde anlamlı ara durum gösterilmeli,
- full-screen loading aşırı kullanılmamalı,
- local loading mümkünse local kalmalı.

## 16.2. Empty state

Empty state, “veri yok” bilgisini taşımalıdır.
Ama sadece boş alan bırakmak yeterli değildir.

### İyi empty state
- neden boş olduğunu açıklar,
- kullanıcı ne yapabileceğini bilir,
- gerekiyorsa CTA sunar,
- hata ile karışmaz.

## 16.3. Error state

Error state:
- açık,
- anlaşılır,
- aksiyon öneren,
- panik üretmeyen,
- teknik değil ürün diliyle konuşan
olmalıdır.

## 16.4. Success state

Success state:
- kullanıcının yaptığı işin tamamlandığını hissettirmeli,
- ama akışı gereksiz yere durdurmamalı,
- gerektiğinde geri alınabilirlik veya sonraki adımı göstermeli.

## 16.5. Destructive Action Undo Capability (Yıkıcı Eylem Geri Alma Yeteneği)

### 16.5.1. Nedir?

Kullanıcının geri alınabilir nitelikteki yıkıcı eylemlerinde (silme, arşivleme, listeden çıkarma, favorilerden kaldırma vb.) geleneksel "Emin misiniz?" onay dialog'u yerine, eylemi hemen gerçekleştirip ardından sınırlı süre içinde geri alma imkanı sunan bir kullanıcı deneyimi kalıbıdır. Bu kalıba "undo pattern" denir.

Undo pattern'inde kullanıcı "Sil" butonuna bastığında item hemen görünümden kalkar ve ekranın altında "Geri Al" butonu içeren bir toast/snackbar gösterilir. Kullanıcı belirli süre içinde "Geri Al"a tıklarsa eylem iptal edilir ve item eski yerine döner. Süre dolarsa eylem kalıcı hale gelir.

### 16.5.2. Neden undo pattern tercih edilmeli?

Geleneksel onay dialog'ları ("Bu öğeyi silmek istediğinize emin misiniz? Evet / Hayır") çoğu zaman etkin koruma sağlamaz. Bunun birkaç temel nedeni vardır:

- **Otomatik onay sorunu:** Kullanıcılar tekrarlanan onay dialog'larına karşı refleks geliştirirler. Zamanla düşünmeden "Evet"e basmaya başlarlar. Bu, dialog'un koruma işlevini tamamen yitirmesi demektir. Onay dialog'u görünüşte güvenlik sağlar ama pratikte kullanıcıyı korumaz.
- **Akış kesintisi:** Her silme eyleminde onay dialog'u göstermek, kullanıcının görev akışını kesintiye uğratır. Toplu silme, listeyi temizleme veya sık yapılan düzenleme işlemlerinde bu kesinti ciddi sürtünme yaratır.
- **Hız ve güven dengesi:** Undo pattern, eylemi hemen gerçekleştirerek kullanıcıya hız ve kontrol hissi verir. Aynı zamanda geri alma penceresi sunarak güvenliği de sağlar. Kullanıcı "yanlış mı yaptım?" sorusunu eylemden sonra değerlendirme şansına sahip olur.

### 16.5.3. Uygulama detayları

Undo pattern'in doğru çalışabilmesi için aşağıdaki kurallar uygulanmalıdır:

**Toast/snackbar gösterimi:**
Silme, arşivleme veya çıkarma eylemi gerçekleştirildikten sonra ekranın altında bir toast veya snackbar gösterilir. Bu toast'un içeriği şu formatta olmalıdır:

`"[Item adı/türü] silindi.  [Geri Al]"`

Örnekler:
- "Alışveriş listesi silindi. Geri Al"
- "Not arşivlendi. Geri Al"
- "Ahmet Yılmaz listeden çıkarıldı. Geri Al"

"Geri Al" ifadesi tıklanabilir bir buton olarak sunulmalıdır. Görsel olarak açıkça ayırt edilebilir olmalıdır (genellikle farklı renk veya underline ile).

**Duration (süre):**
Toast'un ekranda kalma süresi **8 saniye** olmalıdır. Bu süre boyunca kullanıcı geri alma şansına sahiptir. 8 saniye sonra toast otomatik olarak kaybolur ve eylem kalıcı hale gelir. 8 saniye, çoğu kullanıcının hatayı fark edip geri almak için yeterli bir süredir — ama aynı zamanda arayüzü gereksiz yere meşgul edecek kadar uzun değildir.

### 16.5.4. Geri alma (undo) davranışı

Kullanıcı toast'taki "Geri Al" butonuna tıkladığında:

1. **Eylem geri alınır:** Silinen/arşivlenen/çıkarılan item eski konumuna ve eski durumuna geri döner. Item, listenin sonuna değil, **eski sırasına** dönmelidir. Kullanıcı listede 3. sıradaki bir item'ı silip geri aldığında, item yine 3. sıraya yerleşmelidir.
2. **Toast kaybolur:** Geri alma başarılı olduğunda toast hemen kaybolur.
3. **Success feedback:** Kısa bir success geri bildirimi gösterilir: "Geri alındı." Bu mesaj kısa ömürlü olabilir (2-3 saniye) ve eyleme dönük ek bir aksiyon gerektirmez.

### 16.5.5. Undo window süresince backend davranışı

Undo pattern'in backend tarafındaki implementasyonu kritiktir:

- **Soft-delete:** Kullanıcı bir item'ı sildiğinde backend'e hard delete değil, **soft-delete** gönderilmelidir. Item, veritabanından fiziksel olarak silinmez; yalnızca "silinmiş" olarak işaretlenir. UI tarafında item görünümden kalkar, ancak backend'de hâlâ mevcuttur.
- **Undo tıklanırsa:** Backend'e restore/recover isteği gönderilir. Item'ın soft-delete flag'i kaldırılır ve item tekrar aktif hale gelir.
- **Undo window süresi dolarsa:** 8 saniyelik süre dolduktan sonra hard delete tetiklenir. Bu, backend'e ikinci bir istek göndererek (ör: confirm-delete) veya bir zamanlayıcı (scheduled job) ile gerçekleştirilebilir. Alternatif olarak, belirli bir süre sonra soft-delete edilmiş kayıtlar toplu olarak temizlenebilir.

Bu yaklaşım, undo'nun gerçekten çalışmasını garanti eder. Eğer eylem baştan hard delete olarak gönderilirse, geri alma teknik olarak imkansız hale gelir.

### 16.5.6. Geri alınamaz eylemler

Her yıkıcı eylem undo pattern'e uygun değildir. Bazı eylemler doğası gereği geri alınamaz:

- **Ödeme gönderme:** Finansal işlem tamamlandığında geri alınamaz.
- **Mesaj gönderme:** Gönderilen mesaj alıcıya ulaştığında geri çekilemeyebilir.
- **Hesap silme:** Kullanıcı hesabının silinmesi geniş kapsamlı ve geri dönüşü zor bir işlemdir.
- **Kalıcı veri dışa aktarma:** Üçüncü taraf sistemlere gönderilen veriler geri çekilemez.
- **Davet/paylaşım gönderme:** Gönderilen davet e-postaları veya paylaşım bildirimleri geri alınamaz.

Bu geri alınamaz eylemler için geleneksel onay dialog'u kullanılmalıdır. Ancak bu dialog da doğru tasarlanmalıdır:

- **Açık uyarı mesajı:** "Bu işlem geri alınamaz. Emin misiniz?" gibi net bir uyarı.
- **Yıkıcı buton açıkça etiketlenmeli:** Belirsiz "Evet" veya "Tamam" yerine, eylemin kendisini tanımlayan etiket kullanılmalıdır. Örneğin: "Hesabı Kalıcı Olarak Sil", "Ödemeyi Gönder". Bu, kullanıcının ne yaptığını tam olarak anlamasını sağlar.
- **Görsel ayrım:** Yıkıcı buton, onay dialog'unda diğer butonlardan (İptal gibi) görsel olarak ayrışmalıdır — genellikle kırmızı veya destructive semantic rengiyle.
- **Opsiyonel: Ek doğrulama:** Çok kritik eylemler için (hesap silme gibi) ek doğrulama istenebilir: şifre girişi, "SİL" yazma, vb.

### 16.5.7. Platform farkı

Undo pattern'in mantığı web ve mobile'da aynıdır. Ancak toast/snackbar konumlanması platforma göre farklılaşmalıdır:

- **Mobile:** Toast, ekranın altında, bottom safe area'nın üzerinde konumlanmalıdır. Home indicator veya alt sistem alanlarıyla çakışmamalıdır. Tab bar varsa tab bar'ın üzerinde görünmelidir.
- **Web:** Toast, ekranın alt-sol köşesinde veya alt-merkez konumda gösterilmelidir. Sabit konumlu olmalı ve sayfa scroll'undan etkilenmemelidir.

Her iki platformda da toast'un içerik yapısı (mesaj + geri al butonu), süresi (8 saniye) ve davranışı (geri alma, kaybolma) aynı standartlarda olmalıdır.

### 16.5.8. Erişilebilirlik

Undo toast'unun erişilebilir olması kritiktir çünkü kullanıcının sınırlı süre içinde aksiyon alması gerekir:

- **Screen reader duyurusu:** Undo toast'u `role="alert"` ve `aria-live="assertive"` ile işaretlenmelidir. Bu, toast göründüğünde screen reader'ın mevcut okumayı keserek toast içeriğini hemen okumasını sağlar. Kullanıcı "[Item adı] silindi. Geri Al" mesajını duymalıdır.
- **Keyboard erişilebilirliği:** "Geri Al" butonu keyboard ile tıklanabilir olmalıdır. Tab ile ulaşılabilir ve Enter/Space ile tetiklenebilir olmalıdır.
- **Süre dondurma:** 8 saniyelik süre, özellikle keyboard ve screen reader kullanıcıları için kısa olabilir. Bu nedenle toast'a hover (web'de) veya focus (keyboard ile) uygulandığında süre dondurulmalıdır. Kullanıcı mouse'u toast üzerine getirdiğinde veya "Geri Al" butonuna focus olduğunda zamanlayıcı durmalı, mouse/focus ayrıldığında kalan süreden devam etmelidir. Bu, erişilebilirlik açısından kritik bir gerekliliktir.
- **Focus yönetimi:** Undo başarılı olduktan sonra focus, geri alınan item'a veya item'ın bulunduğu listeye dönmelidir. Kullanıcı geri alınan item'ı hemen bulabilmelidir.

### 16.5.9. Hatalı yaklaşımlar

Aşağıdaki yaklaşımlar bu proje kapsamında zayıf kabul edilir:

- **Tüm silme eylemlerinde yalnızca onay dialog'u kullanmak:** Geri alınabilir eylemler için onay dialog'u gereksiz sürtünme yaratır. Undo pattern bu durumlar için daha iyi bir kullanıcı deneyimi sunar. Onay dialog'u yalnızca geri alınamaz eylemler için saklanmalıdır.
- **Undo window'u çok kısa tutmak (3 saniye veya altı):** 3 saniyelik bir süre, çoğu kullanıcının hatayı fark edip "Geri Al" butonuna tıklaması için yetersizdir. Özellikle motor engelli kullanıcılar veya screen reader kullanan kullanıcılar için bu süre çok kısadır. 8 saniye makul bir minimum süredir.
- **Undo sonrası item'ı listenin sonuna koymak:** Geri alınan item orijinal sırasına dönmelidir. Listenin sonuna koymak, kullanıcının item'ı "aramasını" gerektirir ve geri alma deneyiminin kalitesini düşürür. Kullanıcı "hiçbir şey olmamış gibi" eski duruma dönmeyi bekler.
- **Hard delete ile başlayıp undo'yu imkansız kılmak:** Backend'e doğrudan hard delete göndermek, undo'yu teknik olarak imkansız kılar. Undo toast'u gösterilir ama "Geri Al" tıklandığında aslında hiçbir şey geri alınamaz. Bu, kullanıcıya yalan söylemek demektir. Undo pattern kullanılacaksa soft-delete mekanizması zorunludur.
- **Toast'u erişilebilir yapmamak:** Toast'u screen reader'dan gizlemek, keyboard ile ulaşılmaz yapmak veya süre dondurma mekanizması uygulamamak. Bu, erişilebilirlik ihlalidir ve undo pattern'in belirli kullanıcı grupları için tamamen işlevsiz olması demektir.

---

# 17. Form UX Standardı

## 17.1. Form neden özel alan?

Formlar, ürünün en kırılgan UX alanlarından biridir.
Kullanıcı en çok burada:
- hata yapar,
- tereddüt eder,
- durur,
- güven kaybeder,
- sistemi yargılar.

## 17.2. Zorunlu ilkeler

### A. Alan adı anlaşılır olmalı
Label açık olmalı, placeholder label yerine geçmemeli.

### B. Zorunlu alan mantığı net olmalı
Kullanıcı neyin zorunlu olduğunu tahmin etmek zorunda kalmamalı.

### C. Validation zamanlaması kontrollü olmalı
Çok erken validation baskı yaratır, çok geç validation hata maliyeti artırır.

### D. Hata metni yardımcı olmalı
“Hatalı giriş” gibi boş cümleler yeterli değildir.

### E. Input ergonomisi güçlü olmalı
Touch, focus, keyboard, auto-capitalization, return key davranışları düşünülmeli.

### F. Submit davranışı belirsiz olmamalı
Kaydediyor mu, hataya mı düştü, başarılı mı oldu net olmalı.

## 17.3. Zayıf form örnekleri

- label yerine sadece placeholder,
- hata mesajının nereden geldiğinin anlaşılmaması,
- inline validation spam’i,
- mobil klavye açılınca formun bozulması,
- kaydetme sonrası kullanıcıya ne olduğunun görünmemesi,
- yardım metni ile hata metninin aynı görünmesi.

---

# 18. Motion ve Reduced Motion Standardı

## 18.1. Motion ne için vardır?

Motion yalnızca estetik değildir.
Şunlar için kullanılır:
- durum değişimini anlatmak,
- hiyerarşi kurmak,
- odak yönlendirmek,
- uzamsal geçişi açıklamak,
- sistemin tepkisini hissettirmek.

## 18.2. Motion kuralları

- kısa ve anlamlı olmalı,
- ana görevi geciktirmemeli,
- gereksiz dramatik olmamalı,
- aynı bileşen ailesi benzer motion dilini kullanmalı,
- reduced motion tercihine saygı göstermeli.

## 18.3. Reduced motion

Bu proje kapsamında reduced motion desteği lüks değildir.
Gerekli yerlerde:
- animasyon azaltılmalı,
- hareket yerine fade veya state change kullanılmalı,
- kullanıcı tercihi göz ardı edilmemeli.

## 18.4. Zayıf motion örnekleri

- her tıklamada gösterişli animasyon,
- uzun süreli easing’lerle gecikmiş his,
- navigation’da baş döndüren geçişler,
- reduced motion olmadan her şeyi hareketlendirme.

---

# 19. Accessibility ile UI/UX İlişkisi

## 19.1. A11y bu dokümanda neden var?

Çünkü erişilebilirlik ayrı iş değil, UI/UX kalitesinin merkezindedir.

Bir arayüz:
- güzel,
- düzenli,
- modern
görünebilir.

Ama:
- okunmuyorsa,
- dokunulamıyorsa,
- focus sırası bozuksa,
- screen reader anlamıyorsa,
- kontrast yetersizse
kaliteli değildir.

## 19.2. UI/UX tarafında zorunlu a11y düşünme alanları

- contrast,
- touch target,
- label / hint,
- role,
- focus order,
- keyboard behavior,
- dynamic type,
- motion sensitivity,
- error okunabilirliği,
- renk dışı ayrıştırma.

## 19.3. Kritik ilke

Bu projede erişilebilirlik, “sonra ekleriz” alanı değil; tasarım kalitesinin asli parçasıdır.

---

# 20. Apple HIG Duyarlılığı

## 20.1. HIG burada ne anlama gelir?

Apple HIG bu projede yalnızca iOS estetiği değildir.
Şunları kapsar:
- touch ergonomisi,
- platforma uygun navigation,
- hiyerarşik ama sade düzen,
- gereksiz karmaşadan kaçınma,
- sistem davranışlarına saygı,
- erişilebilirlik farkındalığı,
- motion ve durum yönetimi dengesi,
- net aksiyon önceliği.

## 20.2. HIG duyarlılığının somut karşılıkları

- safe area ihlal edilmez,
- tıklanabilir alanlar küçültülmez,
- karmaşık ekranlarda bile odak korunur,
- bottom action, sheet, modal, list, form gibi yapılar native mantığa uzaklaşmaz,
- iOS kullanıcı beklentisi tamamen bozulmaz.

## 20.3. HIG duyarlılığı ne değildir?

- iOS görünümü kopyalamak,
- platformlar arası aynı tasarımı zorla iOS’a benzetmek,
- sadece yuvarlak köşe ve blur kullanmak,
- Apple benzeri görünüm için kullanılabilirliği bozmak.

---

# 21. Premium Hissiyat Standardı

## 21.1. Premium his nasıl oluşur?

Premium his şu unsurların ortak sonucudur:
- dengeli spacing,
- temiz typography,
- anlamlı yüzey kullanımı,
- düşük görsel gürültü,
- yüksek tutarlılık,
- iyi mikro geri bildirim,
- kontrollü motion,
- pürüzsüz form ve navigation davranışı,
- güven veren hata ve loading yönetimi.

## 21.2. Premium his ne değildir?

- pahalı görünen gradient,
- fazla shadow,
- bol blur,
- çok animasyon,
- aşırı minimal ama işlevsiz ekranlar.

## 21.3. Premium his için kontrol soruları

- ekran nefes alıyor mu?
- primary action net mi?
- görsel gürültü gereğinden fazla mı?
- state değişimleri güven veriyor mu?
- bileşen ailesi tutarlı mı?
- bilgi yoğunluğu kontrol altında mı?
- birinci sınıf ürün hissi var mı, yoksa acele geliştirilmiş mi görünüyor?

---

# 22. Visual Accuracy ve Implementation Discipline

## 22.1. Tasarımdan koda geçişte kalite nedir?

Kaliteli uygulama:
- tasarımın ruhunu kaybetmez,
- spacing ve hierarchy’yi bozmaz,
- “yaklaşık benzettim” seviyesinde kalmaz,
- token ve component kurallarını delmez,
- görsel kararları keyfi yorumlamaz.

## 22.2. Zorunlu ilkeler

- tasarım varsa sadakatle uygulanmalı,
- tasarım belirsizse keyfi karar verilmemeli; belirsizlik işaretlenmeli,
- screenshot-faithful yaklaşım gereken yerde kullanılmalı,
- bileşen yoksa önce tasarım sistemi açısından değerlendirilmeli, sonra yeni bileşen açılmalı.

## 22.3. Zayıf uygulama örnekleri

- tasarımı “yaklaşık” çevirmek,
- mevcut DS bileşeni varken yeni varyant uydurmak,
- spacing’i göze göre vermek,
- font / weight / line-height rollerini bozmak,
- responsive bahanesiyle hiyerarşiyi dağıtmak.

---

# 23. Anti-Pattern Listesi

Aşağıdaki davranışlar UI/UX kalitesi açısından zayıf kabul edilir:

1. Her ekranın kendi stil mantığıyla yazılması
2. Design system dışında özel buton/input üretimi
3. Hardcoded spacing/color/typography
4. Safe area’nın rastgele ele alınması
5. Touch target’ın küçültülmesi
6. Feedback states’in atlanması
7. Error/loading/empty durumlarının sonradan düşünülmesi
8. Platform farklılığı bahanesiyle UX kalitesinin düşürülmesi
9. Navigation’daki geri davranışın belirsiz kalması
10. Form validation’ın kullanıcıyı cezalandıran biçimde kurgulanması
11. Motion’un azaltılabilirlik düşünülmeden eklenmesi
12. Sadece görsel doğruluk için accessibility’nin bozulması
13. Sadece accessibility için görsel sistemin tamamen dağılması
14. Hover mantığını mobile’a, touch mantığını web’e kör biçimde taşımak
15. UI yoğunluğunu platform ergonomisine bakmadan kopyalamak

---

# 24. Bir Ekranın Kaliteli Sayılması İçin Kontrol Listesi

Bir ekran kaliteli sayılmadan önce en az şu sorular sorulmalıdır:

## Görsel
- Hiyerarşi net mi?
- Spacing tutarlı mı?
- Typography rolleri doğru mu?
- Vurgu kontrollü mü?
- Yüzey mantığı temiz mi?

## Kullanılabilirlik
- Ana görev anlaşılır mı?
- Primary action görünür mü?
- Geri davranışı net mi?
- Bilgi yoğunluğu yönetilebilir mi?
- Kullanıcı sürtünmesiz ilerleyebilir mi?

## Interaction
- Bütün dokunulabilir alanlar yeterli mi?
- Feedback states tanımlı mı?
- Disabled/loading/error/success ayrışıyor mu?

## A11y
- Kontrast yeterli mi?
- Label/role/hint mantığı var mı?
- Dynamic type düşünülmüş mü?
- Touch target yeterli mi?
- Focus ve keyboard mantığı bozuk mu?

## Platform
- Safe area doğru mu?
- Platform ergonomisine uygun mu?
- Web/mobile farkları bilinçli mi?
- Platform davranışı bozulmuş mu?

Bu sorulara yeterli cevap veremeyen ekran “çalışıyor” olsa bile kaliteli kabul edilmez.

---

# 25. Bu Dokümanın Sonraki Dokümanlara Etkisi

## 25.1. Design system architecture
`04-design-system-architecture.md`, burada tanımlanan görsel ve interaction kalite standardını enforce edilebilir sisteme dönüştürmelidir.

## 25.2. Theming and visual language
`05-theming-and-visual-language.md`, color, typography, spacing, surface ve state semantics’i bu belgeyle uyumlu detaylandırmalıdır.

## 25.3. Navigation rules
`08-navigation-and-flow-rules.md`, bu dokümandaki kullanılabilirlik, geri davranışı ve platform ergonomisi ilkelerini akış düzeyine indirmelidir.

## 25.4. Forms and validation
`11-forms-inputs-and-validation.md`, form UX kurallarını burada tanımlanan standardın detay seviyesiyle işletmelidir.

## 25.5. Accessibility standard
`12-accessibility-standard.md`, burada geçen a11y ilkelerini teknik ve denetim boyutuna taşımalıdır.

## 25.6. Quality gates and governance
`15-quality-gates-and-ci-rules.md` ve `16-tooling-and-governance.md`, bu belge içindeki kuralların nasıl ölçüleceğini ve nasıl enforce edileceğini tanımlamalıdır.

---

# 26. Onay Kriterleri

Bu doküman yeterli kabul edilir eğer:

1. UI/UX kalitesi estetik beğeni düzeyinde bırakılmamışsa,
2. Görsel kalite, interaction, accessibility, HIG ve platform ergonomisi birlikte ele alınmışsa,
3. Premium hissiyat soyut laf olmaktan çıkarılmışsa,
4. Touch target, safe area, feedback state, form UX, motion ve navigation kullanılabilirliği açıkça tanımlanmışsa,
5. Zayıf yaklaşımlar net biçimde reddedilmişse,
6. Sonraki dokümanlara yön verecek kadar operasyonel çerçeve kurulmuşsa.

---

# 27. Skeleton Screen Standardı

Loading state için shimmer/skeleton pattern'i, kullanıcının bekleme süresinde içerik yapısını önceden algılamasını sağlar. Spinner'ın aksine skeleton, gelen verinin yerleşim düzenini önceden gösterir ve algılanan bekleme süresini kısaltır.

## 27.1. Skeleton Varyantları

| Ekran Tipi | Skeleton Pattern | Animasyon |
|-----------|-----------------|-----------|
| Liste (FlatList) | Tekrarlayan satır placeholder (3-5 satır) | Shimmer (soldan sağa) |
| Detay ekranı | Başlık + paragraf blokları + resim placeholder | Shimmer (soldan sağa) |
| Form | Input field placeholder'ları (label + input kutusu) | Pulse (opacity 0.3 ↔ 0.7) |
| Kart grid | Kart boyutunda dikdörtgen placeholder | Shimmer (soldan sağa) |
| Profil | Avatar daire + metin satırları (2-3 satır) | Shimmer (soldan sağa) |

## 27.2. Boyut ve Layout Shift Önleme

Skeleton placeholder'larının boyutları gerçek içerikle eşleşmelidir. Bu kural, skeleton'dan gerçek içeriğe geçişte layout shift (CLS) oluşmasını önler.

- Skeleton yüksekliği, gerçek component yüksekliğiyle aynı olmalıdır.
- Liste skeleton'unda satır sayısı, beklenen ortalama liste boyutuna yakın tutulmalıdır (minimum 3, maksimum 5 satır).
- Resim placeholder'ı, gerçek resmin aspect ratio'sunu korumalıdır.

## 27.3. Animasyon Kuralları

- **Shimmer döngü süresi:** 1.5-2 saniye (bir tam soldan sağa geçiş).
- **Pulse animasyon süresi:** 1.5 saniye (opacity 0.3 → 0.7 → 0.3 döngüsü).
- **Reduced motion:** `prefers-reduced-motion` aktifse animasyon durdurulur, statik placeholder gösterilir.
- Animasyon Reanimated 3 worklet ile UI thread üzerinde çalıştırılmalıdır (JS thread bloke etmez).

## 27.4. Renk Token'ları

Skeleton renkleri semantic token üzerinden tanımlanır, hardcoded renk kullanılmaz:

- `color-skeleton-base`: Skeleton arka plan rengi (light: `neutral-100`, dark: `neutral-800`)
- `color-skeleton-highlight`: Shimmer parlama rengi (light: `neutral-200`, dark: `neutral-700`)

## 27.5. Erişilebilirlik

- Her skeleton container'ına `accessibilityLabel="Yükleniyor"` eklenir.
- `accessibilityRole="progressbar"` atanır.
- Screen reader kullanıcıları için skeleton sayısı değil, "İçerik yükleniyor" anonsı yeterlidir.

## 27.6. Skeleton → Gerçek İçerik Geçişi

- Veri geldiğinde skeleton fade-out (200ms, `easing-exit`) ile kaybolur.
- Gerçek içerik fade-in (200ms, `easing-enter`) ile görünür.
- Bu geçiş animasyonu layout shift'e neden olmamalıdır; skeleton ve gerçek içerik aynı boyutlarda olmalıdır.

---

# 28. Micro-Interaction Kataloğu

Temel etkileşimlerin standart animasyon tanımları aşağıdaki tabloda belirlenmiştir. Tüm micro-interaction'lar Reanimated 3 worklet bazlı çalışır ve 60fps performans garantisi sağlar.

## 28.1. Standart Etkileşim Tablosu

| Etkileşim | Animasyon | Süre | Eğri | Platform Farkı |
|-----------|----------|------|------|---------------|
| Buton basımı | Scale down (0.96) + opacity (0.8) | 100ms | ease-out | Aynı |
| Pull-to-refresh | Native spring animation | Platform default | spring | iOS: UIRefreshControl, Android: SwipeRefreshLayout |
| Swipe-to-delete | Satır sola kayar, kırmızı arka plan açığa çıkar | 200ms | ease-in-out | iOS: native trailing swipe, Android: custom Reanimated |
| Tab geçişi | Cross-fade (opacity 0→1 / 1→0) | 150ms | ease | Aynı |
| Modal açılış | Bottom-to-top slide + backdrop fade (opacity 0→0.5) | 300ms | spring(damping: 20) | iOS: pageSheet native, Android: custom slide |
| Toast bildirimi | Top slide-in + auto-dismiss | in: 200ms, out: 300ms, görünür kalma: 3s | ease-out | Aynı |
| Like/unlike | Scale bounce (1.0→1.3→1.0) + renk değişimi | 300ms | spring(damping: 12) | Aynı |
| Sayfa geçişi | Push (sağdan sola slide) | 350ms | Platform default | iOS: native stack push, Android: Reanimated slide |
| Accordion açılış | Height expand + fade-in | 250ms | easing-standard | Aynı |
| Checkbox toggle | Scale bounce (0.9→1.1→1.0) + renk geçişi | 200ms | spring | Aynı |

## 28.2. Implementasyon Kuralları

- Tüm micro-interaction'lar `react-native-reanimated` v3 worklet API'si ile implement edilir.
- Animasyon shared value üzerinden yönetilir, `useAnimatedStyle` ile component'e bağlanır.
- JS thread'e düşen animasyon kabul edilmez; tüm animasyonlar UI thread'de çalışmalıdır.
- `useReducedMotion()` hook'u ile reduced motion kontrolü yapılır; aktifse animasyon atlanır veya instant geçiş uygulanır.

## 28.3. Token Bağlantısı

Micro-interaction süreleri `22-design-tokens-spec.md`'deki motion token'larına bağlanmalıdır:
- Buton basımı → `duration-instant` (100ms)
- Tab geçişi → `duration-fast` (150ms)
- Modal açılış → `duration-slow` (350ms)
- Accordion → `duration-standard` (250ms)

---

# 29. In-App Feedback ve Store Rating Prompt

Bu bölüm, uygulama içi kullanıcı geri bildirimi toplama ve App Store / Google Play Store'da rating isteme stratejisini tanımlar.

## 29.1. Store Rating Prompt

- **Araç:** `expo-store-review` (StoreKit iOS / Play In-App Review Android)
- Native rating dialog kullanılır — custom star-rating dialog iOS'ta App Store policy ihlali oluşturur (Apple App Store Review Guidelines 5.6.1)
- Prompt kullanıcıya yılda max 3 kez gösterilebilir (Apple kısıtlaması — iOS bu limiti otomatik olarak enforce eder)
- Android'de Google Play In-App Review widget'ı gösterilir

## 29.2. Rating Prompt Zamanlama Stratejisi

| Tetikleyici | Minimum Koşul | Bekleme Süresi |
|------------|--------------|---------------|
| Başarılı görev tamamlama | 3+ başarılı oturum | İlk 3 günden sonra |
| Başarılı ödeme | 1+ ödeme | İlk ödeme anında değil, sonraki oturumda |
| X. oturum | 10+ oturum | Uygulama 10 kez açıldıktan sonra |
| Feature keşfi | 3+ farklı feature kullanımı | 1 hafta sonra |

**Negatif anlardan KAÇIN:**

- Hata/crash sonrası rating isteme
- İlk açılışta rating isteme
- Ödeme ekranında/akışında rating isteme
- Form doldurma sırasında rating isteme
- Kullanıcı bekleme yaşarken (loading) rating isteme

## 29.3. Rating Analytics Event'leri

| Event | Açıklama |
|-------|----------|
| `rating_prompt_shown` | Prompt gösterildi |
| `rating_prompt_completed` | Kullanıcı rating verdi (sonucu bilinmez — Apple/Google API sonucu döndürmez) |
| `rating_prompt_dismissed` | Kullanıcı prompt'u kapattı |

## 29.4. In-App Feedback Form

Settings veya Help ekranından erişilebilen feedback formu:

- **Kategori seçimi:** Bug (hata), Öneri (feature request), Soru (destek), Diğer
- **Mesaj alanı:** Min 20 karakter, max 2000 karakter
- **Ekran görüntüsü ekleme (opsiyonel):** `expo-image-picker` ile galeri/kamera
- **Email alanı (opsiyonel):** Yanıt almak isteyen kullanıcılar için
- **Otomatik eklenen bilgiler:** Cihaz modeli, OS, app version, build number (PII değil)
- **Submit:** Backend API'ye veya email'e gönderilir (derived project kararı)

## 29.5. Bug Report (Shake-to-Report)

- Cihaz sallama (shake gesture) ile hızlı bug raporu
- Otomatik ekran görüntüsü alınır
- Cihaz bilgisi otomatik eklenir
- Son Sentry event ID'si eklenir (destek ekibi korelasyon yapabilir)
- Uygulama: `DeviceEventEmitter` + Accelerometer veya `expo-sensors`
- Aktivasyon: Development ve staging build'lerde varsayılan açık, production'da Settings'ten açılabilir

## 29.6. Anti-pattern'ler

- Her oturumda rating istemek (kullanıcı rahatsızlığı)
- Custom yıldız rating dialog'u kullanmak (iOS App Store policy ihlali — Apple red)
- Hata anında veya crash sonrası rating istemek
- Rating sonucunu backend'e kaydetmeye çalışmak (API sonucu döndürmez)
- Feedback form'da zorunlu email alanı (kullanıcı kaçırır)

---

# 30. Kısa Sonuç

Bu dokümanın ana çıktısı şudur:

> Bu boilerplate kapsamında yüksek UI/UX kalitesi; güzel görünen ekranlar üretmek değil, design system ile yönetilen, Apple HIG duyarlılığı taşıyan, erişilebilir, tutarlı, ergonomik, güven veren ve premium hissiyatı sistematik biçimde üreten arayüzler kurmak demektir.

Bu nedenle bundan sonraki hiçbir doküman:
- UI kararlarını keyfi bırakamaz,
- premium hissiyatı dekoratif efektlere indirgemez,
- accessibility’yi ikincil alan gibi ele alamaz,
- platform ergonomisini görmezden gelemez,
- “çalışıyor” olmasını kalite için yeterli sayamaz.

---

# 31. Onboarding ve First-Time User Experience (FTUE)

Bu bölüm, uygulamayı ilk kez kullanan kullanıcının karşılaştığı deneyimi, feature discovery mekanizmalarını ve onboarding stratejisini tanımlar.

## 31.1. Temel İlke

Onboarding, uygulamanın değer önerisini en kısa sürede göstermek ve kullanıcıyı ilk anlamlı aksiyona yönlendirmek için vardır. Onboarding sırasında kullanıcı “bu uygulama ne işe yarıyor?” sorusunun cevabını almış ve en az bir değerli aksiyon gerçekleştirmiş olmalıdır.

**Anti-pattern:** Kullanıcıyı 5+ ekranlık carousel'dan geçirip sonra boş bir dashboard'a bırakmak.

## 31.2. Onboarding Yaklaşımları

### 31.2.1. Progressive Disclosure (Önerilen Default)

Tüm bilgiyi bir anda göstermek yerine, kullanıcının ihtiyaç duyduğu anda ve bağlamında göster:

- İlk açılışta yalnızca kritik bilgi (değer önerisi + ilk aksiyon)
- İleri özellikler, kullanıcı o özelliğe ilk kez ulaştığında açıklanır
- Her adımda kullanıcıya yalnızca bir şey öğretilir

### 31.2.2. Carousel / Walkthrough (Koşullu Kullanım)

Statik tanıtım ekranları yalnızca aşağıdaki koşullarda kabul edilir:

- **Maksimum 3 ekran** (3'ten fazla = kullanıcı sıkılır ve skip eder)
- Her ekranda tek bir net mesaj
- Son ekranda actionable CTA (hesap oluştur, ilk adımı at)
- **Skip butonu her zaman görünür** — kullanıcıyı carousel'dan çıkamaz hale getirmek yasaktır

### 31.2.3. Coachmark / Tooltip Rehberlik

Uygulama içi bağlamsal rehberlik:

- **Spotlight:** Hedef UI elemanını vurgular, arka planı karartır
- **Tooltip:** Kısa açıklama metni ile özelliği tanıtır
- **Sıralı tour:** 3-5 adımlık bağlamsal tur (daha fazla kullanıcıyı bunaltır)
- **Dismiss:** Kullanıcı herhangi bir anda turu kapatabilir
- **Persistence:** Kapatılan tour bir daha gösterilmez (MMKV'de flag saklanır — ADR-019)

## 31.3. Feature Discovery Mekanizması

- **What's New ekranı:** Major update sonrası tek seferlik gösterilir
- **Badge/indicator:** Yeni menü öğeleri veya butonlarda “Yeni” badge'i
- **Contextual tip:** Özelliğin kullanılacağı anda kısa bir açıklama balonu
- **Kural:** Aynı özellik için 2'den fazla feature discovery gösterimi yapılmaz

## 31.4. Skip / Dismiss Politikası

- Onboarding her zaman skip edilebilir olmalıdır
- Skip eden kullanıcı, daha sonra Settings > Yardım > “Turu tekrar gör” ile erişebilir
- Skip durumu MMKV'de saklanır; kullanıcı değişikliğinde sıfırlanır (ADR-019 cleanup policy)

## 31.5. Onboarding State Persistence

- Onboarding tamamlanma flag'i: `onboardingCompleted: boolean` → MMKV plain instance (ADR-019)
- Feature discovery flag'leri: `featureDiscovery.{featureId}: boolean` → MMKV plain instance
- Kullanıcı değişikliğinde veya logout'ta bu flag'ler temizlenir

## 31.6. Ölçüm ve Metrikler

| Metrik | Hedef | Ölçüm |
|--------|-------|-------|
| Onboarding completion rate | > %70 | Analytics event: `onboarding_completed` |
| Onboarding skip rate | < %30 | Analytics event: `onboarding_skipped` |
| Time to first action | < 2 dk | İlk anlamlı aksiyon event'i |
| Feature discovery engagement | > %50 | Coachmark/tooltip tıklama oranı |

## 31.7. Anti-pattern'ler

- 5+ ekranlık onboarding carousel (kullanıcılar skip eder)
- Skip butonu olmayan onboarding (kullanıcı mahsur kalır)
- Onboarding tamamlanmadan uygulamayı kullanmaya izin vermemek
- Aynı coachmark'ı her uygulama açılışında tekrar göstermek
- Login/register'ı onboarding'in ilk adımı yapmak (değer görmeden kayıt istemek)
