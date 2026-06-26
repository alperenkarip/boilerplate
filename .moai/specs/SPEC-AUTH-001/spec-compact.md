> **[SUPERSEDED by SPEC-AUTH-002 (2026-06-26)]**
> Bu SPEC own-backend HttpOnly cookie modelini canonical aliyordu; ADR-021 ile Firebase Auth canonical oldugu icin gecersizdir. Tarihsel referans olarak korunur.

# SPEC-AUTH-001 (Compact)

Web auth dikey dilimini canlandir + pluggable AuthAdapter (own-backend default + Clerk iskelet) + mobil auth wiring. P0, Faz 2. Deps: SPEC-API-001, SPEC-UI-001. BROWNFIELD.

## Requirements

- **REQ-AUTH-001 (Ubiquitous):** UI auth state'i yalnizca sanitized `AuthSummary` (status/userId/displayName) olarak tuketir; tum auth islemleri tek `AuthAdapter` boundary'sinden gecer; UI provider SDK / raw token'a dogrudan erismez.
- **REQ-AUTH-002 (Optional):** Default own-backend HttpOnly-cookie adapter canonical (ADR-010 8.1); Clerk dokumante genisletme noktasi; ikinci somut impl olana dek factory YOK.
- **REQ-AUTH-003 (Event-Driven):** Form submit -> Zod validate -> `AuthAdapter` mutation; backend error -> yalnizca sanitized i18n mesaj (ADR-010 error taxonomy).
- **REQ-AUTH-004 (State-Driven):** `unauthenticated`/`expired` iken protected route `/auth/login`'e redirect (`returnTo` korunur); bootstrap sirasinda loading; mobil `authenticated? Main : Auth` gating, token yalnizca SecureStore.
- **REQ-AUTH-005 (Unwanted):** Logout/user-switch -> best-effort server logout + deterministik teardown (cache clear -> state reset -> secure clear -> nav reset); token/sensitive payload observability'ye sizmaz.

## Acceptance (ozet)

- AC-1: Gecerli login -> `AuthAdapter.login` -> `authenticated` -> returnTo/home redirect.
- AC-2: `unauthenticated` protected route -> `/auth/login` redirect + returnTo; bootstrap'ta loading.
- AC-3: Mobil acilis -> conditional gating (flat degil), token yalnizca SecureStore, `onChangeText`.
- AC-4: Logout (server 500 olsa bile) -> deterministik teardown, wrong-user leak yok, token sizmaz.
- AC-5: Gecersiz kimlik -> sanitized i18n hata (ham error/token degil).

## Degisecek Dosyalar

- `apps/web/src/App.tsx` (MODIFY): AuthProvider mount (QueryClientProvider ici / RouterProvider disi).
- `apps/web/src/router.tsx` (MODIFY): `RequireAuth` protected `/` + `PublicOnly` `/auth/*` + returnTo.
- `apps/web/src/auth/useAuth.ts` (MODIFY): login stub -> adapter; logout nav reset (65-66).
- `apps/web/src/auth/session.ts` (KEEP): checkSession 401/expired invariant korunur.
- `apps/web/src/auth/adapter/*` (NEW): `AuthAdapter` interface + ownBackendCookie default + Clerk iskelet/doc.
- `apps/web/src/auth/schema.ts` (NEW): `loginSchema`/`registerSchema` Zod.
- `apps/web/src/pages/auth/{Login,Register,ForgotPassword,ResetPassword}Page.tsx` (MODIFY): `e.preventDefault` kaldir + Zod + mutation.
- `apps/mobile/src/auth/{secureStorage,biometric}.ts` (CONSUME): fan_in=0 -> tuketilir.
- `apps/mobile/src/auth/useAuth + store` (NEW): token yalnizca SecureStore.
- `apps/mobile/src/navigation/AppNavigator.tsx` (MODIFY): flat -> conditional gating.
- `apps/mobile/src/screens/auth/LoginScreen.tsx` (MODIFY): `(e.target as any).value` -> `onChangeText`.
- `packages/core/src/auth/types.ts` (KEEP): 4-durum `AuthStatus` korunur.

## Kapsam Disi

- Backend auth endpoint impl (MSW /api/auth/* SPEC-API-001'den).
- Supabase/Firebase somut impl (ve iskeleti dahi yok).
- 8-durumlu auth state machine (mevcut 4-durum AuthStatus ile baslar).
- BaaS localStorage token modeli (HttpOnly + SecureStore korunur).
- AuthAdapter factory / cok-saglayici registry (ADR-010 36.1).
- Biometric/passkey/social'in zorunlu auth yapilmasi.
