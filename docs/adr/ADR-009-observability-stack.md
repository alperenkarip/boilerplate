# ADR-009 — Observability Stack

## Doküman Kimliği

- **ADR ID:** ADR-009
- **Başlık:** Observability Stack
- **Durum:** Accepted
- **Tarih:** 2026-03-31
- **Karar türü:** Foundational observability, error visibility, diagnostics and product telemetry decision
- **Karar alanı:** Error tracking, logging, analytics abstraction, diagnostics, release visibility, debug policy, privacy-safe telemetry yaklaşımı
- **İlgili üst belgeler:**
  - `28-observability-and-debugging.md`
  - `15-quality-gates-and-ci-rules.md`
  - `27-security-and-secrets-baseline.md`
  - `29-release-and-versioning-rules.md`
  - `32-definition-of-done.md`
  - `36-canonical-stack-decision.md`
  - `ADR-005-data-fetching-cache-and-mutation-model.md`
  - `ADR-008-testing-stack.md`
- **Etkilediği belgeler:**
  - `20-initial-implementation-checklist.md`
  - `21-repo-structure-spec.md`
  - `29-release-and-versioning-rules.md`
  - `30-contribution-guide.md`
  - `31-audit-checklist.md`
  - `32-definition-of-done.md`
  - `37-dependency-policy.md`
  - `38-version-compatibility-matrix.md`

---

# 1. Karar Özeti

Bu boilerplate kapsamında observability stack için aşağıdaki karar kabul edilmiştir:

- **Error tracking canonical baseline:** Sentry
- **Analytics yaklaşımı:** Vendor-locked değil; abstraction-first event model
- **Logging yaklaşımı:** Structured, environment-aware, privacy-safe application logging
- **Diagnostics yaklaşımı:** Debug visibility ve developer diagnostics üretime sızmayacak şekilde ayrıştırılmış
- **Release visibility yaklaşımı:** Release/build metadata observability yüzeyinin resmi parçası
- **Canonical ilke:** Error tracking, analytics, logging ve debug birbirinin yerine geçen tek sistemler değildir; her biri farklı sorumluluk taşır
- **Privacy ilkesi:** PII/sensitive payload gözlemlenebilirlik bahanesiyle sistem dışına saçılmaz
- **Feature ilkesi:** Kritik user flows için “bozulursa nasıl görürüz?” sorusu observability tasarımının resmi parçasıdır

Bu ADR’nin ana hükmü şudur:

> Observability bu boilerplate’te yalnızca crash toplama veya rastgele console log basma konusu değildir. Error tracking, analytics, application logging, debug diagnostics ve release metadata birlikte ama ayrık sorumluluklarla çalışacaktır. Sentry canonical error visibility katmanıdır; analytics ise erken vendor lock-in olmadan, event contract ve privacy-first abstraction üzerinden kurulacaktır.

---

# 2. Problem Tanımı

Projelerde observability en sık şu yanlış yaklaşımlarla bozulur:

- “Sentry kurduk, tamam”
- “analytics de log gibi bir şey”
- “debug için console basarız”
- “prod’da bir hata olursa kullanıcı söyler”
- “hangi feature event atıyor çok önemli değil”
- “önce yapalım, ölçmeyi sonra ekleriz”
- “payload’ı komple gönderelim, belki lazım olur”

Bu yanlışlar pratikte şu sonuçları üretir:

- production issue’lar geç fark edilir
- veri katmanı ve mutation sorunları görünmez kalır
- kullanıcı önemli akışlarda nereye takıldı anlaşılmaz
- logging gürültü olur ama sinyal üretmez
- sensitive bilgi yanlış yere akar
- release sonrası hangi sürümün ne bozduğu anlaşılamaz
- debug code’ları production davranışına sızar
- analytics event’leri isim ve anlam kaosuna döner
- observability araçları var ama karar aldırmaz hale gelir

Bu yüzden observability kararı yalnızca “hangi vendor?” sorusu değildir.  
Asıl soru şudur:

> Bir şey bozulduğunda, yavaşladığında, yanlış çalıştığında veya kullanıcı akışında kayıp yaşandığında bunu hangi sinyallerle, hangi araçla, hangi gizlilik sınırları içinde ve hangi bağlamsal doğrulukla anlayacağız?

