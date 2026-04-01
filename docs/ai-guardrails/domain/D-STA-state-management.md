---
id: D-STA
type: domain
name: State Management
kaynak-dokümanlar: 09, ADR-004
miras-tipi: yapısal
son-güncelleme: 2026-04-01
---

# D-STA: State Management Guardrail

## Bu Guardrail Ne Zaman Aktif?
- State yapısı değişikliği (A-STATE)
- Yeni feature (A-NEW-FEAT) — state tasarımı gerekiyorsa
- Global store ekleme/düzenleme

## Zorunlu Kurallar

### Canonical Stack
1. [ZORUNLU] State management: Zustand 5.x (ADR-004)
2. [YAPILMAMALI] Redux, MobX, Jotai veya başka state kütüphanesi kullanma

### State Sahipliği
3. [YAPILMALI] State türünü belirle: local, feature, app-global, server, form, persisted, derived
4. [YAPILMALI] State sahipliği en dar kapsamda tut — global yapma gereksiz yere
5. [YAPILMAMALI] Server state'i Zustand'da tutma — ADR-005 veri erişim modeline uy; query-layer adopt edilmişse TanStack Query kullan
6. [YAPILMAMALI] Form state'i global store'a koyma — React Hook Form kullan (ADR-006)

### Store Yapısı
7. [YAPILMALI] Her feature kendi slice'ına sahip olmalı — tek monolitik store yapma
8. [YAPILMALI] Store'dan türetilebilen state'i ayrı tutma — derived/computed kullan
9. [YAPILMAMALI] Store'a gereksiz veri yığma — minimal tut

### Persist & Reset
10. [YAPILMALI] Persist gereken state açıkça belirtilmeli
11. [YAPILMALI] Logout / session end'de state sıfırlama mekanizması olmalı
12. [YAPILMAMALI] Kullanıcı verisi session sonrası bellekte kalmamalı

## Anti-pattern'ler
1. [ZAYIF] Server state (API response) Zustand store'da — generic store'a kopyalama; ADR-005 modeline dön
2. [ZAYIF] Form state global store'da — React Hook Form kullan
3. [ZAYIF] Tek monolitik store — tüm state tek slice'ta
4. [ZAYIF] Logout sonrası kullanıcı verisi bellekte kalmış — state reset yok
5. [ZAYIF] Her component global store'a bağlı — local state yeterli olduğu halde

## Kontrol Listesi
- [ ] State türü doğru belirlenmiş mi (local/feature/global/server/form)?
- [ ] Server state generic store'a kopyalanmamış mı?
- [ ] Form state React Hook Form'da mı?
- [ ] Store slice izole mi?
- [ ] Logout'ta state sıfırlanıyor mu?

## Kaynak
- State stratejisi → docs/architecture/09-state-management-strategy.md
- State kararı → docs/adr/ADR-004-state-management.md
