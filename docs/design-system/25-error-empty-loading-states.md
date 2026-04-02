# 25-error-empty-loading-states.md

## Doküman Kimliği

- **Doküman adı:** Error, Empty and Loading States
- **Dosya adı:** `25-error-empty-loading-states.md`
- **Doküman türü:** Standard / UX quality / feedback-state governance document
- **Durum:** Accepted
- **Kapsam:** Bu boilerplate kapsamında loading, empty, error, success ve benzeri geri bildirim yüzeylerinin ne anlama geldiğini, hangi durumda hangi feedback yüzeyinin kullanılacağını, bu yüzeylerin component/pattern/screen düzeyinde nasıl ayrıştırılacağını, dil, a11y, motion ve recovery davranışlarının nasıl yönetileceğini tanımlar.
- **Bağlı olduğu üst dokümanlar:**
  - `03-ui-ux-quality-standard.md`
  - `08-navigation-and-flow-rules.md`
  - `10-data-fetching-cache-sync.md`
  - `11-forms-inputs-and-validation.md`
  - `12-accessibility-standard.md`
  - `13-performance-standard.md`
  - `23-component-governance-rules.md`
  - `24-motion-and-interaction-standard.md`
  - `ADR-007-styling-tokens-and-theming-implementation.md`
- **Doğrudan etkileyeceği dokümanlar:**
  - `30-contribution-guide.md`
  - `31-audit-checklist.md`
  - `32-definition-of-done.md`
  - `34-hig-enforcement-strategy.md`
  - `35-document-map.md`

---

# 1. Amaç

Bu dokümanın amacı, boilerplate kapsamında loading, empty ve error yüzeylerini “bir spinner koyalım”, “boşsa bir metin gösterelim”, “hata olursa toast basalım” seviyesinden çıkarıp; kullanıcı görevini destekleyen, belirsizliği azaltan, recovery imkanı sunan ve sistematik kalite taşıyan geri bildirim standardına dönüştürmektir.

Bu belge şu sorulara net cevap verir:

1. Loading state nedir, ne zaman ve hangi yoğunlukta gösterilmelidir?
2. Empty state gerçekten “veri yok” anlamına mı gelir, yoksa başka sebepler de olabilir mi?
3. Error state türleri nasıl ayrılmalıdır?
4. Full-screen, section-level, inline, field-level ve transient feedback yüzeyleri nasıl ayrıştırılmalıdır?
5. Feedback dili nasıl yazılmalıdır?
6. Recovery, retry, refresh, dismiss ve fallback davranışları nasıl yönetilmelidir?
7. A11y, motion ve performance bu geri bildirim yüzeylerini nasıl etkiler?
8. Hangi feedback davranışları doğrudan zayıf kabul edilir?

Bu belge yalnızca metin örneği üretmez.
Feedback state’lerin **anlamını, seviyesini ve davranış modelini** tanımlar.

---

# 2. Neden Bu Doküman Gerekli

Çoğu projede geri bildirim yüzeyleri en çok ihmal edilen kalite alanlarından biridir.
Bunun sonucunda şunlar olur:

- her yükleme aynı spinner ile çözülür,
- küçük refresh ile ilk açılış loading’i aynı davranır,
- gerçekten boş olan liste ile filtre sonucu boş kalan liste aynı gösterilir,
- ağ hatası ile authorization hatası aynı metinle geçiştirilir,
- field-level hata ile page-level hata aynı tona çekilir,
- kullanıcı ne yapması gerektiğini anlamaz,
- “bir şeyler ters gitti” standardı ürünün her yerine yayılır,
- toast her şeyi çözmesi beklenen genel çözüme dönüşür,
- recovery yolu olmayan hata yüzeyleri oluşur,
- loading çok agresif veya çok sessiz olur,
- success feedback hiç verilmez veya aşırı gösterişli olur.

Bu proje kapsamında feedback state’ler yardımcı detay değil, görev tamamlama sisteminin parçasıdır.
Kullanıcı çoğu zaman ürünün kalitesini tam da bu anlarda ölçer:
- beklerken,
- hata alınca,
- veri bulamayınca,
- işlem tamamlanınca.

---

# 3. Temel Tez

Bu proje kapsamında temel tez şudur:

> Loading, empty ve error yüzeyleri dekoratif durum ekranları değil; kullanıcının sistemin ne yaptığını, neden bir şey göremediğini, neyin bozulduğunu ve bundan sonra ne yapabileceğini anlamasını sağlayan görev destek katmanıdır.

Bu tez şu sonuçları doğurur:

1. Her loading aynı şey değildir.
2. Her empty aynı şey değildir.
3. Her error aynı şiddette ve aynı çözüm yolu ile sunulamaz.
4. Feedback yüzeyi, etkilenen bağlamın boyutuna uygun olmalıdır.
5. Recovery yolu olmayan hata dili çoğu zaman zayıftır.
6. Toast, banner, inline message, full-screen state ve field error birbirinin yerine geçmez.

---

# 4. Feedback State Ailesi

Bu belge kapsamında ana feedback state aileleri şunlardır:

1. Loading states
2. Empty states
3. Error states
4. Success states
5. Informational states
6. Transitional / pending states

Bunların her biri farklı bağlam ve yoğunlukta ele alınmalıdır.

---

# 5. Feedback Yüzeyi Seviyeleri

Geri bildirim yüzeyleri en az şu seviyelerde düşünülmelidir:

1. App-level
2. Screen-level
3. Section-level
4. Component-level
5. Inline/field-level
6. Transient/global ephemeral surfaces

Bu ayrım yapılmazsa her problem ya çok küçük ya da çok büyük gösterilir.

---

# 6. App-Level Feedback States

## 6.1. Tanım

Tüm uygulama kabuğunu veya root çalışma durumunu etkileyen geri bildirim yüzeyidir.

## 6.2. Örnekler

- kritik startup blocking state
- oturum geçersizliği sonrası tam yönlendirme
- global hard-failure
- maintenance / app-wide kill-switch benzeri durumlar
- fatal unsupported environment

## 6.3. Kural

App-level feedback çok seyrek kullanılmalıdır.
Sıradan ağ gecikmesi veya tek feature hatası için tüm uygulama kabuğu kapatılmamalıdır.

## 6.4. Zayıf davranışlar

- küçük veri problemi için app-level crash screen göstermek
- tek ekranın hatasını tüm uygulama hatası gibi sunmak
- global spinner ile tüm sistemi boşta tutmak

---

# 7. Screen-Level Feedback States

## 7.1. Tanım

Bir ekranın ana içeriği henüz gösterilemediğinde veya ekranın ana görevi etkilenmişken kullanılan yüzeydir.

## 7.2. Örnekler

- ilk yükleme
- ekranın temel verisi hiç alınamadı
- ekranın birincil amacı veri yokluğu nedeniyle kurulamıyor
- izin/erişim eksikliği nedeniyle ekranın özü çalışmıyor

## 7.3. Kural

Screen-level state, yalnızca gerçekten ekranın ana içeriği kurulamıyorsa kullanılmalıdır.

## 7.4. Zayıf davranışlar

- ekranın küçük bir bölümünde sorun varken tüm ekranı state screen’e çevirmek
- veri var ama küçük bölüm boş diye full-screen empty göstermek

---

# 8. Section-Level Feedback States

## 8.1. Tanım

Ekranın bir bölümünü etkileyen ama tüm ekranı bloklamayan geri bildirim yüzeyidir.

## 8.2. Örnekler

- dashboard içindeki bir widget yüklenemedi
- liste bölümü boş ama ekranın diğer kısımları çalışıyor
- detay ekranında ek related content bölümü hata verdi
- tab içeriklerinden biri ayrı loading alıyor

## 8.3. Kural

Section-level feedback, ekranın geri kalanı kullanılabilirken tercih edilmelidir.

## 8.4. Zayıf davranışlar

- section problemi için tüm ekranı spinner’a gömmek
- section-level hata için yalnızca küçük, görünmez toast göstermek

---

# 9. Component-Level Feedback States

## 9.1. Tanım

Tek bir reusable component veya küçük local UI yüzeyinin feedback state’idir.

## 9.2. Örnekler

- button loading
- image loading/fallback
- expandable content loading
- small inline retry block
- card-level failure state

## 9.3. Kural

Component-level feedback sistematik family’lere bağlanmalıdır.
Her component kendi mini hata dili yaratmamalıdır.

---

# 10. Inline / Field-Level Feedback

## 10.1. Tanım

Belirli bir alan, input, seçim yüzeyi veya küçük context içinde doğrudan verilen geri bildirimdir.

## 10.2. Örnekler

- field validation error
- helper/info hint
- single inline warning
- small dependency notice
- inline save status

## 10.3. Kural

Bu seviyedeki feedback:
- bağlamlı
- kısa
- yönlendirici
olmalıdır.

## 10.4. Zayıf davranışlar

