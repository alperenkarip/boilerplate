---
id: A-NEW-FEAT
type: activity
name: Yeni Feature Modülü Geliştirme
tetiklenen-domain-guardrails: ilgili tüm domain'ler
araç-zorunlulukları:
  spec: zorunlu
  stitch: ihtiyaca göre
  codex: zorunlu
son-güncelleme: 2026-04-01
---

# A-NEW-FEAT: Yeni Feature Modülü Guardrail

## Ön Koşullar
1. SPEC oluştur (`/moai plan`) — zorunlu
2. Feature'ın hangi domain'lere dokunduğunu belirle
3. İlgili domain guardrail'lerini oku

## Aktif Domain Guardrail'ler
Feature türüne göre değişir. Minimum:
- **Universal kurallar** → her zaman
- **D-TST** → test zorunlulukları
- Feature'a özgü domain'ler (UI varsa D-UIX/D-DSY, data varsa D-DAT, form varsa D-FRM, vb.)

## Aktiviteye Özel Kurallar
1. Feature kodu `apps/{app}/src/features/{feature}/` altında olmalı
2. Feature modülü kendi içinde izole olmalı — diğer feature'lara doğrudan bağlanma
3. Shared ihtiyaç varsa packages/'a taşı
4. Her feature için en az: screen, hook/logic, test dosyaları
5. i18n: feature namespace'i oluştur (`feature-name:`)
6. Error handling: feature seviyesinde error boundary düşün

## Araç Kullanım Tablosu
| Araç | Zorunluluk | Not |
|------|-----------|-----|
| SPEC (MoAI-ADK) | Zorunlu | Karmaşıklık >= 5 (yeni feature her zaman) |
| Stitch | İhtiyaca göre | Görsel bileşen içeriyorsa zorunlu |
| Codex Review | Zorunlu | Kapsamlı boundary + kalite denetimi |

## DoD Ek Maddeleri
- [ ] SPEC yazılmış, kabul kriterleri ölçülebilir
- [ ] Feature izolasyonu sağlanmış (modül sınırları)
- [ ] i18n namespace oluşturulmuş
- [ ] İlgili tüm domain guardrail'leri karşılanmış
- [ ] Test coverage yeterli (unit + render + integration)
- [ ] Codex review geçmiş
