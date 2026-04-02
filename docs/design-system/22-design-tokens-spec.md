# 22-design-tokens-spec.md

## Doküman Kimliği

- **Doküman adı:** Design Tokens Specification
- **Dosya adı:** `22-design-tokens-spec.md`
- **Doküman türü:** Specification / design system foundation / token contract document
- **Durum:** Accepted
- **Kapsam:** Bu boilerplate kapsamında design token sisteminin somut envanter mantığını, token sınıflarını, isimlendirme kurallarını, raw token ile semantic token ayrımını, light/dark mapping modelini, typography/spacing/radius/border/motion tokenlarının nasıl tanımlanacağını ve token tüketim disiplinini tanımlar.
- **Bağlı olduğu üst dokümanlar:**
  - `04-design-system-architecture.md`
  - `05-theming-and-visual-language.md`
  - `16-tooling-and-governance.md`
  - `21-repo-structure-spec.md`
  - `ADR-007-styling-tokens-and-theming-implementation.md`
- **Doğrudan etkileyeceği dokümanlar:**
  - `23-component-governance-rules.md`
  - `24-motion-and-interaction-standard.md`
  - `31-audit-checklist.md`
  - `32-definition-of-done.md`
  - `34-hig-enforcement-strategy.md`
  - `35-document-map.md`

---

# 1. Amaç

Bu dokümanın amacı, design token sistemini teorik prensipler seviyesinde bırakmayıp, gerçek implementasyona yön verecek kadar açık, isimlendirilmiş, katmanlandırılmış ve denetlenebilir bir spesifikasyon haline getirmektir.

Bu belge şu sorulara açık cevap verir:

1. Token nedir, semantic token nedir, bunlar fiziksel olarak nasıl ayrılır?
2. Hangi token aileleri bulunmalıdır?
3. Raw tokenlar neden doğrudan kullanılmamalıdır?
4. Semantic tokenlar nasıl isimlendirilmelidir?
5. Color, spacing, typography, radius, border, elevation ve motion tokenları nasıl sınıflandırılmalıdır?
6. Theme sistemi tokenlar üzerinden nasıl çalışmalıdır?
7. Hangi tokenlar global sistem düzeyindedir, hangileri context/pattern düzeyinde düşünülmelidir?
8. Hangi token davranışları doğrudan zayıf kabul edilir?

Bu belge doğrudan renk kodu veya sayı listesi vermek zorunda değildir.
Ama bu listeyi üretirken hangi mantığın izleneceğini kesin biçimde tanımlar.

---

# 2. Neden Bu Doküman Gerekli

Design system mimarisi yazılmış olsa bile token sistemi net değilse pratikte şu sorunlar çıkar:

- herkes aynı şeyi farklı isimle üretir,
- raw color kullanımı yayılır,
- spacing scale anlamsız büyür,
- typography rolleri kırılır,
- radius ve border dili rastgeleleşir,
- dark/light mapping tutarsızlaşır,
- componentler kendi mini token sistemlerini üretir,
- semantic anlam kaybolur,
- lint ve quality gates neyi enforce edeceğini bilemez.

Bu proje kapsamında token sistemi:
- “birkaç renk değişkeni”
- “tailwind benzeri utility isimleri”
- “UI kütüphanesinin kendi default sözlüğü”
seviyesinde ele alınamaz.

Token sistemi, design system’in en alt ama en kritik altyapısıdır.
Yanlış kurulursa yukarıdaki her katman bozulur.

---

# 3. Temel Tez

Bu proje kapsamında temel tez şudur:

> Design token sistemi, ham görsel değerleri tekrar kullanılabilir ve kontrollü biçimde tanımlayan raw katman ile, bu değerleri ürün anlamına bağlayan semantic katmanı açıkça ayırmalı; component ve ekranların doğrudan ham değer değil, mümkün olduğunca semantik roller tükettiği bir sistem kurmalıdır.

Bu tez şu sonuçları doğurur:

1. Raw token ile semantic token aynı şey değildir.
2. Component’ler mümkün olduğunca semantic katmandan beslenmelidir.
3. Token isimleri estetik değil, operasyonel olmalıdır.
4. Token ailesi keyfi büyütülemez.
5. Theme, raw color değil semantic role mapping üzerinden çalışmalıdır.
6. Token sistemi enforce edilebilir olacak kadar açık olmalıdır.

---

# 4. Token Sisteminin Hedefleri

## 4.1. Tekrarlanabilirlik

Aynı görsel karar tekrar tekrar aynı isim ve aynı anlamla çağrılmalıdır.

## 4.2. Semantik netlik

Bir değerin ne için kullanıldığı anlaşılmalıdır.
Sayıyı veya tonu ezberlemek gerekmez.

## 4.3. Theme esnekliği

Light/dark veya ileride başka context yorumları semantik katman üzerinden yönetilebilmelidir.

## 4.4. Design system disiplini

Primitive ve component katmanları keyfi stil alanına dönüşmemelidir.

## 4.5. Enforcement kolaylığı

Lint, audit ve review hangi tüketimin doğru olduğunu anlayabilmelidir.

## 4.6. Ölçeklenebilirlik

Feature sayısı arttıkça token sistemi patlamamalı, ama gelişime de kapalı olmamalıdır.

---

# 5. Token Katmanları

Bu proje kapsamında token sistemi en az şu katmanlara ayrılmalıdır:

1. Raw tokens
2. Semantic tokens
3. Context / pattern tokens (yalnızca gerçekten gerekiyorsa, dikkatli)
4. Component token mappings (component contract düzeyinde, ayrı sözlük gibi değil)

