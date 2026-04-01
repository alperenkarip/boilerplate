# ADR-010 — Auth, Session and Secure Storage Baseline

## Doküman Kimliği

- **ADR ID:** ADR-010
- **Başlık:** Auth, Session and Secure Storage Baseline
- **Durum:** Accepted
- **Tarih:** 2026-03-31
- **Karar türü:** Foundational security, auth boundary, session ownership and secure persistence decision
- **Karar alanı:** Authentication boundary, session modeli, token/session ownership, secure storage yaklaşımı, logout/reset disiplini, web ve mobile auth persistence farkları
- **İlgili üst belgeler:**
  - `27-security-and-secrets-baseline.md`
  - `09-state-management-strategy.md`
  - `06-application-architecture.md`
  - `10-data-fetching-cache-sync.md`
  - `28-observability-and-debugging.md`
  - `29-release-and-versioning-rules.md`
  - `36-canonical-stack-decision.md`
  - `ADR-002-mobile-runtime-and-native-strategy.md`
  - `ADR-004-state-management.md`
  - `ADR-005-data-fetching-cache-and-mutation-model.md`
  - `ADR-009-observability-stack.md`
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

Bu boilerplate kapsamında auth, session ve secure storage için aşağıdaki karar kabul edilmiştir:

- **Canonical auth yaklaşımı:** Backend-agnostic ama contract-first auth boundary
- **Auth/session ownership ilkesi:** Auth artefact’ları generic app-global UI state değildir
- **Web oturum yaklaşımı:** Mümkün olan yerde backend-managed, `HttpOnly` + `Secure` + uygun `SameSite` cookie tabanlı session tercih edilir
- **Web fallback yaklaşımı:** Backend zorunlu kılıyorsa constrained client-managed token modeli, ama canonical ilk tercih değildir
- **Mobile session persistence yaklaşımı:** Secure storage adapter; Expo-first baseline içinde canonical secure persistence aracı olarak `Expo SecureStore` sınıfı çözüm
- **Token görünürlük ilkesi:** Access/refresh token benzeri auth artefact’ları analytics, logs, generic stores ve debug yüzeylerine sızmaz
- **Session state yaklaşımı:** UI shell yalnızca session summary / auth status / capability summary gibi sanitized client-facing state tüketir
- **Logout ve user switch ilkesi:** Deterministic cleanup zorunludur; wrong-user leak kabul edilmez
- **Canonical ilke:** Auth sistemi UI kolaylığı için değil, security-first ownership ve lifecycle mantığıyla kurulacaktır

Bu ADR’nin ana hükmü şudur:

> Auth ve session bu boilerplate’te sıradan preference state, generic Zustand store verisi veya rastgele local storage konusu değildir. Web’de mümkün olan en güçlü varsayılan backend-managed secure cookie modelidir; mobile’da secure storage adapter kullanılır. UI yalnızca sanitize edilmiş auth/session summary tüketir; gerçek auth artefact’ları kontrollü boundary içinde kalır.

---

# 2. Problem Tanımı

Auth ve session alanı projelerde en hızlı yanlış çözülen alanlardan biridir.  
Tipik bozulmalar şunlardır:

- token generic global store’a yazılır
- localStorage’a her şey atılır
- logout sadece bir flag temizler
- user switch sonrası önceki kullanıcının cache/draft/context verisi kalır
- refresh token ve access token aynı şekilde ele alınır
- auth error ile permission error karıştırılır
- secure storage yerine convenience storage kullanılır
- debug/log/analytics içine hassas auth verisi düşer
- UI auth summary ile gerçek session artefact’ı aynı state’e karışır
- web ve mobile farkları düşünülmeden tek kaba çözüm dayatılır

Bu yüzden auth/session kararı yalnızca “hangi kütüphane?” veya “token nereye koyulacak?” sorusu değildir.  
Asıl soru şudur:

> Kimlik doğrulama ve oturum bilgisi hangi boundary içinde yaşayacak, hangi artefact nerede tutulacak, UI’ya hangi özet bilgi çıkacak, logout ve user switch nasıl temizlenecek ve web/mobile güvenlik farkları nasıl yönetilecek?

Bu ADR tam olarak bunu kapatır.

---

# 3. Bağlam

Bu boilerplate’in auth/session açısından taşıdığı zorunluluklar şunlardır:

1. Cross-platform ürün yapısı
2. Web ve mobile için farklı güvenlik gerçeklikleri
3. Security-first state ownership
4. Wrong-user leak riskini minimuma indirme
5. Query/cache/store/forms ile net sınırlar
6. Logout ve session expiry davranışlarının deterministik olması
7. Secure storage ve non-secure storage ayrımının net yapılması
8. Observability tarafında hassas veri sızmaması
9. Documentation-first lifecycle ve cleanup modeli
10. Backend sağlayıcısından bağımsız, ama gevşek olmayan auth boundary

Bu bağlamda auth yaklaşımı şu iki uçtan da kaçınmalıdır:

- her şeyi frontend convenience’ına göre storage’a dökmek
- aşırı soyut “auth service” tanımı yapıp somut lifecycle kararlarını belirsiz bırakmak

---

# 4. Karar Kriterleri

Bu karar aşağıdaki kriterlerle değerlendirilmiştir:

