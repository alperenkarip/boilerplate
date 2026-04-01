# 04-design-system-architecture.md

## Doküman Kimliği

- **Doküman adı:** Design System Architecture
- **Dosya adı:** `04-design-system-architecture.md`
- **Doküman türü:** Architecture / governance / implementation foundation document
- **Durum:** Accepted
- **Kapsam:** Bu boilerplate kapsamında design system’in ne olduğunu, hangi katmanlardan oluştuğunu, hangi kararları yönettiğini, hangi sınırları koyduğunu, nasıl genişletileceğini ve nasıl denetleneceğini tanımlar.
- **Bağlı olduğu üst dokümanlar:**
  - `00-project-charter.md`
  - `01-working-principles.md`
  - `02-product-platform-philosophy.md`
  - `03-ui-ux-quality-standard.md`
- **Doğrudan etkileyeceği dokümanlar:**
  - `05-theming-and-visual-language.md`
  - `06-application-architecture.md`
  - `07-module-boundaries-and-code-organization.md`
  - `08-navigation-and-flow-rules.md`
  - `11-forms-inputs-and-validation.md`
  - `12-accessibility-standard.md`
  - `13-performance-standard.md`
  - `15-quality-gates-and-ci-rules.md`
  - `16-tooling-and-governance.md`
  - `21-repo-structure-spec.md`
  - `22-design-tokens-spec.md`
  - `23-component-governance-rules.md`
  - `24-motion-and-interaction-standard.md`
  - `33-visual-implementation-contract.md`
  - `34-hig-enforcement-strategy.md`

---

# 1. Amaç

Bu dokümanın amacı, boilerplate kapsamında **design system** kavramını dekoratif bir UI kütüphanesi olmaktan çıkarıp ürünün görsel, davranışsal ve uygulama disiplininin merkezi otoritesi haline getirmektir.

Bu belge şu sorulara net cevap verir:

1. Design system bu projede tam olarak nedir?
2. Hangi katmanlardan oluşur?
3. Token, semantic token, primitive, component, pattern ve screen/flow düzeyleri nasıl ayrılır?
4. Hangi kararlar design system seviyesinde alınır, hangileri alınmaz?
5. Yeni bileşen ne zaman açılır?
6. Hardcoded tasarım kararları neden zayıftır?
7. Platformlar arası ortaklık ve ayrım nasıl yönetilir?
8. Design system yalnızca yazılı kural olarak mı kalır, yoksa enforce edilebilir mi?
9. Tasarım sistemi ile repo mimarisi, kalite kapıları ve geliştirme disiplini nasıl bağlanır?

Bu doküman olmadan aşağıdaki sorunlar neredeyse kaçınılmazdır:

- aynı probleme farklı component aileleriyle çözüm üretilmesi,
- görsel dilin zamanla bozulması,
- token kullanımının keyfileşmesi,
- primitive ile gerçek component’in karıştırılması,
- “bir tane de burada özel buton açalım” mantığının yayılması,
- shared UI kavramının gereksiz şekilde şişmesi,
- platform farklılığının sistem dışı yamalarla çözülmesi,
- ekip büyüdükçe ürün yüzeyinin parçalanması.

---

# 2. Neden Bu Doküman Gerekli

Design system konusu çoğu projede yanlış anlaşılır.

Genelde şu iki hatadan biri yapılır:

## 2.1. Design system’i fazla küçümsemek
Bu durumda sistem şuna indirgenir:
- birkaç renk,
- birkaç button,
- birkaç input,
- ufak bir component galerisi.

Bu yaklaşım yetersizdir. Çünkü şu alanları yönetmez:
- semantik anlam,
- görsel hiyerarşi,
- component contract,
- interaction standardı,
- varyant yönetimi,
- erişilebilirlik zorunlulukları,
- platform farklılaşma kuralları,
- design-to-code disiplinini.

## 2.2. Design system’i fazla romantize etmek
Bu durumda system çok teorik hale gelir:
- uygulamaya bağlanmayan token listeleri,
- pratikte kullanılmayan soyut component sınıfları,
- herkesin farklı yorumlayabildiği guideline metinleri,
- enforce edilmeyen ama yazılı duran kurallar.

Bu yaklaşım da zayıftır. Çünkü kağıt üzerinde sistem vardır ama ürün yüzeyine hükmetmez.

## 2.3. Doğru yaklaşım
Bu proje kapsamında design system şu olmak zorundadır:

> Ürünün görsel, davranışsal ve bileşen seviyesindeki ortak standardını tanımlayan; token, semantic token, primitive, component, pattern ve governance katmanlarıyla çalışan; implementasyonu yönlendiren ve mümkün olduğunca enforce edilebilen merkezi sistem.

---

# 3. Temel Tez

Bu proje kapsamında temel tez şudur:

> Design system, component koleksiyonu değil; ürünün görsel ve davranışsal standardını karar, kural, yapı, sözlük, bileşen ailesi ve enforce mekanizmalarıyla yöneten merkezi sistemdir.

