---
id: D-FRM
type: domain
name: Forms, Validation, Input UX
kaynak-dokümanlar: 11, ADR-006
miras-tipi: yapısal
son-güncelleme: 2026-04-02
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

### Form Analytics Event Standardı
37. [YAPILMALI] Form yaşam döngüsü boyunca aşağıdaki analytics event'leri gönderilmeli:

| Event | Tetikleyici | Payload |
|---|---|---|
| `form_start` | Form ilk kez render olduğunda | `{ form_name, screen, timestamp }` |
| `form_field_error` | Field-level validation hatası oluştuğunda | `{ form_name, field_name, error_type, timestamp }` |
| `form_submit` | Submit butonuna basıldığında | `{ form_name, field_count, filled_count, timestamp }` |
| `form_success` | Submit başarılı olduğunda | `{ form_name, duration_ms, timestamp }` |
| `form_error` | Submit sunucu hatası döndürdüğünde | `{ form_name, error_type, error_code, timestamp }` |
| `form_abandon` | Kullanıcı formu terk ettiğinde (dirty form) | `{ form_name, filled_fields, last_field, timestamp }` |

38. [YAPILMALI] `form_abandon` event'i şu durumlarda tetiklenmeli: navigation away (geri butonu, tab değişikliği), app background'a geçiş (dirty form varsa)
39. [YAPILMAMALI] Analytics payload'ında kullanıcının girdiği veriyi (şifre, e-posta, telefon vb.) göndermek — sadece meta veri

### Autofill Uyumluluğu
40. [ZORUNLU] Login ve kayıt formlarında autofill desteği zorunlu
41. [YAPILMALI] `textContentType` (iOS) ve `autoComplete` (Android/web) mapping'i doğru uygulanmalı:

| Veri Türü | iOS textContentType | Android/Web autoComplete |
|---|---|---|
| E-posta | `emailAddress` | `email` |
| Mevcut şifre | `password` | `current-password` |
| Yeni şifre | `newPassword` | `new-password` |
| Ad-soyad | `name` | `name` |
| Telefon | `telephoneNumber` | `tel` |
| Adres | `fullStreetAddress` | `street-address` |
| Kredi kartı | `creditCardNumber` | `cc-number` |
| Tek kullanımlık kod (OTP) | `oneTimeCode` | `one-time-code` |

42. [YAPILMALI] iOS Simulator'da Password AutoFill testi yapılmalı
43. [YAPILMALI] Android Autofill Framework ile test yapılmalı
44. [YAPILMAMALI] `autoComplete="off"` ile autofill'i devre dışı bırakmak (güvenlik gerekçesi yoksa)

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
11. [ZAYIF] Form analytics event'leri hiç gönderilmiyor — form performansı ölçülemiyor
12. [ZAYIF] `form_abandon` event'i tanımsız — terk edilen formlar izlenmiyor
13. [ZAYIF] Analytics payload'ında kullanıcı şifresi/e-postası gönderiliyor — privacy ihlali
14. [ZAYIF] `autoComplete="off"` gereksiz yere kullanılıyor — autofill devre dışı
15. [ZAYIF] textContentType ile autoComplete mapping'i uyumsuz — autofill düzgün çalışmıyor

## Kontrol Listesi
- [ ] Zod schema tanımlandı mı?
- [ ] React Hook Form kullanıldı mı?
- [ ] Her field'da label var mı?
- [ ] Error mesajı field yanında mı (inline)?
- [ ] Validation timing doğru mu (onBlur/onSubmit)?
- [ ] Submit lifecycle (loading, error, success) tanımlı mı?
- [ ] Keyboard ve a11y uyumu sağlandı mı?
- [ ] textContentType doğru tanımlı mı?
- [ ] autoComplete (Android/web) mapping'i doğru mu?
- [ ] AutoFill / Passkey desteği çalışıyor mu?
- [ ] iOS Simulator'da AutoFill testi yapıldı mı?
- [ ] Doğru keyboard tipi açılıyor mu (email, numeric vb.)?
- [ ] Seçim kontrolleri uygun türde mi (toggle, segmented, picker)?
- [ ] Çok adımlı form'da ilerleme göstergesi var mı?
- [ ] Kaydedilmemiş değişiklik uyarısı var mı?
- [ ] Hata düzeltildiğinde otomatik temizleme var mı?
- [ ] Form analytics event'leri tanımlı mı (start, submit, success, error, abandon)?
- [ ] form_abandon dirty form terk durumunda tetikleniyor mu?
- [ ] Analytics payload'ında kişisel veri yok mu?

## İhlal Durumunda
- Schema eksikliği → Zod schema oluştur
- Ad-hoc validation → Zod'a taşı
- Label eksikliği → hemen ekle
- textContentType eksikliği → hemen tanımla
- Inline hata eksikliği → hemen düzelt

## Keyboard Handling Pattern

Form ekranlarında keyboard yönetimi, kullanıcı deneyiminin kritik bir parçasıdır. Keyboard açıldığında aktif input'un görünür kalması, submit butonuna erişilebilmesi ve formdan çıkışta keyboard'un uygun şekilde kapanması gerekir. Aşağıdaki kurallar tüm form ekranları için geçerlidir.