1. **Security ve threat-surface uygunluğu**
2. **Web ve mobile farklarını doğru ele alma**
3. **State ownership açıklığı**
4. **Logout/user switch cleanup güvenliği**
5. **Observability ve privacy uyumu**
6. **Session expiry ve re-auth yönetimi**
7. **Tooling/runtime uyumu**
8. **Backend-agnostic ama contract-driven olma**
9. **Maintenance ve audit kolaylığı**
10. **DX ama güvenliği delmeyen pragmatizm**
11. **Cross-platform parity of auth behavior**
12. **Long-term extensibility**

---

# 5. Seçilen Karar

Bu boilerplate için canonical auth/session baseline şu şekilde kabul edilmiştir:

## 5.1. Auth boundary
- explicit auth adapter / auth boundary
- provider veya SDK directly UI’ya saçılmaz
- UI, auth implementation detayını değil auth contract’ı tüketir

## 5.2. Web session preference
- mümkün olan yerde backend-managed secure cookie session
- `HttpOnly` + `Secure` + uygun `SameSite`
- frontend token okuyabilen ana model canonical değildir

## 5.3. Mobile session persistence
- secure storage adapter
- Expo-first baseline için canonical secure persistence: `Expo SecureStore` sınıfı çözüm

## 5.4. UI-facing auth state
- sanitized auth summary
- authenticated / unauthenticated / refreshing / expired benzeri status
- selected capability/session summary
- no raw secret exposure

## 5.5. Cleanup policy
- logout
- user switch
- workspace switch
- session expiry
durumlarında deterministic cleanup zorunlu

---

# 6. En Kritik İlke: Auth Artefact ile UI Session Summary Aynı Şey Değildir

Bu ADR’nin kalbi şu ayrımdır:

1. **Auth artefact’ları**
2. **UI-facing auth/session summary**

Bu iki şey kesinlikle karıştırılmamalıdır.

## 6.1. Auth artefact örnekleri

- access token
- refresh token
- session cookie
- provider session handle
- device credential pointer
- PKCE/state/nonce benzeri auth protocol transient değerleri

## 6.2. UI-facing summary örnekleri

- isAuthenticated
- current user summary
- auth status
- session expired classification
- workspace availability
- capability summary
- re-auth needed state

## 6.3. Kural

UI, mümkün olduğunca yalnızca ikinci grubu görmelidir.  
Birinci grup boundary içinde kalmalıdır.

---

# 7. Auth Boundary Kararı

## 7.1. Kural

Auth implementation detayları uygulama geneline dağılmaz.  
Canonical model explicit auth boundary / adapter katmanıdır.

## 7.2. Boundary ne yapar?

- login / logout / refresh / restore session semantics
- auth provider communication
- session restore attempt
- sanitized auth state üretimi
- token/session handling
- auth error classification
- session expiry handling
- user switch cleanup orchestration

## 7.3. Boundary ne yapmaz?

- screen-specific navigation kararlarının tamamını üstlenmez
- raw UI feedback render etmez
- feature business logic taşımaz
- analytics payload’larına auth artefact saçmaz

### 7.3.1. Auth Ekran Spec Referansı

Auth akışının somut ekran spec’leri `39-default-screens-and-components-spec.md` Bölüm 7’de tanımlanmıştır: Login (S08), Register (S09), Forgot Password (S10), Reset Password (S11), OTP Verification (S12), Biometric Prompt (S13). Her ekranın platform davranışı, kullanılan kütüphaneler ve Apple HIG uyum notları bu belgede detaylıdır.

## 7.4. Neden bu kadar önemli?

Çünkü auth çözümü provider’a, backend topology’ye veya SDK’ya sıkı bağlı olabilir.  
Bu karmaşıklık doğrudan screen/component seviyesine yayılmamalıdır.

---

# 8. Web Auth Session Kararı

## 8.1. Canonical tercih

Web tarafında mümkün olan yerde tercih edilen model:

> **Backend-managed secure session via `HttpOnly` cookies**

## 8.2. Neden bu tercih?

### 8.2.1. Token exposure surface azaltır
`HttpOnly` cookie modeli, JavaScript erişimini sınırlandırdığı için token theft yüzeyini azaltır.

### 8.2.2. Generic frontend state’e token saçma riskini düşürür
Frontend tarafında “token’ı store’a koy, header’a bas” kültürü zayıflar.

### 8.2.3. Security baseline daha güçlüdür
Özellikle XSS tehdidi perspektifinde daha kontrollü model sunabilir.

## 8.3. Bu karar ne anlama gelmez?

- CSRF yok sayılır demek değildir
- backend’in her durumda aynen bunu desteklediği varsayımı değildir
- frontend hiçbir auth logic taşımayacak demek değildir

## 8.4. Kural

Cookie session tercih ediliyorsa CSRF, session expiry, backend invalidation ve re-auth flow’ları ayrıca düşünülmelidir.

---

# 9. Web Fallback Kararı

## 9.1. Neden fallback gerekli?

Her backend veya auth provider cookie-session modeliyle gelmeyebilir.  
Bazı entegrasyonlarda client-managed access token kaçınılmaz olabilir.

## 9.2. Kural

