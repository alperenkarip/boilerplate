# SPEC-INFRA-DERIVE-001 (Compact)

Turetme ve yasam dongusu: kapsamli literal rename + bp-v baseline tag/release + parametre validasyonu + BSD/GNU tasinabilirlik. P0, Faz 1, deps: yok. BROWNFIELD.

## Requirements (REQ-XXX)

- **REQ-DRV-001** [Ubiquitous] Turetmede tum `boilerplate` literal'leri (deep-link prefix, i18n locale display-name+copyright, ekran metni) `@project/` rename'ine EK olarak degistir. (MODIFIED: `create-project.sh:175-185`)
- **REQ-DRV-002** [Event] Verify asamasinda `apps/*/src`+`packages/*/src` recursive grep (dist/node_modules haric, whitelist'li); kalan literal → `VERIFY_PASS=false`. (MODIFIED: `create-project.sh:549`)
- **REQ-DRV-003** [Unwanted] NAME/SCOPE/BUNDLE_ID/DOMAIN regex validasyonu mutasyondan ONCE; fail → spesifik hata + exit, disk degismez. (NEW: `create-project.sh:90-101`)
- **REQ-DRV-004** [Event] Release workflow CHANGELOG'dan kategori-prefix'li annotated `bp-v*` tag uretir; push `notify-derived-projects.yml`'i tetikler; CHANGELOG yoksa fail. (NEW: `bp-v1.0.0` + `create-release.sh` + `release.yml`)
- **REQ-DRV-005** [State] Tag yokken `upstream-sync.sh` "baseline missing" ile bloklar; tag+remote varken 3-way merge `BOUNDARY.md`'den portable parser ile okur. (PRESERVED motor: `upstream-sync.sh:138-208`)
- **REQ-DRV-006** [Unwanted] `grep -oP` (BSD-uyumsuz) → `sed -nE`; macOS'ta hash dolu doner, FULL_SYNC'e dusmez. (MODIFIED: `upstream-sync.sh:79-80`, `tooling/ci/scheduled-audit.yml:229`)
- **REQ-DRV-007** [Unwanted] CLAUDE.md replace bulunamazsa uyari (sessiz no-op kir); workflow ciktisinda emoji yok; `.codex/hooks.json` 3 hardcoded path → portable. (MODIFIED: `create-project.sh:379-398`, `notify:80,87,120`; NEW: `.codex/hooks.json`)
- **REQ-DRV-008** [Optional] `--reset-git` opt-in: history sifirla + initial commit + upstream re-add + BP_HASH BOUNDARY.md'ye yaz. (NEW)

## Acceptance (ozet)

- AC-1: deep-link+i18n+ekran rename, copyright yili korunur, src tarama 0 literal.
- AC-2: gecersiz param → exit, disk degismez (`git status` temiz).
- AC-3: tag yok → sync bloklanir; tag var → 3-way merge, FULL_SYNC'e dusmez.
- AC-4: macOS'ta `sed -nE` hash dolu doner; `grep -oP` kalmaz.
- AC-5: release annotated tag + notify tetikler; CHANGELOG yoksa fail.
- AC-6: CLAUDE.md fail-loud; `.codex` 0 `/Users/`; emoji yok.

## Degisecek Dosyalar

- `tooling/derive/create-project.sh` (validate_param, literal rename, verify genisletme, CLAUDE.md replace fix, .codex path fix, --reset-git)
- `tooling/sync/upstream-sync.sh:79-80` (grep -oP → sed -nE)
- `tooling/ci/scheduled-audit.yml:229` (grep -oP → sed -nE, template kopya)
- `tooling/release/create-release.sh` (YENI)
- `.github/workflows/release.yml` (YENI)
- `.github/workflows/notify-derived-projects.yml:80,87,120` (emoji → duz metin)
- `.codex/hooks.json` (3 hardcoded path → portable)
- `tooling/sync/upstream-sync-manifest.yaml` (CLAUDE.md mode karari + release.yml entry)
- `git tag bp-v1.0.0` (YENI baseline)

## Kapsam Disi

- 3-way merge motoru yeniden yazimi (motor saglam, korunur).
- Guardrail drift otomasyonu, CLAUDE.md icerik yeniden yapilandirmasi → SPEC-REFACTOR-GOV-001.
- Magaza/CI deploy/SPA fallback/EAS → SPEC-DEPLOY-001 (bp-v tag burada, deploy orada).
- Cross-platform UI portu (primitive split, ekran yapisi) → SPEC-UI-001 (bu SPEC yalniz literal METIN rename).
- Mobil bootstrap (babel/metro/asset) → SPEC-MOBILE-001.
