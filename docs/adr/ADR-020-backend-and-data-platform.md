# ADR-020 — Backend and Data Platform

## Doküman Kimliği

- **ADR ID:** ADR-020
- **Başlık:** Backend and Data Platform
- **Durum:** Accepted
- **Tarih:** 2026-06-26
- **Karar türü:** Foundational backend, data platform, server logic ve BaaS topology decision
- **Karar alanı:** Backend platform seçimi, database modeli, server-side logic execution, scheduled/async job altyapısı, object storage, read/write boundary, SDK stratejisi ve cross-platform port/adapter mimarisi
- **İlgili üst belgeler:**
  - `36-canonical-stack-decision.md`
  - `17-technology-decision-framework.md`
  - `37-dependency-policy.md`
  - `38-version-compatibility-matrix.md`
  - `45-boilerplate-project-boundary-contract.md`
  - `21-repo-structure-spec.md`
  - `ADR-002-mobile-runtime-and-native-strategy.md`
  - `ADR-005-data-fetching-cache-and-mutation-model.md`
  - `ADR-013-push-notification-strategy.md`
  - `ADR-021-authentication-platform.md`
- **Etkilediği belgeler:**
  - `36-canonical-stack-decision.md`
  - `37-dependency-policy.md`
  - `38-version-compatibility-matrix.md`
  - `45-boilerplate-project-boundary-contract.md`
  - `21-repo-structure-spec.md`
  - `20-initial-implementation-checklist.md`
  - `30-contribution-guide.md`
  - `31-audit-checklist.md`
  - `32-definition-of-done.md`
  - `ADR-002-mobile-runtime-and-native-strategy.md`
  - `ADR-005-data-fetching-cache-and-mutation-model.md`
  - `ADR-021-authentication-platform.md`

---

# 1. Karar Özeti

Bu boilerplate kapsamında backend ve data platform için aşağıdaki karar kabul edilmiştir:

