# 36-canonical-stack-decision.md

## Doküman Kimliği

- **Doküman adı:** Canonical Stack Decision
- **Dosya adı:** `36-canonical-stack-decision.md`
- **Doküman türü:** Decision document / canonical technical blueprint / stack lock document
- **Durum:** Accepted
- **Tarih:** 2026-03-31
- **Kapsam:** Bu belge, boilerplate için artık verilmiş kabul edilen çekirdek teknik kararları tek yerde toplar. Hangi runtime’ların, hangi mimari taşıyıcıların, hangi state/data/forms/styling/testing/observability/auth/i18n omurgasının ve hangi repo/workspace zincirinin kullanılacağını açıkça kilitler. Bu belge teknoloji değerlendirme çerçevesi değildir; teknoloji seçiminin sonucu olan **nihai teknik blueprint** belgesidir.
- **Bağlı olduğu üst belgeler:**
  - `00-project-charter.md`
  - `01-working-principles.md`
  - `02-product-platform-philosophy.md`
  - `03-ui-ux-quality-standard.md`
  - `04-design-system-architecture.md`
  - `06-application-architecture.md`
  - `07-module-boundaries-and-code-organization.md`
  - `17-technology-decision-framework.md`
  - `18-adr-template.md`
- **Doğrudan bağlı karar belgeleri:**
  - `ADR-001 — Web Runtime and Application Shell`
  - `ADR-002 — Mobile Runtime and Native Strategy`
  - `ADR-003 — Monorepo, Package Manager and Build Orchestration`
  - `ADR-004 — State Management`
  - `ADR-005 — Data Fetching, Cache and Mutation Model`
  - `ADR-006 — Forms and Validation`
  - `ADR-007 — Styling, Tokens and Theming Implementation`
  - `ADR-008 — Testing Stack`
  - `ADR-009 — Observability Stack`
  - `ADR-010 — Auth, Session and Secure Storage Baseline`
  - `ADR-011 — Internationalization Baseline`
  - `37-dependency-policy.md`
  - `38-version-compatibility-matrix.md`

---

# 1. Bu Belgenin Rolü

Bu belge artık şu soruya tek cümlede cevap vermek içindir:

> “Bu boilerplate tam olarak hangi teknik stack ile kurulacak?”

Bu belge:

- alternatif sıralamaz,
- keşif yapmaz,
- “şu da düşünülebilir” diye yönü yeniden açmaz,
- belirsiz bırakmaz.

Bu belgenin işi şudur:

1. Teknik omurgayı tek yerde toplamak  
2. Hangi kararların artık **kilitli** olduğunu göstermek  
3. Repo bootstrap ve ilk implementasyon için referans olmak  
4. Daha sonra gelen herkese “hangi stack resmidir?” sorusunu kapatmak  

Bu yüzden bu belge “teknoloji çerçevesi” değil, **karar kilitleme belgesi**dir.

---

# 2. Neden Bu Belge Gerekli

Belge seti yalnızca prensip, kalite standardı ve governance ile güçlü kalırsa ama nihai teknik seçim yapılmazsa şu problem çıkar:

- herkes farklı varsayımla implementasyona başlar
- repo structure soyut kalır
- checklist keşif listesine dönüşür
- dependency policy neyi koruduğunu tam söyleyemez
- compatibility matrix neye göre işletileceği belirsiz kalır
- teknoloji kararı chat hafızasında kalır, belgeye dönüşmez

Bu belgede asıl düzeltilen boşluk budur.

Bu belge olmadan sistem şunu çok iyi söyler:
- nasıl düşünmeliyiz
- neyi reddetmeliyiz
- kaliteyi nasıl korumalıyız

Ama şunu eksik bırakır:
- **hangi somut teknoloji seti ile inşa edeceğiz**

Bu nedenle bu belge zorunludur.

---

# 3. Temel Tez

Bu boilerplate için temel tez şudur:

> Çekirdek teknoloji omurgası erken ama belgesiz şekilde değil; yeterli mimari, kalite ve governance zemini kurulduktan sonra açıkça kilitlenmelidir. Bu kilitlenmiş omurga daha sonra dependency policy, compatibility matrix, repo structure spec ve implementation checklist tarafından uygulanmalıdır.

Bu tez şu sonuçları doğurur:

1. Artık web runtime, mobile runtime, state, data, forms, styling, testing, auth, i18n ve monorepo yönü açıktır.
2. Bundan sonra bu alanlarda yeni öneri getirmek, sıradan alternatif önerisi değil; mevcut karar katmanını yeniden açma talebidir.
3. Closed canonical area ile open operational area birbirine karıştırılamaz.
4. Repo bootstrap bundan sonra keşif değil, uygulama işidir.

---

# 4. Bu Belge ile Ne Kilitleniyor?

Bu belge aşağıdaki alanlarda canonical karar verir:

1. Web runtime ve shell yaklaşımı
2. Mobile runtime ve native strateji
3. Monorepo / workspace / build orchestration
4. App-global state yaklaşımı
5. Server-state / query / cache yaklaşımı
6. Form ve validation yaklaşımı
7. Styling / tokens / theming implementation layer
8. Navigation baseline
9. Testing baseline
10. Observability baseline
11. Auth / session / secure storage baseline
12. Internationalization baseline
13. Docs / governance / dependency / compatibility ilişki modeli

---

# 5. Canonical Stack — Kısa Hüküm

Bu boilerplate için canonical teknik stack aşağıdaki gibidir:

- **Web runtime:** React 19.x + Vite 7.x intentional baseline + React Router 7.x
- **Mobile runtime:** React Native 0.83.x + Expo SDK 55.x
- **Repo/workspace:** Monorepo + pnpm 10.x + Turborepo 2.x
- **Type system:** TypeScript 5.9.x baseline
- **App-global client state:** Zustand 5.x
- **Server-state / query-cache:** TanStack Query 5.x
- **Forms:** React Hook Form 7.x
- **Validation/schema:** Zod 4.x
- **Web styling:** Tailwind CSS 4.x
- **Mobile styling:** NativeWind 5.x candidate track (pre-release status bootstrap öncesi doğrulanır)
- **Token authority:** shared design tokens + semantic token layer
- **Web testing:** Vitest 4.x + Testing Library
- **Mobile component/integration testing:** Jest 30.x + Testing Library
- **Web E2E:** Playwright 1.58.x track
- **Error tracking:** Sentry
- **Analytics:** abstraction-first, vendor-agnostic
- **Auth/session:** web cookie-preferred, mobile secure storage adapter
- **i18n:** i18next + react-i18next
- **Docs/governance:** ADR set + dependency policy + compatibility matrix + audit/DoD

Ama bu kısa hüküm tek başına yeterli değildir.  
Aşağıda her karar alanı ayrıntılı açıklanır.

---

# 6. Web Runtime Kararı

## 6.1. Seçim

Web uygulaması için canonical yön:

- **React 19.x**
- **React DOM 19.x**
- **Vite 7.x**
- **React Router 7.x**
- **SPA application shell baseline**

## 6.2. Bu ne anlama gelir?

Bu şu demektir:

- web app için React tabanlı modern client runtime kullanılır
- build/dev server katmanında Vite kullanılır
- route management için React Router hattı kullanılır
- başlangıç boilerplate’i SSR-first değil, SPA-first yorumlanır
- future SSR/RSC tartışmaları bu baseline’ı sessizce bozmaz

## 6.3. Neden bu seçim?

### A. Problem-fit
Bu boilerplate’in hedefi:
- hızlı ama kuralsız demo üretmek değil,
- kontrollü cross-platform ürün temeli kurmak.

Bu nedenle web tarafında ağır meta-framework yerine daha kontrollü app shell yaklaşımı daha uygun kabul edilmiştir.

### B. Mimari kontrol
Vite + React + explicit router kombinasyonu:
- shell ownership’i görünür kılar
- routing, providers, state ve DS wiring’i daha çıplak ve kontrol edilebilir şekilde kurmaya izin verir
- gereksiz framework lock-in’i azaltır

### C. Cross-platform denge
Web ve mobile iki ayrı framework felsefesine bölünmeden:
- ortak domain,
- ortak DS,
- ortak kalite standardı
etrafında birleşebilir.

