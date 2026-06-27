# Acceptance — SPEC-REFACTOR-GOV-001

Kabul kriterleri Given/When/Then formatinda. Tum senaryolar kanitla dogrulanabilir olmali (dosya icerigi, satir sayisi, grep ciktisi, CI sonucu). Kural semantigi degismez; yalniz yuk azalir.

---

## Senaryo 1 — Domain dosyalari 150 satir limitine cekildi (REQ-GOV-002)

- **Given** `docs/ai-guardrails/domain/` altinda su an 150 satiri asan 8 dosya var (D-UIX 338, D-AIX 289, D-FRM 242, D-OFL 180, D-COD 178, D-PLT 164, D-SEC 159, D-A11 155),
- **When** M2 budama tamamlanir,
- **Then** her domain dosyasi `wc -l <= 150` ve her aktivite dosyasi `wc -l <= 100` olur; `wc -l docs/ai-guardrails/domain/*.md | awk '$1>150'` BOS doner.

Ek kosul (semantik koruma):
- **And** budama oncesi ve sonrasi her dosyadaki direktif madde sayisi (bullet/numbered kural) SABIT kalir — yalniz narratif/ornek paragraflari kaynak dokumana tasinmistir, hicbir kural silinmemistir.

---

## Senaryo 2 — Drift otomasyonu var-veya-silinmis tutarli (REQ-GOV-004)

