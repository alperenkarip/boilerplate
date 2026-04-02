# 48-expo-sdk-upgrade-strategy.md

## Doküman Kimliği

- **Doküman adı:** Expo SDK Upgrade Strategy
- **Dosya adı:** `48-expo-sdk-upgrade-strategy.md`
- **Doküman türü:** Operational strategy / upgrade governance / migration guide
- **Durum:** Accepted
- **Tarih:** 2026-04-02
- **Kapsam:** Bu belge, Expo SDK major upgrade sürecinin nasıl planlanacağını, hangi ön değerlendirme adımlarının zorunlu olduğunu, upgrade uygulamasının hangi sırayla yapılacağını, expo-doctor aracının nasıl kullanılacağını, runtimeVersion ve OTA update ilişkisinin nasıl yönetileceğini, rollback senaryolarını, test matrisini, major ve minor upgrade farklarını, anti-pattern'leri ve upgrade checklist'ini tanımlar. Amaç, Expo SDK upgrade'ini "npm update expo" kadar basit bir işlem gibi görmekten çıkarıp, ekosistem zincirini bütünsel olarak yöneten, kontrollü, test edilmiş ve belgelenmiş bir operasyona dönüştürmektir.
- **Bağlı olduğu üst dokümanlar:**
  - `ADR-002-mobile-runtime-and-native-strategy.md`
  - `29-release-and-versioning-rules.md`
  - `36-canonical-stack-decision.md`
  - `37-dependency-policy.md`
  - `38-version-compatibility-matrix.md`
- **Doğrudan etkileyeceği dokümanlar:**
  - `19-roadmap-to-implementation.md`
  - `20-initial-implementation-checklist.md`
  - `15-quality-gates-and-ci-rules.md`
  - `38-version-compatibility-matrix.md`

---

# 1. Amaç

Bu dokümanın amacı, Expo SDK major upgrade'ini:

- changelog okundu, expo install yapıldı, çalışıyor gibi görünüyor, merge edelim
- "sadece bir versiyon yükseldik, ne olacak ki"
- expo-doctor yeşil gösteriyor, sorun yok
- iOS çalıştı, Android da çalışır herhalde

gibi yüzeysel yaklaşımlardan çıkarıp; **ekosistem zinciri analizi, dependency uyumluluk denetimi, platform-bazlı test matrisi, runtimeVersion yönetimi, OTA uyumluluk kontrolü, EAS Build doğrulaması ve rollback hazırlığı** ile yönetilen resmi operasyonel sürece dönüştürmektir.

Bu belge şu sorulara net cevap verir:

1. Expo SDK major upgrade neden ayrı bir strateji belgesi gerektirir?
2. Upgrade öncesinde hangi ön değerlendirme adımları zorunludur?
3. Dependency uyumluluğu nasıl denetlenir?
4. Test matrisi nasıl oluşturulur ve hangi platformlar hangi derinlikte test edilir?
5. Upgrade hangi sırayla, hangi komutlarla uygulanır?
6. React Native ve React eşleşmesi nasıl doğrulanır?
7. Config plugin güncellemeleri nasıl yönetilir?
8. EAS Build doğrulaması neden merge öncesi zorunludur?
9. runtimeVersion nedir, SDK upgrade onu nasıl etkiler, eski kullanıcılar ne olur?
10. OTA update uyumluluğu nasıl korunur?
11. expo-doctor ne yapar, çıktısı nasıl okunur, hangi uyarılar blocker sayılır?
12. Upgrade başarısız olursa rollback nasıl yapılır?
13. Major ve minor SDK upgrade arasındaki fark nedir?
14. Hangi davranışlar anti-pattern sayılır?
15. Upgrade ne sıklıkla ve hangi zamanlarda yapılmalıdır?

Bu belge paket güncelleme rehberi değildir.
Bu belge, **Expo SDK upgrade'inin operasyonel anayasasıdır**.

---

# 2. Neden Bu Doküman Gerekli

Expo SDK upgrade'i "tek paket güncelleme" işlemi değildir. Expo SDK, mobil uygulamanın temelini oluşturan bir ekosistem zinciridir. Bir SDK major upgrade şu zincirleme etkileri tetikler:

### 2.1. Ekosistem Zinciri Gerçeği

Expo SDK major upgrade yapıldığında, yalnızca `expo` paketi değişmez. Aşağıdaki bileşenler doğrudan veya dolaylı olarak etkilenir:

1. **React Native sürümü:** Expo SDK her major versiyonda belirli bir React Native hattını referans alır. SDK 55, RN 0.83.x ile çalışır. SDK 56 farklı bir RN hattı gerektirebilir. RN hattı değişirse Hermes engine, JSI bridge, TurboModules ve Fabric renderer davranışları da değişir.

2. **React sürümü:** React Native belirli bir React major/minor hattına bağlıdır. RN hattı değişirse React hattı da etkilenir. React 19.x concurrent features, Suspense davranışı ve hook semantikleri sürümler arası farklılık gösterebilir.

3. **Hermes engine:** Expo SDK upgrade ile gelen yeni RN hattı, yeni Hermes sürümü getirebilir. Hermes V1 ile önceki sürümler arasında garbage collection, bundle format ve debug protocol farkları vardır.

4. **Native modüller:** Expo bundled modüller (expo-camera, expo-location, expo-notifications vb.) SDK ile otomatik güncellenir. Ancak community native modüller (react-native-reanimated, react-native-gesture-handler, react-native-svg vb.) bağımsız sürüm takvimine sahiptir ve yeni SDK ile uyumsuz olabilir.

5. **Config plugin'ler:** Expo config plugin API'si sürümler arası değişebilir. Custom config plugin'ler veya üçüncü parti plugin'ler yeni SDK ile kırılabilir.

6. **EAS Build:** EAS Build infrastructure yeni SDK sürümünü desteklemesi gerekir. Build image'ları, CocoaPods cache, Gradle cache ve native toolchain sürümleri etkilenir.

7. **OTA update (EAS Update):** SDK major upgrade genellikle runtimeVersion değişikliği gerektirir. runtimeVersion değişirse mevcut kullanıcılara OTA update gönderilemez; store submission zorunlu hale gelir.

8. **Testing stack:** Jest, Testing Library ve Expo test runner konfigürasyonları yeni SDK ile uyumlu olmayabilir. Babel/Metro konfigürasyonları değişebilir.

### 2.2. Kontrolsüz Upgrade Riskleri

Expo SDK upgrade'i strateji belgesi olmadan yapılırsa şu bozulmalar hızla başlar:

- production'da native crash'ler oluşur çünkü community native paketler test edilmemiştir
- OTA update uyumsuzluğu nedeniyle eski kullanıcılar güncelleme alamaz, yeni kullanıcılar farklı davranış görür
- EAS Build başarısız olur çünkü native toolchain uyumsuzlukları önceden tespit edilmemiştir
- runtimeVersion yönetimi atlanır, mevcut kullanıcı tabanıyla uyumluluk bozulur
- iOS ve Android'den yalnızca biri test edilir, diğeri production'da kırılır
- config plugin kırılmaları dev ortamında fark edilmez, CI'da veya release build'de ortaya çıkar
- React/RN eşleşmesi bozulur, concurrent rendering sorunları geç fark edilir
- bundle boyutu kontrolsüz büyür, cold start süresi artar
- rollback planı olmadan merge edilir, production'da sorun çıkınca geri dönüş maliyeti çok yükselir

Bu proje documentation-first olduğu için SDK upgrade kararı ve süreci de belgelenmiş ve denetlenebilir olmak zorundadır. 37-dependency-policy ve 38-version-compatibility-matrix bu gereksinimi destekler ama SDK upgrade'in operasyonel adımlarını tanımlamaz. Bu belge o boşluğu kapatır.