Bu fallback model:
- canonical ilk tercih değildir
- gereksiz yere kolay yol diye seçilmez
- strict threat model ile ele alınır
- auth adapter arkasında tutulur

## 9.3. Ne anlama gelir?

Eğer web’de token client tarafında tutulmak zorundaysa:
- token lifecycle açık olacak
- memory vs storage kararı bilinçli olacak
- refresh flow güvenli tasarlanacak
- token generic store’a yayılmayacak
- logs/analytics/debug yüzeylerine sızmayacak

---

# 10. Mobile Secure Storage Kararı

## 10.1. Canonical tercih

Expo-first baseline içinde mobile secure persistence için canonical karar:

> **Secure storage adapter backed by Expo-compatible secure storage class solution**

Pratikte bu, v1 baseline için `Expo SecureStore` sınıfı çözümdür.

## 10.2. Neden?

### 10.2.1. Mobile secure persistence gerçek ihtiyaçtır
Mobile uygulama soğuk açılışlar, session restore ve re-auth senaryoları taşır.  
Convenience storage güvenli değildir.

### 10.2.2. Expo-first runtime ile doğal uyum
Bu karar, ADR-002 ile hizalıdır.

### 10.2.3. Sensitive artefact’ları generic storage’tan ayırır
Theme, locale, dismissed banner ile token aynı storage sınıfında düşünülmez.

## 10.3. Kural

Mobile session persistence için non-secure local storage canonical değildir.

---

# 11. Access Token, Refresh Token ve Session Handle Ayrımı

## 11.1. Neden kritik?

Birçok proje bu üç şeyi aynı şey gibi ele alır. Bu yanlıştır.

## 11.2. Access token
- kısa ömürlü olabilir
- request authorization için kullanılabilir
- exposure riskine çok duyarlıdır

## 11.3. Refresh token
- daha yüksek hassasiyet taşır
- lifecycle ve storage kararı daha sıkıdır
- generic UI state’e yaklaşmamalıdır

## 11.4. Session handle / cookie / backend session reference
- provider ve backend modeline göre farklılaşabilir
- frontend’in raw anlamda “okuması” gerekmeyebilir

## 11.5. Kural

Bu artefact’lar aynı storage ve aynı visibility policy ile ele alınmaz.

---

# 12. Token’lar Store’a Girebilir mi?

## 12.1. Canonical cevap

**Generic app-global state store’a hayır.**

## 12.2. Neden?

Çünkü bu:
- accidental exposure riskini artırır
- debug yüzeylerine sızmayı kolaylaştırır
- persistence yanlış kararlarını tetikler
- wrong-user leak ve cleanup riskini artırır
- auth artefact ile UI summary’yi karıştırır

## 12.3. UI ne görebilir?

- isAuthenticated
- current user summary
- session status
- refresh in progress
- re-auth required
- selected capability summary

## 12.4. İstisna benzeri alanlar?

Controlled in-memory access within auth adapter olabilir.  
Ama bu generic store ownership’i demek değildir.

---

# 13. LocalStorage / AsyncStorage / Generic Persistence Politikası

## 13.1. Kural

Auth artefact’ları için generic convenience storage canonical değildir.

## 13.2. Ne yasaklı sayılmalıdır?

Bağlama göre:
- raw token’ı localStorage’a koymak
- raw token’ı generic AsyncStorage benzeri non-secure katmana koymak
- auth session bilgisini dismissed UI preference ile aynı persistence katmanına gömmek

## 13.3. Neden?

Çünkü convenience storage:
- security riskini büyütür
- cleanup’i zorlaştırır
- yanlış kullanıcıya sızma ihtimalini artırır
- developer ergonomisi bahanesiyle sınırları bozar

---

# 14. Auth State Machine Düşüncesi

## 14.1. Kural

Auth yalnızca boolean `isLoggedIn` değildir.

## 14.2. Olası auth durumları

- unknown / bootstrapping
- unauthenticated
- authenticated
- refreshing
- session-expired
- reauth-required
- auth-error
- signing-out

## 14.3. Neden?

Bu ayrım yapılmazsa:
- splash ve boot davranışı karışır
- expired session ile logged-out aynı ele alınır
- refresh race condition’ları büyür
- UI yanlış yüzey gösterir

## 14.4. Kural

UI ve navigation gate’leri auth state machine semantiğini tüketmelidir; ham token var/yok mantığını değil.

---

# 15. Session Restore Politikası

## 15.1. Kural

App/web başlarken session restore deterministic tasarlanmalıdır.

## 15.2. Düşünülmesi gerekenler

- restore denemesi ne zaman yapılır?
- unknown → authenticated/unauthenticated geçişi nasıl olur?
- loading surface nasıl görünür?
- refresh başarısızsa ne olur?
- stale cache / previous user data ne zaman temizlenir?

## 15.3. Zayıf davranışlar

- önce eski kullanıcı verisini göstermek
- restore başarısız olsa da shell’i yanlış açmak
- restore sırasında belirsiz spinner kaosu
- session restore failure’ı sessizce swallow etmek

---

# 16. Logout Politikası

## 16.1. En kritik ilke

> Logout yalnızca bir boolean temizliği değildir.

## 16.2. Logout sırasında temizlenmesi gerekebilecek alanlar

