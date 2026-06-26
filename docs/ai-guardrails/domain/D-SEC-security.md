---
id: D-SEC
type: domain
name: Security, Auth, Secrets Yönetimi
kaynak-dokümanlar: 27, ADR-021, ADR-020
miras-tipi: zorunlu
son-güncelleme: 2026-06-26
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

### Auth & Yetkilendirme (ADR-021)

7. [ZORUNLU] Auth = Firebase Auth client SDK + ID token; kendi backend session/cookie YOK — erişim `AuthPort` üzerinden (token persistence SDK tarafından yönetilir)
8. [ZORUNLU] Yetkilendirme Firestore Security Rules (`request.auth`) + Cloud Functions `context.auth` ile yapılır — client-side yetki kararına güvenme
9. [YAPILMAMALI] Raw token'ı localStorage, sessionStorage veya AsyncStorage'a manuel yazma (SDK-managed persistence dışında)
10. [YAPILMAMALI] Token'ı URL query parameter'ında taşıma
11. [YAPILMALI] Session invalidation mekanizması tanımlanmalı (`signOut` + gerekirse `revokeRefreshTokens`)

### Client-Side Güvenlik

12. [YAPILMAMALI] Kullanıcı girdisi sanitize edilmeden DOM'a eklenmemeli (XSS)
13. [YAPILMAMALI] Kullanıcı girdisi doğrulanmadan Firestore query/path'ine veya callable input'una konulmamalı — yazma yolunda Cloud Functions Zod validation + Security Rules ikili savunma
14. [YAPILMALI] Kullanıcı girdisi backend'de de doğrulanmalı — client validation tek başına yeterli değil
15. [YAPILMAMALI] CORS policy'si wildcard (\*) olarak bırakılmamalı (production)

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
2. [ZAYIF] `localStorage.setItem('token', jwt)` — raw token'ı manuel saklama; Firebase SDK persistence + `AuthPort` kullan
3. [ZAYIF] `console.log(user)` — PII log'a yazma
4. [ZAYIF] `Sentry.captureException(error, { extra: { token } })` — token Sentry'ye gönderme
5. [ZAYIF] `dangerouslySetInnerHTML={{ __html: userInput }}` — XSS riski

## Kontrol Listesi

- [ ] Kodda hardcoded secret/credential yok mu?
- [ ] Auth Firebase SDK + AuthPort üzerinden mi (raw token manuel saklanmıyor mu)?
- [ ] Yetki Security Rules + context.auth ile mi sağlanıyor (client-side yetki kararı yok mu)?
- [ ] Kullanıcı girdisi sanitize ediliyor mu?
- [ ] Log/analytics'te PII sızıntısı yok mu?
- [ ] Yeni dependency güvenlik taramasından geçti mi?

## İhlal Durumunda

- Hardcoded secret → HEMEN kaldır, geçmişi temizle (git history)
- Auth mechanism uyumsuzluğu → ADR-021'e göre düzelt (Firebase Auth + AuthPort)
- PII sızıntısı → maskeleme/filtreleme ekle
- Güvenlik açığı olan dependency → sürüm güncelle veya alternatif bul

---

## Certificate Pinning

API bağlantılarında man-in-the-middle saldırılarına karşı sertifika sabitleme kuralları:

> **Not:** Boilerplate seviyesinde tanım ve rehber sağlanır. Aktifleştirme kararı derived (türetilmiş) projeye aittir.

### Yöntem

- [YAPILMALI] Public key pinning tercih et (sertifika pinning yerine) — sertifika yenilenmesinde güncelleme gerektirmez
- [ZORUNLU] Minimum 2 pin tanımla: 1 aktif + 1 yedek (backup) — sertifika rotasyonu sırasında kesinti önlenir
- [YAPILMALI] Pin değerleri OTA (over-the-air) ile güncellenebilir olmalı — app update beklemeden rotasyon yapılabilmeli

### Ortam Bazlı Konfigürasyon

| Ortam       | Pinning Durumu | Gerekçe                               |
| ----------- | -------------- | ------------------------------------- |
| Development | Devre dışı     | Proxy/debug araçları kullanılabilmeli |
| Staging     | Aktif          | Production öncesi doğrulama           |
| Production  | Aktif          | Güvenlik zorunlu                      |

### Hata Davranışı

- [ZORUNLU] Pin doğrulaması başarısız olursa bağlantı reddedilmeli — fallback yapma
- [ZORUNLU] Kullanıcıya anlaşılır hata mesajı: "Güvenli bağlantı kurulamadı. Lütfen internet bağlantınızı kontrol edin."
- [YAPILMALI] Pin hatası Sentry'ye raporlanmalı (PII olmadan)
- [YAPILMAMALI] Pin hatası durumunda pinning'i bypass etme — güvenlik açığı oluşturur

