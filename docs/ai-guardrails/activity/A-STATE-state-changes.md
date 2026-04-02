---
id: A-STATE
type: activity
name: State Yapısı Değişikliği
tetiklenen-domain-guardrails: [D-STA, D-PRF]
araç-zorunlulukları:
  spec: ihtiyaca göre
  stitch: —
  codex: zorunlu
son-güncelleme: 2026-04-02
---

# A-STATE: State Değişikliği Guardrail

## Ön Koşullar
1. D-STA guardrail'ini oku
2. State türünü belirle: local, feature, global, server, form

## Aktiviteye Özel Kurallar
1. En dar scope'ta tut — gereksiz yere global yapma
2. Server state → ADR-005 veri erişim modeli (generic store'a koyma; query-layer adopt edilmişse TanStack Query)
3. Form state → React Hook Form (Zustand'a koyma)
4. Store slice izolasyonu koru
5. Re-render etkisini düşün (D-PRF)
6. Persist ve reset mekanizması tanımla

## State Shape Migration
7. Her Zustand store'da `version` numarası tutulmalı
8. Schema değişikliğinde (field ekleme/kaldırma/rename) version artırılmalı + `migrate` fonksiyonu yazılmalı
9. Zustand persist konfigürasyonunda `version` ve `migrate` tanımlı olmalı:
   ```typescript
   persist(storeCreator, {
     name: 'store-name',
     version: 2,
     migrate: (persistedState, version) => { /* migration */ }
   })
   ```
10. **Test:** Migration birim testi zorunlu — eski state formatından yeni formata dönüşüm doğrulanmalı
11. **Fallback:** Migration başarısız olursa store sıfırlanmalı (reset) — uygulama çökmemeli
12. **Kural:** Persisted store'da field kaldırma veya rename yapılıyorsa migration zorunlu — doğrudan şema kırılması yasak

## DoD Ek Maddeleri
- [ ] State türü doğru
- [ ] Scope minimal
- [ ] Server/form state doğru yerde
- [ ] Re-render etkisi kontrol edilmiş
- [ ] Persisted store'da version numarası var
- [ ] Schema değişikliğinde migrate fonksiyonu yazılmış
- [ ] Migration birim testi mevcut
- [ ] Migration fail durumunda store reset mekanizması var
