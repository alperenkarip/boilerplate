# 05-theming-and-visual-language.md

## Doküman Kimliği

- **Doküman adı:** Theming and Visual Language
- **Dosya adı:** `05-theming-and-visual-language.md`
- **Doküman türü:** Standard / visual system / theming foundation document
- **Durum:** Accepted
- **Kapsam:** Bu boilerplate kapsamında theme sistemini, görsel dilin temel kurallarını, color semantics, typography language, spacing dili, border/radius/surface/elevation ilişkisini ve light/dark yapılarını tanımlar.
- **Bağlı olduğu üst dokümanlar:**
  - `00-project-charter.md`
  - `01-working-principles.md`
  - `02-product-platform-philosophy.md`
  - `03-ui-ux-quality-standard.md`
  - `04-design-system-architecture.md`
- **Doğrudan etkileyeceği dokümanlar:**
  - `06-application-architecture.md`
  - `07-module-boundaries-and-code-organization.md`
  - `08-navigation-and-flow-rules.md`
  - `11-forms-inputs-and-validation.md`
  - `12-accessibility-standard.md`
  - `13-performance-standard.md`
  - `15-quality-gates-and-ci-rules.md`
  - `16-tooling-and-governance.md`
  - `22-design-tokens-spec.md`
  - `23-component-governance-rules.md`
  - `24-motion-and-interaction-standard.md`
  - `25-error-empty-loading-states.md`
  - `33-visual-implementation-contract.md`
  - `34-hig-enforcement-strategy.md`

---

# 1. Amaç

Bu dokümanın amacı, boilerplate kapsamında **theme** ve **visual language** kavramlarını soyut estetik tercih olmaktan çıkarıp sistematik, denetlenebilir ve tekrar üretilebilir hale getirmektir.

Bu belge şu sorulara net cevap verir:

1. Theme bu projede ne anlama gelir?
2. Light ve dark yapı nasıl düşünülmelidir?
3. Color semantics nasıl kurulmalıdır?
4. Visual language hangi katmanlardan oluşur?
5. Typography, spacing, border, radius, surface ve elevation dili nasıl yönetilmelidir?
6. Bir bileşenin veya ekranın görsel tonu nasıl kontrol edilir?
7. Görsel dil ile premium hissiyat arasındaki ilişki nedir?
8. Görsel sistem keyfi kararlarla nasıl bozulur?
9. Theme sistemi platform farklarına rağmen nasıl tutarlı kalır?

Bu doküman, tasarım sisteminin görsel kararlar katmanını somutlaştırır.
`04-design-system-architecture.md` sistemin mimarisini kuruyordu; bu belge ise o mimarinin **görsel semantiklerini ve yüzeydeki somut dilini** tanımlar.

---

# 2. Neden Bu Doküman Gerekli

Theme ve görsel dil en sık şu iki hatadan biriyle bozulur:

## 2.1. Theme’i yalnızca dark mode sanmak

Bu durumda sistem şuna indirgenir:
- açık tema renkleri,
- koyu tema renkleri,
- birkaç “background/text” değişimi.

Bu yaklaşım yetersizdir. Çünkü şunları çözmez:
- yüzey derinliği,
- vurgu düzeyi,
- component state görünürlüğü,
- semantic color tutarlılığı,
- border ayrımı,
- typography tonu,
- yoğunluk algısı,
- platformlar arası kalite hissi.

## 2.2. Görsel dili tamamen zevk konusu sanmak

Bu durumda:
- spacing göz kararı verilir,
- renk semantiği oluşmaz,
- her feature kendi tonunu oluşturur,
- typography rolleri bozulur,
- border/radius kullanımı rastgeleleşir,
- premium his dekoratif efekt zannedilir.

Bu yaklaşım da doğrudan kalite kaybı üretir.

## 2.3. Doğru yaklaşım

Bu proje kapsamında doğru yaklaşım şudur:

> Theme, yalnızca renk değiştirme sistemi değil; ürünün ışık, yüzey, kontrast, vurgu, durum, yoğunluk ve görsel ton sistemidir. Visual language ise bu sistemin typography, spacing, color, border, surface, elevation ve motion ile görünür hale gelen ortak dilidir.

---

# 3. Temel Tez

Bu proje kapsamında temel tez şudur:

> Güçlü bir görsel dil, ham görsel zevk kararlarıyla değil; semantic theme sistemi, tutarlı typographic hierarchy, sistematik spacing, kontrollü yüzey ilişkisi, anlamlı border/elevation kullanımı ve platforma saygılı yoğunluk yönetimi ile oluşur.

Bu tez şu sonuçları doğurur:

1. Görsel kalite bireysel stillerle değil, sistem kurallarıyla korunur.
2. Theme yalnızca renk katmanı değildir.
3. Aynı tasarım dili, platforma göre farklı yorumlanabilir ama anlamsal olarak dağılmamalıdır.
4. Dark mode desteği varsa bu sadece invert edilmiş renkler anlamına gelmez.
5. Premium his, görsel efekt sayısıyla değil; denge, semantik ve tutarlılıkla üretilir.

---

# 4. Theme Kavramı

## 4.1. Theme nedir?

Bu proje kapsamında theme, ürünün şu görsel kararlarının ortak sistemidir:

- background mantığı,
- surface katmanları,
- metin kontrastı,
- border görünürlüğü,
- vurgu tonu,
- state renkleri,
- focus görünürlüğü,
- overlay davranışı,
- elevation algısı,
- light/dark yorumları.

## 4.2. Theme ne değildir?

