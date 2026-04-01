# 14-testing-strategy.md

## Doküman Kimliği

- **Doküman adı:** Testing Strategy
- **Dosya adı:** `14-testing-strategy.md`
- **Doküman türü:** Strategy / quality assurance / verification design document
- **Durum:** Accepted
- **Kapsam:** Bu boilerplate kapsamında test yaklaşımını, risk-temelli doğrulama modelini, static verification ile unit/component/integration/E2E/manual audit katmanları arasındaki farkı, hangi alanın hangi seviyede testlenmesi gerektiğini, test ownership mantığını, flaky test yönetimini, visual/a11y doğrulama ilişkisini ve test anti-pattern’lerini tanımlar.
- **Bağlı olduğu üst dokümanlar:**
  - `06-application-architecture.md`
  - `09-state-management-strategy.md`
  - `10-data-fetching-cache-sync.md`
  - `11-forms-inputs-and-validation.md`
  - `12-accessibility-standard.md`
  - `13-performance-standard.md`
- **Doğrudan etkileyeceği dokümanlar:**
  - `15-quality-gates-and-ci-rules.md`
  - `20-initial-implementation-checklist.md`
  - `30-contribution-guide.md`
  - `31-audit-checklist.md`
  - `32-definition-of-done.md`
  - `33-visual-implementation-contract.md`
  - `34-hig-enforcement-strategy.md`

---

# 1. Amaç

Bu dokümanın amacı, test stratejisini “coverage yükseltelim”, “her şeye unit test yazalım” veya “E2E varsa tamamdır” gibi yüzeysel yaklaşımlardan çıkarıp; **risk, mimari katman, kullanıcı etkisi ve regression maliyeti** üzerinden çalışan sistematik doğrulama modeline dönüştürmektir.

Bu belge şu sorulara net cevap verir:

1. Bu projede testin amacı tam olarak nedir?
2. Static verification, unit, component, integration, E2E ve manual audit birbirinden nasıl ayrılır?
3. Hangi problem hangi test katmanında yakalanmalıdır?
4. Hangi alanlar test yerine audit ister, hangi alanlar audit yerine test ister?
5. Reusable component, feature, domain logic, form, data layer ve cross-platform akışlar hangi seviyede doğrulanmalıdır?
6. Flaky test, snapshot şişkinliği, coverage fetişi ve “küçük değişiklik testsiz geçer” kültürü neden zararlıdır?
7. CI kalite kapıları ile test stratejisi nasıl hizalanmalıdır?
8. Hangi test davranışları bu proje kapsamında doğrudan zayıf kabul edilir?

Bu belge belirli bir test framework’ünün API dökümü değildir.  
Bu belge, **hangi şeyi neden ve hangi doğrulama düzeyinde güvence altına alacağımızı** tanımlar.

---

# 2. Neden Bu Doküman Gerekli

Projelerde test konusu çoğu zaman şu yanlış eksenlerden biriyle bozulur:

## 2.1. Coverage rakamı amaç haline gelir

Bu durumda:
- kolay testlenen ama değeri düşük şeyler testlenir,
- zor ama kritik kullanıcı akışları boş kalır,
- ekip coverage için test yazar ama güven kazanmaz,
- snapshot ve trivial render testleri şişer.

## 2.2. Her şey unit test ile çözülmeye çalışılır

Bu durumda:
- UI behavior ve orchestration boş kalır,
- form akışları parçalanmış testlerle sahte güven verir,
- state + data + navigation entegrasyon hataları kaçırılır,
- gerçek kullanıcı görevleri doğrulanmaz.

## 2.3. “E2E var, yeter” rahatlığı oluşur

Bu durumda:
- domain logic ayrı güvence almaz,
- reusable component kontratları boş kalır,
- küçük regression’lar pahalı test zincirinde geç fark edilir,
- lokal geliştirme döngüsü yavaşlar.

## 2.4. Manual audit tamamen unutulur

Bu durumda:
- görsel doğruluk,
- motion hissi,
- premium ton,
- parity niteliği,
- bazı a11y alanları
salt test var sanılarak atlanır.

Bu proje kapsamında test stratejisi şunu söylemelidir:

> Ne her şey unit test ile çözülecek, ne her şey E2E’ye bırakılacak, ne de test olmayan yerler “insan bakar” diye boş bırakılacaktır.

---

# 3. Temel Tez

Bu proje kapsamında temel tez şudur:

> Test stratejisinin amacı sayı üretmek değil; domain kararlarını, reusable UI kontratlarını, veri ve state orchestration’ını, kritik kullanıcı görevlerini ve yüksek riskli regressions’ları maliyet-etkin ama güvenilir katmanlarla görünür kılmaktır.

Bu tez şu sonuçları doğurur:

1. Coverage bir amaç değil, yardımcı sinyaldir.
2. Her iş için aynı test seviyesi gerekmez.
3. Mimari katman ile test katmanı ilişkilidir.
4. UI kalite alanlarının bir kısmı test, bir kısmı audit ister.
5. Flaky test güven üretmez, tam tersine güveni aşındırır.
6. “Küçük değişiklik” gerekçesiyle riskli alanlar testsiz bırakılamaz.

---

# 4. Testin Bu Projedeki Rolü

Test yalnızca bug avlama aracı değildir.  
Bu proje kapsamında testin rolleri şunlardır:

## 4.1. Regression önleme
Daha önce çalışan kritik davranışın sessizce bozulmasını önlemek.

## 4.2. Mimari güven üretme
Saf domain logic, orchestration ve component kontratlarını izole doğrulanabilir hale getirmek.