Bu katmanların rolleri karıştırılmamalıdır.

---

# 6. Raw Tokens

## 6.1. Tanım

Raw token, ürün anlamı taşımayan, tasarım sisteminin ham ölçü ve değer sözlüğüdür.

Örnek alanlar:
- neutral palette scale
- brand palette scale
- success/warning/error tonal scales
- spacing numbers
- typography sizes
- radii
- border widths
- opacity
- shadow/elevation values
- motion duration/easing values

## 6.2. Ne için vardır?

- kontrollü alt sözlük sağlamak
- semantik rollerin teknik temelini oluşturmak
- ölçü ve ton kaosunu önlemek

## 6.3. Ne için kullanılmaz?

- ekran içinde doğrudan karar verme
- ürün bağlamını ifade etme
- componentlerin son görünümünü tanımlama

## 6.4. Kural

Raw tokenlar mümkünse doğrudan feature/UI katmanında tüketilmemelidir.

## 6.5. Zayıf davranışlar

- `gray-700` gibi tonları doğrudan component içinde kullanmak
- raw spacing değerini inline style gibi çağırmak
- semantic role yerine raw token üzerinden kontrast/hiyerarşi kurmak

---

# 7. Semantic Tokens

## 7.1. Tanım

Semantic token, ham değeri ürün anlamına bağlayan katmandır.

Örnek:
- `content-primary`
- `surface-elevated`
- `border-subtle`
- `screen-padding-horizontal`
- `button-label-primary`
- `focus-ring`
- `feedback-success`

## 7.2. Neden kritik?

Çünkü ürün yüzeyi “hangi gri tonu” değil, “hangi içerik rolü” üzerinden kurulmalıdır.

## 7.3. Kural

Semantic token:
- üründeki görevi anlatmalı
- light/dark mapping’e uygun olmalı
- aynı isim farklı bağlamlarda farklı anlam taşımamalı
- aşırı ekran-spesifik olmamalı

## 7.4. Zayıf semantic token davranışları

- `color-blue-thing`
- `screen-special-text`
- `customCardGray`
- `newGreen2`
- `tempSpacingForHeader`

Bunlar semantik sistem değil, keyfi isimlendirmedir.

---

# 8. Context / Pattern Tokens

## 8.1. Ne zaman gerekir?

Bazen sistem genel semantic tokenlar yeterlidir.
Bazen de tekrar eden pattern’ler için daha bağlamsal semantik tanımlar gerekir.

Örnek:
- `screen-padding-horizontal`
- `section-gap-default`
- `card-padding-default`
- `field-gap-default`
- `action-group-gap`

## 8.2. Uyarı

Bu katman gereksiz büyütülmemelidir.
Her ekran için context token açmak sistemi çürütür.

## 8.3. Kural

Context/pattern token ancak:
- tekrar ediyorsa,
- ürün düzeyinde anlamlıysa,
- birçok component/pattern tarafından paylaşılacaksa
meşrudur.

---

# 9. Token Aileleri

Bu boilerplate kapsamında en az şu token aileleri düşünülmelidir:

1. Color tokens
2. Typography tokens
3. Spacing tokens
4. Radius tokens
5. Border tokens
6. Elevation / surface support tokens
7. Motion tokens
8. Opacity / overlay tokens
9. Z-index / layer tokens (gerekiyorsa)

Her aile aşağıda ayrıntılı ele alınmıştır.

---

# 10. Color Tokens

## 10.1. Raw color token yapısı

Raw color token sistemi kontrollü tonal scale mantığıyla kurulmalıdır.

Örnek aileler:
- neutral scale
- brand scale
- success scale
- warning scale
- error scale
- info scale

Bu belgede kesin numaralandırma zorunlu değildir.
Ama mantık net olmalıdır:
- sistematik ton dizisi
- semantik role mapping için yeterli yoğunluk
- dark/light karşılık kurabilecek esneklik

## 10.2. Semantic color token aileleri

En az şu semantic alanlar tanımlanmalıdır:

### Background / surface
- background-base
- background-subtle
- surface-default
- surface-muted
- surface-elevated
- surface-overlay
- surface-accent
- surface-success-soft
- surface-warning-soft
- surface-error-soft

### Content
- content-primary
- content-secondary
- content-tertiary
- content-inverse
- content-accent
- content-success
- content-warning
- content-error
- content-disabled

### Border / divider
- border-subtle
- border-default
- border-strong
- border-accent
- border-error
- border-focus

### Interactive
- action-primary-bg
- action-primary-fg
- action-secondary-bg
- action-secondary-fg
- action-ghost-fg
- action-disabled-bg
- action-disabled-fg

### State / feedback
- feedback-success
- feedback-warning
- feedback-error
- feedback-info
- focus-ring
- overlay-backdrop

## 10.3. Kural

Color tokenlar yalnızca “güzel palet” değil, state ve yüzey semantiği taşımalıdır.

## 10.4. Zayıf color token sistemi

- yalnızca raw palette olup semantic role olmaması
- content ve background ayrımının zayıf kalması
- border/focus/state rollerini token dışı bırakmak
- disabled/focus/selected davranışlarını ad-hoc çözmek

---

# 11. Typography Tokens

## 11.1. Raw typography tokens

Ham tipografi katmanı şu değerleri kapsayabilir:
- font family
- font size scale
- font weight scale
- line height scale
- letter spacing scale

## 11.2. Semantic typography tokens

Tipografi sayısal değil rol bazlı tüketilmelidir.

