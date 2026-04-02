# 38-version-compatibility-matrix.md

## Doküman Kimliği

- **Doküman adı:** Version Compatibility Matrix
- **Dosya adı:** `38-version-compatibility-matrix.md`
- **Doküman türü:** Technical governance / compatibility control / upgrade safety matrix
- **Durum:** Accepted
- **Kapsam:** Bu belge, boilerplate kapsamında kullanılan canonical stack’in birlikte uyumlu sürüm bantlarını, hangi major/minor hatların birlikte kullanılacağını, hangi kombinasyonların riskli veya yasaklı kabul edileceğini, upgrade sırasını, blocker uyumsuzlukları, kontrollü geçiş kurallarını ve exact version pin ile strategic version track arasındaki farkı tanımlar.
- **Bağlı olduğu üst dokümanlar:**
  - `15-quality-gates-and-ci-rules.md`
  - `17-technology-decision-framework.md`
  - `29-release-and-versioning-rules.md`
  - `36-canonical-stack-decision.md`
  - `37-dependency-policy.md`
  - `ADR-001` → `ADR-017`
- **Doğrudan etkileyeceği dokümanlar:**
  - `19-roadmap-to-implementation.md`
  - `20-initial-implementation-checklist.md`
  - `21-repo-structure-spec.md`
  - `29-release-and-versioning-rules.md`
  - `30-contribution-guide.md`
  - `31-audit-checklist.md`

---

# 1. Amaç

Bu dokümanın amacı, “paketleri güncel tutalım” gibi yüzeysel yaklaşımı reddedip, **birlikte çalışması gereken sürümlerin resmi uyumluluk sözleşmesini** oluşturmaktır.

Bu belge şu sorulara net cevap verir:

1. Boilerplate’in canonical sürüm omurgası nedir?
2. Hangi major hatlar birlikte kullanılacaktır?
3. Exact patch pin ile strategic version track farkı nedir?
4. Hangi kombinasyonlar blocker sayılır?
5. Hangi upgrade önce, hangisi sonra yapılmalıdır?
6. Expo / React Native / React / Node / Vite / pnpm / Turbo zinciri nasıl birlikte değerlendirilmelidir?
7. Test, styling, state, data, i18n ve navigation kütüphanelerinde hangi major track kullanılacaktır?
8. Geçiş veya yükseltme sırasında hangi kırılma noktaları özellikle izlenmelidir?
9. “npm’de en son sürüm var” neden tek başına karar ölçütü değildir?
10. Hangi durumda compatibility matrix güncellenmeden upgrade yapılması yasaktır?

Bu belge package.json dosyasının yerini tutmaz.  
Bu belge, **hangi sürüm ailelerinin birlikte meşru olduğunu** tanımlar.

---

# 2. Neden Bu Doküman Gerekli

Compatibility matrix yazılmazsa şu bozulmalar çok hızlı başlar:

- web tarafı daha yeni, mobile tarafı daha eski bağımlılıklara kayar
- Expo ve React Native uyumu bozulur
- Vite ile Vitest sürümleri birbirinden kopar
- React major yükseltilir ama supporting toolchain hazır değildir
- Tailwind / NativeWind veya React Navigation / Expo eşleşmeleri sessiz kırılır
- CI bazı ortamlarda geçer, bazı ortamlarda kırılır
- package.json “güncel” görünür ama sistem birlikte kararlı çalışmaz
- contributor’lar hangi sürüm hattının proje standardı olduğunu bilmez
- upgrade maliyeti görünmez şekilde birikir

Bu proje documentation-first olduğu için versioning de documentation-first olmalıdır.  
Aksi halde canonical stack kararı yalnızca teorik kalır.

---

# 3. Temel Tez

Bu proje kapsamında temel tez şudur:

> Sürüm yönetimi, tekil dependency güncelliği problemi değildir; birlikte evrilen bir ekosistem dengeleme problemidir. Bu nedenle sürüm kararı “en yeni olanı al” refleksiyle değil, uyumluluk zinciri, runtime etkisi, test güvencesi, platform desteği ve upgrade maliyeti birlikte değerlendirilerek verilmelidir.

Bu tez şu sonuçları doğurur:

1. Latest her zaman doğru değildir.
2. Major değişiklikler bağımsız paket kararı değildir.
3. Expo, React Native ve React zinciri çekirdek omurgadır.
4. Node sürümü build-time detay değil, stack compatibility konusudur.
5. Exact patch pin package.json/lockfile’da yaşar; bu belgede esas olan compatible track’tir.
6. Upgrade sırası yönetilmeden yapılan sürüm sıçramaları reddedilir.

---

# 4. İki Katmanlı Model

Bu doküman iki ayrı ama bağlı katman içerir:

## 4.1. Strategic version track
Projede hangi **major/minor ailelerin** canonical kabul edildiğini tanımlar.

