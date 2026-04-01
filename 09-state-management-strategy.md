# 09-state-management-strategy.md

## Doküman Kimliği

- **Doküman adı:** State Management Strategy
- **Dosya adı:** `09-state-management-strategy.md`
- **Doküman türü:** Strategy / application state / ownership and lifecycle document
- **Durum:** Accepted
- **Kapsam:** Bu boilerplate kapsamında state kavramının türlerini, sahiplik mantığını, local/feature/app-global/server/form/persisted/derived state ayrımlarını, state ömrünü, state’in nerede tutulacağını, ne zaman paylaşılacağını, ne zaman persist edileceğini, cross-platform etkisini ve state yönetiminde kabul edilmeyen anti-pattern’leri tanımlar.
- **Bağlı olduğu üst dokümanlar:**
  - `06-application-architecture.md`
  - `07-module-boundaries-and-code-organization.md`
  - `08-navigation-and-flow-rules.md`
  - `10-data-fetching-cache-sync.md`
  - `11-forms-inputs-and-validation.md`
  - `27-security-and-secrets-baseline.md`
  - `ADR-004-state-management.md`
- **Doğrudan etkileyeceği dokümanlar:**
  - `14-testing-strategy.md`
  - `20-initial-implementation-checklist.md`
  - `21-repo-structure-spec.md`
  - `25-error-empty-loading-states.md`
  - `26-platform-adaptation-rules.md`
  - `30-contribution-guide.md`
  - `31-audit-checklist.md`
  - `32-definition-of-done.md`

---

# 1. Amaç

Bu dokümanın amacı, state yönetimini “hangi store kütüphanesini seçelim?” seviyesinden çıkarıp; **hangi bilginin sahibi kim, ne kadar yaşar, ne zaman sıfırlanır, ne zaman paylaşılır, ne zaman persist edilir ve ne zaman aslında state bile değildir** sorularına bağlı sistematik stratejiye dönüştürmektir.

Bu belge şu sorulara net cevap verir:

1. State bu projede hangi ana türlere ayrılır?
2. Server state ile client-side UI state arasındaki fark nedir?
3. Bir bilginin local kalması mı, feature içinde tutulması mı, app-global olması mı gerektiği nasıl anlaşılır?
4. Persist edilen state için hangi güvenlik ve stale veri riskleri düşünülmelidir?
5. Form state neden ayrı ele alınmalıdır?
6. Derived state neden çoğu zaman ayrıca saklanmamalıdır?
7. Cross-platform ürün bağlamında state paylaşımı hangi düzeyde doğru, hangi düzeyde zararlıdır?
8. Hangi state yönetimi davranışları bu proje kapsamında doğrudan zayıf kabul edilir?

Bu belge belirli bir kütüphane API’sini anlatmaz.  
Bu belge, **state’in doğru yere yerleştirilme mantığını** tanımlar.

---

# 2. Neden Bu Doküman Gerekli

Projelerde state yönetimi genellikle şu üç kötü yoldan biriyle bozulur:

## 2.1. Her şey global store’a atılır

Bu durumda:
- local UI state bile app-global olur,
- feature sınırları kaybolur,
- bir ekranın problemi tüm uygulamaya yayılır,
- debug ve reset mantığı zorlaşır,
- stale bilgi ve cleanup sorunları artar.

## 2.2. Her şey component-local bırakılır

Bu durumda:
- aynı feature içindeki ekran/section’lar veri paylaşamaz,
- orchestration zorlaşır,
- tekrar eden senkronizasyon kodları çıkar,
- form, filter, pagination, retry gibi konular dağılır.

## 2.3. Server state ile client state karıştırılır

Bu durumda:
- API’den gelen veri duplicate edilir,
- cache ve invalidation disiplini bozulur,
- aynı veri hem query cache’te hem store’da hem local state’te yaşar,
- neyin source of truth olduğu belirsizleşir.

