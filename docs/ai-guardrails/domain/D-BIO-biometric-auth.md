---
id: D-BIO
type: domain
name: Biometric Authentication Yönetimi
kaynak-dokümanlar: ADR-010 (biometric eki), 27
miras-tipi: zorunlu
son-güncelleme: 2026-04-01
---

# D-BIO: Biometric Authentication Guardrail

## Bu Guardrail Ne Zaman Aktif?
- Auth flow değişikliği — biometric içeriyorsa (A-AUTH)
- Yeni feature geliştirme — biometric unlock (A-NEW-FEAT)
- Biometric entegrasyon veya güncelleme

## Zorunlu Kurallar

### SDK & Altyapı
1. [ZORUNLU] `expo-local-authentication` kullanılmalı (ADR-010 eki)
2. [ZORUNLU] SecurityLevel kontrolü yapılmalı (BIOMETRIC_STRONG tercih)
3. [ZORUNLU] Enrollment durumu kontrol edilmeli — cihazda kayıtlı biometric var mı?

### Fallback & Erişilebilirlik
4. [YASAK] Biometric'i tek auth yöntemi olarak sunma — fallback zorunlu
5. [ZORUNLU] Biometric her zaman fallback ile sunulmalı (PIN, şifre)
6. [ZORUNLU] Accessibility: biometric kullanamayan kullanıcılar için alternatif her zaman mevcut olmalı

### Güvenlik & Gizlilik
7. [YASAK] Biometric veri backend'e gönderilmemeli
8. [YASAK] Biometric sonucu Sentry/analytics'e gönderilmemeli (privacy)
9. [YAPILMALI] Biometric başarısız olduğunda rate limiting uygulanmalı

### UX & i18n
10. [ZORUNLU] Biometric prompt mesajı lokalize edilmeli (i18n)
11. [YASAK] Biometric enrollment durumunu sorgulamadan prompt gösterme
12. [YAPILMALI] Biometric yeteneği olmayan cihazlarda graceful fallback

## Kalite Eşikleri
- [MİNİMUM] expo-local-authentication kullanımı (ADR-010 eki uyumu)
- [MİNİMUM] Fallback auth mekanizması mevcut (PIN, şifre)
- [MİNİMUM] Biometric veri backend'e gönderilmiyor
- [MİNİMUM] Enrollment durumu kontrol ediliyor
- [ÖNERİLEN] SecurityLevel BIOMETRIC_STRONG kontrolü yapılıyor
- [ÖNERİLEN] Rate limiting biometric hata durumunda aktif

## Anti-pattern'ler
1. [ZAYIF] `LocalAuthentication.authenticateAsync()` tek auth yöntemi — fallback yok
2. [ZAYIF] Enrollment kontrol edilmeden biometric prompt gösterme — hata
3. [ZAYIF] `analytics.track('biometric_result', { success, userId })` — biometric sonucu analytics'e
4. [ZAYIF] `fetch('/api/auth', { body: { biometricData } })` — biometric veri backend'e gönderme
5. [ZAYIF] Hardcoded biometric prompt: `"Touch ID ile giriş yapın"` — lokalize edilmemiş

## Kontrol Listesi
- [ ] expo-local-authentication kullanılıyor mu?
- [ ] Enrollment durumu kontrol ediliyor mu?
- [ ] SecurityLevel kontrolü yapılıyor mu?
- [ ] Fallback auth mekanizması (PIN, şifre) mevcut mu?
- [ ] Biometric veri backend'e gönderilmiyor mu?
- [ ] Biometric sonucu analytics/Sentry'ye sızmıyor mu?
- [ ] Prompt mesajı lokalize mi (i18n)?
- [ ] Biometric kullanamayan kullanıcılar için alternatif var mı?

## İhlal Durumunda
- Fallback yok → PIN/şifre fallback ekle
- Biometric veri backend'e gidiyor → HEMEN kaldır, sadece local kullan
- Enrollment kontrol edilmiyor → enrollment check ekle
- Biometric sonucu analytics'te → event'i kaldır veya anonimleştir
- Prompt lokalize değil → i18n key kullan

## Kaynak
- Auth kararı → docs/adr/ADR-010-auth-session-and-secure-store-baseline.md
- Security baseline → docs/quality/27-security-and-secrets-baseline.md
