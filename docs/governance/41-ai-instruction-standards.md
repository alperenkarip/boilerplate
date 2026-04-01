# 41-ai-instruction-standards.md

## Doküman Kimliği

- **Doküman adı:** AI Instruction Standards
- **Dosya adı:** `41-ai-instruction-standards.md`
- **Doküman türü:** Standard / AI instruction governance / talimat kalite kontrol belgesi
- **Durum:** Accepted
- **Tarih:** 2026-04-01
- **Kapsam:** Bu boilerplate kapsamında AI araçlarına verilen talimatların formatını, context bütçesini, kalite kriterlerini, EARS SPEC formatını, adlandırma kurallarını ve versiyon yönetimini tanımlar.
- **Bağlı olduğu üst dokümanlar:**
  - `40-ai-workflow-and-tooling.md`
  - `16-tooling-and-governance.md`
- **Doğrudan etkileyeceği dokümanlar:**
  - `CLAUDE.md`
  - `AGENTS.md`
  - `46-stitch-pipeline-spec.md`
  - `30-contribution-guide.md`

---

# 1. Amaç

Bu dokümanın amacı, AI araçlarına verilen talimatların kalite, tutarlılık ve sürdürülebilirlik standartlarını tanımlamaktır.

Documentation-first bir projede AI araçlarına verilen talimatlar da birer doküman olarak ele alınmalıdır.
Talimat dosyalarının yapısı, içeriği, sınırları ve bakım süreci belirli kurallara bağlanmazsa AI çıktı kalitesi kişisel dikkat seviyesine, oturum anındaki hatırlamaya ve bireysel alışkanlıklara bağlı kalır.
Bu kontrol edilemeyen bir durumdur.

Bu belge şu sorulara net cevap verir:

1. AI araçlarına verilen talimatların formatı ne olmalıdır?
2. Her talimat dosyasının zorunlu ve koşullu bölümleri nelerdir?
3. Context bütçesi nasıl yönetilmelidir?
4. SPEC dokümanlarının kalite kriterleri nelerdir?
5. EARS SPEC formatı nasıl uygulanmalıdır?
6. Talimat ve SPEC dosyaları nasıl adlandırılmalı, nerede saklanmalıdır?
7. Talimat dosyalarının versiyon yönetimi nasıl yapılmalıdır?
8. Hangi davranışlar anti-pattern sayılır?

Bu belge, AI araçlarını kullanan her geliştiricinin okuma listesindedir.
Talimat dosyası oluşturan, düzenleyen veya review eden herkes bu standartta tanımlanan kurallara tabidir.

---

# 2. Temel Tez

> Documentation-first projede, AI araçlarına verilen talimatlar da dokümandır.
> Talimat kalitesi kontrol edilmezse AI çıktı kalitesi kişisel dikkat seviyesine bağlı kalır.
> Governance olmadan talimat dosyaları zamanla bozulur, çelişir ve güvenilirliğini kaybeder.

Bu tez şu sonuçları doğurur:

1. Her talimat dosyasının tanımlı bir anatomisi vardır; rastgele yapıda dosya kabul edilmez.
2. Context bütçesi bilinçli yönetilmelidir; sınırsız bilgi yükleme yapılmaz.
3. SPEC dokümanları belirli bir formata (EARS) uymalıdır.
4. Talimat dosyaları git'te yaşar, PR review kapsamındadır.
5. Anti-pattern'ler tanımlanmıştır ve review sırasında denetlenir.
6. Talimat kalitesi, AI çıktı kalitesinin ön koşuludur.

---

# 3. Context Bütçesi Yönetimi

AI araçlarının context window'u sınırlıdır.
Bu sınır model bağımsız bir gerçekliktir: bugün 128K token olan sınır yarın 1M olabilir, ama sınır her zaman vardır.

Aynı anda yüklenen talimat + tasarım + SPEC + kod, context'in önemli bir kısmını tüketir.
Kalan alan AI'ın gerçek iş yapacağı alandır.
Bu alan daraldıkça AI'ın dikkat kalitesi, bağlam takibi ve çıktı tutarlılığı bozulur.

