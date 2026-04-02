# 08-navigation-and-flow-rules.md

## Doküman Kimliği

- **Doküman adı:** Navigation and Flow Rules
- **Dosya adı:** `08-navigation-and-flow-rules.md`
- **Doküman türü:** Standard / UX architecture / navigation governance document
- **Durum:** Accepted
- **Kapsam:** Bu boilerplate kapsamında navigation yaklaşımını, kullanıcı akışlarının nasıl tasarlanacağını, web ve mobilde navigation parity’nin nasıl korunacağını, route/screen/modal/sheet/tab/stack gibi yapıların hangi mantıkla kullanılacağını ve geri davranışı, derin linkleme, geçici akışlar, kritik görev akışları gibi alanların nasıl yönetileceğini tanımlar.
- **Bağlı olduğu üst dokümanlar:**
  - `00-project-charter.md`
  - `01-working-principles.md`
  - `02-product-platform-philosophy.md`
  - `03-ui-ux-quality-standard.md`
  - `04-design-system-architecture.md`
  - `05-theming-and-visual-language.md`
  - `06-application-architecture.md`
  - `07-module-boundaries-and-code-organization.md`
  - `ADR-012-navigation-baseline.md` *(canonical navigation runtime kararı)*
- **Doğrudan etkileyeceği dokümanlar:**
  - `09-state-management-strategy.md`
  - `10-data-fetching-cache-sync.md`
  - `11-forms-inputs-and-validation.md`
  - `12-accessibility-standard.md`
  - `13-performance-standard.md`
  - `14-testing-strategy.md`
  - `15-quality-gates-and-ci-rules.md`
  - `16-tooling-and-governance.md`
  - `17-technology-decision-framework.md`
  - `21-repo-structure-spec.md`
  - `24-motion-and-interaction-standard.md`
  - `25-error-empty-loading-states.md`
  - `31-audit-checklist.md`

---

# 1. Amaç

Bu dokümanın amacı, boilerplate kapsamında navigation ve kullanıcı akışlarının nasıl tasarlanacağını, hangi navigation pattern’lerinin hangi durumda doğru veya yanlış olduğunu ve web ile mobil arasında aynı ürün davranışını korurken platforma uygun navigation yorumunun nasıl kurulacağını net biçimde tanımlamaktır.

Bu belge şu sorulara cevap verir:

1. Navigation bu projede neyi temsil eder?
2. Route, screen, stack, tab, modal, sheet, dialog, drawer gibi yapılar hangi mantıkla kullanılmalıdır?
3. Web ve mobil arasında navigation parity nasıl korunmalıdır?
4. Back davranışı nasıl düşünülmelidir?
5. Geçici akışlar, onay akışları, çok adımlı akışlar ve derin hiyerarşiler nasıl yönetilmelidir?
6. URL / deep link / entry point mantığı nasıl ele alınmalıdır?
7. Kullanıcı akışı ile teknik navigation implementasyonu nasıl ayrılmalıdır?
8. Hangi navigation kararları doğrudan zayıf kabul edilir?

Bu belge, navigation’ı yalnızca “hangi kütüphaneyi kullanacağız?” sorusuna indirgemez.
Önce ürün davranışını ve kullanıcı akışını sabitler; teknik seçimler ancak bunun üzerine oturabilir.

---

# 2. Neden Bu Doküman Gerekli

Navigation çoğu projede yalnızca teknik yönlendirme sistemi sanılır.
Bu hatalıdır.
Navigation aynı zamanda:

- bilgi mimarisi,
- görev tamamlama hızı,
- odak yönetimi,
- geri dönebilirlik,
- güven hissi,
- hata toparlama kalitesi,
- platforma uygunluk
konularını doğrudan etkiler.

Bu alan baştan tanımlanmazsa şu bozulmalar ortaya çıkar:

- aynı feature web’de route, mobile’da gizli local state ile çözülür,
- back davranışı tutarsızlaşır,
- kullanıcı bulunduğu bağlamı kaybeder,
- modal / sheet / screen kullanımı keyfileşir,
- çok adımlı akışlar gereksiz karmaşıklaşır,
- geçici overlay’ler kalıcı ekranların yerini almaya başlar,
- URL/entry ilişkisi kopar,
- deep link ve navigation state çatışır,
- navigation parity yanlış anlaşılır.

Bu belge, “uygulama içinde nasıl gezileceği” meselesini görsel değil yapısal kalite alanı olarak ele almak için gereklidir.

---

# 3. Temel Tez

Bu proje kapsamında temel tez şudur:

> Navigation, ekranlar arasında geçiş sistemi değil; kullanıcı görevlerinin mantıklı, tahmin edilebilir, geri dönebilir, platforma uygun ve ürün davranışıyla tutarlı biçimde ilerlemesini sağlayan yapısal bir UX sistemidir.

Bu tez şu sonuçları doğurur:

1. Navigation kararı teknik araç seçimi değildir; önce ürün kararıdır.
2. Aynı ürün görevi, web ve mobilde farklı navigation kabuklarıyla çözülebilir.
3. Behavior parity, navigation container parity’den daha önemlidir.
4. Back davranışı rastgele bırakılamaz.
5. Modal/sheet/dialog gibi yapılar ana akışın yerine geçemez; doğru bağlamda kullanılmalıdır.
6. Deep link ve route yapısı, kullanıcı akışıyla çelişmemelidir.

---

# 4. Navigation’ın Bu Projedeki Anlamı

## 4.1. Navigation neyi kapsar?

Bu proje kapsamında navigation şu alanları kapsar:

- root application entry
- top-level app structure
- screen-to-screen transitions
- modal / dialog / sheet / overlay presentation
- tab / section switching
- nested flows
- transient flows
- back / dismiss / cancel davranışı
- route / URL ilişkisi
- deep linking
- recovery navigation
- unsaved changes handling
- interrupted flow recovery

## 4.2. Navigation neyi tek başına kapsamaz?

Navigation şu alanların tamamının yerine geçmez:
- bilgi mimarisi tasarımının tamamı,
- feature business logic,
- form validation kararı,
- state persistence kararı,
- analytics mapping.

Ancak bu alanlarla sıkı ilişkilidir ve bu nedenle izole ele alınamaz.

---

# 5. Navigation İlkeleri

## 5.1. Task-first navigation

Navigation önce teknik hiyerarşiye değil, kullanıcının tamamlamak istediği göreve göre tasarlanmalıdır.

### Ne demek?
Önce şu sorular sorulur:
- kullanıcı ne yapmak istiyor?
- bu işi tek oturumda mı yapıyor?
- ara adımlar gerekiyor mu?
- geri dönme ihtiyacı var mı?
- kayıp riskli veri var mı?
- bu akış kısa mı, derin mi, geçici mi, kalıcı mı?

Sonra navigation container seçilir.

## 5.2. Context clarity

Kullanıcı her anda:
- nerede olduğunu,
- ne yaptığını,
- nasıl geri döneceğini,
- bulunduğu ekranın görev içindeki yerini
anlayabilmelidir.

## 5.3. Reversible progression

Özellikle yıkıcı olmayan akışlarda kullanıcı mümkün olduğunca:
- geri dönebilmeli,
- iptal edebilmeli,
- kaybolduğunu hissetmemeli,
- gerekirse önceki bağlama dönebilmelidir.

## 5.4. Predictable back behavior

Back/dismiss/cancel davranışları aynı tür akışlarda aynı mantığı izlemelidir.

## 5.5. Platform respect

Web ve mobile aynı navigation chrome’u kullanmak zorunda değildir.
Ama aynı ürün görevi açısından çelişkili his üretmemelidir.

## 5.6. Minimal disorientation

Navigation değişikliği kullanıcıda ani bağlam kaybı üretmemelidir.
Özellikle:
- modal’dan tam ekran route’a anlamsız sıçrama,
- derin nested screen zinciri,
- beklenmedik dismiss davranışları
kaçınılmalıdır.

---

# 6. Navigation Katmanları

Bu proje kapsamında navigation aşağıdaki katmanlarda düşünülmelidir:

1. Product navigation model
2. Information architecture layer
3. Flow layer
4. Screen / route layer
5. Presentation layer
6. Platform runtime navigation layer

Bu katmanlar karıştırılmamalıdır.

## 6.1. Product navigation model

