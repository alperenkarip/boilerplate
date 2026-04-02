---
id: D-3RD
type: domain
name: Third-Party SDK Entegrasyonu
kaynak-dokümanlar: 37
miras-tipi: yapısal
son-güncelleme: 2026-04-02
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

### Third-Party SDK Boyut Bütçesi
14. [ZORUNLU] Tek SDK maksimum 500KB (gzip) bundle artışı yapabilir — aşımda alternatif araştır veya exception aç
15. [YAPILMALI] Ekleme öncesi bundlephobia.com üzerinden boyut kontrolü yap
16. [ZORUNLU] Tree-shaking zorunlu — named import ile yalnızca kullanılan modüller dahil edilmeli
17. [YAPILMAMALI] Barrel export (`import * from 'sdk'`) ile tüm SDK'yı çekmek — named import kullan
18. [YAPILMALI] SDK boyutu 500KB'yi aşıyorsa: (a) alternatif hafif SDK araştır, (b) lazy/dynamic import değerlendir, (c) yoksa 44-exception-and-exemption-policy.md ile exception aç

### Vendor Lock-in Risk Değerlendirmesi
19. [ZORUNLU] Her third-party SDK bir abstraction layer (wrapper/adapter) arkasına alınmalı
20. [YAPILMALI] Entegrasyon öncesi lock-in risk değerlendirmesi yap:
    - Dosya bağımlılığı: SDK'ya doğrudan bağımlı >10 dosya = Yüksek Risk
    - Geçiş süresi: Alternatife geçiş >1 hafta = Yüksek Risk
    - Risk Seviyeleri: Düşük (<5 dosya, <2 gün) / Orta (5-10 dosya, 2-5 gün) / Yüksek (>10 dosya, >1 hafta)
21. [ZORUNLU] Zorunlu abstraction gerektiren SDK kategorileri — doğrudan tüketim yasak:
    - Analytics SDK'ları → `AnalyticsProvider` wrapper
    - Push notification SDK'ları → `NotificationService` wrapper
    - Crash reporting SDK'ları → `CrashReporter` wrapper
    - Payment SDK'ları → `PaymentGateway` wrapper
22. [YAPILMALI] Yüksek risk SDK'larında geçiş planı (migration path) dokümente edilmeli

## Anti-pattern'ler
1. [ZAYIF] `import { analytics } from 'firebase/analytics'` doğrudan tüketim — wrapper/abstraction yok
2. [ZAYIF] Canonical stack alternatifi ekleme girişimi (Redux, SWR, Formik vb.)
3. [ZAYIF] Bundle size kontrol edilmeden büyük SDK ekleme
4. [ZAYIF] Güvenlik geçmişi araştırılmadan bilinmeyen SDK kullanma
5. [ZAYIF] Third-party SDK type'larını doğrudan export etme — wrapper üzerinden erişim
6. [ZAYIF] `import * as Sentry from '@sentry/react-native'` — barrel import, tree-shaking devre dışı
7. [ZAYIF] 500KB üzeri SDK exception'sız ekleme — boyut bütçesi aşımı
8. [ZAYIF] Analytics/payment SDK'sını wrapper olmadan >10 dosyada doğrudan kullanma — lock-in riski yüksek

## Kontrol Listesi
- [ ] Dependency policy (37) kontrol edildi mi?
- [ ] Bundle size etkisi kabul edilebilir mi (max 500KB gzip)?
- [ ] bundlephobia.com üzerinden boyut kontrolü yapıldı mı?
- [ ] Tree-shaking aktif mi, named import kullanılıyor mu?
- [ ] Wrapper/abstraction oluşturuldu mu?
- [ ] Vendor lock-in risk değerlendirmesi yapıldı mı?
- [ ] Zorunlu abstraction kategorisindeyse wrapper mevcut mu?
- [ ] Lisans uyumlu mu?
- [ ] Güvenlik taraması yapıldı mı?

## Kaynak
- Dependency policy → docs/governance/37-dependency-policy.md
- Compatibility matrix → docs/governance/38-version-compatibility-matrix.md
