---
id: D-UIX
type: domain
name: UI/UX Kalitesi, Apple HIG, Premium Ton
kaynak-dokümanlar: 03, 33, 34
miras-tipi: zorunlu
son-güncelleme: 2026-04-02
---

# D-UIX: UI/UX & HIG Guardrail

## Bu Guardrail Ne Zaman Aktif?
- Herhangi bir UI component veya ekran oluşturulurken/düzenlenirken
- Yeni ekran (A-NEW-SCRN), yeni component (A-NEW-COMP)
- Form geliştirme (A-FORM), navigation değişikliği (A-NAV)
- Styling/theme değişikliği (A-STYLE)
- AI/ML feature entegrasyonu (A-AI-FEAT)

---

## 1. Apple HIG Temel Tasarım Prensipleri

### 1.1. Estetik Bütünlük (Aesthetic Integrity)
1. [YAPILMALI] Uygulamanın görünümü ve davranışı amacıyla uyumlu olmalı
2. [YAPILMAMALI] Üretkenlik uygulamasında dikkat dağıtıcı dekoratif süslemeler kullanma

### 1.2. Tutarlılık (Consistency)
3. [YAPILMALI] Platform tarafından sağlanan kontroller, tanıdık ikonlar ve standart metin stilleri kullan
4. [YAPILMAMALI] Standart kontrollerin davranışını değiştirme

### 1.3. Doğrudan Manipülasyon (Direct Manipulation)
5. [YAPILMALI] Kullanıcıların ekrandaki içerikle doğrudan etkileşim kurabilmesini sağla
6. [YAPILMAMALI] Basit bir etkileşimi birden fazla adıma bölme

### 1.4. Geri Bildirim (Feedback)
7. [ZORUNLU] Her kullanıcı eyleminin karşılığında anlamlı geri bildirim sağla
8. [YAPILMALI] Animasyon, haptic ve görsel ipuçları ile sonuçları ilet
9. [YAPILMAMALI] Sessiz başarısızlık — kullanıcıyı belirsizlikte bırakma

### 1.5. Kullanıcı Kontrolü (User Control)
10. [ZORUNLU] Yıkıcı eylemlerde onay iste ve geri alma (undo) imkanı sun
11. [YAPILMALI] İptal kolaylığı sağla — kullanıcı kararını değiştirebilmeli
12. [YAPILMAMALI] Kullanıcı onayı olmadan otomatik yıkıcı eylem gerçekleştirme

---

## 2. Touch Target & Ergonomi

13. [ZORUNLU] Interactive öğelerde minimum 44×44pt touch target sağla
14. [YAPILMAMALI] Dense layout bahanesiyle hit area düşürülmemeli
15. [YAPILMAMALI] Icon-only button'lar küçük bırakılmamalı
16. [YAPILMALI] Tek elle kullanım düşünülerek kritik aksiyonlar erişilebilir bölgede olmalı (iOS thumb zone)

---

## 3. Safe Area & Edge Behavior

17. [ZORUNLU] Mobil kök yüzeyler safe area abstraction kullanmalı
18. [YAPILMAMALI] Notch/home indicator/Dynamic Island alanları ihlal edilmemeli
19. [YAPILMAMALI] Safe area'yı feature-level hack'lerle çözme
20. [YAPILMALI] Edge-to-edge tasarımda içerik safe area sınırlarına saygı göstermeli

---

## 4. Typography & Hierarchy

### 4.1. Metin Hiyerarşisi
21. [YAPILMALI] Semantic typography role kullan (heading, body, caption, footnote)
22. [YAPILMAMALI] Body text keyfi küçültülmemeli
23. [YAPILMAMALI] Tek ekranda birden fazla tipografi dili karıştırılmamalı

