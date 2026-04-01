# 23-component-governance-rules.md

## Doküman Kimliği

- **Doküman adı:** Component Governance Rules
- **Dosya adı:** `23-component-governance-rules.md`
- **Doküman türü:** Governance / design system / component lifecycle document
- **Durum:** Accepted
- **Kapsam:** Bu boilerplate kapsamında component kavramının ne olduğunu, primitive ile component arasındaki farkı, feature-specific UI ile reusable system UI ayrımını, component açma kriterlerini, varyant yönetimini, component API disiplinini, styling ve a11y contract’larını, test ve audit beklentilerini ve component yaşam döngüsünü tanımlar.
- **Bağlı olduğu üst dokümanlar:**
  - `03-ui-ux-quality-standard.md`
  - `04-design-system-architecture.md`
  - `05-theming-and-visual-language.md`
  - `12-accessibility-standard.md`
  - `16-tooling-and-governance.md`
  - `21-repo-structure-spec.md`
  - `22-design-tokens-spec.md`
  - `ADR-007-styling-tokens-and-theming-implementation.md`
- **Doğrudan etkileyeceği dokümanlar:**
  - `24-motion-and-interaction-standard.md`
  - `25-error-empty-loading-states.md`
  - `30-contribution-guide.md`
  - `31-audit-checklist.md`
  - `32-definition-of-done.md`
  - `34-hig-enforcement-strategy.md`
  - `35-document-map.md`
  - `39-default-screens-and-components-spec.md`

---

# 1. Amaç

Bu dokümanın amacı, component üretimini “UI parçası lazım, bir component açalım” düzeyinden çıkarıp; design system disiplini, API sadeliği, görsel tutarlılık, a11y zorunlulukları, test edilebilirlik ve uzun vadeli bakım maliyeti üzerinden yönetilen kurallı bir sisteme dönüştürmektir.

Bu belge şu sorulara net cevap verir:

1. Primitive nedir, component nedir, pattern nedir, feature-specific UI nedir?
2. Yeni component ne zaman açılır, ne zaman açılmaz?
3. Hangi UI parçası `packages/ui` içinde yaşamalıdır, hangisi feature içinde kalmalıdır?
4. Component API nasıl sade, kontrollü ve enforce edilebilir tutulur?
5. Variant, size, tone, emphasis ve state yönetimi nasıl ele alınmalıdır?
6. Component’ler token, theme, a11y ve motion sistemiyle nasıl bağlanmalıdır?
7. Bir component’in “done” sayılması için hangi minimum kalite koşulları gerekir?
8. Hangi component davranışları doğrudan zayıf kabul edilir?

Bu belge component kataloğu değildir.
Component kataloğunun hangi mantıkla kurulacağını ve nasıl bozulmadan büyütüleceğini tanımlar.

---

# 2. Neden Bu Doküman Gerekli

Design system olan birçok projede bile component katmanı kısa sürede bozulur.
Sebep genellikle şudur:
Kurallar primitive ve token seviyesinde yazılır ama component üretim disiplini yazılmaz.

Sonra şu bozulmalar olur:

- her feature kendi butonunu, kartını, field’ını üretir,
- `Button2`, `PrimaryButton`, `ActionButton`, `BigButton`, `CTAButton` gibi aynı işi yapan paralel aileler çıkar,
- component API’leri onlarca prop ile şişer,
- varyantlar rastgele büyür,
- state davranışları birbiriyle tutarsızlaşır,
- design token yerine component içine renk/spacing gömülür,
- a11y her component’te farklı kalite taşır,
- reusable sanılan şeyler aslında feature-specific çıkar,
- reusable olması gerekenler de feature içinde sıkışır.

Bu proje kapsamında component katmanı “en çok tekrar edilen yanlış soyutlama alanı” olarak görülmelidir.
Bu yüzden component açmak serbest değil, kurallı olmalıdır.

---

# 3. Temel Tez

Bu proje kapsamında temel tez şudur:

> Component üretimi, tekrar eden UI parçalarını tek yere toplama işi değildir; primitive, semantic token, accessibility contract, motion behavior, state sunumu ve API sadeliği üzerinden kurulan; reusable olan ile feature-specific olanı bilinçli ayıran yönetimli bir tasarım sistemi pratiğidir.

Bu tez şu sonuçları doğurur:

1. Her tekrar eden şey reusable component olmak zorunda değildir.
2. Her reusable parça design system component’i olmak zorunda değildir.
3. Primitive, component ve pattern katmanları karıştırılamaz.
4. Component API’si esnek görünecek diye sınırsız prop yüzeyi açılmaz.
5. Varyant sayısı arttıkça sistem güçlenmez; çoğu zaman bozulur.
6. Component contract’ı a11y, state, theme ve test beklentilerini içermelidir.

---

# 4. Component Governance Hedefleri

## 4.1. Tutarlılık

Aynı tür etkileşim ve görsel rol, ürünün farklı yerlerinde aynı aile hissini taşımalıdır.

## 4.2. API sadeliği

Component’ler her ihtimali prop seviyesinde çözmeye çalışan kontrol panellerine dönüşmemelidir.

## 4.3. Reuse kalitesi

Gerçekten tekrar eden ve sistem değeri taşıyan parçalar reusable olmalıdır.
Yapay reuse baskısı zayıf soyutlama üretir.

## 4.4. A11y standardı

Component’ler erişilebilirlik yükünü ekran implementasyonuna bırakmamalıdır.

## 4.5. Design token disiplini

Component’ler hardcoded stil deposu olmamalıdır.

## 4.6. Test edilebilirlik

Component davranışları net contract’larla testlenebilir olmalıdır.

## 4.7. Sürdürülebilir büyüme

Sistem 5 component ile de, 50 component ile de yönetilebilir kalmalıdır.

---

# 5. Katman Ayrımı

Bu proje kapsamında UI yapısı şu katmanlarla düşünülmelidir:

1. Tokens
2. Semantic tokens
3. Primitives
4. Components
5. Patterns
6. Feature-specific composed UI
7. Screens / flows

Bu hiyerarşi bozulmamalıdır.

---

# 6. Primitive Nedir?

## 6.1. Tanım

Primitive, design system’in en düşük seviyeli ama token ve a11y uyumlu yapı taşıdır.

Örnek:
- text
- heading
- box / container
- stack / inline
- surface
- pressable foundation
- icon wrapper
- divider

## 6.2. Primitive ne iş yapar?

- token/theme tüketir
- temel semantics taşır
- düşük seviyeli layout ve görsel davranış sağlar
- daha yüksek component’lerin altında tekrar eden sistemi normalize eder

## 6.3. Primitive ne yapmaz?

- feature behavior taşımaz
- ürün görevi anlatmaz
- karmaşık orchestration içermez
- business logic veya screen intent barındırmaz

## 6.4. Kural

Primitive katmanı mümkün olduğunca sade kalmalıdır.
Çok fazla bağlamsal anlam yüklenirse component katmanının alanı kaybolur.

---

# 7. Component Nedir?

## 7.1. Tanım

Component, primitive’leri ve semantic tokenları kullanarak belirli, tekrar eden bir UI rolünü çözen reusable yapı taşıdır.

Örnek:
- button
- text field
- checkbox field
- switch row
- card
- badge
- list item
- empty state block
- dialog header
- toast
- tabs

## 7.2. Component ne iş yapar?

- belirli görsel ve etkileşim contract’ı sunar
- varyant/state yönetimi taşır
- a11y minimumlarını gömer
- aynı aile üyelerinin tutarlı davranmasını sağlar

## 7.3. Component ne yapmaz?

- feature akışını çözmez
- ekran seviyesinde business composition taşımaz
- farklı ürün amaçlarını tek prop şişkinliğiyle çözmeye çalışmaz

---

# 8. Pattern Nedir?

## 8.1. Tanım

Pattern, birden fazla component’in tekrar eden görevsel birleşimidir.
Tek tek reusable parçalardan daha yüksek seviye ama screen’den düşük seviye bir yapıdır.

Örnek:
- form section
- search + filter header
- list-detail shell
- settings group
- confirmation block
- empty/error/retry panel ailesi
- card grid section

## 8.2. Neden ayrı katman?

Çünkü bazı tekrarlar tek component değildir ama her feature’da baştan yazılması da yanlıştır.

## 8.3. Uyarı

Her pattern `packages/ui` içine taşınmaz.
Gerçek tekrar ve ürün geneli anlamlılık aranmalıdır.

---

# 9. Feature-Specific UI Nedir?

## 9.1. Tanım

Sadece belirli bir feature veya belirli bir ürün bağlamında anlamlı olan UI birleşimleridir.

Örnek:
- profil fotoğrafı düzenleme paneli
- ödeme adımı özet kartı
- bir domain’e özgü seçim satırı
- bir modüle özel dashboard summary bloğu

