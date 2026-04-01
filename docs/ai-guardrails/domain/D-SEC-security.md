---
id: D-SEC
type: domain
name: Security, Auth, Secrets Yönetimi
kaynak-dokümanlar: 27, ADR-010
miras-tipi: zorunlu
son-güncelleme: 2026-04-01
---

# D-SEC: Security Guardrail

## Bu Guardrail Ne Zaman Aktif?
- Auth flow değişikliği (A-AUTH)
- API endpoint/entegrasyon (A-NEW-API)
- Firebase/Firestore işlemi (A-FIREBASE)
- Third-party SDK entegrasyonu (A-3RD)
- Config/environment değişikliği (A-CONFIG)
- Herhangi bir kodda credential, token, şifre işlenmesi

## Zorunlu Kurallar

### Secret Yönetimi
1. [YASAK] `.env` değerini koda hardcode etme
2. [YASAK] API key, token, şifre, credential string literal olarak kodda bulunmamalı
3. [YASAK] `console.log` ile hassas veri yazdırma (token, email, password)
4. [YASAK] Auth token'ları log/analytics/debug çıktısına sızmamalı
5. [YAPILMALI] Secret'lar environment variable üzerinden alınmalı
6. [YAPILMALI] `.env` dosyaları `.gitignore` ve `.claudeignore`'da tutulmalı

### Auth & Session
7. [ZORUNLU] Web: Backend-managed HttpOnly cookies kullan (ADR-010)
8. [ZORUNLU] Mobile: Expo SecureStore kullan (ADR-010)
9. [YAPILMAMALI] Token'ı localStorage, sessionStorage veya AsyncStorage'da tutma
10. [YAPILMAMALI] Token'ı URL query parameter'ında taşıma
11. [YAPILMALI] Session invalidation mekanizması tanımlanmalı

### Client-Side Güvenlik
12. [YAPILMAMALI] Kullanıcı girdisi sanitize edilmeden DOM'a eklenmemeli (XSS)
13. [YAPILMAMALI] Kullanıcı girdisi doğrudan SQL/NoSQL sorgusuna konulmamalı
14. [YAPILMALI] Kullanıcı girdisi backend'de de doğrulanmalı — client validation tek başına yeterli değil
15. [YAPILMAMALI] CORS policy'si wildcard (*) olarak bırakılmamalı (production)

### Observability & Privacy
16. [YASAK] Sentry payload'larında hassas veri (PII, credential, token) bulunmamalı
17. [YASAK] Analytics event'lerinde kullanıcı şifresi, token veya tam kredi kartı bilgisi gönderilmemeli
18. [YAPILMALI] Hata loglarında PII maskelenmeli veya filtrelenmeli

### Dependency Güvenliği
19. [YAPILMALI] Yeni dependency eklerken bilinen güvenlik açıklarını kontrol et (`pnpm audit`)
20. [YAPILMAMALI] Güvenlik açığı olan dependency sürümü kullanılmamalı

## Kalite Eşikleri
- [MİNİMUM] Sıfır hardcoded secret/credential
- [MİNİMUM] Auth ADR-010'a tam uyum
- [MİNİMUM] Sıfır PII sızıntısı (log, analytics, error tracking)
- [ÖNERİLEN] `pnpm audit` ile sıfır high/critical güvenlik açığı

## Anti-pattern'ler
1. [ZAYIF] `const API_KEY = "sk-..."` — hardcoded secret
2. [ZAYIF] `localStorage.setItem('token', jwt)` — güvensiz token saklama
3. [ZAYIF] `console.log(user)` — PII log'a yazma
4. [ZAYIF] `Sentry.captureException(error, { extra: { token } })` — token Sentry'ye gönderme
5. [ZAYIF] `dangerouslySetInnerHTML={{ __html: userInput }}` — XSS riski

## Kontrol Listesi
- [ ] Kodda hardcoded secret/credential yok mu?
- [ ] Auth token doğru mekanizmayla saklanıyor mu (HttpOnly cookie / SecureStore)?
- [ ] Kullanıcı girdisi sanitize ediliyor mu?
- [ ] Log/analytics'te PII sızıntısı yok mu?
- [ ] Yeni dependency güvenlik taramasından geçti mi?

## İhlal Durumunda
- Hardcoded secret → HEMEN kaldır, geçmişi temizle (git history)
- Auth mechanism uyumsuzluğu → ADR-010'a göre düzelt
- PII sızıntısı → maskeleme/filtreleme ekle
- Güvenlik açığı olan dependency → sürüm güncelle veya alternatif bul

## Kaynak
- Security baseline → docs/quality/27-security-and-secrets-baseline.md
- Auth kararı → docs/adr/ADR-010-auth-session-and-secure-storage-baseline.md
- Observability → docs/quality/28-observability-and-debugging.md