## 4.3. Refactor güveni sağlama
Kod yapısı değişse bile davranışın korunup korunmadığını göstermek.

## 4.4. Katman sorumluluklarını görünür kılma
Neyin unit, neyin integration, neyin E2E konusu olduğunu anlamak.

## 4.5. CI kalite kapılarına sinyal verme
Release öncesi güven düzeyini artırmak.

## 4.6. Audit’i destekleme
Bazı kalite alanlarında test, audit’in yerini almaz ama audit için temel hazırlar.

---

# 5. Test Stratejisinin Çekirdek İlkeleri

Bu boilerplate kapsamında test stratejisi şu ilkeler üzerine kurulmalıdır:

1. **Risk-first**
2. **Layer-aware**
3. **Behavior-oriented**
4. **Cheap where possible, deep where necessary**
5. **No fake confidence**
6. **Manual audit complements tests**
7. **Cross-platform parity matters**
8. **Accessibility and performance are not optional side quests**

---

# 6. Risk-First Yaklaşım

## 6.1. Ne demek?

Test seviyesi şu soruya göre seçilir:
“Bu alan bozulursa etkisi ne olur?”

## 6.2. Yüksek riskli alanlar

- auth/session akışları
- kritik create/edit/delete akışları
- ödeme/checkout benzeri sonuç odaklı görevler
- form submit ve validation zincirleri
- data sync/retry/conflict yüzeyleri
- design system’in sık kullanılan reusable component aileleri
- navigation ve deep link akışları
- platformlar arası davranış farkı riski taşıyan feature’lar

## 6.3. Düşük riskli alanlar

- çok küçük sunum farkları
- iç implementation detayları
- kısa ömürlü ve düşük etkili local helper davranışları
- çok sınırlı geçici view glue kodu

## 6.4. Kural

Düşük riskli alanlara aşırı test, yüksek riskli alanlara yetersiz test kadar zararlı olabilir.  
Ama ikinci durum daha tehlikelidir.

---

# 7. Test Katmanları

Bu proje kapsamında doğrulama katmanları şunlardır:

1. **Static Verification**
2. **Unit Tests**
3. **Component Tests**
4. **Integration Tests**
5. **End-to-End Tests**
6. **Manual Audit / Visual / A11y Verification**

Bu katmanlar birbirini tamamlar.  
Birinin varlığı diğerlerini otomatik gereksiz kılmaz.

---

# 8. Static Verification

## 8.1. Tanım

Kod çalıştırmadan yapılan doğrulama katmanıdır.

## 8.2. Neleri kapsar?

- typecheck
- lint
- boundary/import rules
- selected security hygiene checks
- selected a11y/HIG static rules
- forbidden pattern detection
- design system enforcement sinyalleri

## 8.3. Güçlü yönü

Hızlıdır.  
Erken sinyal verir.  
Birçok mekanik ve yapısal problemi ucuz yakalar.

## 8.4. Zayıf yönü

Çalışan behavior’ı doğrulamaz.  
Runtime etkileşimi tam yakalayamaz.  
Kullanıcı görevini test etmez.

## 8.5. Kural

Static verification testin yerine geçmez.  
Ama taban hijyeni olmadan test stratejisi eksik kalır.

---

# 9. Unit Tests

## 9.1. Tanım

Saf ve izole mantık parçalarının, dış bağımlılıkları minimumda tutularak test edilmesidir.

## 9.2. En doğru kullanım alanları

- domain calculations
- value object kuralları
- pure selectors
- pure mappers
- sorting/grouping/calculation functions
- validation rules’in saf kısmı
- pure state derivation utilities

## 9.3. Güçlü yönü

- hızlıdır
- deterministiktir
- refactor güveni yüksektir
- hata yeri daha nettir

## 9.4. Zayıf yönü

- UI kontratını doğrulamaz
- orchestration akışlarını eksik bırakır
- katmanlar arası entegrasyonu tek başına test etmez

## 9.5. Yanlış kullanım örnekleri

- saf olmayan UI akışını zorla unit test’e parçalamak
- neredeyse integration konusu olan logic’i mock bataklığına gömmek
- component davranışını helper unit test’leriyle dolaylı test etmeye çalışmak

---

# 10. Component Tests

## 10.1. Tanım

Reusable UI bileşenlerinin contract’ını, interaction state’lerini, a11y davranışını ve API yüzeyini doğrulayan test katmanıdır.

## 10.2. Ne için uygundur?

- button variants/states
- field shell behavior
- checkbox/radio/switch state görünürlüğü
- disabled/loading/selected/focus behavior
- helper/error rendering
- accessible name/role/state exposure
- icon-only action safety
- press/keyboard behavior (uygunsa)

## 10.3. Ne için uygun değildir?

- çok geniş feature orchestration
- backend entegrasyon davranışı
- tüm ekran görevleri
- cross-screen navigation akışı

## 10.4. Neden kritiktir?

Bu projede design system ve reusable components yüksek önemdedir.  
Reusable component ailesi testsizse, aynı bug tüm ürüne yayılabilir.

## 10.5. Zayıf davranışlar

- reusable component için yalnızca tek render snapshot yazmak
- loading/disabled/invalid/focus state’lerini hiç doğrulamamak
- a11y contract’ını test dışında bırakmak

---

# 11. Integration Tests

## 11.1. Tanım

Birden fazla katmanın veya sorumluluk alanının birlikte davranışını doğrulayan test katmanıdır.

## 11.2. Güçlü kullanım alanları

- form + validation + submit flow
- screen orchestration + query/mutation behavior
- error/retry/success yüzeyleri
- cache invalidation etkisi
- feature-local state + UI coordination
- permission/capability gating
- local navigation consequences within a feature
- section-level data composition