Örnek semantic roller:
- display-large
- display-medium
- screen-title
- section-title
- section-subtitle
- body-primary
- body-secondary
- body-strong
- helper-text
- metadata-text
- button-label
- input-text
- input-label
- input-helper
- input-error
- caption

## 11.3. Kural

Typographic semantics component ve pattern düzeyinde anlaşılır olmalıdır.
`fontSize-14` bir tüketim hedefi değil, ham değerdir.

## 11.4. Zayıf typography token davranışları

- yalnızca sayı scale’i olup rol sistemi olmaması
- aynı semantic rolün farklı ekranlarda başka sayılarla çözülmesi
- tiny text’leri semantik sistem dışında bırakmak
- button/input text rollerini ayrı tanımlamamak

---

# 12. Spacing Tokens

## 12.1. Raw spacing scale

Spacing sistemi:
- sınırlı
- sistematik
- ritmik
olmalıdır.

Amacı şudur:
- rastgele 5, 7, 11, 13 gibi değer patlamasını önlemek
- layout ve yakınlık mantığını kontrollü kurmak

## 12.2. Semantic/context spacing rolleri

Örnek:
- screen-padding-horizontal
- screen-padding-vertical
- section-gap
- card-padding
- inline-gap
- field-gap
- action-group-gap
- list-row-padding
- modal-padding

## 12.3. Kural

Her spacing semantic token açılmaz.
Ama tekrar eden layout rollerinde context token kullanmak faydalıdır.

## 12.4. Zayıf spacing sistemi

- scale belirsizliği
- sınırsız tekil değerler
- her component’in kendi spacing sözlüğünü üretmesi
- screen padding ve internal component spacing’i aynı düzlemde düşünmemek

---

# 13. Radius Tokens

## 13.1. Raw radius scale

Radius için sınırlı ve sistematik ölçek kullanılmalıdır.
Amaç:
- ürün tonunu korumak
- keyfi yuvarlaklık kaçaklarını önlemek

## 13.2. Semantic radius mapping

Gerekiyorsa component ailesine göre semantik ilişki kurulabilir:
- control-radius
- surface-radius
- modal-radius
- chip-radius
- avatar-radius

Ancak bunlar gereksiz çoğaltılmamalıdır.

## 13.3. Kural

Radius scale, görsel dil kararına sadık kalmalıdır.
Her component için ayrı radius açmak zayıftır.

---

# 14. Border Tokens

## 14.1. Raw border tokens

- border width values
- divider thickness values

## 14.2. Semantic border tokens

- border-subtle
- border-default
- border-strong
- border-focus
- border-error
- border-selected

## 14.3. Neden önemli?

Border sistemi özellikle keskin visual language, density ve state görünürlüğü açısından ana taşıyıcı olabilir.

## 14.4. Zayıf davranışlar

- border color semantic’lerini tanımlamamak
- width ve color kararını her component’e bırakmak
- selected/focus/error border dillerini token dışı çözmek

---

# 15. Elevation / Surface Support Tokens

## 15.1. Neden ayrı düşünülmeli?

Yüzey ayrımı yalnızca renk değil; bazen shadow, opacity, blur veya tonal fark kombinasyonu gerektirir.

## 15.2. Olası token alanları

- shadow-small / medium / large
- overlay-opacity levels
- surface elevation tiers
- scrim values

## 15.3. Uyarı

Bu aile, ürünün görsel diline göre çok sade de olabilir.
Her projede kompleks shadow sistemi şart değildir.

## 15.4. Kural

Elevation token’ları dekoratif efekt deposuna dönüşmemelidir.

---

# 16. Motion Tokens

## 16.1. Raw motion tokens

Aşağıdaki raw motion token'ları, sistemdeki tüm hareket ve geçişlerin temel zaman ve eğri değerlerini tanımlar. Bu değerler doğrudan component'lerde kullanılmaz; semantic motion token'lar aracılığıyla tüketilir.

### 16.1.1. Duration token'ları ve baseline değerleri

| Token Adı | Baseline Değer | Kullanım Alanı | Notlar |
|-----------|---------------|----------------|--------|
| `duration-instant` | 100ms | Press/tap feedback, micro-interaction | Kullanıcı etkileşimine anlık yanıt gerektiren durumlar |
| `duration-fast` | 150ms | Hover state, toggle, small state change | Hızlı ama görünür geçişler |
| `duration-standard` | 250ms | Modal enter, accordion expand, tab switch | Çoğu UI geçişinin varsayılan süresi |
| `duration-slow` | 350ms | Screen transition, complex layout change | Karmaşık veya büyük alanlı geçişler |
| `duration-emphasized` | 500ms | Onboarding, celebration, first-time reveal | Dikkat çekme veya vurgulama amaçlı; nadir kullanılır |

**Kural:** Bu değerler baseline sinyaldir; exact implementasyonda platform ve bağlama göre ±50ms tolerans kabul edilebilir. Ancak bu tolerans keyfi genişletme bahanesi değildir.

### 16.1.2. Easing token'ları ve bezier curve değerleri

| Token Adı | Bezier Curve | Kullanım Alanı | Karakter |
|-----------|-------------|----------------|----------|
| `easing-standard` | `cubic-bezier(0.2, 0.0, 0.0, 1.0)` | Genel UI geçişleri, varsayılan easing | Doğal, hızlı başlayan, yumuşak biten |
| `easing-emphasized` | `cubic-bezier(0.2, 0.0, 0.0, 1.0)` ama `duration-slow` ile | Büyük geçişler, dikkat çekme | Standard ile aynı eğri, daha uzun süre |
| `easing-enter` | `cubic-bezier(0.0, 0.0, 0.0, 1.0)` | Ekrana giren element (modal, sheet, toast) | Yavaş başlayıp hızlanan → varış noktasında yumuşak duruş |
| `easing-exit` | `cubic-bezier(0.2, 0.0, 1.0, 1.0)` | Ekrandan çıkan element (dismiss, close) | Hızlı başlayıp sabit hızda çıkan |
| `easing-spring` | Platform native spring | Press bounce, pull-to-refresh snap | iOS: UISpring, web: CSS spring() veya JS spring physics |

