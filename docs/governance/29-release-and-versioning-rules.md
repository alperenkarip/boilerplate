# 29-release-and-versioning-rules.md

## Doküman Kimliği

- **Doküman adı:** Release and Versioning Rules
- **Dosya adı:** `29-release-and-versioning-rules.md`
- **Doküman türü:** Governance / release discipline / versioning strategy / compatibility control document
- **Durum:** Accepted
- **Tarih:** 2026-03-31
- **Kapsam:** Bu belge, boilerplate kapsamında release sürecini, versioning mantığını, dependency ve compatibility etkilerini, canonical stack upgrade yönetimini, hotfix/rollback disiplinini, release metadata beklentisini, changelog ve breaking change bildirimini ve sürüm geçişi sırasında doküman senkronizasyonu zorunluluğunu tanımlar.
- **Bağlı olduğu üst belgeler:**
  - `15-quality-gates-and-ci-rules.md`
  - `16-tooling-and-governance.md`
  - `17-technology-decision-framework.md`
  - `27-security-and-secrets-baseline.md`
  - `28-observability-and-debugging.md`
  - `36-canonical-stack-decision.md`
  - `37-dependency-policy.md`
  - `38-version-compatibility-matrix.md`
  - `ADR-008 — Testing Stack`
  - `ADR-009 — Observability Stack`
- **Doğrudan etkileyeceği belgeler:**
  - `30-contribution-guide.md`
  - `31-audit-checklist.md`
  - `32-definition-of-done.md`
  - `35-document-map.md`

---

# 1. Bu Belgenin Revize Edilme Nedeni

Önceki sürüm release ve versioning disiplinini genel olarak iyi tarif ediyordu.  
Ama artık proje şu noktaya geldi:

- canonical stack kilitlendi
- dependency policy yazıldı
- compatibility matrix yazıldı
- release metadata observability’nin parçası haline geldi

Bu yüzden release/versioning belgesi artık yalnızca semver veya changelog rehberi olamaz.  
Artık şu soruyu da net cevaplamak zorundadır:

> Canonical stack’e dokunan bir sürüm değişikliği ne zaman normal update, ne zaman compatibility event, ne zaman breaking architectural move sayılır?

Bu revizyon bunu netleştirir.

---

# 2. Amaç

Bu dokümanın amacı, release ve versioning’i:

- merge olduysa çıktı,
- sürüm numarası artırıldıysa bitti,
- changelog yazarsak yeter,
- hotfix ile nasıl olsa düzeltiriz

gibi gevşek yaklaşımlardan çıkarıp;  
**compatibility, release güvenliği, rollback hazırlığı, observability, docs sync ve canonical stack korunumu** ile bağlı resmi yönetim alanına dönüştürmektir.

Bu belge şu sorulara net cevap verir:

1. Release bu projede ne zaman “hazır” sayılır?
2. Versioning yalnızca paket versiyonu mudur, yoksa stack compatibility olayı da mıdır?
3. Dependency upgrade hangi durumda normal, hangi durumda riskli kabul edilir?
4. Canonical stack’e dokunan değişiklikler nasıl sınıflandırılır?
5. Hotfix, rollback ve revalidation nasıl düşünülmelidir?
6. Changelog ve release note ne taşımalıdır?
7. Docs/ADR/compatibility sync olmadan release neden eksiktir?
8. Hangi release davranışları doğrudan zayıf kabul edilir?

---

# 3. Temel Tez

Bu proje kapsamında temel tez şudur:

> Release disiplini, yalnızca kodu yayınlama işlemi değildir; compatibility güvenliği, dependency rejimi, observability görünürlüğü, rollback hazırlığı, changelog doğruluğu ve dokümantasyon senkronizasyonu ile birlikte ele alınan bütünsel kalite kapısıdır.

Bu tez şu sonuçları doğurur:

1. CI yeşil diye release hazır sayılmaz.
2. Sürüm artışı yalnızca package.json olayı değildir.
3. Canonical stack güncellemesi, release notunda ve compatibility matrix’te iz bırakmalıdır.
4. Hotfix, normal release disiplinini bypass eden kalıcı kültüre dönüşmemelidir.
5. Docs sync olmadan release tam sayılmaz.

---

# 4. Release Türleri

Bu boilerplate’te release türleri en az aşağıdaki gibi düşünülmelidir:

1. **Routine release**
2. **Compatibility-impacting release**
3. **Hotfix release**
4. **Rollback / revert release**
5. **Foundation release**
6. **Breaking governance release**

Bu ayrım yapılmadan “her release aynı” yaklaşımı yetersizdir.

## 4.1. Release Decision Tree

Bir değişikliğin hangi release türüne girdiğini belirlemek için aşağıdaki karar ağacını kullanın:

```
Değişiklik production'da acil sorun mu çözüyor?
├── EVET → Hotfix Release (§7)
└── HAYIR ↓

Değişiklik geri alınması gereken bir hatayı düzeltiyor mu?
├── EVET → Rollback / Revert Release (§8)
└── HAYIR ↓

Değişiklik canonical stack'te major versiyon güncellemesi içeriyor mu?
├── EVET → Foundation Release (§9)
└── HAYIR ↓

Değişiklik mevcut API contract'ını, route yapısını veya veri modelini kırıyor mu?
├── EVET → Breaking Governance Release (§10 — ADR gerektirir)
└── HAYIR ↓

Değişiklik 38-version-compatibility-matrix.md'deki bir version hattını etkiliyor mu?
├── EVET → Compatibility-Impacting Release (§6)
└── HAYIR ↓

→ Routine Release (§5)
```

**Kurallar:**
- Kararsız kalındığında daha yüksek seviye release türü seçilir (güvenli taraf)
- Birden fazla kategoriye giren değişiklik, en yüksek kategorinin kurallarına tabi olur
- Release türü PR açılırken belirlenir ve PR description'da belirtilir

---

# 5. Routine Release

## 5.1. Tanım
Canonical stack’i veya compatibility matrix’i etkilemeyen, rutin feature/fix/UX/workflow değişiklikleri.

## 5.2. Örnekler
- yeni reusable component varyantı
- feature ekranı
- copy fix
- safe refactor
- test iyileştirmesi
- minor tooling cleanup

## 5.3. Beklenenler
- standard CI
- relevant tests
- docs impact check
- changelog/release note class
- no compatibility drift

---

# 6. Compatibility-Impacting Release

## 6.1. Tanım
Çekirdek dependency family veya exact compatible track’i etkileyen release.

## 6.2. Örnekler
- React/Vite/Expo/RN hattı değişimi
- Tailwind/NativeWind major track değişimi
- TypeScript baseline değişimi
- Jest/Vitest/Playwright chain değişimi
- Node baseline değişimi
- React Navigation stable baseline değişimi

## 6.3. Beklenenler
- `38-version-compatibility-matrix.md` güncellemesi
- compatibility revalidation
- release risk notu
- changelog’da görünür kayıt
- gerektiğinde ADR sync
- ilgili docs sync

## 6.4. Kural
Bu sınıftaki release’ler sıradan dependency bump gibi ele alınmaz.

---

# 7. Hotfix Release

## 7.1. Tanım
Üretimde kritik kullanıcı etkisi doğuran, bekleyemeyecek hata için yapılan minimal düzeltme release’i.

## 7.2. Kural
Hotfix:
- minimal olmalı
- scope kontrollü olmalı
- root cause sonradan unutulmamalı
- normal kalite kapıları mümkün olan en yüksek seviyede korunmalı

## 7.3. Yanlış yorum
Hotfix, test ve docs kurallarını tamamen askıya alma hakkı vermez.

## 7.4. Zorunlu sorular
- gerçekten hotfix mi?
- rollback daha doğru mu?
- ne kadar küçük tutuldu?
- postmortem veya takip işine bağlandı mı?

---

# 8. Rollback / Revert Release

## 8.1. Tanım
Yeni release’in güvenli olmadığı durumda sistemin önceki güvenilir duruma döndürülmesi.