## 9.2. Kural

Feature-specific UI, reusable görünse bile sistem bileşeni olmak zorunda değildir.
Önce kendi bağlamında yaşamalıdır.

## 9.3. Zayıf davranış

Feature’e özel görsel parçayı “reuse olabilir” düşüncesiyle erkenden shared UI package’a taşımak.

---

# 10. Yeni Component Açma Kriteri

Bir UI parçası için yeni component açmadan önce şu sorular sorulmalıdır:

1. Bu gerçekten tekrar eden bir UI rolü mü?
2. Tekrarlanan şey görünüm mü, davranış mı, yoksa sadece benzerlik hissi mi?
3. Bu parça primitive + küçük composition ile çözülemiyor mu?
4. Bu parça feature-specific kalırsa daha mı doğru?
5. Bunu reusable yapınca API doğal kalıyor mu?
6. Bu component’in contract’ı net tanımlanabiliyor mu?
7. Bu component ürün genelinde aynı kaliteyi koruyacak mı?
8. Bu component’i açmak system sadeliğini artırıyor mu, yoksa katalog şişiriyor mu?

Bu sorulara net yanıt verilemiyorsa component açmak için erken olabilir.

---

# 11. Ne Zaman Yeni Component Açılmamalı?

Aşağıdaki durumlarda yeni component açmak zayıf yaklaşımdır:

## 11.1. Tek ekranlık geçici ihtiyaç
Sadece tek yerde ve tek bağlamda kullanılan görsel parça.

## 11.2. Primitive composition yeterliyse
Sırf tekrar var diye yeni abstraction açmak gerekmez.

## 11.3. Contract belirsizse
Hangi prop’ların zorunlu, hangi state’lerin supported olduğu belli değilse.

## 11.4. Varyant baskısından kaçmak için
Her yeni görünüm farkında yeni component açmak sistem gücü değil, zayıflığıdır.

## 11.5. Feature behavior taşıyorsa
Business logic’e yakın UI’yı reusable component diye yukarı taşımak hatalıdır.

---

# 12. Component Yerleşim Kararı

## 12.1. `packages/ui` içine ne girmeli?

Aşağıdaki kriterlerin çoğunu sağlayanlar:
- birden fazla screen/feature/app için anlamlı reuse
- net design system rolü
- semantik ve a11y contract’ı tanımlanabilir
- feature bağımlılığı yok
- ürün genelinde tutarlılık sağlaması bekleniyor

## 12.2. Feature içinde ne kalmalı?

- domain’e özel card/row/block
- sadece belirli flow’a anlamlı birleşimler
- reusable gibi dursa da contract’ı bağlam bağımlı olan yapılar
- business-specific presentational compositions

## 12.3. Pattern alanına ne gider?

- tekrar eden ama tek component kadar düşük olmayan birleşimler
- genel ürün family’si taşıyan layout/feedback structures

## 12.4. Zayıf davranışlar

- her tekrar eden şeyin `packages/ui` içine taşınması
- reusable olması gereken parçanın feature içinde çoğalması
- feature-specific birleşimlerin component kütüphanesine doldurulması

---

# 13. Component API Tasarım İlkeleri

## 13.1. API sade olmalı

Component API’si kullanıcıya mümkün olduğunca:
- neyi desteklediğini
- neyi desteklemediğini
açık biçimde anlatmalıdır.

## 13.2. API role-based olmalı

Prop’lar görsel hack değil, anlamsal kullanım sunmalıdır.

Zayıf örnek:
- `isBlue`
- `big`
- `specialMode`
- `customPadding`
- `dangerButNotTooMuch`

Daha güçlü yaklaşım:
- `variant`
- `tone`
- `size`
- `emphasis`
- `state`
- `disabled`
- `loading`
- `selected`

## 13.3. API escape hatch deposu olmamalı

`className`, `style`, `sx`, `customColor`, `padding`, `fontSize`, `radius`, `bg` gibi sınırsız kaçış yüzeyleri component contract’ını bozar.
İstisna gerekiyorsa bilinçli ve sınırlı olmalıdır.

## 13.4. Kural

Bir component’in doğru kullanımı prop okumadan dahi mümkün olduğunca anlaşılabilir olmalıdır.

---

# 14. Component Props Tasarlarken Sorulacak Sorular

1. Bu prop sistem düzeyinde anlamlı mı?
2. Bu prop yeni bir varyant mı gerektiriyor, yoksa yanlış abstraction mı gösteriyor?
3. Bu prop bir feature ihtiyacını component API’ye mi sızdırıyor?
4. Bu prop aynı sonucu token/pattern üzerinden çözebiliyor mu?
5. Bu prop ileride sonsuz kombinasyon patlaması yaratır mı?
6. Bu prop accessibility veya state contract’ını etkiliyor mu?
7. Bu prop yoksa component kullanılamaz mı, yoksa sadece bir kolaylık mı?
8. Bu prop’un default davranışı açık mı?

---

# 15. Variant Yönetimi

## 15.1. Neden kritik?

Component sistemleri en çok varyant kontrolü kaybedildiğinde bozulur.

## 15.2. Varyant türleri

Varyantlar kontrollü olarak şu alanlarda olabilir:
- visual variant
- tone
- size
- emphasis
- interaction mode
- selection state presentation
- layout density (çok dikkatli)

## 15.3. Kural

Varyant:
- tekrar eden anlamlı farkı temsil etmeli
- tasarım sistemi içinde meşru bir rol taşımalı
- tek screen için açılmamalı
- kombinasyon patlaması yaratmamalı

## 15.4. Zayıf varyant davranışları

- her görsel isteği yeni varyanta çevirmek
- `variant="custom"` gibi anlamsız kaçışlar
- bir component’i 12 varyantlı canavara dönüştürmek
- aynı farkı bazen `variant`, bazen `tone`, bazen `appearance` ile çözmek

---

# 16. Size Yönetimi

## 16.1. Kural

Size varyantları gerçek ergonomik veya hiyerarşik ihtiyacı temsil etmelidir.

## 16.2. Güçlü kullanım örnekleri

- compact / default / large
- sm / md / lg (ama anlamı belgeli olmalı)

## 16.3. Zayıf kullanım örnekleri

- `mini`, `smallish`, `big`, `huge`, `xl2`
- sırf görsel oynamak için sonsuz size ölçeği
- aynı size adının farklı component family’lerde başka şey ifade etmesi

---

# 17. Tone / Emphasis Yönetimi

## 17.1. Tone nedir?

Component’in semantik veya görsel tonudur.
Örnek:
- neutral
- accent
- success
- warning
- error

## 17.2. Emphasis nedir?

Bileşenin görsel ağırlık seviyesi.
Örnek:
- primary
- secondary
- tertiary
- ghost
- subtle

## 17.3. Kural

Tone ve emphasis birbirine karıştırılmamalıdır.
Örneğin:
- `error` semantik tondur
- `primary` görsel vurgu seviyesidir

## 17.4. Zayıf davranışlar

- tone ve variant sınırının belirsiz olması
- her bileşene her tone’u açmak
- component contract’ında sistem dışı ton isimleri kullanmak

---

# 18. State Contract

Her ciddi component için desteklenen durumlar açıkça düşünülmelidir.

## 18.1. Olası durumlar

- default
- hover
- focused
- pressed
- active
- selected
- checked
- expanded
- disabled
- readonly
- loading
- invalid
- success-emphasis (gerekiyorsa)

## 18.2. Kural

Desteklenen state’ler component contract’ında bilinçli olmalıdır.
State görünümü feature’a bırakılmamalıdır.

## 18.3. Zayıf davranışlar

- disabled state’i tanımsız bırakmak
- loading için ayrı component açmak
- error state’i ekran bazlı çözmek
- selected/focus davranışını component ailesine göre değiştirmek

---

# 19. Styling Kuralları

## 19.1. Token-first tüketim

Component’ler mümkün olduğunca:
- semantic token
- gerekirse context token
üzerinden stil almalıdır.

## 19.2. Hardcoded değer yasağı

Color, spacing, typography, radius, border ve motion kararları doğrudan component içine gömülmemelidir.
İstisna varsa kayıtlı olmalıdır.

## 19.3. Primitive bypass yasağı

Component kendi içinde primitive ve design system mantığını delmemelidir.

## 19.4. Zayıf davranışlar

- component içinde keyfi padding
- raw color kullanımı
- typography rolünü component içinde yeniden icat etmek
- token varken inline style ile çözmek

---

# 20. Accessibility Contract

Bir component erişilebilirlik açısından tamamlanmış sayılabilmesi için en az şu alanlar düşünülmelidir:

## 20.1. Semantic role
Bu şey buton mu, field mı, tab mı, dialog mu?

## 20.2. Accessible name
Kullanıcı yardımcı teknoloji ile ne duyacak?

