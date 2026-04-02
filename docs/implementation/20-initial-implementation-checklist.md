# 20-initial-implementation-checklist.md

## Doküman Kimliği

- **Doküman adı:** Initial Implementation Checklist
- **Dosya adı:** `20-initial-implementation-checklist.md`
- **Doküman türü:** Checklist / execution plan / implementation readiness document
- **Durum:** Accepted
- **Tarih:** 2026-03-31
- **Kapsam:** Bu belge, canonical karar seti kapandıktan sonra ilk fiziksel repo bootstrap ve controlled boilerplate implementation sürecinde hangi işlerin hangi sırayla yapılacağını, her adımın “done” sayılması için hangi kanıtların gerektiğini ve hangi adımlar tamamlanmadan sonraki faza geçilemeyeceğini tanımlar.
- **Bağlı olduğu üst dokümanlar:**
  - `17-technology-decision-framework.md`
  - `19-roadmap-to-implementation.md`
  - `21-repo-structure-spec.md`
  - `37-dependency-policy.md`
  - `38-version-compatibility-matrix.md`
  - `ADR-001` → `ADR-019`
- **Doğrudan etkileyeceği dokümanlar:**
  - `22-design-tokens-spec.md`
  - `23-component-governance-rules.md`
  - `30-contribution-guide.md`
  - `31-audit-checklist.md`
  - `32-definition-of-done.md`
  - `35-document-map.md`

---

# 1. Bu Dokümanın Revize Edilme Nedeni

Önceki versiyon genel bir implementation checklist idi.  
Şimdi artık şu alanlar karar olarak kapanmıştır:

- monorepo/workspace yönü
- core runtime zinciri
- state/data/forms yönü
- styling/theming yönü
- testing yönü
- observability yönü
- auth/session yönü
- i18n yönü
- dependency governance
- compatibility matrix

Bu yüzden checklist artık:
- “ne seçelim?” değil,
- “karar verilmiş stack’i hangi sırayla uygularız?” belgesidir.

Yani bu belge artık keşif değil, **uygulama sırası** belgesidir.

---

# 2. Amaç

Bu dokümanın amacı, ilk gerçek boilerplate implementasyonunu:

- hızlı ama düzensiz kurulum,
- klasör açma tatmini,
- eksik kalite kapıları,
- erken feature üretimi,
- guideline olmadan dependency yağışı

gibi hatalardan koruyup;  
**kanıta dayalı, fazlı ve kontrollü başlangıç** haline getirmektir.

Bu belge şu sorulara net cevap verir:

1. İlk teknik adım ne olmalı?
2. Exact Node/pnpm/Turbo/React/Expo/Vite hatları ne zaman uygulanmalı?
3. Repo topolojisi hangi sırayla kurulmalı?
4. Design tokens ve theme foundation ne zaman gelmeli?
5. UI package, app shells ve navigation ne zaman kurulmalı?
6. Query/auth/i18n/observability foundations hangi fazda devreye girmeli?
7. Vertical slice ne zaman meşru hale gelir?
8. “Done” kanıtı olmadan işaretlenmemesi gereken maddeler hangileri?

---

# 3. Checklist Kullanım Kuralı

Her madde için üç statü düşünülür:

- **Not started**
- **In progress**
- **Done**

Ama burada en kritik kural şudur:

> **Done = dosya açıldı veya paket kuruldu demek değildir.  
> Done = kabul kriterleri sağlandı, ilgili kalite sinyali üretildi ve sonraki faz için güvenilir zemin oluştu demektir.**

Bu belge “işaretle geç” listesi gibi kullanılmamalıdır.

---

# 4. Başlamadan Önce Zorunlu Önkoşullar

Aşağıdakiler sağlanmadan checklist teknik olarak başlatılamaz:

- `19-roadmap-to-implementation.md` içindeki document synchronization tamamlanmış olmalı
- full consistency audit yapılmış olmalı
- `21-repo-structure-spec.md` exact başlangıç topolojisini vermiş olmalı
- `37-dependency-policy.md` ve `38-version-compatibility-matrix.md` kabul edilmiş olmalı
- `ADR-001` → `ADR-019` tek canonical karar katmanı olarak kabul edilmiş olmalı

Bu önkoşullar yoksa checklist kullanımı erkendir.

