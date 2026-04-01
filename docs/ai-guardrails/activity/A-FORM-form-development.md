---
id: A-FORM
type: activity
name: Form Geliştirme / Düzenleme
tetiklenen-domain-guardrails: [D-FRM, D-UIX, D-A11, D-ERR]
araç-zorunlulukları:
  spec: ihtiyaca göre
  stitch: önerilen
  codex: zorunlu
son-güncelleme: 2026-04-01
---

# A-FORM: Form Geliştirme Guardrail

## Ön Koşullar
1. D-FRM guardrail'ini oku — form mimarisi kuralları
2. Zod schema'yı önce tanımla (schema-first)

## Aktif Domain Guardrail'ler
- **D-FRM** → Schema-first validation, field yapısı, submit lifecycle
- **D-UIX** → Touch target, state visibility, premium ton
- **D-A11** → Label ilişkisi, error announcement, keyboard, focus
- **D-ERR** → Submit error, field error, loading state

## Aktiviteye Özel Kurallar
1. Önce Zod schema tanımla, sonra React Hook Form'a bağla
2. Her field: label + input + helper/error yapısında
3. Validation timing: onBlur/onSubmit (onChange'de erken cezalandırma yapma)
4. Submit lifecycle: loading → success/error feedback
5. Unsaved changes guard düşün

## DoD Ek Maddeleri
- [ ] Zod schema tanımlı
- [ ] React Hook Form kullanılıyor
- [ ] Her field'da visible label var
- [ ] Submit lifecycle (loading/error/success) implement edilmiş
- [ ] A11y: label ilişkisi, keyboard support
