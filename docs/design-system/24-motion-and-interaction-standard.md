# 24-motion-and-interaction-standard.md

## Doküman Kimliği

- **Doküman adı:** Motion and Interaction Standard
- **Dosya adı:** `24-motion-and-interaction-standard.md`
- **Doküman türü:** Standard / interaction design / motion governance document
- **Durum:** Accepted
- **Kapsam:** Bu boilerplate kapsamında hareket ve etkileşim kalitesinin ne anlama geldiğini, motion’ın hangi amaçlarla kullanılacağını, hangi durumlarda kullanılmayacağını, component ve navigation düzeyindeki motion contract’larını, feedback davranışlarını, basma/odak/hover/selection/transition state’lerini ve reduced motion uyumunu tanımlar.
- **Bağlı olduğu üst dokümanlar:**
  - `03-ui-ux-quality-standard.md`
  - `05-theming-and-visual-language.md`
  - `08-navigation-and-flow-rules.md`
  - `12-accessibility-standard.md`
  - `13-performance-standard.md`
  - `22-design-tokens-spec.md`
  - `23-component-governance-rules.md`
  - `ADR-007-styling-tokens-and-theming-implementation.md`
- **Doğrudan etkileyeceği dokümanlar:**
  - `25-error-empty-loading-states.md`
  - `30-contribution-guide.md`
  - `31-audit-checklist.md`
  - `32-definition-of-done.md`
  - `34-hig-enforcement-strategy.md`
  - `35-document-map.md`

---

# 1. Amaç

Bu dokümanın amacı, boilerplate kapsamında motion ve interaction kalitesini “animasyon olsun” veya “dokununca bir şeyler hareket etsin” seviyesinden çıkarıp, kullanıcı yön duygusunu, premium hissiyatı, erişilebilirliği, performansı ve tutarlı davranışı destekleyen denetlenebilir standarda dönüştürmektir.

Bu belge şu sorulara net cevap verir:

1. Motion bu projede ne işe yarar?
2. Motion hangi amaçlarla kullanılmalıdır, hangi amaçlarla kullanılmamalıdır?
3. Navigation transition, modal/sheet açılışları, button press, focus, selection, accordion, tabs ve feedback motion’ları nasıl düşünülmelidir?
4. Interaction state’leri hangi düzeyde görünür olmalıdır?
5. Motion ile responsiveness nasıl birlikte korunmalıdır?
6. Reduced motion tercihi sistem genelinde nasıl ele alınmalıdır?
7. Motion tokenları ile runtime davranış nasıl bağlanmalıdır?
8. Hangi motion ve interaction davranışları doğrudan zayıf kabul edilir?

Bu belge animasyon kütüphanesi seçmez.
Ama seçilecek yaklaşımın hangi kalite ve davranış kurallarını karşılaması gerektiğini sabitler.

---

# 2. Neden Bu Doküman Gerekli

Motion ve interaction dili tanımlanmamış projelerde genellikle şu problemler görülür:

- bazı ekranlar çok hareketli, bazıları tamamen cansız olur,
- button press feedback bileşenden bileşene değişir,
- modal ve sheet geçişleri birbirinden kopuk hissettirir,
- selection state bazen yalnızca renkle, bazen yalnızca hareketle anlatılır,
- navigation geçişleri kullanıcıya yön değil sürtünme verir,
- reduced motion unutulur,
- animasyon süreleri component içinde rastgele verilir,
- hover/focus/pressed state’ler sistem değil geliştirici tercihi haline gelir,
- motion premium kalite katmak yerine amatörlük hissi üretir.

Bu proje kapsamında motion:
- süsleme aracı,
- dribbble etkisi,
- boşluk doldurma hilesi
olarak görülmemelidir.

Doğru motion ve interaction sistemi şu alanlarda çalışır:
- yön verir,
- tepki verir,
- bağlam değişimini açıklar,
- state değişimini görünür kılar,
- etkileşimi güvenilir hissettirir,
- ama kullanıcıyı bekletmez ve yormaz.

---

# 3. Temel Tez

Bu proje kapsamında temel tez şudur:

> Motion, görsel gösteri değil; kullanıcıya yön, durum, tepki, hiyerarşi ve bağlam değişimi hakkında kontrollü bilgi veren; interaction state’leri ile birlikte tutarlı çalışan ve reduced motion ile performans kısıtlarını ciddiye alan sistem davranışıdır.

Bu tez şu sonuçları doğurur:

1. Her hareketin bir sebebi olmalıdır.
2. Sebepsiz hareket kalite değil gürültüdür.
3. Interaction feedback gecikmemeli, ama dramatize de edilmemelidir.
4. Navigation motion ile component motion aynı sistem dilini konuşmalıdır.
5. Reduced motion bir erişilebilirlik dipnotu değil, zorunlu davranıştır.
6. Motion token sistemi olmadan tutarlılık uzun vadede korunamaz.

---

# 4. Motion ve Interaction Kapsamı

Bu belge aşağıdaki alanları kapsar:

1. Press / tap feedback
2. Hover feedback
3. Focus feedback
4. Selection / active state transitions
5. Expand / collapse motion
6. Tabs / segmented control transitions
7. Modal / dialog / sheet presentation
8. Screen / route transitions
9. Loading / success / error feedback motion
10. Micro-interactions
11. Reduced motion behavior
12. Motion token consumption
13. Interaction state visibility

Bu alanlar birbirinden bağımsız ele alınmamalıdır.

---

# 5. Motion’ın Temel Amaçları

Bu proje kapsamında motion en fazla şu amaçlar için kullanılmalıdır:

## 5.1. Durum değişimi göstermek
Bir şey açıldı mı, kapandı mı, seçildi mi, yüklendi mi, tamamlandı mı?

## 5.2. Yön vermek
Yeni yüzey nereden geldi?
Bu geri mi, ileri mi, geçici mi, kalıcı mı?

## 5.3. Tepki vermek
Kullanıcı dokunduğunda sistem bunu algıladı mı?

## 5.4. Hiyerarşi kurmak
Overlay ile screen, pressed ile focused, selected ile idle arasında görsel seviye farkı var mı?

## 5.5. Belirsizliği azaltmak
Sistem çalışıyor mu, geçişte mi, beklemede mi?

## 5.6. Premium hissiyatı güçlendirmek
Ama bu sadece süslü animasyon demek değildir.
Daha çok:
- kontrollü tempo
- tutarlı feedback
- kararlı geçiş
- gereksiz sarsıntıdan kaçınma
anlamına gelir.

---

# 6. Motion’ın Kullanılmaması Gereken Amaçlar

Motion aşağıdaki amaçlarla kullanılmamalıdır:

1. Dikkat çekmek için rastgele hareket üretmek
2. Zayıf hiyerarşiyi hareketle gizlemeye çalışmak
3. Gecikmeyi “animasyonla kapatmak”
4. Kullanıcıyı bekletirken sistemi daha meşgul gibi göstermek
5. Her yeni component’e kimlik vermek için ayrı animasyon icat etmek
6. Success / error gibi kritik durumları yalnızca hareketle anlatmak
7. Tasarım zayıflığını “canlılık” ile örtmeye çalışmak

---

# 7. Interaction State Sistemi

Motion ve interaction standardı, şu temel state’lerin nasıl görüneceğini ve davranacağını düşünmelidir:

- idle
- hover
- focused
- pressed
- active
- selected
- expanded
- disabled
- loading
- invalid
- success-emphasis (gerekiyorsa)

Bu state’lerin bazıları yalnızca görsel, bazıları motion destekli olabilir.
Ama tamamı sistem diline bağlı olmalıdır.

---

# 8. Press / Tap Feedback Standardı

## 8.1. Neden kritik?

Basma geri bildirimi etkileşimin en temel güven sinyalidir.
Kullanıcı dokunduğunda sistemin bunu algıladığını hemen hissetmelidir.

## 8.2. Kural

Press feedback:
- hızlı olmalı
- kısa olmalı
- input gecikmesi hissi oluşturmamalı
- component ailesi içinde tutarlı olmalı
- çok dramatik olmamalı

## 8.3. Olası araçlar

- opacity change
- tonal surface shift
- subtle scale change
- elevation change
- border/emphasis shift

Tek yöntem şart değildir.
Ama sistem tutarlı olmalıdır.

## 8.4. Zayıf davranışlar

- butona basınca hiç tepki olmaması
- tepkinin çok geç gelmesi
- bir butonda scale, diğerinde opacity, diğerinde hiçbir şey olmaması
- aşırı zıplayan veya “oyuncak” hissi veren press animasyonları

---

# 9. Hover Feedback Standardı

## 9.1. Kapsam

Özellikle web ve pointer destekli yüzeyler için geçerlidir.

## 9.2. Kural

Hover:
- press ile karışmamalı
- focus ile karışmamalı
- yalnızca kozmetik değil, affordance desteği vermeli
- çok agresif olmamalı

## 9.3. Hover ne işe yarar?

- tıklanabilirlik sinyali
- yüzeyin aktif olabileceğini ima etmek
- bilgi yoğun yüzeylerde hedef seçimini kolaylaştırmak

## 9.4. Zayıf davranışlar

- hover’ın focus gibi görünmesi
- hover ile selected state’in ayırt edilememesi
- sadece bazı kritik etkileşimli öğelerde hover olması, bazılarında olmaması
- aşırı renk sıçraması veya sert gölge patlaması

---

# 10. Focus Feedback Standardı

## 10.1. Neden kritik?

Focus, erişilebilirlik ve keyboard kullanımının ana yüzeyidir.
Aynı zamanda yön duygusu sağlar.

## 10.2. Kural

Focus state:
- görünür olmalı
- hover’dan ayrışmalı
- selected/active ile karışmamalı
- theme içinde kaybolmamalı
- component ailesi boyunca tutarlı olmalı

## 10.3. Motion ilişkisi

Focus motion varsa çok hafif ve dikkatli olmalıdır.
Focus’un görünürlüğü hareketten değil, net durum göstergesinden gelmelidir.

## 10.4. Zayıf davranışlar

- focus ring yokluğu
- sadece hafif shadow değişimi ile focus geçiştirmek
- keyboard ile gezerken odak konumunun belirsiz kalması
- focus state’in reduced motion ile tamamen kaybolması

---

# 11. Selection ve Active State Motion

## 11.1. Kapsam

- selected card
- selected row
- active tab
- selected chip
- toggled control
- chosen option

## 11.2. Kural

Selection state:
- yalnızca anlık animasyon değil, kalıcı görsel state ile desteklenmeli
- color-only olmamalı
- geçişi yumuşak ama hızlı olmalı
- gesture ve click sonrası kararlı hissedilmeli

## 11.3. Zayıf davranışlar

- seçimin yalnızca bir an parlayıp sonra kaybolması
- selected ve hover farkının kaybolması
- selection animasyonunun gecikmeli veya yavaş olması
- active tab göstergesinin akışla uyumsuz hareket etmesi

## 11.4. Toggle/Switch, Checkbox ve Radio Button Animasyon Spesifikasyonu

Selection component'leri (toggle, checkbox, radio button), kullanıcının en sık etkileşime geçtiği bileşenlerdir. Bu bileşenlerin state değişimi animasyonu hızlı, net ve tutarlı olmalıdır. Yavaş animasyon "tepki vermiyor" hissi yaratır; aşırı animasyon ise "oyuncak" hissi verir.

### 11.4.1. Toggle Switch

Toggle switch, iki durumlu (açık/kapalı, evet/hayır) bir kontroldür. İki ana görsel elementi vardır: thumb (kayan daire) ve track (arka plan çubuğu).

**Thumb (kayan daire) animasyonu:**
- Thumb, track'in bir ucundan diğer ucuna kayar. Örneğin: kapalıyken (OFF) sol tarafta, açıkken (ON) sağ tarafta. RTL dillerde yönler tersine çevrilir.
- **Süre:** `duration-fast` (150ms). Toggle çok sık kullanılan bir kontrol olduğu için animasyon hızlı olmalıdır. 150ms, kullanıcının "tıkladım, değişti" hissini almasına yetecek kadar algılanabilir ama bekletmeyecek kadar kısadır.
- **Easing:** `easing-standard`. Standart easing, hareketin ne sert ne de yumuşak hissettirmesini sağlar.
- **Transform:** `translateX` kullanılır. `left` veya `margin` kullanılmaz (layout thrash riski).

**Track (arka plan) renk animasyonu:**
- Track rengi, thumb ile aynı sürede değişir. Örneğin: OFF state'inde gri (`surface-secondary` token), ON state'inde yeşil (`color-success` veya `color-primary` token).
- **Süre:** `duration-fast` (150ms) — thumb ile senkron.
- **Transition:** `background-color` transition'ı ile. Renk aniden değişmemeli, thumb kayarken arka plan rengi de eş zamanlı olarak geçiş yapmalıdır.

### 11.4.2. Checkbox

Checkbox, "seçili/seçili değil" (ve opsiyonel olarak "belirsiz/indeterminate") durumlarını gösteren bir kontroldür.