### D. Gereksiz erken SSR kilidinden kaçınma
Bu boilerplate seviyesinde SSR, RSC veya tam-stack framework kararı:
- ürün tipi net olmadan,
- deployment topology belli olmadan,
- veri erişim modeli tamam kapanmadan
erken kabul edilir.

## 6.4. Reddedilen yönler

### Next.js / SSR-first
Neden reddedildi?
- gereğinden fazla app-shell karışıklığı getirebilir
- bu boilerplate’in cross-platform parity odağını erken server-first tartışmaya çekebilir
- her ürün için zorunlu olmayan komplekslik getirir

### “Plain CRA benzeri klasik setup”
Neden reddedildi?
- modern toolchain ve runtime beklentisini taşımaz
- Vite ekosistemi kadar güçlü ve verimli değildir

## 6.5. Sınırlar
Bu karar:
- gelecekte SSR imkânsız demek değildir
- ama baseline’ın SSR olmayacağı anlamına gelir

Bu çok önemli bir ayrım.

---

# 7. Mobile Runtime Kararı

## 7.1. Seçim

Mobile uygulama için canonical yön:

- **React Native 0.83.x line**
- **Expo SDK 55.x line**
- **Expo-first managed/development-build aware workflow**
- **New Architecture reality accepted**

## 7.2. Bu ne anlama gelir?

- mobile app temelinde Expo-first yaklaşım kullanılır
- native capability ihtiyacı varsa önce Expo compatible yol düşünülür
- gerektiğinde development build / config plugin / controlled native escape hatch değerlendirilir
- “çıplak RN baştan kuralım, gerekirse Expo modülü ekleriz” yaklaşımı canonical değildir

## 7.3. Neden bu seçim?

### A. Cross-platform pragmatizmi
Expo-first yaklaşım:
- hızlı ama ciddiyetsiz değil,
- modern ama sürdürülebilir,
- RN ekosistemine açık ama native karmaşıklığı kontrollü
bir başlangıç sunar.

### B. Device API ve operational maturity
Expo SDK, modern React Native app için yeterince geniş capability sunar.

### C. Boilerplate seviyesinde daha doğru maliyet dengesi
Çıplak RN ile başlamak, bu boilerplate’in hedeflediği kaliteyi artırmaktan çok:
- build karmaşıklığı,
- native bakım yükü,
- early operational complexity
üretir.

## 7.4. Reddedilen yönler

### Bare RN-first
Neden reddedildi?
- boilerplate seviyesinde gereksiz erken native yük
- tooling, build ve CI maliyetini erken büyütme
- kalite standardı yerine altyapı taşıma maliyeti üretme

### Expo’yu yalnızca prototyping aracı gibi görmek
Neden reddedildi?
- gerçekçi değil
- modern Expo yaklaşımını küçümser
- development build, config plugins ve Expo Modules ekosistemini göz ardı eder

---

# 8. Monorepo / Workspace / Build Orchestration Kararı

## 8.1. Seçim

Canonical repo omurgası:

- **Monorepo**
- **pnpm 10.x**
- **Turborepo 2.x**

## 8.2. Bu neyi kilitler?

- `apps/web`
- `apps/mobile`
- shared packages
- docs
- tooling
- scripts
aynı repo içinde yaşar.

Package manager yönü:
- pnpm

Task orchestration yönü:
- Turborepo

## 8.3. Neden?

Bu kararın ayrıntılı gerekçesi `ADR-003`te anlatılır.  
Ama kısa cevap:
- apps/packages/docs/tooling birlikte evrilecek
- shared domain ve shared UI package ihtiyacı var
- dependency ve config governance merkezi olmalı
- CI/local task orchestration monorepo seviyesinde optimize edilmeli

---

# 9. State Management Kararı

## 9.1. Seçim

App-global client state için canonical araç:
- **Zustand**

## 9.2. Bu karar neyi çözmek için verildi?

Bu araç şu problem için seçilmiştir:
- küçük ama net app-global state yüzeyleri
- shell/state summary
- controlled store ownership
- Redux-class ceremony istemeyen ama kuralsız context da istemeyen yapı

## 9.3. Ne anlama gelmez?

Bu karar şunu söylemez:
- her state store’a girecek
- query verisi store’a kopyalanacak
- form state store’a bağlanacak
- domain logic store içinde yaşayacak

Tam tersine:
- local-first
- shared-by-proof
- state türleri ayrılmış
bir model hedeflenir.

## 9.4. Neden Redux Toolkit değil?

Bu boilerplate bağlamında:
- daha ağır yapı
- gereksiz ceremony
- bu boyuttaki shell/global state ihtiyacı için fazla kapsam
olarak değerlendirildi.

## 9.5. Neden context-only model değil?

- enforcement zor
- büyüdükçe ownership dağılır
- derived and persisted summary state için daha zayıf sinyal verir

---

# 10. Data Fetching / Cache / Mutation Kararı

## 10.1. Seçim

Canonical server-state ve query/cache katmanı:
- **TanStack Query 5.x**

## 10.2. Bu karar neyi çözer?

- async server-state management
- cache ownership
- stale/revalidate modeli
- mutation + invalidation pattern’leri
- retry/failure ergonomisi
- data lifecycle görünürlüğü

## 10.3. Neden önemli?

Bu seçim sayesinde şu ayrım resmi hale gelir:
- server-state ≠ app-global UI state
- query cache ≠ generic local store
- fetch logic ≠ screen logic

## 10.4. Neden ad-hoc fetch layer reddedildi?

Çünkü:
- tekrar üretimi yüksek
- invalidation düzensizleşir
- feature feature farklı network kültürü oluşur
- loading/error/empty state standardı bozulur

## 10.5. Neden SWR veya başka hafif alternatifler değil?

Bu boilerplate bağlamında:
- cross-platform shared mental model
- mutation/invalidation
- operational maturity
- geniş veri lifecycle kontrolü
açısından TanStack Query daha uygun kabul edilmiştir.

---

# 11. Forms and Validation Kararı

## 11.1. Seçim

- **Forms:** React Hook Form 7.x
- **Schema/validation:** Zod 4.x

## 11.2. Neden birlikte?

Çünkü:
- field lifecycle,
- submit lifecycle,
- schema validation,
- type inference,
- cross-platform ergonomi
birlikte düşünülmüştür.

## 11.3. Bu neyi çözer?

- form state yönetimi
- controlled/uncontrolled denge
- field-level ve form-level validation
- typed validation contracts
- reusable field shells ile entegrasyon

## 11.4. Neden Formik/Yup hattı değil?

Bu boilerplate için:
- daha eski mental model,
- render ergonomisi ve performance yönünden daha zayıf profil,
- RHF + Zod hattına göre daha az tercih edilen fit
olarak değerlendirilmiştir.

## 11.5. Kural

Validation yalnızca UI field error mesajı üretmek için kullanılmaz.  
Schema ve contract katmanı olarak da düşünülür.

---

# 12. Styling / Tokens / Theming Implementation Kararı

## 12.1. Seçim

- **Web styling runtime:** Tailwind CSS 4.x
- **Mobile styling runtime:** NativeWind 5.x candidate track
- **Design authority:** shared design tokens + semantic token layer
- **Theming:** semantic role driven, light/dark first-class, hardcoded escape hatch denied by default

## 12.2. Neden böyle?

### A. Design system-first çalışma biçimi
Bu proje random CSS veya random StyleSheet değil,  
token → semantic → primitive → component zinciri ister.

### B. Web ve mobile’da ortak semantik dil
Tailwind + NativeWind kombinasyonu, doğru kurgulanırsa:
- ortak utility mantığı,
- semantik theme rolleri,
- reusable DS primitives
için güçlü zemin verir.

### C. Hardcoded stile karşı governance gücü
Bu yaklaşım lint/runtime/guideline ile daha kolay enforce edilir.

## 12.3. Kritik not
Bu karar “utility class = başıboş styling” anlamına gelmez.  
Tam tersine:
- utility consumption bile token discipline altında olur
- raw value kaçışları istisna kabul edilir
- DS authority package düzeyinde korunur

