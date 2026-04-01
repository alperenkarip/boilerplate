# 26-platform-adaptation-rules.md

## Doküman Kimliği

- **Doküman adı:** Platform Adaptation Rules
- **Dosya adı:** `26-platform-adaptation-rules.md`
- **Doküman türü:** Standard / cross-platform governance / adaptation decision document
- **Durum:** Accepted
- **Kapsam:** Bu boilerplate kapsamında web ve mobil arasında hangi alanlarda aynı davranış ve kalite beklentisinin korunması gerektiğini, hangi alanlarda kontrollü farklılaşmaya izin verildiğini, platform adaptation kararlarının hangi kriterlerle verileceğini, behavior parity / design parity / implementation parity ayrımını, platform-specific farkların nasıl gerekçelendirileceğini ve hangi farkların kabul edilemez olduğunu tanımlar.
- **Bağlı olduğu üst dokümanlar:**
  - `00-project-charter.md`
  - `01-working-principles.md`
  - `02-product-platform-philosophy.md`
  - `03-ui-ux-quality-standard.md`
  - `06-application-architecture.md`
  - `08-navigation-and-flow-rules.md`
  - `11-forms-inputs-and-validation.md`
  - `12-accessibility-standard.md`
  - `17-technology-decision-framework.md`
  - `21-repo-structure-spec.md`
  - `24-motion-and-interaction-standard.md`
  - `25-error-empty-loading-states.md`
  - `ADR-007-styling-tokens-and-theming-implementation.md`
- **Doğrudan etkileyeceği dokümanlar:**
  - `30-contribution-guide.md`
  - `31-audit-checklist.md`
  - `32-definition-of-done.md`
  - `33-visual-implementation-contract.md`
  - `34-hig-enforcement-strategy.md`
  - `35-document-map.md`

---

# 1. Amaç

Bu dokümanın amacı, cross-platform geliştirmede en sık yapılan iki büyük hatayı aynı anda engellemektir:

1. **Her şeyi iki platformda birebir aynı yapmaya çalışmak**
2. **Web ve mobil için iki ayrı, kopuk ve kalite seviyesi farklı ürün üretmek**

Bu belge şu sorulara net cevap verir:

1. Platform adaptation bu projede tam olarak ne demektir?
2. Hangi şeyler web ve mobil arasında aynı kalmalıdır?
3. Hangi alanlarda farklılaşmak doğrudur?
4. Hangi farklar platform saygısıdır, hangileri kalite bozulmasıdır?
5. Behavior parity, design parity ve implementation parity neden ayrı ayrı düşünülmelidir?
6. Bir platform farkının gerçekten gerekli olup olmadığı nasıl anlaşılır?
7. Hangi farklar dokümante edilmelidir, hangileri yalnızca teknik detail seviyesinde kalabilir?
8. Hangi adaptation davranışları doğrudan zayıf kabul edilir?

Bu belge “web başka, mobil başka” kolaycılığını da reddeder,  
“tek kod, tek layout, tek interaction” körlüğünü de reddeder.

Buradaki hedef şudur:

> Aynı ürün mantığını, aynı kalite standardını ve aynı marka/dizayn dilini; her platformun ergonomisine saygılı, ama kaliteyi düşürmeyen biçimde uygulamak.

---

# 2. Neden Bu Doküman Gerekli

Cross-platform ürünlerde platform adaptation açık yazılmazsa genellikle şu bozulmalar oluşur:

- web’de akıcı olan görev mobilde sakatlanmış hale gelir,
- mobilde doğal olması gereken akış web’e kör kopyalanır,
- aynı feature iki platformda farklı zihinsel modelle çalışır,
- design system ortak görünür ama gerçek davranış kopar,
- web daha güçlü, mobil daha “kesilmiş sürüm” haline gelir,
- platform-specific farklar belgelenmeden çoğalır,
- implementation rahatlığı, ürün doğruluğunun önüne geçer,
- shared code oranı başarı metriği sanılır,
- bir platformdaki zayıf UX, “platform gereği” diye meşrulaştırılır,
- parity tartışmaları bulanıklaşır çünkü kimse behavior/design/implementation ayrımı yapmaz.

Bu proje kapsamında platform adaptation, estetik tercih konusu değildir.  
Bu belge olmadan çapraz platform ürünler çoğu zaman iki ayrı kalite çizgisine ayrılır.

---

# 3. Temel Tez

Bu proje kapsamında temel tez şudur:

> Cross-platform adaptation, aynı ürünü iki platformda kör kopya yapmak değildir; ürünün temel görev mantığını, kalite standardını, erişilebilirlik seviyesini ve tasarım dilini korurken, platform ergonomisi, input modeli, bilgi yoğunluğu ve runtime doğasına göre bilinçli, sınırlı ve gerekçeli farklılaşmalar yapma disiplinidir.

Bu tez şu sonuçları doğurur:

1. Davranış eşliği, piksel birebir eşlikten daha önemlidir.
2. Platform-specific farklar serbest değil, gerekçeli olmalıdır.
3. Her implementasyon farkı ürün farkı değildir.
4. Her platformda aynı component ağacı kurmak başarı metriği değildir.
5. Platforma saygı, kaliteyi düşürme bahanesi olamaz.
6. Farklılaşma kararı savunulabilir ve denetlenebilir olmalıdır.

---

# 4. Parity Türleri: En Kritik Ayrım

Bu proje kapsamında parity üç ayrı düzeyde ele alınmalıdır:

1. **Behavior parity**
2. **Design parity**
3. **Implementation parity**

Bu ayrım yapılmazsa ekip yanlış tartışmalar yapar ve yanlış karar alır.

---

# 5. Behavior Parity

## 5.1. Tanım

Behavior parity, kullanıcının aynı ürün içindeki aynı görevi web ve mobilde temel olarak aynı sonuç mantığıyla tamamlayabilmesidir.

## 5.2. Neleri kapsar?

- görev sırası
- beklenen sonuç
- kaydetme / iptal / submit davranışı
- recovery mantığı
- kritik validation ve permission davranışı
- loading / empty / error semantiği
- destructive action confirmation modeli
- aynı domain kuralının aynı şekilde uygulanması
- aynı feature’ın temel yeteneğinin korunması

## 5.3. Örnek

Kullanıcı bir listeyi filtreleyebiliyorsa:
- web’de filtreler panel olarak açılabilir,
- mobilde sheet olarak açılabilir,
ama **filtre uygulama mantığı, sonucu ve reset davranışı** aynı ürün mantığını taşımalıdır.

## 5.4. Kural

Behavior parity varsayılan önceliktir.  
Bir feature iki platformda ciddi farklı görev modeli taşıyorsa bu normal fark değil, özel karar sayılmalı ve gerekçelendirilmelidir.

## 5.5. Zayıf davranışlar

- web’de yapılabilen kritik işlemin mobilde olmaması
- mobilde save davranışının, web’deki save semantiğinden farklı olması
- bir platformda retry varken diğerinde yalnızca çıkış yolunun olması
- aynı validasyon kuralının iki platformda farklı çalışması
- bir platformda autosave varken diğerinde veri kaybı olması

---

# 6. Design Parity

## 6.1. Tanım

Design parity, iki platformun aynı ürün ailesine ait olduğunun açıkça hissedilmesidir.

## 6.2. Neleri kapsar?

- renk semantiği
- spacing ritmi
- typography hiyerarşisi
- surface/border dili
- feedback state tonu
- bilgi yoğunluğu yaklaşımı
- CTA öncelik mantığı
- premium hissiyat
- component family karakteri

## 6.3. Kural

Design parity, birebir piksel eşitliği değildir.  
Ama kullanıcı web ve mobile baktığında bunların aynı ürün olduğunu tereddütsüz anlamalıdır.

## 6.4. Zayıf davranışlar

- web’de keskin ve düzenli, mobilde yumuşak ve rastgele görsel dil
- farklı token mantıkları
- farklı hierarchy yorumları
- aynı component ailesinin platforma göre başka marka dili konuşması
- primary action’ın iki platformda farklı görsel ağırlıkta olması

---

# 7. Implementation Parity

## 7.1. Tanım

Implementation parity, aynı davranışı iki platformda ne kadar ortak teknik yapıyla çözdüğümüzle ilgilidir.

## 7.2. Neden tehlikeli başarı metriği olabilir?

Çünkü ekipler sık şu hataya düşer:
“Yüzde 90 shared code yaptık, mimari başarılı.”

Bu tek başına anlamlı değildir.  
Yanlış yerde paylaşılan kod:
- UX’i bozar,
- platform ergonomisini kırar,
- debug maliyetini artırır,
- gereksiz adapter cehennemi üretir.

## 7.3. Kural

Implementation parity önemli olabilir.  
Ama **behavior parity ve quality parity**’nin önüne asla geçemez.

## 7.4. Doğru yaklaşım

- ortak olması gerekeni ortaklaştır
- platform-specific olması gerekeni bilinçli ayır
- paylaşım oranı değil, doğru paylaşım hedefle

## 7.5. Zayıf davranışlar

- mobil ergonomisini bozarak web ile aynı component ağacını zorlamak
- web deneyimini daraltarak mobile uyarlamasına göre sistemi kurmak
- route/state/layout farklarını sırf shared code uğruna hack ile çözmek
- implementation parity’yi KPI yapmak

---

# 8. Adaptation Kararı Nasıl Verilmelidir?

Bir platform farkı ihtiyacı doğduğunda şu sıra izlenmelidir:

1. Bu fark gerçekten gerekli mi?
2. Problem behavior seviyesinde mi, presentation seviyesinde mi?
3. Behavior parity bozulmadan presentation farkı ile çözülebilir mi?
4. Bu fark gerçek platform ergonomisi mi, yoksa implementasyon rahatlığı mı?
5. Bu fark design parity’yi zedeliyor mu?
6. Bu fark a11y veya performance riski yaratıyor mu?
7. Bu fark geçiciyse neden kalıcı yapılıyor?
8. Bu fark için ADR veya doküman güncellemesi gerekir mi?

Bu sıra atlanmamalıdır.

---

# 9. Platform Adaptasyon Alanları

Bu proje kapsamında adaptation en çok şu alanlarda gündeme gelir:

1. Navigation chrome
2. Layout density
3. Input and keyboard behavior
4. Hover vs touch feedback
5. Modal / dialog / sheet sunumu
6. Data-dense surfaces
7. Gesture kullanımı
8. Selection mechanics
9. Feedback states presentation
10. Secondary action exposure
11. Scrolling behavior
12. File/media/system integration
13. Context preservation and restore behavior
14. Multi-pane vs stacked flows

Her biri ayrı ele alınmalıdır.

---

# 10. Navigation Chrome Adaptasyonu

## 10.1. Neden farklılaşabilir?

Web daha geniş yatay alan sunar.  
Sidebar, multi-pane, top navigation ve side panel ergonomisi güçlü olabilir.

Mobilde:
- stack navigation,
- tab bar,
- sheet,
- full-screen modal
daha doğal olabilir.

## 10.2. Kabul edilebilir farklar

- web’de sidebar, mobilde tab bar
- web’de side panel, mobilde push veya sheet
- web’de master-detail, mobilde stacked detail
- web’de persistent navigation, mobilde compact navigation chrome

## 10.3. Kabul edilemez farklar

- bir platformda aynı göreve ulaşmak için gereksiz fazla adım
- bir platformda geri davranışının belirsiz olması
- web’de visible context varken mobilde yanlış kaybolan context
- bir platformda deep link ile girilebilen yere diğerinde dolaylı erişim zorunluluğu

## 10.4. Kural

Navigation chrome platforma göre farklılaşabilir.  
Ama task model, yön duygusu ve recoverability bozulmamalıdır.

---

# 11. Layout Density Adaptasyonu

## 11.1. Neden gerekir?

Web aynı anda daha çok bağlam taşıyabilir.  
Mobil daha dar yüzeyde daha odaklı, kademeli ve dikey akışlı olmak zorundadır.

## 11.2. Kabul edilebilir farklar