Bu tez şu sonuçları doğurur:

1. Design system yalnızca UI library değildir.
2. Design system yalnızca tasarımcıların alanı değildir.
3. Design system yalnızca geliştiricilerin utility sınıf seti de değildir.
4. Design system, ürün kalitesinin ve tutarlılığının ana taşıyıcısıdır.
5. Design system dışına çıkış mümkündür ama istisna mekanizmasıyla yönetilmelidir.
6. Sistem düzeyi kararları component bazlı keyfi değiştirilemez.

---

# 4. Design System’in Rolü

## 4.1. Hangi problemi çözer?

Design system aşağıdaki problemleri çözmek için vardır:

- görsel dağınıklığı engellemek,
- bileşenlerin aynı aileye ait gibi davranmasını sağlamak,
- spacing / typography / color kullanımını sistematik hale getirmek,
- tekrar eden UI kararlarını bireysel tercihten kurtarmak,
- hızlı ama kontrollü üretim zemini sağlamak,
- cross-platform tasarım dilini korumak,
- accessibility ve HIG duyarlılığını yüzeye yansıtmak,
- implementasyon ile tasarım arasında ortak dil oluşturmak.

## 4.2. Hangi problemi çözmez?

Design system şu işleri tek başına çözmez:
- ürün stratejisi,
- feature önceliklendirme,
- bilgi mimarisinin tamamı,
- iş kurallarının tamamı,
- tüm UX akışlarını otomatik olarak doğru hale getirme.

Yani design system güçlü bir sistemdir ama her şeyi çözen soyut üst katman değildir.

---

# 5. Kapsam

## 5.1. Design system’in yönettiği alanlar

Bu boilerplate kapsamında design system şu alanları yönetir:

### A. Görsel temel kurallar
- color semantics,
- typography roles,
- spacing scale,
- radius / border / stroke dili,
- surface mantığı,
- elevation / depth yaklaşımı,
- motion tokens ve motion davranış dilinin temeli.

### B. Bileşen kuralları
- primitive tanımları,
- component aileleri,
- varyant mantığı,
- durumlar,
- interaction contract’ları,
- a11y minimumları,
- platform varyant kuralları.

### C. Pattern düzeyi kararlar
- form satırı düzenleri,
- list item aileleri,
- card / section / settings block gibi tekrar eden ürün kalıpları,
- feedback state sunumları,
- standardize ekran parçaları.

### D. Governance
- ne zaman yeni bileşen açılır,
- ne zaman mevcut bileşen genişletilir,
- ne zaman istisna verilir,
- hardcoded kararlar nasıl reddedilir,
- tasarım sistemi uyumu nasıl denetlenir.

## 5.2. Design system’in yönetmediği alanlar

Şunlar design system’in tek başına yönettiği alanlar değildir:
- domain business logic,
- data fetching stratejisi,
- API sözleşmeleri,
- feature permission modelleri,
- backend kaynaklı iş akışları.

---

# 6. Tasarım Sistemi Hiyerarşisi

Bu proje kapsamında design system hiyerarşisi şu sırayla ele alınmalıdır:

1. Tokens
2. Semantic tokens
3. Primitives
4. Components
5. Patterns
6. Screens / flows

Bu sıra bozulmamalıdır.
Çünkü her katman bir alttakine dayanır ve bir üstteki için sınır koyar.

---

# 7. Tokens Katmanı

## 7.1. Token nedir?

Token, sistemin en alt seviyedeki tasarım değişkenidir.
Ham ve tekrar kullanılabilir bir değer tanımlar.

Örnek alanlar:
- spacing scale,
- typography scale,
- font weight,
- line height,
- motion duration,
- motion easing,
- radius scale,
- border width,
- opacity level,
- z-index / layering değeri,
- raw color palette.

## 7.2. Token neden gereklidir?

Token olmazsa şu sorunlar çıkar:
- her ekranda farklı boşluk,
- aynı text rolüne farklı boyut,
- keyfi renk kullanımı,
- animasyonların tutarsız sürelere sahip olması,
- border / radius / density dilinin dağılması.

## 7.3. Token neyi temsil etmez?

Token tek başına ürün anlamı taşımaz.
Örneğin:
- `8px` bir token olabilir,
- ama bu “secondary content gap” anlamına gelmez.

Bu ayrım önemlidir. Çünkü ham değer ile semantik anlam karıştırılırsa sistem hızla bozulur.

## 7.4. Token kuralları

- Token isimlendirmesi sistematik olmalı.
- Aynı değer farklı yerlerde farklı isimlerle üretilmemeli.
- Token katmanı ürün bağlamından mümkün olduğunca bağımsız olmalı.
- Raw token doğrudan kullanım minimumda tutulmalı.
- Token seti keyfi büyütülmemeli.

## 7.5. Zayıf token davranışları