- alan hatasını global toast ile göstermek
- küçük inline problemi screen-level drama haline getirmek

---

# 11. Transient / Ephemeral Feedback

## 11.1. Tanım

Kısa ömürlü, çoğu zaman kullanıcıyı akıştan koparmayan geri bildirimlerdir.

## 11.2. Örnekler

- toast
- snackbars
- transient banners
- inline success hints
- copied / saved / synced benzeri kısa bildirimler

## 11.3. Kural

Transient feedback:
- kritik tek bilgi kanalı olmamalı
- kaçırıldığında kullanıcıyı kaybettirmemeli
- çok sık kullanılmamalı
- kalıcı state’in yerine geçmemeli

## 11.4. Zayıf davranışlar

- her başarı/hata için toast bağımlılığı
- alan hatasını toast ile vermek
- kullanıcı ekrana bakmazsa tüm önemli bilgiyi kaçırması

---

# 12. Loading State Türleri

Loading state tek tip değildir.
Aşağıdaki türler ayrılmalıdır:

1. Initial blocking loading
2. Non-blocking refresh
3. Partial/section loading
4. Inline action loading
5. Background sync loading
6. Skeleton-based content loading
7. Indeterminate waiting
8. Determinate progress (gerektiğinde)

---

# 13. Initial Blocking Loading

## 13.1. Tanım

Ekranın ana görevini kuracak minimum veri henüz yoksa gösterilen loading yüzeyidir.

## 13.2. Kural

- Gereksiz yere tam ekran bloklamaya gidilmemeli
- Gerçekten ekran içerik iskeleti kurulamayacaksa kullanılmalı
- Uygunsa skeleton tercih edilebilir
- Bekleyiş anlaşılır olmalı

## 13.3. Zayıf davranışlar

- ekranın büyük bölümü aslında cache’ten gösterilebilecekken tam ekran loading
- her navigation girişinde yeniden tam loading
- hiçbir yapı ipucu vermeyen boş spinner ekranı

---

# 14. Non-Blocking Refresh

## 14.1. Tanım

Veri mevcutken arka planda yenilenmesidir.

## 14.2. Kural

Bu durumda kullanıcı mümkün olduğunca mevcut içeriği görmeye devam etmelidir.

## 14.3. Göstergeler

- küçük top indicator
- local section shimmer
- refresh affordance
- “updating” benzeri sakin durum

## 14.4. Zayıf davranışlar

- cache varken ekranı tamamen boşaltmak
- küçük revalidation için büyük spinner göstermek
- kullanıcıyı mevcut içerikten mahrum bırakmak

---

# 15. Partial / Section Loading

## 15.1. Kural

Yalnızca ilgili bölüm yükleniyorsa yalnızca o bölüm state almalıdır.

## 15.2. Kullanım örnekleri

- alt liste
- öneriler bölümü
- tab içeriği
- related items
- lazy detail section

## 15.3. Zayıf davranışlar

- tek section için tüm sayfayı kilitlemek
- section loading’i kullanıcı fark etmeyecek kadar belirsiz bırakmak

---

# 16. Inline Action Loading

## 16.1. Tanım

Kullanıcının tetiklediği belirli aksiyonun kısa bekleme durumudur.

## 16.2. Örnekler

- submit button loading
- save action pending
- refresh chip pending
- row action pending

## 16.3. Kural

- hangi aksiyonun beklediği açık olmalı
- aynı anda bütün ekranı gereksiz bloklamamalı
- duplicate action önlenmeli

## 16.4. Zayıf davranışlar

- küçük aksiyon için tüm ekranı kapatmak
- loading var ama hangi aksiyonun beklediği anlaşılmıyor
- buton loading’de ama tekrar tıklanabiliyor

---

# 17. Skeleton Kullanım Standardı

## 17.1. Ne zaman doğru?

- içerik yapısı az çok belli ise
- perceived continuity önemliyse
- layout beklentisini korumak kullanıcıya yardım ediyorsa

## 17.2. Ne zaman yanlış?

- yapısı belli olmayan işlemler
- çok kısa bekleme
- sürekli küçük refresh
- gerçekten hata/boş olma ihtimali yüksek ama bunu skeleton ile gizlemek

## 17.3. Kural

Skeleton:
- sakin olmalı
- aşırı dikkat çekmemeli
- gerçek içeriğin yapısına yakın olmalı
- layout jump üretmemeli

## 17.4. Zayıf davranışlar

- parlak, gürültülü, her yerde aynı shimmer
- içeriğin neye benzeyeceğini hiç yansıtmayan placeholder
- skeleton sonrası layout tamamen değişiyor olması

---

# 18. Spinner / Progress Indicator Standardı

## 18.1. Ne zaman doğru?

- küçük işlem bekleme
- indeterminate process
- local action pending
- çok kısa, net olmayan arka plan çalışma

## 18.2. Kural

Spinner:
- tek feedback dili haline gelmemeli
- kullanıcıyı ne olduğunu hiç anlamadığı bekleyişe mahkum etmemeli
- uygun yüzey büyüklüğünde olmalı

## 18.3. Zayıf davranışlar

- her yerde aynı spinner
- tam ekran boş merkezde spinner
- bekleyiş süresi uzarken hâlâ hiçbir açıklama yok

---

# 19. Empty State Türleri

Empty state tek bir “burada veri yok” cümlesi değildir.
Aşağıdaki türler ayrıştırılmalıdır:

1. True zero state
2. First-use empty state
3. Filtered empty state
4. Search empty state
5. Permission-based empty-like state
6. Dependency missing state
7. Soft-empty / no secondary content state

---

# 20. True Zero State

## 20.1. Tanım

Sistemde gerçekten hiç veri yoktur.
Bu, başlangıç durumu olabilir.

## 20.2. Kural

True zero state:
- kullanıcının neden boş gördüğünü anlatmalı
- bir sonraki anlamlı aksiyonu sunmalı
- boşluğu yalnızca problem gibi sunmamalı

## 20.3. Zayıf davranışlar

- “No data” yazıp bırakmak
- create CTA olmadan boş ekran göstermek
- yeni kullanıcı durumunu hata gibi hissettirmek

---

# 21. First-Use Empty State

## 21.1. Tanım

Yeni kullanıcının henüz kurulum yapmadığı veya ilk kez geldiği bağlamdır.

## 21.2. Kural

- öğretici ama kısa olmalı
- birincil aksiyonu net göstermeli
- cezalandırıcı dil kullanmamalı
- onboarding tonu taşıyabilir

## 21.3. Zayıf davranışlar

- ilk kullanım boşluğunu teknik metinle anlatmak
- ürünün ne işe yaradığını açıklamamak
- kullanıcıyı hiçbir yöne yönlendirmemek

---

# 22. Filtered / Search Empty State

## 22.1. Tanım

Veri var olabilir ama mevcut filtre/sorgu sonucu hiçbir şey görünmüyordur.

## 22.2. Kural

Bu durumda kullanıcıya:
- sistem bozukmuş hissi verilmemeli
- filtre veya aramayı değiştirebileceği anlatılmalı
- gerekiyorsa “clear filters” veya “reset search” gibi yol sunulmalı

## 22.3. Zayıf davranışlar

- true zero state ile aynı görseli kullanmak
- kullanıcıyı veri yok sanrısına sokmak
- mevcut filtreyi görünmez bırakmak

---

# 23. Soft-Empty States

## 23.1. Tanım

Ana ekran çalışıyordur ama bazı ikincil içerik blokları için veri yoktur.

## 23.2. Örnekler

- öneri listesi yok
- henüz related items bulunamadı
- recent activity boş
- tamamlayıcı bölüm oluşmadı

## 23.3. Kural

Soft-empty state:
- ekranı dramatikleştirmemeli
- küçük, bağlamlı, sakin yüzeylerle çözülmeli
- ana görevi gölgelememeli

---

# 24. Error State Türleri

Error state en az şu şekilde ayrılmalıdır:

1. Field-level validation errors
2. Form-level errors
3. Action-level errors
4. Section-level fetch errors
5. Screen-level blocking errors
6. App-level fatal errors
7. Authorization / access errors
8. Connectivity / network errors
9. Retryable transient errors
10. Non-retryable terminal errors
11. Conflict / stale-data errors

Bu ayrım yapılmadan hata yüzeyi kalitesi kurulamaz.

---

# 25. Field-Level Errors

## 25.1. Kural

- alanın altında bağlamlı görünmeli
- teknik değil yönlendirici olmalı
- yalnızca renkle verilmemeli
- form submit veya validation stratejisiyle uyumlu olmalı

## 25.2. Zayıf davranışlar

- alan hatasını toast ile göstermek
- sadece kırmızı border bırakmak
- kullanıcıya neyi düzelteceğini söylememek

---

# 26. Form-Level Errors

## 26.1. Tanım

Tek alanla açıklanamayan veya submit sonucu ortaya çıkan form bütününe ait problemlerdir.

