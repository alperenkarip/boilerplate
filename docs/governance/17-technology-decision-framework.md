# 17-technology-decision-framework.md

## Doküman Kimliği

- **Doküman adı:** Technology Decision Framework
- **Dosya adı:** `17-technology-decision-framework.md`
- **Doküman türü:** Framework / decision policy / technology governance document
- **Durum:** Accepted
- **Tarih:** 2026-03-31
- **Kapsam:** Bu belge, boilerplate kapsamında teknoloji kararlarının hangi modelle alınacağını, hangi kararların artık kapandığını, hangi alanların hâlâ açık veya sınırlı karar alanı olduğunu, yeni araç veya kütüphane taleplerinin hangi eşiklerden geçeceğini ve dependency/compatibility/ADR seti ile nasıl ilişkilendirileceğini tanımlar.
- **Bağlı olduğu üst dokümanlar:**
  - `00-project-charter.md`
  - `01-working-principles.md`
  - `02-product-platform-philosophy.md`
  - `06-application-architecture.md`
  - `07-module-boundaries-and-code-organization.md`
  - `15-quality-gates-and-ci-rules.md`
  - `16-tooling-and-governance.md`
  - `37-dependency-policy.md`
  - `38-version-compatibility-matrix.md`
  - `ADR-001` → `ADR-019`
- **Doğrudan etkileyeceği dokümanlar:**
  - `18-adr-template.md`
  - `19-roadmap-to-implementation.md`
  - `20-initial-implementation-checklist.md`
  - `21-repo-structure-spec.md`
  - `29-release-and-versioning-rules.md`
  - `30-contribution-guide.md`
  - `31-audit-checklist.md`
  - `35-document-map.md`

---

# 1. Bu Dokümanın Revize Edilme Nedeni

Bu belge artık ilk yazıldığı dönemdeki kadar nötr değildir.

Önceki halde bu belge büyük ölçüde “hangi teknolojiyi nasıl seçeriz?” sorusunu cevaplıyordu.  
Şimdi ise proje artık şu noktaya gelmiştir:

- foundation kararları kapandı,
- çekirdek ADR zinciri yazıldı,
- dependency policy yazıldı,
- compatibility matrix yazıldı,
- canonical stack yönü fiilen belirlendi.

Bu nedenle bu belge artık yalnızca soyut karar çerçevesi değildir.  
Yeni rolü şudur:

> **Bu proje için teknoloji kararlarının hangi bölümünün artık kapandığını, hangi bölümünün sınırlı olduğunu ve bundan sonra yeni bir teknoloji önerisinin hangi kapılardan geçmek zorunda olduğunu tanımlayan ana yönetim belgesi olmak.**

Yani bu belge artık “özgür seçim alanı” belgesi değil;  
**karar verme rejimi ve karar kapatma otoritesi** belgesidir.

---

# 2. Amaç

Bu dokümanın amacı, teknoloji seçimini:

- popülerlik,
- alışkanlık,
- hız,
- kişisel zevk,
- hype,
- “ben bunu biliyorum”

gibi zayıf gerekçelerden çıkarıp;  
**problem-fit, mimari uyum, design system uyumu, a11y, testability, security, upgrade sürdürülebilirliği, dependency disiplini ve compatibility güvenliği** üzerinden yönetilen yazılı bir sisteme dönüştürmektir.

Bu belge şu sorulara net cevap verir:

1. Bu projede teknoloji kararı serbest alan mıdır, kapalı alan mıdır?
2. Hangi teknoloji kararları artık kapanmıştır?
3. Hangi alanlarda sınırlı karar esnekliği vardır?
4. Yeni bir teknoloji önerisi hangi belgelerle birlikte değerlendirilir?
5. Bir öneri ne zaman ADR gerektirir?
6. Bir öneri ne zaman doğrudan reddedilir?
7. Dependency policy ve compatibility matrix teknoloji kararına nasıl bağlanır?
8. POC ne zaman gerekir?
9. “Canonical stack’i bozmak” teknik olarak ne demektir?
10. Bu belge bundan sonra teknoloji tartışmalarında nasıl kullanılmalıdır?

---

# 3. Temel Tez

Bu proje kapsamında temel tez şudur:

> Teknoloji seçimi artık soyut araştırma aşamasında değildir. Bu proje için çekirdek teknoloji omurgası önemli ölçüde kapanmıştır. Bundan sonraki teknoloji kararları, bu omurgayı serbestçe yeniden tartışmak için değil; açık bırakılmış alanları kontrollü biçimde kapatmak, istisnaları ADR ile yönetmek ve canonical stack’i korumak için alınacaktır.

Bu tez şu sonuçları doğurur:

1. Her teknoloji önerisi masaya sıfırdan gelmez.
2. “Alternatif de olabilir” dili çekirdek alanlarda artık zayıf yaklaşımdır.
3. Yeni öneriler önce mevcut karar setiyle çelişiyor mu diye değerlendirilir.
4. Canonical stack ile çelişen öneri, normal öneri değil; yön değişikliği önerisidir.
5. Yön değişikliği çoğu durumda ADR ve compatibility revalidation ister.
6. Problem çözümü ile teknoloji arzusu birbirine karıştırılamaz.

---

# 4. Bu Belgenin Artık Yeni Rolü

Bu belge üç şeyi aynı anda yapar:

## 4.1. Genel teknoloji karar kriterlerini korur

Yani problem-fit, maintainability, a11y, performance, governance, migration risk gibi temel kriterleri hâlâ açıkça tanımlar.

## 4.2. Kapanmış karar alanlarını işaretler

Yani artık aşağıdaki gibi kritik alanlarda “her şey yeniden tartışmaya açık” yaklaşımını reddeder:

- web runtime
- mobile runtime
- monorepo/workspace
- state
- data/cache
- forms/validation
- styling/theming implementation
- testing stack
- observability baseline
- auth/session baseline
- i18n baseline

## 4.3. Yeni tekliflerin giriş kapısını tanımlar

Yani bundan sonra biri yeni araç önerdiğinde şu sorunun cevabı burada bulunur:

- bu öneri normal mi?
- constrained area mı?
- ADR gerekiyor mu?
- dependency policy’ye takılıyor mu?
- compatibility matrix’e takılıyor mu?

---

# 5. Karar Alanı Sınıfları

Bu projede teknoloji kararları üç sınıfa ayrılır.

---

## 5.1. Closed Canonical Decisions

Bunlar artık kapalı kabul edilen, yani “varsayılan tartışma alanı” olmaktan çıkmış kararlardır.

