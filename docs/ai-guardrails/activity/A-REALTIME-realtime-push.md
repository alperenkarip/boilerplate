---
id: A-REALTIME
type: activity
name: Real-time / WebSocket / Push Notification
tetiklenen-domain-guardrails: [D-DAT, D-SEC, D-PRF]
araç-zorunlulukları:
  spec: zorunlu
  stitch: —
  codex: zorunlu
son-güncelleme: 2026-04-02
---

# A-REALTIME: Real-time/Push Guardrail

## Aktiviteye Özel Kurallar
1. Connection lifecycle tanımla (connect, disconnect, reconnect)
2. Reconnection stratejisi: exponential backoff
3. Connection drop durumunda kullanıcıyı bilgilendir
4. Listener/subscription cleanup (component unmount)
5. Push notification permission flow: açıklayıcı pre-prompt göster
6. PII ve hassas veri real-time channel'da göndermeme (D-SEC)
7. Rate limiting / throttling düşün (D-PRF)

## WebSocket Reconnection Stratejisi
8. `onclose` / `onerror` tetiklendiğinde otomatik exponential backoff retry başlamalı:
   - **Backoff aralıkları:** 1s → 2s → 4s → 8s → 16s → 30s (cap)
   - **Maksimum deneme:** 10 — aşılırsa kullanıcıya bilgi verilir
9. **UI feedback:** "Bağlantı koptu, yeniden bağlanılıyor..." banner'ı gösterilmeli
10. **State sync:** Reconnect sonrası son alınan event'ten itibaren eksik veri senkronize edilmeli
11. **Heartbeat:** 30 saniyede bir ping/pong — bağlantı canlılığı doğrulanır
12. **Background/Foreground:** Uygulama arka plana geçtiğinde WS kapatılır, ön plana geldiğinde yeniden bağlanır

## DoD Ek Maddeleri
- [ ] Connection lifecycle tanımlı
- [ ] Reconnection stratejisi var (exponential backoff, max 10 deneme)
- [ ] Reconnection UI feedback gösteriliyor
- [ ] Heartbeat mekanizması aktif (30s ping/pong)
- [ ] Background/foreground WS yönetimi tanımlı
- [ ] Cleanup yapılıyor
- [ ] Güvenlik kontrol edilmiş
