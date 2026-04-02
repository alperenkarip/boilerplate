# 40-ai-workflow-and-tooling.md

## Doküman Kimliği

- **Doküman adı:** AI Workflow and Tooling
- **Dosya adı:** `40-ai-workflow-and-tooling.md`
- **Doküman türü:** Operational standard / AI tooling governance / workflow definition document
- **Durum:** Accepted
- **Tarih:** 2026-04-01
- **Kapsam:** AI araçlarının (Claude Code, MoAI-ADK, Codex CLI, Google Stitch) boilerplate geliştirme sürecindeki rollerini, etkileşim modellerini, talimat dosyalarının otorite sırasını, güvenlik kurallarını, araç bağımsızlık ilkesini ve operasyonel workflow'u tanımlar.
- **Bağlı olduğu üst dokümanlar:**
  - `16-tooling-and-governance.md`
  - `15-quality-gates-and-ci-rules.md`
  - `01-working-principles.md`
- **Doğrudan etkileyeceği dokümanlar:**
  - `41-ai-instruction-standards.md`
  - `46-stitch-pipeline-spec.md`
  - `21-repo-structure-spec.md`
  - `30-contribution-guide.md`
  - `32-definition-of-done.md`
  - `35-document-map.md`

---

# 1. Amaç

Bu doküman, boilerplate geliştirme sürecinde kullanılan AI araçlarının rollerini, birbirleriyle etkileşim protokollerini, talimat dosyalarının otorite hiyerarşisini, güvenlik kurallarını ve operasyonel workflow'u tek bir noktadan tanımlar.

Bu belge şu sorulara net cevap verir:

1. Hangi AI araçları bu projede kullanılır ve neden?
2. Bu araçlar birbirleriyle nasıl etkileşir?
3. Talimat dosyalarının otorite sırası nedir?
4. AI çıktısı hangi kalite kurallarından geçer?
5. Bir araç kullanılamaz hale gelirse ne olur?
6. Görev karmaşıklığına göre hangi araçlar zorunlu, hangileri opsiyonel?
7. AI araçlarına gönderilen veri nasıl korunur?

`16-tooling-and-governance.md` araçlardan bağımsız bir governance çerçevesi çizer. Bu doküman ise o çerçevenin AI araçlarına somut uygulamasıdır. 16'daki ilkeleri tekrar etmez; onların AI operasyonlarına nasıl yansıdığını tanımlar.

---

# 2. Temel Tez

> AI araçları boilerplate geliştirme sürecinin merkezi aktörleridir; documentation-first ilkesi bu araçların talimat, konfigürasyon ve çıktılarını da kapsar. Ancak araçlar boilerplate'in değerini taşımaz; doküman seti taşır. Araçlar değişebilir, dokümanlar kalır.

Bu tez şu sonuçları doğurur:

1. AI araçları boilerplate dokümanlarına tabidir; boilerplate dokümanları AI araçlarına tabi değildir.
2. Hiçbir AI aracı canonical kararları sorgulayamaz veya geçersiz kılamaz.
3. Bir aracın çıktısı, insan review'ı ve kalite kapısı geçmeden üretim koduna giremez.
4. Talimat dosyaları (CLAUDE.md, AGENTS.md, .moai/config/, DESIGN.md) boilerplate dokümanlarının türevidir; alternatifi değildir.
5. Araç değişse bile süreç devam edebilmelidir; bu nedenle her araç için insani fallback yolu tanımlanmıştır.
6. Documentation-first ilkesi AI çıktıları için de geçerlidir: AI'ın ürettiği her değişiklik izlenebilir, review edilebilir ve geri alınabilir olmalıdır.

---

# 3. Otorite Hiyerarşisi ve Çelişki Çözümü

## 3.1. Talimat Dosyalarının Otorite Sırası

Talimat dosyaları (CLAUDE.md, AGENTS.md, .moai/config/, DESIGN.md) `35-document-map.md`'deki 7. katmanın (denetim ve tamamlanma) altındadır. Bu, tüm talimat dosyalarının boilerplate doküman setine tabi olduğu anlamına gelir.

Otorite sırası yukarıdan aşağıya:

```
Katman 1: Boilerplate doküman seti (00–39)
Katman 2: ADR kararları (ADR-001 → ADR-019) + canonical governance karar belgeleri (`36-canonical-stack-decision.md`, `37-dependency-policy.md`, `38-version-compatibility-matrix.md`)
Katman 3: Talimat dosyaları (CLAUDE.md, AGENTS.md, .moai/config/, DESIGN.md)
Katman 4: AI aracının runtime davranışı
```

Hiçbir talimat dosyası boilerplate dokümanını geçersiz kılamaz.
Hiçbir AI aracının runtime kararı talimat dosyasını geçersiz kılamaz.

## 3.2. Çelişki Çözüm Kuralları

Çelişki durumunda üst katman her zaman kazanır. Somut kurallar:

| Çelişki | Çözüm |
|---------|-------|
| Talimat dosyası ↔ Boilerplate dokümanı | Talimat dosyası güncellenir. |
| Codex bulgusu ↔ Claude Code önerisi | Boilerplate dokümanı hakemdir. |
| DESIGN.md ↔ `22-design-tokens-spec.md` | 22 kazanır; DESIGN.md Stitch'te yeniden export edilir. |
| MoAI-ADK SPEC ↔ Boilerplate dokümanı | Boilerplate dokümanı kazanır; SPEC güncellenir. |
| İki AI aracının aynı konudaki çelişen önerileri | Boilerplate dokümanı hakemdir; geliştirici karar verir. |

## 3.3. DESIGN.md Statüsü

DESIGN.md, `22-design-tokens-spec.md`'nin türevidir, alternatifi değildir. Stitch'in ürettiği DESIGN.md dosyası yalnızca 22'deki token tanımlarını yansıtmalıdır. İki dosya arasında uyumsuzluk tespit edilirse 22 kazanır ve DESIGN.md Stitch'te yeniden export edilir. DESIGN.md bu arşivin zorunlu fiziksel parçası değildir; Stitch pipeline'ı kullanılan derived project'lerde oluşan veya güncellenen çıktı olarak değerlendirilir.

---

# 4. Araç Envanteri ve Rol Tanımları

Bu projede dört AI aracı kullanılır. Her aracın net bir rolü, talimat sistemi ve sınırları vardır.

## 4.1. Claude Code — Merkezi Geliştirme Motoru

**Sağlayıcı:** Anthropic (Opus 4.6)
**Çalışma ortamı:** Terminal, IDE, masaüstü, web

**Talimat sistemi:**
- `CLAUDE.md` — proje kökünde, her oturumda otomatik okunur. Projenin operasyonel anayasası görevi görür: mimari kararlar, kodlama standartları, build komutları, canonical stack referansları burada tanımlıdır.
- `.claude/` dizini — hooks, settings.json, komut tanımları ve agent konfigürasyonu barındırır.

**Entegrasyon katmanları:**

