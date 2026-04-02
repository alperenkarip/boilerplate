# Operasyonel Runbook ve Incident Response

## Doküman Kimliği

- **Doküman adı:** Runbook ve Incident Response
- **Dosya adı:** `runbook-and-incident-response.md`
- **Doküman türü:** Operational procedure / incident response guide
- **Durum:** Accepted
- **Tarih:** 2026-04-02
- **Kapsam:** Production ortamında sorun çıktığında takip edilecek operasyonel prosedürler, incident severity tanımları, escalation path'ler ve post-incident review süreci
- **İlgili belgeler:**
  - `27-security-and-secrets-baseline.md`
  - `28-observability-and-debugging.md`
  - `29-release-and-versioning-rules.md`
  - `ADR-009-observability-stack.md`
  - `ADR-015-ota-update-strategy.md`

---

# 1. Amaç

Bu dokümanın amacı, production ortamında yaşanan sorunlarda ekibin hızlı, tutarlı ve belgelenmiş şekilde müdahale etmesini sağlamaktır.

Bu doküman şu sorulara cevap verir:

1. Bir production sorunu tespit edildiğinde ilk adım nedir?
2. Sorunun ciddiyeti nasıl belirlenir?
3. Kim ne zaman bilgilendirilir?
4. Sorun çözüldükten sonra ne yapılır?

---

# 2. Incident Severity Tanımları

| Severity | Tanım | Etki | Response Süresi | Örnek |
|----------|-------|------|-----------------|-------|
| SEV1 — Critical | Uygulama tamamen erişilemez veya veri kaybı/sızıntısı riski | Tüm kullanıcılar etkileniyor | 15 dakika içinde müdahale | Uygulama crash loop, auth sistemi çöktü, veri sızıntısı |
| SEV2 — Major | Önemli bir özellik çalışmıyor veya ciddi performans degradasyonu | Kullanıcıların önemli bir kısmı etkileniyor | 1 saat içinde müdahale | Ödeme akışı kırık, API timeout'ları, ana ekran yüklenmiyor |
| SEV3 — Minor | Tek bir özellik veya edge case etkileniyor | Sınırlı kullanıcı grubu | 4 saat içinde değerlendirme | Belirli bir ekranda görsel bozukluk, nadir tetiklenen hata |
| SEV4 — Low | Kozmetik sorun veya iyileştirme fırsatı | Minimal etki | Sonraki sprint'te ele alınır | Yanlış hizalama, typo, minor UX uyumsuzluğu |

---

# 3. Escalation Path

## 3.1. SEV1 — Critical

1. Sorunu tespit eden kişi hemen Slack #incidents kanalına bildirir
2. On-call mühendis 15 dakika içinde acknowledge eder
3. Incident commander atanır (genellikle on-call mühendis veya tech lead)
4. War room açılır (Slack huddle veya Google Meet)
5. 30 dakika içinde çözüm veya workaround uygulanır
6. Stakeholder'lar (PM, CTO) bilgilendirilir

## 3.2. SEV2 — Major

1. Sorunu tespit eden kişi Slack #incidents kanalına bildirir
2. İlgili ekip üyesi 1 saat içinde değerlendirmeye başlar
3. Fix veya workaround aynı iş günü içinde uygulanır
4. Etkilenen kullanıcılara bilgilendirme yapılır (gerekirse)

## 3.3. SEV3-4

1. Standart issue tracking (GitHub Issues / Linear) üzerinden kaydedilir
2. Sonraki sprint planning'de önceliklendirilir

---

# 4. Operasyonel Prosedürler

## 4.1. Deploy Rollback

**Ne zaman:** Yeni deploy sonrası error spike, crash rate artışı veya kritik feature kırılması tespit edildiğinde.

**Adımlar:**

1. Sentry ve monitoring dashboard'larında sorunu doğrula
2. **OTA rollback** (JavaScript değişikliği ise): `eas update:rollback` ile önceki stable update'e dön (< 5 dakika)
3. **Native rollback** (native değişiklik içeriyorsa): App Store / Play Store'dan önceki versiyona phased rollback
4. Rollback sonrası error rate'in düştüğünü doğrula
5. Root cause analizi başlat

