# 13-performance-standard.md

## Doküman Kimliği

- **Doküman adı:** Performance Standard
- **Dosya adı:** `13-performance-standard.md`
- **Doküman türü:** Standard / quality baseline / performance governance document
- **Durum:** Accepted
- **Kapsam:** Bu boilerplate kapsamında performansın ne anlama geldiğini, hangi performans türlerinin kritik olduğunu, UI, state, data, navigation, rendering, assets, listeler, animation ve runtime davranışlarının performans açısından nasıl değerlendirilmesi gerektiğini tanımlar.
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
  - `12-accessibility-standard.md`
- **Doğrudan etkileyeceği dokümanlar:**
  - `14-testing-strategy.md`
  - `15-quality-gates-and-ci-rules.md`
  - `16-tooling-and-governance.md`
  - `17-technology-decision-framework.md`
  - `21-repo-structure-spec.md`
  - `24-motion-and-interaction-standard.md`
  - `28-observability-and-debugging.md`
  - `31-audit-checklist.md`
  - `32-definition-of-done.md`

---

# 1. Amaç

Bu dokümanın amacı, boilerplate kapsamında performansı “uygulama hızlı olsun” gibi yüzeysel ve denetlenemez bir niyet cümlesinden çıkarıp, ürün davranışı, kullanıcı hissi, mimari kararlar ve kalite kapıları ile bağlantılı somut bir standart haline getirmektir.

Bu belge şu sorulara net cevap verir:

1. Performans bu projede ne demektir?
2. Performans yalnızca benchmark ve FPS konusu mudur?
3. Cold start, route transition, scroll akıcılığı, input gecikmesi, loading davranışı ve perceived performance nasıl birlikte düşünülmelidir?
4. State yapısı, data fetching, UI composition, list rendering, image yönetimi ve motion kararları performansı nasıl etkiler?
5. Hangi performans problemleri daha en baştan mimari ve design system seviyesinde önlenmelidir?
6. Hangi alanlar ölçülmeli, hangileri audit edilmeli?
7. Hangi performans davranışları doğrudan zayıf kabul edilir?

Bu belge teknoloji seçmez.
Ama performans iddiası olan her teknoloji, araç ve mimari karar bu belgeyle uyumlu olmak zorundadır.

---

# 2. Neden Bu Doküman Gerekli

Performans çoğu projede ya çok geç düşünülür ya da yanlış düşünülür.

En sık yapılan hatalar şunlardır:

- performansı yalnızca production sonu optimizasyon işi sanmak,
- gerçek kullanıcı hissi yerine sentetik skorlarla konuşmak,
- her problemi memoization ile çözeceğini zannetmek,
- state ve render sınırlarını baştan planlamamak,
- liste, asset ve navigation maliyetini küçümsemek,
- loading davranışını performans dışında görmek,
- ağ gecikmesini yalnızca backend problemi saymak,
- küçük cihazları veya düşük ağ koşullarını hesaba katmamak.

Bunların sonucu olarak şu problemler doğar:

- uygulama açılışı ağır hissedilir,
- ekran geçişleri “takılıyor” duygusu verir,
- uzun listeler jank üretir,
- form input’ları gecikmeli hissettirir,
- theme veya state değişimlerinde gereksiz render patlaması olur,
- gereksiz refetch ve cache yanlışları yüzünden kullanıcı boş bekler,
- motion ve animation kalite yerine sürtünme üretir,
- görsel kalite korunurken runtime kalite bozulur.

Bu proje kapsamında performans, sonradan kapatılacak teknik borç alanı değildir.
Başlangıçtan itibaren tasarım, mimari, state ve data kararlarının içine gömülmelidir.

---

# 3. Temel Tez

Bu proje kapsamında temel tez şudur:

> Performans, yalnızca hızlı çalışan kod değil; kullanıcının uygulamayı akıcı, kararlı, gecikmesiz, güven veren ve görev tamamlamayı zorlaştırmayan bir sistem olarak deneyimlemesini sağlayan bütünsel kalite alanıdır.

Bu tez şu sonuçları doğurur:

1. Perceived performance, gerçek runtime performans kadar önemlidir.
2. Performans UI, state, data, navigation ve asset kararlarının toplamıdır.
3. Gereksiz complexity performans düşmanıdır.
4. Her optimizasyon doğru optimizasyon değildir; yanlış yerde yapılan mikro optimizasyon mimari problemi gizleyebilir.
5. Ölçülmeyen ve denetlenmeyen performans iddiası zayıftır.

---

# 4. Performansın Bu Projedeki Boyutları

Bu boilerplate kapsamında performans aşağıdaki boyutlarla ele alınmalıdır:

1. Startup performance
2. Navigation / transition performance
3. Rendering performance
4. Input responsiveness
5. List / collection performance
6. Data fetching and perceived latency
7. Asset performance
8. Animation / motion performance
9. Background / passive work performance
10. Memory ve kaynak kullanımı
11. Battery / mobile runtime etkileri
12. Perceived performance and feedback quality

Bu boyutların her biri ürün kalitesini etkiler.
Sadece birine bakmak yeterli değildir.

---

# 5. Startup Performance

## 5.1. Tanım

Startup performance, uygulamanın ilk açılışta veya belirli yeniden başlatma senaryolarında ne kadar hızlı ve kararlı şekilde kullanılabilir hale geldiğini ifade eder.

## 5.2. Neden kritik?

Kullanıcının ilk kalite algısı burada oluşur.
Ağır, donuk, geç tepki veren açılışlar güven kaybı üretir.

## 5.3. Düşünülmesi gereken alanlar

- ilk bundle / ilk runtime maliyeti
- gereksiz provider ve initialization zinciri
- theme / config / session hydrate sırası
- kritik olmayan işlerin açılış yoluna konması
- blocking data fetch davranışları
- splash / initial loading stratejisi

## 5.4. Kural

Startup aşamasında yalnızca kritik işler bloklayıcı olmalıdır.
Her şeyi “uygulama açılırken halledelim” yaklaşımı zayıftır.

## 5.5. Zayıf davranışlar

- gereksiz global initialization
- açılışta onlarca veri çağrısı
- kritik olmayan analytics / config / warm-up işlerini bloklayıcı çalıştırmak
- ilk etkileşime kadar gereksiz bekleme üretmek

---

# 6. Navigation / Transition Performance

## 6.1. Tanım

Kullanıcının ekranlar arası geçiş, modal açma, tab değiştirme, detay açma, geri dönme gibi eylemlerde hissettiği akıcılık ve gecikme düzeyidir.

## 6.2. Neden kritik?

Navigation kalitesi bozulduğunda kullanıcı şunu hisseder:
- sistem ağır
- sistem kararsız
- sistem düşünüyormuş gibi ama aslında takılıyor

## 6.3. Kural

Ekran geçişleri:
- gereksiz render yükü yaratmamalı
- bloklayıcı data bekleyişi yüzünden donmamalı
- motion yüzünden ağırlaşmamalı
- kullanıcıyı anlamsız loading yüzeylerine sokmamalı

## 6.4. Zayıf davranışlar

- route değişiminde tam ekran jank
- modal açarken frame düşmesi
- tab geçişinde yeniden mount patlaması
- her screen focus’ta agresif refetch

---

# 7. Rendering Performance

## 7.1. Tanım

UI güncellenirken bileşen ağacının ne kadar verimli render edildiğini ifade eder.

## 7.2. Kural

Render yüzeyi mümkün olduğunca sorumluluk ve state scope ile uyumlu olmalıdır.
Yanlış scope, yanlış re-render üretir.

## 7.3. Düşünülmesi gereken alanlar

- state sahipliği
- prop drilling veya gereksiz object recreation
- global store subscription yüzeyi
- derived state hesap maliyeti
- büyük listelerde item render cost
- component tree derinliği
- unstable keys
- gereksiz wrapper ve composition maliyeti

## 7.4. Zayıf davranışlar

- küçük değişiklikte büyük subtree render etmek
- tüm ekranı global store’a subscribe etmek
- her render’da ağır map/filter/sort çalıştırmak
- render içinde parsing/formatting yığını

---

# 8. Input Responsiveness

## 8.1. Tanım

Kullanıcının dokunma, tıklama, yazma, seçim yapma gibi etkileşimlerde sistemin ne kadar anında cevap verdiğini ifade eder.

## 8.2. Neden kritik?

Input gecikmesi, kullanıcıya doğrudan “uygulama bozuk” hissi verir.

## 8.3. Alanlar

- text input typing
- search input response
- button press feedback
- checkbox/radio/switch toggles
- drag/scroll etkileşimleri
- form validation gecikmesi

## 8.4. Kural

Kullanıcı etkileşimi ağır hesaplara, gereksiz render’lara veya bloklayıcı network zincirlerine bağlanmamalıdır.

## 8.5. Zayıf davranışlar

- typing sırasında frame düşmesi
- her karakterde ağır validation
- basılan butonun geç tepki vermesi
- küçük toggle için büyük state güncelleme zinciri

---

# 9. List ve Collection Performance

## 9.1. Neden ayrı ele alınmalı?

Liste ve collection yüzeyleri, mobil ve web projelerde performans sorunlarının ana kaynaklarından biridir.

## 9.2. Düşünülmesi gereken alanlar

- virtualization ihtiyacı
- row/item render cost
- unstable item props
- image yükü
- selection state yönetimi
- pagination / infinite scroll
- filtered/sorted view maliyeti
- sticky headers / grouped lists

## 9.3. Kural

Liste büyüklüğü ve kullanım yoğunluğu arttıkça:
- render maliyeti,
- memory kullanımı,
- scroll akıcılığı
birlikte düşünülmelidir.

## 9.4. Zayıf davranışlar

- büyük listeyi düz render etmek
- her item içinde ağır hesaplar
- item’larda gereksiz inline object/function üretimi
- listeye ait state’i ekran geneline yaymak
- sonsuz scroll’da kontrolsüz fetch zinciri

## 9.5. List Virtualization Kuralları

**Virtualization nedir?**

List virtualization (diğer adıyla windowing), ekranda yalnızca kullanıcının görebildiği item’ları ve bir miktar buffer item’ı DOM’a (web) veya native view tree’ye (React Native) render etme tekniğidir. Görünmeyen item’lar bellekten kaldırılır ve yalnızca scroll ile görünür hale geldiklerinde yeniden oluşturulur. Bu sayede 10.000 item’lık bir listede bile DOM’da yalnızca 20-30 element bulunur ve bellek tüketimi, mount maliyeti ve scroll performansı dramatik biçimde iyileşir.

Virtualization olmadan 500 item’lık bir liste render edildiğinde, tarayıcı veya native platform 500 DOM/view node’u oluşturur, 500 bileşenin yaşam döngüsünü yönetir ve scroll sırasında 500 element’in layout hesaplamasını yapar. Bu, düşük ve orta segment cihazlarda doğrudan jank, yüksek bellek tüketimi ve uzun initial render süresi demektir.

**Ne zaman zorunlu?**

