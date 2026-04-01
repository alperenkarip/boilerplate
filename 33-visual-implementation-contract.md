# 33-visual-implementation-contract.md

## Doküman Kimliği

- **Doküman adı:** Visual Implementation Contract
- **Dosya adı:** `33-visual-implementation-contract.md`
- **Doküman türü:** Contract / visual fidelity / implementation governance document
- **Durum:** Accepted
- **Kapsam:** Bu boilerplate kapsamında tasarım referansından implementasyona geçerken görsel doğruluk, spacing, typography, hierarchy, state görünürlüğü, screenshot-faithful uygulama disiplini, platforma göre kabul edilebilir fark sınırları ve görsel kanıt standardını tanımlar.
- **Bağlı olduğu üst dokümanlar:**
  - `03-ui-ux-quality-standard.md`
  - `04-design-system-architecture.md`
  - `05-theming-and-visual-language.md`
  - `22-design-tokens-spec.md`
  - `23-component-governance-rules.md`
  - `24-motion-and-interaction-standard.md`
  - `26-platform-adaptation-rules.md`
  - `31-audit-checklist.md`
  - `32-definition-of-done.md`
- **Doğrudan etkileyeceği dokümanlar:**
  - `34-hig-enforcement-strategy.md`
  - `35-document-map.md`

---

# 1. Amaç

Bu dokümanın amacı, tasarımdan implementasyona geçişi “yaklaşık benzettik”, “genel olarak aynı duruyor” veya “component yapısı düzgün, görsel küçük farklar önemli değil” seviyesinden çıkarıp; screenshot-faithful, ölçülebilir, denetlenebilir ve sistem kurallarıyla uyumlu bir uygulama kontratına dönüştürmektir.

Bu belge şu sorulara net cevap verir:

1. Görsel implementasyon doğruluğu bu projede ne demektir?
2. Tasarım referansı varken geliştirici neyi birebir korumak zorundadır?
3. Hangi görsel farklar kabul edilemez, hangileri kontrollü adaptasyon sayılabilir?
4. Spacing, typography, layout hierarchy, density, border, surface ve state görünürlüğü nasıl denetlenmelidir?
5. Screenshot-faithful uygulama ile design system-first yaklaşımı nasıl birlikte korunur?
6. Web ve mobilde tasarım referansı uygulanırken hangi farklar meşru sayılır?
7. Görsel kanıt ve karşılaştırma nasıl sunulmalıdır?
8. Hangi davranışlar doğrudan zayıf kabul edilir?

Bu belge, tasarım kopyalama rehberi değildir.
Bu belge, tasarım referansını kalite standardına uygun biçimde ürüne dönüştürme sözleşmesidir.

---

# 2. Neden Bu Doküman Gerekli

UI implementasyonunda en sık görülen sorun şudur:
Kod tarafı “teknik olarak temiz” olabilir ama ortaya çıkan arayüz tasarım niyetini bozabilir.

Bunun tipik sonuçları şunlardır:

- spacing ritmi bozulur,
- typography rolleri yanlış kullanılır,
- hierarchy zayıflar,
- border/surface ilişkisi dağılır,
- state görünürlüğü eksik kalır,
- ekran yoğunluğu tasarımdan sapar,
- “küçük farklar” zamanla büyük kalite kaybına dönüşür,
- farklı geliştiriciler aynı tasarımı farklı yorumlar,
- screenshot’a bakıp “benziyor” denir ama premium his kaybolur.

Bu proje kapsamında UI implementasyonu, yalnızca işlevsel ekran üretmek değildir.
Tasarım referansı varsa o referans:
- ölçü,
- oran,
- yoğunluk,
- vurgu,
- görsel hiyerarşi,
- etkileşim anlamı
taşır.

Bunlar keyfi yorumlanamaz.

---

# 3. Temel Tez

Bu proje kapsamında temel tez şudur:

> Görsel implementasyon, tasarımın yalnızca renk ve kutu düzenini kopyalama işi değil; spacing, typography, hierarchy, surface ilişkisi, state görünürlüğü ve platform bağlamı dahil olmak üzere tasarım niyetini yüksek doğrulukla ve sistem disiplini içinde uygulama işidir.

Bu tez şu sonuçları doğurur:

1. “Genel olarak benziyor” yeterli değildir.
2. Tasarım referansı varken keyfi estetik karar alınmaz.
3. Screenshot-faithful yaklaşım, hardcoded kaos anlamına gelmez.
4. Design system, tasarım doğruluğunu kolaylaştırmalı; bozma bahanesi olmamalıdır.
5. Görsel kalite audit ve kanıt gerektirir.
6. Platform adaptasyonu, tasarım niyetini bozma izni vermez.

---

# 4. Visual Implementation Contract Nedir?

## 4.1. Tanım

Visual Implementation Contract, tasarım referansından kod üretirken geliştiricinin korumak zorunda olduğu görsel ve etkileşimsel doğruluk alanlarının toplamıdır.

## 4.2. Ne işe yarar?

- tasarım yorum farkını azaltır
- reviewer ve contributor için ortak kalite dili sağlar
- “bu kadar yeter” gevşekliğini engeller
- screenshot karşılaştırmasını sistematik hale getirir
- DS/tokens ile görsel doğruluğu bağlar

## 4.3. Ne değildir?

- piksel takıntısı adına sistemi bozmak
- her şeyi hardcoded yapmak
- platform ergonomisini kör biçimde bastırmak
- yalnızca statik ekranı değerlendirmek

---

# 5. Görsel Doğruluk Alanları

Bu kontrat kapsamında görsel doğruluk en az şu alanları kapsar:

1. Layout structure
2. Spacing rhythm
3. Typography hierarchy
4. Surface and border language
5. Color semantics
6. Density and content grouping
7. Visual emphasis and CTA hierarchy
8. State appearance
9. Iconography alignment
10. Empty/loading/error visual treatment
11. Motion/interaction görünümü
12. Platform-specific presentation differences

Her biri ayrı ayrı değerlendirilmelidir.

---

# 6. Layout Structure Contract

## 6.1. Nedir?

Tasarım referansındaki alan dağılımı, blok ilişkisi, içerik grupları ve temel yerleşim düzeninin korunmasıdır.

## 6.2. Denetlenecek şeyler

- ana sütun/alan yapısı
- blokların sıralaması
- primary vs secondary içerik dağılımı
- header/content/footer ilişkisi
- panel ve section hiyerarşisi
- alignment yönü
- scroll konteyner mantığı

## 6.3. Kural

Kod tarafında layout kolaylığı için tasarımın blok ilişkisi bozulamaz.

## 6.4. Zayıf davranışlar

- tasarımda ayrı section olan alanları tek kutuya toplamak
- primary action’ı daha kolay kodlanıyor diye farklı yere taşımak
- layout gruplarını geliştirici rahatlığına göre sadeleştirip hiyerarşiyi bozmak

---

# 7. Spacing Rhythm Contract

## 7.1. Neden kritiktir?

Premium his büyük ölçüde spacing ritminden gelir.
Küçük sapmalar bile kaliteyi düşürür.

## 7.2. Denetlenecek şeyler

- outer padding
- section aralıkları
- title-subtitle-body ilişkisi
- card iç spacing
- list row spacing
- inline element gap’leri
- action group spacing
- modal/sheet internal spacing

## 7.3. Kural

Spacing kararları token ritmiyle ve tasarım referansıyla birlikte korunmalıdır.
“Yakın görünüyor” yeterli değildir.

## 7.4. Zayıf davranışlar

- tasarımda 24 ritmi varken 16/20/28 karışımı kullanmak
- component iç spacing’i geliştirici kararıyla değiştirmek
- listeler ve section’larda düzensiz aralıklar üretmek

---

# 8. Typography Hierarchy Contract

## 8.1. Nedir?

Başlık, alt başlık, body, meta, helper, action label gibi rollerin tasarım hiyerarşisine uygun uygulanmasıdır.

## 8.2. Denetlenecek şeyler

- font size
- weight
- line height
- letter spacing (gerektiğinde)
- text contrast
- role consistency
- truncation ve wrapping davranışı

## 8.3. Kural

Text stilini “yaklaşık benzeyen” sayı ile değil, doğru semantic rol ile çözmek gerekir.

## 8.4. Zayıf davranışlar

- ekranda iki farklı body rolüne aynı stil vermek
- başlıkları sırf sığsın diye küçültmek
- button/input label hiyerarşisini karıştırmak
- meta bilgi ile ana içeriği aynı tipografik önemde sunmak

