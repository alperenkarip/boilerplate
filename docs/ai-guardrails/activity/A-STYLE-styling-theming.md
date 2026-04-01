---
id: A-STYLE
type: activity
name: Styling / Theme Değişikliği
tetiklenen-domain-guardrails: [D-STY, D-DSY, D-UIX]
araç-zorunlulukları:
  spec: —
  stitch: önerilen
  codex: zorunlu
son-güncelleme: 2026-04-01
---

# A-STYLE: Styling/Theme Değişikliği Guardrail

## Ön Koşullar
1. D-STY ve D-DSY guardrail'lerini oku
2. Token değişikliği ise 22-design-tokens-spec.md kontrol et

## Aktiviteye Özel Kurallar
1. Tailwind CSS / NativeWind kullan (ADR-007)
2. Semantic token üzerinden çalış — raw değer ekleme
3. Dark mode desteğini kırma
4. Token hiyerarşisini (raw→semantic→component) bozma
5. Visual regression riski varsa screenshot proof al

## DoD Ek Maddeleri
- [ ] Semantic token kullanılıyor
- [ ] Dark mode kırılmamış
- [ ] Token hiyerarşisi korunmuş
- [ ] Visual proof PR'da mevcut
