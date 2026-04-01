# 34-hig-enforcement-strategy.md

## Doküman Kimliği

- **Doküman adı:** HIG Enforcement Strategy
- **Dosya adı:** `34-hig-enforcement-strategy.md`
- **Doküman türü:** Strategy / enforcement / compliance governance document
- **Durum:** Accepted
- **Kapsam:** Bu boilerplate kapsamında Apple Human Interface Guidelines uyumunun yalnızca niyet veya manuel dikkat düzeyinde kalmaması için; lint kuralları, runtime checks, CI gates, exemption modeli, audit desteği ve rule lifecycle üzerinden nasıl enforce edileceğini tanımlar.
- **Bağlı olduğu üst dokümanlar:**
  - `03-ui-ux-quality-standard.md`
  - `04-design-system-architecture.md`
  - `12-accessibility-standard.md`
  - `15-quality-gates-and-ci-rules.md`
  - `16-tooling-and-governance.md`
  - `22-design-tokens-spec.md`
  - `23-component-governance-rules.md`
  - `24-motion-and-interaction-standard.md`
  - `31-audit-checklist.md`
  - `32-definition-of-done.md`
  - `33-visual-implementation-contract.md`
- **Doğrudan etkileyeceği dokümanlar:**
  - `31-audit-checklist.md`
  - `32-definition-of-done.md`
  - `33-visual-implementation-contract.md`
  - `35-document-map.md`

---

# 1. Amaç

Bu dokümanın amacı, Apple Human Interface Guidelines uyumunu soyut kalite hedefi olmaktan çıkarıp; **ölçülebilir, denetlenebilir, kural tabanlı ve istisna yönetimi olan çalışan bir enforcement sistemine** dönüştürmektir.

Bu belge şu sorulara net cevap verir:

1. HIG uyumu bu projede neden manuel review’a bırakılamaz?
2. Hangi HIG alanları otomatik veya yarı otomatik denetlenebilir?
3. Hangi alanlar lint ile, hangileri runtime check ile, hangileri audit ile korunmalıdır?
4. CI içinde HIG uyumu nasıl blocker/major/minor seviyelerine bağlanmalıdır?
5. Exemption nasıl verilir, nasıl izlenir, ne zaman kaldırılır?
6. HIG score veya benzeri kalite sinyalleri nasıl yorumlanmalıdır?
7. Rule lifecycle nasıl işletilmelidir?
8. Hangi enforcement davranışları doğrudan zayıf kabul edilir?

Bu belge Apple HIG’nin tamamını yeniden yazmaz.
Bu belge, bu proje içinde HIG uyumunu **işletecek mekanizmayı** tanımlar.

---

# 2. Neden Bu Doküman Gerekli

Apple HIG’ye önem verdiğini söyleyen çok proje vardır.
Ama büyük kısmında şu gerçek olur:

- HIG yalnızca tasarım sohbetlerinde anılır,
- implementasyon aşamasında geliştirici inisiyatifine bırakılır,
- review sırasında birkaç belirgin ihlal fark edilirse düzeltilir,
- sistematik ihlaller birikir,
- zaman baskısı arttıkça HIG “nice to have” seviyesine iner.

Bunun sonucu şudur:

- küçük hit target’lar yayılır,
- safe area ihlalleri normalleşir,
- yanlış button hierarchy çoğalır,
- a11y prop eksikleri birikir,
- motion reduced-motion uyumu bozulur,
- color semantics ve contrast alanında sapmalar artar,
- app iOS kalitesi taşımayan ama “genel olarak iyi” görünen yüzeylere dönüşür.

Bu proje kapsamında HIG uyumu:
- elle hatırlanacak iyi niyet notu,
- tasarımcı/developer sezgisine kalacak konu,
- yalnızca final audit aşamasında bakılacak detay
değildir.

---

# 3. Temel Tez

Bu proje kapsamında temel tez şudur:

> Apple HIG uyumu sürdürülebilir olmak istiyorsa, kurallar otomatik yakalanabilen alanlarda koda gömülü enforcement, otomatik yakalanamayan alanlarda ise checklist ve audit desteği ile korunmalıdır; aksi halde HIG kalite hedefi zamanla slogan seviyesine düşer.

Bu tez şu sonuçları doğurur:

1. HIG uyumu için tooling gerekir.
2. Ama tooling tek başına yetmez; audit de gerekir.
3. HIG kuralları severity bazlı sınıflandırılmalıdır.
4. Exemption kültürü görünür ve sınırlı olmalıdır.
5. Yeni kural eklemek için rule lifecycle düşünülmelidir.
6. HIG score benzeri sinyaller bağlamsız KPI değil, kalite göstergesidir.

---

# 4. Enforcement Modelinin Katmanları

Bu proje kapsamında HIG enforcement şu katmanlardan oluşmalıdır:

1. **Design system foundations**
2. **Static analysis / lint**
3. **Runtime development checks**
4. **CI gates**
5. **Manual audit / review**
6. **Exemption tracking**
7. **Rule lifecycle governance**

Bu katmanlar birbirinin yerine geçmez; tamamlayıcıdır.

---

# 5. Katman 1 — Design System Foundations

## 5.1. Neden ilk katman budur?

HIG’ye uyumun en ucuz yolu, doğru davranışı varsayılan hale getirmektir.
Yanlış davranışı sonradan avlamak tek başına yeterli değildir.

## 5.2. Tasarım sistemi üzerinden enforce edilebilecek alanlar

- semantic color kullanımı
- minimum touch target yaklaşımı
- button hierarchy standardı
- focus and visible states
- safe spacing ritmi
- field shell tutarlılığı
- motion tokenları
- disabled/selected/error görünürlüğü

## 5.3. Kural

HIG enforcement’ın önemli bölümü design system’e gömülmelidir.
Yani:
- primitive doğruysa,
- reusable component doğruysa,
- token semantic’i doğruysa
geliştirici yanlış yapmaya daha az ihtiyaç duyar.

## 5.4. Zayıf davranışlar

- HIG’yi yalnızca lint ile çözmeye çalışmak
- primitive/component contract’ı zayıf bırakıp sonra ihlal avlamak
- design system dışında yaygın UI inşasına izin vermek

---

# 6. Katman 2 — Static Analysis / Lint

## 6.1. Neden kritik?

Statik kurallar, çok sayıda sistematik ihlali kod çalışmadan yakalayabilir.

## 6.2. Statik kurala uygun alanlar

Aşağıdaki HIG ile ilişkili alanlar güçlü lint adaylarıdır:

- hardcoded color yasağı
- interactive öğelerde a11y prop beklentileri
- yasaklı raw platform component kullanımı
- minimum touch targetı doğrudan kıran pattern’ler
- safe area kullanımı gereken kök yüzeyler
- reduced motion guard gerektiren motion pattern’leri
- text role / body size minimumları (bazı durumlarda)
- direct import bypass’ları
- inline style/hardcoded spacing/radius değerleri
- Button/Pressable family outside DS kullanımının sınırlandırılması

## 6.3. Kural

Statik kurallar:
- net problem çözmeli
- düşük yanlış pozitif üretmeli
- mesajları açıklayıcı olmalı
- ilgili standarda bağlanabilmeli

## 6.4. Zayıf davranışlar

- HIG adı altında belirsiz veya gürültülü kurallar eklemek
- her hoşnutsuz UI kararını lint konusu yapmak
- false positive yüzünden geliştiriciyi kural kapatmaya itmek

---

# 7. Katman 3 — Runtime Development Checks

## 7.1. Neden gerekir?

Bazı HIG/a11y/interaction problemleri yalnızca runtime’da ölçülebilir veya daha anlamlı görünür.

## 7.2. Güçlü runtime check alanları

- touch target ölçümü
- focus visibility / state exposure sinyalleri
- missing accessibility metadata (bazı wrapper yüzeylerinde)
- reduced motion uyum kontrolü
- contrast risk sinyalleri
- safe area misuse uyarıları
- navigation bar / modal presentation health hints
- excessive animation / layout jank uyarıları (seçimli)