## 20.3. State exposure
Selected, checked, expanded, disabled, invalid gibi bilgiler aktarılıyor mu?

## 20.4. Focus behavior
Klavye veya yardımcı teknoloji ile odak alıyor mu, görünür mü?

## 20.5. Keyboard/touch behavior
Beklenen etkileşim gerçekten kullanılabilir mi?

## 20.6. Touch target
Özellikle küçük interactive surfaces yeterli hit area taşıyor mu?

## 20.7. Error/helper bağlantısı
Field sınıfı component’lerde a11y relation doğru mu?

## 20.8. Kural

A11y component dışına bırakıldığında sistemik kalite kaybolur.

---

# 21. Motion Contract

## 21.1. Neden component konusu?

Çünkü button press, accordion expand, modal open, tabs switch gibi davranışlar component seviyesinde tekrar eder.

## 21.2. Kural

Component motion:
- sistem tokenlarıyla uyumlu olmalı
- reduced motion saygısı taşımalı
- state anlamı vermeli
- performansı bozmamalı

## 21.3. Zayıf davranışlar

- her component’in kendi animasyon süresini seçmesi
- feedback motion’un tutarsız olması
- reduced motion desteğinin component API dışında kalması

---

# 22. Component İçin Minimum Test Beklentisi

Her reusable component için test beklentisi aynı değildir.
Ama aşağıdaki alanlar güçlü adaydır:

## 22.1. Render and contract
- doğru variant/tone/size render davranışı
- disabled/loading/selected gibi state görünürlüğü

## 22.2. Interaction
- onPress/onChange benzeri temel etkileşim
- keyboard/focus davranışı (uygunsa)

## 22.3. A11y
- label/role/state exposure
- field helper/error ilişkisi (uygunsa)

## 22.4. Visual regression
Yüksek riskli ve çok varyantlı component ailelerinde düşünülebilir.

## 22.5. Zayıf davranışlar

- yalnızca snapshot
- sadece render oluyor testi
- reusable component contract’ını hiç doğrulamamak

---

# 23. Component Dokümantasyon Beklentisi

Her ciddi reusable component için en az şu bilgi görünür olmalıdır:

1. amacı
2. ne zaman kullanılır
3. ne zaman kullanılmaz
4. desteklenen variant/tone/size
5. a11y notları
6. state davranışları
7. örnek kullanım
8. varsa anti-pattern’ler
9. feature-specific alternatif sınırı

Bu bilgi formal katalogda, docs’ta veya component governance destek dosyasında bulunabilir.

---

# 24. Yeni Component Teklif Süreci

Yeni reusable component önerilirken en az şu sorular cevaplanmalıdır:

1. Bu component hangi tekrar eden ihtiyacı çözüyor?
2. Primitive veya mevcut component ile neden çözülemiyor?
3. `packages/ui` seviyesinde yaşaması neden doğru?
4. Beklenen variant ve state yüzeyi nedir?
5. A11y contract’ı nedir?
6. Hangi tokenlara dayanacak?
7. Hangi testler gerekir?
8. Hangi feature’lar bunu kullanacak?
9. Bu component aslında pattern mi, feature-specific composition mı?

---

# 25. Mevcut Component’i Genişletme Kuralları

## 25.1. Yeni prop eklemeden önce

- bu gerçekten sistemik ihtiyaç mı?
- mevcut variant/tone modeli ile çözülebilir mi?
- bu prop feature ihtiyacını kütüphaneye sızdırıyor mu?
- bu değişiklik tüm kullanıcıları etkiliyor mu?
- component basit kalıyor mu?

## 25.2. Ne zaman yeni component daha doğru olabilir?

- mevcut component çok anlam yüklendiyse
- yeni davranış farklı task/family ise
- API kırılmadan yeni yön taşınamıyorsa

## 25.3. Zayıf davranışlar

- her feature isteğinde aynı component’e yeni prop eklemek
- component’i “her şeyi yapan” hale getirmek
- eski prop’ları temizlemeden eklemeye devam etmek

---

# 26. Deprecation ve Cleanup Kuralları

## 26.1. Neden gerekir?

Component ailesi büyüdükçe yanlış abstraction’lar, duplicate parça ve eski varyantlar oluşabilir.

## 26.2. Kural

- duplicate component’ler temizlenmeli
- deprecated API’ler görünür işaretlenmeli
- migration notu gerekirse yazılmalı
- “eski ama duruyor” kültürü birikmemeli

## 26.3. Zayıf davranışlar

- `OldButton`, `LegacyButton`, `ButtonNew` gibi paralel yaşam
- deprecated component’i kaldırma planı olmadan bırakmak
- broken abstraction’ı sırf kullanılıyor diye sürdürmek

---

# 27. Bootstrap Component Seti — Başlangıç Primitive Seti (Tier 1 — Day 1)

## 27.1. Genel Bakış

Bu bölüm `packages/ui/primitives/` altında projenin ilk gününde oluşturulması zorunlu olan 12 primitive'i tanımlar. Bu primitive'ler tüm Tier 2 component'lerin temelidir; bunlar olmadan hiçbir üst katman component üretilemez. Primitive katmanı, design token tüketimini normalize eder, temel a11y contract'larını garanti altına alır ve platform (web/mobile) farklılıklarını alt seviyede soyutlar.

Bu listenin büyüklüğü kasıtlı olarak sınırlandırılmıştır. Primitive katmanında gereksiz abstraction açmak, component katmanının hareket alanını daraltır (bkz. Bölüm 6.4). Aşağıdaki 12 primitive, pratikte tüm UI component ailelerinin ortak paydası olarak tespit edilmiştir.

> **Cross-reference:** Bu primitive'lerin ekran bazlı kullanım şablonları ve component eşleştirmeleri için bkz. `39-default-screens-and-components-spec.md`.

## 27.2. Primitive Listesi

### 27.2.1. Text

Semantic metin render primitive'idir. Typography token'dan `fontSize`, `fontWeight`, `lineHeight` ve `letterSpacing` değerlerini tüketir. Web'de semantik `<span>` veya `<p>` çıktısı üretir; mobile'da `accessibilityRole="text"` taşır. Uygulamadaki tüm metin gösterimi bu primitive üzerinden yapılmalıdır; doğrudan React Native `<Text>` veya HTML `<span>` kullanımı yasaktır.

- **Tier:** Tier 1 — Day 1
- **Neden dahil:** Tüm component'ler metin render eder. Typography token disiplinini tek noktadan garanti altına almak gerekir.
- **Bağımlılıklar:** `22-design-tokens-spec.md` typography tokenları, tema context'i.
- **Dış kütüphane:** Yok.

### 27.2.2. Heading

`h1`–`h6` seviyelerinde semantic heading render eder. Typography token'dan `size` ve `weight` çeker; heading seviyesine göre `marginBottom` spacing token uygulayabilir. Web'de karşılık gelen HTML heading tag'i üretir (`<h1>`, `<h2>` vb.); mobile'da `accessibilityRole="header"` taşır. Screen reader sıralamasının doğru olması için heading seviyesi atlanmamalıdır.

- **Tier:** Tier 1 — Day 1
- **Neden dahil:** Semantic heading yapısı hem SEO hem a11y açısından temeldir. Heading'leri Text primitive'inin style override'ı ile çözmek semantic rol kaybına yol açar.
- **Bağımlılıklar:** Typography tokenları, Text primitive (isteğe bağlı internal compose).
- **Dış kütüphane:** Yok.

### 27.2.3. Box / Surface

Temel container primitive'idir. `backgroundColor`, `padding`, `margin`, `border`, `borderRadius` gibi visual token'ları tüketir. Tüm layout alanlarının ve görsel container'ların temelidir. `Surface` varyantı elevation/shadow token desteği ekler. Web'de `<div>` çıktısı üretir; mobile'da `<View>` karşılığıdır.

- **Tier:** Tier 1 — Day 1
- **Neden dahil:** Card, Banner, Modal body, Section gibi tüm alan tanımlayan component'ler Box/Surface üzerinde yükselir. Token tüketiminin normalize edilmesi için zorunludur.
- **Bağımlılıklar:** Spacing tokenları, color/surface tokenları, border/radius tokenları.
- **Dış kütüphane:** Yok.

### 27.2.4. Stack (VStack / HStack)

Flex-based layout primitive'idir. `VStack` dikey, `HStack` yatay dizilim sağlar. `gap` prop'u spacing token tüketir. `alignItems` ve `justifyContent` ayarları ile hizalama kontrol edilir. Tüm ardışık öğe dizilimlerinin standart çözümüdür; raw `flexDirection` + `marginBottom` pattern'i yerine kullanılmalıdır.

