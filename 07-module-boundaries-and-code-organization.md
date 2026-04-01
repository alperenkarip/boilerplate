# 07-module-boundaries-and-code-organization.md

## Doküman Kimliği

- **Doküman adı:** Module Boundaries and Code Organization
- **Dosya adı:** `07-module-boundaries-and-code-organization.md`
- **Doküman türü:** Specification / boundary governance / code organization document
- **Durum:** Accepted
- **Kapsam:** Bu boilerplate kapsamında modül sınırlarını, modül türlerini, public/private surface mantığını, import yönlerini, feature-first organizasyonu, internal yardımcı alanların nasıl sınırlandırılacağını, package içi görünürlük modelini, boundary enforcement yaklaşımını ve boundary ihlallerinin nasıl tespit edilip önleneceğini tanımlar.
- **Bağlı olduğu üst dokümanlar:**
  - `06-application-architecture.md`
  - `16-tooling-and-governance.md`
  - `21-repo-structure-spec.md`
- **Doğrudan etkileyeceği dokümanlar:**
  - `09-state-management-strategy.md`
  - `10-data-fetching-cache-sync.md`
  - `14-testing-strategy.md`
  - `15-quality-gates-and-ci-rules.md`
  - `21-repo-structure-spec.md`
  - `30-contribution-guide.md`
  - `31-audit-checklist.md`

---

# 1. Amaç

Bu dokümanın amacı, kod organizasyonunu “dosyaları anlamlı yerlere koyarız” düzeyinden çıkarıp; **sınırları yazılı, import yönleri kontrollü, public yüzeyleri tanımlı, refactor maliyeti düşük ve mimari drift’e dirençli** bir yapıya dönüştürmektir.

Bu belge şu sorulara net cevap verir:

1. Modül bu projede ne demektir?
2. Feature modülü, shared package modülü, app modülü ve internal yardımcı modül nasıl ayrılır?
3. Public API ile private implementation nasıl sınırlandırılır?
4. Deep import neden tehlikelidir ve neden yasaklanmalıdır?
5. Feature-first organizasyon boundary disipliniyle nasıl birlikte çalışır?
6. Hangi kod local kalmalı, hangi kod yukarı/shared katmana çıkmalıdır?
7. Kod organizasyonu büyüdükçe boundary bozulmasını hangi mekanizmalar önlemelidir?
8. Hangi davranışlar doğrudan zayıf kabul edilir?

Bu belge klasör isimlendirme listesi değildir.  
Bu belge, **mimari sınırların fiziksel ve bağımlılık düzeyindeki uygulama kuralıdır**.

---

# 2. Neden Bu Doküman Gerekli

Mimari doküman yazılı olsa bile boundary ve organizasyon kuralları yazılmamışsa pratikte şu bozulmalar oluşur:

- feature’lar birbirinin internallerine bağlanır,
- bir modülün private helper dosyaları repo genelinde kullanılmaya başlar,
- `utils`, `common`, `helpers`, `lib`, `misc` gibi anlamsız alanlar şişer,
- reusable olması gereken şeyler feature içinde kopyalanır,
- feature-local kalması gereken şeyler erken shared yapılır,
- refactor yapılınca beklenmedik yerler kırılır,
- ownership görünmez hale gelir,
- import graph anlaşılmaz olur,
- boundary ihlalleri “geçici” diye başlar ve kalıcılaşır.

Bu proje kapsamında boundary, klasör estetiği değil; **mimari güvenlik hattıdır**.  
Bu hat yazılı değilse kısa sürede delinmeye başlar.

---

# 3. Temel Tez

Bu proje kapsamında temel tez şudur:

> Modül sınırı yalnızca fiziksel klasör sınırı değildir; görünürlük, sahiplik, bağımlılık yönü, değişim etkisi ve kamuya açık yüzey sınırıdır. Kod organizasyonu bu sınırları güçlendirmeli; görünmezleştirmemelidir.

Bu tez şu sonuçları doğurur:

1. Her klasör modül değildir.
2. Her dosya herkese açık değildir.
3. Internal implementation detayları repo geneline yayılamaz.
4. Feature-first yaklaşım, kuralsız serbest alan anlamına gelmez.
5. Shared alanlar “belki lazım olur” mantığıyla büyütülemez.
6. Boundary kuralları tooling ile desteklenmelidir.

---

# 4. Modül Nedir?

## 4.1. Tanım

Bu proje kapsamında modül; belirli bir sorumluluğu taşıyan, kendi içinde anlamlı bütünlüğü olan, dış dünyaya sınırlı bir surface açan ve iç detaylarını koruması gereken kod birimidir.

## 4.2. Modülü modül yapan şeyler

Bir alanın modül sayılması için genellikle şunlar gerekir:

- açık sorumluluk
- içeride birlikte değişen dosyalar
- dışarıya kontrollü giriş noktası
- iç implementation detaylarının korunması
- ownership hissi
- boundary enforcement ihtiyacı

## 4.3. Her klasör modül değildir

Örneğin:
- sadece iki yardımcı dosyanın durduğu geçici klasör,
- anlamı belirsiz `helpers`,
- her şeyden biraz bulunan `common`,
çoğu zaman modül değil, organizasyon borcudur.

---

# 5. Modül Türleri

Bu boilerplate kapsamında ana modül türleri şunlardır:

1. **App modules**
2. **Feature modules**
3. **Shared package modules**
4. **Internal technical support modules**
5. **Config / tooling modules**

Her biri farklı visibility ve ownership davranışı taşır.

---

# 6. App Modules

## 6.1. Tanım

App modules, `apps/web` veya `apps/mobile` gibi çalıştırılabilir uygulama kabuklarının içindeki modüler alanlardır.

## 6.2. Neleri kapsar?

- app entry
- root navigation composition
- app-level providers
- feature assembly
- app-specific route/screen groupings
- platform runtime bağlama

## 6.3. Kural

App modülleri, shared package’ların tüketicisidir.  
Shared package’ların internal yapısına giremez.  
Kendi içlerinde de private/public surface mantığına sahip olmalıdır.

## 6.4. Zayıf kullanım örnekleri

- app modülünden shared package internal dosyasına deep import
- bir app module’ünün diğer app module’ünün internal’ına bağlanması
- app-specific hack’i reusable package yüzeyiymiş gibi yaymak

