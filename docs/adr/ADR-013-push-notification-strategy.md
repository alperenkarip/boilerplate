# ADR-013 — Push Notification Strategy

## Doküman Kimliği

- **ADR ID:** ADR-013
- **Başlık:** Push Notification Strategy
- **Durum:** Accepted
- **Tarih:** 2026-04-01
- **Karar türü:** Foundational runtime, mobile notification infrastructure, cross-platform push delivery kararı
- **Karar alanı:** Push notification altyapısı, izin yönetimi, rich notification desteği, silent push stratejisi, notification gruplandırma, deep linking entegrasyonu, analytics ve platform-specific davranış farkları
- **İlgili üst belgeler:**
  - `ADR-002-mobile-runtime-and-native-strategy.md`
  - `ADR-009-observability-stack.md`
  - `ADR-010-auth-session-and-secure-storage-baseline.md`
  - `ADR-014-deep-linking-and-universal-links.md`
  - `27-security-and-secrets-baseline.md`
  - `28-observability-and-debugging.md`
  - `36-canonical-stack-decision.md`
- **Etkilediği belgeler:**
  - `20-initial-implementation-checklist.md`
  - `21-repo-structure-spec.md`
  - `30-contribution-guide.md`
  - `31-audit-checklist.md`
  - `32-definition-of-done.md`
  - `37-dependency-policy.md`
  - `38-version-compatibility-matrix.md`

---

# 1. Karar Özeti

Bu ADR ile aşağıdaki karar kabul edilmiştir:

- **Canonical push notification SDK:** `expo-notifications` (Expo SDK entegrasyonu ve managed workflow uyumu nedeniyle)
- **Push delivery altyapısı:** FCM (Firebase Cloud Messaging) + APNs; backend push service vendor-agnostic tutulur
- **İzin yönetimi:** Contextual permission request zorunlu; cold-start izin isteme yasaktır
- **Rich notification:** Resim, aksiyon butonları ve kategori desteği zorunlu baseline kapsamındadır
- **Silent push:** Background data sync ve content prefetch için kontrollü kullanım
- **Gruplandırma:** iOS notification thread, Android notification channel disiplini zorunlu
- **Deep linking:** Push notification ile deep link routing bütünlüğü ADR-014 ile hizalıdır
- **Analytics:** Push delivery rate, tıklanma oranı ve opt-in rate canonical observability kapsamındadır

Bu ADR'nin ana hükmü şudur:

> Push notification bu boilerplate'te rastgele entegre edilen bir özellik değildir. `expo-notifications` canonical SDK olarak kabul edilmiştir; izin yönetimi contextual ve kullanıcı dostu tasarlanacak, notification payload'ları güvenlik ve privacy ilkelerine uyacak, platform-specific kanal ve gruplandırma disiplini baştan kurulacaktır.

---

# 2. Problem Tanımı

Push notification kararı verilmezse aşağıdaki sorunlar kaçınılmazdır:

- Farklı platformlar için farklı SDK'lar kullanılır, cross-platform parity bozulur
- İzin yönetimi cold-start'ta agresif yapılır, opt-in oranı düşer
- Notification channel ve thread yapısı kurulmaz, kullanıcı bildirimleri kontrol edemez
- Deep link ve notification routing ayrık yapılır, kullanıcı yanlış ekrana yönlendirilir
- Silent push kontrolsüz kullanılır, battery drain ve platform rejection riski doğar
- Analytics eksik kalır, push kampanyalarının etkisi ölçülemez
- Rich notification desteği platform bazında tutarsız olur
- Hassas veri notification payload'larına sızar

---

# 3. Bağlam

Bu boilerplate'in push notification açısından taşıdığı zorunluluklar şunlardır:

