---
id: D-NAV
type: domain
name: Navigation, Routing, Deep Linking
kaynak-dokümanlar: 08, ADR-012
miras-tipi: yapısal
son-güncelleme: 2026-04-02
---

# D-NAV: Navigation Guardrail

## Bu Guardrail Ne Zaman Aktif?
- Navigation değişikliği (A-NAV), yeni ekran (A-NEW-SCRN)
- Route tanımlama, deep link ekleme, modal/sheet açma

## Zorunlu Kurallar

### Canonical Stack
1. [ZORUNLU] Web: React Router 7.x (ADR-012)
2. [ZORUNLU] Mobile: React Navigation 7.x (ADR-012)
3. [YAPILMAMALI] Alternatif navigation kütüphanesi kullanma

### Route & Screen
4. [YAPILMALI] Her ekranın tanımlı bir route'u olmalı
5. [YAPILMALI] Back/dismiss davranışı her ekranda net olmalı
6. [YAPILMALI] Deep link desteklenen ekranlar için URL pattern tanımla
7. [YAPILMAMALI] Navigasyonu programatik state manipulation ile yönetme

### Presentation Surface
8. [YAPILMALI] Modal, sheet, dialog doğru yüzeyde gösterilmeli (08 §navigation-and-flow-rules)
9. [YAPILMAMALI] Her şeyi modal olarak açma — full screen navigation'ı tercih et
10. [YAPILMAMALI] Nested modal/sheet zincirleri oluşturma

### Platform Parity
11. [YAPILMALI] Web ve mobile arasında navigation akışı tutarlı olmalı
12. [YAPILMALI] iOS back gesture, Android back button doğru çalışmalı

### Apple HIG Navigation Pattern'leri
13. [YAPILMALI] iOS: Tab bar (alt) + Navigation bar (üst) — standart iOS idiom
14. [YAPILMALI] Tab bar: maksimum 5 tab, simge + etiket birlikte kullanılmalı
15. [YAPILMALI] Navigation bar: Large Title → Inline Title scroll geçişi desteklenmeli
16. [YAPILMALI] iPadOS: Tab bar ↔ Sidebar dönüşümü büyük ekranlarda
17. [YAPILMALI] Sistem geri gestürünü (swipe from edge) engelleme
18. [YAPILMALI] Tab bar seçimlerini uygulama oturumları arasında hatırla
19. [YAPILMAMALI] Hamburger menü iOS'ta kullanma — Tab bar + Sidebar tercih et
20. [YAPILMAMALI] Tab bar'ı alt sayfalarda gizleme
21. [YAPILMAMALI] Navigation derinliğini 3-4 seviyenin üzerine çıkarma

### Search Navigation (Apple HIG)
22. [YAPILMALI] Arama: öneriler (suggestions) ve son aramalar gösterilmeli
23. [YAPILMALI] Arama kapsamı (scope bar) sunulabilmeli
24. [YAPILMAMALI] Arama işlevini gizli veya zor erişilebilir konumda bırakma

### Unsaved Changes
25. [YAPILMALI] Form sayfalarında unsaved changes navigation guard düşün
26. [YAPILMAMALI] Kullanıcı verisini sessizce kaybettirme

## Anti-pattern'ler
1. [ZAYIF] Route tanımsız ekran — programatik navigation ile ulaşılıyor
2. [ZAYIF] Back davranışı belirsiz — kullanıcı geri dönemez
3. [ZAYIF] Nested modal zincirleri — modal içinde modal
4. [ZAYIF] Deep link kırılmış — route değişikliği mevcut link'leri bozmuş
5. [ZAYIF] Unsaved changes guard yok — form verisi sessizce kayboluyor
6. [ZAYIF] iOS'ta hamburger menü kullanılıyor
7. [ZAYIF] Tab bar alt sayfalarda gizlenmiş
8. [ZAYIF] Navigation derinliği 4+ seviye
9. [ZAYIF] Sistem geri gestürü engellenmiş
10. [ZAYIF] Arama: öneriler ve son aramalar gösterilmiyor