- **Given** Doc 47 Bolum 15 drift otomasyonu ve Bolum 14 metrikleri vaat ediyor ama hicbiri implemente degil (`grep -rl "<!-- versiyon" docs/ai-guardrails = 0`, CI'da guardrail-drift job yok),
- **When** M4 karari uygulanir,
- **Then** oz-celiski kapanir: YA (a) `scheduled-audit.yml`'de calisan bir guardrail-stale uyari job'i vardir VE Doc 47 §15 metni bu calisan davranisi tarif eder, YA DA (b) Doc 47 §14-15 metni silinmis/aspirasyonel-isaretlenmistir ve dokumanda artik implemente-edilmemis somut otomasyon vaadi kalmaz.
- **And** tam-implementasyon secildiyse, her guardrail dosyasi `<!-- kaynak: ... -->` ve `<!-- versiyon: ... -->` comment'i tasir (§15.1 ile tutarli); minimal/silme secildiyse bu comment'ler ZORUNLU degildir ve dokuman bunu iddia etmez.

---

## Senaryo 3 — Uc-agac tek-kaynaktan turetiliyor (REQ-GOV-005)

- **Given** 7 guardrail skill'i `.claude` ve `.agents` agaclarinda IDENTICAL ve elle senkron tutuluyor; tek-kaynak yok,
- **When** M5 tek-kaynak turetme kurulur,
- **Then** 7 guardrail skill'i icin tek bir canonical kaynak vardir; diger agac(lar)daki kopyalar symlink veya build-step ile TURETILIR (elle senkron degil); `upstream-sync-manifest.yaml` bu source-of-truth/derived iliskisini `.claude`, `.agents` ve `.codex` icin acikca beyan eder.
- **And** canonical kaynak degistirildiginde turetilen kopyalarin otomatik/build-step ile guncel oldugu dogrulanabilir (drift imkansiz).

---

## Senaryo 4 — Orantili okuma trivial degisikligi atliyor, guvenligi atlamiyor (REQ-GOV-001)

- **Given** `guardrail-check` skill su an her kodlama gorevinde kosulsuz aktivite + tum tetiklenen domain'leri okuyor (trivial-skip yok),
- **When** tek-satirlik bir typo/yorum/string-deger degisikligi guvenlik-disi bir dosyada yapilir,
- **Then** skill Adim 0 siniflandirmasi bunu trivial isaretler ve aktivite/domain guardrail okumasini ATLAR; yalniz universal kurallari hatirlatir.
- **And (guvenlik)** ayni boyutta degisiklik auth/payment/biometric/secret path'inde yapilirsa, trivial-skip DEVRE DISI kalir ve ilgili tam guardrail seti okunur (white-list garantisi).
- **And (budama)** bir gorev 4'ten fazla domain tetiklerse, skill max 1 aktivite + 4 domain'e budar (oncelik D-SEC > D-A11 > aktiviteye-en-yakin).

---

## Senaryo 5 — CLAUDE.md proje-kimlik + guardrail paritesi (REQ-GOV-003)

- **Given** `CLAUDE.md` 672 satir, %100 MoAI directive, `grep -ci guardrail = 0`; `AGENTS.md` tam guardrail blogu tasiyor,
- **When** M3 (Open Decision sonrasi) uygulanir,
- **Then** `CLAUDE.md` bir proje-kimlik cekirdek blogu (proje adi, canonical stack pointer, repo yapisi pointer, dil kurallari) VE max 30 satirlik guardrail protokol blogu icerir; `grep -ci guardrail CLAUDE.md > 0`.
- **And** guardrail blogu AGENTS.md ile parite tasir (ayni P0/P1/P2 severity, ayni guardrail ID'leri) ve UPSTREAM-SYNC sentinel ile sarilidir.
- **And** `wc -l CLAUDE.md <= 500` (MoAI directive detayi `.claude/rules/` pointer'larina tasinmistir).

---

## Edge Case'ler

- **D-SEC / D-A11 budama:** Bu iki dosya hem 150 limitini asiyor hem guvenlik/erisilebilirlik kritik. Budama sirasinda TEK BIR direktif bile kaybolmamali; satir-satir direktif denetimi zorunlu.
- **Symlink platform uyumsuzlugu:** Windows/git ortaminda symlink calismazsa M5 build-step fallback'ine gecmeli; turetilen kopya yine de drift-free olmali.
- **Open Decision cozulmeden M3 zorlanirsa:** M3 adim 4 (CLAUDE.md MoAI directive yeniden-yazimi) BLOCKED kalmali; sadece additive kimlik+guardrail blogu eklenebilir, MoAI directive silinemez.
- **.codex/hooks.json bu SPEC'te fix edilmez:** M5 sadece gereksinim olarak referans verir; fix SPEC-INFRA-DERIVE-001'de. Bu SPEC'in PR'i .codex/hooks.json path'lerini DEGISTIRMEMELI.
- **Bos diff / sadece dokuman degisikligi:** guardrail-check trivial-skip yalniz kod degisikligine uygulanir; saf-dokuman degisiklikleri A-DOCS aktivitesine duser, guvenlik white-list disindadir.

---

## Kalite Kapisi (Definition of Done)

- [ ] REQ-GOV-001..005 karsilandi ve her biri ilgili senaryoyla kanitlandi.
- [ ] 8 domain dosyasi <= 150 satir; aktivite dosyalari <= 100 satir (CI guardrail-budget job PASS).
- [ ] Budama oncesi/sonrasi direktif sayisi sabit (kural semantigi degismedi) — D-SEC/D-A11 satir-satir denetimden gecti.
- [ ] Drift otomasyonu var-veya-silinmis tutarli; dokumanda implemente-edilmemis somut vaat kalmadi.
- [ ] Uc-agac 7 guardrail skill'i tek-kaynaktan turetiliyor; manifest 3 agaci beyan ediyor.
- [ ] guardrail-check skill trivial-skip + guvenlik white-list + 4-domain budama icerir.
- [ ] CLAUDE.md kimlik+guardrail blogu var, AGENTS.md ile parite, <= 500 satir (Open Decision cozulduyse).
- [ ] Open Decision (MoAI-ADK K1/K2) belgelendi ve sonucu M3'e yansidi.
- [ ] .codex/hooks.json bu SPEC'in PR'inde DEGISMEDI (fix INFRA-DERIVE'de).
- [ ] MX tag plani uygulandi (NOTE/WARN+REASON/ANCHOR/TODO).
- [ ] FROZEN zone (design constitution) degismedi.