1. **Cross-platform yapı:** Hem iOS hem Android için tek SDK ile tutarlı davranış
2. **Expo-first runtime:** ADR-002 ile kilitlenmiş Expo SDK 55.x ekosistemi; native modül tercihi Expo-uyumlu olmalı
3. **Security-first:** Notification payload'ları hassas veri taşımamalı. Auth boundary kontrolü (ADR-010) notification payload'larının hassas token içermemesini garanti eder.
4. **Privacy uyumu:** İzin yönetimi GDPR ve KVKK ilkeleriyle uyumlu, kullanıcı tercihine saygılı
5. **Deep linking bütünlüğü:** ADR-014 ile entegre push-to-screen routing
6. **Observability:** ADR-009 kapsamında push analytics ölçülebilir ve raporlanabilir
7. **Platform farkları:** iOS ve Android notification modelleri farklıdır; bu farklar soyutlanmalı ama görmezden gelinmemeli
8. **Backend-agnostic:** Push gönderim servisi vendor-bağımsız tasarlanmalı

---

# 4. Karar Kriterleri

1. **Expo SDK uyumu ve managed workflow desteği**
2. **Cross-platform API tutarlılığı (iOS + Android)**
3. **FCM ve APNs native entegrasyon kalitesi**
4. **Rich notification (resim, aksiyon) desteği**
5. **Silent/background push desteği**
6. **Notification channel ve thread yönetimi**
7. **Deep link routing entegrasyonu**
8. **İzin yönetimi esnekliği (contextual, provisional)**
9. **Analytics ve observability entegrasyonu**
10. **Community büyüklüğü, bakım sürekliliği ve dokümantasyon kalitesi**
11. **Vendor lock-in riski**
12. **Güvenlik ve privacy uyumu**

---

# 5. Değerlendirilen Alternatifler

## 5.1. expo-notifications

- Expo SDK ile doğal entegrasyon
- Managed ve bare workflow desteği
- FCM ve APNs üzerinden push delivery
- Rich notification, notification categories, silent push desteği
- Expo push service (opsiyonel) ile basitleştirilmiş backend entegrasyonu
- Açık kaynak, aktif bakım

## 5.2. OneSignal

- Kendi push delivery altyapısı
- Dashboard ve segmentasyon özellikleri
- Vendor lock-in riski yüksek
- Expo ile entegrasyon mümkün ama native modül gerektiriyor
- Ücretsiz katman sınırlı, ölçekte maliyet artışı

## 5.3. Pusher (Beams)

- Real-time odaklı platform
- Push notification ana odak noktası değil
- Expo entegrasyonu resmi olarak desteklenmiyor
- Community küçük

## 5.4. Custom FCM/APNs direkt kullanım

- Maksimum kontrol
- Her platform için ayrı native modül ve konfigürasyon
- Expo managed workflow ile uyumsuz
- Bakım maliyeti çok yüksek
- Rich notification, channel yönetimi, izin handling manuel yazılmalı

---

# 6. Seçilen Karar

Bu boilerplate için canonical push notification kararı şu şekilde kabul edilmiştir:

## 6.1. Canonical SDK

`expo-notifications` bu boilerplate'in push notification SDK'sıdır.

## 6.2. Push delivery altyapısı

- iOS: APNs (Apple Push Notification service) üzerinden delivery
- Android: FCM (Firebase Cloud Messaging) üzerinden delivery
- Backend push service vendor-agnostic tasarlanır; Expo push service opsiyonel kolaylık katmanı olarak kullanılabilir ama zorunlu değildir

## 6.3. İzin yönetimi

- **Cold-start permission request yasaktır.** Uygulama ilk açılışta push izni istemez
- **Contextual permission request zorunludur.** İzin, kullanıcının bildirim alacağı özelliğe ilk kez eriştiğinde veya ilgili bir aksiyon sonrasında istenir
- **Pre-permission UX:** İzin istenmeden önce kullanıcıya bildirimlerin ne işe yarayacağı açıklanır (custom pre-permission dialog)
- **iOS provisional notifications:** iOS 12+ provisional authorization desteği aktif tutulur; kullanıcı sessiz bildirim alabilir, kalıcı izin sonraya bırakılabilir
- **İzin durumu takibi:** granted, denied, undetermined durumları state olarak yönetilir

## 6.4. Rich notification

- Resim eki (image attachment) desteği zorunlu
- Aksiyon butonları (notification actions/categories) desteklenir
- iOS notification content extension ve Android expanded notification layout uyumu sağlanır

## 6.5. Silent/background push