## 12.4. Neden CSS-in-JS veya StyleSheet-first yön reddedildi?

- design authority parçalanır
- enforcement zayıflar
- hardcoded escape surface büyür
- cross-platform styling dilini tekilleştirmek zorlaşır

## 12.5. Dikkat edilmesi gereken risk
NativeWind 5.x hattı dikkatli izlenmelidir. 2026-04-01 doğrulamasında v5 dokümantasyonu hâlâ pre-release olarak işaretlenmiştir; bu nedenle bootstrap öncesi release-status kontrolü zorunludur ve GA olmadan sessiz production lock-in yapılamaz.
Bu nedenle bu karar:
- “kurduk, bitti” değil
- audit ve compatibility matrix ile birlikte yaşar

---

# 13. Navigation Kararı

## 13.1. Seçim

- **Web:** React Router 7
- **Mobile:** React Navigation 7 stable baseline
- **Watchlist:** React Navigation 8, fakat canonical baseline değil

## 13.2. Neden mobile tarafında 8 değil 7?

Çünkü güncel resmi durumda React Navigation 8 hâlâ pre-release statüsündedir ve yeni minimum gereksinimler getirir; bu nedenle baseline olarak değil, izlenen gelecek hat olarak değerlendirilir. Bu durum upgrade öncesi resmi release notlarıyla yeniden doğrulanmalıdır.

## 13.3. Ne anlama gelir?

- mobile navigation tarafında stable baseline 7.x’tir
- 8.x üzerinde spike/POC yapılabilir
- ama repo başlangıcı 8.x varsayımıyla kurulmaz

## 13.4. Neden Expo Router değil?

Expo Router güçlü bir yön olsa da, bu boilerplate’in mevcut karar setinde navigation authority şu ayrımla kurulmuştur:
- web routing ayrı
- mobile navigation ayrı
- parity behaviour karar seviyesinde korunur
- aynı router abstraction’ına gereksiz erken kilitlenilmez

Bu nedenle Expo Router bu baseline’da canonical seçim yapılmamıştır.

---

# 14. Testing Stack Kararı

## 14.1. Seçim

- **Web-side fast tests:** Vitest 4.x
- **RN-side component/integration:** Jest 30.x
- **UI behavior tests:** Testing Library family
- **Web E2E:** Playwright 1.58 track
- **Visual verification:** manual audit first, targeted visual proof, selective regression
- **Mobile E2E exact vendor:** bilinçli açık alan, ama baseline dışı bırakılmamış izleme alanı

## 14.2. Neden bu kombinasyon?

Çünkü tek araçla tüm katmanları çözmeye çalışmak sahte sadelik üretir.

Bu kombinasyon:
- web build/runtime zinciri ile doğal uyum,
- RN ekosistemi ile pratik uyum,
- behavior-first testing,
- güçlü web E2E,
- manual visual quality enforcement
bir arada sağlar.

## 14.3. Neden web-side Jest default değil?

Vite tabanlı web zincirinde Vitest daha doğal ve daha hızlıdır. Vite 7.x için Vitest desteği olgunlaşmış durumdadır; 4.x hattı modern baseline için uygundur. Bu eşleşme major upgrade öncesi resmi release notlarıyla yeniden doğrulanmalıdır.

## 14.4. Neden RN-side Vitest değil?

RN ekosisteminde Jest hâlâ daha güvenli ve daha doğal test omurgasıdır.  
Ayrıca Jest 30.x stable kabul edilir ve bizim Node/TS hattımız bu gereksinimlerin üzerindedir. Exact alt sürüm ve peer koşulları bootstrap öncesi manifest düzeyinde doğrulanmalıdır.

---

# 15. Observability Kararı

## 15.1. Seçim

- **Error tracking:** Sentry
- **Analytics:** abstraction-first, vendor-agnostic
- **Logging:** structured, privacy-safe
- **Diagnostics:** environment-aware

## 15.2. Neden analytics vendor doğrudan seçilmedi?

Çünkü error tracking ile analytics aynı problem değildir.  
Error tracking canonical baseline olarak erken fayda üretir.  
Analytics ise:
- ürün KPI’ları,
- privacy kararı,
- growth operasyonları
ile yakından bağlıdır.

Bu nedenle vendor değil, önce event contract kilitlenmiştir.

---

# 16. Auth / Session / Secure Storage Kararı

## 16.1. Seçim

- **Web:** backend-managed secure cookie preferred session
- **Mobile:** secure storage adapter
- **UI-facing auth state:** sanitized summary
- **Generic global store:** raw auth artefact taşımaz

## 16.2. Ne anlama gelir?

- token convenience-first dağıtılmaz
- logout sadece boolean temizliği değildir
- user switch / session expiry deterministic cleanup ister
- auth provider UI’ya vendor kokusu olarak sızmaz

---

# 17. Internationalization Kararı

## 17.1. Seçim

- **Runtime:** i18next
- **React binding:** react-i18next
- **Message organization:** namespace-based
- **Copy governance:** inline literal user-facing copy canonical değil

## 17.2. Neden ilk günden?
Çünkü bu boilerplate:
- cross-platform parity,
- component governance,
- a11y copy,
- form/error/empty state tutarlılığı
hedefliyor.

I18n’i sonradan eklemek bu seviyede maliyetlidir.

---

# 18. Docs / Governance / Audit Kararı

## 18.1. Seçim

Bu boilerplate’te yalnızca runtime stack değil, şu governance zinciri de canonical kabul edilir:

- ADR seti
- dependency policy
- compatibility matrix
- contribution guide
- audit checklist
- definition of done
- visual implementation contract
- HIG enforcement strategy

## 18.2. Neden?
Çünkü bu proje “iyi niyetli kalite” değil,  
**enforce edilebilir kalite** hedefliyor.

---

# 19. Exact Version Policy Bu Belgede Nasıl Yorumlanmalı?

Bu belge “hangi stack seçildi?” sorusunu cevaplar.  
Exact patch/minor pin politikası ise `38-version-compatibility-matrix.md` içinde yaşar.

Yani:
- burada yön ve araç aileleri kilitlenir
- 38’de sürüm bantları ve upgrade zinciri kilitlenir

Bu ayrım korunmalıdır.

---

# 20. Canonical Yardımcı Kütüphane Seti

Bu bölüm, canonical stack'ın (React, Vite, Expo, Zustand, TanStack Query, RHF, Zod, Tailwind, NativeWind, Sentry, i18next) üzerine eklenen, bootstrap için zorunlu yardımcı kütüphaneleri tanımlar. Bu kütüphaneler canonical stack ile aynı otoriteye sahip değildir; canonical stack kararları bu belgenin 5-19 arası bölümlerinde kilitlenmiştir ve o seviyede korunur. Ancak bu yardımcı kütüphaneler, repo bootstrap sırasında varsayılan başlangıç seti olarak kabul edilir. Yani projeye ilk `pnpm install` çalıştırıldığında bu kütüphaneler de dependency olarak yerinde olmalıdır.

Bu ayrımın önemi şudur: canonical stack'ta bir aracı değiştirmek belge revizyonu ve karar yeniden açma süreci gerektirir. Yardımcı kütüphane setinde ise değişim daha pragmatik değerlendirilir; ancak yine de nedensiz çıkarma veya alternatif ekleme kabul edilmez. Her değişiklik dependency policy (`37-dependency-policy.md`) ve compatibility matrix (`38-version-compatibility-matrix.md`) ile birlikte değerlendirilir.

---

## 20.1. Alt Grup 1 — Mobile Runtime Yardımcıları

Bu alt grup, React Native + Expo canonical baseline'ı üzerinde mobile uygulamanın gerçek bir ürün gibi hissettirmesi için zorunlu olan runtime kütüphanelerini kapsar. Bu kütüphaneler olmadan native hissiyatta animasyon, gesture tanıma, safe area yönetimi, bottom sheet, keyboard senkronizasyonu ve SVG render mümkün değildir. Hepsi Expo SDK 55 ile uyumludur ve birbirleriyle entegre çalışır. Apple HIG (Human Interface Guidelines) uyumu her biri için ayrıca belirtilmiştir; çünkü bu boilerplate'in `03-ui-ux-quality-standard.md` belgesinde tanımlanan kalite standardı, iOS native deneyiminden belirgin şekilde düşük bir UX'i kabul etmez.

