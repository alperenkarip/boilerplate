---
id: D-OBS
type: domain
name: Observability, Logging, Analytics, Debugging
kaynak-dokümanlar: 28, ADR-009
miras-tipi: yapısal
son-güncelleme: 2026-04-02
---

# D-OBS: Observability Guardrail

## Bu Guardrail Ne Zaman Aktif?
- Analytics/event tracking (A-ANALYTICS)
- Error handling implementasyonu
- Logging/debugging kodu eklerken

## Zorunlu Kurallar

### Canonical Stack
1. [ZORUNLU] Error tracking: Sentry (ADR-009)
2. [ZORUNLU] Analytics: vendor-agnostic abstraction layer (ADR-009)

### Logging
3. [YAPILMALI] Log seviyelerini doğru kullan (debug, info, warn, error)
4. [YAPILMALI] Prod'da debug log'lar kapalı olmalı
5. [YAPILMAMALI] `console.log` ile hassas veri yazdırma (D-SEC ile kesişir)
6. [YAPILMAMALI] Aşırı verbose logging — signal-to-noise oranını koru

### Error Tracking
7. [YAPILMALI] Unhandled exception'lar Sentry'ye gönderilmeli
8. [YAPILMALI] Error context (user action, screen, feature) ekle
9. [YAPILMAMALI] Sentry payload'ında PII bulunmamalı (D-SEC)
10. [YAPILMAMALI] Her expected error'ı Sentry'ye gönderme — sadece unexpected

### Analytics
11. [YAPILMALI] Event isimlendirme tutarlı convention'a uymalı (snake_case önerilen)
12. [YAPILMALI] Analytics abstraction layer üzerinden gönder — doğrudan vendor SDK çağırma
13. [YAPILMAMALI] PII içeren event property gönderme
14. [YAPILMAMALI] Her tıklama/scroll'u event olarak track etme — anlamlı event'ler seç

## Anti-pattern'ler
1. [ZAYIF] `Sentry.captureException(error, { extra: { token, email } })` — PII Sentry'ye gönderme
2. [ZAYIF] `console.log(user)` prod'da — debug log prod'ta açık
3. [ZAYIF] Her expected error Sentry'ye gönderilmiş — signal-to-noise bozuk
4. [ZAYIF] `analytics.track('click')` — anlamız event, ne tıklandığı belli değil
5. [ZAYIF] Vendor SDK doğrudan çağrılmış — abstraction layer atlanmış

## Kontrol Listesi
- [ ] Sentry entegrasyonu doğru mu?
- [ ] Analytics vendor abstraction kullanılıyor mu?
- [ ] Log'larda PII yok mu?
- [ ] Event naming tutarlı mı?

---

## Custom Performance Span

Kritik kullanıcı akışlarında uçtan uca performans ölçümü için Sentry span tanımları:

### Tanımlanması Gereken Span'ler

| Akış | Span Adı | Ölçüm Aralığı |
|------|----------|----------------|
| Giriş | `auth.login` | Giriş butonu tıklama → ana ekran render |
| Ödeme | `payment.checkout` | Ödeme başlat → onay ekranı |
| Arama | `search.query` | Arama submit → sonuç listesi render |
| Kayıt | `auth.register` | Kayıt butonu → hoş geldin ekranı |
| Sayfa yükleme | `screen.{name}.load` | Navigation start → content visible |

### Span Metadata
- [ZORUNLU] Her span'e şu metadata ekle: `userId` (hash'lenmiş), `platform` (ios/android/web), `networkType` (wifi/cellular/offline)
- [YAPILMALI] Ek context: `screenName`, `appVersion`, `deviceModel`
- [YAPILMAMALI] Span metadata'ya PII ekleme (email, telefon, ad-soyad)

### Alerting
- [ZORUNLU] p95 hedefin 2x üzerine çıkarsa Sentry alert tetikle
- [YAPILMALI] Trend bazlı alert: Haftalık p95 %20 artarsa uyar
- [YAPILMALI] Platform bazlı segmentasyon ile alert — iOS/Android/Web ayrı değerlendir

### Anti-pattern
- [ZAYIF] Span başlatılıp bitirilmemiş — memory leak ve yanlış metrik
- [ZAYIF] Tüm API çağrılarına span açma — yalnızca kritik kullanıcı akışları

---

## Log Sampling Stratejisi

Production ortamında log hacmi ve maliyeti kontrol altında tutmak için sampling kuralları:

### Seviye Bazlı Sampling (Production)

| Log Seviyesi | Sampling Oranı | Açıklama |
|-------------|---------------|----------|
| `error` | %100 | Her hata yakalanır |
| `warn` | %100 | Her uyarı yakalanır |
| `info` | %10 | Örnekleme ile azalt |
| `debug` | %0 (kapalı) | Production'da debug log açılmaz |

### Akıllı Sampling Stratejileri

**Session-based sampling:**
- Rastgele %10 session tam olarak loglanır (tüm seviyeler)
- Geri kalan %90 yalnızca error + warn

**Error-triggered sampling:**
- Bir session'da hata oluşursa, son 5 dakikalık tüm log buffer'ı gönderilir
- Ring buffer: Son 5dk info + debug log'ları bellekte tut, hata olursa flush et

### Maliyet Kontrolü
- [ZORUNLU] Aylık log hacmini izle — bütçe sınırı tanımla
- [YAPILMALI] Sınır aşıldığında info sampling oranını otomatik düşür (%10 → %5 → %1)
- [YAPILMAMALI] Maliyet kontrolü için error/warn sampling'i düşürme — bunlar her zaman %100
- [YAPILMAMALI] Log mesajına büyük JSON payload ekleme — özet bilgi yeterli

## Kaynak
- Observability → docs/quality/28-observability-and-debugging.md
- Observability kararı → docs/adr/ADR-009-observability-stack.md
