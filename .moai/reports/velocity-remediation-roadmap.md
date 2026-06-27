# Velocity Remediation — SPEC Yol Haritası (Plan Aşaması Taslağı)

Kaynak: 2026-06-05 velocity audit + tema bazlı derin research (8 tema, 9 ajan).
Durum: PLAN TASLAĞI — gerçek SPEC dosyaları (.moai/specs/) kullanıcı onayından sonra yazılacak.
Ürün amacı lensi: time-to-product (fikri hızlı ürüne dökme, hızlı üretime geçme).

---

## Cross-Platform Stratejik Kararı (KİLİT)

**Karar: Yol B — RN-native primitive seti + `.native.tsx`/`.web.tsx` platform-split** (paylaşılan `.types.ts` prop interface).
**Yol A (react-native-web köprüsü) REDDEDİLDİ.**

Gerekçe (kanıtlı):
- `apps/web` Tailwind CSS 4 kurulu ve çalışır (`apps/web/package.json:20` `@tailwindcss/vite ^4.2.2`, `globals.css:1` `@import 'tailwindcss'`). react-native-web `StyleSheet` paradigması bu çalışan web stack'iyle çakışır, ADR-007 (web=Tailwind) kararını bozar, web bundle'a ~100KB+ runtime ekler, 28 web sayfasını re-test gerektirir — yüksek regresyon, sıfır kazanç.
- Yol B'de web **olduğu gibi kalır** (CSS variable + Tailwind), mobile `.native.tsx` eklenir; aynı semantic token (`packages/design-tokens` `SemanticTokenSet`, fan_in=5) iki platformda farklı tüketimle okunur (web: `var(--color)` / mobil: `useTheme().tokens` JS-objesi).
- NativeWind v5 (Haziran 2026) hâlâ pre-release ve yalnız Expo SDK 54 doğrulanmış (proje SDK 55) — ADR-007 §43 gate karşılanmıyor. İlk aşama JS-token consumption (`nativewindStrategy.ts` `getThemeTokens` fallback hazır, PDR-001); NativeWind stabilleşince opsiyonel migrate.

---

## SPEC Adayları (7 + 1 koşullu)

| ID | Başlık | Öncelik | Faz | Bağımlı |
|----|--------|---------|-----|---------|
| SPEC-MOBILE-001 | Mobil runtime bootstrap (babel/metro/asset/orchestration/native sınır) | P0 | 1 | — |
| SPEC-INFRA-DERIVE-001 | Türetme & yaşam döngüsü (literal rename + bp-v tag/release + param validasyon + BSD/GNU) | P0 | 1 | — |
| SPEC-UI-001 | Gerçek cross-platform UI (Yol B: platform-split + design-tokens JS-token + 27 ekran port) | P0 | 2 | MOBILE |
| SPEC-API-001 | Backend-agnostik veri katmanı (HTTP client canlandırma + MSW + Vite proxy + cross-platform contract) | P0 | 2 | MOBILE |
| SPEC-AUTH-001 | Web auth dikey dilim + pluggable BaaS adaptör + mobil auth wiring | P0 | 2 | API, UI |
| SPEC-DEPLOY-001 | Üretime geçiş (web deploy + SPA fallback + t3-env + EAS paritesi + Turbo env) | P0 | 4 | MOBILE, API |
| SPEC-TEST-001 | Enforcement-first kalite (lint gate + coverage threshold + E2E davranış + plugin/scaffolding self-test) | P1 | 3 | API, AUTH, UI, INFRA |
| SPEC-REFACTOR-GOV-001 (koşullu) | Governance/metadata yükü makullestirme | P1 | 4-5 | açık karara bağlı |

**Bağımlılık sırası:** SPEC-MOBILE-001 → SPEC-INFRA-DERIVE-001 → SPEC-UI-001 → SPEC-API-001 → SPEC-AUTH-001 → SPEC-DEPLOY-001 → SPEC-TEST-001

---

## Faz Haritası (0-5)

- **Faz 0 — Dürüst konumlandırma** (kod yok): mevcut durumun haritası + Yol B kararının ADR/ADR-007 amendment ile sabitlenmesi + NativeWind erteleme gerekçesi.
- **Faz 1 — Temel/Bootstrap**: SPEC-MOBILE-001 + SPEC-INFRA-DERIVE-001 (paralel — farklı dosya alanları: `apps/mobile` config vs `tooling/derive`).
- **Faz 2 — Dikey dilimler (cross-platform)**: SPEC-UI-001 + SPEC-API-001 + SPEC-AUTH-001.
- **Faz 3 — Enforcement/Kalite**: SPEC-TEST-001 (dikey dilimler hazır olunca E2E anlamlı).
- **Faz 4 — Üretime geçiş**: SPEC-DEPLOY-001 (+ governance SPEC koşullu).
- **Faz 5 — Stratejik konsolidasyon**: ratchet eşiklerini yukarı çek, ADR-kod çelişkilerini kapat, MoAI-ADK kararı.