Bu ADR tam olarak bunu kapatır.

---

# 3. Bağlam

Bu boilerplate’in observability açısından taşıdığı zorunluluklar şunlardır:

1. Production hata görünürlüğü
2. Release sonrası regresyon tespiti
3. Kritik akışların ölçülebilirliği
4. Privacy ve security ile uyumlu telemetry
5. Web ve mobile için ortak ama platforma saygılı event düşüncesi
6. Debug ve production diagnostics ayrımı
7. Data fetching, mutation, auth ve form hatalarının görünürlüğü
8. Documentation-first event ve signal ownership
9. Aşırı vendor lock-in olmadan sürdürülebilir model
10. Audit ve DoD ile bağlı gerçek gözlemlenebilirlik standardı

Bu bağlamda observability yaklaşımı şu iki uçtan da kaçınmalıdır:

- her şeyi tek vendor içine yığmak
- hiçbir şeyi standartlaştırmayıp ekiplerin rastgele log/event üretmesine izin vermek

---

# 4. Karar Kriterleri

Bu karar aşağıdaki kriterlerle değerlendirilmiştir:

1. **Cross-platform destek**
2. **Error visibility olgunluğu**
3. **Release/stack trace/debug gücü**
4. **Privacy ve security kontrolleri**
5. **Analytics vendor lock-in riskini azaltma**
6. **Structured logging desteği**
7. **Feature-level observability contracts ile uyum**
8. **DX ve operational maintainability**
9. **Testing ve CI ile dolaylı uyum**
10. **Documentation-first governance ile uyum**
11. **Noise üretmeden sinyal verme**
12. **Long-term vendor flexibility**

---

# 5. Seçilen Karar

Bu boilerplate için canonical observability yaklaşımı şu şekilde kabul edilmiştir:

## 5.1. Error tracking
- **Sentry**

## 5.2. Analytics
- **Vendor-agnostic abstraction**
- canonical event taxonomy
- provider implementation sonradan bağlanabilir

## 5.3. Logging
- structured application logging
- environment-aware verbosity
- privacy-safe payload policy

## 5.4. Diagnostics
- dev/debug-only diagnostics surfaces
- production-safe minimal diagnostics
- release/build metadata exposure

## 5.5. Canonical ilke
Her gözlemlenebilirlik ihtiyacı tek tool ile çözülmez.  
Aşağıdaki ayrım korunur:

- **Error tracking:** “ne kırıldı?”
- **Analytics:** “kullanıcı ne yaptı / nerede bıraktı?”
- **Logging:** “uygulama içi bağlamsal teknik sinyal ne?”
- **Diagnostics:** “debug ederken sistemin içini güvenli biçimde nasıl görürüz?”
- **Release metadata:** “hangi sürümdeyiz ve hata hangi build ile ilişkili?”

---

# 6. Neden Sentry?

## 6.1. Çünkü error tracking ayrı bir problem alanıdır

Error tracking şunu çözmelidir:
- uncaught exceptions
- handled critical failures
- stack traces
- breadcrumbs
- release association
- environment separation
- crash visibility
- issue grouping

Sentry bu alanlarda güçlü ve olgun çözümdür.

## 6.2. Cross-platform olgunluğu

Bu boilerplate web ve mobile birlikte düşündüğü için error visibility çözümünün iki yüzeyde de güçlü olması gerekir.  
Sentry bu konuda güçlü adaydır.

## 6.3. Release health ve regression görünürlüğü

Sürüm, environment ve hata ilişkisinin kurulması release ve rollback kararları için çok değerlidir.

## 6.4. Neden error tracking canonical olarak vendor-locked, analytics değil?

Çünkü error tracking tarafında güçlü standardizasyon erken fayda üretir.  
Analytics tarafında ise iş modeli ve ürün olgunluğu etkisi daha büyüktür; erken vendor lock-in gereksiz olabilir.

---

# 7. Bu Karar Ne Anlama Gelmez?

Bu ADR kolay yanlış yorumlanabilir. Sınırlar açık yazılmalıdır.