Ürünün temel alanları nasıl örgütleniyor?
Örneğin:
- ana çalışma alanları,
- keşif alanı,
- yönetim alanı,
- detay akışları,
- oluşturma/düzenleme akışları.

## 6.2. Information architecture layer

İçerik ve görevler hangi üst seviye yapıda gruplanıyor?
Örneğin:
- ana sections,
- alt kategoriler,
- detay bağlamları,
- settings / account / tools ayrımı.

## 6.3. Flow layer

Kullanıcı belirli görevi tamamlarken hangi adımlardan geçiyor?

## 6.4. Screen / route layer

Bu akış hangi ekran/rota parçalarına bölünüyor?

## 6.5. Presentation layer

Bu ekran/route kullanıcıya nasıl sunuluyor?
- full screen
- nested route
- modal
- dialog
- bottom sheet
- popover
- tab switch
- side panel

## 6.6. Platform runtime layer

Bu sunum ilgili platformda teknik olarak nasıl kuruluyor?

Bu ayrım yapılmazsa navigation tartışması gereksiz yere framework ve router seviyesine düşer.

---

# 7. Navigation Parity İlkesi

## 7.1. Behavior parity önceliklidir

Kullanıcı aynı üründe aynı görevi platformlar arasında benzer mantıkla tamamlayabilmelidir.

Örnek:
- detaydan düzenlemeye geçme,
- içerik oluşturma,
- filtreleme,
- seçim yapma,
- ayar değiştirme,
- geri alma / iptal etme.

Bu işlevsel olarak benzer kalmalıdır.

## 7.2. Presentation parity zorunlu değildir

Aynı akış web’de:
- side panel,
- dialog,
- route change
ile çözülebilirken,

mobile’da:
- stack push,
- full-screen modal,
- bottom sheet
ile çözülebilir.

Bu farklılık, behavior parity bozulmadığı sürece sorun değildir.

## 7.3. Navigation chrome parity zorunlu değildir

Web’de sidebar mantıklıysa, mobile’da tab bar veya stack mantıklı olabilir.

## 7.4. Kural

Parity şu sırayla değerlendirilmelidir:
1. görev sonucu aynı mı?
2. akış mantığı benzer mi?
3. hata/geri/iptal davranışı çelişiyor mu?
4. kullanıcı bağlamı korunuyor mu?
5. sunum biçimi platforma uygun mu?

---

# 8. Root Navigation Model

## 8.1. Tanım

Root navigation model, uygulamanın en üst düzey gezinme iskeletidir.

## 8.2. Genelde cevap vermesi gereken sorular

- Uygulamanın ana alanları neler?
- Kullanıcı bunlar arasında nasıl geçer?
- Hangi alan kalıcı navigasyon yüzeyinde görünür?
- Hangi alan geçici ya da derin akış olarak açılır?
- Auth / guest / onboarding / main app / settings gibi alanlar nasıl ayrılır?

## 8.3. Root model için zorunlu ilkeler

- Ana alanlar sınırlı ve anlamlı olmalı
- Üst seviye bölümler görev mantığına dayanmalı
- Navigation chrome, içerik mimarisini desteklemeli
- Root yapıda her şey aynı seviyede sunulmamalı
- Utility alanları ile ana görev alanları karıştırılmamalı

## 8.4. Zayıf root model örnekleri

- her şeyi tab’a koymak,
- ana görevin parçası olmayan utility alanları root primary nav’a taşımak,
- kullanıcıyı çok sayıda üst seviye seçenekle boğmak,
- web ve mobile için anlamsız derecede farklı bilgi mimarileri kurmak.

---

# 9. Screen, Route ve View Ayrımı

## 9.1. Screen nedir?

Kullanıcının belirli bağlamda gördüğü görev yüzeyidir.

## 9.2. Route nedir?

Uygulamanın navigation state / URL / entry yapısındaki adreslenebilir durumu temsil eder.

## 9.3. View nedir?

Bir ekranın içindeki presentational alt yüzey olabilir.
Her view ayrı route olmak zorunda değildir.

## 9.4. Neden ayrım önemli?

Çünkü çoğu projede şu hata yapılır:
- her görünümü ayrı route yapmak,
- route olması gereken şeyi local state ile saklamak,
- modalı route gibi, route’u modal gibi kullanmak.

## 9.5. Kural

Bir şeyin route olması için aşağıdaki sorular sorulmalıdır:
- doğrudan girilebilir mi?
- paylaşılabilir mi?
- geri gelinmesi anlamlı mı?
- bağımsız bağlam mı taşıyor?
- URL/deep link düzeyinde temsil edilmeli mi?

Bu sorulara “hayır” ağırlıklı cevap varsa overlay/panel/local view daha doğru olabilir.

---

# 10. Tab, Stack, Modal, Sheet, Dialog, Drawer Kullanım İlkeleri

## 10.1. Tab kullanımı

Tab, uygulamanın eşit ağırlıkta ve sık erişilen ana bölümleri için uygundur.

### Tab ne zaman doğrudur?
- birkaç ana çalışma alanı varsa,
- kullanıcı bunlar arasında sık geçiş yapıyorsa,
- her biri ayrı ama aynı seviyede ürün alanıysa.

### Tab ne zaman zayıftır?
- utility veya nadir kullanılan alanları tab’a koymak,
- derin akışları tab üzerinden çözmeye çalışmak,
- çok fazla tab ile kullanıcıyı bölmek.

## 10.2. Stack kullanımı

Stack, hiyerarşik veya ardışık ilerleyen akışlar için uygundur.

### Doğrudur:
- liste → detay
- detay → düzenle
- adım adım derinleşen görevler
- context taşınan geçişler

### Zayıftır:
- gereksiz çok derin stack zinciri,
- kullanıcıyı geri tuşu bağımlısı hale getirmek,
- aynı görev için aşırı ekran bölmek.

## 10.3. Modal kullanımı

Modal, ana akış üzerinde geçici ama kritik bağlam gerektiren işler için uygundur.

### Doğrudur:
- onay,
- kısa bağımsız görev,
- kritik müdahale,
- ana akıştan tam kopmadan kısa görev tamamlama.

### Zayıftır:
- uzun form akışı,
- karmaşık nested görevler,
- arka arkaya modallar,
- modal içinde modal.

## 10.4. Bottom sheet kullanımı

Özellikle mobile’da kısa seçim, hafif aksiyon, geçici detay ve bağlamsal aksiyonlar için uygundur.

### Doğrudur:
- action picker
- kısa form
- quick details
- option list
- contextual actions

### Zayıftır:
- çok uzun akışlar,
- karmaşık validation’lı büyük formlar,
- çok derin içerik.

## 10.5. Dialog kullanımı

Web tarafında kontrollü ve kısa müdahaleler için uygundur.
Ama tam ekran görevleri dialog’a sıkıştırmak zayıftır.

## 10.6. Drawer / side panel kullanımı

Özellikle web’de geniş alan avantajı varsa, detay veya edit deneyimi için mantıklı olabilir.

### Kural
Drawer/panel kullanımı bilgi yoğunluğunu iyileştiriyorsa değerlidir.
Sırf modern görünsün diye açılmamalıdır.

## 10.7. Canonical Navigation Component Başlangıç Seti

Navigation alanında, `39-default-screens-and-components-spec.md` Bölüm 15'te tanımlanan aşağıdaki 7 component ilk 4 haftada oluşturulur:

| # | Component | Kullanım | Dış Kütüphane |
|---|-----------|----------|---------------|
| C40 | Header / NavigationBar | Back, title, right actions, safe area | — |
| C41 | TabBar | Alt navigasyon, icon + label, badge | React Navigation bottom tabs |
| C42 | BottomSheet | Snap points, gesture dismiss, backdrop | @gorhom/bottom-sheet |
| C43 | Modal / Dialog | Merkez popup, backdrop | React Navigation modal veya custom |
| C44 | ConfirmDialog | Destructive action onayı | — |
| C45 | ActionSheet | Seçenek listesi | Mobile: bottom sheet pattern |
| C46 | Drawer | Yan panel (web only) | — |

> Bu component'ler 10. bölümdeki kullanım ilkeleriyle uyumlu tasarlanır. Detaylı spec: `39-default-screens-and-components-spec.md`

---

# 11. Çok Adımlı Akışlar