- **50+ item:** Virtualization düşünülmeli ve uygulanmalıdır. 50 item’ın altındaki listelerde virtualization overhead’i faydasından fazla olabilir.
- **100+ item:** Virtualization olmadan kabul edilebilir performans sağlanamaz. Bu eşikten itibaren virtualization zorunludur.
- **Dinamik yüklenen listeler (infinite scroll):** Item sayısı zamanla artacağı için en başından virtualize edilmelidir.

**Buffer (overscan) boyutu:**

Kullanıcı hızlı scroll yaptığında boş alan görmemesi için görünür alanın üstüne ve altına ekstra item’lar önceden render edilir. Önerilen yapılandırma: görünen alan + 5 item yukarı + 5 item aşağı. Toplam: visible item sayısı + 10. Bu değer, hızlı scroll’da beyaz boşluk görmemeyi sağlarken gereksiz render maliyetini de kontrol altında tutar. Çok büyük buffer (ör: 50 item) virtualization’ın amacını ortadan kaldırır, çok küçük buffer (ör: 1 item) hızlı scroll’da boşluk üretir.

**Web’de virtualization araçları:**

- **TanStack Virtual (eski adıyla react-virtual):** Web tarafında canonical virtualization aracıdır. Headless (UI-agnostic) bir virtualization kütüphanesi. Kendi container ve item component’lerini tanımlama esnekliği sağlar. Sabit ve değişken yükseklikli item’ları destekler. Hem dikey hem yatay listeler ve grid yapıları için çalışır. Yeni projede web virtualization ihtiyacında TanStack Virtual kullanılır.
- **react-window:** Mevcut projede zaten kullanılıyorsa kabul edilebilir; yeni projelerde tercih edilmez. FixedSizeList ve VariableSizeList component’leri sunar. react-virtualized’ın hafif versiyonudur.

**React Native’de virtualization:**

- **FlatList:** React Native’in yerleşik virtualized list component’i. Otomatik olarak yalnızca görünür item’ları ve buffer’ı render eder. Önerilen yapılandırma:
  - `initialNumToRender: 10` — İlk render’da kaç item mount edilir. Çok yüksek tutmak ilk render süresini artırır, çok düşük tutmak kullanıcının boş liste görmesine neden olabilir.
  - `maxToRenderPerBatch: 10` — Her render döngüsünde en fazla kaç yeni item render edilir. Düşük tutmak her batch’i hızlandırır ama scroll sırasında boşluk riski artırır.
  - `windowSize: 5` — Görünür alanın kaç katı kadar item hafızada tutulur (5 = görünür alanın 5 katı: 2 kat yukarı + 1 kat görünür + 2 kat aşağı). Düşük tutmak bellek tasarrufu sağlar ama hızlı scroll’da boşluk üretir.

- **getItemLayout:** Sabit yükseklikli listeler için zorunludur. Bu prop, FlatList’e her item’ın yüksekliğini ve offset’ini söyler, böylece FlatList scroll pozisyonunu hesaplamak için tüm item’ları ölçmek zorunda kalmaz. Kullanım: `getItemLayout={(data, index) => ({ length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index })}`. Bu tek ekleme, özellikle `scrollToIndex` gibi programatik scroll işlemlerinde performansı dramatik biçimde artırır.

- **Değişken yükseklikli listeler:** Item yükseklikleri farklıysa (ör: chat mesajları, sosyal medya feed’i) getItemLayout kullanılamaz. Bu durumda **FlashList** (Shopify) tercih edilmelidir. FlashList, FlatList’e göre çok daha verimli recycling mekanizması kullanır ve değişken yükseklikli item’larda bile yüksek performans sağlar.

**Hatalı yaklaşım — ScrollView içinde map:**

ScrollView içinde `data.map(item => <Item />)` ile 500 item render etmek, virtualization’ın tam tersidir. Bu yaklaşımda tüm item’lar mount olur, tüm item’ların layout hesaplaması yapılır, tüm item’lar bellekte tutulur. Sonuç: ilk render çok yavaş (500 component mount), bellek tüketimi çok yüksek (500 view node), scroll kasılır (layout hesaplama yükü). Bu yaklaşım 20-30 item için kabul edilebilir olsa da, 50+ item için kesinlikle kullanılmamalıdır.

---

# 10. Data Fetching ve Perceived Latency

## 10.1. Performans yalnızca gerçek süre değildir

Kullanıcının bekleyişi nasıl hissettiği de performansın parçasıdır.

## 10.2. Düşünülmesi gereken alanlar

- cache kullanımı
- stale-while-revalidate tarzı davranışlar
- skeleton vs spinner seçimi
- prefetch mantığı
- route geçişinde veri hazırlığı
- blocking vs non-blocking data load

## 10.3. Kural

Her loading aynı şiddette gösterilmemelidir.
Bazı durumlarda:
- sessiz revalidation
- partial rendering
- local loading
daha doğrudur.

## 10.4. Zayıf davranışlar

- her veri için tam ekran loading
- küçük yenilemede büyük spinner
- cache varken bile kullanıcıyı boş bekletmek
- network maliyetini UX tasarımı dışında tutmak

---

# 11. Asset Performance

## 11.1. Asset nedir?

Bu bağlamda:
- image
- icon set
- font
- animation asset
- media
- illustration
- remote/static asset
gibi öğeler asset sayılır.

## 11.2. Neden kritik?

Asset yönetimi kötü olursa:
- startup ağırlaşır
- listeler takılır
- bellek tüketimi artar
- data maliyeti artar
- görsel kalite düşmeden performans düşebilir

## 11.3. Kural

Asset’ler:
- boyut
- format
- çözünürlük
- yüklenme zamanı
- cache davranışı
- placeholder stratejisi
bakımından sistematik ele alınmalıdır.

## 11.4. Zayıf davranışlar

- büyük görselleri küçültmeden kullanmak
- aynı asset’i farklı biçimlerde çoğaltmak
- icon set’lerini kontrolsüz büyütmek
- font yükünü küçümsemek
- liste içinde ağır remote image kullanımı

## 11.5. Image Budget, Lazy Loading ve Asset Optimization

**Tek image boyut bütçeleri (production, optimize edilmiş hali):**

- **Genel kullanım image:** < 100KB. Ürün kartı görseli, profil fotoğrafı, içerik görseli gibi standart kullanımlar bu limitte olmalıdır.
- **Hero / banner image:** < 200KB. Ana sayfa hero alanı, landing page banner’ı gibi büyük görsel alanları için üst sınır. Bu boyut, tam ekran genişliğinde bile kabul edilebilir yükleme süresi sağlar.
- **Thumbnail:** < 20KB. Liste item’ları içindeki küçük görseller, avatar’lar ve grid preview’ları. Thumbnail’lar genellikle onlarca tanesi aynı anda ekranda görünür, bu yüzden bireysel boyutun küçük tutulması toplam payload için kritiktir.

**Format tercihi (öncelik sırasıyla):**

- **WebP:** Web platformunda varsayılan tercih. JPEG’e göre %25-35, PNG’ye göre %50+ daha küçük dosya boyutu sağlar. Tüm modern tarayıcılar destekler (Chrome, Firefox, Safari, Edge). Hem lossy hem lossless sıkıştırma, hem de transparency destekler.
- **AVIF:** Desteklenen ortamlarda en verimli format. JPEG’e göre %50 daha küçük. Ancak encode süresi uzundur ve tarayıcı desteği WebP kadar geniş değildir (Safari 16.4+, Chrome 85+, Firefox 93+). Destekleniyorsa `<picture>` element’i ile AVIF birincil, WebP fallback olarak sunulmalıdır.
- **PNG:** Yalnızca transparency (şeffaflık) gereken durumlar için. Logo, icon overlay, UI element gibi durumlar. Fotoğraf için PNG kullanılmamalıdır (dosya boyutu çok büyük olur).
- **JPEG:** WebP/AVIF desteklenmeyen ortamlar için fallback. Fotoğraf içeriği için uygundur. Quality: %75-85 arası genellikle görsel kalite kaybı olmadan anlamlı boyut düşüşü sağlar.
- **SVG:** Yalnızca icon’lar ve basit illustration’lar (geometrik şekiller, logolar, diyagramlar) için. Fotoğraf veya karmaşık gradient içeren görseller için SVG uygun değildir. SVG vektörel olduğu için her çözünürlükte keskin kalır ve dosya boyutu içerik karmaşıklığına bağlıdır (basit icon < 1KB, karmaşık illustration > 100KB olabilir).

**Responsive images (web):**

`srcset` ve `sizes` attribute’leri kullanılmalıdır. Bu sayede tarayıcı, ekran boyutu ve pixel density’sine göre en uygun image boyutunu indirir. Örnek:
```
<img 
  srcset="photo-400.webp 400w, photo-800.webp 800w, photo-1200.webp 1200w"
  sizes="(max-width: 600px) 100vw, (max-width: 1200px) 50vw, 33vw"
  src="photo-800.webp"
  alt="Açıklama"
/>
```
Bu yapıda mobil cihaz 400px genişliğindeki görseli indirirken, masaüstü 1200px genişliğindeki görseli indirir. srcset olmadan mobil cihaz bile 1200px görseli indirmek zorunda kalır.

Mobilde farklı ekran density’leri için @1x, @2x, @3x varyantları hazırlanmalıdır. React Native’de bu otomatik çalışır: `image.png`, `image@2x.png`, `image@3x.png` dosyaları aynı dizine konulur ve cihaz density’sine göre doğru dosya seçilir.

**Lazy loading:**

Viewport dışındaki (ekranda görünmeyen) image’lar lazy load edilmelidir. Web’de `loading="lazy"` attribute’ü kullanılır:
```
<img src="photo.webp" loading="lazy" alt="Açıklama" />
```
Bu attribute, tarayıcıya image’ı yalnızca viewport’a yaklaştığında indirmesini söyler. Intersection Observer ile manuel implementasyon yapılıyorsa threshold: 200px önerilir (viewport’a 200px kala yüklemeye başla). Bu sayede kullanıcı scroll ettiğinde image zaten yüklenmiş olur ve boş alan görmez. Above-the-fold (ilk ekranda görünen) image’lara lazy loading uygulanmamalıdır — bunlar eager (hemen) yüklenmelidir.

**Image compression pipeline:**

Figma’dan veya diğer tasarım araçlarından export edilen görseller ham halde optimize edilmemiştir. CI pipeline’ında veya build sürecinde otomatik optimizasyon uygulanmalıdır:
- **sharp:** Node.js tabanlı, çok hızlı image processing kütüphanesi. Resize, format convert ve compress işlemleri yapabilir.
- **squoosh:** Google’ın image optimization aracı. CLI ve web arayüzü var. Birden fazla codec desteği.
- İş akışı: Figma’dan export → sharp/squoosh ile optimize → repo’ya commit. Ham export doğrudan commit edilmemelidir.

**Placeholder stratejisi:**

Yüklenmemiş image’lar için kullanıcıya görsel bir ipucu gösterilmelidir. Boş alan veya kırık image ikonu göstermek kabul edilemez. İki yaklaşım:
- **LQIP (Low Quality Image Placeholder):** Orijinal image’ın çok küçük (10-20px genişlik), çok düşük kalitede bir versiyonu base64 olarak inline edilir (< 1KB). Image yüklenene kadar bu bulanık versiyon gösterilir, yüklenince gerçek image ile değiştirilir. Bu yaklaşım image’ın renk kompozisyonunu önceden gösterir ve algılanan yükleme süresini azaltır.
- **Dominant color background:** Image’ın dominant rengi (en çok kullanılan renk) hesaplanır ve placeholder olarak bu renkte bir arka plan gösterilir. LQIP’den daha hafiftir (ek data yok, yalnızca bir renk kodu) ama daha az bilgi verir.

