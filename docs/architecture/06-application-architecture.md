# 06-application-architecture.md

## Doküman Kimliği

- **Doküman adı:** Application Architecture
- **Dosya adı:** `06-application-architecture.md`
- **Doküman türü:** Architecture / system design / layering document
- **Durum:** Accepted
- **Kapsam:** Bu boilerplate kapsamında uygulamanın yüksek seviye mimarisini, ana katmanlarını, katmanların sorumluluklarını, katmanlar arası bağımlılık yönlerini, cross-platform paylaşım sınırlarını, app shell ile feature alanı ayrımını, domain ile data layer ilişkisinin nasıl kurulacağını, runtime composition modelini, error ve state akışlarının hangi seviyelerde ele alınacağını ve mimari drift’in nasıl önleneceğini tanımlar.
- **Bağlı olduğu üst dokümanlar:**
  - `00-project-charter.md`
  - `01-working-principles.md`
  - `02-product-platform-philosophy.md`
  - `03-ui-ux-quality-standard.md`
  - `04-design-system-architecture.md`
  - `05-theming-and-visual-language.md`
- **Doğrudan etkileyeceği dokümanlar:**
  - `07-module-boundaries-and-code-organization.md`
  - `08-navigation-and-flow-rules.md`
  - `09-state-management-strategy.md`
  - `10-data-fetching-cache-sync.md`
  - `11-forms-inputs-and-validation.md`
  - `14-testing-strategy.md`
  - `19-roadmap-to-implementation.md`
  - `20-initial-implementation-checklist.md`
  - `21-repo-structure-spec.md`

---

# 1. Amaç

Bu dokümanın amacı, boilerplate’in uygulama mimarisini “React ve React Native ile proje kuralım, sonra ihtiyaç oldukça ayırırız” seviyesinden çıkarıp; **başlangıçtan itibaren sınırları görünür, test edilebilir, sürdürülebilir, type-safe, cross-platform düşünceye uygun ve uzun vadede bozulması zor** bir sistem haline getirmektir.

Bu belge özellikle şu sorulara net ve operasyonel cevap verir:

1. Uygulamanın ana mimari katmanları nelerdir?
2. UI, feature orchestration, domain, data ve platform/infrastructure nerede başlar, nerede biter?
3. Hangi katman hangi katmana bağımlı olabilir, hangisine olamaz?
4. Cross-platform bir ürün geliştirirken hangi mimari parçalar paylaşılmalı, hangileri platforma yakın kalmalıdır?
5. App shell ile feature logic neden ayrılmalıdır?
6. Server state, client state, form state ve navigation state mimari olarak nasıl yerleşir?
7. Error, loading, retry, stale data ve feedback yüzeyleri mimari olarak nerede çözülmelidir?
8. Mimari drift nasıl erken fark edilir ve nasıl önlenir?

Bu belge klasör ağacı belgesi değildir.  
Bu belge teknoloji seçimi belgesi de değildir.  
Bu belge, **sistemin mantıksal omurgasını** tanımlar. Fiziksel repo yapısı daha sonra bu omurgaya göre kurulmalıdır.

---

# 2. Neden Bu Doküman Gerekli

Cross-platform projelerde mimari çoğu zaman şu üç kötü yoldan biriyle bozulur:

## 2.1. UI her şeyi yapmaya başlar

Ekranlar ve component’ler zamanla şunları üstlenir:
- veri çekme
- hata dönüştürme
- business rule uygulama
- cache invalidation kararı
- mapping
- platform-specific kararlar
- permission mantığı

İlk başta hızlı görünür.  
Bir ay sonra okunamaz hale gelir.  
Üç ay sonra aynı feature’ın ikinci varyasyonu geldiğinde çöküş başlar.

## 2.2. “Temiz mimari kuruyoruz” diye aşırı soyutlama yapılır

Bu kez şu olur:
- her küçük şey için ayrı katman
- gereksiz use-case dosyaları
- anlamsız interface yığınları
- basit feature için bile 8 dosya
- domain’i “soyutluk fetişi” haline getirmek

Bu da başka bir tür çürümedir.  
Mimari var gibi görünür ama geliştirme hızı ve okunabilirlik düşer.

## 2.3. Shared code oranı mimarinin yerine geçer

Cross-platform projelerde çok yaygın bir hata şudur:
“Ne kadar çok ortak kod varsa o kadar iyi mimari kurduk.”

Bu yanlış.  
Yanlış yerde paylaşılan kod:
- platform ergonomisini bozar,
- UI kalitesini düşürür,
- debug etmeyi zorlaştırır,
- feature evrimini pahalılaştırır.

Bu nedenle bu proje kapsamında mimari hedef:
- ne her şeyi UI’a yığmak,
- ne her şeyi soyut sınıfa bölmek,
- ne de kör shared code üretmektir.

Doğru hedef şudur:

> İş mantığı, sunum, veri erişimi ve platform bağımlılıkları bilinçli ayrılmış; ama geliştiriciyi gereksiz soyutlama ile boğmayan, yüksek kalite ve uzun ömürlü bir yapı kurmak.

---

# 3. Temel Tez

Bu proje kapsamında temel tez şudur:

> Uygulama mimarisi; kullanıcıya görünen yüzeyleri, feature akış mantığını, saf domain kararlarını, veri erişim ve senkronizasyon davranışını ve platform/infrastructure bağımlılıklarını birbirine gömmeden ayırmalı; ama bu ayrımı gereksiz teorik katman şişkinliğine dönüştürmeden yapmalıdır.

Bu tez şu sonuçları doğurur:

1. UI katmanı iş kuralı taşımaz.
2. Domain katmanı platform bağımlılığı taşımaz.
3. Data layer, ekranlardan gizlenmelidir; ama aşırı soyut repo kulesine dönüştürülmemelidir.
4. App shell, ürün feature’larının içine karışmamalıdır.
5. Cross-platform paylaşılan alanlar, gerçek paylaşım değeri ile belirlenmelidir.
6. Server state, client UI state gibi ele alınmamalıdır.
7. Hata ve feedback yüzeyleri ham teknik detay olarak UI’ya akıtılmamalıdır.
8. Mimari kararlar klasör düzeninden önce mantık düzeyinde netleşmelidir.

---

# 4. Mimari Hedefler

Bu boilerplate kapsamında uygulama mimarisinin hedefleri şunlardır:

## 4.1. Okunabilirlik

Yeni biri projeye girdiğinde:
- neyin app shell,
- neyin feature,
- neyin domain,
- neyin data,
- neyin platform bridge
olduğunu hızlıca anlamalıdır.

## 4.2. Sorumluluk ayrımı

Bir katmanın görevi başka katmana sızmamalıdır.

## 4.3. Test edilebilirlik

Domain logic, orchestration ve önemli UI contract’ları izole doğrulanabilir olmalıdır.

## 4.4. Cross-platform doğruluk

Paylaşım zorlaması değil, doğru paylaşım sağlanmalıdır.

## 4.5. Evrilebilirlik

Yeni feature geldiğinde mevcut mimari “yama kültürü” istememelidir.

## 4.6. Governance ile uyum

Lint, boundary checks, CI rules, audit checklist ve DoD bu mimariyi destekleyebilmelidir.

## 4.7. Design system ile uyum

UI katmanı tasarım sistemi kurallarını doğal biçimde tüketebilmelidir.

---

# 5. Mimari Katmanlar — Yüksek Seviye Görünüm

Bu boilerplate kapsamında önerilen mantıksal mimari katmanlar şunlardır:

1. **App Shell Layer**
2. **Presentation Layer**
3. **Feature Orchestration Layer**
4. **Domain Layer**
5. **Data Access Layer**
6. **Platform / Infrastructure Layer**

Bu katmanlar sıralı “alt alta katman” şeklinde düşünülmemelidir.  
Bazıları runtime composition katmanıdır, bazıları business karar katmanıdır, bazıları da dış dünya ile köprüdür.

Aşağıda her biri ayrıntılı tanımlanmıştır.

---

# 6. App Shell Layer

## 6.1. Tanım

App Shell Layer, uygulamanın çalışmasını başlatan ve temel runtime iskeletini kuran katmandır.  
Bu katman ürün feature’larının iç mantığını çözmez.  
Bu katman, uygulamanın “taşıyıcı kabuğu”dur.

## 6.2. Sorumlulukları

Bu katman şunlardan sorumludur:

