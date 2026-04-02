---
id: D-PAY
type: domain
name: Payment/Subscription Yönetimi
kaynak-dokümanlar: ADR-016, 27
miras-tipi: zorunlu
son-güncelleme: 2026-04-02
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

---

## Free Trial → Paid Conversion UX

Ücretsiz deneme sürecinden ücretli aboneliğe geçiş akışı:

### Akış Zaman Çizelgesi
```
Trial başlangıç → %50 noktası (soft reminder) → 3 gün kala (push notification)
→ 1 gün kala (ödeme ekranı yönlendirme) → Trial bitti (plan seçim ekranı)
```

### Aşama Detayları

| Aşama | Zamanlama | Eylem |
|-------|-----------|-------|
| Başlangıç | Trial ilk gün | Premium özellikleri keşfet CTA, trial süre göstergesi |
| Soft reminder | Trial %50 noktası | In-app banner: "Trial sürenizin yarısı doldu" |
| Push hatırlatma | 3 gün kala | Push notification: "Premium denemeniz yakında bitiyor" |
| Ödeme yönlendirme | 1 gün kala | Ödeme ekranı göster, indirim teklifi (opsiyonel) |
| Trial sonu | Süre bitimi | Plan seçim ekranı, free tier'a düşür |

### Paywall Seçenekleri
- **Hard paywall:** Trial bitince premium özellikler tamamen kilitlenir → plan seçimi zorunlu
- **Soft paywall:** Bazı özellikler kısıtlı erişilebilir → yükseltme teşviki
- [YAPILMALI] Paywall türünü feature önemine göre belirle — çekirdek değer hard, ek özellik soft

### Tracking Event'leri
- [ZORUNLU] Şu event'leri tanımla: `trial_started`, `trial_midpoint_reminder_shown`, `trial_expiry_reminder_sent`, `trial_expired`, `subscription_started`, `subscription_plan_selected`
- [YAPILMALI] Conversion funnel'ı analiz et: Hangi aşamada kullanıcı kaybediliyor?

### Kurallar
- [YAPILMAMALI] Trial süresini kullanıcıdan gizleme — kalan süre her zaman görünür olmalı
- [YAPILMAMALI] Trial bitmeden ödeme almaya çalışma
- [YAPILMAMALI] Trial bitince uyarısız premium özellikleri kaldırma — geçiş bilgilendirmesi zorunlu

---

## Restore Purchases Akışı

Kullanıcının mevcut satın alımlarını geri yüklemesi için zorunlu akış:

### Erişim
- [ZORUNLU] Settings/Ayarlar ekranında "Satın Alımları Geri Yükle" butonu her zaman görünür olmalı
- [ZORUNLU] Paywall ekranında da "Satın alımları geri yükle" bağlantısı bulunmalı (Apple guideline zorunluluğu)
- [YAPILMALI] İlk açılışta (yeni cihaz/yeniden kurulum) otomatik restore dene — kullanıcıyı bekletme

### Implementasyon
```
RevenueCat.restorePurchases()
  → Başarılı: entitlement güncelle, "Satın alımlarınız geri yüklendi" mesajı
  → Bulunamadı: "Aktif satın alım bulunamadı" mesajı + destek yönlendirme
  → Hata: "İşlem başarısız, lütfen tekrar deneyin" + retry butonu
```

### Kurallar
1. [ZORUNLU] Restore sırasında loading indicator göster
2. [ZORUNLU] Sonuç mesajı her zaman gösterilmeli — sessiz başarısızlık yasak
3. [ZORUNLU] Receipt doğrulaması RevenueCat server tarafında yapılmalı — client-side doğrulama yasak
4. [YAPILMALI] Restore sonrası entitlement state'ini hemen güncelle (UI refresh)
5. [YAPILMAMALI] Restore butonunu gizleme veya zor erişilebilir yere koyma — Apple review red sebebi

### Platform Notları
- Apple: App Store receipt doğrulaması RevenueCat otomatik yapar
- Google: Google Play billing library üzerinden doğrulama RevenueCat otomatik yapar
- Cross-platform: Bir platformda satın alınan, diğerinde de geçerli olabilir (RevenueCat entitlement sync)

## Kaynak
- Payment kararı → docs/adr/ADR-016-in-app-purchase-and-subscription.md
- Security baseline → docs/quality/27-security-and-secrets-baseline.md