- secure auth artefact’ları
- in-memory auth context
- query cache
- user-scoped client state
- drafts (policy’ye göre)
- workspace context
- feature-local persisted remnants
- analytics user binding
- diagnostics user context

## 16.3. Kural

Logout deterministic cleanup contract taşımalıdır.

## 16.4. Zayıf davranışlar

- token’ı silip query cache’i bırakmak
- önceki kullanıcının profile bilgisi görünmeye devam etmek
- analytics binding’i resetlememek
- debug/session summary yüzeylerinde önceki kullanıcı izlerini bırakmak

---

# 17. User Switch Politikası

## 17.1. Neden ayrı düşünülmeli?

User switch, logout + login’in birebir aynı UX karşılığı değildir.  
Ama security ve wrong-user leak açısından aynı ciddiyeti taşır.

## 17.2. Kural

User switch olduğunda:
- önceki user-scoped state temizlenmeli
- query cache scope resetlenmeli veya yeniden ayrıştırılmalı
- drafts ve persisted session-adjacent state yeniden değerlendirilmelidir
- analytics/observability user binding güncellenmelidir

## 17.3. Zayıf davranışlar

- yeni kullanıcı giriş yaptığında eski kullanıcının liste verisini kısa süre göstermek
- shared workspace context’i resetlememek
- storage namespace’i user-agnostic bırakmak

---

# 18. Workspace / Tenant Switch Politikası

## 18.1. Neden önemli?

B2B veya multi-workspace ürünlerde workspace switch, user switch kadar kritik olabilir.

## 18.2. Kural

Workspace-bound state:
- query key scope
- persisted context
- current selection
- capability summary
açısından ayrıştırılmalıdır.

## 18.3. Zayıf davranışlar

- workspace değişince önceki workspace’in data cache’ini UI’da tutmak
- current workspace scope’u query key’e yansıtmamak
- secure session ile workspace state’i birbirine karıştırmak

---

# 19. Session Expiry Politikası

## 19.1. Kural

Session expiry logged-out ile aynı UX’e kör indirilmez.

## 19.2. Neden?

Çünkü kullanıcı deneyimi açısından fark vardır:
- session expired
- network error
- revoked session
- manual logout
aynı şey değildir.

## 19.3. Doğru yaklaşım

- uygun classification
- gerekiyorsa re-auth flow
- pending work kaybı riski varsa kontrollü iletişim
- cache ve sensitive state cleanup

## 19.4. Zayıf davranışlar

- expiry durumunda sessiz sonsuz retry
- kullanıcıyı neden çıktığını anlamadan ana ekrana atmak
- expired session’da stale data göstermeye devam etmek

---

# 20. Auth Error Taxonomy

## 20.1. Neden kritik?

Auth error tek şey değildir.

## 20.2. Olası error aileleri

- invalid credentials
- session expired
- token refresh failed
- permission denied
- provider unavailable
- multi-factor required
- user disabled
- account locked
- network failure during auth
- unknown auth failure

## 20.3. Kural

Bu error aileleri aynı generic hata metnine indirgenmemelidir.

## 20.4. Neden?

Çünkü remediation farklıdır:
- tekrar giriş
- bekleme
- destek
- permission açıklaması
- retry
- MFA flow
- no-op with guidance

---

# 21. Auth ve Query Cache İlişkisi

## 21.1. Kural

Auth/session değişimi query cache davranışını etkiler.

## 21.2. Ne anlama gelir?

- user-scoped queries auth context ile bağlanmalıdır
- logout/user switch sonrası user-bound cache temizlenmelidir
- session expired durumunda stale protected data görünmeye devam etmemelidir

## 21.3. Zayıf davranışlar

- auth state değişti ama protected query data ekranda kaldı
- refresh başarısız olunca query error classification belirsiz kaldı
- user-scope query key disiplini yok

---

# 22. Auth ve Generic App State İlişkisi

## 22.1. Kural

Generic app state store auth implementation artefact’ı taşımaz.  
Yalnızca sanitized shell summary taşıyabilir.

## 22.2. Neler taşınabilir?

- auth status
- current user summary
- current workspace summary
- capability flags (sanitize edilmiş)
- session-expired surface state

## 22.3. Neler taşınmaz?

- raw tokens
- refresh tokens
- provider internals
- sensitive session payload’ları

---

# 23. Auth ve Forms İlişkisi

## 23.1. Kural

Login, signup, password reset, MFA gibi auth formları da generic forms standardına uymalıdır.

## 23.2. Düşünülmesi gerekenler

- credentials form values generic store’a gitmez
- validation ve error taxonomy kontrollü olur
- auth backend error’ları ham halde gösterilmez
- sensitive field değerleri logs/analytics’e sızmaz

## 23.3. Zayıf davranışlar

- auth form payload’ını analytics event’e koymak
- login failed error detaylarını raw backend string olarak göstermek
- remember me benzeri alanları yanlış storage ile karıştırmak

---

# 24. Observability ve Privacy İlişkisi

## 24.1. Kural

Auth/session observability privacy-first olmalıdır.

## 24.2. Görünür olabilir

- auth success/failure classification
- session restore success/failure
- session expired event
- re-auth required state
- permission denied classification

