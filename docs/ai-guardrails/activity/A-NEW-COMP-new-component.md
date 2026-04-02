---
id: A-NEW-COMP
type: activity
name: Yeni Component Oluşturma
tetiklenen-domain-guardrails: [D-UIX, D-DSY, D-A11, D-PLT, D-MOT]
araç-zorunlulukları:
  spec: —
  stitch: önerilen
  codex: zorunlu
son-güncelleme: 2026-04-02
---

# A-NEW-COMP: Yeni Component Oluşturma Guardrail

## Ön Koşullar
1. Component governance kurallarını oku: docs/design-system/23-component-governance-rules.md
2. Component açma kriterlerini doğrula — gerçek tekrar var mı, yoksa feature-specific mi?
3. Mevcut DS component'leri arasında bu ihtiyacı karşılayan var mı kontrol et

## Aktif Domain Guardrail'ler
- **D-UIX** → Touch target, state visibility, button hierarchy, HIG uyumu
- **D-DSY** → Semantic token kullanımı, token hiyerarşisi, naming convention
- **D-A11** → Role, label, focus management, contrast, reduced motion
- **D-PLT** → Platform parity, platform convention, kod organizasyonu
- **D-MOT** → Motion token, reduced motion guard (animasyon içeriyorsa)

## Aktiviteye Özel Kurallar
1. Component PascalCase isimlendirilmeli, dosya adıyla eşleşmeli
2. Component prop'ları TypeScript interface ile tanımlanmalı — `any` yasak
3. Accessibility prop'ları zorunlu: role, accessibleName, aria-label (gerekli olanlar)
4. Her state görünür olmalı: idle, hover, focus, active, disabled, error, loading
5. Component packages/ui/ veya packages/{ilgili-paket}/ altında olmalı
6. Test dosyası (render test) zorunlu: `ComponentName.test.tsx`

## Araç Kullanım Tablosu
| Araç | Zorunluluk | Not |
|------|-----------|-----|
| SPEC (MoAI-ADK) | — | Tek component için gereksiz |
| Stitch | Önerilen | Görsel referans varsa kullan |
| Codex Review | Zorunlu | DS/a11y/boundary uyumu denetimi |

## Storybook Story Zorunluluğu
7. **Shared component** (`packages/ui/` altında) için Storybook story zorunlu:
   - Default story (varsayılan props ile)
   - Variant story'leri (tüm varyasyonlar)
   - Interactive story (args/controls ile kullanıcı etkileşimi)
   - Dark mode story
   - Accessibility geçen story (a11y addon pass)
8. **Feature-scope component** için Storybook story opsiyonel
9. **CI kontrolü:** Storybook build hatası → PR bloklanır

## DoD Ek Maddeleri
- [ ] Component governance (23) kriterlerine uygun
- [ ] Tüm token'lar semantic (hardcoded değer yok)
- [ ] A11y prop'ları eksiksiz
- [ ] Render testi yazılmış
- [ ] Tüm state'ler görünür
- [ ] Platform parity (cross-platform ise) sağlanmış
- [ ] Storybook story'leri yazılmış (shared component ise zorunlu: default, variants, interactive, dark mode, a11y)
- [ ] Storybook build başarılı
