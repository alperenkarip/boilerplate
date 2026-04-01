---
name: boundary-check
description: >
  TRIGGER: Türetilen projede çalışırken, packages/ veya apps/ dizin yapısı 
  değiştiğinde, import yönü şüphesi olduğunda veya boundary contract uyumu 
  sorgulandığında otomatik tetiklenir. Zorunlu miras ihlali, yapısal miras 
  gevşetmesi, onaysız override taraması yapar. Subagent olarak çalışır.
context: fork
allowed-tools:
  - Read
  - Glob
  - Grep
---

# Boundary Contract Kontrolü — Otomatik Tetikleme

## Ne Zaman Tetiklenir?

- Türetilen projede modül yapısı değiştiğinde
- packages/ veya apps/ arası import oluşturulduğunda
- CI/lint konfigürasyonu değiştiğinde
- Kullanıcı "boundary kontrol", "miras uyumu" dediğinde
- Quality gate veya coverage eşiği değiştirildiğinde

## Adımlar

1. **Boundary contract'ı oku:** `docs/governance/45-boilerplate-project-boundary-contract.md`

2. **Zorunlu miras kontrolleri:**
   - Canonical stack dışı dependency: `package.json`'da ADR-001→ADR-017 ile çelişen paket var mı?
   - A11y seviyesi AA altına düşürülmüş mü?
   - Security baseline gevşetilmiş mi?

3. **Yapısal miras kontrolleri:**
   - Token hiyerarşisi korunuyor mu?
   - CI quality gate'leri gevşetilmiş mi? (coverage eşiği, lint severity)
   - DoD base maddeleri kaldırılmış mı?

4. **Import yönü taraması:**
   ```bash
   # packages → apps yönünde import (YASAK)
   grep -rn "from ['\"].*apps/" packages/ --include='*.ts' --include='*.tsx' 2>/dev/null
   # shared → feature yönünde import (YASAK)  
   grep -rn "from ['\"].*features/" packages/ --include='*.ts' --include='*.tsx' 2>/dev/null
   ```

5. **Override hijyeni:** BOUNDARY.md var mı? Süresi dolmuş override?

6. **Rapor:** PASS / FAIL + bulgular