## 7.3. Kural

Runtime checks:
- dev-only olmalı
- gürültü üretmemeli
- actionably mesaj vermeli
- prod davranışını bozmamalı

## 7.4. Zayıf davranışlar

- prod’a sızan runtime warnings
- her ekranda kırmızı uyarı yağmuru
- geliştiricinin tamamen görmezden geleceği kadar fazla sinyal

---

# 8. Katman 4 — CI Gates

## 8.1. Neden gerekir?

HIG ihlalleri lokal dikkat eksikliğinden kurtulup resmi kalite kapısına bağlanmalıdır.

## 8.2. CI’da değerlendirilecek alanlar

- lint tabanlı HIG ihlalleri
- a11y rule failures
- exemption budget aşımı
- DS bypass pattern’leri
- belirli runtime audit sonuçlarının raporu (varsa)
- HIG score/trend raporları
- görsel ve manuel audit gerektiren alanlar için işaretleme

## 8.3. Kural

CI, HIG uyumunu:
- blocker,
- major,
- minor
seviyeleriyle anlamlı biçimde değerlendirmelidir.

## 8.4. Zayıf davranışlar

- HIG ihlallerini sadece warning olarak bırakmak
- hiçbir trend görünürlüğü sunmamak
- exemption sayısını izlememek

---

# 9. Katman 5 — Manual Audit / Review

## 9.1. Neden zorunlu?

HIG’nin önemli kısmı salt AST veya runtime ölçümle tam yakalanamaz.

Örnek:
- premium ton
- hierarchy dengesi
- CTA önceliği
- modal akışın doğallığı
- iOS hissiyatı
- content density
- affordance kalitesi

## 9.2. Kural

Bu alanlar `31-audit-checklist.md` ve `33-visual-implementation-contract.md` ile birlikte manuel değerlendirilmelidir.

## 9.3. Zayıf davranışlar

- otomatik kural var diye audit’i gereksiz sanmak
- HIG’yi yalnızca lint pass/fail seviyesine indirgemek

---

# 10. Katman 6 — Exemption Tracking

## 10.1. Neden gerekir?

Hiç istisna olmaması ideal olabilir ama gerçek hayatta bazı kontrollü istisnalar kaçınılmazdır.
Sorun istisnanın varlığı değil, görünmez ve sınırsız olmasıdır.

## 10.2. Exemption ne zaman düşünülebilir?

- gerçek platform kısıtı varsa
- üçüncü parti entegrasyon yüzünden geçici boşluk oluşuyorsa
- migration sürecinde kısa süreli teknik borç açılmışsa
- kurala uymak şu aşamada orantısız maliyet doğuruyorsa

## 10.3. Exemption asla şu nedenlerle verilmemelidir

- “şimdilik uğraşmayalım”
- “bu küçük detay”
- “zaten çalışıyor”
- “sonra belki bakarız”
- “kural çok sıkı geldi”

## 10.4. Her exemption kaydında bulunması gerekenler

- kural ID
- etkilenen dosya/alan
- gerekçe
- risk açıklaması
- geçici mi kalıcı mı
- hedef kapanış tarihi/koşulu
- onaylayan kişi/rol
- takip issue/ADR bağlantısı

## 10.5. Zayıf davranışlar

- sessiz `eslint-disable`
- yorum satırı bile olmadan bypass
- aynı exemption’ı sürekli tekrar etmek
- süresiz exemption kültürü

---

# 11. Katman 7 — Rule Lifecycle Governance

## 11.1. Neden gerekir?

Her kural ilk gün blocker yapılmaz.
Her kural sonsuza kadar aynı biçimde de kalmaz.

## 11.2. Rule lifecycle aşamaları

1. Problem tanımı
2. Kural tasarımı
3. Pilot sinyal dönemi
4. Warning dönemi
5. Blocker/major enforcement dönemi
6. Etki ve noise gözden geçirmesi
7. Gerekirse sadeleştirme veya kaldırma

## 11.3. Kural