**SVG optimization:**

SVG dosyaları genellikle tasarım araçlarından gereksiz metadata, editor bilgileri, boş group’lar ve kullanılmayan definition’lar ile export edilir. **SVGO** (SVG Optimizer) ile bu gereksiz veriler temizlenmelidir. SVGO, dosya boyutunu %20-60 arasında azaltabilir.

SVG kullanım biçimi tercihi:
- **SVG sprite:** Birden fazla icon tek bir SVG dosyasında toplanır ve `<use>` element’i ile referans edilir. Network request sayısını azaltır.
- **React component:** Her SVG bir React component’i olarak import edilir. Tree-shaking sayesinde yalnızca kullanılan icon’lar bundle’a dahil edilir. SVGR gibi araçlar SVG → React component dönüşümünü otomatize eder.
- **Inline SVG:** JSX içine doğrudan SVG kodu yapıştırmak. Küçük, tek kullanımlık icon’lar için kabul edilebilir ama birden fazla yerde kullanılan icon’lar için tekrar üretir.

**Icon stratejisi:**

SVG icon library kullanılmalıdır. Önerilen kütüphaneler: **Lucide** (Feather Icons’ın aktif fork’u), **Phosphor Icons** (geniş set, tutarlı stil). Bu kütüphaneler tree-shakeable olduğu için yalnızca kullanılan icon’lar bundle’a dahil edilir.

**Icon font YASAKTIR.** Icon font’ların sorunları: accessibility problemleri (screen reader’lar icon font karakterlerini anlamsız metin olarak okur), bundle bloat (kullanılmayan icon’lar da dahil edilir, font dosyası büyür), render tutarsızlıkları (farklı platformlarda farklı görünüm), font loading failure durumunda kırık görünüm (kare veya anlamsız karakter gösterilir).

## 11.6. Font Loading Stratejisi

**Font sourcing:**

Self-hosted font tercih edilmelidir. Google Fonts CDN’den font yüklemek kolay olsa da üçüncü parti CDN bağımlılığı yaratır: CDN yanıt süresi tahmin edilemez, GDPR endişeleri doğurur (kullanıcı IP’si Google’a gider) ve HTTP bağlantı kurulumu ek gecikme ekler. Font dosyaları projenin kendi sunucusundan veya CDN’inden serve edilmelidir.

**Variable font tercihi:** Variable font, tek bir font dosyasında tüm weight’leri (thin’den black’e), width’leri ve hatta italic varyantlarını barındırır. Geleneksel yaklaşımda her weight için ayrı dosya gerekir (Regular: 30KB + Bold: 32KB + SemiBold: 31KB + ... = 150KB+). Variable font ile tek dosya (50-70KB) tüm weight’leri karşılar. Hem toplam dosya boyutu düşer hem de HTTP request sayısı azalır.

**font-display stratejisi:**

`font-display: swap` varsayılan olarak kullanılmalıdır. Bu değer tarayıcıya şunu söyler: "Custom font yüklenene kadar metni sistem fontuyla (fallback) göster, custom font hazır olunca değiştir (swap et)."

- **FOUT (Flash of Unstyled Text):** font-display: swap ile oluşan davranış. Metin hemen görünür (sistem fontuyla), sonra custom fonta geçer. Kullanıcı içeriği hemen okuyabilir. **Kabul edilebilir.**
- **FOIT (Flash of Invisible Text):** font-display: block veya ayarsız durumda oluşan davranış. Custom font yüklenene kadar metin görünmez (boş alan). Kullanıcı 1-3 saniye boyunca hiçbir şey okuyamaz. **Kabul edilemez.**

font-display: optional da değerlendirilebilir: font cache’teyse kullanılır, yoksa hiç swap yapılmaz (FOUT bile olmaz). İkinci ziyarette font cache’ten gelir. Bu yaklaşım CLS’yi (Cumulative Layout Shift) sıfıra indirir ama ilk ziyarette custom font görünmez.

**Preload:**

Kritik fontlar (body text fontu, yani sayfanın ana metin fontu) preload edilmelidir:
```
<link rel="preload" href="/fonts/CustomFont.woff2" as="font" type="font/woff2" crossorigin>
```
`crossorigin` attribute’ü font dosyaları için zorunludur (font dosyaları spec gereği her zaman CORS ile yüklenir, aynı origin’den bile olsa). Preload, tarayıcıya "bu dosyayı HTML parse işlemine paralel olarak hemen indirmeye başla" der.

**Önemli:** Yalnızca 1-2 font dosyası preload edilmelidir. Daha fazlası bandwidth waste yaratır ve diğer kritik kaynakların (CSS, JS) indirilmesini geciktirebilir. Body font preload edilir, heading font veya display font gerekirse preload edilmez — bunlar CSS içindeki @font-face ile normal akışta yüklenir.

**WOFF2 format yeterliliği:**

WOFF2, tüm modern tarayıcılar tarafından desteklenen (Chrome 36+, Firefox 39+, Safari 12+, Edge 14+) sıkıştırılmış font formatıdır. Brotli compression kullanır ve WOFF’a göre %30 daha küçüktür. **Tek format olarak WOFF2 yeterlidir.** WOFF fallback eklemeye gerek yoktur. IE11 desteği gerekmedikçe (bu projede gerekmez) ek format dahil edilmemelidir.

**System font fallback stack:**

Custom font yüklenene kadar veya yüklenemezse kullanılacak fallback font zinciri:
```
font-family: ‘CustomFont’, -apple-system, BlinkMacSystemFont, ‘Segoe UI’, Roboto, sans-serif;
```
Bu zincir sırasıyla: macOS/iOS sistem fontu (-apple-system), eski Chrome macOS (BlinkMacSystemFont), Windows (Segoe UI), Android (Roboto) ve genel sans-serif fallback’i kapsar. Custom font ile fallback font’un metrik uyumu (x-height, line-height) ne kadar yakınsa, font swap sırasındaki layout shift (CLS) o kadar az olur. `@font-face` içinde `size-adjust`, `ascent-override`, `descent-override` property’leri ile metrik uyumu iyileştirilebilir.

**Font subset:**

Font dosyası yalnızca projede kullanılacak karakter setlerini içermelidir. Bu proje için: **Latin** (temel ASCII, İngilizce içerik) + **Latin Extended / Turkish Extended** (ç, ğ, ı, ö, ş, ü, İ, Ş gibi Türkçe karakterler). CJK (Çince, Japonca, Korece), Cyrillic (Rusça), Arapça veya diğer karakter setleri projede kullanılmıyorsa font dosyasına dahil edilmemelidir. Gereksiz karakter setleri font dosya boyutunu 2-10 kat artırabilir. Google Fonts’tan indirilen fontlar genellikle tüm karakter setlerini içerir; subset işlemi `pyftsubset` (fonttools), `glyphhanger` veya `subfont` araçlarıyla yapılabilir.

**React Native’de font yönetimi:**

Expo projelerinde `expo-font` paketi kullanılır. Font’lar uygulama başlangıcında yüklenir ve yüklenene kadar SplashScreen gösterilir:
```
const [fontsLoaded] = useFonts({
  ‘CustomFont-Regular’: require(‘./assets/fonts/CustomFont-Regular.ttf’),
  ‘CustomFont-Bold’: require(‘./assets/fonts/CustomFont-Bold.ttf’),
});

if (!fontsLoaded) return null; // SplashScreen gösterilmeye devam eder
```
`SplashScreen.preventAutoHideAsync()` ile splash screen font yüklenene kadar tutulur, font hazır olunca `SplashScreen.hideAsync()` ile kaldırılır. Bu sayede kullanıcı font yüklenmemiş metinler görmez.

**Performans etkisi hedefleri:**

- Tek font dosyası (variable font, subset): < 50KB
- Toplam font payload (tüm font dosyaları toplamı): < 100KB
- Bu hedefler variable font + subset + WOFF2 kombinasyonu ile rahatlıkla tutulur.

## 11.7. Image/Asset Optimization Stratejisi

**Figma → export workflow:**

Figma’dan (veya diğer tasarım araçlarından) export edilen asset’ler ham halde repo’ya commit edilmemelidir. Ham export dosyaları genellikle gereksiz metadata, optimize edilmemiş sıkıştırma ve fazla çözünürlük içerir. Doğru iş akışı: Export → Optimize → Commit.

Bu kural hem raster image’lar (PNG, JPEG) hem de vektörel asset’ler (SVG) için geçerlidir. Figma’dan export edilen bir SVG’de onlarca satır gereksiz metadata olabilir, bir PNG ise sıkıştırma oranı düşük olabilir.

**Optimization pipeline:**

1. **SVG:** SVGO ile optimize edilir. Gereksiz metadata, boş group’lar, editor bilgileri ve kullanılmayan definition’lar temizlenir. Precision ayarı (floatPrecision: 2-3) ile path data boyutu düşürülür.
2. **Raster image:** sharp kütüphanesi ile üç aşamalı işlem uygulanır: (a) resize — hedef boyuta küçültme, (b) format convert — WebP veya AVIF’e dönüştürme, (c) compress — kalite ayarıyla sıkıştırma (WebP quality: 80, AVIF quality: 65 genellikle yeterli).
3. **CI’da otomatik:** Bu optimization adımları CI pipeline’ına entegre edilmelidir. PR’a eklenen her yeni image otomatik olarak kontrol edilmeli, boyut limitleri aşılıyorsa warning verilmelidir. Opsiyonel olarak CI’da otomatik optimize edilip PR’a commit edilebilir.

**Responsive image generation:**

Tek bir kaynak (source) image’dan birden fazla boyut üretilmelidir. Örneğin bir ürün görseli için:
- **Thumbnail:** 150x150px (liste görünümü, arama sonuçları)
- **Medium:** 400x400px (ürün kartı, grid görünümü)
- **Large:** 800x800px (ürün detay sayfası)
- **Hero:** 1200xAuto (tam genişlik banner alanları)

Bu boyutlar build time’da veya CI pipeline’ında üretilir. Runtime’da on-the-fly resize yapılması tercih edilmez (CDN image transformation hariç — Cloudinary, Imgix gibi servisler runtime resize yapabilir ve bu kabul edilebilir).

**CDN ve cache stratejisi:**

Production ortamında static asset’ler (image, font, icon, CSS, JS) mutlaka CDN üzerinden serve edilmelidir. CDN, asset’leri kullanıcıya coğrafi olarak yakın edge sunuculardan sunar ve yükleme süresini dramatik biçimde azaltır.

Cache header’ları:
```
Cache-Control: public, max-age=31536000, immutable
```
- `max-age=31536000` — 1 yıl cache (asset değişmediği sürece tarayıcı tekrar indirmez).
- `immutable` — Tarayıcıya "bu dosya hiç değişmeyecek, revalidation bile yapma" der.

