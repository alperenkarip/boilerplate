# 37-dependency-policy.md

## Doküman Kimliği

- **Doküman adı:** Dependency Policy
- **Dosya adı:** `37-dependency-policy.md`
- **Doküman türü:** Governance / dependency management policy / package acceptance standard
- **Durum:** Accepted
- **Kapsam:** Bu belge, boilerplate kapsamında hangi dependency’lerin hangi koşullarda kabul edileceğini, hangi dependency sınıflarının riskli veya yasak sayılacağını, dependency ekleme/çıkarma/upgrade/deprecation/fork/patch süreçlerinin nasıl yönetileceğini, vendor lock-in ve bakım risklerinin nasıl değerlendirileceğini ve dependency kararlarının dokümantasyon-first mimari ile nasıl bağlanacağını tanımlar.
- **Bağlı olduğu üst dokümanlar:**
  - `01-working-principles.md`
  - `06-application-architecture.md`
  - `07-module-boundaries-and-code-organization.md`
  - `15-quality-gates-and-ci-rules.md`
  - `17-technology-decision-framework.md`
  - `21-repo-structure-spec.md`
  - `36-canonical-stack-decision.md`
  - `ADR-001` → `ADR-019`
- **Doğrudan etkileyeceği dokümanlar:**
  - `19-roadmap-to-implementation.md`
  - `20-initial-implementation-checklist.md`
  - `21-repo-structure-spec.md`
  - `29-release-and-versioning-rules.md`
  - `30-contribution-guide.md`
  - `31-audit-checklist.md`
  - `38-version-compatibility-matrix.md`

---

# 1. Amaç

Bu dokümanın amacı, dependency seçimini “paket bulduk, kurduk, çalıştı” seviyesinden çıkarıp; **risk, bakım, mimari tutarlılık, design system disiplini, güvenlik, test edilebilirlik ve uzun vadeli sürdürülebilirlik** üzerinden yönetilen resmi karar alanına dönüştürmektir.

Bu belge şu sorulara net cevap verir:

1. Yeni bir dependency hangi koşullarda kabul edilir?
2. Hangi dependency tipleri yüksek riskli sayılır?
3. Hangi dependency’ler varsayılan olarak zayıf kabul edilir?
4. Runtime dependency ile dev dependency aynı ciddiyetle mi ele alınır?
5. UI library, state library, native bridge, analytics SDK, auth SDK ve build tool’lar hangi kriterlerle değerlendirilir?
6. Bir dependency ne zaman doğrudan reddedilir?
7. Patch, fork veya local wrapper ne zaman meşrudur?
8. Upgrade, deprecation ve removal nasıl yönetilir?
9. Dependency kararları ADR ve canonical stack ile nasıl bağlanır?
10. “Küçük paket” bahanesiyle kalite standardı nasıl delinmez?

Bu belge paket listesi değildir.  
Bu belge, **paket kabul ve yönetim anayasasıdır**.

---

# 2. Neden Bu Doküman Gerekli

Dependency politikası yazılmazsa şu bozulmalar çok hızlı başlar:

- aynı problemi çözmek için üç farklı library gelir
- küçük yardımcı paketler kontrolsüz çoğalır
- web ve mobile tarafı farklı dependency kültürlerine kayar
- design system dışında UI helper’ları çoğalır
- transitif risk görünmez kalır
- abandoned paketler projeye sızar
- peer dependency sorunları büyür
- upgrade kabiliyeti düşer
- local patch’ler kalıcı çözüme dönüşür
- bundle/runtime/binary boyutu gereksiz büyür
- debug kolaylığı adına güvenlik ve mimari sınırlar delinir
- “şimdilik bunu kuralım” refleksi production standardına sızar

Bu proje documentation-first olduğu için dependency kararı da belgeli ve denetlenebilir olmak zorundadır.  
Aksi halde canonical stack kararı yalnızca niyet düzeyinde kalır.

---

# 3. Temel Tez

Bu proje kapsamında temel tez şudur:

> Dependency eklemek, yalnızca teknik ihtiyacı kapatma kararı değildir; mimari, bakım, güvenlik, observability, test, upgrade ve ürün standardı üzerinde kalıcı etkisi olan stratejik karardır. Bu nedenle her dependency, çözmek istediği problemi, getirdiği yeni bağımlılık yüzeyini ve uzun vadeli maliyetini birlikte açıklayabilmelidir.

Bu tez şu sonuçları doğurur:

1. “Çalışıyor olması” kabul için yeterli değildir.
2. Küçük paketler düşük riskli sayılmaz.
3. UI ve native dependency’ler ekstra dikkat ister.
4. Bir problemi kendi sistemimizde çözmek ile paket almak arasında maliyet hesabı yapılmalıdır.
5. Canonical stack ile çelişen paketler yalnızca istisnai ve belgeli gerekçeyle girer.
6. Dependency kararı ADR gerekebilecek kadar önemli olabilir.

---

# 4. Bu Doküman Ne Yapar, Ne Yapmaz?

## 4.1. Ne yapar?

- Dependency kabul kriterlerini tanımlar
- Red flag ve rejection kriterlerini yazar
- Dependency sınıflarını risk düzeyine göre ayırır
- Upgrade / deprecation / patch / fork kuralları koyar
- Canonical stack ile uyum zorunluluğunu resmileştirir
- Runtime ve dev tooling ayrımını görünür kılar

## 4.2. Ne yapmaz?

- Her paket için tek tek son kararı bu belgede vermez
- Exact sürüm numaraları tutmaz
- License incelemesini tek başına tamamlamaz
- Güvenlik taramasının yerine geçmez
- Compatibility matrix’in yerini tutmaz

Bu belge **karar çerçevesini ve politika sınırlarını** koyar.

---

# 5. Dependency Kararı Verirken Ana Sorular

Yeni bir dependency düşünülmeden önce şu sorular zorunlu olarak sorulmalıdır:

1. Çözmek istediğimiz problem tam olarak ne?
2. Bu problem canonical stack içinde zaten çözülebiliyor mu?
3. Bu dependency mimari sınırları güçlendiriyor mu, deliyor mu?
4. Web ve mobile açısından etkisi ne?
5. Runtime’a mı giriyor, yoksa yalnızca toolchain’e mi?
6. Bakım, upgrade ve security yüzeyi ne kadar büyüyor?
7. Bu paketin yerine daha küçük, daha yerel veya daha sistemik çözüm var mı?
8. Bu dependency vendor lock-in yaratıyor mu?
9. Test edilebilirlik ve observability’yi iyileştiriyor mu, kötüleştiriyor mu?
10. Bir yıl sonra bunu güncel tutmak ne kadar zor olacak?

Bu soruların cevabı net değilse dependency kararı erkendir.

---

# 6. Dependency Sınıfları

Bu boilerplate kapsamında dependency’ler en az aşağıdaki sınıflarda düşünülmelidir:

1. **Canonical core runtime dependencies**
2. **Platform/runtime support dependencies**
3. **UI / design system dependencies**
4. **State / data / forms dependencies**
5. **Auth / security / storage dependencies**
6. **Observability / telemetry dependencies**
7. **Testing dependencies**
8. **Build / tooling / lint / static analysis dependencies**
9. **Native bridge / platform integration dependencies**
10. **Low-level utility dependencies**

Her sınıf aynı riskle değerlendirilmez.

---

# 7. Risk Derecesine Göre Dependency Aileleri

## 7.1. Düşük-orta riskli tipik adaylar

- formatting helpers
- küçük saf utility paketleri
- test-only helpers
- typed helper libraries
- build-time support tools

## 7.2. Orta-yüksek riskli adaylar

- form engine
- state management library
- validation library
- routing library
- design system runtime dependency
- analytics SDK
- auth SDK

## 7.3. Yüksek riskli adaylar

- UI framework / component framework
- native bridge dependencies
- storage/security packages
- codegen affecting runtime architecture
- observability SDK with aggressive auto-capture
- network stack replacements
- magic all-in-one framework packages

Risk yüksekse kabul çıtası yükselir.

---

# 8. Canonical Stack Uyum Zorunluluğu

## 8.1. Kural

Yeni dependency, `36-canonical-stack-decision.md` ve ilgili ADR seti ile çelişmemelidir.

## 8.2. Ne anlama gelir?

Aşağıdaki yönlerle doğrudan çelişen dependency eklemek normal kabul edilmez:

- React + Vite web yönü
- React Native + Expo mobile yönü
- Firebase backend / data / auth yönü (ADR-020, ADR-021)
- Zustand state policy
- koşullu TanStack Query async data policy (ADR-005)
- RHF + Zod forms policy
- Tailwind + NativeWind styling policy
- Sentry error tracking baseline
- i18next localization baseline
- pnpm + Turborepo monorepo kararı

## 8.3. Sonuç

Canonical kararı bypass eden dependency, basit paket ekleme değil; **karar revizyonu** sayılır ve çoğu durumda ADR ister.

---

# 9. Kabul Kriterleri — Temel Çerçeve

Bir dependency ancak aşağıdaki eksenlerin çoğunu yeterli karşılıyorsa kabul adayıdır:

1. **Açık problem çözümü**
2. **Mimari uyum**
3. **Ekosistem olgunluğu**
4. **Bakım sürdürülebilirliği**
5. **Test edilebilirlik**
6. **TypeScript uyumu**
7. **Security / privacy uygunluğu**
8. **Performance / bundle / binary maliyetinin makul oluşu**
9. **DX faydasının gerçek olması**
10. **Vendor lock-in riskinin bilinçli kabul edilebilir olması**

---

# 10. Ekosistem Olgunluğu Kriteri

## 10.1. Kural

Dependency’nin aktif ve güvenilir bakım sinyalleri olmalıdır.

## 10.2. Değerlendirme alanları

- aktif bakım var mı?
- son yayınlar makul sıklıkta mı?
- issue/PR yüzeyi tamamen ölü mü?
- dokümantasyon yeterli mi?
- ciddi bilinen kırıklar var mı?
- community kullanımı anlamlı mı?

## 10.3. Zayıf sinyaller

- uzun süredir ölü repo
- maintainer görünmezliği
- belgesiz veya eksik API yüzeyi
- sık kırılan ama düzelmeyen issue geçmişi
- peer dependency kaosu

Ekosistem olgunluğu zayıfsa kabul çıtası çok yükselir.

---

# 10A. pnpm Supply-Chain Security Baseline

## 10A.1. Kural

Dependency policy yalnızca "hangi paketi alalım" sorusu değildir; install-time güvenlik de resmi politika alanıdır. Bu boilerplate'te pnpm 10.x için aşağıdaki baseline zorunludur:

- `minimumReleaseAge` tanımlanır. Varsayılan öneri **en az 1440 dakika (24 saat)** gecikmedir; daha agresif güvenlik isteyen ekipler bunu yükseltebilir.
- Build script çalıştırma izni global olarak açılmaz; trusted paketler `allowBuilds` ile açık allowlist mantığında işaretlenir.
- `trustPolicy: no-downgrade` etkin düşünülür; bir paketin trust seviyesindeki düşüş sessizce kabul edilmez.
- `dangerouslyAllowAllBuilds` baseline dışıdır.

## 10A.2. Ne anlama gelir?

1. Yeni eklenen dependency install sırasında build script çalıştırmak istiyorsa otomatik meşru sayılmaz.
2. `pnpm approve-builds` veya eşdeğer yazılı allowlist kararı olmadan script execution kabul edilmez.
3. Güvenlik istisnaları `44-exception-and-exemption-policy.md` ile belgelenir.
4. Supply-chain ayarları docs-only aşamada bile yazılı policy olarak tutulur; bootstrap başladığında `pnpm-workspace.yaml` / config katmanına uygulanır.

