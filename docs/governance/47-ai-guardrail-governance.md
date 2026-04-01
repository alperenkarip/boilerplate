# 47-ai-guardrail-governance.md

## Doküman Kimliği

- **Doküman adı:** AI Guardrail Governance
- **Dosya adı:** `47-ai-guardrail-governance.md`
- **Doküman türü:** Governance / AI quality enforcement / guardrail framework document
- **Durum:** Accepted
- **Tarih:** 2026-04-01
- **Kapsam:** Bu belge, AI araçlarının (Claude Code, MoAI-ADK, Codex CLI) kod üretirken boilerplate standartlarının dışına çıkmasını yapısal olarak engelleyen guardrail çerçevesini tanımlar. Katmanlı guardrail mimarisi, domain ve aktivite guardrail formatları, tetikleme mekanizmaları, skill ve hook entegrasyonu, türetilen projelere miras aktarımı, yaşam döngüsü yönetimi ve anti-pattern tanımlarını içerir.
- **Bağlı olduğu üst dokümanlar:**
  - `00-project-charter.md`
  - `01-working-principles.md`
  - `40-ai-workflow-and-tooling.md`
  - `41-ai-instruction-standards.md`
  - `45-boilerplate-project-boundary-contract.md`
- **Doğrudan etkileyeceği dokümanlar:**
  - `CLAUDE.md`
  - `AGENTS.md`
  - `35-document-map.md`
  - `31-audit-checklist.md`
  - `32-definition-of-done.md`
  - `15-quality-gates-and-ci-rules.md`
  - `43-derived-project-creation-guide.md`
  - `30-contribution-guide.md`

---

# 1. Amaç

Bu dokümanın amacı, AI araçlarının kod üretirken proje standartlarından bağımsız veya habersiz davranmasını engelleyen yapısal bir kalite çerçevesi kurmaktır.

Documentation-first bir projede 50'den fazla standart doküman, 17 ADR, canonical stack kararları ve detaylı governance kuralları mevcuttur. Ancak bu kurallar yalnızca insan odaklı, narratif dokümanlarda yaşıyorsa AI araçları bu kuralları her zaman okumaz, hatırlamaz veya uygulayamaz.

Bu belge şu sorulara net cevap verir:

1. AI araçlarının her kod üretiminde hangi standartları kontrol etmesi gerekir?
2. Bu kontrol nasıl tetiklenir — manuel mi, otomatik mi, yoksa her ikisi mi?
3. Guardrail dokümanları nasıl yapılandırılmalıdır?
4. Hangi guardrail'ler her zaman aktiftir, hangileri koşullu tetiklenir?
5. Claude Code skill'leri ve hook'ları bu çerçeveye nasıl entegre edilir?
6. Codex CLI bu çerçevedeki denetim rolünü nasıl üstlenir?
7. Guardrail'ler türetilen projelere nasıl aktarılır?
8. Guardrail dokümanlarının yaşam döngüsü nasıl yönetilir?
9. Hangi davranışlar guardrail ihlali sayılır?

Bu belge olmadan aşağıdaki sorunlar kaçınılmazdır:

- AI araçları proje dokümanlarını okumadan kod üretir ve standart dışı çıktılar oluşur,
- hardcoded değerler, import yönü ihlalleri, a11y eksiklikleri, HIG uyumsuzlukları birikir,
- her oturum kendi başına ayrı bir dünya olur; tutarlılık kişisel dikkat seviyesine kalır,
- türetilen projeler guardrail'siz kalır ve boilerplate disiplininden hızla uzaklaşır,
- Codex review'ı guardrail referansı olmadan yüzeysel kalır.

---

# 2. Temel Tez

> AI araçları boilerplate dokümanlarına tabidir; ancak uzun, narratif dokümanları her oturumda bütünüyle okumak context bütçesi açısından sürdürülebilir değildir. Bu nedenle her standart alanı için AI-native, kısa, direktif bazlı guardrail dokümanları oluşturulmalı; bu dokümanlar iş türüne göre otomatik veya yarı otomatik tetiklenmelidir.