- uygulama entry point’leri
- root provider composition
- theme bootstrap
- navigation container/root wiring
- app-level error boundary başlangıcı
- environment/bootstrap config bağlama
- feature flag veya remote config başlangıç bağlama
- auth/session shell kapısı
- app-wide analytics/observability bootstrap
- platform-specific root runtime setup

## 6.3. Ne içermez?

Bu katman şunları içermemelidir:

- feature-specific business logic
- domain rule implementation
- screen-specific veri işleme
- reusable component içinde yaşaması gereken UI detail
- feature-local orchestration state
- raw network çağrısı başlatan screen mantığı

## 6.4. Neden ayrı?

App shell ile feature logic ayrılmazsa kısa sürede şu olur:
- root provider ağacı feature kararlarıyla dolar,
- hangi davranışın sistem kararı hangisinin feature kararı olduğu belirsizleşir,
- app-level değişiklikler feature riskine dönüşür.

## 6.5. Doğru örnekler

- ThemeProvider
- Query client/provider bootstrap
- Navigation root registration
- Global error boundary
- Safe area root scaffold
- Global auth gate entry
- Build metadata exposure point

## 6.6. Yanlış örnekler

- “HomeScreen’de şu network request her app açılışında çalışsın”
- “Settings feature mantığını root provider’da çözelim”
- “Bu feature state’ini root’ta tutalım çünkü kolay”

---

# 7. Presentation Layer

## 7.1. Tanım

Presentation Layer, kullanıcının gördüğü ve etkileştiği yüzeydir.  
Ama yalnızca “component’ler” diye düşünülmemelidir.  
Bu katman:
- screen’leri,
- reusable UI surfaces’leri,
- layout composition’ları,
- feedback yüzeylerini,
- form yüzeylerini
barındırır.

## 7.2. Sorumlulukları

- UI render etmek
- kullanıcı etkileşimini almak
- visual hierarchy uygulamak
- DS token/component sistemini tüketmek
- state ve data’dan gelen hazır bilgiyi sunmak
- loading/empty/error/success yüzeylerini göstermek
- accessibility semantics’i taşımak
- interaction feedback göstermek

## 7.3. Ne yapmamalı?

Presentation layer şunları yapmamalıdır:

- iş kuralı üretmek
- authorization kararının gerçek kaynağı olmak
- ham network error yorumlamak
- request lifecycle policy belirlemek
- veri mapping/orchestration’ı iç içe çözmek
- platform bridge ayrıntılarını doğrudan yönetmek

## 7.4. Neden?

UI içine business logic gömülürse:
- tekrar kullanımı düşer,
- test zorlaşır,
- parity bozulur,
- data flow okunamaz hale gelir.

## 7.5. Doğru örnekler

- Screen component’leri
- Reusable field shells
- List item surfaces
- Empty state block
- Dialog header/footer surfaces
- Section layout wrappers

## 7.6. Yanlış örnekler

- component içinde response schema parse etmek
- button click handler’da business validation zinciri kurmak
- screen içinde retry policy ve cache invalidation kararlarını çözmek

## 7.7. Error Boundary Stratejisi

### 7.7.1. Error Boundary Nedir?

Error boundary, React’ın class component mekanizmasına dayalı bir hata yakalama sistemidir. Bir component ağacında (tree) render sırasında (yani React’ın bir component’i ekrana çizerken) bir JavaScript hatası oluşursa, error boundary bu hatayı yakalar ve tüm uygulamayı çökertmek yerine önceden tanımlanmış bir fallback UI (yedek arayüz) gösterir.

Error boundary’nin çalışma prensibi şudur: React, component’leri yukarıdan aşağıya (root’tan yaprak component’lere doğru) render eder. Herhangi bir component render sırasında hata fırlatırsa, React yukarı doğru en yakın error boundary’yi arar. Bulduğu error boundary hatayı yakalar, `componentDidCatch` lifecycle metodunu çağırır ve kendi `render` metodundaki fallback UI’ı gösterir. Hata oluşan component ve onun alt ağacı kaldırılır (unmount edilir), ancak error boundary’nin dışındaki tüm component’ler etkilenmeden çalışmaya devam eder. Bu mekanizma sayesinde hatanın etkisi sınırlandırılmış olur.

### 7.7.2. Neden Gerekli?

Error boundary kullanılmadığında, tek bir component’teki render hatası tüm React uygulamasını beyaz ekrana düşürür. Bu duruma "white screen of death" (beyaz ekran ölümü) denir. Kullanıcı hiçbir şey göremez, hiçbir aksiyon alamaz; uygulamayı kapatıp açmaktan başka çaresi yoktur.

Somut bir senaryo: Kullanıcı profil ekranında, avatar component’i sunucudan gelen beklenmedik bir veri formatı yüzünden render sırasında hata fırlatır. Error boundary yoksa tüm uygulama çöker. Error boundary varsa yalnızca profil ekranı (veya sadece avatar alanı) fallback gösterir; kullanıcı ana sayfaya dönebilir, diğer ekranları kullanmaya devam edebilir.

Error boundary olmadan production’da çalışan bir uygulama, her render hatasında tamamen kullanılamaz hale gelir. Bu kabul edilemez bir kullanıcı deneyimidir.

### 7.7.3. Üç Katmanlı Error Boundary Hiyerarşisi

Bu projede error boundary’ler üç katmanlı bir hiyerarşi ile yerleştirilir. Her katman farklı granülerlikte hata yakalama sağlar. Bu katmanlar birbirini tamamlar; bir alt katmanın yakalayamadığı hata bir üst katman tarafından yakalanır.

#### 7.7.3.1. App-Level Boundary (Uygulama Seviyesi)

**Konumu:** Uygulamanın en üstünde, root provider’ların (ThemeProvider, QueryClientProvider vb.) hemen altında, tüm feature ve ekran component’lerini saran en dış error boundary’dir.

**Yakaladığı hatalar:** Hiçbir alt seviye boundary’nin (feature-level veya component-level) yakalayamadığı kritik ve beklenmedik hatalar. Bu hatalar genellikle şunlardır:
- Alt boundary’lerin kendisinde oluşan hatalar (bir error boundary kendi içindeki hatayı yakalayamaz)
- Provider seviyesinde oluşan hatalar
- Navigation yapısının kendisinde oluşan hatalar
- Hiçbir feature boundary kapsamına girmeyen alanlardaki hatalar

**Fallback UI:** Basit, güvenilir ve minimal bir ekran gösterilir. Bu ekranda şunlar bulunur:
- "Bir şeyler ters gitti. Uygulamayı yeniden başlat." gibi kullanıcı dostu bir mesaj
- Uygulamayı tamamen yeniden başlatan bir reload/restart butonu
- İsteğe bağlı olarak destek iletişim bilgisi

**Sentry entegrasyonu:** App-level boundary’nin `componentDidCatch` metodunda `Sentry.captureException` çağrılır. Sentry tag’i olarak `boundary_level: ‘app’` eklenir. Bu sayede Sentry dashboard’unda app-level hatalar ayrı filtrelenebilir.

**Amacı:** Bu boundary, uygulamanın tamamen çökmesini (beyaz ekran) önleyen son savunma hattıdır. İdeal senaryoda bu boundary’e hiç düşülmez; çünkü hatalar alt seviyelerde yakalanmış olmalıdır. Buraya düşen bir hata, ciddi bir altyapısal soruna işaret eder.

#### 7.7.3.2. Feature-Level Boundary (Feature Seviyesi)

**Konumu:** Her feature modülünün (ekran veya akış) kök component’inde. Örneğin profil ekranı, sipariş listesi ekranı, ayarlar ekranı gibi her bağımsız feature alanının en üstünde bir error boundary bulunur.

**Yakaladığı hatalar:** O feature modülü içindeki tüm render hataları. Bu, feature’ın kendi screen component’leri, alt component’leri, orchestration hook’larından render’a yansıyan hatalar ve feature-local composition hataları dahildir.

**Fallback UI:** Feature bağlamına uygun bir hata ekranı gösterilir:
- "Bu bölüm yüklenemedi. Tekrar dene." gibi kullanıcı dostu bir mesaj
- Retry (tekrar dene) butonu — bu buton component’i unmount edip tekrar mount eder (key değiştirme pattern’i ile, aşağıda açıklanmıştır)
- İsteğe bağlı olarak "Ana sayfaya dön" navigasyon linki

**En kritik faydası:** Bir feature çöktüğünde diğer feature’lar etkilenmez. Somut örnek: Profil ekranı render sırasında hata fırlatırsa, yalnızca profil ekranı fallback gösterir. Kullanıcı alt navigasyondan ana sayfaya, sipariş listesine veya ayarlara geçebilir; bu ekranlar normal çalışmaya devam eder. Bu izolasyon, kullanıcının uygulamayı tamamen terk etmesini önler.