- **Canonical backend & data platform:** Firebase (BaaS). Bu boilerplate'ten türetilen tüm projeler için zorunlu canonical platformdur.
- **Database:** Cloud Firestore (NoSQL document store). Koleksiyon-merkezli modelleme.
- **Server logic:** Cloud Functions for Firebase canonical server-side execution katmanıdır.
- **Read/Write contract:** Tüm yazma (`create` / `update` / `delete`) ve iş mantığı callable / HTTPS Cloud Functions üzerinden yürütülür. Client doğrudan Firestore'a **yazmaz**. Okuma client SDK ile doğrudan Firestore'dan yapılır (Security Rules korumalı) ve realtime ihtiyacında `onSnapshot` kullanılır.
- **Scheduled jobs:** Cloud Scheduler + scheduled Cloud Functions.
- **Async queue:** Cloud Tasks.
- **Object storage:** Cloud Storage for Firebase.
- **Push delivery:** FCM (Firebase Cloud Messaging) — ADR-013 ile hizalı; `expo-notifications` + FCM korunur.
- **Authorization:** Firestore Security Rules + Cloud Functions `context.auth` (auth platform kararı ADR-021'dedir).
- **SDK stratejisi:** Web = `firebase` JS SDK (modular, v11.x); Mobile = `@react-native-firebase` (native modüller); `packages/core` = SDK-free port/adapter arayüzleri.
- **Harici job queue yasağı:** Inngest, BullMQ ve benzeri harici job queue / workflow servisleri reddedilmiştir; karşılığı Cloud Scheduler + Cloud Tasks'tır.

Bu ADR'nin ana hükmü şudur:

> Bu boilerplate'in backend ve data platformu Firebase'dir ve bu seçim türetilen tüm projeler için zorunlu canonical'dır. Database Cloud Firestore, server logic Cloud Functions'tır. Canonical contract nettir: **yazma ve iş mantığı Cloud Functions üzerinden, okuma client SDK ile doğrudan Firestore'dan.** Client Firestore'a doğrudan yazmaz. Harici backend/job queue/SQL ORM eklemeleri canonical değildir; Firebase yüzeyi dışındaki backend kararları ADR gerektirir.

---

# 2. Problem Tanımı

Bu boilerplate, ürün geliştirmeye kadar geçen süreyi (time-to-product) kısaltmayı hedefler. Ancak backend ve data katmanı, türetilen projelerde en hızlı dağılan ve en pahalı yanlış çözülen alandır. Backend platform kararı net verilmezse şu sorunlar kaçınılmazdır:

- her türetilen proje farklı bir backend seçer (kendi Node servisi, Supabase, Neon, Hono, custom Express) ve boilerplate parity'si anlamını yitirir
- database paradigması (SQL vs NoSQL) proje bazında değişir, shared data access mantığı kurulamaz
- server logic'in nerede çalışacağı (client, edge, container, function) belirsiz kalır
- client doğrudan database'e yazar, iş kuralları ve doğrulama dağılır, güvenlik delinir
- zamanlı işler ve async işler için her projede farklı bir araç (Inngest, BullMQ, cron container) seçilir
- web ve mobile farklı SDK gerçeklikleriyle gelir; cross-platform paylaşılan kod SDK'ya sıkı bağlanır ve `packages/core` kirlenir
- push, storage ve auth ayrı ayrı vendor'lara dağılır, operasyonel yüzey kontrolsüz büyür

Bu nedenle backend kararı yalnızca "hangi server framework?" sorusu değildir. Asıl soru şudur:

> Veri nerede yaşayacak, iş mantığı nerede çalışacak, yazma ve okuma hangi boundary'den geçecek, zamanlı/async işler hangi altyapıyla yürüyecek ve bu platform web ile mobile'da nasıl paylaşılan ama SDK-bağımsız bir mimariyle tüketilecek?

Bu ADR tam olarak bunu kapatır.

---

# 3. Bağlam

Bu boilerplate'in backend/data açısından taşıdığı zorunluluklar şunlardır:

1. Cross-platform ürün yapısı (web + mobile) için ortak data ve auth gerçekliği
2. Türetilen tüm projelerde %100 uyumlu, öngörülebilir backend baseline
3. Minimum operasyonel yük ile production-grade backend (managed BaaS)
4. Realtime veri ihtiyacının first-class desteklenmesi
5. İş mantığının ve yazma yolunun güvenli, merkezi ve denetlenebilir bir boundary'de toplanması
6. Scheduled ve async job ihtiyaçlarının platform-içi çözülmesi (harici queue eklenmemesi)
7. `packages/core`'un SDK-bağımsız kalması ve cross-platform parity'nin port/adapter seviyesinde sağlanması
8. Auth, storage ve push'un aynı platform ailesinde toplanması
9. Documentation-first ve governance ile denetlenebilir bağımlılık yüzeyi

Bu bağlamda backend kararı şu iki uçtan da kaçınmalıdır:

- her ürünün kendi backend'ini sıfırdan kurması (parity ve hız kaybı)
- backend'i tek bir managed platforma bağlarken cross-platform kodu o platformun SDK'sına sıkıca çivilemek (taşınamaz, test edilemez core)

---

# 4. Karar Kriterleri

Bu karar aşağıdaki kriterlerle değerlendirilmiştir:

1. **Time-to-product**: managed, hazır backend ile hızlı başlangıç
2. **Cross-platform parity**: web ve mobile için aynı data/auth/push gerçekliği
3. **Operasyonel yük**: sunucu/altyapı bakımının minimuma inmesi
4. **Realtime desteği**: canlı veri akışının first-class olması
5. **Güvenlik boundary'si**: yazma ve iş mantığının merkezi, denetlenebilir kontrolü
6. **Scheduled/async job kapsama**: platform-içi cron ve queue
7. **SDK olgunluğu**: hem web hem React Native için production-grade SDK
8. **Storage + push + auth bütünlüğü**: tek platform ailesi
9. **Test edilebilirlik**: port/adapter ile mock'lanabilir core
10. **Vendor lock-in farkındalığı**: kabul edilen, sınırı çizilmiş ve dürüst kayıt altına alınmış bağımlılık

---

# 5. Değerlendirilen Alternatifler

Bu karar öncesi ana alternatifler şunlardır:

1. **Firebase (BaaS)** — Firestore + Cloud Functions + Storage + Scheduler/Tasks + FCM
2. **Supabase** — Postgres + Row Level Security + Edge Functions + Realtime
3. **Custom backend** — Node (Express / Hono / NestJS) + ayrı database
4. **Neon / serverless Postgres** + SQL ORM (Drizzle / Prisma) + ayrı function host
5. **Harici job/workflow servisleri** (Inngest, BullMQ) ile birleştirilmiş hibrit backend

Bu alternatiflerin neden seçilmediği veya seçildiği aşağıda açıklanmıştır.

---

# 6. Seçilen Karar: Firebase Canonical Backend & Data Platform

Bu boilerplate için canonical backend ve data platform **Firebase**'dir. Türetilen tüm projeler bu platformla %100 uyumlu başlar.

Canonical Firebase yüzeyi:

- **Cloud Firestore** — NoSQL document database (koleksiyon-merkezli modelleme)
- **Cloud Functions for Firebase** — server-side logic ve canonical yazma yolu
- **Cloud Storage for Firebase** — object/blob storage
- **Cloud Scheduler + scheduled Cloud Functions** — zamanlı işler (cron)
- **Cloud Tasks** — async / deferred queue
- **Firebase Cloud Messaging (FCM)** — push delivery (ADR-013)
- **Firebase Auth** — kimlik doğrulama (ADR-021)

Bu seçim "kolay olsun diye" değil, **managed, cross-platform parity sağlayan ve operasyonel yükü minimuma indiren** bir backend foundation sağladığı için yapılmıştır. Firebase tek bir platform ailesi içinde database, server logic, storage, scheduled/async jobs, push ve auth'u toplar; web ve mobile için olgun SDK'lar sunar; realtime'ı first-class destekler.

---

# 7. En Kritik İlke: Read/Write Contract (Yazma = Functions, Okuma = Client SDK)

Bu ADR'nin kalbi şu ayrımdır:

> **Yazma ve iş mantığı Cloud Functions üzerinden yürür; okuma client SDK ile doğrudan Firestore'dan yapılır.**

## 7.1. Yazma yolu (canonical)

- Tüm `create` / `update` / `delete` işlemleri callable (`onCall`) veya HTTPS (`onRequest`) Cloud Functions üzerinden yapılır.
- Tüm domain iş mantığı, doğrulama (validation), türetilmiş alan hesaplama, cross-document tutarlılık ve yetki ötesi kontroller Functions katmanında yaşar.
- Client SDK ile doğrudan Firestore'a yazmak (`setDoc` / `addDoc` / `updateDoc` / `deleteDoc` client tarafından çağrılması) **canonical olarak yasaktır**.
- Firestore Security Rules yazma tarafında varsayılan olarak client write'ı reddedecek şekilde tasarlanır; yazma yetkisi service-account context'inde çalışan Functions'a aittir.

## 7.2. Okuma yolu (canonical)

- Okuma, client SDK ile doğrudan Firestore'dan yapılır.
- Tek seferlik okuma (`getDoc` / `getDocs`) ve realtime dinleme (`onSnapshot`) client tarafında meşrudur.
- Okuma erişimi Firestore Security Rules ile korunur (kimlik ve sahiplik bazlı).
- Bu, ADR-005 ile uyumludur: server-owned veri client query/cache katmanında (TanStack Query / realtime listener) yaşar; UI bu lifecycle'ı tüketir.

## 7.3. Neden bu ayrım?

- **Güvenlik:** Yazma kuralları ve iş mantığı tek, denetlenebilir boundary'de toplanır; client'a güvenilmez.
- **Tutarlılık:** Türetilmiş alanlar, sayaçlar ve cross-document invariant'lar yalnızca Functions'ta güvenle korunur.
- **Performans/DX:** Okuma client SDK ile düşük gecikmeli ve realtime kalır; her okuma için Function round-trip'i zorlanmaz.
- **Denetlenebilirlik:** "Bu veriyi kim, hangi kuralla değiştirebilir?" sorusunun tek cevabı vardır: ilgili Cloud Function.

## 7.4. Kısa kural

> Client okur (Security Rules korumalı, gerektiğinde `onSnapshot`); Functions yazar (callable/HTTPS, tüm iş mantığı). Bu sınır boilerplate'in backend güvenlik modelinin temelidir ve gevşetilemez.

---

# 8. Cloud Firestore Data Modeli

## 8.1. Karar

Database Cloud Firestore'dur (NoSQL document store). Veri koleksiyon-merkezli modellenir: koleksiyonlar, dökümanlar ve gerektiğinde alt-koleksiyonlar (subcollection).

## 8.2. Modelleme ilkeleri

- Read pattern'leri modeli yönlendirir; ilişkisel normalizasyon değil, erişim deseni esastır.
- Cross-document tutarlılık gerektiğinde denormalizasyon ve türetilmiş alanlar Cloud Functions tarafından bakımlanır (client tarafından değil).
- Query'ler için gerekli composite index'ler tanımlanır ve `firestore.indexes.json` ile versiyonlanır.
- Security Rules veri modelinin ayrılmaz parçasıdır; sahiplik (ownership) ve scope kuralları model ile birlikte tasarlanır.

## 8.3. Sonuç

SQL/relational modelleme ve SQL ORM (Drizzle, Prisma) bu boilerplate'in canonical data modeli değildir (bkz. Bölüm 15).

---

# 9. Cloud Functions — Server Logic

## 9.1. Karar

Server-side logic için canonical execution katmanı Cloud Functions for Firebase'dir.

## 9.2. Function tipleri

- **Callable (`onCall`)**: client'tan tetiklenen yazma ve iş mantığı; `context.auth` ile kimlik gelir.
- **HTTPS (`onRequest`)**: webhook ve harici entegrasyon yüzeyleri.
- **Firestore trigger'ları (`onDocumentWritten` vb.)**: yazma sonrası türetilmiş efektler, denormalizasyon, fan-out.
- **Scheduled (`onSchedule`)**: zamanlı işler (Bölüm 10).
- **Task queue (`onTaskDispatched`)**: Cloud Tasks ile async işler (Bölüm 10).

## 9.3. Function disiplini

- İş mantığı Function handler'ına gömülmez; doğrulama, yetki ve domain kuralları net katmanlarda yaşar.
- Functions secrets'a doğrudan erişmez; secret yönetimi Firebase/GCP secret mekanizmaları ile yapılır.
- Function'lar idempotent tasarlanmalıdır (özellikle task ve trigger handler'ları), çünkü retry mümkündür.

