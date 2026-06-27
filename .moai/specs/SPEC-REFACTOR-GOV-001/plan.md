# Plan — SPEC-REFACTOR-GOV-001

Governance/metadata yukunu makullestirme uygulama plani. BROWNFIELD optimizasyon; kural semantigi degismez, yalniz yuk azalir. Faz 4-5, P1, bagimlilik: SPEC-INFRA-DERIVE-001.

---

## Teknoloji ve Surum

| Bilesen | Surum / kaynak | Not |
|---------|----------------|-----|
| Guardrail dosyalari | `docs/ai-guardrails/` (30 aktivite + 27 domain = 57) | Markdown + frontmatter |
| Skill sistemi | Claude Code Skill (SKILL.md) | `.claude/skills/guardrail-check`, `.agents/.../guardrail-check` |
| CI | GitHub Actions (`ci.yml`, `scheduled-audit.yml`) | repo-mode aware (docs-only vs bootstrap-ready) |
| Sync altyapisi | `tooling/sync/upstream-sync.sh` + `upstream-sync-manifest.yaml` | hash-bazli drift, exact/partial/adaptive mod |
| Limit kaynagi | Doc 47 §5.1 (150), Doc 41 satir 131/135 (CLAUDE.md 500, domain 150) | HARD limitler |

---

## Gorev Decomposition

### M1 — Orantili guardrail okuma (REQ-GOV-001)

1. `guardrail-check/SKILL.md`'ye "Adim 0: Degisiklik tipi siniflandirmasi" ekle: trivial (tek-satir/typo/yorum/import-siralama/string-deger) -> guardrail okumayi ATLA, sadece universal kurallari hatirla.
2. Karar tablosu ekle: diff satir sayisi + dosya sayisi + yeni public yuzey -> okuma derinligi (yok / sadece aktivite / aktivite + 1-2 kritik domain / tam set).
3. ">4 domain tetiklenirse" budama kurali yaz: max 1 aktivite + 4 domain, oncelik D-SEC > D-A11 > aktiviteye-en-yakin.
4. Guvenlik white-list: auth/payment/biometric/secret path'leri trivial-skip'ten muaf, her zaman tam-kontrol.
5. Ayni degisikligi `.agents/.../guardrail-check/SKILL.md` kopyasina uygula (M5 tek-kaynak ile koordineli — tek-kaynak once gelirse tek dosya yeter).

Reference: `.claude/skills/guardrail-check/SKILL.md` (adim 2-3 kosulsuz okuma); Doc 47 §11.3 (satir 491); Doc 40 satir 914/1017.

### M2 — Domain guardrail satir butcesi (REQ-GOV-002)

1. 8 asan dosyayi oku, narratif/ornek anlatimi direktiflerden ayikla (Doc 47 §5.1 satir 250 "narratif yasak, yalniz direktif").
2. Ayiklanan icerigi kaynak dokumana geri tasi (D-UIX -> 03/34/26, D-FRM -> 11/ADR-006, D-SEC -> 27/ADR-010, bkz. Doc 47 §15.1 bagimlilik grafigi).
3. Guardrail'de yalniz direktif + kaynak referans birak; her dosya basina `<!-- satir: N/150 -->` butce gostergesi.
4. CI'a `guardrail-budget` job ekle: `wc -l > 150` olan domain dosyasi veya `> 100` aktivite dosyasi varsa fail (repo-mode aware).

Hedef dosyalar (sirali): D-UIX(338), D-AIX(289), D-FRM(242), D-OFL(180), D-COD(178), D-PLT(164), D-SEC(159), D-A11(155).

Reference: `docs/ai-guardrails/domain/D-UIX-ui-ux-hig.md:1-338`; Doc 41 satir 135; Doc 47 §11.2 (satir 485).

### M3 — CLAUDE.md proje-kimlik + guardrail paritesi (REQ-GOV-003) [Open Decision'a bagli]

1. CLAUDE.md basina ~40-50 satir "Proje Kimligi" cekirdek blogu: proje adi/tipi, canonical stack (ADR kisa referanslari), repo yapisi pointer (`docs/governance/21-repo-structure-spec.md`), dil kurallari.
2. Max 30 satir "Guardrail Protokolu" blogu (Doc 47 §6.1 7-adimli protokol): is tipi belirle -> aktivite oku -> domain oku -> universal hatirla; M1 trivial-skip esigi ile entegre.
3. AGENTS.md satir 102-148 guardrail blogu ile parite: ayni P0/P1/P2 severity referanslari, ayni guardrail ID'leri, UPSTREAM-SYNC sentinel sarmasi.
4. CLAUDE.md'yi 500 satir altina cek: MoAI directive detay bolumlerini `.claude/rules/` pointer'larina cevir.

[BLOCKED] Bu modulun CLAUDE.md yeniden-yazim kapsami (adim 4) Open Decision (K1 pilot / K2 lazy-load) sonucuna baglidir. Adim 1-3 (kimlik + guardrail parite) karardan bagimsiz ilerleyebilir.

Reference: `CLAUDE.md:1-672`; `AGENTS.md:3-148` (sentinel bloklari); Doc 41 satir 79/156-161.

### M4 — Drift otomasyonu: implemente-et veya sil (REQ-GOV-004)