Aşağıdakiler tek başına theme değildir:

- sadece dark mode anahtarı,
- sadece renk paleti,
- sadece `primary / secondary / background` listesi,
- sadece CSS değişken tablosu,
- component bazlı manuel renk değiştirme.

## 4.3. Theme neden merkezi sistemdir?

Çünkü aşağıdaki alanların hepsi theme ile doğrudan ilişkilidir:

- bir ekranın okunabilirliği,
- bir bileşenin güven hissi,
- bilgi hiyerarşisinin görünürlüğü,
- error / success / warning gibi durumların ayırt edilebilirliği,
- görsel gürültü seviyesi,
- premium hissiyat,
- a11y kontrast gereksinimleri.

---

# 5. Visual Language Kavramı

## 5.1. Visual language nedir?

Visual language, theme’in yüzeye yansıyan tüm ortak görsel davranışlarıdır.

Bu şu alanları kapsar:
- typography tonu,
- spacing disiplini,
- yüzey mantığı,
- border ve ayraç dili,
- radius yaklaşımı,
- yoğunluk seviyesi,
- vurgu ve sakin alan dengesi,
- state sunum biçimi,
- bileşenlerin aynı aileye ait görünmesi.

## 5.2. Visual language neden gereklidir?

Visual language olmazsa:
- aynı sistemdeymiş gibi görünmeyen ekranlar oluşur,
- feature’lar farklı ürünlerden alınmış gibi görünür,
- component tutarlılığı bozulur,
- tasarım sistemi pratikte yalnızca teknik paket olarak kalır.

## 5.3. Visual language neyi garanti eder?

- Aynı ürün ailesi hissi
- Tutarlı premium ton
- Tarama ve okuma kolaylığı
- Görsel kararların tekrar üretilebilir olması
- Design-to-code geçişinde daha az yorum farkı

---

# 6. Theme Katmanları

Bu proje kapsamında theme şu katmanlarda ele alınmalıdır:

1. Raw palette
2. Semantic color roles
3. Surface system
4. Content emphasis system
5. State color system
6. Border / divider system
7. Overlay / scrim system
8. Focus / interactive state visibility
9. Light / dark mode mappings

Bu katmanlar birbirine karıştırılmamalıdır.

---

# 7. Raw Palette

## 7.1. Raw palette nedir?

Raw palette, sistemin ham renk skalasıdır.
Bunlar doğrudan ürün anlamı taşımaz.
Örnek:
- neutral 0–1000
- brand tone scale
- success scale
- warning scale
- error scale
- info scale

## 7.2. Raw palette neden gerekir?

Çünkü semantic tokenların arkasında kontrollü bir renk kaynağı olmalıdır.

## 7.3. Raw palette kullanım kuralı

- Raw palette tasarım sistemi içinde tanımlanır.
- Bileşenler ve ekranlar mümkünse raw palette’i doğrudan kullanmaz.
- Kullanım semantic katman üzerinden yapılır.

## 7.4. Zayıf yaklaşım

- `blue500`, `gray900`, `red400` gibi ham renkleri doğrudan ekran içinde kullanmak,
- aynı görsel anlam için farklı palette tonları seçmek,
- feature özelinde palette dışı tekil renk eklemek.

---

# 8. Semantic Color Roles

## 8.1. Neden semantic color?

Çünkü kullanıcı ürün anlamını görür, palette ton numarasını değil.

## 8.2. Zorunlu semantic alanlar

Aşağıdaki semantic roller sistemde tanımlanmalıdır:

### Arka plan ve yüzey
- background-base
- background-subtle
- background-elevated
- surface-default
- surface-muted
- surface-accent
- surface-destructive-soft
- surface-success-soft
- surface-warning-soft

### İçerik
- content-primary
- content-secondary
- content-tertiary
- content-inverse
- content-accent
- content-success
- content-warning
- content-error
- content-disabled

### Sınırlar
- border-subtle
- border-default
- border-strong
- border-accent
- border-error
- border-focus

### Eylem / vurgu
- accent-primary
- accent-primary-hover
- accent-primary-pressed
- accent-secondary
- accent-secondary-hover
- accent-secondary-pressed

### Durum
- success
- warning
- error
- info

### Overlay / system feedback
- overlay-backdrop
- scrim
- toast-success
- toast-warning
- toast-error

## 8.3. Semantic renk kuralları

- Aynı semantic rol farklı ekranlarda keyfi anlam değiştirmemeli.
- Semantic roller component contract’larıyla tutarlı olmalı.
- Theme değişiminde semantic anlam sabit kalmalı.
- Renk tonu değil, renk rolü tüketilmelidir.

## 8.4. Zayıf semantic davranışlar

- `primaryText` ile `textPrimary` gibi gereksiz çoğaltmalar,
- tek ekrana özel semantic renk açmak,
- aynı semantik rolü farklı yoğunlukta rastgele kullanmak,
- durum renklerini dekoratif amaçla kullanmak.

---

# 9. Light / Dark Mode Politikası

## 9.1. Light ve dark iki ayrı ürün görünümü değildir

Aynı ürünün iki farklı ışık yorumudur.
Dolayısıyla:
- semantic roller korunmalı,
- bilgi hiyerarşisi korunmalı,
- yüzey derinliği korunmalı,
- state ayrışması korunmalı,
- kontrast korunmalı.

## 9.2. Dark mode’da yapılan klasik hata

- yalnızca arka planı koyultup text’i açmak,
- border görünürlüğünü ihmal etmek,
- yüzey derinliğini kaybetmek,
- state renklerini fazla neon yapmak,
- premium hissi “simsiyah arka plan + parlayan vurgu” zannetmek.

