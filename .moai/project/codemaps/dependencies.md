# Bağımlılık Grafiği

Son güncelleme: 2026-04-03
Versiyon: 1.0.0

---

## Workspace İçi Bağımlılık Grafiği

Oklar bağımlılık yönünü gösterir (A → B: A, B'yi kullanır).

```
apps/web ──────────────────────────────────────┐
  │                                             │
  ├──→ packages/ui ──→ packages/design-tokens  │
  ├──→ packages/core                            │
  └──→ packages/testing (dev)                  │
                                               │
apps/mobile ───────────────────────────────────┘
  │
  ├──→ packages/ui ──→ packages/design-tokens
  ├──→ packages/core
  └──→ packages/testing (dev)

packages/ui ──→ packages/design-tokens
packages/ui ──→ packages/config-typescript (dev)
packages/ui ──→ packages/config-eslint (dev)

packages/core ──→ packages/config-typescript (dev)

packages/testing ──→ packages/config-typescript (dev)
```

**Yasaklı Yönler:**
- `packages/* → apps/*` — Ters bağımlılık yasaktır
- `apps/web → apps/mobile` — Uygulama çapraz bağımlılığı yasaktır
- `apps/mobile → apps/web` — Uygulama çapraz bağımlılığı yasaktır

Bu kurallar CI'da `boundary` görevi ve `boundary-check` skill'i tarafından otomatik denetlenir.

---

## pnpm Catalog Yapısı

Versiyon tekilliliğini (single source of truth) sağlamak için pnpm workspace catalog kullanılır. Tüm kritik bağımlılık versiyonları `pnpm-workspace.yaml` içindeki `catalog:` bloğunda merkezi olarak tanımlanır.

```yaml
# pnpm-workspace.yaml (örnek yapı)
catalog:
  react: "^19.0.0"
  react-native: "^0.79.0"
  typescript: "^5.8.0"
  zustand: "^5.0.0"
  "@tanstack/react-query": "^5.0.0"
  ...
```

Paket `package.json` dosyalarında `"react": "catalog:"` şeklinde referans verilir; böylece monorepo genelinde versiyon tutarlılığı garantilenir.

---

## Runtime Bağımlılıkları

### Temel Çerçeveler

| Paket | Versiyon | Platform | ADR |
|-------|----------|----------|-----|
| react | 19.x | web + mobile | ADR-001/002 |
| react-native | 0.79.x | mobile | ADR-002 |
| expo | SDK 55.x | mobile | ADR-002 |
| vite | 6.x | web | ADR-001 |
| react-router-dom | 7.x | web | ADR-001/012 |
| @react-navigation/native | 7.x | mobile | ADR-012 |

### State ve Veri Yönetimi

| Paket | Versiyon | Amaç | ADR |
|-------|----------|-------|-----|
| zustand | 5.x | Global state | ADR-004 |
| @tanstack/react-query | 5.x | Sunucu state | ADR-005 |
| react-hook-form | 7.x | Form state | ADR-006 |
| zod | 4.x | Şema doğrulama | ADR-006 |

### Stilizasyon

| Paket | Versiyon | Platform | ADR |
|-------|----------|----------|-----|
| tailwindcss | 4.x | web | ADR-007 |
| nativewind | 5.x (candidate) | mobile | ADR-007 |

### Auth ve Güvenlik

| Paket | Versiyon | Platform | ADR |
|-------|----------|----------|-----|
| expo-secure-store | latest | mobile | ADR-010 |
| expo-local-authentication | latest | mobile | ADR-010 |

### Uluslararasılaştırma

| Paket | Versiyon | Platform | ADR |
|-------|----------|----------|-----|
| i18next | 26.x | web + mobile | ADR-011 |
| react-i18next | latest | web + mobile | ADR-011 |

### Observability

| Paket | Versiyon | Platform | ADR |
|-------|----------|----------|-----|
| @sentry/react | latest | web | ADR-009 |
| @sentry/react-native | latest | mobile | ADR-009 |

### Mobile Platform Özellikleri

| Paket | Versiyon | Amaç | ADR |
|-------|----------|-------|-----|
| expo-notifications | latest | Push bildirim | ADR-013 |
| expo-linking | latest | Deep linking | ADR-014 |
| react-native-mmkv | latest | Yerel depolama | ADR-019 |
| react-native-purchases | latest | Uygulama içi satın alma | ADR-016 |

---

## Geliştirme Bağımlılıkları

### Test Araçları

| Paket | Versiyon | Platform | ADR |
|-------|----------|----------|-----|
| vitest | 4.x | web | ADR-008 |
| jest | 30.x | mobile | ADR-008 |
| @testing-library/react | latest | web | ADR-008 |
| @testing-library/react-native | latest | mobile | ADR-008 |
| playwright | 1.58.x | E2E | ADR-008 |

### Bileşen Geliştirme

| Paket | Versiyon | Amaç |
|-------|----------|-------|
| storybook | 10.x | Bileşen lab |
| @storybook/test | latest | Storybook test |

### Kod Kalitesi

| Paket | Versiyon | Amaç |
|-------|----------|-------|
| typescript | 5.x | Tip güvenliği |
| eslint | 9.x | Lint (flat config) |
| prettier | latest | Kod formatlama |

---

## Kritik Bağımlılık Politikaları

**Yeni Bağımlılık Ekleme:** `docs/governance/37-dependency-policy.md` kontrol edilmeden ekleme yapılamaz.

**Versiyon Uyumluluğu:** `docs/governance/38-version-compatibility-matrix.md` referans alınır.

**SDK Yükseltme:** Major Expo SDK yükseltmeleri `docs/governance/48-expo-sdk-upgrade-strategy.md` protokolünü takip eder; `expo-doctor` temiz geçmeden merge edilmez.

**İzleme Listesi (Watchlist):**
- React Compiler — kontrollü opt-in
- Biome 2.x — pilot/watchlist aşamasında
- @expo/ui 1.0 — stable bekleniyor