**Kural:** Easing değerleri token olarak tanımlanır ve component'ler doğrudan `cubic-bezier()` yazmak yerine bu token'lara referans verir. Platform-native spring animasyonları için fallback olarak `easing-standard` kullanılır.

**Zayıf davranış:** Her component'te farklı bezier değeri icat etmek, "bence daha iyi duruyor" gerekçesiyle token dışı easing kullanmak.

## 16.2. Semantic motion tokens

- transition-feedback
- transition-screen
- transition-modal-enter
- transition-modal-exit
- transition-accordion
- transition-toast
- transition-press

## 16.3. Kural

Motion token’ları yalnızca sayı listesi olarak bırakılmamalı.
Anlamsal kullanım yüzeyi de tanımlanmalıdır.

## 16.4. Zayıf davranışlar

- animation sürelerini component içinde keyfi vermek
- reduced motion uyumunu token sisteminden bağımsız çözmek
- press, modal, screen transition için rastgele farklı hızlar kullanmak

---

# 17. Opacity / Overlay Tokens

## 17.1. Kullanım alanları

- disabled visibility
- overlay backdrop
- scrim levels
- ghost state support
- subtle emphasis

## 17.2. Kural

Opacity, keyfi görsel hile için değil, sistematik state ve overlay ihtiyacı için kullanılmalıdır.

## 17.3. Zayıf davranışlar

- her yerde alpha ile “ince ayar” yapmak
- disabled state’i yalnızca opacity’ye bırakmak
- overlay opaklıklarını keyfi vermek

---

# 18. Layer / Z-Index Tokens

## 18.1. Ne zaman gerekir?

Overlay, modal, sheet, toast, tooltip, sticky layer gibi yapılar varsa layer düzeni görünür tanımlanmalıdır.

## 18.2. Kural

Z-index sayıları gelişi güzel verilmemelidir.
Semantik layer tier’ları tanımlanmalıdır.

Örnek:
- layer-base
- layer-sticky
- layer-overlay
- layer-modal
- layer-toast
- layer-tooltip

## 18.3. Zayıf davranışlar

- 999, 9999, 99999 gibi rastgele katman sayıları
- aynı görsel yüzey için farklı yerlerde farklı z-index
- layer ilişkisini token dışı bırakmak

---

# 19. Light / Dark Theme Mapping Modeli

## 19.1. Temel ilke

Theme sistemi raw tokenlar ile değil, semantic tokenlar üzerinden yorumlanmalıdır.

## 19.2. Akış

Doğru mantık:
- raw palette
- semantic color role
- theme mapping
- component consumption

Yanlış mantık:
- component doğrudan raw palette kullanıyor
- theme için component içinde if/else ile renk seçiliyor

## 19.3. Kural

Light ve dark mode aynı semantic rolü farklı tonlarla yorumlayabilir.
Ama semantic anlam sabit kalmalıdır.

## 19.4. Zayıf davranışlar

- her component kendi dark mode override’ını taşıyor
- theme mapping merkezi değil
- light/dark farkı semantic değil görsel keyfilik üzerinden ilerliyor

---

# 20. Token İsimlendirme Kuralları

## 20.1. Genel ilke

İsimler:
- kısa ama belirsiz olmayan
- operasyonel
- sınıflandırılabilir
- sıralanabilir
olmalıdır.

## 20.2. Raw token isimleri

Raw token isimlerinde:
- aile
- yoğunluk / scale
- gerekiyorsa alt kategori
görünmelidir.

Örnek mantık:
- `color-neutral-100`
- `space-4`
- `font-size-300`
- `radius-200`
- `duration-fast`

## 20.3. Semantic token isimleri

Semantic token isimlerinde:
- rol
- bağlam
- emphasis/durum
görünmelidir.

Örnek mantık:
- `content-primary`
- `surface-elevated`
- `border-subtle`
- `input-label`
- `feedback-error`

## 20.4. Yasaklı isim davranışları

- belirsiz genel isimler
- geçici isimler
- tone/sayı ile rolü aynı isimde karıştırmak
- feature veya ekran adıyla token açmak
- “new”, “temp”, “special”, “alt2” türü isimler

---

# 21. Token Tüketim Kuralları

## 21.1. Öncelik sırası

Token tüketimi şu öncelikle yapılmalıdır:

1. Semantic token
2. Gerekirse context/pattern token
3. Çok zorunlu istisnada raw token
4. Hardcoded değer yalnızca exception mekanizmasıyla

## 21.2. Primitive düzeyi

Primitives mümkün olduğunca semantic sistem üzerinden kurulmalıdır.

## 21.3. Component düzeyi

Component’ler mümkün olduğunca semantic ve component role düzeyinde tüketim yapmalıdır; raw tokenlar minimumda tutulmalıdır.

## 21.4. Feature/screen düzeyi

Feature ekranları doğrudan raw token tüketen stil alanına dönüşmemelidir.

## 21.5. Zayıf tüketim davranışları