## 7.1. “Sentry varsa logging gereksiz” demek değildir
Yanlıştır.

## 7.2. “Analytics event’leri Sentry breadcrumb yerine geçer” demek değildir
Yanlıştır.

## 7.3. “Console log observability’dir” demek değildir
Yanlıştır.

## 7.4. “Analytics vendor belli değilse analytics düşünmüyoruz” demek değildir
Yanlıştır.

## 7.5. “Tüm payload’ı yollarız, sonra bakarız” demek değildir
Tehlikelidir ve kabul edilmez.

Doğru yorum şudur:

> Sentry error visibility için canonical baseline’dır; analytics event modeli ise önce sözleşme olarak tanımlanır, vendor entegrasyonu daha sonra bu sözleşmeye bağlanır.

---

# 8. Observability Katmanları — En Kritik Ayrım

Bu ADR’nin kalbi şu ayrımdır:

1. **Error Tracking**
2. **Application Logging**
3. **Analytics / Product Telemetry**
4. **Diagnostics / Debug Surfaces**
5. **Release & Build Metadata**

Bu katmanlar karıştırılmamalıdır.

---

# 9. Error Tracking Politikası

## 9.1. Ne yakalanmalıdır?

Aşağıdaki hata aileleri observability açısından görünür olmalıdır:

- uncaught runtime errors
- critical handled exceptions
- app initialization failures
- navigation blocking failures
- data parsing failures
- mutation failures with user-facing impact
- auth/session failures with systemic effect
- screen-crashing rendering failures
- background task failures with meaningful consequence

## 9.2. Ne ham halde gönderilmemelidir?

- sensitive user content
- auth tokens
- raw secrets
- personal data unnecessarily
- unredacted form payloads
- entire API responses by default

## 9.3. Kural

Error tracking issue üretmek için var; veri çöplüğü toplamak için değil.

## 9.4. Handled error’lar ne olacak?

Her handled error Sentry’ye gitmez.  
Aşağıdaki sorular sorulur:
- kullanıcı etkisi yüksek mi?
- tekrar eden önemli failure family’si mi?
- diagnostics değeri var mı?
- noise üretir mi?

---

# 10. Application Logging Politikası

## 10.1. Logging nedir?

Application logging, uygulama içi teknik bağlamı görünür kılan structured sinyaldir.

## 10.2. Log neden ayrı katmandır?

Çünkü log:
- her zaman exception değildir
- analytics de değildir
- dev ve prod’da farklı detay seviyeleri gerektirir

## 10.3. Kural

Log’lar:
- structured olmalı
- anlamlı event/action context taşımalı
- environment-aware olmalı
- privacy-safe olmalı
- random console spam olmamalıdır

## 10.4. Structured logging ne demektir?

Log satırı veya kaydı en azından:
- event/action name
- scope/feature
- severity
- selected contextual metadata
taşımalıdır.

## 10.5. Zayıf davranışlar

- `console.log("here")`
- tüm object’i dump etmek
- feature adı belirsiz log’lar
- production’da gürültü üreten debug spam
- PII basmak

---

# 11. Console Kullanım Politikası

## 11.1. Kural

Console, production observability sistemi değildir.

## 11.2. Geliştirme ortamında
Local debug için sınırlı ve kontrollü kullanılabilir.

## 11.3. Production’da
Console tabanlı izleme canonical değildir.  
Gereksiz console kalıntıları kalite borcudur.

## 11.4. Zayıf davranışlar

- production branch’te debug console bırakmak
- error tracking yerine console’a güvenmek
- CI/tests içinde console noise üretmek

---

# 12. Analytics Politikası

## 12.1. En kritik karar

Analytics vendor bu ADR ile canonical olarak kilitlenmez.

## 12.2. Neden?

Çünkü analytics tarafı:
- ürün hedefleri
- ekip olgunluğu
- gizlilik gereksinimleri
- pazarlama / growth / product analytics ihtiyaçları
ile doğrudan ilişkilidir.

Erken vendor lock-in gereksiz olabilir.

## 12.3. Peki ne kilitleniyor?