## 11.3. Neden önemlidir?

Gerçek ürün bug’larının büyük kısmı saf fonksiyonda değil,  
**“birkaç şey birlikte çalışırken”** çıkar.

## 11.4. Ne zaman unit yerine integration gerekir?

- bir UI intent birden fazla state alanını etkiliyorsa
- error/retry behavior testleniyorsa
- network/cache behavior’ın kullanıcıya yansıması görülmek isteniyorsa
- form submit gerçek davranışı testleniyorsa

## 11.5. Zayıf davranışlar

- çok katmanlı flow’u yalnızca unit test’lerle “dolaylı” doğrulamaya çalışmak
- integration gerektiren yeri snapshot ile geçmek
- orchestration davranışını hiç gerçek bağlamda test etmemek

---

# 12. End-to-End Tests

## 12.1. Tanım

Gerçek kullanıcıya en yakın düzeyde, sistemin kritik görev akışlarını baştan sona doğrulayan test katmanıdır.

## 12.2. Güçlü kullanım alanları

- login/session restore
- onboarding completion
- critical create/edit/delete flow
- ödeme/checkout benzeri kritik akışlar
- deep link landing to core screen
- important filter/search/apply workflows
- release-breaking risk taşıyan ana görevler
- cross-platform parity açısından kritik journeys

## 12.3. Güçlü yönü

- gerçek davranış güveni sağlar
- wiring hatalarını yakalar
- “her şey tek başına doğru ama birlikte kırık” durumunu görünür kılar

## 12.4. Zayıf yönü

- yavaştır
- bakımı pahalıdır
- flaky olmaya yatkındır
- her şeyi bununla test etmeye kalkmak sürdürülemez

## 12.5. Kural

E2E testler az ama yüksek değerli olmalıdır.  
“Her şeyi E2E ile kapatalım” yaklaşımı sürdürülebilir değildir.

---

# 13. Manual Audit / Visual / A11y Verification

## 13.1. Neden zorunlu?

Bazı kalite alanları salt testle kapanmaz:

- screenshot-faithful görsel kalite
- premium hissiyat
- motion tonlaması
- complex interaction hissi
- dense data surface UX
- bazı screen reader deneyimleri
- platform adaptation kalitesi
- HIG’ye yakın görsel/ergonomik değerlendirmeler

## 13.2. Kural

Manual audit:
- test yazamadığımız için değil,
- bazı kalite alanları doğası gereği deneyimsel olduğu için vardır.

## 13.3. Zayıf davranışlar

- visual contract alanlarını tamamen teste havale etmek
- “test var, artık UI doğrudur” sanmak
- a11y’nin yalnızca static lint ile çözüldüğünü düşünmek

---

# 14. Test Katmanı Seçim Mantığı

Bir davranış için doğru test katmanını seçmek adına şu sorular sorulmalıdır:

1. Bu saf mantık mı?
2. Bu reusable UI contract mı?
3. Bu feature orchestration mı?
4. Bu gerçek kullanıcı görevi mi?
5. Bu görsel kalite / motion / parity alanı mı?
6. Bu sorun en ucuz hangi seviyede yakalanır?
7. Bu davranış bozulursa kullanıcı etkisi ne olur?

---

# 15. Domain Logic Test Stratejisi

## 15.1. Domain neden güçlü unit test adayıdır?

Çünkü domain:
- saf olmalı,
- platform bağımlılığı taşımamalı,
- business rule yoğunluğu taşımalı,
- refactor güveni üretmelidir.

## 15.2. Neler testlenmeli?

- hesaplamalar
- sınıflandırmalar
- izin/uygunluk kuralları
- domain selector’ları
- validation rule’ların saf kısmı
- conflict resolution calculations (safsa)

## 15.3. Zayıf davranışlar

- domain logic’i test etmemek
- domain behavior’ı yalnızca üst seviye E2E’ye bırakmak
- saf kuralı ekran içi if/else’lerde çözmek

---

# 16. Reusable UI / Design System Test Stratejisi

## 16.1. Neden ayrı kritik alan?

Bu projede design system çok merkezi bir role sahiptir.  
Bir reusable component hatası yalnızca bir ekranı değil, birçok ekranı bozar.

## 16.2. Ne testlenmeli?

- API contract
- variants
- sizes
- states
- disabled/loading behavior
- accessible semantics
- interaction triggers
- helper/error relationship
- visual/state meaning taşıyan kritik props

## 16.3. Ne testlenmemeli?

- implementation detail seviyesinde class name parça parça doğrulama
- gereksiz iç helper ayrıntıları
- behavior değeri taşımayan markup detayları

## 16.4. Kural

Design system testleri component contract’a odaklanmalıdır; implementation ayrıntısına kilitlenmemelidir.

---

# 17. Forms ve Validation Test Stratejisi

## 17.1. Forms neden özel alan?

Formlar şu yüzden yüksek risklidir:
- kullanıcı veri girişi taşır,
- hata/recovery gerektirir,
- validation ve submit birlikte çalışır,
- server response ile sık etkileşir.

## 17.2. Testlenmesi gereken alanlar

- field-level validation visibility
- form-level error handling
- submit pending state
- success state
- retry/recovery
- dirty/touched davranışları (gerektiğinde)
- disabled submit logic
- multi-step form transitions
- field helper/error relation
- navigation sonrası preservation/reset behavior

## 17.3. Hangi seviyede?

- saf validation kuralları → unit
- field shell contract → component
- submit flow → integration
- kritik multi-step forms → integration / E2E
- visual hierarchy ve copy quality → audit