**Sentry entegrasyonu:** `componentDidCatch`’te `Sentry.captureException` çağrılır. Sentry tag’i olarak `boundary_level: ‘feature’` ve `feature_name: ‘profile’` (veya ilgili feature adı) eklenir. Bu sayede hangi feature’ın ne sıklıkla hata ürettiği izlenebilir.

#### 7.7.3.3. Component-Level Boundary (Component Seviyesi)

**Konumu:** Kritik veya güvenilirliğinden emin olunmayan component’lerin etrafında. Özellikle şu durumlarda kullanılır:
- Üçüncü parti (third-party) kütüphanelerin component’leri (harita, grafik, video oynatıcı, zengin metin editörü vb.)
- Dış veriye bağımlı ve hata fırlatma olasılığı yüksek widget’lar
- Deneysel veya yeni eklenen component’ler

**Yakaladığı hatalar:** Yalnızca sarmaladığı tek component veya küçük component grubunun render hataları.

**Fallback UI:** Minimal ve bağlamsal bir placeholder gösterilir:
- Harita widget’ı çökerse: Haritanın bulunduğu alanda "Harita yüklenemedi" mesajı ve küçük bir retry ikonu. Sayfanın geri kalanı (başlık, açıklama, butonlar vb.) normal çalışır.
- Grafik widget’ı çökerse: Grafik alanında "Grafik görüntülenemiyor" mesajı. Diğer veri tabloları ve bilgiler etkilenmez.
- Bazı durumlarda fallback olarak component tamamen gizlenebilir (boş alan bırakılır); bu, component’in sayfadaki rolü kritik değilse uygundur.

**Sentry entegrasyonu:** `componentDidCatch`’te `Sentry.captureException` çağrılır. Sentry tag’i olarak `boundary_level: ‘component’` ve `component_name: ‘MapWidget’` (veya ilgili component adı) eklenir.

### 7.7.4. Boundary Nereye Konmaz?

Her component’in etrafına error boundary koymak gereksiz overhead (ek yük) üretir ve kodun okunabilirliğini düşürür. Error boundary yalnızca izolasyon gereken sınırlara konur:

- Basit, saf (pure) presentational component’ler (bir `Text` veya `View` wrapper) için boundary gerekmez
- Zaten üst seviye boundary tarafından korunan alanlar için tekrar boundary koymak gereksizdir
- Hata fırlatma olasılığı düşük, sadece prop’ları gösteren stateless component’ler için boundary gerekmez

Karar kuralı: "Bu component hata fırlatırsa, etrafındaki alanı da çökertmesini kabul edebilir miyim?" sorusu sorulmalıdır. Cevap "evet" ise boundary gerekmez. Cevap "hayır, sadece bu alan çöksün" ise boundary gerekir.

### 7.7.5. Error Boundary’nin Yakalayamadığı Hatalar

Error boundary her hatayı yakalamaz. Bu sınırlamaların bilinmesi kritiktir; aksi takdirde "error boundary koydum, her şey güvende" yanılgısı oluşur.

**Event handler hataları:** Error boundary, event handler’larda (ör: `onPress`, `onClick`, `onSubmit`) oluşan hataları yakalamaz. Çünkü event handler’lar render cycle’ının dışında, kullanıcı etkileşimi sonucu asenkron olarak çalışır. Event handler hataları `try/catch` bloğu ile yakalanmalıdır.

Örnek:
```typescript
// Error boundary YAKALAMAZ — event handler
const handleSubmit = async () => {
  try {
    await submitForm(data)
  } catch (error) {
    // Hata burada yakalanmalı
    showErrorToast(‘Form gönderilemedi’)
    Sentry.captureException(error)
  }
}
```

**Async (asenkron) hatalar:** Error boundary, promise rejection (reddedilen promise) hatalarını yakalamaz. API çağrıları, async fonksiyonlar ve setTimeout/setInterval içindeki hatalar error boundary kapsamı dışındadır. Bu tür hatalar için:
- TanStack Query (React Query) kullanılıyorsa: Query hook’unun döndürdüğü `error` state’i veya `onError` callback’i ile yönetilir
- Manuel async çağrılarda: `try/catch` ile yakalanır
- Global unhandled rejection: `window.addEventListener(‘unhandledrejection’, ...)` veya React Native’de global error handler ile yakalanır

**Server-side hatalar:** Error boundary yalnızca client-side render hatalarını yakalar. Sunucu tarafında oluşan hatalar API response olarak gelir ve data layer’da yönetilir.

### 7.7.6. Sentry Entegrasyonu Detayı

Her error boundary’nin `componentDidCatch` lifecycle metodunda hata Sentry’ye raporlanmalıdır. Bu raporlama şu bilgileri içermelidir:

- **Exception:** Hatanın kendisi (`error` parametresi)
- **Error info:** React’ın sağladığı component stack trace’i (`errorInfo.componentStack`)
- **Boundary level tag:** Hatanın hangi seviye boundary’de yakalandığı (`app`, `feature`, `component`)
- **Feature/component name tag:** Hangi feature veya component’te yakalandığı
- **Ek context:** Kullanıcı ID’si, mevcut route, uygulama versiyonu gibi debug bilgileri

Sentry tag’leri sayesinde hata dashboard’unda şu analizler yapılabilir:
- Hangi boundary seviyesinde en çok hata yakalanıyor?
- Hangi feature en çok render hatası üretiyor?
- Hangi üçüncü parti component en güvenilmez?
- App-level boundary’e düşen hata oranı artıyor mu? (Bu, alt boundary’lerin yetersiz kaldığına işaret eder.)

### 7.7.7. React 19 ile Error Boundary Evrimi

React 19, `use` hook’u ve gelişmiş Suspense desteği ile birlikte error boundary’lerin kapsamını genişletir. React 19 öncesinde error boundary yalnızca senkron render hatalarını yakalayabilirken, React 19’da `ErrorBoundary + Suspense` pattern’i ile async hataları da yakalayabilir hale gelir.

Bu pattern şöyle çalışır: `use` hook’u bir promise’i Suspense sınırında "fırlatır" (throw eder). Promise resolve olursa component render edilir. Promise reject olursa hata en yakın error boundary tarafından yakalanır. Bu sayede async veri çekme hataları da error boundary fallback’ine düşer.

Bu evrim, error boundary’leri daha güçlü bir hata yönetim aracı haline getirir. Ancak event handler hataları hala error boundary kapsamı dışındadır; bu sınırlama React 19’da da devam eder.

### 7.7.8. Recovery (Kurtarma) Mekanizması

Feature-level boundary’de retry butonu, component’i unmount edip tekrar mount etme yoluyla çalışır. Bu, React’ın key değiştirme pattern’i ile sağlanır.

Çalışma prensibi: Error boundary bir state’de hata bilgisini tutar (ör: `hasError: true`). Retry butonuna basıldığında bu state sıfırlanır (`hasError: false`). Aynı zamanda sarmalanan component’in `key` prop’u değiştirilir (ör: `key={retryCount}`). React, key’i değişen component’i tamamen yok eder (unmount) ve sıfırdan oluşturur (mount). Bu sayede:
- Component’in tüm internal state’i sıfırlanır
- Effect’ler yeniden çalışır
- Veri çekme hook’ları yeniden tetiklenir
- Hata oluşturan koşul geçiciyse (ör: sunucu anlık hata verdiyse) component başarılı şekilde render edilebilir

Bu mekanizma, kullanıcıya "tekrar dene" imkanı sunarak uygulamayı yeniden başlatma ihtiyacını ortadan kaldırır.

### 7.7.9. Hatalı Yaklaşımlar

Aşağıdaki davranışlar error boundary stratejisi kapsamında zayıf kabul edilir:

1. **Hiç error boundary kullanmamak:** Tek bir render hatası tüm uygulamayı beyaz ekrana düşürür. Production uygulamada kabul edilemez.
2. **Sadece app-level boundary kullanmak:** Herhangi bir hata tüm uygulamayı fallback ekranına düşürür; granülerlik yoktur. Küçük bir widget hatası yüzünden kullanıcı tüm uygulamayı kaybeder.
3. **Error boundary’de hata mesajını `console.log` ile bırakmak:** `console.log` production’da kimsenin görmeyeceği bir çıktıdır. Hata mutlaka Sentry’ye (veya kullanılan observability aracına) gönderilmelidir.
4. **Fallback UI’ı boş bırakmak:** Hata yakalanır ama kullanıcıya hiçbir şey gösterilmezse, kullanıcı ne olduğunu anlayamaz ve uygulamanın kilitlendiğini düşünür. Fallback her zaman anlamlı bir mesaj ve mümkünse bir aksiyon (retry, geri dön) sunmalıdır.
5. **Her component’e boundary koymak:** Gereksiz nesting ve kod karmaşıklığı üretir. Boundary yalnızca izolasyon gereken sınırlara konur.
6. **Error boundary’i async hata yönetimi sanmak:** Error boundary async hataları (React 19 `use` hook’u hariç) yakalamaz. API hataları, event handler hataları ve promise rejection’lar ayrı mekanizmalarla yönetilmelidir.
7. **Sentry tag’i eklememek:** Sentry’ye hata gönderilse bile boundary seviyesi ve feature/component adı tag’lenmezse, hatanın kaynağını bulmak zorlaşır. Tag’ler debug süresini kısaltır.

### 7.7.10. Canonical Kütüphane ve Component Referansı

Error boundary implementasyonu için `react-error-boundary 5.x` kütüphanesi canonical yardımcı olarak kabul edilir (`36-canonical-stack-decision.md` Bölüm 20). Üç katmanlı boundary hiyerarşisinin somut component spec’i `39-default-screens-and-components-spec.md` C53’te tanımlanmıştır.

---

# 8. Feature Orchestration Layer

## 8.1. Tanım

Feature Orchestration Layer, ekranın veya feature akışının UI ile domain/data arasında çalışma mantığını kurduğu katmandır.

Bu katman genellikle en çok karıştırılan katmandır.  
Çünkü birçok ekip ya bunu hiç kurmaz ve her şeyi UI’a yıkar,  
ya da bunu gereksiz soyut “use case” mezarlığına dönüştürür.

Buradaki doğru denge şudur:

> Feature orchestration, presentation’ın ihtiyaç duyduğu hazırlanmış davranışı üretir; ama saf domain kuralını veya altyapı detayını kendi içinde boğmaz.

## 8.2. Sorumlulukları

- screen/flow düzeyinde state orchestration
- user intent’i domain/data çağrılarına çevirmek
- UI için uygun state shape üretmek
- permission/capability kararlarını bağlama
- retry/recovery stratejisinin feature-level tarafı
- section-level data composition
- form submit orchestration
- mutation sonrası UI güncelleme akışını yönetmek
- stale/conflict/success/error yüzeylerine feature karar vermek

## 8.3. Ne yapmamalı?

- saf domain rule sahibi olmak
- ham storage/network detayını kendisi yönetmek
- reusable UI component contract’ı tanımlamak
- global shell kararları almak
- platform API’sini doğrudan iş kuralına karıştırmak

## 8.4. Neden ayrı katmandır?

Bu katman olmazsa ekranlar “zeki” olur.  
Ekranlar zeki olursa:
- test maliyeti artar,
- tekrar eden akışlar çoğalır,
- veri akışı ile UI akışı birbirine girer,
- aynı feature’ın ikinci varyantı geldiğinde kod kopyaları başlar.

## 8.5. Doğru örnekler

- “Filtre uygula” intent’ini query params + local screen state + list refresh akışına bağlamak
- Form submit sonrası success/error/retry yüzeyini hazırlamak
- Aynı ekrandaki birkaç data section’ın yüklenme düzenini yönetmek
- Kullanıcının seçimini domain-safe command’a çevirmek

## 8.6. Yanlış örnekler

- orchestration yerine screen JSX içinde if/else yığını
- her küçük click handler’da query invalidation, error parse, toast, navigation hepsinin beraber çözülmesi
- domain hesaplamalarını orchestration içine gömmek

---

# 9. Domain Layer

## 9.1. Tanım

Domain layer, ürünün iş kurallarını ve saf karar mekanizmalarını taşır.  
Bu katman UI’ya benzemez.  
Bu katman network client’a da benzemez.  
Bu katman “ürünün aslında ne yaptığı” ile ilgilidir.

## 9.2. Sorumlulukları

- entities
- value objects
- saf business rules
- domain selectors
- hesaplamalar
- invariant’lar
- reusable validation rules
- product karar mantığı
- domain-safe transformations

## 9.3. Ne yapmamalı?

- JSX/render mantığı
- screen route bilgisi
- native/web API çağrısı
- raw HTTP request
- storage adapter erişimi
- platform capability kullanımı
- analytics/debug side-effect kararı

## 9.4. Neden bu kadar saf olmalı?

Çünkü domain saf değilse:
- test pahalı olur,
- paylaşılamaz,
- platform farkları iş kurallarını bozar,
- refactor güveni düşer.

## 9.5. Domain layer’ın çıkışı nasıl düşünülmeli?

Domain layer doğrudan ekrana stil vermez.  
Ama UI’nın tüketebileceği saf kararları üretir.

Örnek:
- “bu seçenek seçilebilir mi?”
- “bu form kombinasyonu geçerli mi?”
- “bu item hangi domain statüsünde?”
- “şu iki veri karşılaştırıldığında öncelik sırası ne?”

## 9.6. Doğru örnekler

- fiyat/puan/sıralama hesaplamaları
- domain statü mapping mantığı
- saf validation rules
- role/capability kararının saf kısmı
- derived summary computations

## 9.7. Yanlış örnekler

- `navigateToDetailsIfEligible()` gibi route bağımlı fonksiyonlar
- `showToastForInvalidInput()` gibi UI side-effect’li işler
- `fetchOrdersAndSort()` gibi raw data access ile karışmış işler

---

# 10. Data Access Layer

## 10.1. Tanım

Data Access Layer, dış veri kaynakları ile ürün mantığı arasında kontrollü köprüdür.  
Bu katman, yalnızca “API client klasörü” değildir.  
Aynı zamanda:
- veri erişim contract’ı,
- mapping,
- cache davranışı,
- request lifecycle kararlarının teknik yüzeyidir.

## 10.2. Sorumlulukları

- request başlatma contract’ları
- response mapping
- query/mutation hooks veya eşdeğer erişim yüzeyi
- cache policy bağlama
- invalidation/revalidation desteği
- stale data awareness
- backend hata tiplerini kontrollü çevirme
- repository benzeri sınır (gerçekten gerekiyorsa)
- offline / local cache entegrasyon yüzeyleri

## 10.3. Ne yapmamalı?

- UI feedback metni yazmak
- screen navigation kararı vermek
- reusable component state’i çözmek
- domain mantığını ham payload ile ezmek
- feature-specific visual decisions almak

## 10.4. Neden ayrı?

Data erişimi ekranlara dağılırsa:
- aynı endpoint farklı yerlerde farklı yorumlanır,
- retry/invalidation davranışı tutarsızlaşır,
- mapping dağılır,
- stale data bug’ları artar,
- observability zorlaşır.

## 10.5. Doğru örnekler

- payload → domain-safe data mapping
- query contract tanımlamak
- mutation sonrası invalidation stratejisini bağlamak
- offline cache veya persistence adapter yüzeyi

## 10.6. Yanlış örnekler

- screen içinde `fetch(...).then(...).catch(...)`
- component içinde raw response parse etmek
- aynı backend error kodunu her feature’da farklı yorumlamak

---

# 11. Platform / Infrastructure Layer

## 11.1. Tanım

Bu katman, web veya mobil platforma özgü sistem API’leri ve dış dünya köprülerini taşır.  
Bu katman olmadan birçok capability ya UI içinde hack ile çözülür ya da domain kirlenir.

## 11.2. Sorumlulukları

- storage adapter
- file picker/media bridge
- clipboard/share bridge
- deep link integration
- push/notification bridge
- secure storage / auth storage wrapper
- device capability adapters
- platform-specific environment helpers

## 11.3. Ne yapmamalı?

- UI hierarchy belirlemek
- business rule üretmek
- domain karar mantığını kendi içinde çözmek
- feature-level orchestration olmak

## 11.4. Neden ayrı?

Platform detayları doğrudan screen veya domain içine akarsa:
- portability düşer,
- test zorlaşır,
- paylaşım yanlış olur,
- adaptation kararları belirsizleşir.

## 11.5. Doğru örnekler

- “dosya seç” capability wrapper
- “güvenli saklama” adaptörü
- web/mobile farklı storage taşıyıcıları
- universal contract + platform-specific implementation

## 11.6. Yanlış örnekler

- screen component içinde native API’ye doğrudan erişim
- domain logic içinde `window`, `document`, native module çağrıları
- feature local helper içine platform bridge gömmek

