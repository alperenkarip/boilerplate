# 11-forms-inputs-and-validation.md

## Doküman Kimliği

- **Doküman adı:** Forms, Inputs and Validation
- **Dosya adı:** `11-forms-inputs-and-validation.md`
- **Doküman türü:** Standard / UX architecture / interaction and validation document
- **Durum:** Accepted
- **Kapsam:** Bu boilerplate kapsamında form mimarisini, input ailelerini, field yapısını, validation stratejisini, hata gösterimini, submit yaşam döngüsünü, dirty/pristine mantığını, initial value ile draft state ilişkisini, multi-step form akışlarını ve erişilebilir form davranışlarını tanımlar.
- **Bağlı olduğu üst dokümanlar:**
  - `00-project-charter.md`
  - `01-working-principles.md`
  - `03-ui-ux-quality-standard.md`
  - `04-design-system-architecture.md`
  - `05-theming-and-visual-language.md`
  - `06-application-architecture.md`
  - `08-navigation-and-flow-rules.md`
  - `09-state-management-strategy.md`
  - `10-data-fetching-cache-sync.md`
  - `ADR-006-forms-and-validation.md`
- **Doğrudan etkileyeceği dokümanlar:**
  - `12-accessibility-standard.md`
  - `13-performance-standard.md`
  - `14-testing-strategy.md`
  - `15-quality-gates-and-ci-rules.md`
  - `16-tooling-and-governance.md`
  - `17-technology-decision-framework.md`
  - `23-component-governance-rules.md`
  - `25-error-empty-loading-states.md`
  - `31-audit-checklist.md`
  - `32-definition-of-done.md`

---

# 1. Amaç

Bu dokümanın amacı, boilerplate kapsamında form davranışını “input koyup submit etmek” seviyesinden çıkarıp, kullanıcı görevi, veri doğruluğu, state sahipliği, erişilebilirlik, görsel tutarlılık ve hata toparlama açısından sistematik hale getirmektir.

Bu belge şu sorulara açık cevap verir:

1. Form bu projede neyi temsil eder?
2. Input ailesi nasıl tanımlanmalıdır?
3. Label, placeholder, helper text ve error text ilişkisi nasıl kurulmalıdır?
4. Validation ne zaman çalışmalı, ne zaman çalışmamalıdır?
5. Form state ile server data ilişkisi nasıl yönetilmelidir?
6. Dirty/pristine, touched/untouched, valid/invalid gibi durumlar nasıl ele alınmalıdır?
7. Submit yaşam döngüsü nasıl tanımlanmalıdır?
8. Multi-step form ve uzun formlar nasıl yönetilmelidir?
9. Form UX ile navigation, unsaved changes ve data mutation ilişkisi nasıl kurulmalıdır?
10. Hangi form davranışları doğrudan zayıf kabul edilir?

Bu doküman teknoloji seçmez.
Ama teknoloji seçimini sınırlandırır.
Önce form ve validation problemini net tanımlar, sonra araç seçimi buna göre yapılır.

---

# 2. Neden Bu Doküman Gerekli

Formlar, uygulamaların en kırılgan yüzeylerinden biridir.
Çünkü burada şu alanlar aynı anda çakışır:

- kullanıcı veri girer,
- sistem veri doğrular,
- hata çıkabilir,
- veri kaybı riski oluşabilir,
- server ile mutation ilişkisi başlar,
- navigation etkilenir,
- accessibility kritik hale gelir,
- kullanıcı güven duygusu test edilir.

Bu alan baştan tanımlanmazsa şu bozulmalar ortaya çıkar:

- placeholder label yerine kullanılır,
- validation zamanlaması kullanıcıyı cezalandırır,
- helper ve error metinleri karışır,
- submit sonrası ne olduğu anlaşılmaz,
- alanlar arası tutarlılık bozulur,
- form state ile server state birbirine girer,
- multi-step akışlarda veri kaybolur,
- mobile keyboard ve focus davranışı bozulur,
- web keyboard tab order dikkate alınmaz,
- a11y etiketleri eksik kalır,
- hata dili ekran ekran değişir.

Formlar iyi tasarlanmadığında ürün şu hissi verir:
- kırılgan,
- güvensiz,
- sinir bozucu,
- amatör,
- cezalandırıcı.

Bu belge, form alanını sistematik hale getirmek için gereklidir.

