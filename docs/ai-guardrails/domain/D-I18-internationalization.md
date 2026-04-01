---
id: D-I18
type: domain
name: Internationalization (i18n)
kaynak-dokümanlar: ADR-011
miras-tipi: yapısal
son-güncelleme: 2026-04-01
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

## Anti-pattern'ler
1. [ZAYIF] `<Text>Hoş geldiniz</Text>` — inline user-facing string, i18n key kullan
2. [ZAYIF] `"Merhaba " + userName` — string concatenation, interpolation kullan
3. [ZAYIF] `new Date().toLocaleDateString()` — locale parametresiz tarih formatı
4. [ZAYIF] `marginLeft: 16` — hardcoded left/right, logical property kullan (start/end)
5. [ZAYIF] Aynı metnin farklı key'lerle tekrar tanımlanması

## Kontrol Listesi
- [ ] Inline user-facing string yok mu?
- [ ] i18n key namespace doğru mu?
- [ ] Çoğul formlar pluralization ile mi?
- [ ] Tarih/sayı locale-aware formatlanıyor mu?

## Kaynak
- i18n kararı → docs/adr/ADR-011-internationalization-baseline.md