- aynı boşluk için çok sayıda farklı token açmak,
- bir feature ihtiyacı çıktı diye yeni ölçü uydurmak,
- raw color’ı doğrudan bileşende kullanmak,
- sistem dışı inline değerler eklemek.

---

# 8. Semantic Tokens Katmanı

## 8.1. Semantic token nedir?

Semantic token, ham tasarım değerini ürün anlamına bağlayan katmandır.

Örnek:
- `color-gray-900` raw token olabilir.
- `content-primary` semantic token’dır.

## 8.2. Semantic token neden kritik?

Çünkü ürün yüzeyi ham değerlerle yönetilirse şu sorunlar çıkar:
- anlam kaybolur,
- light/dark geçiş zorlaşır,
- durum renkleri rastgeleleşir,
- component mantığı bozulur,
- design language korunamaz.

Semantic token şu soruyu yanıtlar:
> Bu değer ne için kullanılıyor?

## 8.3. Semantic token örnek alanları

### Renk
- background-base
- background-elevated
- surface-subtle
- surface-strong
- content-primary
- content-secondary
- content-tertiary
- border-subtle
- border-strong
- accent-primary
- accent-secondary
- success
- warning
- error
- focus-ring
- overlay

### Spacing semantiği
Her spacing token’ı semantik olmak zorunda değildir; ancak tekrar eden pattern’lerde semantik spacing rolleri tanımlanabilir:
- screen-padding-horizontal
- section-gap
- card-padding
- field-gap
- action-group-gap

### Typography semantiği
- screen-title
- section-title
- body-primary
- body-secondary
- helper-text
- status-text
- button-label

### Motion semantiği
- feedback-fast
- transition-standard
- modal-enter
- screen-transition
- destructive-confirm-emphasis

## 8.4. Semantic token kuralları

- Semantic token ürün anlamına bağlanmalı.
- Aynı anlam için farklı semantic isimler açılmamalı.
- Raw token yerine semantic token tercih edilmeli.
- Theme değişimi semantic katman üzerinden yönetilmeli.
- Semantic token sayısı kontrolsüz büyütülmemeli.

## 8.5. Zayıf semantic token örnekleri

- ismi anlam taşımayan tokenlar,
- çok bağlama özel token isimleri,
- tek ekrana özel semantic token uydurma,
- aynı semantik role iki farklı renk atama,
- “bu ekranda biraz daha açık olsun” yaklaşımı.

---

# 9. Primitives Katmanı

## 9.1. Primitive nedir?

Primitive, tasarım sisteminin en temel UI yapı taşıdır.
Kendi başına ürün bağlamı taşımayan ama sistemin görsel ve davranışsal kurallarını uygulayan düşük seviyeli bileşendir.

Örnek primitive türleri:
- Text
- Heading
- Box / View / Container
- Stack / Inline / Spacer benzeri layout primitive’leri
- Icon
- Pressable foundation
- Surface
- Divider
- Field shell
- Focus ring wrapper
- Scroll container foundation

## 9.2. Primitive neden gereklidir?

Primitive katmanı şu problemleri çözer:
- her yerde doğrudan platform elementleriyle çalışmayı azaltır,
- token ve semantic token kullanımını sistematik hale getirir,
- a11y ve interaction minimumlarını merkezileştirir,
- bileşen ailesine ortak davranış verir,
- layout kararlarını tekrar üretilebilir hale getirir.

## 9.3. Primitive ne değildir?

Primitive:
- ürün feature component’i değildir,
- domain bağlamı taşımaz,
- iş kuralı içermez,
- çok fazla varyant yüklenmiş karmaşık ürün bileşeni değildir.

## 9.4. Primitive kuralları

- Primitive API’leri küçük ve kararlı olmalı.
- Primitive’ler token ve semantic token diline bağlı olmalı.
- Primitive’ler sistem dışı serbest stil alanı sunmamalı.
- Primitive katmanı “her ihtimali çözelim” mantığıyla şişirilmemeli.
- Primitive, component olmak isteyen ama henüz tasarlanmamış özel bir varlık haline gelmemeli.

## 9.5. Primitive’de zayıf yaklaşımlar

- primitive’e feature-specific props eklemek,
- primitive’i style dump alanı yapmak,
- primitive’i doğrudan ekran iş mantığıyla bağlamak,
- primitive’leri bypass eden doğrudan platform bileşeni kullanımı.

## 9.6. Canonical Primitive Başlangıç Seti

Bu projede, `39-default-screens-and-components-spec.md` Bölüm 11’de tanımlanan aşağıdaki 12 primitive, `packages/ui/primitives/` altında ilk gün oluşturulur ve tüm component’lerin temelini oluşturur:

| # | Primitive | Token Tüketimi | Dış Kütüphane |
|---|-----------|---------------|---------------|
| C01 | Text | Typography semantic | — |
| C02 | Heading | Typography semantic | — |
| C03 | Box / Surface | Color, spacing, border, radius | — |
| C04 | Stack | Spacing (gap) | — |
| C05 | Inline | Spacing (gap) | — |
| C06 | Spacer | Spacing | — |
| C07 | Pressable | Motion (feedback), color (state) | expo-haptics |
| C08 | Icon | Color, sizing | lucide-react-native |
| C09 | Divider | Border | — |
| C10 | ScrollContainer | — | — |
| C11 | SafeAreaContainer | — | react-native-safe-area-context |
| C12 | KeyboardAvoidingContainer | — | react-native-keyboard-controller |

> Bu liste design system mimarisinin uygulanabilir başlangıç noktasını tanımlar. Detaylı spec: `39-default-screens-and-components-spec.md`

---

# 10. Components Katmanı

## 10.1. Component nedir?

Component, primitive’lerin üzerine inşa edilen, tekrar eden ve belirli ürün görevlerini taşıyan, belirli davranış ve görsel contract’a sahip sistem bileşenidir.

Örnek:
- Button
- TextField
- SearchField
- Checkbox
- Radio
- Switch
- Tabs
- Segmented control
- ListItem
- Card
- Banner
- Toast surface
- Modal header
- EmptyState block
- Avatar
- Badge
- Chip
- SectionHeader

## 10.2. Component neden primitive’den ayrılır?

Çünkü component:
- belirli bir kullanım amacına sahiptir,
- kullanıcı açısından daha anlamlıdır,
- durumları daha zengindir,
- daha net a11y beklentileri taşır,
- tekrar eden pattern’lere temel olur.

## 10.3. Component contract nedir?

Her component’in şu alanları net olmalıdır:
- amacı,
- hangi problemi çözdüğü,
- ne zaman kullanıldığı,
- ne zaman kullanılmadığı,
- desteklediği varyantlar,
- desteklediği durumlar,
- minimum a11y beklentisi,
- platform farklılığı varsa bunun nasıl yönetildiği.

## 10.4. Component kuralları

- Component amaç odaklı olmalı.
- Aynı problem için birden fazla bileşen ailesi açılmamalı.
- Varyant sayısı keyfi büyütülmemeli.
- “Bir prop daha ekleyelim” mantığıyla component kimliği bozulmamalı.
- Her component’in kullanım sınırı yazılı olmalı.
- Component’ler primitive’lerin üstüne oturmalı, primitive bypass edilmemeli.

## 10.5. Zayıf component davranışları

- aynı buton ailesi için üç ayrı buton component’i açmak,
- mevcut component’e bağlama özel onlarca prop eklemek,
- bir feature için o feature’e özel ama sistem görünümü taşıyan kopya bileşen üretmek,
- component’in tasarım sistemi değil ekran ihtiyacı tarafından şekillendirilmesi.

---

# 11. Patterns Katmanı

## 11.1. Pattern nedir?

Pattern, birden fazla component’in belli bir ürün görevini çözmek için bir araya getirildiği tekrar eden yapı modelidir.

Örnek:
- login form block
- settings row pattern
- filter bar pattern
- search + result list pattern
- confirmation section pattern
- card list with actions
- form section with helper and validation
- destructive action confirmation pattern
- empty state with primary CTA
- skeleton list row pattern

## 11.2. Pattern neden gereklidir?

Pattern katmanı olmazsa:
- aynı problem her feature’da farklı şekilde çözülür,
- componentler tek tek tutarlı olsa bile ekranlar bütünsel olarak dağınık görünür,
- UX sürtünmesi artar,
- geliştirici her feature’da yeniden düzen kurmak zorunda kalır.

## 11.3. Pattern kuralları

- Pattern, ekranın tekrar eden iş problemlerini çözmeli.
- Pattern ile tam ekran kavramı karıştırılmamalı.
- Pattern’ler sistemin ekranlar arası davranış ve görünüm tutarlılığını artırmalı.
- Pattern sayısı kontrolsüz büyümemeli.
- Bir pattern sadece tek feature’a aitse pattern olarak tanımlanmadan önce sorgulanmalı.

---

# 12. Screens / Flows Katmanı

## 12.1. Screen / flow düzeyi nedir?

Bu katman, ürün seviyesindeki tam ekran veya akış düzenlerini ifade eder.
Design system ekranı doğrudan “tasarlamaz” ama ekranların hangi sistem kurallarıyla kurulacağını etkiler.

## 12.2. Design system bu katmanda ne yapar?

- spacing hiyerarşisini sınırlar,
- component ve pattern kullanımını yönlendirir,
- bilgi yoğunluğu sınırlarına etki eder,
- aksiyon hiyerarşisi için kural sağlar,
- standard screen regions tanımlar.

## 12.3. Design system’in bu katmandaki sınırı

Design system, ürün akışının tamamını tek başına belirlemez.
Ama ekranların kuralsız şekilde oluşmasını engeller.

---

# 13. Hardcoded Değer Yasağı

## 13.1. Neden kritik?

Hardcoded değerler kısa vadede hızlı görünür ama orta vadede sistemi çürütür.

