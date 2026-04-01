---
id: D-STY
type: domain
name: Styling, Tailwind CSS, NativeWind
kaynak-dokümanlar: ADR-007
miras-tipi: zorunlu
son-güncelleme: 2026-04-01
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

## Kaynak
- Styling kararı → docs/adr/ADR-007-styling-tokens-and-theming-implementation.md
- Token spec → docs/design-system/22-design-tokens-spec.md