Örnek:
- React 19.2.x hattı
- Expo SDK 55.x hattı
- React Native 0.83.x hattı
- Vite 8.x stable baseline hattı
- Tailwind 4.x hattı

## 4.2. Exact project pin
Package.json ve lockfile içinde kullanılan kesin versiyonlardır.

Örnek:
- `react@19.2.4`
- `vite@7.1.x`
- `@tanstack/react-query@5.95.x`

Bu belge exact patch pin’i değil, **hangi exact pin’lerin meşru bant içinde olması gerektiğini** söyler.

---

# 5. Kullanım Kuralı

Bu matrix şu amaçla kullanılır:

1. yeni repo bootstrap sırasında
2. dependency upgrade öncesi
3. dependency PR review aşamasında
4. CI kırığı / peer mismatch tespitinde
5. major upgrade planlamasında
6. canonical stack güncellemesi gerektiğinde

Compatibility matrix güncellenmeden çekirdek sürüm hattı değiştirilemez.

---

# 6. Canonical Baseline — Çekirdek Omurga

Bu boilerplate için çekirdek omurga aşağıdaki sürüm hattı üzerinden kabul edilir:

- **Node.js:** 20.19.x LTS baseline
- **pnpm:** 10.x
- **Turborepo:** 2.x
- **TypeScript:** 5.9.x stable baseline
- **Web React:** 19.2.x
- **React DOM:** 19.2.x
- **Vite:** 8.x stable baseline
- **React Router:** 7.x
- **Mobile Runtime:** Expo SDK 55.x
- **React Native:** 0.83.x
- **React Native Web:** 0.21.x
- **Tailwind CSS:** 4.x
- **NativeWind:** 5.x candidate track (pre-release status doğrulanmadan production baseline sayılmaz)
- **Zustand:** 5.x
- **TanStack Query:** 5.x conditional track
- **React Hook Form:** 7.x
- **Zod:** 4.x
- **Vitest:** 4.x baseline track
- **Storybook:** 10.x
- **Jest:** 30.x
- **Playwright:** 1.58.x current baseline track
- **React Navigation:** 7.x stable baseline
- **i18next:** 26.x
- **react-i18next:** 17.x

Bu liste “sabit sonsuz doğru” değildir.  
Ama bu belge kabul edildiği sürece canonical compatibility hattıdır.

---

# 7. Neden Node.js 20.19.x Baseline?

## 7.1. Kural

Bu boilerplate’in default Node baseline’ı:
- **20.19.x**

## 7.2. Neden?

Çünkü çekirdek stack’in iki kritik ayağı bunu aynı anda karşılar:
- Expo SDK 55 reference track
- Vite 8 stable baseline track

## 7.3. Neden 22.x seçilmiyor?

Vite 8 Node 22.12+ hattını da destekler.  
Ama canonical baseline olarak 20.19.x seçmek:
- daha geniş ekosistem uyumu
- Expo ile doğal hizalanma
- daha kontrollü ekip standardı
sağlar.

## 7.4. Kural

Node 22.x ikinci destekli hat olabilir, ama repo baseline ve CI default standardı 20.19.x üzerinden kurulmalıdır.

---

# 8. Expo / React Native / React Zinciri

Bu zincir, matrix’in en kritik omurgasıdır.

## 8.1. Canonical eşleşme

- **Expo SDK 55.x**
- **React Native 0.83.x**
- **React 19.2.x**
- **React Native Web 0.21.x**

## 8.2. Neden kritik?

Bu alanlar birbiriyle doğrudan bağlıdır.  
Özellikle Expo projelerinde React Native major/minor hattı bağımsız karar değildir.

## 8.3. Kural

Expo SDK hattı değişmeden React Native hattı bağımsız sıçratılmaz.  
React hattı da Expo/React Native gerçekliğinden kopuk yükseltilmez.

## 8.4. New Architecture etkisi

Expo SDK 55+ hattında New Architecture kapatılamayan gerçekliktir.  
Bu nedenle React Native uyumluluğu yalnızca API değil, native ecosystem readiness açısından da değerlendirilmelidir.

---

# 9. Web Runtime Zinciri

## 9.1. Canonical eşleşme

- **React 19.2.x**
- **React DOM 19.2.x**
- **Vite 8.x stable baseline**
- **React Router 7.x**

## 9.2. Kural

React ve React DOM major/minor hattı birlikte hareket eder.  
Vite ve React Router yükseltmeleri bu omurgayı bozmadan yapılmalıdır.

## 9.3. Neden React Router 7.x?

Canonical web shell kararı React Router 7.x hattı üzerindedir.  
Daha eski major hatlara dönmek veya alternatif router eklemek baseline dışıdır.

---

# 10. Styling Zinciri

## 10.1. Canonical eşleşme

