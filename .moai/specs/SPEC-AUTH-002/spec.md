---
id: SPEC-AUTH-002
version: 0.1.0
status: draft
created: 2026-06-26
updated: 2026-06-26
author: alp
priority: P0
issue_number: 0
supersedes: SPEC-AUTH-001
---

# SPEC-AUTH-002 — Firebase Auth Dikey Dilim + AuthPort (SDK-free core) + Web/Mobil Adapter Wiring

## HISTORY

- 2026-06-26 (v0.1.0): Ilk taslak. SPEC-AUTH-001'i supersede eder. ADR-020 (backend = Firebase) ve ADR-021 (auth = saf Firebase Auth) kararlarindan tureyen SPEC. SPEC-AUTH-001'in own-backend HttpOnly cookie + Clerk iskelet modeli REDDEDILDI; canonical auth artik client SDK + Firebase ID token. `AuthAdapter` boundary'si ADR-020/ADR-021 port/adapter mimarisindeki `AuthPort`'a (packages/core SDK-free) hizalanir. Korunan ilkeler: sanitized `AuthSummary` boundary, deterministic `LogoutCleanupContract`, observability privacy, mobil secure storage disiplini. Brownfield: mevcut `apps/web/src/auth`, `apps/mobile/src/auth`, `packages/core/src/auth` uzerine Firebase delta.

---

## Overview

Bu SPEC, auth dikey diliminin uctan uca **saf Firebase Auth** uzerinde canlandirilmasini tanimlar (ADR-021). Kullanici client SDK ile giris yapar (web `firebase/auth`, mobil `@react-native-firebase/auth`), kimlik **Firebase ID token** ile tasinir; kendi backend session/cookie modeli **yoktur** (ADR-021 supersedes ADR-010). Auth durumu `onAuthStateChanged` listener'i ile yonetilir.

Hedef: mevcut auth UI parcalarini (formlar, ekranlar, route guard noktalari) **ADR-021 invariant'larini koruyarak** Firebase Auth'a baglamak ve UI'in yalnizca sanitized `AuthSummary` (status/userId/displayName) tukettigi, tum auth islemlerinin tek bir `AuthPort` boundary'sinden gectigi calisir bir dikey dilim uretmek.

Mimari sozlesme (ADR-020 Bolum 14, ADR-021 Bolum 11):

- `packages/core` **`AuthPort`** arayuzunu tanimlar (SDK-free; hicbir Firebase SDK import etmez).
- `apps/web` `AuthPort`'u **`firebase` JS SDK (`firebase/auth`, modular v11.x)** ile implemente eder.
- `apps/mobile` `AuthPort`'u **`@react-native-firebase/auth`** (native modul) ile implemente eder.
- Firebase SDK import'lari yalnizca app-level adapter katmaninda yasar; UI ekran/komponentleri yalnizca `useAuth()` -> `AuthSummary` tuketir.

**Bagimliliklar:**

- ADR-020 (Firebase backend & data platform — Firestore, Cloud Functions, SDK stratejisi)
- ADR-021 (saf Firebase Auth, ID token, `onAuthStateChanged`, `LogoutCleanupContract`)
- SPEC-UI-001 (cross-platform form primitive, `onChangeText`) — formlar bu primitive uzerine kurulur
- Firebase Emulator Suite (Auth emulator) — bu SPEC'in tum auth senaryolari emulator uzerinde deterministik kosar; gercek Firebase projesine baglanmaz

**Guvenlik notu (HARD):** Bu SPEC auth + input-validation + secure-storage alaninda calisir. Tum requirement'lar raw ID token sizintisi (analytics/Sentry/log) ve wrong-user leak (logout/user-switch sonrasi cache + `onSnapshot` listener temizleme) acisindan denetlenmelidir (ADR-021 Bolum 13, 15.2, 15.4).

---

## Brownfield Delta Markers

Asagidaki dosyalar bu SPEC tarafindan eklenir, degistirilir veya Firebase'e uyarlanir. `[KEEP]` korunacak desen, `[MODIFY]` degistirilecek, `[NEW]` eklenecek, `[CONSUME]` mevcut ama henuz cagrilmayan modulu baglar.

