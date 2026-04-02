---
id: A-FIX
type: activity
name: Bug Fix
tetiklenen-domain-guardrails: Universal + ilgili domain
araç-zorunlulukları:
  spec: —
  stitch: —
  codex: önerilen
son-güncelleme: 2026-04-02
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

## Root Cause Analysis Zorunluluğu
6. **P0/P1 bug fix** PR'larında zorunlu 5 bölümlü RCA:
   1. **Belirtiler** — Kullanıcı/sistem nasıl etkilendi?
   2. **Kök neden** — Bug neden oluştu?
   3. **Düzeltme** — Ne yapıldı?
   4. **Önleme** — Tekrar oluşmaması için ne eklendi? (test, lint kuralı, guardrail)
   5. **Etki alanı** — Başka hangi alanlar etkilenmiş olabilir?
7. **P2/P3 bug fix** PR'larında minimum: kök neden + düzeltme açıklaması
8. **Tekrarlayan bug kuralı:** Aynı kök nedenden 2+ bug çıkarsa → architectural issue olarak değerlendirilir ve ayrı iyileştirme planı oluşturulur

## DoD Ek Maddeleri
- [ ] Root cause belirlenmiş
- [ ] RCA bölümleri PR'da mevcut (P0/P1: 5 bölüm, P2/P3: kök neden + düzeltme)
- [ ] Regression test yazılmış
- [ ] Mevcut testler geçiyor
- [ ] Fix scope dar tutulmuş (ek değişiklik yok)
- [ ] İlgili domain guardrail'i karşılanmış
