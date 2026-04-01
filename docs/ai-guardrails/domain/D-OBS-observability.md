---
id: D-OBS
type: domain
name: Observability, Logging, Analytics, Debugging
kaynak-dokümanlar: 28, ADR-009
miras-tipi: yapısal
son-güncelleme: 2026-04-01
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

## Kaynak
- Observability → docs/quality/28-observability-and-debugging.md
- Observability kararı → docs/adr/ADR-009-observability-stack.md