- Silent push yalnızca kontrollü senaryolarda kullanılır: background data sync, content prefetch, badge güncellemesi
- Aşırı kullanım yasaktır; platform throttling ve battery drain riski gözetilir
- iOS background fetch ve Android WorkManager ile koordinasyon düşünülür

## 6.6. Notification gruplandırma ve önceliklendirme

- **iOS:** `threadIdentifier` ile notification thread gruplandırması zorunlu
- **Android:** Notification channel yapısı uygulama kurulumunda tanımlanır; kanal adları kullanıcı dostu ve i18n uyumlu olur
- **Önceliklendirme:** Yüksek öncelikli (mesaj, güvenlik uyarısı) ve düşük öncelikli (pazarlama, bilgi) bildirimler ayrı kanal/thread'de yönetilir

## 6.7. Deep link entegrasyonu

- Her notification payload'ı opsiyonel deep link URL taşıyabilir
- Notification tıklanması durumunda ADR-014 kapsamındaki deep link routing mekanizması devreye girer
- Cold-start ve warm-start senaryolarında notification-to-screen routing deterministik tasarlanır

## 6.8. Notification payload güvenliği

- Payload'lara hassas kullanıcı verisi (ad-soyad, e-posta, finansal veri) yazılmaz
- Notification body'si generic tutulur; detay bilgisi uygulama içinde fetch edilir
- Payload içeriği observability tarafında loglanırken PII maskeleme uygulanır

---

# 7. Neden Bu Karar?

## 7.1. Expo ekosistemi ile doğal uyum

`expo-notifications`, Expo SDK'nın birinci sınıf modülüdür. ADR-002 ile kilitlenmiş Expo SDK 55.x managed workflow'u ile sorunsuz çalışır. Ayrı native modül bridge'i veya custom konfigürasyon gerektirmez.

## 7.2. Cross-platform API tutarlılığı

Tek API ile hem iOS hem Android notification lifecycle'ını yönetir. Platform farklarını soyutlar ama gerektiğinde platform-specific konfigürasyon yapılmasına izin verir.

## 7.3. Vendor lock-in yok

`expo-notifications` açık kaynaklıdır ve FCM/APNs üzerine inşa edilmiştir. Backend push service bağımsızdır; Expo push service kullanılabilir ama zorunlu değildir. Vendor değişikliği backend tarafında yapılabilir, client SDK değişmez.

## 7.4. Rich notification ve silent push desteği

Resim eki, aksiyon butonları, notification categories, silent push ve background fetch desteği kutudan gelir.

## 7.5. Community ve bakım

Expo ekosisteminin en aktif modüllerinden biridir. Dokümantasyon kapsamlıdır, breaking change'ler Expo SDK major sürümleriyle senkronize yönetilir.

---

# 8. Reddedilen Yönler

## 8.1. OneSignal reddedilmiştir

- **Neden:** Vendor lock-in riski yüksektir. Kendi push delivery altyapısı Expo managed workflow ile uyumlu olsa da ek native modül gerektirir. Ölçekte maliyet artışı boilerplate için kabul edilemez.
- **Ek risk:** Push delivery, segmentasyon ve analytics gibi temel yetenekler vendor'a bağımlı hale gelir; backend-agnostic ilke ihlal edilir.

## 8.2. Pusher (Beams) reddedilmiştir

- **Neden:** Push notification Pusher'ın ana odak noktası değildir. Expo resmi entegrasyonu yoktur. Community küçük, dokümantasyon yetersizdir.

## 8.3. Custom FCM/APNs direkt kullanım reddedilmiştir

- **Neden:** Expo managed workflow ile uyumsuzdur. Her platform için ayrı native modül, konfigürasyon ve bakım gerektirir. Rich notification, izin yönetimi ve channel handling tamamen manuel yazılmalıdır. Boilerplate seviyesinde bakım maliyeti kabul edilemez derecede yüksektir.

---

# 9. Riskler

## 9.1. Expo push service bağımlılığı

Expo push service kullanılırsa Expo altyapısına operasyonel bağımlılık oluşur. Servis kesintisi push delivery'yi etkiler.

## 9.2. Platform throttling