**Boş → İşaretli (check) geçişi:**
- Check işareti (✓), SVG `stroke-dasharray` ve `stroke-dashoffset` animasyonu ile çizilir. İşaret soldan sağa doğru çizilir (önce kısa bacak, sonra uzun bacak).
- **Süre:** `duration-instant` (100ms). Checkbox toggle'dan daha hızlı olmalıdır çünkü genellikle çoklu seçim listelerinde art arda tıklanır.
- **Kutucuk arka planı:** Boş kutucuktan (border-only) dolu kutucuğa (filled background + beyaz check) geçiş, aynı `duration-instant` sürede yapılır.

**İşaretli → Boş geçişi:**
- Check işareti fade-out ile kaybolur (opacity 1 → 0).
- **Süre:** `duration-instant` (100ms).
- Kutucuk arka planı dolu halden border-only haline aynı sürede döner.

### 11.4.3. Radio Button

Radio button, bir grup içinden yalnızca bir seçenek seçilmesini sağlayan kontroldür. İç daire (filled dot) ve dış halka (outer circle) olmak üzere iki görsel elementi vardır.

**Seçim yapılma (select) animasyonu:**
- Yeni seçilen radio button'un iç dairesi `scale(0)` → `scale(1)` ile belirir. Yani merkezden büyüyerek ortaya çıkar.
- **Süre:** `duration-instant` (100ms).
- **Easing:** Varsayılan veya `easing-standard`. 100ms'de easing farkı minimal olduğu için basit tutulabilir.

**Eski seçimin kaldırılması (deselect) animasyonu:**
- Eski seçili radio button'un iç dairesi `scale(1)` → `scale(0)` ile kaybolur. Merkeze doğru küçülerek kaybolur.
- **Süre:** `duration-instant` (100ms).
- Yeni seçim ve eski seçim kaldırma animasyonları **eş zamanlı** çalışır.

### 11.4.4. Opsiyonel scale pulse

Tüm selection component'lerinde (toggle, checkbox, radio button), state değişimi anında hafif bir **scale pulse** eklenebilir. Bu, tıklama anında bileşenin hafifçe büyüyüp eski boyutuna dönmesidir:

- **Hareket:** `scale(1.0)` → `scale(1.05)` → `scale(1.0)`.
- **Süre:** 100ms (toplam).
- **Bu opsiyoneldir, zorunlu değildir.** Eklenirse sistem genelinde tutarlı olmalıdır (ya tüm selection component'lerinde var ya da hiçbirinde yok). Bazılarında olup bazılarında olmaması tutarsızlık yaratır.
- Scale pulse, tıklama anında "dokunuşumun karşılığı var" hissini güçlendirir ama özellikle çok sayıda checkbox bulunan listelerde tekrarlı kullanımda yorucu olabilir. Bu durumda eklenmemesi tercih edilir.

---

# 12. Expand / Collapse Motion

## 12.1. Kapsam

- accordion
- disclosure sections
- expandable cards
- advanced filters
- nested settings groups

## 12.2. Kural

Expand/collapse motion:
- açılan içeriğin geldiğini hissettirmeli
- layout kırılmasına yol açmamalı
- çok uzun sürmemeli
- kullanıcıyı “ne oldu?” diye düşündürmemeli

## 12.3. Görsel destek

- chevron/indicator rotation
- content reveal
- spacing/border transition
- opacity + size transition kombinasyonu

## 12.4. Zayıf davranışlar

- aniden patlayan içerik
- çok yavaş açılma
- collapse sonrası layout sıçraması
- indicator ile gerçek içerik hareketinin senkron olmaması

---

# 13. Tabs ve Segmented Control Transition

## 13.1. Kural

Tabs ve segmented control geçişleri:
- section değişimini net hissettirmeli
- selected state’i görünür kılmalı
- performans dostu olmalı
- input gecikmesi üretmemeli

## 13.2. Kullanım ilkeleri

- indicator motion kontrollü olmalı
- label ve state değişimi senkron olmalı
- içerik değişiyorsa skeleton yerine mümkünse bağlam korunmalı
- geçiş çok dekoratif olmamalı

## 13.3. Zayıf davranışlar

- tab indicator’ın ağır, jank’li hareketi
- selected state’in yalnızca küçük tonal farkla verilmesi
- her tab geçişinde tüm ekranın dramatik animasyon alması
- active tab ile route context’in uyuşmaması

## 13.4. Tab Content Geçiş Davranışı

Kullanıcı bir tab’dan diğerine geçtiğinde, tab bar’daki indicator hareketi kadar önemli olan şey content area’nın nasıl değiştiğidir. Yanlış content geçişi, kullanıcıyı "sayfa mı değişti, içerik mi filtrelendi" konusunda yanıltabilir.

### 13.4.1. Seçenek A — Crossfade (Tercih edilen)

Crossfade, eski içeriğin kaybolurken yeni içeriğin belirmesi demektir. Bu geçiş yumuşak, zarif ve kullanıcıyı şaşırtmayan bir deneyim sunar.

- **Eski content:** Opacity 1 → 0 (tam görünürden tamamen görünmeze).
- **Yeni content:** Opacity 0 → 1 (tamamen görünmezden tam görünüre).
- **Bu iki animasyon eş zamanlı çalışır.** Eski content kaybolurken yeni content aynı anda belirir. Bu, "crossfade" efektini yaratır.
- **Süre:** `duration-fast` (150ms). Tab geçişleri sık yapılan işlemlerdir; uzun animasyon kullanıcıyı yavaşlatır.
- **Easing:** `easing-standard`. Standart easing, geçişin ne çok sert ne çok yumuşak hissettirmesini sağlar.
- **Not:** Crossfade sırasında iki content aynı anda kısmen görünür olacaktır. Bu, layout’un aynı boyutta kalmasını gerektirir. İki content’in üst üste binmesi (absolute positioning) veya container’ın sabit yükseklikte tutulması gerekir.

### 13.4.2. Seçenek B — Instant Swap (Kabul edilir)

Instant swap, animasyon olmadan içeriğin anında değişmesidir.

- **Eski content:** Anında kaldırılır.
- **Yeni content:** Anında gösterilir.
- **Animasyon yoktur.**
- Bu seçenek **tercih edilmez** çünkü geçiş sert hissedilir. Ancak aşağıdaki durumlarda **kabul edilir:**
  - Performance-critical yüzeyler (ör: çok sayıda DOM elementi barındıran data-heavy tab’lar).
  - Tab content’in çok büyük olması ve crossfade’in her iki content’i aynı anda render etmeyi gerektirmesi.
  - Düşük güçlü cihazlarda crossfade’in jank yaratması.
- Instant swap kullanılsa bile, tab indicator animasyonu çalışmaya devam etmelidir.

### 13.4.3. YASAK davranış — Horizontal Slide

Tab content’in sağa/sola kayarak değişmesi (horizontal slide) **kesinlikle yasaktır.** Nedeni:

- Tab navigation, **sayfa geçişi değildir**. Tab’lar aynı ekran içinde farklı content görünümlerini filtreleyen bir kontroldür.
- Horizontal slide, "yeni sayfaya geçtim" hissi verir. Bu, kullanıcıyı "geri butonuna basarsam bir önceki tab’a mı dönerim" gibi yanıltıcı beklentilere sokar.
- Horizontal slide, swipe gesture ile çakışır (özellikle mobile’da). Kullanıcı content’i yanlara kaydırarak tab mı değiştiriyor, yoksa sayfa içi bir gesture mı yapıyor belirsizleşir.
- Tek istisna: Eğer uygulama bilinçli olarak "swipeable tab" pattern’i kullanıyorsa (ör: onboarding wizard, photo gallery), bu durum ayrıca belgelenmeli ve kullanıcıya bunun bir tab değil bir "sayfa akışı" olduğu net şekilde iletilmelidir.

### 13.4.4. Tab Indicator Animasyonu

Tab indicator, seçili tab’ın altında (veya arkasında) görünen görsel işarettir. Genellikle bir çizgi (underline) veya arka plan rengidir.

- **Hareket:** Indicator, eski tab’ın altından yeni tab’ın altına doğru **kayarak** hareket eder. Aniden kaybolup başka yerde belirmez.
- **Süre:** `duration-fast` (150ms).
- **Easing:** `easing-standard`.
- **Genişlik interpolasyonu:** Eğer tab’ların genişlikleri farklıysa (ör: "Ana Sayfa" kısa, "Bildirimlerim" uzun), indicator genişliği geçiş sırasında eski tab genişliğinden yeni tab genişliğine doğru **interpolate** edilir. Yani indicator kayarken aynı zamanda genişler veya daralır. Bu, indicator’ın "sabit genişlikli kutu" gibi değil, "akıcı şekil" gibi hissettirmesini sağlar.
- **Eğer tab genişlikleri eşitse** (fixed-width tab’lar), genişlik interpolasyonuna gerek yoktur. Indicator sadece yatay pozisyonunu değiştirir.
- **Indicator türü:**
  - Underline (alt çizgi): En yaygın. Material Design’ın standart tab indicator’ıdır. Çizgi kalınlığı 2-3px, renk accent/primary token.
  - Background fill: Tab’ın arka planı dolarak seçimi gösterir. Daha az yaygın ama segmented control’lerde sık kullanılır.

---

# 14. Modal / Dialog / Sheet Presentation Motion

## 14.1. Neden kritik?

Bu yüzeyler bağlam değişimi yaratır.
Kullanıcı:
- yeni geçici yüzey mi açıldı,
- ana akış mı değişti,
- arka plan erişilebilir mi,
- bu yüzey nasıl kapanır
sorularının cevabını hissedebilmelidir.

## 14.2. Kural

Modal/dialog/sheet motion:
- yüzey tipini açıklamalı
- arka plan ile yeni katman ilişkisini netleştirmeli
- çok yavaş olmamalı
- dismiss davranışı ile uyumlu olmalı

## 14.3. Modal vs sheet farkı

Aynı motion kullanılmamalıdır.
Çünkü:
- dialog daha “ortaya gelen geçici katman”
- sheet daha “kenardan/alttan açılan bağlamsal yüzey”
hissi taşımalıdır.

## 14.4. Zayıf davranışlar

- tüm overlay türlerinin aynı animasyonu kullanması
- dismiss sırasında yön duygusunun kaybolması
- backdrop ve panel hareketinin uyumsuzluğu
- modal açılışının startup gecikmesi gibi hissettirmesi

## 14.5. Açılma/Kapanma Süreleri ve Davranış Spesifikasyonları

Her overlay türünün kendine özgü bir açılma ve kapanma koreografisi vardır. Aynı animasyonun tüm overlay'lerde kullanılması, yüzey türleri arasındaki hiyerarşi farkını yok eder. Aşağıda her overlay türü için kesin spesifikasyonlar tanımlanmıştır.

### 14.5.1. Modal (Dialog)

Modal, ekranın ortasında beliren, kullanıcının dikkatini zorunlu olarak yeni bir bağlama çeken geçici kutudur. Kullanıcı modal ile etkileşime geçmeden arka plana erişemez.

**Açılma (Enter):**
- **Scale:** 0.95 → 1.0. Modal, hedef boyutunun %95'inden tam boyutuna doğru büyür. Bu çok hafif bir büyüme, "hiçlikten patladı" hissi vermeden, "yerinden doğdu" hissi verir.
- **Opacity:** 0 → 1. Modal tamamen şeffaftan tamamen görünüre geçer. Scale ve opacity animasyonları **eş zamanlı** çalışır.
- **Süre:** `duration-standard` (250ms).
- **Easing:** `easing-enter` (hızlı başlayıp yavaş biten eğri).
- **Backdrop (scrim):** Modal'ın arkasındaki karartma katmanı. Arka planı karartarak kullanıcının dikkatini modal'a yönlendirir. Backdrop fade-in süresi: `duration-standard` (250ms). Backdrop rengi: siyah %50 opacity (veya tema token'ına göre).

**Kapanma (Exit):**
- **Opacity:** 1 → 0. Modal kaybolur. Scale animasyonu kapanışta **kullanılmaz** — sadece fade-out yeterlidir. Bunun nedeni, kapanışın "geri çekilme" değil "kaybolma" hissi vermesi gerektiğidir.
- **Süre:** `duration-fast` (150ms). Kapanış, açılıştan daha hızlıdır. Kullanıcı zaten modal ile işini bitirmiştir; kapanışın hızlı olması "sistem tepki veriyor" hissi yaratır.
- **Easing:** `easing-exit` (yavaş başlayıp hızlı biten eğri).
- **Backdrop fade-out:** `duration-fast` (150ms). Modal ve backdrop **eş zamanlı** kaybolur.

### 14.5.2. Bottom Sheet

Bottom sheet, ekranın alt kenarından yukarı doğru kayan yüzeydir. Genellikle ek seçenekler, filtreler veya bağlamsal içerik sunar. Modal'dan farkı, arka plan ile ilişkisinin daha gevşek olabilmesidir (non-blocking bottom sheet'ler de vardır).

**Açılma (Enter):**
- **Transform:** `translateY(100%)` → `translateY(0)`. Sheet, ekranın alt kenarının tamamen dışından başlayarak hedef yüksekliğine kadar yukarı kayar.
- **Süre:** `duration-slow` (350ms). Bottom sheet modal'dan daha yavaş açılır çünkü fiziksel hareket mesafesi daha büyüktür ve kullanıcının "nereden geldiğini" anlaması gerekir.
- **Easing:** `easing-enter`. Hızlı başlayıp yavaş biten eğri, sheet'in "kendinden emin" girişini sağlar.
- **Backdrop:** Eğer blocking sheet ise (arka plan ile etkileşim engelleniyorsa), backdrop modal ile aynı şekilde fade-in olur. Non-blocking sheet'te backdrop olmayabilir.

**Kapanma (Exit):**
- **Transform:** `translateY(0)` → `translateY(100%)`. Sheet aşağı kayarak ekrandan çıkar.
- **Süre:** `duration-standard` (250ms). Kapanış açılıştan daha hızlıdır.
- **Easing:** `easing-exit`.

**Gesture-driven dismiss:**
- Kullanıcı bottom sheet'i aşağı doğru sürükleyerek kapatabilmelidir. Bu, mobilde çok doğal ve beklenen bir davranıştır.
- **Parmak takibi:** Sheet, kullanıcının parmak hareketini birebir takip eder. Parmak 50px aşağı gittiyse sheet 50px aşağı kayar. Gecikme veya kayma olmamalıdır.
- **Dismiss threshold:** Sheet yüksekliğinin **%30'u** kadar aşağı sürüklenmişse, parmak bırakıldığında sheet dismiss olur. %30'dan az sürüklenmişse, sheet eski pozisyonuna geri döner (snap-back).
- **Velocity override:** Kullanıcı parmağını hızla aşağı fırlatırsa (%30 threshold'una ulaşmamış olsa bile), velocity > 500px/s ise sheet dismiss olur. Bu, "hızlı kapatma" deneyimini sağlar.
- **Snap-back animasyonu:** Sheet dismiss olmayıp geri dönüyorsa, `duration-fast` (150ms) sürede `easing-standard` ile eski pozisyona geri kayar.

### 14.5.3. Side Panel (Web-only)

Side panel, ekranın sağ veya sol kenarından kayan yüzeydir. Genellikle web uygulamalarında filtre paneli, ayar paneli veya detay paneli olarak kullanılır. Mobilde bottom sheet'in karşılığıdır.

**Açılma (Enter):**
- **Sağ panel:** `translateX(100%)` → `translateX(0)`. Panel sağ kenardan içeri kayar.
- **Sol panel:** `translateX(-100%)` → `translateX(0)`. Panel sol kenardan içeri kayar.
- **Süre:** `duration-standard` (250ms).
- **Easing:** `easing-enter`.
- **Backdrop:** Opsiyonel. Eğer panel ana content'i bloklamıyorsa (ör: content daraltılarak yan yana gösteriliyorsa) backdrop gerekmez. Bloklayan panel'de modal ile aynı backdrop davranışı uygulanır.

**Kapanma (Exit):**
- Açılmanın tersi yönde aynı animasyon. Sağ panel sağa, sol panel sola kayarak çıkar.
- **Süre:** `duration-standard` (250ms). Side panel'de açılış ve kapanış aynı sürededir.
- **Easing:** `easing-exit`.
- **Not:** Side panel yalnızca web pattern'idir. Mobilde bu ihtiyaç bottom sheet veya tam ekran modal ile karşılanır.

## 14.6. Dark Mode Tema Geçiş Animasyonu

Dark mode ve light mode arasındaki geçiş, modern uygulamalarda çok yaygın bir kullanıcı etkileşimidir. Bu geçişin kaba ve sert olması (tüm renklerin aniden değişmesi) kullanıcıda "flash" hissi yaratır ve göz yorar. Kontrollü bir geçiş animasyonu, profesyonel ve konforlu bir deneyim sunar.

### 14.6.1. Tema geçişi ne zaman tetiklenir?

Tema geçişi iki şekilde tetiklenebilir:
1. **Kullanıcı app içi ayardan tema değiştirir:** Kullanıcı doğrudan "Koyu Tema" / "Açık Tema" seçeneğine tıklar. Bu durumda geçiş animasyonu çalıştırılır.
2. **Cihaz OS ayarı değişir:** Kullanıcı cihazının sistem ayarlarından dark mode'u açar/kapatır ve uygulama "sistem temasını takip et" modundaysa. Bu durumda da aynı geçiş animasyonu çalıştırılır.

Her iki durumda da kullanıcı deneyimi aynı olmalıdır. Geçiş ani olmamalı, kontrollü bir animasyon ile gerçekleşmelidir.

### 14.6.2. Geçiş animasyonu spesifikasyonu

Tüm renk token'ları (surface, content, border, accent ve diğer tüm renk token'ları) **eş zamanlı olarak** yeni tema değerlerine geçer. Yani ekranın bir kısmı dark, bir kısmı light olarak kalmaz — her şey aynı anda değişir.

- **Süre:** `duration-standard` (250ms). Bu süre, geçişin algılanabilir ama göz yormayan bir tempoda olmasını sağlar.
- **Easing:** `easing-standard`. Standart easing, geçişin ne sert ne de aşırı yumuşak hissettirmesini sağlar.
- **Etkilenen özellikler:** `color` (metin rengi), `background-color` (arka plan), `border-color` (kenarlık), `box-shadow` (gölge), `fill` (SVG dolgu), `stroke` (SVG çizgi). Tüm bu özellikler aynı süre ve easing ile geçiş yapar.

### 14.6.3. Teknik yaklaşım

**Web (CSS):**
```
transition: color 250ms ease, background-color 250ms ease, border-color 250ms ease, box-shadow 250ms ease;
```
Bu transition kuralı, tema değiştiğinde (ör: `<html>` elementine `data-theme="dark"` attribute eklenmesi veya CSS class değişimi) otomatik olarak tüm renk geçişlerini animasyonlu yapar. **Dikkat:** Bu transition tüm elementlere uygulanmalıdır. Yalnızca root'a eklemek yetmez; ya global CSS ile tüm elementlere verilmeli ya da theme transition sırasında geçici bir global class ile aktif edilmelidir.

**React Native:**
Animated color interpolation kullanılır. `useAnimatedStyle` (Reanimated) veya `Animated.timing` ile renk değerleri interpolate edilir. Alternatif olarak, theme context değiştiğinde tüm component'lerin re-render'ı sırasında `LayoutAnimation.configureNext()` çağrılarak otomatik layout animasyonu sağlanabilir.

### 14.6.4. Flash/blink önleme

Tema değişiminde en sık karşılaşılan problem, kısa bir "beyaz flash" (veya karanlık flash) oluşmasıdır. Bu, FOIT (Flash of Incorrect Theme) olarak adlandırılır ve kullanıcı deneyimini ciddi şekilde bozar. Bunu önlemek için:

1. **Theme provider root seviyede olmalıdır.** Tema state'i en üst component'te tutulmalı ve tüm alt component'lere aynı anda dağıtılmalıdır. Ara seviyede tema yöneten component'ler olmamalıdır.
2. **Lazy-loaded component'ler theme-aware olmalıdır.** Sonradan yüklenen component'ler, yüklendiklerinde o anki aktif temayı doğru şekilde okumalıdır. Varsayılan (ör: her zaman light) bir tema ile render olup sonra güncellenmeleri flash yaratır.
3. **İlk render sırasında tema doğru set edilmiş olmalıdır.** SPA-first yaklaşımda (ADR-001) JavaScript ilk render'ı gerçekleştirirken doğru temayı okumalıdır. Eğer ileride SSR uygulanırsa, HTML ilk render'da doğru tema ile gönderilmelidir. Her iki durumda da bunu önlemek için: tema tercihi localStorage veya CSS media query (`prefers-color-scheme`) ile ilk render'da doğru tema seçilmelidir.

### 14.6.5. Image/icon uyumu

Bazı görseller ve ikonlar tema değiştiğinde değişmelidir (ör: logo'nun dark variant'ı, farklı temalarda farklı illustration'lar).

- Bu görsellerin değişimi de **aynı `duration-standard` (250ms) sürede fade** ile yapılmalıdır.
- Eski görsel opacity 1 → 0, yeni görsel opacity 0 → 1 (crossfade).
- Görseller aniden değişmemeli, tema renkleriyle aynı anda ve aynı tempoda geçiş yapmalıdır.

### 14.6.6. Tercih saklanması

- Kullanıcının manuel tema tercihi (ör: "Koyu Tema" seçimi) **persistent storage'da** saklanmalıdır (`AsyncStorage`, `localStorage`, `SecureStore` vb.).
- Uygulama açılışında saklanan tercih okunur ve ilk render bu tercihle yapılır.
- "Sistem temasını takip et" seçeneği de bir tercih olarak saklanır. Bu seçenekte uygulama OS'un `prefers-color-scheme` media query'sini dinler.
- Override mantığı: Kullanıcı manuel tema seçtiyse OS değişimi onu etkilemez. Kullanıcı "sistem" seçtiyse OS değişimi uygulanır.

### 14.6.7. Reduced motion

Reduced motion ayarı aktifken tema geçişinde animasyon devre dışı bırakılır. Tüm renkler **anında** değişir. Bu, kabul edilebilir bir davranıştır çünkü renk değişimi motion-sensitive kullanıcılar için genellikle sorun yaratmaz ama animasyonun kaldırılması daha güvenli yaklaşımdır.

---

# 15. Screen / Route Transition Motion

## 15.1. Amaç

Navigation’da ileri/geri/yer değiştirme/katman değişimi hissini vermek.

## 15.2. Kural

Screen transition:
- yön vermeli
- gereksiz dramatik olmamalı
- performans dostu olmalı
- veri bekleyişi ile karışmamalı
- web ve mobile’da aynı koreografiyi değil, aynı mantığı taşımalıdır

## 15.3. Behavior parity

Web ve mobile aynı geçiş animasyonunu kullanmak zorunda değildir.
Ama:
- ileri giderken ileri hissi
- geri giderken geri hissi
- geçici yüzey ile kalıcı sayfa ayrımı
tutarlı olmalıdır.

## 15.4. Zayıf davranışlar

- back ile forward’ın aynı hissettirmesi
- her route değişiminde tam ekran fade kullanmak
- geçişin yön değil yavaşlık hissettirmesi
- veri gelene kadar boş ekranı animasyonla gizlemeye çalışmak

## 15.5. Stack Push/Pop Animasyon Spesifikasyonu

Stack navigation, mobil uygulamalarda ve web single-page application’larda en sık kullanılan geçiş modelidir. Kullanıcı bir listeden detaya gider (push), detaydan listeye döner (pop). Bu geçişlerin yön duygusu vermesi, kullanıcının "neredeyim, nereden geldim" sorusuna cevap olması kritiktir.

### 15.5.1. Stack push (ileri gitme)

Stack push, kullanıcının derinliğe doğru gittiğini ifade eder. Yeni ekran sağ taraftan sahneye girer ve mevcut ekranı "geride bırakır."

- **Yeni ekranın hareketi:** Ekranın sağ kenarından (`translateX(100%)`) başlayarak sola kayar ve tam pozisyona (`translateX(0)`) gelir. RTL (sağdan sola okunan) dillerde bu yön tersine çevrilir: yeni ekran sol kenardan (`translateX(-100%)`) başlayarak sağa kayar.
- **Mevcut ekranın hareketi:** Arka planda kalan ekran hafifçe sola kayar (yaklaşık `translateX(-20%)` veya `translateX(-30%)`) ve opacity’si düşer (1.0 → 0.85 civarı). Bu, arka ekranın "geride kaldığını" hissettirir. RTL dillerde yön sağa doğrudur.
- **Süre:** `duration-standard` (250ms). Bu süre, geçişin algılanabilir ama bekletici olmayan bir tempo sunmasını sağlar.
- **Easing:** `easing-enter`. Enter easing, hareketin başında daha hızlı ve sonuna doğru yavaşlayan bir eğri kullanır. Bu, yeni ekranın "sahneye kendinden emin girdiği" hissini verir.
- **Z-index:** Yeni ekran her zaman mevcut ekranın üstünde render edilir. İki ekranın aynı z seviyesinde olması görsel karışıklık yaratır.

### 15.5.2. Stack pop (geri gitme)

Stack pop, kullanıcının "bir adım geri" döndüğünü ifade eder. Mevcut ekran sahneden çıkar, altındaki (önceki) ekran tekrar görünür hale gelir.

- **Mevcut ekranın hareketi:** Mevcut ekran sağ tarafa doğru kayarak sahneden çıkar (`translateX(0)` → `translateX(100%)`). RTL dillerde sol tarafa kayar.
- **Altındaki ekranın hareketi:** Önceki ekran, push sırasında gittiği hafif sola kaymış pozisyondan (`translateX(-20%)`) tam pozisyona (`translateX(0)`) geri gelir. Opacity’si de eski değerine (1.0) döner.
- **Süre:** `duration-standard` (250ms). Push ve pop sürelerinin eşit olması kullanıcıda tutarlılık hissi yaratır.
- **Easing:** `easing-exit`. Exit easing, hareketin başında yavaş ve sonuna doğru hızlanan bir eğri kullanır. Bu, ekranın "sakin başlayıp hızla çekildiği" hissini verir.

### 15.5.3. Mobile’da gesture-driven transition

Mobil platformlarda kullanıcılar fiziksel parmak hareketleriyle geri gidebilmelidir (swipe-back). Bu, button’a basmaktan çok daha doğal bir deneyimdir.

- **iOS:** Ekranın sol kenarından sağa doğru swipe gesture’ı native UINavigationController tarafından desteklenir. Parmak hareketi sırasında ekran parmağı birebir takip etmelidir (gesture-driven, velocity-based). Parmak bırakıldığında, mevcut pozisyon ve hıza göre geçiş tamamlanır veya geri döner.
- **Android:** Predictive back gesture (Android 13+) desteklenmelidir. Ekranın kenarından başlayan swipe, geçişi interaktif olarak kontrol eder.
- **Web’de:** CSS `transform` ve `opacity` transition kombinasyonu ile aynı his yakalanır. Browser history back/forward navigasyonu sırasında bu geçişler tetiklenir. Web’de swipe-back gesture native tarayıcı davranışıdır ve override edilmemelidir; uygulama kendi route transition’ını bu davranışla uyumlu hale getirmelidir.

### 15.5.4. Platform farkları

Her platformun kullanıcı beklentisi farklıdır. Birebir aynı animasyonu her yerde kullanmak yerine, her platformun doğal hissini yakalamak hedeflenmelidir:

- **iOS:** Native `UINavigationController` push/pop animasyonuna mümkün olduğunca sadık kalınır. iOS kullanıcıları bu geçişe alışkındır ve farklı bir pattern kullanmak "yerli olmayan uygulama" hissi verir. React Native’de `@react-navigation/native-stack` bu davranışı otomatik sağlar.
- **Android:** Shared element transition tercih edilebilir. Bir listeden detaya geçerken, ortak bir element (ör: resim, başlık) eski ekrandan yeni ekrana doğru animasyonla taşınır. Bu, geçişin "sihirli" ve bağlamsal hissettirmesini sağlar. `MaterialSharedAxis` veya `MaterialContainerTransform` pattern’leri referans alınabilir.
- **Web:** CSS `transform: translateX()` + `opacity` kombinasyonu yeterlidir. View Transitions API (destekleyen tarayıcılarda) kullanılabilir. Web’de animasyon karmaşıklığı mobil kadar yüksek olmak zorunda değildir; önemli olan yön hissinin korunmasıdır.

## 15.6. Interrupted Navigation Recovery (Kesilen Geçiş Kurtarma)

Navigation animasyonları her zaman baştan sona kesintisiz çalışmaz. Kullanıcı bir geçiş devam ederken geri butonuna basabilir, başka bir linke tıklayabilir veya gesture’ı yarıda bırakabilir. Bu durumların zarif şekilde ele alınması, profesyonel his için kritiktir.

### 15.6.1. Kesinti nedir?

Kesinti şu durumlarda meydana gelir:
- Push animasyonu devam ederken kullanıcı geri butonuna basar.
- Pop animasyonu devam ederken kullanıcı yeni bir sayfaya navigasyon tetikler.
- Swipe-back gesture yarıda bırakılır (parmak ortada kalıp geri çekilir).
- Programmatik navigation (ör: deep link, timeout redirect) mevcut animasyonu keser.

### 15.6.2. Temel kural

Kesilen animasyon **mevcut pozisyonundan** yeni hedefe doğru devam etmelidir. Bu ne demek:
- Animasyon **başa sarmaz** (ekran sıfır pozisyonuna dönüp yeni animasyona başlamaz).
- Animasyon **birden bitmez** (ekran aniden hedef pozisyona zıplamaz).
- Animasyon **mevcut computed pozisyonundan** (yani ekranın o an bulunduğu noktadan) yeni hedef pozisyona doğru yumuşak şekilde devam eder.

Örnek senaryo: Push animasyonu %60 tamamlandığında kullanıcı geri butonuna basarsa, yeni ekran %60 pozisyonundan sağa doğru geri kaymalı, arka ekran da mevcut pozisyonundan tam pozisyona geri gelmelidir. İki ayrı animasyon arasında "sıçrama" olmamalıdır.

### 15.6.3. Gesture-driven navigation’da velocity korunması

Kullanıcı parmağını sürükleyerek (drag) navigation yapıyorsa, parmağını bıraktığı anda iki karar verilir:
1. **Geçiş tamamlansın mı?** Ekran toplam mesafenin %50’sinden fazla sürüklenmişse VEYA parmak bırakıldığındaki hız (velocity) 500px/s üzerindeyse, geçiş tamamlanır (sayfa değişir).
2. **Geçiş geri mi alınsın?** Ekran %50’den az sürüklenmişse VE velocity 500px/s altındaysa, ekran eski yerine geri döner (navigasyon iptal edilir).
- Velocity korunmalıdır: Kullanıcı parmağını hızla fırlatıp bıraktıysa, ekran o hızla devam etmelidir. Ani durma veya yapay yavaşlama olmamalıdır.
- Threshold değerleri (%50, 500px/s) platforma ve ekran boyutuna göre ince ayar yapılabilir ama mantık aynı kalmalıdır.

### 15.6.4. Web’de kesinti yönetimi

Web’de CSS transition `cancel` olduğunda (yeni transition tetiklendiğinde):
- Yeni transition, elementin **mevcut `getComputedStyle()` pozisyonundan** başlamalıdır.
- `requestAnimationFrame` ile computed değer okunup yeni animasyonun başlangıcı olarak set edilmelidir.
- Web Animations API kullanılıyorsa, `animation.cancel()` çağrıldıktan sonra yeni animasyon mevcut pozisyondan başlatılmalıdır.
- CSS class toggle ile çalışıyorsa, `transitioncancel` event’i dinlenip intermediate state yönetilmelidir.

### 15.6.5. Hatalı davranışlar (interrupted navigation’da)

Aşağıdaki durumlar kesinlikle kabul edilmez:
- **Zıplama (jumping):** Ekranın animasyon ortasında aniden hedef pozisyona veya başlangıç pozisyonuna sıçraması.
- **Çift animasyon (double animation):** İki geçiş animasyonunun aynı anda üst üste çalışması, ekranların titremesi veya kararsız hareket etmesi.
- **Beyaz flash:** Kesinti sırasında her iki ekranın da bir an kaybolması ve beyaz (veya tema arka plan rengi) bir flash görünmesi.
- **Donma (freeze):** Kesinti sonrası animasyonun tamamen durması ve kullanıcının etkileşim yapamaması.
- **Yanlış ekran:** Kesinti sonrası kullanıcının beklediğinden farklı bir ekranda kalması.

---

# 16. Loading Feedback Motion

## 16.1. Kural

Loading motion:
- ne kadar süreceği belli olmayan bekleyişi anlamlı kılmalı
- sinyal vermeli
- ama dikkat çalmamalı
- sürekli yüksek frekanslı gürültü üretmemeli

## 16.2. Skeleton vs spinner

Her loading için aynı motion doğru değildir.

### Skeleton
- yapı belli, içerik bekleniyor
- perceived continuity önemli

### Spinner / progress
- daha belirsiz işlem
- küçük yüzey
- kısa bekleyiş
veya
- işlem devam ediyor ama şekil bilinmiyor

## 16.3. Zayıf davranışlar

- her yüklemede tam ekran spinner
- iskeletin aşırı parlak ve dikkat dağıtıcı olması
- küçük refresh için büyük dramatik loading animasyonu
- sistemin donuk kalması ve hiç feedback vermemesi

## 16.4. Skeleton Shimmer Spesifikasyonu

Skeleton shimmer, modern uygulamalarda loading deneyiminin temel taşıdır. Boş bir ekranda dönen bir spinner göstermek yerine, "yüklenecek içeriğin yaklaşık şeklini" gösteren gri bloklar ve üzerinden kayan parlak bir gradient, kullanıcıya hem "bir şeyler yükleniyor" hem de "yakında şu tür bir içerik gelecek" mesajını verir.

### 16.4.1. Skeleton shimmer nedir?

Skeleton shimmer, iki katmandan oluşur:

1. **Skeleton blokları:** İçeriğin yerini tutan, içeriğin tahmini boyut ve şeklinde gri renkli yer tutucu bloklardır. Örneğin: bir kullanıcı profil kartı yüklenirken, sol tarafta yuvarlak bir daire (avatar yeri), sağ tarafta iki dikdörtgen çubuk (isim ve açıklama yeri) görünür.
2. **Shimmer efekti:** Bu skeleton blokların üzerinden soldan sağa kayan parlak bir gradient geçişidir. Bu kayma hareketi "bir şeyler oluyor, bekliyorsun ama sistem çalışıyor" hissini verir. Shimmer olmadan statik gri bloklar "bozuk" veya "yüklenmemiş" gibi görünebilir.

### 16.4.2. Shimmer döngü süresi ve easing

- **Bir tam geçiş süresi:** 1.5 saniye. Yani shimmer parlak gradient'i, bloğun sol kenarından sağ kenarına 1.5 saniyede ulaşır.
- **Easing:** `linear` (sabit hız). Shimmer hızı baştan sona aynıdır. Hızlanma veya yavaşlama yoktur. Bunun nedeni, shimmer'ın "hareket" hissi değil "akış" hissi vermesidir. Ease-in-out gibi eğriler "nabız atar gibi" bir his yaratır ve dikkat çeker; linear ise sakin, sürekli bir akış sunar.
- **Döngü:** Sonsuz döngü. Shimmer gradient bloğun sağ kenarına ulaştığında, kısa bir boşluk (gradient tamamen geçtikten sonra) bırakılır ve tekrar sol kenardan başlar. Bu döngü, veri gelene kadar devam eder.

### 16.4.3. Shimmer yönü

- **LTR (soldan sağa okunan diller):** Shimmer soldan sağa kayar. Bu, kullanıcının doğal okuma yönüdür ve "ilerleme" hissi verir.
- **RTL (sağdan sola okunan diller — Arapça, İbranice vb.):** Shimmer sağdan sola kayar. RTL kullanan bir kullanıcıda soldan sağa kayan shimmer "ters gidiyor" hissi yaratır.
- **Uygulama:** CSS'te `direction` attribute'üne göre shimmer yönü otomatik çevrilmelidir. React Native'de `I18nManager.isRTL` kontrolüyle yön belirlenir.

### 16.4.4. Gradient yapısı

Shimmer efektinin görsel kalitesi gradient'in doğru yapılandırılmasına bağlıdır:

- **Renk geçişi:** Arka plan rengi (skeleton bloğun temel rengi) → parlak rengi (arka plandan yaklaşık %10 daha açık bir ton) → tekrar arka plan rengi.
- **Renk kaynağı:** Renkler kesinlikle tema token'larından gelmelidir. Arka plan rengi `surface-grouped` veya `surface-elevated` token'ıdır. Parlak renk ise bu token'ın %10 daha açık (lighter) halidir. Hardcoded `#e0e0e0` veya `#f5f5f5` gibi değerler **YASAKTIR** çünkü dark mode'da çalışmaz.
- **Gradient genişliği:** Skeleton bloğunun toplam genişliğinin yaklaşık **%40'ı** kadar. Yani gradient çok dar bir şerit değil, bloğun neredeyse yarısı kadar geniş bir aydınlık alanıdır. Çok dar gradient "lazer" gibi görünür, çok geniş gradient ise efekti fark edilmez kılar.

### 16.4.5. Skeleton blok renkleri

- Skeleton blokların temel rengi: `surface-grouped` veya `surface-elevated` token'ı. Hangi token kullanılacağı, skeleton'un bulunduğu yüzeye bağlıdır (ana yüzeyde `surface-grouped`, kart içinde `surface-elevated`).
- **Kesinlikle hardcoded gri (ör: `#cccccc`, `gray`, `rgb(200,200,200)`) kullanılmaz.** Hardcoded renkler dark mode'da aşırı parlak, high-contrast mode'da görünmez olabilir.
- Light mode'da skeleton bloklar tipik olarak açık gri, dark mode'da koyu gri tonlarındadır. Token sistemi bunu otomatik sağlar.

### 16.4.6. Skeleton blok boyutları

Skeleton bloklar, yüklenecek içeriğin tahmini boyutuna ve şekline yakın olmalıdır. Tek tip dikdörtgenler kullanmak "tembel placeholder" hissi verir.

- **Başlık (title) yeri:** Daha geniş ve daha kalın bir blok. Yaklaşık olarak gerçek başlığın genişliğinin %70-80'i kadar (tam genişlik de olabilir ama %100 genişlik "çok mekanik" hissettirir).
- **Body text yeri:** Daha dar bloklar, birden fazla satır. Her satır biraz farklı genişlikte olabilir (ör: birinci satır %100, ikinci satır %85, üçüncü satır %60). Bu, gerçek metnin "doğal kırılma" hissini simüle eder.
- **Avatar/resim yeri:** Yuvarlak veya kare blok, gerçek avatar boyutunda.
- **Buton yeri:** Buton boyutunda küçük dikdörtgen blok.
- **Genel ilke:** Skeleton, yüklendikten sonra gelecek gerçek içerikle mümkün olduğunca aynı layout'u paylaşmalıdır. Böylece skeleton → gerçek içerik geçişinde layout shift (kayma) olmaz.

### 16.4.7. Skeleton gösterim süresi ve timeout

- Skeleton, veri gelene kadar gösterilir. Veri geldiğinde skeleton kaybolur ve gerçek içerik gösterilir (crossfade veya instant swap ile).
- **Timeout:** Eğer veri **10 saniye** içinde gelmezse, skeleton'dan "yükleme hatası" feedback'ine geçilmelidir. Bu feedback, "Bağlantı sağlanamadı. Tekrar deneyin." gibi bir mesaj ve retry butonu içermelidir.
- 10 saniyelik timeout'un nedeni: Kullanıcı 10 saniyeden uzun süre shimmer izlerse "sistem bozuldu mu?" endişesine girer. Belirsiz bekleme yerine net bir hata mesajı ve aksiyon seçeneği sunmak daha iyi bir deneyimdir.
- Timeout süresi ağ koşullarına göre yapılandırılabilir olmalıdır (ör: yavaş bağlantı algılandığında 15 saniyeye çıkarılabilir) ama varsayılan 10 saniyedir.

### 16.4.8. Reduced motion

Reduced motion tercihi aktif olduğunda:
- Shimmer animasyonu **tamamen durdurulur.** Gradient kayma hareketi çalışmaz.
- Skeleton bloklar **statik gri bloklar** olarak gösterilir. Bu, hala "bir şeyler yüklenecek" mesajını verir ama hareket yoktur.
- Alternatif olarak, shimmer yerine çok hafif bir **opacity pulse** (opacity 0.8 → 1.0 → 0.8, 2 saniyelik döngü) kullanılabilir ama bu da reduced motion kullanıcıları için tartışmalıdır. En güvenli yaklaşım statik bloktur.

### 16.4.9. Spinner ile farkı ve tercih sırası

| Özellik | Skeleton | Spinner |
|---------|----------|---------|
| Ne söylüyor? | "Bu tür bir içerik gelecek" (şekil ve konum hakkında ipucu verir) | "Bir şey oluyor" (ne geleceği hakkında ipucu yok) |
| Ne zaman kullanılır? | İçeriğin boyutu ve yapısı önceden bilindiğinde | Alan boyutu veya içerik türü önceden bilinmediğinde |
| Kullanıcı hissi | Sayfa hızlı yükleniyor gibi hissettirir (perceived performance artar) | Bekleme hissi daha belirgindir |
| Layout shift riski | Düşük (skeleton ve içerik aynı boyutta) | Yüksek (spinner kaybolunca içerik "patlar") |

**Tercih sırası:** Skeleton **her zaman** spinner'a tercih edilir. Spinner yalnızca alan boyutunun önceden bilinmediği durumlar (ör: inline buton yüklemesi, küçük widget refresh) veya çok küçük alanlarda kullanılır.

---

# 17. Success / Error Feedback Motion

## 17.1. Kural

Başarı ve hata motion’ı:
- destekleyici olmalı
- tek bilgi kaynağı olmamalı
- kısa ve kontrollü olmalı
- kullanıcıyı küçük bir geri bildirimle netleştirmeli

## 17.2. Success motion

- completion hissi verebilir
- ama kutlama efektine dönüşmemelidir
- özellikle profesyonel/premium ton bozulmamalıdır

## 17.3. Error motion

- dikkat çekmeli ama cezalandırmamalı
- küçük shake vb. davranışlar çok dikkatli kullanılmalıdır
- form alanı bazında aşırı agresif motion çoğu zaman yanlıştır

## 17.4. Zayıf davranışlar

- success’i konfeti mantığına çevirmek
- error’da kullanıcıyı rahatsız eden sert shake
- motion var ama metin veya state desteği yok
- her küçük validation hatasında ağır hareket

## 17.5. Error Shake ve Success Animasyonu Spesifikasyonu

Error ve success durumlarında kullanıcıya verilen görsel feedback, doğru dozda olmalıdır. Çok az feedback "sistem tepki vermedi" hissi yaratır, çok fazla feedback ise "cezalandırılıyorum" veya "çocuk oyuncağı" hissi yaratır. Aşağıda her iki durum için kesin spesifikasyonlar tanımlanmıştır.

### 17.5.1. Error Shake

Error shake, form alanı veya buton yanlış input aldığında uygulanan kısa, kontrollü bir sağa-sola sallanma animasyonudur. Amacı kullanıcının dikkatini hata noktasına çekmektir.

**Animasyon detayları:**
- **Hareket büyüklüğü (magnitude):** ±4px. Yani element merkez pozisyonundan sağa 4px, sola 4px hareket eder. Toplam hareket genişliği 8px’dir. Bu, fark edilebilir ama agresif olmayan bir büyüklüktür.
- **Salınım sayısı:** 3 tam salınım. Hareket dizisi: merkez → sağ(+4px) → sol(-4px) → sağ(+4px) → sol(-4px) → sağ(+4px) → merkez(0). Tam olarak 6 yön değişikliği, 3 tam dalga.
- **Süre:** 300ms (toplam). Bu süre 3 salınıma bölünür, yani her yarım salınım yaklaşık 50ms’dir.
- **Easing:** `easing-standard`. Salınımlar eşit tempo ile gerçekleşir, sona doğru hafif yavaşlama kabul edilir ama belirgin bir "sönümleme" (damping) uygulanmaz.
- **Transform:** `translateX` kullanılır. `margin` veya `left/right` ile yapılmaz çünkü bunlar layout thrash yaratır ve performansı düşürür.

**Kritik kural — Shake tek başına yeterli değildir:**
Error shake kesinlikle hata bildiriminin **tek yolu olmamalıdır.** Shake yalnızca dikkat çekme amacıdır. Mutlaka aşağıdakilerden en az biriyle desteklenmelidir:
- **Kırmızı border:** Hatalı alanın kenarlığı error renk token’ına (`color-error`) döner.
- **Error mesajı:** Alanın altında "Bu alan zorunludur" veya "Geçersiz e-posta adresi" gibi açıklayıcı metin görünür.
- **Error icon:** Alanın yanında veya içinde kırmızı uyarı ikonu (ör: ⚠ veya ✕) belirir.
- Bunların hiçbiri yoksa shake anlamsızdır çünkü screen reader kullanıcıları shake’i algılayamaz, renk körü kullanıcılar kırmızı border’ı göremeyebilir.

### 17.5.2. Success Checkmark Animasyonu

İşlem başarılı olduğunda kullanıcıya "tamam, oldu" hissini veren kısa ve sade bir ✓ (checkmark) animasyonudur.

**Animasyon detayları:**
- **Checkmark çizimi:** Checkmark çizgisi (✓ şekli) soldan sağa doğru çizilir. Bu, SVG `stroke-dasharray` ve `stroke-dashoffset` animasyonu ile yapılır. Çizgi, önce kısa bacağı (sol alt → orta alt) sonra uzun bacağı (orta alt → sağ üst) çizer.
- **Süre:** 400ms (toplam çizim süresi).
- **Easing:** `easing-emphasized`. Emphasized easing, hareketin başında yavaş ve ortasında hızlanıp sonunda tekrar yavaşlayan bir eğri kullanır. Bu, checkmark’ın "kararlı ve premium" hissettirmesini sağlar.
- **Opsiyonel arka plan:** Checkmark’ın arkasında yeşil (success renk token’ı `color-success`) bir daire background fade-in olabilir. Bu daire, checkmark çizimi başlamadan hemen önce opacity 0 → 1 ile belirir (`duration-fast`, 150ms). Daire zorunlu değildir ama çoğu durumda checkmark’ı daha görünür kılar.
- **Boyut:** Checkmark’ın kullanıldığı bağlama göre değişir. Buton içinde küçük (16-20px), tam sayfa success state’inde büyük (48-64px).

**Success animasyonu sadelik kuralı:**
- Success animasyonu **kısa ve sade** olmalıdır. Kullanıcı "işlem tamam" mesajını aldıktan sonra bir sonraki adıma geçmek ister.
- **YASAK efektler:** Konfeti patlaması, parıltı efekti (sparkle), yıldız yağmuru, kalp uçuşması, ekran sallanması veya herhangi bir abartılı kutlama efekti. Bu tür efektler profesyonel/premium tonu bozar ve "oyun uygulaması" hissi verir.
- **Tek istisna:** Onboarding completion (kullanıcı ilk kurulumu tamamladığında) veya milestone celebration (ör: 100. görev tamamlama) gibi **gerçekten özel anlar** için kontrollü bir kutlama efekti kabul edilebilir. Ama bu bile abartılmamalı — kısa bir confetti animasyonu (maksimum 2 saniye) ve ardından otomatik temizlenme ile sınırlı tutulmalıdır.

### 17.5.3. Reduced Motion Alternatifleri

Reduced motion ayarı aktif olduğunda:
- **Shake yerine:** Error border rengi **flash** yapar. Yani border rengi normal renkten error rengine (`color-error`) döner, 300ms bekler, sonra tekrar normal renge döner, sonra tekrar error rengine döner ve kalır. Bu "yanıp sönme" efekti, hareket olmadan dikkat çeker.
- **Checkmark yerine:** Statik ✓ ikonu **anında** gösterilir. Çizim animasyonu yoktur. İkon fade-in ile belirebilir (`duration-instant`, 100ms) ama stroke çizim animasyonu çalışmaz.
- Error mesajı ve icon gibi destekleyici feedback’ler reduced motion’dan etkilenmez, her zaman gösterilir.

## 17.6. Toast/Snackbar Auto-Dismiss Timing Spesifikasyonu

Toast (veya snackbar), kullanıcıya geçici bir bildirim mesajı gösteren, genellikle ekranın alt kısmında beliren küçük bir UI bileşenidir. Toast’lar, ana akışı bozmadan kullanıcıyı bilgilendirmek için kullanılır. Kullanıcının bir butona basmasını veya modal’ı kapatmasını gerektirmezler — belirli bir süre sonra kendiliğinden kaybolurlar (auto-dismiss).

### 17.6.1. Toast nedir ve ne zaman kullanılır?

Toast, **non-blocking** bir bildirimdir. Ana ekranın üzerinde, genellikle ekranın alt kısmında (mobile) veya üst/alt kısmında (web) belirir. Kullanıcı toast ile etkileşime geçmek zorunda değildir; toast belirli bir süre sonra kendiliğinden kaybolur.

Toast şu durumlar için kullanılır:
- İşlem tamamlandığında onay vermek (ör: "Kaydedildi", "Profil güncellendi")
- Uyarı iletmek (ör: "Bağlantınız yavaş")
- Hata bildirmek (ör: "Kaydetme başarısız oldu")
- Bilgilendirme yapmak (ör: "Yeni özellik eklendi")

### 17.6.2. Türler ve auto-dismiss süreleri

Her toast türünün farklı bir auto-dismiss süresi vardır. Bunun nedeni, mesajın ciddiyetine göre kullanıcının okuma ve tepki verme ihtiyacının farklı olmasıdır:

**Info toast (bilgilendirme):**
- **Auto-dismiss süresi:** 4 saniye.
- **Kullanım:** Genel bilgilendirme mesajları. Kullanıcının mutlaka okumasını gerektirmeyen, ama haberi olmasında fayda olan durumlar.
- **Örnekler:** "Ayarlar kaydedildi.", "Bağlantı yeniden kuruldu.", "Yeni güncelleme mevcut."
- **Neden 4 saniye:** Ortalama okuma hızıyla kısa bir cümlenin okunabilmesi ve mesajın algılanabilmesi için yeterli süre.

**Success toast (başarı):**
- **Auto-dismiss süresi:** 3 saniye.
- **Kullanım:** Bir işlemin başarıyla tamamlandığını onaylamak.
- **Örnekler:** "Profil güncellendi.", "Dosya yüklendi.", "Mesaj gönderildi."
- **Neden 3 saniye:** Success mesajları genellikle kısadır ve kullanıcı zaten "tamam" cevabını beklemektedir. 3 saniye yeterlidir.

**Warning toast (uyarı):**
- **Auto-dismiss süresi:** 6 saniye.
- **Kullanım:** Kullanıcının dikkat etmesi gereken ama acil aksiyon gerektirmeyen uyarılar.
- **Örnekler:** "Bağlantınız yavaş, değişiklikler geç kaydedilebilir.", "Oturum süreniz 5 dakika içinde dolacak.", "Depolama alanınız dolmak üzere."
- **Neden 6 saniye:** Uyarı mesajları genellikle daha uzundur ve kullanıcının mesajı okuyup anlaması gerekir. Ayrıca kullanıcı mesajı okuyup "ne yapmalıyım" diye düşünmek isteyebilir.

**Error toast (hata):**
- **Auto-dismiss:** **YAPILMAZ.** Error toast, kullanıcı manuel olarak kapatana kadar ekranda görünür kalır.
- **Kullanım:** Başarısız işlemler, kaydetme hataları, ağ hataları.
- **Örnekler:** "Kaydetme başarısız oldu. Lütfen tekrar deneyin.", "Sunucuya bağlanılamadı.", "Dosya yüklenemedi."
- **Neden auto-dismiss yok:** Error toast auto-dismiss olursa, kullanıcı hatayı görmeden toast kaybolabilir. Bu durumda kullanıcı veri kaybı fark etmez, başarısız bir işlemi başarılı sanabilir. Bu, çok ciddi bir UX hatasıdır. Error toast mutlaka kullanıcının bilinçli kapatma aksiyonuna (X butonuna tıklama veya swipe-dismiss) bağlı olmalıdır.
- Error toast’ta **retry butonu** veya **aksiyon butonu** bulunmalıdır (ör: "Tekrar Dene", "Detayları Gör").

### 17.6.3. Toast animasyonu

**Enter (belirme):**
- **Hareket:** Alttan yukarı kayma (`translateY(100%)` → `translateY(0)`) + fade-in (opacity 0 → 1). İki animasyon eş zamanlı çalışır.
- **Süre:** `duration-fast` (150ms).
- **Easing:** `easing-enter`.
- **Neden alttan:** Toast genellikle ekranın altında konumlanır. Alttan kayma, "bu mesaj aşağıdan geldi" hissini doğal kılar.

**Exit (kaybolma — auto-dismiss veya manuel kapatma):**
- **Hareket:** Fade-out (opacity 1 → 0) + hafif aşağı kayma (`translateY(0)` → `translateY(20px)` kadar, tam çıkış mesafesi değil, sadece "batma" hissi).
- **Süre:** `duration-fast` (150ms).
- **Easing:** `easing-exit`.

**Birden fazla toast (stack yönetimi):**
- Birden fazla toast aynı anda görünmek istediğinde, **stack mantığı** uygulanır.
- Yeni toast en üste eklenir. Mevcut toast’lar aşağı kayar (yer açmak için `translateY` ile hareket eder).
- **Maksimum görünür toast:** 3 adet. Ekranda aynı anda 3’ten fazla toast gösterilmez.
- 4. toast geldiğinde: En eski (en alttaki) toast auto-dismiss edilir (error toast bile olsa), yeni toast en üste eklenir.
- Toast’lar arasında 8px boşluk bırakılır.

### 17.6.4. Erişilebilirlik

- Toast’lar `role="status"` ve `aria-live="polite"` ile HTML’de işaretlenmelidir. Bu, screen reader’ların toast içeriğini kullanıcıya okumasını sağlar, ama o anki okumayı kesmez (polite = sırasını bekler).
- **Error toast’lar:** `aria-live="assertive"` kullanılır. Bu, screen reader’ın mevcut okumayı keserek error mesajını hemen okumasını sağlar. Hata mesajları acildir ve kullanıcının hemen bilmesi gerekir.
- Toast içeriğinde yalnızca ikon veya renk ile bilgi verilmemelidir. Metin mutlaka bulunmalıdır.
- Toast dismiss butonu keyboard ile erişilebilir olmalıdır (Tab ile ulaşılabilir, Enter/Space ile kapatılabilir).

### 17.6.5. Mobile özel kurallar

- Toast, **safe area**’nın içinde kalmalıdır. iPhone’larda alt çentik (home indicator) alanını kapatmamalı, Android’de navigation bar’ın üstünde olmalıdır.
- **Keyboard açıkken:** Eğer bir form doldurulurken toast geliyorsa, toast keyboard’un üstüne taşınmalıdır. Keyboard’un arkasına gizlenmemelidir. Bu, toast’ın `bottom` pozisyonunun keyboard yüksekliğine göre dinamik ayarlanması anlamına gelir.
- **Swipe-dismiss:** Mobile’da toast’lar sola veya sağa swipe ile kapatılabilmelidir. Swipe yönü yatay olmalıdır (aşağı swipe ile karışmaması için).

---

# 18. Micro-Interaction Standardı

## 18.1. Tanım

Mikro etkileşimler, küçük ama sık tekrar eden geri bildirimlerdir.

Örnek:
- button press
- toggle
- chip select
- copy feedback
- inline expand
- reveal/hide password
- quick action acknowledgment

## 18.2. Kural

Micro-interactions:
- hızlı
- sade
- tekrarlı kullanımda yorucu olmayan
- sistem genelinde uyumlu
olmalıdır.

## 18.3. Zayıf davranışlar

- her mikro etkileşim için farklı timing
- aşırı bounce / spring kullanımı
- küçük etkileşim için gereksiz dramatik hareket
- motion’un interaction hızını düşürmesi

## 18.4. Copy Feedback Animasyonu

"Kopyala" (copy to clipboard) işlemi, kullanıcıların çok sık kullandığı bir mikro etkileşimdir. Bu işlemin feedback’i doğru verilmezse kullanıcı "kopyalandı mı, kopyalanmadı mı?" belirsizliğinde kalır. Aşağıda copy feedback’in nasıl uygulanması gerektiği detaylı olarak tanımlanmıştır.

### 18.4.1. Birincil yaklaşım — Buton text değişimi

Kullanıcı "Kopyala" butonuna tıkladığında:

1. **Buton metni değişir:** "Kopyala" → "Kopyalandı!" (veya İngilizce UI’da "Copy" → "Copied!"). Bu değişim **anında** gerçekleşir (`duration-instant`, 100ms fade ile veya tamamen instant).
2. **İkon değişimi (opsiyonel):** Buton metninin yanında varsa kopyala ikonu (clipboard icon) → ✓ (checkmark) ikonuna dönüşür. Bu da aynı sürede gerçekleşir.
3. **Geri dönüş:** 2 saniye sonra buton metni otomatik olarak "Kopyala" haline geri döner. Bu geri dönüş `duration-fast` (150ms) fade ile yapılır. 2 saniyelik bekleme, kullanıcının "kopyalandı" mesajını rahatça okumasına yeterlidir.
4. **Buton rengi (opsiyonel):** Kopyalandı state’inde buton arka planı veya border rengi kısa süreliğine success renk token’ına (`color-success`) dönebilir. Bu da 2 saniye sonra eski haline döner.

### 18.4.2. Alternatif yaklaşım — Tooltip

Buton metni değiştirmek yerine, butonun üstünde (veya yanında) küçük bir tooltip baloncuğu gösterilebilir:

- **İçerik:** "Kopyalandı!" metni.
- **Belirme:** Fade-in, `duration-instant` (100ms).
- **Auto-dismiss:** 2 saniye sonra otomatik kaybolur.
- **Kaybolma:** Fade-out, `duration-fast` (150ms).
- **Pozisyon:** Butonun üstünde (top-center), ok işareti butona doğru. Ekran kenarına yakınsa pozisyon otomatik ayarlanır (flip).

### 18.4.3. Buton disabled olmaz

Kopyalama işlemi **idempotent**tir — aynı metni 100 kez kopyalasan da sonuç aynıdır. Bu nedenle:
- Kopyala butonunu "Kopyalandı" state’inde **disabled yapma.** Kullanıcı tekrar tıklayabilmelidir.
- Kullanıcı tekrar tıklarsa, aynı feedback tekrar gösterilir (2 saniyelik zamanlayıcı sıfırlanır).
- Butonun disabled olması "bir şey yanlış gitti mi, tıklayamıyorum" endişesi yaratır.

### 18.4.4. Mobile’da haptic feedback

Mobil cihazlarda kopyalama işlemi tamamlandığında **light impact** haptic feedback eşlik edebilir. Bu, parmağa kısa ve hafif bir titreşim gönderir. Haptic feedback:
- Görsel feedback’in yerine değil, **yanına** eklenir.
- Cihaz haptic ayarı kapalıysa otomatik olarak çalışmaz (sistem bunu yönetir, override edilmez).
- Detaylı haptic spesifikasyonu bu belgenin §28.5 bölümünde tanımlanmıştır.

### 18.5. Like/Bookmark/Favorite Toggle Animasyonu

Kalp, yıldız veya bookmark ikonu gibi "favori" toggle’ları, sosyal ve kişisel uygulamalarda en yaygın mikro etkileşimlerden biridir. Bu toggle’ın animasyonu, kullanıcıda "beğenim kaydedildi" hissini güçlendirmelidir.

**Dolma animasyonu (boş → dolu):**
- İkon, boş halden (outline/stroke-only) dolu hale (filled) geçer.
- **Scale bounce:** İkon `scale(1.0)` → `scale(1.3)` → `scale(1.0)` hareketiyle kısa bir "zıplama" yapar. Bu bounce, "kalp attı" veya "yıldız parladı" hissini verir.
- **Bounce süresi:** `duration-fast` (150ms).
- **Renk dolma:** Boş ikonun içi (transparent/outline) → dolu renk (ör: kırmızı kalp, sarı yıldız, mavi bookmark). Bu renk geçişi de `duration-fast` (150ms) sürede yapılır. Scale bounce ve renk dolma **eş zamanlı** çalışır.
- **Easing:** `easing-standard`.

**Boşalma animasyonu (dolu → boş):**
- İkon, dolu halden boş hale döner.
- **Scale bounce uygulanmaz.** Boşalma daha sessiz bir geçiştir. Renk fade-out + outline’a dönüş yeterlidir.
- **Süre:** `duration-fast` (150ms).
- Bu asimetri bilinçlidir: "beğenme" eylemi vurgulanan bir andır, "beğeniyi geri alma" ise sessiz bir düzeltmedir.

---

# 19. Interaction Responsiveness

## 19.1. Neden motion konusu?

Çünkü hareket ne kadar güzel olursa olsun, tepki gecikmeli gelirse kalite düşer.

## 19.2. Kural

Interaction feedback mümkün olduğunca anlık başlamalıdır.
Hareket kısa gecikmeli değil, input ile senkron hissetmelidir.

## 19.3. Zayıf davranışlar

- butona bastıktan hissedilir süre sonra motion başlaması
- toggle değişiminin network yanıtına bağlı hissettirilmesi
- UI’nın sistemi algıladığını anlatmaması

---

# 20. Timing İlkeleri

## 20.1. Genel ilke

Timing kategorileri sınırlı olmalıdır.
Her component kendi süresini icat etmemelidir.

## 20.2. Kategorik yaklaşım

Örnek düşünce:
- fast: press, hover, micro feedback
- standard: selection, accordion, tab indicator
- emphasized: modal/sheet/screen transitions
- slow: yalnızca gerçekten gerekliyse, çok dikkatli

## 20.3. Kural

Aynı hız ailesi benzer interaction türlerinde tekrar etmelidir.

## 20.4. Zayıf davranışlar

- 160ms, 175ms, 190ms, 220ms, 245ms gibi sebepsiz dağınıklık
- aynı tip motion için farklı süreler
- “biraz daha yumuşak olsun” diye her şeyi yavaşlatmak

---

# 21. Easing İlkeleri

## 21.1. Neden önemli?

Süre aynı olsa bile easing hissi değiştirir.
Premium hissiyat çoğu zaman easing disiplininden gelir.

## 21.2. Kural

Easing sayısı sınırlı olmalıdır.
Tipik aileler:
- standard
- emphasized
- enter
- exit
- feedback

## 21.3. Uyarı

Her etkileşimde farklı spring/curve kullanmak sistem dilini bozar.

## 21.4. Zayıf davranışlar

- rastgele easing kullanımı
- sert başlama/bitiş yüzünden ucuz his
- her transition için farklı hissiyat
- performansı zorlayan veya orientation bozan eğriler

---

# 22. Reduced Motion Standardı

## 22.1. Temel ilke

Reduced motion tercihi, sistem genelinde ciddiye alınmalıdır.
Bu bir “opsiyonel incelik” değil, erişilebilirlik zorunluluğudur.

## 22.2. Reduced motion ne demek değildir?

- tüm feedback’i kapatmak
- state değişimini görünmez yapmak
- sistemi donuklaştırmak

## 22.3. Reduced motion’da doğru yaklaşım

- büyük yer değiştirme hareketlerini azaltmak
- zıplama, bounce, overshoot gibi dikkat çeken efektleri kaldırmak
- fade/opacity/çok hafif state geçişleriyle yeterli sinyali korumak
- yön hissi gerekiyorsa daha sade biçimde vermek

## 22.4. Zayıf davranışlar

- reduced motion tercihini tamamen yok saymak
- reduced motion’da hiçbir state feedback bırakmamak
- sadece navigation transition’ı kapatıp component motion’larını unutmak

---

# 23. Motion ve Accessibility İlişkisi

## 23.1. Denge ilkesi

Motion, erişilebilirliği desteklemelidir.
Ne aşırı hareket ne de tamamen sessizlik her zaman doğru değildir.

## 23.2. Düşünülmesi gereken alanlar

- focus görünürlüğü motion’a bağımlı olmamalı
- success/error yalnızca animasyonla anlatılmamalı
- modal açılışı screen reader ve focus davranışıyla uyumlu olmalı
- auto-dismiss motion’lar kritik bilgiyi kaçırmamalı

---

# 24. Motion ve Performance İlişkisi

## 24.1. Kural

Motion performans dostu olmalıdır.
Aksi halde “kaliteli his” yerine “ağır uygulama” hissi üretir.

## 24.2. Risk alanları

- layout thrash
- ağır screen transition
- uzun listede hareketli öğeler
- büyük blur/backdrop efektleri
- gereksiz rerender ile bağlı motion
- düşük cihazlarda jank

## 24.3. Zayıf davranışlar

- perf pahasına gösterişli animasyon
- list item’ların sürekli animasyonlu olması
- route geçişlerinin ağır ve hissedilir gecikme üretmesi

## 24.4. Animasyon FPS Hedefi ve Performance Standard Cross-Reference

Bu belgedeki tüm animasyonlar, performans açısından `13-performance-standard.md` §12’de tanımlanan FPS (Frames Per Second) baseline’ına tabidir. Motion kalitesi yalnızca "doğru hareket" ile değil, "akıcı hareket" ile de ölçülür. En doğru easing ve timing bile düşük FPS’de jank’li (takılmalı) hissedilir.

### 24.4.1. FPS hedefi özeti

Bu bölüm, `13-performance-standard.md` §12’deki kuralların bu belge bağlamındaki özetidir:

- **Temel hedef:** Tüm UI animasyonları **60fps** hedeflemelidir. 60fps, saniyede 60 kare demektir ve her kare yaklaşık 16.67ms içinde render edilmelidir. Bu, insan gözünün "akıcı" algıladığı minimum standart FPS’dir.
- **120Hz cihazlar:** 120Hz ekrana sahip cihazlarda (iPhone Pro serisi, iPad Pro, bazı Android flagship’ler) **120fps** tercih edilmelidir. 120fps, her karenin yaklaşık 8.33ms içinde render edilmesini gerektirir. Bu, animasyonların "ipek gibi" hissettirmesini sağlar. Ancak 120fps’i tutturamıyorsa 60fps’e düşmek kabul edilir; 60fps altına düşmek kabul edilmez.
- **Dropped frame (düşen kare) toleransı:** Art arda **3’ten fazla dropped frame** "jank" (takılma, kasılma) sayılır ve kabul edilmez. Tek bir dropped frame algılanamayabilir; 2-3 art arda da tolere edilebilir. Ama 4+ art arda dropped frame, kullanıcının "takıldı" diye algıladığı eşiktir.

### 24.4.2. Performans bütçesi aşıldığında motion degradation stratejisi

Eğer bir cihazda veya durumda animasyonlar hedef FPS’i tutturamıyorsa, motion **azaltılır**, tamamen **kaldırılmaz.** Bu, kademeli bir degradation (bozulma) stratejisidir:

**Kademe 1 — Duration kısaltma:**
- Animasyon süreleri kısaltılır. Ör: `duration-standard` (250ms) → 150ms, `duration-slow` (350ms) → 200ms.
- Daha kısa animasyon, daha az kare render etmeyi gerektirir ve GPU/CPU yükünü azaltır.
- Bu, kullanıcının hala animasyonu algılamasını sağlar ama performans yükünü düşürür.

**Kademe 2 — Easing basitleştirme:**
- Karmaşık easing eğrileri (emphasized, spring) basit easing’lere (linear, ease-out) dönüştürülür.
- Karmaşık easing, her karedeki pozisyon hesaplamasını ağırlaştırabilir. Basit easing bu yükü azaltır.
- Kullanıcı farkı çoğu zaman algılamaz ama cihaz farkı hisseder.

**Kademe 3 — Animasyon devre dışı bırakma:**
- Kademe 1 ve 2 yeterli olmazsa, animasyon tamamen devre dışı bırakılır. State değişimleri anında gerçekleşir.
- Bu, son çare olarak uygulanır. Animasyonun tamamen kaldırılması, kullanıcı deneyimini düşürür ama takılmalı animasyon göstermekten **daha iyidir.** Çünkü takılmalı animasyon "yavaş uygulama" hissi verirken, animasyonsuz geçiş "hızlı ama sade uygulama" hissi verir.

**Bu degradation otomatik olmalıdır.** Uygulama, runtime’da FPS’i izleyip (ör: `requestAnimationFrame` timing, React Native’de `InteractionManager`), hedef FPS’in altına düşüldüğünde kademeleri otomatik uygulamalıdır. Geliştiricinin her ekranda manuel karar vermesi beklenmez.

---

# 25. Motion ve Design Tokens İlişkisi

## 25.1. Kural

Motion değerleri token sistemine bağlı olmalıdır.
Component içinde rastgele süre/easing yazılmaz.

## 25.2. Token türleri

- duration tokens
- easing tokens
- semantic motion tokens
- reduced motion overrides (mantıksal düzeyde)

## 25.3. Zayıf davranışlar

- her component’te farklı süre
- token var ama kullanılmıyor
- semantic motion rolü olmadan ham değer tüketimi

---

# 26. Motion ve Component Governance İlişkisi

## 26.1. Kural

Reusable component aileleri motion contract’ı da taşımalıdır.
Örneğin:
- Button press feedback
- Accordion expand behavior
- Dialog open/close behavior
- Tabs selection indicator behavior

bunlar feature’larda yeniden icat edilmemelidir.

## 26.2. Zayıf davranışlar

- aynı button ailesinin farklı ekranlarda farklı press tepkisi
- aynı drawer/sheet pattern’inin farklı motion kullanması
- component contract’ında motion state’inin düşünülmemesi

---

# 27. Interaction Density ve Motion Yoğunluğu

## 27.1. Neden önemli?

Yoğun arayüzlerde aşırı hareket bilişsel yükü artırır.
Bu yüzden motion yoğunluğu yüzeyin bilgi yoğunluğuna göre dengelenmelidir.

## 27.2. Kural

- yoğun data surfaces: daha sakin feedback
- ana call-to-action alanları: daha net ama kısa feedback
- hızlı tekrarlı aksiyonlar: çok hafif ve çabuk feedback
- modallar/geçişler: yön açıklayan daha belirgin ama kontrollü motion

## 27.3. Zayıf davranışlar

- yoğun tabloda her hover’da ağır animasyon
- uzun listede her item’in bağımsız yüzer gibi davranması
- data yoğunluğu ile motion yoğunluğunu aynı anda artırmak

---

# 28. Gesture ile Interaction Standardı

## 28.1. Kapsam

Özellikle mobile için:
- swipe actions
- drag handles
- pull to refresh
- sheet dismiss gestures
- edge back gestures

## 28.2. Kural

Gesture’lar:
- görsel geri bildirim taşımalı
- yanlışlıkla tetiklenmeye karşı kontrollü olmalı
- tek erişim yolu olmamalı (gerekli durumlarda alternatif bulunmalı)
- accessibility ile çelişmemeli

## 28.3. Zayıf davranışlar

- yalnızca swipe ile erişilebilen kritik aksiyonlar
- gesture başladığında hiçbir görsel/state feedback olmaması
- dismiss gesture ile destructive kayıp riski doğması

## 28.4. Haptic Feedback Standardı

Haptic feedback, kullanıcının parmağına iletilen fiziksel titreşim geri bildirimidir. Dokunmatik ekranlı mobil cihazlarda, kullanıcıya "etkileşimin karşılığı var" hissini dokunma duyusuyla veren güçlü bir UX aracıdır. Ancak doğru kullanılmazsa gürültüye dönüşür ve kullanıcıyı rahatsız eder.

**Kapsam notu:** Haptic feedback yalnızca mobil platformlarda geçerlidir. Web'de haptic feedback'in karşılığı yoktur (Vibration API sınırlı desteğe sahiptir ve kaliteli haptic üretemez). Web uygulamalarında haptic bölümleri görmezden gelinir.

### 28.4.1. Üç ana haptic türü

Haptic feedback üç temel şiddet seviyesinde kategorize edilir. Her seviyenin kullanım alanı farklıdır:

**1. Light impact (hafif darbe):**
- **Fiziksel his:** Kısa, hafif bir titreşim. Parmak ucunda "tık" hissi.
- **Kullanım alanları:**
  - Toggle switch state değişimi (açık ↔ kapalı)
  - Checkbox işaretleme/kaldırma
  - Radio button seçim değişimi
  - Tab switch (bir tab'dan diğerine geçiş)
  - Picker/wheel scroll sırasında her değer üzerinden geçerken (detent feedback)
  - Copy-to-clipboard tamamlanması
  - Like/favorite toggle
- **Sıklık:** En sık kullanılan haptic türüdür. Günlük kullanımda düzinelerce kez tetiklenebilir.
- **Şiddet:** Düşük. Kullanıcı fark eder ama dikkatini dağıtmaz.

**2. Medium impact (orta darbe):**
- **Fiziksel his:** Orta şiddette, daha belirgin bir titreşim. "Klık" hissi.
- **Kullanım alanları:**
  - Destructive action onayı (ör: "Sil" butonuna basıldığında onay dialog'u açılmadan önce)
  - Drag-and-drop sırasında bir öğenin hedef pozisyona snap olması (yerine oturma anı)
  - Bottom sheet'in bir snap point'e ulaşması (ör: yarı açık → tam açık geçişinde)
  - Pull-to-refresh threshold'una ulaşma anı (kullanıcı yeterince aşağı çektiğinde)
  - Long-press context menu açılma anı
- **Sıklık:** Light'tan daha az, ama düzenli kullanılır.
- **Şiddet:** Orta. Kullanıcıya "önemli bir şey oldu" sinyali verir.

**3. Heavy impact (güçlü darbe):**
- **Fiziksel his:** Güçlü, belirgin bir titreşim. "Thud" hissi.
- **Kullanım alanları:**
  - Force touch / 3D touch aktivasyonu
  - Critical action confirmation (ör: hesap silme onayı, geri alınamaz işlem)
  - Çok nadir, gerçekten kritik anlarda
- **Sıklık:** **Çok nadir kullanılmalıdır.** Bir oturumda 1-2 kereden fazla tetiklenmemelidir. Sık kullanım haptic'in etkisini azaltır ve kullanıcıyı rahatsız eder.
- **Şiddet:** Yüksek. Kullanıcıya "dur ve dikkat et" sinyali verir.

### 28.4.2. Ek haptic türleri

Temel üç darbe türüne ek olarak, özel amaçlı haptic pattern'ler de mevcuttur:

**Selection feedback:**
- **Ne yapar:** Çok hafif, kısa bir titreşim dizisi. Her seçim değişiminde bir "tık" hissi.
- **Kullanım:** Liste item seçiminde, picker scroll sırasında her değer üzerinden geçerken.
- **Farkı:** Light impact'ten daha hafiftir. Sürekli tekrarlı kullanıma uygundur.

**Success notification:**
- **Ne yapar:** Kısa çift titreşim (ta-da hissi). İki kısa titreşim art arda.
- **Kullanım:** İşlem başarıyla tamamlandığında. Ör: form gönderimi başarılı, dosya yükleme tamamlandı.
- **Görsel eşlik:** Success checkmark animasyonu ile birlikte tetiklenir.

**Error notification:**
- **Ne yapar:** Kısa üçlü titreşim (ta-ta-ta hissi). Üç kısa titreşim art arda.
- **Kullanım:** Hata durumunda. Ör: form validation hatası, network error.
- **Görsel eşlik:** Error shake animasyonu ile birlikte tetiklenir.

### 28.4.3. Haptic ne zaman KULLANILMAMALI?

Haptic feedback "özel anlar" için tasarlanmıştır, sürekli gürültü için değil. Aşağıdaki durumlarda haptic **kesinlikle kullanılmamalıdır:**

- **Scroll sırasında:** Kullanıcı bir listeyi kaydırırken her satır geçişinde haptic tetiklenmez. Bu, kullanıcıyı anında rahatsız eder. (Tek istisna: picker/wheel scroll'da detent feedback.)
- **Her butona tıklamada:** Normal butonlara (ör: "Kaydet", "İptal", "Geri") her tıklamada haptic verilmez. Haptic yalnızca özel state değişimleri ve önemli anlarda kullanılır.
- **Sürekli animasyonlarda:** Loading spinner dönerken, shimmer kayarken veya progress bar ilerlerken haptic tetiklenmez.
- **Keyboard typing sırasında:** Klavye tuşlarına her basışta haptic verilmez (bu, cihazın kendi keyboard haptic ayarıdır, uygulama bunu kontrol etmemelidir).
- **Pasif content görüntülemede:** Sayfa yüklendiğinde, data geldiğinde, content refresh edildiğinde haptic tetiklenmez.

### 28.4.4. Erişilebilirlik kuralları

Haptic feedback, erişilebilirlik açısından şu kurallara tabidir:

- **Haptic, bilgiyi iletmenin TEK yolu olmamalıdır.** Her haptic feedback, mutlaka görsel veya sesli bir feedback ile eşlik etmelidir. Örneğin: toggle switch'te haptic + görsel state değişimi birlikte olmalıdır. Yalnızca haptic ile "açıldı" demeye çalışmak, haptic'i hissedemeyen kullanıcıları dışlar.
- **Cihaz haptic ayarına saygı:** Kullanıcı cihaz ayarlarından haptic/titreşimi kapatmışsa, sistem bu haptic çağrılarını otomatik olarak engeller. Uygulama bu ayarı **override etmemelidir.** `UIImpactFeedbackGenerator` (iOS) ve `VibrationEffect` (Android) zaten bu kontrolü sistem seviyesinde yapar.
- **Haptic intensity konfigüre edilemez:** Uygulama içinde "haptic şiddetini ayarla" gibi bir ayar sunulmaz. Bu, cihaz seviyesinde bir tercihtir.

### 28.4.5. Platform implementasyonu

**iOS:**
- `UIImpactFeedbackGenerator` sınıfı kullanılır. Üç şiddet seviyesi: `.light`, `.medium`, `.heavy`.
- Ek olarak: `UISelectionFeedbackGenerator` (selection feedback), `UINotificationFeedbackGenerator` (success/warning/error notification).
- Haptic engine'i önceden hazırlamak (`prepare()`) çağrısı ile gecikme minimize edilir. Yoğun kullanım beklenen ekranlarda `viewDidAppear`'da prepare çağrılır.

**Android:**
- `VibrationEffect` sınıfı kullanılır (API level 26+).
- Predefined efektler: `VibrationEffect.EFFECT_CLICK` (light), `VibrationEffect.EFFECT_HEAVY_CLICK` (heavy), `VibrationEffect.EFFECT_TICK` (selection).
- Android'de haptic kalitesi cihaza göre çok değişir. Bazı cihazlarda sadece basit vibration motoru vardır, bazılarında gelişmiş linear motor vardır. Uygulama bunu kontrol edemez, sistem en iyi sonucu üretir.

**React Native:**
- `expo-haptics` kütüphanesi kullanılır: `Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)`, `Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)`.
- Alternatif: `react-native-haptic-feedback` kütüphanesi: `trigger('impactLight')`, `trigger('notificationSuccess')`.
- Her iki kütüphane de iOS ve Android'de native haptic API'lerini çağırır.

### 28.4.6. Reduced motion ve haptic ilişkisi

Reduced motion ayarı haptic feedback'i **etkilemez.** Bunun nedeni: haptic fiziksel titreşimdir, görsel hareket değildir. `prefers-reduced-motion` tercihi yalnızca ekrandaki görsel hareketleri hedefler. Bir kullanıcı görsel hareketten rahatsız olabilir ama haptic'ten olmayabilir — bunlar farklı duyusal kanallardır.

Ancak kullanıcının **cihaz haptic ayarına** saygı gösterilmelidir. Kullanıcı cihazında titreşimi kapattıysa, uygulama bu tercihi geçersiz kılmamalıdır.

---

# 29. Motion and Interaction Anti-Pattern Listesi

Aşağıdaki davranışlar bu proje kapsamında zayıf kabul edilir:

1. Sebepsiz animasyon kullanmak
2. Her component’in kendi motion dilini üretmesi
3. Press feedback vermemek
4. Hover/focus/selected state’leri karıştırmak
5. Modal, sheet ve screen transition’larını aynı şekilde ele almak
6. Reduced motion tercihini görmezden gelmek
7. Success/error bilgisini yalnızca hareketle vermek
8. Aşırı bounce/spring ile premium his yerine oyuncak hissi üretmek
9. Gecikmeyi animasyonla gizlemeye çalışmak
10. Hareket yüzünden interaction responsiveness’i düşürmek
11. Motion tokenlarını kullanmamak
12. Düşük performanslı yoğun yüzeylerde gereksiz animasyon eklemek
13. Focus görünürlüğünü hareket var sanıp zayıflatmak
14. Navigation yön duygusunu kaybettiren generic fade kullanımına kaçmak
15. Component contract’ı dışında motion davranışlarını feature’larda yeniden icat etmek

---

# 30. Motion Kararı Verirken Sorulacak Sorular

Bir motion veya interaction davranışı tasarlanırken şu sorular sorulmalıdır:

1. Bu hareket neyi açıklıyor?
2. Bu hareket olmasa kullanıcı neyi kaybeder?
3. Bu state yalnızca hareketle mi anlatılıyor?
4. Hareket tepkiyi hızlandırıyor mu, geciktiriyor mu?
5. Aynı family’de benzer öğeler aynı dili konuşuyor mu?
6. Reduced motion’da bunun karşılığı ne olacak?
7. Bu hareket performans açısından güvenli mi?
8. Bu davranış navigation mantığıyla uyumlu mu?
9. Bu hareket premium hissiyat katıyor mu, yoksa ucuz efekt hissi mi veriyor?
10. Bu hareket sistemde zaten tanımlı başka bir role çakışıyor mu?

---

# 31. Sonraki Dokümanlara Etkisi

## 31.1. Error / empty / loading states
`25-error-empty-loading-states.md`, loading/success/error feedback motion’larını bu belgeyle uyumlu biçimde tanımlamalıdır.

## 31.2. Contribution guide
`30-contribution-guide.md`, yeni reusable component veya interaction pattern eklenirken motion contract’ının nasıl düşünülmesi gerektiğini bu belgeye bağlamalıdır.

## 31.3. Audit checklist
`31-audit-checklist.md`, motion tutarsızlıkları, reduced motion eksikleri, press/focus feedback boşlukları ve interaction state sorunlarını bu belgeye göre denetlemelidir.

## 31.4. Definition of done
`32-definition-of-done.md`, interaction-heavy component ve flow’ların tamamlanmış sayılması için motion/feedback/reduced-motion koşullarını bu belgeye göre sabitlemelidir.

## 31.5. ADR-007 styling kararları
`ADR-007-styling-tokens-and-theming-implementation.md`: ADR-007, motion token’larının styling implementasyonundaki canonical karar otoritesidir. Bu belgedeki motion token aileleri ve tüketim kuralları, ADR-007’deki implementasyon kararlarıyla uyumlu olmalıdır.

---

# 32. Onay Kriterleri

Bu doküman yeterli kabul edilir eğer:

1. Motion’ın amaçları ve amaç olmaması gereken alanlar netleşmişse,
2. Press, hover, focus, selection, expand/collapse, modal/sheet ve screen transition davranışları tanımlanmışsa,
3. Timing/easing ve token ilişkisi görünür kılınmışsa,
4. Reduced motion standardı açıkça yazılmışsa,
5. A11y ve performance ilişkisi kurulmuşsa,
6. Anti-pattern’ler net biçimde tanımlanmışsa,
7. Sonraki feedback, contribution ve audit dokümanlarına uygulanabilir temel sağlanmışsa.

---

# 33. Kısa Sonuç

Bu dokümanın ana çıktısı şudur:

> Bu boilerplate kapsamında motion ve interaction, süsleme alanı değil; kullanıcıya yön, tepki, durum değişimi ve bağlam bilgisi veren; component ve navigation katmanında tutarlı çalışan; reduced motion ve performans kısıtlarını ciddiye alan sistem davranışıdır.

Bu nedenle bundan sonraki hiçbir implementasyon:
- hareketi rastgele dekorasyon gibi kullanamaz,
- interaction feedback’i belirsiz bırakamaz,
- reduced motion’ı opsiyonel detay gibi göremez,
- press/focus/selection state’lerini sistem dışı doğaçlama çözemez,
- motion token ve contract disiplini olmadan premium hissiyat iddiasında bulunamaz.

---

# 34. Haptic Feedback Standardı (2026-04-01 Eki)

## 34.1. Haptic feedback’in rolü

Haptic feedback, kullanıcıya fiziksel geri bildirim vererek motion ile sinerji oluşturan bir etkileşim katmanıdır. Amacı kullanıcı aksiyonlarını somut şekilde teyit etmek, ekrandaki görsel değişimleri dokunsal olarak desteklemek ve etkileşim güvenini artırmaktır.

Haptic feedback:
- görsel motion’ın fiziksel tamamlayıcısıdır,
- kullanıcıya "sistem aksiyonu aldı" mesajını iletir,
- snap, toggle, confirm gibi kısa süreli kararlarda belirginlik sağlar,
- doğru kullanıldığında premium hissiyatı güçlendirir.

## 34.2. Canonical araç

Bu projede haptic feedback için **expo-haptics** canonical araçtır. Bu seçim Expo SDK (ADR-002) entegrasyonu nedeniyledir. expo-haptics, iOS Taptic Engine ve Android Vibration API üzerinden platform-native haptic tetikleme sağlar.

## 34.3. Haptic tipleri ve kullanım senaryoları

### 34.3.1. Impact

Impact haptic, kullanıcının bir aksiyonu fiziksel olarak hissetmesi gereken kısa, kesin geri bildirimlerdir.

Kullanım senaryoları:
- **Tap confirmation:** Bir butonun veya interaktif öğenin başarıyla tıklanması
- **Snap-to-place:** Drag & drop sonrası öğenin yerine oturması
- **Toggle switch:** Açma/kapama anahtarının durum değiştirmesi

### 34.3.2. Notification

Notification haptic, sistem sonuçlarını dokunsal olarak bildirmek için kullanılır. Üç alt tipi vardır:

- **Success:** Ödeme onayı, form başarıyla gönderilmesi, işlem tamamlanması
- **Warning:** Düşük bakiye, yaklaşan limit, dikkat gerektiren durum
- **Error:** Form doğrulama hatası, başarısız işlem, bağlantı kopması

### 34.3.3. Selection

Selection haptic, değer değişimlerinde hafif dokunsal geri bildirim sağlar.

Kullanım senaryoları:
- **Picker/slider değer değişimi:** Her değer adımında hafif titreşim
- **Liste item seçimi:** Seçim yapıldığında kısa dokunsal onay
- **Segmented control:** Segment değişikliğinde hafif feedback

## 34.4. Platform farkları

### 34.4.1. iOS

iOS, Taptic Engine ile zengin bir haptic palette sunar. UIImpactFeedbackGenerator üzerinden light, medium, heavy seviyeleri desteklenir. UINotificationFeedbackGenerator ile success, warning, error ayrımı donanım düzeyinde yapılır. UISelectionFeedbackGenerator ise picker ve selection feedback’leri için optimize edilmiştir.

### 34.4.2. Android

Android, Vibration API üzerinden çalışır ve iOS’a kıyasla daha kısıtlı bir haptic deneyimi sunar. HapticFeedbackConstants ile belirli sayıda preset desteklenir. Cihazlar arası haptic kalitesi değişkendir; bazı cihazlarda motor kalitesi düşük olabilir. Bu nedenle Android’de haptic feedback, best-effort yaklaşımıyla ele alınmalıdır.

### 34.4.3. Web

Web platformunda `navigator.vibrate()` API’si sınırlı destek sunar. Tüm tarayıcılarda desteklenmez ve haptic deneyimi mobil cihazlara kıyasla oldukça kısıtlıdır. Web’de haptic feedback best-effort olarak ele alınmalı ve asla tek geri bildirim kanalı olarak kullanılmamalıdır.

## 34.5. Reanimated 4 worklet entegrasyonu

### 34.5.1. Gesture Handler v3 ile koordineli haptic tetikleme

Gesture Handler v3 gesture event’leri ile haptic feedback koordineli çalışmalıdır. Gesture’ın belirli eşiklerine ulaşıldığında (örneğin snap noktası, drag sınırı) haptic tetiklenmelidir.

### 34.5.2. UI thread’de haptic çağrısı

react-native-nitro-haptics worklet desteği ile haptic çağrıları doğrudan UI thread üzerinde yapılabilir. Bu, JS bridge gecikmesini ortadan kaldırarak anında feedback sağlar.

### 34.5.3. 120fps gesture + haptic senkronizasyonu

Yüksek kare hızındaki gesture animasyonları ile haptic feedback senkronize olmalıdır. Haptic tetikleme, gesture’ın doğru anında (frame-accurate) gerçekleşmelidir. Geciken veya yanlış zamanlama haptic deneyimini bozar.

## 34.6. Performans kuralları

1. **Aşırı haptic kullanma:** Her dokunuşa haptic eklemek kullanıcı yorgunluğuna yol açar. Haptic yalnızca anlamlı state değişimlerinde tetiklenmelidir.
2. **Haptic süresini kısa tut:** Tek bir haptic feedback süresi 100ms’yi aşmamalıdır. Uzun süren vibrasyon kullanıcı rahatsızlığı yaratır.
3. **Reduced motion tercihi:** Kullanıcı reduced motion tercihini aktifleştirmişse haptic feedback de azaltılmalıdır. Kritik bildirimler (error, success) korunabilir, ancak selection ve impact feedback’leri devre dışı bırakılmalı veya hafifletilmelidir.
4. **Battery etkisi:** Aşırı haptic kullanımı batarya tüketimini artırır. Özellikle yoğun liste kaydırma gibi senaryolarda haptic tetikleme sıklığı throttle edilmelidir.

## 34.7. Accessibility

1. **Haptic tek başına bilgi taşımamalı:** Haptic feedback her zaman görsel ve/veya sesli feedback ile birlikte kullanılmalıdır. Yalnızca haptic ile iletilen bilgi, haptic’i hissedemeyen kullanıcılar için kaybolur.
2. **prefers-reduced-motion saygısı:** Kullanıcının sistem düzeyindeki reduced motion tercihi haptic davranışını da etkilemelidir. Bu tercih aktifse haptic feedback azaltılmalı veya sadece kritik bildirimlerle sınırlandırılmalıdır.
3. **VoiceOver/TalkBack uyumu:** Haptic feedback, screen reader kullanıcıları için ek bilgi sağlayabilir ancak asla screen reader announcement’ının yerini almamalıdır.

## 34.8. Anti-pattern’ler

Aşağıdaki haptic kullanımları bu projede zayıf kabul edilir:

1. **Her dokunuşta haptic:** Tüm tap event’lerine haptic eklemek, kullanıcıda duyarsızlaşma yaratır ve premium his yerine ucuz cihaz hissi verir.
2. **Uzun süren vibrasyon:** 100ms’yi aşan sürekli vibrasyon, kullanıcıda fiziksel rahatsızlık yaratır. Özellikle notification tipleri kısa ve kesin olmalıdır.
3. **Haptic’i tek geri bildirim kanalı olarak kullanma:** Haptic olmadan bilgi iletilemeyen durumlar accessibility ihlalidir. Haptic her zaman görsel feedback’in tamamlayıcısı olmalıdır.
4. **Platform farkını görmezden gelme:** iOS ve Android’de aynı haptic kodunu çalıştırıp sonucu test etmemek, platformların birinde kötü deneyime yol açar.
5. **Gesture ile senkronize olmayan haptic:** Gesture animasyonundan bağımsız, gecikmeli veya yanlış zamanlı haptic tetikleme, kullanıcıda kopukluk hissi yaratır.