- web’de daha yoğun tablo veya panel düzeni
- mobilde aynı bilgiyi progressive disclosure ile sunmak
- web’de aynı anda iki panel, mobilde drill-down
- web’de shortcut action’ların daha görünür olması

## 11.3. Kabul edilemez farklar

- mobilde kritik bağlamı tamamen saklamak
- web’de yoğunluk bahanesiyle erişilebilirliği bozmak
- küçük ekranda tüm bilgiyi kör sıkıştırmak
- büyük ekranda anlamsız boşluk yüzünden bilgi dağınıklığı oluşturmak

## 11.4. Kural

Yoğunluk farklı olabilir.  
Ama kalite seviyesi farklı olamaz.

---

# 12. Input ve Keyboard Adaptasyonu

## 12.1. Web tarafı öncelikleri

- keyboard navigation
- tab order
- focus visibility
- hover/focus ayrımı
- enter/escape davranışı
- text selection rahatlığı
- pointer ergonomisi

## 12.2. Mobil tarafı öncelikleri

- soft keyboard behavior
- input görünürlüğü
- safe area ve bottom inset
- next/done/go semantics
- one-hand ergonomi
- scroll into view behavior
- sheet/modal içinde field davranışı

## 12.3. Kabul edilebilir farklar

- web’de keyboard shortcut destekleri
- mobilde input accessory / next flow
- web’de inline edit, mobilde full-screen edit step
- mobilde sheet tabanlı seçim, web’de dialog/list kombinasyonu

## 12.4. Kabul edilemez farklar

- web’de keyboard ile kullanılamayan kritik form
- mobilde keyboard açılınca field’ların görünmez kalması
- bir platformda helper/error açık, diğerinde kayıp
- submit davranışının platformlar arasında ürün mantığı açısından değişmesi

---

# 13. Hover, Pointer ve Touch Adaptasyonu

## 13.1. Temel ilke

Web pointer-first olabilir.  
Mobil touch-first’tür.

## 13.2. Sonuç

- web’de hover affordance ve discoverability aracıdır
- mobilde hover’ın birebir karşılığı yoktur
- mobilde press feedback ve explicit affordance daha önemlidir

## 13.3. Kabul edilebilir farklar

- web’de hover ile action reveal
- mobilde aynı action için explicit kebab/menu/swipe affordance
- web’de tooltip
- mobilde info icon / inline helper / sheet info

## 13.4. Kabul edilemez farklar

- kritik bilgi yalnızca hover’da görünüyorsa
- action yalnızca hover ile keşfediliyorsa
- mobilde karşılığı olmayan pointer micro-interaction’a güveniliyorsa
- hover state’i selected state yerine kullanılıyorsa

---

# 14. Modal / Dialog / Sheet Adaptasyonu

## 14.1. Web’de güçlü yüzeyler

- dialog
- side panel
- inline expansion
- split context overlays

## 14.2. Mobilde güçlü yüzeyler

- bottom sheet
- full-screen modal
- stacked screen
- compact action sheet

## 14.3. Kural

Yüzey farklı olabilir.  
Ama şu alanlar korunmalıdır:
- görevin kapsamı
- dismiss mantığı
- focus/return behavior
- destructive confirmation seviyesi
- kullanıcı yön duygusu

## 14.4. Kabul edilemez farklar

- web’de explicit confirmation varken mobilde anında destructive action
- mobilde sıkışık sheet’e yanlış karmaşık form sıkıştırmak
- web’de side panel için doğru olan akışı mobilde gereksiz küçük dialog’a zorlamak
- aynı görev için iki platformda farklı risk semantiği kurmak

---

# 15. Data-Dense Surfaces Adaptasyonu

## 15.1. Kapsam

- tables
- dashboards
- analytics/reporting views
- inventory / listing grids
- comparison surfaces
- filter-heavy search experiences

## 15.2. Web’de kabul edilebilir güçlenmeler

- multi-column layouts
- persistent filter panel
- side-by-side detail
- inline row actions
- denser overview summaries

## 15.3. Mobilde kabul edilebilir dönüşümler

- cards/list adaptation
- progressive drill-down
- bottom sheet filters
- stacked detail
- sectioned info reveal

## 15.4. Kural

Bilgi yeniden paketlenebilir.  
Ama görevin özü, kritik data noktaları ve işlem gücü kaybedilemez.

## 15.5. Zayıf davranışlar

- mobilde feature’ın yarısını görünmez yapmak
- web’de tablo bahanesiyle okunabilirliği yok etmek
- mobilde çok adım ekleyip görevi gereksiz pahalılaştırmak
- dense surface adaptation’ı “keselim, geçelim” mantığına çevirmek

---

# 16. Gesture Adaptasyonu

## 16.1. Mobilde meşru gesture alanları

- swipe actions
- sheet dismiss
- pull to refresh
- drag reordering
- edge back
- press-and-hold contextual affordances

## 16.2. Web’de meşru karşılıklar

- pointer/keyboard explicit actions
- drag/drop (uygunsa)
- shortcut actions
- hover/action menus

## 16.3. Kural

Gesture platform-specific olabilir.  
Ama kritik işlevler tek gizli hareketle sınırlı bırakılamaz.

## 16.4. Kabul edilemez farklar

- mobilde sadece swipe ile erişilen kritik action
- web’de yalnızca drag ile yapılabilen ama alternatifi olmayan işlem
- gesture failure sonrası recovery olmaması
- destructive gesture’ların aşırı kolay tetiklenmesi

---

# 17. Feedback State Adaptasyonu

## 17.1. Loading

Web’de section-level ve panel-level loading daha görünür olabilir.  
Mobilde daha bloklu ama yine kontrollü loading gerekebilir.

## 17.2. Empty

True empty, first-use empty, filtered empty ayrımı iki platformda da korunmalıdır.

## 17.3. Error

Error semantiği aynı kalmalıdır.  
Sunum, yoğunluk ve yerleşim farklı olabilir.

## 17.4. Success

Success feedback görünürlüğü iki platformda da görev bağlamına uygun olmalı; biri tamamen sessiz, diğeri aşırı gösterişli olmamalıdır.

## 17.5. Kural

Feedback adaptation presentation farkı üretebilir; problem sınıflandırmasını değiştiremez.

---

# 18. Primary vs Secondary Actions Adaptasyonu

## 18.1. Web

Aynı yüzeyde daha fazla secondary action görünür olabilir.

## 18.2. Mobil

Primary action daha baskın, secondary actions daha gizli veya context menu/sheet içinde olabilir.

## 18.3. Kural

Action hierarchy iki platformda da aynı ürün önceliğini yansıtmalıdır.

## 18.4. Kabul edilemez farklar

- web’de primary olan aksiyonun mobilde kaybolması
- mobilde destructive action’ın primary gibi görünmesi
- bir platformda secondary, diğerinde primary algısı oluşması

---

# 19. Content Hierarchy Adaptasyonu

## 19.1. Neden önemli?

Daha dar ekran, başlık/meta/CTA/hint hiyerarşisini daha dikkatli paketlemeyi gerektirir.

## 19.2. Kural

Bilgi yoğunluğu değişebilir ama:
- başlık rolü,
- meta bilginin ikincil kalması,
- CTA önceliği,
- feedback görünürlüğü
korunmalıdır.

## 19.3. Zayıf davranışlar

- küçük ekranda başlıkları anlamsız küçültmek
- mobilde helper ve feedback’i saklamak
- web’de görsel gürültü uğruna hiyerarşi zayıflatmak

---

# 20. Scroll ve Context Preservation Adaptasyonu

## 20.1. Web’de güçlü alanlar

- persistent filters
- split view context retention
- browser history alignment
- scroll + panel coexistence

## 20.2. Mobilde güçlü alanlar

- stacked progression
- simpler re-entry
- screen instance memory
- controlled back navigation restore

## 20.3. Kural

Kullanıcı bağlamı mümkün olduğunca korunmalı.  
Bir platformda doğal context retention varken diğer platformda gereksiz reset olmamalıdır.

---

# 21. System Integration Adaptasyonu

## 21.1. Kapsam

- file selection
- media permissions
- sharing
- notifications
- secure storage
- biometrics
- clipboard
- native/system dialogs

## 21.2. Kural

Bu alanlarda farklar doğaldır.  
Ama şu kalite eksenleri ortak kalmalıdır:
- izin açıklığı
- hata feedback’i
- recovery
- güvenlik hijyeni
- kullanıcı sürtünmesinin makullüğü

## 21.3. Zayıf davranışlar

- bir platformda iyi kurulan permission flow’un diğerinde geçiştirilmesi
- system integration farkı yüzünden kalite standardının bırakılması
- file/media işlemlerinde bir platformu “ikinci sınıf” bırakmak

---

# 22. Paylaşılan Kod Sınırları

## 22.1. Güçlü shared adayları

- domain logic
- semantic tokens
- validation rules
- selected reusable UI contracts
- shared test utilities
- some mapping logic
- feature-independent business rules

## 22.2. Dikkatli shared alanlar

- navigation binding
- platform bridges
- gesture logic
- form adapters
- keyboard-specific orchestration
- runtime bootstrap details

## 22.3. Kural

Paylaşım, behavior parity ve bakım doğruluğu üretiyorsa değerlidir.  
Aksi halde maliyetli taklit üretir.

---

# 23. Platform Adaptasyonunda Dokümantasyon Kuralları

## 23.1. Hangi farklar dokümante edilmelidir?

Aşağıdaki farklar yalnızca “kod içinde belli oluyor” diye bırakılmamalıdır:

- behavior farkı riski taşıyan adaptation
- navigation modelini etkileyen fark
- feedback/recovery davranışını etkileyen fark
- feature capability görünürlüğünü etkileyen fark
- a11y veya performance trade-off’lu fark
- kalıcı platform-specific pattern

## 23.2. Hangi farklar teknik detail olarak kalabilir?

- aynı contract’ın küçük platform binding farkları
- kullanıcı tarafından neredeyse hissedilmeyen adapter detayları
- public product behavior’ı değiştirmeyen wiring farkları

---

# 24. Adaptation Gerekçesi Nasıl Yazılmalı?

Bir platform-specific fark açıldığında mümkün olduğunca şu yapı kullanılmalıdır:

1. Problem ne?
2. Neden tek çözüm iki platformda aynı olamıyor?
3. Behavior parity nasıl korunuyor?
4. Design parity nasıl korunuyor?
5. Bu fark hangi kalite riskini çözüyor?
6. Riskleri neler?
7. Geçici mi kalıcı mı?

Bu net değilse fark çoğu zaman keyfi kalır.

---

# 25. Kabul Edilebilir Adaptasyon Ölçütleri

Bir farklılaşma aşağıdaki koşulların çoğunu sağlıyorsa kabul edilebilir sayılabilir:

- platform ergonomisini gerçekten iyileştiriyor
- behavior parity’yi bozmuyor
- design parity’yi kırmıyor
- a11y’yi düşürmüyor
- feature kapsamını azaltmıyor
- bakım maliyetini anlamsız artırmıyor
- sistematik açıklaması yapılabiliyor
- geçici hack değil, bilinçli karar niteliği taşıyor

---

# 26. Kabul Edilemez Adaptasyon Ölçütleri

Bir farklılaşma aşağıdaki özelliklerden birini veya birkaçını taşıyorsa zayıf kabul edilir:

- sadece implementasyon kolaylığı için yapılmışsa
- task modelini değiştiriyorsa
- bir platformu ikinci sınıf hale getiriyorsa
- design system dilini bozuyorsa
- a11y kalitesini düşürüyorsa
- feature yeteneğini ciddi azaltıyorsa
- feedback ve recovery modelini bozuyorsa
- belgelenmemiş ve keyfiyse

---

# S57. Push Notification Altyapısı

## S57.1. Push Notification Nedir ve Neden Gerekli

Push notification, sunucu tarafından tetiklenen ve kullanıcının cihazına uygulama kapalı veya arka planda olsa bile ulaşan bildirimlerdir. Mobile engagement'ın temel aracıdır. Kullanıcıyı uygulamaya geri çekmek, anlık bilgi vermek (sipariş durumu, güvenlik uyarısı, mesaj bildirimi) ve kullanıcı aksiyonu tetiklemek için kullanılır.

