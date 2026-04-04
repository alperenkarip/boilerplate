# 50-coding-standards-and-file-conventions.md

## Doküman Kimliği

- **Doküman adı:** Coding Standards and File Conventions
- **Dosya adı:** `50-coding-standards-and-file-conventions.md`
- **Doküman türü:** Specification / coding standards / file organization / naming conventions
- **Durum:** Accepted
- **Tarih:** 2026-04-03
- **Kapsam:** Bu boilerplate kapsamında kod organizasyonunu, dosya konvansiyonlarını, isimlendirme kurallarını, import düzenini, TypeScript disiplinini, component/hook/form/style/async/logging/test/i18n/security kurallarını ve kalite eşiklerini hem insan geliştiriciler hem de AI araçları için standartlaştırır. Derived project'lerde tutarlılık sağlamak için miras kurallarını tanımlar.
- **Bağlı olduğu üst dokümanlar:**
  - `00-project-charter.md`
  - `01-working-principles.md`
  - `06-application-architecture.md`
  - `07-module-boundaries-and-code-organization.md`
  - `36-canonical-stack-decision.md`
  - `37-dependency-policy.md`
  - `45-boilerplate-project-boundary-contract.md`
- **Doğrudan etkileyeceği dokümanlar:**
  - `14-testing-strategy.md`
  - `15-quality-gates-and-ci-rules.md`
  - `16-tooling-and-governance.md`
  - `21-repo-structure-spec.md`
  - `23-component-governance-rules.md`
  - `30-contribution-guide.md`
  - `31-audit-checklist.md`
  - `32-definition-of-done.md`
  - `44-exception-and-exemption-policy.md`

---

# 1. Amac

Bu dokümanın amacı, boilerplate'in kodlama standartlarını "herkesin kendi alışkanlığına bırak" seviyesinden çıkarıp; **baştan sınırları tanımlı, isimlendirmesi tutarlı, import düzeni belirli, dosya boyutu kontrollü, tip güvenliği garanti altında ve hem insan hem AI araçları tarafından aynı şekilde uygulanan** bir disiplin haline getirmektir.

Bu belge özellikle şu sorulara net ve operasyonel cevap verir:

1. Bir dosya kaç satır olabilir, aşarsa ne yapılmalıdır?
2. Bir fonksiyon, component, hook ne kadar büyük olabilir?
3. Dosyalar nasıl isimlendirilir, klasörler nasıl organize edilir?
4. Import sıralaması nasıl olmalıdır, hangi importlar yasaktır?
5. TypeScript'te hangi tip kullanımları yasaktır?
6. Component ve hook yazarken hangi kurallar geçerlidir?
7. Style ve token kullanımında hardcoded değer neden ve nasıl engellenir?
8. Async işlem, hata yönetimi, logging, test, i18n, güvenlik konularında nelere dikkat edilmelidir?
9. Derived project'ler bu kuralları nasıl miras alır?
10. Anti-pattern'ler nelerdir ve ESLint ile nasıl enforce edilir?

Bu belge mimari katman belgesi değildir — 06'da tanımlanan katman yapısının **kodlama düzeyindeki disiplin kurallarıdır**.
Bu belge modül sınır belgesi değildir — 07'de tanımlanan boundary kurallarının **dosya ve import düzeyindeki pratik uygulamasıdır**.

---

# 2. Dosya Boyut Limitleri

## 2.1. Metrik Tablosu

| Metrik                     | Hedef | Uyarı (warn) | Hard Limit (error) |
| -------------------------- | ----- | ------------ | ------------------ |
| Dosya satır sayısı         | ≤300  | >500         | >800               |
| Fonksiyon satır sayısı     | ≤50   | >80          | >150               |
| Fonksiyon parametre sayısı | ≤3    | >4           | >6                 |
| Component JSX derinliği    | ≤4    | >5           | >7                 |
| Import sayısı              | ≤15   | >20          | >30                |
| Cyclomatic complexity      | ≤10   | >15          | >25                |

## 2.2. Neden 300 Satır Hedef?

300 satır hedefi üç temel gerekçeye dayanır:

**Single Responsibility:** 300 satırı aşan bir dosya neredeyse her zaman birden fazla sorumluluk taşır. Veri çekme, dönüştürme, UI render ve event handling aynı dosyada birleştiğinde dosya şişer. 300 satır sınırı, dosyanın tek bir sorumluluğa odaklanmasını doğal olarak zorlar.

**Okunabilirlik:** Bir geliştirici (veya AI aracı) dosyayı açtığında, 300 satırlık bir dosya tam olarak ekranda veya çalışma belleğinde kavranabilir. 500+ satırlık dosyalar scroll gerektiren, bağlam kaybına yol açan, review süresini uzatan dosyalardır.

**Review Kolaylığı:** Pull request'te değişen dosyanın tamamını kavramak, 300 satırlık dosyalarda dakikalar, 800+ satırlık dosyalarda saatler alır. Küçük dosyalar daha hızlı review edilir, daha az bug geçirir.

## 2.3. Dosya Boyutu Aşıldığında Ne Yapılmalı?

Bir dosya 300 satır hedefini aştığında aşağıdaki bölme stratejileri uygulanır:

**Component bölme:** JSX render kısmı büyükse, alt component'lere ayır. Tekrarlanan UI blokları, koşullu render bölümleri ve liste öğeleri ayrı component dosyalarına çıkarılır.

**Hook çıkarma:** State yönetimi, side effect'ler veya veri çekme mantığı component içinde şişiyorsa, custom hook olarak ayrı dosyaya taşınır. Bir component'te 3+ useState veya 2+ useEffect varsa hook çıkarma sinyalidir.

**Service ayrıştırma:** İş mantığı (business logic), veri dönüştürme (transform/map), validasyon kuralları component veya hook içinde büyüyorsa, `services/` veya `utils/` altına taşınır.

**Tip ayrıştırma:** Interface ve type tanımları dosyanın önemli bir kısmını kaplıyorsa, `*.types.ts` dosyasına çıkarılır.

**Sabit ayrıştırma:** Büyük konfigürasyon objeleri, enum benzeri sabitler, mapping tabloları `constants/` altına taşınır.

## 2.4. Sayım Kuralları

- Boş satırlar sayıma **dahil değildir** (`skipBlankLines: true`)
- Yorum satırları sayıma **dahil değildir** (`skipComments: true`)
- Sadece çalışan kod satırları sayılır

## 2.5. İstisnalar

**Test dosyaları:** Test dosyalarında (`*.test.ts`, `*.test.tsx`) dosya satır limiti gevşetilir. Hedef 500, warn 800, hard limit 1200. Test dosyaları mock data, setup, birden fazla test case ve assertion içerdiğinden doğal olarak daha uzun olur.

**Theme/token tanım dosyaları:** Design token tanım dosyaları (`tokens.ts`, `theme.ts`, `colors.ts` vb.) büyük mapping yapıları içerir. Bu dosyalarda satır limiti uygulanmaz ancak her token kategorisi ayrı dosyaya bölünmelidir.

**Story dosyaları:** Storybook story dosyaları (`*.stories.tsx`) birden fazla variant ve args kombinasyonu içerir. Hedef 500, warn 800.

**Konfigürasyon dosyaları:** ESLint, TypeScript, Vite gibi araç konfigürasyonları gerektiği kadar uzun olabilir.

**Auto-generated dosyalar:** Otomatik üretilen dosyalar (i18n tipler, API client, schema çıktıları) bu limitlerden muaftır.

---

# 3. Naming Conventions

## 3.1. Dosya İsimlendirme