---

# 3. Temel Tez

Bu proje kapsamında temel tez şudur:

> Formlar, yalnızca input koleksiyonu değildir; kullanıcının veri üretme, düzeltme, gözden geçirme ve onaylama görevini güvenli, anlaşılır, erişilebilir ve geri toparlanabilir biçimde tamamlamasını sağlayan görev sistemleridir.

Bu tez şu sonuçları doğurur:

1. Form UX ayrı uzmanlık alanıdır; ekranın içine gelişigüzel gömülemez.
2. Validation yalnızca “hata göstermek” değildir; yönlendirme problemidir.
3. Form state, server state ve display state karıştırılamaz.
4. Her input aynı davranış kurallarına bağlı olmalıdır.
5. Submit yaşam döngüsü belirsiz bırakılamaz.
6. Multi-step ve uzun formlar için veri kaybı ve recovery düşünülmelidir.
7. Form erişilebilirliği opsiyonel değildir.

---

# 4. Form Kavramı

## 4.1. Form nedir?

Bu proje kapsamında form, kullanıcının bir veya daha fazla veri alanı üzerinde çalıştığı, sistemin bu veriyi kontrol ettiği ve sonunda:
- kaydettiği,
- gönderdiği,
- doğruladığı,
- taslak olarak sakladığı,
- güncellediği,
- onayladığı
etkileşimli görev yüzeyidir.

## 4.2. Form ne değildir?

- yalnızca input dizisi,
- sadece submit butonlu ekran,
- her text entry alanı,
- basit filtre çubuğunun tamamı,
- local search kutusu tek başına her zaman tam form değildir.

## 4.3. Form türleri

Bu projede formlar farklı ağırlıklarda olabilir:
- kısa tek alan form
- standart veri giriş formu
- düzenleme formu
- ayar formu
- çok adımlı form
- kritik onay / destructive form
- taslak destekli uzun form
- seçim + detaylandırma formu

Her tür aynı kuralları birebir taşımaz; ama ortak temel prensipleri paylaşır.

---

# 5. Form Mimarisinin Hedefleri

## 5.1. Veri giriş güvenliği

Kullanıcı yanlışlıkla veri kaybetmemeli veya sistem tarafından gereksiz cezalandırılmamalıdır.

## 5.2. Açıklık

Form kullanıcıya şu konularda açık olmalıdır:
- ne bekleniyor,
- hangi alan zorunlu,
- ne hatalı,
- nasıl düzeltilir,
- ne zaman gönderilir,
- gönderince ne olur.

## 5.3. Tutarlılık

Aynı input ailesi, aynı helper mantığı, aynı hata gösterim dili ve aynı submit davranışları ürün çapında tutarlı olmalıdır.

## 5.4. Erişilebilirlik

Formlar:
- okunabilir,
- odaklanabilir,
- screen reader ile anlaşılır,
- keyboard ile kullanılabilir,
- touch ergonomisine uygun
olmalıdır.

## 5.5. Geri toparlanabilirlik

Hata, kesinti, ağ problemi, navigation değişimi veya validation başarısızlığı durumunda kullanıcı görevi tekrar kurabilmelidir.

---

# 6. Form Bileşenleri

Bir form en az şu kavramsal parçalardan oluşabilir:

1. Form container
2. Section
3. Field
4. Field label
5. Input control
6. Helper text
7. Validation / error text
8. Optional supporting text
9. Status/feedback region
10. Action row
11. Submit / cancel / secondary action controls

Bu parçalar sistematik ele alınmalıdır.

## 6.1. Canonical Form Component Başlangıç Seti

Form alanında, `39-default-screens-and-components-spec.md` Bölüm 12'de tanımlanan aşağıdaki 12 component ilk 4 haftada oluşturulur:

| # | Component | Açıklama | Dış Kütüphane |
|---|-----------|----------|---------------|
| C13 | Button | 5 variant, 3 size, loading/disabled state | — |
| C14 | IconButton | Icon-only button, tooltip, accessibilityLabel | — |
| C15 | TextField | Text input + FieldShell. Placeholder, helper, error, clear | — |
| C16 | TextArea | Multi-line, auto-grow, character limit | — |
| C17 | SearchField | Search icon, clear, 300ms debounce | — |
| C18 | Checkbox | Checked/unchecked/indeterminate | — |
| C19 | Radio | RadioGroup + Radio, tek seçim | — |
| C20 | Switch | On/off toggle, haptic feedback | expo-haptics |
| C21 | Select | Web: dropdown, Mobile: bottom sheet picker | @gorhom/bottom-sheet |
| C22 | FieldShell | Label + input slot + helper + error wrapper | — |
| C23 | FormGroup | Semantic fieldset/legend container | — |
| C24 | FormActions | Submit + cancel container, sticky bottom | — |