## 17.4. Zayıf davranışlar

- validation’ı sadece unit test edip UI behavior’ı boş bırakmak
- submit flow’u integration test olmadan bırakmak
- form error recovery’yi hiç doğrulamamak

---

# 18. Data Fetching / Cache / Sync Test Stratejisi

## 18.1. Neden kritik?

Gerçek ürünlerin büyük kısmı state değil, veri davranışı yüzünden bozulur:
- stale data
- bad invalidation
- duplicate fetch
- broken retry
- conflict handling eksikliği
- loading state yanlışlığı

## 18.2. Ne testlenmeli?

- query success/failure mapping
- mutation side-effects
- retry behavior
- empty/error/loading transitions
- stale/refetch behavior (bağlama göre)
- optimistic update correctness
- rollback behavior
- section-level vs screen-level loading ayrımı

## 18.3. Hangi seviyede?

- pure mappers/selectors → unit
- query hook + orchestration + UI transitions → integration
- kritik remote-dependent workflows → E2E + observability

## 18.4. Zayıf davranışlar

- data layer’ı hiç izolasyonla test etmemek
- cache invalidation davranışını sadece canlı kullanımda fark etmeyi beklemek
- stale/refetch farklarını test dışında bırakmak

---

# 19. Navigation ve Flow Test Stratejisi

## 19.1. Neden gereklidir?

Navigation bug’ları çoğu zaman:
- yanlış yönlendirme,
- broken back behavior,
- modal stuck state,
- auth redirect loop
şeklinde çıkar.

## 19.2. Testlenmesi gereken alanlar

- önemli route transitions
- auth gate redirects
- modal/sheet open-close expectations
- deep link resolution
- multi-step flow continuity
- back navigation correctness
- form leave/return behavior
- destructive confirm flows

## 19.3. Hangi seviyede?

- flow orchestration → integration
- kritik full user journey → E2E
- visual/navigation tone → manual audit

---

# 20. Cross-Platform Parity Test Stratejisi

## 20.1. Kural

Cross-platform parity her zaman aynı test dosyasını paylaşmak demek değildir.  
Ama behavior parity kritik alanlarda doğrulanmalıdır.

## 20.2. Neler düşünülmeli?

- aynı görevin iki platformda tamamlanabilirliği
- platform-specific adaptation sonrası core behavior’ın korunması
- feedback state eşdeğerliği
- form/navigate/save/retry davranışlarının ürün mantığı açısından uyumu

## 20.3. Doğrulama biçimleri

- shared domain/unit tests
- platform-specific integration tests
- parity-focused manual audits
- bazı kritik E2E akışların her platform için doğrulanması

## 20.4. Zayıf davranışlar

- bir platformu tamamen manual teste bırakmak
- parity riskini test stratejisinde hiç görünmez bırakmak
- shared code var diye parity otomatik sanmak

---

# 21. Accessibility Testing Stratejisi

## 21.1. A11y neden test stratejisinin parçasıdır?

Çünkü erişilebilirlik yalnızca audit notu değildir; birçok kısmı doğrulanabilir behavior’dır.

## 21.2. Neler testlenebilir?

- accessible name/role/state presence
- form helper/error linking
- disabled/invalid semantics
- keyboard interactions (web)
- focus transitions (seçili alanlarda)
- modal/dialog basic focus expectations
- selected/expanded semantics

## 21.3. Neler audit ister?

- screen reader gerçek deneyimi
- complex focus flow
- dynamic type kırılmaları
- color contrast nuance’ları
- HIG tonu ile a11y dengesi

## 21.4. Kural

A11y yalnızca “linter bağırmadı” düzeyinde bırakılmamalıdır.

## 21.5. Erişilebilirlik Test Otomasyonu

### 21.5.1. Neden otomasyon gereklidir?

Manuel erişilebilirlik testi vazgeçilmezdir; ancak tek başına yeterli değildir. Büyüyen bir component library'de her PR'da her bileşeni, her state'i, her sayfayı manuel olarak screen reader ile test etmek pratik açıdan mümkün değildir. Regresyon riski yüksektir: daha önce doğru çalışan bir bileşende yapılan küçük bir değişiklik, fark edilmeden erişilebilirlik kırılmasına yol açabilir. Otomatik araçlar; missing label, low contrast, missing alt text, broken ARIA relationship gibi bilinen ve kural tabanlı ihlalleri her PR'da, her build'de, her ortamda tutarlı biçimde kontrol eder. Bu sayede insan denetimi yalnızca otomasyonun yakalayamadığı alanlara odaklanabilir ve toplam doğrulama kalitesi artar.

### 21.5.2. Araçlar ve kullanım katmanları

Erişilebilirlik test otomasyonu tek bir araçla değil, birbirini tamamlayan dört katmanla çalışır. Her katman farklı bir zamanda, farklı bir derinlikte hata yakalar.

**Katman 1 — Static analysis (lint-time)**

Kullanılan araçlar:
- Web projeleri için: `eslint-plugin-jsx-a11y`
- React Native projeleri için: `eslint-plugin-react-native-a11y`

Bu plugin'ler JSX yazılırken, daha kod commit edilmeden hataları yakalar. Yakaladığı sorunlara örnekler:
- `<img>` elementinde `alt` prop'unun eksik olması
- interaktif bir elementin `aria-label` veya accessible name taşımaması
- tıklanabilir bir elementin keyboard handler (`onKeyDown`, `onKeyPress`) barındırmaması
- `<a>` etiketinin `href` olmadan kullanılması
- `role` ile uyumsuz ARIA attribute kombinasyonları

