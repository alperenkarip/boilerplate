# SPEC-TEST-001 — Acceptance Criteria

Given-When-Then senaryolari (min 4). Tum kabul kriterleri gozlemlenebilir (CI exit code, test ciktisi, dosya varligi, metrik esigi).

## AC-1: Lint gate warning'i bloklar (REQ-LINT-001)

**Given** `eslint.config.js` recommended config'i extend ediyor ve workspace lint script'leri `--max-warnings <BASELINE>` ile calisiyor,
**When** bir pull request, baseline'in uzerinde yeni bir bp-rule warning'i (orn. yeni bir `no-hardcoded-color` ihlali) ekliyor,
**Then** CI lint job'i `exit 1` ile fail eder ve PR merge edilemez.

Dogrulama: `pnpm lint` exit code != 0; CI lint job kirmizi.

## AC-2: bp-rule severity tek kaynaktan + flat-config gecerli (REQ-LINT-001)

**Given** `recommended.js` gecersiz `plugins: [...]` array sozdiziminden arindirildi,
**When** `eslint .` herhangi bir workspace'te calistirilir,
**Then** ESLint config-yukleme hatasi vermez (flat-config gecerli) ve bp-rule severity'leri yalnizca `recommended.js`'den okunur (eslint.config.js'de 19x inline override YOK).

Dogrulama: `eslint .` ciktisi config error icermez; `eslint.config.js` icinde 19 satirlik inline `@project/bp/*: 'warn'` blogu kalmamis.

## AC-3: Generic error bazi temizlendi (REQ-LINT-001)

**Given** 29 generic error-severity ihlal (24x no-explicit-any + 4x no-console + 1x no-undef) duzeltildi,
**When** `npx turbo run lint --output-logs=none` calistirilir,
**Then** komut `exit 0` doner (baseline uzerinde temiz baz).

Dogrulama: `turbo run lint` exit code == 0.

## AC-4: Coverage dususu CI'i kirar (REQ-COV-001)

**Given** `@vitest/coverage-v8` kurulu ve `vitest.config.ts`'de `coverage.thresholds` baseline tanimli,
**When** bir degisiklik olculen coverage'i (lines/functions/branches) baseline esigin altina dusuruyor,
**Then** `vitest run --coverage` threshold ihlali ile `exit 1` doner ve CI test job'i fail eder.

Dogrulama: coverage rapor ciktisinda "ERROR: Coverage ... does not meet threshold"; test job kirmizi.

## AC-5: E2E login davranisi form->submit->redirect dogrular (REQ-E2E-001)

**Given** `auth-flow.spec.ts` davranis-odakli yeniden yazildi ve deterministik MSW fixture aktif,
**When** login E2E testi calisir,
**Then** test form alanlarini doldurur, submit eder ve `expect(page).toHaveURL(...)` ile yonlendirmeyi dogrular; salt `heading visible` assertion'i bulunmaz.

Dogrulama: `auth-flow.spec.ts` icinde `getByLabel().fill()` + `toHaveURL()` mevcut; `getByRole('heading').toBeVisible()` tek-basina-assertion YOK.

## AC-6: Playwright CI'da kosar (REQ-E2E-001)

**Given** `ci.yml`'e ayri `e2e` job eklendi,
**When** CI pipeline calisir,
**Then** Playwright testleri `e2e` job'inda calisir ve sonucu pipeline'i gate eder (su an HIC kosmuyor).

Dogrulama: `grep -E "playwright|e2e" .github/workflows/ci.yml` >= 1 eslesme; CI run loglarinda Playwright adimi gorunur.

## AC-7: eslint-plugin-bp RuleTester matrisi (REQ-PLUGIN-001)

**Given** 19 bp-rule icin RuleTester valid/invalid case'leri yazildi,
**When** plugin testleri calistirilir,
**Then** her kuralin en az 1 valid + 1 invalid case'i gecer ve test job'a dahildir.

Dogrulama: `packages/eslint-plugin-bp` test ciktisinda 19 kural icin valid+invalid case PASS; CI test job'i plugin testlerini icerir.

## AC-8: Scaffolding smoke kalan literali yakalar (REQ-SCAFFOLD-001)

**Given** bats smoke testi `create-project.sh --skip-install` calistiriyor,
**When** uretilen cikti kalan `boilerplate` veya `@project` literali iceriyor (deep-link prefix dahil),
**Then** smoke testi `exit 1` ile fail eder.

Dogrulama: bats test, `AppNavigator.tsx:192` deep-link prefix kalintisini tespit edip fail eder.

## Edge Cases

- **Bos coverage (test yok):** Mobil `--passWithNoTests` kaldirilinca 0 test -> jest fail etmeli (yanictici yesil onlenir). En az 1 smoke test eklenir.
- **Baseline tam sinir:** Warning sayisi baseline'a esit -> PASS; baseline+1 -> FAIL (sinir dahil).
- **MSW fixture 500 senaryosu:** E2E login 500 alirsa form hatasini gosterir, redirect ETMEZ (negatif davranis dogrulamasi).
- **macOS BSD grep:** Scaffolding smoke `grep -oP` (GNU-only) yerine tasinabilir desen kullanmali; macOS runner'da bos donmemeli.
- **Theme/test override:** `eslint.config.js:146-181` theme + test override'lari ratchet sonrasi da korunur (bu dosyalarda bp-rule kapali kalir).

## Kalite Kapisi (Quality Gate)

- [ ] `turbo run lint` exit 0 (generic error temiz, baseline gate aktif)
- [ ] `recommended.js` flat-config gecerli, severity tek kaynak
- [ ] `@vitest/coverage-v8` lockfile'da mevcut, coverage thresholds tanimli
- [ ] Coverage dususu CI test job'ini kirar (kanit: kasitli dusurme -> exit 1)
- [ ] E2E login form->submit->toHaveURL dogrular
- [ ] `ci.yml`'de calisan `e2e` job (Playwright)
- [ ] 19 bp-rule RuleTester valid/invalid matrisi PASS
- [ ] Scaffolding bats smoke kalan literali yakalar
- [ ] Open Decision OD-1 (coverage taban yuzdeleri) implementasyon oncesi olcum + onay ile netlesti

## Definition of Done

- 5 requirement (REQ-LINT/COV/E2E/PLUGIN/SCAFFOLD) icin tum AC'ler gecer.
- Baseline-then-ratchet uygulandi; hicbir kapi tek seferde CI'i kilitlemedi (kanit: PR'lar yesil gecmeye devam etti).
- `ci.yml` degisiklikleri release.yml/deploy.yml ile cakismadi.
- OD-1 acik karari coverage olcumu ile kapatildi ve onaylandi.