---

# 3. Temel Tez

Bu proje kapsamında temel tez şudur:

> Expo SDK major upgrade, tekil paket güncelleme operasyonu değildir; React Native, React, Hermes, native modüller, config plugin'ler, EAS Build, OTA update, testing stack ve runtimeVersion'ı kapsayan ekosistem zinciri geçişidir. Bu nedenle SDK upgrade, changelog okuma ve `expo install` çalıştırma refleksiyle değil, ön değerlendirme, uyumluluk denetimi, izole branch çalışması, platform-bazlı test matrisi, EAS Build doğrulaması, OTA uyumluluk kontrolü ve rollback hazırlığı ile yönetilen kontrollü operasyon olarak ele alınmalıdır.

Bu tez şu sonuçları doğurur:

1. SDK upgrade PR'ı izole branch'te hazırlanır, trunk'a doğrudan push edilmez.
2. expo-doctor temiz geçmeden merge yapılmaz.
3. Hem iOS hem Android'de development build ve EAS Build başarılı olmadan merge yapılmaz.
4. runtimeVersion etkisi değerlendirilmeden ve OTA migration stratejisi belirlenmeden release yapılmaz.
5. 38-version-compatibility-matrix güncellenmeden upgrade tamamlanmış sayılmaz.
6. Tek platform test edip diğerini atlamak kabul edilmez.
7. Community native paketlerin uyumluluğu tek tek doğrulanmadan merge yapılmaz.
8. Rollback planı olmadan production deployment yapılmaz.

---

# 4. Upgrade Planlama Süreci (Adım Adım)

## 4.1. Pre-Assessment (Ön Değerlendirme)

SDK upgrade planlaması, yeni SDK sürümü Expo tarafından duyurulduktan sonra başlar. Bu aşamada henüz hiçbir kod değişikliği yapılmaz; amaç upgrade'in kapsamını, risklerini ve gereksinimlerini anlamaktır.

### 4.1.1. Changelog Analizi

Yeni SDK'nın resmi changelog'u satır satır okunur. Özellikle şu bölümler dikkatle incelenir:

- **Breaking changes:** Hangi API'lar kaldırıldı, hangileri davranış değiştirdi, hangi konfigürasyon anahtarları değişti. Her breaking change için projede etkilenen dosyalar tespit edilir.
- **Deprecation'lar:** Hangi API'lar deprecated olarak işaretlendi. Bunlar hemen kırılmaz ama gelecek sürümde kalkacaktır; migration planı yapılmalıdır.
- **Yeni özellikler:** Yeni API'lar veya davranışlar projeye fayda sağlayabilir mi. Hemen kullanılmasa bile farkındalık oluşturulur.
- **React Native sürüm değişikliği:** Yeni SDK hangi RN hattını getiriyor. RN changelog'u da ayrıca okunur.
- **React sürüm değişikliği:** RN ile gelen React hattı mevcut projeden farklı mı. React changelog'u da okunur.
- **Hermes değişiklikleri:** Yeni Hermes sürümü var mı, GC davranışı değişti mi, bundle format değişti mi.
- **New Architecture (Fabric / TurboModules) değişiklikleri:** Zorunlu geçiş var mı, varsayılan davranış değişti mi, opt-out kaldırıldı mı.

**Çıktı:** Breaking changes listesi, etkilenen dosya/modül listesi ve risk değerlendirmesi.

### 4.1.2. Etkilenen Paketlerin Tespiti

Proje package.json dosyasındaki her dependency yeni SDK ile karşılaştırılır:

1. **Expo bundled modüller:** `expo-camera`, `expo-location`, `expo-notifications`, `expo-secure-store` vb. — bunlar SDK ile otomatik güncellenir ama API değişikliği içerebilir.
2. **React Native community paketler:** `react-native-reanimated`, `react-native-gesture-handler`, `react-native-safe-area-context`, `react-native-screens`, `react-native-svg` — bunların yeni SDK ile uyumlu sürümleri ayrıca kontrol edilir.
3. **Navigation:** `@react-navigation/*` paketlerinin yeni RN hattıyla uyumu.
4. **Styling:** `nativewind` / `tailwindcss` uyumu.
5. **State/data:** Zustand, TanStack Query — genellikle native bağımlılıkları yoktur ama React hook değişiklikleri etkileyebilir.
6. **Testing:** Jest, Testing Library, Expo test utilities.
7. **Build tooling:** Metro bundler, Babel preset, TypeScript.

**Çıktı:** Paket bazında uyumluluk durumu tablosu (uyumlu / güncelleme gerekli / uyumsuz / belirsiz).

### 4.1.3. New Architecture Değerlendirmesi

Expo SDK 55+ hattında New Architecture (Fabric renderer + TurboModules) varsayılan olarak etkindir. Her yeni SDK bu alandaki değişiklikleri derinleştirebilir:

- Yeni SDK'da New Architecture varsayılan davranışı değişti mi?
- Fabric-uyumsuz community paketler var mı?
- TurboModules geçişi gerektiren API değişikliği var mı?
- Bridge compatibility layer kaldırıldı mı veya daraltıldı mı?

**Çıktı:** New Architecture etki raporu.

## 4.2. Dependency Compatibility Audit

Ön değerlendirme tamamlandıktan sonra, dependency uyumluluğu sistematik olarak denetlenir.

### 4.2.1. expo-doctor ile Otomatik Denetim

`expo-doctor`, Expo projesinin sağlık durumunu kontrol eden resmi CLI aracıdır. Dependency sürüm uyumluluğu, konfigürasyon tutarlılığı ve peer dependency sorunlarını tespit eder.

```bash
npx expo-doctor
```

Bu komut şu kontrolleri yapar:

- **Dependency version kontrolü:** Yüklü paketlerin Expo SDK ile uyumlu sürümlerini kontrol eder. Uyumsuz sürümler varsa hangi sürüme güncellenmesi gerektiğini bildirir.
- **Peer dependency audit:** Paketler arası peer dependency çakışmalarını tespit eder.
- **Config doğrulama:** `app.json` / `app.config.js` içindeki konfigürasyon anahtarlarının geçerliliğini kontrol eder. Kaldırılmış veya değişmiş anahtarları bildirir.
- **Native module uyumluluğu:** Native modüllerin yeni SDK ile uyumluluk durumunu kontrol eder.

**Çıktı formatı:** expo-doctor her kontrolü satır satır listeler. Her satır şu formatlardan birinde olabilir:

- `✓` (yeşil tik): Kontrol başarılı, sorun yok.
- `✗` (kırmızı çarpı): Kontrol başarısız, düzeltme gerekli. Bu bir blocker'dır; düzeltmeden devam edilmez.
- `⚠` (sarı uyarı): Potansiyel sorun tespit edildi. Warning seviyesindedir; değerlendirilmeli ama her zaman blocker değildir.

**Blocker olan uyarılar:**
- Expo SDK ile uyumsuz native modül sürümü
- React Native / React major hat uyumsuzluğu
- Kaldırılmış config plugin referansı
- Peer dependency çakışması (birden fazla major hat)

**Warning seviyesinde olan uyarılar:**
- Deprecated API kullanımı (hemen kırılmaz ama migration planlanmalı)
- Önerilen sürümden farklı ama uyumlu alt sürüm
- Opsiyonel konfigürasyon eksikliği

### 4.2.2. Manuel Paket Uyumluluk Kontrolü

expo-doctor tüm paketleri kapsamayabilir. Özellikle community native paketler için manuel kontrol gerekir:

1. **Paket repository'sini kontrol et:** GitHub issues ve pull request'lerinde yeni SDK sürümü ile ilgili bildirimleri ara. "SDK XX" veya "Expo XX" anahtar kelimelerini kullan.
2. **reactnativepackagedb.com kullan:** Bu veritabanı React Native paketlerinin SDK uyumluluğunu takip eder.
3. **Paketin son release tarihini kontrol et:** 6 aydan eski release varsa ve yeni SDK desteği yoksa, paket abandoned olabilir.
4. **New Architecture uyumluluğunu kontrol et:** Paketin Fabric ve TurboModules desteği var mı.

**Uyumsuz paket bulunursa:**
- Alternatif paket araştır (37-dependency-policy kriterlerine uygun)
- Fork değerlendir (maintenance riski yüksektir; son çare olmalı)
- Paket bakıcısına issue aç / PR gönder
- Uyumsuz paket kritik ise SDK upgrade'i ertele — SDK upgrade paket uyumsuzluğuna rağmen zorlanmaz

### 4.2.3. 38-version-compatibility-matrix ile Karşılaştırma

Yeni SDK'nın getirdiği sürüm hatları 38-version-compatibility-matrix'teki mevcut baseline ile karşılaştırılır:

- React hattı değişiyor mu?
- React Native hattı değişiyor mu?
- Hermes sürümü değişiyor mu?
- Node.js minimum sürümü değişiyor mu?
- Bundled modül sürümleri değişiyor mu?

Bu karşılaştırma upgrade'in "normal güncelleme" mi yoksa "ekosistem zinciri geçişi" mi olduğunu belirler.

## 4.3. Test Matrisi Oluşturma

SDK upgrade'i yalnızca "çalışıyor" seviyesinde değil, **platform-bazlı, cihaz-bazlı ve build-tipi-bazlı** olarak test edilir.

### 4.3.1. Platform ve Cihaz Matrisi

| Platform | Ortam | Minimum Gereksinim |
|----------|-------|---------------------|
| iOS | Simulator | En az 2 farklı iOS sürümü (örn. iOS 17, iOS 18) |
| iOS | Fiziksel cihaz | En az 1 fiziksel iPhone |
| Android | Emulator | En az 2 farklı Android sürümü (örn. Android 13, Android 14) |
| Android | Fiziksel cihaz | En az 1 fiziksel Android cihaz |

### 4.3.2. Build Tipi Matrisi

| Build Tipi | Açıklama | Zorunluluk |
|------------|----------|------------|
| Development build | Expo dev client ile lokal geliştirme build'i | Zorunlu — ilk test adımı |
| EAS Build (development) | EAS infrastructure üzerinde development profile build | Zorunlu — CI/cloud ortamı doğrulaması |
| EAS Build (preview) | Internal distribution build | Zorunlu — staging testi için |
| EAS Build (production) | Store-ready build | Zorunlu — release öncesi son doğrulama |

### 4.3.3. Fonksiyonel Test Kapsamı

- Uygulama açılışı (cold start): Crash olmadan açılıyor mu
- Navigation akışı: Tüm ekran geçişleri çalışıyor mu
- Native modül fonksiyonları: Kamera, konum, bildirim, biyometrik auth
- Animasyonlar: Reanimated ve gesture handler sorunsuz çalışıyor mu
- Network istekleri: API çağrıları normal davranıyor mu
- Deep linking: Universal link ve app link'ler çalışıyor mu
- Push notification: Token alma ve bildirim gösterimi
- Secure storage: Veri okuma/yazma
- Performance: Cold start süresi baseline'dan sapıyor mu

### 4.3.4. OTA Update Test Kapsamı

- Eski runtimeVersion ile yeni SDK'nın birlikte davranışı
- Yeni runtimeVersion ile update gönderimi
- Channel-based deployment testi
- Rollback testi (EAS Update üzerinden)

## 4.4. Branch Stratejisi

SDK upgrade çalışması trunk'tan izole bir branch'te yapılır:

```bash
git checkout -b chore/sdk-XX-upgrade
```

Bu branch'te kurallar:

1. **Küçük adımlarla ilerle:** Her değişikliği ayrı commit olarak kaydet. "Expo SDK güncellendi", "Community paketler güncellendi", "Config plugin'ler düzeltildi" gibi atomik commit'ler at.
2. **Her adımda test et:** Bir grup değişiklik yaptıktan sonra development build çalıştır, crash olmadığını doğrula.
3. **Trunk ile senkron tut:** Uzun süren upgrade'lerde trunk'tan düzenli rebase yap (merge commit yerine rebase tercih et).
4. **Merge koşulu:** Tüm test matrisi geçmeden, expo-doctor temiz geçmeden ve EAS Build başarılı olmadan merge yapılmaz.

---

# 5. Upgrade Uygulama Adımları (Detaylı)

## 5.1. Expo CLI ile Upgrade

Upgrade işlemi Expo'nun resmi CLI komutu ile başlar:

```bash
npx expo install expo@latest --fix
```

Bu komutun yaptıkları:

1. **`expo` paketini belirtilen sürüme günceller.** `@latest` kullanıldığında en son kararlı major sürümü alır. Belirli bir sürüm hedefleniyorsa `expo@^56.0.0` gibi belirtilebilir.

2. **`--fix` flag'i peer dependency'leri otomatik düzeltir.** Expo SDK'nın beklediği React Native, React ve diğer çekirdek paket sürümlerini otomatik olarak günceller. Bu flag kullanılmazsa yalnızca `expo` paketi güncellenir ve peer dependency uyumsuzlukları oluşur.

3. **Güncellenen dosyalar:**
   - `package.json`: Expo ve bağımlı paketlerin sürüm numaraları değişir
   - `pnpm-lock.yaml`: Lockfile yeniden oluşturulur
   - `node_modules/`: Paketler yeniden indirilir

4. **Otomatik olarak değişmeyen ama manuel kontrol gerektiren dosyalar:**
   - `app.json` / `app.config.js`: SDK sürüm referansı, config plugin listesi
   - `eas.json`: Build profile konfigürasyonları
   - `tsconfig.json`: TypeScript konfigürasyonu (nadiren)
   - `babel.config.js` / `metro.config.js`: Bundler konfigürasyonu

Expo CLI upgrade sonrasında hemen şu komut çalıştırılır:

```bash
npx expo-doctor
```

expo-doctor çıktısı temiz değilse, uyarılar tek tek ele alınır. Tüm `✗` (kırmızı) uyarılar çözülmeden bir sonraki adıma geçilmez.

## 5.2. React Native ve React Eşleşmesi

Expo SDK her major sürümde belirli bir React Native ve React hattını zorunlu kılar. Bu eşleşme bozulursa runtime hataları kaçınılmazdır.

**Doğrulama adımları:**

1. Expo SDK'nın release notes'unda belirtilen RN ve React sürümlerini kontrol et.
2. `package.json`'daki gerçek sürümlerin beklenen hatla eşleştiğini doğrula.
3. `38-version-compatibility-matrix.md`'deki baseline ile karşılaştır.

**Eşleşme bozulursa:**

- `npx expo install --fix` komutu genellikle eşleşmeyi otomatik düzeltir. Düzeltmezse:
- İlgili paketleri Expo'nun beklediği sürüme manuel olarak güncelle:

```bash
npx expo install react@<beklenen-sürüm> react-native@<beklenen-sürüm>
```

- Eşleşme sağlandıktan sonra `npx expo-doctor` ile tekrar doğrula.

