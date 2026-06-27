---
id: SPEC-REFACTOR-GOV-001
version: 0.1.0
status: draft
created: 2026-06-05
updated: 2026-06-05
author: alp
priority: P1
issue_number: 0
---

# SPEC-REFACTOR-GOV-001 — Governance/Metadata Yukunu Makullestir (Hizi Koruma)

## HISTORY

- 2026-06-05 (v0.1.0): Ilk taslak. Kaynak: velocity audit (2026-06-05) + tema bazli derin research (`governance-metadata-yuku`). BROWNFIELD optimizasyon SPEC'i. Faz 4-5, P1. Bagimlilik: SPEC-INFRA-DERIVE-001.

---

## Overview

Bu SPEC, projenin governance/metadata katmanindaki **yuku** azaltir; **kural semantigini degistirmez**. Audit'in temel bulgusu su: bu proje hizi dogrudan deterministik kod uretiminden (literal rename, scaffolding, lint enforcement) kazaniyor; dokuman/metadata katmani ise **agirlik** ekliyor. Hedef, time-to-product lensiyle bu agirligi makullestirmektir.

Kapsam BROWNFIELD'dir: mevcut guardrail sistemi (`docs/ai-guardrails`, 57 dosya), `CLAUDE.md`, `AGENTS.md`, uc AI-arac agaci (`.claude` / `.agents` / `.codex`) ve MoAI-ADK iskeleti uzerinde **delta** degisiklikler yapilir.

Ele alinan bes problem (hepsi kanitla dogrulanmis):

1. `guardrail-check` skill'i her kodlama gorevinde kosulsuz aktivite + tetiklenen tum domain'leri okutuyor; trivial degisiklik icin escape yok. Orantililik prensibi proza'da var, operasyonel degil.
2. 8 domain guardrail dosyasi 150 satir HARD limitini asiyor (en buyukleri D-UIX 338, D-AIX 289, D-FRM 242).
3. `CLAUDE.md` 672 satir (limit 500) ve %100 MoAI-ADK directive; guardrail mentonu sifir. `AGENTS.md` (Codex) tam guardrail blogu tasiyor. Parite kopuk.
4. Doc 47 Bolum 15 (drift otomasyonu) ve Bolum 14 (effectiveness metrikleri) somut vaatler veriyor ama hicbiri implemente edilmemis (oz-celiski).
5. Uc AI-arac agaci elle senkron tutulan 7 ozdes guardrail skill'i tasiyor; tek-kaynak yok. `.codex/hooks.json` hardcoded absolute path iceriyor.

[NOT] Bu SPEC hizi DOGRUDAN uretmez; AGIRLIK azaltir. Bu yuzden Faz 4-5'e konumlanmistir (dikey dilimler ve enforcement once gelir).

---

## Module Boundaries (max 5)

| Modul | Sorumluluk | Dosya alani |
|-------|-----------|-------------|
| M1 — Orantili okuma | guardrail-check skill'ine trivial-skip + okuma derinligi esigi | `.claude/skills/guardrail-check/`, `.agents/.../guardrail-check/` |
| M2 — Domain budama | 8 asiri uzun domain dosyasini 150 satir limitine cek | `docs/ai-guardrails/domain/` |
| M3 — CLAUDE.md parite | Proje-kimlik cekirdegi + guardrail protokol blogu (AGENTS.md ile parite) | `CLAUDE.md` |
| M4 — Drift tutarlilik | Doc 47 Bolum 14-15 vaadini implemente-et VEYA sil | `docs/governance/47-*.md`, CI workflow |
| M5 — Tek-kaynak turetme | Uc-agac 7 guardrail skill'ini tek kaynaktan turet + .codex path fix | `tooling/sync/`, AI-arac agaclari |

---

## EARS Requirements (max 5 modul)

### REQ-GOV-001 — Orantili guardrail okuma (M1)

Ubiquitous + Event-Driven + State-Driven:

- The system SHALL classify change scope (trivial / small / feature) at the start of every coding task before reading any guardrail document. [Delta: NEW — su an siniflandirma yok]
- WHEN a change is classified trivial (single-line edit, typo, comment, import-ordering, string-value-only), the system SHALL skip activity and domain guardrail reading and recall only universal rules. [Delta: NEW]
- WHILE more than 4 domain guardrails are triggered for a single task, the system SHALL prune to a maximum of 1 activity + 4 domains using priority order (D-SEC > D-A11 > activity-nearest). [Delta: NEW]
- IF the changed file lies in a security-sensitive path (auth, payment, biometric, secret handling), THEN the system SHALL NOT apply trivial-skip and SHALL read the full relevant guardrail set regardless of diff size. [Delta: NEW — guvenlik white-list]