### Keyboard Avoidance Stratejisi

**Mobile (React Native):**

| Durum | Yöntem | Açıklama |
|-------|--------|----------|
| Basit form (3-5 alan) | `KeyboardAvoidingView` | `behavior="padding"` (iOS), `behavior="height"` (Android) |
| Uzun form / scroll gerektiren | `KeyboardAwareScrollView` (react-native-keyboard-aware-scroll-view) | Aktif input'u otomatik olarak görünür alana kaydırır |
| Bottom sheet içinde form | Sheet kendi keyboard avoidance'ını sağlar | @gorhom/bottom-sheet veya benzeri kütüphanelerin built-in desteği kullanılmalı |

**Web:**
- Tarayıcılar keyboard avoidance'ı otomatik yönetir. Ek bir React bileşeni gerekmez.
- Mobil web'de (viewport) `<meta name="viewport" content="..., interactive-widget=resizes-content">` kullanılarak keyboard açıldığında viewport'un yeniden boyutlandırılması sağlanmalıdır.

### Focus Yönetimi ve Alan Geçişleri

Form alanları arasında doğal bir geçiş akışı olmalıdır. Kullanıcı keyboard'daki "Next/Return" tuşuyla bir sonraki alana geçebilmelidir.

**Kurallar:**
1. [ZORUNLU] `returnKeyType` her alana uygun tanımlanmalı: ara alanlar `"next"`, son alan `"done"` veya `"send"`
2. [ZORUNLU] `onSubmitEditing` ile bir sonraki alana programatik focus yapılmalı (`ref.current?.focus()`)
3. [YAPILMALI] Formun ilk alanına otomatik focus verilmeli (`autoFocus={true}` — yalnızca formun birincil amacı veri girişi ise)
4. [YAPILMALI] Son alandan "done" ile form submit tetiklenmeli (kullanıcı submit butonuna uzanmak zorunda kalmamalı)

**Focus akışı örneği:**
```typescript
const emailRef = useRef<TextInput>(null);
const passwordRef = useRef<TextInput>(null);

<TextInput
  ref={emailRef}
  returnKeyType="next"
  onSubmitEditing={() => passwordRef.current?.focus()}
  textContentType="emailAddress"
  keyboardType="email-address"
/>
<TextInput
  ref={passwordRef}
  returnKeyType="done"
  onSubmitEditing={handleSubmit(onSubmit)}
  textContentType="password"
  secureTextEntry
/>
```

### Keyboard Dismiss Davranışı

| Durum | Davranış | Uygulama |
|-------|----------|----------|
| Form dışına dokunma | Keyboard kapanmalı | `<ScrollView keyboardDismissMode="on-drag">` veya `<TouchableWithoutFeedback onPress={Keyboard.dismiss}>` |
| Submit sonrası | Keyboard kapanmalı | `Keyboard.dismiss()` submit handler içinde çağrılmalı |
| Navigation (geri gitme) | Keyboard kapanmalı | React Navigation varsayılan olarak bunu yönetir; custom geçişlerde `Keyboard.dismiss()` eklenmeli |
| Hata gösterimi | Keyboard açık kalmalı | Kullanıcı hatayı görüp düzeltmeye devam edebilmeli |

### Platform Farkları

| Özellik | iOS | Android | Web |
|---------|-----|---------|-----|
| Keyboard avoidance | `behavior="padding"` (KeyboardAvoidingView) | `behavior="height"` veya `android:windowSoftInputMode="adjustResize"` (AndroidManifest) | Otomatik |
| returnKeyType | "next", "done", "go", "send" | "next", "done", "go", "send" | N/A (tab ile geçiş) |
| Keyboard dismiss | Interactive dismiss destekli (`keyboardDismissMode="interactive"`) | Geri tuşu ile dismiss | Esc ile dismiss |
| textContentType | Zorunlu (AutoFill için) | `autoComplete` prop | `autoComplete` HTML attribute |
| Secure keyboard (password) | Otomatik (secureTextEntry ile) | Otomatik | `type="password"` |

### Kontrol Listesi (Keyboard)
- [ ] KeyboardAvoidingView veya KeyboardAwareScrollView uygulandı mı?
- [ ] iOS ve Android'de behavior prop'u doğru ayarlandı mı?
- [ ] returnKeyType her alan için tanımlı mı?
- [ ] Focus akışı (next → next → done) çalışıyor mu?
- [ ] Son alandan "done" ile submit tetikleniyor mu?
- [ ] Form dışı dokunmada keyboard kapanıyor mu?
- [ ] Submit sonrası keyboard kapanıyor mu?
- [ ] Hata durumunda keyboard açık kalıyor mu?

## Kaynak
- Form mimarisi → docs/architecture/11-forms-inputs-and-validation.md
- Form kararı → docs/adr/ADR-006-forms-and-validation.md
- Error states → docs/design-system/25-error-empty-loading-states.md
- Apple HIG Text Fields → developer.apple.com/design/human-interface-guidelines/text-fields
- Apple HIG Entering Data → developer.apple.com/design/human-interface-guidelines/entering-data
- Apple HIG Keyboards → developer.apple.com/design/human-interface-guidelines/keyboards