- **Tailwind CSS 4.x**
- **NativeWind 5.x candidate track**
- **Shared semantic token layer**

## 10.2. Neden kritik?

Tailwind major değişikliği ve NativeWind major değişikliği doğrudan:
- token consumption
- class support
- theming flow
- metro/babel/postcss integration
- web/mobile parity
alanlarını etkiler.

## 10.3. Kural

Tailwind major veya NativeWind major upgrade’i isolated dependency update değildir.  
ADR-007 ve repo styling pipeline ile birlikte değerlendirilir.

## 10.4. Browser target etkisi

Tailwind 4 modern browser baseline varsayar.  
Bu, web support matrix’i ile birlikte yorumlanmalıdır.

---

# 11. State / Data / Forms Zinciri

## 11.1. Canonical eşleşme

- **Zustand:** 5.x
- **TanStack Query:** 5.x conditional track
- **React Hook Form:** 7.x
- **Zod:** 4.x

## 11.2. Kritik not

Bu belgede exact current patch seviyeleri sürekli yazılmaz; çünkü bu kütüphaneler için asıl kritik şey major compatibility ve contract modelidir.  
Exact patch pin package.json + lockfile’da yaşar.

## 11.3. Kural

İkinci form engine, ikinci schema library veya ikinci query stack eklenemez.  
Sürüm yükseltmesi bu family’nin birlikte çalışma düzenini bozuyorsa ADR gerekebilir.

---

# 12. Testing Zinciri

## 12.1. Canonical eşleşme

- **Vitest:** 4.x baseline track
- **Storybook:** 10.x
- **Jest:** 30.x
- **Playwright:** 1.58.x baseline track
- **Testing Library family:** current stable matching runtime expectations

## 12.2. En kritik uyum

- Vite 8 → Vitest minimum support line dikkate alınmalı
- RN ecosystem → Jest track dikkatle korunmalı
- Playwright E2E toolchain CI image ve browser matrix ile birlikte düşünülmeli

## 12.3. Kural

Testing stack upgrade’i sadece test klasörünü etkilemez; CI, snapshots, mocks ve config surface’i de etkiler.

---

# 13. Navigation Zinciri

## 13.1. Web
- **React Router 7.x**

## 13.2. Mobile
- **React Navigation 7.x stable baseline**

## 13.3. Watchlist
- **React Navigation 8.x** şu aşamada izlenen ama canonical baseline’a alınmayan hattan sayılır

## 13.4. Neden 8.x değil?

8.x yönü teknik olarak geleceğe dönük görünse de stable baseline olarak kabul edilmez; ayrı değerlendirme ister.

## 13.5. Kural

React Navigation major yükseltmesi Expo / React / RN zinciri ve deep linking/static API etkisiyle birlikte ele alınmalıdır.

---

# 14. i18n Zinciri

## 14.1. Canonical eşleşme

- **i18next:** 26.x
- **react-i18next:** 17.x

## 14.2. Neden önemli?

i18n runtime major değişiklikleri:
- hook API’lerini
- namespace behavior’ını
- interpolation/formatting integration’ını
- SSR/web behavior’ını
etkileyebilir.

## 14.3. Kural

i18n runtime yükseltmeleri sıradan “dependency cleanup” değil, content runtime kararıdır.

---

# 15. Workspace / Tooling Zinciri

## 15.1. Canonical eşleşme

- **pnpm:** 10.x
- **Turborepo:** 2.x
- **TypeScript:** 5.9.x baseline
- **ESLint/typescript-eslint:** current stable compatible track pinned project-side

## 15.2. Neden TypeScript 5.9.x baseline?

Bu belge, TypeScript tarafında “en yeni npm sürümü” değil, **ekosistemce sakin ve geniş uyumlu stable baseline** yaklaşımını benimser.

## 15.3. Neden TS 6.x hemen baseline değil?

TypeScript 6 npm’de görünse de, canonical baseline olarak erken almak:
- ESLint tooling
- React/RN template expectations
- ecosystem plugin compatibility
alanlarında ek doğrulama gerektirir.

## 15.4. Kural

TS 6.x gibi major sıçramalar compatibility re-validation olmadan baseline’a alınmaz.

---

# 16. Baseline Matrix — Tablo

## 16.1. Çekirdek Matrix