---

## Jailbreak/Root Detection

Cihaz güvenlik durumunun algılanması ve uygulama davranışının buna göre ayarlanması:

> **Not:** Boilerplate seviyesinde rehber sağlanır. Aktifleştirme ve davranış kararı derived projeye aittir.

### Algılama Yöntemleri

**iOS (Jailbreak):**

- Cydia URL scheme kontrolü (`cydia://`)
- Sandbox escape testi (dosya yazma dışı dizine erişim)
- Bilinen jailbreak dosya path'leri kontrolü (`/Applications/Cydia.app` vb.)

**Android (Root):**

- `su` binary varlık kontrolü
- Magisk varlık tespiti
- SELinux durumu kontrolü (`enforcing` olmalı)
- Test-keys build kontrolü

### Davranış Matrisi

| Uygulama Türü       | Algılama Sonrası Davranış                                          |
| ------------------- | ------------------------------------------------------------------ |
| Genel uygulama      | Bilgilendirme uyarısı göster, kullanıma izin ver                   |
| Finansal uygulama   | Hassas işlemleri engelle (ödeme, transfer)                         |
| Hassas veri işleyen | Belirli özellikleri kısıtla (biometric, secure storage güvenilmez) |

### Kurallar

1. [YAPILMALI] Algılama sonuçları yalnızca yerel olarak değerlendirilmeli — sunucuya gönderilmemeli (privacy)
2. [YAPILMALI] False positive riski göz önünde tutulmalı — kesin engelleme yerine uyarı tercih et
3. [YAPILMALI] Algılama mantığı güncel tutulmalı — yeni jailbreak/root yöntemleri takip edilmeli
4. [YAPILMAMALI] Jailbreak/root algılamasını tek güvenlik katmanı olarak kullanma — defense-in-depth uygula
5. [YAPILMAMALI] Kullanıcıyı neden kısıtlandığı hakkında bilgilendirmeden engelleme

## WebView Güvenlik Kuralları

21. [ZORUNLU] WebView'de URL whitelist tanımla — onaylanmamış domain'e navigasyona izin verme
22. [ZORUNLU] WebView'de sadece `https://` scheme'ine izin ver (development hariç)
23. [YASAK] User input'u sanitize etmeden WebView'e JavaScript injection ile göndermek (XSS riski)
24. [YASAK] WebView içinde `eval()` veya dinamik JavaScript çalıştırma
25. [YASAK] Auth token'ı WebView URL'inde query parameter olarak taşımak
26. [YAPILMAMALI] `sharedCookiesEnabled` varsayılan olarak açık bırakmak — sadece gerekli endpoint'ler için
27. [YAPILMAMALI] WebView içinde dosya download'ı yönetmek — native download manager'a yönlendir
28. [YAPILMALI] Navigation interception ile bilinmeyen URL'leri harici tarayıcıya yönlendir (`Linking.openURL`)
29. [YAPILMALI] WebView ↔ Native iletişimini `postMessage`/`onMessage` ile yap (injection yerine)
30. [YAPILMALI] 3DS/ödeme WebView'lerinde timeout (5dk) ve callback URL yakalama uygula

---

## Cloud Functions ve Service Account Güvenliği

Server-side (Cloud Functions) secret ve yetki yönetimi kuralları (ADR-020):

1. [ZORUNLU] Cloud Functions secret'ları `defineSecret` / Secret Manager veya functions env üzerinden alınır — koda veya repoya gömülmez
2. [ZORUNLU] Service account anahtar dosyası (`serviceAccountKey.json`) repoya commit edilmez; `.gitignore` + `.claudeignore`'da tutulur
3. [ZORUNLU] Admin SDK yalnızca Cloud Functions (trusted server) içinde kullanılır — client'a admin credential sızdırılmaz
4. [YAPILMALI] Callable yetkilendirmesi: `context.auth` null kontrolü + gerekiyorsa custom claims / role doğrulaması
5. [YAPILMALI] Firestore Security Rules write default-deny; yazma yalnızca service account (Cloud Functions) ile yapılır
6. [YAPILMAMALI] Client SDK config (apiKey vb.) ile Admin SDK credential'ını karıştırma — client apiKey gizli değildir, service account gizlidir

---

## Kaynak

- Security baseline → docs/quality/27-security-and-secrets-baseline.md
- Auth kararı → docs/adr/ADR-021-authentication-platform.md
- Backend & Data Platform → docs/adr/ADR-020-backend-and-data-platform.md
- Observability → docs/quality/28-observability-and-debugging.md