Bu nedenle her talimat kaynağı için bütçe tanımlanmıştır.

## 3.1. CLAUDE.md Bütçesi

CLAUDE.md, AI aracının her oturumda otomatik olarak okuduğu çekirdek talimat dosyasıdır.
Bu dosya kısa ve öz olmalıdır.

**Kural:** CLAUDE.md 500 satırı geçmemelidir.

Gerekçe: 500 satır üzerindeki CLAUDE.md dosyaları, oturum başında context'in orantısız büyük bir dilimini tüketir.
Bu, asıl iş için kalan context'i daraltır.

Bütçe yönetimi stratejisi:

- **Çekirdek bilgiler** (canonical kararlar, dosya organizasyonu, dil kuralları): her zaman CLAUDE.md'de bulunur.
- **Detay kurallar**: CLAUDE.md'de pointer olarak yer alır. "Detay için şu dokümanı oku" referansı verilir, kuralın kendisi CLAUDE.md'ye yazılmaz.
- **Koşullu bölümler**: Yalnızca belirli iş türlerinde geçerli olan kurallar, koşullu biçimde işaretlenir.

Aşılması durumunda ne olur: Review sırasında CLAUDE.md'nin satır sayısı kontrol edilir. 500 satırı aşan CLAUDE.md merge edilmez; refactor ile kısaltılması beklenir.

## 3.2. DESIGN.md Bütçesi

DESIGN.md, Stitch tarafından üretilen tasarım dokümanıdır.
Tamamı her oturumda context'e yüklenmemelidir.

**Kural:** Aktif çalışılan alanın token subset'i verilmelidir, dosyanın tamamı değil.

Uygulamada:

- Bir component üzerinde çalışılıyorsa yalnızca o component'in token'ları, pattern'leri ve ilgili ekran bilgisi yüklenmelidir.
- Stitch MCP ihtiyaç duyulduğunda aktifleştirilmelidir; her oturumda varsayılan olarak açık olmamalıdır.
- Context'e yüklenen DESIGN.md bölümü, aktif işle doğrudan ilişkili olmalıdır.

## 3.3. SPEC Bütçesi

SPEC dokümanları, MoAI-ADK veya manuel olarak üretilen gereksinim ve kabul kriteri dokümanlarıdır.

**Kural:** Aynı anda tek SPEC aktif olmalıdır.

Gerekçe: Birden fazla SPEC aynı anda context'te bulunduğunda AI'ın odağı dağılır, cross-referencing hataları artar ve kabul kriterlerinin hangi SPEC'e ait olduğu belirsizleşir.

- Tamamlanmış SPEC'ler context'ten çıkarılmalıdır.
- Yeni SPEC başlamadan önce aktif SPEC'in done/closed durumuna geçtiği doğrulanmalıdır.

## 3.4. MCP Araç Bütçesi

MCP (Model Context Protocol) bağlantıları, AI aracına ek yetenekler kazandırır.
Ama her bağlantı context ve performans maliyeti üretir.

**Kural:** Gereksiz MCP bağlantısı açılmamalıdır.

- Stitch MCP yalnızca tasarım işi yapılırken aktif olmalıdır.
- Kullanılmayan MCP bağlantıları oturum başında kapatılmalıdır.
- MCP aracının context'e enjekte ettiği tool tanımları da bütçe hesabına dahildir.

## 3.5. Bütçe Özet Tablosu

| Kaynak | Bütçe Kuralı | Kontrol Noktası |
|---|---|---|
| CLAUDE.md | Maks 500 satır | PR review |
| DESIGN.md | Aktif alan subset'i | Oturum başlangıcı |
| SPEC | Aynı anda tek aktif | SPEC durumu kontrolü |
| MCP | İhtiyaç duyulduğunda aktif | Oturum başlangıcı |

---

# 4. Talimat Dosyası Anatomileri

Her talimat dosyasının tanımlı bir iç yapısı vardır.
Bu yapı rastgele oluşturulmaz; dosyanın amacına göre zorunlu ve koşullu bölümleri sabittir.