## 24.3. Görünür olmamalı

- raw token
- credentials
- secret claims
- full session payload
- raw auth response body

## 24.4. Zayıf davranışlar

- Sentry’ye token sızdırmak
- analytics payload’ına email/password basmak
- logs içinde credential data bırakmak

---

# 25. Secure Storage Adapter Politikası

## 25.1. Kural

Secure storage doğrudan app’in her yerinden çağrılan serbest API olmamalıdır.  
Auth boundary veya controlled secure persistence adapter ile çalışmalıdır.

## 25.2. Neden?

Çünkü:
- usage surface küçülür
- audit kolaylaşır
- secrets’in nerede tutulduğu görünür olur
- test/mocking daha temiz olur

## 25.3. Zayıf davranışlar

- her feature dosyasından secure storage erişimi
- random utility’lerin token okuması
- storage key’lerinin dağınık tanımlanması

---

# 26. Storage Namespace ve Scope Politikası

## 26.1. Kural

Persisted auth-adjacent ve user-bound state için namespace/scope düşünülmelidir.

## 26.2. Neden?

Çünkü:
- wrong-user leak
- workspace confusion
- stale drafts
- cleanup zorluğu
oluşabilir.

## 26.3. Düşünülmesi gerekenler

- device-scoped mi?
- user-scoped mi?
- workspace-scoped mi?
- session-scoped mi?

Bu sorular net değilse persistence risklidir.

---

# 27. Re-auth ve Session Refresh Politikası

## 27.1. Kural

Refresh / re-auth davranışı sessiz sihir gibi düşünülmemelidir.

## 27.2. Sorulması gerekenler

- refresh ne zaman tetiklenir?
- başarısız olursa classification ne olur?
- kullanıcıya ne gösterilir?
- pending mutation/query’lere ne olur?
- same request kaç kez tekrar denenir?

## 27.3. Zayıf davranışlar

- sonsuz refresh loop
- expired session’da görünmez retry storm
- auth failure’ı generic network failure gibi ele almak
- kullanıcıyı sessizce belirsiz durumda bırakmak

---

# 28. Web vs Mobile Farkları

## 28.1. Ortak kalması gerekenler

- auth boundary mantığı
- sanitized UI state
- logout/user switch cleanup disiplini
- observability privacy ilkesi
- auth error taxonomy
- session lifecycle classification

## 28.2. Farklılaşabilecekler

- persistence mekanizması
- browser cookie/session gerçekliği
- mobile secure store gerçekliği
- boot/restore UX detayları
- system auth / biometrics / deep link callback integration detayları

## 28.3. Sonuç

Behavior parity korunur; storage mechanism parity zorunlu değildir.

---

# 29. Biometric / Device Auth İlişkisi

## 29.1. Kural

Biometric veya device-level unlock mekanizmaları, auth/session modelinin yerine geçmez; yalnızca kontrollü ek katman olabilir.

## 29.2. Neden?

Çünkü:
- local device unlock, backend session validity ile aynı şey değildir
- false equivalence kullanıcı ve ekip için risklidir

## 29.3. Sonuç

Biometric support eklenirse ayrıca policy ister; base auth modelini değiştirmez.

---

# 30. Testing Üzerindeki Etki

Bu ADR test stratejisinde şu sonuçları doğurur:

1. Auth boundary behavior testlenebilir olmalıdır
2. Logout cleanup riskli alanlarda integration test konusu olur
3. Session restore davranışı test veya audit konusu olur
4. Wrong-user leak senaryoları özellikle doğrulanmalıdır
5. Auth error classification testlenebilir olmalıdır
6. Secure storage adapter usage kontrollü mock/test yüzeyi taşımalıdır

---

# 31. Repo Yapısı Üzerindeki Etki

Bu ADR şu topolojik sonuçları doğurur:

- auth boundary / adapter controlled katmanda yaşamalıdır
- secure storage helpers random utility klasörlerine dağılmaz
- session summary UI store’dan ayrı conceptual boundary’de tutulur
- auth provider specifics app-shell ve adapter seviyesinde kalır
- logout cleanup orchestration merkezi ve açıklanabilir olmalıdır
- biometric authentication modülü auth boundary içinde yaşamalıdır

Bu nedenle `21-repo-structure-spec.md` bu ADR ile hizalanmalıdır.

---

# 32. Contribution ve Review Üzerindeki Etki

Bu ADR sonrası contributor ve reviewer şu soruları sormalıdır:

1. Burada auth artefact generic state’e sızıyor mu?
2. Bu veri secure storage gerektiriyor mu?
3. Logout/user switch cleanup gerçekten tamam mı?
4. Wrong-user leak riski var mı?
5. Session restore UX ve lifecycle açık mı?
6. Auth error classification doğru mu?
7. Logs/analytics/debug surfaces sensitive veri taşıyor mu?
8. Cookie/session vs token fallback kararı gerçekten gerekçeli mi?
9. Query cache auth değişimiyle uyumlu mu?
10. Bu auth implementation provider detayını UI’ya sızdırıyor mu?

---

# 33. Neden Web’de LocalStorage-First Token Modeli Seçilmedi?

## 33.1. Gerekçe

