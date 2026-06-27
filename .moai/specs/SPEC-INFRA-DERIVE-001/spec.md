---
id: SPEC-INFRA-DERIVE-001
version: 0.1.0
status: draft
created: 2026-06-05
updated: 2026-06-05
author: alp
priority: P0
issue_number: 0
---

# SPEC-INFRA-DERIVE-001 — Turetme ve Yasam Dongusu

Kapsamli literal rename + bp-v baseline tag/release + parametre validasyonu + BSD/GNU tasinabilirlik.

## HISTORY

- 2026-06-05 (v0.1.0): Ilk taslak. velocity-remediation-roadmap.md tema "INFRA-DERIVE-LIFECYCLE" temel alindi; gercek kod (`create-project.sh`, `upstream-sync.sh`, `.codex/hooks.json`, `notify-derived-projects.yml`, `AppNavigator.tsx`, i18n locale + ekran metni) okunarak dogrulandi. Baz cizgi: 0 git tag, parametre regex yok, `grep -oP` BSD-uyumsuz, CLAUDE.md sessiz no-op, `.codex/hooks.json` 3 hardcoded absolute path.

---

## Overview

Bu SPEC, boilerplate monorepo'sundan yeni urun turetme (derivation) ve turetilmis projeleri upstream ile senkron tutma (lifecycle) yolunu **gercekten calisir** hale getirir. Mevcut durumda turetme mekanizmasi `tooling/derive/create-project.sh` ile, sync mekanizmasi `tooling/sync/upstream-sync.sh` + manifest + drift CI ile kodlanmis; ancak bir dizi bosluk yuzunden uretilen urun "Boilerplate" marka sizintisi tasiyor, deep-link kopuyor ve sync mekanizmasinin tamami olu (baseline tag hic atilmamis).