- screen içinde raw palette seçmek
- field shell dışında error rengi seçmek
- spacing’i token sisteminden bağımsız vermek
- same-role text için farklı semantic olmayan çözümler üretmek

---

# 22. Token Lifecycle Yönetimi

## 22.1. Yeni token ne zaman eklenir?

Aşağıdaki durumlarda:
- mevcut token sistemi gerçek ihtiyacı karşılamıyorsa
- tekrar eden yeni bir görsel rol oluştuysa
- design system yeni family/pattern gerektiriyorsa
- dark/light veya a11y ihtiyacı mevcut tokenlarla taşınamıyorsa

## 22.2. Yeni token eklemeden önce sorulacak sorular

1. Bu gerçekten yeni bir ihtiyaç mı?
2. Mevcut token ile çözülemiyor mu?
3. Bu raw mı olmalı, semantic mi?
4. Bu aslında pattern düzeyi spacing/role ihtiyacı mı?
5. Bu tek ekranlık geçici durum mu?
6. Bunu eklemek sistemi sadeleştiriyor mu, karmaşıklaştırıyor mu?

## 22.3. Token silme / birleştirme

Zamanla bazı tokenlar:
- gereksiz hale gelebilir,
- yinelenmiş olabilir,
- yanlış soyutlanmış olabilir.

Bunlar governance ve migration ile temizlenmelidir.

---

# 23. Token Governance Kuralları

## 23.1. Raw token governance

- scale sınırlı tutulmalı
- tonal sistem plansız büyütülmemeli
- aynı değer farklı isimle çoğaltılmamalı

## 23.2. Semantic token governance

- bir semantic rol açık anlam taşımalı
- aynı iş için farklı semantic isimler açılmamalı
- ekran-spesifik token açmak istisna olmalı

## 23.3. Review soruları

- bu token hangi problemi çözüyor?
- reusable mı?
- dark/light mapping’e uygun mu?
- enforce edilebilir mi?
- DS dilini sadeleştiriyor mu, kirletiyor mu?

---

# 24. Tokens ve Component Governance İlişkisi

## 24.1. Neden önemli?

Yanlış token sistemi component API’lerini bozar.
Component’ler:
- kendi mini palette’lerini açar,
- çok sayıda appearance prop ister,
- style escape yüzeyi büyür.

## 24.2. Kural

Token sistemi, component API sadeleşmesini desteklemelidir.
Component’e “renk seçici” gibi davranmaya gerek bırakmamalıdır.

---

# 25. Tokens ve Accessibility İlişkisi

## 25.1. Color ve contrast

Token sistemi:
- contrast güvenli semantic roller
- focus ring görünürlüğü
- disabled ve selected state okunabilirliği
için temel taşımalıdır.

## 25.2. Typography ve scaling

Typographic token sistemi:
- semantic rol
- line height
- readability
- dynamic type toleransı
alanlarını taşıyabilmelidir.

## 25.3. Motion

Motion token sistemi reduced motion uyumunu dışarıda bırakmamalıdır.

---

# 26. Tokens ve Performance İlişkisi

## 26.1. Neden ilgili?

Kötü token sistemi:
- theme resolution karmaşası
- component style complexity
- gereksiz branching
üretebilir.

## 26.2. Kural

Token tüketim modeli:
- sade
- predictable
- centrally mappable
olmalıdır.

---

# 27. Design Tokens Spec Anti-Pattern Listesi

Aşağıdaki davranışlar bu proje kapsamında zayıf kabul edilir:

1. Raw token ile semantic token ayrımı yapmamak
2. Semantic sistem kurmadan palette tüketmek
3. Her ekran için özel token açmak
4. Geçici/rasgele isimlerle token üretmek
5. Typography ve spacing’i token dışı bırakmak
6. Component’lere raw palette kullanımını yaymak
7. Theme mapping’i component if/else’lerine bırakmak
8. Focus, border, feedback gibi kritik roller için token tanımlamamak
9. Z-index ve overlay değerlerini rastgele yönetmek
10. Motion sürelerini token dışı kullanmak
11. Scale’i sınırsız büyütmek
12. Aynı anlam için farklı semantic isimler açmak
13. Hardcoded değeri token gibi normalleştirmek
14. Governance süreci olmadan token çoğaltmak
15. Token sistemini enforce edilemez belirsizlikte bırakmak

---

# 28. Token Kararı Verirken Sorulacak Sorular

Bir token tanımlanırken şu sorular sorulmalıdır:

1. Bu raw mı, semantic mi?
2. Bu token hangi problemi çözüyor?
3. Tekrar eden bir ihtiyaç mı?
4. Aynı şeyi mevcut sistem zaten sağlıyor mu?
5. Bu isim anlamı gerçekten taşıyor mu?
6. Bu token light/dark mapping’e uygun mu?
7. Bu token component API’lerini sadeleştiriyor mu?
8. Bu token a11y/contrast/motion/readability açısından doğru zemini kuruyor mu?
9. Bu token tek ekranlık geçici çözüm mü?
10. Bu token çoğalırsa sistem sadeleşecek mi, kirlenip zorlaşacak mı?

---

# 29. Sonraki Dokümanlara Etkisi

## 29.1. Component governance rules
`23-component-governance-rules.md`, component API ve varyant kurallarını bu token sistemi üzerine kurmalıdır.

## 29.2. Motion and interaction standard
`24-motion-and-interaction-standard.md`, motion token ailesini bu belgede tanımlanan mantıkla detaylandırmalıdır.

## 29.3. Audit checklist
`31-audit-checklist.md`, raw token tüketimi, hardcoded stil kaçakları ve semantic tutarsızlıkları bu belgeye göre denetlemelidir.