Web’de raw token’ı localStorage’a koyup tüm auth’ı bunun etrafında kurmak:
- exposure surface’i artırır
- XSS etkisini büyütür
- accidental log/debug sızıntısını kolaylaştırır
- cleanup ve wrong-user riskini artırır

## 33.2. Sonuç

Bu model canonical ilk tercih değildir.

---

# 34. Neden Auth’u Generic Zustand Store ile Çözmüyoruz?

## 34.1. Gerekçe

Çünkü Zustand UI-facing summary için uygundur; auth artefact ownership için değil.

## 34.2. Riskler

- persistence kolayca yanlış açılır
- token visibility artar
- auth vs shell summary karışır
- security review zorlaşır

## 34.3. Sonuç

Generic store-driven auth model canonical olarak reddedilmiştir.

---

# 35. Neden Mobile’da Generic AsyncStorage-First Model Seçilmedi?

## 35.1. Gerekçe

Mobile secure persistence ihtiyacı convenience storage ile aynı seviyede değildir.

## 35.2. Sonuç

Auth/session persistence için non-secure generic storage canonical baseline değildir.

---

# 36. Riskler

Bu kararın da riskleri vardır.

## 36.1. Backend-agnostic auth boundary kötü tasarlanırsa fazla soyut olabilir
Bu gerçek risktir.

## 36.2. Cookie-preferred model tüm backend’lere uymaz
Bu nedenle fallback policy gereklidir.

## 36.3. Secure storage yanlış scope ile kullanılırsa stale/wrong-user leak yine oluşabilir
Tool tek başına çözmez.

## 36.4. Cleanup orchestration eksik tasarlanırsa logout güvenli görünür ama eksik kalır
Bu ciddi risktir.

## 36.5. Session restore UX kötü tasarlanırsa güvenlik doğru olsa bile ürün deneyimi bozulur
Bu da kritik risktir.

---

# 37. Risk Azaltma Önlemleri

Bu ADR’nin risklerini azaltmak için şu önlemler gerekir:

1. Auth adapter contract dokümante edilmeli
2. Logout/user switch cleanup checklist hazırlanmalı
3. Sensitive payload denylist observability tarafına bağlanmalı
4. Secure storage access tek boundary’ye indirgenmeli
5. Query cache cleanup policy auth lifecycle ile bağlanmalı
6. Session restore ve expiry behavior audit edilmeli
7. Web fallback token modeli seçilirse ayrı security review yapılmalı

---

# 38. Non-Goals

Bu ADR aşağıdakileri çözmez:

- exact auth provider/vendor seçimi
- OAuth/OIDC/SAML detay protokolleri
- MFA implementation details
- biometrics full policy
- passwordless specifics
- backend session rotation specifics
- cookie attribute exact final values in every deployment environment
- web fallback token transport exact wiring

Bu alanlar ürün ve backend bağlamına göre ayrıca kapanacaktır.

---

# 39. Uygulanma Sonuçları

Bu ADR kabul edildiğinde aşağıdaki sonuçlar doğar:

1. Auth/session ownership generic app state’ten ayrılır
2. Web tarafında secure cookie session modeli mümkünse canonical tercih olur
3. Mobile tarafında secure storage adapter canonical hale gelir
4. UI yalnızca sanitized auth/session summary tüketir
5. Logout, session expiry ve user switch deterministic cleanup gerektirir
6. Observability ve analytics yüzeyleri auth sensitive data’yı taşımaz
7. Wrong-user leak, resmi audit ve DoD konusu olur

---

# 40. Gelecekte Bu Karar Ne Zaman Yeniden Açılabilir?

Aşağıdaki durumlarda bu ADR yeniden değerlendirilebilir:

- backend topology cookie-preferred modeli sistematik olarak imkânsız kılıyorsa
- Expo secure storage baseline uzun vadede yetersiz kalırsa
- auth provider gereksinimleri boundary modelini ciddi biçimde değiştirirse
- privacy/regulation veya enterprise security gereksinimleri farklı session modeli zorunlu kılarsa

Bu seviyedeki değişiklik yeni ADR ve muhtemelen geniş auth migration gerektirir.

---

# 41. Kararın Kısa Hükmü

> Auth, session ve secure storage için canonical karar: auth artefact’ları generic app state değildir; UI yalnızca sanitized session summary tüketir. Web’de mümkün olan yerde backend-managed secure cookie session tercih edilir; mobile’da secure storage adapter kullanılır. Logout, expiry ve user switch deterministic cleanup gerektirir; sensitive auth data observability, logs ve analytics yüzeylerine sızmaz.

---

# 42. Onay Kriterleri

Bu ADR yeterli kabul edilir eğer:

1. Auth artefact ile UI-facing session summary ayrımı açıkça yazılmışsa
2. Web cookie-preferred yaklaşımı ve mobile secure storage baseline net tanımlanmışsa
3. Generic store ve generic convenience storage sınırları görünür kılınmışsa
4. Logout, user switch, expiry ve restore politikaları açıklanmışsa
5. Privacy/observability sınırları netse
6. Neden localStorage-first, generic store-driven auth ve generic AsyncStorage-first modelin canonical seçilmediği açıklanmışsa
7. Riskler ve mitigations görünürse
8. Bu karar implementasyon öncesi kilitlenmiş auth/session baseline olarak kullanılabilecek netlikteyse