Vendor değil, şu şeyler kilitlenir:
- event taxonomy
- naming policy
- event ownership
- payload discipline
- privacy policy
- screen/flow semantics
- abstraction layer

## 12.4. Doğru yaklaşım

Önce şu tanımlanır:
- hangi olay ölçülecek?
- neden ölçülecek?
- payload hangi alanları içerecek?
- bu veri karar aldıracak mı?
- kullanıcı gizliliği açısından güvenli mi?

Sonra vendor buna bağlanır.

---

# 13. Analytics Event Taxonomy Politikası

## 13.1. Kural

Event isimleri rastgele ekip içi jargonla üretilmez.  
Taksonomi gerekir.

## 13.2. Event aileleri örnekleri

- screen viewed
- flow started
- step completed
- form submitted
- form submit failed
- action confirmed
- action cancelled
- filter applied
- search performed
- item selected
- paywall shown
- permission denied
- retry triggered

## 13.3. Kural

Event adı şunları sağlamalıdır:
- anlaşılır olmalı
- tekrar üretilebilir olmalı
- farklı feature’larda aynı semantik için aynı model kullanılmalı
- noise değil karar sinyali üretmeli

## 13.4. Zayıf davranışlar

- `button_clicked_2`
- `test_event`
- `submit`
- `screen`
- aynı olay için üç farklı feature’da üç farklı isim

---

# 14. Analytics Payload Politikası

## 14.1. Kural

Payload minimal, anlamlı ve privacy-safe olmalıdır.

## 14.2. Payload neden minimal olmalı?

Çünkü büyük payload:
- gizlilik riski artırır
- anlamı azaltır
- yönetimi zorlaştırır
- vendor bağımlılığını artırır
- yanlış veri toplama kültürü üretir

## 14.3. Güçlü payload örnekleri

- feature id / surface id
- selected option type
- result classification
- error class (sanitized)
- step number
- outcome status
- anonymized or coarse metadata

## 14.4. Zayıf payload örnekleri

- raw user input
- tam form içerikleri
- full API response
- kişisel veri
- gereksiz device dump
- auth/session artefacts

---

# 15. Screen / Flow Telemetry Politikası

## 15.1. Kural

Analytics event’leri gerçek ürün sorularına cevap vermelidir.

## 15.2. Hangi sorular ölçülebilir?

- kullanıcı flow’a başladı mı?
- hangi adımda bıraktı?
- submit başarısız oldu mu?
- retry kullandı mı?
- önemli filtre/search feature’ı kullanıldı mı?
- kritik CTA görüldü mü ve işlendi mi?

## 15.3. Ne yapılmamalı?

Her tıklamayı ölçmek canonical değildir.  
“Çok veri toplarsak iyi olur” yaklaşımı zayıftır.

---

# 16. Diagnostics Politikası

## 16.1. Diagnostics nedir?

Error tracking ve analytics dışında, geliştirici veya support/debugging bağlamında sisteme bakmayı kolaylaştıran yüzeylerdir.

## 16.2. Örnekler

- build metadata ekranı
- environment diagnostics
- query/debug panel (dev only)
- feature flag görünürlüğü
- selected runtime capability info
- selected network/debug traces

## 16.3. Kural

Diagnostics:
- dev/test ortamında güçlü olabilir
- production’da kontrollü ve güvenli olmalıdır
- gizli veri sızdırmamalıdır

## 16.4. Zayıf davranışlar

- prod’da açık debug panel
- customer-facing görünür teknik dump
- internal identifiers ve sensitive info sızması

---

# 17. Release & Build Metadata Politikası

## 17.1. Neden observability’nin parçası?

Çünkü hata, performans sorunu veya davranış değişikliği gördüğümüzde şu sorunun cevabı kritik olur:

> Bu hangi sürümde oldu?

## 17.2. Kural

Release/build metadata:
- environment
- app version
- build number / release id
- commit or release reference
- possibly feature flag context
ile ilişkilendirilebilir olmalıdır.

## 17.3. Sonuç

Sentry ve diğer diagnostics yüzeyleri release metadata ile bağlanmalıdır.

---

# 18. Severity Politikası

## 18.1. Kural