| Tür            | Format                         | Örnek                     | Açıklama                                      |
| -------------- | ------------------------------ | ------------------------- | --------------------------------------------- |
| Component      | PascalCase                     | `UserProfile.tsx`         | Component adı ile dosya adı birebir eşleşmeli |
| Hook           | camelCase, `use` prefix        | `useUserProfile.ts`       | `use` prefix React hook convention'ıdır       |
| Utility        | camelCase                      | `formatDate.ts`           | Genel amaçlı yardımcı fonksiyonlar            |
| Service        | camelCase, verbNoun            | `fetchUsers.ts`           | API çağrıları ve iş mantığı orchestration     |
| Type/Interface | PascalCase, `.types` suffix    | `UserProfile.types.ts`    | Dosya adı tip adını yansıtmalı                |
| Test           | kaynak adı + `.test`           | `UserProfile.test.tsx`    | Kaynak dosyanın hemen yanında                 |
| Story          | kaynak adı + `.stories`        | `UserProfile.stories.tsx` | Kaynak dosyanın hemen yanında                 |
| Constant       | camelCase veya SCREAMING_SNAKE | `apiEndpoints.ts`         | İçerikteki sabitlerin doğasına göre           |
| Config         | kebab-case                     | `eslint-config.js`        | Araç konfigürasyon dosyaları                  |
| Schema (Zod)   | camelCase, `Schema` suffix     | `userProfileSchema.ts`    | Validasyon şema dosyaları                     |
| Index          | `index.ts`                     | `index.ts`                | Sadece package public API entry point         |

**Dosya uzantı kuralları:**

- `.tsx`: JSX içeren dosyalar (component, story, JSX içeren test)
- `.ts`: JSX içermeyen dosyalar (hook, util, service, type, constant, schema)
- `.test.tsx` / `.test.ts`: Test dosyaları (JSX varlığına göre uzantı seçilir)

## 3.2. Kod İsimlendirme

| Tür                | Format                            | Doğru Örnek                                         | Anti-pattern                                  |
| ------------------ | --------------------------------- | --------------------------------------------------- | --------------------------------------------- |
| Component          | PascalCase                        | `UserProfile`                                       | `userProfile`, `user_profile`, `USER_PROFILE` |
| Hook               | camelCase, `use` prefix           | `useAuth`                                           | `authHook`, `UseAuth`, `use_auth`             |
| Fonksiyon          | camelCase, verbNoun               | `fetchUserProfile`                                  | `userData`, `getit`, `doStuff`                |
| Boolean değişken   | `is`/`has`/`should`/`can` prefix  | `isLoading`, `hasError`, `shouldRetry`, `canSubmit` | `loading`, `loaded`, `error`, `retry`         |
| Constant           | SCREAMING_SNAKE_CASE              | `MAX_RETRY_COUNT`                                   | `maxRetryCount`, `max_retry_count`            |
| Type/Interface     | PascalCase, `I` prefix YASAK      | `UserProfile`                                       | `IUserProfile`, `userProfile`, `user_profile` |
| Enum               | PascalCase, tekil isim            | `UserRole`                                          | `UserRoles`, `userRole`, `USER_ROLE`          |
| Enum değeri        | PascalCase veya SCREAMING_SNAKE   | `UserRole.Admin` veya `UserRole.ADMIN`              | `UserRole.admin`                              |
| Event handler      | `handle`/`on` prefix              | `handleSubmit`, `onPress`                           | `submitHandler`, `clickAction`                |
| Callback prop      | `on` prefix                       | `onSubmit`, `onChange`, `onPress`                   | `submitCallback`, `changeHandler`             |
| Render prop        | `render` prefix                   | `renderItem`, `renderHeader`                        | `itemRenderer`, `headerComponent`             |
| Generic type param | Anlamlı tek/çift harf veya kelime | `T`, `TData`, `TError`                              | `Type1`, `x`, `a`                             |
| Context            | PascalCase + `Context` suffix     | `AuthContext`                                       | `authCtx`, `AUTH_CONTEXT`                     |
| Provider           | PascalCase + `Provider` suffix    | `AuthProvider`                                      | `authProv`, `AuthProv`                        |

**Kısaltma kuralları:**

- 3 harften kısa kısaltmalar: Tümü büyük (`ID`, `UI`, `API`)
- 3+ harfli kısaltmalar: Sadece ilk harf büyük (`Http`, `Url`, `Json`)
- Component adlarında kısaltma serbest: `UserID`, `ApiClient`
- Değişken adlarında kısaltma son ek olarak: `userId`, `apiUrl`

## 3.3. Klasör İsimlendirme

**Genel kurallar:**

- Tüm klasörler: **kebab-case** (küçük harf, tire ile ayrılmış)
- Feature klasörleri: **tekil isim** kullanılır (`user-profile/`, `user-profiles/` değil)
- Klasör açma kriteri: **3+ ilişkili dosya** bir araya geldiğinde klasör oluşturulur; 1-2 dosya için klasör açmak gereksiz iç içe yapı yaratır
- Maksimum nested seviye: **4** (src/features/user-profile/components/ = 4 seviye)
- Boş klasör **YASAK**: İçi boş placeholder klasör commit edilmez

**Sabit klasör adları:**
Feature modülü altında kullanılan klasör adları standarttır ve keyfi isimlendirme yapılmaz:

| Klasör        | İçerik                           |
| ------------- | -------------------------------- |
| `components/` | UI bileşenleri                   |
| `hooks/`      | Custom hook'lar                  |
| `services/`   | UseCase + API çağrıları          |
| `state/`      | Zustand slice veya local state   |
| `types/`      | Tip tanımları                    |
| `utils/`      | Yardımcı fonksiyonlar            |
| `schemas/`    | Zod validasyon şemaları          |
| `constants/`  | Sabit değerler                   |
| `__tests__/`  | Entegrasyon testleri (opsiyonel) |

**Yasaklı klasör adları:**
`common/`, `shared/`, `misc/`, `helpers/`, `lib/`, `stuff/`, `temp/`, `old/`, `backup/` — bu isimler belirsiz sorumluluk ifade eder ve zamanla çöplük haline gelir. Bunlar yerine spesifik amaç belirten isimler kullanılmalıdır.

---

# 4. Dosya Organizasyonu ve Klasör Yapısı

## 4.1. Feature Modül Yapısı

Her feature modülü kendi kendine yeten, bağımsız bir birimdir. Feature'lar arası doğrudan bağımlılık yasaktır — paylaşılması gereken kod `packages/` katmanına çıkarılır.

```
features/{feature-name}/
├── components/         # Feature'a özel UI bileşenleri
│   ├── UserCard.tsx
│   └── UserAvatar.tsx
├── hooks/             # Feature'a özel hook'lar
│   └── useUserProfile.ts
├── services/          # UseCase + API çağrıları
│   └── fetchUserProfile.ts
├── state/             # Zustand slice veya local state
│   └── userProfileStore.ts
├── types/             # Feature'a özel tipler
│   └── UserProfile.types.ts
├── utils/             # Feature'a özel yardımcılar
│   └── formatUserName.ts
├── schemas/           # Zod validasyon şemaları
│   └── userProfileSchema.ts
├── constants/         # Feature'a özel sabitler
│   └── userRoles.ts
├── __tests__/         # Entegrasyon testleri (opsiyonel)
│   └── userProfileFlow.test.ts
└── index.ts           # Public API (controlled exports)
```

**`index.ts` kuralı:** Feature modülünün dışarıya açılan tek kapısıdır. Sadece bilinçli olarak dışarıya sunulan export'lar burada yer alır. Feature'ın internal dosyalarına doğrudan erişim (deep import) yasaktır.

## 4.2. Core/Shared Yapısı

Platform-agnostic iş mantığı ve paylaşılan altyapı `packages/` altında yaşar:

```
packages/core/src/
├── domain/            # İş kuralları (platform bağımsız)
│   ├── entities/      # Domain entity'leri
│   └── value-objects/ # Value object'ler
├── data/              # Repository pattern, veri erişimi
│   ├── repositories/  # Veri kaynağı soyutlama
│   └── usecases/      # İş mantığı orchestration
├── errors/            # DomainError hiyerarşisi
│   ├── DomainError.ts
│   └── errorCodes.ts
├── hooks/             # Paylaşılan hook'lar
├── services/          # Paylaşılan servisler
├── types/             # Paylaşılan tip tanımları
├── utils/             # Paylaşılan yardımcılar
└── validation/        # Zod şemaları (paylaşılan)
```