---

# 12. Katmanlar Arası Bağımlılık Yönü

## 12.1. Doğru genel yön

Aşağıdaki yön korunmalıdır:

- App Shell → Presentation / Orchestration / app-wide infra wiring
- Presentation → Orchestration / UI primitives-components / prepared state
- Orchestration → Domain / Data Access
- Data Access → Platform / Infrastructure / external services
- Domain → mümkün olduğunca bağımsız ve saf

## 12.2. Bu ne anlama gelir?

- UI, domain’den yararlanabilir ama domain UI’yı bilmez.
- Feature orchestration data erişimini kullanabilir ama ham platform bridge’e mümkün olduğunca gömülmez.
- Data layer platform adapter kullanabilir ama UI state mantığını taşımaz.

## 12.3. Kesinlikle kaçınılacak yanlış yönler

- Domain → Presentation
- Domain → Navigation runtime
- Shared Core → raw platform API
- Reusable UI → feature-private business rule
- Screen → raw infrastructure detayları
- App Shell → feature-local karar mantığı

---

# 13. App Shell ile Feature Alanı Arasındaki Ayrım

## 13.1. Bu ayrım neden kritik?

Birçok projede root yapı zamanla feature çöplüğüne dönüşür.  
Bu olduğunda:
- shell karmaşıklaşır,
- test zorlaşır,
- startup akışı kırılganlaşır,
- global/local sorumluluk ayrımı kaybolur.

## 13.2. App shell’de yaşaması güçlü adaylar

- root providers
- app-wide error boundary
- navigation root
- global theme wiring
- global auth gate
- release/build metadata exposure
- app-wide observability bootstrap

## 13.3. Feature alanında yaşaması gerekenler

- ekranlara özel orchestration
- local feature state
- feature-specific data composition
- form flow logic
- ekran bazlı retry/recovery decisions
- domain intent orchestration

## 13.4. Zayıf yaklaşım örnekleri

- root provider’da feature-specific mutation logic
- global shell’de bir ekranın filtre state’ini tutmak
- root navigation dosyasında feature iş kuralı çözmek

---

# 14. Presentation ile Domain Arasındaki Ayrım

## 14.1. En büyük tuzak

UI katmanı genelde “nasıl olsa burada karar vermek kolay” diye domain kararlarını üzerine almaya başlar.

Örnek:
- eligibility kuralını button disable içinde çözmek
- role/capability kontrolünü ekranda dağınık biçimde yapmak
- sıralama veya hesaplamayı render sırasında doğaçlama yapmak

## 14.2. Doğru yaklaşım

UI:
- state gösterir,
- intent iletir,
- görsel hiyerarşi kurar,
- a11y semantics taşır.

Domain:
- karar verir,
- hesaplar,
- kural uygular,
- sınıflandırır.

## 14.3. Pratik kural

Bir karar aynı üründe birden fazla yerde tekrar ediyorsa, bu çoğu zaman UI kararı değil domain veya orchestration kararıdır.

---

# 15. Orchestration ile Domain Arasındaki Ayrım

## 15.1. Neden ayrı?

Bu iki katman karıştırılırsa iki uçtan biri olur:
- ya domain gereksiz presentation bağlamı öğrenir,
- ya orchestration business rule çöplüğüne döner.

## 15.2. Basit ayrım

- **Domain**: “doğru karar nedir?”
- **Orchestration**: “bu feature akışında bu karar ne zaman ve hangi veriyle uygulanır?”

## 15.3. Örnek

“Bu kullanıcı bu aksiyonu yapabilir mi?”  
Saf kısmı domain’e yakındır.

“Bu ekranda bu aksiyon butonu ne zaman görünür, tıklanınca hangi mutation ve hangi retry akışı çalışır?”  
Bu orchestration katmanına yakındır.

---

# 16. Data Layer ile Domain İlişkisi

## 16.1. Önemli ayrım

Data layer, domain’in sahibi değildir.  
Ama domain’in ihtiyaç duyduğu veriyi düzenli biçimde sağlamalıdır.

## 16.2. Pratik yorum

- backend response olduğu haliyle domain değildir
- payload önce uygun mapping ile daha güvenli şekle gelmelidir
- domain hesaplamaları raw transport shape’e bağımlı kalmamalıdır

## 16.3. Zayıf davranışlar

- domain logic’i raw API response shape’e bağlamak
- ekranların farklı yerlerde farklı mapping yapması
- backend değişince tüm UI’nın kırılması

---

# 17. State’in Mimari Yeri

Bu belge state stratejisini tam yazmaz; onu `09-state-management-strategy.md` yapar.  
Ama state’in mimaride nereye oturduğu burada net olmalıdır.

## 17.1. Component-local state
Presentation layer’a yakındır.

## 17.2. Feature-local orchestration state
Feature orchestration katmanına yakındır.

## 17.3. App-global UI state
App shell ile orchestration sınırına yakındır.

## 17.4. Server state
Data access ve cache davranışı ile ilişkilidir; sıradan global mutable store değildir.

## 17.5. Form state
Form yönetim sistemi içinde ayrı düşünülmelidir; generic app state yığınına atılmamalıdır.

---

# 18. Navigation’ın Mimari Yeri

Navigation yalnızca route dosyası meselesi değildir.  
Mimari olarak iki tarafı vardır:

## 18.1. App shell tarafı
- root navigators
- global route registration
- auth gates
- modal/sheet host surfaces

## 18.2. Feature orchestration tarafı
- belirli user intent sonrası nereye gidileceği
- flow transition kararı
- back/dismiss sonrası feature davranışı

Navigation domain katmanına sızmamalıdır.  
Ama UI component’lere dağınık biçimde de bırakılmamalıdır.

---

# 19. Error Akışının Mimari Yorumu

## 19.1. Raw error ile user-facing feedback aynı şey değildir

Örnek:
- timeout
- auth expired
- validation failed
- stale conflict
- section fetch failed

Bunların ham hali teknik katmandadır.  
Kullanıcıya gösterilecek hali başka katmandadır.

## 19.2. Doğru katman ayrımı

- Data/infra: ham hata ve teknik bağlam
- Orchestration: feature anlamı ve recovery seçimi
- Presentation: kullanıcıya uygun feedback surface

## 19.3. Neden önemli?

Bu ayrım yapılmazsa:
- ham backend mesajları UI’ya akar,
- her ekran farklı hata dili kullanır,
- recovery mantığı tutarsız olur.

---

# 20. Loading / Retry / Recovery’nin Mimari Yeri

Loading, retry ve recovery yalnızca görsel problem değildir.  
Mimari olarak aşağıdaki ayrım gerekir:

## 20.1. Data layer
- request lifecycle bilgisi
- stale/refetch/retry capability

## 20.2. Orchestration
- hangi yüzey bloklanacak
- hangi section local retry alacak
- background refresh mi initial loading mi
- recovery butonu ne yapacak

## 20.3. Presentation
- spinner/skeleton/inline retry/error görünümü

Bu ayrım yoksa UI ile data behavior birbirine yapışır.

---

# 21. Cross-Platform Mimari Yorumu

## 21.1. Paylaşılması güçlü alanlar

Aşağıdaki alanlar doğru tasarlanırsa paylaşılması anlamlıdır:

- domain logic
- semantic tokens
- reusable primitives ve bazı reusable components
- saf validation rules
- bazı data contracts/mappers
- bazı orchestration contracts
- test helpers

## 21.2. Dikkatli paylaşılması gereken alanlar

- navigation runtime details
- form adapters
- platform storage/session bridges
- input ergonomisi ile ilgili presentation details
- gesture-specific orchestration
- file/media/system integration

## 21.3. Platforma yakın kalması güçlü alanlar

- app shell wiring
- runtime bootstrap details
- native/web API bridges
- presentation ergonomisi platform-specific adaptation isteyen kısımlar

## 21.4. Kural

Bir şeyi paylaşabiliyor olmak, paylaşmak için yeterli sebep değildir.  
Doğru soru şudur:

> Bu paylaşım kalite, okunabilirlik ve bakım maliyeti açısından gerçekten fayda üretiyor mu?

---

# 22. Mimari ve Design System İlişkisi

## 22.1. Neden birlikte düşünülmeli?

UI katmanı design system’i tüketir.  
Ama design system, business layer değildir.

## 22.2. Sağlıklı ilişki

- tokens/theme → foundation
- primitives/components → presentation support
- feature screens → bu yüzeyleri kullanır
- domain → design system bilmez

## 22.3. Zayıf ilişki örnekleri

