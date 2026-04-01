---
id: D-NTF
type: domain
name: Push Notification Yönetimi
kaynak-dokümanlar: ADR-013, 26
miras-tipi: zorunlu
son-güncelleme: 2026-04-01
---

# D-NTF: Push Notification Guardrail

## Bu Guardrail Ne Zaman Aktif?
- Push notification geliştirme (A-NOTIFICATION)
- Yeni feature geliştirme — push içeriyorsa (A-NEW-FEAT)
- Third-party push service entegrasyonu (A-3RD)
- Notification ile deep link bağlantısı kurulması

## Zorunlu Kurallar

### SDK & Altyapı
1. [ZORUNLU] `expo-notifications` kullanılmalı (ADR-013)
2. [ZORUNLU] Android notification channel tanımlanmalı
3. [ZORUNLU] Deep link entegrasyonu zorunlu — notification tap sonrası doğru ekrana navigasyon sağlanmalı
4. [YAPILMALI] iOS provisional notification desteği düşünülmeli

### Permission & UX
5. [YASAK] App açılışında doğrudan notification permission sorulmamalı
6. [ZORUNLU] Permission request contextual olmalı — kullanıcıya neden izin istendiğini açıklayan pre-permission ekranı gösterilmeli
7. [YAPILMALI] Permission reddedildiğinde graceful fallback tanımlanmalı

### Güvenlik & Gizlilik
8. [YASAK] Notification payload'da hassas veri (PII, token, şifre) bulunmamalı
9. [YASAK] Push token'ı log/analytics'e yazılmamalı
10. [YAPILMALI] Push token backend'e güvenli kanal üzerinden gönderilmeli

### İşlem Kuralları
11. [YASAK] Silent push business logic UI thread'de çalıştırılmamalı
12. [ZORUNLU] Notification analytics event'leri tanımlanmalı (delivered, opened, dismissed)
13. [ZORUNLU] Test ortamında gerçek push gönderilmemeli — mock kullanılmalı

### Silent Push Kontrol
14. [YAPILMALI] Silent push frekans limiti tanımlanmalı — aşırı silent push platform throttling ve battery drain riski oluşturur
15. [YASAK] Silent push'ı kontrolsüz/sınırsız kullanma — iOS ve Android platform throttling uygular

## Kalite Eşikleri
- [MİNİMUM] expo-notifications kullanımı (ADR-013 uyumu)
- [MİNİMUM] Sıfır PII notification payload'da
- [MİNİMUM] Android notification channel tanımlı
- [MİNİMUM] Deep link entegrasyonu çalışır durumda
- [ÖNERİLEN] Permission request contextual UX akışı mevcut

## Anti-pattern'ler
1. [ZAYIF] `useEffect(() => Notifications.requestPermissionsAsync(), [])` — app açılışında direkt permission sorma
2. [ZAYIF] `{ title: "Yeni mesaj", body: user.email }` — PII payload'da
3. [ZAYIF] `console.log(pushToken)` — push token'ı log'a yazma
4. [ZAYIF] Notification tap sonrası ana ekrana yönlendirme — deep link routing yok
5. [ZAYIF] Silent push handler'da ağır UI güncellemesi yapma

## Kontrol Listesi
- [ ] expo-notifications kullanılıyor mu?
- [ ] Permission request contextual mi (pre-permission ekranı var mı)?
- [ ] Notification payload'da PII yok mu?
- [ ] Android notification channel tanımlı mı?
- [ ] Deep link entegrasyonu çalışıyor mu?
- [ ] Analytics event'leri (delivered, opened, dismissed) tanımlı mı?
- [ ] Test ortamında gerçek push gönderilmiyor mu?

## İhlal Durumunda
- PII payload'da → HEMEN kaldır, payload'ı temizle
- Permission request contextual değil → pre-permission ekranı ekle
- Deep link eksik → notification → ekran routing tanımla
- Gerçek push test'te gönderiliyor → mock'a geç

## Kaynak
- Push notification kararı → docs/adr/ADR-013-push-notification-strategy.md
- Platform adaptation → docs/design-system/26-platform-adaptation-rules.md
