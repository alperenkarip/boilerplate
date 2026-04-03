# Teknoloji Stack'i

## Genel Bakış

Bu proje, React ve React Native (Expo) üzerine kurulu cross-platform bir boilerplate'tir. Web tarafı Vite ile derlenen React SPA olarak, mobil taraf ise Expo SDK 55 üzerinde çalışan React Native uygulaması olarak konumlandırılmıştır. Tüm teknoloji seçimleri ADR-001'den ADR-019'a kadar uzanan mimari karar kayıtlarıyla kilitlenmiş olup alternatif öneri veya tartışma yasaktır.

Monorepo yapısı pnpm 10 ve Turborepo 2 ile yönetilmektedir. TypeScript 5.9 strict mode tüm platformlarda zorunludur. State yönetiminden test altyapısına, kimlik doğrulamadan gizlilik uyumuna kadar her katman için canonical bir seçim belirlenmiş ve governance dokümanlarıyla güvence altına alınmıştır.

---

## Runtime ve Framework'ler

| Teknoloji | Versiyon | Platform | ADR |
|-----------|----------|----------|-----|
| TypeScript | 5.9.3 | Tüm platformlar | — |
| React | 19.2.0 | Web + Mobile | ADR-001, ADR-002 |
| React DOM | 19.2.0 | Web | ADR-001 |
| React Native | ~0.83.0 | Mobile | ADR-002 |
| Expo SDK | ~55.0.0 | Mobile | ADR-002 |
| Vite | 8.0.0 | Web build aracı | ADR-001 |
| Turborepo | 2.9.3 | Monorepo orkestrasyon | ADR-003 |
| pnpm | 10.33.0 | Paket yöneticisi | ADR-003 |

Web runtime olarak React + Vite + React Router 7.x SPA-first yaklaşımla (ADR-001), mobil runtime olarak React Native + Expo SDK 55.x (ADR-002) seçilmiştir. Monorepo yönetimi pnpm 10.x + Turborepo 2.x kombinasyonuyla sağlanmaktadır (ADR-003). Güvenli kurulum için `minimumReleaseAge`, `allowBuilds` ve `trustPolicy` politikaları aktiftir.

---

## State Management

ADR-004 (client state) ve ADR-005 (server state) ile belirlenmiş iki katmanlı state mimarisi kullanılmaktadır. Client state için Zustand tercih edilmiş, server state, önbellekleme ve mutation yönetimi için TanStack Query benimsenmişdir. Veri çekme katmanında fetch-first yaklaşım varsayılan olup TanStack Query koşullu query-layer track'i ile uygulanmaktadır.

| Teknoloji | Versiyon | Amaç |
|-----------|----------|------|
| Zustand | 5.0.12 | Client state yönetimi |
| TanStack Query | 5.0.0 | Server state, önbellekleme, mutation |

---

## Forms ve Validation

ADR-006 ile belirlenmiş form katmanı, React Hook Form ve Zod'un birlikte kullanımına dayanmaktadır. Zod, schema authority olarak tanımlanmıştır; tüm validasyon kuralları Zod schema'larında merkezi olarak tutulur ve `@hookform/resolvers` aracılığıyla RHF ile entegre edilir.

| Teknoloji | Versiyon | Amaç |
|-----------|----------|------|
| React Hook Form | 7.72.0 | Form state yönetimi |
| Zod | 4.3.6 | Schema validasyonu (authority) |
| @hookform/resolvers | 5.2.2 | RHF + Zod entegrasyon köprüsü |

---

## Styling ve Design System

ADR-007 ile tanımlanan semantic token-first yaklaşım benimsenmiştir. Web'de Tailwind CSS 4.x, mobilde NativeWind 5.x candidate track kullanılmaktadır. Hardcoded renk, spacing veya font değerleri yasaktır; tüm değerler design token katmanından gelmelidir. NativeWind 5.x için bootstrap öncesinde release-status doğrulaması zorunludur.

| Teknoloji | Versiyon | Platform |
|-----------|----------|----------|
| Tailwind CSS | 4.2.2 | Web |
| NativeWind | 5.0.0 | Mobile (candidate track) |
| Design Tokens | Özel paket | Cross-platform |

Design token paketi `packages/design-tokens/` altında konumlandırılmıştır. Token çıktıları `docs/design-system/22-design-tokens-spec.md` katmanlarıyla eşleşmelidir.

---

## Navigation

ADR-012 ile platform bazlı navigasyon mimarisi belirlenmiştir. Web'de React Router 7.x, mobilde React Navigation 7.x kullanılmaktadır. Navigasyon kuralları ve pattern'ler için `docs/architecture/08-navigation-and-flow-rules.md` referans alınmalıdır.