- reusable UI package içine feature business logic koymak
- domain katmanında typography/layout kararı konuşmak
- screen’lerin DS yerine raw style üretmesi

---

# 23. Mimari ve Test İlişkisi

## 23.1. Doğru mimari test kalitesi üretir

- domain logic saf olursa unit test ucuz olur
- orchestration ayrılırsa integration test anlamlı olur
- component contract ayrılırsa component test netleşir
- shell/feature ayrımı varsa E2E path’ler daha okunabilir olur

## 23.2. Yanlış mimari test maliyeti üretir

- UI içinde business logic → test karmaşası
- raw data mapping ekran içinde → fixture cehennemi
- global state yığını → izole test zorluğu
- boundary belirsizliği → test kapsamı bulanıklığı

---

# 24. Mimari Drift Nedir?

## 24.1. Tanım

Mimari drift, başlangıçta net olan katman ve sorumluluk ayrımlarının zamanla küçük “istisnalar” ile bozulmasıdır.

## 24.2. En sık drift sinyalleri

1. Screen dosyalarının giderek şişmesi
2. Aynı endpoint mapping’inin farklı yerlerde tekrar edilmesi
3. `shared/common/utils` benzeri alanların büyümesi
4. App shell’e feature kararlarının sızması
5. Data ve UI state’in tek depoda erimesi
6. Platform bridge’lerin feature içine gömülmesi
7. Domain kararlarının component prop seviyesine dağılması

## 24.3. Kural

Drift küçük başlar.  
Bu yüzden erken fark edilmesi şarttır.

---

# 25. Mimari Drift’i Önleme Mekanizmaları

Bu belge tek başına yeterli değildir. Aşağıdaki desteklerle birlikte çalışmalıdır:

- `07-module-boundaries-and-code-organization.md`
- boundary lint/import rules
- repo structure spec
- ADR mekanizması
- contribution guide
- audit checklist
- definition of done

Mimariyi yalnızca “iyi niyetli geliştirici dikkat etsin” diye korumak zayıftır.

---

# 26. Bu Mimari Ne Değildir?

Bu belgeyi yanlış yorumlamayı önlemek için açıkça yazmak gerekir.

## 26.1. Bu mimari “clean architecture fetişi” değildir

Her küçük iş için use-case, repository, service, factory, adapter, controller yığını istemez.

## 26.2. Bu mimari “her şey shared olsun” yaklaşımı değildir

Shared-by-proof ilkesi geçerlidir.

## 26.3. Bu mimari “UI sadece dump olsun” yaklaşımı değildir

Presentation layer yine de:
- accessibility,
- state surface,
- hierarchy,
- interaction feedback
taşımak zorundadır.

## 26.4. Bu mimari “domain her şeyi bilsin” yaklaşımı değildir

Domain platform, navigation ve rendering bilmez.

---

# 27. Mimari Karar Verirken Sorulacak Sorular

Bir yeni dosya, modül veya davranış eklerken şu sorular sorulmalıdır:

1. Bu şey app shell kararı mı, feature kararı mı?
2. Bu şey UI mı, orchestration mı, domain mi, data mı?
3. Bu bilgi platform-specific mi?
4. Bu karar reusable mı yoksa feature-local mi?
5. Yarın test etmek için doğru katmanda mı?
6. Bu karar başka feature’lara yanlış bağımlılık yaratır mı?
7. Bu şey gerçekten shared olmalı mı?
8. Bu logic data shape bağımlı mı, domain-safe mi?
9. Bu kullanıcıya gösterilecek feedback mi, ham teknik sonuç mu?
10. Bu değişiklik için ADR gerekir mi?

---

# 28. Application Architecture Anti-Pattern Listesi

Aşağıdaki davranışlar bu proje kapsamında zayıf kabul edilir:

1. UI içinde business rule çözmek
2. Screen içinde raw fetch + mapping + retry + toast + navigation hepsini bir arada çözmek
3. App shell’i feature logic ile doldurmak
4. Domain katmanında platform bağımlılığı taşımak
5. Her şeyi global store’a veya shared klasöre yığmak
6. Data layer’ı ekranlara dağıtmak
7. Ham teknik hatayı doğrudan kullanıcıya göstermek
8. Shared code oranı için platform ergonomisini bozmak
9. Aşırı soyutlama ile basit feature’ları gereksiz dosya mezarlığına çevirmek
10. Sınırları belge yerine doğaçlama ile belirlemek

---

# 29. New Architecture (Fabric / JSI / TurboModules) Katmanı

## 29.1. Bağlam

Expo SDK 55 ile birlikte React Native New Architecture artık varsayılan olarak etkinleştirilmiştir ve kapatılması desteklenmemektedir. Bu durum, boilerplate'in mimari katmanlarını doğrudan etkiler. New Architecture'ın beş temel bileşeni ve mimari katmanlardaki konumları aşağıda detaylandırılmıştır.

## 29.2. JSI (JavaScript Interface)

JSI, eski Bridge mekanizmasının yerini alan yeni iletişim katmanıdır. Eski mimaride JavaScript ve native taraf arasındaki her iletişim JSON serializasyonu üzerinden asenkron olarak Bridge üzerinden geçiyordu. JSI bu ara katmanı kaldırır ve JavaScript'in doğrudan C++ host object'lerine erişmesini sağlar.

**Mimari etkisi:** JSI, Platform/Infrastructure Layer'da konumlanır. Data Access Layer ve Feature Orchestration Layer'ın native modüllerle olan iletişimini doğrudan etkiler. Senkron çağrı desteği sayesinde, eski mimaride asenkron olmak zorunda olan bazı native erişimler (ör. MMKV okuma/yazma, Reanimated shared values) artık senkron olarak gerçekleştirilebilir. Bu, özellikle performans kritik alanlarda (animasyon, gesture handling, secure storage okuma) mimari tasarımı etkiler.

**Pratikte ne değişir:** JSI tabanlı kütüphaneler (react-native-reanimated, react-native-mmkv, @shopify/flash-list vb.) eski Bridge tabanlı alternatiflere göre tercih edilir. `38-version-compatibility-matrix.md`'de JSI uyumu zorunlu kontrol kriteri olarak yer alır.

## 29.3. Fabric

Fabric, React Native'in yeni render sistemidir. Eski render sistemi shadow tree'yi JavaScript tarafında oluşturup asenkron olarak native'e gönderirken, Fabric bu süreci C++ üzerinden senkron ve concurrent olarak yürütür.

**Mimari etkisi:** Fabric, Presentation Layer'ı doğrudan etkiler. Concurrent rendering desteği sayesinde, uzun render işlemleri ana thread'i bloklamadan gerçekleştirilebilir. Shadow tree optimizasyonları, özellikle uzun listeler ve karmaşık layout'larda performans artışı sağlar. React 18+ concurrent feature'ları (Suspense, useTransition, useDeferredValue) Fabric ile birlikte tam kapasiteyle çalışır.

**Third-party uyum riski:** Fabric uyumu olmayan third-party bileşenler (ör. eski native view manager tabanlı bileşenler) çalışma zamanı hatası üretebilir. `20-initial-implementation-checklist.md`'de Fabric uyumsuz bileşen tespiti zorunlu adım olarak yer almalıdır. Alternatif planlanmadan Fabric uyumsuz bileşen kullanılmamalıdır.

## 29.4. TurboModules

TurboModules, native modüllerin lazy-loading (geç yükleme) ile başlatılmasını sağlayan yeni modül sistemidir. Eski mimaride tüm native modüller uygulama başlatılırken tek seferde yüklenirken, TurboModules ile modüller yalnızca ilk kullanıldıklarında yüklenir.

**Mimari etkisi:** TurboModules, Platform/Infrastructure Layer ve App Shell Layer'ı etkiler. Uygulama startup süresi doğrudan iyileşir çünkü kullanılmayan modüller başlangıçta yüklenmez. Bu, özellikle çok sayıda native modül kullanan uygulamalarda belirgin performans artışı sağlar. `13-performance-standard.md`'deki startup süresi hedefleri bu iyileşmeyi dikkate almalıdır.

**Pratikte ne değişir:** Yeni native modüller TurboModule spec'i ile yazılmalıdır. Legacy native modüller backward compatibility katmanı üzerinden çalışır ancak performans avantajından faydalanamaz.

## 29.5. Codegen

Codegen, TypeScript tip tanımlarından native kod (C++, Java/Kotlin, Objective-C/Swift) otomatik üretimi sağlayan araçtır. Native modüllerin ve native bileşenlerin JavaScript arayüzü, TypeScript spec dosyaları üzerinden tanımlanır ve build sırasında native binding kodu otomatik üretilir.

