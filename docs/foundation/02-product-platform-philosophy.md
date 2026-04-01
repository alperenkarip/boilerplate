# 02-product-platform-philosophy.md

## Doküman Kimliği

- **Doküman adı:** Product & Platform Philosophy
- **Dosya adı:** `02-product-platform-philosophy.md`
- **Doküman türü:** Philosophy / decision foundation document
- **Durum:** Accepted
- **Kapsam:** Cross-platform ürün mantığını, web ve mobil arasındaki ilişki modelini, parity yaklaşımını, shared vs platform-specific sınırlarını ve ürün davranış standardını tanımlar.
- **Bağlı olduğu üst dokümanlar:**
  - `00-project-charter.md`
  - `01-working-principles.md`
- **Doğrudan etkileyeceği dokümanlar:**
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
  - `16-tooling-and-governance.md`
  - `17-technology-decision-framework.md`

---

# 1. Amaç

Bu dokümanın amacı, oluşturulacak boilerplate içinde **ürün** ve **platform** kavramlarının nasıl ele alınacağını sabitlemektir.

Bu belge, “web de olsun, mobil de olsun” gibi yüzeysel bir yaklaşımı değil; şu temel soruları yanıtlayan yapısal bir çerçeveyi tanımlar:

1. Cross-platform ürün derken tam olarak ne kastediliyor?
2. Web ve mobil aynı ürünün iki yüzü mü, yoksa iki ayrı uygulama mı?
3. Hangi alanlar ortak düşünülmeli?
4. Hangi alanlarda platform farklılığı bilinçli biçimde korunmalı?
5. Parity ne demek, ne demek değildir?
6. Shared code ne zaman doğru, ne zaman zararlıdır?
7. Ürün davranışı ile implementasyon kararı nasıl ayrılmalıdır?

Bu doküman olmadan “cross-platform” kavramı hızla anlamsızlaşır. Çünkü çoğu projede bu kelime şu üç zayıf anlamdan birine düşer:

- mümkün olduğunca çok kod paylaşmak,
- hem web hem mobil çıkmak,
- tek teknoloji zihniyetiyle her şeyi çözmeye çalışmak.

Bu proje kapsamında bu üç yaklaşım da tek başına yeterli kabul edilmez.

---

# 2. Neden Bu Doküman Gerekli

Cross-platform projelerde en sık yapılan yapısal hata, platform ilişkisinin başta tanımlanmamasıdır.

Bu durumda şu bozulmalar oluşur:

- web ve mobil için aynı feature farklı mantıklarla geliştirilir,
- ekip “aynı ürün mü yapıyoruz, aynı kodu mu paylaşıyoruz?” sorusunu karıştırır,
- parity kavramı yanlış yorumlanır,
- navigation ve flow kararları birbirinden kopar,
- tasarım sistemi ortak görünür ama davranış modeli ayrışır,
- domain mantığı ile platform implementasyonu iç içe geçer,
- gereksiz ortaklaştırma native kaliteyi düşürür,
- gereksiz ayrıştırma bakım maliyetini artırır.

Bu nedenle cross-platform felsefesi, teknoloji seçiminden önce netleşmelidir.

Bu belge olmadan şu tür cümleler risk üretir:

- mümkün olduğunca her şeyi ortak yapalım,
- web ve mobil birebir aynı olsun,
- mobile’da da web’deki gibi ilerleyelim,
- mobil için ayrı, web için ayrı düşünmeyelim,
- platform farklarını sonra çözeriz.

Bu cümleler ilk bakışta pratik görünür ama gerçek ürün kalitesini bozar.

---

# 3. Temel Tez

Bu proje kapsamında temel tez şudur:

> Web ve mobil, aynı ürün sisteminin iki farklı platform yorumu olarak ele alınmalıdır; ortak olan şey kod oranı değil, ürün mantığı, kalite standardı, tasarım dili ve davranış modelidir. Platforma özgü farklılıklar ise bastırılmamalı, bilinçli ve gerekçeli biçimde yönetilmelidir.

Bu tez dört ayrı sonucu beraberinde getirir:

1. **Tek ürün, iki rastgele uygulama değil.**
2. **Tek implementasyon zorunluluğu yok.**
3. **Ortaklaştırma amaç değil, araçtır.**
4. **Platform farklılığı kaliteyi artırıyorsa korunmalıdır.**