**Dikkat:** React major sürüm değişikliği (örn. 19.x → 20.x) çok daha geniş kapsamlıdır. Concurrent rendering davranışı, hook semantikleri, Suspense boundary'leri ve error boundary davranışları değişebilir. Bu durumda SDK upgrade PR'ı genişletilir ve React migration rehberi ayrıca takip edilir.

## 5.3. Config Plugin Güncellemeleri

Expo config plugin'leri, managed workflow'da native proje konfigürasyonunu yöneten mekanizmadır. SDK major upgrade'lerde config plugin API'si değişebilir.

### 5.3.1. app.json / app.config.js Kontrolü

1. **Kaldırılmış anahtarları kontrol et:** Yeni SDK'nın changelog'unda deprecated/removed config anahtarları var mı.
2. **Yeni zorunlu anahtarları ekle:** Yeni SDK'nın gerektirdiği konfigürasyon anahtarları eksik olabilir.
3. **Plugin listesini güncelle:** `plugins` dizisindeki her plugin'in yeni SDK ile uyumlu sürümünü doğrula.

### 5.3.2. Custom Config Plugin'ler

Proje custom config plugin kullanıyorsa:
- Plugin'in kullandığı Expo config plugin API'larının yeni SDK'da mevcut olduğunu doğrula.
- `withAndroidManifest`, `withInfoPlist`, `withAppBuildGradle` gibi mod'ların imzaları değişmiş olabilir.
- Yeni SDK ile `npx expo prebuild --clean` çalıştırarak native projeyi yeniden oluştur ve plugin çıktısını doğrula.

### 5.3.3. Expo Prebuild ile Native Proje Yeniden Oluşturma

```bash
npx expo prebuild --clean
```

Bu komut:
- `ios/` ve `android/` dizinlerini sıfırdan oluşturur (continuous native generation)
- Tüm config plugin'leri yeniden uygular
- Yeni SDK'nın native template'ini kullanır

Prebuild sonrası:
- `ios/Podfile` içindeki dependency'lerin doğru sürümlerde olduğunu kontrol et
- `android/build.gradle` ve `android/app/build.gradle` içindeki SDK sürümlerini kontrol et
- iOS için CocoaPods install çalıştır:

```bash
cd ios && pod install && cd ..
```

- Android için Gradle sync çalıştır (genellikle IDE üzerinden veya build sırasında otomatik)

## 5.4. Native Dependency Güncellemeleri

### 5.4.1. Expo Bundled Modüller

`expo-camera`, `expo-location`, `expo-notifications`, `expo-secure-store`, `expo-haptics`, `expo-image`, `expo-font`, `expo-clipboard`, `expo-file-system`, `expo-constants`, `expo-linking` ve diğer Expo bundled modüller SDK upgrade sırasında otomatik olarak uyumlu sürümlerine güncellenir.

Ancak API değişiklikleri olabilir:
- Kaldırılmış veya yeniden adlandırılmış API'ları changelog'dan kontrol et
- TypeScript type hatalarını derleyici çıktısından tespit et
- Her modülün temel fonksiyonunu test et

### 5.4.2. Community Native Paketler

Bu paketler Expo SDK'dan bağımsız release döngüsüne sahiptir ve otomatik güncellenmez:

```bash
npx expo install react-native-reanimated react-native-gesture-handler react-native-screens react-native-safe-area-context react-native-svg --fix
```

`npx expo install <paket> --fix` komutu, paketin Expo SDK ile uyumlu sürümünü tespit edip günceller. Bu komut `npm install` veya `pnpm add` yerine kullanılmalıdır çünkü Expo'nun uyumluluk veritabanını referans alır.

Her community paketi güncellendikten sonra:
1. `npx expo-doctor` çalıştır — yeni uyumsuzluk oluşmadığından emin ol
2. İlgili fonksiyonelliği test et (animasyon, gesture, ekran geçişi vb.)

### 5.4.3. Navigation Paketleri

`@react-navigation/native`, `@react-navigation/stack`, `@react-navigation/bottom-tabs` ve diğer navigation paketleri yeni RN hattıyla uyumlu olmalıdır. Özellikle:
- Static API değişiklikleri
- Screen options imza değişiklikleri
- Native stack renderer değişiklikleri (react-native-screens bağımlılığı)

## 5.5. EAS Build Doğrulama

**EAS Build doğrulaması, upgrade PR'ının merge koşuludur.** Development build'in lokalde çalışması yeterli değildir; EAS infrastructure üzerinde tam build başarılı olmalıdır.

### 5.5.1. Development Build

```bash
eas build --platform all --profile development
```

Bu komut hem iOS hem Android için development profile build'i başlatır. Build sırasında:
- Native dependency'ler derlenir
- CocoaPods resolve edilir (iOS)
- Gradle dependency'ler resolve edilir (Android)
- Native linking doğrulanır

### 5.5.2. Build Log Analizi

Build başarılı olsa bile log'lar dikkatle okunur:
- **Deprecation warning'leri:** Gelecek sürümde kırılacak API kullanımları
- **Native linking uyarıları:** Duplicate symbol, missing framework
- **CocoaPods uyarıları:** Minimum deployment target, deprecated pod
- **Gradle uyarıları:** API/implementation scope, deprecated method

### 5.5.3. Build Başarısız Olursa

1. Build log'undaki hata mesajını oku — genellikle native compilation error, missing dependency veya config uyumsuzluğudur.
2. Hata mesajına göre ilgili paket veya konfigürasyonu düzelt.
3. Cache temizleyerek tekrar dene:

```bash
eas build --platform all --profile development --clear-cache
```

4. **Build başarılı olana kadar commit yapılmaz.** Kırık build ile trunk'a merge etmek yasaktır.

## 5.6. OTA Update Uyumluluğu

OTA update uyumluluğu, SDK upgrade'in en kritik ve en çok atlanan adımıdır. Bu adım atlanırsa mevcut kullanıcı tabanı ile yeni sürüm arasında kopukluk oluşur.

### 5.6.1. runtimeVersion Kontrolü

ADR-015 kapsamında tanımlanan `runtimeVersion` politikası, SDK upgrade sırasında özel önem kazanır.

**runtimeVersion nedir:**
`runtimeVersion`, EAS Update'in bir OTA güncellemeyi hangi native binary'ye teslim edeceğini belirleyen eşleştirme anahtarıdır. Uygulamanın native kodu (Expo SDK sürümü, native modüller, config plugin çıktıları) değiştiğinde runtimeVersion da değişmelidir. JS bundle güncellemesi yalnızca eşleşen runtimeVersion'a sahip binary'lere gönderilir.

**SDK upgrade runtimeVersion'ı ne zaman değiştirir:**
Expo SDK major upgrade her zaman native binary'yi değiştirir. Bu nedenle runtimeVersion da değişmelidir. runtimeVersion değişmeden SDK upgrade yapılırsa, yeni JS bundle eski native binary'ye OTA olarak gönderilir ve crash oluşur.

**Konfigürasyon:**

`app.json` veya `app.config.js` içinde runtimeVersion politikası tanımlanır:

```json
{
  "expo": {
    "runtimeVersion": {
      "policy": "appVersion"
    }
  }
}
```

veya fingerprint tabanlı:

```json
{
  "expo": {
    "runtimeVersion": {
      "policy": "fingerprint"
    }
  }
}
```

- `appVersion` politikası: `app.json`'daki `version` alanı değiştiğinde runtimeVersion değişir. SDK upgrade yapılırken app version da artırılmalıdır.
- `fingerprint` politikası: Expo native proje fingerprint'i otomatik hesaplar. Native dependency değiştiğinde runtimeVersion otomatik değişir. Bu politika SDK upgrade senaryosu için daha güvenlidir çünkü native değişiklikleri otomatik tespit eder.