## 29.4. HIG enforcement strategy
`34-hig-enforcement-strategy.md`, token sisteminden enforce edilebilecek style ve semantic kuralları bu belgeye bağlamalıdır.

## 29.5. ADR-007 styling ve theming kararları
`ADR-007-styling-tokens-and-theming-implementation.md`: Token sistemi ve theming implementasyonunun canonical karar otoritesidir. Bu belgedeki token aileleri, isimlendirme kuralları ve tüketim disiplini, ADR-007'deki implementasyon kararlarıyla birlikte uygulanmalıdır.

---

# 30. Stitch Pipeline Token Eşleştirme Referansı

Bu token standardının Google Stitch design-to-code pipeline'ı ile nasıl eşleşeceği `46-stitch-pipeline-spec.md` tarafından tanımlanır. Temel kurallar:

## 30.1. Eşleştirme prensibi

Stitch'in DESIGN.md dosyası bu dokümanın **türevdir, alternatifi değildir**. DESIGN.md'deki token tanımları bu dokümanın katman yapısına (raw → semantic → context → component) uymalıdır.

## 30.2. Eşleştirme tablosu

| Stitch DESIGN.md Çıktısı | Bu Dokümandaki Katman |
|---|---|
| Color roles (primary, surface, accent) | Semantic color tokens |
| Color palette (hex/rgb değerler) | Raw / primitive color tokens |
| Typography mapping (heading, body, caption) | Typography tokens |
| Spacing scale | Spacing tokens |
| Component patterns | Component token mappings |

## 30.3. Çelişki kuralı

DESIGN.md ile bu doküman çelişirse, bu doküman kazanır. DESIGN.md Stitch'te yeniden export edilir. Bu kural `40-ai-workflow-and-tooling.md` bölüm 4.2'de tanımlanmıştır.

## 30.4. Dönüşüm mekanizması

Stitch DESIGN.md'deki CSS değişkenleri → `packages/design-tokens/` altındaki kaynak dosyalara → `tailwind.config.js` (web) ve NativeWind config (mobile) olarak dönüştürülür. Detaylı dönüşüm adımları `46-stitch-pipeline-spec.md` bölüm 4.6'da tanımlanmıştır.

---

# 31. Onay Kriterleri

Bu doküman yeterli kabul edilir eğer:

1. Raw ve semantic token ayrımı net tanımlanmışsa,
2. Token aileleri eksiksiz ve operasyonel olarak sınıflandırılmışsa,
3. İsimlendirme kuralları açıkça yazılmışsa,
4. Theme mapping modeli tanımlanmışsa,
5. Token tüketim önceliği netse,
6. Governance ve lifecycle mantığı görünür kılınmışsa,
7. Sonraki component, motion ve audit dokümanlarına uygulanabilir temel sağlanmışsa.
8. Stitch pipeline token eşleştirme referansı tanımlanmışsa.
9. Token → kod dönüşüm pipeline'ı, çıktı formatları ve CI doğrulama mekanizması tanımlanmışsa.

---

# 32. Token Kullanım Analiz Reçetesi

Kullanılmayan ve eksik token'ları sistematik olarak tespit etmek için aşağıdaki analiz adımları uygulanır. Bu reçete, token sisteminin sağlığını ölçülebilir hale getirir.

## 32.1. Kullanılmayan Token Tespiti (Orphan Token Analizi)

Token dosyasında tanımlı olup kaynak kodda hiçbir yerde referans edilmeyen token'ları bulmak için aşağıdaki adımlar izlenir:

1. **Token envanter çıkarma:** `packages/design-tokens/` altındaki tüm token dosyalarından token adları programatik olarak çıkarılır.
2. **Kaynak kod tarama:** `src/**/*.{ts,tsx}` dosyalarında her token adı için referans aranır (grep/ripgrep).
3. **Raporlama:** Hiçbir kaynak dosyada referansı bulunmayan token'lar `orphan-tokens.json` olarak raporlanır.
4. **CI entegrasyonu:** `pnpm lint:tokens:unused` komutu CI pipeline'ına eklenir. Bu adım **uyarı** üretir (bloklamaz). Orphan token sayısı trend olarak izlenir; artış durumunda token cleanup sprint planlanır.

## 32.2. Token Coverage Raporu (Hardcoded Değer Tespiti)

Kaynak kodda token sistemi dışında kullanılan hardcoded görsel değerleri tespit etmek için:

1. **Hardcoded renk tarama:** Hex renk kodları (`#[0-9a-fA-F]{3,8}`), `rgb()`, `rgba()`, `hsl()` kalıpları kaynak kodda aranır.
2. **Hardcoded spacing tarama:** Inline `px`, `pt`, `rem`, `em` değerleri (ör. `padding: 16px`, `margin: '12'`) tespit edilir.
3. **Hardcoded font-family tarama:** Doğrudan font-family string'leri (`'Inter'`, `'Roboto'`) aranır.
4. **Raporlama:** Hardcoded değer bulunan satırlar dosya adı, satır numarası ve bulunan değer ile birlikte raporlanır.
5. **CI entegrasyonu:** `pnpm lint:tokens:coverage` komutu CI pipeline'ına eklenir. Bu adım **blocker** (P0) olarak çalışır; hardcoded görsel değer içeren PR merge edilemez.

## 32.3. Token Kullanım Dashboard'u

Token sağlığını izlemek için aşağıdaki metrikler dashboard olarak görselleştirilir:

- **En çok kullanılan token'lar:** Referans sayısına göre sıralı top 20 token
- **En az kullanılan token'lar:** 1-2 referansla sınırlı token'lar (potansiyel cleanup adayı)
- **Orphan token sayısı:** Sprint bazlı trend grafiği
- **Hardcoded değer sayısı:** Sprint bazlı trend grafiği (hedef: 0)
- **Token ailesi dağılımı:** Color, spacing, typography, motion vb. ailelerin kullanım oranları

---

# 33. Dynamic Token (User-Customizable) Mekanizması

Bazı kullanım senaryolarında kullanıcının tema rengini veya font boyutunu runtime'da değiştirmesi gerekebilir. Bu bölüm, dynamic token mekanizmasının teknik yaklaşımını ve sınırlamalarını tanımlar.

## 33.1. Kullanım Senaryoları

- **Kullanıcı aksiyonu:** Uygulama ayarlarından "Tema rengini değiştir" (primary color picker ile renk seçimi).
- **Accessibility:** "Font boyutunu büyüt" (OS düzeyinde Dynamic Type veya uygulama içi ayar).
- **Branding:** White-label uygulamalarda runtime tema değişimi (backend'den gelen marka renkleri).

## 33.2. Teknik Yaklaşım

### Web:
- CSS custom properties ile runtime override: `document.documentElement.style.setProperty('--color-primary', '#FF6600')`
- Tailwind CSS 4.x CSS variable desteği ile token'lar doğrudan CSS variable'a bağlanır.
- Tema değişimi sayfa yenilemesi gerektirmez; anlık güncellenir.

### React Native:
- Theme context provider ile dynamic token değerleri React context üzerinden dağıtılır.
- `ThemeProvider` component'i dynamic token'ları props olarak alır ve tüm alt ağaca yayar.
- NativeWind 5.x CSS variable desteği ile web ile paralel mekanizma kullanılır.

### Persist:
- Kullanıcı tercihi MMKV'de (veya AsyncStorage'da) saklanır.
- Uygulama açılışında saklanan tercih okunur ve theme provider'a uygulanır.
- Key formatı: `user_theme_preference_{userId}` (kullanıcı bazlı tercih desteği).

## 33.3. Dynamic Token Sınırlamaları

- **Dynamic olabilen token'lar:** Renk (color-primary, color-accent), font-size scale multiplier.
- **Static kalması gereken token'lar:** Spacing, layout, radius, border-width, z-index, motion duration.
- **Gerekçe:** Spacing ve layout token'larının runtime değişimi layout shift ve CLS sorunlarına yol açar; bu token'lar build-time'da sabitlenir.

## 33.4. Fallback Mekanizması

- Dynamic token uygulanamıyorsa (hatalı değer, parse hatası, desteklenmeyen format) varsayılan tema kullanılır.
- Kontrast oranı kontrolü: Kullanıcının seçtiği primary renk, arka plan ile minimum 4.5:1 kontrast sağlamazsa uyarı gösterilir.
- White-label senaryoda backend'den gelen renk geçersizse fallback renk paleti uygulanır.

---

# 34. Kod Üretimi ve Implementasyon Bağlama (Code Generation and Implementation Binding)

Bu bölüm, token tanımlarının somut koda nasıl dönüştürüleceğini, dönüşüm pipeline'ını, çıktı formatlarını ve doğrulama mekanizmalarını tanımlar. Amaç, token spec'in soyut kalmamasını ve implementasyon katmanıyla açık bağlantısının kurulmasını sağlamaktır.

## 34.1. Token → Kod Dönüşüm Pipeline'ı

### 34.1.1. Kaynak format

Token tanımları `packages/design-tokens/` dizini altında JSON veya YAML kaynak formatında tutulur. Bu kaynak dosyalar tek doğru kaynaktır (single source of truth); diğer tüm formatlar bu kaynaktan türetilir.

Dizin yapısı:
```
packages/design-tokens/
├── tokens/
│   ├── raw/               # Raw token tanımları (color, spacing, typography, radius, motion vb.)
│   ├── semantic/           # Semantic token tanımları (light/dark mapping dahil)
│   └── context/            # Context/pattern token tanımları (gerekirse)
├── build/                  # Dönüşüm yapılandırma dosyaları
└── dist/                   # Derleme çıktıları (gitignore'a eklenir)
```

### 34.1.2. Build-time dönüşüm

Token kaynak dosyaları build-time'da platform hedeflerine derlenir:
- **Web:** Tailwind CSS 4.x config'e entegre edilecek CSS custom properties
- **Mobile:** NativeWind 5.x config'e entegre edilecek tema yapılandırması
- **Shared:** Platform-agnostik TypeScript/JavaScript constant dosyaları