## 11.1. Tanım

Kullanıcının tek bir hedef için birden fazla ardışık adım tamamladığı akışlardır.

## 11.2. Ne zaman gereklidir?

- bilgi yoğun görevler,
- sırayla doğrulama gerektiren işlemler,
- aşamalı oluşturma akışları,
- bağlamı bölmek performansı ve kullanılabilirliği artırıyorsa.

## 11.3. Ne zaman zayıftır?

- tek ekranda çözülebilecek akışı gereksiz parçalamak,
- kullanıcıyı “wizard” hissiyle gereksiz boğmak,
- her küçük veri toplama adımını ayrı ekran yapmak.

## 11.4. Çok adımlı akış kuralları

- adım mantığı net olmalı,
- geri dönüş tanımlı olmalı,
- ilerleme kaybı minimize edilmeli,
- kullanıcı hangi adımda olduğunu bilmeli,
- iptal davranışı açık olmalı,
- geçici veri saklama mantığı tanımlanmalı.

## 11.5. Onboarding Akışı Standardı

### 11.5.1. Onboarding nedir?

Onboarding, kullanıcının uygulamayı ilk kez açtığında veya daha önce karşılaşmadığı yeni bir özellikle ilk kez buluştuğunda adım adım yönlendirilmesi sürecidir. Amacı, kullanıcının ürünü anlaması, temel kavramları öğrenmesi ve ilk değerli deneyimini mümkün olduğunca hızlı yaşamasıdır. Onboarding, ürünün kullanıcıya verdiği ilk izlenimdir ve bu izlenim kalıcı olur. Kötü tasarlanmış bir onboarding, kullanıcının ürünü terk etmesine neden olabilir; iyi tasarlanmış bir onboarding ise kullanıcının ürünü benimsemesini ve temel görevleri keşfetmesini kolaylaştırır.

### 11.5.2. Onboarding türleri

Onboarding tek bir kalıba sokulamaz. Farklı bağlamlarda farklı onboarding türleri gereklidir:

**(1) İlk kullanım onboarding (welcome screens)**
Kullanıcının uygulamayı ilk kez açtığında gördüğü karşılama akışıdır. Genellikle 3 ila 5 adımdan oluşur. Her adım, ürünün bir temel değerini veya özelliğini kısa ve öz biçimde tanıtır. Welcome screen serisi, ürünün ne yaptığını, kullanıcının neler başarabileceğini ve ilk adımın ne olduğunu göstermelidir. Bu akış, uygulamanın ilk açılışında bir kez gösterilir ve tamamlandığında veya atlandığında bir daha otomatik olarak tetiklenmez.

**(2) Feature onboarding (yeni özellik tanıtımı)**
Mevcut kullanıcıların uygulamada yeni eklenen veya önemli ölçüde değişen bir özellikle ilk kez karşılaştığında yönlendirilmesidir. Genellikle tooltip, spotlight (belirli bir UI elemanının vurgulanması) veya kısa coach mark şeklinde sunulur. Feature onboarding, tam ekran akış değildir; kullanıcının mevcut bağlamını minimum düzeyde bozarak yeni özelliği tanıtır. Kullanıcı bu tanıtımı kapatabilir ve bir daha görmez.

**(3) Progressive onboarding (kademeli keşif)**
Kullanıcıya tüm bilgiyi baştan yüklemek yerine, kullanıcının ürünü kullandıkça ilerlemesine göre bilgi sunulmasıdır. Örneğin kullanıcı belirli bir ekranı ilk kez ziyaret ettiğinde veya belirli bir eylemi ilk kez gerçekleştirdiğinde bağlamsal yardım gösterilir. Progressive onboarding, bilgi yükünü zamana yayar ve kullanıcının yalnızca o an ihtiyaç duyduğu bilgiyi almasını sağlar. Bu yaklaşım, özellikle karmaşık ürünlerde tüm özellikleri tek seferde anlatmaya çalışmanın yarattığı bilgi yorgunluğunu önler.

### 11.5.3. Step progression kuralları

Onboarding akışında kullanıcının adımlar arasındaki ilerlemesi açık, kontrollü ve tahmin edilebilir olmalıdır.

- **Adım sayısı görünürlüğü:** Kullanıcı toplam kaç adım olduğunu ve şu an kaçıncı adımda bulunduğunu her zaman görebilmelidir. Bu bilgi sayısal biçimde ("2/5" gibi), dot indicator ile veya progress bar ile sunulabilir. Kullanıcının "bu ne zaman bitecek?" sorusu karşılıksız kalmamalıdır.
- **İleri ve geri navigation:** Kullanıcı yalnızca ileri değil, geri de gidebilmelidir. Önceki adıma dönmek isteyebilir — atladığı bir bilgiyi tekrar okumak veya bir seçimi değiştirmek için. İleri/geri butonları açıkça görünür ve erişilebilir olmalıdır. Swipe ile ileri/geri geçiş mobile'da desteklenebilir, ancak buton her zaman alternatif olarak mevcut olmalıdır.
- **Tek kavram kuralı:** Her adım yalnızca tek bir kavramı, tek bir değer önerisini veya tek bir eylemi anlatmalıdır. Bir adıma birden fazla bağımsız bilgi sıkıştırmak, kullanıcının hiçbirini tam olarak anlamasını engeller. Eğer anlatılacak çok şey varsa adım sayısı artırılmalıdır — ama 5 adımı aşmamaya özen gösterilmelidir.

### 11.5.4. Skip mekanizması

- **Her zaman görünür olma kuralı:** "Atla" veya "Geç" butonu onboarding akışının her adımında görünür ve erişilebilir olmalıdır. Kullanıcı onboarding'i tamamlamak zorunda değildir. Bazı kullanıcılar ürünü keşfederek öğrenmeyi tercih eder; bazıları daha önce benzer ürünler kullanmıştır ve onboarding'e ihtiyaç duymaz.
- **Varsayılan ayarlarla devam:** Onboarding'i atlayan kullanıcı, uygulamanın varsayılan ayarlarıyla ve varsayılan durumlarıyla uygulamaya giriş yapar. Skip, kullanıcıyı eksik veya bozuk bir duruma düşürmemelidir.
- **Tercih saklama:** Kullanıcının onboarding'i atladığı bilgisi kalıcı olarak saklanmalıdır. Aynı onboarding, aynı kullanıcıya tekrar gösterilmemelidir. Bu, hem ilk kullanım onboarding'i hem de feature onboarding için geçerlidir. Kullanıcı skip'lediğinde bu karar saygıyla kabul edilmelidir.

### 11.5.5. Completion (tamamlama)

- **Son adım:** Onboarding'in son adımında açık bir tamamlama aksiyonu bulunmalıdır. Bu aksiyon "Başla", "Tamamla", "Uygulamaya Geç" gibi net bir buton ile sunulmalıdır. Son adım, kullanıcının ürünün ana deneyimine geçeceğini açıkça hissettirmelidir.
- **Opsiyonel kutlama:** Son adımda kısa ve incelikli bir kutlama animasyonu kullanılabilir. Ancak bu animasyon abartılı olmamalıdır — confetti patlaması gibi gürültülü efektler yerine, subtle bir checkmark animasyonu veya kısa bir geçiş efekti tercih edilmelidir. Kutlama opsiyoneldir; kullanılmasa da sorun yoktur.
- **Completion state persist edilmeli:** Kullanıcının onboarding'i tamamladığı bilgisi kalıcı olarak saklanmalıdır. Uygulama yeniden açıldığında, oturum yeniden başladığında veya cihaz değiştiğinde onboarding tekrar tetiklenmemelidir. Bu bilgi tercihen backend'de (kullanıcı profilinde) veya en azından local storage'da persist edilmelidir.

### 11.5.6. İçerik kuralları