## 9.3. Light mode’da yapılan klasik hata

- düşük kontrastlı secondary text,
- çok zayıf border,
- yüzey farklarını neredeyse görünmez bırakmak,
- aşırı beyaz alan ve odaksız vurgu kullanımı.

## 9.4. Kural

Light ve dark için ayrı palette olabilir.
Ama semantic rollerin ürün anlamı sabit kalmalıdır.

---

# 10. Surface System

## 10.1. Surface nedir?

Surface, kullanıcıya “bu alan nerede başlıyor, hangi derinlikte duruyor, ne kadar öne çıkıyor?” bilgisini veren görsel katmandır.

## 10.2. Surface neden kritik?

Surface sistemi zayıf olursa:
- ekran düz bir renk yığını gibi görünür,
- card / list / section / modal / form alanları birbirine karışır,
- bilgi mimarisi zayıflar,
- premium his düşer.

## 10.3. Surface katmanları

En az şu mantık düşünülmelidir:
- base background
- grouped background
- default surface
- elevated surface
- interactive surface
- modal/sheet surface
- overlay surface

## 10.4. Surface kuralları

- Her yüzey farkı gerçek ihtiyaçla tanımlanmalı.
- Her şeyi kartlaştırmak zayıf yaklaşımdır.
- Surface farkı gerektiğinde border, contrast, tonal shift veya elevation ile anlatılmalı.
- Surface sistemi theme ile uyumlu olmalı.

## 10.5. Zayıf surface davranışları

- arka plan ve içerik yüzeyinin aynı görünmesi,
- gereksiz her öğeye ayrı kart vermek,
- elevated / modal yüzeyi ile normal surface’i ayırt edememek,
- light ve dark tema arasında surface mantığını bozmak.

---

# 11. Elevation ve Depth Standardı

## 11.1. Elevation ne zaman kullanılmalı?

Elevation, her şeyin üzerine gölge atmak için değil, belirli derinlik ilişkilerini anlatmak için vardır.

## 11.2. Elevation kaynakları

Depth algısı şu araçlarla kurulabilir:
- tonal contrast
- border
- shadow
- blur / backdrop separation
- layering
- z-index davranışı

## 11.3. Kural

Her derinlik farkı shadow ile anlatılmak zorunda değildir.
Özellikle mobilde sade ama net yüzey ayrımı çoğu zaman daha kalitelidir.

## 11.4. Zayıf elevation örnekleri

- her card’a aynı shadow,
- her modal’a ağır gölge,
- dark mode’da anlamsız shadow kullanımı,
- border, surface ve depth ilişkisini düşünmeden efekt eklemek.

---

# 12. Border, Divider ve Stroke Language

## 12.1. Border neden önemlidir?

Border dili, ürünün keskinliği, ayrım mantığı, yoğunluk algısı ve premium tonu üzerinde doğrudan etkilidir.

## 12.2. Kullanım alanları

- field boundary
- list separation
- grouped content
- card outline
- selected state
- focus state
- warning/error emphasis
- structured settings pages
- segmented control gibi kontrollü ayraç sistemleri

## 12.3. Kurallar

- Border anlamsız tekrar olmamalı.
- Border rengi semantic sistemden gelmeli.
- Border’ın görevi net olmalı: ayırma mı, tanımlama mı, vurgu mu?
- Divider ile full border mantığı karıştırılmamalı.
- Border kalınlığı sistematik olmalı.

## 12.4. Zayıf border kullanımı

- yalnızca boş görünmesin diye border eklemek,
- farklı ekranlarda farklı border tonları kullanmak,
- her component’e outline vererek görsel gürültü yaratmak,
- selected state ile normal border’ı ayırt edememek.

---

# 13. Radius Standardı

## 13.1. Radius neden sistem konusu?

Radius, ürünün tonunu ciddi biçimde belirler.
Sert, nötr, dost canlısı, premium, kurumsal gibi algılar burada değişir.

## 13.2. Kural

Radius değerleri sistematik olmalı.
Rastgele `4`, `6`, `10`, `14`, `18`, `22` gibi değerler üretmek zayıf yaklaşımdır.

## 13.3. Radius kararları neyi etkilemeli?

- button ailesi,
- input ailesi,
- cards,
- sheets,
- modals,
- chips,
- list items,
- avatars,
- grouped surfaces.

## 13.4. Zayıf radius davranışları

- her bileşene farklı yuvarlaklık vermek,
- platforma göre tasarım dili kıracak kadar farklı radius kullanmak,
- sert visual language isterken gizlice yüksek radius kaçakları bırakmak,
- aynı component family içinde tutarsız radius.

---

# 14. Typography Language

## 14.1. Typographic language ne demektir?

Typographic language, sadece font-size sistemi değildir.
Şunları içerir:
- role hierarchy,
- weight strategy,
- line-height mantığı,
- tracking yaklaşımı,
- emphasis tonları,
- yardımcı metin ve status tonu,
- ekran başlığı ve section yapısı.

## 14.2. Typography için zorunlu karar alanları

- Kaç ana rol olacak?
- Başlıklar nasıl ayrışacak?
- Body primary / secondary farkı nasıl kurulacak?
- Small text ne kadar küçük olabilir?
- Caption / helper / metadata rolleri nasıl yönetilecek?
- Button ve input içi metin hangi seviyede olacak?

## 14.3. Kural

Typography sayısal değil, rol bazlı ele alınmalıdır.