## 4.3. App Shell Yapısı (Web)

```
apps/web/src/
├── App.tsx             # Root component
├── main.tsx            # Vite entry point
├── router.tsx          # React Router yapılandırması
├── auth/               # Auth mantığı (HttpOnly cookie)
├── components/         # App seviyesi paylaşılan component'ler
├── features/           # Feature modülleri
├── i18n/               # i18next yapılandırması
├── layouts/            # Layout component'leri (header, sidebar, footer)
├── observability/      # Sentry, analytics entegrasyonu
├── pages/              # Route'a eşlenmiş sayfa component'leri
├── state/              # Zustand store'lar (app seviyesi)
├── styles/             # Global stiller, Tailwind config
└── test/               # Test utilities, setup, mock'lar
```

## 4.4. App Shell Yapısı (Mobile)

```
apps/mobile/src/
├── App.tsx             # Root component
├── auth/               # Auth + Biometric (expo-local-authentication)
├── components/         # App seviyesi paylaşılan component'ler
│   └── core/           # Wrapper component'ler (Button, Text, Icon)
├── features/           # Feature modülleri
├── navigation/         # React Navigation yapılandırması
├── observability/      # Sentry entegrasyonu
├── screens/            # Ekran component'leri (navigation hedefleri)
├── state/              # Zustand store'lar (app seviyesi)
├── storage/            # MMKV + Expo SecureStore
└── theme/              # NativeWind tema yapılandırması
```

## 4.5. Dosya Yerleştirme Karar Ağacı

Yeni bir dosya oluştururken şu sırayla karar verilir:

1. **Tek feature'a mı ait?** → `features/{feature}/` altına koy
2. **Birden fazla feature mı kullanıyor?** → `packages/core/` veya `packages/ui/` altına taşı
3. **Platform-specific mi?** → `apps/{platform}/` altında kal
4. **Platform-agnostic mi?** → `packages/` altına çıkar
5. **App shell altyapısı mı?** → `apps/{platform}/src/` root seviyesinde (auth, i18n, observability vb.)

---

# 5. Import Kuralları

## 5.1. Import Sıralaması (5 Katman)

Her dosyada import'lar aşağıdaki 5 katmanlı sıralamaya uymalıdır. Katmanlar arasında **boş satır zorunludur**. Her katman içinde **alfabetik sıralama** uygulanır.

```typescript
// 1. Framework — React, React Native, Expo
import React, { useState, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

// 2. Üçüncü parti kütüphaneler
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';

// 3. Monorepo paketleri (@project/*)
import { Button } from '@project/ui';
import { UserProfile } from '@project/core';

// 4. App-internal import'lar (@/ alias veya relative path)
import { useAuth } from '@/hooks/useAuth';
import { UserCard } from '../components/UserCard';

// 5. Tip import'ları (type-only, en sonda)
import type { User } from '@project/core';
import type { RootStackParamList } from '@/navigation/types';
```

**Neden bu sıralama?**

- Dıştan içe doğru azalan bağımlılık sırası: en stabil (framework) en üstte, en değişken (internal) en altta
- Type-only import'lar çalışma zamanında silinir; ayrı tutulması bundle etkisini netleştirir
- ESLint `import/order` kuralıyla otomatik enforce edilir

## 5.2. Import Yasakları

### Barrel Import YASAK

```typescript
// YASAK — barrel import (index.ts üzerinden)
import { UserCard, UserAvatar, UserBadge } from './components';
import { formatDate, formatCurrency } from './utils';

// DOĞRU — doğrudan dosya import'u
import { UserCard } from './components/UserCard';
import { UserAvatar } from './components/UserAvatar';
import { formatDate } from './utils/formatDate';
```

**Neden?** Barrel import'lar tree-shaking'i bozar, circular dependency riskini artırır ve bundle boyutunu şişirir. Barrel index.ts dosyası ne kadar büyürse, kullanılmayan export'ların da yüklenmesi o kadar olasıdır.

