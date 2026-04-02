---
id: D-NTF
type: domain
name: Push Notification Yönetimi
kaynak-dokümanlar: ADR-013, 26
miras-tipi: zorunlu
son-güncelleme: 2026-04-02
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

---

## Permission Request Timing

Bildirim izni isteme zamanlaması kullanıcı deneyimi ve izin oranı için kritiktir:

### Zamanlama Kuralları
1. [YASAK] İlk açılışta (cold start) doğrudan bildirim izni sorma
2. [YASAK] Onboarding akışı içinde zorunlu adım olarak izin isteme
3. [ZORUNLU] İlgili feature kullanıldığında bağlamsal olarak sor (örn: sipariş tamamlandığında "Sipariş durumunu bildirimle takip et")
4. [ZORUNLU] OS dialog öncesi uygulama içi açıklama ekranı (pre-prompt) göster
5. [YAPILMALI] App açılışından minimum 2 dakika sonra sor — kullanıcı uygulamayı tanısın
6. [YAPILMAMALI] Kritik akış (ödeme, kayıt) sırasında izin isteme — akışı bölme

### Pre-prompt Akışı
```
Uygulama içi açıklama ekranı göster
  → Kullanıcı "Tamam" → OS bildirim izni dialog'u aç
  → Kullanıcı "Şimdi değil" → 3 gün sonra tekrar göster (max 2 kez)
  → OS'ta reddedilirse → "Ayarlardan açın" rehber ekranı göster
```

### Tekrar Sorma Politikası
- İlk red sonrası: 3 gün bekle, farklı bağlamda tekrar dene
- İkinci red sonrası: Bir daha sorma, ayarlar ekranında pasif yönlendirme bırak
- OS seviyesinde red: Tekrar sorulamaz, `Linking.openSettings()` ile yönlendir

### Analytics
- [ZORUNLU] Şu event'leri tanımla: `permission_prompt_shown`, `permission_granted`, `permission_denied`, `permission_settings_redirect`
- [YAPILMALI] İzin oranını (grant rate) takip et ve pre-prompt mesajını optimize et

---

## Silent Push Data Sync

Arka planda veri senkronizasyonu için sessiz bildirim kullanım kuralları:

### Kullanım Alanları
- Cache güncelleme (yeni içerik hazır bildirimi)
- Badge güncelleme (okunmamış sayısı)
- Remote config refresh (feature flag değişikliği)
- Kullanıcıya gösterilmeyen arka plan veri sync'i

### Platform Implementasyonu
| Platform | Yöntem | Kısıtlama |
|----------|--------|-----------|
| iOS | `content-available: 1` payload | 30sn background time, garanti yok (battery optimization, Low Power Mode'da kısıtlı) |
| Android | `priority: "high"`, data-only message | Doze Mode kısıtlaması, FCM quota sınırı |

### Kurallar
1. [ZORUNLU] Silent push handler'da ağır işlem yapma — sadece cache invalidation veya lightweight sync
2. [ZORUNLU] Fallback mekanizması tanımla: Foreground'a geçildiğinde normal fetch ile güncelle
3. [YAPILMALI] Silent push frekansını sınırla — saatte max 2-3 (platform throttling riski)
4. [YAPILMAMALI] Silent push'a kritik iş mantığı bağlama — teslim garantisi yok
5. [YAPILMAMALI] Büyük veri indirmesini silent push handler'da yapma — sadece tetikleme, indirme foreground'da

### Privacy
- [ZORUNLU] Silent push ile toplanan/güncellenen veriler consent kapsamında değerlendirilmeli
- [YAPILMAMALI] Silent push ile kullanıcı consent'i olmadan konum veya aktivite verisi toplama

## Kaynak
- Push notification kararı → docs/adr/ADR-013-push-notification-strategy.md
- Platform adaptation → docs/design-system/26-platform-adaptation-rules.md
