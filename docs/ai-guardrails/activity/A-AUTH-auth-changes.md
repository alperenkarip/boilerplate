---
id: A-AUTH
type: activity
name: Auth Flow Değişikliği
tetiklenen-domain-guardrails: [D-SEC, D-BIO]
araç-zorunlulukları:
  spec: zorunlu
  stitch: —
  codex: zorunlu
son-güncelleme: 2026-06-26
---

# A-AUTH: Auth Değişikliği Guardrail

## Ön Koşullar

1. ADR-021 oku — Firebase Auth kararı (canonical auth platform)
2. D-SEC guardrail'ini oku — security kuralları
3. SPEC oluştur — auth değişikliği karmaşıklık >= 5

## Aktif Domain Guardrail'ler

- **D-SEC** → Token yönetimi, secret, yetkilendirme, client-side güvenlik
- **D-BIO** → Biometric auth (Face ID, Touch ID, fingerprint) güvenlik ve UX kuralları

## Kaynak Doküman Referansları

- ADR-021 — Firebase Auth (client SDK + ID token, kendi backend session yok)
- ADR-020 — Backend & Data Platform (yetki: Security Rules + Cloud Functions context.auth)
- 27-security-and-secrets-baseline.md — Güvenlik temeli

## Aktiviteye Özel Kurallar (Firebase Auth)

1. signIn/signOut Firebase Auth client SDK üzerinden — `AuthPort` ile soyutlanır; kendi backend session/cookie YOK (ADR-021)
2. Oturum durumu `onAuthStateChanged` ile dinlenir; ID token SDK tarafından yönetilir ve callable/Firestore'a otomatik taşınır
3. [YASAK] Raw ID/refresh token'ı convenience storage'a (localStorage, AsyncStorage) veya URL'e yazma — token persistence SDK'nın sorumluluğundadır, erişim `AuthPort` üzerinden
4. Session invalidation: `signOut()` + gerekirse Cloud Functions ile token revoke (`revokeRefreshTokens`)
5. Logout'ta tüm kullanıcıya özel state ve cache temizle (D-STA, D-OFL ile kesişir)
6. Auth error handling net olmalı — Firebase Auth error kodları (`auth/...`) map edilir (D-ERR)
7. Yetkilendirme client'ta değil: Firestore Security Rules (`request.auth`) + Cloud Functions `context.auth` ile yapılır

## Auth Flow Regression Test

8. Her auth PR'ında aşağıdaki E2E senaryolar CI'da zorunlu olarak çalışmalı:
   - Login (email / social / biometric)
   - Logout (tek cihaz / tüm cihazlar — `revokeRefreshTokens`)
   - Token refresh (normal / expired / concurrent — SDK otomatik refresh)
   - Session expire (otomatik yönlendirme, `onAuthStateChanged`)
   - Password reset (tam akış)
   - Account deletion (GDPR uyumlu silme)
9. Auth E2E test'leri her auth PR'ında CI pipeline'da zorunlu — skip edilemez
10. Flaky test kabul edilmez — flaky tespit edilirse önce test stabilize edilir, sonra PR merge edilir

## DoD Ek Maddeleri

- [ ] ADR-021 uyumu (Firebase Auth, kendi backend session yok)
- [ ] Auth erişimi `AuthPort` üzerinden — raw token convenience storage'a yazılmıyor
- [ ] `onAuthStateChanged` ile oturum lifecycle yönetiliyor
- [ ] Session invalidation tanımlı (signOut + gerekirse token revoke)
- [ ] Logout state/cache cleanup var
- [ ] Yetki Security Rules + context.auth ile (client-side yetki kararı yok)
- [ ] Auth E2E regression test'leri geçiyor (login, logout, token refresh, session expire, password reset, account deletion)
- [ ] Flaky test yok
- [ ] Security review geçmiş