**Mimari etkisi:** Codegen, Domain Layer ile Platform Layer arasındaki type safety'yi compile-time'a taşır. Runtime'da Bridge üzerinden geçen verinin tipini kontrol etmek yerine, compile-time'da tip uyumsuzluğu tespit edilir. Bu, özellikle custom native modül geliştirilmesi gerektiğinde önemli bir güvenlik katmanı sağlar.

## 29.6. Hermes V1

Hermes, React Native için optimize edilmiş JavaScript motorudur. SDK 55 ile birlikte Hermes varsayılan ve tek desteklenen JS motorudur. Bytecode precompilation sayesinde JavaScript kodu, uygulama build sırasında bytecode'a derlenir ve runtime'da parse maliyeti ortadan kalkar. Garbage collector iyileştirmeleri, memory kullanımını azaltır ve GC pause sürelerini kısaltır.

**Mimari etkisi:** Hermes, tüm katmanları etkileyecek şekilde runtime temeline oturur. Startup süresi ve memory kullanımı doğrudan iyileşir. Ancak Hermes'in desteklemediği bazı JavaScript özellikleri (ör. bazı Intl API'leri, bazı Proxy kullanım senaryoları) mevcuttur ve bu sınırlamalar dependency seçimlerini etkileyebilir. `37-dependency-policy.md` Hermes uyumluluğunu zorunlu değerlendirme kriteri olarak tanımlamalıdır.

## 29.7. Mimari Diyagramda Konumlandırma

```
┌──────────────────────────────────────────────┐
│                App Shell Layer               │
│  (Providers, Navigation Root, Auth Gate)     │
├──────────────────────────────────────────────┤
│             Presentation Layer               │
│  (Screens, Components, DS Consumption)       │
│  ← Fabric: concurrent rendering, shadow tree │
├──────────────────────────────────────────────┤
│        Feature Orchestration Layer           │
│  (State orchestration, intent mapping)       │
├──────────────────────────────────────────────┤
│              Domain Layer                    │
│  (Business rules, validation, computation)   │
│  ← Codegen: compile-time type safety         │
├──────────────────────────────────────────────┤
│           Data Access Layer                  │
│  (Query, cache, mapping, mutation)           │
│  ← JSI: senkron native data erişimi          │
├──────────────────────────────────────────────┤
│     Platform / Infrastructure Layer          │
│  (Storage, sensors, permissions, bridges)    │
│  ← TurboModules: lazy-loading native modüller│
│  ← Hermes: bytecode precompilation           │
└──────────────────────────────────────────────┘
```

---

# 30. Micro-Frontend / Module Federation Değerlendirmesi

## 30.1. Mevcut Karar: Şu An Gerek Yok

Bu boilerplate, monorepo + Turborepo mimarisi ile çalışır (ADR-003). Tüm feature modülleri aynı repo içinde yaşar, aynı build pipeline'ından geçer ve aynı deploy süreci ile dağıtılır. Bu yapı, başlangıç ve orta ölçekli projeler için yeterli esnekliği ve performansı sağlar.

Micro-frontend (bağımsız deploy edilebilen frontend modülleri) veya Module Federation (runtime'da farklı build'lerden modül paylaşımı) yaklaşımları, bu boilerplate'in mevcut ölçeği ve kullanım senaryosu için aşırı mühendislik (over-engineering) teşkil eder.

## 30.2. Neden Şu An Gerek Yok?

Monorepo + Turborepo yaklaşımının sağladığı avantajlar mevcut ihtiyaçları karşılamaktadır:

- **Tek build pipeline:** Tüm paketler ve uygulamalar tutarlı biçimde derlenir, test edilir ve deploy edilir.
- **Compile-time type safety:** Paketler arası tip uyumu build sırasında doğrulanır. Module Federation'da bu garanti runtime'a kayar ve hata riski artar.
- **Basit dependency yönetimi:** Tüm dependency'ler tek lockfile'da yönetilir. Sürüm çatışmaları ve duplicate dependency sorunları minimize edilir.
- **CI/CD basitliği:** Tek repo, tek pipeline, tek deploy. Micro-frontend'de her modülün bağımsız CI/CD pipeline'ı gerekir.
- **Geliştirici deneyimi:** Monorepo içinde cross-reference, refactoring ve debugging doğrudan çalışır. Micro-frontend'de modüller arası debugging zorlaşır.

## 30.3. Değerlendirme Koşulu

Micro-frontend veya Module Federation yaklaşımının değerlendirilmesi için aşağıdaki tetikleyicilerden en az biri oluşmalıdır:

1. **10+ feature modülü:** Monorepo'daki feature modülü sayısı 10'u aşıp build süreleri kabul edilemez seviyeye ulaştığında (ör. CI build > 20 dakika), bağımsız build ihtiyacı doğar.
2. **Bağımsız takım deploy ihtiyacı:** Farklı takımların farklı feature'ları bağımsız olarak, birbirlerinin deploy sürecini bloklamadan deploy etmesi gerektiğinde.
3. **Farklı release cadence'leri:** Bazı feature modüllerinin haftalık, bazılarının aylık release döngüsüne ihtiyaç duyması durumunda.
4. **Runtime dinamik modül yükleme:** Belirli feature'ların kullanıcı rolüne veya abonelik düzeyine göre runtime'da dinamik olarak yüklenmesi gerektiğinde.

## 30.4. Risk Değerlendirmesi

Micro-frontend yaklaşımının oluşturacağı riskler:

- **Karmaşıklık artışı:** Runtime module resolution, shared dependency yönetimi, version mismatch hataları, CORS yapılandırması ve routing çatışmaları.
- **Performans overhead:** Runtime'da modül yükleme gecikmeleri, duplicate dependency riski ve bundle boyutu artışı.
- **Test zorluğu:** Entegrasyon testlerinin modüller arası runtime uyumunu doğrulaması gerekir; bu, monorepo'daki compile-time doğrulamadan çok daha zordur.
- **Mobile platform uyumu:** Module Federation web tarafında olgunlaşmış olsa da, React Native tarafında Re.Pack gibi araçlar henüz aynı olgunluk seviyesinde değildir.

Bu riskler, küçük-orta projeler için micro-frontend'in getireceği faydayı aşmaktadır. Bu nedenle tetikleyiciler oluşmadıkça monorepo yaklaşımı korunur.

---

# 31. Sonraki Dokümanlara Etkisi

## 29.1. Module boundaries and code organization
`07-module-boundaries-and-code-organization.md`, burada tanımlanan mantıksal katmanları fiziksel modül ve import kurallarına çevirmelidir.

## 29.2. State management strategy
`09-state-management-strategy.md`, state sahipliğini bu mimari katmanlara göre yerleştirmelidir.

## 29.3. Data fetching / cache / sync
`10-data-fetching-cache-sync.md`, data layer davranışını bu belgeyle uyumlu detaylandırmalıdır.

## 29.4. Repo structure spec
`21-repo-structure-spec.md`, bu mantıksal mimarinin fiziksel karşılığını üretmelidir.

## 29.5. Testing strategy
`14-testing-strategy.md`, domain/orchestration/presentation ayrımını test katmanlarına bağlamalıdır.

---

# 30. Onay Kriterleri

Bu doküman yeterli kabul edilir eğer:

1. Ana mimari katmanlar net ve birbirinden ayrılmış biçimde tanımlanmışsa,
2. Her katmanın sorumlulukları ve sorumluluk dışı alanları yazılmışsa,
3. Katmanlar arası bağımlılık yönü açıkça belirtilmişse,
4. App shell, presentation, orchestration, domain, data ve platform katmanları somut biçimde ayrılmışsa,
5. State, navigation, error, loading ve feedback akışının mimari yeri görünür kılınmışsa,
6. Cross-platform paylaşım sınırları açıklanmışsa,
7. Mimari drift riskleri ve anti-pattern’ler net yazılmışsa,
8. Sonraki boundary, state, data ve repo structure belgelerine uygulanabilir temel sağlanmışsa.

---

# 31. Kısa Sonuç

Bu dokümanın ana çıktısı şudur:

> Bu boilerplate kapsamında uygulama mimarisi; app shell, presentation, feature orchestration, domain, data access ve platform/infrastructure katmanlarını net ayıran; iş kuralını UI’dan, platform bağımlılığını domain’den, veri erişimini ekranlardan ve feature mantığını app shell’den ayrı tutan; cross-platform paylaşımı kalite ve ergonomi temelli yapan sistem omurgasıdır.