Bu proje kapsamında state yönetiminin ana problemi kütüphane eksikliği değildir.  
Ana problem, **yanlış sahiplik ve yanlış ömür modelidir**.

---

# 3. Temel Tez

Bu proje kapsamında temel tez şudur:

> State yönetimi; veriyi tek yerde toplama işi değil, bilginin sahibi, ömrü, kapsamı, türetilebilirliği, senkronizasyon biçimi ve güvenlik/staleness riski üzerinden doğru katmana yerleştirme işidir.

Bu tez şu sonuçları doğurur:

1. Her bilgi state olmak zorunda değildir.
2. Her state global olmak zorunda değildir.
3. Server state çoğu zaman app-global mutable store konusu değildir.
4. Derived bilgi gereksiz yere ayrıca saklanmamalıdır.
5. Persist, convenience kararı değil; risk kararıdır.
6. State ownership belgelenmezse mimari hızla bozulur.

---

# 4. State Yönetimi İçin Karar Sırası

Bir bilginin nerede tutulacağına karar verirken aşağıdaki sıra izlenmelidir:

1. Bu bilgi gerçekten state mi?
2. Bu bilgi türetilebilir mi?
3. Bu bilgi server’dan mı geliyor?
4. Bu bilgi yalnızca tek component ağacını mı ilgilendiriyor?
5. Bu bilgi tek feature içinde mi yaşıyor?
6. Bu bilgi birden fazla feature/app shell tarafından mı kullanılıyor?
7. Bu bilgi navigation ile sıfırlanmalı mı?
8. Bu bilgi persist edilmeli mi?
9. Bu bilgi kullanıcı değişince/log out olunca silinmeli mi?
10. Bu bilgi platform-specific ergonomi yüzünden farklı mı ele alınmalı?

Bu sırayı atlayıp doğrudan “store’a atalım” demek çoğu zaman yanlış başlangıçtır.

---

# 5. State Türleri

Bu boilerplate kapsamında state en az şu ailelere ayrılmalıdır:

1. **Component-local UI state**
2. **Feature-local orchestration state**
3. **App-global UI/app state**
4. **Server state**
5. **Form state**
6. **Persisted preference or session-adjacent state**
7. **Derived/computed state**
8. **Ephemeral action state**
9. **Navigation-coupled state**
10. **Offline/queue state** (gerekiyorsa)

Her biri aşağıda ayrı ayrı tanımlanmıştır.

---

# 6. Component-Local UI State

## 6.1. Tanım

Yalnızca belirli bir component veya çok dar bir component ağacı için anlamlı olan, kısa ömürlü ve çoğu zaman görsel/interaction amaçlı state’tir.

## 6.2. Örnekler

- accordion açık/kapalı bilgisi
- local tab seçimi
- password görünür/gizli toggle
- dropdown açık/kapalı bilgisi
- küçük hover/focus visual flags
- geçici inline selection
- row expanded/collapsed state
- temporary input reveal flags

## 6.3. Ne zaman doğru seçimdir?

Aşağıdaki koşulların çoğu sağlanıyorsa local state doğru adaydır:
- yalnızca tek component veya çok dar alt ağaç kullanıyorsa
- route değişince sıfırlanması doğalsa
- başka feature veya shell alanının ihtiyacı yoksa
- persistence gerektirmiyorsa
- business rule taşımıyorsa
- server senkronizasyonuna bağlı değilse

## 6.4. Neden global yapılmamalıdır?

Bu tip state global yapılırsa:
- gereksiz rerender riski artar,
- cleanup zorlaşır,
- test yüzeyi büyür,
- feature sınırı bulanıklaşır,
- global store gereksiz gürültü üretir.

## 6.5. Zayıf davranış örnekleri

- modal içindeki “şifreyi göster” state’ini global store’a koymak
- tek ekrana ait local tab state’ini app-wide yapmak
- list item expand state’ini merkezi store’a taşımak

