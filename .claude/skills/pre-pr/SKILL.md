---
name: pre-pr
description: >
  TRIGGER: Kullanıcı "PR aç", "commit", "push", "merge" dediğinde veya 
  kodlama görevi tamamen bittiğinde otomatik tetiklenir. Tüm değişiklikleri 
  guardrail'lere karşı toplu denetler, test durumunu kontrol eder, boundary 
  check yapar ve DoD kontrol listesi sunar. Subagent olarak çalışır.
context: fork
allowed-tools:
  - Read
  - Glob
  - Grep
  - Bash
---

# PR Öncesi Kalite Kontrolü — Otomatik Tetikleme

Bu skill PR/commit/push öncesinde OTOMATİK çalışır.

## Ne Zaman Tetiklenir?

- Kullanıcı "PR aç", "commit yap", "push et" dediğinde
- Kodlama görevi tamamen bittiğinde
- `/commit` skill'i tetiklenmeden önce

## Adımlar

1. **Değişen dosyaları tespit et:** `git diff --name-only` + `git diff --cached --name-only`

2. **Universal guardrail taraması (her dosyada):**
   ```bash
   # Hardcoded renk
   grep -rn '#[0-9a-fA-F]\{3,8\}\b' [dosyalar] --include='*.tsx' --include='*.ts' --include='*.jsx'
   # any type
   grep -rn ': any\b' [dosyalar] --include='*.ts' --include='*.tsx'
   # eslint-disable
   grep -rn 'eslint-disable\|@ts-ignore' [dosyalar]
   # Import yönü
   grep -rn "from ['\"].*packages/" [dosyalar in apps/]
   grep -rn "from ['\"].*apps/" [dosyalar in packages/]
   ```

3. **Test kontrolü:**
   - Yeni `.ts`/`.tsx` dosyası var mı? Yanında `.test.ts(x)` var mı?
   - `pnpm test --run 2>&1 | tail -20` — testler geçiyor mu?

4. **Boundary kontrolü:**
   - packages/ → apps/ yönünde import var mı?
   - shared → feature yönünde import var mı?

5. **Rapor:**

```
## PR Kalite Raporu

### Universal Guardrail
- Hardcoded değer: ✅/❌ [detay]
- any type: ✅/❌
- Import yönü: ✅/❌
- Lint bypass: ✅/❌

### Test: ✅/❌
### Boundary: ✅/❌

### Sonuç: PASS / CONCERNS / REWORK / FAIL
```
