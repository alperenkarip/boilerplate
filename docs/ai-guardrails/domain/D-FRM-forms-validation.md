---
id: D-FRM
type: domain
name: Forms, Validation, Input UX
kaynak-dokümanlar: 11, ADR-006
miras-tipi: yapısal
son-güncelleme: 2026-04-01
---

# D-FRM: Forms & Validation Guardrail

## Bu Guardrail Ne Zaman Aktif?
- Form geliştirme/düzenleme (A-FORM)
- Input, field, validation kodu yazılırken
- Submit lifecycle implementasyonunda

## Zorunlu Kurallar

### Form Engine & Validation
1. [ZORUNLU] Form engine: React Hook Form 7.x (ADR-006)
2. [ZORUNLU] Validation engine: Zod 4.x (ADR-006)
3. [ZORUNLU] Schema-first validation: önce Zod schema tanımla, sonra form'a bağla
4. [YAPILMAMALI] Ad-hoc validation (if/else ile elle doğrulama) yazılmamalı
5. [YAPILMAMALI] Form state'i app-global state'e (Zustand) karıştırılmamalı

### Field Yapısı
6. [YAPILMALI] Her field: label + input + helper text + error text yapısına sahip olmalı
7. [YAPILMALI] Label her zaman görünür olmalı — placeholder label yerine geçmez
8. [YAPILMALI] Error ve helper text arasında net ayrım olmalı
9. [YAPILMAMALI] Placeholder tek başına label olarak kullanılmamalı
10. [YAPILMAMALI] Error mesajı field'dan uzakta gösterilmemeli

### Validation Timing
11. [YAPILMALI] Validation onBlur veya onSubmit'te çalışmalı — onChange'de erken cezalandırma yapma
12. [YAPILMALI] Async validation (API kontrolü) debounced olmalı
13. [YAPILMAMALI] Kullanıcı henüz yazmaya başlamadan hata gösterme (untouched field)

### Submit Lifecycle
14. [YAPILMALI] Submit sırasında loading indicator göster
15. [YAPILMALI] Submit başarısızlığında net hata mesajı göster
16. [YAPILMALI] Çift submit'i engelle (disabled button veya debounce)
17. [YAPILMAMALI] Submit sonrası kullanıcıyı bilgilendirmeden sessizce yönlendirme

### Erişilebilirlik
18. [ZORUNLU] Her input'un programatik label ilişkisi olmalı (htmlFor / accessibilityLabel)
19. [ZORUNLU] Error state screen reader tarafından okunabilir olmalı (aria-invalid, aria-describedby)
20. [YAPILMALI] Keyboard tab order mantıklı sırada olmalı
21. [YAPILMALI] Mobile'da doğru keyboard tipi açılmalı (email, numeric, vb.)

### Apple HIG Form Kuralları
22. [YAPILMALI] `textContentType` doğru tanımla (.emailAddress, .password, .name, .telephoneNumber)
23. [YAPILMALI] AutoFill ve Passkey desteği sağla — `textContentType` ile otomatik
24. [YAPILMALI] Gruplu tablo stili (grouped table view) form layout'unu tercih et
25. [YAPILMALI] Bölümler açık başlıklar ve footer açıklamaları ile ayrılmalı
26. [YAPILMALI] Çok adımlı formlarda ilerleme göstergesi (sayfa/adım) sun
27. [YAPILMALI] Kaydedilmemiş değişiklik uyarısı — formdan ayrılma riski olan yerlerde

### Apple HIG Seçim Kontrolleri
28. [YAPILMALI] Toggle (Switch): sadece iki durumlu açık/kapalı için
29. [YAPILMALI] Segmented Control: 2-5 seçenek arası
30. [YAPILMALI] Picker: uzun listelerden seçim
31. [YAPILMALI] Date Picker: tarih/saat seçimi — sistem Date Picker'ını kullan
32. [YAPILMAMALI] Seçim kontrol türlerini birbirine karıştırma (toggle yerine checkbox vb.)

### Apple HIG Doğrulama Geri Bildirimi
33. [YAPILMALI] Inline hata: kırmızı renk + exclamation ikon + açıklayıcı metin
34. [YAPILMALI] Hata düzeltildiğinde otomatik temizleme
35. [YAPILMALI] Başarılı doğrulama da gösterilebilir (yeşil onay işareti)
36. [YAPILMAMALI] Gönderme butonunu form dolmadan etkinleştirip sonra hata verme

## Kalite Eşikleri
- [MİNİMUM] Zod schema-first validation
- [MİNİMUM] Label her field'da görünür
- [MİNİMUM] Error message field yanında (inline)
- [MİNİMUM] textContentType / AutoFill desteği
- [ÖNERİLEN] Unsaved changes warning (navigation guard)
- [ÖNERİLEN] Çok adımlı form'da ilerleme göstergesi

## Anti-pattern'ler
1. [ZAYIF] Validation olmadan submit
2. [ZAYIF] `if (value === '') setError('Zorunlu alan')` — ad-hoc validation
3. [ZAYIF] Placeholder'ı label olarak kullanma
4. [ZAYIF] Submit sonrası loading/feedback yok
5. [ZAYIF] Tüm hataları form üstünde tek blok halinde gösterme
6. [ZAYIF] textContentType tanımsız — AutoFill çalışmıyor
7. [ZAYIF] Yanlış keyboard tipi — email alanında genel klavye
8. [ZAYIF] Seçim kontrolü uyumsuz — 10 seçenek için Segmented Control
9. [ZAYIF] Çok adımlı form'da ilerleme göstergesi yok
10. [ZAYIF] Hata düzeltildiğinde hata mesajı hala görünüyor

## Kontrol Listesi
- [ ] Zod schema tanımlandı mı?
- [ ] React Hook Form kullanıldı mı?
- [ ] Her field'da label var mı?
- [ ] Error mesajı field yanında mı (inline)?
- [ ] Validation timing doğru mu (onBlur/onSubmit)?
- [ ] Submit lifecycle (loading, error, success) tanımlı mı?
- [ ] Keyboard ve a11y uyumu sağlandı mı?
- [ ] textContentType doğru tanımlı mı?
- [ ] AutoFill / Passkey desteği çalışıyor mu?
- [ ] Doğru keyboard tipi açılıyor mu (email, numeric vb.)?
- [ ] Seçim kontrolleri uygun türde mi (toggle, segmented, picker)?
- [ ] Çok adımlı form'da ilerleme göstergesi var mı?
- [ ] Kaydedilmemiş değişiklik uyarısı var mı?
- [ ] Hata düzeltildiğinde otomatik temizleme var mı?

## İhlal Durumunda
- Schema eksikliği → Zod schema oluştur
- Ad-hoc validation → Zod'a taşı
- Label eksikliği → hemen ekle
- textContentType eksikliği → hemen tanımla
- Inline hata eksikliği → hemen düzelt

## Kaynak
- Form mimarisi → docs/architecture/11-forms-inputs-and-validation.md
- Form kararı → docs/adr/ADR-006-forms-and-validation.md
- Error states → docs/design-system/25-error-empty-loading-states.md
- Apple HIG Text Fields → developer.apple.com/design/human-interface-guidelines/text-fields
- Apple HIG Entering Data → developer.apple.com/design/human-interface-guidelines/entering-data
