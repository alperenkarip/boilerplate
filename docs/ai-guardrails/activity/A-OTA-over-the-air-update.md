---
id: A-OTA
type: activity
name: Over-The-Air Güncelleme
tetiklenen-domain-guardrails: [D-SEC, D-OBS, D-PLT]
araç-zorunlulukları:
  spec: önerilir
  stitch: —
  codex: önerilir
son-güncelleme: 2026-04-01
---

# A-OTA: Over-The-Air Güncelleme Guardrail

## Ön Koşullar
1. ADR-015 oku — OTA güncelleme stratejisi
2. 29-release-and-versioning-rules.md oku — release ve versiyonlama kuralları
3. D-OBS guardrail'ini oku — observability kuralları
4. D-SEC guardrail'ini oku — güvenlik kuralları

## Aktif Domain Guardrail'ler
- **D-SEC** → Update kanalı güvenliği, code signing
- **D-OBS** → Crash rate monitoring, OTA sonrası observability
- **D-PLT** → Platform-specific update davranışları, iOS vs Android farkları

## Aktiviteye Özel Kurallar
1. EAS Update kullanılmalı (ADR-015)
2. Update channel doğru ayarlanmalı — production, staging, preview kanalları ayrı tutulmalı
3. Staged rollout stratejisi tanımlanmalı — önce küçük kullanıcı grubuna, sonra genele
4. Rollback planı hazır olmalı — sorunlu update geri alınabilmeli
5. OTA sonrası crash rate monitör edilmeli — Sentry ile anomali takibi
6. Native code değişikliği varsa OTA yeterli değil — store build zorunlu (JS vs native ayrımı)
7. Update kullanıcı bilgilendirmesi tanımlanmalı — sessiz güncelleme veya kullanıcı onaylı

## DoD Ek Maddeleri
- [ ] ADR-015 uyumu sağlanmış
- [ ] Update channel konfigürasyonu doğru (production, staging, preview)
- [ ] Rollback planı tanımlı
- [ ] Staged rollout stratejisi belirlenmiş
- [ ] Crash monitoring aktif (Sentry)
- [ ] JS vs native değişiklik ayrımı yapılmış
- [ ] Kullanıcı bilgilendirme stratejisi tanımlı
- [ ] D-SEC kontrol listesi geçmiş
- [ ] D-OBS kontrol listesi geçmiş
