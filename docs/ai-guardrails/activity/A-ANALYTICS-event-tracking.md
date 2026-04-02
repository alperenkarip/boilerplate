---
id: A-ANALYTICS
type: activity
name: Analytics / Event Tracking
tetiklenen-domain-guardrails: [D-OBS, D-SEC]
araç-zorunlulukları:
  spec: —
  stitch: —
  codex: önerilen
son-güncelleme: 2026-04-02
---

# A-ANALYTICS: Analytics/Event Tracking Guardrail

## Aktiviteye Özel Kurallar
1. Vendor abstraction layer kullan — doğrudan SDK çağırma (ADR-009)
2. Event naming convention: snake_case, tutarlı prefix
3. PII göndermeme (email, telefon, TC kimlik — D-SEC)
4. Anlamlı event'ler seç — her tıklama/scroll track etme
5. Event property'leri minimal tut — gereksiz veri gönderme
6. A/B testing entegrasyonu varsa flag yönetimi tanımla

## Event Naming Convention
7. **Format:** snake_case, lowercase, maksimum 40 karakter
8. **Namespace:** İlk kelime domain'i belirtir (ör: `profile_photo_upload`, `auth_login_success`, `cart_item_add`)
9. **Ortak payload:** Her event'te `{ screen_name, timestamp, platform }` bulunmalı
10. **Yasaklar:** PII payload'da yer almaz, camelCase kullanılmaz
11. **Merkezi katalog:** Tüm event'ler merkezi event kataloğunda kayıtlı olmalı — dağınık tanımlama yasak
12. **Çakışma kontrolü:** Yeni event eklenmeden önce mevcut event'lerle isim ve anlam çakışması kontrol edilmeli

## DoD Ek Maddeleri
- [ ] Vendor abstraction kullanılıyor
- [ ] Event naming convention'a uygun (snake_case, lowercase, max 40 karakter)
- [ ] Event namespace doğru (domain prefix)
- [ ] Ortak payload mevcut (screen_name, timestamp, platform)
- [ ] PII filtrelenmiş
- [ ] Event merkezi kataloga eklenmiş
- [ ] Mevcut event'lerle çakışma kontrolü yapılmış
- [ ] Event'ler anlamlı ve minimal