| Dosya | Durum | Delta |
|-------|-------|-------|
| `packages/core/src/auth/types.ts` | [KEEP] | `AuthStatus` ve sanitized `AuthSummary` (status/userId/displayName) tip kontrati KORUNUR. ID token bu tiplerin parcasi DEGIL (raw token boundary disina cikmaz). |
| `packages/core/src/auth/AuthPort.ts` | [NEW] | SDK-free `AuthPort` arayuzu: `signIn` / `signUp` / `signOut` / `getSummary` / `subscribe(onChange)`. Firebase SDK import etmez (ADR-020 14.3). |
| `packages/core/src/auth/LogoutCleanupContract.ts` | [MODIFY] | Deterministic cleanup sozlesmesi KORUNUR; `onSnapshot` realtime listener sokme adimi eklenir (ADR-021 12.1). |
| `apps/web/src/auth/firebase.ts` | [NEW] | Web Firebase app init (`firebase/app`) + `firebase/auth` instance; persistence seviyesi yapilandirilir (ADR-021 10.2). Emulator baglanti noktasi (dev). |
| `apps/web/src/auth/firebaseAuthAdapter.ts` | [NEW] | `AuthPort`'un `firebase/auth` implementasyonu (`signInWithEmailAndPassword` / `createUserWithEmailAndPassword` / `signOut` / `onAuthStateChanged` -> `AuthSummary`). |
| `apps/web/src/auth/useAuth.ts` | [MODIFY] | `onAuthStateChanged` tabanli auth lifecycle; `login` stub gercek `AuthPort.signIn`'e baglanir; logout `LogoutCleanupContract` ile tamamlanir. |
| `apps/web/src/App.tsx` | [MODIFY] | `AuthProvider` gercek mount (yorum degil); Firebase auth listener tek bootstrap noktasinda baslar. |
| `apps/web/src/router.tsx` | [MODIFY] | Protected `/` subtree `RequireAuth`, `/auth/*` subtree `PublicOnly` ile sarilir; `returnTo` destegi. |
| `apps/web/src/pages/auth/{Login,Register,ForgotPassword,ResetPassword}Page.tsx` | [MODIFY] | `e.preventDefault()` olu formlar kaldirilir; Zod schema + `AuthPort` cagrisi; sanitized i18n hata. |
| `apps/mobile/src/auth/firebaseAuthAdapter.ts` | [NEW] | `AuthPort`'un `@react-native-firebase/auth` implementasyonu; otomatik persistence (ADR-021 10.1). |
| `apps/mobile/src/auth/secureStorage.ts` | [CONSUME] | `expo-secure-store` adapter; yalnizca Firebase oturumu DISINDAKI hassas app verisi icin (ADR-021 10.1). Ham Firebase token'i SecureStore'a elle yazilmaz. |
| `apps/mobile/src/navigation/AppNavigator.tsx` | [MODIFY] | Flat render yerine auth-state-driven conditional gating (`authenticated? Main : Auth`). |
| `apps/mobile/src/screens/auth/LoginScreen.tsx` | [MODIFY] | `(e.target as any).value` RN-bozuk kod -> `onChangeText` (SPEC-UI-001 primitive). |

---

## Requirements (EARS)

Bes EARS tipinin tamami kullanildi. Tum requirement'lar test edilebilir; token persistence / observability / authorization ifadeleri ADR-020 ve ADR-021'e dayanir.

### REQ-AUTH-001 (Ubiquitous) — Auth Boundary ve Sanitized State (AuthPort)

The system **shall** expose auth state to the UI exclusively as a sanitized `AuthSummary` (`status` / `userId` / `displayName`) and **shall** route every auth operation (sign-in, sign-up, sign-out, lifecycle subscription) through a single `AuthPort` boundary defined in `packages/core` (SDK-free); the UI **shall not** call the Firebase Auth SDK or read the raw Firebase ID token directly.

- Kapsam: web + mobil ortak `AuthPort` arayuzu (`packages/core`), UI yalnizca `useAuth()` -> `AuthSummary` tuketir.
- Invariant: raw ID token boundary icinde kalir; UI'ya/generic store'a/log'a sizmaz (ADR-021 11.2/11.3).
- `packages/core` Firebase SDK import etmez; SDK yalnizca app-level adapter'da (ADR-020 14.3).

### REQ-AUTH-002 (Optional) — Platform-Spesifik Firebase Auth Adapter (Web / Mobil)

**Where** a platform-specific auth implementation is required, the system **shall** implement the `AuthPort` interface using the platform's Firebase SDK — `firebase/auth` for `apps/web` and `@react-native-firebase/auth` for `apps/mobile` — while keeping `packages/core` SDK-free, with no own-backend session/cookie layer and no third-party identity vendor.

- Web adapter: `firebase/auth` modular API (v11.x); Firebase Auth persistence (ADR-021 10.2).
- Mobil adapter: `@react-native-firebase/auth` native modul; otomatik persistence (ADR-021 10.1); Expo development build zorunlu (ADR-020 Bolum 16, Expo Go DESTEKLENMEZ).
- Backend session/cookie katmani YOK ve Auth0/Clerk gibi ucuncu taraf identity vendor YOK (ADR-021 14.1/14.3).

### REQ-AUTH-003 (Event-Driven) — Form Canlandirma ve Sanitized Firebase Hatasi

**When** a user submits a credential form (sign-in / sign-up / password-reset), the system **shall** validate inputs with a Zod schema, call the corresponding `AuthPort` operation (`signIn` / `signUp`), and on a Firebase Auth error **shall** surface only a sanitized i18n message per the ADR-021 error taxonomy (no raw Firebase error code such as `auth/wrong-password`, no stack, no token).