| Teknoloji | Versiyon | Platform |
|-----------|----------|----------|
| React Router | 7.0.0 | Web |
| React Navigation | 7.2.2 | Mobile |

---

## Testing

ADR-008 ile üç katmanlı test piramidi tanımlanmıştır. Web birim ve component testleri için Vitest, mobil birim testleri için Jest, web E2E testleri için Playwright kullanılmaktadır. Component testing için her iki platformda da Testing Library tercih edilmiştir. Storybook, component lab ve canlı dokümantasyon ortamı olarak hizmet vermektedir.

| Teknoloji | Versiyon | Amaç |
|-----------|----------|------|
| Vitest | 4.1.2 | Web birim/component testleri |
| Jest | 29.7.0 | Mobile birim testleri |
| Playwright | 1.58.0 | Web E2E testleri |
| Testing Library React | 16.3.2 | Web component testing |
| Testing Library RN | 13.3.3 | Mobile component testing |
| Storybook | 8.6.18 | Component lab ve dokümantasyon |

Test dosyaları kaynak dosyanın yanında `*.test.ts(x)` uzantısıyla konumlandırılır. Minimum kapsam hedefi %85'tir.

---

## Observability

ADR-009 ile tanımlanan observability katmanı, Sentry tabanlı hata takibi ve vendor-agnostic analytics soyutlamasından oluşmaktadır. Web ve mobile için ayrı Sentry paketleri kullanılmakta, analytics katmanı ise belirli bir vendor'a bağımlı olmayan bir abstraction arkasında tutulmaktadır. Sentry payload'larında hassas veri bulundurulmamalıdır.

| Teknoloji | Platform | Amaç |
|-----------|----------|------|
| @sentry/react | Web | Hata takibi, performans izleme |
| @sentry/react-native | Mobile | Hata takibi, performans izleme |
| Custom analytics abstraction | Cross-platform | Vendor-agnostic analytics |
| Custom logger | Cross-platform | Merkezi logging katmanı |

---

## Auth ve Security

ADR-010 ile platform bazlı kimlik doğrulama mimarisi belirlenmiştir. Web'de backend tarafından yönetilen HttpOnly cookie'ler, mobilde Expo SecureStore şifreli depolama, destekleyici olarak da biyometrik kimlik doğrulama kullanılmaktadır. Auth token'ları kesinlikle log'lara yazılmamalıdır.

| Teknoloji | Platform | Amaç |
|-----------|----------|------|
| HttpOnly Cookies (backend-managed) | Web | Oturum yönetimi |
| expo-secure-store | Mobile | Şifreli yerel depolama |
| expo-local-authentication | Mobile | Biyometrik kimlik doğrulama |

Detay için: `docs/adr/ADR-010-...` ve `docs/quality/27-security-and-secrets-baseline.md`

---

## i18n

ADR-011 ile namespace tabanlı uluslararasılaştırma mimarisi belirlenmiştir. i18next 26.x framework olarak, react-i18next ise React binding olarak kullanılmaktadır. Inline user-facing string yasaktır; tüm metinler i18n key aracılığıyla yönetilmelidir.

| Teknoloji | Versiyon | Amaç |
|-----------|----------|------|
| i18next | 26.0.3 | i18n framework |
| react-i18next | 17.0.2 | React binding |

---

## Native Modules (Mobile)

Mobil platformda performans kritik yerel modüller kullanılmaktadır. Yerel depolama için MMKV canonical default olarak belirlenmiştir (ADR-019). Animasyon katmanı Reanimated 4.x ile sağlanmakta, hareket algılama Gesture Handler ile yönetilmektedir.

| Teknoloji | Versiyon | Amaç |
|-----------|----------|------|
| react-native-mmkv | 3.3.3 | Yüksek performanslı yerel depolama (canonical) |
| react-native-reanimated | 4.2.1 | Animasyon motoru |
| react-native-gesture-handler | ~2.30.1 | Jest algılama |
| react-native-screens | 4.23.0 | Native ekran container'ları |
| react-native-safe-area-context | 5.6.2 | Safe area yönetimi |

New Architecture (Fabric + JSI + TurboModules + Hermes V1) zorunludur ve kapatılamaz (ADR-018). Yerel depolama stratejisi için `docs/adr/ADR-019-local-storage-and-offline-first-strategy.md` referans alınmalıdır.

---

## Development Environment

**Zorunlu Sürüm Gereksinimleri:**