---

# 7. Ephemeral Action State

## 7.1. Tanım

Bir kullanıcı aksiyonunun çok kısa ömürlü işlem durumunu temsil eden state’tir.

## 7.2. Örnekler

- bir button’ın loading durumu
- tek satırlık “kaydediliyor” işareti
- inline retry pending durumu
- transient action success hint
- optimistic update pending marker

## 7.3. Kural

Bu state çoğu zaman:
- local,
- component yakınında,
- veya feature orchestration düzeyinde
yaşamalıdır.

Her action pending state’ini global store’a taşımak zayıftır.

## 7.4. Zayıf davranışlar

- tek button loading bilgisini app-global yapmak
- transient feedback state’ini kalıcı store state’e dönüştürmek
- action-level pending bilgiyi screen reset sonrası gereksiz tutmak

---

# 8. Feature-Local Orchestration State

## 8.1. Tanım

Belirli bir feature veya ekran akışı içinde birden fazla component, section veya interaction adımı arasında paylaşılan ve o feature bağlamında anlamlı olan state’tir.

## 8.2. Örnekler

- çok adımlı akışta seçilen seçenekler
- ekran bazlı filtre/sort/pagination state’i
- geçici draft composition state’i
- section’lar arası koordinasyon bilgisi
- seçim sonrası confirmation akışının local feature durumu
- wizard step progression state’i
- detail screen içi local orchestration state’i

## 8.3. Ne zaman doğru seçimdir?

- birden fazla component kullanıyorsa
- ama app-global olmaya gerek yoksa
- feature dışı reuse ihtiyacı yoksa
- navigation bağlamı ile doğal yaşam döngüsü varsa
- persistence gereksinimi sınırlıysa veya yoksa

## 8.4. Nerede yaşamalı?

Bu state çoğu zaman:
- feature module içinde,
- screen orchestration katmanında,
- feature-level store/hook/view-model benzeri alanda
yaşamalıdır.

## 8.5. Zayıf davranışlar

- feature-local filter state’ini app-global yapmak
- aynı feature içindeki coordination state’ini her component’e prop drilling ile dağıtmak
- feature orchestration state’ini sırf “shared olsun” diye yukarı taşımak

---

# 9. Navigation-Coupled State

## 9.1. Tanım

Route, screen instance, modal lifecycle veya navigation stack ile anlamlı biçimde ilişkili state’tir.

## 9.2. Örnekler

- current route params’dan türeyen selection
- modal açıldığında başlayan, kapanınca biten orchestration state
- stack içinde geçici draft
- route-based tab/filter state
- detail instance’a özel section expansion state

## 9.3. Kural

Navigation-coupled state için şu açık olmalıdır:
- route ile mi taşınıyor?
- local feature state olarak mı yaşıyor?
- geri dönüşte korunmalı mı?
- screen remount ile sıfırlanmalı mı?

## 9.4. Zayıf davranışlar

- route ile gitmesi gereken bilgiyi gizli global state’te tutmak
- screen instance state’ini app-wide tutmak
- navigation reset sonrası temizlenmeyen stale local flow state’i

---

# 10. App-Global UI / App State

## 10.1. Tanım

Birden fazla feature, app shell veya geniş uygulama yüzeyi tarafından tüketilen, uygulama seviyesinde anlamlı olan state’tir.

## 10.2. Güçlü örnekler

- theme mode
- locale
- authenticated user shell summary
- global announcement visibility
- app-wide capability summary
- session-adjacent shell state
- global UI chrome state (bağlama göre)
- top-level app preferences

## 10.3. Ne zaman gerçekten global olmalı?

Aşağıdakilerin çoğu sağlanıyorsa:
- birden fazla feature kullanıyor
- route değişse de yaşamaya devam etmeli
- app shell bunu bilmek zorunda
- local/feature tutmak yapay olur
- duplication veya prop drilling üretmeden çözülemiyor