---

# 9. Surface and Border Language Contract

## 9.1. Nedir?

Yüzeyler, kartlar, bölümler, overlay’ler ve ayrıştırıcıların tasarım dilindeki katman ilişkisini doğru taşımaktır.

## 9.2. Denetlenecek şeyler

- surface tonları
- border kullanımı
- divider yoğunluğu
- elevation/shadow mantığı
- container ayrışması
- sharp vs soft dil tutarlılığı
- selected/active yüzey işaretleri

## 9.3. Kural

Surface ve border dili keyfi değiştirilemez.
Bu alan görsel karakterin ana taşıyıcısıdır.

## 9.4. Zayıf davranışlar

- tasarımda border ağırlıklı dil varken border kaldırmak
- tam tersi, gereksiz kutulaştırma
- surface seviyelerini karıştırmak
- aynı kart ailesinde farklı border mantıkları

---

# 10. Color Semantics Contract

## 10.1. Nedir?

Renklerin yalnızca ton olarak değil, semantic rol olarak doğru kullanılmasıdır.

## 10.2. Denetlenecek şeyler

- content-primary / secondary ayrımı
- accent kullanım yoğunluğu
- error/success/warning state renkleri
- disabled görünüm
- selected/active vurgular
- background/surface ayrımı

## 10.3. Kural

Renk tüketimi raw palette üzerinden değil, semantic sistem üzerinden olmalıdır.

## 10.4. Zayıf davranışlar

- görsel benzesin diye raw ton seçmek
- state renklerini tasarım dışı yorumlamak
- accent rengini gereksiz alanlara yaymak
- contrast ve hierarchy’yi zayıflatmak

---

# 11. Density and Grouping Contract

## 11.1. Neden önemli?

Tasarım referansının hissi çoğu zaman yoğunluk ve grup ilişkilerinden gelir.

## 11.2. Denetlenecek şeyler

- bilgi kümelerinin yakınlık ilişkisi
- gereksiz boşluk veya sıkışıklık
- data-dense alanlarda okunabilirlik
- card/list/section bilgi yoğunluğu
- progressive disclosure dengesi

## 11.3. Kural

“Daha ferah” veya “daha kompakt” keyfi yorumlarla yoğunluk değiştirilemez.
Bu ancak gerekçeli platform adaptasyonuysa kabul edilebilir.

## 11.4. Zayıf davranışlar

- mobilde gereksiz sıkıştırma
- web’de ekranı boş bırakacak kadar seyrekleştirme
- bilgi gruplarını yanlış ritimle dağıtma

---

# 12. CTA Hierarchy Contract

## 12.1. Nedir?

Birincil ve ikincil aksiyonların görsel öncelik sırasını tasarıma uygun taşımaktır.

## 12.2. Denetlenecek şeyler

- primary action vurgusu
- secondary action sakinliği
- destructive action ayrışması
- tertiary/ghost action görünürlüğü
- button group order

## 12.3. Kural

CTA görsel önceliği, product intent’in parçasıdır.
Kod rahatlığı için değiştirilemez.

## 12.4. Zayıf davranışlar

- primary action’ı secondary gibi göstermek
- destructive action’ı gereğinden zayıf veya fazla baskın yapmak
- aynı yüzde iki primary ağırlık yaratmak

---

# 13. State Appearance Contract

## 13.1. Hangi state’ler?

- hover
- focus
- pressed
- selected
- disabled
- loading
- invalid
- success
- empty
- error

## 13.2. Kural

State görünümü tasarımın “çalışan hali”nin parçasıdır.
Yalnızca idle ekran implementasyonu done değildir.

## 13.3. Denetlenecek şeyler

- her state’in görünürlüğü
- state’lerin birbirinden ayrışması
- semantic tutarlılık
- a11y dostu görünüm
- motion ile uyum

## 13.4. Zayıf davranışlar

- idle görünüm doğru ama focused/disabled yanlış
- selected state’in çok zayıf kalması
- error state’i sadece kırmızı border ile geçmek
- loading state’in tamamen başka bir dil konuşması

---

# 14. Iconography Contract

## 14.1. Denetlenecek şeyler

- ikon boyutu
- stroke/weight uyumu
- text ile hizalama
- ikon-only action görünürlüğü
- semantic anlam
- padding/hit area