Kural eklemek kadar, kuralın işe yarayıp yaramadığını izlemek de governance işidir.

## 11.4. Zayıf davranışlar

- tek şikayetle kural eklemek
- noise ölçmeden blocker yapmak
- rule effectiveness değerlendirmesi hiç yapmamak

---

# 12. HIG Kural Alanları

Bu proje kapsamında enforcement için düşünülmesi gereken HIG ilişkili ana alanlar şunlardır:

1. Touch target and control ergonomics
2. Safe area and edge behavior
3. Accessibility metadata and semantics
4. Typography readability and hierarchy
5. Motion and reduced motion compliance
6. Selection, feedback and state visibility
7. Navigation and modal presentation behavior
8. Color semantics and contrast
9. Button hierarchy and action clarity
10. Input/field usability
11. Platform-consistent affordances
12. Visual clarity and premium tone

Her biri için aşağıda enforcement yaklaşımı verilmiştir.

---

# 12.1. HIG Alanı ↔ Enforcement Katmanı Eşleştirmesi

Aşağıdaki tablo, her HIG alanı için hangi enforcement katmanının birincil (P) ve ikincil (S) olduğunu gösterir:

| HIG Alanı | Design System | Lint/Static | Runtime Check | CI Gate | Manual Audit |
|---|---|---|---|---|---|
| Touch target | S | S | **P** | — | S |
| Safe area | — | **P** | S | — | S |
| A11y metadata | S | **P** | S | S | S |
| Typography | **P** | S | — | — | S |
| Motion | **P** | S | S | — | S |
| State visibility | **P** | — | S | — | S |
| Navigation/modal | S | — | S | — | **P** |
| Color/contrast | S | **P** | S | S | — |
| Button hierarchy | **P** | — | — | — | S |
| Input/field | **P** | S | — | — | S |
| Premium tone | — | — | — | — | **P** |
| Visual clarity | S | — | — | — | **P** |

**P** = Primary (birincil enforcement katmanı), **S** = Secondary (destekleyici katman), **—** = bu katman doğrudan uygulanabilir değil.

Bu eşleştirme, her alan için hangi enforcement mekanizmasının öncelikli olduğunu ve hangi katmanların destekleyici rol oynadığını görünür kılar.

---

# 13. Touch Target Enforcement

## 13.1. Hedef

Interactive öğelerin yeterli hit area taşımasını sağlamak.

## 13.2. Enforce mekanizmaları

- DS primitives’te default min target yaklaşımı
- lint ile belirli yanlış pattern’lerin yasaklanması
- runtime measurement checks
- manual audit for dense/edge cases

## 13.3. Blocker/major örnekleri

- çok küçük icon-only actions
- tap target’ı bariz küçük olan kritik kontroller
- sık kullanılan control ailelerinde sistematik küçük target’lar

## 13.4. Zayıf davranışlar

- küçük hedefleri “tasarım böyle” diyerek bırakmak
- dense layout bahanesiyle hit area düşürmek

---

# 14. Safe Area Enforcement

## 14.1. Hedef

Özellikle mobil kök yüzeylerin ve overlay’lerin güvenli alan mantığına uygun davranması.

## 14.2. Enforce mekanizmaları

- root shell ve screen scaffold içinde safe area abstraction
- lint ile safe area beklenen kök pattern’leri kontrol etme
- runtime dev warnings for obvious edge overlap
- manual audit for device/class variations

## 14.3. Zayıf davranışlar

- root ekranı çıplak bırakmak
- safe area’yı feature-level hack’lerle çözmek
- notch/home indicator alanlarını ihlal etmek

---

# 15. Accessibility Metadata Enforcement

## 15.1. Hedef

Interactive öğelerde role/name/state bilgisinin sistematik eksik olmamasını sağlamak.

## 15.2. Enforce mekanizmaları

- custom lint rules
- DS component contract’ları
- runtime warnings for obvious missing metadata
- component tests
- manual screen reader audits

## 15.3. Örnek rule adayları

