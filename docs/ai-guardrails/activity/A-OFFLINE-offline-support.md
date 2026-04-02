---
id: A-OFFLINE
type: activity
name: Offline Support / Cache Persistence
tetiklenen-domain-guardrails: [D-DAT, D-PLT, D-OFL]
araç-zorunlulukları:
  spec: zorunlu
  stitch: —
  codex: zorunlu
son-güncelleme: 2026-04-02
---

# A-OFFLINE: Offline Support Guardrail

## Aktiviteye Özel Kurallar
1. Offline indicator göster — kullanıcı offline olduğunu bilmeli
2. Cached data'yı göster — beyaz ekran gösterme
3. Offline'da yapılan değişiklikleri queue'la
4. Online olunca sync et — conflict resolution stratejisi tanımla
5. Cache invalidation stratejisi net olmalı (ADR-005; query-layer adopt edilmişse TanStack Query policy ile)
6. Firestore offline persistence varsa chosen query/cache modeli ile koordine et (D-FIR)
7. Platform-specific offline davranışı düşün (D-PLT)

## Offline Smoke Test
8. Airplane mode senaryoları — her offline PR'ında ve quarterly regression olarak çalıştırılmalı:
   1. **Cache'li veri görüntüleme** — Offline'da daha önce yüklenmiş veri gösteriliyor mu?
   2. **Offline banner** — Kullanıcıya bağlantı durumu bildiriliyor mu?
   3. **Mutation queue ekleme** — Offline'da yapılan değişiklikler queue'a ekleniyor mu?
   4. **Online olunca replay** — Bağlantı geldiğinde queue'daki işlemler sırasıyla gönderiliyor mu?
   5. **Stale badge** — Eski verinin "güncel olmayabilir" göstergesi var mı?
   6. **Disabled butonlar** — Online gerektiren aksiyonlar devre dışı mı?
9. **Yöntem:** Airplane aç → test adımlarını yap → kapat → sync doğrula
10. **CI:** Network throttling simülasyonu ile otomatik test
11. **Sıklık:** Her offline PR + quarterly regression

## DoD Ek Maddeleri
- [ ] Offline indicator var
- [ ] Cached data gösteriliyor
- [ ] Sync stratejisi tanımlı
- [ ] Conflict resolution planlanmış
- [ ] Offline smoke test senaryoları geçiyor (cache, banner, queue, replay, stale badge, disabled butonlar)
- [ ] Network throttling CI testi çalışıyor
