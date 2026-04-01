---
id: D-PRF
type: domain
name: Performance
kaynak-dokümanlar: 13
miras-tipi: yapısal
son-güncelleme: 2026-04-01
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
9. [YAPILMALI] API response'ları cache'le (TanStack Query — ADR-005)
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

## Kaynak
- Performance standardı → docs/quality/13-performance-standard.md