### 4.2. Apple Text Style Eşleştirmesi
24. [YAPILMALI] Design token'lar Apple HIG metin stillerine semantik olarak karşılık gelmeli:
   - Large Title (34pt) → ekran başlıkları
   - Title 1/2/3 (28/22/20pt) → bölüm başlıkları
   - Headline (17pt semibold) → vurgulu başlık
   - Body (17pt) → birincil içerik
   - Callout (16pt) → açıklama metinleri
   - Subheadline (15pt) → ikincil bilgi
   - Footnote (13pt) → dipnotlar
   - Caption 1/2 (12/11pt) → etiketler, zaman damgaları

### 4.3. Dynamic Type
25. [ZORUNLU] Tüm metin içerikleri Dynamic Type / font scaling desteğine sahip olmalı
26. [YAPILMALI] xSmall'dan AX5'e kadar tüm boyut kategorilerinde test et
27. [YAPILMALI] Metin kesilmesinden kaçın — truncation yerine wrapping tercih et
28. [YAPILMAMALI] Sabit font boyutları (hardcoded px/pt) kullanma — semantic token kullan
29. [YAPILMAMALI] Layout'ları sadece varsayılan metin boyutunda test edip bırakma

---

## 5. Color & Contrast

### 5.1. Semantik Renk Sistemi
30. [ZORUNLU] WCAG AA contrast oranına uy (4.5:1 text, 3:1 large text / UI components)
31. [ZORUNLU] Semantic color token kullan — raw palette doğrudan tüketilmemeli
32. [YAPILMALI] Metin hiyerarşisi için label/secondaryLabel/tertiaryLabel karşılıkları kullan
33. [YAPILMALI] Arka plan katmanları için background/secondaryBackground/tertiaryBackground kullan
34. [YAPILMALI] Durum renkleri tutarlı olmalı: kırmızı=hata, yeşil=başarı, mavi=bilgi, sarı=uyarı

### 5.2. Dark Mode
35. [ZORUNLU] Dark mode her zaman desteklenmeli
36. [YAPILMALI] Dark/Light mode geçişinde tüm yüzeyler test edilmeli
37. [YAPILMALI] Increase Contrast ayarına uyum sağlanmalı
38. [YAPILMAMALI] Bilgi sadece renk ile iletilmemeli — ek görsel ipucu (şekil, ikon, metin) ekle

---

## 6. İkonografi & SF Symbols

39. [YAPILMALI] Platform ikon dilini kullan — iOS'ta SF Symbols eşdeğeri, web'de tutarlı ikon seti
40. [YAPILMALI] İkonlar 9 ağırlık ve 3 ölçek varyantı düşünülerek ölçeklenebilir olmalı
41. [YAPILMALI] İkon animasyonları bağlama uygun olmalı (bounce, pulse, scale)
42. [YAPILMAMALI] Küçük boyutlarda okunaksız detaylı ikonlar kullanma
43. [YAPILMAMALI] Platform ikonografik diline aykırı stiller karıştırma (filled vs outlined tutarsızlık)

---

## 7. Button Hierarchy & Action Clarity

44. [YAPILMALI] Birincil/ikincil/yıkıcı aksiyon ayrımı net olmalı
45. [YAPILMAMALI] Tek ekranda birden fazla primary ağırlıklı buton bulunmamalı
46. [YAPILMAMALI] Destructive action görsel ayrışması atlanmamalı (kırmızı vurgu)
47. [YAPILMALI] Alert dialog'larda buton metinleri net eylem ifadesi taşımalı ("Tamam" yerine "Sil", "Tekrar Dene")
48. [YAPILMALI] Yıkıcı eylem butonları kırmızı ile vurgulanmalı, iptal butonu her zaman bulunmalı

---

## 8. Navigation & Modal

49. [YAPILMALI] Back/dismiss davranışı her ekranda net olmalı
50. [YAPILMALI] Modal/sheet/dialog doğru presentation surface'te kullanılmalı
51. [YAPILMAMALI] Modal/sheet/dialog rastgele seçilmemeli
52. [YAPILMAMALI] Hamburger menü iOS'ta kullanılmamalı — Tab bar + Navigation bar tercih et