Push notification olmadan kullanıcı uygulamayı açmadıkça bilgilendirilmez. Bu da kritik bilgilerin gecikmesine, kullanıcı kaybına ve etkileşim düşüşüne neden olur.

## S57.2. Provider Yapısı

Bu proje kapsamında push notification altyapısı şu bileşenlerden oluşur:

**Expo Notifications:** Expo managed workflow için varsayılan push notification çözümüdür. Expo Push Token sistemi ile çalışır. Expo sunucuları FCM ve APNs arasında köprü görevi görür. Avantajı: Tek bir API ile hem iOS hem Android'e bildirim gönderilir. `expo-notifications` kütüphanesi ile entegre edilir.

**Firebase Cloud Messaging (FCM):** Google'ın push notification servisidir. Backend tarafında bildirim gönderimi için kullanılır. Hem Android'e doğrudan, hem iOS'a APNs üzerinden proxy ederek bildirim iletir. Server-side SDK'ları (Node.js, Python, Java vb.) mevcuttur.

**APNs (Apple Push Notification service):** Apple'ın kendi push notification altyapısıdır. iOS cihazlara bildirim ulaştırmanın tek resmi yoludur. FCM üzerinden proxy edilebilir (FCM, APNs sertifikası veya key ile iOS'a bildirim iletir). Doğrudan kullanılacaksa APNs key veya sertifika gerekir.

## S57.3. Web Push

Web platformunda push notification farklı bir mekanizma ile çalışır:

**Service Worker:** Web push notification'ların alınması ve gösterilmesi için arka planda çalışan Service Worker gereklidir. Service Worker, tarayıcı açıkken bile uygulama sekmesi kapalıyken bildirim alabilir.

**Web Push API:** Standart W3C API'sidir. VAPID (Voluntary Application Server Identification) key çifti ile kimlik doğrulama yapılır. Sunucu, push subscription endpoint'ine bildirim gönderir.

**Permission:** Kullanıcıdan `Notification.requestPermission()` ile bildirim izni istenmesi zorunludur. İzin verilmeden bildirim gösterilemez.

**Browser desteği:** Chrome, Firefox ve Edge tam destek sunar. Safari'de Web Push desteği sınırlıdır (macOS Ventura+ ve iOS 16.4+ ile gelmiştir ancak ek konfigürasyon gerektirir). Tarayıcı desteği kontrol edilmeden push registration yapılmamalıdır.

## S57.4. Permission Akışı

Push notification izin akışı kullanıcı deneyimi açısından kritiktir. Yanlış zamanlama, kalıcı red ile sonuçlanır.

**Kesinlikle YASAK olan davranış:** Uygulama ilk açıldığında anında native permission prompt göstermek. Kullanıcı henüz uygulamayı tanımamıştır, neden bildirim izni vermesi gerektiğini bilmemektedir. Bu durumda büyük çoğunluk "Reddet" der ve izni geri almak çok zordur.

**Doğru akış:**

1. Kullanıcı uygulamayı bir süre kullandıktan sonra, bildirimin değer yaratacağı bir anda (ör: sipariş tamamlandığında, bir içerik takip edildiğinde) değer önerisi gösterilir.
2. Değer önerisi özel bir UI ile sunulur: "Sipariş durumu hakkında bildirim almak ister misin?" veya "Takip ettiğin ürünlerin fiyat değişikliklerinden haberdar ol" gibi.
3. Kullanıcı bu özel UI'da "Evet, bildirim istiyorum" derse, ancak o zaman native permission prompt tetiklenir.
4. Kullanıcı native prompt'ta "İzin Ver" derse push token alınır ve sunucuya kaydedilir.

**Reddedilme senaryosu:** Kullanıcı native prompt'ta reddederse veya özel UI'da "Hayır" derse:

- Hemen tekrar sormak YASAKTIR.
- En az 7 gün beklenmeli, ardından farklı bir değer önerisi ile yeniden denenebilir.
- "Bildirimleri ayarlardan açabilirsin" şeklinde bir link sunulabilir (yalnızca bir kez, ısrar etmeden).
- Native prompt "Bir daha sorma" ile reddedildiyse uygulama tekrar soramaz; yalnızca cihaz ayarlarına yönlendirme (`Linking.openSettings()`) yapılabilir.

**Permission durumları:**

- `granted`: İzin verildi, bildirim gönderilebilir.
- `denied`: İzin reddedildi, uygulama tekrar soramaz.
- `default` / `undetermined`: Henüz sorulmadı, permission request yapılabilir.

Her durum için farklı UI gösterilmelidir. `denied` durumunda bildirim özelliği degrade olur, "ayarlardan aç" seçeneği sunulur.

## S57.5. Notification Payload Yapısı

Push notification payload'ı şu alanlardan oluşur:

- **title:** Bildirimin başlığı. Kısa ve açıklayıcı olmalı (ör: "Siparişin kargoya verildi").
- **body:** Bildirimin gövde metni. Detay bilgi taşır (ör: "Sipariş #12345, tahmini teslimat: 2 gün").
- **data:** Custom key-value çiftleri. Deep link URL'si buraya eklenir (ör: `{ "deepLink": "/orders/12345", "orderId": "12345" }`). Bu alan kullanıcıya gösterilmez, uygulama içi yönlendirme ve işlem için kullanılır.
- **image:** Opsiyonel görsel URL. Bildirimin zengin medya olarak gösterilmesini sağlar. Her platform ve cihaz desteklemeyebilir; fallback olarak image olmadan da bildirim anlamlı olmalıdır.
- **badge:** iOS'ta uygulama ikonu üzerindeki okunmamış bildirim sayısı. Sunucu tarafında yönetilmeli, her bildirimde güncellenmeli.
- **sound:** Bildirim sesi. `"default"` sistem sesini kullanır. Custom ses dosyası tanımlanabilir (app bundle'a dahil edilmeli).

## S57.6. Deep Link Entegrasyonu

Push notification'ın gerçek değeri, kullanıcıyı doğru ekrana yönlendirmesidir. Deep link olmayan bildirim, kullanıcıyı uygulama ana ekranına bırakır ve bağlam kaybına neden olur.

**Payload'da deep link:** `data` alanında deep link URL'si taşınır (ör: `"/orders/12345"`, `"/chat/456"`).

**Uygulama kapalıyken (cold start):** Bildirime tıklanır → uygulama başlatılır → initial notification payload okunur → splash screen sonrası doğrudan ilgili ekrana navigation yapılır. Bu akış `expo-notifications`'da `getLastNotificationResponseAsync()` ile kontrol edilir.

**Uygulama açıkken:** Bildirime tıklanır → `addNotificationResponseReceivedListener` tetiklenir → in-app navigation ile ilgili ekrana yönlendirilir. Mevcut ekrandaki kullanıcı state'i korunmalı, zorla sayfa değiştirmek yerine kullanıcıya seçenek sunulabilir.

**Uygulama arka plandayken:** Bildirime tıklanır → uygulama foreground'a gelir → notification response listener tetiklenir → ilgili ekrana yönlendirilir.

## S57.7. Foreground Handling

Uygulama açıkken (foreground) gelen bildirimler özel ele alınmalıdır:

**Varsayılan davranış:** iOS'ta uygulama foreground'dayken sistem notification'ı gösterilmez. Android'de gösterilir. Bu tutarsızlık nedeniyle foreground handling özel olarak yönetilmelidir.

**Tercih edilen yaklaşım:**

1. Foreground'da gelen bildirimde sistem notification'ı bastırılır (veya gösterilse bile ek olarak):
2. Uygulama içi banner/toast ile kullanıcı bilgilendirilir. Bu banner: notification title ve body'sini gösterir, tıklanabilir (deep link'e yönlendirir), birkaç saniye sonra otomatik kapanır veya kullanıcı swipe ile kapatabilir.
3. Ses ve titreşim opsiyonel (kullanıcı tercihine bağlı).

**Expo'da:** `setNotificationHandler` ile foreground notification davranışı kontrol edilir. `shouldShowAlert`, `shouldPlaySound`, `shouldSetBadge` parametreleri ayarlanır.

## S57.8. Notification Kategorileri ve Kullanıcı Tercihleri

Tüm bildirimleri tek bir anahtarla açıp kapamak yetersizdir. Kullanıcıya kategori bazında kontrol verilmelidir:

**Transactional (İşlemsel):** Sipariş durumu, ödeme onayı, güvenlik uyarısı, şifre sıfırlama. Genellikle kapatılmaması önerilir. Kritik güvenlik bildirimlerinin kapatılması engellenebilir.

**Marketing (Pazarlama):** Kampanya, indirim, yeni ürün duyurusu. Kullanıcı varsayılan olarak açık veya kapalı başlayabilir (bölgesel yasal gerekliliklere bağlı, GDPR/KVKK kapsamında varsayılan kapalı olabilir).

**Social (Sosyal):** Mesaj, yorum, beğeni, takip. Kullanıcı alt kategoriler bazında açıp kapatabilmeli.

**Notification preferences ekranı:** Uygulama ayarlarında "Bildirim Tercihleri" ekranı olmalıdır. Her kategori için ayrı toggle. Tercihler sunucuya kaydedilmeli (cihaz değişikliğinde korunması için). Kategori değişikliği anında etkili olmalıdır.

## S57.9. Analytics

Push notification etkinliğini ölçmek için şu event'ler izlenmelidir:

- **notification_received:** Bildirim cihaza ulaştığında. Delivery rate hesaplaması için kullanılır.
- **notification_opened:** Kullanıcı bildirime tıklayarak uygulamayı açtığında. Open rate hesaplaması için kullanılır.
- **notification_dismissed:** Kullanıcı bildirimi kapatıp/swipe edip uygulamayı açmadığında. Dismiss rate hesaplaması için kullanılır.

Her event'e notification category, campaign ID (varsa) ve deep link URL'si eklenmeli. Bu veriler bildirim stratejisinin optimize edilmesi için kullanılır.

## S57.10. Erişilebilirlik

- Notification içeriği screen reader (VoiceOver, TalkBack) ile okunabilir olmalıdır.
- Title ve body tek başına yeterli bilgi vermelidir; anlamın yalnızca image'a bağlı olması YASAKTIR.
- Image kullanılıyorsa, body metninde image'ın taşıdığı bilgi de yazılmalıdır.
- In-app banner/toast'lar `accessibilityLiveRegion` veya `accessibilityAnnouncement` ile duyurulmalıdır.

## S57.11. Hatalı Yaklaşımlar

Aşağıdaki davranışlar bu proje kapsamında zayıf kabul edilir:

- Uygulama ilk açıldığında anında permission popup göstermek (kullanıcı henüz değer görmemiştir, red oranı çok yüksek olur).
- Çok sık push göndermek (günde birden fazla marketing push spam algısı yaratır, kullanıcı bildirimi kapatır veya uygulamayı siler).
- Deep link olmayan boş notification göndermek (kullanıcı tıklar, ana ekrana düşer, neden tıkladığını unutur — kötü deneyim).
- Permission denied sonrası tekrar tekrar sormak (kullanıcıyı rahatsız eder, güven zedelenir).
- Tüm bildirim türlerini tek toggle'a bağlamak (kullanıcı yalnızca marketing'i kapatmak isterken tüm bildirimleri kapatmak zorunda kalır).
- Foreground'da gelen bildirimi tamamen yok saymak (kullanıcı önemli bir güncellemeyi kaçırır).
- Badge count'u güncellememek (uygulama ikonu üzerinde yanlış sayı gösterilir, güven zedelenir).

---

# S58. Splash Screen ve App Icon Yönetimi

## S58.1. Splash Screen Nedir

Splash screen, uygulama başlatıldığında kullanıcıya gösterilen tam ekran görseldir. Uygulama yüklenene kadar (JavaScript bundle parse, initial data fetch, font yükleme vb.) bu ekran gösterilir. Amacı: Kullanıcıya uygulamanın açıldığını göstermek, boş beyaz ekran (white flash) veya yarı yüklenmiş UI göstermesini engellemek ve marka kimliğini pekiştirmek.