Özellikle şunlarda hardcoded kararlar ciddi risk yaratır:
- spacing,
- color,
- typography,
- radius,
- border,
- elevation,
- motion,
- hit area,
- layout density.

## 13.2. Hardcoded yaklaşım neden zayıftır?

- tekrar üretilemez,
- semantic anlam taşımaz,
- theme değişiminde bozulur,
- component ailesi tutarlılığını bozar,
- review ve audit maliyetini artırır,
- token sistemini anlamsızlaştırır.

## 13.3. Hardcoded’a yaklaşım politikası

Varsayılan yaklaşım:
- hardcoded değer reddedilir.

İstisna gerekiyorsa:
- neden gerektiği açıklanmalı,
- tokenlaştırılamama sebebi belirtilmeli,
- geçici mi kalıcı mı yazılmalı,
- tekrar ihtimali varsa sistemleştirilmelidir.

---

# 14. Variant Stratejisi

## 14.1. Varyant neden dikkatle yönetilmelidir?

Çünkü her yeni varyant sistem esnekliği değil, çoğu zaman sistem zayıflığı üretir.

## 14.2. Bir varyant ne zaman meşrudur?

Sadece şu durumda:
- gerçekten ayrı kullanım amacı varsa,
- görsel farklılık anlamsal farklılık taşıyorsa,
- kullanım sıklığı yeterince yüksekse,
- ayrı bileşen açmak yerine sistematik varyant daha doğruysa.

## 14.3. Varyant açmadan önce sorulacak sorular

1. Bu farklılık anlam farkı mı, yoksa stil tercihi mi?
2. Bu değişiklik tek ekranlık mı?
3. Bu varyant başka yerde de kullanılacak mı?
4. Mevcut variant sistemini bozuyor mu?
5. Bu aslında yeni bir component mi?
6. Bu fark token/pattern düzeyinde çözülebilir mi?

## 14.4. Zayıf varyant davranışları

- `primary`, `secondary`, `ghost`, `light`, `soft`, `flat`, `subtle`, `special`, `alt`, `screenSpecific` gibi kontrolsüz büyüyen varyant kümeleri,
- bir feature yüzünden varyant ağacını kirletmek,
- geçici ekran ihtiyacını kalıcı variant yapmak.

---

# 15. Stil Otoritesi

## 15.1. Stil otoritesi ne demektir?

Proje içinde stil kararlarını belirleyen tek bir merkezi sistem olmalıdır.
Bu merkezi sistem:
- tokenlar,
- semantic tokenlar,
- primitive kuralları,
- component contract’ları,
- pattern kuralları
üzerinden çalışır.

## 15.2. Bu neden önemli?

Eğer stil otoritesi dağılırsa:
- tasarım dili bozulur,
- herkes kendi doğru bildiğini uygular,
- component ailesi çözülür,
- görsel kalite review ile zor toparlanır.

## 15.3. Stil otoritesi için zorunlu ilke

Yeni görsel kararlar önce şu sırayla değerlendirilmelidir:
1. mevcut token ile çözülebilir mi?
2. semantic token ihtiyacı mı var?
3. primitive düzeyinde çözülmeli mi?
4. mevcut component genişlemeli mi?
5. yeni component gerekli mi?
6. pattern düzeyinde mi ele alınmalı?

Bu sıra atlanarak eklenen stil kararı zayıf kabul edilir.

---

# 16. Theme ve Color Semantics İlişkisi

## 16.1. Theme neden design system’in merkezindedir?

Theme yalnızca dark mode desteği değildir.
Şunları etkiler:
- yüzey ilişkisi,
- metin kontrastı,
- vurgu düzeyi,
- state görünürlüğü,
- bilgi yoğunluğu algısı.

## 16.2. Theme kuralları

- Theme ham renklerden değil semantic tokenlardan çalışmalı.
- Light ve dark yorumları anlam düzeyinde tutarlı olmalı.
- Aynı semantic rol, iki temada da aynı ürünsal görevi sürdürmeli.
- Contrast theme değişiminde bozulmamalı.

## 16.3. Zayıf theme yaklaşımı

- light için ayrı, dark için ayrı keyfi component stili,
- semantic rol yerine doğrudan renk tonu seçimi,
- bazı componentlerin theme’i destekleyip bazılarının desteklememesi,
- durum renklerinin kararsızlaşması.

---

# 17. Motion Tokens ve Interaction Dili

## 17.1. Motion neden design system konusudur?

Çünkü motion:
- state değişimini açıklar,
- ürün hissini belirler,
- etkileşim tutarlılığını artırır,
- premium algıya katkı verir.

## 17.2. Motion sisteminin katmanları

- raw duration tokens,
- easing tokens,
- semantic motion tokens,
- component level motion contracts,
- reduced motion fallback mantığı.

## 17.3. Zayıf motion davranışları

