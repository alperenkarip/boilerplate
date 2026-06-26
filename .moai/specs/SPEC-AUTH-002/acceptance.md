# SPEC-AUTH-002 — Acceptance Criteria

Given-When-Then senaryolari (min 5), edge case'ler, kalite kapisi ve Definition of Done. Tum senaryolar **Firebase Auth Emulator** fixture'lari (basari / gecersiz kimlik / token-expired / gecikme) uzerinde deterministik kosar; gercek Firebase projesine baglanmaz.

## Acceptance Scenarios (Given-When-Then)

### AC-1 — Sign-in basari -> redirect (REQ-AUTH-003, REQ-AUTH-004)

- **Given** olu olmayan `LoginPage` (form canli, `e.preventDefault` kaldirilmis) ve `/protected` (ornegin `/sample`) kaynagina `returnTo` ile yonlendirilmis kullanici,
- **When** kullanici gecerli kimlik bilgisiyle formu doldurur ve submit eder,
- **Then** Zod schema parse gecer, `AuthPort.signIn` (Firebase Auth adapter) cagrilir, emulator basari fixture'i ile `onAuthStateChanged` `status`'u `authenticated` yapar ve kullanici `returnTo` yoksa `/`'a, varsa korunan path'e redirect edilir.
- **And** UI'a yalnizca sanitized `AuthSummary` (status/userId/displayName) yansir; raw Firebase ID token DOM'da/state'te/log'da gorunmez.

### AC-2 — Protected route guard + bootstrap loading (REQ-AUTH-004)

- **Given** `unauthenticated` durumda kullanici ve guard ile sarilmis protected `/` subtree,
- **When** kullanici dogrudan korumali bir route'a (`/sample`, `/settings`) erismeye calisir,
- **Then** `RequireAuth` kullaniciyi `/auth/login`'e redirect eder ve orijinal path `returnTo` olarak korunur.
- **And** `onAuthStateChanged` ilk sinyalini vermeden (bootstrapping) protected icerik de login formu da gosterilmez; loading ekrani render edilir.

### AC-3 — Mobil conditional gating + Firebase persistence (REQ-AUTH-001, REQ-AUTH-002, REQ-AUTH-004)

- **Given** mobil `AppNavigator` ve `@react-native-firebase/auth` ile kalici tutulmus oturum,
- **When** uygulama acilir ve auth listener calisir,
- **Then** auth-state-driven gating `authenticated? Main : Auth` ile dogru stack secilir (flat render DEGIL); oturum Firebase SDK persistence ile geri yuklenir, ham Firebase token elle `AsyncStorage`/`MMKV`/`expo-secure-store`'a yazilmaz.
- **And** `LoginScreen` `onChangeText` ile calisir (`(e.target as any).value` RN-bozuk kod kalmaz); UI yalnizca `AuthPort` -> `AuthSummary` tuketir, `@react-native-firebase` SDK'sini dogrudan cagirmaz.

### AC-4 — Logout/user-switch cleanup + privacy (REQ-AUTH-005)

- **Given** `authenticated` kullanici, dolu query cache (onceki kullanici verisi) ve aktif `onSnapshot` realtime listener'lari,
- **When** logout tetiklenir (emulator/network signOut hatasi dondurse bile) VEYA farkli kullanici girisi (user switch) olur,
- **Then** deterministik sirada: `firebaseAuth.signOut()` cagrilir, `queryClient.clear()` calisir, tum `onSnapshot` abonelikleri sokulur, auth state `unauthenticated`'a reset olur, navigation `/auth/login` (web) / `Auth` stack (mobil) reset edilir ve analytics/observability user binding resetlenir.
- **And** `signOut` hatasi teardown'i ATLATMAZ; onceki kullanicinin hicbir cache verisi veya canli listener'i kalmaz (wrong-user leak yok, memory leak yok).
- **And** raw ID token / refresh token / sensitive claim hicbir analytics/Sentry/log surface'ine yazilmaz.

### AC-5 — Sanitized Firebase error (REQ-AUTH-003)

- **Given** canli `LoginPage`,
- **When** kullanici gecersiz kimlikle submit eder ve Firebase Auth `auth/wrong-password` (veya `auth/user-not-found`) doner,
- **Then** kullaniciya ADR-021 error taxonomy'sine gore sanitized i18n mesaj gosterilir (ham Firebase error code / stack / token DEGIL); ayrik hata anlamlari tek generic metne kor indirgenmez; form yeniden denenebilir kalir.

---

## Edge Cases