> **Not:** `39-default-screens-and-components-spec.md` bootstrap sırasını (Bölüm 19) takip et. Her fazda hangi component ve ekranların açılması gerektiği bu belgede tanımlanmıştır.

---

# 5. Faz A — Environment and Toolchain Lock

## 5.1. Amaç
Repo bootstrap başlamadan önce exact çalışma zemini sabitlenmelidir.

## 5.2. Yapılacak işler

- [ ] **Scaffold script:** Eğer boilerplate scaffold script'i mevcutsa (`scripts/bootstrap.sh` veya `npx create-boilerplate-app`), önce bu script çalıştırılarak temel repo yapısı, config dosyaları ve starter package'lar otomatik oluşturulur. Script yoksa aşağıdaki adımlar manuel olarak takip edilir. Detay: `43-derived-project-creation-guide.md`.
- [ ] Node baseline `20.19.x` hattı repo standardı olarak kilitlendi
- [ ] pnpm install güvenlik baseline'ı (`minimumReleaseAge`, `allowBuilds`, `trustPolicy`) workspace config düzeyinde tanımlandı
- [ ] `tooling/pnpm/pnpm-workspace.security.example.yaml` referans alınarak gerçek config artefaktı üretildi
- [ ] `expo-doctor` temiz geçti ve React Native Directory uyarıları gözden geçirildi
- [ ] Mobile theme bootstrap için `userInterfaceStyle: "automatic"` ve gerekli durumda `expo-system-ui` doğrulandı
- [ ] mobile development build fiziksel cihaz veya emülatörde açıldı (Expo Go kanıt sayılmaz)
- [ ] pnpm `10.x` hattı workspace standardı olarak kilitlendi
- [ ] Turborepo `2.x` hattı orchestrator standardı olarak kilitlendi
- [ ] TypeScript `5.9.x` baseline’ı kabul edildi
- [ ] local ve CI için aynı baseline prensibi belgelendi
- [ ] `.nvmrc` / `.node-version` / eşdeğer runtime hint dosyası belirlendi
- [ ] package manager ve workspace kuralları root düzeyinde görünür kılındı

## 5.3. Done kanıtı
- root toolchain açıklaması var
- local bootstrap akışı deterministic
- CI image/runtime ile local baseline çelişmiyor
- contributor için “hangi Node/pnpm hattını kullanacağım?” belirsiz değil

## 5.4. Kırmızı bayrak
Faz A kapanmadan paket kurmaya başlamak.

---

# 6. Faz B — Root Repo Bootstrap

## 6.1. Amaç
Monorepo fiziksel olarak ayağa kaldırılmalıdır.

## 6.2. Yapılacak işler

- [ ] repo root metadata dosyaları oluşturuldu
- [ ] `apps/`, `packages/`, `docs/`, `project/`, `tooling/`, `scripts/` üst alanları açıldı
- [ ] workspace tanımı root seviyede aktif
- [ ] lockfile ve root package manifest deterministic
- [ ] `.gitignore`, env template ve temel repo hijyeni dosyaları yerleşti
- [ ] docs alanı repo citizen olarak bağlandı
- [ ] ADR alanı fiziksel olarak açıldı

## 6.3. Done kanıtı
- workspace komutları çalışıyor
- root topoloji `21-repo-structure-spec.md` ile çelişmiyor
- repo “tek uygulama klasörü” gibi görünmüyor
- docs/adr fiziksel olarak gerçek yerinde
- project/ alanı açık ve proje dökümanları için hazır

---

# 7. Faz C — Core Config Packages and Root Config

## 7.1. Amaç
Config ve governance yüzeyi fiziksel olarak kurulmalıdır.

## 7.2. Yapılacak işler

- [ ] `packages/config-typescript` veya eşdeğer config alanı kuruldu
- [ ] `packages/config-eslint` veya eşdeğer config alanı kuruldu
- [ ] root tsconfig ve app/package tsconfig ilişki modeli kuruldu
- [ ] eslint flat config / shared config zinciri uygulandı
- [ ] prettier veya equivalent formatting standardı sabitlendi
- [ ] root scripts ve turbo tasks ilk versiyonuyla bağlandı

## 7.3. Done kanıtı
- typecheck çalışıyor
- lint çalışıyor
- config duplications oluşmamış
- config ailesi root ve package/app düzeyinde anlaşılır

---