## 26.2. Kural

- alan hatalarından görsel ve anlamsal olarak ayrılmalı
- mümkünse ilgili alanlarla birlikte düşünülmeli
- kullanıcıya sonraki adımı anlatmalı

## 26.3. Zayıf davranışlar

- form-level hatayı küçük, görünmez message’a sıkıştırmak
- tüm hatayı tek teknik cümle ile bırakmak

---

# 27. Action-Level Errors

## 27.1. Tanım

Tek bir kullanıcı aksiyonunun başarısız olmasıdır.

Örnek:
- save failed
- retry failed
- delete failed
- invite failed

## 27.2. Kural

- hangi eylemin başarısız olduğu açık olmalı
- mümkünse retry veya alternatif yol sunulmalı
- tüm ekranı hata ekranına çevirmemeli (gerekmiyorsa)

## 27.3. Zayıf davranışlar

- save hatası için app-level toast
- hangi satır/öğe/eylemde hata olduğu belirsiz feedback

---

# 28. Section-Level Fetch Errors

## 28.1. Kural

- section içeriğini etkileyen hata section içinde görünmeli
- ekranın geri kalanı kullanılabilir kalmalı
- retry küçük ve bağlamlı olmalı

## 28.2. Zayıf davranışlar

- küçük widget hatası için tam ekran error state
- section hatasını görünmez toast ile geçmek

---

# 29. Screen-Level Blocking Errors

## 29.1. Tanım

Ekranın ana görevi için gerekli temel veri veya izin yoktur.

## 29.2. Kural

- sorun açık olmalı
- recovery yolu varsa net olmalı
- kullanıcı burada neden takıldığını anlamalı
- mümkünse “try again”, “go back”, “reauthenticate”, “change filters”, “request access” gibi doğru aksiyonlar sunulmalı

## 29.3. Zayıf davranışlar

- genel “bir şeyler ters gitti”
- ne yapacağı belli olmayan boş hata ekranı
- yalnızca tek retry butonu ile her problemi çözmeye çalışmak

---

# 30. Authorization / Access States

## 30.1. Neden ayrı ele alınmalı?

Çünkü bunlar her zaman teknik hata değildir.
Bazen kullanıcı rolü, erişim düzeyi veya oturum durumu ile ilgilidir.

## 30.2. Kural

- erişim yoksa bunu ağ hatası gibi göstermemeli
- kullanıcıya neyin eksik olduğu anlatılmalı
- gerekirse login, yetki isteme, workspace değiştirme gibi yol sunulmalı

## 30.3. Zayıf davranışlar

- 403/401 benzeri durumları genel hata gibi sunmak
- oturum düşmüş ama sadece “retry” önermek

---

# 31. Connectivity / Network States

## 31.1. Kural

Ağ problemi:
- validation hatası değildir
- authorization problemi değildir
- fatal app error da değildir

Bu yüzden ayrı tonda ele alınmalıdır.

## 31.2. Kullanıcıya ne söylenmeli?

- bağlantı sorunu yaşandığı
- tekrar denenebileceği
- bazı eski verilerin görünüyor olabileceği (uygunsa)
- çevrimdışı kısıtın ne olduğu

## 31.3. Zayıf davranışlar

- ağ problemi için suçlayıcı metin
- veri kaybı olasılığını hiç belirtmemek
- cache varken bile kullanıcıyı kör karanlığa sokmak

---

# 32. Retryable vs Non-Retryable Errors

## 32.1. Neden ayrım şart?

Çünkü her sorun “yeniden dene” ile çözülmez.

## 32.2. Retryable örnekler

- geçici ağ problemi
- timeout
- kısa süreli servis erişim problemi

## 32.3. Non-retryable örnekler

- validation failure
- unsupported action
- role/permission kısıtı
- kalıcı business rule ihlali

## 32.4. Kural

Retry butonu yalnızca gerçekten anlamlıysa gösterilmelidir.

## 32.5. Zayıf davranışlar

- validation hatasına retry sunmak
- izni olmayan kullanıcıya yalnızca retry göstermek
- retry sonucu sürekli aynı hatayı üretip kullanıcıyı döngüye sokmak

---

# 33. Conflict / Stale Data States

## 33.1. Neden ayrı düşünülmeli?

Özellikle edit, multi-user veya stale cache senaryolarında veri artık beklenen durumda olmayabilir.

## 33.2. Kural

Kullanıcıya:
- verinin değişmiş olabileceği
- kendi girişinin etkilenip etkilenmediği
- refresh, merge, discard veya reopen gibi yol olup olmadığı
açık biçimde anlatılmalıdır.

## 33.3. Zayıf davranışlar

- conflict’i genel hata gibi göstermek
- kullanıcı draft’ını sessizce kaybetmek
- stale veriyi fark ettirmeden eski işleme devam etmek

---

# 34. Success States

## 34.1. Neden ayrı ele alınmalı?

Çünkü başarı feedback’i de kullanıcı güveninin parçasıdır.
Ama çoğu zaman ya tamamen unutulur ya da aşırı gösterişli yapılır.

## 34.2. Başarı state türleri

- inline success
- button-level action completion
- section-level success notice
- transient toast/snackbar
- screen-level completion state
- post-submit confirmation block

## 34.3. Kural

Başarı feedback’i:
- işlemin gerçekten tamamlandığını anlamlı biçimde göstermeli
- sadece toast bağımlılığına düşmemeli
- kullanıcıyı akıştan gereksiz koparmamalı
- kritik işlemlerde yeterince görünür olmalı

## 34.4. Zayıf davranışlar

- hiç başarı sinyali vermemek
- her küçük başarı için gösterişli kutlama
- tek bilgi olarak kısa süreli toast kullanmak

---

# 35. Informational States

## 35.1. Tanım

Hata veya başarı olmayan ama kullanıcının bilmesi faydalı olan durum açıklamalarıdır.

## 35.2. Örnekler

- sync in progress
- draft autosaved
- offline mode active
- feature limited by policy
- stale data warning
- scheduled maintenance note

## 35.3. Kural

Bilgilendirme state’leri:
- panik dili taşımamalı
- hatayla karışmamalı
- gerektiğinde dismiss edilebilir ama önemliyse kaybolmamalı

---

# 36. Recovery Modeli

Her ciddi error/empty state için şu sorular cevaplanmalıdır:

1. Kullanıcı ne yapabilir?
2. Retry mantıklı mı?
3. Back doğru mu?
4. Login / reauth gerekiyor mu?
5. Filter reset gerekir mi?
6. Create CTA mı gerekli?
7. Draft korunuyor mu?
8. Yardım/contact/support gerekir mi?

Recovery yolu olmayan state çoğu zaman yarım state’tir.

---

# 37. Feedback Copy Yazım Kuralları

## 37.1. Genel ilke

Metin:
- açık
- kısa
- bağlamlı
- teknik olmayan
- yönlendirici
olmalıdır.

## 37.2. İyi feedback copy özellikleri

- ne olduğunu söyler
- gerekirse neden olduğunu ima eder
- kullanıcıya ne yapabileceğini söyler
- aşırı uzun değildir
- suçlayıcı değildir

## 37.3. Zayıf metin örnekleri

- “Error”
- “Something went wrong”
- “Invalid operation”
- “Unknown issue”
- “Try again later” (tek başına ve her yerde)

## 37.4. Kural

Aynı hata ailesi benzer tonda yazılmalıdır.
Mikro metin dili ürün genelinde tutarlı olmalıdır.

---

# 38. CTA ve Feedback İlişkisi

## 38.1. Kural

Feedback yüzeyinde CTA varsa doğru şiddette ve doğru sayıda olmalıdır.

## 38.2. Olası CTA türleri

- retry
- refresh
- clear filters
- create first item
- go back
- go to settings
- sign in again
- request access
- contact support

## 38.3. Zayıf davranışlar

- her empty/error state’e rastgele iki üç buton koymak
- sorunu çözmeyen CTA sunmak
- retry ve dismiss’i aynı ağırlıkta ve anlamsız sırayla vermek

---

# 39. A11y ve Feedback States

## 39.1. Kural

Feedback yüzeyleri screen reader, focus ve semantics açısından görünür olmalıdır.

## 39.2. Düşünülmesi gerekenler

- loading announcement gerekli mi?
- error metni okunuyor mu?
- retry butonu doğru role ve name taşıyor mu?
- field-level hata ile form-level hata ayrışıyor mu?
- toast kaçırılabilir mi?
- auto-dismiss önemli bilgiyi yok ediyor mu?

## 39.3. Zayıf davranışlar

- error sadece renk veya ikonla verilmiş
- toast screen reader açısından görünmez
- loading süreci sessiz ama sistem kilitli
- focus hata sonrası anlamsız yerde kalıyor

---

# 40. Motion ve Feedback States

## 40.1. Kural

