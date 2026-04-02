# 39-default-screens-and-components-spec.md

## Doküman Kimliği

- **Doküman adı:** Default Screens and Components Specification
- **Dosya adı:** `39-default-screens-and-components-spec.md`
- **Doküman türü:** Specification / implementation blueprint / bootstrap reference
- **Durum:** Accepted
- **Tarih:** 2026-03-31
- **Kapsam:** Bu belge, boilerplate'in repo bootstrap'ı tamamlandıktan sonra ilk çalışan ürünü ayağa kaldırmak için gereken varsayılan ekranları, varsayılan component'leri, her biri için kullanılacak kütüphane/framework seçimlerini, Apple HIG uyum durumlarını ve bootstrap sırasını tanımlar. Bu belge mimari karar üretmez; canonical stack kararlarını (ADR-001 → ADR-017 + 36/37/38 canonical governance belgeleri) somut bileşen ve ekran planına dönüştürür.
- **Bağlı olduğu üst dokümanlar:**
  - `04-design-system-architecture.md`
  - `20-initial-implementation-checklist.md`
  - `21-repo-structure-spec.md`
  - `23-component-governance-rules.md`
  - `25-error-empty-loading-states.md`
  - `36-canonical-stack-decision.md`
  - `37-dependency-policy.md`
  - `38-version-compatibility-matrix.md`
  - `ADR-001` → `ADR-017`
- **Doğrudan etkileyeceği dokümanlar:**
  - `19-roadmap-to-implementation.md`
  - `20-initial-implementation-checklist.md`
  - `30-contribution-guide.md`
  - `31-audit-checklist.md`
  - `32-definition-of-done.md`
  - `35-document-map.md`

---

> **Modülerizasyon Planı:** Bu doküman 277KB+ boyutuyla tek dosya olarak yönetimi zorlaştırmaktadır. Gelecek iterasyonda aşağıdaki domain bazlı alt dosyalara bölünecektir:
> - `39a-auth-screens-spec.md` — Login, register, forgot password, verification ekranları
> - `39b-dashboard-screens-spec.md` — Ana sayfa, dashboard, feed ekranları
> - `39c-profile-screens-spec.md` — Profil, hesap ayarları, profil düzenleme ekranları
> - `39d-settings-screens-spec.md` — Ayarlar, bildirim tercihleri, tema ekranları
> - `39e-shared-components-spec.md` — Paylaşımlı UI bileşenleri (modal, toast, form elements)
> - `39f-utility-screens-spec.md` — Onboarding, error, maintenance, force update ekranları
>
> Bu bölünme mevcut içeriği etkilemez; sadece dosya organizasyonunu iyileştirir. Her alt dosya bu dokümanın ilgili bölümlerini birebir taşıyacak ve cross-reference bağlantıları korunacaktır.

---

# 1. Amaç

Bu dokümanın amacı, boilerplate'in governance ve mimari belgeleri tamamlandıktan sonra ortaya çıkan **"repo bootstrap bitti, sırada ne var?"** sorusuna somut ve uygulanabilir bir cevap vermektir.

Bu belge şu sorulara net cevap verir:

1. İlk çalışan ürün hangi ekranlardan oluşmalıdır?
2. Her ekran hangi canonical stack kütüphanelerini kullanmalıdır?
3. Her ekranın Apple HIG uyumu hangi düzeyde olmalıdır?
4. Ekranların bootstrap sırası ne olmalıdır?
5. Canonical stack üzerine hangi yardımcı kütüphaneler eklenmelidir ve neden?
6. Her yardımcı kütüphanenin seçim gerekçesi, alternatifleri ve bundle etkisi nedir?
7. Varsayılan component seti hangi parçalardan oluşmalıdır?
8. Web ve mobile platformları arasında hangi ekranlar ortaktır, hangisi platforma özeldir?
9. Her ekranın kabul kriterleri nelerdir?
10. Bu set bir ürün kararı mı yoksa altyapı kararı mıdır?

Bu doküman olmadan aşağıdaki sorunlar kaçınılmazdır:

- developer "ne yapayım?" sorusunu kendi başına cevaplamaya çalışır,
- herkes farklı ekran seti ile başlar,
- kütüphane seçimleri developer inisiyatifinde kalır ve tutarsızlaşır,
- canonical stack kararları implementasyona dönüşmeden soyut kalır,
- bootstrap sırası belli olmadığı için bağımlılıklar çözülmemiş sırada inşa edilir,
- ilk çalışan ürün her defasında farklı görünür ve farklı davranır,
- HIG uyumu her ekranda ayrı yorumlanır,
- "minimum ne lazım?" sorusu kapanmaz ve scope creep başlar.

Bu belge:

- ekran kataloğu değildir, ama kataloğun ilk sürümünü tanımlar,
- ürün tasarım belgesi değildir, ama altyapı seviyesinde "her uygulamada lazım olan" ortak payda ekranlarını listeler,
- component kataloğu değildir, ama component kataloğunun bootstrap önceliğini verir,
- mimari karar belgesi değildir, ama mevcut mimari kararları somut implementasyon planına çevirir.

---

# 2. Neden Bu Doküman Gerekli

Bu boilerplate ekosisteminde artık şu katmanlar tamamlanmıştır:

- working principles, product philosophy ve UI/UX quality standard yazılmıştır,
- design system architecture, theming ve visual language tanımlanmıştır,
- application architecture, module boundaries ve navigation kuralları belirlenmiştir,
- state, data fetching, forms, styling, testing, auth ve i18n yönleri kilitlenmiştir,
- repo structure spec, component governance, motion standard ve error states yazılmıştır,
- canonical stack, dependency policy ve version compatibility matrix kilitlenmiştir,
- HIG enforcement strategy tanımlanmıştır.

Bu kadar kural, karar ve governance katmanından sonra hâlâ şu soru cevapsızdır:

> **"İlk gün hangi ekranlar açılmalı, bu ekranlar ne yapmalı ve hangi kütüphanelerle inşa edilmeli?"**

Bu soru cevapsız kaldığında şunlar olur:

1. **Keyfi başlangıç:** Her developer kendi önceliğine göre ekran açar. Biri login ile başlar, diğeri settings ile, üçüncüsü home ile. Hiçbirinin bağımlılık sırası tutmaz.
2. **Tutarsız kütüphane kullanımı:** Canonical stack tanımlıdır ama yardımcı kütüphaneler (animation, gesture, image, haptics vb.) her developer tarafından farklı seçilir.
3. **HIG uyum sapması:** Ekran bazında HIG beklentileri net olmadığı için safe area, hit target, navigation pattern ve geri davranışı ekrana göre değişir.
4. **Soyut spec, somut değil:** Governance belgesi "şöyle olmalı" der ama "ilk gün hangi dosyalar oluşturulmalı?" sorusuna cevap vermez.
5. **Bootstrap sırası bozulur:** Auth ekranları bitirmeden home açılır, splash screen olmadan app yüklenir, error boundary olmadan feature ekranları yazılır.
6. **Minimum ortak payda belirsiz kalır:** "Her uygulamada lazım olan" ile "bu ürüne özel olan" ayrımı yapılmaz.

Bu belge tam olarak bu boşluğu kapatır.

---

# 3. Temel Tez

Bu boilerplate için temel tez şudur:

> Varsayılan ekran ve component seti, **"her uygulamada lazım olan minimum ortak payda"**yı temsil eder. Bu set bir ürün kararı değil, **altyapı kararı**dır. Tıpkı error boundary'nin, loading state'in veya auth guard'ın her uygulamada olması gerektiği gibi, splash screen, login, settings, 404 ve benzeri ekranlar da bootstrap altyapısının parçasıdır.

Bu tez şu sonuçları doğurur:

1. **Bu ekranlar opsiyonel değildir.** Her boilerplate bootstrap'ı bu ekranları içermelidir. Kullanılmayacak olanlar bilinçli olarak kaldırılır, yoksa varsayılan olarak bulunurlar.
2. **Bu ekranlar ürün tasarımı değildir.** Splash screen'in rengi veya login ekranının layout'u ürüne göre değişir ama bu ekranların varlığı, davranışı ve kabul kriterleri altyapı seviyesinde tanımlıdır.
3. **Bu ekranlar canonical stack'ın somut ispatıdır.** Her ekran, canonical stack kararlarının gerçekten çalıştığını gösteren ilk vertical slice'dır.
4. **Bu ekranlar kütüphane seçimlerinin referans implementasyonudur.** Bir developer yeni feature ekranı yazarken "nasıl yapılır?" sorusunu bu ekranlara bakarak cevaplayabilmelidir.
5. **Bu ekranlar governance kurallarının yaşayan kanıtıdır.** Component governance, error states, motion standard, HIG uyumu ve a11y kuralları bu ekranlarda ilk kez somutlaşır.
6. **Bu set genişletilebilir ama küçültülmesi gerekçe ister.** Herhangi bir ekranın çıkarılması, neden o ekranın gerekmediğini açıklayan bir karar gerektirir.

---

# 4. Kütüphane Seçim İlkeleri

Canonical stack (React 19.2.x, Vite 8.x stable baseline, Expo SDK 55.x, RN 0.83.x, Zustand 5.x, koşullu TanStack Query 5.x track, RHF 7.x, Zod 4.x schema authority, Tailwind 4.x, NativeWind 5.x candidate track, Sentry, i18next) zaten kilitlidir. Ancak bu stack tek başına tüm UI ihtiyaçlarını karşılamaz. Animasyon, gesture, image loading, haptic feedback, biometric auth, bottom sheet, keyboard handling gibi alanlar yardımcı kütüphane gerektirir.

Bu bölüm, yardımcı kütüphane seçimlerinin hangi ilkelerle yapıldığını tanımlar.

## 4.1. Sıfırdan yazmak yerine kanıtlanmış kütüphane tercih edilir

Boilerplate seviyesinde custom animasyon engine, custom gesture handler veya custom image cache yazmak:
- bakım maliyetini artırır,
- edge case'leri kaçırır,
- Expo/RN ekosistemindeki optimize edilmiş native modüllerin avantajını kaybettirir.

Bu nedenle: ekosistemde kanıtlanmış, aktif bakımlı, Expo uyumlu kütüphane varsa sıfırdan yazılmaz.

## 4.2. Canonical stack ile çelişen kütüphane seçilmez

Yardımcı kütüphane seçimi canonical stack'ın ruhuna, versiyonuna ve mimarisine uygun olmalıdır.

Örnekler:
- Tailwind + NativeWind varken Material UI veya Chakra UI eklenmez.
- Zustand varken MobX veya Redux state'e dahil edilmez.
- ADR-005 ile TanStack Query adopt edilmişse Apollo Client veya SWR eklenmez.
- RHF + Zod varken Formik + Yup eklenmez.

## 4.3. Headless/unstyled kütüphaneler tercih edilir

Tema token uyumu bu projede merkezidir. Bu nedenle:
- kendi stilini zorlayan kütüphaneler yerine headless/unstyled olanlar tercih edilir,
- stil sistemi her zaman Tailwind/NativeWind + design token katmanı üzerinden geçmelidir,
- kütüphanenin kendi CSS'i veya theme sistemi projeye sızmaz.

## 4.4. Her kütüphane için: seçim gerekçesi, alternatifler, HIG uyum notu, bundle etkisi

Yardımcı kütüphane ekleme kararı keyfi değildir. Her kütüphane için şu bilgiler açıkça tanımlanmalıdır:
- **Seçim gerekçesi:** Bu kütüphane neden gerekli? Hangi problemi çözüyor?
- **Alternatifler:** Hangi alternatifler değerlendirildi ve neden reddedildi?
- **HIG uyum notu:** Bu kütüphane Apple Human Interface Guidelines uyumunu destekliyor mu, engelliyor mu?
- **Bundle etkisi:** Bu kütüphanenin bundle size'a etkisi nedir? Tree-shakeable mı?

## 4.5. Expo ekosistemindeki modüller öncelikli

Mobile uyumluluk bu boilerplate'te birinci sınıf vatandaştır. Bu nedenle:
- Expo SDK'da bundled gelen modüller (expo-haptics, expo-image, expo-secure-store vb.) üçüncü taraf alternatiflerine tercih edilir,
- Expo bundled modüller native bridge'i Expo config plugin sistemi ile yönetir, ek native setup gerektirmez,
- Expo bundled olmayan native modüller için config plugin desteği kontrol edilmelidir,
- Expo Go uyumluluğu yalnızca sınırlı sandbox değeri taşır; gerçek feature doğrulaması development build üzerinde yapılmalıdır.

---

# 5. Yardımcı Kütüphane Haritası

Bu bölüm, canonical stack'ın **üzerine** eklenen yardımcı kütüphanelerin tam listesini tanımlar. Her kütüphane için: ne işe yarar, neden bu seçildi, alternatifleri neydi ve Apple HIG uyumu açıklanır.

---

## 5.1. react-native-reanimated 3.x

**Ne işe yarar:** React Native'de native thread üzerinde çalışan yüksek performanslı animasyon kütüphanesidir. JS thread'den bağımsız olarak UI thread üzerinde animasyon çalıştırarak 60fps (ProMotion cihazlarda 120fps) garanti eder. Shared values, worklets ve layout animations sunar.

**Neden bu seçildi:** React Native'in built-in Animated API'si JS thread'e bağlıdır ve karmaşık animasyonlarda frame drop yaşatır. Reanimated, worklet mimarisi sayesinde animasyonları native thread'e taşır. Expo SDK 55.x ile bundled gelir, ek native setup gerektirmez. Bottom sheet, gesture-driven animasyonlar ve layout transitions için fiili standart haline gelmiştir.

**Alternatifler ve neden reddedildi:**
- **React Native Animated (built-in):** JS thread sınırlaması nedeniyle karmaşık animasyonlarda yetersiz.
- **Moti:** Reanimated üzerine kurulu üst katman; doğrudan Reanimated daha esnek.
- **react-native-motion:** Henüz yeterince olgun değil.

**Apple HIG uyumu:** Apple HIG, animasyonların 60fps altına düşmemesini, gesture-driven geçişlerin doğal hissettirmesini ve reduced motion tercihine saygı göstermesini gerektirir. Reanimated, `ReducedMotionConfig` ile reduced motion desteği sunar ve native thread performansı HIG'nin fps beklentisini karşılar.

**Bundle etkisi:** Expo bundled olduğu için ek JS bundle artışı minimaldir. Native binary'ye zaten dahildir.

---

## 5.2. react-native-gesture-handler 2.x

**Ne işe yarar:** React Native'de native gesture tanıma sistemidir. Tap, long press, pan, pinch, rotation ve fling gesture'larını native katmanda işler. Gesture composability (aynı anda birden fazla gesture) ve gesture exclusion (birbiriyle çakışan gesture'ları yönetme) destekler.

**Neden bu seçildi:** React Native'in built-in gesture sistemi (PanResponder) JS thread'e bağlıdır ve karmaşık gesture etkileşimlerinde (örn: scroll içinde swipe-to-delete) yetersiz kalır. Gesture Handler native katmanda çalıştığı için platform-native dokunma davranışını birebir yansıtır. Expo SDK ile bundled gelir.

**Alternatifler ve neden reddedildi:**
- **PanResponder (built-in):** JS thread sınırlaması, gesture composability eksikliği.
- **react-native-gesture-responder:** Bakımsız, ekosistem desteği zayıf.

**Apple HIG uyumu:** Apple HIG, gesture'ların platform-native davranması gerektiğini, swipe-back gesture'ının her zaman çalışmasını ve gesture conflict'lerin kullanıcıyı şaşırtmamasını gerektirir. Gesture Handler, iOS'un native gesture recognizer'ları üzerine kurulduğu için bu beklentileri doğal olarak karşılar.

**Bundle etkisi:** Expo bundled. Ek JS overhead minimumdur.

---

## 5.3. react-native-safe-area-context

**Ne işe yarar:** iOS notch, Dynamic Island, home indicator ve status bar gibi güvenli olmayan alanların inset değerlerini sağlar. `SafeAreaProvider` ve `useSafeAreaInsets` hook'u ile her ekranda dinamik safe area yönetimi sunar.

**Neden bu seçildi:** iOS cihazlarda ekran geometrisi çok çeşitlidir (notch, Dynamic Island, home indicator). Hardcoded padding değerleri kullanmak yeni cihaz form factor'larında bozulmaya yol açar. Bu kütüphane native katmandan gerçek inset değerlerini okur ve her cihazda doğru sonuç verir. Expo SDK ile bundled gelir.

**Alternatifler ve neden reddedildi:**
- **Manuel StatusBar.currentHeight + hardcoded bottom padding:** Cihaz çeşitliliğinde bozulur, bakım maliyeti yüksek.
- **react-native-safe-area-view (eski):** Deprecated, bu kütüphane onun halefidir.

**Apple HIG uyumu:** Apple HIG, içeriğin safe area dışına taşmamasını, status bar ve home indicator alanlarına müdahale edilmemesini açıkça gerektirir. Bu kütüphane HIG'nin bu gereksinimini doğrudan karşılar. HIG ihlali riski olmadan safe area uyumu sağlar.

**Bundle etkisi:** Expo bundled. JS tarafı çok hafif (~2KB).

---

## 5.4. @gorhom/bottom-sheet 5.x

**Ne işe yarar:** iOS Maps, Apple Music ve benzeri uygulamalardaki bottom sheet davranışını React Native'e taşır. Snap noktaları, gesture-driven açılıp kapanma, backdrop, keyboard avoiding ve scroll içinde scroll desteği sunar.

**Neden bu seçildi:** Bottom sheet, modern iOS ve Android uygulamalarında en yaygın kullanılan UI pattern'lerinden biridir. Bu kütüphane Reanimated 3.x ve Gesture Handler 2.x üzerine kurulmuştur, bu yüzden canonical yardımcı kütüphane setiyle tam uyumludur. Headless/unstyled yapısı sayesinde tasarım token'ları ile tam özelleştirme mümkündür.

**Alternatifler ve neden reddedildi:**
- **react-native-modal:** Bottom sheet için optimize değil, snap noktaları yok.
- **@react-native-community/bottom-sheet:** Bakımsız, Reanimated 3.x uyumsuz.
- **Custom bottom sheet:** Gesture + animasyon + keyboard + scroll etkileşimi çok karmaşık; bakım maliyeti çok yüksek.

**Apple HIG uyumu:** Apple HIG, bottom sheet'lerin detent noktalarında durmasını (medium, large), gesture ile kapanabilmesini, backdrop'un bulunduğu bağlamı soluklaştırmasını ve keyboard açıldığında içeriğin kaymamasını gerektirir. @gorhom/bottom-sheet tüm bu davranışları doğrudan destekler.

**Bundle etkisi:** Reanimated ve Gesture Handler zaten mevcut olduğu için ek native overhead yoktur. JS bundle etkisi ~15KB (gzip).

---

## 5.5. react-native-keyboard-controller

**Ne işe yarar:** Keyboard açılıp kapanırken oluşan UI kayma ve layout değişikliklerini yönetir. Reanimated tabanlı olduğu için keyboard animasyonunu frame-by-frame native thread'de takip eder. `KeyboardAwareScrollView` ve `useKeyboardAnimation` hook'u sunar.

**Neden bu seçildi:** React Native'in built-in `KeyboardAvoidingView`'ı iOS'ta inconsistent davranır, Android'de ise `windowSoftInputMode` ayarlarına fazla bağımlıdır. Bu kütüphane Reanimated worklet'leri kullanarak keyboard animasyonunu birebir takip eder ve iOS'un native keyboard avoiding davranışını yansıtır.

**Alternatifler ve neden reddedildi:**
- **KeyboardAvoidingView (built-in):** Platform tutarsızlıkları, animasyon senkronizasyon sorunları.
- **react-native-keyboard-aware-scroll-view:** Bakım durumu zayıf, Reanimated uyumsuz.
- **react-native-avoid-softinput:** Daha az yaygın, ekosistem desteği sınırlı.

**Apple HIG uyumu:** Apple HIG, keyboard açıldığında aktif input'un her zaman görünür olmasını ve keyboard kapanırken layout'un doğal animasyonla geri dönmesini gerektirir. Bu kütüphane native-level keyboard tracking ile bu beklentiyi karşılar.

**Bundle etkisi:** Native modül + JS katmanı. JS bundle etkisi ~8KB (gzip). Reanimated peer dependency zaten mevcut.

---

## 5.6. expo-haptics

**Ne işe yarar:** iOS ve Android'de haptic feedback (dokunsal geri bildirim) sunar. Impact (hafif, orta, ağır), notification (başarı, uyarı, hata) ve selection feedback türlerini destekler.

**Neden bu seçildi:** Haptic feedback, modern mobil uygulamalarda kullanıcı eylemlerinin onaylanmasında kritik rol oynar. Toggle değiştirme, form gönderme, silme onayı ve pull-to-refresh gibi eylemlerde dokunsal geri bildirim, uygulamanın premium hissettirmesini sağlar. Expo SDK'da bundled olarak gelir.

**Alternatifler ve neden reddedildi:**
- **react-native-haptic-feedback:** Expo bundled değil, ek native setup gerektirir.
- **Manuel native module:** Gereksiz karmaşıklık, Expo'nun sunduğu API yeterli.

**Apple HIG uyumu:** Apple HIG, haptic feedback'in tutarlı ve anlamlı kullanılmasını; UIImpactFeedbackGenerator, UINotificationFeedbackGenerator ve UISelectionFeedbackGenerator pattern'larına uyulmasını gerektirir. expo-haptics bu üç iOS feedback generator'ını doğrudan map eder.

**Bundle etkisi:** Expo bundled. Ek JS overhead ihmal edilebilir düzeyde.

---

## 5.7. expo-local-authentication

**Ne işe yarar:** Cihazın biometric authentication sistemine (Face ID, Touch ID, Android fingerprint) erişim sağlar. Biometric yetenek kontrolü, authentication prompt gösterimi ve fallback (PIN/passcode) desteği sunar.

**Neden bu seçildi:** Biometric authentication modern uygulamalarda güvenlik ve kullanıcı deneyimi açısından standart beklentidir. Özellikle oturum kilidi, hassas işlem onayı ve hızlı giriş senaryolarında kullanılır. Expo SDK bundled modül olarak gelir.

**Alternatifler ve neden reddedildi:**
- **react-native-biometrics:** Expo bundled değil, config plugin gerektirir.
- **expo-auth-session:** OAuth/OIDC odaklı, local biometric auth değil.

**Apple HIG uyumu:** Apple HIG, Face ID ve Touch ID kullanımının amacını açıkça belirtmesini (usage description), fallback seçeneği sunmasını ve biometric veriye doğrudan erişilmemesini gerektirir. expo-local-authentication iOS LocalAuthentication framework'ü üzerine kurulduğu için bu gereksinimleri native seviyede karşılar.

**Bundle etkisi:** Expo bundled. Ek overhead yok.

---

## 5.8. expo-secure-store

**Ne işe yarar:** iOS Keychain ve Android Keystore üzerinde şifreli key-value storage sağlar. Token, session secret, API key ve benzeri hassas verilerin güvenli saklanması için kullanılır.

**Neden bu seçildi:** Hassas veriler (auth token, refresh token, biometric enrollment flag vb.) AsyncStorage gibi şifresiz ortamlarda saklanmamalıdır. expo-secure-store, platform-native şifreleme mekanizmalarını kullanarak güvenli depolama sağlar. Expo SDK bundled modül olarak gelir.

**Alternatifler ve neden reddedildi:**
- **react-native-keychain:** Daha fazla kontrol sunar ancak Expo bundled değil.
- **AsyncStorage + manuel şifreleme:** Kendi şifreleme katmanını yazmak güvenlik riski taşır.

**Apple HIG uyumu:** Apple, hassas verilerin Keychain'de saklanmasını, iCloud Keychain sync tercihinin kullanıcıya bırakılmasını ve Keychain access group'larının doğru yapılandırılmasını gerektirir. expo-secure-store iOS Keychain API'sine doğrudan erişir.

**Bundle etkisi:** Expo bundled. Ek overhead yok.

---

## 5.9. expo-notifications

**Ne işe yarar:** Push notification ve local notification yönetimi sağlar. Notification izni isteme, token alma, foreground/background notification handling, notification scheduling ve notification kategorileri (interactive notification actions) destekler.

**Neden bu seçildi:** Push notification neredeyse her mobil uygulamada gereken temel altyapıdır. expo-notifications hem push (APNs/FCM) hem local notification'ları tek API ile yönetir. Expo SDK bundled modül olarak gelir.

**Alternatifler ve neden reddedildi:**
- **react-native-firebase/messaging:** Sadece push notification, local notification ayrı kütüphane gerektirir. Firebase dependency getirir.
- **notifee:** Güçlü ama Expo bundled değil, ek native config gerektirir.

**Apple HIG uyumu:** Apple HIG, notification izninin gerekçesiz istenmemesini, ilk kullanımda değil anlamlı bir bağlamda istenmesini (permission primer pattern) ve notification içeriğinin açık/anlaşılır olmasını gerektirir. Kütüphane bu kararları zorlamaz ama implementation katmanında bu belgenin S15 (Permission Primer) ekranı ile birlikte kullanılmalıdır.

**Bundle etkisi:** Expo bundled. Ek JS overhead minimumdur.

---

## 5.10. expo-splash-screen

**Ne işe yarar:** Uygulama açılışında native splash screen'in ne zaman gizleneceğini kontrol eder. `preventAutoHideAsync` ve `hideAsync` metodları ile fontlar, token'lar ve ilk veri yüklenene kadar splash screen'in gösterilmesini sağlar.

**Neden bu seçildi:** React Native uygulamalarında JS bundle yüklenmeden önce bir beyaz ekran (white flash) oluşur. Bu kütüphane native splash screen'i JS hazır olana kadar tutar ve sorunsuz bir geçiş sağlar. Expo SDK bundled modül olarak gelir.

**Alternatifler ve neden reddedildi:**
- **react-native-splash-screen:** Expo managed workflow'da doğrudan çalışmaz, config plugin gerektirir.
- **react-native-bootsplash:** Güçlü ama Expo bundled değil.

**Apple HIG uyumu:** Apple HIG, launch screen'in uygulama deneyiminin doğal uzantısı olmasını ve gereksiz yere uzun tutulmamasını gerektirir. Bu kütüphane splash süresini kontrol etmeye izin verir; implementasyon sırasında splash süresi minimum tutulmalıdır (font + token yükleme süresi kadar).

**Bundle etkisi:** Expo bundled. Ek overhead yok.

---

## 5.11. expo-image 2.x

**Ne işe yarar:** React Native için optimize edilmiş image component'idir. Disk ve bellek cache'i, blur placeholder (blurhash), content-fit modları, progressive loading, animated image desteği ve otomatik memory management sunar.

**Neden bu seçildi:** React Native'in built-in `Image` component'i cache yönetiminde zayıftır, blur placeholder desteklemez ve büyük image listelerinde memory sorunlarına yol açar. expo-image, C++ tabanlı native rendering engine'i ile hem performans hem özellik açısından üstündür. Expo SDK bundled modül olarak gelir.

**Alternatifler ve neden reddedildi:**
- **Image (built-in RN):** Cache yönetimi zayıf, placeholder desteği yok, memory management yetersiz.
- **react-native-fast-image:** Bakım durumu kötü (archived), Expo bundled değil.
- **@shopify/flash-list + Image:** flash-list liste optimizasyonu sunar ama image component'i değildir.

**Apple HIG uyumu:** Apple HIG, görsellerin content mode'unu (aspect fill, aspect fit) doğru kullanmayı, placeholder ile loading state'i göstermeyi ve memory pressure'a duyarlı olmayı gerektirir. expo-image content-fit modları ve automatic memory management ile bu beklentileri karşılar.

**Bundle etkisi:** Expo bundled. Native binary'de C++ engine bulunur. JS overhead ~5KB.

---

## 5.12. expo-font

**Ne işe yarar:** Custom font'ların uygulama başlangıcında asenkron yüklenmesini sağlar. `useFonts` hook'u ile font loading state'i takip edilebilir ve splash screen ile koordinasyon kurulabilir.

**Neden bu seçildi:** Her uygulamanın kendi tipografi seti vardır ve bu fontların kullanıcı arayüzü render'ından önce yüklenmesi gerekir. expo-font, splash screen ile birlikte kullanıldığında font loading → splash hide → UI render akışını sorunsuz yönetir. Expo SDK bundled modül olarak gelir.

**Alternatifler ve neden reddedildi:**
- **Asset bundling (static linking):** Mümkün ama dynamic font loading esnekliğini kaybettirir.
- **react-native-dynamic-fonts:** Bakımsız, Expo uyumsuz.

**Apple HIG uyumu:** Apple HIG, tipografinin tutarlı ve okunabilir olmasını gerektirir. Font yüklenirken system font fallback göstermek yerine splash screen ile beklemek, FOUT (Flash of Unstyled Text) sorununu önler ve HIG'nin tipografi tutarlılığı beklentisini karşılar.

**Bundle etkisi:** Expo bundled. Ek overhead yok. Font dosyaları asset olarak binary'ye dahil edilir.

---

## 5.13. expo-clipboard

**Ne işe yarar:** Sistem panosuna (clipboard) metin kopyalama ve panodan metin okuma işlemlerini sağlar.

**Neden bu seçildi:** Referans kodu, OTP, paylaşım linki ve benzeri içeriklerin kopyalanması yaygın bir kullanıcı ihtiyacıdır. expo-clipboard bu işlemi tek satır API ile çözer. Expo SDK bundled modül olarak gelir.

**Alternatifler ve neden reddedildi:**
- **@react-native-clipboard/clipboard:** Expo bundled değil, config plugin gerektirir.

**Apple HIG uyumu:** Apple HIG, clipboard erişiminin iOS 16+ itibariyle kullanıcı iznine tabi olduğunu ve paste işlemlerinde sistem prompt'unun gösterildiğini belirtir. expo-clipboard bu sistem davranışına müdahale etmez ve uyumludur.

**Bundle etkisi:** Expo bundled. Ek overhead yok.

---

## 5.14. expo-camera

**Ne işe yarar:** Cihaz kamerasına erişim sağlar. Fotoğraf çekme, video kaydetme, barcode/QR code tarama ve kamera önizleme sunar.

**Neden bu seçildi:** Profil fotoğrafı çekme, belge tarama ve QR code okuma gibi senaryolarda kamera erişimi gereklidir. expo-camera, izin yönetimi dahil tam kamera API'si sunar. Expo SDK bundled modül olarak gelir.

**Alternatifler ve neden reddedildi:**
- **react-native-camera:** Deprecated, bakımsız.
- **react-native-vision-camera:** Daha güçlü ama Expo bundled değil, config plugin gerektirir. İleri düzey kamera ihtiyacı olursa değerlendirilebilir.

**Apple HIG uyumu:** Apple HIG, kamera izni için anlamlı usage description gerektirmesini, izin isteğinin bağlamsal olmasını ve kamera önizlemesinin tam ekran veya uygun aspect ratio'da gösterilmesini gerektirir. expo-camera bu gereksinimleri destekler.

**Bundle etkisi:** Expo bundled. Native binary'de kamera modülü bulunur.

---

## 5.15. expo-location

**Ne işe yarar:** Cihazın GPS/konum servislerine erişim sağlar. Foreground ve background konum takibi, geocoding (adres → koordinat) ve reverse geocoding (koordinat → adres) destekler.

**Neden bu seçildi:** Konum tabanlı özellikler (harita, yakındaki yerler, teslimat adresi vb.) için konum erişimi gereklidir. expo-location, izin yönetimi dahil tam konum API'si sunar. Expo SDK bundled modül olarak gelir.

**Alternatifler ve neden reddedildi:**
- **react-native-geolocation-service:** Expo bundled değil, config plugin gerektirir.
- **@react-native-community/geolocation:** Bakım durumu zayıf.

**Apple HIG uyumu:** Apple HIG, konum izni için net usage description gerektirmesini, "When In Use" ve "Always" izin seviyelerinin doğru ayrılmasını ve konum erişiminin mavi status bar göstergesi ile kullanıcıya bildirilmesini gerektirir. expo-location bu izin seviyeleri ayrımını destekler.

**Bundle etkisi:** Expo bundled. Native binary'de konum modülü bulunur.

---

## 5.16. expo-image-picker

**Ne işe yarar:** Cihaz galerisinden görsel/video seçme ve kameradan fotoğraf/video çekme arayüzünü sunar. Çoklu seçim, crop, kalite ayarı ve medya tipi filtreleme destekler.

**Neden bu seçildi:** Profil fotoğrafı yükleme, içerik oluşturma ve medya paylaşımı gibi senaryolarda kullanıcının galeri veya kameradan görsel seçmesi gerekir. expo-image-picker, izin yönetimi dahil platform-native medya seçim arayüzünü sunar. Expo SDK bundled modül olarak gelir.

**Alternatifler ve neden reddedildi:**
- **react-native-image-crop-picker:** Daha fazla crop özelliği sunar ama Expo bundled değil.
- **expo-camera + expo-media-library birlikte:** Daha fazla kontrol ama daha karmaşık implementasyon.

**Apple HIG uyumu:** Apple HIG, PHPickerViewController (iOS 14+) kullanımını teşvik eder; bu, fotoğraf kütüphanesi iznini kaldırarak yalnızca seçilen görsellere erişim sağlar. expo-image-picker iOS'ta PHPicker'ı kullanır ve bu HIG beklentisini doğrudan karşılar.

**Bundle etkisi:** Expo bundled. Ek overhead yok.

---

## 5.17. expo-file-system

**Ne işe yarar:** Dosya sistemi işlemlerini sağlar: dosya okuma/yazma, indirme, yükleme, dizin yönetimi ve dosya bilgisi sorgulama.

**Neden bu seçildi:** İndirilen dosyalar, cache'lenmiş veriler ve kullanıcı tarafından oluşturulan dosyalar için dosya sistemi erişimi gereklidir. expo-file-system sandboxed dosya sistemi üzerinde güvenli işlemler sunar. Expo SDK bundled modül olarak gelir.

**Alternatifler ve neden reddedildi:**
- **react-native-fs:** Expo bundled değil, config plugin gerektirir.
- **react-native-blob-util:** Daha geniş API ama Expo bundled değil.

**Apple HIG uyumu:** Apple HIG, uygulamaların sandbox dışına erişmemesini ve kullanıcı verilerinin uygun dizinlerde (Documents, Caches, tmp) saklanmasını gerektirir. expo-file-system sandboxed çalışır ve Apple'ın dosya sistemi kurallarına uyar.

**Bundle etkisi:** Expo bundled. Ek overhead yok.

---

## 5.18. expo-constants

**Ne işe yarar:** Uygulama metadata'sına erişim sağlar: app version, build number, device name, system fonts, status bar height, Expo config değerleri ve manifest bilgileri.

**Neden bu seçildi:** About/Legal ekranı, hata raporlama ve runtime konfigürasyon kontrolü için uygulama metadata'sına erişim gereklidir. expo-constants bu bilgileri tek API ile sunar. Expo SDK bundled modül olarak gelir.

**Alternatifler ve neden reddedildi:**
- **react-native-device-info:** Daha fazla cihaz bilgisi sunar ama Expo bundled değil.

**Apple HIG uyumu:** Doğrudan HIG etkisi yoktur. Ancak About ekranında version bilgisi göstermek Apple'ın App Store Review Guidelines'ında önerilen bir uygulamadır.

**Bundle etkisi:** Expo bundled. Ek overhead yok.

---

## 5.19. expo-linking

**Ne işe yarar:** Deep link handling ve URL scheme yönetimi sağlar. Uygulama dışından gelen link'leri yakalama, uygulama içinden dış URL açma ve universal link (iOS) / app link (Android) desteği sunar.

**Neden bu seçildi:** Password reset, email verification, paylaşılan içerik ve marketing campaign link'leri deep link gerektirir. expo-linking, React Navigation ile entegre çalışarak gelen deep link'leri doğrudan ilgili ekrana yönlendirir. Expo SDK bundled modül olarak gelir.

**Alternatifler ve neden reddedildi:**
- **React Native Linking (built-in):** Temel işlevsellik sunar ama Expo routing ile entegrasyonu expo-linking kadar sorunsuz değil.

**Apple HIG uyumu:** Apple, universal link'lerin AASA (Apple App Site Association) dosyası ile doğru yapılandırılmasını, link'lerin kullanıcıyı beklenen içeriğe götürmesini ve deep link ile web URL arasında tutarlılık olmasını gerektirir. expo-linking bu yapılandırmayı Expo config üzerinden yönetir.

**Bundle etkisi:** Expo bundled. Ek overhead yok.

---

## 5.20. expo-updates

**Ne işe yarar:** OTA (Over-The-Air) güncelleme mekanizması sağlar. App Store/Play Store submission olmadan JS bundle, asset ve konfigürasyon güncellemelerini kullanıcılara dağıtır.

**Neden bu seçildi:** Hata düzeltmeleri, küçük UI değişiklikleri ve acil patch'ler için App Store review sürecini beklemek kabul edilemez. expo-updates, production'daki uygulamalara anlık güncelleme dağıtır. Force update ekranı (S02) ile birlikte native update gerektiğinde kullanıcıyı store'a yönlendirir.

**Alternatifler ve neden reddedildi:**
- **CodePush (App Center):** Microsoft tarafından sunset edildi.
- **Custom OTA solution:** Bakım maliyeti çok yüksek.

**Apple HIG uyumu:** Apple, OTA güncellemelerin uygulama amacını değiştirmemesini ve App Store Review Guidelines'a uymasını gerektirir. expo-updates JS bundle güncellemesi yapar, native binary değiştirmez; bu Apple kurallarına uygundur.

**Bundle etkisi:** Expo bundled. Native binary'de update client bulunur. Runtime'da update check network call'u yapar.

---

## 5.21. expo-status-bar

**Ne işe yarar:** Status bar'ın stilini (açık/koyu), görünürlüğünü ve arka plan rengini kontrol eder. Ekran bazında status bar konfigürasyonu yapmaya olanak tanır.

**Neden bu seçildi:** Farklı ekranlar farklı status bar stili gerektirebilir (koyu arka plan → açık status bar, açık arka plan → koyu status bar). expo-status-bar bu kontrolü declarative API ile sağlar. Expo SDK bundled modül olarak gelir.

**Alternatifler ve neden reddedildi:**
- **StatusBar (built-in RN):** Temel işlevsellik sunar ama Expo'nun ekosistemi ile uyumu expo-status-bar kadar sorunsuz değil.

**Apple HIG uyumu:** Apple HIG, status bar'ın her zaman görünür olmasını (tam ekran medya dışında), status bar stilinin içerik ile kontrast oluşturmasını ve status bar alanının içerikle örtüşmemesini gerektirir. expo-status-bar bu kontrolleri sağlar.

**Bundle etkisi:** Expo bundled. Ek overhead yok.

---

## 5.22. @react-native-async-storage/async-storage

**Ne işe yarar:** Non-sensitive (hassas olmayan) veriler için kalıcı key-value storage sağlar. Kullanıcı tercihleri, onboarding completion flag'leri, theme seçimi ve dil tercihi gibi veriler için kullanılır.

**Neden bu seçildi:** Hassas olmayan ama kalıcı olması gereken veriler (theme, language, onboarding flag vb.) için basit key-value storage gereklidir. AsyncStorage bu ihtiyacı karşılar. React Native ekosisteminin fiili standart non-sensitive storage çözümüdür.

**Alternatifler ve neden reddedildi:**
- **expo-secure-store:** Hassas veriler için; non-sensitive veriler için gereksiz şifreleme overhead'i.
- **MMKV (react-native-mmkv):** Daha hızlı ama Expo bundled değil, config plugin gerektirir. Performance-critical storage ihtiyacı olursa değerlendirilebilir.
- **SQLite:** Non-sensitive key-value için fazla karmaşık.

**Apple HIG uyumu:** Doğrudan HIG etkisi yoktur. Depolanan veriler kullanıcı deneyimini dolaylı olarak etkiler (tercihler hatırlanır, onboarding tekrar gösterilmez).

**Bundle etkisi:** Expo/RN ekosisteminde yaygın. JS overhead ~3KB. Native binary'de SQLite-based storage.

---

## 5.23. @react-native-community/netinfo

**Ne işe yarar:** Cihazın ağ bağlantı durumunu (online/offline, wifi/cellular, bağlantı tipi) gerçek zamanlı izler. Connection state değişikliklerinde event yayınlar.

**Neden bu seçildi:** Offline/online durumuna göre UI davranışı değiştirme (offline banner, queue işlemleri, cache-first strateji) için bağlantı durumu bilgisi gereklidir. No Internet ekranı (S03) ve TanStack Query'nin online/offline davranışı bu kütüphaneye bağlıdır.

**Alternatifler ve neden reddedildi:**
- **Navigator.onLine (web):** Yalnızca web, mobile'da çalışmaz.
- **Custom native module:** Gereksiz, bu kütüphane yeterli.

**Apple HIG uyumu:** Apple HIG, ağ durumu değişikliklerinde kullanıcıya uygun bilgi verilmesini ve offline durumda uygulamanın tamamen çökmemesini gerektirir. NetInfo bu bilgiyi sağlar; offline state UI'ı bu bilgiyle inşa edilir.

**Bundle etkisi:** JS overhead ~4KB. Native modül hafif.

---

## 5.24. react-native-svg

**Ne işe yarar:** React Native'de SVG render etmeyi sağlar. SVG elementleri (path, circle, rect, text, gradient vb.) React component'leri olarak kullanılabilir.

**Neden bu seçildi:** Icon'lar, grafikler ve özel şekiller SVG formatında en verimli şekilde render edilir. Lucide icon seti SVG tabanlıdır ve react-native-svg üzerinden render edilir. Expo SDK ile uyumludur.

**Alternatifler ve neden reddedildi:**
- **PNG/bitmap icon'lar:** Ölçeklenemez, farklı density'ler için çoklu asset gerektirir.
- **Icon font (vector icons):** Tree-shakeable değil, kullanılmayan icon'lar bundle'da kalır.

**Apple HIG uyumu:** Apple HIG, icon'ların SF Symbols standartlarına (optik hizalama, ağırlık varyantları) uygun olmasını önerir. SVG icon'lar bu standartlara uygun tasarlanabilir. react-native-svg bu render'ı sağlar.

**Bundle etkisi:** Native binary'de SVG engine bulunur. JS overhead render edilen SVG karmaşıklığına bağlı.

---

## 5.25. lucide-react + lucide-react-native

**Ne işe yarar:** 1300+ SVG icon içeren, tree-shakeable, tutarlı ve açık kaynaklı icon setidir. lucide-react web için, lucide-react-native React Native için optimize edilmiştir.

**Neden bu seçildi:** Icon seti seçimi uygulamanın görsel tutarlılığını doğrudan etkiler. Lucide, Feather Icons'un aktif olarak bakımlı devamıdır. Tree-shakeable yapısı sayesinde yalnızca kullanılan icon'lar bundle'a dahil olur. Tutarlı stroke width ve optik ağırlık sunar. Web ve mobile için ayrı optimize paketleri vardır.

**Alternatifler ve neden reddedildi:**
- **@expo/vector-icons:** Icon font tabanlı, tree-shakeable değil. Kullanılmayan icon'lar bundle'da kalır.
- **react-native-vector-icons:** Icon font tabanlı, tree-shakeable değil.
- **SF Symbols (iOS only):** Yalnızca iOS, cross-platform değil.
- **Heroicons:** Daha az icon sayısı, React Native desteği zayıf.
- **Phosphor Icons:** Güçlü alternatif ama Lucide'ın ekosistem desteği ve yaygınlığı daha yüksek.

**Apple HIG uyumu:** Apple HIG, icon'ların optik olarak dengeli, tutarlı stroke ağırlığında ve anlaşılır olmasını gerektirir. Lucide icon'ları tutarlı 24px grid, 2px stroke width ile tasarlanmıştır ve bu beklentiye uygundur. SF Symbols'ün sahip olduğu ağırlık varyantları (thin, regular, bold) Lucide'da yoktur; bu, kabul edilen bir sınırlamadır.

**Bundle etkisi:** Tree-shakeable. Yalnızca import edilen icon'lar bundle'a girer. Her icon ~300B (gzip). 50 icon kullanan bir uygulama için ~15KB.

---

## 5.26. date-fns 4.x

**Ne işe yarar:** JavaScript tarih/saat işlemleri için fonksiyonel, tree-shakeable kütüphanedir. Format, parse, compare, add, subtract, difference, locale ve timezone işlemlerini sağlar.

**Neden bu seçildi:** Tarih formatlama, göreceli zaman gösterimi ("2 saat önce"), tarih karşılaştırma ve i18n uyumlu tarih gösterimi her uygulamada gereklidir. date-fns fonksiyonel ve tree-shakeable yapısıyla yalnızca kullanılan fonksiyonları bundle'a dahil eder. Immutable çalışır, side effect üretmez.

**Alternatifler ve neden reddedildi:**
- **Moment.js:** Deprecated, tree-shakeable değil, bundle size çok büyük (~300KB).
- **Day.js:** Daha hafif ama plugin sistemi karmaşık, tree-shaking desteği date-fns kadar iyi değil.
- **Temporal (TC39):** Henüz tüm runtime'larda stabil değil.
- **Intl.DateTimeFormat (native):** Basit formatlama için yeterli ama karmaşık tarih işlemleri için yetersiz.

**Apple HIG uyumu:** Doğrudan HIG etkisi yoktur. Ancak HIG, tarih ve saat gösteriminin kullanıcının locale'ine uygun olmasını gerektirir. date-fns locale desteği ile i18next entegrasyonu bu beklentiyi karşılar.

**Bundle etkisi:** Tree-shakeable. Temel kullanım (format, parse, compareAsc, formatDistanceToNow) için ~8KB (gzip).

---

## 5.27. react-error-boundary 5.x

**Ne işe yarar:** React uygulamalarında runtime hatalarını yakalayan Error Boundary component'idir. Component tree'de bir yerde oluşan hatanın tüm uygulamayı çökertmesi yerine, hatanın oluştuğu bölüm için fallback UI gösterilmesini sağlar. `ErrorBoundary` component'i, `useErrorBoundary` hook'u ve `withErrorBoundary` HOC'u sunar.

**Neden bu seçildi:** React'in class-based error boundary API'si verbose ve hook uyumsuz. react-error-boundary, modern fonksiyonel component API'si ile error boundary kullanımını kolaylaştırır. Retry, reset ve fallback rendering desteği sunar. Full-screen error (S06) ve section-level error handling bu kütüphane ile inşa edilir.

**Alternatifler ve neden reddedildi:**
- **Custom class-based ErrorBoundary:** Verbose, hook desteği yok, her projede tekrar yazılması gerekir.
- **Hiç error boundary kullanmamak:** Kabul edilemez; tek bir component hatası tüm uygulamayı beyaz ekrana çevirir.

**Apple HIG uyumu:** Doğrudan HIG etkisi yoktur. Ancak HIG, hata durumlarında kullanıcının ne olduğunu anlamasını ve recovery yolunun sunulmasını gerektirir. react-error-boundary'nin fallback ve retry mekanizması bu beklentiyi destekler.

**Bundle etkisi:** Çok hafif. ~2KB (gzip). Zero dependency.

---

## 5.28. sonner 2.x

**Ne işe yarar:** Web uygulamaları için hafif, erişilebilir toast notification component'idir. Success, error, warning, info ve promise toast türlerini destekler. Otomatik stacking, dismiss ve action button sunar.

**Neden bu seçildi:** Web uygulamalarında transient feedback (kısa süreli bildirim) için toast gereklidir. sonner, minimal API, erişilebilir markup (ARIA live region), güzel animasyonlar ve küçük bundle size sunar. Headless/unstyled seçenek mevcut olsa da sonner'ın varsayılan stili Tailwind ile kolayca özelleştirilebilir.

**Alternatifler ve neden reddedildi:**
- **react-hot-toast:** Daha az erişilebilir, daha büyük bundle.
- **react-toastify:** Kendi CSS'ini zorlar, bundle size büyük (~30KB).
- **Custom toast:** Animation, stacking, dismiss timing ve a11y yönetimi karmaşık.

**Apple HIG uyumu:** Web context'inde doğrudan HIG uyumu gerekmez. Ancak HIG'nin transient alert prensipleri (kısa, anlaşılır, otomatik kapanan, kritik olmayan bilgi için) toast davranışına uygulanmalıdır.

**Bundle etkisi:** ~5KB (gzip). Tailwind ile uyumlu özelleştirme.

**Not:** Mobile tarafta toast gösterimi bu kütüphane yerine custom component veya react-native-toast-message gibi bir RN-native çözüm ile karşılanmalıdır. sonner yalnızca web platformu içindir.

---

## 5.29. clsx + tailwind-merge

**Ne işe yarar:** `clsx` koşullu class name birleştirme sağlar (truthy/falsy değerlere göre class ekleme/çıkarma). `tailwind-merge` ise Tailwind CSS class'larındaki conflict'leri çözer (örn: `p-4` ve `p-2` birlikte kullanıldığında `p-2`'nin kazanmasını sağlar).

**Neden bu seçildi:** Tailwind CSS ile component geliştirirken koşullu class'lar ve class conflict yönetimi kaçınılmazdır. Bu iki kütüphane birlikte (`cn` utility fonksiyonu olarak) kullanıldığında Tailwind class composition temiz, öngörülebilir ve bakımı kolay hale gelir. shadcn/ui ve benzeri modern Tailwind ekosistemlerinin fiili standardıdır.

**Alternatifler ve neden reddedildi:**
- **classnames:** clsx'in daha büyük ve daha yavaş versiyonu.
- **Yalnızca clsx (tailwind-merge olmadan):** Tailwind conflict'leri çözülmez, `p-4 p-2` gibi durumlar beklenmedik sonuç verir.
- **cva (class-variance-authority):** Variant yönetimi için ek katman sunar; ihtiyaç olursa canonical stack'a eklenebilir ama başlangıç için clsx + tailwind-merge yeterlidir.

**Apple HIG uyumu:** Doğrudan HIG etkisi yoktur. Styling altyapısı kütüphanesidir.

**Bundle etkisi:** clsx ~500B (gzip), tailwind-merge ~4KB (gzip). Toplam ~4.5KB.

---

# 6. Varsayılan Ekranlar — System Katmanı

System katmanı, uygulamanın temel çalışma koşullarını yöneten ekranları içerir. Bu ekranlar ürün mantığından bağımsızdır; uygulamanın ayakta kalması, hata yönetimi ve zorunlu sistem durumlarının kullanıcıya gösterilmesi için mevcuttur.

Bu katmandaki ekranlar bootstrap sırasında **ilk** inşa edilmelidir çünkü diğer tüm ekranlar bu katmanın varlığına bağımlıdır (örn: error boundary olmadan feature ekranı yazılamaz, splash screen olmadan uygulama başlatılamaz).

---

## S01. Splash Screen

- **Platform:** Mobile
- **Açıklama:** Uygulamanın soğuk başlatma (cold start) anında gösterilen ilk native ekrandır. JS bundle yüklenmeden, fontlar hazırlanmadan ve ilk veri çekilmeden önce kullanıcının gördüğü tek yüzeydir. Bu ekranın görevi uygulamanın yüklendiğini göstermek, white flash (beyaz ekran flash'ı) sorununu önlemek ve brand tanınırlığını ilk anda kurmaktır. Splash screen, `expo-splash-screen` ile native katmanda tutulur ve JS tarafında `SplashScreen.preventAutoHideAsync()` çağrısıyla fontlar + token'lar + auth state kontrolü tamamlanana kadar gizlenmez. Tüm başlangıç işlemleri tamamlandığında `SplashScreen.hideAsync()` ile animasyonlu geçiş yapılır. Splash screen kesinlikle bilgi göstermez, interactive değildir, kullanıcıdan eylem beklemez. Yalnızca brand logo ve opsiyonel olarak brand rengi arka plan içerir.

- **Kullanılan kütüphaneler:**
  - `expo-splash-screen` — native splash kontrolü
  - `expo-font` — font preloading (splash gizlenmeden önce fontlar hazır olmalı)
  - `expo-image` — varsa brand asset preload

- **Bağımlılıklar:**
  - Brand token'ları (logo SVG/PNG, brand color) design token spec'ten alınır
  - `expo-font` üzerinden custom font'lar yüklenir
  - Auth state kontrolü (Zustand auth store + expo-secure-store'dan token okuma)

- **Apple HIG uyumu:**
  - Apple HIG, launch screen'in uygulamanın ilk karesine benzememesini ama uygulamanın doğal uzantısı gibi hissettirmesini gerektirir.
  - Launch screen statik bir tasarım olmalıdır (animasyon barındırmamalı — bu native katman sınırlamasıdır).
  - Splash screen marketing mesajı, versiyon bilgisi veya loading spinner göstermemelidir.
  - Splash süresi olabildiğince kısa tutulmalıdır. Apple, splash screen'in "an" olmasını, "ekran" olmamasını önerir.
  - HIG, "don't make people wait for content to load before they see the launch screen" der — splash, yükleme ekranı değil, geçiş perdesidir.

- **Kabul kriterleri:**
  1. Uygulama soğuk başlatmada beyaz ekran flash'ı göstermez; native splash anında görünür.
  2. Splash screen, fontlar ve auth state kontrol tamamlanana kadar native katmanda tutulur.
  3. Splash → ilk ekran geçişi animasyonludur (fade veya native transition).
  4. Splash screen üzerinde yalnızca brand logo ve arka plan rengi bulunur; spinner, metin, versiyon bilgisi bulunmaz.
  5. Splash süresi font loading + auth check süresine eşittir; sabit bekleme süresi (artificial delay) eklenmez.

---

## S02. Force Update Screen

- **Platform:** Mobile
- **Açıklama:** Uygulamanın mevcut sürümünün artık desteklenmediğini ve kullanıcının App Store / Play Store'dan güncelleme yapması gerektiğini bildiren tam ekran blocker yüzeyidir. Bu ekran kullanıcının uygulamayı kullanmasını tamamen engeller; dismiss edilemez, bypass edilemez, geri basılamaz. Uygulama açılışında backend'den alınan minimum desteklenen versiyon bilgisi ile mevcut app versiyonu karşılaştırılır. Mevcut versiyon minimum'un altındaysa bu ekran gösterilir ve kullanıcı yalnızca store'a yönlendirilir. Opsiyonel olarak "güncelleme önerilir ama zorunlu değil" (soft update) varyantı da desteklenebilir; bu varyant dismiss edilebilir. Bu ekranın gösterimi expo-updates OTA mekanizmasından bağımsızdır; burada kastedilen native binary güncellemesidir (API breaking change, native modül güncellemesi vb.).

- **Kullanılan kütüphaneler:**
  - `expo-constants` — mevcut app version bilgisi
  - `expo-linking` — store URL'ine yönlendirme (App Store / Play Store)
  - `expo-status-bar` — status bar kontrolü

- **Bağımlılıklar:**
  - Backend'den minimum desteklenen versiyon bilgisini dönen endpoint (app config API)
  - `expo-constants` üzerinden mevcut app version
  - Store URL'leri (iOS App Store link, Android Play Store link) app config'de tanımlı

- **Apple HIG uyumu:**
  - Apple HIG, kullanıcıyı uygulamadan çıkmaya zorlamadan önce nedenini açıkça belirtmeyi gerektirir.
  - Update ekranı neden güncelleme gerektiğini kısa ve anlaşılır şekilde açıklamalıdır.
  - Store'a yönlendirme butonu, HIG'nin action button hiyerarşisine uygun olmalıdır (primary action = güncelle).
  - Soft update varyantında dismiss seçeneği net ve erişilebilir olmalıdır.
  - Apple, uygulamanın kendi başına App Store'a yönlendirme yapmasına izin verir (`itms-apps://` scheme).

- **Kabul kriterleri:**
  1. Mevcut app version < minimum desteklenen version olduğunda bu ekran gösterilir ve uygulama kullanılamaz.
  2. Ekranda güncelleme nedeni kısa bir metinle açıklanır.
  3. "Güncelle" butonu kullanıcıyı doğrudan ilgili store sayfasına yönlendirir.
  4. Ekran dismiss edilemez; geri butonu ve gesture geri hareketi devre dışıdır.
  5. Soft update varyantında "Daha sonra" seçeneği sunar ve uygulama kullanılmaya devam eder.

---

## S03. No Internet / Offline Screen

- **Platform:** Her ikisi (mobile + web)
- **Açıklama:** Cihazın internet bağlantısının olmadığını veya backend'e ulaşılamadığını bildiren tam ekran yüzeyidir. Bu ekranın iki kullanım senaryosu vardır: (1) Uygulama açılışında hiç bağlantı yoksa ve ilk veri çekilemezse full-screen olarak gösterilir. (2) Uygulama kullanılırken bağlantı koparsa, context'e göre inline banner veya section-level offline state gösterilebilir — bu full-screen varyantından farklıdır. Bu ekran `@react-native-community/netinfo` ile ağ durumunu dinler ve bağlantı geldiğinde otomatik retry mekanizması sunar. Kullanıcıya "internet bağlantınızı kontrol edin" mesajı ve "Tekrar dene" butonu gösterilir. Bağlantı geri geldiğinde otomatik olarak veri çekme tetiklenir (TanStack Query refetchOnReconnect).

- **Kullanılan kütüphaneler:**
  - `@react-native-community/netinfo` — ağ durumu izleme
  - `TanStack Query` — refetchOnReconnect, online/offline mode
  - `i18next` — çoklu dil desteği için metin yönetimi
  - `expo-status-bar` — status bar kontrolü (mobile)
  - `lucide-react / lucide-react-native` — offline icon

- **Bağımlılıklar:**
  - NetInfo listener app root'ta initialize edilmiş olmalı
  - TanStack Query'nin `onlineManager` ile NetInfo entegrasyonu kurulmuş olmalı
  - Error/empty state design token'ları (arka plan rengi, metin rengi, icon rengi)

- **Apple HIG uyumu:**
  - Apple HIG, offline durumun kullanıcıya açıkça ama abartısız bildirilmesini gerektirir.
  - İnternet gerektirmeyen yerel içerik (cache'lenmiş veri, ayarlar) offline durumda da erişilebilir olmalıdır.
  - HIG, "tell people what they can do, not just what went wrong" der — yalnızca hata bildirmek yerine ne yapılabileceği söylenmelidir.
  - Retry butonu açıkça görünür ve erişilebilir (minimum 44pt hit target) olmalıdır.
  - Bağlantı geri geldiğinde otomatik kurtarma kullanıcıyı manuel retry'dan kurtarmalıdır.

- **Kabul kriterleri:**
  1. Cihaz offline olduğunda ve cache'te gösterilebilir veri yoksa full-screen offline ekranı gösterilir.
  2. Ekranda anlaşılır bir "internet bağlantısı yok" mesajı ve offline icon bulunur.
  3. "Tekrar dene" butonu sunar ve butona basıldığında bağlantı kontrolü yapılır.
  4. Bağlantı otomatik olarak geri geldiğinde ekran kendiliğinden kapanır ve veri yeniden çekilir.
  5. i18n desteği ile mesajlar çoklu dilde gösterilebilir.

---

## S04. Maintenance Screen

- **Platform:** Her ikisi (mobile + web)
- **Açıklama:** Backend planlı veya plansız bakımdayken gösterilen tam ekran blocker yüzeyidir. Bu ekranın amacı kullanıcıya sistemin geçici olarak kullanılamaz olduğunu, tahmini dönüş zamanını (varsa) ve ne yapabileceğini bildirmektir. Maintenance durumu backend'den dönen HTTP 503 status code veya özel bir app config flag'i ile tespit edilir. Bu ekran force update gibi tamamen blocker'dır; kullanıcı uygulamayı maintenance süresince kullanamaz. Maintenance bittiğinde uygulama otomatik olarak normal akışa döner (polling veya push notification ile). Opsiyonel olarak maintenance süresi hakkında bilgi gösterilebilir ("Tahmini süre: 30 dakika").

- **Kullanılan kütüphaneler:**
  - `TanStack Query` — maintenance status polling
  - `i18next` — çoklu dil metin yönetimi
  - `lucide-react / lucide-react-native` — maintenance icon
  - `expo-status-bar` — status bar kontrolü (mobile)

- **Bağımlılıklar:**
  - Backend'den maintenance durumunu dönen endpoint veya HTTP 503 response handling
  - App config API entegrasyonu
  - Error/empty state design token'ları

- **Apple HIG uyumu:**
  - Apple HIG, sistem durumlarının kullanıcıya açık ve dürüst şekilde bildirilmesini gerektirir.
  - Maintenance nedeni abartısız ama bilgilendirici olmalıdır.
  - Kullanıcıya ne zaman deneyebileceği (tahmini süre) bilgisi verilmesi HIG'nin "keep people informed" prensibine uyar.
  - Maintenance ekranı uygulamanın "kırık" göründüğü izlenimi vermemelidir; planlı bakım, olağan bir süreçtir.

- **Kabul kriterleri:**
  1. Backend HTTP 503 döndüğünde veya maintenance flag aktif olduğunda tam ekran maintenance gösterilir.
  2. Ekranda bakım nedeni ve tahmini dönüş süresi (varsa) bilgisi bulunur.
  3. Ekran dismiss edilemez; kullanıcı uygulamayı kullanamaz.
  4. Periyodik polling ile maintenance durumu kontrol edilir; maintenance bittiğinde otomatik geçiş yapılır.
  5. i18n desteği ile mesajlar çoklu dilde gösterilebilir.

---

## S05. Not Found (404) Screen

- **Platform:** Her ikisi (mobile + web)
- **Açıklama:** Kullanıcının erişmeye çalıştığı sayfa, ekran veya kaynak bulunamadığında gösterilen yüzeydir. Web tarafında URL'deki route tanımlanmadığında, mobile tarafında ise navigation'da tanımsız bir route'a yönlendirme yapıldığında veya deep link'in hedef aldığı içerik artık mevcut olmadığında gösterilir. Bu ekran kullanıcıyı bilgilendirir, ana sayfaya veya önceki ekrana dönüş imkanı sunar ve neden bu sayfanın bulunamadığına dair kısa bilgi verir. Web tarafında HTTP 404 status code ile birlikte gösterilir. Bu ekran error boundary fallback'inden farklıdır; 404, bir runtime hatası değil, yanlış navigation veya mevcut olmayan kaynak durumudur.

- **Kullanılan kütüphaneler:**
  - `React Router 7.x` — web tarafında catch-all route (splat route `*`)
  - `React Navigation 7.x` — mobile tarafında linking config'de tanımsız route handling
  - `i18next` — çoklu dil metin yönetimi
  - `lucide-react / lucide-react-native` — 404 icon

- **Bağımlılıklar:**
  - Web: React Router config'de catch-all route tanımlanmış olmalı
  - Mobile: React Navigation linking config'de fallback ekranı tanımlanmış olmalı
  - Design token'ları (error state renkleri, arka plan, metin)

- **Apple HIG uyumu:**
  - Apple HIG, boş veya bulunamayan içerik durumunda kullanıcıya net bilgi verilmesini ve navigasyon yolu sunulmasını gerektirir.
  - "404" gibi teknik kodlar kullanıcıya gösterilmemelidir; bunun yerine anlaşılır dil kullanılmalıdır ("Bu sayfayı bulamadık").
  - Ana sayfaya dönüş veya geri gitme seçeneği açıkça sunulmalıdır.
  - HIG, dead-end ekranlarından kaçınılmasını gerektirir; her ekranda kullanıcının ilerleyebileceği bir yol olmalıdır.

- **Kabul kriterleri:**
  1. Web'de tanımsız route'a gidildiğinde 404 ekranı gösterilir.
  2. Mobile'da tanımsız deep link hedefine yönlendirme yapıldığında 404 ekranı gösterilir.
  3. Ekranda anlaşılır bir "bulunamadı" mesajı ve icon bulunur; teknik jargon kullanılmaz.
  4. "Ana sayfaya dön" veya "Geri git" butonu sunar.
  5. Web tarafında HTTP 404 status code döner.

---

## S06. Full-screen Error Screen (Error Boundary Fallback)

- **Platform:** Her ikisi (mobile + web)
- **Açıklama:** React component tree'sinde yakalanmamış bir JavaScript runtime hatası oluştuğunda gösterilen tam ekran fallback yüzeyidir. Bu ekran `react-error-boundary` kütüphanesi ile uygulamanın root katmanında ve opsiyonel olarak feature katmanlarında sarmalayan Error Boundary component'inin fallback UI'ıdır. Bu ekranın görevi kullanıcıya "bir şeylerin ters gittiğini" anlaşılır şekilde bildirmek, hata detayını Sentry'ye otomatik raporlamak, "Tekrar dene" (retry/reset) seçeneği sunmak ve opsiyonel olarak "Ana sayfaya dön" alternatifi vermektir. Bu ekran S05 (404) ile karıştırılmamalıdır: 404 kaynak bulunamama durumudur, S06 ise runtime hatası durumudur. Bu ekran S03 (offline) ile de karıştırılmamalıdır: S03 ağ hatası, S06 ise JavaScript execution hatasıdır.

- **Kullanılan kütüphaneler:**
  - `react-error-boundary 5.x` — Error Boundary wrapper
  - `Sentry` — otomatik hata raporlama (captureException)
  - `i18next` — çoklu dil metin yönetimi
  - `lucide-react / lucide-react-native` — error icon

- **Bağımlılıklar:**
  - `react-error-boundary` app root'ta ve opsiyonel olarak feature/section seviyelerinde yapılandırılmış olmalı
  - Sentry SDK initialize edilmiş olmalı
  - Error state design token'ları

- **Apple HIG uyumu:**
  - Apple HIG, hata durumlarında kullanıcıya ne olduğunu anlaşılır şekilde bildirmeyi, teknik detay göstermemeyi ve recovery yolu sunmayı gerektirir.
  - "Bir şeyler ters gitti" gibi belirsiz mesajlar yerine "Bu sayfada bir sorun oluştu" gibi bağlamsal mesaj tercih edilmelidir.
  - Retry butonu açıkça görünür ve erişilebilir (minimum 44pt hit target) olmalıdır.
  - HIG, hata durumlarında kullanıcıyı çıkmaza sokmamayı gerektirir; retry dışında ana sayfaya dönüş seçeneği de sunulmalıdır.

- **Kabul kriterleri:**
  1. Component tree'de yakalanmamış runtime hatası oluştuğunda uygulama beyaz ekrana düşmez; error fallback gösterilir.
  2. Hata otomatik olarak Sentry'ye raporlanır (captureException ile).
  3. Ekranda anlaşılır bir hata mesajı ve error icon bulunur; stack trace gösterilmez (development mode hariç).
  4. "Tekrar dene" butonu error boundary'yi resetler ve component tree'yi yeniden render eder.
  5. "Ana sayfaya dön" alternatif butonu sunar.

---

## S07. Full-screen Loading Screen (App Bootstrap)

- **Platform:** Her ikisi (mobile + web)
- **Açıklama:** Uygulamanın JS bundle'ı yüklendikten sonra ama ilk anlamlı ekran render'ından önce gösterilen geçiş yüzeyidir. Mobile'da splash screen → loading screen → ilk ekran akışı mevcuttur; web'de ise doğrudan loading screen → ilk ekran akışı geçerlidir. Bu ekranın görevi, uygulamanın bootstrap işlemlerinin (auth state kontrolü, kullanıcı profili çekme, feature flag'ler, i18n locale yükleme, design token initialization) tamamlanmasını beklemektir. Bu ekran S01 (splash) ile karıştırılmamalıdır: splash native katmanda tutulan statik ekrandır, S07 ise JS katmanında render edilen ve bootstrap mantığını yöneten aktif ekrandır. Bu ekran sade olmalıdır: brand-uyumlu arka plan + loading indicator. Gereksiz bilgi, marketing mesajı veya animasyon gösterilmez.

- **Kullanılan kütüphaneler:**
  - `Zustand` — auth state kontrolü (isAuthenticated, token varlığı)
  - `TanStack Query` — kullanıcı profili ve app config çekme
  - `expo-secure-store` — token okuma (mobile)
  - `i18next` — locale initialization
  - `react-native-reanimated` — loading indicator animasyonu (opsiyonel)

- **Bağımlılıklar:**
  - Auth store'un initialize edilmesi (expo-secure-store'dan token okuma → isAuthenticated belirleme)
  - App config API'den minimum versiyon, feature flag ve maintenance durumu çekme
  - i18n locale'inin yüklenmesi
  - Design token'ların runtime'da hazır olması

- **Apple HIG uyumu:**
  - Apple HIG, loading state'lerin kullanıcıyı olabildiğince kısa süre bekletmesini gerektirir.
  - Loading indicator, ilerlemenin belirsiz olduğu durumlarda indeterminate spinner kullanmalıdır.
  - Ekran içeriksiz bırakılmamalıdır; en azından brand logo veya minimal gösterge bulunmalıdır.
  - HIG, loading screen'in uzun sürmesi durumunda kullanıcıya ne beklediğini bildirmeyi önerir; ancak bootstrap bu kadar uzun sürmemelidir.

- **Kabul kriterleri:**
  1. JS bundle yüklendikten sonra bootstrap işlemleri tamamlanana kadar loading screen gösterilir.
  2. Loading screen brand-uyumlu arka plan ve indeterminate loading indicator içerir.
  3. Bootstrap tamamlandığında loading screen animasyonlu geçiş ile ilk ekrana (auth durumuna göre login veya home) yerini bırakır.
  4. Bootstrap süresi performance budget dahilindedir (hedef: <2 saniye, acceptable: <4 saniye).
  5. Bootstrap sırasında hata oluşursa S06 (Full-screen Error) veya S03 (Offline) ekranına yönlendirilir.

---

# 7. Varsayılan Ekranlar — Auth Katmanı

Auth katmanı, kullanıcı kimlik doğrulama ve hesap yönetiminin giriş noktalarını içerir. Bu ekranlar authenticated olmayan kullanıcının uygulamaya giriş yapmasını, kayıt olmasını, şifresini sıfırlamasını ve e-posta/telefon doğrulamasını tamamlamasını sağlar.

Bu katmandaki ekranlar system katmanından sonra, onboarding ve main app katmanlarından önce inşa edilmelidir. Çünkü:
- Ana uygulama ekranları auth guard arkasındadır ve auth olmadan test edilemez.
- Onboarding akışı yalnızca kayıt sonrası tetiklenir.
- Error boundary ve loading state'ler zaten system katmanında mevcuttur.

---

## S08. Login Screen

- **Platform:** Her ikisi (mobile + web)
- **Açıklama:** Mevcut hesabı olan kullanıcının e-posta (veya kullanıcı adı) ve şifre ile oturum açtığı ekrandır. Bu ekran uygulamanın birincil giriş noktasıdır; unauthenticated kullanıcılar her zaman bu ekrana yönlendirilir (onboarding tamamlanmışsa ve biometric giriş aktif değilse). Login formu React Hook Form 7.x ile yönetilir, validasyon Zod 4.x ile yapılır. Başarılı login sonrası token expo-secure-store'a (mobile) veya httpOnly cookie'ye (web) yazılır, Zustand auth store güncellenir ve kullanıcı ana ekrana yönlendirilir. Hatalı giriş durumunda inline error message gösterilir. Login ekranı ayrıca "Şifremi Unuttum" linki, "Kayıt Ol" linki ve opsiyonel olarak social login butonları (Google, Apple Sign-In) içerir. Mobile'da biometric login aktifse (daha önce etkinleştirildiyse) login ekranında biometric prompt otomatik tetiklenebilir.

- **Kullanılan kütüphaneler:**
  - `React Hook Form 7.x` — form state management
  - `Zod 4.x` — form validasyonu (email format, password min uzunluk)
  - `Zustand 5.x` — auth state güncelleme (isAuthenticated, user)
  - `TanStack Query` — login mutation (useMutation)
  - `expo-secure-store` — token yazma (mobile)
  - `expo-haptics` — hatalı giriş denemesinde hata haptic'i (mobile)
  - `react-native-keyboard-controller` — keyboard avoiding (mobile)
  - `i18next` — çoklu dil metin yönetimi
  - `Tailwind 4.x / NativeWind 5.x` — styling
  - `lucide-react / lucide-react-native` — icon'lar (email, lock, eye/eye-off)
  - `Sentry` — login hata raporlama

- **Bağımlılıklar:**
  - Auth API endpoint (POST /auth/login)
  - Zustand auth store (setToken, setUser, setIsAuthenticated)
  - Navigation config (login sonrası redirect hedefi)
  - Design token'ları (form input, button, error text stilleri)
  - Zod schema: email → z.string().email(), password → z.string().min(8)

- **Apple HIG uyumu:**
  - Apple HIG, login ekranlarının mümkün olduğunca basit tutulmasını, AutoFill desteğini ve biometric login seçeneğini gerektirir.
  - Text input'lar textContentType prop'u ile iOS AutoFill'e hazır olmalıdır (username, password).
  - Keyboard tipi email input için `keyboardType="email-address"`, password için `secureTextEntry=true` olmalıdır.
  - "Şifremi Unuttum" linki kolayca erişilebilir olmalıdır (gizli veya küçük bırakılmamalı).
  - Apple Sign-In sunuluyorsa, Apple'ın tasarım kurallarına (buton stili, boyutu) uyulmalıdır.
  - Password input'ta show/hide toggle (eye icon) bulunmalıdır.
  - Hit target'lar minimum 44pt olmalıdır.
  - Hata mesajları inline gösterilmelidir (toast yerine), kullanıcı neyin yanlış olduğunu hemen görmelidir.

- **Kabul kriterleri:**
  1. E-posta ve şifre alanları RHF ile kontrol edilir; Zod validasyonu real-time çalışır.
  2. Başarılı login sonrası token güvenli depolanır, auth store güncellenir ve kullanıcı ana ekrana yönlendirilir.
  3. Hatalı giriş denemesinde inline error message gösterilir ve mobile'da hata haptic'i çalışır.
  4. "Şifremi Unuttum" linki S10'a, "Kayıt Ol" linki S09'a yönlendirir.
  5. iOS'ta textContentType ile AutoFill desteği aktiftir.

---

## S09. Register Screen

- **Platform:** Her ikisi (mobile + web)
- **Açıklama:** Yeni kullanıcının hesap oluşturduğu ekrandır. Minimum alanlar: ad, e-posta ve şifre. Opsiyonel alanlar: telefon numarası, kullanıcı adı. Form React Hook Form 7.x ile yönetilir, validasyon Zod 4.x ile yapılır. Şifre gücü göstergesi (password strength indicator) realtime olarak gösterilir. Kayıt başarılı olduğunda kullanıcı S12 (Email Verification / OTP) ekranına yönlendirilir. Backend'den dönen validasyon hataları (email zaten kayıtlı vb.) inline olarak gösterilir. Kayıt ekranı ayrıca "Zaten hesabım var → Giriş Yap" linki ve opsiyonel olarak social sign-up butonları içerir. KVKK/GDPR onayı için checkbox veya link bulunur.

- **Kullanılan kütüphaneler:**
  - `React Hook Form 7.x` — form state management
  - `Zod 4.x` — form validasyonu (email, password strength, name min/max)
  - `Zustand 5.x` — kayıt sonrası auth state
  - `TanStack Query` — register mutation (useMutation)
  - `expo-secure-store` — token yazma (mobile)
  - `react-native-keyboard-controller` — keyboard avoiding (mobile)
  - `expo-haptics` — başarılı kayıt haptic'i (mobile)
  - `i18next` — çoklu dil metin yönetimi
  - `Tailwind 4.x / NativeWind 5.x` — styling
  - `lucide-react / lucide-react-native` — icon'lar
  - `Sentry` — kayıt hata raporlama

- **Bağımlılıklar:**
  - Auth API endpoint (POST /auth/register)
  - Zustand auth store
  - Navigation config (register sonrası → S12 email verification)
  - Design token'ları (form input, button, password strength indicator stilleri)
  - Zod schema: name → z.string().min(2).max(50), email → z.string().email(), password → z.string().min(8) + custom strength check

- **Apple HIG uyumu:**
  - Apple HIG, kayıt formlarının mümkün olduğunca az alan içermesini ve AutoFill desteğini gerektirir.
  - textContentType: name, emailAddress, newPassword gibi değerler doğru atanmalıdır.
  - Password alanı için "Strong Password" AutoFill suggestion desteği bulunmalıdır.
  - Keyboard tipi her alana uygun ayarlanmalıdır (email → email-address, phone → phone-pad).
  - KVKK/GDPR onayı net ve okunabilir olmalıdır; küçük/gizli bırakılmamalıdır.
  - Hit target'lar minimum 44pt olmalıdır.
  - Scroll view ile keyboard alanı yönetilmelidir; input alanları keyboard altında kalmamalıdır.

- **Kabul kriterleri:**
  1. Form RHF ile yönetilir; Zod validasyonu real-time çalışır (field-level ve submit-level).
  2. Şifre gücü göstergesi real-time güncellenir (zayıf, orta, güçlü).
  3. Başarılı kayıt sonrası kullanıcı S12 (Email Verification) ekranına yönlendirilir.
  4. Backend validasyon hataları (email zaten kayıtlı) ilgili alanın altında inline gösterilir.
  5. KVKK/GDPR onay checkbox'ı form submit'i için zorunludur.

---

## S10. Forgot Password Screen

- **Platform:** Her ikisi (mobile + web)
- **Açıklama:** Kullanıcının şifresini unuttuğunda şifre sıfırlama e-postası talep ettiği ekrandır. Tek alan: e-posta adresi. Kullanıcı e-posta adresini girer ve submit eder. Backend başarıyla işleme aldığında (e-posta adresi kayıtlı olsun ya da olmasın — güvenlik gereği aynı yanıt döner) "E-posta gönderildi" onay mesajı gösterilir ve kullanıcı opsiyonel olarak login ekranına geri dönebilir. Bu ekran güvenlik açısından e-posta adresinin kayıtlı olup olmadığını ifşa etmez.

- **Kullanılan kütüphaneler:**
  - `React Hook Form 7.x` — form state management
  - `Zod 4.x` — email validasyonu
  - `TanStack Query` — forgot password mutation (useMutation)
  - `react-native-keyboard-controller` — keyboard avoiding (mobile)
  - `i18next` — çoklu dil metin yönetimi
  - `Tailwind 4.x / NativeWind 5.x` — styling
  - `lucide-react / lucide-react-native` — email icon, success icon

- **Bağımlılıklar:**
  - Auth API endpoint (POST /auth/forgot-password)
  - Navigation config (login'e geri dönüş)
  - Design token'ları

- **Apple HIG uyumu:**
  - Apple HIG, tek amaçlı ekranların sade ve odaklı olmasını gerektirir.
  - E-posta input'u textContentType="emailAddress" ile AutoFill'e hazır olmalıdır.
  - Submit sonrası success state açıkça gösterilmelidir (toast yerine inline onay).
  - Geri dönüş yolu (login ekranı) açıkça erişilebilir olmalıdır.

- **Kabul kriterleri:**
  1. E-posta alanı Zod ile validate edilir (email format).
  2. Submit sonrası backend'den bağımsız olarak "E-posta gönderildi" mesajı gösterilir (güvenlik gereği).
  3. Loading state submit butonu üzerinde gösterilir (disable + spinner).
  4. "Giriş ekranına dön" linki sunar.
  5. E-posta adresinin kayıtlı olup olmadığı bilgisi kullanıcıya ifşa edilmez.

---

## S11. Reset Password Screen (Deep Link)

- **Platform:** Her ikisi (mobile + web)
- **Açıklama:** Kullanıcının forgot password e-postasındaki link'e tıkladığında açılan ekrandır. Deep link veya web URL içinde token/code bilgisi bulunur. Kullanıcı yeni şifresini ve şifre onayını girer. Validasyon: yeni şifre minimum 8 karakter, password strength check, şifre onayı eşleşmesi. Başarılı sıfırlama sonrası kullanıcı login ekranına yönlendirilir ve "Şifreniz başarıyla değiştirildi" mesajı gösterilir. Token geçersiz veya süresi dolmuşsa özel hata mesajı gösterilir ve yeni şifre sıfırlama talebi için S10'a yönlendirme yapılır.

- **Kullanılan kütüphaneler:**
  - `React Hook Form 7.x` — form state management
  - `Zod 4.x` — password validasyonu (min length, strength, match)
  - `TanStack Query` — reset password mutation (useMutation)
  - `expo-linking` — deep link'ten token/code parse etme (mobile)
  - `React Router 7.x` — URL'den token parse etme (web)
  - `React Navigation 7.x` — deep link handling (mobile)
  - `react-native-keyboard-controller` — keyboard avoiding (mobile)
  - `i18next` — çoklu dil metin yönetimi
  - `Tailwind 4.x / NativeWind 5.x` — styling

- **Bağımlılıklar:**
  - Auth API endpoint (POST /auth/reset-password) — body: token + newPassword
  - Deep link konfigürasyonu (expo-linking + React Navigation linking config)
  - Web route konfigürasyonu (React Router: /auth/reset-password?token=xxx)
  - Navigation config (başarılı sıfırlama sonrası → login)
  - Design token'ları

- **Apple HIG uyumu:**
  - Apple HIG, deep link ile açılan ekranların bağlamı kaybettirmemesini, kullanıcının nerede olduğunu anlamasını gerektirir.
  - Password alanları textContentType="newPassword" ile AutoFill'e hazır olmalıdır.
  - Şifre gücü göstergesi kayıt ekranıyla tutarlı olmalıdır.
  - Token süresi dolmuşsa açık hata mesajı ve alternatif yol ("Yeni link iste") gösterilmelidir.

- **Kabul kriterleri:**
  1. Deep link veya URL'den token doğru şekilde parse edilir.
  2. Yeni şifre ve şifre onayı Zod ile validate edilir (min length, match).
  3. Token geçersizse veya süresi dolmuşsa anlaşılır hata mesajı ve S10'a yönlendirme sunulur.
  4. Başarılı sıfırlama sonrası login ekranına yönlendirilir ve success mesajı gösterilir.
  5. Şifre gücü göstergesi real-time güncellenir.

---

## S12. Email Verification / OTP Screen

- **Platform:** Her ikisi (mobile + web)
- **Açıklama:** Kayıt sonrası veya hassas işlem onayı için kullanıcının e-posta adresine gönderilen doğrulama kodunu (OTP — One-Time Password) girdiği ekrandır. Genellikle 6 haneli sayısal kod. OTP input'u pin-style ayrı kutucuklarda gösterilir (her hane ayrı input kutusu). Otomatik ilerleme: bir hane girildiğinde fokus otomatik sonraki kutuya geçer. Clipboard'dan yapıştırma desteği: kullanıcı kodu kopyaladığında tek seferde yapıştırabilir. Geri sayım timer: "Yeni kod gönder" seçeneği belirli bir süre (ör: 60 saniye) sonra aktif olur. Yanlış kod girildiğinde inline hata mesajı gösterilir ve mobile'da hata haptic'i çalışır. Doğrulama başarılı olduğunda onboarding akışına (S14) veya ana ekrana yönlendirilir.

- **Kullanılan kütüphaneler:**
  - `React Hook Form 7.x` — OTP form state
  - `Zod 4.x` — OTP validasyonu (6 haneli sayısal)
  - `TanStack Query` — verify mutation, resend mutation
  - `expo-clipboard` — OTP yapıştırma desteği (mobile)
  - `expo-haptics` — başarı/hata haptic feedback (mobile)
  - `react-native-keyboard-controller` — keyboard management (mobile)
  - `i18next` — çoklu dil metin yönetimi
  - `Tailwind 4.x / NativeWind 5.x` — styling

- **Bağımlılıklar:**
  - Auth API endpoint (POST /auth/verify-email) — body: code
  - Auth API endpoint (POST /auth/resend-verification) — yeni kod gönderme
  - Navigation config (doğrulama sonrası → onboarding veya home)
  - Design token'ları (OTP input kutuları, timer, error text)

- **Apple HIG uyumu:**
  - Apple HIG, OTP input'ların textContentType="oneTimeCode" ile iOS SMS AutoFill'e hazır olmasını gerektirir.
  - Kutucuk başına bir karakter girişi ve otomatik fokus ilerlemesi standart iOS davranışıdır.
  - Clipboard yapıştırma desteği (iOS paste button) bulunmalıdır.
  - Geri sayım timer'ı açıkça görünür olmalıdır; "Yeni kod gönder" butonu timer bitene kadar devre dışı bırakılmalıdır.
  - Hit target'lar minimum 44pt olmalıdır.
  - Keyboard tipi numeric-pad olmalıdır.

- **Kabul kriterleri:**
  1. 6 haneli OTP ayrı kutucuklarda girilir, otomatik fokus ilerlemesi çalışır.
  2. Clipboard'dan yapıştırma desteği ile kod tek seferde girilebilir.
  3. iOS'ta textContentType="oneTimeCode" ile SMS AutoFill aktiftir.
  4. "Yeni kod gönder" butonu geri sayım timer'ı bitene kadar devre dışıdır.
  5. Doğrulama başarılı olduğunda uygun ekrana (onboarding veya home) yönlendirilir.

---

## S13. Biometric Prompt Screen

- **Platform:** Mobile
- **Açıklama:** Kullanıcının Face ID, Touch ID veya Android fingerprint ile oturum açmasını veya hassas bir işlemi onaylamasını sağlayan ekrandır. İki kullanım senaryosu vardır: (1) Daha önce biometric login'i etkinleştirmiş kullanıcının app açılışında biometric ile hızlı giriş yapması. (2) Hassas işlemler (ödeme onayı, hesap silme, şifre değiştirme) öncesi biometric doğrulama. Bu ekran, expo-local-authentication API'si ile native biometric prompt'u tetikler. Biometric başarısız olursa veya cihazda biometric yoksa password fallback (login ekranı) sunulur. Biometric enrollment durumu cihaz bazında kontrol edilir; biometric kayıtlı değilse bu ekran gösterilmez.

- **Kullanılan kütüphaneler:**
  - `expo-local-authentication` — biometric auth prompt
  - `expo-secure-store` — biometric auth token okuma
  - `expo-haptics` — başarı/hata haptic feedback
  - `Zustand 5.x` — auth state güncelleme
  - `react-native-reanimated` — prompt animasyonu
  - `i18next` — çoklu dil metin yönetimi
  - `NativeWind 5.x` — styling

- **Bağımlılıklar:**
  - expo-local-authentication'ın cihazda biometric yetenek kontrolü (hasHardwareAsync, isEnrolledAsync)
  - expo-secure-store'da saklanan biometric auth token
  - Zustand auth store (biometric başarılı olduğunda isAuthenticated = true)
  - Settings ekranında (S20) biometric login on/off toggle ile entegrasyon
  - App açılış akışında biometric kontrolü (auth store'da biometricEnabled flag)

- **Apple HIG uyumu:**
  - Apple HIG, Face ID ve Touch ID kullanımının nedenini Info.plist'te NSFaceIDUsageDescription ile açıkça belirtmeyi zorunlu kılar.
  - Biometric prompt'un iOS system dialog'u olması gerekir; custom biometric UI Apple tarafından reddedilir.
  - Biometric başarısız olduğunda (üç deneme sonrası) fallback seçeneği (şifre ile giriş) sunulmalıdır.
  - Biometric tercihi kullanıcının kontrolünde olmalıdır; settings'ten açılıp kapatılabilmelidir.
  - Apple, biometric'i "convenience feature" olarak konumlandırır; zorunlu tek giriş yöntemi olmamalıdır.

- **Kabul kriterleri:**
  1. Cihazda biometric hardware ve enrollment varsa ve kullanıcı daha önce biometric'i etkinleştirmişse, app açılışında biometric prompt gösterilir.
  2. Biometric başarılı olduğunda kullanıcı doğrudan ana ekrana yönlendirilir.
  3. Biometric başarısız olduğunda "Şifre ile giriş yap" fallback butonu sunulur.
  4. Cihazda biometric yoksa bu ekran atlanır ve normal login gösterilir.
  5. Info.plist'te NSFaceIDUsageDescription doğru yapılandırılmıştır.

---

# 8. Varsayılan Ekranlar — Onboarding Katmanı

Onboarding katmanı, yeni kayıt olan veya ilk kez uygulamayı açan kullanıcıyı ürüne tanıtan, gerekli izinleri toplayan ve profil başlangıç kurulumunu yaptıran ekranları içerir. Bu katman yalnızca kullanıcının ilk deneyiminde gösterilir; tamamlandığında bir daha gösterilmez (AsyncStorage'da onboarding completion flag saklanır).

Bu katmandaki ekranlar auth katmanından sonra, main app shell'den önce inşa edilmelidir. Çünkü:
- Onboarding, kullanıcı kayıt olduktan hemen sonra başlar.
- İzin toplama (notification, konum) ana uygulama özelliklerinin düzgün çalışması için gereklidir.
- Profil kurulumu bazı ana ekranların (home, profile) anlamlı içerik göstermesi için gereklidir.

---

## S14. Welcome Slides

- **Platform:** Mobile
- **Açıklama:** Uygulamanın değer önerisini, temel özelliklerini ve farkını 3-5 slide ile tanıtan onboarding carousel'idir. Her slide bir başlık, bir açıklama ve bir görsel/illüstrasyon içerir. Kullanıcı swipe ile veya "İleri" butonuyla slide'lar arasında ilerler. Son slide'da "Başla" butonu bulunur. Pagination indicator (dot indicator) ile kullanıcı hangi adımda olduğunu görür. Opsiyonel olarak "Atla" butonu ile onboarding kısa devrelenerek ana akışa geçilebilir. Bu ekran yalnızca ilk açılışta gösterilir; AsyncStorage'da `onboardingCompleted` flag'i true olduğunda atlanır.

- **Kullanılan kütüphaneler:**
  - `react-native-reanimated` — slide geçiş animasyonları, parallax efektleri
  - `react-native-gesture-handler` — swipe gesture
  - `expo-image` — slide görselleri/illüstrasyonlar
  - `@react-native-async-storage/async-storage` — onboarding completion flag
  - `react-native-safe-area-context` — safe area uyumu
  - `i18next` — çoklu dil metin yönetimi
  - `NativeWind 5.x` — styling
  - `lucide-react-native` — navigation icon'ları

- **Bağımlılıklar:**
  - Onboarding slide içerikleri (başlık, açıklama, görsel) — i18n key'leri ile
  - AsyncStorage'da `onboardingCompleted` flag kontrolü
  - Navigation config (onboarding tamamlandığında → S15 Permission Primer veya home)
  - Design token'ları (pagination dot, button, typography)

- **Apple HIG uyumu:**
  - Apple HIG, onboarding'in kısa ve odaklı olmasını, gereksiz slide'larla kullanıcıyı sıkmamayı gerektirir.
  - "Atla" seçeneği her zaman erişilebilir olmalıdır; kullanıcı onboarding'i zorla izletilmemelidir.
  - Slide geçiş animasyonları native-feeling olmalıdır (spring physics, 60fps).
  - Pagination indicator standart iOS dot indicator pattern'ına uygun olmalıdır.
  - Son slide'daki "Başla" butonu birincil aksiyon olarak vurgulanmalıdır.
  - Content safe area içinde kalmalıdır; notch/Dynamic Island alanına taşmamalıdır.

- **Kabul kriterleri:**
  1. 3-5 slide ile uygulama değer önerisi anlatılır; her slide başlık, açıklama ve görsel içerir.
  2. Swipe gesture ve "İleri" butonu ile slide'lar arasında navigasyon sağlanır.
  3. "Atla" butonu ile onboarding kısa devrelenebilir.
  4. Pagination dot indicator mevcut slide'ı gösterir.
  5. Onboarding tamamlandığında AsyncStorage'a flag yazılır ve bir daha gösterilmez.

---

## S15. Permission Primer Screen

- **Platform:** Mobile
- **Açıklama:** Sistem izinleri (push notification, konum, kamera vb.) istenmeden önce kullanıcıya neden bu iznin gerekli olduğunu açıklayan pre-prompt ekranıdır. Apple HIG ve modern UX pratikleri, sistem izin dialog'unun doğrudan gösterilmesi yerine önce bir "primer" ekranı ile bağlam verilmesini şiddetle önerir. Çünkü kullanıcı iOS sistem dialog'unda "Reddet" derse, ayarlardan manuel olarak açması gerekir; bu çok kötü bir deneyimdir. Bu ekran her izin için ayrı primer gösterebilir veya gerekli izinleri sıralı olarak tek akışta sunabilir. Her primer: izin ikonu, neden gerekli olduğunun açıklaması, "İzin Ver" (sistem dialog'u tetikler) ve "Şimdi Değil" (atlar) butonlarından oluşur.

- **Kullanılan kütüphaneler:**
  - `expo-notifications` — push notification izni
  - `expo-location` — konum izni
  - `expo-camera` — kamera izni
  - `expo-image-picker` — galeri erişim izni
  - `react-native-reanimated` — geçiş animasyonları
  - `react-native-safe-area-context` — safe area uyumu
  - `@react-native-async-storage/async-storage` — izin primer gösterildi flag'leri
  - `i18next` — çoklu dil metin yönetimi
  - `NativeWind 5.x` — styling
  - `lucide-react-native` — izin icon'ları (bell, map-pin, camera)

- **Bağımlılıklar:**
  - Her izin türü için primer içeriği (icon, başlık, açıklama) — i18n key'leri ile
  - AsyncStorage'da her izin için `permissionPrimerShown_[type]` flag'i
  - Navigation config (primer tamamlandığında → S16 Profile Setup veya home)
  - Design token'ları

- **Apple HIG uyumu:**
  - Apple HIG, sistem izni dialog'unu bağlamsız göstermemeyi açıkça önerir (https://developer.apple.com/design/human-interface-guidelines/privacy#Requesting-permission).
  - Pre-permission primer, kullanıcıya sistem dialog'unda "İzin Ver" deme motivasyonu verir.
  - Primer ekranında "Şimdi Değil" seçeneği zorunludur; kullanıcı izin vermeye zorlanmamalıdır.
  - "Şimdi Değil" seçildiğinde sistem dialog'u gösterilmez; kullanıcı daha sonra ayarlardan veya ilgili feature'ı ilk kullandığında tekrar sorulabilir.
  - İzin açıklamaları jargonsuz, anlaşılır ve dürüst olmalıdır.

- **Kabul kriterleri:**
  1. Her izin türü için primer ekranı gösterilir (push notification, konum vb.).
  2. "İzin Ver" butonuna basıldığında iOS sistem izin dialog'u tetiklenir.
  3. "Şimdi Değil" butonuna basıldığında sistem dialog'u gösterilmez ve sonraki primer'a veya ana akışa geçilir.
  4. Primer daha önce gösterildiyse (AsyncStorage flag) tekrar gösterilmez.
  5. İzin açıklamaları i18n desteklidir ve anlaşılır dilde yazılmıştır.

---

## S16. Profile Setup Screen

- **Platform:** Her ikisi (mobile + web)
- **Açıklama:** Yeni kayıt olan kullanıcının temel profil bilgilerini tamamladığı ekrandır. Minimum alanlar: profil fotoğrafı (opsiyonel), display name ve opsiyonel olarak biyografi veya ilgi alanları. Bu ekran zorunlu değildir ama önerilir; kullanıcı "Atla" ile geçebilir. Profil fotoğrafı seçimi için expo-image-picker kullanılır (galeri veya kamera). Form React Hook Form 7.x ile yönetilir. Profil bilgisi backend'e kaydedilir ve Zustand user store güncellenir. Bu ekran onboarding akışının son adımıdır; tamamlandığında kullanıcı ana ekrana yönlendirilir.

- **Kullanılan kütüphaneler:**
  - `React Hook Form 7.x` — form state management
  - `Zod 4.x` — form validasyonu (display name length, bio max character)
  - `TanStack Query` — profile update mutation
  - `expo-image-picker` — profil fotoğrafı seçimi (mobile)
  - `expo-image` — profil fotoğrafı önizleme
  - `Zustand 5.x` — user store güncelleme
  - `react-native-keyboard-controller` — keyboard avoiding (mobile)
  - `i18next` — çoklu dil metin yönetimi
  - `Tailwind 4.x / NativeWind 5.x` — styling
  - `lucide-react / lucide-react-native` — icon'lar (camera, user, edit)

- **Bağımlılıklar:**
  - User API endpoint (PUT /user/profile)
  - Image upload API endpoint (multipart/form-data)
  - Zustand user store (setProfile, setAvatar)
  - Navigation config (profil tamamlandığında → home)
  - Design token'ları (avatar placeholder, form input stilleri)

- **Apple HIG uyumu:**
  - Apple HIG, kullanıcıyı gereksiz bilgi girmeye zorlamamayı ve her adımda "atla" seçeneği sunmayı gerektirir.
  - Profil fotoğrafı seçimi için native image picker (PHPicker) kullanılmalıdır.
  - Avatar placeholder varsayılan bir silüet veya baş harf göstermelidir.
  - Form alanları makul varsayılanlarla önceden doldurulabilir (kayıt sırasında girilen ad vb.).
  - Keyboard alanı düzgün yönetilmelidir.

- **Kabul kriterleri:**
  1. Profil fotoğrafı galeri veya kameradan seçilebilir; seçim yapılmazsa varsayılan avatar gösterilir.
  2. Display name RHF + Zod ile validate edilir.
  3. "Atla" butonu ile profil kurulumu geçilebilir.
  4. Profil bilgisi backend'e kaydedilir ve user store güncellenir.
  5. Tamamlandığında kullanıcı ana ekrana yönlendirilir ve onboarding flag güncellenir.

---

# 9. Varsayılan Ekranlar — Main App Shell

Main app shell katmanı, authenticated kullanıcının günlük olarak etkileşimde olduğu ana uygulama ekranlarını içerir. Bu ekranlar tab navigation (mobile) veya sidebar/top navigation (web) ile organize edilir. Auth guard arkasındadır; yalnızca authenticated kullanıcılar erişebilir.

Bu katmandaki ekranlar system, auth ve onboarding katmanlarından sonra inşa edilmelidir. Çünkü:
- Auth guard mevcuttur ve auth store'a bağımlıdır.
- Profile bilgisi onboarding'de toplanmıştır.
- Error boundary, loading state ve offline handling system katmanında mevcuttur.

---

## S17. Home / Dashboard

- **Platform:** Her ikisi (mobile + web)
- **Açıklama:** Authenticated kullanıcının uygulamayı açtığında gördüğü ana ekrandır. Bu ekran uygulamanın birincil değer önerisini sunar ve diğer ekranlara giriş noktası görevi görür. Boilerplate seviyesinde bu ekran bir "kabuk" olarak inşa edilir; gerçek içerik ürüne göre doldurulur. Varsayılan olarak: hoş geldin mesajı (kullanıcı adıyla), hızlı erişim kartları (quick actions) ve son aktivite özeti içerir. Veri TanStack Query ile çekilir; pull-to-refresh (mobile) destekler. Section-level loading state'ler kullanılır (tam ekran loading değil). Bu ekran tab navigation'ın ilk tab'ıdır (mobile) veya ana route'tur (web).

- **Kullanılan kütüphaneler:**
  - `TanStack Query` — dashboard verisi çekme (useQuery)
  - `Zustand 5.x` — user store'dan kullanıcı bilgisi
  - `react-native-reanimated` — pull-to-refresh ve kart animasyonları (mobile)
  - `react-native-gesture-handler` — pull-to-refresh gesture (mobile)
  - `react-native-safe-area-context` — safe area uyumu (mobile)
  - `expo-status-bar` — status bar kontrolü (mobile)
  - `i18next` — çoklu dil metin yönetimi, tarih formatı
  - `date-fns` — tarih formatlama (son aktivite zamanları)
  - `Tailwind 4.x / NativeWind 5.x` — styling
  - `lucide-react / lucide-react-native` — quick action icon'ları

- **Bağımlılıklar:**
  - Dashboard API endpoint (GET /dashboard)
  - Zustand user store (kullanıcı adı, avatar)
  - Tab navigation config (ilk tab olarak tanımlanmış)
  - Design token'ları (card, section heading, greeting text stilleri)

- **Apple HIG uyumu:**
  - Apple HIG, ana ekranın hızlı yüklenmesini ve kullanıcının birincil görevini desteklemesini gerektirir.
  - Pull-to-refresh iOS'ta UIRefreshControl davranışını taklit etmelidir (spinner + elastic bounce).
  - Tab bar'da ilk tab olarak "Home" veya uygun isimlendirme yapılmalıdır.
  - Large title navigation bar desteği opsiyoneldir ama iOS-native hissi artırır.
  - Section-level loading state'ler skeleton veya shimmer placeholder ile gösterilmelidir (spinner yerine).
  - Safe area ve status bar uyumu tam olmalıdır.

- **Kabul kriterleri:**
  1. Ekran açıldığında kullanıcıya kişiselleştirilmiş hoş geldin mesajı gösterilir.
  2. Dashboard verisi TanStack Query ile çekilir; section-level skeleton loading gösterilir.
  3. Pull-to-refresh (mobile) ile veri yenilenebilir.
  4. Quick action kartları ilgili ekranlara navigasyon sağlar.
  5. Auth guard arkasındadır; unauthenticated kullanıcı login'e yönlendirilir.

---

## S18. Profile Screen

- **Platform:** Her ikisi (mobile + web)
- **Açıklama:** Kullanıcının kendi profil bilgilerini görüntülediği read-only ekrandır. Profil fotoğrafı, display name, e-posta, biyografi ve hesap bilgileri (kayıt tarihi, hesap türü vb.) gösterilir. "Profili Düzenle" butonu S19'a yönlendirir. Bu ekran yalnızca görüntüleme amaçlıdır; düzenleme S19'da yapılır. Profil bilgisi Zustand user store'dan ve opsiyonel olarak TanStack Query ile backend'den çekilir (store ve backend senkronizasyonu).

- **Kullanılan kütüphaneler:**
  - `TanStack Query` — profil verisi çekme (useQuery) ve cache
  - `Zustand 5.x` — user store'dan hızlı erişim
  - `expo-image` — profil fotoğrafı gösterimi (mobile)
  - `date-fns` — tarih formatlama (kayıt tarihi)
  - `i18next` — çoklu dil metin yönetimi
  - `react-native-safe-area-context` — safe area uyumu (mobile)
  - `Tailwind 4.x / NativeWind 5.x` — styling
  - `lucide-react / lucide-react-native` — icon'lar (edit, mail, calendar)

- **Bağımlılıklar:**
  - User API endpoint (GET /user/profile)
  - Zustand user store
  - Navigation config (S19 Edit Profile'a yönlendirme)
  - Design token'ları (avatar, info section, typography stilleri)

- **Apple HIG uyumu:**
  - Apple HIG, profil ekranlarının sade ve organize olmasını gerektirir.
  - Profil fotoğrafı dairesel crop ile gösterilmelidir (iOS convention).
  - Bilgiler grouped section layout'ta organize edilmelidir (iOS Settings benzeri).
  - "Profili Düzenle" butonu erişilebilir konumda olmalıdır (navigation bar veya prominent button).
  - Read-only alanlar edit etmeye çalışan gesture'a karşı korumalı olmalıdır.

- **Kabul kriterleri:**
  1. Profil bilgileri (fotoğraf, ad, e-posta, biyografi) doğru şekilde gösterilir.
  2. "Profili Düzenle" butonu S19'a yönlendirir.
  3. Profil verisi TanStack Query ile cache'lenir ve stale data durumunda otomatik refetch yapılır.
  4. Profil fotoğrafı yoksa varsayılan avatar placeholder gösterilir.
  5. Auth guard arkasındadır.

---

## S19. Edit Profile Screen

- **Platform:** Her ikisi (mobile + web)
- **Açıklama:** Kullanıcının profil bilgilerini düzenlediği form ekranıdır. Düzenlenebilir alanlar: profil fotoğrafı, display name, biyografi. E-posta değişikliği ayrı bir doğrulama akışı gerektirebilir ve bu ekranda doğrudan yapılmayabilir (güvenlik gereği). Form React Hook Form 7.x ile yönetilir, Zod 4.x ile validate edilir. Mevcut profil bilgisi form'un default values'una yüklenir. Kaydet butonu ile backend'e gönderilir, başarılı olduğunda profil ekranına (S18) geri dönülür ve success toast gösterilir. Unsaved changes varken geri gitmeye çalışıldığında onay dialog'u gösterilir.

- **Kullanılan kütüphaneler:**
  - `React Hook Form 7.x` — form state management
  - `Zod 4.x` — form validasyonu
  - `TanStack Query` — profile update mutation (useMutation) + cache invalidation
  - `Zustand 5.x` — user store güncelleme
  - `expo-image-picker` — profil fotoğrafı değiştirme (mobile)
  - `expo-image` — fotoğraf önizleme
  - `expo-haptics` — başarılı kaydetme haptic'i (mobile)
  - `react-native-keyboard-controller` — keyboard avoiding (mobile)
  - `sonner` — success toast (web)
  - `i18next` — çoklu dil metin yönetimi
  - `Tailwind 4.x / NativeWind 5.x` — styling

- **Bağımlılıklar:**
  - User API endpoint (PUT /user/profile)
  - Image upload API endpoint
  - Zustand user store
  - Navigation config (kaydet sonrası → S18 geri dönüş)
  - Design token'ları

- **Apple HIG uyumu:**
  - Apple HIG, edit ekranlarının navigation bar'da "Cancel" ve "Save" (veya "Done") butonları içermesini gerektirir.
  - Unsaved changes varken geri gitmeye çalışıldığında UIAlertController ile onay sorulmalıdır ("Değişiklikleri kaydetmeden çıkmak istiyor musunuz?").
  - Form alanları mevcut değerlerle önceden doldurulmalıdır.
  - Kaydetme işlemi sırasında loading state gösterilmelidir (Save butonu disable + spinner).
  - Profil fotoğrafı değiştirme için action sheet (galeri, kamera, kaldır seçenekleri) kullanılmalıdır.

- **Kabul kriterleri:**
  1. Form mevcut profil bilgileriyle önceden doldurulur.
  2. Validasyon real-time çalışır; submit sırasında da kontrol edilir.
  3. Unsaved changes varken geri gitmeye çalışıldığında onay dialog'u gösterilir.
  4. Başarılı kaydetme sonrası TanStack Query cache invalidate edilir ve profil ekranına dönülür.
  5. Profil fotoğrafı galeri, kamera veya kaldır seçenekleriyle değiştirilebilir.

---

## S20. Settings Screen

- **Platform:** Her ikisi (mobile + web)
- **Açıklama:** Uygulama ayarlarının tek noktadan yönetildiği ana ayarlar ekranıdır. iOS Settings uygulamasının yapısını referans alır: grouped section layout ile kategorize edilmiş ayar öğeleri. Her öğe ya toggle (in-place değişiklik), ya navigation (alt ekrana yönlendirme) ya da destructive action (modal onay gerektiren) türündedir. Varsayılan bölümler: Hesap (profil, şifre değiştir, e-posta değiştir), Bildirimler (S21'e yönlendirir), Güvenlik (biometric toggle, oturum yönetimi), Görünüm (tema: açık/koyu/sistem, dil), Hakkında (S24'e yönlendirir) ve Tehlikeli Bölge (hesap silme, çıkış yap).

- **Kullanılan kütüphaneler:**
  - `Zustand 5.x` — theme, language ve biometric preference state
  - `@react-native-async-storage/async-storage` — theme ve language tercihi persistance
  - `expo-haptics` — toggle değiştirme haptic'i (mobile)
  - `i18next` — çoklu dil metin yönetimi + dil değiştirme
  - `react-native-safe-area-context` — safe area uyumu (mobile)
  - `Tailwind 4.x / NativeWind 5.x` — styling
  - `lucide-react / lucide-react-native` — section ve item icon'ları

- **Bağımlılıklar:**
  - Theme state (Zustand store + AsyncStorage persist)
  - Language state (i18next changeLanguage + AsyncStorage persist)
  - Biometric state (expo-local-authentication + Zustand)
  - Navigation config (alt ekranlara yönlendirme: S21, S22, S23, S24)
  - Auth store (logout action)
  - Design token'ları (grouped section, list item, toggle, destructive button stilleri)

- **Apple HIG uyumu:**
  - Apple HIG, settings ekranının iOS Settings uygulamasının grouped table view yapısını takip etmesini önerir.
  - Toggle'lar UISwitch stilinde olmalıdır.
  - Navigation item'ları sağ tarafta disclosure indicator (chevron >) göstermelidir.
  - Destructive action'lar (hesap silme, çıkış) kırmızı metin veya ayrı destructive section'da olmalıdır.
  - Tema değişikliği anlık uygulanmalıdır (kaydet butonu olmadan).
  - Dil değişikliği anlık uygulanmalıdır.

- **Kabul kriterleri:**
  1. Ayarlar grouped section layout'ta organize edilmiştir (iOS Settings benzeri).
  2. Tema değişikliği (açık/koyu/sistem) anlık uygulanır.
  3. Dil değişikliği anlık uygulanır (i18next changeLanguage).
  4. Biometric login toggle'ı expo-local-authentication ile entegre çalışır.
  5. "Çıkış Yap" butonu auth store'u temizler ve login ekranına yönlendirir.

---

## S21. Notification Preferences Screen

- **Platform:** Her ikisi (mobile + web)
- **Açıklama:** Kullanıcının hangi bildirim türlerini almak istediğini yönettiği alt ayarlar ekranıdır. Bildirim kategorileri toggle'lar ile açılıp kapatılabilir. Örnek kategoriler: pazarlama bildirimleri, güncelleme bildirimleri, aktivite bildirimleri, güvenlik bildirimleri. Her kategori bir toggle ve kısa açıklama içerir. Push notification izni henüz verilmemişse ekranın üstünde banner ile uyarı gösterilir ve ayarlar'a yönlendirme yapılır. Tercihler backend'e kaydedilir (TanStack Query mutation).

- **Kullanılan kütüphaneler:**
  - `TanStack Query` — bildirim tercihlerini çekme (useQuery) ve güncelleme (useMutation)
  - `expo-notifications` — push notification izin durumu kontrolü (mobile)
  - `expo-haptics` — toggle haptic feedback (mobile)
  - `expo-linking` — sistem ayarlarına yönlendirme (izin verilmemişse) (mobile)
  - `i18next` — çoklu dil metin yönetimi
  - `Tailwind 4.x / NativeWind 5.x` — styling
  - `lucide-react / lucide-react-native` — icon'lar (bell, bell-off)

- **Bağımlılıklar:**
  - Notification preferences API endpoint (GET + PUT /user/notification-preferences)
  - expo-notifications permission status check
  - Navigation config (settings'ten gelme, settings'e dönme)
  - Design token'ları

- **Apple HIG uyumu:**
  - Apple HIG, kullanıcıya bildirim tercihleri üzerinde tam kontrol verilmesini gerektirir.
  - Push notification izni yoksa net uyarı ve sistem ayarlarına yönlendirme sunulmalıdır.
  - Toggle'lar UISwitch stilinde olmalıdır.
  - Her bildirim kategorisinin ne yaptığı kısa açıklama ile belirtilmelidir.

- **Kabul kriterleri:**
  1. Bildirim kategorileri toggle'lar ile yönetilebilir.
  2. Tercih değişikliği backend'e kaydedilir (debounce ile veya değişiklik anında).
  3. Push notification izni yoksa banner uyarı gösterilir.
  4. Her kategori için kısa açıklama metni bulunur.
  5. i18n desteklidir.

---

## S22. Change Password Screen

- **Platform:** Her ikisi (mobile + web)
- **Açıklama:** Authenticated kullanıcının mevcut şifresini değiştirdiği ekrandır. Üç alan: mevcut şifre, yeni şifre, yeni şifre onayı. Mevcut şifre doğrulama için backend'e gönderilir. Yeni şifre ve onayı Zod ile validate edilir (min 8 karakter, password strength, eşleşme). Başarılı değişiklik sonrası success mesajı gösterilir ve settings ekranına dönülür. Opsiyonel olarak tüm aktif oturumları sonlandırma seçeneği sunulabilir. Biometric prompt ile öncesinde kimlik doğrulama yapılabilir (hassas işlem güvenliği).

- **Kullanılan kütüphaneler:**
  - `React Hook Form 7.x` — form state management
  - `Zod 4.x` — password validasyonu (current password required, new password strength, match)
  - `TanStack Query` — change password mutation
  - `expo-local-authentication` — opsiyonel biometric doğrulama (hassas işlem)
  - `expo-haptics` — başarı haptic'i (mobile)
  - `react-native-keyboard-controller` — keyboard avoiding (mobile)
  - `sonner` — success toast (web)
  - `i18next` — çoklu dil metin yönetimi
  - `Tailwind 4.x / NativeWind 5.x` — styling

- **Bağımlılıklar:**
  - Auth API endpoint (PUT /auth/change-password) — body: currentPassword + newPassword
  - Navigation config (başarılı → settings'e dönüş)
  - Design token'ları

- **Apple HIG uyumu:**
  - Apple HIG, şifre değiştirme gibi hassas işlemlerde mevcut kimlik doğrulamasını gerektirir.
  - textContentType: currentPassword (mevcut şifre), newPassword (yeni şifre).
  - Password AutoFill ve strong password suggestion aktif olmalıdır.
  - Başarılı değişiklik onay mesajı açıkça gösterilmelidir.

- **Kabul kriterleri:**
  1. Mevcut şifre, yeni şifre ve onay alanları RHF ile yönetilir.
  2. Zod ile validasyon: mevcut şifre zorunlu, yeni şifre min 8 karakter + strength, onay eşleşmesi.
  3. Başarılı değişiklik sonrası settings ekranına dönülür ve success mesajı gösterilir.
  4. Backend validasyon hataları (mevcut şifre yanlış) inline gösterilir.
  5. Şifre gücü göstergesi real-time güncellenir.

---

## S23. Delete Account Screen

- **Platform:** Her ikisi (mobile + web)
- **Açıklama:** Kullanıcının hesabını kalıcı olarak silmesini sağlayan ekrandır. Bu ekran kasıtlı olarak "zor" yapılmalıdır: accidental deletion riski minimize edilmelidir. Akış: (1) Kullanıcı hesap silme nedenini seçer (opsiyonel dropdown). (2) Hesap silme sonuçlarının açıkça listelenmesi (veriler silinecek, abonelik iptal edilecek vb.). (3) Onay: kullanıcıdan "HESABIMI SIL" yazmasını istemek veya password re-entry. (4) Final onay dialog'u (destructive action sheet). (5) Hesap silinir, tüm local data temizlenir, login ekranına yönlendirilir. Bu ekran Apple App Store Review Guidelines gereği uygulamada bulunmak zorundadır (hesap silme seçeneği sunulması zorunlu).

- **Kullanılan kütüphaneler:**
  - `React Hook Form 7.x` — onay formu (şifre re-entry veya metin girişi)
  - `Zod 4.x` — onay validasyonu
  - `TanStack Query` — delete account mutation
  - `Zustand 5.x` — auth store temizleme (logout)
  - `expo-secure-store` — stored token temizleme (mobile)
  - `@react-native-async-storage/async-storage` — tüm local data temizleme
  - `expo-haptics` — destructive action haptic'i (heavy impact) (mobile)
  - `expo-local-authentication` — opsiyonel biometric doğrulama
  - `i18next` — çoklu dil metin yönetimi
  - `Tailwind 4.x / NativeWind 5.x` — styling

- **Bağımlılıklar:**
  - Auth API endpoint (DELETE /user/account)
  - Zustand auth store (logout action)
  - Navigation config (silme sonrası → login)
  - Design token'ları (destructive button, warning text stilleri)

- **Apple HIG uyumu:**
  - Apple HIG, destructive action'ların geri alınamaz olduğunun açıkça belirtilmesini ve onay mekanizması sunulmasını gerektirir.
  - Apple App Store Review Guidelines (5.1.1), hesap silme seçeneğinin uygulama içinden erişilebilir olmasını zorunlu kılar.
  - Destructive buton kırmızı renkte olmalı ve destructive action sheet kullanılmalıdır.
  - İşlem geri alınamaz uyarısı büyük ve net olmalıdır.
  - İşlemden önce kimlik doğrulaması (şifre veya biometric) yapılmalıdır.

- **Kabul kriterleri:**
  1. Hesap silme sonuçları açıkça listelenir (veriler silinecek, işlem geri alınamaz vb.).
  2. Onay mekanizması bulunur (şifre re-entry veya "HESABIMI SIL" yazma).
  3. Final onay dialog'u gösterilir (destructive action sheet).
  4. Silme sonrası tüm local data temizlenir ve login ekranına yönlendirilir.
  5. Apple App Store Review Guidelines uyumu sağlanır (hesap silme erişilebilir).

---

## S24. About / Legal Screen

- **Platform:** Her ikisi (mobile + web)
- **Açıklama:** Uygulama hakkında bilgi, yasal metinler ve bağlantıları içeren bilgilendirme ekranıdır. İçerik: app version ve build number (expo-constants), gizlilik politikası linki, kullanım koşulları linki, açık kaynak lisansları linki, destek/iletişim bilgisi ve opsiyonel olarak geliştirici/şirket bilgisi. Linkler in-app browser (WebView) veya external browser ile açılabilir. Bu ekran ayarlar (S20) ekranından erişilir.

- **Kullanılan kütüphaneler:**
  - `expo-constants` — app version, build number
  - `expo-linking` — external URL açma (gizlilik, kullanım koşulları)
  - `i18next` — çoklu dil metin yönetimi
  - `react-native-safe-area-context` — safe area uyumu (mobile)
  - `Tailwind 4.x / NativeWind 5.x` — styling
  - `lucide-react / lucide-react-native` — icon'lar (info, shield, file-text, mail)

- **Bağımlılıklar:**
  - expo-constants'tan app version ve build number
  - Gizlilik politikası, kullanım koşulları ve lisans URL'leri (app config)
  - Navigation config (settings'ten gelme)
  - Design token'ları

- **Apple HIG uyumu:**
  - Apple HIG, about ekranının sade ve bilgilendirici olmasını gerektirir.
  - App version bilgisi görünür olmalıdır.
  - Yasal metinlere erişim kolay ve net olmalıdır.
  - Apple App Store Review Guidelines, gizlilik politikası ve kullanım koşulları link'lerinin uygulama içinden erişilebilir olmasını gerektirir.
  - Grouped section layout (iOS Settings benzeri) kullanılmalıdır.

- **Kabul kriterleri:**
  1. App version ve build number doğru şekilde gösterilir (expo-constants).
  2. Gizlilik politikası ve kullanım koşulları link'leri çalışır.
  3. Açık kaynak lisansları erişilebilir.
  4. Destek/iletişim bilgisi bulunur.
  5. i18n desteklidir.

---

# 10. Varsayılan Ekranlar — Vertical Slice Referans

Vertical slice referans katmanı, ürün ekranlarının nasıl inşa edileceğini gösteren **referans implementasyonlardır**. Bu ekranlar gerçek bir ürün özelliği değildir; canonical stack'ın tüm katmanlarının (data fetching, caching, forms, validation, error handling, loading states, pagination, pull-to-refresh) birlikte nasıl çalıştığını gösteren çalışan örneklerdir.

Bu katman şu amaçla mevcuttur:
- Developer, yeni feature ekranı yazarken "nasıl yapılır?" sorusunu bu referans ekranlara bakarak cevaplayabilir.
- Code review sırasında "bu pattern doğru mu?" sorusu bu referanslara kıyaslanarak değerlendirilebilir.
- Canonical stack'ın gerçekten birlikte çalıştığı ispatlanır.

---

## S25. List Screen (TanStack Query + Infinite Scroll + Pull-to-Refresh)

- **Platform:** Her ikisi (mobile + web)
- **Açıklama:** Paginated veri listesini gösteren referans ekrandır. TanStack Query'nin `useInfiniteQuery` hook'u ile cursor-based veya offset-based pagination destekler. Kullanıcı liste sonuna yaklaştığında otomatik olarak sonraki sayfa yüklenir (infinite scroll). Mobile'da pull-to-refresh ile listenin tamamı yenilenebilir. Her liste öğesi bir kart veya satır olarak render edilir ve tıklandığında S26 (Detail Screen) açılır. Loading state'ler: ilk yükleme → skeleton placeholder, sonraki sayfa yükleme → liste sonunda loading indicator, pull-to-refresh → üstte refresh indicator. Error state'ler: ilk yükleme hatası → section-level error + retry, sonraki sayfa hatası → liste sonunda inline error + retry. Empty state: veri yoksa anlamlı empty state gösterilir.

- **Kullanılan kütüphaneler:**
  - `TanStack Query` — useInfiniteQuery (pagination), cache, background refetch
  - `react-native-reanimated` — pull-to-refresh animasyonu (mobile)
  - `react-native-gesture-handler` — pull-to-refresh gesture (mobile)
  - `expo-image` — liste öğelerinde varsa görsel gösterimi
  - `expo-haptics` — pull-to-refresh tetiklenme haptic'i (mobile)
  - `react-native-safe-area-context` — safe area uyumu (mobile)
  - `date-fns` — tarih formatlama (öğe tarihleri)
  - `i18next` — çoklu dil metin yönetimi
  - `Tailwind 4.x / NativeWind 5.x` — styling
  - `lucide-react / lucide-react-native` — icon'lar (empty state, error, filter)
  - `react-error-boundary` — section-level error boundary

- **Bağımlılıklar:**
  - Mock veya gerçek list API endpoint (GET /items?cursor=xxx veya ?page=xxx)
  - Navigation config (S26 Detail Screen'e navigasyon, parametre geçirme: item ID)
  - Error/empty/loading state design token'ları
  - Skeleton placeholder component

- **Apple HIG uyumu:**
  - Apple HIG, liste ekranlarında smooth scrolling (60fps) ve native-feeling pull-to-refresh davranışı gerektirir.
  - Pull-to-refresh iOS'ta UIRefreshControl davranışını taklit etmelidir.
  - Liste öğeleri tap highlight feedback vermeli ve geçiş animasyonu ile detail ekranına gitmelidir.
  - Infinite scroll'da yeni sayfa yüklenirken mevcut içerik scroll'u engellenmemelidir.
  - Empty state anlamlı ve aksiyon yönlendirici olmalıdır ("Henüz öğe yok. Yeni bir tane oluşturun.").
  - Large content accessibility (Dynamic Type) desteği ile metin büyüdüğünde layout bozulmamalıdır.

- **Kabul kriterleri:**
  1. useInfiniteQuery ile paginated veri çekilir; liste sonuna yaklaşıldığında otomatik sonraki sayfa yüklenir.
  2. Pull-to-refresh (mobile) tüm listeyi yeniler (query.refetch).
  3. İlk yükleme skeleton placeholder, sonraki sayfa loading indicator, pull-to-refresh refresh indicator gösterir.
  4. İlk yükleme hatası section-level error + retry, sonraki sayfa hatası inline error + retry gösterir.
  5. Veri yoksa anlamlı empty state gösterilir.

---

## S26. Detail Screen (Query by ID + Loading/Error)

- **Platform:** Her ikisi (mobile + web)
- **Açıklama:** Tek bir kaynağın detayını gösteren referans ekrandır. S25 (List Screen) veya deep link'ten gelen ID parametresi ile TanStack Query'nin `useQuery` hook'u kullanılarak veri çekilir. Ekran üç ana durumda olabilir: loading (skeleton placeholder), error (section-level error + retry) veya success (içerik gösterimi). İçerik: başlık, açıklama, görsel, meta bilgiler (tarih, kategori), ilişkili öğeler. Navigation bar'da geri butonu ve opsiyonel olarak "Düzenle" butonu (S27'ye yönlendirme) bulunur. Deep link desteği vardır: uygulama dışından `/items/:id` formatında link ile doğrudan bu ekrana erişilebilir.

- **Kullanılan kütüphaneler:**
  - `TanStack Query` — useQuery (by ID), cache, staleTime, refetch
  - `expo-image` — detay görseli (mobile)
  - `date-fns` — tarih formatlama
  - `expo-linking` — deep link handling (mobile)
  - `React Router 7.x` — URL parametresi (web: /items/:id)
  - `React Navigation 7.x` — route parametresi (mobile)
  - `react-native-safe-area-context` — safe area uyumu (mobile)
  - `i18next` — çoklu dil metin yönetimi
  - `Tailwind 4.x / NativeWind 5.x` — styling
  - `lucide-react / lucide-react-native` — icon'lar
  - `react-error-boundary` — error boundary wrapper

- **Bağımlılıklar:**
  - Mock veya gerçek detail API endpoint (GET /items/:id)
  - Navigation parametresi (ID) — React Router params veya React Navigation route.params
  - Deep link konfigürasyonu (expo-linking + React Navigation linking config)
  - Error/loading state design token'ları
  - Skeleton placeholder component

- **Apple HIG uyumu:**
  - Apple HIG, detay ekranlarının swipe-back gesture ile geri dönülebilir olmasını gerektirir (iOS standard).
  - Navigation bar'da geri butonu (back button) mevcut olmalı ve bir önceki ekranın başlığını göstermelidir.
  - İçerik safe area içinde kalmalıdır.
  - Loading state skeleton placeholder ile gösterilmelidir (spinner yerine).
  - Error state anlaşılır ve recovery yolu sunan olmalıdır.
  - Deep link ile açıldığında geri butonuna basıldığında ana ekrana (home) veya liste ekranına gidilmelidir (orphan back navigation).

- **Kabul kriterleri:**
  1. ID parametresi ile useQuery kullanılarak veri çekilir.
  2. Loading state skeleton placeholder ile gösterilir.
  3. Error state section-level error + retry butonu ile gösterilir.
  4. Deep link ile doğrudan erişilebilir (/items/:id).
  5. Navigation bar'da çalışan geri butonu bulunur.

---

## S27. Create/Edit Form Screen (RHF + Zod + Submit Lifecycle)

- **Platform:** Her ikisi (mobile + web)
- **Açıklama:** Yeni kaynak oluşturma veya mevcut kaynağı düzenleme formu referans ekranıdır. Aynı ekran hem create hem edit modunda çalışır (URL/route parametresine göre). Edit modunda mevcut veri TanStack Query ile çekilir ve form default values'a yüklenir. Form React Hook Form 7.x ile yönetilir, Zod 4.x ile validate edilir. Submit lifecycle: button disable + loading → mutation call → success (navigate back + cache invalidate + success toast) veya error (inline error + form re-enable). Alanlar: başlık (text input), açıklama (multiline text input), kategori (select/picker), görsel (image picker), tarih (date picker). Unsaved changes guard: form dirty iken geri gitmeye çalışıldığında onay dialog'u gösterilir.

- **Kullanılan kütüphaneler:**
  - `React Hook Form 7.x` — form state management
  - `Zod 4.x` — form validasyonu (field-level + submit-level)
  - `TanStack Query` — create mutation (useMutation), edit query (useQuery) + cache invalidation
  - `Zustand 5.x` — opsiyonel: form draft state (kullanıcı uygulamadan çıksa bile taslak kalması)
  - `expo-image-picker` — görsel seçimi (mobile)
  - `expo-image` — görsel önizleme
  - `expo-haptics` — submit success/error haptic'i (mobile)
  - `react-native-keyboard-controller` — keyboard avoiding (mobile)
  - `sonner` — success/error toast (web)
  - `i18next` — çoklu dil metin yönetimi
  - `Tailwind 4.x / NativeWind 5.x` — styling
  - `lucide-react / lucide-react-native` — icon'lar
  - `react-error-boundary` — form seviyesinde error boundary

- **Bağımlılıklar:**
  - Create API endpoint (POST /items)
  - Update API endpoint (PUT /items/:id)
  - Detail API endpoint (GET /items/:id) — edit modunda mevcut veriyi çekmek için
  - Image upload API endpoint
  - Navigation config (create: new route, edit: /items/:id/edit parametresi)
  - TanStack Query cache invalidation (create/edit sonrası list cache invalidate)
  - Design token'ları (form input, select, button, error text stilleri)
  - Zod schema tanımı: title → z.string().min(3).max(100), description → z.string().max(500).optional(), category → z.enum([...])

- **Apple HIG uyumu:**
  - Apple HIG, form ekranlarında navigation bar'da "Cancel" ve "Save" butonlarını gerektirir.
  - Unsaved changes varken geri gitmeye çalışıldığında destructive action sheet ile onay sorulmalıdır.
  - Form alanları sıralı tab order ile keyboard'dan geçilebilir olmalıdır.
  - Multiline input auto-growing olmalıdır (sabit yükseklikli textarea yerine).
  - Image picker için action sheet (galeri, kamera) sunulmalıdır.
  - Submit sırasında loading state gösterilmelidir (Save butonu disable + spinner).
  - Error mesajları ilgili alanın hemen altında inline gösterilmelidir.
  - Keyboard açıldığında aktif input her zaman görünür olmalıdır.

- **Kabul kriterleri:**
  1. Aynı ekran create ve edit modunda çalışır (route parametresine göre).
  2. Edit modunda mevcut veri useQuery ile çekilir ve form default values'a yüklenir.
  3. Validasyon real-time (field-level) ve submit anında çalışır.
  4. Submit lifecycle: disable → mutation → success (navigate + cache invalidate + toast) veya error (inline + re-enable).
  5. Unsaved changes guard çalışır (dirty form + geri gitme → onay dialog).

---

# 11. Varsayılan Component'ler — Primitive Katmanı (Tier 1)

Primitive component'ler, tüm üst katman bileşenlerinin temelini oluşturan atomik yapı taşlarıdır. Bu bileşenler doğrudan design token'ları tüketir, platform farklarını soyutlar ve accessibility altyapısını sağlar. Hiçbir primitive, başka bir primitive'e bağımlı olmamalıdır (flat dependency). Her primitive, `packages/ui/src/primitives/` dizininde yer alır ve hem web hem mobile için tek kaynak dosyasından export edilir.

**Tier 1 genel kuralları:**
- Her primitive, design token'ları doğrudan tüketir (`packages/design-tokens` üzerinden).
- Her primitive, `forwardRef` ile ref desteği sunar.
- Her primitive, `testID` / `data-testid` prop'u kabul eder.
- Her primitive, TypeScript ile strict typed'dır; `as` prop'u yalnızca `Text` ve `Box` gibi semantik bileşenlerde desteklenir.
- Her primitive, web'de Tailwind 4 class'ları, mobile'da NativeWind 5 ile stilize edilir.
- Her primitive, dark mode desteği sağlar (token katmanı üzerinden otomatik).

---

## C01: Text — Semantik Metin Bileşeni

**Açıklama:**
Uygulamadaki tüm metin render işlemlerinin tek kaynağıdır. Doğrudan `<p>`, `<span>` (web) veya `<RNText>` (mobile) render eder. Hiçbir yerde raw HTML text node veya raw RN `<Text>` kullanılmaz; her metin bu component üzerinden geçer. Bu sayede typography token'ları merkezi olarak yönetilir, font değişiklikleri tek noktadan yapılır ve accessibility standartları garanti altına alınır.

**Platform davranışı:**
- **Web:** `<span>` veya `<p>` olarak render edilir. `as` prop'u ile `span`, `p`, `label`, `strong`, `em`, `small`, `code`, `mark`, `del`, `ins`, `abbr` tag'lerine dönüşebilir.
- **Mobile (React Native):** `<RNText>` olarak render edilir. `as` prop'u mobile'da stilistik variant'a dönüşür (semantic HTML tag yok).

**Token tüketimi:**
- `fontFamily` → `tokens.typography.fontFamily.sans` | `mono` | `serif`
- `fontSize` → `tokens.typography.fontSize.[xs|sm|base|lg|xl|2xl|3xl|4xl]`
- `fontWeight` → `tokens.typography.fontWeight.[regular|medium|semibold|bold]`
- `lineHeight` → `tokens.typography.lineHeight.[tight|normal|relaxed]`
- `letterSpacing` → `tokens.typography.letterSpacing.[tight|normal|wide]`
- `color` → `tokens.color.text.[primary|secondary|tertiary|disabled|inverse|error|success|warning|info|link]`

**Props:**
| Prop | Tip | Varsayılan | Açıklama |
|------|-----|-----------|----------|
| `children` | `ReactNode` | — | Metin içeriği |
| `variant` | `'body-sm'` \| `'body'` \| `'body-lg'` \| `'caption'` \| `'overline'` \| `'code'` | `'body'` | Typography preset |
| `weight` | `'regular'` \| `'medium'` \| `'semibold'` \| `'bold'` | `'regular'` | Font ağırlığı |
| `color` | `TextColorToken` | `'primary'` | Metin rengi (token key) |
| `align` | `'left'` \| `'center'` \| `'right'` | `'left'` | Metin hizalama |
| `numberOfLines` | `number` | `undefined` | Satır limiti (truncation) |
| `as` | `HTMLElement` | `'span'` | Web-only: render tag |
| `selectable` | `boolean` | `true` | Metin seçilebilir mi |
| `testID` | `string` | — | Test identifier |

**State'ler:**
- **Default:** Normal metin render.
- **Truncated:** `numberOfLines` verildiğinde metin kesilir, sonunda `...` (ellipsis) görünür.
- **Disabled:** `color="disabled"` verildiğinde soluk renk token'ı uygulanır.

**Variant'lar:**
- `body-sm`: 12px / 0.75rem, regular, secondary renk — açıklama metinleri, yardımcı bilgiler.
- `body`: 14px / 0.875rem, regular, primary renk — ana gövde metni.
- `body-lg`: 16px / 1rem, regular, primary renk — vurgulu gövde metni.
- `caption`: 11px / 0.6875rem, medium, tertiary renk — etiketler, zaman damgaları.
- `overline`: 10px / 0.625rem, semibold, uppercase, tertiary renk — bölüm başlıkları.
- `code`: 13px / 0.8125rem, mono fontFamily, secondary renk — kod snippet'leri.

**Apple HIG uyumu:**
- Dynamic Type desteği zorunludur. Font boyutları accessibility ayarlarına göre ölçeklenir.
- iOS'ta `allowsFontScaling={true}` varsayılan olmalıdır.
- Minimum font boyutu 11pt'den küçük olmamalıdır (HIG tavsiyesi).
- Renk kontrastı WCAG AA standardını karşılamalıdır (normal metin 4.5:1, büyük metin 3:1).

**Accessibility (a11y) gereksinimleri:**
- `accessibilityRole="text"` varsayılan olarak atanır.
- Truncated metin için tam metin `accessibilityLabel` ile erişilebilir olmalıdır.
- Screen reader metin sıralamasını DOM/view hierarchy sırasına göre okur; bu sıralama visual layout ile tutarlı olmalıdır.
- Renk tek başına anlam taşımamalıdır (örneğin, hata metni sadece kırmızı renk ile değil, ikon veya prefix ile de belirtilmelidir).

---

## C02: Heading — Semantik Başlık Bileşeni

**Açıklama:**
Sayfa ve bölüm başlıkları için kullanılan semantik heading bileşenidir. Web'de doğru HTML heading tag'ini (`h1`-`h6`) render eder, mobile'da accessibility role ile başlık seviyesini belirtir. Heading hiyerarşisi sayfa SEO'su ve screen reader navigasyonu için kritiktir; her sayfada tam olarak bir `h1` bulunmalı, seviyeler atlanmamalıdır (h1 → h3 gibi).

**Platform davranışı:**
- **Web:** `level` prop'una göre `<h1>`-`<h6>` HTML tag'lerini render eder. CSS reset ile tarayıcı varsayılan stilleri sıfırlanır, tüm stil design token'larından gelir.
- **Mobile (React Native):** `<RNText>` render eder. `accessibilityRole="header"` atanır. iOS VoiceOver ve Android TalkBack heading olarak tanır.

**Token tüketimi:**
- `fontSize` → `tokens.typography.heading.[h1|h2|h3|h4|h5|h6].fontSize`
- `fontWeight` → `tokens.typography.heading.[h1|h2|h3|h4|h5|h6].fontWeight`
- `lineHeight` → `tokens.typography.heading.[h1|h2|h3|h4|h5|h6].lineHeight`
- `letterSpacing` → `tokens.typography.heading.[h1|h2|h3|h4|h5|h6].letterSpacing`
- `color` → `tokens.color.text.primary` (varsayılan) | `tokens.color.text.secondary`

**Props:**
| Prop | Tip | Varsayılan | Açıklama |
|------|-----|-----------|----------|
| `level` | `1` \| `2` \| `3` \| `4` \| `5` \| `6` | `2` | Heading seviyesi |
| `children` | `ReactNode` | — | Başlık içeriği |
| `color` | `TextColorToken` | `'primary'` | Metin rengi |
| `align` | `'left'` \| `'center'` \| `'right'` | `'left'` | Hizalama |
| `numberOfLines` | `number` | `undefined` | Truncation |
| `testID` | `string` | — | Test identifier |

**Variant'lar (heading level'a göre token mapping):**
- `h1`: 32px / 2rem, bold, tight lineHeight — sayfa ana başlığı (her sayfada en fazla 1 adet).
- `h2`: 24px / 1.5rem, bold, tight lineHeight — ana bölüm başlığı.
- `h3`: 20px / 1.25rem, semibold, normal lineHeight — alt bölüm başlığı.
- `h4`: 18px / 1.125rem, semibold, normal lineHeight — kart/grup başlığı.
- `h5`: 16px / 1rem, medium, normal lineHeight — küçük bölüm başlığı.
- `h6`: 14px / 0.875rem, medium, normal lineHeight — en küçük başlık.

**State'ler:**
- **Default:** Normal başlık render.
- **Truncated:** `numberOfLines` ile kesilmiş başlık.

**Apple HIG uyumu:**
- iOS Large Title desteği: h1 seviyesinde navigation bar large title pattern'ı uygulanabilir olmalıdır.
- Dynamic Type ile ölçeklenme zorunludur.
- Heading'ler arası spacing, HIG tipografi rehberine uygun olmalıdır (heading altı minimum 8pt spacing).

**Accessibility (a11y) gereksinimleri:**
- Web: Doğru HTML heading tag'i (`<h1>`-`<h6>`) render edilmelidir.
- Mobile: `accessibilityRole="header"` atanmalıdır.
- Heading hiyerarşisi atlanmamalıdır (h1 → h2 → h3, asla h1 → h3).
- Her sayfada tam olarak bir `h1` bulunmalıdır.
- Screen reader kullanıcıları heading'ler arasında navigasyon yapabilmelidir.

---

## C03: Box / Surface — Temel Container Bileşeni

**Açıklama:**
Uygulamadaki tüm container ihtiyaçlarını karşılayan temel layout bileşenidir. Diğer tüm layout component'lerinin (`Stack`, `Card`, `Surface` vb.) yapı taşıdır. Background color, padding, border, border radius ve shadow gibi görsel token'ları doğrudan tüketir. Herhangi bir HTML element veya RN View olarak render edilebilir.

**Platform davranışı:**
- **Web:** Varsayılan olarak `<div>` render eder. `as` prop'u ile `section`, `article`, `aside`, `main`, `nav`, `header`, `footer` gibi semantik HTML5 tag'lerine dönüşebilir.
- **Mobile (React Native):** `<View>` olarak render edilir.

**Token tüketimi:**
- `backgroundColor` → `tokens.color.surface.[default|raised|sunken|overlay|inverse]`
- `padding` → `tokens.spacing.[0|1|2|3|4|5|6|8|10|12|16|20]`
- `borderWidth` → `tokens.border.width.[none|thin|medium|thick]`
- `borderColor` → `tokens.color.border.[default|subtle|strong|focus|error]`
- `borderRadius` → `tokens.radius.[none|sm|md|lg|xl|full]`
- `shadow` → `tokens.shadow.[none|sm|md|lg|xl]`

**Props:**
| Prop | Tip | Varsayılan | Açıklama |
|------|-----|-----------|----------|
| `children` | `ReactNode` | — | İçerik |
| `as` | `HTMLElement` | `'div'` | Web-only: render tag |
| `surface` | `'default'` \| `'raised'` \| `'sunken'` \| `'overlay'` \| `'inverse'` | `'default'` | Yüzey tipi (background token) |
| `padding` | `SpacingToken` | `undefined` | İç boşluk |
| `paddingX` | `SpacingToken` | `undefined` | Yatay iç boşluk |
| `paddingY` | `SpacingToken` | `undefined` | Dikey iç boşluk |
| `radius` | `RadiusToken` | `'none'` | Köşe yuvarlaklığı |
| `border` | `boolean` | `false` | Border göster |
| `borderColor` | `BorderColorToken` | `'default'` | Border rengi |
| `shadow` | `ShadowToken` | `'none'` | Gölge |
| `testID` | `string` | — | Test identifier |

**State'ler:**
- **Default:** Normal container.
- **Focused:** İçindeki bir input focus aldığında border token değişebilir (FieldShell ile kullanıldığında).
- **Disabled:** Opacity 0.5 + pointer-events: none.

**Apple HIG uyumu:**
- Grouped content alanlarında `surface="raised"` kullanılarak görsel ayrım sağlanmalıdır.
- Card benzeri container'larda minimum 16pt padding uygulanmalıdır (HIG content margin önerisi).
- Border radius değerleri iOS system radius ile uyumlu olmalıdır (continuous corner radius).

**Accessibility (a11y) gereksinimleri:**
- Semantik HTML tag kullanıldığında (`section`, `article` vb.) screen reader landmark olarak tanır.
- Decorative container'lar (sadece görsel gruplandırma) için `accessibilityRole` atanmamalıdır.
- Renk kontrastı: surface color ile üzerindeki metin arasında WCAG AA contrast oranı sağlanmalıdır.

---

## C04: Stack (VStack / HStack) — Flex Layout Bileşeni

**Açıklama:**
Çocuk bileşenleri dikey (VStack) veya yatay (HStack) olarak dizmenin standart yoludur. CSS Flexbox (web) ve RN Flexbox (mobile) üzerine kuruludur. Tüm layout'lar Stack kullanarak oluşturulmalıdır; doğrudan `flexDirection` style uygulamak yerine Stack tercih edilmelidir.

**Platform davranışı:**
- **Web:** `<div>` + Tailwind `flex flex-col` (VStack) veya `flex flex-row` (HStack) class'ları.
- **Mobile (React Native):** `<View>` + `flexDirection: 'column'` (VStack) veya `flexDirection: 'row'` (HStack).

**Token tüketimi:**
- `gap` → `tokens.spacing.[0|1|2|3|4|5|6|8|10|12|16|20]`
- `padding` → Miras: Box'tan gelen tüm padding token'ları desteklenir.
- `alignItems` → CSS/RN flex alignment (token değil, prop olarak).
- `justifyContent` → CSS/RN flex justification (token değil, prop olarak).

**Props:**
| Prop | Tip | Varsayılan | Açıklama |
|------|-----|-----------|----------|
| `children` | `ReactNode` | — | Çocuk bileşenler |
| `direction` | `'vertical'` \| `'horizontal'` | `'vertical'` | Dizim yönü |
| `gap` | `SpacingToken` | `'3'` (12px) | Çocuklar arası boşluk |
| `align` | `'start'` \| `'center'` \| `'end'` \| `'stretch'` | `'stretch'` | Cross-axis hizalama |
| `justify` | `'start'` \| `'center'` \| `'end'` \| `'between'` \| `'around'` | `'start'` | Main-axis hizalama |
| `wrap` | `boolean` | `false` | Satır kaydırma (yalnızca HStack) |
| `flex` | `number` | `undefined` | Flex grow |
| `testID` | `string` | — | Test identifier |

**VStack shorthand:** `<Stack direction="vertical">` ile aynı. Ayrı `<VStack>` export'u mevcuttur.
**HStack shorthand:** `<Stack direction="horizontal">` ile aynı. Ayrı `<HStack>` export'u mevcuttur.

**State'ler:**
- Stack stateless bir layout bileşenidir; görsel state'i yoktur.

**Variant'lar:**
- `VStack`: Dikey dizim — form alanları, sayfa bölümleri, card içerikleri.
- `HStack`: Yatay dizim — buton grupları, ikon + metin, avatar + bilgi.

**Apple HIG uyumu:**
- iOS standart spacing değerlerini (4pt grid system) kullanmalıdır.
- Gap değerleri 4'ün katları olmalıdır (4, 8, 12, 16, 20, 24, 32...).
- Content grouping'de HIG önerdiği 16-20pt spacing uygulanmalıdır.

**Accessibility (a11y) gereksinimleri:**
- Stack, görsel layout container'ıdır; kendine ait accessibility role'ü yoktur.
- Çocuk bileşenlerin DOM/view sırası visual sıra ile eşleşmelidir (RTL desteği dahil).

---

## C05: Inline — Satır İçi Dizim Bileşeni

**Açıklama:**
Satır içi öğeleri (etiket, badge, chip, küçük ikon vb.) yatay olarak dizer ve satır sonunda otomatik olarak bir alt satıra kaydırır (wrap). HStack'ten farkı: wrap davranışının varsayılan olmasıdır. Tag listeleri, filtre chip'leri ve inline badge grupları için kullanılır.

**Platform davranışı:**
- **Web:** `<div>` + `flex flex-row flex-wrap` + gap.
- **Mobile (React Native):** `<View>` + `flexDirection: 'row', flexWrap: 'wrap'` + gap.

**Token tüketimi:**
- `gap` → `tokens.spacing.[1|2|3|4]` — genellikle küçük değerler (4-8px).
- `rowGap` → `tokens.spacing.[1|2|3]` — satırlar arası dikey boşluk.

**Props:**
| Prop | Tip | Varsayılan | Açıklama |
|------|-----|-----------|----------|
| `children` | `ReactNode` | — | Satır içi öğeler |
| `gap` | `SpacingToken` | `'2'` (8px) | Öğeler arası yatay boşluk |
| `rowGap` | `SpacingToken` | `gap` değeri | Satırlar arası dikey boşluk |
| `align` | `'start'` \| `'center'` \| `'end'` | `'start'` | Dikey hizalama |
| `testID` | `string` | — | Test identifier |

**State'ler:**
- Inline stateless bir layout bileşenidir.

**Apple HIG uyumu:**
- Chip/tag arasındaki minimum boşluk 8pt olmalıdır.
- Wrap sonrası ikinci satır ile birinci satır arasında tutarlı row gap olmalıdır.

**Accessibility (a11y) gereksinimleri:**
- Görsel layout container'ıdır; kendine ait role yoktur.
- İçerideki interactive element'ler (chip, tag) kendi a11y role'lerini taşımalıdır.
- Tab order, visual wrap sırasını takip etmelidir (soldan sağa, üstten alta).

---

## C06: Spacer — Boşluk Bileşeni

**Açıklama:**
İki bileşen arasına boşluk eklemek için kullanılan yardımcı bileşendir. İki modda çalışır: (1) **Flex spacer** — Stack içinde `flex: 1` ile kalan alanı doldurur (push layout), (2) **Fixed spacer** — belirli bir piksel/token değeri kadar sabit boşluk oluşturur.

**Platform davranışı:**
- **Web:** `<div>` + `flex: 1` veya sabit `height`/`width`.
- **Mobile (React Native):** `<View>` + aynı flex/sabit mantık.

**Token tüketimi:**
- `size` → `tokens.spacing.[1|2|3|4|5|6|8|10|12|16|20]` (fixed mode).
- Flex mode'da token tüketmez; `flex: 1` kullanır.

**Props:**
| Prop | Tip | Varsayılan | Açıklama |
|------|-----|-----------|----------|
| `size` | `SpacingToken` | `undefined` | Sabit boşluk değeri. Verilmezse flex spacer olarak çalışır. |
| `direction` | `'vertical'` \| `'horizontal'` | Otomatik (parent Stack'ten) | Boşluk yönü |
| `testID` | `string` | — | Test identifier |

**State'ler:**
- Spacer stateless bir bileşendir.

**Apple HIG uyumu:**
- Spacer, HIG'ın önerdiği "breathing room" prensibini uygular.
- Fixed spacer değerleri 4pt grid'e uygun olmalıdır.

**Accessibility (a11y) gereksinimleri:**
- Spacer görsel bir yardımcıdır; screen reader tarafından tamamen göz ardı edilmelidir.
- `accessibilityElementsHidden={true}` (mobile) ve `aria-hidden="true"` (web) uygulanmalıdır.
- DOM'da render edilse bile focusable olmamalıdır.

---

## C07: Pressable — Dokunulabilir Alan Bileşeni

**Açıklama:**
Tüm dokunulabilir/tıklanabilir alanların temel bileşenidir. Button, ListItem, Card gibi interactive component'lerin hepsi Pressable üzerine kuruludur. Dokunma geri bildirimi (opacity değişimi, scale animasyonu), haptic feedback ve disabled state yönetimi sağlar.

**Platform davranışı:**
- **Web:** `<button>` veya `<div role="button" tabIndex={0}>` olarak render edilir. Hover, focus, active state'leri CSS ile yönetilir. Keyboard event'leri (Enter/Space) otomatik desteklenir.
- **Mobile (React Native):** `<RNPressable>` kullanır. Press feedback: opacity 0.7 (varsayılan) veya scale 0.97 animasyonu (react-native-reanimated ile). Haptic feedback opsiyonel (expo-haptics: `ImpactFeedbackStyle.Light`).

**Token tüketimi:**
- `pressedOpacity` → `tokens.interaction.press.opacity` (varsayılan: 0.7)
- `pressedScale` → `tokens.interaction.press.scale` (varsayılan: 0.97)
- `disabledOpacity` → `tokens.interaction.disabled.opacity` (varsayılan: 0.5)
- `focusRingColor` → `tokens.color.border.focus`
- `focusRingWidth` → `tokens.border.width.medium` (2px)
- `focusRingOffset` → `2px`

**Props:**
| Prop | Tip | Varsayılan | Açıklama |
|------|-----|-----------|----------|
| `onPress` | `() => void` | — | Tıklama/dokunma handler |
| `onLongPress` | `() => void` | `undefined` | Uzun basma handler |
| `disabled` | `boolean` | `false` | Devre dışı durumu |
| `haptic` | `'light'` \| `'medium'` \| `'heavy'` \| `'none'` | `'none'` | Haptic feedback tipi (mobile-only) |
| `feedbackType` | `'opacity'` \| `'scale'` \| `'both'` \| `'none'` | `'opacity'` | Dokunma geri bildirimi |
| `children` | `ReactNode` \| `(state: PressableState) => ReactNode` | — | İçerik veya render function |
| `accessibilityLabel` | `string` | — | a11y etiketi |
| `accessibilityHint` | `string` | — | a11y ipucu |
| `testID` | `string` | — | Test identifier |

**State'ler:**
- **Idle:** Normal görünüm. Feedback yok.
- **Hovered (web-only):** Hafif opacity değişimi veya background color değişimi. Cursor: pointer.
- **Pressed/Active:** Opacity 0.7 veya scale 0.97 animasyonu. Haptic tetiklenir (mobile). Animasyon süresi: 100ms in, 200ms out (Reanimated `withTiming`).
- **Focused (keyboard):** Focus ring görünür (2px solid, focus token rengi, 2px offset). Web'de `:focus-visible` ile tetiklenir; mouse click'te focus ring gösterilmez.
- **Disabled:** Opacity 0.5. `onPress` tetiklenmez. `pointer-events: none`. `accessibilityState={{ disabled: true }}`.
- **Long Pressed:** `onLongPress` 500ms'de tetiklenir. Haptic: `ImpactFeedbackStyle.Medium`.

**Variant'lar:**
- Pressable tek variant'lıdır. Üst katman bileşenler (Button, ListItem) kendi variant'larını Pressable üzerine kurar.

**Apple HIG uyumu:**
- **44pt minimum touch target:** Pressable'ın minimum dokunma alanı 44x44pt olmalıdır. İçerik daha küçük olsa bile `hitSlop` veya `minHeight`/`minWidth` ile 44pt garanti edilmelidir.
- Press feedback derhal başlamalıdır (50ms içinde visible olmalıdır) — kullanıcı dokunduğunu hissetmelidir.
- Haptic feedback, destructive action'larda `ImpactFeedbackStyle.Heavy` kullanmalıdır.

**Accessibility (a11y) gereksinimleri:**
- `accessibilityRole="button"` varsayılan olarak atanır.
- `accessibilityLabel` zorunludur (çocuk Text içermiyorsa).
- `accessibilityState={{ disabled: true }}` disabled durumda atanmalıdır.
- Keyboard: Enter ve Space tuşları `onPress`'i tetiklemelidir.
- Focus trap: Pressable içindeki focusable element'ler tek bir tab stop olarak davranmalıdır (composite widget pattern değilse).

---

## C08: Icon — İkon Bileşeni

**Açıklama:**
Uygulamadaki tüm ikon render işlemlerinin tek kaynağıdır. İkon kütüphanesi olarak `lucide-react` (web) ve `lucide-react-native` (mobile) kullanılır. Her ikon, size ve color token'larını tüketir. Decorative ikon ile informative ikon ayrımı yapılır.

**Platform davranışı:**
- **Web:** `lucide-react` kütüphanesinden SVG component olarak render edilir. Tree-shaking ile sadece kullanılan ikonlar bundle'a dahil olur.
- **Mobile (React Native):** `lucide-react-native` kütüphanesinden SVG component olarak render edilir. `react-native-svg` bağımlılığı vardır.

**Kütüphane:** `lucide-react` (web), `lucide-react-native` (mobile)

**Token tüketimi:**
- `size` → `tokens.icon.size.[xs|sm|md|lg|xl]` → 12 / 16 / 20 / 24 / 32 px
- `color` → `tokens.color.icon.[primary|secondary|tertiary|disabled|inverse|error|success|warning|info]`
- `strokeWidth` → `tokens.icon.strokeWidth` (varsayılan: 2)

**Props:**
| Prop | Tip | Varsayılan | Açıklama |
|------|-----|-----------|----------|
| `name` | `LucideIconName` | — | İkon adı (lucide icon set'inden) |
| `size` | `'xs'` \| `'sm'` \| `'md'` \| `'lg'` \| `'xl'` | `'md'` (20px) | İkon boyutu |
| `color` | `IconColorToken` | `'primary'` | İkon rengi |
| `accessibilityLabel` | `string` | — | a11y etiketi (informative ikon için zorunlu) |
| `decorative` | `boolean` | `false` | Dekoratif mi (true ise a11y'den gizlenir) |
| `testID` | `string` | — | Test identifier |

**State'ler:**
- **Default:** Normal ikon render.
- **Disabled:** `color="disabled"` ile soluk renk token'ı.

**Apple HIG uyumu:**
- İkon boyutları SF Symbols scale'leri ile uyumlu olmalıdır (small: 16pt, medium: 20pt, large: 24pt).
- İkonlar metin ile birlikte kullanıldığında optik olarak ortalanmalıdır (baseline alignment değil, visual center).
- Tab bar ikonları: 25x25pt (regular), navigation bar ikonları: 22x22pt.

**Accessibility (a11y) gereksinimleri:**
- **Informative ikon** (tek başına anlam taşıyan): `accessibilityLabel` zorunludur. `aria-label` (web) veya `accessibilityLabel` (mobile) atanır.
- **Decorative ikon** (yanında metin bulunan): `decorative={true}` ile `aria-hidden="true"` (web) veya `importantForAccessibility="no"` (mobile) atanır.
- `accessibilityLabel` verilmemiş ve `decorative` false olan ikon build time'da TypeScript hatası vermelidir (conditional required prop).

---

## C09: Divider — Ayırıcı Bileşeni

**Açıklama:**
İçerik bölümleri arasında görsel ayırıcı çizgi oluşturur. Yatay (varsayılan) veya dikey yönde kullanılabilir. Token-based renk ve kalınlık değerleri kullanır.

**Platform davranışı:**
- **Web:** `<hr>` (yatay) veya `<div>` (dikey) olarak render edilir. `<hr>` kullanıldığında tarayıcı varsayılan margin sıfırlanır.
- **Mobile (React Native):** `<View>` + border-bottom (yatay) veya border-right (dikey).

**Token tüketimi:**
- `color` → `tokens.color.border.[default|subtle]`
- `width` → `tokens.border.width.[thin|medium]` (çizgi kalınlığı, varsayılan: thin / 1px)
- `spacing` → `tokens.spacing.[2|3|4|6]` (üst/alt margin — opsiyonel, parent Stack gap'i ile yönetilebilir)

**Props:**
| Prop | Tip | Varsayılan | Açıklama |
|------|-----|-----------|----------|
| `direction` | `'horizontal'` \| `'vertical'` | `'horizontal'` | Yön |
| `color` | `'default'` \| `'subtle'` | `'default'` | Renk |
| `inset` | `SpacingToken` | `undefined` | Sol/sağ iç boşluk (indent) |
| `testID` | `string` | — | Test identifier |

**State'ler:**
- Divider stateless bir bileşendir.

**Apple HIG uyumu:**
- iOS liste ayırıcıları genellikle leading edge'den 16pt inset ile başlar (leading inset pattern). `inset` prop'u bu davranışı destekler.
- Full-width divider yalnızca ana bölüm ayırıcılarında kullanılmalıdır.

**Accessibility (a11y) gereksinimleri:**
- Web'de `<hr>` kullanıldığında `role="separator"` otomatik olarak gelir.
- Decorative divider ise `role="presentation"` veya `aria-hidden="true"` atanmalıdır.
- Mobile'da `accessibilityRole="none"` atanmalıdır (görsel ayırıcılar screen reader'dan gizlenir).

---

## C10: ScrollContainer — Scroll Wrapper Bileşeni

**Açıklama:**
Kaydırılabilir içerik alanlarının standart wrapper'ıdır. Keyboard dismiss, scroll-to-top, pull-to-refresh entegrasyonu ve scroll indicator özelleştirmesi sağlar. Her ekranın ana scroll alanı bu bileşen üzerinden yönetilir.

**Platform davranışı:**
- **Web:** `<div>` + `overflow-y: auto` + custom scrollbar styling. Native browser scroll davranışı kullanılır.
- **Mobile (React Native):** `<ScrollView>` wrapper. `keyboardDismissMode`, `keyboardShouldPersistTaps`, `showsVerticalScrollIndicator` gibi RN prop'ları yönetilir.

**Token tüketimi:**
- `contentPadding` → `tokens.spacing.[4|5|6]` (içerik padding'i)
- `scrollIndicatorColor` → platform varsayılanı (genellikle token ile değiştirilmez)

**Props:**
| Prop | Tip | Varsayılan | Açıklama |
|------|-----|-----------|----------|
| `children` | `ReactNode` | — | Kaydırılabilir içerik |
| `keyboardDismiss` | `'on-drag'` \| `'interactive'` \| `'none'` | `'on-drag'` | Keyboard dismiss modu (mobile) |
| `showsScrollIndicator` | `boolean` | `true` | Scroll indicator göster |
| `refreshControl` | `ReactNode` | `undefined` | Pull-to-refresh component |
| `contentPadding` | `SpacingToken` | `undefined` | İçerik padding'i |
| `bounces` | `boolean` | `true` | iOS bounce efekti (mobile) |
| `scrollToTopOnTap` | `boolean` | `true` | Status bar'a tıklanınca üste scroll (iOS) |
| `testID` | `string` | — | Test identifier |

**State'ler:**
- **Idle:** Normal scroll alanı.
- **Scrolling:** Scroll indicator görünür (otomatik gizleme: 1.5s idle sonra).
- **Refreshing:** Pull-to-refresh aktif (refreshControl prop'u ile).
- **Bouncing:** iOS elastic bounce efekti.

**Apple HIG uyumu:**
- iOS status bar'a tıklanınca scroll-to-top davranışı varsayılan olarak aktif olmalıdır.
- Rubber-banding (elastic bounce) iOS'ta varsayılan olmalıdır.
- Scroll indicator, içerik alanının sağında iOS-native görünümde olmalıdır.

**Accessibility (a11y) gereksinimleri:**
- Scroll alanı focusable olmamalıdır; çocuk element'ler kendi focus'larını yönetir.
- Keyboard kullanıcıları için Tab ile içerikteki focusable element'lere erişim sağlanmalıdır.
- VoiceOver: Scroll alanı bir "scrollable region" olarak tanınmalıdır; üç parmak kaydırma ile navigate edilebilmelidir.

---

## C11: SafeAreaContainer — Güvenli Alan Bileşeni

**Açıklama:**
iPhone notch/Dynamic Island, Android status bar ve home indicator gibi sistem UI öğelerinin içeriği örtmesini engelleyen container bileşenidir. Her ekranın kök bileşeni SafeAreaContainer ile sarılmalıdır.

**Platform davranışı:**
- **Web:** `padding-top: env(safe-area-inset-top)` vb. CSS environment değişkenleri kullanır (PWA ve notch'lu web tarayıcıları için).
- **Mobile (React Native):** `react-native-safe-area-context` kütüphanesinin `SafeAreaView` veya `useSafeAreaInsets` hook'unu kullanır.

**Kütüphane:** `react-native-safe-area-context`

**Token tüketimi:**
- SafeAreaContainer token tüketmez; platform inset değerlerini dinamik olarak uygular.
- `backgroundColor` → `tokens.color.surface.default` (arka plan rengi, inset alanlarında da görünür).

**Props:**
| Prop | Tip | Varsayılan | Açıklama |
|------|-----|-----------|----------|
| `children` | `ReactNode` | — | İçerik |
| `edges` | `('top'` \| `'bottom'` \| `'left'` \| `'right')[]` | `['top', 'bottom']` | Hangi kenarlar korunacak |
| `backgroundColor` | `SurfaceColorToken` | `'default'` | Arka plan rengi |
| `testID` | `string` | — | Test identifier |

**State'ler:**
- SafeAreaContainer stateless'tır; platform inset'lerini reactive olarak uygular.

**Apple HIG uyumu:**
- **Zorunlu:** Tüm içerik safe area sınırları içinde kalmalıdır. Notch/Dynamic Island üzerine içerik yerleştirilmemelidir.
- Home indicator alanına interactive element yerleştirilmemelidir (bottom safe area).
- Landscape modunda sol/sağ safe area inset'leri de uygulanmalıdır.

**Accessibility (a11y) gereksinimleri:**
- SafeAreaContainer kendine ait role taşımaz; yalnızca layout container'ıdır.
- Screen reader, safe area padding'ini göz ardı eder; içerik sıralaması değişmez.

---

## C12: KeyboardAvoidingContainer — Klavye Yönetim Bileşeni

**Açıklama:**
Sanal klavye açıldığında içeriğin klavye tarafından örtülmesini engelleyen container bileşenidir. Form ekranlarında, chat ekranlarında ve metin girişi içeren tüm ekranlarda kullanılır. React Native'in built-in `KeyboardAvoidingView`'ının yetersiz kaldığı kenar durumlarını (BottomSheet + keyboard, tab bar + keyboard vb.) yönetir.

**Platform davranışı:**
- **Web:** Browser otomatik scroll davranışına güvenilir. Ek bir container gerekmez; bu bileşen web'de passthrough (children'ı olduğu gibi render eder).
- **Mobile (React Native):** `react-native-keyboard-controller` kütüphanesi kullanılır. `KeyboardAvoidingView` veya `KeyboardAwareScrollView` olarak çalışır. iOS ve Android arasındaki keyboard height farklılıklarını normalize eder.

**Kütüphane:** `react-native-keyboard-controller`

**Token tüketimi:**
- KeyboardAvoidingContainer doğrudan token tüketmez; animasyon süresi ve easing değerleri kütüphane varsayılanlarını kullanır.

**Props:**
| Prop | Tip | Varsayılan | Açıklama |
|------|-----|-----------|----------|
| `children` | `ReactNode` | — | İçerik |
| `enabled` | `boolean` | `true` | Keyboard avoidance aktif mi |
| `offset` | `number` | `0` | Ek offset (tab bar yüksekliği vb. için) |
| `testID` | `string` | — | Test identifier |

**State'ler:**
- **Idle:** Klavye kapalı. Normal layout.
- **Avoiding:** Klavye açık. İçerik yukarı kaydırılmış veya padding eklenmiş durumda. Animasyon keyboard animation ile senkron (iOS'ta native keyboard animation curve takip edilir).
- **Restored:** Klavye kapanınca orijinal layout'a dönüş. Smooth animasyon.

**Apple HIG uyumu:**
- Klavye açıkken aktif input her zaman görünür olmalıdır.
- Keyboard animasyonu ile içerik animasyonu senkron olmalıdır (iOS keyboard curve: `easeInOut`, ~250ms).
- Input field ile klavye arası minimum 8pt boşluk bırakılmalıdır.

**Accessibility (a11y) gereksinimleri:**
- VoiceOver aktifken keyboard avoidance aynı şekilde çalışmalıdır.
- Hardware keyboard bağlıyken bu bileşen devre dışı kalmalıdır (gereksiz padding eklenmemeli).
- Focus input'ta iken keyboard dismiss edilirse, focus input'ta kalmalıdır.

---

# 12. Varsayılan Component'ler — Form Katmanı (Tier 2)

Form component'leri, Tier 1 primitive'leri üzerine kurulan ve kullanıcı input'u toplayan bileşenlerdir. Tüm form component'leri React Hook Form 7 (RHF) ile kontrol edilir ve Zod 4 ile validate edilir. `Controller` pattern'ı kullanılarak RHF ile entegre olurlar.

**Tier 2 Form genel kuralları:**
- Her form component'i, RHF `Controller` ile kullanılmak üzere `value`, `onChange`, `onBlur`, `error` prop'ları kabul eder.
- Her form component'i `FieldShell` (C22) içine gömülerek label, helper text ve error message alır.
- Her form component'i Zod schema ile validate edilir; error mesajları Zod'dan gelir.
- Platform farkları component içinde soyutlanır; dışarıdan bakıldığında API aynıdır.
- Tüm form component'lerinde `disabled`, `readOnly` state'leri desteklenir.

---

## C13: Button — Buton Bileşeni

**Açıklama:**
Uygulamadaki tüm buton etkileşimlerinin tek kaynağıdır. Form submit, navigasyon, aksiyon tetikleme gibi tüm kullanıcı eylemlerinde kullanılır. Pressable (C07) üzerine kuruludur.

**Platform davranışı:**
- **Web:** `<button>` HTML element'i render eder. `type="submit"` form içinde otomatik çalışır. CSS hover/active/focus state'leri uygulanır.
- **Mobile (React Native):** Pressable (C07) wrapper. Haptic feedback variant'a göre değişir (destructive: heavy, primary: light).

**Token tüketimi:**
- `backgroundColor` → `tokens.color.button.[primary|secondary|destructive|ghost|link].[default|hover|pressed|disabled]`
- `textColor` → `tokens.color.button.[primary|secondary|destructive|ghost|link].text.[default|disabled]`
- `borderColor` → `tokens.color.button.[secondary].border.[default|hover|disabled]`
- `borderRadius` → `tokens.radius.md` (varsayılan tüm butonlar)
- `padding` → Size'a göre: sm: `px-3 py-1.5`, md: `px-4 py-2.5`, lg: `px-6 py-3.5`
- `fontSize` → Size'a göre: sm: `tokens.typography.fontSize.sm`, md: `base`, lg: `lg`
- `height` → sm: 32px, md: 44px, lg: 52px
- `gap` (ikon + metin arası) → `tokens.spacing.2` (8px)

**Props:**
| Prop | Tip | Varsayılan | Açıklama |
|------|-----|-----------|----------|
| `children` | `ReactNode` | — | Buton metni |
| `variant` | `'primary'` \| `'secondary'` \| `'destructive'` \| `'ghost'` \| `'link'` | `'primary'` | Görsel varyant |
| `size` | `'sm'` \| `'md'` \| `'lg'` | `'md'` | Boyut |
| `onPress` | `() => void` | — | Tıklama handler |
| `disabled` | `boolean` | `false` | Devre dışı |
| `loading` | `boolean` | `false` | Yükleniyor durumu |
| `iconLeading` | `LucideIconName` | `undefined` | Sol ikon |
| `iconTrailing` | `LucideIconName` | `undefined` | Sağ ikon |
| `fullWidth` | `boolean` | `false` | Tam genişlik |
| `type` | `'button'` \| `'submit'` \| `'reset'` | `'button'` | HTML type (web-only) |
| `haptic` | `HapticType` | variant'a göre | Haptic feedback |
| `accessibilityLabel` | `string` | — | a11y etiketi |
| `testID` | `string` | — | Test identifier |

**Variant'lar:**
- **Primary:** Dolgu arka plan (brand renk), beyaz metin. Ana CTA. Ekranda en fazla 1 primary buton olmalıdır.
- **Secondary:** Border + transparan arka plan, brand renk metin. İkincil aksiyonlar.
- **Destructive:** Kırmızı dolgu arka plan, beyaz metin. Silme, iptal gibi geri dönüşü olmayan aksiyonlar. Haptic: heavy.
- **Ghost:** Transparan arka plan, muted metin. Hover'da hafif arka plan. Araç çubuğu, inline aksiyonlar.
- **Link:** Transparan arka plan, link renk metin, underline (opsiyonel). Metin içi link benzeri.

**State'ler:**
- **Idle:** Variant'a göre varsayılan görünüm.
- **Hovered (web):** Background color hover token'ına geçer. Cursor: pointer.
- **Pressed/Active:** Opacity veya scale feedback (Pressable'dan miras). Haptic tetiklenir (mobile).
- **Focused (keyboard):** Focus ring (Pressable'dan miras).
- **Loading:** Metin gizlenir (opacity 0, layout korunur), spinner (Spinner/C35) buton merkezinde görünür. `disabled` otomatik true olur. `onPress` tetiklenmez. `accessibilityLabel`: "Yükleniyor" veya `{orijinal label} yükleniyor`.
- **Disabled:** Opacity 0.5. Cursor: not-allowed (web). `pointer-events: none`.

**Apple HIG uyumu:**
- **44pt minimum touch target:** `md` ve `lg` size bu kriteri karşılar. `sm` size yalnızca inline/toolbar kullanımı içindir; liste veya form'da kullanılmamalıdır.
- Butonlar belirgin olmalı ve eylem metni açık olmalıdır ("Kaydet", "Sil" — "Tamam" veya "Evet" değil).
- Destructive butonlar kırmızı renk ile ayrılmalı ve onay dialog'u ile korunmalıdır.
- Primary buton ekranın en belirgin eylemidir; ekranda tek olmalıdır.

**Accessibility (a11y) gereksinimleri:**
- `accessibilityRole="button"` otomatik (Pressable'dan miras).
- Loading state'te `accessibilityState={{ busy: true }}` atanmalıdır.
- Disabled state'te `accessibilityState={{ disabled: true }}` atanmalıdır.
- Icon-only kullanımda (yalnızca `iconLeading` + children yok) `accessibilityLabel` zorunludur → Bu durumda `IconButton` (C14) tercih edilmelidir.
- Keyboard: Enter ve Space ile tetiklenmelidir.
- Renk kontrastı: Buton metni ile arka planı arasında minimum 4.5:1 oran.

---

## C14: IconButton — İkon-Only Buton Bileşeni

**Açıklama:**
Yalnızca ikon içeren buton bileşenidir. Navigation bar aksiyonları, inline araç çubuğu, kart aksiyonları gibi alan kısıtlı yerlerde kullanılır. Button (C13) bileşeninin özelleşmiş halidir; ancak ayrı bir component olarak ayrıştırılmıştır çünkü a11y gereksinimleri farklıdır (label zorunluluğu).

**Platform davranışı:**
- **Web:** `<button>` + tek ikon. Tooltip (C51) hover'da gösterilir.
- **Mobile (React Native):** Pressable + tek ikon. Long-press'te tooltip gösterilebilir.

**Token tüketimi:**
- `size` → sm: 32px, md: 40px, lg: 48px (container boyutu)
- `iconSize` → sm: 16px, md: 20px, lg: 24px
- `backgroundColor` → variant'a göre (Button token'ları ile aynı)
- `borderRadius` → `tokens.radius.full` (yuvarlak) veya `tokens.radius.md`

**Props:**
| Prop | Tip | Varsayılan | Açıklama |
|------|-----|-----------|----------|
| `icon` | `LucideIconName` | — | İkon adı (zorunlu) |
| `accessibilityLabel` | `string` | — | a11y etiketi (zorunlu) |
| `variant` | `'primary'` \| `'secondary'` \| `'ghost'` \| `'destructive'` | `'ghost'` | Görsel varyant |
| `size` | `'sm'` \| `'md'` \| `'lg'` | `'md'` | Boyut |
| `onPress` | `() => void` | — | Tıklama handler |
| `disabled` | `boolean` | `false` | Devre dışı |
| `loading` | `boolean` | `false` | Yükleniyor |
| `tooltip` | `string` | `accessibilityLabel` değeri | Tooltip metni |
| `rounded` | `boolean` | `true` | Yuvarlak köşe |
| `haptic` | `HapticType` | `'light'` | Haptic feedback |
| `testID` | `string` | — | Test identifier |

**State'ler:** Button (C13) ile aynı state'ler geçerlidir.

**Apple HIG uyumu:**
- **44pt minimum touch target:** `sm` size (32px) bile `hitSlop` ile 44pt'ye tamamlanmalıdır.
- Navigation bar ikonları: 22pt ikon + 44pt touch area.
- Toolbar ikonları: 20pt ikon + 44pt touch area.

**Accessibility (a11y) gereksinimleri:**
- `accessibilityLabel` **zorunludur** (TypeScript compile-time enforcement ile). Label verilmeden component kullanılamaz.
- Tooltip metni screen reader tarafından okunmamalıdır (çünkü label zaten var); `aria-hidden` olmalıdır.
- Disabled state'te `accessibilityState={{ disabled: true }}`.

---

## C15: TextField — Metin Giriş Bileşeni

**Açıklama:**
Tek satırlık metin girişi için kullanılan standart input bileşenidir. FieldShell (C22) ile sarılarak label, helper text ve error message alır. RHF Controller ile kontrol edilir.

**Platform davranışı:**
- **Web:** `<input type="text">` render eder. Autofill, autocomplete, spellcheck gibi browser özellikleri desteklenir.
- **Mobile (React Native):** `<TextInput>` render eder. `keyboardType`, `returnKeyType`, `autoCapitalize` gibi RN prop'ları desteklenir.

**Kütüphane:** Built-in (HTML input / RN TextInput). Ek kütüphane gerektirmez.

**Token tüketimi:**
- `backgroundColor` → `tokens.color.input.background.[default|focused|error|disabled]`
- `borderColor` → `tokens.color.input.border.[default|focused|error|disabled]`
- `borderWidth` → `tokens.border.width.thin` (1px)
- `borderRadius` → `tokens.radius.md`
- `textColor` → `tokens.color.input.text.[default|placeholder|disabled]`
- `fontSize` → `tokens.typography.fontSize.base` (16px — iOS zoom prevention)
- `height` → 44px (HIG minimum)
- `paddingX` → `tokens.spacing.3` (12px)
- `paddingY` → `tokens.spacing.2` (8px)

**Props:**
| Prop | Tip | Varsayılan | Açıklama |
|------|-----|-----------|----------|
| `value` | `string` | — | Controlled value |
| `onChange` | `(value: string) => void` | — | Değer değişim handler |
| `onBlur` | `() => void` | — | Blur handler |
| `placeholder` | `string` | `undefined` | Placeholder metni |
| `error` | `string` | `undefined` | Hata mesajı (Zod'dan gelir) |
| `disabled` | `boolean` | `false` | Devre dışı |
| `readOnly` | `boolean` | `false` | Salt okunur |
| `type` | `'text'` \| `'email'` \| `'tel'` \| `'url'` \| `'number'` | `'text'` | Input tipi |
| `keyboardType` | `RNKeyboardType` | `'default'` | Klavye tipi (mobile) |
| `returnKeyType` | `RNReturnKeyType` | `'done'` | Return tuşu tipi (mobile) |
| `autoCapitalize` | `'none'` \| `'sentences'` \| `'words'` \| `'characters'` | `'sentences'` | Otomatik büyük harf |
| `autoComplete` | `string` | `undefined` | Autofill ipucu |
| `maxLength` | `number` | `undefined` | Karakter limiti |
| `clearButton` | `boolean` | `false` | Temizle butonu göster |
| `iconLeading` | `LucideIconName` | `undefined` | Sol ikon |
| `iconTrailing` | `LucideIconName` | `undefined` | Sağ ikon |
| `onSubmit` | `() => void` | `undefined` | Return/enter handler |
| `testID` | `string` | — | Test identifier |

**State'ler:**
- **Empty:** Placeholder görünür, border varsayılan renk.
- **Filled:** Değer girilmiş, placeholder gizli.
- **Focused:** Border focus renk token'ına geçer. iOS'ta cursor görünür. Clear button (aktifse) görünür.
- **Error:** Border ve helper text kırmızı (error token). Error ikonu görünür. Hata mesajı FieldShell üzerinden gösterilir.
- **Disabled:** Opacity 0.5, background disabled token. Input etkileşime kapalı.
- **ReadOnly:** Görsel olarak normal ama düzenlenemez. Seçilebilir.

**Apple HIG uyumu:**
- **16px minimum font size:** iOS'ta 16px'den küçük font kullanıldığında Safari otomatik zoom yapar. Bu nedenle input font size her zaman 16px olmalıdır.
- **44pt minimum height:** Input yüksekliği 44pt olmalıdır.
- Clear button, metin girildiğinde sağ tarafta görünmelidir (iOS standart pattern).
- Placeholder rengi yeterince farklı olmalıdır ama çok soluk olmamalıdır (a11y).
- Keyboard type'lar doğru kullanılmalıdır (email → emailAddress keyboard, phone → phonePad).

**Accessibility (a11y) gereksinimleri:**
- `accessibilityRole="none"` (FieldShell label ile ilişkilendirir, kendi role'ü yok).
- `accessibilityLabel` → FieldShell label'ından otomatik gelir (web: `htmlFor`/`id`, mobile: `accessibilityLabelledBy`).
- `accessibilityState={{ disabled, error: !!error }}`.
- Error mesajı `accessibilityLiveRegion="polite"` (web: `aria-live="polite"`) ile announce edilmelidir.
- VoiceOver: Input focus aldığında "label, değer, ipucu, hata" sırasıyla okunmalıdır.

---

## C16: TextArea — Çok Satırlık Metin Giriş Bileşeni

**Açıklama:**
Çok satırlık metin girişi için kullanılan bileşendir. Açıklama alanları, yorum yazma, notlar gibi uzun metin girişlerinde TextField yerine TextArea kullanılır. Auto-grow özelliği ile içerik büyüdükçe yükseklik otomatik artar.

**Platform davranışı:**
- **Web:** `<textarea>` render eder. CSS `resize: none` (auto-grow aktifse) veya `resize: vertical`.
- **Mobile (React Native):** `<TextInput multiline={true}>` render eder. `textAlignVertical: 'top'` varsayılan.

**Token tüketimi:** TextField (C15) ile aynı token'lar. Ek olarak:
- `minHeight` → 88px (2 satır)
- `maxHeight` → 220px (auto-grow limiti)

**Props:** TextField (C15) prop'larının tamamı + aşağıdakiler:
| Prop | Tip | Varsayılan | Açıklama |
|------|-----|-----------|----------|
| `minRows` | `number` | `2` | Minimum satır sayısı |
| `maxRows` | `number` | `5` | Maksimum satır sayısı (auto-grow limiti) |
| `autoGrow` | `boolean` | `true` | İçerik büyüdükçe yükseklik artar mı |
| `showCharCount` | `boolean` | `false` | Karakter sayacı göster |

**State'ler:** TextField (C15) state'leri + auto-grow animasyonu.

**Apple HIG uyumu:**
- Auto-grow varsayılan olmalıdır; sabit yükseklikli textarea kullanılmamalıdır.
- Karakter limiti varsa kalan karakter sayısı gösterilmelidir.

**Accessibility (a11y) gereksinimleri:** TextField (C15) ile aynı. Ek olarak:
- `accessibilityRole="adjustable"` veya `"none"` (platform'a göre).
- Karakter sayacı `aria-live="polite"` ile güncelleme announce etmelidir (son 10 karakter kaldığında).

---

## C17: SearchField — Arama Alanı Bileşeni

**Açıklama:**
Arama işlevselliği için özelleşmiş metin giriş bileşenidir. Öne çıkan arama ikonu, temizle butonu ve debounce mekanizması içerir. TextField (C15) üzerine kuruludur.

**Platform davranışı:**
- **Web:** `<input type="search">` render eder. Browser search input özellikleri devralınır.
- **Mobile (React Native):** `<TextInput>` + leading search icon + clear button. iOS search bar görünümünde.

**Token tüketimi:** TextField (C15) token'ları + ek olarak:
- `backgroundColor` → `tokens.color.input.background.search` (hafif gri arka plan)
- `borderRadius` → `tokens.radius.full` (pill shape — iOS search bar pattern)
- `iconColor` → `tokens.color.icon.secondary`

**Props:** TextField (C15) prop'larının ilgili kısmı + aşağıdakiler:
| Prop | Tip | Varsayılan | Açıklama |
|------|-----|-----------|----------|
| `onSearch` | `(query: string) => void` | — | Debounce sonrası tetiklenen handler |
| `debounceMs` | `number` | `300` | Debounce süresi (ms) |
| `showCancel` | `boolean` | `false` | İptal butonu göster (mobile) |
| `onCancel` | `() => void` | `undefined` | İptal handler |

**State'ler:**
- **Empty:** Search ikonu + placeholder. Clear button gizli.
- **Filled:** Metin girilmiş. Clear button görünür. Cancel button görünür (mobile, opsiyonel).
- **Searching:** Debounce sırasında kısa bir loading indicator (opsiyonel).

**Apple HIG uyumu:**
- iOS search bar pattern: pill shape, leading search icon, clear button, cancel button (focus'ta görünür).
- Search bar fokuslandığında navigation bar daraltılabilir (large title → collapsed).
- Cancel butonu focus'ta sağdan slide-in animasyonuyla görünmelidir.

**Accessibility (a11y) gereksinimleri:**
- Web: `role="search"` veya `<input type="search">`.
- `accessibilityLabel="Ara"` varsayılan.
- Clear butonu: `accessibilityLabel="Aramayı temizle"`.
- Cancel butonu: `accessibilityLabel="Aramayı iptal et"`.
- Debounce, a11y açısından `aria-live` ile sonuç sayısını announce etmelidir.

---

## C18: Checkbox — Onay Kutusu Bileşeni

**Açıklama:**
Boolean veya çoklu seçim için kullanılan toggle bileşenidir. Checked, unchecked ve indeterminate state'leri destekler. Custom implementation olarak Pressable + Icon + animation ile oluşturulur (RN'de native checkbox yoktur).

**Platform davranışı:**
- **Web:** Custom `<div role="checkbox">` veya hidden `<input type="checkbox">` + visual overlay.
- **Mobile (React Native):** Pressable (C07) + Icon (C08) + Reanimated scale/opacity animasyonu. 250ms spring animation.

**Kütüphane:** Custom (Pressable + Icon + react-native-reanimated animasyon)

**Token tüketimi:**
- `size` → 20px (touch target: 44px hitSlop ile)
- `borderColor` → `tokens.color.input.border.[default|focused|error|disabled]`
- `backgroundColor` → checked: `tokens.color.brand.primary`, unchecked: transparent
- `checkmarkColor` → `tokens.color.icon.inverse` (beyaz)
- `borderRadius` → `tokens.radius.sm` (4px)
- `borderWidth` → `tokens.border.width.medium` (2px)

**Props:**
| Prop | Tip | Varsayılan | Açıklama |
|------|-----|-----------|----------|
| `checked` | `boolean` | `false` | İşaretli mi |
| `indeterminate` | `boolean` | `false` | Belirsiz durum (üst düzey select all) |
| `onChange` | `(checked: boolean) => void` | — | Değer değişim handler |
| `label` | `string` | — | Etiket metni |
| `disabled` | `boolean` | `false` | Devre dışı |
| `error` | `string` | `undefined` | Hata mesajı |
| `testID` | `string` | — | Test identifier |

**State'ler:**
- **Unchecked:** Boş kutu, border varsayılan renk.
- **Checked:** Brand renk dolgu, beyaz checkmark ikonu. Animasyon: scale 0 → 1 + opacity 0 → 1, 250ms spring.
- **Indeterminate:** Brand renk dolgu, beyaz minus (`—`) ikonu. "Tümünü seç" pattern'ında kısmi seçim.
- **Focused:** Focus ring (Pressable'dan miras).
- **Disabled:** Opacity 0.5, etkileşime kapalı.
- **Error:** Border kırmızı, error mesajı görünür.

**Apple HIG uyumu:**
- iOS'ta native checkbox yoktur; custom implementation HIG'ın toggle/selection pattern'larına uymalıdır.
- Touch target 44pt.
- Animasyon doğal ve hızlı (250ms) olmalıdır.

**Accessibility (a11y) gereksinimleri:**
- `accessibilityRole="checkbox"`.
- `accessibilityState={{ checked, disabled }}`.
- Indeterminate: `accessibilityValue={{ text: "kısmen seçili" }}`.
- Label, checkbox ile ilişkilendirilmelidir (web: `<label htmlFor>`, mobile: `accessibilityLabel`).
- Space tuşu ile toggle edilebilmelidir (web keyboard).

---

## C19: Radio — Radyo Buton Bileşeni

**Açıklama:**
Tek seçimli seçenek listesi için kullanılan bileşendir. RadioGroup container'ı içinde Radio item'lar yer alır. Bir seferde yalnızca bir seçenek aktif olabilir.

**Platform davranışı:**
- **Web:** `<input type="radio">` + custom visual overlay veya `<div role="radio">`.
- **Mobile (React Native):** Pressable + custom circular indicator + Reanimated animasyon.

**Kütüphane:** Custom (Pressable + Reanimated)

**Token tüketimi:**
- `size` → outer: 20px, inner dot: 10px
- `borderColor` → `tokens.color.input.border.[default|focused|disabled]`
- `dotColor` → `tokens.color.brand.primary` (selected)
- `borderRadius` → `tokens.radius.full` (yuvarlak)

**Props (RadioGroup):**
| Prop | Tip | Varsayılan | Açıklama |
|------|-----|-----------|----------|
| `value` | `string` | — | Seçili değer |
| `onChange` | `(value: string) => void` | — | Değer değişim handler |
| `children` | `ReactNode` (Radio item'lar) | — | Radio item'lar |
| `disabled` | `boolean` | `false` | Tüm grup devre dışı |
| `error` | `string` | `undefined` | Hata mesajı |
| `label` | `string` | — | Grup etiketi |

**Props (Radio):**
| Prop | Tip | Varsayılan | Açıklama |
|------|-----|-----------|----------|
| `value` | `string` | — | Bu seçeneğin değeri |
| `label` | `string` | — | Etiket metni |
| `disabled` | `boolean` | `false` | Bu seçenek devre dışı |
| `description` | `string` | `undefined` | Alt açıklama |

**State'ler:**
- **Unselected:** Boş daire, border varsayılan.
- **Selected:** İç dot görünür, brand renk. Animasyon: scale 0 → 1, 200ms spring.
- **Focused:** Focus ring.
- **Disabled:** Opacity 0.5.

**Apple HIG uyumu:**
- iOS'ta radio button yerine genellikle checkmark list kullanılır. Mobile'da ListItem + trailing checkmark pattern'ı alternatif olarak sunulabilir.
- Touch target 44pt.

**Accessibility (a11y) gereksinimleri:**
- RadioGroup: `accessibilityRole="radiogroup"`.
- Radio: `accessibilityRole="radio"`.
- `accessibilityState={{ selected, disabled }}`.
- Arrow key navigasyonu: Yukarı/aşağı ile seçenekler arasında geçiş, seçili olanı değiştirme (web).

---

## C20: Switch — Aç/Kapa Toggle Bileşeni

**Açıklama:**
Boolean on/off toggle bileşenidir. Ayarlar ekranlarında, özellik aktifleştirme/deaktifleştirme gibi anlık durum değişikliklerinde kullanılır. iOS UISwitch benzeri görünüm ve davranış hedeflenir.

**Platform davranışı:**
- **Web:** Custom `<div role="switch">` + animasyonlu thumb.
- **Mobile (React Native):** Custom implementation: Pressable + Reanimated (thumb slide animasyonu + renk geçişi). RN'in built-in `<Switch>` bileşeni yerine custom tercih edilir çünkü: (1) platform tutarlılığı, (2) token-based renk kontrolü, (3) animasyon özelleştirmesi.

**Kütüphane:** Custom (Pressable + react-native-reanimated)

**Token tüketimi:**
- `trackWidth` → 51px (iOS standart)
- `trackHeight` → 31px
- `thumbSize` → 27px
- `trackColor` → on: `tokens.color.brand.primary`, off: `tokens.color.surface.sunken`
- `thumbColor` → `tokens.color.surface.default` (beyaz)
- `borderColor` → off: `tokens.color.border.default`, on: transparent
- Animasyon: `withSpring({ damping: 15, stiffness: 120 })`, ~300ms

**Props:**
| Prop | Tip | Varsayılan | Açıklama |
|------|-----|-----------|----------|
| `value` | `boolean` | `false` | Açık/kapalı durumu |
| `onChange` | `(value: boolean) => void` | — | Değer değişim handler |
| `disabled` | `boolean` | `false` | Devre dışı |
| `label` | `string` | — | Etiket metni |
| `haptic` | `boolean` | `true` | Haptic feedback (mobile) |
| `testID` | `string` | — | Test identifier |

**State'ler:**
- **Off:** Track gri/sunken renk. Thumb solda. Animasyon: off → on geçişte thumb sağa slide, track renk geçişi.
- **On:** Track brand renk. Thumb sağda. Animasyon: on → off geçişte ters yönde.
- **Focused:** Focus ring (Pressable'dan miras).
- **Disabled:** Opacity 0.5. Etkileşime kapalı.

**Apple HIG uyumu:**
- **UISwitch boyutları:** 51x31pt (iOS standart). Bu boyutlar korunmalıdır.
- Toggle geçişi anlık olmalıdır (server beklenmemeli). Hata durumunda revert animasyonu + toast.
- Haptic feedback: `ImpactFeedbackStyle.Light` on toggle.

**Accessibility (a11y) gereksinimleri:**
- `accessibilityRole="switch"`.
- `accessibilityState={{ checked: value, disabled }}`.
- `accessibilityLabel` → label prop'undan veya FieldShell'den gelir.
- VoiceOver: "etiket, aç/kapa, çift dokunarak değiştir" şeklinde okunmalıdır.

---

## C21: Select — Seçim Bileşeni

**Açıklama:**
Dropdown/picker seçim bileşenidir. Seçenek listesinden tek bir değer seçilir. Platform farklılığı en belirgin olan component'lerden biridir.

**Platform davranışı:**
- **Web:** Custom dropdown veya Radix Select kullanılır. Keyboard navigasyon, type-ahead search desteklenir.
- **Mobile (React Native):** BottomSheet (C42, @gorhom/bottom-sheet) içinde seçenek listesi. FlatList ile performanslı render. Seçili item checkmark ile belirtilir.

**Kütüphane:** Web: Custom veya Radix Select. Mobile: @gorhom/bottom-sheet.

**Token tüketimi:**
- Trigger (kapalı hali): TextField (C15) token'ları ile aynı görünüm.
- `chevronIcon` → `tokens.color.icon.secondary`
- Dropdown/BottomSheet: `tokens.color.surface.overlay`, `tokens.shadow.lg`

**Props:**
| Prop | Tip | Varsayılan | Açıklama |
|------|-----|-----------|----------|
| `value` | `string` | — | Seçili değer |
| `onChange` | `(value: string) => void` | — | Değer değişim handler |
| `options` | `{ label: string; value: string; icon?: LucideIconName; disabled?: boolean }[]` | — | Seçenek listesi |
| `placeholder` | `string` | `'Seçiniz...'` | Placeholder metni |
| `disabled` | `boolean` | `false` | Devre dışı |
| `error` | `string` | `undefined` | Hata mesajı |
| `searchable` | `boolean` | `false` | Seçenekler arasında arama |
| `testID` | `string` | — | Test identifier |

**State'ler:**
- **Closed (empty):** Trigger, placeholder gösterir. Chevron down ikonu.
- **Closed (filled):** Trigger, seçili item label'ını gösterir.
- **Open:** Dropdown/BottomSheet açık. Seçenekler listelenmiş. Seçili item vurgulanmış.
- **Searching:** Arama input'u aktif, filtrelenmiş liste.
- **Disabled:** Trigger disabled görünüm.
- **Error:** Trigger error border.

**Apple HIG uyumu:**
- Mobile'da picker için BottomSheet kullanılmalıdır (iOS action sheet benzeri). Alert style picker kullanılmamalıdır.
- Seçili öğe checkmark ile belirtilmelidir (sağ tarafta).
- BottomSheet, gesture ile dismiss edilebilmelidir.

**Accessibility (a11y) gereksinimleri:**
- Web: `role="combobox"` veya `role="listbox"`.
- Mobile: Trigger `accessibilityRole="button"`, BottomSheet açıldığında `accessibilityRole="list"`.
- Arrow key navigasyonu (web): yukarı/aşağı ile seçenekler arası geçiş, Enter ile seçim.
- Escape ile kapatma (web).
- VoiceOver: Seçili değer, seçenek sayısı okunmalıdır.

---

## C22: FieldShell — Form Alanı Kabuğu Bileşeni

**Açıklama:**
Tüm form input'larını saran standart wrapper'dır. Label, input slot, helper text ve error message yapısını sağlar. Her form component'i (TextField, TextArea, Select, Checkbox vb.) FieldShell içinde kullanılmalıdır; bu sayede label-input ilişkilendirmesi, error gösterimi ve layout tutarlılığı garanti altına alınır.

**Platform davranışı:**
- **Web:** `<div>` + `<label>` + input slot + `<span>` (helper/error). `htmlFor`/`id` ile label-input ilişkilendirmesi.
- **Mobile (React Native):** `<View>` + `<Text>` (label) + input slot + `<Text>` (helper/error). `accessibilityLabelledBy` ile ilişkilendirme.

**Token tüketimi:**
- `labelColor` → `tokens.color.text.secondary` (varsayılan), `tokens.color.text.error` (error state)
- `labelFontSize` → `tokens.typography.fontSize.sm` (14px)
- `labelFontWeight` → `tokens.typography.fontWeight.medium`
- `helperColor` → `tokens.color.text.tertiary`
- `helperFontSize` → `tokens.typography.fontSize.xs` (12px)
- `errorColor` → `tokens.color.text.error`
- `errorFontSize` → `tokens.typography.fontSize.xs` (12px)
- `gap` → label ile input arası: `tokens.spacing.1` (4px), input ile helper/error arası: `tokens.spacing.1` (4px)
- `requiredIndicatorColor` → `tokens.color.text.error`

**Props:**
| Prop | Tip | Varsayılan | Açıklama |
|------|-----|-----------|----------|
| `label` | `string` | — | Alan etiketi |
| `htmlFor` | `string` | auto-generated | Web: label-input ilişkilendirme |
| `children` | `ReactNode` | — | Input component slot |
| `helper` | `string` | `undefined` | Yardımcı metin |
| `error` | `string` | `undefined` | Hata mesajı (error varsa helper gizlenir) |
| `required` | `boolean` | `false` | Zorunlu alan işareti (*) |
| `optional` | `boolean` | `false` | İsteğe bağlı etiketi ("(opsiyonel)") |
| `disabled` | `boolean` | `false` | Devre dışı (label'a da uygulanır) |
| `testID` | `string` | — | Test identifier |

**State'ler:**
- **Default:** Label + input + helper (varsa).
- **Error:** Label kırmızıya dönmez (tartışmalı — HIG kırmızı label önermez), error mesajı input altında kırmızı metin + error ikonu ile görünür. Helper gizlenir.
- **Disabled:** Label soluk (disabled opacity).
- **Required:** Label sonuna kırmızı `*` eklenir.
- **Optional:** Label sonuna gri `(opsiyonel)` eklenir.

**Apple HIG uyumu:**
- Label, input'un üstünde konumlanmalıdır (left-aligned veya top-aligned). Placeholder label pattern'ı (floating label) iOS HIG'da önerilmez.
- Error mesajı inline ve input'un hemen altında gösterilmelidir.
- Required indicator (*) label sonunda olmalıdır.

**Accessibility (a11y) gereksinimleri:**
- Web: `<label htmlFor={id}>` ile input ilişkilendirilmelidir.
- Mobile: `accessibilityLabelledBy` veya input `accessibilityLabel` ile.
- Error mesajı: `role="alert"` (web) + `accessibilityLiveRegion="polite"` (mobile) ile announce edilmelidir.
- Required: `aria-required="true"` (web).
- Helper text: `aria-describedby` (web) ile input'a bağlanmalıdır.

---

## C23: FormGroup — Form Gruplama Bileşeni

**Açıklama:**
İlişkili form alanlarını semantik olarak gruplayan container bileşenidir. Web'de `<fieldset>` + `<legend>`, mobile'da `accessibilityRole="group"` ile semantic gruplandırma sağlar.

**Platform davranışı:**
- **Web:** `<fieldset>` + `<legend>` render eder. Tarayıcı varsayılan fieldset border'ı CSS reset ile sıfırlanır.
- **Mobile (React Native):** `<View accessibilityRole="group">` + `<Text>` (başlık).

**Token tüketimi:**
- `legendFontSize` → `tokens.typography.fontSize.base`
- `legendFontWeight` → `tokens.typography.fontWeight.semibold`
- `legendColor` → `tokens.color.text.primary`
- `gap` → Alanlar arası: `tokens.spacing.4` (16px)
- `legendMarginBottom` → `tokens.spacing.3` (12px)

**Props:**
| Prop | Tip | Varsayılan | Açıklama |
|------|-----|-----------|----------|
| `legend` | `string` | — | Grup başlığı |
| `children` | `ReactNode` | — | Form alanları |
| `description` | `string` | `undefined` | Grup açıklaması |
| `testID` | `string` | — | Test identifier |

**State'ler:**
- FormGroup stateless'tır.

**Apple HIG uyumu:**
- Gruplar arası spacing, HIG grouped content pattern'ına uygun olmalıdır (16-20pt).
- Grup başlığı (legend) uppercase overline style ile ayırt edilebilir.

**Accessibility (a11y) gereksinimleri:**
- Web: `<fieldset>` + `<legend>` — screen reader grup başlığını ve içeriği ilişkilendirir.
- Mobile: `accessibilityRole="group"` + `accessibilityLabel={legend}`.
- Grup açıklaması: `aria-describedby` (web).

---

## C24: FormActions — Form Aksiyon Container Bileşeni

**Açıklama:**
Form submit ve cancel butonlarının standart container'ıdır. Butonları yatay veya dikey olarak dizer. Opsiyonel olarak sticky bottom (ekranın altına yapışık) davranışı destekler.

**Platform davranışı:**
- **Web:** `<div>` + flex layout. Sticky bottom: `position: sticky; bottom: 0`.
- **Mobile (React Native):** `<View>` + flex layout. Sticky bottom: ScrollView dışında absolute positioning + safe area bottom padding.

**Token tüketimi:**
- `gap` → Butonlar arası: `tokens.spacing.3` (12px)
- `padding` → `tokens.spacing.4` (16px)
- `backgroundColor` → `tokens.color.surface.default` (sticky mode'da backdrop)
- `borderTop` → sticky mode'da `tokens.color.border.subtle` (1px)

**Props:**
| Prop | Tip | Varsayılan | Açıklama |
|------|-----|-----------|----------|
| `children` | `ReactNode` | — | Butonlar |
| `direction` | `'horizontal'` \| `'vertical'` | `'horizontal'` | Dizim yönü |
| `align` | `'start'` \| `'center'` \| `'end'` \| `'stretch'` | `'end'` | Hizalama |
| `sticky` | `boolean` | `false` | Altta yapışık |
| `testID` | `string` | — | Test identifier |

**State'ler:**
- **Default:** Normal layout.
- **Sticky:** Ekranın altında sabit. İçerik scroll olurken butonlar her zaman görünür.

**Apple HIG uyumu:**
- Primary buton sağda (LTR) konumlanmalıdır.
- Destructive buton (varsa) en solda veya ayrı satırda olmalıdır.
- Sticky mode'da safe area bottom padding uygulanmalıdır.
- Mobile'da full-width butonlar dikey dizimde tercih edilebilir.

**Accessibility (a11y) gereksinimleri:**
- Buton sırası: Tab order, visual order ile eşleşmelidir.
- Sticky mode'da butonlar scroll içeriğini örtmemelidir (son element'in altına yeterli padding bırakılmalıdır).

---

# 13. Varsayılan Component'ler — Veri Gösterimi (Tier 2)

Data display component'leri, kullanıcıya bilgi sunan ancak doğrudan input almayan bileşenlerdir. Liste öğeleri, kartlar, avatarlar, badge'ler ve tag'ler bu kategoriye girer.

---

## C25: Avatar — Profil Görseli Bileşeni

**Açıklama:**
Kullanıcı profil fotoğrafı, grup görseli veya entity ikonu göstermek için kullanılan bileşendir. Görsel yüklenemezse initials (baş harfler) veya fallback ikon gösterir.

**Platform davranışı:**
- **Web:** `<img>` + CSS border-radius. Lazy loading desteklenir.
- **Mobile (React Native):** `expo-image` kütüphanesi ile render edilir. Avantajları: disk cache, memory cache, blur placeholder, progressive loading, animated format desteği (WebP, AVIF).

**Kütüphane:** `expo-image` (mobile — cache, blur placeholder, format desteği için)

**Token tüketimi:**
- `size` → xs: 24px, sm: 32px, md: 40px, lg: 56px, xl: 80px
- `borderRadius` → `tokens.radius.full` (yuvarlak)
- `borderWidth` → `tokens.border.width.thin` (opsiyonel, grup listesinde)
- `borderColor` → `tokens.color.border.default`
- `backgroundColor` → `tokens.color.surface.sunken` (fallback arka planı)
- `initialsColor` → `tokens.color.text.primary`
- `initialsFontSize` → size'a oranla: xs: 10px, sm: 12px, md: 14px, lg: 20px, xl: 28px
- `initialsFontWeight` → `tokens.typography.fontWeight.semibold`

**Props:**
| Prop | Tip | Varsayılan | Açıklama |
|------|-----|-----------|----------|
| `source` | `string` (URL) \| `ImageSource` | `undefined` | Görsel kaynağı |
| `name` | `string` | — | Kullanıcı adı (initials ve a11y için) |
| `size` | `'xs'` \| `'sm'` \| `'md'` \| `'lg'` \| `'xl'` | `'md'` | Boyut |
| `fallbackIcon` | `LucideIconName` | `'User'` | Görsel yokken ikon |
| `showBorder` | `boolean` | `false` | Border göster |
| `testID` | `string` | — | Test identifier |

**State'ler:**
- **Loading:** Blur placeholder veya skeleton (expo-image placeholder özelliği).
- **Loaded:** Görsel tam yüklendi, blur'dan temize geçiş animasyonu (200ms crossfade).
- **Error/Fallback — Initials:** Görsel yüklenemedi. Arka plan renk token'ı + isim baş harfleri (max 2 harf).
- **Error/Fallback — Icon:** İsim de yoksa fallback ikon (User ikonu) gösterilir.

**Apple HIG uyumu:**
- Avatar her zaman yuvarlak olmalıdır (iOS standart profile image pattern).
- Placeholder ve loading state'te layout shift olmamalıdır (sabit boyut).
- Group avatar listesinde overlap layout desteklenmelidir (negatif margin).

**Accessibility (a11y) gereksinimleri:**
- `accessibilityLabel` → `name` prop'undan otomatik: `"[name] profil fotoğrafı"`.
- Decorative kullanımda (yanında isim metni varsa): `accessibilityElementsHidden={true}`.
- Image yüklenemediğinde fallback text'in a11y'de erişilebilir olması gerekmez (label yeterli).

---

## C26: Badge — Durum Etiketi Bileşeni

**Açıklama:**
Küçük durum göstergesi bileşenidir. Başlık yanında, avatar üzerinde veya liste öğesinde durum bilgisi sunar. Farklı renk variant'ları ile durumu görsel olarak ayırt eder.

**Platform davranışı:**
- **Web ve Mobile:** Aynı yapı. `<View>` / `<span>` + ikon (opsiyonel) + metin.

**Token tüketimi:**
- `backgroundColor` → `tokens.color.badge.[default|success|warning|error|info].background`
- `textColor` → `tokens.color.badge.[default|success|warning|error|info].text`
- `borderRadius` → `tokens.radius.full` (pill shape)
- `paddingX` → `tokens.spacing.2` (8px)
- `paddingY` → `tokens.spacing.0.5` (2px)
- `fontSize` → `tokens.typography.fontSize.xs` (12px)
- `fontWeight` → `tokens.typography.fontWeight.medium`
- `iconSize` → 12px
- `dotSize` → 6px (dot variant)

**Props:**
| Prop | Tip | Varsayılan | Açıklama |
|------|-----|-----------|----------|
| `label` | `string` | — | Badge metni |
| `variant` | `'default'` \| `'success'` \| `'warning'` \| `'error'` \| `'info'` | `'default'` | Renk varyantı |
| `icon` | `LucideIconName` | `undefined` | Sol ikon |
| `dot` | `boolean` | `false` | Yalnızca nokta göster (metin yok) |
| `size` | `'sm'` \| `'md'` | `'sm'` | Boyut |
| `testID` | `string` | — | Test identifier |

**State'ler:**
- Badge stateless'tır (görsel durum göstergesi, interaktif değil).

**Variant'lar:**
- **Default:** Nötr gri arka plan. Genel durum bilgisi.
- **Success:** Yeşil arka plan. Tamamlandı, aktif, onaylandı.
- **Warning:** Turuncu/sarı arka plan. Dikkat gerektiren durum.
- **Error:** Kırmızı arka plan. Hata, reddedildi, başarısız.
- **Info:** Mavi arka plan. Bilgilendirme.

**Apple HIG uyumu:**
- Badge metni kısa olmalıdır (1-2 kelime).
- Notification badge (dot variant) avatar veya ikon üst-sağ köşesine konumlanmalıdır.
- Renk tek başına anlam taşımamalıdır; ikon veya metin ile desteklenmelidir.

**Accessibility (a11y) gereksinimleri:**
- `accessibilityRole="text"`.
- `accessibilityLabel` → `"Durum: [variant] — [label]"`.
- Dot variant'ta (metin yok): `accessibilityLabel` zorunludur (ör. `"Okunmamış bildirim"`).
- Renk körü kullanıcılar için ikon ile destekleme önerilir.

---

## C27: Chip / Tag — Filtre Etiketi Bileşeni

**Açıklama:**
Filtre, kategori veya etiket göstermek için kullanılan kompakt bileşendir. Opsiyonel olarak silinebilir (dismissible) özelliği vardır. Seçim (selection) modunda toggle davranışı gösterir.

**Platform davranışı:**
- **Web ve Mobile:** Aynı yapı. Pressable (C07) + metin + dismiss ikonu.

**Token tüketimi:**
- `backgroundColor` → selected: `tokens.color.brand.primary.soft`, unselected: `tokens.color.surface.sunken`
- `textColor` → selected: `tokens.color.brand.primary`, unselected: `tokens.color.text.secondary`
- `borderRadius` → `tokens.radius.full` (pill)
- `borderWidth` → `tokens.border.width.thin`
- `borderColor` → selected: `tokens.color.brand.primary`, unselected: `tokens.color.border.default`
- `paddingX` → `tokens.spacing.3` (12px)
- `paddingY` → `tokens.spacing.1` (4px)
- `fontSize` → `tokens.typography.fontSize.sm` (14px)
- `height` → 32px
- `dismissIconSize` → 14px

**Props:**
| Prop | Tip | Varsayılan | Açıklama |
|------|-----|-----------|----------|
| `label` | `string` | — | Etiket metni |
| `selected` | `boolean` | `false` | Seçili durumu |
| `onPress` | `() => void` | `undefined` | Tıklama/seçim handler |
| `onDismiss` | `() => void` | `undefined` | Silme handler (verilirse X ikonu görünür) |
| `icon` | `LucideIconName` | `undefined` | Sol ikon |
| `disabled` | `boolean` | `false` | Devre dışı |
| `testID` | `string` | — | Test identifier |

**State'ler:**
- **Unselected:** Varsayılan arka plan, muted metin. Pressable ise hover/press feedback.
- **Selected:** Brand renk arka plan (soft), brand metin. Toggle animasyonu: background crossfade 150ms.
- **Dismissible:** Sağ tarafta X ikonu. Dismiss'te fade-out + scale-down animasyonu (150ms).
- **Disabled:** Opacity 0.5.

**Apple HIG uyumu:**
- Chip yüksekliği 32pt (kompakt) olmalıdır.
- Dismiss ikonu yeterince büyük touch target'a sahip olmalıdır (minimum 44pt hitSlop).
- Filtre chip grupları yatay scroll veya wrap layout olmalıdır.

**Accessibility (a11y) gereksinimleri:**
- Selectable: `accessibilityRole="checkbox"` veya `"button"`, `accessibilityState={{ selected }}`.
- Dismissible: Dismiss butonu `accessibilityLabel="[label] etiketini kaldır"`.
- Chip grubu: `accessibilityRole="group"`.

---

## C28: Card — İçerik Kartı Bileşeni

**Açıklama:**
İlişkili içeriği gruplandıran yükseltilmiş yüzey bileşenidir. Header, body ve footer bölümlerinden oluşur. Opsiyonel olarak tıklanabilir (Pressable wrapper ile).

**Platform davranışı:**
- **Web:** `<article>` veya `<div>` + Box/Surface (C03). Hover shadow elevation.
- **Mobile (React Native):** `<View>` + shadow token'ları. Pressable ise C07 wrapper.

**Token tüketimi:**
- `backgroundColor` → `tokens.color.surface.raised`
- `borderRadius` → `tokens.radius.lg` (12px)
- `borderWidth` → `tokens.border.width.thin`
- `borderColor` → `tokens.color.border.subtle`
- `shadow` → `tokens.shadow.sm` (varsayılan), hover: `tokens.shadow.md`
- `padding` → `tokens.spacing.4` (16px)
- `headerPaddingBottom` → `tokens.spacing.3` (12px)
- `footerPaddingTop` → `tokens.spacing.3` (12px)
- `footerBorderTop` → `tokens.color.border.subtle` + `tokens.border.width.thin`

**Props:**
| Prop | Tip | Varsayılan | Açıklama |
|------|-----|-----------|----------|
| `children` | `ReactNode` | — | Kart içeriği |
| `onPress` | `() => void` | `undefined` | Tıklama handler (verilirse pressable olur) |
| `header` | `ReactNode` | `undefined` | Kart başlığı slot |
| `footer` | `ReactNode` | `undefined` | Kart alt bilgisi slot |
| `noPadding` | `boolean` | `false` | Padding kaldır (image card) |
| `testID` | `string` | — | Test identifier |

**State'ler:**
- **Default:** Normal card görünümü, hafif shadow.
- **Hovered (web, pressable):** Shadow artışı (sm → md). Slight scale (1.01).
- **Pressed (pressable):** Opacity/scale feedback (Pressable'dan).
- **Focused (pressable):** Focus ring.

**Apple HIG uyumu:**
- Card'lar arasında yeterli spacing olmalıdır (minimum 16pt).
- Card border-radius, iOS continuous corner radius (squircle) kullanmalıdır.
- Pressable card'larda tüm card alanı tıklanabilir olmalıdır (sadece başlık değil).

**Accessibility (a11y) gereksinimleri:**
- Pressable card: `accessibilityRole="button"`, `accessibilityLabel` ile kart içeriğinin özeti.
- Non-pressable card: `accessibilityRole="group"` veya semantik container (web: `<article>`).
- Card içindeki etkileşimli öğeler ayrı focus stop'lar olarak erişilebilir olmalıdır.

---

## C29: ListItem — Liste Satırı Bileşeni

**Açıklama:**
Liste görünümlerinin temel satır bileşenidir. Leading (sol alan: ikon, avatar, checkbox), content (başlık + alt başlık), trailing (sağ alan: badge, chevron, switch) olmak üzere üç slot'tan oluşur.

**Platform davranışı:**
- **Web:** `<div role="row">` veya `<li>` olarak render edilir. Hover background.
- **Mobile (React Native):** Pressable (C07) wrapper. Ripple/opacity feedback.

**Token tüketimi:**
- `minHeight` → 44px (HIG minimum)
- `paddingX` → `tokens.spacing.4` (16px)
- `paddingY` → `tokens.spacing.3` (12px)
- `backgroundColor` → `tokens.color.surface.default`, hover: `tokens.color.surface.sunken`
- `titleFontSize` → `tokens.typography.fontSize.base`
- `titleColor` → `tokens.color.text.primary`
- `subtitleFontSize` → `tokens.typography.fontSize.sm`
- `subtitleColor` → `tokens.color.text.secondary`
- `gap` (leading-content) → `tokens.spacing.3` (12px)
- `gap` (content-trailing) → `tokens.spacing.3` (12px)
- `dividerInset` → `tokens.spacing.4` + leading width (iOS pattern)

**Props:**
| Prop | Tip | Varsayılan | Açıklama |
|------|-----|-----------|----------|
| `title` | `string` | — | Ana başlık |
| `subtitle` | `string` | `undefined` | Alt başlık |
| `leading` | `ReactNode` | `undefined` | Sol alan (avatar, ikon, checkbox) |
| `trailing` | `ReactNode` | `undefined` | Sağ alan (badge, chevron, switch) |
| `onPress` | `() => void` | `undefined` | Tıklama handler |
| `showChevron` | `boolean` | Otomatik (onPress varsa) | Sağ chevron ikonu |
| `showDivider` | `boolean` | `true` | Alt divider |
| `disabled` | `boolean` | `false` | Devre dışı |
| `destructive` | `boolean` | `false` | Kırmızı metin (silme aksiyonu) |
| `testID` | `string` | — | Test identifier |

**State'ler:**
- **Default:** Normal satır. Divider görünür.
- **Hovered (web):** Hafif background değişimi.
- **Pressed:** Opacity/scale feedback.
- **Disabled:** Opacity 0.5.
- **Destructive:** Başlık rengi kırmızı (error token). Silme, çıkış gibi aksiyonlar için.

**Apple HIG uyumu:**
- **44pt minimum height:** Her satır en az 44pt yüksekliğinde olmalıdır.
- Navigation satırları (detay sayfasına gider) sağda chevron (>) göstermelidir.
- Disclosure satırları (genişletir) sağda disclosure indicator göstermelidir.
- Destructive satırlar (silme) kırmızı metin ile gösterilmelidir.
- Divider, leading content hizasından başlamalıdır (iOS inset separator pattern).
- Swipe action desteği opsiyonel olarak eklenebilir (react-native-gesture-handler).

**Accessibility (a11y) gereksinimleri:**
- Pressable: `accessibilityRole="button"`.
- `accessibilityLabel` → `"[title], [subtitle]"` otomatik birleştirilir.
- `accessibilityHint` → navigasyon satırında `"Detaya gitmek için çift dokunun"`.
- Liste içinde: parent `accessibilityRole="list"`, her item `accessibilityRole="listitem"` (web: `<ul>/<li>`).

---

## C30: SectionHeader — Bölüm Başlığı Bileşeni

**Açıklama:**
Liste ve form gruplarının başlık bileşenidir. Bölüm başlığı + opsiyonel sağ aksiyon (örn. "Tümünü Gör" butonu) içerir.

**Platform davranışı:**
- **Web ve Mobile:** Aynı yapı. HStack (C04) + Heading (C02) + opsiyonel action button.

**Token tüketimi:**
- `titleFontSize` → `tokens.typography.fontSize.sm` (14px)
- `titleFontWeight` → `tokens.typography.fontWeight.semibold`
- `titleColor` → `tokens.color.text.secondary`
- `titleTextTransform` → uppercase
- `titleLetterSpacing` → `tokens.typography.letterSpacing.wide`
- `paddingX` → `tokens.spacing.4` (16px)
- `paddingY` → `tokens.spacing.3` (12px)
- `backgroundColor` → `tokens.color.surface.sunken` (opsiyonel, grouped style)
- `actionFontSize` → `tokens.typography.fontSize.sm`
- `actionColor` → `tokens.color.text.link`

**Props:**
| Prop | Tip | Varsayılan | Açıklama |
|------|-----|-----------|----------|
| `title` | `string` | — | Bölüm başlığı |
| `action` | `{ label: string; onPress: () => void }` | `undefined` | Sağ aksiyon |
| `sticky` | `boolean` | `false` | Scroll'da yapışık |
| `testID` | `string` | — | Test identifier |

**State'ler:**
- **Default:** Normal başlık.
- **Sticky:** Scroll sırasında üstte yapışık. Background opak olmalıdır.

**Apple HIG uyumu:**
- iOS grouped table section header pattern'ı: uppercase, small font, secondary color.
- Sticky header'lar section geçişlerinde smooth animasyon ile geçmelidir.

**Accessibility (a11y) gereksinimleri:**
- `accessibilityRole="header"`.
- Action: Ayrı focusable element, `accessibilityRole="button"`.

---

## C31: KeyValueRow — Anahtar-Değer Bilgi Satırı Bileşeni

**Açıklama:**
Profil detay, ayarlar, sipariş bilgisi gibi ekranlarda "etiket: değer" formatında bilgi gösteren bileşendir.

**Platform davranışı:**
- **Web ve Mobile:** HStack (C04) + label Text + value Text. Label sol hizalı, value sağ hizalı veya sola dayalı.

**Token tüketimi:**
- `labelFontSize` → `tokens.typography.fontSize.sm`
- `labelColor` → `tokens.color.text.secondary`
- `valueFontSize` → `tokens.typography.fontSize.base`
- `valueColor` → `tokens.color.text.primary`
- `valueFontWeight` → `tokens.typography.fontWeight.medium`
- `paddingY` → `tokens.spacing.3` (12px)
- `minHeight` → 44px

**Props:**
| Prop | Tip | Varsayılan | Açıklama |
|------|-----|-----------|----------|
| `label` | `string` | — | Etiket |
| `value` | `string` \| `ReactNode` | — | Değer (metin veya custom render) |
| `copyable` | `boolean` | `false` | Değeri kopyalayabilme |
| `onPress` | `() => void` | `undefined` | Tıklama handler (düzenleme navigasyonu vb.) |
| `showDivider` | `boolean` | `true` | Alt divider |
| `testID` | `string` | — | Test identifier |

**State'ler:**
- **Default:** Label + value gösterimi.
- **Copyable:** Long-press veya copy ikonu ile değer kopyalanabilir. Kopyalandığında toast gösterilir.
- **Pressable:** Sağda chevron, hover/press feedback.

**Apple HIG uyumu:**
- Label:value format, iOS Settings app pattern'ını takip etmelidir.
- Min height 44pt.
- Kopyalanabilir değerlerde context menu veya copy feedback (haptic + toast).

**Accessibility (a11y) gereksinimleri:**
- `accessibilityLabel` → `"[label]: [value]"`.
- Copyable: `accessibilityHint="Kopyalamak için uzun basın"`.
- Pressable: `accessibilityRole="button"`.

---

# 14. Varsayılan Component'ler — Geri Bildirim Katmanı (Tier 2)

Feedback component'leri, uygulamanın durumu hakkında kullanıcıyı bilgilendiren bileşenlerdir. Loading, error, success, empty gibi durumları görsel olarak ifade ederler.

---

## C32: Toast — Geçici Bildirim Bileşeni

**Açıklama:**
Kullanıcıya kısa süreli geri bildirim gösteren geçici bildirim bileşenidir. Ekranın üstünden veya altından kayarak girer, belirli süre sonra otomatik kaybolur.

**Platform davranışı:**
- **Web:** `sonner` kütüphanesi kullanılır. Hot-toastable, stack'lenebilir, swipe-to-dismiss.
- **Mobile (React Native):** Custom implementation: Reanimated (slide animasyonu) + react-native-gesture-handler (swipe dismiss). Global toast queue yönetimi Zustand store'da.

**Kütüphane:** Web: `sonner` (v2). Mobile: Custom (react-native-reanimated + react-native-gesture-handler).

**Token tüketimi:**
- `backgroundColor` → `tokens.color.toast.[info|success|warning|error].background`
- `textColor` → `tokens.color.toast.[info|success|warning|error].text`
- `borderRadius` → `tokens.radius.lg` (12px)
- `shadow` → `tokens.shadow.lg`
- `padding` → `tokens.spacing.4` (16px)
- `iconSize` → 20px
- `fontSize` → `tokens.typography.fontSize.sm` (14px)
- `maxWidth` → 420px (web), full-width - 32px margin (mobile)
- Animasyon: slide-in 300ms, slide-out 200ms, `withSpring` (mobile)

**Props (toast fonksiyonu — imperative API):**
```typescript
toast.info(message: string, options?: ToastOptions)
toast.success(message: string, options?: ToastOptions)
toast.warning(message: string, options?: ToastOptions)
toast.error(message: string, options?: ToastOptions)

interface ToastOptions {
  description?: string;      // Alt açıklama
  duration?: number;          // Otomatik kapanma süresi (ms), varsayılan: 4000
  action?: {                  // Aksiyon butonu (ör. "Geri Al")
    label: string;
    onPress: () => void;
  };
  dismissible?: boolean;      // Swipe ile kapatılabilir, varsayılan: true
  id?: string;                // Duplicate prevention
}
```

**Variant'lar:**
- **Info:** Mavi ikon + arka plan. Bilgilendirme mesajları. Ör: "Ayarlarınız güncellendi."
- **Success:** Yeşil check ikonu + arka plan. Başarı mesajları. Ör: "Kayıt başarılı." Duration: 3000ms.
- **Warning:** Turuncu uyarı ikonu + arka plan. Dikkat mesajları. Ör: "Bağlantınız yavaş." Duration: 5000ms.
- **Error:** Kırmızı hata ikonu + arka plan. Hata mesajları. Ör: "İşlem başarısız." Duration: 0 (otomatik kapanmaz, kullanıcı kapatmalıdır).

**State'ler:**
- **Entering:** Slide-in animasyonu (yukarıdan veya aşağıdan, pozisyona göre).
- **Visible:** Statik görünüm. Auto-dismiss timer çalışıyor.
- **Swiping:** Kullanıcı swipe ile dismiss ediyor. Drag-follow animasyonu.
- **Exiting:** Slide-out veya fade-out animasyonu.

**Apple HIG uyumu:**
- Toast, native iOS notification banner'ı ile çakışmamalıdır. Safe area içinde konumlanmalıdır.
- Haptic feedback: success → `NotificationFeedbackType.Success`, error → `NotificationFeedbackType.Error`.
- Error toast otomatik kapanmamalıdır (HIG: kullanıcı hata mesajını okuyabilmelidir).

**Accessibility (a11y) gereksinimleri:**
- `accessibilityRole="alert"` (web: `role="alert"`).
- `accessibilityLiveRegion="assertive"` (error) veya `"polite"` (info, success, warning).
- Screen reader toast mesajını otomatik okumalıdır.
- Auto-dismiss süresi, screen reader aktifken uzatılmalıdır (minimum 8 saniye).
- Undo action'ı keyboard/VoiceOver ile erişilebilir olmalıdır.

---

## C33: Banner — Kalıcı Bildirim Bileşeni

**Açıklama:**
Sayfanın üstünde veya belirli bir bölümde gösterilen kalıcı bildirim bileşenidir. Toast'tan farkı: kullanıcı kapatana kadar veya koşul değişene kadar görünür kalır. Network offline, maintenance mode, güncelleme uyarısı gibi durumlar için kullanılır.

**Platform davranışı:**
- **Web ve Mobile:** Aynı yapı. Box (C03) + ikon + metin + opsiyonel aksiyon + dismiss.

**Token tüketimi:**
- `backgroundColor` → `tokens.color.banner.[info|warning|error|success].background`
- `textColor` → `tokens.color.banner.[info|warning|error|success].text`
- `iconColor` → `tokens.color.banner.[info|warning|error|success].icon`
- `borderColor` → `tokens.color.banner.[info|warning|error|success].border`
- `padding` → `tokens.spacing.3` (12px)
- `iconSize` → 20px
- `fontSize` → `tokens.typography.fontSize.sm`

**Props:**
| Prop | Tip | Varsayılan | Açıklama |
|------|-----|-----------|----------|
| `message` | `string` | — | Bildirim metni |
| `variant` | `'info'` \| `'warning'` \| `'error'` \| `'success'` | `'info'` | Renk varyantı |
| `icon` | `LucideIconName` | Otomatik (variant'a göre) | Sol ikon |
| `action` | `{ label: string; onPress: () => void }` | `undefined` | Aksiyon butonu |
| `dismissible` | `boolean` | `false` | Kapatılabilir |
| `onDismiss` | `() => void` | `undefined` | Kapatma handler |
| `testID` | `string` | — | Test identifier |

**State'ler:**
- **Visible:** Normal banner görünümü.
- **Dismissed:** Fade-out + collapse animasyonu (200ms). Layout shift smooth olmalıdır.

**Apple HIG uyumu:**
- Banner, navigation bar'ın hemen altında konumlanmalıdır.
- Error ve warning banner'lar dismissible olmamalıdır (durum devam ettiği sürece).

**Accessibility (a11y) gereksinimleri:**
- `accessibilityRole="alert"` (error/warning) veya `"status"` (info/success).
- Screen reader banner mesajını otomatik okumalıdır.
- Dismiss butonu: `accessibilityLabel="Bildirimi kapat"`.

---

## C34: Skeleton — Yükleme İskeleti Bileşeni

**Açıklama:**
İçerik yüklenirken gösterilen placeholder bileşenidir. Shimmer (parıltı) animasyonu ile yükleme durumunu görsel olarak ifade eder. İçerik layout'unu taklit eder; bu sayede layout shift minimuma iner.

**Platform davranışı:**
- **Web:** CSS gradient animation veya pseudo-element shimmer.
- **Mobile (React Native):** react-native-reanimated ile shimmer animasyonu. `LinearGradient` (expo-linear-gradient) + animated translateX.

**Kütüphane:** react-native-reanimated (animasyon), expo-linear-gradient (shimmer efekti)

**Token tüketimi:**
- `backgroundColor` → `tokens.color.skeleton.base` (açık gri)
- `shimmerColor` → `tokens.color.skeleton.shimmer` (daha açık gri/beyaz)
- `borderRadius` → İçerik tipine göre: text → `tokens.radius.sm`, image → `tokens.radius.md`, avatar → `tokens.radius.full`
- `animationDuration` → 1500ms (1.5 saniye loop)
- `animationTimingFunction` → `ease-in-out`

**Props:**
| Prop | Tip | Varsayılan | Açıklama |
|------|-----|-----------|----------|
| `width` | `number` \| `string` | `'100%'` | Genişlik |
| `height` | `number` | `16` | Yükseklik |
| `radius` | `RadiusToken` | `'sm'` | Köşe yuvarlaklığı |
| `circle` | `boolean` | `false` | Daire shape (avatar placeholder) |
| `animated` | `boolean` | `true` | Shimmer animasyonu aktif |
| `testID` | `string` | — | Test identifier |

**State'ler:**
- **Animating:** Shimmer loop çalışıyor. Sonsuz döngü.
- **Static:** `animated={false}` ise sadece gri blok, shimmer yok (reduced motion).

**Apple HIG uyumu:**
- Skeleton, gerçek içerik layout'unu yaklaşık olarak taklit etmelidir (aynı yükseklik, genişlik).
- Shimmer animasyonu subtle olmalıdır (dikkat dağıtmamalı).
- `prefers-reduced-motion` aktifken shimmer kapatılmalı, static gray gösterilmelidir.

**Accessibility (a11y) gereksinimleri:**
- `accessibilityElementsHidden={true}` (mobile) — screen reader skeleton'ları görmezden gelir.
- `aria-hidden="true"` (web).
- Skeleton yerine yükleme durumu, parent container'da `accessibilityLabel="Yükleniyor"` + `accessibilityState={{ busy: true }}` ile belirtilmelidir.
- Reduced motion: `prefers-reduced-motion` veya `accessibilityReduceMotionEnabled` durumunda shimmer devre dışı.

---

## C35: Spinner — Dönen Gösterge Bileşeni

**Açıklama:**
Belirsiz süreli yükleme işlemleri için dönen gösterge bileşenidir. Button loading, inline loading, page loading gibi yerlerde kullanılır.

**Platform davranışı:**
- **Web:** CSS `@keyframes spin` animasyonu veya SVG animasyonu.
- **Mobile (React Native):** `ActivityIndicator` (built-in) veya custom Reanimated rotation animasyonu (token-based renk kontrolü için).

**Kütüphane:** Built-in `ActivityIndicator` (varsayılan) veya custom (react-native-reanimated — renk özelleştirmesi gerekirse).

**Token tüketimi:**
- `color` → `tokens.color.icon.[primary|secondary|inverse]`
- `size` → sm: 16px, md: 24px, lg: 32px
- `animationDuration` → 750ms (bir tur)

**Props:**
| Prop | Tip | Varsayılan | Açıklama |
|------|-----|-----------|----------|
| `size` | `'sm'` \| `'md'` \| `'lg'` | `'md'` | Boyut |
| `color` | `IconColorToken` | `'primary'` | Renk |
| `accessibilityLabel` | `string` | `'Yükleniyor'` | a11y etiketi |
| `testID` | `string` | — | Test identifier |

**State'ler:**
- **Spinning:** Sürekli dönen animasyon.

**Apple HIG uyumu:**
- iOS ActivityIndicator boyutları: small (20pt), large (37pt). Custom boyutlar bu aralıklara yakın olmalıdır.
- Spinner tek başına yeterli bilgi vermez; yanında metin ("Yükleniyor...") gösterilmesi önerilir.

**Accessibility (a11y) gereksinimleri:**
- `accessibilityRole="progressbar"` (belirsiz).
- `accessibilityLabel="Yükleniyor"` varsayılan.
- `accessibilityState={{ busy: true }}`.
- Reduced motion: Animasyon hızı düşürülmeli veya statik ikon gösterilmelidir.

---

## C36: ProgressBar — İlerleme Çubuğu Bileşeni

**Açıklama:**
Belirli yüzde ilerlemesi gösteren çubuk bileşenidir. Dosya yükleme, profil tamamlama, step progress gibi işlemlerde kullanılır.

**Platform davranışı:**
- **Web ve Mobile:** Box (C03) + inner filled box. Animasyonlu geçiş (width değişimi).

**Token tüketimi:**
- `trackColor` → `tokens.color.surface.sunken`
- `fillColor` → `tokens.color.brand.primary` (varsayılan), `tokens.color.feedback.success` (tamamlandı), `tokens.color.feedback.error` (hata)
- `height` → 4px (sm), 8px (md)
- `borderRadius` → `tokens.radius.full`
- Animasyon: width geçişi `withTiming(300ms, easeInOut)`

**Props:**
| Prop | Tip | Varsayılan | Açıklama |
|------|-----|-----------|----------|
| `value` | `number` | `0` | İlerleme yüzdesi (0-100) |
| `variant` | `'default'` \| `'success'` \| `'error'` | `'default'` | Renk |
| `size` | `'sm'` \| `'md'` | `'sm'` | Kalınlık |
| `showLabel` | `boolean` | `false` | Yüzde etiketi göster |
| `accessibilityLabel` | `string` | `'İlerleme'` | a11y etiketi |
| `testID` | `string` | — | Test identifier |

**State'ler:**
- **Determinate:** 0-100 arası ilerleme.
- **Complete:** %100 — variant otomatik success'e geçebilir.

**Apple HIG uyumu:**
- İlerleme çubuğu kullanıcıya ne kadar bekleme gerektiğini göstermelidir.
- Animasyon smooth olmalıdır (ani atlamalar yok).

**Accessibility (a11y) gereksinimleri:**
- `accessibilityRole="progressbar"`.
- `accessibilityValue={{ min: 0, max: 100, now: value }}`.
- Önemli ilerleme noktalarında (25%, 50%, 75%, 100%) `aria-live="polite"` announce.

---

## C37: EmptyState — Boş Durum Bileşeni

**Açıklama:**
İçerik olmadığında gösterilen placeholder bileşenidir. İkon, başlık, açıklama ve CTA (call-to-action) butonu içerir. Her liste, arama sonucu ve veri alanı için empty state tanımlanmalıdır.

**Platform davranışı:**
- **Web ve Mobile:** Aynı yapı. VStack (C04) + Icon (C08) + Heading (C02) + Text (C01) + Button (C13).

**Token tüketimi:**
- `iconSize` → 48px
- `iconColor` → `tokens.color.icon.tertiary`
- `titleFontSize` → `tokens.typography.fontSize.lg`
- `titleColor` → `tokens.color.text.primary`
- `descriptionFontSize` → `tokens.typography.fontSize.sm`
- `descriptionColor` → `tokens.color.text.secondary`
- `gap` → `tokens.spacing.4` (16px)
- `padding` → `tokens.spacing.8` (32px)
- `maxWidth` → 320px (metin genişliği)

**Props:**
| Prop | Tip | Varsayılan | Açıklama |
|------|-----|-----------|----------|
| `icon` | `LucideIconName` | — | Durum ikonu |
| `title` | `string` | — | Başlık |
| `description` | `string` | `undefined` | Açıklama metni |
| `action` | `{ label: string; onPress: () => void }` | `undefined` | CTA butonu |
| `illustration` | `ReactNode` | `undefined` | Özel illüstrasyon (ikon yerine) |
| `testID` | `string` | — | Test identifier |

**State'ler:**
- EmptyState stateless'tır.

**Apple HIG uyumu:**
- Empty state mesajı empatik ve yönlendirici olmalıdır ("Henüz öğe yok. İlk öğenizi ekleyin.").
- CTA butonu varsa primary variant olmalıdır.
- İkon veya illüstrasyon, mesajı görsel olarak desteklemelidir.

**Accessibility (a11y) gereksinimleri:**
- Başlık: `accessibilityRole="header"`.
- Tüm içerik: screen reader tarafından doğal sırada okunmalıdır.
- CTA: `accessibilityRole="button"`.

---

## C38: ErrorState — Hata Durumu Bileşeni

**Açıklama:**
Veri çekme veya işlem hatası durumunda gösterilen bileşendir. EmptyState (C37) ile benzer yapıda ancak hata ikonuyla ve retry butonu ile farklılaşır.

**Platform davranışı:** EmptyState (C37) ile aynı.

**Token tüketimi:** EmptyState (C37) ile aynı. Ek olarak:
- `iconColor` → `tokens.color.icon.error`

**Props:**
| Prop | Tip | Varsayılan | Açıklama |
|------|-----|-----------|----------|
| `title` | `string` | `'Bir hata oluştu'` | Başlık |
| `description` | `string` | `'Lütfen tekrar deneyin.'` | Açıklama |
| `onRetry` | `() => void` | `undefined` | Tekrar dene handler |
| `retryLabel` | `string` | `'Tekrar Dene'` | Retry buton metni |
| `icon` | `LucideIconName` | `'AlertTriangle'` | Hata ikonu |
| `testID` | `string` | — | Test identifier |

**State'ler:**
- **Default:** Hata mesajı + retry butonu.
- **Retrying:** Retry butonuna basıldıktan sonra butonda loading spinner.

**Apple HIG uyumu:**
- Hata mesajları kullanıcıyı suçlamamalıdır ("Yanlış yaptınız" yerine "Bir sorun oluştu").
- Retry mekanizması her zaman sunulmalıdır.
- Teknik hata detayları kullanıcıya gösterilmemelidir.

**Accessibility (a11y) gereksinimleri:**
- `accessibilityRole="alert"`.
- Screen reader hata mesajını otomatik okumalıdır.
- Retry butonu: `accessibilityRole="button"`, `accessibilityLabel="Tekrar dene"`.

---

## C39: LoadingState — Yükleme Durumu Bileşeni

**Açıklama:**
Sayfa veya bölüm yüklenirken gösterilen wrapper bileşenidir. İçerik tipine göre Skeleton (C34) veya Spinner (C35) kullanır.

**Platform davranışı:** Platform farksız.

**Props:**
| Prop | Tip | Varsayılan | Açıklama |
|------|-----|-----------|----------|
| `type` | `'skeleton'` \| `'spinner'` | `'skeleton'` | Yükleme gösterge tipi |
| `message` | `string` | `undefined` | Yükleniyor mesajı |
| `children` | `ReactNode` | `undefined` | Custom skeleton layout |
| `testID` | `string` | — | Test identifier |

**State'ler:**
- **Loading:** Skeleton shimmer veya spinner animasyonu.

**Apple HIG uyumu:**
- İlk yükleme skeleton, yenileme spinner tercih edilir.
- Yükleme 10 saniyeden uzun sürerse mesaj güncellenmeli ("Bu biraz uzun sürüyor...").

**Accessibility (a11y) gereksinimleri:**
- `accessibilityState={{ busy: true }}`.
- `accessibilityLabel="Yükleniyor"` (mesaj varsa mesaj metni).
- Screen reader, yükleme durumunu announce etmelidir.

---

# 15. Varsayılan Component'ler — Navigasyon Katmanı (Tier 2)

Navigation component'leri, kullanıcının uygulama içinde hareket etmesini sağlayan bileşenlerdir.

---

## C40: Header / NavigationBar — Üst Navigasyon Çubuğu Bileşeni

**Açıklama:**
Her ekranın üstünde yer alan navigasyon çubuğudur. Geri butonu, sayfa başlığı ve sağ aksiyon butonları içerir. Safe area entegrasyonu ile notch/Dynamic Island üzerinde düzgün konumlanır.

**Platform davranışı:**
- **Web:** Sticky header. `<header>` + `<nav>` semantik tag'ler.
- **Mobile (React Native):** React Navigation `@react-navigation/native-stack` header'ı özelleştirilerek veya custom header component olarak kullanılır.

**Token tüketimi:**
- `height` → 44px (content area, safe area hariç)
- `backgroundColor` → `tokens.color.surface.default` (opak) veya `transparent` (scroll'da opaklaşan)
- `titleFontSize` → `tokens.typography.fontSize.base` (16px)
- `titleFontWeight` → `tokens.typography.fontWeight.semibold`
- `titleColor` → `tokens.color.text.primary`
- `backIconSize` → 24px
- `actionIconSize` → 22px
- `borderBottom` → `tokens.color.border.subtle` (opsiyonel, scroll sonrası görünür)
- `shadow` → scroll sonrası: `tokens.shadow.sm`
- `padding` → `tokens.spacing.4` (16px) yatay

**Props:**
| Prop | Tip | Varsayılan | Açıklama |
|------|-----|-----------|----------|
| `title` | `string` | — | Sayfa başlığı |
| `showBack` | `boolean` | Otomatik (navigation stack depth > 1) | Geri butonu |
| `onBack` | `() => void` | `navigation.goBack()` | Geri handler |
| `rightActions` | `{ icon: LucideIconName; onPress: () => void; accessibilityLabel: string }[]` | `[]` | Sağ aksiyon butonları |
| `largeTitle` | `boolean` | `false` | iOS large title pattern |
| `transparent` | `boolean` | `false` | Saydam arka plan |
| `testID` | `string` | — | Test identifier |

**State'ler:**
- **Default:** Sabit başlık.
- **Large Title (iOS):** Başlık büyük font ile içerik alanında; scroll'da küçülerek navigation bar'a taşınır. Animasyon: `withTiming(250ms)`.
- **Scrolled:** Border-bottom veya shadow görünür (içerik scroll edildiğinde).
- **Transparent → Opaque:** Scroll'da arka plan transparandan opağa geçer.

**Apple HIG uyumu:**
- **UINavigationBar pattern:** Tam uyum. Large title, back button (<), right bar button items.
- Back button: Chevron left ikonu + önceki ekranın başlığı (kısa ise). Minimum: sadece chevron.
- Large title: scroll aşağı → küçük başlık, scroll yukarı → büyük başlık. iOS 13+ davranışı.
- Right actions maksimum 2-3 ikon (daha fazlası overflow menu'ye).

**Accessibility (a11y) gereksinimleri:**
- Web: `<header role="banner">` + `<nav>`.
- `accessibilityRole="header"` (başlık alanı).
- Back button: `accessibilityLabel="Geri"` veya `"[önceki ekran adı] ekranına dön"`.
- Right actions: Her biri `accessibilityLabel` zorunlu (IconButton'dan miras).
- VoiceOver: Başlık, geri butonu ve aksiyonlar sırasıyla okunmalıdır.

---

## C41: TabBar — Alt Navigasyon Çubuğu Bileşeni

**Açıklama:**
Uygulamanın ana bölümleri arasında geçiş sağlayan alt navigasyon çubuğudur. İkon + etiket kombinasyonu ile her tab'ı temsil eder. Aktif tab görsel olarak vurgulanır.

**Platform davranışı:**
- **Web:** Alt veya üst tab bar. Custom veya browser router tab'ları.
- **Mobile (React Native):** React Navigation `@react-navigation/bottom-tabs` kütüphanesi kullanılır. Safe area bottom padding otomatik.

**Kütüphane:** `@react-navigation/bottom-tabs`

**Token tüketimi:**
- `height` → 49px (content, safe area hariç — iOS standart)
- `backgroundColor` → `tokens.color.surface.default`
- `borderTop` → `tokens.color.border.subtle`
- `activeIconColor` → `tokens.color.brand.primary`
- `inactiveIconColor` → `tokens.color.icon.tertiary`
- `activeLabelColor` → `tokens.color.brand.primary`
- `inactiveLabelColor` → `tokens.color.text.tertiary`
- `labelFontSize` → 10px
- `labelFontWeight` → active: `semibold`, inactive: `regular`
- `iconSize` → 24px
- `badgeColor` → `tokens.color.feedback.error`
- `badgeFontSize` → 10px

**Props:**
| Prop | Tip | Varsayılan | Açıklama |
|------|-----|-----------|----------|
| `tabs` | `TabConfig[]` | — | Tab konfigürasyonları |
| `activeTab` | `string` | — | Aktif tab key |
| `onTabPress` | `(key: string) => void` | — | Tab tıklama handler |
| `testID` | `string` | — | Test identifier |

```typescript
interface TabConfig {
  key: string;
  label: string;
  icon: LucideIconName;
  activeIcon?: LucideIconName;     // Aktifken farklı ikon (filled variant)
  badge?: number | boolean;         // Badge sayısı veya dot
  accessibilityLabel?: string;      // Özel a11y etiketi
}
```

**State'ler:**
- **Active tab:** Brand renk ikon + label. Opsiyonel: filled ikon variant.
- **Inactive tab:** Muted renk ikon + label.
- **Badge:** Tab ikonu üst-sağ köşesinde kırmızı badge (sayı veya dot).

**Apple HIG uyumu:**
- **UITabBarController pattern:** Tam uyum. Alt nav, 49pt height, ikon + etiket.
- Tab sayısı 3-5 arası olmalıdır. 6+ tab "More" tab'ı gerektirir.
- Aktif tab'a tekrar tıklanınca scroll-to-top veya root'a dönüş.
- Tab bar her zaman görünür olmalıdır (keyboard açıkken bile — keyboard avoidance tab bar'ı etkilememelidir).

**Accessibility (a11y) gereksinimleri:**
- `accessibilityRole="tabBar"` (container).
- Her tab: `accessibilityRole="tab"`, `accessibilityState={{ selected: isActive }}`.
- Badge: `accessibilityLabel="[tab label], [badge count] bildirim"`.
- VoiceOver: "Tab 1 / 4, [label], seçili" şeklinde okunmalıdır.

---

## C42: BottomSheet — Alt Sayfa Bileşeni

**Açıklama:**
Ekranın altından yukarı kayan overlay panel bileşenidir. Picker, filtre, detay bilgi, aksiyon menüsü gibi birçok kullanım alanı vardır.

**Platform davranışı:**
- **Web:** Fixed position overlay + backdrop. CSS transition veya Framer Motion animasyonu.
- **Mobile (React Native):** `@gorhom/bottom-sheet` kütüphanesi kullanılır. Gesture-driven, snap points, keyboard-aware.

**Kütüphane:** `@gorhom/bottom-sheet` (v5)

**Token tüketimi:**
- `backgroundColor` → `tokens.color.surface.overlay`
- `borderRadius` → `tokens.radius.xl` (16px — üst köşeler)
- `handleColor` → `tokens.color.border.default`
- `handleWidth` → 36px
- `handleHeight` → 5px
- `backdropColor` → `rgba(0, 0, 0, 0.5)`
- `shadow` → `tokens.shadow.xl`
- `padding` → `tokens.spacing.4` (16px)

**Props:**
| Prop | Tip | Varsayılan | Açıklama |
|------|-----|-----------|----------|
| `open` | `boolean` | `false` | Açık/kapalı |
| `onClose` | `() => void` | — | Kapatma handler |
| `snapPoints` | `(string \| number)[]` | `['50%']` | Snap noktaları |
| `enableDynamicSizing` | `boolean` | `false` | İçeriğe göre boyut |
| `showHandle` | `boolean` | `true` | Tutma çubuğu |
| `children` | `ReactNode` | — | İçerik |
| `title` | `string` | `undefined` | Başlık |
| `testID` | `string` | — | Test identifier |

**State'ler:**
- **Closed:** Gizli.
- **Opening:** Alttan yukarı slide animasyonu + backdrop fade-in.
- **Open:** Snap point'te sabit. Gesture ile snap point'ler arası geçiş.
- **Dragging:** Kullanıcı sürüklüyor. Elastic overscroll (üstte ve altta).
- **Closing:** Aşağı slide + backdrop fade-out. Threshold: %25 aşağı sürüklenirse kapatılır.

**Apple HIG uyumu:**
- **Sheet presentation (iOS 15+) pattern:** Tam uyum. Handle bar, snap points, gesture dismiss.
- Handle bar: 36x5pt, centered, gri renk. Grip affordance sağlar.
- Backdrop: Semi-transparent siyah. Tıklanınca sheet kapatılır.
- Medium detent (%50) ve large detent (%90) snap point'ler iOS standartıdır.
- Sheet açıkken arka plan interact edilemez olmalıdır (backdrop blocks interaction).

**Accessibility (a11y) gereksinimleri:**
- `accessibilityRole="dialog"` veya `"sheet"`.
- `accessibilityLabel` → title prop'undan veya ilk heading'den.
- Focus trap: Sheet açıkken focus sheet içinde kalmalıdır.
- Escape / back gesture ile kapatılabilmelidir.
- VoiceOver: "Sheet açıldı, [başlık]" announce.
- Handle: `accessibilityLabel="Kaydırma tutacağı"`, `accessibilityHint="Aşağı kaydırarak kapatın"`.

---

## C43: Modal / Dialog — Merkez Popup Bileşeni

**Açıklama:**
Ekranın merkezinde overlay olarak açılan dialog bileşenidir. Bilgilendirme, onay, form gibi önemli etkileşimler için kullanılır. BottomSheet'ten farkı: merkez konumlama ve genellikle daha küçük içerik.

**Platform davranışı:**
- **Web:** `<dialog>` HTML element'i veya custom overlay + backdrop.
- **Mobile (React Native):** React Navigation modal veya custom overlay (Reanimated + backdrop).

**Token tüketimi:**
- `backgroundColor` → `tokens.color.surface.overlay`
- `borderRadius` → `tokens.radius.xl` (16px)
- `shadow` → `tokens.shadow.xl`
- `maxWidth` → 400px (web), ekran genişliği - 48px (mobile)
- `padding` → `tokens.spacing.6` (24px)
- `backdropColor` → `rgba(0, 0, 0, 0.5)`
- Animasyon: scale 0.95 → 1 + fade-in, 200ms

**Props:**
| Prop | Tip | Varsayılan | Açıklama |
|------|-----|-----------|----------|
| `open` | `boolean` | `false` | Açık/kapalı |
| `onClose` | `() => void` | — | Kapatma handler |
| `title` | `string` | — | Başlık |
| `children` | `ReactNode` | — | İçerik |
| `showClose` | `boolean` | `true` | Kapat butonu (sağ üst X) |
| `dismissOnBackdrop` | `boolean` | `true` | Backdrop tıklanınca kapanır |
| `testID` | `string` | — | Test identifier |

**State'ler:**
- **Closed:** Gizli.
- **Opening:** Scale + fade animasyonu.
- **Open:** Merkezde sabit. Backdrop aktif.
- **Closing:** Reverse animasyon.

**Apple HIG uyumu:**
- **UIAlertController (alert style) pattern:** Kısa içerik, 1-2 buton.
- Dialog başlığı bold, açıklama regular olmalıdır.
- Butonlar: İptal (sol/üst), onay (sağ/alt). Destructive eylem kırmızı.
- Dialog, önemli bilgi veya karar gerektiren durumlar içindir; sık kullanılmamalıdır.

**Accessibility (a11y) gereksinimleri:**
- `accessibilityRole="dialog"`.
- `accessibilityLabel` → title.
- Focus trap: Dialog açıkken focus dialog içinde kalmalıdır; Tab ile dışarı çıkılamamalıdır.
- Escape ile kapatılabilmelidir.
- VoiceOver: "Uyarı, [başlık], [içerik]" announce.
- Auto-focus: İlk interactive element'e veya close butonuna.

---

## C44: ConfirmDialog — Onay Dialog Bileşeni

**Açıklama:**
Destructive veya geri dönüşü olmayan aksiyonlar için onay isteyen özelleşmiş dialog bileşenidir. Modal (C43) üzerine kuruludur. "Emin misiniz?" pattern'ı.

**Platform davranışı:**
- **Web:** Modal (C43) kullanır.
- **Mobile (React Native):** BottomSheet (C42) veya Modal (C43) kullanır. iOS'ta Alert.alert native API da alternatif olarak kullanılabilir.

**Token tüketimi:** Modal (C43) token'ları + ek olarak:
- `destructiveButtonColor` → `tokens.color.feedback.error`

**Props:**
| Prop | Tip | Varsayılan | Açıklama |
|------|-----|-----------|----------|
| `open` | `boolean` | `false` | Açık/kapalı |
| `title` | `string` | — | Başlık (ör. "Hesabınızı silmek istediğinize emin misiniz?") |
| `description` | `string` | `undefined` | Açıklama |
| `confirmLabel` | `string` | `'Onayla'` | Onay buton metni |
| `cancelLabel` | `string` | `'İptal'` | İptal buton metni |
| `onConfirm` | `() => void` \| `() => Promise<void>` | — | Onay handler (async destekli) |
| `onCancel` | `() => void` | — | İptal handler |
| `variant` | `'default'` \| `'destructive'` | `'destructive'` | Onay buton stili |
| `loading` | `boolean` | `false` | Onay işlemi sürüyor |
| `testID` | `string` | — | Test identifier |

**State'ler:**
- Modal (C43) state'leri + **Confirming:** Onay butonunda loading spinner.

**Apple HIG uyumu:**
- **UIAlertController destructive pattern:** Tam uyum.
- Destructive buton kırmızı olmalıdır.
- İptal butonu her zaman mevcut olmalıdır.
- Başlık soru formatında olmalıdır ("Silmek istiyor musunuz?").

**Accessibility (a11y) gereksinimleri:** Modal (C43) ile aynı. Ek olarak:
- Destructive eylem screen reader tarafından vurgulanmalıdır: `accessibilityHint="Bu işlem geri alınamaz"`.

---

## C45: ActionSheet — Aksiyon Listesi Bileşeni

**Açıklama:**
Birden fazla aksiyon seçeneği sunan overlay bileşenidir. Mobile'da BottomSheet (C42) içinde liste, web'de dropdown veya dialog.

**Platform davranışı:**
- **Web:** Dropdown menu veya Modal.
- **Mobile (React Native):** BottomSheet + aksiyon listesi. iOS UIActionSheet pattern'ı.

**Token tüketimi:**
- BottomSheet (C42) token'ları kullanılır.
- `actionHeight` → 56px
- `actionFontSize` → `tokens.typography.fontSize.lg` (18px — iOS standart)
- `destructiveColor` → `tokens.color.text.error`
- `cancelHeight` → 56px
- `cancelFontWeight` → `tokens.typography.fontWeight.semibold`
- `gap` → Aksiyon grubu ile cancel arası: `tokens.spacing.2` (8px)

**Props:**
| Prop | Tip | Varsayılan | Açıklama |
|------|-----|-----------|----------|
| `open` | `boolean` | `false` | Açık/kapalı |
| `onClose` | `() => void` | — | Kapatma handler |
| `title` | `string` | `undefined` | Başlık |
| `message` | `string` | `undefined` | Alt açıklama |
| `actions` | `ActionSheetAction[]` | — | Aksiyon listesi |
| `showCancel` | `boolean` | `true` | İptal butonu |
| `cancelLabel` | `string` | `'İptal'` | İptal metni |
| `testID` | `string` | — | Test identifier |

```typescript
interface ActionSheetAction {
  label: string;
  onPress: () => void;
  icon?: LucideIconName;
  destructive?: boolean;
  disabled?: boolean;
}
```

**State'ler:**
- BottomSheet (C42) state'leri uygulanır.

**Apple HIG uyumu:**
- **UIActionSheet pattern:** Tam uyum.
- Destructive aksiyon kırmızı metin ile gösterilmelidir.
- Cancel butonu ayrı bir grup olarak altta gösterilmelidir (gap ile ayrılmış).
- Cancel butonu semibold olmalıdır.

**Accessibility (a11y) gereksinimleri:**
- `accessibilityRole="menu"` (container).
- Her aksiyon: `accessibilityRole="menuitem"`.
- Destructive: `accessibilityLabel="[label], tehlikeli eylem"`.
- Cancel: `accessibilityLabel="İptal"`.
- VoiceOver: Aksiyon listesi sırasıyla okunmalıdır.

---

## C46: Drawer — Yan Panel Bileşeni (Web-Only)

**Açıklama:**
Ekranın sol veya sağ kenarından kayan panel bileşenidir. Web platformuna özeldir. Navigasyon menüsü, filtre paneli, detay paneli gibi kullanımlar için.

**Platform davranışı:**
- **Web-only:** Fixed position overlay + backdrop + slide animasyonu.
- **Mobile:** Kullanılmaz. Mobile'da BottomSheet (C42) tercih edilir.

**Token tüketimi:**
- `width` → 320px (varsayılan), max: 80vw
- `backgroundColor` → `tokens.color.surface.default`
- `shadow` → `tokens.shadow.xl`
- `backdropColor` → `rgba(0, 0, 0, 0.5)`
- Animasyon: slide-in 300ms, `ease-out`

**Props:**
| Prop | Tip | Varsayılan | Açıklama |
|------|-----|-----------|----------|
| `open` | `boolean` | `false` | Açık/kapalı |
| `onClose` | `() => void` | — | Kapatma handler |
| `side` | `'left'` \| `'right'` | `'right'` | Açılma yönü |
| `width` | `number` \| `string` | `320` | Panel genişliği |
| `children` | `ReactNode` | — | İçerik |
| `title` | `string` | `undefined` | Başlık |
| `showClose` | `boolean` | `true` | Kapat butonu |
| `testID` | `string` | — | Test identifier |

**State'ler:**
- **Closed:** Gizli. Ekran dışında.
- **Opening:** Slide-in + backdrop fade-in.
- **Open:** Sabit. Backdrop aktif.
- **Closing:** Slide-out + backdrop fade-out.

**Apple HIG uyumu:**
- Web-only bileşen olduğu için HIG uyumu dolaylıdır. macOS sidebar pattern'ına yakın.

**Accessibility (a11y) gereksinimleri:**
- `role="dialog"` veya `role="complementary"`.
- Focus trap: Drawer açıkken focus içeride kalmalıdır.
- Escape ile kapatılabilmelidir.
- `aria-label` → title.

---

# 16. Varsayılan Component'ler — Layout Katmanı (Tier 2)

Layout component'leri, ekran seviyesinde yapısal düzenleme sağlayan bileşenlerdir.

---

## C47: ScreenContainer — Ekran Container Bileşeni

**Açıklama:**
Her ekranın kök wrapper bileşenidir. SafeAreaContainer (C11) + padding + scroll (opsiyonel) + keyboard avoidance (opsiyonel) birleşimini tek bir component'te sunar. Her ekran dosyası ScreenContainer ile başlar.

**Platform davranışı:**
- **Web:** `<main>` + SafeArea + padding. Scroll browser-native.
- **Mobile (React Native):** SafeAreaContainer + KeyboardAvoidingContainer + ScrollContainer birleşimi.

**Token tüketimi:**
- `backgroundColor` → `tokens.color.surface.default`
- `paddingX` → `tokens.spacing.4` (16px)
- `paddingY` → `tokens.spacing.4` (16px)

**Props:**
| Prop | Tip | Varsayılan | Açıklama |
|------|-----|-----------|----------|
| `children` | `ReactNode` | — | Ekran içeriği |
| `scroll` | `boolean` | `true` | ScrollView sarmalayıcı |
| `keyboardAvoiding` | `boolean` | `true` | Keyboard avoidance |
| `edges` | `SafeAreaEdge[]` | `['top', 'bottom']` | Safe area kenarları |
| `noPadding` | `boolean` | `false` | Padding kaldır (ör. FlatList ekranları) |
| `backgroundColor` | `SurfaceColorToken` | `'default'` | Arka plan rengi |
| `testID` | `string` | — | Test identifier |

**State'ler:**
- ScreenContainer stateless'tır; çocuk component'lerin state'lerini yönetmez.

**Apple HIG uyumu:**
- Her ekran safe area sınırları içinde olmalıdır.
- Content margin: minimum 16pt horizontal.
- Keyboard aktifken içerik otomatik kaydırılmalıdır.

**Accessibility (a11y) gereksinimleri:**
- Web: `<main role="main">`.
- `accessibilityLabel` → Ekran adı (ör. "Ana Sayfa", "Profil").

---

## C48: PullToRefreshWrapper — Yenile Bileşeni

**Açıklama:**
Pull-to-refresh (aşağı çekerek yenileme) işlevselliği sağlayan wrapper bileşenidir. ScrollContainer (C10) veya FlatList ile entegre çalışır.

**Platform davranışı:**
- **Web:** Custom pull-to-refresh implementation veya browser-native (PWA).
- **Mobile (React Native):** `RefreshControl` built-in component kullanılır.

**Token tüketimi:**
- `indicatorColor` → `tokens.color.brand.primary`
- `threshold` → 80px (tetikleme eşiği)

**Props:**
| Prop | Tip | Varsayılan | Açıklama |
|------|-----|-----------|----------|
| `refreshing` | `boolean` | `false` | Yenileniyor mu |
| `onRefresh` | `() => void` | — | Yenileme handler |
| `threshold` | `number` | `80` | Tetikleme eşiği (px) |
| `testID` | `string` | — | Test identifier |

**State'ler:**
- **Idle:** Normal scroll.
- **Pulling:** Kullanıcı aşağı çekiyor. Indicator görünmeye başlıyor.
- **Triggered:** Threshold aşıldı. Indicator tam görünür. Haptic feedback.
- **Refreshing:** Spinner dönüyor. `onRefresh` çağrıldı.
- **Completed:** Yenileme tamamlandı. Indicator gizleniyor.

**Apple HIG uyumu:**
- Pull-to-refresh, iOS standart pattern'ıdır. Native RefreshControl kullanmak HIG uyumu sağlar.
- Haptic: threshold aşıldığında `ImpactFeedbackStyle.Medium`.

**Accessibility (a11y) gereksinimleri:**
- VoiceOver: "Yenilemek için aşağı kaydırın" hint.
- Refreshing: `accessibilityState={{ busy: true }}`.

---

## C49: InfiniteScrollList — Sonsuz Kaydırma Listesi Bileşeni

**Açıklama:**
Sayfalama ile veri yükleyen ve kullanıcı scroll ettikçe otomatik yeni sayfa çeken liste bileşenidir. TanStack Query `useInfiniteQuery` ile entegre çalışır.

**Platform davranışı:**
- **Web:** Intersection Observer API ile scroll detection.
- **Mobile (React Native):** `FlatList` + `onEndReached` + `onEndReachedThreshold`.

**Token tüketimi:**
- `loadingFooterHeight` → 60px
- `endIndicatorPadding` → `tokens.spacing.6` (24px)
- `endIndicatorColor` → `tokens.color.text.tertiary`

**Props:**
| Prop | Tip | Varsayılan | Açıklama |
|------|-----|-----------|----------|
| `data` | `T[]` | — | Liste verisi |
| `renderItem` | `(item: T, index: number) => ReactNode` | — | Item render fonksiyonu |
| `keyExtractor` | `(item: T) => string` | — | Key çıkarıcı |
| `onLoadMore` | `() => void` | — | Sonraki sayfa yükleme handler |
| `hasMore` | `boolean` | — | Daha fazla veri var mı |
| `isLoadingMore` | `boolean` | `false` | Sonraki sayfa yükleniyor |
| `ListEmptyComponent` | `ReactNode` | — | Boş durum bileşeni |
| `ListHeaderComponent` | `ReactNode` | `undefined` | Liste başlığı |
| `refreshing` | `boolean` | `false` | Pull-to-refresh durumu |
| `onRefresh` | `() => void` | `undefined` | Pull-to-refresh handler |
| `triggerThreshold` | `number` | `300` | Yükleme tetikleme mesafesi (px) |
| `testID` | `string` | — | Test identifier |

**State'ler:**
- **Loading (initial):** Skeleton veya spinner (LoadingState/C39).
- **Loaded:** Liste görünür.
- **Loading More:** Liste altında Spinner (C35).
- **End Reached:** "Daha fazla yok" metni. `hasMore=false`.
- **Error:** ErrorState (C38) + retry.
- **Empty:** EmptyState (C37).
- **Refreshing:** Pull-to-refresh aktif.

**Apple HIG uyumu:**
- Loading footer subtle olmalıdır (küçük spinner).
- End indicator metni kullanıcı dostu olmalıdır ("Hepsini gördünüz").
- Scroll performance: 60fps hedef (FlatList optimizasyonları: windowSize, maxToRenderPerBatch).

**Accessibility (a11y) gereksinimleri:**
- `accessibilityRole="list"`.
- Her item: `accessibilityRole="listitem"`.
- Loading more: `accessibilityLabel="Daha fazla yükleniyor"`.
- End reached: `accessibilityLabel="Listenin sonu"`.

---

## C50: StickyFooter — Yapışık Alt Alan Bileşeni

**Açıklama:**
Ekranın altında sabit kalan alan bileşenidir. CTA butonları, fiyat bilgisi + satın al butonu, navigasyon butonları gibi her zaman görünür olması gereken içerik için.

**Platform davranışı:**
- **Web:** `position: sticky; bottom: 0` veya `position: fixed; bottom: 0`.
- **Mobile (React Native):** ScrollView dışında absolute positioning + safe area bottom padding.

**Token tüketimi:**
- `backgroundColor` → `tokens.color.surface.default`
- `borderTop` → `tokens.color.border.subtle`
- `padding` → `tokens.spacing.4` (16px)
- `paddingBottom` → safe area bottom inset + `tokens.spacing.4`
- `shadow` → `tokens.shadow.sm` (yukarı doğru gölge)

**Props:**
| Prop | Tip | Varsayılan | Açıklama |
|------|-----|-----------|----------|
| `children` | `ReactNode` | — | İçerik |
| `showBorder` | `boolean` | `true` | Üst border |
| `showShadow` | `boolean` | `false` | Üst gölge |
| `testID` | `string` | — | Test identifier |

**State'ler:**
- StickyFooter stateless'tır.

**Apple HIG uyumu:**
- Safe area bottom padding zorunlu (home indicator üzerine binmemeli).
- Footer içeriği scroll içeriğini örtmemelidir (scroll alanının altına footer yüksekliği kadar padding).
- Keyboard açıkken footer keyboard üstünde kalmalı veya gizlenmelidir (context'e göre).

**Accessibility (a11y) gereksinimleri:**
- `accessibilityRole="toolbar"` veya `"none"` (context'e göre).
- İçerideki butonlar kendi a11y role'lerini taşır.
- Tab order: Footer butonları sayfa içeriğinden sonra okunmalıdır.

---

# 17. Varsayılan Component'ler — Overlay / Utility Katmanı (Tier 2)

Overlay ve utility component'leri, diğer kategorilere girmeyen ancak uygulamanın altyapı ve erişilebilirlik gereksinimlerini karşılayan bileşenlerdir.

---

## C51: Tooltip — İpucu Bileşeni

**Açıklama:**
Bir öğenin üzerine gelindiğinde (web: hover) veya uzun basıldığında (mobile: long-press) gösterilen kısa bilgi baloncuğudur.

**Platform davranışı:**
- **Web:** Hover ile gösterilir. Delay: 500ms. `position: absolute` veya Floating UI ile konumlandırılır.
- **Mobile (React Native):** Long-press ile gösterilir. Duration: 2 saniye sonra otomatik kapanır.

**Token tüketimi:**
- `backgroundColor` → `tokens.color.surface.inverse` (koyu arka plan)
- `textColor` → `tokens.color.text.inverse` (açık metin)
- `fontSize` → `tokens.typography.fontSize.xs` (12px)
- `borderRadius` → `tokens.radius.sm`
- `padding` → `tokens.spacing.2` (8px)
- `maxWidth` → 200px
- Animasyon: fade-in 150ms

**Props:**
| Prop | Tip | Varsayılan | Açıklama |
|------|-----|-----------|----------|
| `content` | `string` | — | Tooltip metni |
| `children` | `ReactNode` | — | Trigger element |
| `placement` | `'top'` \| `'bottom'` \| `'left'` \| `'right'` | `'top'` | Konumlama |
| `delay` | `number` | `500` | Gösterme gecikmesi (ms, web) |
| `testID` | `string` | — | Test identifier |

**State'ler:**
- **Hidden:** Tooltip gizli.
- **Showing:** Fade-in animasyonu.
- **Visible:** Tooltip görünür.
- **Hiding:** Fade-out.

**Apple HIG uyumu:**
- iOS'ta tooltip pattern native olarak yaygın değildir. Long-press ile kısa bilgi gösterme tercih edilir.
- Tooltip metni kısa olmalıdır (1-2 satır).

**Accessibility (a11y) gereksinimleri:**
- Web: `aria-describedby` ile trigger element'e bağlanmalıdır.
- Tooltip içeriği screen reader'da zaten trigger'ın `accessibilityLabel`'ı ile erişilebilir olmalıdır.
- Keyboard: Focus ile tooltip tetiklenmelidir (hover gibi).
- `role="tooltip"` (web).

---

## C52: Popover — Açılır İçerik Bileşeni

**Açıklama:**
Bir trigger element'e tıklanınca gösterilen içerik baloncuğudur. Tooltip'ten farkı: interactive içerik (butonlar, linkler, form alanları) barındırabilir ve tıklama ile açılır/kapanır.

**Platform davranışı:**
- **Web:** Floating UI veya Radix Popover ile konumlandırma. Backdrop yok veya transparent backdrop.
- **Mobile (React Native):** BottomSheet (C42) tercih edilir. Popover pattern mobile'da kullanışsız olabilir.

**Token tüketimi:**
- `backgroundColor` → `tokens.color.surface.overlay`
- `borderRadius` → `tokens.radius.lg`
- `shadow` → `tokens.shadow.lg`
- `padding` → `tokens.spacing.4`
- `maxWidth` → 300px
- Animasyon: scale + fade, 150ms

**Props:**
| Prop | Tip | Varsayılan | Açıklama |
|------|-----|-----------|----------|
| `open` | `boolean` | `false` | Açık/kapalı |
| `onOpenChange` | `(open: boolean) => void` | — | Durum değişim handler |
| `trigger` | `ReactNode` | — | Trigger element |
| `children` | `ReactNode` | — | Popover içeriği |
| `placement` | `'top'` \| `'bottom'` \| `'left'` \| `'right'` | `'bottom'` | Konumlama |
| `testID` | `string` | — | Test identifier |

**State'ler:**
- **Closed:** Popover gizli.
- **Open:** Popover görünür, trigger'a bağlı konumda.

**Apple HIG uyumu:**
- iOS'ta popover, iPad'de yaygındır. iPhone'da BottomSheet tercih edilir.
- Arrow (ok) ile trigger'a bağlantı gösterilebilir.

**Accessibility (a11y) gereksinimleri:**
- Trigger: `aria-expanded`, `aria-haspopup`.
- Popover: `role="dialog"`.
- Focus trap: Popover içinde.
- Escape ile kapatılabilme.

---

## C53: ErrorBoundary — Hata Sınırı Bileşeni

**Açıklama:**
React component tree'sinde oluşan JavaScript hatalarını yakalayan ve uygulamanın çökmesini engelleyen bileşendir. 3 seviyede hata yakalama stratejisi uygulanır.

**Platform davranışı:**
- **Web ve Mobile:** Aynı API. `react-error-boundary` kütüphanesi kullanılır.

**Kütüphane:** `react-error-boundary` (v5)

**3 Seviye Hata Yakalama:**
1. **App-level ErrorBoundary:** Tüm uygulamayı sarar. Yakalanmamış hata → full-screen error page + Sentry report. Recovery: app restart.
2. **Feature-level ErrorBoundary:** Ekran veya feature modülünü sarar. Hata → sadece o bölüm error state + retry. Diğer bölümler çalışmaya devam eder.
3. **Component-level ErrorBoundary:** Kritik component'i sarar (ör. chart, harita). Hata → component placeholder + retry.

**Token tüketimi:**
- ErrorBoundary kendisi token tüketmez; fallback UI olarak ErrorState (C38) render eder.

**Props:**
| Prop | Tip | Varsayılan | Açıklama |
|------|-----|-----------|----------|
| `level` | `'app'` \| `'feature'` \| `'component'` | `'feature'` | Hata yakalama seviyesi |
| `fallback` | `ReactNode` \| `(error: Error, reset: () => void) => ReactNode` | Seviyeye göre varsayılan | Custom fallback UI |
| `onError` | `(error: Error, info: ErrorInfo) => void` | Sentry report | Hata handler |
| `onReset` | `() => void` | `undefined` | Reset handler |
| `children` | `ReactNode` | — | Korunan içerik |
| `testID` | `string` | — | Test identifier |

**Sentry entegrasyonu:**
- Her hata otomatik olarak Sentry'ye raporlanır.
- Hata context'i: component stack, user info, app version, navigation state.
- App-level: `Sentry.captureException(error, { level: 'fatal' })`.
- Feature-level: `Sentry.captureException(error, { level: 'error' })`.
- Component-level: `Sentry.captureException(error, { level: 'warning' })`.

**State'ler:**
- **Normal:** Hata yok, children render ediliyor.
- **Error:** Fallback UI render ediliyor. ErrorState (C38) ile retry butonu.
- **Recovering:** Reset sonrası children tekrar render ediliyor.

**Apple HIG uyumu:**
- Hata ekranları kullanıcıyı suçlamamalı, yönlendirici olmalıdır.
- Feature-level hata, uygulamanın geri kalanını etkilememelidir.

**Accessibility (a11y) gereksinimleri:**
- Fallback UI: ErrorState (C38) a11y gereksinimlerini taşır.
- Hata oluştuğunda screen reader `accessibilityLiveRegion="assertive"` ile bilgilendirilmelidir.

---

## C54: AuthGuard — Kimlik Doğrulama Koruması Bileşeni

**Açıklama:**
Authenticated (giriş yapılmış) kullanıcı gerektiren route'ları koruyan wrapper bileşenidir. Auth durumunu kontrol eder; giriş yapılmamışsa login ekranına yönlendirir.

**Platform davranışı:**
- **Web:** React Router `loader` veya layout route ile entegrasyon. Redirect: `/login?returnTo={currentPath}`.
- **Mobile (React Native):** React Navigation conditional rendering veya navigation guard. Auth durumu Zustand store'dan okunur.

**Token tüketimi:**
- AuthGuard görsel token tüketmez; logic-only component'tir.

**Props:**
| Prop | Tip | Varsayılan | Açıklama |
|------|-----|-----------|----------|
| `children` | `ReactNode` | — | Korunan ekran |
| `fallback` | `ReactNode` | `<LoadingState />` | Auth kontrolü sırasında gösterilen UI |
| `requiredRole` | `string[]` | `undefined` | Gerekli rol (RBAC) |
| `testID` | `string` | — | Test identifier |

**State'ler:**
- **Checking:** Auth durumu kontrol ediliyor. Fallback (loading) gösterilir.
- **Authenticated:** Auth doğrulandı. Children render ediliyor.
- **Unauthenticated:** Giriş yapılmamış. Login ekranına redirect.
- **Unauthorized:** Giriş yapılmış ama yetersiz rol. "Yetkisiz" ekranına redirect veya error.

**Apple HIG uyumu:**
- Auth kontrolü sırasında splash screen veya loading state gösterilmelidir (boş ekran gösterilmemelidir).
- Redirect sonrası geri butonu login'e götürmemelidir (navigation stack resetlenmeli).

**Accessibility (a11y) gereksinimleri:**
- Loading state: `accessibilityState={{ busy: true }}`.
- Redirect screen reader'a announce edilmemelidir (gereksiz bildirim).

---

## C55: SkipToContent — İçeriğe Atla Bileşeni (Web-Only)

**Açıklama:**
Keyboard navigasyon kullanan kullanıcıların ana içeriğe hızlıca atlamasını sağlayan gizli link bileşenidir. Yalnızca web platformunda kullanılır. Sayfa yüklendiğinde görünmezdir; Tab tuşu ile fokuslandığında görünür hale gelir.

**Platform davranışı:**
- **Web-only:** `<a href="#main-content">` veya `<button>`. CSS ile normalde gizli, `:focus` ile görünür.
- **Mobile:** Kullanılmaz (VoiceOver zaten heading/landmark navigasyonu sağlar).

**Token tüketimi:**
- `backgroundColor` → `tokens.color.brand.primary`
- `textColor` → `tokens.color.text.inverse`
- `padding` → `tokens.spacing.3` (12px)
- `fontSize` → `tokens.typography.fontSize.sm`
- `zIndex` → en üst katman (9999)

**Props:**
| Prop | Tip | Varsayılan | Açıklama |
|------|-----|-----------|----------|
| `targetId` | `string` | `'main-content'` | Hedef element ID |
| `label` | `string` | `'Ana içeriğe atla'` | Link metni |

**State'ler:**
- **Hidden:** Görsel olarak gizli (offscreen), DOM'da mevcut.
- **Focused:** Tab ile fokuslandığında ekranın sol üstünde görünür.

**Apple HIG uyumu:**
- Web-only; WCAG 2.1 Success Criterion 2.4.1 (Bypass Blocks) gereksinimi.

**Accessibility (a11y) gereksinimleri:**
- Bu bileşen tamamen a11y amacıyla vardır.
- Tab ile erişilebilir olmalıdır (ilk focusable element).
- Aktivasyon sonrası focus `#main-content` element'ine taşınmalıdır.
- `accessibilityRole="link"`.

---

## C56: ConsentBanner — İzin/Onay Banner Bileşeni (Web-Only)

**Açıklama:**
Cookie/tracking consent (çerez/izleme izni) banner'ıdır. GDPR, KVKK ve ePrivacy direktiflerine uyumlu olarak kullanıcıdan izin alır. Yalnızca web platformunda gösterilir.

**Platform davranışı:**
- **Web-only:** Sayfanın altında veya üstünde sabit banner. İzin alınana kadar analitik/reklam scriptleri yüklenmez.
- **Mobile:** App Store/Play Store onay mekanizmaları (ATT — App Tracking Transparency) kullanılır; bu component kullanılmaz.

**Token tüketimi:**
- `backgroundColor` → `tokens.color.surface.overlay`
- `textColor` → `tokens.color.text.primary`
- `borderTop` → `tokens.color.border.default`
- `padding` → `tokens.spacing.4`
- `shadow` → `tokens.shadow.lg`
- `maxWidth` → 600px (centered) veya full-width
- `zIndex` → 9998

**Props:**
| Prop | Tip | Varsayılan | Açıklama |
|------|-----|-----------|----------|
| `onAcceptAll` | `() => void` | — | Tümünü kabul et handler |
| `onRejectAll` | `() => void` | — | Tümünü reddet handler |
| `onManage` | `() => void` | — | Tercihlerimi yönet handler |
| `privacyPolicyUrl` | `string` | — | Gizlilik politikası linki |
| `testID` | `string` | — | Test identifier |

**State'ler:**
- **Visible:** Kullanıcı henüz tercih yapmamış. Banner görünür.
- **Preferences:** "Tercihlerimi yönet" tıklandığında detay paneli açık (kategoriler: Zorunlu, Analitik, Reklam, İşlevsel).
- **Hidden:** Tercih yapıldı. Banner gizli. Tercih localStorage + server'da saklanır.

**Apple HIG uyumu:**
- Web-only; iOS HIG doğrudan uygulanmaz. Ancak macOS Safari kullanıcıları için uygundur.
- Banner, sayfa içeriğini mümkün olduğunca az örtmelidir.

**Accessibility (a11y) gereksinimleri:**
- `role="dialog"`, `aria-label="Çerez izni"`.
- Focus trap: Banner görünür olduğunda focus banner'da kalmalıdır.
- Butonlar: Erişilebilir label'lar ile.
- Keyboard: Tab ile butonlar arası geçiş, Enter ile seçim.

---

# 18. Eksik ve Ek Maddeler (Gözden Kaçanlar)

Yukarıdaki standart component setine ek olarak, farklı bakış açılarından (kullanıcı deneyimi, edge case'ler, yasal gereksinimler, platform gereksinimleri) tespit edilen eksik bileşen ve ekranlar aşağıda listelenmiştir. Bu maddeler, projenin ilk fazında veya hemen ardından implement edilmelidir.

---

## 18.1. DatePicker / TimePicker — Tarih/Saat Seçici Bileşeni

**Açıklama:**
Tarih ve saat seçimi için kullanılan bileşendir. Doğum tarihi, randevu zamanı, etkinlik tarihi gibi alanlarda kullanılır.

**Platform davranışı:**
- **Web:** Custom calendar dropdown veya Radix Date Picker. Keyboard navigasyon (arrow keys ile gün geçişi) desteklenir.
- **Mobile (React Native):** BottomSheet (C42) içinde native-style picker. iOS: DateTimePicker (spinning wheel). Android: Material Date Picker.

**Kütüphane:** Tarih formatı ve locale: `date-fns` (v4). Picker UI: platform-native veya custom.

**Token tüketimi:**
- Trigger: TextField (C15) token'ları.
- Calendar/Picker: `tokens.color.surface.overlay`, `tokens.color.brand.primary` (selected day).

**i18n desteği:**
- date-fns locale ile tarih formatı otomatik değişir (tr: "31 Mart 2026", en: "March 31, 2026").
- Hafta başlangıcı locale'e göre (Pazartesi/Pazar).

**Apple HIG uyumu:**
- iOS spinning wheel picker iOS-native his verir. Uyumlu kullanım önerilir.
- Tarih aralığı seçiminde min/max date validasyonu olmalıdır.

**Accessibility (a11y) gereksinimleri:**
- Calendar: `role="grid"`, her gün `role="gridcell"`.
- Keyboard: Arrow keys ile navigasyon, Enter ile seçim, Escape ile kapatma.
- VoiceOver: "[Gün adı], [Tarih], seçili/seçili değil" okunmalıdır.

---

## 18.2. StepIndicator / Stepper — Adım Göstergesi Bileşeni

**Açıklama:**
Multi-step (çok adımlı) akışlarda kullanıcının hangi adımda olduğunu gösteren bileşendir. Onboarding wizard, profil tamamlama, checkout gibi akışlarda zorunludur.

**Platform davranışı:**
- **Web ve Mobile:** Yatay bar veya numbered steps. Aktif adım vurgulu, tamamlanan adımlar check ikonu ile.

**Token tüketimi:**
- `activeColor` → `tokens.color.brand.primary`
- `completedColor` → `tokens.color.feedback.success`
- `inactiveColor` → `tokens.color.border.default`
- `stepSize` → 32px (daire)
- `lineHeight` → 2px (bağlantı çizgisi)
- `labelFontSize` → `tokens.typography.fontSize.xs`

**Props:**
| Prop | Tip | Varsayılan | Açıklama |
|------|-----|-----------|----------|
| `steps` | `{ label: string; description?: string }[]` | — | Adım listesi |
| `currentStep` | `number` | `0` | Aktif adım indexi |
| `variant` | `'bar'` \| `'numbered'` \| `'dots'` | `'bar'` | Görsel varyant |
| `testID` | `string` | — | Test identifier |

**Apple HIG uyumu:**
- iOS'ta page indicator (dots) veya numbered steps kullanımı yaygındır.
- Kullanıcı kaç adım kaldığını her zaman bilmelidir.

**Accessibility (a11y) gereksinimleri:**
- `accessibilityRole="progressbar"`.
- `accessibilityValue={{ text: "Adım [current] / [total]" }}`.
- Her adım: `accessibilityLabel="[label], [tamamlandı/aktif/bekliyor]"`.

---

## 18.3. Accordion / Collapsible — Genişleyen İçerik Bileşeni

**Açıklama:**
Başlığa tıklanınca genişleyen/daralan içerik alanıdır. FAQ, ayarlar grupları, detaylı bilgi bölümleri için kullanılır.

**Platform davranışı:**
- **Web ve Mobile:** Pressable başlık + animasyonlu content height geçişi. Reanimated `withTiming` ile smooth expand/collapse.

**Token tüketimi:**
- `headerPadding` → `tokens.spacing.4`
- `contentPadding` → `tokens.spacing.4`
- `borderColor` → `tokens.color.border.default`
- `chevronSize` → 20px
- Animasyon: height expand/collapse 250ms `easeInOut`

**Props:**
| Prop | Tip | Varsayılan | Açıklama |
|------|-----|-----------|----------|
| `title` | `string` | — | Başlık |
| `children` | `ReactNode` | — | Genişleyen içerik |
| `defaultExpanded` | `boolean` | `false` | Başlangıç durumu |
| `disabled` | `boolean` | `false` | Devre dışı |
| `testID` | `string` | — | Test identifier |

**Accordion Group:**
Birden fazla Collapsible'ı sardığında, aynı anda yalnızca bir bölüm açık olabilir (exclusive mode, opsiyonel).

**Apple HIG uyumu:**
- iOS disclosure indicator (chevron) sağda, aşağı/yukarı dönüşlü.
- Animasyon smooth olmalıdır.

**Accessibility (a11y) gereksinimleri:**
- Başlık: `accessibilityRole="button"`, `accessibilityState={{ expanded }}`.
- İçerik: `accessibilityRole="region"`, `aria-labelledby` (web).
- Keyboard: Enter/Space ile toggle.

---

## 18.4. SegmentedControl — Segment Seçici Bileşeni

**Açıklama:**
Inline tab benzeri seçim bileşenidir. iOS UISegmentedControl pattern'ını takip eder. Filtreler, görünüm değişikliği (grid/list), zaman aralığı seçimi gibi yerlerde kullanılır.

**Platform davranışı:**
- **Web ve Mobile:** Pressable segment'ler + animasyonlu selection indicator (sliding background). Reanimated ile indicator slide animasyonu.

**Token tüketimi:**
- `backgroundColor` → `tokens.color.surface.sunken`
- `selectedBackgroundColor` → `tokens.color.surface.default` (beyaz, gölgeli)
- `height` → 32px
- `borderRadius` → `tokens.radius.md`
- `segmentBorderRadius` → `tokens.radius.sm`
- `fontSize` → `tokens.typography.fontSize.sm`
- `selectedFontWeight` → `tokens.typography.fontWeight.semibold`
- `shadow` (selected indicator) → `tokens.shadow.sm`
- Animasyon: indicator slide `withSpring({ damping: 15, stiffness: 150 })`, ~250ms

**Props:**
| Prop | Tip | Varsayılan | Açıklama |
|------|-----|-----------|----------|
| `segments` | `{ label: string; value: string; icon?: LucideIconName }[]` | — | Segment listesi |
| `value` | `string` | — | Seçili segment değeri |
| `onChange` | `(value: string) => void` | — | Değişim handler |
| `size` | `'sm'` \| `'md'` | `'md'` | Boyut |
| `fullWidth` | `boolean` | `true` | Tam genişlik (eşit dağılım) |
| `testID` | `string` | — | Test identifier |

**Apple HIG uyumu:**
- **UISegmentedControl pattern:** Tam uyum. Sunken background, raised selected segment, pill shape.
- 2-5 segment arası kullanılmalıdır.
- iOS-native his için spring animasyon ile sliding indicator zorunludur.

**Accessibility (a11y) gereksinimleri:**
- Container: `accessibilityRole="tablist"`.
- Her segment: `accessibilityRole="tab"`, `accessibilityState={{ selected }}`.
- Keyboard: Arrow keys ile segment geçişi.

---

## 18.5. Slider / RangeSlider — Kaydırıcı Bileşeni

**Açıklama:**
Sayısal değer veya aralık seçimi için kaydırıcı bileşenidir. Fiyat filtresi, ses seviyesi, parlakık ayarı gibi yerlerde kullanılır.

**Platform davranışı:**
- **Web:** `<input type="range">` custom styled veya Radix Slider.
- **Mobile (React Native):** Custom: Pressable + PanGestureHandler (react-native-gesture-handler) + Reanimated animasyonu.

**Kütüphane:** Mobile: Custom (react-native-gesture-handler + react-native-reanimated)

**Token tüketimi:**
- `trackHeight` → 4px
- `trackColor` → `tokens.color.surface.sunken`
- `fillColor` → `tokens.color.brand.primary`
- `thumbSize` → 24px
- `thumbColor` → `tokens.color.surface.default`
- `thumbShadow` → `tokens.shadow.md`
- `thumbBorderColor` → `tokens.color.brand.primary`

**Props:**
| Prop | Tip | Varsayılan | Açıklama |
|------|-----|-----------|----------|
| `value` | `number` \| `[number, number]` (range) | — | Değer |
| `onChange` | `(value: number \| [number, number]) => void` | — | Değişim handler |
| `min` | `number` | `0` | Minimum değer |
| `max` | `number` | `100` | Maksimum değer |
| `step` | `number` | `1` | Adım büyüklüğü |
| `range` | `boolean` | `false` | Çift thumb (aralık seçimi) |
| `showLabel` | `boolean` | `false` | Değer etiketi (thumb üstünde) |
| `haptic` | `boolean` | `true` | Step geçişlerinde hafif haptic |
| `disabled` | `boolean` | `false` | Devre dışı |
| `testID` | `string` | — | Test identifier |

**Apple HIG uyumu:**
- iOS slider: thumb 24pt, track thin, haptic on step.
- Continuous feedback: Değer değiştikçe anında UI güncellemesi.

**Accessibility (a11y) gereksinimleri:**
- `accessibilityRole="adjustable"`.
- `accessibilityValue={{ min, max, now: value }}`.
- VoiceOver: Swipe up/down ile değer artırma/azaltma.
- Keyboard: Arrow keys ile step artışı.

---

## 18.6. PasswordField — Şifre Giriş Bileşeni

**Açıklama:**
TextField (C15) üzerine kurulu, şifre girişine özel bileşendir. Show/hide toggle (göz ikonu), şifre gücü göstergesi ve password manager autofill desteği içerir.

**Platform davranışı:**
- **Web:** `<input type="password">` + show/hide toggle. `autocomplete="current-password"` veya `"new-password"`.
- **Mobile (React Native):** `<TextInput secureTextEntry={true}>` + show/hide toggle.

**Token tüketimi:** TextField (C15) token'ları + ek olarak:
- `strengthIndicatorHeight` → 4px
- `strengthColors` → weak: `tokens.color.feedback.error`, fair: `tokens.color.feedback.warning`, good: `tokens.color.feedback.success`, strong: `tokens.color.brand.primary`

**Props:** TextField (C15) ilgili prop'ları + aşağıdakiler:
| Prop | Tip | Varsayılan | Açıklama |
|------|-----|-----------|----------|
| `showToggle` | `boolean` | `true` | Show/hide toggle |
| `showStrength` | `boolean` | `false` | Şifre gücü göstergesi |
| `autoComplete` | `'current-password'` \| `'new-password'` | `'current-password'` | Autofill hint |

**State'ler:** TextField state'leri + **Visible:** Şifre metin olarak görünür (secureTextEntry=false).

**Apple HIG uyumu:**
- Password manager autofill desteği (AutoFill Passwords) zorunludur.
- Show/hide toggle sağ tarafta göz ikonu ile.

**Accessibility (a11y) gereksinimleri:**
- Toggle: `accessibilityLabel="Şifreyi göster"` / `"Şifreyi gizle"`.
- Strength indicator: `accessibilityLabel="Şifre gücü: [seviye]"`.

---

## 18.7. PhoneInput — Telefon Numarası Giriş Bileşeni

**Açıklama:**
Ülke kodu seçici + telefon numarası formatı birleşiminden oluşan bileşendir. i18n uyumlu.

**Platform davranışı:**
- **Web:** Select (C21) + TextField (C15) yan yana. Ülke kodu seçiminde bayrak + kod.
- **Mobile (React Native):** BottomSheet picker (C42) ile ülke kodu seçimi + TextField (C15) numara girişi.

**Kütüphane:** Custom (Select + TextField birleşimi). Telefon formatı validasyonu: Zod custom schema veya `libphonenumber-js` (ihtiyaç durumunda).

**Props:**
| Prop | Tip | Varsayılan | Açıklama |
|------|-----|-----------|----------|
| `value` | `{ countryCode: string; number: string }` | — | Değer |
| `onChange` | `(value: { countryCode: string; number: string }) => void` | — | Değişim handler |
| `defaultCountry` | `string` | `'TR'` | Varsayılan ülke kodu |
| `error` | `string` | `undefined` | Hata mesajı |
| `disabled` | `boolean` | `false` | Devre dışı |
| `testID` | `string` | — | Test identifier |

**Apple HIG uyumu:**
- Phone pad keyboard type zorunludur.
- Ülke kodu seçimi quick search desteklemelidir (ülke adına göre arama).

**Accessibility (a11y) gereksinimleri:**
- İki parçalı input olarak announce edilmelidir: "Ülke kodu: [kod], Telefon numarası: [numara]".
- `accessibilityRole="group"`.

---

## 18.8. CountdownTimer — Geri Sayım Bileşeni

**Açıklama:**
OTP doğrulama ekranı, session timeout, undo window (toast ile birlikte) gibi yerlerde geri sayım gösteren bileşendir.

**Platform davranışı:**
- **Web ve Mobile:** Aynı yapı. Text (C01) + `useEffect` interval veya `requestAnimationFrame`.

**Token tüketimi:**
- `fontSize` → `tokens.typography.fontSize.sm`
- `color` → `tokens.color.text.secondary`, son 10 saniye: `tokens.color.text.error`
- `fontWeight` → `tokens.typography.fontWeight.medium`

**Props:**
| Prop | Tip | Varsayılan | Açıklama |
|------|-----|-----------|----------|
| `duration` | `number` | — | Toplam süre (saniye) |
| `onComplete` | `() => void` | — | Süre bittiğinde handler |
| `format` | `'mm:ss'` \| `'ss'` \| `'m:ss'` | `'mm:ss'` | Gösterim formatı |
| `autoStart` | `boolean` | `true` | Otomatik başlat |
| `testID` | `string` | — | Test identifier |

**Apple HIG uyumu:**
- Geri sayım, kullanıcıyı baskı altına almamalıdır. Kalan süre bilgi amaçlı gösterilmelidir.
- Son 10 saniyede renk değişimi dikkat çekmek için kullanılabilir.

**Accessibility (a11y) gereksinimleri:**
- `accessibilityRole="timer"`.
- Screen reader'a her 15 saniyede veya kritik anlarda (son 30s, son 10s) `aria-live="polite"` ile announce.

---

## 18.9. WebView — Uygulama İçi Web İçerik Bileşeni

**Açıklama:**
Uygulama içinde web sayfası göstermek için kullanılan bileşendir. Kullanım öğesi, gizlilik politikası, ödeme gateway'i gibi dışarıdan yüklenen içerikler için.

**Platform davranışı:**
- **Web:** `<iframe>` veya yeni sekme/pencere.
- **Mobile (React Native):** `react-native-webview` kütüphanesi.

**Kütüphane:** `react-native-webview`

**Props:**
| Prop | Tip | Varsayılan | Açıklama |
|------|-----|-----------|----------|
| `uri` | `string` | — | Yüklenecek URL |
| `title` | `string` | — | Başlık (navigation bar) |
| `showNavigationBar` | `boolean` | `true` | Üst bar (back + title) |
| `onNavigationStateChange` | `(state: NavState) => void` | `undefined` | Navigasyon değişim handler |
| `testID` | `string` | — | Test identifier |

**State'ler:**
- **Loading:** Progress bar (ProgressBar/C36) veya spinner.
- **Loaded:** Web içeriği gösterilir.
- **Error:** Yükleme hatası → ErrorState (C38).

**Apple HIG uyumu:**
- Navigation bar ile geri butonu ve başlık gösterilmelidir (SafariViewController benzeri).
- URL bar opsiyonel olarak gösterilebilir (güvenlik).

**Accessibility (a11y) gereksinimleri:**
- WebView içeriğinin a11y'si web sayfasının kendisine bağlıdır.
- Navigation bar butonları erişilebilir olmalıdır.

---

## 18.10. DividerWithLabel — Etiketli Ayırıcı Bileşeni

**Açıklama:**
"veya" gibi metin içeren ayırıcı bileşendir. Login ekranında email ile giriş ve sosyal giriş bölümleri arasında kullanılır. Divider (C09) üzerine kuruludur.

**Platform davranışı:**
- **Web ve Mobile:** HStack + Divider + Text + Divider. Metin merkeze hizalı, her iki yanında çizgi.

**Token tüketimi:**
- Divider (C09) token'ları + `labelFontSize` → `tokens.typography.fontSize.sm`, `labelColor` → `tokens.color.text.tertiary`.
- `labelPadding` → `tokens.spacing.3` (12px — metin ile çizgi arası boşluk)

**Props:**
| Prop | Tip | Varsayılan | Açıklama |
|------|-----|-----------|----------|
| `label` | `string` | — | Ayırıcı metni (ör. "veya") |
| `testID` | `string` | — | Test identifier |

**Accessibility (a11y) gereksinimleri:**
- Decorative: `role="separator"` + `aria-hidden="true"` (çizgi), label Text kendi a11y'sini taşır.

---

## 18.11. CookieConsentBanner — Çerez İzni Banner Bileşeni

**Açıklama:**
C56 (ConsentBanner) ile aynı bileşendir. Bu madde, C56'nın spec'lendiğini teyit eder. Ek detay: KVKK ve GDPR'nin her ikisine de uyumlu olmalıdır. Consent tercihleri server-side'da da saklanmalıdır (audit trail).

---

## 18.12. NetworkStatusBanner — Ağ Durumu Banner Bileşeni

**Açıklama:**
Çevrimdışı veya yavaş bağlantı durumunu gösteren kalıcı banner bileşenidir. Banner (C33) üzerine kuruludur.

**Platform davranışı:**
- **Web:** `navigator.onLine` event listener + `NetworkInformation` API.
- **Mobile (React Native):** `@react-native-community/netinfo` kütüphanesi.

**Kütüphane:** `@react-native-community/netinfo`

**Token tüketimi:** Banner (C33) token'ları.

**State'ler:**
- **Online:** Gizli.
- **Offline:** Kırmızı banner: "İnternet bağlantısı yok." Animasyonlu slide-in.
- **Slow:** Turuncu banner: "Bağlantınız yavaş." (opsiyonel, RTT > 2000ms threshold).
- **Reconnected:** Yeşil banner: "Bağlantı yeniden sağlandı." 3 saniye sonra otomatik gizlenir.

**Apple HIG uyumu:**
- Banner, navigation bar'ın hemen altında gösterilmelidir.
- Otomatik retry mekanizması arka planda çalışmalıdır.

**Accessibility (a11y) gereksinimleri:**
- `accessibilityRole="alert"`.
- Screen reader durum değişikliğini announce etmelidir.

---

## 18.13. ForceUpdateScreen — Zorunlu Güncelleme Ekranı Bileşeni

**Açıklama:**
Mevcut dokümanın S02 (Forced Update) ekranı için component spec'idir. Full-screen modal olarak gösterilir; kapatılamaz, arka plan etkileşime kapalıdır.

**Platform davranışı:**
- **Mobile-only:** React Navigation modal (full screen, gestureless).

**Props:**
| Prop | Tip | Varsayılan | Açıklama |
|------|-----|-----------|----------|
| `currentVersion` | `string` | — | Mevcut uygulama versiyonu |
| `minimumVersion` | `string` | — | Gerekli minimum versiyon |
| `storeUrl` | `string` | — | App Store / Play Store linki |
| `message` | `string` | `'Uygulamanızı güncellemeniz gerekiyor.'` | Bilgi mesajı |

**Apple HIG uyumu:**
- Kullanıcıyı App Store'a yönlendiren tek bir buton olmalıdır.
- Geri butonu, dismiss gesture olmamalıdır (zorunlu güncelleme).

---

## 18.14. AppLockScreen — Uygulama Kilidi Ekranı Bileşeni

**Açıklama:**
Biyometrik (Face ID, Touch ID) veya PIN ile uygulamayı kilitleyen ekrandır. Finans, sağlık gibi gizlilik hassasiyeti yüksek uygulamalar için.

**Platform davranışı:**
- **Mobile-only:** `expo-local-authentication` ile biyometrik doğrulama. Alternatif: PIN giriş ekranı.

**Kütüphane:** `expo-local-authentication`

**Props:**
| Prop | Tip | Varsayılan | Açıklama |
|------|-----|-----------|----------|
| `authType` | `'biometric'` \| `'pin'` \| `'both'` | `'biometric'` | Kimlik doğrulama tipi |
| `onSuccess` | `() => void` | — | Başarılı doğrulama handler |
| `onFallback` | `() => void` | — | Fallback handler (biyometrik başarısız → PIN) |
| `maxAttempts` | `number` | `5` | Maksimum deneme sayısı |

**Apple HIG uyumu:**
- Face ID/Touch ID prompt iOS-native olmalıdır.
- Biyometrik başarısız olursa PIN'e fallback.
- Çok sayıda başarısız deneme sonrası cooldown süresi.

**Accessibility (a11y) gereksinimleri:**
- Biyometrik prompt native olduğu için VoiceOver otomatik desteklenir.
- PIN input: Her rakam ayrı focusable input (veya hidden TextInput + visual display).

---

# 19. Bootstrap Sırası — Bağımlılık Zinciri ve Uygulama Planı

Bu bölüm, component ve ekranların hangi sırayla implement edilmesi gerektiğini tanımlar. Her faz, bir önceki fazın tamamlanmasına bağımlıdır. Paralel çalışma mümkün olduğunda belirtilmiştir.

## Genel Kurallar

1. **Her fazın çıktısı test edilebilir olmalıdır.** Faz sonunda Storybook/preview + unit test + snapshot test mevcut olmalıdır.
2. **Her faz, önceki fazın "Definition of Done" kriterlerini karşıladıktan sonra başlar.**
3. **Paralel çalışma:** Aynı faz içindeki component'ler paralel geliştirilebilir.
4. **Süre tahminleri:** Tek full-stack developer için tahminidir. Takım büyüklüğüne göre ölçeklenir.

---

| Faz | Ne Açılır | Bağımlılık | İçerik Detayı | Süre Tahmini |
|-----|-----------|-----------|---------------|-------------|
| **Faz 0** | Token dosyaları (`packages/design-tokens`) | Yok | Color, typography, spacing, radius, shadow, border, icon, interaction token'ları. Light/dark mode değerleri. CSS variables + RN style objects export. | 1-2 gün |
| **Faz 1** | 12 Primitive (C01-C12) | Token'lar (Faz 0) | Text, Heading, Box, Stack, Inline, Spacer, Pressable, Icon, Divider, ScrollContainer, SafeAreaContainer, KeyboardAvoidingContainer. Her birinin unit testi + Storybook story'si. | 3-5 gün |
| **Faz 2** | Altyapı Component'leri (C53, C54, C47) | Primitive'ler (Faz 1) | ErrorBoundary (3 seviye), AuthGuard, ScreenContainer. App shell'in temel yapısı. Navigation kurulumu (React Navigation + stack/tab navigators). | 1-2 gün |
| **Faz 3** | Temel Form + Feedback (C13, C15, C22, C32, C14) | Primitive + Token (Faz 0-1) | Button (tüm variant'lar), TextField, FieldShell, Toast (web: sonner, mobile: custom), IconButton. Bu component'ler ekranların %80'inde kullanılır. | 2-3 gün |
| **Faz 4** | Durum Component'leri (C34, C35, C36, C37, C38, C39, C33) | Primitive + Token (Faz 0-1) | Skeleton, Spinner, ProgressBar, EmptyState, ErrorState, LoadingState, Banner. Her veri çekme işleminin loading/error/empty state'leri bu bileşenlerle gösterilir. | 2-3 gün |
| **Faz 5** | Sistem Ekranları (S01-S07) | Faz 2-4 component'leri | Splash, Force Update, Maintenance, Onboarding, Permission Primer, Notification Prompt, Deep Link Router. Uygulamanın ilk açılıştan auth ekranına kadar olan akışı. | 2-3 gün |
| **Faz 6** | Auth Ekranları (S08-S13) | Faz 3 + auth logic | Welcome, Login, Register, Forgot Password, OTP Verification, Password Reset. Auth state yönetimi (Zustand), API integration (TanStack Query mutation), form validation (RHF + Zod). | 3-5 gün |
| **Faz 7** | Veri Gösterim Component'leri (C25-C31) | Primitive + Token (Faz 0-1) | Avatar, Badge, Chip/Tag, Card, ListItem, SectionHeader, KeyValueRow. Liste ve detay ekranlarının yapı taşları. | 2-3 gün |
| **Faz 8** | Overlay/Modal Component'leri (C42-C46, C20, C21) | Primitive + Reanimated + Gesture Handler | BottomSheet, Modal/Dialog, ConfirmDialog, ActionSheet, Drawer (web), Switch, Select. Karmaşık etkileşim gerektiren component'ler. | 2-3 gün |
| **Faz 9** | Ana App Shell Ekranları (S17-S24) | Faz 7-8 | Tab Bar shell, Home/Feed, Search, Notifications, Profile, Settings, Edit Profile, Change Password. Uygulamanın günlük kullanım akışı. | 3-5 gün |
| **Faz 10** | Vertical Slice + Kalan (S25-S27, 18.x component'leri) | Tüm önceki fazlar | Entity list, entity detail, create/edit form. Gerçek bir CRUD akışının tam implementasyonu. DatePicker, StepIndicator, Accordion, SegmentedControl, Slider, PasswordField, PhoneInput, CountdownTimer, WebView, DividerWithLabel. | 3-5 gün |

---

## Bootstrap Sırası — Kritik Yol Grafiği

```
Faz 0 ──→ Faz 1 ──→ Faz 2 ──→ Faz 5 ──→ Faz 6
                 │          │
                 ├──→ Faz 3 ┤
                 │          ├──→ Faz 9 ──→ Faz 10
                 ├──→ Faz 4 ┤
                 │          │
                 └──→ Faz 7 ┘
                 │
                 └──→ Faz 8 ┘
```

**Kritik yol:** Faz 0 → Faz 1 → Faz 2 → Faz 5 → Faz 6 → Faz 9 → Faz 10

**Paralel çalışma fırsatları:**
- Faz 3 ve Faz 4, Faz 2 ile paralel başlayabilir (Faz 1 tamamlandıktan sonra).
- Faz 7 ve Faz 8, Faz 5 ile paralel çalışabilir.
- Faz 6, Faz 5 ile paralel başlayabilir (auth logic bağımsız geliştirilebilir).

**Toplam tahmini süre (seri):** 22-36 gün (tek developer).
**Toplam tahmini süre (2 developer, paralel):** 14-22 gün.

---

# 20. Anti-Pattern Listesi

Aşağıdaki anti-pattern'ler, component geliştirme, kütüphane seçimi, ekran açma ve bootstrap sürecinde kesinlikle kaçınılması gereken uygulamalardır. Her madde, neden anti-pattern olduğunu ve ne yapılması gerektiğini açıklar.

---

**AP-01: Primitive atlamak — Doğrudan RN/HTML element kullanmak.**
Asla doğrudan `<Text>`, `<View>`, `<div>`, `<span>` kullanmayın. Her zaman C01-C12 primitive'lerini kullanın. Nedeni: Token tutarlılığı kaybolur, dark mode kırılır, a11y eksik kalır. Lint rule ile enforce edilmelidir (`no-restricted-imports`).

**AP-02: Token bypass — Hardcoded renk, font, spacing değeri.**
`color="#FF0000"`, `fontSize={14}`, `padding={16}` gibi hardcoded değerler yasaktır. Her zaman token reference kullanılmalıdır: `color="error"`, `fontSize="sm"`, `padding="4"`. Lint rule: `no-hardcoded-design-values`.

**AP-03: Platform dallanmasını component dışına taşımak.**
Ekran dosyasında `Platform.OS === 'ios' ? ... : ...` yazmayın. Platform farklılıkları component içinde soyutlanmalıdır. Ekran kodu platform-agnostic olmalıdır.

**AP-04: Monolitik ekran dosyası — 300+ satır tek dosya.**
Bir ekran dosyası 300 satırı geçiyorsa bölünmelidir. Çözüm: Section component'leri, custom hook'lar, helper fonksiyonlar ayrı dosyalara çıkarılmalıdır. Ekran dosyası sadece layout + composition olmalıdır.

**AP-05: Global state'i form state olarak kullanmak.**
Form state'ini Zustand'a koymayın. Form state'i RHF tarafından yönetilmelidir. Zustand yalnızca global application state (auth, theme, preferences) içindir. Form state component-local kalmalıdır.

**AP-06: useEffect içinde veri çekmek.**
`useEffect` + `fetch` + `useState` pattern'ı yasaktır. TanStack Query (`useQuery`, `useMutation`, `useInfiniteQuery`) kullanılmalıdır. Nedeni: Cache yönetimi, stale data, retry, deduplication, loading/error state'leri TanStack Query tarafından otomatik yönetilir.

**AP-07: Component prop'larında `any` tipi kullanmak.**
`props: any`, `style: any` yasaktır. Her prop TypeScript ile strict typed olmalıdır. Token değerleri union type olmalıdır: `color: 'primary' | 'secondary' | 'error'`. Generic prop'lar `unknown` veya generic `<T>` ile tip güvenli olmalıdır.

**AP-08: z-index savaşı — Rastgele z-index değerleri.**
`zIndex: 99999` gibi rastgele değerler yasaktır. z-index değerleri token olarak tanımlanmalıdır: `tokens.zIndex.dropdown`, `tokens.zIndex.modal`, `tokens.zIndex.toast`. Katman hiyerarşisi: content (0) < dropdown (10) < sticky (20) < modal (30) < toast (40) < skip-to-content (50).

**AP-09: Accessibility'yi "sonra ekleriz" demek.**
a11y, component'in ilk versiyonunda olmalıdır. "Sonra ekleriz" denilen a11y hiçbir zaman eklenmez. CI'da axe-core (web) ve a11y test'leri çalıştırılmalıdır. PR'da a11y checklist zorunlu olmalıdır.

**AP-10: Kütüphane wrapper'ı yazmadan doğrudan kullanmak.**
3rd-party kütüphanelerin API'sini doğrudan ekran/component dosyalarına import etmeyin. Wrapper/adapter pattern kullanın. Örnek: `@gorhom/bottom-sheet` doğrudan import edilmemeli; `packages/ui/src/components/BottomSheet` wrapper'ı kullanılmalıdır. Nedeni: Kütüphane değişikliği tek noktadan yapılır, API tutarlılığı sağlanır.

**AP-11: Navigation logic'i component içinde.**
Component dosyası içinde `navigation.navigate()` çağrısı yapmayın. Navigation logic ekran dosyasında veya custom hook'ta olmalıdır. Component'ler `onPress` callback almalı, nereye navigate edileceğini bilmemelidir.

**AP-12: Inline style — Style prop'unda obje literal.**
`style={{ backgroundColor: 'red', padding: 16 }}` yerine Tailwind/NativeWind class'ları kullanılmalıdır: `className="bg-red-500 p-4"`. Inline style yalnızca dynamic/computed değerler için (animasyon, Reanimated `useAnimatedStyle`) kabul edilir.

**AP-13: Fazları atlayarak ekran geliştirmek.**
Faz 5'teki ekranı Faz 1'deki primitive'ler tamamlanmadan geliştirmeye başlamayın. Sonuç: Primitive'ler değiştiğinde ekran kodu bozulur, yeniden yazılır. Bootstrap sırası (Bölüm 19) kesinlikle takip edilmelidir.

**AP-14: Her component için ayrı loading/error/empty yönetimi.**
Her component'te kendi loading spinner'ını yazmayın. LoadingState (C39), ErrorState (C38), EmptyState (C37) bileşenlerini kullanın. TanStack Query'nin `isLoading`, `isError`, `data` state'leri ile condition render yapın.

**AP-15: Overengineering — İhtiyaç olmayan component'i erken yazmak.**
İlk fazda kullanılmayan component'leri "lazım olur" diye yazmayın. YAGNI (You Aren't Gonna Need It) prensibi geçerlidir. Component, ilk kullanım noktasında yazılmalıdır. Bu doküman sadece neyin yazılacağını tanımlar; ne zaman yazılacağını bootstrap sırası belirler.

**AP-16: Dark mode'u "sonra hallederiz" demek.**
Dark mode, Faz 0'da (token katmanı) hazırlanmalıdır. Token'lar light/dark değerler içermelidir. Component'ler token kullandığında dark mode otomatik çalışır. "Sonra hallederiz" denildiğinde tüm component'ler tek tek güncellenmek zorunda kalır.

**AP-17: Tek component'te 500+ satır.**
Bir component dosyası 500 satırı geçiyorsa bölünmelidir. Çözüm: Alt component'ler (Compound Component pattern), utility fonksiyonlar, custom hook'lar ayrı dosyalara çıkarılmalıdır.

**AP-18: Test olmadan merge etmek.**
Component PR'ı test olmadan merge edilmez. Minimum test gereksinimleri: unit test (logic), render test (doğru element render ediliyor mu), a11y test (axe-core veya jest-axe), snapshot test (görsel regresyon baseline). Storybook story zorunludur.

**AP-19: Ekran dosyasında business logic.**
Ekran dosyası yalnızca UI composition (layout + component birleştirme) içermelidir. API çağrıları, data transformation, validation logic, formatters → custom hook'lara veya service katmanına taşınmalıdır. Ekran dosyası max 150-200 satır olmalıdır.

**AP-20: Kendi state yönetim çözümünü icat etmek.**
Context + useReducer + custom event bus gibi custom state çözümleri yazılmamalıdır. Canonical stack zaten çözüm sunmaktadır: Zustand 5 (global state), TanStack Query 5 (server state), RHF 7 (form state). Bu üçlü dışında state yönetimine ihtiyaç yoktur.

---

# 21. Onay Kriterleri

Bu dokümanın ve içerdiği tüm component/ekran spec'lerinin "tamamlandı" sayılabilmesi için aşağıdaki kriterlerin hepsinin karşılanması zorunludur.

---

**OK-01: Token Kapsama Oranı — %100.**
Tüm component'lerde kullanılan renk, font, spacing, radius, shadow, border değerlerinin tamamı `packages/design-tokens` üzerinden gelmelidir. Hiçbir hardcoded değer kabul edilmez. Doğrulama: Lint rule (`no-hardcoded-design-values`) CI'da çalışır ve 0 hata verir.

**OK-02: Platform Paritesi — Web ve Mobile Tutarlılığı.**
Her component web'de ve mobile'da aynı davranışı sergiler (platform-spesifik farklılıklar spec'te belgelenmiş olanlarla sınırlıdır). Doğrulama: Her component için hem web hem mobile Storybook story'si veya test'i mevcuttur. Ekran başına cross-platform visual regression test geçer.

**OK-03: Accessibility Minimum Standardı — WCAG 2.1 AA.**
Tüm component'ler WCAG 2.1 AA seviyesini karşılar. Doğrulama yöntemi: (a) Web: axe-core veya jest-axe ile otomatik a11y testi her component için mevcuttur ve CI'da çalışır. (b) Mobile: VoiceOver (iOS) ve TalkBack (Android) ile manuel test planı tamamlanmıştır. (c) Renk kontrastı: Tüm metin/arka plan kombinasyonları 4.5:1 (normal metin) veya 3:1 (büyük metin) kontrastını karşılar. (d) Tüm interactive element'ler keyboard ile erişilebilirdir (web), VoiceOver ile kullanılabilirdir (mobile).

**OK-04: Apple HIG Uyum Puanı — Her Component İçin Doğrulanmış.**
Bu dokümanda belirtilen Apple HIG uyum notlarının tamamı karşılanmıştır. Doğrulama: (a) 44pt minimum touch target her interactive element'te ölçülmüştür. (b) Dynamic Type desteği test edilmiştir (iOS accessibility font size büyütme). (c) Navigation bar, tab bar, sheet, alert pattern'ları iOS-native davranışa sadık kalır. (d) Haptic feedback doğru yerlerde tetiklenir. Audit checklist (`31-audit-checklist.md`) HIG maddelerini içerir.

**OK-05: Test Kapsama Oranı — Component %80+, Ekran %70+.**
Her component için: (a) Unit test — logic (state geçişleri, prop handling, edge case'ler). (b) Render test — doğru element'ler render ediliyor mu. (c) a11y test — axe-core veya jest-axe. (d) Snapshot test — görsel regresyon baseline. Her ekran için: (a) Integration test — component birleşimi, navigation, veri akışı. (b) Happy path E2E test (opsiyonel ama önerilen). CI'da tüm testler geçer.

**OK-06: Storybook / Preview Kapsama — %100.**
Her component (C01-C56) için Storybook story mevcuttur. Story şunları içerir: (a) Tüm variant'lar (primary, secondary, destructive vb.). (b) Tüm state'ler (idle, hover, pressed, focused, disabled, loading, error). (c) Tüm size'lar (sm, md, lg). (d) Dark mode preview. (e) a11y panel (Storybook a11y addon). Her ekran (S01-S27) için preview story veya demo page mevcuttur.

**OK-07: Bootstrap Sırası Uyumu — Faz Geçiş Kriterleri Karşılanmış.**
Her fazdan sonraki faza geçişte, mevcut fazın tüm component'leri: (a) Merge edilmiştir (main branch'te). (b) Test'leri CI'da geçer. (c) Storybook story'si mevcuttur. (d) Code review tamamlanmıştır. (e) a11y testi geçer. Faz atlama (AP-13) yapılmamıştır.

**OK-08: Doküman-Kod Senkronizasyonu.**
Bu dokümandaki her component spec'i ile codebase'deki gerçek implementation arasında tutarlılık vardır. Prop adları, token referansları, a11y gereksinimleri ve variant'lar dokümandaki ile aynıdır. Doğrulama: Sprint review'da doküman vs. implementation diff kontrolü yapılır. Uyumsuzluk varsa doküman veya kod güncellenir.

---

# 22. Sonuç

Bu doküman, boilerplate projesinin ilk çalışan ürüne ulaşması için gereken tüm varsayılan component'leri, ekranları ve bootstrap sürecini detaylı olarak tanımlamaktadır. Toplam **56 component** (C01-C56) ve **14 ek bileşen/ekran** (18.1-18.14) spec'lenmiştir.

**Temel ilkeler:**
- Her component, design token'ları doğrudan tüketir ve hiçbir yerde hardcoded değer kullanılmaz.
- Platform farklılıkları component katmanında soyutlanır; ekran kodu platform-agnostic kalır.
- Accessibility (WCAG 2.1 AA) ve Apple HIG uyumu, "sonra ekleriz" değil, ilk versiyonda sağlanır.
- Bootstrap sırası kesinlikle takip edilir; token → primitive → altyapı → form/feedback → ekran zinciri kırılmaz.
- 20 anti-pattern, ekip genelinde "neyi yapmayacağız" konusunda net bir çerçeve çizer.
- 8 onay kriteri, "tamamlandı" tanımını subjektiflikten kurtarır.

**Bu doküman tek başına mimari karar üretmez.** Canonical stack kararları (ADR-001 → ADR-017 + 36/37/38 canonical governance belgeleri) ve governance kuralları (23-component-governance, 25-error-empty-loading, 32-definition-of-done) bu dokümanın üst katman referanslarıdır. Bu doküman, o kararları somut ve uygulanabilir bir plana dönüştürür.

**Bir sonraki adım:** Faz 0 — token dosyalarının oluşturulması (`packages/design-tokens`). Token dosyaları hazır olduğunda Faz 1 primitive'lerine geçilir.

---

# 23. Onboarding Deneyimi ve Kullanıcı Tutma Stratejisi (2026-04-01 Eki)

## 23.1. Onboarding tasarım ilkeleri

### 23.1.1. "Aha moment" optimizasyonu

Kullanıcı ilk oturumda ürünün temel değer önerisini deneyimlemelidir. Onboarding akışı, kullanıcıyı mümkün olan en kısa sürede ürünün çekirdek özelliğiyle buluşturmalıdır. Uzun form doldurma, gereksiz bilgi toplama veya aşırı açıklama ekranları bu hedefe zarar verir.

### 23.1.2. Progressive disclosure

Bilgi yüklemesi kademeli yapılmalıdır. Kullanıcıya tüm özellikleri ilk anda göstermek yerine, bağlama uygun zamanlarda ilgili bilgi sunulmalıdır. Onboarding ekranları en fazla 3-5 adımdan oluşmalıdır; her adım tek bir kavramı iletmelidir.

### 23.1.3. Personalized onboarding

Kullanıcı rolü veya amacına göre farklı onboarding akışları sunulabilir. Örneğin:
- Farklı kullanıcı tipleri (bireysel/kurumsal) için farklı ilk deneyim
- Kullanıcının belirttiği amaca göre öne çıkarılan özellikler
- Deneyim seviyesine göre detay düzeyi ayarı

Bu kişiselleştirme opsiyoneldir ancak desteklenebilir mimari ile tasarlanmalıdır.

## 23.2. Gamification elementleri

### 23.2.1. Progress bar

Onboarding tamamlanma yüzdesi kullanıcıya görsel olarak gösterilmelidir. Bu, kullanıcıya "ne kadar kaldı?" sorusunu cevaplar ve tamamlama motivasyonu sağlar.

### 23.2.2. Streak

Ardışık kullanım günleri takip edilebilir. Streak mekanizması, kullanıcının düzenli kullanım alışkanlığı geliştirmesini teşvik eder. Streak kırıldığında cezalandırıcı olmayan, teşvik edici bir yaklaşım benimsenmelidir.

### 23.2.3. Badge/achievement

Belirli aksiyonları tamamlama (profil doldurma, ilk görev tamamlama, ayarları yapılandırma) badge ile ödüllendirilebilir. Badge sistemi aşırıya kaçmamalı ve ürünün ana değerine hizmet etmelidir.

### 23.2.4. Gated content

İlerlemeye bağlı içerik açılması, kullanıcıyı keşfe teşvik eder. Ancak kritik özellikler gate'lenmemeli; yalnızca ek değer katan içerikler kademeli açılmalıdır.

## 23.3. Retention hedefleri ve metrikleri

Aşağıdaki hedefler sektör standartlarına dayalı referans değerlerdir; ürüne göre özelleştirilebilir:

| Metrik | Hedef |
|--------|-------|
| Day 1 retention | > %40 |
| Day 7 retention | > %20 |
| Day 30 retention | > %10 |
| Sign-up completion rate | > %70 |

Bu hedefler ölçülebilir olmalı ve analitik altyapısı ile takip edilmelidir (ADR-009 observability kararı ile uyumlu).

## 23.4. Tooltip ve coach mark stratejisi

### 23.4.1. First-time user vs returning user

Tooltip ve coach mark'lar yalnızca first-time user'lara gösterilmelidir. Returning user'lar için bu elementler gösterilmez; ancak kullanıcı talep ederse (ör. "ipuçlarını tekrar göster" seçeneği) yeniden erişilebilir olmalıdır.

### 23.4.2. Contextual tooltip

Tooltip'ler ilgili özellik ilk kez kullanıldığında bağlamsal olarak gösterilmelidir. Tüm tooltip'leri onboarding sırasında sıralı göstermek yerine, kullanıcı ilgili alana ulaştığında tetiklenmesi tercih edilir.

### 23.4.3. Tooltip davranış kuralları

- Her tooltip **dismissible** (kapatılabilir) olmalıdır.
- Tooltip'ler **non-blocking** olmalıdır; kullanıcının akışını kesmemelidir.
- Tek bir akışta maksimum **3-5 adım** tooltip gösterilmelidir.
- Tooltip konumu, gösterdiği öğeyi kapatmamalıdır.
- Dark/light tema ile uyumlu tooltip tasarımı zorunludur.

## 23.5. Re-engagement mekanizmaları

### 23.5.1. Push notification

İnaktif kullanıcılar için push notification stratejisi belirlenmelidir. Bu alan ADR-013 ile entegre çalışır. Notification içeriği kullanıcıyı ürüne geri çekecek değer önerisi taşımalıdır; spam niteliğinde bildirimler yasaktır.

### 23.5.2. Email re-engagement

Backend altyapısı mevcutsa, belirli inaktiflik süresinin ardından re-engagement e-posta'ları gönderilebilir. Bu alan opsiyoneldir ve backend bağımlıdır.

### 23.5.3. In-app "welcome back" deneyimi

Uzun süredir uygulama kullanmayan kullanıcılara geri döndüklerinde:
- "Tekrar hoş geldiniz" ekranı gösterilebilir
- Son kullanımdan bu yana eklenen yeni özellikler özetlenebilir
- Kullanıcının kaldığı yerden devam etmesi sağlanabilir

## 23.6. Onboarding ekran sırası

39-default-screens-and-components-spec'teki mevcut ekran seti ile uyumlu onboarding akışı:

1. **Splash** → Uygulama yükleniyor, branding görünür
2. **Permission (kademeli)** → Notification, location gibi izinler önceden açıklanır (pre-prompt). İzin neden gerektiği kullanıcıya açık ve anlaşılır biçimde iletilmelidir. Tüm izinler tek seferde istenmemeli; ilgili özellik kullanılacağı anda istenmelidir.
3. **Value proposition** → Ürünün temel değeri 2-3 ekranda anlatılır (karousel veya sayfalı yapı)
4. **Signup/Login** → Auth akışı (ADR-010 ile uyumlu)
5. **Home** → Kullanıcı ürünün ana ekranına ulaşır

Bu sıra ürüne göre özelleştirilebilir; ancak permission pre-prompt ve value proposition adımlarının login'den önce gelmesi önerilir.

## 23.7. Ölçüm ve analitik

### 23.7.1. Onboarding funnel

Onboarding akışının her adımında event kaydı yapılmalıdır:
- Adım görüntüleme
- Adım tamamlama
- Adımdan çıkma (drop-off)
- Toplam tamamlama süresi

### 23.7.2. Drop-off analizi

Drop-off noktaları düzenli olarak analiz edilmeli ve optimizasyon yapılmalıdır. En yüksek drop-off oranına sahip adımlar öncelikli iyileştirme hedefi olmalıdır.

### 23.7.3. A/B test desteği

Onboarding akışı A/B test altyapısına uygun olmalıdır. Farklı onboarding varyantları (adım sayısı, içerik sırası, görsel yaklaşım) test edilebilir şekilde tasarlanmalıdır. Analitik altyapı ADR-009 observability kararı ile uyumlu olmalıdır.
