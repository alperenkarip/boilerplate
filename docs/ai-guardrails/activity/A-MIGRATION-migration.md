---
id: A-MIGRATION
type: activity
name: Veri / Şema / Kod Migration
tetiklenen-domain-guardrails: [D-DAT, D-SEC]
araç-zorunlulukları:
  spec: zorunlu
  stitch: —
  codex: zorunlu
son-güncelleme: 2026-04-02
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

## Migration Rollback Planı
7. Her migration PR'ında aşağıdaki 5 bilgi zorunlu olarak belgelenmeli:
   1. **Rollback adımları** — Geri dönüş için yapılması gerekenler (adım adım)
   2. **Veri kaybı riski** — Rollback yapılırsa veri kaybı olur mu? Hangi veriler etkilenir?
   3. **Rollback testi** — Geri dönüş test ortamında denenmiş mi?
   4. **Tahmini süre** — Migration ve rollback ne kadar sürer?
   5. **Otomatik/Manuel** — Rollback otomatik mi, manuel müdahale gerektirir mi?
8. **Veri kaybı riski varsa:** Minimum 2 reviewer zorunlu
9. **Production öncesi:** Backup alınması zorunlu — backup olmadan production migration başlatılmaz

## DoD Ek Maddeleri
- [ ] SPEC yazılmış
- [ ] Rollback planı hazır (5 bölüm: adımlar, veri kaybı riski, rollback testi, süre, otomatik/manuel)
- [ ] Test ortamında başarılı
- [ ] Veri kaybı riski değerlendirilmiş
- [ ] Veri kaybı riski varsa 2 reviewer onayı alınmış
- [ ] Production öncesi backup planı var
- [ ] Migration idempotent