Feedback state motion’ı destekleyici olmalıdır.
Asıl bilgi kanalı olmamalıdır.

## 40.2. Uygulama

- loading shimmer sakin olmalı
- success motion kısa ve destekleyici olmalı
- error motion cezalandırıcı olmamalı
- empty state yüzeyleri dramatik motion istemez

## 40.3. Zayıf davranışlar

- her hata state’ine dikkat çeken agresif animasyon
- success için gereksiz gösteri
- skeleton’ların aşırı parlak ve yorucu olması

---

# 41. Performance ve Feedback States

## 41.1. Kural

Feedback state tasarımı performans duyarlı olmalıdır.

## 41.2. Düşünülmesi gerekenler

- tam ekran loading gerçekten gerekli mi?
- cache varken neden boş yüzey gösteriliyor?
- skeleton layout’u jump yaratıyor mu?
- section loading ekranı gereksiz blokluyor mu?
- transient feedback yoğunluğu etkileşimi bozuyor mu?

## 41.3. Zayıf davranışlar

- küçük veri yenilemesinde tüm ekranı resetlemek
- progress göstermeden uzun bekletmek
- gereksiz ağır animated loaders kullanmak

---

# 42. Reusable Feedback Surface Aileleri

Bu proje kapsamında aşağıdaki reusable surface aileleri güçlü adaydır:

- empty state block
- inline error block
- section retry block
- screen-level state scaffold
- field error presentation
- loading placeholders / skeleton families
- action feedback surfaces
- success banner/snackbar family

Ancak bunlar feature bağlamına göre kontrollü özelleşmelidir.
Tek tip, her yerde aynı şablon da zayıf olabilir.

## 42.1. Canonical Feedback Component Başlangıç Seti

Feedback alanında, `39-default-screens-and-components-spec.md` Bölüm 14'te tanımlanan aşağıdaki 8 component ilk 4 haftada oluşturulur:

| # | Component | Kullanım | Dış Kütüphane |
|---|-----------|----------|---------------|
| C32 | Toast | Geçici bildirim (info/success/warning/error) | Web: sonner, Mobile: custom + reanimated |
| C33 | Banner | Kalıcı bildirim çubuğu | — |
| C34 | Skeleton | Loading placeholder + shimmer | react-native-reanimated |
| C35 | Spinner | Dönen loading indicator | — |
| C36 | ProgressBar | 0-100% determinate progress | — |
| C37 | EmptyState | İçerik yok: icon + başlık + açıklama + CTA | — |
| C38 | ErrorState | Hata: icon + başlık + açıklama + retry | — |
| C39 | LoadingState | Tam bölüm/ekran loading wrapper | — |

> Bu component'ler 42. bölümdeki reusable feedback surface aileleriyle uyumlu tasarlanır. Detaylı spec: `39-default-screens-and-components-spec.md`

---

# 43. Feedback Surface Tasarlarken Sorulacak Sorular

Bir feedback state tasarlanırken şu sorular sorulmalıdır:

1. Bu state tam olarak neyi anlatıyor?
2. Hangi bağlamı etkiliyor: field, section, screen, app?
3. Kullanıcı burada ne yapabilir?
4. Retry anlamlı mı?
5. Bu aslında empty mi, error mü, filtered result mı?
6. Kullanıcıyı boşuna bekletiyor muyuz?
7. Bu bilgi transient mi, kalıcı mı olmalı?
8. Motion ve a11y desteği yeterli mi?
9. Bu state fazla büyük mü gösteriliyor, yoksa görünmez mi kalıyor?
10. Aynı ailedeki benzer durumlarla tutarlı mı?

---

# 44. Pull-to-Refresh Standardı

## 44.1. Tanım

Pull-to-refresh, kullanıcının ekranı aşağı çekerek veri yenilemesi tetiklediği etkileşim kalıbıdır. Mobil uygulamalarda native bir pattern olarak yaygındır; bazı mobile web uygulamalarında da uygulanabilir. Kullanıcı listenin en üstündeyken parmağını aşağı çeker, belirli bir mesafe eşiği aşıldığında yenileme işlemi başlar ve güncel veri sunucudan çekilir.

## 44.2. Ne zaman kullanılır?

Pull-to-refresh yalnızca şu ekranlarda kullanılmalıdır:

- sunucu verisine dayalı liste veya feed ekranları
- timeline, bildirim listesi, sipariş listesi, mesaj listesi gibi dinamik içerikler
- kullanıcının "acaba yeni bir şey var mı?" sorusunu sorması doğal olan yüzeyler

## 44.3. Ne zaman KULLANILMAZ?

- statik içerik ekranları (hakkında, ayarlar gibi)
- form ekranları (pull-to-refresh formun içeriğini resetleyebilir)
- tek veri parçası gösteren detay ekranları (kullanıcı beklentisi yoktur)
- desktop web uygulamaları (mouse ile pull-to-refresh doğal bir hareket değildir)

## 44.4. Fiziksel davranış akışı

1. Kullanıcı listenin en üstündeyken parmağını aşağı çeker.
2. Çekme mesafesi threshold değerine ulaşırsa yenileme tetiklenir.
3. Threshold değerine ulaşmadan bırakılırsa hiçbir şey olmaz, liste eski konumuna döner.
4. Yenileme tetiklendiğinde loading göstergesi görünür.
5. Sunucudan veri geldiğinde loading göstergesi kaybolur ve liste güncellenir.

## 44.5. Threshold kuralı

Kullanıcının yenileme tetiklemesi için parmağını en az **80px** aşağı çekmesi gerekir.

- 80px'e ulaşmadan bırakırsa: işlem iptal edilir, liste eski yerine döner, hiçbir fetch başlamaz.
- Neden 80px: Bu mesafe kazara tetiklemeyi önleyecek kadar büyük, ama kullanıcının kasıtlı çekmesiyle rahatça ulaşabileceği kadar küçüktür.
- Threshold çok düşük (30px gibi): Kullanıcı listeyi kaydırırken kazara tetiklenir, gereksiz fetch başlar.
- Threshold çok yüksek (150px gibi): Kullanıcı çekmekte zorlanır, etkileşim ağır ve yorucu hisseder.

## 44.6. Loading göstergesi

Liste başında dönen bir spinner (circular progress indicator) gösterilir.

- **Boyut:** 24-32px çapında.
- **Konum:** Listenin üst kenarında, mevcut content'i aşağı iterek. Spinner content'in üzerine binmez, onu aşağı kaydırır.
- **Duration:** Sunucudan yanıt gelene kadar.
- **Minimum gösterim süresi:** 500ms. Sunucu çok hızlı yanıt verse bile spinner en az 500ms görünür kalır. Bu, kullanıcıya "bir şey oldu, veri yenilendi" hissini verir. Minimum süre olmadan spinner flash gibi görünüp kaybolur ve kullanıcı yenileme olup olmadığını anlayamaz.

## 44.7. Animasyon davranışı

- **Çekme sırasında:** Spinner, kullanıcının çekme mesafesiyle orantılı olarak scale 0→1 ve opacity 0→1 şeklinde büyür. Kullanıcı ne kadar çekerse spinner o kadar görünür olur.
- **Threshold aşıldığında:** Spinner dönmeye başlar (rotation animation). Bu, kullanıcıya "eşik aşıldı, bırakabilirsin" sinyali verir.
- **Bırakıldığında:** Liste yukarı snap yapar (spring easing). Spinner dönerken listenin üstünde sabit kalır.
- **Veri geldiğinde:** Spinner kaybolur, liste yukarı kapanır (spring easing).

## 44.8. Başarı sonrası davranış

- Spinner kaybolur ve liste güncellenen veriyle render edilir.
- **Opsiyonel:** "Güncellendi" şeklinde kısa bir toast gösterilebilir.
- **Opsiyonel:** Liste başında "Son güncelleme: 2 dk önce" gibi bir timestamp gösterilebilir. Bu, kullanıcının verinin ne kadar güncel olduğunu anlamasını sağlar.

## 44.9. Hata sonrası davranış

- Spinner kaybolur.
- Bir error toast gösterilir: "Güncellenemedi. Tekrar dene."
- Liste eski verisiyle aynen kalır. Mevcut veri SİLİNMEZ.
- Kullanıcı isterse tekrar pull-to-refresh yapabilir.

## 44.10. Web'de kullanım

Pull-to-refresh native mobile pattern'dir. Web'de uygulanması için dikkat edilmesi gerekenler:

- Yalnızca mobile web (touch device) için uygulanabilir.
- Desktop web'de kullanılmaz. Mouse ile pull-to-refresh doğal değildir ve browser'ın kendi overscroll davranışıyla çakışabilir.
- Mobile web'de uygulanacaksa `overscroll-behavior` CSS property'si ile browser'ın native pull-to-refresh'i devre dışı bırakılmalı ve custom implementation kullanılmalıdır.

## 44.11. Erişilebilirlik