### 5.6.2. Eski Kullanıcılar İçin Migration Path

runtimeVersion değiştiğinde, eski binary'ye sahip kullanıcılar artık OTA update alamaz. Bu kullanıcılar için:

1. **Store update zorunluluğu:** Kullanıcı yeni native binary'yi store'dan indirmelidir.
2. **Forced update stratejisi:** Uygulamada minimum sürüm kontrolü yapılır. Eski sürüm kullanıcısına "Güncelleme gerekli" mesajı gösterilir ve store'a yönlendirilir.
3. **Grace period:** Eski runtimeVersion'a sahip kullanıcılar için eski update channel'da son bir stability update gönderilebilir (kritik bug fix'ler için).
4. **Analytics:** Eski sürüm kullanıcı sayısı izlenir. Yeterince düştüğünde eski channel kapatılır.

### 5.6.3. Channel Stratejisi

EAS Update channel'ları SDK upgrade sırasında dikkatle yönetilir:

- **Production channel:** Mevcut kullanıcılara yalnızca uyumlu runtimeVersion ile güncelleme gönderilir
- **Staging channel:** Yeni SDK ile staging build'ine güncelleme gönderilerek OTA davranışı test edilir
- **Preview channel:** PR bazlı test için kullanılır

### 5.6.4. OTA Update Test Senaryoları

1. Eski binary (eski SDK) ile eski runtimeVersion'a OTA update gönder — çalışmalı
2. Yeni binary (yeni SDK) ile yeni runtimeVersion'a OTA update gönder — çalışmalı
3. Yeni JS bundle'ı eski runtimeVersion'a OTA olarak göndermeye çalış — reddedilmeli (bu senaryo gerçekleşmemeli; gerçekleşiyorsa runtimeVersion konfigürasyonu hatalıdır)

---

# 6. expo-doctor Detaylı Kullanım Rehberi

## 6.1. Ne Yapar

`expo-doctor` Expo projesinin genel sağlık durumunu denetleyen tanılama aracıdır. Şu kontrolleri yapar:

1. **Dependency version kontrolü:** Yüklü paketlerin Expo SDK ile uyumlu olup olmadığını kontrol eder. Expo'nun iç uyumluluk veritabanını referans alır.
2. **Peer dependency audit:** Paketlerin birbirleriyle peer dependency uyumluluğunu denetler. Çakışan major hatları tespit eder.
3. **Config doğrulama:** `app.json` / `app.config.js` içindeki anahtarların geçerliliğini kontrol eder. Kaldırılmış, yeniden adlandırılmış veya değer formatı değişmiş anahtarları bildirir.
4. **Native module uyumu:** Yüklü native modüllerin mevcut SDK ile uyumlu olup olmadığını kontrol eder.
5. **Node.js sürüm kontrolü:** Sistemdeki Node.js sürümünün Expo'nun beklediği minimum sürümü karşılayıp karşılamadığını kontrol eder.
6. **TypeScript konfigürasyon kontrolü:** tsconfig ayarlarının Expo beklentileriyle uyumluluğunu denetler.

## 6.2. Nasıl Çalıştırılır

```bash
npx expo-doctor
```

Komut proje kök dizininde çalıştırılır. `node_modules` kurulu olmalıdır. Çıktı terminal'e satır satır yazılır.

**Ne zaman çalıştırılır:**
- SDK upgrade başlangıcında (mevcut durum tespiti)
- `npx expo install --fix` sonrasında (düzeltme doğrulaması)
- Her community paket güncellemesi sonrasında
- Merge öncesinde son doğrulama olarak
- CI pipeline'da otomatik olarak (her push'ta)

## 6.3. Çıktı Formatı ve Uyarı Türleri

### Başarılı kontrol
```
✓ Check Expo config for common issues
✓ Check package.json for common issues
✓ Check dependencies for version compatibility
```

### Başarısız kontrol (blocker)
```
✗ expo-camera@15.0.0 is not compatible with expo@56.0.0. Expected version: ~16.0.0
```
Bu demektir: expo-camera paketi güncellenmeli. `npx expo install expo-camera --fix` çalıştır.

### Uyarı (warning)
```
⚠ react-native-reanimated@3.10.0 may not be fully compatible. Recommended: ~3.12.0
```
Bu demektir: Paket muhtemelen çalışır ama önerilen sürüme güncelleme tavsiye edilir.

## 6.4. Hangi Uyarılar Blocker, Hangileri Warning

| Uyarı Türü | Seviye | Aksiyon |
|-------------|--------|---------|
| SDK ile uyumsuz native modül sürümü | Blocker | Paketi güncelle veya SDK upgrade'i ertele |
| React/RN major hat uyumsuzluğu | Blocker | `npx expo install --fix` ile düzelt |
| Kaldırılmış config anahtarı | Blocker | Config dosyasını güncelle |
| Peer dependency çakışması (major hat) | Blocker | Çakışan paketi uyumlu sürüme güncelle |
| Önerilen sürümden düşük ama uyumlu sürüm | Warning | Güncelleme tavsiye edilir, zorunlu değil |
| Deprecated API kullanımı | Warning | Migration planla, acil düzeltme gerekmez |
| Node.js minor sürüm farkı | Warning | Güncelleme tavsiye edilir |
| Opsiyonel config anahtarı eksikliği | Info | Değerlendir, ekle veya atla |

## 6.5. Uyarıları Çözme Stratejileri

1. **Tek paket uyumsuzluğu:** `npx expo install <paket-adı> --fix`
2. **Toplu düzeltme:** `npx expo install --fix` (tüm Expo-aware paketleri düzeltir)
3. **Config sorunu:** Changelog'daki migration guide'ı takip et
4. **Çözülemeyen uyumsuzluk:** Paket bakıcısına issue aç, alternatif ara veya SDK upgrade'i ertele

---

# 7. Rollback Senaryoları

Upgrade herhangi bir aşamada başarısız olabilir. Rollback planı upgrade başlamadan önce hazır olmalıdır.

## 7.1. Git ile Rollback

En temiz rollback yöntemi Git branch stratejisidir. Upgrade çalışması izole branch'te yapıldığı için:

```bash
# Upgrade branch'ini terk et
git checkout main

# Upgrade branch'ini sil (gerekirse)
git branch -D chore/sdk-XX-upgrade
```

Eğer upgrade branch'i trunk'a merge edildiyse ve sorun production'da tespit edildiyse:

```bash
# Merge commit'ini revert et
git revert <merge-commit-hash>
```

## 7.2. Lockfile ile Versiyon Geri Alma

`pnpm-lock.yaml` dosyası tüm dependency sürümlerini exact olarak tutar. Git ile önceki lockfile'a dönüldüğünde:

```bash
# Önceki lockfile'ı geri al
git checkout <önceki-commit-hash> -- pnpm-lock.yaml package.json

# Dependency'leri lockfile'a göre yeniden kur
pnpm install --frozen-lockfile
```

## 7.3. Native Build Cache Temizleme

SDK upgrade sonrası native cache'ler bozulabilir. Rollback sırasında bunlar temizlenmelidir:

### iOS

```bash
# CocoaPods cache temizle
cd ios && pod deintegrate && pod install && cd ..

# Xcode derived data temizle
rm -rf ~/Library/Developer/Xcode/DerivedData

# Expo prebuild temizle
npx expo prebuild --clean
```

### Android

```bash
# Gradle cache temizle
cd android && ./gradlew clean && cd ..

# Expo prebuild temizle
npx expo prebuild --clean
```

### Genel

