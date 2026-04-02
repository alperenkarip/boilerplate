---
id: A-AUTH
type: activity
name: Auth Flow Değişikliği
tetiklenen-domain-guardrails: [D-SEC, D-BIO]
araç-zorunlulukları:
  spec: zorunlu
  stitch: —
  codex: zorunlu
son-güncelleme: 2026-04-02
---

# A-AUTH: Auth Değişikliği Guardrail

## Ön Koşullar
1. ADR-010 oku — auth kararları
2. D-SEC guardrail'ini oku — security kuralları
3. SPEC oluştur — auth değişikliği karmaşıklık >= 5

## Aktif Domain Guardrail'ler
- **D-SEC** → Token yönetimi, secret, session, client-side güvenlik
- **D-BIO** → Biometric auth (Face ID, Touch ID, fingerprint) güvenlik ve UX kuralları

## Kaynak Doküman Referansları
- ADR-010 — Auth, session ve secure storage kararları
- 27-security-and-secrets-baseline.md — Güvenlik temeli

## Aktiviteye Özel Kurallar
1. Web: HttpOnly cookie — localStorage/sessionStorage yasak (ADR-010)
2. Mobile: Expo SecureStore (ADR-010)
3. Token'ı URL'de taşıma
4. Session invalidation mekanizması tanımla
5. Logout'ta tüm state temizle (D-STA ile kesişir)
6. Auth error handling net olmalı (D-ERR)

## Auth Flow Regression Test
7. Her auth PR'ında aşağıdaki E2E senaryolar CI'da zorunlu olarak çalışmalı:
   - Login (email / social / biometric)
   - Logout (tek cihaz / tüm cihazlar)
   - Token refresh (normal / expired / concurrent)
   - Session expire (otomatik yönlendirme)
   - Password reset (tam akış)
   - Account deletion (GDPR uyumlu silme)
8. Auth E2E test'leri her auth PR'ında CI pipeline'da zorunlu — skip edilemez
9. Flaky test kabul edilmez — flaky tespit edilirse önce test stabilize edilir, sonra PR merge edilir

## DoD Ek Maddeleri
- [ ] ADR-010 uyumu
- [ ] Token güvenli saklanıyor
- [ ] Session invalidation tanımlı
- [ ] Logout state cleanup var
- [ ] Auth E2E regression test'leri geçiyor (login, logout, token refresh, session expire, password reset, account deletion)
- [ ] Flaky test yok
- [ ] Security review geçmiş
