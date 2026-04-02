# 30-contribution-guide.md

## Doküman Kimliği

- **Doküman adı:** Contribution Guide
- **Dosya adı:** `30-contribution-guide.md`
- **Doküman türü:** Process / contribution contract / repo working rules document
- **Durum:** Accepted
- **Tarih:** 2026-03-31
- **Kapsam:** Bu belge, repo içinde yeni iş başlatma, existing işi güncelleme, dependency ekleme, package açma, doküman değiştirme, ADR açma, quality gates çalışma biçimi, PR hazırlığı, review beklentileri, docs sync ve canonical stack koruma kurallarını tanımlar.
- **Bağlı olduğu üst belgeler:**
  - `01-working-principles.md`
  - `15-quality-gates-and-ci-rules.md`
  - `17-technology-decision-framework.md`
  - `19-roadmap-to-implementation.md`
  - `20-initial-implementation-checklist.md`
  - `21-repo-structure-spec.md`
  - `27-security-and-secrets-baseline.md`
  - `28-observability-and-debugging.md`
  - `29-release-and-versioning-rules.md`
  - `36-canonical-stack-decision.md`
  - `37-dependency-policy.md`
  - `38-version-compatibility-matrix.md`
  - `ADR-001` → `ADR-017`
- **Doğrudan etkileyeceği belgeler:**
  - `31-audit-checklist.md`
  - `32-definition-of-done.md`
  - `35-document-map.md`

---

# 1. Bu Belgenin Revize Edilme Nedeni

Önceki sürüm katkı sürecini ciddi ve kurallı ele alıyordu.  
Ama artık proje için çok önemli bir değişiklik oldu:

- canonical stack kapandı
- ADR zinciri tamamlandı
- dependency policy yazıldı
- compatibility matrix yazıldı

Bu yüzden contribution guide artık yalnızca “iyi PR nasıl açılır?” belgesi olamaz.  
Artık şu soruyu çok net cevaplamak zorundadır:

> Bu repo’da katkı yapmak, karar verilmiş sistemi uygulamak mı demektir, yoksa herkesin yeniden teknoloji/mimari keşfi yapması mı?

Cevap:
- karar verilmiş sistemi uygulamaktır

Bu revizyon bunun operasyonel sonucunu yazar.

---

# 2. Amaç

Bu dokümanın amacı, katkı sürecini:

- bireysel alışkanlık,
- hızlı kod dökme,
- reviewer üstüne düşünme işi yıkma,
- “küçük değişiklik o yüzden kural gerekmez” kültürü

olmaktan çıkarıp;  
**docs-first, canonical-stack-aware, dependency-governed, compatibility-safe ve audit-ready çalışma sözleşmesi** haline getirmektir.

Bu belge şu sorulara net cevap verir:

1. Yeni işe başlamadan önce ne okunur?
2. Contribution sırasında hangi canonical kararlar varsayım değil zorunluluktur?
3. Ne zaman ADR gerekir?
4. Ne zaman dependency policy kontrolü gerekir?
5. Ne zaman compatibility matrix kontrolü gerekir?
6. Ne zaman docs sync zorunludur?
7. PR açılmadan önce minimum hangi kanıtlar hazır olmalıdır?
8. Reviewer neyi beklemelidir?
9. Hangi davranışlar doğrudan zayıf kabul edilir?

---

# 3. Temel Tez

## 3.1. Repo modları ve faz ayrımı

Bu arşiv iki farklı modda okunabilir ve contribution davranışı buna göre değişir:

1. **Docs-only / pre-bootstrap mode**  
   Bu modda repo henüz çalışan monorepo değildir. Amaç doküman, ADR, guardrail ve governance katmanını olgunlaştırmaktır. `package.json`, `pnpm-lock.yaml`, `pnpm-workspace.yaml`, `apps/` ve `packages/` yapısı henüz bulunmayabilir. Bu modda yapılacak katkılar ağırlıklı olarak belge, karar, audit, AI talimatı ve workflow şablonu katkılarıdır.

2. **Bootstrap-ready / derived project mode**  
   Bu modda repo veya türetilmiş proje artık çalışan workspace'e dönüşmüştür. `pnpm install`, `pnpm dev`, `pnpm dev:mobile`, `pnpm typecheck`, `pnpm lint`, `pnpm test` gibi komutlar ancak bu aşamada normatif kabul edilir.

**Zorunlu kural:** Bu belgedeki kurulum ve çalışma komutları docs-only mod için değil, bootstrap-ready / derived project mod için bağlayıcıdır. Docs-only modda aynı komutların eksik olması kusur sayılmaz; kusur, bu faz ayrımının gözden kaçırılmasıdır.


Bu proje kapsamında temel tez şudur:

> Katkı, yalnızca kod eklemek değil; mevcut canonical karar katmanını ihlal etmeden, doğru belge bağlamını kontrol ederek, gerektiğinde ADR/dependency/compatibility sürecini işleterek, kalite kapılarını çalıştırarak ve gerekiyorsa ilgili dokümanları güncelleyerek değişikliği denetlenebilir hale getirmektir.

Bu tez şu sonuçları doğurur:

1. Kod yazmak contribution’ın ilk adımı değildir.
2. “Küçük değişiklik” kural dışı çalışma bahanesi değildir.
3. Yeni dependency veya yeni package kararı normal refactor gibi ele alınmaz.
4. Docs sync gerektiren iş docs sync olmadan kapatılamaz.
5. Reviewer, eksik düşünme işini sıfırdan yapmak zorunda kalmamalıdır.

---

# 4. Contribution Türleri

Bu repo’da katkılar en az aşağıdaki ailelerde düşünülür:

1. **Feature contribution**
2. **Reusable UI contribution**
3. **Foundation/runtime contribution**
4. **Dependency contribution**
5. **Docs contribution**
6. **Governance/tooling contribution**
7. **Compatibility/upgrade contribution**
8. **Bug fix**
9. **Hotfix**
10. **Audit remediation**

Her tür aynı süreç yoğunluğu ile ilerlemez.  
Ama hiçbiri kuralsız değildir.

---

# 5. Yeni İşe Başlamadan Önce Zorunlu Okuma

## 5.1. Her katkı için minimum
- `01-working-principles.md`
- `35-document-map.md`

## 5.2. Teknik veya mimari katkı için
- `17-technology-decision-framework.md`
- `36-canonical-stack-decision.md`
- ilgili ADR

## 5.3. Dependency veya version etkisi varsa
- `37-dependency-policy.md`
- `38-version-compatibility-matrix.md`

## 5.4. Feature veya UI işi için
- ilgili alan standartları (`03`–`16`, `22`–`26`, `33`, `34`)

## 5.5. Audit/denetim işleri için
- `31-audit-checklist.md`
- `32-definition-of-done.md`

## 5.6. UI/DS/HIG işleri için
- `33-visual-implementation-contract.md`
- `34-hig-enforcement-strategy.md`

## 5.7. Kural
“Belge okumadan başladım, sonra toparlarız” bu repo için zayıf çalışma biçimidir.

## 5.8. Local Development Setup ve İlk Kurulum Rehberi

Bu bölüm, repo'ya yeni katılan bir geliştiricinin clone işleminden itibaren çalışan bir geliştirme ortamı kurmasını sağlar. Aşağıdaki adımlar eksiksiz takip edilmelidir. Herhangi bir adımın atlanması, ileride hata ayıklaması güç sorunlara yol açabilir.

### 5.8.1. Ön Koşullar

Geliştirme ortamının çalışabilmesi için aşağıdaki araçların doğru versiyonlarda kurulu olması zorunludur:

| Araç | Gerekli Versiyon | Açıklama |
|------|-------------------|----------|
| **Node.js** | 20.19.x | JavaScript runtime. Versiyon yönetimi için `nvm` (Node Version Manager) veya `fnm` (Fast Node Manager) kullanılması önerilir. Bu araçlar proje dizininde `.nvmrc` veya `.node-version` dosyasını okuyarak doğru versiyona otomatik geçiş sağlar. |
| **pnpm** | 10.x | Performanslı, disk-verimli paket yöneticisi. Global kurulum: `npm install -g pnpm`. Bu proje npm veya yarn değil, yalnızca pnpm kullanır. `package-lock.json` veya `yarn.lock` dosyası oluşturulmamalıdır. |
| **Git** | 2.x+ | Versiyon kontrol sistemi. Branch korumaları ve hook'lar düzgün çalışabilmesi için güncel bir Git sürümü gereklidir. |