## 10A.3. Review checklist

Yeni dependency review'unda ayrıca şu sorular sorulur:

- Paket build script gerektiriyor mu?
- Gerektiriyorsa `allowBuilds` listesine neden alınmalı?
- Paket çok yeni yayımlanmış sürüme mi dayanıyor? `minimumReleaseAge` bunu yakalıyor mu?
- Trust düşüşü veya provenance belirsizliği var mı?

## 10A.4. Zayıf yaklaşımlar

- "Kurulsun diye geçici olarak tüm build script'leri açalım"
- `dangerouslyAllowAllBuilds` kalıcı hale getirmek
- `minimumReleaseAge` kapatıp bunu görünmez bırakmak
- `allowBuilds` listesini açıklamasız şişirmek

## 10A.5. Teknik konfigürasyon örneği

Docs-only repoda bile pnpm security policy yalnızca metin olarak bırakılmamalıdır. Derived project bootstrap'te aşağıdaki gibi **somut config artefaktı** üretilir:

```yaml
# pnpm-workspace.yaml (örnek ek blok)
minimumReleaseAge: 1440
trustPolicy: no-downgrade
allowBuilds:
  esbuild: true
  sharp: true
  '@sentry/cli': true
```

Bu örnek kanonik allowlist değildir; proje ihtiyacına göre daraltılır. Referans örnek dosya: `tooling/pnpm/pnpm-workspace.security.example.yaml`.

# 11. Mimari Uyum Kriteri

## 11.1. Kural

Dependency, mevcut katman sınırlarına saygı göstermelidir.

## 11.2. Örnekler

- domain logic’i UI framework’e kilitleyen paketler risklidir
- auth provider’ı component seviyesine saçan SDK’lar risklidir
- data access’i feature boundaries’den çıkarıp tek vendor modeline zorlayan paketler dikkat ister
- design system’i dış framework varyant sistemine rehin bırakan paketler zayıftır

## 11.3. Sonuç

Paket iyi olsa bile mimariyi bozuyorsa doğru seçim değildir.

---

# 12. TypeScript Uyum Kriteri

## 12.1. Kural

Dependency, TypeScript ile ciddi sürtünme üretmemelidir.

## 12.2. Düşünülmesi gerekenler

- type definitions olgun mu?
- inference kabul edilebilir mi?
- unsafe cast yığını gerektiriyor mu?
- public API typed mı?
- generics veya helpers anlaşılır mı?

## 12.3. Zayıf davranış

Bir paketi kabul edip her kullanımda `any`, `as unknown as` ve ignore zinciri yazmak.

Bu proje bunu zayıf kabul eder.

---

# 13. Security ve Privacy Kriteri

## 13.1. Kural

Özellikle aşağıdaki dependency tipleri güvenlik açısından ekstra değerlendirme gerektirir:

- auth SDK’ları
- storage packages
- analytics/observability SDK’ları
- native bridge dependencies
- encryption/secure-store helpers
- network client interceptors

## 13.2. Sorulması gerekenler

- hassas veri yüzeyi var mı?
- auto-capture davranışı var mı?
- default logging tehlikeli mi?
- secret handling modeli ne?
- platform izinleri gerektiriyor mu?
- yanlış kullanım riski yüksek mi?

## 13.3. Sonuç

Security yüzeyi belirsiz dependency, küçük fayda için alınmaz.

---

# 14. Performance / Size Kriteri

## 14.1. Kural

Dependency’nin:

- web bundle etkisi,
- mobile binary/app size etkisi,
- runtime memory/CPU etkisi,
- init cost’u
  değerlendirilmelidir.

## 14.2. Özellikle kritik alanlar

- UI framework packages
- analytics/observability SDK’ları
- date libraries
- polyfills
- animation libraries
- rich text / editor packages
- image/media dependencies
- native bridge packages

## 14.3. Zayıf davranış

Küçük özellik için büyük runtime maliyeti getiren paketleri sorgulamadan almak.

---

# 15. DX Kriteri

## 15.1. Kural

DX gerçek fayda üretmelidir; yalnızca “kullanması hoş” olması yetmez.

## 15.2. Güçlü DX örnekleri

- tekrar eden boilerplate azaltma
- test yazmayı kolaylaştırma
- boundary’leri görünür kılma
- doğru davranışı varsayılan hale getirme
- hata sınıflandırmasını netleştirme

## 15.3. Sahte DX örnekleri

- kısa vadede kolay, uzun vadede refactor zor
- büyülü API yüzeyi yüzünden davranışı belirsizleştirme
- gizli side effect’ler
- abstraction fazla olduğu için debug zorlaşması

---

# 16. Vendor Lock-in Kriteri

## 16.1. Kural

Vendor lock-in tamamen yasak değildir; ama kör kabul edilmez.

## 16.2. Ne zaman kabul edilebilir?

- problem gerçekten vendor seviyesinde çözülüyorsa
- abstraction maliyeti şu aşamada gereksizse
- vendor kaliteli ve sürdürülebilirse
- migration cost’u bilinçli kabul ediliyorsa

## 16.3. Ne zaman zayıftır?

- erken aşamada gereksiz platform/vendora bağlanmak
- canonical stack kararlarını bir vendor API etrafında gereksiz biçimde kapatmak
- abstraction veya boundary imkânı varken doğrudan tüm app’i o vendor modeline bağlamak

---

# 17. UI Dependency Politikası

## 17.1. Kural

Ağır hazır UI framework’leri canonical baseline’a ters düşer.

## 17.2. Neden?

Bu boilerplate kendi design system otoritesini kurmak istiyor.  
Aşağıdaki tip dependency’ler ekstra şüpheyle değerlendirilmelidir:

- hazır component framework’leri
- theme sistemini dikte eden UI kit’ler
- styling runtime’ını by-pass eden wrapper’lar
- component variant mantığını dış kütüphaneye rehin bırakan paketler

## 17.3. Ne kabul edilebilir?

- low-level primitives
- accessibility primitives
- icon packages (policy ile)
- carefully chosen utility helpers
- DS ile uyumlu, görünmez altyapı paketleri

## 17.4. Zayıf davranış

Bir feature’ı hızlı çıkarmak için design system dışında component library çekmek.

---

# 18. Styling Dependency Politikası

## 18.1. Kural

Canonical styling yönü Tailwind + NativeWind + token/semantic layer olduğu için, bunu delmeye başlayan dependency’ler yüksek risklidir.

## 18.2. Riskli örnekler

- CSS-in-JS runtime’ları
- style helper magic packages
- raw class generator paketleri
- RN StyleSheet-first helper kit’leri
- theme authority’yi ele geçiren kütüphaneler

## 18.3. Sonuç

Styling dependency eklemek çoğu zaman ADR-007 ile birlikte değerlendirilmelidir.

---

# 19. State / Data / Forms Dependency Politikası

## 19.1. Kural

State, query ve forms katmanları canonical olarak kilitlenmiştir.  
Bu alanlara dependency eklemek veya alternatif getirmek normal paket ekleme değildir.

State management tarafında Zustand canonical araçtır.  
İkinci bir state management library eklenmesi bu projede kabul edilmez.  
Zustand ile çözülemeyen bir state ihtiyacı iddiası varsa, önce mevcut modelin neden yetersiz kaldığı somut olarak açıklanmalı ve gerekirse ADR süreci başlatılmalıdır.

## 19.2. Örnekler

- ikinci state management library (Redux, MobX, Jotai, Valtio vb.)
- yeni global state library
- ikinci query/cache aracı
- ikinci form engine
- ikinci validation schema library
- duplicate network cache helper
- store persistence convenience wrapper’ı

## 19.3. Sonuç

Bu ailede yeni dependency çoğu durumda:

- gereksizdir,
- mimari çelişki üretir,
- ya da ADR gerektirir.

State management alanında Zustand canonical kilitli seçimdir; bu alanda alternatif öneri getirmek sıradan dependency talebi değil, closed canonical area’ya itiraz sayılır.

---

# 20. Auth / Security Dependency Politikası

## 20.1. Kural

Auth, secure storage, crypto, session ve secrets alanındaki dependency’ler yüksek riskli sınıftır.

## 20.2. Değerlendirme soruları

- güvenlik modeli açık mı?
- platform-specific riskleri var mı?
- Expo/mobile gerçekliğiyle uyumlu mu?
- yanlış kullanımı kolay mı?
- logout/cleanup lifecycle ile uyumlu mu?
- observability’ye hassas veri sızdırıyor mu?

## 20.3. Sonuç

Bu sınıfta “paket popüler, kuralım” yaklaşımı kabul edilmez.

---

# 21. Observability / Analytics Dependency Politikası

## 21.1. Kural

Error tracking dışında analytics tarafı vendor-agnostic tutulacağı için, analytics SDK eklemek yüksek dikkat gerektirir.

## 21.2. Değerlendirme soruları

- auto-capture agresif mi?
- payload kontrolü var mı?
- PII riski nedir?
- abstraction katmanını by-pass ediyor mu?
- event naming discipline ile uyumlu mu?

## 21.3. Sonuç

Doğrudan SDK entegrasyonu yerine abstraction-first yaklaşım varsayılandır.

---

# 22. Native Bridge Dependency Politikası

## 22.1. Kural

Expo-first mobile baseline nedeniyle native bridge dependency’leri ekstra yüksek risklidir.

## 22.2. Sorulması gerekenler

- Expo uyumlu mu?
- config plugin gerektiriyor mu?
- iOS/Android ayrı bakım maliyeti ne?
- CI/build karmaşıklığı ne?
- gerçekten gerekli mi?
- aynı capability Expo-first başka yolla çözülebilir mi?

## 22.3. Sonuç

Native bridge dependency eklemek çoğu durumda ADR-002 ile ilişkilidir.

---

# 23. Utility Dependency Politikası

## 23.1. Kural

Küçük utility paketleri masum varsayılmaz.

## 23.2. Değerlendirme soruları

- bu iş 10 satır güvenli yerel kod ile çözülebilir mi?
- paket gerçekten bakım yükünü düşürüyor mu?
- transitive dependency büyüklüğü nedir?
- type desteği nasıl?
- security yüzeyi var mı?

## 23.3. Zayıf davranış

Küçük işler için onlarca helper package toplayıp dependency graph’i şişirmek.

### 23.4. Canonical Düşük Riskli Utility Örneği

Düşük riskli utility dependency örneği: `date-fns 4.x` (tarih/saat işlemleri, tree-shakeable, ~5KB gzipped per function). Bu kütüphane canonical yardımcı olarak `36-canonical-stack-decision.md` Bölüm 20’de ve `39-default-screens-and-components-spec.md` Bölüm 5’te tanımlanmıştır. Alternatif: dayjs (daha küçük ama ecosystem zayıf), moment.js (deprecated, büyük bundle).

---

# 24. Dev Tooling Dependency Politikası

## 24.1. Kural

Dev tooling dependency’leri production’a gitmiyor diye hafife alınmaz.

## 24.2. Çünkü etkiledikleri alanlar

- CI süresi
- contributor experience
- lint/type/test güvenilirliği
- monorepo bakım maliyeti
- node/toolchain uyumu

## 24.3. Düşünülmesi gerekenler

- gerçekten gerekli mi?
- mevcut tool ile çözülebilir mi?
- config surface ne kadar büyüyor?
- bakım yükü ve upgrade sıklığı nasıl?

---

# 25. Peer Dependency / Compatibility Politikası