### 20.1.1. react-native-reanimated 3.x

- **Ne işe yarar:** Native thread üzerinde çalışan yüksek performanslı animasyon kütüphanesi. JavaScript thread'den tamamen bağımsız olarak 60fps (standart ekranlar) ve 120fps (ProMotion ekranlar) animasyon garantisi sunar. Layout animation desteği sayesinde component mount/unmount sırasında otomatik geçiş animasyonları üretir. Shared element transition desteği ile ekranlar arası görsel süreklilik sağlar. Gesture-driven animation pattern'leri ile kullanıcı parmak hareketine birebir bağlı, kesintisiz animasyon akışı mümkün olur.
- **Versiyon:** 3.x (Expo SDK 55 bundled)
- **Neden seçildi:** React Native'in built-in `Animated` API'si JS thread üzerinde çalışır; bu da karmaşık animasyonlarda frame drop, jank ve kullanıcı deneyimi bozulması demektir. Reanimated bu sorunu kökten çözer: animasyon hesaplamaları native thread'e taşınır, JS thread meşgul olsa bile animasyon akışı bozulmaz. Expo SDK 55'te doğrudan bundled gelir, ekstra native konfigürasyon gerektirmez. Modern RN ekosisteminde animasyon altyapısı için fiili standart haline gelmiştir.
- **Reddedilen alternatifler:** React Native `Animated` API — JS thread sınırlıdır, `useNativeDriver` ile kısmen native thread'e taşınabilir ancak layout property'leri (width, height, position) animate edilemez, interpolation ve gesture entegrasyonu kısıtlıdır. `react-native-animatable` — deklaratif ama sınırlı, gesture-driven pattern desteği yoktur.
- **Apple HIG uyumu:** iOS'ta kullanıcılar spring-based, gesture-responsive ve fluid animasyonlara alışıktır. Reanimated'ın spring fizik modeli ve gesture-driven animation desteği, iOS native animasyon hissine en yakın çözümdür. UIKit'in `UIViewPropertyAnimator` ve `CASpringAnimation` davranışına paralel sonuçlar üretir.
- **Canonical stack uyumu:** Gesture Handler ile birlikte çalışır (gesture-driven animation). Bottom Sheet ve Keyboard Controller bu kütüphane üzerine inşa edilmiştir. NativeWind layout animation'ları ile uyumludur.

### 20.1.2. react-native-gesture-handler 2.x

- **Ne işe yarar:** React Native için native thread üzerinde çalışan gesture tanıma sistemi. Pan (sürükleme), pinch (sıkıştırma/açma), rotation (döndürme), long-press (uzun basma), swipe (kaydırma), tap (dokunma) ve fling (fırlatma) gesture'larını native seviyede tanır ve yönetir. Aynı anda birden fazla gesture'ın çakışma çözümlemesini (simultaneous, exclusive, race) kontrol eder. Gesture composition sayesinde karmaşık etkileşim pattern'leri tek bir deklaratif API ile kurulabilir.
- **Versiyon:** 2.x (Expo SDK 55 bundled)
- **Neden seçildi:** React Native'in built-in gesture sistemi (PanResponder, Touchable bileşenleri) JS thread üzerinde çalışır ve performans açısından yetersizdir. Özellikle gesture ve animasyon birlikte kullanıldığında (sürükle-bırak, swipe-to-dismiss gibi) JS thread darboğazı belirginleşir. Gesture Handler tüm gesture hesaplamasını native thread'e taşır ve Reanimated ile doğal entegrasyonu sayesinde gesture-driven animasyonlarda sıfır gecikme sağlar.
- **Reddedilen alternatifler:** React Native PanResponder — JS thread sınırlı, API ergonomisi zayıf, çoklu gesture çakışma çözümlemesi manuel ve hata eğilimli. Built-in Touchable bileşenleri — basit tap için yeterli ama karmaşık gesture pattern'leri desteklemez.
- **Apple HIG uyumu:** iOS'un temel etkileşim dili gesture'lara dayanır: kenardan swipe ile geri gitme, pull-to-refresh, pinch-to-zoom, long-press context menu. Bu kütüphane bu pattern'lerin tamamını native performansla destekler ve iOS kullanıcı beklentisine uygun hissiyat üretir.
- **Canonical stack uyumu:** Reanimated ile birlikte gesture-driven animation altyapısını oluşturur. Bottom Sheet bu kütüphane üzerinde çalışır. React Navigation gesture-based geçişlerde bu kütüphaneyi kullanır.

### 20.1.3. react-native-safe-area-context

- **Ne işe yarar:** Cihazın fiziksel ekran sınırlamaları (notch, Dynamic Island, home indicator, status bar, navigation bar) tarafından oluşturulan safe area inset değerlerini sağlayan kütüphane. Her ekranın içeriğinin bu engellerin arkasında kalmadan, doğru padding ve margin ile render edilmesini garanti eder. `SafeAreaProvider` ve `useSafeAreaInsets` hook'u ile hem global hem component seviyesinde inset bilgisine erişim sağlar.
- **Versiyon:** Expo SDK 55 bundled
- **Neden seçildi:** Modern iOS cihazlarında notch (iPhone X serisi), Dynamic Island (iPhone 14 Pro+) ve home indicator; Android cihazlarında ise çeşitli cutout şekilleri ve navigation bar varyasyonları mevcuttur. Bu değerler olmadan UI elemanları fiziksel engellerin arkasında kalır ve kullanılamaz hale gelir. Bu kütüphane her cihaz için doğru inset değerlerini native API'den okuyarak platform-agnostic bir şekilde sunar. Expo bundled olması kurulum sürtünmesini sıfırlar.
- **Reddedilen alternatifler:** Manuel `StatusBar.currentHeight` veya platform-specific sabit değerler — cihaz çeşitliliği karşısında sürdürülemez, her yeni cihaz formunda kırılır. Custom SafeAreaView implementasyonu — bakım yükü yüksek, edge case'lerde hatalı.
- **Apple HIG uyumu:** Apple HIG, tüm içeriğin safe area layout guide içinde kalmasını açıkça gerektirir. Bu kütüphane iOS `UIEdgeInsets` / `safeAreaInsets` değerlerini doğrudan okur ve Apple'ın beklediği layout davranışına tam uyum sağlar.
- **Canonical stack uyumu:** Bottom Sheet, Navigation ve Keyboard Controller ile birlikte çalışır; hepsi safe area inset değerlerine bağımlıdır. Tüm screen layout'larının temel yapı taşıdır.

### 20.1.4. @gorhom/bottom-sheet 5.x

- **Ne işe yarar:** iOS Maps, Apple Music ve Shortcuts uygulamalarında görülen, ekranın altından yukarı doğru açılan, birden fazla snap noktasında durabilen, gesture ile kontrol edilen bottom sheet bileşeni. Snap point tanımlama (örneğin %25, %50, %90), gesture dismiss, backdrop overlay, keyboard-aware otomatik yükseklik ayarı, scrollable içerik desteği ve detent-based (kademeli) açılma/kapanma davranışı sunar. Portal desteği ile navigation stack dışından bile kullanılabilir.
- **Versiyon:** 5.x
- **Neden seçildi:** Bottom sheet, modern mobile UX'in temel pattern'lerinden biridir. Filtre panelleri, detay görünümleri, seçim listeleri, yorum alanları ve aksiyonlar menüsü gibi sayısız kullanım alanı vardır. Bu kütüphane Reanimated + Gesture Handler üzerine inşa edilmiştir, yani animasyon ve gesture performansı native thread seviyesindedir. Snap point sistemi ile farklı içerik boyutlarına göre kademeli açılma sağlar. Keyboard açıldığında otomatik yükseklik ayarı yapar, böylece input alanları her zaman görünür kalır.
- **Reddedilen alternatifler:** `react-native-modal` — tam ekran modal olarak çalışır, snap point desteği yoktur, bottom sheet UX pattern'ini karşılayamaz. Custom implementation — Reanimated + Gesture Handler + safe area + keyboard handling birleşimi gerektirdiği için geliştirme maliyeti çok yüksektir, edge case'lerde (keyboard, rotation, nested scroll) hata oranı artar. `react-native-bottom-sheet` (eski) — bakımı durmuş, Reanimated 3.x uyumu yok.
- **Apple HIG uyumu:** iOS 15'te tanıtılan `UISheetPresentationController` davranışına (detent sistemi, grab indicator, dismiss gesture) paralel bir deneyim sunar. Kullanıcı iOS'ta alışık olduğu bottom sheet hissiyatını bu bileşenle yaşar.
- **Canonical stack uyumu:** Reanimated 3.x ve Gesture Handler 2.x'e doğrudan bağımlıdır; bu iki kütüphane zaten canonical yardımcı settedir. Safe area context ile entegre çalışır. Keyboard Controller ile birlikte keyboard-aware bottom sheet davranışı üretir.