## 14.4. Zayıf tipografi dili

- her ekranın kendi metin ölçeğini kullanması,
- body text’i aşırı küçültmek,
- yardımcı metni görünmez seviyeye çekmek,
- başlıkları sadece font-size ile ayırmak,
- secondary text’i düşük kontrastla neredeyse silmek.

---

# 15. Spacing Language

## 15.1. Spacing language nedir?

Spacing language, ekrandaki boşlukların yalnızca ölçü değil, anlam taşımasıdır.

Bu şu alanları etkiler:
- içerik yakınlığı,
- bölüm ayrımı,
- yoğunluk seviyesi,
- kart ve section algısı,
- aksiyon gruplama,
- form okunabilirliği.

## 15.2. Spacing rolleri

En az şu düzeyler düşünülmelidir:
- micro gap
- inline gap
- item gap
- cluster gap
- section gap
- screen padding
- modal/sheet padding
- list row spacing
- form field gap
- action group gap

## 15.3. Kural

Aynı işlevsel rol aynı spacing mantığıyla çalışmalıdır.

## 15.4. Zayıf spacing davranışları

- aynı sayfada farklı section’larda farklı mantık,
- liste satırları ile form alanları aynı boşluk sistemini taşımıyormuş gibi davranmak,
- sıkışıklığı “modern” zannetmek,
- aşırı boşluğu “premium” zannetmek.

---

# 16. Density Standardı

## 16.1. Density nedir?

Density, ekranda ne kadar bilgi ve etkileşim öğesinin hangi sıkılıkta gösterildiğini belirler.

## 16.2. Cross-platform önemi

Web ve mobil aynı density’yi taşımak zorunda değildir.
Ama aynı ürünün farklı density yorumları çelişkili olmamalıdır.

## 16.3. Kural

- Mobile daha odaklı ve ergonomik yoğunluk taşıyabilir.
- Web daha yüksek bilgi yoğunluğu taşıyabilir.
- Farklı density, farklı ürün dili anlamına gelmemelidir.

## 16.4. Zayıf density örnekleri

- mobile ekranlara masaüstü kadar yoğun bilgi doldurmak,
- web’de gereksiz büyük kartlar ve boşluklarla bilgi erişimini zorlaştırmak,
- aynı ürünün bir platformda sıkışık diğerinde dağınık görünmesi.

---

# 17. Emphasis System

## 17.1. Emphasis neden gerekir?

Her bilgi aynı öneme sahip değildir.
Emphasis sistemi:
- kullanıcının nereye bakacağını,
- neyin öncelikli olduğunu,
- hangi eylemin ana hedef olduğunu
belirler.

## 17.2. Emphasis araçları

- color emphasis
- weight emphasis
- spacing separation
- surface emphasis
- border emphasis
- size emphasis
- motion emphasis

## 17.3. Kural

Her şeyi vurgulamak hiçbir şeyi vurgulamamaktır.
Primary emphasis sınırlı ve kontrollü kullanılmalıdır.

## 17.4. Zayıf vurgu davranışları

- her başlık bold,
- her buton primary,
- her durum renkli,
- her kart ayrı yüzeyde,
- her satır icon + badge + chevron + border + background ile aşırı yüklenmiş.

---

# 18. State Visibility Standardı

## 18.1. Theme ve visual language state’leri nasıl etkiler?

Aşağıdaki durumların görünürlüğü theme sistemi içinde tanımlanmalıdır:
- hover
- focus
- pressed
- disabled
- active
- selected
- loading
- success
- warning
- error

## 18.2. Kural

State görünürlüğü yalnızca renk farkına bırakılmamalı.
Özellikle erişilebilirlik için gerekirse:
- border,
- icon,
- motion,
- label,
- background change
birlikte kullanılmalıdır.

## 18.3. Zayıf state dili

- disabled ile normal state’in çok benzemesi,
- selected state’in yalnızca çok hafif ton farkıyla verilmesi,
- error state’in ancak dikkatli bakınca anlaşılması,
- focus state’in görünmez olması.

---

# 19. Focus Visibility Standardı

## 19.1. Focus neden görsel dilin parçasıdır?

Özellikle web ve erişilebilirlik açısından focus görünürlüğü yalnızca teknik değil görsel sistem kararıdır.

## 19.2. Kurallar

- Focus state görünür olmalı.
- Theme ile çakışmamalı.
- Border kullanan component’lerde focus daha belirgin olmalı.
- Focus yalnızca tarayıcı default’una bırakılmamalı, ama görünürlüğü de yok edilmemeli.

## 19.3. Zayıf focus yaklaşımı

- outline kaldırıp yerine hiçbir şey koymamak,
- focus ile hover’ın aynı görünmesi,
- dark theme’de focus ring’in görünmemesi,
- component family’leri arasında focus dilinin değişmesi.

---

# 20. Destructive, Warning, Success ve Info Tonları

## 20.1. Bu tonlar neden kontrollü olmalı?

Çünkü bu renkler ürün anlamı taşır.
Gereksiz kullanılırsa:
- alarm yorgunluğu oluşur,
- sistem ciddiyeti düşer,
- kullanıcı yanlış öncelik algılar.

## 20.2. Kural

- Error yalnızca hata olduğunda kullanılmalı.
- Warning gerçekten dikkat gerektiren durumda kullanılmalı.
- Success yalnızca anlamlı sonuçlar için görünür olmalı.
- Info tonu dekoratif değil yardımcı bilgi için kullanılmalı.

## 20.3. Zayıf kullanım örnekleri

