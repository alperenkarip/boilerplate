---
id: D-DAT
type: domain
name: Data Fetching, Cache, Sync, Mutation
kaynak-dokümanlar: 10, ADR-005
miras-tipi: yapısal
son-güncelleme: 2026-04-01
---

# D-DAT: Data Fetching Guardrail

## Bu Guardrail Ne Zaman Aktif?
- Yeni API entegrasyonu (A-NEW-API)
- Firebase/Firestore işlemi (A-FIREBASE)
- Data layer değişikliği, cache stratejisi

## Zorunlu Kurallar

### Canonical Stack
1. [ZORUNLU] ADR-005 veri erişim modeline uy: fetch-first default + yazılı query-layer kararı; complexity threshold aşıldıysa TanStack Query 5.x kullan
2. [YAPILMAMALI] Raw fetch/axios ile manuel cache yönetimi yapma

### Query Tasarımı
3. [YAPILMALI] Her query'nin unique key'i olmalı — tutarlı key stratejisi
4. [YAPILMALI] Stale time ve cache time bilinçli ayarlanmalı
5. [YAPILMALI] Error ve loading state'leri her query için handle edilmeli
6. [YAPILMAMALI] Component içinde doğrudan fetch çağrısı yapma — custom hook kullan

### Mutation
7. [YAPILMALI] Mutation sonrası ilgili query invalidation yapılmalı
8. [YAPILMALI] Optimistic update kullanıyorsan rollback mekanizması tanımla
9. [YAPILMAMALI] Mutation başarısız olduğunda kullanıcıyı bilgilendirmeden geçme

### Error Handling
10. [YAPILMALI] Network error, server error, timeout ayrı handle edilmeli
11. [YAPILMALI] Retry stratejisi tanımlanmalı (exponential backoff önerilen)
12. [YAPILMAMALI] Tüm hataları aynı generic mesajla gösterme

### Cache & Sync
13. [YAPILMALI] Cache invalidation stratejisi bilinçli olmalı
14. [YAPILMAMALI] Client-side'da stale data göstererek kullanıcıyı yanıltma
15. [YAPILMAMALI] Her component mount'ta refetch zorla — cache'e güven

## Anti-pattern'ler
1. [ZAYIF] `useEffect(() => { fetch(...) }, [])` ile screen-level raw fetch — veri erişim contract'ı kullan; query-layer adopt edilmişse TanStack Query kullan
2. [ZAYIF] Her component mount'ta refetch — cache'e güven
3. [ZAYIF] Query key'leri tutarsız — aynı veri için farklı key'ler
4. [ZAYIF] Mutation sonrası invalidation yok — stale data gösterimi
5. [ZAYIF] Tüm hatalara generic "Bir hata oluştu" mesajı

## Kontrol Listesi
- [ ] ADR-005 kararı görünür mü? (fetch-first veya TanStack Query adoption)
- [ ] Query key tutarlı mı?
- [ ] Error/loading state handle ediliyor mu?
- [ ] Mutation sonrası invalidation var mı?
- [ ] Retry stratejisi tanımlı mı?

## Kaynak
- Data fetching → docs/architecture/10-data-fetching-cache-sync.md
- Data kararı → docs/adr/ADR-005-data-fetching-cache-and-mutation-model.md
