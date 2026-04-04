---
belge-adi: Service Layer Patterns
dosya-adi: 51-service-layer-patterns.md
belge-turu: Specification / architecture patterns / service layer design
durum: Accepted
tarih: 2026-04-03
---

# 51-service-layer-patterns.md

## Doküman Kimliği

- **Doküman adı:** Service Layer Patterns
- **Dosya adı:** `51-service-layer-patterns.md`
- **Doküman türü:** Specification / architecture patterns / service layer design
- **Durum:** Accepted
- **Tarih:** 2026-04-03
- **Kapsam:** Bu boilerplate kapsamında servis katmanı pattern'lerini, veri erişim soyutlamalarını, iş mantığı organizasyonunu, hata hiyerarşisini, factory yapılarını ve cross-platform servis akışlarını standartlaştırır. Repository, UseCase, Factory, ErrorBoundary, State Machine, Component Facade, Icon Facade, Offline Queue ve Realtime Subscription pattern'lerini tanımlar.
- **Bağlı olduğu üst dokümanlar:**
  - `06-application-architecture.md`
  - `07-module-boundaries-and-code-organization.md`
  - `09-state-management-strategy.md`
  - `10-data-fetching-cache-sync.md`
  - `11-forms-inputs-and-validation.md`
  - `25-error-empty-loading-states.md`
  - `36-canonical-stack-decision.md`
  - `45-boilerplate-project-boundary-contract.md`
- **Doğrudan etkileyeceği dokümanlar:**
  - `14-testing-strategy.md`
  - `20-initial-implementation-checklist.md`
  - `21-repo-structure-spec.md`
  - `30-contribution-guide.md`
  - `31-audit-checklist.md`
  - `32-definition-of-done.md`
  - `43-derived-project-creation-guide.md`

---

# 1. Amaç

Bu dokümanın amacı, servis katmanı pattern'lerini "ihtiyaç oldukça dosya oluştururuz" seviyesinden çıkarıp; **başlangıçtan itibaren veri erişim soyutlamaları görünür, iş mantığı organizasyonu tekrarlanabilir, hata yönetimi tutarlı, test edilebilirlik yüksek ve derived project'lerde mimari tutarlılık sağlayan** bir yapıya dönüştürmektir.

Bu belge şu sorulara net ve operasyonel cevap verir:

1. UI katmanı neden doğrudan veri kaynağına erişmemelidir?
2. Repository pattern nasıl uygulanır ve sınırları nerededir?
3. UseCase pattern ile iş mantığı nasıl organize edilir?
4. Hata yönetimi hangi hiyerarşi ile standartlaştırılır?
5. Factory pattern'ler hangi durumlarda kullanılır?
6. ErrorBoundary stratejisi kaç katmandır ve hangi hata tipini hangi katman yakalar?
7. State yönetimi servis katmanı ile nasıl bütünleşir?
8. Component Facade ve Icon Facade pattern'leri neden zorunludur?
9. Offline queue ve realtime subscription cross-platform bağlamda nasıl yapılır?
10. Derived project'ler bu pattern'lerden hangilerini zorunlu miras alır?

Bu belge 06-application-architecture.md'deki 6 katmanlı mimari üzerine inşa eder. 06'nın mantıksal katman tanımlarını tekrarlamaz; bu katmanların **somut servis pattern'lerini, kontratlarını ve uygulama kurallarını** detaylandırır.

---

# 2. Neden Bu Doküman Gerekli

06-application-architecture.md mimari katmanların ne olduğunu, sorumluluklarını ve bağımlılık yönlerini tanımlar. Ancak pratik uygulamada şu sorular cevapsız kalır:

## 2.1. Repository pattern uygulanmamış

Repository tanımlanmamışsa:

- ekranlar doğrudan Firestore, REST API veya local storage'a erişir,
- aynı veri kaynağı farklı yerlerde farklı şekilde çağrılır,
- veri dönüşümleri her component'te tekrarlanır,
- pagination, cache ve retry davranışları tutarsız olur.

## 2.2. UseCase pattern yoksa iş kuralları dağılır

UseCase tanımlanmamışsa:

- business validation bazen screen'de, bazen hook'ta, bazen repository'de yapılır,
- multi-repository koordinasyonu her yerde farklı yazılır,
- side effect'ler (analytics, notification) rastgele yerlerde tetiklenir,
- test edilmesi gereken iş kuralları UI'a gömülü kalır.

## 2.3. Hata hiyerarşisi standart değilse

Merkezi hata yönetimi yoksa:

- her feature kendi hata tipini uydurur,
- infrastructure hataları raw halinde UI'a akar,
- hata mesajları tutarsız olur,
- Sentry raporları anlamsız yığın halinde kalır.

## 2.4. Cross-platform tutarlılık kaybolur

Pattern'ler standart değilse:

- web ve mobile arasında mimari kopukluk oluşur,
- derived project'ler kendi yollarını çizer,
- boilerplate'in sağladığı tutarlılık vaadi gerçekleşmez.

Bu proje kapsamında servis katmanı pattern'lerinin ana problemi kütüphane eksikliği değildir. Ana problem, **somut kontrat ve uygulama kuralı yokluğudur**.

---

# 3. Temel Tez

Bu proje kapsamında temel tez şudur:

> UI katmanı hiçbir koşulda doğrudan veri kaynağına erişmez. Veri erişimi Repository pattern ile soyutlanır, iş mantığı UseCase pattern ile organize edilir, hatalar merkezi DomainError hiyerarşisi ile yönetilir. Bu ayrım gereksiz soyutlama katmanı üretmeden, doğru granülerlikte yapılır.

Bu tez şu sonuçları doğurur:

1. Screen/component doğrudan Firestore, REST API veya storage çağrısı yapamaz.
2. Repository yalnızca veri erişim operasyonları yapar; iş kuralı içermez.
3. UseCase tek bir iş kuralını temsil eder; UI bağımlılığı taşımaz.
4. DomainError hiyerarşisi merkezi olarak tanımlanır; her feature kendi hata tipini uyduramaz.
5. ErrorBoundary üç katmanlı stratejisi korunur.
6. Pattern'ler platform-agnostic olmalıdır; web ve mobile için aynı kontrat geçerlidir.

---

# 4. Katmanlı Mimari ve Servis Akışı

06-application-architecture.md'de tanımlanan 6 katman şunlardır:

1. **App Shell Layer** — uygulama kabuğu, provider composition, bootstrap
2. **Presentation Layer** — ekranlar, component'ler, UI yüzeyleri
3. **Feature Orchestration Layer** — ekran/flow düzeyinde state orchestration, hook'lar
4. **Domain Layer** — iş kuralları, entity'ler, saf hesaplamalar
5. **Data Access Layer** — veri erişim kontratları, mapping, cache policy
6. **Platform / Infrastructure Layer** — platform API'leri, storage adapter'ları, bridge'ler

Bu doküman özellikle **Domain Layer (4)**, **Data Access Layer (5)** ve **Feature Orchestration Layer (3)** arasındaki somut servis pattern'lerini detaylandırır.

## 4.1. Servis Akış Zinciri

Bir kullanıcı aksiyonunun sistemdeki akışı şu sırayı takip eder:

```
UI (Presentation)
  └─→ Hook (Feature Orchestration)
        └─→ UseCase (Domain)
              └─→ Repository (Data Access)
                    └─→ Infrastructure (Platform / External Service)
```

**Her ok tek yönlüdür.** Alt katman üst katmanı çağıramaz. Alt katman üst katmanın varlığından haberdar değildir.

## 4.2. Katman Sorumluluk Özeti (Bu Doküman Kapsamında)

| Katman                | Sorumluluk                                                | Bu Dokümandaki Pattern          |
| --------------------- | --------------------------------------------------------- | ------------------------------- |
| Feature Orchestration | User intent → data/domain çağrısı, UI state shape üretimi | Hook composition, state machine |
| Domain                | İş kuralları, validation, entity logic                    | UseCase, DomainError, factory   |
| Data Access           | Veri kaynağı soyutlama, CRUD, cache, mapping              | Repository                      |
| Infrastructure        | Platform API, network client, storage                     | Adapter, bridge                 |

---

# 5. Repository Pattern

## 5.1. Tanım ve Sorumluluk

Repository, Data Access Layer'ın temel yapı taşıdır. Veri kaynağını (Firestore, REST API, GraphQL, local storage, MMKV) soyutlayarak üst katmanlara tek tip bir veri erişim kontratı sunar.

Repository'nin sorumlulukları:

- Veri kaynağı soyutlaması: Üst katman Firestore mı, REST API mi kullanıldığını bilmez.
- CRUD operasyonları: Temel oluşturma, okuma, güncelleme, silme işlemleri.
- Query kontratları: Pagination, filtering, sorting parametrelerini standart hale getirme.
- Veri dönüştürme: Raw veri kaynağı response'unu domain entity'sine çevirme.
- Cache policy: Hangi verinin cache'leneceği, ne kadar süre geçerli kalacağı.
- Realtime listener yönetimi: Subscribe/unsubscribe lifecycle'ını kontrol etme.
- Error mapping: Infrastructure hatalarını DomainError'a dönüştürme.

## 5.2. Klasör Yapısı

Repository dosyaları iki şekilde organize edilebilir:

### Shared Repository (Birden Fazla Feature Tarafından Kullanılan)

```
packages/core/src/data/repositories/
├── userRepository.ts          // Kullanıcı veri erişimi
├── orderRepository.ts         // Sipariş veri erişimi
├── notificationRepository.ts  // Bildirim veri erişimi
└── types.ts                   // Ortak repository tipleri (PaginatedResult, ListParams vb.)
```

### Feature-Scoped Repository (Tek Feature'a Özgü)

```
apps/{app}/src/features/{feature}/repositories/
├── featureRepository.ts       // Feature'a özel veri erişimi
└── types.ts                   // Feature-local repository tipleri
```

Karar kuralı: Repository tek bir feature tarafından kullanılıyorsa feature klasöründe kalır. İkinci bir feature aynı repository'ye ihtiyaç duyduğu anda `packages/core/src/data/repositories/` altına taşınır.

## 5.3. Interface Kontratı

Her repository, kullandığı entity'ye özgü bir interface kontratı tanımlar:

```typescript
// packages/core/src/data/repositories/types.ts

// Ortak tipler
interface ListParams {
  cursor?: string;
  limit: number;
  filters?: Record<string, unknown>;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

interface PaginatedResult<T> {
  items: T[];
  nextCursor: string | null;
  hasMore: boolean;
  totalCount?: number;
}

type Unsubscribe = () => void;
```

```typescript
// packages/core/src/data/repositories/userRepository.ts

// Repository interface ornegi
interface UserRepository {
  // Tekil okuma
  getById(id: string): Promise<User | null>;

  // Listeli okuma (pagination ZORUNLU)
  getList(params: ListParams): Promise<PaginatedResult<User>>;

  // Olusturma
  create(data: CreateUserInput): Promise<User>;

  // Guncelleme
  update(id: string, data: UpdateUserInput): Promise<User>;

  // Silme
  delete(id: string): Promise<void>;

  // Realtime dinleme
  subscribe(id: string, callback: (user: User) => void): Unsubscribe;
}
```

## 5.4. Repository Implementasyon Prensibi

Repository implementasyonu infrastructure katmanına yakındır ve şu kurallara uyar:

- **Return type:** Her zaman domain entity döndürür; raw Firestore DocumentSnapshot, Axios response veya benzeri infrastructure tipi döndürmez.
- **Mapping:** Raw veri → domain entity dönüşümü repository içinde yapılır.
- **Error mapping:** Infrastructure hataları (Firestore hata kodları, HTTP status code'ları, network timeout) DomainError'a dönüştürülür.
- **Pagination:** Liste sorguları ZORUNLU olarak `limit + cursor` pattern kullanır. Sınırsız liste sorgusu yasaktır.

```typescript
// Dogru: Domain entity dondurme ve error mapping ornegi
async function getById(id: string): Promise<User | null> {
  try {
    const doc = await firestore.collection('users').doc(id).get();
    if (!doc.exists) return null;
    return mapFirestoreDocToUser(doc); // raw → domain entity
  } catch (error) {
    throw mapInfrastructureError(error); // infra error → DomainError
  }
}
```

## 5.5. Repository Kuralları

| Kural                 | Açıklama                                                                       | Seviye  |
| --------------------- | ------------------------------------------------------------------------------ | ------- |
| Saf veri operasyonu   | Repository yalnızca veri okur/yazar; business logic YASAK                      | ZORUNLU |
| Pagination zorunlu    | Liste sorguları: `limit + cursor` pattern                                      | ZORUNLU |
| N+1 query yasak       | Döngü içinde tekli sorgu yerine batch query veya denormalize read-model kullan | ZORUNLU |
| Error mapping         | Infrastructure hatalarını DomainError'a dönüştür                               | ZORUNLU |
| Domain entity return  | Raw response döndürme; domain entity'ye map et                                 | ZORUNLU |
| Repository izolasyonu | Bir repository başka repository çağıramaz                                      | ZORUNLU |
| Cache policy          | TanStack Query ile entegre; repository kendi cache'ini yönetmez                | TAVSİYE |

## 5.6. Repository Anti-Pattern'leri

Aşağıdaki davranışlar servis katmanı kapsamında zayıf kabul edilir:

1. **Screen component'ten doğrudan repository çağrısı:** Screen, repository'yi direkt çağırmaz; hook (orchestration) katmanı üzerinden erişir.

2. **Repository'de business validation:** "Kullanıcının bu siparişi verebilmesi için bakiyesi yeterli mi?" kontrolü repository'nin işi değildir; UseCase'in işidir.

3. **Repository'den UI state döndürme:** Repository `{ isLoading: true, data: ... }` gibi UI state shape'i döndürmez. Bu orchestration hook'unun sorumluluğudur.

4. **Bir repository'nin başka repository'yi çağırması:** `orderRepository` içinden `userRepository.getById()` çağrısı yapılmaz. Multi-repository koordinasyonu UseCase'in sorumluluğudur.

5. **Raw response döndürme:** Firestore `DocumentSnapshot` veya Axios `AxiosResponse` doğrudan döndürmek yasaktır. Her zaman domain entity'ye map edilir.

6. **Sınırsız liste sorgusu:** `getAll()` gibi pagination'sız tüm kayıtları çeken metod yasaktır. Her liste sorgusu `limit + cursor` ile sınırlanmalıdır.

---

# 6. UseCase Pattern

## 6.1. Tanım ve Sorumluluk

UseCase, Domain Layer'ın iş mantığı organizasyon birimidir. Tek bir iş kuralını veya iş akışını temsil eder. Repository'lerden veri alır, domain kurallarını uygular, sonucu döndürür.

UseCase'in sorumlulukları:

- **Business logic orchestration:** İş kurallarının uygulanma sırasını yönetme.
- **Input validation:** Zod schema ile giriş verilerini doğrulama.
- **Multi-repository koordinasyonu:** Birden fazla repository'yi bir iş akışında birleştirme.
- **Domain kuralları uygulama:** İş kurallarını saf fonksiyonlar olarak çalıştırma.
- **Error handling ve mapping:** İş kuralı ihlallerini DomainError'a dönüştürme.
- **Side effect tetikleme:** Analytics, notification gibi yan etkileri koordine etme.

## 6.2. Klasör Yapısı

```
packages/core/src/data/usecases/
├── user/
│   ├── createUser.ts           // Kullanici olusturma is kurali
│   ├── updateUserProfile.ts    // Profil guncelleme is kurali
│   ├── deleteUser.ts           // Kullanici silme is kurali
│   └── getUserWithOrders.ts    // Multi-repo koordinasyon ornegi
├── order/
│   ├── createOrder.ts          // Siparis olusturma is kurali
│   ├── cancelOrder.ts          // Siparis iptal is kurali
│   └── calculateOrderTotal.ts  // Fiyat hesaplama saf fonksiyonu
├── auth/
│   ├── loginUser.ts            // Giris is kurali
│   └── logoutUser.ts           // Cikis is kurali
└── types.ts                    // Ortak UseCase tipleri
```

## 6.3. UseCase Kontratı

Her UseCase tek bir async fonksiyon olarak export edilir:

```typescript
// packages/core/src/data/usecases/order/createOrder.ts

import { createOrderSchema, type CreateOrderParams } from '../schemas/orderSchemas';
import { DomainErrorHelpers } from '../../errors/domainError';
import { orderRepository } from '../../data/repositories/orderRepository';
import { userRepository } from '../../data/repositories/userRepository';
import { analytics } from '../../infrastructure/analytics';

interface CreateOrderResult {
  order: Order;
  success: true;
}

export async function createOrder(params: CreateOrderParams): Promise<CreateOrderResult> {
  // 1. Input validation (Zod schema ile)
  const validated = createOrderSchema.parse(params);

  // 2. Business rule: Kullanicinin siparis olusturma yetkisi var mi?
  const user = await userRepository.getById(validated.userId);
  if (!user) {
    throw DomainErrorHelpers.notFound('User', validated.userId);
  }
  if (!user.isActive) {
    throw DomainErrorHelpers.permissionDenied('Pasif kullanicilar siparis olusturamaz');
  }

  // 3. Business rule: Minimum siparis tutari kontrolu
  if (validated.totalAmount < 50) {
    throw DomainErrorHelpers.validationFailed('Minimum siparis tutari 50 TL olmalidir', {
      minimumAmount: 50,
      actualAmount: validated.totalAmount,
    });
  }

  // 4. Repository call: Siparisi olustur
  const order = await orderRepository.create({
    userId: validated.userId,
    items: validated.items,
    totalAmount: validated.totalAmount,
    status: 'pending',
  });

  // 5. Side effects: Analytics, bildirim vb.
  analytics.track('order_created', {
    orderId: order.id,
    userId: validated.userId,
    amount: validated.totalAmount,
  });

  return { order, success: true };
}
```

## 6.4. UseCase Kuralları

| Kural                   | Açıklama                                                            | Seviye  |
| ----------------------- | ------------------------------------------------------------------- | ------- |
| Tek sorumluluk          | Her UseCase tek bir iş kuralını temsil eder (Single Responsibility) | ZORUNLU |
| UI bağımsızlık          | UseCase React hook, navigation, toast, modal çağırmaz               | ZORUNLU |
| Async/await             | Promise chain (`.then().catch()`) yasak; `async/await` kullan       | ZORUNLU |
| Input validation        | Giriş verileri Zod schema ile doğrulanır                            | ZORUNLU |
| DomainError kullanımı   | İş kuralı ihlalleri DomainError fırlatır; raw `Error` fırlatılmaz   | ZORUNLU |
| UseCase'ler arası çağrı | Bir UseCase başka UseCase'i çağırabilir (orchestration)             | İZİNLİ  |
| Repository erişimi      | UseCase repository'lere doğrudan erişir                             | İZİNLİ  |
| Platform bağımsızlık    | UseCase web/mobile farkı bilmez; platform bridge kullanmaz          | ZORUNLU |

## 6.5. UseCase Anti-Pattern'leri

1. **UseCase'de UI bağımlılığı:** `showToast('Sipariş oluşturuldu')` veya `navigation.navigate('OrderDetail')` gibi UI side-effect'leri UseCase'de yapılmaz. Bu, orchestration hook'unun UseCase sonucuna göre tetikleyeceği işlerdir.

2. **God UseCase:** 200+ satır, 5+ repository, 10+ iş kuralı içeren UseCase "god service" anti-pattern'idir. Kural: Bir UseCase 100 satırı aştığında bölme ihtiyacı değerlendirilmelidir.

3. **UseCase'siz doğrudan repository çağrısı:** İş kuralı gerektirmeyen basit CRUD okuma işlemleri için UseCase zorunlu değildir. Orchestration hook'u doğrudan repository'yi çağırabilir. Ancak herhangi bir business validation veya multi-repository koordinasyonu varsa UseCase zorunludur.

4. **Raw error fırlatma:** `throw new Error('Bir şeyler ters gitti')` yerine `throw DomainErrorHelpers.internal('Beklenmedik hata')` kullanılır. Raw error fırlatmak DomainError hiyerarşisini bozar.

5. **Platform-specific logic:** `if (Platform.OS === 'ios') { ... }` gibi platform kontrolleri UseCase'de bulunmaz. Platform farkları infrastructure adapter'larında çözülür.

---

# 7. Factory Pattern'ler

## 7.1. DomainError Factory

### 7.1.1. DomainError Hiyerarşisi

Tüm uygulama genelinde tek tip hata yönetimi sağlamak için merkezi bir DomainError hiyerarşisi tanımlanır. Bu hiyerarşi `packages/core/src/errors/` altında yaşar ve tüm katmanlar tarafından kullanılır.

```typescript
// packages/core/src/errors/domainError.ts

// Hata kod enumu — tum uygulama genelinde tek tip
type DomainErrorCode =
  | 'VALIDATION_FAILED' // Girdi dogrulama hatasi
  | 'NOT_FOUND' // Kayit bulunamadi
  | 'UNAUTHORIZED' // Kimlik dogrulanamadi (401)
  | 'PERMISSION_DENIED' // Yetki yetersiz (403)
  | 'CONFLICT' // Veri catismasi (optimistic lock, versiyon uyumsuzlugu)
  | 'NETWORK_ERROR' // Ag baglantisi hatasi
  | 'TIMEOUT' // Islem zaman asimi
  | 'RATE_LIMITED' // Istek limiti asildi
  | 'INTERNAL_ERROR'; // Beklenmedik ic hata

// DomainError yapisi
interface DomainError {
  code: DomainErrorCode;
  message: string;
  metadata?: Record<string, unknown>;
  cause?: Error;
}
```

### 7.1.2. DomainError Factory Helper'ları

Factory helper'lar, her hata tipi için tutarlı ve tip-güvenli DomainError nesneleri üretir:

```typescript
// packages/core/src/errors/domainError.ts (devam)

export const DomainErrorHelpers = {
  // Girdi dogrulama hatasi
  validationFailed: (message: string, metadata?: Record<string, unknown>): DomainError => ({
    code: 'VALIDATION_FAILED',
    message,
    metadata,
  }),

  // Kayit bulunamadi
  notFound: (entity: string, id: string): DomainError => ({
    code: 'NOT_FOUND',
    message: `${entity} bulunamadi: ${id}`,
    metadata: { entity, id },
  }),

  // Kimlik dogrulanamadi
  unauthorized: (message?: string): DomainError => ({
    code: 'UNAUTHORIZED',
    message: message ?? 'Kimlik dogrulanamadi',
  }),

  // Yetki yetersiz
  permissionDenied: (message?: string, metadata?: Record<string, unknown>): DomainError => ({
    code: 'PERMISSION_DENIED',
    message: message ?? 'Bu islem icin yetkiniz yok',
    metadata,
  }),

  // Veri catismasi
  conflict: (message: string, versionId?: string): DomainError => ({
    code: 'CONFLICT',
    message,
    metadata: versionId ? { versionId } : undefined,
  }),

  // Ag hatasi
  networkError: (cause?: Error): DomainError => ({
    code: 'NETWORK_ERROR',
    message: 'Ag baglantisi hatasi',
    cause,
  }),

  // Zaman asimi
  timeout: (operation: string, durationMs: number): DomainError => ({
    code: 'TIMEOUT',
    message: `${operation} islemi zaman asimina ugradi (${durationMs}ms)`,
    metadata: { operation, durationMs },
  }),

  // Istek limiti
  rateLimited: (retryAfterMs?: number): DomainError => ({
    code: 'RATE_LIMITED',
    message: 'Istek limiti asildi',
    metadata: retryAfterMs ? { retryAfterMs } : undefined,
  }),

  // Beklenmedik ic hata
  internal: (message: string, cause?: Error): DomainError => ({
    code: 'INTERNAL_ERROR',
    message,
    cause,
  }),
};
```

### 7.1.3. Infrastructure Error → DomainError Mapping

Repository katmanında infrastructure hataları DomainError'a dönüştürülür:

```typescript
// packages/core/src/data/repositories/helpers/errorMapping.ts

// Firestore hata mapping ornegi
function mapFirestoreError(error: FirestoreError): DomainError {
  switch (error.code) {
    case 'not-found':
      return DomainErrorHelpers.notFound('Document', error.message);
    case 'permission-denied':
      return DomainErrorHelpers.permissionDenied();
    case 'unavailable':
      return DomainErrorHelpers.networkError(error);
    case 'deadline-exceeded':
      return DomainErrorHelpers.timeout('Firestore query', 30000);
    case 'resource-exhausted':
      return DomainErrorHelpers.rateLimited();
    case 'already-exists':
      return DomainErrorHelpers.conflict('Kayit zaten mevcut');
    default:
      return DomainErrorHelpers.internal(`Beklenmedik Firestore hatasi: ${error.code}`, error);
  }
}

// HTTP hata mapping ornegi
function mapHttpError(status: number, body?: unknown): DomainError {
  switch (status) {
    case 400:
      return DomainErrorHelpers.validationFailed('Gecersiz istek');
    case 401:
      return DomainErrorHelpers.unauthorized();
    case 403:
      return DomainErrorHelpers.permissionDenied();
    case 404:
      return DomainErrorHelpers.notFound('Resource', '');
    case 409:
      return DomainErrorHelpers.conflict('Veri catismasi');
    case 429:
      return DomainErrorHelpers.rateLimited();
    case 500:
    case 502:
    case 503:
      return DomainErrorHelpers.internal(`Sunucu hatasi: ${status}`);
    default:
      return DomainErrorHelpers.internal(`Beklenmedik HTTP hatasi: ${status}`);
  }
}
```

### 7.1.4. DomainError Kuralları

- Factory helper'lar **saf fonksiyondur**; side effect üretmez, log yazmaz, Sentry çağırmaz.
- Tüm DomainError tipleri **merkezi** tanımlanır: `packages/core/src/errors/`.
- Feature'lar kendi hata tipi uyduramaz; DomainErrorCode enum'undan kullanır.
- DomainError'ın UI'a çevrilmesi **orchestration hook'unda** yapılır; DomainError'un kendisi kullanıcıya gösterilecek mesaj taşımak zorunda değildir.

## 7.2. Service Factory

Birbiriyle ilişkili operasyonları namespace altında gruplamak için Service Factory pattern kullanılır:

```typescript
// packages/core/src/services/notificationService.ts

interface PushParams {
  userId: string;
  title: string;
  body: string;
  data?: Record<string, unknown>;
}

interface LocalParams {
  title: string;
  body: string;
  triggerAt: Date;
  channelId?: string;
}

export const NotificationService = {
  // Uzak push bildirim gonderimi
  sendPush: async (params: PushParams): Promise<void> => {
    const validated = pushParamsSchema.parse(params);
    await notificationRepository.sendPush(validated);
    analytics.track('push_sent', { userId: validated.userId });
  },

  // Yerel bildirim zamanlama
  scheduleLocal: async (params: LocalParams): Promise<string> => {
    const validated = localParamsSchema.parse(params);
    const id = await notificationRepository.scheduleLocal(validated);
    return id;
  },

  // Zamanlanmis bildirimi iptal etme
  cancelScheduled: async (id: string): Promise<void> => {
    await notificationRepository.cancelScheduled(id);
  },
};
```

### 7.2.1. Service Factory Kuralları

- Service factory, UseCase'lerin namespace grouping'idir; yeni bir soyutlama katmanı değildir.
- Her metod kendi içinde UseCase kurallarına uyar (input validation, error handling).
- Cohesion prensibi: Bir service factory yalnızca birbiriyle ilişkili operasyonları gruplar.
- God service yasaktır: Bir service factory 10'dan fazla metod içeriyorsa bölünmelidir.

---

# 8. ErrorBoundary Stratejisi (3 Katman)

Bu bölüm 06-application-architecture.md Bölüm 7.7'deki üç katmanlı error boundary hiyerarşisini servis katmanı pattern'leri bağlamında özetler ve hata tipi eşleme tablosunu tanımlar.

## 8.1. App-Level ErrorBoundary (Son Çizgi)

- **Konum:** App root wrapper, tüm provider'ların altında.
- **Hata tipi:** Hiçbir alt boundary'nin yakalayamadığı fatal hatalar.
- **UI:** Tam ekran hata sayfası: "Bir şeyler ters gitti. Uygulamayı yeniden başlatın." mesajı, restart butonu.
- **Aksiyon:** `Sentry.captureException` + `boundary_level: 'app'` tag'i.
- **Bu boundary'e düşmek:** Alt boundary'lerin yetersiz kaldığına işaret eden ciddi bir altyapı sorunudur.

## 8.2. Feature-Level ErrorBoundary (Feature İzolasyonu)

- **Konum:** Her feature modülünün root component'inde veya tab/stack navigator wrapper'ında.
- **Hata tipi:** Feature-scoped render hataları.
- **UI:** Feature-specific fallback: "Bu bölüm yüklenemedi. Tekrar dene." mesajı, retry butonu, isteğe bağlı "Ana sayfaya dön" linki.
- **Aksiyon:** `Sentry.captureException` + `boundary_level: 'feature'` + `feature_name: '{feature}'` tag'leri.
- **En kritik fayda:** Bir feature çöktüğünde diğer feature'lar etkilenmez.

## 8.3. Component-Level ErrorBoundary (Opsiyonel)

- **Konum:** Güvenilmez veya 3rd party component wrapper'ı (harita, grafik, video oynatıcı vb.).
- **Hata tipi:** Tekil component render hataları.
- **UI:** Inline fallback veya boş alan: "Harita yüklenemedi." gibi bağlamsal placeholder.
- **Aksiyon:** `Sentry.captureException` + `boundary_level: 'component'` + `component_name: '{component}'` tag'leri.

## 8.4. Error Tipi → Boundary Eşleme Tablosu

| DomainError Kodu    | Tetiklendiği Yer     | Yakalayan Boundary       | UI Aksiyonu                     |
| ------------------- | -------------------- | ------------------------ | ------------------------------- |
| `NETWORK_ERROR`     | Repository           | Feature                  | Retry butonu, offline banner    |
| `TIMEOUT`           | Repository           | Feature                  | Retry butonu                    |
| `UNAUTHORIZED`      | Repository / UseCase | Feature                  | Login ekranına yönlendirme      |
| `PERMISSION_DENIED` | UseCase              | Feature                  | Yetki uyarı mesajı              |
| `NOT_FOUND`         | Repository           | Component                | Boş state göster                |
| `VALIDATION_FAILED` | UseCase              | Hiçbiri (boundary değil) | Form inline error göster        |
| `CONFLICT`          | Repository           | Feature                  | Çakışma çözüm dialog'u          |
| `RATE_LIMITED`      | Repository           | Feature                  | Bekleme mesajı + otomatik retry |
| `INTERNAL_ERROR`    | Herhangi bir yer     | App (son çizgi)          | Restart seçeneği                |

## 8.5. ErrorBoundary Dışı Hata Yönetimi

Error boundary **yalnızca render hatalarını** yakalar. Aşağıdaki hata tipleri boundary dışında yönetilir:

- **Event handler hataları:** `try/catch` ile yakalanır, orchestration hook'unda işlenir.
- **Async hatalar:** TanStack Query `error` state'i veya `try/catch` ile yönetilir.
- **Validation hataları:** Form katmanında react-hook-form + Zod ile inline gösterilir.
- **Global unhandled hatalar:** `window.addEventListener('unhandledrejection', ...)` veya React Native global error handler ile yakalanıp Sentry'ye raporlanır.

---

# 9. State Management Patterns (Servis Katmanı Perspektifi)

Bu bölüm 09-state-management-strategy.md ile tutarlıdır ve servis katmanı pattern'leri bağlamında state türlerini ve konumlarını netleştirir.

## 9.1. State Türleri ve Konumları

| State Türü         | Araç                               | Konum                      | Servis Katmanı İlişkisi         |
| ------------------ | ---------------------------------- | -------------------------- | ------------------------------- |
| Server state       | TanStack Query                     | Cache layer                | Repository → Query hook         |
| Client UI state    | Zustand                            | Store dosyası              | Orchestration hook tüketir      |
| Auth/session state | Context + Zustand                  | Provider wrapper           | Auth UseCase üretir             |
| Form state         | react-hook-form + Zod              | Component-local            | UseCase input validation        |
| Component-local    | useState / useReducer              | Component                  | UI katmanında kalır             |
| Navigation state   | Router / Navigation                | Framework                  | Orchestration tetikler          |
| Persisted state    | MMKV (mobile) / localStorage (web) | Zustand persist middleware | Repository veya adapter yönetir |

## 9.2. State Machine Pattern (Finite State Machine)

Kompleks async operasyonlar için (ödeme akışı, çok adımlı form, dosya yükleme gibi) state machine pattern kullanılır:

```typescript
// Kaynak durumu icin genel tip
type ResourceStatus = 'idle' | 'pending' | 'loading' | 'success' | 'error';

interface ResourceState<T> {
  status: ResourceStatus;
  data: T | null;
  error: DomainError | null;
}

// Kullanim ornegi: Siparis olusturma state machine
type OrderCreationStatus =
  | 'idle' // Henuz baslanmadi
  | 'validating' // Input dogrulamasi yapiliyor
  | 'creating' // Repository cagrildi, bekleniyor
  | 'processing' // Odeme isleniyor
  | 'success' // Basarili
  | 'error'; // Hata

interface OrderCreationState {
  status: OrderCreationStatus;
  order: Order | null;
  error: DomainError | null;
  retryCount: number;
}
```

### 9.2.1. State Machine Kuralları

- Her state geçişi **açık** (explicit) olmalıdır; `status` alanı doğrudan atanır.
- Geçersiz state geçişleri type system ile engellenmelidir.
- State machine orchestration hook'unda yaşar; UseCase veya Repository state machine bilmez.
- Retry mekanizması state machine'e entegre edilir (`retryCount`, `maxRetries`).

## 9.3. Zustand Store Kuralları (Servis Katmanı Bağlamında)

- Store dosyası: Feature'ın `state/` veya `store/` klasöründe.
- Tek store = tek domain concern. "AppStore" gibi god store yasaktır.
- Persist: MMKV middleware (mobile), localStorage (web). ADR-019'a uygun.
- Action naming convention: `set`, `reset`, `toggle`, `add`, `remove`, `update` prefix'leri.
- Computed/derived state: Store içinde türetilmiş (derived) değer saklanmaz. Store dışında selector veya hook ile hesaplanır.
- Store, UseCase'i doğrudan çağırmaz. Orchestration hook store'u günceller.

---

# 10. Component Facade Pattern

## 10.1. Tanım

Doğrudan platform primitive'leri (React Native'in `Pressable`, `Text`, `TextInput`, `Image`, `Modal`, `ActivityIndicator` vb.) yerine sarmalayıcı (wrapper/facade) component kullanım standardıdır.