### 20.1.5. react-native-keyboard-controller

- **Ne işe yarar:** Keyboard açılma ve kapanma animasyonunu UI ile senkronize eden, Reanimated tabanlı kütüphane. Keyboard yüksekliğini, animasyon süresini ve easing curve'ünü native thread üzerinden frame-by-frame takip eder ve bu değerleri Reanimated shared value olarak sunar. Böylece keyboard açılırken input alanları, toolbar'lar ve diğer UI elemanları keyboard ile birebir senkron hareket eder — atlama, gecikme veya ani kayma olmaz.
- **Versiyon:** En güncel stable (Expo SDK 55 uyumlu)
- **Neden seçildi:** React Native'in built-in `KeyboardAvoidingView` bileşeni pratik kullanımda ciddi sorunlar yaratır: keyboard yüksekliğini tahmin eder (her zaman doğru değil), animasyon senkronizasyonu yoktur (UI keyboard'dan önce veya sonra kayar), iç içe scroll view'larla çakışır ve platform-specific davranış farklılıkları gerektirir. Keyboard Controller bu sorunların tamamını çözer: native keyboard event'lerini Reanimated shared value'ya bağlar, böylece keyboard ve UI aynı frame'de hareket eder.
- **Reddedilen alternatifler:** `KeyboardAvoidingView` — yukarıda açıklanan nedenlerle yetersiz. `react-native-keyboard-aware-scroll-view` — scroll view odaklı, genel amaçlı keyboard senkronizasyonu sağlamaz, Reanimated entegrasyonu yok. Manuel keyboard event listener + `Animated` — JS thread sınırlı, frame-perfect senkronizasyon mümkün değil.
- **Apple HIG uyumu:** iOS'ta keyboard açılma animasyonu bir spring curve izler ve tüm UI bu animasyonla senkron hareket etmelidir. Bu kütüphane iOS'un native keyboard animation curve'ünü okuyarak birebir eşleşme sağlar; sonuç olarak kullanıcı iOS'un kendi uygulamalarındaki keyboard davranışıyla aynı hissiyatı yaşar.
- **Canonical stack uyumu:** Reanimated 3.x shared value sistemi üzerine inşa edilmiştir. Bottom Sheet'in keyboard-aware davranışını tamamlar. Form ekranlarında RHF (React Hook Form) field'ları ile birlikte kullanılır.

### 20.1.6. react-native-svg

- **Ne işe yarar:** React Native ortamında SVG (Scalable Vector Graphics) formatını render eden kütüphane. SVG elemanlarını (path, circle, rect, line, polygon, text, gradient, mask, clip-path vb.) native bileşenlere çevirir. Icon render, illustration gösterimi, chart/grafik çizimi ve custom shape oluşturma için zorunludur. Web'deki `<svg>` elemanının React Native karşılığıdır.
- **Versiyon:** Expo SDK 55 bundled
- **Neden seçildi:** React Native varsayılan olarak SVG render edemez; yalnızca bitmap image (PNG, JPG) desteği vardır. Ancak modern uygulamalarda icon'lar, illustration'lar, logo'lar ve chart'lar SVG formatındadır. SVG'nin avantajı çözünürlükten bağımsız keskin render, küçük dosya boyutu ve runtime'da stil değiştirme imkânıdır (renk, boyut, stroke). Bu kütüphane olmadan icon sistemi ve chart gösterimi mümkün olmaz. Expo bundled olması kurulum sürtünmesini sıfırlar.
- **Reddedilen alternatifler:** Bitmap icon atlas (PNG sprite sheet) — çözünürlük bağımlı, runtime stil değişikliği imkânsız, dosya boyutu büyük. Custom native SVG renderer — bakım maliyeti çok yüksek, ekosistem desteği yok.
- **Apple HIG uyumu:** iOS'ta SF Symbols vektörel icon sistemi kullanılır. SVG kütüphanesi, vektörel icon kullanımını mümkün kılarak bu yaklaşıma paralel bir çözüm sunar; icon'lar her ekran yoğunluğunda keskin kalır.
- **Canonical stack uyumu:** Lucide icon seti (cross-platform yardımcı, Alt Grup 4) bu kütüphane üzerine çalışır. Chart/grafik kütüphaneleri SVG render için bu kütüphaneye bağımlıdır.

---

## 20.2. Alt Grup 2 — Expo Ekosistem Modülleri

Bu alt grup, Expo SDK 55 ekosisteminin sunduğu ve mobile uygulama geliştirmede sıkça ihtiyaç duyulan platform yeteneklerini (device API) kapsayan modülleri tanımlar. Bu modüllerin tamamı Expo ekosistemi içinde geliştirilir, Expo SDK versiyonu ile uyumlu şekilde yayınlanır ve managed workflow'da ek native konfigürasyon gerektirmez. Her biri kendi alanında tekil çözüm sunar: haptic feedback, biyometrik kimlik doğrulama, şifreli depolama, bildirim, splash screen, optimize image, font, clipboard, kamera, konum, medya seçimi, dosya sistemi, app metadata, deep link, OTA güncelleme ve status bar kontrolü. Bu modüller canonical stack'ın Expo-first kararının doğal uzantısıdır; Expo-first yaklaşım benimsendiğinde bu modülleri kullanmak en düşük sürtünmeli ve en tutarlı yoldur.

### 20.2.1. expo-haptics

- **Ne işe yarar:** Cihazın titreşim motorunu kontrol ederek kullanıcıya dokunsal geri bildirim (haptic feedback) sağlar. Üç farklı yoğunluk seviyesi (light, medium, heavy) ile impact feedback, başarı/hata/uyarı için notification feedback ve özel pattern'ler için selection feedback sunar.
- **Platform karşılığı:** iOS'ta `UIImpactFeedbackGenerator`, `UINotificationFeedbackGenerator` ve `UISelectionFeedbackGenerator` API'lerini; Android'de `VibrationEffect` API'sini kullanır.
- **Expo SDK 55 uyumu:** Tam uyumlu, managed workflow'da çalışır.

### 20.2.2. expo-local-authentication

- **Ne işe yarar:** Cihazın biyometrik kimlik doğrulama sistemine erişim sağlar. Kullanıcının kimliğini Face ID, Touch ID (iOS) veya parmak izi / yüz tanıma (Android) ile doğrular. Biyometrik donanım varlığını ve kayıtlı biyometri olup olmadığını kontrol eder.
- **Platform karşılığı:** iOS'ta `LAContext` (LocalAuthentication framework); Android'de `BiometricPrompt` API'sini kullanır.
- **Expo SDK 55 uyumu:** Tam uyumlu. iOS'ta Face ID için `NSFaceIDUsageDescription` info.plist anahtarı gerekir (Expo config plugin ile yönetilir).

### 20.2.3. expo-secure-store

- **Ne işe yarar:** Hassas verileri (token, şifre, API key) platform'un şifreli depolama mekanizmasında saklar. Key-value API sunar. Veriler uygulama sandbox'ı dışından erişilemez ve donanım destekli şifreleme ile korunur.
- **Platform karşılığı:** iOS'ta Keychain Services; Android'de Android Keystore (EncryptedSharedPreferences) kullanır.
- **Expo SDK 55 uyumu:** Tam uyumlu. Canonical stack'ın auth/session kararında (bölüm 16) tanımlanan "mobile secure storage adapter" ihtiyacını doğrudan karşılar.

