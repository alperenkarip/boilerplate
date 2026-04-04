---
belge-adi: AI Development Standards
dosya-adi: 52-ai-development-standards.md
belge-turu: Governance / AI development workflow / quality enforcement
durum: Accepted
tarih: 2026-04-03
---

# 52-ai-development-standards.md

## Doküman Kimliği

- **Doküman adı:** AI Development Standards
- **Dosya adı:** `52-ai-development-standards.md`
- **Doküman türü:** Governance / AI development workflow / quality enforcement
- **Durum:** Accepted
- **Tarih:** 2026-04-03
- **Kapsam:** Bu belge, AI araçlarının (Claude Code, MoAI-ADK, Codex CLI) kod üretirken uyması gereken geliştirme standartlarını, kalite kurallarını, dosya oluşturma protokolünü, guardrail otomasyonunu, hook standartlarını ve derived project miras kurallarını tanımlar. Boilerplate standartlarının AI destekli geliştirme süreçlerinde otomatik ve tutarlı olarak uygulanmasını garantiler.
- **Bağlı olduğu üst dokümanlar:**
  - `00-project-charter.md`
  - `01-working-principles.md`
  - `40-ai-workflow-and-tooling.md`
  - `41-ai-instruction-standards.md`
  - `47-ai-guardrail-governance.md`
  - `45-boilerplate-project-boundary-contract.md`
  - `50-coding-standards-and-file-conventions.md`
- **Doğrudan etkileyeceği dokümanlar:**
  - `CLAUDE.md`
  - `AGENTS.md`
  - `30-contribution-guide.md`
  - `32-definition-of-done.md`
  - `35-document-map.md`
  - `43-derived-project-creation-guide.md`
  - `15-quality-gates-and-ci-rules.md`

---

# 1. Amaç

Bu dokümanın amacı, AI destekli geliştirme süreçlerinde kod kalitesi, tutarlılık ve güvenliği sağlamaktır. AI araçlarının boilerplate standartlarını otomatik olarak uygulamasını garantilemek ve derived project'lerde AI davranışlarının standart ve öngörülebilir olmasını sağlamaktır.

Boilerplate projesi 50'den fazla standart doküman, 19 ADR, canonical stack kararları ve katmanlı governance kurallarıyla çalışır. Bu kurallar insan geliştiriciler için yazılmış narratif dokümanlarda yaşar. Ancak AI araçları bu dokümanları her oturumda tam olarak okumaz, hatırlamaz veya context sınırları nedeniyle kısmen uygulayabilir.

Bu belge özellikle şu sorulara net ve operasyonel cevap verir:

1. AI araçları kod üretirken hangi geliştirme prensiplerini ZORUNLU olarak uygulamalıdır?
2. Yeni dosya oluşturma süreci nasıl yönetilmelidir?
3. Kod üretiminde hangi standartlar her zaman geçerlidir?
4. Guardrail otomasyonu nasıl çalışır ve hangi aşamalarda tetiklenir?
5. Hook'lar neyi kontrol eder ve nasıl yapılandırılır?
6. MoAI-ADK entegrasyonu hangi kalite çerçevesiyle çalışır?
7. @MX tag'leri ne zaman ve nasıl eklenir?
8. Context window yönetimi nasıl optimize edilir?
9. Worktree kullanım kuralları nelerdir?
10. Derived project'ler bu standartları nasıl miras alır?

Bu belge olmadan aşağıdaki sorunlar kaçınılmazdır:

- AI araçları plan sunmadan büyük değişiklikler yapar; geri dönüş maliyeti artar.
- Multi-file değişikliklerde takip kaybı olur; yarım kalan işler birikir.
- Bug fix'ler test olmadan yapılır; regresyon riski sürekli artar.
- Guardrail'ler tetiklenmez; standart dışı kod sessizce üretim koduna girer.
- Her oturum kendi başına ayrı bir dünya olur; AI davranışı öngörülemez hale gelir.
- Derived project'lerde AI disiplini hızla erozyana uğrar.

**İlişki açıklaması:**

- `40-ai-workflow-and-tooling.md` AI araçlarının rollerini ve otorite hiyerarşisini tanımlar. Bu doküman, o araçların **nasıl kod üretmesi gerektiğini** tanımlar.
- `41-ai-instruction-standards.md` talimat dosyalarının formatını tanımlar. Bu doküman, AI'ın **çalışma sırasında uyması gereken geliştirme kurallarını** tanımlar.
- `47-ai-guardrail-governance.md` guardrail çerçevesini ve tetikleme mekanizmasını tanımlar. Bu doküman, o çerçevenin **geliştirme standartlarıyla bütünleşik uygulamasını** tanımlar.
- `50-coding-standards-and-file-conventions.md` hem insan hem AI için kodlama kurallarını tanımlar. Bu doküman, o kuralların **AI araçlarına özel uygulama protokolünü** tanımlar.

---

# 2. HARD Kurallar — AI Geliştirme Prensipleri

Bu bölümdeki kurallar [HARD] işaretlidir. HARD kurallar istisnasızdır; exception policy (`44-exception-and-exemption-policy.md`) kapsamında bile gevşetilemez. Derived project'lerde override edilemez; yalnızca sıkılaştırılabilir.

## 2.1 Approach-First Development (Yaklaşım Öncelikli Geliştirme)

**[HARD]** AI aracı kod yazmadan ÖNCE aşağıdaki adımları tamamlamalıdır:

1. **Uygulama yaklaşımını açıkla:** Değişikliğin ne olduğunu, neden yapıldığını, hangi pattern'in kullanılacağını ve hangi mimariye uygun olduğunu kısa bir plan olarak sun.
2. **Değişecek dosyaları listele:** Hangi dosyaların oluşturulacağını, düzenleneceğini veya silineceğini açıkça belirt.
3. **Potansiyel riskleri belirt:** Breaking change, backward compatibility, performance etkisi, başka modüllere yan etki, platform farklılıkları gibi riskleri tanımla.
4. **Kullanıcı onayını al:** Plan onaylandıktan sonra kodlamaya geç. Onay gelmeden kodlama başlamaz.

**İstisnalar (plan sunma zorunluluğundan muaf durumlar):**

- Typo düzeltmeleri (tek satır, anlam değişikliği olmayan).
- Açık ve basit bug fix'ler (tek dosya, tek fonksiyon, <20 satır değişiklik, root cause belirgin).
- Yorum veya doküman düzeltmeleri (kod davranışını etkilemeyen).

**Neden:** Büyük değişikliklerde geri dönüş maliyeti yüksektir. AI aracının önceden plan sunması, kullanıcının yönlendirme yapmasını, kapsamı daraltmasını veya alternatif yaklaşım önermesini sağlar. Plansız büyük değişiklikler, kullanıcının context'i kaybetmesine ve "ne oldu burada" durumuna yol açar.

## 2.2 Multi-File Decomposition (Çoklu Dosya Ayrıştırma)

**[HARD]** 3 veya daha fazla dosya değiştirilecekse aşağıdaki süreç uygulanır:

1. **Task listesi oluştur:** Değişiklikleri mantıksal birimlere ayır ve her birim için bir task tanımla (TodoList/TaskCreate).
2. **Dosya bağımlılıklarını analiz et:** Hangi dosyaların birbirine bağımlı olduğunu, değişiklik sırasının önemli olup olmadığını belirle.
3. **Mantıksal birimler halinde grupla:** İlişkili dosyaları aynı task altında topla. Her task bağımsız olarak anlamlı olmalıdır. Birlikte değişmesi gereken dosyalar aynı task'ta.
4. **Her birim tamamlandıktan sonra ilerleme raporla:** Tamamlanan task'ı, bekleyen task'ları ve varsa engelleri bildir (TaskUpdate ile status güncelle).

**Neden:** Multi-file değişikliklerde AI aracının context window'u dolabilir, takip kaybı yaşanabilir veya yarım kalan bir değişiklik seti tutarsız bir duruma yol açabilir. Yapılandırılmış task listesi, hem AI'ın hem kullanıcının ilerlemeyi takip etmesini sağlar.