Bu tez şu sonuçları doğurur:

1. Guardrail dokümanları, mevcut ana dokümanların AI-native özetidir; alternatifi veya yerine geçeni değildir.
2. Guardrail'ler katmanlı bir mimaride organize edilir: universal → domain → aktivite → proje-spesifik.
3. Guardrail tetikleme, iş türü ve dosya bağlamına göre dinamik olmalıdır.
4. Claude Code skill'leri ve hook'ları, guardrail tetiklemenin birincil mekanizmasıdır.
5. Codex CLI, AGENTS.md üzerinden guardrail uyumunu bağımsız olarak denetler.
6. Guardrail'ler `45-boilerplate-project-boundary-contract.md` miras modeline tabidir.
7. Guardrail'ler de diğer talimat dosyaları gibi git'te yaşar, PR review kapsamındadır.

---

# 3. Otorite Hiyerarşisi

Guardrail dokümanları, `40-ai-workflow-and-tooling.md`'deki otorite hiyerarşisinde Katman 3 (talimat dosyaları) seviyesindedir.

```
Katman 1: Boilerplate doküman seti (00–46)
Katman 2: ADR kararları + canonical governance belgeleri (36, 37, 38)
Katman 3: Talimat dosyaları (CLAUDE.md, AGENTS.md, guardrail dokümanları, skill'ler)
Katman 4: AI aracının runtime davranışı
```

Guardrail dokümanı ile kaynak doküman arasında çelişki tespit edilirse:
- Kaynak doküman (üst katman) her zaman kazanır.
- Guardrail dokümanı güncellenir.
- Guardrail dokümanı kaynak dokümanı geçersiz kılamaz.

---

# 4. Katmanlı Guardrail Mimarisi

Guardrail'ler sabit bir alan listesiyle sınırlı değildir. Projede yapılabilecek tüm geliştirme aktivitelerini kapsayacak şekilde beş katmanlı dinamik bir yapıda organize edilir.

## 4.1. Katman 1 — Universal Guardrail'ler

Her kod üretiminde, her iş türünde, her zaman aktif olan kurallar. Bu kurallar CLAUDE.md çekirdek katmanında doğrudan yer alır ve ayrı guardrail dokümanı gerektirmez.

İçeriği:

- TypeScript strict mode zorunlu, `any` tipi yasak
- Import yönleri: feature → shared OK, shared → feature YASAK, packages → apps YASAK
- Dosya organizasyonu: feature-first, kaynak dosya yanında test
- Semantic token zorunluluğu: hardcoded renk, spacing, font değeri yasak
- i18n: inline user-facing string yasak, i18n key kullan
- Security baseline: secret, credential, hassas veri kuralları
- Naming convention: PascalCase component, camelCase değişken, dosya adı eşleşmesi
- Canonical stack kararlarına uyum: ADR-001 → ADR-012 tartışmaya kapalı

## 4.2. Katman 2 — Domain Guardrail'ler

Belirli bir teknik veya tasarım alanına ait kuralları barındırır. İş türüne ve dosya bağlamına göre tetiklenir.

Konum: `docs/ai-guardrails/domain/D-XXX-alan-adi.md`

Mevcut domain'ler:

| ID | Alan | Kaynak Dokümanlar |
|---|---|---|
| D-UIX | UI/UX kalitesi, HIG, premium ton | 03, 33, 34 |
| D-DSY | Design system, token, theming, component governance | 04, 05, 22, 23 |
| D-NAV | Navigation, routing, deep linking | 08, ADR-012 |
| D-STA | State management | 09, ADR-004 |
| D-DAT | Data fetching, cache, sync, mutation | 10, ADR-005 |
| D-FRM | Forms, validation, input UX | 11, ADR-006 |
| D-MOT | Motion, interaction, animation | 24 |
| D-ERR | Error, empty, loading states, recovery | 25 |
| D-PLT | Platform adaptation (web ↔ mobile) | 26, ADR-001, ADR-002 |
| D-A11 | Accessibility (WCAG AA minimum) | 12 |
| D-PRF | Performance | 13 |
| D-TST | Testing stratejisi | 14, ADR-008 |
| D-SEC | Security, auth, secrets | 27, ADR-010 |
| D-OBS | Observability, logging, analytics, debugging | 28, ADR-009 |
| D-I18 | Internationalization | ADR-011 |
| D-STY | Styling, Tailwind CSS, NativeWind | ADR-007 |
| D-FIR | Firebase, Firestore, Cloud Functions | Yeni alan |
| D-3RD | Third-party SDK entegrasyonu | 37 genişletilmiş |
| D-VIS | Visual fidelity, implementation contract | 33 |
| D-AIX | AI/Intelligence UX, ML entegrasyon, AI içerik sunumu | 34, Apple HIG — Design for Intelligence |
| D-NTF | Push notification, izin yönetimi, rich notification | ADR-013, 26 |
| D-DPL | Deep linking, universal links, app links | ADR-014, 08 |
| D-PAY | Payment, subscription, in-app purchase | ADR-016, 27 |
| D-PRI | Privacy, GDPR, KVKK, consent management | ADR-017, 27, 28 |
| D-BIO | Biometric authentication, passkey | ADR-010, 27 |

Bu liste kapalı değildir. Yeni domain ihtiyacı ortaya çıktığında bu tabloya eklenir, ilgili guardrail dokümanı oluşturulur.

## 4.3. Katman 3 — Aktivite Guardrail'ler

Geliştirme aktivitesi türüne göre tetiklenir. Her aktivite guardrail'i, hangi domain guardrail'lerinin aktif olacağını, ön koşulları, aktiviteye özel kuralları ve DoD eklerini tanımlar.

Konum: `docs/ai-guardrails/activity/A-XXX-aktivite-adi.md`

Mevcut aktiviteler:

| ID | Aktivite | Tetiklenen Domain'ler |
|---|---|---|
| A-NEW-FEAT | Yeni feature geliştirme | İlgili tüm domain'ler |
| A-NEW-COMP | Yeni component oluşturma | D-UIX, D-DSY, D-A11, D-PLT, D-MOT |
| A-NEW-SCRN | Yeni ekran/sayfa oluşturma | D-UIX, D-NAV, D-ERR, D-A11, D-PLT |
| A-NEW-HOOK | Yeni hook/utility oluşturma | D-TST |
| A-NEW-API | Yeni API endpoint/entegrasyon | D-DAT, D-SEC, D-TST |
| A-FORM | Form geliştirme/düzenleme | D-FRM, D-UIX, D-A11, D-ERR |
| A-FIREBASE | Firebase/Firestore işlemi | D-FIR, D-SEC, D-DAT |
| A-STATE | State yapısı değişikliği | D-STA, D-PRF |
| A-NAV | Navigation değişikliği | D-NAV, D-PLT |
| A-STYLE | Styling/theme değişikliği | D-STY, D-DSY, D-UIX |
| A-REFACTOR | Refactoring | D-TST, Universal |
| A-DEP | Dependency ekleme/kaldırma/upgrade | 37-dependency-policy, 38-compatibility-matrix |
| A-MIGRATION | Veri/şema/kod migration | D-DAT, D-SEC |
| A-CONFIG | Build/env/CI config değişikliği | 15, 21, 27 |
| A-DOCS | Doküman/ADR yazımı | 41, 18 |
| A-FIX | Bug fix | Universal + ilgili domain |
| A-3RD | Third-party SDK entegrasyonu | D-3RD, D-SEC, 37 |
| A-AUTH | Auth flow değişikliği | D-SEC, ADR-010 |
| A-RELEASE | Release hazırlığı | 29, 15, 31 |
| A-MEDIA | File upload/media/storage | D-SEC, D-PRF |
| A-REALTIME | Real-time/WebSocket/push | D-DAT, D-SEC, D-PRF |
| A-ANALYTICS | Analytics/event tracking | D-OBS, D-SEC |
| A-OFFLINE | Offline/cache/persistence | D-DAT, D-PLT |
| A-AI-FEAT | AI/ML feature entegrasyonu | D-AIX, D-UIX, D-SEC, D-PLT |
| A-NOTIFICATION | Push notification geliştirme | D-NTF, D-SEC, D-PRI |
| A-DEEPLINK | Deep link implementasyonu | D-DPL, D-NAV, D-SEC |
| A-PAYMENT | Ödeme/abonelik entegrasyonu | D-PAY, D-SEC, D-PRI |
| A-OTA | OTA güncelleme | D-SEC, D-OBS, D-PLT |
| A-PRIVACY | Gizlilik uyum çalışması | D-PRI, D-SEC, D-OBS |

