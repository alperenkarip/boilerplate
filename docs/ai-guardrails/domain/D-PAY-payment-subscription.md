---
id: D-PAY
type: domain
name: Payment/Subscription Yönetimi
kaynak-dokümanlar: ADR-016, 27
miras-tipi: zorunlu
son-güncelleme: 2026-04-01
---

# D-PAY: Payment/Subscription Guardrail

## Bu Guardrail Ne Zaman Aktif?
- In-app purchase/subscription geliştirme (A-PAYMENT)
- Yeni feature geliştirme — ödeme içeriyorsa (A-NEW-FEAT)
- Third-party ödeme service entegrasyonu (A-3RD)
- Entitlement kontrolü veya subscription state yönetimi

## Zorunlu Kurallar

### SDK & Altyapı
1. [ZORUNLU] RevenueCat SDK (`react-native-purchases`) kullanılmalı (ADR-016)
2. [ZORUNLU] Receipt validation server-side yapılmalı
3. [ZORUNLU] Entitlement kontrolü client + server çift taraflı yapılmalı
4. [ZORUNLU] Store guideline'larına uyum zorunlu (Apple IAP rules, Google Play billing)

### Ödeme Akışı
5. [ZORUNLU] Sandbox ortamında test zorunlu — production purchase test yasak
6. [ZORUNLU] Subscription state değişikliklerinde UI hemen güncellenmelidir (optimistic veya webhook-driven)
7. [ZORUNLU] Restore purchases akışı implementasyonu zorunlu
8. [YAPILMALI] Error handling: purchase failed, cancelled, deferred durumları yönetilmeli

### Görüntüleme & i18n
9. [ZORUNLU] Fiyat gösteriminde locale-aware formatting kullanılmalı (i18n entegrasyonu)
10. [YAPILMALI] Ürün bilgileri store'dan dinamik çekilmeli — hardcoded fiyat yasak

### Güvenlik & Gizlilik
11. [YASAK] Ödeme bilgileri (kredi kartı, fatura) client-side'da saklanmamalı
12. [YASAK] Ödeme akışını kendi custom UI ile bypass etme (store policy ihlali)
13. [YASAK] Gerçek fiyat/kart bilgisini log/analytics'e gönderme
14. [YASAK] Production ortamında test purchase yapma

## Kalite Eşikleri
- [MİNİMUM] RevenueCat SDK kullanımı (ADR-016 uyumu)
- [MİNİMUM] Server-side receipt validation
- [MİNİMUM] Entitlement çift taraflı kontrol (client + server)
- [MİNİMUM] Sandbox test geçmiş
- [MİNİMUM] Restore purchases çalışır durumda
- [ÖNERİLEN] Store guideline uyumu doğrulanmış

## Anti-pattern'ler
1. [ZAYIF] `AsyncStorage.setItem('cardNumber', card)` — ödeme bilgisi client'ta
2. [ZAYIF] `console.log({ price, cardLast4 })` — ödeme bilgisi log'da
3. [ZAYIF] Hardcoded fiyat: `<Text>$9.99/ay</Text>` — store'dan dinamik çekilmeli
4. [ZAYIF] Entitlement sadece client-side kontrol — server-side bypass riski
5. [ZAYIF] Custom ödeme UI ile store bypass — policy ihlali
6. [ZAYIF] Production'da test purchase — gerçek kullanıcıları etkiler

## Kontrol Listesi
- [ ] RevenueCat SDK kullanılıyor mu?
- [ ] Receipt validation server-side mı?
- [ ] Entitlement çift taraflı kontrol var mı (client + server)?
- [ ] Sandbox test geçmiş mi?
- [ ] Restore purchases çalışıyor mu?
- [ ] Fiyat locale-aware gösteriliyor mu?
- [ ] Ödeme bilgisi log/analytics'e sızmıyor mu?
- [ ] Store guideline'lara uyum sağlanmış mı?

## İhlal Durumunda
- Client-side ödeme bilgisi → HEMEN kaldır, güvenli depolamaya taşı
- Server-side validation eksik → backend receipt validation ekle
- Tek taraflı entitlement → server-side kontrol ekle
- Store guideline ihlali → guideline'a uyacak şekilde düzelt
- PII ödeme loglarında → maskeleme/filtreleme ekle

## Kaynak
- Payment kararı → docs/adr/ADR-016-payment-subscription-strategy.md
- Security baseline → docs/quality/27-security-and-secrets-baseline.md