## 4.1. CLAUDE.md Anatomisi

CLAUDE.md katmanlı bir yapıya sahiptir.
Bu katmanlar, context bütçesiyle doğrudan ilişkilidir.

### Katman 1 — Çekirdek (her zaman yüklenir)

Yaklaşık 40-50 satır.
Bu katman CLAUDE.md'nin değişmez omurgasıdır.

İçeriği:

- **Proje kimliği:** Projenin adı, tipi, canonical stack'i.
- **Canonical kararlar:** ADR'lerle sabitlenmiş, tartışmaya kapalı teknik kararlar. Kısa referanslarla listelenmelidir (ör. "styling: Tamagui — ADR-007").
- **Dosya organizasyonu:** Repo yapısının özeti. `21-repo-structure-spec.md`'ye referans.
- **Dil kuralları:** Kod dili, doküman dili, yorum dili, commit mesajı dili.

### Katman 2 — Referans Indexi (Claude Code Read ile erişir)

Bu katman, CLAUDE.md'de sadece pointer olarak bulunur.
AI aracı ihtiyaç duyduğunda Read komutuyla ilgili dokümanı okur.

Tipik referanslar:

- Component governance: `23-component-governance-rules.md`
- Platform adaptation: `26-platform-adaptation-rules.md`
- Error states: `25-error-empty-loading-states.md`
- Navigation: `08-navigation-and-flow-rules.md`
- Security: `27-security-and-secrets-baseline.md`
- Testing: `14-testing-strategy.md`
- Design tokens: `22-design-tokens-spec.md`

### Katman 3 — Koşullu Bölümler

Bu bölümler yalnızca belirli iş türlerinde devreye girer.

- **MoAI-ADK entegrasyonu:** SPEC-driven geliştirme yapılırken.
- **Stitch entegrasyonu:** Tasarım işi yapılırken.
- **Proje-spesifik iş kuralları:** Domain-specific kurallar, varsa.

### Güncelleme Tetikleyicileri

CLAUDE.md şu durumlarda güncellenir:

- Yeni ADR kabul edildiğinde (canonical kararlar listesi).
- Repo yapısı değiştiğinde (dosya organizasyonu).
- Yeni boilerplate dokümanı eklendiğinde (referans indexi).
- Koşullu bölüm eklenmesi veya kaldırılması gerektiğinde.

Her güncelleme PR review kapsamındadır.

## 4.2. AGENTS.md Anatomisi

AGENTS.md, Codex gibi otonom review araçlarına yönelik kural dosyasıdır.
Proje kökünde tek bir AGENTS.md bulunabileceği gibi, dizin-spesifik AGENTS.md dosyaları da oluşturulabilir.

### Zorunlu Bölümler

Her AGENTS.md dosyasında şu bölümler bulunmalıdır:

**Review Guidelines:**
Boilerplate canonical stack'ine uygunluk kontrol listesi.
Hangi kararların tartışmaya kapalı olduğu, review sırasında hangi kuralların denetleneceği.

**Architecture Rules:**
Bağımlılık yönleri (dependency direction), modül sınırları, izin verilen ve yasaklanan import yolları.
`07-module-boundaries-and-code-organization.md` ile tutarlılık.

**Testing Requirements:**
Minimum test beklentileri, test türleri, coverage eşikleri.
`14-testing-strategy.md` ve `32-definition-of-done.md` ile tutarlılık.

### Koşullu Bölüm

**Dizin-spesifik AGENTS.md:**
Belirli bir dizinin (ör. `packages/ui/`) kendine özgü review kuralları varsa, o dizine AGENTS.md konulabilir.

Kural: Dizin-spesifik AGENTS.md, kök AGENTS.md ile çelişemez. Yalnızca ek kısıtlama getirebilir.

## 4.3. .moai/config/ Anatomisi

MoAI-ADK konfigürasyon dosyaları `.moai/config/` dizininde yaşar.

**quality.yaml:**
- `development_mode`: `tdd` veya `ddd` (test-driven veya design-driven development modu).
- TRUST 5 kuralları: MoAI-ADK'nın kabul ettiği güven seviyesi parametreleri.

