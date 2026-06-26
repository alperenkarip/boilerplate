# SPEC-AUTH-001 — Implementation Plan

Bu plan, SPEC-AUTH-001 requirement'larinin (REQ-AUTH-001..005) hangi gorevlere ayrildigini, teknoloji/surum kararlarini, riskleri ve azaltmalari, MX tag planini icerir. Implementasyon kodu ICERMEZ — yalnizca yol haritasi.

## Bagimlilik On-Kosulu

Bu SPEC `run` asamasina alinmadan once asagidakiler hazir olmalidir (Faz 2 sirasi):

- **SPEC-API-001**: `packages/core` `createApiClient` canli; MSW `/api/auth/*` handler'lari (login/me/logout, basari + 401 + 500 + gecikme fixture'lari); Vite proxy + `VITE_API_MOCKING` koprusu.
- **SPEC-UI-001**: cross-platform form primitive (`TextField` `.native.tsx`/`.web.tsx` split, `onChangeText` prop, paylasilan `.types.ts`). Mobil `LoginScreen.tsx` bu primitive'i tuketir.

On-kosul karsilanmazsa: REQ-AUTH-003 (form mutation) ve REQ-AUTH-004 (mobil gating) bloke; auth boundary + guard kismi calisilamaz.

---

## Gorev Decomposition

Oncelik etiketleri ile sirali (zaman tahmini yok). Her gorev bir veya daha fazla REQ'e baglanir.

### Milestone 1 — Auth Boundary ve Adapter (REQ-AUTH-001, REQ-AUTH-002) — Priority High