| Alan | Canonical Track | Baseline Notu | Blocker/Uyarı |
|---|---|---|---|
| Node.js | 20.19.x | Repo ve CI default hattı | 20.19 altı baseline dışı |
| pnpm | 10.x | Workspace standardı | 9.x ve altı yeni repo için tercih edilmez |
| Turborepo | 2.x | Pipeline/orchestration hattı | Major değişim ADR etkisi yaratır |
| TypeScript | 5.9.x | Stable baseline | 6.x upgrade re-validation ister |
| React | 19.2.x | Web + Expo chain ile hizalı | Farklı minor hatlar kontrolsüz karıştırılmaz |
| React DOM | 19.2.x | React ile aynı hatta | React minor ile mismatch yasak |
| Vite | 8.x | Web build standardı | Node 20.19+/22.12+ ister |
| React Router | 7.x | Web navigation baseline | 6.x geriye dönüş baseline dışı |
| Expo SDK | 55.x | Mobile canonical shell | Expo major upgrade ayrı karar ister |
| React Native | 0.83.x | Expo 55 ile bağlı | Expo’dan bağımsız sıçratılmaz |
| React Native Web | 0.21.x | Expo track ile hizalı | Web parity etkisi düşünülmeli |
| Tailwind CSS | 4.x | Web styling baseline | 3.x geri dönüş canonical dışı |
| NativeWind | 5.x candidate track | Mobile styling için pre-release izleme hattı | GA olmadan bootstrap lock-in yasak; 4.x/5.x geçişi styling audit ister |
| Zustand | 5.x | State management canonical | İkinci state library eklenmez |
| TanStack Query | 5.x conditional track | Query/cache karmaşıklık eşiği aşılırsa canonical query layer | v4 hattı baseline dışı; her repo bootstrap'ında zorunlu değil |
| React Hook Form | 7.x | Forms baseline | Alternative engine eklenmez |
| Zod | 4.x | Schema baseline | v3 ile karışık kullanım yasak |
| Vitest | 4.x | Web-side fast tests | Vite uyumu korunmalı |
| Storybook | 10.x | Web component lab / docs / story-based browser testing | ESM-only; Vite builder ve Storybook Test/Vitest addon ile hizalanmalı |
| Jest | 30.x | RN-side tests | Web-side default runner değildir |
| Playwright | 1.58.x track | Web E2E baseline | CI/browser image uyumu korunmalı |
| React Navigation | 7.x stable | Mobile navigation baseline | 8.x watchlist, baseline değil |
| i18next | 26.x | i18n runtime baseline | Inline-string culture’ü çözmez |
| react-i18next | 17.x | React binding baseline | i18next hattı ile birlikte düşünülmeli |

### 16.1.1. React Native 0.84 Watch Notu

React Native 0.84 Mart 2026'da yayımlanmıştır. Bu sürüm Hermes V1'i varsayılan engine olarak getirir, React 19.2 ile tam entegrasyon sağlar ve TurboModules performans iyileştirmeleri içerir. Ancak bu boilerplate'in canonical baseline'ı Expo SDK 55.x + React Native 0.83.x hattıdır. RN 0.84 hattı SDK 56 ile birlikte değerlendirilecek aday konumundadır.

Bu sürümün getirdiği önemli değişiklikler:
- Hermes V1 artık varsayılan ve tek desteklenen JS engine'dir (önceki sürümlerde bazı edge case'lerde JSC fallback mümkündü, 0.84'te bu imkan kaldırılmıştır)
- React 19.2 entegrasyonu tamamlanmıştır (concurrent features, useTransition, useDeferredValue tam destekli)
- TurboModules lazy-loading performansı iyileştirilmiştir
- Fabric renderer'da view flattening optimizasyonları eklenmiştir
- setNativeProps ve findNodeHandle tamamen kaldırılmıştır

Canonical track'e alınma koşulları:
1. Expo SDK 56 veya sonrası bu RN hattını referans almalı
2. Mevcut dependency zincirinde kırılma olmamalı
3. Compatibility revalidation süreci tamamlanmalı
4. Bu belgenin çekirdek matrix tablosu güncellenmeli

## 16.2. Yardımcı Kütüphane Versiyon Takip Tablosu

Aşağıdaki tablo, çekirdek omurganın üzerine eklenen yardımcı kütüphanelerin canonical versiyon hatlarını tanımlar. Bu kütüphaneler çekirdek stack'in parçası olmasa da, uyumluluk zincirleri nedeniyle versiyon takibi gereklidir.

### Mobile Runtime Yardımcıları

| Kütüphane | Canonical Track | Baseline Notu | Upgrade Politikası |
|---|---|---|---|
| react-native-reanimated | 3.x | Expo SDK 55 bundled | Strategic — Expo zinciri |
| react-native-gesture-handler | 2.x | Expo SDK 55 bundled | Strategic — Expo zinciri |
| react-native-safe-area-context | (Expo bundled) | Expo SDK 55 bundled | Strategic — Expo zinciri |
| @gorhom/bottom-sheet | 5.x | Reanimated 3 + Gesture Handler 2 gerektirir | Strategic — reanimated zinciri |
| react-native-keyboard-controller | (latest stable) | Reanimated 3 gerektirir | Patch — bağımsız |
| react-native-svg | (Expo bundled) | Expo SDK 55 bundled | Strategic — Expo zinciri |