Kapalı alanlar:

- **Web runtime:** React + Vite tabanlı yaklaşım
- **Mobile runtime:** React Native + Expo-first yaklaşım
- **Repo topology:** Monorepo + pnpm workspace + Turborepo
- **Backend & data platform:** Firebase (BaaS) — zorunlu canonical; Firestore + Cloud Functions + Storage + Scheduler/Tasks (ADR-020)
- **Database:** Cloud Firestore (NoSQL, koleksiyon-merkezli) (ADR-020)
- **Server logic & read/write contract:** Cloud Functions (yazma + iş mantığı = Functions; okuma = client SDK doğrudan Firestore, `onSnapshot` realtime) (ADR-020)
- **State management:** Zustand policy
- **Server-state/data lifecycle:** fetch-first default + conditional TanStack Query policy
- **Forms/validation:** React Hook Form + Zod
- **Styling runtime:** Tailwind CSS + NativeWind + semantic token discipline
- **Testing baseline:** Vitest + Jest + Testing Library + Playwright
- **Observability baseline:** Sentry + analytics abstraction-first model
- **Auth/session baseline:** saf Firebase Auth (client SDK + ID token; backend session/cookie yok) + Firestore Security Rules / Cloud Functions `context.auth` yetki modeli (ADR-021)
- **i18n baseline:** i18next + namespace-based copy governance
- **Navigation baseline:** React Router 7 (web) + React Navigation 7 (mobile)
- **Dependency governance:** `37-dependency-policy.md`
- **Version track governance:** `38-version-compatibility-matrix.md`

### Kapalı alan ne demektir?

- Yeni bir alternatif önerilebilir.
- Ama bu, “bakalım hangisi daha iyi” seviyesinde konuşulmaz.
- Bu, mevcut yönü değiştirme önerisidir.
- Genellikle ADR ve compatibility revalidation gerektirir.

---

## 5.2. Constrained Open Decisions

Bunlar yönü belirlenmiş ama exact uygulama detayı veya vendor seçimi tam kilitlenmemiş alanlardır.

Örnekler:

- analytics vendor exact seçimi
- mobile E2E exact tool lock
- auth provider exact seçimi
- visual regression tool exact seçimi
- translator workflow veya TMS vendor seçimi
- bazı codegen / automation detayları
- bazı observability/perf signal vendor seçimleri
- bazı repo script/automation yardımcıları

### Bu alan ne demektir?

- Yön açık bırakılmıştır ama tamamen serbest değildir.
- Yeni öneri canonical ilke ile uyumlu olmak zorundadır.
- Bu alanlarda yanlış vendor kararı, çekirdek mimari kadar değil ama operasyonel risk yaratır.

### Trend-watch ama default olmayan alanlar

Aşağıdaki başlıklar güncel ve anlamlı olabilir; ancak canonical baseline'a sessizce geçirilmez:

- React Compiler
- React Router'ın framework/data mode genişlemeleri
- Vite major yükseltmeleri
- React Native DevTools / debug workflow değişimleri
- Expo development build ve New Architecture çevresindeki yeni zorunluluklar
- NativeWind major hat değişimleri

Bu alanlarda “yeni çıktı, geçelim” yaklaşımı kabul edilmez; compatibility revalidation ve gerekirse ADR eki gerekir.

---

## 5.3. Operational / Local Decisions

Bunlar daha küçük ve daha düşük riskli kararlardır.

Örnekler:

- belirli local script yardımcısı
- küçük test helper’ı
- docs generation support script’i
- migration yardımcı komutu
- küçük pure utility ekleme kararı

### Ama dikkat

Bu alan düşük risklidir diye kontrolsüz değildir.  
`37-dependency-policy.md` ve compatibility matrix yine geçerlidir.

---

# 6. Artık Kapalı Olan Çekirdek Kararların Referans Seti

Bu belge, kapalı alanları yalnızca sözle değil, resmi referans setiyle tanımlar.

---

## 6.1. Runtime ve topology kararları

- `ADR-001 — Web Runtime and Application Shell`
- `ADR-002 — Mobile Runtime and Native Strategy`
- `ADR-003 — Monorepo, Package Manager and Build Orchestration`

## 6.2. State / data / form kararları

- `ADR-004 — State Management`
- `ADR-005 — Data Fetching, Cache and Mutation Model`
- `ADR-006 — Forms and Validation`

## 6.3. Styling / testing / observability kararları

- `ADR-007 — Styling, Tokens and Theming Implementation`
- `ADR-008 — Testing Stack`
- `ADR-009 — Observability Stack`

## 6.4. Security / i18n / navigation kararları

- `ADR-010 — Auth, Session and Secure Storage Baseline`
- `ADR-011 — Internationalization Baseline`
- `ADR-012 — Navigation Baseline`

## 6.5. Extension surface kararları

- `ADR-013 — Push Notification Strategy`
- `ADR-014 — Deep Linking and Universal Links`
- `ADR-015 — OTA Update Strategy`
- `ADR-016 — In-App Purchase and Subscription`
- `ADR-017 — Privacy and Data Protection Framework`

## 6.6. Tamamlayıcı yönetişim belgeleri

- `37-dependency-policy.md`
- `38-version-compatibility-matrix.md`

## 6.7. Backend / data / auth platform kararları