---

## SPEC Detayları

### SPEC-MOBILE-001 — Mobil runtime bootstrap (P0, Faz 1)
Kapsam: `babel.config.js` (babel-preset-expo + `react-native-worklets/plugin` EN SON), `metro.config.js` (expo/metro-config + pnpm monorepo watchFolders), `assets/` placeholder (icon/splash/adaptive-icon — app.json referansları şu an ölü), bootstrap orchestration (initSentry → await initEncryptedStorage → setupOfflineQueue, App.tsx GestureHandlerRootView), native entegrasyon sınır netleştirme, Hermes + expo-doctor doğrulama kapısı, `src/test/setup.ts` + smoke test.
Kapsam dışı: 27 ekran RN port (SPEC-UI-001), mağaza submit/EAS production, NativeWind, auth wiring.
Kritik EARS: babel worklet plugin EN SON; metro pnpm watchFolders; entry mount'ta init zinciri AWAIT; bootstrap gate (expo-doctor/Hermes); her native paket package.json'da declared.

### SPEC-INFRA-DERIVE-001 — Türetme & yaşam döngüsü (P0, Faz 1)
Kapsam: kapsamlı literal rename (`AppNavigator.tsx:192` deep-link prefix, i18n locale display-name, ekran metni) + verify'a `apps/*/src` + `packages/*/src` recursive grep; `bp-v1.0.0` baseline annotated tag + `release.yml` (notify-derived-projects'i tetikler); param format validasyonu (NAME/SCOPE/BUNDLE_ID/DOMAIN regex, mutasyondan ÖNCE); BSD/GNU taşınabilirlik (`grep -oP` GNU-only → `sed -nE`; macOS'ta boş dönüyor → her sync FULL_SYNC'e düşüyor); CLAUDE.md sentinel uyumu; `--reset-git` flag + `.codex/hooks.json` hardcoded absolute path fix (DOĞRULANDI: `/Users/alperenkarip` içeriyor, derived projede kırılır); emoji → düz metin.
Kapsam dışı: 3-way merge motoru yeniden yazımı, drift otomasyonu, deploy.

### SPEC-UI-001 — Gerçek cross-platform UI / Yol B (P0, Faz 2, deps: MOBILE)
Kapsam: 12 primitive için `.native.tsx`/`.web.tsx` split + paylaşılan `.types.ts`; design-tokens → web CSS üretimini build'e bağla (`generateCSSVariables`, elle hex kopyasını sil — single-source onar); 241 `var(--color)` kademeli migrate (pilot: Stack/Text/Button/Box → `useTheme().tokens`); 27 ekran port (önce 3 altın şablon LoginScreen/HomeScreen/SettingsScreen, sonra 24; onChange→onChangeText, onClick→onPress); eslint-plugin-bp RN kuralları kademeli warn→error; react-native-web SADECE Storybook için değerlendir.
Kapsam dışı: NativeWind v5 production, mobil bootstrap, auth/sample iş-mantığı wiring, semantic token şekil değişikliği.

