---
id: A-PAYMENT
type: activity
name: In-App Purchase/Subscription Geliştirme
tetiklenen-domain-guardrails: [D-PAY, D-SEC, D-PRI]
araç-zorunlulukları:
  spec: zorunlu
  stitch: —
  codex: zorunlu
son-güncelleme: 2026-04-02
---

# A-PAYMENT: In-App Purchase/Subscription Guardrail

## Ön Koşullar
1. ADR-016 oku — payment/subscription stratejisi
2. D-PAY guardrail'ini oku — ödeme kuralları
3. D-PRI guardrail'ini oku — gizlilik gereksinimleri
4. D-SEC guardrail'ini oku — güvenlik kuralları
5. Store guideline'ları kontrol et — Apple IAP rules, Google Play billing policy

## Aktif Domain Guardrail'ler
- **D-PAY** → RevenueCat SDK, receipt validation, entitlement, store guideline uyumu
- **D-SEC** → Ödeme bilgisi güvenliği, hassas veri koruması
- **D-PRI** → PII koruması, ödeme verisinin gizliliği

## Aktiviteye Özel Kurallar
1. RevenueCat SDK (`react-native-purchases`) kullanılmalı (ADR-016)
2. Sandbox ortamında test zorunlu — production'da test purchase yapma
3. Entitlement çift taraflı kontrol (client + server) — sadece client-side yeterli değil
4. Fiyat locale-aware gösterilmeli — hardcoded fiyat yasak, store'dan dinamik çek
5. Subscription lifecycle state'lerini yönet — active, expired, grace period, billing retry
6. Error handling: purchase failed, cancelled, deferred durumlarını ele al
7. Restore purchases akışı implementasyonu zorunlu — kullanıcı cihaz değiştiğinde

## Sandbox Test Checklist
8. Her ödeme PR'ında aşağıdaki senaryolar sandbox ortamında test edilmeli:

| Test Senaryosu | Apple Sandbox | Google Test | Beklenen Sonuç |
|---------------|--------------|-------------|---------------|
| Satın alma | Sandbox account | Internal testing | Başarılı purchase + entitlement |
| Abonelik yenileme | Hızlandırılmış yenileme | License test | Otomatik yenileme + state güncelleme |
| İptal | Sandbox'tan iptal | Play Console'dan iptal | Süre sonunda entitlement kaldırma |
| Geri yükleme | Restore purchases | Restore purchases | Önceki satın almalar geri yüklenir |
| Ödeme başarısızlığı | Interrupted purchase | Payment declined | Graceful error + retry seçeneği |
| Upgrade/Downgrade | Plan değiştirme | Plan değiştirme | Proration doğru uygulanır |
| Refund | Sandbox refund | Test refund | Entitlement kaldırılır |

9. **Apple:** Settings → Sandbox Account ile test ortamı
10. **Google:** Internal testing track + license test kullanıcıları
11. **RevenueCat:** Sandbox mode aktif + debug logs ile doğrulama

## DoD Ek Maddeleri
- [ ] ADR-016 uyumu sağlanmış
- [ ] Sandbox test geçmiş (tüm senaryolar: satın alma, yenileme, iptal, geri yükleme, başarısızlık, upgrade/downgrade, refund)
- [ ] Entitlement kontrolü çift taraflı (client + server)
- [ ] Restore purchases çalışıyor
- [ ] Fiyat locale-aware gösteriliyor
- [ ] Store guideline uyumu doğrulanmış
- [ ] PII ödeme loglarında yok
- [ ] Error handling (failed, cancelled, deferred) tanımlı
- [ ] Subscription lifecycle state'leri yönetiliyor
- [ ] D-SEC kontrol listesi geçmiş
- [ ] D-PRI kontrol listesi geçmiş
