# 28-observability-and-debugging.md

## Doküman Kimliği

- **Doküman adı:** Observability and Debugging
- **Dosya adı:** `28-observability-and-debugging.md`
- **Doküman türü:** Standard / runtime diagnostics / telemetry governance / debugging policy document
- **Durum:** Accepted
- **Tarih:** 2026-03-31
- **Kapsam:** Bu belge, boilerplate kapsamında logging, error tracking, analytics, diagnostics, debug yüzeyleri, environment bazlı görünürlük seviyeleri, release metadata bağlama, privacy-safe telemetry, failure classification, signal-to-noise disiplini ve debugging yaklaşımını tanımlar.
- **Bağlı olduğu üst belgeler:**
  - `10-data-fetching-cache-sync.md`
  - `13-performance-standard.md`
  - `14-testing-strategy.md`
  - `15-quality-gates-and-ci-rules.md`
  - `16-tooling-and-governance.md`
  - `27-security-and-secrets-baseline.md`
  - `36-canonical-stack-decision.md`
  - `37-dependency-policy.md`
  - `38-version-compatibility-matrix.md`
  - `ADR-008 — Testing Stack`
  - `ADR-009 — Observability Stack`
  - `ADR-010 — Auth, Session and Secure Storage Baseline`
- **Doğrudan etkileyeceği belgeler:**
  - `29-release-and-versioning-rules.md`
  - `30-contribution-guide.md`
  - `31-audit-checklist.md`
  - `32-definition-of-done.md`
  - `35-document-map.md`

---

# 1. Bu Belgenin Revize Edilme Nedeni

Önceki sürüm observability alanını genel olarak iyi tarifliyordu.  
Ama artık çekirdek karar katmanında şu şeyler kapandı:

- error tracking baseline
- analytics yaklaşımı
- auth/session observability sınırları
- release metadata zorunluluğu
- privacy-safe telemetry ilkesi

Bu nedenle bu belge artık “gözlemlenebilirlik iyi bir şeydir” seviyesinde kalamaz.  
Artık şu ayrımı zorunlu olarak netleştirmek zorundadır:

> Logging, error tracking, analytics, diagnostics ve debugging aynı şey değildir; her biri farklı iş yapar ve farklı güvenlik/operasyon kısıtları altında çalışır.

Bu revizyonun amacı bu ayrımı operasyonel hale getirmektir.

---

# 2. Amaç

Bu dokümanın amacı, observability’yi:

- console log,
- sonradan eklenen analytics event’leri,
- rastgele debug ekranları,
- prod’da ne oldu anlamak için panik halinde açılan araçlar

olmaktan çıkarıp;  
**release, failure visibility, privacy, debugging hızı, audit ve DoD ile bağlı resmi runtime governance katmanı** haline getirmektir.

Bu belge şu sorulara net cevap verir:

1. Observability bu projede tam olarak hangi alt katmanlardan oluşur?
2. Error tracking, logging ve analytics neden farklıdır?
3. Hangi event’ler analytics, hangileri log, hangileri error tracking konusu olmalıdır?
4. Debug panel ve diagnostics yüzeyleri nasıl güvenli tasarlanmalıdır?
5. Prod / staging / preview / local için görünürlük seviyesi nasıl değişir?
6. Hangi telemetry davranışları noise üretir?
7. Release metadata ve versioning neden observability’nin parçasıdır?
8. Privacy ve security sınırları observability üzerinde nasıl enforce edilir?
9. Audit ve Definition of Done observability’yi nasıl kontrol eder?

---

# 3. Temel Tez

Bu proje kapsamında temel tez şudur:

> Observability, her şeyi loglamak veya her tıklamayı event yapmak değildir; sistem bozulduğunda, kullanıcı kritik akışta takıldığında, performans düştüğünde veya yanlış behavior oluştuğunda bunu hızlı, güvenli ve sınıflandırılmış biçimde görebilmeyi sağlayan çok katmanlı sinyal sistemidir.

Bu tez şu sonuçları doğurur:

1. Gürültü, gözlemlenebilirlik değildir.
2. Error tracking, analytics’in yerine geçmez.
3. Analytics, debugging’in yerine geçmez.
4. Console, production observability sistemi değildir.
5. Privacy-safe telemetry zorunludur.
6. Observability tasarımı release ve maintenance standardının parçasıdır.

---

# 4. Canonical Observability Modeli

`ADR-009` ile hizalı olarak bu boilerplate’in canonical observability modeli aşağıdaki katmanlardan oluşur:

1. **Error tracking**
2. **Structured application logging**
3. **Analytics / product telemetry**
4. **Diagnostics surfaces**
5. **Debug workflow**
6. **Release/build metadata**

Bu katmanlar farklı amaçlar taşır.

---

# 5. Error Tracking

## 5.1. Canonical baseline
- **Sentry**

## 5.2. Error tracking ne için kullanılır?
- uncaught exceptions
- crash-like failures
- critical handled failures
- route/render/init problems
- session/auth critical breakpoints
- mutation/query class failures with systemic effect
- release-associated failure visibility

## 5.3. Error tracking ne için kullanılmaz?
- generic business analytics
- arbitrary full object dumps
- debug trace çöplüğü
- full request/response archive
- credential storage