Pull-to-refresh gesture-only bir etkileşimdir. Bu da şu anlama gelir:

- Gesture yapamayan kullanıcılar (switch access, keyboard navigation) bu özelliğe erişemez.
- **Çözüm:** Alternatif olarak toolbar'da veya liste başında bir "Yenile" butonu her zaman erişilebilir olmalıdır. Bu buton aynı yenileme işlemini tetikler.
- Yenile butonu `aria-label="Listeyi yenile"` ile işaretlenmelidir.
- Loading durumu `aria-live="polite"` ile screen reader'lara duyurulmalıdır.

## 44.12. Reduced motion

`prefers-reduced-motion` ayarı aktifse:

- Spinner dönme animasyonu devre dışı bırakılır.
- Yerine statik bir loading ikonu ve "Yükleniyor..." yazısı gösterilir.
- Pull sırasındaki scale/opacity geçişi basitleştirilir veya kaldırılır.
- Spring easing yerine anında geçiş kullanılır.

## 44.13. React Native implementasyonu

React Native'de `RefreshControl` component'i kullanılır:

- `FlatList`'in `refreshControl` prop'u ile entegre edilir.
- `refreshing` state'i ve `onRefresh` callback'i yönetilir.
- Expo projelerinde ek kuruluma gerek yoktur, `RefreshControl` React Native core'da mevcuttur.

## 44.14. Zayıf davranışlar

- Threshold çok düşük (30px): kazara tetiklenir, kullanıcı her kaydırmada istemeden fetch yapar.
- Threshold çok yüksek (150px): çekmesi zor, kullanıcı özelliğin varlığından habersiz kalır.
- Minimum gösterim süresi yok: spinner flash gibi görünüp kaybolur, kullanıcı "oldu mu olmadı mı?" sorusuyla kalır.
- Hata durumunda listeyi silen tasarım: kullanıcı mevcut verisini kaybeder, güvensizlik hisseder.
- Pull-to-refresh'i her ekrana koymak: statik veya form ekranlarında anlamsızdır ve kafa karıştırır.
- Gesture-only bırakıp alternatif erişim yolu sunmamak: erişilebilirlik ihlalidir.

---

# 45. Infinite Scroll Standardı

## 45.1. Tanım

Infinite scroll, kullanıcı listeyi aşağı kaydırdıkça otomatik olarak yeni veri sayfasının yüklenmesi kalıbıdır. Klasik sayfa numarası (pagination) yerine kesintisiz kaydırma deneyimi sunar. Kullanıcı listenin sonuna yaklaştığında arka planda yeni sayfa fetch edilir ve mevcut listenin altına eklenir.

## 45.2. Ne zaman kullanılır?

- Feed ekranları (sosyal medya, haber akışı)
- Arama sonuçları
- Ürün listeleri (katalog, mağaza)
- Bildirim listesi
- Mesaj geçmişi
- Uzun ve homojen yapıdaki listeler

Genel kural: İçerik homojen, sıralı ve kullanıcının "biraz daha görmek" isteyeceği türdeyse infinite scroll uygundur.

## 45.3. Ne zaman KULLANILMAZ?

- **Kullanıcının belirli bir noktaya dönmesi gereken listeler:** Sipariş geçmişi, fatura listesi gibi. Kullanıcı "3. sayfadaki şeye bakmıştım" diyebilmelidir. Bu durumda klasik pagination daha iyidir.
- **Footer'a erişmesi gereken sayfalar:** Infinite scroll footer'ı erişilemez kılar çünkü her kaydırmada yeni içerik eklenir.
- **Kısa listeler:** Toplam 10-20 item varsa infinite scroll gereksizdir, tüm veri tek seferde yüklenebilir.
- **Kullanıcının toplam sonuç sayısını bilmesinin önemli olduğu listeler:** "1248 sonuçtan 50 tanesi gösteriliyor" bilgisi önemliyse, pagination daha net iletişim kurar.

## 45.4. Fetch trigger threshold

Listenin sonuna **300px** kala yeni sayfa fetch'i başlar.

- **Neden 300px:** Kullanıcı kaydırmaya devam ederken veri gelecek kadar zaman kazandırır. Normal kaydırma hızında kullanıcı 300px'i geçene kadar verinin gelmiş olması beklenir.
- **Çok erken (1000px):** Kullanıcı henüz mevcut içeriği okurken gereksiz fetch başlar, bant genişliği boşa harcanır.
- **Çok geç (50px):** Kullanıcı listenin sonuna gelir, boş alana bakarak bekler, kesintisiz deneyim bozulur.
- Threshold değeri sabit kodlanmamalı, cihaz ve ağ koşullarına göre ayarlanabilir olmalıdır.

## 45.5. Loading göstergesi

Yeni sayfa yüklenirken listenin en altında, mevcut item'ların altında küçük bir loading göstergesi gösterilir:

- **Tercih 1:** Küçük bir spinner (24px).
- **Tercih 2:** 2-3 adet skeleton item (mevcut item'ların yapısıyla aynı formda).
- **Tam ekran loading OLMAZ.** Mevcut içerik her zaman korunur ve görünür kalır.
- Loading göstergesi listenin organik bir parçası gibi görünmelidir, ayrı bir ekran veya overlay değil.

## 45.6. Listenin sonu göstergesi

Tüm veri yüklendiğinde (artık yeni sayfa yoksa) listenin altında bir "son" göstergesi gösterilir:

- **Metin örnekleri:** "Tüm sonuçları gördün", "Listenin sonuna ulaştın", "Daha fazla sonuç yok".
- **İkon:** ✓ işareti veya — çizgisi.
- Bu gösterge olmadan kullanıcı "acaba daha var mı, yükleniyor mu?" diye bekler.
- Gösterge sakin ve küçük olmalıdır, dikkat çekici olmamalıdır.

## 45.7. Hata durumu

Yeni sayfa fetch'i başarısız olursa:

- Listenin altında "Yüklenemedi. Tekrar dene." mesajı gösterilir.
- Mesajın yanında veya altında bir **retry butonu** bulunur.
- **Mevcut item'lar korunur**, sayfa SIFIRLANMAZ.
- Kullanıcı retry butonuna basarak yalnızca başarısız olan sayfanın fetch'ini tekrar tetikler.
- Retry başarısız olursa aynı mesaj ve buton kalır. Otomatik sonsuz retry döngüsüne girilmez.

## 45.8. Scroll pozisyonu korunması

Kullanıcı listeden bir item'a tıklayıp detay ekranına gidip geri döndüğünde:

- **Scroll pozisyonu korunmalıdır.** Kullanıcı listenin 50. item'ındayken detaya gidip dönerse, 50. item'ın olduğu yerden devam etmelidir.
- Bu, route-level scroll restoration veya cache-based position hatırlama mekanizması ile sağlanır.
- TanStack Query kullanılıyorsa, cache'lenen sayfa verileri bellekte tutulur ve geri dönüşte re-fetch gerekmez.
- Scroll pozisyonu kaybedilirse kullanıcı listenin başına döner ve 50 item'ı tekrar kaydırmak zorunda kalır — bu ciddi bir UX problemidir.

## 45.9. Keyboard ve erişilebilirlik

- Infinite scroll yalnızca scroll event'e bağlı olmamalıdır.
- **Intersection Observer** kullanılmalıdır: Listenin sonundaki bir sentinel element görünür olduğunda fetch tetiklenir. Bu yöntem hem daha performanslıdır hem de a11y-uyumludur.
- **Keyboard kullanıcıları için:** Listenin sonunda "Daha fazla yükle" butonu da mevcut olmalıdır. Tab ile bu butona ulaşılabilir olmalıdır.
- Screen reader kullanıcılarına yeni içerik yüklendiğinde `aria-live="polite"` ile bildirim yapılmalıdır.
- Yüklenen yeni item sayısı duyurulmalıdır: "10 yeni sonuç yüklendi".

## 45.10. Data katmanı

TanStack Query'nin `useInfiniteQuery` hook'u kullanılır:

- `getNextPageParam` ile cursor veya offset yönetimi sağlanır.
- Cache'lenen sayfalar bellekte tutulur, geriye scroll yapıldığında re-fetch gerekmez.
- `hasNextPage` değeri ile "daha var mı?" kontrolü yapılır.
- `isFetchingNextPage` değeri ile loading göstergesi kontrol edilir.
- Sayfa verileri flat bir liste halinde birleştirilir (`pages.flatMap()`).

## 45.11. Virtualization ile birlikte kullanım

50+ item'dan sonra DOM/view tree şişmeye başlar ve performans düşer:

- **Mobile:** `FlatList` (React Native) doğal olarak virtualization sağlar.
- **Web:** `@tanstack/react-virtual` (TanStack Virtual) ile virtualization uygulanmalıdır.
- Virtualization olmadan 500 item'lık bir liste DOM'da 500 element oluşturur, bu da scroll performansını ve bellek kullanımını ciddi şekilde etkiler.
- Virtualization ile yalnızca görünür item'lar render edilir (tipik olarak 10-20 item).

## 45.12. Zayıf davranışlar

- Her yeni sayfa yüklendiğinde tüm listeyi re-render etmek (key değişimi, state reset gibi). Bu, kullanıcının gördüğü item'ların flash yapmasına yol açar.
- Scroll pozisyonunu kaybetmek. Kullanıcı detaydan geri döndüğünde listenin başına düşer.
- "Daha fazla yükle" butonunu yalnızca görsel olarak gizleyip DOM'da bırakmamak. Keyboard ve screen reader kullanıcıları bu özelliğe erişemez.
- 404 veya boş sayfa geldiğinde sonsuz retry döngüsüne girmek. Sunucu "veri yok" diyorsa bu hata değildir, listenin sonudur.
- Fetch trigger threshold'unu çok erken ayarlamak ve kullanıcı henüz mevcut içeriği okurken sayfalarca veri çekmek.
- Listenin sonu göstergesini koymamak. Kullanıcı "daha var mı?" sorusuyla kalır.

---

# 46. Offline Queue Görselleştirme Standardı

## 46.1. Tanım

Offline queue, kullanıcı çevrimdışıyken yaptığı işlemlerin (form submit, beğeni, mesaj gönderme, yorum yazma gibi) bir sıraya alınıp bağlantı geldiğinde otomatik olarak sunucuya gönderilmesi mekanizmasıdır.

## 46.2. Neden görselleştirme gerekli?

Kullanıcı "bu işlem gerçekten oldu mu?" sorusunun cevabını bilmelidir. Offline queue görünmez bırakılırsa:

- Kullanıcı aynı işlemi tekrar yapar (duplikasyon riski).
- Kullanıcı verisinin kaybolduğunu düşünür (güven kaybı).
- Kullanıcı uygulamayı kapatırsa bekleyen işlemlerin durumunu bilemez.
- Bağlantı geldiğinde arka planda olan senkronizasyonun sonucunu göremez.

Bu yüzden offline queue sadece teknik bir altyapı değil, aynı zamanda kullanıcıya açık bir görsel iletişim katmanıdır.

## 46.3. Queue item durumları ve gösterimleri

Her queue item'ı şu dört durumdan birinde olabilir:

### 46.3.1. Pending (beklemede)

Item oluşturulmuş ama henüz sunucuya gönderilmemiştir. Cihaz çevrimdışıdır veya sıra henüz bu item'a gelmemiştir.

- **Görsel:** Soluk/disabled görünüm (opacity 0.6). Normal item'lardan görsel olarak ayrışmalıdır.
- **İkon:** Saat veya bekleme ikonu (clock/hourglass).
- **Etiket:** "Gönderilecek" metni.
- **Davranış:** Kullanıcı bu item'a dokunabilir, içeriğini görebilir ama "henüz sunucuya ulaşmadı" bilgisi açıktır.

### 46.3.2. Syncing (gönderiliyor)

Bağlantı gelmiştir ve bu item aktif olarak sunucuya gönderilmektedir.

- **Görsel:** Normal görünüm + küçük spinner (16-20px).
- **İkon:** Dönen spinner veya animasyonlu sync ikonu.
- **Etiket:** "Gönderiliyor..." metni.
- **Davranış:** Kullanıcı bu sırada item'ı düzenleyemez veya silemez (gönderim devam ediyor).

### 46.3.3. Synced (başarılı)

Item başarıyla sunucuya gönderilmiş ve onaylanmıştır.

- **Görsel:** Normal görünüme döner. Kısa bir ✓ animasyonu gösterilir (1 saniye süreyle).
- **İkon:** Onay işareti (checkmark), 1 saniye sonra kaybolur.
- **Etiket:** Etiket kaldırılır, item artık normal bir item gibi görünür.
- **Davranış:** Geçiş yumuşak olmalıdır (opacity ve color transition).

### 46.3.4. Failed (başarısız)

Gönderim başarısız olmuştur (sunucu hatası, timeout, validation hatası gibi).

- **Görsel:** Kırmızı uyarı vurgusu (sol kenarda kırmızı border veya hafif kırmızı arka plan).
- **İkon:** Kırmızı uyarı ikonu (exclamation/warning).
- **Etiket:** "Gönderilemedi" metni.
- **Buton:** "Tekrar dene" butonu item'ın yanında veya altında.
- **Davranış:** Kullanıcı retry yapabilir, item'ı düzenleyebilir veya silebilir. Başarısız item'lar sessizce silinmez, kullanıcının kararı beklenir.

## 46.4. Global sync indicator

Ekranın üstünde (navigation bar'da veya hemen altında) genel senkronizasyon durumu gösterilmelidir. Bu, tek tek item'lardan bağımsız olarak kullanıcıya büyük resmi anlatır:

### 46.4.1. Çevrimdışı durumu

- **Banner:** Sarı/turuncu arka plan.
- **Metin:** "Çevrimdışı — değişiklikler kaydedildi, bağlantı geldiğinde gönderilecek."
- **Davranış:** Cihaz çevrimdışı olduğu sürece sabit kalır, dismiss edilemez.
- **İkon:** Bağlantı kesik ikonu.

### 46.4.2. Senkronizasyon durumu

- **Banner:** Mavi arka plan.
- **Metin:** "Senkronize ediliyor... (3/7)" şeklinde ilerleme bilgisi.
- **Davranış:** Senkronizasyon süresince sabit kalır, progress güncellenir.
- **İkon:** Dönen sync ikonu.

### 46.4.3. Tamamlandı durumu

- **Banner:** Yeşil arka plan.
- **Metin:** "Tüm değişiklikler senkronize edildi."
- **Davranış:** 3 saniye sonra otomatik kaybolur.
- **İkon:** Onay işareti.

## 46.5. Queue item sayısı göstergesi

- Mobilde app icon badge ile bekleyen item sayısı gösterilebilir (ör: uygulama ikonunda "3" rozeti).
- Navigation bar'da bir badge ile bekleyen item sayısı gösterilebilir.
- Bu gösterge kullanıcının uygulamayı açmadan bile "bekleyen işlerim var" bilgisini edinmesini sağlar.

## 46.6. Conflict durumu

Aynı veri hem local'de (offline queue'da) hem de server'da başka bir kullanıcı veya oturum tarafından değiştirilmişse:

- Otomatik overwrite YAPILMAZ. "Son yazan kazanır" politikası kullanıcı verisini sessizce kaybettirir.
- Kullanıcıya **conflict resolution UI** gösterilmelidir:
  - Diff view: local değişiklik ve server değişikliği yan yana veya alt alta gösterilir.
  - "Hangisini koru?" seçimi sunulur: "Benim değişikliğimi koru", "Sunucu sürümünü koru", veya uygunsa "Birleştir".
- Conflict durumundaki item'lar ayrı bir görsel ile işaretlenir (turuncu/sarı uyarı, merge ikonu).
- Kullanıcı karar verene kadar conflict'li item senkronize edilmez.

## 46.7. Erişilebilirlik

- Sync durumu screen reader'lara `aria-live="polite"` ile duyurulmalıdır.
- Durum değişiklikleri (pending → syncing → synced/failed) semantic olarak işaretlenmelidir.
- Her queue item'ın durumu `aria-label` ile belirtilmelidir (ör: `aria-label="Mesaj: gönderilecek, bekleniyor"`).
- Failed item'lardaki retry butonu keyboard ile erişilebilir olmalıdır.
- Global sync banner'ı `role="status"` ile işaretlenmelidir.

## 46.8. Zayıf davranışlar

- Queue'yu tamamen gizlemek. Kullanıcı ne olduğunu bilmez, aynı işlemi tekrar yapar.
- Başarısız item'ları sessizce silmek. Kullanıcı verisinin kaybolduğunu fark etmez.
- Conflict'leri otomatik "son yazan kazanır" ile çözmek. Kullanıcının çevrimdışıyken yaptığı değişiklikler sessizce kaybolur.
- Sync durumunu yalnızca console.log ile loglamak. Kullanıcıya hiçbir bilgi ulaşmaz.
- Tüm queue item'larını tek bir "senkronize ediliyor" mesajıyla özetlemek. Hangi item başarılı, hangisi başarısız belirsiz kalır.
- Çevrimdışı olunduğunu hiç bildirmemek. Kullanıcı submit butonuna basar, hiçbir şey olmaz, nedenini anlamaz.

---

# 47. Sync Status Bildirimi Standardı

## 47.1. Tanım

Sync status bildirimi, uygulamanın veri senkronizasyon durumunu kullanıcıya bildirme mekanizmasıdır. Bağlantı durumu, arka plan senkronizasyonu, veri çakışmaları ve işlem sonuçları hakkında kullanıcıyı bilgilendirir.

## 47.2. Bildirim türleri

### 47.2.1. Persistent banner (kalıcı üst çubuk)

Devam eden veya uzun süren durumlar için kullanılır.

- **Örnekler:** "Çevrimdışısınız", "Senkronize ediliyor...", "Bağlantı yeniden kuruldu".
- **Konum:** Ekranın en üstü, navigation bar'ın hemen altı.
- **Davranış:** Sabit kalır, scroll ile kaymaz. Kullanıcı dismiss edemez (durum devam ettiği sürece).
- **Kullanım:** Kullanıcının sürekli farkında olması gereken durumlar. Çevrimdışı olma, aktif senkronizasyon gibi.

### 47.2.2. Toast/snackbar (geçici bildirim)

Kısa süreli durum değişiklikleri için kullanılır.

- **Örnekler:** "Bağlantı kesildi", "3 öğe senkronize edildi", "Bağlantı geri geldi".
- **Auto-dismiss:** Bilgi amaçlı toast'lar 4 saniye sonra otomatik kaybolur. Hata toast'ları kullanıcı dismiss edene kadar kalır.
- **Kullanım:** Geçici durum değişiklikleri. Kullanıcının bilmesi gerekir ama sürekli görmesi gerekmez.

### 47.2.3. Inline indicator (satır içi gösterge)

Belirli bir veri parçasının durumu için kullanılır.

- **Örnekler:** Mesaj yanında "gönderiliyor..." spinner'ı, form altında "kaydedildi ✓", liste item'ında sync durumu ikonu.
- **Konum:** İlgili content'in hemen yanında. Ayrı bir yüzeyde değil, item'ın kendisinde.
- **Kullanım:** Tek bir veri parçasının senkronizasyon durumu. Kullanıcının "bu spesifik şey ne durumda?" sorusuna cevap verir.

## 47.3. Karar matrisi

Hangi durumda hangi bildirim türü kullanılacağını belirleyen kural tablosu:

- **Çevrimdışı olma:** Persistent banner. Kullanıcı çevrimdışı olduğunu bilmelidir, bu kalıcı bir durumdur.
- **Tekrar çevrimiçi olma:** Toast. "Bağlantı geri geldi" geçici bir bilgidir, kalıcı banner gereksizdir.
- **Background sync başladı:** Persistent banner. "Senkronize ediliyor... (3/7)" şeklinde progress gösterilir, tamamlanana kadar kalır.
- **Background sync bitti:** Toast. "Tüm değişiklikler senkronize edildi" geçici bilgidir.
- **Tek item sync durumu:** Inline indicator. Item'ın yanında spinner, onay veya hata ikonu.
- **Sync hatası (genel):** Toast (error severity, dismiss edilene kadar kalır). Ayrıca başarısız item'da inline hata göstergesi.

## 47.4. Renk kodlaması

Sync durumlarının renkleri semantic token'lardan gelmelidir (hardcoded HEX değeri kullanılmaz):

- **Çevrimdışı / uyarı:** Sarı veya turuncu. Semantic token: `color.warning`.
- **Senkronize ediliyor:** Mavi. Semantic token: `color.info`.
- **Başarılı:** Yeşil. Semantic token: `color.success`.
- **Hata:** Kırmızı. Semantic token: `color.error`.

Bu renkler tema değiştiğinde (light/dark mode) otomatik olarak uygun tonlara geçmelidir.

## 47.5. Timing kuralları

### 47.5.1. Banner gösterim gecikmesi

Bağlantı koptuğunda banner hemen gösterilmez:

- **2 saniye beklenir.** Kısa kesintileri (anlık ağ değişimi, Wi-Fi → cellular geçişi gibi) filtrelemek için.
- 2 saniye sonra hâlâ çevrimdışıysa "Çevrimdışısınız" banner'ı gösterilir.
- Bu gecikme olmadan her küçük ağ dalgalanmasında banner yanıp söner, kullanıcıyı gereksiz endişelendirir.

### 47.5.2. Banner kaldırma zamanlaması

Bağlantı geldiğinde banner hemen kaybolmaz:

- "Çevrimdışısınız" banner'ı "Senkronize ediliyor..." olarak değişir.
- Sync tamamlandığında banner "Senkronize edildi" olarak değişir ve 3 saniye sonra kaybolur.
- Bu geçiş kullanıcıya "bağlantı geldi → veriler gönderiliyor → tamamlandı" akışını anlatır.

### 47.5.3. Toast zamanlama

- Bilgi toast'ları: 4 saniye auto-dismiss.
- Başarı toast'ları: 4 saniye auto-dismiss.
- Hata toast'ları: Kullanıcı dismiss edene kadar kalır (hata gözden kaçmamalıdır).

## 47.6. Erişilebilirlik

- Tüm sync bildirimleri `role="status"` ile işaretlenmelidir.
- Bilgi ve başarı bildirimleri `aria-live="polite"` kullanır (screen reader mevcut okumayı bitirdikten sonra duyurur).
- Hata bildirimleri `aria-live="assertive"` kullanır (screen reader hemen duyurur).
- Renk tek başına bilgi taşımamalıdır. Her durum renk + ikon + metin üçlüsüyle ifade edilmelidir. Yalnızca kırmızı yapıp "kullanıcı anlar" demek erişilebilirlik ihlalidir.
- Banner ve toast'lar keyboard ile dismiss edilebilir olmalıdır (dismiss edilebilir olanlarda).

## 47.7. Mobile kuralları

- Banner, safe area'nın altında ve status bar'ın altında konumlanmalıdır. Notch veya dynamic island ile çakışmamalıdır.
- Keyboard açıkken toast, keyboard'un üstüne taşınmalıdır. Toast keyboard'un arkasında kalırsa kullanıcı göremez.
- Banner yüksekliği içerik alanını daraltmalıdır (overlay değil, push layout).

## 47.8. Zayıf davranışlar

- Her network request için ayrı bildirim göstermek. Kullanıcı bildirim bombardımanına maruz kalır, önemli olanı ayırt edemez.
- Bağlantı kesintisini hiç bildirmemek. Kullanıcı submit butonuna basar, hiçbir şey olmaz, nedenini anlamaz.
- Sync hatasını yalnızca console.log ile loglamak. Geliştirici dışında kimse bu bilgiye erişemez.
- Banner'ı safe area'nın üstünde göstermek. Notch veya status bar ile çakışır, okunamaz.
- Bağlantı koptuktan sonra banner'ı gecikme olmadan anında göstermek. Her küçük ağ dalgalanmasında banner yanıp söner.
- Sync durumunu yalnızca renkle ifade etmek. Renk körü kullanıcılar durumu anlayamaz.
- Toast'ları hata durumlarında otomatik dismiss etmek. Kullanıcı hatayı okuyamadan bildirim kaybolur.

---

# 48. Error / Empty / Loading State Anti-Pattern Listesi

Aşağıdaki davranışlar bu proje kapsamında zayıf kabul edilir:

1. Her loading için aynı spinner kullanmak
2. Cache varken tam ekran loading’e dönmek
3. True empty ile filtered empty’yi aynı göstermek
4. Ağ hatası, auth hatası ve validation hatasını aynı dile sıkıştırmak
5. Recovery yolu olmayan hata state’i bırakmak
6. Field error’ı toast ile göstermek
7. Küçük section sorunu için tüm ekranı state’e çevirmek
8. Her başarı/hata için toast bağımlılığı kurmak
9. Teknik backend hata metnini doğrudan göstermek
10. Retry’ı her durumda varsayılan çözüm gibi sunmak
11. Skeleton’ı gereksiz ve dikkat dağıtıcı kullanmak
12. Success feedback’i tamamen unutmak
13. Error bilgisini yalnızca renkle vermek
14. Feedback state’i bağlama göre ölçeklememek
15. Kullanıcıya ne yapacağını söylemeyen copy kullanmak

---

# 49. Sonraki Dokümanlara Etkisi

## 49.1. Contribution guide
`30-contribution-guide.md`, yeni screen/feature geliştirirken feedback state’lerin bu standartlara göre tasarlanmasını zorunlu hale getirmelidir.

## 49.2. Audit checklist
`31-audit-checklist.md`, loading/empty/error/success yüzeylerinin bağlam, copy, recovery ve a11y açısından bu belgeye göre denetlenmesini sağlamalıdır.

## 49.3. Definition of done
`32-definition-of-done.md`, kritik ekran veya feature’ların done sayılması için gerekli feedback state kapsamını bu belgeye bağlamalıdır.

## 49.4. HIG enforcement strategy
`34-hig-enforcement-strategy.md`, özellikle loading, empty, field error ve inline feedback family’lerinde enforce edilebilir kuralları bu belgeye göre çıkarmalıdır.

## 49.5. ADR-007 styling kararları
`ADR-007-styling-tokens-and-theming-implementation.md`: ADR-007, feedback state’lerinin styling implementasyonundaki canonical karar otoritesidir. Loading, empty, error ve success yüzeylerinin token tüketimi ve görsel dili, ADR-007’deki implementasyon kararlarıyla uyumlu olmalıdır.

## 49.6. Platform adaptation rules
`26-platform-adaptation-rules.md`: Bu belgedeki feedback state aileleri ve yüzey seviyeleri, platform adaptation kurallarıyla birlikte uygulanmalıdır. Web ve mobilde loading, empty ve error yüzeylerinin presentation farkları, 26-platform-adaptation-rules.md’deki kabul edilebilir adaptation sınırlarına uygun olmalıdır.

---

# 50. Onay Kriterleri

Bu doküman yeterli kabul edilir eğer:

1. Loading, empty, error, success ve informational state aileleri ayrılmışsa,
2. App/screen/section/component/inline/transient yüzey seviyeleri tanımlanmışsa,
3. Farklı empty ve error türleri açıkça ayrıştırılmışsa,
4. Recovery, CTA, copy, a11y, motion ve performance ilişkisi kurulmuşsa,
5. Reusable feedback surface aileleri görünür kılınmışsa,
6. Anti-pattern’ler net biçimde tanımlanmışsa,
7. Sonraki contribution, audit ve DoD dokümanlarına uygulanabilir temel sağlanmışsa.

---

# 51. Global Error Boundary Katmanı

Uygulama seviyesinde yakalanmamış hataların yönetimi, kullanıcı deneyiminin korunması ve hata raporlamasının sağlanması için çok katmanlı error boundary sistemi kullanılır.

## 51.1. Error Boundary Hiyerarşisi

Uygulama üç katmanlı error boundary hiyerarşisi ile sarılır:

1. **App-Level Error Boundary:** Tüm uygulama ağacını sarar. Fatal crash'leri ve öngörülemeyen hataları yakalar. En üst düzey savunma hattıdır.
2. **Screen-Level Error Boundary:** Her ekranı (route/screen component) ayrı ayrı sarar. Bir ekrandaki hata diğer ekranları etkilemez; hata izolasyonu sağlar.
3. **Feature-Level Error Boundary:** Kritik feature modüllerini (ödeme formu, chat modülü, medya oynatıcı vb.) sarar. Feature içi hata, ekranın geri kalanını etkilemez.

## 51.2. App-Level Boundary Davranışı

App-level error boundary tetiklendiğinde:

- **Crash ekranı gösterilir:** "Beklenmeyen bir hata oluştu" başlığı, açıklayıcı alt metin ve aksiyon butonları içerir.
- **"Yeniden Dene" butonu:** Navigation state'ini sıfırlar ve uygulamayı initial route'a yönlendirir. `navigation.reset({ index: 0, routes: [{ name: 'Home' }] })` pattern'i kullanılır.
- **"Hata Bildir" butonu:** Sentry'ye kullanıcı feedback'i gönderir. `Sentry.showReportDialog()` veya custom feedback form ile kullanıcıdan bağlam bilgisi alınır.
- **Otomatik Sentry raporu:** Error boundary'de yakalanan hata otomatik olarak Sentry'ye stack trace, component ağacı bilgisi ve breadcrumb'lar ile raporlanır.
- **Loglama:** Hata detayları structured log formatında kaydedilir (bkz. `28-observability-and-debugging.md`).

## 51.3. Screen-Level Boundary Davranışı

Screen-level error boundary tetiklendiğinde:

- **Sadece hatalı ekran etkilenir:** Diğer ekranlar (tab bar'daki diğer tab'lar, stack'teki önceki ekranlar) çalışmaya devam eder.
- **Hata yüzeyi:** Ekran içeriği yerine "Bu ekranda bir sorun oluştu" mesajı ve "Yeniden Yükle" butonu gösterilir.
- **"Yeniden Yükle" butonu:** Ekran component'ini unmount → remount ederek sıfırdan yükler. State ve data fresh olarak çekilir.
- **Sentry raporu:** Screen-level hata da Sentry'ye otomatik raporlanır; raporda hangi ekranda hata oluştuğu bilgisi yer alır.

## 51.4. React Native Spesifik Davranışlar

- **ErrorUtils.setGlobalHandler:** React component ağacı dışında kalan native crash'leri (unhandled promise rejection, native modül hatası) yakalamak için `ErrorUtils.setGlobalHandler` kullanılır.
- **Development ortamı:** LogBox (error overlay) aktif kalır; geliştirici hatayı detaylı görebilir.
- **Production ortamı:** LogBox devre dışıdır; kullanıcıya yalnızca tasarlanmış hata yüzeyleri gösterilir.

## 51.5. Error Boundary İç İçe Geçme Kuralı

- En spesifik boundary hata yakalar: Feature boundary → Screen boundary → App boundary sıralaması ile en yakın boundary tetiklenir.
- Boundary kendi içinde hata üretirse bir üst katman devreye girer.
- App-level boundary'de hata oluşursa son çare olarak native crash handler (Sentry native SDK) raporu oluşturulur.

---

# 52. Offline Fallback State

Ağ bağlantısı olmadığında gösterilecek UI davranışları bu bölümde tanımlanır. Offline state, kullanıcının mevcut verilerle çalışmaya devam etmesini ve bağlantı geldiğinde kesintisiz geçiş yapmasını sağlar.

## 52.1. Bağlantı Durumu İzleme

- `@react-native-community/netinfo` ile ağ bağlantısı durumu sürekli izlenir.
- Web'de `navigator.onLine` ve `online`/`offline` event'leri ile izleme yapılır.
- Bağlantı durumu global state'te (Zustand store) tutulur ve tüm component'lere dağıtılır.

## 52.2. Bağlantı Kesildiğinde UI Davranışları

### 52.2.1. Global Offline Banner
- Ekranın üst kısmında (SafeArea altında) kalıcı banner gösterilir.
- Metin: "Cevrimdisi calisiyorsunuz — bazi ozellikler sinirli olabilir"
- Arka plan: `surface-warning-soft` token, ikon: WiFi-off.
- Banner animasyonu: Yukarıdan aşağı slide-in (200ms, `easing-enter`).

### 52.2.2. Cache'ten Veri Gösterimi
- Son başarılı API response'u TanStack Query cache'inden gösterilir.
- Stale data gösterimi: İçerik üzerinde "Son guncelleme: 5 dk once" badge'i eklenir.
- Cache'te veri yoksa: İlgili bölümde "Baglanti gerekli — cevrimdisi veri mevcut degil" empty state gösterilir.

### 52.2.3. Offline-Only UI Kısıtlamaları
- Mutation butonları (submit, kaydet, sil) `disabled` yapılır.
- Disabled buton üzerinde tooltip: "Bu islem icin internet baglantisi gerekli".
- Sadece okuma işlemleri cache'ten çalışmaya devam eder.

### 52.2.4. Offline Mutation Queue Göstergesi
- Bekleyen mutation sayısı ekranın alt kısmında badge ile gösterilir: "2 islem bekleniyor".
- Kullanıcı bu badge'e tıklayarak bekleyen işlemlerin listesini görebilir.

## 52.3. Bağlantı Geldiğinde UI Davranışları

1. **Banner geçişi:** Turuncu "Cevrimdisi" banner yeşile döner: "Baglanti saglandi". 3 saniye sonra slide-out ile kaybolur.
2. **Mutation replay:** Offline queue'daki bekleyen mutation'lar otomatik olarak sırayla replay edilir. Her başarılı replay'de badge sayısı güncellenir.
3. **Cache refresh:** Stale durumda gösterilen cache verileri arka planda yenilenir. Stale badge'i kaldırılır.
4. **Hata durumu:** Replay edilen mutation başarısız olursa, kullanıcıya hata bildirimi gösterilir ve işlem retry seçeneği sunulur.

## 52.4. Offline-First Ekranlar

Bazı ekranlar tasarım gereği tamamen offline çalışabilir:
- Cached data üzerinden tam okuma desteği
- Local mutation (MMKV/SQLite) desteği ile offline yazma
- Bağlantı geldiğinde sync mekanizması
- Bu ekranlar ADR-019 (Local Storage ve Offline-First Strategy) ile uyumlu tasarlanır.

---

# 53. Kısa Sonuç

Bu dokümanın ana çıktısı şudur:

> Bu boilerplate kapsamında loading, empty ve error yüzeyleri yalnızca durum ekranı değil; kullanıcının sistemin ne yaptığını, neden bir şey göremediğini, neyin bozulduğunu ve bundan sonra ne yapabileceğini anlamasını sağlayan görev destek katmanıdır.

Bu nedenle bundan sonraki hiçbir implementasyon:
- tüm feedback problemlerini spinner ve toast ile çözemez,
- farklı empty/error türlerini aynı şablona sıkıştıramaz,
- recovery yolu olmayan hata yüzeyi bırakıp tamamlandı diyemez,
- a11y ve performance etkilerini düşünmeden feedback state tasarlayamaz.