# 8. Faz D — Quality Gates Minimum Activation

## 8.1. Amaç
Kod üretimi büyümeden önce kalite kapıları çalışmalıdır.

## 8.2. Yapılacak işler

- [ ] typecheck CI’da aktif
- [ ] lint CI’da aktif
- [ ] minimum test step CI’da aktif
- [ ] build sanity en az web/mobile shell düzeyinde düşünülmüş
- [ ] boundary enforcement ilk versiyonu aktif
- [ ] dependency hygiene review kuralı yazılı hale getirildi
- [ ] local verify komutu veya eşdeğeri var

## 8.3. Done kanıtı
- kalite kapıları yalnızca belgede değil, komut olarak çalışıyor
- kırık type/lint/test merge öncesi görünür
- boundary ihlali görünmez kalmıyor

## 8.4. Kırmızı bayrak
“Şimdilik CI’yı sonra kurarız.”

---

# 8.5. Faz D.5 — New Architecture Readiness Check

## 8.5.1. Amac
Expo SDK 55 ile New Architecture (Fabric, JSI, TurboModules) varsayilan ve kapatılamaz hale gelmistir. Dependency installation'dan once tum third-party kutuphanelerin New Architecture ile uyumlu oldugu dogrulanmalidir.

## 8.5.2. Yapilacak isler

- [ ] `npx expo-doctor` calistirilarak tum dependency'lerin New Architecture uyumlulugu dogrulandi. Herhangi bir "incompatible" uyarisi varsa ilgili kutuphane icin alternatif planlandı.
- [ ] TurboModules gerektiren native moduller tespit edildi. Legacy Bridge-only moduller listelendi ve migration plani olusturuldu veya JSI tabanli alternatifleri belirlendi.
- [ ] Fabric uyumsuz third-party component'ler belirlendi. Ozellikle native view manager tabanli eski component'ler (orn. eski harita, video, grafik kutuphaneleri) Fabric uyumlu versiyonlariyla veya alternatifleriyle degistirildi.
- [ ] Hermes bytecode compilation dogrulandi. `npx react-native info` ciktisinda Hermes'in aktif oldugu ve bytecode precompilation'in calıstıgı goruldu.
- [ ] JSI tabanli kutuphanelerin versiyonlari New Architecture ile uyumlu:
  - [ ] `react-native-reanimated` 4.x (JSI + Fabric uyumlu)
  - [ ] `react-native-mmkv` 3.x (JSI tabanli)
  - [ ] `@shopify/flash-list` (Fabric uyumlu)
  - [ ] `react-native-gesture-handler` 2.x (Fabric uyumlu)
  - [ ] `@gorhom/bottom-sheet` (Fabric uyumlu versiyon dogrulandi)
- [ ] React Native Directory (reactnative.directory) uzerinden kullanilacak tum third-party paketlerin "New Architecture" badge'i kontrol edildi.
- [ ] Uyumsuz paketler icin fallback plani (alternatif kutuphane, custom bridge wrapper, veya feature erteleme) belgelendi.

## 8.5.3. Done kaniti
- `expo-doctor` temiz gecti (critical uyari yok)
- Tum canonical dependency'ler New Architecture uyumlu
- Uyumsuz paketler icin yazili alternatif plani mevcut
- Hermes aktif ve bytecode compilation calisiyor
- Fabric renderer devrede ve test build'de crash yok

## 8.5.4. Kirmizi bayrak
New Architecture uyumluluğu dogrulanmadan dependency installation'a gecmek. Bu, runtime'da beklenmedik crash'lere, performance sorunlarina ve debug edilmesi zor hatalara yol acar.

---

# 8.6. Automated Bootstrap Recetesi

## 8.6.1. Amac

Checklist maddelerinin buyuk bolumu tekrar eden, deterministik ve otomatize edilebilir islerdir. Manuel adim adim ilerlemek hem zaman kaybettirir hem de hata riskini artirir. Bu bolum, checklist adimlarini mumkun oldugunca otomatize eden yaklasimi tanimlar.

## 8.6.2. Scaffold Generator Stratejisi

Turborepo'nun `turbo gen` ozelligii veya custom plop generator kullanilarak tekrar eden scaffold islemleri otomatize edilir:

| Islem | Otomasyon Araci | Aciklama |
|-------|----------------|----------|
| Yeni workspace package olusturma | `turbo gen` veya `plop` | `pnpm gen:package <paket-adi>` komutu ile `packages/<paket-adi>/` altinda `package.json`, `tsconfig.json`, `src/index.ts` ve `__tests__/` dizini olusturulur |
| Yeni app olusturma | `turbo gen` | `pnpm gen:app <app-adi>` komutu ile `apps/<app-adi>/` altinda canonical app shell yapisi olusturulur |
| Yeni feature modulu olusturma | `plop` veya custom script | `pnpm gen:feature <feature-adi>` komutu ile feature dizin yapisi (ui/, state/, data/, tests/) ve barrel file olusturulur |
| Config dosyalari kopyalama | Shell script | `tsconfig.json`, `eslint.config.js`, `.prettierrc` sablonlari kaynak dizinden hedef dizine kopyalanir |

## 8.6.3. Template Dosyalari

Her generator template'i su dosyalari icerir:

**Package template:**
```
packages/<paket-adi>/
├── package.json          # @project/<paket-adi> scope'u, "private": true
├── tsconfig.json         # tsconfig.base.json'u extend eder
├── src/
│   └── index.ts          # barrel export dosyasi
└── __tests__/
    └── index.test.ts     # ilk test dosyasi
```

**Feature module template:**
```
apps/<app>/src/features/<feature>/
├── index.ts              # public surface (barrel export)
├── ui/                   # screen ve component dosyalari
├── state/                # feature-local state (Zustand slice veya hook)
├── data/                 # query hook'lari ve mappers
└── __tests__/            # feature testleri
```

## 8.6.4. Idempotent Calistirma

Her generator ve script **idempotent** olmalidir: ayni komutu ikinci kez calistirmak hata uretmemeli, mevcut dosyalari ezMemeli ve ayni sonucu vermeli. Bu, CI/CD pipeline'inda ve tekrar eden bootstrap senaryolarinda guvenli calistirmayi garanti eder.

Idempotent davranis su sekilde saglanir:
- Dosya olusturulmadan once varlik kontrolu yapilir (`if not exists`)
- Mevcut dosya degistirilmez, sadece eksik dosyalar olusturulur
- Basarili tamamlama mesaji ile hangi dosyalarin olusturuldugu, hangilerinin atlandigi raporlanir

---

# 9. Faz E — Canonical Dependency Installation Pass

## 9.1. Amaç
Karar verilmiş çekirdek teknoloji omurgası kontrollü biçimde repo’ya alınmalıdır.

## 9.2. Yapılacak işler

### Web chain
- [ ] React `19.2.x`
- [ ] React DOM `19.2.x`
- [ ] Vite `8.x`
- [ ] React Router `7.x`
- [ ] React Router data-router / `RouterProvider` root entry standardı kabul edildi
- [ ] React Router resmi Vite plugin / route-module-capable bootstrap yolu değerlendirildi ve tercih kayda geçirildi

### Mobile chain
- [ ] Expo SDK `55.x`
- [ ] React Native `0.83.x`
- [ ] React Native Web `0.21.x`

### State/data/forms
- [ ] Zustand baseline
- [ ] ADR-005 uyarınca server-state complexity threshold değerlendirildi; TanStack Query `5.x` adopt/omit kararı yazılı kayda geçirildi
- [ ] React Hook Form `7.x`
- [ ] Zod `4.x`

### Styling
- [ ] Tailwind CSS `4.x`
- [ ] NativeWind `5.x` release status doğrulandı
- [ ] NativeWind hâlâ pre-release ise written fallback/candidate kararı açıldı
- [ ] semantic token consumption pipeline için gerekli çekirdek bağımlılıklar

### Testing
- [ ] Vitest `4.x`
- [ ] Jest `30.x`
- [ ] Playwright `1.58.x` track
- [ ] React Compiler default-off watch policy kayda geçirildi
- [ ] Biome 2.x için pilot/watchlist kararı kayda geçirildi (default replacement yok)
- [ ] Testing Library family

### Observability / i18n
- [ ] Sentry baseline packages
- [ ] i18next `26.x`
- [ ] react-i18next `17.x`

## 9.3. Done kanıtı
- install sonrası peer chaos yok
- compatibility matrix dışı major/minor yok
- hiçbir çekirdek alanda ikinci alternatif paket yok
- dependency tree `37-dependency-policy.md` ile çelişmiyor