Bu strateji yalnızca dosya adlarında **content hash** bulunduğunda güvenlidir. Content hash, dosya içeriğinin hash değerinin dosya adına eklenmesidir (ör: `logo.a3f4b2.webp`, `main.7c8d9e.js`). Dosya içeriği değiştiğinde hash değişir, yeni dosya adı oluşur ve tarayıcı yeni dosyayı indirir. Eski cache’lenmiş dosya sorun yaratmaz çünkü dosya adı farklıdır. Modern bundler’lar (webpack, Vite, esbuild) content hash’i otomatik olarak ekler.

**Bundle’a gömme vs external dosya:**

- **< 4KB asset:** Base64 olarak inline edilebilir. Küçük icon’lar, tiny placeholder image’lar ve basit SVG’ler bu kategoriye girer. Inline etmek ek HTTP request’i ortadan kaldırır. Ancak base64 encoding orijinal dosya boyutunu ~%33 artırır, bu yüzden yalnızca çok küçük dosyalar için uygundur.
- **> 4KB asset:** Ayrı dosya olarak serve edilmelidir. Base64 encoding ile bundle boyutunu gereksiz büyütmek yerine ayrı HTTP request ile yüklenmeli ve CDN cache’inden faydalanılmalıdır.

Bu eşik (4KB) webpack’in varsayılan asset inline limit’i ile uyumludur ve pratikte iyi çalışan bir denge noktasıdır.

---

# 12. Animation / Motion Performance

## 12.1. Motion neden performans konusudur?

Motion yalnızca tasarım değil runtime yüküdür.
Yanlış motion:
- frame düşmesi
- jank
- input gecikmesi
- enerji tüketimi
üretebilir.

## 12.2. Kural

Motion:
- anlamlı olmalı
- kısa olmalı
- performans dostu olmalı
- transition maliyetini gereksiz artırmamalı
- reduced motion ile uyumlu olmalı

## 12.3. Zayıf davranışlar

- her state geçişine animation koymak
- ağır layout animasyonları
- navigation transition’larını gereksiz pahalı hale getirmek
- düşük cihazları düşünmeden hareket tasarlamak

## 12.4. Animasyon FPS Hedefi ve Frame Drop Toleransı

Tüm UI animasyonları 60fps hedeflemelidir. 60fps, her bir frame’in 16.67 milisaniyede (1000ms / 60) tamamlanması gerektiği anlamına gelir. Bu süre içinde layout hesaplaması, paint, composite ve JavaScript işlemleri dahil tüm işler bitirilmelidir. 120Hz ekranlarda (iPad Pro, yeni nesil iPhone ve Android cihazlar) 120fps (8.33ms/frame) tercih edilir ancak zorunlu değildir; 120Hz ekranda 60fps çalışan bir animasyon yine kabul edilebilir düzeydedir.

**Jank tanımı:** Jank, animasyon sırasında kullanıcının algılayabildiği takılma ve atlama hissidir. Bu projedeki somut tanım: ardışık 3 veya daha fazla frame drop. Yani 3 frame boyunca üst üste 16.67ms bütçesinin aşılması jank olarak kabul edilir. Tek bir dropped frame (bir frame’in 16.67ms yerine 20-25ms sürmesi) kullanıcı tarafından genellikle fark edilmez ve kabul edilebilir. Ancak ardışık 3 veya daha fazla frame drop kullanıcı deneyimini doğrudan bozar ve kabul edilemez.

**Animation thread vs UI thread ayrımı:**

Tarayıcıda render pipeline şu adımlardan oluşur: JavaScript → Style → Layout → Paint → Composite. Animasyonun hangi aşamada çalıştığı performansı dramatik biçimde etkiler:

- **Compositor thread’de çalışan animasyonlar (tercih edilen):** CSS `transform` (translate, scale, rotate) ve `opacity` property’leri yalnızca composite aşamasında işlenir. Bu, main thread’i bloke etmez, JavaScript çalışırken bile animasyon akıcı devam eder. Bu iki property animasyonların büyük çoğunluğu için yeterlidir: hareket (translateX/Y), boyut değişimi (scale), döndürme (rotate), görünürlük geçişi (opacity).

- **Main thread’i bloke eden animasyonlar (kaçınılması gereken):** `width`, `height`, `top`, `left`, `margin`, `padding`, `border-width` gibi layout property’lerinin animasyonu her frame’de layout recalculation tetikler. Bu, main thread’i bloke eder, JavaScript execution ile yarışır ve jank üretir. Örneğin bir element’in width’ini 100px’den 200px’e animate etmek yerine `transform: scaleX()` kullanılmalıdır. Bir element’i sola kaydırmak için `left` animate etmek yerine `transform: translateX()` kullanılmalıdır.

**React Native’de animasyon kuralları:**

- React Native’de JavaScript thread ve UI (native) thread ayrı çalışır. JS thread’de çalışan animasyonlar 60fps’i tutamaz çünkü JS thread aynı zamanda component render, state update ve business logic ile meşguldür.
- **Animated API** kullanılırken `useNativeDriver: true` her zaman tercih edilmelidir. Bu flag animasyonu native thread’e taşır ve JS thread’den bağımsız çalışmasını sağlar. `useNativeDriver: true` yalnızca transform ve opacity için çalışır (layout property’leri native driver ile animate edilemez).
- **Reanimated 3** daha karmaşık animasyonlar için tercih edilmelidir. Reanimated, worklet’ler aracılığıyla animasyon kodunu doğrudan UI thread’de çalıştırır. Gesture-driven animasyonlar (sürükleme, kaydırma, pinch-zoom) için Reanimated + React Native Gesture Handler kombinasyonu standart yaklaşımdır.
- JS thread’de çalışan animasyonlar (useNativeDriver: false olan Animated veya setInterval/setTimeout ile yapılan manuel animasyonlar) yalnızca native driver’ın desteklemediği property’ler için son çare olarak kullanılmalıdır.

**Web’de animasyon kuralları:**

- CSS `transition` ve `animation` (@keyframes) tercih edilmelidir. CSS animasyonları tarayıcı tarafından optimize edilir ve compositor thread’de çalıştırılabilir.
- `requestAnimationFrame` ile JavaScript animasyonu yalnızca CSS’in yetersiz kaldığı durumlarda kullanılmalıdır: karmaşık fizik simülasyonları, kullanıcı input’una bağlı dinamik animasyonlar, canvas/WebGL animasyonları.
- `will-change` CSS property’si dikkatli kullanılmalıdır. Tarayıcıya "bu element animasyon yapacak" sinyali verir ve GPU layer oluşturmasını sağlar. Ancak her element’e will-change eklemek GPU belleğini gereksiz tüketir. Yalnızca gerçekten animate edilen element’lere eklenmeli ve animasyon bittikten sonra kaldırılmalıdır.

**Ölçüm araçları:**

- **Chrome DevTools Performance tab:** Frame timing, dropped frame sayısı, main thread activity ve compositor frame’leri burada izlenir. "Frames" bölümünde kırmızı işaretli frame’ler dropped frame’leri gösterir.
- **React Native Perf Monitor:** Geliştirme modunda `Ctrl+M` (Android) veya shake gesture (iOS) ile açılır. JS thread FPS ve UI thread FPS ayrı ayrı gösterilir. JS FPS < 60 ise JS thread’de ağır iş var demektir. UI FPS < 60 ise native tarafta render problemi var demektir.
- **React Native DevTools / Hermes profiling:** React Native uygulamalarında modern profiler yüzeyi birincil tercih olmalıdır. Detaylı frame timing ve JS maliyeti burada izlenir.
- **Flipper performance plugin:** Ek native görünürlük gerektiğinde ikincil araç olarak kullanılabilir.

---

# 13. Background Work ve Passive Work

## 13.1. Tanım

Kullanıcı doğrudan görmese de uygulama arka planda çeşitli işler yapabilir:
- sync
- analytics
- log flush
- prefetch
- hydration
- session refresh
- cache cleanup

## 13.2. Kural

Arka plan işleri kullanıcı etkileşimini boğmamalıdır.

## 13.3. Zayıf davranışlar

- app açılır açılmaz yüksek maliyetli background işler
- UI thread hissini bozan pasif işler
- sürekli polling benzeri gereksiz faaliyet
- bataryayı gereksiz tüketen senkron davranışlar

---

# 14. Memory ve Kaynak Kullanımı

## 14.1. Neden önemlidir?

Performans sadece hız değildir.
Aşırı bellek kullanımı, ekran geçişlerinde yığılma, asset retention ve gereksiz in-memory cache davranışları uzun oturum kalitesini bozar.

## 14.2. Düşünülmesi gereken alanlar

- büyük veri setlerini memory’de tutma
- gereksiz cache retention
- ekran kapanınca temizlenmesi gereken local state
- image memory footprint
- çok büyük form draft’ları
- gereksiz clone / transform operasyonları

## 14.3. Zayıf davranışlar

- kullanımı biten state’i temizlememek
- gereksiz entity birikimi
- bir ekranı terk ettikten sonra bile ağır in-memory yapıların yaşaması

## 14.4. Memory Leak Prevention Kuralları

Memory leak, artık kullanılmayan bir bellek alanının çalışma zamanı tarafından serbest bırakılamaması durumudur. Bu durum özellikle uzun süre açık kalan UI uygulamalarında ciddi problemler üretir: uygulama giderek daha fazla bellek tüketir, scroll ve animasyonlar kasılmaya başlar, en sonunda tarayıcı veya mobil işletim sistemi uygulamayı öldürür.

UI uygulamalarında memory leak’in en sık karşılaşılan nedenleri şunlardır:
- temizlenmeyen event listener’lar (component unmount oldu ama listener hâlâ DOM’a bağlı),
- iptal edilmeyen subscription’lar (WebSocket, Zustand manuel subscribe, EventSource vb.),
- unmount sonrası state update girişimi (async işlem döndüğünde component artık yok ama setState çağrılıyor),
- closure’da tutulan büyük veri referansları (bir callback içinde büyük bir array veya object referansı yakalanmış ve garbage collector bu veriyi temizleyemiyor).

**Kurallar:**

1. **useEffect cleanup:** Her useEffect hook’u bir return fonksiyonu döndürmelidir. Bu fonksiyon component unmount olduğunda veya dependency değiştiğinde çağrılır. Cleanup fonksiyonunda subscription’lar sonlandırılmalı, timer’lar temizlenmeli ve listener’lar kaldırılmalıdır. Örnek: `return () => { clearInterval(id); clearTimeout(timeoutId); subscription.unsubscribe(); }`. Cleanup fonksiyonu olmayan bir useEffect, potansiyel memory leak kaynağıdır ve code review’da sorgulanmalıdır.

2. **AbortController ile fetch iptali:** Component unmount olduğunda devam eden HTTP request’leri iptal edilmelidir. Bunun için AbortController kullanılır. Kullanım: `const controller = new AbortController(); fetch(url, { signal: controller.signal })`. Cleanup’ta: `controller.abort()`. Bu yapılmazsa, unmount olmuş component için dönen response üzerinde state güncellemesi denenir ve React "Can’t perform a React state update on an unmounted component" uyarısı üretir. Bu uyarı doğrudan memory leak sinyalidir.

