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
  - `ADR-001` → `ADR-011`
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
- **State management:** Zustand policy
- **Server-state/data lifecycle:** TanStack Query policy
- **Forms/validation:** React Hook Form + Zod
- **Styling runtime:** Tailwind CSS + NativeWind + semantic token discipline
- **Testing baseline:** Vitest + Jest + Testing Library + Playwright
- **Observability baseline:** Sentry + analytics abstraction-first model
- **Auth/session baseline:** secure cookie-preferred web model + secure storage adapter mobile model
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

## 6.4. Security / i18n kararları

- `ADR-010 — Auth, Session and Secure Storage Baseline`
- `ADR-011 — Internationalization Baseline`

## 6.5. Tamamlayıcı yönetişim belgeleri

- `37-dependency-policy.md`
- `38-version-compatibility-matrix.md`

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
10. Auth/session baseline yönü
11. i18n runtime ana yönü

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

> Bu boilerplate kapsamında teknoloji seçimi artık serbest araştırma alanı değildir. Çekirdek teknoloji omurgası ADR-001 → ADR-012 ile kapanmıştır; dependency kabul rejimi `37-dependency-policy.md`, sürüm uyum rejimi ise `38-version-compatibility-matrix.md` ile tanımlanmıştır. Bundan sonra yeni teknoloji önerileri ancak problem-fit, mimari uyum, security/a11y/testability, dependency riski ve compatibility güvenliği üzerinden; gerektiğinde ADR ve POC ile değerlendirilecektir.
