---
id: D-DSY
type: domain
name: Design System, Token, Theming, Component Governance
kaynak-dokümanlar: 04, 05, 22, 23
miras-tipi: yapısal
son-güncelleme: 2026-04-02
---

# D-DSY: Design System Guardrail

## Bu Guardrail Ne Zaman Aktif?
- `.tsx`, `.jsx`, `.css`, `.style.*` dosyaları düzenlenirken
- Yeni component oluşturulurken (A-NEW-COMP)
- Styling/theme değişikliği yapılırken (A-STYLE)
- Herhangi bir UI kodu üretilirken

## Zorunlu Kurallar

### Token Kullanımı
1. [YAPILMALI] Tüm renk değerleri semantic token üzerinden kullanılmalı
2. [YAPILMALI] Tüm spacing değerleri spacing scale token üzerinden kullanılmalı
3. [YAPILMALI] Tüm tipografi değerleri typography token üzerinden kullanılmalı
4. [YAPILMALI] Tüm radius değerleri radius token üzerinden kullanılmalı
5. [YAPILMAMALI] Raw/primitive token doğrudan component'te kullanılmamalı — semantic token kullan
6. [YAPILMAMALI] Hardcoded hex, rgb, hsl, px, rem değeri yazılmamalı
7. [YAPILMAMALI] Component içinde kendi mini token sistemi oluşturulmamalı

### Token Hiyerarşisi (Değiştirilemez — Zorunlu Miras)
8. [ZORUNLU] raw → semantic → component token katman yapısına uy
9. [ZORUNLU] Token isimlendirme kurallarına uy (22-design-tokens-spec.md)
10. [ZORUNLU] Light/dark theme desteği semantic token seviyesinde sağlanmalı

### Component Governance
11. [YAPILMALI] Yeni reusable component açmadan önce 23-component-governance-rules.md kontrol et
12. [YAPILMALI] Component API'si prop contract olarak tanımlanmalı — rastgele prop ekleme
13. [YAPILMALI] Component isimlendirme PascalCase, dosya adıyla eşleşmeli
14. [YAPILMAMALI] Design system dışında yaygın UI inşası yapılmamalı
15. [YAPILMAMALI] Feature-specific component shared UI'a taşınmamalı (gerçek tekrar yoksa)
16. [YAPILMAMALI] Aynı probleme farklı component aileleriyle çözüm üretilmemeli

### Theming
17. [YAPILMALI] Renk kullanımında anlam (semantic) öncelikli düşün: `color.primary`, `color.error`, `surface.background`
18. [YAPILMAMALI] Tema geçişinde kırılan hardcoded değerler bırakılmamalı

### Token Override Audit
19. [ZORUNLU] Semantic token yerine raw/hardcoded değer kullanımı CI'da tespit edilmeli — P0 uyarı
20. [YAPILMALI] CI'da aşağıdaki pattern'ler grep ile taranmalı:
    - Hex renk kodu: `#[0-9a-fA-F]{3,8}` (stil dosyalarında)
    - Piksel değeri: `[0-9]+px` (token olmadan doğrudan kullanım)
    - Font family string: `fontFamily: '...'` (token dışı tanım)
    - Hardcoded shadow: `shadowOffset`, `boxShadow` (token olmadan)
21. [YAPILMALI] Tespit edilen raw değerler semantic token ile değiştirilmeli
22. [YAPILMAMALI] Token override tespit edildiğinde göz ardı etme — hemen düzelt veya exception aç
23. İstisna: Animasyon ara değerleri (interpolation) için geçici raw değerler kabul edilebilir — exception gerektirmez

### Dark Mode Token Parity
24. [ZORUNLU] Light ve dark theme token setleri 1:1 eşleşmeli — her light token'ın dark karşılığı olmalı
25. [ZORUNLU] Eksik dark mode token → CI hata vermeli, build geçmemeli
26. [ZORUNLU] Dark mode renk kontrastı WCAG AA (4.5:1 minimum) karşılamalı
27. [YAPILMALI] Her theme değişikliğinde hem light hem dark mode Storybook story'leri güncellenip test edilmeli
28. [YAPILMAMALI] Dark mode'da light mode token'ını doğrudan kullanmak — her mode kendi semantic token setini tüketmeli

## Kalite Eşikleri
- [MİNİMUM] Sıfır hardcoded renk/spacing/font değeri
- [MİNİMUM] Tüm component'ler semantic token tüketmeli
- [ÖNERİLEN] Component varyantları token-driven olmalı

## Anti-pattern'ler
1. [ZAYIF] `style={{ color: '#333' }}` — hardcoded renk
2. [ZAYIF] `padding: 16` — hardcoded spacing
3. [ZAYIF] `fontSize: 14` — hardcoded tipografi
4. [ZAYIF] Aynı buton tipinin farklı ekranlarda farklı şekilde implement edilmesi
5. [ZAYIF] Component props'unda `style` override ile DS kırma
6. [ZAYIF] `fontFamily: 'Inter'` — hardcoded font family, token kullan
7. [ZAYIF] `boxShadow: '0 2px 4px rgba(0,0,0,0.1)'` — hardcoded shadow, token kullan
8. [ZAYIF] Dark mode'da light mode token'ı doğrudan kullanılıyor — parity bozuk
9. [ZAYIF] Light'ta tanımlı token dark'ta eksik — CI hata vermeli

## Kontrol Listesi
- [ ] Hardcoded renk/spacing/font/radius değeri yok mu?
- [ ] Hardcoded shadow/font-family değeri yok mu?
- [ ] Semantic token kullanıldı mı (raw token değil)?
- [ ] Component isimlendirme PascalCase ve dosya adıyla eşleşiyor mu?
- [ ] Yeni component açılıyorsa governance kuralları kontrol edildi mi?
- [ ] Light/dark theme'de kırılma riski var mı?
- [ ] Light/dark token setleri 1:1 eşleşiyor mu (parity)?
- [ ] Dark mode kontrastı WCAG AA (4.5:1) karşılıyor mu?
- [ ] Hem light hem dark mode Storybook story'leri mevcut mu?
- [ ] CI'da token override grep taraması aktif mi?

## İhlal Durumunda
- Hardcoded değer tespit edilirse semantic token ile değiştir
- Yeni component gerekiyorsa 23-component-governance-rules.md'yi oku
- Düzeltemiyorsan exception kaydı aç: 44-exception-and-exemption-policy.md

## Kaynak
- Token spesifikasyonu → docs/design-system/22-design-tokens-spec.md
- DS mimarisi → docs/design-system/04-design-system-architecture.md
- Theming → docs/design-system/05-theming-and-visual-language.md
- Component governance → docs/design-system/23-component-governance-rules.md
