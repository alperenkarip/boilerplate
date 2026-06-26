---
id: D-DAT
type: domain
name: Data Fetching, Cache, Sync, Mutation
kaynak-dokümanlar: 10, ADR-005, ADR-020, ADR-021
miras-tipi: yapısal
son-güncelleme: 2026-06-26
---

# D-DAT: Data Fetching Guardrail

## Bu Guardrail Ne Zaman Aktif?

- Yeni API entegrasyonu (A-NEW-API)
- Firebase/Firestore işlemi (A-FIREBASE)
- Data layer değişikliği, cache stratejisi

## Zorunlu Kurallar

### Canonical Stack (ADR-020)

1. [ZORUNLU] Veri erişimi Firebase port modeli üzerinden olmalı:
   - **Okuma** = Firestore client SDK doğrudan (`DataReadPort`, Security Rules korumalı, realtime için `onSnapshot`)
   - **Yazma** = Cloud Functions callable (`FunctionsCallPort`) — client doğrudan Firestore'a YAZMAZ
   - TanStack Query 5.x bu portları sarar (read cache + mutation invalidation), SDK'nın yerine geçmez
2. [YAPILMAMALI] Raw fetch/axios ile REST endpoint çağırma — canonical backend Firebase'dir; harici REST yalnızca 3rd-party istisnasıdır (A-NEW-API)

### Query Tasarımı

3. [YAPILMALI] Her query'nin unique key'i olmalı — tutarlı key stratejisi
4. [YAPILMALI] Stale time ve cache time bilinçli ayarlanmalı
5. [YAPILMALI] Error ve loading state'leri her query için handle edilmeli
6. [YAPILMAMALI] Component içinde doğrudan fetch çağrısı yapma — custom hook kullan

### Mutation

7. [ZORUNLU] Mutation'lar (create/update/delete) Cloud Functions callable üzerinden yapılmalı (`FunctionsCallPort`); callable başarıyla döndükten sonra ilgili query invalidation yapılmalı
8. [YAPILMALI] Optimistic update kullanıyorsan rollback mekanizması tanımla — callable hata dönerse geri al
9. [YAPILMAMALI] Mutation başarısız olduğunda kullanıcıyı bilgilendirmeden geçme — callable `HttpsError` kodlarını map et

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

| Kriter                | Infinite Scroll              | Klasik Pagination            | Hybrid                  |
| --------------------- | ---------------------------- | ---------------------------- | ----------------------- |
| Kullanım senaryosu    | Feed, timeline, keşfet       | Tablo, grid, arama sonuçları | Infinite + toplam sayaç |
| Kullanıcı davranışı   | Son öğeye genellikle ulaşmaz | Sayfa atlama ihtiyacı var    | Sayfa atlama + akış     |
| Platform tercihi      | Mobil uygulamalar            | Web dashboard'lar            | Esnek                   |
| SEO ihtiyacı          | Hayır                        | Evet                         | Kısmen                  |
| Toplam sayı gösterimi | Gerekli değil                | Gerekli                      | Gerekli                 |

17. [ZORUNLU] >100 öğe gösteren listelerde React Native tarafında `FlashList` kullanılmalı — `FlatList` performans sorunları yaşatır
18. [YAPILMALI] Infinite scroll'da son sayfa (hasNextPage) kontrolü yapılmalı — gereksiz fetch önlenmeli
19. [YAPILMALI] Pagination'da toplam sayfa sayısı ve mevcut sayfa bilgisi gösterilmeli

### Cache Invalidation Stratejisi Tablosu

20. [YAPILMALI] Veri tipine göre aşağıdaki cache stratejisi uygulanmalı:

| Veri Tipi         | staleTime          | Invalidation Tetikleyici       | Pattern                     |
| ----------------- | ------------------ | ------------------------------ | --------------------------- |
| Kullanıcı profili | 5 dakika           | Profil güncelleme mutation'ı   | Mutation sonrası invalidate |
| Feed / timeline   | 30 saniye          | Pull-to-refresh, yeni paylaşım | Otomatik refetch + manuel   |
| Bildirimler       | 1 dakika           | Push notification, ekran focus | Focus refetch + push        |
| Uygulama ayarları | 10 dakika          | Ayar değişikliği mutation'ı    | Mutation sonrası invalidate |
| Arama sonuçları   | 0 (her zaman taze) | Her yeni arama                 | Yeni query key              |
| Remote config     | 1 saat             | Uygulama ön plana geldiğinde   | Focus refetch               |

21. [YAPILMALI] staleTime değerleri bilinçli ve dokümante edilmeli — varsayılan 0 yerine uygun değer belirle
22. [YAPILMAMALI] Tüm query'lere aynı staleTime uygulamak — veri türüne göre farklılaştır

## Anti-pattern'ler