- **Tier:** Tier 1 — Day 1
- **Neden dahil:** Form alanları, liste satırları, buton grupları, header elemanları — hemen her layout Stack ile başlar. Gap token disiplinini enforce eder.
- **Bağımlılıklar:** Spacing tokenları (gap scale).
- **Dış kütüphane:** Yok.

### 27.2.5. Inline

Satır içi öğe dizimi primitive'idir. `wrap` ve `gap` token desteği sunar. Badge dizilimi, tag grubu, chip listesi, inline link serisi gibi wrap-capable yatay dizilimlerin çözümüdür. HStack'ten farkı: taşma durumunda alt satıra geçer (`flexWrap: "wrap"`).

- **Tier:** Tier 1 — Day 1
- **Neden dahil:** Tag, chip, badge gibi Tier 2 component'lerin grup kullanımı Inline olmadan tutarlı yapılamaz. Wrap + gap kombinasyonunun token disiplinli çözümüdür.
- **Bağımlılıklar:** Spacing tokenları (gap scale).
- **Dış kütüphane:** Yok.

### 27.2.6. Spacer

Flex boşluk veya sabit spacing token ile ayrım sağlayan primitive'dir. Flex modunda kalan alanı doldurur (`flex: 1`); sabit modda belirli bir spacing token değeri kadar boşluk bırakır. Layout elemanları arasında semantik olmayan ama görsel olarak gerekli boşlukları yönetir.

- **Tier:** Tier 1 — Day 1
- **Neden dahil:** Header'da logo ile menü arasındaki boşluk, form'da alanlar arası ayırma gibi pattern'ler Spacer olmadan ad-hoc margin/padding ile çözülür ve token disiplini bozulur.
- **Bağımlılıklar:** Spacing tokenları.
- **Dış kütüphane:** Yok.

### 27.2.7. Pressable

Dokunulabilir/tıklanabilir alan primitive'idir. Press feedback olarak opacity veya scale animasyonu uygular. Mobile'da haptic feedback desteği sunar (kütüphane: `expo-haptics`). `role="button"` a11y attribute'u taşır. Tüm tıklanabilir alanların temeli bu primitive'dir; Button, IconButton, Card (tıklanabilir varyant), ListItem (navigable) gibi component'ler Pressable üzerinde yükselir.

- **Tier:** Tier 1 — Day 1
- **Neden dahil:** Dokunma/tıklama etkileşimi uygulamanın en temel etkileşimidir. Press feedback, haptic ve a11y role davranışlarının her component'te ayrı ayrı uygulanması tutarsızlık üretir.
- **Bağımlılıklar:** Motion tokenları (press feedback süresi), `expo-haptics` (mobile haptic feedback).
- **Dış kütüphane:** `expo-haptics`.

### 27.2.8. Icon

SVG icon render primitive'idir. `size` ve `color` prop'ları design token tüketir. `accessibilityLabel` prop'u zorunludur; dekoratif icon'larda `accessibilityLabel=""` ile screen reader'dan gizlenir. Standart icon kütüphanesi `lucide-react-native` olarak belirlenmiştir. Custom SVG icon ihtiyacında da bu primitive üzerinden render yapılmalıdır.

- **Tier:** Tier 1 — Day 1
- **Neden dahil:** Icon kullanımı Button, ListItem, NavigationBar, TabBar, EmptyState gibi onlarca component'te tekrar eder. Size/color token uyumu ve a11y label zorunluluğunun tek noktadan garanti edilmesi gerekir.
- **Bağımlılıklar:** Color tokenları, size scale tokenları.
- **Dış kütüphane:** `lucide-react-native`.

### 27.2.9. Divider

Yatay veya dikey ayırıcı çizgi primitive'idir. `border` token'ından renk ve kalınlık alır. `orientation` prop'u ile yön belirlenir (`horizontal` | `vertical`). Liste satırları arası, form bölümleri arası, sidebar ile content arası gibi görsel ayrım noktalarında kullanılır.

- **Tier:** Tier 1 — Day 1
- **Neden dahil:** Ayırıcı çizgi hemen her ekranda tekrar eder. Border token disiplininin korunması ve görsel tutarlılığın sağlanması için primitive seviyesinde çözülmelidir.
- **Bağımlılıklar:** Border tokenları (color, width).
- **Dış kütüphane:** Yok.

### 27.2.10. ScrollContainer

ScrollView wrapper primitive'idir. Keyboard dismiss davranışını (`keyboardDismissMode`), pull-to-refresh (`refreshControl`) desteğini ve content inset yönetimini standartlaştırır. Uzun form ekranları, liste dışı scroll alanları ve genel content container'lar için temel sarmalayıcıdır.

- **Tier:** Tier 1 — Day 1
- **Neden dahil:** Scroll davranışı, keyboard dismiss ve refresh control pattern'leri her scroll ekranında tekrar eder. Bu davranışların her seferinde ayrı yapılandırılması tutarsızlık yaratır.
- **Bağımlılıklar:** SafeAreaContainer (content inset uyumu).
- **Dış kütüphane:** Yok (React Native core ScrollView wrapper).

### 27.2.11. SafeAreaContainer

Safe area inset yönetimi primitive'idir. iOS notch, Android status bar, bottom navigation bar gibi platform-specific güvenli alan hesaplamalarını soyutlar. Ekran container'larının kenar boşluklarını platform bağımsız hale getirir.

- **Tier:** Tier 1 — Day 1
- **Neden dahil:** Her ekran safe area inset'lerini doğru yönetmek zorundadır. Bu yönetimi primitive seviyesinde çözmek, ScreenContainer ve Header gibi Tier 2 component'lerin temelini oluşturur.
- **Bağımlılıklar:** Yok.
- **Dış kütüphane:** `react-native-safe-area-context`.

### 27.2.12. KeyboardAvoidingContainer

Keyboard açıldığında içerik alanının otomatik olarak kaymasını/küçülmesini sağlayan primitive'dir. Form ekranları, chat arayüzleri ve alt kısımda input bulunan tüm ekranlarda keyboard handling davranışını standartlaştırır.

- **Tier:** Tier 1 — Day 1
- **Neden dahil:** Keyboard handling, mobile UX'in en sık bozulan noktalarından biridir. Her ekranda farklı yaklaşım uygulanması ciddi tutarsızlık yaratır. Primitive seviyesinde çözülmesi zorunludur.
- **Bağımlılıklar:** SafeAreaContainer (inset koordinasyonu).
- **Dış kütüphane:** `react-native-keyboard-controller`.

---

# 28. Bootstrap Component Seti — Core Component Seti (Tier 2 — İlk 4 Hafta)

## 28.1. Genel Bakış

Bu bölüm, Tier 1 primitive'ler üzerine kurulan ve ilk çalışan ürün (MVP/alpha) için gereken 44 component'i 6 kategoride tanımlar. Bu component'ler `packages/ui/components/` altında yaşar ve Bölüm 10–14'teki governance kurallarına tabidir.

Her component için ad, kategori, kullanılan dış kütüphane (varsa), hangi primitive veya başka component'e bağımlı olduğu ve kısa açıklama sunulmuştur. Bir component'in bu listeye girmesi, Bölüm 10'daki kriterlerin tümünü karşıladığı anlamına gelir: tekrar eden bir UI rolü çözer, feature bağımsızdır, API'si sade ve tanımlanabilirdir.

> **Cross-reference:** Bu component'lerin ekran bazlı kullanım haritası ve default screen composition'ları için bkz. `39-default-screens-and-components-spec.md`.

## 28.2. Form & Action (12 Component)

### 28.2.1. Button

Birincil etkileşim component'idir. `variant` (filled, outlined, ghost, text), `tone` (neutral, accent, error), `size` (sm, md, lg), `emphasis` (primary, secondary, tertiary) prop'ları sunar. `loading` state'inde spinner gösterir ve etkileşimi devre dışı bırakır. `disabled` state görsel ve a11y uyumludur. Tüm kullanıcı aksiyonlarının giriş noktasıdır.

- **Bağımlılıklar:** Pressable, Text, Icon (sol/sağ icon desteği), Spinner (loading state).
- **Dış kütüphane:** Yok.

### 28.2.2. IconButton

Sadece icon içeren compact buton component'idir. Label olmadığı için `accessibilityLabel` prop'u zorunludur. Toolbar, header action, inline action gibi alanlarda kullanılır. Button ile aynı `tone` ve `size` sistemini paylaşır ancak ayrı component olarak yaşar çünkü API yüzeyi farklıdır (label yerine icon-only).

- **Bağımlılıklar:** Pressable, Icon.
- **Dış kütüphane:** Yok.

### 28.2.3. TextField

Tek satır metin girişi component'idir. FieldShell üzerine kurulur; label, placeholder, helper text, error message, character count desteği sunar. `variant` (outlined, filled), `state` (default, focused, error, disabled, readonly) yönetimi taşır. Keyboard type, autoComplete, secure text entry gibi native davranışları prop olarak sunar.

