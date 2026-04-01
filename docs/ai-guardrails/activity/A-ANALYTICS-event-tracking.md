---
id: A-ANALYTICS
type: activity
name: Analytics / Event Tracking
tetiklenen-domain-guardrails: [D-OBS, D-SEC]
araç-zorunlulukları:
  spec: —
  stitch: —
  codex: önerilen
son-güncelleme: 2026-04-01
---

# A-ANALYTICS: Analytics/Event Tracking Guardrail

## Aktiviteye Özel Kurallar
1. Vendor abstraction layer kullan — doğrudan SDK çağırma (ADR-009)
2. Event naming convention: snake_case, tutarlı prefix
3. PII göndermeme (email, telefon, TC kimlik — D-SEC)
4. Anlamlı event'ler seç — her tıklama/scroll track etme
5. Event property'leri minimal tut — gereksiz veri gönderme
6. A/B testing entegrasyonu varsa flag yönetimi tanımla

## DoD Ek Maddeleri
- [ ] Vendor abstraction kullanılıyor
- [ ] Event naming tutarlı
- [ ] PII filtrelenmiş
- [ ] Event'ler anlamlı ve minimal
