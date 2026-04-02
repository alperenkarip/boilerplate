# 15-quality-gates-and-ci-rules.md

## Doküman Kimliği

- **Doküman adı:** Quality Gates and CI Rules
- **Dosya adı:** `15-quality-gates-and-ci-rules.md`
- **Doküman türü:** Governance / CI policy / quality gate document
- **Durum:** Accepted
- **Kapsam:** Bu boilerplate kapsamında merge ve release öncesi kalite kapılarını, CI içinde zorunlu çalışması gereken doğrulama katmanlarını, blocker/major/minor ayrımını, baseline ve exception mantığını, kural sertleştirme stratejisini, hızlı geri bildirim ile sıkı kalite dengesi kurallarını ve kalite sinyallerinin nasıl yorumlanacağını tanımlar.
- **Bağlı olduğu üst dokümanlar:**
  - `12-accessibility-standard.md`
  - `13-performance-standard.md`
  - `14-testing-strategy.md`
  - `16-tooling-and-governance.md`
  - `17-technology-decision-framework.md`
- **Doğrudan etkileyeceği dokümanlar:**
  - `20-initial-implementation-checklist.md`
  - `29-release-and-versioning-rules.md`
  - `30-contribution-guide.md`
  - `31-audit-checklist.md`
  - `32-definition-of-done.md`
  - `34-hig-enforcement-strategy.md`

---

# 1. Amaç

Bu dokümanın amacı, kaliteyi kişisel dikkat, reviewer titizliği veya “sorun olursa düzeltiriz” kültürüne bırakmadan; **otomatik, görünür, tutarlı ve denetlenebilir kalite kapıları** ile yöneten resmi sistem kurmaktır.

Bu belge şu sorulara net cevap verir:

1. Bu projede quality gate tam olarak ne demektir?
2. Merge öncesi ve release öncesi hangi kontroller zorunlu olmalıdır?
3. Hangi sinyaller blocker, hangileri major, hangileri minor sayılmalıdır?
4. Typecheck, lint, boundary enforcement, test, build, security hijyeni, a11y/HIG ve release sanity nasıl aynı kalite sistemi içinde birlikte çalışmalıdır?
5. Baseline ve exception kullanımı ne zaman meşrudur, ne zaman kaliteyi çürütür?
6. CI’da hızlı geri bildirim ile yüksek kalite nasıl dengelenmelidir?
7. Kural sertleştirme nasıl yapılmalıdır?
8. Hangi davranışlar doğrudan zayıf ve kabul edilemezdir?

Bu belge belirli bir CI servisinin kullanım kılavuzu değildir.  
Bu belge, **hangi şeylerin resmi kalite kapısı sayılacağını ve bu kapıların nasıl yorumlanacağını** tanımlar.

---

# 2. Neden Bu Doküman Gerekli

Kalite kapısı tanımlanmamış projelerde standartlar genelde yalnızca niyet düzeyinde kalır.

Bunun tipik sonuçları şunlardır:

- type hataları “sonraki PR’da düzeltilir” diye birikmeye başlar,
- lint kuralları ciddiye alınmaz,
- boundary ihlalleri küçük istisnalarla normalleşir,
- kırık testlerle yaşam kültürü oluşur,
- release öncesi neyin gerçekten risk olduğu belirsiz kalır,
- bazı ekip üyeleri çok sıkı, bazıları çok gevşek davranır,
- CI yalnızca formalite olur,
- baseline ve exception’lar kalıcı af mekanizmasına dönüşür,
- quality gates ekip güveni üretmek yerine gürültü üretir.

Bu proje kapsamında quality gate şunun resmi karşılığıdır:

> “Bu değişiklik kalite standardımızı taşıyor mu, taşımıyorsa hangi seviyede sorun var ve bu soruna rağmen merge/release yapılabilir mi?”

Bu soru net değilse kalite standardı fiilen yoktur.

---

# 3. Temel Tez

Bu proje kapsamında temel tez şudur:

> Kalite kapıları, güzel prensipleri zorunlu davranışa çeviren resmi hatlardır; type safety, boundary disiplini, reusable UI standardı, test güveni, güvenlik hijyeni, HIG/a11y uyumu ve release sağlığı ancak görünür ve işletilen gate sistemiyle sürdürülebilir hale gelir.

Bu tez şu sonuçları doğurur:

1. CI yalnızca “çalışıyor mu?” kontrolü değildir.
2. Her warning aynı değildir; severity gerekir.
3. Baseline geçici araçtır, kalıcı af değildir.
4. Exception görünür değilse kural sistemi delinmiş olur.
5. Hızlı teslim baskısı quality gate’leri askıya alma bahanesi olamaz.
6. Rule noise yönetilmezse ekip kural sistemine güvenmez.

---

# 4. Quality Gate Nedir?

## 4.1. Tanım

Quality gate, belirli kalite standartlarını karşılamadan merge veya release ilerlemesini durduran ya da görünür risk sinyali üreten resmi kontrol noktasıdır.

## 4.2. Quality gate ne değildir?

- sadece formatter çalıştırmak
- sadece build alıyor mu diye bakmak
- sadece CI yeşil mi kırmızı mı görmek
- reviewer’ın kafasında tuttuğu kontrol listesi

## 4.3. Kural

Bir alan proje için kritikse, o alan mümkün olduğunca bir gate veya en azından görünür kalite sinyali haline getirilmelidir.

---

# 5. Quality Gate Sisteminin Hedefleri

Bu boilerplate kapsamında quality gate sisteminin hedefleri şunlardır:

## 5.1. Erken yakalama
Hataları merge öncesinde mümkün olduğunca ucuz yakalamak.

## 5.2. Tarafsız standart
Kaliteyi kişiye bağlı olmaktan çıkarmak.

## 5.3. Refactor güveni
Kod değiştiğinde temel kontratların korunup korunmadığını göstermek.

## 5.4. Drift önleme
Mimari, DS, a11y ve security drift’ini küçükken yakalamak.

## 5.5. Release güveni
Prod’a giden değişikliklerin minimum kalite eşiğini taşımasını sağlamak.

## 5.6. Ekip güveni
“CI yeşilse en azından temel sınırlar korunuyor” hissini oluşturmak.

---

# 6. Quality Gate Aileleri

Bu proje kapsamında güçlü minimum quality gate aileleri şunlardır:

1. **Type Safety Gates**
2. **Lint and Static Quality Gates**
3. **Boundary and Dependency Gates**
4. **Testing Gates**
5. **Build and Runtime Sanity Gates**
6. **Security Hygiene Gates**
7. **Accessibility / HIG Related Gates**
8. **Release Sanity and Metadata Gates**
9. **Trend / Budget / Baseline Visibility Gates**

Aşağıda her biri ayrıntılı ele alınmıştır.

---

# 6.1. CI Provider Seçimi

Bu proje **GitHub Actions**'ı canonical CI provider olarak kabul eder. Bu bölüm, neden bu seçimin yapıldığını, alternatif seçeneklerin neden reddedildiğini, workflow organizasyonunu, runner stratejisini, secret yönetimini ve cache politikasını tanımlar.

## 6.1.1. Neden GitHub Actions?

CI provider seçimi şu gerekçelere dayanır:

- **Doğal GitHub entegrasyonu:** Repo zaten GitHub'da barınmaktadır. GitHub Actions, PR event'leri, branch protection, status check ve merge kontrolü ile doğrudan entegre çalışır. Harici bir CI servisi kullanmak ek webhook konfigürasyonu, authentication setup ve ayrı bir dashboard gerektirir; GitHub Actions'ta bunların hiçbiri gerekmez.
- **PR tetiklemeli workflow gücü:** `pull_request`, `push`, `workflow_dispatch`, `schedule` gibi event trigger'lar zengindir. Özellikle PR bazlı gating (CI başarısız → merge engellenir) GitHub branch protection rules ile doğrudan çalışır.
- **Matrix build kolaylığı:** Farklı Node versiyonları, farklı OS'ler veya farklı package'lar için paralel job'lar matrix stratejisi ile kolayca tanımlanır.
- **Marketplace action'lar:** Binlerce hazır action (cache, setup-node, codecov, sentry-release vb.) marketplace'ten kullanılabilir. Custom script yazmak yerine community action'lar ile hızlı kurulum yapılır.
- **Self-hosted runner desteği:** Başlangıçta GitHub-hosted runner yeterlidir; ancak ileride özel ihtiyaçlar ortaya çıkarsa (özel hardware, güvenlik gereksinimleri, maliyet optimizasyonu) self-hosted runner'a geçiş mümkündür.

## 6.1.2. Reddedilen Alternatifler

- **CircleCI:** Güçlü bir CI platformudur ancak GitHub dışında ayrı bir servis olarak ek maliyet getirir. Ücretsiz katmanı sınırlıdır. GitHub Actions zaten repo ile doğal entegre olduğu için ek platform karmaşıklığı gereksizdir.
- **GitLab CI:** GitLab CI yalnızca GitLab repo'larıyla doğal entegre çalışır. Bu proje GitHub'da barındığı için GitLab CI kullanmak repo ve CI platformu arasında yapay bir ayrım yaratır. Mirror veya webhook ile bağlamak gereksiz karmaşıklık ekler.
- **Jenkins:** Çok güçlü ve esnek bir CI aracıdır ancak kurulum, bakım ve hosting overhead'i büyüktür. Jenkins sunucu yönetimi, plugin güncellemeleri ve altyapı bakımı ayrı bir mühendislik çabası gerektirir. Bu proje için gereksiz karmaşıklıktır.

## 6.1.3. Workflow Dosya Organizasyonu

Tüm CI workflow dosyaları `.github/workflows/` dizini altında yaşar. Her workflow belirli bir sorumluluğa sahiptir:

- **`ci.yml`** — PR gates. Her PR açıldığında ve her commit push edildiğinde çalışır. Typecheck, lint, test, build sanity ve diğer PR-level kontrolleri içerir. Bu, merge'in ana kapısıdır.
- **`deploy-web.yml`** — Web deployment. Main merge sonrası staging deploy ve manuel tetikleme ile production promote işlemlerini yönetir.
- **`deploy-mobile.yml`** — Mobile deployment. EAS build tetikleme, preview build oluşturma ve production submit süreçlerini yönetir.
- **`scheduled-audit.yml`** — Periyodik denetim. Cron schedule ile çalışır (örneğin haftada bir). Dependency audit, license check, security scan gibi PR bazlı çalışması gerekmeyen ama düzenli yapılması gereken kontrolleri içerir.

Her workflow tek bir YAML dosyasında, sorumluluğu net şekilde tanımlanmış olarak yaşar. Monolitik tek workflow dosyası kullanılmaz.

> **Not:** Bu bölüm target workflow topology'sini tanımlar. Bu doküman arşivinde yalnızca örnek/başlangıç workflow'larının bir kısmı bulunabilir; `deploy-web.yml` ve `deploy-mobile.yml` gibi dosyalar derived project bootstrap veya sonraki operasyonel fazda eklenir.

## 6.1.4. Runner Stratejisi

- **Varsayılan runner:** GitHub-hosted Linux runner (`ubuntu-latest`). Tüm lint, typecheck, test, web build ve genel CI job'ları Linux runner üzerinde çalışır. Linux runner en ucuz ve en hızlı seçenektir.
- **macOS runner:** Yalnızca iOS native build gerektiren durumlarda kullanılır. macOS runner maliyeti Linux'un yaklaşık 10 katıdır; bu nedenle her PR'da macOS runner çalıştırmak kabul edilmez. macOS runner yalnızca mobile production build veya iOS-specific test suite'leri için kullanılır.
- **Self-hosted runner:** Başlangıçta kullanılmaz. İleride maliyet optimizasyonu veya özel gereksinimler ortaya çıkarsa değerlendirilir.

## 6.1.5. Secret Yönetimi