1. `AuthAdapter` interface tanimi (`apps/web/src/auth/adapter/types.ts`): `login(creds)`, `logout()`, `checkSession()`, `refresh?()` -> hepsi sanitized `AuthSummary` / `AuthStatus` doner. Ham token donmez.
2. `ownBackendCookieAdapter` (default): mevcut `session.ts` `checkSession`/`logout` cagrilarini sarar; login mutation `/api/auth/login` (POST, `credentials: 'include'`) cagirir. Cookie-preferred invariant korunur.
3. Clerk iskelet + dokumantasyon (`adapter/clerk.md` + tip-uyumlu stub): nasil takilacagi, neden first-party HttpOnly ile ADR-010 uyumlu, `factory` neden yok. Somut impl YOK.
4. `AuthProvider` (`apps/web/src/auth/AuthProvider.tsx`): secili adapter'i context'e koyar; `useAuth` adapter'i context'ten okur (su an dogrudan `session.ts` import ediyor -> adapter'a yonlendir).

### Milestone 2 — Provider Wiring ve Bootstrap (REQ-AUTH-004) — Priority High

5. `App.tsx:7` yorum -> gercek `AuthProvider` mount. Konum: `QueryClientProvider` ICINDE (cache erisimi gerek), `RouterProvider` DISINDA (guard'lar context'i gormeli, bootstrap tek noktada). Provider sirasi invariant'i (App.tsx MX:ANCHOR) korunur.
6. `checkSession` bootstrap tek yerde calisir; cift-cagri onlenir (useAuth `useEffect` mevcut, AuthProvider ile cakismamali).

### Milestone 3 — Route Guard (REQ-AUTH-004) — Priority High

7. `RequireAuth` component: `status` `authenticated` degilse `/auth/login`'e redirect, `returnTo` (originally requested path) korunur; `isLoading` ise loading ekrani.
8. `PublicOnly` component: `authenticated` kullanici `/auth/*`'e girerse home/returnTo'ya redirect.
9. `router.tsx` protected `/` subtree'sini `RequireAuth` ile, `/auth/*` subtree'sini `PublicOnly` ile sarar. Route-table MX:ANCHOR kontrati korunur (path/nesting degismez, sadece guard sarmalama).
10. Logout navigation reset: `useAuth.ts:65-66` yorum -> gercek `router.navigate('/auth/login')` (teardown'in son adimi).

### Milestone 4 — Form Canlandirma (REQ-AUTH-003) — Priority High

11. `loginSchema` / `registerSchema` Zod semalari (`apps/web/src/auth/schema.ts`) — sample `schema.ts` desenini izler (i18n hata mesaji).
12. `useLogin` / `useRegister` mutation hook'lari (`@tanstack/react-query` `useMutation`) -> `AuthAdapter.login/register`.
13. 4 form (`LoginPage`/`RegisterPage`/`ForgotPasswordPage`/`ResetPasswordPage`): `e.preventDefault()` kaldir, controlled `TextField`, `onSubmit` -> schema parse -> mutation. Backend error -> ADR-010 error taxonomy -> sanitized i18n mesaj.

### Milestone 5 — Mobil Auth Wiring (REQ-AUTH-001, REQ-AUTH-004, REQ-AUTH-005) — Priority High

14. Mobil `useAuth` + Zustand store (`apps/mobile/src/auth/`): token SADECE `secureStorage.ts` (`saveToken`/`getToken`/`clearAllTokens`) uzerinden; Zustand'a/MMKV'ye/AsyncStorage'a raw token YAZILMAZ.
15. `AppNavigator` flat `RootStack` -> conditional gating: `authenticated? <Main/> : <Auth/>` (Splash bootstrap sirasinda). `biometric.ts` token-unlock akisinda opsiyonel tuketilir.
16. `LoginScreen.tsx:27,34` `(e.target as any).value` -> `onChangeText` (SPEC-UI-001 primitive). RN-bozuk DOM eventi temizlenir.

### Milestone 6 — Logout Teardown + Privacy (REQ-AUTH-005) — Priority High

17. Web logout teardown tamamla: `queryClient.clear()` (mevcut) + state reset (mevcut) + `resetNavigation` (yeni, M3 #10) deterministik sirada. Best-effort server logout teardown'i atlatamaz.
18. Mobil logout: `clearAllTokens()` + Zustand reset + `queryClient.clear()` + `navigation.reset` (Auth'a). `LogoutCleanupContract` (core, mevcut) implementasyonu.
19. Auth observability privacy filtresi: Sentry/analytics beforeSend denylist — token/cookie/Authorization sizdirmaz (ADR-010 37.3). `biometric.ts` MX:WARN (satir 159) deseni izlenir.

---

## Teknoloji / Surum Karari

| Alan | Karar | Gerekce / Referans |
|------|-------|--------------------|
| Auth session (web) | Backend-managed HttpOnly cookie | ADR-010 8.1 canonical; `session.ts:16` `credentials: 'include'` |
| Token persistence (mobil) | Expo SecureStore (yalnizca) | ADR-010 8.1 mobil canonical; `secureStorage.ts:6` |
| Validation | Zod | ADR-006 forms-and-validation; mevcut `sample/schema.ts` deseni |
| Data/mutation | `@tanstack/react-query` `useMutation` | ADR-005; mevcut `App.tsx:11` QueryClient |
| Routing (web) | React Router 7.x | mevcut `router.tsx` `createBrowserRouter` |
| Navigation (mobil) | React Navigation 7.x native-stack | mevcut `AppNavigator.tsx:5` |
| State (mobil auth) | Zustand (token HARIC) | ADR-004; token Zustand'da DEGIL, SecureStore'da |
| i18n hata | i18next sanitized mesaj | ADR-011; ADR-010 error taxonomy |
| BaaS genisletme | own-backend somut + Clerk iskelet | Kullanici karari; ADR-010 36.1 (factory yok) |

---

## Risk + Azaltma

| Risk | Etki | Azaltma |
|------|------|---------|
| **Token sizintisi** (analytics/Sentry/log) | Kritik — kimlik hirsizligi | Sentry beforeSend denylist (token/cookie/Authorization); `console.warn`'larda token basilmaz; `biometric.ts:159` MX:WARN deseni; acceptance'ta privacy assertion. |
| **Wrong-user leak** (logout/user-switch sonrasi onceki kullanici cache'i) | Kritik — veri sizintisi | Deterministik teardown sirasi (cache clear -> state reset -> secure clear -> nav reset); `queryClient.clear()` invariant (L.1.7); user-switch'te ayni teardown. |
| **Cift bootstrap** (checkSession iki kez) | Orta — race/flicker | `checkSession` tek noktada (AuthProvider); useAuth `useEffect` ile cakismamali; loading state tek kaynak. |
| **Asiri soyutlama** (factory/registry erken) | Orta — bakim yuku (ADR-010 36.1) | Tek somut impl varken sadece DI degeri (provider); Clerk dokumantasyon, kod degil. |
| **Guard provider'i goremezse** redirect dongusu | Yuksek — sonsuz redirect | AuthProvider RouterProvider DISINDA; `PublicOnly` authenticated'i login'den cikarir; loading sirasinda redirect YOK. |
| **Best-effort logout server hatasi** teardown'i atlar | Yuksek — UI tutarsiz, leak | `session.ts:43-51` invariant (logout reject etmez); useAuth `finally` blogu teardown'i garanti eder. |
| **Mobil token yanlis store** (MMKV/AsyncStorage'a sizma) | Kritik — ADR-010 ihlali | Token erisimi tek boundary (`secureStorage.ts`); Zustand'a raw token konmaz; lint/review kontrolu. |
| **RN-bozuk DOM eventi** (`e.target as any`) | Orta — RN'de calismaz | SPEC-UI-001 `onChangeText` primitive'ine gecis; platform-split form. |

---

## Reference (dosya:satir)

- `apps/web/src/auth/session.ts:14-35` — `checkSession` cookie-preferred, 401->unauthenticated / other+network->expired invariant (KEEP).
- `apps/web/src/auth/session.ts:43-51` — best-effort `logout`, hata yutar (KEEP).
- `apps/web/src/auth/useAuth.ts:41-43` — `login: () => void` stub (MODIFY -> adapter mutation).
- `apps/web/src/auth/useAuth.ts:46-68` — logout teardown; satir 65-66 nav reset eksik (MODIFY).
- `apps/web/src/App.tsx:7,45-47` — AuthProvider yorum + QueryClientProvider/RouterProvider nesting (MODIFY).
- `apps/web/src/router.tsx:37-66` — protected `/` subtree guard'siz (MODIFY).
- `apps/web/src/pages/auth/LoginPage.tsx:15` — `e.preventDefault()` olu form (MODIFY).
- `apps/web/src/features/sample/schema.ts` — Zod schema deseni (REFERENCE).
- `apps/mobile/src/auth/secureStorage.ts:33-96` — `saveToken/getToken/clearAllTokens` (CONSUME, fan_in=0).
- `apps/mobile/src/auth/biometric.ts:159-162` — privacy MX:WARN deseni (REFERENCE).
- `apps/mobile/src/navigation/AppNavigator.tsx:250-280` — flat RootStack (MODIFY -> conditional gating).
- `apps/mobile/src/screens/auth/LoginScreen.tsx:27,34` — `(e.target as any).value` RN-bozuk (MODIFY).
- `packages/core/src/auth/types.ts:5-20` — `AuthStatus` (4-durum), `AuthSummary`, `LogoutCleanupContract` (KEEP).
- `docs/adr/ADR-010-...md` Bolum 8.1 (HttpOnly canonical), 14.2/14.4 (state machine semantigi), 36.1 (asiri soyutlama riski), 37 (risk azaltma).

---

## MX Tag Plani

`run` asamasinda eklenecek/guncellenecek @MX tag'leri (`.moai/config/sections/language.yaml` `code_comments` ayarina uyar):

- `AuthAdapter` interface (yeni, public API boundary, fan_in artacak): **@MX:ANCHOR** + @MX:REASON (auth boundary kontrati, UI yalnizca buradan auth tuketir).
- `AuthProvider` (yeni mount noktasi, fan_in=1 App.tsx): **@MX:ANCHOR** + @MX:REASON (bootstrap tek nokta, provider nesting invariant).
- `RequireAuth` guard (yeni, protected subtree'yi sarar): **@MX:ANCHOR** + @MX:REASON (route guard invariant; redirect mantigi tum protected route'lar icin tek kaynak).
- `useAuth.ts` logout teardown (mevcut ANCHOR, satir 12): teardown adimlari (nav reset + secure clear) eklenince **@MX:ANCHOR guncelle**.
- Mobil `useAuth` token erisimi: **@MX:WARN** + @MX:REASON (token yalnizca SecureStore; baska store'a yazma yasak — danger zone).
- Sentry/analytics privacy filtresi: **@MX:WARN** + @MX:REASON (token/cookie sizdirmama; `biometric.ts:159` deseni).
- `session.ts:12` mevcut ANCHOR: korunur (degisiklik yok).
- Yeni eklenen ama henuz test edilmemis public fonksiyonlar: gecici **@MX:TODO** (GREEN/IMPROVE'da kaldirilir).