---

# 4. Cross-Platform Kavramının Bu Projedeki Anlamı

## 4.1. Cross-platform ne demektir?

Bu proje kapsamında cross-platform, şu bileşenlerin bilinçli şekilde birlikte tasarlanması anlamına gelir:

- ortak ürün amacı,
- ortak domain mantığı,
- ortak kalite standardı,
- ortak design language,
- ortak karar sistemi,
- mümkün olan yerde ortak dokümantasyon,
- uygun olan yerde ortak kod,
- gerekli olan yerde platform-spesifik farklılaşma.

## 4.2. Cross-platform ne demek değildir?

Aşağıdakiler bu proje kapsamında cross-platform tanımı değildir:

### A. Maksimum shared code
Kod paylaşım oranı yüksek diye ürün başarılı sayılmaz.

### B. Her şeyi birebir aynı yapmak
Web ve mobil birebir aynı görünmek veya aynı davranmak zorunda değildir.

### C. Platformları zorla tek kurala sokmak
Platformun doğal kullanım modelini bastırmak kaliteyi düşürür.

### D. “React kullanıyorsak her şey ortak olur” varsayımı
Aynı ekosistem ailesinde olmak, doğru paylaşım stratejisi kurulduğu anlamına gelmez.

### E. İki platformu da aynı geliştirme problemi gibi görmek
Web ve mobil aynı ürün evrenine ait olabilir; ama aynı platform problemi değildir.

---

# 5. Ürün Merkezli Yaklaşım

## 5.1. Önce ürün, sonra platform

Bu boilerplate kapsamında düşünme sırası şudur:

1. ürün problemi,
2. ürün davranışı,
3. kullanıcı akışı,
4. domain modeli,
5. kalite standardı,
6. platform yorumu,
7. implementasyon.

Bu sıranın amacı şudur:
Platform, ürün mantığının üstüne binen bir yorum katmanıdır. Ürünün yerini almaz.

## 5.2. Aynı ürün sistemi ne demektir?

Web ve mobilin aynı ürün sistemi içinde olması şu anlama gelir:

- aynı iş hedefini taşımaları,
- aynı domain kurallarına bağlı olmaları,
- aynı veri modelini yorumlamaları,
- benzer bilgi mimarisi mantığını izlemeleri,
- kullanıcıya çelişkili deneyim sunmamaları,
- marka ve kalite algısında kırılma yaratmamaları.

## 5.3. Aynı ürün sistemi neyi zorunlu kılmaz?

Aynı ürün sistemi olmak şu zorunlulukları doğurmaz:

- her ekranın birebir aynı görünmesi,
- her interaction pattern’in birebir aynı olması,
- her navigation adımının birebir aynı olması,
- her UI component’in tek kodla üretilmesi,
- platform güçlü yönlerinin görmezden gelinmesi.

---

# 6. Platformların Rolü

## 6.1. Web’in rolü

Web, bu boilerplate kapsamında genellikle şu güçlü yönlerle değerlendirilmelidir:

- geniş viewport esnekliği,
- route ve URL merkezli gezinme,
- keyboard-first kullanım olasılığı,
- çoklu panel / daha yoğun bilgi sunumu,
- hover ve pointer destekli interaction,
- paylaşılabilir URL yapısı,
- daha görünür bilgi mimarisi.

## 6.2. Mobile’ın rolü

Mobile, bu boilerplate kapsamında genellikle şu güçlü yönlerle değerlendirilmelidir:

- touch-first kullanım,
- gesture ve doğal geçiş deneyimi,
- ekran yoğunluğu yerine odaklı sunum,
- safe area ve ergonomi hassasiyeti,
- tek akışa odaklı ekran ilerleyişi,
- mobil donanım ve sistem davranışlarıyla daha sıkı ilişki,
- doğal presentational pattern’ler (sheet, stack, modal, tab, native back behavior).

## 6.3. Sonuç

Bu farklar, web ve mobilin iki ayrı ürün olduğu anlamına gelmez.
Ama aynı davranışı iki platformda da aynı implementasyonla kurmaya çalışma fikrinin çoğu zaman zayıf olduğunu gösterir.

---

# 7. Parity Felsefesi

Bu dokümanda parity kavramı özellikle ayrıştırılmalıdır. Çünkü en çok yanlış anlaşılan alanlardan biridir.

## 7.1. Behavior parity