## S58.2. Neden Önemli

Splash screen uygulamanın ilk izlenimidir. Kullanıcı uygulamayı açtığında ilk gördüğü şeydir.

- Boş beyaz ekran: Profesyonellik hissi vermez, uygulama "bozuk" algısı yaratabilir.
- Ani UI flash (yarı yüklenmiş ekran göründükten sonra tam ekrana geçiş): Kararsız ve düşük kaliteli his uyandırır.
- Düzgün splash screen: Uygulamanın kontrollü, profesyonel ve güvenilir olduğu hissini verir.

Bu nedenle splash screen yalnızca teknik bir gereklilik değil, marka deneyiminin bir parçasıdır.

## S58.3. Expo'da Splash Screen Yönetimi

**Konfigürasyon:** `app.json` veya `app.config.ts` dosyasında `splash` alanı ile tanımlanır:

```json
{
  "expo": {
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#FFFFFF"
    }
  }
}
```

**`expo-splash-screen` kütüphanesi:** Splash screen'in ne zaman gizleneceğini programatik olarak kontrol eder.

**Akış:**

1. `SplashScreen.preventAutoHideAsync()`: App component mount olmadan önce çağrılır. Bu, splash screen'in otomatik kapanmasını engeller.
2. Uygulama fontları yükler, initial API çağrılarını yapar, auth state'i kontrol eder.
3. Tüm kritik veriler hazır olduğunda `SplashScreen.hideAsync()` çağrılır.
4. Splash screen kaybolur, uygulama UI'ı gösterilir.

**Kritik kural:** `preventAutoHideAsync()` ile `hideAsync()` arasında kullanıcı boş veya yarı yüklenmiş bir ekran görmemelidir. Splash screen, uygulama tam hazır olana kadar açık kalmalıdır.

## S58.4. Splash Screen Tasarım Kuralları

**Basitlik:** Splash screen basit olmalıdır. Uygulama logosu + marka arka plan rengi yeterlidir. Karmaşık grafikler yükleme süresini artırır.

**Boyut ve responsive davranış:** Tüm ekran boyutlarına (iPhone SE'den iPad Pro'ya, küçük Android'den tablet'e) uyumlu olmalıdır. `resizeMode: "contain"` ile logo orantılı şekilde sığdırılır. `resizeMode: "cover"` ile arka plan tüm ekranı kaplar.

**Safe area:** Logo, safe area içinde kalmalıdır. Notch, dynamic island veya alt bar bölgesine taşmamalıdır.

**Animasyon:** Opsiyoneldir. Kullanılacaksa hafif olmalıdır (basit fade-in, scale). Ağır Lottie animasyonları splash screen'de kullanılmamalıdır çünkü amacı hızlı geçiş sağlamaktır, kullanıcıyı bekletmek değil. Animasyon süresi 1-2 saniyeyi geçmemelidir.

**Dosya formatı:** PNG tercih edilir (şeffaflık desteği). Boyut: Makul dosya boyutunda tutulmalı (100-300 KB ideal). Çok büyük splash image uygulama başlatma süresini olumsuz etkiler.

## S58.5. Dark Mode Splash

Cihaz dark mode'dayken splash screen da karanlık temaya uymalıdır. Aksi halde uygulama açılırken beyaz flaş etkisi oluşur ve kullanıcı deneyimi bozulur.

**Expo'da:** `app.json`'da `splash.dark` konfigürasyonu kullanılır:

```json
{
  "expo": {
    "splash": {
      "image": "./assets/splash-light.png",
      "backgroundColor": "#FFFFFF",
      "dark": {
        "image": "./assets/splash-dark.png",
        "backgroundColor": "#1A1A1A"
      }
    }
  }
}
```

Light ve dark splash görselleri ayrı ayrı hazırlanmalıdır. Logo rengi dark arka planda okunabilir olmalıdır.

### S58.5.1. Splash Screen Spec Referansı

Splash screen'in somut spec'i `39-default-screens-and-components-spec.md` S01'de tanımlanmıştır: expo-splash-screen kütüphanesi, dark mode desteği, font/data yüklenene kadar preventAutoHide, minimum gösterim süresi ve brand token tüketimi detaylıdır.

## S58.6. App Icon Kuralları

### iOS App Icon

- **Master boyut:** 1024x1024 piksel. Xcode ve Expo bu master icon'dan tüm gerekli boyutları (60x60, 120x120, 180x180 vb.) otomatik üretir.
- **Rounded corners:** iOS, uygulama ikonlarına otomatik olarak yuvarlatılmış köşe ekler. Icon dosyasına kendin köşe yuvarlatma EKLEME. Düz köşeli kare olarak export et, iOS kendi maskelemesini uygular.
- **Şeffaflık:** iOS app icon'larında şeffaflık (alpha channel) desteklenmez. Arka plan mutlaka opak olmalıdır.

### Android App Icon (Adaptive Icon)

- Android 8.0+ ile gelen adaptive icon sistemi iki katmandan oluşur:
  - **Foreground:** Logo/sembol katmanı. 1024x1024 piksel. Ortada safe zone (72x72 dp alan) içinde kalmalıdır çünkü farklı launcher'lar farklı maskeleme (daire, kare, squircle) uygulayabilir.
  - **Background:** Arka plan katmanı. 1024x1024 piksel. Düz renk veya gradient olabilir.
- Expo'da `android.adaptiveIcon` konfigürasyonu:

```json
{
  "expo": {
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon-foreground.png",
        "backgroundColor": "#FFFFFF"
      }
    }
  }
}
```

### Expo Genel Icon

`app.json`'da `icon` alanı her iki platform için fallback olarak kullanılır:

```json
{
  "expo": {
    "icon": "./assets/icon.png"
  }
}
```

## S58.7. Favicon ve Web Icon'ları

Web platformunda birden fazla icon boyutu gereklidir:

- **favicon.ico veya favicon.png:** 32x32 piksel. Tarayıcı sekmesinde gösterilir.
- **Apple touch icon:** 180x180 piksel. iOS Safari'de ana ekrana eklendiğinde kullanılır.
- **Manifest icon'ları:** PWA manifest dosyasında tanımlanan çeşitli boyutlarda icon'lar (192x192, 512x512 vb.). PWA kurulumu ve splash screen'i için kullanılır.
- Tüm web icon'ları `public/` klasöründe tutulur.
- `<link rel="icon">` ve `<link rel="apple-touch-icon">` HTML etiketleri ile tanımlanır.

## S58.8. Icon Tasarım Kuralları

- **Basitlik:** Icon küçük boyutta (29x29 piksel, hatta 16x16 favicon) görüntülenecektir. Karmaşık detaylar bu boyutlarda kaybolur. Sade, tanınabilir şekil ve renk kullanılmalıdır.
- **Metin YASAK:** Icon içine yazı eklenmemelidir. 29 piksel boyutunda hiçbir metin okunamaz. Logo metnini icon'a sığdırmaya çalışmak amatör bir yaklaşımdır.
- **Marka tutarlılığı:** App icon, splash screen ve uygulama içi logo aynı marka kimliğini taşımalıdır. Farklı renkler, farklı logolar veya farklı stil kullanmak marka bütünlüğünü bozar.
- **Kontrast:** Icon, hem açık hem koyu arka planlarda (launcher, ana ekran, ayarlar) okunabilir olmalıdır. Çok açık veya çok koyu tek renk icon kaybolabilir.
- **Test:** Icon'u farklı boyutlarda (küçük liste görünümü, büyük grid görünümü, bildirim), farklı arka planlarda ve farklı cihazlarda test et.

## S58.9. Asset Üretim Workflow

**Kaynak:** Figma veya benzeri tasarım aracında master icon (1024x1024) ve master splash screen hazırlanır.

**Export:** @1x çözünürlükte PNG olarak export edilir.

**Otomatik resize:** `sharp` gibi image processing kütüphanesi veya Expo'nun `expo prebuild` komutu ile tüm gerekli boyutlar otomatik üretilir. Manuel resize YAPILMAZ (hata riski yüksek, tutarsızlık oluşur).

**CI kontrolü:** CI pipeline'ında asset boyut ve format kontrolü yapılabilir. Yanlış boyutta icon commit edilmesi engellenir.

**Versiyon kontrolü:** Üretilen asset'ler repo'da tutulur. `.gitignore`'a eklenmez (build sırasında tekrar üretilmesi gereksiz süre ekler).

## S58.10. Hatalı Yaklaşımlar

Aşağıdaki davranışlar bu proje kapsamında zayıf kabul edilir:

- Splash screen açıkken HTTP request yapmak ve yanıt beklemek (ağ yavaşsa splash screen dakikalarca açık kalır — yalnızca kritik auth check yapılabilir, uzun data fetch yapılmamalı).
- Çok karmaşık splash animasyonu (kullanıcı uygulamayı hızlı açmak ister, 5 saniyelik animasyon izlemek istemez).
- Farklı platformlarda farklı marka kimliği (iOS'ta mavi splash, Android'de yeşil splash — tutarsızlık).
- Icon'da çok ince detay kullanmak (küçük boyutta piksel çorbası olur, tanınamaz).
- Dark mode splash hazırlamamak (karanlık temada beyaz flaş etkisi).
- iOS icon'una manuel rounded corners eklemek (iOS zaten ekler, çift yuvarlatma olur).
- Android adaptive icon'da safe zone dışına logo yerleştirmek (bazı launcher'larda logo kırpılır).

---

# S59. Biometric Authentication Detayları

## S59.1. Biometric Authentication Nedir

Biometric authentication, kullanıcının fiziksel özelliklerini (parmak izi, yüz geometrisi) kullanarak kimlik doğrulama yöntemidir. İki ana tür vardır:

- **Parmak izi (Touch ID / Fingerprint):** Kullanıcının parmak izi sensörü ile doğrulama yapması. iPhone 8 ve öncesi, birçok Android cihaz.
- **Yüz tanıma (Face ID / Face Unlock):** Kullanıcının yüzünü kameraya göstermesi ile doğrulama. iPhone X ve sonrası (TrueDepth kamera ile 3D yüz tarama), bazı Android cihazlar (genellikle 2D kamera tabanlı, daha az güvenli).

Biometric doğrulama cihaz seviyesinde gerçekleşir. Uygulama, parmak izi veya yüz verisini asla görmez, saklamaz veya sunucuya göndermez. Cihazın güvenli donanımı (Secure Enclave / TEE) doğrulamayı yapar ve uygulamaya yalnızca "başarılı" veya "başarısız" sonucunu döndürür.

## S59.2. Kullanım Alanları

Biometric authentication şu senaryolarda kullanılır:

**Login sonrası session restore:** Kullanıcı daha önce giriş yapmıştır, session token secure storage'da saklanmaktadır. Uygulama yeniden açıldığında (veya belirli bir süre geçtikten sonra) kullanıcıyı tekrar e-posta/şifre sormak yerine biometric ile doğrulayarak session'ı devam ettirir.

**Hassas işlem onayı:** Ödeme yapma, şifre değiştirme, kişisel bilgi güncelleme gibi kritik işlemlerden önce ek güvenlik katmanı olarak biometric doğrulama istenir. "Bu işlemi onaylamak için parmak izinizi kullanın" şeklinde.

**App kilidi (app lock / privacy lock):** Kullanıcı uygulamayı her açtığında veya arka plandan döndüğünde biometric ile kilidi açar. Özellikle hassas içerik (finansal bilgiler, sağlık verileri, özel mesajlar) içeren uygulamalarda kullanılır. Bu özellik kullanıcı tarafından ayarlardan açılıp kapatılabilmelidir.

## S59.3. Expo'da Biometric Entegrasyonu

`expo-local-authentication` kütüphanesi kullanılır.

**Kurulum:** `npx expo install expo-local-authentication`

**Temel API:**

