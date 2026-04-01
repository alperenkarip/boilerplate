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
- State: Zustand 5.x
- Data: TanStack Query 5.x
- Forms: React Hook Form 7.x + Zod 4.x
- Styling: Tailwind CSS 4.x + NativeWind 5.x
- Testing: Vitest 4.x + Jest 30.x + Playwright 1.58.x
- Observability: Sentry
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
