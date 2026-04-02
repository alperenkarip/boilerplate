---
id: D-STY
type: domain
name: Styling, Tailwind CSS, NativeWind
kaynak-dokümanlar: ADR-007
miras-tipi: zorunlu
son-güncelleme: 2026-04-02
---

# D-STY: Styling Guardrail

## Bu Guardrail Ne Zaman Aktif?
- Styling/theme değişikliği (A-STYLE)
- Yeni component (A-NEW-COMP) — stil tanımları
- Herhangi bir CSS/style kodu

## Zorunlu Kurallar

### Canonical Stack
1. [ZORUNLU] Web: Tailwind CSS 4.x (ADR-007)
2. [ZORUNLU] Mobile: NativeWind 5.x candidate track (ADR-007)
3. [ZORUNLU] Bootstrap öncesi NativeWind release-status doğrulaması zorunlu
4. [YAPILMAMALI] Styled-components, Emotion, veya başka CSS-in-JS kullanma

### Token Entegrasyonu
5. [YAPILMALI] Tailwind config'i design token'larla besle (D-DSY ile kesişir)
6. [YAPILMALI] Semantic token class'ları kullan — raw utility class'ları minimize et
7. [YAPILMAMALI] Tailwind dışında inline style object kullanma (zorunlu haller hariç)
8. [YAPILMAMALI] `!important` kullanma

### Responsive
9. [YAPILMALI] Tailwind responsive prefix'leri kullan (sm:, md:, lg:)
10. [YAPILMAMALI] Sabit piksel breakpoint'leri ile media query yazma

### Dark Mode
11. [YAPILMALI] Dark mode semantic token'lar üzerinden çalışmalı
12. [YAPILMAMALI] Dark mode için ayrı hardcoded renk seti oluşturma

## Anti-pattern'ler
1. [ZAYIF] `style={{ backgroundColor: '#f5f5f5' }}` — inline style + hardcoded renk
2. [ZAYIF] `!important` kullanımı — specificity sorunu, Tailwind utility yeterli
3. [ZAYIF] Styled-components/Emotion import — canonical stack dışı (ADR-007)
4. [ZAYIF] Dark mode için ayrı `colors-dark.ts` dosyası — semantic token ile çözülmeli
5. [ZAYIF] `@media (min-width: 768px)` hardcoded — Tailwind responsive prefix kullan

## Kontrol Listesi
- [ ] Tailwind CSS / NativeWind kullanılıyor mu?
- [ ] Token entegrasyonu sağlanmış mı?
- [ ] Inline style yok mu (veya gerekçeli mi)?
- [ ] Dark mode semantic token ile mi?

---

## Dynamic Styling Constraint

Dinamik stil değişikliklerinde performans sorunlarını önleme kuralları:

### Problem
Inline style object her render'da yeni bir JavaScript referansı oluşturur. Bu, React'in reconciliation sürecinde gereksiz re-render tetikler ve özellikle listelerde performans düşüşüne neden olur.

### Çözüm Hiyerarşisi

| Durum | Tercih Edilen Yöntem | Açıklama |
|-------|---------------------|----------|
| Statik stiller | `StyleSheet.create()` | Tek seferlik oluşturulur, referans sabit |
| Koşullu stiller | NativeWind conditional class | `className={active ? 'bg-primary' : 'bg-secondary'}` |
| Animasyonlu stiller | Reanimated `useAnimatedStyle` | JS thread dışında çalışır, 60fps garanti |
| Dinamik değerler (az sayıda) | `useMemo` ile memoize | Bağımlılık değişmediğinde referans sabit |

### Kurallar
1. [ZORUNLU] Statik stiller `StyleSheet.create()` ile tanımlanmalı — inline object yasak
2. [ZORUNLU] Animasyonlu stiller Reanimated `useAnimatedStyle` kullanmalı — JS thread'i bloke etmemeli
3. [YAPILMALI] Koşullu stil uygulamasında NativeWind conditional class tercih et — style prop'ta ternary minimize et
4. [YAPILMALI] 60fps altına düşen animasyonlarda Reanimated'a geç — `useNativeDriver: true` yeterli değilse
5. [YAPILMAMALI] Style prop'ta büyük ternary object kullanma — her render'da yeni referans

### Anti-pattern (Ek)
- [ZAYIF] `style={{ padding: isActive ? 16 : 8, margin: isLarge ? 24 : 12, ... }}` — her render'da yeni object
- [ZAYIF] `Animated.Value` ile karmaşık animasyon — Reanimated 3 worklet tercih et
- [ZAYIF] FlatList renderItem içinde inline style — tüm liste re-render olur

### Performans Ölçümü
- React DevTools Profiler ile re-render sayısını kontrol et
- Reanimated `useFrameCallback` ile fps ölç
- 60fps altı sürekli yaşanıyorsa → style stratejisini gözden geçir

## Kaynak
- Styling kararı → docs/adr/ADR-007-styling-tokens-and-theming-implementation.md
- Token spec → docs/design-system/22-design-tokens-spec.md
