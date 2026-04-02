---
id: D-I18
type: domain
name: Internationalization (i18n)
kaynak-dokümanlar: ADR-011
miras-tipi: yapısal
son-güncelleme: 2026-04-02
---

# D-I18: Internationalization Guardrail

## Bu Guardrail Ne Zaman Aktif?
- Herhangi bir UI'da user-facing text eklenirken (Universal katmanda zaten aktif)
- i18n namespace/key yapısı değişirken

## Zorunlu Kurallar

### Canonical Stack
1. [ZORUNLU] i18n kütüphanesi: i18next 26.x (ADR-011)
2. [ZORUNLU] Namespace-based organizasyon

### String Yönetimi
3. [YASAK] Inline user-facing string yazma — i18n key kullan
4. [YAPILMALI] Her yeni user-facing text için i18n key oluştur
5. [YAPILMALI] Key isimlendirme: `namespace:section.action` formatı (örn: `auth:login.submitButton`)
6. [YAPILMAMALI] Teknik jargonu i18n key'lerinde kullanma
7. [YAPILMAMALI] Aynı metnin farklı key'lerle tekrarlanması

### Çoğullama & Format
8. [YAPILMALI] Çoğul formlar i18next pluralization ile yönetilmeli
9. [YAPILMALI] Tarih/sayı formatları i18n locale'e göre formatlanmalı
10. [YAPILMAMALI] String concatenation ile cümle oluşturma — interpolation kullan

### RTL & Layout
11. [YAPILMALI] Layout'lar RTL-ready olmalı (logical properties: start/end)
12. [YAPILMAMALI] Hardcoded left/right kullanma — logical direction kullan

### Missing Translation Fallback Zinciri
13. [ZORUNLU] Cevirilerin fallback zinciri asagidaki sirayla uygulanmali:
    1. Istenen dil + bolge (`tr-TR`)
    2. Istenen dilin genel formu (`tr`)
    3. Varsayilan dil (`en`)
    4. Key gosterimi (son care — yalnizca development'ta kabul edilebilir, production'da P0 hata)
14. [ZORUNLU] i18next `fallbackLng` konfigurasyonu dogru ayarlanmali — varsayilan: `en`
15. [YAPILMALI] `missingKeyHandler` ile eksik ceviri Sentry'ye raporlanmali — sessizce atlanmamali
16. [YAPILMALI] CI'da tum dil dosyalari key karsilastirmasi yapilmali — bir dilde olan key diger dillerde yoksa uyari
17. [YASAK] Production'da raw key gosterimi (ornek: `auth:login.submitButton` ekranda gorunur) — P0 hata, hemen duzelt

### Pluralization ve Gender
18. [YAPILMALI] Pluralization i18next plural config ile yonetilmeli — her dil icin dogru kural:
    - Turkce: Cogul ayrimi yok, tekil form yeterli (ornek: `{{count}} mesaj`)
    - Ingilizce: singular/plural ayrimi zorunlu (ornek: `{{count}} message` / `{{count}} messages`)
19. [YAPILMALI] i18next plural key formatina uyulmali:
    - Turkce: `key` (tek form yeterli)
    - Ingilizce: `key_one`, `key_other`
20. [YAPILMALI] Sayi formatlama: `Intl.NumberFormat` kullanilmali — locale'e uygun ayrac ve sembol
    - Turkce: `1.234,56` (nokta binlik, virgul ondalik)
    - Ingilizce: `1,234.56` (virgul binlik, nokta ondalik)
21. [YAPILMALI] Tarih formatlama: `date-fns/locale` veya `Intl.DateTimeFormat` kullanilmali
    - Turkce: `2 Nisan 2026` veya `02.04.2026`
    - Ingilizce: `April 2, 2026` veya `04/02/2026`
22. [YAPILMAMALI] Sayi ve tarih formatlama icin manuel string manipulasyonu yapmak — Intl API veya date-fns kullan
23. [YAPILMAMALI] Hardcoded tarih/sayi formati kullanmak — locale'e bagli format kullan

## Anti-pattern'ler
1. [ZAYIF] `<Text>Hoş geldiniz</Text>` — inline user-facing string, i18n key kullan
2. [ZAYIF] `"Merhaba " + userName` — string concatenation, interpolation kullan
3. [ZAYIF] `new Date().toLocaleDateString()` — locale parametresiz tarih formatı
4. [ZAYIF] `marginLeft: 16` — hardcoded left/right, logical property kullan (start/end)
5. [ZAYIF] Aynı metnin farklı key'lerle tekrar tanımlanması
6. [ZAYIF] Production'da `auth:login.submitButton` gibi raw key görünüyor — fallback zinciri bozuk
7. [ZAYIF] `missingKeyHandler` tanımsız — eksik çeviriler sessizce atlanıyor
8. [ZAYIF] Türkçe'de `{{count}} mesajlar` şeklinde gereksiz çoğul kullanımı — Türkçe'de tekil form yeterli
9. [ZAYIF] `amount.toFixed(2) + " TL"` — hardcoded para birimi formatı, `Intl.NumberFormat` kullan
10. [ZAYIF] `date.getDate() + "/" + date.getMonth()` — manuel tarih formatı, `Intl.DateTimeFormat` veya `date-fns` kullan
11. [ZAYIF] CI'da dil dosyaları key karşılaştırması yok — eksik çeviriler fark edilmiyor

## Kontrol Listesi
- [ ] Inline user-facing string yok mu?
- [ ] i18n key namespace doğru mu?
- [ ] Çoğul formlar pluralization ile mi?
- [ ] Tarih/sayı locale-aware formatlanıyor mu?
- [ ] fallbackLng doğru konfigüre edilmiş mi?
- [ ] missingKeyHandler tanımlı mı (Sentry'ye raporlama)?
- [ ] CI'da dil dosyaları key karşılaştırması yapılıyor mu?
- [ ] Production'da raw key gösterimi engelleniyor mu?
- [ ] Türkçe pluralization doğru mu (tekil form yeterli)?
- [ ] İngilizce pluralization doğru mu (singular/plural ayrımı)?
- [ ] Sayı formatı Intl.NumberFormat ile mi?
- [ ] Tarih formatı Intl.DateTimeFormat veya date-fns/locale ile mi?

## Kaynak
- i18n kararı → docs/adr/ADR-011-internationalization-baseline.md