Behavior parity, kullanıcının aynı işi iki platformda da mantıksal olarak benzer şekilde tamamlayabilmesi demektir.

### Behavior parity örnekleri
- kayıt oluşturma akışı iki platformda da aynı ürün sonucunu üretir,
- filtreleme mantığı iki platformda da aynı veri mantığıyla çalışır,
- hata ve başarı durumları çelişkili davranmaz,
- kayıt düzenleme, kaydetme, iptal etme gibi ana eylemler ürün düzeyinde aynı anlama gelir.

### Behavior parity neyi zorunlu kılmaz?
- aynı buton yerleşimi,
- aynı navigation kabuğu,
- aynı modal sunumu,
- aynı ekran yoğunluğu.

Behavior parity bu proje için yüksek önceliklidir.

## 7.2. Design parity

Design parity, marka dili, görsel hiyerarşi, bileşen ailesi mantığı ve kalite algısının platformlar arasında tutarlı olması demektir.

### Design parity örnekleri
- tipografik hiyerarşi benzer mantıkla çalışır,
- renk semantiği tutarlıdır,
- primary/secondary eylem dili benzer görünür,
- input, button, card, list item gibi bileşenlerin aynı sistem ailesine ait olduğu hissedilir.

### Design parity neyi zorunlu kılmaz?
- piksel piksele aynı ekran,
- tamamen aynı spacing uygulaması,
- tüm componentlerin tek render sistemiyle çözülmesi.

Design parity de yüksek önceliklidir, ancak platform ergonomisi gerekirse kontrollü ayrım yapılabilir.

## 7.3. Information architecture parity

Bu, içeriğin ve ana ürün yapısının benzer mantıkla örgütlenmesi anlamına gelir.

### Örnek
- aynı temel bilgi alanları,
- aynı veri hiyerarşisi,
- benzer feature grouping,
- kullanıcıyı yanıltmayan içerik organizasyonu.

Bu alan, behavior parity kadar katı olmayabilir ama önemli referans sağlar.

## 7.4. Implementation parity

Implementation parity, aynı şeyin aynı teknik çözümle kurulmasıdır.

Bu proje kapsamında implementation parity birincil hedef değildir.

### Neden?
Çünkü:
- platformlar farklıdır,
- kalite bazen farklı implementasyon gerektirir,
- ortak davranış için farklı renderer veya farklı navigation yapısı gerekebilir,
- implementasyon eşitliği uğruna kalite feda edilmemelidir.

## 7.5. Öncelik sırası

Bu proje için parity öncelik sırası şudur:

1. Behavior parity
2. Design parity
3. Information architecture parity
4. Implementation parity

Bu sıralama özellikle önemlidir.
Çünkü çoğu ekip hatayı burada yapar ve implementasyon parity’yi en üste koyar. Bu, yanlış önceliktir.

---

# 8. Shared vs Platform-Specific Sınırı

## 8.1. Temel ilke

Temel ilke şudur:

> Ortaklaştırma, gerçekten ortak olan problemi çözdüğü sürece değerlidir. Platforma özgü kaliteyi zayıflatan ortaklaştırma reddedilmelidir.

## 8.2. Varsayılan olarak shared düşünülmesi gereken alanlar

Aşağıdaki alanlar güçlü adaydır:

### A. Domain mantığı
- business rules,
- saf hesaplama mantıkları,
- validation kurallarının domain tarafı,
- veri dönüşümleri,
- formatlama kurallarının platformdan bağımsız kısmı.

### B. Tasarım sistemi kararları
- token mantığı,
- semantic token yapısı,
- component family rules,
- görsel hiyerarşi ilkeleri,
- interaction contract seviyesindeki kurallar.

### C. Dokümantasyon
- charter,
- working principles,
- design system architecture,
- application architecture,
- testing strategy,
- technology decision framework.

### D. Bazı ortak utility katmanları
- saf yardımcı fonksiyonlar,
- shared types,
- shared schemas,
- ortak data contracts.

## 8.3. Varsayılan olarak platform-spesifik ele alınması muhtemel alanlar

### A. Navigation shell
- web route modeli,
- mobile stack/tab/sheet yapısı,
- deep linking yorumları.

### B. Presentation pattern’leri
- modal vs sheet,
- hover state vs touch affordance,
- sidebar vs tab bar,
- dense layout vs focused layout.

