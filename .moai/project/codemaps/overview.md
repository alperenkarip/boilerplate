# Mimari Genel Bakış

Son güncelleme: 2026-04-03
Versiyon: 1.0.0

---

## Proje Kimliği

Cross-platform boilerplate: React 19 (web) + React Native / Expo SDK 55 (mobile).
Tek bir pnpm monorepo içinde hem web hem de mobil uygulamaları barındırır; ortak paketler `packages/` altında paylaşılır.

---

## Monorepo Stratejisi

**Araç Zinciri:** pnpm 10.x + Turborepo 2.x (ADR-003)

Turborepo görev bağımlılık grafı:
```
typecheck → lint → test → build
```

Turborepo uzak önbelleği etkinleştirildiğinde değişmeyen paketlerin çıktıları yeniden hesaplanmaz; bu durum CI süresini önemli ölçüde kısaltır.

**Workspace Organizasyonu:**

| Alan | Yol | Amaç |
|------|-----|-------|
| Web uygulaması | `apps/web` | React + Vite + React Router 7 SPA |
| Mobile uygulama | `apps/mobile` | React Native + Expo SDK 55 |
| UI bileşen kütüphanesi | `packages/ui` | 85+ cross-platform bileşen |
| Paylaşılan çekirdek | `packages/core` | Auth tipleri, doğrulama, API sözleşmeleri |
| Tasarım token sistemi | `packages/design-tokens` | Semantic token hiyerarşisi |
| Test yardımcıları | `packages/testing` | Ortak test kurulumları |
| TypeScript yapılandırma | `packages/config-typescript` | Baz, web, mobile ve library tsconfig'leri |
| ESLint yapılandırma | `packages/config-eslint` | Flat config, platform-bazlı kurallar |

**Güvenlik Politikası (pnpm):**
- `minimumReleaseAge`: yeni paketler olgunlaşmadan eklenmez
- `allowBuilds` ve `trustPolicy`: postinstall saldırı yüzeyi azaltılmıştır

---

## Temel Tasarım Örüntüleri

### Feature-Based Mimarisi
Uygulama kodu özellik dilimlerine (feature slice) ayrılmıştır:
```
apps/{app}/src/features/{feature}/
```
Her dilim bağımsız sayfa, hook, servis ve test dosyalarını içerir. Özellikler arası doğrudan import yapılmaz; paylaşılan kod `packages/` altına taşınır.

### Component-Driven Geliştirme
`packages/ui` bileşenleri Storybook 10.x üzerinde izole geliştirilen, token kullanan atomik birimlerdir. Platform farklılıkları `Platform.OS` ve NativeWind koşullu sınıflarıyla kapsüllenir.

### Token-First Stilizasyon
Renk, boşluk, tipografi ve hareket değerleri `packages/design-tokens` içinde ham → semantic → tema katmanlarından geçerek üretilir. Hardcoded değer kullanımı yasaktır (bkz. `docs/design-system/22-design-tokens-spec.md`).

### Documentation-First & Spec-First
Karmaşık görevler önce SPEC belgesi üretilerek `.moai/specs/` altında kayıt altına alınır. ADR'lar (`docs/adr/`) her mimarî kararın gerekçesini ve alternatifleri belgeler.

---

## Sistem Sınırları

```
┌────────────────────────────────────────┐
│              MONOREPO                  │
│                                        │
│  ┌──────────┐    ┌──────────────────┐  │
│  │ apps/web │    │  apps/mobile     │  │
│  │ React 19 │    │  Expo SDK 55     │  │
│  └────┬─────┘    └────────┬─────────┘  │
│       │                   │            │
│       └──────────┬────────┘            │
│                  ▼                     │
│  ┌──────────────────────────────────┐  │
│  │          packages/               │  │
│  │  ui | core | design-tokens      │  │
│  │  testing | config-*             │  │
│  └──────────────────────────────────┘  │
└────────────────────────────────────────┘
```

**Import Yönü Kuralları:**
- `apps → packages` — SERBEST
- `packages/ui → packages/design-tokens` — SERBEST
- `packages → apps` — YASAK
- `apps ↔ apps` — YASAK

Bu kurallar `boundary-check` guardrail'i ve CI aşamasındaki boundary görevi tarafından otomatik denetlenir.

---

## Teknoloji Karar Referansları

| Alan | Karar | ADR |
|------|-------|-----|
| Web runtime | React + Vite + React Router 7, SPA-first | ADR-001 |
| Mobile runtime | React Native + Expo SDK 55 | ADR-002 |
| Monorepo | pnpm 10.x + Turborepo 2.x | ADR-003 |
| State yönetimi | Zustand 5.x | ADR-004 |
| Veri çekme | fetch-first + TanStack Query 5.x | ADR-005 |
| Form yönetimi | React Hook Form 7.x + Zod 4.x | ADR-006 |
| Stilizasyon | Tailwind CSS 4.x (web) + NativeWind 5.x (mobile) | ADR-007 |
| Test | Vitest 4.x + Jest 30.x + Playwright 1.58.x | ADR-008 |
| Observability | Sentry + vendor-agnostic analytics | ADR-009 |
| Auth | HttpOnly cookies (web) + SecureStore + Biometric (mobile) | ADR-010 |
| i18n | i18next 26.x, namespace-based | ADR-011 |
| Navigation | React Router 7.x (web) + React Navigation 7.x (mobile) | ADR-012 |
| Push bildirim | expo-notifications + FCM/APNs | ADR-013 |
| Deep linking | expo-linking + Universal Links + App Links | ADR-014 |
| OTA güncelleme | EAS Update | ADR-015 |
| Uygulama içi satın alma | RevenueCat | ADR-016 |
| Gizlilik uyum | GDPR + KVKK | ADR-017 |
| New Architecture | Fabric + JSI + TurboModules + Hermes V1 | ADR-018 |
| Yerel depolama | MMKV + SecureStore + Zustand persist | ADR-019 |

Tam liste ve bağlam: `docs/adr/` ve `docs/governance/36-canonical-stack-decision.md`

---

## CI/CD Boru Hattı Özeti

```
repo-mode → docs-sanity → setup → typecheck → lint → test
         → build → expo-doctor → boundary → security
```

Her aşama başarısız olduğunda sonraki aşamalar durdurulur. `boundary` aşaması import yönü kurallarını, `security` aşaması ise OWASP temel kontrol listesini doğrular.

---

## İlgili Belgeler

- `docs/governance/36-canonical-stack-decision.md` — Kanonical yığın kararları
- `docs/governance/37-dependency-policy.md` — Bağımlılık ekleme politikası
- `docs/governance/38-version-compatibility-matrix.md` — Versiyon uyumluluk matrisi
- `docs/adr/` — Tüm mimarî karar kayıtları (ADR-001 → ADR-019)
- `docs/governance/47-ai-guardrail-governance.md` — AI guardrail yönetişimi