## 10.2. Neden Zorunlu?

- **Platform-agnostic API:** Web ve mobile için tek tip component kontratı.
- **Design system token enforcement:** Facade component'ler semantic token'ları zorunlu kılar; hardcoded değer geçilmesini engeller.
- **Accessibility prop'ları otomatik:** Facade component varsayılan `accessibilityRole`, `accessibilityLabel` gibi prop'ları sağlar.
- **Tema uyumu otomatik:** Renk, spacing, typography token'ları tema değişikliğinde otomatik güncellenir.
- **Tek noktadan değişiklik:** Platform API'sinde breaking change olduğunda yalnızca facade güncellenir; tüketici component'ler etkilenmez.

## 10.3. Facade Kataloğu

| Platform Primitive               | Facade Component  | Konum                                             |
| -------------------------------- | ----------------- | ------------------------------------------------- |
| `Pressable` / `TouchableOpacity` | `Button`          | `packages/ui/src/components/core/Button`          |
| `Text`                           | `Text`            | `packages/ui/src/components/core/Text`            |
| `Modal`                          | `AppModal`        | `packages/ui/src/components/core/Modal`           |
| `Image`                          | `AutoImage`       | `packages/ui/src/components/core/AutoImage`       |
| `TextInput`                      | `Input`           | `packages/ui/src/components/core/Input`           |
| `ActivityIndicator`              | `LoadingSpinner`  | `packages/ui/src/components/core/LoadingSpinner`  |
| `ScrollView`                     | `ScrollContainer` | `packages/ui/src/components/core/ScrollContainer` |
| `FlatList`                       | `DataList`        | `packages/ui/src/components/core/DataList`        |