Bu liste de kapalı değildir. Yeni aktivite türü ortaya çıktığında eklenir.

## 4.4. Katman 4 — Yaşam Döngüsü Guardrail'ler

PR, merge, release süreçlerine bağlı kurallar. Bu kurallar mevcut dokümanlardan (15, 29, 30, 32, 42) türetilir ve ilgili aktivite guardrail'lerinde referans edilir.

## 4.5. Katman 5 — Proje-Spesifik Guardrail'ler

Türetilen projenin kendi domain'ine özel eklediği guardrail'ler.

Konum: `docs/ai-guardrails/project/GP-XXX-alan-adi.md`

Kural: Proje-spesifik guardrail'ler base guardrail'lerle çelişemez. Yalnızca ek kısıtlama getirebilir.

---

# 5. Guardrail Doküman Formatları

## 5.1. Domain Guardrail Formatı

Her domain guardrail dokümanı şu yapıya sahiptir:

```markdown
---
id: D-XXX
type: domain
name: [Alan Adı]
kaynak-dokümanlar: [doküman numaraları]
miras-tipi: zorunlu | yapısal
son-güncelleme: YYYY-MM-DD
---

# D-XXX: [Alan Adı] Guardrail

## Bu Guardrail Ne Zaman Aktif?
[Tetikleme koşulları: dosya yolu pattern'leri, aktivite türleri, içerik ipuçları]

## Zorunlu Kurallar
1. [YAPILMALI] ...
2. [YAPILMAMALI] ...

## Kalite Eşikleri
- [MİNİMUM] ...
- [ÖNERİLEN] ...

## Anti-pattern'ler
1. [ZAYIF] ...

## Kontrol Listesi
- [ ] Kural 1 sağlandı mı?
- [ ] Kural 2 sağlandı mı?

## İhlal Durumunda
[Düzeltme yolu veya exception kaydı açma referansı]

## Kaynak
[Ana doküman referansları — detay için oku]
```

Kısıtlamalar:
- Maksimum 150 satır (context bütçesi)
- Narratif açıklama yasak, yalnızca direktifler
- Her kural kaynak dokümana referans içermeli

## 5.2. Aktivite Guardrail Formatı

```markdown
---
id: A-XXX
type: activity
name: [Aktivite Adı]
tetiklenen-domain-guardrails: [D-XXX, D-YYY, ...]
araç-zorunlulukları:
  spec: zorunlu | önerilen | —
  stitch: zorunlu | önerilen | —
  codex: zorunlu | önerilen | —
son-güncelleme: YYYY-MM-DD
---

# A-XXX: [Aktivite Adı] Guardrail

## Ön Koşullar
[Bu aktiviteye başlamadan önce ne yapılmalı]

## Aktif Domain Guardrail'ler
[Bu aktivite tetiklendiğinde okunması gereken domain guardrail'leri listesi]

## Aktiviteye Özel Kurallar
1. ...

## Araç Kullanım Tablosu
[SPEC, Stitch, Codex zorunlulukları — 40-ai-workflow-and-tooling.md §6.1 ile uyumlu]

## DoD Ek Maddeleri
[Bu aktivite türü için 32-definition-of-done.md'ye ek]

## Kontrol Listesi
- [ ] ...
```