- **Bağımlılıklar:** FieldShell, Text, Icon (trailing/leading icon).
- **Dış kütüphane:** Yok.

### 28.2.4. TextArea

Çok satırlı metin girişi component'idir. TextField ile aynı FieldShell altyapısını kullanır ancak çok satırlı input davranışı, auto-grow ve max height desteği ekler. Uzun form alanları, yorum kutuları, açıklama alanları için kullanılır.

- **Bağımlılıklar:** FieldShell, Text.
- **Dış kütüphane:** Yok.

### 28.2.5. SearchField

Arama girişi component'idir. Sol tarafta arama icon'u, sağ tarafta clear button, debounce desteği ve arama state yönetimi sunar. TextField'den farklıdır çünkü arama davranışına özel UX pattern'leri taşır: clear on focus, cancel action (mobile), instant feedback.

- **Bağımlılıklar:** FieldShell, Icon, IconButton (clear), Pressable.
- **Dış kütüphane:** Yok.

### 28.2.6. Checkbox

İkili seçim (checked/unchecked) veya üçlü seçim (checked/unchecked/indeterminate) component'idir. Label ile birlikte render edilir. `accessibilityRole="checkbox"` ve `accessibilityState` yönetimi taşır. Grup kullanımında FormGroup ile sarmalanır.

- **Bağımlılıklar:** Pressable, Text, Icon (check/indeterminate icon).
- **Dış kütüphane:** Yok.

### 28.2.7. Radio

Tek seçim grubu elemanı component'idir. Radyo grubu içinde yalnızca bir seçenek aktif olabilir. `accessibilityRole="radio"` taşır. Görsel olarak seçili/seçilmemiş/devre dışı state'leri destekler. Grup yönetimi FormGroup üzerinden yapılır.

- **Bağımlılıklar:** Pressable, Text.
- **Dış kütüphane:** Yok.

### 28.2.8. Switch

Açma/kapama toggle component'idir. Boolean değer kontrolü sunar. Label ile birlikte satır halinde render edilir. `accessibilityRole="switch"` ve `accessibilityState.checked` yönetimi taşır. Ayarlar ekranları ve boolean tercih satırları için temel component'tir.

- **Bağımlılıklar:** Pressable, Text.
- **Dış kütüphane:** Yok.

### 28.2.9. Select

Açılır liste seçim component'idir. Web'de native `<select>` veya custom dropdown; mobile'da BottomSheet veya platform native picker ile çalışır. Placeholder, seçili değer gösterimi, hata state'i, disabled state desteği sunar. FieldShell üzerine kuruludur.

- **Bağımlılıklar:** FieldShell, Text, Icon (chevron), BottomSheet (mobile).
- **Dış kütüphane:** Yok (mobile'da BottomSheet component'ine delegasyon).

### 28.2.10. FieldShell

Form alanı sarmalayıcı component'idir. Label, helper text, error message, character count gibi form field etrafındaki ortak elemanları barındırır. TextField, TextArea, SearchField, Select gibi tüm input component'lerinin dış kabuğudur. `accessibilityDescribedBy` ilişkisini otomatik kurar.

- **Bağımlılıklar:** Text, VStack, Box.
- **Dış kütüphane:** Yok.

### 28.2.11. FormGroup

Birden fazla form alanını semantik olarak gruplayıp ortak label ve helper text sunan component'tir. Radio grubu, checkbox grubu ve ilişkili alan kümeleri için kullanılır. `accessibilityRole="group"` ve `accessibilityLabel` yönetimi taşır.

- **Bağımlılıklar:** VStack, Text, Divider (opsiyonel ayırıcı).
- **Dış kütüphane:** Yok.

### 28.2.12. FormActions

Form'un alt kısmında yer alan aksiyon butonları bölgesidir. Submit, cancel, reset gibi butonları standart layout ve spacing ile düzenler. Sticky footer davranışı opsiyonel olarak desteklenir. Form flow'larındaki buton düzenini tutarlı kılar.

- **Bağımlılıklar:** HStack, Button, StickyFooter (opsiyonel).
- **Dış kütüphane:** Yok.

## 28.3. Veri Gösterimi (7 Component)

### 28.3.1. Avatar

Kullanıcı veya varlık fotoğrafı/baş harf gösterimi component'idir. Yuvarlak veya yuvarlatılmış kare biçimde render edilir. Fotoğraf yükleme başarısız olduğunda fallback olarak baş harf (initials) gösterir. `size` varyantları sunar (xs, sm, md, lg, xl). Performanslı image loading için `expo-image` kütüphanesi kullanılır.

- **Bağımlılıklar:** Box, Text (initials fallback).
- **Dış kütüphane:** `expo-image`.

### 28.3.2. Badge

Sayısal veya metin bilgisi taşıyan küçük etiket component'idir. Bildirim sayısı, durum etiketi, yeni/güncellendi işareti gibi bağlamlarda kullanılır. `tone` (neutral, accent, success, warning, error) ve `size` (sm, md) varyantları sunar. Genellikle başka bir component'in (Avatar, Icon, ListItem) üzerinde veya yanında konumlanır.

- **Bağımlılıklar:** Box, Text.
- **Dış kütüphane:** Yok.

### 28.3.3. Chip / Tag

Kategori, filtre, etiket gibi seçilebilir/kaldırılabilir bilgi parçası component'idir. Badge'den farkı: etkileşimlidir (seçilebilir, kaldırılabilir). `selected`, `disabled` state'leri destekler. Sağ tarafta remove icon bulunabilir. Inline primitive ile grup halinde dizilir.

- **Bağımlılıklar:** Pressable, Text, Icon (remove icon), Inline (grup dizilimi).
- **Dış kütüphane:** Yok.

### 28.3.4. Card

İçerik gruplama ve görsel ayrıştırma container component'idir. Surface primitive'i üzerine kuruludur; elevation/shadow, border, radius token'ları tüketir. Tıklanabilir varyantı Pressable ile sarmalanır. Header, body, footer slot'ları sunar. Liste kartı, dashboard özet kutusu, bilgi paneli gibi yaygın kullanım alanları vardır.

- **Bağımlılıklar:** Surface (Box varyantı), Pressable (tıklanabilir varyant), VStack, Text, Heading.
- **Dış kütüphane:** Yok.

### 28.3.5. ListItem

Tek satır liste elemanı component'idir. Sol tarafta icon veya avatar, ortada başlık + alt başlık, sağ tarafta trailing element (icon, badge, switch, chevron) yapısındadır. Tıklanabilir ve navigable varyantları Pressable üzerine kuruludur. Swipe action desteği opsiyoneldir.

- **Bağımlılıklar:** Pressable, HStack, VStack, Text, Icon, Avatar (opsiyonel), Divider (separator).
- **Dış kütüphane:** Yok.

### 28.3.6. SectionHeader

Liste veya içerik bölümlerinin başlık satırı component'idir. Bölüm başlığı, opsiyonel action link ("Tümünü gör" vb.) ve alt açıklama sunar. Ayarlar ekranları, profil detayları, dashboard bölümleri gibi gruplama noktalarında kullanılır.

- **Bağımlılıklar:** HStack, Text, Heading, Pressable (action link).
- **Dış kütüphane:** Yok.

### 28.3.7. KeyValueRow

Anahtar-değer çifti gösterimi component'idir. Sol tarafta label (anahtar), sağ tarafta value (değer) yapısındadır. Profil detay satırları, sipariş özeti, ayar bilgisi gibi yatay etiket-değer dizilimlerinde kullanılır. Kopyalanabilir value ve tıklanabilir (navigable) varyantları mevcuttur.

- **Bağımlılıklar:** HStack, Text, Pressable (tıklanabilir varyant), Icon (copy/chevron).
- **Dış kütüphane:** Yok.

## 28.4. Feedback (8 Component)

### 28.4.1. Toast

Geçici bildirim mesajı component'idir. Ekranın üst veya alt kısmında belirli süre görünür ve otomatik kaybolur. `tone` (success, error, warning, info) desteği sunar. Web'de `sonner` kütüphanesi üzerinden render edilir; mobile'da custom implementation ile `react-native-reanimated` animasyonları kullanılır. Dismiss action ve opsiyonel CTA desteği vardır.

- **Bağımlılıklar:** Box, HStack, Text, Icon, IconButton (dismiss).
- **Dış kütüphane:** Web: `sonner` / Mobile: `react-native-reanimated` (custom).

### 28.4.2. Banner

Kalıcı veya kullanıcı tarafından kapatılabilir bilgi/uyarı şeridi component'idir. Toast'tan farkı: sayfa içinde sabit konumda durur ve otomatik kaybolmaz. `tone` (info, success, warning, error) ve dismiss action desteği sunar. Sistem uyarıları, promosyon bildirimleri, bakım duyuruları için kullanılır.

