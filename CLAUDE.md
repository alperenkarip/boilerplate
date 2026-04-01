# Boilerplate Proje Talimatları

## Proje Kimliği
- Cross-platform boilerplate: React + React Native (Expo)
- Monorepo: pnpm 10.x + Turborepo 2.x (ADR-003)
- Documentation-first, spec-first yaklaşım
- Apple HIG uyumlu, design system merkezli

## Canonical Kararlar — BUNLAR AÇILAMAZ
Bu kararlar ADR-001→ADR-012 ile birlikte `36-canonical-stack-decision.md`, `37-dependency-policy.md` ve `38-version-compatibility-matrix.md` tarafından kilitlenmiştir.
Alternatifleri tartışma, sorgulatma veya bypass etme.

- Web runtime: React + Vite + React Router 7.x, SPA-first (ADR-001)
- Mobil runtime: React Native + Expo SDK 55.x (ADR-002)
- Monorepo: pnpm 10.x + Turborepo 2.x (ADR-003)
- State management: Zustand 5.x (ADR-004)
- Data fetching: TanStack Query 5.x (ADR-005)
- Forms: React Hook Form 7.x + Zod 4.x (ADR-006)
- Styling/tokens: Tailwind CSS 4.x (web) + NativeWind 5.x candidate track (mobile), semantic token-first (ADR-007). Bootstrap öncesi release-status doğrulaması zorunludur.
- Testing: Vitest 4.x (web) + Jest 30.x (mobile) + Testing Library + Playwright 1.58.x E2E (ADR-008)
- Observability: Sentry + vendor-agnostic analytics abstraction (ADR-009)
- Auth: Backend-managed HttpOnly cookies (web) + Expo SecureStore (mobile) (ADR-010)
- i18n: i18next 26.x, namespace-based (ADR-011)
- Navigation: React Router 7.x (web) + React Navigation 7.x (mobile) (ADR-012)

## Dependency Kuralları
- Yeni dependency eklemeden önce docs/governance/37-dependency-policy.md kontrol et
- Versiyon uyumluluğu için docs/governance/38-version-compatibility-matrix.md kontrol et
- Canonical stack'teki kütüphanelerin alternatiflerini önerme

## MoAI-ADK Entegrasyonu
- Bu projede MoAI-ADK aktiftir: /moai komutları kullanılabilir
- SPEC-First: karmaşık görevlerde önce /moai plan ile SPEC oluştur
- TRUST 5 kalite kuralları geçerlidir
- Basit görevlerde (bug fix, küçük düzeltme) SPEC zorunlu değildir

## Stitch Entegrasyonu
- Stitch MCP aktiftir: tasarım verileri çekilebilir
- DESIGN.md dosyası varsa, component üretiminde referans al
- Token çıktılarını docs/design-system/22-design-tokens-spec.md katmanlarıyla eşle
- DESIGN.md 22-design-tokens-spec.md'nin türevdir; çelişki varsa 22 kazanır

## Dosya Organizasyonu
- Feature kodu: apps/{app}/src/features/{feature}/
- Shared package: packages/{package}/src/
- Test: kaynak dosya yanında *.test.ts(x)
- Design token: packages/design-tokens/
- Spec dokümanları: .moai/specs/
- Import yönü: feature → shared OK, shared → feature YASAK

## Referans Dokümanlar (Detay İçin Oku)
- Component governance → docs/design-system/23-component-governance-rules.md
- Platform adaptation → docs/design-system/26-platform-adaptation-rules.md
- Error/empty/loading states → docs/design-system/25-error-empty-loading-states.md
- Navigation patterns → docs/architecture/08-navigation-and-flow-rules.md
- Security baseline → docs/quality/27-security-and-secrets-baseline.md
- Accessibility → docs/quality/12-accessibility-standard.md
- Motion/interaction → docs/design-system/24-motion-and-interaction-standard.md
- Performance → docs/quality/13-performance-standard.md

## Kodlama Standartları
- TypeScript strict mode zorunlu — `any` tipi yasak
- Hardcoded renk, spacing, font değeri yasak — semantic token kullan
- Inline user-facing string yasak — i18n key kullan
- `eslint-disable` / `@ts-ignore` kullanımı exception policy gerektirir (44-exception-and-exemption-policy.md)
- Component isimlendirme: PascalCase, dosya adı ile eşleşmeli
- Test dosyası: `*.test.ts(x)` kaynak dosyanın yanında

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

## Belge Otorite Hiyerarşisi
Çelişki durumunda otorite sırası:
1. `00-project-charter.md` (en yüksek)
2. `01-working-principles.md`
3. İlgili alan standardı (03-16)
4. ADR-001 → ADR-012
5. `36-canonical-stack-decision.md`
6. İlgili operasyonel belge (19-34)
7. `35-document-map.md` (navigasyon)

## Boilerplate-Project Sınırları
- Derived project'ler boilerplate kurallarını `45-boilerplate-project-boundary-contract.md`'ye göre miras alır
- Zorunlu miras kuralları override edilemez
- Yapısal miras kuralları sıkılaştırılabilir ama gevşetilemez
- Kural sapmaları `44-exception-and-exemption-policy.md`'ye göre kaydedilmeli

## Branching Stratejisi
- Trunk-based development, kısa ömürlü feature branch'ler
- Branch isimlendirme: `feature/`, `fix/`, `hotfix/`, `release/`, `chore/`
- Detay: `42-branching-and-merge-strategy.md`

## Güvenlik
- .env, credentials, secret dosyalarını context'e alma
- .claudeignore dosyasındaki path'lere uy
- Gerçek kullanıcı verisi içeren dosyalara dikkat et
- Auth token'ları log'lara yazılmaz
- Sentry payload'larında hassas veri bulunmamalı

## Dil Kuralları
- Kod yorumları: Türkçe
- Commit mesajları: Türkçe
- Değişken/fonksiyon adları: İngilizce
- Doküman dili: Türkçe