### Expo Modülleri

| Kütüphane | Canonical Track | Baseline Notu | Upgrade Politikası |
|---|---|---|---|
| expo-haptics | Expo SDK 55 bundled | Expo zinciri | Patch |
| expo-local-authentication | Expo SDK 55 bundled | Expo zinciri | Patch |
| expo-secure-store | Expo SDK 55 bundled | Expo zinciri | Patch |
| expo-notifications | Expo SDK 55 bundled | Expo zinciri | Strategic |
| expo-splash-screen | Expo SDK 55 bundled | Expo zinciri | Patch |
| expo-image | 2.x | Expo SDK 55 uyumlu | Strategic |
| expo-font | Expo SDK 55 bundled | Expo zinciri | Patch |
| expo-clipboard | Expo SDK 55 bundled | Expo zinciri | Patch |
| expo-camera | Expo SDK 55 bundled | Expo zinciri | Patch |
| expo-location | Expo SDK 55 bundled | Expo zinciri | Patch |
| expo-image-picker | Expo SDK 55 bundled | Expo zinciri | Patch |
| expo-file-system | Expo SDK 55 bundled | Expo zinciri | Patch |
| expo-constants | Expo SDK 55 bundled | Expo zinciri | Patch |
| expo-linking | Expo SDK 55 bundled | Expo zinciri | Patch |
| expo-updates | Expo SDK 55 bundled | Expo zinciri | Strategic |
| expo-status-bar | Expo SDK 55 bundled | Expo zinciri | Patch |

### Community Kütüphaneleri

| Kütüphane | Canonical Track | Baseline Notu | Upgrade Politikası |
|---|---|---|---|
| @react-native-async-storage/async-storage | (latest stable) | RN 0.83 uyumlu | Patch |
| @react-native-community/netinfo | (latest stable) | RN 0.83 uyumlu | Patch |

### Cross-Platform Kütüphaneleri

| Kütüphane | Canonical Track | Baseline Notu | Upgrade Politikası |
|---|---|---|---|
| lucide-react / lucide-react-native | (latest stable) | Bağımsız | Patch |
| date-fns | 4.x | Bağımsız | Patch |
| react-error-boundary | 5.x | React 19 uyumlu | Patch |
| sonner | 2.x | React 19 uyumlu, web-only | Patch |
| clsx | (latest stable) | Bağımsız | Patch |
| tailwind-merge | (latest stable) | Tailwind 4 uyumlu | Patch |

---

# 17. Special Notes — Expo ve Mobile İçin Kritik Uyumluluklar

## 17.1. Expo SDK 55 hattı neyi zorunlu kılar?

- React Native 0.83 hattı
- React 19.2 hattı
- New Architecture gerçekliği
- modern Node baseline

## 17.2. Sonuç

Expo major yükseltmesi:
- yalnızca `expo` paketini değiştirmek değildir
- RN
- React
- Expo modules
- native library compatibility
- EAS/build matrix
alanlarını birlikte etkiler

## 17.3. Kural

Expo major/minor hattı değiştirildiğinde şu alanlar yeniden doğrulanmalıdır:
- native dependencies
- config plugins
- new architecture readiness
- iOS/Android build sanity
- testing stack
- observability SDK compatibility

---

# 18. Special Notes — Vite ve Vitest Uyumluluğu

## 18.1. Kural

Vite major değişikliği Vitest ve plugin ekosisteminden bağımsız değildir.

## 18.2. Neden?

Vite:
- dev server
- build pipeline
- plugin behavior
- browser target
- testing integration
alanlarını etkiler.

## 18.3. Sonuç

Vite major upgrade yapılırsa:
- Vitest minimum support line
- Tailwind/Vite plugin uyumu
- React plugin uyumu
- CI Node version
yeniden doğrulanmalıdır.

---

# 19. Special Notes — Tailwind 4 ve NativeWind 5 Geçiş Hassasiyeti

## 19.1. Kural

Styling stack major değişimleri visual system migration sayılır.

## 19.2. Neleri etkiler?

- utility grammar
- arbitrary value behavior
- config format
- PostCSS/bundler integration
- NativeWind metro/babel setup
- theming and token consumption

## 19.3. Sonuç

Bu alandaki major değişiklikler:
- visual regression
- component audit
- DS contract review
gerektirir.

---

# 20. React Navigation Stable vs Watchlist Politikası

## 20.1. Stable baseline
- React Navigation 7.x

## 20.2. Watchlist track
- React Navigation 8.x

## 20.3. Neden iki ayrı kategori?

Çünkü bazı teknolojiler teknik olarak yakın gelecekte güçlü aday olabilir ama repo baseline’ına hemen alınması gerekmez.  
Bu, sürüm stratejisinde çok önemlidir.

## 20.4. Kural