| Katman | Açıklama |
|--------|----------|
| MCP (Model Context Protocol) | Dış veri kaynaklarına bağlanma standardı. Stitch MCP, GitHub, Jira, Slack ve özel araçlarla bağlantı kurar. |
| Agent Teams | Multi-agent orchestrator. Bir oturum "team lead" olarak diğer instance'ları koordine eder. Deneysel. |
| Hooks | Pre/post tool call hook'ları ile otomatik davranışlar: format kontrolü, lint tetikleme, dosya izleme. |
| Skills | Slash command sistemi ile özel yetenekler. Örnek: `stitch-to-react` skill'i. |

**Bu boilerplate için rolü:** Ana geliştirme motoru. Tüm diğer araçların çıktısını koda dönüştüren merkezi ajan. Feature geliştirme, bug fix, refactoring, component üretimi, doküman güncelleme — tüm kodlama işleri Claude Code üzerinden yürür.

**Sınırları:**
- Canonical kararları (ADR-001 → ADR-019) sorgulamaz; yalnızca uygular.
- Çıktısı review ve test geçmeden merge edilmez.
- `.env`, credential ve secret dosyalarını okumaz (`.claudeignore` ile zorunlu kılınır).

## 4.2. MoAI-ADK — SPEC Üretimi ve Orkestrasyon

**Sağlayıcı:** modu-ai (Agentic Development Kit)
**Çalışma ortamı:** Claude Code içinden slash command'larla

**Temel felsefe — Harness Engineering:**
Mühendis kod yazmak yerine SPEC, quality gate ve feedback loop tasarlar. AI, yapılandırılmış talimatlarla çalışır; serbest biçimde değil.

**SPEC-First yaklaşım — EARS formatı:**
EARS (Easy Approach to Requirements Syntax) ile belirsiz olmayan spesifikasyonlar üretir. Her SPEC: gereksinim tanımı, başarı kriterleri ve test senaryoları içerir. Karmaşıklık skoru >= 5 olan görevlerde SPEC üretimi zorunludur.

**Dizin yapısı:**

```
.moai/
├─ config/          # Section-based YAML konfigürasyon (v0.37.0+)
│  └─ sections/
│     └─ quality.yaml   # development_mode: tdd|ddd
├─ memory/          # Ajan hafızası
├─ specs/           # SPEC dokümanları (SPEC-001, SPEC-002...)
└─ docs/            # Otomatik üretilen dokümanlar
```

**Slash command'lar (Claude Code içinden):**

| Komut | İşlev |
|-------|-------|
| `/moai plan` | SPEC dokümanı oluştur (EARS formatında) |
| `/moai run <SPEC-ID>` | SPEC'i DDD/TDD ile implement et |
| `/moai sync <SPEC-ID>` | Dokümanları senkronize et, PR hazırla |
| `/moai fix` | Tek geçiş: tara → sınıfla → düzelt → doğrula |
| `/moai loop` | İteratif düzeltme (maks 100 iterasyon) |
| `/moai project` | Proje dokümanları üret |
| `/moai feedback` | GitHub issue oluştur |

**Kalite framework'ü — TRUST 5:**

| Kısaltma | İlke | Açıklama |
|----------|------|----------|
| **T** | Test-First | Test önce yazılır |
| **R** | Readable | Okunabilir kod |
| **U** | Unified | Tutarlı stil |
| **S** | Secured | Güvenli kod |
| **T** | Trackable | İzlenebilir değişiklikler |

**Metodoloji seçimi:**
- Yeni projeler → TDD (RED → GREEN → REFACTOR)
- Mevcut projeler (düşük test coverage) → DDD (ANALYZE → PRESERVE → IMPROVE)
- `moai init --mode <ddd|tdd>` ile seçilir.

**Bu boilerplate için rolü:** Specification üretimi ve modüler geliştirme orkestratörü. Boilerplate spec'lerini EARS formatına çevirerek Claude Code'a yapılandırılmış talimat sağlar.

**Sınırları:**
- MoAI-ADK aktifken Agent Teams kullanılmaz (tek orkestratör kuralı).
- `.moai/memory/` dizini `.gitignore`'da olmalıdır.
- SPEC'ler boilerplate dokümanlarını geçersiz kılamaz.

## 4.3. Codex CLI — Bağımsız Denetim

**Sağlayıcı:** OpenAI (GPT-5.3-Codex)
**Çalışma ortamı:** Terminal, GitHub entegrasyonu

**Talimat sistemi — AGENTS.md:**
- CLAUDE.md'nin Codex karşılığıdır. Proje kökünde ve alt dizinlerde yerleştirilebilir.
- Codex her iş öncesi AGENTS.md dosyalarını okur.
- Hiyerarşik: dizin ağacı boyunca en yakın AGENTS.md uygulanır.
- Fallback dosya adları yapılandırılabilir: `project_doc_fallback_filenames` (config.toml)

**Review sistemi:**

| Yöntem | Açıklama |
|--------|----------|
| `@codex review` | PR yorumuna yazılır; Codex standart GitHub code review döndürür. |
| Otomatik review | Ayarlardan etkinleştirilince her yeni PR'da otomatik çalışır. |
| Review kuralları | AGENTS.md içinde `## Review guidelines` bölümü ile repo-spesifik kurallar tanımlanır. |
| Öncelik filtreleme | GitHub'da yalnızca P0 ve P1 sorunları işaretlenir. |

**Sandbox modları:**

| Mod | Kullanım |
|-----|----------|
| Read Only (`-s read-only`) | Audit ve denetim — kod değişikliği yapmaz |
| Auto (varsayılan) | Günlük geliştirme |
| Full Auto (`--full-auto`) | Tam otomasyon — dikkatli kullanılmalı |

**Bu boilerplate için rolü:** Kod denetimi ve kalite doğrulaması. Claude Code'un ürettiği kodu bağımsız ajan olarak review eder. Read-only modda audit yapar. Bağımsızlık kritiktir: aynı şirketin aracı hem üretip hem denetlememesi için ayrı vendor tercih edilmiştir.

**Sınırları:**
- AGENTS.md olmadan review güvenilir değildir.
- Yanlış pozitif verirse boilerplate dokümanı hakem olarak kullanılır.
- Review sonuçları tek başına merge kararı oluşturmaz; insan onayı gereklidir.

## 4.4. Google Stitch — Arayüz Tasarımı ve Token Üretimi

**Sağlayıcı:** Google Labs (Gemini 3.1)
**Çalışma ortamı:** Web (stitch.withgoogle.com)
**Durum:** Labs aşaması, ücretsiz

**DESIGN.md:**
Stitch'in ürettiği tasarım sistemi dosyasıdır. İçeriği:
- Renk tanımları: palet, roller, semantic token'lar (primary, surface, accent)
- Tipografi: font aileleri, boyutlar, ağırlıklar, satır yükseklikleri, mapping (heading-1, body, caption)
- Spacing ve layout kuralları: spacing scale, grid, radius, shadow
- Component pattern'leri

Mevcut design token'lar yüklenebilir; Stitch bunları her üretimde uygular.

**Çıktı formatları:**
- HTML/CSS (semantic, temiz)
- Tailwind CSS — canonical stack'teki Tailwind CSS 4.x (ADR-007) ile uyumlu
- React/JSX — reusable component yapısı

**MCP entegrasyonu — Stitch MCP:**

```json
{
  "mcpServers": {
    "stitch": {
      "command": "npx",
      "args": ["@_davideast/stitch-mcp", "proxy"]
    }
  }
}
```