## 14.2. Kural

İkonlar yalnızca dekoratif ek değildir.
Özellikle navigasyon, affordance ve action clarity açısından önemlidir.

## 14.3. Zayıf davranışlar

- farklı ailelerden karışık ikon kullanımı
- metinle yanlış hizalanma
- küçük ama tıklanması zor icon action’lar
- yalnızca ikon ile açıklanamayan kritik aksiyonlar

---

# 15. Feedback Surface Contract

## 15.1. Kapsam

- loading placeholders
- empty states
- error panels
- retry blocks
- success notices
- inline warnings

## 15.2. Kural

Bu yüzeyler ekranın geri kalanından kopuk mini adacıklar gibi görünmemelidir.
Aynı görsel dilin parçası olmalıdır.

## 15.3. Denetlenecek şeyler

- state hiyerarşisi
- copy + icon + action ilişkisi
- spacing ve surface dili
- bağlamla uyum
- görsel şiddet seviyesi

## 15.4. Zayıf davranışlar

- error yüzeyinin tüm sistemden farklı görünmesi
- loading ve empty state’lerin görsel kalite taşımaması
- retry UI’ının rastgele buton/metin kombinasyonu olması

---

# 16. Motion Visibility Contract

## 16.1. Nedir?

Tasarım referansında veya sistem standardında beklenen hareket ve interaction görünürlüğünün doğru uygulanmasıdır.

## 16.2. Denetlenecek şeyler

- press feedback
- hover transition
- focus appearance
- modal/sheet/screen transition hissi
- loading/skeleton hareket yoğunluğu
- reduced motion karşılığı

## 16.3. Kural

Görsel implementasyon kontratı statik ekranla sınırlı değildir.
State transition’lar da tasarım niyetinin parçasıdır.

Motion ve interaction standardının detayları `24-motion-and-interaction-standard.md` belgesinde tanımlanmıştır. Bu kontrat kapsamında motion görünürlüğü değerlendirilirken ilgili belgedeki token, reduced-motion ve interaction feedback kuralları referans alınmalıdır.

## 16.4. Zayıf davranışlar

- hareket hiç yokken tasarım “tamam” sanmak
- motion standardına aykırı keyfi geçişler
- reduced motion’da state görünürlüğünü kaybetmek

---

# 17. Screenshot-Faithful İlkesinin Anlamı

## 17.1. Screenshot-faithful ne demektir?

Tasarım referansının ekran görüntüsünü “yaklaşık benzetmek” değil; görünür yapısal ve hiyerarşik kararlarını yüksek doğrulukla uygulamaktır.

## 17.2. Ne içerir?

- oran
- boşluk
- vurgu
- görsel ağırlık
- grup yapısı
- state dili
- içerik yoğunluğu

## 17.3. Ne içermez?

- tasarım referansını token sistemini delerek kopyalamak
- her pikseli hardcoded hale getirmek
- platform bağlamını tamamen yok saymak

## 17.4. Kural

Önce sistemle doğru çöz.
Sistem çözmüyorsa eksik olan sistemi geliştir veya kontrollü istisna üret.
Doğrudan doğaçlama stil en son çaredir.

---

# 18. Design System-First ile Screenshot-Faithful Arasındaki İlişki

## 18.1. Doğru ilişki

Tasarım referansı, design system’i baypas etme bahanesi değildir.
Tersine, design system’in yeterli olup olmadığını test eden güçlü aynadır.

## 18.2. Uygulama ilkesi

Sıra şu olmalıdır:
1. mevcut token/primitive/component ile çöz
2. yetmiyorsa sistem boşluğunu teşhis et
3. gerekiyorsa token/component/pattern geliştir
4. hâlâ istisna gerekiyorsa istisna olarak işaretle

## 18.3. Zayıf davranışlar

- “tasarım böyle” diyerek hardcoded stil yığmak
- mevcut DS eksik diye paralel DS kurmak
- screenshot-faithful bahanesiyle primitive/component kurallarını delmek

---

# 19. Platformlar Arası Görsel Adaptasyon Sınırı

## 19.1. Temel ilke

Web ve mobil arasında screenshot-faithful uygulama, birebir aynı yerleşim zorunluluğu değildir.
Ama tasarım niyeti korunmalıdır.