## 5.4. Kural
Error tracking issue üretir.  
Issue üretmeyen, aksiyon aldırmayan ve hassas veri saçan kullanım yanlıştır.

---

# 6. Structured Application Logging

## 6.1. Logging nedir?
Uygulama içindeki anlamlı teknik olayların, severity ve scope ile birlikte kaydedilmesidir.

## 6.2. Logging neden ayrı katmandır?
Çünkü her problem exception değildir.  
Ayrıca analytics event’i de değildir.

## 6.3. Logging neyi taşımalıdır?
- event or action name
- feature or scope
- severity
- selected sanitized metadata
- optional correlation id / request class
- environment awareness

## 6.4. Logging neyi taşımamalıdır?
- credentials
- full auth/session payloads
- uncontrolled free-text dumps
- entire API responses
- entire form objects
- prod’da spam debug noise

## 6.5. Kural
Logging structured olmalıdır.  
`console.log("buraya geldi")` kültürü canonical değildir.

---

# 7. Analytics / Product Telemetry

## 7.1. Canonical yaklaşım
Analytics vendor-agnostic abstraction-first model ile düşünülür.

## 7.2. Analytics ne için vardır?
- kullanıcı kritik akışa girdi mi?
- hangi adımda bıraktı?
- hangi CTA gösterildi ve işlendi?
- hangi flow tamamlandı / başarısız oldu?
- hangi feature gerçekten kullanılıyor?

## 7.3. Analytics ne için yoktur?
- low-level exception debugging
- security incident raw payload archive
- production console yerine geçmek
- user input toplama oyuncağı

## 7.4. Kural
Event taxonomy, naming discipline ve minimal payload zorunludur.

---

# 8. Diagnostics Surfaces

## 8.1. Tanım
Support, QA veya developer için sistemin iç durumunu anlamaya yardımcı olan kontrollü yüzeylerdir.

## 8.2. Örnekler
- build info sheet
- environment info
- active locale/theme summary
- feature flag surface
- query diagnostics (dev-only)
- selected release identifiers
- auth/session state summary (sanitized)

## 8.3. Kural
Diagnostics, debug kolaylığı adına security sınırlarını delemez.

---

# 9. Debugging

## 9.1. Tanım
Bir problemi anlamak ve kök nedenine ulaşmak için kullanılan pratik süreçtir.

## 9.2. Debugging neye dayanır?
- structured logs
- error tracking data
- release metadata
- selected analytics signals
- local/dev diagnostics
- tests and reproduction steps

## 9.3. Kural
Debugging süreci, prod ortamına sınırsız debug yüzeyi açma gerekçesi olamaz.

## 9.4. Geliştirici Hata Ayıklama Araçları ve İş Akışı

Bu bölüm, geliştirme sırasında hata ayıklama (debugging) için hangi araçların hangi senaryoda, nasıl kurulacağını ve nasıl kullanılacağını tanımlar. Amaç, geliştiricinin bir sorunla karşılaştığında doğru araca doğru refleksle yönelmesini sağlamaktır. `console.log` refleksi yerine araç bazlı sistematik teşhis kültürü hedeflenir.

### 9.4.1. React DevTools

**Ne işe yarar:**
Web ve mobile ortamda component tree yapısını, her component'in props, state ve hooks değerlerini görsel olarak incelemeye yarar. Hangi component'in hangi veriyle render edildiğini, parent-child ilişkilerini ve hook durumlarını canlı olarak gösterir.

**Kurulum:**
- **Web:** Chrome veya Firefox için React DevTools browser extension yüklenir. Extension yüklendikten sonra React uygulaması çalıştırıldığında browser DevTools panelinde "Components" ve "Profiler" sekmeleri otomatik olarak belirir.
- **React Native:** `react-devtools` npm paketi global olarak yüklenir (`npm install -g react-devtools`). Ardından terminal'den `react-devtools` komutuyla standalone uygulama başlatılır. React Native uygulaması bu standalone uygulamaya otomatik bağlanır.

**Kullanım:**
1. Components sekmesini aç.
2. Component tree'de hedef component'i seç (veya sayfa üzerinde elemana tıklayarak seç).
3. Sağ panelde seçili component'in props, state ve hooks değerlerini incele.
4. Değerlerin gerçek zamanlı değişimini izle; beklenen değer gelmiyorsa veri akışında sorun var demektir.

**Profiler:**
React DevTools Profiler sekmesi, render performansını ölçmek için kullanılır. Profiler ile:
- Hangi component'in neden re-render olduğu görülür (props değişti, state değişti, parent re-render oldu vb.).
- Her render'ın kaç milisaniye sürdüğü ölçülür.
- Flame chart üzerinden en yavaş render zinciri tespit edilir.
- "Why did this render?" bilgisi ile gereksiz re-render'lar yakalanır.

Profiler kullanım adımları: Profiler sekmesini aç → Record butonuna bas → Uygulamada ilgili akışı gerçekleştir → Stop ile kaydı durdur → Commit bazlı render detaylarını incele.

### 9.4.2. React Query DevTools (TanStack Query)

**Ne işe yarar:**
TanStack Query (React Query) ile yönetilen tüm query'lerin durumunu, cache içeriğini ve invalidation süreçlerini görsel olarak izlemeye yarar. Query'nin şu anki lifecycle state'ini (fresh, stale, fetching, paused, inactive, error) anlık olarak gösterir.