- **Network/offline bootstrap:** Auth listener offline'da ilk sinyali geciktirirse guard bootstrapping (loading) durumunu korur; kullanici sert logout'a/`unauthenticated`'a zorlanmaz (ADR-021 9.1 lifecycle).
- **Token expiry/revoke:** `id-token-expired` / `id-token-revoked` durumu `session-expired` olarak siniflandirilir ve manual logout ile ayni UX'e kor indirgenmez (ADR-021 12.2); kullaniciya reauth yolu sunulur.
- **Authenticated kullanici `/auth/login`'e gider:** `PublicOnly` onu home/returnTo'ya geri yonlendirir (login formuna dusmez).
- **returnTo open-redirect:** `returnTo` yalnizca uygulama-ici relative path olmali; mutlak/harici URL reddedilir (acik yonlendirme guvenligi).
- **Cift submit:** `AuthPort` cagrisi pending iken submit butonu disabled; cift sign-in istegi gitmez.
- **User switch:** Yeni kullanici girisinde ayni teardown sirasi calisir; ilk kullanicinin cache'i, `onSnapshot` listener'i ve persisted user-scoped state'i ikinci kullaniciya sizmaz (ADR-021 12.3).
- **onSnapshot listener leak:** Logout/user switch sonrasi sokulmeyen realtime abonelik wrong-user leak + memory leak uretir; `LogoutCleanupContract` listener sokmeyi zorunlu kilar (ADR-021 15.4).
- **AuthPort SDK-free siniri:** `packages/core` Firebase SDK import etmemeli; SDK yalnizca app-level adapter'da bulunmali (ADR-020 14.3, derleme/lint ile dogrulanir).

---

## Kalite Kapisi (Quality Gate)

- **Tested:** Yeni public yuzeyler (`AuthPort`, web/mobil `firebaseAuthAdapter`, `RequireAuth`, `PublicOnly`, `onAuthStateChanged` tabanli `useAuth`, `LogoutCleanupContract` listener sokme) icin birim/integration test; senaryolar Firebase Auth Emulator uzerinde kosar. Auth/core kritik paket -> yuksek coverage hedefi (SPEC-TEST-001 esigi).
- **Secured:** Raw ID/refresh token sizinti yok (Sentry denylist assertion'i ile dogrulanir); wrong-user leak yok (logout sonrasi cache bos + `onSnapshot` sokuldu); input validation Zod ile; Firebase persistence disinda ham token saklama YOK; `packages/core` SDK-free. Auth alani -> guvenlik review zorunlu (ADR-021 16).
- **Readable:** ADR-020/ADR-021 referansli yorumlar; sanitized `AuthPort` boundary acik; vendor (Firebase) detayi UI'ya sizmaz.
- **Unified:** SPEC-UI-001 form primitive desenine uyum; eslint temiz; port/adapter isimlendirmesi ADR-020 ile tutarli (`AuthPort` / `DataReadPort` / `FunctionsCallPort`).
- **Trackable:** commit `SPEC-AUTH-002` referansli; @MX tag'leri (ANCHOR/WARN) plan asamasina gore eklenir.

---

## Definition of Done

- [ ] REQ-AUTH-001..005 tum acceptance senaryolari (AC-1..AC-5) gecer.
- [ ] `packages/core` `AuthPort` SDK-free tanimli; Firebase SDK import etmiyor (lint/derleme ile dogrulandi).
- [ ] `apps/web` `firebase/auth` adapter ve `apps/mobile` `@react-native-firebase/auth` adapter `AuthPort`'u implemente ediyor.
- [ ] `App.tsx` `AuthProvider` gercek mount; `onAuthStateChanged` tek bootstrap noktasinda baslar (cift listener yok).
- [ ] `router.tsx` protected `/` subtree `RequireAuth`, `/auth/*` `PublicOnly` ile sarili; returnTo calisir.
- [ ] 4 web formu canli (`e.preventDefault` yok), Zod + `AuthPort` cagrisi; sanitized i18n hata (ham Firebase code degil).
- [ ] Mobil `AppNavigator` conditional gating; oturum Firebase persistence ile geri yuklenir; `LoginScreen` `onChangeText`.
- [ ] `LogoutCleanupContract` deterministik (signOut + cache clear + `onSnapshot` teardown + state reset + nav reset + analytics binding reset); signOut hatasi atlamaz.
- [ ] Session expiry manual logout'tan ayri siniflandirilir (`session-expired`).
- [ ] Sentry/analytics privacy filtresi: raw ID/refresh token + sensitive claim sizmiyor (test ile dogrulandi).
- [ ] Backend session/cookie modeli ve Clerk/own-backend adapter EKLENMEDI (SPEC-AUTH-001 supersede edildi); ham token convenience storage YOK.
- [ ] Kalite kapisi (Tested/Secured/Readable/Unified/Trackable) gecer; guvenlik review tamam.
