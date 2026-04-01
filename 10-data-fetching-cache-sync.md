# 10-data-fetching-cache-sync.md

## Doküman Kimliği

- **Doküman adı:** Data Fetching, Cache and Sync
- **Dosya adı:** `10-data-fetching-cache-sync.md`
- **Doküman türü:** Strategy / data architecture / runtime behavior document
- **Durum:** Accepted
- **Kapsam:** Bu boilerplate kapsamında veri çekme, veri erişim katmanı, cache mantığı, invalidation, revalidation, retry, sync davranışı, optimistic update, offline etkileri, veri şekli dönüşümleri ve istemci-sunucu veri ilişkisinin nasıl yönetileceğini tanımlar.
- **Bağlı olduğu üst dokümanlar:**
  - `00-project-charter.md`
  - `01-working-principles.md`
  - `02-product-platform-philosophy.md`
  - `06-application-architecture.md`
  - `07-module-boundaries-and-code-organization.md`
  - `08-navigation-and-flow-rules.md`
  - `09-state-management-strategy.md`
  - `ADR-005-data-fetching-cache-and-mutation-model.md`
- **Doğrudan etkileyeceği dokümanlar:**
  - `11-forms-inputs-and-validation.md`
  - `12-accessibility-standard.md`
  - `13-performance-standard.md`
  - `14-testing-strategy.md`
  - `15-quality-gates-and-ci-rules.md`
  - `16-tooling-and-governance.md`
  - `17-technology-decision-framework.md`
  - `21-repo-structure-spec.md`
  - `27-security-and-secrets-baseline.md`
  - `28-observability-and-debugging.md`
  - `31-audit-checklist.md`

---

# 1. Amaç

Bu dokümanın amacı, boilerplate kapsamında veri çekme ve veri senkronizasyonunu “API çağrısı yapmak” seviyesinden çıkarıp mimari, cache, doğruluk, dayanıklılık ve kullanıcı deneyimi açısından sistematik hale getirmektir.

Bu belge şu sorulara açık cevap verir:

1. Veri çekme bu projede ne anlama gelir?
2. Data fetching ile state management ilişkisi nasıl kurulmalıdır?
3. Server state, cache ve local state nasıl ayrılmalıdır?
4. Veri erişim katmanı UI’dan nasıl ayrılmalıdır?
5. İstemci hangi veriyi ne kadar süre gerçek kabul eder?
6. Invalidation ve revalidation nasıl düşünülmelidir?
7. Retry, error mapping ve recovery nasıl ele alınmalıdır?
8. Sync problemleri ve offline etkileri nasıl değerlendirilmelidir?
9. Optimistic update ne zaman uygundur, ne zaman risklidir?
10. Hangi veri davranışları doğrudan zayıf kabul edilir?

Bu doküman teknoloji bağımsız karar çerçevesidir.
Yani burada kütüphane adı seçilmez; önce veri davranışı ve mimari standardı tanımlanır.

---

# 2. Neden Bu Doküman Gerekli

Cross-platform uygulamalarda veri katmanı en çok sorun çıkaran alanlardan biridir.
Çünkü çoğu proje aşağıdaki yanlış başlangıçlardan biriyle ilerler:

- component içinden doğrudan fetch yapma,
- fetch sonucunu store’a kopyalayıp asıl veri gibi kullanma,
- server state ile form draft’ı karıştırma,
- tüm veri sorununu global state ile çözmeye çalışma,
- invalidation mantığını netleştirmeden ekranlara refetch dağıtma,
- offline yokmuş gibi ilerleyip sonra patch üretme,
- error mapping’i component’lere dağıtma,
- response shape’i doğrudan UI shape gibi kullanma.

Bunların sonucu şunlardır:

- aynı veri farklı yerlerde farklı sürümlerde yaşar,
- stale veri problemleri artar,
- kullanıcı bir ekranda güncel, diğerinde eski veri görür,
- optimistic update başarısız olduğunda arayüz yalan söyler,
- tekrar eden transform ve error logic her yere dağılır,
- test yazmak zorlaşır,
- performans düşer,
- web ve mobile veri davranışı çelişir.

Bu nedenle data fetching konusu yalnızca “hangi HTTP client?” veya “hangi query kütüphanesi?” problemi değildir.
Asıl problem şudur:

> İstemcinin uzak veriyi hangi mantıkla alacağı, ne kadar süre doğru kabul edeceği, nasıl tazeleyeceği, nasıl göstereceği ve hata/uyuşmazlık durumunda nasıl toparlayacağı.

---

# 3. Temel Tez

Bu proje kapsamında temel tez şudur:

> Veri çekme ve senkronizasyon, UI içinde dağılmış çağrılar topluluğu değil; veri sahipliği, cache ömrü, invalidation, revalidation, hata yönetimi, dönüşüm ve kullanıcı görevleriyle uyumlu senkronizasyon kurallarıyla çalışan ayrı bir mimari disiplindir.

Bu tez şu sonuçları doğurur:

1. Veri erişimi component convenience alanı değildir.
2. Server state ile local app state karıştırılamaz.
3. Cache yalnızca performans için değil, doğruluk ve UX için de önemlidir.
4. Aynı veri için tek otorite mantığı korunmalıdır.
5. Retry ve refetch davranışı rastgele bırakılamaz.
6. Offline ve geç bağlantı etkileri tasarımsal değil, veri katmanı kararıdır.
7. Optimistic update yalnızca “hızlı hissettirmek” için uygulanamaz.

---

# 4. Veri Katmanının Hedefleri

## 4.1. Doğruluk

Kullanıcı mümkün olduğunca doğru veriyi görmelidir.
Doğruluk her zaman “anlık en güncel veri” anlamına gelmez; bazen kontrollü cache daha doğrudur.
Ama veri davranışı tahmin edilebilir olmalıdır.

## 4.2. Tutarlılık

Aynı veri farklı ekranlarda çelişkili görünmemelidir.

## 4.3. Performans

Her ekranda aynı veri için yeniden yeniden çağrı yapmak iyi mimari değildir.
Ama sırf gereksiz çağrı olmasın diye veri çürümesine de izin verilemez.

## 4.4. Dayanıklılık

Bağlantı kesilmesi, geç yanıt, hata, timeout, authorization kaybı, kısmi veri, stale cache gibi durumlar sistematik ele alınmalıdır.

## 4.5. Test edilebilirlik

Fetch, map, invalidate, retry ve sync mantıkları testlenebilir boundary’ler içinde yaşamalıdır.

## 4.6. Cross-platform tutarlılık

Web ve mobile aynı ürün davranışını taşımalıdır.
Farklı runtime olabilir, ama veri kuralları çelişmemelidir.

---

# 5. Temel Kavramlar

Bu dokümanda aşağıdaki kavramlar ayrı ayrı ele alınacaktır:

1. Data source
2. Fetch
3. Cache
4. Freshness
5. Staleness
6. Revalidation
7. Invalidation
8. Sync
9. Mutation
10. Optimistic update
11. Retry
12. Recovery
13. Mapping
14. Normalization
15. Persistence
16. Offline tolerance

Bu kavramlar birbirine karıştırılmamalıdır.

---

# 5.5. API Contract Standardı

## 5.5.1. Nedir?

API Contract, backend API ile frontend arasındaki veri sözleşmesidir. Bu sözleşme şu alanları kapsar:

- İstek formatı (request shape): Frontend'in backend'e göndereceği verinin yapısı, zorunlu ve opsiyonel alanları, veri tipleri.
- Yanıt formatı (response shape): Backend'in frontend'e döneceği verinin yapısı, tutarlı envelope yapısı.
- Hata formatı (error shape): Hata durumlarında dönen yanıtın yapısı, hata kodları ve mesajları.
- Pagination formatı: Sayfalama mekanizmasının nasıl çalıştığı, cursor veya offset mantığı.
- Versiyonlama kuralları: API'nin versiyonlanma stratejisi, breaking change yönetimi.

API Contract, bir "belge" değil, çalışan bir sözleşmedir. Yani sadece bir Confluence sayfasına yazılmaz; kod üretimi yapılabilir, test edilebilir ve her iki taraf tarafından doğrulanabilir bir schema olarak yaşar.

## 5.5.2. Neden gerekli?

Sözleşme olmadan frontend ve backend bağımsız geliştirilemez. Sözleşme yoksa şunlar olur:

- Backend bir alanın adını değiştirir, frontend kırılır ama kimse fark etmez (ta ki kullanıcı hata görene kadar).
- Frontend bir endpoint'in döndüğü veriyi varsayıma dayalı kullanır; backend "o alan artık nullable" dediğinde crash oluşur.
- Her API değişikliğinde "ne kırıldı?" sorusu sorulur ve cevabı bulmak saatler alır.
- Farklı endpoint'ler farklı hata formatları döner; frontend her endpoint için ayrı error handling yazmak zorunda kalır.
- Yeni bir geliştirici projeye dahil olduğunda "bu endpoint ne döner?" sorusunun cevabını bulmak için backend kodunu okumak zorunda kalır.

API Contract ile:

- Frontend ve backend paralel geliştirilebilir (contract-first development).
- Breaking change'ler tespit edilebilir (schema diff).
- Mock API oluşturulabilir (backend hazır olmadan frontend çalışabilir).
- Type safety sağlanabilir (schema'dan otomatik type üretimi).
- Onboarding kolaylaşır (yeni geliştirici schema'ya bakarak endpoint davranışını anlar).

## 5.5.3. API spesifikasyon formatı

REST API için OpenAPI 3.x (eski adıyla Swagger) tercih edilir. GraphQL için ise GraphQL schema zaten doğal olarak bir contract görevi görür.

Kurallar:

- Schema, version control'de (Git) tutulur. Repo içinde `api/` veya `contracts/` gibi bir dizinde yaşar.
- Schema, backend ve frontend'in her ikisi tarafından referans alınır.
- CI pipeline'da schema değişiklikleri kontrol edilir: breaking change varsa uyarı veya blok.
- Schema'dan her iki taraf da kod üretebilir: backend route/controller skeleton, frontend TypeScript type'ları ve client fonksiyonları.

## 5.5.4. Yanıt formatı standardı

Tüm API yanıtları tutarlı bir envelope yapısı kullanmalıdır. Bu envelope, hangi endpoint olursa olsun aynı üst yapıya sahiptir:

```
{
  data: T,
  meta?: {
    page: number,
    totalCount: number,
    nextCursor: string | null
  },
  error?: {
    code: string,
    message: string,
    details?: Array<{ field: string, message: string }>
  }
}
```

Davranış kuralları:

- Başarılı yanıt: `data` alanı dolu, `error` alanı yok (veya null). `meta` alanı yalnızca paginated yanıtlarda bulunur.
- Hata yanıtı: `data` alanı null, `error` alanı dolu. HTTP status code ile `error.code` tutarlı olmalıdır.
- Boş sonuç: `data` boş array `[]` veya `null` döner (endpoint semantiğine bağlı), ama yine de başarılı yanıt formatındadır. Boş sonuç hata değildir.

Bu tutarlılık neden önemlidir:

- Frontend tek bir response parser yazabilir; her endpoint için ayrı parsing mantığı gerekmez.
- Error handling merkezi olabilir; `error.code` varsa hata akışına, yoksa başarı akışına girilir.
- TypeScript generic type'ları kolaylaşır: `ApiResponse<T>` gibi tek bir wrapper type tüm endpoint'leri kapsar.

## 5.5.5. Hata yanıt formatı

Her hata yanıtı şu alanları içermelidir:

- `code` (string, makine-okunur): Hata türünü tanımlar. Örnekler: `"VALIDATION_ERROR"`, `"NOT_FOUND"`, `"UNAUTHORIZED"`, `"FORBIDDEN"`, `"RATE_LIMITED"`, `"INTERNAL_ERROR"`, `"CONFLICT"`, `"SERVICE_UNAVAILABLE"`.
- `message` (string, insan-okunur): Debug ve loglama amacıyla teknik açıklama. Bu mesaj doğrudan kullanıcıya gösterilmez.
- `details` (array, opsiyonel): Field-level hatalar için kullanılır. Her eleman `{ field: "email", message: "Geçersiz email formatı" }` şeklindedir. Form validation hataları bu alanla taşınır.

Frontend'de error mapping:

- Frontend, `error.code` değerine göre kullanıcı-dostu mesaj üretir. Bu mapping merkezi bir dosyada tutulur (ör: `errorMessages.ts`).
- Örnek: `"UNAUTHORIZED"` → "Oturumunuz sona erdi. Lütfen tekrar giriş yapın." / `"RATE_LIMITED"` → "Çok fazla istek gönderildi. Lütfen biraz bekleyin." / `"NOT_FOUND"` → "Aradığınız kayıt bulunamadı."
- Bilinmeyen `code` değerleri için fallback mesaj: "Bir hata oluştu. Lütfen tekrar deneyin."

## 5.5.6. Pagination standardı

Cursor-based pagination tercih edilir. Neden:

- Offset-based pagination'da concurrent insert sorunları vardır: yeni kayıt eklendiğinde sayfa kayması (page drift) olur. Örneğin kullanıcı 2. sayfadayken yeni kayıt eklenirse, 3. sayfaya geçtiğinde bir kaydı iki kez görebilir veya hiç görmeyebilir.
- Cursor-based pagination'da her sayfa bir "referans noktası"na göre çekilir, bu nedenle concurrent değişikliklerden etkilenmez.

Yanıt formatı:

```
{
  data: [...],
  meta: {
    nextCursor: "abc123",
    hasMore: true
  }
}
```

Frontend entegrasyonu (TanStack Query ile):

```
getNextPageParam: (lastPage) => lastPage.meta.hasMore ? lastPage.meta.nextCursor : undefined
```

Kurallar:

- Tüm liste endpoint'leri aynı pagination mekanizmasını kullanmalıdır. Bir endpoint cursor-based, diğeri offset-based olmamalıdır.
- `hasMore` alanı zorunludur; frontend'in "daha fazla var mı?" sorusunun cevabı net olmalıdır.
- İlk sayfa isteğinde cursor gönderilmez; sonraki sayfa isteklerinde bir önceki yanıttaki `nextCursor` gönderilir.
- Sayfa boyutu (limit/pageSize) frontend tarafından belirlenebilir, ama backend maksimum bir üst sınır koymalıdır (ör: max 100).

## 5.5.7. Query key convention

TanStack Query'de tutarlı key yapısı tüm projede aynı mantıkla uygulanmalıdır:

Yapı: `[entity, filters?, id?]`

Örnekler:

- Tüm kullanıcılar: `['users']`
- Filtrelenmiş kullanıcılar: `['users', { role: 'admin', status: 'active' }]`
- Tek kullanıcı: `['users', 123]`
- Kullanıcının siparişleri: `['users', 123, 'orders']`
- Filtrelenmiş siparişler: `['users', 123, 'orders', { status: 'pending' }]`

Neden önemli:

- Tutarlı key yapısı invalidation'ı kolaylaştırır. `queryClient.invalidateQueries({ queryKey: ['users'] })` tüm user query'lerini (liste, tekil, filtrelenmiş) invalidate eder.
- Farklı convention'lar (bir yerde `['user-list']`, başka yerde `['users']`, başka yerde `['getUsers']`) invalidation kaçırmasına neden olur.
- Key yapısı projenin başında belirlenmeli ve bir convention dökümanı veya utility fonksiyonu ile enforce edilmelidir.

Convention kuralları:

- Entity adı her zaman çoğul: `'users'`, `'orders'`, `'products'` (tekil değil).
- Filtreler object olarak ikinci eleman: sıralama, arama, durum filtreleri burada.
- ID her zaman ayrı eleman: `['users', 123]`, `['users', { id: 123 }]` değil.
- İlişkili alt kaynak entity'den sonra gelir: `['users', 123, 'orders']`.

## 5.5.8. Versiyonlama

API versiyonlama, breaking change yapıldığında mevcut client'ların kırılmasını önlemek için zorunludur.

İki yaygın strateji:

1. URL-based versioning: `/api/v1/users`, `/api/v2/users`. Daha görünür, debug'ı kolay, ancak URL'ler uzar.
2. Header-based versioning: `API-Version: 2024-01` header'ı ile. URL temiz kalır, ancak debug sırasında daha az görünür.

Hangisi seçilirse tüm endpoint'lerde tutarlı uygulanmalıdır.

Kurallar:

- Breaking change (alan kaldırma, tip değişikliği, zorunlu alan ekleme) yapıldığında yeni version açılır.
- Non-breaking change (yeni opsiyonel alan ekleme, yeni endpoint) mevcut version içinde yapılabilir.
- Eski version deprecation period'u ile korunur. Deprecation süresi proje ihtiyacına göre belirlenir (ör: minimum 3 ay).
- Deprecated version'a istek atan client'lara `Deprecation` header'ı ile uyarı gönderilir.
- Deprecation period sona erdiğinde eski version kapatılır ve `410 Gone` döner.

## 5.5.9. Type safety

API schema'dan TypeScript type'ları otomatik üretilmelidir.

Araçlar:

- REST API: `openapi-typescript` paketi OpenAPI schema'dan TypeScript type'ları üretir.
- GraphQL: `graphql-codegen` paketi GraphQL schema'dan type'lar ve hook'lar üretir.

Neden manuel type tanımı zayıftır:

- Manuel tanımlanan type'lar zamanla API'den sapabilir (type drift). Backend bir alanı `string`'den `number`'a çevirdiğinde, frontend type'ı güncellenmezse runtime hatası olur ama compile time'da yakalanmaz.
- Otomatik üretimde schema değiştiğinde type'lar da değişir ve uyumsuzluklar derleme zamanında yakalanır.

Kural: Type'lar CI pipeline'da yeniden üretilir ve diff varsa commit edilir. Böylece type'lar her zaman schema ile senkronize kalır.

## 5.5.10. Mock API

Development sırasında backend hazır olmadan çalışabilmek için mock API stratejisi tanımlanmalıdır.

Tercih edilen araç: MSW (Mock Service Worker).

Neden MSW:

- Network seviyesinde intercept yapar; fetch/axios gibi HTTP client değişikliği gerektirmez.
- Aynı mock tanımları hem browser'da hem test ortamında (Node.js) kullanılabilir.
- Gerçek API contract'ına uygun mock data üretmeye zorlar (çünkü request/response formatı gerçekle aynı).

Kurallar:

- Mock data, gerçek API contract'ında tanımlanan response shape'e uygun olmalıdır. Rasgele JSON üretilmemelidir.
- Mock handler'lar bir dizinde toplanır (ör: `mocks/handlers/`).
- Development mode'da mock aktif edilebilir, production'da asla aktif olmaz.
- Mock data gerçekçi olmalıdır: edge case'leri kapsamalı (boş liste, uzun string, null alanlar, hata yanıtları).

## 5.5.11. Hatalı yaklaşımlar

Aşağıdaki yaklaşımlar bu proje kapsamında zayıf kabul edilir:

- API sözleşmesi olmadan "backend ne verirse frontend onu kullanır" mantığı ile çalışmak. Bu yaklaşımda frontend backend'e tamamen bağımlıdır ve her backend değişikliği frontend'i kırar.
- Tutarsız error formatları: Bir endpoint `{ error: "mesaj" }` dönerken diğeri `{ message: "mesaj", status: 400 }` döner. Frontend her endpoint için ayrı error parsing yazmak zorunda kalır.
- Farklı endpoint'lerde farklı pagination mantığı: Bir endpoint offset-based, diğeri cursor-based, üçüncüsü kendi custom mantığını kullanır. Frontend pagination logic'i birleştiremez.
- Query key'leri her yerde farklı yazmak: Bir yerde `['userList']`, başka yerde `['users']`, başka yerde `['get-users']`. Invalidation tutarsızlaşır, stale data sorunları çıkar.
- API schema'yı sadece bir kez yazıp bir daha güncellememek. Schema eskir, gerçek API ile uyuşmaz hale gelir, güven kaybeder ve kimse bakmaz.
- Type'ları manuel tanımlayıp schema ile senkronizasyonu kontrol etmemek. Type drift kaçınılmaz olur.

---

# 6. Data Source Kavramı

## 6.1. Data source nedir?

Data source, verinin asıl geldiği veya yazıldığı kaynaktır.

Örnek:
- remote API
- realtime source
- local device storage
- secure storage
- indexed client persistence
- feature draft storage
- in-memory cache

## 6.2. Neden önemli?

Çünkü her source aynı davranışı gerektirmez.
Örneğin:
- remote authoritative source farklı,
- local preference storage farklı,
- draft persistence farklı,
- offline queue farklıdır.

## 6.3. Kural

Data source davranışları türüne göre ayrılmalıdır.
Hepsi “fetch” diye düşünülmemelidir.

---

# 7. Fetch Kavramı

## 7.1. Fetch nedir?

Fetch, uzak veya farklı kaynaktan veri alma sürecidir.
Ama bu yalnızca network isteği demek değildir.
Aşağıdaki aşamaları içerebilir:

- request preparation
- auth/session binding
- request execution
- timeout handling
- response parsing
- error normalization
- data mapping
- cache insertion
- freshness marking
- UI consumption

## 7.2. Kural

Fetch süreci component içinde tek bir `await` satırına indirgenmemelidir.
Çünkü gerçek problem çağrı yapmak değil, çağrının yaşam döngüsünü yönetmektir.

## 7.3. Zayıf fetch davranışları

- ekran mount olunca doğrudan ad-hoc fetch,
- response’u parse etmeden UI’ya basmak,
- her ekranın kendi fetch mantığını yazması,
- loading/error davranışını her component’in kendisinin icat etmesi.

---

# 8. Cache Kavramı

## 8.1. Cache nedir?

Cache, uzak verinin istemci tarafında kontrollü geçici temsilidir.

## 8.2. Cache neden vardır?

Sadece hız için değil.
Şunlar için vardır:
- tekrar çağrıyı azaltmak,
- geçici süreyle veri erişimini kolaylaştırmak,
- UI tutarlılığı sağlamak,
- refetch davranışını yönetmek,
- stale/fresh geçişlerini kontrol etmek.

## 8.3. Cache ne değildir?

- asıl veri kaynağı değildir,
- rastgele local kopya değildir,
- “bir kere geldiyse store’a basalım” mantığı değildir.

## 8.4. Kural

Cache davranışı tanımsız bırakılamaz.
Aşağıdakiler net olmalıdır:
- ne cache’lenir,
- ne kadar süre geçerli sayılır,
- ne zaman stale olur,
- ne zaman invalid olur,
- ne zaman yeniden çekilir,
- mutation sonrası nasıl güncellenir.

---

# 9. Freshness ve Staleness

## 9.1. Freshness nedir?

Verinin istemci tarafında hâlâ güvenilir ölçüde güncel sayılması durumudur.

## 9.2. Staleness nedir?

Verinin var olduğu ama yeniden doğrulanması gerekebileceği durumdur.

## 9.3. Neden önemli?

Çünkü veri iki uç arasında kalır:
- ya her seferinde ağ çağrısı yaparsın,
- ya da gelen her şeyi sonsuza kadar doğru sanarsın.

İkisi de zayıftır.

## 9.4. Kural

Her önemli veri tipi için şu düşünülmelidir:
- bu veri ne kadar hızlı değişir?
- kullanıcı stale görürse risk ne?
- yeniden çekme maliyeti ne?
- aynı anda birden fazla ekran bunu kullanıyor mu?

Bu sorular cache freshness kararını belirler.

## 9.5. Zayıf yaklaşım

- tüm veriler için aynı cache ömrü,
- değişken veri ile sabit veri için aynı mantık,
- stale kavramını hiç düşünmeden refetch davranışı belirlemek.

---

# 10. Invalidation

## 10.1. Tanım

Invalidation, eldeki cache verisinin artık güvenilir kabul edilmemesi ve yenilenmesi gerektiğinin işaretlenmesidir.

## 10.2. Neden kritik?

Mutation sonrası en sık hata burada yapılır.
Örneğin:
- kayıt güncellenir ama liste stale kalır,
- detay güncellenir ama summary kart eski görünür,
- bir ekranda silinir, başka ekranda hâlâ görünür.

## 10.3. Kural

Mutation olan her alan için şu sorular sorulmalıdır:
- hangi cache’ler etkilenir?
- hangi listeler yeniden doğrulanmalı?
- hangi detay kayıtları güncellenmeli?
- local optimistic data rollback gerektirir mi?

## 10.4. Zayıf invalidation davranışları

- mutation sonrası tüm app’i refetch etmek,
- mutation sonrası hiçbir şeyi invalidate etmemek,
- yalnızca mevcut ekranı güncelleyip diğer yüzeyleri unutmak,
- invalidation kuralını component içine gömmek.

---

# 11. Revalidation

## 11.1. Tanım

Revalidation, eldeki veriyi tamamen yok etmeden arka planda veya kontrollü biçimde yeniden doğrulama sürecidir.

## 11.2. Nerede faydalıdır?

- ekran revisit
- app foreground’a dönüş
- network geri gelince
- belirli zaman aralıklarında
- kullanıcı tetikli refresh
- stale veri kullanımından sonra sessiz doğrulama

## 11.3. Kural

Revalidation davranışı kullanıcı deneyimiyle uyumlu olmalıdır.
Her doğrulama loading spinner üretmek zorunda değildir.

## 11.4. Zayıf revalidation davranışları

- her odak değişiminde kullanıcıyı sürekli loading’e sokmak,
- sessiz revalidation gereken yerde tam ekran blokaj yaratmak,
- stale veriyi hiç doğrulamamak.

---

# 12. Mutation

## 12.1. Tanım

Mutation, veri kaynağını değiştiren işlemdir.

Örnek:
- create
- update
- delete
- archive
- reorder
- toggle
- confirm / approve
- submit

## 12.2. Mutation neden ayrı önemlidir?

Çünkü mutation şu alanları tetikler:
- optimistic UI ihtiyacı
- rollback ihtiyacı
- invalidation
- local feedback
- retry mantığı
- idempotency soruları
- duplicate submission riski

## 12.3. Kural

Mutation yalnızca “POST atmak” değildir.
Şu davranışlarla birlikte düşünülmelidir:
- kullanıcı ne görüyor?
- başarı ne zaman kesin?
- hata gelirse ne olacak?
- cache nasıl etkileniyor?
- form state nasıl değişiyor?
- navigation sonrası bağlam ne olacak?

---

# 13. Optimistic Update

## 13.1. Neden vardır?

Kullanıcının yaptığı eylemin etkisini gecikmesiz hissettirmek için.

## 13.2. Ne zaman uygundur?

Aşağıdaki durumlarda daha anlamlıdır:
- işlem yüksek olasılıkla başarılıysa,
- rollback mantığı açıksa,
- kullanıcı beklemeyi olumsuz algılıyorsa,
- veri modeli basitse,
- başarısızlık toparlanabilirse.

## 13.3. Ne zaman risklidir?

- ağır domain kuralı varsa,
- server tarafı ciddi doğrulama yapıyorsa,
- çakışma olasılığı yüksekse,
- rollback kullanıcıyı yanıltacaksa,
- mutation zinciri karmaşıksa.

## 13.4. Kural

Optimistic update varsayılan UX sihri değildir.
Ürün ve veri riski üzerinden karar verilmelidir.

## 13.5. Zayıf optimistic davranışlar

- rollback’siz optimistic update,
- başarısızlık sonrası kullanıcıya eski hâli anlatamamak,
- optimistic update yüzünden liste ve detayın çelişmesi,
- local başarıyı gerçek başarı gibi pazarlamak.

---

# 14. Retry Politikası

## 14.1. Retry neden düşünülmeli?

Her hata aynı değildir.
Bazıları:
- geçici ağ sorunu,
- timeout,
- rate limit,
- yetki kaybı,
- validation hatası,
- sunucu mantık hatası olabilir.

Bunların hepsine aynı retry davranışı uygulanamaz.

## 14.2. Kural

Retry kararları hata türüne göre farklılaşmalıdır.

### Örnek mantık
- ağ kesildi: yeniden deneme mantıklı olabilir
- validation hatası: otomatik retry anlamsızdır
- unauthorized: session recovery gerekir
- timeout: kontrollü retry değerlendirilebilir
- destructive mutation duplicate risk taşıyorsa dikkat gerekir

## 14.3. Zayıf retry davranışları

- her hatada kör retry,
- kullanıcıyı otomatik deneme döngüsüne sokmak,
- retry sırasında duplicate action riski yaratmak,
- retry durumunu kullanıcıya anlatmamak.

---

# 15. Error Mapping

## 15.1. Tanım

Error mapping, teknik hata bilgisini ürün diline ve kullanıcı görevine uygun şekilde yorumlamaktır.

## 15.2. Neden ayrı ele alınmalı?

Çünkü:
- raw HTTP error kullanıcı dili değildir,
- exception message ürün message’ı değildir,
- aynı teknik hata farklı bağlamlarda farklı kullanıcı etkisi taşıyabilir.

## 15.3. Katmanlar

- transport error
- auth/session error
- domain validation error
- recoverable transient error
- fatal / blocking error
- user-visible message layer

## 15.4. Kural

Error mapping component içine dağılmamalıdır.
Merkezi ve anlamlı bir seviyede ele alınmalıdır.

## 15.5. Zayıf error davranışları

- backend hata string’ini direkt göstermek,
- her ekranda kendi hata cümlesini uydurmak,
- retry edilebilir hata ile kalıcı hata ayrımını yapmamak,
- validation error ile system failure’ı aynı şekilde göstermek.

---

# 16. Data Mapping ve Shape Dönüşümü

## 16.1. Neden gerekli?

Remote veri çoğu zaman UI’da kullanılacak şekliyle gelmez.
Ayrıca:
- transport shape
- domain shape
- display shape
- form shape
farklı olabilir.

## 16.2. Kural

Veri dönüşümü kontrollü katmanlarda yapılmalıdır.
Şunlar component içine dağılmamalıdır:
- raw response parsing,
- domain conversion,
- display-specific normalization,
- fallback value kurguları.

## 16.3. Zayıf yaklaşım

- her ekranda aynı mapper’ı tekrar yazmak,
- API çıktısını doğrudan component props yapmak,
- null/undefined fallback’leri ekran ekran çözmek,
- UI mantığını server shape’e bağımlı kılmak.

---

# 17. Normalization

## 17.1. Tanım

Normalization, veriyi istemci tarafında daha tutarlı ve tekrar kullanılabilir forma dönüştürme yaklaşımıdır.

## 17.2. Her zaman gerekli midir?

Hayır.
Aşırı normalization da gereksiz karmaşa olabilir.

## 17.3. Ne zaman düşünülmeli?

- aynı entity çok yerde kullanılıyorsa,
- liste/detay eşzamanlı güncellik önemliyse,
- ilişkili veri yapıları büyükse,
- cache invalidation karmaşıklaşıyorsa.

## 17.4. Zayıf davranışlar

- çok basit veri için aşırı entity store kurmak,
- tam tersi, karmaşık ilişkili veri için hiçbir normalization düşünmemek,
- UI ihtiyaçları ile domain normalization’ı karıştırmak.

---

# 18. Sync Kavramı

## 18.1. Sync nedir?

Sync, istemci ile veri kaynağı arasında tutarlılığı koruma sürecidir.

Bu yalnızca fetch etmek değildir.
Şunları da kapsar:
- local değişiklikleri yansıtma
- remote değişiklikleri alma
- stale veriyi yenileme
- conflict çözümü
- offline queue boşaltma
- retry sonrası durumu eşitleme

## 18.2. Kural

Sync ihtiyacı ürün düzeyinde değerlendirilmelidir.
Her ürün aynı sync zorluğunu taşımaz.

## 18.3. Sync türleri

- request-response sync
- background refresh
- focus revalidation
- reconnect sync
- mutation-driven sync
- offline replay sync

---

# 18.5. Gerçek Zamanlı Veri Stratejisi

## 18.5.1. Nedir?

Gerçek zamanlı veri (real-time data), sunucu tarafında bir değişiklik olduğunda client'ın bu değişikliği anında veya çok kısa sürede (milisaniyeler veya birkaç saniye içinde) almasıdır.

Klasik request-response modelinde client sunucuya "yeni veri var mı?" diye sorar. Gerçek zamanlı modelde ise sunucu client'a "yeni veri geldi" der. Bu fark, kullanıcı deneyimini temelden değiştirir: kullanıcı sayfayı yenilemeden, butona basmadan güncel veriyi görür.

Örnekler:

- Bir chat uygulamasında karşı tarafın mesajı anında görünür.
- Bir dashboard'da metrik değeri değiştiğinde grafik anında güncellenir.
- Bir collaborative editing aracında diğer kullanıcının yazdığı metin anlık olarak yansır.
- Bir bildirim sistemi yeni bildirimi anında gösterir.
- Bir canlı skor uygulamasında skor değiştiğinde anında güncellenir.

## 18.5.2. Mekanizma seçenekleri

### 18.5.2.1. WebSocket

WebSocket, client ile server arasında kalıcı, çift yönlü (bidirectional) bir TCP bağlantısı kurar. Bağlantı bir kez kurulduktan sonra her iki taraf da istedikleri zaman mesaj gönderebilir.

Teknik özellikler:

- HTTP handshake ile başlar, sonra WebSocket protokolüne upgrade olur.
- Bağlantı açık kaldığı sürece her iki taraf da istediği zaman veri gönderebilir.
- Overhead düşüktür: HTTP header'ları her mesajda tekrar gönderilmez.
- Binary ve text data destekler.

Ne zaman kullanılır:

- Chat uygulamaları (anlık mesajlaşma).
- Live collaboration (aynı anda aynı belgede çalışma).
- Real-time dashboard (sürekli güncellenen metrikler).
- Multiplayer oyunlar.
- Client'ın da sunucuya anlık mesaj göndermesi gereken durumlar (çift yönlü iletişim gerektiğinde).

Ne zaman kullanılmamalı:

- Yalnızca sunucudan client'a veri akışı yeterliyse (SSE daha basit).
- Güncelleme sıklığı düşükse (polling yeterli).
- Altyapı WebSocket desteklemiyorsa (bazı proxy/firewall'lar WebSocket'i engelleyebilir).

### 18.5.2.2. Server-Sent Events (SSE)

SSE, sunucudan client'a tek yönlü (unidirectional) veri akışı sağlar. Standart HTTP üzerinden çalışır.

Teknik özellikler:

- Client bir HTTP isteği açar ve bu istek açık kalır (long-lived connection).
- Sunucu bu bağlantı üzerinden istediği zaman event gönderir.
- Otomatik reconnection desteği vardır (tarayıcı bağlantı koptuğunda otomatik yeniden bağlanır).
- `Last-Event-ID` header'ı ile kaçırılan event'ları alma desteği vardır.
- Sadece text data destekler (binary için uygun değil).

Ne zaman kullanılır:

- Bildirimler (sunucu yeni bildirim gönderir, client dinler).
- Feed güncellemeleri (yeni post, yeni yorum).
- Canlı skor, hava durumu gibi tek yönlü güncellemeler.
- Log streaming, build progress gibi akışlar.

Ne zaman kullanılmamalı:

- Client'ın da sunucuya anlık mesaj göndermesi gerekiyorsa (SSE tek yönlüdür).
- Binary data akışı gerekiyorsa.
- Çok yüksek frekansta mesaj gerekiyorsa (SSE overhead'ı WebSocket'ten fazladır).

### 18.5.2.3. Polling

Polling, client'ın belirli aralıklarla sunucuya istek göndererek "yeni veri var mı?" diye sormasıdır. En basit ama en verimsiz yaklaşımdır.

İki türü vardır:

1. Regular polling: Sabit aralıklarla istek (ör: her 30 saniyede bir). Basit, öngörülebilir, ama verimsiz (çoğu istek "değişiklik yok" yanıtı alır).
2. Long polling: Client istek gönderir, sunucu yeni veri olana kadar yanıt vermez. Veri gelince yanıt verir, client hemen yeni istek açar. Daha verimli ama sunucu tarafında bağlantı yönetimi gerektirir.

Ne zaman kullanılır:

- Nadir güncelleme gerektiren durumlar (ör: 30 saniyede bir ayarları kontrol etme).
- Altyapı kısıtlamaları nedeniyle WebSocket/SSE kullanılamadığında.
- Basitliğin öncelikli olduğu durumlarda.

TanStack Query ile polling:

```
useQuery({
  queryKey: ['notifications'],
  queryFn: fetchNotifications,
  refetchInterval: 30000, // 30 saniyede bir
  refetchIntervalInBackground: false // tab arka plandayken polling durur
})
```

## 18.5.3. Karar matrisi

Hangi mekanizmanın ne zaman seçileceği:

- Chat, collaboration, real-time editing → WebSocket. Çift yönlü, düşük latency gerektirir.
- Bildirimler, feed güncellemeleri, canlı skor → SSE. Tek yönlü akış yeterlidir, daha basit altyapı.
- Nadir güncelleme, durum kontrolü → Polling (veya TanStack Query `refetchInterval`). En basit, altyapı gerektirmez.

Bu projede varsayılan strateji:

- TanStack Query `refetchInterval` + focus revalidation (ekrana dönüşte otomatik yenileme). Bu çoğu senaryo için yeterlidir.
- WebSocket veya SSE yalnızca gerçek real-time gereksinimi kanıtlandığında eklenir.
- "Olur da lazım olur" diye projenin başında WebSocket altyapısı kurulmaz. İhtiyaç ortaya çıktığında eklenir.

## 18.5.4. Bağlantı yaşam döngüsü (lifecycle)

WebSocket veya SSE kullanıldığında bağlantının yaşam döngüsü sistematik yönetilmelidir:

1. **Connect**: Bağlantı açılır. URL ve protokol belirlenir.
2. **Authenticate**: Bağlantı kurulduktan sonra kimlik doğrulama yapılır. Token veya session bilgisi gönderilir. Sunucu doğrulamazsa bağlantı kapatılır.
3. **Subscribe**: Client hangi "kanal" veya "topic"leri dinlemek istediğini bildirir (ör: `room:123`, `user:456:notifications`).
4. **Receive**: Sunucudan event'lar alınır, ilgili handler'lar çalıştırılır, cache güncellenir.
5. **Reconnect**: Bağlantı koptuğunda otomatik yeniden bağlanma başlar (detayları aşağıda).
6. **Disconnect**: Uygulama kapandığında, kullanıcı çıkış yaptığında veya app background'a geçtiğinde bağlantı kontrollü kapatılır.

Her aşamada hata olabilir ve her hata için davranış tanımlı olmalıdır:

- Connect hatası: Sunucu ulaşılamaz → reconnect akışına gir.
- Auth hatası: Token geçersiz → session yenile, yeni token ile tekrar bağlan.
- Subscribe hatası: İzin yetersiz → kullanıcıya bildir, o kanal'ı dinlemeyi bırak.

## 18.5.5. Reconnection stratejisi

Bağlantı koptuğunda (ağ sorunu, sunucu restart, timeout) otomatik reconnect mekanizması zorunludur. Manuel reconnect kullanıcıya bırakılmamalıdır.

Exponential backoff ile reconnect:

- 1. deneme: 1 saniye sonra.
- 2. deneme: 2 saniye sonra.
- 3. deneme: 4 saniye sonra.
- 4. deneme: 8 saniye sonra.
- 5. deneme: 16 saniye sonra.
- Sonraki denemeler: Maksimum 30 saniye aralıkla.

Jitter eklenmesi önerilir: Her backoff süresine rastgele ±%20 eklenir. Bu, sunucu restart sonrası tüm client'ların aynı anda reconnect etmesini (thundering herd) önler.

Kaçırılan mesajları alma: Her reconnect'te client, son aldığı event'ın ID'sini veya timestamp'ini sunucuya gönderir. Sunucu bu noktadan sonraki mesajları tekrar iletir. Bu mekanizma yoksa reconnect sonrası veri kaybı yaşanır.

Kullanıcı bildirimi: Bağlantı koptuğunda kullanıcıya hafif bir banner gösterilir: "Bağlantı koptu, yeniden bağlanılıyor..." Reconnect başarılı olduğunda banner kaybolur.

Maksimum deneme sayısı: Belirlenen sayıda (ör: 10) başarısız denemeden sonra otomatik reconnect durur ve kullanıcıya "Bağlantı kurulamıyor. Tekrar denemek için tıklayın." mesajı + buton gösterilir.

## 18.5.6. Cache entegrasyonu

WebSocket veya SSE'den gelen veri, TanStack Query cache'i ile entegre çalışmalıdır. Aksi takdirde aynı veri iki farklı yerde yaşar (query cache + WebSocket state) ve tutarsızlık kaçınılmaz olur.

Entegrasyon yöntemi:

- WebSocket'ten gelen veri `queryClient.setQueryData` ile doğrudan ilgili query'nin cache'ine yazılır.
- Böylece o query'yi kullanan tüm component'ler otomatik olarak güncellenir (TanStack Query'nin reactivity'si sayesinde).
- Ayrı bir WebSocket state store'u tutulmaz.

Örnek akış:

1. Kullanıcı `['messages', roomId]` query'si ile mesajları çeker.
2. WebSocket üzerinden yeni mesaj gelir.
3. `queryClient.setQueryData(['messages', roomId], (old) => [...old, newMessage])` ile cache güncellenir.
4. Mesaj listesini gösteren component otomatik re-render olur.

Bu yaklaşımın avantajı:

- Tek kaynak (single source of truth): Tüm veri TanStack Query cache'inde yaşar.
- Duplicate state yok: Ayrı bir "messages" state'i tutmaya gerek kalmaz.
- Mevcut query logic'leri (loading, error, refetch) aynen çalışır.
- Optimistic update ve invalidation mekanizmaları WebSocket verisiyle uyumludur.

## 18.5.7. Mobile'da battery ve performans

WebSocket bağlantısı mobile cihazlarda battery drain (pil tüketimi) üretir. Sürekli açık TCP bağlantısı, cihazın uyku moduna geçmesini engeller ve arka planda enerji tüketir.

Kurallar:

- App background'a geçtiğinde: WebSocket bağlantısı kapatılmalı veya heartbeat (ping/pong) sıklığı ciddi ölçüde azaltılmalıdır (ör: 15 saniyeden 60 saniyeye).
- App foreground'a döndüğünde: Bağlantı yeniden kurulur. Reconnect sırasında kaçırılan mesajlar "last event ID" ile alınır.
- Push notification entegrasyonu: App background'dayken kritik güncellemeler (yeni mesaj, acil bildirim) push notification ile gönderilir. Kullanıcı push'a tıklayınca app açılır, WebSocket bağlanır, tam veri senkronize edilir.
- Battery-aware davranış: Cihaz düşük battery modundayken (ör: %20 altı) real-time bağlantı tamamen kapatılıp polling'e geçilebilir.

React Native'de lifecycle:

- `AppState.addEventListener('change', ...)` ile app state değişikliği dinlenir.
- `active` → WebSocket aç, `background` → WebSocket kapat veya heartbeat azalt.

## 18.5.8. Güvenlik

WebSocket bağlantısı mutlaka authenticate edilmelidir. Unauthenticated WebSocket bağlantısı açılmamalıdır.

Kurallar:

- Bağlantı kurulurken token gönderilmelidir. İki yöntem: URL query parameter (`wss://api.example.com/ws?token=xyz`) veya bağlantı kurulduktan hemen sonra ilk mesaj olarak auth mesajı gönderme. Query parameter yöntemi loglarda token sızma riski taşır; mümkünse auth mesajı yöntemi tercih edilir.
- Sunucu token'ı doğrulamalı, geçersizse bağlantıyı hemen kapatmalıdır.
- Token süresi dolduğunda sunucu client'a "auth expired" mesajı gönderir. Client token'ı yeniler ve yeniden authenticate olur.
- Her subscription isteği yetkilendirme kontrolünden geçmelidir. Kullanıcı yalnızca yetkili olduğu kanal/topic'leri dinleyebilir.
- TLS zorunludur: `wss://` (WebSocket Secure) kullanılmalı, `ws://` (plain) kullanılmamalıdır. Production'da plain WebSocket kabul edilemez.
- Rate limiting: Sunucu, client'ın gönderebileceği mesaj sayısını sınırlamalıdır (ör: saniyede max 10 mesaj). Bu, kötü amaçlı veya hatalı client'ların sunucuyu boğmasını önler.

## 18.5.9. Hatalı yaklaşımlar

Aşağıdaki yaklaşımlar bu proje kapsamında zayıf kabul edilir:

- Her feature için ayrı WebSocket bağlantısı açmak. Bir uygulama içinde chat için bir, bildirim için bir, dashboard için bir WebSocket açmak kaynak israfıdır. Tek bağlantı üzerinden multiplexing (kanal/topic bazlı mesajlaşma) yapılmalıdır.
- Reconnection stratejisi olmadan WebSocket kullanmak. Bağlantı kesildiğinde kullanıcı "sayfayı yenile" demek zorunda kalır. Bu kabul edilemez.
- Mobile'da app background'a geçtiğinde WebSocket'i açık bırakmak. Pil tüketimi artar, kullanıcı şikayet eder, app store review'larda düşük puan alınır.
- WebSocket verisini TanStack Query cache ile senkronize etmemek. İki farklı state yaşar, biri stale diğeri güncel olabilir. Kullanıcı tutarsız veri görür.
- Her şeyi WebSocket üzerinden yapmaya çalışmak. Normal CRUD operasyonları REST API üzerinden yapılmalıdır. WebSocket sadece real-time event akışı içindir.
- Token doğrulaması yapmadan WebSocket bağlantısını kabul etmek. Güvenlik açığı oluşturur; yetkisiz kullanıcılar veri akışını dinleyebilir.

---

# 19. Conflict Yönetimi

## 19.1. Neden önemlidir?

Bir veri hem local hem remote değişebilir.
Özellikle:
- uzun süren edit akışları,
- offline senaryolar,
- aynı kaydın çok yerde güncellenmesi,
- çok kullanıcılı sistemler
conflict riski doğurur.

## 19.2. Boilerplate seviyesi yaklaşımı

Boilerplate her ürün için tam conflict çözüm sistemi kurmak zorunda değildir.
Ama şu soruyu görünür kılmalıdır:
> Bu ürün tipinde conflict olursa mimari bunu taşıyabilir mi?

## 19.3. Zayıf yaklaşım

- conflict ihtimalini hiç düşünmemek,
- son yazan kazanır mantığını sessizce varsaymak,
- form draft ile remote update çarpışmasını yok saymak.

## 19.4. Kısmi Senkronizasyon Hatası (Partial Sync Failure)

### 19.4.1. Nedir?

Kısmi senkronizasyon hatası, birden fazla değişikliğin sunucuya gönderildiği durumda bazılarının başarılı, bazılarının başarısız olmasıdır.

Somut örnek: Kullanıcı offline'dayken 5 item güncelledi. Uygulama online olduğunda bu 5 değişikliği sunucuya gönderir. Sunucu 3'ünü kabul eder, 2'sini reddeder (ör: biri conflict yüzünden, biri validation hatası yüzünden). Bu durumda uygulama nasıl davranmalıdır?

Başka bir örnek: Kullanıcı bir toplu işlem yapıyor (ör: 10 dosyayı aynı anda yükleme). 7'si başarılı yüklenir, 3'ü ağ hatası nedeniyle başarısız olur. Kullanıcı hangi dosyaların yüklenip hangilerinin yüklenmediğini bilmek ister.

Bu senaryo sanıldığından daha sık yaşanır ve ele alınmazsa kullanıcı güvenini ciddi şekilde zedeler.

### 19.4.2. Kurallar

#### Kural 1: Atomicity tercihi

Mümkünse tüm değişiklikler tek bir batch olarak gönderilir ve all-or-nothing mantığı uygulanır:

- Backend destekliyorsa transaction semantiği kullanılır. Ya hepsi başarılı olur, ya hiçbiri olmaz.
- Bu yaklaşım partial failure sorununu tamamen ortadan kaldırır.
- Backend'e tek bir istek gider: `POST /api/batch` body'sinde tüm değişiklikler yer alır.
- Backend bu isteği tek bir transaction içinde işler. Herhangi birinde hata olursa tümünü rollback eder.
- Frontend'e ya tam başarı yanıtı ya da tam hata yanıtı döner.

Ne zaman uygulanabilir: Backend transaction desteği sunduğunda, tüm değişiklikler aynı domain'e ait olduğunda, item'lar arası bağımlılık olduğunda (ör: order + order items birlikte kaydedilmeli).

Ne zaman uygulanamaz: Item'lar bağımsız ve farklı servislerden geçiyorsa, backend batch/transaction desteği yoksa, bazı item'ların başarılı olması diğerlerinin başarısız olmasından daha iyi bir sonuçsa.

#### Kural 2: Atomicity mümkün değilse partial success kabul edilir

Atomicity sağlanamıyorsa şu kurallar uygulanır:

- Başarılı item'lar sunucu tarafında commit edilir ve local cache güncellenir.
- Başarısız item'lar retry queue'ya (yeniden deneme kuyruğuna) alınır.
- Kullanıcıya net ve anlaşılır bilgi verilir. Belirsiz "bir hata oluştu" mesajı yerine: "5 değişiklikten 3'ü kaydedildi. 2 değişiklik tekrar denenecek."
- Mesajda hangi item'ların başarılı, hangilerinin başarısız olduğu görünür olmalıdır (mümkünse item adı veya tanımlayıcısı ile).

Örnek bildirim formatı:

```
Başarılı: "Proje adı güncelleme", "Açıklama güncelleme", "Durum değişikliği"
Başarısız: "Dosya yükleme" (dosya çok büyük), "Etiket güncelleme" (sunucu hatası)
→ Başarısız işlemler otomatik olarak tekrar denenecek.
```

#### Kural 3: Başarısız item'ların retry mekanizması

Başarısız item'lar şu kurallara göre yeniden denenir:

- Maksimum retry sayısı: 3.
- Her retry arasında exponential backoff uygulanır: 1. retry 1 saniye sonra, 2. retry 2 saniye sonra, 3. retry 4 saniye sonra.
- Her retry'da başarı/başarısızlık kontrol edilir. Başarılı olan item retry queue'dan çıkarılır.
- 3 retry sonrası hâlâ başarısızsa otomatik retry durur.
- Kullanıcıya mesaj gösterilir: "Bu değişiklikler kaydedilemedi. Manuel olarak tekrar denemek için butona tıklayın."
- Mesajın yanında "Tekrar Dene" butonu yer alır. Bu buton tüm başarısız item'ları tekrar gönderir.
- Retry sırasında hangi item'ların denenmekte olduğu görünür olmalıdır (ör: item yanında spinner veya "tekrar deneniyor..." etiketi).

Hangi hatalar retry'a uygundur:

- Ağ hataları (network error, timeout): Retry uygun.
- Sunucu hataları (5xx): Retry uygun (sunucu geçici olarak sorunlu olabilir).
- Validation hataları (4xx, ör: 400, 422): Retry uygun değil, veri değişmeden aynı hatayı alır. Kullanıcıya "Bu kayıt düzenlenmeli" mesajı gösterilir.
- Yetkilendirme hataları (401, 403): Retry uygun değil, önce session/yetki sorunu çözülmeli.

#### Kural 4: UI durumu

Başarılı ve başarısız item'lar UI'da farklı görünmelidir:

- Başarılı item'lar: Normal görünüm. Herhangi bir ek işaret taşımazlar. Kullanıcı bunların kaydedildiğinden emin olmalıdır.
- Retry aşamasındaki item'lar: Sarı/turuncu uyarı ikonu + "Kaydediliyor..." veya "Tekrar deneniyor..." etiketi. Item düzenlenebilir ama kullanıcı kaydedilmediğini bilir.
- Kalıcı olarak başarısız item'lar (3 retry sonrası): Kırmızı uyarı ikonu + "Kaydedilemedi" etiketi + "Tekrar Dene" butonu. Item düzenlenebilir; kullanıcı içeriği değiştirip tekrar gönderebilir.

Bu durumlar karışmamalıdır. Kullanıcı herhangi bir listeye baktığında hangi item'ın kaydedildiğini, hangisinin beklediğini, hangisinin sorunlu olduğunu hemen anlayabilmelidir.

#### Kural 5: Rollback kararı

Partial failure durumunda rollback politikası:

- Başarılı item'lar geri ALINMAZ. Bu en kritik kuraldır. Başarılı olan işler korunur; kullanıcı zaten bunları "kaydedildi" olarak görmüştür, geri almak güven kırar.
- Başarısız item'lar local'de draft (taslak) olarak kalır. Kullanıcı bu taslakları düzenleyebilir, içeriklerini değiştirebilir ve tekrar gönderebilir.
- Draft veriler local storage veya cache'de persist edilmelidir. Uygulama kapanıp açılsa bile kaydedilmemiş taslaklar kaybolmamalıdır.
- Taslak veriler bir "unsaved changes" veya "pending changes" bölümünde gruplanabilir; böylece kullanıcı neyin kaydedilip neyin kaydedilmediğini tek yerden görebilir.

### 19.4.3. Hatalı yaklaşımlar

Aşağıdaki yaklaşımlar bu proje kapsamında zayıf kabul edilir:

- Partial failure'da tüm batch'i geri almak: 5 item'dan 3'ü başarılıyken hepsini geri almak, başarılı olan işleri de kaybetmek demektir. Kullanıcı "3'ü zaten kaydedilmişti, neden sildiniz?" der.
- Başarısız item'ları sessizce silmek: Kullanıcı 5 item gönderdiğini düşünür, 3'ü kaydedilir, 2'si sessizce kaybolur. Kullanıcı fark etmeyebilir ve veri kaybı yaşar. Bu güven kırıcıdır.
- Belirsiz "bir hata oluştu" mesajı göstermek: Hangi item'ın başarısız olduğu söylenmezse kullanıcı ne yapacağını bilemez. "5 güncellemenin hepsini tekrar mı göndersem? Hangileri zaten kaydedildi?" sorularıyla kalır.
- Tüm item'ları birden retry etmek (başarılılar dahil): Zaten kaydedilmiş item'ları tekrar göndermek gereksiz sunucu yükü oluşturur ve idempotency sağlanmamışsa duplicate kayıt riski doğurur.
- Retry mekanizması olmadan "hata oluştu, sayfayı yenileyin" demek: Kullanıcı sayfayı yenilediğinde kaydedilmemiş tüm draft veriler kaybolabilir. Bu kabul edilemez.

---

# 20. Offline Toleransı

## 20.1. Offline-first ile offline-tolerant ayrımı

Bu proje kapsamında her ürün offline-first olmak zorunda değildir.
Ama çoğu ürün en azından offline-tolerant düşünülmelidir.

### Offline-first
Temel ürün deneyimi ağ olmadan da ciddi ölçüde çalışır.

### Offline-tolerant
Ağ problemi olduğunda ürün kontrollü degrade olur, kullanıcıyı tamamen kırmaz.

## 20.2. Kural

Ürünün tipi ne olursa olsun şu sorular sorulmalıdır:
- ağ gidince ne olur?
- kullanıcı mevcut veriyi görebilir mi?
- mutation’lar bloke mi olur, kuyruklanır mı?
- network geri gelince recovery nasıl olur?

## 20.3. Zayıf yaklaşım

- her bağlantı sorununun tam ekran hata üretmesi,
- draft kaybı,
- kullanıcıya ağ problemi sonrası hiçbir yön vermemek,
- offline etkisini yalnızca teknik log meselesi sanmak.

## 20.4. Ağ Kalitesi Düşüşü Yönetimi (Network Degradation Handling)

### 20.4.1. Nedir?

Ağ kalitesi düşüşü, kullanıcının bağlantısının tamamen kesilmeden yavaşlaması durumudur. Örneğin kullanıcı 4G bağlantıdan 3G'ye, 3G'den 2G'ye, 2G'den Edge'e düşebilir. Veya Wi-Fi sinyali zayıflayabilir, tünel/metro gibi yerlerde bağlantı kalitesi sürekli dalgalanabilir.

Bu durum, tam offline'dan farklıdır. Offline'da bağlantı kesilmiştir ve uygulama bunu tespit edebilir. Ağ kalitesi düşüşünde ise bağlantı teknik olarak vardır ama çok yavaştır. İstekler gider ama yanıt geç gelir veya timeout olur. Bu "ara durum", doğru ele alınmazsa kullanıcı deneyimini offline'dan bile daha kötü yapabilir: kullanıcı bağlantısı var sanır ama hiçbir şey yüklenmez.

### 20.4.2. Sorun: Sabit timeout kullanmanın zararları

Sabit bir timeout değeri (ör: tüm istekler için 10 saniye) kullanmak her iki uçta da sorun yaratır:

- Hızlı bağlantıda (4G/Wi-Fi): 10 saniye timeout çok uzundur. İstek aslında 200ms'de yanıt almayı bekler; 10 saniye boyunca "yanıt bekleniyor" durumu kullanıcıyı gereksiz yere bekletir. Sunucu gerçekten yanıt veremiyorsa bunu çok geç öğrenir.
- Yavaş bağlantıda (2G/Edge): 10 saniye timeout çok kısadır. Normal koşullarda bile yanıt 12-15 saniye sürebilir. Ama timeout 10 saniyede tetiklendiği için istek "başarısız" sayılır. Aslında biraz daha beklense yanıt gelecektir.

Sonuç: Sabit timeout, bağlantı hızını dikkate almaz. Her durumda ya çok agresif ya da çok gevşek kalır.

### 20.4.3. Adaptive timeout stratejisi

Bağlantı durumuna göre timeout değeri dinamik olarak ayarlanmalıdır:

Başlangıç değerleri ve kurallar:

- İlk istek timeout'u: 5 saniye (varsayılan).
- İstek başarısız olursa veya timeout olursa: Sonraki istek için timeout %50 artırılır. 5s → 7.5s → 11.25s → 16.87s → 25.31s → 30s (maksimum).
- İstek başarılı olursa: Timeout değeri varsayılana (5 saniye) döner. Başarılı yanıt, bağlantının düzeldiğini gösterir.
- Maksimum timeout: 30 saniye. Bu değer aşılamaz.
- 30 saniye timeout'a ulaşıldığında ve istek hâlâ başarısız oluyorsa: Kullanıcıya "Bağlantınız çok yavaş. Lütfen daha iyi bir ağa bağlanmayı deneyin." mesajı gösterilir.

Bu strateji şu avantajı sağlar:

- Hızlı bağlantıda timeout düşük kalır, sorunlar hızlı tespit edilir.
- Yavaş bağlantıda timeout kademeli olarak artar, gereksiz başarısızlıklar önlenir.
- Bağlantı düzeldiğinde sistem hızlıca normal davranışa döner.

Uygulama detayı: Timeout değeri global bir state'te tutulur (ör: bir singleton veya context). Her HTTP isteği bu değeri okur. Başarı/başarısızlık durumunda değer güncellenir. Bu logic HTTP client interceptor'ında (axios interceptor veya fetch wrapper) merkezi olarak uygulanır, her istek için ayrı yazılmaz.

### 20.4.4. Quality-of-Service (QoS) sınıflandırması

Tüm API istekleri aynı önceliğe sahip değildir. Bağlantı yavaşladığında kritik ve non-critical istekler farklı muamele görmelidir:

**Kritik istekler (yüksek öncelik):**

- Login/authentication istekleri
- Payment/ödeme işlemleri
- Form submit (kullanıcı veri kaybetmesin)
- Güvenlik ile ilgili istekler (token yenileme, session doğrulama)

Bu istekler için:

- Daha uzun timeout uygulanır (varsayılanın 2 katı).
- Daha fazla retry hakkı verilir (ör: 5 retry yerine 3).
- Bağlantı yavaş olsa bile bu istekler ertelenmez veya atlanmaz.
- Kullanıcıya "işleminiz devam ediyor, lütfen bekleyin" mesajı gösterilir.

**Non-critical istekler (düşük öncelik):**

- Analytics ve telemetry event'leri
- Prefetch istekleri (sonraki sayfa verisini önceden çekme)
- Arka plan senkronizasyonu
- Önemsiz meta veri çekme (ör: kullanıcı avatar'ı, badge sayısı)

Bu istekler için:

- Düşük bağlantıda tamamen atlanabilir veya ertelenebilir.
- Bağlantı düzeldiğinde tekrar çalıştırılır.
- Timeout süresi kısa tutulur (hızlı fail, uzun bekleme yok).
- Kullanıcıya bu isteklerin ertelendiği bildirilmez (arka planda sessizce yönetilir).

Sınıflandırma nerede yapılır: Her API isteği bir priority seviyesi ile tanımlanır (ör: `priority: 'critical' | 'normal' | 'low'`). HTTP client wrapper bu priority'ye göre timeout, retry ve deferral kararı verir.

### 20.4.5. Kullanıcı bildirimi

Bağlantı yavaşladığında kullanıcı bilgilendirilmelidir. Ama bu bildirim agresif veya rahatsız edici olmamalıdır.

Tetikleme koşulu: Ardışık 2 veya daha fazla istek normalden belirgin şekilde yavaş yanıt aldığında (ör: ortalama yanıt süresinin 3 katından fazla) veya ardışık 2+ istek timeout olduğunda banner gösterilir.

Banner davranışı:

- Hafif, non-intrusive (tam ekran kapatmaz) banner: "Bağlantınız yavaş görünüyor. Bazı içerikler gecikmeli yüklenebilir."
- Banner persistent'tır (kendiliğinden kaybolmaz). Bağlantı düzeldiğinde (ardışık 2+ hızlı yanıt) otomatik kaybolur.
- Banner ekranın üstünde veya altında, mevcut içeriği engellemeyecek şekilde konumlanır.
- Banner'da "Daha fazla bilgi" veya "İpuçları" linki olabilir (ör: Wi-Fi'ye geçmeyi önerme).
- Banner gösterildiğinde sayfadaki mevcut (cache'te olan) içerik görünmeye devam eder. "Bağlantı yavaş" demek "hiçbir şey gösterme" demek değildir.

Ne zaman banner gösterilmez:

- Tek bir yavaş istek yeterli değildir (geçici bir spike olabilir).
- Kullanıcı offline ise ayrı bir "Bağlantı yok" mesajı gösterilir, "yavaş" mesajı değil.

### 20.4.6. Data fetching adaptasyonu

Bağlantı yavaşladığında veri çekme stratejisi adapte edilmelidir. Amaç: Az veri çekerek mevcut bağlantıyı en verimli kullanmak.

Uygulanacak adaptasyonlar:

1. **Image quality düşürme**: Yavaş bağlantıda yüksek çözünürlüklü görseller yerine düşük çözünürlüklü versiyonlar (thumbnail) veya blur placeholder gösterilir. Backend farklı boyutlarda image sunuyorsa (ör: `?quality=low`), düşük bağlantıda küçük boyut istenir. Bağlantı düzeldiğinde yüksek çözünürlüklü versiyona geçilir.

2. **Non-critical API çağrılarının ertelenmesi**: Prefetch, analytics, arka plan veri senkronizasyonu gibi acil olmayan istekler ertelenir. Bu istekler bir kuyruğa alınır ve bağlantı düzeldiğinde toplu olarak gönderilir.

3. **Prefetch devre dışı bırakma**: Normal bağlantıda sonraki sayfa verisini önceden çekmek (prefetch) performans artırır. Ama yavaş bağlantıda prefetch mevcut bant genişliğini tüketir ve aktif isteği yavaşlatır. Düşük bağlantıda prefetch tamamen kapatılır.

4. **Pagination sayfa boyutunu küçültme**: Normal bağlantıda 20 item'lık sayfalar çekilirken, yavaş bağlantıda 10 item'a düşürülebilir. Daha az veri, daha hızlı yanıt.

5. **Gereksiz veri alanlarını atlama**: Backend destekliyorsa (sparse fieldsets, GraphQL field selection) yavaş bağlantıda yalnızca gerekli alanlar istenir. Ör: Listeleme ekranında sadece `id`, `name`, `status`; detay alanları (`description`, `metadata`) çekilmez.

### 20.4.7. Ölçüm ve bağlantı kalitesi izleme

Bağlantı kalitesini izlemek için platform API'leri kullanılır:

Web tarayıcıda:

- `navigator.connection` API (Network Information API): `effectiveType` (4g, 3g, 2g, slow-2g), `downlink` (Mbps), `rtt` (round-trip time, ms), `saveData` (kullanıcı veri tasarrufu modu açık mı) bilgilerini verir.
- `navigator.connection.addEventListener('change', ...)` ile bağlantı değişiklikleri dinlenir.
- Bu API henüz tüm tarayıcılarda desteklenmez (Safari desteği sınırlı). Desteklenmiyorsa istek yanıt sürelerine dayalı kendi ölçümünü yapmak gerekir.

React Native'de:

- `@react-native-community/netinfo` (NetInfo) paketi: `type` (wifi, cellular, none), `isConnected`, `details.cellularGeneration` (2g, 3g, 4g, 5g) bilgilerini verir.
- `NetInfo.addEventListener(...)` ile bağlantı değişiklikleri dinlenir.

Kendi ölçüm mekanizması (fallback):

- Her isteğin yanıt süresi kaydedilir.
- Son 5-10 isteğin ortalama yanıt süresi hesaplanır (rolling average).
- Bu ortalama belirli eşiklerin üzerine çıktığında bağlantı "yavaş" olarak işaretlenir.
- Eşik örnekleri: 0-500ms → hızlı, 500-2000ms → normal, 2000-5000ms → yavaş, 5000ms+ → çok yavaş.

### 20.4.8. Hatalı yaklaşımlar

Aşağıdaki yaklaşımlar bu proje kapsamında zayıf kabul edilir:

- Her isteğe aynı 30 saniye timeout vermek: Hızlı bağlantıda sorunlar geç fark edilir (30 saniye boşa beklenir), yavaş bağlantıda ise 30 saniye kullanıcıyı çok uzun süre belirsizlik içinde bırakır. Adaptive timeout kullanılmalıdır.
- Bağlantı yavaşladığında hiç bildirim göstermemek: Kullanıcı nedenini anlamadan "uygulama çalışmıyor" sanır ve uygulamayı terk eder. Hafif bir uyarı bile kullanıcının durumu anlamasını sağlar.
- Yavaş bağlantıda full-resolution image yüklemeye devam etmek: 2 MB'lık bir görsel 2G bağlantıda dakikalarca sürebilir ve diğer isteklerin bant genişliğini çalar. Düşük kalite versiyonuna geçilmelidir.
- Bağlantı yavaşladığında tüm istekleri durdurmak: Kullanıcı hiçbir şey yapamaz hale gelir. Kritik istekler devam etmeli, yalnızca non-critical istekler ertelenmelidir.
- Bağlantı hızını hiç ölçmemek: Uygulama bağlantı durumundan habersiz kalır ve tüm koşullarda aynı davranır. Bu, kötü ağ koşullarında kullanıcı deneyimini ciddi şekilde düşürür.
- Bağlantı düzeldiğinde adaptasyonları geri almamak: Düşük kalite modunda kalmak, bağlantı düzeldikten sonra da düşük çözünürlüklü görseller göstermeye devam etmek gereksizdir. Bağlantı düzeldiğinde normal davranışa dönülmelidir.

---

# 21. Pagination, Infinite Scroll ve Partial Data

## 21.1. Neden özel ele alınmalı?

Çünkü büyük liste ve akışlarda veri davranışı farklıdır.

## 21.2. Kural

- pagination state ile filter state ilişkisi net olmalı,
- yeni sayfa çekme ile initial load aynı UX davranışını taşımamalı,
- partial data gösterimi tutarlı olmalı,
- liste sonu, boş liste ve hata durumu birbirine karışmamalı.

## 21.3. Zayıf davranışlar

- her sayfa yüklemede tüm ekranı bloklamak,
- filter değiştiğinde pagination reset mantığını unutmak,
- partial list data ile full entity detail’i aynı doğruluk seviyesinde sanmak.

---

# 22. Prefetch ve Lazy Fetch

## 22.1. Prefetch ne zaman anlamlıdır?

- kullanıcı bir detaya girme olasılığı yüksekse,
- bir sonraki ekran çok muhtemelse,
- perceived performance kritikse,
- ağ maliyeti kabul edilebilirse.

## 22.2. Lazy fetch ne zaman anlamlıdır?

- veri pahalıysa,
- kullanıcı çoğu zaman o alana gitmiyorsa,
- ekran ilk açılışta gereksiz yük yaratmak istenmiyorsa.

## 22.3. Kural

Prefetch “hızlı hissettirmek” için kör uygulanmamalı.
Gerçek kullanım davranışı ve maliyet dengesi düşünülmeli.

---

# 23. Security ve Veri Katmanı

## 23.1. Neden önemli?

Data layer yalnızca performans alanı değildir.
Şunları da etkiler:
- token kullanımı,
- hassas veri saklama,
- yanlış persistence,
- loglarda veri sızması,
- unauthorized recovery,
- session invalidation.

## 23.2. Kural

- Hassas veri normal cache davranışıyla aynı ele alınmamalı.
- Persist edilen veri tipi güvenlik açısından değerlendirilmeli.
- Error/log süreçlerinde hassas veri sızmamalı.
- Auth/session geçişleri data cache ile uyumlu olmalı.

---

# 24. Observability ve Veri Katmanı

## 24.1. Neden gerekir?

Veri problemleri çoğu zaman UI’dan değil, runtime davranıştan anlaşılır.

İzlenmesi anlamlı alanlar:
- request başarısızlık oranı
- timeout
- retry yoğunluğu
- conflict vakaları
- stale data şikayetleri
- cache hit/miss örüntüleri
- mutation rollback olayları

## 24.2. Kural

Gözlemlenebilirlik sadece backend için düşünülmemelidir.
İstemci veri davranışı da ölçülebilir olmalıdır.

---

# 25. UI Katmanı ile Data Layer Sınırı

## 25.1. Temel kural

UI katmanı:
- veri çağrısının detayını bilmek zorunda değildir,
- transport shape yönetmemelidir,
- hata sınıflandırma merkezi olmamalıdır,
- invalidation planı kurmamalıdır.

## 25.2. UI katmanında kabul edilebilir olanlar

- loading gösterimi
- empty/error state sunumu
- kullanıcı tetikli refresh
- mutation trigger etme
- display mapping’in küçük parçaları

## 25.3. UI katmanında kabul edilmeyenler

- request compose etmek
- auth header mantığı
- transport→domain dönüşümü
- retry politikası belirlemek
- cache invalidation matrisi kurmak

---

# 26. Cross-Platform Veri Davranışı İlkesi

## 26.1. Kural

Web ve mobile farklı runtime kısıtları taşıyabilir.
Ama şu alanlarda çelişmemelidir:
- freshness mantığı
- mutation sonrası görünüm
- hata türlerinin kullanıcıya etkisi
- optimistic davranış
- retry/recovery mantığı
- veri sahipliği

## 26.2. Kabul edilebilir farklılıklar

- prefetch agresifliği
- local persistence tekniği
- network lifecycle tetikleyicileri
- foreground/background revalidation ayrıntıları

## 26.3. Kabul edilemez farklılıklar

- bir platformda stale veri uzun süre görünürken diğerinde görünmemesi
- bir platformda mutation sonrası update, diğerinde manuel refresh gerektirmesi
- aynı görev için çelişkili error recovery davranışları

---

# 27. Data Layer Anti-Pattern Listesi

Aşağıdaki davranışlar bu proje kapsamında zayıf kabul edilir:

1. Component içinde doğrudan ad-hoc fetch
2. Server state’i global store’a kopyalayıp gerçek state sanmak
3. İki farklı ekranın aynı veriyi farklı local kopyalarla taşıması
4. Error mapping’i UI’ya dağıtmak
5. Mutation sonrası invalidation düşünmemek
6. Her şey için optimistic update kullanmak
7. Retry’ı hata türünden bağımsız yapmak
8. Raw API response’u doğrudan UI shape gibi kullanmak
9. Persist etmeye gerek olmayan remote veriyi local storage’a basmak
10. Offline etkilerini tamamen yok saymak
11. Deep link/entry sonrası veri recovery mantığını düşünmemek
12. Pagination ve filter state ilişkisini rastgele bırakmak
13. Prefetch’i maliyet düşünmeden yapmak
14. Auth/session değişiminde cache davranışını tanımlamamak
15. Sync conflict ihtimalini hiç ele almamak

---

# 28. Veri Kararı Verirken Sorulacak Sorular

Bir veri davranışı tasarlanırken şu sorular sorulmalıdır:

1. Bu verinin asıl sahibi kim?
2. Bu veri ne kadar hızlı değişir?
3. Kullanıcı stale veri görürse risk ne?
4. Bu veri cache’lenmeli mi?
5. Ne zaman invalidate edilmeli?
6. Ne zaman sessizce revalidate edilmeli?
7. Mutation sonrası hangi yüzeyler etkilenir?
8. Optimistic update güvenli mi?
9. Offline olursa kullanıcı ne görecek?
10. Error türleri kullanıcıya nasıl yansıyacak?
11. Bu veri UI’da hangi shape ile kullanılacak?
12. Bu mantık test edilebilir ve denetlenebilir mi?

---

# 29. Sonraki Dokümanlara Etkisi

## 29.1. Forms, inputs and validation
`11-forms-inputs-and-validation.md`, initial data, form draft, submit lifecycle ve mutation sonrası davranışı bu belgeyle uyumlu tanımlamalıdır.

## 29.2. Performance standard
`13-performance-standard.md`, cache, revalidation, pagination ve prefetch kararlarının performans etkilerini burada çizilen mantığa göre değerlendirmelidir.

## 29.3. Testing strategy
`14-testing-strategy.md`, fetch, mapping, mutation, retry, invalidation ve error recovery testlerini bu belgede ayrıştırılan katmanlar üzerinden planlamalıdır.

## 29.4. Technology decision framework
`17-technology-decision-framework.md`, data fetching aracı seçimini bu belgedeki gereksinim eksenlerine göre değerlendirmelidir.

## 29.5. Repo structure spec
`21-repo-structure-spec.md`, repository/service/gateway/cache/mappers gibi dosyaların nerede yaşayacağını bu belgeye göre somutlaştırmalıdır.

## 29.6. ADR-005 ilişkisi
`ADR-005-data-fetching-cache-and-mutation-model.md`: Bu belgedeki server state ayrımı, cache politikası, invalidation ve mutation lifecycle kuralları, ADR-005'te verilen TanStack Query kararının stratejik detaylandırmasıdır. ADR-005, bu belgenin canonical karar otoritesidir.

---

# 30. Onay Kriterleri

Bu doküman yeterli kabul edilir eğer:

1. Data fetching konusu yalnızca HTTP isteği seviyesinde bırakılmamışsa,
2. Cache, freshness, invalidation ve revalidation kavramları net ayrılmışsa,
3. Mutation, optimistic update, retry ve error mapping sistematik ele alınmışsa,
4. UI ile data layer sınırı açıkça tanımlanmışsa,
5. Offline tolerance, conflict ve sync etkileri görünür kılınmışsa,
6. Cross-platform veri davranışı için tutarlı çerçeve kurulmuşsa,
7. Sonraki form, test, performans ve teknoloji kararlarına uygulanabilir temel sağlanmışsa.

---

# 31. Kısa Sonuç

Bu dokümanın ana çıktısı şudur:

> Bu boilerplate kapsamında veri çekme ve senkronizasyon, component içinde rastgele ağ çağrıları yapmak değil; veri sahipliği, cache ömrü, invalidation, revalidation, mapping, hata yönetimi ve kullanıcı göreviyle uyumlu veri davranışını sistematik biçimde yönetme problemidir.

Bu nedenle bundan sonraki hiçbir doküman:
- server state’i sıradan local state gibi ele alamaz,
- fetch/caching mantığını UI katmanına dağıtamaz,
- invalidation ve retry davranışlarını rastgele bırakamaz,
- optimistic update’i düşünmeden uygulayamaz,
- stale ve doğru veri ayrımını görmezden gelemez.
