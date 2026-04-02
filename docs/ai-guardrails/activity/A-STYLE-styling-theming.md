---
id: A-STYLE
type: activity
name: Styling / Theme Değişikliği
tetiklenen-domain-guardrails: [D-STY, D-DSY, D-UIX, D-VIS]
araç-zorunlulukları:
  spec: —
  stitch: önerilen
  codex: zorunlu
son-güncelleme: 2026-04-02
---

# A-STYLE: Styling/Theme Değişikliği Guardrail

## Aktif Domain Guardrail'ler
- **D-STY** → Styling kuralları, Tailwind/NativeWind kullanımı
- **D-DSY** → Semantic token, token hiyerarşisi
- **D-UIX** → Görsel tutarlılık, HIG uyumu
- **D-VIS** → Visual fidelity, tasarım-kod uyumu, pixel-perfect doğrulama

## Ön Koşullar
1. D-STY ve D-DSY guardrail'lerini oku
2. Token değişikliği ise 22-design-tokens-spec.md kontrol et

## Aktiviteye Özel Kurallar
1. Tailwind CSS / NativeWind kullan (ADR-007)
2. Semantic token üzerinden çalış — raw değer ekleme
3. Dark mode desteğini kırma
4. Token hiyerarşisini (raw→semantic→component) bozma
5. Visual regression riski varsa screenshot proof al

## Dark Mode Visual QA
6. Her styling PR'ında dark mode screenshot zorunlu — hem light hem dark mode ekran görüntüsü PR'a eklenmeli
7. Dark mode'da kontrol edilmesi gereken 6 alan:
   1. **Metin okunabilirlik** — Metin arka plan üzerinde yeterli kontrastta mı?
   2. **Arka plan uyumu** — Arka plan renkleri dark mode token'larıyla uyumlu mu?
   3. **Border görünürlük** — Border'lar dark arka planda görünür mü?
   4. **İkon renkleri** — İkonlar dark mode'da doğru renkte mi?
   5. **Placeholder/disabled ayrımı** — Placeholder ve disabled state'ler birbirinden ayırt edilebiliyor mu?
   6. **Gölge görünürlük** — Box shadow / elevation dark arka planda görünür mü?
8. **Storybook:** Dark mode story otomatik oluşturulmalı (color mode decorator)
9. **CI:** Chromatic'te hem light hem dark mode snapshot karşılaştırması

## DoD Ek Maddeleri
- [ ] Semantic token kullanılıyor
- [ ] Dark mode kırılmamış
- [ ] Dark mode screenshot PR'da mevcut (6 kontrol noktası)
- [ ] Token hiyerarşisi korunmuş
- [ ] Storybook dark mode story var
- [ ] Visual proof PR'da mevcut
