---
id: A-NEW-FEAT
type: activity
name: Yeni Feature Modülü Geliştirme
tetiklenen-domain-guardrails: ilgili tüm domain'ler
araç-zorunlulukları:
  spec: zorunlu
  stitch: ihtiyaca göre
  codex: zorunlu
son-güncelleme: 2026-04-02
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
- **D-I18** → i18n namespace ve çeviri zorunlulukları
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

## Feature Flag Wrapping Zorunluluğu
7. **Naming convention:** `feature_[name]` formatında (ör: `feature_onboarding`, `feature_social_share`)
8. **Default değer:** `false` (kapalı) — yeni feature varsayılan olarak devre dışı başlar
9. **Rollout stratejisi:** staging → %10 → %50 → %100 kademeli açılma
10. **Kill switch:** Sorun tespit edilirse flag `false` yapılarak feature anında devre dışı bırakılır
11. **Cleanup:** Feature stabil olduktan sonra (2 sprint) flag kaldırılır, koşullu kod basitleştirilir
12. **Exception:** Hotfix ve küçük UI düzeltmeler flag gerektirmez
13. **CI kontrolü:** Flag kaldırıldığında koşullu kodun tamamen temizlendiği doğrulanır

## DoD Ek Maddeleri
- [ ] SPEC yazılmış, kabul kriterleri ölçülebilir
- [ ] Feature izolasyonu sağlanmış (modül sınırları)
- [ ] i18n namespace oluşturulmuş
- [ ] Feature flag tanımlanmış (feature_[name], default: false)
- [ ] Rollout stratejisi belirlenmiş
- [ ] İlgili tüm domain guardrail'leri karşılanmış
- [ ] Test coverage yeterli (unit + render + integration)
- [ ] Codex review geçmiş