Bu kurallar CI pipeline'da **blocker** olarak çalışmalıdır. Geçmeyen bir PR merge edilemez. Lint-time hataları en ucuz hatadır; yazım anında yakalanır, düzeltme maliyeti minimumdur.

**Katman 2 — Component test seviyesi**

Kullanılan araçlar:
- `jest-axe` (Jest kullanan projeler için)
- `vitest-axe` (Vitest kullanan projeler için)

Her reusable component'in test dosyasında, rendered HTML çıktısına `axe-core` analizi çalıştırılır. Temel kullanım şablonu:

```typescript
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

it('erişilebilirlik ihlali barındırmamalıdır', async () => {
  const { container } = render(<Button label=”Kaydet” />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

Bu test, render edilmiş DOM üzerinde şu sorunları yakalar:
- yetersiz renk kontrastı (color contrast failure)
- heading hierarchy'nin kırılması (ör: h1'den sonra h3'e atlanması)
- landmark eksikliği (main, nav, banner gibi bölge tanımlarının olmaması)
- form input'larının label ile ilişkilendirilmemiş olması
- ARIA attribute'larının geçersiz veya tutarsız kullanımı

**Kritik detay:** Bu testler yalnızca happy-path (başarılı durum) için yazılmamalıdır. Aşağıdaki state'lerin her biri ayrı ayrı a11y taramasından geçirilmelidir:
- **default state** (bileşenin ilk hali)
- **error state** (form doğrulama hatası, API hatası vb.)
- **loading state** (yükleniyor durumu, skeleton, spinner)
- **empty state** (veri yokken gösterilen durum)
- **disabled state** (devre dışı bırakılmış durum)

Component test seviyesindeki a11y testleri CI'da **blocker** olarak çalışmalıdır.

**Katman 3 — Integration / E2E seviyesi**

Kullanılan araçlar:
- Playwright'ın built-in accessibility snapshot özelliği
- `@axe-core/playwright` entegrasyonu
- Gerektiğinde Vitest Browser Mode ile component-level gerçek browser davranış doğrulaması
- Web reusable component'ler için Storybook 10 + Storybook Test (Vitest addon) ile story-temelli browser doğrulaması güçlü adaydır

Kritik kullanıcı akışları (user flow) E2E testi sırasında a11y taramasından geçirilir. Bu katman, birden fazla bileşenin bir arada çalıştığı gerçek sayfa bağlamında erişilebilirlik sorunlarını yakalar. Tekil component testlerinde görünmeyen ama sayfa bütününde ortaya çıkan sorunlar (ör: birden fazla `<main>` landmark, çakışan heading hierarchy, sayfa genelinde bozulan tab sırası) bu katmanda yakalanır.

Kural: Uygulamadaki her sayfa en az bir kez axe scan'den geçirilmiş olmalıdır.

**Katman 4 — Manual audit (otomasyonla YAKALANMAYAN alanlar)**

Aşağıdaki alanlar hiçbir otomatik araçla güvenilir biçimde test edilemez ve insan denetimi zorunludur:

- **Screen reader deneyimi:** VoiceOver (iOS/macOS) ve TalkBack (Android) ile gerçek kullanıcı akışının sesli okunma kalitesi, anlam bütünlüğü, okuma sırası. Bir elementin teknik olarak accessible name taşıması, onun anlamlı ve kullanılabilir biçimde okunduğu anlamına gelmez.
- **Keyboard-only navigation akıcılığı:** Tüm sayfanın yalnızca klavye ile (Tab, Shift+Tab, Enter, Space, Arrow keys) gezilmesi. Focus'un mantıklı bir sıra izlemesi, hiçbir etkileşimli elemanın atlanmaması, çıkmaz noktaların olmaması.
- **Focus trap doğruluğu:** Modal, dialog, drawer gibi overlay bileşenlerinde focus'un overlay içinde kalması, overlay kapandığında focus'un tetikleyen elemana dönmesi.
- **Reduced motion davranışı:** `prefers-reduced-motion: reduce` ayarı aktifken animasyonların durması veya sadeleşmesi. Bu davranışın gerçek cihazda doğrulanması.
- **Renk körlüğü simülasyonu:** Protanopia, deuteranopia, tritanopia filtrelerinde bilginin yalnızca renge bağlı olmadan iletildiğinin doğrulanması.
- **Touch target fiziksel testi:** Mobilde dokunma hedeflerinin gerçek parmak boyutunda (minimum 44x44 pt iOS, 48x48 dp Android) olduğunun fiziksel cihazda doğrulanması.

### 21.5.3. Otomasyonun sınırları

`axe-core` gibi endüstri standardı araçlar, bilinen WCAG kurallarının yaklaşık **%30-40**'ını otomatik olarak tespit edebilir. Bu oran düşük görünebilir ancak bu %30-40'lık dilim en yaygın, en tekrarlanabilir ve en kolay kaçırılan hataları kapsar. Geri kalan **%60-70**'lik dilim insan değerlendirmesi gerektirir. Bu dilimde yer alan sorunlar:

- **Semantik anlam:** Bir butonun `aria-label`'ı teknik olarak var ama kullanıcı için anlamlı mı?
- **Mantıksal okuma sırası:** DOM sırası görsel sırayla uyumlu mu? Screen reader kullanıcısı bilgiyi anlamlı sırada alıyor mu?
- **Anlaşılabilirlik:** Hata mesajı, yönlendirme metni, durum bildirimi gerçekten anlaşılır mı?
- **Bağlamsal uygunluk:** Bir ARIA pattern teknik olarak doğru ama kullanım bağlamında uygun mu?

Bu nedenle otomasyon, manual audit'in **yerine** değil **yanına** eklenir. Otomasyon bilinen kuralları korur; insan denetimi anlam, bağlam ve deneyim kalitesini doğrular.

### 21.5.4. CI entegrasyonu

Her PR açıldığında aşağıdaki erişilebilirlik kontrolleri otomatik olarak çalışır:

| Kontrol | Araç | CI seviyesi | Sonuç |
|---|---|---|---|
| ESLint a11y kuralları | `eslint-plugin-jsx-a11y` / `eslint-plugin-react-native-a11y` | **Blocker** | Geçmezse PR merge edilemez |
| Component a11y testleri | `jest-axe` / `vitest-axe` | **Blocker** | Geçmezse PR merge edilemez |
| E2E a11y taraması | `@axe-core/playwright` | **Major** | Warning üretir; bilinçli exception alınabilir |

Blocker seviyesindeki kontroller istisnasız uygulanır. Major seviyesindeki kontrollerde takım, belirli bir ihlali geçici olarak kabul edebilir ancak bu kabul yazılı gerekçe ve çözüm planı içermelidir.

### 21.5.5. Severity mapping

`axe-core`'un raporladığı violation'lar, projenin kendi severity modeline şu şekilde eşlenir:

| axe-core severity | Örnek ihlal | Proje severity |
|---|---|---|
| **Critical** | `<img>` elementinde `alt` attribute eksik, form input'unda label yok, interaktif eleman klavye ile erişilemiyor | **Blocker** |
| **Serious** | Renk kontrastı WCAG AA eşiğinin altında, focus göstergesi görünmüyor | **Major** |
| **Moderate** | Heading hierarchy'de seviye atlanmış (h2'den h4'e), landmark bölgesi eksik | **Minor** |
| **Minor** | Gereksiz (redundant) ARIA role kullanımı, tabindex değeri pozitif | **Informational** |

Bu eşleme, a11y ihlallerinin genel bug triage sürecine entegre olmasını sağlar. Blocker ve Major violation'lar sprint içinde çözülmelidir. Minor ve Informational violation'lar backlog'a alınır ve planlı iyileştirme döngülerinde ele alınır.

### 21.5.6. Baseline ve exception yönetimi

Mevcut bir projeye a11y test otomasyonu ilk kez eklendiğinde, halihazırda var olan violation'ların tamamının anında düzeltilmesi genellikle pratik değildir. Bu durumda **ratchet pattern** uygulanır:

1. **Baseline kaydı:** Mevcut violation'lar sayılır ve baseline dosyasına kaydedilir.
2. **Yeni violation engeli:** Baseline'dan fazla violation içeren PR'lar merge edilemez. Bu kural, mevcut durumun kötüleşmesini önler.
3. **Kademeli iyileştirme:** Mevcut violation'lar zamanla azaltılır. Her sprint'te en az bir violation kategorisinin çözülmesi hedeflenir.
4. **Exception mekanizması:** Belirli bir violation'ın geçici olarak kabul edilmesi gerektiğinde, yazılı gerekçe ve planlanan çözüm tarihi ile exception kaydı oluşturulur. Exception'lar düzenli olarak gözden geçirilir.

Bu yaklaşım, “ya hep ya hiç” tuzağından kaçınarak a11y kalitesinin sürekli ve ölçülebilir biçimde artmasını sağlar.

### 21.5.7. Hatalı yaklaşımlar

Aşağıdaki davranışlar, erişilebilirlik test otomasyonu bağlamında doğrudan **zayıf** kabul edilir:

- **”Axe geçiyorsa a11y tamam” varsayımı:** axe-core bilinen kuralların yalnızca %30-40'ını tespit eder. Otomatik taramanın geçmesi, erişilebilirliğin tam olduğu anlamına gelmez. Manual audit her zaman gereklidir.
- **”Sonra ekleriz” ertelemesi:** A11y testlerini “MVP'den sonra”, “lansman'dan sonra”, “refactor'dan sonra” ekleme planı yapmak. Ertelenen a11y testleri neredeyse hiçbir zaman eklenmez ve teknik borç katlanarak büyür.
- **ESLint a11y kurallarını disable etmek:** `eslint-disable` ile a11y kurallarını susturmak, en ucuz ve en erken yakalanan hata katmanını devre dışı bırakır. Bu davranış code review'da reddedilmelidir.
- **jest-axe testini yalnızca happy-path için yazmak:** Bir bileşenin yalnızca başarılı/default state'ini test edip error state, loading state, empty state ve disabled state'i atlamak. Erişilebilirlik kırılmaları çoğunlukla kenar durumlarda (edge case) ortaya çıkar.
- **A11y testlerini “yavaşlatıyor” gerekçesiyle CI'dan çıkarmak:** axe-core taraması milisaniyeler sürer. Algılanan yavaşlık genellikle konfigürasyon hatasından kaynaklanır, çözüm taramayı kaldırmak değil konfigürasyonu düzeltmektir.
- **Severity eşlemesini yapmadan tüm violation'ları eşit görmek:** Critical bir ihlali (missing label) ile informational bir ihlali (redundant ARIA role) aynı kefeye koymak, önceliklendirmeyi bozar ve ekibi gereksiz yere yorar.

---

# 22. Performance Verification Stratejisi

## 22.1. Test mi, audit mi, ölçüm mü?

Performans çoğu zaman tek tür doğrulama ile kapanmaz.

## 22.2. Düşünülmesi gereken alanlar

- render scope riskleri
- large list behavior
- startup blockers
- route transition weight
- form typing responsiveness
- repeated refresh loops
- cache miss cost patterns

## 22.3. Doğrulama türleri

- unit/component test performansın doğrudan yerini tutmaz
- targeted profiling / measurement gerekir
- manual audit gerekir
- observability sinyalleri gerekir

## 22.4. Kural

Performans kritik alanlar “test var” diye kapatılmış sayılmaz.

---

# 23. Visual Verification Stratejisi

## 23.1. Neden test stratejisinde yer alır?

Çünkü UI ürünlerinde görsel regression gerçek regressions’dır.

## 23.2. Düşünülmesi gerekenler

- component states
- high-value screens
- layout hierarchy
- spacing/token regressions
- theme differences
- platform differences

## 23.3. Yöntemler

- targeted visual regression
- before/after screenshot proof
- manual screenshot-faithful audit
- state matrix screenshots

## 23.4. Kural

Her pixel için automated visual testing zorunlu değildir.  
Ama yüksek riskli UI yüzeyleri kör bırakmak kabul edilmez.

---

# 24. Coverage Nasıl Yorumlanmalı?

## 24.1. Coverage neden tehlikeli metrik olabilir?

Çünkü yüksek coverage:
- yanlış şeyleri test ediyorsa,
- kritik akışları boş bırakıyorsa,
- snapshot şişkinliğine dayanıyorsa
sahte güven üretir.

## 24.2. Kural

Coverage:
- yardımcı trend sinyali olabilir
- ama kalite kararı bununla verilmez

## 24.3. Sağlıklı yorum

Şu soruya bakılmalıdır:
“Riskli alanlar gerçekten anlamlı biçimde testlenmiş mi?”

---

# 25. Snapshot Kullanımı

## 25.1. Snapshot neden cazip?

Yazması kolaydır.  
Ama bu yüzden kötüye kullanılır.

## 25.2. Ne zaman sınırlı anlamlı olabilir?

- çok kontrollü stable output
- bilinçli küçük output contracts
- görsel veya markup drift’i gerçekten sinyal taşıyan dar alanlar

## 25.3. Ne zaman zararlıdır?

- her component için büyük snapshot
- reviewer’ın fark edemeyeceği dev diff’ler
- behavior yerine markup kopyası saklamak
- kolay coverage üretmek

## 25.4. Kural

Snapshot test, varsayılan ana strateji olamaz.

---

# 26. Mocking İlkeleri

## 26.1. Mock neden gerekir?

İzolasyon, determinism ve odak için gerekir.

## 26.2. Mock neden tehlikeli olabilir?

Aşırı mock:
- gerçek davranışı gizler,
- integration sorunlarını örtbas eder,
- testleri implementation detaya bağlar.

## 26.3. Kural

Mocking:
- gerekli yerde,
- contract odaklı,
- minimum düzeyde
kullanılmalıdır.

## 26.4. Zayıf davranışlar

- tüm dünya mock, ama davranış gerçek değil
- network/cache orchestration’ı aşırı mock yüzünden test etmiyor olmak
- internal implementation detail’leri mock’layarak sahte unit güveni üretmek

---

# 27. Test Data ve Fixture Kuralları

## 27.1. Kural

Test verisi:
- sentetik,
- açıklanabilir,
- güvenli,
- minimum gerekli
olmalıdır.

## 27.2. Dikkat edilmesi gerekenler

- gerçek kullanıcı verisi kullanılmamalı
- fixture’lar production shape’i anlamlı yansıtmalı
- çok büyük ve anlamsız fixture çöplüğü oluşmamalı
- feature-private fixture shared dependency’ye dönüşmemeli

## 27.3. Zayıf davranışlar

- gerçek üretim verisini kopyalamak
- anlamsız dev fixture dosyaları
- aynı fixture’ın onlarca testte farklı gizli anlamlarla kullanılması

---

# 28. Flaky Test Politikası

## 28.1. Flaky test nedir?

Aynı kod için bazen geçen, bazen kalan testtir.

## 28.2. Neden çok tehlikelidir?

Çünkü:
- CI güveni düşer,
- ekip failure’ları ciddiye almaz,
- gerçek regression ile noise ayırt edilemez,
- kalite kültürü çürür.

## 28.3. Kural

Flaky test:
- normal kabul edilmez
- “arada oluyor” diye bırakılmaz
- karantinaya alınacaksa görünür biçimde alınır
- kök neden takip edilir

## 28.4. Zayıf davranışlar

- flaky test’i rerun ile çözmek
- sürekli ignore edilen failing suite
- güven üretmeyen test kalabalığı

---

# 29. Test Ownership

## 29.1. Kural

Test yazma sorumluluğu yalnızca QA veya yalnızca reviewer’a itilemez.  
Katkıyı yapan kişi, değişikliğin hangi doğrulama düzeyini gerektirdiğini düşünmek zorundadır.

## 29.2. Reviewer’ın rolü

Reviewer:
- test seviyesi yeterli mi,
- yanlış düzey seçilmiş mi,
- manual audit gerekiyor mu
gibi soruları sorar.

Ama contributor’ın hiç düşünmediği test stratejisini baştan kurmak reviewer görevi değildir.

---

# 30. Test ve CI İlişkisi

## 30.1. Kural

Test stratejisi CI kalite kapıları ile bağlı olmalıdır.

## 30.2. Ne demek?

- kritik testler otomatik çalışmalı
- relevant suites seçilebilir olmalı
- type/lint ile birlikte yorumlanmalı
- flaky/noisy testler görünür olmalı
- release öncesi kritik flow’lar güven altında olmalı

## 30.3. Zayıf davranışlar

- test stratejisi dokümanda var ama CI’ya bağlanmamış
- hangi suite neyi koruyor belli değil
- contributor local verify yapmadan CI’ya güveniyor

---

# 31. Test Seçimi İçin Hızlı Karar Çerçevesi

Aşağıdaki pratik çerçeve kullanılmalıdır:

## 31.1. Saf hesaplama mı?
→ Unit test

## 31.2. Reusable UI contract mı?
→ Component test

## 31.3. Form, query, retry, orchestration davranışı mı?
→ Integration test

## 31.4. Kritik kullanıcı görevi mi?
→ E2E + gerektiğinde integration

## 31.5. Görsel kalite / HIG / premium ton mu?
→ Manual audit + visual proof, gerekiyorsa targeted visual regression

## 31.6. A11y semantics mi?
→ Static + component/integration + manual audit kombinasyonu

---

# 32. Test Gerekmediği Sanılan Ama Aslında Gereken Alanlar

Aşağıdaki alanlar sık yanlış değerlendirilir:

1. reusable button/input states
2. form error/retry flows
3. permission-gated actions
4. empty/loading/error transitions
5. cache invalidation sonrası UI behavior
6. deep link and return flow
7. feature-local draft preservation/reset
8. cross-platform task parity

Bu alanlar “küçük” sanılıp boş bırakıldığında pahalı regression üretir.

---

# 33. Testing Anti-Pattern Listesi

Aşağıdaki davranışlar bu proje kapsamında zayıf kabul edilir:

1. Coverage’ı amaç haline getirmek
2. Her şeyi unit test ile çözmeye çalışmak
3. Her şeyi E2E’ye bırakmak
4. Reusable components’i testsiz bırakmak
5. Integration gerektiren akışı snapshot ile geçiştirmek
6. Manual audit gereken alanları tamamen yok saymak
7. Flaky testleri normalleştirmek
8. Mocking ile gerçek behavior’ı gizlemek
9. “Küçük değişiklik” bahanesiyle riskli alanı testsiz geçirmek
10. A11y ve visual kaliteyi test stratejisinin dışına atmak
11. Feature orchestration’ı hiç integration test etmemek
12. Kritik akışları yalnızca local manuel deneyime bırakmak
13. Aynı bug ailesi tekrar ederken test eklememek
14. Test verisini güvenlik ve anlam açısından kontrolsüz bırakmak
15. CI ile uyumsuz test stratejisi kurmak

---

# 34. Test Kararı Verirken Sorulacak Sorular

Bir değişiklik için test planı belirlerken şu sorular sorulmalıdır:

1. Bu saf mantık mı, UI contract mı, orchestration mı, user journey mi?
2. Bozulursa kullanıcı etkisi ne?
3. En ucuz ama anlamlı güven hangi seviyede sağlanır?
4. Bu reusable mı, feature-local mi?
5. Manual audit olmadan kalite eksik kalır mı?
6. A11y etkisi var mı?
7. Cross-platform parity riski var mı?
8. Visual regression riski var mı?
9. Mock ile mi, gerçek entegrasyon ile mi anlamlı sinyal alırım?
10. Bu davranış için yeterli kanıt üretiyor muyum, yoksa sadece test sayısı mı artırıyorum?

---

# 35. Sonraki Dokümanlara Etkisi

## 35.1. Quality gates and CI rules
`15-quality-gates-and-ci-rules.md`, hangi test katmanlarının resmi gate olacağını bu stratejiye bağlamalıdır.

## 35.2. Contribution guide
`30-contribution-guide.md`, contributor’ın riskine uygun test/doğrulama düşünmesini bu belgeye göre istemelidir.

## 35.3. Audit checklist
`31-audit-checklist.md`, test boşluklarını ve yanlış test katmanı seçimlerini bu belgeye göre denetlemelidir.

## 35.4. Definition of done
`32-definition-of-done.md`, “done” kararında test ve manual audit gereksinimlerini bu belgeye göre bağlamalıdır.

## 35.5. HIG enforcement strategy
`34-hig-enforcement-strategy.md`, otomatik HIG sinyalleri ile manual audit/test ilişkisini bu belgeyle hizalamalıdır.

## 35.6. ADR-008 test stack kararları
`ADR-008-testing-stack.md`: Bu belgedeki test katmanları ve stratejik kararlar, ADR-008'de verilen test araç seçimleriyle (Vitest web-side, Jest mobile-side, Testing Library, Playwright E2E) uygulanacaktır. ADR-008, bu belgenin canonical test araç otoritesidir.

---

# 36. Onay Kriterleri

Bu doküman yeterli kabul edilir eğer:

1. Test katmanları net ayrılmışsa,
2. Risk-temelli test seçimi mantığı açıklanmışsa,
3. Domain, reusable UI, forms, data layer, navigation, parity, a11y ve visual kalite için doğru doğrulama türleri ayrılmışsa,
4. Coverage, snapshot, mocking ve flaky test konularında net kural seti yazılmışsa,
5. Manual audit’in rolü açıkça tanımlanmışsa,
6. CI ve contribution süreçleriyle bağı kurulmuşsa,
7. Anti-pattern’ler net biçimde tanımlanmışsa.

---

# 37. Kısa Sonuç

Bu dokümanın ana çıktısı şudur:

> Bu boilerplate kapsamında test stratejisi, coverage üretmek veya her şeyi tek tip testle kapatmak değil; domain kararlarını, reusable UI kontratlarını, orchestration davranışlarını ve kritik kullanıcı görevlerini riskine uygun unit, component, integration, E2E ve manual audit katmanlarıyla güvence altına alma disiplinidir.