3. **TanStack Query otomatik cleanup:** TanStack Query (React Query), component unmount olduğunda ilgili query observer’ını otomatik olarak temizler. Bu nedenle TanStack Query kullanan projelerde manuel fetch yerine query hook’ları tercih edilmelidir. Eğer herhangi bir nedenle TanStack Query dışında manuel fetch yapılıyorsa, AbortController kullanımı zorunludur.

4. **WebSocket ve EventSource bağlantıları:** Bu tür kalıcı bağlantılar component unmount olduğunda kesinlikle kapatılmalıdır. WebSocket için: `socket.close()`. EventSource için: `eventSource.close()`. Bu yapılmazsa bağlantı açık kalır, sunucu kaynağı tüketir ve istemcide bellek birikir.

5. **Zustand subscription yönetimi:** Zustand’ın `useStore` hook’u component unmount olduğunda otomatik cleanup yapar. Ancak `useStore` yerine `store.subscribe()` ile manuel subscription yapılıyorsa, dönen unsubscribe fonksiyonu cleanup’ta çağrılmalıdır. Örnek: `const unsubscribe = useMyStore.subscribe((state) => { ... }); return () => unsubscribe();`.

6. **React Native spesifik listener’lar:** BackHandler, Keyboard ve AppState gibi native event emitter’ların listener’ları component unmount’ta kaldırılmalıdır. Örnek: `const subscription = Keyboard.addListener(‘keyboardDidShow’, handler); return () => subscription.remove();`. Ayrıca Animated value’lar üzerinde devam eden animasyonlar `stopAnimation()` ile durdurulmalıdır, aksi halde animasyon döngüsü arka planda devam eder.

7. **Image ve Blob URL temizliği:** `URL.createObjectURL()` ile oluşturulan object URL’ler, kullanım bittikten sonra veya component unmount olduğunda `URL.revokeObjectURL(url)` ile serbest bırakılmalıdır. Her createObjectURL çağrısı bellekte bir referans tutar ve otomatik temizlenmez. Dosya yükleme preview’ları, canvas export’ları ve blob manipülasyonları bu duruma sık rastlanan senaryolardır.

8. **Closure trap:** Event handler veya callback fonksiyonları içinde büyük array, object veya veri yapılarına referans tutmaktan kaçınılmalıdır. Closure içinde yakalanan referanslar garbage collector tarafından temizlenemez çünkü callback hâlâ o veriye erişilebilir olduğunu varsayar. Büyük veri ile çalışan callback’lerde veriyi dışarıda tutup yalnızca gerekli dilimi parametre olarak geçirmek veya WeakRef kullanmak değerlendirilmelidir.

**Tespit araçları:**
- Chrome DevTools Memory tab: Heap snapshot alarak belirli bir andaki bellek dağılımı incelenir. İki snapshot arasında comparison yapılarak büyüyen object’ler tespit edilir. Allocation timeline ile zaman içinde hangi object’lerin biriktiği izlenir.
- React DevTools Profiler: Gereksiz re-render ve mount/unmount döngüleri tespit edilir. Unmount olmayan component’ler potansiyel leak kaynağıdır.
- React Native (Hermes): Hermes memory profiling ile JS heap boyutu ve object retention izlenir. Öncelik React Native DevTools / Hermes profiling yüzeyindedir; gerekirse Flipper memory plugin ikincil olarak kullanılır.

**CI’da memory leak testi (opsiyonel ama önerilen):** Otomatik test senaryosu olarak component mount → kullanıcı etkileşimi simülasyonu → component unmount → heap snapshot karşılaştırması yapılabilir. İlk snapshot ile son snapshot arasında anlamlı fark varsa (unmount sonrası temizlenmesi gereken object’ler hâlâ heap’te duruyorsa) test başarısız kabul edilir. Bu yaklaşım özellikle uzun ömürlü uygulamalarda (dashboard, chat, real-time veri takip ekranları) kritiktir.

---

# 15. Battery ve Mobile Runtime Hassasiyeti

## 15.1. Neden özellikle mobile için kritik?

Performans yalnızca frame ve süre değildir.
Batarya ve termal yük de deneyimi etkiler.

## 15.2. Zayıf davranış örnekleri

- gereksiz sürekli polling
- gereksiz arka plan sync
- ağır animasyonların sürekli çalışması
- görünmeyen yüzeylerde bile hesap yükünün sürmesi
- yoğun network + render + animation kombinasyonu

## 15.3. Kural

Mobil runtime maliyeti göz ardı edilmemelidir.
Sadece güçlü geliştirme cihazında iyi görünmek yeterli değildir.

---

# 16. Perceived Performance

## 16.1. Tanım

Perceived performance, sistemin gerçek süresi kadar kullanıcının o süreyi nasıl hissettiğiyle ilgilidir.

## 16.2. Ana araçlar

- skeleton
- progressive reveal
- cached content reuse
- predictable feedback
- local state immediacy
- prefetch
- optimistic UI
- non-blocking transitions

## 16.3. Kural

Perceived performance, sahte hız değildir.
Kullanıcıyı aldatmak için değil, belirsizliği azaltmak için kullanılır.

## 16.4. Zayıf perceived performance davranışları

- her bekleyişte aynı spinner
- sistem çalışıyor ama kullanıcıya hiçbir işaret yok
- gereksiz skeleton spam’i
- optimistic görünüm verip rollback’te kullanıcıyı kırmak

---

# 17. Performance Budget Mantığı

## 17.1. Neden gerekir?

Performans “iyi olsun” diye yönetilemez.
Belirli hedefler ve kabul edilebilir sınırlar gerekir.

## 17.2. Budget alanları

Bu proje kapsamında en azından kavramsal olarak şu budget alanları düşünülmelidir:
- startup hissi
- first interactive hissi
- screen transition hissi
- scroll akıcılığı
- input responsiveness
- long list davranışı
- image yüklenme kalitesi
- blocking loading sıklığı

## 17.3. Baseline Sinyal Metrikleri

Aşağıdaki değerler kesin performans hedefi (hard target) değil, başlangıç sinyalleri olarak kullanılmalıdır. Bu eşikler, ürünün algılanan kalite seviyesi hakkında erken uyarı verir ve performans gözleminin somut referans çerçevesini oluşturur:

**Web (desktop):**
- LCP < 2.5s
- CLS < 0.1
- INP < 200ms

**Web (mobile):**
- LCP < 3.5s
- CLS < 0.1
- INP < 300ms

**Navigation geçişi:**
- < 200ms jank-free (ekranlar arası geçiş, tab değişimi, modal açılışı)

**Startup (mobile app):**
- Cold start < 3s
- Warm start < 1.5s

Bu değerler projenin başlangıç baseline'ıdır. Gerçek ürün koşullarına göre spesifik alanlar için daha sıkı veya farklı eşikler tanımlanabilir. Önemli olan, performans konuşmalarının sezgisel değil ölçülebilir bir referansla yapılmasıdır.

## 17.4. Bundle Size Budget

Bundle size, uygulamanın kullanıcıya gönderdiği JavaScript, CSS ve binary dosyalarının toplam boyutudur. Bundle büyüdükçe indirme süresi, parse süresi ve başlangıç maliyeti artar. Özellikle mobil cihazlarda ve zayıf ağ koşullarında (3G, metro, kırsal alan) büyük bundle doğrudan kullanılabilirlik kaybı demektir.

**Web bundle bütçeleri (gzipped boyutlar):**

- **Initial JS bundle (gzipped): < 150KB hedef, < 200KB hard limit.** Initial bundle, kullanıcının sayfayla etkileşime geçebilmesi için indirilmesi ve parse edilmesi gereken JavaScript'tir. 3G bağlantıda (yaklaşık 750Kbps throughput) 150KB ≈ 1.5 saniye download süresi demektir. 200KB'ı aşan initial bundle, mobil kullanıcılar için kabul edilemez başlangıç gecikmesi üretir. Bu bütçe code splitting ve lazy loading ile yönetilir: yalnızca ilk ekran için gereken kod initial bundle'a dahil edilir, geri kalan route'lar ve feature'lar lazy chunk olarak ayrılır.