```bash
# Metro bundler cache temizle
npx expo start --clear

# node_modules temizle ve yeniden kur
rm -rf node_modules
pnpm install
```

## 7.4. Rollback Sonrası Doğrulama

Rollback tamamlandıktan sonra:

1. `npx expo-doctor` çalıştır — temiz geçmeli
2. Development build başlat — crash olmadan açılmalı
3. EAS Build çalıştır — başarılı olmalı
4. OTA update testi yap — eski runtimeVersion ile güncelleme alınabilmeli
5. Tüm testleri çalıştır — kırılan test olmamalı

---

# 8. runtimeVersion ve OTA İlişkisi (Detaylı)

## 8.1. runtimeVersion Nedir

`runtimeVersion`, Expo Updates (EAS Update) sisteminin merkezinde yer alan bir eşleştirme mekanizmasıdır. Temel görevi şudur:

**Bir OTA güncelleme (JS bundle + asset'ler), yalnızca uyumlu native binary'ye teslim edilir.**

Native binary, uygulamanın store'dan indirilen veya development build olarak yüklenen kısmıdır. Bu kısım Expo SDK, React Native, native modüller ve config plugin çıktılarını içerir. JS bundle ise JavaScript/TypeScript kodu, React component'leri, stil dosyaları ve JSON konfigürasyonlarını içerir.

runtimeVersion, native binary ile JS bundle arasındaki uyumluluk sözleşmesidir. Eğer native binary'nin runtimeVersion'ı "1.0.0" ise, yalnızca runtimeVersion "1.0.0" olarak işaretlenmiş OTA güncellemeleri bu binary'ye teslim edilir.

## 8.2. runtimeVersion Politikaları

Expo üç runtimeVersion politikası sunar:

### 8.2.1. `appVersion` Politikası

```json
{
  "runtimeVersion": {
    "policy": "appVersion"
  }
}
```

`app.json`'daki `version` alanını runtimeVersion olarak kullanır. Avantajı basitliğidir; dezavantajı native değişiklik olsa bile version değiştirilmezse runtimeVersion değişmez ve uyumsuz OTA gönderilir.

### 8.2.2. `nativeVersion` Politikası

```json
{
  "runtimeVersion": {
    "policy": "nativeVersion"
  }
}
```

iOS'ta `buildNumber`, Android'de `versionCode` değerlerini runtimeVersion olarak kullanır.

### 8.2.3. `fingerprint` Politikası

```json
{
  "runtimeVersion": {
    "policy": "fingerprint"
  }
}
```

Expo, native projenin tüm bileşenlerinden (SDK sürümü, native modüller, config plugin çıktıları) bir hash (parmak izi) hesaplar. Native bileşenlerden herhangi biri değiştiğinde fingerprint otomatik değişir ve runtimeVersion da değişir.

**Bu politika SDK upgrade senaryoları için en güvenli seçenektir** çünkü native değişiklikleri otomatik tespit eder. Manuel runtimeVersion yönetimi gerekmez.

## 8.3. SDK Upgrade runtimeVersion'ı Nasıl Etkiler

Expo SDK major upgrade **her zaman** native binary'yi değiştirir. Bu nedenle:

- `fingerprint` politikası kullanılıyorsa: runtimeVersion otomatik değişir. Ek aksiyon gerekmez.
- `appVersion` politikası kullanılıyorsa: `app.json`'daki `version` alanı manuel olarak artırılmalıdır. Artırılmazsa eski native binary'ye uyumsuz JS bundle gönderilir.
- `nativeVersion` politikası kullanılıyorsa: `buildNumber` / `versionCode` manuel olarak artırılmalıdır.

## 8.4. runtimeVersion Değişirse Eski Kullanıcılar Ne Olur

runtimeVersion değiştiğinde:

1. **Mevcut kullanıcılar (eski binary):** OTA update alamaz. Uygulamaları son aldıkları OTA güncellemesiyle çalışmaya devam eder. Yeni güncelleme almak için store'dan yeni binary'yi indirmeleri gerekir.

2. **Yeni kullanıcılar / güncelleme yapan kullanıcılar (yeni binary):** Yeni runtimeVersion ile eşleşen OTA güncellemeleri alır.

3. **Geçiş dönemi:** Her iki runtimeVersion'a sahip kullanıcılar aynı anda aktif olabilir. Bu dönemde:
   - Eski runtimeVersion için kritik bug fix'ler gönderilmesi gerekebilir
   - Yeni runtimeVersion için normal OTA akışı devam eder
   - İki farklı JS bundle versiyonunun bakımı yapılır

## 8.5. Forced Update Stratejisi

SDK major upgrade sonrası tüm kullanıcıların yeni binary'ye geçmesi isteniyorsa:

1. **Backend'de minimum sürüm kontrolü:** API response'larında `minAppVersion` alanı gönderilir. Uygulama bu değeri kontrol eder.
2. **Uygulama tarafında forced update UI:** Minimum sürümün altındaki kullanıcılara "Güncelleme gerekli" full-screen modal gösterilir. Uygulama kullanılmaz duruma getirilir ve kullanıcı store'a yönlendirilir.
3. **Grace period:** Forced update genellikle SDK upgrade'den 1-2 hafta sonra aktif edilir. Bu süre kullanıcıların doğal güncelleme yapmasına izin verir.
4. **Analytics takibi:** Eski sürüm kullanıcı yüzdesi izlenir. Yeterince düştüğünde forced update kaldırılabilir ve eski channel kapatılır.

## 8.6. Channel-Based Deployment ile Smooth Migration

EAS Update channel'ları SDK upgrade geçişini yumuşatır:

```
production channel
├── runtimeVersion: "1.0.0" (SDK 55 binary)
│   └── Son kararlı JS bundle (eski kullanıcılar için)
│
└── runtimeVersion: "2.0.0" (SDK 56 binary)
    └── Yeni JS bundle (güncelleme yapan kullanıcılar için)
```

Bu yapıda:
- Eski kullanıcılar eski runtimeVersion'a ait son güncellemeyi alır
- Yeni kullanıcılar yeni runtimeVersion'a ait güncellemeleri alır
- İki grup birbirini etkilemez
- Eski runtimeVersion kullanıcı sayısı sıfıra düştüğünde eski channel kapatılır

---

# 9. Major vs Minor SDK Upgrade Farkları

## 9.1. Minor Upgrade (örn. 55.0.0 → 55.1.0)

Minor upgrade'ler genellikle:
- Bug fix'ler ve performans iyileştirmeleri içerir
- Breaking change içermez (semver garantisi)
- Native binary'yi değiştirmeyebilir (yalnızca JS tarafı düzeltmeleri)
- runtimeVersion değişikliği gerektirmeyebilir

**Süreç:**

```bash
npx expo install expo@~55.1.0 --fix
npx expo-doctor
```

expo-doctor temiz geçiyorsa, development build çalışıyorsa ve testler geçiyorsa merge edilebilir. Bu dokümanın tam süreci uygulanmak zorunda değildir ama expo-doctor ve temel test zorunluluğu geçerlidir.

## 9.2. Major Upgrade (örn. 55.x → 56.x)

Major upgrade'ler:
- Breaking change'ler içerebilir
- React Native hattını değiştirebilir
- React hattını değiştirebilir
- Hermes sürümünü değiştirebilir
- Native modül API'larını değiştirebilir
- Config plugin API'sini değiştirebilir
- runtimeVersion değişikliği gerektirir
- New Architecture davranışını değiştirebilir

**Süreç:** Bu dokümanın tamamı uygulanır. Kısaltma, atlama veya "basit görünüyor, direkt merge edelim" yaklaşımı kabul edilmez.

## 9.3. Karar Matrisi

| Kriter | Minor Upgrade | Major Upgrade |
|--------|---------------|---------------|
| Bu dokümanın tam süreci | Opsiyonel | Zorunlu |
| expo-doctor kontrolü | Zorunlu | Zorunlu |
| Ayrı branch | Opsiyonel | Zorunlu |
| Full test matrisi | Opsiyonel (temel test yeterli) | Zorunlu |
| EAS Build doğrulaması | Tavsiye edilir | Zorunlu |
| runtimeVersion değerlendirmesi | Kontrol et, genellikle değişmez | Zorunlu, kesinlikle değişir |
| 38-matrix güncellemesi | Genellikle gerekmez | Zorunlu |
| Rollback planı | Basit (git revert yeterli) | Detaylı plan zorunlu |
| Planlanan süre | Saatler | 1-3 gün |

---

# 10. Upgrade Checklist

SDK major upgrade PR'ı merge edilmeden önce aşağıdaki kontrol listesinin tamamı sağlanmalıdır:

### Ön Değerlendirme
- [ ] Yeni SDK changelog'u satır satır okundu
- [ ] Breaking changes listesi çıkarıldı
- [ ] Etkilenen paketler ve dosyalar tespit edildi
- [ ] New Architecture değişiklikleri değerlendirildi
- [ ] React Native ve React hat değişikliği kontrol edildi

### Dependency Uyumluluk
- [ ] `npx expo-doctor` temiz geçiyor (tüm `✗` çözüldü)
- [ ] Community native paketlerin uyumluluğu tek tek doğrulandı
- [ ] Navigation paketleri yeni RN hattıyla uyumlu
- [ ] Styling (NativeWind) yeni SDK ile uyumlu
- [ ] Testing stack (Jest, Testing Library) yeni SDK ile çalışıyor
- [ ] 38-version-compatibility-matrix.md ile karşılaştırma yapıldı

### Build ve Test
- [ ] Development build çalışıyor (iOS)
- [ ] Development build çalışıyor (Android)
- [ ] EAS Build başarılı (iOS — development profile)
- [ ] EAS Build başarılı (Android — development profile)
- [ ] EAS Build başarılı (iOS — production profile)
- [ ] EAS Build başarılı (Android — production profile)
- [ ] Fiziksel iOS cihazda test edildi
- [ ] Fiziksel Android cihazda test edildi
- [ ] Tüm birim testler geçiyor
- [ ] Navigation akışları test edildi
- [ ] Native modül fonksiyonları test edildi (kamera, konum, bildirim vb.)
- [ ] Animasyonlar ve gesture'lar test edildi
- [ ] Deep linking test edildi
- [ ] Push notification test edildi

### OTA ve runtimeVersion
- [ ] runtimeVersion değişikliği değerlendirildi
- [ ] runtimeVersion politikası doğru konfigüre edildi
- [ ] OTA update gönderim testi yapıldı (yeni runtimeVersion'a)
- [ ] Eski runtimeVersion ile uyumsuz OTA gönderilmediği doğrulandı
- [ ] Eski kullanıcılar için migration path belirlendi
- [ ] Forced update gerekli mi değerlendirildi

### Performans
- [ ] Cold start süresi baseline ile karşılaştırıldı
- [ ] Bundle boyutu baseline ile karşılaştırıldı
- [ ] Anlamlı performans regresyonu yok

### Dokümantasyon
- [ ] 38-version-compatibility-matrix.md güncellendi
- [ ] 36-canonical-stack-decision.md güncellendi (gerekirse)
- [ ] ADR-002 güncellendi (gerekirse)
- [ ] Bu dokümanın checklist'i dolduruldu ve PR'a eklendi

### Son Doğrulama
- [ ] expo-doctor son kez çalıştırıldı ve temiz geçiyor
- [ ] Rollback planı hazır ve dokümante edildi
- [ ] Team review tamamlandı

---

# 11. Anti-Pattern'ler

Aşağıdaki davranışlar SDK upgrade sürecinde anti-pattern olarak kabul edilir. Bu davranışların hiçbiri kabul edilmez.

## 11.1. Kontrolsüz `npm update` / `pnpm update`

```bash
# YAPMA
pnpm update expo
npm update expo
```

Bu komutlar Expo'nun uyumluluk veritabanını kullanmaz. Yalnızca semver range'ine göre en yeni sürümü alır. Peer dependency'leri düzeltmez. Bunun yerine:

```bash
# DOĞRU
npx expo install expo@latest --fix
```

## 11.2. expo-doctor Çalıştırmadan Merge

expo-doctor, upgrade'in sağlık kontrolüdür. Çalıştırmadan merge etmek, sağlık kontrolü yapılmadan ameliyata almak gibidir. expo-doctor çıktısı PR açıklamasına eklenir.

## 11.3. OTA Uyumluluğu Kontrol Etmeden Release

runtimeVersion değişikliği değerlendirilmeden production'a release yapılırsa:
- Eski kullanıcılara uyumsuz JS bundle gönderilir → crash
- Yeni kullanıcılara eski JS bundle gönderilir → eksik özellik veya hata
- Her iki senaryo da kullanıcı deneyimini ciddi şekilde bozar

## 11.4. Tek Platform Test Edip Diğerini Atlama

"iOS'ta çalışıyor, Android da çalışır herhalde" yaklaşımı kabul edilmez. Platform farkları:
- CocoaPods vs Gradle: Farklı dependency resolution
- iOS Deployment Target vs Android minSdkVersion: Farklı API mevcut
- JavaScriptCore (eski) vs Hermes: Engine davranış farkları
- Native linking: Platform-spesifik kırılmalar

Her iki platformda da build ve test zorunludur.

## 11.5. runtimeVersion Kontrolü Yapmadan Production Deployment

runtimeVersion yönetimi atlanırsa, EAS Update ile gönderilen JS bundle yanlış native binary'ye teslim edilir. Bu doğrudan production crash'e neden olur. runtimeVersion değişikliği upgrade checklist'in zorunlu maddesidir.

## 11.6. Sprint Ortasında Upgrade Başlatma

SDK upgrade, sprint başlangıcında veya code freeze öncesinde planlı olarak yapılır. Sprint ortasında başlatılan upgrade:
- Feature geliştirmeyi bloke eder
- Merge conflict sayısını artırır
- Zaman baskısı nedeniyle test kalitesini düşürür
- Rollback gerekirse sprint hedeflerini tehlikeye atar

## 11.7. Upgrade Branch'ini Uzun Süre Açık Bırakma

Upgrade branch'i trunk'tan ne kadar uzun süre ayrık kalırsa, merge conflict riski o kadar artar. Maksimum 3-5 iş günü içinde tamamlanmalı veya ertelenmelidir.

## 11.8. Build Uyarılarını Görmezden Gelme

EAS Build başarılı olsa bile log'lardaki deprecation warning'leri ve native uyarıları görmezden gelmek, gelecek SDK upgrade'i zorlaştırır. Her uyarı değerlendirilir ve mümkünse çözülür.

---

# 12. Frequency ve Timing

## 12.1. Major SDK Upgrade Sıklığı

Expo SDK major sürümleri yaklaşık yılda 2-3 kez yayımlanır (genellikle React Native major release'leri ile hizalı). Bu boilerplate her major SDK'yı anında takip etmek zorunda değildir:

- **Hemen upgrade:** Yeni SDK kritik güvenlik düzeltmesi veya projenin ihtiyaç duyduğu temel özelliği içeriyorsa.
- **1-2 ay içinde upgrade:** Yeni SDK kararlı görünüyorsa, community paketlerin uyumu doğrulandıysa ve mevcut sprint planlamasına sığıyorsa.
- **Erteleme:** Yeni SDK'da community paket uyumsuzlukları giderilmemişse, breaking change sayısı çok yüksekse veya projenin kritik dönemindeyse (launch, büyük feature release).

## 12.2. Upgrade Window

SDK upgrade aşağıdaki zamanlarda planlanır:

| Uygun Zaman | Açıklama |
|-------------|----------|
| Sprint başlangıcı | Sprint'in ilk 1-2 günü upgrade'e ayrılabilir |
| Code freeze öncesi | Release öncesi son teknik bakım penceresi |
| Bağımsız teknik sprint | Sadece teknik borç ve altyapı iyileştirmesine ayrılmış sprint |

| Uygun Olmayan Zaman | Açıklama |
|----------------------|----------|
| Sprint ortası | Feature geliştirme bloke olur |
| Release haftası | Risk kabul edilemez |
| Kritik demo/sunum öncesi | Kırılma riski çok yüksek |
| Tatil/izin dönemi | Sorun çıkarsa müdahale ekibi eksik kalır |

## 12.3. Planlanan Süre

| Upgrade Türü | Tahmini Süre | Açıklama |
|--------------|-------------|----------|
| Minor (55.0 → 55.1) | 2-4 saat | expo-doctor + temel test |
| Major (basit) | 1 iş günü | Az breaking change, community paketler uyumlu |
| Major (orta) | 2 iş günü | Birkaç breaking change, bazı paketler güncelleme gerektirir |
| Major (karmaşık) | 3-5 iş günü | Çok sayıda breaking change, community paket uyumsuzlukları, RN/React hat değişikliği |

Bu süreler tahmindir. Gerçek süre, projenin dependency karmaşıklığına ve community paket uyumluluk durumuna bağlıdır.

---

# 12.4. Third-Party Uyumluluk Matrisi (2026-04-02 Eki)

SDK upgrade öncesinde canonical kütüphanelerin yeni SDK ile uyumluluğu aşağıdaki matris ile doğrulanır:

| Canonical Kütüphane | SDK Uyum Kontrolü | Kaynak | Blocker mi? |
|--------------------|-------------------|--------|------------|
| React Navigation 7.x | RN sürüm eşleşmesi, native-screens uyumu | GitHub releases, changelog | Evet |
| NativeWind 5.x (candidate) | Tailwind CSS 4.x + RN sürüm uyumu | NativeWind GitHub issues | Evet |
| expo-notifications | SDK bundled modül mü, versiyon eşleşmesi | Expo SDK changelog | Evet |
| expo-linking | SDK bundled modül mü, versiyon eşleşmesi | Expo SDK changelog | Evet |
| expo-local-authentication | SDK bundled modül mü, biometric API değişikliği | Expo SDK changelog | Evet |
| expo-secure-store | SDK bundled modül mü, API değişikliği | Expo SDK changelog | Evet |
| react-native-purchases (RevenueCat) | RN sürüm uyumu, native bridge değişikliği | RevenueCat docs | Evet |
| Zustand 5.x | Pure JS, RN bağımlılığı yok | Genelde sorunsuz | Hayır |
| TanStack Query 5.x | Pure JS, RN bağımlılığı yok | Genelde sorunsuz | Hayır |
| React Hook Form 7.x | Pure JS, React sürüm uyumu | React sürüm eşleşmesi | Hayır |
| Zod 4.x | Pure JS, bağımlılık yok | Sorunsuz | Hayır |
| Sentry React Native | RN sürüm uyumu, native modül değişikliği | Sentry RN changelog | Evet |
| i18next 26.x | Pure JS, RN bağımlılığı yok | Genelde sorunsuz | Hayır |
| expo-updates (EAS Update) | SDK bundled modül, runtimeVersion etkisi | Expo SDK changelog | Evet |

**Kontrol sırası:** Önce blocker kütüphaneler, sonra non-blocker. Blocker kütüphanelerden herhangi biri uyumsuzsa, upgrade ertelenir veya uyumluluk sağlanana kadar beklenir.

## 12.5. Upgrade Regression Test Matrisi (2026-04-02 Eki)

SDK upgrade sonrasında aşağıdaki fonksiyonel alanlar her iki platformda (iOS + Android) test edilmelidir:

| Test Alanı | Test Senaryosu | Otomasyon | Priority |
|-----------|---------------|-----------|----------|
| App başlangıcı | Cold start, splash screen, initial route | E2E | P0 |
| Navigation | Tab navigation, stack push/pop, modal, deep link navigasyon | E2E | P0 |
| Auth | Login, logout, session persistence, biometric unlock | Manuel + E2E | P0 |
| Form | Form render, validation, submit, error display | E2E | P1 |
| Push notification | Token alma, foreground/background notification, tap action | Manuel | P1 |
| Deep link | Universal link açılma, app-içi navigasyon, fallback | Manuel | P1 |
| Offline | Offline veri okuma, queue'lama, reconnect sync | Manuel | P1 |
| Biometric | Face ID/Touch ID prompt, başarılı/başarısız akış | Manuel | P1 |
| In-App Purchase | Ürün listeleme, satın alma akışı, restore | Manuel (sandbox) | P2 |
| Animasyonlar | Screen transition, gesture, haptic feedback | Manuel | P2 |
| OTA Update | EAS Update alma, uygulama, rollback | Manuel | P1 |
| Kamera/Medya | Kamera açılma, fotoğraf çekme, galeri erişimi | Manuel | P2 |
| Konum | Konum izni, konum alma, harita render | Manuel | P2 |
| Performans | Cold start süresi, bundle boyutu, bellek kullanımı | Benchmark | P1 |

**Test tamamlanma kriteri:** Tüm P0 testleri geçmeli. P1 testlerinden en fazla 1 tanesi "bilinen sorun" olarak exception kaydıyla geçilebilir. P2 testleri önerilen ama zorunlu değil.

---

# 13. Doküman Senkronizasyonu

SDK upgrade tamamlandığında aşağıdaki dokümanlar güncellenir:

| Doküman | Güncellenecek Bölüm |
|---------|---------------------|
| `38-version-compatibility-matrix.md` | Expo SDK, RN, React, Hermes, bundled modül sürüm hatları |
| `36-canonical-stack-decision.md` | Canonical Expo SDK sürüm referansı |
| `ADR-002-mobile-runtime-and-native-strategy.md` | SDK sürüm referansı (gerekirse) |
| `19-roadmap-to-implementation.md` | SDK upgrade milestone (gerekirse) |
| `20-initial-implementation-checklist.md` | SDK baseline sürümleri |

Doküman güncellemesi yapılmadan SDK upgrade tamamlanmış sayılmaz.

---

# 14. Doğrulama Soruları

Bu belge aşağıdaki koşullar sağlandığında doğru uygulanmış kabul edilir:

1. SDK upgrade PR'ı izole branch'te hazırlandıysa
2. Changelog analizi ve breaking change tespiti yapıldıysa
3. expo-doctor temiz geçiyorsa
4. Community native paketlerin uyumluluğu tek tek doğrulandıysa
5. Hem iOS hem Android'de development build ve EAS Build başarılıysa
6. runtimeVersion etkisi değerlendirilip OTA migration stratejisi belirlendiyse
7. Performans baseline ile karşılaştırma yapıldıysa
8. 38-version-compatibility-matrix güncellendiyse
9. Upgrade checklist'in tamamı işaretlendiyse
10. Team review tamamlandıysa
11. Rollback planı hazır ve dokümante edildiyse