- her component’in farklı süre kullanması,
- anlam taşımayan animasyon,
- reduced motion desteğinin sistem dışı bırakılması,
- dikkat çekmek için hareket kullanımı.

---

# 18. Iconography ve Asset Kuralları

## 18.1. İkonlar sistem parçasıdır

İkonlar rastgele kaynaklardan, rastgele stroke kalınlığıyla veya rastgele hizayla kullanılmamalıdır.

## 18.2. Kurallar

- ikon seti kontrollü olmalı,
- stroke / fill dili tutarlı olmalı,
- size rolleri tanımlı olmalı,
- interactive ve decorative ikonlar ayrılmalı,
- ikonlar component contract’ları içinde doğru bağlamda kullanılmalı.

## 18.3. Image / illustration kuralları

- dekoratif görseller sistem dışı keyfi eleman haline gelmemeli,
- image container davranışı sistemli olmalı,
- aspect ratio ve crop mantığı bileşen düzeyinde tanımlanmalı,
- görsellerin yüzey ve spacing ilişkisi tutarlı olmalı.

---

# 19. Platform Varyantları

## 19.1. Neden gerekli olabilir?

Cross-platform üründe bazı componentler aynı semantic görevi taşırken farklı platform render’ına ihtiyaç duyabilir.

Örnek:
- mobile’da bottom sheet trigger pattern,
- web’de dialog / popover ağırlıklı yorum.

## 19.2. Kural

Platform varyantı meşrudur eğer:
- behavior parity korunuyorsa,
- tasarım dili korunuyorsa,
- native kalite artıyorsa,
- implementasyon farkı anlamsal fark üretmiyorsa.

## 19.3. Reddedilen yaklaşım

- platform varyantı bahanesiyle tamamen farklı component ailesi üretmek,
- design language’i bozmak,
- aynı semantic rol için iki farklı ürün anlamı üretmek.

---

# 20. Yeni Bileşen Açma Kararı

## 20.1. Yeni component ne zaman açılmalı?

Aşağıdaki durumlarda yeni component meşru olabilir:
- tekrar eden açık bir kullanım problemi varsa,
- mevcut component’ler anlamsız genişlemeye zorlanıyorsa,
- yeni semantic rol gerçekten ayrıysa,
- pattern değil component düzeyinde tekrar varsa.

## 20.2. Yeni component açmadan önce sorulacak sorular

1. Bu problem mevcut component ile çözülebilir mi?
2. Primitive veya pattern düzeyinde çözüm yeterli mi?
3. Bu gerçek bir sistem ihtiyacı mı, ekran spesifik ihtiyacın genelleştirilmiş hali mi?
4. Yeni component başka feature’larda da anlamlı olacak mı?
5. A11y, states, theme ve platform davranışı tanımlı mı?

## 20.3. Zayıf yeni component örnekleri

- tek ekran için açılan pseudo-system component,
- mevcut component’ten yalnızca biraz farklı görünen yeni bileşen,
- varyant yerine kopya bileşen üretimi,
- sistem bakım maliyetini artıran feature-local UI wrapper’ları.

---

# 21. Bileşen API Disiplini

## 21.1. Component API neden kritik?

Kötü component API:
- kullanım hatası üretir,
- varyant kirliliği yaratır,
- a11y’yi unutulabilir hale getirir,
- design system dışına çıkışı kolaylaştırır.

## 21.2. Zorunlu prensipler

- prop yüzeyi gereğinden büyük olmamalı,
- anlam taşımayan stil prop’ları verilmemeli,
- layout kaçışları sınırlı olmalı,
- zorunlu state ve a11y alanları unutulabilir olmamalı,
- component amacı API’den anlaşılmalı.

## 21.3. Zayıf API örnekleri

- `customStyle`, `containerStyle`, `textStyle`, `innerStyle` gibi kaçış alanları,
- aynı component’te çok sayıda çakışan bool prop,
- semantic olmayan appearance prop’ları,
- design system’i prop kombinasyonlarıyla delmeye izin vermek.

---

# 22. Accessibility’nin Design System İçindeki Yeri

## 22.1. A11y neden system katmanında düşünülmeli?

Çünkü erişilebilirlik tek tek ekranlarda hatırlanacak detay değildir.
Sistemin içine gömülmelidir.

## 22.2. Sistem seviyesinde ele alınacak a11y alanları

- touch target minimumları,
- label/role/hint varsayımları,
- focus görünürlüğü,
- contrast standardı,
- text scaling uyumu,
- error state okunabilirliği,
- keyboard ve assistive tech davranışı,
- reduced motion uyumu.

## 22.3. Zayıf yaklaşım

- component library güzel, a11y’yi ekran bazında hallederiz,
- buton/input var ama label sistemi belirsiz,
- focus state yalnızca web’de düşünülmüş,
- mobile hit area primitive düzeyinde güvenceye alınmamış.

---

# 23. Design System Governance

## 23.1. Governance neden zorunlu?

