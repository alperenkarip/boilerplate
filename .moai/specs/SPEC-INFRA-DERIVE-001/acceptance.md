# Acceptance — SPEC-INFRA-DERIVE-001

Given-When-Then senaryolari + edge case'ler + kalite kapisi. Her senaryo gozlemlenebilir kanit gerektirir; "dogru gorunuyor" yetersizdir.

## Senaryolar (Given/When/Then)

### AC-1 — Kapsamli literal rename (REQ-DRV-001, REQ-DRV-002)

- **Given** boilerplate repo'sunda `AppNavigator.tsx:192` `['boilerplate://', 'https://boilerplate.app']`, i18n locale'lerde `"Boilerplate"` display-name, `SplashScreen.tsx:16` ve `AboutScreen.tsx:63` ekran metni var
- **When** `create-project.sh --name acme --display-name "Acme" --domain acme.app ...` calistirilir
- **Then** deep-link prefix `['acme://', 'https://acme.app']`, i18n display-name `"Acme"`, ekran metinleri `"Acme"` olur; copyright yili (`© 2026`) korunur; verify asamasi `grep -rin "boilerplate" apps/*/src packages/*/src` (dist/node_modules haric) ile 0 (whitelist disi) literal dondurur ve `VERIFY_PASS=true` raporlar

### AC-2 — Parametre validasyonu mutasyondan once (REQ-DRV-003)

- **Given** gecersiz bir parametre verilir (orn `--bundle-id "Com Acme App"` bosluklu, veya `--name "Acme_App"` buyuk harf/underscore)
- **When** `create-project.sh` calistirilir
- **Then** script On Kosul Kontrolleri asamasinda spesifik hata mesajiyla (`gecersiz BUNDLE_ID: ...`) `exit 1` yapar; `app.json`, `package.json` veya hicbir dosya DEGISTIRILMEMIS olur (disk mutasyonu yok — `git status` temiz)

### AC-3 — Baseline tag yoksa sync bloklanir, varsa calisir (REQ-DRV-005)

- **Given** repo'da hic `bp-v*` tag yok
- **When** turetilmis projede `upstream-sync.sh bp-v1.0.0` calistirilir
- **Then** "baseline tag missing" benzeri net hata + `bp-v1.0.0` olusturma rehberi basilir, `exit 1`
- **Ve (Given)** `bp-v1.0.0` annotated tag mevcut olunca **(When)** sync tekrar calistirilir **(Then)** `BOUNDARY.md`'den onceki hash dogru okunur (bos degil) ve 3-way merge yolu (`sync_exact_file`) calisir, FULL_SYNC'e DUSMEZ

### AC-4 — BSD/GNU tasinabilirlik (REQ-DRV-006)

- **Given** macOS (BSD grep, `darwin` ortami — alp'in makinesi) ve `BOUNDARY.md` icinde `boilerplate_upstream_hash: a1b2c3d`
- **When** `upstream-sync.sh` hash okuma adimi calisir
- **Then** `sed -nE` ile `CURRENT_HASH=a1b2c3d` dolu doner (bos DEGIL); ayni komut Linux'ta da ayni sonucu verir; hicbir `grep -oP`/`grep -P` kalmaz (`grep -rn "grep -oP" tooling/` ciktisi bos)

### AC-5 — Release workflow annotated tag uretir ve notify tetikler (REQ-DRV-004)

- **Given** `CHANGELOG.md`'de hedef versiyon (orn `bp-v1.1.0`) icin entry var
- **When** `release.yml` workflow_dispatch (version=bp-v1.1.0, category=Yapisal) ile tetiklenir
- **Then** kategori-prefix'li mesajla annotated `bp-v1.1.0` tag olusur+push edilir; `notify-derived-projects.yml` `on: push: tags: bp-v*` ile tetiklenir; CHANGELOG entry yoksa workflow tag OLUSTURMADAN fail eder

### AC-6 — Governance uyumu: sessiz no-op kirilir, emoji yok, .codex portable (REQ-DRV-007)

- **Given** aktif CLAUDE.md `# MoAI Execution Directive` formatinda; `notify-derived-projects.yml` emoji iceriyor; `.codex/hooks.json` 3 hardcoded absolute path iceriyor
- **When** turetme calistirilir
- **Then** CLAUDE.md replace hedef string bulundugunda guncellenir, BULUNAMAZSA uyari basilir (sessiz no-op YOK); turetilen projede `.codex/hooks.json` hicbir `/Users/alperenkarip` icermez (`grep -c "/Users/" .codex/hooks.json` = 0); `notify-derived-projects.yml` ciktisinda emoji yok (`[INFO]`/`[UYARI]` duz metin)

## Edge Case'ler

- **Whitelist literal'i:** `apps/web/src` icinde mesru bir "boilerplate" referansi (orn upstream sync dokuman yolu yorumu) varsa verify FAIL ETMEMELI — whitelist devreye girer.
- **Idempotent tag:** `bp-v1.0.0` zaten varken release script tekrar calisirsa hata vermez, mevcut tag'i dogrular.
- **Scope `@` varyasyonu:** `--scope @acme` ve `--scope acme` ikisi de SCOPE regex'ten gecmeli; rename `SCOPE_CLEAN` (@ temizlenmiş) ile yapilmali.
- **Copyright yili korunmasi:** Rename "Boilerplate" → DISPLAY_NAME yaparken `© 2026` yilini bozMAMALI.
- **--reset-git iptal:** Interaktif onayda "h" girilirse reset YAPILMAMALI, history korunmali.
- **CHANGELOG eksik:** Hedef versiyon entry'si yoksa release tag olusturmadan fail (yarim tag yok).
- **sed cikti bos:** Hash okuma `sed -nE` bos donerse fail-loud uyari (sessiz FULL_SYNC'e dusme YASAK).

## Kalite Kapisi (Definition of Done)

- [ ] AC-1..AC-6 senaryolari gozlemlenebilir kanitla (komut ciktisi / `git status` / `grep` sonucu) gecer
- [ ] `grep -rn "grep -oP" tooling/ .github/workflows/` ciktisi BOS (hicbir GNU-only Perl regex kalmaz)
- [ ] `grep -c "/Users/" .codex/hooks.json` turetilen projede 0
- [ ] `git tag -l 'bp-v*'` en az `bp-v1.0.0` listeler
- [ ] Parametre regex'leri test vektorleriyle (gecerli/gecersiz, context7-dogrulanmis) sabitlenmis
- [ ] BROWNFIELD regresyon: 3-way merge `sync_exact_file` ve notify severity kategorizasyonu DEGISTIRILMEMIS (PRESERVED)
- [ ] Hicbir workflow ciktisinda emoji yok ([HARD] emoji yasagi)
- [ ] Bash script'leri BSD+GNU iki ortamda manuel dogrulanmis (en az README/PR notu)
- [ ] CLAUDE.md replace fail-loud (sessiz no-op kirildigi senaryo testiyle kanitli)