- `e.preventDefault()` olu formlar kaldirilir; controlled input + `AuthPort` cagrisi (SPEC-UI-001 form primitive).
- Basarili sign-in: `onAuthStateChanged` ile `status` -> `authenticated` ve returnTo/home'a redirect (bkz. REQ-AUTH-004).
- Firebase error taxonomy'ye gore tek generic metne kor indirgeme YASAK (ADR-021 13.5); ayrik anlamli hata sinifları sanitize edilmis sekilde tasinir.

### REQ-AUTH-004 (State-Driven) — onAuthStateChanged Lifecycle ve Route Gating

**While** auth status is `unauthenticated` or `session-expired`, the system **shall** redirect protected routes to `/auth/login` preserving the originally requested path as `returnTo`; **while** the auth listener (`onAuthStateChanged`) has not yet emitted its first signal (bootstrapping), the system **shall** render a loading screen instead of either the protected content or the login form.

- Auth durumu `onAuthStateChanged` (web) / `@react-native-firebase/auth` listener (mobil) ile belirlenir; session restore'un Firebase karsiligi budur (ADR-021 9.1).
- Web: `RequireAuth` protected `/` subtree'yi, `PublicOnly` `/auth/*` subtree'yi sarar.
- Mobil: `AppNavigator` flat render yerine `authenticated? Main : Auth` conditional gating.
- UI ham "token var/yok" degil semantik durumlari tuketir (unknown/bootstrapping, authenticated, unauthenticated, refreshing, session-expired, auth-error, signing-out — ADR-021 9.2).

### REQ-AUTH-005 (Unwanted Behavior) — Deterministik Logout Cleanup ve Privacy Filtresi

**If** sign-out is triggered OR a session expires OR a user switch occurs, **then** the system **shall** call `firebaseAuth.signOut()` and deterministically clear the query cache, tear down all active `onSnapshot` realtime listeners, reset auth state, clear navigation (and reset analytics/observability user binding) — in that order — so that no previous user's data remains; and the system **shall not** emit raw ID tokens or sensitive auth claims to any observability, analytics, or log surface.

- `LogoutCleanupContract` KORUNUR ve Firebase'e uyarlanir: `signOut()` + in-memory auth context temizligi + query cache + `onSnapshot` abonelik sokme + user-scoped persisted state degerlendirmesi + analytics user binding reset (ADR-021 12.1).
- Session expiry (`id-token-expired` / `id-token-revoked`) manual logout ile ayni UX'e kor indirgenmez (ADR-021 12.2).
- Network/offline veya `signOut()` hatasi teardown'i ATLATAMAZ (best-effort).
- Privacy denylist: ID token / refresh token / sensitive claim analytics+Sentry+log'a sizmamali (ADR-021 13.4, 16.4).

---

## Kapsam Disi (What NOT to Build)

[HARD] Bu SPEC asagidakileri KAPSAMAZ:

- **Backend session/cookie auth modeli.** SPEC-AUTH-001'in own-backend HttpOnly cookie adapter'i ve Clerk iskeleti ADR-021 ile REDDEDILDI; bu SPEC onlari icermez ve yeniden kurmaz.
- **Cloud Functions `context.auth` yetki implementasyonu.** Yazma yolu yetki kontrolleri (callable Functions icinde `context.auth`) ADR-020 kapsamindadir; ayri bir backend/Functions SPEC'inde ele alinir.
- **Firestore / Storage Security Rules yazimi.** Okuma yetkisi Security Rules ile `request.auth` uzerinden degerlendirilir (ADR-021 7.1); kural semasi ve emulator testleri ayri bir SPEC kapsamindadir. Bu SPEC yalnizca client auth dikey dilimidir.
- **Ham token convenience storage adopsiyonu.** Token persistence Firebase SDK'nin sorumlulugundadir (mobil otomatik + `expo-secure-store` hassas app verisi; web Firebase persistence). Ham Firebase ID/refresh token'in `localStorage` / `AsyncStorage` / `MMKV`'ye elle yazilmasi YASAK (ADR-021 10.3).
- **MFA tam stratejisi ve custom-claims tabanli detayli RBAC.** ADR-021 Non-Goals (17); urun baglaminda ayri tasarlanir.
- **Passkey / WebAuthn implementasyonu.** Watchlist pozisyonu korunur; Firebase Auth passkey destegi olgunlastiginda degerlendirilir (ADR-021 13.10).
- **Social login provider exact konfigurasyonu ve biometric tam policy.** Social login (Apple/Google) Firebase Auth provider'i olarak yapilandirilabilir ama hangi provider'larin aktif olacagi urun baglamidir; biometric (`expo-local-authentication`) yalnizca yerel unlock katmanidir, Firebase oturumunun yerine GECMEZ ve tek auth yontemi OLAMAZ (ADR-021 13.8).
- **Tam 8-durumlu auth state machine genisletmesi.** Mevcut `AuthStatus` + `onAuthStateChanged` bootstrapping ile baslanir; tam state machine semantigi genisletmesi gerekiyorsa ayri SPEC.