## 4.2. API / Backend Hatası

1. Backend ekibine bildir (Slack #backend-alerts)
2. Client tarafında graceful degradation kontrol et (offline mode, cached data gösterimi)
3. Kullanıcılara uygun hata mesajı gösterildiğini doğrula
4. Backend fix uygulandıktan sonra client cache'lerini invalidate et

## 4.3. Auth Sistemi Hatası

1. **Öncelik:** Kullanıcıları uygulamadan çıkarmamak; mevcut session'ları korumak
2. Token refresh mekanizmasını kontrol et
3. Gerekirse maintenance mode aktifleştir
4. Auth fix sonrası forced re-auth gerekip gerekmediğini değerlendir

## 4.4. Push Notification Sorunu

1. FCM/APNs dashboard'larından delivery rate kontrol et
2. Notification token geçerliliğini kontrol et
3. Expo notification service durumunu kontrol et (status.expo.dev)

---

# 5. Post-Incident Review (PIR)

Her SEV1 ve SEV2 incident sonrası 48 saat içinde PIR yapılır.

## 5.1. PIR Template

```markdown
## Incident Summary
- **Tarih:** YYYY-MM-DD HH:MM — HH:MM (UTC+3)
- **Severity:** SEV1 / SEV2
- **Etki:** Kaç kullanıcı etkilendi, ne kadar süre
- **Root cause:** Kök neden

## Timeline
- HH:MM — Sorun tespit edildi
- HH:MM — Incident commander atandı
- HH:MM — Workaround uygulandı
- HH:MM — Fix deploy edildi
- HH:MM — Sorun tamamen çözüldü

## Root Cause Analysis
- Teknik kök neden
- Neden tespit edilemedi (monitoring gap)
- Neden önlenemedi (process gap)

## Action Items
- [ ] Monitoring iyileştirmesi — Sorumlu: @kişi — Deadline: YYYY-MM-DD
- [ ] Test coverage artırımı — Sorumlu: @kişi — Deadline: YYYY-MM-DD
- [ ] Runbook güncelleme — Sorumlu: @kişi — Deadline: YYYY-MM-DD
```

## 5.2. Blameless Kültür

- PIR suçlu aramak için değil, sistemi iyileştirmek için yapılır
- "Kim hata yaptı?" yerine "Sistem neden bu hatanın olmasına izin verdi?" sorusu sorulur
- PIR çıktıları ekip ile paylaşılır ve action item'lar takip edilir

---

# 6. Monitoring Alert Eşleştirmesi

| Alert | Kaynak | Prosedür |
|-------|--------|----------|
| Crash-free rate < %99 | Sentry | §4.1 Deploy Rollback değerlendir |
| Error spike (3x baseline) | Sentry | SEV2 olarak değerlendir |
| API p95 > 2s | Backend monitoring | §4.2 API Hatası prosedürü |
| OTA update failure rate > %5 | EAS Update dashboard | ADR-015 rollback prosedürü |
| Push delivery rate < %90 | FCM/APNs dashboard | §4.4 Push Notification prosedürü |
| Memory warning spike | Sentry performance | Performans analizi başlat |

---

# 7. İletişim Kanalları

| Kanal | Kullanım |
|-------|----------|
| Slack #incidents | SEV1-2 canlı müdahale |
| Slack #alerts | Otomatik monitoring alert'leri |
| GitHub Issues | SEV3-4 izleme ve takip |
| E-posta | Stakeholder bilgilendirme (SEV1) |

---

# 8. Periyodik Bakım

- **Haftalık:** Monitoring alert'lerinin review edilmesi, false positive temizliği
- **Aylık:** Runbook'un güncelliğinin kontrol edilmesi
- **Üç aylık:** Incident response drill (simülasyon tatbikatı)
- **Her PIR sonrası:** İlgili runbook bölümlerinin güncellenmesi