---

# 7. Feature Modules

## 7.1. Tanım

Feature module, belirli bir kullanıcı görevini veya ürün alt alanını temsil eden, kendi UI/state/orchestration/data bağlarını feature bağlamında tutan modüldür.

## 7.2. Neleri kapsayabilir?

- screens
- local presentation blocks
- feature-local state
- orchestration hooks
- selectors
- local mappers
- local tests
- feature-specific feedback surfaces

## 7.3. Kural

Feature module kendi iç bütünlüğünü korumalıdır.  
Başka feature’ların internallerine girmemelidir.  
Feature-local olanı erken shared yapmamalıdır.

## 7.4. Neden kritik?

Bu proje feature-first düşünceyi destekler.  
Ama feature-first, her feature’ın bağımsız küçük krallık olması demek değildir.  
Doğru boundary olmazsa feature-first kısa sürede kopya çöplüğüne döner.

---

# 8. Shared Package Modules

## 8.1. Tanım

Birden fazla app veya birden fazla feature için gerçek, sürekli ve açıklanabilir değer üreten modüllerdir.

## 8.2. Başlangıç shared package ailesi

- design tokens
- reusable UI package
- core/domain package
- testing support package
- config packages
- bazı platform-agnostic helpers

## 8.3. Kural

Shared package:
- gerçek paylaşım değeri taşımalı,
- public surface’i net olmalı,
- app internallerine bağlanmamalı,
- feature-specific detail içermemelidir.

## 8.4. Zayıf davranışlar

- tek feature’da kullanılan şeyi package yapmak
- package içinde feature business logic biriktirmek
- shared görünmesi için şeyleri yukarı taşımak

---

# 9. Internal Technical Support Modules

## 9.1. Tanım

Bir modülün veya paketin içinde kullanılan, public API olmayan teknik destek alanlarıdır.

## 9.2. Örnekler

- internal mappers
- internal composition helpers
- internal constants
- test builders
- package-private adapters

## 9.3. Kural

Bu alanlar repo geneline açılmamalıdır.  
Internal kalmaları asıl varsayımdır.

## 9.4. Zayıf davranışlar

- internal helper’ı başka feature’dan import etmek
- private dosyaları “zaten iş görüyor” diye public dependency haline getirmek

---

# 10. Config / Tooling Modules

## 10.1. Tanım

Runtime feature mantığı taşımayan; lint, type, test, build, audit ve repo governance için kullanılan modüllerdir.

## 10.2. Kural

Bu modüller application runtime kodu ile karışmamalıdır.  
Ama repo’nun resmi parçasıdır ve boundary kuralları onlar için de geçerlidir.

---

# 11. Feature-First Organizasyon Neden Varsayılan?

## 11.1. Sebep

Feature-first organizasyon şu avantajları sağlar:

- birlikte değişen dosyalar yakın yaşar
- feature ownership görünür olur
- refactor ve silme operasyonu kolaylaşır
- ekran bazlı düşünce ile ürün görevi eşleşir
- gereksiz yatay teknik klasör yayılımı azalır

## 11.2. Yanlış yorum

Feature-first demek:
- her şey tek feature klasörüne atılsın,
- katman ayrımı kaybolsun,
- `screens/components/hooks/utils` kaosu artsın
demek değildir.

## 11.3. Doğru yorum

Feature modülü içinde bile:
- UI
- state
- orchestration
- data touchpoints
- tests
mantıksal olarak okunabilir ayrım taşımalıdır.

---

# 12. Public Surface Nedir?

## 12.1. Tanım

Public surface, bir modülün dış dünyaya kullanıma açtığı resmi giriş noktalarıdır.

## 12.2. Neden gerekli?

Public surface olmazsa her dosya “kullanılabilir” hale gelir.
Bu da:
- refactor’u pahalılaştırır,
- yanlış bağımlılık yaratır,
- modül sınırını anlamsızlaştırır.

## 12.3. Public surface ne içermelidir?

- gerçekten tüketilmesi gereken exports
- stable contracts
- dış dünya için anlamlı type/function/component girişleri

## 12.4. Ne içermemelidir?

- internal helper’lar
- implementation detail’ler
- yalnızca modül içi composition parçaları
- geçici deneysel parçalar

---

# 13. Private Surface Nedir?

## 13.1. Tanım

Private surface, modülün yalnızca kendi içinde kullanılan implementation alanıdır.

## 13.2. Kural

Default varsayım private’tır.  
Yani bir dosya dışarıya özellikle açılmadıysa internal kabul edilmelidir.

## 13.3. Neden önemlidir?

Private alan korunmazsa:
- modül dışı bağımlılıklar görünmez artar,
- küçük değişiklikler zincirleme kırılma yaratır,
- ownership kaybolur.

---

# 14. Public / Private Ayrımını Nasıl Görünür Kılmalı?

## 14.1. Yöntemler

Bağlama göre şu yaklaşımlar kullanılabilir:

- entry point dosyaları
- controlled exports
- path-based import restrictions
- internal folder conventions
- lint/enforcement rules
- package export maps

## 14.2. Kural

“Ekip bilir zaten” yeterli değildir.  
Boundary görünür ve enforce edilebilir olmalıdır.

---

# 15. Deep Import Nedir?

## 15.1. Tanım

Bir modülün public entry point’i yerine, onun internal/private dosyasına doğrudan import yapmaktır.

Örnek mantık:
- Doğru: public entry üzerinden import
- Yanlış: modülün `internal/foo/bar.ts` dosyasına direkt gitmek

## 15.2. Neden tehlikelidir?

Çünkü deep import:
- encapsulation’ı bozar,
- internal refactor’u zorlaştırır,
- dependency graph’i gizlice büyütür,
- modül sahibinin iç yapıyı değiştirme özgürlüğünü yok eder.

## 15.3. En sık görülen kötü gerekçeler

- “Zaten export etmemişler ama lazım”
- “Şimdilik buradan çekelim”
- “Tek seferlik”
- “Public entry’e eklemek istemedim”

Bunların hepsi boundary ihlalini meşrulaştırma cümlesidir.

---

# 16. Deep Import Neden Özellikle Cross-Platform Projede Daha Tehlikeli?

