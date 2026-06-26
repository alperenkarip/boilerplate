# ADR-021 — Authentication Platform

## Doküman Kimliği

- **ADR ID:** ADR-021
- **Başlık:** Authentication Platform
- **Durum:** Accepted
- **Tarih:** 2026-06-26
- **Supersedes:** ADR-010 (Auth, Session and Secure Storage Baseline)
- **Karar türü:** Foundational authentication, identity, authorization boundary ve session lifecycle decision
- **Karar alanı:** Authentication platform seçimi, identity provider, token modeli, authorization mekanizması, auth lifecycle, token persistence, web/mobile auth gerçeklikleri, logout/expiry/user-switch cleanup
- **İlgili üst belgeler:**
  - `ADR-020-backend-and-data-platform.md`
  - `36-canonical-stack-decision.md`
  - `27-security-and-secrets-baseline.md`
  - `ADR-002-mobile-runtime-and-native-strategy.md`
  - `ADR-005-data-fetching-cache-and-mutation-model.md`
  - `ADR-010-auth-session-and-secure-storage-baseline.md` (superseded)
  - `ADR-013-push-notification-strategy.md`
- **Etkilediği belgeler:**
  - `ADR-010-auth-session-and-secure-storage-baseline.md` (Superseded)
  - `36-canonical-stack-decision.md`
  - `37-dependency-policy.md`
  - `38-version-compatibility-matrix.md`
  - `45-boilerplate-project-boundary-contract.md`
  - `21-repo-structure-spec.md`
  - `20-initial-implementation-checklist.md`
  - `30-contribution-guide.md`
  - `31-audit-checklist.md`
  - `32-definition-of-done.md`

---

# 1. Karar Özeti

Bu boilerplate kapsamında authentication için aşağıdaki karar kabul edilmiştir ve bu ADR **ADR-010'u supersede eder**:

- **Canonical auth platform:** Saf Firebase Auth.
- **Giriş yolu:** Client SDK ile authentication (web `firebase/auth`, mobile `@react-native-firebase/auth`).
- **Token modeli:** Firebase ID token. Kendi backend session/cookie modeli **yoktur**.
- **Authorization:** Firestore Security Rules + Cloud Functions `context.auth`. Yetki, ID token'ın taşıdığı kimlik üzerinden platform katmanında değerlendirilir.
- **Auth lifecycle:** `onAuthStateChanged` ile yönetilir; auth state machine semantiği korunur.
- **Token persistence (mobile):** `@react-native-firebase/auth` otomatik persistence; ek olarak hassas uygulama verisi için `expo-secure-store`.
- **Token persistence (web):** Firebase Auth persistence (kalıcılık seviyesi seçilebilir).
- **Auth boundary:** UI yalnızca sanitized auth/session summary tüketir; raw token UI'ya/state'e/log'a sızmaz.
- **Cleanup:** Logout, session expiry ve user switch deterministic cleanup gerektirir; mevcut `LogoutCleanupContract` korunur.

Bu ADR'nin ana hükmü şudur:

> Authentication için canonical karar saf Firebase Auth'tur. Kullanıcı client SDK ile giriş yapar, kimlik Firebase ID token ile taşınır, yetkilendirme Firestore Security Rules ve Cloud Functions `context.auth` ile yapılır. ADR-010'un backend-managed HttpOnly cookie modeli ve client-managed token fallback'i terk edilmiştir. Auth artefact'ları (ID token dâhil) generic app state değildir; UI yalnızca sanitized session summary görür ve logout/expiry/user-switch deterministic cleanup gerektirir.

---

# 2. Problem Tanımı ve ADR-010'dan Neden Ayrıldık

ADR-010, backend-agnostic bir auth boundary tanımlamış ve web için **backend-managed secure HttpOnly cookie session**'ı canonical tercih, client-managed token'ı ise fallback olarak konumlandırmıştı. Bu model, kendi backend'ini yöneten bir kurulum varsayar.

ADR-020 ile backend ve data platformu Firebase olarak kilitlendi. Firebase ekosisteminde:

- kimlik doğrulama Firebase Auth ile client SDK üzerinden yapılır
- yetkilendirme Firestore Security Rules ve Cloud Functions `context.auth` ile ID token üzerinden değerlendirilir
- ayrı bir backend session/cookie katmanı yoktur ve gerekli değildir

Dolayısıyla ADR-010'un "backend-managed HttpOnly cookie" varsayımı bu platform kararıyla artık tutarsızdır. Cookie tabanlı session'ı zorlamak, Firebase Auth'un doğal ID token modelinin üzerine gereksiz ve yapay bir katman koyardı.

> ADR-010 tarihsel referans olarak korunur; ancak backend-managed cookie / client-managed token fallback kararları Firebase Auth lehine geçersizdir. Bu ADR onun yerine geçer.

ADR-010'un platform-bağımsız ve hâlâ geçerli olan güvenlik ilkeleri (auth artefact ≠ UI summary, deterministic cleanup, observability privacy vb.) bu ADR'de **korunur** (Bölüm 13).

---

# 3. Bağlam

Bu ADR aşağıdaki bağlamda verilmiştir:

1. ADR-020 ile backend/data platform Firebase olarak kilitlenmiştir
2. Cross-platform (web + mobile) ürün ortak bir kimlik gerçekliği gerektirir
3. Authorization, yazma yolundaki Cloud Functions (`context.auth`) ve okuma yolundaki Firestore Security Rules ile aynı kimliğe dayanmalıdır
4. Mobile tarafta `@react-native-firebase` native modülleri kullanılır (ADR-020 / ADR-002)
5. Auth, security-first state ownership ile ele alınmalı; wrong-user leak kabul edilmemelidir
6. Mevcut auth boundary ve `LogoutCleanupContract` korunmalı, yeni platforma uyarlanmalıdır

---

# 4. Karar Kriterleri

1. **Platform tutarlılığı:** ADR-020 Firebase kararı ile birebir uyum
2. **Authorization bütünlüğü:** okuma (Security Rules) ve yazma (Functions `context.auth`) aynı kimliğe dayanmalı
3. **Cross-platform parity:** web ve mobile için ortak auth lifecycle semantiği
4. **Operasyonel basitlik:** ayrı session/cookie altyapısı kurma yükünün olmaması
5. **Güvenlik:** token görünürlüğünün kontrolü, deterministic cleanup, wrong-user leak önleme
6. **Genişleyebilirlik:** social login, biometric, passkey gibi katmanların doğal eklenebilmesi
7. **Test edilebilirlik:** auth boundary'nin port/adapter ile mock'lanabilmesi

---

# 5. Değerlendirilen Alternatifler

1. **Saf Firebase Auth (client SDK + ID token)** — seçilen
2. **Firebase Auth + kendi backend session/cookie katmanı** (ID token'ı cookie'ye çevirmek)
3. **ADR-010 modelinin korunması** (backend-managed HttpOnly cookie, backend-agnostic)
4. **Üçüncü taraf auth (Auth0 / Clerk)** Firebase backend üzerinde

---

# 6. Seçilen Karar: Saf Firebase Auth

Canonical auth platform **saf Firebase Auth**'tur.

## 6.1. Giriş (authentication)

- Kullanıcı client SDK ile giriş yapar:
  - Web: `firebase/auth`
  - Mobile: `@react-native-firebase/auth`