## 8.2. Kural
Rollback panik hareketi değil, planlı seçenek olmalıdır.

## 8.3. Gereklilikler
- release metadata görünürlüğü
- hangi değişiklik sorun çıkardı bilgisinin bulunabilir olması
- rollback path’in önceden düşünülmesi
- environment parity farklarının anlaşılması

## 8.4. Zayıf davranış
Sorun olduğunda neyin rollback edileceğini bilmemek.

---

# 9. Foundation Release

## 9.1. Tanım
Repo yapısı, quality gates, DS runtime, auth baseline, observability gibi foundation alanlarını etkileyen release sınıfı.

## 9.2. Neden ayrı?
Çünkü görünürde az dosya değişebilir ama sistemik etkisi büyüktür.

## 9.3. Beklenenler
- docs sync
- audit etkisi
- DoD etkisi
- compatibility etkisi
- rollout dikkat seviyesi

---

# 10. Versioning Ne Demektir?

## 10.1. Versioning yalnızca package version değildir
Bu projede versioning en az üç düzeyde düşünülmelidir:

1. **Repo/product release version**
2. **Dependency family version tracks**
3. **Canonical stack compatibility state**

## 10.2. Neden?
Çünkü bazen package version değişmez ama compatibility state değişir.  
Bazen de küçük package bump, aslında sistemik risk taşır.

---

# 11. Semantic Versioning Bu Projede Nasıl Yorumlanır?

## 11.1. Kural
Semver yararlıdır ama kör uygulanmaz.

## 11.2. Çünkü
- bazı minor bump’lar pratikte risklidir
- bazı patch bump’lar integration kırabilir
- monorepo’da dependency family etkisi tek paketten büyüktür

## 11.3. Doğru yaklaşım
Semver + compatibility matrix + risk class birlikte yorumlanır.

---

# 12. Canonical Stack Release Kuralı

## 12.1. Kural
Aşağıdaki alanlara dokunan değişiklikler “stack-sensitive” kabul edilir:

- Node
- pnpm
- Turbo
- React
- React DOM
- Vite
- Expo
- React Native
- React Native Web
- Tailwind
- NativeWind
- Zustand
- TanStack Query
- RHF
- Zod
- Jest
- Vitest
- Playwright
- React Router
- React Navigation
- i18next / react-i18next

## 12.2. Sonuç
Bu ailelerden birine dokunmak:
- release risk notu,
- compatibility etkisi,
- docs sync
gerektirir.

---

# 13. `37` ve `38` ile İlişki

## 13.1. `37-dependency-policy.md`
Dependency kabul ve removal/replacement disiplini burada yaşar.

## 13.2. `38-version-compatibility-matrix.md`
Hangi major/minor hatların birlikte meşru olduğu burada yaşar.

## 13.3. Bu belge ne yapar?
Bu iki belgeyi release sürecine bağlar.

Yani:
- dependency değiştiyse yalnızca package json’a bakılmaz
- release safety açısından da değerlendirilir

---

# 14. Release Readiness Kriterleri

Bir release aşağıdaki minimum sorulara olumlu cevap vermelidir:

1. Relevant CI kapıları geçti mi?
2. Compatibility drift oluştu mu?
3. Docs etkisi kapandı mı?
4. Release metadata görünür mü?
5. Observability ile post-release izlenebilir mi?
6. Rollback veya hotfix planı gerektiğinde düşünüldü mü?
7. Changelog/release note anlamlı mı?
8. Breaking impact varsa açıkça yazıldı mı?

---

# 15. Changelog ve Release Notes Politikası

## 15.1. Kural
Changelog yalnızca commit listesi değildir.

## 15.2. İyi release note ne taşımalıdır?
- ne değişti
- kim etkilenir
- risk seviyesi
- breaking impact var mı
- migration/compatibility notu var mı
- özel dikkat gerektiren alan var mı

## 15.3. Release note sınıfları
- feature
- fix
- design system
- quality/tooling
- compatibility
- security
- observability
- breaking change

## 15.4. Zayıf davranışlar
- “misc fixes”
- “general improvements”
- breaking change’i changelog’a gömmek
- dependency major change’i not düşmeden yayınlamak

---

# 16. Breaking Change Politikası

## 16.1. Kural
Breaking change sessiz gerçekleşmez.

## 16.2. Breaking ne olabilir?
- public package API değişimi
- config contract değişimi
- token naming or semantic role break
- route/model assumptions break
- compat baseline değişimi
- tooling command contract değişimi
- contribution/audit flow’u etkileyen zorunlu yeni kural

## 16.3. Zorunlu çıktılar
- explicit note
- migration guidance
- gerekiyorsa ADR update
- DoD ve audit etkisi

---

# 17. Hotfix ve Normal Release Ayrımı

## 17.1. Kural
“Bunu hızlı çıkaralım” bahanesi hotfix değildir.

## 17.2. Hotfix sayılması için
- user-facing kritik etki olmalı
- beklemek maliyetli olmalı
- scope küçük tutulmalı
- sonradan root cause ve normalizasyon yapılmalı

## 17.3. Zayıf davranış
Her riskli değişikliği hotfix etiketiyle geçirmek.

---

# 18. Rollback Hazırlığı

## 18.1. Kural
Release planı, gerekirse geri alma düşüncesini içermelidir.

## 18.2. Özellikle kritik sınıflar
- auth/session changes
- navigation changes
- styling runtime / token changes
- query/mutation infrastructure changes
- observability wiring changes
- Expo/RN/Vite/Node compatibility changes

## 18.3. Beklenenler
- sorun durumunda ne geri alınacak?
- hangi sinyal rollback kararını tetikler?
- rollback sonrası docs/changelog nasıl işlenecek?

---

# 19. Environment Promotion Politikası

## 19.1. Kural
Preview, staging ve production aynı şey değildir.

## 19.2. Minimum mantık
- local → test/preview → staging → production
veya ürün yapısına göre benzer kontrollü promotion zinciri

## 19.3. Promotion kararı şuna dayanır
- kalite kapıları
- compatibility güveni
- observability readiness
- security hijyeni
- risk düzeyi

## 19.4. Web Deployment Stratejisi

Bu alt bölüm, projede React + Vite SPA uygulamasının static hosting ile nasıl serve edileceğini, hangi platformların tercih edileceğini, preview/staging/production akışını, CDN cache stratejisini ve deploy sonrası monitoring beklentilerini tanımlar.

### 19.4.1. Genel Yaklaşım
Bu proje React + Vite SPA (Single Page Application) mimarisi kullanır. Build çıktısı tamamen statik dosyalardan oluşur (HTML, JS, CSS, asset'ler). Bu nedenle server-side rendering veya dinamik backend gerektirmez; static hosting yeterlidir.

### 19.4.2. Hosting Seçimi
Hosting platformu olarak **Vercel** veya **Cloudflare Pages** tercih edilir. Bu tercihin nedenleri:
- **Zero-config deployment:** Repo bağlandığında otomatik build ve deploy başlar, özel sunucu konfigürasyonu gerekmez.
- **Preview environments:** Her PR için otomatik olarak izole bir preview URL üretilir.
- **Global CDN:** Statik dosyalar dünya genelinde edge node'larda cache'lenir, düşük latency sağlanır.
- **Edge functions:** Gerektiğinde sunucu taraflı mantık edge'de çalıştırılabilir (redirect, A/B test, header manipülasyonu).

Hosting seçimi bir ADR (Architecture Decision Record) ile kilitlenmelidir. Seçim yapıldıktan sonra keyfi platform değişikliği normal release akışıyla yapılamaz; ADR revizyon süreci gerektirir.

Alternatif hosting seçenekleri (gerektiğinde değerlendirilmek üzere):
- **Netlify:** Vercel'e benzer özellikler, form handling ve identity gibi ek servisler.
- **AWS S3 + CloudFront:** Tam kontrol, ama daha fazla konfigürasyon ve bakım yükü.
- **Self-hosted nginx:** Kurumsal kısıtlamalar gerektirdiğinde, ama operasyonel yük yüksek.

### 19.4.3. Build Süreci
- `pnpm build` komutu çalıştırılarak `dist/` klasörüne production build üretilir.
- Build output şunları içerir: statik `index.html`, hash'lenmiş JavaScript bundle dosyaları, hash'lenmiş CSS dosyaları, optimize edilmiş asset dosyaları (resim, font vb.).
- Build süreci deterministic olmalıdır: aynı commit'ten üretilen build her zaman aynı çıktıyı vermelidir.
- Build sırasında environment variable'lar inject edilir (ör: API URL, Sentry DSN). Bu değerler ortama göre farklılık gösterir.

### 19.4.4. Preview Environment
- Her PR açıldığında otomatik olarak bir preview deployment oluşturulur.
- Preview deployment, PR'daki değişikliklerin canlı ortamda test edilebileceği izole bir URL sağlar.
- Preview URL, PR yorumuna otomatik olarak eklenir. Böylece reviewer, kodu çekmeden tarayıcıda değişikliği görebilir.
- Preview environment, staging veya production backend'ine bağlanabilir (tercihen staging veya ayrı bir preview backend'e).
- PR kapatıldığında veya merge edildiğinde preview deployment otomatik olarak temizlenir.
- Preview environment, kod review sürecinin ayrılmaz parçasıdır. UI değişikliği içeren PR'larda preview URL kontrolü zorunludur.