**İstisnalar (barrel import'un izinli olduğu yerler):**

- `packages/*/src/index.ts` — Package public API entry point
- i18n namespace entry point'leri
- Logger entry point'i
- Design token export entry point'i

### Deep Import YASAK

```typescript
// YASAK — başka feature'ın internal dosyasına erişim
import { UserCard } from '@/features/user-profile/components/UserCard';

// DOĞRU — paylaşılan katmandan erişim
import { UserCard } from '@project/ui';
```

Feature modüllerinin internal dosyalarına başka feature'lardan doğrudan erişmek boundary ihlalidir. Paylaşılması gereken kod shared package'a taşınmalıdır.

### Circular Import YASAK

Dosya A → Dosya B → Dosya A şeklinde döngüsel bağımlılık hiçbir koşulda kabul edilmez. ESLint `import/no-cycle` kuralıyla tespit edilir. Çözüm: Ortak bağımlılığı üçüncü bir dosyaya çıkarmak veya dependency inversion uygulamaktır.

### Default Export YASAK (İstisna ile)

```typescript
// YASAK — default export
export default function UserProfile() { ... }

// DOĞRU — named export
export function UserProfile() { ... }
```

**Neden?** Named export, tree-shaking uyumludur, IDE auto-import desteği daha iyidir ve import eden tarafta tutarlı isimlendirme sağlar.

**İstisna:** `React.lazy()` ile lazy loading yapılan page/screen component'ler default export kullanabilir. Bu React'in `lazy()` API'sinin gerektirdiği bir kısıtlamadır.

```typescript
// İstisna — lazy loading için default export
// pages/UserProfilePage.tsx
export default function UserProfilePage() { ... }

// router.tsx
const UserProfilePage = React.lazy(() => import('./pages/UserProfilePage'));
```

## 5.3. Import Yönü Kuralları

Import yönü, mimari sınırların korunmasının en kritik mekanizmasıdır. Aşağıdaki tablo hangi yönde import'un serbest, hangisinin yasak olduğunu belirler:

```
✅ İZİNLİ:
  feature → packages/core         (feature, shared iş mantığını kullanabilir)
  feature → packages/ui           (feature, shared UI component'leri kullanabilir)
  app     → packages/*            (app shell, tüm shared paketleri kullanabilir)
  packages/ui → packages/core     (UI, core type ve util'leri kullanabilir — sadece types/)
  feature içi → feature içi       (aynı feature içinde serbest)

❌ YASAK:
  feature → feature               (cross-feature import yasak)
  packages/core → app             (shared, app'e bağımlı olamaz)
  packages/ui → packages/core domain  (UI, domain entity'lerine bağımlı olamaz)
  packages/* → features/*         (shared, feature'a bağımlı olamaz)
  UI component → repository       (doğrudan data access yasak, hook üzerinden)
  component → component (farklı feature)  (başka feature'ın component'ini import etme)
```

**Cross-feature iletişim gerektiğinde:** İki feature'ın ortak ihtiyacı varsa, ortak kod `packages/core` veya `packages/ui` seviyesine çıkarılır. Feature A'nın Feature B'nin dosyasını import etmesi hiçbir koşulda kabul edilmez.

---

# 6. TypeScript Kuralları

## 6.1. Strict Mode (Zorunlu)

`tsconfig.json` dosyasında aşağıdaki ayarlar açık olmalıdır:

```jsonc
{
  "compilerOptions": {
    "strict": true, // Tüm strict flag'leri açar
    "noImplicitAny": true, // Örtük any yasak
    "noImplicitReturns": true, // Eksik return yasak
    "strictNullChecks": true, // null/undefined kontrolü zorunlu
    "strictFunctionTypes": true, // Fonksiyon tip kontravaryansı
    "strictBindCallApply": true, // bind/call/apply tip güvenliği
    "noUncheckedIndexedAccess": true, // Array/object index erişiminde undefined kontrolü
    "exactOptionalPropertyTypes": true, // Opsiyonel property'lerde undefined ayrımı
  },
}
```

Bu ayarlar derived project'lerde **gevşetilemez** (zorunlu miras).

## 6.2. Tip Güvenliği Kuralları

### `any` Tipi YASAK

`any` tipi TypeScript'in tip güvenliğini tamamen devre dışı bırakır. Hiçbir koşulda production kodunda `any` kullanılmaz.

```typescript
// YASAK
function processData(data: any): any { ... }
const result: any = fetchData();
const items: Array<any> = [];

// DOĞRU — unknown + type guard
function processData(data: unknown): UserProfile {
  if (!isUserProfile(data)) {
    throw new DomainError('INVALID_DATA');
  }
  return data;
}

// DOĞRU — generic
function processData<T>(data: T): T { ... }
```

### Gizli `any` Tipleri YASAK

Aşağıdaki tipler `any`'nin kılık değiştirmiş halleridir ve aynı şekilde yasaktır:

| Yasak Tip             | Neden                                           | Alternatif                                  |
| --------------------- | ----------------------------------------------- | ------------------------------------------- |
| `Record<string, any>` | Value tipi any                                  | `Record<string, unknown>` veya spesifik tip |
| `object`              | Tüm non-primitive'leri kabul eder               | Spesifik interface/type                     |
| `{}`                  | `null` ve `undefined` hariç her şeyi kabul eder | Spesifik tip veya `Record<string, never>`   |
| `Function`            | Herhangi bir fonksiyonu kabul eder              | `() => void` veya spesifik signature        |
| `Object`              | `object` ile aynı sorun                         | Spesifik interface/type                     |

### `@ts-ignore` YASAK

`@ts-ignore` yorumu TypeScript hatasını tamamen susturur ve gizli bug'lara yol açar. Hiçbir koşulda kullanılmaz.

### `@ts-expect-error` — Kısıtlı İzin

`@ts-expect-error` sadece geçici durumlarda ve **yorum ile açıklama zorunlu** olarak kullanılabilir:

```typescript
// YASAK — açıklamasız
// @ts-expect-error
const result = thirdPartyLib.brokenMethod();

// DOĞRU — açıklama ile, geçici
// @ts-expect-error: third-party lib v3.2 tip tanımı eksik, v3.3'te düzeltilecek (issue #123)
const result = thirdPartyLib.brokenMethod();
```

Her `@ts-expect-error` kullanımı `44-exception-and-exemption-policy.md`'ye göre exception kaydı gerektirir.

### Tip Tercih Sırası

Bir tipi ifade ederken aşağıdaki tercih sırası uygulanır (en çok tercih edilenden en aza):

1. **Proper type** — Tam ve doğru tip tanımı
2. **Generic `<T>`** — Parametrik polimorfizm
3. **Branded type** — Nominal tip güvenliği (`type UserId = string & { readonly brand: unique symbol }`)
4. **`unknown` + type guard** — Runtime doğrulama ile güvenli dönüşüm
5. **Type assertion (`as`)** — Sadece derleyicinin bilemeyeceği durumlarda, yorum ile
6. **`any`** — YASAK (exception policy gerektirir)

## 6.3. Export Kuralları

- **Named export tercih edilmeli:** Tree-shaking uyumu, IDE desteği ve tutarlı isimlendirme sağlar
- **Default export sadece:** `React.lazy()` ile lazy loading yapılan page/screen component'ler
- **Re-export:** Sadece package entry point'lerinde (`packages/*/src/index.ts`)
- **Mutable variable export YASAK:** `export let counter = 0` gibi değişken export'lar, öngörülemeyen yan etkilere yol açar

```typescript
// YASAK — mutable export
export let currentUser: User | null = null;

// DOĞRU — fonksiyon veya store üzerinden
export function getCurrentUser(): User | null { ... }
// veya Zustand store
export const useUserStore = create<UserState>((set) => ({ ... }));
```

---

# 7. Component Kuralları

## 7.1. Component Facade Pattern

Raw platform primitive'leri doğrudan kullanılmamalıdır. Wrapper component'ler kullanılarak platform değişikliklerine karşı tek noktadan kontrol sağlanır, design token uyumu garanti altına alınır ve accessibility varsayılan olarak eklenir.

| Platform Primitive         | Kullanılacak Wrapper | Kaynak                              |
| -------------------------- | -------------------- | ----------------------------------- |
| `<Pressable>` (RN)         | `<Button>`           | `@/components/core/Button`          |
| `<TouchableOpacity>` (RN)  | `<Button>`           | `@/components/core/Button`          |
| `<Text>` (RN)              | `<Text>`             | `@/components/core/Text`            |
| `<Modal>` (RN)             | `<AppModal>`         | `@/components/core/Modal`           |
| `<Image>` (RN)             | `<AutoImage>`        | `@/components/core/AutoImage`       |
| `<ActivityIndicator>` (RN) | `<LoadingSpinner>`   | `@/components/core/LoadingSpinner`  |
| `<TextInput>` (RN)         | `<TextField>`        | `@/components/core/TextField`       |
| `<ScrollView>` (RN)        | `<ScrollContainer>`  | `@/components/core/ScrollContainer` |

**İstisna:** Wrapper component'in kendi implementasyonu doğal olarak raw primitive kullanır. Bu tek istisna dışında tüm feature ve screen kodunda wrapper component kullanılır.

**Neden?**

- Design token'lar wrapper'da merkezi olarak uygulanır
- Accessibility prop'ları varsayılan olarak eklenir
- Platform değişikliği tek noktadan yönetilir
- Tutarsız UI oluşumu engellenir

## 7.2. Component Boyut Kuralları

| Metrik              | Hedef     | Uyarı | Hard Limit |
| ------------------- | --------- | ----- | ---------- |
| Toplam dosya satırı | ≤300      | >500  | >800       |
| JSX return bloğu    | ≤80 satır | >120  | >200       |
| Props sayısı        | ≤7        | >10   | >15        |
| useState sayısı     | ≤3        | >5    | >8         |
| useEffect sayısı    | ≤2        | >3    | >5         |

**Aşım durumunda ne yapılmalı:**

- **JSX >80 satır:** Alt component'lere böl. Tekrarlanan UI blokları, koşullu render bölümleri, liste öğeleri ayrı component olur.
- **Props >7:** Props interface'ini gözden geçir. Composition pattern (children), context veya compound component pattern kullanılabilir.
- **useState >3:** Custom hook'a çıkar. İlişkili state'ler tek bir useReducer veya Zustand slice ile birleştirilebilir.
- **useEffect >2:** Custom hook'a çıkar. Her useEffect tek bir side effect'ten sorumlu olmalı.

## 7.3. Component API Kuralları

**Props interface tanımı:**

- Props interface'i component ile **aynı dosyada** tanımlanır (ayrı types dosyasına çıkarılmaz — component imzasının anlaşılması kolaylaşır)
- İstisna: Props interface başka component'ler tarafından da kullanılıyorsa `*.types.ts` dosyasına çıkarılabilir

```typescript
// DOĞRU — aynı dosyada
interface UserCardProps {
  user: UserProfile;
  onPress: (userId: string) => void;
  variant?: 'compact' | 'detailed';
}

export function UserCard({ user, onPress, variant = 'compact' }: UserCardProps) {
  ...
}
```

**`children` prop'u:** Sadece composition pattern'de kullanılır. Bir component hem `children` hem de çok sayıda render prop alıyorsa, API tasarımı gözden geçirilmelidir.

**Callback prop'ları:** `on` prefix ile adlandırılır (`onPress`, `onChange`, `onSubmit`). Component içinde handler fonksiyonları `handle` prefix ile adlandırılır (`handlePress`, `handleChange`).

**Boolean prop'ları:** `is`/`has` prefix veya kısa form kabul edilir (`disabled`, `loading`, `isVisible`, `hasError`). Negatif boolean (`isNotVisible`, `hideHeader`) kullanılmaz; pozitif form tercih edilir.

**Default prop değerleri:** Destructuring'de default value ile belirtilir, `defaultProps` kullanılmaz (deprecated).

---

# 8. Hook Kuralları

## 8.1. Genel Kurallar

- **`use` prefix ZORUNLU:** React hook convention'ıdır, ESLint `react-hooks/rules-of-hooks` kuralı bunu enforce eder
- **Tek sorumluluk:** Bir hook ya veri çeker, ya state yönetir, ya side effect çalıştırır — üçünü birden yapmamalıdır
- **Hook dosya boyutu:** ≤150 satır hedef, >250 satır warn
- **Hook parametre sayısı:** ≤3 (options object pattern ile azaltılabilir)

## 8.2. Dependency Array Kuralları

```typescript
// YASAK — eksik dependency
useEffect(() => {
  fetchUser(userId);
}, []); // userId eksik — eslint-disable YASAK

// DOĞRU — tam dependency array
useEffect(() => {
  fetchUser(userId);
}, [userId]);

// DOĞRU — stabil referans için useCallback
const handleFetch = useCallback(() => {
  fetchUser(userId);
}, [userId]);

useEffect(() => {
  handleFetch();
}, [handleFetch]);
```

- `useEffect` dependency array: **EKSIKSIZ** (ESLint `react-hooks/exhaustive-deps` kuralı kapatılmaz)
- `useCallback` dependency array: **EKSIKSIZ**
- `useMemo` dependency array: **EKSIKSIZ**
- Dependency array'de `eslint-disable` YASAK

## 8.3. Cleanup Kuralları

```typescript
// DOĞRU — cleanup fonksiyonu ile temizleme
useEffect(() => {
  const subscription = eventEmitter.subscribe('user-update', handleUpdate);
  return () => {
    subscription.unsubscribe(); // cleanup ZORUNLU
  };
}, [handleUpdate]);

useEffect(() => {
  const timer = setTimeout(handleTimeout, 5000);
  return () => {
    clearTimeout(timer); // cleanup ZORUNLU
  };
}, [handleTimeout]);
```

Aşağıdaki durumlarda cleanup fonksiyonu **ZORUNLUDUR:**

- Event listener (`addEventListener`, `subscribe`, `on`)
- Timer (`setTimeout`, `setInterval`)
- Subscription (WebSocket, real-time listener, observable)
- AbortController (fetch iptal)

---

# 9. Form Kuralları

## 9.1. Form Yönetim Stratejisi

| Durum                   | Yaklaşım                             |
| ----------------------- | ------------------------------------ |
| 1 input (arama, toggle) | `useState` serbest                   |
| 2+ input                | `react-hook-form` + Zod ZORUNLU      |
| Çok adımlı form         | `react-hook-form` + Zod + step state |

## 9.2. Zod Schema Konumu

Zod validasyon şemaları feature'ın `schemas/` klasöründe tutulur:

```
features/user-profile/
├── schemas/
│   ├── userProfileSchema.ts    # Form validasyon şeması
│   └── updateEmailSchema.ts    # Ayrı form, ayrı şema
```

Birden fazla feature tarafından kullanılan ortak şemalar `packages/core/src/validation/` altına çıkarılır.

## 9.3. Yasaklar

- **`useState` ile form state (2+ input) YASAK:** React Hook Form'un kontrollü state yönetimi, re-render optimizasyonu ve hata yönetimi avantajları kaybedilir
- **Manuel validasyon (if/else) YASAK:** Zod schema tek kaynak olmalıdır
- **Inline hata mesajı YASAK:** Hata mesajları i18n key ile tanımlanır

```typescript
// YASAK — useState ile form
const [name, setName] = useState('');
const [email, setEmail] = useState('');
const [errors, setErrors] = useState({});

// DOĞRU — react-hook-form + Zod
const schema = z.object({
  name: z.string().min(1, { message: 'form.name.required' }),
  email: z.string().email({ message: 'form.email.invalid' }),
});

const {
  control,
  handleSubmit,
  formState: { errors },
} = useForm({
  resolver: zodResolver(schema),
});
```

---

# 10. Style ve Token Kuralları

## 10.1. Design Token Zorunluluğu

Hardcoded görsel değerler yasaktır. Tüm görsel kararlar design token üzerinden ifade edilir:

| Yasak Kullanım                 | Doğru Kullanım            | Açıklama                      |
| ------------------------------ | ------------------------- | ----------------------------- |
| `#FF0000`, `rgb(255,0,0)`      | Semantic renk token'ı     | Hardcoded renk YASAK          |
| `padding: 16`, `margin: 8`     | Spacing token'ı           | Hardcoded spacing YASAK       |
| `fontSize: 14`, `fontSize: 24` | Typography token'ı        | Hardcoded font-size YASAK     |
| `fontWeight: 700`              | Typography weight token'ı | Hardcoded font-weight YASAK   |
| `borderRadius: 8`              | Radius token'ı            | Hardcoded radius YASAK        |
| `4px`, `100ms`                 | Shadow/transition token   | Hardcoded shadow/timing YASAK |

**Neden?** Hardcoded değerler tema değişikliğini, dark mode desteğini ve marka uyarlamasını imkansız kılar. Ayrıca derived project'ler kendi token'larını tanımlayamaz.

## 10.2. Token Prefix Sistemi

Boilerplate'in token prefix'i: **`bp-`**

Derived project'ler kendi prefix'ini tanımlayabilir (örn. `fm-` fitos-mobile, `fw-` fitos-web). Bu prefix 22-design-tokens-spec.md ile uyumlu olmalıdır.

**Web — Tailwind CSS class'ları:**

```html
<div class="bg-bp-surface text-bp-content border-bp-stroke">
  <h1 class="text-bp-content font-bp-heading">Başlık</h1>
  <p class="text-bp-content-secondary">Açıklama</p>
</div>
```

**Mobile — NativeWind class'ları:**

```tsx
<View className="bg-bp-surface border-bp-stroke">
  <Text className="text-bp-content font-bp-heading">Başlık</Text>
</View>
```

**Token kategorileri ve kullanım kısıtlamaları:**

| Token Kategorisi | Örnek Token                            | İzinli Prefix'ler               | Açıklama                                |
| ---------------- | -------------------------------------- | ------------------------------- | --------------------------------------- |
| Text-only        | `bp-content`, `bp-content-secondary`   | Sadece `text-`                  | Metin rengi, arka plan için kullanılmaz |
| Background-only  | `bp-canvas`, `bp-surface`              | Sadece `bg-`                    | Arka plan rengi, metin için kullanılmaz |
| Border-only      | `bp-stroke`, `bp-separator`            | Sadece `border-`                | Kenarlık rengi                          |
| Brand/state      | `bp-primary`, `bp-error`, `bp-success` | `text-`/`bg-`/`border-` serbest | Çok amaçlı token'lar                    |

## 10.3. StyleSheet Kuralları (Mobile / React Native)

NativeWind `className` prop'u **birincil tercih** olmalıdır. `StyleSheet.create` sadece aşağıdaki durumlarda kullanılır:

1. **Dinamik/hesaplanmış değerler:** Runtime'da değişen stiller (`width: screenWidth * 0.8`)
2. **Platform-spesifik stiller:** `Platform.select()` ile koşullu stiller
3. **Animasyon interpolasyonları:** `Animated.Value` ile hesaplanan stiller
4. **NativeWind karşılığı olmayan durumlar:** Karmaşık transform, shadow gibi

StyleSheet kullanıldığında **yorum zorunludur:**

```typescript
// StyleSheet: Dinamik ekran genişliği hesaplaması — NativeWind ile ifade edilemez
const styles = StyleSheet.create({
  container: {
    width: Dimensions.get('window').width * 0.8,
  },
});
```

---

# 11. Async/Await ve Error Handling Kuralları

## 11.1. Async İşlem Disiplini

```typescript
// YASAK — .then() zinciri
fetchUser(userId)
  .then((user) => processUser(user))
  .then((result) => updateUI(result))
  .catch((error) => handleError(error));

// DOĞRU — async/await + try/catch
async function loadUser(userId: string): Promise<void> {
  try {
    const user = await fetchUser(userId);
    const result = await processUser(user);
    updateUI(result);
  } catch (error) {
    handleError(error);
  }
}
```

**Kurallar:**

- `.then()` chain YASAK — async/await kullanılır (okunabilirlik, hata yakalama tutarlılığı)
- Async fonksiyonlarda **try/catch ZORUNLU**
- Promise rejection: `.catch()` veya try/catch ile handle edilmeli, unhandled rejection YASAK
- `void` dönen async fonksiyonlar: Hata sessizce yutulmamalı, en azından logger'a yazılmalı

## 11.2. State Üçlüsü

API çağrıları ve async işlemler her zaman **loading/error/data** state üçlüsünü yönetmelidir:

```typescript
// DOĞRU — üç state birlikte
interface AsyncState<T> {
  data: T | null;
  isLoading: boolean;
  error: DomainError | null;
}
```

TanStack Query kullanıldığında bu üçlü otomatik sağlanır. Manuel async işlemlerde açıkça yönetilmelidir.

## 11.3. Cleanup Zorunluluğu

Listener, timer ve subscription'lar için cleanup **ZORUNLUDUR:**

```typescript
// DOĞRU — AbortController ile fetch iptali
async function fetchWithCancel(userId: string, signal: AbortSignal): Promise<User> {
  const response = await fetch(`/api/users/${userId}`, { signal });
  return response.json();
}
```

---

# 12. Console ve Logging Kuralları

## 12.1. Console Kullanım Yasağı

| Yöntem          | Production | Development           | Test    |
| --------------- | ---------- | --------------------- | ------- |
| `console.log`   | YASAK      | YASAK (logger kullan) | Serbest |
| `console.warn`  | YASAK      | YASAK (logger kullan) | Serbest |
| `console.error` | YASAK      | YASAK (logger kullan) | Serbest |
| `console.debug` | YASAK      | YASAK (logger kullan) | Serbest |
| `console.info`  | YASAK      | YASAK (logger kullan) | Serbest |

## 12.2. Yapısal Logger Kullanımı

Production ve development ortamında yapısal logger kullanılır:

```typescript
import { logger } from '@project/core/logger';

// DOĞRU — yapısal logger
logger.debug('Kullanıcı verisi yüklendi', { userId, source: 'UserProfile' });
logger.info('Oturum açıldı', { method: 'biometric' });
logger.warn('API yanıtı yavaş', { endpoint, duration });
logger.error('Veri çekme başarısız', { error, userId });
```

**Logger seviyeleri:**

- `debug`: Geliştirme sırasında detaylı bilgi (production'da kapalı)
- `info`: Önemli iş olayları (oturum açma, ödeme tamamlama)
- `warn`: Potansiyel sorunlar (yavaş yanıt, deprecation, retry)
- `error`: Hatalar (API hatası, beklenmeyen durum)

## 12.3. Debug Console Commit Yasağı

Debug amaçlı eklenen `console.log` ifadeleri commit edilmez. ESLint `no-console` kuralı ile enforce edilir.

**İstisna:** Logger implementasyon dosyaları (`logger.ts`, `logger.native.ts`) doğal olarak console API'sini kullanır.

---

# 13. Test Dosyası Konvansiyonları

## 13.1. Test Dosyası Konumu

Test dosyası, test ettiği kaynak dosyanın **hemen yanında** bulunur:

```
components/
├── UserCard.tsx
├── UserCard.test.tsx        # Birim testi — yanında
├── UserCard.stories.tsx     # Story — yanında
├── UserAvatar.tsx
└── UserAvatar.test.tsx
```

**Entegrasyon testleri:** Birden fazla modülün birlikte çalışmasını test eden entegrasyon testleri `__tests__/` klasöründe tutulabilir. Bu klasör feature modülü kökünde veya app kökünde olabilir.

**E2E testleri:** End-to-end testler repo kökünde `e2e/` klasöründe tutulur.

## 13.2. Test Dosyası İsimlendirme

| Kaynak Dosya           | Test Dosyası                |
| ---------------------- | --------------------------- |
| `UserProfile.tsx`      | `UserProfile.test.tsx`      |
| `useAuth.ts`           | `useAuth.test.ts`           |
| `formatDate.ts`        | `formatDate.test.ts`        |
| `fetchUsers.ts`        | `fetchUsers.test.ts`        |
| `userProfileSchema.ts` | `userProfileSchema.test.ts` |

## 13.3. Test Dosyası ESLint Gevşetmeleri

Test dosyalarında aşağıdaki kurallar gevşetilir çünkü test kodu production kodu değildir ve farklı ihtiyaçları vardır:

| Kural                                | Gevşetme                 | Gerekçe                                                      |
| ------------------------------------ | ------------------------ | ------------------------------------------------------------ |
| `@typescript-eslint/no-explicit-any` | Serbest                  | Mock data ve test fixture'larında any gerekebilir            |
| `max-lines`                          | Limit yükseltilir (1200) | Test case'ler, setup, mock data dosyayı uzatır               |
| `no-console`                         | Serbest                  | Test debug'ında console kullanımı normaldir                  |
| Hardcoded değerler                   | Serbest                  | Mock data, fixture, assertion'larda hardcoded değer doğaldır |
| i18n kuralları                       | Kapalı                   | Test assertion'larında doğrudan string karşılaştırma yapılır |
| `no-magic-numbers`                   | Serbest                  | Test verilerinde sabit sayılar doğaldır                      |

## 13.4. Test Yapı Kuralları

```typescript
// DOĞRU — test yapısı
describe('UserProfile', () => {
  // Test setup
  beforeEach(() => { ... });

  // Pozitif case'ler
  it('kullanıcı adını doğru render etmeli', () => { ... });
  it('avatar gösterilmeli', () => { ... });

  // Negatif/edge case'ler
  it('kullanıcı bulunamazsa hata göstermeli', () => { ... });
  it('boş isim durumunda fallback kullanmalı', () => { ... });
});
```

---

# 14. i18n Kuralları

## 14.1. Genel İlke

User-facing (kullanıcının gördüğü) tüm string'ler i18n key üzerinden çözümlenir. Kod içinde doğrudan string yazmak yasaktır.

```typescript
// YASAK — inline string
<Text>Profil Bilgileri</Text>
<Button title="Kaydet" />
<TextInput placeholder="E-posta adresinizi girin" />

// DOĞRU — i18n key
<Text>{t('userProfile.title')}</Text>
<Button title={t('common.save')} />
<TextInput placeholder={t('userProfile.emailPlaceholder')} />
```

## 14.2. Key Yapısı

i18n key'leri namespace-based, hiyerarşik yapıdadır:

```
{namespace}.{screen/component}.{element}
```

Örnekler:

- `userProfile.header.title` — UserProfile ekranının başlık metni
- `common.button.save` — Ortak "Kaydet" butonu
- `auth.login.emailLabel` — Giriş ekranı e-posta label'ı
- `error.network.timeout` — Ağ zaman aşımı hatası

## 14.3. Kapsam

Aşağıdaki tüm string'ler i18n key ile tanımlanır:

- UI metin içerikleri (başlık, açıklama, buton metni)
- Placeholder'lar
- Hata mesajları
- Toast/snackbar mesajları
- Accessibility label'lar ve hint'ler
- Boş durum (empty state) mesajları
- Onay dialog metinleri

**İstisnalar:**

- Log mesajları (logger çıktıları) — bunlar kullanıcıya gösterilmez
- Teknik hata kodları (error code)
- Test dosyalarındaki assertion string'leri

---

# 15. Security Kuralları

## 15.1. Mutlak Yasaklar

| Kural                           | Açıklama                | ESLint Kuralı             |
| ------------------------------- | ----------------------- | ------------------------- |
| `eval()` YASAK                  | Kod enjeksiyon riski    | `no-eval`                 |
| `new Function()` YASAK          | `eval` ile eşdeğer risk | `no-new-func`             |
| `dangerouslySetInnerHTML` YASAK | XSS riski               | `react/no-danger`         |
| `innerHTML` ataması YASAK       | XSS riski               | `no-unsanitized/property` |
| `eslint-disable` YASAK          | Kural bypass'ı          | Custom rule               |
| Secret/credential commit YASAK  | Güvenlik ihlali         | `no-secrets/no-secrets`   |

`dangerouslySetInnerHTML` kullanımı gerçekten zorunluysa (örn. CMS'den gelen sanitize edilmiş HTML), `44-exception-and-exemption-policy.md`'ye göre exception kaydı açılır ve DOMPurify ile sanitization zorunlu tutulur.

## 15.2. Token/Credential Saklama

| Platform | Yöntem                            | Yasak                       |
| -------- | --------------------------------- | --------------------------- |
| Web      | HttpOnly cookie (backend-managed) | localStorage'da token YASAK |
| Mobile   | Expo SecureStore (hassas veri)    | AsyncStorage'da token YASAK |
| Mobile   | MMKV (hassas olmayan veri)        | Plain text credential YASAK |

## 15.3. Input Validasyonu

- Tüm kullanıcı girdileri Zod schema ile validate edilir
- API yanıtları da Zod schema ile parse edilmeli (runtime tip güvenliği)
- URL parametreleri doğrudan kullanılmaz, önce validate edilir

## 15.4. Hassas Veri Logging Yasağı

```typescript
// YASAK — hassas veri log'a yazılmaz
logger.info('Kullanıcı girişi', { email, password }); // password YASAK
logger.error('API hatası', { token }); // token YASAK

// DOĞRU — hassas veri maskelenir
logger.info('Kullanıcı girişi', { email, passwordProvided: true });
logger.error('API hatası', { tokenPrefix: token.slice(0, 4) + '***' });
```

Sentry payload'larında hassas kullanıcı verisi (şifre, token, kredi kartı, TC kimlik no) bulunmamalıdır.

---

# 16. Derived Project Miras Kuralları

Bu doküman `45-boilerplate-project-boundary-contract.md` kapsamında üç katmanlı miras modeli uygular:

## 16.1. Zorunlu Miras (Override Edilemez)

Aşağıdaki kurallar derived project'lerde değiştirilemez, gevşetilemez, devre dışı bırakılamaz:

- **Dosya boyut limitleri:** Hard limit'ler (800 satır dosya, 150 satır fonksiyon, 6 parametre) sabit
- **TypeScript strict mode:** `strict: true` ve tüm alt flag'ler açık kalmalı
- **`any` tipi yasağı:** Production kodunda `any` hiçbir koşulda kullanılmaz
- **Import yönü kuralları:** Feature → feature yasağı, shared → app yasağı
- **Security kuralları:** eval, dangerouslySetInnerHTML, credential commit yasakları
- **Naming conventions:** PascalCase component, camelCase hook/fonksiyon, kebab-case klasör

## 16.2. Yapısal Miras (Sıkılaştırılabilir, Gevşetilemez)

Aşağıdaki kurallar derived project'lerde sıkılaştırılabilir (daha katı hale getirilebilir) ama gevşetilemez:

- **Token prefix:** Derived proje kendi prefix'ini tanımlar (`bp-` yerine `fm-`, `fw-` vb.) ama prefix zorunluluğu kaldırılamaz
- **Klasör yapısı şablonu:** Feature modül yapısı genişletilebilir (yeni alt klasör eklenebilir) ama mevcut yapı kaldırılamaz
- **Test konvansiyonları:** Ek test kuralları eklenebilir ama mevcut kurallar gevşetilemez
- **Dosya boyut hedefleri:** Hedef değerler düşürülebilir (ör. 300 → 250) ama yükseltilemez
- **Component boyut kuralları:** Props limiti düşürülebilir ama yükseltilemez

## 16.3. Felsefi Miras (Rehber Niteliğinde)

Aşağıdaki ilkeler derived project'lerde rehber niteliğindedir; uyarlanabilir ama ruhuna sadık kalınmalıdır:

- **Single responsibility prensibi:** Dosya ve fonksiyon bölme kararları projeye göre uyarlanabilir
- **Component facade pattern:** Wrapper set'i projeye göre genişletilebilir veya daraltılabilir
- **Import sıralaması:** Katman sayısı ve sırası projeye göre uyarlanabilir ama tutarlı olmalı
- **Logging stratejisi:** Logger implementasyonu değişebilir ama yapısal logging prensibi korunmalı

---

# 17. Anti-Pattern Listesi

## 17.1. Dosya Boyutu Anti-Pattern'leri

| Anti-Pattern       | Açıklama                                     | Çözüm                             |
| ------------------ | -------------------------------------------- | --------------------------------- |
| God File           | 1000+ satır her şeyi yapan dosya             | Single responsibility'ye göre böl |
| Mega Component     | 500+ satır JSX, state, logic, style birlikte | Component + hook + service'e ayır |
| Fat Hook           | 300+ satır hook                              | Tek sorumluluk hook'larına böl    |
| Kitchen Sink Utils | `utils.ts` dosyasına her şeyi atma           | Kategori bazlı dosyalara ayır     |

## 17.2. Naming Anti-Pattern'leri

| Anti-Pattern         | Örnek                                   | Neden Kötü                         | Doğru Alternatif                                 |
| -------------------- | --------------------------------------- | ---------------------------------- | ------------------------------------------------ |
| Anlamsız isim        | `data`, `temp`, `stuff`, `misc`, `item` | Ne olduğu belli değil              | `userProfile`, `cachedResponse`                  |
| Tek harf değişken    | `x`, `d`, `t` (döngü dışı)              | Okunabilirlik sıfır                | `user`, `date`, `translation`                    |
| Yanlış prefix        | `getUserData` (set ediyor)              | Yanıltıcı                          | `setUserData`                                    |
| Boolean prefix eksik | `loading`, `visible`, `error`           | Tip belirsiz                       | `isLoading`, `isVisible`, `hasError`             |
| Kısaltma aşırılığı   | `usrPrfl`, `btnClk`, `navHdr`           | Okunmuyor                          | `userProfile`, `buttonClick`, `navigationHeader` |
| Hungarian notation   | `strName`, `intCount`, `boolFlag`       | TypeScript zaten tip bilgisi verir | `name`, `count`, `isActive`                      |

## 17.3. Import Anti-Pattern'leri

| Anti-Pattern                | Örnek                                   | Çözüm                           |
| --------------------------- | --------------------------------------- | ------------------------------- |
| Circular dependency         | A → B → A                               | Ortak kodu üçüncü dosyaya çıkar |
| Barrel import               | `from './components'`                   | Doğrudan dosya import'u         |
| Deep import (cross-feature) | `from '@/features/auth/hooks/useToken'` | Shared katmana taşı             |
| Wildcard import             | `import * as Utils from './utils'`      | Named import kullan             |
| Side effect import          | `import './polyfill'` (kontrolsüz)      | Entry point'te, açık yorum ile  |

## 17.4. Component Anti-Pattern'leri

| Anti-Pattern                 | Açıklama                                          | Çözüm                                         |
| ---------------------------- | ------------------------------------------------- | --------------------------------------------- |
| Mega Component               | 500+ satır, 15+ prop                              | Component + hook'lara böl, composition kullan |
| Prop Drilling                | 5+ seviye prop geçirme                            | Context veya Zustand kullan                   |
| Inline Handler               | JSX içinde arrow function (`onPress={() => ...}`) | `handlePress` fonksiyonu tanımla              |
| Conditional Render Cehennemi | 5+ ternary iç içe                                 | Alt component'lere böl veya early return      |
| Raw Primitive                | Doğrudan `<Pressable>`, `<Text>` kullanımı        | Wrapper component kullan                      |

## 17.5. State Anti-Pattern'leri

| Anti-Pattern                   | Açıklama                                                 | Çözüm                                                 |
| ------------------------------ | -------------------------------------------------------- | ----------------------------------------------------- |
| useState ile form (2+ input)   | Manuel form state yönetimi                               | react-hook-form + Zod kullan                          |
| useEffect içinde setState loop | Sonsuz render döngüsü                                    | Dependency array'i düzelt veya useMemo kullan         |
| Derived state'i state'te tutma | `const [fullName, setFullName] = useState(first + last)` | useMemo ile hesapla                                   |
| Global state aşırı kullanımı   | Her şeyi Zustand'a koyma                                 | Server state → TanStack Query, local state → useState |
| State shape uyumsuzluğu        | API yanıtını doğrudan state'e koyma                      | Transform/normalize et                                |

## 17.6. Style Anti-Pattern'leri

| Anti-Pattern          | Örnek                            | Çözüm                                     |
| --------------------- | -------------------------------- | ----------------------------------------- |
| Hardcoded hex renk    | `color: '#FF0000'`               | `text-bp-error` token kullan              |
| Inline style object   | `style={{ padding: 16 }}`        | className + token kullan                  |
| Magic number          | `width: 375`, `height: 812`      | Token veya hesaplanmış değer kullan       |
| Platform check inline | `Platform.OS === 'ios' ? 44 : 0` | Platform-aware token veya Platform.select |
| Duplicate style       | Aynı style 3+ yerde tekrarlanma  | Ortak className veya shared style         |

---

# 18. ESLint Enforcement Tablosu

Bu dokümanın kurallarının ESLint ile nasıl enforce edileceğini aşağıdaki tablo özetler:

## 18.1. Dosya ve Fonksiyon Boyut Kuralları

| Kural                      | ESLint Rule               | Seviye | Yapılandırma                                             |
| -------------------------- | ------------------------- | ------ | -------------------------------------------------------- |
| Dosya satır limiti         | `max-lines`               | error  | `{ max: 800, skipBlankLines: true, skipComments: true }` |
| Fonksiyon satır limiti     | `max-lines-per-function`  | error  | `{ max: 150, skipBlankLines: true, skipComments: true }` |
| Fonksiyon parametre limiti | `max-params`              | error  | `{ max: 6 }`                                             |
| Cyclomatic complexity      | `complexity`              | error  | `{ max: 25 }`                                            |
| JSX derinliği              | `react/jsx-max-depth`     | warn   | `{ max: 7 }`                                             |
| Import sayısı              | `import/max-dependencies` | warn   | `{ max: 30 }`                                            |

## 18.2. Naming Kuralları

| Kural                    | ESLint Rule                            | Seviye |
| ------------------------ | -------------------------------------- | ------ |
| Component PascalCase     | `react/jsx-pascal-case`                | error  |
| Boolean prefix           | `@typescript-eslint/naming-convention` | warn   |
| Constant SCREAMING_SNAKE | `@typescript-eslint/naming-convention` | warn   |
| Dosya adı formatı        | `unicorn/filename-case`                | error  |

## 18.3. Import Kuralları

| Kural                   | ESLint Rule                | Seviye |
| ----------------------- | -------------------------- | ------ |
| Import sıralaması       | `import/order`             | error  |
| Circular import yasağı  | `import/no-cycle`          | error  |
| Default export yasağı   | `import/no-default-export` | warn   |
| Self import yasağı      | `import/no-self-import`    | error  |
| Unresolved import       | `import/no-unresolved`     | error  |
| Namespace import yasağı | `import/no-namespace`      | warn   |

## 18.4. TypeScript Kuralları

| Kural                  | ESLint Rule                                  | Seviye |
| ---------------------- | -------------------------------------------- | ------ |
| `any` yasağı           | `@typescript-eslint/no-explicit-any`         | error  |
| `@ts-ignore` yasağı    | `@typescript-eslint/ban-ts-comment`          | error  |
| Unsafe `any` kullanımı | `@typescript-eslint/no-unsafe-assignment`    | error  |
| Unsafe member access   | `@typescript-eslint/no-unsafe-member-access` | error  |
| Unsafe call            | `@typescript-eslint/no-unsafe-call`          | error  |
| Unsafe return          | `@typescript-eslint/no-unsafe-return`        | error  |

## 18.5. React/React Native Kuralları

| Kural                 | ESLint Rule                   | Seviye |
| --------------------- | ----------------------------- | ------ |
| Hook dependency array | `react-hooks/exhaustive-deps` | error  |
| Hook rules            | `react-hooks/rules-of-hooks`  | error  |
| JSX key               | `react/jsx-key`               | error  |
| No danger             | `react/no-danger`             | error  |
| No deprecated         | `react/no-deprecated`         | warn   |

## 18.6. Security Kuralları

| Kural                   | ESLint Rule             | Seviye |
| ----------------------- | ----------------------- | ------ |
| `eval()` yasağı         | `no-eval`               | error  |
| `new Function()` yasağı | `no-new-func`           | error  |
| Secret tespiti          | `no-secrets/no-secrets` | error  |
| Console yasağı          | `no-console`            | error  |

## 18.7. Form Kuralları

| Kural                       | Enforcement               | Açıklama                                                |
| --------------------------- | ------------------------- | ------------------------------------------------------- |
| 2+ input'ta RHF zorunluluğu | Code review + custom rule | ESLint custom rule ile 2+ useState form pattern tespiti |
| Zod schema zorunluluğu      | Code review               | Schema dosyası varlığı kontrol edilir                   |
| Inline hata mesajı yasağı   | i18n lint rule            | Hardcoded string tespiti                                |

## 18.8. Test Dosyası Gevşetmeleri

Test dosyaları (`*.test.ts`, `*.test.tsx`) için override yapılandırması:

```javascript
// eslint.config.js (flat config)
{
  files: ['**/*.test.ts', '**/*.test.tsx'],
  rules: {
    '@typescript-eslint/no-explicit-any': 'off',
    'max-lines': ['error', { max: 1200 }],
    'no-console': 'off',
    'no-magic-numbers': 'off',
    // i18n kuralları kapalı
  }
}
```

---

# 19. Özet ve Uygulama Öncelikleri

Bu dokümanın kuralları aşağıdaki öncelik sırasıyla uygulanır:

1. **P0 — Güvenlik:** eval yasağı, credential commit yasağı, XSS korumaları
2. **P0 — Tip güvenliği:** `any` yasağı, strict mode, `@ts-ignore` yasağı
3. **P1 — Import disiplini:** Yön kuralları, circular import yasağı, deep import yasağı
4. **P1 — Naming tutarlılığı:** Dosya/kod/klasör isimlendirme kuralları
5. **P2 — Boyut limitleri:** Dosya, fonksiyon, component boyut kontrolleri
6. **P2 — Token zorunluluğu:** Hardcoded değer yasağı, semantic token kullanımı
7. **P3 — Konvansiyonlar:** Import sıralaması, test yapısı, logging, i18n

ESLint kuralları CI pipeline'da `15-quality-gates-and-ci-rules.md`'de tanımlanan kalite kapılarında enforce edilir. P0 ve P1 ihlalleri CI'ı kırar, P2 ihlalleri uyarı verir, P3 ihlalleri bilgilendirme amacıyla raporlanır.

---

# Referanslar

- `06-application-architecture.md` — Mimari katmanlar ve sorumluluklar
- `07-module-boundaries-and-code-organization.md` — Modül sınırları ve import yönleri
- `22-design-tokens-spec.md` — Design token tanımları ve katmanları
- `23-component-governance-rules.md` — Component yönetim kuralları
- `36-canonical-stack-decision.md` — Kilitli teknoloji kararları
- `37-dependency-policy.md` — Dependency ekleme politikası
- `44-exception-and-exemption-policy.md` — Kural istisnası prosedürü
- `45-boilerplate-project-boundary-contract.md` — Derived project miras kuralları
- ADR-006 — Form ve validasyon kararı
- ADR-007 — Styling ve token kararı