### C. Platform adapter katmanı
- storage erişimi,
- device API’leri,
- platform-specific file handling,
- notification integration,
- native OS behavior.

### D. Input ergonomisi
- keyboard-first etkileşim,
- touch-first etkileşim,
- pointer behavior,
- selection ve focus modeli.

## 8.4. Gri alanlar

Aşağıdaki alanlar ne otomatik shared ne otomatik platform-specific kabul edilmelidir:

- form abstraction katmanı,
- list ve card component’leri,
- analytics event mapping,
- cache stratejisi,
- offline davranışı,
- error presentation layer,
- theming implementation.

Bu alanlar için ayrı karar gerekir.

---

# 9. Shared Code İçin Karar Testi

Bir şeyi shared yapmak istendiğinde aşağıdaki sorular sırayla sorulmalıdır:

1. Bu gerçekten iki platformda da aynı problemi mi çözüyor?
2. Aynı ürün sonucunu mu üretiyor, yoksa sadece benzer görünüyor mu?
3. Ortaklaştırma kaliteyi düşürüyor mu?
4. Ortaklaştırma platform ergonomisini bozuyor mu?
5. Ortaklaştırma test yüzeyini iyileştiriyor mu?
6. Ortaklaştırma bakım maliyetini azaltıyor mu?
7. Ortaklaştırma ileride platform özgürlüğünü boğar mı?
8. Bu alan behavior parity için mi ortak, yoksa implementation parity takıntısı yüzünden mi ortaklaştırılıyor?

Bu sorulara tatmin edici cevap verilemiyorsa shared kararı zayıftır.

---

# 10. Kör Ortaklaştırma Karşıtı İlke

Bu proje kapsamında şu yaklaşım reddedilir:

- mümkün olduğunca her şeyi packages içine alalım,
- aynı component web ve mobile’da mutlaka tek yerden gelsin,
- platform-specific dosya sayısı arttıysa başarısız olduk,
- ortak kod azsa kötü bir mimari kurduk.

Bu düşünce hatalıdır.

Doğru yaklaşım şudur:
- ortaklaştırma gerekçeli olmalı,
- platform-specific ayrım da gerekçeli olmalı,
- başarı metriği shared code yüzdesi değil, kalite ve sürdürülebilirlik olmalı.

---

# 11. Platform Farklılaşmasının Kabul Edildiği Alanlar

Bu bölüm özellikle önemlidir. Çünkü hangi farklılıkların “uyumsuzluk” değil “doğru platform uyarlaması” sayılacağını sabitlemek gerekir.

## 11.1. Navigation pattern farklılığı

Kabul edilir:
- web’de sidebar + detail layout,
- mobile’da stack veya tab ağırlıklı akış.

Kabul edilmez:
- aynı ürün görevinin iki platformda bambaşka mantıkla çözülmesi.

## 11.2. Overlay / presentation farklılığı

Kabul edilir:
- web’de dialog,
- mobile’da bottom sheet veya native modal.

Kabul edilmez:
- bir platformda destructive confirm zorunluyken diğerinde tamamen sessiz ilerleme.

## 11.3. Layout yoğunluğu farklılığı

Kabul edilir:
- web’de aynı ekranda daha çok bilgi,
- mobile’da daha odaklı, bölüm bölüm akış.

Kabul edilmez:
- bilgi yapısının platforma göre çelişkili hale gelmesi.

## 11.4. Interaction micro-pattern farklılığı

Kabul edilir:
- hover state’in yalnızca web’de bulunması,
- swipe/gesture davranışlarının mobile’da bulunması.

Kabul edilmez:
- bu farklılıkların ana ürün sonucunu değiştirmesi.

## 11.5. Input ve focus farklılığı

Kabul edilir:
- keyboard flow’un web’de daha güçlü olması,
- touch ergonomisinin mobile’da öncelikli olması.

Kabul edilmez:
- bir platformda erişilebilirlik ve input kalitesinin ciddi biçimde geri kalması.

---

# 12. Platform Farklılaşmasının Kabul Edilmediği Alanlar

Aşağıdaki alanlarda platform farkı bahanesiyle kalite standardı düşürülemez:

## 12.1. Domain doğruluğu
İş kuralı iki platformda farklı çalışamaz.

