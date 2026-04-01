---
id: A-REALTIME
type: activity
name: Real-time / WebSocket / Push Notification
tetiklenen-domain-guardrails: [D-DAT, D-SEC, D-PRF]
araç-zorunlulukları:
  spec: zorunlu
  stitch: —
  codex: zorunlu
son-güncelleme: 2026-04-01
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

## DoD Ek Maddeleri
- [ ] Connection lifecycle tanımlı
- [ ] Reconnection stratejisi var
- [ ] Cleanup yapılıyor
- [ ] Güvenlik kontrol edilmiş
