---
id: D-OFL
type: domain
name: Offline Support, Local Storage, Persistence Stratejisi
kaynak-dokümanlar: ADR-019, 10, ADR-005
miras-tipi: yapısal
son-güncelleme: 2026-04-02
---

# D-OFL: Offline & Local Storage Domain Guardrail

## Bu Guardrail Ne Zaman Aktif?
- Offline-first özellik geliştirme (A-OFFLINE)
- Local storage operasyonları (MMKV, AsyncStorage, SecureStore)
- Zustand persistence entegrasyonu
- TanStack Query offline mutation
- Cache stratejisi tasarımı
- Network state management

---

## 1. Storage Katmanları ve Kullanım Kuralları

### 1.1. Güvenli Depolama (Expo SecureStore)
1. [ZORUNLU] Auth token'ları (access token, refresh token) yalnızca SecureStore'da saklanmalı
2. [ZORUNLU] Biometric credential pointer'ları SecureStore'da saklanmalı
3. [ZORUNLU] Encryption key'ler (MMKV encryption key dahil) SecureStore'da saklanmalı
4. [YAPILMAMALI] SecureStore'u genel amaçlı storage olarak kullanma — yalnızca hassas veriler için
5. [YAPILMAMALI] SecureStore'da büyük veri saklama (limit: ~2KB/key iOS, ~4KB/key Android)

### 1.2. Hızlı Key-Value Storage (MMKV)
6. [ZORUNLU] Kullanıcı tercihleri (tema, dil, bildirim ayarları) MMKV'de saklanmalı
7. [ZORUNLU] Zustand persist middleware ile MMKV adapter kullanılmalı (AsyncStorage değil)
8. [ZORUNLU] Hassas olmayan ama sık okunan veriler MMKV'de saklanmalı
9. [YAPILMALI] Kullanıcıya özel MMKV instance'ı oluştur (çoklu kullanıcı desteği için)
10. [YAPILMALI] MMKV encryption'ı hassas tercihler için etkinleştir (AES-256)
11. [YAPILMAMALI] MMKV'ye auth token veya credential saklama — SecureStore kullan
12. [YAPILMAMALI] MMKV'ye 1MB üzeri veri saklama — dosya sistemi veya veritabanı kullan
13. [YAPILMAMALI] AsyncStorage'ı yeni kodda tercih etme — MMKV canonical default'tur

### 1.3. AsyncStorage (Legacy Uyum)
14. [YAPILMALI] AsyncStorage yalnızca legacy kütüphane uyumluluğu gerektiren durumlarda kullanılmalı
15. [YAPILMAMALI] Yeni feature'da AsyncStorage'ı birincil storage olarak seçme

### 1.4. Query Cache (TanStack Query)
16. [ZORUNLU] API response cache'i TanStack Query tarafından yönetilmeli — ayrı storage'a kopyalanmamalı
17. [YAPILMALI] Offline kullanım için gcTime ve staleTime değerlerini uygun şekilde artır
18. [YAPILMALI] Offline mutation queue'u persist et (MMKV veya AsyncStorage adapter ile)
19. [YAPILMAMALI] Query cache'ini manuel olarak storage'a yazmak — TanStack Query persist plugin kullan

---

## 2. Offline Kullanıcı Deneyimi Kuralları

20. [ZORUNLU] Kullanıcı offline olduğunda görsel indicator göster (banner, toast veya status bar badge)
21. [ZORUNLU] Cached data varken beyaz ekran veya tam ekran hata gösterme — stale data göster
22. [ZORUNLU] Offline'da yapılan mutasyonlar queue'lanmalı ve online olunca otomatik sync edilmeli
23. [YAPILMALI] Sync işlemi sırasında kullanıcıya ilerleme göster
24. [YAPILMALI] Conflict durumunda kullanıcıya bilgi ver ve çözüm seçenekleri sun
25. [YAPILMALI] Network durumu değişikliğinde (online → offline, offline → online) kullanıcıyı bilgilendir
26. [YAPILMAMALI] Offline durumda UI'ı tamamen devre dışı bırakma — mümkün olan işlevleri aç
27. [YAPILMAMALI] Sync hatalarını sessizce yutma — kullanıcıya retry seçeneği sun

---

## 3. Persistence ve Cleanup Kuralları

28. [ZORUNLU] Logout'ta tüm kullanıcıya özel persist edilmiş veri temizlenmeli (deterministic cleanup)
29. [ZORUNLU] User switch durumunda önceki kullanıcının cache/persist verisine erişim engellenmelii
30. [YAPILMALI] Persist edilen veri versiyonlanmalı (Zustand persist version field)
31. [YAPILMALI] Schema değişikliğinde migration stratejisi tanımlı olmalı
32. [YAPILMAMALI] Persist edilmiş veriyi sınırsız büyütme — boyut limiti ve temizleme politikası tanımla

---

## 4. Şifreleme ve Güvenlik

33. [ZORUNLU] Auth artefact'ları genel storage'da saklanmamalı (ADR-010 ile uyum)
34. [ZORUNLU] MMKV encryption key SecureStore'da saklanmalı
35. [YAPILMALI] Hassas kullanıcı tercihleri (konum izni, sağlık verisi referansı) MMKV encrypted instance'da saklanmalı
36. [YAPILMAMALI] Encryption key'i hardcode etme veya kaynak kodda bırakma
37. [YAPILMAMALI] Debug/development modda encryption'ı devre dışı bırakıp production'da açmaya güvenme

---