### 20.2.4. expo-notifications

- **Ne işe yarar:** Push notification ve local notification yönetimi sağlar. Push token alma, notification alma/gösterme, notification'a tıklama response'u yakalama, badge sayısı yönetimi ve scheduled local notification oluşturma yetenekleri sunar.
- **Platform karşılığı:** iOS'ta APNs (Apple Push Notification service); Android'de FCM (Firebase Cloud Messaging) entegrasyonu. Local notification'lar için platform-native notification API'leri kullanılır.
- **Expo SDK 55 uyumu:** Tam uyumlu. Push notification için Expo Push Service veya doğrudan APNs/FCM kullanılabilir.

### 20.2.5. expo-splash-screen

- **Ne işe yarar:** Uygulama açılışında gösterilen native splash screen'in programatik kontrolünü sağlar. `preventAutoHideAsync()` ile splash screen'in otomatik kapanmasını engeller, uygulama başlangıç verileri (font, config, auth durumu) yüklenene kadar splash screen'i tutar ve `hideAsync()` ile kontrollü şekilde kapatır.
- **Platform karşılığı:** iOS'ta `UILaunchScreen`; Android'de `SplashScreen` API kullanılır.
- **Expo SDK 55 uyumu:** Tam uyumlu. App.json/app.config içinde splash image ve background color konfigürasyonu ile çalışır.

### 20.2.6. expo-image 2.x

- **Ne işe yarar:** React Native'in varsayılan `Image` bileşeninin yerini alan, optimize edilmiş image component. Gelişmiş cache yönetimi (memory + disk cache), blur placeholder (düşük çözünürlük placeholder ile yükleme geçişi), content-fit modları (cover, contain, fill, scale-down), geçiş animasyonları (cross-dissolve, flip) ve modern format desteği (WebP, AVIF) sunar.
- **Versiyon:** 2.x
- **Neden React Native Image yerine:** RN'nin varsayılan Image bileşeni cache yönetiminde zayıftır (iOS'ta belirsiz cache davranışı, Android'de farklı cache stratejisi), placeholder desteği sınırlıdır, modern format desteği eksiktir ve büyük image listelerinde (FlatList içinde) performans sorunları yaşatır. expo-image tüm bu sorunları çözer ve tek bir tutarlı API sunar.
- **Expo SDK 55 uyumu:** Tam uyumlu. Expo ekosisteminin resmi image çözümüdür.

### 20.2.7. expo-font

- **Ne işe yarar:** Custom font dosyalarını (TTF, OTF) uygulama başlangıcında preload eder. `useFonts` hook'u ile font yükleme durumunu takip eder; fontlar yüklenene kadar splash screen tutulabilir. Font asset'leri bundled veya remote olarak yüklenebilir.
- **Expo SDK 55 uyumu:** Tam uyumlu. Splash screen modülü ile birlikte kullanılarak font yüklenene kadar UI gösterilmemesi sağlanır.

### 20.2.8. expo-clipboard

- **Ne işe yarar:** Sistem clipboard'una (panoya) okuma ve yazma erişimi sağlar. Metin kopyalama, metin yapıştırma ve clipboard değişiklik event'i dinleme yetenekleri sunar. Referral kodu kopyalama, paylaşım linkleri ve kullanıcı kolaylığı senaryolarında kullanılır.
- **Expo SDK 55 uyumu:** Tam uyumlu, managed workflow'da çalışır.

### 20.2.9. expo-camera

- **Ne işe yarar:** Cihaz kamerasına erişim ve kontrol sağlar. Ön/arka kamera seçimi, fotoğraf çekme, video kaydetme, flaş kontrolü, zoom, focus ve barcode/QR tarama yetenekleri sunar. Kamera önizleme bileşeni (CameraView) ile canlı kamera görüntüsü ekranda gösterilir.
- **Expo SDK 55 uyumu:** Tam uyumlu. Kamera izni yönetimi Expo permission sistemi ile entegre çalışır.

### 20.2.10. expo-location

- **Ne işe yarar:** Cihazın GPS ve konum servislerine erişim sağlar. Anlık konum alma (one-shot), sürekli konum takibi (watch), arka plan konum takibi, geocoding (koordinat → adres) ve reverse geocoding (adres → koordinat) yetenekleri sunar. Konum doğruluğu (accuracy) seviyesi ayarlanabilir.
- **Expo SDK 55 uyumu:** Tam uyumlu. Konum izni yönetimi (foreground/background) Expo permission sistemi ile entegre çalışır.

### 20.2.11. expo-image-picker

- **Ne işe yarar:** Cihazın fotoğraf galerisinden veya kameradan medya (fotoğraf, video) seçimi sağlar. Galeri seçim ekranı açma, kamera ile anlık çekim, medya tipi filtreleme (image/video/all), kalite ve boyut ayarlama, çoklu seçim ve crop/edit desteği sunar.
- **Expo SDK 55 uyumu:** Tam uyumlu. Galeri ve kamera izinleri Expo permission sistemi ile yönetilir.

### 20.2.12. expo-file-system

- **Ne işe yarar:** Cihazın dosya sistemine erişim sağlar. Dosya okuma, yazma, silme, taşıma, kopyalama, dizin oluşturma ve dosya indirme (download) yetenekleri sunar. İndirme işlemleri arka planda devam edebilir ve ilerleme takibi yapılabilir. Cache dizini ve document dizini ayrımı ile dosya yaşam döngüsü yönetilir.
- **Expo SDK 55 uyumu:** Tam uyumlu, managed workflow'da çalışır.

### 20.2.13. expo-constants

- **Ne işe yarar:** Uygulama metadata bilgilerine runtime'da erişim sağlar. App version, build number, Expo SDK versiyonu, native platform versiyonu, device bilgileri ve manifest içeriği gibi değerleri okur. Environment-aware konfigürasyon, versiyon gösterimi ve diagnostics için kullanılır.
- **Expo SDK 55 uyumu:** Tam uyumlu. Expo ekosisteminin temel altyapı modüllerinden biridir.

### 20.2.14. expo-linking

- **Ne işe yarar:** Deep link handling ve harici URL açma işlevleri sağlar. Uygulamaya gelen deep link'leri yakalama, uygulama içi URL routing'e yönlendirme, harici URL'leri (web sayfası, email, telefon, harita) sistem tarayıcısı veya ilgili uygulamada açma ve universal link desteği sunar.
- **Expo SDK 55 uyumu:** Tam uyumlu. React Navigation ile deep link entegrasyonu için kullanılır.

### 20.2.15. expo-updates

- **Ne işe yarar:** OTA (Over-The-Air) JavaScript bundle güncelleme mekanizması sağlar. App store review süreci beklenmeden JavaScript ve asset güncellemelerini kullanıcılara ulaştırır. Güncelleme kontrolü, indirme, uygulama ve rollback yetenekleri sunar. Channel-based güncelleme ile farklı ortamlara (staging, production) farklı bundle'lar gönderilebilir.
- **Expo SDK 55 uyumu:** Tam uyumlu. EAS Update servisi ile entegre çalışır.

### 20.2.16. expo-status-bar

- **Ne işe yarar:** Cihazın status bar'ının (saat, batarya, sinyal göstergesi) stilini kontrol eder. Light (beyaz metin — koyu arka plan için), dark (siyah metin — açık arka plan için) ve auto (sistem temasına uyumlu) modları sunar. Ekran bazında veya global olarak ayarlanabilir.
- **Expo SDK 55 uyumu:** Tam uyumlu. Theming sistemi (light/dark mode) ile birlikte kullanılarak her ekranda doğru status bar stili garanti edilir.

---

## 20.3. Alt Grup 3 — Community Kütüphaneleri

Bu alt grup, Expo SDK dışında React Native community tarafından geliştirilen ve bakımı sürdürülen, yaygın kullanıma sahip iki temel kütüphaneyi kapsar. Bu kütüphaneler Expo modülleriyle aynı kurumsal çatı altında değildir ancak ekosistemde fiili standart haline gelmiştir ve Expo managed workflow ile uyumludur.

