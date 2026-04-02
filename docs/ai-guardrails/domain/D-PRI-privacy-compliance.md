---
id: D-PRI
type: domain
name: Privacy/Compliance Yönetimi
kaynak-dokümanlar: ADR-017, 27, 28
miras-tipi: zorunlu
son-güncelleme: 2026-04-02
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

---

## ATT (App Tracking Transparency) Flow

iOS 14.5+ sürümlerde IDFA erişimi için zorunlu izin akışı:

### Akış
```
Uygulama içi pre-prompt ekranı göster (neden izin istediğini açıkla)
  → Kullanıcı "Devam" → requestTrackingPermissionsAsync() ile OS dialog'u göster
  → İzin verildi → IDFA erişimi açık, personalized ads aktif
  → Reddedildi → Contextual ads'e geç, IDFA erişimi yok
  → Tekrar sorulamaz → Settings yönlendirme rehberi göster
```

### Kurallar
1. [ZORUNLU] iOS 14.5+ hedefleniyorsa `expo-tracking-transparency` kullan
2. [ZORUNLU] OS dialog öncesi pre-prompt ekranı göster — izin oranını artırır
3. [ZORUNLU] Red durumunda graceful fallback: contextual (kişiselleştirilmemiş) reklamlar
4. [ZORUNLU] `NSUserTrackingUsageDescription` (Info.plist) Türkçe ve anlaşılır olmalı
5. [YAPILMALI] ATT izni alınmadan tracking SDK'larını başlatma (Facebook, Google Ads vb.)
6. [YAPILMAMALI] Red sonrası tekrar OS dialog'u açmaya çalışma — Apple buna izin vermez
7. [YAPILMAMALI] ATT iznini fonksiyonel özelliklerle şartlandırma — "izin vermezsen X özellik çalışmaz" yasak

### Android Notu
- Android'de ATT mekanizması yoktur
- Ancak GDPR/KVKK consent yükümlülüğü Android'de de geçerlidir
- Tracking consent: Her iki platformda uygulama içi consent mekanizması zorunlu

---

## Veri Minimizasyonu Audit

Üç aylık (quarterly) periyotlarla toplanan verilerin gerekliliğini değerlendirme süreci:

### 5 Kontrol Sorusu (Her Veri Noktası İçin)

| # | Soru | Beklenen Yanıt |
|---|------|----------------|
| 1 | Bu veri neden toplanıyor? | Net bir iş gerekçesi olmalı |
| 2 | Minimum ne kadar veri yeterli? | Tam veri yerine özet/anonim yeterli mi? |
| 3 | Saklama süresi ne kadar? | Tanımlı retention period olmalı |
| 4 | Kimler erişebilir? | Erişim rolü tanımlı olmalı |
| 5 | Anonimleştirilebilir mi? | Mümkünse hash/maskeleme uygulanmalı |

### Audit Çıktıları
- **Veri envanteri:** Toplanan tüm veri noktalarının listesi, gerekçesi ve saklama süresi
- **Aksiyon listesi:** Gereksiz veri toplama durdurulacak, saklama süresi aşılan veriler silinecek
- **KVKK VERBİS uyumu:** Veri envanteri VERBİS (Veri Sorumluları Sicil Bilgi Sistemi) kaydıyla eşleşmeli

### Kurallar
1. [ZORUNLU] Her çeyrekte veri minimizasyonu audit'i yapılmalı
2. [ZORUNLU] Yeni veri toplama noktası eklenirken 5 kontrol sorusu cevaplanmalı
3. [YAPILMALI] Audit sonuçları dokümante edilmeli (tarih, kapsam, aksiyonlar)
4. [YAPILMAMALI] "İleride lazım olur" gerekçesiyle gereksiz veri toplamak — GDPR purpose limitation ilkesi

## Kaynak
- Privacy kararı → docs/adr/ADR-017-privacy-and-data-protection-framework.md
- Security baseline → docs/quality/27-security-and-secrets-baseline.md
- Observability → docs/quality/28-observability-and-debugging.md
