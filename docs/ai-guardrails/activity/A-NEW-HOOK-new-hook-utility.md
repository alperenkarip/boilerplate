---
id: A-NEW-HOOK
type: activity
name: Yeni Hook / Utility Oluşturma
tetiklenen-domain-guardrails: [D-TST]
araç-zorunlulukları:
  spec: —
  stitch: —
  codex: zorunlu
son-güncelleme: 2026-04-02
---

# A-NEW-HOOK: Yeni Hook/Utility Guardrail

## Aktiviteye Özel Kurallar
1. Birim testi zorunlu (D-TST)
2. TypeScript ile tip güvenliği sağla — `any` yasak
3. Hook/utility doğru dizinde olmalı: packages/{paket}/ veya feature dizini
4. Naming: camelCase fonksiyon, use* prefix (hook'lar için)
5. Tek sorumluluk — çok iş yapan utility fonksiyon yazma
6. Pure fonksiyon mümkünse tercih et (side-effect minimize)

## Hook Composition Test
7. `renderHook` ile isolation test zorunlu — hook'lar bağımsız olarak test edilebilmelidir
8. Minimum test kapsamı:
   - **Initial state** — Hook mount edildiğinde doğru başlangıç state'i döndürüyor mu?
   - **State güncelleme** — Action/setter çağrıldığında state doğru güncelleniyor mu?
   - **Cleanup / leak** — Unmount'ta listener, timer, subscription temizleniyor mu?
   - **Error handling** — Hata durumunda hook nasıl davranıyor?
   - **Re-render side effect** — Gereksiz re-render'da yan etki oluşmuyor mu?
9. **Hook dependency:** Context veya provider gerektiren hook'larda wrapper ile mock sağlanmalı
10. **Async hook:** `waitFor` ile async state geçişleri test edilmeli

## DoD Ek Maddeleri
- [ ] Birim testi yazılmış
- [ ] renderHook ile isolation test mevcut (initial state, güncelleme, cleanup, error, re-render)
- [ ] Async hook'larda waitFor kullanılmış
- [ ] TypeScript strict — any yok
- [ ] Doğru dizinde
- [ ] Naming convention uygun
