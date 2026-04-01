---
id: A-NEW-API
type: activity
name: Yeni API Endpoint / Entegrasyon
tetiklenen-domain-guardrails: [D-DAT, D-SEC, D-TST]
araç-zorunlulukları:
  spec: ihtiyaca göre
  stitch: —
  codex: zorunlu
son-güncelleme: 2026-04-01
---

# A-NEW-API: Yeni API Entegrasyonu Guardrail

## Aktiviteye Özel Kurallar
1. ADR-005 uyarınca veri erişim modeline entegre et; complexity threshold aşıldıysa TanStack Query kullan
2. Response type'ı TypeScript/Zod ile tanımla
3. Error handling: network, server, timeout ayrı handle et (D-ERR)
4. Integration test zorunlu (D-TST)
5. Auth gerektiriyorsa token management doğru mu kontrol et (D-SEC)
6. Rate limiting düşün
7. Custom hook ile sarma — component'ten doğrudan çağırma

## DoD Ek Maddeleri
- [ ] ADR-005 kararı görünür (fetch-first veya TanStack Query)
- [ ] Response type tanımlı (Zod/TS)
- [ ] Error handling (network/server/timeout)
- [ ] Integration test yazılmış
- [ ] Auth token yönetimi doğru
