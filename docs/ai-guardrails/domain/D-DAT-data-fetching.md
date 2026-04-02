---
id: D-DAT
type: domain
name: Data Fetching, Cache, Sync, Mutation
kaynak-dokümanlar: 10, ADR-005
miras-tipi: yapısal
son-güncelleme: 2026-04-02
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

### Infinite Scroll vs Pagination Karar Ağacı
16. [YAPILMALI] Veri listeleme yöntemi bilinçli seçilmeli — aşağıdaki karar ağacını kullan:

| Kriter | Infinite Scroll | Klasik Pagination | Hybrid |
|---|---|---|---|
| Kullanım senaryosu | Feed, timeline, keşfet | Tablo, grid, arama sonuçları | Infinite + toplam sayaç |
| Kullanıcı davranışı | Son öğeye genellikle ulaşmaz | Sayfa atlama ihtiyacı var | Sayfa atlama + akış |
| Platform tercihi | Mobil uygulamalar | Web dashboard'lar | Esnek |
| SEO ihtiyacı | Hayır | Evet | Kısmen |
| Toplam sayı gösterimi | Gerekli değil | Gerekli | Gerekli |

17. [ZORUNLU] >100 öğe gösteren listelerde React Native tarafında `FlashList` kullanılmalı — `FlatList` performans sorunları yaşatır
18. [YAPILMALI] Infinite scroll'da son sayfa (hasNextPage) kontrolü yapılmalı — gereksiz fetch önlenmeli
19. [YAPILMALI] Pagination'da toplam sayfa sayısı ve mevcut sayfa bilgisi gösterilmeli

### Cache Invalidation Stratejisi Tablosu
20. [YAPILMALI] Veri tipine göre aşağıdaki cache stratejisi uygulanmalı:

| Veri Tipi | staleTime | Invalidation Tetikleyici | Pattern |
|---|---|---|---|
| Kullanıcı profili | 5 dakika | Profil güncelleme mutation'ı | Mutation sonrası invalidate |
| Feed / timeline | 30 saniye | Pull-to-refresh, yeni paylaşım | Otomatik refetch + manuel |
| Bildirimler | 1 dakika | Push notification, ekran focus | Focus refetch + push |
| Uygulama ayarları | 10 dakika | Ayar değişikliği mutation'ı | Mutation sonrası invalidate |
| Arama sonuçları | 0 (her zaman taze) | Her yeni arama | Yeni query key |
| Remote config | 1 saat | Uygulama ön plana geldiğinde | Focus refetch |

21. [YAPILMALI] staleTime değerleri bilinçli ve dokümante edilmeli — varsayılan 0 yerine uygun değer belirle
22. [YAPILMAMALI] Tüm query'lere aynı staleTime uygulamak — veri türüne göre farklılaştır

## Anti-pattern'ler
1. [ZAYIF] `useEffect(() => { fetch(...) }, [])` ile screen-level raw fetch — veri erişim contract'ı kullan; query-layer adopt edilmişse TanStack Query kullan
2. [ZAYIF] Her component mount'ta refetch — cache'e güven
3. [ZAYIF] Query key'leri tutarsız — aynı veri için farklı key'ler
4. [ZAYIF] Mutation sonrası invalidation yok — stale data gösterimi
5. [ZAYIF] Tüm hatalara generic "Bir hata oluştu" mesajı
6. [ZAYIF] 500+ öğelik listede `FlatList` kullanma — `FlashList` kullan
7. [ZAYIF] Tüm query'lerde `staleTime: 0` — gereksiz refetch yükü
8. [ZAYIF] Infinite scroll'da `hasNextPage` kontrolü yok — boş sayfa fetch ediliyor

## Kontrol Listesi
- [ ] ADR-005 kararı görünür mü? (fetch-first veya TanStack Query adoption)
- [ ] Query key tutarlı mı?
- [ ] Error/loading state handle ediliyor mu?
- [ ] Mutation sonrası invalidation var mı?
- [ ] Retry stratejisi tanımlı mı?
- [ ] Liste yöntemi bilinçli seçildi mi (infinite scroll / pagination / hybrid)?
- [ ] >100 öğe listesinde FlashList kullanılıyor mu (React Native)?
- [ ] staleTime veri tipine uygun ayarlandı mı?
- [ ] Cache invalidation tetikleyicileri tanımlı mı?

### API Client Kuralları
23. [ZORUNLU] Tüm HTTP istekleri merkezi `apiClient` üzerinden yapılmalıdır — component veya hook içinde doğrudan `fetch()` / `axios()` çağrısı YASAK
24. [ZORUNLU] Auth token injection interceptor'da yapılmalıdır — her çağrı noktasında manuel `Authorization` header ekleme YASAK
25. [ZORUNLU] Base URL environment variable'dan alınmalıdır — hardcoded URL YASAK
26. [ZORUNLU] Her API çağrısında timeout tanımlı olmalıdır — timeout'suz istek YASAK
27. [YAPILMALI] `AbortController` ile request cancellation desteklenmeli (component unmount, navigation change)
28. [YAPILMALI] Response hataları interceptor'da normalize edilmeli — her catch bloğunda tekrar eden error mapping YASAK
29. [YAPILMAMALI] Auth token'ı URL query parameter olarak gönderme (güvenlik riski — token URL'de loglanabilir, tarayıcı geçmişinde kalabilir)
30. [YAPILMAMALI] API versiyonunu client kodunda hardcode etme — merkezi config'den alınmalı

## Anti-pattern'ler (API Client)
9. [ZAYIF] Component içinde doğrudan `fetch('https://api.example.com/...')` çağrısı — `apiClient` kullan
10. [ZAYIF] Her dosyada base URL tekrarlamak — merkezi ortam değişkeni kullan
11. [ZAYIF] Timeout belirtmeden istek yapmak — timeout politikasına uy
12. [ZAYIF] Her çağrı noktasında aynı error handling kodunu tekrarlamak — interceptor'a taşı
13. [ZAYIF] Upload işleminde progress göstermemek — kullanıcı belirsizlik yaşar

## Kontrol Listesi (API Client)
- [ ] Tüm HTTP çağrıları `apiClient` üzerinden mi yapılıyor?
- [ ] Auth token interceptor'da mı ekleniyor?
- [ ] Base URL ortam değişkeninden mi alınıyor?
- [ ] Timeout her istek türü için tanımlı mı?
- [ ] AbortController ile cancellation destekleniyor mu?
- [ ] Error normalization interceptor'da mı yapılıyor?
- [ ] Request ID (`X-Request-ID`) her isteğe ekleniyor mu?
- [ ] API versiyon bilgisi merkezi config'den mi yönetiliyor?

## Kaynak
- Data fetching → docs/architecture/10-data-fetching-cache-sync.md
- API client architecture → docs/architecture/10-data-fetching-cache-sync.md (Bölüm 32)
- Data kararı → docs/adr/ADR-005-data-fetching-cache-and-mutation-model.md
