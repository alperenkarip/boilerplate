---
id: A-FIX
type: activity
name: Bug Fix
tetiklenen-domain-guardrails: Universal + ilgili domain
araç-zorunlulukları:
  spec: —
  stitch: —
  codex: önerilen
son-güncelleme: 2026-04-01
---

# A-FIX: Bug Fix Guardrail

## Ön Koşullar
1. Root cause'u anla — semptom değil nedeni düzelt
2. Bug'ın hangi domain'e ait olduğunu belirle
3. İlgili domain guardrail'ini oku

## Aktif Domain Guardrail'ler
- **Universal kurallar** → her zaman
- Bug'ın alanına göre ilgili domain (UI bug → D-UIX, form bug → D-FRM, vb.)

## Aktiviteye Özel Kurallar
1. Root cause analizi yap — "çalıştı" yetmez, "neden bozuktu" anla
2. Regression test yaz — bu bug'ın tekrar oluşmayacağını garanti et
3. Fix'in yan etkisini kontrol et — başka yeri kırdın mı?
4. Mevcut testleri çalıştır — kırmadığından emin ol
5. Fix scope'unu dar tut — bug fix'e refactoring ekleme

## Araç Kullanım Tablosu
| Araç | Zorunluluk | Not |
|------|-----------|-----|
| SPEC (MoAI-ADK) | — | Bug fix için gereksiz |
| Stitch | — | Görsel bug ise referans olabilir |
| Codex Review | Önerilen | 50+ satır değişiklikte zorunlu |

## DoD Ek Maddeleri
- [ ] Root cause belirlenmiş
- [ ] Regression test yazılmış
- [ ] Mevcut testler geçiyor
- [ ] Fix scope dar tutulmuş (ek değişiklik yok)
- [ ] İlgili domain guardrail'i karşılanmış
