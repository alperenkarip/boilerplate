---
id: D-MOT
type: domain
name: Motion, Interaction, Animation
kaynak-dokümanlar: 24
miras-tipi: yapısal
son-güncelleme: 2026-04-01
---

# D-MOT: Motion & Interaction Guardrail

## Bu Guardrail Ne Zaman Aktif?
- Yeni component (A-NEW-COMP) — animasyon içeriyorsa
- Yeni ekran (A-NEW-SCRN) — transition içeriyorsa
- Styling/theme değişikliği (A-STYLE) — motion token değişikliği

## Zorunlu Kurallar

### Motion Token
1. [YAPILMALI] Duration ve easing değerleri motion token'larından alınmalı
2. [YAPILMAMALI] Hardcoded duration (`300ms`) veya easing (`ease-in-out`) kullanma
3. [YAPILMAMALI] Component içinde keyfi animation değerleri tanımlama

### Reduced Motion
4. [ZORUNLU] Her animasyon reduced motion guard içermeli (`prefers-reduced-motion`)
5. [YAPILMALI] Reduced motion'da: essential animasyonlar basitleştirilmeli, dekoratif olanlar kaldırılmalı
6. [YAPILMAMALI] Reduced motion guard olmadan animasyon ekleme

### Amaç & Ölçü
7. [YAPILMALI] Motion amacı net olmalı: yönlendirme, geri bildirim, bağlam aktarımı
8. [YAPILMAMALI] Dekoratif/gösterişçi animasyon ekleme — kullanıcıya değer katmalı
9. [YAPILMAMALI] Aşırı animation density — ekranı yorucu yapma

### Platform (Apple HIG Motion Detay)
10. [YAPILMALI] Navigation transition dili platform convention'larıyla uyumlu olmalı
11. [YAPILMAMALI] iOS'ta Android tarzı transition, Android'de iOS tarzı transition kullanma

### Apple HIG Animasyon Prensipleri
12. [YAPILMALI] Spring-based animasyonlar tercih et — doğal fizik hissi
13. [YAPILMAMALI] Linear easing kullanma — doğal hareket için spring veya ease-in-out tercih et
14. [YAPILMALI] Tipik süre: 200-350ms (kısa etkileşimler), 500-700ms (sayfa geçişleri)
15. [YAPILMALI] 60fps minimum hedef, ProMotion ekranlarda 120fps

### Apple HIG Geçiş Türleri
16. [YAPILMALI] Push/pop: kayma (slide) animasyonu
17. [YAPILMALI] Modal: slide-up + dimmed background
18. [YAPILMALI] Sheet: yarı yükseklikte kayma
19. [YAPILMALI] Zoom geçişi: detay ekranına geçerken öğe genişlemesi
20. [YAPILMALI] Geçişlerde matched geometry / shared element transition ile görsel süreklilik

### Apple HIG Geri Bildirim Animasyonları
21. [YAPILMALI] Butona basıldığında scale-down efekti
22. [YAPILMALI] Pull-to-refresh: spring animasyonu ile dönen gösterge
23. [YAPILMALI] Haptic eşliğinde görsel tepki — biri olmadan diğeri eksik olmamalı
24. [YAPILMALI] Success: checkmark animasyonu, Error: shake animasyonu

### Reduced Motion Alternatifleri (Apple HIG)
25. [YAPILMALI] Parallax, zoom, slide → crossfade'e dönüştür
26. [YAPILMALI] Otomatik oynayan animasyonları durdur
27. [YAPILMAMALI] Reduced motion'da tüm geri bildirimi kaldırma — basitleştir ama kaldırma

## Anti-pattern'ler
1. [ZAYIF] `transition: all 300ms ease-in-out` — hardcoded duration/easing, motion token kullan
2. [ZAYIF] Animasyon var ama `prefers-reduced-motion` guard yok
3. [ZAYIF] Dekoratif animasyon — kullanıcıya değer katmayan parlak efektler
4. [ZAYIF] iOS'ta Android tarzı slide transition
5. [ZAYIF] Aşırı animasyon density — ekrandaki her element hareket ediyor
6. [ZAYIF] Linear easing — doğal hareket değil, mekanik his
7. [ZAYIF] Animasyon sırasında kullanıcı girişi engelleniyor
8. [ZAYIF] Animasyon süresi 700ms üstü — kullanıcıyı bekletiyor
9. [ZAYIF] Reduced motion'da parallax/zoom hala aktif
10. [ZAYIF] Haptic-görsel geri bildirim uyumsuzluğu

## Kontrol Listesi
- [ ] Motion token kullanılıyor mu?
- [ ] Reduced motion guard var mı?
- [ ] Animasyon amacı net mi (yönlendirme, geri bildirim, bağlam)?
- [ ] Platform convention'ına uygun mu?
- [ ] Spring-based animasyonlar tercih ediliyor mu?
- [ ] Animasyon süresi uygun aralıkta mı (200-700ms)?
- [ ] Geçişlerde görsel süreklilik var mı?
- [ ] Haptic + görsel geri bildirim eşleşiyor mu?
- [ ] Reduced motion'da alternatif (crossfade) tanımlı mı?
- [ ] Animasyon sırasında kullanıcı girişi engellenmemiş mi?

## Kaynak
- Motion standardı → docs/design-system/24-motion-and-interaction-standard.md
- Apple HIG Motion → developer.apple.com/design/human-interface-guidelines/motion
