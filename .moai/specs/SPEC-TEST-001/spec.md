---
id: SPEC-TEST-001
version: 0.1.0
status: draft
created: 2026-06-05
updated: 2026-06-05
author: alp
priority: P1
issue_number: 0
---

# SPEC-TEST-001 — Enforcement-first kalite: lint gate sertlestirme + coverage threshold + E2E davranis testi + plugin/scaffolding self-test

## HISTORY

- 2026-06-05 (v0.1.0): Ilk taslak. velocity-remediation-roadmap.md (SPEC karti satir 76-78) + velocity-research-raw.json (themeId: enforcement-first-quality) temel alindi. Gercek kod dogrulandi (eslint.config.js, ci.yml, vitest.config.ts, mobile/package.json, pnpm-lock.yaml, e2e/*.spec.ts, tooling/derive+sync). Coverage threshold tabani **Open Decision** olarak isaretlendi.

## Overview

Bu SPEC, projedeki "yanictici yesil cekirdek" (deceptive green) mekanizmasini ortadan kaldirir. Tum kalite kapilari su anda ya devre disi ya da gate etmiyor: 19 bp-rule'un tamami `warn` seviyesinde ve CI hicbirini bloklamiyor; coverage threshold tanimsiz ve provider lockfile'da bile yok; 13 E2E testi yalnizca sayfa basligi gorunurlugunu kontrol ediyor (davranis dogrulamiyor); Playwright CI'da hic kosmuyor; eslint-plugin-bp'nin 19 kuralinin kendi testi yok; scaffolding/upstream-sync smoke testi yok.

Cozum stratejisi **enforcement-first** ve **baseline-then-ratchet**: mevcut ihlalleri tek seferde `error`'a cevirip CI'i kilitlemek yerine, once olculen mevcut durum dondurulur (baseline), yeni regresyon engellenir, ihlaller sifirlandikca esik kademeli yukseltilir (ratchet). Bu yaklasim, Faz 2 dikey dilimleri (UI refactor: 241 `var(--color)` migrate) sirasinda CI'in kilitlenmesini onler.

Bu SPEC **time-to-product** lensiyle yazilmistir: hedef "her kurali tek seferde mukemmel yapmak" degil, "yeni kod icin kalite kapisini gercekten gate eder hale getirmek ve mevcut kapiyi kademeli sikistirmak"tir.

### Bagimliliklar (deps)

- **SPEC-API-001**: E2E davranis testi deterministik MSW fixture (`/api/auth/*`) uzerinden calisir; gercek backend yok. Fixture katmani API SPEC'inden gelir.
- **SPEC-AUTH-001**: Login form->submit->redirect E2E akisi, canlandirilmis auth formlarina ve route guard'a bagimlidir.
- **SPEC-UI-001**: Coverage baseline'i ve `require-accessibility-props`/`require-form-hook` error yukseltmesi, UI refactor tamamlanmis primitiv/ekranlar uzerinde anlamlidir.
- **SPEC-INFRA-DERIVE-001**: Scaffolding bats smoke testi, literal rename (deep-link prefix dahil) ve `bp-v` tag uretimi INFRA SPEC'inde cozuldukten sonra tam dogrulanir.

## Requirements (EARS)

5 requirement modulu. Her modul EARS 5 tipinden birini kullanir.

### REQ-LINT-001 — bp-rule severity gradyani + CI lint gate (Event-Driven + Unwanted)

[DELTA] Mevcut `eslint.config.js:124-143` 19 kurali inline `warn` ile eziyor; `recommended.js:7` gecersiz `plugins: ['@project/bp']` array sozdizimi flat-config'de calismaz.

- **WHEN** bir pull request CI lint job'ini tetikledigi durumda, **the system shall** ESLint'i `--max-warnings <BASELINE>` ile calistirir ve warning sayisi baseline'i astiginda job'i fail eder (exit 1).
- **The system shall** bp-rule severity gradyanini tek kaynaktan (`recommended.js`) yonetir ve `eslint.config.js` bu config'i extend eder; inline 19x `warn` override kaldirilir.
- **WHEN** bir bp-rule'un mevcut ihlal sayisi sifira indiginde, **the system shall** o kurali kademeli olarak `error` seviyesine yukseltir (ratchet, yalniz yukari).
- **Unwanted**: **The system shall not** tum bp-rule'lari tek seferde `error` yapip CI'i kilitler; baseline asla mevcut warning sayisinin altina elle ayarlanmaz.
- **The system shall** mevcut 29 generic error-severity ihlali (24x `@typescript-eslint/no-explicit-any` + 4x `no-console` + 1x `no-undef`) duzeltir, boylece `turbo run lint` temiz (exit 0) bir baz uzerinde gate eder.

### REQ-COV-001 — Coverage threshold (State-Driven)

[DELTA] `apps/web/vitest.config.ts:12-17` coverage bloku icermez; `@vitest/coverage-v8` `pnpm-lock.yaml`'da YOK (grep count=0); `apps/mobile` jest `coverageThreshold` tanimsiz ve `src/test/setup.ts` dosyasi YOK.

- **The system shall** `@vitest/coverage-v8` provider'i web workspace'ine devDependency olarak ekler ve `apps/web/vitest.config.ts` icine `coverage.thresholds` bloku tanimlar.
- **WHILE** olculen coverage degeri (lines/functions/branches) tanimli baseline esigin altinda kaldigi surece, **the system shall** test job'ini fail eder (CI kirilir).
- **The system shall** mobil tarafta `apps/mobile/jest.config.js` icine `coverageThreshold` ekler ve eksik `apps/mobile/src/test/setup.ts` dosyasini olusturur (jest bir test buldugunda patlamamasi icin).
- **The system shall** coverage esigini per-package uygular; kritik paketler (`packages/core`, auth ilgili) icin daha yuksek, geri kalan icin baseline taban kullanir (kesin oranlar icin Open Decision bolumune bakiniz).

### REQ-E2E-001 — E2E davranis donusumu (Event-Driven)

[DELTA] `apps/web/e2e/auth-flow.spec.ts:5-8` ve 13 testin tamami yalnizca `getByRole('heading').toBeVisible()` kontrol eder; `ci.yml`'de Playwright job'i YOK (grep eslesme=0). Not: `@playwright/test` lockfile'da MEVCUT (3 eslesme) ve `apps/web/playwright.config.ts` mevcut — eksik olan yalniz CI entegrasyonu ve davranis assertion'lari.

- **WHEN** login E2E testi calistigi durumda, **the system shall** form alanlarini doldurur, submit eder ve `expect(page).toHaveURL(...)` ile yonlendirmeyi (redirect) dogrular; salt `heading visible` kontrolu yetersizdir.
- **WHEN** E2E suite CI'da calistigi durumda, **the system shall** Playwright'i ci.yml icindeki ayri bir `e2e` job'inda kosturur; bu job su an HIC calismamaktadir.
- **The system shall** E2E testlerini deterministik MSW fixture (`/api/auth/*`, basari/401/500/bos senaryolari) uzerinde calistirir; gercek backend cagrisi yapmaz (SPEC-API-001 bagimliligi).

### REQ-PLUGIN-001 — eslint-plugin-bp self-test (Ubiquitous)

[DELTA] `packages/eslint-plugin-bp/src/rules/` 19 kural icin 0 test dosyasi (`find ... -name "*.test.*"` bos). Kurallarin regex/AST mantigi regresyona acik.

- **The system shall** 19 bp-rule'un her biri icin ESLint `RuleTester` kullanarak valid/invalid case matrisi bulundurur (her kuralda en az 1 valid + 1 invalid case).
- **The system shall** plugin testlerini CI test job'ina dahil eder, boylece bir kural mantigi degistirildiginde regresyon yakalanir.

### REQ-SCAFFOLD-001 — Scaffolding/upstream-sync bats smoke (Optional + Event-Driven)

[DELTA] `tooling/derive/create-project.sh` ve `tooling/sync/upstream-sync.sh` icin 0 bats testi. `create-project.sh` verify (satir ~179, ~549) yalnizca `@project/` ve sabit dosya listesinde `boilerplate` tarar; `AppNavigator.tsx:192` deep-link prefix'leri ne rename ediliyor ne verify yakaliyor. `upstream-sync.sh:79` `grep -oP` GNU-only (macOS'ta bos doner -> her sync FULL_SYNC'e duser).

- **WHERE** bats-core test calistiricisi mevcut oldugu durumda, **the system shall** `create-project.sh --skip-install` smoke testi calistirir ve uretilen ciktida kalan `boilerplate` / `@project` literallerini arar (deep-link prefix dahil).
- **WHEN** scaffolding smoke testi CI'da calistigi durumda, **the system shall** kalan literal bulundugunda `exit 1` ile fail eder (mevcut boundary/secret-leak job'larindaki `grep -> exit 1` desenini izler).

## Open Decision (Acik Karar)

### OD-1: Coverage threshold baslangic tabani [KARAR VERILMEDI]

**Onerilen strateji (varsayilan): baseline-then-ratchet.**

1. Once mevcut 7 web unit test dosyasinin (`session`, `useAuth`, `analytics`, `Button`, `Primitives`, `sample/hooks`, `sample/api`) urettigi gercek coverage olculur.
2. Bu olculen deger esik olarak DONDURULUR (orn. lines ~%40-50; kesin sayi olcumle belirlenir) — yani CI mevcut durumun altina dusunce kirilir.
3. Kritik paketler (`packages/core`, auth ilgili moduller) icin daha yuksek hedef (orn. lines ~%80+).
4. Esik yalniz yukari hareket eder (ratchet); dususe izin verilmez.

**REDDEDILEN alternatif:** Global sert %85'i tek seferde dayatmak — CI aninda kilitlenir, time-to-product hedefiyle celisir.

**Karar gereken nokta:** Kesin yuzde rakamlari (per-package lines/functions/branches tabanlari). Bu, REQ-UI/REQ-API/REQ-AUTH dikey dilimleri tamamlandiktan sonra gercek olcumle netlesir. SPEC bu noktayi acik birakir; implementasyon oncesi olcum + onay gerekir.

## Exclusions (What NOT to Build) / Kapsam Disi

1. **Tum bp-rule'lari tek seferde `error` yapmak** — Kapsam disi. Baseline-then-ratchet ile asla tek seferde CI kilitlenmez (gerilim cozumu: severity yukseltme erken yapilirsa UI refactor sirasinda CI kilitlenir).
2. **Gercek backend E2E** — Kapsam disi. Yalniz deterministik MSW fixture; gercek API entegrasyonu SPEC-API-001'e aittir.
3. **Yeni feature testleri** — Kapsam disi. Bu SPEC mevcut kodun kalite kapilarini kurar; yeni ozellik + ona ait testler ilgili dikey dilim SPEC'lerine aittir.
4. **`bp-v` tag uretimi** — Kapsam disi. `bp-v*` annotated tag ve `release.yml` SPEC-INFRA-DERIVE-001'e aittir; bu SPEC yalnizca tag varligini varsayan smoke testi yazar.
5. **Generic ESLint kurali setinin genisletilmesi** (security/i18n/a11y plugin'leri) — Kapsam disi. eslint.config.js'deki yorumlu plugin'ler (security, i18next, react-native-a11y) bu SPEC kapsaminda aktiflestirilmez.

## Gerilim Cozumleri (Roadmap'ten)

- **Enforcement erken CI kilitler** -> Bu SPEC Faz 3'te, dikey dilimlerden (Faz 2) SONRA calisir. Baseline-then-ratchet ile asla tek seferde kilitlenmez.
- **INFRA/DEPLOY/TEST ayni CI dosyalarina dokunur** -> `ci.yml`'e yazim, SPEC-INFRA (`release.yml`) ve SPEC-DEPLOY (`deploy.yml`) ile cakismaz (farkli workflow dosyalari/joblar/fazlar). Bu SPEC yalnizca `ci.yml`'e `e2e` job'i + lint/test job sertlestirmesi ekler.
- **E2E gercek backend ister** -> Deterministik MSW fixture ile cozulur (SPEC-API-001 transport/contract'i paylasir).
