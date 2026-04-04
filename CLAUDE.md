# Boilerplate Proje Talimatları

<!-- PROJECT-SPECIFIC-START: Proje Kimligi -->

## Proje Kimliği

- Cross-platform boilerplate: React + React Native (Expo)
- Documentation-first, spec-first yaklaşım
- Apple HIG uyumlu, design system merkezli
<!-- PROJECT-SPECIFIC-END: Proje Kimligi -->

<!-- UPSTREAM-SYNC-START: Canonical Kararlar -->

## Canonical Kararlar — BUNLAR AÇILAMAZ

Bu kararlar ADR-001 → ADR-019 ile birlikte `36-canonical-stack-decision.md`, `37-dependency-policy.md` ve `38-version-compatibility-matrix.md` tarafından kilitlenmiştir.
Alternatifleri tartışma, sorgulatma veya bypass etme.

- Web runtime: React + Vite + React Router 7.x, SPA-first (ADR-001)
- Mobil runtime: React Native + Expo SDK 55.x (ADR-002)
- Monorepo: pnpm 10.x + Turborepo 2.x (ADR-003)
- Install Security: pnpm minimumReleaseAge + allowBuilds + trustPolicy (ADR-003 / 37)
- State management: Zustand 5.x (ADR-004)
- Data fetching: fetch-first default + TanStack Query 5.x conditional query-layer track (ADR-005)
- Forms: React Hook Form 7.x + Zod 4.x schema authority (ADR-006)
- Styling/tokens: Tailwind CSS 4.x (web) + NativeWind 5.x candidate track (mobile), semantic token-first (ADR-007). Bootstrap öncesi release-status doğrulaması zorunludur.
- Testing: Vitest 4.x (web) + Jest 29.x (mobile) + Testing Library + Playwright 1.59.x E2E (ADR-008)
- Component Lab: Storybook 8.x + Storybook Test (web)
- Observability: Sentry + vendor-agnostic analytics abstraction (ADR-009)
- New Architecture: Fabric + JSI + TurboModules + Hermes V1 zorunlu, kapatılamaz (ADR-018)
- Local Storage: MMKV canonical default + Expo SecureStore (hassas veri) + Zustand persist (ADR-019)
- Watchlist: React Compiler controlled opt-in, Biome 2.x pilot/watchlist, @expo/ui 1.0 stable watch
- Auth: Backend-managed HttpOnly cookies (web) + Expo SecureStore (mobile) + Biometric (expo-local-authentication) (ADR-010)
- i18n: i18next 26.x, namespace-based (ADR-011)
- Navigation: React Router 7.x (web) + React Navigation 7.x (mobile) (ADR-012)
- Push Notification: expo-notifications + FCM/APNs (ADR-013)
- Deep Linking: expo-linking + Universal Links + App Links (ADR-014)
- OTA Update: EAS Update (ADR-015)
- In-App Purchase: RevenueCat (react-native-purchases) (ADR-016)
- Privacy/Compliance: GDPR + KVKK uyum çerçevesi (ADR-017)
<!-- UPSTREAM-SYNC-END: Canonical Kararlar -->

<!-- UPSTREAM-SYNC-START: SDK Upgrade Kurallari -->

## SDK Upgrade Kuralları

- Expo SDK major upgrade için docs/governance/48-expo-sdk-upgrade-strategy.md zorunlu referanstır
- expo-doctor temiz geçmeden SDK upgrade merge edilmez
- runtimeVersion değişikliği OTA uyumluluk etkisiyle birlikte değerlendirilir
<!-- UPSTREAM-SYNC-END: SDK Upgrade Kurallari -->

<!-- UPSTREAM-SYNC-START: Dependency Kurallari -->

## Dependency Kuralları

- Yeni dependency eklemeden önce docs/governance/37-dependency-policy.md kontrol et
- Versiyon uyumluluğu için docs/governance/38-version-compatibility-matrix.md kontrol et
- Canonical stack'teki kütüphanelerin alternatiflerini önerme
<!-- UPSTREAM-SYNC-END: Dependency Kurallari -->

<!-- PROJECT-SPECIFIC-START: MoAI-ADK Entegrasyonu -->

## MoAI-ADK Entegrasyonu

- Bu projede MoAI-ADK aktiftir: /moai komutları kullanılabilir
- SPEC-First: karmaşık görevlerde önce /moai plan ile SPEC oluştur
- TRUST 5 kalite kuralları geçerlidir
- Basit görevlerde (bug fix, küçük düzeltme) SPEC zorunlu değildir
<!-- PROJECT-SPECIFIC-END: MoAI-ADK Entegrasyonu -->

<!-- PROJECT-SPECIFIC-START: Stitch Entegrasyonu -->

