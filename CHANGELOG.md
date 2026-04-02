# CHANGELOG

Tum degisiklikler miras tipine gore kategorize edilir.
Referans: `docs/governance/49-upstream-sync-strategy.md`

- **ZORUNLU**: Derived projelere 2 sprint (max 4 hafta) icinde yansitilmali
- **YAPISAL**: Derived projelere 4 sprint (max 8 hafta) icinde yansitilmali
- **FELSEFI**: Bilgilendirme, zorunlu sure yok

---

## [bp-v1.0.0] - 2026-04-02

### Ilk stable release

Bu, boilerplate'in ilk versiyonlanmis release'idir. Mevcut tum dokumantasyon,
governance kurallari, AI guardrail altyapisi ve CI pipeline'i icerir.

### ZORUNLU
- **ADR-001 → ADR-019**: 19 canonical architecture decision record
- **Dependency policy**: `37-dependency-policy.md` — paket ekleme/cikarma kurallari
- **Compatibility matrix**: `38-version-compatibility-matrix.md` — surum uyumluluk bantlari
- **Security baseline**: `27-security-and-secrets-baseline.md`
- **Accessibility baseline**: `12-accessibility-standard.md` — WCAG AA minimum esik
- **Boundary contract**: `45-boilerplate-project-boundary-contract.md` — miras modeli
- **AI guardrail'ler**: 25 domain guardrail (D-*) + 30 aktivite guardrail (A-*)
- **Guardrail governance**: `47-ai-guardrail-governance.md`
- **Exception policy**: `44-exception-and-exemption-policy.md`
- **Upstream sync stratejisi**: `49-upstream-sync-strategy.md` — bu mekanizma

### YAPISAL
- **Architecture**: 6 mimari dokuman (modül sinirlari, navigation, state, data, forms)
- **Design system**: 10 dokuman (token spec, governance, HIG, motion, error states)
- **Quality gates**: `15-quality-gates-and-ci-rules.md` — CI kalite kapilari
- **Definition of Done**: `32-definition-of-done.md` — is tamamlama kriterleri
- **Testing strategy**: `14-testing-strategy.md`
- **Performance standard**: `13-performance-standard.md`
- **Branching strategy**: `42-branching-and-merge-strategy.md`
- **Release rules**: `29-release-and-versioning-rules.md`
- **Contribution guide**: `30-contribution-guide.md`
- **CI pipeline**: `ci.yml` + `scheduled-audit.yml`
- **Claude altyapisi**: hooks (2), skills (7), settings.json
- **Derived project guide**: `43-derived-project-creation-guide.md`

### FELSEFI
- **Project charter**: `00-project-charter.md`
- **Working principles**: `01-working-principles.md`
- **Platform philosophy**: `02-product-platform-philosophy.md`
- **Onboarding rehberleri**: `ilk-30-dakika.md`, `rol-bazli-okuma-rehberi.md`

### Etkilenen Dosyalar
Tum docs/, .claude/, tooling/, .github/ dizinleri ve root dosyalar (CLAUDE.md, AGENTS.md)