Watchlist teknolojisi:
- denenebilir
- ayrı spike olarak incelenebilir
ama
- canonical baseline gibi davranılamaz

---

# 21. Exact Pin Politikası

## 21.1. Kural

Exact patch/minor pin package manifest ve lockfile’da tutulur.

## 21.2. Bu dokümanın rolü

Bu belge şunu der:
- hangi major/minor hatlar meşru
- hangi major/minor kombinasyonlar yasak
- upgrade hangi sırayla olur

## 21.3. Zayıf davranış

Compatibility matrix’i boş bırakıp tüm sürüm kararını package-lock/pnpm-lock’a gömmek.

Bu görünmez yönetimdir ve reddedilir.

---

# 22. Upgrade Sırası Politikası

## 22.1. Kural

Çekirdek stack’te upgrade rastgele sırayla yapılmaz.

## 22.2. Canonical upgrade sırası mantığı

### Mobile çekirdek upgrade
1. Node baseline kontrolü
2. Expo SDK hattı
3. React Native eşleşmesi
4. React eşleşmesi
5. native dependencies / config plugins
6. test/build/observability doğrulaması

### Web çekirdek upgrade
1. Node baseline kontrolü
2. Vite hattı
3. React / React DOM eşleşmesi
4. React Router / plugin stack
5. test/build doğrulaması

### Styling upgrade
1. Tailwind veya NativeWind hattı
2. token pipeline
3. component audit
4. visual verification

### Form/data/state upgrade
1. data/form/state core packages
2. feature integration tests
3. contract audit

## 22.3. Kural

Bir upgrade başka çekirdek dependency’yi fiilen zorunlu kılıyorsa, bu zincir birlikte ele alınmalıdır.

---

# 23. Blocker Kombinasyonlar

Aşağıdaki kombinasyonlar varsayılan olarak blocker veya çok yüksek risk sayılmalıdır:

1. Expo SDK 55.x ile React Native 0.83 dışı random hat
2. React 19.2 hattı ile React DOM farklı minör hat
3. Vite 8.x stable baseline ile Node 20.19 altı
4. Tailwind 4.x ile eski config alışkanlıklarını sürdürme
5. NativeWind 5.x candidate hattını eski mobile styling assumptions ile karıştırma
6. Zod 4.x ile eski schema helper ekosistemini doğrulamadan kullanma
7. Jest major değiştirip RN test config’ini audit etmemek
8. React Navigation 8.x’i stable kabul edip baseline’a sessizce almak
9. TypeScript 6.x’e geçip ESLint/test/build zincirini doğrulamamak
10. Query/form/state kütüphanelerinin eski major hatlarını yeni canonical stack ile karıştırmak

---

# 24. Warning Kombinasyonlar

Aşağıdaki kombinasyonlar blocker olmayabilir ama yüksek dikkat gerektirir:

- Node 22.x kullanımı
- React Navigation 8.x denemeleri
- Vitest major artışı
- Tailwind plugin ekosisteminde hızlı upgrade
- React minor/patch security backport geçişleri
- Expo pre-release / beta adoption
- TS baseline’dan daha yeni hat denemeleri

Bunlar “yasak” değildir; ama canonical default değildir.

---

# 25. Freeze ve Revalidation Politikası

## 25.1. Kural

Çekirdek stack upgrade’i sonrası kısa bir stabilizasyon dönemi tanımlanmalıdır.

## 25.2. Neden?

Çünkü sürüm artışı:
- immediate runtime success verse bile
- uzun tail bug’ları
- CI flakiness
- platform-specific regressions
- DX bozulmaları
üretebilir.

## 25.3. Sonuç

Major veya önemli minor geçişten sonra “compatibility revalidation” resmi süreçtir.

---

# 26. Compatibility Matrix Güncellenmeden Ne Yapılamaz?

Aşağıdaki eylemler compatibility matrix güncellenmeden yapılamaz:

1. Node baseline değiştirmek
2. Expo major/minor hattı değiştirmek
3. React major/minor hattı değiştirmek
4. Vite major hattı değiştirmek
5. Tailwind / NativeWind major hattı değiştirmek
6. TypeScript baseline hattını değiştirmek
7. React Navigation stable baseline’ı değiştirmek
8. i18n runtime major hattı değiştirmek
9. Jest/Vitest/Playwright çekirdek track’ini değiştirmek

---

# 27. Review Checklist

Bir sürüm güncellemesi veya yeni repo bootstrap incelenirken şu sorular sorulmalıdır:

1. Bu değişiklik canonical track içinde mi?
2. Exact pin uyumlu bantta mı?
3. Bunun tetiklediği zincir upgrade’ler var mı?
4. Peer dependency warning üretiyor mu?
5. CI Node ve local Node aynı baseline’da mı?
6. Expo/RN/React eşleşmesi korunuyor mu?
7. Vite/Vitest ve React Router eşleşmesi korunuyor mu?
8. Styling stack migration etkisi var mı?
9. Testing stack veya observability etkisi var mı?
10. Compatibility matrix güncellemesi gerekiyor muydu?