## 25.1. Kural

Peer dependency warning’leri “gürültü” diye normalleştirilmez.

## 25.2. Neden?

Çünkü peer uyuşmazlıkları çoğu zaman:

- gizli runtime bug
- build kırığı
- tooling uyumsuzluğu
- future upgrade kabusu
  üretir.

## 25.3. Sonuç

Yeni dependency, `38-version-compatibility-matrix.md` ile uyumlu olmak zorundadır.

---

# 26. Version Pinning Politikası

## 26.1. Kural

Sürüm stratejisi dependency tipine göre düşünülmelidir.

## 26.2. Genel ilke

- Core runtime ve kritik architecture dependencies için daha kontrollü sürüm yönetimi
- Dev tooling için uyum odaklı dikkatli güncelleme
- Security-critical dependencies için daha hızlı reaksiyon kabiliyeti

## 26.3. Zayıf davranışlar

- kontrolsüz wide range’ler
- major upgrade’leri görünmez almak
- kritik paketleri “latest” mantığıyla yönetmek

---

# 27. Dependency Ekleme Süreci

Yeni dependency eklenmeden önce şu minimum süreç izlenmelidir:

1. Problem tanımı
2. Mevcut canonical stack ile çözülüp çözülemediğinin değerlendirilmesi
3. Alternatiflerin kısa analizi
4. Risk sınıfı belirleme
5. Security/privacy etkisi
6. Performance/size etkisi
7. Cross-platform etkisi
8. Testing/observability etkisi
9. Gerekiyorsa ADR ihtiyacı
10. Sonrasında ekleme

Bu sürecin hiçbir adımı “paket küçük zaten” gerekçesiyle atlanmaz.

---

# 28. Ne Zaman ADR Gerekir?

Aşağıdaki durumlarda dependency kararı çoğu zaman ADR ister:

- canonical stack yönünü etkiliyorsa
- architecture boundary değiştiriyorsa
- ikinci bir runtime/model getiriyorsa
- security veya auth modelini etkiliyorsa
- styling/theming/system kararını değiştiriyorsa
- major platform integration gerektiriyorsa
- test/CI topolojisini değiştiriyorsa

ADR gerektiren şeyi basit package addition gibi geçirmek zayıf yaklaşımdır.

---

# 29. Upgrade Politikası

## 29.1. Kural

Upgrade pasif refleks değil, kontrollü bakım sürecidir.

## 29.2. Upgrade türleri

- patch
- minor
- major
- security patch
- forced compatibility upgrade

## 29.3. Her upgrade için sorulacaklar

- API değişiyor mu?
- peer dependency etkisi var mı?
- bundle/binary etkisi var mı?
- CI/test davranışı değişiyor mu?
- migration note gerekiyor mu?
- web/mobile parity etkileniyor mu?

## 29.4. Zayıf davranışlar

- büyük sürüm geçişini “bakmadık ama geçti” diye kabul etmek
- minor sanıp runtime behavior kırığını kaçırmak
- upgrade sonrası docs/ADR senkronizasyonunu unutmak

---

# 30. Deprecation Politikası

## 30.1. Kural

Kullanım dışı bırakılan dependency veya package görünmez kalmamalıdır.

## 30.2. Gerekli alanlar

- neden deprecated?
- ne ile değiştirilecek?
- migration yolu ne?
- ne zaman tamamen kaldırılacak?

## 30.3. Zayıf davranışlar

- eski dependency’yi sessizce bırakmak
- aynı alanda iki paketle uzun süre yaşamak
- contributor’ların hangisini kullanacağını bilmediği durum yaratmak

---

# 31. Removal Politikası

## 31.1. Kural

Dependency kaldırma da belgeli olmalıdır.

## 31.2. Neden?

Çünkü removal:

- transitive graph’i sadeleştirir
- security yüzeyini küçültür
- bundle/binary etkisi yaratır
- docs ve tooling’i etkileyebilir

## 31.3. Sonuç

Removal, sadece package.json temizliği değil; sistem iyileştirme kararıdır.

---

# 32. Patch Politikası

## 32.1. Kural

Geçici patch uygulanabilir ama görünmez kalamaz.

## 32.2. Ne zaman meşru?

- vendor bug kritikse
- upstream fix bekleniyorsa
- canonical kararı bozmadan kısa vadeli güvenli çözüm gerekiyorsa

## 32.3. Zorunlu bilgiler

- neden patch?
- upstream issue/ref varsa nedir?
- patch scope’u ne?
- ne zaman kaldırılacak?

## 32.4. Zayıf davranışlar

- package patch’leyip kimseye söylememek
- patch’i kalıcı altyapı haline getirmek
- patch yüzünden upgrade yolunu kaybetmek

---

# 33. Fork Politikası

## 33.1. Kural

Fork son çaredir.

## 33.2. Ne zaman meşru olabilir?

- upstream ölü ise
- güvenlik veya kritik üretim sorunu varsa
- patch ile yönetilemeyecek kadar büyük ama vendor değişimi de hemen mümkün değilse

## 33.3. Neden çok riskli?

Çünkü fork:

- bakım yükü getirir
- upgrade zorlaştırır
- kurum içi sahiplik gerektirir
- görünmez teknik borç olabilir

## 33.4. Sonuç

Fork kararı çoğu zaman ADR ve explicit ownership gerektirir.

---

# 34. Wrapper / Adapter Politikası

## 34.1. Kural

Yüksek riskli dependency’ler mümkün olduğunca uygulamaya doğrudan saçılmamalıdır; controlled wrapper/adapter arkasında tutulmalıdır.

## 34.2. Hangi alanlarda özellikle güçlü adaydır?

- auth SDK
- analytics SDK
- observability integrations
- storage adapters
- provider-specific network clients
- native capabilities

## 34.3. Neden?

Çünkü:

- vendor swap kolaylaşır
- test kolaylaşır
- uygulama katmanına teknoloji kokusu daha az yayılır
- misuse azalır

---

# 35. Rejection Kriterleri

Aşağıdaki durumlardan biri varsa dependency varsayılan olarak reddedilmelidir:

1. canonical stack ile çelişiyorsa
2. bakım durumu zayıfsa
3. security/privacy riski belirsizse
4. aynı problem zaten yeterli şekilde çözülüyorsa
5. mimari sınırları bulanıklaştırıyorsa
6. gereksiz büyük runtime/binary maliyet getiriyorsa
7. peer/compatibility kaosu yaratıyorsa
8. test/observability açısından büyük kör nokta oluşturuyorsa
9. vendor lock-in riski orantısızsa
10. faydası “rahatlık” seviyesinde, maliyeti yapısal seviyedeyse

---

# 36. Anti-Pattern Listesi

Aşağıdaki davranışlar bu proje kapsamında zayıf kabul edilir:

1. Aynı problem için ikinci kütüphane eklemek
2. “Küçük paket zaten” diyerek incelemeden eklemek
3. UI hızlansın diye design system dışı component library almak
4. Native capability için ilk gördüğün bridge’i kurmak
5. Utility için 5 satırlık işi paketle çözmek
6. Peer dependency sorunlarını yok saymak
7. Patch/fork’u görünmez bırakmak
8. Major upgrade’i docs/ADR güncellemeden yapmak
9. Sensitive SDK’ları privacy değerlendirmesi yapmadan kurmak
10. Wrapper/adapter gerekirken SDK’yı tüm app’e saçmak
11. Paket eklemeyi architecture kararı değil, lokal dosya kararı gibi görmek
12. Deprecated dependency ile yaşamayı normalleştirmek

---

# 37. Review Checklist

Bir dependency PR’ı incelenirken en az şu sorular sorulmalıdır:

1. Bu dependency hangi problemi çözüyor?
2. Aynı problem zaten canonical stack içinde çözülmüyor mu?
3. Bu runtime mı, tooling mi, native mi?
4. Security/privacy etkisi nedir?
5. Web/mobile etkisi nedir?
6. Bundle/binary/CI etkisi nedir?
7. Wrapper/adapter gerekir mi?
8. Peer/compatibility sorunu var mı?
9. ADR gerekir miydi?
10. Bir yıl sonra bunu güncel tutmak zor mu?

---

# 38. Repo ve Süreç Etkisi

Bu politika kabul edildiğinde aşağıdaki sonuçlar doğar:

- dependency addition review standardı yükselir
- package.json büyümesi governance konusu olur
- canonical stack dışı sapmalar görünür hale gelir
- upgrade ve removal süreci daha bilinçli yapılır
- patch/fork kararları kayda geçer
- `38-version-compatibility-matrix.md` zorunlu belge haline gelir
- `20-initial-implementation-checklist.md` dependency hygiene maddeleri eklenir

---

# 39. Non-Goals

Bu belge aşağıdakileri çözmez:

- exact package list
- exact version numbers
- legal/commercial license review sürecinin tüm detayları
- dependency scanning tool seçimi
- automatic upgrade bot policy detayları
- per-package owner tablosu

Bunlar ilgili operasyonel belgelerde kapanacaktır.

---

# 40. Onay Kriterleri

Bu doküman yeterli kabul edilir eğer:

1. Dependency kabul kriterleri net yazılmışsa
2. Risk sınıfları görünür kılınmışsa
3. UI, state, auth, observability, native bridge ve utility dependency politikaları ayrılmışsa
4. upgrade/deprecation/removal/patch/fork kuralları yazılmışsa
5. canonical stack uyum zorunluluğu netse
6. rejection kriterleri ve anti-pattern’ler görünürse
7. Bu belge repo bootstrap öncesi gerçek dependency governance dokümanı olarak kullanılabilecek netlikteyse

---

# 41. Kısa Sonuç

Bu dokümanın ana çıktısı şudur:

> Bu boilerplate’te dependency eklemek sıradan paket kurma işlemi değildir. Her dependency; çözdüğü problem, mimari etkisi, security/privacy yüzeyi, bakım maliyeti, compatibility durumu ve canonical stack ile uyumu üzerinden değerlendirilir. Küçük convenience paketleri, ağır UI kit’leri, yüksek riskli auth/native/analytics SDK’ları ve canonical stack’i delen alternatif araçlar yalnızca güçlü gerekçe ile kabul edilir; gerekirse ADR ister.

---

# 42. Dependency Health Score (2026-04-02 Eki)

Her dependency için otomatik sağlık değerlendirmesi sistemi.

## 42.1. Metrikler ve Ağırlıklar

| Metrik                      | Ağırlık | Ölçüm Kaynağı         | Skor Aralığı                                  |
| --------------------------- | ------- | --------------------- | --------------------------------------------- |
| npm weekly downloads trendi | %20     | npmjs.com API         | Artış: 20, Sabit: 15, Azalış: 5               |
| Son commit tarihi           | %20     | GitHub API            | <3 ay: 20, 3-6 ay: 15, 6-12 ay: 10, >12 ay: 0 |
| Open issue / PR sayısı      | %15     | GitHub API            | <50: 15, 50-100: 10, 100-200: 5, >200: 0      |
| New Architecture uyumluluğu | %20     | reactnative.directory | Tam uyumlu: 20, Kısmi: 10, Uyumsuz: 0         |
| Bundle size etkisi          | %15     | bundlephobia.com      | <50KB: 15, 50-200KB: 10, >200KB: 5            |
| Bilinen vulnerability       | %10     | npm audit / Snyk      | Yok: 10, Low: 7, Medium: 3, High/Critical: 0  |

## 42.2. Toplam Skor ve Eşikler

Toplam skor 0-100 arasında hesaplanır:

| Skor Aralığı | Durum       | Aksiyon                                                            |
| ------------ | ----------- | ------------------------------------------------------------------ |
| 70-100       | 🟢 Sağlıklı | Rutin bakım yeterli                                                |
| 50-69        | 🟡 Dikkat   | 3 ay içinde alternatif araştırılır veya upstream’e katkı planlanır |
| 0-49         | 🔴 Risk     | Alternatif araştırılır, migration planı oluşturulur                |

## 42.3. Periyodik Kontrol

- **Sıklık:** Aylık (monthly) CI job ile tüm dependency’ler taranır.
- **Komut:** `pnpm check:dep-health` (custom script)
- **Çıktı:** `docs/reports/dependency-health.md` otomatik güncellenir.
- **Alert:** Skor 50 altına düşen dependency için GitHub issue otomatik açılır.

## 42.4. Native Modül Ek Kontrolleri

React Native native modülleri için ek metrikler:

- Expo managed workflow desteği (config plugin mevcut mu?)
- iOS ve Android ayrı ayrı build test sonucu
- Son native bridge değişikliği tarihi

---

# 43. Dependency Upgrade Otomasyonu (2026-04-02 Eki)

Otomatik güncelleme stratejisi ve araç konfigürasyonu.

## 43.1. Araç Seçimi

- **Tercih edilen:** Renovate Bot (daha esnek konfigürasyon, gruplandırma, monorepo desteği)
- **Alternatif:** Dependabot (GitHub native, basit kurulum)
- Araç seçimi `37-dependency-policy.md` kurallarına tabidir.

## 43.2. Upgrade Kademeleri

| Değişiklik Tipi | Otomatik Merge    | Review Gereksinimi             | Test Gereksinimi          |
| --------------- | ----------------- | ------------------------------ | ------------------------- |
| Patch (x.y.Z)   | Evet (CI geçerse) | Otomatik                       | CI suite                  |
| Minor (x.Y.0)   | Hayır, PR açılır  | 1 reviewer onayı               | CI suite + smoke test     |
| Major (X.0.0)   | Hayır, PR açılır  | 2 reviewer onayı + manual test | CI suite + tam regression |

## 43.3. Gruplandırma Kuralları

İlişkili paketler tek PR’da güncellenir:

- `@tanstack/*` paketleri birlikte
- `@testing-library/*` paketleri birlikte
- `eslint` + `eslint-plugin-*` birlikte
- `expo-*` paketleri birlikte (SDK minor güncellemelerde)
- `@types/*` ilgili runtime paketi ile birlikte

## 43.4. Schedule

- **Güncelleme taraması:** Haftalık (Pazartesi 09:00 UTC)
- **PR açılma zamanı:** Tarama sonrası otomatik
- **Stale PR temizliği:** 14 gün review edilmemiş upgrade PR’ları otomatik kapatılır ve yeni versiyonla tekrar açılır

## 43.5. Compatibility Matrix Doğrulaması

Upgrade PR’ında `38-version-compatibility-matrix.md` kontrolü:

- Yeni versiyon matristeki aralıkla uyumlu mu?
- peerDependency çakışması var mı?
- Matrix aralığı dışına çıkıyorsa matris güncelleme commit’i PR’a dahil edilir.

## 43.6. Lockfile Yönetimi

- `pnpm-lock.yaml` güncellemesi her upgrade PR’ına dahildir.
- Lockfile-only değişiklikler (security patch vb.) otomatik merge edilebilir.

## 43.7. Rollback Politikası

- Major upgrade sonrası 48 saat monitoring süresi.
- Crash rate %0.5 artarsa veya performance regression tespit edilirse revert PR açılır.
- Revert PR: 1 reviewer onayı yeterli, hızlandırılmış merge.

---

# 44. License Audit ve SBOM (Software Bill of Materials)

Bu bölüm, projeye eklenen bağımlılıkların lisans uyumluluğunu ve yazılım bileşen envanterini yönetir.

## 44.1. Kabul Edilen Lisanslar

| Lisans                      | Durum | Açıklama                                    |
| --------------------------- | ----- | ------------------------------------------- |
| MIT                         | Kabul | En yaygın, kısıtlama minimum                |
| Apache-2.0                  | Kabul | Patent grant içerir, ticari kullanıma uygun |
| BSD-2-Clause / BSD-3-Clause | Kabul | MIT benzeri, minimal kısıtlama              |
| ISC                         | Kabul | MIT eşdeğeri                                |
| 0BSD                        | Kabul | Public domain benzeri                       |

## 44.2. Dikkatli Değerlendirme Gerektiren Lisanslar

| Lisans              | Durum         | Dikkat Noktası                                                                      |
| ------------------- | ------------- | ----------------------------------------------------------------------------------- |
| MPL-2.0             | Değerlendirme | Dosya-seviyesi copyleft; MPL dosyalarını değiştirirsen değişiklikleri paylaşmalısın |
| LGPL-2.1 / LGPL-3.0 | Değerlendirme | Kütüphane olarak kullanımda genellikle sorunsuz; static linking'de dikkat           |
| CC-BY-4.0           | Değerlendirme | Attribution zorunlu; genellikle asset/data için, kod için uygun değil               |

Bu kategorideki lisanslar, dependency eklenmeden önce ekip sorumlusu tarafından değerlendirilir.

## 44.3. Yasak Lisanslar

| Lisans                  | Durum | Neden                                                               |
| ----------------------- | ----- | ------------------------------------------------------------------- |
| GPL-2.0 / GPL-3.0       | Yasak | Güçlü copyleft; tüm projenin GPL ile lisanslanmasını gerektirebilir |
| AGPL-3.0                | Yasak | Ağ üzerinden sunulan uygulamalarda da kaynak paylaşımı zorunluluğu  |
| SSPL                    | Yasak | Ticari kullanımda ciddi kısıtlamalar                                |
| Unlicensed / No license | Yasak | Lisans belirtilmemiş = varsayılan telif hakkı koruması              |