## 10.4. ESLint Enforcement

Custom ESLint kuralları ile raw primitive import/kullanım engellenir:

```
// eslint kuralı: no-restricted-imports
// react-native'den Pressable, TouchableOpacity, TextInput, Image, Modal importu YASAK
// Bunun yerine packages/ui facade component'leri kullanılmalı
```

Bu kural CI pipeline'da otomatik denetlenir. İstisna: Facade component'in kendisi platform primitive'i import edebilir.

---

# 11. Icon Facade Pattern

## 11.1. Kural

Doğrudan icon kütüphanesi importu **YASAK**tır. Tüm icon erişimi merkezi `Icon` component üzerinden yapılır.

```typescript
// YASAK: Dogrudan kutuphane importu
import { Heart } from 'phosphor-react-native';
import { Ionicons } from '@expo/vector-icons';

// DOGRU: Merkezi Icon facade
import { Icon } from '@/components/core/Icon';

// Kullanim
<Icon name="heart" size={24} />
<Icon name="settings" size={20} color="textSecondary" />
```

## 11.2. Neden?

- **Kütüphane değişikliği tek noktadan:** Icon kütüphanesi değiştiğinde (ör. Ionicons → Phosphor) yalnızca facade güncellenir.
- **Token uyumu:** `color` prop'u semantic token kabul eder; hardcoded renk değeri yerine `"textPrimary"`, `"textSecondary"` gibi token adları.
- **Tutarlı boyutlandırma:** `size` prop'u design system scale'ine bağlı sabit boyutlar sunar.
- **Accessibility:** Facade component varsayılan `accessibilityRole="image"` ve dekoratif ikonlar için otomatik `aria-hidden` sağlar.