1. KARAR: Doc 47 §14-15 vaadini YAP veya SIL. Hizi dogrudan uretmeyen agirlik oldugu icin once "sil veya minimal" degerlendir.
2. MINIMAL secenek (onerilen): §15.1-15.3 karmasik issue-acma mekanizmasini sil; yerine `scheduled-audit.yml`'e basit "guardrail frontmatter son-guncelleme < kaynak dokuman git-mtime mi" kontrolu (uyari-only, issue acmaz).
3. TAM secenek (deger varsa): tum guardrail'lere `<!-- kaynak -->` + `<!-- versiyon -->` comment ekle, `ci.yml`'e git-diff bazli bagimli-guardrail tespiti.
4. §14 effectiveness metrikleri (yakalama orani, false positive, coverage) olculmuyorsa "aspirasyonel" isaretle veya sil.

Reference: `docs/governance/47-ai-guardrail-governance.md:584-644` (§15), `:552-580` (§14); `scheduled-audit.yml` doc-freshness deseni; `upstream-sync.sh:75-110` hash-diff.

### M5 — Uc-agac tek-kaynaktan turetme (REQ-GOV-005)

1. Tek-kaynak belirle: 7 guardrail skill'ini canonical bir yerde tut (orn. `.claude/skills/`), digerine symlink veya build-step ile turet.
2. `upstream-sync-manifest.yaml`'i genislet: su an sadece `.claude/` kapsiyor (satir 142-154); `.agents/` ve `.codex/` guardrail dosyalarini source-of-truth/derived olarak isaretle.
3. `.codex/hooks.json` hardcoded path gereksinimini REFERANS ver (fix SPEC-INFRA-DERIVE-001'de — TEKRARLAMA, bkz. Kapsam Disi).
4. Turetme dogrulamasi: 7 skill + 3 agac senkron kontrolu (su an derive bu agaclari hic ele almiyor: `grep .codex create-project.sh = 0`).

Reference: `tooling/sync/upstream-sync-manifest.yaml:142-154`; `du -sh .claude .agents .codex` -> 4.9M/5.2M/128K; `.codex/hooks.json` (3 hardcoded path).

---

## Faz Sirasi (gorev bagimliligi)

1. M5 (tek-kaynak) ONCE — turetme kurulursa M1/M2 tek dosyada degisir, ikili senkron derdi kalmaz.
2. M2 (domain budama) + M4 (drift) paralel — farkli dosya alanlari (guardrail dosyalari vs CI/governance).
3. M1 (orantili okuma) — M5 sonrasi tek skill dosyasinda.
4. M3 (CLAUDE.md) EN SON — Open Decision sonucunu bekler.

---

## Risk + Azaltma

| Risk | Etki | Azaltma |
|------|------|---------|
| Domain dosyasi kisaltilirken KURAL kaybolur (guardrail gevsetilir) | Yuksek — guvenlik/erisilebilirlik kurali silinirse regresyon | [HARD] Sadece narratif/ornek tasinir, direktif KALIR. M2 oncesi/sonrasi direktif sayisi (madde sayisi) sabit kalmali; D-SEC/D-A11 icin satir-satir direktif denetimi. Kanit: REQ-GOV-002 semantik-koruma. |
| Trivial-skip yanlis siniflandirma ile guvenlik kurali atlanir | Yuksek | Guvenlik white-list (auth/payment/biometric/secret) trivial-skip'ten MUAF; supheli durumda tam-kontrol varsayilan. |
| CLAUDE.md yeniden yazimi MoAI workflow'unu bozar | Orta | M3 adim 4 Open Decision'a BLOCKED; karar oncesi sadece additive (kimlik + guardrail blogu) yapilir, MoAI directive silinmez. |
| Drift otomasyonu silinince gelecekte ihtiyac dogar | Dusuk | Minimal secenek (uyari-only mtime kontrolu) tam silmeye gore orta yol; tam silinirse Doc 47'de "aspirasyonel" notu birakilir, geri eklenebilir. |
| Symlink Windows/git uyumsuzlugu (M5) | Orta | Symlink yerine build-step (generate) fallback'i degerlendir; create-project.sh turetmede ele alinir. |
| Iki SPEC ayni CI dosyasina yazar (M2/M4 vs INFRA/TEST) | Orta | Farkli fazlar (Faz 4-5 vs Faz 1/3); ayni fazda iki SPEC ayni workflow'a yazmaz kurali. |

---

## MX Tag Plani

- `@MX:NOTE` — `guardrail-check/SKILL.md` Adim 0 siniflandirma blogu: trivial-skip mantiginin niyetini acikla (orantililik, Doc 47 §11.3).
- `@MX:WARN` — Guvenlik white-list bypass mantigi: trivial-skip'in auth/payment/biometric/secret path'lerde DEVRE DISI oldugu; `@MX:REASON` guvenlik kurali atlanmamali.
- `@MX:ANCHOR` — guardrail-budget CI job (M2): 150/100 satir limiti invariant kontrat; degistirilmeden once limit kaynagi (Doc 47 §5.1) dogrulanmali.
- `@MX:TODO` — Open Decision (MoAI-ADK K1/K2) cozulene kadar M3 CLAUDE.md yeniden-yazim noktasi; karar sonrasi resolve edilir.

---

## Definition of Ready (bu SPEC icin)

- [x] SPEC-INFRA-DERIVE-001 `.codex/hooks.json` fix kapsamini netlestirdi (M5 referans verir, tekrarlamaz).
- [ ] Open Decision (MoAI-ADK K1/K2) karari alindi (M3 adim 4'u acar).
- [ ] M4 karari alindi (drift: minimal otomasyon mu, tam silme mi).