1. [ZAYIF] `useEffect(() => { fetch(...) }, [])` ile screen-level raw fetch — okuma için `DataReadPort` (Firestore SDK) + TanStack Query kullan
2. [ZAYIF] Her component mount'ta refetch — cache'e güven
3. [ZAYIF] Query key'leri tutarsız — aynı veri için farklı key'ler
4. [ZAYIF] Mutation sonrası invalidation yok — stale data gösterimi
5. [ZAYIF] Tüm hatalara generic "Bir hata oluştu" mesajı
6. [ZAYIF] 500+ öğelik listede `FlatList` kullanma — `FlashList` kullan
7. [ZAYIF] Tüm query'lerde `staleTime: 0` — gereksiz refetch yükü
8. [ZAYIF] Infinite scroll'da `hasNextPage` kontrolü yok — boş sayfa fetch ediliyor

## Kontrol Listesi

- [ ] Veri erişimi port modeline uygun mu? (okuma DataReadPort/Firestore SDK, yazma FunctionsCallPort/callable)
- [ ] Query key tutarlı mı?
- [ ] Error/loading state handle ediliyor mu?
- [ ] Mutation sonrası invalidation var mı?
- [ ] Retry stratejisi tanımlı mı?
- [ ] Liste yöntemi bilinçli seçildi mi (infinite scroll / pagination / hybrid)?
- [ ] > 100 öğe listesinde FlashList kullanılıyor mu (React Native)?
- [ ] staleTime veri tipine uygun ayarlandı mı?
- [ ] Cache invalidation tetikleyicileri tanımlı mı?

### Firebase Port Kuralları

23. [ZORUNLU] Okuma `DataReadPort`, yazma `FunctionsCallPort` üzerinden yapılmalıdır — component veya hook içinde doğrudan Firebase SDK (`firebase` / `@react-native-firebase`) çağrısı YASAK
24. [ZORUNLU] Auth context (ID token) SDK ve callable tarafından otomatik taşınır — manuel token header ekleme yapılmaz; yetki Cloud Functions `context.auth` ile doğrulanır
25. [ZORUNLU] Firebase config (projectId, region vb.) environment variable'dan alınmalıdır — hardcoded değer YASAK
26. [ZORUNLU] Callable çağrılarında timeout tanımlı olmalıdır — `httpsCallable` timeout opsiyonu kullanılır
27. [YAPILMALI] `onSnapshot` listener ve bekleyen callable çağrıları component unmount'ta temizlenmeli (unsubscribe / cancellation)
28. [YAPILMALI] Callable hataları (`HttpsError`) port adapter'ında normalize edilmeli — her catch bloğunda tekrar eden error mapping YASAK
29. [YAPILMAMALI] Raw ID token'ı URL/query parameter olarak veya convenience storage'a yazma (güvenlik riski — D-SEC, ADR-021)
30. [YAPILMAMALI] SDK sürümünü/region'ı feature kodunda hardcode etme — merkezi `packages/core` adapter config'inden alınmalı

## Anti-pattern'ler (Firebase Port)

9. [ZAYIF] Component içinde doğrudan `getFirestore()` / `httpsCallable()` çağrısı — `DataReadPort` / `FunctionsCallPort` kullan
10. [ZAYIF] Client'tan doğrudan `setDoc`/`updateDoc`/`deleteDoc` ile yazma — yazma Cloud Functions callable üzerinden
11. [ZAYIF] Callable çağrısında timeout belirtmemek — timeout politikasına uy
12. [ZAYIF] Her çağrı noktasında aynı `HttpsError` mapping kodunu tekrarlamak — port adapter'ına taşı
13. [ZAYIF] Storage upload işleminde progress göstermemek — kullanıcı belirsizlik yaşar

## Kontrol Listesi (Firebase Port)

- [ ] Okuma `DataReadPort`, yazma `FunctionsCallPort` üzerinden mi yapılıyor?
- [ ] Component/hook içinde doğrudan Firebase SDK çağrısı yok mu?
- [ ] Yazma yalnızca Cloud Functions callable üzerinden mi (client-direct-write yok)?
- [ ] Firebase config ortam değişkeninden mi alınıyor?
- [ ] Callable timeout tanımlı mı?
- [ ] `onSnapshot` unsubscribe ve callable cancellation yapılıyor mu?
- [ ] `HttpsError` normalization port adapter'ında mı yapılıyor?
- [ ] SDK config merkezi `packages/core` adapter'ından mı yönetiliyor?

## Kaynak

- Data fetching → docs/architecture/10-data-fetching-cache-sync.md
- Backend & Data Platform kararı → docs/adr/ADR-020-backend-and-data-platform.md
- Auth kararı → docs/adr/ADR-021-authentication-platform.md
- Data kararı → docs/adr/ADR-005-data-fetching-cache-and-mutation-model.md
