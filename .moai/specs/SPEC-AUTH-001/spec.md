---
id: SPEC-AUTH-001
version: 0.1.0
status: superseded
created: 2026-06-05
updated: 2026-06-26
author: alp
priority: P0
issue_number: 0
superseded_by: SPEC-AUTH-002
---

> **[SUPERSEDED by SPEC-AUTH-002 (2026-06-26)]**
> Bu SPEC own-backend HttpOnly cookie modelini canonical aliyordu; ADR-021 ile Firebase Auth canonical oldugu icin gecersizdir. Tarihsel referans olarak korunur. Guncel auth SPEC'i: `.moai/specs/SPEC-AUTH-002/`.

# SPEC-AUTH-001 — Web Auth Dikey Dilim + Pluggable Auth/BaaS Adaptoru + Mobil Auth Wiring

## HISTORY

- 2026-06-05 (v0.1.0): Ilk taslak. Velocity remediation roadmap (Faz 2, P0) ve AUTH-WEB-VERTICAL-SLICE temasindan tureyen SPEC. Kullanici karari ile BaaS adaptor kapsami "own-backend (canonical) + Clerk iskelet" olarak sabitlendi; Supabase/Firebase iskeleti ve localStorage token modeli reddedildi. Brownfield: mevcut `apps/web/src/auth`, `apps/mobile/src/auth`, `router.tsx`, `App.tsx` uzerine delta.

---

## Overview

Bu SPEC, auth dikey diliminin uctan uca canlandirilmasini tanimlar. Tum auth altyapisi (session.ts cookie-preferred check, useAuth.ts logout teardown sozlesmesi, mobil secureStorage.ts/biometric.ts, 4 web formu, 5 mobil ekran) **kod olarak mevcuttur ancak baglanmamistir** (dead wiring): `App.tsx:7` AuthProvider yorum satiri, `router.tsx` protected `/` subtree guard'sizdir, web formlar `e.preventDefault()` ile olu, mobil `AppNavigator` flat (auth-state-driven gating yok), mobil auth modulleri `fan_in=0`.

Hedef: bu mevcut parcalari **ADR-010 invariant'larini koruyarak** birbirine baglamak ve UI'in yalnizca sanitized `AuthSummary` (status/userId/displayName) tukettigi, tum auth islemlerinin tek bir `AuthAdapter` boundary'sinden gectigi calisir bir dikey dilim uretmek.

Canonical baseline tek somut implementasyon: **own-backend HttpOnly-cookie adapter** (ADR-010 Bolum 8.1). Clerk, dokumante edilmis bir genisletme noktasidir (ADR-010 ile en uyumlu first-party HttpOnly BaaS) — somut impl YOK. Tek somut impl varken `factory` katmani kurulmaz (ADR-010 36.1 asiri-soyutlama riski).

**Bagimliliklar:** SPEC-API-001 (transport + MSW `/api/auth/*` handler) ve SPEC-UI-001 (cross-platform form primitive, `onChangeText`). Bu SPEC kendi backend endpoint'ini yazmaz; mock'lari SPEC-API-001'den tuketir. Faz 2 sonunda tamamlanir.

**Guvenlik notu (HARD):** Bu SPEC auth + input-validation + secure-storage alaninda calisir. Tum requirement'lar token sizintisi (analytics/Sentry/log) ve wrong-user leak (logout/user-switch sonrasi cache temizleme) acisindan denetlenmelidir.

---

## Brownfield Delta Markers

Asagidaki dosyalar **mevcut** ve bu SPEC tarafindan degistirilir veya tuketilir. `[KEEP]` korunacak altin desen, `[MODIFY]` degistirilecek, `[NEW]` eklenecek, `[CONSUME]` mevcut ama henuz cagrilmayan modulu baglar.