### 8.1. iOS Navigation Pattern'leri
53. [YAPILMALI] Tab bar: maksimum 5 tab, simge + etiket birlikte
54. [YAPILMALI] Navigation bar: başlık mevcut konumu göstermeli, Large Title → Inline geçişi desteklenmeli
55. [YAPILMALI] Sistem geri gestürünü (swipe from edge) destekle — engelleme
56. [YAPILMAMALI] Tab bar'ı alt sayfalarda gizleme
57. [YAPILMAMALI] Navigation derinliğini 3-4 seviyenin üzerine çıkarma

### 8.2. Sheet & Modal Kuralları
58. [YAPILMALI] Sheet sunum: yarı yükseklikte kayma + dismiss swipe-down
59. [YAPILMALI] Dismiss işlemi her zaman açık olmalı (kapatma butonu veya swipe-down)
60. [YAPILMAMALI] Modal içinde derin navigasyon zincirleri kurma
61. [YAPILMAMALI] Non-modal çözülebilecek durumları gereksiz yere modal yapma

---

## 9. State Visibility

62. [YAPILMALI] Focused, selected, disabled, loading, invalid state'leri görünür olmalı
63. [YAPILMAMALI] State farkı yalnızca renk ile verilmemeli (ek görsel ipucu gerekli)
64. [YAPILMALI] Hover state'ler (web/iPadOS pointer) tanımlı olmalı
65. [YAPILMALI] Pressed state geri bildirimi (scale-down, opacity change) sağlanmalı

---

## 10. Geri Bildirim & Haptics

66. [YAPILMALI] Başarılı eylemler için onay geri bildirimi sun (checkmark animasyonu, haptic)
67. [YAPILMALI] Hatalı eylemler için uyarı geri bildirimi sun (shake animasyonu, error haptic)
68. [YAPILMALI] Pull-to-refresh'te spring animasyonu ile dönen gösterge kullan
69. [YAPILMAMALI] Haptic geri bildirimi gereksiz yere aşırı kullanma
70. [YAPILMALI] Haptic ile görsel geri bildirimi eşle — biri olmadan diğeri olmamalı

---

## 11. Premium Ton & Visual Clarity

71. [YAPILMALI] Spacing ritmi tutarlı olmalı — 4pt/8pt grid sistemi
72. [YAPILMALI] Gereksiz görsel gürültüden kaçın — netlik öncelikli
73. [YAPILMAMALI] "Premium" parlak efekt, gradient yığını veya dekoratif noise ile karıştırılmamalı
74. [YAPILMALI] Surface language (kart, container, section) tutarlı olmalı
75. [YAPILMALI] İçerik yoğunluğu (content density) platform ve bağlama uygun olmalı

---

## 12. Platform-Specific HIG Beklentileri

### 12.1. iOS (iPhone)
76. [YAPILMALI] Tek elle kullanım odaklı, thumb zone düşün
77. [YAPILMALI] Edge-to-edge tasarım, Dynamic Island/notch uyumu
78. [YAPILMAMALI] Android/Material Design pattern'leri iOS'ta kullanma

### 12.2. iPadOS
79. [YAPILMALI] Multitasking desteği: Split View, Slide Over uyumu
80. [YAPILMALI] Sidebar navigasyonu büyük ekranlarda, Tab bar ↔ Sidebar dönüşümü
81. [YAPILMALI] Pointer (trackpad/mouse) hover efektleri, keyboard shortcuts

### 12.3. Web
82. [YAPILMALI] Keyboard-first etkileşim, tab ile navigasyon
83. [YAPILMALI] Responsive layout, breakpoint adaptasyonu
84. [YAPILMALI] Hover state, cursor değişimleri, bağlam menüleri

---

## Kalite Eşikleri
- [MİNİMUM] Sıfır touch target ihlali
- [MİNİMUM] Sıfır safe area ihlali
- [MİNİMUM] WCAG AA contrast uyumu
- [MİNİMUM] Dynamic Type / font scaling desteği
- [MİNİMUM] Dark mode desteği
- [ÖNERİLEN] Her state (idle, hover, focus, active, disabled) görsel olarak farklı
- [ÖNERİLEN] Haptic geri bildirim entegrasyonu (mobile)

