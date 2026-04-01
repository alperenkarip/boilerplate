# İyileştirme Spec List

> Kaynak: `iyilestirme1.md` — Tüm maddeler bağımlılık sırasına göre dizilmiştir.

---

## Faz 1: Yeni Belgeler (Bağımsız — Önce Yazılmalı)

- [x] **1.1** `41-boilerplate-project-boundary-contract.md` oluştur — Inherit/override/extend kuralları, miras tipi tablosu
- [x] **1.2** `42-branching-and-merge-strategy.md` oluştur — Git branching modeli, merge politikası, release branch yönetimi
- [x] **1.3** `44-exception-and-exemption-policy.md` oluştur — Kural sapma formatı, approval workflow, tracking mekanizması
- [x] **1.4** `43-derived-project-creation-guide.md` oluştur — Yeni proje türetme step-by-step rehberi (41'e bağlı)

## Faz 2: Mevcut Belge Revizyonları (Yeni belgeler yazıldıktan sonra)

- [x] **2.1** `35-document-map.md` → §4'e "Boilerplate-Project Governance" belge ailesi ekle (41, 42, 43, 44)
- [x] **2.2** `35-document-map.md` → §10'a "Yeni derived project türetme" senaryosu ekle
- [x] **2.3** `20-initial-implementation-checklist.md` → Faz A'ya "Scaffold script çalıştır" adımı ekle
- [x] **2.4** `30-contribution-guide.md` → §6'ya branching strategy referansı (42) ekle
- [x] **2.5** `16-tooling-and-governance.md` → Enforcement config pack referansları ekle
- [x] **2.6** `32-definition-of-done.md` → §26 AI bölüm forward reference'ları tamamla
- [x] **2.7** `31-audit-checklist.md` → Audit severity matrix tablosu ekle
- [x] **2.8** `31-audit-checklist.md` → Audit remediation SLA bölümü ekle
- [x] **2.9** `29-release-and-versioning-rules.md` → Release decision tree ekle

## Faz 3: GitHub / CI / Template Dosyaları

- [x] **3.1** `.github/PULL_REQUEST_TEMPLATE.md` oluştur — DoD checkbox'ları, canonical check soruları
- [x] **3.2** `.github/CODEOWNERS` oluştur — Package ownership starter
- [x] **3.3** `.github/ISSUE_TEMPLATE/bug.md` oluştur — Bug report standardı
- [x] **3.4** `.github/ISSUE_TEMPLATE/feature.md` oluştur — Feature request standardı
- [x] **3.5** `tooling/ci/ci.yml` oluştur — TypeCheck + Lint + Test + Build + Boundary workflow
- [x] **3.6** `tooling/ci/scheduled-audit.yml` oluştur — Dependency + compatibility + doc freshness
- [x] **3.7** `tooling/governance/exception-template.yaml` oluştur — Exception kayıt formatı

## Faz 4: AI Tooling Starter Dosyaları

- [x] **4.1** `CLAUDE.md` starter template güncellendi — Kodlama standartları, komutlar, hiyerarşi, boundary eklendi
- [x] **4.2** `AGENTS.md` starter template güncellendi — Security, exception, boundary, branching kuralları eklendi
- [x] **4.3** `.claudeignore` starter oluştur — Sensitive dosya exclude listesi

## Faz 5: Onboarding Rehberleri

- [x] **5.1** `docs/onboarding/ilk-30-dakika.md` oluştur — Clone → install → dev server → first component
- [x] **5.2** `docs/onboarding/rol-bazli-okuma-rehberi.md` oluştur — Developer/designer/tech lead fast track'leri

---

**Toplam: 24 madde**
**Tamamlanan: 24/24** ✅
