---
id: A-3RD
type: activity
name: Third-Party SDK Entegrasyonu
tetiklenen-domain-guardrails: [D-3RD, D-SEC]
araç-zorunlulukları:
  spec: ihtiyaca göre
  stitch: —
  codex: zorunlu
son-güncelleme: 2026-04-01
---

# A-3RD: Third-Party Entegrasyon Guardrail

## Ön Koşullar
1. D-3RD ve D-SEC guardrail'lerini oku
2. 37-dependency-policy.md kontrol et
3. Canonical stack alternatifi mi kontrol et — evetse YASAK

## Aktiviteye Özel Kurallar
1. Wrapper/abstraction katmanı oluştur — doğrudan SDK tüketme
2. Bundle size etkisi değerlendir
3. Güvenlik ve lisans taraması yap
4. SDK'nın veri toplama davranışını incele
5. Compatibility matrix'e ekle (38)

## DoD Ek Maddeleri
- [ ] Dependency policy (37) onaylı
- [ ] Wrapper oluşturulmuş
- [ ] Güvenlik + lisans taraması geçmiş
- [ ] Compatibility matrix güncel