## 12.2. Kritik kullanıcı eylemleri
Kaydetme, silme, düzenleme, geri alma, onaylama gibi ana eylemler ürün mantığı açısından çelişkili olamaz.

## 12.3. Error handling mantığı
Hata durumları platforma göre anlamsız derecede farklı davranmamalıdır.

## 12.4. Güven ve kalite algısı
Bir platform premium, diğeri geçici iş gibi hissettiremez.

## 12.5. Accessibility standardı
Erişilebilirlik seviyesi platform farkı bahanesiyle aşağı çekilemez.

---

# 13. Ortak Tasarım Dili

## 13.1. Amaç

Web ve mobilin aynı ürün ailesine ait olduğu hissi yalnızca logo veya renk ile kurulmaz.
Aşağıdaki unsurlar ortak tasarım dilini oluşturur:

- renk semantiği,
- tipografi hiyerarşisi,
- yüzey mantığı,
- vurgu sistemi,
- spacing disiplini,
- component davranış ailesi,
- feedback ve interaction tonu.

## 13.2. Ortak tasarım dili neyi garanti eder?

- kullanıcı platform değiştirince yabancı hissetmez,
- feature’lar aynı sistemin parçası gibi görünür,
- marka ve kalite algısı tutarlı kalır,
- bileşen dili parçalanmaz.

## 13.3. Ortak tasarım dili neyi garanti etmez?

- platformlar arası birebir aynı layout,
- her breakpointte aynı ekran mimarisi,
- native ve web bileşenlerinin tek teknik altyapıyla yapılması.

---

# 14. Ortak Davranış Modeli

## 14.1. Tanım

Ortak davranış modeli, kullanıcıya sunulan ana ürün mantığının iki platformda da tutarlı olmasıdır.

Buna şunlar dahildir:
- aynı görevin benzer adımlarla tamamlanabilmesi,
- eylem sonuçlarının aynı olması,
- durum değişimlerinin aynı mantıkla yürümesi,
- kritik feedback’lerin aynı ürün anlamını taşıması,
- success/error/loading durumlarının aynı ürün diline bağlı kalması.

## 14.2. Örnek

Bir kaydı oluşturma akışı:
- web’de side panel veya dialog olabilir,
- mobile’da full-screen flow veya sheet olabilir.

Ama şu ortak kalmalıdır:
- zorunlu alan mantığı,
- validation sonucu,
- kaydetme davranışı,
- başarı ve hata sonucu,
- veri tutarlılığı.

Bu ayrım, behavior parity’nin neden implementation parity’den önemli olduğunu gösterir.

---

# 15. Ürün Akışı Tasarımında Zorunlu Yaklaşım

Her feature için şu dört katman ayrı düşünülmelidir:

1. ürün hedefi,
2. kullanıcı görevi,
3. platform yorumu,
4. implementasyon.

Bu sıra korunmazsa şu hata oluşur:
- platform davranışı ürün davranışının yerini alır.

Örneğin:
- “mobile’da böyle yapılır” cümlesi ürün kararını bastırmamalıdır.
- “web’de table mantıklı” cümlesi kullanıcı hedefi yerine geçmemelidir.

Önce ürün görevi tanımlanmalı, sonra platforma nasıl uyarlanacağı kararlaştırılmalıdır.

---

# 16. Information Density İlkesi

Web ve mobil aynı ürün olsa da aynı bilgi yoğunluğunu taşımak zorunda değildir.

## 16.1. Web için
Web daha yüksek bilgi yoğunluğu taşıyabilir:
- daha fazla tablo/sütun,
- yan panel,
- aynı anda çoklu context,
- filtre ve detayın bir aradalığı.

## 16.2. Mobile için
Mobile daha odaklı bilgi sunumu gerektirebilir:
- bölüm bölüm akış,
- progressive disclosure,
- tek odaklı ekran,
- gesture destekli geçiş.

## 16.3. Kural
Bilgi yoğunluğu farklılaşabilir; bilgi mantığı çelişemez.

---

# 17. Platforma Özgü Güçlü Yönleri Kullanma İlkesi

Bu boilerplate, platformları birbirine indirgemeye çalışmaz.
Aksine, kaliteyi artırıyorsa platformun güçlü yönleri kullanılmalıdır.

## 17.1. Web’in güçlü yönleri
- URL tabanlı navigasyon,
- multi-pane deneyim,
- geniş veri yoğunluğu,
- hover ve keyboard,
- discoverability.

