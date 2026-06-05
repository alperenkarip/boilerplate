# Bağımlılık Grafiği

Son güncelleme: 2026-06-05
Versiyon: 1.1.0

---

## Workspace İçi Bağımlılık Grafiği

Oklar bağımlılık yönünü gösterir (A → B: A, B'yi kullanır).

```
apps/web ──────────────────────────────────────────────────────────┐
  │                                                                │
  ├──→ packages/ui ──→ packages/design-tokens                     │
  ├──→ packages/core                                              │
  └──→ packages/testing (dev)                                     │
                                                                  │
apps/mobile ────────────────────────────────────────────────────── ┘
  │
  ├──→ packages/ui ──→ packages/design-tokens
  ├──→ packages/core
  └──→ packages/testing (dev)

packages/ui ──→ packages/design-tokens
packages/ui ──→ packages/config-typescript (dev)
packages/ui ──→ packages/config-eslint (dev)

packages/core ──→ packages/config-typescript (dev)

packages/testing ──→ packages/config-typescript (dev)

packages/design-tokens (bağımlılık yok — pure data)

packages/eslint-plugin-bp (bağımlılık yok — ESLint 9 peer only)
packages/config-eslint ──→ packages/eslint-plugin-bp (dahili kullanım)

Root eslint.config.js ──→ packages/config-eslint + packages/eslint-plugin-bp
```

**Döngüsel Bağımlılık Kontrolü:** Yok. Yukarıdaki graf yönlü ve asiklik (DAG) yapıdadır. Turborepo görev grafı da döngüsel bağımlılığı CI'da engeller.

**Yasaklı Yönler:**

| Yön | Durum | Zorunlu Kılan |
|-----|-------|---------------|
| `packages/* → apps/*` | YASAK | `no-direct-repo-import` ESLint kuralı |
| `apps/web → apps/mobile` | YASAK | `no-direct-repo-import` ESLint kuralı |
| `apps/mobile → apps/web` | YASAK | `no-direct-repo-import` ESLint kuralı |
| `packages/ui → packages/core` | YASAK | `no-direct-repo-import` ESLint kuralı |

Bu kurallar CI'da `boundary` görevi ve `eslint-plugin-bp no-direct-repo-import` kuralı tarafından otomatik denetlenir.

---

## pnpm Catalog Yapısı

Versiyon tekilliliğini sağlamak için pnpm workspace catalog kullanılır. Tüm kritik bağımlılık versiyonları `pnpm-workspace.yaml` içindeki `catalog:` bloğunda merkezi olarak tanımlanır.

```yaml
# pnpm-workspace.yaml catalog bloğu (örnekler)
catalog:
  react: "19.2.0"
  react-dom: "19.2.0"
  react-native: "~0.83"
  vite: "8.x"
  vitest: "4.x"
  react-router-dom: "7.x"
  zustand: "5.x"
  "@tanstack/react-query": "5.x"
  react-hook-form: "7.x"
  zod: "4.x"
  i18next: "26.x"
  tailwindcss: "4.x"
  nativewind: "5.x"
  "react-native-mmkv": "3.3.3"
  "react-native-reanimated": "4.x"
  expo: "~55.x"
  "@sentry/react": "10.x"
  "@sentry/react-native": "10.x"
  playwright: "1.58.x"
```

Paket `package.json` dosyalarında `"react": "catalog:"` şeklinde referans verilir; bu sayede monorepo genelinde versiyon tutarlılığı garantilenir.

---

## Runtime Bağımlılıkları

### Temel Çerçeveler

| Paket | Versiyon | Platform | ADR |
|-------|----------|----------|-----|
| react | 19.2.0 | web + mobile | ADR-001/002 |
| react-dom | 19.2.0 | web | ADR-001 |
| react-native | ~0.83 | mobile | ADR-002 |
| expo | SDK 55.x | mobile | ADR-002 |
| vite | 8.x | web | ADR-001 |
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
| nativewind | 5.x | mobile | ADR-007 |

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

**i18n namespace'leri:** common, shell, auth, validation — her biri tr ve en için ayrı JSON dosyaları.

### Observability

| Paket | Versiyon | Platform | ADR |
|-------|----------|----------|-----|
| @sentry/react | 10.x | web | ADR-009 |
| @sentry/react-native | 10.x | mobile | ADR-009 |

### Mobile Platform Özellikleri

| Paket | Versiyon | Amaç | ADR |
|-------|----------|-------|-----|
| expo-notifications | latest | Push bildirim | ADR-013 |
| expo-linking | latest | Deep linking | ADR-014 |
| react-native-mmkv | 3.3.3 | Yerel depolama | ADR-019 |
| react-native-reanimated | 4.x | Animasyon | ADR-018 |
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
| jest-expo | latest | mobile (preset) | ADR-008 |

### Bileşen Geliştirme

| Paket | Versiyon | Amaç |
|-------|----------|-------|
| storybook | 10.x | Bileşen lab |
| @storybook/react-vite | latest | Vite entegrasyon |
| @storybook/test | latest | Storybook test |

### Kod Kalitesi

| Paket | Versiyon | Amaç |
|-------|----------|-------|
| typescript | 5.x | Tip güvenliği |
| eslint | 9.x | Lint (flat config) |
| prettier | latest | Kod formatlama |
| @project/eslint-plugin-bp | workspace | 19 proje-özgü kural |

---

## Kritik Bağımlılık Politikaları

**Yeni Bağımlılık Ekleme:** `docs/governance/37-dependency-policy.md` kontrol edilmeden ve `dep-check` skill'i çalıştırılmadan ekleme yapılamaz.

**Versiyon Uyumluluğu:** `docs/governance/38-version-compatibility-matrix.md` referans alınır.

**SDK Yükseltme:** Major Expo SDK yükseltmeleri `docs/governance/48-expo-sdk-upgrade-strategy.md` protokolünü takip eder; `expo-doctor` temiz geçmeden merge edilmez.

**İzleme Listesi (Watchlist):**
- React Compiler — kontrollü opt-in
- Biome 2.x — pilot/watchlist aşamasında
- @expo/ui 1.0 — stable bekleniyor