- unlabeled icon button yasağı
- interactive element name zorunluluğu
- field error/helper ilişki beklentileri
- toggle/tab/expanded state exposure kuralları

## 15.4. Zayıf davranışlar

- a11y’yi screen implementasyonuna bırakmak
- reusable component’te metadata’yı opsiyonel sanmak

---

# 16. Typography Readability Enforcement

## 16.1. Hedef

Okunabilirlik ve hiyerarşinin bozulmaması.

## 16.2. Enforce mekanizmaları

- semantic typography tokens
- lint ile raw/hardcoded typography kullanımını azaltma
- body/min text role alt sınırı için seçili kurallar
- manual audit for density and hierarchy

## 16.3. Zayıf davranışlar

- küçük text’i sıkışsın diye azaltmak
- body text’i keyfi küçültmek
- semantic role yerine rastgele size kullanmak

---

# 17. Motion ve Reduced Motion Enforcement

## 17.1. Hedef

Motion’ın sistematik ve erişilebilir olmasını sağlamak.

## 17.2. Enforce mekanizmaları

- motion tokens
- DS/component motion contracts
- lint ile bazı motion bypass pattern’leri
- runtime reduced-motion checks
- manual audit for transition tone and motion density

## 17.3. Rule adayları

- reduced-motion guard beklenen motion surfaces
- hardcoded duration/easing kullanımının kısıtlanması
- yasaklı aşırı decorative animation pattern’leri

## 17.4. Zayıf davranışlar

- motion değerlerini component içinde keyfi vermek
- reduced motion desteğini unutmak
- navigation ile component motion dillerini koparmak

---

# 18. State Visibility Enforcement

## 18.1. Hedef

Focused, selected, disabled, loading, invalid gibi state’lerin görünmez veya belirsiz kalmamasını sağlamak.

## 18.2. Enforce mekanizmaları

- reusable component contracts
- token/semantic state color rules
- lint ile bazı state omission pattern’leri
- component tests
- manual visual audit

## 18.3. Zayıf davranışlar

- idle doğru ama disabled/focus yanlış
- selected ve hover farkının kaybolması
- invalid state’in yalnızca renk ile verilmesi

---

# 19. Navigation ve Modal Presentation Enforcement

## 19.1. Hedef

Navigation ve overlay davranışlarının HIG uyumlu yön duygusu ve kullanıcı beklentisi taşımasını sağlamak.

## 19.2. Enforce mekanizmaları

- navigation rules docs
- reusable presentation primitives/patterns
- bazı lint/boundary kuralları
- runtime health checks for modal misuse (sınırlı)
- manual audit for flow quality

## 19.3. Zayıf davranışlar

- yanlış presentation surface seçimi
- modal/sheet/dialog’ı rastgele kullanmak
- back/dismiss mantığını belirsiz bırakmak

---

# 20. Color Semantics ve Contrast Enforcement

## 20.1. Hedef

Color kullanımının semantik ve okunabilir olmasını sağlamak.

## 20.2. Enforce mekanizmaları

- semantic token mecburiyeti
- raw color yasağı
- contrast risk runtime checks (seçimli)
- manual audit for nuanced surfaces
- HIG/DS visual checklist

## 20.3. Zayıf davranışlar

- raw palette tüketimi
- selected/error/focus state renklerini keyfi çözmek
- contrast riskini hiç ölçmemek

---

# 21. Button Hierarchy and Action Clarity Enforcement

## 21.1. Hedef

Birincil/ikincil/yıkıcı aksiyon dengesinin tutarlı kalması.

## 21.2. Enforce mekanizmaları

- DS button family
- button variant governance
- visual audit
- screenshot-faithful review
- PR visual proof requirement

## 21.3. Zayıf davranışlar

- her ekranda birden fazla primary ağırlık
- destructive action ayrışmasının zayıf olması
- button hierarchy’yi feature bazında keyfi değiştirmek

---

# 22. Input / Field Usability Enforcement

## 22.1. Hedef

Input ve form yüzeylerinin HIG ve a11y açısından güvenilir olmasını sağlamak.

## 22.2. Enforce mekanizmaları