## Anti-pattern'ler
1. [ZAYIF] 44pt altında tap target
2. [ZAYIF] Safe area olmadan tam ekran layout
3. [ZAYIF] Aynı ekranda 2+ primary buton
4. [ZAYIF] Placeholder'ı label yerine kullanma
5. [ZAYIF] Loading state'te kullanıcıya geri bildirim vermeme
6. [ZAYIF] iOS'ta Android tarzı navigation pattern kullanma (hamburger menü, FAB)
7. [ZAYIF] Hardcoded font boyutu — Dynamic Type desteği yok
8. [ZAYIF] Dark mode'u göz ardı etme
9. [ZAYIF] Bilgiyi sadece renkle iletme (ek ipucu yok)
10. [ZAYIF] Sistem gestürlerini engelleme (swipe-back, edge swipe)
11. [ZAYIF] Linear easing kullanma — spring-based animasyon tercih et
12. [ZAYIF] Alert dialog'da "Tamam" / "İptal" gibi belirsiz buton metinleri

## Kontrol Listesi
- [ ] Touch target minimum 44×44pt mi?
- [ ] Safe area doğru kullanılıyor mu?
- [ ] Button hierarchy net mi (primary/secondary/destructive)?
- [ ] Contrast oranları AA'yı karşılıyor mu?
- [ ] Tüm interactive state'ler görünür mü?
- [ ] Back/dismiss davranışı net mi?
- [ ] Spacing ritmi tutarlı mı?
- [ ] Dynamic Type / font scaling destekleniyor mu?
- [ ] Dark mode doğru çalışıyor mu?
- [ ] Semantic color token kullanılıyor mu?
- [ ] iOS navigation pattern'lerine uyuluyor mu (tab bar, navigation bar)?
- [ ] Sheet/modal dismiss mekanizması açık mı?
- [ ] Geri bildirim (haptic + visual) eşlenmiş mi?
- [ ] SF Symbols / tutarlı ikon seti kullanılıyor mu?

## İhlal Durumunda
- Touch target, safe area, contrast, Dynamic Type → hemen düzelt (blocker seviye)
- Button hierarchy, state visibility, dark mode → düzelt veya gerekçelendir
- Premium ton, icon tutarlılığı → audit/review'da değerlendirilir

---

## Bottom Sheet Interaction Standardı

Bottom sheet bileşenlerinin etkileşim kuralları:

### Snap Point Tanımları
| Snap | Yüzde | Kullanım |
|------|-------|----------|
| Peek | %25 | Kısa bilgi, teaser, minimal içerik |
| Medium | %50 | Kısa form, bilgi kartı, seçenekler |
| Expanded | %90 | Uzun form, tam liste, detaylı içerik |

### Drag Indicator
- Boyut: 36×4px, border-radius 2px
- Renk: `color-surface-tertiary` semantic token
- Konum: Sheet üstünde merkezi, 8px padding-top

