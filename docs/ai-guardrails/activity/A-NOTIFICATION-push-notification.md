---
id: A-NOTIFICATION
type: activity
name: Push Notification Geliştirme
tetiklenen-domain-guardrails: [D-NTF, D-SEC, D-PRI]
araç-zorunlulukları:
  spec: önerilir
  stitch: —
  codex: önerilir
son-güncelleme: 2026-04-02
---

# A-NOTIFICATION: Push Notification Geliştirme Guardrail

## Ön Koşullar
1. ADR-013 oku — push notification stratejisi
2. D-NTF guardrail'ini oku — notification kuralları
3. D-PRI guardrail'ini oku — consent gereksinimleri
4. D-SEC guardrail'ini oku — güvenlik kuralları

## Aktif Domain Guardrail'ler
- **D-NTF** → Push notification SDK, permission, payload, deep link, analytics
- **D-SEC** → Token güvenliği, hassas veri koruması
- **D-PRI** → Consent yönetimi, PII koruması

## Aktiviteye Özel Kurallar
1. `expo-notifications` kullanılmalı (ADR-013)
2. Permission request UX akışı tasarlanmalı — pre-permission screen ile kullanıcıya neden izin istendiği açıklanmalı
3. Android: notification channel tanımla — kanal adı ve açıklaması lokalize edilmeli
4. iOS: provisional notification desteği düşünülmeli — sessiz bildirim ile başlangıç
5. Push token'ı güvenli şekilde backend'e gönder — HTTPS üzerinden, log'a yazmadan
6. Notification → deep link routing tanımla — her notification türü için hedef ekran belirle
7. Analytics event'leri ekle — received, opened, dismissed event'leri tanımla
8. Test: notification mock ile test edilmeli — gerçek push gönderilmemeli

## Notification A/B Test
9. **Test değişkenleri:** Başlık, gövde metni, gönderim zamanı, rich media (resim/video) varlığı
10. **Ölçüm metrikleri:**
    - Open rate (bildirim açılma oranı)
    - CTR (Click-Through Rate)
    - Conversion (hedef aksiyona dönüşüm)
    - Opt-out rate (bildirim kapatma oranı)
11. **Split:** %50/%50 veya %10/%90 (küçük örnekle pilot)
12. **Minimum süre:** 1 hafta — istatistiksel anlamlılık için yeterli veri toplanmalı
13. **Araç:** RevenueCat experiments veya Firebase A/B Testing
14. **Sonuç:** Winner variant production'a promote edilir, kaybeden kaldırılır

## DoD Ek Maddeleri
- [ ] ADR-013 uyumu sağlanmış
- [ ] Permission UX akışı var (pre-permission screen)
- [ ] Android notification channel tanımlı
- [ ] Notification → deep link routing çalışıyor
- [ ] PII notification payload'da yok
- [ ] Analytics event'leri tanımlı (received, opened, dismissed)
- [ ] Notification A/B test metrikleri tanımlanmış (varsa)
- [ ] Test ortamında mock kullanılıyor
- [ ] D-SEC kontrol listesi geçmiş
- [ ] D-PRI kontrol listesi geçmiş
