---
id: D-DPL
type: domain
name: Deep Linking Yönetimi
kaynak-dokümanlar: ADR-014, 08, 26
miras-tipi: zorunlu
son-güncelleme: 2026-04-02
---

# D-DPL: Deep Linking Guardrail

## Bu Guardrail Ne Zaman Aktif?
- Deep link implementasyonu (A-DEEPLINK)
- Navigation değişikliği — deep link etkisi varsa (A-NAV)
- Push notification — deep link routing (A-NOTIFICATION)
- Yeni ekran/sayfa ekleme — deep link route tanımı gerekiyorsa (A-NEW-SCRN)

## Zorunlu Kurallar

### SDK & Altyapı
1. [ZORUNLU] `expo-linking` kullanılmalı (ADR-014)
2. [ZORUNLU] Universal Links (iOS) ve App Links (Android) verified domain zorunlu
3. [ZORUNLU] Link routing merkezi bir config'de tanımlanmalı — component içinde dağıtılmamalı
4. [YAPILMALI] Deferred deep linking stratejisi tanımlanmalı

### Route & Fallback
5. [ZORUNLU] Her deep link route'u fallback (web URL) tanımlamalı
6. [ZORUNLU] Deep link parametreleri validate edilmeli (injection koruması)
7. [YAPILMALI] Uygulama yüklü değilken fallback URL doğru sayfaya yönlendirmeli

### Test & Doğrulama
8. [ZORUNLU] Her route için deep link unit test zorunlu
9. [YAPILMALI] apple-app-site-association ve assetlinks.json dosyaları doğrulanmalı

### Yasaklar
10. [YASAK] URI scheme'i tek başına production deep link olarak kullanma — verified links tercih edilmeli
11. [YASAK] Deep link parametrelerini sanitize etmeden kullanma
12. [YASAK] Link routing'i component içine dağıtma — merkezi config zorunlu

### Deep Link URL Schema Registry
13. [ZORUNLU] Tüm deep link path tanımları merkezi bir registry dosyasında tutulmalı
14. [YAPILMALI] Registry'de her path kaydı şu bilgileri içermeli:

| Alan | Açıklama | Örnek |
|---|---|---|
| `path` | URL path pattern'i | `/product/:id` |
| `params` | Beklenen parametreler ve tipleri | `{ id: string }` |
| `authRequired` | Erişim için authentication gerekli mi | `true` / `false` |
| `screen` | Yönlendirilecek ekran adı | `ProductDetail` |
| `description` | Path'in açıklaması | "Ürün detay sayfası" |

15. [YAPILMALI] Yeni deep link ekleme süreci: (1) Registry'ye ekle → (2) Navigation config'e ekle → (3) Test yaz → (4) PR aç
16. [YAPILMALI] CI'da registry ile navigation config arasında uyum kontrolü yapılmalı — registry'de olup config'de olmayan veya tersi durumlar hata vermeli
17. [YAPILMAMALI] Navigation config'e deep link ekleyip registry'yi güncellememek

### Deep Link Analytics Tracking
18. [YAPILMALI] Her deep link açılışında aşağıdaki analytics event'i gönderilmeli:
    - Event adı: `deep_link_open`
    - Payload: `{ path, params (sanitized), source (push/share/qr/email/web), is_cold_start, success }`
19. [YAPILMALI] UTM parametre desteği sağlanmalı — `utm_source`, `utm_medium`, `utm_campaign` parametreleri takip edilmeli
20. [YAPILMALI] Deep link conversion tracking: Kullanıcının deep link sonrası hedef aksiyonu tamamlayıp tamamlamadığı izlenmeli
21. [YAPILMALI] Başarısız deep link denemeleri de takip edilmeli — `deep_link_failure` event'i: `{ path, error_type, fallback_used }`
22. [YAPILMAMALI] Analytics payload'ında kullanıcı kişisel bilgisi (e-posta, telefon vb.) göndermek

## Kalite Eşikleri
- [MİNİMUM] expo-linking kullanımı (ADR-014 uyumu)
- [MİNİMUM] Verified domain linking (Universal Links / App Links) kurulumu
- [MİNİMUM] Merkezi link routing config'i mevcut
- [MİNİMUM] Her route için fallback URL tanımlı
- [ÖNERİLEN] Her route için unit test mevcut

## Anti-pattern'ler
1. [ZAYIF] `Linking.openURL('myapp://profile/123')` — URI scheme tek başına production'da kullanma
2. [ZAYIF] Deep link parametresini doğrudan `navigate(param)` ile kullanma — validation yok
3. [ZAYIF] Her component'te ayrı `Linking.addEventListener` — merkezi routing yok
4. [ZAYIF] Fallback URL tanımlanmamış — uygulama yüklü değilken kırık link
5. [ZAYIF] `assetlinks.json` veya `apple-app-site-association` doğrulanmamış
6. [ZAYIF] Navigation config'de deep link var ama registry'de kaydı yok — senkronizasyon bozuk
7. [ZAYIF] Deep link açılışında analytics event gönderilmiyor — ölçüm yapılamıyor
8. [ZAYIF] UTM parametreleri göz ardı ediliyor — kampanya attribution'ı kayıp

## Kontrol Listesi
- [ ] expo-linking kullanılıyor mu?
- [ ] Universal Links ve App Links verified domain kurulumu yapılmış mı?
- [ ] Link routing merkezi config'de mi?
- [ ] Her route için fallback URL tanımlı mı?
- [ ] Deep link parametreleri validate ediliyor mu?
- [ ] Her route için unit test var mı?
- [ ] Deferred deep linking stratejisi tanımlı mı?
- [ ] Deep link registry dosyası güncel mi?
- [ ] Registry ile navigation config senkron mu?
- [ ] `deep_link_open` analytics event'i gönderiliyor mu?
- [ ] UTM parametre desteği mevcut mu?
- [ ] Başarısız deep link'ler `deep_link_failure` event'i ile izleniyor mu?

## İhlal Durumunda
- URI scheme production'da tek başına kullanılıyor → verified link'e geç
- Parametre validation eksik → Zod veya benzeri schema ile validate et
- Merkezi config yok → link routing'i tek bir config dosyasında topla
- Fallback URL eksik → her route için web fallback tanımla

## Kaynak
- Deep linking kararı → docs/adr/ADR-014-deep-linking-and-universal-links.md
- Navigation kuralları → docs/architecture/08-navigation-and-flow-rules.md
- Platform adaptation → docs/design-system/26-platform-adaptation-rules.md