---

# 10. Faz F — Docs and Governance Runtime Binding

## 10.1. Amaç
Docs yalnızca klasörde durmamalı; repo akışına bağlanmalıdır.

## 10.2. Yapılacak işler

- [ ] `docs/` iç organizasyonu gerçek kullanıma göre kuruldu
- [ ] `docs/adr/` alanı aktif
- [ ] document map güncel kopyası yerinde
- [ ] contribution ve audit belgelerine referans veren root/readme yönlendirmesi var
- [ ] docs güncelleme zorunluluğu contribution flow içinde görünür
- [ ] AI araç bootstrap:
  - [ ] CLAUDE.md proje kökünde oluşturuldu ve canonical kararlar doğru yansıtıldı
  - [ ] AGENTS.md proje kökünde oluşturuldu ve review guidelines tanımlandı
  - [ ] .claudeignore dosyası oluşturuldu (.env*, *.pem, *.key, credentials.* vb.)
  - [ ] moai init çalıştırıldı — mevcut CLAUDE.md korundu, .claude/ merge edildi
  - [ ] Stitch MCP yapılandırıldı (.claude/settings.json)
  - [ ] Codex GitHub app repo'ya eklendi
  - [ ] İlk doğrulama: /moai project çalışıyor, Stitch MCP bağlanıyor, @codex review yanıt veriyor

## 10.3. Done kanıtı
- yeni biri repo’ya girdiğinde docs’in nerede ve niçin olduğu belli
- kararlar chat hafızasında değil docs alanında bulunabiliyor

---

# 11. Faz G — Design Tokens Package Foundation

## 11.1. Amaç
Styling başlamadan token otoritesi kurulmalıdır.

## 11.2. Yapılacak işler

- [ ] `packages/design-tokens` oluşturuldu
- [ ] raw palette tanımlandı
- [ ] semantic color roles tanımlandı
- [ ] spacing scale tanımlandı
- [ ] typography scale tanımlandı
- [ ] radius/border/motion token temeli tanımlandı
- [ ] token export surface netleştirildi
- [ ] theme/runtime tüketim yönü belgelendi

> **Component/ekran referansı:** `39-default-screens-and-components-spec.md` Bölüm 19 Faz 0. Token dosyaları (raw palette, semantic roles, spacing/typography/radius/motion scale) bu fazda oluşturulur.

## 11.3. Done kanıtı
- tokenlar gerçek tüketim yüzeyi sunuyor
- component yazarken hardcoded değer yerine başvurulacak sistem hazır
- raw vs semantic ayrımı fiziksel olarak görünür

---

# 12. Faz H — Theme Runtime Foundation

## 12.1. Amaç
Web ve mobile için semantik theme runtime zemini kurulmalıdır.

## 12.2. Yapılacak işler

### Web
- [ ] CSS variable / semantic variable strategy uygulandı
- [ ] light/dark switching temeli çalışıyor
- [ ] semantic roles web runtime’da tüketilebiliyor

### Mobile
- [ ] semantic token mapping mobile runtime’a bağlandı
- [ ] NativeWind consumption strategy çalışıyor
- [ ] light/dark switching mobile shell’de çalışıyor

### Quality baseline component’leri
- [ ] ErrorBoundary (C53) kuruldu
- [ ] AuthGuard (C54) kuruldu
- [ ] ScreenContainer (C47) kuruldu

> **Component/ekran referansı:** `39-default-screens-and-components-spec.md` Bölüm 19 Faz 2. ErrorBoundary, AuthGuard ve ScreenContainer bu fazda kurulur.

## 12.3. Done kanıtı
- en az bir temel surface/text/border semantic’i iki platformda da çalışıyor
- raw color kullanmadan tema değişimi gözlemlenebiliyor
- ErrorBoundary (C53), AuthGuard (C54) ve ScreenContainer (C47) temel düzeyde çalışıyor olmalıdır

---

# 13. Faz I — UI Package Foundation

## 13.1. Amaç
`packages/ui` gerçek reusable foundation haline getirilmelidir.

## 13.2. Yapılacak işler

- [ ] `packages/ui` açıldı
- [ ] primitives alanı kuruldu
- [ ] en az şu primitives ilk versiyonuyla hazır:
  - text
  - heading
  - box/surface
  - stack/inline layout primitive
  - pressable/button foundation
  - field shell foundation