Kısıtlamalar:
- Maksimum 100 satır
- Domain guardrail'lerin içeriğini tekrar etmez, sadece referans verir

---

# 6. Tetikleme Mekanizmaları

Guardrail'lerin tetiklenmesi üç mekanizmayla sağlanır.

## 6.1. CLAUDE.md Guardrail Protokolü (Birincil)

CLAUDE.md çekirdek katmanında yer alan guardrail protokolü, AI aracına her kod üretiminde uyması gereken süreci tanımlar.

Protokol:

1. İş türünü belirle (hangi aktivite?)
2. Aktivite guardrail dokümanını oku (`docs/ai-guardrails/activity/A-XXX.md`)
3. Aktivitenin tetiklediği domain guardrail dokümanlarını oku (`docs/ai-guardrails/domain/D-XXX.md`)
4. Universal kuralları hatırla (Katman 1 — her zaman aktif)
5. Kurallara uygun kod üret
6. Üretim sonrası kontrol listesini zihinsel olarak doğrula
7. İhlal varsa düzelt; düzeltemiyorsan `44-exception-and-exemption-policy.md`'ye yönlendir

Bu protokolü atlama. Guardrail okumadan kod üretme.

## 6.2. Claude Code Hook'ları (Otomatik — Command Tipi)

`.claude/settings.json`'da tanımlanan `command` tipi hook'lar, dosya düzenleme sırasında otomatik olarak gerçek dosya taraması yapar.

**PreToolUse hook (`pre-edit-guardrail.sh`):**
- Edit/Write tool'u çağrılmadan ÖNCE çalışır
- Dosya yoluna göre aktif domain guardrail'leri tespit eder ve stderr'e uyarı yazar
- `.env`, credential, secret dosyalarına yazma girişimini exit code 2 ile BLOKLAR
- Dosya uzantısı ve path pattern'ine göre bağlam tespiti: `.tsx` → D-UIX/D-DSY/D-A11, `firebase/` → D-FIR/D-SEC, `form/` → D-FRM, `store/` → D-STA, vb.

**PostToolUse hook (`post-edit-guardrail.sh`):**
- Edit/Write tool'u çalıştıktan SONRA çalışır
- Yazılan dosyayı gerçek `grep` ile tarar:
  - Hardcoded hex renk (`#[0-9a-fA-F]{3,8}`)
  - `any` type kullanımı
  - Secret/credential pattern'leri (API key, password literal)
  - `console.log` ile PII riski
  - `eslint-disable` / `@ts-ignore` (exception kaydı gerektirir)
  - `dangerouslySetInnerHTML` (XSS riski)
  - `localStorage`/`sessionStorage` token saklama (ADR-010 ihlali)
- İhlal bulursa detaylı uyarıyı stderr'e yazar — Claude bu uyarıyı görür ve düzeltme yapabilir

Hook script'leri: `.claude/hooks/pre-edit-guardrail.sh` ve `.claude/hooks/post-edit-guardrail.sh`

Hook'lar skill'leri tamamlayan ikincil denetim katmanıdır. Skill'ler iş başlangıcında stratejik kontrol yapar, hook'lar her dosya düzenlemesinde taktik kontrol yapar.

## 6.3. Claude Code Skill'leri (Otomatik Tetikleme)

Skill'ler `disable-model-invocation: false` (varsayılan) olarak yapılandırılmıştır. Bu, Claude'un skill'leri kullanıcı müdahalesi olmadan otomatik olarak invoke edebileceği anlamına gelir. Her skill'in description'ında "TRIGGER when" koşulları tanımlıdır — Claude bu koşulları tespit ettiğinde skill'i otomatik tetikler.