**Kurulum:**
`@tanstack/react-query-devtools` paketi yüklenir. Uygulama root'unda `<ReactQueryDevtools />` component'i eklenir. Bu component yalnızca `process.env.NODE_ENV === 'development'` durumunda render edilir; production build'de otomatik olarak devre dışı kalır. Ek konfigürasyon gerekmez.

**Kullanım:**
1. Uygulama çalıştırıldığında ekranın köşesinde TanStack Query DevTools ikonu belirir.
2. İkona tıklayarak panel açılır.
3. Tüm aktif query key'leri listelenir. Her query'nin yanında durumu (fresh, stale, fetching, error vb.) renk koduyla gösterilir.
4. Bir query key'e tıklayarak o query'nin cache'lenen data'sını, son fetch zamanını, staleTime ve cacheTime konfigürasyonunu, error detayını ve observer sayısını görebilirsin.
5. Manuel invalidation: Belirli bir query key'i seçip "Invalidate" butonuyla cache'i geçersiz kılabilirsin.
6. Manuel refetch: "Refetch" butonu ile query'yi zorla yeniden tetikleyebilirsin.
7. Cache temizleme: "Remove" ile query'yi cache'den tamamen kaldırabilirsin.

Bu panel özellikle şu durumlarda kritiktir: query neden stale kaldı, neden refetch tetiklenmedi, cache data beklenen mi, invalidation doğru çalışıyor mu sorularını cevaplar.

### 9.4.3. Zustand DevTools

**Ne işe yarar:**
Zustand store'larındaki state değişikliklerini kronolojik olarak izlemeye, her action'ın öncesi ve sonrası state farkını (diff) görmeye ve time-travel debugging yapmaya yarar.

**Kurulum:**
Zustand store tanımında `devtools` middleware'i kullanılır:

```ts
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

const useStore = create(
  devtools(
    (set) => ({
      // store tanımı
    }),
    { name: 'StoreName' } // Redux DevTools'da görünecek isim
  )
)
```

Browser'da **Redux DevTools** extension yüklü olmalıdır. Zustand'ın `devtools` middleware'i bu extension ile iletişim kurar. Extension yüklendikten sonra Redux DevTools panelinde Zustand store'ları otomatik olarak görünür.

**Kullanım:**
1. Redux DevTools panelini aç.
2. Sol tarafta dispatch edilen action'ların kronolojik listesini gör.
3. Her action'a tıklayarak o anki state snapshot'ını, bir önceki state ile diff'ini ve action payload'ını incele.
4. Time-travel debugging: Timeline üzerinde ileri-geri giderek state'in herhangi bir andaki halini gör. Bu özellik, "state bir noktada bozuluyor ama nerede?" sorusuna cevap verir.
5. State'i manuel olarak değiştirerek farklı senaryoları test et.

### 9.4.4. Flipper (React Native)

**Ne işe yarar:**
React Native uygulamaları için kapsamlı bir desktop debugging aracıdır. Tek bir araç içinde network inspector, layout inspector, uygulama logları, database inspector ve AsyncStorage/SharedPreferences inspector sunar.

**Kurulum:**
- Flipper desktop uygulaması resmi sitesinden indirilir ve kurulur.
- React Native projesine `react-native-flipper` paketi eklenir.
- Uygulama çalıştırıldığında Flipper desktop uygulaması cihazı veya emülatörü otomatik algılar ve bağlanır.

**Expo ile durum:**
Expo managed workflow'da Flipper desteği sınırlıdır. Expo managed projeler için Flipper yerine şu alternatifler tercih edilir:
- Expo DevTools (browser tabanlı diagnostics arayüzü)
- Standalone React DevTools (`react-devtools` paketi)
- `expo-dev-client` ile oluşturulan custom development client

