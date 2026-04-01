---
id: D-TST
type: domain
name: Testing Stratejisi & Kalite
kaynak-dokümanlar: 14, ADR-008
miras-tipi: yapısal
son-güncelleme: 2026-04-01
---

# D-TST: Testing Guardrail

## Bu Guardrail Ne Zaman Aktif?
- Test yazımı
- Yeni modül/hook/component/screen oluşturma (tüm A-NEW-* aktiviteleri)
- Refactoring (A-REFACTOR) — mevcut testlerin korunması

## Zorunlu Kurallar

### Canonical Stack
1. [ZORUNLU] Web test: Vitest 4.x (ADR-008)
2. [ZORUNLU] Mobile test: Jest 30.x (ADR-008)
3. [ZORUNLU] E2E: Playwright 1.58.x (ADR-008)
4. [ZORUNLU] Component test: Testing Library

### Test Zorunlulukları (İş Türüne Göre)
5. [ZORUNLU] Yeni utility/hook → birim testi zorunlu
6. [ZORUNLU] Yeni component → render testi zorunlu
7. [ZORUNLU] Yeni API entegrasyonu → integration testi zorunlu
8. [YAPILMALI] Yeni ekran → smoke test önerilen

### Test Dosya Konumu
9. [ZORUNLU] Test dosyası kaynak dosya yanında: `*.test.ts(x)`
10. [YAPILMAMALI] Ayrı `__tests__/` dizininde test tutma

### Test Kalitesi
11. [YAPILMALI] Test, implementasyon detayı değil davranışı test etmeli
12. [YAPILMALI] Test açıklayıcı isimlendirilmeli ("should render error when API fails")
13. [YAPILMAMALI] Snapshot testi kötüye kullanma — büyük snapshot'lar bakım yükü
14. [YAPILMAMALI] `it.skip` / `describe.skip` ile test bypass bırakma
15. [YAPILMAMALI] Test'te `any` type kullanma

### Refactoring Güvencesi
16. [YAPILMALI] Refactoring öncesi mevcut test coverage'ı doğrula
17. [YAPILMAMALI] Refactoring sonrası coverage düşürme

## Anti-pattern'ler
1. [ZAYIF] Yeni component ama test dosyası yok
2. [ZAYIF] `it.skip('should...')` — atlanmış test commit'te kalmış
3. [ZAYIF] 500+ satır snapshot testi — bakım yükü, davranış testi yaz
4. [ZAYIF] Test implementasyon detayını test ediyor (state değişkeni kontrol) — davranış test et
5. [ZAYIF] Test'te `as any` type casting — tip güvenliği test'te de geçerli

## Kontrol Listesi
- [ ] Yeni modül için test yazıldı mı?
- [ ] Test dosyası kaynak yanında mı?
- [ ] Test davranışı mı test ediyor (implementasyon değil)?
- [ ] skip/only bırakılmamış mı?

## Kaynak
- Test stratejisi → docs/quality/14-testing-strategy.md
- Test kararı → docs/adr/ADR-008-testing-stack.md
- DoD → docs/checklists/32-definition-of-done.md