Kanit: `guardrail-check/SKILL.md` adim 2-3 kosulsuz okuma; `grep "trivial|skip|atla|oranti" = 0`. Orantililik prensibi Doc 47 §11.3 + Doc 40 satir 914/1017'de var ama skill'de operasyonel degil.

### REQ-GOV-002 — Domain guardrail satir butcesi (M2)

Ubiquitous + Unwanted:

- The system SHALL keep every domain guardrail document at or below 150 lines and every activity guardrail at or below 100 lines. [Delta: MODIFIED — 8 dosya su an asiyor]
- The system SHALL preserve guardrail rule semantics when reducing file length; only narrative/example content SHALL be relocated to its source document, directives SHALL remain. [Delta: NEW — semantik koruma garantisi]
- The system SHALL NOT copy source-document narrative into guardrail files (Doc 47 §11.2 "Guardrail Sisme" anti-pattern). [Delta: ENFORCED]

Kanit: `wc -l docs/ai-guardrails/domain/*.md` -> 8 dosya > 150: D-UIX(338), D-AIX(289), D-FRM(242), D-OFL(180), D-COD(178), D-PLT(164), D-SEC(159), D-A11(155). Limit: Doc 47 §5.1 satir 250 + Doc 41 satir 135.

### REQ-GOV-003 — CLAUDE.md proje-kimlik cekirdegi + guardrail paritesi (M3)

Ubiquitous + Event-Driven:

- The system SHALL expose a project-identity core block in CLAUDE.md (project name, canonical stack pointers, repo-structure pointer, language rules) so that CLAUDE.md is not exclusively MoAI orchestration directive. [Delta: NEW]
- The system SHALL expose a guardrail compliance protocol of at most 30 lines in CLAUDE.md mirroring the AGENTS.md guardrail compliance block (same severity references P0/P1/P2, same guardrail IDs). [Delta: NEW — parite]
- WHEN the guardrail block is added to CLAUDE.md, the system SHALL wrap it in UPSTREAM-SYNC sentinel comments matching the AGENTS.md pattern so partial-sync recognizes it. [Delta: NEW]
- The system SHALL keep CLAUDE.md at or below 500 lines, relocating MoAI directive detail sections to pointers under `.claude/rules/`. [Delta: MODIFIED — su an 672 satir]

Kanit: `grep -ci guardrail CLAUDE.md = 0` vs `AGENTS.md = 10`; `wc -l CLAUDE.md = 672` (Doc 41 limit 500); AGENTS.md sentinel blok yapisi dogrulandi (UPSTREAM-SYNC-START/END).

### REQ-GOV-004 — Drift otomasyonu: implemente-et veya sil (M4)

Unwanted + Event-Driven + Optional:

- The system SHALL NOT keep an unimplemented automation promise in governance documents (Doc 47 Bolum 15 drift automation, Bolum 14 effectiveness metrics) — the promise SHALL be either implemented or removed/marked aspirational. [Delta: NEW — oz-celiski kapatma]
- WHERE the minimal path is chosen, the CI SHALL add a warning-only check that flags a guardrail as potentially stale WHEN its source-document git-mtime is newer than the guardrail's last-update date; no auto-issue creation. [Delta: NEW — opsiyonel minimal otomasyon]
- WHEN drift automation text is retained, every guardrail document SHALL carry the promised `<!-- kaynak: ... -->` and `<!-- versiyon: ... -->` comments referenced by Doc 47 §15.1. [Delta: CONDITIONAL]

Kanit: `grep -rl "<!-- versiyon" docs/ai-guardrails = 0`, `grep -rl "<!-- kaynak" = 0`; CI'da guardrail-drift job yok. Doc 47 §15.1-15.4 + §14.1-14.3 somut vaat veriyor ama hicbiri canli degil.

### REQ-GOV-005 — Uc-agac tek-kaynaktan turetme (M5)

Ubiquitous + Event-Driven:

- The system SHALL maintain a single source of truth for the guardrail skills shared across the `.claude`, `.agents`, and `.codex` trees, deriving copies (symlink or build-step) rather than hand-syncing them. [Delta: NEW]
- The upstream-sync manifest SHALL declare the source-of-truth and derived relationship for the shared guardrail skills across all three trees (currently it covers only `.claude`). [Delta: MODIFIED]
- WHEN a new project is derived, the system SHALL ensure `.codex/hooks.json` contains no absolute host paths (project-relative or `$CLAUDE_PROJECT_DIR` form only). [Delta: NEW — bkz. Kapsam Disi notu]

Kanit: `du -sh` -> .claude 4.9M / .agents 5.2M / .codex 128K (audit'in "IDENTICAL ~10M" iddiasi YANLIS); 7 guardrail skill'i .claude/.agents arasinda IDENTICAL, elle senkron; `.codex/hooks.json` -> 3 hardcoded `/Users/alperenkarip` path.

---

## Open Decision — MoAI-ADK: Pilot mi, Lazy-Load mu?

[OPEN] Bu SPEC bir karar noktasi acar, **karari dayatmaz**. Karar verilene kadar bu konu icin kod yazilmaz.

**Kanit:** MoAI-ADK iskeleti dolu ama olu calismamis durumda. `.moai/specs` altinda gercek bir plan->run->sync uretimi yok; mevcut dizinler bu remediation surecinde olusturulmustur (MoAI'nin kendi workflow'u uretmemistir). `.claude/skills` altinda 47 `moai-*` skill (~4.2M), `.claude/agents` (~188K), `.claude/commands` (~60K) her oturumda metadata yuku getiriyor. `CLAUDE.md` (672 satir) tamamen MoAI directive; proje fiilen guardrail sistemiyle calisiyor, MoAI workflow'u ile degil.

**Iki yol (oneri: once degerini kanitla, kanitlanamazsa hafiflet):**

- **Yol K1 — Pilot SPEC ile degerini kanitla (onerilen ilk adim):** Tek bir gercek gorevde plan->run->sync akisini calistir; MoAI quality gate'leri (TRUST 5, post-edit hook) ile proje guardrail sistemi arasindaki ortusme/cift-enforcement'i olc. Deger kanitlanirsa MoAI kalir.
- **Yol K2 — Lazy-load/arsivle:** Pilot deger uretmezse, 47 `moai-*` skill + agent/command setini metadata-suppressed (disable-model-invocation) yap veya arsivle; `CLAUDE.md`'yi proje-kimlik odakli yeniden yaz (M3 ile birlesir).

**Bu SPEC'in tutumu:** REQ-GOV-003 (CLAUDE.md parite) ve M3 ya K1 ya K2 sonucuna gore sekillenir. Karar verilene kadar M3'un CLAUDE.md yeniden-yazim kismi BLOCKED; geri kalan modulleri (M1/M2/M4/M5) karardan bagimsiz ilerleyebilir.

---

## Exclusions (What NOT to Build) — Kapsam Disi (min 1)

- **`.codex/hooks.json` hardcoded path FIX implementasyonu** — Bu duzeltme ZATEN SPEC-INFRA-DERIVE-001 kapsamindadir (create-project.sh derive sirasinda relative'e cevirir). Bu SPEC sadece M5 turetme baglaminda gereksinim olarak REFERANS verir, fix'i TEKRARLAMAZ.
- **Proje-ozel guardrail kurallarinin koda dusurulmesi** — eslint-plugin-bp ve lint enforcement SPEC-TEST-001 kapsamindadir. Bu SPEC guardrail kuralini koda cevirmez.
- **Guardrail icerik/kural semantigi degisikligi** — Sadece YUK / format / teslimat optimize edilir. Hicbir guardrail kuralinin anlami, esigi veya kapsami degistirilmez (REQ-GOV-002 semantik-koruma garantisi).
- **FROZEN zone degisikligi** — Design constitution (`.claude/rules/moai/design/constitution.md`) FROZEN zone'una dokunulmaz.
- **3-way merge motorunun yeniden yazimi** — upstream-sync 3-way merge motoru saglamdir; bu SPEC sadece manifest kapsamini genisletir, motoru degistirmez.
- **Yeni guardrail dosyasi/aktivite/domain ekleme** — Mevcut 57 dosya kapsam icidir; yeni guardrail uretimi kapsam disidir.