---

# 10. Scheduled Jobs ve Async Queue

## 10.1. Zamanlı işler (cron)

Canonical: **Cloud Scheduler + scheduled Cloud Functions** (`onSchedule`).

## 10.2. Async / deferred işler

Canonical: **Cloud Tasks** (`onTaskDispatched`).

## 10.3. Harici job queue yasağı

Türetilen projeler zamanlı veya async iş ihtiyacında **Inngest, BullMQ veya benzeri harici job queue / workflow servisi ekleyemez**. Bu ihtiyaçların Firebase karşılığı Cloud Scheduler ve Cloud Tasks'tır.

Gerekçe:

- harici job queue ayrı bir runtime, ayrı bir vendor ve ayrı bir operasyonel yüzey ekler
- Firebase ekosistemi cron (Scheduler) ve async queue (Tasks) ihtiyaçlarını platform-içi karşılar
- iş mantığı zaten Cloud Functions'ta olduğundan, tetikleyici de aynı platformda kalmalıdır

> Inngest / BullMQ gibi harici job queue'lar bu boilerplate'te **yasaktır**; yerine Cloud Scheduler (cron) ve Cloud Tasks (async queue) kullanılır.

---

# 11. Cloud Storage

Object/blob storage için canonical karar **Cloud Storage for Firebase**'dir.