## Stitch Entegrasyonu

- Stitch MCP aktiftir: tasarım verileri çekilebilir
- DESIGN.md dosyası varsa, component üretiminde referans al
- Token çıktılarını docs/design-system/22-design-tokens-spec.md katmanlarıyla eşle
- DESIGN.md 22-design-tokens-spec.md'nin türevdir; çelişki varsa 22 kazanır
<!-- PROJECT-SPECIFIC-END: Stitch Entegrasyonu -->

<!-- PROJECT-SPECIFIC-START: Dosya Organizasyonu -->

## Dosya Organizasyonu

- Feature kodu: apps/{app}/src/features/{feature}/
- Shared package: packages/{package}/src/
- Test: kaynak dosya yanında \*.test.ts(x)
- Design token: packages/design-tokens/
- Spec dokümanları: .moai/specs/
- Import yönü: feature → shared OK, shared → feature YASAK
<!-- PROJECT-SPECIFIC-END: Dosya Organizasyonu -->

<!-- UPSTREAM-SYNC-START: Referans Dokumanlar -->

## Referans Dokümanlar (Detay İçin Oku)

- Component governance → docs/design-system/23-component-governance-rules.md
- Platform adaptation → docs/design-system/26-platform-adaptation-rules.md
- Error/empty/loading states → docs/design-system/25-error-empty-loading-states.md
- Navigation patterns → docs/architecture/08-navigation-and-flow-rules.md
- Security baseline → docs/quality/27-security-and-secrets-baseline.md
- Accessibility → docs/quality/12-accessibility-standard.md
- Motion/interaction → docs/design-system/24-motion-and-interaction-standard.md
- Performance → docs/quality/13-performance-standard.md
- Push notification → docs/adr/ADR-013-push-notification-strategy.md
- Deep linking → docs/adr/ADR-014-deep-linking-and-universal-links.md
- OTA update → docs/adr/ADR-015-ota-update-strategy.md
- In-app purchase → docs/adr/ADR-016-in-app-purchase-and-subscription.md
- Privacy/GDPR/KVKK → docs/adr/ADR-017-privacy-and-data-protection-framework.md
- AI Guardrail governance → docs/governance/47-ai-guardrail-governance.md
- AI workflow → docs/governance/40-ai-workflow-and-tooling.md
- AI instruction standards → docs/governance/41-ai-instruction-standards.md
- New Architecture migration → docs/adr/ADR-018-new-architecture-migration-and-readiness-strategy.md
- Local storage/offline-first → docs/adr/ADR-019-local-storage-and-offline-first-strategy.md
- SDK upgrade stratejisi → docs/governance/48-expo-sdk-upgrade-strategy.md
- Upstream sync stratejisi → docs/governance/49-upstream-sync-strategy.md
- Kodlama standartları → docs/architecture/50-coding-standards-and-file-conventions.md
- Servis katmanı pattern'leri → docs/architecture/51-service-layer-patterns.md
- AI geliştirme standartları → docs/governance/52-ai-development-standards.md
- Kodlama guardrail → docs/ai-guardrails/domain/D-COD-coding-standards.md
- ESLint plugin (custom kurallar) → packages/eslint-plugin-bp/
<!-- UPSTREAM-SYNC-END: Referans Dokumanlar -->

<!-- UPSTREAM-SYNC-START: Kodlama Standartlari -->

## Kodlama Standartları

- TypeScript strict mode zorunlu — `any` tipi yasak
- Hardcoded renk, spacing, font değeri yasak — semantic token kullan (`bp-` prefix)
- Inline user-facing string yasak — i18n key kullan
- `eslint-disable` / `@ts-ignore` kullanımı exception policy gerektirir (44-exception-and-exemption-policy.md)
- Component isimlendirme: PascalCase, dosya adı ile eşleşmeli
- Test dosyası: `*.test.ts(x)` kaynak dosyanın yanında
- Dosya boyut limiti: ≤300 satır hedef, >500 uyarı, >800 hard limit (detay: 50)
- Fonksiyon boyut limiti: ≤50 satır hedef, >150 hard limit (detay: 50)
- Barrel import yasak — doğrudan dosya yolu kullan
- Raw platform primitive yasak (Pressable, RN Text) — wrapper kullan
- 2+ input form: react-hook-form + Zod zorunlu
- Servis katmanı akışı: UI → Hook → UseCase → Repository → Infrastructure (detay: 51)
- AI geliştirme: Approach-first, reproduction-first bug fix, post-impl review (detay: 52)
<!-- UPSTREAM-SYNC-END: Kodlama Standartlari -->

<!-- UPSTREAM-SYNC-START: AI Guardrail Protokolu -->