**MCP araçları:**

| Araç | İşlev |
|------|-------|
| `extract_design_context` | Ekranları tarar, Design DNA çıkarır |
| `fetch_screen_code` | HTML/Frontend kodu indirir |
| `fetch_screen_image` | Screenshot indirir |
| `generate_screen_from_text` | Prompt'tan yeni ekran üretir |

**stitch-to-react skill (Claude Code içinde):**

```bash
npx skills add google-labs-code/stitch-skills --skill react:components --global
```

- Stitch HTML/PNG export'larını yapılandırılmış React component'lere dönüştürür.
- Görsel token'ları design system değişkenlerine map'ler.
- JSX/TSX + scoped styling çıktısı üretir.

**Bu boilerplate için rolü:** Arayüz tasarımı ve tema token sistemi üretimi. DESIGN.md üzerinden Claude Code'a tasarım context'i sağlar. Stitch MCP ile canlı tasarım verisi çekilir. Tailwind CSS 4.x (ADR-007) ve NativeWind 5.x candidate track ile uyumlu çıktı üretir; bootstrap öncesi release-status kontrolü zorunludur.

**Sınırları:**
- DESIGN.md, `22-design-tokens-spec.md`'nin türevidir; uyumsuzluk durumunda 22 kazanır.
- Stitch'e yüklenen tasarımlarda gerçek kullanıcı verisi kullanılmaz.
- Labs ürünü olduğu için kararlılık garantisi yoktur; fallback planı (bölüm 11) uygulanır.

---

# 5. Araçlar Arası Etkileşim Modeli

AI araçları birbirinden bağımsız çalışmaz. Tanımlı etkileşim noktaları ve veri akış yönleri vardır.

## 5.1. MoAI-ADK → Claude Code: SPEC-to-Implementation

Bu en sık kullanılan etkileşim hattıdır. Akış:

```
/moai plan → SPEC üret (EARS formatı)
     ↓
/moai run <SPEC-ID> → Claude Code implement eder (TDD veya DDD)
     ↓
/moai sync → doküman senkronizasyonu + PR hazırla
```

**Bağlantı mekanizması:** Claude Code'un native slash command sistemi. MoAI-ADK, Claude Code'a yapılandırılmış talimat gönderir; Claude Code bu talimatları uygular.

**Veri akışı:** `.moai/specs/<SPEC-ID>.md` → Claude Code'un context'i → implementation → PR

## 5.2. Google Stitch → Claude Code: Design-to-Code

Arayüz tasarımı akışı:

```
Stitch'te tasarım oluştur (doğal dil veya görsel girdi)
     ↓
DESIGN.md export et
     ↓
Stitch MCP ile canlı tasarım verisi çek
     ↓
stitch-to-react skill ile component üret
```

**Bağlantı mekanizması:** MCP protokolü + skill sistemi. Claude Code, Stitch MCP üzerinden canlı tasarım verisine erişir ve `stitch-to-react` skill'i ile React component'lere dönüştürür.

**Veri akışı:** Stitch canvas → DESIGN.md → MCP → Claude Code → React component

## 5.3. Claude Code → Codex: Implementation-to-Review

Kod üretimi sonrası denetim akışı:

```
Claude Code ile kod yaz → commit → PR aç
     ↓
@codex review veya otomatik review tetiklenir
     ↓
Codex bulguları → düzeltme döngüsü
     ↓
İnsan onayı → merge
```

**Bağlantı mekanizması:** Git/GitHub üzerinden dolaylı. İki araç birbirini doğrudan çağırmaz; PR üzerinden etkileşir.

**Veri akışı:** Claude Code → Git commit → PR → Codex review → düzeltme → merge

## 5.4. Tam Pipeline: Stitch → Claude Code → Codex

Yeni bir ekran veya component için tam pipeline:

```
1. Stitch'te tasarım oluştur
2. DESIGN.md export et
3. /moai plan ile SPEC üret (gerekiyorsa)
4. Claude Code ile component üret (stitch-to-react + SPEC)
5. PR aç
6. @codex review
7. İnsan onayı + merge
```

Bu pipeline her görev için zorunlu değildir. Bölüm 7'deki eşik tablosu, hangi görevde hangi adımların zorunlu olduğunu tanımlar.

## 5.5. Çakışma Kuralı — Tek Orkestratör

Aynı anda tek orkestratör aktif olur:
- MoAI-ADK aktifken Agent Teams kullanılmaz.
- Agent Teams aktifken MoAI-ADK slash command'ları kullanılmaz.

Bu kural, iki orkestratörün çelişen talimatlar üretmesini önler. Aynı oturumda orkestratör değiştirmek için mevcut orkestratörün işi tamamlanmalı veya bilinçli olarak sonlandırılmalıdır.

---

# 6. Görev Karmaşıklığına Göre Araç Kullanım Eşiği

Solo geliştirici veya küçük ekip sürdürülebilirliği için her görevde her aracı kullanmak gerekmez. Aşağıdaki tablo, görev türüne göre hangi aracın zorunlu, önerilen veya opsiyonel olduğunu tanımlar.

## 6.1. Eşik Tablosu

| Görev Türü | SPEC (MoAI-ADK) | Stitch | Codex Review |
|------------|------------------|--------|--------------|
| Bug fix (1–2 dosya) | — | — | Önerilen |
| Küçük UI düzeltme | — | — | Önerilen |
| Yeni utility / hook | — | — | Zorunlu |
| Yeni component | — | Önerilen | Zorunlu |
| Yeni ekran | Zorunlu | Zorunlu | Zorunlu |
| Yeni feature modülü | Zorunlu | İhtiyaca göre | Zorunlu |
| Mimari değişiklik | Zorunlu | — | Zorunlu |
| Design system güncelleme | — | Zorunlu | Zorunlu |

**Tablonun okunması:**
- "Zorunlu" → bu adım atlanamaz. Atlanırsa PR merge edilmez.
- "Önerilen" → atlayabilirsin ama gerekçeni PR açıklamasında belirt.
- "—" → bu görev türü için gereksiz; kullanılmaması beklenir.
- "İhtiyaca göre" → görsel bileşen içeriyorsa kullan, içermiyorsa kullanma.

## 6.2. Codex Review Kademeli Tetikleme

Codex review her PR'da otomatik çalışmak zorunda değildir. Kademeli tetikleme:

| Tetikleme | Koşul |
|-----------|-------|
| Otomatik | `packages/` altındaki değişikliklerde (shared kod) |
| Otomatik | 50+ satır değişiklikte |
| Manuel | Bug fix, docs, config değişikliklerinde — isteğe bağlı |

Bu kademeli yapı, API maliyetini kontrol altında tutar ve gereksiz review döngülerini önler.

## 6.3. Karmaşıklık Skoru ve SPEC Zorunluluğu

MoAI-ADK'nın karmaşıklık skoru >= 5 olan görevlerde SPEC üretimi zorunludur. Skor belirleme kriterleri:
- Birden fazla modülü etkileyen değişiklikler
- Yeni API endpoint veya veri modeli gerektiren işler
- State yönetimi değişiklikleri (Zustand store güncellemesi — ADR-004)
- Navigasyon yapısı değişiklikleri (React Router 7.x / React Navigation 7.x — ADR-012)
- Birden fazla platform (web + mobil) etkileyen değişiklikler