Kurulumdan sonra versiyonları doğrula:

```bash
node --version    # v20.19.x çıktısı beklenir
pnpm --version    # 10.x.x çıktısı beklenir
git --version     # git version 2.x.x çıktısı beklenir
```

Bu komutlardan herhangi biri hata veriyorsa veya beklenen versiyon aralığında değilse, ilgili aracı kur veya güncelle. İlerlemeden önce üçünün de doğru versiyonda olduğundan emin ol.

### 5.8.2. İlk Kurulum Adımları

Ön koşullar sağlandıktan sonra aşağıdaki adımları sırayla uygula:

**Adım 1 — Repo'yu clone'la:**

```bash
git clone <repo-url>
cd <repo-dizini>
```

Clone işlemi tüm branch'leri, commit geçmişini ve proje dosyalarını indirir.

**Adım 2 — Bağımlılıkları kur:**

```bash
pnpm install
```

> **Faz notu:** Bu bölüm yalnızca bootstrap-ready / derived project modunda geçerlidir. Docs-only arşivde bu komutların çalışmaması beklenen durumdur.

Bu komutu repo'nun **root dizininde** çalıştır. pnpm, monorepo yapısında tüm workspace package'larının bağımlılıklarını tek seferde kurar. `node_modules` klasörlerini her package içine oluşturur ve paylaşılan bağımlılıkları symlink ile yönetir. Bu adım birkaç dakika sürebilir; internet bağlantısına ve bağımlılık sayısına bağlıdır.

**Adım 3 — Ortam değişkenlerini yapılandır:**

```bash
cp .env.example .env.local
```

`.env.example` dosyası, projenin çalışması için gereken tüm ortam değişkenlerinin şablonunu içerir. Bu dosyayı `.env.local` olarak kopyala ve içindeki placeholder değerleri gerçek değerlerle doldur. Hangi değişkenin ne anlama geldiği `.env.example` dosyasında yorum satırlarıyla açıklanmıştır. `.env.local` dosyası `.gitignore`'da olduğundan repo'ya commit edilmez; bu sayede gizli bilgiler (API key, secret vb.) versiyon kontrolüne girmez.

**Adım 4 — Geliştirme sunucusunu başlat:**

Web geliştirme için:
```bash
pnpm dev
```

Mobile (Expo) geliştirme için:
```bash
pnpm dev:mobile
```

`pnpm dev` komutu Vite dev server'ı başlatır ve tarayıcıda uygulamayı açar. `pnpm dev:mobile` komutu Expo dev server'ı başlatır; terminalden QR kodu tarayarak veya emulator'de açarak mobil uygulamayı çalıştırabilirsin.

### 5.8.3. IDE Setup

**Önerilen IDE:** Visual Studio Code (VSCode). Proje yapılandırması, extension önerileri ve workspace ayarları VSCode'a göre hazırlanmıştır.

**Önerilen extension'lar:**

| Extension | Açıklama |
|-----------|----------|
| **ESLint** | Kod kalitesi ve stil kurallarını editörde anlık gösterir. Kayıt sırasında otomatik düzeltme yapar. |
| **Prettier** | Kod formatlama aracı. Tutarlı format sağlar. Kayıt sırasında otomatik çalışır. |
| **Tailwind CSS IntelliSense** | Tailwind sınıflarını otomatik tamamlar, hover'da stil bilgisi gösterir, yanlış sınıf isimlerini uyarır. |
| **TypeScript** | VSCode'da yerleşik gelir ancak güncel olduğundan emin ol. TypeScript dil sunucusu tip hatalarını anlık gösterir. |
| **Error Lens** | Hata ve uyarıları ilgili satırın yanında inline olarak gösterir. Sorunları fark etmeyi hızlandırır. |

Repo'da `.vscode/extensions.json` dosyası tutulur. VSCode bu dosyayı okuduğunda “önerilen extension'lar” bildirimi gösterir ve tek tıkla toplu kurulum sağlar. Bu dosyayı güncel tutmak tüm ekibin aynı araç setini kullanmasını garantiler.

### 5.8.4. Kurulum Doğrulama

Ortam kurulumu tamamlandıktan sonra aşağıdaki üç komutu çalıştırarak her şeyin doğru çalıştığını doğrula:

```bash
pnpm typecheck    # TypeScript tip kontrolü — hata çıkmamalı
pnpm lint         # Lint kuralları kontrolü — hata çıkmamalı
pnpm test         # Test suite — tüm testler geçmeli
```

- `pnpm typecheck`: TypeScript derleyicisini `--noEmit` moduyla çalıştırır. Tip hataları varsa listeler. Sıfır hata beklenir.
- `pnpm lint`: ESLint kurallarını tüm proje dosyalarında çalıştırır. Hata veya uyarı çıkmamalıdır. Eğer uyarı çıkıyorsa, bunlar mevcut teknik borçtan kaynaklanıyor olabilir; ancak yeni hata eklenmemelidir.
- `pnpm test`: Test runner'ı (Vitest veya Jest) çalıştırır. Tüm testlerin geçmesi beklenir. Başarısız test varsa bu, senin kurulumunla ilgili bir sorun olabilir veya mevcut bir kırılma olabilir — takımla paylaş.

**Bu üç komut da hatasız geçmelidir.** Eğer herhangi biri başarısız oluyorsa, aşağıdaki “Sık Karşılaşılan Sorunlar” bölümüne bak veya takımdan yardım iste.

### 5.8.5. Sık Karşılaşılan Sorunlar ve Çözümleri

| Sorun | Neden | Çözüm |
|-------|-------|-------|
| **Node versiyonu yanlış** | nvm/fnm ile doğru versiyon seçilmemiş veya sistem Node'u kullanılıyor. | `nvm use` veya `fnm use` komutunu repo dizininde çalıştır. Bu komut `.nvmrc` dosyasını okuyarak doğru versiyona geçer. Versiyon kurulu değilse `nvm install` ile kur. |
| **pnpm install peer dependency hatası** | Lockfile ile mevcut bağımlılıklar arasında uyumsuzluk var. | `pnpm install --frozen-lockfile` komutunu dene. Bu komut lockfile'ı değiştirmeden kurulum yapar. Hala hata alıyorsan `node_modules` klasörlerini silip (`rm -rf node_modules packages/*/node_modules`) tekrar `pnpm install` çalıştır. |
| **Expo Metro bundler başlamıyor** | Metro bundler cache'i bozulmuş veya port çakışması var. | `npx expo start --clear` komutuyla cache temizleyerek başlat. Port 8081 kullanılıyorsa başka bir Expo veya Metro süreci çalışıyor olabilir; onu kapat. |
| **.env eksik değişken** | Uygulama başlarken veya çalışırken “undefined” hataları alınıyor. | `.env.local` dosyanı `.env.example` ile satır satır karşılaştır. Eksik değişkenleri ekle. Yeni eklenen değişkenler için takımdan güncel değerleri iste. |
| **TypeScript hataları** | IDE tip hataları gösteriyor ancak kod doğru görünüyor. | Önce `pnpm typecheck` ile terminalden doğrula. IDE'deki TypeScript sunucusu bazen eski cache kullanır. VSCode'da `Cmd/Ctrl + Shift + P` → “TypeScript: Restart TS Server” ile sunucuyu yeniden başlat. Sorun devam ederse VSCode'u tamamen kapatıp aç. |

### 5.8.6. Mobile Geliştirme İçin Ek Kurulum

Mobile geliştirme web'e kıyasla ek araçlar gerektirir. Hangi platformda geliştirme yapacağına bağlı olarak aşağıdaki kurulumları tamamla:

**iOS geliştirme (yalnızca macOS):**
- **Xcode:** App Store'dan kur. Expo'nun gerektirdiği minimum Xcode versiyonunu Expo belgelerinden kontrol et. Xcode ilk açılışta ek bileşenler kuracaktır; bunu tamamlamasını bekle.
- **Xcode Command Line Tools:** `xcode-select --install` komutuyla kur. Bu araçlar iOS simulator, build araçları ve diğer geliştirme yardımcılarını içerir.
- **CocoaPods:** `sudo gem install cocoapods` ile kur. iOS native bağımlılıkları CocoaPods ile yönetilir.

**Android geliştirme:**
- **Android Studio:** Resmi sitesinden indir ve kur. Kurulum sırasında “Android SDK”, “Android SDK Platform” ve “Android Virtual Device” bileşenlerini seç.
- **Android SDK:** Android Studio içinden SDK Manager'ı aç. Expo'nun gerektirdiği API level'ı (Expo belgelerinden kontrol et) ve ilgili build tools'u kur.
- **Emulator veya fiziksel cihaz:** Android Studio AVD Manager'dan emulator oluştur veya fiziksel cihazda USB debugging'i etkinleştir.
- **ANDROID_HOME ortam değişkeni:** Shell profile'ına (`.zshrc` veya `.bashrc`) `export ANDROID_HOME=$HOME/Library/Android/sdk` ve `export PATH=$PATH:$ANDROID_HOME/emulator:$ANDROID_HOME/tools:$ANDROID_HOME/tools/bin:$ANDROID_HOME/platform-tools` ekle.

**Mobile başlangıç kuralı — development build first:**
Expo Go yalnızca sınırlı sandbox ve hızlı görsel deneme içindir. Bu boilerplate'te gerçek mobile geliştirme baseline'ı development build'dir. `pnpm dev:mobile` ile development server başlatılır; ardından development build fiziksel cihazda veya emülatörde doğrulanır. Native modül, linking, auth, secure storage, push, purchase ve config plugin davranışları Expo Go ile kanıtlanmış sayılmaz. Bootstrap sırasında `expo-doctor` temiz geçmeli; development build açılmadan mobile foundation tamamlandı denmez.
Aynı şekilde install-time güvenlik de contribution standardının parçasıdır: `pnpm` tarafında `minimumReleaseAge`, `allowBuilds` ve `trustPolicy` baseline'ı gevşetilmemeli; build script izni gereken yeni dependency'lerde `pnpm approve-builds` / allowlist kararı açıklamasız bırakılmamalıdır.

### 5.8.7. Docker (Opsiyonel)

Bu proje Docker kullanmayı zorunlu kılmaz. Yerel geliştirme için yukarıdaki adımlar yeterlidir.

Ancak tutarlı CI ortamı sağlamak ve “bende çalışıyor” sorunlarını minimize etmek için repo'da Dockerfile veya `.devcontainer/devcontainer.json` yapılandırması bulunabilir. VSCode Dev Containers extension'ı ile bu yapılandırma kullanılarak izole, tekrarlanabilir bir geliştirme ortamı oluşturulabilir.

Docker kullanmak istiyorsan:
1. Docker Desktop'ı kur ve çalıştır.
2. VSCode Dev Containers extension'ını kur.
3. VSCode'da `Cmd/Ctrl + Shift + P` → “Dev Containers: Reopen in Container” seç.
4. Container build edilir ve tüm bağımlılıklar otomatik kurulur.

Docker, özellikle farklı işletim sistemlerinde çalışan ekip üyeleri arasında ortam farklılıklarını ortadan kaldırmak için faydalıdır.

---

# 6. Contribution Öncesi Karar Sınıflaması

Her yeni iş şu üç sınıftan birine yerleştirilmelidir:

1. **Mevcut karar setini uygulayan iş**
2. **Sınırlı açık alanda karar veren iş**
3. **Canonical kararı etkileyen iş**

## 6.1. Birinci sınıf
- normal feature
- normal UI
- mevcut stack içinde kalan refactor
- mevcut package’ler içinde çalışma

## 6.2. İkinci sınıf
- analytics vendor seçimi gibi constrained open area
- mobile E2E vendor değerlendirmesi
- visual regression tool seçimi

## 6.3. Üçüncü sınıf
- yeni runtime family
- ikinci state/query/forms tool
- styling authority değişimi
- auth/session model değişimi
- exact compatibility baseline değişimi

Üçüncü sınıf neredeyse her zaman ADR seviyesidir.

---

# 7. Kod Yazmadan Önce Sorulacak Zorunlu Sorular

1. Bu iş hangi belge veya ADR’ye bağlı?
2. Mevcut canonical stack içinde mi kalıyor?
3. Yeni dependency gerekiyor mu?
4. New package gerekiyor mu?
5. Compatibility etkisi var mı?
6. Docs sync gerekecek mi?
7. Audit veya DoD kriterini etkiliyor mu?
8. Cross-platform parity etkisi var mı?
9. Security/observability/a11y etkisi var mı?
10. Bu işi koddan önce netleştirmem gereken bir karar var mı?

Bu sorular cevaplanmadan üretime geçmek yanlıştır.

---

# 8. Yeni Dependency Eklemek İstiyorsan

## 8.1. Kural
Yeni dependency eklemek sıradan değişiklik değildir.

## 8.2. Zorunlu süreç
- problem tanımı
- mevcut stack neden yetmiyor?
- `37-dependency-policy.md` kontrolü
- `38-version-compatibility-matrix.md` kontrolü
- risk sınıfı belirleme
- gerekirse ADR
- sonra ekleme

## 8.3. PR açıklamasında beklenenler
- neden gerekiyor
- neden mevcut çözüm yetmedi
- security/privacy etkisi
- compatibility etkisi
- package family impact

## 8.4. Zayıf davranışlar
- küçük paket zaten diyerek eklemek
- reviewer’a “bunu da kurdum” sürprizi yapmak
- compatibility etkisini hiç yazmamak

---

# 9. Yeni Package Açmak İstiyorsan

## 9.1. Kural
Monorepo içinde yeni package açmak da sıradan klasör kararı değildir.

## 9.2. Zorunlu sorular
- bu gerçekten shared mi?
- feature code’yu yanlışlıkla package’a mı taşıyorum?
- `21-repo-structure-spec.md` ile uyumlu mu?
- app içinde kalması daha doğru değil mi?
- package public surface net mi?
- testing ve ownership temiz mi?

## 9.3. Zayıf davranışlar
- teorik reuse için package açmak
- feature modülü package’a kaçırmak
- random `shared`/`common` paketi açmak

---

# 10. Ne Zaman ADR Gerekir?

Aşağıdaki durumlarda ADR güçlü gerekliliktir:

1. canonical stack etkileniyorsa
2. closed area’ya dokunuluyorsa
3. yeni runtime/data/forms/styling/tool family geliyorsa
4. auth/security/observability boundaries değişiyorsa
5. repo topology yönü etkileniyorsa
6. compatibility baseline değişiyorsa
7. tooling/governance rejimi yapısal değişiyorsa

## 10.1. Kural
ADR gerektiren şeyi “küçük refactor” gibi geçirmek kabul edilmez.

---

# 11. Docs Sync Ne Zaman Zorunlu?

Docs sync aşağıdaki durumlarda zorunludur:

- yeni canonical karar
- existing standard etkisi
- repo structure etkisi
- dependency policy etkisi
- compatibility matrix etkisi
- contribution/audit/DoD etkisi
- release/versioning etkisi
- security/observability/i18n/auth sınırı değişimi

## 11.1. Kural
Kod değişti ama belge değişmedi = docs-first rejimde eksik iş.

---

# 12. Branch / PR Mantığı

## 12.1. Kural
PR, reviewer’a düşünme yükü boşaltılmış halde gelmelidir.

## 12.2. PR açıklamasında minimum beklenenler
- ne değişti
- neden değişti
- hangi belge/ADR ile ilişkili
- dependency etkisi var mı
- compatibility etkisi var mı
- docs sync yapıldı mı
- test/audit/visual proof ne
- risk nedir