- sırf dikkat çekmek için warning tonu,
- kritik olmayan her bilgiye accent rengi,
- success mesajlarını aşırı yeşil vurguya boğmak,
- destructive action’ı yeterince ayırmamak.

---

# 21. Overlay, Modal ve Sheet Visual Rules

## 21.1. Overlay neden tema konusu?

Çünkü modal/sheet/dialog gibi yapılar:
- yüzey ayrımı,
- odak yönlendirme,
- arka plan bastırma,
- geçiş tonu
ile doğrudan theme sistemiyle ilişkilidir.

## 21.2. Kurallar

- Overlay opaklığı kontrollü olmalı.
- Modal/sheet surface, base screen’den net ayrışmalı.
- Arka plan bastırılmalı ama tamamen yok edilmemeli.
- Dark mode’da overlay mantığı ayrı dikkat ister.
- Bottom sheet, dialog, fullscreen modal aynı yüzey mantığını paylaşmak zorunda değildir ama aynı sistem ailesine ait görünmelidir.

## 21.3. Zayıf overlay davranışları

- arka plan ile modal yüzeyinin aynılaşması,
- aşırı koyu overlay,
- her overlay’nin aynı opaklıkla çalışması,
- modal/sheet tonunun theme ile çelişmesi.

---

# 22. Platforma Göre Visual Adaptation

## 22.1. Visual language platforma göre değişebilir mi?

Evet, ama şu sınırlar içinde:

- semantic roller sabit kalmalı,
- ürün tonu bozulmamalı,
- aynı bileşen ailesi hissi korunmalı,
- density ve ergonomi platforma göre uyarlanabilir,
- navigation shell ve presentation farklı olabilir,
- tipografi ve spacing yorumları platform ergonomisine göre hafifçe uyarlanabilir.

## 22.2. Ne kabul edilmez?

- web ve mobile’da tamamen farklı color semantics,
- farklı component family hissi,
- birinde sert/kurumsal diğerinde yumuşak/oyuncak görsel ton,
- platform farkı bahanesiyle ürün kimliğinin dağılması.

---

# 23. Premium Hissiyatın Görsel Bileşenleri

Bu proje kapsamında premium his şu görsel unsurlardan oluşur:

## 23.1. Kontrollü sadelik
Ekran karmaşık değil, bilinçli olmalı.

## 23.2. Net hiyerarşi
Kullanıcı nereye bakacağını sezgisel olarak anlamalı.

## 23.3. İnce ama kararlı yüzey farkları
Her şey aynı düzlemde görünmemeli ama her şey de kartlaştırılmamalı.

## 23.4. Typographic güven
Başlık, body, yardımcı metin ve aksiyon metni doğru ağırlıkta görünmeli.

## 23.5. Temiz spacing
Sıkışık olmayan ama dağınık da olmayan düzen.

## 23.6. Düşük görsel gürültü
Gereksiz çizgi, gereksiz ikon, gereksiz renk, gereksiz gölge olmamalı.

## 23.7. Kararlı state görünürlüğü
Basınca, seçilince, yüklenince, hata verince sistem ne yaptığı belli olmalı.

---

# 24. Görsel Dilde Kaçınılacak Hatalar

Aşağıdaki davranışlar zayıf kabul edilir:

1. Ham palette renkleri doğrudan kullanmak
2. Her ekranda farklı spacing mantığı
3. Typography rollerini ekran bazlı bozmak
4. Surface sistemini tanımlamadan kartlar üretmek
5. Border ve shadow’ı rastgele karıştırmak
6. Dark mode’u salt ters renk olarak düşünmek
7. Durum renklerini aşırı kullanmak
8. Focus ve selected state’i görünmez bırakmak
9. Theme’i component bazlı override’larla delmek
10. Platforma göre aynı ürün tonunu kaybetmek
11. Görsel gürültüyü premium sanmak
12. Minimal görünmek için anlam kaybettirmek
13. Görsel tutarlılığı accessibility pahasına kurmak
14. Accessibility’yi bahane edip tasarım sistemini dağıtmak
15. Design token sistemini inline stillerle bypass etmek

---

# 25. Implementation Kuralları Açısından Sonuçlar

Bu doküman teknik implementasyona şu sonuçları doğurur:

## 25.1. Theme semantic tabanlı olmalı
Component’ler raw palette’e değil semantic theme rollerine bakmalı.

## 25.2. Visual language token tabanlı olmalı
Spacing, typography, border, radius ve motion sistem dışı değerlerle yazılmamalı.

## 25.3. Component’ler tone taşımalı
Her component hangi yüzeyde, hangi emphasis düzeyinde, hangi state’lerde nasıl görüneceğini sistemden almalı.

## 25.4. Theme override’ları sınırlandırılmalı
Her ekranın kendi mini theme’ini yaratmasına izin verilmemeli.

## 25.5. Platform adaptation kural setiyle yapılmalı
Platform-specific yorum gerekiyorsa bile semantic anlam sabit kalmalı.

---

# 26. Sonraki Dokümanlara Etkisi

## 26.1. Application architecture
`06-application-architecture.md`, theming altyapısının uygulama katmanlarında nasıl dağıtılacağını mimari olarak doğru konumlandırmalıdır.

## 26.2. Module boundaries
`07-module-boundaries-and-code-organization.md`, theme, tokens ve UI paket sınırlarını bu belgedeki role göre belirlemelidir.

## 26.3. Forms and validation
`11-forms-inputs-and-validation.md`, field shells, helper/error text ve state visibility’yi burada tanımlanan görsel semantiklerle kurmalıdır.

