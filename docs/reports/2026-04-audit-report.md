# Proje Denetleme Raporu — Nisan 2026

## Yönetici Özeti

| Metrik                  | Değer  |
| ----------------------- | ------ |
| **Toplam bulgu sayısı** | **62** |
| **Kritik**              | **14** |
| **Yüksek**              | **22** |
| **Orta**                | **18** |
| **Düşük**               | **8**  |

### Kritik Bulguların Özeti

| #   | Bulgu                                                                                            | Kategori |
| --- | ------------------------------------------------------------------------------------------------ | -------- |
| 1   | `eslint-plugin-bp` (19 kural) hiçbir config'e bağlanmamış — tüm custom lint kuralları devre dışı | Eksik    |
| 2   | `packages/config-eslint` paketi hiçbir workspace tarafından kullanılmıyor (ölü kod)              | Fazlalık |
| 3   | Mobile'da i18n altyapısı hiç kurulmamış — 30+ ekranda hardcoded string                           | Eksik    |
| 4   | Mobile'da `react-hook-form` + `Zod` yok — 8 form ekranı `useState` ile yazılmış                  | Eksik    |
| 5   | `@project/core` paketinde sıfır test (API client, hooks, validation)                             | Eksik    |
| 6   | `@project/ui` paketinde sıfır test (70+ component)                                               | Eksik    |
| 7   | Mobile app genelinde sıfır test dosyası (`--passWithNoTests` ile geçiyor)                        | Eksik    |
| 8   | 27 adet `as any` kullanımı — TypeScript strict mode ihlali                                       | Sorun    |
| 9   | `react-native-reanimated` catalog `^3.0.0` vs gerçek `4.2.1` (major fark)                        | Çelişki  |
| 10  | Mobile ekranlarda sıfır accessibility prop                                                       | Eksik    |
| 11  | Jest 29.x kullanılıyor, dokümantasyon Jest 30.x diyor                                            | Çelişki  |
| 12  | Storybook 8.x kullanılıyor, dokümantasyon Storybook 10.x diyor                                   | Çelişki  |
| 13  | Root ESLint vs config-eslint arasında ciddi kural farkları                                       | Çelişki  |
| 14  | `jest.config.js`'de yanlış key adı (`setupFilesAfterSetup`) — test setup çalışmıyor              | Sorun    |

---

## FAZ 1 — 2026 Trend Araştırması

### 1.1 Teknoloji Trendleri

| Trend                                | Açıklama                                  | Projeye Etki | Uygulanabilirlik                    |
| ------------------------------------ | ----------------------------------------- | ------------ | ----------------------------------- |
| **React Compiler**                   | Production-ready, otomatik memoization    | **Yüksek**   | Pilot uygulama zamanı geldi         |
| **React 19 `use()` hook + Suspense** | Asenkron veri yükleme standardı           | **Orta**     | TanStack Query ile uyumlu           |
| **Expo SDK 55+ / @expo/ui**          | Native UI bileşenleri, 1.0'a yaklaşıyor   | **Yüksek**   | Stable olduğunda entegre edilebilir |
| **Static Hermes**                    | AOT derleme, %30-50 startup iyileştirmesi | **Yüksek**   | ADR-018 ile uyumlu                  |
| **Tailwind CSS 4.x**                 | CSS-first config, Lightning CSS           | **Yüksek**   | Projede zaten 4.2.2                 |
| **NativeWind 5.x**                   | Tailwind 4.x React Native'e               | **Yüksek**   | Candidate track'te                  |
| **Vite + Rolldown**                  | Rust bundler, hızlı build                 | **Orta**     | Otomatik gelecek                    |
| **Biome 2.x**                        | ESLint + Prettier yerine tek araç         | **Düşük**    | Watchlist'te                        |
| **TypeScript 5.9**                   | Daha hızlı type-checking                  | **Orta**     | Zaten 5.9.3                         |
| **AI-Assisted Dev**                  | Vibe coding, agentic development          | **Yüksek**   | MoAI-ADK mevcut                     |
| **View Transitions API**             | Native-benzeri sayfa geçişleri            | **Orta**     | React Router 7.x ile mümkün         |
| **Passkeys/WebAuthn**                | Şifresiz auth standardı                   | **Yüksek**   | ADR-010'a eklenmeli                 |
| **Local-first / CRDTs**              | Yerel veri öncelikli mimari               | **Orta**     | ADR-019 temel oluşturuyor           |