## 19.2. Kabul edilebilir farklar

- aynı hierarchy’nin farklı layout paketlenmesi
- mobilde daha dikey akış
- web’de daha yoğun panel düzeni
- pointer/touch kaynaklı state görünüm farkları

## 19.3. Kabul edilemez farklar

- primary/secondary hierarchy değişmesi
- spacing ritminin bozulması
- component ailesinin farklı görsel dil konuşması
- önemli state görünümünün kaybolması
- platform bahanesiyle kalite düşmesi

---

# 20. Visual Evidence Standardı

## 20.1. Neden zorunlu?

Görsel doğruluk yalnızca kod diff’inden doğrulanamaz.

## 20.2. Beklenen kanıt türleri

- tasarım referansı screenshot’ı
- implementasyon screenshot’ı
- gerekiyorsa before/after
- state varyantları
- web/mobile karşılaştırması
- light/dark karşılaştırması (etkiliyorsa)

## 20.3. Kural

UI değişikliği kanıtsız onay beklememelidir.
Özellikle spacing, hierarchy, state ve parity etkisi varsa.

## 20.4. Zayıf davranışlar

- tek mutlu path screenshot
- önemli state’leri saklamak
- sadece component idle hali göstermek
- parity etkisi olan işte tek platform ekranı koymak

---

# 21. Visual Review için Kontrol Alanları

Bir görsel implementasyon review’unda en az şu alanlar kontrol edilmelidir:

1. spacing
2. typography
3. alignment
4. hierarchy
5. surface/border dili
6. CTA önceliği
7. state görünürlüğü
8. feedback states
9. motion hissi
10. platform uyarlaması
11. a11y görünürlüğü (focus/contrast/state)
12. design system uyumu

---

# 22. Tolerans Alanı Nedir, Nedir Değildir?

## 22.1. Tolerans alanı ne olabilir?

Bazı küçük farklılıklar aşağıdaki şartlarla tolere edilebilir:
- semantic aynıysa
- hierarchy korunuyorsa
- platform ergonomisi gerektiriyorsa
- DS sınırları nedeniyle farklı ama eşdeğer çözümse
- kullanıcı etkisi taşımıyorsa

## 22.2. Tolerans alanı ne değildir?

- spacing ritmini bozmak
- yanlış typography rolü kullanmak
- primary action’ı kaydırmak
- feedback state’i yok etmek
- border/surface dilini keyfi değiştirmek
- “çok benziyor zaten” mantığı

---

# 23. Kritik Görsel Risk Alanları

Aşağıdaki alanlar küçük sapmaların büyük kalite kaybı ürettiği bölgelerdir:

1. form screens
2. onboarding
3. empty/loading/error states
4. dashboard / dense info surfaces
5. primary CTA screens
6. modal / sheet / dialog surfaces
7. list item families
8. reusable component states
9. navigation bars / top bars / tab bars
10. settings-like structured screens

Bu alanlarda “yaklaşık doğruluk” yeterli değildir.

---

# 24. Görsel Sapma Türleri

Audit ve review sırasında sapmalar şu türlerde sınıflandırılmalıdır:

## 24.1. Structural deviation
Layout grupları ve bölüm ilişkisi bozulmuş.

## 24.2. Spacing deviation
Ritim ve boşluk kararları sapmış.

## 24.3. Typography deviation
Yanlış rol, boyut, ağırlık veya satır ritmi.

## 24.4. Hierarchy deviation
Vurgu sırası yanlış.

## 24.5. Surface deviation
Border/surface/elevation dili sapmış.

## 24.6. State deviation
Focused, selected, disabled, loading, error gibi durumlar eksik ya da yanlış.

## 24.7. Platform adaptation deviation
Meşru adaptasyon sınırı aşılmış.

Bu sınıflandırma kanıt ve aksiyon üretmeyi kolaylaştırır.

---

# 25. Visual Implementation Sürecinde Doğru Çalışma Sırası

Bir tasarım referansını uygularlarken doğru sıra şudur:

1. ekran/pattern yapısını çözümle
2. mevcut DS öğeleriyle eşleştir
3. eksik token/component/pattern varsa tespit et
4. layout ve hierarchy’yi kur
5. spacing ve typography’yi doğrula
6. state’leri uygula
7. feedback ve motion yüzeylerini ekle
8. platform uyarlamasını kontrollü yap
9. screenshot karşılaştırmasını yap
10. sapmaları düzelt
11. kanıtı sun