Design system yalnızca dosya yapısı ile korunmaz.
Korunması için kurallar gerekir:
- kim component açabilir,
- ne zaman token eklenebilir,
- ne zaman istisna verilir,
- review hangi kriterle yapılır,
- sistem dışına çıkış nasıl denetlenir.

## 23.2. Governance alanları

### A. Token governance
- yeni token ekleme kuralı,
- token isimlendirme kuralı,
- tekrar eden değer tespiti.

### B. Component governance
- yeni component açma kuralı,
- varyant ekleme kuralı,
- API büyüme sınırları.

### C. Pattern governance
- pattern kataloğu oluşturma,
- tekrar eden ekran çözümlerini sistemleştirme.

### D. Exception governance
- istisna formatı,
- istisna süresi,
- istisna gerekçesi,
- istisna review süreci.

## 23.3. Reddedilen governance anlayışı

- “ekip dikkat eder”,
- “PR’da bakarız”,
- “şimdilik kullanalım sonra toplarız”,
- “tasarım sistemi çok da kasmaya gerek yok”.

Bu yaklaşım doğrudan kalite kaybı üretir.

---

# 24. Exemption / İstisna Mekanizması

## 24.1. İstisna neden gerekir?

Hiçbir sistem sıfır istisna ile yaşamaz.
Ama istisna sessizce uygulanırsa sistem çürür.

## 24.2. İstisna ancak şu durumda kabul edilebilir

- mevcut sistem ihtiyacı karşılamıyorsa,
- sistem değişikliği için henüz erkense,
- ürün teslimi açısından geçici çözüm gerekiyorsa,
- bunun neden sistem dışı olduğu açıklanabiliyorsa.

## 24.3. İstisna kaydı zorunlu alanlar

- hangi bileşen/ekran,
- neden istisna verildi,
- hangi kuraldan sapıldı,
- geçici mi kalıcı mı,
- ne zaman yeniden değerlendirilecek.

## 24.4. Zayıf istisna davranışları

- yorum satırına bile yazılmamış kaçış,
- token yerine inline değer ama sebep yok,
- bir kez verilip kalıcı standarda dönüşen istisna,
- ekran baskısı bahanesiyle sürekli kaçış.

---

# 25. Repo ve Paketleme İlişkisi

## 25.1. Design system repo içinde nasıl konumlanmalı?

Bu boilerplate kapsamında design system’in ayrı düşünülmesi gereken parçaları vardır:

- tokens
- ui primitives
- ui components
- possibly patterns / recipes
- config and enforcement tools

## 25.2. Neden ayrı düşünülmeli?

Çünkü:
- app içindeki feature koduyla karışmamalı,
- tekrar kullanılabilirlik netleşmeli,
- governance uygulanabilmeli,
- import yönleri temiz kalmalı,
- shared vs platform-specific sınırları görünür olmalı.

## 25.3. Uyarı

Ayrı paket kurmak tek başına başarı değildir.
Yanlış ayrıştırılmış paket mimarisi de zararlıdır.
Bu nedenle package sınırları mimari dokümanla birlikte karar verilmelidir.

---

# 26. Design-to-Code Disiplini

## 26.1. Tasarımdan implementasyona geçişte ilke

Tasarım sistemi, tasarım ile kod arasında yorum boşluğunu azaltmalıdır.

## 26.2. Zorunlu davranış

- Tasarım varsa sistem diliyle uygulanmalı.
- Tasarım sistem dışı görünüyorsa önce sistem kararı sorgulanmalı.
- Aynı tasarım problemi tekrar ediyorsa component/pattern seviyesinde sisteme alınmalı.
- “yaklaşık böyle olur” mantığına izin verilmemeli.

## 26.3. Zayıf davranış

- Figma’ya bakıp göz kararı değer girmek,
- sistemde olmayan varyant uydurmak,
- spacing ve typography’yi keyfi yorumlamak,
- platform farkı bahanesiyle tasarım dilini parçalamak.

---

# 27. Enforcement Yaklaşımı

## 27.1. Design system nasıl enforce edilir?

Mümkün olan yerlerde şu araçlarla:
- lint kuralları,
- forbidden import / forbidden style patterns,
- hardcoded value detection,
- component usage policy,
- a11y checks,
- CI gate’ler,
- audit checklist’leri,
- PR review kriterleri.

## 27.2. Enforce edilebilecek başlıklar

- raw color kullanımı,
- hardcoded spacing,
- yasaklı primitive bypass’ları,
- belirli componentler yerine custom çözümler,
- missing accessibility props,
- tasarım sistemi dışı inline styling kalıpları.

## 27.3. Her şeyi enforce etmek mümkün mü?

Hayır.
Bazı alanlar yine insan denetimi ister:
- görsel hiyerarşi kalitesi,
- premium hissiyat,
- bilgi yoğunluğu kararı,
- interaction tonunun doğruluğu,
- pattern seçiminin uygunluğu.

Ama bu, enforce edilebilecek alanları boş vermek için bahane değildir.

---