> Bu component'ler React Hook Form + Zod validation ile birlikte çalışacak şekilde tasarlanır. Detaylı spec: `39-default-screens-and-components-spec.md`

---

# 7. Field Kavramı

## 7.1. Field nedir?

Field, formun en temel veri giriş birimidir.
Genellikle şu bileşenlerin birleşimidir:
- label
- input control
- helper text
- validation text
- state presentation

## 7.2. Neden input’tan ayrılır?

Çünkü input sadece kontrol yüzeyidir.
Field ise kullanıcının anlayacağı tam görev birimidir.

Örnek:
- text input alanı tek başına field değildir.
- “Ad Soyad” label’ı, input, helper text ve error text birlikte field deneyimini oluşturur.

## 7.3. Kural

Boilerplate seviyesinde input family ile field shell ayrımı açık olmalıdır.
Bu ayrım yapılmazsa:
- error gösterimi tutarsızlaşır,
- helper text her ekranda farklılaşır,
- zorunlu alan mantığı bozulur,
- a11y kaybı oluşur.

---

# 8. Input Aileleri

Bu proje kapsamında input’lar görsel kontrol olarak değil, davranış ailesi olarak düşünülmelidir.

Temel aileler şunları içerebilir:

- text input
- multiline input / textarea
- numeric input
- masked input
- search input
- email / phone / URL benzeri özel text entry
- select
- autocomplete / combobox benzeri seçim
- radio
- checkbox
- switch
- segmented control
- date / time input
- file / attachment input
- OTP / verification code input
- range / slider
- chip-based multi-select

Her ailenin:
- label ilişkisi,
- state’leri,
- validation davranışı,
- keyboard/focus davranışı,
- mobile ergonomisi,
- a11y beklentisi
tanımlı olmalıdır.

---

# 9. Label Standardı

## 9.1. Label neden zorunludur?

Kullanıcı alanın ne istediğini placeholder’dan tahmin etmek zorunda kalmamalıdır.
Ayrıca a11y açısından da alan kimliği net olmalıdır.

## 9.2. Kural

- Her anlamlı field’ın açık label’ı olmalı.
- Placeholder, label’ın yerini almamalı.
- Label görünür ve okunabilir olmalı.
- Label dili açık, kısa ve görev odaklı olmalı.

## 9.3. Zayıf label davranışları

- sadece placeholder kullanmak,
- teknik terimle label yazmak,
- alan anlamını yeterince açıklamayan kısa ama belirsiz isimler,
- uzun açıklamayı label yerine koymak.

---

# 10. Placeholder Standardı

## 10.1. Placeholder ne içindir?

Placeholder:
- örnek format göstermek,
- beklenen içerik tipine ipucu vermek,
- alan boşken yardımcı olmak
için kullanılabilir.

## 10.2. Ne için kullanılmaz?

- label yerine,
- zorunlu alan açıklaması yerine,
- validation açıklaması yerine,
- helper text yerine.

## 10.3. Zayıf placeholder kullanımları

- alanın tek açıklaması placeholder olması,
- placeholder silinince kullanıcının alan anlamını kaybetmesi,
- uzun yönlendirmeleri placeholder içine doldurmak,
- düşük kontrast yüzünden okunmaz placeholder.

---

# 11. Helper Text Standardı

## 11.1. Helper text nedir?

Kullanıcının alanı doğru doldurmasına yardım eden açıklayıcı kısa metindir.

## 11.2. Kullanım alanları

- format beklentisi
- zorunluluk açıklaması
- etkisi olan seçimlerin sonucu
- sınır bilgisi
- örnek kullanım
- alanın amacına dair kısa açıklama

## 11.3. Kurallar

- helper text hata metni değildir
- helper text görünür ama dikkat dağıtıcı olmamalı
- helper text teknik jargon olmamalı
- helper text her alan için zorunlu değildir
- yalnızca gerçekten yardım ediyorsa gösterilmelidir