---

# 12. Offline Queue Pattern

Mobile uygulamalar için ağ bağlantısı kesildiğinde operasyonların kaybolmamasını sağlayan pattern.

## 12.1. Genel Yapı

```typescript
// packages/core/src/infrastructure/offlineQueue/types.ts

type QueuePriority = 'high' | 'normal';

interface QueueItem<T = unknown> {
  id: string;
  operation: string; // UseCase adi (ornegin 'createOrder')
  payload: T; // UseCase parametreleri
  priority: QueuePriority;
  createdAt: number; // Unix timestamp
  expiresAt: number; // Unix timestamp
  retryCount: number;
  maxRetries: number;
  lastError?: DomainError;
}

interface OfflineQueueConfig {
  maxItems: number; // Kuyrukta maksimum oğe (varsayılan: 100)
  defaultExpiry: number; // Varsayılan son kullanma süresi (ms) (varsayılan: 24 saat)
  retryBackoff: 'linear' | 'exponential'; // Yeniden deneme stratejisi
  maxRetries: number; // Maksimum yeniden deneme sayısı (varsayılan: 5)
}
```

## 12.2. Offline Queue Akışı

```
Kullanıcı aksiyonu
  └─→ Orchestration hook: Ağ durumunu kontrol et
        ├─→ Online: UseCase'i doğrudan çalıştır
        └─→ Offline: Kuyruğa ekle (MMKV persist)
              └─→ Ağ geri geldiğinde:
                    └─→ Kuyruğu sırayla işle (priority → createdAt)
                          ├─→ Başarılı: Kuyruktan kaldır
                          └─→ Başarısız: retryCount++
                                ├─→ maxRetries aşılmadı: Exponential backoff ile tekrar dene
                                └─→ maxRetries aşıldı: Hata raporla, kullanıcıyı bilgilendir
```

## 12.3. Offline Queue Kuralları

- Persist: MMKV üzerinde; app restart'ta kuyruk korunur (ADR-019 uyumlu).
- Priority: `high` öncelikli öğeler her zaman `normal` önce işlenir.
- Expiry: Süresi dolan öğeler otomatik kuyruktan kaldırılır.
- Idempotency: Kuyruktaki operasyonlar idempotent olmalıdır; aynı operasyon iki kez çalışsa bile tutarsızlık yaratmamalıdır.
- UI feedback: Kuyrukta bekleyen öğe sayısı kullanıcıya gösterilir.
- Web desteği: Web'de localStorage veya IndexedDB ile eşdeğer mekanizma kullanılır.

---

# 13. Realtime Subscription Pattern

Firestore, WebSocket veya benzeri gerçek zamanlı veri kaynakları için standart subscription yönetim pattern'i.

## 13.1. Sorun

Gerçek zamanlı veri kaynakları yönetilmezse şu sorunlar oluşur:

- Component unmount'ta listener temizlenmez → memory leak.
- Aynı query'ye birden fazla subscription açılır → gereksiz okuma maliyeti.
- Bağlantı koparsa otomatik yeniden bağlanma yoktur.
- Subscription lifecycle'ı component lifecycle'ına sıkı bağlı olur; paylaşım zorlaşır.

## 13.2. Realtime Registry Pattern

Merkezi bir registry, aktif subscription'ları yönetir:

```typescript
// packages/core/src/infrastructure/realtime/realtimeRegistry.ts

interface SubscriptionEntry {
  key: string; // Benzersiz subscription anahtari (ornekin 'users/{userId}')
  refCount: number; // Kac consumer dinliyor
  unsubscribe: () => void; // Gercek listener temizleme fonksiyonu
  lastData: unknown; // Son alinan veri (yeni consumer'a hemen sunmak icin)
  status: 'active' | 'reconnecting' | 'error';
}

// Registry API'si
export const RealtimeRegistry = {
  // Subscription baslatma veya mevcut olana baglantı
  subscribe: (key: string, listenFn: () => Unsubscribe): SubscriptionEntry => {
    // Eger ayni key'de aktif subscription varsa refCount artir, yeni listener acma
    // Yoksa yeni subscription baslat, registry'e ekle
  },

  // Subscription birakma
  release: (key: string): void => {
    // refCount azalt
    // refCount 0'a dustuyse gercek unsubscribe cagir ve registry'den kaldir
  },

  // Tum subscriptionlari temizleme (app logout veya cleanup icin)
  releaseAll: (): void => {
    // Tum aktif subscriptionlari kapat
  },
};
```

## 13.3. useRealtimeResource Hook

Orchestration katmanında realtime veriyi tüketen standart hook:

```typescript
// packages/core/src/hooks/useRealtimeResource.ts

interface UseRealtimeResourceOptions<T> {
  key: string;
  listenFn: () => Unsubscribe;
  enabled?: boolean;
}

interface UseRealtimeResourceResult<T> {
  data: T | null;
  status: 'idle' | 'loading' | 'connected' | 'reconnecting' | 'error';
  error: DomainError | null;
}

function useRealtimeResource<T>(
  options: UseRealtimeResourceOptions<T>,
): UseRealtimeResourceResult<T> {
  // 1. Component mount'ta RealtimeRegistry.subscribe cagir
  // 2. Component unmount'ta RealtimeRegistry.release cagir
  // 3. Status degisikliklerini state olarak sun
  // 4. Reconnect mekanizmasi entegre
}
```

## 13.4. Realtime Subscription Kuralları

- **Ref-counted:** Aynı query'ye birden fazla component subscribe olduğunda tek bir gerçek listener çalışır.
- **Otomatik cleanup:** Component unmount'ta `release` çağrılır; `refCount` 0'a düşünce gerçek listener kapatılır.
- **Retry mekanizması:** Transient error'larda otomatik yeniden bağlanma (exponential backoff, max 5 retry).
- **Singleton registry:** `RealtimeRegistry` app lifecycle'ında singleton olarak yaşar.
- **Logout cleanup:** Kullanıcı çıkış yaptığında `releaseAll()` çağrılarak tüm subscription'lar temizlenir.

---

# 14. Orchestration Hook Pattern

Feature Orchestration Layer'ın somut uygulama birimi olan hook pattern'i.

## 14.1. Tanım

Orchestration hook, bir ekran veya feature akışının UI ile domain/data katmanları arasındaki köprüsüdür. Screen component'i "aptal" (presentational) tutar; tüm veri çekme, state yönetimi, user intent → UseCase çevirisi hook'ta yapılır.

## 14.2. Hook Yapısı

```typescript
// apps/{app}/src/features/order/hooks/useCreateOrder.ts

interface UseCreateOrderResult {
  // State
  status: OrderCreationStatus;
  order: Order | null;
  error: DomainError | null;

  // Aksiyonlar
  submitOrder: (params: CreateOrderParams) => Promise<void>;
  resetState: () => void;
}

export function useCreateOrder(): UseCreateOrderResult {
  const [state, setState] = useState<OrderCreationState>({
    status: 'idle',
    order: null,
    error: null,
    retryCount: 0,
  });

  const submitOrder = async (params: CreateOrderParams) => {
    setState((prev) => ({ ...prev, status: 'creating', error: null }));
    try {
      const result = await createOrder(params); // UseCase cagrisi
      setState({ status: 'success', order: result.order, error: null, retryCount: 0 });
      // UI side-effect'ler burada tetiklenir
      showSuccessToast('Siparis basariyla olusturuldu');
    } catch (error) {
      const domainError = isDomainError(error)
        ? error
        : DomainErrorHelpers.internal('Beklenmedik hata', error as Error);
      setState((prev) => ({
        ...prev,
        status: 'error',
        error: domainError,
        retryCount: prev.retryCount + 1,
      }));
      Sentry.captureException(error);
    }
  };

  const resetState = () => {
    setState({ status: 'idle', order: null, error: null, retryCount: 0 });
  };

  return { status: state.status, order: state.order, error: state.error, submitOrder, resetState };
}
```

## 14.3. Hook Kuralları

- Screen component yalnızca hook'un döndürdüğü state ve aksiyonları kullanır.
- Hook içinde JSX render edilmez.
- Hook UseCase'i çağırır, repository'yi doğrudan çağırabilir (basit okuma işlemlerinde).
- UI side-effect'ler (toast, navigation, modal) hook'ta tetiklenir; UseCase'de değil.
- Hook platform-agnostic olmalıdır; web/mobile farkı hook içinde çözülmez.

---

# 15. Derived Project Miras Kuralları

45-boilerplate-project-boundary-contract.md'deki üç katmanlı miras modeline uygun olarak, bu dokümandaki pattern'lerin miras durumu aşağıdaki gibidir:

## 15.1. Zorunlu Miras (Override YASAK)

Aşağıdaki kurallar derived project'lerde olduğu gibi geçerlidir; gevşetilemez:

| Kural                                                             | Referans Bölüm |
| ----------------------------------------------------------------- | -------------- |
| Repository interface kontratı (CRUD + pagination + error mapping) | 5.3, 5.4, 5.5  |
| UseCase single responsibility prensibi                            | 6.4            |
| DomainError hiyerarşisi ve merkezi tanım zorunluluğu              | 7.1            |
| ErrorBoundary 3-katman stratejisi (app, feature, component)       | 8.1–8.3        |
| UI katmanının doğrudan veri kaynağına erişim yasağı               | 3 (Temel Tez)  |
| Component Facade zorunluluğu (raw primitive import yasağı)        | 10.4           |
| Icon Facade zorunluluğu (doğrudan icon kütüphanesi import yasağı) | 11.1           |
| Async/await zorunluluğu (Promise chain yasağı)                    | 6.4            |

## 15.2. Yapısal Miras (Yapı Sabit, İçerik Genişletilebilir)

| Yapı                            | Sabit Olan                            | Genişletilebilir Olan      |
| ------------------------------- | ------------------------------------- | -------------------------- |
| Repository klasör yapısı        | `data/repositories/` hiyerarşisi      | Ek repository dosyaları    |
| UseCase klasör yapısı           | `data/usecases/{domain}/` hiyerarşisi | Ek UseCase dosyaları       |
| DomainErrorCode enum            | Base 9 hata kodu                      | Ek proje-özel hata kodları |
| Facade kataloğu                 | Base 8 facade component               | Ek facade component'ler    |
| Error → Boundary eşleme tablosu | Base eşleme kuralları                 | Ek eşleme satırları        |

## 15.3. Felsefi Miras (Prensip Bağlar, Uygulama Yorumlanabilir)

| Prensip                                                 | Bağlayan                              | Yorumlanabilir                                    |
| ------------------------------------------------------- | ------------------------------------- | ------------------------------------------------- |
| UI → Hook → UseCase → Repository → Infrastructure akışı | Tek yönlü bağımlılık yönü             | Katman adlandırması, dosya organizasyon detayları |
| Offline queue pattern                                   | Idempotency ve retry prensibi         | Persist mekanizması (MMKV/IndexedDB/localStorage) |
| Realtime subscription                                   | Ref-counted ve cleanup prensibi       | Registry implementasyon detayları                 |
| State machine                                           | Açık (explicit) state geçişi prensibi | Status enum değerleri, geçiş kuralları            |

---

# 16. Anti-Pattern Kataloğu

Bu bölüm, tüm pattern'lerdeki "YAPILMAMALI" davranışlarını tek bir referans noktasında toplar.

## 16.1. Veri Erişimi Anti-Pattern'leri