## 26.4. Accessibility standard
`12-accessibility-standard.md`, contrast, focus visibility ve text scaling alanlarını bu belgeyle uyumlu teknik kurala çevirmelidir.

## 26.5. Quality gates and governance
`15-quality-gates-and-ci-rules.md` ve `16-tooling-and-governance.md`, hardcoded değer ve semantic theme ihlallerini denetlenebilir hale getirmelidir.

## 26.6. Design tokens spec
`22-design-tokens-spec.md`, bu belgenin kavramsal seviyesini gerçek token envanteri ve isimlendirme sistemine dönüştürmelidir.

---

# 27. Onay Kriterleri

Bu doküman yeterli kabul edilir eğer:

1. Theme kavramı yalnızca dark mode seviyesinde bırakılmamışsa,
2. Raw palette ile semantic role ayrımı netse,
3. Surface, border, elevation, typography ve spacing dili ayrı ayrı tanımlanmışsa,
4. Light/dark geçişi anlamsal tutarlılık üzerinden ele alınmışsa,
5. Premium his somut görsel sistem bileşenlerine bağlanmışsa,
6. Platform adaptasyonu ile ürün tonunun korunması birlikte açıklanmışsa,
7. Sonraki teknik ve tasarımsal dokümanlara yön verecek kadar açık ve uygulanabilir çerçeve kurulmuşsa.

---

# 28. Kısa Sonuç

Bu dokümanın ana çıktısı şudur:

> Bu boilerplate kapsamında theme, renk değiştirme mekanizması değil; ürünün ışık, yüzey, kontrast, vurgu, durum ve görsel yoğunluk sistemidir. Visual language ise bu theme sisteminin typography, spacing, border, radius, surface ve emphasis kurallarıyla görünür hale gelmiş ortak dilidir.

Bu nedenle bundan sonraki hiçbir doküman:
- raw color düzeyinde karar veremez,
- spacing ve typography’yi keyfi bırakamaz,
- surface ve state görünürlüğünü rastgele yönetemez,
- premium hissi dekoratif efektlere indirgemez,
- platform farkı bahanesiyle ürünün görsel tonunu parçalayamaz.

---

# 29. Dark Mode ve Sistem Tercihi Senkronizasyonu (2026-04-01 Eki)

## 29.1. Sistem tercihi algılama

### 29.1.1. Web

Web platformunda kullanıcının tema tercihi `prefers-color-scheme` media query ile algılanır. `matchMedia('(prefers-color-scheme: dark)')` listener'ı ile sistem tercihi değişiklikleri anlık olarak dinlenir. Sayfa yüklendiğinde ilk tema belirleme bu sorguya dayanmalıdır.

### 29.1.2. Mobile

React Native'de `Appearance` API ile sistem teması algılanır. `Appearance.getColorScheme()` ile anlık tema sorgulanır, `Appearance.addChangeListener()` ile değişiklikler dinlenir. Expo ortamında bu API doğrudan kullanılabilir.

Expo tabanlı mobile foundation için ayrıca şu bootstrap kuralları geçerlidir:
- `app.json` / app config içinde `userInterfaceStyle: "automatic"` canonical varsayımdır; light-only veya dark-only kararları ayrı exception ister.
- Android development build tarafında tema senkronizasyonunun gerçekten çalışması için `expo-system-ui` kurulu olmalıdır.
- Theme doğrulaması Expo Go üzerinde kanıt sayılmaz; development build üzerinde test edilmelidir.

### 29.1.3. Override sırası

Tema belirlemede override sırası şu şekildedir:

1. **Kullanıcı tercihi** (uygulama içi ayarlardan seçilen tema) — en yüksek öncelik
2. **Sistem tercihi** (OS düzeyinde ayarlanan tema)
3. **Varsayılan tema** (light) — fallback

Kullanıcı uygulamada "her zaman koyu" seçtiyse, sistem tercihi ne olursa olsun koyu tema uygulanır. Kullanıcı "sistemi takip et" seçtiyse sistem tercihi geçerli olur.

## 29.2. Tema geçiş mekanizması

### 29.2.1. Flickering önleme

Tema geçişlerinde flickering (beyaz flaş / siyah flaş) kabul edilemez. Çözüm yaklaşımları:
- CSS custom properties (variables) ile anında geçiş yapılmalı; DOM manipulation minimize edilmelidir.
- İlk yükleme anında tema, tarayıcıya CSS paint'ten önce iletilmelidir (blocking script veya cookie-based tema algılama).
- `requestAnimationFrame` ile geçiş zamanlama senkronize edilmelidir.

### 29.2.2. SSR/hydration mismatch önleme

Eğer SSR kullanılıyorsa, sunucu tarafında tema bilgisi yoksa hydration mismatch oluşur. Bu durumda:
- İlk render'da tema bilgisi cookie veya inline script üzerinden aktarılmalıdır.
- Hydration sırasında tema değişikliği yapılmamalıdır.

### 29.2.3. Transition animasyonu

- Renk ve opacity geçişleri smooth olmalıdır (CSS transition: ~200ms).
- Layout shift kesinlikle yasaktır; tema değişimi yalnızca renk/ton değişimini kapsamalıdır.
- Büyük ekranlarda tüm yüzeylerin aynı anda geçiş yapması tercih edilir (cascading effect istenmeyen bir durumdur).

## 29.3. CSS light-dark() fonksiyonu

### 29.3.1. Token tanımlama

Her design token'da hem light hem dark değeri tanımlanmalıdır. CSS `light-dark()` fonksiyonu ile tek bir token tanımında her iki tema değeri birlikte verilebilir:

```css
--color-surface-default: light-dark(#ffffff, #1c1c1e);
```

Bu yaklaşım token yönetimini sadeleştirir ve tema geçişinin CSS seviyesinde ele alınmasını sağlar.

### 29.3.2. Dynamic token'lar

İleri seviye senaryolarda aşağıdaki dinamik koşullar düşünülebilir:
- **Ambient light:** Ortam ışığına göre kontrast ayarı (opsiyonel, sensör bağımlı)
- **Battery saver:** Düşük pil modunda OLED ekranlarda koyu tema zorunlu kılınabilir (opsiyonel)

Bu dynamic token'lar boilerplate seviyesinde opsiyoneldir; ürün ihtiyacına göre aktive edilir.

## 29.4. Contrast enforcement

### 29.4.1. Normal metin

Normal boyutlu metin (18px altı) için arka plan ile metin arasında minimum **4.5:1** contrast ratio sağlanmalıdır (WCAG 2.1 AA).

### 29.4.2. Büyük metin

Büyük metin (18px ve üstü, veya 14px ve üstü bold) için minimum **3:1** contrast ratio yeterlidir.

### 29.4.3. Non-text UI

İkon, border, form control outline gibi non-text UI elementleri için minimum **3:1** contrast ratio sağlanmalıdır.

### 29.4.4. Dark mode özel dikkat

Dark mode'da sık yapılan hatalar:
- Beyaz metin çok parlak arka plan üzerinde kullanılmamalı (glare etkisi).
- Saf siyah (`#000000`) arka plan üzerinde saf beyaz (`#ffffff`) metin göz yorgunluğuna yol açar; hafif ton farkı tercih edilmelidir.
- Renkli vurgular dark mode'da parlak kalmaya meyillidir; tone-down edilmeleri gerekebilir.
- Contrast ratio'ları her iki temada ayrı ayrı doğrulanmalıdır.

## 29.5. Font smoothing ve platform farkları

### 29.5.1. iOS

iOS'ta `-webkit-font-smoothing: antialiased` tercih edilir. Bu, subpixel antialiasing yerine grayscale antialiasing uygulayarak özellikle ince fontlarda daha temiz render sağlar.

### 29.5.2. Android

Android farklı font rendering engine'i kullanır. Subpixel rendering davranışı cihaza göre değişebilir. Dark mode'da font smoothing farkları daha belirgin hale gelebilir.

### 29.5.3. Web

Web'de subpixel antialiasing (varsayılan) ile grayscale antialiasing arasında bilinçli seçim yapılmalıdır. Dark background üzerinde açık metin kullanıldığında grayscale antialiasing genellikle daha iyi sonuç verir.

## 29.6. Cross-platform tema senkronizasyonu

### 29.6.1. Tema tercihi persist edilmesi

Kullanıcının tema tercihi kalıcı olarak saklanmalıdır:
- **Web:** Cookie veya localStorage üzerinden saklanır. Cookie tercih edilir çünkü SSR sırasında erişilebilir.
- **Mobile:** AsyncStorage veya Expo SecureStore üzerinden saklanır.

### 29.6.2. Cihazlar arası tema sync

Kullanıcı farklı cihazlarda aynı tema tercihini görmek isteyebilir. Bu durumda:
- Backend preference API üzerinden tema tercihi sync edilebilir (opsiyonel).
- Auth flow sırasında kullanıcı profili ile birlikte tema tercihi alınabilir.
- Bu alan boilerplate seviyesinde opsiyoneldir; ürün kararına bağlıdır.

## 29.7. Design token katmanı ile ilişki

### 29.7.1. Semantic token'lar ve tema switching

`22-design-tokens-spec.md`'de tanımlanan semantic token'lar tema switching'in temelini oluşturur. Tema değişimi, semantic token'ların farklı raw palette değerlerine eşlenmesiyle gerçekleşir. Semantic roller (ör. `surface-default`, `content-primary`) tema bağımsızdır; yalnızca arkalarındaki ham renk değerleri temaya göre değişir.

### 29.7.2. Yeni renk ekleme kuralı

Sisteme yeni bir renk eklenirken her iki tema (light ve dark) için değer tanımlanması zorunludur. Tek tema için tanımlanan renk, diğer temada beklenmeyen görsel sonuçlar doğurur. Bu kural CI lint kuralı olarak da enforce edilmelidir.

---

# 30. High Contrast Mode Desteği

Erişilebilirlik için yüksek kontrast tema varyantları sağlanır. Bu bölüm, görme güçlüğü yaşayan kullanıcılar için ek tema katmanını tanımlar.

## 30.1. Ek Tema Varyantları

Standart `light` ve `dark` temalarına ek olarak iki yüksek kontrast tema varyantı tanımlanır:

- `light-high-contrast`: Açık tema üzerine yüksek kontrast override'ları
- `dark-high-contrast`: Koyu tema üzerine yüksek kontrast override'ları

## 30.2. Token Override Kuralları

Yüksek kontrast temalarında aşağıdaki token override'ları uygulanır:

| Alan | Normal Tema | High Contrast Tema |
|------|-----------|-------------------|
| Metin kontrast oranı | Minimum 4.5:1 (WCAG AA) | Minimum 7:1 (WCAG AAA) |
| Border kalınlığı | 1px | 2px, solid, yüksek kontrast renk |
| Focus indicator | 2px outline | 3px outline, yüksek kontrast renk, offset 2px |
| İkon çizgi kalınlığı | Varsayılan stroke-width | Artırılmış stroke-width (+0.5px) |
| Disabled state opacity | 0.38 | 0.5 (daha görünür disabled state) |
| Surface ayrımı | Subtle ton farkı | Belirgin border + ton farkı |