**Proje-spesifik agent konfigürasyonu:**
- Agent davranış parametreleri.
- SPEC üretim tercihleri.
- Review hassasiyet ayarları.

Bu dosyalar git'te tutulur ve PR review kapsamındadır.

## 4.4. DESIGN.md Anatomisi

DESIGN.md, Stitch tarafından üretilen tasarım dokümanıdır.

**Temel kural:** Elle düzenlenmez. Tek kaynak (source of truth) Stitch export'udur.

İçeriği:

- Renk token'ları (primitive ve semantic)
- Tipografi tanımları
- Spacing scale
- Component pattern'leri
- Ekran layout referansları

### 22-design-tokens-spec.md ile Eşleşme Kuralı

DESIGN.md ile boilerplate'in token spesifikasyonu arasında tutarlılık zorunludur.
Eşleşme tablosu:

| Stitch Çıktısı | Boilerplate Karşılığı |
|---|---|
| Stitch "color" | Semantic color token (`22-design-tokens-spec.md`) |
| Stitch "typography" | Typography token (`22-design-tokens-spec.md`) |
| Stitch "spacing" | Spacing scale token (`22-design-tokens-spec.md`) |

Eşleşmezlik durumunda `22-design-tokens-spec.md` kazanır.
DESIGN.md Stitch'te yeniden üretilir.

---

# 5. MoAI-ADK SPEC Formati -- EARS

SPEC dokümanları, yapılacak işin gereksinimlerini ve kabul kriterlerini tanımlayan yapılandırılmış dokümanlardır.
Bu projede SPEC formatı olarak EARS (Easy Approach to Requirements Syntax) kullanılır.

EARS, doğal dile yakın ama belirsizliği azaltan bir gereksinim yazma formatidir.
Rastgele cümleler yerine belirli kalıplar kullanılır.

## 5.1. EARS Syntax Kuralları

EARS beş temel kalıp tanımlar. Bu projede en sık kullanılan üçü şunlardır:

| Kalıp | Syntax | Kullanım Alanı |
|---|---|---|
| Event-Driven | `When [trigger], the system shall [response].` | Olay tetiklendiğinde beklenen davranış |
| State-Driven | `While [state], the system shall [behavior].` | Durum sürdüğü sürece beklenen davranış |
| Feature-Driven | `Where [feature], the system shall [behavior].` | Özellik varlığında beklenen davranış |

Örnekler:

```
When the user submits the login form with valid credentials,
the system shall navigate to the dashboard screen within 2 seconds.

While the network connection is offline,
the system shall display cached data with a visible offline indicator.

Where dark mode is enabled,
the system shall apply semantic dark color tokens from DESIGN.md.
```

EARS ayrıca "If-Then" (koşullu) ve "Ubiquitous" (her durumda geçerli) kalıplarını da tanımlar.
Bunlar gerektiğinde kullanılabilir, ancak yukarıdaki üç kalıp projenin birincil formatıdır.

## 5.2. SPEC-Boilerplate Eşleşmesi

Her SPEC dokümanı, ilgili boilerplate dokümanlarına referans içermelidir.

Kurallar:

1. SPEC'te kullanılan her teknik karar, ilgili boilerplate dokümanına referansla desteklenmelidir.
2. Canonical stack constraint'leri SPEC'te kısıtlama olarak açıkça belirtilmelidir. Örneğin: "Bu özellik Tamagui ile implement edilecektir (ADR-007)."
3. SPEC, boilerplate'in canonical kararlarıyla çelişemez. Çelişki tespit edilirse SPEC revize edilir, canonical karar değiştirilmez (canonical kararın değişmesi için ADR süreci gerekir).

## 5.3. SPEC Kalite Kriterleri

Bir SPEC dokümanının kabul edilebilir sayılması için şu kriterlerin tamamı karşılanmalıdır:

**Ölçülebilirlik:** Her kabul kriteri ölçülebilir olmalıdır.
- Zayıf: "Sayfa hızlı yüklenmeli."
- Kabul edilebilir: "Sayfa ilk yüklemede 2 saniyenin altında LCP değerine ulaşmalı."