- [ ] Tier 1 primitive seti (12 adet, C01-C12) açıldı:
  - Text (C01), Heading (C02), Box (C03), Stack (C04), Inline (C05), Spacer (C06), Pressable (C07), Icon (C08), Divider (C09), ScrollContainer (C10), SafeAreaContainer (C11), KeyboardAvoidingContainer (C12)
- [ ] token/theme bağı aktif
- [ ] a11y minimumları primitive seviyede düşünüldü
- [ ] raw style escape hatch’leri görünür hale geldi

> **Component/ekran referansı:** `39-default-screens-and-components-spec.md` Bölüm 11 (primitive katalog) ve Bölüm 19 Faz 1. 12 primitive bu fazda açılır.

## 13.3. Done kanıtı
- primitives gerçek ekran yazımında kullanılabilir
- primitive layer feature logic taşımıyor
- theme ve token consumption doğrulanmış
- Tier 1 primitive seti (Text, Heading, Box, Stack, Inline, Spacer, Pressable, Icon, Divider, ScrollContainer, SafeAreaContainer, KeyboardAvoidingContainer) render edilebilir durumda olmalıdır

---

# 14. Faz J — Apps Skeleton

## 14.1. Amaç
`apps/web` ve `apps/mobile` canonical shell yönüyle ayağa kaldırılmalıdır.

## 14.2. Yapılacak işler

### apps/web
- [ ] Vite app shell ayağa kalktı
- [ ] root providers bağlandı
- [ ] theme provider bağlandı
- [ ] i18n provider bağlandı
- [ ] query client root bağlandı
- [ ] router root bağlandı
- [ ] error boundary / Sentry baseline bağlandı

### apps/mobile
- [ ] Expo app shell ayağa kalktı
- [ ] root providers bağlandı
- [ ] safe area foundation aktif
- [ ] theme provider bağlandı
- [ ] i18n provider bağlandı
- [ ] query client root bağlandı
- [ ] navigation root bağlandı
- [ ] error boundary / Sentry baseline bağlandı

## 14.3. Done kanıtı
- iki app shell de boş ama doğru runtime zinciri ile açılıyor
- provider chaos yok
- feature logic shell içine dolmamış

---

# 15. Faz K — Navigation Foundation

## 15.1. Amaç
Navigation kararı runtime’a indirilmelidir.

## 15.2. Yapılacak işler

- [ ] web root routes skeleton kuruldu
- [ ] mobile root navigation skeleton kuruldu
- [ ] auth/guest/main ayrımı için temel gate model kuruldu
- [ ] modal/dialog/sheet surface yönü minimum düzeyde temsil edildi
- [ ] back/dismiss behavior için ilk doğrulama senaryosu oluştu

## 15.3. Done kanıtı
- navigation yalnızca “çalışıyor” değil, kararlarla tutarlı
- web/mobile ayrışması platform adaptation mantığıyla açıklanabilir

---

# 16. Faz L — Auth and Session Foundation

## 16.1. Amaç
Auth/session mekanizması generic state veya convenience storage’a kaymadan kurulmalıdır.

## 16.2. Yapılacak işler

- [ ] auth boundary / adapter alanı kuruldu
- [ ] UI-facing sanitized auth summary modeli kuruldu
- [ ] web için cookie-preferred session yönü uygulama seviyesinde yerleştirildi veya fallback explicit belgelendi
- [ ] mobile secure storage adapter kuruldu
- [ ] logout cleanup contract ilk versiyonuyla yazıldı
- [ ] session restore/bootstrap akışı shell’e bağlandı
- [ ] wrong-user leak önleme için query/cache reset noktaları görünür kılındı

## 16.3. Done kanıtı
- token generic store’a yazılmıyor
- mobile secure persistence convenience storage ile karışmıyor
- logout yalnızca boolean temizliği değil

---

# 17. Faz M — State, Query and Forms Foundation

## 17.1. Amaç
State/data/forms kararları birlikte ama karışmadan kurulmalıdır.

## 17.2. Yapılacak işler

### State
- [ ] app-global Zustand summary stores oluşturuldu
- [ ] local-first yaklaşımı bozmayan store policy ilk kullanım yüzeyiyle doğrulandı