**Kural:** Yasak lisanslı bir paket keşfedildiğinde alternatif aranır. Alternatif yoksa `44-exception-and-exemption-policy.md` kapsamında exception açılır.

## 44.4. CI License Gate

Her CI çalışmasında otomatik lisans kontrolü yapılır:

```bash
# license-checker ile lisans tarama
npx license-checker --production --failOn "GPL-2.0;GPL-3.0;AGPL-3.0;SSPL"
```

- **PR CI'da:** Yeni eklenen dependency'nin lisansı kontrol edilir
- **Haftalık full scan:** Tüm dependency tree (transitive dahil) taranır
- **Failure durumu:** Yasak lisans tespit edilirse PR merge bloklanır

## 44.5. SBOM (Software Bill of Materials)

SBOM, projenin kullandığı tüm yazılım bileşenlerinin envanterini oluşturur.

### SBOM Formatı ve Üretim

- **Standart:** CycloneDX (OWASP standardı) veya SPDX
- **Format:** JSON
- **Üretim aracı:** `@cyclonedx/cyclonedx-npm` veya `syft`

### SBOM Üretim Takvimi

| Olay                     | SBOM Güncelleme                           |
| ------------------------ | ----------------------------------------- |
| Her release tag'i        | Zorunlu — release artifact'ına eklenir    |
| Major dependency upgrade | Zorunlu — değişiklik diff'i review edilir |
| Güvenlik denetimi öncesi | Zorunlu — auditor'a teslim edilir         |

### SBOM Saklama

- SBOM dosyaları release artifact'larıyla birlikte saklanır
- Minimum saklama süresi: 3 yıl (KVKK denetim gereksinimi)

### Enterprise Gereksinimi

Türetilen projelerde müşteri veya regülasyon SBOM zorunluluğu getirebilir. Bu durumda SBOM üretimi CI'da zorunlu hale getirilir.

---

# 45. Backend & Firebase Dependency Politikası (2026-06-26 Eki / ADR-020, ADR-021)

ADR-020 (Backend and Data Platform) ve ADR-021 (Authentication Platform) ile backend, database, server logic ve auth canonical olarak Firebase'e kilitlenmiştir. Bu bölüm, bu kararların dependency yüzeyini izinli ve yasak paketler düzeyinde tanımlar. Bu alan canonical stack uyum zorunluluğunun (Bölüm 8) bir parçasıdır.

## 45.1. Canonical / İzinli Firebase Paketleri

Aşağıdaki paketler canonical backend yüzeyinin parçasıdır ve izinlidir:

| Paket                      | Kapsam                                                                  | Kullanım                             |
| -------------------------- | ----------------------------------------------------------------------- | ------------------------------------ |
| `firebase`                 | Web client SDK (modular, v11.x)                                         | `apps/web` adapter katmanı           |
| `@react-native-firebase/*` | Mobile native SDK (app, auth, firestore, functions, storage, messaging) | `apps/mobile` adapter katmanı        |
| `firebase-admin`           | Server-side admin SDK                                                   | Cloud Functions / privileged backend |
| `firebase-functions`       | Cloud Functions runtime SDK                                             | `functions/` workspace               |
| `firebase-tools`           | Firebase CLI (emulator, deploy)                                         | dev tooling                          |

Kurallar:

- SDK import'ları yalnızca app-level adapter katmanında bulunur; `packages/core` SDK-free kalır (ADR-020 Bölüm 14).
- `@react-native-firebase` native modüller içerir; Expo development build zorunludur, Expo Go desteklenmez (ADR-002 / ADR-020 Bölüm 16).
- Firebase SDK sürüm hatları `38-version-compatibility-matrix.md` ile birlikte yönetilir.

## 45.2. Açıkça Yasak Paketler

Aşağıdaki paketler canonical backend / data / auth kararıyla çeliştiği için açıkça yasaktır:

| Paket                      | Kategori            | Yasak Gerekçesi (ADR)                                      |
| -------------------------- | ------------------- | ---------------------------------------------------------- |
| `hono`                     | Custom Node backend | Server logic = Cloud Functions (ADR-020 §15.3)             |
| `drizzle-orm`              | SQL ORM             | Database = Cloud Firestore, NoSQL (ADR-020 §15.2)          |
| `prisma`, `@prisma/client` | SQL ORM             | Database = Cloud Firestore, NoSQL (ADR-020 §15.2)          |
| `pg`                       | PostgreSQL client   | Relational DB canonical değil (ADR-020 §15.2/§15.5)        |
| `postgres`                 | PostgreSQL client   | Relational DB canonical değil (ADR-020 §15.2/§15.5)        |
| `inngest`                  | Harici job queue    | Cron/async = Cloud Scheduler + Cloud Tasks (ADR-020 §10.3) |
| `bullmq`                   | Harici job queue    | Cron/async = Cloud Scheduler + Cloud Tasks (ADR-020 §10.3) |
| `better-auth`              | Harici auth         | Auth = saf Firebase Auth (ADR-021)                         |
| `@supabase/supabase-js`    | Rakip BaaS          | İkinci BaaS canonical değil (ADR-020 §15.4)                |
| `@neondatabase/*`          | Serverless Postgres | Relational DB canonical değil (ADR-020 §15.5)              |

## 45.3. Kural

Yukarıdaki yasak paketlerden birini eklemek sıradan dependency talebi değildir; canonical backend / auth kararına itirazdır. Bu yalnızca ADR-020 / ADR-021 revision süreci ile mümkündür (bkz. Bölüm 8 Canonical Stack Uyum Zorunluluğu, Bölüm 28 Ne Zaman ADR Gerekir, Bölüm 35 Rejection Kriterleri). Client-direct-write, backend-managed session/cookie ve harici job queue ekleme girişimleri de aynı kapsamda reddedilir.