Cross-platform yapılarda modül sınırları zaten daha hassastır.  
Deep import yapılınca:
- app-specific internal yapılar yanlışlıkla paylaşılır,
- platform-specific implementation detayı shared contract gibi kullanılmaya başlar,
- web/mobile parity’yi bozan gizli bağımlılıklar oluşur.

Bu yüzden deep import bu projede küçük ihlal sayılmaz; yapısal risktir.

---

# 17. Boundary İhlali Türleri

Bu boilerplate kapsamında boundary ihlalleri en az şu ailelerde düşünülmelidir:

1. **Feature-to-feature internal access**
2. **App-to-package private access**
3. **Package-to-app internal access**
4. **UI-to-domain internal leakage**
5. **Feature-local code’in erken shared yapılması**
6. **Shared alanın çöplüğe dönüşmesi**
7. **Private test builder/helper’ların production dependency haline gelmesi**
8. **Temporary workaround’ların kalıcı boundary ihlaline dönüşmesi**

---

# 18. Feature-to-Feature Internal Access

## 18.1. Neden yanlış?

Bir feature’ın başka bir feature’ın internal dosyasına bağlanması şu riskleri üretir:
- gizli coupling
- zor refactor
- ownership belirsizliği
- feature silme/zayıflatma zorluğu

## 18.2. Doğru alternatif

- gerçekten ortaksa shared surface tasarla
- değilse feature kendi ihtiyacını kendi içinde çözsün
- gerekiyorsa domain/core seviyesinde ortak contract çıkar

---

# 19. Package-to-App ve App-to-Package Boundary

## 19.1. Doğru yön

App, package’ın public yüzeyini tüketir.  
Package, app internallerine bağlanmaz.

## 19.2. Neden?

Çünkü package reusable/top-level shared alan iken app bağlamsaldır.  
Bu yön tersine dönerse shared katman anlamsızlaşır.

## 19.3. Zayıf davranışlar

- shared package içinde app route bilgisi kullanmak
- package’ın app feature dosyasına import açması
- app’in package internal klasörlerine dalması

---

# 20. UI-to-Domain ve Domain-to-UI Boundary

## 20.1. Domain’in UI’yı bilmesi neden yanlış?

Çünkü domain saf karar alanıdır.  
UI bilgisi domain’e sızarsa:
- test pahalılaşır,
- portability düşer,
- reuse bozulur.

## 20.2. UI’nın domain internallerini bilmesi neden dikkatli yönetilmeli?

UI domain public contract’ını kullanabilir.  
Ama domain internal dosyalarına girmemelidir.

---

# 21. Feature-Local Kod Ne Zaman Local Kalmalı?

Aşağıdaki şeyler güçlü biçimde feature-local kalmalıdır:

- yalnızca tek feature’da anlamlı UI compositions
- feature-specific mappers
- local orchestration hooks
- only-this-feature selectors
- feature-private constants
- screen-specific test fixtures

## 21.1. Neden?

Erken shared yapıldığında:
- abstraction sahte olur,
- public surface şişer,
- bakım maliyeti artar,
- isimlendirme kalitesi düşer.

---

# 22. Bir Şey Ne Zaman Shared’a Çıkmalı?

Bir şeyin yukarı/shared katmana çıkması için aşağıdakilerin çoğu sağlanmalıdır:

1. En az iki gerçek kullanım bağlamı var
2. Bu kullanım tesadüfi benzerlik değil, aynı contract
3. API sade biçimde açıklanabiliyor
4. Feature-local kalması duplication ve risk üretiyor
5. Yukarı taşımak boundary’yi netleştiriyor
6. Platform-specific detail içermiyor ya da doğru adapter modeli var

Bunlar yoksa shared kararı erken ve zayıftır.

---

# 23. `utils`, `helpers`, `common`, `lib` Sorunu

## 23.1. Bu isimler neden tehlikeli?

Çünkü genelde şunu gizlerler:
“Bunu nereye koyacağımızı bilmiyoruz.”

## 23.2. Ne zaman meşru olabilir?

Çok sınırlı ve açık tanımlı internal yardımcı alanlarda, kapsamı netse.

Örneğin:
- modül içi küçük internal helper alanı
- ama kesinlikle repo geneli için anlamsız depo değil

## 23.3. Kural

Aşağıdaki isimler varsayılan olarak zayıf kabul edilmelidir:
- common
- misc
- helpers
- stuff
- tmp
- new
- final
- shared (açıklamasız kullanılıyorsa)
- lib (belirsizse)

---

# 24. Dosya Yerleşimi Kararı Verirken Sorulacak Sorular

Yeni dosya eklerken şu sorular sorulmalıdır:

1. Bu dosyanın sahibi kim?
2. Bu dosya hangi modülün parçası?
3. Dış dünyaya açık olması gerekiyor mu?
4. Feature-local mi, package-level mı?
5. Başka feature’lar bunu gerçekten kullanmalı mı?
6. Eğer bugün public yaparsam yarın refactor’u pahalılaşır mı?
7. Bu dosya aslında mevcut bir modülün içine mi ait?
8. Bu placement boundary’yi güçlendiriyor mu, bulanıklaştırıyor mu?

---

# 25. Import Yönü Kuralları

Genel ilke:

- üst bağlam, alt bağlamın public surface’ini kullanabilir
- sibling feature’lar birbirinin private alanına giremez
- app, shared packages’ı kullanabilir
- shared package, app internal’ına giremez
- domain/core benzeri alanlar UI detayına bağımlı olamaz
- test support alanları production internallerini delme bahanesi olamaz

Bu yönler tooling ile desteklenmelidir.

---

# 26. Bağımlılık Yönü Neden Boundary Kuralıdır?

Klasör düzeni güzel olsa bile import yönü yanlışsa gerçek boundary yoktur.

Örnek:
- domain klasörü var ama UI’dan type/component import ediyor
- feature klasörü var ama başka feature’ın internal hook’unu kullanıyor
- package var ama app route dosyasına bağlı

Bu durumda klasör yalnızca dekorasyondur.  
Gerçek boundary bağımlılık yönü ile kurulur.

---

# 27. Modül İç Yapısı Nasıl Düşünülmeli?

Bir modül içinde aşağıdaki gibi alt alanlar meşru olabilir:

- `ui/`
- `state/`
- `model/`
- `data/`
- `orchestration/`
- `internal/`
- `tests/`

Ama bunlar kör şablon olarak her modüle eklenmemelidir.  
Kural şu olmalıdır:

> Alt yapı, modülün gerçek ihtiyacını görünür kılmalı; soyut klasör tiyatrosu üretmemelidir.

---

# 28. Feature Modülü İçinde Denge Nasıl Kurulur?

Feature modülü içinde iki aşırı uç vardır:

## 28.1. Aşırı teknik ayrım

Her feature’da:
- components/
- hooks/
- utils/
- services/
- constants/
- models/
- containers/
- views/
- types/
gibi çok sayıda yatay klasör açmak.

Bu çoğu zaman feature bağlamını dağıtır.

## 28.2. Aşırı yığma

Her şeyi tek klasöre atmak.

Bu da kısa sürede okunamaz hale gelir.

## 28.3. Doğru yaklaşım

Feature içinde gerçekten anlamlı alt gruplar açılmalı:
- ekran yüzeyleri
- orchestration/state
- local model/selectors
- local tests
ama gereksiz klasör şişkinliğinden kaçınılmalıdır.

---

# 29. Public API Tasarımı ile Boundary İlişkisi

Bir modülün public entry’si iyi tasarlanmazsa boundary zaten bozulur.

## 29.1. İyi public entry özellikleri

- sınırlı
- açıklanabilir
- stable
- gerçek kullanım odaklı
- internal detayı gizleyen

## 29.2. Kötü public entry özellikleri

- her dosyayı export etmek
- convenience uğruna tüm internali açmak
- yalnızca bir tüketici için garip shape’ler eklemek
- internal helper export yağmuru

---

# 30. Naming Convention Standardı

Proje genelinde tutarlı ve öngörülebilir isimlendirme, kod okunabilirliğinin ve bakım kolaylığının temel taşıdır. Tutarsız isimlendirme; bir geliştiricinin aynı kavramı farklı biçimlerde ifade etmesine, arama sonuçlarının dağılmasına, yanlış dosyaya yönlenmeye ve zaman içinde projenin içinden çıkılmaz bir isimlendirme kaosu üretmesine yol açar. Bu bölüm; component, dosya, fonksiyon, hook, type, enum, constant ve değişken isimlendirmesi için proje genelinde geçerli tek bir standart tanımlar.

## 30.1. Component Naming Convention

### 30.1.1. PascalCase kuralı

React component adları her zaman PascalCase ile yazılır. PascalCase, her kelimenin ilk harfinin büyük olması anlamına gelir. Kısaltma veya kırpılmış isimler kullanılmaz; isim açıklayıcı ve tam olmalıdır.

Doğru örnekler:
- `UserProfile`
- `OrderList`
- `PrimaryButton`
- `NotificationBanner`
- `PaymentMethodSelector`

Yanlış örnekler:
- `Btn` — kısaltma yasaktır, `Button` olmalıdır
- `usrProfile` — camelCase component için yanlıştır
- `order_list` — snake_case component için hiçbir zaman kullanılmaz
- `notifBanner` — kısaltılmış ve belirsizdir

Bu kural her koşulda geçerlidir. Component ister küçük bir buton olsun ister büyük bir ekran parçası olsun, PascalCase ve tam isim zorunludur.

### 30.1.2. Component dosya adı

Bir component dosyasının adı, component'in adıyla birebir aynı olmalıdır ve PascalCase ile yazılmalıdır. Dosya uzantısı `.tsx` olmalıdır (TypeScript + JSX içerdiği için).

Doğru:
- `UserProfile.tsx` dosyasının içinde `UserProfile` component'i bulunur
- `PrimaryButton.tsx` dosyasının içinde `PrimaryButton` component'i bulunur
- `OrderList.tsx` dosyasının içinde `OrderList` component'i bulunur

Yanlış:
- `user-profile.tsx` dosyasında `UserProfile` component'i — dosya adı ile component adı uyumsuz
- `primary_button.tsx` — snake_case component dosyası için kullanılmaz

Her dosyada yalnızca bir adet component bulunmalı ve o component default export edilmelidir. Bir dosyada birden fazla component tanımlamak (ör: `UserProfile` ve `UserAvatar` aynı dosyada) yasaktır. Yardımcı alt component'ler bile kendi dosyasında yaşamalıdır.

### 30.1.3. Component prop type adlandırması

Her component'in prop type'ı `{ComponentAdı}Props` formatında adlandırılmalıdır. Bu format tüm projede tutarlı olmalıdır.

Doğru örnekler:
- `UserProfile` component'inin prop type'ı: `UserProfileProps`
- `PrimaryButton` component'inin prop type'ı: `PrimaryButtonProps`
- `OrderList` component'inin prop type'ı: `OrderListProps`
- `NotificationBanner` component'inin prop type'ı: `NotificationBannerProps`

Yanlış örnekler:
- `IUserProfileProps` — `I` prefix TypeScript convention'ına aykırıdır
- `UserProfileProperties` — gereksiz uzunluk, `Props` suffix'i standarttır
- `Props` — hangi component'in prop'u olduğu belirsizdir

### 30.1.4. Compound component adlandırması

Compound component pattern'inde ana component adı kök isim olur; alt component'ler nokta notasyonu ile ana component'e bağlanır.

Doğru örnekler:
- `Card` (ana component)
- `Card.Header` (alt component)
- `Card.Body` (alt component)
- `Card.Footer` (alt component)
- `Accordion` → `Accordion.Item`, `Accordion.Trigger`, `Accordion.Content`
- `Table` → `Table.Head`, `Table.Row`, `Table.Cell`

Bu yapıda her alt component kendi dosyasında tanımlanır ve ana component üzerinden dışarıya açılır. Tüketici, `Card.Header` şeklinde erişir.

### 30.1.5. HOC / wrapper adlandırması

Higher-Order Component (HOC) veya wrapper fonksiyonları `with` prefix'i ile başlar.

Doğru örnekler:
- `withAuth` — authentication sarmalayıcısı
- `withTheme` — tema sağlayıcı sarmalayıcısı
- `withErrorBoundary` — error boundary sarmalayıcısı

Ancak bu projede HOC pattern'i yerine hook'a dönüştürme tercih edilir. HOC genellikle composition sorunları, tip güvenliği zorlukları ve debugging karmaşıklığı üretir. Dolayısıyla `withAuth` yerine `useAuth` hook'u tercih edilir; yalnızca hook'un çözemediği cross-cutting durumlarda HOC düşünülebilir.

