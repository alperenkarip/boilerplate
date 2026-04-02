---
id: A-SDK-UPGRADE
type: activity
name: SDK / Framework Major Upgrade
tetiklenen-domain-guardrails: [D-PLT, D-PRF, D-TST, D-SEC, D-3RD, D-OFL]
araç-zorunlulukları:
  spec: zorunlu
  stitch: —
  codex: zorunlu
son-güncelleme: 2026-04-02
---

# A-SDK-UPGRADE: SDK/Framework Major Upgrade Guardrail

## Ne Zaman Aktif?
- Expo SDK major upgrade (ör: SDK 55 → SDK 56)
- React Native major/minor upgrade
- React major upgrade
- Vite major upgrade
- Diğer çekirdek framework major upgrade'leri (38-matrix'teki çekirdek omurgadaki herhangi bir paket)

## Ön Koşullar
1. [ZORUNLU] 48-expo-sdk-upgrade-strategy.md okunmuş olmalı
2. [ZORUNLU] 38-version-compatibility-matrix.md mevcut hali bilinmeli
3. [ZORUNLU] Upgrade sebebi ve hedef versiyon belgelenmiş olmalı

## Aktiviteye Özel Kurallar

### Planlama Aşaması
1. [ZORUNLU] Hedef SDK/framework changelog'u satır satır okunmalı
2. [ZORUNLU] Breaking changes listesi çıkarılmalı ve etki analizi yapılmalı
3. [ZORUNLU] `npx expo-doctor` (Expo upgrade'leri için) çalıştırılmalı ve rapor temiz olmalı
4. [ZORUNLU] Tüm third-party native paketlerin hedef versiyon ile uyumu doğrulanmalı
5. [YAPILMALI] Uyumsuz paketler için alternatif araştırması veya fork planı yapılmalı
6. [YAPILMAMALI] expo-doctor uyarısı varken upgrade merge etme

### Uygulama Aşaması
7. [ZORUNLU] İzole branch'te çalış (`chore/sdk-XX-upgrade` veya benzeri)
8. [ZORUNLU] Her adımda increment test yap — büyük bang upgrade yasak
9. [ZORUNLU] EAS Build testi başarılı olmalı (iOS + Android)
10. [ZORUNLU] Development build fiziksel cihazda test edilmeli
11. [YAPILMALI] Upgrade sırasında karşılaşılan sorunları ve çözümleri belgele
12. [YAPILMAMALI] Upgrade PR'ını feature PR ile karıştırma — izole PR

### Doğrulama Aşaması
13. [ZORUNLU] runtimeVersion değişikliği değerlendirilmeli (OTA uyumluluk etkisi)
14. [ZORUNLU] Tüm mevcut testler geçmeli (unit + integration + E2E)
15. [ZORUNLU] Performance baseline ölçümü yapılmalı (cold start, render, memory)
16. [ZORUNLU] 38-version-compatibility-matrix.md güncellenmeli
17. [YAPILMALI] 36-canonical-stack-decision.md güncellenmeli (gerekirse)
18. [YAPILMAMALI] Test suite kırmızıyken merge etme

### Belge Güncellemeleri
19. [ZORUNLU] Compatibility matrix güncellemesi olmadan çekirdek upgrade merge edilmemeli
20. [YAPILMALI] Upgrade deneyimi ve lessons learned kaydedilmeli
21. [YAPILMALI] Yeni SDK ile gelen özellikler watchlist'e eklenmeli (gerekirse)

## SDK Upgrade Regression Test Matrisi
22. Her major SDK upgrade sonrasında aşağıdaki regression test matrisi uygulanmalı:

| Alan | Test Tipi | Öncelik |
|------|----------|---------|
| App başlangıcı (cold start) | Performance | P0 |
| Navigation (tab, stack, modal) | E2E | P0 |
| Auth flow (login, logout, token refresh) | E2E | P0 |
| Form submit (validation, submit lifecycle) | Integration | P1 |
| Push notification (receive, open, deep link) | Manual | P1 |
| Deep linking (cold/warm/hot start) | Integration | P1 |
| Offline mode (cache, sync, indicator) | Manual | P1 |
| Biometric auth (Face ID, fingerprint) | Manual | P1 |
| IAP (sandbox purchase, restore) | Sandbox | P1 |
| Animasyonlar (transition, gesture) | Visual | P2 |

23. **P0 testler:** Upgrade PR merge edilmeden önce tamamı geçmeli — blokleyici
24. **P1 testler:** Merge sonrası 24 saat içinde tamamlanmalı
25. **P2 testler:** Release öncesi tamamlanmalı

## DoD Ek Maddeleri
- [ ] expo-doctor temiz geçiyor
- [ ] Tüm third-party paket uyumluluğu doğrulandı
- [ ] EAS Build başarılı (iOS + Android)
- [ ] Development build cihazda test edildi
- [ ] runtimeVersion değişikliği değerlendirildi
- [ ] Testler geçiyor (unit + integration + E2E)
- [ ] Performance baseline alındı
- [ ] SDK upgrade regression test matrisi uygulanmış (P0 tamamı geçmiş)
- [ ] 38-version-compatibility-matrix.md güncellendi
- [ ] OTA uyumluluk testi yapıldı (gerekiyorsa)
- [ ] Team review tamamlandı