- **GitHub Environments:** Ortam bazlı secret yönetimi için GitHub Environments kullanılır. `staging` ve `production` ortamları ayrı environment olarak tanımlanır. Her ortamın kendi secret seti vardır (API anahtarları, deploy token'ları, servis hesap bilgileri vb.).
- **Organization-level secrets:** Birden fazla repo'da ortak kullanılan secret'lar (örneğin Sentry auth token, npm token) organization-level secret olarak tanımlanır. Bu sayede aynı secret her repo'da tekrar tanımlanmak zorunda kalmaz.
- **Repository-level secrets:** Yalnızca bu repo'ya özel secret'lar (örneğin Vercel deploy token, EAS token) repository-level olarak tanımlanır.
- **Asla plain text değil:** Secret değerleri workflow dosyalarına, commit geçmişine veya PR comment'lerine asla plain text olarak yazılmaz. Tüm secret erişimi `${{ secrets.SECRET_NAME }}` söz dizimi ile yapılır.

## 6.1.6. Cache Stratejisi

CI hızını artırmak ve gereksiz tekrar indirmeyi önlemek için şu alanlar cache'lenir:

- **pnpm store:** `actions/cache` ile pnpm'in global store dizini cache'lenir. Lock dosyası değişmedikçe dependency'ler yeniden indirilmez. Bu, CI süresini dakikalar düzeyinde kısaltır.
- **Turborepo cache:** Turborepo'nun remote cache özelliği etkinleştirilir. Daha önce build edilmiş package'lar değişmediyse tekrar build edilmez; cache'ten alınır. Bu, monorepo'da özellikle büyük etkilidir.
- **Playwright browser cache:** E2E testleri Playwright ile çalışıyorsa, Playwright browser binary'leri cache'lenir. Her CI çalışmasında browser'ların yeniden indirilmesini önler.

## 6.1.7. Hatalı Yaklaşımlar

- **Monolitik workflow:** Tüm CI adımlarını tek bir dev YAML dosyasında toplamak. Bu dosya zamanla okunamaz, bakılamaz ve debug edilemez hale gelir. Her sorumluluk ayrı workflow dosyasında olmalıdır.
- **macOS runner her PR'da:** Her PR'da macOS runner çalıştırmak. macOS runner pahalıdır ve çoğu PR için gereksizdir. Yalnızca iOS build gerektiren durumlar için ayrılmalıdır.
- **Secret plain text:** Secret değerleri workflow dosyasına, environment variable olarak doğrudan veya log'a yazmak. Bu ciddi güvenlik ihlalidir. Tüm secret'lar GitHub Secrets altyapısı üzerinden yönetilmelidir.
- **Cache kullanmamak:** Her CI çalışmasında tüm dependency'leri sıfırdan indirmek, tüm package'ları sıfırdan build etmek. Bu, CI süresini gereksiz yere uzatır ve geliştirici deneyimini ciddi şekilde bozar.

---

# 7. Type Safety Gates

## 7.1. Neden en temel gate budur?

Type safety bozulduğunda:
- refactor güveni düşer,
- gizli runtime hatalar artar,
- API yüzeyleri bulanıklaşır,
- code review yükü artar.

## 7.2. Kural

Typecheck hataları varsayılan olarak **blocker** kabul edilmelidir.

## 7.3. Hangi alanlar buna girer?

- TypeScript compile errors
- public contract ile uyuşmayan type kırıkları
- invalid import/export type usage
- unsafe inferred any yayılımları (bağlama göre)
- broken generic contracts
- bazı generated type mismatch sorunları

## 7.4. Zayıf davranışlar

- “küçük type hatası, sonra düzeltiriz”
- `@ts-ignore` ile geçici çözümü kalıcı yapmak
- public API type kırığını warning seviyesinde bırakmak

---

# 8. Lint and Static Quality Gates

## 8.1. Neden gereklidir?

Birçok kalite problemi runtime’a kalmadan, AST veya static analiz ile yakalanabilir.

## 8.2. Güçlü gate adayları

- forbidden imports
- hardcoded style/value yasağı
- raw color/token kullanımı
- a11y prop eksikleri
- inline style misuse (proje standardına göre)
- deep import ihlalleri
- unsafe regex/security pattern sinyalleri
- design system bypass pattern’leri
- selected code smell kuralları

## 8.3. Kural

Lint yalnızca biçim kontrolü değil, kalite kontratı taşımalıdır.

## 8.4. Noise riski

Lint kuralları fazla gürültü üretirse ekip iki kötü yoldan birine gider:
- kural kapatma
- warning görmeme

Bu yüzden lint kuralları:
- net problem çözmeli,
- açıklayıcı mesaj vermeli,
- düşük yanlış pozitif üretmelidir.

---

# 9. Boundary and Dependency Gates

## 9.1. Neden kritik?

Mimariyi en hızlı bozan şeylerden biri boundary ihlalleridir.

## 9.2. Ne yakalanmalıdır?

- deep import
- feature-to-feature internal access
- package private path usage
- domain → UI dependency
- app → package internals
- shared package → app internal dependency
- forbidden cross-layer imports

## 9.3. Kural

Boundary ihlalleri “küçük refactor kolaylığı” bahanesiyle geçmemelidir.

## 9.4. Severity yorumu

- core mimari sınır kırığı → çoğu zaman blocker
- daha sınırlı ama sistemik olmayan ihlal → major olabilir
- eski baseline alanında görünür teknik borç → şartlı yönetilebilir, ama yeni ihlal olarak kabul edilmez

---

# 10. Testing Gates

## 10.1. Neden testing gate gerekir?

Çünkü test stratejisi dokümanda kalırsa gerçek etkisi sınırlı olur.

## 10.2. Hangi tür testler gate adayıdır?

- unit tests (relevant suites)
- component tests
- integration tests
- selected E2E suites
- smoke flows
- a11y-related automated checks
- visual regression checks (bağlama göre)

## 10.3. Kural

Her PR tüm evreni çalıştırmak zorunda olmayabilir.  
Ama değişikliğin risk profiline göre ilgili ve gerekli test katmanları resmi gate olmalıdır.

## 10.4. Zayıf davranışlar

- kritik integration suite’i opsiyonel görmek
- flaky test olduğu için suite’i tamamen kapatmak
- “CI uzun sürüyor” diye anlamlı testleri çıkarmak
- test selection mantığını görünmez bırakmak

---

# 11. Build and Runtime Sanity Gates

## 11.1. Neden ayrı düşünülmeli?

Type ve lint geçse bile gerçek app/runtime wiring kırık olabilir.

## 11.2. Neleri kapsar?

- target build sanity
- basic bundling sanity
- selected startup checks
- environment resolution sanity
- route/app entry integrity
- package export correctness
- broken config wiring detection

## 11.3. Kural

“Type geçti” build’in güvenli olduğu anlamına gelmez.  
Özellikle cross-platform yapılarda build sanity ayrı gate olarak düşünülmelidir.

## 11.4. Zayıf davranışlar

- web build var ama mobile boot kırık
- config wiring bozuk ama typecheck temiz
- release branch’e build sanity olmadan merge

---

# 12. Security Hygiene Gates

## 12.1. Neden gate konusu?

Security hijyeni yalnızca doküman tavsiyesi olarak bırakılırsa kolayca delinmeye başlar.

## 12.2. Güçlü adaylar

- secret leak detection
- committed env/private file detection
- selected dangerous logging pattern checks
- obviously unsafe config usage
- forbidden sensitive files in repo
- release env mismatch sanity checks

## 12.3. Kural

Security gates tam güvenlik çözümü değildir.  
Ama temel hijyen için zorunlu ilk savunma hattıdır.

## 12.4. Zayıf davranışlar

- secret sızıntısını “test key’di” diye küçümsemek
- leak detection’ı false positive bahanesiyle kapatmak
- logging hygiene ihlallerini opsiyonel görmek

---

# 13. Accessibility / HIG Related Gates

## 13.1. Neden quality gate içine girmelidir?

A11y ve HIG ihlalleri “küçük UI detayları” değildir.  
Bir kısmı doğrudan kullanıcıyı engeller.

## 13.2. Güçlü adaylar

- interactive element accessibility metadata checks
- missing labels/roles/state exposure rules
- minimum touch target pattern checks
- reduced-motion related static checks
- safe area misuse candidate checks
- direct DS bypass imports
- selected contrast / state visibility diagnostics (bağlama göre)

## 13.3. Kural

A11y/HIG kritik ihlalleri yalnızca manual review’a bırakılmamalıdır.

## 13.4. Zayıf davranışlar

- unlabeled icon buttons’ı warning bırakmak
- touch target sorunlarını “tasarım kararı” diye görmezden gelmek
- HIG kurallarını yalnızca final audit’e bırakmak

---

# 14. Release Sanity and Metadata Gates

## 14.1. Ne zaman gerekir?

Özellikle release branch, candidate build veya production promotion öncesinde.

## 14.2. Neleri kapsar?

- version metadata consistency
- environment correctness
- release note / changelog readiness checks
- build channel sanity
- critical observability metadata presence
- selected migration note presence (gerektiğinde)

## 14.3. Kural

Release etkisi olan değişiklikler için “kod merge oldu, yeter” yaklaşımı kabul edilmez.

---

# 15. Trend / Budget / Baseline Visibility Gates

## 15.1. Neden gerekir?

Bazı alanlar bir anda sıfırlanmaz.  
Ama kötüleşme görünmez bırakılırsa kalite yavaş yavaş çöker.

## 15.2. Güçlü adaylar

- baseline count trend
- exemption budget trend
- repeated rule-family failures
- flaky test trend
- HIG score trend
- lint debt trend
- warning budget

## 15.3. Kural

Trend gate’ler her zaman blocker olmayabilir.  
Ama görünürlük sağlamalı ve kötüleşmeyi sessiz bırakmamalıdır.

---

# 16. Severity Modeli

Quality gate sistemi severity olmadan anlamsızlaşır.  
Bu proje kapsamında temel severity modeli şu şekildedir:

1. **Blocker**
2. **Major**
3. **Minor**
4. **Informational**

---

# 17. Blocker Nedir?

## 17.1. Tanım

Merge veya release’i varsayılan olarak durdurması gereken ihlaldir.

## 17.2. Güçlü blocker örnekleri

- typecheck failure
- broken build
- severe boundary break
- critical security hygiene leak
- critical a11y/HIG violation
- selected critical test failure
- app startup broken
- package export contract kırığı
- merge ile garanti regresyon riski doğuran hatalar

## 17.3. Kural

Blocker için “şimdilik geçsin” istisnası çok nadir ve görünür olmalıdır.

---

# 18. Major Nedir?

## 18.1. Tanım

Kaliteyi ciddi düşüren, kısa vadede çözülmesi gereken ama her zaman anında merge/release blocker olmak zorunda olmayan ihlaldir.

## 18.2. Güçlü major örnekleri

- design system bypass pattern
- state visibility eksikleri
- önemli ama tam bloklamayan a11y kusurları
- noise üretmeyen ama gerçek boundary riskleri
- kritik olmayan ama anlamlı integration test eksikliği
- repeated warning family expansion
- stale baseline borcunun büyümesi

## 18.3. Kural

Major ihlal görünmez bırakılmaz.  
Takip ve çözüm planı gerekir.

---

# 19. Minor Nedir?

## 19.1. Tanım

Kaliteyi düşüren ama kısa vadede tüm süreci durdurmayan daha sınırlı sorundur.

## 19.2. Örnekler

- küçük naming düzensizlikleri
- local cleanup ihtiyacı
- düşük etkili lint/style standardı sapmaları
- minor visual inconsistency sinyalleri
- düşük riskli test eksikleri

## 19.3. Kural

Minor’lar toplu birikirse major kalite borcuna dönüşebilir.  
Bu yüzden tamamen önemsiz sayılmaz.

---

# 20. Informational Nedir?

## 20.1. Tanım

Doğrudan aksiyon gerektirmeyebilir ama gözlem ve trend yönetimi için değerlidir.

## 20.2. Örnekler

- gelecekte sertleştirilmesi gereken kural sinyali
- team education ihtiyacı
- recurring but not yet formalized pattern
- low confidence anomaly notes

---

# 21. Severity Nasıl Belirlenir?

Bir ihlalin severity’si şu sorularla düşünülmelidir:

1. Kullanıcı etkisi ne?
2. Mimari drift riski ne?
3. Güvenlik veya veri riski var mı?
4. Refactor maliyetini ne kadar artırır?
5. Aynı pattern tekrar ederse hasar büyür mü?
6. Otomatik çözümü/önlenmesi kolay mı?
7. Release güvenini doğrudan bozar mı?

---

# 22. Baseline Nedir?

## 22.1. Tanım

Mevcut birikmiş kalite borcu nedeniyle yeni kuralı bir anda tüm repo için blocker yapamıyorsak, eski ihlalleri görünür tutup yeni ihlalleri engelleyen geçici referans setidir.

## 22.2. Neden gerekebilir?

- büyük legacy borç
- rule family ilk kez ekleniyorsa
- kuralın tüm repoda temizlenmesi zamana yayılacaksa

## 22.3. En kritik kural

Baseline:
- **geçici araçtır**
- **yeni ihlalleri yutmamalıdır**
- **borcu görünmezleştirmemelidir**
- **temizlik planı ile yaşamalıdır**

---

# 23. Baseline Nasıl Yanlış Kullanılır?

Aşağıdaki davranışlar baseline’ı kalite aracından af mekanizmasına çevirir:

1. baseline’ı hiç küçültmemek
2. yeni ihlalleri de baseline içine sessizce eklemek
3. baseline trendini takip etmemek
4. hangi kural ailesinde borç olduğunu görünmez bırakmak
5. baseline varken kuralı ciddiye almamak

---

# 24. Exception Nedir?

## 24.1. Tanım

Belirli bir kuralın, belirli bir dosya/alan için bilinçli ve gerekçeli biçimde geçici veya istisnai olarak devre dışı bırakılmasıdır.

## 24.2. Ne zaman meşru olabilir?

- gerçek platform kısıtı varsa
- 3rd-party entegrasyon yüzünden kaçınılmaz sınır varsa
- migration sürecinde kısa dönemli köprü gerekiyorsa
- kuralın o noktada yanlış pozitif verdiği teknik olarak netse

## 24.3. Ne zaman meşru değildir?

- “uğraşmak istemedik”
- “küçük şey”
- “sonra bakarız”
- “zaten çalışıyor”
- “PR gecikmesin”

---

# 25. Exception Kaydında Ne Olmalı?

Her exception görünür olmalı ve en az şunları içermelidir:

- kural ID
- etkilenen dosya/alan
- kısa gerekçe
- risk açıklaması
- geçici mi kalıcı mı
- kapanış koşulu veya hedefi
- takip referansı (issue/ADR/not)
- onay bağlamı

Sessiz exception kabul edilmez.

---

# 26. Warning Budget / Exemption Budget Mantığı

## 26.1. Neden budget gerekir?

Çünkü istisnalar ve warning’ler sınırsız olursa kalite sistemi delinmiş olur.

## 26.2. Budget neyi sağlar?

- görünür sayım
- trend takibi
- kötüleşmeyi fark etme
- hangi ekip/alan sürekli exception üretiyor görme

## 26.3. Kural

Budget sabit dogma olmak zorunda değildir.  
Ama kontrolsüz warning/exemption artışı kabul edilmez.

---

# 27. CI Hız vs Kalite Dengesi

## 27.1. Gerçek problem

Aşırı yavaş CI geliştirici deneyimini öldürür.  
Aşırı gevşek CI kaliteyi öldürür.

## 27.2. Doğru yaklaşım

- hızlı local feedback
- katmanlı CI
- ilgili test suite selection
- merge öncesi zorunlu çekirdek gates
- release öncesi daha geniş doğrulama

## 27.3. Kural

“CI hızlı olsun” diye kritik gate’i kaldırmak yanlış.  
“Her şeyi her PR’da koşturalım” diye sistemi verimsiz hale getirmek de yanlış.

---

# 28. Katmanlı CI Mantığı

Güçlü varsayılan model şu olabilir:

## 28.1. Local hızlı kontroller
- lint
- typecheck
- relevant tests
- selected formatting/sanity checks

## 28.2. PR çekirdek gates
- typecheck
- lint
- boundary rules
- relevant tests
- selected security/a11y rules
- build sanity

## 28.3. Release candidate gates
- broader integration/E2E
- release metadata sanity
- selected HIG/audit signals
- observability readiness
- migration/changelog checks (gerektiğinde)

Bu model, kaliteyi aşamalı güçlendirir.

---

# 28.4. Deployment Pipeline Tanımı

Bu proje kapsamında bir değişikliğin geliştirici makinesinden production ortamına ulaşma süreci net aşamalarla tanımlanmalıdır. Pipeline'ın her aşaması belirli sorumluluklar taşır ve bir önceki aşamayı başarıyla geçmeye bağlıdır.

## 28.4.1. Pipeline Aşamaları

### Aşama 1 — Local (Geliştirici Makinesi)

Geliştirici kendi makinesinde kod yazmayı bitirdiğinde, push'tan önce temel kalite kontrollerini local olarak çalıştırmalıdır. Bu aşama tam CI yerine geçmez; ama CI'da hata görmeyi beklemek yerine hızlı geri bildirim sağlar.

- **Pre-commit hook:** `lint-staged` çalışır. Yalnızca staged dosyalar üzerinde lint ve format kontrolü yapılır. Tüm repo taranmaz; bu hook'un amacı commit'e giren dosyaların temel standartları karşılamasını sağlamaktır.
- **Pre-push hook:** `typecheck` çalışır. Push yapılmadan önce TypeScript derlemesinin kırık olmadığı doğrulanır. Typecheck tüm projede çalışır çünkü tip hataları dosya bazlı değil, proje bazlı kontrol gerektirir.
- **Manuel çalıştırma:** Geliştirici isteğe bağlı olarak ilgili test suite'lerini, boundary check'leri veya build sanity komutlarını local'de çalıştırabilir.

### Aşama 2 — PR CI (Pull Request Açıldığında)

PR açıldığında veya PR'a yeni commit push edildiğinde CI otomatik tetiklenir. Bu aşama merge'in resmi kapısıdır.

**Blocker kontroller (başarısız olursa merge engellenmelidir):**
- **TypeScript typecheck:** Tüm workspace'te `tsc --noEmit` çalışır. Herhangi bir tip hatası varsa PR merge edilemez.
- **ESLint:** Tüm workspace'te lint çalışır. Kural ihlali varsa PR merge edilemez.
- **Test:** İlgili test suite'leri çalışır. Kırık test varsa PR merge edilemez.
- **Build sanity:** En azından web build'in başarılı tamamlandığı doğrulanır. Build kırıksa PR merge edilemez.

**Warning kontroller (başarısız olursa merge engellenmez ama görünür sinyal üretilir):**
- **Bundle size:** Değişikliğin bundle boyutunu belirli bir eşiğin üzerinde artırıp artırmadığı kontrol edilir. Eşik aşılırsa PR'da uyarı comment'i bırakılır.
- **Accessibility lint:** Statik a11y kuralları çalışır. İhlal varsa PR'da uyarı olarak gösterilir.
- **Boundary check:** Mimari sınır ihlalleri kontrol edilir. İhlal varsa PR'da uyarı olarak gösterilir.

### Aşama 3 — PR Review

CI kontrolleri geçtikten sonra insan review süreci başlar.

- En az **1 reviewer** onayı zorunludur.
- Reviewer, `30-contribution-guide.md` belgesinde tanımlanan review kriterlerine göre değerlendirme yapar.
- CI başarısız iken review onayı verilse bile merge engellenir; CI ve review birlikte geçmelidir.

### Aşama 4 — PR Merge

Review ve CI onaylandıktan sonra merge gerçekleşir.

- **Squash merge** varsayılan stratejidir. Her PR tek bir commit olarak ana dala girer. Bu, commit geçmişini temiz tutar.
- Merge sonrası CI tekrar çalışır (post-merge validation). Bu, merge sırasında oluşabilecek conflict kaynaklı kırıkları yakalar.

### Aşama 5 — Staging Deploy

Main branch'e merge edilen değişiklik otomatik olarak staging ortamına deploy edilir.

- **Web:** Vercel staging ortamına otomatik deploy. Her main merge sonrası Vercel yeni bir staging deployment oluşturur.
- **Mobile:** EAS preview build opsiyoneldir. Her merge sonrası zorunlu değildir; gerektiğinde manuel tetiklenir veya belirli label/tag ile otomatik tetiklenebilir.

### Aşama 6 — QA (Quality Assurance)

Staging ortamında deploy edilen değişiklik test edilir.

- **Manuel test:** QA ekibi veya geliştirici staging'de değişikliği doğrular.
- **Otomatik test:** Staging'e karşı E2E test suite'leri çalıştırılabilir. Smoke test'ler kritik akışları doğrular.
- Bu aşama her küçük değişiklik için tam QA döngüsü anlamına gelmez; değişikliğin risk profiline göre QA kapsamı belirlenir.

### Aşama 7 — Production Deploy

Staging'de doğrulanan değişiklik production'a promote edilir.

- **Web:** Manuel tetikleme ile veya release tag oluşturularak production'a promote edilir. Vercel'de staging deployment'ı production'a promote etmek tek bir adımdır.
- **Mobile:** EAS production build tetiklenir ve app store submit süreci başlatılır. Mobile deploy web'e göre doğası gereği daha yavaştır çünkü app store review süreci vardır.
- Production deploy asla "merge oldu, otomatik canlıya gitti" şeklinde olmamalıdır. Manuel onay veya bilinçli tag/trigger zorunludur.

### Aşama 8 — Post-Deploy Monitoring

Production deploy sonrası ilk 15 dakika kritik gözlem penceresidir.

- **Sentry spike kontrolü:** Deploy sonrası 15 dakika boyunca Sentry'de error spike olup olmadığı izlenir. Ani artış varsa rollback değerlendirilir.
- **Core Web Vitals:** Web deploy sonrası CWV metriklerinde regresyon olup olmadığı kontrol edilir.
- **Rollback hazırlığı:** Her deploy öncesi rollback planı hazır olmalıdır. "Sorun çıkarsa ne yapacağız?" sorusu deploy tetiklenmeden önce cevaplanmış olmalıdır.

## 28.4.2. Hız Hedefleri

Pipeline'ın her aşaması için hedef süreler şunlardır:

- **PR CI:** 5 dakikadan kısa olmalıdır. Bu süre aşılırsa geliştirici deneyimi ciddi şekilde bozulur; PR açıp sonucu beklemek yerine bağlam değiştirmek zorunda kalır.
- **Staging deploy (web):** 3 dakikadan kısa olmalıdır. Main merge sonrası staging'de hızla görünür olması hızlı doğrulama sağlar.
- **Production deploy (web):** 10 dakikadan kısa olmalıdır. Manuel tetikleme sonrası hızlı promote gerekir.
- **Production deploy (mobile build):** 30 dakikadan kısa olmalıdır. Mobile build doğası gereği daha yavaştır; EAS build süresi bu hedefe dahildir ama app store review süresi dahil değildir.

## 28.4.3. Rollback Stratejisi

Her ortam için rollback planı önceden tanımlı olmalıdır:

- **Web:** Vercel'de önceki başarılı deployment'a revert edilir. Bu işlem saniyeler içinde gerçekleşir. Vercel her deployment'ı immutable tutar; bu nedenle eski versiyona dönmek yeni bir build gerektirmez.
- **Mobile:** İki seçenek vardır. Birincisi, OTA (Over-the-Air) rollback; eğer değişiklik OTA uyumluysa (yalnızca JS bundle değişikliği), EAS Update ile önceki bundle'a dönülebilir. İkincisi, hızlı yeni build; eğer native değişiklik varsa, fix içeren yeni bir build çıkılır ve submit edilir.

## 28.4.4. Monitoring Entegrasyonu

Her deployment'ta observability araçları doğru şekilde bağlanmalıdır:

- **Sentry release:** Her deploy bir Sentry release oluşturmalıdır. Bu sayede hatalar hangi deploy'da ortaya çıktığı ile ilişkilendirilebilir.
- **Source maps yükleme:** Her web deploy'da source map'ler Sentry'ye yüklenir. Bu sayede production hata raporları okunabilir stack trace'ler içerir, minified kod değil.

## 28.4.5. Hatalı Yaklaşımlar

- **CI'ı atlamak:** "Acil fix" bahanesiyle CI'sız merge yapmak. Acil fix de CI'dan geçmelidir; CI 5 dakikadan kısa tutulduğunda bu bahane geçersiz olur.
- **Staging skip:** Doğrudan production'a deploy etmek. Staging aşaması atlanan değişiklik production'da sürpriz yapma riski taşır.
- **Rollback planı olmadan deploy:** "Sorun çıkmaz" varsayımıyla deploy etmek. Her deploy'da rollback planı hazır olmalıdır.
- **Post-deploy monitoring yapmamak:** Deploy sonrası Sentry ve metrikleri kontrol etmemek. 15 dakikalık gözlem penceresi disiplin gerektirir.

---

# 29. Rule Tightening Strategy

## 29.1. Neden gerekir?

Her kural ilk gün blocker yapılmaz.  
Bazı kurallar ekip olgunluğu ve baseline temizliğiyle sertleşir.

## 29.2. Aşamalar

1. sinyal toplama
2. informational/warning dönemi
3. baseline oluşturma
4. yeni ihlalleri engelleme
5. major gate
6. blocker gate

## 29.3. Kural

Sertleşme planı görünür olmalıdır.  
Aksi halde kurallar ya hiç ciddiye alınmaz ya da aniden ekipte direnç üretir.

---

# 30. Rule Noise Problemi

## 30.1. Noise nedir?

Gerçek değer üretmeyen, çok fazla yanlış pozitif veren, geliştiriciyi körleştiren sinyal kalabalığıdır.

## 30.2. Noise neden tehlikelidir?

Çünkü ekip şu reflekslere gider:
- warning’leri görmemek
- global disable
- exception yığmak
- CI’yı düşman görmek

## 30.3. Kural

Her gate ailesi için şu soru sorulmalıdır:
“Bu kural gerçekten problem çözüyor mu, yoksa yalnızca hareket yaratıyor mu?”

---

# 31. Gating için Güçlü Kural Adayları

Bu boilerplate kapsamında güçlü aday aileler:

- no hardcoded style values
- no raw color/token use
- no deep imports
- no boundary violations
- required accessibility props on interactive elements
- selected security log/payload checks
- no forbidden platform component bypasses
- reduced-motion guard requirements
- safe area expectations at root patterns
- selected build/env consistency checks

Bu liste proje olgunlaştıkça genişleyebilir.  
Ama kural kalitesi noise kalitesinden yüksek olmalıdır.

---

# 32. Merge Gate ile Release Gate Aynı Şey Değildir

## 32.1. Merge gate
Kodun ana dala girmeden önce temel kalite eşiğini geçmesi.

## 32.2. Release gate
Kodun üretime gitmeden önce daha yüksek güven düzeyi sağlaması.

## 32.3. Kural

Her merge release-ready olmak zorunda olmayabilir.  
Ama release adayları daha ağır kontrollerden geçmelidir.

## 32.4. Yanlış yaklaşım

- merge geçtiyse release otomatik güvenli sanmak
- release için ekstra doğrulamayı gereksiz görmek

---

# 33. Quality Gate’ler ve Review İlişkisi

## 33.1. Kural

CI ve quality gate’ler review’ın yerini almaz.  
Ama review’ın omzundaki mekanik yükü azaltır.

## 33.2. Review neye odaklanmalı?

- mimari yön
- API sadeliği
- görsel kalite
- parity etkisi
- audit gereksinimi
- rule’ların yakalayamadığı bağlamsal riskler

## 33.3. Zayıf davranışlar

- reviewer’ın lint/type/boundary kırıklarını elle avlamasını beklemek
- CI kırığını review comment ile çözmeye çalışmak

---

# 34. Quality Gate’ler ve Definition of Done İlişkisi

DoD ile gate sistemi doğrudan bağlıdır.

## 34.1. Gate neyi söyler?
Temel resmi kalite eşiği geçildi mi?

## 34.2. DoD neyi söyler?
Bu iş bağlamına uygun tamamlanma koşullarını sağladı mı?

## 34.3. Kural

Gate geçen her iş otomatik done değildir.  
Ama gate geçmeyen işin done sayılması varsayılan olarak yanlıştır.

---

# 35. Quality Gate İhlali Görülünce Ne Yapılmalı?

İhlal olduğunda şu sıra izlenmelidir:

1. Bu gerçek ihlal mi, false positive mi?
2. Severity ne?
3. Baseline/exception konusu mu?
4. Kural mı geliştirilmeli, kod mu düzeltilmeli?
5. Bu tekil mi, trend mi?
6. Aynı family için daha iyi DS/tooling çözümü var mı?

Hemen disable atmak doğru refleks değildir.

---

# 36. Quality Gates Anti-Pattern Listesi

Aşağıdaki davranışlar bu proje kapsamında zayıf kabul edilir:

1. Yalnızca formatter çalıştırıp quality gate var sanmak
2. Typecheck’i blocker yapmamak
3. Boundary ihlallerini “geçici” diye normalleştirmek
4. Baseline’ı kalıcı af sistemine çevirmek
5. Exception’ları kayıtsız kullanmak
6. CI kırıklarıyla yaşamayı normal görmek
7. Warning/major/blocker ayrımı yapmamak
8. Gürültülü kural sistemini sürdürmek
9. Kritik testleri “çok yavaş” diye tamamen kaldırmak
10. Security ve a11y’yi sadece manuel review’a bırakmak
11. Merge gate ile release gate’i aynı şey saymak
12. Rule tightening planı olmadan kural ailesi eklemek
13. Same-error / same-warning tekrarını trend olarak izlememek
14. CI’yı ekip güveni değil ekip engeli haline getirmek
15. Quality gate sonuçlarını belge ve audit sistemiyle ilişkilendirmemek

---

# 37. Quality Gate Kararı Verirken Sorulacak Sorular

Bir kuralı gate yapmadan veya severity atamadan önce şu sorular sorulmalıdır:

1. Bu kural hangi kalite riskini azaltıyor?
2. Kullanıcı etkisi var mı?
3. Mimari drift riski var mı?
4. Noise seviyesi kabul edilebilir mi?
5. False positive durumunda nasıl yönetilecek?
6. Yeni ihlalleri engellemek için baseline gerekir mi?
7. Bu merge blocker mı, release blocker mı?
8. Kural geliştiriciyi doğru yöne itiyor mu?
9. Aynı problemi DS/tooling düzeyinde daha iyi çözebilir miyiz?
10. Bu kural trend halinde mi izlenmeli?

---

# 38. Sonraki Dokümanlara Etkisi

## 38.1. Initial implementation checklist
`20-initial-implementation-checklist.md`, ilk repo kurulumunda hangi quality gate’lerin önce ayağa kaldırılacağını bu belgeye göre sıralamalıdır.

## 38.2. Release and versioning rules
`29-release-and-versioning-rules.md`, merge gate ile release gate ayrımını bu belgeye göre işletmelidir.

## 38.3. Contribution guide
`30-contribution-guide.md`, contributor’ın PR öncesi local verify yükümlülüğünü bu belgeye göre tanımlamalıdır.

## 38.4. Audit checklist
`31-audit-checklist.md`, quality gate sisteminin kendisini de periyodik audit konusu olarak bu belgeye göre denetlemelidir.

## 38.5. Definition of done
`32-definition-of-done.md`, gate pass/fail durumunu tamamlanma kararına bağlarken bu belgeyi referans almalıdır.

## 38.6. HIG enforcement strategy
`34-hig-enforcement-strategy.md`, HIG kurallarının hangi bölümünün lint/runtime/CI gate olacağını bu belgeyle birlikte çalıştırmalıdır.

---

# 39. AI Üretimli Kod İçin Quality Gate Kuralları

AI araçlarının (Claude Code, MoAI-ADK, Codex, Stitch) ürettiği kod, insan yazımı kodla birebir aynı quality gate’lerden geçer. Kaynak ayrımı yapılmaz.

## 39.1. Bypass yasağı

Aşağıdaki bypass’lar AI aracı tarafından yapılsa dahi kabul edilmez:

- `--no-verify` ile commit
- `eslint-disable` ile lint suppress
- `@ts-ignore` ile type bypass
- test skip (`it.skip`, `describe.skip`)
- `any` type kullanımı

## 39.2. MoAI-ADK TRUST 5 uyumu

MoAI-ADK’nın TRUST 5 pre-submission quality gate’i (test, okunabilirlik, güvenlik, izlenebilirlik kontrolü) bu projenin CI gate’leriyle tutarlı çalışmalıdır.

## 39.3. CI’da AI-spesifik kontroller

- Codex GitHub Action: PR açıldığında otomatik review (CI step olarak)
- Talimat dosyası tutarlılık kontrolü: CLAUDE.md’deki canonical kararlar listesi ADR dosya adlarıyla karşılaştırma
- Token doğrulaması: DESIGN.md → packages/design-tokens/ tutarlılık kontrolü

Detaylar: `40-ai-workflow-and-tooling.md` ve `16-tooling-and-governance.md` bölüm 37.

---

# 40. Onay Kriterleri

Bu doküman yeterli kabul edilir eğer:

1. Quality gate kavramı net tanımlanmışsa,
2. Zorunlu gate aileleri ayrılmışsa,
3. type/lint/boundary/test/build/security/a11y-release gate mantığı görünür kılınmışsa,
4. blocker/major/minor/info severity modeli açıklanmışsa,
5. baseline ve exception kuralları operasyonel biçimde yazılmışsa,
6. hız/kalite dengesi ve katmanlı CI mantığı tanımlanmışsa,
7. anti-pattern’ler net biçimde yazılmışsa,
8. sonraki contribution, release, audit, DoD ve HIG enforcement belgelerine uygulanabilir temel sağlanmışsa,
9. AI üretimli kod için quality gate kuralları tanımlanmışsa ve bypass yasağı açıkça belirtilmişse.

---

# 41. AI Guardrail CI Gate

AI araçlarının ürettiği kodun guardrail uyumu, kalite kapısı sistemine entegre edilmiştir (`47-ai-guardrail-governance.md`).

## 41.1. CI'da Denetlenecek Guardrail Alanları

| Alan | Kontrol | Severity |
|---|---|---|
| Universal guardrail ihlalleri | Hardcoded değer, any type, import yönü | Blocker/Major |
| Canonical stack uyumu | Stack dışı dependency | Blocker |
| A11y minimum | WCAG AA uyumu | Blocker |
| Security baseline | Secret exposure, güvensiz token saklama | Blocker |
| Test coverage | Yeni modül için test varlığı | Major |
| Boundary uyumu | Modül sınırı, dosya organizasyonu | Blocker |

## 41.2. Kural

Mevcut CI gate'lerine (typecheck, lint, test, build, security) ek olarak guardrail uyumu da merge öncesi kalite kapısıdır. Guardrail ihlali blocker seviyesinde ise PR merge edilmez.

Guardrail CI kontrolü, Codex review ile tamamlanır (`40-ai-workflow-and-tooling.md` §6.2).

---

# 42. Kısa Sonuç

Bu dokümanın ana çıktısı şudur:

> Bu boilerplate kapsamında quality gate sistemi, type safety, lint/static kalite, boundary disiplini, test güveni, build sanity, security hijyeni ve selected a11y/HIG kurallarını resmi merge ve release kapılarına bağlayan; baseline ve exception’ları görünür yöneten; hız ile kaliteyi katmanlı CI mantığıyla dengeleyen operasyonel kalite omurgasıdır.

---

# 43. Build Otomasyonu ve Store Deployment (2026-04-01 Eki)

Bu bölüm, EAS Build konfigürasyonunu, Fastlane entegrasyonunu, code signing yönetimini, CI/CD workflow şablonlarını, preview deployment sürecini ve store metadata otomasyon kurallarını tanımlar.

## 43.1. EAS Build Konfigürasyonu

- Build profilleri üç katmanda tanımlanmalıdır:
  - **Development:** Debug mode aktif, dev client kullanılır. Geliştirici cihazlarında hızlı iterasyon sağlar.
  - **Preview:** Internal distribution için üretilir. QA ve test grubu tarafından kullanılır.
  - **Production:** Store-ready build. Optimizasyon ve code signing uygulanmış haliyle üretilir.
- `eas.json` konfigürasyon dosyası repo’da tutulmalıdır; her profil için platform-spesifik ayarlar açıkça tanımlanmalıdır.

## 43.2. Fastlane Entegrasyonu

- **iOS:**
  - `match`: Code signing (provisioning profile ve certificate) merkezi yönetimi.
  - `pilot`: TestFlight’a otomatik yükleme.
  - `deliver`: App Store’a metadata ve build submission.
- **Android:**
  - `supply`: Google Play Store’a build ve metadata yükleme.
  - `screengrab`: Screenshot otomasyonu.
- Fastlane ve EAS birlikte kullanılabilir: EAS build üretimi, Fastlane delivery ve metadata yönetimi.

## 43.3. Code Signing Yönetimi

- **iOS:** Provisioning profiles ve certificates Fastlane match ile merkezi olarak yönetilmelidir. Tüm ekip aynı signing identity’yi kullanmalıdır.
- **Android:** Keystore güvenli saklanmalıdır. CI ortamında secret olarak, EAS kullanılıyorsa EAS credential service üzerinden yönetilmelidir.
- Signing key rotation planı tanımlanmalıdır; sertifika süreleri takip edilmelidir.
- **YASAK:** Keystore, provisioning profile, `.p12`, `.mobileprovision` veya signing ile ilgili herhangi bir dosyanın repo’ya commit edilmesi yasaktır.

## 43.4. CI/CD Workflow Şablonları

- **PR açıldığında:** lint + typecheck + test + build check çalışmalıdır. Tümü geçmedikçe merge engellenir.
- **Main merge:** Preview build üretilir ve internal test grubuna dağıtılır.
- **Release tag:** Production build üretilir ve store submission başlatılır.
- **OTA update:** EAS Update publish komutuyla yayınlanır (ADR-015 ile uyumlu).

## 43.5. Preview Deployment

- PR bazlı preview build üretilmelidir (EAS Update preview channel kullanılarak).
- QA ekibi için internal distribution sağlanmalıdır.
- Preview URL veya QR code otomatik olarak PR comment’e eklenmelidir; reviewer’ın build’i kolayca test edebilmesi sağlanmalıdır.

## 43.6. Screenshot ve Metadata Otomasyonu

- Fastlane `screengrab` (Android) ve `snapshot` (iOS) ile otomatik screenshot üretilmelidir.
- Store metadata (başlık, açıklama, anahtar kelimeler, screenshot’lar) versiyon kontrolünde tutulmalıdır.
- Çoklu dil desteği: i18n altyapısı ile uyumlu store listing sağlanmalıdır (ADR-011 referansı). Her desteklenen dil için ayrı metadata dosyası bulunmalıdır.

---

# 44. Bundle Size Budget CI Gate (2026-04-02 Eki)

Bu bölüm, her PR'da bundle boyutu kontrolünün nasıl yapılacağını, web ve mobile platform bütçelerini, CI akışını ve araç seçeneklerini tanımlar.

## 44.1. Web Bundle Bütçesi

| Bundle | Limit | Ölçüm Aracı |
|--------|-------|-------------|
| Initial JS | 200KB (gzip) | vite-bundle-analyzer |
| Total JS | 500KB (gzip) | build output |
| CSS | 50KB (gzip) | build output |
| Tek chunk | 100KB (gzip) | code splitting kontrolü |

- Initial JS bütçesi, kullanıcının ilk sayfa yüklemesinde indirdiği toplam JavaScript boyutunu kapsar. Bu değerin aşılması, TTI ve LCP metriklerini doğrudan olumsuz etkiler.
- Tek chunk limiti, code splitting'in doğru çalıştığını garanti altına alır. 100KB üstü chunk var ise lazy loading veya dynamic import değerlendirilmelidir.

## 44.2. Mobile Bundle Bütçesi

| Platform | Limit | Ölçüm Aracı |
|----------|-------|-------------|
| iOS JS bundle | 2MB (uncompressed) | metro bundler |
| Android JS bundle | 2MB (uncompressed) | metro bundler |
| APK/IPA boyutu | 30MB | EAS build output |

- JS bundle boyutu Hermes bytecode precompilation sonrası ölçülür.
- APK/IPA boyutu store submission öncesi final build üzerinden kontrol edilir.

## 44.3. CI Akışı

Bundle size kontrolü PR CI pipeline'ına aşağıdaki sırayla entegre edilir:

1. **Base branch ölçümü:** `main` branch'teki son başarılı build'in bundle boyutu referans alınır (cache'lenir).
2. **PR branch ölçümü:** PR branch build'inin bundle boyutu hesaplanır.
3. **Fark raporu:** Base ve PR arasındaki fark (delta) hesaplanır ve PR comment olarak otomatik raporlanır.
4. **Limit kontrolü:** Mutlak limit aşılırsa PR bloklanır. Delta %10'u aşarsa uyarı verilir.

Rapor formatı:
```
Bundle Size Report
──────────────────
| Bundle     | Base   | PR     | Delta  | Durum |
|------------|--------|--------|--------|-------|
| Initial JS | 185KB  | 195KB  | +10KB  | ✅    |
| Total JS   | 420KB  | 510KB  | +90KB  | ❌    |
| CSS        | 35KB   | 36KB   | +1KB   | ✅    |
```

## 44.4. Araç Seçenekleri

- **size-limit:** Hem web hem node paketleri için bundle size monitoring. CI entegrasyonu kolay, `.size-limit.json` ile konfigüre edilir.
- **bundlesize:** GitHub status check entegrasyonu ile PR'da otomatik rapor.
- **Custom script:** `vite-bundle-analyzer` çıktısını parse eden ve limitleri kontrol eden Turborepo task'ı.
- Araç seçimi `16-tooling-and-governance.md` ve `37-dependency-policy.md` kurallarına tabidir.

## 44.5. Exception Kuralı

Büyük dependency eklenmesi gerektiğinde (ör. harita SDK, video player):
- `37-dependency-policy.md`'ye göre dependency onayı alınmalıdır.
- Bundle size bütçesinde geçici artış için `44-exception-and-exemption-policy.md`'ye göre exception kaydı açılmalıdır.
- Exception'da yeni bütçe limiti, gerekçe ve beklenen optimizasyon planı belirtilmelidir.

---

# 45. Lighthouse / Web Vitals CI Entegrasyonu (2026-04-02 Eki)

Bu bölüm, web build'leri için performans metriklerinin CI'da nasıl ölçüleceğini, eşik değerlerini, araç seçeneklerini ve PR bloklama kurallarını tanımlar.

## 45.1. Ölçülen Metrikler ve Eşikler

| Metrik | İyi | Kabul Edilebilir | Kötü |
|--------|-----|-----------------|------|
| LCP (Largest Contentful Paint) | <2.5s | 2.5-4s | >4s |
| FID (First Input Delay) | <100ms | 100-300ms | >300ms |
| CLS (Cumulative Layout Shift) | <0.1 | 0.1-0.25 | >0.25 |
| INP (Interaction to Next Paint) | <200ms | 200-500ms | >500ms |
| TTI (Time to Interactive) | <3.8s | 3.8-7.3s | >7.3s |

- "İyi" kategorisi Google'ın Core Web Vitals eşikleriyle uyumludur.
- "Kötü" kategorisinde herhangi bir metrik bulunması PR'ın bloklanmasına neden olur.
- INP, FID'in yerini alan yeni metrik olarak birincil etkileşim göstergesidir.

## 45.2. CI Araçları

- **Lighthouse CI (lhci):** Google'ın resmi CI aracı. `lighthouserc.json` ile threshold tanımı yapılır.
- **Unlighthouse:** Tüm sayfaları tarayarak toplu Lighthouse analizi. Büyük projelerde faydalıdır.
- Araç tercihi: Lighthouse CI canonical varsayılandır. Unlighthouse opsiyonel ek tarama aracıdır.

## 45.3. Konfigürasyon

`lighthouserc.json` dosyası repo kökünde tutulur:

```json
{
  "ci": {
    "assert": {
      "assertions": {
        "categories:performance": ["error", { "minScore": 0.7 }],
        "categories:accessibility": ["warn", { "minScore": 0.9 }],
        "categories:best-practices": ["warn", { "minScore": 0.9 }],
        "first-contentful-paint": ["error", { "maxNumericValue": 2500 }],
        "interactive": ["error", { "maxNumericValue": 3800 }],
        "cumulative-layout-shift": ["error", { "maxNumericValue": 0.1 }]
      }
    }
  }
}
```

## 45.4. Raporlama

- PR'da Lighthouse score karşılaştırması (before/after) otomatik olarak comment edilir.
- Rapor formatı: Her kategori için skor, delta ve durum bilgisi içerir.
- Trend takibi: Son 10 merge'in Lighthouse skorları loglanır, gerileme tespit edilir.

## 45.5. Bloklama Kuralları

| Koşul | Aksiyon |
|-------|---------|
| Performance score < 70 | PR bloklanır |
| Accessibility score < 85 | PR uyarı alır (gelecekte bloklayıcı) |
| Herhangi bir Core Web Vital "Kötü" kategorisinde | PR bloklanır |
| Performance score 5+ puan düştü (regression) | PR uyarı alır, reviewer dikkat |

- Bloklama kurallarının exception'ı `44-exception-and-exemption-policy.md`'ye tabidir.
- Performance test CI'da headless Chrome üzerinde çalışır; sonuçlar gerçek cihaz performansından farklı olabilir, bu nedenle eşikler konservatif tutulur.

---

# 46. Build Profile ve Environment CI Gate (2026-04-02 Eki)

Bu bölüm, build profili ve ortam değişkeni bütünlüğünü CI seviyesinde doğrulayan kalite kapılarını tanımlar. Ortam konfigürasyon hataları production'a ulaşmadan erken aşamada yakalanmalıdır.

---

## 46.1. Development Build Doğrulaması

Her PR'da development build'in başarılı olduğu CI step olarak doğrulanır. Build başarısızlığı merge'i bloklar.

**Kontrol Adımları:**
- Web: `pnpm --filter web build` (veya `vite build --mode development`) başarılı tamamlanmalıdır.
- Mobile: `eas build --profile development --platform all --non-interactive` dry-run doğrulaması veya `expo doctor` ile konfigürasyon sağlık kontrolü yapılmalıdır.
- TypeScript: `pnpm typecheck` tüm workspace'lerde hatasız geçmelidir.

---

## 46.2. Env Var Integrity Kontrolü

`.env.example` ile runtime ortam değişkenlerinin eşleşmesini kontrol eden CI script'i her PR'da çalışır.

**Kontrol Mantığı:**

```bash
#!/bin/bash
# scripts/check-env-integrity.sh
# .env.example'daki tüm key'lerin CI ortamında tanımlı olup olmadığını kontrol eder

ENV_EXAMPLE_FILE=$1  # ör. apps/web/.env.example veya apps/mobile/.env.example
MISSING_VARS=()

while IFS= read -r line; do
  # Boş satır ve yorumları atla
  [[ -z "$line" || "$line" =~ ^# ]] && continue
  # Key adını çıkar (= öncesi)
  KEY=$(echo "$line" | cut -d'=' -f1 | xargs)
  # Ortamda tanımlı mı kontrol et
  if [[ -z "${!KEY}" ]]; then
    MISSING_VARS+=("$KEY")
  fi
done < "$ENV_EXAMPLE_FILE"

if [[ ${#MISSING_VARS[@]} -gt 0 ]]; then
  echo "HATA: Eksik ortam değişkenleri tespit edildi:"
  for var in "${MISSING_VARS[@]}"; do
    echo "  - $var"
  done
  exit 1
fi

echo "Tüm ortam değişkenleri mevcut."
exit 0
```

**Kurallar:**
- `.env.example` dosyasında bulunup CI ortamında tanımlı olmayan her değişken hata üretir.
- Yeni env var eklendiğinde `.env.example` güncellenmezse CI fail eder.
- Script hem `apps/web/.env.example` hem `apps/mobile/.env.example` için ayrı ayrı çalıştırılır.

---

## 46.3. Bundle ID Uyum Kontrolü

Build profili ile bundle ID / package name eşleşmesinin doğruluğu kontrol edilir.

**Kontrol Mantığı:**
- `app.config.ts`'nin ürettiği `bundleIdentifier` (iOS) ve `package` (Android) değerleri, `eas.json`'daki profil ile uyumlu olmalıdır.
- Development build'de `.dev` suffix'i olmalıdır.
- Preview/staging build'de `.staging` suffix'i olmalıdır.
- Production build'de suffix olmamalıdır.
- Uyumsuzluk durumunda uyarı üretilir (gelecekte blocker'a yükseltilebilir).

---

## 46.4. .env.example Güncellik Kontrolü

PR'da yeni bir ortam değişkeni eklendiyse veya mevcut bir değişken kaldırıldıysa, `.env.example` dosyasının buna uygun güncellenip güncellenmediği kontrol edilir.

**Kontrol Mantığı:**
- PR diff'inde `process.env.`, `import.meta.env.`, `Constants.expoConfig.extra.` gibi ortam değişkeni erişim pattern'leri taranır.
- Yeni bir env var referansı tespit edilip `.env.example`'da karşılığı yoksa → CI fail.
- Mevcut bir env var referansı kaldırılıp `.env.example`'da hâlâ varsa → uyarı.

---

## 46.5. Bloklama Kuralları

| Kontrol | Başarısız Olursa | Severity |
|---------|-----------------|----------|
| Development build (web + mobile) | PR bloklanır | Blocker |
| Env var integrity (eksik değişken) | PR bloklanır | Blocker |
| .env.example güncelliği | PR bloklanır | Blocker |
| Bundle ID / profil uyumu | Uyarı üretilir | Major (gelecekte Blocker) |
| Production env var'da debug değeri | Uyarı üretilir | Major |

**Exception Kuralı:**
- Build profile ve env var kontrollerinde exception verilmesi `44-exception-and-exemption-policy.md`'ye tabidir.
- Exception süresi maksimum 1 sprint (2 hafta); süre sonunda kontrol tekrar aktif edilir.

---

# 47. Accessibility Test Automation Pipeline (2026-04-02 Eki)

Bu bölüm, erişilebilirlik (a11y) testlerinin CI pipeline'ına nasıl entegre edileceğini, araç seçimlerini, bloklama kurallarını ve regression tespit mekanizmasını tanımlar. A11y kalitesi manuel denetimle değil, otomatik ve sürekli test ile korunur.

---

## 47.1. axe-core CI Entegrasyonu

axe-core, Deque Systems tarafından geliştirilen açık kaynak erişilebilirlik test motoru olup bu projede üç katmanda kullanılır:

### 47.1.1. Development-Time: @axe-core/react

- `@axe-core/react` development dependency olarak kurulur.
- Yalnızca `__DEV__` modunda aktif olur; production bundle'a dahil edilmez.
- Development server çalışırken browser konsolunda real-time a11y uyarıları gösterir.
- Geliştirici, component üzerinde çalışırken a11y ihlallerini anında görür.
- Konfigürasyon: `apps/web/src/main.tsx` içinde conditional import.

### 47.1.2. Unit/Integration Test: jest-axe

- `jest-axe` test dependency olarak kullanılır.
- Her UI component test dosyasında `expect(container).toHaveNoViolations()` assertion'ı eklenir.
- Bu assertion, render edilen HTML çıktısını axe-core motoru ile tarar.
- Vitest uyumu: `vitest-axe` wrapper kullanılır (Vitest canonical test runner olduğu için).

**Örnek test:**

```typescript
import { render } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import { LoginForm } from "./LoginForm";

expect.extend(toHaveNoViolations);

describe("LoginForm a11y", () => {
  it("erişilebilirlik ihlali bulunmamalı", async () => {
    const { container } = render(<LoginForm />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
```

### 47.1.3. E2E Test: Playwright + axe-core

- `@axe-core/playwright` dependency olarak kullanılır.
- E2E test senaryolarında her kritik sayfa için a11y taraması yapılır.
- Playwright test runner içinde `AxeBuilder` API'si kullanılır.
- CI'da her PR'da otomatik çalışır.

**Örnek E2E a11y testi:**

```typescript
import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("ana sayfa erişilebilirlik kontrolü", async ({ page }) => {
  await page.goto("/");
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});
```

### 47.1.4. Severity Mapping

axe-core ihlalleri CI'da şu severity mapping ile değerlendirilir:

| axe-core Severity | CI Severity | Aksiyon |
|-------------------|-------------|---------|
| `critical` | Blocker | PR bloklanır, merge yapılamaz |
| `serious` | Blocker | PR bloklanır, merge yapılamaz |
| `moderate` | Major | PR uyarı alır, reviewer dikkat eder |
| `minor` | Warning | Bilgi amaçlı, bloklama yok |

---

## 47.2. @testing-library A11y Query Zorunluluğu

Testing Library, erişilebilir query yöntemlerini teşvik eden bir test yaklaşımı sunar. Bu projede query öncelik sırası zorunlu olarak uygulanır.

**Query Öncelik Sırası (Zorunlu):**

1. `getByRole` — En yüksek öncelik; ARIA role ile sorgulama
2. `getByLabelText` — Form elemanları için label ilişkisi
3. `getByPlaceholderText` — Label yoksa placeholder ile sorgulama
4. `getByText` — Görünür metin ile sorgulama
5. `getByDisplayValue` — Input'un mevcut değeri ile sorgulama
6. `getByAltText` — Görsel içerik için alt text
7. `getByTitle` — Title attribute ile sorgulama
8. `getByTestId` — En düşük öncelik; yalnızca son çare

**ESLint Enforcement:**

- `eslint-plugin-testing-library` aktif olmalıdır.
- `testing-library/prefer-role-queries` kuralı `warn` seviyesinde aktiftir.
- `testing-library/no-node-access` kuralı `error` seviyesinde aktiftir.
- `getByTestId` tek başına kullanıldığında (üst sıradaki query'ler mümkünken) ESLint uyarısı üretilir.

**Accessible Name Zorunluluğu:**
- Interactive element (`button`, `input`, `select`, `textarea`, `a[href]`) accessible name olmadan render edilirse → test fail.
- Accessible name: `aria-label`, `aria-labelledby`, `<label>` ilişkisi veya görünür metin içeriği ile sağlanır.
- Bu kontrol axe-core `button-name`, `input-name`, `link-name` kuralları ile otomatik yapılır.

---

## 47.3. Contrast Ratio Otomatik Kontrol

Renk kontrastı erişilebilirlik için temel gereksinimlerden biridir. Bu projede contrast ratio kontrolü çok katmanlı olarak uygulanır.

**Katman 1 — axe-core `color-contrast` Kuralı:**
- axe-core'un `color-contrast` kuralı tüm tarama seviyelerinde (unit, E2E) aktiftir.
- Yetersiz kontrast → severity mapping'e göre değerlendirilir (genellikle `serious` = Blocker).

**Katman 2 — Storybook A11y Addon:**
- `@storybook/addon-a11y` her component story'sinde görsel contrast kontrolü sağlar.
- Geliştirici Storybook'ta component'i incelerken a11y panelinde contrast sorunlarını anında görür.
- CI'da Storybook test runner ile a11y addon sonuçları otomatik kontrol edilebilir.

**Katman 3 — Token Sistemi ile Çift Koruma:**
- Hardcoded renk kullanımı zaten `22-design-tokens-spec.md` ve `D-STY` guardrail ile yasaklıdır.
- Semantic token'lar WCAG AA kontrastını sağlayacak şekilde tasarlanır.
- Token güncellemesinde contrast regression riski vardır; token değişikliği PR'ında axe-core taraması zorunludur.

**Minimum Contrast Gereksinimleri (WCAG 2.1 AA):**

| Element Türü | Minimum Contrast Ratio | Standart |
|-------------|----------------------|----------|
| Normal metin (<18px veya <14px bold) | 4.5:1 | WCAG AA |
| Büyük metin (≥18px veya ≥14px bold) | 3:1 | WCAG AA |
| UI bileşeni ve grafik öğesi | 3:1 | WCAG AA |
| Dekoratif/inaktif element | Muaf | WCAG AA |

---

## 47.4. A11y Score Regression Tespiti

Erişilebilirlik kalitesinin zamanla gerilemesini tespit eden mekanizma.

**Baseline Oluşturma:**
- İlk kapsamlı a11y audit'inde mevcut ihlal sayısı ve türleri kaydedilir.
- Baseline dosyası: `tooling/a11y-baseline.json` — ihlal sayısı, severity dağılımı, tarih.
- Baseline CI artifact olarak saklanır.

**PR Bazlı Regression Kontrolü:**
- PR'da a11y test sonuçları baseline ile karşılaştırılır.
- İhlal sayısı artarsa → uyarı üretilir (reviewer'a bildirim).
- Yeni `critical` veya `serious` ihlal eklendiyse → PR bloklanır (net artış, önceden mevcut olanlar hariç).
- İhlal sayısı azaldıysa → pozitif sinyal, baseline güncellenir.

**Trend Takibi:**
- Monthly a11y ihlal sayısı raporu üretilir (CI artifact veya dashboard).
- Trend yönü: Azalma beklenir; artış durumunda teknik borç toplantısında değerlendirilir.
- Hedef: 6 ay içinde tüm `critical` ve `serious` ihlallerin sıfırlanması.

---

## 47.5. Bloklama Kuralları

| Kontrol | Başarısız Olursa | Severity |
|---------|-----------------|----------|
| axe-core `critical` ihlal | PR bloklanır | Blocker |
| axe-core `serious` ihlal | PR bloklanır | Blocker |
| Unlabeled interactive element (`button-name`, `input-name`, `link-name`) | PR bloklanır | Blocker |
| Contrast ratio ihlali (WCAG AA altı) | PR bloklanır | Blocker |
| `accessibilityRole` eksikliği (React Native) | Uyarı (gelecekte Blocker) | Major |
| `getByTestId` tek başına kullanımı (üst sıra query mümkünken) | Uyarı | Minor |
| A11y ihlal sayısı baseline'dan arttı (critical/serious dışı) | Uyarı | Major |
| axe-core `moderate` ihlal | Uyarı, reviewer dikkat | Major |

**React Native Spesifik Kurallar:**
- `accessibilityLabel` prop'u tüm interactive element'lerde zorunludur (gelecekte Blocker).
- `accessibilityRole` prop'u semantic anlam taşıyan element'lerde gereklidir.
- `accessibilityState` prop'u toggle/checkbox/switch gibi durum taşıyan element'lerde zorunludur.
- Bu kurallar şimdilik uyarı seviyesinde uygulanır; ekip olgunlaştıkça Blocker'a yükseltilir.

**Exception Kuralı:**
- A11y blocker ihlallerinde exception verilmesi `44-exception-and-exemption-policy.md`'ye tabidir.
- Exception gerekçesi: Üçüncü parti component'in a11y desteği yetersiz (ör. custom chart library).
- Exception süresi: Maksimum 2 sprint; süre sonunda alternatif çözüm veya upstream fix gerekir.

---

# 48. Build Caching ve CI Performans Optimizasyonu (2026-04-02 Eki)

CI süresini minimize etmek geliştirici deneyiminin temelidir. Bu bölüm, monorepo build caching stratejisi ve CI performans hedeflerini tanımlar.

## 48.1. Turborepo Remote Cache

Turborepo 2.x (ADR-003) local cache varsayılan olarak aktiftir. Remote cache ile ekip genelinde cache paylaşımı sağlanır:

- **Varsayılan:** Vercel Remote Cache (Turborepo native entegrasyon)
- **Alternatif:** Self-hosted (ör: Ducktape, custom S3 backend) — enterprise projeler için
- **Cache granularity:** Task-level (build, typecheck, lint, test ayrı cache'lenir)
- **Cache invalidation:** `turbo.json` pipeline tanımı veya input dosyaları değiştiğinde otomatik
- **CI'da aktivasyon:** `TURBO_TOKEN` ve `TURBO_TEAM` environment variable'ları CI secret olarak tanımlanır

### Cache Hit Hedefleri

| Senaryo | Beklenen Cache Hit Oranı |
|---------|--------------------------|
| Aynı branch, değişiklik yok | %100 |
| Farklı branch, ortak base | > %70 |
| Dependency değişikliği sonrası | %0 (beklenen, rebuild gerekli) |
| Yalnızca docs değişikliği | > %90 (kod task'ları cache'den gelir) |

## 48.2. EAS Build Caching

Expo EAS Build (SDK 55+) cache mekanizması, native build süresini dramatik şekilde düşürür:

- **iOS:** CocoaPods cache, Xcode derived data cache
- **Android:** Gradle cache, native dependency cache
- **Beklenen hızlanma:** İlk build sonrası sonraki build'lerde %20-30 süre azalması
- **Cache temizleme:** `eas build --clear-cache` ile zorunlu tam rebuild (debug amaçlı)
- **Konfigürasyon:** `eas.json`'da profile bazlı cache stratejisi tanımlanabilir

## 48.3. GitHub Actions Cache Stratejisi

```yaml
# .github/workflows/ci.yml cache örneği
- name: pnpm store cache
  uses: actions/cache@v4
  with:
    path: ~/.pnpm-store
    key: pnpm-${{ hashFiles('pnpm-lock.yaml') }}
    restore-keys: pnpm-

- name: Turborepo cache
  uses: actions/cache@v4
  with:
    path: .turbo
    key: turbo-${{ github.ref }}-${{ github.sha }}
    restore-keys: |
      turbo-${{ github.ref }}-
      turbo-main-

- name: CocoaPods cache (iOS build)
  uses: actions/cache@v4
  with:
    path: apps/mobile/ios/Pods
    key: pods-${{ hashFiles('apps/mobile/ios/Podfile.lock') }}
```

### Cache Boyut Yönetimi

- GitHub Actions cache limiti: 10 GB per repo
- Eski cache'ler 7 gün sonra otomatik silinir (GitHub default)
- Ana branch cache'i öncelikli korunur
- Feature branch cache'leri kısa ömürlüdür

## 48.4. CI Süresi Bütçesi

| CI Türü | Hedef | Uyarı | Blocker |
|---------|-------|-------|---------|
| PR CI (lint + typecheck + test) | < 5 dk | 5-8 dk | > 10 dk |
| Full CI (build + E2E dahil) | < 15 dk | 15-20 dk | > 25 dk |
| EAS Build (iOS) | < 20 dk | 20-30 dk | > 40 dk |
| EAS Build (Android) | < 15 dk | 15-25 dk | > 35 dk |

CI süreleri haftalık olarak izlenir. Blocker eşiğine yaklaşıldığında optimizasyon sprint'i planlanır.

---

# 49. Accessibility Otomatik Test CI Gate (2026-04-02 Eki)

Manuel accessibility testi önemlidir ancak yeterli değildir. Bu bölüm, CI pipeline'da otomatik erişilebilirlik testi gereksinimlerini tanımlar.

## 49.1. Test Araçları

| Araç | Kapsam | Entegrasyon |
|------|--------|-------------|
| jest-axe | Component-level a11y kuralları | Unit test (Vitest/Jest) |
| @storybook/addon-a11y | Storybook'ta görsel a11y kontrolü | Storybook 10.x |
| axe-core (Playwright) | E2E seviyesinde sayfa bazlı a11y | Playwright test suite |

## 49.2. jest-axe Entegrasyonu

Her reusable component'in test dosyasında a11y kontrolü yapılmalıdır:

```typescript
// Button.test.tsx
import { render } from '@testing-library/react-native';
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

test('Button a11y ihlali içermez', async () => {
  const { container } = render(<Button label="Kaydet" onPress={() => {}} />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

## 49.3. Storybook A11y Addon

- Storybook 10.x (canonical) ile `@storybook/addon-a11y` varsayılan aktiftir
- Her story'de a11y paneli otomatik çalışır
- Violation count > 0 olan story'ler Chromatic visual review'da işaretlenir

## 49.4. Coverage Hedefi

| Katman | Hedef | Zorunluluk |
|--------|-------|------------|
| Reusable component (packages/ui) | %100 a11y test | Zorunlu — PR merge şartı |
| Feature component (apps/*/features) | > %80 a11y test | Hedef — izleme |
| E2E kritik akışlar (login, onboarding, checkout) | Axe scan | Zorunlu — E2E suite'te |

## 49.5. CI Gate Kuralları

- **Phase 1:** jest-axe testleri CI'da çalışır, failure uyarı üretir (non-blocking)
- **Phase 2:** Reusable component'lerde jest-axe failure PR merge'i bloklar
- **Phase 3:** E2E axe-core scan tüm kritik akışlarda zorunlu

Detaylı a11y standartları ve WCAG uyum gereksinimleri: `12-accessibility-standard.md`
