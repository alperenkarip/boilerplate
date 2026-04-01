---
id: A-REFACTOR
type: activity
name: Refactoring
tetiklenen-domain-guardrails: [D-TST]
araç-zorunlulukları:
  spec: —
  stitch: —
  codex: zorunlu
son-güncelleme: 2026-04-01
---

# A-REFACTOR: Refactoring Guardrail

## Ön Koşullar
1. Mevcut test coverage'ı doğrula — testler yoksa önce test yaz
2. Refactoring amacını belirle (okunabilirlik, performans, modül sınırı düzeltme)

## Aktif Domain Guardrail'ler
- **Universal kurallar** + **D-TST**
- Refactoring alanına göre ek domain (UI refactoring → D-DSY, data refactoring → D-DAT)

## Aktiviteye Özel Kurallar
1. Refactoring scope'unu dar tut — tek PR'da tek amaç
2. Mevcut test coverage'ı düşürme
3. Davranış değişikliği yapma — refactoring = aynı davranış, farklı yapı
4. Refactoring'e feature ekleme karıştırma
5. Import yönü ihlali düzeltiliyorsa boundary check yap

## DoD Ek Maddeleri
- [ ] Mevcut testler geçiyor
- [ ] Coverage düşmemiş
- [ ] Davranış değişmemiş
- [ ] Scope dar tutulmuş