- field shell standardı
- reusable form components
- a11y lint rules
- tests for field states
- manual form audit

## 22.3. Zayıf davranışlar

- placeholder-only yaklaşımı
- helper/error relation eksikliği
- input state görünürlüğünün zayıf olması
- keyboard ergonomisini feature bazında rastgele çözmek

---

# 23. Premium Tone ve Visual Clarity Enforcement

## 23.1. Neden en zor alan?

Bu alanın tamamı otomatik ölçülemez.
Ama tamamen öznel de bırakılamaz.

## 23.2. Enforce mekanizmaları

- visual implementation contract
- design token discipline
- component governance
- review checklist
- manual audit with explicit criteria

## 23.3. Kriter örnekleri

- hierarchy netliği
- gereksiz gürültü yokluğu
- state clarity
- spacing ritmi
- surface language consistency
- interaction feedback kalitesi

## 23.4. Zayıf davranışlar

- “premium”i parlak efekt sanmak
- HIG dilini visual noise ile bozmak
- görsel kaliteyi tam öznel sanıp ölçüsüz bırakmak

---

# 24. Severity Modeli

HIG ihlalleri şu şekilde ele alınmalıdır:

## 24.1. Blocker
- ciddi a11y eksikleri
- çok küçük touch targets
- safe area ihlalleri
- kritik action clarity hataları
- severe navigation/presentation misuse
- belirgin contrast failure

## 24.2. Major
- DS bypass pattern’leri
- state visibility zayıflıkları
- reduced-motion uyum eksikleri
- button hierarchy bozulmaları
- typography/readability sorunları

## 24.3. Minor
- hafif spacing/hierarchy sapmaları
- küçük visual inconsistency
- cleanup gerektiren ama kullanıcıyı hemen kırmayan HIG sapmaları

## 24.4. Informational
- trend notları
- kural sertleştirme adayları
- audit reminder niteliğindeki sinyaller

---

# 25. HIG Score / Trend Mantığı

## 25.1. Neden score düşünülmeli?

Tek tek ihlaller kadar, genel kalite yönü de görünür olmalıdır.

## 25.2. Kural

Score tek başına hedef değil, trend göstergesi olmalıdır.

## 25.3. Olası yaklaşım

- Blocker > en yüksek ağırlık
- Major > orta ağırlık
- Minor > düşük ağırlık
- Exemption budget ayrı takip

## 25.4. Uyarı

Score gamification’a dönüşmemelidir.
Ama kalite düşüşü ve iyileşmesi görünür olmalıdır.

---

# 26. Exemption Budget Yaklaşımı

## 26.1. Neden budget gerekir?

İstisnalar sayı ve yayılım açısından görünmezse sistem delinmiş olur.

## 26.2. Kural

Exemption’lar:
- sayıca izlenmeli
- rule/folder/component bazında görülebilmeli
- artış trendi alarm üretmeli
- kapanma planı içermeli

## 26.3. Zayıf davranışlar

- exemption sayısını hiç bilmemek
- yeni kural geldikçe exemption patlamasını normal görmek
- aynı ekip/dosya alanında sürekli exemption birikmesi

---

# 27. HIG Rule Authoring İlkeleri

Yeni HIG kuralı yazılırken şu sorular sorulmalıdır:

1. Hangi HIG problemini çözüyor?
2. Bu kural otomatik yakalanabilir mi?
3. Noise seviyesi kabul edilebilir mi?
4. Kural static mi, runtime mı, audit mi olmalı?
5. Blocker mı, warning mi?
6. Doğru çözüm için DS/primitive desteği var mı?
7. Exemption gerçekten nadir mi olacak?
8. Kural açıklaması geliştiricinin ne yapması gerektiğini söylüyor mu?

---

# 28. HIG Enforcement için Önerilen Operasyon Akışı

## 28.1. Geliştirici aşaması
- editor sinyalleri
- local lint/type/a11y checks
- reusable component contracts
- visual proof / audit düşüncesi