Dönüşüm tamamen build-time'da gerçekleşir. Runtime'da token çözümleme maliyeti yoktur (bölüm 33'teki dynamic token mekanizması hariç).

### 34.1.3. Dönüşüm aracı

Canonical dönüşüm aracı olarak Style Dictionary veya eşdeğer bir token transformer kullanılacaktır. Kesin araç seçimi bootstrap implementasyon aşamasında kilitlenecek ve `36-canonical-stack-decision.md`'ye eklenecektir.

Dönüşüm aracı seçimi için gereksinimler:
- JSON/YAML kaynak formatını desteklemeli
- Çoklu platform çıktısı üretebilmeli (CSS, JS/TS, JSON)
- Katmanlı token referanslarını çözümleyebilmeli (raw → semantic → context)
- Tema varyantlarını (light/dark) ayrı çıktı olarak üretebilmeli
- Custom transform ve format tanımlamaya izin vermeli

### 34.1.4. Çıktı formatları

| Çıktı Formatı | Platform | Kullanım Alanı |
|---|---|---|
| CSS custom properties (`--token-name: value`) | Web | Tailwind CSS 4.x entegrasyonu, runtime tema swap |
| TypeScript/JavaScript constants | Shared | Tip güvenli token erişimi, test ve storybook desteği |
| NativeWind theme config | Mobile | NativeWind 5.x stil sistemi entegrasyonu |
| JSON manifest | Tümü | Token envanteri, dashboard ve analiz araçları |

## 34.2. Token Tüketim Zinciri

### 34.2.1. Katmanlı dönüşüm akışı

```
Raw token → Semantic token → Context/pattern token → Component tüketimi
```

Her katman derleme zamanında çözümlenir:
1. **Raw token:** Ham değer tanımlanır (ör. `color-neutral-700: #374151`)
2. **Semantic token:** Raw token'a referans verir (ör. `content-primary: {color.neutral.700}`)
3. **Context/pattern token:** Semantic token'a referans verir (ör. `card-title-color: {content.primary}`)
4. **Build çıktısı:** Tüm referanslar çözümlenmiş nihai değere dönüştürülür

Bu katmanlı yapı sayesinde:
- Bir raw değer değiştiğinde tüm bağımlı semantic ve context token'lar otomatik güncellenir
- Referans zinciri build-time'da tamamen düzleştirilir, runtime overhead oluşmaz

### 34.2.2. Dark mode / light mode dönüşüm mekanizması

Dark mode ve light mode token'ları aynı pipeline'dan geçer; her tema varyantı için ayrı çıktı seti üretilir.

**Web:** Tema değişikliği CSS custom property swap ile gerçekleşir. `[data-theme="dark"]` veya `prefers-color-scheme` media query ile aktif tema belirlenir; CSS custom property değerleri ilgili tema setine geçer. Sayfa yenilemesi gerekmez.

**Mobile:** Tema değişikliği appearance listener (Appearance API veya context provider) ile gerçekleşir. NativeWind'in CSS variable desteği ile web'deki mekanizmaya paralel çalışır.

Her iki platformda da semantic token isimleri sabit kalır; yalnızca arkadaki raw değer eşleştirmesi değişir. Bu, bölüm 19'daki Light / Dark Theme Mapping Modeli ile tutarlıdır.

## 34.3. CI Doğrulama ve Token Lint

### 34.3.1. Token lint kuralları

CI pipeline'ında aşağıdaki token doğrulama kontrolleri çalıştırılır:

| Kontrol | Seviye | Açıklama |
|---|---|---|
| Kullanılmayan token tespiti | Uyarı | Token dosyasında tanımlı olup kaynak kodda referansı bulunmayan token'lar raporlanır (bölüm 32.1 ile entegre) |
| Tanımsız token referansı | Blocker (P0) | Kaynak kodda referans edilen ancak token dosyasında tanımı bulunmayan token'lar tespit edilir |
| İsimlendirme kuralı ihlali | Blocker (P0) | Bölüm 20'deki isimlendirme kurallarına uymayan token adları reddedilir |
| Döngüsel referans kontrolü | Blocker (P0) | Token referans zincirinde döngü olup olmadığı build sırasında kontrol edilir |
| Hardcoded değer tespiti | Blocker (P0) | Kaynak kodda token yerine doğrudan kullanılan görsel değerler reddedilir (bölüm 32.2 ile entegre) |

### 34.3.2. Etki analizi raporu

Token değişikliği içeren PR'larda otomatik etki analizi raporu üretilir:

- **Değişen token'lar:** Eklenen, silinen veya değeri değiştirilen token listesi
- **Etkilenen component'ler:** Değişen token'ları referans eden component dosyaları
- **Etkilenen ekranlar:** Dolaylı olarak etkilenen sayfa/ekran listesi
- **Tema etki özeti:** Light/dark varyantlarında hangi görsel değişikliklerin oluşacağı

Bu rapor PR açıklamasına otomatik olarak eklenir ve code review sürecinde görsel regresyon değerlendirmesini kolaylaştırır.

### 34.3.3. Build pipeline entegrasyonu

Token derleme adımları monorepo build pipeline'ına (Turborepo) entegre edilir:

1. `pnpm build:tokens` — Token kaynak dosyalarını tüm platform çıktılarına derler
2. `pnpm lint:tokens` — Yukarıdaki tüm lint kurallarını çalıştırır
3. `pnpm lint:tokens:impact` — Token değişikliği etki analizi raporunu üretir

Bu adımlar `pnpm build` ve `pnpm lint` üst komutlarının parçası olarak Turborepo task graph'ında yer alır. Token derleme adımı, web ve mobile build adımlarından önce çalışır (dependency olarak tanımlanır).

---

# 35. Kısa Sonuç

Bu dokümanın ana çıktısı şudur:

> Bu boilerplate kapsamında design token sistemi, birkaç görsel değişken listesi değil; ham değerleri kontrollü biçimde tanımlayan raw katman ile, bu değerleri ürün anlamına bağlayan semantic katmanı ayıran ve componentlerin mümkün olduğunca semantik rol tükettiği operasyonel design system sözlüğüdür.

Bu nedenle bundan sonraki hiçbir implementasyon:
- raw tokenları doğrudan ekran stili gibi kullanamaz,
- semantic sistem kurmadan theme ve component dilini sürdüremez,
- token isimlerini geçici veya bağlamsız bırakıp kalite iddiasında bulunamaz,
- token governance olmadan tasarım sistemi disiplinini koruyamaz.
