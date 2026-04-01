---
id: A-PRIVACY
type: activity
name: Gizlilik Uyum Çalışması
tetiklenen-domain-guardrails: [D-PRI, D-SEC, D-OBS]
araç-zorunlulukları:
  spec: zorunlu
  stitch: —
  codex: zorunlu
son-güncelleme: 2026-04-01
---

# A-PRIVACY: Gizlilik Uyum Çalışması Guardrail

## Ön Koşullar
1. ADR-017 oku — privacy/compliance stratejisi
2. D-PRI guardrail'ini oku — privacy kuralları
3. 27-security-and-secrets-baseline.md oku — güvenlik baseline'ı
4. D-SEC guardrail'ini oku — güvenlik kuralları
5. D-OBS guardrail'ini oku — observability ve PII sızıntı kontrolü

## Aktif Domain Guardrail'ler
- **D-PRI** → Consent yönetimi, PII koruması, data retention, right to erasure
- **D-SEC** → Veri şifreleme, hassas bilgi güvenliği
- **D-OBS** → Analytics'te PII sızıntı kontrolü, Sentry payload güvenliği

## Aktiviteye Özel Kurallar
1. Consent management akışı tanımlanmalı — opt-in/opt-out mekanizması net olmalı
2. SDK'lar consent'e göre lazy initialize edilmeli — consent öncesi hiçbir tracking aktif olmamalı
3. Privacy manifest (Apple) ve Data Safety (Google) güncellenmeli — her SDK değişikliğinde
4. PII işleme kuralları net olmalı — toplama, saklama, işleme, silme adımları tanımlı
5. Data retention süresi tanımlanmalı — süre dolduğunda otomatik silme mekanizması
6. Right to erasure implementasyonu zorunlu — kullanıcı talebiyle tüm verinin silinebilmesi
7. Cookie consent banner (web) GDPR uyumlu olmalı — gerekli kategoriler, tercih kaydetme
8. 3. parti SDK privacy impact değerlendirmesi yapılmalı — her yeni SDK öncesinde

## DoD Ek Maddeleri
- [ ] ADR-017 uyumu sağlanmış
- [ ] Consent akışı tanımlı ve çalışıyor
- [ ] SDK'lar consent'e göre lazy initialize ediliyor
- [ ] Privacy manifest (Apple) güncel
- [ ] Data Safety (Google) güncel
- [ ] PII maskeleme/anonimleştirme var
- [ ] Right to erasure implementasyonu var
- [ ] Data retention süresi tanımlı ve enforce ediliyor
- [ ] Cookie consent banner (web) GDPR uyumlu
- [ ] 3. parti SDK privacy impact değerlendirmesi yapılmış
- [ ] D-SEC kontrol listesi geçmiş
- [ ] D-OBS kontrol listesi geçmiş
