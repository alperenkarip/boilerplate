---
id: A-STATE
type: activity
name: State Yapısı Değişikliği
tetiklenen-domain-guardrails: [D-STA, D-PRF]
araç-zorunlulukları:
  spec: ihtiyaca göre
  stitch: —
  codex: zorunlu
son-güncelleme: 2026-04-01
---

# A-STATE: State Değişikliği Guardrail

## Ön Koşullar
1. D-STA guardrail'ini oku
2. State türünü belirle: local, feature, global, server, form

## Aktiviteye Özel Kurallar
1. En dar scope'ta tut — gereksiz yere global yapma
2. Server state → TanStack Query (Zustand'a koyma)
3. Form state → React Hook Form (Zustand'a koyma)
4. Store slice izolasyonu koru
5. Re-render etkisini düşün (D-PRF)
6. Persist ve reset mekanizması tanımla

## DoD Ek Maddeleri
- [ ] State türü doğru
- [ ] Scope minimal
- [ ] Server/form state doğru yerde
- [ ] Re-render etkisi kontrol edilmiş