### Query
- [ ] TanStack Query root client kuruldu **veya** ADR-005 uyarınca fetch-first başlangıç kararı yazılı kayda geçirildi
- [ ] query key policy için ilk örnek tanımlandı
- [ ] mutation + invalidation örneği düşünüldü

### Forms
- [ ] RHF root usage pattern belirlendi
- [ ] Zod schema wiring örneği kuruldu
- [ ] field shell ile input control entegrasyonu çalıştı

## 17.3. Done kanıtı
- server state store’a kopyalanmıyor
- form state generic global store’a gitmiyor
- query / state / form sınırı pratikte gösterilebiliyor

---

# 18. Faz N — Internationalization Foundation

## 18.1. Amaç
Inline copy kaosu başlamadan i18n runtime kurulmalıdır.

## 18.2. Yapılacak işler

- [ ] i18next bootstrapping yapıldı
- [ ] namespace yapısı ilk versiyonuyla kuruldu
- [ ] locale resolution zinciri belirlendi
- [ ] fallback policy uygulandı
- [ ] en az `common`, `shell`, `auth` veya eşdeğer ilk namespace’ler açıldı
- [ ] formatting helper yönü görünür kılındı

## 18.3. Done kanıtı
- user-facing copy rastgele inline değil
- locale switch temel düzeyde çalışıyor
- formatting için string concat norm haline gelmiyor

---

# 19. Faz O — Observability Foundation

## 19.1. Amaç
Observability sonradan eklenen süs değil, foundation parçası olmalıdır.

## 19.2. Yapılacak işler

- [ ] Sentry baseline entegrasyonu kuruldu
- [ ] release/build metadata strategy root seviyede görünür
- [ ] structured logging yaklaşımı ilk yardımcılarıyla hazır
- [ ] analytics abstraction ilk interface düzeyinde kuruldu
- [ ] privacy-safe telemetry denylist/allowlist yönü görünür

## 19.3. Done kanıtı
- Sentry kurulu ama logs/analytics ile karışmıyor
- analytics vendor henüz seçilmese bile event abstraction hazır
- sensitive data leak riski görünür şekilde ele alınmış

---

# 20. Faz P — Testing Stack Activation

## 20.1. Amaç
Testing stack yalnızca kurulu değil, çalışan ve doğru katmanlara ayrılmış hale gelmelidir.

## 20.2. Yapılacak işler

- [ ] Vitest web-side ilk test ile çalışıyor
- [ ] Jest RN-side ilk test ile çalışıyor
- [ ] Testing Library aileleri bağlandı
- [ ] Playwright smoke wiring kuruldu
- [ ] Vitest Browser Mode / component-browser test ihtiyacı değerlendirildi ve karar kayda geçirildi
- [ ] Storybook 10 + Storybook Test (Vitest addon) kurulumu / ertelenme kararı yazılı kayda geçirildi
- [ ] shared testing helpers alanı ilk haliyle var
- [ ] CI test adımları bağlandı

## 20.3. Done kanıtı
- en az bir domain/unit testi
- en az bir reusable component testi
- en az bir form/state/query davranış testi
- en az bir web E2E smoke
çalışıyor olmalı.

---

# 21. Faz Q — Sample Vertical Slice

## 21.1. Amaç
Sistemin birlikte çalıştığını gösterecek ilk gerçek kanıt.

## 21.2. Vertical slice minimum içerik
- [ ] route entry
- [ ] UI primitives/components kullanımı
- [ ] one query fetch lifecycle
- [ ] loading/error/empty/success surface’lerinden en az bazıları
- [ ] one form interaction
- [ ] one mutation
- [ ] i18n copy
- [ ] auth/session-aware shell effect
- [ ] test coverage
- [ ] a11y değerlendirmesi
- [ ] referans ekranlar implement edildi:
  - S25 (List ekranı)
  - S26 (Detail ekranı)
  - S27 (Form ekranı)

> **Component/ekran referansı:** `39-default-screens-and-components-spec.md` Bölüm 10. Vertical slice bu üç referans ekran üzerinden doğrulanır.

## 21.3. Done kanıtı
- dikey dilim bir kullanıcı görevini baştan sona temsil ediyor
- yalnızca statik mock değil
- architecture/state/data/forms/styling/testing kararları birlikte görünür
- en az bir list ekranı (S25), bir detail ekranı (S26) ve bir form ekranı (S27) çalışıyor olmalıdır

