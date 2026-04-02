---
id: A-RELEASE
type: activity
name: Release Hazırlığı
tetiklenen-domain-guardrails: [D-OBS, D-SEC]
araç-zorunlulukları:
  spec: —
  stitch: —
  codex: zorunlu
son-güncelleme: 2026-04-02
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

## Release Readiness Checklist
7. Release öncesi aşağıdaki kontroller tamamlanmalı:
   - [ ] CI/CD tüm kontrolleri geçti
   - [ ] Performance benchmark kabul edilebilir seviyede
   - [ ] Guardrail audit PASS
   - [ ] CHANGELOG güncellendi
   - [ ] Store metadata güncellendi (açıklama, screenshot, what's new)
   - [ ] Privacy policy güncel
   - [ ] Yeni permission varsa açıklaması güncellendi (Apple/Google)
   - [ ] OTA vs binary release ayrıştırıldı (JS-only → OTA, native → store build)
   - [ ] Rollback planı hazır
   - [ ] Canary rollout konfigüre edildi

## DoD Ek Maddeleri
- [ ] Quality gate'ler geçmiş
- [ ] Version bump doğru
- [ ] Changelog güncel
- [ ] Exception budget kontrol edilmiş
- [ ] Release readiness checklist tamamlanmış
- [ ] Rollback planı hazır
- [ ] Codex full-audit temiz