### 30.1.6. Layout component adlandırması

Layout (düzen) component'leri `Layout` suffix'i ile adlandırılır. Bu, component'in bir sayfa düzeni (layout) olduğunu, ürün feature'ı olmadığını açıkça gösterir.

Doğru örnekler:
- `DashboardLayout` — dashboard sayfalarının ortak iskelet düzeni
- `AuthLayout` — giriş/kayıt sayfalarının ortak düzeni
- `SettingsLayout` — ayarlar bölümünün ortak düzeni
- `MainLayout` — ana sayfa düzeni

### 30.1.7. Screen/Page component adlandırması

Ekran veya sayfa düzeyinde çalışan component'ler platforma göre suffix alır:
- Mobil (React Native): `Screen` suffix'i kullanılır
- Web (React): `Page` suffix'i kullanılır

Doğru örnekler:
- `ProfileScreen` — mobilde profil ekranı
- `SettingsScreen` — mobilde ayarlar ekranı
- `OrderDetailScreen` — mobilde sipariş detay ekranı
- `ProfilePage` — webde profil sayfası
- `SettingsPage` — webde ayarlar sayfası
- `DashboardPage` — webde dashboard sayfası

Bu suffix ayrımı, dosyaya bakan herkesin bu component'in bir tam ekran/sayfa mı yoksa küçük bir parça mı olduğunu hemen anlamasını sağlar.

### 30.1.8. Platform-specific dosya adlandırması

Aynı component'in web ve mobil için farklı implementasyonları gerektiğinde platform suffix'leri kullanılır:
- `.native.tsx` — React Native (mobil) implementasyonu
- `.web.tsx` — Web implementasyonu

Doğru örnekler:
- `ImagePicker.native.tsx` — mobilde native image picker kullanan implementasyon
- `ImagePicker.web.tsx` — webde file input veya drag-drop kullanan implementasyon
- `DateInput.native.tsx` — mobilde native date picker kullanan implementasyon
- `DateInput.web.tsx` — webde HTML date input veya custom picker kullanan implementasyon

Metro bundler (React Native) ve webpack/vite (web) bu suffix'leri otomatik olarak çözümler (resolve eder). Dolayısıyla tüketici sadece `import ImagePicker from './ImagePicker'` yazar; doğru platform dosyası otomatik seçilir.

## 30.2. Dosya ve Fonksiyon Naming Pattern

### 30.2.1. Dosya adları

Feature modülü içindeki dosyalar (component dosyaları hariç) kebab-case ile adlandırılır. Kebab-case, kelimelerin küçük harfle yazılıp tire ile ayrılması anlamına gelir.

Doğru örnekler:
- `use-user-profile.ts` — custom hook dosyası
- `user-profile.service.ts` — servis dosyası
- `user-profile.types.ts` — type tanım dosyası
- `order-history.utils.ts` — yardımcı fonksiyon dosyası
- `auth-flow.constants.ts` — sabit değer dosyası
- `payment-method.mapper.ts` — mapper dosyası

Yanlış örnekler:
- `useUserProfile.ts` — camelCase hook dosya adı için kullanılmaz (component değil)
- `user_profile.service.ts` — snake_case dosya adı için kullanılmaz
- `UserProfileService.ts` — PascalCase yalnızca component dosyaları için kullanılır