## 28.2. PR aşaması
- CI rule checks
- exemption görünürlüğü
- visual implementation review
- cross-platform and a11y review

## 28.3. Audit aşaması
- otomatik yakalanamayan kalite alanları
- premium tone
- hierarchy
- navigation/presentation hissi
- platform HIG uygunluğu

## 28.4. Trend aşaması
- score / exemption budget / recurring rule failures
- rule effectiveness review

---

# 29. HIG Enforcement Anti-Pattern Listesi

Aşağıdaki davranışlar bu proje kapsamında zayıf kabul edilir:

1. HIG’yi yalnızca “tasarım dikkat etsin” diye bırakmak
2. Design system kurmadan lint ile HIG çözmeye çalışmak
3. Gürültülü ve anlamsız kurallarla ekipte kural yorgunluğu üretmek
4. Runtime uyarıları prod’a sızdırmak
5. Exemption’ları kayıtsız bırakmak
6. Aynı ihlalleri sürekli görüp kural/DS iyileştirmesi yapmamak
7. HIG score’u bağlamdan kopuk KPI yapmak
8. Manual audit gerektiren alanları otomasyon var sanıp atlamak
9. Severity modelini belirsiz bırakmak
10. Rule lifecycle hiç işletmemek
11. False positive yüzünden tüm kural ailesini kapatmak
12. HIG ihlallerini “küçük UI detayları” diye küçümsemek
13. Cross-platform adaptation ile HIG’yi karşı karşıya getirip kaliteyi düşürmek
14. A11y, touch target, safe area gibi kritik alanları warning seviyesinde bırakmak
15. HIG’yi yalnızca iOS görünümü taklidi sanmak

---

# 30. HIG Kararı Verirken Sorulacak Sorular

Bir HIG kuralı, ihlali veya exemption’ı değerlendirirken şu sorular sorulmalıdır:

1. Bu hangi HIG ilkesini etkiliyor?
2. Kullanıcıya etkisi ne?
3. Otomatik yakalanabilir mi?
4. Static mi runtime mı audit mi daha doğru?
5. Bu ihlal blocker mı, major mı?
6. DS seviyesinde önleme şansı var mı?
7. Exemption gerçekten gerekli mi?
8. Bu sorun tekrarlı mı yoksa tekil mi?
9. Bu kural geliştiriciyi doğru yöne itiyor mu?
10. Bu alan trend olarak kötüleşiyor mu?

---

# 31. Sonraki Dokümanlara Etkisi

## 31.1. Document map
`35-document-map.md`, HIG enforcement stratejisinin hangi belgelerden beslendiğini ve hangi kalite zincirinin içinde yer aldığını görünür kılmalıdır.

---

# 32. Onay Kriterleri

Bu doküman yeterli kabul edilir eğer:

1. HIG enforcement katmanları net tanımlanmışsa,
2. DS, lint, runtime checks, CI, audit ve exemptions birlikte düşünülmüşse,
3. Ana HIG alanları için enforcement yönü tanımlanmışsa,
4. Severity, score/trend ve exemption budget mantığı görünür kılınmışsa,
5. Rule lifecycle ve rule authoring ilkeleri yazılmışsa,
6. Anti-pattern’ler net biçimde tanımlanmışsa,
7. Document map ve genel kalite sistemiyle uygulanabilir bağ kurulmuşsa.

---

# 33. Kısa Sonuç

Bu dokümanın ana çıktısı şudur:

> Bu boilerplate kapsamında Apple HIG uyumu, tasarım hassasiyeti veya manuel dikkat düzeyinde bırakılmayacak; design system temeli, static analysis, runtime checks, CI gates, audit ve exemption governance birlikte çalışarak sürdürülebilir biçimde enforce edilecek bir kalite eksenidir.

Bu nedenle bundan sonraki hiçbir HIG yaklaşımı:
- yalnızca niyet beyanı seviyesinde kalamaz,
- yalnızca manuel review’a bırakılamaz,
- exemption’ları görünmez ve sınırsız yönetemez,
- kritik HIG alanlarını küçük UI detayı gibi görüp erteleyemez.
