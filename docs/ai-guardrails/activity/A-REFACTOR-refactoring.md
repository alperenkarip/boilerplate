---
id: A-REFACTOR
type: activity
name: Refactoring
tetiklenen-domain-guardrails: [D-TST]
araç-zorunlulukları:
  spec: —
  stitch: —
  codex: zorunlu
son-güncelleme: 2026-04-02
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

## Refactoring Coverage Koruması
6. Coverage diff hesaplanır — refactoring öncesi ve sonrası coverage karşılaştırılır
7. Coverage düşüşü > %0 ise PR uyarı alır; düşüş kabul edilmez
8. Test silmek veya `skip` ile atlamak yasak — refactoring testleri korur, kırmaz
9. Refactoring sırasında keşfedilen test edilmemiş alan varsa → o alan için test eklenir
10. Dead code kaldırılırsa ilgili testler de kaldırılır — bu coverage'ı olumsuz etkilemez

## DoD Ek Maddeleri
- [ ] Mevcut testler geçiyor
- [ ] Coverage düşmemiş (coverage diff kontrol edilmiş)
- [ ] Test silinmemiş veya atlanmamış
- [ ] Keşfedilen test eksikliği kapatılmış
- [ ] Davranış değişmemiş
- [ ] Scope dar tutulmuş