- **Metin kısa ve odaklı olmalı:** Her adımdaki metin, kullanıcının birkaç saniye içinde okuyup anlayabileceği uzunlukta olmalıdır. Uzun paragraflar, teknik açıklamalar veya ayrıntılı talimatlar onboarding'e uygun değildir. Kısa başlık + 1-2 cümle açıklama yeterlidir.
- **Tek aksiyonel mesaj:** Her adımda kullanıcıya iletilen tek bir ana mesaj olmalıdır. Bu mesaj mümkünse aksiyona yönelik olmalıdır: "Ne yapabilirsin?", "Nasıl başlarsın?", "Şunu dene" gibi.
- **Görsel kullanımı:** İllüstrasyon, ekran görüntüsü veya kısa animasyon opsiyonel olarak kullanılabilir ve deneyimi zenginleştirir. Ancak kritik bilgi asla yalnızca görsele bağlanmamalıdır. Erişilebilirlik (a11y) gereği, görsel olmadan da tüm bilgi metin olarak mevcut olmalıdır. Görsel destekleyici bir unsurdur, bilginin tek taşıyıcısı değildir.

### 11.5.7. Erişilebilirlik

- **Screen reader uyumu:** Onboarding'in her adımı screen reader ile baştan sona okunabilir olmalıdır. Başlık, açıklama metni, ilerleme bilgisi ve aksiyon butonları screen reader tarafından anlamlı sırada ve doğru rollerle okunmalıdır.
- **Focus yönetimi:** Bir adımdan diğerine geçildiğinde focus, yeni adımın başlığına veya ana içerik alanına otomatik olarak taşınmalıdır. Kullanıcının yeni adımı "araması" gerekmemelidir. Bu, hem keyboard kullanıcıları hem de screen reader kullanıcıları için kritiktir.
- **Dot indicator erişilebilirliği:** Dot indicator veya benzeri görsel ilerleme göstergesi yalnızca görsel olarak değil, sayısal olarak da okunmalıdır. Screen reader kullanıcısı "Adım 2 / 5" gibi bir bilgiyi duymalıdır, yalnızca görsel noktalar yeterli değildir. Bu bilgi `aria-label` veya `accessibilityLabel` ile sağlanmalıdır.

### 11.5.8. Analytics

Onboarding akışının etkinliğini ölçmek ve iyileştirmek için aşağıdaki event'ler gönderilmelidir:

- **onboarding_started:** Kullanıcı onboarding akışının ilk adımını gördüğünde tetiklenir. Bu event, onboarding'in kaç kullanıcıya gösterildiğini ölçer.
- **onboarding_step_viewed:** Kullanıcı onboarding'in her bir adımını gördüğünde tetiklenir. Payload'da `step_number` bilgisi bulunmalıdır (ör: `step_number: 3`). Bu event, hangi adımda kullanıcıların düştüğünü (drop-off) analiz etmek için kritiktir.
- **onboarding_skipped:** Kullanıcı onboarding'i "Atla" butonuyla atladığında tetiklenir. Payload'da `at_step` bilgisi bulunmalıdır (ör: `at_step: 2`). Bu event, kullanıcıların hangi adımda sabrını kaybettiğini gösterir.
- **onboarding_completed:** Kullanıcı onboarding'in son adımındaki "Başla" veya "Tamamla" butonuna tıkladığında tetiklenir. Bu event, onboarding'in tamamlanma oranını ölçer.

### 11.5.9. Geri dönüş ve tekrar erişim

Kullanıcı onboarding'i tamamladıktan sonra otomatik olarak tekrar tetiklenmemelidir. Ancak kullanıcı istediğinde onboarding içeriğine tekrar erişebilmelidir. Bu erişim, uygulama ayarları ("Ayarlar > Uygulamayı Tanı" gibi) veya yardım bölümü ("Yardım > Başlangıç Rehberi" gibi) üzerinden sağlanabilir. Önemli olan, tekrar erişimin kullanıcının bilinçli tercihiyle gerçekleşmesidir — otomatik tetikleme değil.

### 11.5.10. Platform farkı

Web ve mobile'da onboarding'in kavramsal akışı ve adım içeriği aynı olmalıdır. Ancak sunum biçimi platforma göre farklılaşmalıdır:

- **Mobile:** Full-screen slide formatı tercih edilir. Her adım tam ekran olarak sunulur, swipe ile ileri/geri geçiş desteklenir, dot indicator ve butonlar ekranın altında konumlanır. Bu format, mobile'da doğal ve odaklı bir deneyim sunar.
- **Web:** Modal veya sidebar wizard formatı tercih edilir. Full-screen slide web'de genellikle aşırı alan kullanımı hissi yaratır. Ortada konumlanmış bir modal veya sayfanın yan tarafında açılan bir wizard panel, web'in geniş alan avantajını kullanarak daha ergonomik bir deneyim sunar. Web'de onboarding'in arka plandaki uygulamayı tamamen kapatması gerekmeyebilir.

Her iki platformda da skip mekanizması, ilerleme göstergesi, erişilebilirlik kuralları ve analytics event'leri aynı standartlarda uygulanmalıdır.

### 11.5.11. Hatalı yaklaşımlar

Aşağıdaki onboarding yaklaşımları bu proje kapsamında zayıf kabul edilir:

- **8+ adımlık uzun onboarding:** Kullanıcının sabrını zorlayan, ürünün tamamını baştan anlatmaya çalışan aşırı uzun onboarding akışları. 3-5 adım ideal aralıktır; bunun ötesi bilgi yorgunluğu yaratır.
- **Skip seçeneği olmayan zorunlu akış:** Kullanıcıyı onboarding'i tamamlamaya zorlayan, "Atla" seçeneği sunmayan akışlar. Bu, kullanıcı özerkliğine saygısızlıktır ve olumsuz ilk izlenim yaratır.
- **Her app açılışında tekrar gösterme:** Onboarding'in tamamlanma/skip durumunu saklamayarak her uygulama açılışında aynı akışı tekrar tetiklemek. Bu, kullanıcıyı doğrudan ürünü terk etmeye iter.
- **Ağır animasyonlarla yavaş deneyim:** Her adımda uzun, gösterişli animasyonlar kullanarak onboarding'in akışını yavaşlatmak. Kullanıcı bilgiye hızlıca ulaşmak ister; animasyonlar bilgi erişimini engellememelidir.
- **Onboarding'i ürünü "pazarlamak" için kullanmak:** Onboarding'in amacı kullanıcıya ürünü öğretmektir, ürünü satmak değil. Onboarding adımlarını pazarlama mesajları, premium plan tanıtımları veya upsell teklifleriyle doldurmak, kullanıcının güvenini zedeler ve onboarding'in amacını bozar. Kullanıcı onboarding'den "ürünü nasıl kullanacağını" öğrenmeli, "neden satın alması gerektiğini" değil.

---

# 12. Geri Davranışı Standardı

## 12.1. Back neden kritik?

Back davranışı bozuksa kullanıcı sistemin kontrolünü kaybettiğini hisseder.

## 12.2. Back türleri ayrılmalıdır

- navigation back
- dismiss
- cancel
- close
- return to previous context
- undo (geri alma) — bu farklı bir kavramdır

## 12.3. Kural

Bu kavramlar aynı şeymiş gibi kullanılmamalıdır.

### Örnek
- modal kapatma “dismiss” olabilir
- formdan vazgeçme “cancel” olabilir
- screen stack dönüşü “back” olabilir
- yapılan işlemi geri alma “undo” olabilir

## 12.4. Zorunlu ilkeler

- kullanıcı geri davranışını tahmin edebilmeli,
- geri ile veri kaybı yaşanacaksa uyarı düşünülmeli,
- aynı pattern’ler aynı geri mantığını kullanmalı,
- web browser back ile app-internal back çakışması doğru tasarlanmalı.

## 12.5. Zayıf back davranışları

- back’in bazen dismiss bazen destructive exit olması,
- kullanıcıyı ana sayfaya fırlatmak,
- formu sormadan kapatmak,
- modal kapatmayla stack back’i karıştırmak.

---

# 13. Unsaved Changes Politikası

## 13.1. Neden ayrı düşünülmeli?

Navigation kararı ile veri kaybı riski doğrudan ilişkilidir.

## 13.2. Kural

Aşağıdaki durumlarda unsaved changes politikası düşünülmelidir:
- uzun formlar,
- çok adımlı akışlar,
- düzenleme ekranları,
- kritik veri girişi,
- kullanıcı zaman yatırımı yüksek alanlar.

## 13.3. Olası davranışlar

- warn before leaving
- draft preserve
- autosave
- explicit save / discard
- recover on reopen

## 13.4. Zayıf davranış

- veri kaybını sessizce kabul etmek,
- her küçük değişiklikte agresif uyarı çıkarmak,
- web ve mobile’da çelişkili unsaved handling.