### 1.2 Kullanıcı Davranış Trendleri

| Trend                 | Açıklama                       | Projeye Etki |
| --------------------- | ------------------------------ | ------------ |
| **Mobil trafik %65+** | Cross-platform zorunluluk      | **Yüksek**   |
| **EAA**               | WCAG 2.2 AA zorunlu            | **Yüksek**   |
| **INP < 200ms**       | Core Web Vitals evrimi         | **Yüksek**   |
| **Offline-first**     | Bağlantısız çalışma beklentisi | **Orta**     |
| **On-device AI**      | Uygulama içi kişiselleştirme   | **Orta**     |
| **KVKK sıkılaşması**  | Veri yerelleştirme artıyor     | **Yüksek**   |

### 1.3 Tasarım ve UX Trendleri

| Trend                     | Açıklama                   | Projeye Etki |
| ------------------------- | -------------------------- | ------------ |
| **Token-first design**    | W3C standardizasyonu       | **Yüksek**   |
| **Spring animations**     | Fizik tabanlı animasyonlar | **Orta**     |
| **Dark mode zorunluluğu** | %80+ tercih                | **Yüksek**   |
| **Spatial design**        | Vision Pro etkisi          | **Düşük**    |
| **Multimodal UI**         | Dokunma + ses + kamera     | **Düşük**    |

### 1.4 Sektör Trendleri

| Trend                     | Açıklama             | Projeye Etki |
| ------------------------- | -------------------- | ------------ |
| **Expo dominansı**        | EAS ekosistemi       | **Yüksek**   |
| **Supply chain security** | Bağımlılık güvenliği | **Yüksek**   |
| **Monorepo standardı**    | pnpm + Turborepo     | **Yüksek**   |
| **Green coding**          | W3C WSG              | **Düşük**    |
| **DMA etkisi**            | Alt. app store/ödeme | **Orta**     |

---

## FAZ 3 — Sorun ve Anomali Tespiti

### Sorunlar (S)

| #   | Bulgu                                                    | Dosya/Kapsam                           | Önem       |
| --- | -------------------------------------------------------- | -------------------------------------- | ---------- |
| S1  | `jest.config.js`'de yanlış key — test setup çalışmıyor   | `apps/mobile/jest.config.js`           | **Kritik** |
| S2  | 27 adet `as any` kullanımı                               | Mobile screens (21) + UI (6)           | **Kritik** |
| S3  | Web Sentry PII temizleme eksik                           | `apps/web/src/observability/sentry.ts` | **Orta**   |
| S4  | `globalThis as any` platform kontrolü                    | 4 dosya                                | **Orta**   |
| S5  | `checkSession` tip kontrolsüz                            | `apps/web/src/auth/session.ts`         | **Düşük**  |
| S6  | `@sentry/react-native: *` wildcard                       | `pnpm-workspace.yaml`                  | **Orta**   |
| S7  | Hardcoded `padding: 24`, `fontSize: 14` inline style'lar | Mobile 25+ ekran, UI 30+ dosya         | **Yüksek** |
| S8  | Hardcoded `rgba()` boxShadow                             | 4 UI component                         | **Orta**   |

### Çelişkiler (C)

| #   | Bulgu                                                   | Dosya/Kapsam                | Önem       |
| --- | ------------------------------------------------------- | --------------------------- | ---------- |
| C1  | reanimated catalog `^3.0.0` vs gerçek `4.2.1`           | catalog vs mobile           | **Kritik** |
| C2  | CLAUDE.md "Jest 30.x" vs gerçek 29.x                    | Dokümantasyon vs kod        | **Kritik** |
| C3  | CLAUDE.md "Storybook 10.x" vs gerçek 8.x                | Dokümantasyon vs kod        | **Kritik** |
| C4  | Root ESLint `no-console: error` vs config-eslint `warn` | İki config                  | **Yüksek** |
| C5  | Root ESLint'te TS kuralları, config-eslint'te yok       | İki config                  | **Kritik** |
| C6  | react exact vs react-dom range pin stratejisi           | catalog                     | **Orta**   |
| C7  | Mobile catalog bypass — doğrudan pin                    | `apps/mobile/package.json`  | **Yüksek** |
| C8  | `@playwright/test` vs catalog `playwright`              | Farklı paket adı            | **Düşük**  |
| C9  | UI tsconfig web-specific — cross-platform olmalı        | `packages/ui/tsconfig.json` | **Yüksek** |
| C10 | "Barrel yasak" kuralı vs UI barrel exports              | Kural vs uygulama           | **Düşük**  |
| C11 | `privacyDenylist` web/mobile farklı                     | Analytics dosyaları         | **Orta**   |

