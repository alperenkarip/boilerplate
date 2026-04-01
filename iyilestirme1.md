BOILERPLATE STRATEJİK İYİLEŞTİRME ANALİZİ

  ---
  1. YÖNETİCİ ÖZETİ

  Güçlü Taraflar

  Bu boilerplate, gördüğüm en disiplinli documentation-first yaklaşımlardan biri. 51 belge + 11 ADR + ~55.000 satır ile
   her kritik karar kilitlenmiş, otorite zinciri tanımlı, belge aileleri birbirine bağlı. Spesifik güçler:

  - Karar katmanı kristal berraklığında: ADR-001→011 + canonical stack lock + dependency policy + compatibility matrix
  = karar katmanı tamamlanmış, locked ve birbiriyle tutarlı
  - Otorite hiyerarşisi çalışıyor: Foundation → Standards → Architecture → Decisions → Operations → Audit zinciri
  kesintisiz
  - Cross-platform felsefe operasyonel: Behavior parity > design parity > implementation parity hiyerarşisi tüm
  belgelere yayılmış
  - Governance mekanizmaları belgelenmiş: Audit checklist, DoD, contribution guide, component governance — kurallar var
  - AI entegrasyon vizyonu ileri: CLAUDE.md / AGENTS.md template taslakları, MoAI-ADK entegrasyon planı, Stitch
  pipeline tasarımı

  En Yüksek Fayda Sağlayacak İyileştirme Kümeleri

  1. Enforcement gap kapatma: Kuralların ~%80'i yazılı ama ~%15'i enforce edilebilir. Bu oran %60+'ya çıkmalı.
  2. Derived project starter kit: Türetilen projeler için hazır config + template + scaffold set eksik.
  3. CI/CD starter pack: GitHub Actions workflow şablonları yok.
  4. Bootstrap automation: 16 fazlık checklist mekanik ama scaffold script yok.
  5. Boilerplate-project sınır belgesi: Türetilen projenin neyi override edebileceği, neyi koruyacağı belirsiz.

  Türetilen Projelerde En Çok Değer Üretecek 5 İyileştirme

  ┌─────┬─────────────────────────────────────────────────────────┬────────────────────────────────────────────────┐
  │  #  │                       İyileştirme                       │                 Çarpan Etkisi                  │
  ├─────┼─────────────────────────────────────────────────────────┼────────────────────────────────────────────────┤
  │ 1   │ Project Bootstrap Kit (scaffold script + starter        │ Her yeni projede 2-3 gün kazandırır            │
  │     │ configs + env template)                                 │                                                │
  ├─────┼─────────────────────────────────────────────────────────┼────────────────────────────────────────────────┤
  │ 2   │ CI Starter Pack (GitHub Actions workflows + pre-commit  │ Her projede sıfırdan CI yazmayı engeller       │
  │     │ hooks)                                                  │                                                │
  ├─────┼─────────────────────────────────────────────────────────┼────────────────────────────────────────────────┤
  │ 3   │ Boilerplate-Project Boundary Contract                   │ Derived projede "bu kuralı override edebilir   │
  │     │                                                         │ miyim?" sorusunu yok eder                      │
  ├─────┼─────────────────────────────────────────────────────────┼────────────────────────────────────────────────┤
  │ 4   │ Enforcement Config Pack (ESLint custom rules + boundary │ Yazılı kuralları otomatik enforce eder         │
  │     │  checker + token scanner)                               │                                                │
  ├─────┼─────────────────────────────────────────────────────────┼────────────────────────────────────────────────┤
  │ 5   │ Auth + i18n + Observability Adapter Skeletons           │ Her projede aynı boilerplate kodu tekrar       │
  │     │                                                         │ yazmayı engeller                               │
  └─────┴─────────────────────────────────────────────────────────┴────────────────────────────────────────────────┘

  En Büyük Sistemik Eksik

  Belge ile kod arasındaki köprü yok. Belge seti olağanüstü; ama bir geliştirici "peki şimdi ne yapayım?" dediğinde
  karşısında 55.000 satır belge ve sıfır çalışan config dosyası var. Bootstrap checklist (20) faz faz tarif ediyor ama
  scaffold script, starter config veya template dosyalar sağlamıyor. Bu, documentation-first yaklaşımın doğal sonucu
  ama şimdi kapatılması gereken en kritik boşluk.

  ---
  2. BOILERPLATE'E AİT OLMASI GEREKEN AMA EKSİK / GÜÇLENDİRİLMESİ GEREKEN ALANLAR

  2.1 Boilerplate-Project Boundary Contract

  - Eksik: Derived projenin boilerplate kararlarından hangilerini inherit edeceği, hangilerini override edebileceği,
  hangilerini extend edebileceği bir sözleşme yok
  - Neden boilerplate'e ait: Her derived projede tekrar tekrar sorulan "bunu değiştirebilir miyim?" sorusunu yok eder
  - Derived project faydası: Yanlış override'ı engeller, doğru customization'ı hızlandırır
  - Kritiklik: P0 — bu olmadan derived project hangi kuralı koruyacağını bilemez

  2.2 CI/CD Starter Pack

  - Eksik: .github/workflows/ altında ci.yml, deploy-web.yml, deploy-mobile.yml, scheduled-audit.yml şablonları
  - Neden boilerplate'e ait: Her derived projede aynı CI pipeline sıfırdan yazılacak;
  15-quality-gates-and-ci-rules.md'deki kuralların executable hali
  - Derived project faydası: CI kurulumunda 1-2 hafta tasarruf, quality gate uyumu otomatik
  - Kritiklik: P0 — CI olmadan quality gates kağıtta kalır

  2.3 Enforcement Config Pack

  - Eksik: Token tüketim scanner, boundary enforcement (import graph), hardcoded value detection, component API surface
   validation
  - Neden boilerplate'e ait: 16-tooling-and-governance.md'de tanımlı ~50 kural yazılı ama enforce edilemiyor
  - Derived project faydası: Sapmayı editor-time ve CI-time'da yakalar, review yükünü azaltır
  - Kritiklik: P0 — enforce edilmeyen kural, kural değildir

  2.4 Bootstrap Scaffold Script

  - Eksik: scripts/bootstrap.sh veya pnpm create komutu — repo yapısını, config dosyalarını, starter package'ları
  otomatik oluşturan script
  - Neden boilerplate'e ait: 20-initial-implementation-checklist.md 16 faz tarif ediyor ama execution manual
  - Derived project faydası: Her projede yapı hatası riski %90 azalır, bootstrap süresi saatlerden dakikalara iner
  - Kritiklik: P1 — belge setinden sonra en acil ihtiyaç

  2.5 PR Template + Review Checklist

  - Eksik: .github/PULL_REQUEST_TEMPLATE.md — canonical stack uyumu, boundary kontrolü, DoD maddeleri, docs sync
  soruları
  - Neden boilerplate'e ait: 30-contribution-guide.md ve 32-definition-of-done.md'deki review soruları PR template'de
  somutlaşmalı
  - Derived project faydası: Her PR'da review tutarlılığı sağlar, review kalitesini kişisel dikkatten sisteme taşır
  - Kritiklik: P1

  2.6 Adapter/Skeleton Code Templates

  - Eksik: Auth adapter interface, secure storage wrapper, i18n config skeleton, observability initialization,
  structured logger wrapper
  - Neden boilerplate'e ait: ADR-010, ADR-011, ADR-009'daki kararların starter implementasyonu
  - Derived project faydası: Her projede aynı boilerplate adapter kodu tekrar yazılmaz
  - Kritiklik: P1

  2.7 Derived Project ADR Policy

  - Eksik: Derived projenin kendi ADR yazıp yazamayacağı, boilerplate ADR'leriyle ilişkisi, project/ dizini altında ADR
   yapısı
  - Neden boilerplate'e ait: ADR yönetimi boilerplate'in core governance'ı; türetilen projede ADR kullanımı
  standartlaştırılmalı
  - Derived project faydası: Projeye özel mimari kararlar izlenebilir, boilerplate kararlarıyla çelişme riski azalır
  - Kritiklik: P1

  2.8 Branching Strategy

  - Eksik: Trunk-based, feature branch, release branch veya gitflow — hiçbir strateji belgelenmemiş
  - Neden boilerplate'e ait: 30-contribution-guide.md PR workflow tarif ediyor ama branching modeli tanımsız
  - Derived project faydası: Her projede branching tartışması olmaz, CI ve release flow'u buna bağlı
  - Kritiklik: P1

  2.9 Exception & Exemption Tracking

  - Eksik: Kurallardan geçici veya kalıcı sapma takip mekanizması (exception.yaml, exemption dashboard)
  - Neden boilerplate'e ait: 31-audit-checklist.md ve 16-tooling-and-governance.md exception'dan bahsediyor ama
  tracking formatı yok
  - Derived project faydası: "Neden bu kural ihlal edildi?" sorusu track edilir, teknik borç görünür olur
  - Kritiklik: P2

  2.10 Documentation Freshness Audit Mekanizması

  - Eksik: 35-document-map.md 13 belgeyi "drift riski" olarak işaretliyor ama drift tespiti manual
  - Neden boilerplate'e ait: Documentation-first proje, belge tutarsızlığı en büyük risk
  - Derived project faydası: Belge-kod tutarsızlığını otomatik tespit eder
  - Kritiklik: P2

  ---
  3. TÜRETİLEN PROJELER İÇİN EN ÇOK FAYDA SAĞLAYACAK EKLEMELER

  3.1 Project Bootstrap Kit

  - Hangi aşamada: Proje başlatma (Faz A-C)
  - Hangi hatayı önler: Yanlış dizin yapısı, eksik config, tutarsız dependency versiyonları
  - Hangi ekip/proje tipinde daha çok değer: Tüm projeler, özellikle küçük ekipler
  - Reusable: Evet — her derived project aynı script'i çalıştırır

  3.2 Auth Baseline Kit (Adapter + Types + Test Templates)

  - Hangi aşamada: Feature geliştirme (Faz L)
  - Hangi hatayı önler: Wrong-user leak, session restore hataları, logout cleanup eksikliği
  - Hangi ekip/proje tipinde daha çok değer: User-facing ürünler, çoklu kullanıcı switch eden uygulamalar
  - Reusable: Evet — session state machine ve cleanup checklist universal

  3.3 Design Token Pipeline (Figma → Code)

  - Hangi aşamada: DS kurulumu (Faz G-I)
  - Hangi hatayı önler: Hardcoded renkler, tutarsız spacing, platform arası token uyumsuzluğu
  - Hangi ekip/proje tipinde daha çok değer: Design system kullanan tüm projeler
  - Reusable: Evet — pipeline config reusable, token değerleri proje-özel

  3.4 Quality Gate CI Workflows

  - Hangi aşamada: CI kurulumu (Faz D)
  - Hangi hatayı önler: TypeScript hataları, lint ihlalleri, test failure'ları production'a geçmesi
  - Hangi ekip/proje tipinde daha çok değer: Tüm projeler
  - Reusable: Evet — workflow şablonları parameterize edilebilir

  3.5 Component Scaffold Generator

  - Hangi aşamada: Component geliştirme (sürekli)
  - Hangi hatayı önler: Tutarsız component yapısı, eksik test dosyaları, eksik a11y prop'ları
  - Hangi ekip/proje tipinde daha çok değer: Design system odaklı projeler
  - Reusable: Evet — pnpm generate:component komutu universal

  3.6 Observability Starter (Sentry + Structured Logger)

  - Hangi aşamada: Observability kurulumu (Faz O)
  - Hangi hatayı önler: Sensitive data leak'i error tracking'e, yapılandırılmamış log çıktıları
  - Hangi ekip/proje tipinde daha çok değer: Production uygulamalar
  - Reusable: Evet — Sentry config ve sanitization hook'u universal

  3.7 i18n Config + Namespace Scaffold

  - Hangi aşamada: i18n kurulumu (Faz N)
  - Hangi hatayı önler: Inline string'ler, tutarsız namespace yapısı, formatting hataları
  - Hangi ekip/proje tipinde daha çok değer: Çok dilli ürünler
  - Reusable: Evet — config skeleton ve namespace yapısı universal

  ---
  4. YÜKSEK ÇARPAN ETKİLİ YENİ BELGE / TEMPLATE / RULEBOOK / CHECKLIST ÖNERİLERİ

  4.1 41-boilerplate-project-boundary-contract.md

  - Amacı: Derived projenin boilerplate kurallarından hangilerini koruyacağı, hangilerini override/extend edebileceği
  - Hangi boşluğu kapatır: Her derived projede "bu kuralı değiştirebilir miyim?" belirsizliği
  - Hangi mevcut belgelere bağlanır: 00-project-charter, 01-working-principles, 36-canonical-stack,
  37-dependency-policy
  - Boilerplate'e ait: Evet — sınır tanımı boilerplate'in sorumluluğu

  4.2 42-branching-and-merge-strategy.md

  - Amacı: Git branching modeli, merge politikası, release branch yönetimi
  - Hangi boşluğu kapatır: 30-contribution-guide PR workflow tarif ediyor ama branching modeli yok
  - Hangi mevcut belgelere bağlanır: 30-contribution-guide, 29-release-and-versioning, 15-quality-gates
  - Boilerplate'e ait: Evet — CI ve release flow'u buna bağlı

  4.3 43-derived-project-creation-guide.md

  - Amacı: Yeni proje türetme step-by-step rehberi + scaffold script referansı
  - Hangi boşluğu kapatır: 20-initial-implementation-checklist operasyonel ama "yeni proje nasıl başlatılır?" yok
  - Hangi mevcut belgelere bağlanır: 20-checklist, 21-repo-structure, 41-boundary-contract
  - Boilerplate'e ait: Evet — türetme süreci boilerplate'in değer önerisi

  4.4 .github/PULL_REQUEST_TEMPLATE.md (template dosya)

  - Amacı: PR açarken canonical stack uyumu, boundary kontrolü, DoD maddeleri, docs sync soruları
  - Hangi boşluğu kapatır: 32-DoD ve 30-contribution-guide'daki review soruları PR'da otomatik görünmüyor
  - Hangi mevcut belgelere bağlanır: 32-DoD, 30-contribution-guide, 31-audit-checklist
  - Project starter: Evet — derived project .github/ altında bu template'i kullanır

  4.5 tooling/configs/ (starter config pack)

  - Amacı: eslint.config.js, prettier.config.js, tsconfig.base.json, vitest.config.ts, .nvmrc starter dosyaları
  - Hangi boşluğu kapatır: 16-tooling-and-governance'daki kuralların executable hali
  - Hangi mevcut belgelere bağlanır: 16-tooling, 15-quality-gates, 36-canonical-stack, 38-compatibility-matrix
  - Boilerplate'e ait: Evet — config dosyaları boilerplate'in somutlaştırması

  4.6 tooling/ci/ (CI workflow starter pack)

  - Amacı: GitHub Actions workflow şablonları (ci.yml, deploy-web.yml, deploy-mobile.yml, scheduled-audit.yml)
  - Hangi boşluğu kapatır: 15-quality-gates-and-ci-rules.md'deki tüm CI kurallarının execution layer'ı
  - Hangi mevcut belgelere bağlanır: 15-quality-gates, 31-audit-checklist, 29-release-and-versioning
  - Boilerplate'e ait: Evet — quality gates CI'sız kağıtta kalır

  4.7 44-exception-and-exemption-policy.md

  - Amacı: Kural sapma yönetimi — geçici/kalıcı exception formatı, approval workflow, tracking mekanizması
  - Hangi boşluğu kapatır: 31-audit-checklist ve 16-tooling-governance exception'dan bahsediyor ama format/tracking yok
  - Hangi mevcut belgelere bağlanır: 31-audit, 16-tooling, 15-quality-gates
  - Boilerplate'e ait: Evet — governance'ın tamamlayıcı parçası

  4.8 tooling/generators/ (component/page/hook scaffold)

  - Amacı: pnpm generate:component, pnpm generate:page, pnpm generate:hook gibi scaffold komutları
  - Hangi boşluğu kapatır: 23-component-governance'daki component yapı kurallarının starter implementasyonu
  - Hangi mevcut belgelere bağlanır: 23-component-governance, 21-repo-structure, 14-testing-strategy
  - Project starter: Evet — her derived project bu generator'ları kullanır

  4.9 packages/templates/ (adapter skeleton pack)

  - Amacı: Auth adapter, secure storage wrapper, i18n config, observability init, structured logger — TypeScript
  interface + skeleton implementasyonları
  - Hangi boşluğu kapatır: ADR-010, ADR-011, ADR-009'daki kararların starter kodu
  - Hangi mevcut belgelere bağlanır: İlgili ADR'ler + 39-default-screens-and-components
  - Boilerplate'e ait: Evet — reusable adapter pattern tüm projelerde aynı

  ---
  5. GOVERNANCE VE KALİTE KAPISI GÜÇLENDİRME ÖNERİLERİ

  5.1 Audit

  ┌────────────────────────────────────┬─────────────────────────────┬─────────────────────────────────────────────┐
  │               Mevcut               │            Eksik            │                    Öneri                    │
  ├────────────────────────────────────┼─────────────────────────────┼─────────────────────────────────────────────┤
  │ 31-audit-checklist 14 audit ailesi │ Audit reviewer nitelikleri  │ Audit severity matrix ekle: ihlal tipi ×    │
  │  tanımlı                           │ belirsiz                    │ context = severity                          │
  ├────────────────────────────────────┼─────────────────────────────┼─────────────────────────────────────────────┤
  │ Audit zamanlaması tanımlı          │ Audit sonrası remediation   │ Blocker=merge blocker, Major=sprint içi     │
  │                                    │ SLA yok                     │ fix, Minor=backlog                          │
  ├────────────────────────────────────┼─────────────────────────────┼─────────────────────────────────────────────┤
  │ Anti-pattern listesi var           │ Audit result tracking yok   │ audit-log.md template veya GitHub Issue     │
  │                                    │                             │ template                                    │
  └────────────────────────────────────┴─────────────────────────────┴─────────────────────────────────────────────┘

  5.2 CI

  ┌────────────────────────────────┬──────────────────────────┬────────────────────────────────────────────────────┐
  │             Mevcut             │          Eksik           │                       Öneri                        │
  ├────────────────────────────────┼──────────────────────────┼────────────────────────────────────────────────────┤
  │ 15-quality-gates 9 gate        │ Workflow dosyaları yok   │ tooling/ci/ci.yml — typecheck + lint + test +      │
  │ kategorisi                     │                          │ build + boundary                                   │
  ├────────────────────────────────┼──────────────────────────┼────────────────────────────────────────────────────┤
  │ Blocker/major/minor severity   │ CI console output        │ Actionable error messages, belge referansları CI   │
  │ tanımlı                        │ formatting yok           │ output'ta                                          │
  ├────────────────────────────────┼──────────────────────────┼────────────────────────────────────────────────────┤
  │ Gate sertleştirme politikası   │ Baseline drift detection │ Scheduled audit workflow (haftalık dependency +    │
  │ var                            │  yok                     │ compatibility check)                               │
  └────────────────────────────────┴──────────────────────────┴────────────────────────────────────────────────────┘

  5.3 Review Checklists

  ┌────────────────────────────┬────────────────────────────┬──────────────────────────────────────────────────────┐
  │           Mevcut           │           Eksik            │                        Öneri                         │
  ├────────────────────────────┼────────────────────────────┼──────────────────────────────────────────────────────┤
  │ 32-DoD 9+ iş türü için     │ PR template yok            │ .github/PULL_REQUEST_TEMPLATE.md — DoD checkbox'ları │
  │ checklist                  │                            │                                                      │
  ├────────────────────────────┼────────────────────────────┼──────────────────────────────────────────────────────┤
  │ 30-contribution 8 review   │ Code owner tanımı yok      │ CODEOWNERS dosyası — packages/ui → DS team, apps/ →  │
  │ sorusu                     │                            │ feature team                                         │
  ├────────────────────────────┼────────────────────────────┼──────────────────────────────────────────────────────┤
  │ Reviewer soruları yazılı   │ Otomatik checklist         │ GitHub Actions bot: PR açılınca checklist            │
  │                            │ enforcement yok            │ auto-generate                                        │
  └────────────────────────────┴────────────────────────────┴──────────────────────────────────────────────────────┘

  5.4 Exception Handling

  ┌─────────────────────────────────┬────────────────────────┬─────────────────────────────────────────────────┐
  │             Mevcut              │         Eksik          │                      Öneri                      │
  ├─────────────────────────────────┼────────────────────────┼─────────────────────────────────────────────────┤
  │ 16-tooling exception bahsediyor │ Exception format yok   │ YAML: {rule, reason, expiry, approver, ticket}  │
  ├─────────────────────────────────┼────────────────────────┼─────────────────────────────────────────────────┤
  │ "Süreli istisna" kavramı var    │ Exception tracking yok │ exceptions/ dizini + scheduled expiry check CI  │
  ├─────────────────────────────────┼────────────────────────┼─────────────────────────────────────────────────┤
  │ "Exception budget" kavramı var  │ Budget mekanizması yok │ Toplam exception sayısı CI dashboard'da görünür │
  └─────────────────────────────────┴────────────────────────┴─────────────────────────────────────────────────┘

  5.5 Doc Drift Detection

  ┌───────────────────────────────────┬──────────────────────────┬─────────────────────────────────────────────────┐
  │              Mevcut               │          Eksik           │                      Öneri                      │
  ├───────────────────────────────────┼──────────────────────────┼─────────────────────────────────────────────────┤
  │ 35-document-map 13 belge "drift   │ Drift tespiti manual     │ CI: belge içi referansların hedef dosya varlığı │
  │ riski"                            │                          │  kontrolü                                       │
  ├───────────────────────────────────┼──────────────────────────┼─────────────────────────────────────────────────┤
  │ Revision metadata tanımlı         │ Freshness check yok      │ Scheduled CI: "6 aydan eski belge" uyarısı      │
  ├───────────────────────────────────┼──────────────────────────┼─────────────────────────────────────────────────┤
  │ Docs sync kuralları 32-DoD'de     │ Sync tetikleme otomatik  │ PR'da değişen dosyaya göre "bu belge etkilenir" │
  │                                   │ değil                    │  uyarısı                                        │
  └───────────────────────────────────┴──────────────────────────┴─────────────────────────────────────────────────┘

  5.6 Decision Freshness

  ┌──────────────────────────┬───────────────────────────────┬─────────────────────────────────────────────────────┐
  │          Mevcut          │             Eksik             │                        Öneri                        │
  ├──────────────────────────┼───────────────────────────────┼─────────────────────────────────────────────────────┤
  │ ADR-001→011 kilitli      │ ADR freshness review periyodu │ Yılda 1 ADR review — "hala geçerli mi?" sorusu      │
  │                          │  yok                          │                                                     │
  ├──────────────────────────┼───────────────────────────────┼─────────────────────────────────────────────────────┤
  │ 36-canonical-stack       │ Stack güncelliği audit'i yok  │ Quarterly: major version check (React, Expo, RN     │
  │ locked                   │                               │ güncel mi?)                                         │
  ├──────────────────────────┼───────────────────────────────┼─────────────────────────────────────────────────────┤
  │ 38-compatibility-matrix  │ Machine-readable format yok   │ compatibility-matrix.yaml — CI validation script    │
  │                          │                               │ ile                                                 │
  └──────────────────────────┴───────────────────────────────┴─────────────────────────────────────────────────────┘

  5.7 Version Compatibility

  ┌─────────────────────────────────┬───────────────────┬──────────────────────────────────────────────────────────┐
  │             Mevcut              │       Eksik       │                          Öneri                           │
  ├─────────────────────────────────┼───────────────────┼──────────────────────────────────────────────────────────┤
  │ 38-compatibility-matrix çok     │ Validation script │ scripts/check-compatibility.ts — package.json vs matrix  │
  │ detaylı                         │  yok              │ karşılaştırma                                            │
  ├─────────────────────────────────┼───────────────────┼──────────────────────────────────────────────────────────┤
  │ Blocker kombinasyonlar tanımlı  │ CI blocking yok   │ CI step: "Expo 55 + RN 0.82 = blocker" kontrolü          │
  ├─────────────────────────────────┼───────────────────┼──────────────────────────────────────────────────────────┤
  │ .nvmrc bahsediliyor             │ Dosya yok         │ .nvmrc + engines field + CI Node version check           │
  └─────────────────────────────────┴───────────────────┴──────────────────────────────────────────────────────────┘

  5.8 Release Safety

  ┌──────────────────────────────┬────────────────────────────┬───────────────────────────────────────────────────┐
  │            Mevcut            │           Eksik            │                       Öneri                       │
  ├──────────────────────────────┼────────────────────────────┼───────────────────────────────────────────────────┤
  │ 29-release 6 release türü    │ Release decision tree yok  │ Flowchart: "bu değişiklik hangi release türü?"    │
  ├──────────────────────────────┼────────────────────────────┼───────────────────────────────────────────────────┤
  │ App Store submission detaylı │ CI/CD release pipeline yok │ EAS Build + Vercel deploy GitHub Actions workflow │
  ├──────────────────────────────┼────────────────────────────┼───────────────────────────────────────────────────┤
  │ Hotfix process tanımlı       │ Rollback procedure eksik   │ Rollback checklist + automated rollback script    │
  └──────────────────────────────┴────────────────────────────┴───────────────────────────────────────────────────┘

  5.9 Package Boundary Enforcement

  ┌──────────────────────────────┬────────────────────────────┬────────────────────────────────────────────────────┐
  │            Mevcut            │           Eksik            │                       Öneri                        │
  ├──────────────────────────────┼────────────────────────────┼────────────────────────────────────────────────────┤
  │ 07-module-boundaries         │ Import enforcement tool    │ ESLint no-restricted-imports + custom boundary     │
  │ kuralları                    │ yok                        │ plugin                                             │
  ├──────────────────────────────┼────────────────────────────┼────────────────────────────────────────────────────┤
  │ Shared-by-proof ilkesi       │ "Shared" ölçütü mekanik    │ turbo affected packages + usage count tracking     │
  │                              │ değil                      │                                                    │
  ├──────────────────────────────┼────────────────────────────┼────────────────────────────────────────────────────┤
  │ packages/ → apps/ yasak      │ CI check yok               │ CI: import direction validation (packages → apps = │
  │                              │                            │  fail)                                             │
  └──────────────────────────────┴────────────────────────────┴────────────────────────────────────────────────────┘

  ---
  6. DESIGN SYSTEM / UX / A11Y / PLATFORM CONTINUITY İYİLEŞTİRMELERİ

  Must-Have

  1. Token consumption enforcement: ESLint custom rule — hardcoded #fff, 16px, 'Inter' → semantic token kullanımı
  zorla. Bu olmadan 22-design-tokens-spec kağıtta kalır.
  2. Component scaffold generator: pnpm generate:component ButtonVariant → index.tsx, types.ts, ButtonVariant.test.tsx,
   ButtonVariant.stories.tsx otomatik oluşsun. 23-component-governance kurallarını baştan enforce eder.
  3. A11y lint minimum: eslint-plugin-jsx-a11y + react-native-a11y kuralları başlangıçtan aktif.
  12-accessibility-standard'ın editor-time enforcement'ı.

  Derived-Project Accelerators

  4. Design token JSON/YAML schema: Token tanım dosyası format standardı — Figma → JSON → CSS variables / NativeWind
  config pipeline'ının input formatı.
  5. Platform adaptation component wrapper: <PlatformView>, <SafeAreaWrapper> gibi cross-platform primitive skeletons —
   26-platform-adaptation-rules'un starter implementasyonu.
  6. Theme builder test template: Light/dark theme mapping tutarlılık testi — "semantic-surface-primary light'ta #fff
  ise dark'ta ne?" validation.
  7. Motion/reduced-motion test helper: @media (prefers-reduced-motion) ve accessibilityReduceMotionEnabled test
  utility — 24-motion-and-interaction-standard compliance.

  Optional Future Additions

  8. Visual regression baseline: Playwright screenshot comparison veya Chromatic benzeri tool entegrasyonu —
  33-visual-implementation-contract'ın automated hali.
  9. Component maturity dashboard: DS component'lerinin alpha/beta/stable durumunu gösteren otomatik rapor —
  23-component-governance lifecycle tracking.
  10. Pattern catalog: Onboarding flow, settings screen, error boundary, empty state gibi reusable pattern'lerin
  catalogue'u — 39-default-screens-and-components'in genişletilmiş hali.

  ---
  7. DX / ONBOARDING / PROJECT CREATION İYİLEŞTİRMELERİ

  Yeni proje türetirken hazır gelmesi gereken şeyler

  1. Scaffold script: npx create-boilerplate-app my-project → monorepo yapısı, config dosyaları, starter packages, env
  template, CI workflows, CLAUDE.md, AGENTS.md — hepsi tek komutla
  2. .env.example: Tüm environment variable'ların placeholder'lı listesi + açıklamaları
  3. Starter CLAUDE.md: Canonical stack referansları, project-specific customization alanları
  4. Starter AGENTS.md: Review guidelines, boundary rules, canonical stack koruma
  5. .github/ dizini: PR template, issue template, CODEOWNERS, CI workflows
  6. packages/ skeletons: ui/, core/, config-typescript/, config-eslint/, testing/ — minimal ama çalışan yapı
  7. Dev server scripts: pnpm dev:web, pnpm dev:mobile, pnpm test, pnpm lint, pnpm typecheck

  Starter dosyalar / templates / scripts / decision packs

  ┌─────────────────────┬──────────────────────────────────────────┬─────────────────────────┐
  │      Template       │                   Amaç                   │          Etki           │
  ├─────────────────────┼──────────────────────────────────────────┼─────────────────────────┤
  │ tsconfig.base.json  │ TypeScript strict mode baseline          │ Her projede aynı kalite │
  ├─────────────────────┼──────────────────────────────────────────┼─────────────────────────┤
  │ eslint.config.js    │ Lint kuralları (boundary + token + a11y) │ Otomatik enforcement    │
  ├─────────────────────┼──────────────────────────────────────────┼─────────────────────────┤
  │ .prettierrc         │ Format standardı                         │ Tutarlı kod stili       │
  ├─────────────────────┼──────────────────────────────────────────┼─────────────────────────┤
  │ vitest.config.ts    │ Web test config                          │ Test altyapısı hazır    │
  ├─────────────────────┼──────────────────────────────────────────┼─────────────────────────┤
  │ jest.config.js      │ Mobile test config                       │ Test altyapısı hazır    │
  ├─────────────────────┼──────────────────────────────────────────┼─────────────────────────┤
  │ .husky/pre-commit   │ Staged file lint                         │ Commit kalitesi         │
  ├─────────────────────┼──────────────────────────────────────────┼─────────────────────────┤
  │ turbo.json          │ Task pipeline                            │ Build orchestration     │
  ├─────────────────────┼──────────────────────────────────────────┼─────────────────────────┤
  │ pnpm-workspace.yaml │ Workspace tanımı                         │ Monorepo yapısı         │
  └─────────────────────┴──────────────────────────────────────────┴─────────────────────────┘

  Yanlış başlangıcı ciddi biçimde azaltacak rehberler

  1. "İlk 30 dakika" rehberi: Clone → install → dev server → first component — hiçbir belge okumadan çalışan sistemi
  görmek
  2. "Belge okuma haritası" kısaltması: 35-document-map'in 50 maddelik listesi yerine, rol bazlı (developer / designer
  / tech lead) 5 maddelik fast track
  3. "Bu boilerplate'te yapma" anti-pattern kartı: 10 en sık yapılan hata — her madde 1 cümle + hangi belge referansı

  ---
  8. ÖNCELİKLENDİRME

  P0 — Şimdi Eklenmeli, Boilerplate Değeri İçin Kritik

  ┌─────┬─────────────────────────────────────────────────────────┬────────────────────────────────────────────────┐
  │  #  │                          Öneri                          │                    Gerekçe                     │
  ├─────┼─────────────────────────────────────────────────────────┼────────────────────────────────────────────────┤
  │ 1   │ Boilerplate-Project Boundary Contract (41)              │ Derived project neyi korur/override eder       │
  │     │                                                         │ bilinmeden bootstrap yapılamaz                 │
  ├─────┼─────────────────────────────────────────────────────────┼────────────────────────────────────────────────┤
  │ 2   │ CI Starter Pack (tooling/ci/)                           │ Quality gates CI'sız enforce edilemez          │
  ├─────┼─────────────────────────────────────────────────────────┼────────────────────────────────────────────────┤
  │ 3   │ PR Template + CODEOWNERS                                │ Review kalitesi sisteme bağlanmalı             │
  ├─────┼─────────────────────────────────────────────────────────┼────────────────────────────────────────────────┤
  │ 4   │ Starter config dosyaları (tsconfig, eslint, prettier,   │ Bootstrap'in ilk adımı                         │
  │     │ vitest, turbo, pnpm-workspace)                          │                                                │
  ├─────┼─────────────────────────────────────────────────────────┼────────────────────────────────────────────────┤
  │ 5   │ .env.example + env validation script                    │ Her projede environment setup hatasını önler   │
  ├─────┼─────────────────────────────────────────────────────────┼────────────────────────────────────────────────┤
  │ 6   │ Token consumption ESLint rule                           │ Design system enforcement'ın minimum viable    │
  │     │                                                         │ hali                                           │
  └─────┴─────────────────────────────────────────────────────────┴────────────────────────────────────────────────┘

  P1 — Yakın Vadede Büyük Çarpan Etkisi

  ┌─────┬──────────────────────────────────────────────────────┬───────────────────────────────────────────────────┐
  │  #  │                        Öneri                         │                      Gerekçe                      │
  ├─────┼──────────────────────────────────────────────────────┼───────────────────────────────────────────────────┤
  │ 7   │ Bootstrap scaffold script                            │ 16 fazlık checklist'in automatize hali            │
  ├─────┼──────────────────────────────────────────────────────┼───────────────────────────────────────────────────┤
  │ 8   │ Derived project creation guide (43)                  │ Yeni proje türetme step-by-step                   │
  ├─────┼──────────────────────────────────────────────────────┼───────────────────────────────────────────────────┤
  │ 9   │ Auth adapter skeleton + cleanup test template        │ Wrong-user leak önleme, en sık tekrar eden auth   │
  │     │                                                      │ hatası                                            │
  ├─────┼──────────────────────────────────────────────────────┼───────────────────────────────────────────────────┤
  │ 10  │ Branching strategy (42)                              │ CI ve release flow'un temeli                      │
  ├─────┼──────────────────────────────────────────────────────┼───────────────────────────────────────────────────┤
  │ 11  │ Component scaffold generator                         │ Tutarlı component yapısı her projede              │
  ├─────┼──────────────────────────────────────────────────────┼───────────────────────────────────────────────────┤
  │ 12  │ Boundary enforcement ESLint rules                    │ Import yön ihlallerini CI'da yakala               │
  ├─────┼──────────────────────────────────────────────────────┼───────────────────────────────────────────────────┤
  │ 13  │ i18n config + namespace scaffold                     │ Her projede aynı i18n bootstrap                   │
  ├─────┼──────────────────────────────────────────────────────┼───────────────────────────────────────────────────┤
  │ 14  │ Observability starter (Sentry config + sanitization  │ Sensitive data leak önleme                        │
  │     │ hook)                                                │                                                   │
  ├─────┼──────────────────────────────────────────────────────┼───────────────────────────────────────────────────┤
  │ 15  │ CLAUDE.md + AGENTS.md starter                        │ AI tooling governance derived project'te çalışsın │
  └─────┴──────────────────────────────────────────────────────┴───────────────────────────────────────────────────┘

  P2 — İkinci Dalga Olgunluk İyileştirmesi

  ┌─────┬───────────────────────────────────────────────┬───────────────────────────────────────────────┐
  │  #  │                     Öneri                     │                    Gerekçe                    │
  ├─────┼───────────────────────────────────────────────┼───────────────────────────────────────────────┤
  │ 16  │ Exception/exemption tracking mekanizması (44) │ Teknik borç görünürlüğü                       │
  ├─────┼───────────────────────────────────────────────┼───────────────────────────────────────────────┤
  │ 17  │ Documentation freshness CI check              │ Belge drift'ini otomatik tespit               │
  ├─────┼───────────────────────────────────────────────┼───────────────────────────────────────────────┤
  │ 18  │ Compatibility matrix machine-readable format  │ CI validation mümkün olsun                    │
  ├─────┼───────────────────────────────────────────────┼───────────────────────────────────────────────┤
  │ 19  │ Audit severity matrix                         │ Severity kararını mekanikleştir               │
  ├─────┼───────────────────────────────────────────────┼───────────────────────────────────────────────┤
  │ 20  │ Release decision tree                         │ "Bu değişiklik hangi release türü?" flowchart │
  ├─────┼───────────────────────────────────────────────┼───────────────────────────────────────────────┤
  │ 21  │ Theme builder test template                   │ Light/dark mapping tutarlılığı                │
  ├─────┼───────────────────────────────────────────────┼───────────────────────────────────────────────┤
  │ 22  │ A11y component test helper                    │ Erişilebilirlik testini kolaylaştır           │
  ├─────┼───────────────────────────────────────────────┼───────────────────────────────────────────────┤
  │ 23  │ Derived project ADR policy                    │ Proje-özel mimari kararlar                    │
  └─────┴───────────────────────────────────────────────┴───────────────────────────────────────────────┘

  P3 — Nice-to-Have, Olgunluk Arttıkça Faydalı

  ┌─────┬──────────────────────────────────┬──────────────────────────────────────┐
  │  #  │              Öneri               │               Gerekçe                │
  ├─────┼──────────────────────────────────┼──────────────────────────────────────┤
  │ 24  │ Visual regression baseline       │ Design fidelity otomasyonu           │
  ├─────┼──────────────────────────────────┼──────────────────────────────────────┤
  │ 25  │ Component maturity dashboard     │ DS lifecycle tracking                │
  ├─────┼──────────────────────────────────┼──────────────────────────────────────┤
  │ 26  │ Pattern catalog                  │ Reusable UI pattern library          │
  ├─────┼──────────────────────────────────┼──────────────────────────────────────┤
  │ 27  │ Project health scorecard         │ Derived project kalite metrikleri    │
  ├─────┼──────────────────────────────────┼──────────────────────────────────────┤
  │ 28  │ Drift detection automation       │ Boilerplate-project sync takibi      │
  ├─────┼──────────────────────────────────┼──────────────────────────────────────┤
  │ 29  │ ADR freshness review schedule    │ Kilitli kararların yıllık review'u   │
  ├─────┼──────────────────────────────────┼──────────────────────────────────────┤
  │ 30  │ Design token pipeline automation │ Figma → CSS/NativeWind otomatik sync │
  └─────┴──────────────────────────────────┴──────────────────────────────────────┘

  ---
  9. UYGULAMA PLANI

  Faz 1: Temel Altyapı (Önce hangi boşluk kapatılmalı)

  1. Starter config dosyaları oluştur:
     - tsconfig.base.json
     - eslint.config.js (boundary + token + a11y kuralları dahil)
     - .prettierrc
     - .nvmrc
     - pnpm-workspace.yaml
     - turbo.json

  2. .env.example + scripts/validate-env.ts yaz

  3. .github/ dizini kur:
     - PULL_REQUEST_TEMPLATE.md
     - CODEOWNERS (starter)
     - workflows/ci.yml (typecheck + lint + test + build)

  4. 41-boilerplate-project-boundary-contract.md yaz

  Faz 2: Belge Revizyonları (Sonra hangi belgeler revize edilmeli)

  5. 35-document-map.md → yeni belgeleri (41, 42, 43, 44) ekle
  6. 20-initial-implementation-checklist.md → scaffold script referansı ekle
  7. 30-contribution-guide.md → branching strategy referansı ekle
  8. 16-tooling-and-governance.md → enforcement config pack referansları ekle
  9. 29-release-and-versioning-rules.md → bölüm 30 overlap'ini 30-contribution ile çöz
  10. 32-definition-of-done.md → AI bölüm (§26) forward reference'ları tamamla

  Faz 3: Reusable Starter'lar (Hangi reusable starter'lar üretilmeli)

  11. packages/ skeletons: ui/, core/, config-typescript/, config-eslint/, testing/
  12. Auth adapter interface + secure storage wrapper skeleton
  13. i18n config skeleton + namespace scaffold
  14. Observability init skeleton (Sentry config + structured logger + sanitization hook)
  15. Component scaffold generator (pnpm generate:component)
  16. Bootstrap scaffold script (create-boilerplate-app)

  Faz 4: Governance Mekanizmaları (Hangi governance mekanizmaları eklenmeli)

  17. 42-branching-and-merge-strategy.md yaz
  18. 44-exception-and-exemption-policy.md yaz
  19. ESLint custom rules: boundary enforcement, token consumption, hardcoded detection
  20. Pre-commit hooks: lint-staged + secret scanning
  21. Scheduled CI: dependency audit, compatibility check, doc freshness
  22. Audit severity matrix → 31-audit-checklist'e ekle
  23. Release decision tree → 29-release'a ekle

  Faz 5: Derived-Project Kit'leri (Hangi derived-project kit'leri hazırlanmalı)

  24. 43-derived-project-creation-guide.md yaz
  25. CLAUDE.md starter template (parameterize edilmiş)
  26. AGENTS.md starter template
  27. .claudeignore starter
  28. Derived project ADR policy + project/adr/ yapısı
  29. PR review bot config (canonical stack + boundary auto-check)
  30. "İlk 30 dakika" rehberi
  31. Rol bazlı belge okuma fast track'leri

  ---
  10. DOĞRUDAN REVİZYON ÖNERİLERİ

  Mevcut Belgelere Eklenmesi Gereken Bölümler

  ┌────────────────────────────────────────┬─────────────────────┬─────────────────────────────────────────────────┐
  │                 Belge                  │   Eklenecek Bölüm   │                     İçerik                      │
  ├────────────────────────────────────────┼─────────────────────┼─────────────────────────────────────────────────┤
  │ 35-document-map.md                     │ §4'e yeni belge     │ "Boilerplate-Project Governance" ailesi: 41,    │
  │                                        │ ailesi              │ 42, 43, 44                                      │
  ├────────────────────────────────────────┼─────────────────────┼─────────────────────────────────────────────────┤
  │ 35-document-map.md                     │ §10'a yeni senaryo  │ "Yeni derived project türetme" — 43, 41, 20, 21 │
  │                                        │                     │  referansları                                   │
  ├────────────────────────────────────────┼─────────────────────┼─────────────────────────────────────────────────┤
  │ 20-initial-implementation-checklist.md │ Faz A'ya ek         │ "Scaffold script çalıştır" adımı + referans     │
  ├────────────────────────────────────────┼─────────────────────┼─────────────────────────────────────────────────┤
  │ 30-contribution-guide.md               │ §6'ya ek            │ Branching strategy referansı (42)               │
  ├────────────────────────────────────────┼─────────────────────┼─────────────────────────────────────────────────┤
  │ 30-contribution-guide.md               │ §5.8.6 ile 29 §30   │ Bir yerde referans, diğerinde detay — duplicate │
  │                                        │ overlap             │  kaldır                                         │
  ├────────────────────────────────────────┼─────────────────────┼─────────────────────────────────────────────────┤
  │ 31-audit-checklist.md                  │ §22'ye ek           │ Audit severity matrix tablosu                   │
  ├────────────────────────────────────────┼─────────────────────┼─────────────────────────────────────────────────┤
  │ 31-audit-checklist.md                  │ Yeni bölüm          │ Audit remediation SLA: blocker/major/minor fix  │
  │                                        │                     │ süreleri                                        │
  ├────────────────────────────────────────┼─────────────────────┼─────────────────────────────────────────────────┤
  │ 32-definition-of-done.md               │ §26 güçlendirme     │ SPEC, DESIGN.md, CLAUDE.md, AGENTS.md tanımları │
  │                                        │                     │  veya referansları                              │
  ├────────────────────────────────────────┼─────────────────────┼─────────────────────────────────────────────────┤
  │ 29-release-and-versioning.md           │ §3-9 arası          │ Release decision tree / flowchart               │
  ├────────────────────────────────────────┼─────────────────────┼─────────────────────────────────────────────────┤
  │ 16-tooling-and-governance.md           │ §37 güçlendirme     │ AI tool governance enforcement mekanizmaları    │
  └────────────────────────────────────────┴─────────────────────┴─────────────────────────────────────────────────┘

  Üretilmesi Gereken Yeni Belgeler

  ┌─────────────────────────────────────────────┬────────────┬────────────────────────────────────────┐
  │                    Belge                    │    Tür     │                 İçerik                 │
  ├─────────────────────────────────────────────┼────────────┼────────────────────────────────────────┤
  │ 41-boilerplate-project-boundary-contract.md │ Governance │ Inherit/override/extend kuralları      │
  ├─────────────────────────────────────────────┼────────────┼────────────────────────────────────────┤
  │ 42-branching-and-merge-strategy.md          │ Process    │ Git branching modeli, merge politikası │
  ├─────────────────────────────────────────────┼────────────┼────────────────────────────────────────┤
  │ 43-derived-project-creation-guide.md        │ Guide      │ Yeni proje türetme step-by-step        │
  ├─────────────────────────────────────────────┼────────────┼────────────────────────────────────────┤
  │ 44-exception-and-exemption-policy.md        │ Governance │ Kural sapma format, approval, tracking │
  └─────────────────────────────────────────────┴────────────┴────────────────────────────────────────┘

  Template Dosyalar (Derived Project .github/ ve tooling/ Altına)

  ┌───────────────────────────┬─────────────────────┬─────────────────────────────────────────────┐
  │           Dosya           │        Konum        │                    Amacı                    │
  ├───────────────────────────┼─────────────────────┼─────────────────────────────────────────────┤
  │ PULL_REQUEST_TEMPLATE.md  │ .github/            │ DoD checkbox'ları, canonical check soruları │
  ├───────────────────────────┼─────────────────────┼─────────────────────────────────────────────┤
  │ ISSUE_TEMPLATE/bug.md     │ .github/            │ Bug report standardı                        │
  ├───────────────────────────┼─────────────────────┼─────────────────────────────────────────────┤
  │ ISSUE_TEMPLATE/feature.md │ .github/            │ Feature request standardı                   │
  ├───────────────────────────┼─────────────────────┼─────────────────────────────────────────────┤
  │ CODEOWNERS                │ .github/            │ Package ownership                           │
  ├───────────────────────────┼─────────────────────┼─────────────────────────────────────────────┤
  │ ci.yml                    │ tooling/ci/         │ TypeCheck + Lint + Test + Build + Boundary  │
  ├───────────────────────────┼─────────────────────┼─────────────────────────────────────────────┤
  │ scheduled-audit.yml       │ tooling/ci/         │ Dependency + compatibility + doc freshness  │
  ├───────────────────────────┼─────────────────────┼─────────────────────────────────────────────┤
  │ exception-template.yaml   │ tooling/governance/ │ Exception kayıt formatı                     │
  └───────────────────────────┴─────────────────────┴─────────────────────────────────────────────┘

  Audit Checklist Derived Project Varyantı

  31-audit-checklist.md boilerplate geneli için tasarlanmış. Derived project için ek audit maddeleri:

  - Boilerplate boundary contract uyumu (41'e göre)
  - Proje-özel ADR'lerin boilerplate ADR'leriyle çelişmezliği
  - CLAUDE.md / AGENTS.md güncelliği
  - Proje-özel exception'ların süresi dolmuş mu kontrolü

  Rulebook Mirası (Boilerplate → Derived Project)

  Aşağıdaki kurallar boilerplate'ten derived project'e otomatik miras bırakılmalı (boundary contract ile):

  ┌──────────────────────────────────────────┬──────────────┬─────────────────────────────────────────────────────┐
  │              Kural Kaynağı               │  Miras Tipi  │                    Override İzni                    │
  ├──────────────────────────────────────────┼──────────────┼─────────────────────────────────────────────────────┤
  │ ADR-001→011 (canonical stack)            │ Zorunlu      │ Override yasak, sadece ADR revision ile             │
  │                                          │ miras        │                                                     │
  ├──────────────────────────────────────────┼──────────────┼─────────────────────────────────────────────────────┤
  │ 37-dependency-policy                     │ Zorunlu      │ Project-specific ek kural eklenebilir, base         │
  │                                          │ miras        │ kaldırılamaz                                        │
  ├──────────────────────────────────────────┼──────────────┼─────────────────────────────────────────────────────┤
  │ 38-compatibility-matrix                  │ Zorunlu      │ Extend edilebilir, base kaldırılamaz                │
  │                                          │ miras        │                                                     │
  ├──────────────────────────────────────────┼──────────────┼─────────────────────────────────────────────────────┤
  │ 22-design-tokens-spec (token             │ Yapısal      │ Token değerleri proje-özel, hiyerarşi sabit         │
  │ hiyerarşisi)                             │ miras        │                                                     │
  ├──────────────────────────────────────────┼──────────────┼─────────────────────────────────────────────────────┤
  │ 23-component-governance (naming,         │ Yapısal      │ Proje ek convention ekleyebilir                     │
  │ lifecycle)                               │ miras        │                                                     │
  ├──────────────────────────────────────────┼──────────────┼─────────────────────────────────────────────────────┤
  │ 15-quality-gates (CI kuralları)          │ Yapısal      │ Sıkılaştırılabilir, gevşetilemez                    │
  │                                          │ miras        │                                                     │
  ├──────────────────────────────────────────┼──────────────┼─────────────────────────────────────────────────────┤
  │ 32-DoD (iş türü maddeleri)               │ Yapısal      │ Proje ek madde ekleyebilir, base kaldıramaz         │
  │                                          │ miras        │                                                     │
  ├──────────────────────────────────────────┼──────────────┼─────────────────────────────────────────────────────┤
  │ 12-accessibility (WCAG AA)               │ Zorunlu      │ Sıkılaştırılabilir (AAA), gevşetilemez              │
  │                                          │ miras        │                                                     │
  ├──────────────────────────────────────────┼──────────────┼─────────────────────────────────────────────────────┤
  │ 01-working-principles                    │ Felsefi      │ Proje-özel yorumlanabilir ama çelişilemez           │
  │                                          │ miras        │                                                     │
  └──────────────────────────────────────────┴──────────────┴─────────────────────────────────────────────────────┘

  ---
  Son söz: Bu boilerplate'in belge kalitesi olağanüstü. Sorun belge eksikliği değil, belge ile execution arasındaki
  köprü eksikliği. Yukarıdaki öneriler bu köprüyü inşa eder. Öncelik sırası: P0 config + CI + boundary contract → P1
  scaffold + adapter skeletons → P2 governance mekanizmaları → P3 olgunluk araçları.