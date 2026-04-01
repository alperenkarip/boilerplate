# 12-accessibility-standard.md

## Doküman Kimliği

- **Doküman adı:** Accessibility Standard
- **Dosya adı:** `12-accessibility-standard.md`
- **Doküman türü:** Standard / quality baseline / compliance and usability document
- **Durum:** Accepted
- **Kapsam:** Bu boilerplate kapsamında erişilebilirliğin ne anlama geldiğini, hangi alanlarda zorunlu standart olduğunu, UI/UX, navigation, form, state, feedback ve component davranışlarıyla nasıl ilişkilendiğini, hangi kuralların minimum kabul edileceğini ve hangi ihlallerin kalite kusuru sayılacağını tanımlar.
- **Bağlı olduğu üst dokümanlar:**
  - `00-project-charter.md`
  - `01-working-principles.md`
  - `02-product-platform-philosophy.md`
  - `03-ui-ux-quality-standard.md`
  - `04-design-system-architecture.md`
  - `05-theming-and-visual-language.md`
  - `08-navigation-and-flow-rules.md`
  - `11-forms-inputs-and-validation.md`
- **Doğrudan etkileyeceği dokümanlar:**
  - `13-performance-standard.md`
  - `14-testing-strategy.md`
  - `15-quality-gates-and-ci-rules.md`
  - `16-tooling-and-governance.md`
  - `23-component-governance-rules.md`
  - `24-motion-and-interaction-standard.md`
  - `25-error-empty-loading-states.md`
  - `31-audit-checklist.md`
  - `32-definition-of-done.md`
  - `34-hig-enforcement-strategy.md`

---

# 1. Amaç

Bu dokümanın amacı, boilerplate kapsamında erişilebilirliği “sonradan eklenebilecek iyileştirme” olmaktan çıkarıp, ürün kalitesinin zorunlu ve denetlenebilir bir parçası haline getirmektir.

Bu belge şu sorulara net cevap verir:

1. Accessibility bu projede ne demektir?
2. Minimum erişilebilirlik standardı nedir?
3. Görsel, etkileşimsel, bilişsel ve yapısal erişilebilirlik nasıl ele alınmalıdır?
4. Touch target, focus order, labels, hints, contrast, dynamic type ve reduced motion neden temel kalite kriteridir?
5. Screen reader, keyboard ve assistive tech davranışları nasıl düşünülmelidir?
6. Formlar, modallar, listeler, navigation ve feedback state’ler erişilebilirlik açısından nasıl değerlendirilmelidir?
7. Hangi ihlaller doğrudan kalite kusuru sayılır?
8. Accessibility nasıl test edilir, nasıl audit edilir, nasıl enforce edilir?

Bu belge, erişilebilirliği yalnızca “engelli kullanıcı desteği” gibi dar ve yanlış bir çerçeveye sıkıştırmaz.
Erişilebilirlik burada aynı zamanda:
- kullanılabilirlik,
- güven,
- okunabilirlik,
- ergonomi,
- hata toparlanabilirliği,
- platform saygısı
alanlarının parçasıdır.

---

# 2. Neden Bu Doküman Gerekli

Erişilebilirlik çoğu projede üç yanlış biçimde ele alınır:

## 2.1. Hiç düşünülmez
Bu durumda ekip yalnızca görsel sonuç odaklı çalışır ve şu problemler oluşur:
- küçük hit area
- düşük kontrast
- labelsız ikon butonlar
- screen reader için anlamsız yüzeyler
- klavye ile kullanılamayan ekranlar
- modal açılınca focus kaybı
- hata alanlarının duyurulmaması
- motion hassasiyeti göz ardı edilmesi

## 2.2. Sadece “birkaç aria etiketi” sanılır
Bu durumda erişilebilirlik yalnızca teknik etiket düzeyine indirgenir.
Oysa problem bundan daha büyüktür:
- yapı
- sıra
- okunabilirlik
- davranış
- geri bildirim
- hareket
- hata yönetimi
- görev tamamlanabilirliği

bunların hepsi erişilebilirlik alanına girer.

## 2.3. Sonradan yapılacak iş sayılır
Bu durumda sistem ilk günden yanlış kurulur ve sonradan düzeltmek çok pahalı hale gelir.
Özellikle:
- component contract
- focus yönetimi
- modal / navigation davranışı
- form alanı yapısı
- contrast semantiği
- touch ergonomisi
sonradan patch’lenmeye çalışılır.

Bu proje kapsamında bu yaklaşım kabul edilmez.

---

# 3. Temel Tez

Bu proje kapsamında temel tez şudur:

> Accessibility, görsel katmana sonradan eklenen yardımcı etiketler değil; kullanıcıların ürünü görme, anlama, odaklama, etkileşime girme, hata yapma, toparlama ve görevi tamamlama biçimlerini kapsayan temel kalite sistemidir.

Bu tez şu sonuçları doğurur:

1. Erişilebilirlik olmadan yüksek UI/UX kalitesinden söz edilemez.
2. Component contract’ları a11y kuralları olmadan tamamlanmış sayılmaz.
3. Form, navigation, modal, feedback ve motion kararları erişilebilirlik açısından birlikte düşünülmelidir.
4. Touch target, focus, contrast ve label sistemleri “ince detay” değil, ana standarttır.
5. Accessibility test ve audit’i olmayan proje, kalite iddiasını eksik taşır.

---

# 4. Accessibility’nin Bu Projedeki Kapsamı

Bu boilerplate kapsamında accessibility aşağıdaki boyutları kapsar:

1. Perceivable — algılanabilirlik
2. Operable — kullanılabilirlik / etkileşebilirlik
3. Understandable — anlaşılabilirlik
4. Robust — farklı yardımcı teknolojilerle çalışabilirlik

Bu dört alan yalnızca teori olarak değil, pratik ürün yüzeyine indirgenmelidir.

---

# 5. Perceivable — Algılanabilirlik

## 5.1. Tanım

Kullanıcı, ekrandaki bilgi ve durumları algılayabilmelidir.
Bu sadece görme ile sınırlı değildir; screen reader ve diğer yardımcı teknolojiler için de geçerlidir.

## 5.2. Zorunlu alanlar

- yeterli kontrast
- metin okunabilirliği
- anlamın yalnızca renkle verilmemesi
- durumların yalnızca ikonla verilmemesi
- label ve helper açıklık
- önemli state değişikliklerinin algılanabilir olması
- dinamik içeriğin duyurulabilir olması

## 5.3. Zayıf algılanabilirlik örnekleri

- açık gri arka plan üstüne daha açık gri metin
- error durumunu sadece kırmızı border ile vermek
- ikonun ne işe yaradığını metinsiz bırakmak
- selected state’i yalnızca çok küçük bir tonal farkla göstermek
- skeleton / loading durumunda ekranın anlamsız hale gelmesi

---

# 6. Operable — Kullanılabilirlik / Etkileşebilirlik

## 6.1. Tanım

Kullanıcı arayüzü gerçekten kullanabilmelidir.
Bu:
- dokunma,
- tıklama,
- klavye,
- screen reader navigation,
- switch control,
- fokus yönetimi
gibi alanları içerir.

## 6.2. Zorunlu alanlar

- touch target yeterliliği
- keyboard erişimi
- focus görünürlüğü
- focus order
- modal/dialog focus trapping ve restore
- dismiss/back davranış erişilebilirliği
- gesture ile yapılan işin alternatif yolunun olması (gerektiği yerde)

## 6.3. Zayıf operability örnekleri