## Kontrol Listesi
- [ ] Route tanımlı mı?
- [ ] Back/dismiss davranışı net mi?
- [ ] Deep link pattern tanımlı mı (gerekiyorsa)?
- [ ] Modal/sheet doğru yüzeyde mi?
- [ ] Platform back gesture/button uyumlu mu?
- [ ] iOS: Tab bar + Navigation bar idiom'u doğru mu?
- [ ] Tab bar maksimum 5 öğe mi?
- [ ] Navigation bar Large Title → Inline geçişi var mı?
- [ ] Hamburger menü kullanılmıyor mu?
- [ ] Arama: öneriler ve son aramalar gösteriliyor mu?

---

## Tab Bar Badge Standardı

Tab bar öğelerinde bildirim ve durum gösterimi için badge kuralları:

### Sayısal Badge
- 1-99 arası sayıyı doğrudan göster
- 99 üzerinde `99+` kısaltması kullan
- Font: Caption 2 boyutu, bold weight
- Arka plan: `color-badge-notification` semantic token
- Metin: Beyaz, minimum 16×16pt boyut

### Dot Badge
- İçerik bilgisi olmadan yenilik gösterimi için küçük kırmızı nokta
- Boyut: 8×8pt, tam yuvarlak
- Renk: `color-badge-notification` semantic token
- Sayısal bilgi gereksizse dot tercih et

### Animasyon ve Davranış
- [YAPILMALI] Badge göründüğünde scale bounce animasyonu uygula (200ms, spring)
- [YAPILMALI] İlgili tab'a geçildiğinde badge sıfırla veya güncelle
- [YAPILMAMALI] Badge'i sayfa yüklenene kadar sıfırlamayı erteleme — tab seçimiyle temizle
- [YAPILMAMALI] Aynı anda hem dot hem sayısal badge gösterme

### Erişilebilirlik
- [ZORUNLU] A11y label badge bilgisini içermeli: `"Bildirimler, 5 yeni"` formatı
- [ZORUNLU] Dot badge için `"Bildirimler, yeni içerik var"` label kullan
- [YAPILMALI] Badge değiştiğinde `accessibilityLiveRegion="polite"` ile duyur

---

## Modal Presentation Karar Ağacı

İçerik türüne göre doğru sunum yüzeyini seçme rehberi:

| İçerik Türü | Sunum Şekli | Platform Detayı |
|-------------|-------------|-----------------|
| Kritik uyarı / onay | `Alert.alert()` (native) | iOS: native alert, Android: native dialog |
| Kısa form (1-3 alan) | Bottom sheet — partial | Snap point: %50 medium |
| Tam form (4+ alan) | Full screen modal | iOS: `pageSheet`, Android: `slide` |
| Bilgi / açıklama | Bottom sheet — medium | Snap point: %50, dismiss kolay |
| Seçim listesi | Bottom sheet — tall | Snap point: %90, scroll aktif |
| Medya önizleme | Full screen modal | Transparan arka plan, close buton |

### Snap Point Standardı
- **Peek:** %25 — kısa bilgi, teaser
- **Medium:** %50 — kısa form, bilgi kartı
- **Tall/Expanded:** %90 — uzun form, tam liste

### Dismiss Mekanizmaları
- [ZORUNLU] Her modal/sheet en az bir dismiss mekanizmasına sahip olmalı
- [YAPILMALI] Üç dismiss yöntemi destekle: drag down + backdrop tap + close butonu
- [YAPILMALI] Form içeriyorsa unsaved changes guard ekle — yanlışlıkla kapanmayı önle
- [YAPILMAMALI] Sadece backdrop tap ile dismiss — close butonu her zaman görünür olmalı
- [YAPILMAMALI] Nested modal/sheet zincirleri oluşturma — modal içinde modal yasak

### Platform Farklılıkları
- iOS `pageSheet`: Üstten yuvarlak köşe, drag indicator, yarı saydam arka plan
- Android `slide`: Alttan kayma, tam ekran, back button ile dismiss
- Web: Centered dialog veya side panel, ESC tuşu ile dismiss

## Kaynak
- Navigation kuralları → docs/architecture/08-navigation-and-flow-rules.md
- Navigation kararı → docs/adr/ADR-012-navigation-baseline.md
- Apple HIG Navigation → developer.apple.com/design/human-interface-guidelines/navigation