---

# 28. Anti-Pattern Listesi

Aşağıdaki davranışlar bu proje kapsamında zayıf kabul edilir:

1. `latest` görünce upgrade etmek
2. Expo sürümünü tek başına artırmak
3. React ve React DOM’u farklı minörlerde bırakmak
4. Vite upgrade edip Node baseline’ı unutarak kırık CI üretmek
5. React Navigation watchlist sürümünü stable baseline gibi kullanmak
6. TypeScript major artırıp tooling zincirini test etmemek
7. Tailwind/NativeWind major değişimini “sadece stil paketi” sanmak
8. exact pin’leri lockfile’a bırakıp belgeyi güncellememek
9. peer dependency warning’leri normalleştirmek
10. compatibility revalidation yapmadan release’e gitmek

---

# 29. Non-Goals

Bu belge aşağıdakileri çözmez:

- her package için exact final patch pin
- automatic upgrade bot davranışı
- CI image seçim detayları
- every plugin compatibility nuance
- per-package changelog özeti
- long-term support calendar for every dependency

Bunlar ilgili operasyonel belgelerde kapanacaktır.

---

# 30. Onay Kriterleri

Bu doküman yeterli kabul edilir eğer:

1. Çekirdek canonical stack’in sürüm bantları net tanımlanmışsa
2. Strategic track ile exact pin ayrımı yapılmışsa
3. Expo/RN/React ve Vite/Node zincirleri görünür kılınmışsa
4. Styling, forms, data, testing, i18n ve navigation sürüm hatları yazılmışsa
5. blocker ve warning kombinasyonlar listelenmişse
6. upgrade sırası ve compatibility revalidation mantığı görünürse
7. Bu belge repo bootstrap ve upgrade review sırasında gerçek karar aracı olarak kullanılabilecek netlikteyse

---

# 30.1. Ek Watch Notları (2026-04 güncellemesi)

- **React Compiler:** resmi stabil hatta geçmiş olsa da default-on baseline değildir; controlled opt-in hattı olarak değerlendirilir.
- **Biome 2.x:** formatter/import sorting/commodity lint için güçlü adaydır; ancak ESLint custom governance zincirini otomatik replace etmez, pilot/watchlist statüsündedir.
- **Expo development build:** mobile doğrulama için canonical zemindir; Expo Go compatibility kanıtı sayılmaz.
- **React Native DevTools:** RN debugging'de birincil yüzey olarak kabul edilir; legacy standalone araçlar ikincildir.
- **pnpm install security:** `minimumReleaseAge`, `allowBuilds` ve `trustPolicy: no-downgrade` workspace baseline'ı olarak kabul edilir; install-time güvenlik gevşetmeleri ADR/exception ister.
- **NativeWind 5.x:** candidate track statüsü sürüyorsa bootstrap anında fallback kararı yazılı olmalıdır.
- **React Native 0.84:** Mart 2026'da yayımlandı; Hermes V1 varsayılan, React 19.2 tam entegrasyon, TurboModules performans iyileştirmeleri içerir. SDK 56 ile birlikte canonical track adayıdır; SDK 55 baseline'ında doğrudan kullanılmaz.
- **@expo/ui (Expo UI):** SwiftUI ve Jetpack Compose ile doğrudan native UI bileşenleri yazabilmeyi sağlayan kütüphane. SDK 55'te beta, mid-2026'da stable 1.0 hedefliyor. Stable release'e kadar watchlist statüsünde; production baseline değildir.
- **Hermes Bytecode Diffing:** EAS Update ile entegre; OTA güncellemelerde yalnızca değişen bytecode gönderilir, bandwidth tasarrufu %60-95 (değişiklik boyutuna bağlı). ADR-015'te detaylı.
- **EAS Build Caching:** Şubat 2026'da duyurulan build caching, sonraki build'leri %20-30 hızlandırır. 15-quality-gates §48'de detaylı.
- **Expo Workflows:** EAS'in yeni CI/CD özelliği. Mevcut GitHub Actions CI ile birlikte veya alternatif olarak değerlendirilebilir; henüz canonical CI altyapısı olarak kabul edilmez. Stabilite ve feature parity sağlandığında yeniden değerlendirilecek.
- **React 19.2 API'leri:** `useOptimistic`, `useFormStatus`, `useActionState`, `React.use()`, `React.cache()` — bu boilerplate'te pozisyonları ADR-004 §40, ADR-005 §47, ADR-006 §45'te belgelenmiştir. SPA-first mimari nedeniyle Server Actions/Components non-goal; client-side API'ler koşullu kabul veya non-goal olarak sınıflandırılmıştır.

