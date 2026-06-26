> **[SUPERSEDED by SPEC-AUTH-002 (2026-06-26)]**
> Bu SPEC own-backend HttpOnly cookie modelini canonical aliyordu; ADR-021 ile Firebase Auth canonical oldugu icin gecersizdir. Tarihsel referans olarak korunur.

# SPEC-AUTH-001 — Acceptance Criteria

Given-When-Then senaryolari (min 4), edge case'ler, kalite kapisi ve Definition of Done. Tum senaryolar SPEC-API-001 MSW `/api/auth/*` fixture'lari (basari/401/500/gecikme) uzerinde deterministik kosar.

## Acceptance Scenarios (Given-When-Then)

### AC-1 — Login basari -> redirect (REQ-AUTH-003, REQ-AUTH-004)

- **Given** olu olmayan `LoginPage` (form canli, `e.preventDefault` kaldirilmis) ve `/protected` (ornegin `/sample`) kaynagina `returnTo` ile yonlendirilmis kullanici,
- **When** kullanici gecerli kimlik bilgisiyle formu doldurur ve submit eder,
- **Then** `loginSchema` parse gecer, `AuthAdapter.login` (own-backend) cagrilir, MSW basari fixture'i ile `status` `authenticated` olur ve kullanici `returnTo` yoksa `/`'a, varsa korunan path'e redirect edilir.
- **And** UI'a yalnizca `AuthSummary` (status/userId/displayName) yansir; ham token DOM'da/state'te gorunmez.

### AC-2 — Protected route guard (REQ-AUTH-004)

- **Given** `unauthenticated` durumda kullanici ve guard ile sarilmis protected `/` subtree,
- **When** kullanici dogrudan korumali bir route'a (`/sample`, `/settings`) erismeye calisir,
- **Then** `RequireAuth` kullaniciyi `/auth/login`'e redirect eder ve orijinal path `returnTo` olarak korunur.
- **And** bootstrap (`checkSession`) devam ederken protected icerik de login formu da gosterilmez; loading ekrani render edilir.

### AC-3 — Mobil conditional gating + SecureStore (REQ-AUTH-001, REQ-AUTH-004)

- **Given** mobil `AppNavigator` ve cihazda kayitli session,
- **When** uygulama acilir ve bootstrap calisir,
- **Then** auth-state-driven gating `authenticated? Main : Auth` ile dogru stack secilir (flat render DEGIL); token yalnizca `Expo SecureStore`'dan (`getToken`) okunur, Zustand/MMKV/AsyncStorage'dan DEGIL.
- **And** `LoginScreen` `onChangeText` ile calisir (`(e.target as any).value` RN-bozuk kod kalmaz).

### AC-4 — Logout teardown + privacy (REQ-AUTH-005)

- **Given** `authenticated` kullanici ve dolu query cache (onceki kullanici verisi),
- **When** logout tetiklenir (server logout MSW 500 dondurse bile),
- **Then** deterministik sirada: best-effort server logout cagrilir, `queryClient.clear()` calisir, auth state `unauthenticated`'a reset olur, mobilde `clearAllTokens()` SecureStore'u temizler, navigation `/auth/login` (web) / `Auth` stack (mobil) reset edilir.
- **And** server logout hatasi teardown'i ATLATMAZ; onceki kullanicinin hicbir cache verisi kalmaz (wrong-user leak yok).
- **And** token / cookie / Authorization header hicbir analytics/Sentry/log surface'ine yazilmaz.

### AC-5 — Sanitized backend error (REQ-AUTH-003)

- **Given** canli `LoginPage`,
- **When** kullanici gecersiz kimlikle submit eder ve backend 401/500 doner,
- **Then** kullaniciya ADR-010 error taxonomy'sine gore sanitized i18n mesaj gosterilir (ham backend error / stack / token DEGIL); form yeniden denenebilir kalir.

---

## Edge Cases

- **Network/offline bootstrap:** `checkSession` network hatasi alirsa `expired` (NOT `unauthenticated`) doner; kullanici sert logout'a zorlanmaz (session.ts:25-34 invariant). Guard loading/expired'i ayirir.
- **Authenticated kullanici `/auth/login`'e gider:** `PublicOnly` onu home/returnTo'ya geri yonlendirir (login formuna dusmez).
- **returnTo open-redirect:** `returnTo` yalnizca uygulama-ici relative path olmali; mutlak/harici URL reddedilir (acik yonlendirme guvenligi).
- **Cift submit:** mutation pending iken submit butonu disabled; cift login istegi gitmez.
- **User switch (logout sonrasi farkli kullanici login):** ayni teardown sirasi calisir; ilk kullanicinin cache'i ikinci kullaniciya sizmaz.
- **Mobil SecureStore okuma hatasi:** `SecureStorageError` yakalanir; kullanici Auth stack'e dusurulur, app crash etmez.
- **Bootstrap sirasinda deep-link:** korumali deep-link'e bootstrap bitmeden gelinirse loading -> sonra guard karari (redirect veya icerik).

---

## Kalite Kapisi (Quality Gate)

- **Tested:** Yeni public fonksiyonlar (`AuthAdapter`, `RequireAuth`, `PublicOnly`, `useLogin/useRegister`, mobil `useAuth`) icin birim/integration test; mevcut `session.test.ts`/`useAuth.test.ts` yesil kalir. Auth/core kritik paket -> yuksek coverage hedefi (SPEC-TEST-001 esigi).
- **Secured:** Token sizinti yok (Sentry denylist assertion'i ile dogrulanir); wrong-user leak yok (logout sonrasi cache bos); input validation Zod ile; HttpOnly/SecureStore disinda token saklama YOK. Auth alani -> guvenlik review zorunlu (ADR-010 37.7).
- **Readable:** ADR-010 referansli yorumlar; sanitized boundary acik.
- **Unified:** mevcut sample `FormScreen` / `schema.ts` desenine uyum; eslint temiz.
- **Trackable:** commit `SPEC-AUTH-001` referansli; @MX tag'leri (ANCHOR/WARN) plan.md'ye gore eklenir.

---

## Definition of Done

- [ ] REQ-AUTH-001..005 tum acceptance senaryolari (AC-1..AC-5) gecer.
- [ ] `App.tsx` AuthProvider gercek mount (yorum yok); provider nesting invariant korunur.
- [ ] `router.tsx` protected `/` subtree `RequireAuth`, `/auth/*` `PublicOnly` ile sarili; returnTo calisir.
- [ ] 4 web formu canli (`e.preventDefault` yok), Zod + mutation; sanitized i18n hata.
- [ ] `AuthAdapter` interface + own-backend default impl; Clerk dokumante iskelet (factory yok, Supabase/Firebase yok).
- [ ] Mobil `AppNavigator` conditional gating; token yalnizca SecureStore; `LoginScreen` `onChangeText`.
- [ ] Logout teardown deterministik (cache clear + state reset + secure clear + nav reset); server hatasi atlamaz.
- [ ] Sentry/analytics privacy filtresi: token/cookie sizmiyor (test ile dogrulandi).
- [ ] Mevcut `AuthStatus` 4-durum korunur; 8-durum state machine eklenmedi.
- [ ] Kalite kapisi (Tested/Secured/Readable/Unified/Trackable) gecer; guvenlik review tamam.
