---
id: A-DEEPLINK
type: activity
name: Deep Link İmplementasyonu
tetiklenen-domain-guardrails: [D-DPL, D-NAV, D-SEC]
araç-zorunlulukları:
  spec: önerilir
  stitch: —
  codex: önerilir
son-güncelleme: 2026-04-02
---

# A-DEEPLINK: Deep Link İmplementasyonu Guardrail

## Ön Koşullar
1. ADR-014 oku — deep linking stratejisi
2. D-DPL guardrail'ini oku — deep linking kuralları
3. 08-navigation-and-flow-rules.md oku — navigation pattern'leri
4. D-SEC guardrail'ini oku — parametre injection koruması

## Aktif Domain Guardrail'ler
- **D-DPL** → Deep link SDK, routing config, fallback, parametre validation
- **D-NAV** → Navigation state tutarlılığı, route tanımları
- **D-SEC** → Parametre injection koruması, güvenli URL handling

## Aktiviteye Özel Kurallar
1. `expo-linking` kullanılmalı (ADR-014)
2. `apple-app-site-association` ve `assetlinks.json` tanımla — verified domain linking kurulumu
3. Link routing merkezi config'de olsun — component içinde dağıtılmamalı
4. Her deep link route'u için fallback URL tanımla — uygulama yüklü değilken web'e yönlendirme
5. Parametre validation ekle — Zod veya benzeri schema ile deep link parametrelerini doğrula
6. Navigation state'i deep link'ten sonra tutarlı olmalı — back navigation doğru çalışmalı
7. Test: her route için deep link unit test yaz

## Deep Link Integration Test
8. Her yeni deep link path'i için aşağıdaki 6 senaryo zorunlu olarak test edilmeli:
   1. **Cold start** — Uygulama kapalıyken link ile açılma
   2. **Warm start** — Uygulama arka plandayken link ile öne gelme
   3. **Hot start** — Uygulama açıkken link ile navigasyon
   4. **Auth-gated redirect** — Giriş gerektiren hedef ekrana yönlendirme (login sonrası doğru hedefe ulaşma)
   5. **Invalid params graceful fallback** — Geçersiz parametrelerle açıldığında hata yerine uygun fallback
   6. **Expired link hata mesajı** — Süresi dolmuş link'te kullanıcıya açıklayıcı mesaj
9. **Araç:** Detox veya Maestro E2E framework ile otomasyon
10. **CI:** Her deep link PR'ında integration test pipeline'ı çalışır — skip edilemez

## DoD Ek Maddeleri
- [ ] ADR-014 uyumu sağlanmış
- [ ] Verified domain linking kurulumu var (Universal Links / App Links)
- [ ] `apple-app-site-association` ve `assetlinks.json` tanımlı
- [ ] Merkezi link config tanımlı
- [ ] Fallback URL'ler tanımlı
- [ ] Deep link parametre validation var
- [ ] Navigation state deep link sonrası tutarlı
- [ ] Deep link integration test'leri geçiyor (cold/warm/hot start, auth-gated, invalid params, expired link)
- [ ] D-NAV kontrol listesi geçmiş
- [ ] D-SEC kontrol listesi geçmiş