**Test Türetilebilirliği:** Her kabul kriterinden en az bir test senaryosu türetilebilir olmalıdır.
- Zayıf: "Kullanıcı deneyimi iyi olmalı."
- Kabul edilebilir: "When the user taps the submit button, the system shall display a loading indicator within 100ms."

**Canonical Uyumluluk:** SPEC'teki hiçbir gereksinim canonical kararlarla çelişmemelidir.
Kontrol: ADR uyumu, `06` mimari tutarlılık, `23` component kuralları, `12` a11y minimumları.

**Bağımsızlık:** Bir SPEC kendi başına anlaşılabilir olmalıdır. Bağımlılık varsa açıkça belirtilmelidir.

---

# 6. Stitch Talimat Formatı

Stitch, design-to-code pipeline'ının tasarım aracıdır.
Stitch'e verilen talimatlar da belirli bir formatta olmalıdır.

## 6.1. Ekran Tanımı Şablonu

Stitch'te yeni bir ekran tasarlarken şu bilgiler talimat olarak verilmelidir:

```
Ekran Adı: [ekran adı]
Amaç: [ekranın kullanıcı için ne iş gördüğü]
Kullanıcı Akışı: [kullanıcı bu ekrana nasıl gelir, ne yapar, nereye gider]
Platform Hedefi: [web | mobil | her ikisi]
Mevcut DESIGN.md Referansı: [varsa hangi bölüm]
Accessibility Gereksinimleri: [minimum a11y beklentileri]
İlgili Boilerplate Dokümanları: [referans numaraları]
```

Bu şablon, Stitch'in tutarlı ve boilerplate-uyumlu tasarımlar üretmesi için gereken minimum bağlamı sağlar.

## 6.2. Component Tanımı Şablonu

Stitch'te tek bir component tasarlanırken:

```
Component Adı: [component adı]
Amacı: [ne işe yarar]
Varyantları: [kaç varyant, hangi durumlar]
Platform: [web | mobil | her ikisi]
Token Beklentisi: [hangi token katmanından beslenecek]
Mevcut DESIGN.md Referansı: [varsa]
Erişilebilirlik: [role, label, focus yönetimi beklentisi]
```

## 6.3. Token Beklentisi

Stitch çıktısından hangi token katmanının türetileceği önceden belirlenmelidir:

| Token Katmanı | Açıklama | Örnek |
|---|---|---|
| Primitive | Ham değerler (renk hex, font size px) | `#1A73E8`, `16px` |
| Semantic | Anlam taşıyan token (amaca bağlı) | `color.primary`, `spacing.md` |
| Component | Component'e özgü token | `button.background`, `card.border-radius` |

Stitch çıktısı önce primitive değerler üretir.
Bu değerlerin semantic ve component token'larına eşleştirilmesi `22-design-tokens-spec.md`'ye göre yapılır.

---

# 7. Adlandırma Kuralları

Talimat ve SPEC dosyalarının adlandırılması ve konumlandırılması sabit kurallara bağlıdır.
Rastgele isimlendirme ve rastgele konumlandırma kabul edilmez.

## 7.1. Dosya Adlandırma ve Konum Tablosu

| Dosya Türü | Format | Konum | Notlar |
|---|---|---|---|
| SPEC | `SPEC-{NNN}.md` | `.moai/specs/` | Sıralı, 3 basamak. Silinen numara tekrar kullanılmaz. |
| DESIGN.md | `DESIGN.md` | Proje kökü | Tek dosya. Yalnızca Stitch export'u olarak üretilir. |
| CLAUDE.md | `CLAUDE.md` | Proje kökü | Tek dosya. Global `~/.claude/CLAUDE.md` ayrı katmandır. |
| AGENTS.md (kök) | `AGENTS.md` | Proje kökü | Zorunlu. |
| AGENTS.md (dizin) | `AGENTS.md` | `{dizin}/` | Koşullu. Kök AGENTS.md ile asla çelişmez. |
| Stitch export | `{tarih}-{ekran-adı}/` | `tooling/ai/stitch/exports/` | Tarih: `YYYY-MM-DD`, ekran adı: kebab-case. |
| MoAI-ADK config | `quality.yaml`, `agent.yaml` | `.moai/config/` | Git'te tutulur. |