---

# 14. Deep Linking ve URL / Entry Point Mantığı

## 14.1. Deep link neden ürün kararıdır?

Çünkü kullanıcı bazı bağlamlara doğrudan girebilmelidir.
Bu karar teknik router seçimi değil, ürün erişim modelidir.

## 14.2. Route adaylığı kriterleri

Bir alan aşağıdaki özelliklerin çoğunu taşıyorsa route/deep link adayı olabilir:
- bağımsız bağlam taşıyor,
- paylaşılabilir,
- yeniden ziyaret edilmesi anlamlı,
- kullanıcı doğrudan oraya inmek isteyebilir,
- akışın yalnızca geçici overlay’i değil.

## 14.3. Deep link kuralları

- entry behavior anlamlı olmalı,
- eksik bağlam durumunda recovery yolu olmalı,
- mobile ve web’de deep link eşleşmesi ürün mantığında tutarlı olmalı,
- geçici UI durumları deep link’e zorla çevrilmemeli.

## 14.4. Zayıf deep link davranışları

- her view’i route yapmak,
- route olmalı gereken şeyi local modal state’e gömmek,
- deep link’ten gelen kullanıcıyı anlamsız boş ekrana düşürmek,
- URL ile gerçek ekran state’inin uyuşmaması.

## 14.5. Web URL ↔ Mobile Deep Link Eşleştirme Stratejisi

### 14.5.1. Sorun tanımı

Aynı ürün hem web hem de mobile platformda çalıştığında, bir içerik linki her iki platformda da doğru ekrana yönlendirmelidir. Kullanıcı bir linke tıkladığında — bu link bir e-postada, push bildiriminde, SMS'te, sosyal medya paylaşımında veya başka bir uygulamada olabilir — hedef içerik kullanıcının bulunduğu platforma uygun biçimde açılmalıdır.