- **Bağımlılıklar:** Box, HStack, Text, Icon, IconButton (dismiss).
- **Dış kütüphane:** Yok.

### 28.4.3. Skeleton

İçerik yüklenirken gösterilen placeholder shimmer component'idir. Gerçek içeriğin yerleşimini taklit eden gri bloklar halinde render edilir. Shimmer animasyonu `react-native-reanimated` ile sağlanır. `variant` (text, circle, rect) ve `size` prop'ları ile farklı içerik türlerini taklit eder. Kullanıcıya "içerik geliyor" mesajını spinner'dan daha iyi iletir.

- **Bağımlılıklar:** Box.
- **Dış kütüphane:** `react-native-reanimated` (shimmer animasyonu).

### 28.4.4. Spinner

Yükleme göstergesi component'idir. Dönen animasyonlu loading indicator sunar. `size` (sm, md, lg) ve `color` (token-based) prop'ları vardır. Button loading state'inde, tam ekran yükleme overlay'inde ve inline yükleme gösteriminde kullanılır. `accessibilityLabel` ile yükleme durumunu screen reader'a bildirir.

- **Bağımlılıklar:** Box (container).
- **Dış kütüphane:** Yok (React Native Animated veya reanimated).

### 28.4.5. ProgressBar

İlerleme göstergesi component'idir. Belirli (determinate) ve belirsiz (indeterminate) modları destekler. `value` (0-100), `tone` (neutral, accent, success, warning, error) prop'ları sunar. Dosya yükleme, profil tamamlama, onboarding ilerleme gibi senaryolarda kullanılır. `accessibilityRole="progressbar"` ve `accessibilityValue` yönetimi taşır.

- **Bağımlılıklar:** Box.
- **Dış kütüphane:** Yok.

### 28.4.6. EmptyState

Veri olmadığında gösterilen durum component'idir. Illustration/icon, başlık, açıklama ve opsiyonel CTA butonu sunar. Liste boş, arama sonuç yok, henüz içerik oluşturulmamış gibi senaryolarda kullanılır. Boş durumların her ekranda ad-hoc çözülmesini engeller; tutarlı boş durum deneyimi sağlar.

- **Bağımlılıklar:** VStack, Icon, Heading, Text, Button (opsiyonel CTA).
- **Dış kütüphane:** Yok.

### 28.4.7. ErrorState

Hata durumunda gösterilen component'tir. Hata icon'u/illustration, hata başlığı, hata açıklaması ve retry butonu sunar. API hatası, network hatası, beklenmeyen hata gibi senaryolarda kullanılır. EmptyState ile benzer yapıda ancak semantik olarak hata odaklıdır ve retry action'ı varsayılan olarak taşır.

- **Bağımlılıklar:** VStack, Icon, Heading, Text, Button (retry CTA).
- **Dış kütüphane:** Yok.

### 28.4.8. LoadingState

Tam ekran veya bölge bazlı yükleme durumu component'idir. Spinner veya skeleton grubu ile birlikte opsiyonel mesaj sunar. İlk veri yüklemesi, ekran geçişi sırasında yükleme gibi senaryolarda kullanılır. Spinner tek başına yeterli olmadığında, daha zengin yükleme deneyimi sağlar.

- **Bağımlılıklar:** VStack, Spinner, Skeleton (opsiyonel), Text.
- **Dış kütüphane:** Yok.

## 28.5. Navigasyon (7 Component)

### 28.5.1. Header / NavigationBar

Ekran üst başlık çubuğu component'idir. Geri butonu, ekran başlığı, sağ taraftaki action butonları gibi standart navigation bar elemanlarını barındırır. SafeAreaContainer ile safe area inset uyumlu çalışır. Platform-specific davranışlar (iOS large title, Android elevation) desteklenebilir.

- **Bağımlılıklar:** SafeAreaContainer, HStack, Text, Heading, IconButton (back, actions), Pressable.
- **Dış kütüphane:** Yok (React Navigation header ile entegre edilebilir).

### 28.5.2. TabBar

Alt navigasyon sekmesi component'idir. React Navigation'ın `createBottomTabNavigator` yapısıyla entegre çalışır. Aktif/pasif state görünümü, badge desteği, icon + label yapısı sunar. `accessibilityRole="tab"` ve `accessibilityState.selected` yönetimi taşır.

- **Bağımlılıklar:** SafeAreaContainer, Pressable, Icon, Text, Badge (opsiyonel bildirim).
- **Dış kütüphane:** `@react-navigation/bottom-tabs` (React Navigation entegrasyonu).

### 28.5.3. BottomSheet

Ekranın alt kısmından yukarı süzülen modal panel component'idir. Gesture-based sürükleme, snap noktaları, backdrop ve dismiss davranışları sunar. Select dropdown (mobile), filtre paneli, detay paneli, aksiyon menüsü gibi yaygın kullanım alanları vardır. Keyboard handling ve scroll iç içe geçme desteği kritiktir.

- **Bağımlılıklar:** SafeAreaContainer, Box, Pressable (backdrop).
- **Dış kütüphane:** `@gorhom/bottom-sheet`.

### 28.5.4. Modal / Dialog

Merkezi dialog component'idir. Backdrop, başlık, içerik alanı ve aksiyon butonları yapısındadır. Focus trap, keyboard escape dismiss ve `accessibilityRole="dialog"` yönetimi taşır. Bilgi dialogları, form dialogları, onay dialogları için temeldir. ConfirmDialog bu component'in özelleşmiş varyantıdır.

- **Bağımlılıklar:** Box, Surface, Heading, Text, Button, Pressable (backdrop).
- **Dış kütüphane:** Yok.

### 28.5.5. ConfirmDialog

Onay isteyen aksiyonlar için özelleşmiş dialog component'idir. Modal/Dialog üzerine kuruludur; başlık, mesaj, onay butonu ve iptal butonu standart olarak sunar. Silme, çıkış, geri alma gibi destructive veya geri dönüşü olmayan aksiyonlarda kullanılır. Destructive varyantında onay butonu `tone="error"` ile render edilir.

- **Bağımlılıklar:** Modal/Dialog, Button, Text, Heading.
- **Dış kütüphane:** Yok.

### 28.5.6. ActionSheet

Aksiyon listesi sunan alt panel component'idir. Mobile'da BottomSheet içinde, web'de dropdown/popover olarak render edilebilir. Her satır bir aksiyon temsil eder (icon + label). Destructive aksiyon `tone="error"` ile işaretlenir. Uzun basma, üç nokta menüsü gibi bağlamsal aksiyon senaryolarında kullanılır.

- **Bağımlılıklar:** BottomSheet (mobile), Popover (web alternatif), ListItem, Icon, Text, Pressable.
- **Dış kütüphane:** Yok (BottomSheet bağımlılığı dolaylı olarak `@gorhom/bottom-sheet`).

### 28.5.7. Drawer (Web)

Web platformunda yan navigasyon paneli component'idir. Sidebar menü, navigasyon ağacı, filtre paneli gibi kullanım alanları vardır. Açılır/kapanır animasyon, overlay backdrop, responsive davranış (mobilde tam ekran, desktop'ta sidebar) destekler. Mobile native'de genellikle BottomSheet veya stack navigation ile karşılanır.

- **Bağımlılıklar:** Box, Surface, Pressable (backdrop), SafeAreaContainer.
- **Dış kütüphane:** Yok.

## 28.6. Layout (4 Component)

### 28.6.1. ScreenContainer

Ekran seviyesi sarmalayıcı component'tir. SafeAreaContainer, ScrollContainer ve opsiyonel KeyboardAvoidingContainer'ı birleştirerek standart ekran yapısını sağlar. Background color (theme token), safe area inset yönetimi, scroll davranışı ve keyboard handling'i tek component'te paketler. Tüm ekranların en dış sarmalayıcısı olmalıdır.

- **Bağımlılıklar:** SafeAreaContainer, ScrollContainer, KeyboardAvoidingContainer (opsiyonel), Box.
- **Dış kütüphane:** Yok.

### 28.6.2. PullToRefreshWrapper

Pull-to-refresh davranışını saran component'tir. ScrollContainer veya FlatList etrafında kullanılır. Refresh indicator gösterimi, loading state yönetimi ve callback prop'u sunar. Liste ekranları, feed ekranları, dashboard'lar gibi veri yenileme gerektiren ekranlarda kullanılır.

- **Bağımlılıklar:** ScrollContainer.
- **Dış kütüphane:** Yok (React Native RefreshControl wrapper).

### 28.6.3. InfiniteScrollList

Sonsuz kaydırma destekli liste component'idir. FlatList/FlashList üzerine kuruludur. Sayfa sonu algılama, sonraki sayfa yükleme, footer loading indicator ve "daha fazla yok" durumu yönetir. Performans kritik listelerde `@shopify/flash-list` kullanılabilir. Pagination API'leri ile standart entegrasyon sağlar.

