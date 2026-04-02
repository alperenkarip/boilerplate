---
id: D-VIS
type: domain
name: Visual Fidelity, Implementation Contract
kaynak-dokümanlar: 33
miras-tipi: yapısal
son-güncelleme: 2026-04-02
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

---

## Pixel-Perfect Tolerans

Tasarım referansı (Figma/Stitch) ile implementasyon arasındaki kabul edilebilir sapma değerleri:

### Tolerans Tablosu

| Öğe | Kabul Edilebilir Sapma | Açıklama |
|-----|----------------------|----------|
| Spacing (margin, padding) | ±2px | Token değerine göre, kümülatif toplam ±4px |
| Font size | ±0px | Token değeri tam eşleşmeli |
| Border radius | ±1px | Platform rendering farkı kabul |
| Renk | ±0 (token) | Semantic token kullanıldığında fark olmamalı |
| İkon boyutu | ±0px | Tam eşleşme zorunlu |
| Toplam layout sapması | ±4px kümülatif | Tüm spacing sapmalarının toplamı |

### Ölçüm Yöntemi
1. Figma overlay: Implementasyon screenshot'ını Figma tasarımının üzerine yarı saydam bindirme
2. Piksel karşılaştırma: Kritik bölgelerde piksel piksel sapma ölçümü
3. Araç: Chromatic visual diff (otomatik), overlay manual review (PR'da)

### Kurallar
1. [ZORUNLU] Font size ve renk sapmada sıfır tolerans — token'dan alınmalı
2. [YAPILMALI] Spacing sapması ±2px'i aşarsa düzelt — "yaklaşık doğru" kabul edilmez
3. [YAPILMALI] PR'da visual proof ile tolerans kontrolü yap
4. [YAPILMAMALI] "Gözle bakılınca aynı" diyerek ölçümsüz onay verme

---

## Font Rendering Tutarlılığı

iOS ve Android arasındaki font rendering farklılıkları ve kabul edilebilir sapmalar:

### Platform Farkları

| Özellik | iOS (Core Text) | Android (FreeType) |
|---------|-----------------|-------------------|
| Rendering motoru | Core Text | FreeType + Skia |
| Genel görünüm | İnce, keskin hatlar | Kalın, yumuşak hatlar |
| Weight algısı | Daha ince görünür | Aynı weight daha kalın görünür |
| Anti-aliasing | Sub-pixel | Full-pixel |

### Kabul Edilen Farklar
- Font weight: Aynı weight'in platformlar arası görünüm farkı kabul edilir (iOS ince, Android kalın)
- Line-height: Platform bazlı fine-tuning gerekebilir — ±1-2px fark kabul
- Letter spacing: Küçük farklar kabul edilir — platform rendering engine farkı

### Zorunlu Ayarlar
1. [ZORUNLU] Android'de `includeFontPadding: false` ayarla — varsayılan ekstra padding kaldırılmalı
2. [ZORUNLU] Her font varyantı (regular, medium, semibold, bold) her iki platformda screenshot ile karşılaştırılmalı
3. [YAPILMALI] Line-height değerlerini platform bazlı fine-tune et — tek değer her platformda aynı sonucu vermeyebilir
4. [YAPILMALI] Custom font yüklenmesinde `@expo-google-fonts` veya asset loading kullan — font yüklenmeden metin gösterme
5. [YAPILMAMALI] Platform farkını "bug" olarak ele alma — rendering engine farkı doğaldır, tolerans dahilinde kabul et
6. [YAPILMAMALI] Tek platformda test edip diğerinde sorun olmadığını varsayma

### Test Gerekliliği
- Her font varyantı için iOS + Android screenshot karşılaştırması (PR'da visual proof)
- Dynamic Type / font scaling aktifken de kontrol et
- Dark mode'da font rendering farkı olup olmadığını doğrula

## Kaynak
- Visual contract → docs/design-system/33-visual-implementation-contract.md
- DESIGN.md kuralları → docs/governance/40-ai-workflow-and-tooling.md §3.3
