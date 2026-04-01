---
id: D-A11
type: domain
name: Accessibility (Erişilebilirlik)
kaynak-dokümanlar: 12
miras-tipi: zorunlu
son-güncelleme: 2026-04-01
---

# D-A11: Accessibility Guardrail

## Bu Guardrail Ne Zaman Aktif?
- Herhangi bir UI component veya ekran oluşturulurken/düzenlenirken
- Form geliştirme (A-FORM)
- Navigation değişikliği (A-NAV)
- Her zaman D-UIX ile birlikte aktif

## Zorunlu Kurallar

### WCAG AA Minimum (Zorunlu Miras — Gevşetilemez)
1. [ZORUNLU] WCAG 2.1 AA minimum erişilebilirlik seviyesi
2. [ZORUNLU] Text contrast: minimum 4.5:1 (normal text), 3:1 (large text / UI components)
3. [ZORUNLU] Touch target: minimum 44×44pt

### Semantic Markup & Roles
4. [YAPILMALI] Her interactive öğede role tanımlı olmalı (button, link, textbox, vb.)
5. [YAPILMALI] Her interactive öğede erişilebilir isim (accessible name) olmalı
6. [YAPILMALI] Icon-only button'larda aria-label / accessibilityLabel zorunlu
7. [YAPILMAMALI] Unlabeled interactive element bırakılmamalı
8. [YAPILMAMALI] `<div onClick>` ile custom button yapılmamalı — semantic element kullan

### Focus Management
9. [YAPILMALI] Keyboard focus sırası mantıklı ve görsel sırayla uyumlu olmalı
10. [YAPILMALI] Focus visible state her zaman gösterilmeli
11. [YAPILMALI] Modal/dialog açıldığında focus içine taşınmalı, kapandığında geri dönmeli
12. [YAPILMAMALI] Focus trap'siz modal açılmamalı

### Screen Reader
13. [YAPILMALI] Dynamic content değişiklikleri live region ile duyurulmalı
14. [YAPILMALI] Form error'ları programatik olarak ilişkilendirilmeli (aria-describedby)
15. [YAPILMAMALI] Dekoratif görseller screen reader'a okunmamalı (aria-hidden)
16. [YAPILMAMALI] Sadece görsel ipucu ile bilgi verilmemeli (renk + ek gösterge)

### Motion & Reduced Motion
17. [ZORUNLU] Reduced motion tercihine saygı göster (prefers-reduced-motion)
18. [YAPILMAMALI] Reduced motion guard olmadan animasyon eklenmemeli

### Platform-Specific (Apple HIG Detay)
19. [YAPILMALI] Web: semantic HTML element'leri öncelikli kullan
20. [YAPILMALI] Mobile: React Native accessibility prop'larını eksiksiz kullan
21. [ZORUNLU] Mobile: Dynamic Type / font scaling desteği — tüm metin boyutlarında test
22. [YAPILMALI] VoiceOver (iOS) / TalkBack (Android) ile tam kullanım testi yap
23. [YAPILMALI] accessibilityTraits / accessibilityRole özel kontrollerde doğru tanımla
24. [YAPILMALI] Dekoratif görselleri `accessibilityElementsHidden` / `aria-hidden` ile gizle

### Bilişsel Erişilebilirlik (Apple HIG)
25. [YAPILMALI] Basit ve tutarlı navigasyon kalıpları kullan
26. [YAPILMAMALI] Kullanıcı hızını zorlayan zamanlayıcılar (timeout ile veri kaybı)
27. [YAPILMALI] Otomatik oynayan medya kullanıcı kontrolüne bırakılmalı
28. [YAPILMAMALI] Karmaşık gestürleri tek girdi yöntemi olarak sunma — alternatif yol sağla

### Motor Erişilebilirlik (Apple HIG)
29. [YAPILMALI] Tüm işlevler tek elle kullanılabilir olmalı
30. [YAPILMALI] AssistiveTouch / Switch Control uyumluluğu sağlanmalı
31. [YAPILMAMALI] Karmaşık gestürler (pinch, multi-finger) için alternatif yol sunmama

### Renk Körlüğü & Görsel Erişilebilirlik (Apple HIG)
32. [ZORUNLU] Bilgi sadece renk ile iletilmemeli — şekil, ikon veya metin ile destekle
33. [YAPILMALI] Reduce Transparency ayarına uyum sağla
34. [YAPILMALI] Bold Text ayarına uyum sağla

## Kalite Eşikleri
- [MİNİMUM] WCAG AA tam uyum (gevşetilemez)
- [MİNİMUM] Sıfır unlabeled interactive element
- [MİNİMUM] Sıfır contrast ihlali
- [MİNİMUM] Dynamic Type desteği tüm metin öğelerinde
- [MİNİMUM] VoiceOver ile tam navigasyon
- [ÖNERİLEN] AAA seviyesinde contrast (7:1)
- [ÖNERİLEN] Tam keyboard-only navigation desteği
- [ÖNERİLEN] Switch Control uyumluluğu

## Anti-pattern'ler
1. [ZAYIF] `<div onClick={handler}>Tıkla</div>` — semantic element değil
2. [ZAYIF] Icon button'da label/aria-label yok
3. [ZAYIF] Tab order görsel sırayla uyumsuz
4. [ZAYIF] Error durumu yalnızca renk değişikliğiyle gösteriliyor
5. [ZAYIF] Animasyon reduced-motion guard'sız
6. [ZAYIF] Dynamic Type desteksiz sabit font boyutu
7. [ZAYIF] Dekoratif görsel screen reader'a okunuyor
8. [ZAYIF] Karmaşık gestür için alternatif yol yok
9. [ZAYIF] Bold Text ayarı göz ardı ediliyor
10. [ZAYIF] accessibilityLabel anlamsız metin içeriyor ("button1", "img_3")

## Kontrol Listesi
- [ ] Tüm interactive öğelerde role ve accessible name var mı?
- [ ] Contrast oranları AA'yı karşılıyor mu?
- [ ] Touch target minimum 44×44pt mi?
- [ ] Focus sırası mantıklı mı?
- [ ] Modal/dialog'da focus trap var mı?
- [ ] Reduced motion guard var mı?
- [ ] Form error'ları programatik ilişkili mi?
- [ ] Dynamic Type / font scaling tüm boyutlarda test edildi mi?
- [ ] VoiceOver/TalkBack ile tam kullanım testi yapıldı mı?
- [ ] Dekoratif görseller aria-hidden/accessibilityElementsHidden mı?
- [ ] Bilgi sadece renkle iletilmiyor mu? (ek ipucu var mı?)
- [ ] Karmaşık gestürler için alternatif yol var mı?
- [ ] Bold Text ve Reduce Transparency ayarlarına uyum var mı?

## İhlal Durumunda
- A11y ihlalleri blocker seviyededir — hemen düzelt
- WCAG AA altına düşürülemez (zorunlu miras)
- Dynamic Type desteği eksikliği blocker
- VoiceOver navigasyon başarısızlığı blocker
- Exception yalnızca 44-exception-and-exemption-policy.md ile ve geçici

## Kaynak
- Accessibility standardı → docs/quality/12-accessibility-standard.md
- HIG enforcement → docs/design-system/34-hig-enforcement-strategy.md
- Apple HIG Accessibility → developer.apple.com/design/human-interface-guidelines/accessibility