### SPEC-API-001 — Backend-agnostik veri katmanı (P0, Faz 2, deps: MOBILE)
Kapsam: `packages/core` `createApiClient` canlandır (fan_in=0 → wire + test); session.ts ham fetch + sample in-memory mock'u core client'a taşı (ADR-005 "raw fetch dağılmaz"); MSW gömülü mock (tek `handlers.ts` /api/auth/* + sample CRUD, `public/mockServiceWorker.js`, browser+server setup, fixture başarı/boş/401/500/gecikme); Vite proxy + `VITE_API_MOCKING` mock-to-real köprü; cross-platform contract paylaşımı (`packages/core`: SampleItem + query-key factory + ADR-005 staleTime, mobil duplicate kaldır); mobil mock = core client'a injectable fetch (RN'de MSW olgun değil, aynı fixture paylaş); no-raw-fetch lint + Zod-uyum contract-test.
Kapsam dışı: gerçek backend, AuthProvider (SPEC-AUTH-001), query-options factory tam soyutlama, mobil ekran UI portu.

### SPEC-AUTH-001 — Auth dikey dilim + BaaS adaptör + mobil (P0, Faz 2, deps: API, UI)
Kapsam: AuthProvider + context wiring (App.tsx:7 yorum → gerçek mount), route guard (RequireAuth/PublicOnly, returnTo, logout nav reset), 4 ölü formu canlandır (e.preventDefault kaldır, Zod + mutation), pluggable AuthAdapter (own-backend-cookie default canonical + Supabase/Clerk iskelet, factory yok), mobil auth wiring (useAuth+Zustand, token sadece SecureStore, RootNavigator conditional gating, LoginScreen.tsx:27 `(e.target as any).value` RN-bozuk düzelt), logout teardown altın deseni koru + privacy filtresi.
Kapsam dışı: backend endpoint impl (MSW'den gelir), Supabase/Clerk somut impl, 8-durumlu state machine, BaaS localStorage token modeli.

### SPEC-DEPLOY-001 — Üretime geçiş (P0, Faz 4, deps: MOBILE, API)
Kapsam: web deploy hedefi (host AskUserQuestion ile, `deploy.yml:44` echo stub → official action); SPA fallback (vercel.json rewrites VEYA netlify _redirects — şu an HİÇBİRİ yok, `/login` static host'ta 404 = üretim-blocker); cross-platform env şema (t3-env, web VITE_ + mobil EXPO_PUBLIC_, build-time validation, VITE_API_BASE_URL wire-up); EAS gerçek çalışabilirlik (babel/metro/asset ön-koşul); Turbo env declaration (cache hash doğruluğu); deploy-CI-release zinciri + rollback runbook + repo-mode guard.
Kapsam dışı: gerçek API, mağaza submit, bp-v tag (INFRA), vendor kilitlenme.

### SPEC-TEST-001 — Enforcement-first kalite (P1, Faz 3, deps: API, AUTH, UI, INFRA)
Kapsam: bp-rule severity gradyanı (recommended.js flat-config fix, kademeli warn→error); CI lint gate (29 generic error düzelt, `--max-warnings` baseline → ratchet 0); coverage threshold (`@vitest/coverage-v8` ekle — lockfile'da YOK, web + mobil jest coverageThreshold); E2E davranış dönüşümü (13 "heading visible" → form-fill→submit→toHaveURL, CI'ye Playwright job — şu an HİÇ koşmuyor); eslint-plugin-bp self-test (RuleTester valid/invalid matrisi); scaffolding/upstream-sync bats smoke.
Kapsam dışı: tüm kuralları tek seferde error, gerçek backend E2E, yeni feature testleri, bp-v tag.

---

## Gerilim Çözümleri (özet)
- **UI refactor web'i bozma riski** → Yol B ile web olduğu gibi kalır, sıfır regresyon; `.types.ts` API drift'i engeller; pilot-first kademeli.
- **MOBILE bootstrap tek başına çalışan app üretmez** (ekranlar web-only UI import edip Hermes'te crash eder) → MOBILE "Metro boot + expo-doctor + Hermes" garanti eder, "ekranlar crash etmeden render" kriterini UI-001'e devreder.
- **API ile AUTH aynı transport/contract paylaşır** → API ÖNCE (client + MSW handler + transport), AUTH SONRA (üstüne provider/guard/form, kendi endpoint'i yazmaz).
- **TEST enforcement erken CI kilitler** → TEST dikey dilimlerden SONRA (Faz 3), baseline-then-ratchet.
- **INFRA/DEPLOY/TEST aynı CI dosyalarına dokunur** → sıralı (farklı fazlar), aynı fazda iki SPEC aynı workflow'a yazmaz.

---

## Açık Sorular (SPEC içeriğini belirler)
1. Web deploy host: Vercel (önerilen, SPA-first ile uyumlu) / Netlify / Cloudflare Pages / placeholder-agnostik.
2. MoAI-ADK iskeleti: kalıcı (pilot SPEC ile kanıtla) mı, lazy-load/arşiv mi? (.moai/specs boş, hiç çalışmamış)
3. Governance/metadata SPEC: ayrı 8. SPEC (SPEC-REFACTOR-GOV-001) mi, parçaları ilgili SPEC'lere mi dağıtılsın?
4. Mobil ekran port: kademeli migrate mi, altın şablon + toplu yeniden üretim mi? (27 ekranın çoğu iskelet, gerçek iş-mantığı yok)
5. Auth BaaS adaptör kapsamı: sadece own-backend+Clerk mi, Supabase/Firebase iskeleti de mi? localStorage token modeli (ADR-010 8.1 ihlali) kabul mü?
6. Coverage threshold başlangıç tabanı: global düşük taban + ratchet mi, kritik paketler (auth/core) yüksek diğerleri muaf mı?