Tüm sinyaller aynı ağırlıkta ele alınmaz.

## 18.2. Örnek ayrım

- debug
- info
- warning
- error
- critical

## 18.3. Neden?

Çünkü:
- log gürültüsünü azaltır
- escalation mantığını güçlendirir
- error tracking ve logging arasında tutarlılık sağlar

---

# 19. Noise Politikası

## 19.1. En kritik ilke

> Gürültü observability değildir.

## 19.2. Noise nasıl oluşur?

- çok fazla düşük değerli event
- her handled error’ı issue yapmak
- anlamsız debug log’ları
- aynı failure’ın farklı isimlerle raporlanması
- non-actionable telemetry

## 19.3. Kural

Her sinyal için şu soru sorulmalıdır:
“Bu veri bir karar aldırıyor mu?”

Cevap hayırsa, o sinyalin değeri düşüktür.

---

# 20. Privacy ve Security Politikası

## 20.1. En kritik ilke

> Observability, gizlilik ve güvenlik sınırlarını delme bahanesi değildir.

## 20.2. Kural

Aşağıdakiler observability payload’larına varsayılan olarak girmemelidir:
- auth tokens
- secrets
- raw personal data
- full form values
- full API payloads
- payment or credential data
- unnecessary device identifiers

## 20.3. Redaction / sanitization

Gerekli yerlerde:
- error messages sanitize edilir
- payload alanları kısaltılır
- selected fields redacted edilir
- sensitive context ayrıştırılır

## 20.4. Zayıf davranışlar

- “debug için lazım olabilir” diye her şeyi göndermek
- analytics event’ine user input basmak
- logs içine raw auth/session info yazmak

---

# 21. Auth ve Session ile İlişkisi

## 21.1. Kural

Auth/session failure’ları görünür olmalıdır; ama auth/session data sızdırılmamalıdır.

## 21.2. Ölçülebilecek şeyler

- session expired classification
- unauthorized flow interruptions
- login success/failure outcome class
- permission denied type
- re-auth required events

## 21.3. Ölçülmemesi gereken şeyler

- raw token
- credentials
- full auth response payload
- sensitive session internals

---

# 22. Data Layer ile İlişkisi

## 22.1. Kural

ADR-005 ile uyumlu olarak şu ayrım korunmalıdır:

- query/mutation failures görünür olabilir
- ama raw payload ve duplication yapılmaz
- network layer ile feature error classification ayrılır

## 22.2. Ne ölçülebilir?

- mutation failure class
- retry triggered
- conflict encountered
- parsing failure count/class
- stale behavior anomalies (gerektiğinde)
- request category performance trend

## 22.3. Ne yapılmamalı?

- her request body’yi observability’ye basmak
- query cache içeriğini log dump yapmak
- handled low-value network noise ile issue çöplüğü üretmek

---

# 23. Forms ile İlişkisi

## 23.1. Kural

Form submit başarısızlıkları ve abandonment noktaları ölçülebilir.  
Ama form içeriği ham halde toplanmaz.

## 23.2. Ölçülebilecek şeyler

- form started
- submit attempted
- submit failed class
- validation blocked
- step abandoned
- completion success
- retry initiated

## 23.3. Ölçülmemesi gereken şeyler

- tam form değerleri
- serbest metin kullanıcı girdileri
- hassas alan içerikleri

---

# 24. Performance Observability İlişkisi

## 24.1. Kural

Observability performansla tamamen ayrı düşünülmez.

## 24.2. Ne ölçülebilir?

- slow screen or route surfaces
- slow critical actions
- long mutation round-trip classes
- repeated refresh loops
- startup critical path anomalies

## 24.3. Ama dikkat

Bu ADR tam performans ölçüm stack’ini kilitlemez.  
Yalnızca performans sinyallerinin observability evrenine ait olduğunu resmileştirir.

---

# 25. Cross-Platform Etkisi

## 25.1. Kural

Event semantics web ve mobile arasında mümkün olduğunca ortak kalmalıdır.  
Ama transport ve surface-specific detaylar farklı olabilir.

## 25.2. Ortak kalması gerekenler