# 28. Anti-Pattern Listesi

Aşağıdaki davranışlar design system mimarisi açısından zayıf kabul edilir:

1. Raw değerlerle ekran yazmak
2. Semantic token yerine doğrudan palette seçmek
3. Primitive bypass ederek doğrudan platform bileşenleriyle UI kurmak
4. Mevcut component yerine ekran-özel kopya bileşen açmak
5. API’ye kaçış prop’ları yığmak
6. Varyantları bağlamsız büyütmek
7. Pattern düzeyinde tekrar eden problemi sistemleştirmemek
8. İstisnaları sessizce bırakmak
9. Accessibility’yi component contract’ının dışında düşünmek
10. Design system’i yalnızca “ui package” sanmak
11. Token hiyerarşisini bozan keyfi theme kararları
12. Shared component oranını başarı gibi görmek
13. Platform farklarını sistem dışı hack ile çözmek
14. System-over-taste ilkesini bozmak
15. Design-to-code geçişinde “yaklaşık” davranmak

---

# 29. Bir Tasarım Sistemi Kararının Kaliteli Sayılması İçin Kontrol Soruları

Bir karar alınmadan önce şu sorular sorulmalıdır:

## Token seviyesi
- Bu yeni değer gerçekten yeni mi?
- Var olan scale ile çözülemiyor mu?
- Raw mı semantik mi olmalı?

## Semantic seviye
- Bu değer hangi ürün anlamını taşıyor?
- Aynı anlam başka yerde nasıl temsil ediliyor?
- Theme değişiminde tutarlı kalır mı?

## Primitive seviyesi
- Bu ihtiyaç primitive düzeyinde mi çözülmeli?
- Primitive çok mu şişiyor?
- Primitive’e bağlama özel bilgi sızıyor mu?

## Component seviyesi
- Bu gerçekten yeni component mi?
- Varyant mı, pattern mi, yoksa yeni family mi?
- A11y ve state contract’ı tanımlı mı?

## Pattern seviyesi
- Bu problem tekrar ediyor mu?
- Aynı pattern farklı feature’larda kullanılacak mı?

## Governance seviyesi
- Bu karar nasıl denetlenecek?
- İstisna mı, standart mı?
- Bakım maliyetini artırıyor mu?

---

# 30. Sonraki Dokümanlara Etkisi

## 30.1. Theming and visual language
`05-theming-and-visual-language.md`, token ve semantic token mantığını burada tanımlanan hiyerarşiye göre detaylandırmalıdır.

## 30.2. Module boundaries
`07-module-boundaries-and-code-organization.md`, primitive/component/pattern katmanlarının repo içindeki konumunu bu belgeye göre kurmalıdır.

## 30.3. Forms and validation
`11-forms-inputs-and-validation.md`, field shell, input family ve validation presentation’ı sistem bileşeni mantığında ele almalıdır.

## 30.4. Accessibility standard
`12-accessibility-standard.md`, component contract içindeki a11y zorunluluklarını teknik seviyeye taşımalıdır.

## 30.5. Quality gates and governance
`15-quality-gates-and-ci-rules.md` ve `16-tooling-and-governance.md`, burada tanımlanan enforcement alanlarını denetim mekanizmasına dönüştürmelidir.

## 30.6. Stitch pipeline spec
`46-stitch-pipeline-spec.md`, bu design system mimarisinin AI destekli design-to-code pipeline'ı ile nasıl tüketileceğini tanımlar. Stitch'in DESIGN.md çıktısı bu dokümandaki token hiyerarşisine uymalıdır.

---

# 31. Onay Kriterleri

Bu doküman yeterli kabul edilir eğer:

1. Design system component koleksiyonu seviyesine indirgenmemişse,
2. Katmanlar net biçimde ayrılmışsa,
3. Token → semantic token → primitive → component → pattern → screen/flow hiyerarşisi açıkça tanımlanmışsa,
4. Hardcoded kararların neden zayıf olduğu netleşmişse,
5. Yeni component, varyant ve istisna politikası tanımlanmışsa,
6. Governance ve enforcement boyutu açıkça yer alıyorsa,
7. Cross-platform bağlamında shared ve platform-specific yaklaşım sistem düzeyinde ele alınmışsa.

---

# 32. Kısa Sonuç

Bu dokümanın ana çıktısı şudur:

> Bu boilerplate kapsamında design system, renk ve component listesi değil; ürünün görsel ve davranışsal standardını tokenlardan pattern’lere kadar yöneten, implementasyonu sınırlayan, kaliteyi koruyan ve mümkün olduğunca enforce edilebilen merkezi sistemdir.

Bu nedenle bundan sonraki hiçbir doküman:
- design system’i sadece UI package olarak ele alamaz,
- hardcoded tasarım kararlarını normalleştiremez,
- component açmayı serbest stil alanı gibi göremez,
- semantic katmanı atlayamaz,
- governance olmadan tasarım sistemi varmış gibi davranamaz.