---

# 43. Kısa Sonuç

Bu ADR’nin ana çıktısı şudur:

> Bu boilerplate’te auth ve session, convenience-first frontend state problemi olarak ele alınmayacaktır. Auth artefact’ları kontrollü boundary içinde kalacak; UI yalnızca sanitize edilmiş auth/session summary tüketecektir. Web tarafında mümkün olan yerde secure cookie session tercih edilecek, mobile tarafında ise secure storage adapter kullanılacaktır. Logout, restore, expiry ve user switch davranışları deterministik ve security-first tasarlanacaktır.

---

# 44. Biometric Authentication Genisletmesi (2026-04-01 Eki)

Bu bolum ADR-010’un mevcut kararlarini degistirmez; biometric authentication katmanini tamamlayici olarak tanimlar. Mevcut auth boundary, secure storage ve session lifecycle kararlari aynen gecerlidir.

## 44.1. Canonical SDK

`expo-local-authentication` bu boilerplate’in biometric authentication SDK’sidir. Expo SDK 55.x managed workflow ile dogal uyum saglar ve ADR-002 Expo-first ilkesiyle hizalidir.

## 44.2. Desteklenen Biometric Yontemler

### 44.2.1. iOS

- **Face ID:** TrueDepth kamera tabanli yuz tanima
- **Touch ID:** Parmak izi tanima (eski cihazlar)
- **Optic ID:** Vision Pro cihazlarda iris tanima
- `NSFaceIDUsageDescription` plist key’i zorunludur; kullaniciya neden Face ID istendigini aciklar

### 44.2.2. Android

- **Fingerprint:** Parmak izi tanima
- **Face Unlock:** Yuz tanima (cihaz destegine bagli)
- **Iris:** Iris tanima (cihaz destegine bagli)
- BiometricPrompt API kullanilir; cihaz seviyesinde dogrulama yapilir

## 44.3. Security Level Ayrimi

### 44.3.1. biometricStrong (Class 3)

- Donanim tabanli biometric dogrulama
- Face ID, Touch ID ve Android BiometricPrompt BIOMETRIC_STRONG
- Guvenlik acisidan tercih edilen seviye
- Auth token unlock ve hassas islemler icin bu seviye zorunludur

### 44.3.2. biometricWeak (Class 2)

- Yazilim tabanli veya dusuk guvenlikli biometric dogrulama
- Bazi Android cihazlardaki yuz tanima
- Hassas islemler icin tek basina yeterli degildir
- Convenience unlock icin kabul edilebilir ama guvenlik-kritik islemlerde biometricStrong ile desteklenmelidir

### 44.3.3. Kural

Uygulama hangi security level’in mevcut oldugunu kontrol eder ve buna gore davranis belirler. biometricStrong yoksa hassas islemler icin PIN/sifre fallback zorunludur.

## 44.4. Fallback Mekanizmasi Zorunlulugu

- **Biometric her zaman opsiyoneldir; zorunlu degildir.** Kullanici biometric kullanmayi reddedebilir veya cihaz desteklemeyebilir.
- **Fallback yontemleri:** PIN, sifre veya pattern unlock her zaman alternatif olarak sunulur
- **Biometric basarisiz oldugunda** (taninmayan yuz/parmak, sensor hatasi) fallback otomatik sunulur
- **Accessibility:** Biometric kullanamayan kullanicilar (fiziksel engel, cihaz desteksizligi) icin alternatif yol her zaman mevcuttur. Biometric olmadan uygulamanin tum ozellikleri erisilebilir olmalidir.
- **Kilit sonrasi:** Birden fazla basarisiz biometric deneme sonrasi cihaz guvenlik kilidi devreye girer; uygulama bunu yonetmez, platform mekanizmasina birakir.

## 44.5. Biometric Veri Guvenligi

### 44.5.1. Veri cihazda kalir

- Biometric veri (parmak izi, yuz haritasi) cihazin Secure Enclave (iOS) veya TEE/StrongBox (Android) alaninda saklanir
- Bu veri uygulama tarafindan okunamaz, kopyalanamaz veya backend’e gonderilemez
- Uygulama yalnizca dogrulama sonucunu (basarili/basarisiz) alir

### 44.5.2. Backend’e gonderilmez

- Biometric veri, hash’i, template’i veya herhangi bir turetilmis verisi backend’e gonderilmez
- Backend biometric dogrulama sonucunu dogrudan guvenilir kaynak olarak kabul etmez; biometric yalnizca yerel cihaz unlock mekanizmasidir

### 44.5.3. Observability ve privacy

- Biometric event’leri (basari/basarisizlik) analytics’e yalnizca anonimlestirilmis ve aggreate olarak raporlanir
- Biometric hata detaylari (hangi parmak, hangi yuz acisi) loglanmaz
- Sentry veya diger crash reporting araclarinda biometric context bulunmaz

## 44.6. Biometric + Secure Storage Birlestirmesi (Token Unlock)

### 44.6.1. Senaryo

Kullanici uygulamayi actigi zaman biometric dogrulama ile secure storage’daki auth token’ina erisim saglanir. Bu, session restore isleminin kullanici dostu versiyonudur.