## 2.3 Post-Implementation Review (Uygulama Sonrası Gözden Geçirme)

**[HARD]** Her kodlama görevi tamamlandıktan sonra AI aracı aşağıdaki review'ı sunmalıdır:

1. **Potansiyel sorunları listele:** Edge case'ler, concurrency riskleri, error senaryoları, null/undefined durumları, ağ hatası senaryoları, platform farkları (web/iOS/Android).
2. **Test case önerileri sun:** Yazılması gereken unit, integration veya E2E testlerini tanımla. Hangi senaryoların doğrulanması gerektiğini belirt.
3. **Known limitations ve assumptions belirt:** Yapılan varsayımları, bilinen kısıtlamaları ve gelecekte değişmesi muhtemel noktaları açıkça ifade et.
4. **Ek validasyon ihtiyaçlarını belirt:** Manuel test gerektiren durumlar, belirli cihaz/tarayıcıda doğrulanması gereken davranışlar, performance profiling ihtiyacı, a11y audit gerekliliği.

**Neden:** AI'ın ürettiği kodda gizli sorunlar olabilir. Proaktif review, bu sorunların erken tespit edilmesini sağlar. Kullanıcı, AI'ın "her şey tamam" demesini beklemek yerine, bilinen risklerin farkında olarak karar verir.

## 2.4 Reproduction-First Bug Fixing (Önce Tekrarlama)

**[HARD]** Bug fix sürecinde aşağıdaki adımlar sırasıyla uygulanır:

1. **Bug'ı reproduce eden test yaz:** Bug'ın davranışını tam olarak yakalayan bir test oluştur. Failing test = bug'ın kanıtı.
2. **Test'in FAIL ettiğini doğrula (RED):** Test'in mevcut kodda beklenen şekilde başarısız olduğunu teyit et.
3. **Minimal kod değişikliği yap:** Bug'ı düzeltmek için gereken en küçük değişikliği uygula. Refactoring, iyileştirme veya ilişkisiz değişiklik YAPMA.
4. **Test'in PASS ettiğini doğrula (GREEN):** Düzeltme sonrası test'in başarılı olduğunu teyit et.
5. **Varsa refactor yap (REFACTOR):** Düzeltme sonrası kod kalitesi iyileştirmesi gerekiyorsa ayrı bir adım olarak yap.

**İstisnalar:**

- UI-only bug'lar (görsel bozukluk) için visual test opsiyoneldir.
- Third-party kısa süreli workaround'lar için yorum ile açıklama yeterlidir.

**Neden:** Test olmadan yapılan fix'ler başka davranışları kırabilir (regresyon). Reproduction-first yaklaşım, düzeltmenin doğruluğunu kanıtlar ve gelecekte aynı bug'ın tekrarlanmasını engelleyen bir güvence ağı oluşturur. Bu, klasik TDD'nin RED-GREEN-REFACTOR döngüsünün bug fix'e uyarlanmış halidir.

---

# 3. Dosya Oluşturma Protokolü

Bu bölüm, AI aracının yeni dosya oluşturma veya mevcut dosyaları değiştirme sürecindeki disiplin kurallarını tanımlar. `50-coding-standards-and-file-conventions.md` ile uyumludur.

## 3.1 Oluşturma Öncesi Kontrol

**[HARD]** AI aracı yeni bir dosya oluşturmadan ÖNCE aşağıdaki adımları tamamlamalıdır:

1. **Glob ile benzer dosyaları ara:** Aynı veya benzer işlevi yerine getiren mevcut dosyaların varlığını kontrol et. Aynı isimde veya benzer islevde dosya var mı? Duplikasyon önleme.
2. **Mevcut yapıyı ve konvansiyonları analiz et:** Hedef dizindeki dosya isimlendirme paterni, export stili, test yapısı, komşu dosyaların kullandığı pattern'leri incele.
3. **Dosya yerleşim kararını açıkla:** Dosyanın nereye oluşturulacağını ve nedenini belirt. `21-repo-structure-spec.md` ve `07-module-boundaries-and-code-organization.md` referans alınmalıdır.
4. **`50-coding-standards-and-file-conventions.md` uygunluğunu doğrula:** Dosya adı, uzantısı, yerleşimi ve yapısının kodlama standartlarına uygun olduğunu kontrol et.

**Neden:** AI araçları mevcut dosyaları yeterince araştırmadan yeni dosya oluşturma eğilimindedir. Bu, duplikasyon, konvansiyon kırılması ve maintainability sorunlarına yol açar.

## 3.2 Dosya Boyut Kontrolü

**[HARD]** AI aracının oluşturduğu veya değiştirdiği dosyalar aşağıdaki boyut limitlerini karşılamalıdır:

| Eşik          | Durum         | Eylem                                                                          |
| ------------- | ------------- | ------------------------------------------------------------------------------ |
| ≤300 satır    | Hedef         | Normal akış.                                                                   |
| 301–500 satır | Uyarı         | AI aracı dosya bölme önerisini kullanıcıya sunmalıdır. Bölme planı GEREKLI.    |
| 501–800 satır | Zorunlu bölme | Dosya component, hook, service, utility gibi mantıksal birimlere bölünmelidir. |
| >800 satır    | Kabul edilmez | AI aracı bu boyutta dosya oluşturmamalıdır. Bölme ZORUNLUDUR.                  |

**Bölme stratejisi:**

- UI logic → custom hook'a taşı.
- Data fetching → service/query dosyasına taşı.
- Validation → schema dosyasına taşı.
- Constants → constants dosyasına taşı.
- Types → types dosyasına taşı.
- Utility functions → utils dosyasına taşı.
- Alt component → ayrı component dosyasına taşı.

## 3.3 Klasör Açma Kriterleri

**[HARD]** Yeni klasör oluşturma aşağıdaki kurallara tabidir:

- **3+ ilişkili dosya → klasör oluştur:** Aynı feature/concern'e ait 3 veya daha fazla dosya varsa bir klasör altında organize et.
- **Tek dosya için klasör YASAK:** Sadece bir dosya içerecek klasör oluşturma.
- **Maksimum 4 seviye nested:** `src/features/auth/components/forms/` gibi 4 seviyeye kadar izin verilir. 5. seviye YASAKTIR.
- **Boş klasör YASAK:** İçinde dosya olmayan klasör oluşturma. Klasör, dosyayla birlikte oluşturulur.

---

# 4. Kod Üretim Standartları

Bu bölüm, AI aracının ürettiği kodun uyması gereken standartları tanımlar. Bu standartlar `50-coding-standards-and-file-conventions.md`'de tanımlanan kuralların AI-enforced versiyonudur. AI araçları kod üretirken aşağıdaki standartlara uyar; detaylar için kaynak dokümanlar referans alınır.

## 4.1 TypeScript Kuralları

| Kural                  | Seviye   | Açıklama                                                                            |
| ---------------------- | -------- | ----------------------------------------------------------------------------------- |
| `any` tipi             | YASAK    | `unknown` + type guard kullan. Referans: 50 §6.                                     |
| Gizli any tipleri      | YASAK    | `Record<string, any>`, `object`, `{}`, `Function` kullanma. Referans: 50 §6.2.      |
| `// @ts-ignore`        | YASAK    | Exception policy (`44-exception-and-exemption-policy.md`) gerektirir.               |
| `// @ts-expect-error`  | Koşullu  | Sadece geçici workaround için, yorum ile açıklama zorunlu. Exception kaydı ZORUNLU. |
| Strict mode            | ZORUNLU  | `strict: true` compiler option devre dışı bırakılamaz.                              |
| Return type annotation | ÖNERİLİR | Public/exported fonksiyonlarda return type belirtilmesi önerilir.                   |
| Generic constraint     | ÖNERİLİR | Generic tipler `extends` ile kısıtlanmalıdır.                                       |