## AI Guardrail Protokolü [ZORUNLU — OTOMATİK TETİKLEME]

Kod üretimi veya düzenleme yapmadan ÖNCE bu protokolü uygula. Guardrail okumadan kod üretme.
Skill'ler kullanıcı müdahalesi BEKLEMEDEN otomatik tetiklenir.

### İş Başlangıcı — `/guardrail-check` OTOMATİK çalışır:

1. **İş türünü belirle** → `/guardrail-check` skill'ini tetikle
2. Skill ilgili aktivite ve domain guardrail'lerini okur, kuralları özetler
3. Özet sunduktan SONRA kodlamaya geç

### Kodlama Sırasında — Hook'lar OTOMATİK çalışır:

4. Her Edit/Write öncesi `pre-edit-guardrail.sh` dosya bağlamını tespit eder
5. Her Edit/Write sonrası `post-edit-guardrail.sh` gerçek grep ile ihlal tarar
6. Hook uyarısı gelirse HEMEN düzelt

### İş Tamamlandığında — `/guardrail-audit` OTOMATİK çalışır:

7. Tüm değişiklikleri toplu denetle, ihlal raporu üret
8. P0 ihlal varsa HEMEN düzelt
9. Düzeltemiyorsan `/exception-create` ile kayıt aç

### PR/Commit Öncesi — `/pre-pr` OTOMATİK çalışır:

10. Universal guardrail, test, boundary, DoD kapsamlı kontrol
11. PASS alana kadar commit/PR yapma

### Aktivasyon Tablosu (Tam Liste)

| İş Türü                      | Aktivite       | Okunacak Domain Guardrail'ler                   |
| ---------------------------- | -------------- | ----------------------------------------------- |
| UI/Component oluşturma       | A-NEW-COMP     | D-COD, D-UIX, D-DSY, D-A11, D-PLT, D-MOT        |
| Yeni ekran/sayfa             | A-NEW-SCRN     | D-COD, D-UIX, D-NAV, D-ERR, D-A11, D-PLT        |
| Yeni feature modülü          | A-NEW-FEAT     | D-COD + İlgili tüm domain'ler                   |
| Yeni hook/utility            | A-NEW-HOOK     | D-COD, D-TST                                    |
| Yeni API entegrasyonu        | A-NEW-API      | D-COD, D-DAT, D-SEC, D-TST                      |
| Form geliştirme              | A-FORM         | D-COD, D-FRM, D-UIX, D-A11, D-ERR               |
| Firebase/Firestore işlemi    | A-FIREBASE     | D-COD, D-FIR, D-SEC, D-DAT                      |
| Bug fix                      | A-FIX          | D-COD + Universal + ilgili domain               |
| Refactoring                  | A-REFACTOR     | D-COD, D-TST, Universal                         |
| Dependency değişikliği       | A-DEP          | D-3RD, D-SEC, 37, 38                            |
| State değişikliği            | A-STATE        | D-STA, D-PRF                                    |
| Navigation değişikliği       | A-NAV          | D-NAV, D-PLT                                    |
| Styling/theme değişikliği    | A-STYLE        | D-STY, D-DSY, D-UIX                             |
| Auth flow değişikliği        | A-AUTH         | D-SEC, ADR-010, D-BIO                           |
| Config/CI değişikliği        | A-CONFIG       | D-SEC, 15, 21, 27                               |
| Third-party entegrasyon      | A-3RD          | D-3RD, D-SEC, 37                                |
| Migration (veri/şema/kod)    | A-MIGRATION    | D-DAT, D-SEC                                    |
| Release hazırlığı            | A-RELEASE      | 29, 15, 31, D-OBS, D-SEC                        |
| File upload/media            | A-MEDIA        | D-SEC, D-PRF                                    |
| Real-time/WebSocket/push     | A-REALTIME     | D-DAT, D-SEC, D-PRF                             |
| Analytics/event tracking     | A-ANALYTICS    | D-OBS, D-SEC                                    |
| Offline/cache/persistence    | A-OFFLINE      | D-DAT, D-PLT, D-OFL                             |
| AI/ML feature entegrasyonu   | A-AI-FEAT      | D-AIX, D-UIX, D-SEC, D-PLT, D-PRI, D-TST, D-OBS |
| Push notification geliştirme | A-NOTIFICATION | D-NTF, D-SEC, D-PRI                             |
| Deep link implementasyonu    | A-DEEPLINK     | D-DPL, D-NAV, D-SEC                             |
| Ödeme/abonelik entegrasyonu  | A-PAYMENT      | D-PAY, D-SEC, D-PRI                             |
| OTA güncelleme               | A-OTA          | D-SEC, D-OBS, D-PLT                             |
| Gizlilik uyum çalışması      | A-PRIVACY      | D-PRI, D-SEC, D-OBS                             |
| SDK/Framework major upgrade  | A-SDK-UPGRADE  | D-PLT, D-PRF, D-TST, D-SEC, D-3RD, D-OFL        |
| Doküman/ADR yazımı           | A-DOCS         | 41, 18                                          |