### Eksikler (E)

| #   | Bulgu                                       | Dosya/Kapsam               | Önem       |
| --- | ------------------------------------------- | -------------------------- | ---------- |
| E1  | Mobile i18n altyapısı yok                   | `apps/mobile/`             | **Kritik** |
| E2  | Mobile react-hook-form + Zod yok            | `apps/mobile/`             | **Kritik** |
| E3  | `@project/core` sıfır test                  | `packages/core/`           | **Kritik** |
| E4  | `@project/ui` sıfır test                    | `packages/ui/`             | **Kritik** |
| E5  | Mobile app sıfır test                       | `apps/mobile/`             | **Kritik** |
| E6  | Mobile sıfır accessibility prop             | 29 ekran                   | **Kritik** |
| E7  | Mobile'da @project/core dependency yok      | `apps/mobile/package.json` | **Yüksek** |
| E8  | Mobile'da @sentry/react-native yok          | `apps/mobile/package.json` | **Yüksek** |
| E9  | Quality component'lerde Storybook story yok | `packages/ui/src/quality/` | **Orta**   |
| E10 | Web auth testleri yok                       | `apps/web/src/auth/`       | **Yüksek** |
| E11 | Passkeys/WebAuthn desteği yok               | ADR-010                    | **Orta**   |
| E12 | View Transitions API yok                    | React Router entegrasyonu  | **Düşük**  |

### Fazlalıklar (F)

| #   | Bulgu                                           | Dosya/Kapsam                 | Önem       |
| --- | ----------------------------------------------- | ---------------------------- | ---------- |
| F1  | `packages/config-eslint` kullanılmıyor          | Ölü kod                      | **Kritik** |
| F2  | `eslint-plugin-bp` config'e bağlı değil         | 19 kural devre dışı          | **Kritik** |
| F3  | `react-native-web` mobile'da gereksiz           | `apps/mobile/package.json`   | **Orta**   |
| F4  | `react-dom` mobile'da gereksiz                  | `apps/mobile/package.json`   | **Düşük**  |
| F5  | `packages/testing` hiç kullanılmıyor            | 3 fonksiyon                  | **Orta**   |
| F6  | `@project/design-tokens` web'de import yok      | `apps/web/package.json`      | **Orta**   |
| F7  | turbo.json `.next/**` output — Next.js yok      | `turbo.json`                 | **Düşük**  |
| F8  | CSS + TS token çift kaynak — senkronizasyon yok | globals.css vs design-tokens | **Yüksek** |

### Karmaşık Noktalar (K)

| #   | Bulgu                                | Dosya/Kapsam                      | Önem       |
| --- | ------------------------------------ | --------------------------------- | ---------- |
| K1  | API client karmaşık + sıfır test     | `packages/core/src/api/client.ts` | **Yüksek** |
| K2  | AppLockScreen 250 satır inline style | UI quality                        | **Orta**   |
| K3  | ESLint config karmaşası (3 kaynak)   | Proje geneli                      | **Yüksek** |
| K4  | Navigation types karmaşıklığı        | Mobile navigation                 | **Düşük**  |

### Benzerlikler (B)

| #   | Bulgu                                  | Dosya/Kapsam                  | Önem       |
| --- | -------------------------------------- | ----------------------------- | ---------- |
| B1  | Analytics modülleri web/mobile tekrar  | Observability                 | **Yüksek** |
| B2  | Logger modülleri web/mobile tekrar     | Observability                 | **Yüksek** |
| B3  | Sentry PII temizleme birleştirilebilir | Observability                 | **Orta**   |
| B4  | Mobile ekran boilerplate tekrarı       | ScreenContainer kullanılmıyor | **Orta**   |
| B5  | ErrorFallback UI tekrarı               | Web + UI paketi               | **Düşük**  |
| B6  | `as any` cast pattern 21 kez           | TextField onChange            | **Yüksek** |