| Araç | Gereksinim |
|------|-----------|
| Node.js | >=20.19.0 <21.0.0 (LTS zorunlu) |
| pnpm | >=10.0.0 <11.0.0 |

**Geliştirme Araçları:**

| Araç | Versiyon | Amaç |
|------|----------|------|
| ESLint | 10.1.0 | Statik kod analizi (flat config) |
| Prettier | 3.8.1 | Kod formatlama |
| Husky | — | Pre-commit hook yönetimi |
| lint-staged | — | Commit öncesi staged dosya kontrolü |

TypeScript strict mode zorunludur; `any` tipi yasaktır. ESLint `disable` ve `@ts-ignore` kullanımı `44-exception-and-exemption-policy.md` kapsamında exception policy gerektirir.

---

## CI/CD Pipeline

GitHub Actions tabanlı otomasyon pipeline'ı dört iş akışından oluşmaktadır:

| Workflow | Tetikleyici | Kapsam |
|----------|-------------|--------|
| `ci.yml` | PR + push | typecheck → lint → test → build → security |
| `deploy.yml` | Main branch merge | Deployment otomasyonu |
| `scheduled-audit.yml` | Periyodik (cron) | Güvenlik taraması |
| Boundary check | CI içi | Import yönü doğrulama |
| expo-doctor | CI içi | SDK sağlık kontrolü |

Turborepo pipeline sırası: `build → typecheck → lint → test → verify`

expo-doctor temiz geçmeden SDK upgrade merge edilmez. Boundary check, import yönü kuralını (feature → shared OK, shared → feature YASAK) otomatik olarak doğrular.

---

## Build ve Deploy

**Web:**

- Geliştirme: `pnpm dev:web` (Vite dev server)
- Production build: Vite tabanlı statik çıktı

**Mobile:**

- Geliştirme: `pnpm dev:mobile` (Expo Go / development build)
- Production build: EAS Build (ADR-002)
- OTA güncelleme: EAS Update (ADR-015)

**Monorepo:**

- Orkestrasyon: Turborepo 2.x pipeline
- Komutlar: `pnpm build`, `pnpm typecheck`, `pnpm lint`, `pnpm test`

EAS Update stratejisi ve OTA uyumluluk etkisi için `docs/adr/ADR-015-ota-update-strategy.md` referans alınmalıdır. `runtimeVersion` değişikliği OTA uyumluluk etkisiyle birlikte değerlendirilir.

---

## Canonical Stack Referansları

Tüm teknoloji seçimleri aşağıdaki ADR'larla kilitlenmiştir. Alternatifleri tartışmak veya bypass etmek yasaktır:

| ADR | Konu |
|-----|------|
| ADR-001 | Web runtime (React + Vite + React Router 7.x, SPA-first) |
| ADR-002 | Mobile runtime (React Native + Expo SDK 55.x) |
| ADR-003 | Monorepo (pnpm 10.x + Turborepo 2.x) |
| ADR-004 | State management (Zustand 5.x) |
| ADR-005 | Data fetching (fetch-first + TanStack Query 5.x) |
| ADR-006 | Forms (React Hook Form 7.x + Zod 4.x) |
| ADR-007 | Styling/tokens (Tailwind CSS 4.x + NativeWind 5.x) |
| ADR-008 | Testing (Vitest 4.x + Jest 30.x + Playwright 1.58.x) |
| ADR-009 | Observability (Sentry + vendor-agnostic analytics) |
| ADR-010 | Auth (HttpOnly cookies + SecureStore + Biometric) |
| ADR-011 | i18n (i18next 26.x, namespace-based) |
| ADR-012 | Navigation (React Router 7.x web + React Navigation 7.x mobile) |
| ADR-013 | Push Notification (expo-notifications + FCM/APNs) |
| ADR-014 | Deep Linking (expo-linking + Universal Links + App Links) |
| ADR-015 | OTA Update (EAS Update) |
| ADR-016 | In-App Purchase (RevenueCat) |
| ADR-017 | Privacy/Compliance (GDPR + KVKK) |
| ADR-018 | New Architecture (Fabric + JSI + TurboModules + Hermes V1) |
| ADR-019 | Local Storage (MMKV + SecureStore + Zustand persist) |

**Governance dokümanları:**

- `docs/governance/36-canonical-stack-decision.md` — Canonical stack kararları
- `docs/governance/37-dependency-policy.md` — Dependency ekleme politikası
- `docs/governance/38-version-compatibility-matrix.md` — Versiyon uyumluluk matrisi
- `docs/governance/48-expo-sdk-upgrade-strategy.md` — SDK upgrade stratejisi