Eğer Flipper zorunluysa Expo projesinin eject edilmesi (bare workflow'a geçiş) veya `expo-dev-client` ile custom native build oluşturulması gerekir.

**Flipper'ın sunduğu başlıca plugin'ler:**
- **Network Inspector:** Tüm HTTP/HTTPS isteklerini yakalar. Request URL, method, headers, body, response status, response body ve timing bilgilerini gösterir.
- **Layout Inspector:** Native view hierarchy'yi görsel olarak inceler. Accessibility bilgileri ve layout parametreleri görünür.
- **Logs:** Uygulama loglarını gerçek zamanlı izler. Severity bazlı filtreleme yapılabilir.
- **Database Inspector:** SQLite veritabanlarını sorgular ve görüntüler.
- **SharedPreferences / AsyncStorage Inspector:** Key-value storage içeriğini inceler ve düzenler.

### 9.4.5. Network Debugging

**Web:**
Browser DevTools'un Network sekmesi birincil araçtır. Bu sekmede:
- Her HTTP isteğinin URL, method, status code, response body, request/response headers bilgileri görünür.
- Timing breakdown ile DNS lookup, connection, TTFB (Time to First Byte) ve content download süreleri ayrı ayrı ölçülür.
- Filter ile XHR/Fetch, WS, JS, CSS gibi request tiplerine göre filtreleme yapılır.
- "Preserve log" seçeneği ile sayfa yenilemelerinde log kaybı önlenir.
- Request'e sağ tıklayıp "Copy as cURL" ile isteği terminal'de tekrar çalıştırabilirsin.

**Mobile (React Native):**
- Flipper Network Plugin (yukarıda açıklandı).
- React Native Debugger: Chrome DevTools tabanlı standalone debugger. Network inspect, React DevTools ve Redux DevTools'u tek arayüzde birleştirir.

**Proxy araçları:**
Charles Proxy veya Proxyman ile cihaz veya emülatörden geçen tüm HTTPS trafiği inspect edilebilir. Bu araçlar özellikle şu durumlarda gereklidir:
- Üçüncü parti SDK'ların hangi endpoint'lere istek attığını görmek.
- Request/response body'lerini detaylı incelemek.
- Belirli endpoint'lere mock response döndürmek (map local / map remote).
- Yavaş ağ koşullarını simüle etmek (throttling).

**Dikkat:** SSL pinning aktif olan uygulamalarda proxy araçları sertifika hatası verir. Development build'lerde SSL pinning'in devre dışı bırakılabilir olması veya proxy sertifikasının trust store'a eklenmesi gerekir. Bu ayarlar yalnızca development/staging ortamında yapılmalı, production build'de kesinlikle aktif olmamalıdır.

### 9.4.6. Console Debugging

`console.log`, `console.warn`, `console.error` gibi metotlar geliştirme sırasında hızlı ve kolay teşhis sağlar. Ancak bu yöntem sistematik değildir ve production'da bırakılması kabul edilemez.

**Kurallar:**
- `console.log` geliştirme sırasında geçici olarak kullanılabilir. Ancak commit öncesinde temizlenmelidir.
- Production build'de console çıktılarının kaldırılması zorunludur. Bunun için:
  - `babel-plugin-transform-remove-console`: Babel konfigürasyonuna eklenerek production build'de tüm console çağrılarını otomatik olarak kaldırır.
  - ESLint `no-console` kuralı: Development sırasında console kullanımını uyarı veya hata olarak işaretler. Bu kural ile geliştiriciler console satırlarını commit etmeden önce fark eder.
- **Tercih sıralaması:** DevTools tabanlı araçlar her zaman console'dan önce gelir. Araç kullanmak mümkünken console'a düşmemek hedeflenmelidir. DevTools > structured logging > console.log sıralaması geçerlidir.

### 9.4.7. Expo'ya Özel Debugging

Expo projelerinde debugging için aşağıdaki araçlar ve yöntemler kullanılır:

- **Cache temizleme:** `npx expo start --clear` komutu Metro bundler cache'ini temizleyerek başlatır. Garip build hataları veya eski kod'un cache'den serve edilmesi durumlarında ilk denenecek adımdır.
- **Developer menu:** Expo Go uygulamasında cihazı sallama (shake gesture) ile developer menu açılır. Bu menüden:
  - Remote JS debugging açılabilir.
  - Performance monitor etkinleştirilebilir.
  - Element inspector başlatılabilir.
  - Fast refresh durumu kontrol edilebilir.
- **Custom dev client:** `expo-dev-client` paketi ile oluşturulan custom development client, Expo Go'nun sınırlamalarını aşar. Native modül debugging, daha zengin DevTools entegrasyonu ve Flipper benzeri araç desteği sağlar. Bare workflow gerektirmeden native seviyede debugging imkanı tanır.

### 9.4.8. Performans Debugging

**Web:**
Chrome DevTools Performance sekmesi kullanılır. Bu sekme ile:
- **Flame chart:** JavaScript execution, rendering, painting ve compositing aşamalarını timeline üzerinde gösterir. Hangi fonksiyonun ne kadar sürdüğünü, hangi frame'lerin dropped olduğunu görürsün.
- **Layout shifts:** Cumulative Layout Shift (CLS) metriğini etkileyen layout kaymaları tespit edilir.
- **Long tasks:** 50ms'den uzun süren task'lar sarı/kırmızı ile işaretlenir. Bu task'lar ana thread'i bloke eder ve kullanıcı deneyimini bozar.
- Kayıt adımları: Performance sekmesini aç → Record'a bas → Uygulamada yavaşlık hissedilen akışı gerçekleştir → Stop → Flame chart ve summary üzerinden bottleneck'i tespit et.

**Mobile (React Native):**
- **React Native Perf Monitor:** Emülatör veya cihazda developer menu'den (iOS: Cmd+D, Android: Cmd+M veya shake) "Show Perf Monitor" seçilerek etkinleştirilir. Ekranda JS thread FPS ve UI thread FPS değerlerini gerçek zamanlı gösterir. JS FPS düşüyorsa JavaScript tarafında, UI FPS düşüyorsa native rendering tarafında sorun vardır.
- **Flipper Performance Plugin:** CPU kullanımı, memory tüketimi ve frame rate'i timeline üzerinde izler.
- **Hermes Profiler:** Hermes engine kullanan projelerde (Expo ve React Native'de varsayılan) CPU profiling yapar. Chrome DevTools'a bağlanarak flame chart üretir. Hangi JS fonksiyonunun ne kadar CPU tükettiğini gösterir.

### 9.4.9. Memory Debugging

**Web:**
Chrome DevTools Memory sekmesi kullanılır:
- **Heap snapshot:** O anki memory'nin fotoğrafını çeker. Hangi objelerin ne kadar memory tuttuğunu, retain tree'de kimin kimi tuttuğunu gösterir. İki farklı zamanda alınan snapshot'lar karşılaştırılarak (comparison view) leak eden objeler tespit edilir.
- **Allocation timeline:** Belirli bir süre boyunca memory allocation'larını kaydeder. Hangi zamanda hangi objelerin yaratıldığını ve garbage collect edilip edilmediğini gösterir. Sürekli büyüyen allocation paterni memory leak işaretidir.
- **Allocation sampling:** Daha düşük overhead ile uzun süreli memory profiling yapar.

**Mobile (React Native):**
- **Hermes Memory Profiling:** Hermes engine'in built-in memory profiler'ı ile JS heap kullanımı izlenir.
- **Xcode Instruments (iOS):** Allocations ve Leaks instrument'ları ile native memory kullanımı ve leak'ler tespit edilir. React Native'de bridge üzerinden native tarafta oluşan leak'ler için bu araç gereklidir.
- **Android Studio Profiler:** Memory profiler ile Java/Kotlin heap, native memory ve graphics memory kullanımı izlenir. Allocation tracking ile hangi objelerin yaratıldığı ve GC tarafından toplanıp toplanmadığı görülür.

### 9.4.10. Yaygın Debugging Senaryoları ve Çözüm Yolları

Aşağıda geliştirme sürecinde sık karşılaşılan sorunlar ve her biri için hangi aracın, nasıl kullanılacağı tanımlanmıştır:

**1. "Component neden re-render oluyor?"**
→ React DevTools Profiler sekmesini aç. Record başlat, ilgili akışı gerçekleştir, kaydı durdur. Profiler her commit'te hangi component'in neden re-render olduğunu gösterir: props changed, state changed, hooks changed veya parent rendered. Gereksiz re-render tespit edilirse `React.memo`, `useMemo` veya `useCallback` ile optimize et.

**2. "Query neden stale kalıyor?"**
→ TanStack Query DevTools panelini aç. İlgili query key'i bul. Query'nin staleTime konfigürasyonunu kontrol et: staleTime sıfır veya çok kısa ise query hemen stale olur. Cache data'nın son güncellenme zamanını incele. Eğer query stale olmasına rağmen refetch tetiklenmiyorsa, refetchOnWindowFocus, refetchOnMount veya refetchInterval ayarlarını kontrol et.

**3. "State neden güncellenmedi?"**
→ Zustand DevTools'u (Redux DevTools paneli) aç. Action listesinde beklenen action'ın dispatch edilip edilmediğini kontrol et. Action dispatch edildiyse state diff'ini incele: state gerçekten değişti mi? Eğer action dispatch edilmediyse, action'ı tetikleyen kodda sorun var demektir (event handler bağlanmamış, koşul sağlanmamış vb.). Eğer action dispatch edildi ama state değişmediyse, reducer/set fonksiyonundaki mantığı kontrol et.

**4. "API isteği neden başarısız?"**
→ Network debugging aracını aç (web: DevTools Network tab, mobile: Flipper Network Plugin veya React Native Debugger). Başarısız isteği bul. Şunları kontrol et: HTTP status code (4xx client error mı, 5xx server error mı?), response body (backend ne mesaj döndü?), request headers (auth token gönderildi mi, doğru mu?), request body (payload doğru formatta mı?). Yalnızca "bir hata oluştu" mesajına bakmak yetersizdir; her zaman response body ve status code incelenmelidir.

**5. "Uygulama neden yavaş?"**
→ Performans profiler kullan. Web'de Chrome DevTools Performance sekmesinde kayıt al, flame chart'ta long task'ları ve bottleneck'leri tespit et. Mobile'da Perf Monitor ile JS ve UI thread FPS değerlerini izle; düşük FPS hangi thread'de ise sorun o taraftadır. Hermes Profiler ile CPU-intensive fonksiyonları tespit et. "Yavaş hissediyorum" demek yeterli değildir; profiling verisi ile somut bottleneck gösterilmelidir.

**6. "Memory leak var mı?"**
→ Heap snapshot karşılaştırması yap. Birinci snapshot'ı al, şüpheli akışı birkaç kez tekrarla, ikinci snapshot'ı al. Comparison view'da iki snapshot arasında artış gösteren obje türlerini incele. Detached DOM nodes, event listener birikimi, kapatılmamış subscription'lar veya temizlenmeyen timer'lar yaygın leak kaynaklarıdır. Mobile'da Xcode Instruments (iOS) veya Android Studio Profiler ile native taraftaki leak'leri de kontrol et.

### 9.4.11. Hatalı Yaklaşımlar

Aşağıdaki davranışlar sistematik debugging disiplinine aykırıdır ve bu proje kapsamında zayıf kabul edilir:

1. **Her yere `console.log` bırakıp DevTools kullanmamak.** Console geçici ve kaba bir araçtır. DevTools component state'ini, query cache'ini, store timeline'ını ve network detayını console'dan çok daha iyi gösterir. Console ile debugging yapmak, DevTools varken kağıt-kalemle hesap yapmaya benzer.

2. **Production'da debug araçlarını aktif bırakmak.** React Query DevTools, Zustand DevTools middleware'i, Flipper bağlantısı ve benzeri araçlar production build'de devre dışı olmalıdır. Aktif bırakılması hem performans kaybına hem güvenlik açığına neden olur. Build konfigürasyonunda environment bazlı kontrol zorunludur.

3. **Network debugging için yalnızca "bir hata oluştu" mesajına bakmak.** Uygulama tarafındaki generic hata mesajı teşhis için yeterli değildir. Her zaman Network tab'a gidip response body, status code, request headers ve request payload incelenmelidir. Backend'in döndüğü gerçek hata mesajı ve HTTP status code olmadan debugging eksiktir.

4. **Profiling yapmadan "yavaş hissediyorum" demek.** Performans sorunu hissetmek ile profiling verisiyle kanıtlamak farklı şeylerdir. Profiling yapılmadan optimizasyon girişimi yanlış yere odaklanma riskini taşır. Önce profiling verisi ile somut bottleneck tespit edilmeli, sonra hedefli optimizasyon yapılmalıdır.

5. **Tek bir araca bağımlı kalmak.** Farklı sorunlar farklı araçlar gerektirir. React DevTools render sorunlarını, Query DevTools cache sorunlarını, Network tab API sorunlarını, Memory profiler leak sorunlarını çözer. Doğru araç doğru soruna yönlendirilmelidir.

6. **Debug araçlarının kurulum ve konfigürasyonunu atlamak.** Araçlar yüklü ve doğru konfigüre edilmediğinde, sorun anında "aracı kurayım" diye zaman kaybedilir. Proje başlangıcında tüm geliştirici araçları kurulmalı ve çalışır durumda doğrulanmalıdır.

---

# 10. Release / Build Metadata

## 10.1. Neden observability’nin parçası?
Çünkü bir hata görüldüğünde ilk sorulardan biri şudur:
- bu hangi sürümde oldu?
- hangi build ile ilişkili?
- hangi environment’ta görüldü?

## 10.2. Minimum beklenen metadata
- environment
- app version
- build number / release id
- commit or release ref
- possible feature flag context summary
- platform info

## 10.3. Kural
Release metadata hem error tracking hem diagnostics düzeyinde ilişkilendirilebilir olmalıdır.

---

# 11. Logging / Error Tracking / Analytics Ayrım Tablosu

## 11.1. Hızlı karar mantığı

| Sinyal tipi | Amaç | Örnek |
|---|---|---|
| Error tracking | Kritik failure görünürlüğü | crash, init failure, uncaught error |
| Structured log | Teknik akış ve context | mutation started, retry skipped, cache invalidated |
| Analytics | Kullanıcı davranışı / ürün sinyali | flow started, CTA clicked, step completed |
| Diagnostics | Destek ve debug görünürlüğü | build info, current locale, current release |
| Debug local traces | Geliştirici teşhisi | local-only deep logging |

## 11.2. Kural
Aynı olayın her katmana rastgele kopyalanması noise üretir.

---

# 12. Failure Classification Politikası

## 12.1. Kural
Bütün failure’lar aynı severity ve aynı kanal ile işlenmez.

## 12.2. Örnek sınıflar
- debug
- info
- warning
- error
- critical

## 12.3. Örnek failure aileleri
- render/init failure
- auth/session failure
- query failure
- mutation failure
- validation failure
- permission failure
- network instability
- unknown system failure

## 12.4. Sonuç
Her failure family’si için:
- hangi yüzeye gideceği
- hangi severity ile gideceği
- kullanıcıyı etkileyip etkilemediği
düşünülmelidir.

---

# 13. Noise Politikası

## 13.1. En kritik ilke
> Çok veri, iyi observability demek değildir.

## 13.2. Noise nasıl oluşur?
- her handled error’ı issue yapmak
- her click’i analytics yapmak
- every render’da log üretmek
- aynı failure’ı farklı isimlerle raporlamak
- prod’da debug verbosity bırakmak
- repeated retry storm event’leri

## 13.3. Kural
Her sinyal şu soruya cevap vermelidir:
- bu veri karar aldırıyor mu?
- bu veri teşhisi hızlandırıyor mu?

Cevap hayırsa, sinyal değerli değildir.

---

# 14. Privacy ve Security Zorunluluğu

## 14.1. Kural
Observability, security’nin üstünde değildir.

## 14.2. `27-security-and-secrets-baseline.md` ile bağ
Aşağıdakiler default olarak observability yüzeylerine girmez:
- raw auth tokens
- credentials
- full form values
- full API payloads
- secrets
- sensitive personal data
- secure storage contents

## 14.3. Redaction zorunluluğu
Gerekli yüzeylerde:
- sanitize
- redact
- classify
yaklaşımı uygulanmalıdır.

---

# 15. Environment Bazlı Görünürlük Politikası

## 15.1. Local
- en derin debug yüzeyi burada olabilir
- ama gerçek secrets yine dump edilmez

## 15.2. Test
- deterministic observability olabilir
- test noise üretmemeli
- assertion-friendly olmalıdır

## 15.3. Preview
- sınırlı ve kontrollü telemetry
- gerçek prod verisi ve debug kaosu olmamalı

## 15.4. Staging
- prod-benzeri signal
- ama internal diagnostics daha zengin olabilir

## 15.5. Production
- güvenli
- kontrollü
- minimal ama yeterli
- gürültüsüz
olmalıdır.

---

# 16. Query ve Mutation Observability

## 16.1. `ADR-005` ile bağ
Query ve mutation katmanı şu sinyal ailelerini üretebilir:
- request class failures
- retries
- invalidation anomalies
- conflict states
- parsing failures
- slow request classes
- cache-related unusual behaviors

## 16.2. Kural
Bunlar:
- raw payload dump şeklinde değil,
- sınıflandırılmış ve sanitize edilmiş biçimde görünür olmalıdır.

## 16.3. Zayıf davranışlar
- every request body logging
- full query cache dumps
- mutation errors’ı raw backend string ile event yapmak

---

# 17. Auth / Session Observability

## 17.1. `ADR-010` ile bağ
Auth ve session tarafında şu sinyaller meşrudur:
- session restore success/failure class
- session expired
- re-auth required
- invalid credentials class
- permission denied class
- logout cleanup anomalies

## 17.2. Kural
Şunlar görünür olmamalıdır:
- raw token
- refresh token
- full auth response
- credential values

---

# 18. Form Observability

## 18.1. Meşru sinyaller
- form started
- validation blocked
- submit attempted
- submit failed class
- submit success
- step abandoned
- retry initiated

## 18.2. Yasak eğilimler
- form values logging
- password / code / sensitive fields analytics’e koyma
- full validation error dump with payload

---

# 19. Performance Signals

## 19.1. Kural
Observability, performance’dan ayrı düşünülmez.

## 19.2. Meşru performans sinyalleri
- slow route load
- slow critical mutation
- repeated retry loops
- startup anomalies
- long device-specific delays
- screen transition regressions (selected cases)

## 19.3. Not
Bu belge tam performance tooling seçimi yapmaz.  
Ama performans sinyalinin observability evreninde olduğuna hükmeder.

---

# 20. Correlation / Context Politikası

## 20.1. Kural
Sinyaller gerektiğinde ilişkilendirilebilir olmalıdır.

## 20.2. Faydalı context türleri
- release id
- environment
- feature scope
- route/screen id
- event class
- sanitized user binding
- workspace/tenant class summary
- device/platform summary

## 20.3. Dikkat
Context zenginliği, data dump bahanesi olamaz.

---

# 21. Sentry Kullanım Sınırları

## 21.1. Kural
Sentry canonical baseline’dır ama her problemi oraya dökmek zorunda değiliz.

## 21.2. Sentry’ye gitmesi güçlü aday olan şeyler
- uncaught runtime errors
- critical render failures
- app init breakages
- session restore systemic failures
- root-level navigation failures
- catastrophic mutation failures causing broken experience

## 21.3. Sentry’ye gitmesi zayıf olan şeyler
- normal validation errors
- expected user mistakes
- every 4xx as issue
- noisy network retries
- full debug-only traces

---

# 22. Console Kullanım Politikası

## 22.1. Kural
Console, production observability sistemi değildir.

## 22.2. Local’de yeri
- kısa ömürlü debug
- targeted diagnosis
- controlled development tracing

## 22.3. Prod’da yeri
- neredeyse yok
- leftover console noise kalite borcudur

## 22.4. Kural
PR’da bırakılan console satırları özellikle security ve observability açısından sorgulanmalıdır.

---

# 23. Contribution Etkisi

`30-contribution-guide.md` artık şu kuralları taşımalıdır:
- yeni event ekleyen kişi event taxonomy düşünmelidir
- debug helper ekleyen kişi prod safety göstermelidir
- Sentry integration yapan kişi sanitize ettiğini kanıtlamalıdır
- analytics vendor abstraction bypass edilmemelidir
- observability değişikliği release not veya docs etkisi taşıyorsa doküman güncellenmelidir

---

# 24. Audit Etkisi

`31-audit-checklist.md` içinde explicit observability kontrolleri olmalıdır:

1. Error tracking misuse var mı?
2. Analytics event noise var mı?
3. Structured logging yerine dump culture var mı?
4. Release/build metadata bağlanmış mı?
5. Security/privacy sınırları ihlal ediliyor mu?
6. Prod debug surface sızıntısı var mı?
7. Query/auth/forms observability yanlış yerde mi?

---

# 25. Definition of Done Etkisi

`32-definition-of-done.md` içinde observability-relevant işlerde şu kanıtlar aranmalıdır:

- doğru signal üretildi
- yanlış signal üretilmedi
- sanitize / redaction düşünüldü
- release/build metadata etkisi değerlendirildi
- gerekiyorsa docs veya event taxonomy sync yapıldı

---

# 26. Anti-Pattern Listesi

Aşağıdaki davranışlar bu proje kapsamında doğrudan zayıf kabul edilir:

1. “Sentry kurduk, observability tamam” demek
2. every click analytics yapmak
3. full object / full response loglamak
4. prod’da leftover console bırakmak
5. analytics ve debugging’i aynı payload’ta çözmeye çalışmak
6. privacy-safe telemetry kuralını yok saymak
7. release metadata bağlamını hiç düşünmemek
8. query/mutation failures’ı ya tamamen görünmez bırakmak ya da gürültüye çevirmek
9. auth/session event’lerinde hassas veri sızdırmak
10. debug paneli müşteri yüzeyine taşımak

---

# 27. Onay Kriterleri

Bu belge yeterli kabul edilir eğer:

1. Logging / error tracking / analytics / diagnostics / debugging ayrımı net yapılmışsa
2. `ADR-009` ile açık hizalama kurulmuşsa
3. privacy ve security sınırları görünürse
4. query/auth/forms/performance ile observability ilişkisi tanımlanmışsa
5. contribution, audit ve DoD etkileri açık yazılmışsa
6. noise ve misuse örnekleri netse
7. Bu belge runtime visibility standardı olarak gerçek kullanıma uygun netlikteyse

---

# 28. Kısa Sonuç

Bu proje için observability ve debugging standardı şudur:

- Sentry error tracking baseline’dır
- analytics abstraction-first ve privacy-safe çalışır
- logging structured olur
- diagnostics ve debug yüzeyleri environment-aware tasarlanır
- release/build metadata observability’nin resmi parçasıdır
- auth/query/forms/performance sinyalleri sınıflandırılmış biçimde ele alınır
- noise, raw dump ve secret leakage kabul edilmez

---

# 29. OpenTelemetry ve Real User Monitoring (2026-04-01 Eki)

Bu bölüm, vendor-agnostic observability standardı olarak OpenTelemetry entegrasyonunu, structured logging formatını, Real User Monitoring (RUM) metriklerini, frontend telemetry kapsamını, alerting/dashboard stratejisini ve privacy-safe telemetry kurallarını tanımlar.

## 29.1. OpenTelemetry Entegrasyonu

- 2026 itibarıyla OpenTelemetry, vendor-agnostic observability standardıdır.
- ADR-009 ile uyumlu çalışır: Sentry birincil araç olarak kalır, OpenTelemetry tamamlayıcı katman olarak kullanılır.
- OpenTelemetry Collector pipeline'ı: receive → process → export mimarisi uygulanmalıdır.
- Structured logging: OpenTelemetry log data model kullanılmalı; her log kaydında trace/span ID korelasyonu sağlanmalıdır.
- Mevcut Sentry SDK OpenTelemetry protocol'ünü destekler; ek entegrasyon maliyeti minimumdur.
- Log-trace korelasyonu: her log kaydına otomatik olarak `trace_id` ve `span_id` eklenmeli; bu sayede log ile trace arasında doğrudan navigasyon mümkün olmalıdır.

## 29.2. Structured Logging Formatı

- Her log kaydı şu alanları içermelidir: `timestamp`, `level`, `message`, `trace_id`, `span_id`, `service_name`, `environment`.
- JSON structured format kullanılmalıdır. `console.log` yerine structured logger tercih edilmelidir.
- Log seviyeleri: `debug` (yalnızca dev ortamda aktif), `info`, `warn`, `error`, `fatal`.
- PII filtreleme: structured log pipeline'da redaction zorunludur. Kullanıcı kişisel verileri log'lara yazılmamalıdır (ADR-017 ile uyumlu).

## 29.3. Real User Monitoring (RUM)

- **Web — Core Web Vitals izleme:**
  - LCP (Largest Contentful Paint): hedef < 2.5s
  - INP (Interaction to Next Paint): hedef < 200ms
  - CLS (Cumulative Layout Shift): hedef < 0.1
- Field data (gerçek kullanıcı metrikleri) ile lab data (synthetic test metrikleri) ayrımı yapılmalı; production kararları field data'ya dayanmalıdır.
- **Mobile:**
  - Crash-free session rate hedefi: > %99.5
  - App start time, screen load time ve API response time izlenmelidir.

## 29.4. Frontend Telemetry

- **JS Error Boundary telemetry:** Component bazında hata izleme yapılmalı; hangi component'te ne sıklıkta hata oluştuğu görünür olmalıdır.
- **Navigation timing:** Route geçiş süreleri izlenmeli; yavaş geçişler tespit edilmelidir.
- **Resource timing:** Asset yükleme süreleri (JS bundle, CSS, font, resim) izlenmelidir.
- **Long task detection:** 50ms'yi aşan task'lar izlenmeli ve raporlanmalıdır. Ana thread'i uzun süre bloke eden işlemler performans sorunu olarak değerlendirilmelidir.

## 29.5. Alerting ve Dashboard

- **Crash-free session rate düşüşü:** P0 alert — anında müdahale gerektirir.
- **LCP/INP regression:** P1 alert — bir sonraki sprint içinde çözülmelidir.
- **Error rate spike:** P1 alert — kök neden analizi yapılmalıdır.
- **Dashboard:** Platform bazlı (web vs iOS vs Android) ayrı metrikler gösterilmelidir. Tek dashboard'da tüm platformlar karıştırılmamalıdır.

## 29.6. Privacy-Safe Telemetry

- Telemetry verisi GDPR/KVKK uyumlu olmalıdır (ADR-017 referansı).
- IP anonimleştirme uygulanmalıdır.
- User ID yerine anonymous session ID kullanılabilir; kullanıcı izleme telemetry'nin amacı değildir.
- Consent durumuna göre telemetry seviyesi ayarlanmalıdır: consent verilmemişse yalnızca crash reporting aktif olabilir, detaylı telemetry devre dışı bırakılmalıdır.
