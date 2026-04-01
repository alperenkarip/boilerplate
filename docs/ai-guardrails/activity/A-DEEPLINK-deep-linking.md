---
id: A-DEEPLINK
type: activity
name: Deep Link İmplementasyonu
tetiklenen-domain-guardrails: [D-DPL, D-NAV, D-SEC]
araç-zorunlulukları:
  spec: önerilir
  stitch: —
  codex: önerilir
son-güncelleme: 2026-04-01
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

## DoD Ek Maddeleri
- [ ] ADR-014 uyumu sağlanmış
- [ ] Verified domain linking kurulumu var (Universal Links / App Links)
- [ ] `apple-app-site-association` ve `assetlinks.json` tanımlı
- [ ] Merkezi link config tanımlı
- [ ] Fallback URL'ler tanımlı
- [ ] Deep link parametre validation var
- [ ] Navigation state deep link sonrası tutarlı
- [ ] Deep link test'leri geçiyor
- [ ] D-NAV kontrol listesi geçmiş
- [ ] D-SEC kontrol listesi geçmiş
