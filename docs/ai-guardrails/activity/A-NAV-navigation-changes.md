---
id: A-NAV
type: activity
name: Navigation / Routing Değişikliği
tetiklenen-domain-guardrails: [D-NAV, D-PLT]
araç-zorunlulukları:
  spec: ihtiyaca göre
  stitch: —
  codex: zorunlu
son-güncelleme: 2026-04-01
---

# A-NAV: Navigation Değişikliği Guardrail

## Ön Koşullar
1. D-NAV guardrail'ini oku
2. 08-navigation-and-flow-rules.md kontrol et

## Aktiviteye Özel Kurallar
1. Route ekleme/değiştirme → mevcut deep link'leri kırma
2. Modal/sheet ekleme → doğru presentation surface seç
3. Back davranışı her platformda test et
4. Navigation state persistence gerekiyorsa tanımla
5. Yeni tab/stack → navigation hierarchy bozma

## DoD Ek Maddeleri
- [ ] Route tanımlı
- [ ] Back davranışı net
- [ ] Mevcut deep link'ler kırılmamış
- [ ] Platform parity (web + mobile) sağlanmış