Urun amaci lensi: **time-to-product**. Turetme aninda yakalanmayan her hata (gecersiz bundle-id, kalan "Boilerplate" literal'i, kopuk deep-link) en pahali yerde (EAS build, App Store submit, son kullanici ekrani) patliyor. Bu SPEC bu hatalari turetme/sync anina cekerek hata maliyetini sifirlar.

Bu BROWNFIELD bir SPEC'tir: var olan saglam motorlar (jq tabanli rename, 3-way merge `sync_exact_file`, manifest-driven sync, notify severity kategorizasyonu) **korunur**; yalnizca eksik/bozuk noktalar duzeltilir veya genisletilir. Delta isaretciler (Delta markers) her requirement'ta hangi davranisin DEGISTIGINI/EKLENDIGINI gosterir.

### Dogrulanmis Baz Cizgi (BROWNFIELD durum)

- `git tag -l 'bp-v*'` ciktisi BOS — `bp-v1.0.0` baseline asla atilmamis; `upstream-sync.sh:65-70` hedef tag yoksa `exit 1` ile patliyor → sync mekanizmasi tamamen olu.
- Hicbir workflow `bp-v*` tag URETMIYOR; `notify-derived-projects.yml` `on: push: tags: bp-v*` dinliyor ama tetikleyen yok → sonsuz sessiz bekleme.
- `create-project.sh:90-101` parametreleri yalniz `-z` (bos-degil) kontrol ediyor; NAME/SCOPE/BUNDLE_ID/DOMAIN icin format regex YOK. Gecersiz bundle-id sessizce `app.json`'a yaziliyor.
- `AppNavigator.tsx:192` deep-link prefix `['boilerplate://', 'https://boilerplate.app']` rename kapsami disinda; `app.json` scheme `$NAME`'e guncellenirken prefix sabit kaliyor → scheme uyusmazligi.
- Ek `boilerplate` literal'leri rename disinda: `apps/web/src/i18n/locales/en/common.json:3`, `tr/common.json:3,32`, `en/shell.json:140`, `tr/shell.json:140` (copyright), `apps/mobile/src/screens/SplashScreen.tsx:16`, `apps/mobile/src/screens/main/AboutScreen.tsx:63`.
- `create-project.sh:549` verify yalnizca `package.json apps/mobile/app.json apps/web/index.html .env.example` tariyor; `apps/*/src` + `packages/*/src` taramiyor.
- `upstream-sync.sh:79-80` ve `tooling/ci/scheduled-audit.yml:229` `grep -oP` (Perl lookbehind) kullaniyor — GNU-only; macOS BSD grep'te bos donuyor → `CURRENT_HASH` kayboluyor → her sync FULL_SYNC'e dusuyor.
- `create-project.sh:379-398` CLAUDE.md replace eski boilerplate formatini (`## Proje Kimligi` + `# Boilerplate Proje Talimatlari`) ariyor; aktif CLAUDE.md MoAI formatinda (`# MoAI Execution Directive`) → Python `str.replace()` sessizce no-op.
- `.codex/hooks.json` 3 hardcoded absolute path iceriyor (`/Users/alperenkarip/Projects/boilerplate/.codex/hooks/...`); `create-project.sh` bunlari rename ETMIYOR → turetilen projede hook'lar kirik kopya gider.
- `notify-derived-projects.yml:80,87,120` emoji iceriyor (info ve warning unicode emoji karakterleri) → proje [HARD] emoji yasagini ihlal ediyor.

---

## Requirements (EARS)

Bes modul: R1 Literal Rename, R2 Parametre Validasyonu, R3 Baseline Tag & Release, R4 Tasinabilirlik (BSD/GNU), R5 Governance Uyumu (CLAUDE.md + .codex + emoji).

### R1 — Kapsamli Literal Rename (Ubiquitous + Event)

- **REQ-DRV-001** [Ubiquitous] The system SHALL replace all derivation-target `boilerplate` literals across source code — deep-link prefix (`AppNavigator.tsx:192`), i18n locale display-name and copyright (`en/tr common.json`, `en/tr shell.json`), and screen text (`SplashScreen.tsx:16`, `AboutScreen.tsx:63`) — in addition to the existing `@project/` import rename.
  - **Delta (MODIFIED):** Mevcut `create-project.sh:175-185` yalnizca `@project/ → @${SCOPE}/` rename'i yapiyor; bu requirement Faz 1.3'e ayri bir "serbest literal" rename adimi EKLER.
  - **Delta (NEW):** JSON dosyalari (i18n locale) `jq` ile, duz-metin dosyalari (deep-link prefix, ekran metni) `sed -i.bak` ile guncellenir (mevcut JSON→jq / metin→sed disiplinine uyar). Copyright yili (`© 2026`) korunur, yalniz "Boilerplate" → `${DISPLAY_NAME}` degisir.

- **REQ-DRV-002** [Event-Driven] WHEN derivation reaches the verify phase, the system SHALL scan `apps/*/src` and `packages/*/src` (case-insensitive, excluding `dist`/`node_modules`) for residual `boilerplate` literals and set `VERIFY_PASS=false` if any non-whitelisted literal remains.
  - **Delta (MODIFIED):** Mevcut verify (`create-project.sh:549`) yalnizca 4 config dosyasini tariyor; bu requirement taramayi `apps/*/src` + `packages/*/src` recursive grep'e genisletir.
  - **Delta (NEW):** Korunmasi gereken mesru literal'ler (upstream sync dokuman referanslari, BOUNDARY.md baslik metinleri) whitelist'lenir; whitelist disi kalan literal verify'i fail eder.

### R2 — Parametre Format Validasyonu (Unwanted)

- **REQ-DRV-003** [Unwanted Behavior] IF a NAME/SCOPE/BUNDLE_ID/DOMAIN parameter fails its format regex, THEN the system SHALL reject derivation with a specific error message **before mutating any file**.
  - **Delta (NEW):** Mevcut kontrol (`create-project.sh:90-101`) yalnizca `-z` bos-degil; bu requirement bir `validate_param()` helper'i ile format regex EKLER. Regex'ler resmi konvansiyonlara dayanir (npm name/scope, Apple reverse-DNS bundle ID, FQDN domain) ve mutasyondan ONCE (On Kosul Kontrolleri asamasinda) calisir.
  - Onerilen regex (plan.md'de kesinlesir): NAME `^[a-z0-9][a-z0-9-]*$`; SCOPE `^@?[a-z0-9-~][a-z0-9-._~]*$`; BUNDLE_ID `^[A-Za-z][A-Za-z0-9_]*(\.[A-Za-z][A-Za-z0-9_]*)+$`; DOMAIN `^([a-z0-9-]+\.)+[a-z]{2,}$`.

### R3 — Baseline Tag & Release Workflow (Event + State)

- **REQ-DRV-004** [Event-Driven] WHEN the release workflow runs, the system SHALL create an annotated `bp-v*` tag whose message is derived from the latest `CHANGELOG.md` entry with a semantic category prefix (Zorunlu/Yapisal/Felsefi), and the tag push SHALL trigger `notify-derived-projects.yml`.
  - **Delta (NEW):** `bp-v1.0.0` baseline annotated tag (mevcut stable HEAD'e) + `tooling/release/create-release.sh` standalone script + `release.yml` (workflow_dispatch: version+category) EKLENIR. Tag uretimi idempotent (zaten varsa dogrula, hata verme). `notify-derived-projects.yml` korunur (severity kategorizasyonu `:37-64` referans alinir).
  - **Delta (NEW):** Release oncesi `CHANGELOG.md` entry varligi dogrulanir; yoksa workflow tag olusturmadan fail eder.

- **REQ-DRV-005** [State-Driven] WHILE no `bp-v*` tag exists in the repository, the system SHALL block `upstream-sync.sh` with a clear "baseline tag missing" error and guidance to create `bp-v1.0.0`; AND WHILE the upstream remote is configured and a target `bp-v*` tag exists, the system SHALL perform 3-way merge sync reading the prior hash from `BOUNDARY.md` via a portable parser.
  - **Delta (PRESERVED):** 3-way merge motoru (`sync_exact_file`, `upstream-sync.sh:138-208`) DEGISTIRILMEZ; yalnizca hash okuma kaynagi (bkz. REQ-DRV-006) duzeltilir.

### R4 — BSD/GNU Tasinabilirlik (Unwanted)

- **REQ-DRV-006** [Unwanted Behavior] IF `grep -P` is unsupported on the host (BSD/macOS), THEN the system SHALL still extract `boilerplate_upstream_hash` and `upstream_version` from `BOUNDARY.md` correctly via a portable parser (`sed -nE`), never falling back to FULL_SYNC due to an empty read.
  - **Delta (MODIFIED):** `upstream-sync.sh:79-80` `grep -oP '(?<=...)'` → `sed -nE 's/.*boilerplate_upstream_hash: ([a-f0-9]+).*/\1/p'` (BSD+GNU uyumlu). Ayni duzeltme `tooling/ci/scheduled-audit.yml:229` icin de uygulanir (template kopya — `.github/workflows/scheduled-audit.yml` aktif kopyasi BOUNDARY hash okumuyor, dogrulandi). Mevcut `sed -i.bak` disiplini (`create-project.sh:180` vb.) dogru tasinabilirlik referansidir.

### R5 — Governance Uyumu (Unwanted + Optional)

- **REQ-DRV-007** [Unwanted Behavior] WHEN a CLAUDE.md identity-replacement target string is not found, the system SHALL emit a warning instead of silently no-op'ing; AND the system SHALL NOT emit emoji in any workflow output or issue body; AND the system SHALL replace the 3 hardcoded absolute paths in `.codex/hooks.json` with project-portable references during derivation.
  - **Delta (MODIFIED):** `create-project.sh:379-398` Python replace'i aktif MoAI-ADK format basligina gore guncellenir (sessiz no-op kirilir, fail-loud uyari). `notify-derived-projects.yml:80,87,120` emoji'leri duz metne (`[INFO]`/`[UYARI]`) cevrilir.
  - **Delta (NEW):** `.codex/hooks.json` hardcoded path fix BU SPEC'te yapilir (`/Users/alperenkarip/Projects/boilerplate/.codex/hooks/...` → `$CLAUDE_PROJECT_DIR`/relative). Bu duzeltme SPEC-REFACTOR-GOV-001'de TEKRARLANMAZ.
  - **Delta (DECISION):** CLAUDE.md sentinel/manifest uyumu — manifest CLAUDE.md'yi `partial` bekliyor ama aktif CLAUDE.md'de 0 sentinel var. Karar (plan.md'de kesinlesir): ya CLAUDE.md'ye sentinel eklenir ya da manifest'te `exact`/`skip` yapilir; her iki halde sessiz dosya dusurme YASAK.

- **REQ-DRV-008** [Optional] WHERE the `--reset-git` flag is provided, the system SHALL reinitialize git history with a single initial commit (`Initial commit (derived from boilerplate ${BP_TAG})`), re-add the upstream remote, and persist the pre-reset `BP_HASH` into `BOUNDARY.md` before reset.
  - **Delta (NEW):** `--reset-git` opt-in flag (varsayilan kapali) EKLENIR. `docs/governance/49-upstream-sync-strategy.md:156` "git history temizlenmis derived projeler" varsayimiyla uyum saglar. Aktifken geri donulemez oldugu icin interaktif onay sorar.

---

## Delta Etiket Sozlugu (BROWNFIELD)

| Etiket | Anlam |
|--------|-------|
| NEW | Mevcut kodda olmayan, bu SPEC ile eklenen davranis |
| MODIFIED | Mevcut davranisin degistirildigi nokta (dosya:satir referansli) |
| PRESERVED | Bilincli olarak DEGISTIRILMEYEN saglam motor (regresyon yasak) |
| DECISION | plan.md'de kesinlesecek acik karar noktasi |

---

## Kapsam Disi (What NOT to Build)

- **3-way merge motoru yeniden yazimi:** `upstream-sync.sh:138-208` `sync_exact_file` saglam; yalniz hash okuma kaynagi duzeltilir, motor korunur.
- **Guardrail drift otomasyonu:** Doc 47 §15 (kaynak+versiyon comment'i, CI bagimli-guardrail tespiti, 30-gun-stale Major) → SPEC-REFACTOR-GOV-001 kapsami.
- **Magaza submit / CI deploy / SPA fallback / EAS production:** SPEC-DEPLOY-001 kapsami. `bp-v` tag bu SPEC'te, deploy zinciri DEPLOY'da.
- **Cross-platform UI portu (27 ekran, primitive split):** SPEC-UI-001 kapsami. Bu SPEC yalnizca mevcut ekranlardaki literal METIN rename'ini yapar, yapisal port yapmaz.
- **CLAUDE.md icerik yeniden yapilandirmasi (672 → 500 satir, guardrail protokol blogu):** SPEC-REFACTOR-GOV-001 kapsami. Bu SPEC yalnizca replace/sentinel sessiz-basarisizligini kirar, icerigi yeniden yazmaz.
- **Mobil bootstrap (babel/metro/asset):** SPEC-MOBILE-001 kapsami. Deep-link rename sonrasi gercek deep-link testi MOBILE'a bagli.
