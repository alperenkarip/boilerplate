---
id: D-BIO
type: domain
name: Biometric Authentication Yönetimi
kaynak-dokümanlar: ADR-010 (biometric eki), 27
miras-tipi: zorunlu
son-güncelleme: 2026-04-02
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

### Biometric Fallback Chain
13. [ZORUNLU] Fallback zinciri sırasıyla uygulanmalı:
    1. Face ID (varsa ve destekleniyorsa)
    2. Touch ID / Parmak İzi (Face ID yoksa veya başarısızsa)
    3. Device PIN / Cihaz Kilidi (biometric başarısızsa)
    4. Uygulama PIN (opsiyonel — uygulamada tanımlandıysa)
14. [YAPILMALI] Her adımda başarısızlık durumunda sonraki yönteme geçiş butonu gösterilmeli
15. [YAPILMALI] Aynı yöntemde 3 ardışık başarısızlık → otomatik olarak bir sonraki yönteme düşmeli
16. [ZORUNLU] Tüm biometric yöntemler başarısız olursa → "Şifre ile giriş yap" seçeneği her zaman erişilebilir olmalı
17. [ZORUNLU] Cihazda biometric değişikliği tespit edildiğinde (yeni parmak izi, yeni yüz) → re-authentication zorunlu

### Biometric Veri Güvenliği Bildirimi
18. [ZORUNLU] Biometric setup ekranında kullanıcıya açık bilgilendirme gösterilmeli: "Biyometrik verileriniz yalnızca cihazınızda saklanır, sunucularımıza iletilmez"
19. [ZORUNLU] Privacy policy'de biometric veri kullanımı açıkça belirtilmeli
20. [ZORUNLU] Biometric aktivasyonu opt-in consent ile yapılmalı — varsayılan olarak aktif olmamalı
21. [YAPILMALI] Teknik güvence: İşletim sistemi yalnızca match/no-match sonucu döner, ham biometric veri uygulamaya ulaşmaz
22. [YASAK] Sunucuda biometric veri (parmak izi template, yüz verisi vb.) saklanmamalı

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
6. [ZAYIF] Biometric başarısız olduğunda doğrudan hata ekranı — fallback chain uygulanmamış
7. [ZAYIF] Biometric setup'ta kullanıcı bilgilendirmesi yok — veri güvenliği bildirimi eksik
8. [ZAYIF] Biometric varsayılan olarak aktif — opt-in consent alınmamış
9. [ZAYIF] Cihazda yeni biometric eklendiğinde re-auth yapılmıyor — güvenlik açığı

## Kontrol Listesi
- [ ] expo-local-authentication kullanılıyor mu?
- [ ] Enrollment durumu kontrol ediliyor mu?
- [ ] SecurityLevel kontrolü yapılıyor mu?
- [ ] Fallback chain uygulanıyor mu (Face ID → Touch ID → Device PIN → Şifre)?
- [ ] 3 ardışık başarısızlıkta otomatik fallback var mı?
- [ ] Tüm yöntemler başarısız olduğunda "Şifre ile giriş" mevcut mu?
- [ ] Biometric değişikliğinde re-auth tetikleniyor mu?
- [ ] Biometric veri backend'e gönderilmiyor mu?
- [ ] Biometric sonucu analytics/Sentry'ye sızmıyor mu?
- [ ] Prompt mesajı lokalize mi (i18n)?
- [ ] Setup ekranında veri güvenliği bildirimi var mı?
- [ ] Privacy policy'de biometric kullanımı açıklanmış mı?
- [ ] Biometric aktivasyonu opt-in consent ile mi?
- [ ] Biometric kullanamayan kullanıcılar için alternatif var mı?

## İhlal Durumunda
- Fallback yok → PIN/şifre fallback ekle
- Biometric veri backend'e gidiyor → HEMEN kaldır, sadece local kullan
- Enrollment kontrol edilmiyor → enrollment check ekle
- Biometric sonucu analytics'te → event'i kaldır veya anonimleştir
- Prompt lokalize değil → i18n key kullan

## Kaynak
- Auth kararı → docs/adr/ADR-010-auth-session-and-secure-storage-baseline.md
- Security baseline → docs/quality/27-security-and-secrets-baseline.md