- `LocalAuthentication.hasHardwareAsync()`: Cihazda biometric donanım var mı kontrol eder.
- `LocalAuthentication.isEnrolledAsync()`: Cihazda kayıtlı biometric (parmak izi veya yüz) var mı kontrol eder.
- `LocalAuthentication.authenticateAsync(options)`: Biometric prompt'u tetikler. `options` parametresi ile prompt metni, fallback label ve iptal butonu özelleştirilebilir.

**Örnek kullanım akışı:**

```typescript
const hasHardware = await LocalAuthentication.hasHardwareAsync();
const isEnrolled = await LocalAuthentication.isEnrolledAsync();

if (hasHardware && isEnrolled) {
  const result = await LocalAuthentication.authenticateAsync({
    promptMessage: 'Giriş yapmak için doğrulama yapın',
    cancelLabel: 'İptal',
    fallbackLabel: 'PIN kullan',
  });

  if (result.success) {
    // Secure storage'dan token oku, session devam ettir
  } else {
    // PIN/password fallback göster
  }
}
```

## S59.4. Biometric Authentication Akışı

Detaylı akış şu şekilde çalışır:

1. **Opt-in:** Kullanıcı uygulama ayarlarından biometric login'i aktif eder. Bu varsayılan olarak KAPALI olmalıdır. İlk başarılı login sonrası "Bir sonraki girişte parmak izi/yüz tanıma kullanmak ister misiniz?" şeklinde önerilebilir.

2. **Token saklama:** Biometric aktif edildiğinde, mevcut auth token (veya refresh token) `expo-secure-store` ile cihazın güvenli deposuna kaydedilir. Bu depo, cihazın donanımsal güvenlik modülü (Secure Enclave / Android Keystore) tarafından korunur.

3. **Session restore:** Uygulama açıldığında veya session expired olduğunda:
   - Biometric ayarı aktif mi kontrol edilir.
   - Cihazda biometric donanım ve kayıtlı biometric var mı kontrol edilir.
   - Her ikisi de varsa biometric prompt gösterilir.

4. **Başarılı doğrulama:** Secure storage'dan auth token okunur. Token ile API'ye session validation yapılır. Geçerli ise session devam eder, kullanıcı uygulamayı kullanmaya başlar.

5. **Başarısız doğrulama:** Biometric başarısız olabilir (ıslak parmak, yetersiz ışık, maske vb.). Bu durumda PIN/password fallback ekranı gösterilir. Kullanıcı manuel olarak giriş yapar.

6. **Tekrarlı başarısızlık:** Belirli sayıda (genellikle 3-5) başarısız biometric denemeden sonra otomatik olarak PIN/password fallback'e geçilir. Cihaz kendi güvenlik politikasını da uygulayabilir (belirli süre kilitleme).

## S59.5. Fallback Zorunluluğu

Biometric doğrulama her zaman başarısız olabilir. Nedenler:

- Islak veya kirli parmak (parmak izi okuyucu çalışmaz).
- Güneş ışığı veya karanlık ortam (yüz tanıma çalışmaz).
- Maske, gözlük veya yüz değişikliği.
- Cihazın biometric sensörü arızalı.
- Kullanıcı biometric kaydını cihazdan silmiş.

Bu nedenlerle:

- **PIN veya password fallback ZORUNLUDUR.** Biometric, tek başına authentication yöntemi olamaz. Her zaman alternatif giriş yolu sunulmalıdır.
- Fallback seçeneği biometric prompt'ta görünür olmalıdır ("PIN kullan" butonu).
- Fallback akışı da aynı güvenlik standardında olmalıdır (güvenli PIN, timeout, brute-force koruması).

## S59.6. Cihaz Desteği Kontrolü

Biometric özelliği sunulmadan önce iki kontrol yapılmalıdır:

1. **Donanım kontrolü:** Cihazda biometric donanım (parmak izi sensörü veya yüz tanıma kamerası) var mı? `hasHardwareAsync()` ile kontrol edilir.
2. **Kayıt kontrolü:** Cihazda en az bir parmak izi veya yüz kaydedilmiş mi? `isEnrolledAsync()` ile kontrol edilir.

**Donanım yoksa:** Biometric seçeneği ayarlar ekranında tamamen gizlenir. Kullanıcı, olmayan bir özelliği görmemelidir.

**Donanım var ama kayıt yoksa:** "Biometric login kullanmak için cihaz ayarlarından parmak izi/yüz kaydı eklemeniz gerekiyor" mesajı gösterilir. Cihaz ayarlarına yönlendirme linki sunulabilir.

## S59.7. Güvenlik Kuralları

- **Biometric verisi cihazda kalır:** Uygulama parmak izi veya yüz verisine erişemez. Sunucuya biometric veri gönderilmesi kesinlikle YASAKTIR. Uygulama yalnızca "doğrulama başarılı/başarısız" boolean sonucunu alır.

- **Secure storage zorunlu:** Auth token, `SecureStore` (Expo) veya platform-native güvenli depo (iOS Keychain, Android Keystore) ile saklanmalıdır. `AsyncStorage` veya `localStorage` gibi şifrelenmemiş depolarda auth token tutmak güvenlik açığıdır.

- **Jailbreak/Root detection:** Jailbreak yapılmış iOS veya root edilmiş Android cihazlarda güvenli donanım modülü bypass edilmiş olabilir. Bu durum tespit edilirse:
  - Kullanıcıya uyarı gösterilebilir ("Cihazınızın güvenliği azaltılmış, biometric doğrulama güvenilmez olabilir").
  - Hassas uygulamalarda (finans, sağlık) biometric devre dışı bırakılabilir.
  - Bu karar ürünün risk toleransına göre verilir.

## S59.8. Platform Farkları

### iOS

- **Face ID:** `NSFaceIDUsageDescription` key'i `Info.plist`'e eklenmelidir. Bu, kullanıcıya Face ID'nin neden kullanıldığını açıklayan metindir (ör: "Güvenli giriş için Face ID kullanılır"). Bu key olmadan Face ID prompt'u çalışmaz ve app, App Store'dan reddedilebilir.
- **Touch ID:** Ek permission key gerekmez. Doğrudan kullanılabilir.
- Expo'da: `app.json`'da `ios.infoPlist` altında `NSFaceIDUsageDescription` eklenir.

### Android

- **BiometricPrompt API:** Android 9 (API 28) ve sonrası için modern biometric API'si. Hem parmak izi hem yüz tanıma destekler. Sistem UI'ı ile standart prompt gösterilir.
- **FingerprintManager:** Android 6-8 için eski API. Deprecated (kullanımdan kaldırılmış). Yeni projeler için kullanılmamalıdır.
- **Güvenlik seviyeleri:** Android, biometric'i güvenlik seviyelerine ayırır: `BIOMETRIC_STRONG` (donanım tabanlı, güvenilir), `BIOMETRIC_WEAK` (yazılım tabanlı yüz tanıma, daha az güvenilir). Hassas işlemler için yalnızca `BIOMETRIC_STRONG` kabul edilmelidir.

## S59.9. Erişilebilirlik

- Biometric prompt, screen reader (VoiceOver, TalkBack) ile uyumlu olmalıdır. Sistem tarafından sağlanan biometric prompt'lar genellikle erişilebilirdir, ancak custom prompt kullanılıyorsa erişilebilirlik test edilmelidir.
- Prompt metni açıklayıcı olmalıdır: "Giriş yapmak için parmak izinizi kullanın" veya "Ödemeyi onaylamak için yüz tanıma kullanın" gibi. Teknik jargon kullanılmamalıdır.
- Fallback seçeneği (PIN/password) her zaman erişilebilir olmalıdır. Biometric kullanamayanlar (engelli kullanıcılar dahil) uygulamaya erişebilmelidir.

## S59.10. Hatalı Yaklaşımlar

Aşağıdaki davranışlar bu proje kapsamında zayıf kabul edilir:

