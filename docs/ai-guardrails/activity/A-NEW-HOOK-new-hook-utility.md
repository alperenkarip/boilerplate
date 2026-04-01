---
id: A-NEW-HOOK
type: activity
name: Yeni Hook / Utility Oluşturma
tetiklenen-domain-guardrails: [D-TST]
araç-zorunlulukları:
  spec: —
  stitch: —
  codex: zorunlu
son-güncelleme: 2026-04-01
---

# A-NEW-HOOK: Yeni Hook/Utility Guardrail

## Aktiviteye Özel Kurallar
1. Birim testi zorunlu (D-TST)
2. TypeScript ile tip güvenliği sağla — `any` yasak
3. Hook/utility doğru dizinde olmalı: packages/{paket}/ veya feature dizini
4. Naming: camelCase fonksiyon, use* prefix (hook'lar için)
5. Tek sorumluluk — çok iş yapan utility fonksiyon yazma
6. Pure fonksiyon mümkünse tercih et (side-effect minimize)

## DoD Ek Maddeleri
- [ ] Birim testi yazılmış
- [ ] TypeScript strict — any yok
- [ ] Doğru dizinde
- [ ] Naming convention uygun