Tam liste ve detay: `docs/governance/47-ai-guardrail-governance.md`
Guardrail dokümanları: `docs/ai-guardrails/domain/` ve `docs/ai-guardrails/activity/`

### Guardrail Skill'leri (Otomatik Tetikleme)

- `/guardrail-check` — **OTOMATİK: iş başlangıcında** → guardrail'leri oku ve özetle
- `/guardrail-audit` — **OTOMATİK: iş tamamlandığında** → toplu denetim raporu
- `/dep-check` — **OTOMATİK: dependency değişikliğinde** → policy kontrolü
- `/pre-pr` — **OTOMATİK: PR/commit öncesinde** → kapsamlı kalite kontrolü
- `/domain-guide D-XXX` — Domain detayı gerektiğinde → guardrail kuralları
- `/boundary-check` — Modül yapısı değiştiğinde → boundary contract uyumu
- `/exception-create` — İhlal düzeltilemediğinde → exception kaydı oluştur
<!-- UPSTREAM-SYNC-END: AI Guardrail Protokolu -->

<!-- PROJECT-SPECIFIC-START: Sik Kullanilan Komutlar -->

## Sık Kullanılan Komutlar

```bash
pnpm install          # Bağımlılık kurulumu
pnpm dev:web          # Web development server
pnpm dev:mobile       # Mobile development server
pnpm typecheck        # TypeScript tip kontrolü
pnpm lint             # ESLint kontrolü
pnpm test             # Tüm testleri çalıştır
pnpm build            # Tüm workspace'i derle
```

<!-- PROJECT-SPECIFIC-END: Sik Kullanilan Komutlar -->

<!-- UPSTREAM-SYNC-START: Belge Otorite Hiyerarsisi -->

## Belge Otorite Hiyerarşisi

Çelişki durumunda otorite sırası:

1. `00-project-charter.md` (en yüksek)
2. `01-working-principles.md`
3. İlgili alan standardı (03-16)
4. ADR-001 → ADR-017
5. `36-canonical-stack-decision.md`
6. İlgili operasyonel belge (19-34)
7. `35-document-map.md` (navigasyon)
<!-- UPSTREAM-SYNC-END: Belge Otorite Hiyerarsisi -->

<!-- UPSTREAM-SYNC-START: Boilerplate-Project Sinirlari -->

## Boilerplate-Project Sınırları

- Derived project'ler boilerplate kurallarını `45-boilerplate-project-boundary-contract.md`'ye göre miras alır
- Zorunlu miras kuralları override edilemez
- Yapısal miras kuralları sıkılaştırılabilir ama gevşetilemez
- Kural sapmaları `44-exception-and-exemption-policy.md`'ye göre kaydedilmeli
- Upstream sync stratejisi: `49-upstream-sync-strategy.md`
<!-- UPSTREAM-SYNC-END: Boilerplate-Project Sinirlari -->

<!-- UPSTREAM-SYNC-START: Branching Stratejisi -->

## Branching Stratejisi

- Trunk-based development, kısa ömürlü feature branch'ler
- Branch isimlendirme: `feature/`, `fix/`, `hotfix/`, `release/`, `chore/`
- Stacked PR workflow: Büyük değişikliklerde zincirleme PR'lar kullanılabilir (graphite veya manuel rebase). Her PR bağımsız review ve CI alır.
- Merge queue: GitHub merge queue aktif. PR'lar direct merge yerine queue üzerinden birleştirilir — concurrent merge çakışmalarını önler.
- Detay: `42-branching-and-merge-strategy.md`
<!-- UPSTREAM-SYNC-END: Branching Stratejisi -->

<!-- UPSTREAM-SYNC-START: Guvenlik -->

## Güvenlik

- .env, credentials, secret dosyalarını context'e alma
- .claudeignore dosyasındaki path'lere uy
- Gerçek kullanıcı verisi içeren dosyalara dikkat et
- Auth token'ları log'lara yazılmaz
- Sentry payload'larında hassas veri bulunmamalı
<!-- UPSTREAM-SYNC-END: Guvenlik -->

<!-- PROJECT-SPECIFIC-START: Dil Kurallari -->

## Dil Kuralları

- Kod yorumları: Türkçe
- Commit mesajları: Türkçe
- Değişken/fonksiyon adları: İngilizce
- Doküman dili: Türkçe
<!-- PROJECT-SPECIFIC-END: Dil Kurallari -->
