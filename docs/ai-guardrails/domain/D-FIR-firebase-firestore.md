---
id: D-FIR
type: domain
name: Firebase, Firestore, Cloud Functions
kaynak-dokümanlar: yeni alan
miras-tipi: yapısal
son-güncelleme: 2026-04-01
---

# D-FIR: Firebase & Firestore Guardrail

## Bu Guardrail Ne Zaman Aktif?
- Firebase/Firestore işlemi (A-FIREBASE)
- Yeni API/data layer entegrasyonu yapılırken (A-NEW-API)
- Auth flow değişikliği (A-AUTH) — Firebase Auth kullanılıyorsa
- Herhangi bir Firestore koleksiyon/doküman işlemi

## Zorunlu Kurallar

### Veri Modelleme
1. [YAPILMALI] Koleksiyon isimlendirme: kebab-case, çoğul (örn: `user-profiles`, `order-items`)
2. [YAPILMALI] Doküman yapısı önceden Zod/TypeScript interface ile tanımlanmalı
3. [YAPILMALI] Denormalizasyon bilinçli yapılmalı — neden ve nerede dokümente et
4. [YAPILMAMALI] Tek dokümanda 1MB sınırını zorlayan nested yapılar oluşturma
5. [YAPILMAMALI] Sınırsız büyüyecek array field kullanma — subcollection kullan
6. [YAPILMAMALI] İlişkisel veritabanı mantığıyla Firestore modelleme (aşırı join ihtiyacı)

### Güvenlik Kuralları
7. [ZORUNLU] Her koleksiyon için Firestore Security Rules yazılmalı
8. [ZORUNLU] Default deny: `allow read, write: if false;` base'den başla, açıkça izin ver
9. [YAPILMALI] Kullanıcı yalnızca kendi verilerine erişebilmeli (owner-based access)
10. [YAPILMAMALI] `allow read, write: if true;` üretim ortamında ASLA kullanılmamalı
11. [YAPILMAMALI] Client-side'da güvenlik kuralı bypass mekanizması oluşturma

### Query & Indexleme
12. [YAPILMALI] Composite query kullanıyorsan composite index tanımla
13. [YAPILMALI] Query'lerde limit kullan — sınırsız veri çekme
14. [YAPILMAMALI] Client-side filtering ile büyük dataset'leri çekip filtreleme
15. [YAPILMALI] Pagination (cursor-based) uygula — offset kullanma

### Batch & Transaction
16. [YAPILMALI] Birden fazla doküman güncellemesinde batch write veya transaction kullan
17. [YAPILMALI] Batch write sınırını kontrol et (maks 500 operasyon)
18. [YAPILMAMALI] Sıralı tekil write loop'ları ile toplu güncelleme yapma

### Offline & Cache
19. [YAPILMALI] Offline persistence konfigürasyonunu bilinçli yap
20. [YAPILMALI] Cache stratejisini ADR-005 veri erişim modeli ile koordine et
21. [YAPILMAMALI] Firestore cache ve chosen query/cache modelini çakıştırma

### Cloud Functions
22. [YAPILMALI] Cloud Function'larda input validation yap (server-side)
23. [YAPILMALI] Cloud Function timeout ve memory limitlerini ayarla
24. [YAPILMAMALI] Cloud Function'da hassas bilgiyi log'a yazma

### Maliyet Kontrolü
25. [YAPILMALI] Read/write sayısının farkında ol — gereksiz okuma/yazma önle
26. [YAPILMALI] Snapshot listener'ları component unmount'ta temizle
27. [YAPILMAMALI] Her render'da yeni listener oluşturma

## Kalite Eşikleri
- [MİNİMUM] Her koleksiyonda security rules tanımlı
- [MİNİMUM] Default deny kuralı aktif
- [MİNİMUM] Query'lerde limit var
- [ÖNERİLEN] Veri modeli Zod schema ile dokümente

## Anti-pattern'ler
1. [ZAYIF] `allow read, write: if true;` — açık kapı
2. [ZAYIF] Sınırsız `getDocs(collection(db, 'users'))` — tüm kullanıcıları çek
3. [ZAYIF] Array field'ına sınırsız push — dokümant şişmesi
4. [ZAYIF] Her render'da `onSnapshot` yeniden oluşturma
5. [ZAYIF] Client-side'da admin SDK kullanma girişimi

## Kontrol Listesi
- [ ] Koleksiyon isimlendirme kebab-case ve çoğul mu?
- [ ] Doküman yapısı TypeScript/Zod ile tanımlı mı?
- [ ] Security rules yazıldı mı (default deny)?
- [ ] Query'lerde limit ve pagination var mı?
- [ ] Composite index gerekli mi, tanımlı mı?
- [ ] Snapshot listener cleanup yapılıyor mu?
- [ ] Batch/transaction uygun mu?

## İhlal Durumunda
- Security rules eksikliği → hemen yaz (blocker)
- `allow: if true` → hemen düzelt (blocker)
- Veri modeli eksik → Zod schema ekle
- Query optimizasyonu → limit ve pagination ekle

## Kaynak
- Bu alan boilerplate'te yeni tanımlanmıştır
- Data fetching → docs/architecture/10-data-fetching-cache-sync.md
- Security → docs/quality/27-security-and-secrets-baseline.md
- State/cache → docs/architecture/09-state-management-strategy.md