---

# 32. App Bootstrap ve Initialization Sequence

## 32.1. Amaç

Uygulamanın başlatılmasından ilk kullanıcı etkileşimine kadar olan deterministik sıranın tanımlanması. Bootstrap sırası, kullanıcının ilk izlenimini doğrudan etkiler; bu nedenle sıranın tutarlı, hızlı ve hata dayanıklı olması kritiktir. Bu sıra tüm derived project’ler için canonical’dır — override değil, genişletme (extension) ile özelleştirilir.

## 32.2. Canonical Bootstrap Sırası (Mobile)

```
1. Native Splash Screen (expo-splash-screen)
   └─ SplashScreen.preventAutoHideAsync()
      Uygulama yüklenene kadar native splash gösterilir.
      Bu çağrı App component’inin en üstünde, mount öncesinde yapılır.

2. Root Component Mount
   ├─ 2a. Font & Asset Yükleme (paralel)
   │   ├─ expo-font: Marka fontları yüklenir (useFonts hook)
   │   └─ expo-asset: Kritik görseller (logo, onboarding illüstrasyonları)
   │       önceden yüklenir — runtime’da görselsiz ekran önlenir
   │
   ├─ 2b. Store Hydration (paralel, 2a ile eşzamanlı)
   │   ├─ Auth Store: SecureStore’dan token okunur, session doğrulanır
   │   │   (ADR-010 — Expo SecureStore + Biometric)
   │   ├─ Config Store: MMKV’den feature flag ve remote config okunur
   │   └─ User Preferences: MMKV’den tema, dil, bildirim tercihleri
   │       okunur (i18next language, color scheme)
   │
   └─ 2c. i18n Initialization
       ├─ Cihaz dili tespit edilir (expo-localization)
       ├─ Kullanıcı tercihi MMKV’de varsa override edilir
       └─ İlgili namespace yüklenir (başlangıçta yalnızca
           common + auth namespace; geri kalanı lazy)

3. Bootstrap Tamamlanma Kontrolü
   ├─ Tüm kritik yüklemeler (font + auth) tamamlandı mı?
   ├─ Minimum splash süresi (1.5s) geçti mi?
   └─ Her iki koşul da sağlanınca → adım 4’e geç

4. Auth Durumuna Göre Yönlendirme
   ├─ Token geçerli → Main Stack (Ana ekran)
   ├─ Token yok veya expired → Auth Stack (Login ekranı)
   └─ İlk açılış (onboarding flag yok) → Onboarding Stack

5. Splash Gizleme
   └─ SplashScreen.hideAsync() + fade-out animasyonu (200ms)
       Splash, route kararı verildikten SONRA gizlenir —
       böylece yanlış ekranın kısa süre gösterilmesi (flash) önlenir.
```

## 32.3. Canonical Bootstrap Sırası (Web)

Web tarafında splash screen yerine farklı mekanizmalar kullanılır, ancak bootstrap prensibi aynıdır:

- **Loading skeleton:** `index.html` içinde inline CSS ile tanımlanan minimal loading skeleton gösterilir. Bu skeleton JavaScript parse edilmeden önce görünür olur; böylece beyaz ekran (white flash) önlenir.
- **Auth kontrolü:** HttpOnly cookie varlığı kontrol edilir → `/api/me` endpoint’ine istek gönderilerek session doğrulanır. Cookie yoksa doğrudan login ekranına yönlendirilir.
- **Font yükleme:** `@fontsource` paketi veya `<link rel="preload" as="font">` ile font’lar önceden yüklenir. `font-display: swap` kullanılarak font yüklenene kadar fallback font gösterilir.
- **Ortam değişkenleri:** `import.meta.env.VITE_*` prefix’i ile Vite build-time env resolution uygulanır.
- **Hydration:** `React.createRoot` (SPA) veya `React.hydrateRoot` (SSR senaryosunda) sonrası loading skeleton kaldırılır ve React uygulaması DOM’u devralır.

## 32.4. Bootstrap Sırasında Error Handling

Bootstrap aşaması, uygulamanın en kırılgan anıdır. Hata durumlarının her biri için açık bir fallback tanımlanmalıdır:

| Hata | Davranış | Fallback |
|------|---------|---------|
| Font yükleme hatası | Uyarı logla (Sentry breadcrumb) | Sistem fontuna geçiş, uygulama çalışmaya devam eder |
| Auth hydrate hatası | Token sıfırla, Sentry’ye bildir | Unauthenticated state → login ekranına yönlendir |
| Remote config hatası | Cache’ten oku, Sentry’ye bildir | Varsayılan config değerleri kullanılır |
| i18n yükleme hatası | Uyarı logla | Varsayılan dil (tr) ile devam et |
| Network tamamen yok | Offline banner göster | Cache’li veriyle başla (offline-first — ADR-019 ile uyumlu) |

- Bootstrap sırasında **critical hata** (crash, unhandled exception): App-level Error Boundary devreye girer. Bu boundary, kullanıcıya "Uygulama başlatılamadı" mesajı gösterir ve "Yeniden Dene" butonu sunar.
- Non-critical hatalar (font, config) uygulamayı durdurmaz; degraded mode ile devam edilir.

## 32.5. Minimum Splash Display Time

Hızlı cihazlarda bootstrap milisaniyeler içinde tamamlanabilir. Bu durumda splash screen’in anlık görünüp kaybolması (flash) kötü kullanıcı deneyimi yaratır. Bu nedenle minimum gösterim süresi uygulanır:

- **Minimum:** 1.5 saniye — hızlı cihazlarda flash önleme
- **Maximum:** 10 saniye — bootstrap takılırsa timeout ile varsayılan değerlerle devam
- **Süre kontrolü:** `Promise.all([bootstrapPromise, delay(1500)])` pattern’i ile hem bootstrap’ın tamamlanması hem minimum sürenin geçmesi beklenir.
- Maximum süre aşımında: Bootstrap tamamlanmamış olsa bile mevcut state ile devam edilir, hata Sentry’ye raporlanır.

## 32.6. Bootstrap Dependency Grafiği

Bootstrap adımlarının hangileri paralel, hangileri sıralı çalıştığını anlamak performans optimizasyonu ve hata izolasyonu için kritiktir:

**Paralel çalışabilenler (birbirini beklemez):**
- Font yükleme ∥ Auth hydrate ∥ Remote config ∥ i18n dil tespiti

**Sıralı bağımlılıklar (önceki adım tamamlanmadan başlayamaz):**
1. Auth hydrate tamamlanmalı → Route kararı (Main/Auth/Onboarding) verilebilir
2. Route kararı verilmeli → Navigation stack mount edilebilir
3. Navigation mount edilmeli → Splash gizlenebilir

**i18n namespace yükleme stratejisi:**
- Dil tespiti paralel yapılır (hızlı, ağ gerektirmez)
- Namespace yükleme route kararından sonra yapılır (lazy) — yalnızca aktif route’un ihtiyaç duyduğu namespace yüklenir
- Tüm namespace’lerin başlangıçta yüklenmesi **YASAK** (bundle bloat ve gereksiz ağ trafiği)

## 32.7. Bootstrap Anti-Pattern Listesi

| # | Anti-pattern | Doğru Yaklaşım |
|---|-------------|----------------|
| 1 | HomeScreen component’inde bootstrap mantığı barındırmak | Bootstrap root component’te veya dedicated bootstrap modülünde yapılır |
| 2 | Splash screen’i gizlemeyi unutmak (sonsuz splash) | Bootstrap completion callback’inde `SplashScreen.hideAsync()` çağrılır |
| 3 | Bootstrap sırasında kullanıcı etkileşimi beklemek | Bootstrap tamamen otomatik ve kullanıcıdan bağımsız olmalıdır |
| 4 | Auth kontrolünü navigation mount’tan sonra yapmak | Auth kontrolü route kararından ÖNCE tamamlanmalıdır (flash of wrong screen önlenir) |
| 5 | Tüm i18n namespace’leri başlangıçta yüklemek | Yalnızca aktif route’un namespace’i yüklenir, geri kalanı lazy |
| 6 | Bootstrap hatasını sessizce yutmak | Her hata loglanır (Sentry), kritik hatalar Error Boundary’ye düşer |
| 7 | Minimum splash süresi uygulamamak | `Promise.all([bootstrap, delay(1500)])` pattern’i kullanılır |
| 8 | Bootstrap timeout’u koymamak | 10 saniye timeout ile varsayılan değerlerle devam edilir |
