# AI Entegrasyon Dokümantasyonu — Yapılandırılmış Rapor

- **Tarih:** 2026-04-01
- **Kapsam:** Boilerplate AI araç entegrasyonu ve türetilen projelerde AI konumlandırması
- **Durum:** Accepted

---

# A. ARAÇ PROFİLLERİ — ARAŞTIRMA BULGULARI

Bu bölüm, rapordaki tüm önerilerin dayandığı somut araç bilgilerini içerir.

---

## A.1. Claude Code (Anthropic — Opus 4.6)

**Nedir:** Anthropic'in terminal, IDE, masaüstü ve web üzerinden çalışan agentic coding aracı. Codebase okur, dosya düzenler, komut çalıştırır, geliştirme araçlarıyla entegre olur.

**Talimat sistemi:**
- `CLAUDE.md` — proje kökünde, her oturumda otomatik okunur. Projenin "anayasası" görevi görür: mimari, kodlama standartları, build komutları tanımlar.
- `.claude/` dizini — hooks, settings.json, komutlar ve agent konfigürasyonu barındırır.

**Entegrasyon katmanları:**
- **MCP (Model Context Protocol):** Dış veri kaynaklarına bağlanma standardı. Google Drive, Jira, Slack ve özel araçlarla (Stitch MCP dahil) bağlanabilir.
- **Agent Teams:** Deneysel multi-agent orchestrator. Bir oturum "team lead" olarak diğer Claude Code instance'larını task list üzerinden koordine eder.
- **Hooks:** Pre/post tool call hook'ları ile otomatik davranışlar tanımlanabilir.
- **Skills:** Slash command sistemi ile özel yetenekler eklenebilir (ör. `stitch-to-react` skill'i).

**Bu boilerplate için rolü:** Ana geliştirme motoru. Tüm diğer araçların çıktısını koda dönüştüren merkezi ajan.

---

## A.2. MoAI-ADK (modu-ai — Agentic Development Kit)

**Nedir:** Claude Code için yüksek performanslı AI geliştirme ortamı. 27 uzmanlaşmış AI ajanı ve 52 skill'den oluşur. Go dilinde yazılmış, tek binary, sıfır bağımlılık.

**Temel felsefe — Harness Engineering:**
> "İnsan yönlendirir, ajanlar çalıştırır" — mühendis kod yazmak yerine SPEC, quality gate ve feedback loop tasarlar.

**SPEC-First yaklaşım — EARS formatı:**
- EARS (Easy Approach to Requirements Syntax) ile belirsiz olmayan spesifikasyonlar üretir.
- Her spec: gereksinim tanımı, başarı kriterleri ve test senaryoları içerir.
- Karmaşıklık skoru >= 5 olan görevlerde otomatik SPEC üretimi tetiklenir.

**Dizin yapısı:**
```
.moai/
├─ config/          # Section-based YAML konfigürasyon (v0.37.0+)
│  └─ sections/
│     └─ quality.yaml   # development_mode: tdd|ddd
├─ memory/          # Ajan hafızası
├─ specs/           # SPEC dokümanları (SPEC-001, SPEC-002...)
└─ docs/            # Otomatik üretilen dokümanlar

.claude/
├─ agents/          # Ajan tanımları
├─ commands/        # Slash command tanımları
├─ hooks/           # Hook konfigürasyonları
└─ settings.json    # Claude Code ayarları
```

**Slash command'lar (Claude Code içinden):**
| Komut | İşlev |
|---|---|
| `/moai plan` | SPEC dokümanı oluştur (EARS formatında) |
| `/moai run <SPEC-ID>` | SPEC'i DDD/TDD ile implement et |
| `/moai sync <SPEC-ID>` | Dokümanları senkronize et, PR hazırla |
| `/moai fix` | Tek geçiş: tara → sınıfla → düzelt → doğrula |
| `/moai loop` | İteratif düzeltme (maks 100 iterasyon) |
| `/moai project` | Proje dokümanları üret (product.md, structure.md, tech.md) |
| `/moai feedback` | GitHub issue oluştur |

**CLI komutları:**
| Komut | İşlev |
|---|---|
| `moai init` | Proje başlatma sihirbazı (dil, framework, metodoloji otomatik algılama) |
| `moai update` | Framework güncelleme |
| `moai build` | Build işlemi |
| `moai hook` | Hook yönetimi |

**Kalite framework'ü — TRUST 5:**
1. **T**est-First — test önce yazılır
2. **R**eadable — okunabilir kod
3. **U**nified — tutarlı stil
4. **S**ecured — güvenli kod
5. **T**rackable — izlenebilir değişiklikler

**Metodoloji seçimi:**
- Yeni projeler → TDD (RED → GREEN → REFACTOR)
- Mevcut projeler (düşük test coverage) → DDD (ANALYZE → PRESERVE → IMPROVE)
- `moai init --mode <ddd|tdd>` ile seçilebilir

**Bu boilerplate için rolü:** Specification üretimi, modüler geliştirme orkestratörü. Boilerplate spec'lerini EARS formatına çevirerek Claude Code'a yapılandırılmış talimat sağlar.

---

## A.3. OpenAI Codex CLI

**Nedir:** OpenAI'ın terminal tabanlı coding ajanı. Rust ile yazılmış, açık kaynak. GPT-5.3-Codex modeli ile çalışır. Yerel makinede kod okur, değiştirir ve çalıştırır.

**Talimat sistemi — AGENTS.md:**
- CLAUDE.md'nin Codex karşılığı. Proje kökünde ve alt dizinlerde yerleştirilebilir.
- Codex her iş öncesi AGENTS.md dosyalarını okur.
- Hiyerarşik: dizin ağacı boyunca en yakın AGENTS.md uygulanır.
- Fallback dosya adları yapılandırılabilir: `project_doc_fallback_filenames` (config.toml)

**Review sistemi:**
- **GitHub entegrasyonu:** PR yorumuna `@codex review` yazılır, Codex standart GitHub code review döndürür.
- **Otomatik review:** Ayarlardan etkinleştirilince her yeni PR'da otomatik review.
- **Review kuralları:** AGENTS.md içinde `## Review guidelines` bölümü ile repo-spesifik kurallar tanımlanır.
- **Öncelik filtreleme:** GitHub'da yalnızca P0 ve P1 sorunları işaretlenir.

**Sandbox modları:**
| Mod | Kullanım |
|---|---|
| Read Only (`-s read-only`) | Audit ve denetim |
| Auto (varsayılan) | Günlük geliştirme |
| Full Auto (`--full-auto`) | Tam otomasyon |

**Audit ve logging:**
- `~/.codex/log/codex-tui.log` — genel log
- Session-level JSONL logging — hangi talimat dosyalarının yüklendiği izlenebilir

**Konfigürasyon:**
```toml
# ~/.codex/config.toml
project_doc_fallback_filenames = ["TEAM_GUIDE.md", ".agents.md"]
project_doc_max_bytes = 65536
```

**Bu boilerplate için rolü:** Kod denetimi ve kalite doğrulaması. Claude Code'un ürettiği kodu bağımsız ajan olarak review eder. Read-only modda audit yapar.

---

## A.4. Google Stitch

**Nedir:** Google Labs'ın AI destekli UI tasarım platformu. Doğal dil veya görsel girdiden arayüz tasarlar, üretim-hazır frontend kodu export eder. Gemini 3.1 modeli ile çalışır. Ücretsiz (stitch.withgoogle.com).

**DESIGN.md:**
- Stitch'in ürettiği tasarım sistemi dosyası. İçeriği:
  - Renk tanımları (palet, roller, semantic token'lar: primary, surface, accent)
  - Tipografi (font aileleri, boyutlar, ağırlıklar, satır yükseklikleri, mapping: heading-1, body, caption)
  - Spacing ve layout kuralları (spacing scale, grid, radius, shadow)
  - Component pattern'leri
- Mevcut design token'lar yüklenebilir → Stitch bunları her üretimde uygular
- Mevcut sitelerden design kuralları çıkarabilir ve DESIGN.md olarak kaydedebilir

**Çıktı formatları:**
- HTML/CSS (semantic, temiz)
- Tailwind CSS
- React/JSX (reusable component yapısı)

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
|---|---|
| `extract_design_context` | Ekranları tarar, Design DNA çıkarır |
| `fetch_screen_code` | HTML/Frontend kodu indirir |
| `fetch_screen_image` | Screenshot indirir |
| `generate_screen_from_text` | Prompt'tan yeni ekran üretir |

**stitch-to-react skill (Claude Code):**
```bash
npx skills add google-labs-code/stitch-skills --skill react:components --global
```
- Stitch HTML/PNG export'larını yapılandırılmış React component'lere dönüştürür
- Görsel token'ları design system değişkenlerine map'ler
- JSX/TSX + scoped styling çıktısı üretir

**Tasarım → Kod pipeline'ı (gerçek akış):**
1. Stitch'te tasarım oluştur (doğal dil veya görsel girdi)
2. DESIGN.md export et
3. DESIGN.md'yi projeye ekle
4. CLAUDE.md'de DESIGN.md referansını yapılandır
5. Claude Code ile component üret (design consistency garantili)

**Mart 2026 güncellemesi:**
- Multi-screen generation
- AI-native infinite canvas
- Interactive prototyping
- Voice interaction (tasarım kritiği, gerçek zamanlı güncelleme)

**Bu boilerplate için rolü:** Arayüz tasarımı ve tema token sistemi üretimi. DESIGN.md üzerinden Claude Code'a tasarım context'i sağlar. Stitch MCP ile canlı tasarım verisi çekilir.

---

# B. MEVCUT DURUM ANALİZİ

---

## B.1. Araçlar Arası Gerçek Etkileşim Modeli

Araştırma sonuçlarına göre dört aracın somut etkileşim noktaları:

```
┌─────────────────────────────────────────────────────────┐
│                    CLAUDE CODE                           │
│              (Merkezi Geliştirme Motoru)                 │
│                                                         │
│  ┌──────────┐   ┌──────────┐   ┌──────────────────┐    │
│  │ CLAUDE.md│   │ .claude/  │   │ MCP Sunucuları   │    │
│  │ (talimat)│   │ (hooks,   │   │ (Stitch MCP vb.) │    │
│  │          │   │  agents)  │   │                  │    │
│  └──────────┘   └──────────┘   └──────────────────┘    │
└────────┬──────────────┬──────────────────┬──────────────┘
         │              │                  │
    ┌────▼────┐   ┌─────▼─────┐   ┌───────▼───────┐
    │ MoAI-ADK│   │ Codex CLI │   │ Google Stitch  │
    │         │   │           │   │                │
    │ /moai   │   │ AGENTS.md │   │ DESIGN.md      │
    │ plan    │   │ @codex    │   │ Stitch MCP     │
    │ run     │   │ review    │   │ stitch-to-react│
    │ sync    │   │           │   │                │
    └─────────┘   └───────────┘   └────────────────┘
```

### Etkileşim 1: MoAI-ADK → Claude Code (Doğrudan)
- MoAI-ADK, Claude Code'un **slash command sistemi** üzerinden çalışır.
- `.moai/` ve `.claude/` dizinlerini birlikte yönetir.
- `moai init` → Claude Code entegrasyon dosyalarını otomatik üretir.
- `/moai plan` → EARS formatında SPEC üretir → `/moai run <SPEC-ID>` → Claude Code implement eder.
- **Bağlantı türü:** Claude Code'un native skill/command altyapısı.

### Etkileşim 2: Google Stitch → Claude Code (MCP + Skill)
- **Stitch MCP** üzerinden canlı tasarım verisi çekilir (ekran kodu, screenshot, design context).
- **DESIGN.md** export edilip proje köküne eklenir → Claude Code her oturumda okur.
- **stitch-to-react skill** ile Stitch HTML çıktısı otomatik React component'e dönüştürülür.
- **Bağlantı türü:** MCP protokolü + Claude Code skill sistemi.

### Etkileşim 3: Codex CLI → GitHub (PR Review)
- `@codex review` ile PR'da bağımsız kod review.
- AGENTS.md içindeki `## Review guidelines` bölümü, projeye özel denetim kurallarını tanımlar.
- Read-only modda audit amacıyla kullanılabilir.
- **Bağlantı türü:** GitHub entegrasyonu + AGENTS.md talimat sistemi.

### Etkileşim 4: Claude Code çıktısı → Codex denetimi (Dolaylı)
- Claude Code ile yazılan kod commit/PR edilir → Codex otomatik veya manuel review yapar.
- Codex bulguları → geliştirici → Claude Code ile düzeltme döngüsü.
- **Bağlantı türü:** Git/GitHub üzerinden dolaylı, aynı repo'da farklı talimat dosyaları (CLAUDE.md vs AGENTS.md).

---

## B.2. Güçlü Yönler

| Güçlü Yön | Somut Dayanak |
|---|---|
| **MoAI-ADK spec-first yaklaşımı boilerplate'in documentation-first ilkesiyle örtüşüyor** | Her ikisi de "önce tanımla, sonra uygula" diyor. MoAI'nin EARS formatı, boilerplate spec'lerini yapılandırılmış AI talimatına dönüştürebilir |
| **Stitch → DESIGN.md → Claude Code pipeline'ı zaten var** | Google ve topluluk bu akışı belgelemiş, MCP ve skill altyapısı hazır. Boilerplate'in design token sistemiyle (22-design-tokens-spec.md) doğrudan eşleşir |
| **Codex'in bağımsız review mekanizması governance modeline uygun** | Boilerplate'in 16-tooling-and-governance.md felsefesi: "review mekanik hataları tek başına avlamak zorunda kalmamalıdır." Codex bunu otomatikleştirir |
| **Her aracın kendi talimat dosyası var** | CLAUDE.md (Claude Code), AGENTS.md (Codex), `.moai/config/` (MoAI-ADK), DESIGN.md (Stitch) — hepsi versiyon kontrolünde tutulabilir |
| **TRUST 5 kalite framework'ü boilerplate audit yapısıyla uyumlu** | MoAI-ADK'nın Test-First, Readable, Unified, Secured, Trackable ilkeleri, 31-audit-checklist.md ve 32-definition-of-done.md ile örtüşür |

## B.3. Zayıf Yönler ve Boşluklar

| Zayıf Yön | Somut Risk |
|---|---|
| **Boilerplate'in 53 dosyalık setinde AI araçlarına sıfır referans** | Documentation-first projede, geliştirme sürecinin merkezindeki araçlar dokümante edilmemiş. 16-tooling-and-governance.md AI'dan hiç bahsetmiyor |
| **CLAUDE.md proje seviyesinde yok** | Claude Code her oturumda boş context ile başlıyor. 11 ADR kararı, dependency policy, compatibility matrix — hiçbiri Claude Code'un otomatik context'ine taşınmamış |
| **AGENTS.md yok** | Codex review'da proje-spesifik kural yok. Review kuralları boilerplate'in canonical katmanını yansıtmıyor |
| **DESIGN.md akışı tanımsız** | Stitch → DESIGN.md → Claude Code pipeline'ı teknik olarak mümkün ama boilerplate'in 22-design-tokens-spec.md ile nasıl eşleşeceği belirtilmemiş |
| **MoAI-ADK'nın `.moai/` yapısı boilerplate repo structure'da (21) yok** | `moai init` çalıştırıldığında hangi dosyaların oluşacağı, boilerplate'in canonical root topology'siyle çelişebilir |
| **Araç talimat dosyaları arasında tutarsızlık riski** | CLAUDE.md, AGENTS.md, `.moai/config/` ve DESIGN.md birbirinden bağımsız yönetilirse canonical kararlar farklı talimat dosyalarında farklı yansıyabilir |
| **Stitch çıktısının boilerplate token katmanlarıyla eşleşme kuralı yok** | 22-design-tokens-spec.md semantic/primitive/component token katmanları tanımlar ama Stitch'in DESIGN.md çıktısının bu katmanlara nasıl map'leneceği yazılı değil |

---

# C. KAPSAM 1: BOILERPLATE'E EKLENECEK AI DOKÜMANLARI

---

## C.1. Envanter — Mevcut Dokümanlara Eklenecek İçerikler

### `CLAUDE.md` (YENİ — Repo Kökü)

Claude Code her oturumda bu dosyayı okur. Boilerplate'in canonical kararlarını Claude Code'un otomatik context'ine taşımanın en doğrudan yolu.

**İçerik taslağı:**

```markdown
# Boilerplate Proje Talimatları

## Proje Kimliği
- Cross-platform boilerplate: React + React Native (Expo)
- Monorepo: pnpm + Turborepo (ADR-003)
- Documentation-first, spec-first yaklaşım
- Apple HIG uyumlu, design system merkezli

## Canonical Kararlar — BUNLAR AÇILAMAZ
Bu kararlar ADR-001 → ADR-019 ile birlikte `36-canonical-stack-decision.md`, `37-dependency-policy.md` ve `38-version-compatibility-matrix.md` tarafından kilitlenmiştir.
Alternatifleri tartışma, sorgulatma veya bypass etme.

- Web runtime: React + Vite + React Router, SPA-first (ADR-001)
- Mobil runtime: React Native + Expo (ADR-002)
- Monorepo: pnpm 10.x + Turborepo 2.x (ADR-003)
- State management: Zustand (ADR-004)
- Data fetching: fetch-first default + conditional TanStack Query policy (ADR-005)
- Forms: React Hook Form + Zod (ADR-006)
- Styling/tokens: Tailwind CSS (web) + NativeWind (mobile), semantic token-first (ADR-007)
- Testing: Vitest (web) + Jest (mobile) + Testing Library + Playwright E2E (ADR-008)
- Observability: Sentry + vendor-agnostic analytics abstraction (ADR-009)
- Auth: Backend-managed HttpOnly cookies (web) + Expo SecureStore (mobile) (ADR-010)
- i18n: i18next, namespace-based (ADR-011)

## Dependency Kuralları
- Yeni dependency eklemeden önce docs/governance/37-dependency-policy.md kontrol et
- Versiyon uyumluluğu için docs/governance/38-version-compatibility-matrix.md kontrol et
- Canonical stack'teki kütüphanelerin alternatiflerini önerme

## MoAI-ADK Entegrasyonu
- Bu projede MoAI-ADK aktiftir: /moai komutları kullanılabilir
- SPEC-First: karmaşık görevlerde önce /moai plan ile SPEC oluştur
- TRUST 5 kalite kuralları geçerlidir

## Stitch Entegrasyonu
- Stitch MCP aktiftir: tasarım verileri çekilebilir
- DESIGN.md dosyası varsa, component üretiminde referans al
- Token çıktılarını docs/design-system/22-design-tokens-spec.md katmanlarıyla eşle

## Dosya Organizasyonu
- Feature kodu: apps/{app}/src/features/{feature}/
- Shared package: packages/{package}/src/
- Test: kaynak dosya yanında *.test.ts(x)
- Design token: packages/design-tokens/
- Spec dokümanları: .moai/specs/

## Dil Kuralları
- Kod yorumları: Türkçe
- Commit mesajları: Türkçe
- Değişken/fonksiyon adları: İngilizce
- Doküman dili: Türkçe
```

**Gerekçe:** Claude Code bağlamında CLAUDE.md, projenin "anayasası"dır. Bu dosya olmadan her oturum sıfırdan başlar ve canonical kararlar context'e taşınmaz.

---

### `AGENTS.md` (YENİ — Repo Kökü)

Codex CLI her iş öncesi bu dosyayı okur. Boilerplate'in denetim kurallarını Codex'in review context'ine taşır.

**İçerik taslağı:**

```markdown
# Boilerplate Codex Talimatları

## Review Guidelines
- Canonical stack dışı dependency kullanımını P0 olarak işaretle
- `eslint-disable`, `@ts-ignore`, `any` type kullanımını flagle
- Component'lerin accessibility prop'larını kontrol et (role, aria-label, tabIndex)
- Design token yerine hardcoded renk/spacing kullanımını işaretle
- Platform-specific kodun doğru dizinde olduğunu kontrol et
- Test dosyası olmayan yeni modülleri flagle
- Import yönlerini kontrol et: feature → shared OK, shared → feature YASAK

## Architecture Rules
- apps/ → packages/ yönünde bağımlılık OK
- packages/ → apps/ yönünde bağımlılık YASAK
- packages/ arası çapraz bağımlılık gerekçelendirilmeli

## Testing Requirements
- Yeni utility/hook: birim testi zorunlu
- Yeni component: render testi zorunlu
- Yeni API entegrasyonu: integration testi zorunlu

## Canonical Stack (DO NOT suggest alternatives)
- State: Zustand | Data: fetch-first / conditional TanStack Query | Forms: React Hook Form + Zod
- Styling: Tailwind CSS + NativeWind | Testing: Vitest + Jest + Playwright | i18n: i18next
```

**Gerekçe:** AGENTS.md olmadan Codex genel amaçlı review yapar. Boilerplate'in canonical kararlarını ve mimari sınırlarını bilmez. Review bulguları proje-spesifik değil genel kalır.

---

### `21-repo-structure-spec.md` — Güncelleme

Canonical root topology'ye (bölüm 4) eklenmesi gereken AI dizinleri:

```
/
├─ .moai/                    # MoAI-ADK (moai init tarafından üretilir)
│  ├─ config/sections/       # quality.yaml, methodology seçimi
│  ├─ memory/                # Ajan hafızası
│  ├─ specs/                 # SPEC-001.md, SPEC-002.md...
│  └─ docs/                  # Otomatik üretilen dokümanlar
├─ .claude/                  # Claude Code + MoAI-ADK ortak
│  ├─ agents/                # Ajan tanımları
│  ├─ commands/              # Slash command tanımları (MoAI dahil)
│  ├─ hooks/                 # Pre/post hook konfigürasyonları
│  └─ settings.json          # MCP sunucu tanımları dahil
├─ CLAUDE.md                 # Claude Code proje talimatı
├─ AGENTS.md                 # Codex CLI proje talimatı
├─ DESIGN.md                 # Stitch tasarım sistemi (Stitch'ten export)
├─ tooling/
│  └─ ai/
│     ├─ stitch/
│     │  ├─ templates/       # Stitch talimat şablonları
│     │  └─ exports/         # Stitch HTML çıktıları (geçici)
│     └─ codex/
│        └─ review-rules/    # Dizin-spesifik AGENTS.md örnekleri
```

**Gerekçe:** `moai init` komutu `.moai/` ve `.claude/` dizinlerini otomatik oluşturur. Bu dizinlerin canonical root topology'de yer alması, repo bootstrap sırasında çakışma riskini önler. DESIGN.md ise Stitch pipeline'ının doğal çıktısıdır ve proje kökünde yaşar.

**Not:** Bu bölüm target topology'yi tarif eder. `DESIGN.md`, `.moai/specs/*` ve benzeri dosyaların bu doküman arşivinde fiziksel olarak bulunması beklenmez; derived project bootstrap ve araç çalıştırma sürecinde üretilirler.

**Placement kuralı eklemesi:**
- `.moai/specs/` → SPEC dokümanları buraya yazılır, başka yere dağıtılmaz
- `DESIGN.md` → Stitch'ten export edilir, elle düzenlenmez; değişiklik Stitch'te yapılır
- `AGENTS.md` → Hiyerarşik: alt dizinlere daha spesifik AGENTS.md yerleştirilebilir (ör. `packages/ui/AGENTS.md`)

---

### `16-tooling-and-governance.md` — Yeni Bölüm

**Eklenecek bölüm:** "AI Araç Governance Modeli"

```markdown
# XX. AI Araç Governance Modeli

## XX.1. AI Araçlarının Governance İçindeki Konumu

Bu projede dört AI aracı aktif olarak kullanılır:
- Claude Code: merkezi geliştirme motoru
- MoAI-ADK: SPEC üretimi ve modüler geliştirme orkestratörü
- OpenAI Codex CLI: bağımsız kod denetimi ve PR review
- Google Stitch: arayüz tasarımı ve tema token üretimi

Bu araçlar tooling zincirinin parçasıdır.
Governance kuralları aynen geçerlidir:
- AI çıktısı, insan çıktısıyla aynı quality gate'lerden geçer
- AI aracı canonical kararları açamaz, yalnızca uygular
- AI aracının bypass ettiği lint/type/test kontrolü kabul edilmez

## XX.2. Talimat Dosyaları Versiyon Kontrolünde Tutulur

Aşağıdaki dosyalar git'te tutulur ve PR review kapsamındadır:
- CLAUDE.md (Claude Code talimatları)
- AGENTS.md (Codex talimatları)
- .moai/config/ (MoAI-ADK konfigürasyonu)
- DESIGN.md (Stitch tasarım sistemi)

Bu dosyalardaki değişiklik, canonical katmanla tutarlılık açısından review edilir.

## XX.3. Talimat-Spec Tutarlılığı

Talimat dosyaları (CLAUDE.md, AGENTS.md) canonical karar katmanını (ADR-001 → ADR-019 + 36/37/38 canonical governance belgeleri) doğru yansıtmak zorundadır. Canonical katmanda değişiklik olursa talimat dosyaları da güncellenir. Bu güncelleme contribution guide kapsamında zorunlu adımdır.

## XX.4. Çift Ajan Denetimi

Claude Code ile yazılan kod, Codex CLI ile bağımsız review'dan geçer.
İki ajanın aynı repo'da farklı talimat dosyaları (CLAUDE.md vs AGENTS.md) üzerinden çalışması, çapraz denetim sağlar.
Bu model, 16-tooling-and-governance.md bölüm 3'teki "enforcement + audit" ikili yapısıyla örtüşür.
```

**Gerekçe:** Tooling dokümanı, araç zincirinin governance modelini tanımlar. AI araçları bu zincirin aktif parçası olduğu halde dokümanda yer almıyor. Bu boşluk, AI çıktılarının quality gate bypass'ını normalleştirme riski taşır.

---

### `30-contribution-guide.md` — Yeni Bölüm

**Eklenecek bölüm:** "AI Destekli Katkı Süreci"

```markdown
# XX. AI Destekli Katkı Süreci

## XX.1. MoAI-ADK ile İş Başlatma

Karmaşık görevlerde (yeni feature, yeni modül, mimari değişiklik):
1. `/moai plan` ile SPEC oluştur (EARS formatında)
2. SPEC'in canonical kararlarla (ADR seti) tutarlılığını doğrula
3. `/moai run <SPEC-ID>` ile implement et
4. `/moai sync <SPEC-ID>` ile dokümanları senkronize et

Basit görevlerde (bug fix, küçük düzeltme) SPEC zorunlu değildir.

## XX.2. Stitch ile Arayüz Tasarımı

Yeni ekran veya component tasarımında:
1. Stitch'te tasarım oluştur (mevcut DESIGN.md ile tutarlı)
2. DESIGN.md'yi güncelle veya yeni export al
3. stitch-to-react skill veya Claude Code ile component üret
4. Üretilen token'ları 22-design-tokens-spec.md katmanlarıyla eşle

## XX.3. Codex Review Süreci

PR açmadan önce veya sonra:
1. `@codex review` ile bağımsız denetim talep et
2. Codex, AGENTS.md'deki review guidelines'a göre denetler
3. P0/P1 bulguları merge-blocking kabul edilir
4. Bulgular Claude Code ile düzeltilir, yeniden review tetiklenir

## XX.4. Talimat Dosyası Güncelleme Zorunluluğu

Aşağıdaki değişikliklerde talimat dosyaları da güncellenmelidir:
- Canonical katmanda değişiklik → CLAUDE.md + AGENTS.md güncelle
- Design system değişikliği → DESIGN.md Stitch'te yeniden export et
- Yeni modül/package ekleme → CLAUDE.md dosya organizasyonu güncelle
- Yeni denetim kuralı → AGENTS.md review guidelines güncelle
```

**Gerekçe:** Contribution guide "canonical-stack-aware katkı" tanımlar. AI araçları katkı sürecinin merkezinde olduğu halde bu süreçte yer almıyor.

---

### `15-quality-gates-and-ci-rules.md` — Ek Madde

**Eklenecek:** AI çıktı-spesifik gate kuralı.

```markdown
## XX. AI Üretimli Kod İçin Quality Gate Kuralları

AI araçlarının (Claude Code, MoAI-ADK, Codex, Stitch) ürettiği kod,
insan yazımı kodla birebir aynı quality gate'lerden geçer.

Aşağıdaki bypass'lar AI aracı tarafından yapılsa dahi kabul edilmez:
- --no-verify ile commit
- eslint-disable ile lint suppress
- @ts-ignore ile type bypass
- test skip (it.skip, describe.skip)
- any type kullanımı

MoAI-ADK'nın TRUST 5 pre-submission quality gate'i
(test, okunabilirlik, güvenlik, izlenebilirlik kontrolü)
bu projenin CI gate'leriyle tutarlı çalışmalıdır.
```

---

### `32-definition-of-done.md` — Ek Maddeler

```markdown
## XX. AI Destekli İş İçin Ek DoD Maddeleri

- [ ] SPEC varsa: SPEC kabul kriterleri karşılanmış mı?
- [ ] AI aracına verilen talimat, ilgili spec ve ADR ile tutarlı mı?
- [ ] Stitch çıktısı kullanıldıysa: DESIGN.md güncel mi?
- [ ] Codex review yapıldı mı? P0/P1 bulgu kalmadı mı?
- [ ] Talimat dosyaları (CLAUDE.md, AGENTS.md) değişikliğe göre güncellendi mi?
```

---

### `35-document-map.md` — Güncellemeler

1. **Bölüm 10'a yeni senaryo:**
```markdown
## 10.8. AI aracıyla iş yapacağım
Oku:
- `40-ai-workflow-and-tooling.md`
- `41-ai-instruction-standards.md`
- CLAUDE.md (proje talimatı)
- AGENTS.md (denetim talimatı)
- İlgili SPEC varsa: `.moai/specs/<SPEC-ID>.md`
```

2. **Bölüm 11'e yeni zincir:**
```markdown
## 11.9. AI tooling zinciri
- `40`
- `41`
- `42`
```

3. **Bloklayıcı sete ekleme:** `40-ai-workflow-and-tooling.md`

---

## C.2. Yeni Ana Doküman: AI Workflow and Tooling

**Dosya adı:** `40-ai-workflow-and-tooling.md`
**Belge ailesi:** Operasyonel standart (22-29 ile aynı katman, 35-document-map.md bölüm 5.6)
**Otorite katmanı:** Altıncı katman — hiçbir foundation, alan standardı veya canonical karar dokümanını geçersiz kılamaz
**Bağlı olduğu üst dokümanlar:** 16-tooling-and-governance.md, 15-quality-gates-and-ci-rules.md, 01-working-principles.md
**Doğrudan etkileyeceği dokümanlar:** 41, 42, 21, 30, 32, 35

**İçerik yapısı:**

```
1. Doküman Kimliği
   (Boilerplate doküman kimliği convention'ına tam uyumlu:
    doküman adı, dosya adı, tür, durum, kapsam,
    bağlı olduğu üst dokümanlar, etkileyeceği dokümanlar)

2. Amaç
   Bu doküman şu sorulara net cevap verir:
   - Hangi AI araçları bu projede kullanılır ve neden?
   - Bu araçlar birbirleriyle nasıl etkileşir?
   - Talimat dosyalarının otorite sırası nedir?
   - AI çıktısı hangi kalite kurallarından geçer?
   - Bir araç kullanılamaz hale gelirse ne olur?
   - Görev karmaşıklığına göre hangi araçlar zorunlu, hangileri opsiyonel?
   - AI araçlarına gönderilen veri nasıl korunur?

3. Temel Tez
   "AI araçları boilerplate geliştirme sürecinin merkezi aktörleridir;
    documentation-first ilkesi bu araçların talimat, konfigürasyon ve
    çıktılarını da kapsar. Ancak araçlar boilerplate'in değerini taşımaz;
    doküman seti taşır. Araçlar değişebilir, dokümanlar kalır."

4. Otorite Hiyerarşisi ve Çelişki Çözümü
   4.1. Talimat dosyalarının otorite sırası
        Talimat dosyaları (CLAUDE.md, AGENTS.md, .moai/config/, DESIGN.md)
        35-document-map.md'deki 7. katmanın (denetim ve tamamlanma) altındadır.
        Hiçbir talimat dosyası boilerplate dokümanını geçersiz kılamaz.
   4.2. Çelişki çözüm kuralı
        Talimat dosyası ↔ boilerplate dokümanı çelişirse → talimat dosyası güncellenir.
        Codex bulgusu ↔ Claude Code önerisi çelişirse → boilerplate dokümanı hakemdir.
        DESIGN.md ↔ 22-design-tokens-spec.md çelişirse → 22 kazanır, DESIGN.md yeniden export edilir.
   4.3. DESIGN.md statüsü
        DESIGN.md, 22-design-tokens-spec.md'nin türevdir, alternatifi değildir.

5. Araç Envanteri ve Rol Tanımları
   5.1. Claude Code — Merkezi Geliştirme Motoru
        - CLAUDE.md talimat sistemi
        - MCP entegrasyonu (Stitch MCP dahil)
        - Agent Teams (multi-agent orchestration)
        - Hooks ve skills
   5.2. MoAI-ADK — SPEC Üretimi ve Orkestrasyon
        - Harness Engineering paradigması
        - EARS formatı ile SPEC üretimi
        - /moai slash command'ları
        - TRUST 5 kalite framework'ü
        - .moai/ dizin yapısı ve konfigürasyonu
   5.3. OpenAI Codex CLI — Bağımsız Denetim
        - AGENTS.md talimat sistemi
        - @codex review ile PR denetimi
        - Read-only audit modu
        - Sandbox modları (read-only, auto, full-auto)
   5.4. Google Stitch — Arayüz Tasarımı ve Token Üretimi
        - DESIGN.md tasarım sistemi dosyası
        - Stitch MCP entegrasyonu
        - stitch-to-react skill
        - Çıktı formatları (HTML/CSS, Tailwind, React/JSX)

6. Araçlar Arası Etkileşim Modeli
   6.1. MoAI-ADK → Claude Code: SPEC-to-Implementation
        - /moai plan → SPEC üret
        - /moai run <SPEC-ID> → Claude Code implement eder
        - /moai sync → doküman senkronizasyonu + PR
        Bağlantı: Claude Code'un native slash command sistemi
   6.2. Google Stitch → Claude Code: Design-to-Code
        - Stitch'te tasarım → DESIGN.md export
        - Stitch MCP ile canlı tasarım verisi
        - stitch-to-react skill ile otomatik component dönüşümü
        Bağlantı: MCP protokolü + skill sistemi
   6.3. Claude Code → Codex: Implementation-to-Review
        - Claude Code ile yazılan kod → commit/PR
        - @codex review veya otomatik review
        - Codex bulguları → düzeltme döngüsü
        Bağlantı: Git/GitHub üzerinden dolaylı
   6.4. Stitch → Claude Code → Codex: Tam Pipeline
        Tasarım → DESIGN.md → Component üretimi → PR → Codex review
   6.5. Çakışma kuralı
        Aynı anda tek orkestratör aktif olur.
        MoAI-ADK aktifken Agent Teams kullanılmaz.

7. Görev Karmaşıklığına Göre Araç Kullanım Eşiği
   (Solo/küçük ekip sürdürülebilirliği için kritik)

   | Görev Türü          | SPEC  | Stitch | Codex Review |
   |---------------------|-------|--------|--------------|
   | Bug fix (1-2 dosya) | —     | —      | Önerilen     |
   | Küçük UI düzeltme   | —     | —      | Önerilen     |
   | Yeni utility/hook   | —     | —      | Zorunlu      |
   | Yeni component      | —     | Önerilen| Zorunlu     |
   | Yeni ekran          | Zorunlu| Zorunlu| Zorunlu     |
   | Yeni feature modülü | Zorunlu| İhtiyaca göre| Zorunlu |
   | Mimari değişiklik   | Zorunlu| —      | Zorunlu      |
   | Design system günc. | —     | Zorunlu| Zorunlu      |

   Codex review kademeli tetiklenmeli:
   - Otomatik: packages/ altındaki değişikliklerde (shared kod)
   - Otomatik: 50+ satır değişiklikte
   - Manuel: bug fix, docs, config değişikliklerinde isteğe bağlı

8. Görev Bazlı Araç Seçimi (Workflow)
   8.1. Yeni feature geliştirme
        → /moai plan → /moai run → Codex review
   8.2. Yeni ekran/component tasarımı
        → Stitch → DESIGN.md → Claude Code (stitch-to-react) → Codex review
   8.3. Bug fix
        → Claude Code (doğrudan) → Codex review (önerilen)
   8.4. Refactoring
        → /moai plan (etki analizi) → /moai run → /moai sync → Codex review
   8.5. Design system güncelleme
        → Stitch (DESIGN.md güncelle) → Claude Code (token sync) → Codex review

9. Talimat Dosyaları Yönetimi
   9.1. Dosya-araç eşleştirmesi
        - CLAUDE.md → Claude Code
        - AGENTS.md → Codex CLI
        - .moai/config/ → MoAI-ADK
        - DESIGN.md → Stitch → Claude Code
   9.2. Tutarlılık kuralı
        Tüm talimat dosyaları canonical karar katmanını (ADR-001 → ADR-019 + 36/37/38 canonical governance belgeleri)
        aynı biçimde yansıtmak zorundadır.
   9.3. Değişiklik senkronizasyonu
        Canonical katmanda değişiklik → tüm talimat dosyaları güncellenir.

10. AI Araç Güvenlik Politikası
    10.1. Context güvenliği
          - .env, credentials, secret dosyaları AI aracının context'ine girmemeli
          - .claudeignore dosyasında sensitive path'ler tanımlanmalı
          - .moai/memory/ dizini .gitignore'da olmalı
    10.2. Veri gönderimi
          - Stitch'e yüklenen tasarımlarda gerçek kullanıcı verisi kullanılmamalı
          - Codex review sırasında secret pattern taraması yapılmalı
    10.3. Üçüncü parti risk bilinci
          - 4 farklı şirketin aracı kullanılıyor (Anthropic, OpenAI, Google, modu-ai)
          - Her aracın veri işleme politikası bilinmeli
          - Proje-spesifik compliance gereksinimleriyle uyum doğrulanmalı
    10.4. 27-security-and-secrets-baseline.md referansı
          AI araç güvenliği, 27'deki secret yönetim kurallarının doğal uzantısıdır.

11. Araç Bağımsızlık İlkesi ve Yedekleme Stratejisi
    Temel ilke: AI araçları boilerplate'in değerini taşımaz; doküman seti taşır.
    Araçlar değişebilir, dokümanlar kalır.

    | Araç         | Kritiklik | Kaybolursa Kalan Varlık  | Alternatif Yol              |
    |--------------|-----------|--------------------------|------------------------------|
    | Claude Code  | Yüksek    | CLAUDE.md, .claude/      | Codex CLI, Cursor, başka agent|
    | MoAI-ADK     | Orta      | .moai/specs/ SPEC'ler    | Manuel SPEC üretimi          |
    | Google Stitch| Düşük     | DESIGN.md                | Figma + manual token export  |
    | Codex CLI    | Orta      | AGENTS.md                | Claude Code review, manual   |

    Hiçbir araç, boilerplate doküman setini veya canonical kararları kendi formatına kilitleyemez.

12. Araç Versiyon Baseline
    | Araç            | Baseline              | Güncelleme Politikası                           |
    |-----------------|-----------------------|--------------------------------------------------|
    | MoAI-ADK        | v0.37.0+              | moai update; breaking change'de SPEC formatı doğrulanır|
    | Stitch MCP      | @_davideast/stitch-mcp| Semantic versioning izlenir                      |
    | Codex CLI       | Latest stable          | AGENTS.md uyumu doğrulanır                       |
    | Claude Code     | Opus 4.6              | CLAUDE.md uyumu doğrulanır                       |

13. Bootstrap Sırası — moai init ve Boilerplate Uyumu
    moai init, .moai/ ve .claude/ dizinlerini otomatik oluşturur.
    Boilerplate'in kendi CLAUDE.md ve .claude/ konfigürasyonuyla çakışma riski vardır.

    Zorunlu sıra:
    1. Boilerplate repo bootstrap (20-initial-implementation-checklist.md'ye göre)
    2. CLAUDE.md oluştur (boilerplate taslağından)
    3. moai init çalıştır — mevcut CLAUDE.md korunsun
    4. MoAI-ADK'nın ürettiği .claude/ içeriği mevcut konfigürasyonla merge edilmeli,
       üzerine yazılmamalı

14. CI/CD Entegrasyonu
    14.1. Codex GitHub Action: PR açıldığında otomatik review (CI step)
    14.2. Talimat dosyası tutarlılık kontrolü: CI'da CLAUDE.md'deki canonical kararlar
          listesi → ADR dosya adlarıyla karşılaştırma scripti
    14.3. Token doğrulaması: DESIGN.md → packages/design-tokens/ tutarlılık kontrolü

15. Hata Senaryoları ve Fallback
    15.1. MoAI-ADK spec üretemezse → SPEC manuel yazılır (41'deki EARS formatına göre)
    15.2. Stitch MCP bağlantısı koparsa → DESIGN.md mevcut halinde kalır, component
          üretimi Claude Code ile DESIGN.md referanslı olarak devam eder
    15.3. Codex review yanlış pozitif verirse → boilerplate dokümanı hakem olarak
          kullanılır, yanlış bulgu AGENTS.md'de exception olarak kayıt edilir
    15.4. DESIGN.md ile 22-design-tokens-spec.md eşleşmezse → 22 kazanır,
          DESIGN.md Stitch'te yeniden üretilir
    15.5. moai init konfigürasyonu bozarsa → git reset ile geri al,
          bootstrap sırasına (bölüm 13) dön

    Temel kural: Çalışamayan araç governance'ı kıramaz. İnsani alternatif yol her zaman açıktır.

16. Onboarding — Yeni Geliştirici Kılavuzu
    16.1. Araç kurulumu: moai init + Stitch MCP ayarları + Codex GitHub app
    16.2. Okuma sırası: 40 → 41 → CLAUDE.md → AGENTS.md
    16.3. İlk görev: basit bir bug fix ile pipeline'ı test et
          (Claude Code ile düzelt → PR aç → @codex review → merge)
    16.4. İkinci görev: /moai plan ile ilk SPEC üret, /moai run ile implement et
    16.5. Üçüncü görev: Stitch'te basit bir ekran tasarla → DESIGN.md → component üret

17. Anti-pattern'ler
    17.1. SPEC olmadan MoAI-ADK ile karmaşık iş başlatmak
    17.2. DESIGN.md olmadan Stitch çıktısını projeye almak
    17.3. AGENTS.md olmadan Codex review'a güvenmek
    17.4. AI çıktısını review/test olmadan merge etmek
    17.5. AI aracına canonical kararları sorgulatmak
    17.6. Talimat dosyalarını git dışında tutmak
    17.7. Farklı talimat dosyalarında çelişen kurallar bırakmak
    17.8. Her küçük iş için tam SPEC + Stitch + review döngüsü zorunlu kılmak
          (eşik tablosuna bak, bölüm 7)
    17.9. AI aracına .env, secret veya credential dosyalarını okutmak
    17.10. Tek araca kilitlenmek — yedekleme stratejisi bilinmeli (bölüm 11)

18. Kaynak Bilinci
    Claude Code ve Codex CLI API kullanım maliyeti proje bütçesinde dikkate alınmalıdır.
    Google Stitch şu an ücretsiz (Labs aşaması). MoAI-ADK açık kaynak ve ücretsiz.
    Maliyet optimizasyonu: eşik tablosu (bölüm 7) gereksiz araç kullanımını önler.

19. Onay Kriterleri
```

**Gerekçe:** Bu doküman, dört AI aracının boilerplate geliştirme sürecindeki somut rollerini, gerçek entegrasyon mekanizmalarını (MCP, slash command, AGENTS.md, DESIGN.md) ve birbirleriyle etkileşim protokollerini tek yerden tanımlar. Ayrıca otorite hiyerarşisi, güvenlik, vendor lock-in, hata senaryoları ve onboarding konularını ele alarak AI entegrasyonunu sürdürülebilir kılar.

---

## C.3. Yeni Ana Doküman: AI Talimat Standartları

**Dosya adı:** `41-ai-instruction-standards.md`
**Belge ailesi:** Operasyonel standart (40 ile aynı katman)
**Bağlı olduğu üst dokümanlar:** 40-ai-workflow-and-tooling.md, 16-tooling-and-governance.md
**Doğrudan etkileyeceği dokümanlar:** CLAUDE.md, AGENTS.md, 42, 30

**İçerik yapısı:**

```
1. Doküman Kimliği
   (Boilerplate doküman kimliği convention'ına tam uyumlu)

2. Amaç
   Bu doküman şu sorulara net cevap verir:
   - AI araçlarına verilen talimatların formatı ne olmalı?
   - Her talimat dosyasının zorunlu ve koşullu bölümleri neler?
   - Context bütçesi nasıl yönetilmeli?
   - SPEC, DESIGN.md ve talimat dosyalarının kalite kriterleri neler?

3. Temel Tez
   "Documentation-first projede, AI araçlarına verilen talimatlar da dokümandır.
    Talimat kalitesi kontrol edilmezse AI çıktı kalitesi kişisel dikkat
    seviyesine bağlı kalır."

4. Context Bütçesi Yönetimi
   AI araçlarının context window'u sınırlıdır. Aynı anda yüklenen
   talimat + tasarım + spec + kod context'in önemli kısmını tüketir.

   4.1. CLAUDE.md bütçesi
        - Kısa ve öz olmalı — 500 satırı geçmemeli
        - Canonical kararlar, dosya organizasyonu, dil kuralları: çekirdek (her zaman)
        - Detay kurallar: "detay için şu dokümanı oku" pointer'ları ile referans
   4.2. DESIGN.md bütçesi
        - Tamamı değil, aktif çalışılan alanın token subset'i verilmeli
        - Stitch MCP ihtiyaç duyulduğunda aktifleştirilmeli, her oturumda değil
   4.3. SPEC bütçesi
        - Aynı anda tek SPEC aktif olmalı
        - Tamamlanmış SPEC'ler context'ten çıkarılmalı
   4.4. MCP araç bütçesi
        - Stitch MCP sadece tasarım işi yapılırken aktif
        - Gereksiz MCP bağlantısı context ve performans maliyeti üretir

5. Talimat Dosyası Anatomileri
   5.1. CLAUDE.md Anatomisi
        Katmanlı yapı:
        - Çekirdek (her zaman yüklenir, ~40-50 satır):
          proje kimliği, canonical kararlar, dosya organizasyonu, dil kuralları
        - Referans indexi (Claude Code Read ile erişir):
          component governance → 23, platform adaptation → 26,
          error states → 25, navigation → 08, security → 27
        - Koşullu bölümler: MoAI-ADK entegrasyonu, Stitch entegrasyonu,
          proje-spesifik iş kuralları
        - Güncelleme tetikleyicileri
   4.2. AGENTS.md Anatomisi
        - Zorunlu: ## Review guidelines (boilerplate canonical stack)
        - Zorunlu: ## Architecture Rules (bağımlılık yönleri)
        - Zorunlu: ## Testing Requirements
        - Koşullu: dizin-spesifik AGENTS.md (ör. packages/ui/AGENTS.md)
   4.3. .moai/config/ Anatomisi
        - quality.yaml: development_mode (tdd|ddd), TRUST 5 kuralları
        - Proje-spesifik agent konfigürasyonu
   4.4. DESIGN.md Anatomisi
        - Stitch tarafından üretilir — elle düzenlenmez
        - İçerik: renk token'ları, tipografi, spacing, component pattern'leri
        - 22-design-tokens-spec.md ile eşleşme kuralı:
          - Stitch "color" → boilerplate "semantic color token"
          - Stitch "typography" → boilerplate "typography token"
          - Stitch "spacing" → boilerplate "spacing scale token"
5. MoAI-ADK SPEC Formatı — EARS
   5.1. EARS syntax kuralları
        - "When [trigger], the system shall [response]"
        - "While [state], the system shall [behavior]"
        - "Where [feature], the system shall [behavior]"
   5.2. SPEC-boilerplate eşleşmesi
        - Her SPEC'in ilgili boilerplate dokümanına referansı olmalı
        - Canonical stack constraint'leri SPEC'te kısıtlama olarak belirtilmeli
   5.3. SPEC kalite kriterleri
        - Kabul kriteri ölçülebilir mi?
        - Test senaryosu türetilebilir mi?
        - Canonical kararlarla çelişme var mı?
6. Stitch Talimat Formatı
   6.1. Ekran tanımı şablonu
        - Ekranın amacı ve kullanıcı akışı
        - Platform hedefi (web, mobil, her ikisi)
        - Mevcut DESIGN.md referansı
        - Accessibility gereksinimleri
   6.2. Component tanımı şablonu
   6.3. Token beklentisi
        - Çıktıdan hangi token katmanı türetilecek (semantic, primitive, component)
7. Adlandırma Kuralları
   7.1. SPEC dosyaları: `SPEC-001.md` biçiminde adlandırılır (`.moai/specs/` altında, artan sıra ile).
   7.2. DESIGN.md: tek dosya, proje kökünde
   7.3. Dizin-spesifik AGENTS.md: {dizin}/AGENTS.md
   7.4. Stitch export'ları: tooling/ai/stitch/exports/{tarih}-{ekran-adı}/
8. Versiyon Yönetimi
   - Tüm talimat dosyaları git'te
   - CLAUDE.md ve AGENTS.md değişiklikleri PR review kapsamında
   - .moai/specs/ SPEC dokümanları commit edilir
   - DESIGN.md değişiklikleri Stitch export tarihiyle etiketlenir
9. Anti-pattern'ler
10. Onay Kriterleri
```

---

## C.4. Yeni Ana Doküman: Stitch Pipeline Spec

**Dosya adı:** `46-stitch-pipeline-spec.md`
**Belge ailesi:** Design system / UX (04, 05, 22 ile aynı aile)
**Bağlı olduğu üst dokümanlar:** 22-design-tokens-spec.md, ADR-007, 04-design-system-architecture.md, 40-ai-workflow-and-tooling.md
**Doğrudan etkileyeceği dokümanlar:** 22, 23, 33, 35

**İçerik yapısı:**

```
1. Doküman Kimliği
2. Amaç
3. Temel Tez
   - "Stitch, boilerplate'in design-to-code pipeline'ıdır.
     DESIGN.md üzerinden tasarım kararlarını kodlanabilir token'lara,
     component yapılarına ve ekran layout'larına dönüştürür."
4. Pipeline Genel Akışı
   4.1. Giriş noktaları
        a) Boilerplate dokümanlarından türetilen tasarım briefingi
        b) Mevcut DESIGN.md (iterasyon durumunda)
        c) Referans ekran/site görseli (Stitch'e upload)
   4.2. Adım 1 — Stitch'te Tasarım Oluşturma
        - stitch.withgoogle.com üzerinden
        - Doğal dil prompt veya görsel girdi
        - Mevcut DESIGN.md yüklenerek tutarlılık sağlanır
        - Multi-screen generation ile akış tasarımı
   4.3. Adım 2 — DESIGN.md Export
        - Stitch canvas'ından DESIGN.md üretimi
        - İçerik: renk, tipografi, spacing, component pattern
        - Proje köküne yerleştirme
   4.4. Adım 3 — Stitch MCP ile Claude Code Entegrasyonu
        - MCP konfigürasyonu (.claude/settings.json):
          { "mcpServers": { "stitch": { "command": "npx",
            "args": ["@_davideast/stitch-mcp", "proxy"] } } }
        - extract_design_context → Design DNA çıkarımı
        - fetch_screen_code → HTML/CSS indirme
        - fetch_screen_image → Screenshot indirme
   4.5. Adım 4 — Component Üretimi
        a) stitch-to-react skill ile otomatik dönüşüm
           npx skills add google-labs-code/stitch-skills --skill react:components
        b) Claude Code ile DESIGN.md referanslı manuel component üretimi
   4.6. Adım 5 — Token Eşleştirme
        - Stitch DESIGN.md token'ları → 22-design-tokens-spec.md katmanları:
          | Stitch Çıktısı      | Boilerplate Token Katmanı |
          |----------------------|---------------------------|
          | Color roles          | Semantic color tokens     |
          | Color palette        | Primitive color tokens    |
          | Typography mapping   | Typography tokens         |
          | Spacing scale        | Spacing tokens            |
          | Component patterns   | Component tokens          |
        - ADR-007 (Tailwind CSS + NativeWind, semantic token-first) ile uyum kontrolü
        - Somut dönüşüm mekanizması:
          a) Stitch DESIGN.md'deki CSS değişkenleri (--color-primary: #3B82F6)
             → packages/design-tokens/ altındaki kaynak dosyalara yazılır
          b) Kaynak dosyalar → tailwind.config.js (web: colors.primary)
             ve NativeWind config (mobile) olarak dönüştürülür
          c) Dönüşüm: Claude Code'a talimat olarak verilir veya
             tooling/ai/stitch/ altındaki dönüşüm scripti ile otomatikleştirilir
          d) Eşleşmeyen token'lar (Stitch'te var, 22'de karşılığı yok)
             → uyarı üretilir, 22-design-tokens-spec.md'ye ekleme gerekir
        - DESIGN.md ile 22 çelişirse → 22 kazanır (40 bölüm 4.2 kuralı)

   4.7. Adım 6 — Doğrulama
        - Üretilen component'ler quality gate'lerden geçer
        - Codex review ile bağımsız denetim
        - Token'lar 22-design-tokens-spec.md ile karşılaştırılır
        - CI'da DESIGN.md → packages/design-tokens/ tutarlılık kontrolü (40 bölüm 14.3)
5. Kalite Kapıları
   5.1. DESIGN.md kalitesi: token tanımları tam mı, boilerplate token katmanlarıyla eşleşiyor mu
   5.2. Component kalitesi: accessibility, responsive, platform adaptation
   5.3. Token tutarlılığı: Stitch çıktısı ile packages/design-tokens/ senkron mu
6. Dosya ve Çıktı Organizasyonu
   - DESIGN.md → proje kökü
   - Stitch export'ları → tooling/ai/stitch/exports/
   - Üretilen component'ler → packages/ui/src/components/ veya app feature dizini
   - Token dosyaları → packages/design-tokens/
7. Anti-pattern'ler
   7.1. Stitch'i DESIGN.md olmadan kullanmak (her seferinde farklı stil)
   7.2. DESIGN.md'yi elle düzenlemek (Stitch'le senkronizasyon bozulur)
   7.3. Token eşleştirmesi yapmadan Stitch çıktısını doğrudan kullanmak
   7.4. Stitch'e canonical stack dışı framework hedefi vermek
8. Onay Kriterleri
```

---

# D. KAPSAM 2: BOILERPLATE'TEN TÜRETİLEN PROJELERDE AI KONUMLANDIRMASI

---

## D.1. Proje Başlatma Kılavuzu

### Adım 1 — Repo Fork/Clone + Boilerplate Bootstrap

```bash
# Boilerplate'ten yeni proje türet
git clone <boilerplate-repo> <proje-adı>
cd <proje-adı>

# ÖNCELİKLE boilerplate bootstrap (20-initial-implementation-checklist.md'ye göre)
# Repo yapısı, dependency kurulumu, temel konfigürasyon
```

### Adım 2 — CLAUDE.md Oluştur (moai init'ten ÖNCE)

Boilerplate CLAUDE.md taslağından proje CLAUDE.md'sini oluştur.
Bu adım moai init'ten önce yapılmalı — aksi halde moai init
kendi CLAUDE.md'sini üretir ve boilerplate kararları kaybolur.

### Adım 3 — moai init (mevcut konfigürasyonu koruyarak)

```bash
# MoAI-ADK başlat — mevcut CLAUDE.md korunmalı
moai init
# → .moai/ dizini oluşturulur
# → .claude/ dizini oluşturulur (agents, commands, hooks)
# DİKKAT: moai init'in ürettiği .claude/ içeriği mevcut
# boilerplate konfigürasyonuyla merge edilmeli, üzerine yazılmamalı
# Eğer moai init CLAUDE.md'yi değiştirdiyse → git diff ile kontrol et,
# canonical kararlar bölümünün korunduğunu doğrula
```

### Adım 4 — CLAUDE.md'yi Projeye Özelleştir

Boilerplate CLAUDE.md'sindeki çekirdek yapıyı koruyarak proje-spesifik bölümleri ekle:

| Bölüm | İşlem |
|---|---|
| Proje Kimliği | Proje adı, amacı, hedef kullanıcısı ile güncelle |
| Canonical Kararlar | **DEĞİŞTİRME** — boilerplate'ten miras, kilitli |
| Dependency Kuralları | **DEĞİŞTİRME** — boilerplate'ten miras |
| MoAI-ADK Entegrasyonu | Proje-spesifik SPEC naming convention ekle |
| Stitch Entegrasyonu | Proje teması ve DESIGN.md referansı ekle |
| Dosya Organizasyonu | Proje-spesifik feature dizinleri ekle |
| Proje-Spesifik Kurallar | **YENİ:** API endpoint'leri, iş kuralları, üçüncü parti entegrasyonlar |

### Adım 5 — AGENTS.md'yi Projeye Özelleştir

Boilerplate AGENTS.md'sini kopyala, ardından:

| Bölüm | İşlem |
|---|---|
| Review Guidelines | Proje-spesifik review kuralları ekle (ör. HIPAA compliance, rate limiting) |
| Architecture Rules | Proje modül yapısına göre genişlet |
| Testing Requirements | Proje-spesifik test gereksinimleri ekle |
| Canonical Stack | **DEĞİŞTİRME** — boilerplate'ten miras |

### Adım 6 — DESIGN.md Oluştur

1. Stitch'te proje brand identity'sini tanımla
2. Mevcut marka renkleri, tipografi, spacing varsa yükle
3. İlk ekran setini tasarla
4. DESIGN.md export et → proje köküne yerleştir
5. CLAUDE.md'de DESIGN.md referansını aktifle

### Adım 7 — Stitch MCP Yapılandır

```json
// .claude/settings.json
{
  "mcpServers": {
    "stitch": {
      "command": "npx",
      "args": ["@_davideast/stitch-mcp", "proxy"]
    }
  }
}
```

### Adım 8 — Codex Otomatik Review Yapılandır

GitHub repo ayarlarında:
1. Codex GitHub app'ini repo'ya ekle
2. Otomatik review'u etkinleştir (her yeni PR'da)
3. AGENTS.md'nin doğru konumda olduğunu doğrula

### Adım 9 — İlk Doğrulama

```bash
# MoAI-ADK doğrulama
# Claude Code içinde:
/moai project    # → product.md, structure.md, tech.md üretilmeli

# Stitch doğrulama
# Claude Code içinde:
# Stitch MCP araçlarını çağır → extract_design_context çalışmalı

# Codex doğrulama
# Test PR aç → @codex review → AGENTS.md kurallarına göre review gelmeli
```

---

## D.2. Talimat Standartları — Türetilen Projeler

### Claude Code (CLAUDE.md) Kalite Kriterleri

| Kriter | Zorunluluk | Doğrulama |
|---|---|---|
| Canonical kararlar bölümü var ve boilerplate ile aynı | Zorunlu | Diff kontrolü |
| Proje-spesifik dosya organizasyonu güncel | Zorunlu | Gerçek dizin yapısıyla karşılaştır |
| MoAI-ADK entegrasyonu tanımlı | Zorunlu (kullanılıyorsa) | `/moai plan` test et |
| Stitch/DESIGN.md referansı tanımlı | Zorunlu (kullanılıyorsa) | DESIGN.md varlığını kontrol et |
| Proje-spesifik iş kuralları eklenmiş | Önerilen | Domain uzmanı review |
| Anti-pattern listesi proje-spesifik | Önerilen | Geçmiş hatalardan türetilmiş mi |

### MoAI-ADK (SPEC) Kalite Kriterleri

| Kriter | Zorunluluk | Doğrulama |
|---|---|---|
| EARS formatında yazılmış | Zorunlu | Format kontrolü |
| Kabul kriterleri ölçülebilir | Zorunlu | Test senaryosu türetilebilir mi |
| Canonical stack constraint'leri belirtilmiş | Zorunlu | ADR referansları var mı |
| İlgili boilerplate dokümanına referans var | Önerilen | Referans kontrolü |
| Platform davranışı (web/mobil fark) belirtilmiş | Koşullu | Platform-spesifik iş varsa |

### Codex (AGENTS.md) Kalite Kriterleri

| Kriter | Zorunluluk | Doğrulama |
|---|---|---|
| Review guidelines bölümü var | Zorunlu | Dosya kontrolü |
| Canonical stack koruması tanımlı | Zorunlu | "DO NOT suggest alternatives" var mı |
| Architecture rules bölümü var | Zorunlu | Bağımlılık yönleri tanımlı mı |
| Testing requirements bölümü var | Zorunlu | Test zorunlulukları belirtilmiş mi |
| Proje-spesifik compliance kuralları | Koşullu | Düzenleyici gereksinim varsa |

### Stitch (DESIGN.md) Kalite Kriterleri

| Kriter | Zorunluluk | Doğrulama |
|---|---|---|
| Stitch'ten export edilmiş (elle yazılmamış) | Zorunlu | Export metadata kontrolü |
| Renk token'ları tam | Zorunlu | Primary, surface, accent minimum |
| Tipografi tanımları tam | Zorunlu | Heading, body, caption minimum |
| Spacing scale tanımlı | Zorunlu | En az 4-8 kademe |
| 22-design-tokens-spec.md ile eşleşiyor | Zorunlu | Token katmanı mapping kontrolü |

---

## D.3. Proje-Spesifik Uyarlama Kuralları

### Daraltma (Boilerplate → Proje)

| Alan | Daraltma Şekli | Örnek |
|---|---|---|
| Görev bazlı araç seçimi | Projede kullanılmayan akışlar atlanır | Stitch kullanılmıyorsa 42 referansı kaldırılır |
| AGENTS.md review kuralları | Proje risk alanına göre daraltılır | E-ticaret değilse ödeme review kuralı gereksiz |
| MoAI-ADK metodoloji | Projeye göre TDD veya DDD seçilir | Greenfield → TDD; legacy migration → DDD |
| Stitch pipeline adımları | Projede kullanılmayan adımlar atlanır | Sadece web hedefleniyorsa mobil adaptation step'i atlanır |

### Genişletme (Proje > Boilerplate)

| Alan | Genişletme Şekli | Örnek |
|---|---|---|
| CLAUDE.md iş kuralları | Proje domain'i eklenir | "Kullanıcı verisi KVKK uyumlu işlenmeli" |
| AGENTS.md compliance | Sektörel denetim kuralları eklenir | HIPAA, PCI-DSS, KVKK kontrolü |
| SPEC template | Domain-spesifik SPEC alanları eklenir | "API endpoint spec", "payment flow spec" |
| DESIGN.md | Marka kimliği eklenir | Logo, marka renkleri, tipografi |
| Dizin-spesifik AGENTS.md | Alt modüller için özel review kuralları | `packages/payment/AGENTS.md` |

### Değiştirilemeyecekler

- ADR kararları (ADR-001→011) → canonical stack kilitli
- Dependency policy kuralları (37) → yeni dependency aynı süreçten geçer
- Compatibility matrix (38) → versiyon kısıtları geçerli
- Quality gate minimum'ları (15) → AI çıktısı da dahil
- TRUST 5 framework'ü → MoAI-ADK kullanılıyorsa

---

## D.4. Bakım Süreci

### Tetikleyici Bazlı Güncelleme Matrisi

| Tetikleyici | CLAUDE.md | AGENTS.md | .moai/config | DESIGN.md |
|---|---|---|---|---|
| Yeni modül/package | Dosya organizasyonu güncelle | Yeni modül review kuralı ekle | — | — |
| Yeni üçüncü parti entegrasyon | İş kuralları ekle | Entegrasyon review kuralı ekle | — | — |
| Design system değişikliği | Stitch referansı güncelle | Token review kuralı güncelle | — | Stitch'te yeniden export |
| Boilerplate upstream güncelleme | Canonical kararlar senkronize | Canonical stack senkronize | moai update | — |
| MoAI-ADK güncelleme | Versiyon notu | — | moai update ile otomatik | — |
| Codex review'da tekrarlayan bulgu | Anti-pattern ekle | Review guideline ekle | — | — |
| Yeni ADR kararı (nadir) | Canonical bölüm güncelle | Canonical stack güncelle | Constraint güncelle | — |

### Periyodik Bakım

| Periyot | İşlem |
|---|---|
| Her sprint sonu | CLAUDE.md dosya organizasyonunun gerçek dizin yapısıyla uyumunu kontrol et |
| Her PR | Codex otomatik review çalışıyor mu kontrol et |
| Her major release öncesi | Codex read-only audit: `codex -s read-only "audit the codebase"` |
| Her çeyrek | Boilerplate upstream ile talimat dosyalarını senkronize et |
| Stitch pipeline çalıştırıldığında | DESIGN.md → 22-design-tokens-spec.md eşleşme kontrolü |

### Senkronizasyon Protokolü

```
Boilerplate güncellendi (upstream)
  │
  ├─ Canonical katman değişikliği var mı? (ADR-001 → ADR-019, 36, 37, 38)
  │   ├─ EVET → ZORUNLU güncelleme:
  │   │   ├─ CLAUDE.md canonical kararlar bölümü
  │   │   ├─ AGENTS.md canonical stack bölümü
  │   │   └─ .moai/config quality constraint'leri
  │   └─ HAYIR → devam
  │
  ├─ Operasyonel katman değişikliği var mı? (16, 30, 15, 32)
  │   ├─ EVET → Proje kararıyla güncelleme (review sonrası)
  │   └─ HAYIR → devam
  │
  └─ Yeni araç/şablon var mı? (40, 41, 42)
      ├─ EVET → Değerlendirme sonrası ekleme
      └─ HAYIR → senkronizasyon tamamlandı
```

---

# E. UYGULAMA YOL HARİTASI

Önceliklendirilmiş adım listesi:

| Sıra | Adım | Dosya | Efor | Bağımlılık | Gerekçe |
|---|---|---|---|---|---|
| **1** | CLAUDE.md oluştur | `CLAUDE.md` | Düşük | Yok | En düşük efor, en yüksek günlük etki. Claude Code her oturumda okur. Canonical kararları hemen context'e taşır |
| **2** | AGENTS.md oluştur | `AGENTS.md` | Düşük | Yok | Codex review'u hemen proje-spesifik hale getirir. CLAUDE.md ile paralel yapılabilir |
| **3** | AI Workflow dokümanını yaz | `40-ai-workflow-and-tooling.md` | Yüksek | 1, 2 | Dört aracın rol, etkileşim ve governance tanımı. Diğer tüm güncellemelerin referans noktası |
| **4** | Talimat standartlarını yaz | `41-ai-instruction-standards.md` | Orta | 3 | CLAUDE.md, AGENTS.md, SPEC, DESIGN.md formatlarının standartları |
| **5** | Stitch pipeline spec'ini yaz | `46-stitch-pipeline-spec.md` | Orta | 4 | Design-to-code akışının 22-design-tokens-spec.md ile eşleşme kuralları |
| **6** | Repo yapısına AI dizinlerini ekle | `21-repo-structure-spec.md` güncelle | Düşük | 3 | .moai/, CLAUDE.md, AGENTS.md, DESIGN.md placement kuralları |
| **7** | Tooling/governance güncelle | `16-tooling-and-governance.md` güncelle | Düşük | 3 | AI governance modelinin mevcut governance'a entegrasyonu |
| **8** | Contribution guide güncelle | `30-contribution-guide.md` güncelle | Düşük | 3, 4 | AI destekli katkı sürecinin operasyonel kuralları |
| **9** | Quality gates + DoD güncelle | `15` ve `32` güncelle | Düşük | 3 | AI çıktı-spesifik gate kuralları ve DoD maddeleri |
| **10** | Document map güncelle | `35-document-map.md` güncelle | Düşük | 3, 4, 5 | Yeni dokümanların harita, okuma sırası ve belge ailelerine eklenmesi |

### Paralel Yapılabilecek Adımlar
- Adım 1 + Adım 2 (bağımsız dosyalar)
- Adım 6 + Adım 7 + Adım 8 + Adım 9 (hepsi 3'e bağımlı, birbirine değil)

### Kritik Yol
`1/2 → 3 → 4 → 5 → 10`

### Zamanlama Notu
Adım 1 ve 2, bugün tamamlanabilir. Adım 3, boilerplate'in en kritik yeni dokümanıdır ve en fazla çaba gerektirir. Adım 10, tüm yeni dokümanlar tamamlandıktan sonra yapılmalıdır — document map güncellenmeden doküman sistemi tamam sayılmaz (35-document-map.md, bölüm 13).

---

# F. KAYNAKLAR

Bu rapordaki araç bilgileri aşağıdaki kaynaklardan derlenmiştir:

**MoAI-ADK:**
- [GitHub — modu-ai/moai-adk](https://github.com/modu-ai/moai-adk)
- [MoAI-ADK DeepWiki](https://deepwiki.com/modu-ai/moai-adk)
- [MoAI-ADK PyPI](https://pypi.org/project/moai-adk/)
- [MoAI-ADK Resmi Dokümantasyon](https://adk.mo.ai.kr/)
- [Quick Start Guide — DeepWiki](https://deepwiki.com/modu-ai/moai-adk/2.3-quick-start-guide)

**Google Stitch:**
- [Google Blog — Stitch Duyurusu](https://blog.google/innovation-and-ai/models-and-research/google-labs/stitch-ai-ui-design/)
- [Google Developers Blog — Stitch](https://developers.googleblog.com/stitch-a-new-way-to-design-uis/)
- [Stitch Resmi Site](https://stitch.withgoogle.com/)
- [Stitch MCP — GitHub](https://github.com/davideast/stitch-mcp)
- [Stitch Skills — GitHub](https://github.com/google-labs-code/stitch-skills)
- [Stitch DESIGN.md ile Claude Code](https://www.mindstudio.ai/blog/google-stitch-design-md-claude-code-consistent-ui)
- [Stitch DESIGN.md Nedir](https://www.mindstudio.ai/blog/what-is-google-stitch-design-md-file)
- [Stitch MCP Setup](https://stitch.withgoogle.com/docs/mcp/setup/)
- [Design-to-Code Codelab](https://codelabs.developers.google.com/design-to-code-with-antigravity-stitch)

**OpenAI Codex CLI:**
- [OpenAI — Codex Tanıtımı](https://openai.com/index/introducing-codex/)
- [Codex CLI Özellikleri](https://developers.openai.com/codex/cli/features)
- [AGENTS.md Kılavuzu](https://developers.openai.com/codex/guides/agents-md)
- [Codex GitHub Entegrasyonu](https://developers.openai.com/codex/integrations/github)
- [Codex GitHub Action](https://developers.openai.com/codex/github-action)
- [Codex SDK ile Code Review](https://developers.openai.com/cookbook/examples/codex/build_code_review_with_codex_sdk)

**Claude Code:**
- [Claude Code Genel Bakış](https://code.claude.com/docs/en/overview)
- [Claude Code Agent Teams](https://code.claude.com/docs/en/agent-teams)
- [Claude Code Eğitimi](https://anthropic.skilljar.com/claude-code-in-action)