- **Bağımlılıklar:** Spinner (footer loading), Text ("sonuç yok" mesajı).
- **Dış kütüphane:** `@shopify/flash-list` (performans gerektiğinde).

### 28.6.4. StickyFooter

Ekranın alt kısmına sabitlenmiş footer component'idir. Form submit butonları, aksiyon çubuğu, fiyat özeti + satın al gibi scroll'dan bağımsız kalması gereken alt bölgeler için kullanılır. SafeAreaContainer ile bottom inset uyumu sağlar. Keyboard açıldığında davranışı KeyboardAvoidingContainer ile koordine edilir.

- **Bağımlılıklar:** SafeAreaContainer, Box, HStack.
- **Dış kütüphane:** Yok.

## 28.7. Overlay / Utility (6 Component)

### 28.7.1. Tooltip

Hover veya long press ile bilgi balonu gösteren component'tir. Kısa açıklama metni sunar; karmaşık içerik taşımaz. Web'de hover trigger, mobile'da long press trigger ile aktifleşir. `accessibilityRole="tooltip"` yönetimi taşır. Konumu otomatik hesaplanır (üst, alt, sol, sağ).

- **Bağımlılıklar:** Box, Text, Pressable (trigger sarmalayıcı).
- **Dış kütüphane:** Yok.

### 28.7.2. Popover

Bir trigger elemanına bağlı açılır içerik paneli component'idir. Tooltip'ten daha zengin içerik taşıyabilir: butonlar, listeler, formlar. Konum hesaplama, dışına tıklayarak kapatma ve focus trap desteği sunar. Web'de dropdown menü, bilgi paneli gibi kullanım alanları vardır.

- **Bağımlılıklar:** Box, Surface, Pressable (trigger ve backdrop).
- **Dış kütüphane:** Yok.

### 28.7.3. ErrorBoundary

React error boundary component'idir. Alt ağaçtaki JavaScript hatalarını yakalar ve fallback UI gösterir. Hata detayı loglama, retry action ve graceful degradation sağlar. Her kritik bölüm (screen, widget, data section) ErrorBoundary ile sarmalanmalıdır. `react-error-boundary` kütüphanesi kullanılarak uygulanır.

- **Bağımlılıklar:** ErrorState (fallback UI).
- **Dış kütüphane:** `react-error-boundary`.

### 28.7.4. AuthGuard

Kimlik doğrulama gerektiren alanları saran utility component'tir. Kullanıcı oturum açmamışsa login ekranına yönlendirir veya auth prompt gösterir. Route seviyesinde veya component seviyesinde kullanılabilir. Auth state context'i tüketir; kendi auth logic'i barındırmaz, yalnızca guard görevi görür.

- **Bağımlılıklar:** LoadingState (auth durumu kontrol edilirken).
- **Dış kütüphane:** Yok (auth state yönetimi feature katmanında kalır).

### 28.7.5. SkipToContent (Web)

Web platformunda keyboard ve screen reader kullanıcılarının navigasyonu atlayıp doğrudan ana içeriğe geçmesini sağlayan a11y utility component'idir. Sayfa yüklendiğinde gizlidir; Tab tuşu ile focus aldığında görünür hale gelir. WCAG 2.4.1 "Bypass Blocks" başarı kriterini karşılar.

- **Bağımlılıklar:** Pressable, Text.
- **Dış kütüphane:** Yok.

### 28.7.6. ConsentBanner (Web)

Web platformunda çerez/izleme onay banner'ı component'idir. GDPR, KVKK gibi veri gizliliği düzenlemelerine uyum için kullanılır. Kabul, reddet ve tercihleri yönet aksiyonları sunar. Banner konumu (alt veya tam ekran overlay) ayarlanabilir. Onay durumu persistence'ı feature katmanında yönetilir; component yalnızca UI katmanını sağlar.

- **Bağımlılıklar:** Box, Surface, Text, Button, HStack.
- **Dış kütüphane:** Yok.

---

# 29. Bootstrap Component Seti — İleri Aşama Component Adayları (İhtiyaç Doğduğunda)

## 29.1. Genel Bakış

Bu bölüm, bootstrap setine (Tier 1 ve Tier 2) dahil olmayan ancak belirli feature'lar için büyük olasılıkla gerekecek 14 component'i listeler. Bu bileşenler "shared-by-proof" ilkesiyle yönetilir: feature içinde implement edilir, gerçek tekrar kanıtlandığında `packages/ui`'ya taşınır. Erken soyutlama yapılmaz.

Bu bileşenlerden herhangi birini `packages/ui`'ya taşımak için Bölüm 10'daki "Yeni Component Açma Kriteri" ve Bölüm 24'teki "Yeni Component Teklif Süreci" uygulanmalıdır.

> **Cross-reference:** Bu aday component'lerin olası ekran eşleştirmeleri ve kullanım senaryoları için bkz. `39-default-screens-and-components-spec.md`.

## 29.2. Aday Component Listesi

### 29.2.1. DatePicker / TimePicker

Tarih ve/veya saat seçim component'idir. Randevu, etkinlik, hatırlatıcı gibi zaman tabanlı giriş gerektiren feature'larda ihtiyaç duyulur. Takvim görünümü, saat tekerleği ve locale desteği gerektirir.

- **Ne zaman gerekir:** Tarih/saat girişi gerektiren ilk feature (rezervasyon, takvim, hatırlatıcı) geliştirildiğinde.
- **Tahmini kütüphane:** `react-native-date-picker` veya `@react-native-community/datetimepicker`.

### 29.2.2. StepIndicator / Stepper

Çok adımlı akışlarda ilerleme gösteren component'tir. Onboarding, sipariş tamamlama, profil kurulumu gibi wizard-style flow'larda ihtiyaç duyulur. Aktif adım, tamamlanmış adım ve bekleyen adım görsel state'lerini yönetir.