| Skill | Tetikleme | İşlev |
|---|---|---|
| `/guardrail-check` | **OTOMATİK: Her kodlama görevi başlangıcında** | İş türünü belirle, guardrail'leri oku, kuralları özetle, sonra kodla |
| `/guardrail-audit` | **OTOMATİK: Kodlama görevi tamamlandığında** | Tüm değişiklikleri toplu denetle, ihlal raporu üret (subagent) |
| `/dep-check` | **OTOMATİK: Dependency ekleme/upgrade istendiğinde** | Policy ve canonical stack kontrolü, budget analizi |
| `/pre-pr` | **OTOMATİK: PR/commit/push öncesinde** | Kapsamlı kalite kontrolü (subagent) |
| `/domain-guide D-XXX` | Otomatik veya manuel: Domain detayı gerektiğinde | Belirtilen domain guardrail'ini oku ve özetle |
| `/boundary-check` | Otomatik veya manuel: Modül yapısı değiştiğinde | Boundary contract uyum kontrolü (subagent) |
| `/exception-create` | Otomatik: İhlal düzeltilemediğinde | Exception/exemption kaydı oluştur |

**Skill tetikleme öncelik sırası:**
1. `guardrail-check` → iş başlangıcında (ÖN kontrol)
2. Hook'lar → her dosya düzenlemesinde (ANLIK kontrol)
3. `guardrail-audit` → iş tamamlandığında (SON kontrol)
4. `pre-pr` → PR/commit öncesinde (KAPSAMLI kontrol)

## 6.4. Codex CLI Denetimi (Bağımsız)

Codex CLI, AGENTS.md üzerinden guardrail uyumunu bağımsız olarak denetler. Bu denetim, Claude Code'un self-check mekanizmasından ayrı ve tamamlayıcıdır.

AGENTS.md'de guardrail denetim kuralları:

- Universal guardrail ihlalleri → P0
- Domain guardrail ihlalleri → P0/P1 (domain'e göre)
- Aktivite guardrail uyumsuzluğu → P1
- Guardrail referansı raporda belirtilir

---

# 7. Guardrail Doküman Bağlamında Context Bütçesi

`41-ai-instruction-standards.md`'deki context bütçesi kuralları guardrail dokümanları için de geçerlidir.

| Kaynak | Bütçe Kuralı |
|---|---|
| Domain guardrail dokümanı | Maks 150 satır |
| Aktivite guardrail dokümanı | Maks 100 satır |
| Aynı anda aktif guardrail sayısı | Maks 1 aktivite + 4 domain |
| CLAUDE.md guardrail protokolü | Maks 30 satır (çekirdek katman içinde) |

Guardrail dokümanları ana dokümanların içeriğini kopyalamaz. Direktif ve referans verir. Detay için ana doküman okunur.

---

# 8. Türetilen Projelere Miras Aktarımı

`45-boilerplate-project-boundary-contract.md`'deki miras modeline göre:

| Kaynak | Miras Tipi | Override |
|---|---|---|
| `docs/ai-guardrails/domain/` | Zorunlu miras | Ek guardrail eklenebilir, base kaldırılamaz/gevşetilemez |
| `docs/ai-guardrails/activity/` | Yapısal miras | Proje ek aktivite ekleyebilir, base kaldırılamaz |
| CLAUDE.md guardrail protokolü | Zorunlu miras | Protokol kaldırılamaz, genişletilebilir |
| `.claude/skills/` (guardrail skill'leri) | Yapısal miras | Proje ek skill ekleyebilir, base skill kaldırılamaz |
| `.claude/settings.json` (hook'lar) | Yapısal miras | Proje ek hook ekleyebilir, base hook devre dışı bırakılamaz |
| AGENTS.md guardrail bölümleri | Zorunlu miras | Ek kural eklenebilir, base kaldırılamaz |

Türetilen proje kendi guardrail'lerini `docs/ai-guardrails/project/GP-XXX.md` formatında ekleyebilir.

---

# 9. Yaşam Döngüsü Yönetimi

## 9.1. Guardrail Ekleme

1. İhtiyaç tespit edilir (yeni alan, yeni standart, tekrarlayan ihlal).
2. Kaynak doküman belirlenir veya yoksa yeni doküman yazılır.
3. Guardrail dokümanı format standardına uygun şekilde yazılır.
4. Bu belgedeki ilgili tabloya eklenir (domain veya aktivite).
5. CLAUDE.md, AGENTS.md ve ilgili mevcut dokümanlara referans eklenir.
6. PR review'dan geçer.

## 9.2. Guardrail Güncelleme

Kaynak doküman güncellendiğinde ilgili guardrail dokümanı da güncellenir.
Guardrail'in `son-güncelleme` tarihi revize edilir.
Güncelleme PR review kapsamındadır.

## 9.3. Guardrail Kaldırma

Guardrail dokümanı yalnızca kaynak doküman kaldırıldığında veya alan geçersiz hale geldiğinde kaldırılır.
Kaldırma gerekçesi commit mesajında belirtilir.
Bu belgedeki tablodan çıkarılır.

## 9.4. Guardrail Etkinlik İzleme

Guardrail etkinliği şu sinyallerle izlenir:

- Codex review raporlarında guardrail ihlal sıklığı
- Exception/exemption kaydında guardrail referansı
- Audit raporlarında guardrail uyum oranı
- Sık ihlal edilen guardrail → kaynak doküman veya guardrail dokümanı revize gerektirir

---

# 10. Skill ve Hook Entegrasyonu

## 10.1. Skill Dosya Yapısı

Skill'ler `.claude/skills/{skill-adi}/SKILL.md` formatında tanımlanır.

Her SKILL.md dosyası:
- YAML frontmatter: name, description, allowed-tools, context (fork varsa)
- Markdown content: skill'in yaptığı işin talimatları

Skill'ler git'te tutulur ve PR review kapsamındadır.

## 10.2. Hook Dosya Yapısı

Hook'lar `.claude/settings.json` içinde tanımlanır.
Hook script'leri `.claude/hooks/` dizininde tutulur.

Hook handler türleri:
- **command:** Shell komutu çalıştırır, JSON stdin alır, exit code ile sonuç döner.
- **prompt:** Claude modeline tek turlu prompt gönderir.
- **agent:** Subagent spawn eder, Read/Grep/Glob gibi araçlara erişir.

## 10.3. Codex Skill Entegrasyonu

Codex de SKILL.md formatını destekler. Codex skill'leri denetim ve rapor üretimi odaklıdır:

- `$guardrail-audit`: Guardrail uyum denetim raporu üretir
- `$boundary-audit`: Boundary contract uyum raporu üretir
- `$full-audit`: Tüm denetim katmanlarını çalıştırıp birleşik rapor üretir

Codex skill'leri `.codex/skills/` veya AGENTS.md'de referans edilir.

---

# 11. Anti-pattern'ler

Aşağıdaki davranışlar guardrail çerçevesi ihlali olarak tanımlanır:

## 11.1. Guardrail Atlama

**Tanım:** Guardrail protokolünü takip etmeden kod üretme.
**Belirtileri:** Guardrail dokümanı okunmadan doğrudan kod yazılması, "hızlı düzeltme" bahanesiyle protokolün atlanması.
**Neden anti-pattern:** Guardrail'siz üretim, standart sapmasının en yaygın nedenidir.

## 11.2. Guardrail Şişirme

**Tanım:** Guardrail dokümanlarını gereksiz detayla doldurarak context bütçesini aşırı tüketme.
**Belirtileri:** 150 satır sınırını aşan domain guardrail'ler, kaynak doküman içeriğinin kopyalanması.
**Neden anti-pattern:** Context bütçesi aşıldığında AI'ın dikkat kalitesi düşer.

## 11.3. Guardrail Fetişizmi

**Tanım:** Her küçük iş için tüm guardrail'leri okumayı zorunlu kılma.
**Belirtileri:** Tek satır düzeltme için 5+ guardrail dokümanı okutma, orantısız kontrol maliyeti.
**Neden anti-pattern:** `40-ai-workflow-and-tooling.md`'deki orantılılık prensibi ihlal edilir.

## 11.4. Guardrail Görmezden Gelme

**Tanım:** İhlal tespit edilmesine rağmen düzeltmeme veya exception kayıt açmama.
**Belirtileri:** Guardrail kontrol listesinde fail olan maddelerin sessizce geçilmesi.
**Neden anti-pattern:** Yönetilmeyen ihlal, teknik borçtur (`44-exception-and-exemption-policy.md`).

## 11.5. Guardrail-Doküman Sapması

**Tanım:** Guardrail dokümanının kaynak dokümanla uyumsuz hale gelmesi.
**Belirtileri:** Kaynak doküman güncellendikten sonra guardrail'in eski kuralları taşıması.
**Neden anti-pattern:** Yanlış guardrail, yanlış üretim yönlendirir; doğrudan hata kaynağıdır.

## 11.6. Proje-Spesifik Guardrail ile Base Override

**Tanım:** Türetilen projede proje-spesifik guardrail ekleyerek base guardrail'i fiilen geçersiz kılma.
**Belirtileri:** GP-XXX dokümanında base guardrail kuralının çelişen versiyonunun yazılması.
**Neden anti-pattern:** `45-boilerplate-project-boundary-contract.md` ihlalidir.

---

# 12. Onay Kriterleri

Bu belge aşağıdaki koşullar sağlandığında uygulamaya hazır kabul edilir:

- [ ] Beş katmanlı guardrail mimarisi net tanımlanmıştır
- [ ] Domain ve aktivite guardrail listeleri eksiksiz oluşturulmuştur
- [ ] Domain guardrail doküman formatı örneklerle gösterilmiştir
- [ ] Aktivite guardrail doküman formatı örneklerle gösterilmiştir
- [ ] Tetikleme mekanizmaları (protokol, hook, skill, Codex) tanımlanmıştır
- [ ] Context bütçesi kuralları guardrail dokümanları için belirtilmiştir
- [ ] Türetilen projelere miras aktarımı miras tipine göre tanımlanmıştır
- [ ] Yaşam döngüsü (ekleme, güncelleme, kaldırma, izleme) tanımlanmıştır
- [ ] Anti-pattern'ler en az 6 madde olarak listelenmiştir
- [ ] Skill ve hook entegrasyonu dosya yapısıyla birlikte tanımlanmıştır
- [ ] Otorite hiyerarşisi ve çelişki çözümü net belirtilmiştir
- [ ] `35-document-map.md`'de bu belgenin yeri işaretlenebilir niteliktedir
- [ ] `45-boilerplate-project-boundary-contract.md` ile uyumludur

---

# 13. Sonuç

Bu belgenin ana çıktısı şudur:

> AI araçlarının kod üretirken proje standartlarına uyumu, kişisel dikkat seviyesine değil; katmanlı guardrail mimarisi, tetikleme mekanizmaları, skill/hook entegrasyonu ve bağımsız Codex denetimiyle yapısal olarak garanti altına alınır.

Bu nedenle bundan sonra:
- AI aracı guardrail protokolü olmadan kod üretemez,
- her kod üretimi iş türüne göre ilgili guardrail'lerle yönlendirilir,
- guardrail ihlalleri Codex tarafından bağımsız olarak denetlenir,
- türetilen projeler guardrail çerçevesini zorunlu miras olarak devralır,
- guardrail dokümanları da diğer boilerplate dokümanları gibi yaşar, güncellenir ve denetlenir.