## 11.4. Zayıf helper text davranışları

- gereksiz uzun açıklamalar,
- validation mesajı ile aynı görsel tonda karışması,
- alanın kendisi zaten açıksa tekrar eden metinler,
- belirsiz ve genel metinler.

---

# 12. Error Text Standardı

## 12.1. Error text nedir?

Validation veya submit sürecinde kullanıcının düzeltmesi gereken problemi açıkça anlatan metindir.

## 12.2. İyi error text nasıl olur?

- alanla ilişkisi net olur
- sorunu söyler
- mümkünse nasıl düzeleceğini ima eder
- teknik değil kullanıcı dilindedir
- kısa ama yetersiz olmayacak kadar açıklayıcıdır

## 12.3. Zayıf error text örnekleri

- “hata”
- “geçersiz”
- “yanlış giriş”
- “input invalid”
- backend mesajını aynen göstermek

## 12.4. Kural

Error text:
- helper text ile karışmamalı
- yalnızca renk farkıyla verilmemeli
- alanın altında ve bağlamsal biçimde gösterilmeli
- genel form hataları ile alan hataları ayrılmalı

---

# 13. Required vs Optional Alan Politikası

## 13.1. Kural

Bir alanın zorunlu olup olmadığı açıkça anlaşılmalıdır.

## 13.2. Neden önemli?

Kullanıcının submit’e basana kadar hangi alanların gerekli olduğunu anlamaması zayıf UX’tir.

## 13.3. Yaklaşımlar

- required alanları açıkça işaretlemek
- optional alanları işaretlemek
- ürün diline göre bir yaklaşımı standartlaştırmak

## 13.4. Zayıf davranışlar

- hiçbir alanı işaretlememek,
- sadece submit sonrası öğrenilen zorunluluk,
- bazı ekranlarda required, bazılarında optional mantığının değişmesi.

---

# 14. Field State’leri

Her field en az şu durumları taşıyabilir:

- empty
- filled
- focused
- blurred
- valid
- invalid
- touched
- untouched
- dirty
- pristine
- disabled
- readonly
- loading
- success-emphasis (gerekirse)

Bu durumlar hem görsel hem davranışsal olarak tanımlı olmalıdır.

---

# 15. Dirty / Pristine Mantığı

## 15.1. Tanım

- **Pristine:** kullanıcı henüz alanı veya formu değiştirmemiştir.
- **Dirty:** kullanıcı başlangıç değerinden farklı bir giriş yapmıştır.

## 15.2. Neden kritik?

Bu ayrım:
- validation zamanlaması,
- submit aktivasyonu,
- unsaved changes uyarısı,
- reset davranışı,
- auto-save
gibi alanları doğrudan etkiler.

## 15.3. Kural

Dirty/pristine mantığı net tanımlanmalıdır.
Özellikle:
- initial value sonrası kullanıcı eski değere dönerse ne olur?
- server’dan yeniden veri gelirse dirty state nasıl etkilenir?
- programatik güncelleme dirty sayılır mı?

## 15.4. Zayıf davranışlar

- dirty mantığını hiç tanımlamamak,
- her alan dokunuldu diye dirty saymak,
- unsaved changes uyarısını güvenilmez hale getirmek.

---

# 16. Touched / Untouched Mantığı

## 16.1. Tanım

- **Touched:** kullanıcı alanla anlamlı şekilde etkileşime girmiştir.
- **Untouched:** henüz etkileşime girmemiştir.

## 16.2. Neden önemli?

Validation ve hata gösteriminde çoğu zaman dirty’den farklı davranış gerekir.
Kullanıcı daha alanı görür görmez hata yağmuruna tutulmamalıdır.

## 16.3. Kural

Touched mantığı validation stratejisinin parçası olarak ele alınmalıdır.
Kendi başına dekoratif bilgi değildir.

---

# 17. Initial Value ve Draft State İlişkisi

## 17.1. Temel sorun

Birçok form, server’dan gelen başlangıç değerleri ile kullanıcının üzerinde çalıştığı draft’ı karıştırır.

## 17.2. Kural

- Initial value, sistemin formu başlatmak için verdiği başlangıçtır.
- Draft state, kullanıcının çalışma sırasında ürettiği geçici veridir.
- Bunlar aynı şey değildir.