Silent push aşırı kullanılırsa iOS ve Android platform seviyesinde throttle uygular; bildirimler gecikir veya iletilmez.

## 9.3. İzin reddedilme oranı

Contextual permission request doğru uygulanmazsa kullanıcılar izni reddedebilir ve geri kazanım zorlaşır.

## 9.4. Notification channel karmaşıklığı

Android notification channel'ları uygulama kurulumunda oluşturulur ve sonradan programatik olarak silinemez. Yanlış kanal yapısı kalıcı sorun yaratır.

## 9.5. Rich notification platform farkları

iOS ve Android'de rich notification davranışları farklıdır; tutarsız kullanıcı deneyimi riski vardır.

---

# 10. Risk Azaltma Önlemleri

1. **Expo push service opsiyonel tutulur:** Backend doğrudan FCM/APNs endpoint'lerine de push gönderebilir; Expo push service tek bağımlılık noktası olmaz
2. **Silent push kullanım politikası:** Silent push yalnızca tanımlanmış senaryolarda kullanılır; frekans limiti uygulanır
3. **Pre-permission UX zorunlu:** İzin istenmeden önce kullanıcıya değer önerisi sunulur; contextual timing disiplini uygulanır
4. **Notification channel planlaması:** Channel yapısı uygulama geliştirme başlangıcında planlanır, ad hoc kanal oluşturma yasaktır
5. **Platform-specific test:** Rich notification davranışları her iki platformda ayrı ayrı test edilir
6. **Push analytics:** Delivery rate, tıklanma oranı ve opt-in rate ADR-009 observability kapsamında izlenir; düşük performans erken tespit edilir
7. **Payload güvenlik review:** Push payload'ları güvenlik review kapsamına alınır; PII sızıntısı denetlenir

---

# 11. Non-Goals

Bu ADR aşağıdakileri çözmez:

- Backend push service vendor seçimi (Firebase Functions, AWS SNS, custom service gibi)
- Push kampanya yönetimi ve segmentasyon stratejisi
- In-app notification center (inbox) tasarımı
- Web push notification (service worker tabanlı)
- SMS ve e-posta bildirim kanalları
- Push notification içerik stratejisi ve copywriting kuralları
- A/B test altyapısı

---

# 12. Sonuç ve Etkiler

Bu ADR kabul edildiğinde aşağıdaki sonuçlar doğar:

1. `expo-notifications` canonical push notification SDK'sı olarak dependency policy'ye (37) ve compatibility matrix'e (38) eklenir
2. Notification izin yönetimi contextual olarak tasarlanır; cold-start permission request yasaktır
3. Android notification channel yapısı uygulama başlangıcında planlanır ve dokümante edilir
4. iOS notification thread gruplandırması canonical davranış olur
5. Push notification payload'ları güvenlik review kapsamına alınır
6. Deep link routing ile notification tıklanma davranışı ADR-014 ile hizalı tutulur
7. Push analytics (delivery, click, opt-in) observability baseline'a eklenir
8. Silent push kullanım politikası tanımlanır ve frekans limiti uygulanır
9. Repo yapısında notification modülü kontrollü boundary içinde tutulur
10. Contribution guide ve audit checklist push notification maddelerini içerir

---

# 13. Onay Kriterleri

Bu ADR yeterli kabul edilir eğer:

1. Canonical SDK seçimi (`expo-notifications`) ve gerekçesi açıkça yazılmışsa
2. İzin yönetimi politikası (contextual, pre-permission, provisional) net tanımlanmışsa
3. Rich notification, silent push ve gruplandırma stratejisi belirtilmişse
4. Deep link entegrasyonu ADR-014 ile bağlantılı olarak açıklanmışsa
5. Platform farkları (iOS/Android) görünür kılınmışsa
6. Payload güvenlik ilkeleri tanımlanmışsa
7. Analytics gereksinimleri observability baseline ile hizalıysa
8. Alternatifler ve ret gerekçeleri dürüstçe yazılmışsa
9. Riskler ve risk azaltma önlemleri somutsa
10. Bu karar, implementation ekibine push notification altyapısını kuracak netlikte baseline sağlıyorsa