### 19.4.5. Staging Deployment
- `main` branch'e merge sonrası staging environment'a otomatik deploy tetiklenir.
- Staging, production ile aynı altyapı konfigürasyonuna sahiptir (aynı hosting platform, aynı CDN yapısı) ancak farklı backend/API endpoint'leri ve farklı environment variable'ları kullanır.
- Staging ortamında QA testi, integration testi ve son kullanıcı kabul testi yapılır.
- Staging'de tespit edilen sorunlar production'a promote edilmeden düzeltilmelidir.

### 19.4.6. Production Deployment
- Staging'de onay verildikten sonra production ortamına promote edilir.
- Production deployment için önerilen stratejiler:
  - **Blue-green deployment:** İki identik ortam (blue ve green) arasında geçiş. Yeni versiyon green'e deploy edilir, trafik green'e yönlendirilir. Sorun olursa anında blue'ya geri dönülür.
  - **Canary deployment:** Yeni versiyon önce trafiğin küçük bir yüzdesine (ör: %5) sunulur. Metrikler izlenir. Sorun yoksa yüzde kademeli artırılır (%5 → %25 → %50 → %100).
- Production deployment penceresi tanımlanmalıdır (ör: Cuma akşamı deploy yapılmaz).
- Deploy sonrası en az 30 dakika aktif monitoring yapılır.

### 19.4.7. CDN ve Cache Stratejisi
- Tüm statik asset'ler (JS, CSS, resim, font) CDN edge node'larında cache'lenir.
- Hash'lenmiş dosyalar (ör: `main.a1b2c3.js`) için cache-control header: `max-age=31536000, immutable`. Bu, dosyanın 1 yıl boyunca cache'den servis edileceği ve içeriğinin değişmeyeceği anlamına gelir. Dosya adındaki hash değiştiğinde zaten farklı bir URL olacağı için stale cache riski yoktur.
- `index.html` dosyası için cache-control header: `no-cache`. Bu, her istekte origin'e doğrulama yapılacağı anlamına gelir. Böylece kullanıcı her zaman güncel `index.html` alır ve güncel JS/CSS bundle'larına yönlendirilir.
- Bu iki katmanlı cache stratejisi hem performansı maksimize eder hem de güncellemelerin anında yansımasını sağlar.

### 19.4.8. SSL ve Domain
- HTTPS zorunludur. HTTP üzerinden erişim HTTPS'e redirect edilmelidir.
- Custom domain yapılandırılır. Hosting provider'ın otomatik SSL sertifikası (Let's Encrypt veya provider'ın kendi sertifikası) kullanılır.
- Domain DNS yapılandırması hosting provider'ın dokümantasyonuna göre yapılır (CNAME veya A kaydı).
- www ve non-www arasında canonical redirect tanımlanır.

### 19.4.9. Deploy Sonrası Monitoring
- Her production deployment sonrasında şu kontroller yapılır:
  - **Sentry error spike kontrolü:** Deploy sonrası 30 dakika içinde yeni veya artan hata oranı izlenir. Ani artış varsa rollback değerlendirilir.
  - **Performance regression kontrolü:** Core Web Vitals metrikleri izlenir — özellikle LCP (Largest Contentful Paint) ve CLS (Cumulative Layout Shift). Belirgin kötüleşme varsa analiz edilir.
  - **Uptime kontrolü:** Ana sayfanın ve kritik API endpoint'lerinin erişilebilir olduğu doğrulanır.
- Monitoring sonuçları deploy log'una eklenir.

---

# 20. Dependency Upgrade Release Politikası

## 20.1. Kural
Dependency upgrade, release notlarında görünmez olmamalıdır.

## 20.2. Özellikle görünür olması gerekenler
- major upgrades
- compatibility-affecting minor changes
- security-related updates
- runtime or tooling baseline changes

## 20.3. Zayıf davranış
“dependencies updated” gibi anlamsız notlar.

---

# 21. Docs Sync Zorunluluğu

## 21.1. Kural
Aşağıdaki alanları etkileyen release docs sync olmadan tamamlanmış sayılmaz:
- canonical stack
- repo structure
- contribution flow
- audit/DoD rules
- auth/security boundaries
- observability rules
- compatibility matrix
- dependency policy impacts

## 21.2. Neden?
Çünkü bu proje docs-first’tür.  
Kod release edilip docs geride bırakılamaz.

---

# 22. Observability ile Bağ

`ADR-009` ve `28-observability-and-debugging.md` ile hizalı olarak:

- release/build metadata görünür olmalıdır
- post-release failure tracking mümkün olmalıdır
- changelog ve release note, issue correlation’a yardımcı olmalıdır

Release görünür değilse, rollback ve diagnosis zorlaşır.

---

# 23. Security ile Bağ

`27-security-and-secrets-baseline.md` ile hizalı olarak:

- release sırasında secret leakage olmamalı
- preview/staging/prod env ayrımı korunmalı
- hotfix bahanesiyle security hygiene bozulmamalı
- auth/session affecting changes daha yüksek dikkat ister

---

# 24. Contribution Etkisi

`30-contribution-guide.md` içinde release etkisi olan değişikliklerde şu sorular zorunlu olmalıdır:

1. Bu değişiklik release note gerektiriyor mu?
2. Compatibility matrix etkileniyor mu?
3. Breaking change var mı?
4. Docs sync gerekiyor mu?
5. Rollback düşünülmeli mi?

---

# 25. Audit Etkisi

`31-audit-checklist.md` içinde explicit release/versioning kontrol aileleri olmalıdır:
- changelog correctness
- release metadata visibility
- compatibility drift
- undocumented breaking change
- upgrade without revalidation
- hotfix misuse
- rollback unreadiness

---

# 26. Definition of Done Etkisi

`32-definition-of-done.md` içinde release-affecting work için şu kanıtlar aranmalıdır:
- compatibility değerlendirmesi yapıldı
- release note/changelog etkisi işlendi
- docs sync kapandı
- rollback/hotfix düşüncesi gerektiğinde ele alındı
- observability visibility mevcut

---

# 27. Incident Response ve Postmortem Süreci

Bu bölüm, production ortamında kritik hata veya servis kesintisi yaşandığında izlenecek müdahale sürecini ve sonrasında yapılacak retrospektif (postmortem) çalışmasını tanımlar. Amaç, incident anında kaotik ve bireysel tepkiler yerine, yapılandırılmış ve tekrarlanabilir bir süreç izlenmesini sağlamaktır.

## 27.1. Incident Severity (Ciddiyet) Sınıflandırması

