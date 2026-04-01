# Boilerplate Codex Talimatları

## Review Guidelines
- Canonical stack dışı dependency kullanımını P0 olarak işaretle
- `eslint-disable`, `@ts-ignore`, `any` type kullanımını flagle
- Component'lerin accessibility prop'larını kontrol et (role, aria-label, tabIndex)
- Design token yerine hardcoded renk/spacing kullanımını işaretle
- Platform-specific kodun doğru dizinde olduğunu kontrol et (apps/ vs packages/)
- Test dosyası olmayan yeni modülleri flagle
- Import yönlerini kontrol et: feature → shared OK, shared → feature YASAK
- packages/ → apps/ yönünde import varsa P0 olarak işaretle
- `--no-verify` ile commit, `it.skip`/`describe.skip` ile test bypass varsa flagle
- Secret pattern'leri tara (.env değerleri, API key'ler, credential'lar kodda olmamalı)

## Architecture Rules
- apps/ → packages/ yönünde bağımlılık OK
- packages/ → apps/ yönünde bağımlılık YASAK
- packages/ arası çapraz bağımlılık gerekçelendirilmeli
- Feature kodu apps/{app}/src/features/{feature}/ altında olmalı
- Shared kod packages/{package}/src/ altında olmalı
- "shared/common/utils/lib" belirsiz klasörler oluşturulmamalı

## Testing Requirements
- Yeni utility/hook: birim testi zorunlu
- Yeni component: render testi zorunlu
- Yeni API entegrasyonu: integration testi zorunlu
- Test dosyası kaynak dosya yanında: *.test.ts(x)

## Canonical Stack (DO NOT suggest alternatives)
- Web: React + Vite + React Router 7.x
- Mobile: React Native + Expo SDK 55.x
- Monorepo: pnpm 10.x + Turborepo 2.x
- Install Security: pnpm minimumReleaseAge + allowBuilds + trustPolicy
- State: Zustand 5.x
- Data: fetch-first default + TanStack Query 5.x conditional query-layer track
- Forms: React Hook Form 7.x + Zod 4.x schema authority
- Styling: Tailwind CSS 4.x + NativeWind 5.x candidate track (bootstrap öncesi release-status doğrulaması zorunlu)
- Testing: Vitest 4.x + Jest 30.x + Playwright 1.58.x
- Component Lab: Storybook 10.x + Storybook Test (web)
- Observability: Sentry
- Watchlist: React Compiler controlled opt-in + Biome 2.x pilot/watchlist
- Auth: HttpOnly cookies (web) + Expo SecureStore (mobile)
- i18n: i18next 26.x
- Navigation: React Router 7.x (web) + React Navigation 7.x (mobile)

## Design Token Rules
- Hardcoded renk değerleri yerine semantic token kullan
- Hardcoded spacing yerine spacing scale token kullan
- Hardcoded tipografi yerine typography token kullan
- Token isimlendirme: docs/design-system/22-design-tokens-spec.md kurallarına uy

## Security Rules
- `.env` değerinin koda hardcode edilmesi — REDDET
- `console.log` ile hassas veri yazdırılması (token, email, password) — REDDET
- API key, token, şifre gibi değerlerin string literal olması — REDDET
- Auth token'ların log/analytics/debug çıktısına sızması — REDDET
- `--no-verify` ile commit bypass — REDDET

## Exception Policy
- Kural ihlali gerekiyorsa `44-exception-and-exemption-policy.md`'ye göre kayıt oluştur
- Exception olmadan `eslint-disable` kullanımı kabul edilmez
- `tooling/governance/exception-template.yaml` şablonunu kullan

## Boundary Contract
- Boilerplate kuralları `45-boilerplate-project-boundary-contract.md`'ye göre miras alınır
- Zorunlu miras kuralları (canonical stack, dependency policy, a11y baseline) override edilemez
- Yapısal miras kuralları sıkılaştırılabilir, gevşetilemez

## Branching Rules
- Trunk-based development: `42-branching-and-merge-strategy.md`
- `main` branch'e direct push YASAK
- Feature branch max 2-3 gün ömürlü
- Squash merge varsayılan

## Guardrail Compliance Review
AI araçlarının ürettiği kodun `docs/ai-guardrails/` altındaki guardrail kurallarına uyumunu denetle.
Guardrail çerçevesi: `docs/governance/47-ai-guardrail-governance.md`

### Universal Guardrail İhlalleri → P0
- Hardcoded renk/spacing/font değeri (D-DSY ihlali)
- `any` type kullanımı
- Import yönü ihlali (shared → feature, packages → apps)
- Inline user-facing string (D-I18 ihlali)
- Secret/credential kodda açık metin

### Domain Guardrail İhlalleri → P0/P1
- Component'te a11y role/label eksikliği (D-A11) → P0
- Touch target minimum ihlali (D-UIX) → P0
- Safe area ihlali (D-UIX) → P0
- Semantic token yerine raw color kullanımı (D-DSY) → P0
- Form'da schema-first validation eksikliği (D-FRM) → P1
- Firebase güvenlik kuralı eksikliği (D-FIR) → P1
- Reduced motion guard eksikliği (D-MOT) → P1
- Error/empty/loading state eksikliği (D-ERR) → P1
- Navigation back davranışı belirsizliği (D-NAV) → P1

### Aktivite Guardrail Uyumsuzluğu → P1
- Yeni component + component governance (23) uyumsuzluğu
- Yeni ekran + SPEC eksikliği (karmaşıklık >= 5)
- Yeni ekran + error/empty/loading state eksikliği
- Dependency ekleme + dependency policy (37) onaysız
- Refactoring + mevcut test coverage azalması
- Config değişikliği + pipeline kırılma riski değerlendirmesi eksik
- Auth değişikliği + security baseline (27) uyumsuzluğu

### Yaşam Döngüsü Uyumsuzluğu → P1/P2
- PR'da DoD (32) kontrol listesi eksik → P1
- Exception süresi dolmuş (44) → P1
- Boundary contract manifest (BOUNDARY.md) güncel değil → P1
- Guardrail dokümanı ile kaynak doküman arasında sapma → P2

### Rapor Formatı
Her bulgu şu yapıda raporlanmalı:
1. **Severity**: P0 / P1 / P2
2. **Guardrail Referansı**: Domain ID + kural (örn: D-DSY §2.3)
3. **Kaynak Doküman**: İlgili boilerplate dokümanı (örn: 22-design-tokens-spec.md)
4. **Dosya ve Satır**: Etkilenen konum
5. **İhlal Açıklaması**: Ne yanlış
6. **Düzeltme Önerisi**: Ne yapılmalı