| Dosya | Durum | Delta |
|-------|-------|-------|
| `apps/web/src/auth/session.ts` | [KEEP] | `checkSession` 401->unauthenticated / other->expired / network->expired invariant'i KORUNUR (satir 21-34). Cookie-preferred. |
| `apps/web/src/auth/useAuth.ts` | [MODIFY] | `login: () => void` stub gercek `AuthAdapter.login` mutation'a baglanir; logout teardown (satir 59-66) `resetNavigation` + `clearSecureStorage` ile tamamlanir. |
| `apps/web/src/App.tsx` | [MODIFY] | Satir 7 yorum -> gercek `AuthProvider` mount. Konum: `QueryClientProvider` ICINDE, `RouterProvider` DISINDA (tek bootstrap noktasi). |
| `apps/web/src/router.tsx` | [MODIFY] | Protected `/` subtree (satir ~37) `RequireAuth` ile sarilir; `/auth/*` subtree `PublicOnly` ile sarilir; returnTo destegi. |
| `apps/web/src/pages/auth/LoginPage.tsx` | [MODIFY] | `e.preventDefault()` (satir 15) kaldirilir; `loginSchema` Zod + `useLogin` mutation; controlled `TextField`. |
| `apps/web/src/pages/auth/RegisterPage.tsx` | [MODIFY] | Ayni desen: `registerSchema` + `useRegister`. |
| `apps/web/src/pages/auth/ForgotPasswordPage.tsx` | [MODIFY] | Ayni desen: form-fill -> submit. |
| `apps/web/src/pages/auth/ResetPasswordPage.tsx` | [MODIFY] | Ayni desen: form-fill -> submit. |
| `apps/web/src/auth/adapter/*` | [NEW] | `AuthAdapter` interface + `ownBackendCookieAdapter` (default) + Clerk iskelet/dokumantasyon. |
| `apps/mobile/src/auth/secureStorage.ts` | [CONSUME] | `fan_in=0` -> `useAuth` tarafindan tuketilir (token SADECE SecureStore). |
| `apps/mobile/src/auth/biometric.ts` | [CONSUME] | `fan_in=0` -> token-unlock akisinda tuketilir (opsiyonel, bu SPEC'te wiring noktasi). |
| `apps/mobile/src/navigation/AppNavigator.tsx` | [MODIFY] | Flat `RootStack` -> auth-state-driven conditional gating (`authenticated? Main : Auth`). |
| `apps/mobile/src/screens/auth/LoginScreen.tsx` | [MODIFY] | Satir 27/34 `(e.target as any).value` RN-bozuk -> `onChangeText` (SPEC-UI-001 primitive). |
| `packages/core/src/auth/types.ts` | [KEEP] | Mevcut 4-durum `AuthStatus` ve `AuthSummary` KORUNUR; 8-durum state machine bu SPEC'te DEGIL. |

---

## Requirements (EARS)

Bes EARS tipinin tamami kullanildi. Maksimum 5 modul (REQ). Tum requirement'lar test edilebilir; observability/secrets ifadeleri ADR-010'a dayanir.

### REQ-AUTH-001 (Ubiquitous) — Auth Boundary ve Sanitized State

The system **shall** expose auth state to the UI exclusively as a sanitized `AuthSummary` (`status` / `userId` / `displayName`) and **shall** route every auth operation (login, logout, session check, refresh) through a single `AuthAdapter` boundary; the UI **shall not** call any auth provider SDK or raw token directly.

- Kapsam: web + mobil ortak `AuthAdapter` interface (`packages/core` sanitized tip kontrati uzerinden), UI yalnizca `useAuth()` -> `AuthSummary` tuketir.
- Invariant: `AuthStatus` semantigi (state machine), ham token var/yok mantigi degil tuketilir (ADR-010 14.4).

### REQ-AUTH-002 (Optional) — Pluggable AuthAdapter (Own-Backend Default, Clerk Iskelet)

**Where** a pluggable auth backend is required, the system **shall** provide a default own-backend HttpOnly-cookie `AuthAdapter` as the canonical baseline (ADR-010 8.1) and **shall** keep Clerk as a documented extension point (interface + integration notes), introducing no factory abstraction until a second concrete implementation exists.

- Tek somut impl = `ownBackendCookieAdapter` (mevcut `session.ts` `/api/auth/*` cagrilarini sarar).
- Clerk = `AuthAdapter` interface'ine uyan dokumante iskelet (first-party HttpOnly, ADR-010 ile en uyumlu BaaS). Supabase/Firebase iskeleti YOK.
- ADR-010 36.1 asiri-soyutlama: DI basittir (provider degeri), `factory` YASAK.

### REQ-AUTH-003 (Event-Driven) — Form Canlandirma ve Sanitized Hata

**When** a user submits a credential form (login / register / forgot-password / reset-password), the system **shall** validate inputs with a Zod schema (`loginSchema` / `registerSchema` / vb.), call the corresponding `AuthAdapter` mutation (`useLogin` / `useRegister`), and on backend error **shall** surface only a sanitized i18n message per the ADR-010 error taxonomy (no raw backend error, no stack, no token).

- `e.preventDefault()` olu formlar kaldirilir; controlled input + mutation pattern (sample `FormScreen` altin sablonu).
- Basarili login: `status` -> `authenticated` ve returnTo/home'a redirect (bkz. REQ-AUTH-004).

### REQ-AUTH-004 (State-Driven) — Route Guard ve Bootstrap Gating

**While** auth status is `unauthenticated` or `expired`, the system **shall** redirect protected routes to `/auth/login` preserving the originally requested path as `returnTo`; **while** the bootstrap session check (`checkSession`) is in progress, the system **shall** render a loading screen instead of either the protected content or the login form.

- Web: `RequireAuth` protected `/` subtree'yi sarar; `PublicOnly` `/auth/*` subtree'yi sarar (authenticated kullanici login'e dusmez).
- Mobil: `AppNavigator` flat render yerine `authenticated? Main : Auth` conditional gating; token SADECE `Expo SecureStore`'dan okunur (ADR-010 8.1 mobil canonical).
- Bootstrap tek yerde: `checkSession` bir kez calisir (cift-cagri yok).

### REQ-AUTH-005 (Unwanted Behavior) — Deterministik Logout Teardown ve Privacy Filtresi

**If** logout is triggered OR a user switch occurs, **then** the system **shall** call best-effort server logout and deterministically clear the query cache, reset auth state, clear secure storage (mobil) and reset navigation — in that order — so that no previous user's data remains; and the system **shall not** emit raw tokens or sensitive auth payloads to any observability, analytics, or log surface.

- Altin desen KORUNUR (`useAuth.ts` logout: `queryClient.clear()` + state reset, L.1.5/L.1.7); eksik adimlar (`resetNavigation`, mobil `clearSecureStorage`) tamamlanir.
- Network/5xx server logout hatasi teardown'i ATLATAMAZ (best-effort, `session.ts` satir 43-51 invariant).
- Privacy denylist: token / cookie / Authorization header analytics+Sentry'ye sizmamali (ADR-010 37.3 sensitive payload denylist).

---

## Kapsam Disi (What NOT to Build)

[HARD] Bu SPEC asagidakileri KAPSAMAZ:

- **Backend auth endpoint implementasyonu.** `/api/auth/me`, `/api/auth/login`, `/api/auth/logout` vb. handler'lar SPEC-API-001'in MSW mock'larindan gelir. Bu SPEC sadece tuketir.
- **Supabase / Firebase somut implementasyonu.** Yalnizca own-backend somut, Clerk iskelet. Supabase/Firebase iskeleti dahi YOK.
- **8-durumlu auth state machine.** ADR-010 14.2 hedeftir (unknown/refreshing/reauth-required/auth-error/signing-out vb.); bu SPEC mevcut 4-durum `AuthStatus` (`authenticated`/`unauthenticated`/`refreshing`/`expired`) ile baslar. State machine genisletmesi ayri SPEC.
- **BaaS localStorage token modeli adopsiyonu.** HttpOnly cookie (web) ve Expo SecureStore (mobil) korunur; localStorage/AsyncStorage'a raw token yazma REDDEDILDI (ADR-010 8.1).
- **AuthAdapter factory / cok-saglayici registry.** Tek somut impl varken asiri soyutlama yasak (ADR-010 36.1).
- **Passkey / social login / biometric'in zorunlu auth yapilmasi.** Biometric yalnizca SecureStore token-unlock kapisidir, tek auth yontemi olamaz (ADR-010 D-BIO).