## 10.4. Ne zaman global yapılmamalı?

- yalnızca tek feature kullanıyorsa
- route bazlı ise
- screen instance’a özel ise
- navigation reset ile sıfırlanmalıysa
- server state’in kopyasıysa

## 10.5. Zayıf davranışlar

- her seçimi global state yapmak
- screen filter’ını app-global store’da tutmak
- query response’u global state’e kopyalamak
- local modal state’ini global app state’e taşımak

---

# 11. Server State

## 11.1. Tanım

Sunucudan gelen, zamanla stale olabilen, cache’e tabi, invalidation/revalidation gerektiren ve genellikle kullanıcı intent’i dışında da güncelliği değişebilen veridir.

## 11.2. En kritik ayrım

Server state, “uygulamanın kendi mutable UI state’i” değildir.  
Server state:
- fetch edilir,
- cache’lenir,
- stale olabilir,
- tekrar doğrulanır,
- invalidation ister.

## 11.3. Örnekler

- list endpoint verileri
- detail response’ları
- profil summary
- dashboard cards data
- server-driven settings
- backend status data
- mutation sonrası yenilenmesi gereken kaynaklar

## 11.4. Kural

Server state mümkün olduğunca:
- query/cache mantığıyla ele alınmalı,
- local/global client store’a gereksiz kopyalanmamalı,
- source of truth karışıklığı yaratmamalıdır.

## 11.5. Neden kopya store’a alınmamalı?

Çünkü bu durumda:
- aynı veri iki yerde yaşar,
- hangisi güncel bilinmez,
- invalidation zorlaşır,
- stale bug’ları artar,
- gereksiz senkronizasyon kodu oluşur.

## 11.6. Zayıf davranışlar

- API response’u aldıktan sonra her şeyi global store’a yazmak
- cache sistemi varken manuel query synchronization yapmak
- aynı server datasını hem query cache’te hem local store’da hem component state’te tutmak

---

# 12. Client State ile Server State Arasındaki En Kritik Fark

## 12.1. Client state

- uygulamanın kendi ürettiği ya da local yönettiği bilgi
- kullanıcı etkileşimi ile direkt şekillenir
- route / feature / component ownership’e bağlıdır

## 12.2. Server state

- dış kaynaktan gelir
- stale olabilir
- revalidation ister
- source of truth uygulama değil backend tarafındadır

## 12.3. Kural

Server state’i normal UI state gibi taşımak ciddi mimari hatadır.

---

# 13. Form State

## 13.1. Tanım

Bir formun field değerleri, touched/dirty bilgisi, submit durumu, validation durumu, field-level error ilişkileri ve submit lifecycle bilgilerini kapsayan state ailesidir.

## 13.2. Neden ayrı düşünülmeli?

Form state:
- normal component-local state’e benzemez,
- server state de değildir,
- generic app-global state de değildir.

Form state’in kendi lifecycle ve validation ihtiyaçları vardır.

## 13.3. Örnekler

- values
- touched
- dirty
- submitAttempted
- submitPending
- form-level error
- field-level errors
- helper state
- reset state

## 13.4. Kural

Form state, forms standardına uygun ayrı bir alan olarak düşünülmelidir.  
Tüm formu generic global store’a atmak zayıftır.

## 13.5. Zayıf davranışlar

- her input için ayrı app-global store alanı açmak
- field errors’ı local rastgele state ile dağıtmak
- form validation state’ini UI’dan kopuk ve dağınık çözmek

---

# 14. Persisted Preference State

## 14.1. Tanım

Kullanıcının uygulamada tekrar görmek isteyebileceği, güvenlik açısından nispeten düşük riskli ve logout ile davranışı net tanımlanabilen tercih state’idir.

## 14.2. Güçlü örnekler

- theme preference
- locale preference
- density preference
- onboarding completed flags
- dismissed non-critical educational banners
- sort preference (bağlama göre)
- harmless UI configuration choices

