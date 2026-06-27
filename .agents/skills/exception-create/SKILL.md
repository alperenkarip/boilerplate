---
name: exception-create
description: >
  TRIGGER: Guardrail ihlali tespit edildiğinde ve düzeltme mümkün olmadığında 
  otomatik tetiklenir. guardrail-audit veya hook uyarısı sonrasında ihlal 
  düzeltilemiyorsa bu skill çalışarak 44-exception-and-exemption-policy.md 
  formatına uygun exception kaydı oluşturur. Kullanıcı "exception aç", 
  "muafiyet oluştur" dediğinde de tetiklenir.
allowed-tools:
  - Read
  - Write
  - Glob
---

# Exception / Exemption Kaydı — Otomatik Tetikleme

## Ne Zaman Tetiklenir?

- guardrail-audit REWORK/FAIL sonucu verdiğinde ve düzeltme yapılamadığında
- Hook uyarısı sonrası ihlal kasıtlı olarak bırakılacaksa
- Kullanıcı "exception aç", "muafiyet", "kural ihlali kaydet" dediğinde
- `eslint-disable` veya `@ts-ignore` kullanılacaksa (exception olmadan YASAK)

## Adımlar

1. **Şablonu oku:** `tooling/governance/exception-template.yaml`

2. **İhlal bilgilerini topla:**
   - Tür: exception (süreli) veya exemption (kalıcı)?
   - İhlal edilen kural: guardrail ID (D-XXX §Y) veya doküman referansı
   - Etkilenen dosya ve satır
   - Gerekçe: neden düzeltilemiyor?
   - Severity: minor (maks 30 gün) / major (maks 60 gün) / blocker (maks 30 gün)

3. **Mevcut exception'ları tara:** `exceptions/` dizinindeki dosyaları say, sıradaki numara belirle.

4. **YAML oluştur:** `exceptions/EXC-NNN.yaml` veya `exceptions/EXP-NNN.yaml`

5. **Budget kontrolü:** Aktif exception sayısı limitleri kontrol et:
   - Proje geneli: maks 20 exception, 10 exemption
   - Tek app: maks 10 exception, 5 exemption
   - Tek package: maks 5 exception, 3 exemption
   Budget aşılıyorsa UYAR.

6. **Sonucu bildir:** Dosya yolu, içerik ve budget durumu.