İstisna: Component dosyaları PascalCase kuralına tabidir (30.1.2'de tanımlandığı gibi). Yani aynı feature klasöründe `UserProfile.tsx` (component, PascalCase) ve `use-user-profile.ts` (hook, kebab-case) bir arada bulunabilir. Bu tutarsızlık değildir; bilinçli ayrımdır.

### 30.2.2. Klasör adları

Tüm klasör adları kebab-case ile yazılır. Hiçbir klasör PascalCase veya camelCase ile adlandırılmaz.

Doğru örnekler:
- `user-profile/`
- `order-history/`
- `auth-flow/`
- `payment-methods/`
- `notification-settings/`

Yanlış örnekler:
- `UserProfile/` — PascalCase klasör için kullanılmaz
- `userProfile/` — camelCase klasör için kullanılmaz
- `user_profile/` — snake_case klasör için kullanılmaz

### 30.2.3. Hook adları

Custom hook'lar `use` prefix'i ile başlar ve camelCase ile devam eder. `use` prefix'i React'ın hook kuralları (rules of hooks) için zorunludur; bu prefix olmadan React hook'u hook olarak tanımaz ve lint kuralları hata verir.

Doğru örnekler:
- `useUserProfile` — kullanıcı profili verisi/state'i yöneten hook
- `useOrderList` — sipariş listesi verisi/state'i yöneten hook
- `useFormValidation` — form doğrulama mantığını yöneten hook
- `useDebounce` — debounce davranışı sağlayan hook
- `useMediaQuery` — medya sorgusu dinleyen hook

Hook dosyası ise kebab-case ile adlandırılır:
- `useUserProfile` hook'u → `use-user-profile.ts` dosyasında yaşar
- `useFormValidation` hook'u → `use-form-validation.ts` dosyasında yaşar

Yanlış örnekler:
- `userProfileHook` — `use` prefix'i eksik
- `UseUserProfile` — PascalCase hook adı için yanlış (hook fonksiyondur, component değil)
- `getUserProfile` — `use` prefix'siz hook React tarafından tanınmaz

### 30.2.4. Utility fonksiyon adları

Utility (yardımcı) fonksiyonları camelCase ile yazılır ve bir fiil (eylem) ile başlar. Fiil ile başlaması, fonksiyonun ne yaptığını ilk bakışta anlaşılır kılar.

Doğru örnekler:
- `formatDate` — tarihi biçimlendirir
- `validateEmail` — e-posta adresini doğrular
- `parseQueryParams` — URL query parametrelerini ayrıştırır
- `calculateTotal` — toplam tutarı hesaplar
- `truncateText` — metni belirli uzunlukta keser
- `generateId` — benzersiz kimlik üretir
- `mergeClassNames` — CSS sınıf adlarını birleştirir

Yanlış örnekler:
- `dateFormatter` — isim (noun) değil, fiil ile başlamalı
- `emailValidation` — fonksiyon adı fiil ile başlamalı
- `query_params_parser` — snake_case kullanılmaz
- `FormatDate` — PascalCase fonksiyon adı için yanlış

### 30.2.5. Service fonksiyon adları

Service fonksiyonları (genellikle API çağrısı yapan veya dış kaynakla etkileşen fonksiyonlar) camelCase ile yazılır ve CRUD fiili + entity pattern'ini takip eder.

Doğru örnekler:
- `fetchUsers` — kullanıcıları getirir (Read)
- `fetchOrderById` — belirli bir siparişi getirir (Read)
- `createOrder` — yeni sipariş oluşturur (Create)
- `updateProfile` — profil günceller (Update)
- `deleteComment` — yorum siler (Delete)
- `searchProducts` — ürün arar (Read varyantı)

Sık kullanılan CRUD fiilleri:
- **fetch / get**: veri okuma
- **create**: yeni kayıt oluşturma
- **update / patch**: mevcut kaydı güncelleme
- **delete / remove**: kayıt silme
- **search**: arama

Yanlış örnekler:
- `usersApi` — ne yaptığı belirsiz
- `orderService` — fonksiyon değil, nesne gibi görünüyor
- `handleGetUser` — `handle` prefix'i event handler'lar için ayrılmıştır

### 30.2.6. Type / Interface adlandırması

Type ve interface adları PascalCase ile yazılır. `I` prefix'i (ör: `IUser`) TypeScript topluluğunun genel convention'ına aykırıdır ve bu projede kesinlikle yasaktır. `I` prefix'i C# dünyasından gelir; TypeScript'te gereksizdir çünkü TypeScript'te type ve interface zaten aynı kullanım amacına sahiptir.

Doğru örnekler:
- `User` — kullanıcı tipi
- `OrderItem` — sipariş kalemi tipi
- `FormValues` — form değerleri tipi
- `PaymentMethod` — ödeme yöntemi tipi
- `NavigationParams` — navigasyon parametreleri tipi

Response type'lar entity adı + `Response` suffix'i ile adlandırılır:
- `UsersResponse` — kullanıcı listesi API response tipi
- `OrderDetailResponse` — sipariş detay API response tipi
- `LoginResponse` — giriş API response tipi

Request type'lar entity adı + `Request` suffix'i ile adlandırılır:
- `CreateOrderRequest` — sipariş oluşturma request tipi
- `UpdateProfileRequest` — profil güncelleme request tipi

Yanlış örnekler:
- `IUser` — `I` prefix yasak
- `IOrderItem` — `I` prefix yasak
- `user` — PascalCase olmalı (küçük harfle başlatılmaz)
- `UserType` — `Type` suffix'i gereksiz, zaten type tanımı olduğu bağlamdan anlaşılır

### 30.2.7. Boolean değişken adlandırması

Boolean (doğru/yanlış) değer taşıyan değişkenler, durumu soru olarak ifade eden prefix'ler ile başlamalıdır. Bu prefix'ler değişkenin boolean olduğunu ilk bakışta anlaşılır kılar.

Kullanılacak prefix'ler:
- `is` — mevcut durum: `isLoading`, `isVisible`, `isAuthenticated`, `isDisabled`
- `has` — sahiplik: `hasError`, `hasPermission`, `hasUnsavedChanges`, `hasNotification`
- `can` — yetki/yetenek: `canEdit`, `canDelete`, `canSubmit`, `canAccessAdmin`
- `should` — koşullu davranış: `shouldRefresh`, `shouldAnimate`, `shouldShowBanner`, `shouldRetry`

Yanlış örnekler:
- `loading` — boolean olduğu belirsiz, `isLoading` olmalı
- `error` — hata nesnesi mi boolean mu belirsiz, `hasError` olmalı
- `visible` — `isVisible` olmalı
- `editable` — `canEdit` olmalı

### 30.2.8. Event handler adlandırması

Event handler'lar (olay işleyiciler) iki bağlamda farklı prefix alır:

**Component içi handler (implementasyon):** `handle` prefix'i kullanılır.
- `handleSubmit` — form gönderme olayını işler
- `handlePress` — basma olayını işler
- `handleChange` — değişiklik olayını işler
- `handleDelete` — silme aksiyonunu işler
- `handleToggle` — açma/kapama olayını işler

**Prop olarak dışarıya açılan handler:** `on` prefix'i kullanılır.
- `onSubmit` — form gönderildiğinde çağrılacak callback
- `onClick` — tıklama olayı callback'i
- `onPressItem` — item'a basılma callback'i
- `onChange` — değişiklik callback'i
- `onDismiss` — kapatma/dismiss callback'i

Pratik kullanım: Bir component, dışarıdan `onPress` prop'u alır ve kendi içinde `handlePress` fonksiyonu tanımlar. `handlePress` fonksiyonu gerekli iş mantığını çalıştırır ve sonra `onPress` prop'unu çağırır. Bu ayrım, hangi handler'ın iç implementasyon hangisinin dış contract olduğunu netleştirir.

### 30.2.9. Constant (sabit değer) adlandırması

Değişmez sabit değerler SCREAMING_SNAKE_CASE ile yazılır. SCREAMING_SNAKE_CASE, tüm harflerin büyük olması ve kelimelerin alt çizgi ile ayrılması anlamına gelir.

Doğru örnekler:
- `MAX_RETRY_COUNT` — maksimum tekrar deneme sayısı
- `DEFAULT_PAGE_SIZE` — varsayılan sayfa boyutu
- `API_BASE_URL` — API temel URL'i
- `ANIMATION_DURATION_MS` — animasyon süresi (milisaniye)
- `MIN_PASSWORD_LENGTH` — minimum şifre uzunluğu
- `TOAST_DISPLAY_DURATION` — bildirim gösterim süresi

Yanlış örnekler:
- `maxRetryCount` — camelCase sabit için kullanılmaz (değişken gibi görünür)
- `max_retry_count` — küçük harfli snake_case sabit için kullanılmaz
- `MaxRetryCount` — PascalCase sabit için kullanılmaz

## 30.3. Enum ve Constant Naming

### 30.3.1. Enum adlandırması

Enum adları PascalCase ile yazılır ve tekil (singular) olmalıdır. Çoğul isim kullanmak yasaktır.

Doğru örnekler:
- `OrderStatus` — sipariş durumu enum'u
- `UserRole` — kullanıcı rolü enum'u
- `ThemeMode` — tema modu enum'u
- `PaymentMethod` — ödeme yöntemi enum'u
- `NotificationType` — bildirim türü enum'u

Yanlış örnekler:
- `OrderStatuses` — çoğul isim yasak, `OrderStatus` olmalı
- `UserRoles` — çoğul isim yasak, `UserRole` olmalı
- `THEME_MODE` — SCREAMING_SNAKE_CASE enum adı için kullanılmaz (constant ile karışır)

Tekil isim kullanılmasının sebebi: Enum bir kategori tanımlar, tek bir değer bir öğesidir. `OrderStatus.Pending` okunduğunda "sipariş durumu: beklemede" anlaşılır; `OrderStatuses.Pending` ise dilbilgisel olarak tutarsızdır.

### 30.3.2. Enum değeri adlandırması

Enum değerleri PascalCase ile yazılır.

Doğru örnekler:
- `OrderStatus.Pending` — beklemede
- `OrderStatus.Completed` — tamamlandı
- `OrderStatus.Cancelled` — iptal edildi
- `UserRole.Admin` — yönetici
- `UserRole.Editor` — editör
- `UserRole.Viewer` — görüntüleyici
- `ThemeMode.Light` — açık tema
- `ThemeMode.Dark` — koyu tema
- `ThemeMode.System` — sistem teması

Yanlış örnekler:
- `OrderStatus.PENDING` — SCREAMING_SNAKE_CASE enum değeri için kullanılmaz
- `OrderStatus.pending` — küçük harfle başlatılmaz
- `OrderStatus.order_pending` — snake_case kullanılmaz

### 30.3.3. String literal union (enum alternatifi)

TypeScript'te enum yerine string literal union tercih edilir. Bunun en önemli sebebi tree-shaking uyumluluğudur. TypeScript enum'ları derleme sonrası JavaScript'te nesne (object) olarak kalır ve kullanılmasa bile bundle'a dahil edilir. String literal union ise derleme sonrası tamamen kaybolur (type-level construct), dolayısıyla bundle boyutunu artırmaz.

String literal union değerleri lowercase kebab-case ile yazılır.

Doğru örnekler:
```typescript
type Theme = 'light' | 'dark' | 'system'
type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost'
type OrderStatus = 'pending' | 'in-progress' | 'completed' | 'cancelled'
type Size = 'sm' | 'md' | 'lg' | 'xl'
```

Yanlış örnekler:
```typescript
type Theme = 'Light' | 'Dark' | 'System' // PascalCase string literal için yanlış
type ButtonVariant = 'PRIMARY' | 'SECONDARY' // SCREAMING_SNAKE_CASE yanlış
```

Pratikte tercih sırası: String literal union > TypeScript enum. Enum yalnızca runtime'da enum değerinin gerçekten nesne olarak kullanılması gerektiğinde (ör: iteration, reverse mapping) düşünülebilir.

### 30.3.4. Constant object adlandırması

Sabit nesneler (constant objects) SCREAMING_SNAKE_CASE key'ler ile tanımlanır ve `as const` assertion'ı ile dondurulur.

Doğru örnekler:
```typescript
const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const

const BREAKPOINTS = {
  MOBILE: 375,
  TABLET: 768,
  DESKTOP: 1024,
  WIDE: 1440,
} as const

const QUERY_KEYS = {
  USERS: 'users',
  ORDERS: 'orders',
  PRODUCTS: 'products',
} as const
```

`as const` assertion'ının önemi: Bu assertion olmadan TypeScript değerleri geniş tip (ör: `number`, `string`) olarak çıkarır. `as const` ile değerler literal tip (ör: `200`, `'users'`) olarak korunur ve type-safety artar.

### 30.3.5. Magic number yasağı

Magic number (sihirli sayı), kodda bağlamsız olarak kullanılan anlamı belirsiz sayısal değerdir. Bu projede magic number kullanmak yasaktır.

Yanlış:
```typescript
if (count > 10) { ... }
if (password.length < 8) { ... }
setTimeout(callback, 3000)
```

Doğru:
```typescript
const MAX_ITEMS_PER_PAGE = 10
const MIN_PASSWORD_LENGTH = 8
const TOAST_DISPLAY_DURATION_MS = 3000

if (count > MAX_ITEMS_PER_PAGE) { ... }
if (password.length < MIN_PASSWORD_LENGTH) { ... }
setTimeout(callback, TOAST_DISPLAY_DURATION_MS)
```

Magic number yasağının sebebi: `10` sayısı kodda tek başına durduğunda ne anlama geldiği belirsizdir. `MAX_ITEMS_PER_PAGE` ise amacını açıkça ifade eder. Ayrıca bu değer birden fazla yerde kullanılıyorsa tek noktadan değiştirme imkanı sağlar. Magic string'ler için de aynı kural geçerlidir.

### 30.3.6. Hatalı yaklaşımlar özeti

Aşağıdaki davranışlar bu proje kapsamında naming convention ihlali sayılır:

1. **Aynı projede camelCase ve snake_case karıştırmak** — değişken adlarında tutarsızlık (ör: bir dosyada `userName`, başka dosyada `user_name`). Proje genelinde camelCase geçerlidir.
2. **Component'i küçük harfle başlatmak** — `button` değil `Button`. React, küçük harfle başlayan tag'leri HTML elementi olarak yorumlar; bu runtime hatasına yol açar.
3. **Hook'u `use` prefix'siz yazmak** — `getUserData` bir hook değildir; `useUserData` hook'tur. React lint kuralları `use` prefix'siz hook'u yakalayamaz ve rules of hooks ihlalleri gizlenir.
4. **Type'a `I` prefix eklemek** — `IUser` yerine `User`. TypeScript topluluğu bu convention'ı terk etmiştir; gereksiz gürültü üretir.
5. **Enum'a çoğul ad vermek** — `OrderStatuses` yerine `OrderStatus`. Enum bir kategori tanımlar, çoğul isim dilbilgisel olarak yanlıştır.
6. **Dosya adı ile içerik arasında uyumsuzluk** — `user-profile.tsx` dosyasında `AccountSettings` component'i. Dosya adı içeriği doğrudan yansıtmalıdır.
7. **Sabit değerleri camelCase yazmak** — `maxRetryCount` yerine `MAX_RETRY_COUNT`. Sabit değerler SCREAMING_SNAKE_CASE ile ayırt edilmelidir.
8. **Boolean değişkenlere uygun prefix koymamak** — `loading` yerine `isLoading`. Prefix olmadan değişkenin boolean olduğu anlaşılmaz.
9. **Event handler prefix'lerini karıştırmak** — iç handler'da `on`, prop'ta `handle` kullanmak. Doğru ayrım: iç handler'da `handle`, prop'ta `on`.
10. **Magic number/string kullanmak** — `if (count > 10)` yerine adlandırılmış sabit kullanılmalıdır.

---

# 31. Boundary ve Ownership İlişkisi

Boundary yalnızca import yönü değil, sahipliktir.

Bir modül için şu soruların cevabı görünür olmalıdır:
- Bu modülün sahibi kim?
- Public surface değişirse kim sorumlu?
- Bu modülün internali kimin refactor alanı?
- Bu modülün genişlemesi hangi kural setine göre olur?

Ownership belirsizse boundary hızla delinmeye başlar.

---

# 32. Testler Boundary’yi Nasıl Bozabilir?

## 32.1. Sık görülen hata

Test yazarken internal helper veya private builder’ı production tarafına taşımak.

## 32.2. Doğru yaklaşım

- test support alanı ayrı ve kontrollü olmalı
- feature-private fixture’lar shared fixture gibi sunulmamalı
- test için yapılan kolaylık production import surface’ini genişletmemeli

## 32.3. Kural

Test convenience, mimari ihlal bahanesi değildir.

---

# 33. Boundary Enforcement Tooling Yaklaşımı

Boundary’ler yalnızca sözlü kural olarak bırakılmamalıdır.  
Güçlü enforcement araçları şunlardır:

- forbidden path rules
- import boundary lint rules
- package export restrictions
- deep import detection
- dependency graph checks
- app-to-package / package-to-app yön kontrolleri
- selected public API rules

Bu kuralların noise üretmemesi gerekir.  
Ama hiç olmamaları daha büyük risktir.

---

# 34. Boundary Drift Sinyalleri

Aşağıdaki sinyaller boundary drift göstergesidir:

1. `shared/common/utils` klasörleri büyüyorsa
2. Feature’lar birbirinden dosya çekmeye başladıysa
3. Package internal dosyalarına deep import arttıysa
4. Aynı helper farklı modüllerde kopyalanıyorsa ama shared kararı verilemiyorsa
5. App shell kodu feature detayları ile doluyorsa
6. PR’larda sürekli placement tartışması çıkıyorsa
7. Public entry dosyaları giderek şişiyorsa
8. Refactor yapınca beklenmedik uzak yerler kırılıyorsa

---

# 35. Boundary İhlali Görüldüğünde Ne Yapılmalı?

Bir boundary ihlali tespit edildiğinde aşağıdaki sıra izlenmelidir:

1. Bu gerçekten boundary ihlali mi, yoksa eksik public contract mı?
2. Tüketen taraf yanlış yerde mi, sağlayan tarafın public surface’i mi eksik?
3. Bu şey local kalmalı mıydı?
4. Shared contract gerekiyorsa nerede tanımlanmalı?
5. Tooling kuralı eklenmeli mi?
6. Bu tekrar eden bir pattern mi?

Hemen “export edelim geçsin” çoğu zaman yanlış çözümdür.

---

# 36. Module Boundaries Anti-Pattern Listesi

Aşağıdaki davranışlar bu proje kapsamında zayıf kabul edilir:

1. Klasör var diye boundary var sanmak
2. Deep import’ı normal görmek
3. Feature-local kodu erken shared yapmak
4. Shared alanı çöplüğe çevirmek
5. `utils/common/helpers/lib` alanlarını belirsiz depo olarak kullanmak
6. Public/private ayrımını hiç tanımlamamak
7. App ile package yönünü tersine çevirmek
8. Feature’ların birbirinin internal’ına bağlanmasına izin vermek
9. Test bahanesiyle production internallerini açmak
10. Placement kararlarını kişisel zevkle vermek
11. Public entry’yi convenience uğruna şişirmek
12. “Temporary” boundary ihlallerini kalıcılaştırmak

---

# 37. Sonraki Dokümanlara Etkisi

## 37.1. State management strategy
`09-state-management-strategy.md`, state sahipliğini modül sınırlarıyla uyumlu yerleştirmelidir.

## 37.2. Data fetching / cache / sync
`10-data-fetching-cache-sync.md`, data contracts ve mapping alanlarını boundary mantığıyla hizalamalıdır.

## 37.3. Testing strategy
`14-testing-strategy.md`, test support ile production boundaries arasındaki farkı bu belgeye göre korumalıdır.

## 37.4. Quality gates and CI rules
`15-quality-gates-and-ci-rules.md`, boundary enforcement kurallarını resmi kalite kapısına bağlamalıdır.

## 37.5. Contribution guide
`30-contribution-guide.md`, yeni dosya/modül eklerken placement ve public/private değerlendirmesini bu belgeye göre istemelidir.

## 37.6. Audit checklist
`31-audit-checklist.md`, boundary drift ve modül yerleşim bozulmalarını bu belgeye göre denetlemelidir.

---

# 38. Onay Kriterleri

Bu doküman yeterli kabul edilir eğer:

1. Modül kavramı ve modül türleri net tanımlanmışsa,
2. Public/private surface mantığı açıklanmışsa,
3. Deep import yasağı ve gerekçesi görünür kılınmışsa,
4. Feature-first organizasyon ile boundary disiplini birlikte ele alınmışsa,
5. Shared-by-proof ilkesi operasyonel biçimde yazılmışsa,
6. Import yönü ve ownership mantığı açıklanmışsa,
7. Tooling ve drift sinyalleri tanımlanmışsa,
8. Sonraki state, data, testing, CI ve contribution belgelerine uygulanabilir temel sağlanmışsa.

---

# 39. Kısa Sonuç

Bu dokümanın ana çıktısı şudur:

> Bu boilerplate kapsamında modül sınırları, klasör düzeni değil; public/private görünürlük, import yönü, sahiplik, paylaşım gerekçesi ve refactor güvenliğini yöneten mimari koruma hattıdır. Kod organizasyonu bu hattı güçlendirmeli; görünmez ve keyfi hale getirmemelidir.