## 17.2. Mobile’ın güçlü yönleri
- gesture,
- doğal geçiş akışları,
- tab ve stack yapıları,
- ergonomik tek görev odaklı ekranlar,
- device integration.

## 17.3. Kritik sınır
Platform gücünü kullanmak, ürün davranışını bozma hakkı vermez.

---

# 18. Boilerplate Düzeyinde Sabitlenecek Kararlar

Bu doküman, aşağıdaki kararları sabitler:

1. Web ve mobil aynı ürün sisteminin parçaları olarak ele alınacaktır.
2. Behavior parity, implementation parity’den daha önemlidir.
3. Shared code oranı başarı metriği olmayacaktır.
4. Ortak domain mantığı ve ortak kalite standardı korunacaktır.
5. Platforma özgü farklılıklar bastırılmayacak, gerekçeli şekilde yönetilecektir.
6. Navigation, presentation ve ergonomi alanlarında platform-specific çözümler meşru kabul edilecektir.
7. Domain mantığı, kritik ürün eylemleri, kalite algısı ve erişilebilirlik standardı platforma göre gevşetilmeyecektir.

---

# 19. Bu Dokümanın Sonraki Dokümanlara Etkisi

## 19.1. UI/UX kalite standardına etkisi
`03-ui-ux-quality-standard.md`, burada tanımlanan parity ve platform farklılaşması mantığına uymalıdır.

## 19.2. Design system mimarisine etkisi
`04-design-system-architecture.md`, ortak tasarım dilini korurken platform renderer veya varyant ihtimalini dışlamamalıdır.

## 19.3. Application architecture’a etkisi
`06-application-architecture.md`, ortak domain ve platform adapter ayrımını bu dokümana göre kurmalıdır.

## 19.4. Navigation dokümanına etkisi
`08-navigation-and-flow-rules.md`, behavior parity ile platform navigation pattern’lerini ayrı katmanlar olarak ele almalıdır.

## 19.5. Technology decision framework’e etkisi
`17-technology-decision-framework.md`, tool seçimlerini implementation parity takıntısı üzerinden değil kalite ve sürdürülebilirlik üzerinden değerlendirmelidir.

---

# 20. Açık Noktalar

Bu doküman temel felsefeyi sabitler, ancak aşağıdaki alanlar sonraki dokümanlarda detaylandırılmalıdır:

## 20.1. Hedef ürün sınıfı ağırlığı
Bu boilerplate daha çok:
- workflow ürünleri mi,
- consumer app’ler mi,
- dashboard-heavy ürünler mi,
- data-entry yoğun sistemler mi
için optimize edilecek?

## 20.2. Parity derinliği
Behavior parity her feature için aynı sertlikte mi uygulanacak, yoksa feature sınıfına göre mi değişecek?

## 20.3. Shared UI seviyesi
Primitive, component ve pattern katmanlarında hangi düzeye kadar ortaklaştırma hedeflenecek?

## 20.4. Navigation abstraction seviyesi
Shared flow model ile platform navigation implementasyonu arasındaki bağlantı nasıl kurulacak?

Bu sorular sonraki dokümanlarda kapanmalıdır.

---

# 21. Onay Kriterleri

Bu doküman yeterli kabul edilir eğer:

- cross-platform kavramı shared code seviyesine indirgenmiyorsa,
- parity türleri açıkça ayrılmışsa,
- shared vs platform-specific sınırı mutlak değil ama gerekçeli biçimde tanımlanmışsa,
- platform farklılaşmasının kabul edildiği ve edilmediği alanlar netse,
- sonraki mimari ve UI kararlarına yön verecek kadar açık çerçeve kurulmuşsa.

---

# 22. Kısa Sonuç

Bu dokümanın ana çıktısı şudur:

> Bu boilerplate kapsamında cross-platform yaklaşım, iki platformu zorla aynılaştırmak değil; aynı ürün mantığını, aynı kalite standardını ve aynı tasarım dilini korurken platforma özgü kaliteyi bilinçli biçimde yönetmektir.

Bu nedenle bundan sonraki hiçbir doküman:
- shared code oranını başarı metriği gibi ele alamaz,
- implementation parity’yi behavior parity’nin önüne koyamaz,
- platform farklılığını görmezden gelemez,
- platform farklılığı bahanesiyle kalite standardını düşüremez.