## 5. Platform Farkları

38. [ZORUNLU] Web tarafında localStorage/sessionStorage ile mobile MMKV/SecureStore arasındaki farkları hesaba kat
39. [YAPILMALI] Cross-platform persistence adapter oluştur (platform-agnostic API, platform-specific implementation)
40. [YAPILMAMALI] Web localStorage'a hassas veri saklama (XSS riski)

---

## Kalite Eşikleri
- [MİNİMUM] Offline indicator var
- [MİNİMUM] Cached data gösterimi (beyaz ekran yok)
- [MİNİMUM] Auth artefact'ları SecureStore'da
- [MİNİMUM] Deterministic cleanup (logout/user switch)
- [ÖNERİLEN] MMKV encryption aktif
- [ÖNERİLEN] Offline mutation queue persist
- [ÖNERİLEN] Conflict resolution stratejisi

## Anti-pattern'ler
1. [ZAYIF] AsyncStorage'a auth token yazmak
2. [ZAYIF] Offline durumda beyaz ekran göstermek
3. [ZAYIF] Logout'ta persist verisini temizlememek
4. [ZAYIF] MMKV encryption key'i hardcode etmek
5. [ZAYIF] Query cache'ini ayrı storage'a manuel kopyalamak
6. [ZAYIF] Sync hatalarını sessizce yutmak
7. [ZAYIF] Persist edilmiş veriyi versiyonlamamak
8. [ZAYIF] Platform farklarını göz ardı etmek
9. [ZAYIF] Büyük blob veriyi key-value storage'a yazmak
10. [ZAYIF] Network durumu değişikliğini kullanıcıya bildirmemek

## Kontrol Listesi
- [ ] Storage katmanı doğru seçildi mi? (SecureStore / MMKV / Query Cache)
- [ ] Hassas veri güvenli storage'da mı?
- [ ] Offline indicator var mı?
- [ ] Cached data gösteriliyor mu?
- [ ] Offline mutation queue tanımlı mı?
- [ ] Sync stratejisi ve conflict resolution var mı?
- [ ] Logout cleanup tanımlı mı?
- [ ] Persist version field var mı?
- [ ] MMKV encryption key güvenli mi?
- [ ] Platform farkları hesaba katıldı mı?

## İhlal Durumunda
- Auth artefact'ı güvensiz storage'da → hemen düzelt (blocker)
- Offline'da beyaz ekran → hemen düzelt (blocker)
- Logout'ta veri temizlenmemiş → hemen düzelt (blocker)
- Encryption key hardcoded → hemen düzelt (blocker)
- Offline indicator eksik → düzelt (major)
- Persist versiyonlama eksik → düzelt (major)
- Conflict resolution eksik → düzelt veya gerekçelendir

---

## Offline Sync Conflict Resolution

Offline'da yapılan değişikliklerin online sync sırasında sunucu verisiyle çakışması durumunda uygulanacak stratejiler:

### Strateji Seçim Tablosu

| Veri Türü | Strateji | Açıklama |
|-----------|----------|----------|
| Basit ayarlar (tema, dil) | Last-write-wins | Son yazan kazanır, timestamp karşılaştırması |
| Karmaşık veriler (doküman, form) | Field-level merge | Alan bazlı birleştirme, çakışan alanlar işaretlenir |
| Kritik veriler (sipariş, ödeme) | Conflict UI | Kullanıcıya her iki versiyon gösterilir, seçim yaptırılır |

### Last-Write-Wins (LWW)
- Her veri kaydında `updatedAt` timestamp tutulmalı
- Sync sırasında client ve server timestamp karşılaştırılır
- Daha yeni timestamp kazanır
- [YAPILMALI] Cihaz saati güvenilmez olabilir — server timestamp otoritedir

### Field-Level Merge
- Kayıt düzeyinde değil, alan düzeyinde karşılaştır
- Farklı alanlar değiştiyse otomatik birleştir
- Aynı alan değiştiyse conflict olarak işaretle
- [YAPILMALI] Merge sonucunu kullanıcıya onaylatmayı düşün

### Conflict UI
- [ZORUNLU] Kullanıcıya "Cihaz versiyonu" ve "Sunucu versiyonu" yan yana göster
- [ZORUNLU] "Cihaz versiyonunu kullan", "Sunucu versiyonunu kullan" veya "Birleştir" seçenekleri sun
- [YAPILMALI] Farkları vurgula (diff highlight) — neyin değiştiği net olmalı
- [YAPILMAMALI] Conflict'i sessizce çöz ve kullanıcıyı bilgilendirmeden geç

### Genel Kurallar
1. [ZORUNLU] Çözülemez conflict durumunda server otoritedir — veri kaybını önlemek için client versiyonu yedekle
2. [ZORUNLU] Conflict resolution sonucu loglanmalı — hangi strateji uygulandı, hangi veri kazandı
3. [YAPILMALI] Offline mutation queue'da conflict potansiyeli olan kayıtları işaretle
4. [YAPILMAMALI] Tüm veri türleri için tek strateji (LWW) uygulamak — veri kritikliğine göre strateji seç
5. [YAPILMAMALI] Conflict resolution'ı client-only yapma — sunucu tarafında da doğrulama gerekli

## Kaynak
- ADR-019 — Local Storage & Offline-First Strategy
- ADR-010 — Auth, Session and Secure Storage Baseline
- ADR-005 — Data Fetching, Cache and Mutation Model
- 10-data-fetching-cache-sync.md
- 09-state-management-strategy.md
