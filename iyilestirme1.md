
  MoAI-ADK AI Guardrail Çerçevesi — Genişletilmiş Tasarım (v2)

  Önceki Planın Eleştirisi ve Düzeltme

  Önceki planda yelpaze dar tutulmuştu. "UI, form, Firebase, test, i18n" gibi sabit 10 alan listelemek projenin gerçek genişliğini yansıtmıyor. Bir projede yapılabilecek geliştirme aktiviteleri bunlarla sınırlı değil. Yeni yaklaşım: sabit
   alan listesi yerine dinamik, katmanlı ve genişleyebilir bir guardrail mimarisi.

  ---
  1. Genişletilmiş Kapsam — Tüm Geliştirme Yüzeyleri

  1.1 Mevcut Dokümantasyonda Tanımlı Ama İlk Planda Atlanmış Alanlar

  ┌────────────────────────────────────┬──────────────────────────────────────────┬───────────────────────┐
  │                Alan                │              Mevcut Doküman              │ Guardrail Gerekli mi? │
  ├────────────────────────────────────┼──────────────────────────────────────────┼───────────────────────┤
  │ Navigation & deep linking          │ 08-navigation-and-flow-rules.md, ADR-012 │ Evet                  │
  ├────────────────────────────────────┼──────────────────────────────────────────┼───────────────────────┤
  │ Motion & interaction               │ 24-motion-and-interaction-standard.md    │ Evet                  │
  ├────────────────────────────────────┼──────────────────────────────────────────┼───────────────────────┤
  │ Error/empty/loading states         │ 25-error-empty-loading-states.md         │ Evet                  │
  ├────────────────────────────────────┼──────────────────────────────────────────┼───────────────────────┤
  │ Platform adaptation (web↔mobile)   │ 26-platform-adaptation-rules.md          │ Evet                  │
  ├────────────────────────────────────┼──────────────────────────────────────────┼───────────────────────┤
  │ Observability & debugging          │ 28-observability-and-debugging.md        │ Evet                  │
  ├────────────────────────────────────┼──────────────────────────────────────────┼───────────────────────┤
  │ Release & versioning               │ 29-release-and-versioning-rules.md       │ Evet                  │
  ├────────────────────────────────────┼──────────────────────────────────────────┼───────────────────────┤
  │ Contribution & PR süreci           │ 30-contribution-guide.md                 │ Evet                  │
  ├────────────────────────────────────┼──────────────────────────────────────────┼───────────────────────┤
  │ Visual implementation fidelity     │ 33-visual-implementation-contract.md     │ Evet                  │
  ├────────────────────────────────────┼──────────────────────────────────────────┼───────────────────────┤
  │ Dependency ekleme/kaldırma/upgrade │ 37-dependency-policy.md                  │ Evet                  │
  ├────────────────────────────────────┼──────────────────────────────────────────┼───────────────────────┤
  │ CI/CD pipeline değişiklikleri      │ 15-quality-gates-and-ci-rules.md         │ Evet                  │
  ├────────────────────────────────────┼──────────────────────────────────────────┼───────────────────────┤
  │ Repo structure değişiklikleri      │ 21-repo-structure-spec.md                │ Evet                  │
  ├────────────────────────────────────┼──────────────────────────────────────────┼───────────────────────┤
  │ Branching & merge stratejisi       │ 42-branching-and-merge-strategy.md       │ Evet                  │
  ├────────────────────────────────────┼──────────────────────────────────────────┼───────────────────────┤
  │ ADR & doküman yazımı               │ 18-adr-template.md, 41                   │ Evet                  │
  ├────────────────────────────────────┼──────────────────────────────────────────┼───────────────────────┤
  │ Theming & visual language          │ 05-theming-and-visual-language.md        │ Evet                  │
  ├────────────────────────────────────┼──────────────────────────────────────────┼───────────────────────┤
  │ Component lifecycle & governance   │ 23-component-governance-rules.md         │ Evet                  │
  └────────────────────────────────────┴──────────────────────────────────────────┴───────────────────────┘

  1.2 Dokümantasyonda Hiç Olmayan Alanlar (Yeni Tanımlanması Gereken)

  ┌────────────────────────────────────────────────────────┬───────────────────────────┬────────────────────────┐
  │                          Alan                          │           Durum           │       Kritiklik        │
  ├────────────────────────────────────────────────────────┼───────────────────────────┼────────────────────────┤
  │ Firebase/Firestore veri modelleme & güvenlik kuralları │ Yok                       │ Yüksek                 │
  ├────────────────────────────────────────────────────────┼───────────────────────────┼────────────────────────┤
  │ Push notification                                      │ Yok                       │ Orta                   │
  ├────────────────────────────────────────────────────────┼───────────────────────────┼────────────────────────┤
  │ Offline support / cache persistence                    │ Kısmen (10-data-fetching) │ Orta                   │
  ├────────────────────────────────────────────────────────┼───────────────────────────┼────────────────────────┤
  │ Real-time / WebSocket                                  │ Yok                       │ Düşük-Orta             │
  ├────────────────────────────────────────────────────────┼───────────────────────────┼────────────────────────┤
  │ File upload / Media handling                           │ Yok                       │ Orta                   │
  ├────────────────────────────────────────────────────────┼───────────────────────────┼────────────────────────┤
  │ Background tasks / Worker                              │ Yok                       │ Düşük                  │
  ├────────────────────────────────────────────────────────┼───────────────────────────┼────────────────────────┤
  │ Analytics event tracking & data layer                  │ Kısmen (28-observability) │ Orta                   │
  ├────────────────────────────────────────────────────────┼───────────────────────────┼────────────────────────┤
  │ Third-party SDK entegrasyonu                           │ Kısmen (37-dependency)    │ Yüksek                 │
  ├────────────────────────────────────────────────────────┼───────────────────────────┼────────────────────────┤
  │ Environment & config yönetimi                          │ Kısmen (27-security)      │ Orta                   │
  ├────────────────────────────────────────────────────────┼───────────────────────────┼────────────────────────┤
  │ Migration stratejileri (veri, şema, kod)               │ Yok                       │ Orta                   │
  ├────────────────────────────────────────────────────────┼───────────────────────────┼────────────────────────┤
  │ Payment / In-app purchase                              │ Yok                       │ Düşük (proje-specific) │
  ├────────────────────────────────────────────────────────┼───────────────────────────┼────────────────────────┤
  │ Geolocation / Maps / Sensors                           │ Yok                       │ Düşük (proje-specific) │
  ├────────────────────────────────────────────────────────┼───────────────────────────┼────────────────────────┤
  │ Refactoring & technical debt çözme                     │ Yok                       │ Yüksek                 │
  ├────────────────────────────────────────────────────────┼───────────────────────────┼────────────────────────┤
  │ Monorepo workspace yönetimi                            │ Kısmen (ADR-003, 21)      │ Orta                   │
  └────────────────────────────────────────────────────────┴───────────────────────────┴────────────────────────┘

  1.3 Sonuç

  İlk planda 10 alan listelemiştim. Gerçekte 30+ farklı geliştirme yüzeyi var. Sabit liste yaklaşımı yanlıştır. Çözüm: katmanlı ve dinamik guardrail mimarisi.

  ---
  2. Katmanlı Guardrail Mimarisi

  Sabit "GR-001, GR-002..." listesi yerine, 5 katmanlı dinamik sistem:

  ┌─────────────────────────────────────────────────────┐
  │  Katman 5: Proje-Spesifik Guardrail'ler             │
  │  (Türetilen projenin eklediği domain kuralları)      │
  ├─────────────────────────────────────────────────────┤
  │  Katman 4: Yaşam Döngüsü Guardrail'leri             │
  │  (PR, release, hotfix, migration, deprecation)       │
  ├─────────────────────────────────────────────────────┤
  │  Katman 3: Aktivite Guardrail'leri                   │
  │  (Yeni feature, refactoring, dependency değişikliği, │
  │   config değişikliği, doküman yazımı, vb.)           │
  ├─────────────────────────────────────────────────────┤
  │  Katman 2: Domain Guardrail'leri                     │
  │  (UI/UX, data, security, platform, quality, vb.)     │
  ├─────────────────────────────────────────────────────┤
  │  Katman 1: Universal Guardrail'ler [HER ZAMAN AKTİF] │
  │  (TypeScript strict, import yönleri, naming, token,  │
  │   i18n, security baseline, dosya organizasyonu)      │
  └─────────────────────────────────────────────────────┘

  Katman 1 — Universal Guardrails (Her işte, her zaman)

  Bunlar CLAUDE.md çekirdek katmanında zaten mevcut olmalı, ayrı doküman gerektirmez:

  - TypeScript strict mode, any yasağı
  - Import yönleri (feature → shared OK, shared → feature YASAK)
  - Dosya organizasyonu (feature-first)
  - Semantic token zorunluluğu (hardcoded renk/spacing/font yasak)
  - i18n: inline user-facing string yasak
  - Security baseline: secret, credential, hassas veri kuralları
  - Naming convention: PascalCase component, camelCase değişken
  - Test dosyası konumu: kaynak dosya yanında
  - Canonical stack kararlarına uyum

  Katman 2 — Domain Guardrails

  Her domain için ayrı guardrail dokümanı. Ama bu dokümanlar mevcut ana dokümanların AI-native özeti olacak:

  ┌───────────┬──────────────────────────────────────────────┬──────────────────────┐
  │ Domain ID │                     Alan                     │  Kaynak Dokümanlar   │
  ├───────────┼──────────────────────────────────────────────┼──────────────────────┤
  │ D-UIX     │ UI/UX & HIG & Premium ton                    │ 03, 33, 34           │
  ├───────────┼──────────────────────────────────────────────┼──────────────────────┤
  │ D-DSY     │ Design system & tokens & theming             │ 04, 05, 22, 23       │
  ├───────────┼──────────────────────────────────────────────┼──────────────────────┤
  │ D-NAV     │ Navigation, routing, deep linking            │ 08, ADR-012          │
  ├───────────┼──────────────────────────────────────────────┼──────────────────────┤
  │ D-STA     │ State management                             │ 09, ADR-004          │
  ├───────────┼──────────────────────────────────────────────┼──────────────────────┤
  │ D-DAT     │ Data fetching, cache, sync, mutation         │ 10, ADR-005          │
  ├───────────┼──────────────────────────────────────────────┼──────────────────────┤
  │ D-FRM     │ Forms, validation, input UX                  │ 11, ADR-006          │
  ├───────────┼──────────────────────────────────────────────┼──────────────────────┤
  │ D-MOT     │ Motion, interaction, animation               │ 24                   │
  ├───────────┼──────────────────────────────────────────────┼──────────────────────┤
  │ D-ERR     │ Error, empty, loading states & recovery      │ 25                   │
  ├───────────┼──────────────────────────────────────────────┼──────────────────────┤
  │ D-PLT     │ Platform adaptation (web ↔ mobile)           │ 26, ADR-001, ADR-002 │
  ├───────────┼──────────────────────────────────────────────┼──────────────────────┤
  │ D-A11     │ Accessibility                                │ 12                   │
  ├───────────┼──────────────────────────────────────────────┼──────────────────────┤
  │ D-PRF     │ Performance                                  │ 13                   │
  ├───────────┼──────────────────────────────────────────────┼──────────────────────┤
  │ D-TST     │ Testing stratejisi & kalite                  │ 14, ADR-008          │
  ├───────────┼──────────────────────────────────────────────┼──────────────────────┤
  │ D-SEC     │ Security, auth, secrets                      │ 27, ADR-010          │
  ├───────────┼──────────────────────────────────────────────┼──────────────────────┤
  │ D-OBS     │ Observability, logging, analytics, debugging │ 28, ADR-009          │
  ├───────────┼──────────────────────────────────────────────┼──────────────────────┤
  │ D-I18     │ Internationalization                         │ ADR-011              │
  ├───────────┼──────────────────────────────────────────────┼──────────────────────┤
  │ D-STY     │ Styling, Tailwind, NativeWind                │ ADR-007              │
  ├───────────┼──────────────────────────────────────────────┼──────────────────────┤
  │ D-FIR     │ Firebase, Firestore, Cloud Functions         │ YENİ                 │
  ├───────────┼──────────────────────────────────────────────┼──────────────────────┤
  │ D-3RD     │ Third-party SDK entegrasyonu                 │ 37 (genişletilecek)  │
  ├───────────┼──────────────────────────────────────────────┼──────────────────────┤
  │ D-VIS     │ Visual fidelity & implementation contract    │ 33                   │
  └───────────┴──────────────────────────────────────────────┴──────────────────────┘

  Katman 3 — Aktivite Guardrails

  Geliştirme aktivite türüne göre tetiklenen kurallar:

  ┌─────────────┬─────────────────────────────────┬───────────────────────────────────┬──────────────────────────────────────────────────────┐
  │ Aktivite ID │            Aktivite             │  Tetiklenen Domain Guardrail'ler  │                     Ek Kurallar                      │
  ├─────────────┼─────────────────────────────────┼───────────────────────────────────┼──────────────────────────────────────────────────────┤
  │ A-NEW-FEAT  │ Yeni feature geliştirme         │ Tüm ilgili domain'ler             │ SPEC zorunlu (karmaşıklık >= 5), DoD kontrolü        │
  ├─────────────┼─────────────────────────────────┼───────────────────────────────────┼──────────────────────────────────────────────────────┤
  │ A-NEW-COMP  │ Yeni component oluşturma        │ D-UIX, D-DSY, D-A11, D-PLT, D-MOT │ Component governance kuralları (23), Stitch önerilen │
  ├─────────────┼─────────────────────────────────┼───────────────────────────────────┼──────────────────────────────────────────────────────┤
  │ A-NEW-SCRN  │ Yeni ekran/sayfa oluşturma      │ D-UIX, D-NAV, D-ERR, D-A11, D-PLT │ SPEC zorunlu, Stitch zorunlu                         │
  ├─────────────┼─────────────────────────────────┼───────────────────────────────────┼──────────────────────────────────────────────────────┤
  │ A-NEW-HOOK  │ Yeni hook/utility oluşturma     │ D-TST                             │ Unit test zorunlu                                    │
  ├─────────────┼─────────────────────────────────┼───────────────────────────────────┼──────────────────────────────────────────────────────┤
  │ A-NEW-API   │ Yeni API endpoint/entegrasyon   │ D-DAT, D-SEC, D-TST               │ Integration test zorunlu, error handling             │
  ├─────────────┼─────────────────────────────────┼───────────────────────────────────┼──────────────────────────────────────────────────────┤
  │ A-FORM      │ Form geliştirme/düzenleme       │ D-FRM, D-UIX, D-A11, D-ERR        │ Schema-first (Zod), validation timing                │
  ├─────────────┼─────────────────────────────────┼───────────────────────────────────┼──────────────────────────────────────────────────────┤
  │ A-FIREBASE  │ Firebase/Firestore işlemi       │ D-FIR, D-SEC, D-DAT               │ Güvenlik kuralları, indexleme, veri modeli           │
  ├─────────────┼─────────────────────────────────┼───────────────────────────────────┼──────────────────────────────────────────────────────┤
  │ A-STATE     │ State yapısı değişikliği        │ D-STA, D-PRF                      │ Store isolation, persist kuralları                   │
  ├─────────────┼─────────────────────────────────┼───────────────────────────────────┼──────────────────────────────────────────────────────┤
  │ A-NAV       │ Navigation değişikliği          │ D-NAV, D-PLT                      │ Deep link uyumu, back davranışı                      │
  ├─────────────┼─────────────────────────────────┼───────────────────────────────────┼──────────────────────────────────────────────────────┤
  │ A-STYLE     │ Styling/theme değişikliği       │ D-STY, D-DSY, D-UIX               │ Token hiyerarşisi, platform parity                   │
  ├─────────────┼─────────────────────────────────┼───────────────────────────────────┼──────────────────────────────────────────────────────┤
  │ A-REFACTOR  │ Refactoring                     │ D-TST, Universal                  │ Regression risk, mevcut test koruması                │
  ├─────────────┼─────────────────────────────────┼───────────────────────────────────┼──────────────────────────────────────────────────────┤
  │ A-DEP-ADD   │ Dependency ekleme               │ 37-dependency-policy              │ Approval süreci, bundle etki analizi                 │
  ├─────────────┼─────────────────────────────────┼───────────────────────────────────┼──────────────────────────────────────────────────────┤
  │ A-DEP-UP    │ Dependency upgrade              │ 37, 38                            │ Compatibility matrix, breaking change kontrolü       │
  ├─────────────┼─────────────────────────────────┼───────────────────────────────────┼──────────────────────────────────────────────────────┤
  │ A-DEP-RM    │ Dependency kaldırma             │ 37                                │ Kullanım taraması, migration planı                   │
  ├─────────────┼─────────────────────────────────┼───────────────────────────────────┼──────────────────────────────────────────────────────┤
  │ A-MIGRATION │ Veri/şema/kod migration         │ D-DAT, D-SEC                      │ Geri dönüş planı, test coverage                      │
  ├─────────────┼─────────────────────────────────┼───────────────────────────────────┼──────────────────────────────────────────────────────┤
  │ A-CONFIG    │ Build/env/CI config değişikliği │ 15, 21, 27                        │ Pipeline kırılma riski, secret exposure              │
  ├─────────────┼─────────────────────────────────┼───────────────────────────────────┼──────────────────────────────────────────────────────┤
  │ A-DOCS      │ Doküman/ADR yazımı              │ 41, 18                            │ Format uyumu, otorite hiyerarşisi                    │
  ├─────────────┼─────────────────────────────────┼───────────────────────────────────┼──────────────────────────────────────────────────────┤
  │ A-FIX       │ Bug fix                         │ Universal + ilgili domain         │ Root cause analizi, regression test                  │
  ├─────────────┼─────────────────────────────────┼───────────────────────────────────┼──────────────────────────────────────────────────────┤
  │ A-3RD       │ Third-party SDK entegrasyonu    │ D-3RD, D-SEC, 37                  │ Dependency policy, wrapper pattern                   │
  ├─────────────┼─────────────────────────────────┼───────────────────────────────────┼──────────────────────────────────────────────────────┤
  │ A-OFFLINE   │ Offline/cache/persistence       │ D-DAT, D-PLT                      │ Cache invalidation, sync stratejisi                  │
  ├─────────────┼─────────────────────────────────┼───────────────────────────────────┼──────────────────────────────────────────────────────┤
  │ A-REALTIME  │ Real-time/WebSocket/push        │ D-DAT, D-SEC, D-PRF               │ Connection lifecycle, reconnect stratejisi           │
  ├─────────────┼─────────────────────────────────┼───────────────────────────────────┼──────────────────────────────────────────────────────┤
  │ A-MEDIA     │ File upload/media/storage       │ D-SEC, D-PRF                      │ Size limit, format validation                        │
  ├─────────────┼─────────────────────────────────┼───────────────────────────────────┼──────────────────────────────────────────────────────┤
  │ A-ANALYTICS │ Analytics/event tracking        │ D-OBS, D-SEC                      │ PII filtreleme, event naming convention              │
  ├─────────────┼─────────────────────────────────┼───────────────────────────────────┼──────────────────────────────────────────────────────┤
  │ A-AUTH      │ Auth flow değişikliği           │ D-SEC, ADR-010                    │ Token yönetimi, session lifecycle                    │
  ├─────────────┼─────────────────────────────────┼───────────────────────────────────┼──────────────────────────────────────────────────────┤
  │ A-RELEASE   │ Release hazırlığı               │ 29, 15, 31                        │ Quality gate, version bump, changelog                │
  ├─────────────┼─────────────────────────────────┼───────────────────────────────────┼──────────────────────────────────────────────────────┤
  │ A-HOTFIX    │ Hotfix / acil düzeltme          │ Universal                         │ 48 saat kural, post-fix test                         │
  └─────────────┴─────────────────────────────────┴───────────────────────────────────┴──────────────────────────────────────────────────────┘

  Katman 4 — Yaşam Döngüsü Guardrails

  PR, merge, release süreçlerine bağlı kurallar (zaten 15, 29, 30, 42 dokümanlarında tanımlı — AI-native özeti oluşturulacak).

  Katman 5 — Proje-Spesifik Guardrails

  Türetilen projenin kendi domain'ine özel eklediği guardrail'ler (örn: e-ticaret projesi için payment guardrail, sağlık projesi için HIPAA guardrail).

  ---
  3. Claude Code Skill Tasarımı

  İnternet araştırmasından öğrendiğim yapıyı projemize uyguluyorum:

  3.1 Skill Altyapısı (Oluşturulacak Dizin Yapısı)

  .claude/
  ├── settings.json              # Hook tanımları
  ├── hooks/
  │   └── guardrail-reminder.sh  # Pre-tool hook scripti
  ├── skills/
  │   ├── guardrail-check/
  │   │   └── SKILL.md           # Kod üretimi öncesi guardrail kontrol skill'i
  │   ├── guardrail-audit/
  │   │   └── SKILL.md           # Üretim sonrası guardrail denetim skill'i
  │   ├── domain-guide/
  │   │   └── SKILL.md           # İlgili domain guardrail'ini okuyup özetleyen skill
  │   ├── boundary-check/
  │   │   └── SKILL.md           # Boundary contract uyum kontrolü
  │   ├── dep-check/
  │   │   └── SKILL.md           # Dependency ekleme öncesi policy kontrolü
  │   ├── pre-pr/
  │   │   └── SKILL.md           # PR öncesi kalite kontrol skill'i
  │   └── exception-create/
  │       └── SKILL.md           # Exception/exemption kaydı oluşturma
  └── commands/                   # Eski format (geriye uyumluluk)

  3.2 Skill Tanımları

  /guardrail-check — Pre-Generation Guardrail Kontrolü

  ---
  name: guardrail-check
  description: |
    Kod üretimi öncesi ilgili guardrail dokümanlarını okur,
    uyulması gereken kuralları listeler. İş türünü otomatik
    tespit eder ve ilgili domain + aktivite guardrail'lerini yükler.
  allowed-tools: [Read, Glob, Grep]
  ---

  İşlevi: Yapılacak işin türünü belirle → katmanlı guardrail tablosundan ilgili dokümanları oku → kuralları özetle → kontrol listesi sun.

  Tetikleme: Kullanıcı /guardrail-check yazarak veya Claude otomatik olarak (disable-model-invocation: false).

  /guardrail-audit — Post-Generation Denetim

  ---
  name: guardrail-audit
  description: |
    Üretilen veya düzenlenen kodu guardrail kurallarına karşı denetler.
    İhlal tespit ederse düzeltme önerir veya exception kaydı açar.
    Subagent olarak çalışır, ana context'i kirletmez.
  context: fork
  allowed-tools: [Read, Glob, Grep, Bash]
  ---

  İşlevi: Değişen dosyaları tara → ilgili guardrail kurallarını kontrol et → ihlal raporu üret → düzeltme öner.

  /domain-guide — Domain Guardrail Okuyucu

  ---
  name: domain-guide
  description: |
    Belirtilen domain alanının guardrail dokümanını okur ve
    özetler. Örnek: /domain-guide D-FRM (form validation kuralları).
    $ARGUMENTS ile domain ID alır.
  allowed-tools: [Read, Glob]
  ---

  /dep-check — Dependency Policy Kontrolü

  ---
  name: dep-check
  description: |
    Yeni dependency eklenmeden önce 37-dependency-policy.md ve
    38-version-compatibility-matrix.md kurallarına uyumunu kontrol
    eder. Bundle size etkisini değerlendirir.
  allowed-tools: [Read, Bash, Grep]
  ---

  /pre-pr — PR Öncesi Kalite Kapısı

  ---
  name: pre-pr
  description: |
    PR açmadan önce kapsamlı kalite kontrolü yapar:
    guardrail uyumu, test coverage, boundary check,
    DoD kontrol listesi, HIG uyumu. Subagent olarak çalışır.
  context: fork
  allowed-tools: [Read, Glob, Grep, Bash]
  ---

  /boundary-check — Boundary Contract Kontrolü

  ---
  name: boundary-check
  description: |
    Türetilen projede boundary contract uyumunu denetler.
    Zorunlu miras ihlali, yapısal miras gevşetmesi,
    onaysız override taraması yapar.
  context: fork
  allowed-tools: [Read, Glob, Grep]
  ---

  /exception-create — Exception Kaydı Oluşturma

  ---
  name: exception-create
  description: |
    Kural ihlali gerektiğinde 44-exception-and-exemption-policy.md
    formatına uygun exception/exemption kaydı oluşturur.
  allowed-tools: [Read, Write, Glob]
  ---

  3.3 Hook Tanımları

  .claude/settings.json:

  {
    "hooks": {
      "PreToolUse": [
        {
          "matcher": "Write|Edit",
          "hooks": [
            {
              "type": "prompt",
              "prompt": "Bu dosya değişikliği için ilgili guardrail kurallarını kontrol et. Dosya uzantısına ve konumuna göre: .tsx/.jsx → D-UIX, D-DSY, D-A11; firebase/ veya firestore → D-FIR, D-SEC; *.test.* → D-TST; *.schema.* veya
  *.validation.* → D-FRM. İhlal riski varsa uyar."
            }
          ]
        }
      ],
      "PostToolUse": [
        {
          "matcher": "Write|Edit",
          "hooks": [
            {
              "type": "prompt",
              "prompt": "Yazılan/düzenlenen kodda şunları kontrol et: hardcoded renk/spacing/font var mı (D-DSY ihlali), inline user-facing string var mı (D-I18 ihlali), any type var mı (Universal ihlali), import yönü doğru mu
  (Universal). Sorun varsa hemen düzelt."
            }
          ]
        }
      ]
    }
  }

  ---
  4. Codex Tarafı — Denetim ve Rapor Üretim Skill'leri

  Kullanıcı Codex'i yalnızca denetleme ve rapor/döküman üretimi için kullanıyor. Bu doğrultuda:

  4.1 Codex Agent Skills (Oluşturulacak)

  .codex/
  ├── skills/
  │   ├── guardrail-audit/
  │   │   └── SKILL.md     # Guardrail uyum denetim raporu üret
  │   ├── boundary-audit/
  │   │   └── SKILL.md     # Boundary contract uyum raporu üret
  │   ├── dependency-audit/
  │   │   └── SKILL.md     # Dependency policy uyum raporu üret
  │   ├── hig-audit/
  │   │   └── SKILL.md     # HIG enforcement denetim raporu üret
  │   ├── exception-audit/
  │   │   └── SKILL.md     # Exception budget ve süre denetimi raporu
  │   └── full-audit/
  │       └── SKILL.md     # Tüm denetim katmanlarını çalıştırıp birleşik rapor üret

  4.2 AGENTS.md Genişletilmiş Yapı

  Mevcut AGENTS.md'ye eklenecek bölümler:

  ## Guardrail Compliance Review
  - docs/ai-guardrails/ altındaki domain guardrail kurallarına uyumsuzluk → P0/P1
  - Universal guardrail ihlalleri (hardcoded değer, any type, import yönü) → P0
  - Aktivite guardrail'ine uyumsuzluk (örn: yeni component + test yok) → P1
  - Domain guardrail referansını raporda belirt

  ## Activity-Specific Review Rules
  - Yeni feature modülü: SPEC var mı kontrol et, yoksa P1
  - Yeni component: component governance (23) uyumu kontrol et
  - Yeni ekran: navigation uyumu (08), error states (25), a11y (12) kontrol et
  - Dependency ekleme: dependency policy (37) uyumu kontrol et, P0
  - Refactoring: mevcut test coverage azalmış mı kontrol et
  - Config değişikliği: pipeline kırılma riski değerlendir
  - Auth değişikliği: security baseline (27) uyumu kontrol et, P0

  ## Lifecycle Review Rules
  - PR'da DoD (32) kontrol listesi eksik mi?
  - Release branch'te quality gate (15) bypass var mı?
  - Exception süresi dolmuş mu (44)?
  - Boundary contract manifest (BOUNDARY.md) güncel mi?

  ## Report Format
  Her bulgu şu yapıda raporlanmalı:
  1. Severity (P0/P1/P2)
  2. Guardrail referansı (domain ID + kural numarası)
  3. Kaynak doküman referansı
  4. Etkilenen dosya ve satır
  5. İhlal açıklaması
  6. Düzeltme önerisi

  4.3 Dizin-Spesifik AGENTS.md Dosyaları

  packages/ui/AGENTS.md          → D-DSY, D-UIX, D-A11, D-MOT kuralları
  packages/firebase/AGENTS.md    → D-FIR, D-SEC kuralları
  packages/hooks/AGENTS.md       → D-TST, Universal kuralları
  apps/web/AGENTS.md             → D-PLT (web-specific), D-NAV kuralları
  apps/mobile/AGENTS.md          → D-PLT (mobile-specific), D-UIX (HIG) kuralları

  ---
  5. Guardrail Doküman Formatı (Genişletilmiş)

  5.1 Domain Guardrail Doküman Formatı

  ---
  id: D-XXX
  type: domain
  name: [Alan Adı]
  kaynak-dokümanlar: [doküman numaraları]
  miras-tipi: zorunlu | yapısal
  ---

  # D-XXX: [Alan Adı] Guardrail

  ## Bu Guardrail Ne Zaman Aktif?
  [Pattern matching kuralları — dosya yolu, dosya içeriği, aktivite türü]

  ## Universal (Her Zaman Geçerli)
  1. [YAPILMALI] ...
  2. [YAPILMAMALI] ...

  ## Zorunlu Kurallar
  1. [ZORUNLU] ...
  2. [YASAK] ...

  ## Kalite Eşikleri
  - [MİNİMUM] ...
  - [ÖNERİLEN] ...

  ## Anti-pattern'ler
  1. [ZAYIF] ...

  ## İhlal Durumunda
  - Düzeltilemeyen ihlal → exception kaydı aç (44)
  - Kaynak doküman: [referans]

  5.2 Aktivite Guardrail Doküman Formatı

  ---
  id: A-XXX
  type: activity
  name: [Aktivite Adı]
  tetiklenen-domain-guardrails: [D-XXX, D-YYY]
  araç-zorunlulukları: [SPEC: zorunlu/önerilen/—, Stitch: ..., Codex: ...]
  ---

  # A-XXX: [Aktivite Adı] Guardrail

  ## Ön Koşullar
  [Bu aktiviteye başlamadan önce ne yapılmalı]

  ## Aktif Domain Guardrail'ler
  [Otomatik yüklenen domain guardrail'leri]

  ## Aktiviteye Özel Kurallar
  1. ...

  ## DoD Ek Maddeleri
  [Bu aktivite türü için Definition of Done ekleri]

  ## Araç Kullanım Tablosu
  | Araç | Zorunluluk | Koşul |

  ---
  6. Dokümantasyon Değişiklikleri (Genişletilmiş)

  6.1 Yeni Oluşturulacak Dokümanlar

  Governance

  ┌───────────────────────────────────────────────┬───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
  │                     Dosya                     │                                                              İçerik                                                               │
  ├───────────────────────────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ docs/governance/47-ai-guardrail-governance.md │ Ana guardrail çerçevesi: katmanlı mimari, format standardı, yaşam döngüsü, miras kuralları, skill entegrasyonu, hook entegrasyonu │
  └───────────────────────────────────────────────┴───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘

  ▎ Not: 46 numarası 46-stitch-pipeline-spec.md olarak zaten kullanılmış, yeni doküman 47 numarasını alacak.

  Domain Guardrail'ler (docs/ai-guardrails/domain/)

  ┌───────┬───────────────────────────────┬────────────────────────────┐
  │  ID   │             Dosya             │           Kaynak           │
  ├───────┼───────────────────────────────┼────────────────────────────┤
  │ D-UIX │ D-UIX-ui-ux-hig.md            │ 03, 33, 34                 │
  ├───────┼───────────────────────────────┼────────────────────────────┤
  │ D-DSY │ D-DSY-design-system.md        │ 04, 05, 22, 23             │
  ├───────┼───────────────────────────────┼────────────────────────────┤
  │ D-NAV │ D-NAV-navigation.md           │ 08, ADR-012                │
  ├───────┼───────────────────────────────┼────────────────────────────┤
  │ D-STA │ D-STA-state-management.md     │ 09, ADR-004                │
  ├───────┼───────────────────────────────┼────────────────────────────┤
  │ D-DAT │ D-DAT-data-fetching.md        │ 10, ADR-005                │
  ├───────┼───────────────────────────────┼────────────────────────────┤
  │ D-FRM │ D-FRM-forms-validation.md     │ 11, ADR-006                │
  ├───────┼───────────────────────────────┼────────────────────────────┤
  │ D-MOT │ D-MOT-motion-interaction.md   │ 24                         │
  ├───────┼───────────────────────────────┼────────────────────────────┤
  │ D-ERR │ D-ERR-error-empty-loading.md  │ 25                         │
  ├───────┼───────────────────────────────┼────────────────────────────┤
  │ D-PLT │ D-PLT-platform-adaptation.md  │ 26, ADR-001, ADR-002       │
  ├───────┼───────────────────────────────┼────────────────────────────┤
  │ D-A11 │ D-A11-accessibility.md        │ 12                         │
  ├───────┼───────────────────────────────┼────────────────────────────┤
  │ D-PRF │ D-PRF-performance.md          │ 13                         │
  ├───────┼───────────────────────────────┼────────────────────────────┤
  │ D-TST │ D-TST-testing.md              │ 14, ADR-008                │
  ├───────┼───────────────────────────────┼────────────────────────────┤
  │ D-SEC │ D-SEC-security.md             │ 27, ADR-010                │
  ├───────┼───────────────────────────────┼────────────────────────────┤
  │ D-OBS │ D-OBS-observability.md        │ 28, ADR-009                │
  ├───────┼───────────────────────────────┼────────────────────────────┤
  │ D-I18 │ D-I18-internationalization.md │ ADR-011                    │
  ├───────┼───────────────────────────────┼────────────────────────────┤
  │ D-STY │ D-STY-styling.md              │ ADR-007                    │
  ├───────┼───────────────────────────────┼────────────────────────────┤
  │ D-FIR │ D-FIR-firebase-firestore.md   │ YENİ — tamamen yeni içerik │
  ├───────┼───────────────────────────────┼────────────────────────────┤
  │ D-3RD │ D-3RD-third-party.md          │ 37 genişletilmiş           │
  ├───────┼───────────────────────────────┼────────────────────────────┤
  │ D-VIS │ D-VIS-visual-fidelity.md      │ 33                         │
  └───────┴───────────────────────────────┴────────────────────────────┘

  Aktivite Guardrail'ler (docs/ai-guardrails/activity/)

  ┌─────────────┬───────────────────────────────────┐
  │     ID      │               Dosya               │
  ├─────────────┼───────────────────────────────────┤
  │ A-NEW-FEAT  │ A-NEW-FEAT-new-feature.md         │
  ├─────────────┼───────────────────────────────────┤
  │ A-NEW-COMP  │ A-NEW-COMP-new-component.md       │
  ├─────────────┼───────────────────────────────────┤
  │ A-NEW-SCRN  │ A-NEW-SCRN-new-screen.md          │
  ├─────────────┼───────────────────────────────────┤
  │ A-NEW-HOOK  │ A-NEW-HOOK-new-hook-utility.md    │
  ├─────────────┼───────────────────────────────────┤
  │ A-NEW-API   │ A-NEW-API-new-api-integration.md  │
  ├─────────────┼───────────────────────────────────┤
  │ A-FORM      │ A-FORM-form-development.md        │
  ├─────────────┼───────────────────────────────────┤
  │ A-FIREBASE  │ A-FIREBASE-firebase-operations.md │
  ├─────────────┼───────────────────────────────────┤
  │ A-STATE     │ A-STATE-state-changes.md          │
  ├─────────────┼───────────────────────────────────┤
  │ A-NAV       │ A-NAV-navigation-changes.md       │
  ├─────────────┼───────────────────────────────────┤
  │ A-STYLE     │ A-STYLE-styling-theming.md        │
  ├─────────────┼───────────────────────────────────┤
  │ A-REFACTOR  │ A-REFACTOR-refactoring.md         │
  ├─────────────┼───────────────────────────────────┤
  │ A-DEP       │ A-DEP-dependency-changes.md       │
  ├─────────────┼───────────────────────────────────┤
  │ A-MIGRATION │ A-MIGRATION-migration.md          │
  ├─────────────┼───────────────────────────────────┤
  │ A-CONFIG    │ A-CONFIG-config-ci-changes.md     │
  ├─────────────┼───────────────────────────────────┤
  │ A-DOCS      │ A-DOCS-documentation.md           │
  ├─────────────┼───────────────────────────────────┤
  │ A-FIX       │ A-FIX-bug-fix.md                  │
  ├─────────────┼───────────────────────────────────┤
  │ A-3RD       │ A-3RD-third-party-integration.md  │
  ├─────────────┼───────────────────────────────────┤
  │ A-AUTH      │ A-AUTH-auth-changes.md            │
  ├─────────────┼───────────────────────────────────┤
  │ A-RELEASE   │ A-RELEASE-release-prep.md         │
  ├─────────────┼───────────────────────────────────┤
  │ A-MEDIA     │ A-MEDIA-file-media.md             │
  ├─────────────┼───────────────────────────────────┤
  │ A-REALTIME  │ A-REALTIME-realtime-push.md       │
  ├─────────────┼───────────────────────────────────┤
  │ A-ANALYTICS │ A-ANALYTICS-event-tracking.md     │
  └─────────────┴───────────────────────────────────┘

  Skill Dosyaları

  ┌──────────────────────────────────────────┬─────────────┐
  │                  Dosya                   │  Platform   │
  ├──────────────────────────────────────────┼─────────────┤
  │ .claude/skills/guardrail-check/SKILL.md  │ Claude Code │
  ├──────────────────────────────────────────┼─────────────┤
  │ .claude/skills/guardrail-audit/SKILL.md  │ Claude Code │
  ├──────────────────────────────────────────┼─────────────┤
  │ .claude/skills/domain-guide/SKILL.md     │ Claude Code │
  ├──────────────────────────────────────────┼─────────────┤
  │ .claude/skills/dep-check/SKILL.md        │ Claude Code │
  ├──────────────────────────────────────────┼─────────────┤
  │ .claude/skills/pre-pr/SKILL.md           │ Claude Code │
  ├──────────────────────────────────────────┼─────────────┤
  │ .claude/skills/boundary-check/SKILL.md   │ Claude Code │
  ├──────────────────────────────────────────┼─────────────┤
  │ .claude/skills/exception-create/SKILL.md │ Claude Code │
  ├──────────────────────────────────────────┼─────────────┤
  │ .claude/settings.json                    │ Claude Code │
  └──────────────────────────────────────────┴─────────────┘

  6.2 Güncellenecek Mevcut Dokümanlar

  ┌────────────────────────────────────────────────┬───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
  │                    Doküman                     │                                                               Eklenecek İçerik                                                                │
  ├────────────────────────────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ CLAUDE.md                                      │ Katmanlı guardrail protokolü, skill referansları, hook açıklaması                                                                             │
  ├────────────────────────────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ AGENTS.md (kök)                                │ Guardrail compliance review, activity-specific review, lifecycle review, report format                                                        │
  ├────────────────────────────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ 45-boilerplate-project-boundary-contract.md §4 │ Guardrail doküman ailesi → zorunlu miras satırı, CLAUDE.md guardrail protokolü → zorunlu miras satırı, skill dosyaları → yapısal miras satırı │
  ├────────────────────────────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ 40-ai-workflow-and-tooling.md                  │ Guardrail workflow bölümü, skill envanteri, hook tanımları                                                                                    │
  ├────────────────────────────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ 41-ai-instruction-standards.md                 │ Guardrail doküman format standardı (§4.5), skill SKILL.md format standardı (§4.6)                                                             │
  ├────────────────────────────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ 35-document-map.md                             │ AI Guardrails doküman ailesi, skill dosyaları                                                                                                 │
  ├────────────────────────────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ 31-audit-checklist.md                          │ Guardrail uyum denetim katmanı                                                                                                                │
  ├────────────────────────────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ 32-definition-of-done.md                       │ Her iş türü DoD'una guardrail uyum maddesi                                                                                                    │
  ├────────────────────────────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ 15-quality-gates-and-ci-rules.md               │ Guardrail uyumu CI gate olarak                                                                                                                │
  ├────────────────────────────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ 43-derived-project-creation-guide.md           │ Guardrail setup adımları, skill kopyalama, AGENTS.md oluşturma                                                                                │
  ├────────────────────────────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ 30-contribution-guide.md                       │ Guardrail-aware contribution akışı                                                                                                            │
  └────────────────────────────────────────────────┴───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘

  6.3 Dizin-Spesifik AGENTS.md Dosyaları (Yeni)

  ┌───────────────────────┬───────────────────────────────────────┐
  │         Dosya         │                 Hedef                 │
  ├───────────────────────┼───────────────────────────────────────┤
  │ packages/ui/AGENTS.md │ UI component denetim kuralları        │
  ├───────────────────────┼───────────────────────────────────────┤
  │ apps/web/AGENTS.md    │ Web-specific denetim kuralları        │
  ├───────────────────────┼───────────────────────────────────────┤
  │ apps/mobile/AGENTS.md │ Mobile/HIG-specific denetim kuralları │
  └───────────────────────┴───────────────────────────────────────┘

  ---
  7. Endüstri Best Practice Entegrasyonu

  İnternet araştırmasından edinilen ve projemize uyarlanması gereken pattern'ler:

  7.1 Multi-Agent Layered Validation (2026 Standard)

  Claude Code (üret) → Guardrail Skills (self-check) → Codex (bağımsız denetim) → İnsan (final onay)

  Bu zaten 40-ai-workflow-and-tooling.md'deki pipeline ile örtüşüyor. Guardrail skill'leri aradaki self-check katmanını ekliyor.

  7.2 Progressive Disclosure (Skill Best Practice)

  Skill'ler sadece ihtiyaç duyulduğunda context'e yüklenir. Bu, 41-ai-instruction-standards.md'deki context bütçesi ilkesiyle uyumlu:

  - Guardrail dokümanları CLAUDE.md'de sadece pointer olarak bulunur
  - Skill tetiklendiğinde ilgili guardrail dokümanı Read ile okunur
  - Context'e sadece aktif iş için gerekli kurallar yüklenir

  7.3 Deterministic Guardrails + AI Guardrails Kombinasyonu

  - Deterministic (lint, typecheck, CI): Zaten 15-quality-gates, 16-tooling ile tanımlı
  - AI-native (skill, hook, AGENTS.md): Bu plan ile ekleniyor
  - İkisi birbirini tamamlar, birinin yerine geçmez

  7.4 Quality Gate Pattern: PASS/CONCERNS/REWORK/FAIL

  /pre-pr skill'inin çıktı formatı:

  PASS      → Tüm guardrail'ler sağlandı, PR açılabilir
  CONCERNS  → Küçük uyarılar var, PR açılabilir ama not düşülmeli
  REWORK    → Major ihlaller var, düzeltme gerekli
  FAIL      → Blocker ihlal var, PR açılamaz

  ---
  8. Uygulama Sırası & Öncelik (Revize)

  Faz 0 — Altyapı Kurulumu (Ön Koşul)

  ┌──────┬────────────────────────────────────────────────────────────────────────────────┐
  │ Sıra │                                       İş                                       │
  ├──────┼────────────────────────────────────────────────────────────────────────────────┤
  │ 0.1  │ .claude/ dizin yapısını oluştur (skills/, hooks/, settings.json)               │
  ├──────┼────────────────────────────────────────────────────────────────────────────────┤
  │ 0.2  │ docs/ai-guardrails/domain/ ve docs/ai-guardrails/activity/ dizinlerini oluştur │
  └──────┴────────────────────────────────────────────────────────────────────────────────┘

  Faz 1 — Temel Çerçeve

  ┌──────┬──────────────────────────────────────────┬────────────────────────┐
  │ Sıra │                    İş                    │        Gerekçe         │
  ├──────┼──────────────────────────────────────────┼────────────────────────┤
  │ 1.1  │ 47-ai-guardrail-governance.md            │ Tüm sistemin anayasası │
  ├──────┼──────────────────────────────────────────┼────────────────────────┤
  │ 1.2  │ CLAUDE.md güncelle (guardrail protokolü) │ Protokolü aktif et     │
  ├──────┼──────────────────────────────────────────┼────────────────────────┤
  │ 1.3  │ /guardrail-check skill oluştur           │ Ana mekanizma          │
  ├──────┼──────────────────────────────────────────┼────────────────────────┤
  │ 1.4  │ .claude/settings.json (hook tanımları)   │ Otomatik tetikleme     │
  └──────┴──────────────────────────────────────────┴────────────────────────┘

  Faz 2 — Kritik Domain Guardrail'ler

  ┌──────┬────────────────────────────┬────────────────────┐
  │ Sıra │             İş             │      Gerekçe       │
  ├──────┼────────────────────────────┼────────────────────┤
  │ 2.1  │ D-DSY (Design System)      │ En sık ihlal       │
  ├──────┼────────────────────────────┼────────────────────┤
  │ 2.2  │ D-UIX (UI/UX & HIG)        │ Platform kalitesi  │
  ├──────┼────────────────────────────┼────────────────────┤
  │ 2.3  │ D-SEC (Security)           │ Güvenlik baseline  │
  ├──────┼────────────────────────────┼────────────────────┤
  │ 2.4  │ D-FRM (Forms & Validation) │ Kırılgan yüzey     │
  ├──────┼────────────────────────────┼────────────────────┤
  │ 2.5  │ D-A11 (Accessibility)      │ Zorunlu miras (AA) │
  └──────┴────────────────────────────┴────────────────────┘

  Faz 3 — Aktivite Guardrail'ler (En Sık Kullanılanlar)

  ┌──────┬────────────────────────────────┐
  │ Sıra │               İş               │
  ├──────┼────────────────────────────────┤
  │ 3.1  │ A-NEW-COMP (Yeni component)    │
  ├──────┼────────────────────────────────┤
  │ 3.2  │ A-NEW-SCRN (Yeni ekran)        │
  ├──────┼────────────────────────────────┤
  │ 3.3  │ A-NEW-FEAT (Yeni feature)      │
  ├──────┼────────────────────────────────┤
  │ 3.4  │ A-FIX (Bug fix)                │
  ├──────┼────────────────────────────────┤
  │ 3.5  │ A-REFACTOR                     │
  ├──────┼────────────────────────────────┤
  │ 3.6  │ A-DEP (Dependency değişikliği) │
  └──────┴────────────────────────────────┘

  Faz 4 — Codex Entegrasyonu

  ┌──────┬────────────────────────────────────────────────────┐
  │ Sıra │                         İş                         │
  ├──────┼────────────────────────────────────────────────────┤
  │ 4.1  │ AGENTS.md genişletilmiş güncelleme                 │
  ├──────┼────────────────────────────────────────────────────┤
  │ 4.2  │ Dizin-spesifik AGENTS.md dosyaları                 │
  ├──────┼────────────────────────────────────────────────────┤
  │ 4.3  │ Codex skill'leri (guardrail-audit, full-audit vb.) │
  └──────┴────────────────────────────────────────────────────┘

  Faz 5 — Yeni Alan Dokümanları

  ┌──────┬───────────────────────────────────────────┐
  │ Sıra │                    İş                     │
  ├──────┼───────────────────────────────────────────┤
  │ 5.1  │ D-FIR (Firebase/Firestore) — tamamen yeni │
  ├──────┼───────────────────────────────────────────┤
  │ 5.2  │ D-3RD (Third-party entegrasyon)           │
  ├──────┼───────────────────────────────────────────┤
  │ 5.3  │ D-NAV, D-STA, D-DAT, D-MOT, D-ERR, D-PLT  │
  ├──────┼───────────────────────────────────────────┤
  │ 5.4  │ D-OBS, D-I18, D-STY, D-PRF, D-TST, D-VIS  │
  └──────┴───────────────────────────────────────────┘

  Faz 6 — Kalan Aktivite Guardrail'ler

  ┌──────┬──────────────────────────────────────────────────┐
  │ Sıra │                        İş                        │
  ├──────┼──────────────────────────────────────────────────┤
  │ 6.1  │ A-FIREBASE, A-AUTH, A-3RD, A-MIGRATION           │
  ├──────┼──────────────────────────────────────────────────┤
  │ 6.2  │ A-CONFIG, A-NAV, A-STATE, A-STYLE                │
  ├──────┼──────────────────────────────────────────────────┤
  │ 6.3  │ A-MEDIA, A-REALTIME, A-ANALYTICS, A-OFFLINE      │
  ├──────┼──────────────────────────────────────────────────┤
  │ 6.4  │ A-DOCS, A-RELEASE, A-FORM, A-NEW-API, A-NEW-HOOK │
  └──────┴──────────────────────────────────────────────────┘

  Faz 7 — Entegrasyon & Mevcut Doküman Güncellemeleri

  ┌──────┬───────────────────────────────────────────────────────┐
  │ Sıra │                          İş                           │
  ├──────┼───────────────────────────────────────────────────────┤
  │ 7.1  │ 45-boundary-contract güncelle                         │
  ├──────┼───────────────────────────────────────────────────────┤
  │ 7.2  │ 40, 41, 35, 31, 32, 15, 43, 30 güncelle               │
  ├──────┼───────────────────────────────────────────────────────┤
  │ 7.3  │ /guardrail-audit, /pre-pr, /boundary-check skill'leri │
  ├──────┼───────────────────────────────────────────────────────┤
  │ 7.4  │ /dep-check, /exception-create skill'leri              │
  └──────┴───────────────────────────────────────────────────────┘

  ---
  9. Türetilen Projelere Aktarım Modeli

  Boilerplate                        Türetilen Proje
  ───────────────                    ─────────────────
  docs/ai-guardrails/domain/    →   docs/ai-guardrails/domain/ (read-only)
  docs/ai-guardrails/activity/  →   docs/ai-guardrails/activity/ (read-only)
  .claude/skills/               →   .claude/skills/ (yapısal miras)
  .claude/settings.json         →   .claude/settings.json (yapısal miras)
  AGENTS.md (kök)               →   AGENTS.md (yapısal miras)
  CLAUDE.md guardrail bölümü    →   CLAUDE.md (zorunlu miras)

  Türetilen proje EKLEYEBİLİR:
    docs/ai-guardrails/project/GP-XXX-*.md (proje-spesifik guardrail)
    .claude/skills/project-*/SKILL.md (proje-spesifik skill)
    Dizin-spesifik AGENTS.md (ek kısıtlama)

  Türetilen proje YAPAMAZ:
    Base guardrail kaldırma/gevşetme
    Universal guardrail'leri bypass etme
    Skill hook'larını devre dışı bırakma

  ---
  Bu plan, önceki versiyondaki dar yelpazeyi 30+ geliştirme yüzeyine genişletiyor, Claude Code ve Codex için skill altyapısı tanımlıyor ve endüstri best practice'lerini entegre ediyor.

  İmplementasyona geçmemi ister misin? Faz 0 + Faz 1'den (altyapı kurulumu + ana çerçeve dokümanı + CLAUDE.md güncellemesi + ilk skill) başlayabilirim.

  Sources:
  - Claude Code Skills Docs
  - Codex CLI AGENTS.md Guide
  - Codex Agent Skills
  - Claude Code Hooks Guide
  - AI Code Quality 2026: Guardrails
  - AI Agent Guardrails & Output Validation 2026
  - Anthropic Official Skills Repository
  - Claude Code Customization Guide
  - Codex CLI Best Practices
  - Skill Authoring Best Practices
  - Deterministic Security Guardrails for Claude Code
  - Code Review Skill for Claude Code