## 12.3. Zayıf davranışlar
- “fix”
- “refactor”
- “some changes”
- bağlam vermeden büyük PR açmak

### Branching Stratejisi

Bu proje trunk-based development modeli ile çalışır. Branch isimlendirme convention'ı, merge politikası, release branch yönetimi ve hotfix süreci `42-branching-and-merge-strategy.md` belgesinde tanımlanmıştır. PR açmadan önce bu belgeyi referans alın.

## 12.4. Git Branch Modeli

Bu proje **trunk-based development** modelini benimser. Bu modelde `main` branch her zaman deploy edilebilir (veya deploy'a çok yakın) durumda tutulur. Uzun ömürlü feature branch'ler yerine kısa ömürlü, odaklı branch'ler tercih edilir.

### 12.4.1. Branch Türleri ve İsimlendirme Kuralı

Branch isimleri aşağıdaki formata uymalıdır: `<tür>/<kısa-açıklama>`. Açıklama kısmı küçük harf, tire ile ayrılmış, anlaşılır kelimelerden oluşmalıdır. Türkçe karakter kullanılmaz.

| Branch Türü | Format | Ne Zaman Kullanılır | Örnek |
|-------------|--------|---------------------|-------|
| **feature** | `feature/<kısa-açıklama>` | Yeni özellik geliştirme. Kullanıcıya yeni bir değer katacak iş. | `feature/login-screen`, `feature/product-listing` |
| **fix** | `fix/<kısa-açıklama>` | Bug düzeltme. Mevcut davranıştaki hatanın giderilmesi. | `fix/form-validation-error`, `fix/token-refresh-loop` |
| **hotfix** | `hotfix/<kısa-açıklama>` | Production ortamında acil düzeltme. Deploy edilmiş kodda kritik sorun. | `hotfix/payment-crash`, `hotfix/auth-bypass` |
| **chore** | `chore/<kısa-açıklama>` | Dependency güncelleme, config değişikliği, build ayarı, CI düzenlemesi. Kullanıcı davranışını değiştirmeyen bakım işleri. | `chore/update-eslint-config`, `chore/bump-expo-sdk` |
| **docs** | `docs/<kısa-açıklama>` | Dokümantasyon ekleme veya güncelleme. Kod değişikliği içermeyen belge işleri. | `docs/api-usage-guide`, `docs/adr-012-caching` |

### 12.4.2. Branch Ömrü

Feature branch'ler **mümkün olduğunca kısa ömürlü** olmalıdır. İdeal süre **1-3 gün**dür. Bu kural şu nedenlere dayanır:

- **Merge conflict riski:** Branch ne kadar uzun yaşarsa, `main`'den o kadar uzaklaşır. Diğer geliştiricilerin merge ettiği değişikliklerle çakışma olasılığı artar. Büyük conflict'leri çözmek zaman kaybettirir ve hata riski taşır.
- **Review zorluğu:** Uzun sürede biriken değişiklikler büyük PR'lar oluşturur. Büyük PR'ları review etmek zorlaştırır, gözden kaçan hata sayısı artar, reviewer motivasyonu düşer.
- **Entegrasyon gecikmesi:** Uzun yaşayan branch'teki değişiklikler diğer geliştiricilerin göremediği “karanlık” koddur. Entegrasyon ne kadar geç olursa, sorunlar o kadar geç ortaya çıkar.

Eğer bir iş 3 günden uzun sürecekse, işi daha küçük, bağımsız merge edilebilir parçalara böl. Her parça kendi başına anlamlı ve çalışır durumda olmalıdır.

### 12.4.3. Branch Protection Kuralları

`main` branch aşağıdaki korumalarla korunur:

1. **Doğrudan push YASAK:** `main` branch'e doğrudan commit push edilemez. Hiçbir geliştirici, hiçbir koşulda `main`'e direkt push yapmamalıdır. Bu kural GitHub branch protection rules ile teknik olarak zorlanır.
2. **Tüm değişiklikler PR üzerinden girer:** Her değişiklik bir Pull Request aracılığıyla `main`'e merge edilir. Bu sayede her değişiklik review edilir, CI kontrollerinden geçer ve belgelenmiş olur.
3. **PR merge koşulları:**
   - **CI geçmeli:** Tüm CI pipeline adımları (typecheck, lint, test, build) başarılı olmalıdır. Başarısız CI ile merge yapılmaz.
   - **En az 1 reviewer onayı:** PR, en az bir ekip üyesinin “Approve” vermesiyle merge edilebilir hale gelir. Self-approve (kendi PR'ını onaylama) yapılmaz.
   - **Conversation'lar resolved:** Review sırasında açılan tüm tartışma thread'leri kapatılmış (resolved) olmalıdır. Açık kalan soru veya itiraz varsa merge yapılmaz.

### 12.4.4. Merge Sonrası Temizlik

Feature branch `main`'e merge edildikten sonra **silinir**. Artık işlevi kalmamış branch'lerin repo'da birikmesi karmaşaya yol açar. GitHub'da “Automatically delete head branches” ayarı açık olmalıdır; bu sayede PR merge edildiğinde branch otomatik silinir. Eğer bu ayar aktif değilse, branch sahibi merge sonrası branch'i manuel siler.

## 12.5. Commit Mesajı Standardı

Bu proje **Conventional Commits** standardını benimser. Bu standart, commit geçmişini okunabilir, aranabilir ve otomatik araçlarla (changelog üretimi, semantic versioning) işlenebilir hale getirir.

### 12.5.1. Format

Her commit mesajı aşağıdaki formatta yazılmalıdır:

```
<type>(<scope>): <açıklama>

[opsiyonel body]

[opsiyonel footer]
```

**Örnekler:**

```
feat(auth): login ekranı eklendi
fix(forms): validation hatası düzeltildi
docs(security): KVKK bölümü eklendi
chore(deps): react-query 5.x sürümüne güncellendi
refactor(navigation): tab navigator yapısı sadeleştirildi
test(tokens): renk token dönüşüm testleri eklendi
```

### 12.5.2. Type (Tür)

Type alanı commit'in ne tür bir değişiklik olduğunu belirtir. Aşağıdaki type'lar kullanılır:

| Type | Açıklama | Changelog'da Görünür Mü |
|------|----------|--------------------------|
| **feat** | Yeni özellik. Kullanıcıya yeni bir yetenek kazandıran değişiklik. | Evet |
| **fix** | Bug düzeltme. Mevcut davranıştaki bir hatanın giderilmesi. | Evet |
| **docs** | Dokümantasyon değişikliği. Kod davranışı değişmez. | Hayır |
| **style** | Kod formatlama, boşluk, noktalama, satır sonu düzenlemesi. Kod davranışı değişmez. Yalnızca görünüm/format ile ilgili. | Hayır |
| **refactor** | Ne fix ne feat olan kod yeniden yapılandırması. Davranış değişmez, iç yapı iyileşir. | Hayır |
| **test** | Test ekleme veya mevcut testi düzeltme. Uygulama kodu değişmez. | Hayır |
| **chore** | Build sistemi, CI yapılandırması, dependency güncelleme, tooling değişikliği. | Hayır |
| **perf** | Performans iyileştirme. Davranış değişmez, hız/kaynak kullanımı iyileşir. | Evet |

### 12.5.3. Scope (Kapsam)

Scope alanı, değişikliğin etkilediği alanı belirtir. Parantez içinde yazılır. Opsiyoneldir ama şiddetle önerilir; çünkü commit geçmişinde arama yaparken hangi alanın etkilendiğini hızlıca gösterir.

Kullanılabilecek scope örnekleri:

| Scope | Açıklama |
|-------|----------|
| `auth` | Kimlik doğrulama, oturum yönetimi |
| `forms` | Form yapısı, validation, form state |
| `ui` | Genel UI bileşenleri, design system |
| `tokens` | Design token'lar, renk, tipografi, spacing |
| `navigation` | Routing, navigasyon yapısı |
| `data` | Veri katmanı, API, query, cache |
| `ci` | CI/CD pipeline, GitHub Actions |
| `deps` | Dependency ekleme, güncelleme, kaldırma |
| `i18n` | Uluslararasılaştırma, çeviri |
| `a11y` | Erişilebilirlik |

Scope listesi sabit değildir; yeni alanlar gerektiğinde eklenebilir. Ancak tutarlılık önemlidir: aynı alan için farklı scope isimleri kullanma (örneğin bir yerde `auth`, başka yerde `authentication` yazma).

### 12.5.4. Açıklama Kuralları

- **Küçük harfle başlar:** `feat(auth): Login ekranı` degil, `feat(auth): login ekranı`.
- **Nokta ile bitmez:** `feat(auth): login ekranı eklendi.` degil, `feat(auth): login ekranı eklendi`.
- **Emir kipi kullanılır:** Mümkün olduğunca doğrudan, kısa ifade tercih edilir.
- **72 karakteri aşmaz:** İlk satır (type + scope + açıklama dahil) maksimum 72 karakter olmalıdır. Uzun açıklamalar body'ye yazılır.

### 12.5.5. Body (Gövde) — Opsiyonel

Body, açıklama satırından sonra bir boş satır bırakılarak yazılır. Aşağıdaki sorulara cevap verir:

- **Neden** bu değişiklik yapıldı? (Motivasyon)
- **Ne** değişti? (Teknik detay)
- Bilinen **sınırlamalar** var mı?
- Önceki davranışla **fark** nedir?

```
fix(auth): token yenileme döngüsü düzeltildi

Access token süresi dolduğunda refresh token isteği başarısız olursa
sonsuz döngüye giriyordu. Retry sayısı 3 ile sınırlandırıldı.
Başarısız retry sonrası kullanıcı login ekranına yönlendiriliyor.
```

### 12.5.6. Breaking Change (Kırılma Değişikliği)

Geriye dönük uyumsuz değişiklik yapıldığında:

1. Type'ın sonuna `!` işareti eklenir:
   ```
   feat(auth)!: session yönetimi değiştirildi
   ```

2. Body veya footer'da `BREAKING CHANGE:` etiketi ile detay yazılır:
   ```
   feat(auth)!: session yönetimi değiştirildi
   
   BREAKING CHANGE: eski session token formatı artık desteklenmiyor.
   Mevcut oturumlar geçersiz hale gelecek ve kullanıcılar yeniden
   giriş yapmak zorunda kalacak.
   ```

Breaking change çok dikkatli ele alınmalıdır. Release ve versioning etkisi olacağından `29-release-and-versioning-rules.md` ile birlikte değerlendirilmelidir.

### 12.5.7. Commitlint ile Otomatik Doğrulama

CI pipeline'ında **commitlint** aracı çalışır ve her commit mesajının Conventional Commits formatına uygunluğunu doğrular. Uyumsuz commit mesajı içeren PR merge edilemez. Bu sayede commit geçmişinin tutarlılığı garanti altına alınır.

Yerel geliştirmede de commitlint'i husky git hook'u ile entegre etmek önerilir. Bu sayede yanlış formattaki commit mesajı daha push edilmeden yakalanır.

## 12.6. PR Template

Repo'da `.github/PULL_REQUEST_TEMPLATE.md` dosyası bulunmalıdır. Bu dosya, GitHub'da yeni PR açıldığında PR açıklama alanını otomatik olarak doldurur. Bu sayede her PR aynı yapıda bilgi içerir, reviewer'ın beklentileri net olur ve eksik bilgi hemen fark edilir.

### 12.6.1. Template Yapısı

Aşağıdaki template tüm PR'larda kullanılmalıdır:

```markdown
## Ne Değişti?
[Kısa açıklama — ne yapıldı, neden yapıldı]

## İlgili Belgeler
- [ ] İlgili ADR veya standart belge referansı
- [ ] Docs sync gerekiyorsa yapıldı

## Değişiklik Türü
- [ ] Yeni özellik (feat)
- [ ] Bug düzeltme (fix)
- [ ] Refactoring
- [ ] Dependency değişikliği
- [ ] Dokümantasyon
- [ ] Diğer: ___

## Kontrol Listesi
- [ ] Typecheck geçiyor (`pnpm typecheck`)
- [ ] Lint geçiyor (`pnpm lint`)
- [ ] İlgili testler yazıldı/güncellendi
- [ ] Web ve mobile'da test edildi (cross-platform etki varsa)
- [ ] Yeni dependency eklendiyse `37-dependency-policy.md` kontrolü yapıldı
- [ ] A11y etkisi değerlendirildi
- [ ] Security etkisi değerlendirildi

## Ekran Görüntüleri / Kanıt
[Görsel veya test çıktısı]
```

### 12.6.2. Template Kullanım Kuralları

- Template'deki hiçbir bölüm silinmez. İlgili değilse “N/A” veya “Bu PR için geçerli değil” yazılır.
- Kontrol listesindeki kutucuklar dürüstçe işaretlenir. İşaretlenmemiş kutucuk, reviewer için “bu kontrol yapılmadı” anlamına gelir.
- “Ne Değişti?” bölümü tek cümle olmamalıdır. Neden bu değişiklik yapıldığı, ne etkilediği ve nasıl test edilebileceği açıklanmalıdır.
- “Ekran Görüntüleri / Kanıt” bölümü UI değişikliklerinde zorunludur. Terminal çıktısı, test sonucu veya ekran görüntüsü eklenmelidir.

## 12.7. Merge Stratejisi

### 12.7.1. Varsayılan: Squash Merge

Bu projede varsayılan merge yöntemi **squash merge**'dir.

**Neden squash merge?**
Feature branch'te geliştirme sırasında birçok ara commit oluşur: “WIP”, “fixup”, “typo fix”, “review feedback”, “deneme”, “revert deneme” gibi. Bu commit'ler geliştirme sürecinin doğal parçasıdır ama `main` branch'in tarihçesini kirletir. Squash merge, branch'teki tüm commit'leri tek bir temiz commit'e sıkıştırarak `main`'e ekler. Sonuçta `main` branch'in her commit'i anlamlı, okunabilir ve bir PR'a karşılık gelen tek commit olur.

**Squash merge commit mesajı:**
- PR başlığı commit mesajı olarak kullanılır. Bu yüzden PR başlığı Conventional Commits formatında olmalıdır (örneğin `feat(auth): login ekranı eklendi`).
- Commit body'si: PR açıklamasının özeti otomatik eklenir.

### 12.7.2. Ne Zaman Squash YAPILMAZ

Squash merge her durumda uygun olmayabilir. Aşağıdaki durumlarda farklı strateji kullanılabilir:

1. **Büyük refactoring PR'ları:** Eğer PR'daki her commit mantıksal olarak bağımsız ve anlamlı bir adımsa (örneğin: “adım 1: eski API'yi deprecate et”, “adım 2: yeni API'yi ekle”, “adım 3: consumer'ları güncelle”), bu commit geçmişini korumak değerlidir. Bu durumda **merge commit** tercih edilir.
2. **Birden fazla mantıksal değişiklik:** Tek PR'da birden fazla bağımsız değişiklik varsa (önerilmez ama bazen kaçınılmazdır), commit'leri squash etmek bilgi kaybına neden olur. Tercih: PR'ı ayırmak. Ayrılamıyorsa **merge commit** kullanılır.

### 12.7.3. Rebase Kullanımı

Branch'i `main`'e rebase etmek (`git rebase main`) temiz bir commit geçmişi sağlar ve merge commit oluşturmaz. Ancak dikkatli kullanılmalıdır:

- Rebase sonrası **force push** (`git push --force-with-lease`) gerekir. Bu, remote branch'in geçmişini yeniden yazar.
- Başka biri aynı branch üzerinde çalışıyorsa force push sorun yaratır. Rebase yalnızca kendi branch'inde ve başkasının çalışmadığı branch'lerde yapılmalıdır.
- CI'dan geçmiş bir PR'ı rebase edip tekrar CI beklemek zaman kaybı olabilir. Bu nedenle rebase, merge öncesi zorunlu tutulmaz; sadece önerilir.
- Force push **son çare** olmalıdır. Mümkünse `--force-with-lease` kullanılır (remote'da beklenmeyen değişiklik varsa push'u reddeder).

### 12.7.4. Conflict Resolution (Çakışma Çözme)

Merge conflict oluştuğunda aşağıdaki kurallar geçerlidir:

- **Conflict'i branch sahibi çözer, reviewer değil.** Conflict, branch sahibinin sorumluluğundadır. Reviewer'dan conflict çözmesini beklemek yanlıştır.
- **Conflict çözümü sonrası CI tekrar geçmelidir.** Conflict çözme sırasında hata yapılmış olabilir (yanlış satır silinmesi, mantık bozulması). CI'ın tekrar çalışıp tüm kontrolleri geçmesi zorunludur.
- **Conflict çözme yöntemi:** `main`'i branch'e merge et (`git merge main`) veya branch'i `main`'e rebase et (`git rebase main`). Hangisini tercih edeceğin duruma bağlıdır; ancak sonuçta CI geçmeli ve davranış bozulmamalıdır.

---

# 13. Contribution Türüne Göre Minimum Beklentiler

## 13.1. Feature contribution
- relevant standards okundu
- UI states düşünülmüş
- query/state/form/auth etkisi düşünülmüş
- test var
- copy/i18n etkisi düşünülmüş

## 13.2. Reusable UI contribution
- tokens/semantic roles doğru
- variant/state matrix düşünülmüş
- a11y doğrulanmış
- visual proof var
- raw style kaçakları yok

## 13.3. Foundation/runtime contribution
- ADR/doküman ilişkisi açık
- compatibility etkisi yazılmış
- audit etkisi görünür
- docs sync var

## 13.4. Dependency contribution
- `37` ve `38` kontrol edilmiş
- security/privacy etkisi değerlendirilmiş
- why-not-existing-solution açıklanmış

## 13.5. Docs contribution
- belge authority zincirine uygun
- ilgili başka belgeyi boşa düşürmüyor
- terminology drift üretmiyor

---

# 14. Kod Yazım Kuralları — Contribution Perspektifi

## 14.1. Kural
Kod, repo’daki kalite sistemine uyacak şekilde yazılmalıdır.

Bu ne demek?
- exact placement doğru olmalı
- boundary ihlali yapılmamalı
- feature logic yanlış katmana taşınmamalı
- hardcoded design decisions kaçırılmamalı
- auth/session/query/form sınırları korunmalı
- docs-first kararlar silent override edilmemeli

## 14.2. Zayıf davranışlar
- “şimdilik böyle”
- “sonra ayırırız”
- “tek yerde kullandım”
- “lint disable ile geçtim”

## 14.3. Hot Reload ve Fast Refresh Kuralları

Geliştirme deneyimi (DX) hızını doğrudan etkileyen en kritik mekanizmalardan biri Hot Module Replacement (HMR) ve Fast Refresh'tir. Bu bölüm, bu mekanizmaların nasıl çalıştığını, ne zaman kırıldığını ve nasıl verimli kullanıldığını açıklar.

### 14.3.1. Hot Module Replacement (HMR) Nedir?

HMR, bir dosya kaydedildiğinde **tüm sayfayı yeniden yüklemeden** yalnızca değişen modülü güncelleyen mekanizmadır. Bu sayede:

- **State korunur:** Geliştirme sırasında formda yazdığın veri, açtığın modal, scroll pozisyonu gibi uygulama durumları kaybolmaz.
- **Geliştirme döngüsü hızlanır:** Tam sayfa yeniden yüklemesi (full reload) genellikle birkaç saniye sürer. HMR ile değişiklik milisaniyeler içinde yansır.
- **Odak bozulmaz:** Uygulamanın belirli bir ekranında, belirli bir state'te çalışırken her değişiklikte o noktaya tekrar gitme ihtiyacı ortadan kalkar.

### 14.3.2. Vite HMR (Web)

Web geliştirmede Vite, HMR'ı varsayılan olarak aktif şekilde sağlar. `@vitejs/plugin-react` eklentisi ile React Fast Refresh entegrasyonu gelir ve component state'i korunur.

**HMR çalışmıyorsa kontrol edilecekler:**

1. **Component default export mu?** React Fast Refresh, component'in dosyadan default export veya named export olarak dışa aktarılmasını bekler. Eğer component export edilmiyorsa veya anonim fonksiyon olarak export ediliyorsa HMR düzgün çalışmayabilir.

2. **Component dosyasında non-component export var mı?** Bir dosyada hem React component hem de yardımcı fonksiyon, sabit değer veya tip tanımı export ediliyorsa, Fast Refresh o dosyada devre dışı kalabilir ve full reload'a düşer. Çözüm: Yardımcı fonksiyonları ve sabitleri ayrı dosyaya taşı. Component dosyası yalnızca component export etmeli.

3. **`vite.config.ts` doğru yapılandırılmış mı?** `@vitejs/plugin-react` eklentisinin plugins dizisine eklendiğinden emin ol. Eksikse HMR çalışmaz.

4. **Sözdizimi hatası var mı?** Dosyada sözdizimi hatası varsa HMR başarısız olur ve tarayıcıda hata overlay'i gösterilir. Hatayı düzelt, kaydet; HMR tekrar devreye girer.

### 14.3.3. Expo Fast Refresh (Mobile)

Expo'da Fast Refresh varsayılan olarak aktiftir. Component state'i korunur ve değişiklikler anında cihaz veya emulator'de yansır.

**Fast Refresh'in kırılma nedenleri:**

1. **Class component:** Fast Refresh yalnızca function component'leri destekler. Class component içeren dosyalarda Fast Refresh devre dışı kalır ve full reload yapılır. Bu proje class component kullanmaz; ancak üçüncü parti kütüphane wrapper'ları bazen class component döner. Bu durumda wrapper'ı ayrı dosyaya izole et.

2. **Dosyada birden fazla component export:** Tek dosyada birden fazla React component export ediliyorsa Fast Refresh kararsız davranabilir. Her component kendi dosyasında olmalı (bu zaten bu projenin genel kuralıdır).

3. **Higher-order component (HOC) wrapping:** `export default withAuth(MyComponent)` gibi HOC ile sarılmış export'larda Fast Refresh component'i tanıyamayabilir. Mümkünse HOC yerine custom hook veya composition pattern kullan.

4. **Module scope side effect:** Dosyanın en üst seviyesinde (component dışında) state değiştiren veya side effect üreten kod varsa, Fast Refresh bu kodu tekrar çalıştırır ve beklenmeyen davranışlara yol açabilir.

### 14.3.4. Ne Zaman Full Reload Gerekir?

Aşağıdaki durumlarda HMR/Fast Refresh yetersiz kalır ve uygulamanın tamamen yeniden yüklenmesi (full reload) gerekir:

| Durum | Neden Full Reload Gerekir |
|-------|---------------------------|
| **Context provider değişikliği** | Context value'su değiştiğinde tüm consumer tree'si yeniden render olmalıdır. HMR bunu güvenilir şekilde yapamaz. Provider dosyası değiştiğinde uygulama otomatik full reload olur. |
| **Root layout değişikliği** | Uygulamanın kök layout'u (root layout, navigation container, provider sıralaması) değiştiğinde tüm uygulama ağacı yeniden oluşturulmalıdır. |
| **Native module değişikliği** | Expo'da native modül eklendiğinde veya değiştiğinde prebuild gerekir (`npx expo prebuild`). JavaScript tarafındaki HMR native katmanı güncelleyemez. |
| **Environment variable değişikliği** | `.env` dosyasındaki değişkenler build zamanında inject edilir. Değişiklik yaptıktan sonra dev server'ı yeniden başlat (`pnpm dev` veya `pnpm dev:mobile`). |

### 14.3.5. DX (Developer Experience) İpuçları

Geliştirme sırasında verimlilik için aşağıdaki araç ve pratikler önerilir:

- **`console.log` yerine React DevTools kullan:** `console.log` hızlı bir hata ayıklama yöntemi gibi görünür ancak üretim koduna sızma riski taşır ve karmaşık state'leri izlemede yetersiz kalır. React DevTools, component tree'sini görsel olarak gösterir, prop'ları ve state'i anlık inceler, re-render'ları highlight eder.

- **Zustand DevTools middleware ile state izle:** Zustand store'larına `devtools` middleware'i eklendiğinde, tarayıcının Redux DevTools extension'ında store değişiklikleri zaman çizelgesi olarak görünür. Hangi action'ın hangi state değişikliğine yol açtığı adım adım izlenebilir. Time-travel debugging mümkün hale gelir.

- **ADR-005 kapsamında query-layer adopt edilmişse TanStack Query DevTools ile query durumlarını gör:** TanStack Query DevTools, tüm aktif query'leri, cache durumlarını (fresh, stale, fetching, error), retry sayısını ve query key'lerini görsel bir panel olarak sunar. Veri akışıyla ilgili sorunları teşhis etmede son derece etkilidir. Geliştirme modunda ekranın köşesinde bir panel olarak görünür ve production build'de otomatik devre dışı kalır.

- **Error Lens extension'ı:** IDE'de hataları ilgili satırın hemen yanında gösterir. Sorunlar panel'e gitmeden fark edilir, düzeltme hızlanır.

- **Terminal çıktısını takip et:** Vite ve Expo dev server'ları terminal'de anlık bilgi verir: HMR güncellemeleri, derleme süreleri, uyarılar, hatalar. Terminal çıktısını düzenli kontrol etmek, fark edilmeyen sorunları erken yakalar.

---

# 15. Quality Gates Öncesi Kişisel Sorumluluk

## 15.1. Kural
CI yakalarsa görürüz yaklaşımı zayıftır.

## 15.2. Katkı sahibi merge öncesi en az şunları düşünmelidir
- lint
- typecheck
- relevant tests
- visual proof (gerekiyorsa)
- docs impact
- dependency impact
- compatibility impact

## 15.3. Not
Her şeyi mekanik komut listesine indirmiyoruz.  
Ama kalite sorumluluğu yalnızca CI’a bırakılmaz.

---

# 16. Review Ne Beklemeli?

Reviewer en az şu soruları sormalıdır:

1. Bu iş doğru katmanda mı?
2. İlgili belge/ADR okundu mu?
3. Docs sync gerekip atlanmış mı?
4. New dependency/package kararı doğru süreçten geçmiş mi?
5. Compatibility etkisi var mı?
6. Test ve proof yeterli mi?
7. Cross-platform parity bozuluyor mu?
8. Security/observability/a11y riskleri düşünülmüş mü?

## 16.1. Reviewer ne yapmamalı?
- contributor yerine tüm bağlamı sıfırdan çıkarmaya çalışmak
- belgesiz büyük değişikliği tahmin ederek onaylamak
- “çalışıyor gibi” diye governance ihlalini görmezden gelmek

---

# 17. Audit Bulgusu Sonrası Contribution

## 17.1. Kural
Audit remediation da contribution sürecine tabidir.

## 17.2. Özellikle gerekli olanlar
- bulgu sınıfı
- root cause
- hangi belge/ADR’ye dayanarak düzelttiği
- tekrar olmaması için ne eklendiği

Audit fix de docs/guideline etkisi doğurabilir.

---

# 18. Small Change Yanılgısı

## 18.1. Kural
Aşağıdaki işler küçük görünebilir ama süreç açısından küçük değildir:

- new dependency
- new package
- auth flow değişikliği
- token/theming change
- route contract change
- compatibility-affecting upgrade
- Sentry/analytics payload change

## 18.2. Sonuç
“Ufak işti” bahanesi burada geçmez.

---

# 19. Release Etkisi Olan Katkılar

Aşağıdaki katkılar `29-release-and-versioning-rules.md` açısından özel dikkat ister:

- stack-sensitive upgrade
- observability/security changes
- auth/session changes
- route/flow breaking changes
- token/theme contract changes
- package public API changes

PR’da release impact explicit yazılmalıdır.

---

# 20. Contribution Anti-Pattern Listesi

Aşağıdaki davranışlar bu repo’da doğrudan zayıf kabul edilir:

1. Belge okumadan işe başlamak
2. New dependency ekleyip süreç çalıştırmamak
3. New package açıp justification vermemek
4. Docs sync gereken işte docs güncellememek
5. Reviewer’a sürpriz architectural değişiklik bırakmak
6. Compatibility etkisini hiç düşünmemek
7. Canonical stack’i sessizce delmek
8. “Küçük değişiklik” bahanesiyle kural ihlali yapmak
9. Audit bulgusunu yalnızca lokal patch ile geçiştirmek
10. Security/observability/a11y etkisini yok saymak

---

# 21. AI Destekli Katkı Süreci

AI araçları bu repo’daki katkı sürecinin aktif parçasıdır. Detaylı AI workflow kuralları `40-ai-workflow-and-tooling.md` tarafından yönetilir; bu bölüm katkı süreciyle doğrudan ilgili kuralları tanımlar.

## 21.1. MoAI-ADK ile İş Başlatma

Karmaşık görevlerde (yeni feature, yeni modül, mimari değişiklik):

1. `/moai plan` ile SPEC oluştur (EARS formatında)
2. SPEC’in canonical kararlarla (ADR seti) tutarlılığını doğrula
3. `/moai run <SPEC-ID>` ile implement et
4. `/moai sync <SPEC-ID>` ile dokümanları senkronize et

Basit görevlerde (bug fix, küçük düzeltme) SPEC zorunlu değildir. Görev karmaşıklığına göre araç kullanım eşiği için `40-ai-workflow-and-tooling.md` bölüm 7’ye bakınız.

## 21.2. Stitch ile Arayüz Tasarımı

Yeni ekran veya component tasarımında:

1. Stitch’te tasarım oluştur (mevcut DESIGN.md ile tutarlı)
2. DESIGN.md’yi güncelle veya yeni export al
3. stitch-to-react skill veya Claude Code ile component üret
4. Üretilen token’ları `22-design-tokens-spec.md` katmanlarıyla eşle

DESIGN.md elle düzenlenmez; değişiklik Stitch’te yapılır. DESIGN.md ile `22-design-tokens-spec.md` çelişirse 22 kazanır.

## 21.3. Codex Review Süreci

PR review’da:

1. `@codex review` ile bağımsız denetim talep et (veya otomatik review aktifse bekle)
2. Codex, AGENTS.md’deki review guidelines’a göre denetler
3. P0/P1 bulguları merge-blocking kabul edilir
4. Bulgular Claude Code ile düzeltilir, yeniden review tetiklenir
5. Codex bulgusu ile Claude Code önerisi çelişirse → boilerplate dokümanı hakemdir

Codex review kademeli tetiklenir: shared kod ve büyük değişikliklerde otomatik; küçük fix’lerde isteğe bağlı.

## 21.4. Talimat Dosyası Güncelleme Zorunluluğu

Aşağıdaki değişikliklerde talimat dosyaları da güncellenmelidir:

- Canonical katmanda değişiklik → CLAUDE.md + AGENTS.md güncelle
- Design system değişikliği → DESIGN.md Stitch’te yeniden export et
- Yeni modül/package ekleme → CLAUDE.md dosya organizasyonu güncelle
- Yeni denetim kuralı → AGENTS.md review guidelines güncelle
- Yeni ADR kararı → tüm talimat dosyaları güncelle

Talimat dosyası güncellemesi yapılmadan PR merge edilmez.

## 21.5. AI Güvenlik Kuralları (Katkı Sürecinde)

- AI aracına `.env`, secret veya credential dosyalarını okutmamak katkıda bulunanın sorumluluğundadır
- `.claudeignore` dosyası korunmalıdır
- Stitch’e yüklenen tasarımlarda gerçek kullanıcı verisi kullanılmamalıdır
- `27-security-and-secrets-baseline.md` kuralları AI araçları için de geçerlidir

---

# 22. AI Guardrail-Aware Contribution Akışı

AI araçları ile yapılan katkılarda guardrail çerçevesine uyum zorunludur (`47-ai-guardrail-governance.md`).

## 22.1. Katkı Öncesi

1. İş türünü belirle → ilgili aktivite guardrail'ini oku
2. Tetiklenen domain guardrail'leri oku
3. CLAUDE.md'deki guardrail protokolünü uygula

## 22.2. Katkı Sırasında

- Universal guardrail kurallarına uy (hardcoded değer yasak, any yasak, import yönü, i18n)
- Domain guardrail kontrol listesini takip et
- İhlal varsa düzelt veya exception kaydı aç (44)

## 22.3. PR Öncesi

- `/pre-pr` skill'i ile kalite kontrolü yap (önerilen)
- Guardrail kontrol listesini doğrula
- Visual proof ekle (UI değişikliği varsa)

## 22.4. Review Sırasında

- Codex review guardrail compliance bölümünü kontrol et
- Guardrail ihlali P0/P1 ise merge edilmez
- Exception gerekiyorsa review'da belirle, kaydını aç

---

# 23. Onay Kriterleri

Bu belge yeterli kabul edilir eğer:

1. Contribution artık canonical stack-aware süreç olarak tanımlanmışsa
2. dependency / package / ADR / docs sync / compatibility etkileri açık kurala bağlanmışsa
3. reviewer ve contributor beklentileri netse
4. small change bahanesiyle kural delmeye kapı bırakmıyorsa
5. `37`, `38`, ADR seti ve release/audit/DoD belgeleri ile açık bağ kuruyorsa
6. günlük repo çalışması için gerçek operasyonel sözleşme olabilecek netlikteyse
7. AI destekli katkı süreci, araç eşikleri ve talimat dosyası güncelleme zorunluluğu tanımlanmışsa

---

# 23. Kısa Sonuç

Bu repo’da katkı yapmak şu anlama gelir:

- önce doğru belge bağlamını okumak
- mevcut canonical kararları ihlal etmemek
- gerekiyorsa ADR/dependency/compatibility sürecini işletmek
- doğru katmanda çalışmak
- docs sync etkisini kapatmak
- kalite kanıtı ile PR açmak
- AI araçlarını görev eşiğine göre kullanmak ve talimat dosyalarını güncel tutmak

Yani contribution, kod yazmaktan daha geniş ve daha disiplinli bir iştir.

---

# 24. İlk Katkı Rehberi (2026-04-02 Eki)

Yeni katılımcılar için başlangıç rehberi. Bu bölüm, ilk kez katkıda bulunacak geliştiricilerin hızla üretken olmasını sağlar.

## 24.1. Ortam Kurulumu

| Araç | Gerekli Versiyon | Kurulum |
|------|-----------------|---------|
| Node.js | 22.x LTS | `nvm install 22` |
| pnpm | 10.x | `corepack enable && corepack prepare pnpm@latest --activate` |
| Git | 2.40+ | Platform paket yöneticisi ile |
| VS Code | Latest | [code.visualstudio.com](https://code.visualstudio.com) |

VS Code önerilen eklentiler (`.vscode/extensions.json`'da tanımlıdır):
- ESLint
- Prettier
- Tailwind CSS IntelliSense
- TypeScript Importer
- Error Lens

## 24.2. Repo Clone ve Kurulum

```bash
git clone <REPO_URL> boilerplate
cd boilerplate
pnpm install
pnpm dev:web        # Web development server
pnpm dev:mobile     # Mobile development server (Expo)
pnpm typecheck      # TypeScript kontrolü
pnpm lint           # Lint kontrolü
pnpm test           # Test suite
```

Tümü hatasız geçmelidir. Sorun olursa `docs/onboarding/ilk-30-dakika.md`'ye bakın.

## 24.3. İlk Görev Seçimi

`good-first-issue` etiketli issue'lar yeni katılımcılar için uygundur.

**Good-first-issue kriterleri:**
- Tek dosya değişikliği yeterli
- Test yazmayı gerektirmiyor (opsiyonel, yazılırsa bonus)
- Doküman düzeltmesi veya küçük UI iyileştirmesi
- Context yükü düşük (tek bir component veya modül)
- Mevcut pattern'i takip ederek çözülebilir

## 24.4. İlk PR Süreci

1. **Issue'yu kendine ata:** GitHub'da "Assign yourself" butonuna tıkla.
2. **Feature branch oluştur:** `git checkout -b feature/issue-XX-kisa-aciklama`
3. **Değişiklikleri yap:** İlgili guardrail'leri oku, canonical kararları takip et.
4. **Lokal doğrulama:** `pnpm typecheck && pnpm lint && pnpm test`
5. **PR aç:** PR template'ini eksiksiz doldur. Değişiklik açıklaması, test planı ve varsa ekran görüntüsü ekle.
6. **CI kontrollerini bekle:** Tüm CI adımları yeşil olmalı.
7. **Review feedback'e göre düzelt:** Reviewer yorumlarını ele al, gerekli değişiklikleri yap.
8. **Merge onayı al:** En az 1 reviewer onayı gereklidir.

## 24.5. Sık Yapılan Hatalar

| Hata | Doğrusu | Referans |
|------|---------|----------|
| Guardrail kontrolü yapmadan PR açmak | `/guardrail-check` ile kontrol et | `47-ai-guardrail-governance.md` |
| Hardcoded renk/spacing değeri kullanmak | Semantic token kullan | `22-design-tokens-spec.md` |
| i18n key yerine direkt metin yazmak | i18n namespace'ten key kullan | ADR-011 |
| Test dosyası eklememek | `*.test.ts(x)` kaynak dosyanın yanına | `14-testing-strategy.md` |
| `any` tipi kullanmak | Doğru TypeScript tipini yaz | `36-canonical-stack-decision.md` |
| Import yönünü ihlal etmek (packages→apps) | Yalnızca apps→packages yönünde import | `07-module-boundaries-and-code-organization.md` |

---

# 25. AI Agent Contribution Kuralları (2026-04-02 Eki)

Claude Code, Codex CLI gibi AI araçlarının PR açarken uyması gereken kurallar.

## 25.1. Tanımlama Zorunluluğu

- AI tarafından üretilen PR'lar açıkça belirtilir: PR description'da "AI-assisted" veya "AI-generated" notu bulunmalıdır.
- PR label'ı: `ai-assisted` label'ı eklenir.
- Commit mesajında AI aracı belirtilmez; ancak PR seviyesinde görünürlük sağlanır.

## 25.2. Review Kuralları

- AI PR'ları normal review sürecinden muaf değildir.
- Tüm AI PR'ları en az 1 human review gerektirir. Karmaşık değişiklikler 2 reviewer.
- Reviewer, AI'ın ürettiği kodu insan yazılmış kod standartlarıyla değerlendirir.
- AI'ın ürettiği kodda guardrail ihlali varsa PR bloklanır.

## 25.3. Boyut Limiti

- AI PR boyut limiti: Maksimum 500 satır değişiklik.
- 500 satırı aşan değişiklikler, mantıksal birimlere bölünerek ayrı PR'lar halinde açılmalıdır.
- Bölme stratejisi: Foundation/types → Core logic → UI/tests sıralamasıyla stacked PR (bkz. `42-branching-and-merge-strategy.md`).

## 25.4. Zorunlu PR Bölümleri

AI PR'larında aşağıdaki bölümler description'da bulunmalıdır:

1. **Değişiklik özeti:** Ne değişti, neden değişti.
2. **Test planı:** Hangi testler eklendi/çalıştırıldı.
3. **Guardrail kontrol sonucu:** `/guardrail-audit` çıktısı veya özeti.
4. **Etkilenen dokümanlar:** Hangi dokümanlar güncellendi veya güncellenmeli.

## 25.5. Yasaklar

- AI'ın doğrudan `main` branch'e commit yapması yasaktır.
- AI'ın force push yapması yasaktır.
- AI'ın `.env`, credential veya secret dosyalarını okuması veya değiştirmesi yasaktır.
- AI'ın canonical stack kararlarını değiştiren değişiklik yapması (ADR gerektiren) yasaktır; önce insan onayı gerekir.