- küçük icon button’lar
- focus’un kaybolduğu modallar
- tab ile gidilemeyen form alanları
- klavye ile kapanmayan dialog
- yalnızca swipe ile erişilen ama alternatif yolu olmayan aksiyonlar

## 6.4. Gesture Erişilebilirlik Yedek Mekanizmaları

### 6.4.1. Neden gerekli?

Gesture tabanlı etkileşimler (kaydırma, çimdikleme, uzun basma, sürükle-bırak vb.) her kullanıcı tarafından gerçekleştirilemez. Aşağıdaki kullanıcı grupları gesture kullanmakta zorluk yaşar veya hiç kullanamaz:

- **Motor engelli kullanıcılar:** Parmak koordinasyonu gerektiren hareketleri (swipe, pinch, long-press) fiziksel olarak yapamayabilirler.
- **Switch access kullananlar:** Tekli veya çoklu switch cihazları ile arayüzü kullanan kişiler gesture yapamaz. Bu kullanıcılar yalnızca buton benzeri hedeflere ulaşabilir.
- **Keyboard-only kullanıcılar:** Web veya harici klavye ile çalışan kullanıcılar gesture'a erişemez. Tüm eylemlerin klavye ile tetiklenebilmesi gerekir.
- **Screen reader kullanıcıları:** VoiceOver ve TalkBack kendi gesture setini kullanır (tek parmakla sağa/sola kaydırma = sonraki/önceki öğe, iki parmakla kaydırma = scroll vb.). Uygulamanın özel gesture'ları screen reader modunda çalışmaz veya çakışır.

Bu nedenle gesture tabanlı etkileşimlerin erişilebilir alternatifleri olmadan bırakılması bu kullanıcı gruplarını tamamen dışlar.

### 6.4.2. Kural

Her gesture-based etkileşimin erişilebilir bir alternatifi **OLMALIDIR**. Gesture, bilgiyi veya eylemi iletmenin **TEK** yolu olmamalıdır. Bir kullanıcı hiçbir gesture kullanmadan uygulamanın tüm özelliklerine erişebilmelidir.

### 6.4.3. Gesture türleri ve zorunlu fallback'leri

#### 1. Swipe-to-delete (sağa/sola kaydırarak silme)

Kullanıcı bir liste öğesini sağa veya sola kaydırarak silme, arşivleme veya başka bir aksiyon tetikler.

**Zorunlu fallback:**
- Item üzerinde context menu'de "Sil" seçeneği sunulmalıdır. Bu, item'a long-press (veya sağ-tık) ile açılan action sheet içinde yer almalıdır.
- Web'de: Hover durumunda beliren "Sil" butonu veya sağ-tık context menu ile erişilebilir olmalıdır.
- Fallback aksiyonu, swipe ile tetiklenen aksiyon ile **birebir aynı işlevi** görmelidir. "Swipe ile sil ama butonla arşivle" gibi tutarsızlık kabul edilmez.

#### 2. Long-press (uzun basma)

Kullanıcı bir öğeye uzun basarak ek seçenekler, önizleme veya bağlam menüsü açar.

