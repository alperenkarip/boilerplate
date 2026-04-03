# Proje: Boilerplate (Cross-Platform)

## Açıklama

Bu proje, React (web) ve React Native/Expo (mobil) platformları için documentation-first, spec-first yaklaşımlı bir cross-platform uygulama altyapısıdır. Apple HIG uyumlu, design system merkezli mimarisi ile kurumsal standartlarda proje temeli sunmaktadır.

Proje, web ve mobil için tek bir monorepo yapısı altında yönetilen, ölçeklenebilir bileşen kütüphanesi, kapsamlı kimlik doğrulama altyapısı ve çoklu dil desteği içermektedir. Geliştirme sürecinin her aşamasında kalite güvencesi sağlayan test altyapıları, CI/CD boru hatları ve AI destekli guardrail sistemi ile donatılmıştır.

Boilerplate, geliştirme ekiplerine temelden başlamak yerine kanıtlanmış mimari kararlar üzerine inşa edilmiş, 130'dan fazla dokümana ve 20 ADR'e dayanan, kurumsal düzeyde bir başlangıç noktası sunmaktadır.

## Hedef Kitle

- **Geliştirici ekipler**: Web ve mobil platformlarda eş zamanlı uygulama geliştirmek isteyen, tutarlı bir kod tabanı ve standartlar arayan takımlar
- **Enterprise organizasyonlar**: Yüksek kalite standartları, ölçeklenebilir proje yapısı ve kapsamlı dokümantasyon gerektiren kurumsal yapılar
- **Startup'lar**: Hızlı MVP çıkışı yapabilmek için hazır, üretim kalitesinde altyapıya ihtiyaç duyan erken aşama şirketler

## Temel Özellikler

1. **Cross-Platform Mimari**: React 19 (web) ve Expo SDK 55 (mobil) ile tek monorepo üzerinden her iki platformu hedefleyen yapı; pnpm 10 ve Turborepo 2 ile workspace yönetimi
2. **Design System**: 85'ten fazla component (60+ üretim, 25+ primitif), design token sistemi ve light/dark tema desteği; Tailwind CSS 4 (web) ve NativeWind 5 (mobil) ile semantic token-first yaklaşım
3. **Auth Sistemi**: HttpOnly cookies (web) ve Expo SecureStore ile biometric kimlik doğrulama (mobil); çok adımlı auth akışı ve ADR-010 ile kilitlenen güvenli yapı
4. **State Management**: Zustand 5 (client state) ve TanStack Query 5 (server state); MMKV ile performanslı local storage ve Zustand persist entegrasyonu
5. **Form Yönetimi**: React Hook Form 7 ile Zod 4 schema validation; tip güvenli form altyapısı
6. **i18n Desteği**: i18next 26 ile namespace-based çoklu dil desteği (Türkçe ve İngilizce)
7. **Observability**: Sentry entegrasyonu ile hata takibi ve performans izleme; vendor-bağımsız analytics soyutlama katmanı
8. **Navigation**: React Router 7 (web) ve React Navigation 7 (mobil) ile platform uyumlu yönlendirme
9. **Testing Altyapısı**: Vitest (web unit), Jest (mobil unit) ve Playwright (E2E) ile kapsamlı test örtüsü; Storybook 10 ile component lab
10. **CI/CD Pipeline**: GitHub Actions ile typecheck, lint, test, build ve güvenlik denetimi otomasyonu
11. **Push Notification**: expo-notifications ve FCM/APNs entegrasyonu
12. **Deep Linking**: expo-linking, Universal Links ve App Links desteği
13. **OTA Update**: EAS Update ile anlık güncelleme altyapısı
14. **In-App Purchase**: RevenueCat (react-native-purchases) ile abonelik yönetimi
15. **AI Guardrail Sistemi**: 47-ai-guardrail-governance.md kapsamında otomatik tetiklenen guardrail kontrolleri; 130'dan fazla doküman ve 20 ADR

## Kullanım Senaryoları

- Yeni bir cross-platform mobil ve web uygulaması başlatmak
- Enterprise-grade altyapı ile hızlı MVP geliştirmek ve üretime hazır temelden yararlanmak
- Tutarlı design system ile web ve mobil arayüzleri tek kod tabanında oluşturmak
- Kapsamlı dokümantasyon ve kalite standartları ile büyüyen geliştirici ekiplerini ölçeklendirmek
- Spec-first, documentation-first yaklaşımla yapılandırılmış ürün geliştirme süreci yürütmek

## Platform Desteği

### Web

- **Runtime**: React 19 + Vite + React Router 7, SPA-first mimarisi (ADR-001)
- **Styling**: Tailwind CSS 4, semantic token-first yaklaşım
- **Auth**: HttpOnly cookie tabanlı oturum yönetimi
- **Test**: Vitest 4 (unit) + Playwright (E2E) + Storybook 10 (component lab)
- **Deploy**: GitHub Actions CI/CD pipeline

### Mobile

- **Runtime**: React Native + Expo SDK 55, New Architecture (Fabric + JSI + TurboModules + Hermes V1) zorunlu (ADR-018)
- **Styling**: NativeWind 5, design token uyumlu
- **Auth**: Expo SecureStore + Biometric (expo-local-authentication)
- **Test**: Jest 30 (unit) + Detox/E2E
- **Deploy**: EAS Build + EAS Update (OTA)
- **Ek Altyapı**: Push notification, deep linking, in-app purchase, biometric auth