Somut örnek: Bir kullanıcı profil sayfasının linki şu formatlarda olabilir:
- **Web URL:** `https://app.example.com/profile/123`
- **Mobile custom scheme:** `myapp://profile/123`
- **Universal Link / App Link:** `https://app.example.com/profile/123` (aynı web URL'si, ama mobile uygulama yüklüyse doğrudan uygulamada açılır)

Eğer web ve mobile'da farklı link şemaları, farklı route yapıları veya farklı parametre formatları kullanılırsa, link paylaşımı bozulur, kullanıcı deneyimi tutarsızlaşır ve bakım maliyeti artar. Bu nedenle cross-platform deep linking baştan doğru tasarlanmalıdır.

### 14.5.2. URL şeması: Tek kaynak, iki platform

Tek bir URL yapısı tanımlanır ve hem web hem mobile bu yapıyı parse eder. Bu URL yapısı ürünün bilgi mimarisini doğrudan yansıtmalıdır.

**Temel yapı:** `/{entity}/{id}`

Örnekler:
- `/profile/123` — 123 ID'li kullanıcının profil sayfası
- `/order/456` — 456 ID'li siparişin detayı
- `/settings` — ayarlar ekranı
- `/products/789` — 789 ID'li ürünün detayı
- `/chat/101` — 101 ID'li sohbet ekranı

Bu şema, uygulamanın navigation route tanımlarıyla birebir eşleşmelidir. Yani route tanımı `/profile/:id` ise, deep link formatı da `/profile/123` olmalıdır. Web router'ı ve mobile navigation'ı aynı path yapısını kullanmalıdır. Bu eşleşme bozulursa, deep link'ler kırılır veya yanlış ekrana yönlendirir.

### 14.5.3. Universal Links (iOS) ve App Links (Android)

Modern deep linking yaklaşımında custom URL scheme'ler (`myapp://`) yerine Universal Links (iOS) ve App Links (Android) tercih edilmelidir. Bu yaklaşımda web URL'si aynı zamanda mobile uygulamanın da anlayacağı formattadır.

**iOS — Universal Links:**
- Apple'ın mekanizmasıdır. Web domain'inin kök dizininde veya `.well-known` klasöründe `apple-app-site-association` (AASA) dosyası barındırılır.
- Bu dosya, hangi URL path'lerinin mobile uygulama tarafından handle edileceğini tanımlar.
- Kullanıcı bu URL'lerden birine tıkladığında ve uygulama yüklüyse, Safari yerine doğrudan uygulama açılır.

**Android — App Links:**
- Google'ın mekanizmasıdır. Web domain'inin `.well-known` klasöründe `assetlinks.json` dosyası barındırılır.
- Bu dosya, hangi Android uygulamasının bu domain'in URL'lerini handle etmeye yetkili olduğunu tanımlar.
- Kullanıcı bu URL'lerden birine tıkladığında ve uygulama yüklüyse, tarayıcı yerine doğrudan uygulama açılır.

**Expo ile konfigürasyon:**
Expo tabanlı projelerde `expo-linking` veya `expo-router` kullanılarak deep link konfigürasyonu yapılır. `expo-router` kullanılıyorsa, dosya tabanlı route yapısı doğrudan deep link path'leriyle eşleşir. Bu, URL şeması ile route tanımı arasındaki tutarlılığı doğal olarak sağlar.

### 14.5.4. Link paylaşım akışı

Kullanıcı mobile uygulamada bir içeriği paylaştığında (share sheet, link kopyalama vb.) oluşturulan link her zaman web URL formatında olmalıdır. Asla mobile-specific custom scheme formatında (`myapp://profile/123`) link oluşturulmamalıdır.

Bunun nedeni şudur:
- Alıcı uygulamayı yüklemişse → Universal Link / App Link mekanizması devreye girer, link doğrudan uygulamada açılır.
- Alıcı uygulamayı yüklememişse → Aynı link web tarayıcısında açılır ve web versiyonunda ilgili içerik görüntülenir.

Bu yaklaşım, paylaşılan linkin her koşulda çalışmasını garanti eder. Custom scheme kullanan linkler (`myapp://...`) uygulamayı yüklememiş kullanıcılarda tamamen kırılır ve hiçbir şey göstermez. Bu kabul edilemez bir deneyimdir.

### 14.5.5. Fallback: Hedef bulunamazsa ne olur?

Deep link'in hedef aldığı içerik her zaman mevcut olmayabilir. İçerik silinmiş olabilir, ID geçersiz olabilir, kullanıcının erişim yetkisi olmayabilir veya link'in süresi dolmuş olabilir. Bu durumlarda sistemin davranışı açıkça tanımlanmalıdır.

- **Silinmiş veya geçersiz içerik:** Kullanıcı "Bu içerik bulunamadı" veya "Bu sayfa artık mevcut değil" gibi anlaşılır bir mesaj gören bir "bulunamadı" ekranına yönlendirilir. Bu ekranda ana sayfaya veya ilgili listeye dönüş aksiyonu sunulmalıdır.
- **Yetkisiz erişim:** Kullanıcı erişim yetkisi olmayan bir deep link'e tıkladığında, "Bu içeriğe erişim yetkiniz yok" mesajı gösterilir.
- **Geçersiz route:** Tanımlanmamış bir URL path'ine denk gelen deep link'ler ana sayfaya yönlendirilir.

**Boş ekran veya crash kesinlikle kabul edilmez.** Deep link her koşulda anlamlı bir sonuç üretmelidir. Kullanıcı asla beyaz ekranda, sonsuz loading'de veya uygulama crash'inde bırakılmamalıdır.

### 14.5.6. Auth-gated deep link (deferred deep link)

Bazı deep link hedefleri authentication gerektiren ekranlardır. Kullanıcı giriş yapmadan bu linklere tıkladığında özel bir akış uygulanmalıdır:

1. Kullanıcı deep link'e tıklar (ör: `/order/456`).
2. Sistem, hedef ekranın auth gerektirdiğini tespit eder.
3. Kullanıcı login/register ekranına yönlendirilir.
4. **Deep link hedefi geçici olarak saklanır** (bellekte, state'te veya persistent storage'da).
5. Kullanıcı başarıyla giriş yapar.
6. Sistem, saklanan deep link hedefini okur ve kullanıcıyı otomatik olarak orijinal hedefe (`/order/456`) yönlendirir.

Bu akışa "deferred deep link" denir ve açıkça implement edilmelidir. Login sonrası kullanıcının ana sayfaya düşmesi — orijinal hedefini kaybetmesi — kabul edilemez. Kullanıcı bir link'e tıklamıştır ve o linkin hedefine ulaşmak ister; login sadece bir ara adımdır.

### 14.5.7. Query parametreleri

Filtreleme, sıralama, arama terimleri ve benzeri geçici state bilgileri URL query parametresi olarak taşınabilir.

Örnek: `/products?category=shoes&sort=price&q=nike`

Bu parametreler:
- **Web'de:** URL'den doğrudan okunur. Tarayıcı adres çubuğunda görünür, paylaşılabilir ve bookmark'lanabilir.
- **Mobile'da:** Deep link parser'dan okunur. Universal Link veya App Link mekanizması query parametrelerini de taşır; mobile tarafta bu parametreler parse edilerek ilgili ekranın state'ine uygulanır.

Query parametreleri, ekranın başlangıç durumunu belirler. Kullanıcı bu parametrelerle gelen bir linke tıkladığında, ekran belirtilen filtre/sıralama/arama durumunda açılmalıdır. Parametreler eksik veya geçersizse, ekran varsayılan durumuyla açılır — hata gösterilmez.

### 14.5.8. Analytics

Deep link performansını ve kullanıcı davranışını ölçmek için her deep link açılışında `deep_link_opened` event'i gönderilmelidir.

Bu event'in payload'ında en az şu bilgiler bulunmalıdır:
- **source:** Link'in kaynağı — email, push notification, share (kullanıcı paylaşımı), direct (doğrudan URL girişi), social (sosyal medya), sms, qr vb.
- **target:** Hedef ekran adı ve ilgili entity ID'si (ör: `screen: "profile", entity_id: "123"`).
- **resolved:** Link başarıyla hedef ekrana ulaştı mı, yoksa fallback'e mi düştü (ör: `resolved: true` veya `resolved: false, reason: "not_found"`).

Bu veriler, hangi kaynaktan gelen linklerin en çok kullanıldığını, hangi hedeflerin en popüler olduğunu ve fallback oranını ölçmek için kullanılır.

### 14.5.9. Test

Deep link'ler güvenilir çalışmalıdır ve bu güvenilirlik yalnızca kapsamlı test ile sağlanabilir.

Her deep link route'u aşağıdaki senaryolarda hem web'de hem mobile'da test edilmelidir:
- **Normal akış:** Geçerli ID ile doğru ekrana yönlendirme.
- **Auth-gated akış:** Giriş yapmamış kullanıcıyla auth gerektiren bir deep link. Login sonrası orijinal hedefe yönlendirme doğrulanmalı.
- **Geçersiz ID:** Var olmayan bir entity ID'si ile deep link. "Bulunamadı" ekranının düzgün gösterilmesi doğrulanmalı.
- **Silinmiş içerik:** Daha önce var olan ama artık silinmiş bir içeriğe ait deep link.
- **Expired link:** Süresi dolmuş bir deep link (eğer link expiration mekanizması varsa).
- **Query parametreleri:** Farklı kombinasyonlarda query parametreleriyle deep link. Filtreleme, sıralama ve arama durumlarının doğru uygulanması doğrulanmalı.
- **Uygulama kapalıyken:** Mobile'da uygulama tamamen kapalıyken deep link'e tıklama. Uygulamanın açılıp doğru ekrana yönlendirmesi doğrulanmalı (cold start deep link).
- **Uygulama açıkken:** Mobile'da uygulama arka plandayken veya aktifken deep link'e tıklama (warm start deep link).

### 14.5.10. Hatalı yaklaşımlar

Aşağıdaki deep linking yaklaşımları bu proje kapsamında zayıf kabul edilir:

- **Web ve mobile'da farklı URL şeması kullanmak:** Web'de `/user/123`, mobile'da `myapp://profile/123` gibi farklı yapılar kullanmak. Bu, link paylaşımını kırar, bakımı zorlaştırır ve tutarsızlık yaratır.
- **Deep link'i yalnızca mobile'a özel görmek:** Deep link kavramını sadece mobile uygulama açma mekanizması olarak düşünmek. Web'de de URL'ler deep link'tir ve aynı mantıkla ele alınmalıdır. Cross-platform düşünme zorunludur.
- **Fallback tanımlamamak:** Geçersiz, silinmiş veya yetkisiz deep link hedefleri için herhangi bir fallback davranışı tanımlamamak. Bu, kullanıcının boş ekran, crash veya sonsuz loading ile karşılaşmasına yol açar.
- **Auth sonrası orijinal hedefe dönmemek:** Auth-gated deep link'lerde login sonrası kullanıcıyı ana sayfaya düşürmek, orijinal deep link hedefini kaybetmek. Kullanıcının niyeti bellidir ve bu niyet login sonrası yerine getirilmelidir.

---

# 15. Geçici Akışlar ve Overlays

## 15.1. Tanım

Geçici akışlar:
- ana görevi destekleyen,
- kısa ömürlü,
- bağlamsal,
- çoğu zaman dismiss edilebilir
yüzeylerdir.

## 15.2. Örnekler

- seçim listesi
- filtre paneli
- hızlı düzenleme
- kısa onay ekranı
- eylem menüsü
- küçük detay görünümü

## 15.3. Kural

Geçici akışlar, ana ürün yolunun yerini almamalıdır.
Sadece onu desteklemelidir.

## 15.4. Zayıf kullanım

- sürekli overlay içinde karmaşık akış yürütmek,
- kullanıcıyı bir overlay’den diğerine atmak,
- overlay içindeki görevi deep stack’e dönüştürmek,
- route olması gereken şeyi sırf hızlı diye overlay yapmak.

---

# 16. Primary Flow vs Secondary Flow Ayrımı

## 16.1. Primary flow

Ürünün ana görevi için kritik akıştır.
Bunlar:
- görünür,
- net,
- mümkün olduğunca düşük sürtünmeli,
- sistem tarafından desteklenmiş olmalıdır.

## 16.2. Secondary flow

Ana görevi destekleyen, daha düşük öncelikli akışlardır.
Bunlar:
- utility,
- ayar,
- ek bilgi,
- gelişmiş seçenek,
- opsiyonel kontrol
olabilir.

## 16.3. Kural

Primary flow ile secondary flow aynı navigation ağırlığında sunulmamalıdır.
Aksi halde kullanıcı dikkat ve odak kaybeder.

---

# 17. Task Interruption ve Recovery

## 17.1. Neden önemli?

Kullanıcı akış ortasında:
- bildirim alabilir,
- uygulamadan çıkabilir,
- başka ekrana geçebilir,
- bağlantı kaybedebilir,
- oturum kapanabilir,
- modal kapatabilir.

Navigation sistemi bu kesintileri görmezden gelemez.

## 17.2. Recovery düşünülmesi gereken alanlar

- draft akışlar
- multi-step form
- confirmation bekleyen işlemler
- destructive action sonrası geri dönüş
- login gerektiren interrupted entry
- deep link ile yarıda yakalanan akışlar

## 17.3. Zayıf recovery davranışı

- kullanıcıyı her kesintide sıfırlamak,
- hangi görevde olduğunu unutturmak,
- modal kapanınca bütün ilerlemeyi yok etmek,
- login sonrası yanlış bağlama döndürmek.

---

# 18. Navigation ve State İlişkisi

## 18.1. Neden kritik?

Navigation state ile UI state / server state / form state birbirine karıştırılırsa sistem bozulur.

## 18.2. Kural

Navigation:
- bağlamı taşır,
- ama tüm UI state’in yerine geçmez,
- tüm form state’i route param’a dönüştürmez,
- tüm local görünüm tercihini history’ye yazmak zorunda değildir.

## 18.3. Zayıf yaklaşım

- geçici UI state’i route’a boğmak,
- route olmayan şeyi route gibi saklamak,
- geri davranışını state hack’leriyle simüle etmek.

Bu alan detaylı olarak `09-state-management-strategy.md` içinde açılacaktır.

---

# 19. Navigation ve A11y İlişkisi

## 19.1. Navigation yalnızca görsel akış değildir

A11y açısından şu alanları etkiler:
- focus geçişi,
- screen change announcement,
- modal / dialog odak yönetimi,
- back/dismiss erişilebilirliği,
- keyboard navigation,
- tab order,
- route değişim sonrası bağlam hissi.

## 19.2. Kural

Bir navigation kararı alınırken erişilebilirlik etkisi düşünülmelidir.
Özellikle:
- modal açılışında focus nereye gider,
- dismiss sonrası focus nereye döner,
- route değişince screen reader ne hisseder,
- mobile gesture ve back mantığı erişilebilir mi
soruları önemlidir.

---

# 20. Navigation ve Motion İlişkisi

## 20.1. Motion neden navigation parçasıdır?

Geçiş animasyonları kullanıcıya:
- yön,
- derinlik,
- ileri/geri hissi,
- geçici/kalıcı yüzey farkı
verir.

## 20.2. Kural

Navigation motion:
- bilgi vermeli,
- bekletmemeli,
- abartılı olmamalı,
- platformla çelişmemeli,
- reduced motion ile uyumlu olmalı.

## 20.3. Zayıf motion örnekleri

- her geçişin dramatik animasyon olması,
- back ile forward’ın aynı hissettirmesi,
- modal ile full-screen push geçişinin ayırt edilememesi,
- reduced motion’da fallback’in olmaması.

---

# 21. Web için Navigation Yönlendirici İlkeleri

## 21.1. URL görünürlüğü önemlidir

Web tarafında kullanıcılar daha yüksek oranda:
- URL paylaşır,
- browser back kullanır,
- doğrudan erişim bekler,
- bilgi yoğunluğunu aynı ekranda görmek ister.

## 21.2. Web’de güçlü navigation pattern’leri

Bağlama göre:
- sidebar + content
- top nav + sections
- list-detail
- route + side panel hybrid
- dialog for short tasks

## 21.3. Web’de zayıf davranışlar

- her şeyi modalla çözmek,
- browser back’i anlamsız hale getirmek,
- büyük görevleri route yerine local state ile saklamak,
- URL’siz derin bağlam yaratmak.

---

# 22. Mobile için Navigation Yönlendirici İlkeleri

## 22.1. Mobile odaklı ilerler

Mobilde kullanıcı:
- touch-first ilerler,
- daha az görünür bağlamla çalışır,
- daha kısa odak pencerelerine sahiptir,
- ergonomik geçiş bekler.

## 22.2. Mobile’da güçlü pattern’ler

Bağlama göre:
- tab bar
- stack push
- modal
- sheet
- full-screen focused flow

## 22.3. Mobile’da zayıf davranışlar

- masaüstü yoğun navigation’ı kopyalamak,
- üst üste çok fazla nested screen,
- bottom action ve navigation gesture çakışması,
- dismiss/back davranışının belirsizliği.

---

# 23. Navigation Anti-Pattern Listesi

Aşağıdaki davranışlar bu proje kapsamında zayıf kabul edilir:

1. Her şeyi aynı navigation pattern ile çözmek
2. Görev mantığını değil framework yeteneğini takip etmek
3. Route olması gereken şeyi local state’e gömmek
4. Geçici overlay’leri gerçek ekran yerine kullanmak
5. Modal içinde uzun ve karmaşık görevler yürütmek
6. Back davranışını rastgele bırakmak
7. Web ve mobile’da aynı feature için çelişkili görev akışları kurmak
8. Secondary flow’ları primary flow kadar görünür yapmak
9. Unsaved changes riskini düşünmemek
10. Deep link entry’yi anlamsız bırakmak
11. Navigation state ile form/UI state’i karıştırmak
12. A11y focus yönetimini navigation kararının dışında tutmak
13. Kullanıcıyı bağlamsız ekran sıçramalarına maruz bırakmak
14. Çok adımlı akışları gereksiz karmaşıklaştırmak
15. URL/history/back mantığını önemsememek

---

# 24. Navigation Kararı Verirken Sorulacak Sorular

Bir navigation kararı alınırken şu sorular sorulmalıdır:

1. Kullanıcı burada tam olarak hangi görevi yapıyor?
2. Bu görev geçici mi, kalıcı bağlam mı?
3. Tam ekran mı, overlay mi, panel mi daha doğru?
4. Kullanıcı buraya doğrudan gelmek isteyebilir mi?
5. Buradan geri dönüş nasıl olmalı?
6. Veri kaybı riski var mı?
7. Bu akış web ve mobile’da behavior parity koruyor mu?
8. Sunum farkı platform ergonomisini iyileştiriyor mu?
9. Bu yapı a11y ve focus yönetimini zorlaştırıyor mu?
10. Bu akış büyüdüğünde hâlâ yönetilebilir olacak mı?

---

# 24.5. Deep Link Test Matrisi Sablonu

Her deep link route'u icin asagidaki test matrisi uygulanmalidir. Bu matris, deep link'lerin tum giris noktalari ve uygulama durumlari icin tutarli ve guvenilir calistigini dogrulamak amaciyla kullanilir.

### Test Senaryolari Tablosu

| Deep Link Path | Cold Start | Background | Foreground | Auth Gerekli | Beklenen Davranis |
|---------------|-----------|-----------|-----------|-------------|------------------|
| `/profile/:id` | Test edilmeli | Test edilmeli | Test edilmeli | Evet | Kullanici giris yapmamissa → Login ekrani → Login sonrasi `/profile/:id` ekranina yonlendirme. Giris yapmissa → dogrudan Profile ekrani. Gecersiz ID → "Kullanici bulunamadi" ekrani. |
| `/settings` | Test edilmeli | Test edilmeli | Test edilmeli | Evet | Giris yapmamissa → Login → Settings. Giris yapmissa → dogrudan Settings ekrani. |
| `/invite/:code` | Test edilmeli | Test edilmeli | Test edilmeli | Hayir | Auth gerektirmez. Gecerli kod → Davet kabul ekrani. Gecersiz/suresi dolmus kod → "Davet gecersiz" mesaji + ana sayfaya yonlendirme. |
| `/order/:id` | Test edilmeli | Test edilmeli | Test edilmeli | Evet | Giris yapmamissa → Login → Order Detail. Kullanicinin erisim yetkisi yoksa → "Erisim yetkiniz yok" mesaji. Siparis silinmisse → "Siparis bulunamadi" ekrani. |
| `/products?category=:cat&sort=:sort` | Test edilmeli | Test edilmeli | Test edilmeli | Hayir | Belirtilen kategori ve siralama ile Products listesi acilir. Gecersiz parametreler → varsayilan degerlerle acilir, hata gosterilmez. |
| `/reset-password/:token` | Test edilmeli | Test edilmeli | Test edilmeli | Hayir | Gecerli token → Sifre sifirlama formu. Suresi dolmus token → "Link suresi dolmus" mesaji + yeni link isteme aksiyonu. |

### Giris Noktasina Gore Test Gereksinimleri

Her deep link path'i, farkli giris noktalari uzerinden de test edilmelidir:

| Giris Noktasi | Aciklama | Ozel Test Gereksinimleri |
|--------------|----------|------------------------|
| **Push notification tap** | Kullanici bildirime tiklayarak uygulamaya gelir | Notification payload'undaki deep link verisi dogru parse ediliyor mu? Cold start ve background durumlarinda notification handler calisiyor mu? |
| **URL scheme (custom)** | `myapp://path` formati (legacy destek) | Universal Link'e yonlendirme yapiliyor mu? Custom scheme dogrudan kullanilmiyorsa uyari veya redirect var mi? |
| **Universal Link (iOS)** | HTTPS URL'si ile iOS uygulamasi acilir | AASA dosyasi dogru yapilandirilmis mi? Safari'den tiklandiginda uygulama aciliyor mu? Uygulama yuklu degilse web fallback calisiyor mu? |
| **App Link (Android)** | HTTPS URL'si ile Android uygulamasi acilir | assetlinks.json dogru yapilandirilmis mi? Chrome'dan tiklandiginda uygulama aciliyor mu? Disambiguasyon dialog'u cikiyor mu? |
| **QR kod tarama** | Kullanici QR kod tarayarak linke ulasir | QR'daki URL formati deep link semasiyla uyumlu mu? |
| **Email icindeki link** | Kullanici email'deki linke tiklar | Email client'in link'i nasil handle ettigi test edilmeli (bazi email client'lar Universal Link'leri kirabilir). |
| **Pano'dan yapistirma (clipboard)** | Kullanici URL'yi kopyalayip tarayiciya yapistir | Web versiyonunda dogru sayfa aciliyor mu? |

### Platform Bazli Ozel Test Senaryolari

| Senaryo | iOS | Android | Web |
|---------|-----|---------|-----|
| Uygulama yuklu degil + Universal/App Link | Web fallback calismali | Web fallback calismali | Dogal olarak web acilir |
| Uygulama yuklu + cold start | Uygulama acilip dogru ekrana gitmeli | Uygulama acilip dogru ekrana gitmeli | N/A |
| Uygulama arka planda + deep link | Uygulamaya donup dogru ekrana gitmeli | Uygulamaya donup dogru ekrana gitmeli | Tab'a focus donmeli |
| Auth-gated deep link + session expired | Login → original target | Login → original target | Login → original target |
| Coklu deep link arka arkaya | Son deep link gecerli olmali | Son deep link gecerli olmali | Her biri ayri tab'ta acilabilir |

---

# 24.6. Navigation State Persistence

## 24.6.1. Amac

Kullanıcı uygulamayı arka plana attığında, uygulama sistem tarafından öldürüldüğünde veya cihaz yeniden başlatıldığında, kullanıcının son kaldığı ekrana dönebilmesi önemli bir kullanıcı deneyimi özelliğidir. Bu bölüm, navigation state'in nasıl saklanacağını, hangi koşullarda restore edileceğini ve hangi güvenlik/privacy sınırlarının uygulanacağını tanımlar.

## 24.6.2. Saklama Mekanizması

Navigation state snapshot'ı MMKV (react-native-mmkv) ile cihaz yerel deposunda saklanır. MMKV'nin tercih edilme nedenleri:

- **Yüksek performans:** JSI tabanlı senkron okuma/yazma. AsyncStorage'a kıyasla 30-50x daha hızlıdır. Navigation state restore işlemi splash screen sırasında gerçekleşmelidir; bu nedenle senkron okuma kritiktir.
- **Düşük overhead:** Küçük veri parçaları (navigation state JSON'u genellikle 1-5 KB) için optimize edilmiştir.
- **Encryption desteği:** Hassas route bilgileri gerektiğinde encrypted mode kullanılabilir.

## 24.6.3. Saklama ve Restore Kuralları

Navigation state aşağıdaki kurallara göre saklanır ve restore edilir:

| Kural | Açıklama |
|-------|----------|
| **Saklama zamanlaması** | Uygulama arka plana geçtiğinde (`AppState` change event'inde `active → background`) mevcut navigation state serialize edilip MMKV'ye yazılır. Her route değişiminde yazmak performans açısından gereksizdir; sadece arka plana geçiş anında yazmak yeterlidir. |
| **Restore zamanlaması** | Uygulama cold start olduğunda (tamamen kapalıyken açıldığında), splash screen sırasında MMKV'den navigation state okunur. State geçerliyse (stale değilse, güvenli ise) navigation container bu state ile başlatılır. |
| **Stale state kontrolü** | Saklanan navigation state'in yaşı kontrol edilir. **30 dakikadan eski state restore edilmez.** Bunun nedeni, 30 dakikadan eski bir state'in artık güncelliğini yitirmiş olması ve kullanıcıyı yanlış bağlama taşıma riskidir. Stale state tespit edildiğinde kullanıcı ana ekrandan (home) başlar. |
| **Hassas ekran hariç tutma** | Aşağıdaki ekran türleri navigation state persistence'dan hariç tutulur ve restore edilmez: ödeme ekranları, auth flow ekranları (login, register, password reset), biometric doğrulama ekranları, hassas veri görüntüleme ekranları (ör. kredi kartı bilgileri). Bu ekranların restore edilmesi güvenlik riski oluşturur. |
| **Deep link override** | Uygulama bir deep link ile açıldığında, persisted navigation state **görmezden gelinir** ve deep link hedefi uygulanır. Deep link, kullanıcının açık niyetini temsil eder; persisted state ise geçmiş bağlamı temsil eder. Kullanıcı niyeti her zaman önceliklidir. |
| **Auth değişikliği** | Saklanan state, kimliği doğrulanmış kullanıcının oturumuyla ilişkilidir. Kullanıcı logout olduğunda veya farklı bir kullanıcı login olduğunda, önceki kullanıcıya ait navigation state silinir. Bu, yanlış kullanıcıya ait ekranların gösterilmesini önler. |
| **Migration** | Navigation yapısı değiştiğinde (yeni ekranlar eklenmesi, route'ların yeniden adlandırılması), eski format ile yeni format uyumsuz olabilir. State restore sırasında format doğrulaması yapılır; uyumsuz state sessizce atılır ve kullanıcı ana ekrandan başlar. Crash kesinlikle kabul edilmez. |

## 24.6.4. Web Platformu

Web tarafında navigation state persistence, tarayıcının doğal URL/history mekanizması tarafından zaten sağlanır. Kullanıcı sayfayı yenilediğinde veya tarayıcıyı kapatıp açtığında, URL aynı kaldığı sürece aynı ekrana döner. Bu nedenle web'de ek navigation state persistence mekanizması gerekmez. Ancak URL'de taşınmayan geçici state (ör. filtre seçimleri, scroll pozisyonu) için sessionStorage kullanılabilir.

## 24.6.5. Zayıf Yaklaşımlar

- Tüm navigation state'i sınırsız süre boyunca saklamak (stale risk).
- Ödeme ve auth ekranlarını persistence'dan hariç tutmamak (güvenlik riski).
- AsyncStorage ile senkron olmayan okuma yapmak ve splash screen'de gecikme yaşamak.
- Deep link geldiğinde persisted state'i deep link'in üzerine yazmak (kullanıcı niyetini yok saymak).
- Logout sonrası önceki kullanıcının navigation state'ini temizlememek (privacy ihlali).

---

# 25. Sonraki Dokümanlara Etkisi

## 25.1. State management strategy
`09-state-management-strategy.md`, navigation state ile diğer state türlerinin sınırını bu belgeyle uyumlu biçimde açmalıdır.

## 25.2. Data fetching / cache / sync
`10-data-fetching-cache-sync.md`, route entry ve data loading ilişkisini navigation mantığıyla çelişmeyecek şekilde detaylandırmalıdır.

## 25.3. Forms, inputs and validation
`11-forms-inputs-and-validation.md`, multi-step flow, unsaved changes ve submit sonrası navigation davranışlarını bu belgeyle uyumlu kurmalıdır.

## 25.4. Accessibility standard
`12-accessibility-standard.md`, modal/dialog/focus/back davranışını navigation kararlarıyla bağlantılı teknik kurallara dönüştürmelidir.

## 25.5. Repo structure spec
`21-repo-structure-spec.md`, navigation wiring dosyalarının app shell, feature ve platform adapter düzeyinde nerede yaşayacağını bu mantığa göre yerleştirmelidir.

---

# 26. Onay Kriterleri

Bu doküman yeterli kabul edilir eğer:

1. Navigation yalnızca router veya kütüphane seviyesine indirgenmemişse,
2. Product model, flow, route ve presentation katmanları ayrılmışsa,
3. Behavior parity ile presentation parity ayrımı netse,
4. Tab / stack / modal / sheet / dialog / drawer kullanım mantığı tanımlanmışsa,
5. Back, dismiss, cancel ve unsaved changes davranışları açıkça ele alınmışsa,
6. Deep link, URL ve entry point mantığı düşünülmüşse,
7. Web ve mobile için platforma saygılı ama ürün tutarlı çerçeve kurulmuşsa.

---

# 27. Kısa Sonuç

Bu dokümanın ana çıktısı şudur:

> Bu boilerplate kapsamında navigation, ekranlar arası geçiş tekniği değil; kullanıcı görevlerinin platforma uygun, geri dönebilir, tahmin edilebilir ve ürün davranışıyla tutarlı biçimde ilerlemesini sağlayan UX mimarisidir.

Bu nedenle bundan sonraki hiçbir doküman:
- navigation’ı yalnızca teknik routing problemi gibi ele alamaz,
- behavior parity yerine presentation parity’ye öncelik veremez,
- back/dismiss/cancel davranışlarını karıştırarak bırakmaz,
- route ve transient state sınırını muğlak bırakamaz,
- platform farkı bahanesiyle navigation kalitesini düşüremez.
