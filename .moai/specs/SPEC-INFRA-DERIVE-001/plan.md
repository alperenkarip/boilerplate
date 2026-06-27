# Plan — SPEC-INFRA-DERIVE-001

Turetme ve yasam dongusu duzeltmeleri icin uygulama plani. Bu plan WHAT/WHY'i (spec.md) HOW'a baglar; kod yazmaz, gorev decomposition + teknoloji + risk sunar.

## Teknoloji ve Surum

| Bilesen | Surum / Arac | Not |
|---------|--------------|-----|
| Shell | POSIX sh / bash (BSD+GNU uyumlu) | `grep -oP` YASAK; `sed -nE`, `sed -i.bak`, `grep -rin` kullanilir |
| JSON donusumu | `jq` (mevcut, preflight'ta dogrulaniyor) | i18n locale + package.json + app.json icin |
| Python | `python3` (CLAUDE.md replace adimi icin) | preflight'a bagimlilik kontrolu eklenir |
| CI | GitHub Actions (`release.yml` yeni, `notify-derived-projects.yml` mevcut) | workflow_dispatch tabanli release |
| Versiyonlama | `bp-vMAJOR.MINOR.PATCH` annotated git tag | MAJOR=Zorunlu, MINOR=Yapisal, PATCH=Felsefi (49-strategy ile uyumlu) |

## Gorev Decomposition (oncelik sirali, sure tahmini YOK)

### Oncelik High — Sync'i canlandiran cekirdek (R3 + R4 + R5 path fix)

1. **bp-v1.0.0 baseline tag** — `git tag -a bp-v1.0.0 -m "Ilk stable baseline"` bilincli "stable" kabul edilen commit'e (mevcut HEAD). Idempotent: zaten varsa dogrula.
   - Reference: `tooling/sync/upstream-sync.sh:65-70` (tag yoksa exit 1); `docs/governance/49-upstream-sync-strategy.md:70` (baseline tanimi).
2. **BSD/GNU hash okuma fix** — `upstream-sync.sh:79-80` `grep -oP` → `sed -nE`. Cikti bossa fail-loud uyari (FULL_SYNC'e sessiz dusme yerine).
   - Reference: `tooling/sync/upstream-sync.sh:79-80`; `tooling/ci/scheduled-audit.yml:229` (template kopya — ayni fix).
   - DOGRULAMA NOTU: `.github/workflows/scheduled-audit.yml` (217 satir, aktif) BOUNDARY hash OKUMUYOR; `grep -oP` yalniz `tooling/ci/` template kopyasinda. Fix template kopyaya + sync.sh'e uygulanir.
3. **.codex/hooks.json path fix** — 3 hardcoded absolute path (`/Users/alperenkarip/Projects/boilerplate/.codex/hooks/...`) → `$CLAUDE_PROJECT_DIR` veya relative. `create-project.sh`'e bu dosyayi derive sirasinda duzelten adim eklenir.
   - Reference: `.codex/hooks.json:9,18,29` (PreToolUse Edit|Write, PreToolUse Bash, PostToolUse Edit|Write).
4. **CLAUDE.md sessiz no-op fix + sentinel karari** — `create-project.sh:379-398` Python replace'i `# MoAI Execution Directive` formatina gore guncelle; string bulunamazsa uyari bas. Manifest CLAUDE.md mode karari (sentinel ekle VEYA exact/skip).
   - Reference: `create-project.sh:379-398`; `tooling/sync/upstream-sync-manifest.yaml` (CLAUDE.md root partial bekliyor, satir 106+); aktif `CLAUDE.md:1` (`# MoAI Execution Directive`, 0 sentinel).

### Oncelik High — Turetme dogrulugu (R1 + R2)

5. **Parametre validasyonu (R2)** — `validate_param()` helper, On Kosul Kontrolleri asamasinda (`create-project.sh:106` civari), mutasyondan ONCE. 4 regex (NAME/SCOPE/BUNDLE_ID/DOMAIN) + test vektorleri (gecerli/gecersiz).
   - Reference: `create-project.sh:90-101` (mevcut -z kontrolu); context7 ile Expo slug + npm name + Apple bundle-id resmi kurallari dogrulanir.
6. **Kapsamli literal rename (R1)** — Faz 1.3'e serbest literal rename adimi: deep-link prefix (sed), i18n locale (jq), ekran metni (sed, copyright yili korunur).
   - Reference: `AppNavigator.tsx:192`; `apps/web/src/i18n/locales/{en,tr}/common.json`, `{en,tr}/shell.json:140`; `SplashScreen.tsx:16`; `AboutScreen.tsx:63`.
7. **Verify genisletme (R1)** — Faz 6'ya `grep -rin "boilerplate" apps/*/src packages/*/src` (dist/node_modules haric) + whitelist; kalan literal → `VERIFY_PASS=false`.
   - Reference: `create-project.sh:549` (mevcut 4-dosya tarama).

### Oncelik Medium — Release otomasyonu + opt-in (R3 + R5)

8. **tooling/release/create-release.sh** — CHANGELOG.md son entry → semantic kategori → annotated tag mesaji; `--push` opsiyonu; CHANGELOG entry yoksa fail.
   - Reference: `notify-derived-projects.yml:37-64` (severity→kategori mapping).
9. **release.yml workflow** — workflow_dispatch (input: version + category); tag olustur+push → `notify-derived-projects.yml` tetiklenir. Manifest'e release.yml entry eklenir.
10. **notify-derived-projects.yml emoji fix** — `:80,87,120` info/warning unicode emoji karakterleri → `[INFO]`/`[UYARI]` duz metin.
11. **--reset-git opt-in flag (R5/REQ-DRV-008)** — varsayilan kapali; aktifse rm -rf .git → git init → initial commit; BP_HASH reset oncesi BOUNDARY.md'ye yaz; interaktif onay.
    - Reference: `docs/governance/49-upstream-sync-strategy.md:156` (history-free varsayim).

## MX Tag Plani

| Dosya / Fonksiyon | MX Tag | Gerekce |
|-------------------|--------|---------|
| `validate_param()` (yeni helper) | `@MX:ANCHOR` | Mutasyondan once cagrilan invariant kapi; tum parametre yollari buradan gecer (yuksek fan_in) |
| `bp-v1.0.0` baseline tag adimi | `@MX:WARN` + `@MX:REASON` | Yanlis commit'e tag = 3-way merge base bozulur (geri donulemez governance etkisi) |
| `--reset-git` reset blogu | `@MX:WARN` + `@MX:REASON` | `rm -rf .git` geri donulemez history kaybi |
| `grep -oP → sed -nE` hash okuma | `@MX:NOTE` | BSD/GNU tasinabilirlik niyeti; cikti bossa fail-loud sebebi belgelenir |
| CLAUDE.md replace fix | `@MX:NOTE` | Sessiz no-op'un neden kirildigi (format degisikligi) belgelenir |
| Literal rename whitelist | `@MX:NOTE` | Hangi literal'lerin neden korundugu (mesru upstream referanslari) |

## Riskler ve Azaltma

| Risk | Azaltma |
|------|---------|
| Kapsamli rename mesru `boilerplate` referanslarini (upstream sync dokuman yollari, BOUNDARY.md basliklari) yanlislikla degistirir | Rename'i yalniz `apps/*/src` + `packages/*/src` + belirli pattern'lerle sinirla; `docs/` ve BOUNDARY.md/CHANGELOG.md kapsam disi; whitelist + dry-run diff zorunlu |
| `bp-v1.0.0` yanlis commit'e atilirsa 3-way merge base bozulur | Tag'i bilincli "stable" commit'e at; mesajda baseline tarihi+kapsam belgele; idempotent (zaten varsa dogrula) |
| Parametre regex cok kati meşru kenar durumlari bloklar; cok gevsek EAS/npm reddini gecirir | context7 ile Expo/npm/Apple resmi kurallari dogrula; test vektorleriyle (gecerli/gecersiz) sabitle |
| `grep -oP → sed` donusumu regex semantigini degistirip yanlis deger dondurur | Bilinen BOUNDARY.md icerigiyle birim test; macOS+Linux iki ortam manuel dogrulama; cikti bossa fail-loud |
| CLAUDE.md sentinel ekleme icerik kaybina yol acar | Sentinel'leri manifest sync_sections ile birebir esle; AGENTS.md (8 sentinel, calisiyor) referansli regresyon; diff-dogrulama |
| `--reset-git` yanlis kullanimda katki gecmisini siler | Varsayilan kapali (opt-in); interaktif onay; BP_HASH reset oncesi BOUNDARY.md'ye yaz; --help'te uyari |
| CI dosya yolu uyumsuzlugu (tooling/ci vs .github/workflows) yanlis source-of-truth secimi aktif CI'yi bozar | Aktif workflow (.github/workflows/) source-of-truth; tooling/ci template'i ya kaldir ya da "generated" isaretle; manifest'i buna gore guncelle |

## Bagimlilik Notlari

- deps: yok (Faz 1, SPEC-MOBILE-001 ile paralel — farkli dosya alani: `tooling/derive` + `tooling/sync` vs `apps/mobile` config).
- TEMA bagi: deep-link rename sonrasi gercek deep-link testi SPEC-MOBILE-001'e bagli (bootstrap olmadan mobil acilmaz).
- `.codex/hooks.json` path fix BU SPEC'te (SPEC-REFACTOR-GOV-001 tekrarlanmaz — spec.md REQ-DRV-007 ile sabitlendi).