## 17.3. Neden önemli?

Çünkü:
- server verisi değişebilir,
- kullanıcı form üzerinde çalışırken yeni veri gelebilir,
- reset davranışı initial value’ya dönmek isteyebilir,
- dirty hesaplaması initial value’ya göre yapılır.

## 17.4. Zayıf davranışlar

- query sonucunu doğrudan mutable form state gibi ele almak,
- reset’in neye döndüğünü belirsiz bırakmak,
- server refresh olunca kullanıcı draft’ını sessizce ezmek.

---

# 18. Validation Kavramı

## 18.1. Validation nedir?

Validation yalnızca “yanlışsa kırmızı göster” değildir.
Validation:
- verinin biçimsel doğruluğu,
- iş kuralına uygunluğu,
- zorunlu alan kontrolü,
- alanlar arası ilişki,
- submit uygunluğu,
- bazen sunucu tarafı ön koşul kontrolü
anlamına gelir.

## 18.2. Validation katmanları

Bu projede validation aşağıdaki katmanlarda düşünülmelidir:

1. Field-level format validation
2. Form-level consistency validation
3. Cross-field validation
4. Domain/business validation
5. Server-side authoritative validation

Bu katmanlar birbirine karıştırılmamalıdır.

---

# 19. Validation Zamanlaması

## 19.1. Neden kritik?

Yanlış zamanda validation çalıştırmak kullanıcıyı cezalandırır.

## 19.2. Olası stratejiler

- on change
- on blur
- on submit
- hybrid yaklaşım
- progressive validation

## 19.3. Genel yönlendirici ilke

- İlk karakterde bağıran validation çoğu zaman zayıftır.
- Kullanıcıyı tamamen son submit’e kadar karanlıkta bırakmak da zayıftır.
- Doğru strateji alan türüne ve hata maliyetine göre değişebilir.

## 19.4. Güçlü yaklaşım örnekleri

- format hataları blur sonrası,
- kritik yapı hataları giriş sırasında yumuşak ipucu ile,
- form-level hatalar submit veya yeterli bağlam oluşunca,
- server validation submit sonrası ama iyi map edilmiş biçimde.

## 19.5. Zayıf davranışlar

- alan boşken daha kullanıcı yazmaya başlamadan agresif error,
- her tuşta tüm formu validate etmek,
- yalnızca submit sonrası büyük hata listesi göstermek,
- validation zamanlamasını her input için rastgele belirlemek.

---

# 20. Field-Level Validation

## 20.1. Tanım

Bir alanın kendi başına doğruluğunu kontrol eder.

Örnek:
- e-posta formatı
- minimum karakter
- sayı aralığı
- zorunluluk
- pattern kontrolü

## 20.2. Kural

Field-level validation:
- alan bağımsız doğrulamalar için kullanılmalı,
- kullanıcıya alan bağlamında gösterilmeli,
- gereksiz teknik terminoloji içermemeli.

---

# 21. Cross-Field Validation

## 21.1. Tanım

Birden fazla alan arasındaki ilişkiyi kontrol eder.

Örnek:
- şifre / şifre tekrar
- başlangıç tarihi / bitiş tarihi
- minimum / maksimum değer
- seçime bağlı zorunluluk
- bir alan doluysa diğerinin de dolu olması

## 21.2. Neden kritik?

Bu alan en çok ihmal edilen validation tipidir.
Çünkü tek alanlar doğru görünür ama form yine de yanlış olabilir.

## 21.3. Kural

Cross-field validation:
- hangi alanların ilişkili olduğunu görünür kılmalı,
- mümkünse ilgili alanlara bağlamlı geri bildirim vermeli,
- sadece genel form hatası olarak bırakılmamalı.

---

# 22. Form-Level Validation

## 22.1. Tanım

Formun bütünsel olarak gönderilmeye uygun olup olmadığını değerlendirir.

## 22.2. Kullanım alanları

- minimum zorunlu alan kombinasyonu
- işlem ön koşulu
- submit anında kritik doğrulamalar
- birlikte gönderim uyumu

## 22.3. Kural

Form-level validation:
- alan düzeyine indirgenemeyen durumlarda kullanılmalı,
- kullanıcıya açıklayıcı olmalı,
- submit deneyimini cezalandırmamalı.