## 7.2. Ek Kurallar

- SPEC dosyası `.moai/specs/` dışında oluşturulmaz.
- Dizin-spesifik DESIGN.md dosyası oluşturulmaz.
- Stitch export dizinleri export edilen tasarım dosyalarını, DESIGN.md bölümünü ve varsa referans görselleri barındırır.

---

# 8. Versiyon Yönetimi

Talimat dosyaları yazılım kodu gibi versiyonlanır.
Git dışında talimat dosyası tutulmaz.

## 8.1. Genel Kurallar

1. **Tüm talimat dosyaları git'te yaşar.** İstisna yoktur. Lokal-only veya paylaşılmayan talimat dosyası kabul edilmez.
2. **CLAUDE.md ve AGENTS.md değişiklikleri PR review kapsamındadır.** Bu dosyaların değişiklikleri, kod değişikliği gibi review sürecinden geçer.
3. **`.moai/specs/` altındaki SPEC dokümanları commit edilir.** SPEC'ler de versiyonlanan dokümanlardır.
4. **DESIGN.md değişiklikleri Stitch export tarihiyle etiketlenir.** Commit mesajında export tarihi belirtilmelidir.

## 8.2. Değişiklik Sınıflandırması

| Değişiklik Türü | Review Gereksinimi | Örnek |
|---|---|---|
| CLAUDE.md çekirdek değişikliği | En az 1 reviewer | Canonical karar ekleme/çıkarma |
| CLAUDE.md referans indexi | Standard PR review | Yeni doküman referansı ekleme |
| AGENTS.md kural değişikliği | En az 1 reviewer | Review guideline güncelleme |
| Yeni SPEC ekleme | Standard PR review | SPEC-015.md oluşturma |
| SPEC revizyon | Standard PR review | Kabul kriteri güncelleme |
| DESIGN.md güncelleme | Standard PR review + tarih etiketi | Stitch re-export |
| .moai/config/ değişikliği | Standard PR review | quality.yaml modu değiştirme |

## 8.3. Commit Mesajı Kuralı

Talimat dosyası değişikliklerinin commit mesajlarında değişikliğin kapsamı belirtilmelidir.

Örnekler:
- `CLAUDE.md: canonical kararlar listesi güncellendi (ADR-012 eklendi)`
- `AGENTS.md: testing requirements bölümü eklendi`
- `SPEC-015 eklendi: kullanıcı profil ekranı`
- `DESIGN.md: 2026-04-01 Stitch export'u ile güncellendi`

---

# 9. Anti-pattern'ler

Aşağıdaki davranışlar bu standart kapsamında zayıf kabul edilir.
Review sırasında tespit edilmeli ve düzeltilmelidir.

**Talimat Hazırlık:**
1. **SPEC olmadan MoAI-ADK ile karmaşık iş başlatmak.** SPEC yoksa AI yönlendirilmemiş üretim yapar.
2. **DESIGN.md olmadan Stitch çıktısını projeye almak.** Token eşleştirmesi yapılamaz, tutarsızlık oluşur.
3. **AGENTS.md olmadan Codex review'a güvenmek.** Kural yoksa review yüzeysel kalır.
4. **AI çıktısını review/test olmadan merge etmek.** Hiçbir AI çıktısı doğrudan merge edilmez.

**Context Yönetimi:**
5. **CLAUDE.md'yi 500 satır sınırının üzerine şişirmek.** Referans indexi kullanılmalıdır.
6. **Birden fazla SPEC'i aynı anda context'e yüklemek.** Odak dağılır, cross-reference hataları artar.
7. **Stitch MCP'yi her oturumda varsayılan olarak açık tutmak.** Gereksiz context ve performans maliyeti.
8. **DESIGN.md'nin tamamını context'e yüklemek.** Yalnızca aktif alan subset'i yüklenmelidir.

