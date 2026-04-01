---
id: A-MEDIA
type: activity
name: File Upload / Media / Storage
tetiklenen-domain-guardrails: [D-SEC, D-PRF]
araç-zorunlulukları:
  spec: ihtiyaca göre
  stitch: —
  codex: zorunlu
son-güncelleme: 2026-04-01
---

# A-MEDIA: File/Media İşlemi Guardrail

## Aktiviteye Özel Kurallar
1. Dosya boyutu limiti tanımla (client + server)
2. Kabul edilen format listesi belirle (whitelist)
3. Yükleme sırasında progress indicator göster
4. Büyük dosyaları chunk/multipart upload ile gönder
5. Yüklenen dosyaları sanitize et — executable risk kontrolü
6. Image'ları optimize et (boyut, format, lazy load — D-PRF)
7. Storage URL'lerini güvenli tut — public erişim kontrolü (D-SEC)

## DoD Ek Maddeleri
- [ ] Boyut limiti tanımlı
- [ ] Format whitelist var
- [ ] Progress indicator var
- [ ] Güvenlik kontrolü yapılmış