Bu sıra bozulursa kalite düşer.

---

# 26. Visual Implementation Anti-Pattern Listesi

Aşağıdaki davranışlar bu proje kapsamında zayıf kabul edilir:

1. “Genel olarak benziyor” ile yetinmek
2. Screenshot-faithful bahanesiyle hardcoded stil çöplüğü üretmek
3. Design system’i baypas ederek hızlı benzetme yapmak
4. Spacing ve typography’yi yaklaşık yorumlamak
5. Idle ekranı doğru yapıp state’leri unutmak
6. Görsel kanıt sunmamak
7. Platform bahanesiyle hierarchy’yi bozmak
8. Tolerans alanını keyfi genişletmek
9. Primary/secondary CTA dengesini değiştirmek
10. Error/loading/empty yüzeylerini görsel kalite dışında tutmak
11. Border/surface dilini rahatına göre sadeleştirmek
12. Focus/selected/disabled görünümünü zayıflatmak
13. Web/mobile parity etkisini incelememek
14. Screenshot karşılaştırmasını yalnızca mutlu yol ekranına indirmek
15. Tasarım niyetini anlamadan sadece kaba şekli kopyalamak

---

# 27. Visual Kararı Verirken Sorulacak Sorular

Bir görsel implementasyonu değerlendirirken şu sorular sorulmalıdır:

1. Tasarım niyeti gerçekten korunmuş mu?
2. Hangi spacing kararları kritik ve doğru mu?
3. Typography rolleri tasarımdaki hiyerarşiyi taşıyor mu?
4. Border/surface/emphasis dili aynı aileyi konuşuyor mu?
5. Primary action ve destekleyici öğeler doğru öncelikte mi?
6. State’ler gerçekten görünür ve tasarımla uyumlu mu?
7. Bu sapma meşru platform adaptasyonu mu, yoksa keyfi sapma mı?
8. Design system ile çözüm doğru kurulmuş mu?
9. Kullanıcı bunu aynı kalite seviyesinde hisseder mi?
10. Görsel kanıt bunu gerçekten ispatlıyor mu?

---

# 28. Sonraki Dokümanlara Etkisi

## 28.1. HIG enforcement strategy
`34-hig-enforcement-strategy.md`, otomatik kural ve runtime denetimlerle yakalanamayan görsel/interaction kalite alanlarını bu kontrat ve audit mantığı ile birlikte ele almalıdır.

## 28.2. Document map
`35-document-map.md`, bu kontratın hangi belgelerle birlikte okunması gerektiğini ve özellikle UI/DS/a11y/motion audit zincirindeki yerini görünür kılmalıdır.

---

# 29. Onay Kriterleri

Bu doküman yeterli kabul edilir eğer:

1. Görsel doğruluk alanları açıkça sınıflandırılmışsa,
2. Layout, spacing, typography, hierarchy, surface, state, feedback ve motion alanları ayrı ayrı tanımlanmışsa,
3. Screenshot-faithful yaklaşım ile design system-first yaklaşımın ilişkisi net kurulmuşsa,
4. Platformlar arası kabul edilebilir görsel fark sınırı tanımlanmışsa,
5. Visual evidence standardı görünür kılınmışsa,
6. Sapma türleri ve anti-pattern’ler açıkça yazılmışsa,
7. Sonraki HIG enforcement ve document map dokümanlarına uygulanabilir temel sağlanmışsa.

---

# 30. Kısa Sonuç

Bu dokümanın ana çıktısı şudur:

> Bu boilerplate kapsamında görsel implementasyon, tasarıma kabaca benzeyen ekran üretmek değil; spacing, typography, hierarchy, surface dili, state görünürlüğü ve platform uyarlaması dahil tasarım niyetini yüksek doğrulukla ve design system disiplini içinde ürüne taşımaktır.

Bu nedenle bundan sonraki hiçbir UI implementasyonu:
- yaklaşık benzerlik ile tamamlandı sayılamaz,
- state ve hierarchy doğruluğunu ikincil göremez,
- design system’i delerek hızlı benzetme yapamaz,
- görsel kanıt olmadan screenshot-faithful kalite iddiasında bulunamaz.