- **Ne zaman gerekir:** İlk multi-step wizard akışı tasarlandığında (onboarding, checkout, kayıt adımları).
- **Tahmini kütüphane:** Yok (custom, Tier 1 primitive'ler üzerine).

### 29.2.3. Accordion / Collapsible

Açılır-kapanır içerik bölümü component'idir. SSS, ayar kategorileri, detay açılımı gibi alan tasarrufu gerektiren senaryolarda ihtiyaç duyulur. Animated expand/collapse ve `accessibilityState.expanded` yönetimi taşır.

- **Ne zaman gerekir:** SSS sayfası, ayarlar detay bölümleri veya nested bilgi alanları implement edildiğinde.
- **Tahmini kütüphane:** `react-native-reanimated` (animasyon), custom implementation.

### 29.2.4. SegmentedControl

Aynı alan içinde iki veya daha fazla görünüm arasında geçiş sağlayan component'tir. Tab'dan farkı: aynı içerik alanında farklı filtre veya görünüm modu sunar. iOS native segmented control benzeri görünüm ve davranıştadır.

- **Ne zaman gerekir:** Aynı ekranda birden fazla veri görünümü veya filtre modu gerektiğinde (liste/grid geçişi, dönem filtresi).
- **Tahmini kütüphane:** Yok (custom, Pressable + Animated üzerine).

### 29.2.5. Slider / RangeSlider

Sayısal değer veya aralık seçim component'idir. Fiyat filtresi, ses seviyesi, mesafe ayarı gibi sürekli değer aralığı gerektiren senaryolarda kullanılır. Tek nokta (Slider) ve çift nokta (RangeSlider) varyantları mevcuttur.

- **Ne zaman gerekir:** Aralık bazlı filtreleme veya ayar (fiyat aralığı, mesafe, yoğunluk) implement edildiğinde.
- **Tahmini kütüphane:** `@react-native-community/slider` veya custom gesture handler.

### 29.2.6. PasswordField

Şifre girişi için özelleşmiş input component'idir. TextField üzerine kuruludur; göster/gizle toggle, şifre gücü göstergesi ve güvenlik best practice'leri taşır. Login ve kayıt akışları için gerekir.

- **Ne zaman gerekir:** Authentication akışı (login, register, şifre değiştirme) implement edildiğinde.
- **Tahmini kütüphane:** Yok (TextField + custom logic).

### 29.2.7. PhoneInput

Telefon numarası girişi component'idir. Ülke kodu seçimi, flag gösterimi, nuara format maskeleme ve validation sunar. Kayıt akışı, telefon doğrulama, iletişim bilgisi girişi için gerekir.

- **Ne zaman gerekir:** Telefon numarası girişi gerektiren ilk akış (kayıt, OTP doğrulama) implement edildiğinde.
- **Tahmini kütüphane:** `react-native-phone-number-input` veya custom mask implementation.

### 29.2.8. CountdownTimer

Geri sayım göstergesi component'idir. OTP süre sınırı, kampanya bitiş süresi, oturum zaman aşımı gibi zamanlı senaryolarda kullanılır. Süre dolduğunda callback tetikler.

- **Ne zaman gerekir:** OTP doğrulama, zamanlı kampanya veya oturum timeout mekanizması implement edildiğinde.
- **Tahmini kütüphane:** Yok (custom, React state + interval).

### 29.2.9. WebView

Web içeriğini native uygulama içinde gösteren component'tir. Yasal metinler, harici içerik, ödeme sayfaları, embed içerik gibi web tabanlı sayfa gösterimi gerektiren senaryolarda kullanılır. Navigation, loading state ve error handling yönetimi taşır.

- **Ne zaman gerekir:** Uygulama içinde web sayfası gösterimi gerektiren ilk senaryo (KVKK metni, ödeme gateway, harici link) oluştuğunda.
- **Tahmini kütüphane:** `react-native-webview`.

### 29.2.10. DividerWithLabel

Ortasında metin etiketi bulunan ayırıcı component'tir. "veya", "ya da", bölüm adı gibi metin taşıyan görsel ayırıcı. Login ekranında "veya sosyal medya ile giriş yap" gibi kullanım alanları vardır.

- **Ne zaman gerekir:** "veya" ayırıcılı akış (login alternatifleri, bölüm ayırma) tasarlandığında.
- **Tahmini kütüphane:** Yok (Divider + Text primitive compose).

### 29.2.11. CookieConsentBanner (Web)

ConsentBanner'ın daha detaylı, çerez kategorisi bazlı yönetim sunan varyantıdır. Zorunlu, analitik, pazarlama çerez kategorileri için ayrı tercih seçenekleri sunar. GDPR tam uyumluluk için gerekir.

- **Ne zaman gerekir:** Detaylı çerez kategori yönetimi ve granüler kullanıcı tercihi zorunluluğu oluştuğunda (AB pazarı hedefi).
- **Tahmini kütüphane:** Yok (ConsentBanner component'i üzerine genişletme).

### 29.2.12. NetworkStatusBanner

İnternet bağlantısı durumunu gösteren banner component'idir. Çevrimdışı durumu, zayıf bağlantı uyarısı ve bağlantı geri geldiğinde bildirim sunar. Offline-first veya bağlantı bağımlı uygulamalarda gerekir.

- **Ne zaman gerekir:** Offline modu, bağlantı durumu takibi veya optimistic update stratejisi implement edildiğinde.
- **Tahmini kütüphane:** `@react-native-community/netinfo` (bağlantı durumu algılama).

### 29.2.13. ForceUpdateScreen

Uygulama güncellemesinin zorunlu olduğu durumlarda gösterilen tam ekran component'tir. Minimum versiyon kontrolü başarısız olduğunda kullanıcıyı store'a yönlendirir. Uygulama kullanımını engeller ve güncelleme CTA'sı sunar.

- **Ne zaman gerekir:** App store versiyon kontrolü ve zorunlu güncelleme mekanizması implement edildiğinde.
- **Tahmini kütüphane:** Yok (Linking API + custom screen).

### 29.2.14. AppLockScreen

Uygulama kilidi / biyometrik doğrulama ekranı component'idir. PIN girişi, Face ID / Touch ID, arka plana atıldığında kilitlenme gibi güvenlik senaryolarında kullanılır. Hassas veri barındıran uygulamalarda gerekir.

- **Ne zaman gerekir:** Biyometrik kimlik doğrulama, PIN kilidi veya uygulama güvenlik katmanı implement edildiğinde.
- **Tahmini kütüphane:** `expo-local-authentication` (biyometrik), `expo-secure-store` (PIN depolama).

---

# 30. Component Anti-Pattern Listesi

Aşağıdaki davranışlar bu proje kapsamında zayıf kabul edilir:

1. Her tekrar eden UI parçasını reusable sanmak
2. Feature-specific UI’yı erkenden `packages/ui` içine taşımak
3. Primitive ile component sınırını karıştırmak
4. API’yi prop çöplüğüne çevirmek
5. Varyant sayısını kontrolsüz büyütmek
6. Tone, variant, appearance, state kavramlarını karıştırmak
7. Hardcoded stil değerlerini component içine gömmek
8. Raw token/palette tüketimini yaymak
9. A11y contract’ını ekran implementasyonuna bırakmak
10. Loading/disabled/error state’leri tanımsız bırakmak
11. Testsiz reusable component üretmek
12. Dokümansız component ailesi büyütmek
13. Duplicate component’leri temizlememek
14. Motion ve focus davranışını component dışında çözmek
15. Escape hatch’leri sınırsız bırakmak

---

# 31. Component Kararı Verirken Sorulacak Sorular

Bir component açarken veya değiştirirken şu sorular sorulmalıdır:

1. Bu primitive mi, component mi, pattern mi, yoksa feature-specific UI mı?
2. Gerçekten reuse değeri var mı?
3. Bu `packages/ui` içinde yaşamalı mı?
4. API sade ve anlamlı mı?
5. Varyantlar sistemik mi, keyfi mi?
6. A11y contract’ı açık mı?
7. Token ve theme ile doğal çalışıyor mu?
8. State yüzeyi net mi?
9. Test yüzeyi yeterince görünür mü?
10. Bu abstraction sistemi sadeleştiriyor mu, yoksa karmaşıklaştırıyor mu?

---

# 32. Sonraki Dokümanlara Etkisi

## 32.1. Motion and interaction standard
`24-motion-and-interaction-standard.md`, component seviyesindeki interaction ve motion contract’larını bu belgeye göre detaylandırmalıdır.

## 32.2. Error / empty / loading states
`25-error-empty-loading-states.md`, reusable feedback surfaces ve state component’lerini bu governance modeline göre tanımlamalıdır.

## 32.3. Contribution guide
`30-contribution-guide.md`, yeni component teklifi ve mevcut component değişikliği sürecini bu belgeye göre operasyonelleştirmelidir.

## 32.4. Audit checklist
`31-audit-checklist.md`, component API şişmesi, hardcoded stil kaçakları, a11y eksikleri ve duplicate component risklerini bu belgeye göre denetlemelidir.

## 32.5. Definition of done
`32-definition-of-done.md`, reusable component işlerinin done sayılması için minimum contract/test/a11y beklentilerini bu belgeye göre bağlamalıdır.

## 32.6. ADR-007 styling kararları
`ADR-007-styling-tokens-and-theming-implementation.md`: ADR-007, component styling contract'larının canonical karar otoritesidir. Bu belgedeki token-first tüketim, hardcoded değer yasağı ve styling kuralları, ADR-007'deki implementasyon kararlarıyla birlikte uygulanmalıdır.

## 32.7. Default screens and components spec
`39-default-screens-and-components-spec.md`, bu belgedeki bootstrap component setinin (Bölüm 27, 28, 29) ekran bazlı kullanım haritasını, component-screen eşleştirmelerini ve default composition şablonlarını tanımlamalıdır. Tier 1 primitive'lerin ve Tier 2 component'lerin hangi ekranlarda nasıl kullanılacağı bu belgeyle birlikte değerlendirilmelidir.

---

# 33. Onay Kriterleri

Bu doküman yeterli kabul edilir eğer:

1. Primitive / component / pattern / feature-specific UI ayrımı netse,
2. Yeni component açma kriterleri açıkça tanımlanmışsa,
3. Component yerleşim kararı (`packages/ui` vs feature) netleşmişse,
4. API, variant, state, styling ve a11y contract’ları görünür kılınmışsa,
5. Test ve dokümantasyon beklentileri yazılmışsa,
6. Deprecation ve cleanup mantığı tanımlanmışsa,
7. Bootstrap component seti (Tier 1 primitive'ler, Tier 2 core component'ler, ileri aşama adayları) tier bazlı tanımlanmış ve bağımlılıkları açıklanmışsa,
8. Sonraki motion, feedback, contribution ve audit dokümanlarına uygulanabilir temel sağlanmışsa.

---

# 34. Kısa Sonuç

Bu dokümanın ana çıktısı şudur:

> Bu boilerplate kapsamında component üretimi, tekrar eden UI parçalarını rastgele tek yere toplama işi değil; primitive, semantic token, accessibility contract, state görünürlüğü, motion disiplini ve API sadeliği üzerinden yönetilen kurallı design system pratiğidir.

Bu nedenle bundan sonraki hiçbir implementasyon:
- feature-specific parçaları erkenden reusable sanamaz,
- component API’lerini kaçış prop’larıyla şişiremez,
- hardcoded stil ve raw token tüketimini normalleştiremez,
- a11y ve state contract’ını component dışına bırakamaz,
- test ve dokümantasyon beklentisi olmadan reusable component ilan edemez.