---

# 7. Görev Bazlı Araç Seçimi (Workflow)

Farklı görev türleri için hangi araçların hangi sırayla kullanılacağını tanımlar.

## 7.1. Yeni Feature Geliştirme

```
1. /moai plan → SPEC üret (EARS formatında)
2. SPEC review → geliştirici onayı
3. /moai run <SPEC-ID> → Claude Code implement eder
4. Test yaz ve çalıştır (Vitest 4.x / Jest 30.x — ADR-008)
5. PR aç
6. @codex review
7. İnsan review + merge
```

## 7.2. Yeni Ekran / Component Tasarımı

```
1. Stitch'te tasarım oluştur
2. DESIGN.md export et → 22-design-tokens-spec.md ile tutarlılık doğrula
3. stitch-to-react skill ile React component üret
4. Component'i Tailwind CSS 4.x (ADR-007) ile style et
5. Test yaz (Testing Library — ADR-008)
6. PR aç
7. @codex review
8. İnsan review + merge
```

## 7.3. Bug Fix

```
1. Claude Code ile doğrudan düzelt
2. İlgili test'i güncelle veya yeni test ekle
3. PR aç
4. @codex review (önerilen — zorunlu değil)
5. İnsan review + merge
```

## 7.4. Refactoring

```
1. /moai plan → etki analizi
2. /moai run → refactoring implement et
3. /moai sync → doküman senkronizasyonu
4. Mevcut test'lerin geçtiğini doğrula
5. PR aç
6. @codex review
7. İnsan review + merge
```

## 7.5. Design System Güncelleme

```
1. Stitch'te DESIGN.md güncelle
2. 22-design-tokens-spec.md ile tutarlılık doğrula
3. Claude Code ile token sync (packages/design-tokens/)
4. Etkilenen component'leri güncelle
5. Görsel regresyon testi (Playwright 1.58.x — ADR-008)
6. PR aç
7. @codex review
8. İnsan review + merge
```

## 7.6. Mimari Değişiklik

```
1. İlgili ADR güncelle veya yeni ADR yaz
2. /moai plan → etki analizi + SPEC
3. Boilerplate dokümanlarını güncelle
4. /moai run <SPEC-ID> → implement et
5. Tüm etkilenen test'leri güncelle
6. PR aç
7. @codex review
8. İnsan review + merge
```

---

# 8. Talimat Dosyaları Yönetimi

Talimat dosyaları AI araçlarının davranışını belirler. Bu dosyaların yönetimi, AI workflow'unun güvenilirliği için kritiktir.

## 8.1. Dosya-Araç Eşleştirmesi

| Dosya | Araç | Konum | Format |
|-------|------|-------|--------|
| `CLAUDE.md` | Claude Code | Proje kökü | Markdown |
| `AGENTS.md` | Codex CLI | Proje kökü + alt dizinler | Markdown |
| `.moai/config/` | MoAI-ADK | `.moai/config/sections/` | YAML |
| `DESIGN.md` | Stitch → Claude Code | Proje kökü | Markdown |

Her talimat dosyası yalnızca kendi aracını yönlendirir. Bir aracın talimat dosyasından diğer aracın davranışı tanımlanamaz.

## 8.2. Tutarlılık Kuralı

Tüm talimat dosyaları canonical karar katmanını (ADR-001 → ADR-019 + 36/37/38 canonical governance belgeleri) aynı biçimde yansıtmak zorundadır.

Örnek: ADR-007 Tailwind CSS 4.x kararı varsa:
- CLAUDE.md'de styling yönlendirmesi Tailwind CSS 4.x referansı içermelidir.
- AGENTS.md'de review kuralları Tailwind class naming convention'ını kontrol etmelidir.
- DESIGN.md Tailwind uyumlu token formatı kullanmalıdır.

Talimat dosyaları arasında canonical kararlar konusunda çelişki bulunamaz. Bulunursa çelişen dosya güncellenir.

## 8.3. Değişiklik Senkronizasyonu

Canonical katmanda (ADR veya boilerplate dokümanı) bir değişiklik yapıldığında:

1. Değişiklikten etkilenen talimat dosyaları belirlenir.
2. Her talimat dosyası güncellenir.
3. Güncelleme PR'ı açılır.
4. Codex review ile tutarlılık doğrulanır.

Bu senkronizasyon, `/moai sync` ile otomatikleştirilebilir. Manuel yapılması da kabul edilir; ancak atlanması kabul edilmez.

## 8.4. Talimat Dosyası Detayları

Talimat dosyalarının zorunlu bölümleri, format kuralları ve context bütçesi yönetimi `41-ai-instruction-standards.md`'de tanımlanır. Bu doküman yalnızca dosya-araç eşleştirmesini ve tutarlılık kurallarını belirler.

---

# 9. AI Araç Güvenlik Politikası

AI araçları dış servislere veri gönderir. Bu verilerin güvenliği proje güvenliğinin parçasıdır.

## 9.1. Context Güvenliği

AI aracının context'ine (oturum hafızası, prompt, dosya okuma) şu dosyalar girmemelidir:

- `.env` dosyaları (tüm ortamlar)
- `credentials.json`, `serviceAccountKey.json` ve benzeri credential dosyaları
- Secret içeren konfigürasyon dosyaları
- Gerçek kullanıcı verisi içeren dosyalar (DB dump, CSV export vb.)

**Zorunlu koruma mekanizmaları:**

| Mekanizma | Araç | Dosya |
|-----------|------|-------|
| `.claudeignore` | Claude Code | Proje kökünde; sensitive path'ler burada tanımlanır |
| `.moai/memory/` → `.gitignore` | MoAI-ADK | Ajan hafızası git'e girmez |
| AGENTS.md `## Security` | Codex CLI | Review sırasında secret pattern taraması |

## 9.2. Veri Gönderim Kuralları

| Kural | Açıklama |
|-------|----------|
| Stitch'e gerçek veri yüklenmez | Tasarımlarda mock/placeholder veri kullanılır |
| Codex review'da secret taranır | AGENTS.md'de secret pattern regex tanımlanır |
| MCP bağlantıları şifreli olmalı | HTTPS/TLS zorunlu |
| Log dosyaları temizlenir | `~/.codex/log/` ve `.moai/memory/` periyodik temizlenir |

## 9.3. Üçüncü Parti Risk Bilinci

Bu projede dört farklı şirketin aracı kullanılmaktadır:

| Araç | Şirket | Veri İşleme |
|------|--------|-------------|
| Claude Code | Anthropic | Prompt + dosya içeriği API'ye gider |
| MoAI-ADK | modu-ai | Yerel çalışır; dış API'ye gitmez (Claude Code üzerinden gider) |
| Codex CLI | OpenAI | Prompt + dosya içeriği API'ye gider |
| Google Stitch | Google | Tasarım verileri Google sunucularında işlenir |

Her aracın veri işleme politikası bilinmeli ve proje-spesifik compliance gereksinimleriyle uyumu doğrulanmalıdır.

## 9.4. `27-security-and-secrets-baseline.md` Referansı

