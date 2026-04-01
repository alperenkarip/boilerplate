---
id: A-AUTH
type: activity
name: Auth Flow Değişikliği
tetiklenen-domain-guardrails: [D-SEC]
araç-zorunlulukları:
  spec: zorunlu
  stitch: —
  codex: zorunlu
son-güncelleme: 2026-04-01
---

# A-AUTH: Auth Değişikliği Guardrail

## Ön Koşullar
1. ADR-010 oku — auth kararları
2. D-SEC guardrail'ini oku — security kuralları
3. SPEC oluştur — auth değişikliği karmaşıklık >= 5

## Aktif Domain Guardrail'ler
- **D-SEC** → Token yönetimi, secret, session, client-side güvenlik

## Aktiviteye Özel Kurallar
1. Web: HttpOnly cookie — localStorage/sessionStorage yasak (ADR-010)
2. Mobile: Expo SecureStore (ADR-010)
3. Token'ı URL'de taşıma
4. Session invalidation mekanizması tanımla
5. Logout'ta tüm state temizle (D-STA ile kesişir)
6. Auth error handling net olmalı (D-ERR)

## DoD Ek Maddeleri
- [ ] ADR-010 uyumu
- [ ] Token güvenli saklanıyor
- [ ] Session invalidation tanımlı
- [ ] Logout state cleanup var
- [ ] Security review geçmiş