- Storage erişimi Storage Security Rules ile korunur (kimlik ve sahiplik bazlı).
- Hassas yükleme/indirme akışları gerektiğinde imzalı URL veya Function aracılı erişimle yönetilir.
- Storage, Firebase Auth kimliği ile (ADR-021) entegre çalışır.

---

# 12. FCM / Push ve ADR-013 ile İlişki

Push delivery için FCM zaten ADR-013'te canonical kabul edilmiştir. Bu ADR onu Firebase platform ailesinin parçası olarak teyit eder:

- `expo-notifications` canonical client SDK olarak korunur (ADR-013)
- delivery altyapısı FCM (+ APNs) üzerinden yürür
- bu ADR, FCM'i ayrı bir vendor değil, canonical Firebase yüzeyinin doğal bileşeni olarak kayıt altına alır

ADR-013'ün push kararları değişmez; bu ADR yalnızca platform bütünlüğünü netleştirir.

---

# 13. SDK Stratejisi

Firebase tek platform olsa da web ve mobile farklı SDK gerçekliklerine sahiptir. Canonical SDK stratejisi şudur:

## 13.1. Web

- **`firebase` JS SDK (modular API, v11.x)**
- Tree-shakeable modular import'lar kullanılır (`firebase/app`, `firebase/firestore`, `firebase/auth`, `firebase/functions`, `firebase/storage`).

