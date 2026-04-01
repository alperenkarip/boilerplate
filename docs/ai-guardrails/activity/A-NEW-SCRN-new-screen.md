---
id: A-NEW-SCRN
type: activity
name: Yeni Ekran / Sayfa Oluşturma
tetiklenen-domain-guardrails: [D-UIX, D-NAV, D-ERR, D-A11, D-PLT]
araç-zorunlulukları:
  spec: zorunlu
  stitch: zorunlu
  codex: zorunlu
son-güncelleme: 2026-04-01
---

# A-NEW-SCRN: Yeni Ekran Oluşturma Guardrail

## Ön Koşullar
1. SPEC oluştur (`/moai plan`) — yeni ekran karmaşıklık >= 5 kabul edilir
2. Stitch ile tasarım oluştur veya mevcut tasarım referansını al
3. Navigation yapısında bu ekranın yerini belirle (08-navigation-and-flow-rules.md)

## Aktif Domain Guardrail'ler
- **D-UIX** → Touch target, safe area, typography hierarchy, button hierarchy, premium ton
- **D-NAV** → Route tanımı, back davranışı, deep link, presentation surface
- **D-ERR** → Loading, error, empty, success durumları ZORUNLU
- **D-A11** → Semantic markup, focus management, contrast, screen reader
- **D-PLT** → Platform parity, responsive layout, safe area

## Aktiviteye Özel Kurallar
1. Her ekranda 4 durum handle edilmeli: loading, success, error, empty
2. Route tanımlanmalı (web: React Router, mobile: React Navigation)
3. Back/dismiss davranışı net olmalı
4. Deep link gerekiyorsa URL pattern tanımlanmalı
5. Safe area (mobile) ve responsive layout (web) düşünülmeli
6. Ekran apps/{app}/src/features/{feature}/ altında olmalı

## Araç Kullanım Tablosu
| Araç | Zorunluluk | Not |
|------|-----------|-----|
| SPEC (MoAI-ADK) | Zorunlu | EARS formatında gereksinim tanımı |
| Stitch | Zorunlu | Tasarım referansı |
| Codex Review | Zorunlu | Kapsamlı denetim |

## DoD Ek Maddeleri
- [ ] SPEC yazılmış ve kabul kriterleri tanımlı
- [ ] Loading/error/empty/success durumları implement edilmiş
- [ ] Route tanımlı, navigation entegre
- [ ] A11y uyumu (role, label, focus, contrast)
- [ ] Platform parity (cross-platform ise)
- [ ] Visual proof PR'da mevcut
- [ ] Smoke test yazılmış (önerilen)