## 14.3. Kural

Persist edilen tercih state’i:
- açıkça tanımlı olmalı,
- güvenlik riski düşük olmalı,
- stale kalırsa ürün bozulmamalı,
- kullanıcı değişince davranışı belli olmalıdır.

## 14.4. Zayıf davranışlar

- tüm local state’i “belki lazım olur” diye persist etmek
- logout sonrası kullanıcıya ait tercihleri yanlış kullanıcıya taşımak
- preference ile sensitive session bilgilerini aynı depoda aynı önemle tutmak

---

# 15. Session-Adjacent State

## 15.1. Tanım

Doğrudan secret/session artifact olmayan ama oturum bağlamı ile sıkı ilişkili olan state’tir.

## 15.2. Örnekler

- current workspace selection
- session-scoped capabilities summary
- user-scoped recent context
- account-dependent feature availability hints

## 15.3. Kural

Bu state için şu net olmalıdır:
- logout sonrası silinir mi?
- user switch sonrası reset gerekir mi?
- persist edilirse yanlış kullanıcıya sızma riski var mı?

## 15.4. Zayıf davranışlar

- user-scoped state’i device-scoped kalıcı preference gibi ele almak
- logout sonrası session-adjacent bilgileri bırakmak
- auth değişince stale capability state’ini korumak

---

# 16. Offline / Queue State

## 16.1. Ne zaman gündeme gelir?

Uygulama çevrimdışı veya zayıf bağlantı senaryolarını anlamlı biçimde destekleyecekse, pending actions veya offline queue state’i ayrı ele alınmalıdır.

## 16.2. Örnekler

- send later queue
- offline mutation queue
- sync pending drafts
- local changes not yet confirmed by backend

## 16.3. Kural

Bu state:
- server state değildir,
- sıradan UI state de değildir,
- veri bütünlüğü riski taşır.

Bu yüzden lifecycle’i çok açık tanımlanmalıdır.

## 16.4. Sorulması gerekenler

- queue ne zaman flush olur?
- retry nasıl çalışır?
- conflict nasıl görünür olur?
- kullanıcı pending işlemi görebilir mi?
- logout olunca ne olur?
- aynı user/workspace bağlamı korunuyor mu?

---

# 17. Derived / Computed State

## 17.1. Tanım

Mevcut state veya veriden hesaplanabilen, ayrıca mutable source olarak tutulması gerekmeyen bilgidir.

## 17.2. Örnekler

- `isEmpty`
- `isReady`
- `hasBlockingError`
- filtered list
- grouped items
- button enabled/disabled condition
- computed summary
- sorted view
- visible sections

## 17.3. Kural

Türetilmiş bilgi mümkün olduğunca:
- gerektiğinde hesaplanmalı,
- memoization gerekiyorsa kontrollü kullanılmalı,
- ayrıca mutable store state’e dönüştürülmemelidir.

## 17.4. Neden?

Derived state ayrıca saklanırsa:
- source of truth çoğalır,
- senkronizasyon bozulur,
- bug riski artar,
- invalidation daha karmaşık hale gelir.

## 17.5. Zayıf davranışlar

- `items` varken ayrıca `filteredItems`, `visibleItems`, `sortedItems`, `finalItems` gibi birden fazla mutable state tutmak
- `isValid` bilgisini validation kuralından türetmek yerine ayrıca state yapmak
- query success’ten türetilebilecek `isReady` bilgisini manuel set etmek

---

# 18. State Ownership Nasıl Belirlenir?

Her state alanı için şu sorular sırayla sorulmalıdır:

1. Bu bilgi kimin işine yarıyor?
2. Bu bilgi nerede üretiliyor?
3. Bu bilgi kaç ekran/feature kullanıyor?
4. Route değişince bitmeli mi?
5. User change/logout ile sıfırlanmalı mı?
6. Persist edilmesi gerçekten gerekli mi?
7. Server’dan geliyorsa neden ayrıca store’a alınsın?
8. Bu bilgi hesaplanabilir mi?
9. Yanlış yerde tutulursa kim zarar görür?
10. Test etmek için en doğru yer neresi?

Bu sorular state placement kararının çekirdeğidir.

---

# 19. State Lifetime Modeli

State yalnızca “nerede tutuluyor?” sorusuyla yönetilemez.  
Ayrıca “ne kadar yaşıyor?” sorusu da cevaplanmalıdır.

## 19.1. Çok kısa ömürlü
- pressed/loading local state
- temporary panel visibility
- inline local selection

## 19.2. Screen lifetime
- screen filter
- modal draft
- route instance state
- detail screen local orchestration

## 19.3. Feature lifetime
- multi-step flow progress
- feature-local draft
- section coordination state

## 19.4. App lifetime
- theme
- locale
- current authenticated shell summary
- workspace/session context

## 19.5. Persisted lifetime
- remembered preferences
- onboarding flags
- certain draft states
- offline queues (riskli ama gerekli olabilir)

## 19.6. Kural

Ömür yanlış belirlenirse:
- state ya gereksiz kaybolur,
- ya gereksiz uzun kalır,
- ya da yanlış kullanıcıya taşar.

---

# 20. Reset Kuralları

Her önemli state için açık olmalıdır:

- route change sonrası reset olur mu?
- modal close sonrası reset olur mu?
- submit success sonrası reset olur mu?
- logout sonrası reset olur mu?
- workspace/account switch sonrası reset olur mu?
- hard refresh/app restart sonrası kalır mı?

Bu sorular belirsizse state davranışı da belirsiz olur.

---

# 21. Persist Kararı Verirken Sorulacak Sorular

Persist kararı convenience ile değil, kontrollü sorularla alınmalıdır:

1. Bu bilgi tekrar açıldığında gerçekten faydalı mı?
2. Yanlış kullanıcıya taşınırsa risk ne?
3. Stale kalırsa kullanıcıyı yanıltır mı?
4. Security açısından hassas mı?
5. Session-bound mı, device-bound mı?
6. Bozulursa recovery kolay mı?
7. Sadece o anlık flow için mi gerekliydi?
8. Server state’i gereksiz yere yerelde mi tutuyoruz?

---

# 22. State Sharing Kararı Verirken Sorulacak Sorular

Bir state’i yukarı taşımadan önce:

1. Kaç tüketici var?
2. Bunlar aynı feature içinde mi?
3. Bu paylaşım gerçek mi, geçici mi?
4. Prop drilling’den kaçmak için mi yukarı taşıyoruz, yoksa gerçekten owner değişti mi?
5. Shared yapınca API sadeleşiyor mu, karmaşıklaşıyor mu?
6. Test ve cleanup daha iyi mi olacak, daha kötü mü?

---

# 23. State ve Navigation İlişkisi

## 23.1. Kritik ayrım

Bazı state:
- route param olarak taşınmalıdır,
- bazı state feature-local tutulmalıdır,
- bazı state ise hiçbir şekilde URL/route’a çıkmamalıdır.

## 23.2. Web ve mobile için yorum

Behavior parity korunmalı ama taşıma biçimi platforma göre değişebilir.  
Örneğin:
- web’de URL ile görünür filter state,
- mobilde screen-local orchestration + restore behavior
birlikte düşünülebilir.

## 23.3. Kural

Navigation-coupled state, gizli global store ile taşınmamalıdır eğer geri dönüş/yeniden giriş anlamı bozuluyorsa.

---

# 24. State ve Forms İlişkisi

Formlar state yönetiminin en çok yanlış yere taşındığı alanlardan biridir.

## 24.1. Kural

