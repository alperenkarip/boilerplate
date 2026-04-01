---
id: D-VIS
type: domain
name: Visual Fidelity, Implementation Contract
kaynak-dokümanlar: 33
miras-tipi: yapısal
son-güncelleme: 2026-04-01
---

# D-VIS: Visual Fidelity Guardrail

## Bu Guardrail Ne Zaman Aktif?
- Yeni ekran (A-NEW-SCRN) — tasarım referansı varsa
- Yeni component (A-NEW-COMP) — Stitch veya Figma referansı varsa
- DESIGN.md kullanılırken

## Zorunlu Kurallar

### Tasarım-İmplementasyon Uyumu
1. [YAPILMALI] Tasarım referansı (Stitch, Figma) varsa screenshot-faithful implementasyon yap
2. [YAPILMALI] Spacing, typography, hierarchy tasarımla birebir eşleşmeli
3. [YAPILMALI] State görünürlüğü (idle, hover, focus, error, disabled) tasarımdaki gibi olmalı

### DESIGN.md Kullanımı
4. [YAPILMALI] DESIGN.md varsa referans al — ama 22-design-tokens-spec.md ile çelişirse 22 kazanır
5. [YAPILMAMALI] DESIGN.md'yi elle düzenleme — Stitch export'udur

### Visual Proof
6. [YAPILMALI] PR'da visual proof (screenshot veya screen recording) ekle
7. [YAPILMAMALI] Görsel değişikliği proof olmadan merge etme

## Anti-pattern'ler
1. [ZAYIF] Tasarım referansı var ama spacing/typography eşleşmiyor
2. [ZAYIF] Görsel değişiklik PR'da proof (screenshot) olmadan merge
3. [ZAYIF] DESIGN.md elle düzenlenmiş — Stitch export'u bozulmuş
4. [ZAYIF] Sadece idle state implement — hover/focus/error/disabled görünmüyor

## Kontrol Listesi
- [ ] Tasarım referansıyla eşleşiyor mu?
- [ ] Spacing/typography doğru mu?
- [ ] Tüm state'ler görünür mü?
- [ ] PR'da visual proof var mı?

## Kaynak
- Visual contract → docs/design-system/33-visual-implementation-contract.md
- DESIGN.md kuralları → docs/governance/40-ai-workflow-and-tooling.md §3.3
