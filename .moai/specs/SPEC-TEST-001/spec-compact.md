# SPEC-TEST-001 (Compact) — Enforcement-first kalite

P1 / Faz 3 / deps: SPEC-API-001, SPEC-AUTH-001, SPEC-UI-001, SPEC-INFRA-DERIVE-001
Strateji: baseline-then-ratchet (tek seferde error YOK, CI kilitlenmez)

## Requirements (REQ-XXX)

- **REQ-LINT-001** (Event-Driven + Unwanted): bp-rule severity tek-kaynak (`recommended.js` flat-config fix), `eslint.config.js` 19x inline warn override kaldir, CI `--max-warnings <BASELINE>` -> ratchet 0, 29 generic error fix (24 any + 4 console + 1 undef). SHALL NOT: tum kurallari tek seferde error.
- **REQ-COV-001** (State-Driven): `@vitest/coverage-v8` ekle (lockfile'da YOK), web `vitest.config.ts` coverage.thresholds per-package, mobil `jest.config.js` coverageThreshold + `src/test/setup.ts` olustur. WHILE coverage < baseline -> CI fail.
- **REQ-E2E-001** (Event-Driven): heading-visible -> form.fill->submit->toHaveURL; `ci.yml`'e `e2e` job (Playwright su an HIC kosmuyor); deterministik MSW fixture (SPEC-API-001).
- **REQ-PLUGIN-001** (Ubiquitous): 19 bp-rule RuleTester valid/invalid matrisi (her kuralda >=1 valid + >=1 invalid).
- **REQ-SCAFFOLD-001** (Optional + Event-Driven): bats smoke `create-project.sh --skip-install` -> kalan `boilerplate`/`@project` literal ara (deep-link prefix dahil) -> exit 1.

## Acceptance (ozet)

- AC-1: yeni warning baseline asar -> lint job exit 1.
- AC-4: coverage baseline altina duser -> test job exit 1.
- AC-5: login form->submit->toHaveURL dogrular (heading-only YOK).
- AC-6: `ci.yml`'de calisan Playwright `e2e` job.
- AC-8: scaffolding smoke kalan literali yakalar.

## Open Decision

- **OD-1**: Coverage threshold taban yuzdeleri KARAR VERILMEDI. Strateji baseline-then-ratchet varsayilir (once olc, dondur, kritik paketler core/auth yuksek, yalniz yukari ratchet). Global %85 dayatma REDDEDILDI. Kesin oranlar dikey dilimler bittikten sonra olcum + onay ile netlesir.

## Degisecek Dosyalar

- `packages/eslint-plugin-bp/src/configs/recommended.js` — flat-config fix (plugins array kaldir)
- `eslint.config.js:117-144` — inline 19x warn override kaldir, recommended extend
- `apps/web/package.json:11-12`, `apps/mobile/package.json:9-10`, `packages/ui/package.json` — lint `--max-warnings`, test `--coverage`
- `apps/web/vitest.config.ts:12-17` — coverage.thresholds bloku
- `apps/mobile/jest.config.js:11` — coverageThreshold
- `apps/mobile/src/test/setup.ts` — YENI (su an YOK)
- `apps/web/e2e/auth-flow.spec.ts` (+ app-shell, smoke) — davranis-odakli yeniden yaz
- `.github/workflows/ci.yml` — `e2e` job ekle + lint/test gate sertlestir (release.yml/deploy.yml'e dokunma)
- `packages/eslint-plugin-bp/src/rules/*.test.js` — YENI 19 RuleTester
- `tooling/derive/*.bats`, `tooling/sync/*.bats` — YENI smoke
- web/mobile/ui kaynak — 29 generic error fix

## Kapsam Disi

1. Tum bp-rule'lari tek seferde error (baseline-then-ratchet, CI kilitlemeden).
2. Gercek backend E2E (yalniz MSW fixture, SPEC-API-001).
3. Yeni feature testleri (mevcut kod kapilari).
4. `bp-v` tag uretimi (SPEC-INFRA-DERIVE-001).
5. security/i18n/a11y ESLint plugin aktivasyonu (eslint.config.js yorumlu satirlar).