---

# 22. Faz R — First Audit and Stabilization

## 22.1. Amaç
İlk kurulum sonrası self-deception’ı engellemek.

## 22.2. Yapılacak işler

- [ ] repo placement audit
- [ ] boundary audit
- [ ] token/raw style kaçak audit’i
- [ ] query/store/form separation audit’i
- [ ] auth/session/logout audit’i
- [ ] i18n/copy discipline audit’i
- [ ] observability noise/privacy audit’i
- [ ] CI/test signal quality audit’i
- [ ] web/mobile parity quick audit
- [ ] system ekranları (S01-S07) varlık ve çalışırlık doğrulaması

> **Component/ekran referansı:** `39-default-screens-and-components-spec.md` Bölüm 6. Tüm system ekranlarının (S01 Splash, S02 Onboarding, S03 Login, S04 Register, S05 Forgot Password, S06 Maintenance, S07 Force Update) bu fazda var ve çalışıyor olduğu doğrulanmalıdır.

## 22.3. Done kanıtı
- audit bulguları sınıflandırıldı
- kritikler kapatıldı veya takip planına bağlandı
- gerekiyorsa ADR veya checklist güncellemesi yapıldı

---

# 23. “Başlatıldı” ile “Kuruldu” Arasındaki Fark

Bu belgede aşağıdaki fark çok kritiktir:

## 23.1. Başlatıldı
- paket kuruldu
- dosya açıldı
- klasör oluştu
- config yazıldı

## 23.2. Kuruldu
- gerçek kullanım doğrulandı
- ilgili kalite sinyali çalıştı
- sonraki faz için güvenilir temel oluştu
- ilgili karar belgeleriyle çelişmiyor

Checklist yalnızca ikinci duruma göre işaretlenmelidir.

---

# 24. İlerlemeyi Sahte Gösteren İşaretler

Aşağıdaki sinyaller checklist ilerliyor gibi görünse de gerçekte kötü gidişat gösterir:

1. token package var ama component’ler hardcoded stil kullanıyor
2. Zustand kuruldu ama summary/store sınırı bozuluyor
3. query client kuruldu ama fetch screen içine dağılmış
4. i18n kuruldu ama copy inline devam ediyor
5. Sentry kuruldu ama structured logging yok
6. auth adapter açıldı ama token generic state’e sızıyor
7. Playwright kuruldu ama tek smoke bile yok
8. UI package var ama feature-specific component’ler içine dolmuş
9. docs/adr klasörü var ama güncellenmiyor
10. CI var ama gerçek kalite blocker’ı değil

---

# 25. Bu Checklist Sonrası Ne Gelir?

Bu checklist tamamlandığında doğrudan “ürün feature geliştirme” moduna geçilmez.

Önce:
1. first audit sonuçları işlenir
2. gerekiyorsa küçük refactor yapılır
3. DoD ve audit checklist son kez hizalanır
4. sonra baseline üstünde yeni feature geliştirme meşru hale gelir

---

# 26. Onay Kriterleri

Bu doküman yeterli kabul edilir eğer:

1. Checklist artık keşif değil uygulama sırası mantığı taşıyorsa
2. Exact canonical stack yönleri checklist’e işlenmişse
3. Environment, repo bootstrap, config, quality, tokens, themes, UI, shells, auth, query/forms, i18n, observability, testing, vertical slice ve audit sırası netse
4. Her faz için done kanıtı görünürse
5. Sahte ilerleme sinyalleri açıkça yazılmışsa
6. Bu belge repo bootstrap ve ilk implementation için gerçek yürütme planı olarak kullanılabilecek netlikteyse

---

# 27. Kısa Sonuç

Bu dokümanın ana çıktısı şudur:

> Bu boilerplate’te ilk implementasyon, rastgele scaffold üretmek değil; canonical stack’i exact toolchain hattı üzerinde, doğru repo topolojisiyle, çalışan kalite kapılarıyla, token/theme/UI foundations ile, app shells ve state/data/forms/auth/i18n/observability wiring’i ile ve bunu doğrulayan bir vertical slice ile kurmaktır. Bu checklist, “hangi sırayla neyi gerçekten kurulmuş sayacağımızı” belirleyen resmi uygulama planıdır.