- event taxonomy
- outcome classification
- error family meaning
- critical journey milestones
- privacy rules
- feature naming discipline

## 25.3. Ayrışabilecek alanlar

- platform-specific metadata
- device/runtime diagnostics
- navigation surface distinctions
- performance signal details

## 25.4. Sonuç

Implementation parity değil, semantic parity hedeflenir.

---

# 26. Testing ve Observability İlişkisi

## 26.1. Kural

Observability tasarımı test stratejisinin dışında düşünülmez.

## 26.2. Ne anlama gelir?

Kritik flow’larda şu sorulabilir:
- error olduğunda doğru signal üretiliyor mu?
- mutation failure classification doğru mu?
- submit başarısızlık event’i gereksiz mi?
- build metadata bağlanıyor mu?

## 26.3. Sonuç

Observability tamamen “prod’da bakarız” konusu değildir.

---

# 27. CI ve Release Üzerindeki Etki

Bu ADR şu CI/release sonuçlarını doğurur:

1. Release metadata hazırlanması resmi süreç konusu olur
2. Error tracking release association düşünülmelidir
3. Build pipeline observability için gerekli metadata’yı üretebilmelidir
4. Prod diagnostics sızıntısı quality gate konusu olabilir
5. Analytics abstraction breaking changes governance konusu olur

---

# 28. Repo Yapısı Üzerindeki Etki

Bu ADR şu topolojik sonuçları doğurur:

- observability contracts rastgele feature içine gömülmez
- analytics abstraction kendine ait kontrollü yaşam alanı ister
- logging utilities her app içinde ayrı icat edilmez
- error classification helpers kontrollü katmanda yaşar
- release/build metadata access yolu merkezi olmalıdır

Bu nedenle `21-repo-structure-spec.md` bu ADR ile hizalanmalıdır.

---

# 29. Contribution ve Review Üzerindeki Etki

Bu ADR sonrası contributor ve reviewer şu soruları sormalıdır:

1. Bu kritik flow bozulursa bunu görebiliyor muyuz?
2. Burada error tracking gerekir mi, yoksa log mu, analytics mi?
3. Event adı ve payload gerçekten anlamlı mı?
4. PII veya sensitive veri sızıyor mu?
5. Noise üreten gereksiz telemetry var mı?
6. Release/build metadata ilişkilendirilebilir mi?
7. Debug yüzeyi prod’a sızıyor mu?
8. Aynı olay başka feature’da başka isimle mi raporlanıyor?
9. Bu failure class kullanıcı etkisi taşıyor mu?
10. Bu observability eklemesi karar aldıracak mı?

---

# 30. Neden Analytics Vendor Şimdilik Kilitlenmedi?

## 30.1. Çünkü iş hedefi olmadan vendor kilidi erken olur

Analytics vendor seçimi:
- ürün KPI’ları
- growth analizi
- privacy beklentileri
- ekip operasyonları
ile doğrudan bağlıdır.

## 30.2. Bu boşluk ne anlama gelmez?

- analytics düşünmüyoruz
- event taxonomy gereksiz
- vendor gelince isim koyarız

Bunların hiçbiri doğru değildir.

## 30.3. Doğru yorum

Önce event contract kilitlenir.  
Sonra vendor bu contract’a bağlanır.

---

# 31. Neden Sentry Yerine Sadece Log / Analytics Kullanılmıyor?

Çünkü:
- log, issue management değildir
- analytics, error debugging aracı değildir
- handled critical failures ve crash grouping ayrı ihtiyaçtır

Bu yüzden Sentry canonical error visibility aracı olarak seçilmiştir.

---

# 32. Neden Console-First Yaklaşım Reddedildi?

## 32.1. Gerekçe

Console-first yaklaşım:
- sürdürülemez
- yapısızdır
- prod için güvenilmezdir
- privacy riskine açıktır
- release correlation üretmez
- ekip büyüdükçe anlamsızlaşır

## 32.2. Sonuç

Console canonical observability aracı değildir.

---

# 33. Riskler

Bu kararın da riskleri vardır.

## 33.1. Sentry aşırı kullanılırsa issue noise oluşabilir
Gerçek bir risktir.