---

# 23. Domain / Business Validation

## 23.1. Tanım

Verinin iş mantığına uygun olup olmadığını kontrol eder.
Bu her zaman saf alan validation’ı değildir.

Örnek:
- tarih aralığı kuralı
- seçilen kombinasyonun geçersizliği
- kullanıcı rolüne göre alan yasağı
- belirli değerlerin birlikte kullanılamaması
- ürün limitleri

## 23.2. Kural

Bu tür validation UI katmanında icat edilmemeli.
Mümkün olduğunca domain mantığına yakın tanımlanmalıdır.

---

# 24. Server-Side Validation

## 24.1. Neden gereklidir?

İstemci validation hiçbir zaman tek otorite değildir.
Server son otorite olabilir.

## 24.2. Kural

Server-side validation sonucu:
- kullanıcıya anlaşılır biçimde map edilmeli,
- mümkünse ilgili alanlara bağlanmalı,
- mümkün değilse form-level olarak net açıklanmalı.

## 24.3. Zayıf davranışlar

- server error string’ini aynen göstermek,
- alan bazlı hata geldiği halde yalnızca global toast göstermek,
- submit başarısızlığını genel hata gibi geçiştirmek.

---

# 25. Submit Yaşam Döngüsü

## 25.1. Submit neyi içerir?

Submit yalnızca butona basmak değildir.
Şunları içerir:

1. pre-submit validation
2. local state lock / prevent double submit
3. request başlatma
4. loading state
5. success veya error sonucu
6. gerekiyorsa rollback / retry / refocus
7. post-submit cleanup veya navigation

## 25.2. Kurallar

- duplicate submit engellenmeli
- loading görünür olmalı
- submit sırasında buton davranışı net olmalı
- başarı sonrası ne olacağı belirgin olmalı
- hata sonrası kullanıcı ne düzelteceğini anlamalı
- form state reset / preserve mantığı açık olmalı

## 25.3. Zayıf submit davranışları

- kullanıcı art arda submit edebiliyor olması,
- loading ile disabled ayrımının görünmemesi,
- başarı sonrası sessiz kalmak,
- hata sonrası alanların ne olacağını belirsiz bırakmak,
- başarılı submit sonrası draft state’in yanlış korunması veya yanlış sıfırlanması.

---

# 26. Submit Sonrası Başarı Davranışı

## 26.1. Olası davranışlar

- aynı ekranda başarı mesajı
- route/screen geçişi
- modal/sheet dismiss
- listeye geri dönüş
- detay sayfasına yönlendirme
- yeni oluşturulmuş kaydı gösterme
- formu sıfırlama
- formu koruyarak yeni entry’ye hazırlama

## 26.2. Kural

Başarı davranışı görev tipine bağlı olmalıdır.
Aynı submit sonrası her yerde aynı hareket yapılmaz.

## 26.3. Zayıf davranış

- başarılı işlem sonrası ne olduğunu kullanıcıya anlatmamak,
- formu gereksiz yere tamamen sıfırlamak,
- kullanıcıyı bağlam dışı ekrana atmak,
- success feedback’i yalnızca anlık toast’a indirgemek.

---

# 27. Submit Sonrası Hata Davranışı

## 27.1. Kural

Hata sonrası kullanıcı:
- neyin yanlış gittiğini,
- neyi düzeltebileceğini,
- tekrar deneyip deneyemeyeceğini,
- verisinin durup durmadığını
anlayabilmelidir.

## 27.2. Olası hata kaynakları

- alan doğrulama
- form-level validation
- yetki hatası
- bağlantı hatası
- timeout
- server validation
- conflict
- duplicate request

## 27.3. Zayıf davranışlar

- tüm hataları aynı toast ile göstermek,
- alan verisini kaybetmek,
- kullanıcıyı tekrar doldurmaya zorlamak,
- düzeltilebilir hata ile fatal hata ayrımını yapmamak.

---

# 28. Disabled, Readonly ve Loading Ayrımı

## 28.1. Disabled nedir?

Alan veya aksiyon şu an kullanılamaz.
Genellikle:
- ön koşul sağlanmamış,
- yetki yok,
- mantıksal olarak erişim kapalı.

## 28.2. Readonly nedir?

Değer görülebilir ama değiştirilemez.

## 28.3. Loading nedir?

