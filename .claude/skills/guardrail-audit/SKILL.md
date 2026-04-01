---
name: guardrail-audit
description: >
  TRIGGER: Bir kodlama görevi TAMAMLANDIĞINDA veya birden fazla dosya 
  düzenlendikten SONRA otomatik tetiklenir. Özellikle yeni component, 
  ekran, feature tamamlandığında veya PR öncesinde çalışmalıdır.
  Değişen dosyaları guardrail kurallarına karşı denetler ve ihlal 
  raporu üretir. Subagent olarak çalışır.
context: fork
allowed-tools:
  - Read
  - Glob
  - Grep
  - Bash
---

# Guardrail Denetimi — Tamamlanma Sonrası Otomatik

Bu skill kodlama görevi tamamlandığında OTOMATİK çalışır.
Hook'lar dosya bazında anlık kontrol yapar, bu skill tüm değişikliği toplu denetler.

## Ne Zaman Tetiklenir?

- Bir component, ekran veya feature implementasyonu tamamlandığında
- Birden fazla dosya düzenlendikten sonra
- PR açılmadan önce (pre-pr ile birlikte veya tek başına)
- Kullanıcı "kontrol et", "denetle", "review" dediğinde

## Adımlar

1. **Değişen dosyaları tespit et:**
   ```bash
   git diff --name-only HEAD 2>/dev/null || git diff --name-only
   ```
   Değişen dosya yoksa staged dosyaları kontrol et:
   ```bash
   git diff --cached --name-only
   ```

2. **Her dosyayı domain'e eşle:**
   - `.tsx`/`.jsx` → D-UIX, D-DSY, D-A11
   - `firebase`/`firestore` path → D-FIR, D-SEC
   - `*.test.*` → D-TST
   - `form`/`validation`/`schema` path → D-FRM
   - `store`/`state`/`zustand` path → D-STA
   - `route`/`navigation` path → D-NAV
   - `auth`/`session`/`token` path → D-SEC
   - `.css`/`.style.*` → D-STY, D-DSY
   - `apps/mobile/` → D-PLT (mobile), D-UIX (HIG)
   - `apps/web/` → D-PLT (web)
   - `packages/` → boundary kontrolü kritik

3. **İlgili guardrail dokümanlarını oku:** `docs/ai-guardrails/domain/D-XXX-*.md`

4. **Dosya içerik taraması:**

   **Universal (her dosyada):**
   - `grep -rn '#[0-9a-fA-F]\{3,8\}' [dosya]` → hardcoded renk
   - `grep -rn ': any\b' [dosya]` → any type
   - `grep -rn 'eslint-disable\|@ts-ignore' [dosya]` → lint bypass
   - Import yönü kontrolü: `packages/` → `apps/` import var mı?
   - `grep -rn 'console\.log' [dosya]` → prod'da kalmamalı

   **Domain-spesifik:**
   - İlgili guardrail kontrol listesindeki maddeleri dosyada kontrol et

5. **Rapor üret:**

```
## Guardrail Denetim Raporu

### Taranan Dosyalar: X adet
[liste]

### İhlaller
| # | Dosya:Satır | Guardrail | Kural | Severity |
|---|-------------|-----------|-------|----------|

### Özet
- P0 (blocker): X → HEMEN düzelt
- P1 (major): X → Düzelt veya gerekçelendir
- P2 (minor): X → Önerilen düzeltme

### Sonuç: PASS / CONCERNS / REWORK / FAIL
```

6. **İhlal varsa düzeltme öner.** P0 ihlalleri için kod düzeltmesi sun.