**Tip tercih sırası:** proper type > generic `<T>` > branded type > unknown + guard > assertion > any (YASAK)

## 4.2 Naming Kuralları

`50-coding-standards-and-file-conventions.md` §3'e tam uyum zorunludur:

| Kategori           | Format                                          | Örnek                                             |
| ------------------ | ----------------------------------------------- | ------------------------------------------------- |
| Component          | PascalCase, dosya adıyla eşleşmeli              | `UserProfile.tsx` → `export function UserProfile` |
| Hook               | `use` prefix + camelCase                        | `useAuth`, `useFormValidation`                    |
| Service fonksiyonu | verbNoun                                        | `fetchUser`, `createOrder`, `validateEmail`       |
| Boolean değişken   | `is`/`has`/`should`/`can` prefix                | `isLoading`, `hasPermission`, `canEdit`           |
| Sabit (constant)   | SCREAMING_SNAKE_CASE                            | `MAX_RETRY_COUNT`, `API_BASE_URL`                 |
| Enum               | PascalCase (tip), PascalCase (değer)            | `enum UserRole { Admin, Editor }`                 |
| Type/Interface     | PascalCase, `I` prefix YASAK                    | `UserProfile`, `CreateOrderRequest`               |
| Event handler      | `handle` prefix (component), `on` prefix (prop) | `handleClick`, `onPress`                          |
| Test dosyası       | Kaynak dosya adı + `.test`                      | `UserProfile.test.tsx`                            |

## 4.3 Import Kuralları

| Kural                                | Seviye  | Açıklama                                                                                       |
| ------------------------------------ | ------- | ---------------------------------------------------------------------------------------------- |
| Barrel import (`index.ts` re-export) | YASAK   | Doğrudan dosyadan import et.                                                                   |
| Import sıralaması                    | ZORUNLU | React → 3rd party → `@project/*` → `@/` → relative → type. Gruplar arası boş satır ZORUNLU.    |
| Cross-feature import                 | YASAK   | `features/auth/` → `features/profile/` doğrudan import yapılmaz. Shared package üzerinden geç. |
| Circular import                      | YASAK   | A → B → A döngüsü hiçbir koşulda kabul edilmez.                                                |
| Dynamic import                       | Koşullu | Sadece lazy loading ve code splitting amacıyla, açık yorum ile.                                |
| Side-effect import                   | Koşullu | Sadece polyfill ve global setup dosyalarında.                                                  |

## 4.4 Design Token Kuralları

| Kural                                                  | Seviye  | Alternatif                                                              |
| ------------------------------------------------------ | ------- | ----------------------------------------------------------------------- |
| Hardcoded renk (`#fff`, `rgb(...)`, `hsl(...)`, `red`) | YASAK   | Semantic token kullan: `bg-surface`, `text-primary`.                    |
| Hardcoded spacing (`16px`, `1rem`, `padding: 16`)      | YASAK   | Spacing token kullan: `space-md`, `gap-lg`.                             |
| Hardcoded font-size/weight                             | YASAK   | Typography token kullan: `text-body-md`, `font-semibold`.               |
| Tailwind default class (renk skalası: `bg-red-500`)    | YASAK   | Semantic token class kullan.                                            |
| Token prefix                                           | ZORUNLU | `bp-` (boilerplate default). Derived project kendi prefix'ini tanımlar. |

Referans: `22-design-tokens-spec.md` token katman tanımları.

## 4.5 Component Kuralları

| Kural                    | Seviye   | Açıklama                                                                             |
| ------------------------ | -------- | ------------------------------------------------------------------------------------ |
| Raw platform primitive   | YASAK    | `Pressable`, `Text`, `TouchableOpacity`, `<button>`, `<input>` doğrudan kullanılmaz. |
| Component facade pattern | ZORUNLU  | Proje design system component'leri (Button, Text, Input) üzerinden geçilir.          |
| JSX derinliği            | ≤4       | 4 seviyeden derin nested JSX, ayrı component'e çıkarılmalıdır.                       |
| Props sayısı             | ≤7       | 7'den fazla prop, composition pattern veya config object ile sadeleştirilmelidir.    |
| `forwardRef` kullanımı   | ÖNERİLİR | Dış erişim gereken component'lerde ref forwarding uygulanmalıdır.                    |
| `displayName`            | ZORUNLU  | Memo, forwardRef ile sarılmış component'lerde displayName tanımlanmalıdır.           |

Referans: `23-component-governance-rules.md` component yaşam döngüsü ve governance kuralları.

## 4.6 Form Kuralları

| Kural                                | Seviye  | Açıklama                                                                      |
| ------------------------------------ | ------- | ----------------------------------------------------------------------------- |
| 2+ input alanı                       | ZORUNLU | React Hook Form + Zod schema validation kullan. ADR-006 canonical kararıdır.  |
| `useState` ile form state (2+ input) | YASAK   | Form state yönetimi react-hook-form üzerinden yapılmalıdır.                   |
| Manuel validation                    | YASAK   | Zod schema ile tanımla; `if (value.length < 3)` gibi inline validation yapma. |
| Hata mesajları                       | ZORUNLU | i18n key ile. Her form alanı için error state gösterimi tanımlanmalıdır.      |
| Submit guard                         | ZORUNLU | Form submit sırasında double-submit engellenmelidir (isSubmitting kontrolü).  |

## 4.7 Error Handling Kuralları

| Kural                          | Seviye  | Açıklama                                                                                       |
| ------------------------------ | ------- | ---------------------------------------------------------------------------------------------- |
| async fonksiyonlarda try/catch | ZORUNLU | Her async fonksiyon error handling içermelidir.                                                |
| Promise chain (`.then`)        | YASAK   | `async/await` kullan.                                                                          |
| Listener/subscription cleanup  | ZORUNLU | `useEffect` içinde event listener, subscription, timer mutlaka cleanup'a bağlanmalıdır.        |
| DomainError hierarchy          | ZORUNLU | Generic `Error` yerine domain-specific error class'ları kullan.                                |
| Error boundary                 | ZORUNLU | Her route/screen seviyesinde React Error Boundary bulunmalıdır.                                |
| Silent catch                   | YASAK   | `catch (e) {}` boş catch bloğu kabul edilmez. Loglama veya kullanıcı bilgilendirme zorunludur. |

Referans: `25-error-empty-loading-states.md` error state UI standartları.

## 4.8 Logging Kuralları

| Kural                            | Seviye  | Açıklama                                                                        |
| -------------------------------- | ------- | ------------------------------------------------------------------------------- |
| `console.log`                    | YASAK   | Yapısal logger kullan (Sentry, proje logger utility).                           |
| `console.warn` / `console.error` | Koşullu | Sadece development ortamında, `__DEV__` guard ile.                              |
| Debug ifadeleri                  | YASAK   | Debug amaçlı eklenen log satırları commit'lenmemelidir.                         |
| PII loglama                      | YASAK   | Kullanıcı adı, email, telefon, token gibi kişisel veriler log'a yazılmaz.       |
| Structured logging               | ZORUNLU | Log mesajları `{ message, context, severity }` yapısında olmalıdır.             |
| `dangerouslySetInnerHTML`        | YASAK   | XSS riski; sanitization zorunlu; exception policy gerektirir.                   |
| localStorage'da token saklama    | YASAK   | ADR-010 gereği HttpOnly cookie (web) veya SecureStore (mobile) kullanılmalıdır. |

---

# 5. Guardrail Otomasyonu

Bu bölüm, `47-ai-guardrail-governance.md`'de tanımlanan guardrail çerçevesinin AI geliştirme sürecindeki operasyonel uygulamasını tanımlar. Guardrail okumadan kod üretme YASAKTIR.

## 5.1 İş Başlangıcı Protokolü

AI aracı herhangi bir kodlama görevine başlamadan ÖNCE aşağıdaki protokol uygulanır:

1. **İş türünü belirle:** Görevin hangi aktivite koduna (A-XXX) karşılık geldiğini tespit et. Aktivite kodları `47-ai-guardrail-governance.md` Bölüm 6'da tanımlanmıştır.
2. **İlgili domain guardrail'leri oku:** Aktivite koduna bağlı domain guardrail dosyalarını (D-XXX) `docs/ai-guardrails/domain/` altından yükle.
3. **Kuralları özetle:** Okunan guardrail'lerdeki HARD kuralları, YASAK listesini ve zorunlu kontrolleri kısa bir özet olarak sun.
4. **Kodlamaya geç:** Özet sunulduktan sonra implementasyona başla. Guardrail okunmadan kod üretimi YASAK.

**Tetikleme:** `/guardrail-check` skill'i otomatik tetiklenir.

**Aktivite → Domain eşleştirme tablosu:**

| İş Türü                      | Aktivite Kodu  | Okunacak Domain Guardrail'ler                   |
| ---------------------------- | -------------- | ----------------------------------------------- |
| UI/Component oluşturma       | A-NEW-COMP     | D-UIX, D-DSY, D-A11, D-PLT, D-MOT               |
| Yeni ekran/sayfa             | A-NEW-SCRN     | D-UIX, D-NAV, D-ERR, D-A11, D-PLT               |
| Yeni feature modülü          | A-NEW-FEAT     | İlgili tüm domain'ler                           |
| Yeni hook/utility            | A-NEW-HOOK     | D-TST                                           |
| Yeni API entegrasyonu        | A-NEW-API      | D-DAT, D-SEC, D-TST                             |
| Form geliştirme              | A-FORM         | D-FRM, D-UIX, D-A11, D-ERR                      |
| Firebase/Firestore işlemi    | A-FIREBASE     | D-FIR, D-SEC, D-DAT                             |
| Bug fix                      | A-FIX          | Universal + ilgili domain                       |
| Refactoring                  | A-REFACTOR     | D-TST, Universal                                |
| Dependency değişikliği       | A-DEP          | D-3RD, D-SEC, 37, 38                            |
| State değişikliği            | A-STATE        | D-STA, D-PRF                                    |
| Navigation değişikliği       | A-NAV          | D-NAV, D-PLT                                    |
| Styling/theme değişikliği    | A-STYLE        | D-STY, D-DSY, D-UIX                             |
| Auth flow değişikliği        | A-AUTH         | D-SEC, ADR-010, D-BIO                           |
| Config/CI değişikliği        | A-CONFIG       | D-SEC, 15, 21, 27                               |
| Third-party entegrasyon      | A-3RD          | D-3RD, D-SEC, 37                                |
| Migration (veri/şema/kod)    | A-MIGRATION    | D-DAT, D-SEC                                    |
| Release hazırlığı            | A-RELEASE      | 29, 15, 31, D-OBS, D-SEC                        |
| File upload/media            | A-MEDIA        | D-SEC, D-PRF                                    |
| Real-time/WebSocket/push     | A-REALTIME     | D-DAT, D-SEC, D-PRF                             |
| Analytics/event tracking     | A-ANALYTICS    | D-OBS, D-SEC                                    |
| Offline/cache/persistence    | A-OFFLINE      | D-DAT, D-PLT, D-OFL                             |
| AI/ML feature entegrasyonu   | A-AI-FEAT      | D-AIX, D-UIX, D-SEC, D-PLT, D-PRI, D-TST, D-OBS |
| Push notification geliştirme | A-NOTIFICATION | D-NTF, D-SEC, D-PRI                             |
| Deep link implementasyonu    | A-DEEPLINK     | D-DPL, D-NAV, D-SEC                             |
| Ödeme/abonelik entegrasyonu  | A-PAYMENT      | D-PAY, D-SEC, D-PRI                             |
| OTA güncelleme               | A-OTA          | D-SEC, D-OBS, D-PLT                             |
| Gizlilik uyum çalışması      | A-PRIVACY      | D-PRI, D-SEC, D-OBS                             |
| SDK/Framework major upgrade  | A-SDK-UPGRADE  | D-PLT, D-PRF, D-TST, D-SEC, D-3RD, D-OFL        |
| Doküman/ADR yazımı           | A-DOCS         | 41, 18                                          |

## 5.2 Kodlama Sırası Kontrolleri

AI aracı kodlama yaparken her dosya değişikliğinde aşağıdaki kontroller uygulanır:

**Edit/Write öncesi (pre-edit hook):**

- Hedef dosyanın bağlamını tespit et (component mi, hook mu, service mi, config mi).
- Dosyanın hangi domain'e ait olduğunu belirle.
- Secret/credential dosyalarını BLOKLA (`.env`, `.env.*`, `*.key`, `credentials.*`, `secrets.*`, `service-account.json`).
- Dosya tipi ve konumuna göre guardrail kontrollerini uygula.

**Edit/Write sonrası (post-edit hook):**