**Kalite:**
9. **AI aracına canonical kararları sorgulatmak.** Canonical kararlar ADR ile sabitlenmiştir; tartışılmaz.
10. **Talimat dosyalarını git dışında tutmak.** Lokal notlar, Slack'te kalan talimatlar kayıp bilgidir.
11. **Farklı talimat dosyalarında çelişen kurallar bırakmak.** Çelişkide üst otorite dokümanı kazanır (`40-ai-workflow-and-tooling.md`).
12. **Her küçük iş için tam pipeline zorunlu kılmak.** Orantılılık prensibi geçerlidir (`40-ai-workflow-and-tooling.md` eşik tablosu).

**Güvenlik:**
13. **AI aracına `.env`, secret veya credential dosyalarını okutmak.** Bu dosyalar AI erişim alanı dışındadır.
14. **Tek araca kilitlenmek.** Yedekleme stratejisi bilinmeli. Çalışamayan araç governance'ı kıramaz.

---

# 10. Onay Kriterleri

Bir talimat dosyasının veya SPEC dokümanının kabul edilebilir sayılması için aşağıdaki kriterlerin karşılanması gerekir.

## 10.1. CLAUDE.md Onay Kriterleri

- [ ] 500 satır sınırına uyuyor mu?
- [ ] Çekirdek katman (canonical kararlar, dosya organizasyonu, dil kuralları) mevcut mu?
- [ ] Referans indexi güncel mi?
- [ ] Koşullu bölümler açıkça işaretlenmiş mi?
- [ ] Başka bir talimat dosyasıyla çelişen kural var mı?

## 10.2. AGENTS.md Onay Kriterleri

- [ ] Review guidelines bölümü mevcut mu?
- [ ] Architecture rules bölümü mevcut mu?
- [ ] Testing requirements bölümü mevcut mu?
- [ ] Kök AGENTS.md ile çelişen kural var mı? (dizin-spesifik dosyalar için)
- [ ] Canonical kararlarla uyumlu mu?

## 10.3. SPEC Onay Kriterleri

- [ ] EARS formatına uygun mu?
- [ ] Her kabul kriteri ölçülebilir mi?
- [ ] Her kabul kriterinden test senaryosu türetilebilir mi?
- [ ] Canonical kararlarla çelişme var mı?
- [ ] İlgili boilerplate dokümanlarına referans içeriyor mu?
- [ ] Bağımlı olduğu diğer SPEC'ler açıkça belirtilmiş mi?
- [ ] Dosya adı `SPEC-{NNN}.md` formatında mı?
- [ ] `.moai/specs/` dizininde mi?

## 10.4. DESIGN.md Onay Kriterleri

- [ ] Stitch export'u olarak üretilmiş mi (elle düzenlenmemiş mi)?
- [ ] `22-design-tokens-spec.md` ile token eşleşmesi sağlanmış mı?
- [ ] Export tarihi commit mesajında belirtilmiş mi?

## 10.5. Tüm Dosyalar İçin Genel Kriterler

- [ ] Dosya git'te mi?
- [ ] Adlandırma kurallarına uyuyor mu? Doğru konumda mı?
- [ ] PR review'dan geçmiş mi?

---

# 11. Sonuç

AI araçları bu projede üretim kapasitesini artıran güçlü yardımcılardır.
Ama bu araçların kaliteli çıktı üretmesi, onlara verilen talimatların kalitesiyle doğru orantılıdır.

Bu doküman şu temel prensibi sabitler:

> Talimat dosyaları da doküman gibi yazılır, review edilir, versiyonlanır ve bakımı yapılır.

Context bütçesi yönetilir, dosya anatomileri tanımlıdır, SPEC'ler EARS formatına uyar, adlandırma kuralları sabittir, anti-pattern'ler bilinir.

Bu standartlara uyum, AI çıktı kalitesinin sürdürülebilirliğinin ön koşuludur.
Governance olmadan talimat kalitesi zamanla bozulur; bozulan talimat kalitesi AI çıktı kalitesini bozar.
Bu döngüyü kırmak için talimatlar da governance kapsamındadır.