## 33.2. Analytics abstraction kötü tasarlanırsa herkes bypass etmeye başlar
Bu ciddi risktir.

## 33.3. Logging structured değilse observability yine çöp olur
Tool seçimi tek başına bunu çözmez.

## 33.4. Privacy disiplini zayıf kurulursa telemetry zararlı hale gelir
Bu en kritik risklerden biridir.

## 33.5. Vendor-agnostic analytics yaklaşımı aşırı soyutlanırsa gereksiz complexity doğabilir
Bu da dikkat edilmesi gereken risktir.

---

# 34. Risk Azaltma Önlemleri

Bu ADR’nin risklerini azaltmak için şu önlemler gerekir:

1. Event taxonomy dokümante edilmeli
2. Payload allowlist / denylist yaklaşımı kurulmalı
3. PII redaction policy yazılmalı
4. Error classification standardı oluşturulmalı
5. Build/release metadata integration erken kurulmalı
6. Sentry issue noise yönetimi yapılmalı
7. Debug surfaces için prod safety checklist oluşturulmalı
8. Analytics abstraction contribution guide’a bağlanmalı

---

# 35. Non-Goals

Bu ADR aşağıdakileri çözmez:

- exact analytics vendor choice
- exact logging library choice
- every event name in the product
- exact performance monitoring vendor
- support tooling integration specifics
- alert routing / on-call policy
- data warehouse / BI pipeline choice

Bu alanlar sonraki policy ve setup belgelerinde kapanacaktır.

---

# 36. Uygulanma Sonuçları

Bu ADR kabul edildiğinde aşağıdaki sonuçlar doğar:

1. Error tracking için Sentry canonical baseline olur
2. Analytics event modeli abstraction-first kurgulanır
3. Structured logging resmi uygulama yaklaşımı olur
4. Debug ve diagnostics yüzeyleri environment-aware tasarlanır
5. Release/build metadata observability’nin resmi parçası olur
6. Privacy-safe telemetry canonical zorunluluk haline gelir
7. “Bozulursa nasıl görürüz?” sorusu feature tasarımının resmi parçası olur

---

# 37. Gelecekte Bu Karar Ne Zaman Yeniden Açılabilir?

Aşağıdaki durumlarda bu ADR yeniden değerlendirilebilir:

- Sentry error visibility açısından sistematik olarak yetersiz kalırsa
- analytics abstraction modelinin bakım maliyeti faydayı aşarsa
- privacy/regulation gereksinimleri modeli kökten değiştirirse
- cross-platform telemetry ihtiyaçları başka yapıyı zorunlu kılarsa

Bu seviyedeki değişiklik yeni ADR ve muhtemelen geniş observability migration gerektirir.

---

# 38. Kararın Kısa Hükmü

> Observability stack için canonical karar: Sentry error tracking baseline olarak kullanılacaktır; analytics ise vendor-locked değil, event-contract-first abstraction üzerinden kurulacaktır. Logging structured ve privacy-safe olacaktır; diagnostics ve release metadata observability sisteminin resmi parçası sayılacaktır.

---

# 39. Onay Kriterleri

Bu ADR yeterli kabul edilir eğer:

1. Error tracking, analytics, logging, diagnostics ve release metadata ayrımı açıkça yazılmışsa
2. Sentry seçiminin kapsamı netse
3. Analytics vendor-agnostic yaklaşımın gerekçesi açıklanmışsa
4. Privacy ve payload disiplinleri görünür kılınmışsa
5. Feature observability ve critical flow visibility ilkesi açık yazılmışsa
6. Riskler ve mitigations görünürse
7. Bu karar implementasyon öncesi kilitlenmiş observability baseline olarak kullanılabilecek netlikteyse

---

# 40. Kısa Sonuç

Bu ADR’nin ana çıktısı şudur:

> Bu boilerplate’te observability, tek vendor veya rastgele log üretimiyle çözülen yan konu değildir. Sentry error tracking için canonical baseline’dır; analytics event modeli ise erken vendor kilidi olmadan, privacy-safe ve contract-first abstraction ile kurulacaktır. Logging, diagnostics ve release metadata bu omurganın ayrılmaz parçalarıdır.
