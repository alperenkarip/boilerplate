---
id: D-PRF
type: domain
name: Performance
kaynak-dokümanlar: 13
miras-tipi: yapısal
son-güncelleme: 2026-04-02
---

# D-PRF: Performance Guardrail

## Bu Guardrail Ne Zaman Aktif?
- State değişikliği (A-STATE) — re-render riski
- Yeni ekran (A-NEW-SCRN) — initial load
- Data layer değişikliği — bundle/network etkisi
- Liste/scroll implementasyonu

## Zorunlu Kurallar

### Render Optimizasyonu
1. [YAPILMALI] Gereksiz re-render'ı önle — memo, useMemo, useCallback bilinçli kullan
2. [YAPILMALI] Büyük listeler virtualized olmalı (FlatList, VirtualizedList, veya web virtualization)
3. [YAPILMAMALI] Her render'da yeni object/array/function reference oluşturma (inline callback dikkat)
4. [YAPILMAMALI] Global store'daki her değişiklikte tüm ağacı re-render ettirme

### Bundle & Loading
5. [YAPILMALI] Route-level code splitting uygula (lazy loading)
6. [YAPILMALI] Büyük dependency'lerin bundle etkisini kontrol et
7. [YAPILMAMALI] Gereksiz büyük kütüphaneyi tüm app'e bundle etme — tree-shaking düşün

### Network
8. [YAPILMALI] Image'ları optimize et (boyut, format, lazy load)
9. [YAPILMALI] API response davranışını ADR-005'e göre cache'le; query-layer adopt edilmişse TanStack Query policy uygula
10. [YAPILMAMALI] Her mount'ta refetch — cache'e güven

### Perceived Performance
11. [YAPILMALI] Skeleton/placeholder kullan — beyaz ekran gösterme
12. [YAPILMALI] Optimistic update mümkünse uygula

## Anti-pattern'ler
1. [ZAYIF] 1000+ item liste FlatList/virtualization olmadan render
2. [ZAYIF] Her render'da `style={{ padding: 16 }}` — yeni object reference, re-render tetikler
3. [ZAYIF] Tüm ekranlar tek bundle'da — route-level lazy loading yok
4. [ZAYIF] 2MB+ optimizesiz image doğrudan yükleniyor
5. [ZAYIF] Her mount'ta API refetch — cache hiç kullanılmıyor

## Kontrol Listesi
- [ ] Gereksiz re-render var mı?
- [ ] Büyük listeler virtualized mi?
- [ ] Route-level lazy loading var mı?
- [ ] Image'lar optimize mi?
- [ ] Cache stratejisi tanımlı mı?

---

## Image Optimization Pipeline

`expo-image` tabanlı görsel optimizasyon kuralları:

### Format ve Boyut
- [ZORUNLU] WebP formatı tercih et — JPEG/PNG'ye göre %25-35 daha küçük
- [ZORUNLU] Maksimum upload boyutu: 5MB — aşıyorsa client-side sıkıştır (`expo-image-manipulator`)
- [YAPILMALI] CDN üzerinden sunulan görsellerde responsive sizing: `width` ve `height` prop'larını kullan
- [YAPILMALI] Thumbnail ve tam boyut ayrı URL — liste görünümünde küçük boyut yükle

### Yükleme Stratejisi
- [ZORUNLU] Ekranın dışındaki görseller lazy loading ile yükle: `priority="low"`
- [ZORUNLU] Above-the-fold (ilk görünen) görseller eager loading: `priority="high"`
- [YAPILMALI] Blur placeholder kullan: `placeholder={blurhash}` — yükleme sırasında boş alan gösterme
- [YAPILMALI] Hata durumunda fallback görseli tanımla

### Cache Stratejisi
- [YAPILMALI] `expo-image` memory + disk cache kullan (varsayılan aktif)
- [YAPILMALI] Cache policy tanımla: profil fotoğrafları uzun süreli, feed görselleri kısa süreli
- [YAPILMAMALI] Her render'da aynı görseli tekrar yükleme — cache'e güven

### Anti-pattern (Ek)
- [ZAYIF] `<Image source={{ uri: url }}` (React Native Image) — `expo-image` kullan
- [ZAYIF] 2000×2000px görsel 100×100px alanda gösterilmiş — responsive sizing yok
- [ZAYIF] Tüm görseller eager loading — sayfa açılışı yavaşlıyor

---

## FlatList vs FlashList Karar Ağacı

Liste bileşeni seçimi için rehber:

### Ne Zaman Hangisi?

| Kriter | FlatList | FlashList (@shopify/flash-list) |
|--------|----------|-------------------------------|
| Öğe sayısı | <100 öğe | >100 öğe |
| Öğe karmaşıklığı | Basit (metin, ikon) | Karmaşık (resim, aksiyon, nested view) |
| Scroll performansı | Yeterli | Kritik (60fps zorunlu) |
| Bellek kullanımı | Düşük liste, sorun yok | Büyük liste, recycling gerekli |

### FlashList Zorunlu Senaryolar
- Chat mesaj listesi (yüzlerce/binlerce öğe)
- Sosyal medya feed'i (sonsuz scroll + karmaşık kart)
- Ürün katalog listesi (resim ağırlıklı, infinite scroll)
- Bildirim listesi (sürekli güncellenen, uzun)

### FlashList Optimizasyon
- [ZORUNLU] `estimatedItemSize` prop'u tanımla — boş alan (blank area) oluşmasını önler
- [YAPILMALI] Farklı yüksekliklerde öğeler için `overrideItemLayout` tanımla
- [YAPILMALI] `drawDistance` ayarla — ekranın ne kadar ötesini önceden render edeceğini belirle
- [YAPILMALI] Geliştirme sırasında `onBlankArea` event'ini takip et — blank area oranını %0'a yaklaştır

### Ortak Kurallar (Her İki Liste)
- [ZORUNLU] `keyExtractor` tanımla — benzersiz ve stabil key
- [YAPILMALI] `getItemLayout` (FlatList) veya `estimatedItemSize` (FlashList) ile boyut ipucu ver
- [YAPILMAMALI] Liste öğesi içinde ağır hesaplama yapma — önceden hesapla, memo ile cache'le
- [YAPILMAMALI] ScrollView içinde FlatList/FlashList kullanma — virtualization bozulur

## Kaynak
- Performance standardı → docs/quality/13-performance-standard.md