- **Total JS (tüm lazy chunk'lar dahil, gzipped): < 500KB.** Uygulamanın tüm route'ları ve feature'ları yüklendiğinde toplam JavaScript payload'ı 500KB'ı geçmemelidir. Bu limit, tree-shaking'in düzgün çalıştığını ve gereksiz bağımlılık eklenmediğini doğrulayan bir sinyal olarak kullanılır.

- **CSS (gzipped): < 30KB.** Tailwind CSS kullanıldığında ve purge (content configuration) doğru yapılandırıldığında bu hedef rahatlıkla tutulur. Tailwind purge yapılandırılmamışsa CSS dosyası megabyte'lar mertebesine çıkabilir. Purge yapılandırması production build'de zorunludur.

- **Tek bir lazy route chunk'ı (gzipped): < 50KB.** Bir lazy-loaded route veya feature chunk'ı 50KB'ı aşıyorsa, bu chunk'ın içinde gereğinden fazla bileşen veya bağımlılık olduğunu gösterir. Bu durumda code splitting review yapılmalı, chunk daha küçük parçalara bölünmeli veya paylaşılan bağımlılıklar ayrı common chunk'a taşınmalıdır.

**Mobile app binary bütçeleri:**

- **iOS uygulama boyutu: < 25MB.** App Store'dan indirme boyutu. 25MB'ın üzerindeki uygulamalar hücresel veri ile indirmede kullanıcı onayı gerektirir (Apple'ın 200MB sınırı var ama kullanıcı algısı açısından küçük tutmak önemlidir).
- **Android APK boyutu: < 15MB.** Google Play'den indirme boyutu. AAB (Android App Bundle) formatında Play Store otomatik optimizasyon yapar ama hedef APK boyutu referans olarak korunmalıdır.
- **Expo OTA update JS bundle'ı: < 5MB.** Expo Updates ile gönderilen over-the-air JavaScript bundle'ı. Bu bundle her uygulama açılışında veya arka planda indirilir, bu yüzden küçük tutulması kullanıcı deneyimi ve mobil veri tüketimi açısından kritiktir.

**Monitoring ve CI entegrasyonu:**

Her pull request'te bundle analysis çalıştırılmalıdır. Kullanılabilecek araçlar:
- webpack projelerinde: `webpack-bundle-analyzer` (görsel treemap),
- Vite projelerinde: `vite-bundle-visualizer` veya `rollup-plugin-visualizer`,
- genel amaçlı: `source-map-explorer` (source map üzerinden analiz).

CI pipeline'ında önceki build ile mevcut build'in bundle boyutları karşılaştırılmalıdır. Boyut artışı belirlenen eşiği aşarsa (ör: initial bundle 10KB'dan fazla büyümüşse) CI warning üretmeli, hard limit aşılmışsa PR blocker olmalıdır. Bu karşılaştırma için `bundlesize`, `size-limit` veya benzeri araçlar kullanılabilir.

**Tree-shaking ve barrel export uyarısı:**

Tree-shaking, kullanılmayan kodun final bundle'dan çıkarılması işlemidir. Bundler (webpack, Vite/Rollup, esbuild) yalnızca import edilen export'ları bundle'a dahil eder, geri kalanını atar. Ancak barrel exports (index.ts dosyasından re-export) tree-shaking'i kırabilir. Örneğin: `export * from './ComponentA'; export * from './ComponentB'; ...` şeklinde yüzlerce component'i re-export eden bir index.ts dosyasından tek bir component import edildiğinde, bundler tüm dosyaları dahil edebilir. Bu nedenle named import zorunludur: `import { Button } from '@/components/Button'` doğru, `import { Button } from '@/components'` riskli. Barrel export kullanılıyorsa sideEffects: false konfigürasyonu ve named export yapısı dikkatlice kontrol edilmelidir.

## 17.5. Kural

Her feature aynı performans riskini taşımaz.
Ama yüksek riskli alanlar bütçe mantığıyla değerlendirilmelidir.

---

# 18. Render Scope İlkesi

## 18.1. Temel kural

State’i kime verirsen render’ı da ona verirsin.
Bu yüzden state scope ile render scope birlikte düşünülmelidir.

## 18.2. Sonuçlar

- global state daha geniş render yüzeyi yaratabilir
- feature-local state daha kontrollü olabilir
- component-local state en düşük yüzey olabilir
- derived state konumu performansı belirler

## 18.3. Zayıf davranışlar

- küçük UI state için global store
- ekranın tamamını tek büyük render alanı yapmak
- performans sorununu memo ile yamamak ama scope’u düzeltmemek

---

# 19. Expensive Work Placement

## 19.1. Neden önemli?

Ağır işler yanlış yerde yapılırsa arayüz bozulur.

Ağır iş örnekleri:
- büyük map/filter/sort
- formatting zincirleri
- parsing
- normalization
- validation sweep
- layout-sensitive hesaplar

## 19.2. Kural

Ağır işler:
- render içine dağılmamalı
- uygun katmana taşınmalı
- gerekiyorsa memoize edilmeli
- gerekiyorsa precompute edilmeli
- ama gereksiz mikro optimizasyon yapılmamalıdır

## 19.3. Zayıf davranışlar

- her render’da veri işlemek
- input typing sırasında ağır filtreleme
- component içinde büyük map zinciri
- aynı hesaplamayı çok yerde tekrarlamak

---

# 20. Form Performance

## 20.1. Neden ayrı ele alınmalı?

Formlar performans açısından hassastır.
Özellikle:
- typing latency
- field-level validation
- long form render cost
- dynamic sections
- submit transition
konuları kritiktir.

## 20.2. Kural

- validation her tuşta ağır çalışmamalı
- field update tüm formu gereksiz render etmemeli
- helper/error state yapısı kontrollü olmalı
- form section’ları gerektiğinde ayrıştırılmalı

## 20.3. Zayıf davranışlar

- her input değişiminde tüm formu yeniden hesaplamak
- complex masks ve validators ile typing’i yavaşlatmak
- long form’da bütün alanları canlı tutup ağırlaştırmak

---

# 21. Navigation Performance

## 21.1. Kural

Navigation performansı yalnızca router hızına indirgenemez.
Şunlar birlikte düşünülmelidir:
- preloading / lazy loading
- screen mount maliyeti
- route-level data dependency
- transition animation cost
- teardown / cleanup davranışı
- stale screen reuse

## 21.2. Zayıf davranışlar

- her navigasyonda ağır re-init
- navigation sırasında gereksiz global state değişimleri
- ekran geçişiyle birlikte büyük veri işleme
- panel/modal açılışında bile tam ekran maliyet yaratmak

---

# 22. Data Layer Performance

## 22.1. Düşünülmesi gereken alanlar

- overfetch
- underfetch
- duplicate fetch
- cache hit/miss oranı
- invalidation aşırılığı
- refetch sıklığı
- payload boyutu
- mapping cost
- optimistic rollback cost

## 22.2. Kural

“Veri hızlı geliyor” tek başına yeterli değildir.
Doğru zamanda, doğru miktarda, doğru yüzeye gelen veri önemlidir.

## 22.3. Zayıf davranışlar

- aynı veriyi farklı bileşenlerde yeniden çekmek
- küçücük değişimde dev listeyi refetch etmek
- stale veriyi kullanmayıp gereksiz bekleme üretmek
- gereksiz büyük payload’lar taşımak

---

# 23. UI Composition Performance

## 23.1. Kural

UI composition sade ve kontrollü olmalıdır.
Aşırı wrapper, gereksiz abstraction ve dengesiz composition performansı da etkiler.

## 23.2. Zayıf davranışlar

- çok derin ve anlamsız wrapper zinciri
- her küçük iş için yeni ağır abstraction
- primitive/component/pattern katmanlarını gereksiz şişirmek
- her şeyi “esnek” yapmak için performansı unutmak

---

# 24. Performance ve Accessibility Dengesi

## 24.1. Kural

Performans bahanesiyle accessibility kırılmaz.
Ama accessibility uygulaması da dikkatsiz yapılırsa performans yükü yaratabilir.

## 24.2. Dengeli yaklaşım

- doğru semantic kullanım
- gereksiz announcement spam’inden kaçınma
- focus yönetimini kontrollü kurma
- dynamic updates’i abartmama

## 24.3. Zayıf davranışlar

- a11y adına gereksiz ağır wrapper katmanları
- performans adına focus/label/announcement’ı kaldırmak
- dynamic type desteğini “layout bozuluyor” diye kapatmak

---

# 25. Performance ve Design System İlişkisi

## 25.1. Neden önemli?

Design system yanlış kurgulanırsa:
- her component ağırlaşır
- theme geçişleri pahalı olur
- varyant karmaşası render maliyeti üretir
- style resolution gereksiz büyür

## 25.2. Kural

Design system:
- tutarlı ama hafif olmalı
- sistem kuralları performans düşmanı olmamalı
- her bileşene aşırı polymorphic yapı yüklenmemeli
- token ve semantic kullanım verimli olmalı

---

# 26. Performance Anti-Pattern Listesi

Aşağıdaki davranışlar bu proje kapsamında zayıf kabul edilir:

1. Her şeyi startup yoluna koymak
2. Küçük UI state için geniş global render yüzeyi açmak
3. Büyük listeleri virtualization düşünmeden render etmek
4. Ağır hesapları render içine gömmek
5. Her loading için tam ekran blokaj kullanmak
6. Cache varken gereksiz fetch yapmak
7. Her mutation sonrası her şeyi refetch etmek
8. Gereksiz büyük asset kullanmak
9. Motion’u performans etkisini düşünmeden eklemek
10. Typing sırasında ağır validation yapmak
11. Navigation geçişlerinde bloklayıcı veri bağımlılıkları yaratmak
12. Aşırı wrapper/abstraction ile render maliyeti büyütmek
13. Prefetch’i kontrolsüz kullanmak
14. Arka plan işlerini kullanıcı deneyimini boğacak şekilde çalıştırmak
15. Performans sorunlarını ölçmeden “muhtemelen memo lazım” diye çözmeye çalışmak

---

# 27. Performance Kararı Verirken Sorulacak Sorular

Bir karar alınırken şu sorular sorulmalıdır:

1. Bu karar startup’ı etkiler mi?
2. Bu karar render yüzeyini büyütür mü?
3. Bu veri gerçekten şimdi mi gerekli?
4. Bu hesaplama render içinde mi yapılmalı?
5. Bu bileşen büyük listede kaç kez render edilir?
6. Bu state scope’u gereğinden büyük mü?
7. Bu asset gerçekten bu boyutta mı gerekli?
8. Bu motion kalite mi katıyor, yük mü?
9. Bu loading davranışı kullanıcıyı gereksiz bekletiyor mu?
10. Bu alan ölçülebilir mi, yoksa sadece tahmin mi yapıyoruz?
11. Bu optimizasyon gerçek problemi mi çözüyor, semptomu mu gizliyor?
12. Performans adına accessibility veya kalite kırılıyor mu?

---

# 28. Ölçüm ve Gözlem

## 28.1. Performans nasıl takip edilir?

En az şu düzeylerde düşünülmelidir:
- startup gözlemi
- screen transition gözlemi
- long list scroll gözlemi
- input responsiveness gözlemi
- network request davranışı
- cache/refetch örüntüsü
- memory risk alanları
- animation jank alanları

## 28.2. Kural

Performans hissi yalnızca geliştiricinin güçlü makinesinde değerlendirilmemelidir.
Gerçek cihaz, zayıf ağ ve yoğun kullanım senaryoları düşünülmelidir.

---

# 29. Sonraki Dokümanlara Etkisi

## 29.1. Testing strategy
`14-testing-strategy.md`, performans riskli alanlar için hangi test/gözlem yaklaşımının uygulanacağını bu belgeye göre sınıflandırmalıdır.

## 29.2. Quality gates and CI rules
`15-quality-gates-and-ci-rules.md`, hangi performans kontrollerinin merge öncesi zorunlu olacağını bu belgeyle uyumlu tanımlamalıdır.

## 29.3. Tooling and governance
`16-tooling-and-governance.md`, performans ihlallerinin audit ve kural sistemine nasıl taşınacağını detaylandırmalıdır.

## 29.4. Technology decision framework
`17-technology-decision-framework.md`, teknoloji seçimlerinde runtime maliyet, render etkisi, cache yeteneği ve asset davranışını bu belgeye göre değerlendirmelidir.

## 29.5. Observability and debugging
`28-observability-and-debugging.md`, runtime performans sinyallerini ve problem teşhis yollarını bu belgeyle uyumlu açmalıdır.

---

# 30. Onay Kriterleri

Bu doküman yeterli kabul edilir eğer:

1. Performans konusu yalnızca genel hız söylemi seviyesinde bırakılmamışsa,
2. Startup, transition, rendering, input, list, data, asset ve motion performansı ayrı ayrı ele alınmışsa,
3. Perceived performance ile gerçek runtime davranışı birlikte düşünülmüşse,
4. State, data ve UI composition kararlarının performans etkisi görünür kılınmışsa,
5. Anti-pattern’ler net biçimde tanımlanmışsa,
6. Ölçüm, gözlem ve audit ihtiyacı belirtilmişse,
7. Sonraki test, governance ve teknoloji karar dokümanlarına uygulanabilir çerçeve sağlanmışsa.

---

# 31. Kısa Sonuç

Bu dokümanın ana çıktısı şudur:

> Bu boilerplate kapsamında performans, sonradan yapılacak teknik rötuş değil; startup’tan form typing’e, route geçişlerinden liste scroll’una kadar tüm ürün deneyiminin akıcılığını, kararlılığını ve güven hissini belirleyen temel kalite standardıdır.

Bu nedenle bundan sonraki hiçbir doküman:
- performansı yalnızca benchmark konusu gibi ele alamaz,
- state ve render scope kararlarını önemsiz göremez,
- loading davranışını performanstan bağımsız tasarlayamaz,
- asset, motion ve data kararlarının runtime etkisini yok sayamaz,
- performans sorunlarını ölçmeden sezgisel mikro optimizasyonlarla kapatmaya çalışamaz.

---

# 32. New Architecture Performans Metrikleri (2026-04 Ekleme)

Expo SDK 55 ve React Native 0.83+ ile New Architecture (Fabric + JSI + TurboModules + Hermes V1) zorunlu hale gelmiştir. Bu bölüm, New Architecture'ın performans etkisini ölçülebilir metriklerle tanımlar.

## 32.1. Neden Bu Bölüm Gerekli?

Mevcut performans standardı (bu belgenin önceki bölümleri) runtime-agnostic kurallar tanımlar. Ancak New Architecture, performans profilini kökten değiştiren bir altyapı değişikliğidir. Eski bridge mimarisi ile New Architecture arasındaki farklar ölçülebilir ve bu farklar performans bütçelerini, beklentilerini ve audit kriterlerini doğrudan etkiler.

## 32.2. Cold Start Performansı

### Eski mimari (bridge):
- JavaScript kaynak kodu runtime'da parse edilir ve derlenir
- Tüm native modüller uygulama açılışında eager-load edilir
- Bridge üzerinden JSON serialization ile ilk iletişim kurulur
- Tipik cold start: 1.5-3 saniye (cihaz ve uygulama boyutuna göre)

### New Architecture (Hermes V1 + TurboModules):
- JavaScript bytecode'a derleme build-time'da yapılır (Hermes bytecode precompilation)
- TurboModules lazy-loaded olarak yalnızca kullanıldığında yüklenir
- JSI ile doğrudan C++ obje erişimi, serialization overhead yok
- Tipik cold start: 0.8-1.5 saniye (aynı koşullarda)
- **Beklenen iyileşme: %30-43**

### Ölçüm yöntemi:
- Flipper / React Native Performance Monitor ile cold start süresi ölçülmeli
- `AppStartup` custom Sentry span ile production'da izlenmeli
- Hedef: cold start < 1.5 saniye (orta segment cihaz, temiz açılış)

## 32.3. JS-to-Native İletişim Latansı

### Eski mimari (bridge):
- Her JS → Native çağrısı JSON serialization + deserialization gerektirir
- Mesajlar async batch olarak bridge queue üzerinden iletilir
- Tek çağrı latansı: 1-5ms (basit çağrı), 10-50ms (büyük payload)
- Yüksek frekanslı çağrılarda (gesture, animation) bottleneck oluşur

### New Architecture (JSI):
- JS ve Native aynı bellek alanını paylaşır (shared memory through JSI host objects)
- Senkron çağrı mümkün (gerektiğinde)
- Serialization overhead yok
- Tek çağrı latansı: 0.01-0.1ms
- **Beklenen iyileşme: 10-100x daha hızlı iletişim**

### Kural:
- Yoğun JS-Native iletişimi gereken alanlar (gesture handler, animation driver, kamera, sensörler) JSI tabanlı kütüphanelerle çözülmeli
- Bridge-only kütüphaneler bu alanlarda kullanılmamalı (performans regresyonu yaratır)

## 32.4. UI Thread Frame Budget

### Hedef:
- 60 FPS garanti → her frame için 16.67ms bütçe
- 120 FPS (ProMotion cihazlar) → her frame için 8.33ms bütçe

### Fabric renderer etkileri:
- **View flattening:** Fabric, gereksiz wrapper view'ları otomatik olarak düzleştirir. Bu, view hierarchy derinliğini azaltır ve layout hesaplama süresini kısaltır. Eski mimaride manuel optimizasyon gerektiren bu süreç Fabric'te otomatiktir.
- **Concurrent rendering desteği:** React 18/19 concurrent features (useTransition, useDeferredValue) ile ağır render işleri düşük öncelikli olarak planlanabilir. UI thread bloklama riski azalır.
- **Priority-based rendering:** Fabric, render işlerini öncelik sırasına göre planlar. Kullanıcı etkileşimleri (touch, scroll) en yüksek önceliklidir.

### Ölçüm yöntemi:
- React DevTools Profiler ile component render süreleri
- Flipper Performance plugin ile frame timing
- Production'da Sentry slow frame / frozen frame metrikleri
- Hedef: slow frame oranı < %5, frozen frame oranı < %1

## 32.5. TurboModules Bellek Footprint

### Eski mimari:
- Tüm native modüller uygulama başlangıcında belleğe yüklenir (eager initialization)
- 20 native modül = 20 modülün tamamının bellek maliyeti startup'ta ödenir
- Kullanılmayan modüller de bellekte yer kaplar

### New Architecture (TurboModules):
- Native modüller lazy-loaded: yalnızca ilk kullanımda belleğe yüklenir
- Kullanılmayan modüller bellek tüketmez
- **Beklenen bellek tasarrufu: %10-25 (native modül sayısına bağlı)**

### Kural:
- Uygulama başlangıcında gereksiz native modül import'u yapılmamalı
- Heavy native modüller (kamera, harita, ML) yalnızca ilgili ekrana gelindiğinde yüklenecek şekilde yapılandırılmalı
- Bellek kullanımı production'da Sentry veya custom metric ile izlenmeli

## 32.6. Benchmark Referans Tablosu

| Metrik | Eski Mimari (Bridge) | New Architecture | İyileşme |
|--------|---------------------|-----------------|----------|
| Cold start (orta segment) | 2-3 saniye | 1-1.5 saniye | %30-50 |
| JS→Native tek çağrı | 1-5ms | 0.01-0.1ms | 10-100x |
| Native modül init (20 modül) | Hepsi startup'ta | Lazy-loaded | %10-25 bellek |
| 60 FPS scroll (1000 item) | Sık jank | Minimal jank | Ölçülebilir |
| Gesture response | 16-32ms delay | <1ms delay | Hissedilir |
| Bundle parse süresi | Runtime parse | Precompiled bytecode | %40-60 |

### Kural:
Bu metrikler rehber niteliğindedir. Her proje kendi baseline benchmark'ını almalı ve performans regresyonlarını CI'da izlemelidir.

## 32.7. Performans Audit Checklist (New Architecture Spesifik)

1. [ ] Cold start süresi ölçüldü mü? (hedef: < 1.5s orta segment)
2. [ ] Hermes bytecode precompilation aktif mi?
3. [ ] Bridge-only paket var mı? (performans bottleneck riski)
4. [ ] TurboModules lazy-loading çalışıyor mu?
5. [ ] Fabric view flattening etkin mi?
6. [ ] Slow frame / frozen frame oranları izleniyor mu?
7. [ ] JS→Native iletişim yoğun alanlarda JSI tabanlı kütüphane kullanılıyor mu?
8. [ ] Bellek kullanımı startup sonrası ölçülüyor mu?
9. [ ] React DevTools Profiler ile render süreleri kontrol edildi mi?
10. [ ] Production'da Sentry performance monitoring aktif mi?

---

# 33. New Architecture Performans Benchmark'ları

JSI (JavaScript Interface), Fabric renderer ve Hermes engine ile New Architecture'ın sağladığı performans iyileşmeleri bu bölümde somut benchmark'larla tanımlanır.

## 33.1. Benchmark Karşılaştırma Tablosu

| Metrik | Old Architecture (Bridge) | New Architecture (JSI/Fabric) | Yaklaşık İyileşme |
|--------|--------------------------|------------------------------|-------------------|
| Cold start (JS init) | ~800ms | ~600ms | ~%25 |
| JS-Native call latansı | ~5ms (bridge, async batch) | ~0.1ms (JSI, sync direct call) | ~%98 |
| Render throughput | 16ms/frame (bridge serialization) | 12ms/frame (Fabric direct) | ~%25 |
| Memory (Hermes GC) | Sabit GC overhead | Incremental GC, düşük pause | ~%15 azalma |
| Bundle parse süresi | Runtime JS parse | Hermes bytecode precompiled | ~%30 iyileşme |
| TurboModules startup | Tüm native modüller eager load | Lazy loading (ilk kullanımda yükle) | ~%20 startup iyileşme |
| View hierarchy | Manuel optimization gerekli | Fabric view flattening otomatik | Layout hesaplama hızlanması |
| Gesture response | 16-32ms delay (bridge round-trip) | <1ms delay (JSI direct) | Hissedilir iyileşme |

**Not:** Bu değerler yaklaşıktır ve orta segment cihazlarda (iPhone 12, Pixel 6 benzeri) alınmış benchmark verilerine dayanır. Gerçek değerler uygulamanın boyutuna, native modül sayısına ve component ağacı derinliğine göre değişir.

## 33.2. Proje-Spesifik Benchmark Alma

CI'da proje-spesifik benchmark verilerinin alınması zorunludur:

1. **Baseline oluşturma:** İlk bootstrap sonrası cold start, render throughput ve memory metrikleri ölçülür.
2. **Sprint bazlı karşılaştırma:** Her sprint sonunda baseline ile karşılaştırma yapılır.
3. **Araçlar:**
   - Cold start: `react-native-performance` veya custom startup metric (Sentry transaction)
   - Render: React DevTools Profiler + Sentry slow frame/frozen frame metrikleri
   - Memory: Xcode Instruments (iOS), Android Profiler, Sentry memory monitoring
4. **Hedefler:**
   - Cold start < 1.5s (orta segment cihaz)
   - Slow frame oranı < %5
   - Frozen frame oranı < %1
   - JS heap memory < 150MB (normal kullanım)

## 33.3. Bridge-Only Paket Riski

New Architecture'da bridge üzerinden çalışan (JSI desteği olmayan) paketler performans darboğazı oluşturur:

- Bridge-only paketler interop layer üzerinden çalışır; JSI avantajlarından yararlanamaz.
- Her yeni dependency eklenmesinde `37-dependency-policy.md` gereği New Architecture uyumluluğu kontrol edilir.
- CI'da bridge-only paket tespiti uyarı üretir; alternatif JSI-uyumlu paket varsa geçiş planlanır.

---

# 34. Performance Regression CI Entegrasyonu

PR bazında performans regresyon testi ile performans kaybı erken aşamada tespit edilir.

## 34.1. Araç Seçimi

- **reassure (Callstack):** React Native component render performansını ölçer. `measurePerformance` API'si ile kritik component'lerin render süresi ve re-render sayısı benchmark alınır.
- **Alternatif:** flashlight — daha geniş kapsamlı performans profiling.

## 34.2. Ölçülen Metrikler

| Metrik | Açıklama | Ölçüm Aracı |
|--------|---------|-------------|
| Render süresi | Component'in mount ve re-render süresi (ms) | reassure `measurePerformance` |
| Re-render sayısı | Bir interaction sonrası gerçekleşen re-render sayısı | reassure `measureRenders` |
| FPS | Animasyon ve scroll sırasında frame rate | Flipper Performance plugin |
| Bundle boyutu | JS bundle dosya boyutu (KB) | `react-native-bundle-visualizer` |

## 34.3. CI Akışı

1. **Base branch benchmark:** CI, base branch (main) üzerinde kritik component'lerin benchmark'ını alır.
2. **PR branch benchmark:** Aynı component'lerin PR branch üzerinde benchmark'ı alınır.
3. **Karşılaştırma raporu:** İki benchmark karşılaştırılır ve fark yüzdesi hesaplanır.
4. **PR comment:** Karşılaştırma sonucu PR'a otomatik markdown tablosu olarak yorum eklenir.

## 34.4. Regresyon Eşikleri

| Regresyon Seviyesi | Eşik | CI Davranışı |
|-------------------|------|-------------|
| Kabul edilebilir | <%10 | Bilgi — PR'da gösterilir, bloklama yok |
| Uyarı | %10 - %25 | Sarı uyarı — reviewer dikkatine sunulur |
| Blocker | >%25 | Kırmızı hata — PR merge bloklenir |

## 34.5. reassure Konfigürasyonu

```typescript
// reassure.setup.ts
import { measurePerformance } from 'reassure';

// Kritik component'ler için benchmark
test('Button render performansı', async () => {
  await measurePerformance(<Button label="Test" onPress={() => {}} />);
});

test('FlatList 100 item render performansı', async () => {
  await measurePerformance(<ItemList items={generate100Items()} />);
});
```

## 34.6. Raporlama Formatı

PR'a eklenen otomatik yorum örneği:

```markdown
## Performans Raporu

| Component | Base (ms) | PR (ms) | Fark | Durum |
|-----------|----------|---------|------|-------|
| Button    | 2.1      | 2.3     | +%9  | Kabul |
| ItemList  | 45.2     | 48.1    | +%6  | Kabul |
| LoginForm | 12.3     | 18.7    | +%52 | BLOCKER |
```

---

# 35. Startup Time Metrikleri ve Bütçesi

Uygulama başlangıç süresi, kullanıcı algısını doğrudan etkileyen en kritik performans metriklerinden biridir. Bu bölüm, cold start ve warm start süreleri için somut hedefler, ölçüm yöntemleri ve CI gate tanımları sağlar.

## 35.1. Tanımlar

- **Cold start:** Uygulama bellekte değilken sıfırdan başlatılması. İşletim sistemi process oluşturma, Hermes engine başlatma, JavaScript bundle yükleme, React tree mount ve ilk anlamlı ekranın render edilmesini kapsar.
- **Warm start:** Uygulama arka plana alınmış ve bellekte hâlâ mevcutken tekrar ön plana getirilmesi.
- **Time to Interactive (TTI):** İlk anlamlı ekranın render edildiği ve kullanıcının etkileşim yapabilir hale geldiği an.

## 35.2. Hedef Bütçeler

### 35.2.1. Mobile (React Native + Expo)

| Metrik | Hedef (Wi-Fi/4G) | Uyarı Eşiği | Blocker Eşiği |
|--------|-------------------|-------------|---------------|
| Cold start → TTI | < 1.5s | 1.5s – 2.5s | > 2.5s |
| Warm start → TTI | < 500ms | 500ms – 1s | > 1s |
| JS bundle parse | < 300ms | 300ms – 500ms | > 500ms |
| Hermes bytecode load | < 100ms | 100ms – 200ms | > 200ms |
| Splash screen süresi | < 2s (toplam) | — | > 3s |

### 35.2.2. Web (React + Vite)

| Metrik | Hedef (4G) | Hedef (3G) | Blocker |
|--------|------------|------------|---------|
| First Contentful Paint (FCP) | < 1s | < 2s | > 3s |
| Largest Contentful Paint (LCP) | < 1.5s | < 3s | > 4s |
| Time to Interactive (TTI) | < 2s | < 4s | > 5s |
| Cumulative Layout Shift (CLS) | < 0.1 | < 0.1 | > 0.25 |

## 35.3. Ölçüm Yöntemleri

### 35.3.1. Mobile Startup Ölçümü

```typescript
// app.config.ts veya App.tsx — startup marker örneği
import * as SplashScreen from 'expo-splash-screen';

const appStartTime = global.performance.now();

// İlk anlamlı ekran render edildiğinde:
function onAppReady() {
  const startupTime = global.performance.now() - appStartTime;
  console.log(`[STARTUP] Cold start: ${startupTime.toFixed(0)}ms`);
  
  // Sentry performance transaction
  Sentry.startTransaction({ name: 'app.startup', op: 'startup' });
  
  SplashScreen.hideAsync();
}
```

### 35.3.2. Web Startup Ölçümü

- Lighthouse CI: Her PR'da otomatik Lighthouse raporu
- Web Vitals SDK: FCP, LCP, TTI, CLS metrikleri Sentry'ye raporlanır
- Vite bundle analyzer: Chunk boyut analizi

## 35.4. Startup Performansını Etkileyen Faktörler

1. **Hermes bytecode precompilation:** Hermes V1 (ADR-018) JavaScript'i build zamanında bytecode'a derler; runtime parse süresi neredeyse sıfırdır. Bu avantajın korunması için raw JS eval kullanımından kaçınılmalıdır.
2. **TurboModules lazy loading:** Native modüller ilk kullanımda yüklenir (ADR-018). Başlangıçta gereksiz modül import'u startup'ı yavaşlatır.
3. **Zustand store hydration:** MMKV senkron okuma sağlar (ADR-019); bu hydration süresini minimumda tutar. AsyncStorage kullanılsaydı hydration 50-150ms daha uzun sürerdi.
4. **Splash screen stratejisi:** Splash screen, startup süresini gizlemek içindir. Ancak splash screen'in kendisi uzun olmamalıdır (max 2s). Asset yükleme splash altında yapılabilir.
5. **Bundle boyutu:** Büyük bundle = uzun parse/load süresi. Code splitting ve lazy import ile azaltılır.

## 35.5. CI Gate Entegrasyonu

Startup metrikleri şu aşamada CI gate olarak uygulanmaz; ancak izleme zorunludur:

- **Phase 1 (bootstrap):** Startup süreleri Sentry'ye raporlanır, baseline oluşturulur
- **Phase 2 (stabilizasyon):** Baseline'dan >%25 sapma sarı uyarı üretir
- **Phase 3 (olgunluk):** Blocker eşiği aşımında PR merge engellenir

---

# 36. App Size Optimization Stratejisi

Uygulama boyutu, indirme oranını, güncelleme hızını ve cihaz depolama algısını doğrudan etkiler. Bu bölüm binary boyut bütçesi, optimizasyon teknikleri ve ölçüm yöntemlerini tanımlar.

## 36.1. Boyut Bütçesi

| Platform | Metrik | Hedef | Uyarı | Blocker |
|----------|--------|-------|-------|---------|
| iOS | IPA boyutu (App Store thinned) | < 50 MB | 50-80 MB | > 80 MB |
| Android | APK / AAB (universal) | < 30 MB | 30-50 MB | > 50 MB |
| Web | İlk yükleme (gzip) | < 200 KB JS + < 100 KB CSS | 300-500 KB | > 500 KB |

**Not:** Mobile boyutlar App Store / Play Store'un uyguladığı thinning (bitcode stripping, ABI split, asset slicing) sonrası boyutlardır. Universal build boyutu bu hedeflerin üstünde olabilir.

## 36.2. Hermes Bytecode Optimizasyonu

Hermes V1 (ADR-018) JavaScript'i bytecode'a derler. Bytecode boyutu source JS'ten genellikle daha küçüktür ancak optimize edilebilir:

- **Tree shaking:** Kullanılmayan export'lar bundle'dan çıkarılır (Metro bundler default)
- **Minification:** Metro minifier ile değişken isimleri kısaltılır
- **Dead code elimination:** `__DEV__` flag'i ile development-only kod production'dan çıkarılır
- **Inline requires:** Metro `inlineRequires` ile lazy module loading, bytecode segmentasyonunu iyileştirir

## 36.3. Native Binary Optimizasyonu

### 36.3.1. Android

- **ProGuard / R8:** Release build'de zorunlu aktif. Kullanılmayan Java/Kotlin sınıflarını kaldırır ve bytecode optimize eder.
- **ABI split:** `abiFilters` ile arm64-v8a, armeabi-v7a, x86_64 ayrı APK'lar üretilir. AAB formatında Google Play bu işi otomatik yapar.
- **Resource shrinking:** `shrinkResources true` ile kullanılmayan drawable, layout ve string resource'ları kaldırılır.
- **Native library stripping:** Debug symbol'ler release build'den çıkarılır.

### 36.3.2. iOS

- **Bitcode:** Xcode 16+ ile bitcode artık desteklenmemektedir; App Store thinning diğer mekanizmalarla sağlanır.
- **Asset Catalog optimization:** Xcode asset catalog'u platform ve cihaz çözünürlüğüne göre otomatik slice eder.
- **Strip debug symbols:** Release build'de debug symbol'ler ayrı dSYM dosyasına taşınır (Sentry source map için gerekli).

## 36.4. Asset Optimizasyonu

| Asset Türü | Format | Maksimum Boyut | Araç |
|------------|--------|----------------|------|
| Fotoğraf/görsel | WebP (iOS 14+, Android 4.2.1+) | Tek görsel < 200 KB | sharp, squoosh |
| İkon | SVG (web), PNG (mobile) veya react-native-svg | SVG < 5 KB | svgo |
| Font | woff2 (web), OTF/TTF (mobile) | Subset < 100 KB | glyphhanger, fonttools |
| Animasyon (Lottie) | Lottie JSON | Tek animasyon < 50 KB | bodymovin optimizer |
| Video | HLS/DASH streaming | Bundled video yasak | CDN streaming |

**Kurallar:**
- Bundled video dosyası yasaktır; video CDN üzerinden stream edilir
- Font subsetting zorunludur; kullanılmayan glyph'ler font dosyasından çıkarılır
- Lottie animasyonları 50 KB üstündeyse lazy load edilir
- Görseller 2x/3x çözünürlük setleri olarak sağlanır; cihaz yalnızca uygun olanı indirir

## 36.5. Code Splitting ve Lazy Loading

### 36.5.1. Web

- Route-based code splitting: `React.lazy()` + `Suspense` ile her route ayrı chunk olarak yüklenir
- Component-level lazy loading: Ağır component'ler (ör: chart, rich editor) dinamik import edilir
- Vite chunk stratejisi: Vendor chunk, common chunk ve route chunk'lar ayrılır

### 36.5.2. Mobile

- Metro `inlineRequires`: Modüller ilk kullanımda yüklenir
- Conditional require: Platform-specific kod `Platform.select` ile koşullu yüklenir
- Expo Router lazy: Ekranlar navigasyon anında yüklenir

## 36.6. Ölçüm ve İzleme

- **EAS Build boyut raporu:** Her build sonrası binary boyut loglanır
- **Vite bundle analyzer:** `npx vite-bundle-visualizer` ile web bundle analizi
- **Metro bundle analyzer:** `npx react-native-bundle-visualizer` ile mobile bundle analizi
- **expo-doctor:** Expo uyumluluk ve boyut kontrolü
- **CI trend takibi:** Her PR'da önceki build ile boyut karşılaştırması yapılır; >%10 artış sarı uyarı üretir

## 36.7. Anti-pattern'ler

- Büyük görsel dosyalarını (>500 KB) bundle'a dahil etmek — CDN kullan
- Kullanılmayan dependency'leri kaldırmamak — `depcheck` ile periyodik kontrol
- Tüm Lottie animasyonlarını eager load etmek — lazy load ve boyut limiti uygula
- Font dosyasının tamamını (tüm weight, tüm glyph) bundle'a dahil etmek — subset kullan
- Development dependency'lerinin production bundle'a girmesi — `devDependencies` doğru sınıflandır
