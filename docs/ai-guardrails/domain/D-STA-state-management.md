---
id: D-STA
type: domain
name: State Management
kaynak-dokümanlar: 09, ADR-004
miras-tipi: yapısal
son-güncelleme: 2026-04-02
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

---

## Store Hydration Sırası

Uygulama başlangıcında persist edilen store'ların yüklenme (hydration) sırası:

### Sıralama

| Öncelik | Store | Bağımlılık | Açıklama |
|---------|-------|-----------|----------|
| 1 (en yüksek) | Auth Store | Yok | Token, oturum durumu — diğer tüm store'lar buna bağımlı |
| 2 | Config Store | Auth Store | Remote config, feature flag'ler |
| 3 | User Preferences | Auth Store | Tema, dil, bildirim tercihleri |
| 4 (paralel) | Feature Data Store'ları | Auth + Config | Uygulama verileri, paralel yüklenebilir |

### Kurallar
1. [ZORUNLU] Auth store yüklenmeden API çağrısı yapılmamalı — token hazır olmalı
2. [ZORUNLU] Splash/loading ekranı kritik store'lar (Auth + Config) yüklenene kadar gösterilmeli
3. [ZORUNLU] Hydration timeout: 5 saniye — aşılırsa varsayılan değerlerle devam et
4. [YAPILMALI] Hydration hatası durumunda: Auth store yüklenemezse → logout akışına yönlendir
5. [YAPILMALI] Feature data store'ları paralel yükle — sıralı bekleme gereksiz
6. [YAPILMAMALI] Tüm store'ları sıralı yükleme — bağımsız store'lar paralel olmalı
7. [YAPILMAMALI] Hydration tamamlanmadan kullanıcıyı ana ekrana yönlendirme

### Hata Senaryoları
- Auth store corrupt → Tüm persist temizle, login ekranına yönlendir
- Config store hata → Varsayılan config ile devam, arka planda yeniden dene
- Preferences hata → Varsayılan tema/dil ile devam

---

## Memory Leak Prevention

Zustand store kullanımında bellek sızıntılarını önleme kuralları:

### useEffect Cleanup
```typescript
// Doğru: Cleanup fonksiyonunda unsubscribe
useEffect(() => {
  const unsubscribe = useAuthStore.subscribe((state) => {
    // ...
  });
  return () => unsubscribe(); // cleanup
}, []);
```

### Kurallar
1. [ZORUNLU] `useEffect` içindeki her `subscribe()` çağrısı cleanup fonksiyonunda `unsubscribe` edilmeli
2. [ZORUNLU] Component unmount olduktan sonra `setState` çağrısı yapılmamalı — async işlemlerde `isMounted` guard kullan
3. [YAPILMALI] Selector kullanımında `useShallow` ile shallow comparison uygula — gereksiz re-render ve referans birikmesini önle
4. [YAPILMALI] Global listener'ları hook içinde yönet, store action'ında değil — lifecycle kontrolü hook'ta
5. [YAPILMAMALI] Store subscribe'da closure üzerinden eski state referansı tutma — stale closure riski
6. [YAPILMAMALI] Store'da interval/timeout başlatıp cleanup yapmama

### Anti-pattern (Ek)
- [ZAYIF] `useStore()` selector'süz çağrı — tüm store değişikliğinde re-render
- [ZAYIF] `subscribe()` cleanup'sız — bellek sızıntısı
- [ZAYIF] `setTimeout` içinde `setState` — unmount sonrası hata

### Kontrol
- React DevTools Profiler ile re-render sayısı kontrol et
- Hermes/V8 memory snapshot ile leak tespiti yap

## Kaynak
- State stratejisi → docs/architecture/09-state-management-strategy.md
- State kararı → docs/adr/ADR-004-state-management.md