- Biometric'i zorunlu kılmak, fallback sunmamak (parmak izi çalışmayan kullanıcı uygulamaya giremez).
- Biometric veriyi (parmak izi hash'i, yüz verisi) sunucuya göndermek (büyük güvenlik ve gizlilik ihlali).
- Cihaz desteğini kontrol etmeden biometric prompt göstermeye çalışmak (crash veya anlamsız hata).
- Her uygulama açılışında biometric istemek (session timeout'a bağlanmalı; kullanıcı 5 saniye önce uygulamayı kapatıp açtıysa tekrar biometric gereksiz).
- Auth token'ı `AsyncStorage` veya `localStorage`'da saklamak (şifrelenmemiş, kök erişimli cihazda okunabilir).
- Biometric başarısızlığında hiçbir geri bildirim vermemek (kullanıcı ne yapacağını bilemez).
- Jailbreak/root cihazlarda hiçbir uyarı göstermemek (güvenlik riski göz ardı edilir).

---

# S60. App Permissions Yönetimi

## S60.1. App Permissions Nedir

Mobile uygulamalar, cihazın donanım ve yazılım kaynaklarına erişmek için kullanıcıdan açık izin almak zorundadır. Bu kaynaklar şunları içerir:

- **Kamera:** Fotoğraf çekme, video kaydetme, QR kod okuma.
- **Mikrofon:** Ses kaydı, sesli mesaj, sesli arama.
- **Konum:** GPS ile kullanıcı konumu belirleme (yakındaki mağazalar, teslimat adresi).
- **Fotoğraf galerisi / Medya kütüphanesi:** Kullanıcının fotoğraf ve videolarına erişim.
- **Bildirimler (Push notifications):** Cihaza bildirim gönderme izni.
- **Kişiler (Contacts):** Kullanıcının telefon rehberine erişim.
- **Takvim:** Kullanıcının takvimine etkinlik ekleme.
- **Bluetooth / NFC:** Yakın cihazlarla iletişim.

Her platformun (iOS, Android) kendi permission sistemi vardır ve kuralları farklıdır. Ancak temel ilke aynıdır: kullanıcı bilgilendirilmeli ve açık onay vermelidir.

## S60.2. Temel İlke: JIT (Just-In-Time) Permission Request

**JIT ilkesi:** İzni, ilgili özellik ilk kez kullanılacağı anda iste. Kullanıcı kameraya ihtiyaç duyan bir butona tıkladığında kamera izni iste. Kullanıcı konum gerektiren bir özelliği açtığında konum izni iste.

**Kesinlikle YASAK olan davranış:** Uygulama açılışında tüm izinleri birden istemek. Bu davranışın zararları:

- Kullanıcı neden bu izinlerin gerektiğini anlamaz.
- Toplu izin talebi güvensizlik hissi yaratır ("Bu uygulama neden kameramı, mikrofonumu, konumumu ve rehberimi istiyor?").
- Kullanıcı paniğe kapılıp tümünü reddedebilir.
- İlk deneyim izin popup'ları seli ile başlar, kötü izlenim bırakır.

JIT ile kullanıcı izni bağlamında anlar: "Fotoğraf çekmek istiyorum → kamera izni mantıklı" vs "Uygulama açıldı → neden kamera istiyor?".

## S60.3. Permission Request Akışı (Detaylı)

Doğru permission request akışı şu adımlardan oluşur:

**Adım 1 — Kullanıcı aksiyonu:** Kullanıcı, izin gerektiren bir özelliğe tıklar. Örneğin: "Profil Fotoğrafı Çek" butonu.

**Adım 2 — Açıklama ekranı (pre-permission screen):** Native permission prompt gösterilmeden ÖNCE, özel bir UI ile kullanıcıya neden izin gerektiği açıklanır. Bu ekran bir bottom sheet, modal veya inline card olabilir. İçeriği:
- Neden izin gerektiğini açıklayan kısa metin: "Profil fotoğrafı çekmek için kamera erişimi gerekli."
- İsteğe bağlı görsel (kamera ikonu, illüstrasyon).
- "İzin Ver" ve "Şimdi Değil" butonları.

Bu adım neden önemlidir? Native permission prompt yalnızca BİR KEZ gösterilebilir (kullanıcı "Bir daha sorma" seçebilir). Bu nedenle native prompt'tan önce kullanıcıyı hazırlamak, kabul oranını önemli ölçüde artırır.

**Adım 3 — Native permission prompt:** Kullanıcı açıklama ekranında "İzin Ver" derse, native (sistem) permission prompt tetiklenir. Bu prompt iOS veya Android tarafından gösterilir, uygulamanın kontrolünde değildir.

**Adım 4 — İzin verildi:** Kullanıcı native prompt'ta "İzin Ver" derse, özellik aktif olur. Kamera açılır, konum alınır vb.

**Adım 5 — İzin reddedildi:** Kullanıcı reddederse:
- Özellik degrade olur (ör: kamera yerine galeriden fotoğraf seçme önerilir).
- Zorla tekrar sormak YASAKTIR.
- Kullanıcı daha sonra fikrini değiştirirse, aynı özelliğe tekrar tıkladığında açıklama ekranı tekrar gösterilebilir (ancak native prompt gösterilemeyebilir).

## S60.4. Permission Durumları

Her permission dört durumdan birinde olabilir:

**`granted` (izin verildi):** Özellik tam olarak kullanılabilir. Ek soru sorulmaz.

**`denied` (reddedildi):** Kullanıcı native prompt'ta reddetmiş. Uygulama tekrar native prompt gösteremez. "Ayarlardan izin verebilirsiniz" mesajı ve yönlendirme gösterilir.

**`undetermined` (henüz sorulmadı):** İzin henüz hiç istenmemiş. Native prompt gösterilebilir. Bu, ilk fırsat anıdır — iyi kullanılmalıdır.

**`limited` (kısmi erişim — yalnızca iOS):** iOS 14+ ile gelen özellik. Kullanıcı tüm fotoğraflar yerine yalnızca seçtiği fotoğraflara erişim verebilir. Bu durum ayrı ele alınmalıdır: "Tüm fotoğraflara erişim yerine yalnızca seçtiklerinize erişebiliyoruz. Daha fazla fotoğraf seçmek ister misiniz?" mesajı gösterilebilir.

Her durum için farklı UI gösterilmelidir. `denied` durumunda özelliğe erişim butonu hala görünür olmalı, ancak tıklandığında "ayarlara yönlendirme" akışı çalışmalıdır.

## S60.5. Kalıcı Red Senaryosu

Kullanıcı native permission prompt'ta "Bir daha sorma" (Don't Ask Again) seçtiyse veya ikinci kez reddettiyse (Android'de otomatik "bir daha sorma" olarak işlenir):

- Uygulama native prompt'u tekrar gösteremez. `requestPermission()` çağrısı otomatik olarak `denied` döner, prompt gösterilmez.
- Bu durumda yapılması gereken:
  1. "Bu özellik için cihaz ayarlarından izin vermeniz gerekiyor" açıklama mesajı gösterilir.
  2. "Ayarları Aç" butonu sunulur.
  3. Butona tıklanınca `Linking.openSettings()` ile uygulamanın cihaz ayarları sayfası açılır.
  4. Kullanıcı ayarlardan izni manuel olarak açar.
  5. Uygulama foreground'a döndüğünde permission durumu yeniden kontrol edilir.

Bu akış nazik ve yönlendirici olmalıdır, zorlayıcı veya tekrarlayıcı değil.

## S60.6. Expo'da Permission Yönetimi

Expo, her kaynak için ayrı kütüphane ve permission API'si sunar:

- **Kamera:** `expo-camera` → `Camera.requestCameraPermissionsAsync()`
- **Konum:** `expo-location` → `Location.requestForegroundPermissionsAsync()`
- **Medya kütüphanesi:** `expo-media-library` → `MediaLibrary.requestPermissionsAsync()`
- **Kişiler:** `expo-contacts` → `Contacts.requestPermissionsAsync()`
- **Bildirimler:** `expo-notifications` → `Notifications.requestPermissionsAsync()`

**`app.json` konfigürasyonu:**

iOS'ta her permission için kullanıcıya gösterilecek açıklama metni (usage description) tanımlanmalıdır:

```json
{
  "expo": {
    "ios": {
      "infoPlist": {
        "NSCameraUsageDescription": "Profil fotoğrafı çekmek için kamera erişimi gerekli.",
        "NSPhotoLibraryUsageDescription": "Profil fotoğrafı seçmek için galeri erişimi gerekli.",
        "NSLocationWhenInUseUsageDescription": "Size yakın mağazaları göstermek için konum erişimi gerekli."
      }
    }
  }
}
```

Android'de gerekli permission'lar `AndroidManifest.xml`'e eklenir (Expo bunu `app.json` üzerinden otomatik yönetir).

## S60.7. iOS Spesifik Kurallar

- **Usage description zorunluluğu:** iOS'ta her permission talebi için `Info.plist`'te açıklama metni zorunludur. Bu metin, native permission prompt'ta kullanıcıya gösterilir. Apple, App Store review sürecinde bu metinleri inceler.
- **Kötü usage description → App Store reject:** "Kameraya erişim gerekiyor" gibi belirsiz metinler reddedilebilir. Metin, neden izin istendiğini net açıklamalıdır: "Profil fotoğrafı çekmek için kamera erişimi gereklidir."
- **Tracking Transparency (ATT):** iOS 14.5+ ile gelen App Tracking Transparency. Reklam izleme için ayrı izin gerekir. `NSUserTrackingUsageDescription` ile açıklanmalıdır.
- **Limited Photos:** iOS 14+ ile kullanıcı tüm galeriye erişim vermek yerine yalnızca belirli fotoğrafları seçebilir. Bu `limited` durumu ayrı handle edilmelidir.

## S60.8. Android Spesifik Kurallar

- **Runtime permission (API 23+):** Android 6.0+ ile tehlikeli (dangerous) permission'lar çalışma zamanında istenmek zorundadır. Manifest'te tanımlamak yetmez, kullanıcıdan da onay alınmalıdır.
- **Android 13+ granüler medya izinleri:** Eski tek `READ_EXTERNAL_STORAGE` yerine üç ayrı permission gelmiştir:
  - `READ_MEDIA_IMAGES` (fotoğraflar)
  - `READ_MEDIA_VIDEO` (videolar)
  - `READ_MEDIA_AUDIO` (müzik dosyaları)
  Yalnızca gereken tür için izin istenmelidir.
- **Background location:** Android 10+ ile arka plan konum erişimi ayrı izin gerektirir. Foreground location izni verdikten sonra ayrıca "Her zaman izin ver" seçilmelidir. Google Play Store, background location kullanan uygulamalar için ek inceleme yapar.
- **Install-time permission:** Bazı tehlikesiz (normal) permission'lar (internet erişimi, Bluetooth keşfi vb.) manifest'te tanımlanır ve install sırasında otomatik verilir, runtime'da sormak gerekmez.

## S60.9. Minimum Veri İlkesi

Yalnızca gerçekten gereken izni iste. Bu hem kullanıcı güvenini korur hem de yasal gerekliliklere (GDPR, KVKK) uyumu sağlar.

Örnekler:

- Yalnızca profil fotoğrafı seçmek için "tüm fotoğraflara tam erişim" istemek yerine, iOS'ta `limited` photos yeterlidir.
- Yalnızca anlık konum göstermek için "her zaman konum erişimi" istemek yerine "yalnızca uygulama kullanılırken" (foreground) izni yeterlidir.
- Yalnızca fotoğraf çekmek için kamera izni yeterlidir, aynı anda mikrofon izni istemek gereksizdir (video kaydı yoksa).

İhtiyaç fazlası izin talebi kullanıcıda şüphe yaratır ve App Store / Google Play incelemelerinde sorun çıkarabilir.

## S60.10. Erişilebilirlik

- Permission açıklama ekranları (pre-permission screen) screen reader ile okunabilir olmalıdır.
- Neden izin gerektiği açık, anlaşılır dilde yazılmalıdır. Teknik terimlerden kaçınılmalıdır.
- "Ayarları Aç" butonu screen reader ile erişilebilir ve anlamlı label'a sahip olmalıdır.
- Permission durumuna göre değişen UI, screen reader kullanıcılarına da doğru bilgi vermelidir (ör: "Kamera izni reddedildi. Ayarlardan izin verebilirsiniz.").

## S60.11. Hatalı Yaklaşımlar

Aşağıdaki davranışlar bu proje kapsamında zayıf kabul edilir:

- Uygulama açılışında tüm izinleri aynı anda istemek (kullanıcı bağlamı anlamaz, güvensizlik hissi yaratır, toplu red riski).
- Neden izin istendiğini açıklamamak (native prompt öncesi açıklama ekranı olmadan direkt sistem popup'ı göstermek — red oranı yükselir).
- Reddedilince sonsuz döngüde tekrar sormak (kullanıcı her butona bastığında "izin ver" popup'ı — rahatsız edici ve güven zedeleyici).
- Permission olmadan özelliği tamamen gizlemek (kullanıcı özelliğin varlığını bilmeli; gizlemek yerine "bu özellik için izin gerekli" mesajı gösterilmeli).
- Gereksiz geniş permission istemek (fotoğraf seçimi için "tüm dosyalara tam erişim" gibi).
- iOS usage description'larını genel ve belirsiz yazmak ("İzin gerekli" — App Store reject riski).
- Permission check yapmadan doğrudan özelliği çalıştırmaya çalışmak (crash veya beklenmedik davranış).

---

# S61. Background Task ve Job Yönetimi

## S61.1. Background Task Nedir

Background task, uygulama aktif olarak kullanılmadığında (arka planda veya tamamen kapalıyken) çalışan görevlerdir. Kullanıcı uygulamadan çıkmış olsa bile bazı işlemlerin devam etmesi veya periyodik olarak yapılması gerekebilir.

Tipik background task senaryoları:

- **Veri senkronizasyonu:** Offline yapılan değişikliklerin bağlantı geldiğinde sunucuya gönderilmesi.
- **Bildirim işleme:** Silent push notification alındığında arka planda içerik güncelleme.
- **Konum izleme:** Navigasyon veya teslimat takibi uygulamalarında arka planda konum güncelleme.
- **Periyodik güncelleme:** Yeni içerik kontrolü, cache yenileme, analytics verisi gönderme.
- **Medya yükleme/indirme:** Büyük dosyaların arka planda transferi.

## S61.2. Platform Kısıtlamaları

Mobile işletim sistemleri, pil ömrünü korumak ve kullanıcı deneyimini iyileştirmek için background execution'ı sıkı bir şekilde kısıtlar. Bu kısıtlamalar anlaşılmalı ve saygı duyulmalıdır.

### iOS Kısıtlamaları

iOS, background execution konusunda en kısıtlayıcı platformdur:

- **İzinli kategoriler:** Yalnızca belirli kategorilerdeki uygulamalar background'da çalışabilir:
  - Audio (müzik çalma, ses kaydı)
  - Location (konum güncelleme)
  - VoIP (sesli arama)
  - Background fetch (periyodik veri çekme)
  - Remote notification processing (silent push işleme)
  - Background transfer (büyük dosya upload/download)
- **Background fetch:** iOS tarafından kontrol edilir. Uygulama background fetch isteyebilir ancak ne zaman çalışacağını iOS belirler. Tipik aralık 15-30 dakika arasıdır, ancak garanti yoktur. Kullanıcı uygulamayı sık kullanıyorsa iOS daha sık tetikler, nadir kullanıyorsa daha seyrek.
- **Task süresi:** Background task başladıktan sonra yaklaşık 30 saniye süresi vardır. Bu süre içinde işi tamamlamak zorundadır. Süre aşılırsa iOS task'ı zorla sonlandırır.
- **`beginBackgroundTask`:** Ek süre talep etmek için kullanılır, ancak garanti vermez. iOS en fazla birkaç dakika ek süre verebilir.

### Android Kısıtlamaları

Android, iOS'a göre daha esnek olsa da önemli kısıtlamalar vardır:

- **Doze mode (Android 6+):** Cihaz belirli bir süre hareketsiz kalırsa, ağ erişimi, alarm, sync işlemleri gibi arka plan aktiviteleri ertelenir. Yalnızca yüksek öncelikli FCM mesajları Doze mode'u geçebilir.
- **App Standby:** Kullanıcı uygulamayı uzun süre kullanmadıysa, uygulamanın arka plan aktiviteleri kısıtlanır.
- **Background execution limits (Android 8+):** Arka plan servisleri belirli bir süre sonra durdurulur. Uzun çalışan işler için `WorkManager` kullanılmalıdır.
- **Battery optimization:** Kullanıcı veya üretici düzeyinde pil optimizasyonu, uygulamayı beklenmedik şekilde öldürebilir. Özellikle Xiaomi, Huawei, Samsung gibi üreticiler agresif pil optimizasyonu uygular.

## S61.3. Expo'da Background Task Yönetimi

Expo, background task yönetimi için iki temel kütüphane sunar:

**`expo-task-manager`:** Background task'ların tanımlanması ve yönetilmesi için temel kütüphane.

**`expo-background-fetch`:** Periyodik background fetch görevleri için.

**Task tanımı:** Task'lar global scope'da tanımlanmalıdır. Component içinde tanımlanan task'lar component unmount olduğunda kaybolur. Tipik olarak `App.tsx` veya ayrı bir `tasks.ts` dosyasında tanımlanır:

```typescript
import * as TaskManager from 'expo-task-manager';
import * as BackgroundFetch from 'expo-background-fetch';

const BACKGROUND_FETCH_TASK = 'background-fetch-task';

// Global scope'da task tanımı
TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
  try {
    // Arka planda yapılacak iş
    const hasNewData = await checkForNewData();

    return hasNewData
      ? BackgroundFetch.BackgroundFetchResult.NewData
      : BackgroundFetch.BackgroundFetchResult.NoData;
  } catch (error) {
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});

// Task'ı kaydet (uygulama başlatıldığında bir kez çağrılır)
async function registerBackgroundFetch() {
  await BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
    minimumInterval: 15 * 60, // minimum 15 dakika (saniye cinsinden)
    stopOnTerminate: false,   // uygulama kapatılsa bile çalışsın
    startOnBoot: true,        // cihaz yeniden başlatılınca otomatik başlasın
  });
}
```

**Önemli notlar:**

- `minimumInterval` garantili bir aralık değildir. OS bu süreyi uzatabilir.
- `defineTask` app bundle'ın en üst seviyesinde çağrılmalıdır.
- Task içinde UI güncellemesi yapılamaz (React state, component render vb.).

## S61.4. Kullanım Alanları (Detaylı)

### Offline Queue Sync

Kullanıcı offline iken yaptığı değişiklikler (form submit, veri güncelleme, favori ekleme) bir queue'da biriktirilir. Bağlantı geldiğinde (ağ durumu değişikliği veya background fetch tetiklendiğinde) bu queue sunucuya gönderilir.

- Queue `AsyncStorage` veya SQLite'da tutulur.
- Her queue item: işlem türü, payload, timestamp, retry count içerir.
- Conflict resolution stratejisi belirlenmeli (last-write-wins, merge, user-prompt).
- Başarılı sync sonrası queue temizlenir.

### Content Prefetch

Kullanıcının bir sonraki kullanımda göreceği içerik arka planda önceden indirilir.

- Yalnızca WiFi'da yapılabilir (mobil veri tasarrufu).
- Cache boyutu sınırlı tutulmalıdır.
- Kullanıcı "veri tasarrufu" ayarı açtıysa prefetch devre dışı kalmalıdır.

### Analytics Batch Upload

Kullanıcı etkileşim event'leri anlık göndermek yerine biriktirilir ve toplu gönderilir.

- Batch boyutu veya zaman eşiği dolduğunda gönderim yapılır.
- Ağ yoksa queue'da tutulur, bağlantı gelince gönderilir.
- Background fetch sırasında pending analytics gönderimi yapılabilir.

### Silent Push Notification Processing

Sunucu, kullanıcıya görünür bildirim göstermeden arka planda veri güncellemesi tetikleyebilir.

- `content-available: 1` (iOS) veya `data-only` (FCM) push ile tetiklenir.
- Uygulama arka planda kısa süreliğine uyanır, veriyi çeker ve tekrar uyur.
- Kullanıcıya bildirim gösterilmez, ancak bir sonraki açılışta güncel veri hazırdır.

## S61.5. Task Süresi ve Sınırlar

**iOS:**

- Background task'lar maksimum ~30 saniye çalışabilir. Bu süre kesin değildir, iOS duruma göre daha kısa kesebilir.
- `UIApplication.beginBackgroundTask` ile ek süre istenebilir. Bu genellikle birkaç dakikaya kadar uzatır, ancak iOS 13+ ile bu süre de kısaltılmıştır.
- Süre aşımı: iOS task'ı `expiration handler` çağırarak uyarır. Handler içinde işi temiz şekilde sonlandırmak gerekir. Sonlandırılmazsa iOS uygulamayı zorla öldürür.

**Android:**

- `WorkManager` ile uzun çalışan işler planlanabilir. WorkManager, OS kısıtlamalarına saygı duyarak işi uygun zamanda çalıştırır.
- `Foreground service`: Kullanıcıya kalıcı bildirim göstererek arka planda uzun süre çalışabilir (ör: müzik çalar, navigasyon). Ancak bildirim zorunludur.
- `JobScheduler`: Belirli koşullar (WiFi, şarj) sağlandığında çalışacak işler planlamak için kullanılır.

## S61.6. Pil (Battery) Etkisi

Background task'lar pil tüketir. Bu durum kullanıcı deneyimini olumsuz etkiler ve OS tarafından uygulamanın kısıtlanmasına yol açabilir.

**Kurallar:**

- **Minimum sıklık:** Background fetch aralığını gereksiz kısa tutma. 15 dakika minimum olsa bile, gerçek ihtiyaç saatlik veya günlük olabilir.
- **Minimum ağ kullanımı:** Arka planda büyük veri transferi yapmaktan kaçın. Yalnızca delta (değişen kısım) gönder/al.
- **Batch processing:** Birden fazla küçük işlemi tek bir background execution döngüsünde toplu yap. Her biri için ayrı wake-up gerektirme.
- **Kullanıcı bilgilendirme:** Ayarlar ekranında "Arka plan senkronizasyonu" toggle'ı olmalı. Kullanıcı bu özelliği kapatabilmeli. Açıklama: "Arka plan senkronizasyonu pil kullanımını artırabilir."
- **WiFi tercihi:** Büyük data transferleri WiFi bağlantısına ertelenebilir.

## S61.7. Test Stratejisi

Background task testi zordur çünkü normal geliştirme döngüsünde uygulama foreground'dadır.

**iOS Simulator'da:**

- Xcode menüsünden `Debug → Simulate Background Fetch` ile background fetch simüle edilebilir.
- Console logları ile task'ın çalıştığı doğrulanabilir.
- Gerçek cihazda test daha güvenilirdir (simulator background behavior'ı tam yansıtmayabilir).

**Android'de:**

- `adb shell cmd jobscheduler run -f <package> <job-id>` komutu ile JobScheduler tetiklenebilir.
- WorkManager test kütüphanesi (`work-testing`) ile unit test yazılabilir.
- Battery Historian aracı ile pil etkisi analiz edilebilir.

**Genel test pratikleri:**

- Background task içindeki iş mantığını ayrı fonksiyonlara çıkar ve bu fonksiyonları unit test ile test et.
- Integration test'te gerçek background execution'a bağımlı olma; business logic'i izole test et.
- QA sürecinde gerçek cihazlarda, farklı senaryolarda (WiFi, mobil veri, uçak modu, düşük pil) test yap.

## S61.8. Hatalı Yaklaşımlar

Aşağıdaki davranışlar bu proje kapsamında zayıf kabul edilir:

- Background'da sürekli çalışan sonsuz döngü (loop) oluşturmak (pili hızla bitirir, OS uygulamayı zorla öldürür ve gelecekte arka plan izinlerini kısıtlayabilir).
- Background task içinde UI güncellemesi yapmaya çalışmak (React state değiştirme, component render tetikleme — background'da UI yoktur, crash veya sessiz hata olur).
- Task süresini aşmak (iOS task'ı kill eder, Android'de process öldürülür — işi süre limitine sığdırmak veya parçalara bölmek gerekir).
- Background execution'ı garanti varsaymak (OS, istediği zaman, istediği nedenle background task'ı durdurabilir veya hiç başlatmayabilir — uygulama bu duruma dayanıklı olmalıdır).
- Arka planda aşırı sık ağ isteği yapmak (pil ve veri tüketir, OS tarafından "kötü davranışlı uygulama" olarak işaretlenebilir).
- Background task'ı kaydetmeden (register) uygulamayı kapatınca çalışmasını beklemek (task kayıtlı değilse OS onu tetiklemez).
- Her uygulama için background task kullanmak (çoğu uygulama gerçek background execution'a ihtiyaç duymaz — gereksiz kullanım pil tüketir ve kullanıcı güvenini sarsar).

---

# 27. Platform Adaptation Anti-Pattern Listesi

Aşağıdaki davranışlar bu proje kapsamında zayıf kabul edilir:

1. Her şeyi birebir aynı yapmaya çalışmak
2. En küçük farkta iki ayrı ürün gibi davranmak
3. Implementation parity’yi başarı metriği yapmak
4. Platform bahanesiyle feature kalitesini düşürmek
5. Bir platformda kritik görevi eksik bırakmak
6. Hover’a bağımlı bilgi veya aksiyon tasarlamak
7. Mobil ergonomisini web ile aynı görünmek için bozmak
8. Web yoğunluğunu mobilde kör kopyalamak
9. Feedback, navigation veya form davranışlarını platforma göre ürün mantığını bozacak şekilde ayrıştırmak
10. Shared code oranını kalite göstergesi yapmak
11. Keyfi ve belgesiz platform-specific farklar açmak
12. A11y kalitesini platform farkı bahanesiyle düşürmek
13. Design parity’yi gözden çıkarmak
14. Gesture’ı tek erişim yolu yapmak
15. Teknik kolaylık için yanlış adaptasyonu meşrulaştırmak

---

# 28. Platform Adaptation Kararı Verirken Sorulacak Sorular

Bir platform farkı tasarlarken şu sorular sorulmalıdır:

1. Bu fark neden gerekli?
2. Bu fark behavior mı değiştiriyor, sadece presentation mı?
3. Kullanıcı aynı görevi iki platformda da güvenle tamamlayabiliyor mu?
4. Bu fark platform ergonomisini gerçekten iyileştiriyor mu?
5. Bu fark design system ve visual language’i koruyor mu?
6. Bu fark accessibility açısından güvenli mi?
7. Bu fark performance ve bakım maliyeti açısından mantıklı mı?
8. Bu fark shared code zorlaması yüzünden mi ortaya çıktı?
9. Bu fark geçici mi, kalıcı mı?
10. Bu farkı 6 ay sonra savunabilir miyiz?

---

# 29. Sonraki Dokümanlara Etkisi

## 29.1. Contribution guide
`30-contribution-guide.md`, platform-specific değişiklik açan contributor’dan adaptation gerekçesini bu belgeye göre istemelidir.

## 29.2. Audit checklist
`31-audit-checklist.md`, web ve mobil behavior/design parity denetimini bu belgeye göre yapmalıdır.

## 29.3. Definition of done
`32-definition-of-done.md`, cross-platform feature’ların done sayılması için parity ve kabul edilebilir adaptation koşullarını bu belgeye bağlamalıdır.

## 29.4. Visual implementation contract
`33-visual-implementation-contract.md`, screenshot-faithful implementasyonda platformlar arası hangi farkların meşru olduğunu bu belgeyle uyumlu yorumlamalıdır.

## 29.5. HIG enforcement strategy
`34-hig-enforcement-strategy.md`, özellikle mobil tarafta Apple HIG ile uyumlu adaptation sınırlarını bu belgeyle birlikte değerlendirmelidir.

## 29.6. ADR-007 styling kararları
`ADR-007-styling-tokens-and-theming-implementation.md`: ADR-007, platform adaptation'da styling kararlarının canonical otoritesidir. Web ve mobil arasındaki token tüketimi, theme mapping ve styling farklılaşması, ADR-007'deki implementasyon kararlarıyla uyumlu olmalıdır.

---

# 30. Onay Kriterleri

Bu doküman yeterli kabul edilir eğer:

1. Behavior parity, design parity ve implementation parity net ayrılmışsa,
2. Platform farklarının hangi alanlarda kabul edilebilir olduğu tanımlanmışsa,
3. Navigation, density, input, hover/touch, overlay, data-dense surfaces, gestures ve feedback adaptation kuralları görünür kılınmışsa,
4. Kabul edilebilir ve edilemez farklılaşma ölçütleri yazılmışsa,
5. Dokümantasyon gerektiren adaptation kararları ayrılmışsa,
6. Anti-pattern’ler net biçimde tanımlanmışsa,
7. Sonraki contribution, audit, DoD ve visual contract belgelerine uygulanabilir temel sağlanmışsa.

---

# 31. Kısa Sonuç

Bu dokümanın ana çıktısı şudur:

> Bu boilerplate kapsamında platform adaptation, web ve mobile iki ayrı ürün gibi davranmak da değildir, her şeyi kör kopya yapmak da değildir; ürünün temel görev mantığını, kalite standardını ve tasarım dilini korurken platform ergonomisine saygılı, sınırlı ve gerekçeli farklılaşmalar yapma disiplinidir. Implementation parity bu sürece hizmet eder; onu yönetmez.

---

# 32. Background Tasks ve Platform Kısıtları (2026-04-01 Eki)

## 32.1. Background task platformları

### 32.1.1. iOS

iOS'ta background task'lar `BGTaskScheduler` API'si üzerinden yönetilir. OS, task'ları kendi programına göre çalıştırır; minimum ~15 dakika aralıkla tetikleme mümkündür ancak garanti edilmez. Background execution time varsayılan olarak ~30 saniye ile sınırlıdır. OS, kaynak durumuna ve kullanıcı davranış pattern'ine göre task'ları geciktirebilir veya atlayabilir.

### 32.1.2. Android

Android'de `WorkManager` background task yönetimi için tercih edilen API'dir. iOS'a kıyasla daha esnek constraint'ler sunar (ağ durumu, şarj durumu, idle durumu). Ancak battery optimization (Doze mode, App Standby) task zamanlama ve çalışma süresini doğrudan etkiler. OEM'lere göre (Samsung, Xiaomi vb.) agresif battery optimization farkları olabilir.

### 32.1.3. Web

Web platformunda background task'lar `Service Worker` üzerinden yönetilir. Background Sync API ile offline durumda biriken işlemler bağlantı geldiğinde senkronize edilebilir. Push API ile sunucu tetiklemeli background çalışma mümkündür.

## 32.2. Background fetch stratejisi

### 32.2.1. Canonical araç

Bu projede background task yönetimi için **expo-task-manager** canonical araçtır. expo-task-manager, iOS BGTaskScheduler ve Android WorkManager üzerinde platform-agnostic bir abstraction sağlar.

### 32.2.2. Zamanlama belirsizliği

OS tarafından delay riski mevcuttur. Planlanan bir background fetch, gerçek koşullara göre 45 dakika ile 2 saat arası gecikebilir. Bu nedenle:
- Zaman-kritik işlemler background fetch'e bırakılmamalıdır.
- Background fetch, önbellek güncelleme ve veri ön yükleme gibi "nice-to-have" işlemler için kullanılmalıdır.
- Kullanıcıya "veriler en son X tarihinde güncellendi" bilgisi gösterilmelidir.

### 32.2.3. Battery optimization'a saygı

Battery optimization ayarlarına müdahale edilmemeli, kullanıcı bu ayarları kontrol etmelidir. Uygulama, battery optimization aktifken graceful degradation yapmalıdır.

## 32.3. Background geolocation

### 32.3.1. Kullanım ilkesi

Background geolocation yalnızca ürün açısından gerçekten gerektiğinde kullanılmalıdır. Battery etkisi büyüktür ve kullanıcı güvenini zedeleyebilir. Ürün, konum verisini neden background'da topladığını kullanıcıya net ve anlaşılır biçimde açıklamalıdır.

### 32.3.2. Motion detection ile akıllı GPS kullanımı

Sürekli GPS sorgusu yerine motion detection (accelerometer) ile kullanıcının hareket edip etmediği tespit edilmeli, GPS yalnızca hareket algılandığında aktive edilmelidir. Bu yaklaşım batarya tüketimini önemli ölçüde azaltır.

### 32.3.3. Geofencing

Polygon-based geofencing, belirli coğrafi alanlarla ilgili tetiklemeler için kullanılabilir. Geofencing batarya bilinçli olmalıdır; çok sayıda geofence tanımlamak batarya tüketimini artırır.

### 32.3.4. Always-on location izni

Always-on (her zaman) konum izni kullanılacaksa, kullanıcıya net açıklama zorunludur:
- Neden sürekli konum gerektiği
- Batarya etkisi
- Veri gizliliği politikası

iOS ve Android app store review süreçleri always-on location kullanımını detaylı gerekçe ile sorgular.

## 32.4. Platform-specific kısıtlamalar

### 32.4.1. iOS kısıtlamaları

- Background execution time limiti varsayılan olarak **30 saniye**dir.
- `beginBackgroundTask` ile ek süre istenebilir ancak garanti değildir.
- OS, kullanıcı tarafından sık kullanılmayan uygulamaların background task'larını deprioritize eder.
- Background fetch aralığı OS kontrolündedir; minimum aralık belirlenebilir ancak OS buna uymak zorunda değildir.

### 32.4.2. Android kısıtlamaları

- **Doze mode:** Cihaz hareketsiz ve şarjda değilse, background task'lar maintenance window'lara kadar ertelenir.
- **App Standby:** Kullanıcının sık kullanmadığı uygulamalar standby bucket'larına alınır ve background erişimleri kısıtlanır.
- OEM-specific kısıtlamalar (battery saver, memory cleaner) uygulamayı tamamen background'dan kill edebilir.

### 32.4.3. Ortak kısıtlama

Her iki platformda da OS, düşük kaynak durumlarında uygulamayı kill edebilir ve state kaybolabilir. Bu nedenle:
- Kritik state'ler kalıcı depolamaya yazılmalıdır (AsyncStorage, SQLite, SecureStore).
- Background task'lar idempotent olmalıdır (tekrar çalıştırılabilir, yan etkisiz).
- Task başarısız olursa retry mekanizması düşünülmelidir.

---

# 33. Share Extension ve Platform Paylaşım (2026-04-01 Eki)

## 33.1. Cross-platform share sheet

### 33.1.1. Canonical araç

Bu projede paylaşım için **expo-sharing** canonical araçtır. expo-sharing, platform-native share sheet'i tetikleyerek dosya, metin ve URL paylaşımını destekler.

### 33.1.2. Paylaşım kuralları

- Dosya, metin ve URL paylaşımı desteklenmelidir.
- Platform-native share sheet kullanılmalıdır; custom UI ile share modal oluşturulmamalıdır.
- Paylaşılan içeriğin formatı paylaşım hedefine uygun olmalıdır (ör. URL paylaşılırken Open Graph meta verileri düşünülmeli).
- Paylaşım işlemi tamamlandığında veya iptal edildiğinde kullanıcıya feedback verilmelidir.

## 33.2. Share extension (gelen paylaşımlar)

### 33.2.1. iOS share extension

iOS'ta uygulamaya dışarıdan içerik paylaşılması (share extension) native modül gerektirir. Expo managed workflow'da share extension sınırlıdır; config plugin veya custom dev client gerektirebilir.

### 33.2.2. Android share target

Android'de uygulama share target olarak intent-filter tanımıyla yapılandırılır. AndroidManifest.xml'de uygun intent-filter tanımlanarak diğer uygulamalardan içerik alınabilir.

### 33.2.3. Expo workflow sınırları

Share extension (gelen paylaşımlar) Expo managed workflow'da tam desteklenmez. Bu özellik gerektiğinde:
- Custom dev client kullanılmalıdır.
- EAS Build ile native modül entegrasyonu yapılmalıdır.
- Bu sınırlama ADR-002 (Expo SDK) kararının beklenen bir sonucudur.

## 33.3. Clipboard yönetimi

### 33.3.1. Canonical araç

Bu projede clipboard işlemleri için **expo-clipboard** canonical araçtır.

### 33.3.2. Güvenlik kuralları

- Hassas veri (şifre, token, kredi kartı numarası) clipboard'a kopyalanırsa kullanıcıya uyarı gösterilmelidir.
- Clipboard'a yazılan hassas verinin belirli süre sonra temizlenmesi düşünülmelidir.
- Clipboard içeriği log'lara yazılmamalıdır.

### 33.3.3. iOS 16+ clipboard erişim bildirimi

iOS 16 ve sonrası sürümlerde uygulama clipboard'a eriştiğinde kullanıcıya sistem düzeyinde bildirim gösterilir. Bu nedenle:
- Gereksiz clipboard okuma işlemlerinden kaçınılmalıdır.
- Clipboard okuma yalnızca kullanıcı aksiyonu tetiklediğinde yapılmalıdır (ör. "Yapıştır" butonuna basma).
- Otomatik clipboard okuma (ör. OTP algılama) kullanıcı farkındalığı ile yapılmalıdır.

---

# 34. App Clips ve Instant Apps (2026-04-01 Eki)

## 34.1. iOS App Clips

### 34.1.1. Temel özellikler

App Clip, tam uygulamanın küçük bir bölümünü indirmeden deneyimleme imkanı sunar:
- Bundle boyutu **15 MB** altında olmalıdır.
- NFC tag, QR kod, Safari Smart Banner veya iMessage üzerinden tetiklenebilir.
- App Clip, kullanıcıyı tam uygulamaya yönlendiren bir dönüşüm hunisi olarak tasarlanmalıdır.

### 34.1.2. Expo workflow sınırları

App Clips, Expo managed workflow'da doğrudan desteklenmez. Gerektiğinde:
- EAS Build ile custom native configuration yapılmalıdır.
- App Clip target'ı Xcode üzerinden yapılandırılmalıdır.
- Bu alan ileri düzey bir gereksinim olup, ürün kararına bağlıdır.

### 34.1.3. Dönüşüm hunisi

App Clip → tam uygulama dönüşüm hunisi şu adımları içerir:
- App Clip deneyimi sırasında tam uygulamanın değer önerisi gösterilmeli
- Kolay geçiş: App Store yönlendirmesi tek dokunuşla erişilebilir olmalı
- State transferi: App Clip'te oluşturulan veri tam uygulamaya aktarılabilmeli

## 34.2. Android Instant Apps

### 34.2.1. Temel özellikler

Android Instant Apps, feature module bazlı delivery ile kullanıcının uygulamayı yüklemeden belirli özelliklerini kullanmasını sağlar. Google Play Instant entegrasyonu ile çalışır.

### 34.2.2. Feature module yapısı

Instant App desteği için uygulama feature module'lere ayrılmalıdır. Her module bağımsız olarak yüklenebilir ve çalıştırılabilir olmalıdır.

## 34.3. Karar kriteri

### 34.3.1. Opsiyonellik

App Clips ve Instant Apps, boilerplate seviyesinde **opsiyoneldir**. Bu özellikler ürün kararına bağlıdır ve her uygulama için gerekli değildir.

### 34.3.2. ADR genişletmesi

Bu özellik gerektiğinde ADR-002 (React Native + Expo SDK) genişletmesi olarak ele alınmalıdır. Ayrı bir ADR oluşturularak:
- Teknik gereksinimler
- Bundle boyutu kısıtlamaları
- Expo workflow etkileri
- Test stratejisi
belgelenmelidir.

## 34.4. Hazırlık rehberi niteliği

Bu bölüm, boilerplate için **hazırlık rehberi** niteliğindedir. Zorunlu implementasyon değildir. Amacı, ürün geliştirme sürecinde App Clips veya Instant Apps ihtiyacı doğduğunda ekibin doğru kararları hızlıca alabilmesi için temel bilgi sağlamaktır.