- Değişiklikte hardcoded renk, spacing, font değeri var mı? → Grep ile kontrol et.
- `any` type kullanımı var mı? → Grep ile kontrol et.
- Secret pattern var mı? (API key, token, password literal) → Grep ile kontrol et.
- `console.log` var mı? → Grep ile kontrol et.
- `eslint-disable` var mı? → Exception policy kontrolü.
- PII riski var mı? (kullanıcı verisi log'a yazılıyor mu?) → Grep ile kontrol et.
- `dangerouslySetInnerHTML` var mı? → Grep ile kontrol et.
- localStorage'da token saklama var mı? → Grep ile kontrol et.

**Hook uyarısı gelirse:** AI aracı değişikliği HEMEN düzeltir, bir sonraki işe geçmeden önce ihlali giderir.

## 5.3 İş Tamamlanma Denetimi

Her kodlama görevi tamamlandığında aşağıdaki toplu denetim uygulanır:

1. **Tüm değişiklikleri toplu denetle:** Oturum boyunca yapılan tüm Edit/Write işlemlerini guardrail kurallarına karşı kontrol et.
2. **İhlal raporu üret:** Tespit edilen ihlalleri P0 (kritik), P1 (yüksek), P2 (orta) olarak sınıfla.
3. **P0 ihlal varsa HEMEN düzelt:** P0 ihlaller geçici bile olsa commit'lenemez.
4. **P1 ihlal varsa aynı PR'da düzelt:** Naming, import, pattern ihlalleri.
5. **P2 ihlal için plan oluştur:** Sonraki iterasyonda çözülecek.
6. **Düzeltemiyorsa exception kaydı oluştur:** `/exception-create` skill'i ile `44-exception-and-exemption-policy.md` formatına uygun kayıt aç.

**Tetikleme:** `/guardrail-audit` skill'i otomatik tetiklenir.

**İhlal öncelik tanımları:**

| Öncelik | Tanım                                                 | Eylem                                           | Örnek                                                                |
| ------- | ----------------------------------------------------- | ----------------------------------------------- | -------------------------------------------------------------------- |
| P0      | Güvenlik, veri bütünlüğü, canonical stack ihlali      | Hemen düzelt, commit ENGELLE                    | Secret leak, `any` type, cross-feature import, localStorage token    |
| P1      | Kodlama standardı, accessibility, design token ihlali | Aynı PR'da düzelt                               | Hardcoded renk, missing a11y label, JSX derinliği, naming convention |
| P2      | Stil, naming, convention küçük sapmaları              | Sonraki iterasyonda düzeltilebilir, uyarı logla | Import sıralaması, yorum eksikliği                                   |

## 5.4 PR/Commit Öncesi Kontrol

Commit veya PR oluşturmadan önce aşağıdaki kapsamlı kontrol listesi tamamlanmalıdır:

1. **Universal guardrail kontrolü:** Tüm oturum değişikliklerinde universal kurallar sağlanıyor mu? (TypeScript strict, import yönü, naming)
2. **Test durumu kontrolü:** Yeni/değiştirilen kod için test yazılmış mı? Mevcut testler geçiyor mu?
3. **Boundary check:** Import yönleri doğru mu? Feature → shared OK, shared → feature YASAK.
4. **TypeScript type check:** `tsc --noEmit` ile tip hataları var mı?
5. **Lint check:** ESLint kuralları geçiyor mu?
6. **DoD kontrol listesi:** `32-definition-of-done.md` maddeleri karşılanıyor mu?

**Tetikleme:** `/pre-pr` skill'i otomatik tetiklenir.

**[HARD]** Tüm kontroller PASS alana kadar commit veya PR oluşturma YASAKTIR.

---

# 6. Hook Standartları

Bu bölüm, AI aracı operasyonlarını denetleyen hook mekanizmalarının standartlarını tanımlar. Hook'lar `.claude/hooks/` altında yaşar ve otomatik tetiklenir.

## 6.1 Pre-Edit Hook

Dosya yazma veya düzenleme öncesi tetiklenir. Blocking: EVET.

**Kontrol listesi:**

| Kontrol                       | Eylem                                                                                   |
| ----------------------------- | --------------------------------------------------------------------------------------- |
| Secret/credential dosyası mı? | BLOKLA: `.env`, `.env.*`, `*.key`, `credentials.*`, `secrets.*`, `service-account.json` |
| Guardrail domain tespiti      | Dosya yolundan ilgili domain'i belirle (components/ → D-UIX, hooks/ → D-TST)            |
| Dosya boyut limiti            | Hedef dosya 800 satırı aşıyor mu? Aşıyorsa uyar.                                        |
| Lock dosyası                  | `pnpm-lock.yaml`, `package-lock.json` gibi lock dosyalarına doğrudan düzenleme BLOKLA   |

## 6.2 Post-Edit Hook

Dosya yazma veya düzenleme sonrası tetiklenir. Blocking: HAYIR (uyarı verir).

**Kontrol listesi:**

| Kontrol                   | Pattern                                                           | Eylem                                    |
| ------------------------- | ----------------------------------------------------------------- | ---------------------------------------- |
| Hardcoded renk            | `#[0-9a-fA-F]{3,8}`, `rgb(`, `rgba(`, `hsl(`                      | UYAR: Semantic token kullan              |
| `any` type                | `: any`, `as any`, `<any>`                                        | UYAR: `unknown` + type guard kullan      |
| Secret pattern            | `sk-`, `pk_`, `AKIA`, `password =`, `secret =`, `token =`         | BLOKLA: Secret leak riski                |
| `console.log`             | `console.log(`, `console.warn(`, `console.error(`                 | UYAR: Yapısal logger kullan              |
| PII riski                 | `user.email`, `user.phone`, `user.name` + `log`/`console` bağlamı | UYAR: PII loglama yasak                  |
| `eslint-disable`          | `eslint-disable`, `@ts-ignore`                                    | UYAR: Exception policy gerekli           |
| `dangerouslySetInnerHTML` | `dangerouslySetInnerHTML`                                         | UYAR: XSS riski, sanitization zorunlu    |
| localStorage token        | `localStorage.setItem` + `token`/`auth`/`session` bağlamı         | UYAR: SecureStore/HttpOnly cookie kullan |
| `TODO` yorum              | `// TODO`, `// FIXME`, `// HACK`                                  | BİLGİ: Tracking gerekli                  |

## 6.3 Pre-Bash Hook

Bash komutu çalıştırma öncesi tetiklenir. Blocking: EVET.

**Bloklanan komutlar:**

| Komut Pattern                                   | Neden                                                               |
| ----------------------------------------------- | ------------------------------------------------------------------- | ----- | ---------------------------- |
| `rm -rf /` veya `rm -rf ~`                      | Sistem koruma                                                       |
| `git reset --hard`                              | Değişiklik kaybı riski                                              |
| `git push --force` (main/master branch'e)       | Takım çalışması koruması                                            |
| `git clean -fd`                                 | İzlenmeyen dosya kaybı                                              |
| `DROP DATABASE`, `DROP TABLE`, `TRUNCATE TABLE` | Veri kaybı koruması                                                 |
| `expo prebuild`                                 | Native config koruması; kontrollü ortam dışında çalıştırılmamalıdır |
| `chmod 777`                                     | Güvenlik riski                                                      |
| `curl                                           | sh`, `wget                                                          | bash` | Uzaktan kod çalıştırma riski |

## 6.4 Hook Event Tipleri ve Çıkış Kodları

| Hook Event                   | Tetiklenme         | Blocking | Amaç                                      |
| ---------------------------- | ------------------ | -------- | ----------------------------------------- |
| PreToolUse (Write/Edit/Bash) | Tool öncesi        | Evet     | Pre-validation, tehlikeli işlem engelleme |
| PostToolUse (Write/Edit)     | Tool sonrası       | Hayır    | İhlal taraması, uyarı üretme              |
| PreCompact                   | Context compaction | Hayır    | State kaydetme                            |
| TeammateIdle                 | Agent boşta        | Evet     | TRUST 5 validation                        |
| TaskCompleted                | Task tamamlandı    | Evet     | Deliverable doğrulama                     |
| SessionStart                 | Oturum başlangıcı  | Hayır    | Ortam kurulumu                            |

**Çıkış kodları:**

| Kod | Anlam      | Davranış                |
| --- | ---------- | ----------------------- |
| 0   | Başarılı   | Devam et.               |
| 1   | Hata/uyarı | Log'a yaz ama devam et. |
| 2   | BLOKLA     | İşlem durdurulsun.      |

---

# 7. MoAI-ADK Entegrasyonu

Bu bölüm, MoAI-ADK framework'ünün AI geliştirme standartlarıyla entegrasyonunu tanımlar.

## 7.1 SPEC-First Workflow

Karmaşık görevlerde (yeni feature, büyük refactoring, cross-cutting concern, 3+ dosya değişikliği, mimari değişiklik) aşağıdaki workflow uygulanır:

| Faz  | Komut        | Çıktı                        | Token Bütçesi |
| ---- | ------------ | ---------------------------- | ------------- |
| Plan | `/moai plan` | SPEC dokümanı (EARS formatı) | ~30K          |
| Run  | `/moai run`  | İmplementasyon + testler     | ~180K         |
| Sync | `/moai sync` | Doküman senkronizasyonu + PR | ~40K          |

**Plan fazı detayları:**

- EARS formatı (Easy Approach to Requirements Syntax) kullanılır.
- Acceptance criteria, scope, risk analizi, test stratejisi tanımlanır.
- SPEC dokümanı `.moai/specs/SPEC-XXX/` altında yaşar.

**Run fazı detayları:**

- DDD (Domain-Driven Development) veya TDD (Test-Driven Development) metodolojisi seçilir.
- Her implementation task'ı SPEC'teki acceptance criteria'ya bağlıdır.
- Selective file loading; sadece değişecek dosyalar okunur.

**Sync fazı detayları:**

- Değişiklik sonrası etkilenen dokümanların güncellenmesi.
- Codemaps yenilenmesi.
- PR oluşturma.

**SPEC zorunluluğu karar matrisi:**

| Durum                                        | SPEC Zorunlu mu?     |
| -------------------------------------------- | -------------------- |
| Yeni feature (3+ dosya)                      | EVET                 |
| Büyük refactoring (modül yapısı değişikliği) | EVET                 |
| Cross-cutting concern (auth, i18n, theme)    | EVET                 |
| Basit bug fix (tek dosya)                    | HAYIR                |
| Typo/doküman düzeltme                        | HAYIR                |
| Tek dosya utility ekleme                     | HAYIR                |
| 2 dosya component ekleme                     | HAYIR (ama önerilir) |

## 7.2 TRUST 5 Kalite Framework'ü

MoAI-ADK'nın TRUST 5 kalite framework'ü, her kod değişikliğinin 5 boyutta değerlendirilmesini zorunlu kılar:

### Tested (Test Edilmiş)

- **Unit test coverage:** ≥85% (branch coverage).
- **Integration test:** Cross-module etkileşimler test edilmiş olmalı.
- **LSP type error:** 0 (sıfır TypeScript hatası).
- **Test'ler geçiyor:** Tüm mevcut testler pass durumunda.
- **Karakterizasyon testi:** Legacy kod değişikliğinde mevcut davranışı koruyan test yazılmalı.

### Readable (Okunabilir)

- **Naming convention:** `50-coding-standards-and-file-conventions.md` kurallarına uyum.
- **Lint clean:** ESLint uyarısı ve hatası yok.
- **Kod yorumları:** Karmaşık iş mantığı için açıklayıcı yorum var.
- **Fonksiyon boyutu:** Tek fonksiyon ≤50 satır hedef, ≤80 satır limit.
- **Dosya boyutu:** Bölüm 3.2'deki limitlere uyum.

### Unified (Tutarlı)

- **Pattern tutarlılığı:** Aynı iş için projede farklı pattern kullanılmamış.
- **Design system uyumu:** Component'ler design system facade'ı üzerinden kullanılmış.
- **Import düzeni:** Bölüm 4.3'teki sıraya uyum.
- **Error handling pattern:** Projede tek bir error handling yaklaşımı (DomainError hierarchy).
- **State management pattern:** Zustand store'ları tutarlı yapıda.

### Secured (Güvenli)

- **OWASP uyumu:** Input validation, output encoding, authentication/authorization kontrolü.
- **Secret koruması:** Hardcoded secret yok; environment variable kullanılmış.
- **XSS koruması:** User-generated content sanitize edilmiş.
- **CSRF koruması:** Form submission'larda token kontrolü.
- **PII koruması:** Kişisel veri log'lara yazılmamış.
- **Auth token koruması:** Web'de HttpOnly cookie, mobile'da SecureStore (ADR-010).

### Trackable (İzlenebilir)

- **Conventional commits:** Commit mesajları anlamlı ve tutarlı.
- **Issue referansları:** Değişiklikler ilgili issue/SPEC'e bağlanmış.
- **Changelog:** Kullanıcı etkileyen değişiklikler changelog'a eklenmiş.
- **@MX tag'ler:** Bölüm 8'deki kurallara uygun tag'ler eklenmiş.

## 7.3 TDD vs DDD Seçim Matrisi

AI aracı implementasyon metodolojisini görevin doğasına göre seçer:

| Durum                             | Metodoloji         | Döngü                                     | Neden                                                                                      |
| --------------------------------- | ------------------ | ----------------------------------------- | ------------------------------------------------------------------------------------------ |
| Yeni feature/proje (greenfield)   | TDD                | RED → GREEN → REFACTOR                    | Davranış önceden tanımlanabilir; test-first doğal akış.                                    |
| Legacy kod, düşük coverage (<10%) | DDD                | ANALYZE → PRESERVE → IMPROVE              | Mevcut davranışı korumak öncelik; karakterizasyon testi gerekli.                           |
| Bug fix                           | Reproduction-First | Failing test → Fix → Pass                 | Bug'ın varlığını kanıtlayan test, düzeltmenin doğruluğunu garantiler. Her zaman uygulanır. |
| Refactoring                       | DDD                | Characterization test → Refactor → Verify | Davranış değişmemeli; mevcut testler yetersizse karakterizasyon testi ekle.                |
| Performance optimization          | DDD + Benchmark    | Ölç → Değiştir → Karşılaştır              | Mevcut performansı ölç, değişiklik sonrası karşılaştır.                                    |

---

# 8. @MX Tag Kuralları

AI aracı kod üretirken veya düzenlerken uygun @MX annotation'lar eklemelidir. @MX tag'leri, AI araçlarının kodu daha iyi anlamasını, kritik noktaları tanımasını ve bakım risklerini erken tespit etmesini sağlar.

## 8.1 Tag Ekleme Kriterleri

| Koşul                                      | Tag                         | Zorunluluk |
| ------------------------------------------ | --------------------------- | ---------- |
| 100+ satır exported fonksiyon              | `@MX:NOTE`                  | OLMALI     |
| fan_in ≥ 3 (3+ dosyadan import ediliyor)   | `@MX:ANCHOR` + `@MX:REASON` | ZORUNLU    |
| Cyclomatic complexity ≥ 15                 | `@MX:WARN` + `@MX:REASON`   | ZORUNLU    |
| If-branch sayısı ≥ 8                       | `@MX:WARN` + `@MX:REASON`   | OLMALI     |
| Test olmayan public fonksiyon              | `@MX:TODO`                  | OLMALI     |
| SPEC requirement henüz implement edilmemiş | `@MX:TODO` + `@MX:SPEC`     | OLMALI     |
| Legacy kod, SPEC referansı olmayan         | `@MX:LEGACY`                | OLMALI     |

**Dosya başı limitler:**

- `@MX:ANCHOR`: max 3
- `@MX:WARN`: max 5

## 8.2 Tag Formatı

```typescript
// @MX:ANCHOR — Bu fonksiyon 5 modülden import edilir; değişiklik etkisi analizi zorunlu
export function calculateDiscount(params: DiscountParams): DiscountResult {
  // ...
}
```

## 8.3 Tag Yaşam Döngüsü

- `@MX:TODO` → RED/ANALYZE aşamasında oluşturulur, GREEN/IMPROVE'da kaldırılır.
- `@MX:ANCHOR` → ASLA otomatik silinmez; fan_in düşerse NOTE'a düşürülür.
- `@MX:WARN` → Tehlike giderildiğinde (complexity düşürüldüğünde) kaldırılır.
- `@MX:LEGACY` → Modernizasyon tamamlandığında kaldırılır.

## 8.4 Tag Yönetim Kuralları

- **Tag dili:** Proje dil ayarına göre (`code_comments` setting). Boilerplate default: Türkçe.
- **Otonom yönetim:** AI aracı tag ekler, günceller veya kaldırır; insan onayı gerekmez.
- **Commit bilgilendirme:** Tag değişiklikleri commit mesajında belirtilir.
- **Etki raporu:** Tag eklendiğinde/kaldırıldığında etkilenen dosya listesi raporlanır.

---

# 9. Dil Kuralları

AI aracının ürettiği kodun ve iletişimin dil kuralları:

| Kategori                        | Dil                              | Kural                                                                               |
| ------------------------------- | -------------------------------- | ----------------------------------------------------------------------------------- |
| Kod yorumları                   | Proje dil ayarı (Türkçe default) | Tüm inline ve block yorumlar proje dil ayarına göre. `code_comments` setting.       |
| Commit mesajları                | Proje dil ayarı (Türkçe default) | Kısa, açıklayıcı, conventional format.                                              |
| Değişken/fonksiyon adları       | İngilizce                        | Her zaman İngilizce; Türkçe karakter YASAK. Global standart.                        |
| Hata mesajları (kullanıcıya)    | Proje dil ayarı                  | i18n key üzerinden; hardcoded string YASAK.                                         |
| Log mesajları (teknik)          | İngilizce                        | Sentry, analytics, structured log çıktıları İngilizce. Evrensel okunabilirlik.      |
| Agent sonuçları                 | Kullanıcı dili                   | AI aracı yanıtlarını kullanıcının konuşma diliyle özetler.                          |
| Doküman                         | Proje dil ayarı (Türkçe default) | Teknik terimler orijinal, cümleler proje dil ayarına göre. README, CHANGELOG dahil. |
| i18n key'ler                    | İngilizce                        | `feature.screen.label` formatı.                                                     |
| Import path'leri                | İngilizce                        | Teknik zorunluluk.                                                                  |
| CLI komutları                   | İngilizce                        | Teknik zorunluluk.                                                                  |
| Test açıklamaları (describe/it) | İngilizce                        | Test framework çıktılarının evrensel okunabilirliği için.                           |

---

# 10. Context Window Yönetimi

AI araçlarının context window'u sınırlıdır. Bu sınır model bağımsız bir gerçekliktir: bugün 200K token olan sınır yarın 1M olabilir, ama sınır her zaman vardır. Bu nedenle context bilinçli yönetilmelidir.

## 10.1 Dosya Okuma Optimizasyonu

AI aracı dosya okurken aşağıdaki katmanlı stratejiyi uygular:

| Dosya Boyutu   | Strateji               | Yöntem                                                                                                                               |
| -------------- | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| ≤200 satır     | Tam oku                | `Read` tool, offset/limit gerekmez. Küçük component, utility.                                                                        |
| 200–500 satır  | Hedefli bölüm oku      | Önce `Grep` ile ilgili satır numaralarını bul, sonra `Read` ile offset/limit kullanarak sadece ilgili bölümü oku.                    |
| 500–1000 satır | Sadece ilgili bölümler | `Grep` ile fonksiyon/class tanımlarını bul, 50-100 satırlık chunk'lar halinde oku. Tam dosya okuma YASAK.                            |
| 1000+ satır    | Delege et              | `Grep` output_mode: "content" ile context satırları kullan. Gerekiyorsa Explore agent'a delege et. Tam dosya okuma KESİNLİKLE YASAK. |

## 10.2 Token Bütçesi Farkındalığı

| Senaryo                           | Token Maliyeti | Bütçe Etkisi (200K context) |
| --------------------------------- | -------------- | --------------------------- |
| 10 tam dosya (500 satır)          | 50K–100K token | %25–50                      |
| 10 hedefli okuma (50 satır)       | 5K–10K token   | %2.5–5                      |
| 20 Grep sonucu (10 satır context) | 2K–4K token    | %1–2                        |

**[HARD]** AI aracı HER ZAMAN hedefli okumayı tercih etmelidir. Tam dosya okuma ancak dosya ≤200 satır olduğunda veya dosyanın tamamını anlamak zorunlu olduğunda yapılır.

## 10.3 Context Koruma Stratejileri

- **Erken özetleme:** Uzun araştırma sonuçlarını özetle, ham veriyi context'te tutma.
- **Seçici yükleme:** Sadece mevcut görevle ilgili dosyaları oku; "her ihtimale karşı" okuma yapma.
- **Chunk bazlı işleme:** Büyük değişiklikleri parçalara böl; her parçayı tamamla, sonra bir sonrakine geç.
- **Guardrail özeti:** Domain guardrail'lerin tamamını değil, HARD kurallar ve YASAK listesi özetini tut.
- **Plan/Run/Sync faz geçişleri:** Plan → Run geçişinde `/clear` ile context temizle. Run fazında selective file loading. Sync fazında result caching ile redundant read azaltma.

---

# 11. Worktree Kullanım Kuralları

AI aracı paralel çalışma ve izolasyon için worktree mekanizmasını kullanır. Detaylı worktree kuralları `.claude/rules/moai/workflow/worktree-integration.md`'de tanımlanmıştır.

## 11.1 Role-Based Worktree Kuralları

| Agent Rolü                          | Worktree Gereksinimi                   | Neden                                                |
| ----------------------------------- | -------------------------------------- | ---------------------------------------------------- |
| Implementation agent (yazma yapan)  | `isolation: "worktree"` ZORUNLU        | Dosya çakışmasını önlemek için.                      |
| Read-only agent (analiz, review)    | Worktree GEREKSİZ                      | `permissionMode: plan` zaten yazma engelliyor.       |
| Paralel team mode                   | Her write agent izole worktree ZORUNLU | Eş zamanlı dosya değişikliklerinin çakışmaması için. |
| Multi-session SPEC                  | MoAI Worktree ÖNERİLEN                 | Persistent workspace, SPEC-scoped geliştirme.        |
| Tek seferlik subagent (yazma yapan) | `isolation: "worktree"` OLMALI         | Cross-file değişikliklerde izolasyon sağlar.         |
| Tek seferlik subagent (read-only)   | Worktree GEREKSİZ                      | Okuma izolasyonu gereksiz overhead.                  |
| GitHub issue fixer                  | `isolation: "worktree"` ZORUNLU        | Branch izolasyonu için.                              |

## 11.2 Prompt Path Kuralları

**[HARD]** Worktree-isolated agent'lara gönderilen prompt'larda:

- Write-target dosyalar için absolute path YASAK → relative path kullan.
- `cd /absolute/path &&` prefix'i YASAK → Agent CWD zaten worktree root'tur.
- Read-only referanslar (skill, config) için absolute path kabul edilir.
- `$CLAUDE_PROJECT_DIR` environment variable'ı hook'larda kabul edilir.
- Write-target dosyalar project-root-relative olmalı (ör. `src/features/auth/useAuth.ts`).

---

# 12. Derived Project Miras Kuralları

Bu doküman `45-boilerplate-project-boundary-contract.md`'deki üç katmanlı miras modeline tabidir.

## 12.1 Zorunlu Miras (Override YASAK)

Aşağıdaki kurallar derived project'te olduğu gibi geçerlidir. Gevşetilemez, atlanamaz, kaldırılamaz. Değişiklik yalnızca boilerplate seviyesinde ADR revision ile mümkündür.

- **HARD kurallar:** Approach-first development, multi-file decomposition, post-implementation review, reproduction-first bug fixing (Bölüm 2).
- **Guardrail otomasyonu:** İş başlangıcı protokolü, kodlama sırası kontrolleri, iş tamamlanma denetimi, PR/commit öncesi kontrol (Bölüm 5).
- **Hook standartları:** Pre-edit, post-edit, pre-bash hook kontrol listeleri (Bölüm 6).
- **TRUST 5 framework:** 5 boyutta kalite değerlendirmesi (Bölüm 7.2).
- **Dosya boyut limitleri:** 300/500/800 satır eşikleri (Bölüm 3.2).
- **Güvenlik kuralları:** Secret koruması, PII loglama yasağı, yıkıcı komut bloklama, permission modeli.
- **Kod üretim standartları:** `any` yasağı, import yönü, naming conventions, TypeScript strict (Bölüm 4).

## 12.2 Yapısal Miras (Yapı sabit, içerik genişletilebilir)

Aşağıdaki kuralların yapısı korunur ancak içeriği proje ihtiyacına göre genişletilebilir. Gevşetilemez, sadece sıkılaştırılabilir veya genişletilebilir.

- **MoAI-ADK entegrasyonu:** SPEC-first workflow, TDD/DDD seçim matrisi genişletilebilir. Ek metodolojiler eklenebilir. `/moai` komutları proje-özel uzantılarla genişletilebilir.
- **@MX tag kuralları:** Tag tipleri sabittir; eşik değerleri (fan_in, complexity, satır sayısı) proje-spesifik ayarlanabilir ama kapatılamaz.
- **Context yönetimi:** Dosya boyutu eşikleri sıkılaştırılabilir (ör. 800 → 600), gevşetilemez. Token bütçesi ve okuma stratejisi proje boyutuna göre ayarlanabilir.
- **Aktivite → domain eşleştirme tablosu:** Mevcut satırlar korunur; proje-spesifik aktivite ve domain eklenebilir.
- **Hook kontrol listeleri:** Mevcut kontroller korunur; proje-spesifik kontroller eklenebilir. Mevcut kontroller kaldırılamaz.
- **Design token prefix:** `bp-` yerine proje-spesifik prefix tanımlanabilir.
- **Worktree kullanım kuralları:** Proje altyapısına göre ayarlanabilir; HARD kurallar korunur.

## 12.3 Felsefi Miras (Prensip bağlar, uygulama proje-spesifik)

Aşağıdaki prensiplerin ruhu korunur; uygulama detayları proje bağlamına göre yorumlanabilir:

- **AI-assisted development prensibi:** AI araçları geliştirme sürecinin merkezi aktörleridir; ancak karar kullanıcının/geliştiricinindir. AI araçları yardımcıdır, otorite değildir.
- **Quality-first yaklaşım:** Hız yerine kalite tercih edilir; kısayol alma YASAKTIR. Her satır kod, üretim kalitesinde olmalıdır.
- **Documentation-first ilkesi:** Kod yazmadan önce planlama ve dokümantasyon. AI çıktıları da dokümandır; izlenebilir, review edilebilir ve geri alınabilir olmalıdır.
- **Proaktif review kültürü:** AI aracı sadece kod üretmez; potansiyel sorunları, riskleri ve iyileştirme fırsatlarını da belirtir.
- **Continuous improvement:** Anti-pattern'ler tespit edildiğinde guardrail'ler güncellenir. Süreç sürekli iyileştirilir.

---

# 13. Anti-Pattern Katalogu

Aşağıdaki davranışlar AI geliştirme sürecinde anti-pattern olarak tanımlanmıştır. AI aracı bu davranışlardan kaçınmalıdır; code review sırasında bu pattern'ler aranmalıdır.

| #     | Anti-Pattern                                   | Neden Sorunlu                                            | Doğru Yaklaşım                                        |
| ----- | ---------------------------------------------- | -------------------------------------------------------- | ----------------------------------------------------- |
| AP-01 | Guardrail okumadan kod üretme                  | Standart dışı kod üretilir; ihlaller birikir.            | `/guardrail-check` ile başla (Bölüm 5.1).             |
| AP-02 | 800+ satır dosya oluşturma                     | Maintainability düşer; code review zorlaşır.             | Dosya boyut kontrolü uygula (Bölüm 3.2).              |
| AP-03 | `any` type ile hızlı geçiştirme                | Tip güvenliği kaybedilir; runtime hataları artar.        | `unknown` + type guard kullan.                        |
| AP-04 | Test yazmadan bug fix                          | Regresyon riski; fix'in doğruluğu kanıtlanmamış.         | Reproduction-first yaklaşım uygula (Bölüm 2.4).       |
| AP-05 | `console.log` ile debugging bırakma            | Production'da noise; PII leak riski.                     | Yapısal logger kullan; debug log'ları temizle.        |
| AP-06 | Hardcoded değerler ile hızlı prototipleme      | Design system tutarlılığı bozulur.                       | Semantic token kullan (Bölüm 4.4).                    |
| AP-07 | Cross-feature import ile kısayol alma          | Modül bağımsızlığı bozulur; circular dependency riski.   | Shared package üzerinden geç.                         |
| AP-08 | Exception policy olmadan `eslint-disable`      | Kural bypass'ı izlenemez; birikir.                       | `44-exception-and-exemption-policy.md` süreci uygula. |
| AP-09 | Plan sunmadan büyük değişiklik yapma           | Geri dönüş maliyeti yüksek; kullanıcı kontrolü kaybeder. | Approach-first development uygula (Bölüm 2.1).        |
| AP-10 | Tam dosya okuma (1000+ satır)                  | Context window israfı; dikkat kalitesi düşer.            | Hedefli okuma stratejisi uygula (Bölüm 10.1).         |
| AP-11 | Mevcut dosyaları aramadan yeni dosya oluşturma | Duplikasyon; konvansiyon kırılması.                      | Dosya oluşturma protokolünü uygula (Bölüm 3.1).       |
| AP-12 | Silent catch (`catch (e) {}`)                  | Hata yutulur; debugging zorlaşır.                        | Loglama veya kullanıcı bilgilendirme ekle.            |
| AP-13 | Tek dosya için klasör açma                     | Gereksiz yapı karmaşıklığı.                              | 3+ dosya kuralını uygula (Bölüm 3.3).                 |
| AP-14 | Context window'u tam dosya okuyarak tüketme    | Bütçe israfı; AI dikkat kalitesi düşer.                  | Hedefli okuma (Grep + offset).                        |
| AP-15 | Absolute path ile worktree bypass              | İzolasyon devre dışı kalır; dosya çakışması riski.       | Relative path kullan.                                 |
| AP-16 | Plan olmadan 3+ dosya değiştirme               | Takip kaybı; yarım kalan değişiklik seti.                | Task listesi oluştur (Bölüm 2.2).                     |

---

# 14. Güvenlik Standartları

## 14.1 Permission Modeli

AI aracı permission konfigürasyonuna uyar:

| Seviye    | Kapsam                     | Örnekler                                                                         |
| --------- | -------------------------- | -------------------------------------------------------------------------------- |
| **Allow** | Rutin geliştirme işlemleri | Dosya okuma/yazma, git status/diff/log, test çalıştırma, lint                    |
| **Ask**   | Potansiyel riskli işlemler | `rm` komutları, `sudo`, `chmod`, `.env` dosyaları                                |
| **Deny**  | Yasak işlemler             | Secrets dizinleri, SSH/AWS/GCloud config, yıkıcı git komutları, veritabanı silme |

## 14.2 Secret Koruması

- Secret/credential dosyaları context'e ALINMAZ.
- `.claudeignore` dosyasına uyulur.
- Auth token'ları log'lara YAZILMAZ.
- Sentry payload'larında hassas veri BULUNMAMALI.
- API key'ler, şifreler, token'lar hardcode edilmez; environment variable kullanılır.
- Web'de auth token HttpOnly cookie ile yönetilir (ADR-010).
- Mobile'da hassas veri Expo SecureStore ile saklanır (ADR-010).

---

# 15. Doküman Bakım ve Güncelleme

## 15.1 Güncelleme Tetikleyicileri

Bu doküman aşağıdaki durumlarda güncellenir:

- Yeni bir HARD kural eklenmesi veya mevcut HARD kuralın değiştirilmesi gerektiğinde.
- Yeni bir AI aracı entegre edildiğinde veya mevcut bir araç kaldırıldığında.
- `50-coding-standards-and-file-conventions.md` güncellendiğinde (senkronizasyon).
- `47-ai-guardrail-governance.md` güncellendiğinde (guardrail uyumu).
- Derived project'lerden gelen feedback sonucu kural ayarlaması gerektiğinde.
- Yeni anti-pattern tespit edildiğinde.

## 15.2 Uyum ve Tutarlılık Notu

- Bu doküman `40-ai-workflow-and-tooling.md` ve `41-ai-instruction-standards.md` ile tutarlı olmalıdır.
- Çelişki durumunda `40-ai-workflow-and-tooling.md` otorite hiyerarşisi geçerlidir.
- Guardrail otomasyonu `47-ai-guardrail-governance.md` ile uyumlu olmalıdır.
- Anti-pattern kataloğu yaşayan bir listedir; yeni pattern'ler eklenebilir.
- Hook kontrol listeleri genişletilebilir; mevcut kontroller kaldırılamaz.

---

# 16. Referanslar

| Doküman                                       | İlgi Alanı                                                  |
| --------------------------------------------- | ----------------------------------------------------------- |
| `40-ai-workflow-and-tooling.md`               | AI araç rolleri, otorite hiyerarşisi, iş akışı              |
| `41-ai-instruction-standards.md`              | CLAUDE.md, AGENTS.md formatları, EARS SPEC                  |
| `47-ai-guardrail-governance.md`               | Guardrail mimarisi, tetikleme, domain/aktivite eşleştirme   |
| `50-coding-standards-and-file-conventions.md` | Kodlama standartları, naming, import, dosya konvansiyonları |
| `44-exception-and-exemption-policy.md`        | İstisna süreci, eslint-disable, @ts-ignore yönetimi         |
| `45-boilerplate-project-boundary-contract.md` | Derived project miras modeli, override kuralları            |
| `22-design-tokens-spec.md`                    | Token katman tanımları, semantic token yapısı               |
| `23-component-governance-rules.md`            | Component yaşam döngüsü ve governance                       |
| `25-error-empty-loading-states.md`            | Error state UI standartları                                 |
| `32-definition-of-done.md`                    | DoD kontrol listesi                                         |
| `ADR-006`                                     | React Hook Form + Zod canonical kararı                      |
| `ADR-010`                                     | Auth mekanizması: HttpOnly cookie + SecureStore             |
| `CLAUDE.md`                                   | AI araç talimatları, guardrail protokolü                    |
