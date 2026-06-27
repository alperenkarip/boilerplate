# Stitch Derived Project Prompt Guide

> **KULLANIM:** Bu dosyanin tamami tek parca olarak Claude Code, Codex veya benzeri bir agent modele verilir.
> Agent, dosyayi okur, icindeki kurallari ogrenir ve `RUN THIS EXACT AGENT PROMPT` bolumunu otonom olarak uygular.
> Dosyanin geri kalani (ekran aile tanimlari, ornek prompt'lar, referanslar) agent icin canli referanstir.
>
> **TEK KOMUT KULLANIMI:**
> ```
> Bu dosyanin tamamini oku. Icindeki RUN THIS EXACT AGENT PROMPT bolumunu bu proje uzerinde otonom olarak uygula.
> Ekran aile tanimlari, ornek prompt'lar ve tum kurallar bu dosyanin icinde referans olarak var.
> Hicbir ek girdi bekleme, proje taramasindan basla ve tum ekranlari uretene kadar dur.
> ```
>
> **ALTERNATIF:** Derived project'te `.stitch/` altina bu dosyayi kopyala.
> Sonra Claude Code'a sadece soyle: `.stitch/STITCH-DERIVED-PROJECT-PROMPT.md dosyasini oku ve uygula.`

---

## Bu belge ne icin var

Bu belge, boilerplate'ten turetilen (derived) herhangi bir projede Codex / Claude Code gibi agent modellerinin Google Stitch MCP ile **otonom olarak** calismasini saglar:

- projenin kod yapisini, kapsamini ve amacini otomatik tarayarak proje profilini cikarir
- tarama sonuclarina dayanarak projeye ozel ekran ailelerini belirler
- Stitch'i agent tarafindan kullanilan tasarim motoru olarak konumlandirir
- design system varligini algilayip tutarli gorsel dil kurar
- tum ekranlari tek komutla, soru sormadan, otonom olarak uretir

Bu rehber, `STITCH-PROMPT-GUIDE.md`'nin boilerplate-spesifik yaklasimini genellestirir.
Herhangi bir derived project icin proje tarama + kapsam cikarimi + ekran uretimi pipeline'i sunar.

Bu rehberin amaci **renk, font, px, grid, kolon, gap** belirlemek degildir.
Bu rehberin amaci "hangi ekranlar uretilecek?", "proje nasil taranacak?" ve "agent nasil otonom calisacak?" sorularini netlestirmektir.

---

## Kisa Ozet

Agent + Stitch MCP akisindan istedigimiz sey:

- derived project'in amacina ve kapsamina uygun ekran seti
- projeye ozel design system veya mevcut boilerplate design system ile tutarlilik
- test UI ekranlari + starter screen seti + vertical slice referanslari
- proje turune gore adapte edilmis ekran aileleri

Agent modele vermemiz gereken sey:

- otomatik proje tarama sonuclari (proje profili)
- ekranin semantic rolu
- gerekli icerik ve aksiyonlar
- zorunlu state'ler
- yuksek seviye vibe / kalite seviyesi
- hedef platform ve device bilgisi

Agent modele vermememiz gereken sey:

- piksel seviyesinde gorsel kararlar
- exact renk, font, spacing, border, shadow, radius, layout komutlari
- belirli bir tasarim kitin gorsel kopyasi

---

## Boilerplate Miras Iliskisi

Bu belge, `45-boilerplate-project-boundary-contract.md` ile uyumlu calisir.

Derived project'te Stitch kullanimi icin miras kurallari:

| Miras Tipi | Kural | Derived Project Davranisi |
|-----------|-------|---------------------------|
| Zorunlu miras | Design system token-first yaklasimi | Override edilemez |
| Zorunlu miras | WCAG 2.2, Apple HIG, Android adaptive quality | Override edilemez |
| Zorunlu miras | DESIGN.md uretim ve tuketim kurallari | Override edilemez |
| Yapisal miras | Ekran aileleri (system, auth, onboarding, shell) | Genisletilebilir, daraltılamaz |
| Yapisal miras | Component coverage crosswalk mantigi | Ek pattern eklenebilir, base kaldirilmaz |
| Proje-ozel | Vertical slice ekranlari | Proje amacina gore tamamen ozellestirilebilir |
| Proje-ozel | Design system renk, font, roundness secimi | Proje markasiyla belirlenir |
| Proje-ozel | Ek ekran aileleri (e-commerce, messaging, vb.) | Serbestce eklenebilir |

Kritik kural:

- Derived project boilerplate'in zorunlu miras kurallarini gevsetemez
- Derived project ek ekran aileleri ve ek design system kurallari ekleyebilir
- Derived project'in Stitch prompt'larinda boilerplate'in base guardrail'leri her zaman aktiftir

---

## DESIGN.md Once Gelir

Derived project'te agent + Stitch MCP kullaniminda dogru baslangic:

1. Eger derived project'te mevcut `DESIGN.md` varsa agent'a ver ve mevcut sistemi koruyarak devam etmesini iste.
2. Eger boilerplate'ten miras alinan token seti veya onceki design export'lari varsa bunlari referans al.
3. Eger derived project'in kendi markasi ve gorsel kimligine dair bilgi varsa (logo, marka rengi, font tercihi) bunu proje profiline isle.
4. Yalnizca ilk oturumda ya da bilincli bir visual reset kararinda sifirdan basla.

Kritik kural:

- `DESIGN.md` yoksa ilk oturumda uretilir
- `DESIGN.md` varsa her zaman onunla devam edilir
- `DESIGN.md` elle duzenlenmez
- Stitch ciktisi dogrudan kodda kullanilmaz; token eslestirme asamasindan gecer
- agent, Stitch MCP ile ekran uretse bile `DESIGN.md` ve token kurallarini bozmaz
- DESIGN.md ile `22-design-tokens-spec.md` arasinda catisma oldugunda, `22-design-tokens-spec.md` kazanir

Bu rehber, `46-stitch-pipeline-spec.md` ile birlikte okunmalidir.

---

## Temel Ilke

Sen tasarimci degilsin.
Sen, Stitch'i kullanan bir execution agent'sin.
Stitch tasarim icin yaratilmis bir yapay zeka.

Senin gorevin:

- derived project'in baglamini proje taramasi ile otomatik cikarmak
- proje profilini Stitch MCP uzerinden ekran uretiminde kullanmak
- ekranin semantic amacini tanimlamak
- ekranda bulunmasi gereken veri, aksiyon, state ve akis bilgisini vermek
- tasarim kapsaminda nelerin olmasi gerektigini netlestirmek

Senin gorevin degil:

- renk secmek
- tipografi secmek
- spacing kurmak
- layout dayatmak
- Stitch'in gorsel kararlarini override etmek

Kural:

**Tasarlama. Brief ver.**

Operasyonel kural:

**Oluştur → Bekle → Doğrula → İlerle.** Dogrulamadan hizlanma. Timeout'ta tekrarlama.

---

## Cok Onemli Denge

Bu rehber iki gorunurde celiskili ihtiyaci birlikte tasir:

1. Stitch'e alan tanimak
2. Kalite seviyesini tesadufe birakmamak

Bu denge su sekilde kurulur:

- **Izin verilen sey:** vibe, ton, kalite seviyesi, urun tipi, pattern coverage, semantic rol, proje sektoru, marka hissi
- **Yasak olan sey:** exact gorsel tarif, hardcoded layout, exact color/font/spacing kararleri

Yani su tur brief'ler uygundur:

- premium fintech feel
- modern e-commerce experience
- calm healthcare interface
- strategic minimalism
- strong hierarchy with brand warmth
- modular card-based where appropriate
- proactive feedback
- trustworthy product feel

Ama su tur brief'ler uygun degildir:

- lacivert arka plan kullan
- 16px gap yap
- Inter kullan
- 3 kolon bento grid olsun
- header solda, CTA sagda olsun

Not:
`bento-style`, `modular cards`, `soft depth`, `bold typography` gibi ifadeler ancak **atmosfer ve genel dil** olarak verilebilir.
Never exact execution.

---

## PROJE TARAMA PROTOKOLU

Bu bolum, derived project'in kod yapisini, kapsamini ve amacini otomatik taramak icin kullanilir.
Tarama sonuclari, ekran listesi olusturma ve prompt uretiminin temelini olusturur.

---

## Tarama Adimlari

Agent, derived project dizinine girdiginde asagidaki adimlari sirasiyla uygular.

### Adim 1 — Proje Kimlik Taramasi

**Amac:** Projenin adini, tech stack'ini ve calisma ortamini belirlemek.

**Taranan dosyalar:**

```
package.json                    → name, dependencies, devDependencies, scripts
pubspec.yaml                    → Flutter projeleri icin
build.gradle / build.gradle.kts → Android / Kotlin projeleri icin
Podfile                         → iOS projeleri icin
Cargo.toml                      → Rust projeleri icin
pyproject.toml / requirements.txt → Python projeleri icin
go.mod                          → Go projeleri icin
```

**Cikarilacak bilgiler:**

- proje adi
- ana framework (React, React Native, Vue, Flutter, Next.js, Nuxt, Angular, vb.)
- mobil runtime (Expo, bare React Native, Flutter, vb.)
- monorepo yapisi (pnpm workspaces, turborepo, nx, lerna)
- build tool (Vite, webpack, Metro, esbuild, vb.)
- test framework (Vitest, Jest, Playwright, Cypress, vb.)
- linting (ESLint, Biome, prettier, vb.)

### Adim 2 — Dizin Yapisi Taramasi

**Amac:** Projenin dosya organizasyonunu, mevcut ekranlarini ve component'lerini kesfetmek.

**Taranan pattern'ler:**

```
src/pages/**                    → Next.js / Nuxt sayfalari
src/screens/**                  → React Native ekranlari
app/**/page.tsx                 → Next.js App Router sayfalari
app/**/layout.tsx               → Next.js App Router layout'lari
src/routes/**                   → React Router / SvelteKit route'lari
src/views/**                    → Vue views
lib/screens/**                  → Flutter ekranlari
src/features/**                 → Feature-based organizasyon
src/modules/**                  → Module-based organizasyon
src/components/**               → Paylasimli component'ler
packages/ui/**                  → Monorepo UI paketi
packages/design-tokens/**       → Design token dosyalari
```

**Cikarilacak bilgiler:**

- mevcut ekran/sayfa listesi (dosya adlarindan)
- mevcut component inventeri
- feature/module yapisi
- shared package yapisi

### Adim 3 — Design System Durum Taramasi

**Amac:** Mevcut design system'in varligini ve olgunluk seviyesini belirlemek.

**Taranan dosyalar:**

```
DESIGN.md                       → Stitch export dosyasi
tailwind.config.*               → Tailwind tema konfigurasyonu
theme.ts / theme.js             → Ozel tema dosyasi
tokens.json / tokens.yaml       → Design token dosyalari
src/styles/variables.*          → CSS/SCSS degisken dosyalari
packages/design-tokens/**       → Token paketi
styled-components theme         → SC tema objesi
stitches.config.*               → Stitches tema konfigurasyonu
```

**Cikarilacak bilgiler:**

- design system durumu: `exists` / `partial` / `none`
- mevcut renk paleti (varsa)
- mevcut font tercihleri (varsa)
- mevcut spacing scale (varsa)
- dark mode destegi (var/yok)

### Adim 4 — Proje Amac ve Kapsam Taramasi

**Amac:** Projenin ne yaptigini, kime hitap ettigini ve temel kullanici akislarini cikarmak.

**Taranan dosyalar:**

```
README.md                       → Proje tanimi, amaci
CLAUDE.md                       → AI talimatlari, proje kurallari
.moai/specs/**                  → SPEC dokumanlari
docs/**                         → Proje dokumantasyonu
BOUNDARY.md                     → Boilerplate miras kurallari (derived project'te)
product.md                      → Urun tanimi (moai:project ciktisi)
structure.md                    → Yapi tanimi (moai:project ciktisi)
tech.md                         → Teknoloji tanimi (moai:project ciktisi)
```

**Cikarilacak bilgiler:**

- projenin amaci / ne problemi cozuyor
- hedef kitle (B2C, B2B, internal tool, vb.)
- sektor / dikey (fintech, saglik, e-commerce, egitim, sosyal, vb.)
- temel kullanici akislari
- proje olgunluk seviyesi (erken asama / aktif gelistirme / olgun)

### Adim 5 — i18n ve Locale Taramasi

**Amac:** Projenin dil yapisini ve birincil locale'ini belirlemek.

**Taranan dosyalar:**

```
i18n.ts / i18n.js / i18n.config.*    → i18n konfigurasyonu
src/locales/**                        → Cevirisi dosyalari
messages/**                           → Intl mesajlari
public/locales/**                     → Next.js i18n dosyalari
```

**Cikarilacak bilgiler:**

- birincil dil
- desteklenen diller
- i18n framework (i18next, react-intl, vue-i18n, vb.)

### Adim 6 — Navigasyon ve Auth Taramasi

**Amac:** Mevcut navigasyon yapisini ve auth akisini kesfetmek.

**Taranan dosyalar ve pattern'ler:**

```
src/navigation/**                → React Navigation yapilandirmasi
src/router/**                    → Router yapilandirmasi
app/_layout.tsx                  → Expo Router layout
middleware.ts                    → Auth middleware
src/auth/** / src/features/auth/** → Auth feature
src/guards/** / src/middleware/**   → Route guard'lari
```

**Cikarilacak bilgiler:**

- navigasyon yapisi (tab, stack, drawer, vb.)
- auth durumu (varsa hangi akislar implement edilmis)
- korunmus route'lar
- public route'lar

---

## Proje Profili Cikti Formati

Tarama tamamlandiginda agent, asagidaki yapisal profili olusturur.
Bu profil, sonraki tum adimlarin (ekran listesi, prompt uretimi, design system kurulumu) girdisidir.

```yaml
# Proje Profili — Otomatik Tarama Ciktisi
project_name: "{{proje_adi}}"
project_description: "{{kisa_tanim}}"

# Proje siniflandirmasi
project_type: "{{mobile-app | web-app | dashboard | cross-platform | landing-page | internal-tool}}"
sector: "{{fintech | healthcare | e-commerce | education | social | productivity | saas | media | logistics | other}}"
target_audience: "{{B2C | B2B | internal | developer | mixed}}"
maturity: "{{early-stage | active-development | mature}}"

# Tech stack
tech_stack:
  web_framework: "{{React | Vue | Angular | Svelte | Next.js | Nuxt | none}}"
  mobile_framework: "{{React Native + Expo | React Native bare | Flutter | Swift | Kotlin | none}}"
  build_tool: "{{Vite | webpack | Metro | esbuild | turbopack | none}}"
  styling: "{{Tailwind | CSS Modules | styled-components | NativeWind | StyleSheet | other}}"
  state_management: "{{Zustand | Redux | MobX | Riverpod | Pinia | other}}"
  data_fetching: "{{TanStack Query | SWR | Apollo | fetch | other}}"
  forms: "{{React Hook Form | Formik | VeeValidate | other | none}}"
  testing: "{{Vitest | Jest | Playwright | Cypress | other}}"
  monorepo: "{{pnpm workspaces | turborepo | nx | lerna | none}}"

# Design system durumu
design_system:
  status: "{{exists | partial | none}}"
  design_md_exists: "{{true | false}}"
  primary_color: "{{hex veya null}}"
  font_preference: "{{font adi veya null}}"
  dark_mode: "{{true | false | unknown}}"

# i18n
locale:
  primary: "{{tr | en | de | fr | ...}}"
  supported: ["{{dil listesi}}"]
  framework: "{{i18next | react-intl | vue-i18n | none}}"

# Mevcut ekranlar
existing_screens:
  - "{{EkranAdi1}}"
  - "{{EkranAdi2}}"

# Mevcut component'ler (ana kategoriler)
existing_components:
  data_display: ["{{Card | Badge | Avatar | ...}}"]
  forms: ["{{TextField | Select | Checkbox | ...}}"]
  navigation: ["{{TabBar | Header | Drawer | ...}}"]
  feedback: ["{{Toast | Banner | Spinner | ...}}"]
  overlays: ["{{Modal | BottomSheet | Tooltip | ...}}"]

# Navigasyon yapisi
navigation:
  type: "{{tab | stack | drawer | sidebar | mixed}}"
  auth_flow: "{{implemented | partial | none}}"
  protected_routes: ["{{route listesi}}"]

# Boilerplate miras
boilerplate_sync:
  boundary_md_exists: "{{true | false}}"
  last_sync_hash: "{{commit hash veya null}}"
```

---

## Proje Turune Gore Ekran Ailesi Matrisi

Tarama sonucunda belirlenen `project_type` degerine gore zorunlu ve opsiyonel ekran aileleri asagidaki matris ile belirlenir.

### Zorunlu Ekran Aileleri

| Ekran Ailesi | mobile-app | web-app | dashboard | cross-platform | landing-page | internal-tool |
|-------------|:----------:|:-------:|:---------:|:--------------:|:------------:|:-------------:|
| System / Utility | ✅ | ✅ | ✅ | ✅ | ⚬ | ✅ |
| Auth | ✅ | ✅ | ✅ | ✅ | ⚬ | ✅ |
| Onboarding | ✅ | ⚬ | ⚬ | ✅ | ✗ | ✗ |
| Main Shell | ✅ | ✅ | ✅ | ✅ | ✗ | ✅ |
| Vertical Slice | ✅ | ✅ | ✅ | ✅ | ✗ | ✅ |
| Foundation / Reference | ✅ | ✅ | ✅ | ✅ | ⚬ | ⚬ |

✅ = zorunlu, ⚬ = opsiyonel/onerilen, ✗ = gerekli degil

### Sektore Gore Ek Ekran Aileleri

| Sektor | Ek Ekran Aileleri |
|--------|------------------|
| fintech | Transaction List, Transaction Detail, Transfer Form, Balance Dashboard, Card Management, KYC/Verification |
| healthcare | Appointment List, Appointment Detail, Patient Profile, Medical Records, Prescription View |
| e-commerce | Product List, Product Detail, Cart, Checkout, Order History, Order Detail, Wishlist, Reviews |
| education | Course List, Course Detail, Lesson Player, Progress Dashboard, Quiz/Assessment, Certificate |
| social | Feed, Post Detail, Profile, Chat/Messaging, Notifications, Search/Discover |
| productivity | Task List, Task Detail, Calendar, Notes, Collaboration, File Manager |
| saas | Dashboard, Analytics, Team Management, Billing, API Keys, Usage Metrics |
| media | Content Feed, Player/Reader, Library, Playlists, Download Manager |
| logistics | Shipment List, Shipment Tracking, Map View, Scan/Barcode, Delivery Status |

Bu ek aileler, projenin sektorune gore otomatik ekran listesine eklenir.
Agent, proje taramasindan cikarilan `sector` degerini kullanarak uygun ek aileleri belirler.

---

## Eksik Ekran Analizi (Gap Analysis)

Proje profili cikartildiktan sonra agent su karsilastirmayi yapar:

1. **Zorunlu ailelerden** mevcut ekranlar cikarilir → eksik ekranlar listesi olusur
2. **Sektor ek ailelerinden** mevcut ekranlar cikarilir → sektor gap listesi olusur
3. Iki liste birlestirilir → **tam uretim envanteri** olusur
4. Uretim sirasina gore onceliklendirilir

Ornek gap analizi ciktisi:

```
Gap Analizi — my-fintech-app
================================

Mevcut ekranlar: LoginScreen, HomeScreen, SettingsScreen

Eksik zorunlu ekranlar:
  System/Utility: splash, force_update, offline, maintenance, 404, error, loading
  Auth: register, forgot_password, reset_password, otp, biometric
  Onboarding: welcome_slides, permission_primer, profile_setup
  Main Shell: profile, edit_profile, notification_prefs, change_password, delete_account, about
  Vertical Slice: list, detail, create_edit_form

Eksik sektor ekranlari (fintech):
  transaction_list, transaction_detail, transfer_form, balance_dashboard, card_management, kyc_verification

Toplam uretilecek ekran: 28
```

---

## Calisma Modlari

Bu rehber uc farkli calisma amaci icin kullanilabilir.

### 1. Autonomous Full Build

Bu **ana** moddur.
Bu rehberin varsayilan kullanim sekli budur.

Amac:

- proje taramasi tamamlandiktan sonra tek girdi ile zorunlu ekran ailelerini olusturmak
- agent'in Stitch MCP uzerinden ekran ekran soru beklemeden ilerlemesini saglamak
- tutarli bir baseline UI sistemi kurmak
- sektor-ozel ekranlari da kapsamak

Bu modda agent:

1. proje taramasini tamamlar, proje profilini cikarir
2. gap analizini yapar
3. mevcut `DESIGN.md` varsa onunla devam eder, yoksa yeni baseline sistem kurar
4. design system -> system/utility -> auth -> onboarding -> main shell -> vertical slice -> sektor-ozel -> reference coverage sirasiyla ilerler
5. her aileyi ayni design system altinda tamamlar
6. Google Stitch MCP araclarini kullanarak ekstra ekran brief'i beklemeden zorunlu kapsamı kapatir
7. **her ekran uretiminden sonra dogrulama yapar, dogrulamadan bir sonraki ekrana gecmez**
8. **timeout durumunda koru oluştur: once dogrula, duplicate oluşturma, 3 ardisik timeout'ta dur**

### 2. Iterative Single-Screen Build

Bu ikincil moddur.
Autonomous full build tamamlandiktan sonra kullanilir.

Amac:

- tek bir ekrani duzeltmek
- `edit_screens` turleri yapmak
- coverage disi bir detay iyilestirmek

Bu modda `Iterative Tam Prompt` veya compact semantic core prompt'lari kullanilir.

### 3. Reference Expansion

Bu destek modudur.
Autonomous full build sonrasinda coverage veya component-lab zenginlestirmek icin kullanilir.

---

## Coverage Felsefesi

Derived project icin hedef, proje amacina uygun ama sistematik bir starter kit coverage'i yaratmaktir.

Bu kapsama su aileler dahildir:

1. Foundation / reference test ekranlari
2. System / utility ekranlari
3. Auth ekranlari
4. Onboarding ekranlari (proje turune gore)
5. Main app shell ekranlari
6. Vertical slice referans ekranlari
7. Sektor-ozel ekranlar (proje sektorune gore)

Bu aileler, `docs/design-system/39-default-screens-and-components-spec.md` ve ilgili design-system belgeleriyle uyumludur.

Farkli proje turlerinde coverage agirlik merkezi degisir:

| Proje Turu | Coverage Agirlik Merkezi |
|------------|-------------------------|
| mobile-app | Auth, onboarding, native shell, sektor-ozel |
| web-app | Shell, vertical slice, reference UI |
| dashboard | Data views, settings, analytics |
| cross-platform | Her iki platformda ayri varyantlar |
| landing-page | Hero, features, social proof, CTA |
| internal-tool | Data views, forms, utility |

Kural:

- coverage mantigi, proje turune gore ayarlanir
- boilerplate base coverage daraltilmaz, sadece genisletilir
- sektor-ozel coverage base'in ustune eklenir

---

## Hemen Calistirilabilir Akis

### Tek Komut Kullanimi

Bu dosyanin tamami agent'a verilir. Agent tum adimlari otonom olarak gerceklestirir:

```
Bu dosyanin tamamini oku. Icindeki RUN THIS EXACT AGENT PROMPT bolumunu bu proje uzerinde otonom olarak uygula.
Ekran aile tanimlari, ornek prompt'lar ve tum kurallar bu dosyanin icinde referans olarak var.
Hicbir ek girdi bekleme, proje taramasindan basla ve tum ekranlari uretene kadar dur.
```

Agent bu tek komutu aldiginda su akisi otonom olarak isletir:

1. **TARAMA** — Proje dizinini tarar, proje profilini cikarir
2. **GAP ANALIZI** — Mevcut vs zorunlu ekranlari karsilastirir, eksikleri belirler
3. **DESIGN SYSTEM** — Mevcut DS'i algilar veya yenisini olusturur
4. **EKRAN URETIMI** — Eksik ekranlari sirayla Stitch MCP ile uretir (Olustur → Bekle → Dogrula → Ilerle)
5. **DS UYGULAMA** — Tum ekranlara design system'i toplu uygular
6. **EXPORT** — DESIGN.md export eder veya sonraki adim olarak raporlar

Bu adimlarin hicbiri icin kullanici girdisi beklenmez.
Agent, bu dosyanin icerigindeki kurallari, ekran ailesi tanimlarini ve ornek prompt'lari referans olarak kullanir.

### Alternatif Kullanim

Dosya derived project'in `.stitch/` dizinine kopyalanmissa:

```
.stitch/STITCH-DERIVED-PROJECT-PROMPT.md dosyasini oku ve uygula.
```

Ekran uretim temposu kurali:

- her ekran uretiminden sonra `get_screen` veya `list_screens` ile dogrula
- dogrulamadan bir sonraki ekrana gecme
- timeout almak basarisizlik demek degil — once dogrula, sonra karar ver
- ayni ekrani timeout sebebiyle tekrar olusturma — bu duplicate'e yol acar
- ardisik ekranlarda kalite dususu gorursen uretimi duraklat, sistemi dinlendir
- 3 ardisik timeout durumunda akisi durdur ve durumu raporla

---

## Reset Talimati

Yeni bir agent-run Stitch turuna baslarken:

1. Bunun gercekten yeni bir visual baseline oldugundan emin ol.
2. Eger mevcut `DESIGN.md` korunacaksa reset yapma; mevcut export ile devam et.
3. Reset gerekiyorsa mevcut ekran tasarimlarini sil.
4. Stitch'te mumkunse en guclu kalite modelini kullan; secenekler arasinda varsa `GEMINI_3_1_PRO` tercih et.
5. Bu rehberdeki calisma modlarindan birini sec.
6. Varsayilan mod `autonomous full build` modudur.
7. Sadece reference coverage denetimi yapiyorsan `reference expansion` moduna gec.

---

## Onerilen Stil Notu

Bu not, her prompt'un basina konulabilecek en guvenli ortak stil brief'idir.
Proje profilinden cikarilan bilgilerle zengilestirilir.

```text
Design style: A premium, modern {{project_type}} experience for {{sector}}.
Clean, focused, and high-trust.
Strategic minimalism over decorative noise.
Use strong hierarchy, polished depth, and modular composition where appropriate.
The overall feel should be refined, production-minded, and system-driven rather than generic or template-like.
Use contemporary 2025-2026 quality cues without feeling trend-chasing or ornamental.
Allow subtle human warmth and tactility only when it does not reduce clarity, trust, or usability.
```

Bu not:

- kalite seviyesini tanimlar
- proje sektorunu yansitir
- agent'e ve Stitch'in tasarim zekasina alan birakir
- exact gorsel karar vermez

---

## Trend Notu

Asagidaki trend sentezi, **gorsel mikro-komut** degil, yuksek seviye atmosfer brief'i olarak kullanilabilir.

Bu bolum, 2025-2026 odakli UI/UX kaynaklari ile Apple HIG, Android adaptive quality, WCAG 2.2 ve W3C Web Sustainability Guidelines gibi resmi best-practice kaynaklarinin sentezidir.

### 2025-2026 trend sentezi

- Functional minimalism and calmer interfaces
- Meaningful micro-interactions instead of decorative motion
- AI-aware surfaces and copilot patterns only when semantically useful
- Multimodal and context-aware interaction readiness where relevant
- Compliance-driven accessibility and clearer trust signals
- Sustainable, performance-aware UX especially on the web
- Mindful UX and overload-reducing interaction choices
- Adaptive layouts that truly respond to device class, not just stretch
- Mature material depth and glass-like layering used sparingly
- Strong, readable typography and disciplined hierarchy

### Web icin 2025-2026 yorumu

Web tarafinda agent su yonlere egilim gosterebilir:

- dashboard gurultusu yerine daha sakin bilgi hiyerarsisi
- moduler ama asiri kartlasmamis layout sistemleri
- hover, focus, keyboard ve context-menu davranislarini ciddiye alan desktop-grade etkilesim
- AI / search / command / assist yuzeylerini sadece urun mantigi destekliyorsa on plana alma
- performans ve surdurulebilirlik dusuncesiyle asset, motion ve veri yogunlugunu kontrollu tutma
- legal, privacy, accessibility ve account-safety yuzeylerini ikinci sinif gormeme
- editorial veya tactile gorunumleri ancak ciddi urun hissini bozmayacak kadar kullanma

### Mobil icin 2025-2026 yorumu

Mobil tarafta agent su yonlere egilim gosterebilir:

- web parity yerine native-feeling akislari tercih etme
- permission primer, biometric, onboarding, recovery ve trust yuzeylerini ciddi alma
- sadece telefon degil; tablet, foldable ve buyuk ekran varyantlarini dusunme
- motion'u akisi desteklemek icin kullanma; show-off amacli kullanmama
- Dynamic Type, reduced motion, touch target, safe area ve tek elle kullanim mantigini koruma
- AI yardimci veya context-aware davranisi ancak kullanici gorevini hizlandiriyorsa ekleme
- yeni material veya glass etkilerini ana task content'i flu yapmadan, kontrollu sekilde kullanma

Bu trendler:

- zorunlu dekorasyon listesi degildir
- her ekranda ayni anda gorunmek zorunda degildir
- semantic isi bozamaz
- best-practice kurallarinin onune gecemez

Kural:

**Trend = kalite tonu. Pattern zorlamasi degil.**

---

## 2025-2026 Best Practice Guardrail'leri

Trendler ikincildir.
Asil zorunlu katman best-practice guardrail'leridir.
Bu guardrail'ler boilerplate'ten zorunlu miras yoluyla derived project'e aktarilir.

### Evrensel guardrail'ler

- WCAG 2.2 dusuncesiyle erisilebilir kontrast, focus gorunurlugu ve keyboard erisimi koru
- gereksiz tam ekran yukleme ve hata yuzeylerinden kac; uygun oldugunda section-level veya inline feedback kullan
- reduced motion ihtiyacini dusun; motion anlam katmiyorsa azalt
- dark pattern, addictive loop ve dikkat dagitici sonsuz gorsel gosterileri default'a cevirmeme
- AI veya personalisation kullaniliyorsa duzeltme, geri alma veya override yolu dusun

### Web guardrail'leri

- performans ve surdurulebilirlik icin asset, medya ve script yogunlugunu kontrollu tut
- klavye, hover, right-click, zoom ve desktop-grade input beklentisini goz ardi etme
- buyuk ekranlarda sadece bosluk buyutme; gerekirse rail, drawer, iki kolon veya panel mantigi dusun
- legal, accessibility, privacy, help ve account yollarini bulunabilir tut

### Mobil guardrail'leri

- Apple HIG ile uyumlu hiyerarsi, tutarlilik ve platform konvansiyonlarini koru
- Apple tarafinda 44x44 pt, Android tarafinda 48dp seviyesinde hit-target mantigini ihlal etme
- iOS Dynamic Type ve Android text scaling mantigina dusmanca davranma
- Android buyuk ekranlarda rail, drawer, multipane, keyboard/mouse/hover beklentilerini dusun
- materyal / glass / translucency etkilerini kontrol ve navigasyon katmaninda, gerektigi kadar kullan; icerik katmanini bulandirma

---

## Boilerplate Baglami

Asagidaki blok, derived project'e aktarilacak sabit boilerplate baglamidir.
Her derived project bu context'i kendi proje profilinden cikarilan bilgilerle genisletir.
Bu blok agent talimatinda tam ya da kismen kullanilabilir.

```text
This project is derived from a cross-platform product boilerplate built for React web and React Native / Expo mobile.
It is documentation-first, quality-gated, token-first, and design-system-driven.
The goal is not a one-off mockup; the goal is a reusable, premium, production-minded UI foundation.

The boilerplate already assumes:
- a shared design system mindset
- semantic tokens
- reusable components
- accessibility awareness
- Apple HIG sensitivity on mobile
- strong loading, empty, error, success, and recovery states
- auth, onboarding, settings, dashboard, and vertical-slice starter screens

This design work should create:
- project-specific screens aligned with the derived project's sector and purpose
- starter screens that the project needs on top of the boilerplate baseline
- a coherent visual system that can later be mapped into tokens and reusable components

Do not design this like a generic CRUD admin.
Cover the breadth of reference and starter surfaces a premium product needs:
component showcase, typography, color roles, spacing, forms, data views, navigation, feedback states,
auth screens, onboarding, dashboard, settings, and sector-specific screens.
```

Derived project baglami ise proje profili taramasindan cikarilan bilgilerle olusturulur:

```text
This derived project is a {{project_type}} in the {{sector}} sector.
Target audience: {{target_audience}}.
Tech stack: {{tech_stack.web_framework}} (web), {{tech_stack.mobile_framework}} (mobile).
Design system status: {{design_system.status}}.
Primary locale: {{locale.primary}}.
```

---

## Ajana Ne Verilir

Her ekran veya run icin agent modele yalnizca su katmanlar verilir:

1. **Proje profili** (otomatik taramadan)
2. **Ekranin adi**
3. **Ekranin isi** (semantic amaci)
4. **Data fields / actions / flow**
5. **Gerekli state'ler**

Opsiyonel katmanlar:

6. **Yuksek seviye vibe note** (proje sektorune uyarlanmis)
7. **Device ve locale notu**
8. **Sektor-ozel notlar** (ornegin "fintech trust signals", "healthcare compliance feel")

---

## Ajana Ne Verilmez

- exact color palettes
- exact font names
- exact spacing scale
- px cinsinden olculer
- kolon sayisi
- breakpoint dayatmasi
- component ic hiyerarsisinin piksel tarifi
- "X gibi gorunsun" gibi kopya gorsel brief
- token adlari, Tailwind class detaylari, NativeWind implementation detaylari

Coverage mantigini referans al.
Gorunusu kopyalatma.

---

## Platform, Device ve Dil Kurali

Her prompt'ta hedef platformu acik yaz:

- `web`
- `mobile`
- `both` sadece gercekten ayni semantic yuzey iki platformda da degismeden tasinabiliyorsa

Varsayilan cihaz stratejisi:

- component gallery, typography, color, spacing, navigation, form, data-pattern gibi web-odakli reference ekranlari icin `DESKTOP`
- splash, force update, biometric prompt, welcome slides, permission primer gibi mobile-semantic ekranlar icin `MOBILE`
- cross-platform starter ekranlarda once ana hedef platformu sec, sonra gerekiyorsa ikinci platform icin ayri prompt ac

Karar agaci:

1. Bu ekranin semantic merkezi web shell mi? → `DESKTOP`
2. Bu ekranin semantic merkezi native mobile akisi mi? → `MOBILE`
3. Bu ekran her iki platformda da var ama farkli primitive'lerle yasiyorsa: once birincil platformu sec, sonra ikinci platform varyantini ayrica iste

Dil / locale stratejisi:

- proje profilindeki birincil dili kullan
- prompt'ta hangi dili kullanacagini acikca soyle
- bir ekranda diller karismasin

---

## DESIGN SYSTEM KURULUMU

---

## Design System Algilama Kurallari

Agent, proje taramasinda design system durumunu uclu siniflandirma ile belirler:

### Status: `exists`

Kosula uygun dosyalar:

- `DESIGN.md` mevcut ve icerik dolu
- Tailwind config'te custom tema degerleri var
- Token dosyalari (tokens.json, variables.css) mevcut

Bu durumda:

- Stitch'te `list_design_systems` ile mevcut DS'i kontrol et
- Eger Stitch'te DS varsa onu kullan
- Eger Stitch'te yoksa ama `DESIGN.md` varsa, `DESIGN.md`'den cikarilan bilgilerle `create_design_system` cagir
- Mevcut renk, font, roundness kararlarini koru

### Status: `partial`

Kosula uygun dosyalar:

- Bazi token degerleri var ama tam sistem yok
- Tailwind config var ama custom tema minimal
- Renk veya font tercihi belli ama spacing/radius tanimli degil

Bu durumda:

- Mevcut bilgileri seed olarak kullan
- Eksik tokenlari Stitch'in otomatik kararlarına birak
- `create_design_system` cagirisinda mevcut bilgileri doldur, gerisi default

### Status: `none`

Hicbir design system bilgisi bulunamadi.

Bu durumda:

- Proje sektorune ve hedef kitlesine gore makul bir seed renk sec
- Modern, okunabilir bir font cifti sec
- `ROUND_EIGHT` veya `ROUND_TWELVE` roundness baslangici
- `designMd` alanina proje profilinden cikarilan kisa stil notu yaz
- Ilk 3 ekrandan sonra `generate_variants` ile alternatif dene
- Begenileni `update_design_system` ile sabitle

---

## Design System Olusturma Sablonu

```python
create_design_system(
  projectId="{{project_id}}",
  designSystem={
    "displayName": "{{project_name}} Design System",
    "theme": {
      "colorMode": "{{LIGHT | DARK}}",  # proje profilinden
      "headlineFont": "{{INTER | DM_SANS | PLUS_JAKARTA_SANS | ...}}",  # sektore uygun
      "bodyFont": "{{INTER | DM_SANS | PLUS_JAKARTA_SANS | ...}}",
      "roundness": "{{ROUND_EIGHT | ROUND_TWELVE | ROUND_FULL}}",
      "customColor": "{{proje_primary_color | sektor_default}}",
      "colorVariant": "{{TONAL_SPOT | VIBRANT | NEUTRAL | ...}}",
      "designMd": """
        {{style_note}}
        Product type: {{project_type}}
        Sector: {{sector}}
        Target: {{target_audience}}
      """
    }
  }
)
```

### Sektor-Font Onerileri

| Sektor | Headline Font Onerileri | Body Font Onerileri | Sebep |
|--------|------------------------|--------------------|----|
| fintech | INTER, DM_SANS, GEIST | INTER, DM_SANS | Guvenilirlik, okunabilirlik |
| healthcare | PLUS_JAKARTA_SANS, INTER | PLUS_JAKARTA_SANS, INTER | Sakinlik, netlik |
| e-commerce | MANROPE, SORA, DM_SANS | INTER, DM_SANS | Modernlik, taraniabilirlik |
| education | NUNITO_SANS, LEXEND | NUNITO_SANS, LEXEND | Yakinlik, okunaklılik |
| social | PLUS_JAKARTA_SANS, GEIST | INTER, PLUS_JAKARTA_SANS | Yasam, enerji |
| productivity | INTER, GEIST, SPACE_GROTESK | INTER, GEIST | Netlik, verimlilik |
| saas | INTER, DM_SANS, IBM_PLEX_SANS | INTER, DM_SANS | Profesyonellik |
| media | EPILOGUE, SORA, MANROPE | INTER, DM_SANS | Karakter, okuma deneyimi |

Bu oneriler zorunlu degil, baslangic noktasidir. Stitch'in kendi zekasi da dikkate alinir.

---

## EKRAN URETIM PROTOKOLU

---

## Onerilen Uretim Sirasi

### Varsayilan siralama: Derived Project Baseline Build

1. Design system kurulumu
2. System / utility starter screens
3. Auth starter screens
4. Onboarding starter screens (proje turune gore)
5. Main shell starter screens
6. Vertical slice reference screens
7. Sektor-ozel ekranlar
8. Foundation / reference test UIs (proje turune gore)
9. Feedback-state ve coverage genisletme turu

### Sektor-Ozel Siralama

Eger derived project belirli bir sektorde ise, sektor-ozel ekranlar vertical slice'dan sonra, foundation'dan once uretilir.

---

## Starter Flow Haritasi

Derived project ekranlari birbirinden bagimsiz vitrinler degil, bir akisin parcalaridir.

Varsayilan akis su mantikla dusunulmelidir:

1. `Splash Screen`
2. `Full-screen App Bootstrap Loading`
3. Buradan olasi dallanmalar:
   - `Force Update`
   - `Maintenance`
   - `No Internet / Offline`
   - `Full-screen Error`
   - auth girisi
4. Auth girisi:
   - `Login`
   - `Register`
   - `Forgot Password`
   - `Reset Password`
   - `Email Verification / OTP`
   - `Biometric Prompt`
5. Ilk kullanim sonrasi onboarding (proje turune gore):
   - `Welcome Slides`
   - `Permission Primer`
   - `Profile Setup`
6. Sonra ana kabuk:
   - `Home / Dashboard`
   - `Profile`
   - `Edit Profile`
   - `Settings`
7. Settings alt akislari:
   - `Notification Preferences`
   - `Change Password`
   - `Delete Account`
   - `About / Legal`
8. Feature referans akisi / vertical slice:
   - `List Screen`
   - `Detail Screen`
   - `Create / Edit Form Screen`
9. Sektor-ozel akis (fintech ornegi):
   - `Transaction List`
   - `Transaction Detail`
   - `Transfer Form`
   - `Balance Dashboard`

Kural:

- her ekran yalnizca kendi semantigini tasimaz
- ayni zamanda bu akista nereye baglandigi da briefing icinde gorunmelidir
- sektor-ozel ekranlar, base flow'un uzantisi olarak konumlandirilir

---

## PROMPT MIMARISI

---

## Prompt Katmanlari

Tum prompt'lar su formulu izlemelidir:

```text
Design style: [PROJE_PROFILI_STIL_NOTU]

Project context:
[PROJE_PROFILI_OZETI]

Platform:
[web / mobile]

Device:
[Desktop / Mobile]

Screen:
[EKRAN_ADI]

Purpose:
[EKRANIN_SEMANTIC_AMACI]

This screen should include:
- [ICERIK_1]
- [ICERIK_2]
- [ICERIK_3]

User actions:
- [AKSIYON_1]
- [AKSIYON_2]
- [AKSIYON_3]

Important states:
- [DEFAULT_STATE]
- [EMPTY_OR_PRECONDITION_STATE]
- [ERROR_OR_WARNING_STATE]
- [SUCCESS_OR_CONFIRMATION_STATE]

Relevant feedback levels:
- [APP_LEVEL / SCREEN_LEVEL / SECTION_LEVEL / COMPONENT_LEVEL / INLINE / TRANSIENT]

Required constraints:
- semantic token-first thinking
- light and dark mode readiness
- accessible hierarchy and readable contrast
- responsive behavior appropriate to the chosen platform
- platform-natural behavior if this is a mobile-first screen

User flow:
[KISA_AKIS]

Do not make this screen about:
- [DEGIL_1]
- [DEGIL_2]
```

Kural:

- bir ekran iki platformda da yasayacaksa varsayilan olarak iki ayri prompt ac
- `both` sadece ayni semantic yuzeyin neredeyse degismeden tasinabildigi durumlarda kullan

---

## Otomatik Prompt Uretim Mantigi

Agent, proje profilinden ve gap analizinden cikardigi her eksik ekran icin prompt'u otomatik olusturur.

Prompt olusturma adimlari:

1. Proje profili → `Design style` ve `Project context` bloklari doldurulur
2. Ekran ailesi tanimlarindan → `Screen`, `Purpose`, `This screen should include` doldurulur
3. Proje turune gore → `Platform`, `Device` belirlenir
4. Ekranin semantigine gore → `Important states`, `Relevant feedback levels` eklenir
5. Flow haritasindan → `User flow` ve `Do not make this screen about` eklenir

---

## RUN THIS EXACT AGENT PROMPT

Bu blok, dosyanin otonom calistirilabilir parcasidir.
Agent bu dosyanin tamamini okudugunda asagidaki blogu referans kurallariyla birlikte otonom olarak uygular.
Dosyanin geri kalanindaki ekran aile tanimlari, ornek prompt'lar ve kalite kontrol listeleri canli referanstir — agent, her ekran icin ilgili bolumu bulur ve kullanir.

```text
You are an execution agent such as Codex or Claude Code.
You are creating the complete UI system for a derived project from the boilerplate by using Google Stitch MCP as the design execution layer.
Work autonomously from this single brief.
Do not wait for additional screen-by-screen prompts unless you are truly blocked by a missing artifact.
Do not ask the user for any input. Scan the project, make decisions, and generate all screens.

IMPORTANT: This document contains screen family definitions, example prompts, and quality rules below the RUN PROMPT section.
Use those sections as live reference when generating each screen.
For each screen family, find the matching section in this document and use its example prompts as templates.
Fill template variables ({{style_note}}, {{project_context}}, {{sector}}, etc.) from the project profile you build in Phase 1.
If a screen has no example prompt in this document, construct one following the same Prompt Architecture pattern.

PHASE 1 — PROJECT SCANNING:

Scan the derived project to build a project profile:
1. Read package.json (or equivalent) for project name, tech stack, and dependencies.
2. Scan directory structure for existing screens, components, and features.
3. Check for DESIGN.md, tailwind.config, theme files, and token definitions.
4. Read README.md, CLAUDE.md, BOUNDARY.md, product.md for project purpose and scope.
5. Check i18n configuration for primary locale.
6. Scan navigation and auth structure.

Produce a structured project profile with: project_type, sector, target_audience, tech_stack, design_system status, existing_screens, locale.

PHASE 2 — GAP ANALYSIS:

Compare existing screens against:
1. Mandatory screen families for the detected project_type (system/utility, auth, onboarding, main shell, vertical slice, foundation/reference).
2. Sector-specific screen families based on detected sector.
3. Produce a prioritized list of screens to generate.

PHASE 3 — DESIGN SYSTEM SETUP:

1. If DESIGN.md exists, continue from it and preserve system continuity.
2. If a design system exists in Stitch (check via list_design_systems), use it.
3. If no design system exists, create one using create_design_system with:
   - Colors aligned to the project's sector and brand
   - Modern, readable font pairing
   - Appropriate roundness for the project type
   - A designMd that captures the project's visual intent
4. After creation, immediately call update_design_system to apply it.

PHASE 4 — SCREEN GENERATION:

Use Google Stitch MCP tools to create screens autonomously.
Follow this build order:
1. System / utility screens
2. Auth screens
3. Onboarding screens (if applicable for project type)
4. Main shell screens
5. Vertical slice reference screens
6. Sector-specific screens
7. Foundation / reference test screens (if applicable)

For each screen, follow this exact cycle:

  STEP 1 — GENERATE: Call generate_screen_from_text with a semantic brief.
  STEP 2 — WAIT: Do not immediately start the next screen. Allow the generation to complete.
  STEP 3 — VERIFY: Call get_screen or list_screens to confirm the screen was created successfully.
  STEP 4 — DECIDE:
    - If created successfully → proceed to the next screen (back to step 1).
    - If timeout occurred → do NOT regenerate immediately. Call list_screens or get_screen to check if the screen was created despite the timeout. Timeouts do not mean failure — the design may have been created in the background. Only regenerate if verification confirms the screen does not exist.
    - If a real error occurred → evaluate the error, pause if needed, then retry once.

Screen generation rules:
- Use generate_screen_from_text with a semantic brief (not pixel instructions)
- Set deviceType based on platform rules (MOBILE for native-semantic, DESKTOP for web-semantic)
- Use modelId GEMINI_3_1_PRO for critical screens (auth, dashboard, main shell)
- Use modelId GEMINI_3_FLASH for reference/test screens if speed is needed
- Include purpose, content regions, user actions, important states, and feedback levels
- Never create two screens back-to-back without verifying the previous one first
- If quality visibly degrades in consecutive screens, pause generation and let the system recover before continuing

Timeout and error handling:
- Timeout ≠ failure. A timeout means the response was not received in time, not that the operation failed.
- After a timeout, always verify before regenerating. Blind regeneration creates duplicate screens.
- If duplicate screens are found (via list_screens), delete the duplicates before continuing.
- If three consecutive timeouts occur, pause the generation run and report the issue.

PHASE 5 — DESIGN SYSTEM APPLICATION:

After all screens are generated:
1. Get project details via get_project to retrieve screen instance IDs.
2. Apply the design system to all screens via apply_design_system.
3. Verify visual consistency across the set.

You are not being asked to manually obey fixed visual design decisions.
Use your own design intelligence.
Do not ask for exact colors, exact font names, exact spacing, exact layout coordinates, or fixed component geometry.

Design style:
A premium, modern product experience aligned to the project's sector and purpose.
Clean, focused, and high-trust.
Strategic minimalism over decorative noise.
Use strong hierarchy, polished depth, and modular composition where appropriate.
Use contemporary 2025-2026 quality cues without becoming ornamental or trend-chasing.

2025-2026 trend interpretation:
- favor calm, high-trust, task-supportive interfaces over noisy dashboard aesthetics
- use meaningful micro-interactions, not decorative motion
- use modular/bento-like composition only when it improves scanning and task structure
- treat glass, translucency, and layered depth as restrained tools, not visual gimmicks
- allow strong typography and refined contrast-driven hierarchy
- support AI-aware or assistant-like surfaces only when they are semantically justified
- keep web experiences performance-aware and sustainability-aware
- keep mobile experiences native-feeling rather than web-stretched

Autonomous execution rules:
- complete the mandatory baseline screen families without waiting for additional prompts
- complete sector-specific screen families based on the project profile
- preserve one coherent design system across the whole run
- make reasonable UX assumptions quietly and proceed
- prefer platform-natural behavior over fake parity
- if a screen exists on both web and mobile but should not share the exact same structure, create platform-appropriate variants under the same design system
- do not stop after only one family or one screen
- after generating screens, visually inspect and refine them through the Stitch MCP workflow when possible

Screen pacing and quality rules:
- do not fire multiple generate_screen_from_text calls back-to-back without verification between them
- after each screen generation, verify it exists via get_screen or list_screens before starting the next one
- if a timeout occurs, do NOT regenerate blindly — first check if the screen was created despite the timeout
- timeout does not equal failure; the generation may have succeeded in the background
- if consecutive screen quality visibly drops, pause and let the system recover before continuing
- never allow duplicate screens — if duplicates are found, remove them immediately
- if three consecutive timeouts occur, halt the run and report the issue rather than continuing blindly

Language rule:
- use the project's primary locale for placeholder copy
- do not mix languages inside a single screen

Platform rules:
- mobile-semantic screens must be designed as mobile-first surfaces
- reference/test UI screens can be desktop-first
- cross-platform screens should feel native to their platform rather than forced into one identical layout

Feedback rules:
- use app-level states only for truly global blockers
- use screen-level or section-level states when only part of the flow is affected
- prefer inline validation and transient success feedback where appropriate

Best-practice rules:
- align with WCAG 2.2 thinking for contrast, focus visibility, keyboard access, and target sizing
- align with Apple HIG thinking for hierarchy, consistency, Dynamic Type, reduced motion, and platform-natural mobile behavior
- align with Android adaptive quality guidance for large screens, keyboard/mouse/hover input, and multipane or rail/drawer patterns where appropriate
- do not treat large screens as stretched phone screens
- do not treat accessibility as a post-pass
- do not trade clarity for trendiness

Required constraints for every screen:
- semantic token-first thinking
- readable hierarchy and accessible contrast
- light and dark mode readiness
- platform-appropriate responsive behavior
- strong recovery and feedback thinking
- reusable starter-screen quality, not throwaway demo quality
- meaningful motion with reduced-motion awareness
- web performance and sustainability awareness where relevant

Do not do these things:
- do not copy any existing product visually
- do not over-index on analytics dashboards
- do not make every screen card-heavy just because bento layouts are trendy
- do not create decorative marketing hero sections where utility screens are needed
- do not force all problems into full-screen states
- do not ask for pixel-level clarification unless truly blocked

Completion standard:
Do not consider the run complete until:
- the project profile has been built from scanning
- the gap analysis has identified all missing screens
- the design system is established and coherent
- the full baseline flow exists from system entry to main shell
- auth and onboarding are covered (if applicable for project type)
- settings subflows are present
- at least one credible vertical slice path exists
- sector-specific screens are present (if applicable)
- the whole set feels like one coherent product system
- if the environment supports DESIGN.md export, finish with that export or clearly state that export remains as the next step
```

---

## EKRAN AILE TANIMLARI

Bu bolum, her zorunlu ekran ailesinin semantic tanimi, brief mantigi ve ornek prompt'larini icerir.

---

## 1. System / Utility Starter Screens

### Zorunlu system ekranlari

1. `Splash Screen` (mobile semantic)
2. `Force Update Screen`
3. `No Internet / Offline Screen`
4. `Maintenance Screen`
5. `Not Found / 404 Screen`
6. `Full-screen Error Screen`
7. `Full-screen App Bootstrap Loading Screen`

### Bu ekranlarda neyi brief etmelisin

- durumun ne oldugu
- kullanicinin ne yapabilecegi
- ekranin blocker mi, recoverable mi oldugu
- feedback dilinin tonunu

### Ornek prompt — Offline Screen

```text
Design style: {{style_note}}

Project context:
{{project_context}}

Platform: {{platform}}
Device: {{device_type}}

Screen:
No Internet / Offline Screen

Purpose:
Show a clear, calm, recoverable full-screen offline state when the app cannot continue because network access is unavailable.

This screen should include:
- a clear offline message
- short explanation text
- retry action
- optional secondary guidance for checking connection
- visual state that distinguishes this from maintenance or generic error

User actions:
- retry connection
- return when the connection is restored

Important states:
- initial offline
- retry in progress
- auto-recovery ready state

User flow:
The user opens or returns to the app without connectivity, understands the issue quickly, retries, and recovers when the connection returns.

Do not make this screen about:
- account problems
- runtime crash handling
```

### Ornek prompt — 404 Screen

```text
Design style: {{style_note}}

Project context:
{{project_context}}

Platform: web
Device: Desktop

Screen:
Not Found / 404 Screen

Purpose:
Provide a dead-end-safe screen when a route or destination cannot be found.

This screen should include:
- clear not-found title
- short explanation
- primary action to go home
- secondary action to go back if useful

User actions:
- return to a safe destination

Important states:
- default not-found state
- optional deep-link context hint if useful

User flow:
The user lands on a missing route and can recover immediately without confusion.

Do not make this screen about:
- runtime app failure
- maintenance or offline status
```

---

## 2. Auth Starter Screens

### Zorunlu auth ekranlari

1. `Login Screen`
2. `Register Screen`
3. `Forgot Password Screen`
4. `Reset Password Screen`
5. `Email Verification / OTP Screen`
6. `Biometric Prompt Screen` (mobile semantic)

### Brief ederken unutma

- form state mantigi
- validation
- success / failure ayrimi
- fallback yollar
- iOS / native-quality auth hissi
- proje sektorune uygun guven sinyalleri

### Ornek prompt — Login Screen

```text
Design style: {{style_note}}

Project context:
{{project_context}}

Platform: {{platform}}
Device: {{device_type}}

Screen:
Login Screen

Purpose:
Provide the primary sign-in entry point for unauthenticated users.

This screen should include:
- email input
- password input with visibility toggle
- primary sign-in action
- forgot password link
- register link
- optional social sign-in area
- optional biometric continuation area if it fits the system

User actions:
- sign in
- go to registration
- go to password recovery

Important states:
- default
- validation errors
- credential failure
- loading on submit
- success / redirect-ready

User flow:
The user enters credentials, understands failures inline, and proceeds into the main app shell on success.

Do not make this screen about:
- onboarding education
- settings or dashboard content
```

### Ornek prompt — OTP Screen

```text
Design style: {{style_note}}

Project context:
{{project_context}}

Platform: {{platform}}
Device: {{device_type}}

Screen:
Email Verification / OTP Screen

Purpose:
Let the user enter a one-time verification code after registration or a protected auth flow.

This screen should include:
- short explanatory title
- masked destination hint if appropriate
- segmented OTP entry pattern
- resend code affordance
- countdown timer
- inline error messaging

User actions:
- enter code
- paste code
- resend code

Important states:
- waiting for code
- invalid code
- resend locked
- resend available
- verification success

User flow:
The user receives a code, enters or pastes it, sees clear validation, and proceeds on success.

Do not make this screen about:
- full onboarding
- account settings
```

---

## 3. Onboarding Starter Screens

### Zorunlu onboarding ekranlari

1. `Welcome Slides`
2. `Permission Primer`
3. `Profile Setup`

### Bu ekranlarda ana vurgu

- kisa ve net olmak
- asiri pazarlama olmamak
- kullaniciyi zorlamamak
- native quality hissi vermek
- proje amacini ozetlemek

### Ornek prompt — Welcome Slides

```text
Design style: {{style_note}}

Project context:
{{project_context}}

Platform: {{platform}}
Device: {{device_type}}

Screen:
Welcome Slides

Purpose:
Introduce the product in a short onboarding flow with 3 to 5 slides.

This screen should include:
- concise title and supporting text per slide
- illustration or visual storytelling area
- progress indication
- next / continue action
- skip option
- final primary CTA

User actions:
- advance slides
- skip onboarding
- start using the app

Important states:
- first slide
- intermediate slide
- final CTA slide

User flow:
The user quickly understands the product and moves into the next required onboarding or auth step.

Do not make this screen about:
- dense feature documentation
- settings detail
```

### Ornek prompt — Permission Primer

```text
Design style: {{style_note}}

Project context:
{{project_context}}

Platform: mobile
Device: Mobile

Screen:
Permission Primer

Purpose:
Explain the value of a system permission in plain language before requesting it.

This screen should include:
- one permission focus at a time
- icon or symbolic cue
- simple why-this-matters explanation
- primary allow action
- secondary not-now action

User actions:
- continue to system permission
- postpone permission

Important states:
- push notification primer
- location primer
- camera or media primer

User flow:
The user understands why permission is needed and makes an informed decision before the native system prompt.

Do not make this screen about:
- legal settings management
- generic onboarding carousel content
```

---

## 4. Main App Shell Starter Screens

### Zorunlu main shell ekranlari

1. `Home / Dashboard`
2. `Profile`
3. `Edit Profile`
4. `Settings`
5. `Notification Preferences`
6. `Change Password`
7. `Delete Account`
8. `About / Legal`

### Brief mantigi

- bunlar urune ozel son ekranlar degil
- bunlar reusable starter surface'ler
- design system'in yasayan ornekleri olmali
- proje sektorune uygun icerik onerileri icermeli

### Ornek prompt — Home / Dashboard

```text
Design style: {{style_note}}

Project context:
{{project_context}}

Platform: {{platform}}
Device: {{device_type}}

Screen:
Home / Dashboard

Purpose:
Serve as the authenticated user's default landing screen, showing a welcoming overview, quick actions, and starter content regions relevant to {{sector}}.

This screen should include:
- welcome area
- quick action cards
- recent activity or recent items section
- one or two content modules that reflect the project's domain
- navigation-aware shell feeling

User actions:
- open key destinations
- scan recent activity
- continue into the main product

Important states:
- first-use but authenticated
- normal populated starter state
- section-level loading
- section-level empty state

User flow:
The user lands after auth, understands the shell quickly, and moves deeper into the product.

Do not make this screen about:
- domain-specific analytics overload
- full admin-table density everywhere
```

### Ornek prompt — Settings

```text
Design style: {{style_note}}

Project context:
{{project_context}}

Platform: {{platform}}
Device: {{device_type}}

Screen:
Settings

Purpose:
Provide a reusable settings hub covering account, notifications, appearance, security, about, and destructive actions.

This screen should include:
- grouped settings sections
- navigation items
- in-place toggles where appropriate
- theme and language preferences
- biometric preference entry
- destructive zone for sign out and delete account

User actions:
- change preferences
- navigate to sub-settings
- sign out

Important states:
- default
- saving / toggling
- permission-disabled banner if relevant
- destructive confirmation entry point

User flow:
The user scans grouped settings, updates preferences confidently, and navigates into deeper sub-settings when needed.

Do not make this screen about:
- dashboard storytelling
- marketing content
```

---

## 5. Vertical Slice Reference Screens

### Zorunlu vertical slice ekranlari

1. `List Screen`
2. `Detail Screen`
3. `Create / Edit Form Screen`

### Bu ekranlar neden kritik

- data fetching davranisini somutlastirir
- loading / empty / error state kullanimini gosterir
- form submit lifecycle mantigini gosterir
- yeni feature yazacak kisi icin referans olur
- sektor-ozel ekranlarin temelini olusturur

### Ornek prompt — List Screen

```text
Design style: {{style_note}}

Project context:
{{project_context}}

Platform: {{platform}}
Device: {{device_type}}

Screen:
List Screen

Purpose:
Show a reusable paginated list screen pattern that can support real product data later. Context: {{sector}} domain.

This screen should include:
- page title and context header
- filter/search affordance
- list items or cards
- pagination or infinite-loading logic cues
- empty state
- inline retry area for list-level failure

User actions:
- browse items
- open an item
- search or filter
- refresh or retry

Important states:
- first load
- populated list
- no results
- empty source data
- list failure
- next-page loading

User flow:
The user enters the list, understands content status quickly, browses items, and can recover from empty or failed states.

Do not make this screen about:
- auth entry
- dashboard-only summary content
```

### Ornek prompt — Create / Edit Form Screen

```text
Design style: {{style_note}}

Project context:
{{project_context}}

Platform: {{platform}}
Device: {{device_type}}

Screen:
Create / Edit Form Screen

Purpose:
Show a reusable create/edit form pattern with validation, dirty-state thinking, submit lifecycle, and success/error handling. Context: {{sector}} domain.

This screen should include:
- form header with clear mode awareness
- text fields
- textarea or long-form input
- select or picker field
- media or attachment placeholder if useful
- save and cancel actions
- validation guidance

User actions:
- enter data
- save
- cancel / discard

Important states:
- create mode default
- edit mode with preloaded data
- validation errors
- submit loading
- success confirmation
- failure / retry

User flow:
The user enters or edits data, receives clear validation, understands success or failure, and returns to the previous list or detail screen.

Do not make this screen about:
- multi-step wizard
- settings form
```

---

## 6. Sektor-Ozel Ekranlar

Bu bolum, proje profilinde tespit edilen sektore gore ek ekran prompt'larini sunar.
Agent, sadece tespit edilen sektore ait bolumu kullanir.

### Fintech Ozel Ekranlar

```text
Ek ekranlar: Transaction List, Transaction Detail, Transfer Form, Balance Dashboard, Card Management, KYC/Verification

Her ekranin brief mantigi:
- finansal veri hassasiyeti
- islem dogrulama ve onay adimlari
- guven sinyalleri ve guvenlik hissi
- numerik veri okunabilirligi
- hata durumunda acik recovery yollari
```

### E-commerce Ozel Ekranlar

```text
Ek ekranlar: Product List, Product Detail, Cart, Checkout, Order History, Order Detail, Wishlist, Reviews

Her ekranin brief mantigi:
- gorsel agirlikli urun sunumu
- fiyat ve stok bilgisi netligi
- sepet ve odeme akis guvenilirligi
- filtreleme ve siralama zenginligi
- sosyal kanit ve geri bildirim
```

### Healthcare Ozel Ekranlar

```text
Ek ekranlar: Appointment List, Appointment Detail, Patient Profile, Medical Records, Prescription View

Her ekranin brief mantigi:
- veri gizliligi ve guven
- sakin, stressiz arayuz hissi
- onemli bilgilerin on plana cikmasi
- acil/normal durum ayrimi
- erisilebilirlik onceligi
```

### Education Ozel Ekranlar

```text
Ek ekranlar: Course List, Course Detail, Lesson Player, Progress Dashboard, Quiz/Assessment, Certificate

Her ekranin brief mantigi:
- ogrenme motivasyonunu destekleyen arayuz
- ilerleme gorsellerinin netligi
- icerik odakli, dikkat dagitmayan layout
- interaktif ogeler ve geri bildirim
```

### SaaS Ozel Ekranlar

```text
Ek ekranlar: Dashboard, Analytics, Team Management, Billing, API Keys, Usage Metrics

Her ekranin brief mantigi:
- veri yogunlugu ve okunabilirlik dengesi
- rol bazli erisim gorunurlugu
- plan/fatura ve kullanim seffafligi
- developer-facing yuzeyler icin fonksiyonel minimalizm
```

### Fintech — Ornek Prompt: Transaction Detail

```text
Design style: {{style_note}}

Project context:
{{project_context}}
This is a fintech transaction detail screen. High-trust, clear, numerically readable.

Screen:
Transaction Detail

Purpose:
Show the full details of a single financial transaction with clear status, amount, parties, and timeline.

This screen should include:
- transaction amount and currency with strong visual weight
- status indicator (completed, pending, failed, refunded)
- sender and recipient information
- transaction date, time, and reference number
- category or tag
- receipt or document link if applicable
- support or dispute action

User actions:
- view full details
- share or export receipt
- report or dispute

Important states:
- completed transaction
- pending transaction
- failed transaction with recovery guidance
- refunded transaction

User flow:
The user taps a transaction from the list, reviews all details, and can take action if needed.

Do not make this screen about:
- account overview
- transfer initiation
```

### E-commerce — Ornek Prompt: Product Detail

```text
Design style: {{style_note}}

Project context:
{{project_context}}
This is an e-commerce product detail screen. Visual, scannable, conversion-aware.

Screen:
Product Detail

Purpose:
Show a single product with imagery, pricing, variants, and purchase actions.

This screen should include:
- product image gallery or carousel
- product title and short description
- price and discount information
- variant selectors (size, color, quantity)
- add to cart primary action
- wishlist secondary action
- ratings and review summary
- shipping and return information hint

User actions:
- browse images
- select variants
- add to cart
- add to wishlist
- read reviews

Important states:
- default available product
- out of stock
- limited stock warning
- variant selection active
- added to cart success (transient)

User flow:
The user views product details, selects options, adds to cart, and either continues shopping or proceeds to checkout.

Do not make this screen about:
- checkout flow
- product listing grid
```

### Healthcare — Ornek Prompt: Appointment Detail

```text
Design style: {{style_note}}

Project context:
{{project_context}}
This is a healthcare appointment detail screen. Calm, clear, trust-building.

Screen:
Appointment Detail

Purpose:
Show the full details of a medical appointment with provider, time, location, and preparation instructions.

This screen should include:
- provider name, specialty, and photo
- appointment date, time, and duration
- location or telehealth link
- preparation instructions or notes
- cancel or reschedule action
- add to calendar action

User actions:
- review appointment details
- cancel or reschedule
- add to calendar
- contact provider

Important states:
- upcoming appointment
- past appointment (review mode)
- cancelled appointment
- telehealth vs in-person distinction

User flow:
The user opens an appointment from the list, reviews details, and takes action if needed.

Do not make this screen about:
- medical records
- prescription management
```

Diger sektorler icin agent, gap analizinde belirlenen ek ekranlara ayni brief mantigi uygular:
**semantic amac + icerik + aksiyonlar + state'ler + sektor tonu.**

---

## 7. Foundation / Reference Test Screens

### Zorunlu foundation ekranlari

1. `UI Kit / Component Gallery`
2. `Typography Reference`
3. `Color Roles and Theme Reference`
4. `Spacing / Radius / Elevation Reference`
5. `Iconography and Symbol Reference`
6. `Navigation Patterns Reference`
7. `Form Patterns and Validation Reference`
8. `Data Display Patterns Reference`
9. `Feedback States Reference`
10. `Overlay Patterns Reference`
11. `Motion and Interaction Reference`
12. `Accessibility and Contrast Reference`
13. `Utility and Quality Patterns Reference`

### Bu ekranlar neden var

- reusable component coverage'i gormek
- Storybook benzeri referans alan olusturmak
- tasarim dilini erken sabitlemek
- design-to-code gecisinde belirsizligi azaltmak
- state, overlay, utility ve accessibility bosluklarini erken kapatmak

### Component Coverage Crosswalk

Foundation ekranlari, component kataloguyla eslestirilerek dusunulmelidir.

- `UI Kit / Component Gallery`
  veri ve form cekirdegi: `Avatar`, `Badge`, `Card`, `Chip`, `ListItem`, `Button`, `Checkbox`, `Radio`, `Select`, `Switch`, `TextArea`, `TextField`
- `Form Patterns and Validation Reference`
  gelismis input aileleri: `PasswordField`, `PhoneInput`, `SearchBar`, `DatePicker`, `Slider`, `FormActions`, `FormGroup`, `FieldShell`
- `Navigation Patterns Reference`
  navigasyon aileleri: `Header`, `SegmentedControl`, `StepIndicator`, `TabBar`
- `Overlay Patterns Reference`
  overlay aileleri: `ActionSheet`, `BottomSheet`, `ConfirmDialog`, `Drawer`, `Modal`, `Popover`, `Tooltip`
- `Feedback States Reference`
  feedback ve state aileleri: `Banner`, `ConsentBanner`, `NetworkStatusBanner`, `Toast`, `EmptyState`, `ErrorState`, `LoadingState`, `ProgressBar`, `Skeleton`, `Spinner`
- `Motion and Interaction Reference`
  interaction ve utility aileleri: `Accordion`, `PullToRefreshWrapper`, `InfiniteScrollList`
- `Accessibility and Contrast Reference`
  erisilebilirlik aileleri: `SkipToContent`, focus-visible, dynamic type, contrast-sensitive surfaces
- `Utility and Quality Patterns Reference`
  kalite ve utility aileleri: `AppLockScreen`, `StickyFooter`, `WebViewPlaceholder`, `CountdownTimer`, `DividerWithLabel`

Eger bu ailelerden biri Stitch turetilen ekranlarda hic gorunmuyorsa, coverage eksik sayilir.

### Sablon Degiskenleri ve Placeholder'lar

Asagidaki ornek prompt'larda `{{variable}}` sablonlari kullanilmistir:

- `{{style_note}}` → Proje profili taramasindan cikarilan stil notu (`Onerilen Stil Notu` bolumundeki formul)
- `{{project_context}}` → Proje ozeti, teknik stack, design system durumu ve sektor bilgisi (`Boilerplate Baglami` bolumundeki context + proje profili)
- `{{platform}}` → Hedef platform: `web` veya `mobile`
- `{{device_type}}` → Cihaz tipi: `Desktop` veya `Mobile`
- `{{sector}}` → Proje profili taramasindan cikarilan sektor adi
- `{{project_id}}` → Stitch'teki proje ID'si (`create_project` ciktisi)

Bu degiskenler agent'a verilmeden once gercek proje verisi ile doldurulmalidir.
Agent, autonomous full build modunda bu degiskenleri proje profilinden otomatik olarak doldurur.

### Compact Semantic Core Kurali

Asagidaki ornek prompt'larin cogu, okunabilirligi korumak icin kisaltilmis semantic cekirdeklerdir.
Onlari birebir degil, `Iterative Tam Prompt` ya da `Standart Footer` ile birlikte kullan.
Autonomous full build modunda agent, bu ornekleri tam prompt formatina otomatik genisletir.

### Ornek prompt — UI Kit / Component Gallery

```text
Design style: {{style_note}}

Project context:
{{project_context}}
This screen is an internal reference screen similar in purpose to a premium starter kit component gallery.
Do not copy any existing UI kit visually.

Screen:
UI Kit / Component Gallery

Purpose:
Show the core reusable UI building blocks in one internal reference screen so design and implementation can share the same visual vocabulary.

This screen should include:
- button variants and sizes
- text fields, password field, textarea, select, search, checkbox, radio, switch
- cards, badges, chips, list items, avatars, banners, toast examples
- tabs, segmented controls, header patterns, empty state and error state blocks
- a small table/list preview

User actions:
- inspect component variants
- compare states
- understand interaction hierarchy

Important states:
- default
- hover / focus / pressed where meaningful
- disabled
- loading
- error / validation

User flow:
This is a browse-and-reference screen for internal use, not an end-user workflow.

Do not make this screen about:
- real product data
- dashboard storytelling
```

### Ornek prompt — Feedback States Reference

```text
Design style: {{style_note}}

Project context:
{{project_context}}
This is an internal reference screen for the project's feedback and state system.

Screen:
Feedback States Reference

Purpose:
Show how loading, empty, error, success, warning, and recovery states should appear across the project.

This screen should include:
- full-screen loading
- section-level loading
- empty state with CTA
- no-results empty state
- error state with retry
- success confirmation examples
- inline validation examples
- banner and toast examples
- destructive confirmation example

User actions:
- inspect recovery patterns
- compare feedback surface types

Important states:
- full-screen state
- section-level state
- inline state
- transient feedback state

User flow:
Internal review screen for feedback quality and state coverage.

Do not make this screen about:
- analytics dashboard content
- dense data visualization
```

### Ornek prompt — Typography Reference

```text
Design style: {{style_note}}

Project context:
{{project_context}}
This screen is an internal typography and readability reference.

Screen:
Typography Reference

Purpose:
Show the typographic hierarchy, text roles, weight spectrum, helper text language, caption rhythm, and readability behavior used by the project.

This screen should include:
- display, screen title, section title, body, helper, caption, overline, status text examples
- weight variations
- long-form paragraph sample
- button label and form label samples
- dark and light readability snippets if useful

User actions:
- review text hierarchy
- compare roles and readability

Important states:
- default text roles
- emphasized vs muted text
- success / warning / error text examples

User flow:
Internal review screen for text hierarchy and readability.

Do not make this screen about:
- marketing hero design
- component showcase breadth
```

### Ornek prompt — Motion and Interaction Reference

```text
Design style: {{style_note}}

Project context:
{{project_context}}
This is an internal reference screen for interaction quality, motion restraint, and state transitions.
Motion should support clarity, not decoration.

Screen:
Motion and Interaction Reference

Purpose:
Show how hover, pressed, focus, expand/collapse, sheet/dialog entry, loading transition, and gesture-aware feedback should feel across the project.

This screen should include:
- hover, focus, pressed, and selected examples
- accordion or disclosure interaction
- modal, sheet, or popover entry/exit example
- loading-to-content transition example
- swipe or gesture-aware pattern if useful for mobile
- reduced-motion-friendly behavior cues

User actions:
- inspect interaction feedback
- compare transition restraint and clarity

Important states:
- hover state
- focus-visible state
- pressed state
- expanded state
- loading transition state
- reduced-motion-friendly state

User flow:
Internal review screen for interaction polish and motion discipline.

Do not make this screen about:
- cinematic animation
- decorative motion showcases
```

### Ornek prompt — Accessibility and Contrast Reference

```text
Design style: {{style_note}}

Project context:
{{project_context}}
This is an internal reference screen focused on accessibility readiness and contrast-aware design behavior.

Screen:
Accessibility and Contrast Reference

Purpose:
Show how readable hierarchy, focus visibility, disabled states, contrast-sensitive surfaces, large text behavior, and assistive-friendly UI patterns should appear in the project.

This screen should include:
- focus-visible examples
- readable text contrast examples
- disabled vs inactive distinction
- large-text / dynamic type stress cases
- form error readability
- keyboard and screen-reader friendly interaction cues

User actions:
- inspect readability
- compare accessibility-sensitive states

Important states:
- default readable state
- focus-visible state
- disabled state
- error readability state
- large-text stress state

User flow:
Internal review screen for accessibility-sensitive visual behavior.

Do not make this screen about:
- marketing copy
- dense dashboard data
```

### Ornek prompt — Utility and Quality Patterns Reference

```text
Design style: {{style_note}}

Project context:
{{project_context}}
This is an internal reference screen covering utility, quality, and protection-oriented UI patterns.

Screen:
Utility and Quality Patterns Reference

Purpose:
Show non-feature but production-critical UI patterns that often get missed in starter kits.

This screen should include:
- app lock or protected-entry pattern
- network status banner
- consent/banner examples
- sticky footer pattern
- skip-to-content or accessibility utility cue
- webview placeholder or embedded-content fallback

User actions:
- inspect edge-case utility patterns
- compare safety and utility surfaces

Important states:
- protected state
- warning banner state
- fallback placeholder state
- utility action state

User flow:
Internal review screen for non-feature but implementation-critical UI patterns.

Do not make this screen about:
- core product workflow
- analytics or dashboard storytelling
```

---

## Baslangic Ekran Envanteri

Bu liste, derived project'te ilk turda kapsanmasi tavsiye edilen minimum ekran envanteridir.
Proje turune ve sektore gore ek ekranlar bu base'in ustune eklenir.

### Foundation / Test UIs

- UI Kit / Component Gallery
- Typography Reference
- Color Roles / Theme Reference
- Spacing / Radius / Elevation Reference
- Iconography Reference
- Navigation Patterns Reference
- Form Patterns / Validation Reference
- Data Display Patterns Reference
- Feedback States Reference
- Overlay Patterns Reference
- Motion and Interaction Reference
- Accessibility and Contrast Reference
- Utility and Quality Patterns Reference

### System / Utility

- Splash Screen
- Force Update
- Offline
- Maintenance
- 404
- Full-screen Error
- App Bootstrap Loading

### Auth

- Login
- Register
- Forgot Password
- Reset Password
- OTP Verification
- Biometric Prompt

### Onboarding

- Welcome Slides
- Permission Primer
- Profile Setup

### Main Shell

- Home / Dashboard
- Profile
- Edit Profile
- Settings
- Notification Preferences
- Change Password
- Delete Account
- About / Legal

### Vertical Slice

- List Screen
- Detail Screen
- Create / Edit Form Screen

### Sektor-Ozel (Proje Profilinden Belirlenir)

Fintech: Transaction List, Transaction Detail, Transfer Form, Balance Dashboard, Card Management, KYC
E-commerce: Product List, Product Detail, Cart, Checkout, Order History, Wishlist, Reviews
Healthcare: Appointment List, Appointment Detail, Patient Profile, Medical Records, Prescription
Education: Course List, Course Detail, Lesson Player, Progress Dashboard, Quiz, Certificate
SaaS: Dashboard, Analytics, Team Management, Billing, API Keys, Usage Metrics

---

## "Coverage Genisligi" Icin Dogru Yorum

Metronic benzeri bir starter kit'ten alinacak ana ders:

- kapsam genisligi
- referans ekran zenginligi
- test UI / utility UI varligi
- reusable component coverage
- starter shell mantigi

Herhangi bir starter kit'ten alinmayacak sey:

- gorsel kopya
- ayni admin-template dili
- ayni dashboard yogunlugu
- ayni grafik / tablo default'u

Kural:

**Coverage mantigi = evet.**
**Gorsel kopyasi = hayir.**

---

## ITERASYON VE KALITE

---

## Tek Ekran Kurali

Bu kural, ilk autonomous full build sonrasi icin gecerlidir.

Varsayilan iterasyon kurali:

- her prompt'ta tek ekran
- her iterasyonda 1 ana problem

Neden:

- Stitch, tek ekran ve net brief ile daha guclu sonuc verir
- system consistency daha iyi korunur
- bozulma ve scope drift azalir

Istisna:

- yakin iliskili internal reference ekran ailesi bazen ayni oturumda ardarda uretilip ayni system'e baglanabilir
- ama yine de ayni prompt icinde 3-4 ana ekran istemek tavsiye edilmez

---

## Iterasyon Kurallari

Ilk ekran ciktiktan sonra `edit_screens` icin su mantikla ilerle:

- tek seferde tek problem
- same design system
- same semantic role
- same quality level

Ornek iterasyon brief'leri:

```text
Keep the same design system and overall screen role.
Make the hierarchy clearer and reduce visual noise.
Do not redesign the screen from scratch.
```

```text
Keep the same design system.
Make the feedback states easier to scan and more actionable.
Do not turn the screen into a dashboard.
```

```text
Keep the same semantic role.
Make this feel more like a serious product screen and less like a generic template demo.
```

```text
Keep the same design language.
Increase the sense of polish and structure without adding decorative clutter.
```

---

## Varyant Uretim Kurallari

`generate_variants` araci, mevcut ekranlarin alternatiflerini uretmek icin kullanilir.

### Ne zaman kullanilir

- ilk ciktinin kalitesi kabul edilebilir ama alternatif layout gorulebilir
- design system kurulumu sirasinda farkli renk/font kombinasyonlari denemek icin
- proje sahibine secim sunmak gerektiginde

### Variant secenekleri

| Parametre | Deger | Kullanim |
|-----------|-------|---------|
| `creativeRange` | `REFINE` | Mevcut tasarima cok yakin, kucuk iyilestirmeler |
| `creativeRange` | `EXPLORE` | Dengeli arastirma, varsayilan (onerilen) |
| `creativeRange` | `REIMAGINE` | Radikal alternatifler, temel degisiklikler |
| `aspects` | `LAYOUT` | Sadece layout degisikligi |
| `aspects` | `COLOR_SCHEME` | Sadece renk degisikligi |
| `aspects` | `IMAGES` | Sadece gorsel degisikligi |
| `aspects` | `TEXT_FONT` | Sadece font degisikligi |
| `aspects` | `TEXT_CONTENT` | Sadece metin degisikligi |
| `variantCount` | 1-5 | Uretilecek varyant sayisi (onerilen: 3) |

### Kural

- design system kararlastirma asamasinda `EXPLORE` + `COLOR_SCHEME` + `TEXT_FONT`
- layout iyilestirme asamasinda `REFINE` + `LAYOUT`
- proje sahibine sunum asamasinda `EXPLORE` + tum aspect'ler

---

## State Seviyesi Kurali

Her prompt, ilgili feedback seviyesini dolayli degil acik sekilde dusunmelidir.

Mumkun seviyeler:

1. `app-level`
2. `screen-level`
3. `section-level`
4. `component-level`
5. `inline / field-level`
6. `transient`

Kisa kural:

- splash, force update, maintenance, fatal bootstrap gibi ekranlar `app-level` veya `screen-level`
- dashboard ve list gibi ekranlarda tum sorunlari full-screen yapma; `section-level` state dusun
- form hatalari once `inline`, sonra gerekiyorsa `screen-level`
- success feedback her zaman full-screen olmak zorunda degil; cogunlukla `transient` veya `inline`

---

## Prompt Kontrol Listesi

Ajan talimatini calistirmadan once kontrol et:

- Bu ekran bir `internal reference/test UI` mi yoksa `starter screen` mi?
- Ekranin semantic rolu net mi?
- Reusable component dusuncesi gorunuyor mu?
- Loading / empty / error / success ihtiyaci dusunuldu mu?
- Hedef platform ve device acik yazildi mi?
- Bu ekranin feedback seviyesi dogru mu? app / screen / section / inline / transient
- Light/dark readiness ve accessibility beklentisi briefing icinde gorunuyor mu?
- Gereksiz gorsel yonlendirme var mi?
- Proje sektoru ve amaci prompt'a yansidi mi?
- Ekran proje mantigina mi hizmet ediyor, yoksa gereksiz generic mi oldu?

---

## Final Kalite Kontrolu

Bir ekrani onaylamadan once sunlari sor:

- Bu ekran kendi semantic rolunu acik tasiyor mu?
- Bu ekran proje sektorune uygun mu?
- Coverage amaci yerine getirildi mi?
- Loading / empty / error / success dusunuldu mu?
- Ekran generic CRUD ya da eski admin template gibi mi hissettiriyor?
- Gorsel kalite yuksek ama yine de sistematik mi?
- Gereksiz dekorasyon var mi?
- Stitch'in kendi zekasi calismis mi, yoksa brief fazla ezmis mi?
- Bu ekran starter flow haritasinda dogru yere oturuyor mu?
- Bu ekran ilgili component ailesi coverage'ine katki sagliyor mu?

Bir derived project batch'i onaylamadan once sunlari da sor:

- proje profili dogru cikarildi mi?
- gap analizi tum eksik ekranlari tespit etti mi?
- design system tutarli ve proje sektorune uygun mu?
- system -> auth -> onboarding -> main shell zinciri var mi?
- ayarlar alt akislari eksiksiz mi?
- en az bir vertical slice referansi var mi?
- sektor-ozel ekranlar uretildi mi (varsa)?
- internal reference ekranlariyla component coverage gorunur hale geldi mi?
- export alinabilecek kadar tutarli bir Stitch sistemi olustu mu?

Eger sorun semantic ise prompt'u duzelt.
Eger sorun sadece okunabilirlik / vurgu / yogunluk ise `edit_screens` ile iterasyon yap.

---

## Copy-Paste Prompt Bloklari

Bu bolumdeki prompt'larda iki farkli placeholder formati kullanilir:

- `{{degisken}}` — agent tarafindan proje profilinden otomatik doldurulur (ornegin `{{style_note}}`, `{{project_context}}`)
- `[ALAN]` — her ekran icin agent veya kullanici tarafindan ekrana ozel bilgiyle doldurulur (ornegin `[SCREEN_NAME]`, `[web / mobile]`)

### Iterative Tam Prompt

```text
Design style: {{style_note}}

Project context:
{{project_context}}

Platform:
[web / mobile]

Device:
[Desktop / Mobile]

Screen:
[SCREEN_NAME]

Purpose:
[SHORT_SEMANTIC_PURPOSE]

This screen should include:
- [...]
- [...]
- [...]

User actions:
- [...]
- [...]

Important states:
- [...]
- [...]
- [...]
- [...]

Relevant feedback levels:
- [app-level / screen-level / section-level / component-level / inline / transient]

Required constraints:
- semantic token-first thinking
- light and dark mode readiness
- accessible hierarchy and readable contrast
- responsive behavior appropriate to the chosen platform
- platform-natural behavior if this is a mobile-first screen

User flow:
[SHORT_FLOW]

Do not make this screen about:
- [...]
- [...]
```

### Standart Footer

Compact bir ornek prompt kullaniyorsan, sona su blogu ekle:

```text
Platform:
[web / mobile]

Device:
[Desktop / Mobile]

Relevant feedback levels:
- [app-level / screen-level / section-level / component-level / inline / transient]

Required constraints:
- semantic token-first thinking
- light and dark mode readiness
- accessible hierarchy and readable contrast
- responsive behavior appropriate to the chosen platform
- platform-natural behavior if this is a mobile-first screen
```

---

## DESIGN.md ve Token Mantigi

Derived project'te Stitch, design-to-code pipeline'in ilk halkasidir.
Ama son otorite degildir.

Kritik kural:

- Stitch tasarim uretir
- DESIGN.md export edilir
- sonra bu kararlar projenin token sistemine map edilir
- DESIGN.md ile `22-design-tokens-spec.md` arasinda catisma oldugunda, `22-design-tokens-spec.md` kazanir

Yani prompt icinde sunlari isteme:

- exact token adlari
- Tailwind class detaylari
- NativeWind implementation detaylari

Bunlar Stitch prompt konusu degil.
Bunlar tasarimdan koda gecis asamasinin konusu.

---

## Stitch MCP Arac Referansi

### Uretim Araclari

| Arac | Kullanim | Ne Zaman | Timeout Notu |
|------|---------|---------|-------------|
| `create_project` | Yeni Stitch projesi olusturma | Derived project icin ilk kez Stitch baslatildiginda | Hizli, timeout beklenmez |
| `generate_screen_from_text` | Metin prompt'undan ekran uretme | Her yeni ekran icin ana uretim araci | **Birkaç dakika surebilir. Timeout ≠ basarisizlik. Timeout sonrasi `get_screen` ile dogrula.** |
| `edit_screens` | Mevcut ekrani iyilestirme | Iteratif duzeltme turleri icin | **Birkaç dakika surebilir. Timeout sonrasi retry yapma, once dogrula.** |
| `generate_variants` | Alternatif varyantlar uretme | Layout/renk/font kesfetme, secim sunma | Orta sureli, timeout olabilir |

### Yonetim Araclari

| Arac | Kullanim | Ne Zaman | Timeout Notu |
|------|---------|---------|-------------|
| `list_projects` | Mevcut projeleri listeleme | Derived project'in Stitch projesi var mi kontrolu | Hizli |
| `get_project` | Proje detaylarini alma | Screen instance ID'leri icin (apply_design_system oncesi) | Hizli |
| `list_screens` | Ekran listesi alma | Mevcut ekran envanteri icin + **timeout sonrasi dogrulama icin** | Hizli |
| `get_screen` | Tek ekran detayi | Ekran kontrolu + **uretim sonrasi dogrulama icin** | Hizli |

### Design System Araclari

| Arac | Kullanim | Ne Zaman |
|------|---------|---------|
| `create_design_system` | Yeni DS olusturma | Design system yoksa ilk kurulum |
| `update_design_system` | DS guncelleme | DS ince ayar ve duzeltme |
| `list_design_systems` | Mevcut DS listeleme | DS mevcut mu kontrolu |
| `apply_design_system` | DS'i ekranlara uygulama | Tum ekranlar uretildikten sonra toplu uygulama |

### Model Secimi

| Model | Kullanim | Onerilen Ekranlar |
|-------|---------|-----------------|
| `GEMINI_3_1_PRO` | Yuksek kalite, yavas | Auth, Dashboard, Main Shell, Sektor-ozel kritik ekranlar |
| `GEMINI_3_FLASH` | Hizli, yeterli kalite | Reference/test ekranlar, System/utility ekranlar |

### Device Secimi

| Device | Kullanim |
|--------|---------|
| `MOBILE` | Native mobile-semantic ekranlar (splash, biometric, permission, onboarding) |
| `DESKTOP` | Web-semantic ekranlar (dashboard, reference, settings) |
| `TABLET` | Tablet-optimize ekranlar (iPad, Android tablet) |
| `AGNOSTIC` | Platforma bagli olmayan yuzeyler |

---

## Kenar Durumlari

### Proje henuz erken asamada ve cok az kod varsa

- Proje profili eksik bilgiyle olusturulur
- `project_type` ve `sector` README.md veya CLAUDE.md'den cikarilir
- Mevcut ekran ve component listesi bos olabilir
- Tum zorunlu aileler sifirdan uretilir
- Design system sifirdan kurulur

Agent stratejisi:
- proje profilini olabildigunce doldur
- bos alanlari makul varsayimlarla tamamla
- tum zorunlu aileleri tam olarak uret
- sektor tahmini yapilabiliyorsa sektor-ozel ekranlar da ekle

### Proje cok buyuk ve yuzlerce ekran iceriyorsa

- Proje profili sadece ana ekran ailelerini listeler
- Component inventeri kategori bazinda ozetlenir
- Gap analizi sadece zorunlu ailelere odaklanir

Agent stratejisi:
- mevcut ekranlari eksiksiz listele ama her birini detayla inceleme
- gap analizini zorunlu ailelere sinirla
- sektor-ozel ekranlar icin sadece bulunamayanlari uret
- foundation/reference ekranlarini sadece component coverage ihtiyaci kadar uret
- `GEMINI_3_FLASH` ile hiz kazanmak icin bu modeli reference ekranlarda kullan

### Birden fazla platform hedefleniyorsa (web + mobil)

- Proje profili her iki platformu da listeler
- Ayni ekran iki platformda ayri prompt ile uretilir
- `deviceType` her prompt icin dogru ayarlanir

Agent stratejisi:
- once birincil platformu belirle (package.json'dan)
- birincil platform ekranlarini tamamla
- sonra ikincil platform varyantlarini ayri prompt'larla uret
- `both` sadece gercekten ayni semantic yuzey iki platformda da degismeden tasinabiliyorsa kullan

### Mevcut bir design system yoksa

- Proje profili `design_system.status: none` olarak isaretlenir
- Agent, proje sektorune gore makul bir seed renk secer
- Modern font cifti secer

Agent stratejisi:
1. `create_design_system` ile baslangic DS'i kur
2. Ilk 3 ekrani uret
3. `generate_variants` ile alternatif dene (EXPLORE, COLOR_SCHEME + TEXT_FONT)
4. En uygun varyanti sec
5. `update_design_system` ile sabitle
6. Kalan ekranlari bu sabitlenmis DS ile uret
7. Sonunda `apply_design_system` ile tum ekranlara toplu uygula

---

## Ic Referans Dokumanlar

Bu rehber, su boilerplate dokumanlarinin mantigiyla uyumludur:

### Stitch ve Pipeline

- `.stitch/STITCH-PROMPT-GUIDE.md` (boilerplate-spesifik rehber)
- `docs/governance/46-stitch-pipeline-spec.md` (Stitch pipeline spesifikasyonu)

### Governance ve Boundary

- `docs/governance/45-boilerplate-project-boundary-contract.md` (miras kurallari)
- `CLAUDE.md` (proje AI talimatlari)
- `README.md` (proje tanimi)
- `BOUNDARY.md` (derived project'te olusturulur, boundary contract gosterimi)

### Design System

- `docs/design-system/03-ui-ux-quality-standard.md`
- `docs/design-system/04-design-system-architecture.md`
- `docs/design-system/05-theming-and-visual-language.md`
- `docs/design-system/22-design-tokens-spec.md` (token sistemi — catismalarda nihai otorite)
- `docs/design-system/25-error-empty-loading-states.md`
- `docs/design-system/39-default-screens-and-components-spec.md`
- `packages/ui/README.md`

### Dinamik Dokumanlar (Proje Taramasinda Kullanilir)

- `DESIGN.md` (Stitch export — derived project'te uretilir, elle duzenlenmez)
- `.moai/project/product.md` (moai:project ciktisi — urun tanimi)
- `.moai/project/structure.md` (moai:project ciktisi — yapi tanimi)
- `.moai/project/tech.md` (moai:project ciktisi — teknoloji tanimi)
- `.moai/specs/**` (SPEC dokumanlari)

---

## Dis Referanslar

- Apple Human Interface Guidelines
- Android Developers: Adaptive app quality guidelines for large screens
- Android Developers: Make apps more accessible
- W3C: Web Content Accessibility Guidelines (WCAG) 2.2
- W3C: Web Sustainability Guidelines
- UX Design Institute: 7 fundamental UX design principles in 2026
- Figma: Top web design trends for 2026
- Figma: State of the Designer 2026

Bu dis referanslar yalnizca kalite tonu icindir.
Final agent talimatinda yine de Stitch'e exact tasarim komutu verilmez.
