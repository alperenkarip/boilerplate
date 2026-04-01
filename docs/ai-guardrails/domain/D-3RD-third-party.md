---
id: D-3RD
type: domain
name: Third-Party SDK Entegrasyonu
kaynak-dokümanlar: 37
miras-tipi: yapısal
son-güncelleme: 2026-04-01
---

# D-3RD: Third-Party Entegrasyon Guardrail

## Bu Guardrail Ne Zaman Aktif?
- Third-party SDK entegrasyonu (A-3RD)
- Dependency ekleme (A-DEP)
- Yeni API servisi entegrasyonu

## Zorunlu Kurallar

### Dependency Policy
1. [ZORUNLU] Yeni dependency eklemeden önce 37-dependency-policy.md kontrol et
2. [ZORUNLU] Canonical stack'teki kütüphanelerin alternatiflerini önerme
3. [YAPILMALI] Bundle size etkisini değerlendir
4. [YAPILMALI] Lisans uyumluluğunu kontrol et (OSI-approved tercih)

### Wrapper Pattern
5. [YAPILMALI] Third-party SDK'yı doğrudan tüketme — wrapper/abstraction katmanı oluştur
6. [YAPILMALI] Wrapper üzerinden erişim sağla — değişiklik tek noktadan yönetilsin
7. [YAPILMAMALI] Third-party SDK türlerini/interface'lerini doğrudan export etme

### Güvenlik
8. [YAPILMALI] SDK'nın güvenlik geçmişini kontrol et
9. [YAPILMALI] SDK'nın veri toplama/gönderme davranışını incele
10. [YAPILMAMALI] Bilinmeyen/düşük güvenilirlikli SDK kullanma

### Versiyon & Uyumluluk
11. [YAPILMALI] 38-version-compatibility-matrix.md ile uyumluluğu doğrula
12. [YAPILMALI] Major version upgrade'lerde migration planı yaz
13. [YAPILMAMALI] Güvenlik açığı olan sürümü kullanma

## Anti-pattern'ler
1. [ZAYIF] `import { analytics } from 'firebase/analytics'` doğrudan tüketim — wrapper/abstraction yok
2. [ZAYIF] Canonical stack alternatifi ekleme girişimi (Redux, SWR, Formik vb.)
3. [ZAYIF] Bundle size kontrol edilmeden büyük SDK ekleme
4. [ZAYIF] Güvenlik geçmişi araştırılmadan bilinmeyen SDK kullanma
5. [ZAYIF] Third-party SDK type'larını doğrudan export etme — wrapper üzerinden erişim

## Kontrol Listesi
- [ ] Dependency policy (37) kontrol edildi mi?
- [ ] Bundle size etkisi kabul edilebilir mi?
- [ ] Wrapper/abstraction oluşturuldu mu?
- [ ] Lisans uyumlu mu?
- [ ] Güvenlik taraması yapıldı mı?

## Kaynak
- Dependency policy → docs/governance/37-dependency-policy.md
- Compatibility matrix → docs/governance/38-version-compatibility-matrix.md