### Dismiss Mekanizmaları
- [ZORUNLU] Drag down (aşağı sürükle) ile dismiss desteklenmeli
- [ZORUNLU] Backdrop tap ile dismiss desteklenmeli (form sheet'lerde unsaved guard ekle)
- [ZORUNLU] Close butonu her zaman görünür olmalı — tek dismiss yöntemi gesture olmamalı
- [YAPILMAMALI] Sadece close buton ile dismiss — gesture desteği zorunlu

### Keyboard Davranışı
- [ZORUNLU] Keyboard açıldığında sheet yukarı kaymalı — input alanı görünür kalmalı
- [YAPILMALI] `KeyboardAvoidingView` veya `android:windowSoftInputMode="adjustResize"` kullan

### Nested Scroll
- [YAPILMALI] Expanded (tam açık) durumda içerik scroll edilebilir olmalı
- [YAPILMALI] Peek/medium durumda scroll devre dışı — sheet drag öncelikli
- [YAPILMAMALI] Scroll ve sheet drag aynı anda aktif — gesture conflict (D-MOT ile kesişir)

### Erişilebilirlik
- [ZORUNLU] `role="dialog"` ve `aria-label` tanımla
- [ZORUNLU] Focus trap: Sheet açıkken arkadaki içerik erişilemez olmalı
- [YAPILMALI] ESC tuşu (web) ile dismiss

### Performans
- [ZORUNLU] Reanimated 3 gesture handler kullan — 60fps animasyon
- [YAPILMAMALI] Animated API ile sheet animasyonu — JS thread bottleneck riski

---

## Search UX Pattern

Arama özelliği implementasyonu için standart kurallar:

### Input Davranışı
- [ZORUNLU] Debounced input: 300ms gecikme ile API çağrısı — her tuşta istek atma
- [ZORUNLU] Clear butonu: Input'ta metin varken `×` butonu göster
- [ZORUNLU] Cancel butonu: Arama modundan çıkış (iOS: "İptal", Android: back arrow)
- [YAPILMALI] `returnKeyType="search"` — klavyede Enter yerine Ara butonu
- [YAPILMALI] Auto-focus: Arama ekranı açıldığında input'a odaklan

### Son Aramalar
- [YAPILMALI] Son 5 aramayı MMKV'de sakla (D-OFL ile kesişir)
- [YAPILMALI] Arama inputuna tıklandığında son aramaları listele
- [YAPILMALI] Her son arama öğesinde silme butonu
- [YAPILMALI] "Tümünü temizle" seçeneği

### Öneriler (Suggestions)
- [YAPILMALI] API destekliyorsa debounced autocomplete önerileri göster
- [YAPILMALI] Öneriler son aramaların altında ayrı bölümde
- [YAPILMAMALI] Her karakter için ayrı öneri isteği — debounce uygula (300ms)

### Sonuç Listesi
- [ZORUNLU] Sonuçlar FlashList ile infinite scroll destekli gösterilmeli (D-PRF ile kesişir)
- [ZORUNLU] Sonuç bulunamazsa: "Sonuç bulunamadı" mesajı + arama önerileri
- [YAPILMALI] Loading durumunda skeleton veya spinner göster
- [YAPILMALI] Sonuçlarda arama terimini vurgula (highlight)

### Analytics
- [ZORUNLU] Şu event'leri tanımla: `search_started`, `search_query_submitted`, `search_result_tapped`, `search_no_result`
- [YAPILMALI] Popüler arama terimleri ve sıfır sonuç sorgularını analiz et

## 13. In-App Rating ve Feedback Kuralları

85. [ZORUNLU] iOS'ta StoreKit native API kullan — custom rating dialog (yıldız seçimi) YASAK (Apple App Store Review Guidelines 5.6.1)
86. [ZORUNLU] Rating prompt'u negatif deneyim anında gösterme (hata sonrası, crash recovery, ödeme sırasında)
87. [ZORUNLU] Rating prompt gösterimi yılda max 3 kez (Apple kısıtlaması — iOS otomatik enforce eder)
88. [YAPILMALI] Minimum 3 başarılı oturum ve 3 gün kullanım sonrası rating iste
89. [YAPILMALI] Shake-to-report bug raporu için cihaz bilgisi ve Sentry event ID otomatik ekle
90. [YAPILMALI] Feedback form'da kategorilendirme (bug/öneri/soru) sun — serbest metin yerine
91. [YAPILMAMALI] İlk uygulama açılışında rating prompt gösterme
92. [YAPILMAMALI] Rating prompt sonucunu backend'e kaydetmeye çalışma (API dönmez)
93. [YAPILMAMALI] Feedback form'da email alanını zorunlu yapma (kullanıcı bırakma riski)

---

## Kaynak
- UI/UX kalite standardı → docs/design-system/03-ui-ux-quality-standard.md
- Visual implementation contract → docs/design-system/33-visual-implementation-contract.md
- HIG enforcement → docs/design-system/34-hig-enforcement-strategy.md
- Platform adaptation → docs/design-system/26-platform-adaptation-rules.md
- Apple HIG referans → developer.apple.com/design/human-interface-guidelines/
