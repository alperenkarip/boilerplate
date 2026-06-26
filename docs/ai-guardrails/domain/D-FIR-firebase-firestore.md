---
id: D-FIR
type: domain
name: Firebase, Firestore, Cloud Functions
kaynak-dokümanlar: ADR-020, ADR-021
miras-tipi: zorunlu
son-güncelleme: 2026-06-26
---

# D-FIR: Firebase & Firestore Guardrail

## Canonical Karar (ADR-020 + ADR-021)

Firebase bu boilerplate'in **zorunlu canonical backend ve data platformudur** (ADR-020). Firebase opsiyonel değildir — türetilen tüm projeler Cloud Firestore (database), Cloud Functions (server logic), Cloud Storage, Cloud Scheduler/Tasks ve FCM ile başlar. Auth canonical platformu Firebase Auth'tur (ADR-021).

**En kritik kural — Read/Write Contract:**

- **Yazma (`create` / `update` / `delete`) ve tüm iş mantığı yalnızca Cloud Functions (callable `onCall` veya HTTPS `onRequest`) üzerinden yürür.** Client doğrudan Firestore'a **yazmaz**.
- **Okuma client SDK ile doğrudan Firestore'dan yapılır** (Security Rules korumalı); realtime ihtiyacında `onSnapshot` kullanılır.
- Firestore Security Rules yazma tarafında **varsayılan-reddet** (`allow write: if false`) ile başlar; yazma yetkisi service-account context'inde çalışan Functions'a aittir.
- UI/feature kodu Firebase SDK'sını doğrudan değil; `DataReadPort` (okuma + realtime) ve `FunctionsCallPort` (callable yazma) port'ları üzerinden tüketir. `packages/core` SDK-free kalır; adapter app sınırında (`apps/web` → `firebase` JS SDK, `apps/mobile` → `@react-native-firebase`) yaşar.

> Client okur (Security Rules korumalı, gerektiğinde `onSnapshot`); Functions yazar (callable/HTTPS, tüm iş mantığı). Bu sınır boilerplate'in backend güvenlik modelinin temelidir ve gevşetilemez.

## Bu Guardrail Ne Zaman Aktif?

- Firebase/Firestore işlemi (A-FIREBASE)
- Yeni API/data layer entegrasyonu yapılırken (A-NEW-API) — yeni API öncelikle yeni Cloud Function (callable) demektir
- Auth flow değişikliği (A-AUTH) — auth canonical platformu Firebase Auth (ADR-021)
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

### Security Rules Test Recetesi

28. [ZORUNLU] `@firebase/rules-unit-testing` ile security rules test yazılmalı
29. [ZORUNLU] Her koleksiyon icin minimum 3 test senaryosu zorunlu
30. [YAPILMALI] Asagidaki 5 temel senaryo test edilmeli:
    1. Authenticated kullanici kendi verisini okuyabilir
    2. Authenticated kullanici baskasinin verisini okuyamaz
    3. Unauthenticated kullanici erisimi engellenir
    4. Write kurallari dogru calisir (olusturma, guncelleme, silme ayri)
    5. Veri validasyon kurallari dogru calisir (zorunlu alanlar, tip kontrolleri)
31. [YAPILMALI] CI'da `pnpm test:rules` komutu ile rules testleri otomatik calistirilmali
32. [YAPILMALI] Test ortaminda Firebase Emulator kullanilmali — canli Firestore'a test istegi gonderilmemeli
33. [YAPILMAMALI] Security rules'u test etmeden production'a deploy etme

### Offline Persistence Konfigurasyonu

34. [YAPILMALI] Web'de `enableIndexedDbPersistence` ile offline persistence aktif edilmeli
35. [YAPILMALI] React Native'de native Firestore SDK otomatik offline persistence saglayacagi icin ek konfigurasyona gerek yok — ancak davranis bilinmeli
36. [YAPILMALI] Multi-tab destegi gerekiyorsa `enableMultiTabIndexedDbPersistence` kullanilmali (web)
37. [YAPILMALI] Cache boyutu onerilen: 50MB — asim durumunda eski veriler otomatik temizlenir
38. [YAPILMALI] Offline'da yapilan yazma islemleri mutation queue'da beklemeli (D-DAT cache stratejisi ile koordineli)
39. [YAPILMALI] Cihaz online'a gectiginde queue otomatik sync edilmeli — kullaniciya sync durumu bildirilmeli
40. [YAPILMAMALI] Offline persistence'i varsayilan kabul edip test etmeme — offline senaryolar test edilmeli

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
6. [ZAYIF] Security rules test olmadan deploy — güvenlik açığı riski
7. [ZAYIF] Firebase Emulator yerine canlı Firestore'da test çalıştırma
8. [ZAYIF] Offline persistence konfigüre edilmemiş — offline'da uygulama kullanılamaz
9. [ZAYIF] Offline mutation queue sync durumu kullanıcıya bildirilmiyor

## Kontrol Listesi

- [ ] Koleksiyon isimlendirme kebab-case ve çoğul mu?
- [ ] Doküman yapısı TypeScript/Zod ile tanımlı mı?
- [ ] Security rules yazıldı mı (default deny)?
- [ ] Security rules testleri yazıldı mı (min 3 senaryo/koleksiyon)?
- [ ] `@firebase/rules-unit-testing` kullanılıyor mu?
- [ ] CI'da `pnpm test:rules` çalışıyor mu?
- [ ] Firebase Emulator test ortamında aktif mi?
- [ ] Query'lerde limit ve pagination var mı?
- [ ] Composite index gerekli mi, tanımlı mı?
- [ ] Snapshot listener cleanup yapılıyor mu?
- [ ] Batch/transaction uygun mu?
- [ ] Offline persistence konfigüre edildi mi?
- [ ] Multi-tab desteği gerekli mi, konfigüre edildi mi?
- [ ] Cache boyutu ayarlandı mı (önerilen 50MB)?
- [ ] Offline mutation queue → online sync akışı test edildi mi?

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