Her incident, etkisine göre aşağıdaki ciddiyet seviyelerinden birine atanır. Bu sınıflandırma, müdahale hızını, iletişim kapsamını ve postmortem zorunluluğunu belirler.

- **SEV-1 (Kritik):** Servis tamamen çökmüş veya erişilemez durumdadır. Veri kaybı riski mevcuttur. Tüm kullanıcılar veya kullanıcıların büyük çoğunluğu etkilenmektedir. Ana iş akışı tamamen durmuştur. Örnek: Production veritabanı erişilemez, auth servisi tamamen down, uygulama açılmıyor.
- **SEV-2 (Yüksek):** Ana akış bozulmuş ancak bir workaround (geçici çözüm) mevcuttur. Kullanıcıların önemli bir kısmı etkilenmektedir ancak servis tamamen durmuş değildir. Örnek: Ödeme akışı başarısız ama yeniden deneme çalışıyor, ana sayfa yavaş yükleniyor ama erişilebilir, push notification'lar gitmiyor.
- **SEV-3 (Orta):** Minor (ikincil) bir feature bozuktur, kullanıcı etkisi sınırlıdır. Ana akış sağlam, ama belirli bir özellik düzgün çalışmıyor. Örnek: Profil fotoğrafı yüklenemiyor, belirli bir filtreleme çalışmıyor, dark mode'da renk bozuk.
- **SEV-4 (Düşük):** Kozmetik sorunlar veya performans düşüşü. Kullanıcı fonksiyonel olarak etkilenmiyor ama deneyim kalitesi düşük. Örnek: Buton hizalama bozuk, sayfa yüklenme süresi normalden %30 yavaş, console'da warning logları.

## 27.2. İlk Müdahale Süreci (SEV-1 ve SEV-2)

SEV-1 ve SEV-2 incident'lar için aşağıdaki adımlar sırasıyla ve hızla uygulanır:

1. **Bildirim:** Incident'ı ilk fark eden kişi, derhal Slack veya Teams'deki `#incident` kanalında durumu bildirir. Bildirimde şunlar yer alır: ne olduğu (kısa açıklama), ne zaman fark edildiği, tahmini etki alanı, mümkünse ekran görüntüsü veya hata mesajı.
2. **Acknowledge (Kabul):** On-call engineer veya tech lead, bildirimi gördükten sonra en geç 5 dakika içinde acknowledge eder (bildirimi gördüğünü ve üstlendiğini belirtir). Bu adım kritiktir çünkü kimsenin sahiplenmediği incident'lar uzar.
3. **Rollback Değerlendirmesi:** Sorunun yakın zamanda yapılmış bir deployment'tan kaynaklandığı tespit edilirse, hemen rollback uygulanır. Rollback kararı hotfix release kurallarına tabidir (bkz. §7 ve §18). Rollback yapılıp yapılmayacağına 15 dakika içinde karar verilmelidir.
4. **Durum Sayfası Güncellemesi:** Projenin bir durum sayfası (status page) varsa, incident başladığında durum "investigating" olarak güncellenir. Çözüm bulunduğunda "identified", düzeltme uygulandığında "monitoring", tamamen çözüldüğünde "resolved" olarak güncellenir.
5. **Periyodik Durum Güncellemesi:** Incident devam ettiği sürece her 30 dakikada bir durum güncellemesi yapılır. Güncelleme `#incident` kanalına yazılır ve şunları içerir: mevcut durum, yapılan işlemler, tahmini çözüm süresi, varsa yeni bulgular.

## 27.3. İletişim Kuralları

Incident'ın ciddiyet seviyesine göre iletişim kapsamı farklılaşır:

- **SEV-1:** Tüm takım bilgilendirilir. Tech lead, product owner ve gerekirse üst yönetim anında haberdar edilir. Tüm aktif çalışma durdurulup incident'a odaklanılır.
- **SEV-2:** Etkilenen alan sahipleri (feature owner, ilgili backend/frontend geliştiriciler) bilgilendirilir. Diğer takım üyelerine bilgi notu gönderilir.
- **SEV-3 ve SEV-4:** Asenkron bildirim yeterlidir. `#incident` kanalına yazılır, ilgili kişi uygun zamanda bakar. Acil müdahale beklenmez.

## 27.4. Postmortem Süreci

### 27.4.1. Ne Zaman Yazılır?
SEV-1 ve SEV-2 incident'lar için incident çözüldükten sonra en geç **48 saat** içinde postmortem yazılır. SEV-3 ve SEV-4 için postmortem zorunlu değildir ancak tekrarlayan SEV-3 incident'lar için yazılması önerilir.

### 27.4.2. Postmortem Template
Her postmortem aşağıdaki bölümleri içermelidir:

1. **Incident Özeti:** Ne oldu? Ne zaman başladı, ne zaman çözüldü? Toplam etki süresi ne kadardı? Kaç kullanıcı etkilendi (biliniyorsa tahmini sayı veya yüzde)?
2. **Timeline (Zaman Çizelgesi):** Dakika dakika ne yapıldı? Incident'ın ilk fark edildiği an, acknowledge edildiği an, rollback veya fix kararı, çözümün uygulandığı an, tamamen resolved olduğu an. Her adım saat:dakika formatında yazılır.
3. **Root Cause (Kök Neden Analizi):** Sorunun gerçek kök nedeni neydi? Bu analiz **5 Whys** yöntemiyle yapılır: "Neden?" sorusu en az 5 kez sorularak yüzeydeki belirtiden gerçek kök nedene inilir. Örnek: "Neden sayfa çöktü?" → "API 500 döndü" → "Neden 500 döndü?" → "Database connection pool tükendi" → "Neden tükendi?" → "Yeni feature connection'ları kapatmıyordu" → "Neden fark edilmedi?" → "Connection leak testi yoktu" → "Neden yoktu?" → "CI pipeline'da bu kontrol tanımlı değildi."
4. **Etkisi:** Kullanıcı etkisi (kaç kullanıcı, ne kadar süre, hangi akışlar), gelir etkisi (varsa tahmini gelir kaybı), itibar etkisi (müşteri şikayetleri, sosyal medya yansıması).
5. **Çözüm:** Sorun nasıl çözüldü? Rollback mı yapıldı, hotfix mi uygulandı, konfigürasyon mu değiştirildi?
6. **Eylem Maddeleri:** Aynı sorunun tekrar yaşanmaması için ne yapılacak? Her eylem maddesi somut, ölçülebilir ve bir kişiye atanmış olmalıdır. Deadline belirtilmelidir.
7. **Öğrenilen Dersler:** Bu incident'tan ne öğrendik? Süreçte neyi iyi yaptık, neyi daha iyi yapabilirdik? Gelecekte benzer durumlar için ne değişmeli?

### 27.4.3. Blameless (Suçlamaz) Kültür
Postmortem, bireyleri suçlamak için değil, sistemi iyileştirmek için yapılır. Bu prensip mutlak ve tartışmasızdır.

- **Yanlış soru:** "Kim bu hatayı yaptı? Kim bunu review'dan geçirdi?"
- **Doğru soru:** "Sistem neden bu hatanın production'a ulaşmasına izin verdi? Hangi kontrol katmanı eksikti?"

İnsan hatası kök neden olarak kabul edilmez. İnsan hata yapar; sistem, hatanın etkisini minimize edecek şekilde tasarlanmalıdır. Postmortem'de kişi isimleri yazılabilir (timeline doğruluğu için) ancak ton suçlayıcı değil, açıklayıcı olmalıdır.

### 27.4.4. Eylem Maddeleri Kuralları
- Her postmortem en az **1 somut eylem maddesi** üretmelidir. Eylem maddesi olmayan postmortem eksik kabul edilir.
- Eylem maddeleri örnekleri: "CI pipeline'a connection leak kontrolü eklenmeli" (atanan: X, deadline: tarih), "Bu senaryo için monitoring alert eklenmeli" (atanan: Y, deadline: tarih), "Load test senaryosuna bu case eklenmeli" (atanan: Z, deadline: tarih).
- Eylem maddeleri **2 hafta** içinde tamamlanmalıdır. Tamamlanmayan eylem maddeleri sprint retrospektifinde gündeme getirilir.
- Eylem maddeleri issue tracker'da (Jira, Linear, GitHub Issues vb.) ticket olarak oluşturulur ve takip edilir.

