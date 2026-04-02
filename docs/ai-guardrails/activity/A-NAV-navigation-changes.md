---
id: A-NAV
type: activity
name: Navigation / Routing Değişikliği
tetiklenen-domain-guardrails: [D-NAV, D-PLT]
araç-zorunlulukları:
  spec: ihtiyaca göre
  stitch: —
  codex: zorunlu
son-güncelleme: 2026-04-02
---

# A-NAV: Navigation Değişikliği Guardrail

## Ön Koşullar
1. D-NAV guardrail'ini oku
2. 08-navigation-and-flow-rules.md kontrol et

## Aktiviteye Özel Kurallar
1. Route ekleme/değiştirme → mevcut deep link'leri kırma
2. Modal/sheet ekleme → doğru presentation surface seç
3. Back davranışı her platformda test et
4. Navigation state persistence gerekiyorsa tanımla
5. Yeni tab/stack → navigation hierarchy bozma

## Navigation Analytics Otomatik Entegrasyon
6. Yeni ekran eklendiğinde `NavigationContainer` listener'da `screen_view` event kontrolü yapılmalı
7. `screen_view` event'i D-OBS şemasına uygun şekilde otomatik gönderilmeli
8. **CI kontrolü:** Yeni ekranda analytics mapping tanımlı mı? — tanımsız ekran tespit edilirse uyarı
9. **PR checklist:** "screen_view event çalışıyor mu?" maddesi eklenmeli

## DoD Ek Maddeleri
- [ ] Route tanımlı
- [ ] Back davranışı net
- [ ] Mevcut deep link'ler kırılmamış
- [ ] Platform parity (web + mobile) sağlanmış
- [ ] Yeni ekran için screen_view analytics event tanımlı
- [ ] Navigation analytics mapping güncel
