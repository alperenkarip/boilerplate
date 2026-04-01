---
id: A-MIGRATION
type: activity
name: Veri / Şema / Kod Migration
tetiklenen-domain-guardrails: [D-DAT, D-SEC]
araç-zorunlulukları:
  spec: zorunlu
  stitch: —
  codex: zorunlu
son-güncelleme: 2026-04-01
---

# A-MIGRATION: Migration Guardrail

## Ön Koşullar
1. SPEC oluştur — migration her zaman karmaşık
2. Geri dönüş planı hazırla

## Aktiviteye Özel Kurallar
1. Geri dönüş (rollback) planı zorunlu
2. Migration test ortamında önce çalıştır
3. Veri kaybı riski analiz et
4. Backward compatibility düşün (geçiş süreci)
5. Migration script'leri idempotent olmalı (tekrar çalıştırılabilir)
6. Büyük veri migration'ı batch olarak yap

## DoD Ek Maddeleri
- [ ] SPEC yazılmış
- [ ] Rollback planı hazır
- [ ] Test ortamında başarılı
- [ ] Veri kaybı riski değerlendirilmiş
- [ ] Migration idempotent