---

# 28. App Update Stratejisi (OTA ve Forced Update)

Bu bölüm, mobil uygulamanın (React Native / Expo) kullanıcılara nasıl güncelleştirileceğini, hangi durumlarda hangi güncelleme stratejisinin kullanılacağını, web SPA için güncelleme yaklaşımını ve hatalı güncelleme durumunda rollback prosedürünü tanımlar.

## 28.1. OTA (Over-the-Air) Update Nedir?

OTA update, Expo EAS Update altyapısı kullanılarak, App Store veya Google Play Store review sürecine girmeden JavaScript bundle'ının doğrudan kullanıcılara güncellenmesi yöntemidir. Kullanıcı uygulamayı açtığında yeni bundle otomatik olarak indirilir ve bir sonraki açılışta aktif olur.

Bu yöntemin avantajı, store review süresini (Apple için 24-48 saat, Google için birkaç saat) atlamak ve kritik düzeltmeleri dakikalar içinde kullanıcılara ulaştırabilmektir.

## 28.2. OTA Ne Zaman Kullanılır, Ne Zaman Kullanılmaz?

### OTA Kullanılabilecek Durumlar (yalnızca JS/asset değişiklikleri):
- UI düzeltmeleri (layout bozukluğu, renk hatası, hizalama sorunu)
- Copy (metin) değişiklikleri (typo düzeltme, çeviri güncelleme)
- Logic düzeltmeleri (hesaplama hatası, state yönetimi fix'i)
- Asset değişiklikleri (ikon değişimi, resim güncelleme)
- Yeni ekran veya feature ekleme (native bağımlılığı yoksa)

### OTA KULLANILAMAYACAK Durumlar (native değişiklik gerektirenler):
- Yeni native modül eklenmesi (ör: kamera, konum izni)
- Yeni native permission eklenmesi (ör: push notification izni, mikrofon erişimi)
- Native library eklenmesi veya güncellenmesi (ör: yeni bir SDK)
- `app.json` / `app.config.ts` içinde native build'i etkileyen değişiklikler (ör: yeni permission, yeni scheme)
- Expo SDK major upgrade'i

Bu durumlarda tam app store release (native build + store submission) gereklidir.

## 28.3. OTA Update Akışı

OTA update akışı adım adım şu şekilde işler:

1. **Publish:** Developer, EAS Update CLI komutuyla yeni JavaScript bundle'ını publish eder. Bundle, EAS Update sunucularına yüklenir ve belirli bir branch/channel ile ilişkilendirilir.
2. **Kontrol:** Kullanıcı uygulamayı açtığında, uygulama background'da (arka planda) EAS Update sunucusuna sorgu atar ve mevcut bundle'dan daha yeni bir bundle olup olmadığını kontrol eder.
3. **İndirme:** Yeni bundle varsa, kullanıcının mevcut oturumu kesintiye uğratılmadan background'da indirilir. Kullanıcı uygulamayı normal şekilde kullanmaya devam eder.
4. **Aktivasyon:** İndirilen yeni bundle, bir sonraki uygulama açılışında (app restart) aktif olur. Kullanıcı uygulamayı kapatıp tekrar açtığında yeni bundle ile başlar.

Bu akışın kritik özelliği, kullanıcının mevcut oturumunun hiçbir şekilde kesintiye uğramamasıdır. Kullanıcı bir formu doldururken, bir akışın ortasındayken veya herhangi bir işlem yaparken güncelleme zorlanmaz.

## 28.4. Forced Update (Zorunlu Güncelleme)

### 28.4.1. Ne Zaman Kullanılır?
Forced update, eski client'ın artık güvenli veya işlevsel şekilde çalışamayacağı durumlarda uygulanır:
- **Breaking API change:** Backend API'de eski client'ın anlayamayacağı yapısal değişiklik (endpoint kaldırma, response format değişikliği).
- **Güvenlik açığı:** Eski client'ta kritik güvenlik açığı tespit edilmesi (data leak riski, authentication bypass).
- **Yasal zorunluluk:** Yeni regülasyon veya uyumluluk gereksinimleri nedeniyle eski versiyonun kullanılmasının uygunsuz olması.

### 28.4.2. Minimum Versiyon Mekanizması
- Backend, bir `minimumAppVersion` endpoint'i sunar. Bu endpoint, uygulamanın çalışabilmesi için gereken minimum versiyon numarasını döner.
- Uygulama her açılışta bu endpoint'i kontrol eder.
- Client versiyonu minimum versiyondan düşükse, force update ekranı gösterilir ve uygulama kullanımı engellenir.
- Bu kontrol, splash screen veya app initialization aşamasında yapılır; kullanıcı uygulamanın ana ekranına ulaşmadan önce tamamlanır.

### 28.4.3. Force Update Ekranı
- **Görünüm:** Tam ekran, kapatılamaz modal. Kullanıcı bu ekranı bypass edemez, uygulamanın başka bir yerine gidemez.
- **Mesaj:** "Uygulamanın yeni bir sürümü mevcut. Devam etmek için lütfen uygulamayı güncelleyin." şeklinde açık ve anlaşılır bir metin.
- **Güncelleme nedeni:** Neden zorunlu güncelleme gerektiğine dair kısa açıklama eklenir. Örnek: "Güvenlik güncellemesi" veya "Yeni özellikler ve iyileştirmeler". Bu, kullanıcı güvenini korumak için önemlidir.
- **Buton:** App Store (iOS) veya Google Play Store (Android) uygulama sayfasına yönlendiren tek bir buton. Butona basıldığında ilgili store açılır.
- **Back butonu:** Android'de geri butonuna basıldığında uygulama kapanır (güncelleme ekranı atlanamaz).

### 28.4.4. Force Update Ekranı Spec Referansı

Force update ekranının somut spec'i `39-default-screens-and-components-spec.md` S02'de tanımlanmıştır: minimumAppVersion backend endpoint kontrolü, kapatılamaz tam ekran modal, store yönlendirme butonu ve OTA update akışıyla entegrasyon detaylıdır.

## 28.5. Web SPA Update Stratejisi

Web SPA uygulamasında, sayfa açıkken yeni bir deployment yapılması durumu farklı bir güncelleme stratejisi gerektirir:

- **Bildirim:** Kullanıcıya "Yeni versiyon mevcut. Sayfayı yenilemek için tıklayın." şeklinde bir toast (bildirim) gösterilir.
- **Otomatik yenileme YAPILMAZ:** Kullanıcı bir form doldururken, uzun bir metin yazarken veya herhangi bir işlem yaparken otomatik sayfa yenilemesi yapılmaz. Bu, veri kaybına yol açar ve kabul edilemez bir kullanıcı deneyimidir.
- **Versiyon kontrolü:** Service worker kullanılarak version check yapılır. Her deployment'ta service worker güncellenir. Service worker yeni versiyon tespit ettiğinde uygulamaya bildirir ve toast tetiklenir.
- **Kullanıcı kararı:** Kullanıcı hazır olduğunda toast'taki butona basarak sayfayı yeniler. Bu, kullanıcıya kontrol verir.

## 28.6. Versioning ve runtimeVersion İlişkisi

- OTA update'ler `runtimeVersion` ile ilişkilendirilir. `runtimeVersion`, native build'in hangi JS bundle'ları ile uyumlu olduğunu tanımlar.
- Native build değişmediği sürece, aynı `runtimeVersion` altında birden fazla OTA güncelleme yapılabilir.
- Native build değiştiğinde (yeni native modül, yeni permission, Expo SDK upgrade) yeni `runtimeVersion` tanımlanır. Eski native build'deki kullanıcılar, eski `runtimeVersion`'a ait OTA update'leri almaya devam eder; yeni `runtimeVersion`'daki update'leri almaz.
- Bu mekanizma, native build ile JS bundle arasındaki uyumsuzluğu önler.

## 28.7. OTA Rollback

Hatalı bir OTA update yayınlandığında:
- Önceki (çalışan) bundle'a EAS Update rollback komutuyla geri dönülür.
- Rollback işlemi yapıldığında, kullanıcılar bir sonraki uygulama açılışında eski (çalışan) bundle'ı alır.
- Rollback süreci: (1) Hatalı update tespit edilir, (2) `eas update:rollback` komutu çalıştırılır, (3) Yeni kullanıcı açılışlarında eski bundle indirilir, (4) Hatalı bundle'ı zaten indirmiş kullanıcılar bir sonraki açılışta rollback edilmiş bundle'ı alır.
- Rollback sonrası root cause analiz edilir ve düzeltilmiş yeni bir OTA update yayınlanır.

---

# 29. Anti-Pattern Listesi

Aşağıdaki davranışlar bu proje kapsamında doğrudan zayıf kabul edilir:

1. Merge olduysa release hazır sanmak
2. Compatibility matrix’i güncellemeden stack-sensitive dependency bump yapmak
3. Major değişikliği changelog’da gizlemek
4. Docs sync olmadan release çıkmak
5. Hotfix’i kalıcı release kültürü haline getirmek
6. Rollback hiç düşünmemek
7. “misc fixes” ile anlamlı impact’i saklamak
8. Security-sensitive değişikliği release risk notu olmadan çıkmak
9. Testing/observability etkisi büyük değişikliği sıradan patch gibi geçirmek
10. Release metadata görünmez bırakmak

---

# 30. Mobile App Store Submission Süreci

Bu bölüm, iOS (App Store) ve Android (Google Play Store) uygulama mağazalarına submission (gönderim) sürecini, build üretimini, code signing yönetimini, store listing hazırlığını, review sürecini, versioning kurallarını ve CI/CD entegrasyonunu tanımlar.

## 30.1. Build Üretimi

Production build, **EAS Build** (Expo Application Services) altyapısı kullanılarak üretilir. EAS Build, cloud ortamında native build işlemini gerçekleştirir; developer’ın lokal makinasında Xcode veya Android Studio kurulumuna gerek kalmaz.

- **iOS:** EAS Build sonucunda `.ipa` (iOS App Store Package) dosyası üretilir. Bu dosya, App Store veya TestFlight’a yüklenebilecek imzalanmış binary’dir.
- **Android:** EAS Build sonucunda `.aab` (Android App Bundle) dosyası üretilir. AAB formatı, Google Play Store’un cihaz özelliklerine göre optimize edilmiş APK’lar üretmesini sağlar (daha küçük indirme boyutu). APK yerine AAB kullanılması zorunludur (Google Play politikası).

## 30.2. Code Signing (Kod İmzalama)

### 30.2.1. iOS Code Signing
- **Apple Developer Program** üyeliği zorunludur (yıllık ücretli). Üyelik olmadan App Store’a uygulama yüklenemez.
- Code signing için gereken iki bileşen: **Provisioning Profile** ve **Distribution Certificate**.
- EAS Build, **managed credentials** (yönetilen kimlik bilgileri) modu ile bu bileşenleri otomatik olarak oluşturur, saklar ve yönetir. Developer’ın Manuel olarak sertifika oluşturması ve .p12 dosyaları ile uğraşması gerekmez.
- Managed credentials kullanıldığında, sertifikalar EAS sunucularında güvenli şekilde saklanır ve build sırasında otomatik olarak uygulanır.
- Alternatif olarak, kurumsal politikalar gerektiriyorsa, local credentials kullanılabilir (developer kendi sertifikalarını sağlar).

### 30.2.2. Android Code Signing
- Android uygulamalar, bir **upload keystore** ile imzalanır. Bu keystore, uygulamanın kimliğini doğrular.
- EAS Build, varsayılan olarak upload keystore’u otomatik oluşturur ve yönetir (managed credentials).
- Alternatif olarak, mevcut bir keystore dosyası manuel olarak sağlanabilir (kurumsal gereksinimler veya mevcut uygulama migration durumlarında).
- **Google Play App Signing:** Google Play Console, upload keystore ile yüklenen bundle’ı kendi signing key’i ile yeniden imzalar. Bu, Google’ın key rotation ve güvenlik yönetimini üstlenmesini sağlar.
- Upload keystore kaybolursa, Google Play App Signing etkin olduğu sürece yeni bir upload key oluşturulabilir (App Store’dan farklı olarak kurtarma mümkündür).

## 30.3. iOS Submission Süreci

iOS uygulama submission süreci adım adım şu şekilde işler:

1. **Build üretimi:** `eas build --platform ios --profile production` komutuyla production profilli iOS build başlatılır. EAS Build cloud ortamında `.ipa` dosyası üretir.
2. **TestFlight’a yükleme:** `eas submit --platform ios` komutuyla üretilen `.ipa` dosyası Apple TestFlight’a yüklenir. TestFlight, Apple’ın beta test platformudur.
3. **Internal test:** TestFlight’ta internal test grubu (takım üyeleri, en fazla 100 kişi) uygulamayı test eder. Internal test için Apple review gerekmez.
4. **External test (opsiyonel):** Daha geniş bir beta test grubu için external test yapılabilir. External test grupları Apple’ın hafif bir review sürecinden geçer.
5. **App Store Connect metadata:** App Store Connect’te uygulama sayfası için gerekli bilgiler doldurulur:
   - **Uygulama açıklaması:** Uygulamanın ne yaptığını anlatan metin (kısa açıklama + detaylı açıklama).
   - **Ekran görüntüleri (screenshot):** Her desteklenen cihaz boyutu için ekran görüntüleri yüklenir (detaylar §30.8’de).
   - **Privacy policy URL:** Gizlilik politikası sayfasının URL’si (zorunlu).
   - **Kategori:** Uygulamanın store’da listeleneceği kategori seçilir (ör: Productivity, Social Networking, Business).
   - **Anahtar kelimeler:** Store aramasında bulunabilirlik için anahtar kelimeler.
   - **App Privacy (Data Collection):** Uygulamanın topladığı veri türleri beyan edilir (Apple’ın privacy nutrition label’ı).
6. **Review’a gönderme:** Metadata tamamlandıktan sonra uygulama Apple review’a gönderilir.
7. **Apple review:** Apple review ekibi uygulamayı App Store Review Guidelines’a göre inceler. Ortalama süre **24-48 saat**’tir ancak bazen daha uzun sürebilir. Reject (red) durumunda neden belirtilir ve düzeltme yapılıp yeniden gönderilir.
8. **Release:** Onay sonrası uygulama yayınlanır. İki seçenek: **Manuel release** (developer butona basarak yayınlar) veya **otomatik release** (onay sonrası hemen yayınlanır). İlk release’lerde manuel release önerilir.

## 30.4. Android Submission Süreci

Android uygulama submission süreci adım adım şu şekilde işler:

1. **Build üretimi:** `eas build --platform android --profile production` komutuyla production profilli Android build başlatılır. EAS Build cloud ortamında `.aab` dosyası üretir.
2. **Play Console’a yükleme:** `eas submit --platform android` komutuyla üretilen `.aab` dosyası Google Play Console’a yüklenir.
3. **Test track’lerde test:** Google Play Console’da farklı test seviyeleri mevcuttur:
   - **Internal testing:** Takım üyeleri ile test (en hızlı, review gerektirmez).
   - **Closed testing:** Davet edilen kullanıcılarla beta test.
   - **Open testing:** Herkesin katılabileceği açık beta (opsiyonel).
4. **Store listing metadata:** Play Console’da uygulama sayfası için gerekli bilgiler doldurulur:
   - **Uygulama açıklaması:** Kısa açıklama (80 karakter) + detaylı açıklama (4000 karakter).
   - **Ekran görüntüleri (screenshot):** Her desteklenen cihaz tipi için ekran görüntüleri yüklenir (detaylar §30.8’de).
   - **Privacy policy URL:** Gizlilik politikası sayfasının URL’si (zorunlu).
   - **Content rating:** IARC (International Age Rating Coalition) content rating anketi doldurulur. Bu, uygulamanın yaş sınıflandırmasını belirler.
   - **Data safety:** Uygulamanın topladığı ve paylaştığı veri türleri beyan edilir.
5. **Production track’e promote:** Test aşaması tamamlandıktan sonra uygulama production track’e promote edilir.
6. **Google review:** Google review ekibi uygulamayı Google Play politikalarına göre inceler. Ortalama süre **birkaç saat ile 1 gün** arasındadır (genellikle Apple’dan hızlıdır).
7. **Staged rollout (kademeli yayın):** Production release kademeli olarak yapılır:
   - **%5** kullanıcıya açılır → metrikler izlenir → sorun yoksa
   - **%20** → metrikler izlenir → sorun yoksa
   - **%50** → metrikler izlenir → sorun yoksa
   - **%100** — tam yayın

   Staged rollout sırasında crash rate veya kötü yorum artışı tespit edilirse, rollout durdurulur ve fix hazırlanır.

## 30.5. App Versioning

- Versiyon bilgileri `app.json` veya `app.config.ts` dosyasında tanımlanır.
- İki farklı versiyon kavramı vardır:

### 30.5.1. `version` (Semantic Version)
- Store’da kullanıcıya görünen versiyon numarası (ör: “1.2.3”).
- Semantic versioning (semver) kurallarına uyar: `major.minor.patch`.
- Kullanıcı “Uygulama hakkında” ekranında bu versiyonu görür.
- Her anlamlı güncellemede artırılır.

### 30.5.2. `buildNumber` (iOS) ve `versionCode` (Android)
- Store’un internal olarak kullandığı, her build’de benzersiz olması gereken numara.
- **iOS `buildNumber`:** String formatında (ör: “42”). Her TestFlight veya App Store yüklemesinde bir önceki yüklemeden büyük olmalıdır.
- **Android `versionCode`:** Integer formatında (ör: 42). Her Play Console yüklemesinde bir önceki yüklemeden kesinlikle büyük olmalıdır. Azaltılamaz.
- **Her build’de artırılmalıdır.** Aynı `buildNumber`/`versionCode` ile iki farklı binary yüklenemez.
- EAS Build, `autoIncrement` özelliği ile bu numarayı otomatik artırabilir.

## 30.6. Privacy Policy

- Her iki store’da (Apple App Store ve Google Play Store) gizlilik politikası **zorunludur**.
- Gizlilik politikası, uygulamanın topladığı verileri, bu verilerin nasıl kullanıldığını, üçüncü taraflarla paylaşılıp paylaşılmadığını ve kullanıcının haklarını açıkça belirtmelidir.
- Gizlilik politikası bir web sayfası olarak barındırılır ve URL’si store listing’e eklenir.
- Uygulama içinden de erişilebilir olmalıdır (ayarlar ekranında “Gizlilik Politikası” linki).
- KVKK (Kişisel Verilerin Korunması Kanunu) ve gerekiyorsa GDPR uyumluluğu sağlanmalıdır.

## 30.7. Screenshot ve Metadata Gereksinimleri

### 30.7.1. Genel Yaklaşım
- Her platform için farklı boyut gereksinimleri vardır. Ekran görüntüleri Figma’da hazırlanan template’ler kullanılarak üretilir.
- Ekran görüntüleri uygulamanın gerçek ekranlarından alınır, mock veya yanıltıcı görsel kullanılmaz (store reject nedeni olur).
- Metinler lokalize edilir (Türkçe store listing için Türkçe screenshot metinleri).

### 30.7.2. iOS Screenshot Boyutları (Minimum Zorunlu)
- **iPhone 6.7” (iPhone 15 Pro Max / 16 Pro Max):** 1290 x 2796 px — zorunlu.
- **iPhone 5.5” (iPhone 8 Plus):** 1242 x 2208 px — zorunlu.
- **iPad 12.9” (iPad Pro 6th gen):** 2048 x 2732 px — iPad desteği varsa zorunlu.
- Minimum 3, maksimum 10 screenshot yüklenebilir. 5-6 screenshot önerilir.

### 30.7.3. Android Screenshot Boyutları (Minimum Zorunlu)
- **Phone:** Minimum 2, maksimum 8 screenshot. Önerilen boyut: 1080 x 1920 px veya üzeri.
- **7-10” Tablet:** Tablet desteği varsa zorunlu. Önerilen boyut: 1200 x 1920 px veya üzeri.
- Feature graphic (1024 x 500 px): Store listing’de öne çıkan görsel, zorunludur.

### 30.7.4. Figma Template
- Tüm screenshot boyutları için Figma’da template hazırlanmalıdır. Template şunları içerir: cihaz frame (opsiyonel), arka plan, başlık metni, gerçek uygulama ekran görüntüsü.
- Template kullanımı, tüm screenshot’ların tutarlı görünmesini sağlar ve güncelleme sürecini hızlandırır.

## 30.8. App Review Guidelines — Dikkat Edilmesi Gerekenler

### 30.8.1. Apple App Store Review Guidelines
- **Apple HIG (Human Interface Guidelines) uyumu zorunludur.** Bu zaten projenin core prensiplerinden biridir (bkz. UI/UX belgeleri).
- Yaygın reject nedenleri:
  - Uygulama crash veriyor veya temel feature çalışmıyor
  - Metadata yanıltıcı (açıklama ile uygulama uyumsuz)
  - Privacy policy eksik veya yetersiz
  - Login gerektiren uygulamada test hesabı (demo account) sağlanmamış
  - In-app purchase dışı ödeme yönlendirmesi
  - Clipboard, kamera, konum gibi izinler gereksiz yere istenmiş veya kullanım amacı açıklanmamış
- Review’a gönderirken “Notes to Reviewer” bölümüne test hesabı bilgileri ve varsa özel talimatlar yazılmalıdır.

### 30.8.2. Google Play Store Politikaları
- **Google Material Design** uyumu önerilir ancak zorunlu değildir. Store review’da Material Design uyumsuzluğu nedeniyle reject olmaz ama iyi UX beklenir.
- Yaygın reject nedenleri:
  - Uygulama crash veriyor veya ANR (Application Not Responding) oranı yüksek
  - Content rating yanlış veya eksik
  - Data safety beyanı ile gerçek veri toplama uyumsuz
  - Kullanıcı verileri izinsiz paylaşılıyor
  - Arka plan servisleri gereksiz yere çalışıyor (batarya tüketimi)
  - Deceptive behavior (yanıltıcı davranış, gizli izleme)

## 30.9. CI/CD Entegrasyonu ve Otomasyon

- EAS Build ve EAS Submit, CI/CD pipeline’a entegre edilebilir ve edilmelidir.
- Önerilen otomasyon akışı:
  - `main` branch’e merge sonrası otomatik EAS Build tetiklenir.
  - Build başarılı olursa otomatik olarak TestFlight’a (iOS) ve internal test track’e (Android) yüklenir.
  - Staging ortamında test edildikten ve onay verildikten sonra, production release manuel olarak tetiklenir.
- CI/CD pipeline şu adımları içerir:
  1. `main` branch merge trigger
  2. `eas build --platform all --profile production`
  3. Build başarı kontrolü
  4. `eas submit --platform ios` (TestFlight’a)
  5. `eas submit --platform android` (internal track’e)
  6. Slack/Teams bildirim (build ve upload durumu)
- Production’a promote etme (App Store’da release, Play Store’da production track) her zaman manuel onay gerektirir. Tam otomatik production release yapılmaz.

## 30.10. Hotfix Süreci (Mobil)

Kritik bir bug tespit edildiğinde izlenecek hızlı düzeltme süreci:

- **JS değişikliği yeterliyse (native değişiklik gerekmiyorsa):** OTA update kullanılır (bkz. §28). Bu en hızlı yoldur — store review süreci atlanır, dakikalar içinde kullanıcılara ulaşır.
- **Native değişiklik gerekiyorsa:**
  - **iOS:** Hızlı native build üretilir. Apple’a **expedited review** (hızlandırılmış inceleme) talep edilir. Expedited review, kritik bug fix’ler için Apple’ın sunduğu öncelikli inceleme seçeneğidir. Garanti değildir ama genellikle 24 saat içinde sonuç alınır.
  - **Android:** Hızlı native build üretilir. Play Console’da **immediate rollout** (anında yayın) seçilerek staged rollout atlanır ve güncelleme tüm kullanıcılara hemen sunulur. Google review süresi genellikle birkaç saattir.
- Her iki durumda da hotfix sonrası postmortem yapılır (bkz. §27).

---

# 31. Onay Kriterleri

Bu belge yeterli kabul edilir eğer:

1. Release readiness yalnızca CI yeşiline indirgenmemişse
2. Compatibility, docs sync ve observability release sürecine bağlanmışsa
3. `37` ve `38` ile açık ilişki kurulmuşsa
4. hotfix / rollback / breaking change kuralları görünürse
5. contribution, audit ve DoD etkileri yazılmışsa
6. stack-sensitive değişiklikler için özel rejim tanımlanmışsa
7. Bu belge release governance standardı olarak gerçek kullanıma uygun netlikteyse

---

# 32. Kısa Sonuç

Bu proje için release ve versioning standardı şudur:

- release yalnızca publish/merge olayı değildir
- compatibility, docs sync, observability ve rollback readiness resmi parçalarıdır
- stack-sensitive dependency değişiklikleri özel dikkat ister
- changelog ve release notes anlamlı olmalıdır
- breaking change sessiz yapılamaz
- hotfix istisnadır, normal süreç yerine geçmez

---

# 33. OTA Güncelleme Disiplini (2026-04-01 Eki)

Bu bölüm, OTA (Over-the-Air) güncelleme sürecini, OTA ile store build ayrımını, release disiplinini, versiyon ilişkisini ve monitoring gereksinimlerini tanımlar. ADR-015 referansı bu bölümün tamamı için geçerlidir.

## 33.1. OTA vs Store Build Ayrımı

- **JS-only değişiklik:** OTA update yeterlidir. JavaScript bundle'ı güncellenerek store review süreci atlanabilir.
- **Native code değişikliği:** Yeni native modül eklenmesi, SDK versiyon güncellemesi veya native konfigürasyon değişikliği durumunda store build zorunludur.
- **Temel kural:** Emin değilsen store build tercih et. Yanlış OTA update, runtime crash'lere yol açabilir.

## 33.2. OTA Release Süreci

- Code review tamamlanmış olmalıdır; OTA update de normal code review sürecinden geçmelidir.
- Staging channel'da test edilmiş olmalıdır; OTA update doğrudan production'a yayınlanmamalıdır.
- **Staged rollout:** Önce %10 kullanıcıya yayınla, crash rate ve hata oranını monitör et. Sorun yoksa %50'ye, ardından %100'e çıkar.
- **Rollback:** Önceki bundle'a hızlı dönüş planı her zaman hazır olmalıdır. OTA update geri alınabilir olmalıdır.

## 33.3. OTA ve Versiyon İlişkisi

- OTA update, runtime version ile eşleşmelidir. Runtime version mismatch durumunda OTA uygulanmaz ve kullanıcı eski bundle ile kalmaya devam eder.
- Semver ile OTA uyumu tanımlanmalıdır: patch ve minor güncellemeler OTA ile yapılabilir; major güncelleme genellikle store build gerektirir.
- EAS Update channel ve runtime version mapping dokümante edilmelidir.

## 33.4. OTA Monitoring

- Update adoption rate izlenmelidir; kaç kullanıcının yeni bundle'ı aldığı görünür olmalıdır.
- Post-update crash rate karşılaştırması zorunludur: güncelleme öncesi ve sonrası crash rate'leri karşılaştırılmalıdır.
- Başarısız update durumunda otomatik rollback mekanizması düşünülmelidir.
- OTA update başarı/başarısızlık oranları dashboard'da izlenmelidir.

---

# 34. App Store Optimization ve Store Listing (2026-04-01 Eki)

Bu bölüm, App Store ve Google Play Store listing gereksinimlerini, ASO (App Store Optimization) ilkelerini, store metadata versiyon kontrolünü, rating/review yönetimini ve store review guideline uyumunu tanımlar.

## 34.1. Store Listing Gereksinimleri

- **App Store:**
  - Başlık: maksimum 30 karakter
  - Altyazı: maksimum 30 karakter
  - Açıklama: maksimum 4000 karakter
  - Anahtar kelimeler: maksimum 100 karakter
- **Google Play:**
  - Başlık: maksimum 30 karakter
  - Kısa açıklama: maksimum 80 karakter
  - Tam açıklama: maksimum 4000 karakter
- **Screenshot:** Her platform için önerilen boyutlarda, tüm desteklenen cihaz kategorileri için screenshot hazırlanmalıdır.
- **Preview video:** Opsiyoneldir ancak dönüşüm oranını artırdığı için önerilir.

## 34.2. ASO Temel İlkeleri

- Long-tail keyword stratejisi uygulanmalıdır. 2026'da AI-generated tag'lerin store arama algoritmalarına etkisi değerlendirilmelidir.
- Keyword ve başlık optimizasyonu: en yüksek arama hacimli anahtar kelimeler başlık ve altyazıda kullanılmalıdır.
- Screenshot'larda özellik vurgulama (feature callout) yapılmalıdır; yalnızca ekran görüntüsü değil, değer önerisi iletilmelidir.
- Lokalize store listing: i18n altyapısı ile uyumlu şekilde her desteklenen dil için ayrı store listing hazırlanmalıdır (ADR-011 referansı).

## 34.3. Store Metadata Versiyon Kontrolü

- Store listing metni ve screenshot'lar repo'da tutulmalıdır.
- Fastlane `deliver` (iOS) ve `supply` (Android) ile otomatik yükleme yapılmalıdır.
- Her release ile birlikte metadata gözden geçirilmeli ve gerektiğinde güncellenmelidir.

## 34.4. Rating ve Review Yönetimi

- **In-app review prompt:** `StoreReview` API kullanılmalıdır (`expo-store-review` paketi).
- **Prompt timing:** Olumlu deneyim sonrası gösterilmelidir (örneğin: başarılı işlem tamamlama, hedefe ulaşma gibi pozitif anlar).
- **Rate limiting:** Aynı kullanıcıya tekrar tekrar review prompt gösterilmemelidir. Platform API'leri bu sınırlamayı kısmen yönetir, ancak uygulama tarafında da kontrol sağlanmalıdır.
- **Kötü deneyim sonrası:** Hata, crash veya başarısız işlem sonrasında review prompt göstermek yasaktır.

## 34.5. Store Review Guideline Uyumu

- **Apple App Review Guidelines:**
  - IAP (In-App Purchase) zorunluluğu: dijital içerik satışı için Apple IAP kullanılmalıdır.
  - Privacy label: App Store Connect'te doğru ve güncel privacy label tanımlanmalıdır.
  - Data use: kullanıcı verisi toplama ve paylaşma beyanları gerçek durumla uyumlu olmalıdır.
- **Google Play Policy:**
  - Billing policy: dijital içerik satışı için Google Play Billing kullanılmalıdır.
  - User data policy: veri toplama, paylaşma ve data safety beyanı uyumlu olmalıdır.
  - Deceptive behavior: yanıltıcı davranış, gizli izleme veya kullanıcıyı aldatan pratikler yasaktır.
- **Pre-submission checklist:** Her release öncesi platform guideline'ları kontrol edilmelidir. Yeni guideline değişiklikleri takip edilmeli ve uyum sağlanmalıdır.