İşlem devam ediyordur, kullanıcı beklemektedir.

## 28.4. Kural

Bu üç durum asla aynı görsel/davranışsal sınıfta ele alınmamalıdır.

## 28.5. Zayıf davranışlar

- loading state’i disabled gibi göstermenin kullanıcıyı yanıltması,
- readonly alanı disabled gibi göstermek,
- neden kullanılamadığı belli olmayan pasif arayüz.

---

# 29. Multi-Step Form Stratejisi

## 29.1. Ne zaman gerekir?

- bilgi yoğunluğu yüksekse,
- doğal aşamalar varsa,
- tek ekranda yük çok artıyorsa,
- adımlar birbirine anlamlı biçimde bağlıysa.

## 29.2. Kurallar

- step mantığı kullanıcıya açık olmalı
- ilerleme hissi olmalı
- geri dönüş mümkün olmalı
- adım değişiminde veri kaybı olmamalı
- step bazlı validation ile final validation ayrılmalı
- kullanıcı hangi aşamada takıldığını anlamalı

## 29.3. Zayıf multi-step davranışlar

- sadece uzun diye formu parçalamak,
- hangi adımda olduğunun belirsizliği,
- geri dönünce verinin kaybolması,
- her step geçişinde gereksiz sert validation.

---

# 30. Long Form Stratejisi

## 30.1. Uzun formlar neden zordur?

- kullanıcı yorgunluğu
- hata oranı
- veri kaybı riski
- keyboard ve scroll sorunları
- focus yönetimi
- section navigation ihtiyacı

## 30.2. Kurallar

- mantıklı section’lara bölünmeli
- görsel hiyerarşi güçlü olmalı
- gerekiyorsa sticky action veya step yaklaşımı düşünülmeli
- long form’larda auto-save veya draft mantığı ürün kararına göre değerlendirilmeli
- field yoğunluğu ergonomik olmalı

---

# 31. Keyboard ve Focus Davranışı

## 31.1. Mobile için

- klavye açılınca aktif alan görünür kalmalı
- next/done/go davranışları input türüne uygun olmalı
- alanlar arası geçiş doğal olmalı
- bottom action klavye ile çatışmamalı

## 31.2. Web için

- tab order mantıklı olmalı
- keyboard ile form tamamlanabilir olmalı
- odak kaybı yaşanmamalı
- submit ve escape davranışları bağlama göre anlamlı olmalı

## 31.3. Zayıf davranışlar

- klavye açılınca alanın görünmemesi,
- next tuşunun anlamsız davranması,
- focus’un submit sonrası yanlış yere gitmesi,
- hata sonrası ilgili alana yönlendirmemek.

---

# 32. A11y ve Form İlişkisi

## 32.1. Zorunlu alanlar

Her formda şu alanlar düşünülmelidir:
- label ilişkisi
- helper ve error text bağlantısı
- role / hint
- focus order
- error announcement
- touch target
- contrast
- keyboard support
- screen reader açıklığı

## 32.2. Kural

Form erişilebilirliği ek iş değil, form kalitesinin kendisidir.

---

# 33. Unsaved Changes ve Draft Recovery

## 33.1. Ne zaman gereklidir?

- uzun formlar
- kritik düzenleme akışları
- multi-step süreçler
- kullanıcı zaman yatırımı yüksek formlar

## 33.2. Olası yaklaşımlar

- warn before leave
- autosave
- draft persist
- explicit save/discard
- recover last draft

## 33.3. Kural

Bu davranış ürün türüne göre karar verilmelidir.
Ama hiç düşünmeden geçilmemelidir.

---

# 34. Form ve Data Mutation İlişkisi

## 34.1. Initial load
Formun başlangıç değerleri nereden geliyor?

## 34.2. Draft editing
Kullanıcı neyi değiştiriyor?

## 34.3. Submit mapping
Form shape → domain/transport shape nasıl dönüşüyor?

## 34.4. Mutation sonucu
Başarılıysa ne olur?
Hatalıysa ne olur?
Conflict olursa ne olur?

## 34.5. Kural

Form sistemi data layer ile uyumlu olmalı; birbirini ezmemeli.

---

# 35. Form Anti-Pattern Listesi

Aşağıdaki davranışlar bu proje kapsamında zayıf kabul edilir:

1. Label yerine placeholder kullanmak
2. Validation zamanlamasını rastgele bırakmak
3. Her hata için yalnızca toast göstermek
4. Error/helper text’i karıştırmak
5. Form state ile server data’yı ayırmamak
6. Dirty/pristine mantığını tanımlamamak
7. Duplicate submit’e izin vermek
8. Multi-step akışta veri kaybetmek
9. Mobile keyboard/focus davranışını düşünmemek
10. Web keyboard kullanımını ihmal etmek
11. Required/optional mantığını belirsiz bırakmak
12. Field-level ve form-level validation’ı karıştırmak
13. Server-side validation’ı kullanıcıya kötü map etmek
14. Başarı sonrası davranışı belirsiz bırakmak
15. Unsaved changes riskini görmezden gelmek

---

# 36. Form Kararı Verirken Sorulacak Sorular

Bir form tasarlanırken şu sorular sorulmalıdır:

1. Kullanıcı bu formda tam olarak hangi görevi yapıyor?
2. Form tek ekranda mı, çok adımlı mı olmalı?
3. Hangi alanlar gerçekten gerekli?
4. Hangi validation türleri var?
5. Validation ne zaman çalışmalı?
6. Kullanıcı hata alınca neyi düzeltmesi gerektiğini anlayacak mı?
7. Submit sonrası ne olmalı?
8. Draft kaybı riski var mı?
9. Keyboard, focus ve touch ergonomisi yeterli mi?
10. Bu form erişilebilir ve tutarlı mı?
11. Form state ile server state ayrımı net mi?
12. Başarı/hata/retry davranışı açık mı?

---

# 37. Sonraki Dokümanlara Etkisi

## 37.1. Accessibility standard
`12-accessibility-standard.md`, form label/error/focus/announcement davranışlarını bu belgeyle uyumlu teknik seviyeye indirmelidir.

## 37.2. Performance standard
`13-performance-standard.md`, büyük formlar, validation maliyeti ve render yüzeyi etkilerini bu belgeyle uyumlu değerlendirmelidir.

## 37.3. Testing strategy
`14-testing-strategy.md`, validation, submit lifecycle, field interaction ve unsaved changes davranışlarını test yüzeylerine ayırmalıdır.

## 37.4. Component governance rules
`23-component-governance-rules.md`, input family ve field shell contract’larını bu belgeyle uyumlu yönetecektir.

## 37.5. Error / empty / loading states
`25-error-empty-loading-states.md`, submit sonrası ve form-level feedback surface’lerini bu belgeyle uyumlu açmalıdır.

## 37.6. ADR-006 ilişkisi
`ADR-006-forms-and-validation.md`: Bu belgedeki form state ownership, validation katmanları ve submit lifecycle kuralları, ADR-006’da verilen React Hook Form + Zod kararının stratejik detaylandırmasıdır. ADR-006, bu belgenin canonical karar otoritesidir.

---

# 38. Onay Kriterleri

Bu doküman yeterli kabul edilir eğer:

1. Form konusu yalnızca input dizisi seviyesinde bırakılmamışsa,
2. Field shell, label, helper, error ve submit lifecycle açıkça tanımlanmışsa,
3. Validation katmanları ve zamanlaması ayrılmışsa,
4. Dirty/pristine, touched/untouched, initial value ve draft ilişkisi açıklanmışsa,
5. Multi-step, long form, keyboard/focus ve unsaved changes davranışları düşünülmüşse,
6. Form ile data mutation ilişkisi kurulmuşsa,
7. Sonraki a11y, test ve component governance dokümanlarına uygulanabilir temel sağlanmışsa.

---

# 39. Kısa Sonuç

Bu dokümanın ana çıktısı şudur:

> Bu boilerplate kapsamında formlar, yalnızca input yerleştirme alanı değil; kullanıcının veri üretme ve düzeltme görevini güvenli, anlaşılır, erişilebilir ve geri toparlanabilir biçimde tamamlamasını sağlayan görev sistemleridir.

Bu nedenle bundan sonraki hiçbir doküman:
- placeholder’ı label yerine koyamaz,
- validation’ı rastgele zamanlayamaz,
- form state ile server state’i aynı şeymiş gibi ele alamaz,
- submit davranışını belirsiz bırakamaz,
- multi-step ve draft kaybı riskini görmezden gelemez.