---

# 31. React Native 0.84 / Expo SDK 55 Güncel Uyumluluk Matrisi (2026-04-02 Eki)

Mart 2026 itibarıyla güncel uyumluluk bilgileri.

| Bileşen | Versiyon | Notlar |
|---------|---------|--------|
| React Native | 0.79+ (SDK 55 ile gelen) | New Architecture varsayılan, bridge opsiyonel ama deprecated |
| React | 19.1+ | Concurrent features aktif, use() hook mevcut |
| Hermes | V1 | Bytecode precompilation, incremental GC, %15-20 startup iyileştirmesi |
| Expo SDK | 55.x | New Architecture kapatılamaz, expo-dev-client canonical |
| TypeScript | 5.8+ | Strict mode zorunlu, satisfies operatörü, const type parameters |
| Metro | 0.82+ | Tree shaking desteği (beta), symlink desteği gelişmiş |
| Gradle | 8.x | Android build, AGP 8.x ile uyumlu |
| Xcode | 16+ | iOS build minimum, Swift 6 desteği |
| Node.js | 22.x LTS | Runtime, ESM native desteği |
| pnpm | 10.x | Package manager, workspace protocol, strict peer dependencies |

**Önemli notlar:**
- RN 0.84 Mart 2026'da yayımlandı ve SDK 56 ile birlikte canonical track adayıdır. SDK 55 baseline'ında RN 0.79+ kullanılır.
- Hermes V1, RN 0.84 ile varsayılan engine'dir. SDK 55'te Hermes güncel kararlı sürüm kullanılır.
- New Architecture SDK 55'te varsayılan açıktır ve kapatılamaz. Tüm native modüller TurboModule/Fabric uyumlu olmalıdır.

---

# 32. Otomatik Uyumluluk Doğrulama (2026-04-02 Eki)

`package.json` versiyonlarının compatibility matrix ile uyum kontrolü.

## 32.1. CI Scripti

Komut: `pnpm check:compat`

Bu script aşağıdaki kontrolleri yapar:

1. **Dependency versiyon kontrolü:** `package.json`'daki tüm dependency versiyonları bu matristeki aralıkta mı?
2. **peerDependency çakışma kontrolü:** Kurulu paketler arasında peerDependency uyumsuzluğu var mı?
3. **Node.js engine kontrolü:** `package.json` `engines.node` alanı matristeki Node.js versiyonuyla uyumlu mu?
4. **TypeScript versiyon kontrolü:** Yüklü TypeScript versiyonu strict mode, satisfies ve const type parameters destekliyor mu?
5. **Expo SDK versiyon kontrolü:** `expo` paket versiyonu canonical SDK aralığında mı?

## 32.2. Çıktı Formatı

Uyumsuzluk tespit edilirse detaylı hata mesajı ve önerilen versiyon gösterilir:

```
❌ Uyumluluk Hatası:
  react: 18.3.0 → Beklenen: >=19.1.0 (Matris: React 19.1+)
  typescript: 5.5.0 → Beklenen: >=5.8.0 (Matris: TypeScript 5.8+)

✅ Uyumlu:
  expo: 55.2.0 → Matris aralığında (55.x)
  react-native: 0.79.3 → Matris aralığında (0.79+)

💡 Önerilen düzeltme:
  pnpm add react@^19.1.0 typescript@^5.8.0
```

## 32.3. CI Entegrasyonu

- **Çalışma zamanı:** Her PR'da, lint ve typecheck adımlarıyla paralel.
- **Bloklama:** Uyumsuzluk tespit edilirse PR bloklanır.
- **Exception:** Geçiş sürecinde versiyon uyumsuzluğu kaçınılmazsa `44-exception-and-exemption-policy.md` ile exception açılır.
- **Matrix güncelleme:** Compatibility matrix güncellendiğinde CI scripti otomatik yeni aralıkları kullanır (matrix dosyası script tarafından parse edilir).

# 33. Kısa Sonuç

Bu dokümanın ana çıktısı şudur:

> Bu boilerplate’in canonical compatibility omurgası; Node 20.19.x, pnpm 10.x, Turbo 2.x, Expo SDK 55.x, React Native 0.83.x, React 19.2.x, Vite 8.x stable baseline, React Router 7.x, Tailwind 4.x, NativeWind 5.x candidate track, Zustand 5.x, **TanStack Query 5.x conditional track**, RHF 7.x, Zod 4.x, Jest 30.x, Vitest 4.x, Storybook 10.x, Playwright 1.58.x, React Navigation 7.x ve i18next 26.x hatları üzerine kuruludur. Exact patch pin’ler manifest/lockfile’da yaşar; bu belge ise hangi sürüm ailelerinin birlikte meşru olduğunu ve hangi upgrade’lerin resmi yeniden doğrulama gerektirdiğini tanımlar.