| Anti-Pattern                         | Açıklama                                 | Doğru Yaklaşım                                        |
| ------------------------------------ | ---------------------------------------- | ----------------------------------------------------- |
| Screen'de doğrudan API çağrısı       | `useEffect(() => fetch('/api/users'))`   | Orchestration hook → Repository                       |
| Screen'de doğrudan Firestore çağrısı | `firestore.collection('users').get()`    | Orchestration hook → Repository                       |
| Repository'de business validation    | `if (user.balance < order.total) throw`  | UseCase'de yap                                        |
| Repository'den UI state döndürme     | `return { isLoading, data, error }`      | Repository saf veri döndürür; hook state shape üretir |
| Repository → Repository çağrısı      | `orderRepo` içinden `userRepo.getById()` | UseCase multi-repo koordinasyonu yapar                |
| Sınırsız liste sorgusu               | `getAllUsers()`                          | `getList({ limit: 20, cursor })`                      |
| N+1 query                            | `users.map(u => getOrders(u.id))`        | Batch query: `getOrdersByUserIds(ids)`                |

## 16.2. İş Mantığı Anti-Pattern'leri

| Anti-Pattern                       | Açıklama                               | Doğru Yaklaşım                                          |
| ---------------------------------- | -------------------------------------- | ------------------------------------------------------- |
| UseCase'de toast/navigation        | `showToast('Başarılı')`                | Hook'ta UseCase sonucuna göre tetikle                   |
| God UseCase                        | 500+ satır, 10+ sorumluluk             | Böl: Tek UseCase = tek iş kuralı                        |
| Raw error fırlatma                 | `throw new Error('Hata')`              | `throw DomainErrorHelpers.internal('Hata')`             |
| Platform-specific logic UseCase'de | `if (Platform.OS === 'ios')`           | Infrastructure adapter'ında çöz                         |
| Circular dependency                | RepoA → RepoB → RepoA                  | UseCase koordinasyon yapar; repo'lar birbirini çağırmaz |
| UseCase'de React hook              | `const [state, setState] = useState()` | UseCase saf async fonksiyondur; hook kullanmaz          |

## 16.3. State Yönetimi Anti-Pattern'leri

| Anti-Pattern                   | Açıklama                              | Doğru Yaklaşım                    |
| ------------------------------ | ------------------------------------- | --------------------------------- |
| God store                      | `useAppStore` her şeyi içerir         | Tek store = tek domain concern    |
| Store'da derived state saklama | `fullName: first + ' ' + last`        | Selector veya hook ile hesapla    |
| Store'dan UseCase çağırma      | `store.action` içinde `createOrder()` | Hook → UseCase → Store güncelleme |
| Promise chain                  | `.then().catch().finally()`           | `async/await` + `try/catch`       |

## 16.4. Component Anti-Pattern'leri

| Anti-Pattern              | Açıklama                                        | Doğru Yaklaşım                                      |
| ------------------------- | ----------------------------------------------- | --------------------------------------------------- |
| Raw primitive import      | `import { Pressable } from 'react-native'`      | `import { Button } from '@/components/core/Button'` |
| Doğrudan icon import      | `import { Heart } from 'phosphor-react-native'` | `import { Icon } from '@/components/core/Icon'`     |
| Hardcoded renk            | `color: '#FF5733'`                              | `color: tokens.colors.textPrimary`                  |
| Hardcoded spacing         | `padding: 16`                                   | `padding: tokens.spacing.md`                        |
| Inline user-facing string | `<Text>Hoş geldiniz</Text>`                     | `<Text>{t('welcome.title')}</Text>` (i18n)          |

---

# 17. Test Stratejisi Entegrasyonu

Servis katmanı pattern'leri test edilebilirlik için tasarlanmıştır. Her katmanın test yaklaşımı:

## 17.1. Repository Testleri

- **Test türü:** Integration test.
- **Mock:** Veri kaynağı mock'lanır (Firestore emulator, MSW ile REST API mock).
- **Doğrulama:** CRUD operasyonları, pagination, error mapping.
- **Konum:** Repository dosyasının yanında `*.test.ts`.

## 17.2. UseCase Testleri

- **Test türü:** Unit test.
- **Mock:** Repository mock'lanır (dependency injection veya module mock).
- **Doğrulama:** İş kuralları, input validation, error handling, side effect tetiklenmesi.
- **Konum:** UseCase dosyasının yanında `*.test.ts`.
- **Önem:** UseCase testleri en kritik testlerdir çünkü iş kurallarını doğrular.

## 17.3. Orchestration Hook Testleri

- **Test türü:** Integration test (renderHook ile).
- **Mock:** UseCase ve/veya repository mock'lanır.
- **Doğrulama:** State geçişleri, loading/error/success akışları, UI side-effect tetiklenmesi.
- **Konum:** Hook dosyasının yanında `*.test.ts(x)`.

## 17.4. DomainError Testleri

- **Test türü:** Unit test.
- **Doğrulama:** Her factory helper'ın doğru `code` ve `message` ürettiği.
- **Konum:** `packages/core/src/errors/__tests__/domainError.test.ts`.

---

# 18. Karar Ağacı: Hangi Pattern'i Ne Zaman Kullan?

Bir geliştirici yeni bir feature implement ederken şu karar ağacını takip eder:

```
Veri kaynağına erişim gerekiyor mu?
  EVET → Repository oluştur veya mevcut repository'yi kullan
  HAYIR → Repository gerekmez

İş kuralı veya multi-repo koordinasyonu var mı?
  EVET → UseCase oluştur
  HAYIR → Hook doğrudan repository'yi çağırabilir

Ekran state yönetimi gerekiyor mu?
  EVET → Orchestration hook oluştur
  HAYIR → Basit component-local state yeterli

Kompleks async akış var mı? (ödeme, çok adımlı form, dosya yükleme)
  EVET → State machine pattern kullan
  HAYIR → Basit status state yeterli

Offline destek gerekiyor mu?
  EVET → Offline queue pattern'i entegre et
  HAYIR → Standart online akış

Gerçek zamanlı veri gerekiyor mu?
  EVET → Realtime subscription pattern'i kullan
  HAYIR → Standart polling veya one-shot fetch

Platform primitive'i mi kullanıyorum?
  EVET → Facade component kullan, raw primitive YASAK
  HAYIR → Devam et

İkon mu kullanıyorum?
  EVET → Icon facade kullan, doğrudan kütüphane import YASAK
  HAYIR → Devam et
```

---

# 19. Referanslar

| Doküman                                         | İlişki                                         |
| ----------------------------------------------- | ---------------------------------------------- |
| `06-application-architecture.md`                | Katman tanımları ve bağımlılık yönü            |
| `07-module-boundaries-and-code-organization.md` | Modül sınırları ve import kuralları            |
| `09-state-management-strategy.md`               | State türleri ve sahiplik modeli               |
| `10-data-fetching-cache-sync.md`                | TanStack Query entegrasyonu, cache policy      |
| `11-forms-inputs-and-validation.md`             | Form state ve Zod validation                   |
| `25-error-empty-loading-states.md`              | Hata, boş ve yükleniyor durumları UI standardı |
| `36-canonical-stack-decision.md`                | Canonical stack ve kütüphane kararları         |
| `37-dependency-policy.md`                       | Dependency ekleme/yönetme politikası           |
| `45-boilerplate-project-boundary-contract.md`   | Derived project miras kuralları                |
| ADR-004                                         | Zustand state management                       |
| ADR-005                                         | TanStack Query data fetching                   |
| ADR-006                                         | React Hook Form + Zod                          |
| ADR-009                                         | Sentry observability                           |
| ADR-019                                         | MMKV local storage, offline-first              |