Form state:
- ayrı lifecycle olarak düşünülmeli,
- field state, validation state ve submit state ayrılmalı,
- raw global store dumping yapılmamalı,
- feature submit orchestration ile form engine karıştırılmamalıdır.

## 24.2. Yanlış yaklaşım örnekleri

- her field value’yu app-global store’a yazmak
- submit error’u local bir text state ile rastgele çözmek
- dirty/touched mantığını tamamen ihmal etmek

---

# 25. State ve Server Cache İlişkisi

## 25.1. Temel kural

Query/cache sistemi varsa, server state’in ana evi orasıdır.  
UI store yalnızca gerçekten UI-specific derived intent taşımalıdır.

## 25.2. Zayıf örnekler

- query result’u aldıktan sonra global store’da aynı listeyi tekrar tutmak
- mutation sonrası hem local array patch hem invalidation hem başka kopya state güncellemesi yapmak
- stale cache’i anlamadan derived UI decisions almak

---

# 26. State ve Security İlişkisi

## 26.1. Neden ilgili?

Bazı state alanları güvenlik açısından hassastır:
- session-adjacent state
- auth artifacts
- workspace/user scoped info
- local drafts
- offline queues
- debug-visible flags

## 26.2. Kural

State placement kararı verilirken güvenlik sorulmalıdır:
- bu veri log’a düşebilir mi?
- persist edilirse risk var mı?
- logout sonrası temizleniyor mu?
- wrong-user leak ihtimali var mı?

## 26.3. Zayıf davranışlar

- user-scoped hassas context’i device-scoped state gibi bırakmak
- auth ilişkili state’i cleanup olmadan persist etmek
- state debug araçlarında hassas bilgi göstermek

---

# 27. State ve Cross-Platform İlişkisi

## 27.1. Paylaşılması güçlü state mantıkları

- domain-derived kararlar
- feature workflow intent
- validation logic
- app preference semantics
- server data ownership prensipleri

## 27.2. Platforma yakın kalabilecek alanlar

- keyboard/sheet/modal ergonomisine bağlı local state
- pointer vs touch UI state
- navigation shell specifics
- platform bridge coordination state

## 27.3. Kural

State paylaşımı implementation parity hedefiyle değil, behavior parity ve bakım doğruluğu ile değerlendirilmelidir.

---

# 28. State ve Testing İlişkisi

## 28.1. Doğru state placement test kalitesini artırır

- local state local testlenir
- orchestration state integration düzeyinde doğrulanır
- domain-derived state saf testlenir
- query/cache davranışı kendi katmanında doğrulanır

## 28.2. Yanlış placement test maliyetini artırır

- her şeyi global store’da toplamak
- server state’i duplicate store’a almak
- form state’i generic store’a gömmek
- derived bilgiyi ayrıca saklamak

---

# 29. State Naming Kuralları

State isimleri:
- role anlatmalı,
- kapsamı ima etmeli,
- “temp”, “misc”, “data2”, “newState” gibi belirsiz olmamalıdır.

Güçlü örnek mantıklar:
- `selectedFilters`
- `draftProfileForm`
- `isSubmitting`
- `activeWorkspace`
- `pendingSyncQueue`

Zayıf örnekler:
- `stuff`
- `data`
- `temp`
- `newValue`
- `globalStatePart2`

---

# 30. State Drift Sinyalleri

Aşağıdaki sinyaller state yönetiminin bozulduğunu gösterir:

1. Aynı bilginin birden fazla store/component/query katmanında yaşaması
2. UI’da sürekli “senkron tutma” kodu yazılması
3. Logout/user switch sonrası eski verinin görünmesi
4. Her yeni feature için global store alanı açılması
5. Screen-local behavior’ın app-wide hale gelmesi
6. Query cache ile manual store arasında yarış oluşması
7. Derived state bug’larının artması
8. Reset kurallarının belirsiz olması

---

# 31. State Management Anti-Pattern Listesi

Aşağıdaki davranışlar bu proje kapsamında zayıf kabul edilir:

1. Her şeyi global store’a koymak
2. Server state’i duplicate client store’a almak
3. Derived state’i mutable source olarak saklamak
4. Form state’i generic UI/app state ile karıştırmak
5. Local kalması gereken şeyi sırf prop drilling’den kaçmak için globalleştirmek
6. Persist kararını risksiz sanmak
7. Logout/user switch cleanup düşünmemek
8. Navigation-coupled state’i gizli global alanlarda taşımak
9. Session-adjacent state’i user-scoped olmadan saklamak
10. State ownership’i “sonra bakarız” diye belirsiz bırakmak
11. Query cache varken manual sync state kurmak
12. Ephemeral action state’i kalıcılaştırmak
13. Çok kısa ömürlü UI state’i app shell’e taşımak
14. Çok katmanlı state duplication’ını normalleştirmek
15. State placement kararını yalnızca kütüphane rahatlığı ile vermek

---

# 32. State Kararı Verirken Sorulacak Sorular

Bir state alanı eklerken şu sorular sorulmalıdır:

1. Bu gerçekten state mi, yoksa hesaplanabilir mi?
2. Server’dan mı geliyor?
3. Owner kim?
4. Kapsamı ne: component, feature, app?
5. Yaşam süresi ne?
6. Persist edilmeli mi?
7. User/session switch sonrası temizlenmeli mi?
8. Cross-platform behavior etkisi var mı?
9. Test etmek için en doğru katman hangisi?
10. Bu state yanlış yerde tutulursa hangi bug ailesi çıkar?

---

# 33. Sonraki Dokümanlara Etkisi

## 33.1. Data fetching / cache / sync
`10-data-fetching-cache-sync.md`, server state ve query/cache davranışını bu belgeyle uyumlu detaylandırmalıdır.

## 33.2. Forms / inputs / validation
`11-forms-inputs-and-validation.md`, form state lifecycle’ını bu stratejiyle hizalamalıdır.

## 33.3. Testing strategy
`14-testing-strategy.md`, state türlerine göre test seviyelerini bu belgeye bağlamalıdır.

## 33.4. Repo structure spec
`21-repo-structure-spec.md`, feature-local ve global state alanlarının fiziksel yerleşimini bu belgeye göre sağlamalıdır.

## 33.5. Definition of done
`32-definition-of-done.md`, state ownership, reset ve persistence kararlarının kapatılmasını done kriterine bağlamalıdır.

## 33.6. ADR-004 ilişkisi
`ADR-004-state-management.md`: Bu belgedeki state ownership, local-first varsayılan ve store açma politikası, ADR-004'te verilen Zustand kararının stratejik detaylandırmasıdır. ADR-004, bu belgenin canonical karar otoritesidir.

---

# 34. Onay Kriterleri

Bu doküman yeterli kabul edilir eğer:

1. State türleri açıkça ayrılmışsa,
2. Local / feature / app-global / server / form / persisted / derived state farkları net tanımlanmışsa,
3. Ownership, lifetime, reset ve persistence kuralları görünür kılınmışsa,
4. Server state ile client state ayrımı operasyonel biçimde açıklanmışsa,
5. Security ve cross-platform etkisi düşünülmüşse,
6. Drift sinyalleri ve anti-pattern’ler yazılmışsa,
7. Sonraki data, forms, testing ve DoD belgelerine uygulanabilir temel sağlanmışsa.

---

# 35. Kısa Sonuç

Bu dokümanın ana çıktısı şudur:

> Bu boilerplate kapsamında state yönetimi, tek bir store seçme meselesi değil; local, feature, app-global, server, form, persisted ve derived state türlerini doğru owner, doğru ömür ve doğru reset/persist mantığıyla yerleştirme disiplinidir. En kritik hedef, state’i gereksiz merkezileştirmeden ve server state’i duplicate etmeden davranış doğruluğunu korumaktır.
