---
id: D-PRI
type: domain
name: Privacy/Compliance Yönetimi
kaynak-dokümanlar: ADR-017, 27, 28
miras-tipi: zorunlu
son-güncelleme: 2026-04-01
---

# D-PRI: Privacy/Compliance Guardrail

## Bu Guardrail Ne Zaman Aktif?
- Gizlilik uyum çalışması (A-PRIVACY)
- Analytics/event tracking — veri toplama (A-ANALYTICS)
- Third-party SDK entegrasyonu — SDK privacy etkisi (A-3RD)
- Yeni feature geliştirme — kullanıcı verisi topluyorsa (A-NEW-FEAT)
- Herhangi bir kodda PII işlenmesi

## Zorunlu Kurallar

### Consent Yönetimi
1. [YASAK] Kullanıcı consent'i alınmadan tracking/analytics başlatılmamalı
2. [YASAK] Consent öncesi Firebase Analytics, Sentry veya herhangi bir tracking aktifleştirme
3. [ZORUNLU] SDK'lar consent durumuna göre initialize edilmeli (lazy init)
4. [ZORUNLU] Cookie consent banner (web) GDPR uyumlu olmalı
5. [ZORUNLU] Cookie consent banner'da Accept All ve Reject All butonları eşit belirginlikte olmalı
6. [YASAK] Cookie wall kullanma — consent vermeden siteyi kullanımı engellememe (GDPR ihlali)

### PII (Kişisel Veri) Yönetimi
7. [ZORUNLU] PII tanımı net: isim, email, telefon, konum, IP, cihaz ID
8. [ZORUNLU] Data minimization: yalnızca gereken veri toplanmalı
9. [ZORUNLU] Analytics event'lerinde PII hash'lenmeli veya anonimleştirilmeli
10. [YASAK] Kullanıcı verisini şifrelenmeden 3. parti servise gönderme

### Veri Hakları
11. [ZORUNLU] Right to erasure: kullanıcı veri silme talebi implementasyonu zorunlu
12. [ZORUNLU] Data retention süresi tanımlanmalı ve enforce edilmeli
13. [YAPILMALI] Kullanıcıya toplanan veri hakkında bilgi verme mekanizması

### Platform Uyumu
14. [ZORUNLU] Privacy manifest (Apple) güncel tutulmalı
15. [ZORUNLU] Data Safety (Google Play) güncel tutulmalı
16. [ZORUNLU] 3. parti SDK eklenmeden önce privacy impact değerlendirmesi yapılmalı

## Kalite Eşikleri
- [MİNİMUM] Consent olmadan sıfır tracking/analytics
- [MİNİMUM] Sıfır şifrelenmemiş PII 3. parti servisine gönderim
- [MİNİMUM] Right to erasure implementasyonu mevcut
- [MİNİMUM] Privacy manifest (Apple) ve Data Safety (Google) güncel
- [ÖNERİLEN] Data retention süresi tanımlı ve enforce ediliyor

## Anti-pattern'ler
1. [ZAYIF] `analytics.init()` app başlangıcında koşulsuz çağrılıyor — consent kontrolü yok
2. [ZAYIF] `Sentry.init()` consent öncesi — tracking consent'siz aktif
3. [ZAYIF] `analytics.track('purchase', { email: user.email })` — PII anonimleştirilmemiş
4. [ZAYIF] `fetch('https://api.thirdparty.com', { body: JSON.stringify(userData) })` — şifrelenmemiş PII gönderimi
5. [ZAYIF] Privacy manifest güncellenmemiş — yeni SDK eklenmiş ama manifest'te yok
6. [ZAYIF] Data retention süresi tanımlanmamış — veri süresiz saklanıyor

## Kontrol Listesi
- [ ] Consent alınmadan tracking/analytics başlatılmıyor mu?
- [ ] SDK'lar consent'e göre lazy initialize ediliyor mu?
- [ ] PII analytics'te hash'lenmiş veya anonimleştirilmiş mi?
- [ ] Kullanıcı verisi 3. parti servislere şifreli gönderiliyor mu?
- [ ] Right to erasure implementasyonu var mı?
- [ ] Data retention süresi tanımlı mı?
- [ ] Privacy manifest (Apple) güncel mi?
- [ ] Data Safety (Google) güncel mi?
- [ ] Cookie consent banner (web) GDPR uyumlu mu?
- [ ] Yeni 3. parti SDK için privacy impact değerlendirmesi yapılmış mı?

## İhlal Durumunda
- Consent'siz tracking → HEMEN devre dışı bırak, consent akışı ekle
- PII anonimleştirilmemiş → hash/maskeleme ekle
- Right to erasure eksik → veri silme mekanizması implementasyonu yap
- Privacy manifest güncel değil → HEMEN güncelle
- Şifrelenmemiş PII gönderimi → şifreleme ekle veya gönderimi kaldır

## Kaynak
- Privacy kararı → docs/adr/ADR-017-privacy-compliance-strategy.md
- Security baseline → docs/quality/27-security-and-secrets-baseline.md
- Observability → docs/quality/28-observability-and-debugging.md