- `ADR-020 — Backend and Data Platform` (Firebase: Cloud Firestore + Cloud Functions + Cloud Storage + Cloud Scheduler/Tasks + FCM; read/write contract)
- `ADR-021 — Authentication Platform` (saf Firebase Auth; ADR-010'u supersede eder)

Bu belgeler birlikte **canonical technology baseline** olarak yorumlanır.

---

# 7. Bir Teknoloji Önerisi Geldiğinde İzlenecek Sıra

Bundan sonra yeni teknoloji önerileri aşağıdaki sırayla değerlendirilmelidir.

## 7.1. Adım 1 — Problem tanımı

Önce şu soru cevaplanır:

> Tam olarak hangi problem çözülmek isteniyor?

Problem tanımı net değilse teknoloji tartışması başlamaz.

## 7.2. Adım 2 — Problem zaten mevcut canonical stack içinde çözülebiliyor mu?

Çoğu zayıf öneri burada elenir.

Örnek:

- ikinci form kütüphanesi istemek
- ikinci state library istemek
- design system dışında UI library istemek
- ikinci cache/query stack istemek

Bu tip öneriler önce “neden mevcut sistem yetmiyor?” sorusuna cevap vermek zorundadır.

## 7.3. Adım 3 — Karar alanı hangi sınıfta?

Öneri:

- closed area mı?
- constrained open area mı?
- operational area mı?

Buna göre sertlik seviyesi değişir.

## 7.4. Adım 4 — Dependency policy filtresi

Öneri `37-dependency-policy.md` üzerinden geçer.

## 7.5. Adım 5 — Compatibility matrix filtresi

Öneri `38-version-compatibility-matrix.md` ile çelişiyor mu?

## 7.6. Adım 6 — ADR gerekip gerekmediği

Closed area veya high-risk dependency ise çoğu zaman ADR gerekir.

## 7.7. Adım 7 — POC gerekip gerekmediği

Belirsizlik yüksekse POC yapılır.  
Ama POC, karar yerine geçmez.

---

# 8. Zorunlu Değerlendirme Kriterleri

Her ciddi teknoloji kararı aşağıdaki eksenler üzerinden değerlendirilmelidir.  
Bu liste önceki versiyona göre korunur ama artık daha sert yorumlanır.

---

## 8.1. Problem-Fit

### Ana soru

Bu teknoloji gerçekten tanımlanan problemi çözüyor mu?

### Açıklama

Teknoloji, problemden önce seçilmez.  
Problem tanımı belirsizken teknoloji seçmek doğrudan zayıf yaklaşımdır.

### Red flag

- “Bunu kullansak güzel olur”
- “Ben bunu seviyorum”
- “Belki ileride lazım olur”

---

## 8.2. Architectural Fit

### Ana soru

Bu araç, mevcut uygulama mimarisi ve modül sınırları ile uyumlu mu?

### Bakılacaklar

- domain/UI/data ayrımını bozuyor mu?
- feature boundaries’i bulanıklaştırıyor mu?
- apps/packages topolojisini deliyor mu?
- adapter/wrapper arkasına alınabiliyor mu?

### Kritik not

Bu proje için “iyi kütüphane” olmak yeterli değildir.  
**Mimari ile uyumlu olmak zorundadır.**

---

## 8.3. Design System Fit

### Ana soru

Bu teknoloji design system-first yaklaşımı taşıyabiliyor mu?

### Bakılacaklar

- token ve semantic token kullanımını destekliyor mu?
- styling authority’yi parçalıyor mu?
- reusable component üretimini kolaylaştırıyor mu, yoksa deliyor mu?
- theme runtime ile çelişiyor mu?

### Red flag

- hazır component framework ile DS’yi bypass etmek
- styling runtime’ını ikinci bir sistemle parçalamak

---

## 8.4. Accessibility Fit

### Ana soru

Bu teknoloji erişilebilirlik standardını destekliyor mu, zayıflatıyor mu?

### Bakılacaklar

- focus/keyboard/screen reader davranışı
- modal/dialog/form semantics
- reduced motion / state visibility
- semantic role desteği

### Red flag

A11y boşluklarını feature feature elle yamalamak zorunda bırakıyorsa, araç zayıftır.

---

## 8.5. Performance Fit

### Ana soru

Bu seçim runtime ve build maliyeti açısından sağlıklı mı?

### Bakılacaklar

- web bundle etkisi
- mobile binary/init cost
- render modeli
- memory ve CPU etkisi
- startup ve hydration/boot etkisi
- observer / subscription cost

### Red flag

Küçük rahatlık için büyük runtime maliyeti.

---

## 8.6. Testability

### Ana soru

Bu araç test yazmayı ve sistem davranışını doğrulamayı kolaylaştırıyor mu?

### Bakılacaklar

- isolated test imkânı
- integration test doğal akışı
- mocking karmaşıklığı
- deterministic behaviour
- CI güvenilirliği

### Red flag

Kullanımı rahat ama test etmek çamur ise, uzun vadede zayıftır.

---

## 8.7. Governance / Enforceability

### Ana soru

Bu teknoloji kalite kurallarını enforce etmeyi kolaylaştırıyor mu, zorlaştırıyor mu?

### Bakılacaklar

- lint rule ile denetlenebilir mi?
- boundary kontrolü mümkün mü?
- misuse surface’i büyük mü?
- CI içinde görünür kılınabilir mi?
- exception yönetimi yapılabilir mi?

### Red flag

Doğru kullanım tamamen geliştirici vicdanına kalıyorsa risklidir.

---

## 8.8. Security / Privacy Fit

### Ana soru

Bu araç security veya privacy yüzeyi açıyor mu?

### Özellikle kritik sınıflar

- auth SDK
- storage
- analytics
- observability
- network interception
- native capabilities

### Red flag

“Default olarak çok veri topluyor ama kapatırız” yaklaşımı.

---

## 8.9. Migration / Exit Cost

### Ana soru

Bu karardan geri dönmek ne kadar pahalı?

### Bakılacaklar

- public surface’e yayılım
- feature sayısına yayılım
- generated code etkisi
- vendor API gömülülüğü
- test ve docs maliyeti

### Red flag

“Olmazsa değiştiririz” cümlesi, çıkış maliyeti hesaplanmadan kullanılamaz.

---

## 8.10. Operability / Team Fit

### Ana soru

Bu aracı bu repo ve bu çalışma modeli içinde gerçekten sürdürebilir miyiz?

### Bakılacaklar

- öğrenme eşiği
- debugging kalitesi
- küçük ekipte işletilebilirlik
- contributor onboarding etkisi
- dokümantasyon kalitesi

---

# 9. Bu Projede Artık “Özgür Seçim” Sayılmayan Alanlar

Aşağıdaki alanlarda artık “alternatifleri yeniden açalım” yaklaşımı normal kabul edilmez:

1. Web framework/runtime seçimi
2. Mobile runtime seçimi
3. Monorepo/workspace yönü
4. State management yönü
5. Query/cache yönü
6. Form/validation yönü
7. Styling/theming runtime yönü
8. Testing stack ana yönü
9. Error tracking ana yönü
10. Auth/session baseline yönü (saf Firebase Auth — ADR-021)
11. i18n runtime ana yönü
12. Backend / database / server logic platform yönü (Firebase / Cloud Firestore / Cloud Functions — ADR-020)

Bu alanlarda değişiklik teklifi, “yeni araç önerisi” değil;  
**mevcut sistem kararına itiraz** sayılır.

---

# 10. Hâlâ Açık Ama Sınırlı Olan Alanlar

Aşağıdaki alanlar karar alanı olmaya devam eder, ama kontrolsüz değildir:

1. Analytics vendor exact seçimi
2. Mobile E2E aracı exact seçimi
3. Visual regression vendor exact seçimi
4. Auth provider / backend auth product exact seçimi
5. Bazı codegen araçları
6. Some release automation helpers
7. Docs tooling veya script yardımı
8. Some perf diagnostics helpers
9. Some feature-flag/infrastructure adapters

Bu alanlarda karar verirken:

- canonical baseline korunur,
- dependency policy uygulanır,
- compatibility matrix kontrol edilir,
- gerektiğinde ADR açılır.

---

# 11. POC Gerektiren Durumlar

Aşağıdaki durumlarda POC güçlü gerekliliktir:

1. Closed area’yı etkileyecek ama kesin karar vermeden önce somut risk görmek gerekiyorsa
2. Native bridge veya platform capability kararı alınıyorsa
3. Styling/runtime veya performance davranışı kâğıt üzerinde net ama pratikte şüpheliyse
4. Vendor abstraction iddiası varsa ve gerçek hayatta ergonomi belirsizse
5. Test, CI veya build surface’ini belirgin etkileyecek araç düşünülüyorsa

### POC ne değildir?

- mini ürün
- belgesiz deney
- sonunda “ne hissettik?” toplantısı

### POC ne üretmelidir?

- cevaplanması gereken risk soruları
- gözlenen teknik davranış
- karar önerisi
- kabul / red / daha fazla araştırma kararı

---

# 12. Ne Zaman ADR Gerekir?

Aşağıdaki durumlarda teknoloji kararı çoğu zaman ADR gerektirir:

1. Closed canonical area’ya dokunuyorsa
2. Foundation veya structural seviyede yeni araç getiriyorsa
3. Yeni package family açtırıyorsa
4. Runtime / security / auth / storage etkisi varsa
5. Testing stack veya CI topolojisini etkiliyorsa
6. Styling/theming/token runtime’ına dokunuyorsa
7. Public surface’i etkileyecek kadar derinse
8. Vendor lock-in düzeyi yüksekse

### Not

ADR gerektiren şeyi sıradan dependency addition gibi geçirmek bu proje kapsamında doğrudan zayıf yaklaşımdır.

---

# 13. Dependency Policy ile Zorunlu İlişki

Bu belge tek başına teknoloji kararı vermez.  
`37-dependency-policy.md` ile birlikte çalışır.

## 13.1. Bu belge ne yapar?

- karar mantığını tanımlar
- karar sınıflarını ayırır
- risk ve otorite seviyesini belirler

## 13.2. Dependency policy ne yapar?

- yeni paket kabul kriterlerini tanımlar
- rejection koşullarını koyar
- patch/fork/upgrade/removal kurallarını belirler

## 13.3. Sonuç

Yeni teknoloji önerisi varsa:

- önce bu belge ile karar alanı sınıflanır
- sonra dependency policy ile kabul/reddedilme zemini değerlendirilir

---

# 14. Compatibility Matrix ile Zorunlu İlişki

Bu belge `38-version-compatibility-matrix.md` olmadan eksik kalır.

## 14.1. Bu belge ne yapar?

- neyin neden seçileceğini ve neyin kapalı alan olduğunu tanımlar

## 14.2. Compatibility matrix ne yapar?

- hangi sürüm ailelerinin birlikte meşru olduğunu tanımlar
- upgrade ve blocker kombinasyonları görünür kılar

## 14.3. Sonuç

Özellikle çekirdek runtime, testing, styling ve tooling alanında teknoloji kararı compatibility matrix kontrolü olmadan tamamlanmış sayılmaz.

---

# 15. Karar Akışı Şablonu

Yeni bir teknoloji önerisi geldiğinde minimum değerlendirme akışı şu olmalıdır:

1. Problem cümlesi
2. Hangi karar alanına temas ettiği
3. Closed / constrained / operational sınıflaması
4. Mevcut canonical çözüm neden yetmiyor?
5. Alternatiflerin kısa listesi
6. Mimari etkisi
7. Dependency policy değerlendirmesi
8. Compatibility matrix değerlendirmesi
9. POC gerekip gerekmediği
10. ADR gerekip gerekmediği
11. Nihai öneri
12. Kabul edilirse etkilenen belgeler

Bu akış tamamlanmadan “paketi ekledik” denemez.

---

# 16. “Hayır” Demeyi Gerektiren Kırmızı Bayraklar

Aşağıdaki sinyallerden biri varsa öneri varsayılan olarak reddedilmelidir:

1. Problem tanımı bulanık
2. Mevcut canonical çözümün neden yetmediği açıklanamıyor
3. Öneri yalnızca rahatlık veya kişisel tercih gerekçesine dayanıyor
4. Dependency policy’de red flag sınıfında
5. Compatibility matrix ile uyumsuz
6. Mimari sınırları deliyor
7. Design system veya auth/security yüzeyini bozuyor
8. Testability düşürüyor
9. Upgrade/migration maliyeti orantısız
10. “Şimdilik böyle” yaklaşımı içeriyor

---

# 17. Bu Belgeden Sonra Değişen Ana Yorum

Önceki versiyondan farklı olarak artık şu cümle teknik olarak yanlıştır:

> “Bu belge belirli teknolojileri dayatmaz.”

Bu artık tam doğru değildir.

Doğru ifade şudur:

> Bu belge, kapalı canonical teknoloji kararlarını görmezden gelerek yeni seçim yapılmasını engeller; açık kalan teknoloji alanlarında ise nasıl karar alınacağını standartlaştırır.

Yani:

- evet, hâlâ karar yöntemi belgesidir
- ama aynı zamanda artık **karar sınırı** belgesidir

---

# 18. Bu Belgenin Sonraki Dokümanlara Etkisi

## 18.1. `19-roadmap-to-implementation.md`

Artık teknoloji kararı “önce framework seçelim sonra yol çıkar” yaklaşımıyla yazılamaz.  
Roadmap, kapalı karar alanlarını varsayım değil gerçek önkoşul olarak ele almalıdır.

## 18.2. `20-initial-implementation-checklist.md`

Checklist artık teknolojiyi keşfetmek için değil, karar verilmiş stack’i uygulamak için yazılmalıdır.

## 18.3. `21-repo-structure-spec.md`

Repo yapısı artık soyut öneri değil; monorepo/pnpm/turbo ve apps/packages kararı üzerinden somutlaşmalıdır.

## 18.4. `30-contribution-guide.md`

Yeni dependency veya tool öneren kişi, bu belgedeki karar akışını izlemek zorundadır.

## 18.5. `35-document-map.md`

Bu belge artık authority map içinde dependency policy, compatibility matrix ve ADR setiyle birlikte okunmalıdır.

---

# 19. Onay Kriterleri

Bu doküman yeterli kabul edilir eğer:

1. Teknoloji karar alanlarının kapalı / sınırlı / operasyonel ayrımı net yapılmışsa
2. Kapalı canonical karar seti görünür kılınmışsa
3. Yeni teknoloji önerisinin izleyeceği akış açıkça yazılmışsa
4. Dependency policy ve compatibility matrix ile ilişki kurulmuşsa
5. ADR ve POC gerektiren durumlar netleşmişse
6. “Alternatif olabilir” belirsizliği çekirdek alanlarda temizlenmişse
7. Bu belge bundan sonra teknoloji tartışmalarında gerçek yönetim belgesi olarak kullanılabilecek netlikteyse

---

# 20. Kısa Sonuç

Bu dokümanın ana çıktısı şudur:

> Bu boilerplate kapsamında teknoloji seçimi artık serbest araştırma alanı değildir. Çekirdek teknoloji omurgası ADR-001 → ADR-019 ile kapanmıştır; dependency kabul rejimi `37-dependency-policy.md`, sürüm uyum rejimi ise `38-version-compatibility-matrix.md` ile tanımlanmıştır. Bundan sonra yeni teknoloji önerileri ancak problem-fit, mimari uyum, security/a11y/testability, dependency riski ve compatibility güvenliği üzerinden; gerektiğinde ADR ve POC ile değerlendirilecektir.

---

# 26. Pilot / Watchlist Teknolojileri

Aşağıdaki araçlar backlog'da görünse bile otomatik baseline yapılmaz; ADR, POC veya written pilot ister:

- React Compiler (controlled opt-in)
- Biome 2.x (formatter/import/commodity lint pilotu)
- NativeWind 5.x candidate track
- Expo Router (navigation canonical aday, otomatik final karar değil)

Bu sınıftaki araçlar için “ekosistemde güncel” olmak tek başına yeterli kabul edilmez.

---

# 27. Watchlist → Candidate → Canonical Terfi Süreci (2026-04-02 Eki)

Teknoloji yaşam döngüsü yönetimi. Her teknoloji aşağıdaki aşamalardan geçer.

## 27.1. Watchlist (İzleme)

- **Giriş kriteri:** Potansiyel değer sağlayacak teknoloji + aktif geliştirme sürecinde olması.
- **Sorumluluk:** Quarterly (çeyreklik) release notları takibi. Önemli gelişmeler governance toplantısında raporlanır.
- **Çıkış:** Stable release yayımlandığında ve değerlendirme koşulları (Bölüm 38 benzeri checklist) karşılandığında Candidate'e terfi.
- **Güncel örnekler:** Biome 2.x, React Navigation 8.x, @expo/ui (Expo UI), Firebase Remote Config (feature flags için)

## 27.2. Candidate (Aday)

- **Giriş kriteri:** Stable release yayımlanmış + pilot test planı hazırlanmış.
- **Sorumluluk:** 1-2 sprint (2-4 hafta) pilot uygulama. Pilot sırasında production kodu etkilenmez.
- **Çıkış:** Pilot başarılı → Canonical'a terfi. Pilot başarısız → Watchlist'e geri veya Hold'a düşer.
- **Değerlendirme kriterleri:**
  - Performance benchmark (mevcut çözümle karşılaştırma)
  - DX (Developer Experience) feedback (pilot katılımcılardan)
  - Migration efor tahmini (mevcut kodun yeni araca taşınma maliyeti)
  - Compatibility matrix etkisi (diğer canonical paketlerle uyum)
- **Güncel örnekler:** NativeWind 5.x

## 27.3. Canonical (Kanonik)

- **Giriş kriteri:** Pilot başarılı + ADR yazıldı + migration planı hazır.
- **Sorumluluk:** Aktif bakım, güncelleme takibi, doküman güncelliği.
- **Çıkış:** Deprecated → yeni teknoloji Canonical olduğunda eski Deprecated'a düşer.
- **Korunma kuralı:** Canonical statüsündeki teknoloji “Bölüm 5.1 — Closed Canonical Decisions” altındadır ve alternatif teklifi ADR gerektirir.
- **Güncel örnekler:** React 19, Expo SDK 55, Zustand 5, Tailwind CSS 4, Vitest 4, Playwright 1.58, Sentry, i18next 26

## 27.4. Deprecated (Kullanımdan Kaldırılıyor)

- **Giriş kriteri:** Yerine Canonical geçen teknoloji. ADR'de migration deadline tanımlanır.
- **Kurallar:**
  - Yeni kodda kullanımı yasaklanır (lint rule ile enforce edilir).
  - Mevcut kullanımlar migration deadline'a kadar taşınır.
  - Deadline'da tamamen kaldırılır ve dependency listesinden çıkarılır.
- **Migration deadline:** ADR'de belirtilir, genellikle 1-2 çeyrek.

## 27.5. Hold (Askıda)

- **Giriş kriteri:** Değerlendirildi, pilot yapıldı ama reddedildi. Gerekçe ADR veya değerlendirme raporunda kayıt altında.
- **Kurallar:**
  - Proje kapsamında kullanılmaz.
  - Koşullar değişirse (yeni major version, ekosistem değişimi vb.) tekrar Watchlist'e alınabilir.
- **Güncel örnekler:** Redux, MobX, styled-components, Emotion, Detox, Enzyme

## 27.6. Terfi Akış Diyagramı

```
Watchlist ──(stable release + checklist OK)──→ Candidate
Candidate ──(pilot başarılı + ADR)──→ Canonical
Candidate ──(pilot başarısız)──→ Watchlist veya Hold
Canonical ──(yeni teknoloji canonical oldu)──→ Deprecated
Deprecated ──(migration tamamlandı)──→ Kaldırıldı
Hold ──(koşullar değişti)──→ Watchlist
```

---

# 28. Technology Radar Görselleştirmesi (2026-04-02 Eki)

Projedeki tüm teknolojilerin ThoughtWorks Technology Radar formatında kategorilenmesi.

## 28.1. Adopt (Kullan)

Bu kategorideki teknolojiler canonical baseline'dır. Proje genelinde varsayılan olarak kullanılır.

- **Runtime:** React 19, React Native 0.79+, Expo SDK 55, Hermes V1
- **Altyapı:** pnpm 10, Turborepo 2, TypeScript 5.8+, Node.js 22 LTS
- **State / Data:** Zustand 5, TanStack Query 5 (conditional track)
- **Forms:** React Hook Form 7, Zod 4
- **Styling:** Tailwind CSS 4
- **Navigation:** React Router 7 (web), React Navigation 7 (mobile)
- **Testing:** Vitest 4, Jest 30, Testing Library, Playwright 1.58
- **Observability:** Sentry
- **i18n:** i18next 26
- **Component Lab:** Storybook 10
- **IAP:** RevenueCat (react-native-purchases)

## 28.2. Trial (Dene)

Bu kategorideki teknolojiler Candidate statüsündedir. Kontrollü pilot ile kullanılır.

- **NativeWind 5.x:** Mobile styling candidate track. Stable durumu bootstrap öncesi doğrulanmalı, fallback planı yazılmalı.
- **Hermes V1:** RN 0.84 ile varsayılan. Bytecode precompilation ve incremental GC ile performans iyileştirmesi.
- **React Compiler:** Controlled opt-in. Otomatik memoization. Varsayılan açık değil, dosya/modül bazında etkinleştirme.

## 28.3. Assess (Değerlendir)

Bu kategorideki teknolojiler Watchlist'tedir. Araştırılır, quarterly takip edilir.

- **Biome 2.x:** ESLint + Prettier yerine potansiyel. Rust tabanlı, 10-100x hızlı. Pilot prosedürü Bölüm 38'de.
- **React Navigation 8.x:** Gelecek major. API değişiklikleri ve static type checking iyileştirmeleri takip edilir.
- **@expo/ui (Expo UI):** SwiftUI ve Jetpack Compose bileşenlerini React Native'de sunan kütüphane. Mid-2026 stable 1.0 hedefi.
- **Firebase Remote Config:** Feature flag canonical candidate. Stack'te zaten Firebase var.

## 28.4. Hold (Beklet)

Bu kategorideki teknolojiler değerlendirilmiş ve reddedilmiştir. Kullanılmaz.

- **State:** Redux, MobX
- **Styling:** styled-components, Emotion, Tamagui (canonical Tailwind/NativeWind ile çelişir)
- **Testing:** Detox (Playwright tercih), Enzyme (Testing Library tercih)
- **Forms:** Formik (React Hook Form tercih)
- **Navigation:** Expo Router (React Navigation/React Router canonical)

## 28.5. Güncelleme Periyodu

- **Periyodik güncelleme:** Her çeyrek (Q1, Q2, Q3, Q4) veya major Expo SDK release sonrasında.
- **Acil güncelleme:** Canonical teknolojide kritik güvenlik açığı veya EOL duyurusu.
- **Sorumluluk:** Teknik lider veya mimari sorumlusu radar güncellemesini başlatır.
- **Kayıt:** Radar güncellemesi governance/ dizinine tarih bazlı loglanır.

---

# 29. Major Upgrade Playbook (2026-04-02 Eki)

Bu bölüm, canonical stack'teki major versiyon yükseltmelerinin nasıl planlanacağını, yürütüleceğini, test edileceğini, deploy edileceğini ve gerektiğinde geri alınacağını tanımlar. Expo SDK upgrade'i bu playbook'un özelleştirilmiş hali olup detayları `48-expo-sdk-upgrade-strategy.md`'de bulunur.

---

## 29.1. Kapsam

Bu playbook aşağıdaki major upgrade türlerini kapsar:

| Upgrade Türü               | Örnekler                      | Risk Seviyesi                                |
| -------------------------- | ----------------------------- | -------------------------------------------- |
| **React major**            | React 19 → 20                 | Yüksek — tüm component'leri etkiler          |
| **TypeScript major**       | TypeScript 5 → 6              | Yüksek — tüm workspace'leri etkiler          |
| **React Navigation major** | React Navigation 7 → 8        | Orta — mobil navigation yapısını etkiler     |
| **React Native major**     | RN 0.79 → 0.84+               | Yüksek — native layer değişiklikleri         |
| **Monorepo tooling**       | pnpm 10 → 11, Turborepo 2 → 3 | Orta — build/install altyapısını etkiler     |
| **Test framework**         | Vitest 4 → 5, Jest 30 → 31    | Düşük-Orta — test config değişiklikleri      |
| **Styling framework**      | Tailwind CSS 4 → 5            | Orta — token ve utility class değişiklikleri |

**Kapsam dışı:** Expo SDK upgrade (ayrı strateji belgesi mevcut), patch/minor güncellemeler (dependency policy'ye göre otomatik), üçüncü parti kütüphane major upgrade (dependency policy'ye göre değerlendirilir).

---

## 29.2. Genel Major Upgrade Süreci (6 Adım)

### Adım 1 — Impact Analizi

Upgrade başlatılmadan önce kapsamlı etki analizi yapılır.

**Yapılacaklar:**

- Resmi changelog ve migration guide okunur (README değil, resmi docs).
- Breaking change listesi madde madde çıkarılır.
- Deprecated API listesi oluşturulur (mevcut kodda kullanılanlar işaretlenir).
- Dependency cascade analizi: Bu upgrade hangi diğer paketleri doğrudan etkiliyor? Peer dependency uyumsuzluğu oluşuyor mu?
- Etki alanı tahmini: Kaç dosya değişecek? Hangi workspace'ler etkilenecek?
- Community feedback taraması: GitHub issues, Reddit, Twitter/X'te erken kullanıcı raporları.

**Risk Seviyesi Belirleme:**

| Risk Seviyesi | Kriter                                                         | Upgrade Süresi Tahmini |
| ------------- | -------------------------------------------------------------- | ---------------------- |
| **Low**       | API değişikliği yok veya minimal; otomatik codemod mevcut      | 1-2 gün                |
| **Medium**    | Deprecation var; bazı API'ler değişti; codemod kısmen kapsıyor | 3-5 gün                |
| **High**      | Breaking change var; yeni paradigma; codemod kapsamı yetersiz  | 1-2 hafta              |

**Çıktı:** Impact analiz raporu (markdown formatında, PR description'a eklenir).

### Adım 2 — Upgrade Branch Oluşturma

- Branch adı: `upgrade/[paket]-v[versiyon]` (ör. `upgrade/react-19`, `upgrade/typescript-6`, `upgrade/pnpm-11`)
- Bu branch trunk-based development'tan ayrı tutulur (uzun ömürlü branch istisnası — `42-branching-and-merge-strategy.md`'de tanımlı).
- Branch süresi: Maksimum 2 hafta. Süre aşılırsa:
  - Upgrade parçalanabilir mi değerlendirilir (ör. önce deprecation'ları kaldır, sonra major bump).
  - Parçalanamıyorsa tarih ve gerekçe ile branch süre uzatma kaydı açılır.
- Branch oluşturulduğunda `main`'den güncel olarak alınır; upgrade süresince `main`'den periyodik rebase yapılır.
- Upgrade branch'inde diğer feature geliştirmeleri yapılmaz; yalnızca upgrade ile ilgili değişiklikler bulunur.

### Adım 3 — Breaking Change Fix

Migration guide adımları sırayla ve disiplinli biçimde uygulanır.

**Uygulama sırası:**

1. **Codemod çalıştırma:** Resmi codemod varsa önce otomatik dönüşüm yapılır (ör. `npx react-codemod`, `npx @typescript-eslint/utils/migrate`).
2. **Codemod sonrası review:** Otomatik dönüşümlerin doğruluğu manuel kontrol edilir; yanlış dönüşümler düzeltilir.
3. **Deprecated API güncellemeleri:** Mevcut deprecated API kullanımları yeni API'lere güncellenir.
4. **TypeScript tip hataları:** `pnpm typecheck` çalıştırılır; tüm tip hataları çözülür.
5. **Lint hataları:** `pnpm lint` çalıştırılır; yeni lint kuralları veya değişen kurallar ele alınır.
6. **Peer dependency güncellemeleri:** Breaking change'den etkilenen peer dependency'ler uyumlu versiyonlara güncellenir.

**Kurallar:**

- `@ts-ignore` veya `@ts-expect-error` geçici olarak kullanılabilir ama upgrade PR'ı merge edilmeden önce kaldırılmalıdır.
- `eslint-disable` geçici kullanımı exception policy'ye (`44-exception-and-exemption-policy.md`) tabidir.
- Codemod çıktısı commit mesajında belirtilir (ör. "react-codemod uygulandı").

### Adım 4 — Regression Test

Upgrade sonrası kapsamlı test süreci uygulanır.

**Otomatik Test:**

- `pnpm test` — Full test suite (unit + integration) tüm workspace'lerde çalıştırılır.
- `pnpm test:e2e` — Playwright E2E testleri çalıştırılır.
- Test failure → upgrade branch'inde düzeltilir; test skip veya disable yapılmaz.

**Manuel Smoke Test:**
Kritik akışlar manuel olarak doğrulanır:

| Akış                           | Web | Mobile |
| ------------------------------ | --- | ------ |
| Login / Logout                 | ✓   | ✓      |
| Ana sayfa yükleme              | ✓   | ✓      |
| Navigation (tüm tab'lar)       | ✓   | ✓      |
| Form submit (validation dahil) | ✓   | ✓      |
| Ödeme akışı (varsa)            | ✓   | ✓      |
| Deep link açma                 | —   | ✓      |
| Push notification alma         | —   | ✓      |
| Tema değiştirme (light/dark)   | ✓   | ✓      |
| Dil değiştirme                 | ✓   | ✓      |

**Performance Benchmark:**

- Before/after karşılaştırma: Upgrade öncesi ve sonrası aynı test senaryolarında performans ölçümü.
- Ölçülen metrikler: LCP (web), TTI (web), JS bundle size, app startup time (mobile), memory usage.
- Kabul kriteri: %10'dan fazla performans kaybı → root cause analizi gerektirir.

**Visual Regression:**

- Storybook snapshot karşılaştırma: Upgrade öncesi ve sonrası component snapshot'ları diff edilir.
- Beklenmeyen görsel değişiklik → inceleme ve düzeltme gerektirir.

### Adım 5 — Canary Deploy

- Upgrade branch staging/preview ortamında deploy edilir.
- QA team tarafından 1-3 gün süresince test edilir (smoke test + exploratory testing).
- Staging onayından sonra production canary deploy yapılır:
  - İlk aşama: %5 kullanıcıya açılır.
  - Monitoring süresi: 24 saat.
  - Monitör edilen metrikler: Crash rate, ANR rate (Android), error rate (Sentry), API response time.
  - Canary başarı kriteri: Crash rate artışı <%0.5; yeni P0/P1 hata yok.

### Adım 6 — Gradual Rollout

- Canary başarılı → %25 kullanıcıya açılır → 24 saat monitoring.
- %25 başarılı → %100 kullanıcıya açılır.
- Monitoring devam eder: 72 saat boyunca crash rate, error rate, performance metrikleri izlenir.

**Rollback Tetikleyicisi:**

- Crash rate >%1 artış (baseline'a göre).
- P0 bug tespiti (veri kaybı, güvenlik açığı, ödeme hatası).
- ANR rate >%0.5 artış (Android).
- Core Web Vital "Kötü" kategorisine geçiş (web).

---

## 29.3. Teknoloji Bazlı Özel Notlar

### 29.3.1. React Major Upgrade

- **StrictMode ile hazırlık:** Upgrade öncesi `StrictMode` aktif edilir; deprecated API kullanımları konsol uyarılarından tespit edilir.
- **Concurrent features:** `useTransition`, `Suspense` boundary kontrolleri yapılır; concurrent mode ile uyumsuz pattern'ler güncellenir.
- **ReactDOM.render migration:** Eski `ReactDOM.render` kullanımı `createRoot` API'sine güncellenir.
- **Codemod:** `npx react-codemod` çalıştırılır; resmi migration tool kullanılır.
- **Özel risk:** React major upgrade genellikle React DOM, React Native ve ilişkili kütüphanelerin (React Router, React Navigation, Testing Library) uyumluluğunu etkiler; cascade analizi kritiktir.

### 29.3.2. TypeScript Major Upgrade

- **tsconfig.json hedef güncellemesi:** `target`, `lib`, `module`, `moduleResolution` alanları gözden geçirilir.
- **Yeni strict flag'ler:** Major versiyon ile gelen yeni strict flag'ler değerlendirilir ve mümkünse aktif edilir.
- **lib type değişiklikleri:** DOM, ES2024, ES2025 gibi lib type güncellemeleri kontrol edilir; breaking type change'ler ele alınır.
- **Tüm workspace'lerde paralel güncelleme:** pnpm catalogs ile tüm workspace'lerde TypeScript versiyonu eşzamanlı güncellenir; versiyon uyumsuzluğu oluşmaması sağlanır.
- **Özel risk:** TypeScript major upgrade genellikle `@types/*` paketlerinin de güncellenmesini gerektirir; özellikle `@types/react` ve `@types/node` dikkatle kontrol edilir.

### 29.3.3. React Navigation Major Upgrade

- **Navigation API değişiklikleri:** `Screen`, `Navigator`, `NavigationContainer` API farkları kontrol edilir.
- **Deep link config format değişiklikleri:** `linking` config yapısı major versiyonlar arasında değişebilir; `ADR-014` ile uyumluluk doğrulanır.
- **TypeScript tiplendirme:** `ParamList` type tanımları ve `useNavigation<>` generic kullanımları güncellenir.
- **Screen options API farkları:** `headerStyle`, `tabBarStyle` gibi option API'leri major versiyonda değişebilir.
- **Özel risk:** React Navigation major upgrade genellikle `@react-navigation/*` alt paketlerinin hepsinin eşzamanlı güncellenmesini gerektirir.

### 29.3.4. Monorepo Tooling (pnpm / Turborepo) Upgrade

- **pnpm lockfile format değişikliği:** Major pnpm upgrade lockfile formatını değiştirebilir; tüm ekibin aynı pnpm versiyonuna geçmesi gerekir (`packageManager` field ile zorunlu kılınır).
- **Workspace protocol güncellemeleri:** `workspace:*` protokolünde davranış değişikliği kontrol edilir.
- **turbo.json schema değişiklikleri:** Turborepo major versiyonunda `turbo.json` schema'sı değişebilir; pipeline tanımları güncellenir.
- **Remote cache invalidation riski:** Turborepo remote cache major upgrade sonrası geçersiz olabilir; ilk build'lerde cache miss beklenir.
- **Özel risk:** Monorepo tooling upgrade CI pipeline'ını doğrudan etkiler; CI workflow'ları upgrade ile birlikte test edilmelidir.

---

## 29.4. Expo SDK ile İlişki

- Expo SDK upgrade bu playbook'un özel ve genişletilmiş halidir.
- `48-expo-sdk-upgrade-strategy.md` daha detaylı ve Expo-spesifik adımlar içerir.
- Expo SDK upgrade genellikle aşağıdaki cascade upgrade'leri de kapsar:
  - React Native versiyon güncellemesi
  - Hermes engine güncellemesi
  - Metro bundler güncellemesi
  - Expo modülleri (`expo-*` paketleri) güncellemesi
- SDK upgrade'i bu playbook'un Adım 1-6 sürecini takip eder + Expo-spesifik adımlar:
  - `expo-doctor` ile uyumluluk kontrolü
  - `runtimeVersion` policy güncellemesi (OTA update uyumluluğu)
  - `expo install --check` ile dependency uyumluluk doğrulaması
  - EAS Build profil güncellemesi

---

## 29.5. Rollback Stratejisi

Upgrade sonrası ciddi sorun tespit edildiğinde geri alma süreci.

**Rollback Yöntemleri:**

| Yöntem              | Kullanım Durumu                               | Uygulama                                                             |
| ------------------- | --------------------------------------------- | -------------------------------------------------------------------- |
| **Git revert**      | Upgrade PR merge edilmiş, rollback gerekiyor  | `git revert <merge-commit>` ile merge commit geri alınır             |
| **Hotfix branch**   | Spesifik bir breaking change düzeltilebilir   | `hotfix/upgrade-fix-xxx` branch'i ile hızlı düzeltme                 |
| **Version pin**     | Tek bir dependency'nin eski versiyonuna dönüş | `pnpm catalogs` veya `package.json` overrides ile versiyon sabitleme |
| **Canary rollback** | Production canary'de sorun tespit edildi      | Deployment tool üzerinden canary geri alınır (%0'a çekilir)          |

**Rollback Karar Kriterleri:**

- P0 bug tespiti (veri kaybı, güvenlik açığı, ödeme hatası).
- Crash rate artışı (>%1 baseline üstü).
- Performance regresyon (>%20 kötüleşme, kritik metrikte).
- Kullanıcı deneyimini ciddi bozan görsel/fonksiyonel bozulma.

**Rollback Süresi:**

- Karardan uygulamaya: Maksimum 2 saat.
- Rollback commit'i hazırlanır, test edilir ve deploy edilir.
- Rollback sonrası staging ortamında doğrulama yapılır.

**Post-Rollback Süreci:**

1. Root cause analizi yapılır: Neden sorun oluştu? Migration guide'da atlanmış adım var mı?
2. Fix planı oluşturulur: Sorunun çözümü için gerekli adımlar belirlenir.
3. Yeni upgrade denemesi planlanır: Fix uygulandıktan sonra Adım 1'den tekrar başlanır.
4. Rollback kaydı oluşturulur: Tarih, gerekçe, etki ve çözüm planı dokümante edilir.

---

## 29.6. Major Upgrade Anti-Pattern Listesi

Aşağıdaki davranışlar bu repo'da doğrudan zayıf kabul edilir ve kabul edilemezdir:

1. **Major upgrade'i test etmeden main'e merge etmek** — Full test suite ve smoke test geçmeden merge yasaktır.
2. **Breaking change kontrolü yapmadan `pnpm update` çalıştırmak** — Kontrolsüz güncelleme cascade breaking change'e neden olabilir.
3. **Birden fazla major upgrade'i aynı branch'te yapmak** — Her major upgrade izole branch'te yapılır; sorun tespiti ve rollback kolaylığı için.
4. **Upgrade branch'ini 2 haftadan fazla açık bırakmak** — Uzun ömürlü branch main'den koparak merge conflict biriktir; parçalama veya süre uzatma kaydı gerekir.
5. **Migration guide okumadan upgrade başlamak** — "Bump version, build et, bak ne olacak" yaklaşımı kabul edilemez; impact analizi zorunludur.
6. **Codemod çıktısını review etmeden commit etmek** — Otomatik dönüşümler hatalı olabilir; her codemod çıktısı manuel review gerektirir.
7. **`@ts-ignore` ile tip hatalarını upgrade sonrası kalıcı bırakmak** — Geçici kullanım kabul edilir ama merge öncesi tümü kaldırılmalıdır.
8. **Performance benchmark yapmadan upgrade'i tamamlamak** — Performans regresyonu ancak ölçümle tespit edilir; "hissedilir fark yok" yeterli değildir.
9. **Rollback planı olmadan production'a deploy etmek** — Her major upgrade deploy'unda rollback senaryosu hazır olmalıdır.
10. **Upgrade'i tek kişinin bilgisi dahilinde yapmak** — En az iki geliştirici upgrade sürecine dahil olmalıdır; bus factor riski azaltılır.
