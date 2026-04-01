---
id: A-OFFLINE
type: activity
name: Offline Support / Cache Persistence
tetiklenen-domain-guardrails: [D-DAT, D-PLT]
araç-zorunlulukları:
  spec: zorunlu
  stitch: —
  codex: zorunlu
son-güncelleme: 2026-04-01
---

# A-OFFLINE: Offline Support Guardrail

## Aktiviteye Özel Kurallar
1. Offline indicator göster — kullanıcı offline olduğunu bilmeli
2. Cached data'yı göster — beyaz ekran gösterme
3. Offline'da yapılan değişiklikleri queue'la
4. Online olunca sync et — conflict resolution stratejisi tanımla
5. Cache invalidation stratejisi net olmalı (ADR-005; query-layer adopt edilmişse TanStack Query policy ile)
6. Firestore offline persistence varsa chosen query/cache modeli ile koordine et (D-FIR)
7. Platform-specific offline davranışı düşün (D-PLT)

## DoD Ek Maddeleri
- [ ] Offline indicator var
- [ ] Cached data gösteriliyor
- [ ] Sync stratejisi tanımlı
- [ ] Conflict resolution planlanmış