AI araç güvenliği, `27-security-and-secrets-baseline.md`'deki secret yönetim kurallarının doğal uzantısıdır. 27'de tanımlanan secret rotation, environment isolation ve access control kuralları AI araçları için de geçerlidir.

HttpOnly cookie (web) ve Expo SecureStore (mobile) kimlik doğrulama stratejisi (ADR-010) AI araçlarının erişim kapsamını da belirler: AI araçları production auth token'larına erişemez.

---

# 10. Araç Bağımsızlık İlkesi ve Yedekleme Stratejisi

**Temel ilke:** AI araçları boilerplate'in değerini taşımaz; doküman seti taşır. Araçlar değişebilir, dokümanlar kalır.

Bu ilke şu anlamları taşır:
- Hiçbir araç, boilerplate doküman setini veya canonical kararları kendi formatına kilitleyemez.
- Her aracın kaybolması durumunda kalan varlık ve alternatif yol tanımlıdır.
- Araç bağımlılığı azaltmak için tüm konfigürasyon git'te tutulur.

## 10.1. Yedekleme Tablosu

| Araç | Kritiklik | Kaybolursa Kalan Varlık | Alternatif Yol |
|------|-----------|-------------------------|----------------|
| Claude Code | Yüksek | CLAUDE.md, `.claude/` dizini, tüm kod | Codex CLI, Cursor, başka agent |
| MoAI-ADK | Orta | `.moai/specs/` SPEC dokümanları | Manuel SPEC üretimi (41'deki EARS formatına göre) |
| Google Stitch | Düşük | DESIGN.md dosyası | Figma + manuel token export |
| Codex CLI | Orta | AGENTS.md dosyası | Claude Code review, manuel review |

## 10.2. Kurtarma Senaryoları

**Claude Code kullanılamaz hale gelirse:**
1. CLAUDE.md'deki kurallar başka bir AI agent'a (Codex CLI, Cursor vb.) aktarılır.
2. `.claude/` dizinindeki hook'lar ve skill'ler hedef aracın formatına dönüştürülür.
3. MCP bağlantıları hedef aracın desteklediği formata taşınır.
4. Geliştirme süreci minimum kesinti ile devam eder.

**MoAI-ADK kullanılamaz hale gelirse:**
1. Mevcut SPEC'ler `.moai/specs/` dizininde kalır.
2. Yeni SPEC'ler `41-ai-instruction-standards.md`'deki EARS formatına göre manuel yazılır.
3. Claude Code, SPEC dosyalarını doğrudan okuyarak implement etmeye devam eder.

**Google Stitch kullanılamaz hale gelirse:**
1. DESIGN.md mevcut halinde kalır.
2. Component üretimi Claude Code ile DESIGN.md referanslı olarak devam eder.
3. Yeni tasarımlar Figma veya benzeri araçta yapılır; token'lar manuel export edilir.

**Codex CLI kullanılamaz hale gelirse:**
1. AGENTS.md'deki review kuralları Claude Code'a veya başka bir review aracına aktarılır.
2. Review süreci insan review'ı ile devam eder.
3. `41-ai-instruction-standards.md`'deki kontrol listesi manuel uygulanır.

## 10.3. Vendor Lock-in Önleme

Araç bağımsızlığını korumak için:
- Talimat dosyaları araç-spesifik format kullanabilir ama canonical bilgi her zaman boilerplate dokümanlarında kalır.
- `.moai/specs/` içindeki SPEC'ler Markdown formatındadır; araç değişse okunabilir.
- DESIGN.md standart Markdown formatındadır; Stitch olmadan da kullanılabilir.
- AGENTS.md standart Markdown formatındadır; Codex olmadan da okunabilir.

---

# 11. Araç Versiyon Baseline

Her aracın minimum desteklenen versiyonu ve güncelleme politikası tanımlıdır.

| Araç | Baseline | Güncelleme Politikası |
|------|----------|----------------------|
| Claude Code | Opus 4.6 | CLAUDE.md uyumu doğrulanır; model değişikliği test döngüsü gerektirir |
| MoAI-ADK | v0.37.0+ | `moai update`; breaking change'de SPEC formatı doğrulanır |
| Stitch MCP | `@_davideast/stitch-mcp` | Semantic versioning izlenir |
| Codex CLI | Latest stable | AGENTS.md uyumu doğrulanır |

**Güncelleme kuralları:**
1. AI aracı güncellemesi yapıldığında ilgili talimat dosyasının uyumu test edilir.
2. Breaking change içeren güncellemeler PR ile yapılır; direkt güncelleme yapılmaz.
3. Versiyon pinleme mümkün olduğunda uygulanır (özellikle MoAI-ADK ve Stitch MCP için).

---

# 12. Bootstrap Sırası — moai init ve Boilerplate Uyumu

`moai init`, `.moai/` ve `.claude/` dizinlerini otomatik oluşturur. Boilerplate'in kendi CLAUDE.md ve `.claude/` konfigürasyonuyla çakışma riski vardır. Bu çakışmayı önlemek için bootstrap sırası sabittir.

## 12.1. Zorunlu Bootstrap Sırası

```
1. Boilerplate repo bootstrap (20-initial-implementation-checklist.md'ye göre)
     ↓
2. CLAUDE.md oluştur (boilerplate taslağından — 41'deki formata göre)
     ↓
3. moai init çalıştır — MEVCUT CLAUDE.md korunsun
     ↓
4. MoAI-ADK'nın ürettiği .claude/ içeriği mevcut konfigürasyonla MERGE edilmeli,
   üzerine yazılmamalı
     ↓
5. AGENTS.md oluştur (41'deki formata göre)
     ↓
6. Stitch MCP konfigürasyonu ayarla
     ↓
7. Tüm talimat dosyalarının tutarlılık kontrolü
```

## 12.2. Çakışma Önleme

`moai init` çalıştırıldığında:
- Eğer CLAUDE.md zaten varsa, MoAI-ADK mevcut dosyayı korumalıdır. Aksi durumda `moai init`'in çıktısı incelenmeli ve mevcut CLAUDE.md ile merge edilmelidir.
- `.claude/` dizininde çakışan dosyalar (hooks, settings.json) varsa mevcut dosyalar korunur; MoAI-ADK'nın dosyaları ayrı bir dizinde incelenir.
- Bootstrap sırası bozulursa: `git reset` ile geri al, sırayı baştan takip et.

---

# 13. CI/CD Entegrasyonu

AI araçları CI/CD pipeline'ına entegre edilerek otomasyon sağlanır.

## 13.1. Codex GitHub Action

PR açıldığında otomatik review çalıştırılır. Bu CI step'i:
- `15-quality-gates-and-ci-rules.md`'deki kalite kapılarına ek bir denetim katmanı ekler.
- Codex review sonucu blocker değildir; ancak P0/P1 bulguları insan tarafından değerlendirilmelidir.
- Kademeli tetikleme kuralları (bölüm 6.2) CI konfigürasyonunda uygulanır.

## 13.2. Talimat Dosyası Tutarlılık Kontrolü

CI'da çalışan bir script ile:
- CLAUDE.md'deki canonical kararlar listesi → ADR dosya adlarıyla karşılaştırılır.
- AGENTS.md'deki review kuralları → CLAUDE.md'deki kurallarla çelişme kontrolü yapılır.
- DESIGN.md'deki token tanımları → `packages/design-tokens/` ile tutarlılık kontrolü yapılır.

Bu kontrol, talimat dosyalarının zamanla boilerplate dokümanlarından sapmasını önler.

## 13.3. Token Doğrulaması

DESIGN.md → `packages/design-tokens/` tutarlılık kontrolü CI'da zorunlu olarak çalışır. `22-design-tokens-spec.md`'deki token tanımlarıyla DESIGN.md arasındaki uyumsuzluk build'i kırar.

---

# 14. Hata Senaryoları ve Fallback

AI araçları her zaman beklendiği gibi çalışmaz. Her kritik hata senaryosu için fallback tanımlıdır.

## 14.1. MoAI-ADK SPEC Üretemezse

**Fallback:** SPEC manuel yazılır. `41-ai-instruction-standards.md`'deki EARS formatı ve zorunlu bölümler referans alınır. SPEC'in olmadığı bir ortamda karmaşık iş başlatılmaz (bkz. anti-pattern 17.1).

## 14.2. Stitch MCP Bağlantısı Koparsa

**Fallback:** DESIGN.md mevcut halinde kalır. Component üretimi Claude Code ile DESIGN.md referanslı olarak devam eder. Yeni tasarım gerekiyorsa Stitch web arayüzünden manuel export yapılır ve DESIGN.md güncellenir.

## 14.3. Codex Review Yanlış Pozitif Verirse

**Fallback:** Boilerplate dokümanı hakem olarak kullanılır. Yanlış bulgu AGENTS.md'de exception olarak kayıt edilir. Exception kaydı şu bilgileri içerir:
- Yanlış pozitif açıklaması
- Hangi boilerplate dokümanı referans alındı
- Tarih
- Exception süresi (kalıcı mı, geçici mi)

## 14.4. DESIGN.md ile 22-design-tokens-spec.md Eşleşmezse

**Fallback:** `22-design-tokens-spec.md` kazanır. DESIGN.md Stitch'te yeniden üretilir. Token farklılıkları `packages/design-tokens/` ile karşılaştırılarak tespit edilir.

## 14.5. moai init Konfigürasyonu Bozarsa

**Fallback:** `git reset` ile geri al. Bootstrap sırasına (bölüm 12) dön. İlk adımdan başla.

## 14.6. Claude Code Oturumu Context Limitine Ulaşırsa

**Fallback:** Mevcut ilerleme commit edilir. Yeni oturum açılır ve CLAUDE.md otomatik yüklenir. Kalan iş yeni oturumda devam eder. Büyük görevler için `/moai plan` ile SPEC parçalama stratejisi uygulanır.

## 14.7. Genel Kural

Çalışamayan araç governance'ı kıramaz. İnsani alternatif yol her zaman açıktır. Hiçbir hata senaryosu "durma" ile sonuçlanamaz; her senaryo "alternatif yolla devam et" ile sonuçlanır.

---

# 15. Onboarding — Yeni Geliştirici Kılavuzu

Yeni bir geliştirici projeye dahil olduğunda AI araçlarını kullanmaya başlaması için izlemesi gereken adımlar.

## 15.1. Araç Kurulumu

| Adım | İşlem |
|------|-------|
| 1 | Claude Code yükle ve yapılandır |
| 2 | `moai init` çalıştır (bölüm 12'deki sıraya göre) |
| 3 | Stitch MCP ayarlarını yapılandır |
| 4 | Codex CLI yükle veya GitHub App'i etkinleştir |
| 5 | Tüm talimat dosyalarının varlığını doğrula |

## 15.2. Okuma Sırası

```
40-ai-workflow-and-tooling.md (bu doküman)
     ↓
41-ai-instruction-standards.md (talimat formatları)
     ↓
CLAUDE.md (proje-spesifik kurallar)
     ↓
AGENTS.md (review kuralları)
```

## 15.3. İlk Görev — Pipeline Testi

Basit bir bug fix ile pipeline'ı uçtan uca test et:

```
1. Claude Code ile düzelt
2. Test yaz / mevcut test'i güncelle
3. PR aç
4. @codex review
5. İnsan review + merge
```

Bu ilk görev tüm araçların doğru çalıştığını doğrular.

## 15.4. İkinci Görev — SPEC Deneyimi

`/moai plan` ile ilk SPEC üret, `/moai run` ile implement et:

```
1. /moai plan → küçük bir iyileştirme için SPEC üret
2. SPEC'i incele, gerekirse düzelt
3. /moai run <SPEC-ID> → implementation
4. PR aç → review → merge
```

## 15.5. Üçüncü Görev — Tasarım Pipeline'ı

Stitch'te basit bir ekran tasarla ve component üret:

```
1. Stitch'te ekran tasarla
2. DESIGN.md export et
3. stitch-to-react skill ile component üret
4. 22-design-tokens-spec.md ile tutarlılık doğrula
5. PR aç → review → merge
```

Bu üç görev tamamlandığında geliştirici tüm araçları ve akışları deneyimlemiş olur.

---

# 16. Anti-pattern'ler

Aşağıdaki davranışlar bu projede zayıf kabul edilir ve düzeltilmesi beklenir.

## 16.1. SPEC Olmadan Karmaşık İş Başlatmak

**Yanlış:** "Bu feature basit, SPEC'e gerek yok" deyip 3 modülü etkileyen değişiklik yapmak.
**Doğrusu:** Bölüm 6'daki eşik tablosuna bak. Karmaşıklık skoru >= 5 ise SPEC zorunludur. Skor < 5 olsa bile birden fazla modülü etkileyen iş SPEC'ten fayda görür.

## 16.2. DESIGN.md Olmadan Stitch Çıktısını Projeye Almak

**Yanlış:** Stitch'ten export edilen HTML/CSS'i doğrudan projeye kopyalamak.
**Doğrusu:** Stitch çıktısı DESIGN.md → token doğrulaması → `stitch-to-react` skill pipeline'ından geçmelidir. DESIGN.md olmadan alınan çıktı `22-design-tokens-spec.md` ile uyumsuz olabilir.

## 16.3. AGENTS.md Olmadan Codex Review'a Güvenmek

**Yanlış:** AGENTS.md yazmadan "@codex review" çalıştırmak.
**Doğrusu:** AGENTS.md olmadan Codex, proje-spesifik kuralları bilmez. Review sonuçları güvenilir olmaz. AGENTS.md'deki `## Review guidelines` bölümü zorunludur.

## 16.4. AI Çıktısını Review/Test Olmadan Merge Etmek

**Yanlış:** Claude Code'un ürettiği kodu doğrudan merge etmek.
**Doğrusu:** AI çıktısı insan kodundan farksız muamele görür: review geçer, test geçer, kalite kapısı geçer. AI ürettiği diye istisna tanınmaz.

## 16.5. AI Aracına Canonical Kararları Sorgulatmak

**Yanlış:** "Bu projede Zustand yerine Redux kullanmalıyız, değiştirelim mi?" diye AI aracına sormak.
**Doğrusu:** Canonical kararlar (ADR-001 → ADR-019) sabittir. Değiştirilecekse ADR süreci izlenir (`17-technology-decision-framework.md`). AI aracı bu kararları uygular, sorgulamaz.

## 16.6. Talimat Dosyalarını Git Dışında Tutmak

**Yanlış:** CLAUDE.md veya AGENTS.md'yi `.gitignore`'a eklemek.
**Doğrusu:** Talimat dosyaları kod kadar önemlidir. Git'te versiyonlanır, PR ile güncellenir, review edilir. `.moai/memory/` hariç tüm talimat dosyaları git'te tutulur.

## 16.7. Farklı Talimat Dosyalarında Çelişen Kurallar Bırakmak

**Yanlış:** CLAUDE.md'de "Tailwind CSS 4.x kullan" yazarken AGENTS.md'de "styled-components kullan" yazmak.
**Doğrusu:** Tüm talimat dosyaları canonical kararları aynı biçimde yansıtır (bölüm 8.2). Çelişki tespit edilirse derhal düzeltilir.

## 16.8. Her Küçük İş İçin Tam Pipeline Zorunlu Kılmak

**Yanlış:** 2 satırlık typo düzeltmesi için SPEC + Stitch + Codex review döngüsü istemek.
**Doğrusu:** Bölüm 6'daki eşik tablosuna bak. Bug fix ve küçük UI düzeltmelerinde SPEC ve Stitch gereksizdir. Araç kullanımı görev karmaşıklığıyla orantılı olmalıdır.

## 16.9. AI Aracına Secret ve Credential Dosyalarını Okutmak

**Yanlış:** "`.env` dosyasını oku ve API key'i kullanarak test yaz" talimatı vermek.
**Doğrusu:** `.claudeignore`'da sensitive path'ler tanımlıdır. AI aracı bu dosyaları okuyamaz. Test'lerde mock/stub kullanılır.

## 16.10. Tek Araca Kilitlenmek

**Yanlış:** "Bu proje Claude Code olmadan çalışamaz" demek.
**Doğrusu:** Bölüm 10'daki yedekleme stratejisine bak. Her aracın alternatif yolu tanımlıdır. Araç bağımsızlık ilkesi projenin sürdürülebilirliğini korur.

---

# 17. Kaynak Bilinci

AI araçları ücretsiz değildir. Maliyet yönetimi proje sürdürülebilirliğinin parçasıdır.

## 17.1. Maliyet Yapısı

| Araç | Maliyet Modeli | Not |
|------|---------------|-----|
| Claude Code | API kullanım bazlı | Prompt token + completion token maliyeti |
| Codex CLI | API kullanım bazlı | Review başına maliyet |
| MoAI-ADK | Ücretsiz (açık kaynak) | Claude Code API maliyeti dolaylı olarak geçerli |
| Google Stitch | Ücretsiz (Labs aşaması) | Gelecekte değişebilir |

## 17.2. Maliyet Optimizasyonu

- Eşik tablosu (bölüm 6) gereksiz araç kullanımını önler.
- Kademeli Codex review tetiklemesi (bölüm 6.2) gereksiz review'ları engeller.
- SPEC parçalama stratejisi büyük görevleri küçük, yönetilebilir parçalara böler.
- Context yönetimi: CLAUDE.md'nin boyutu kontrol altında tutulur; gereksiz bilgi context'e yüklenmez.

## 17.3. Bütçe Takibi

Claude Code ve Codex CLI API kullanım maliyeti proje bütçesinde ayrı kalem olarak takip edilmelidir. Aylık maliyet raporu oluşturulmalı ve beklenmedik artışlar incelenmelidir.

---

# 18. Onay Kriterleri

Bu dokümanın kabul edilmiş sayılması için aşağıdaki koşullar sağlanmalıdır:

## 18.1. Araç Envanteri Doğrulaması

- [ ] Dört AI aracının (Claude Code, MoAI-ADK, Codex CLI, Google Stitch) rolleri, sınırları ve talimat dosyaları tanımlıdır.
- [ ] Her aracın canonical technical decision layer (ADR-001 → ADR-019) ile uyumu doğrulanmıştır.

## 18.2. Etkileşim Modeli Doğrulaması

- [ ] Araçlar arası dört etkileşim hattı (MoAI→Claude, Stitch→Claude, Claude→Codex, tam pipeline) tanımlıdır.
- [ ] Tek orkestratör kuralı açıklanmıştır.

## 18.3. Otorite Hiyerarşisi Doğrulaması

- [ ] Talimat dosyalarının otorite sırası tanımlıdır.
- [ ] Çelişki çözüm kuralları somut örneklerle açıklanmıştır.
- [ ] DESIGN.md'nin türev statüsü belirtilmiştir.

## 18.4. Güvenlik Doğrulaması

- [ ] Context güvenliği kuralları tanımlıdır.
- [ ] `.claudeignore` zorunluluğu belirtilmiştir.
- [ ] Üçüncü parti risk bilinci tablosu mevcuttur.
- [ ] `27-security-and-secrets-baseline.md` referansı verilmiştir.

## 18.5. Araç Bağımsızlık Doğrulaması

- [ ] Yedekleme tablosu tanımlıdır.
- [ ] Her araç için kurtarma senaryosu yazılmıştır.
- [ ] Vendor lock-in önleme kuralları belirtilmiştir.

## 18.6. Operasyonel Doğrulama

- [ ] Eşik tablosu (görev karmaşıklığı → araç zorunluluğu) tanımlıdır.
- [ ] Görev bazlı workflow'lar (5 ana akış) tanımlıdır.
- [ ] Bootstrap sırası ve çakışma önleme kuralları yazılmıştır.
- [ ] CI/CD entegrasyon adımları belirtilmiştir.
- [ ] Hata senaryoları ve fallback yolları tanımlıdır.
- [ ] Onboarding adımları sıralıdır.

## 18.7. Anti-pattern Doğrulaması

- [ ] En az 10 anti-pattern somut "yanlış/doğrusu" formatında tanımlanmıştır.
- [ ] Her anti-pattern ilgili bölüme referans vermektedir.

## 18.8. Tutarlılık Doğrulaması

- [ ] Bu doküman `16-tooling-and-governance.md` ile çelişmemektedir.
- [ ] Bu doküman `15-quality-gates-and-ci-rules.md` ile uyumludur.
- [ ] Bu doküman `01-working-principles.md`'deki documentation-first ilkesini AI operasyonlarına taşımaktadır.

---

# 19. Kısa Sonuç

Bu doküman, dört AI aracının boilerplate geliştirme sürecindeki somut rollerini, gerçek entegrasyon mekanizmalarını ve birbirleriyle etkileşim protokollerini tek noktadan tanımlar.

Temel ilkeler:
1. **Otorite hiyerarşisi:** Boilerplate dokümanları > ADR'ler > talimat dosyaları > runtime davranışı. Çelişkide üst katman kazanır.
2. **Araç bağımsızlığı:** Araçlar değişebilir, dokümanlar kalır. Her araç için insani fallback yolu tanımlıdır.
3. **Orantılı kullanım:** Her görev tam pipeline gerektirmez. Eşik tablosu araç kullanımını görev karmaşıklığıyla orantılar.
4. **Güvenlik:** AI araçlarına giden veri kontrol altındadır. Secret ve credential dosyaları context'e girmez.
5. **Governance sürekliliği:** Çalışamayan araç governance'ı kıramaz. İnsani alternatif yol her zaman açıktır.

Detay kuralları bu dokümanın alt dokümanlarında tanımlanır:
- Talimat dosyası formatları ve standartları → `41-ai-instruction-standards.md`
- Stitch pipeline ve token eşleme → `46-stitch-pipeline-spec.md`
- AI guardrail çerçevesi ve yönetişimi → `47-ai-guardrail-governance.md`

---

# 20. AI Guardrail Entegrasyonu

AI araçlarının kod üretirken boilerplate standartlarına uyumunu yapısal olarak garanti altına alan guardrail çerçevesi, `47-ai-guardrail-governance.md`'de tanımlanmıştır.

## 20.1. Guardrail Workflow

Her kod üretiminde Claude Code şu süreci izler:

```
İş türünü belirle → Aktivite guardrail'ini oku → Domain guardrail'leri oku → Kurallara uygun üret → Kontrol listesi doğrula
```

## 20.2. Guardrail Skill Envanteri

| Skill | Platform | İşlev |
|-------|----------|-------|
| `/guardrail-check` | Claude Code | İş türüne göre ilgili guardrail'leri oku ve özetle |
| `/guardrail-audit` | Claude Code | Üretilen kodu guardrail'lere karşı denetle (subagent) |
| `/domain-guide D-XXX` | Claude Code | Belirtilen domain guardrail'ini oku |
| `/dep-check` | Claude Code | Dependency policy kontrolü |
| `/pre-pr` | Claude Code | PR öncesi kapsamlı kalite kontrolü (subagent) |
| `/boundary-check` | Claude Code | Boundary contract uyum kontrolü (subagent) |
| `/exception-create` | Claude Code | Exception/exemption kaydı oluştur |
| `$guardrail-audit` | Codex CLI | Guardrail uyum denetim raporu |
| `$full-audit` | Codex CLI | Tüm denetim katmanlarını birleştiren rapor |

## 20.3. Hook Entegrasyonu

`.claude/settings.json`'da tanımlanan PreToolUse ve PostToolUse hook'ları, dosya düzenleme sırasında otomatik olarak ilgili guardrail'leri hatırlatır ve universal kural ihlallerini tarar.

## 20.4. Guardrail Doküman Konumları

- Domain guardrail'ler: `docs/ai-guardrails/domain/D-XXX-*.md`
- Aktivite guardrail'ler: `docs/ai-guardrails/activity/A-XXX-*.md`
- Guardrail governance: `docs/governance/47-ai-guardrail-governance.md`
- Skill dosyaları: `.claude/skills/{skill-adi}/SKILL.md`
- Hook konfigürasyonu: `.claude/settings.json`

---

# 21. Multi-Agent Token Bütçesi Yönetimi (2026-04-02 Eki)

Bu bölüm, AI agent oturumlarında token tüketiminin iş türüne göre bütçelenmesini ve optimizasyon stratejilerini tanımlar.

## 21.1. İş Türü Bazlı Token Bütçesi

| İş Türü | Max Token / Oturum | Gerekçe |
|---------|-------------------|---------|
| Küçük bug fix | 50K | Tek dosya düzenleme, dar kapsam, hızlı çözüm |
| Feature geliştirme | 200K | Çoklu dosya, test yazımı, guardrail kontrolü |
| Kapsamlı refactoring | 500K | Geniş kapsam, çok sayıda dosya, etki analizi |
| Doküman iyileştirme | 300K | Çoklu doküman okuma ve düzenleme, tutarlılık kontrolü |
| SPEC yazımı | 100K | Doküman referansı, EARS format, kabul kriterleri |
| Code review | 150K | Dosya okuma, kural karşılaştırma, yorum yazma |
| Test yazımı | 150K | Kaynak kod okuma, test senaryosu üretimi |

## 21.2. Token Optimizasyon Stratejileri

| Strateji | Açıklama | Tasarruf |
|----------|----------|---------|
| CLAUDE.md kısa tut | ≤4000 token; her oturumda yüklenir | Yüksek |
| Agent'lara spesifik görev ver | Geniş talimat yerine dar kapsamlı talimat | Orta |
| Gereksiz dosya okumalarından kaçın | Yalnızca ilgili dosyaları oku, tüm dizini tarama | Orta |
| Referans path ver, içerik verme | Büyük dokümanı okutmak yerine ilgili bölüm numarasını belirt | Yüksek |
| Batch işlem kullan | Aynı türdeki işleri tek oturumda topla | Düşük |
| Subagent kullan | Bağımsız görevleri paralel subagent'lara delege et | Orta |

## 21.3. Bütçe Aşımı Yönetimi

- Token bütçesi bir tavsiyedir, hard limit değildir. Ancak sistematik aşım, görev tanımının veya CLAUDE.md'nin optimize edilmesi gerektiğinin işaretidir.
- Bütçe aşımı durumunda oturum özetlenerek yeni oturumda devam edilir.
- Aşım oranı %50'yi geçen görevler için görev tanımı ve context optimizasyonu yapılır.

---

# 22. AI Agent Çıktı Kalite Metrikleri (2026-04-02 Eki)

Bu bölüm, AI agent'ların ürettiği çıktıların kalitesini ölçen metrikleri ve hedeflerini tanımlar.

## 22.1. Temel Kalite Metrikleri

| Metrik | Tanım | Hedef | Ölçüm Yöntemi |
|--------|-------|-------|---------------|
| First-pass success rate | İlk denemede CI geçen PR oranı | >%70 | CI pipeline sonucu / toplam AI PR |
| Rework rate | Review sonrası değişiklik gerektiren PR oranı | <%30 | Review round sayısı / toplam AI PR |
| Guardrail ihlal oranı | Pre-PR kontrolünde yakalanan ihlal oranı | <%10 | Guardrail fail sayısı / toplam kontrol |
| Test coverage delta | AI değişikliğinin coverage etkisi | ≥%0 (düşürmez) | Coverage diff raporu |
| Build break rate | AI değişikliğinin build kırma oranı | <%5 | Build fail / toplam AI commit |
| DoD compliance | DoD maddelerinin karşılanma oranı | >%90 | DoD checklist / toplam madde |

## 22.2. İzleme ve Raporlama

- Metrikler aylık olarak raporlanır.
- Trend analizi ile kötüleşen metrikler tespit edilir.
- First-pass success rate düşüşü → CLAUDE.md veya guardrail güncelleme ihtiyacı.
- Rework rate artışı → Review guidelines veya talimat netliği iyileştirme ihtiyacı.
- Guardrail ihlal oranı artışı → Guardrail kurallarının gözden geçirilme ihtiyacı (çok katı mı, anlaşılmaz mı).

## 22.3. Kalite Hedefi Skalası

| Seviye | First-pass | Rework | Guardrail İhlal | Durum |
|--------|-----------|--------|----------------|-------|
| Mükemmel | >%85 | <%15 | <%5 | Sürdür |
| İyi | %70-85 | %15-30 | %5-10 | Kabul edilebilir |
| Düşük | %50-70 | %30-50 | %10-20 | İyileştirme planla |
| Kritik | <%50 | >%50 | >%20 | Acil müdahale |