- Email/password, social provider (Apple, Google vb.) ve diğer Firebase Auth yöntemleri bu platform üzerinden yürür.
- Apple Sign In zorunluluğu (iOS'ta üçüncü taraf login sunuluyorsa) korunur — Firebase Auth provider'ı olarak yapılandırılır.

## 6.2. Kimlik taşıma (ID token)

- Kimlik **Firebase ID token** ile taşınır.
- Kendi backend session veya cookie modeli **yoktur**; ID token Firebase SDK tarafından yönetilir ve yenilenir (refresh).
- Client kendi refresh logic'ini elle kurmaz; token lifecycle Firebase SDK sorumluluğundadır.

## 6.3. Neden saf Firebase Auth?

- ADR-020 backend kararıyla birebir uyumludur
- yetkilendirme zaten Firestore Security Rules ve Cloud Functions `context.auth` üzerinden ID token'a dayanır
- ayrı session/cookie altyapısı kurma yükü ortadan kalkar
- web ve mobile ortak auth lifecycle semantiğini paylaşır

---

# 7. Authorization: Security Rules + `context.auth`

## 7.1. Okuma yetkisi

- Client doğrudan Firestore'dan okur (ADR-020 Bölüm 7).
- Okuma yetkisi **Firestore Security Rules** ile, `request.auth` (Firebase Auth kimliği) üzerinden değerlendirilir.

## 7.2. Yazma yetkisi

- Yazma ve iş mantığı Cloud Functions üzerinden yürür (ADR-020 Bölüm 7).
- Function içinde kimlik **`context.auth`** ile gelir; yetki, sahiplik ve domain kuralları burada uygulanır.

## 7.3. Kural

> Authorization ayrı bir backend session'a değil, Firebase ID token'ın taşıdığı kimliğe dayanır. Okuma tarafında Security Rules, yazma tarafında Cloud Functions `context.auth` aynı kimliği değerlendirir. Bu, ADR-020 read/write contract'ı ile aynı kimlik temelini paylaşır.

---

# 8. ADR-010'dan Farklar

| Konu            | ADR-010 (superseded)                              | ADR-021 (bu karar)                                        |
| --------------- | ------------------------------------------------- | --------------------------------------------------------- |
| Web session     | Backend-managed HttpOnly + Secure cookie (tercih) | Firebase ID token (Firebase Auth persistence)             |
| Web fallback    | Constrained client-managed token                  | Yok — Firebase Auth token standart                        |
| Authorization   | Backend session / API                             | Firestore Security Rules + Cloud Functions `context.auth` |
| Backend bağı    | Backend-agnostic                                  | Firebase (ADR-020)                                        |
| Token lifecycle | Backend + frontend adapter                        | Firebase SDK (otomatik refresh)                           |

Değişmeyen taraf: auth artefact ile UI summary ayrımı, deterministic cleanup, secure storage disiplini ve observability privacy (Bölüm 13).

## 8.1. Gerekçe

Backend-managed cookie modeli, kendi backend'ini yöneten bir kurulumda XSS yüzeyini azaltmak için tercih edilmişti. Firebase Auth'ta backend Firebase'in kendisidir; ID token client SDK tarafından yönetilir ve yetki platform katmanında (Rules + `context.auth`) değerlendirilir. Bu nedenle cookie katmanı hem gereksiz hem de platformla tutarsızdır.

---

# 9. Auth Lifecycle ve State Machine

## 9.1. `onAuthStateChanged`

- Auth durumu Firebase'in `onAuthStateChanged` (web) / `@react-native-firebase/auth` karşılığı listener'ı ile yönetilir.
- App/web başlangıcında auth durumu bu listener üzerinden belirlenir (session restore'un Firebase karşılığı).

## 9.2. Auth state machine korunur

ADR-010'un auth state machine düşüncesi korunur. UI ve navigation gate'leri ham "token var/yok" değil, semantik durumları tüketir:

- unknown / bootstrapping (listener ilk sinyali vermeden)
- authenticated
- unauthenticated
- refreshing (token yenileniyor)
- session-expired / reauth-required
- auth-error
- signing-out

Core'daki `AuthStatus` ve `AuthSummary` tipleri bu semantiği taşır.

---

# 10. Token Persistence

## 10.1. Mobile

- **`@react-native-firebase/auth` otomatik persistence**: oturum cihazda Firebase SDK tarafından kalıcı tutulur; manuel token saklama gerekmez.
- **`expo-secure-store`**: Firebase oturumunun dışında kalan, uygulamaya özel hassas veriler (ör. biometric-gated app secret, hassas tercih) için secure storage adapter olarak kullanılır.
- Ham Firebase token'ları generic/non-secure storage'a (AsyncStorage, MMKV) elle yazılmaz.

## 10.2. Web

- **Firebase Auth persistence** kullanılır; kalıcılık seviyesi (`local` / `session` / `none` karşılığı) ürün gereksinimine göre seçilir.
- Token elle `localStorage`'a kopyalanmaz; persistence Firebase SDK'nın sorumluluğundadır.

## 10.3. Kural

> Token persistence Firebase SDK'nın sorumluluğundadır. Mobile'da `@react-native-firebase` otomatik persistence + hassas veride `expo-secure-store`; web'de Firebase Auth persistence. Ham token elle convenience storage'a yazılmaz.

---

# 11. Auth Boundary ve Port/Adapter

## 11.1. Karar

ADR-010'un auth boundary ilkesi korunur ve ADR-020 port/adapter mimarisine bağlanır:

- `packages/core` **`AuthPort`** arayüzünü tanımlar (SDK-free).
- Her app `AuthPort`'u kendi Firebase SDK'sıyla implemente eder:
  - `apps/web` → `firebase/auth` adapter
  - `apps/mobile` → `@react-native-firebase/auth` adapter

## 11.2. Boundary ne üretir?

- sanitized `AuthSummary` (status + current user summary + capability summary)
- login / logout / re-auth semantics
- auth error classification (taxonomy korunur)

## 11.3. Boundary ne yapmaz?

- raw ID token'ı UI'ya/generic store'a/log'a sızdırmaz
- Firebase SDK detayını ekran/komponent seviyesine yaymaz

> UI Firebase SDK'yı doğrudan değil, `AuthPort` üzerinden tüketir. Firebase provider detayı UI'ya vendor kokusu olarak sızmaz.

---

# 12. Logout, Session Expiry ve User Switch Cleanup

## 12.1. Mevcut `LogoutCleanupContract` korunur

ADR-010'un deterministic cleanup disiplini ve `packages/core`'daki `LogoutCleanupContract` korunur ve Firebase'e uyarlanır:

- `firebaseAuth.signOut()` çağrısı + in-memory auth context temizliği
- query cache ve user-scoped client state temizliği
- realtime listener'ların (`onSnapshot` abonelikleri) sökülmesi
- drafts / workspace context / persisted user-scoped state'in değerlendirilmesi
- analytics / observability user binding'inin resetlenmesi

## 12.2. Session expiry

- Firebase token expiry ve revoke durumları (ör. `id-token-expired`, `id-token-revoked`) `onAuthStateChanged` ve Function/Rules reddi üzerinden sınıflandırılır.
- Expiry, manual logout ile aynı UX'e kör indirgenmez (ADR-010 ilkesi korunur).

## 12.3. User switch

- Yeni kullanıcı girişinde önceki kullanıcının user-scoped cache'i, realtime listener'ları ve persisted state'i deterministic biçimde temizlenir.
- Wrong-user leak audit ve DoD konusudur.

---

# 13. ADR-010'dan Korunan İlkeler

Aşağıdaki ADR-010 ilkeleri platform-bağımsızdır ve bu ADR'de **aynen geçerlidir**:

1. Auth artefact ≠ UI-facing session summary (raw token boundary içinde kalır)
2. UI yalnızca sanitized auth/session summary tüketir
3. Deterministic cleanup (logout / expiry / user switch / workspace switch)
4. Observability/analytics/log yüzeylerine sensitive auth data sızmaz
5. Auth error taxonomy (tek generic hata metnine indirgeme yasağı)
6. Auth ve query cache ilişkisi (auth değişiminde user-bound cache temizliği)
7. Mobile secure storage adapter disiplini (`expo-secure-store`)
8. **Biometric authentication** (`expo-local-authentication`) ADR-010 §44 kararı korunur; biometric, Firebase oturumunun yerine geçmez, yalnızca yerel unlock katmanıdır
9. **Social login** (Apple/Google) korunur; Firebase Auth provider'ları olarak yapılandırılır (token mapping artık Firebase Auth'a aittir, ayrı backend'e değil)
10. **Passkeys** watchlist pozisyonu korunur; Firebase Auth passkey desteği olgunlaştığında değerlendirilir

---

# 14. Reddedilen Yönler

## 14.1. Firebase Auth + kendi backend session/cookie katmanı

Reddedildi. ID token'ı tekrar cookie/session'a çevirmek gereksiz bir katman ekler ve ADR-020 platform kararıyla tutarsızdır.

## 14.2. ADR-010 backend-managed cookie modelinin korunması

Reddedildi. Firebase backend kararı (ADR-020) ile tutarsızdır; bu nedenle ADR-010 supersede edilmiştir.

## 14.3. Üçüncü taraf auth (Auth0 / Clerk)

Reddedildi. Firebase backend ailesi içinde Firebase Auth, Firestore Security Rules ve Cloud Functions `context.auth` ile native bütünlük sağlar; ayrı bir identity vendor bu bütünlüğü ve parity'yi bozar.

---

# 15. Riskler

## 15.1. Firebase Auth lock-in

Auth da Firebase'e bağlanır. `AuthPort` soyutlaması bu riski adapter sınırında izole eder ama ortadan kaldırmaz (ADR-020 lock-in riski ile aynı doğada).

## 15.2. ID token görünürlüğü

ID token client SDK'da yaşar. Boundary disiplini (Bölüm 11) ve observability privacy (Bölüm 13) ile ham token'ın sızması engellenmelidir.

## 15.3. Security Rules / `context.auth` yanlış yazımı

Yetki Rules ve Functions'a kaydığı için, yanlış yazılmış bir rule veya eksik `context.auth` kontrolü doğrudan güvenlik açığıdır. Rules ve Functions emulator ile test edilmelidir.

## 15.4. Realtime listener cleanup eksikliği

Logout/user switch sonrası sökülmeyen `onSnapshot` abonelikleri wrong-user leak ve memory leak üretir. Cleanup contract'a bağlanmalıdır.

---

# 16. Risk Azaltma Önlemleri

1. `AuthPort` contract ve adapter'lar audit edilmeli; UI'nın Firebase SDK'yı doğrudan çağırması yasaklanmalı
2. Firestore/Storage Security Rules ve Cloud Functions `context.auth` kontrolleri emulator ile test edilmeli
3. `LogoutCleanupContract` realtime listener sökme ve cache temizliğini kapsayacak şekilde güncellenmeli
4. Observability denylist'i ID token ve sensitive claim'leri kapsamalı
5. Auth state machine ve error taxonomy test edilebilir olmalı
6. Wrong-user leak senaryoları DoD/audit checklist'e bağlanmalı

---

# 17. Non-Goals

Bu ADR aşağıdakileri çözmez:

- exact Firebase Auth provider konfigürasyonu (hangi social provider'lar aktif)
- MFA tam stratejisi
- passkey/WebAuthn tam implementasyonu (watchlist korunur)
- custom claims tabanlı detaylı RBAC tasarımı (ürün bağlamı)
- exact Security Rules şeması (data modeli ile birlikte ürün bağlamında)
- biometric tam policy (ADR-010 §44 referansı korunur)

---

# 18. Uygulanma Sonuçları

Bu ADR kabul edildiğinde aşağıdaki sonuçlar doğar:

1. Auth platform saf Firebase Auth olur; ADR-010 supersede edilir
2. Giriş client SDK ile, kimlik Firebase ID token ile taşınır
3. Backend session/cookie modeli kaldırılır
4. Authorization Firestore Security Rules + Cloud Functions `context.auth` ile yapılır
5. Auth lifecycle `onAuthStateChanged` ile yönetilir; auth state machine korunur
6. Token persistence Firebase SDK'ya bırakılır (mobile otomatik + secure-store, web Firebase persistence)
7. `AuthPort` boundary ve deterministic cleanup (`LogoutCleanupContract`) korunur
8. Biometric, social login ve passkey ilkeleri Firebase Auth üzerine uyarlanır

---

# 19. Migration Impact

- **Mevcut Kod Etkisi:** Orta-Yüksek
- **Breaking Change:** Evet (auth modeli cookie/backend-agnostic'ten Firebase Auth'a geçer)
- **Migration Adımları:**
  1. `packages/core` `AuthPort` arayüzünün Firebase ID token modeline göre tanımlanması (SDK-free)
  2. `apps/web` (`firebase/auth`) ve `apps/mobile` (`@react-native-firebase/auth`) auth adapter'ları
  3. `onAuthStateChanged` tabanlı auth lifecycle ve `AuthSummary` üretimi
  4. Firestore/Storage Security Rules ve Cloud Functions `context.auth` yetki kontrolleri
  5. `LogoutCleanupContract`'ın realtime listener sökme + cache temizliği ile güncellenmesi
  6. Token persistence wiring (mobile otomatik + `expo-secure-store`, web Firebase persistence)
  7. `ADR-010` Status → Superseded; `36/37/38/45/21` belge güncellemeleri
- **Rollback Planı:**
  - Auth adapter'ları revert edilir; `AuthPort` korunabilir
  - ADR-010 yeniden `Accepted` statüsüne alınır
  - ADR-021 `Superseded` işaretlenir

---

# 20. Yeniden Değerlendirme (Revalidation)

- **Revalidation Tarihi:** Koşullu
- **Tetikleyici Koşul:** ADR-020 Firebase kararı değişirse; Firebase Auth ürün gereksinimlerini (enterprise SSO, gelişmiş MFA, passkey) sistematik olarak karşılayamazsa
- **Değerlendirme Sorumlusu:** Architecture Owner / Security Owner
- **Değerlendirme Kapsamı:** Firebase Auth özellik kapsamı, Security Rules / `context.auth` yetki modelinin yeterliliği, passkey/MFA olgunluğu, `AuthPort` izolasyonunun taşınabilirliği
- **Sonuç Seçenekleri:** Karar geçerli / Addendum gerekiyor / Yeniden değerlendirilmeli (yeni ADR) / Superseded

---

# 21. Kararın Kısa Hükmü

> Authentication için canonical karar: saf Firebase Auth. Giriş client SDK ile yapılır, kimlik Firebase ID token ile taşınır, yetkilendirme Firestore Security Rules + Cloud Functions `context.auth` ile değerlendirilir; kendi backend session/cookie modeli yoktur. ADR-010'un backend-managed cookie kararı supersede edilmiştir. Auth lifecycle `onAuthStateChanged` ile yönetilir; token persistence Firebase SDK'ya aittir (mobile otomatik + `expo-secure-store`, web Firebase persistence). Auth artefact'ları generic state değildir; UI sanitized summary tüketir; logout/expiry/user-switch deterministic cleanup (`LogoutCleanupContract`) gerektirir.

---

# 22. Onay Kriterleri

Bu ADR yeterli kabul edilir eğer:

1. Saf Firebase Auth kararı (client SDK + ID token) açıkça yazılmışsa
2. Authorization'ın Firestore Security Rules + Cloud Functions `context.auth` ile yapıldığı net tanımlanmışsa
3. Backend session/cookie modelinin kaldırıldığı ve ADR-010'un supersede edildiği belirtilmişse
4. Auth lifecycle (`onAuthStateChanged`) ve token persistence (web/mobile) tanımlanmışsa
5. `AuthPort` boundary ve UI'ya raw token sızmama ilkesi korunmuşsa
6. Logout/expiry/user-switch deterministic cleanup (`LogoutCleanupContract`) korunmuşsa
7. ADR-010'dan korunan ilkeler (biometric, social login, passkey, observability privacy) açıkça listelenmişse
8. Reddedilen yönler gerekçeleriyle yazılmışsa
9. Bu karar implementasyon öncesi kilitlenmiş auth baseline olarak kullanılabilecek netlikteyse