## 13.2. Mobile

- **`@react-native-firebase`** (native modüller)
- Native modül gerektirir; bu, ADR-002 üzerinde doğrudan sonuç doğurur (Bölüm 16).

## 13.3. `packages/core`

- **SDK-free.** `packages/core` hiçbir Firebase SDK'sını import etmez.
- Core yalnızca port/adapter arayüzlerini ve SDK-bağımsız domain tiplerini tanımlar.

---

# 14. Port/Adapter Mimarisi ve `packages/core` SDK-Free Boundary

## 14.1. Karar

Cross-platform parity, SDK seviyesinde değil **port/adapter seviyesinde** sağlanır. `packages/core` Firebase'e değil, kendi tanımladığı port arayüzlerine bağımlıdır.

## 14.2. Canonical port arayüzleri (core'da tanımlı, SDK-free)

- **`AuthPort`** — kimlik/oturum yüzeyi (detay ADR-021'de)
- **`DataReadPort`** — Firestore okuma ve realtime dinleme soyutlaması (`getDoc`/`getDocs`/`onSnapshot` karşılıkları)
- **`FunctionsCallPort`** — callable Cloud Functions çağrı soyutlaması (yazma ve iş mantığı yolu)

## 14.3. Adapter sorumluluğu

- Her app (web/mobile) bu port'ları kendi SDK'sıyla implemente eder:
  - `apps/web` → `firebase` JS SDK ile adapter
  - `apps/mobile` → `@react-native-firebase` ile adapter
- Adapter'lar app sınırında yaşar; SDK import'ları yalnızca adapter katmanında bulunur.

## 14.4. Neden?

- `packages/core`'da Firebase SDK yasağı korunur (`21-repo-structure-spec.md` ile uyumlu).
- Core test edilebilir kalır (port'lar mock'lanır).
- Vendor değişimi teorik olarak adapter sınırında izole edilir; core'a yayılmaz.

> `packages/core` SDK import etmez. Web `firebase` JS SDK ile, mobile `@react-native-firebase` ile kendi adapter'ını yazar; ortak sözleşme `AuthPort` / `DataReadPort` / `FunctionsCallPort` port arayüzleridir.

---

# 15. Reddedilen Yönler

## 15.1. Inngest / BullMQ ve harici job queue'lar

Reddedildi. Ayrı runtime ve vendor yükü getirir; Firebase karşılığı Cloud Scheduler + Cloud Tasks platform-içi çözümdür (Bölüm 10).

## 15.2. SQL ORM (Drizzle / Prisma) ve relational model

Reddedildi. Canonical database Cloud Firestore'dur (NoSQL). SQL ORM'ler farklı bir database paradigması, ayrı bir database host'u ve farklı bir data access modeli gerektirir; cross-platform Firebase parity'sini ve realtime modelini bozar.

## 15.3. Hono / custom Node backend

Reddedildi. Server logic için canonical katman Cloud Functions'tır. Ayrı bir HTTP framework (Hono, Express, NestJS) kendi hosting, deploy ve operasyon yüzeyini getirir ve managed BaaS avantajını ortadan kaldırır. Webhook/HTTPS ihtiyaçları `onRequest` Functions ile karşılanır.

## 15.4. Supabase

Reddedildi. Güçlü bir platform olabilir; ancak Postgres/RLS tabanlı modeli, bu boilerplate'in Firestore + Cloud Functions + FCM + Firebase Auth bütünlüğüyle ve `@react-native-firebase` native entegrasyonuyla aynı parity'yi sağlamaz. İki BaaS'ı aynı anda canonical tutmak boilerplate hedefiyle çelişir.

## 15.5. Neon / serverless Postgres

Reddedildi. Database paradigması (relational) ve ayrı function/host topolojisi canonical Firebase yüzeyiyle uyumsuzdur.

## 15.6. Client-direct write modeli

Reddedildi. Client'ın doğrudan Firestore'a yazması iş mantığını ve yetki kontrolünü dağıtır ve güvenlik boundary'sini siler. Yazma yalnızca Cloud Functions üzerinden yapılır (Bölüm 7).

---

# 16. ADR-002 Üzerindeki Sonuç: Development Build Zorunluluğu

`@react-native-firebase` native modüller içerir. Bu, ADR-002'nin "development-build-first" kuralını **zorunluluğa** dönüştürür:

- Mobile tarafta Firebase native modülleri nedeniyle **Expo development build zorunludur**.
- **Expo Go artık desteklenmez**; native Firebase modülleri Expo Go içinde çalışmaz.
- Bu sonuç ADR-002'ye amendment notu olarak eklenmiştir (2026-06-26, ADR-020).

Bu, ADR-002'nin Expo-first + native escape hatch policy'siyle çelişmez; aksine, Firebase native modülleri "policy-controlled native expansion"ın somut ve onaylanmış bir örneğidir.

---

# 17. Riskler

## 17.1. Vendor lock-in

Firebase'e bağlanmak gerçek bir lock-in riskidir. Bu risk bilinçli kabul edilmiştir; port/adapter mimarisi (Bölüm 14) bu riski adapter sınırında izole eder ama tamamen ortadan kaldırmaz.

## 17.2. Firestore modelleme hatası

NoSQL modelleme yanlış erişim deseniyle kurulursa pahalı query ve denormalizasyon borcu oluşur. Modelleme read pattern'leriyle tasarlanmalıdır.

## 17.3. Read/write contract ihlali

Geliştiriciler kolaylık için client-direct write'a kayabilir. Security Rules varsayılan-reddet ile bu riski yapısal olarak engellemelidir; ek olarak audit konusudur.

## 17.4. Cloud Functions cold start / maliyet

Yazma yolu Functions'tan geçtiği için cold start ve maliyet gözlemlenmelidir; sık çağrılan path'ler için min-instance ve idempotency değerlendirilir.

## 17.5. Native build kırılganlığı

`@react-native-firebase` + development build, Expo Go'ya kıyasla daha ağır bir build gerçekliği getirir (ADR-002 / ADR-018 New Architecture uyumu ile birlikte değerlendirilir).

---

# 18. Risk Azaltma Önlemleri

1. Port/adapter sınırı ve `packages/core` SDK-free kuralı audit edilmeli
2. Firestore Security Rules varsayılan-reddet write ile başlamalı; rules test edilmeli (emulator)
3. Read/write contract DoD ve audit checklist maddesi olmalı
4. Firestore index'leri ve rules versiyonlanmalı (`firestore.indexes.json`, `firestore.rules`)
5. Cloud Functions idempotency ve secret yönetimi standardı yazılmalı
6. Firebase Emulator Suite local geliştirme ve test için baseline olmalı
7. Dependency policy (37) ve compatibility matrix (38) Firebase SDK sürümleriyle güncellenmeli

---

# 19. Non-Goals

Bu ADR aşağıdakileri çözmez:

- exact Firestore collection şeması ve domain veri modeli (ürün bağlamı)
- authentication platform detayları (ADR-021'de kapatılmıştır)
- exact Cloud Functions region, memory ve scaling konfigürasyonu
- CI/CD ve deploy pipeline detayları
- billing/quota ve cost optimizasyon stratejisinin tamamı
- analytics vendor kararı (observability ADR'leri kapsamında)

---

# 20. Uygulanma Sonuçları

Bu ADR kabul edildiğinde aşağıdaki sonuçlar doğar:

1. Firebase türetilen tüm projeler için zorunlu canonical backend & data platform olur
2. Database Cloud Firestore, server logic Cloud Functions olur
3. Yazma ve iş mantığı Cloud Functions'tan geçer; client doğrudan Firestore'a yazmaz
4. Okuma client SDK ile doğrudan Firestore'dan yapılır; realtime `onSnapshot` ile
5. Zamanlı işler Cloud Scheduler, async işler Cloud Tasks ile yürür; Inngest/BullMQ yasaktır
6. Storage Cloud Storage for Firebase, push FCM olur
7. Web `firebase` JS SDK, mobile `@react-native-firebase` kullanır; `packages/core` SDK-free kalır
8. Mobile tarafta Expo development build zorunlu olur; Expo Go desteklenmez (ADR-002)

---

# 21. Bağlı Belgeler ve Sonraki Adımlar

Bu ADR, backend/data dönüşümünün kaynak kararıdır. Aşağıdaki belgeler bu ADR ile hizalanacak şekilde ayrı görevlerde güncellenecektir:

- `36-canonical-stack-decision.md`: Backend/Data platform satırı (Firebase, Firestore, Cloud Functions, Scheduler/Tasks, Storage) eklenmeli; kısa hüküm güncellenmeli
- `37-dependency-policy.md`: `firebase`, `@react-native-firebase` policy'si; Inngest/BullMQ/SQL ORM/harici backend yasak listesi
- `38-version-compatibility-matrix.md`: Firebase JS SDK v11.x, `@react-native-firebase` sürüm uyumu
- `45-boilerplate-project-boundary-contract.md`: backend boundary ve client-direct-write yasağı
- `21-repo-structure-spec.md`: `packages/core` SDK-free port'ları, app-level adapter ve `functions/` topolojisi
- `ADR-005`: Firestore okuma + realtime listener ile data fetching ilişkisinin netleştirilmesi (amendment adayı)

> Not: Bu ADR yalnızca kararı kilitler. Yukarıdaki belgelerin ve kod iskeletinin güncellenmesi sonraki görevlerin kapsamındadır.

---

# 22. Migration Impact

- **Mevcut Kod Etkisi:** Yüksek
- **Breaking Change:** Evet (backend/data katmanı boilerplate seviyesinde tanımlanır)
- **Migration Adımları:**
  1. `packages/core` içinde `AuthPort` / `DataReadPort` / `FunctionsCallPort` port arayüzlerinin tanımlanması
  2. `apps/web` (firebase JS SDK) ve `apps/mobile` (`@react-native-firebase`) adapter implementasyonları
  3. `functions/` workspace'inin (Cloud Functions) eklenmesi; callable yazma yolunun kurulması
  4. `firestore.rules` (varsayılan-reddet write) ve `firestore.indexes.json` baseline'ı
  5. Cloud Scheduler/Tasks iskeletinin eklenmesi; varsa harici queue kullanımının kaldırılması
  6. Mobile tarafta development build'e geçiş; Expo Go varsayımlarının kaldırılması (ADR-002)
  7. `36/37/38/45/21` belge güncellemeleri
- **Rollback Planı:**
  - Adapter ve `functions/` workspace'i revert edilir; port arayüzleri korunabilir
  - Firebase bağımlılıkları `package.json`'dan çıkarılır
  - ADR-020 `Superseded` işaretlenir ve yeni bir backend ADR'si açılır

---

# 23. Yeniden Değerlendirme (Revalidation)

- **Revalidation Tarihi:** Koşullu
- **Tetikleyici Koşul:** Firebase pricing/quota modeli proje ölçeğinde sürdürülemez hale gelirse; Firestore data modeli sistematik olarak ürün ihtiyaçlarını karşılamazsa; `@react-native-firebase` New Architecture (ADR-018) uyumu kalıcı olarak bozulursa
- **Değerlendirme Sorumlusu:** Architecture Owner
- **Değerlendirme Kapsamı:** Firebase ekosistem sağlığı, SDK uyumu (compatibility matrix 38), maliyet/ölçek friction'ı, port/adapter izolasyonunun gerçek taşınabilirlik sağlayıp sağlamadığı
- **Sonuç Seçenekleri:** Karar geçerli / Addendum gerekiyor / Yeniden değerlendirilmeli (yeni ADR) / Superseded

---

# 24. Kararın Kısa Hükmü

> Backend ve data platform için canonical karar: Firebase (zorunlu, türetilen tüm projeler için). Database Cloud Firestore, server logic Cloud Functions, storage Cloud Storage, cron Cloud Scheduler, async queue Cloud Tasks, push FCM. Canonical contract: yazma ve iş mantığı Cloud Functions üzerinden; okuma client SDK ile doğrudan Firestore'dan (`onSnapshot` realtime). Client doğrudan Firestore'a yazmaz. Web `firebase` JS SDK, mobile `@react-native-firebase`; `packages/core` SDK-free port/adapter ile parity sağlar. Inngest/BullMQ/SQL ORM/Hono/Supabase/Neon canonical değildir.

---

# 25. Onay Kriterleri

Bu ADR yeterli kabul edilir eğer:

1. Firebase'in zorunlu canonical backend & data platform olduğu açıkça yazılmışsa
2. Database (Firestore), server logic (Cloud Functions), storage, scheduled/async job ve push kararları net tanımlanmışsa
3. Read/write contract (yazma=Functions, okuma=client SDK) net bir sözleşme olarak yazılmışsa
4. SDK stratejisi (web JS / mobile RN-firebase / core port-adapter) görünür kılınmışsa
5. `packages/core` SDK-free boundary ve port arayüzleri tanımlanmışsa
6. Reddedilen yönler (Inngest, BullMQ, SQL ORM, Hono, Supabase, Neon, client-direct-write) gerekçeleriyle yazılmışsa
7. ADR-002 üzerindeki development build sonucu belirtilmişse
8. Migration impact ve bağlı belgeler listelenmişse
9. Bu karar implementasyon öncesi kilitlenmiş backend/data baseline olarak kullanılabilecek netlikteyse
