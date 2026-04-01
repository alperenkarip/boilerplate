---
id: A-RELEASE
type: activity
name: Release Hazırlığı
tetiklenen-domain-guardrails: []
araç-zorunlulukları:
  spec: —
  stitch: —
  codex: zorunlu
son-güncelleme: 2026-04-01
---

# A-RELEASE: Release Hazırlığı Guardrail

## Ön Koşullar
1. 29-release-and-versioning-rules.md oku
2. 15-quality-gates-and-ci-rules.md kontrol et
3. 31-audit-checklist.md'yi gözden geçir

## Aktiviteye Özel Kurallar
1. Tüm quality gate'ler geçmeli (15) — bypass yasak
2. Version bump semantik versioning kurallarına uymalı (29)
3. Changelog yazılmalı
4. Exception budget kontrolü — süresi dolmuş exception var mı? (44)
5. Boundary contract uyumu — audit sonucu temiz mi?
6. Codex full-audit çalıştır

## DoD Ek Maddeleri
- [ ] Quality gate'ler geçmiş
- [ ] Version bump doğru
- [ ] Changelog güncel
- [ ] Exception budget kontrol edilmiş
- [ ] Codex full-audit temiz