### 20.3.1. @react-native-async-storage/async-storage

- **Ne işe yarar:** Şifrelenmemiş, asenkron key-value depolama kütüphanesi. Hassas olmayan uygulama verilerini (kullanıcı tercihleri, onboarding durumu, tema seçimi, son görüntülenen sayfa, feature flag cache'i gibi) kalıcı olarak saklar. API olarak `getItem`, `setItem`, `removeItem`, `multiGet`, `multiSet` ve `clear` metotlarını sunar. Veriler uygulama kapatılsa bile kalıcıdır.
- **expo-secure-store'dan farkı:** Secure Store şifreli depolama sağlar (Keychain/Keystore) ve hassas veriler (token, şifre, API key) içindir. Async Storage ise şifreleme yapmaz ancak daha hızlıdır ve daha büyük veri hacimleri için uygundur. İkisi farklı amaçlara hizmet eder ve birbirinin alternatifi değildir. Güvenlik gerektirmeyen ama kalıcılık gerektiren tüm veriler Async Storage'da, güvenlik gerektiren veriler Secure Store'da tutulur.
- **Expo SDK 55 uyumu:** Tam uyumlu, managed workflow'da çalışır.

### 20.3.2. @react-native-community/netinfo

- **Ne işe yarar:** Cihazın ağ bağlantısı durumunu ve tipini gerçek zamanlı olarak izler. Çevrimiçi/çevrimdışı tespiti, bağlantı tipi (wifi, cellular, ethernet, bluetooth, none), cellular nesil bilgisi (3G/4G/5G), bağlantı kalitesi tahmini ve bağlantı değişikliği event'i dinleme yetenekleri sunar. Çevrimdışı deneyim yönetimi, bağlantı kalitesine göre veri stratejisi (düşük bant genişliğinde düşük çözünürlük image yükleme gibi) ve kullanıcıya bağlantı durumu bildirimi için kullanılır.
- **Expo SDK 55 uyumu:** Tam uyumlu, managed workflow'da çalışır. TanStack Query'nin online/offline modları ile birlikte kullanılarak ağ durumuna duyarlı veri fetch stratejisi kurulabilir.

---

## 20.4. Alt Grup 4 — Cross-Platform Yardımcıları

Bu alt grup, hem web (React + Vite) hem mobile (React Native + Expo) tarafında kullanılan, platform-agnostic yardımcı kütüphaneleri kapsar. Bu kütüphaneler belirli bir platforma özgü değildir; her iki uygulama shell'inde de aynı API ve mental model ile kullanılır. Cross-platform parity hedefinin pratik araçlarıdır.

### 20.4.1. lucide-react + lucide-react-native

- **Ne işe yarar:** 1300'den fazla SVG tabanlı icon sunan, tree-shakeable icon kütüphanesi. Her icon ayrı bir ES module olarak export edilir; yalnızca kullanılan icon'lar final bundle'a dahil olur. Tutarlı tasarım dili (aynı stroke weight, aynı grid, aynı optik denge) sayesinde uygulama genelinde görsel bütünlük sağlar. Web için `lucide-react`, mobile için `lucide-react-native` (react-native-svg üzerinde çalışır) paketi kullanılır.
- **Versiyon:** En güncel stable
- **Neden seçildi:** Icon seti seçimi, uygulamanın görsel dilini doğrudan etkiler. Lucide, Feather Icons projesinin aktif bakımlı devamıdır ve tutarlı bir tasarım sistemine sahiptir. Tree-shakeable yapısı sayesinde 1300+ icon olmasına rağmen bundle'a yalnızca kullanılanlar girer; bu, bundle-size-conscious bir boilerplate için kritiktir.
- **Reddedilen alternatifler:** `react-native-vector-icons` — bundle bloat yaratır (tüm icon font'ları bundle'a girer, tree-shake edilemez), font loading gerektirdiği için ilk yüklemede gecikme olur, cross-platform tutarlılık zayıftır. `phosphor-icons` — kaliteli ama icon sayısı daha azdır ve ekosistem olgunluğu Lucide'a göre geridedir. `@expo/vector-icons` — vector-icons'ın Expo wrapper'ıdır, aynı bundle bloat sorunu geçerlidir.
- **Apple HIG uyumu:** Lucide'ın icon tasarım dili (1.5px-2px stroke weight, 24px grid, rounded cap/join) Apple'ın SF Symbols'ünün çizgi ağırlığı ve optik denge yaklaşımına paraleldir. SF Symbols doğrudan kullanılamadığından (yalnızca native iOS), Lucide en yakın cross-platform alternatiftir.
- **Canonical stack uyumu:** Mobile tarafında react-native-svg kütüphanesine (Alt Grup 1) bağımlıdır. Web tarafında standart SVG kullanır. Design token sistemi ile icon boyutu ve rengi semantic token'lardan beslenir.

### 20.4.2. date-fns 4.x

- **Ne işe yarar:** JavaScript tarih ve saat işlemleri için fonksiyonel, tree-shakeable kütüphane. Tarih formatlama, parsing, karşılaştırma, aralık hesaplama, göreceli zaman (örn. "3 gün önce"), timezone dönüştürme ve tarih aritmetiği (gün/hafta/ay ekleme-çıkarma) gibi 200'den fazla fonksiyon sunar. Her fonksiyon ayrı ES module olarak import edilir, yalnızca kullanılanlar bundle'a girer. 80+ locale desteği ile i18n uyumlu tarih gösterimi sağlar.
- **Versiyon:** 4.x
- **Neden seçildi:** JavaScript'in native `Date` API'si tarih işlemleri için yetersiz ve hata eğilimlidir (mutable, timezone karışıklığı, formatlama zorluğu). date-fns bu eksiklikleri fonksiyonel, immutable ve tree-shakeable bir API ile çözer. i18n locale desteği, canonical stack'ın i18next kararıyla uyumludur: tarih formatları kullanıcının diline göre otomatik değişir.
- **Reddedilen alternatifler:** `dayjs` — daha küçük core bundle ama eklenti sistemi tree-shake dostu değildir, locale ve timezone eklentileri ayrı yüklenir ve konfigürasyon gerektirir, TypeScript tip desteği daha zayıftır. `moment.js` — devasa bundle (300KB+), mutable API, resmi olarak bakım modunda (deprecated), tree-shake edilemez. `Temporal API` — TC39 Stage 3, henüz tüm ortamlarda native destek yok, polyfill büyük.
- **Canonical stack uyumu:** i18next locale sistemi ile birlikte kullanılarak tarih/saat gösterimi kullanıcının diline göre formatlanır. Tree-shakeable yapısı Vite ve metro bundle optimizasyonu ile uyumludur.

### 20.4.3. react-error-boundary 5.x

- **Ne işe yarar:** React error boundary pattern'ini functional API ile kullanılabilir hale getiren wrapper kütüphane. React'te error boundary yalnızca class component ile yazılabilir; bu kütüphane bu zorunluluğu ortadan kaldırır. `ErrorBoundary` bileşeni, `useErrorBoundary` hook'u, `resetKeys` (belirli prop'lar değiştiğinde hata durumunu otomatik sıfırlama), `onReset` (sıfırlama sonrası callback), `onError` (hata yakalama callback'i) ve `fallbackRender` (custom fallback UI render fonksiyonu) sunar.
- **Versiyon:** 5.x
- **Neden seçildi:** Production uygulamalarında yakalanmamış render hatası tüm ekranı beyaz bırakır; bu kabul edilemez bir kullanıcı deneyimidir. Error boundary, hata yayılmasını belirli bir alt ağaçla sınırlar ve kullanıcıya anlamlı fallback UI gösterir. Bu kütüphane class component yazmadan, modern functional API ile bu pattern'i uygular. `onError` callback'i Sentry entegrasyonu için doğal bir bağlantı noktası sunar: her yakalanan render hatası otomatik olarak Sentry'ye raporlanabilir.
- **Reddedilen alternatifler:** Manuel class component error boundary — her projede yeniden yazılır, resetKeys ve functional hook desteği yoktur, maintenance yükü taşır. Hata yönetimsiz yaklaşım — production'da kabul edilemez.
- **Canonical stack uyumu:** Sentry (canonical observability aracı) ile `onError` callback üzerinden doğrudan entegre edilir. TanStack Query'nin `QueryErrorResetBoundary` ile birlikte kullanılarak query hatalarında otomatik retry UI kurulabilir. Hem web hem mobile'da aynı API ile çalışır.

### 20.4.4. sonner 2.x

- **Ne işe yarar:** Web uygulamaları için lightweight, accessible toast/notification bileşeni. Başarı, hata, uyarı, bilgi ve custom toast tipleri sunar. Otomatik stack yönetimi (birden fazla toast üst üste), swipe-to-dismiss, promise toast (async işlem durumunu otomatik gösterme), action button ve accessibility (ARIA live region, focus management) desteği sağlar.
- **Versiyon:** 2.x
- **Neden seçildi:** Kullanıcıya anlık geri bildirim (form gönderildi, hata oluştu, işlem tamamlandı) vermek modern web UX'in temel gereksinimidir. sonner 5KB altı bundle boyutu, Tailwind CSS ile doğal uyum, sıfır konfigürasyon ile çalışan API ve güçlü accessibility desteği ile bu ihtiyacı en verimli şekilde karşılar.
- **Reddedilen alternatifler:** `react-hot-toast` — daha az özellik (promise toast yok, action button yok), accessibility desteği daha zayıf. `react-toastify` — daha büyük bundle (~20KB vs ~5KB), kendi CSS'ini getirir (Tailwind ile çakışma riski), fazla konfigürasyon gerektirir.
- **Platform notu:** sonner yalnızca web tarafında kullanılır. Mobile tarafında toast/notification ihtiyacı native pattern'lerle (expo-haptics ile birlikte custom toast veya platform-native alert) karşılanır.
- **Canonical stack uyumu:** Tailwind CSS ile sıfır ek konfigürasyon ile uyumlu çalışır. Dark mode desteği semantic token layer ile entegre edilir.

### 20.4.5. clsx + tailwind-merge

- **Ne işe yarar:** İki kütüphane birlikte kullanılır. `clsx` koşullu CSS class birleştirme sağlar: boolean, string, array ve object sözdizimi ile dinamik className oluşturur (örn. `clsx('base', isActive && 'active', size === 'lg' && 'text-lg')`). `tailwind-merge` ise Tailwind CSS class çakışmalarını akıllı şekilde çözer: sonra gelen class önce geleni override eder (örn. `twMerge('px-4 px-6')` → `'px-6'`). İkisi birlikte kullanıldığında, component'lerin hem koşullu hem de çakışmasız className composition'ı garanti altına alınır. Genellikle `cn()` gibi tek bir utility fonksiyonda birleştirilir: `const cn = (...inputs) => twMerge(clsx(inputs))`.
- **Versiyon:** clsx en güncel stable, tailwind-merge en güncel stable
- **Neden seçildi:** Tailwind CSS ile component geliştirmede iki temel sorun vardır: (1) koşullu class ekleme verbose ve hata eğilimlidir, (2) component'e dışarıdan verilen className'ler component'in kendi class'ları ile çakışabilir (örn. component `p-4` kullanıyorken dışarıdan `p-8` verilirse ikisi birlikte kalır ve davranış belirsizdir). clsx birinci sorunu, tailwind-merge ikinci sorunu çözer. Her Tailwind tabanlı component'te className composition için zorunludur.
- **Reddedilen alternatifler:** `classnames` — clsx ile aynı işi yapar ama bundle boyutu daha büyük ve API daha eski. Tailwind-merge olmadan sadece clsx — class çakışma sorunu çözülmez, component composition'da beklenmeyen stil davranışları oluşur.
- **Canonical stack uyumu:** Tailwind CSS 4.x (web) ve NativeWind 5.x (mobile) ile doğrudan entegre çalışır. Design system primitive'lerinde className prop forwarding için zorunludur. Her UI component'in temel yapı taşıdır.

---

# 21. Bilinçli Olarak Açık Bırakılan Alanlar

Bu belgede özellikle açık bırakılan ama kontrolsüz olmayan alanlar şunlardır:

1. Analytics vendor exact seçimi
2. Mobile E2E exact tool seçimi
3. Visual regression vendor exact seçimi
4. Auth provider exact ürünü
5. Bazı perf diagnostics vendor detayları
6. Bazı release automation detayları

Bunlar açık diye “her şey serbest” değildir.  
Bunlar **constrained open area** olarak kalır.

---

# 22. Açıkça Reddedilen Yönler

Bu boilerplate için aşağıdaki yönler baseline dışında kabul edilir:

- Next.js / SSR-first default web shell
- bare RN-first mobile setup
- npm/yarn/bun-first package manager baseline
- Nx-first orchestration baseline
- Redux Toolkit-first app-global state baseline
- SWR-first query baseline
- Formik/Yup-first forms baseline
- CSS-in-JS veya StyleSheet-first DS runtime
- Jest-only all-platform testing strategy
- ad-hoc fetch/caching yaklaşımı
- localStorage-first auth/session strategy
- inline-string-first copy strategy

---

# 23. Repo Bootstrap İçin Bu Belge Ne Zorunlu Kılar?

Repo bootstrap bundan sonra şu varsayımla yapılır:

- Node `20.19.x` baseline
- pnpm workspace
- turbo tasks
- apps/web
- apps/mobile
- packages/core
- packages/design-tokens
- packages/ui
- packages/config-typescript
- packages/config-eslint
- packages/testing

Yani repo bootstrap artık genel öneri değil;  
bu kararlara göre yapılmalıdır.

---

# 24. Bu Belgeden Sonra “17” ve “19/20/21” Nasıl Yorumlanır?

## 24.1. `17-technology-decision-framework.md`
Artık karar çerçevesidir; bu belge ise karar sonucudur.

## 24.2. `19-roadmap-to-implementation.md`
Artık stack decision locked varsayımıyla okunur.

## 24.3. `20-initial-implementation-checklist.md`
Artık teknoloji keşfi değil, uygulama sırası belgesidir.

## 24.4. `21-repo-structure-spec.md`
Artık soyut topoloji değil, bu belgeyi fiziksel yapıya çeviren spec’tir.

---

# 25. Bu Belgenin Kullanım Kuralı

Bu belge şu durumlarda açılır:

- repo bootstrap başlamadan önce
- yeni contributor “hangi stack kullanılıyor?” diye baktığında
- yeni dependency veya alternatif önerisi geldiğinde
- ADR’lerin hızlı indeksine ihtiyaç duyulduğunda
- checklist ile runtime kararları eşleştirmek gerektiğinde

Bu belge “belki değişir” diye değil,  
**şu anki resmi stack budur** diye okunmalıdır.

---

# 26. Onay Kriterleri

Bu belge yeterli kabul edilir eğer:

1. Çekirdek teknoloji omurgası net ve tek parça görünüyorsa
2. Web, mobile, monorepo, state, data, forms, styling, navigation, testing, observability, auth ve i18n kararları açıkça yazılmışsa
3. Closed canonical area ile consciously open area ayrılmışsa
4. 37 ve 38 ile ilişkisi net kurulmuşsa
5. Reddedilen alternatifler görünürse
6. Repo bootstrap ve implementation belgeleri için gerçek referans olabilecek netlikteyse

---

# 27. Kısa Sonuç

Bu boilerplate için canonical teknik blueprint şudur:

- Web: React 19.x + Vite 7.x intentional baseline + React Router 7.x
- Mobile: React Native 0.83.x + Expo SDK 55.x
- Repo: Monorepo + pnpm 10.x + Turborepo 2.x
- State: Zustand 5.x
- Server-state: TanStack Query 5.x
- Forms: React Hook Form 7.x
- Validation: Zod 4.x
- Styling: Tailwind CSS 4.x + NativeWind 5.x candidate track + semantic token layer
- Testing: Vitest 4.x + Jest 30.x + Testing Library + Playwright
- Observability: Sentry + analytics abstraction
- Auth/session: web cookie-preferred + mobile secure storage adapter
- i18n: i18next

Bu belge artık “nasıl seçeriz?” değil,  
**“neyi seçtik?”** sorusunun resmi cevabıdır.
