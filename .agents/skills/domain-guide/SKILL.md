---
name: domain-guide
description: >
  TRIGGER: Belirli bir domain hakkında detaylı kural bilgisi gerektiğinde 
  tetiklenir. Kullanıcı "HIG kuralları nedir", "form validation nasıl 
  yapılmalı", "Firebase güvenlik kuralları" gibi domain-spesifik sorular 
  sorduğunda veya bir domain guardrail'inin detayını görmek istediğinde 
  otomatik çalışır. $ARGUMENTS ile domain ID alır.
allowed-tools:
  - Read
  - Glob
---

# Domain Guardrail Rehberi — Otomatik Tetikleme

## Ne Zaman Tetiklenir?

- Kullanıcı belirli bir domain hakkında kural bilgisi sorduğunda
- guardrail-check sonucunda bir domain'in detayı gerektiğinde
- Kullanıcı "D-XXX kuralları nedir", "form kuralları", "HIG kuralları" dediğinde

## Adımlar

1. **Domain ID'yi belirle:** $ARGUMENTS varsa doğrudan kullan. Yoksa kullanıcının sorusundan çıkar:
   - HIG, UI, UX, touch target, safe area → D-UIX
   - token, design system, component governance → D-DSY
   - form, validation, input, field → D-FRM
   - firebase, firestore, collection → D-FIR
   - security, auth, secret, credential → D-SEC
   - accessibility, a11y, WCAG, screen reader → D-A11
   - navigation, route, deep link → D-NAV
   - state, zustand, store → D-STA
   - data, query, fetch, cache → D-DAT
   - motion, animation, transition → D-MOT
   - error, loading, empty state → D-ERR
   - platform, web, mobile, cross-platform → D-PLT
   - test, vitest, jest → D-TST
   - performance, render, bundle → D-PRF
   - observability, logging, analytics, sentry → D-OBS
   - i18n, çeviri, dil → D-I18
   - styling, tailwind, nativewind → D-STY
   - visual, tasarım, fidelity → D-VIS
   - third-party, SDK, entegrasyon → D-3RD

2. **Guardrail dokümanını oku:** `docs/ai-guardrails/domain/D-XXX-*.md`

3. **Özet sun:** Zorunlu kurallar, anti-pattern'ler, kontrol listesi, kaynak referansları.

Eğer domain belirlenemezse, tüm domain listesini göster.