**Zorunlu fallback:**
- Long-press ile açılan seçenekler, görünür bir buton veya menü üzerinden de erişilebilir olmalıdır. Örneğin: üç nokta menü ikonu (⋯), "Seçenekler" butonu veya item'ın detay sayfasında aynı aksiyonlar.
- Long-press ile açılan preview (ör: iOS peek/pop) bilgilendirici ise alternatif yol sunulmalıdır (ör: item'a dokunarak detay sayfasına gitme).
- Screen reader'da: `accessibilityActions` prop'u ile long-press aksiyonları tanımlanmalıdır. VoiceOver'da "Actions available" duyurusu yapılmalı, kullanıcı custom action listesinden seçim yapabilmelidir.

#### 3. Pinch-to-zoom (çimdikleyerek yakınlaştırma)

Kullanıcı iki parmakla çimdikleyerek içeriği yakınlaştırır veya uzaklaştırır (harita, görsel, doküman vb.).

**Zorunlu fallback:**
- **+** ve **−** butonları ile zoom kontrolü sağlanmalıdır. Bu butonlar ekranda her zaman görünür olmalıdır (ör: sağ alt köşede floating buton grubu).
- Opsiyonel: Çift dokunma ile zoom toggle (varsayılan zoom ↔ yakınlaştırılmış zoom) desteklenebilir.
- Zoom seviyesi bilgisi (ör: "%150") screen reader'a duyurulmalıdır.

#### 4. Drag-and-drop (sürükle-bırak)

Kullanıcı bir öğeyi basılı tutarak sürükler ve başka bir konuma bırakarak sıralama, taşıma veya gruplama yapar.

**Zorunlu fallback:**
- "Yukarı taşı" / "Aşağı taşı" butonları her item'da görünür olmalıdır. Bu butonlar item seçildiğinde veya item'ın yanında her zaman mevcut olabilir.
- Keyboard kullanıcıları için: Arrow tuşları (↑ / ↓) ile sıralama desteklenmelidir. Sıralama moduna enter/space ile girilmeli, arrow ile hareket edilmeli, enter/space ile onaylanmalı, escape ile iptal edilmelidir.
- Screen reader'da: Grab (tutma) ve drop (bırakma) işlemleri accessibility hint'leri ile duyurulmalıdır. Örneğin: "Sürüklemek için çift dokunun ve basılı tutun" / "Bırakmak için çift dokunun" gibi hint'ler tanımlanmalıdır.
- Sıralama sonrası yeni pozisyon screen reader'a duyurulmalıdır (ör: "Madde 3, 5 maddeden 2. sıraya taşındı").

#### 5. Pull-to-refresh (aşağı çekerek yenileme)

Kullanıcı listenin en üstünde aşağı çekerek içeriği yeniler.

**Zorunlu fallback:**
- "Yenile" butonu toolbar'da veya ekranın üst kısmında her zaman görünür olmalıdır.
- Bu buton pull-to-refresh ile aynı yenileme işlemini tetiklemelidir.
- Yenileme durumu (yükleniyor / tamamlandı) screen reader'a duyurulmalıdır.

#### 6. Swipe-to-navigate (kenardan kaydırarak geri gitme)

Kullanıcı ekranın sol kenarından sağa kaydırarak önceki sayfaya döner (iOS back gesture).

**Zorunlu fallback:**
- Geri butonu (← veya "Geri") her zaman görünür olmalıdır. Navigation bar'da geri butonu hiçbir ekranda kaldırılmamalıdır.
- Web'de: Browser back butonunun çalışması garanti edilmelidir. Keyboard'da Alt+← (veya Backspace) desteği bozulmamalıdır.

### 6.4.4. Screen reader ile gesture etkileşimi

VoiceOver ve TalkBack kendi gesture setini kullanır ve bu gesture'lar uygulamanın özel gesture'larını geçersiz kılar:

- **Tek parmakla sağa/sola kaydırma:** Sonraki/önceki öğeye geçiş (screen reader kontrolü). Uygulamanın swipe-to-delete gesture'ı bu modda çalışmaz.
- **İki parmakla yukarı/aşağı kaydırma:** Scroll. Uygulamanın pull-to-refresh gesture'ı farklı davranabilir.
- **Çift dokunma:** Seçili öğeyi aktive etme (tap yerine).
- **Çift dokunma ve basılı tutma:** Long-press karşılığı.

Bu nedenle uygulama gesture'ları screen reader gesture'larıyla **çakışmamalıdır**. Uygulama gesture'larının screen reader modunda çalışmaması beklenen bir durumdur; önemli olan fallback mekanizmalarının screen reader ile erişilebilir olmasıdır.

### 6.4.5. Test gereksinimleri

Her gesture-based feature aşağıdaki koşullarda test edilmelidir:

1. **Keyboard-only test:** Gesture kaldırıldığında (veya kullanılamadığında) feature'ın tüm işlevselliği klavye ile erişilebilir olmalıdır.
2. **Screen reader test:** VoiceOver (iOS/macOS) ve TalkBack (Android) açıkken tüm gesture-based aksiyonlara alternatif yollarla erişilebilmelidir.
3. **Switch access test:** Switch control açıkken gesture-based feature kullanılabilir olmalıdır.
4. **Fonksiyonel eşitlik testi:** Gesture ile yapılabilen her şey fallback ile de yapılabilmelidir. Fallback'in işlevsel olarak gesture ile birebir aynı sonucu ürettiği doğrulanmalıdır.

### 6.4.6. Hatalı yaklaşımlar

- **"Gesture kullanamayan az kişi var" diyerek fallback vermemek.** Motor engelli kullanıcılar, yaşlı kullanıcılar, switch access ve keyboard kullanıcıları bu grupta yer alır. Sayısal azlık erişilebilirlik yükümlülüğünü ortadan kaldırmaz.
- **Fallback'i yalnızca görsel olarak gizleyip aria ile sunmak.** Motor engelli kullanıcılar (screen reader kullanmayanlar) görsel fallback'lere ihtiyaç duyar. Fallback butonları görsel olarak da erişilebilir olmalıdır; yalnızca screen reader'a özel gizli buton yeterli değildir.
- **Gesture discovery'yi yalnızca onboarding'e bırakmak.** Kullanıcılar onboarding'i atlayabilir, unutabilir veya daha sonra uygulamayı kullanmaya başlayabilir. Gesture'ların keşfedilebilirliği sürekli olmalıdır (ör: tooltip, context hint, visible fallback butonları).
- **Fallback'i farklı bir akışa yönlendirmek.** Swipe ile silme yapan kullanıcı ile butonla silme yapan kullanıcı aynı onay adımlarından geçmeli, aynı sonuca ulaşmalıdır.

---

# 7. Understandable — Anlaşılabilirlik

## 7.1. Tanım

Kullanıcı:
- arayüzün ne istediğini,
- mevcut durumun ne olduğunu,
- hata varsa neden olduğunu,
- bir sonraki adımın ne olduğunu
anlayabilmelidir.

## 7.2. Zorunlu alanlar

- açık label’lar
- net helper text
- anlamlı error mesajları
- tutarlı dil
- predictable navigation
- kararlı state geçişleri
- aşırı teknik olmayan metinler

## 7.3. Zayıf anlaşılabilirlik örnekleri

- “invalid input” benzeri belirsiz hata
- placeholder’ı label yerine kullanmak
- submit sonrası ne olduğunu göstermemek
- destructive eylemi yeterince ayırmamak
- helper ve error metnini aynı yapmak

---

# 8. Robust — Yardımcı Teknolojilerle Çalışabilirlik

## 8.1. Tanım

Arayüz, screen reader ve diğer yardımcı teknolojilerle anlamlı ve bozulmadan çalışabilmelidir.

## 8.2. Zorunlu alanlar

- role / label / hint mantığı
- semantic component kullanımı
- erişilebilir adlandırma
- state ve value bilgisinin aktarılması
- dinamik içeriğin doğru duyurulması
- interactive ve decorative öğelerin ayrıştırılması

## 8.3. Zayıf robust davranışlar

- screen reader’ın anlamsız tekrar okuması
- butonların “button” diye listelenip ne yaptığının belli olmaması
- decorative ikonların anlamlı içerik gibi okunması
- selected/checked/expanded gibi durumların aktarılmaması

---

# 9. Minimum Accessibility Standardı

Bu boilerplate kapsamında minimum standart olarak aşağıdakiler zorunlu kabul edilir:

1. Anlamlı interactive öğelerde erişilebilir isim
2. Yeterli touch target
3. Yeterli contrast
4. Focus görünürlüğü
5. Mantıklı focus order
6. Form alanlarında label ilişkisi
7. Error ve helper metinlerinin erişilebilir bağlantısı
8. Modal/dialog açılış ve kapanışında doğru focus davranışı
9. Dynamic type / text scaling’i kırmayan düzen
10. Reduced motion tercihini dikkate alan motion davranışı
11. Kritik state’lerde yalnızca renge dayanmayan ayrım
12. Keyboard ile kullanılabilir web akışları
13. Screen reader ile anlamlı okunabilirlik
14. Back/dismiss/cancel gibi eylemlerin erişilebilirliği

Bu minimumdur.
İdeal kalite bundan daha yukarı çıkabilir.
Ama bunun altı kabul edilmez.

---

# 10. Touch Target Standardı

## 10.1. Neden kritik?

Özellikle mobile tarafta küçük hedef alan:
- yanlış basma
- hız kaybı
- stres
- erişilebilirlik kaybı
üretir.

## 10.2. Kural

Interactive alanlar ergonomik olarak yeterli hit area taşımalıdır.
Görsel öğe küçük olsa bile etkileşim alanı küçük olmamalıdır.

## 10.3. Uygulama alanları

- icon buttons
- list row trailing actions
- chips
- switches
- checkboxes
- radio controls
- segmented controls
- small links and inline actions

## 10.4. Zayıf örnekler

- yalnızca 16–20 px ikonun kendisine basılabilmesi
- birbirine çok yakın destructive ve secondary action
- küçük text link’leri touch hedefi gibi kullanmak
- dar trailing chevron / edit aksiyonları

---

# 11. Safe Area ve Reachability

## 11.1. Safe area erişilebilirlik konusu mudur?

Evet.
Çünkü kullanıcı etkileşim alanına güvenli ve rahat erişebilmelidir.

## 11.2. Kural

- bottom actions, home indicator veya sistem alanlarına çok yakın olmamalı
- notch / status bar bölgesi metin ve kritik kontrolleri bozmamalı
- scroll + sticky action kombinasyonları erişimi düşürmemeli
- tek elle kullanım ergonomisi gerektiğinde düşünülmeli

## 11.3. Zayıf davranışlar

- alt butonların çok aşağı itilmesi
- header içeriğinin sıkışık olması
- dismiss alanlarının fiziksel olarak zor erişilmesi

---

# 12. Labels, Roles, Values, Hints

## 12.1. Label

Interactive veya anlamlı field’ların ne olduğunu açıklar.

## 12.2. Role

Öğenin ne tür bir şey olduğunu açıklar:
- button
- checkbox
- switch
- link
- heading
- dialog
- tab
- list item
- input

## 12.3. Value / state

Öğe şu anda hangi durumda?
- checked / unchecked
- selected / unselected
- expanded / collapsed
- enabled / disabled
- current value
- progress amount

## 12.4. Hint

Kullanıcının bu öğe ile ne yapabileceğini, gerektiğinde ek bağlam sunar.

## 12.5. Kural

Bu dört alan sistematik düşünülmelidir.
Yalnızca component props seviyesinde tesadüfi bırakılmamalıdır.

## 12.6. Zayıf davranışlar

- label’sız icon button
- checkbox’ın checked durumunu aktarmamak
- collapsible section’da expanded bilgisini taşımamak
- dialog’un dialog gibi duyurulmaması

---

# 13. Decorative vs Meaningful Content Ayrımı

## 13.1. Neden önemli?

Her görünen şey yardımcı teknolojiye okunmamalıdır.
Aksi halde kullanıcı gereksiz gürültü duyar.

## 13.2. Kural

- dekoratif ikonlar, süs çizgileri, purely visual yüzeyler anlamsız içerik gibi sunulmamalı
- anlam taşıyan görsel öğeler metin alternatifi veya erişilebilir adıyla desteklenmeli
- tekrarlayan görsel ögeler screen reader gürültüsü üretmemeli

## 13.3. Zayıf davranışlar

- her icon’un ayrı anlamsız içerik gibi okunması
- dekoratif avatar placeholder’larının gereksiz duyurulması
- tekrarlayan separator / badge / chevron’ların bilgi yükü üretmesi

---

# 14. Contrast Standardı

## 14.1. Contrast neden kritik?

Düşük kontrast:
- metni okunmaz hale getirir
- secondary bilgiyi kaybettirir
- state ayrımını zayıflatır
- kullanıcıyı yorar
- accessibility standardını bozar

## 14.2. Nerelerde düşünülmeli?

- body text
- secondary text
- helper text
- placeholder
- error text
- button label
- focus ring
- border vs background
- selected state
- disabled state
- chip / badge content
- overlay / modal surfaces

## 14.3. Kural

Kontrast yalnızca “ana metin okunuyor” seviyesinde değerlendirilmemeli.
Secondary ve yardımcı içerikler de güvenli okunabilirlik taşımalıdır.

## 14.4. Zayıf contrast örnekleri

- neredeyse görünmeyen helper text
- light mode’da çok açık gri secondary text
- dark mode’da patlayan accent renkleri
- selected ve unselected state’in ayırt edilememesi
- focus ring’in theme içinde kaybolması

---

# 15. Meaning Not by Color Alone

## 15.1. Kural

Önemli durumlar yalnızca renkle anlatılmamalıdır.

## 15.2. Neden?

Renk algısı, kontrast, theme ve görme farklılıkları nedeniyle yalnızca renge güvenmek erişilebilir değildir.

## 15.3. Destekleyici yöntemler

- ikon
- label
- helper/error text
- border/state shape
- emphasis değişimi
- position / grouping

## 15.4. Zayıf davranışlar

- selected state’i sadece hafif mavi yapmak
- error’ı sadece kırmızı çizgi ile anlatmak
- success durumunu sadece yeşil renk olarak sunmak

## 15.5. Renk Körlüğü Uyumluluğu

### 15.5.1. Neden gerekli?

Erkeklerin yaklaşık **%8**'i, kadınların yaklaşık **%0.5**'i bir tür renk körlüğünden etkilenir. Bu, her 12 erkek kullanıcıdan birinin renkleri farklı algıladığı anlamına gelir. Tasarım sistemi yalnızca renk ile bilgi iletiyorsa bu kullanıcılar bilgiyi kaçırır, yanlış yorumlar veya hiç algılayamaz.

Renk körlüğü "nadir bir durum" değildir. Özellikle kırmızı-yeşil renk körlüğü oldukça yaygındır ve tasarım kararlarında doğrudan hesaba katılmalıdır.

### 15.5.2. Renk körlüğü türleri

#### 1. Protanopia (kırmızı körlüğü)
Kırmızı ışığa duyarlı koniler eksik veya işlevsizdir. Kırmızı ve yeşil birbirine benzer görünür. Kırmızı tonlar normalden çok daha koyu algılanır. Kırmızı bir hata mesajı, koyu gri veya siyaha yakın görünebilir; bu da kontrast sorunlarına yol açar.

#### 2. Deuteranopia (yeşil körlüğü)
En yaygın renk körlüğü türüdür. Yeşil ışığa duyarlı koniler eksik veya işlevsizdir. Yeşil ve kırmızı ayırt edilemez. Bir formdaki "başarılı" (yeşil) ve "hatalı" (kırmızı) durumları bu kullanıcılar için aynı renk tonunda görünür.

#### 3. Tritanopia (mavi körlüğü)
Nadir bir türdür. Mavi ışığa duyarlı koniler eksik veya işlevsizdir. Mavi ve sarı ayırt edilemez. Mavi tonlar yeşilimsi, sarı tonlar pembemsi görünebilir.

#### 4. Achromatopsia (tam renk körlüğü)
Çok nadir bir durumdur. Yalnızca gri tonları görülür, hiçbir renk algılanmaz. Bu kullanıcılar için kontrast oranı ve desen/şekil ile bilgi iletimi kritik önem taşır.

### 15.5.3. Kural

Renk **ASLA** bilgiyi iletmenin **TEK** yolu olmamalıdır. Her renk kodlu bilgi, en az bir ek görsel ipucu ile desteklenmelidir. Bu ek ipucu; ikon, metin, desen veya şekil olabilir.

### 15.5.4. Renk kodlu bilgilerde zorunlu destekleyici öğeler

#### Error (kırmızı) durumu
- **Doğru:** Kırmızı border + ✗ ikonu + "Hatalı" veya spesifik hata metni. Üç katman birlikte çalışır.
- **Yanlış:** Yalnızca kırmızı border. Renk körlüğü olan kullanıcı border rengindeki değişimi fark etmeyebilir.

#### Success (yeşil) durumu
- **Doğru:** Yeşil arka plan veya border + ✓ ikonu + "Başarılı" metni.
- **Yanlış:** Yalnızca yeşil renk ile başarı durumunu anlatmak.

#### Warning (sarı/turuncu) durumu
- **Doğru:** ⚠ ikonu + uyarı metni + sarı/turuncu vurgu.
- **Yanlış:** Yalnızca sarı arka plan veya turuncu border.

#### Info (mavi) durumu
- **Doğru:** ℹ ikonu + bilgilendirme metni + mavi vurgu.
- **Yanlış:** Yalnızca mavi arka plan ile bilgi iletmeye çalışmak.

#### Grafik ve chart'lar
- **Doğru:** Her veri serisi renk + desen (çizgi, nokta, çapraz, diyagonal çizgi) kombinasyonu ile gösterilir. Legend'da da aynı desen kullanılır.
- **Yanlış:** Yalnızca renkle ayrılan veri serileri. Kırmızı ve yeşil çizgiler deuteranopia olan kullanıcı için ayırt edilemez. Bu yaklaşım **YASAKTIR**.

#### Form validation
- **Doğru:** Hatalı alanın kırmızı border'ı + ✗ ikonu + hata mesajı metni. Üçü birlikte.
- **Yanlış:** Yalnızca input border rengini kırmızıya çevirmek. Renk körlüğü olan kullanıcı hangi alanın hatalı olduğunu anlamayabilir.

#### Status badge'leri
- **Doğru:** "Aktif" metni + yeşil nokta. "Pasif" metni + gri nokta. Metin, renk noktasından bağımsız olarak durumu açıkça ifade eder.
- **Yanlış:** Yalnızca yeşil ve kırmızı nokta ile "aktif" ve "pasif" durumunu göstermek. Metin olmadan bu noktalar renk körlüğü olan kullanıcı için aynı görünebilir.

### 15.5.5. Simülasyon testi

#### Tasarım aşamasında (Figma)
Renk körlüğü simülasyon plugin'leri kullanılmalıdır:
- **Stark:** En kapsamlı erişilebilirlik plugin'i. Tüm renk körlüğü türlerini simüle eder.
- **Color Blind:** Figma'da yaygın kullanılan simülasyon plugin'i.

Her yeni tasarım ekranı Figma'da teslim edilmeden önce en az **protanopia** ve **deuteranopia** simülasyonundan geçirilmelidir. Bu iki tür en yaygın renk körlüğü türleridir ve tasarımın bu iki filtreden geçmesi büyük çoğunluğu kapsar.

#### Development aşamasında
- **Chrome DevTools:** Rendering paneli → "Emulate vision deficiencies" seçeneği ile doğrudan tarayıcıda simülasyon yapılabilir. Seçenekler: Protanopia, Deuteranopia, Tritanopia, Achromatopsia.
- Her yeni ekran veya component, development tamamlandıktan sonra en az protanopia ve deuteranopia simülasyonundan geçirilmelidir.
- Simülasyon sonrası tüm bilgi katmanları (ikon, metin, desen) hâlâ ayırt edilebilir olmalıdır.

### 15.5.6. Contrast oranı ve renk körlüğü ilişkisi

WCAG AA minimum contrast oranları:
- **Normal metin (14px ve altı):** 4.5:1
- **Büyük metin (18px veya 14px bold ve üstü):** 3:1
- **UI bileşenleri ve grafiksel öğeler:** 3:1

Bu oranlar renk körlüğü simülasyonundan **SONRA** da korunmalıdır. Yani simülasyon uygulandığında da metin ve arka plan arasındaki kontrast oranı minimum değerlerin altına düşmemelidir. Simülasyon öncesi yeterli olan ama simülasyon sonrası yetersiz kalan kontrastlar düzeltilmelidir.

### 15.5.7. Hatalı yaklaşımlar

- **"Accessibility mode'da farklı renkler gösterelim."** Hayır. Varsayılan tasarım herkes için çalışmalıdır. Özel bir "erişilebilirlik modu" oluşturmak, erişilebilirliği ayrıştırılmış bir ek özellik gibi ele almaktır. Bu projede erişilebilirlik varsayılan kalite standardıdır.
- **Kırmızı-yeşil dikotomisi (trafik ışığı mantığı) ile tek başına bilgi taşımak.** Kırmızı = kötü, yeşil = iyi mantığı renk körlüğü olan kullanıcılar için çalışmaz. Bu renk çifti her zaman ikon ve metin ile desteklenmelidir.
- **Yalnızca renk palette'ini değiştirerek sorunu çözdüğünü sanmak.** Renk körlüğüne uyumlu renkler seçmek iyi bir başlangıçtır ama yeterli değildir. Renk her zaman ek bir ipucu ile desteklenmelidir çünkü algı kişiden kişiye farklılık gösterir.
- **Simülasyon testini yalnızca son aşamada yapmak.** Renk körlüğü uyumluluğu tasarım aşamasından itibaren düşünülmelidir. Son aşamada tespit edilen sorunlar büyük tasarım değişiklikleri gerektirebilir.

---

# 16. Typography ve Readability

## 16.1. Kural

Erişilebilir tipografi:
- yeterli boyut
- yeterli satır aralığı
- yeterli kontrast
- anlamlı hiyerarşi
- text scaling toleransı
ile çalışmalıdır.

## 16.2. Düşünülmesi gereken alanlar

- body text çok küçük olmamalı
- helper / metadata text görünmez olmamalı
- başlıklar hiyerarşik ama okunabilir olmalı
- sıkışık line-height kullanılmamalı
- uzun metin blokları taranabilir olmalı

## 16.3. Zayıf davranışlar

- küçücük caption’lar
- ışıltılı ama okunmayan typography
- dar satır aralıkları
- tamamen font weight ile anlam kurup kontrastı unutmak

---

# 17. Dynamic Type / Text Scaling

## 17.1. Neden önemlidir?

Kullanıcılar daha büyük yazı tercih edebilir.
Arayüz bu tercih yüzünden kırılmamalıdır.

## 17.2. Kural

- metin büyüdüğünde container patlamamalı
- kritik içerik kesilmemeli
- button/input/metin kombinasyonları ölçeklenebilir olmalı
- form alanları ve listeler bu büyümeyi tolere etmelidir
- sabit yükseklikler dikkatle kullanılmalıdır

## 17.3. Zayıf davranışlar

- text büyüyünce label’ın taşması
- buton metninin kırpılması
- form hatalarının görünmez olması
- card içeriğinin üst üste binmesi

---

# 18. Focus Order Standardı

## 18.1. Tanım

Focus order, kullanıcı klavye veya yardımcı teknoloji ile ilerlediğinde arayüz öğelerinin hangi sırayla ulaşıldığını belirler.

## 18.2. Kural

- Sıra mantıklı olmalı
- Görsel ve görev mantığıyla uyumlu olmalı
- Gizli/kapalı öğeler gereksiz focus almamalı
- Modal açıldığında focus içeride kalmalı
- Modal kapanınca focus anlamlı yere dönmeli

## 18.3. Zayıf focus order örnekleri

- headerdan sonra rastgele footer’a atlamak
- modal arkasındaki içeriğin focus alması
- görünmez öğelerin tab sırasına girmesi
- form alanlarının görsel sıradan farklı ilerlemesi

---

# 19. Focus Visibility Standardı

## 19.1. Kural

Focus görünür olmalıdır.
Sadece tarayıcı varsayılanı ya da sıfırlanmış outline ile bırakılmamalıdır.

## 19.2. Beklentiler

- focus state hover’dan ayrışmalı
- selected state ile karışmamalı
- dark/light theme’de kaybolmamalı
- border olan ve olmayan komponentlerde görünür olmalı

## 19.3. Zayıf davranışlar

- outline kaldırıp yerine hiçbir şey koymamak
- focus only on keyboard gibi mantıkları yanlış kurup görünürlüğü kırmak
- focus state’in sadece hafif gölge ile geçiştirilmesi

---

# 20. Keyboard Accessibility

## 20.1. Özellikle web için zorunlu

Klavye ile:
- ana navigasyon
- form tamamlama
- dialog kapatma
- list / tab / segmented control kullanımı
- seçilebilir içerik hareketi
mümkün olmalıdır.

## 20.2. Mobile için de dolaylı önemlidir

Harici klavye, switch control ve assistive tech senaryoları vardır.

## 20.3. Zayıf davranışlar

- mouse olmadan ilerlenemeyen ekran
- tab order kaosu
- enter/escape davranışlarının anlamsızlığı
- klavye ile odaklanıp işlem yapılamayan buton benzeri yüzeyler

## 20.4. Skip-to-Content Link Standardı

### 20.4.1. Nedir?

Skip-to-content link, web sayfasının en üstünde yer alan, normalde görünmez ama keyboard focus aldığında ekranda beliren bir bağlantıdır. Tıklandığında (veya Enter ile aktive edildiğinde) kullanıcıyı navigation, header, sidebar gibi tekrarlayan bölümleri atlayarak doğrudan ana içerik alanına götürür.

Bu bağlantı, sayfanın DOM sırasında ilk interactive öğe olmalıdır. Kullanıcı Tab tuşuna bastığında focus'un gittiği ilk öğe bu link olmalıdır.

### 20.4.2. Neden gerekli?

Keyboard ile gezinen veya screen reader kullanan kullanıcılar, her sayfa yüklemesinde (veya her route değişiminde) navigation linklerinin tamamını Tab tuşu ile tek tek geçmek zorunda kalır. Tipik bir web uygulamasında navigation bar'da 15-20 veya daha fazla link bulunabilir. Her sayfada bu linkleri tekrar tekrar geçmek:

- **Zaman kaybı yaratır:** Kullanıcı ana içeriğe ulaşmak için onlarca Tab basmalıdır.
- **Yorucu ve sinir bozucudur:** Özellikle sık sayfa geçişi olan akışlarda sürekli aynı navigation linklerini geçmek kullanıcı deneyimini ciddi şekilde bozar.
- **Screen reader kullanıcıları için gürültü üretir:** Her link okunur, kullanıcı anlamlı içeriğe ulaşmadan önce çok sayıda tekrarlayan duyuru dinlemek zorunda kalır.

Skip-to-content link bu sorunu tek bir tıklama/tuşla çözer. Kullanıcı Tab → Enter ile doğrudan ana içeriğe atlar.

### 20.4.3. Uygulama

#### 1. HTML yapısı

Skip link, `<body>` etiketi açılır açılmaz, tüm diğer içeriklerden **ÖNCE** yerleştirilmelidir:

```html
<body>
  <a href="#main-content" class="skip-link">Ana içeriğe atla</a>
  <header>...</header>
  <nav>...</nav>
  <main id="main-content" tabindex="-1">
    <!-- Ana içerik burada -->
  </main>
  <footer>...</footer>
</body>
```

#### 2. Ana içerik alanı

Ana içerik alanı, skip link'in hedef aldığı element'tir:

```html
<main id="main-content" tabindex="-1">
  ...
</main>
```

`tabindex="-1"` özelliği kritik öneme sahiptir. Bu attribute olmadan bazı tarayıcılarda focus programmatik olarak bu element'e taşınamaz. `tabindex="-1"` element'in Tab sıralamasına girmeden (kullanıcı Tab ile ulaşamadan) programmatik olarak focus alabilmesini sağlar.

#### 3. CSS stilleri

Skip link varsayılan olarak ekran dışında konumlandırılır ve yalnızca focus aldığında görünür hale gelir:

```css
.skip-link {
  /* Varsayılan: ekran dışında */
  position: absolute;
  left: -10000px;
  top: auto;
  width: 1px;
  height: 1px;
  overflow: hidden;

  /* Focus aldığında: ekranda görünür */
  &:focus {
    position: fixed;
    top: 8px;
    left: 8px;
    width: auto;
    height: auto;
    overflow: visible;

    /* Görsel stil */
    background-color: var(--color-primary);
    color: #ffffff;
    padding: 8px 16px;
    border-radius: 4px;
    font-size: 14px; /* veya 16px */
    font-weight: 600;
    text-decoration: none;
    z-index: var(--z-index-toast); /* En üst katmanda görünmeli */
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  }
}
```

#### 4. Görsel stil kuralları

Skip link focus aldığında görsel olarak belirgin, okunabilir ve fark edilir olmalıdır:

- **Arka plan:** Primary renk (tema rengi). Sayfa içeriğinden açıkça ayrışmalı.
- **Metin rengi:** Beyaz veya arka planla yeterli kontrast sağlayan renk (minimum 4.5:1).
- **Padding:** 8px 16px (tıklanabilir alan yeterli olmalı).
- **Border-radius:** 4px (tasarım sistemine uygun).
- **Font-size:** 14-16px arası. Okunabilir olmalı.
- **z-index:** layer-toast seviyesinde veya daha yüksek. Sayfadaki tüm içeriğin üstünde görünmelidir.
- **Konum:** Sol üst köşe (top: 8px, left: 8px). Kullanıcının hemen fark edeceği bir alan.

### 20.4.4. Birden fazla skip link

Çok bölümlü veya karmaşık yapıya sahip sayfalarda birden fazla skip link sunulabilir:

- "Ana içeriğe atla" — `<main>` bölümüne atlar
- "Yan menüye atla" — sidebar/aside bölümüne atlar
- "Footer'a atla" — `<footer>` bölümüne atlar
- "Arama alanına atla" — search input'una atlar

Birden fazla skip link sunulduğunda bunlar bir skip link grubunda sıralı olarak listelenmeli ve Tab ile aralarında geçiş yapılabilmelidir.

**Minimum gereksinim:** En az bir adet skip link (ana içerik) **ZORUNLUDUR**. Ek skip link'ler opsiyoneldir ama karmaşık sayfalarda şiddetle tavsiye edilir.

### 20.4.5. Mobile

#### Mobile web
Skip link mobile web'de aynı şekilde çalışır. VoiceOver (iOS Safari) ve TalkBack (Android Chrome) kullanıcıları focus sırasıyla ilerlediğinde skip link ilk öğe olarak karşılarına çıkar ve aktivasyon ile ana içeriğe atlarlar.

#### Native app (React Native)
React Native'de skip link kavramı doğrudan yoktur çünkü web'deki gibi bir URL fragment (#main-content) mekanizması bulunmaz. Bunun yerine:

- **Accessibility grouping:** İlgili öğeler `accessibilityElementsHidden` veya `importantForAccessibility` ile gruplanarak gereksiz öğelerin screen reader tarafından atlanması sağlanır.
- **Traversal order:** `accessibilityViewIsModal` (iOS) veya custom `accessibilityOrder` ile screen reader'ın öğeleri hangi sırayla okuduğu kontrol edilir.
- **Focus yönetimi:** Sayfa açıldığında `AccessibilityInfo.setAccessibilityFocus()` ile focus'un doğrudan ana içerik alanına taşınması sağlanabilir.

### 20.4.6. Test gereksinimleri

1. **İlk focus testi:** Sayfa yüklendikten sonra Tab tuşuna basıldığında focus'un gittiği ilk öğe skip link olmalıdır. Başka herhangi bir öğeye (navigation link, logo vb.) gidiyorsa skip link DOM'da yeterince üstte değildir.
2. **Aktivasyon testi:** Skip link'e focus geldikten sonra Enter tuşuna basıldığında focus doğrudan ana içerik alanına (`#main-content`) atlamalıdır. Tab ile devam edildiğinde focus ana içerik alanındaki ilk interactive öğeye gitmelidir.
3. **Görünürlük testi:** Skip link'e focus geldiğinde ekranda görünür olmalı ve okunabilir olmalıdır. Focus kaybedildiğinde tekrar görünmez olmalıdır.
4. **Screen reader testi:** VoiceOver/NVDA/TalkBack ile skip link'in duyurulduğu ve aktivasyon sonrası ana içerik alanının duyurulduğu doğrulanmalıdır.
5. **Her sayfada test:** Skip link yalnızca ana sayfada değil, uygulamanın tüm sayfalarında çalışmalıdır.

### 20.4.7. Hatalı yaklaşımlar

- **Skip link'i tamamen kaldırmak veya hiç eklememek.** Keyboard ve screen reader kullanıcıları için temel bir erişilebilirlik gereksinimidir. WCAG 2.1 Success Criterion 2.4.1 (Bypass Blocks) bunu zorunlu kılar.
- **`display: none` ile gizlemek.** `display: none` uygulanan öğeler hem görsel olarak hem de screen reader tarafından gizlenir. Skip link screen reader kullanıcıları için de erişilebilir olmalıdır. Bunun yerine yukarıda belirtilen "ekran dışı konumlandırma" tekniği kullanılmalıdır.
- **`visibility: hidden` ile gizlemek.** `display: none` ile aynı sorunu yaratır. Screen reader'lar bu öğeyi okuyamaz.
- **Focus aldığında görünmesini sağlamamak.** Skip link gizli olarak bırakılıp focus state'inde görünür yapılmazsa, keyboard kullanıcıları (screen reader kullanmayan) link'in varlığından haberdar olamaz. Focus state'inde mutlaka görünür olmalıdır.
- **Hedef element'te `tabindex="-1"` olmaması.** `tabindex` olmadan bazı tarayıcılarda focus programmatik olarak element'e taşınamaz. Skip link tıklanır ama focus atlamaz, kullanıcı aynı yerde kalır.
- **Skip link'in çalıştığını ancak yönlendirdiği hedefin boş veya anlamsız olması.** `#main-content` id'si olmayan veya yanlış element'e atayan bir skip link işlevini yerine getirmez.
- **Skip link metninin belirsiz olması.** "Atla" veya "Skip" gibi belirsiz metinler yerine "Ana içeriğe atla" gibi açık ve anlaşılır metin kullanılmalıdır.

---

# 21. Screen Reader Standardı

## 21.1. Genel ilke

Screen reader kullanıcıları ekranı görsel olarak değil, anlamsal yapı olarak deneyimler.
Bu yüzden görsel düzenin taşıdığı anlam semantik olarak da verilmelidir.

## 21.2. Düşünülmesi gereken alanlar

- heading hiyerarşisi
- list semantics
- button/link ayrımı
- selected/checked state
- dialog/sheet duyurusu
- form field ilişkileri
- error duyurusu
- dynamic content update
- progress ve status duyuruları

## 21.3. Zayıf davranışlar

- heading gibi görünen ama heading olmayan yapılar
- button gibi duran ama semantik olmayan yüzeyler
- screen reader’da bağlamsız “more”, “edit”, “open” tekrarları
- açılan modalın duyurulmaması

---

# 22. Headings ve Yapısal Semantik

## 22.1. Neden önemli?

Kullanıcı sadece tek tek öğeleri değil, ekran yapısını da anlamalıdır.

## 22.2. Kural

- ekran başlıkları anlamsal olarak güçlü olmalı
- section başlıkları hiyerarşik düzeni desteklemeli
- heading görünümü semantik heading’den kopmamalı
- listeler, gruplar ve bölümler anlamsal düzende ele alınmalı

## 22.3. Zayıf davranışlar

- sadece büyük metin yazarak heading sanmak
- her şeyi paragraph gibi sunmak
- section’ların anlamsal yapısını tamamen kaybetmek

---

# 23. Forms için Accessibility Kuralları

## 23.1. Zorunlu başlıklar

Her anlamlı field için düşünülmeli:
- label
- helper text
- error relation
- required/optional bilgisi
- current value/state
- focus davranışı
- keyboard davranışı
- announcement

## 23.2. Error handling

- alan hatası kullanıcıya bağlamsal olarak duyurulmalı
- submit sonrası ilk hata alanına yönlendirme gerektiğinde düşünülmeli
- form-level hata ile alan hatası karıştırılmamalı

## 23.3. Zayıf davranışlar

- yalnızca renk ile hata göstermek
- helper text ile error text’i aynı yerde karışık göstermek
- required bilgisini gizlemek
- otomatik focus sıçramalarıyla kullanıcıyı kaybettirmek

---

# 24. Lists, Tables ve Collection Patterns

## 24.1. Listeler

- her item’in ne olduğu anlaşılmalı
- interactive list row’lar button/link semantics taşımalı
- trailing aksiyonlar ayrı ve erişilebilir olmalı
- seçili durum varsa duyurulmalı

## 24.2. Tables / dense data surfaces

Web tarafında özellikle:
- satır/sütun anlamı görünür olmalı
- yoğun veri keyboard ile erişilebilir olmalı
- filtre/sıralama kontrolleri erişilebilir olmalı
- responsive kırılımlarda bilgi kaybolmamalı

## 24.3. Zayıf davranışlar

- tüm satırı tıklanabilir yapıp aksiyonları ayırt etmemek
- row içindeki butonların label’sız olması
- sıralama ve filtre durumunun duyurulmaması

---

# 25. Modal, Dialog, Sheet ve Overlay Accessibility

## 25.1. Açılış

- yeni bağlam duyurulmalı
- focus uygun giriş noktasına gitmeli
- arka plan etkileşimi kapatılmalı (gerektiği yerde)

## 25.2. Açıkken

- focus içeride kalmalı
- dismiss yolu açık olmalı
- başlık/amaç anlaşılır olmalı

## 25.3. Kapanış

- focus mantıklı yere dönmeli
- kullanıcı bağlamını kaybetmemeli

## 25.4. Zayıf davranışlar

- dialog açık ama arkadaki içerik focus alıyor
- close butonu görünür ama label’sız
- dismiss sonrası focus kayboluyor
- bottom sheet açılıyor ama screen reader bağlam değişimini anlamıyor

---

# 26. Navigation Accessibility

## 26.1. Kural

Navigation yapısı yalnızca görsel değil, erişilebilir yapı olarak da anlamlı olmalıdır.

## 26.2. Düşünülmesi gereken alanlar

- current page/section indicator
- back / close / cancel ayrımı
- tab navigation semantics
- route değişim duyuruları
- odak geçişleri
- skip/quick access mekanizmaları (gerektiği yerde)

## 26.3. Zayıf davranışlar

- kullanıcı hangi sekmede olduğunu anlayamıyor
- back ve close aynı görünüyor ama farklı davranıyor
- navigation landmark’ları anlamsız
- route değişince odak ve başlık ilişkisi kayboluyor

---

# 27. Feedback States Accessibility

## 27.1. Loading

- loading nedeni ve kapsamı anlaşılır olmalı
- sürekli değişen anlamsız spinner gürültüsü olmamalı
- sessiz revalidation ile bloklayıcı yükleme ayrılmalı

## 27.2. Error

- hata açık olmalı
- kullanıcıya ne yapabileceği söylenmeli
- kritik hata ve küçük alan hatası aynı gibi sunulmamalı

## 27.3. Success

- başarı duyurusu anlamlı olmalı
- aşırı hareketli veya aşırı kısa olmamalı
- sadece renk ile verilmemeli

## 27.4. Empty

- gerçekten boş mu, hata mı, filtre sonucu mu, yeni kullanıcı durumu mu ayrışmalı

---

# 28. Motion ve Reduced Motion

## 28.1. Kural

Hareket, anlam taşıyorsa kullanılmalıdır.
Ama kullanıcı reduced motion tercih ediyorsa sistem bunu ciddiye almalıdır.

## 28.2. Reduced motion’da ne beklenir?

- gereksiz geçişler azaltılmalı
- büyük hareketler yerine sade geçişler kullanılmalı
- orientation kaybı yaratacak animasyonlar yumuşatılmalı

## 28.3. Zayıf davranışlar

- motion tercihine rağmen aynı animasyonları sürdürmek
- navigation transition’larını çok agresif yapmak
- başarılı state’i sadece hareketle anlatmak

---

# 29. Time Limits, Auto-Advance ve Ephemeral UI

## 29.1. Neden önemli?

Kullanıcı bazı bilgileri işlemeye zaman bulamayabilir.
Özellikle:
- auto-dismiss toast
- auto-advance OTP
- geçici banner
- kısa ömürlü feedback
erişilebilirlik sorunu yaratabilir.

## 29.2. Kural

- kritik bilgi çok hızlı kaybolmamalı
- kullanıcı müdahalesi olmadan ilerleyen davranışlar kontrollü olmalı
- ephemeral UI tek bilgi kanalı olmamalı

---

# 30. Error Prevention ve Recovery

## 30.1. Erişilebilirlik yalnızca hatayı göstermek değildir

Hata yapmayı azaltmak ve hatadan çıkışı kolaylaştırmak da erişilebilirliktir.

## 30.2. Güçlü yaklaşımlar

- mantıklı defaults
- açık form açıklamaları
- destructive action confirmation
- geri alma imkanı
- bağlamsal helper metin
- format mask / guidance
- validation timing disiplini

## 30.3. Zayıf davranışlar

- kullanıcıyı hata yapmaya iten belirsiz arayüz
- geri dönüşsüz destructive action
- tek seferde çok fazla ceza veren formlar

---

# 31. Bilişsel Yük ve İçerik Açıklığı

## 31.1. Neden accessibility konusu?

Çünkü erişilebilirlik sadece fiziksel veya teknik yardım konusu değildir.
Anlaşılabilirlik ve bilişsel yük de bunun parçasıdır.

## 31.2. Kurallar

- gereksiz jargon kullanılmamalı
- çok yoğun ekranlarda görev önceliği net olmalı
- çok fazla eşit vurgu olmamalı
- kullanıcıyı aynı anda çok fazla seçenekle boğmamak gerekir
- kritik akışlarda açık mikro metin kullanılmalı

## 31.3. Zayıf davranışlar

- belirsiz başlıklar
- aşırı yoğun ayar ekranları
- aynı görünürlükte onlarca aksiyon
- neyin önemli olduğunu anlatmayan bilgi duvarları

---

# 32. Component Contract İçindeki Accessibility

## 32.1. Kural

Bir component erişilebilirlikten bağımsız tanımlanmış sayılmaz.
Her ciddi component contract’ında en az şu alanlar düşünülmelidir:

- accessible role
- accessible name
- state exposure
- focus behavior
- keyboard/touch behavior
- disabled/readonly/loading semantics
- contrast/focus visibility
- touch target minimumu

## 32.2. Zayıf yaklaşım

- a11y’yi ekran implementasyonuna bırakmak
- component library güzel ama erişilebilir davranışları eksik
- aynı component’in farklı ekranlarda farklı a11y kalitesi taşıması

---

# 33. Testing ve Audit Yaklaşımı

## 33.1. Accessibility nasıl doğrulanır?

En az şu seviyelerde düşünülmelidir:

- static lint / rule checks
- component-level checks
- interaction tests
- manual audit
- screen reader spot checks
- keyboard flow checks
- contrast review
- reduced motion review

## 33.2. Kural

A11y yalnızca manuel test listesi olarak bırakılmamalıdır.
Mümkün olan yerlerde otomatik denetim kurulmalıdır.

## 33.3. Manuel audit gerektiren alanlar

- gerçek okunabilirlik
- premium his ile a11y dengesi
- complex modal/sheet focus davranışı
- form error recovery hissi
- yoğun veri yüzeylerinin gerçek kullanılabilirliği

---

# 34. Enforcement Yaklaşımı

## 34.1. Enforce edilebilecek alanlar

- missing labels
- forbidden unlabeled icon button patterns
- hardcoded tiny text
- missing accessibility props
- touch target rule hints
- reduced motion considerations (kısmen)
- contrast audit integration (kısmen)

## 34.2. Enforce edilemeyecek ama audit gerektiren alanlar

- bilişsel yük
- mikro metin kalitesi
- gerçek görev anlaşılabilirliği
- odak akışının kullanıcı hissi
- bilgi yoğunluğu dengesi

## 34.3. Kural

Otomatik kontrol mümkün değil diye alanı serbest bırakmak kabul edilmez.
Denetim yöntemi otomatik değilse manuel checklist gerekir.

---

# 35. Accessibility Anti-Pattern Listesi

Aşağıdaki davranışlar bu proje kapsamında zayıf kabul edilir:

1. Label’sız interactive öğe
2. Touch target’ı küçük bırakmak
3. Focus görünürlüğünü kaldırmak
4. Hata durumunu yalnızca renkle anlatmak
5. Modal açılışında focus yönetmemek
6. Keyboard ile kullanılamayan web yüzeyi
7. Screen reader için anlamsız ya da fazla gürültülü içerik
8. Placeholder’ı label yerine kullanmak
9. Helper/error metin ilişkisini bozuk bırakmak
10. Dynamic type altında kırılan layout
11. Reduced motion tercihini görmezden gelmek
12. Decorative ögeleri meaningful içerik gibi okutmak
13. Selected / checked / expanded state’leri duyurmamak
14. Route değişimlerinde bağlam hissini kaybettirmek
15. Accessibility’yi “sonra düzeltiriz” alanı gibi görmek

---

# 36. Accessibility Kararı Verirken Sorulacak Sorular

Bir ekran, component veya flow değerlendirilirken şu sorular sorulmalıdır:

1. Kullanıcı bunu görebiliyor mu?
2. Kullanıcı bunu anlayabiliyor mu?
3. Kullanıcı buna güvenle dokunabiliyor/tıklayabiliyor mu?
4. Kullanıcı klavye veya yardımcı teknoloji ile buna ulaşabiliyor mu?
5. Role/label/state bilgisi açık mı?
6. Focus sırası mantıklı mı?
7. Hata olursa kullanıcı neyi düzelteceğini anlayacak mı?
8. Motion kullanıcıyı rahatsız eder mi?
9. Text büyürse layout bozulur mu?
10. Buradaki anlam yalnızca renge mi dayanıyor?
11. Modal/dialog ise açılış ve kapanış erişilebilir mi?
12. Bu yapı gerçekten kapsayıcı mı, yoksa yalnızca görsel olarak hoş mu?

---

# 37. Sonraki Dokümanlara Etkisi

## 37.1. Performance standard
`13-performance-standard.md`, accessibility’yi performans bahanesiyle kırmayan yaklaşımı tanımlamalıdır.

## 37.2. Testing strategy
`14-testing-strategy.md`, component, flow, keyboard ve a11y audit seviyelerini bu belgeye göre sınıflandırmalıdır.

## 37.3. Quality gates and governance
`15-quality-gates-and-ci-rules.md` ve `16-tooling-and-governance.md`, erişilebilirlik kurallarının hangi bölümünün lint/test/audit ile korunacağını detaylandırmalıdır.

## 37.4. Component governance rules
`23-component-governance-rules.md`, component contract’ları içine bu belgedeki erişilebilirlik zorunluluklarını gömmelidir.

## 37.5. Motion and interaction standard
`24-motion-and-interaction-standard.md`, reduced motion ve feedback motion davranışlarını bu belgeyle uyumlu açmalıdır.

---

# 38. Onay Kriterleri

Bu doküman yeterli kabul edilir eğer:

1. Accessibility konusu yalnızca etiket düzeyine indirgenmemişse,
2. Perceivable / Operable / Understandable / Robust boyutları pratik ürün kurallarına çevrilmişse,
3. Touch target, labels, contrast, focus, keyboard, screen reader ve dynamic type alanları net tanımlanmışsa,
4. Form, modal, navigation ve feedback state’lerle ilişki kurulmuşsa,
5. Otomatik ve manuel denetim alanları ayrılmışsa,
6. Accessibility ihlalleri açık anti-pattern listesiyle görünür kılınmışsa,
7. Sonraki test, governance ve component dokümanlarına uygulanabilir temel sağlanmışsa.

---

# 39. Kısa Sonuç

Bu dokümanın ana çıktısı şudur:

> Bu boilerplate kapsamında accessibility, sonradan eklenen teknik süs değil; ürünün algılanabilir, kullanılabilir, anlaşılabilir ve yardımcı teknolojilerle uyumlu olmasını sağlayan zorunlu kalite standardıdır.

Bu nedenle bundan sonraki hiçbir doküman:
- erişilebilirliği yalnızca label ekleme işi gibi ele alamaz,
- touch target, contrast, focus ve keyboard davranışını ikincil göremez,
- modal, form ve navigation kararlarını a11y’den bağımsız tasarlayamaz,
- reduced motion ve dynamic type etkilerini yok sayamaz,
- erişilebilirlik denetimi olmadan kalite iddiasında bulunamaz.