## 30.3. Otomatik Tema Geçişi

OS düzeyindeki erişilebilirlik ayarları algılanarak otomatik high contrast tema geçişi sağlanır:

- **iOS:** `UIAccessibility.isReduceTransparencyEnabled` ve `UIAccessibility.isDarkerSystemColorsEnabled` kontrol edilir. `expo-constants` veya custom native modül ile okunur.
- **Android:** `Settings.Secure.ACCESSIBILITY_HIGH_TEXT_CONTRAST_ENABLED` flag'i kontrol edilir. `AccessibilityInfo` API'si veya custom native modül ile okunur.
- **Web:** `prefers-contrast: more` CSS media query ile algılanır. `window.matchMedia('(prefers-contrast: more)')` ile JavaScript'ten okunur.

## 30.4. Token Seti Yapısı

High contrast token'ları ayrı bir token dosyasında tanımlanır ve tema switching mekanizması ile yüklenir:

```
packages/design-tokens/
├── colors/
│   ├── light.ts              # Standart açık tema
│   ├── dark.ts               # Standart koyu tema
│   ├── light-high-contrast.ts # Yüksek kontrast açık tema
│   └── dark-high-contrast.ts  # Yüksek kontrast koyu tema
```

High contrast token dosyası, standart tema token'larını extend eder ve yalnızca override edilen değerleri içerir. Tüm token'ları yeniden tanımlamak gerekmez.

## 30.5. Test ve Doğrulama

- Tüm high-contrast token'lar Storybook'ta ayrı story olarak görselleştirilir.
- Kontrast oranları axe-core ile otomatik kontrol edilir (CI'da WCAG AAA seviyesinde).
- High contrast temada tüm metin, ikon ve UI bileşenlerinin okunabilirliği manuel test ile doğrulanır.

---

# 31. Branded Theme Türetme Rehberi

Derived project'lerin kendi marka kimliğini token sistemine entegre etme adımları bu bölümde tanımlanır. Boilerplate'in tema sistemi, türetilen projelerin marka renklerini, tipografisini ve görsel dilini sistematik şekilde override etmesine olanak tanır.

## 31.1. Renk Paleti Tanımlama

1. **Marka renkleri belirlenir:** Primary, secondary ve accent renkleri marka kimliğinden alınır.
2. **Shade skalası oluşturulur:** Her marka rengi için 50-900 arasında 10 kademeli shade skalası üretilir.
   - Tint algoritması: Ana renk → beyaza doğru kademeli açılma (50-400)
   - Shade algoritması: Ana renk → siyaha doğru kademeli koyulaşma (600-900)
   - 500 değeri ana marka rengini temsil eder
3. **Semantic mapping yapılır:**
   - `color-primary` → brand primary (500)
   - `color-primary-light` → brand primary (100)
   - `color-primary-dark` → brand primary (700)
   - `color-accent` → brand accent (500)
4. **Dark mode karşılıkları tanımlanır:** Her semantic mapping hem light hem dark tema için ayrı değer alır.

## 31.2. Typography Özelleştirme

1. **Marka fontu yüklenir:**
   - Mobile: `expo-font` ile async font loading
   - Web: `@fontsource` paketi veya Google Fonts CDN
2. **Font family token'ları override edilir:**
   - `font-family-heading`: Marka heading fontu
   - `font-family-body`: Marka body fontu
   - `font-family-mono`: Varsayılan monospace korunabilir
3. **Font weight mapping:** Marka fontunun mevcut weight'leri sisteme eşlenir. Eksik weight varsa en yakın mevcut weight kullanılır.
4. **Fallback font stack:** Marka fontu yüklenemezse system font stack kullanılır (FOUT/FOIT önleme).

## 31.3. Spacing ve Radius Özelleştirme

- Spacing scale genelde boilerplate default'ları korunur; marka dilinde belirgin fark yoksa override önerilmez.
- Marka dili "yumuşak/yuvarlak" ise: `radius-default` ve `radius-large` token'ları artırılır.
- Marka dili "keskin/minimal" ise: Radius değerleri düşürülür veya sıfırlanır.
- Spacing ve radius override'ları `packages/design-tokens/overrides/brand.ts` dosyasında tanımlanır.

## 31.4. Logo ve Asset Değişiklikleri

- Splash screen: `assets/splash.png` ve `app.json` splash konfigürasyonu güncellenir.
- App icon: `assets/icon.png` (1024x1024) ve platform-specific varyantları değiştirilir.
- Tab bar icon'ları: Mevcut icon naming convention korunur, asset dosyaları değiştirilir.
- Adaptive icon (Android): `assets/adaptive-icon.png` foreground ve background ayrı sağlanır.

## 31.5. Doğrulama Adımları

1. Tüm override edilen renk token'ları kontrast checker'dan geçirilir (minimum 4.5:1 metin, 3:1 UI).
2. Dark mode'da branded renklerin okunabilirliği hem açık hem koyu arka planlarda test edilir.
3. High contrast temada branded renklerin WCAG AAA (7:1) uyumluluğu doğrulanır.
4. Typography değişikliklerinin tüm breakpoint'lerde (compact, medium, expanded) layout'u bozmadığı kontrol edilir.
5. Storybook'ta branded tema ile tüm component'ler görselleştirilir ve visual regression testi çalıştırılır.
