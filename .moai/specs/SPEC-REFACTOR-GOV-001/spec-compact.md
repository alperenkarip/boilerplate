# SPEC-REFACTOR-GOV-001 — Compact

Governance/metadata yukunu makullestir (hizi koruma). P1, Faz 4-5, deps: SPEC-INFRA-DERIVE-001. BROWNFIELD. Kural semantigi DEGISMEZ, yalniz yuk azalir.

---

## REQ Ozeti

| REQ | Modul | Ozet | Anahtar EARS |
|-----|-------|------|--------------|
| REQ-GOV-001 | M1 | Orantili guardrail okuma | WHEN trivial degisiklik THEN guardrail okumayi atla; IF guvenlik-path THEN trivial-skip devre disi; WHILE >4 domain THEN max 1+4 buda |
| REQ-GOV-002 | M2 | Domain <=150 / aktivite <=100 satir | SHALL keep <=150; SHALL preserve rule semantics; SHALL NOT copy narrative |
| REQ-GOV-003 | M3 | CLAUDE.md kimlik + guardrail paritesi | SHALL expose project-identity + <=30 satir guardrail protocol (AGENTS.md parite); SHALL keep <=500 satir |
| REQ-GOV-004 | M4 | Drift otomasyonu implemente-et veya sil | SHALL NOT keep unimplemented promise; WHERE minimal THEN warning-only stale check |
| REQ-GOV-005 | M5 | Uc-agac tek-kaynaktan turet | SHALL maintain single source for shared guardrail skills; manifest 3 agaci beyan eder |

---

## Acceptance Ozeti

1. 8 domain dosyasi <= 150 satir; budama oncesi/sonrasi direktif sayisi sabit (semantik korundu).
2. Drift otomasyonu var-veya-silinmis tutarli; dokumanda implemente-edilmemis somut vaat yok.
3. 7 guardrail skill'i tek-kaynaktan turetiliyor (symlink/build-step); manifest 3 agaci beyan eder.
4. guardrail-check trivial-skip yapar ama guvenlik-path'i atlamaz; >4 domain'i budar.
5. CLAUDE.md kimlik+guardrail blogu var, AGENTS.md parite, <=500 satir (Open Decision sonrasi).

---

## Degisecek Dosyalar

- `.claude/skills/guardrail-check/SKILL.md` (+ `.agents/.../guardrail-check/SKILL.md`) — M1 trivial-skip + budama + white-list
- `docs/ai-guardrails/domain/D-{UIX,AIX,FRM,OFL,COD,PLT,SEC,A11}-*.md` — M2 150 satira cek (narratif kaynak dokumana)
- `CLAUDE.md` — M3 kimlik + guardrail blogu + 500 satira cek [Open Decision'a bagli]
- `docs/governance/47-ai-guardrail-governance.md` — M4 §14-15 implemente-et veya sil
- `.github/workflows/{ci.yml,scheduled-audit.yml}` — M2 guardrail-budget job, M4 drift uyari job
- `tooling/sync/upstream-sync-manifest.yaml` — M5 .agents/.codex source-of-truth/derived beyani
- AI-arac agaclari (guardrail skill turetme) — M5 symlink/build-step

---

## Open Decision — MoAI-ADK

[OPEN] MoAI-ADK pilot SPEC ile degerini kanitlasin (K1) YA DA lazy-load/arsivle + CLAUDE.md proje-kimlik odakli yeniden yazilsin (K2). Kanit: `.moai/specs` MoAI'nin kendi plan->run->sync akisiyla uretilmemis (mevcut dizinler remediation kaynakli); 47 moai-* skill her oturum ~metadata yuku; CLAUDE.md %100 MoAI directive ama proje guardrail sistemiyle calisiyor. M3'un CLAUDE.md yeniden-yazimi bu karara BLOCKED.

---

## Kapsam Disi (min 1)

- `.codex/hooks.json` hardcoded path FIX implementasyonu — ZATEN SPEC-INFRA-DERIVE-001'de (TEKRARLAMA; M5 sadece referans verir).
- Guardrail kurallarinin koda dusurulmesi — SPEC-TEST-001 (eslint-plugin-bp).
- Guardrail icerik/kural semantigi degisikligi — yalniz YUK/format/teslimat optimize edilir.
- FROZEN zone (design constitution) degisikligi.
- 3-way merge motoru yeniden yazimi.
- Yeni guardrail dosyasi ekleme.