### 44.6.2. Akis

1. Uygulama aciliginda biometric enrollment durumu kontrol edilir
2. Biometric aktifse ve kullanici onayliysa biometric prompt gosterilir
3. Biometric dogrulama basariliysa secure storage’dan token okunur
4. Token gecerliligi kontrol edilir (expired ise refresh veya re-auth)
5. Basarisizsa veya kullanici iptal ederse PIN/sifre fallback sunulur

### 44.6.3. Kural

Biometric dogrulama basarisi otomatik olarak backend session gecerliligi anlamina gelmez. Biometric yalnizca yerel secure storage erisim kapisi olarak kullanilir; backend session validity ayrica dogrulanir.

## 44.7. Biometric Enrollment Durumu Kontrolu

- Uygulama baslarken `expo-local-authentication` ile cihazin biometric destegi kontrol edilir
- Kontrol edilen durumlar:
  - **Donanim destegi var mi?** (hasHardwareAsync)
  - **Biometric kayitli mi?** (isEnrolledAsync)
  - **Hangi biometric turleri mevcut?** (supportedAuthenticationTypesAsync)
  - **Security level nedir?** (biometricStrong vs biometricWeak)
- Biometric donanim yoksa veya kayit yapilmamissa biometric secenegi gosterilmez; fallback dogrudan sunulur
- Kullanici cihaz ayarlarindan biometric ekler/kaldirir; uygulama bir sonraki acilista durumu yeniden kontrol eder

## 44.8. Platform-Specific Davranis Farklari

### 44.8.1. iOS

- Face ID ilk kullanildiginda sistem izin dialog’u gosterir; kullanici reddederse ayarlardan acmasi gerekir
- Touch ID icin ayrica izin gerekmez; enrollment yeterlıdir
- Keychain entegrasyonu ile biometric-protected item’lar tanimlanabilir
- `LAPolicy.deviceOwnerAuthenticationWithBiometrics` vs `LAPolicy.deviceOwnerAuthentication` ayrimi yapilir

### 44.8.2. Android

- BiometricPrompt sistem dialog’u gosterir; custom UI yasaktir (platform kuralı)
- `setNegativeButtonText` ile iptal butonu yonetilir
- `setAllowedAuthenticators` ile BIOMETRIC_STRONG, BIOMETRIC_WEAK ve DEVICE_CREDENTIAL kombinasyonlari belirlenir
- Android 10+ cihazlarda biometric API tutarlıdır; eski cihazlarda FingerprintManager fallback expo-local-authentication tarafindan yonetilir

### 44.8.3. Ortak davranis

- Biometric prompt UI platform-native olur; custom biometric UI olusturulmaz
- Dogrulama sonucu (basari/basarisizlik/iptal) her iki platformda ayni sekilde ele alinir
- Biometric tercih durumu kullanici bazinda secure storage’da tutulur

## 44.9. Passkey Destegi Hazirligi (WebAuthn / FIDO2)

### 44.9.1. Gelecek yonelim

Passkey (WebAuthn / FIDO2) password-less authentication standardidir. Apple, Google ve Microsoft tarafindan desteklenmektedir.

### 44.9.2. Hazirlik ilkeleri

- Auth boundary mimarisi passkey entegrasyonuna izin verecek sekilde tasarlanir
- Auth adapter contract’i passkey credential turunu destekleyecek genislikte tutulur
- Passkey implementation detaylari bu ADR kapsaminda degildir; ayri ADR gerektirir
- Mevcut biometric authentication passkey’in yerini almaz; passkey hazir olana kadar biometric + token modeli gecerlidir

### 44.9.3. Kural

Passkey destegi eklendiginde mevcut biometric flow graceful degradation ile korunur. Passkey desteklemeyen cihazlarda biometric + fallback modeli devam eder.

## 44.10. Biometric Authentication Non-Goals

Bu genisletme asagidakileri cozmez:

- Passkey / WebAuthn / FIDO2 tam implementation
- Multi-factor authentication (MFA) tam stratejisi
- Biometric-only auth (biometric tek basina backend session olusturmaz)
- Continuous authentication (surekli biometric dogrulama)
- Biometric veri yedekleme ve cihazlar arasi transfer
- Kurumsal (enterprise) biometric policy yonetimi

## 44.11. Biometric Onay Kriterleri

Bu genisletme yeterli kabul edilir eger:

1. Canonical SDK secimi (`expo-local-authentication`) ve gerekcesi acikca yazilmissa
2. Fallback mekanizmasi zorunlulugu net tanimlanmissa
3. Biometric veri guvenlik ilkeleri (cihazda kalir, backend’e gonderilmez) belirtilmisse
4. Security level ayrimi (biometricStrong/biometricWeak) aciklanmissa
5. Biometric + secure storage birlestirmesi (token unlock) tanımlanmissa
6. Enrollment durumu kontrolu detaylandirilmissa
7. Platform-specific davranis farklari (iOS/Android) gorunur kilinmissa
8. Passkey hazirligi ilkeleri yazilmissa
9. Accessibility gereksinimi (biometric kullanamayan kullanicilar icin alternatif) acikca belirtilmisse
10. Mevcut ADR-010 kararlariyla celismedigi dogrulanmissa
