# Stitch Prompt Guide — Boilerplate

> Bu dosya Stitch'e dogrudan yapistirilmaz.
> Bu dosya Codex, Claude Code CLI veya benzeri agent modellerine verilir.
> Agent, Google Stitch MCP araclarini kullanarak ekranlari uretir.
>
> **Tek yapisitirma kullanimi:** Bu dosyanin tamami bir agent oturumuna yapistirilabilir.
> `RUN THIS EXACT AGENT PROMPT` blogu icerisinde tum ekranlarin detayli semantic brief'leri,
> timeout/pacing kurallari ve kalite kontrolleri mevcuttur. Agent, ek prompt beklemeden
> tum zorunlu ekranlari otonom olarak olusturur.
> Dosyanin geri kalan bolumleri (ornek prompt'lar, iterasyon kurallari, coverage felsefesi vb.)
> ilk autonomous build sonrasi iteratif calisma icin referans olarak korunmustur.

## Bu belge ne icin var

Bu belge, `boilerplate` projesi icin Codex / Claude Code gibi agent modelleri Google Stitch MCP ile calistirilirken:

- urun-spesifik degil, boilerplate-spesifik bir prompt sistemi kurmak
- Stitch'i agent tarafindan kullanilan tasarim motoru olarak konumlandirmak
- Metronic benzeri "coverage breadth" saglayan test/reference ekranlarini planlamak
- baslangic ekranlari, utility screen'ler ve vertical-slice referanslarini sistematik uretmek
- trend bilgisini koruyup bunu gorsel mikro-komuta donusturmemek

icin yazildi.

Bu rehberin amaci "hangi ekranlar uretilecek?" ve "agent modele nasil calisma talimati verilecek?" sorularini netlestirmektir.

Bu rehberin amaci **renk, font, px, grid, kolon, gap** belirlemek degildir.

---

## Kisa Ozet

Agent + Stitch MCP akisindan istedigimiz sey:

- guclu bir internal design/reference foundation
- test UI ekranlari
- boilerplate starter screen seti
- tutarli bir design system dili

Agent modele vermemiz gereken sey:

- proje baglami
- ekranin semantic rolu
- gerekli icerik ve aksiyonlar
- zorunlu state'ler
- yuksek seviye vibe / kalite seviyesi

Agent modele vermememiz gereken sey:

- piksel seviyesinde gorsel kararlar
- exact renk, font, spacing, border, shadow, radius, layout komutlari

---

## DESIGN.md Once Gelir

Bu boilerplate'te agent + Stitch MCP kullaniminda dogru baslangic:

1. Eger mevcut `DESIGN.md` varsa agent'a ver ve mevcut sistemi koruyarak devam etmesini iste.
2. Eger mevcut token seti veya onceki design export'lari varsa bunlari referans al.
3. Yalnizca ilk oturumda ya da bilincli bir visual reset kararinda sifirdan basla.

Kritik kural:

- `DESIGN.md` yoksa ilk oturumda uretilir
- `DESIGN.md` varsa her zaman onunla devam edilir
- `DESIGN.md` elle duzenlenmez
- Stitch ciktisi dogrudan kodda kullanilmaz; token eslestirme asamasindan gecer
- agent, Stitch MCP ile ekran uretse bile `DESIGN.md` ve token kurallarini bozmaz

Bu rehber, `46-stitch-pipeline-spec.md` ile birlikte okunmalidir.

---

## Reset Talimati

Yeni bir agent-run Stitch turuna baslarken:

1. Bunun gercekten yeni bir visual baseline oldugundan emin ol.
2. Eger mevcut `DESIGN.md` korunacaksa reset yapma; mevcut export ile devam et.
3. Reset gerekiyorsa mevcut ekran tasarimlarini sil.
4. Stitch'te mumkunse en guclu kalite modelini kullan; secenekler arasinda varsa `Gemini 3.1 Pro` tercih et.
5. Bu rehberdeki calisma modlarindan birini sec.
6. Varsayilan mod `autonomous full build` modudur.
7. Sadece reference coverage denetimi yapiyorsan `reference expansion` moduna gec.

---

## Calisma Modlari

Bu rehber uc farkli calisma amaci icin kullanilabilir.

### 1. Autonomous Full Build

Bu **ana** moddur.
Bu rehberin varsayilan kullanim sekli budur.

Amac:

- tek girdi ile boilerplate'in zorunlu ekran ailelerini olusturmak
- agent'in Stitch MCP uzerinden ekran ekran soru beklemeden ilerlemesini saglamak
- tutarli bir baseline UI sistemi kurmak

Bu modda agent:

1. mevcut `DESIGN.md` varsa onunla devam eder
2. yoksa yeni baseline sistem kurar
3. system -> auth -> onboarding -> main shell -> vertical slice -> reference coverage sirasiyla ilerler
4. her aileyi ayni design system altinda tamamlar
5. Google Stitch MCP araclarini kullanarak ekstra ekran brief'i beklemeden zorunlu kapsamı kapatir

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

## Temel Ilke

Sen tasarimci degilsin.
Sen, Stitch'i kullanan bir execution agent'sin.
Stitch tasarim icin yaratilmis bir yapay zeka.

Senin gorevin:

- proje baglamini agent olarak Stitch MCP uzerinden aktarmak
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

---

## Cok Onemli Denge

Bu rehber iki gorunurde celiskili ihtiyaci birlikte tasir:

1. Stitch'e alan tanimak
2. Kalite seviyesini tesadufe birakmamak

Bu denge su sekilde kurulur:

- **Izin verilen sey:** vibe, ton, kalite seviyesi, urun tipi, pattern coverage, semantic rol
- **Yasak olan sey:** exact gorsel tarif, hardcoded layout, exact color/font/spacing kararleri

Yani su tur brief'ler uygundur:

- premium
- modern
- strategic minimalism
- calm and focused
- strong hierarchy
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

## Boilerplate Baglami

Asagidaki blok, agent modele verilecek sabit boilerplate baglamidir.
Bu blok agent talimatinda tam ya da kismen kullanilabilir.

```text
This project is a cross-platform product boilerplate built for React web and React Native / Expo mobile.
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
- internal reference and test screens
- starter screens that every serious product boilerplate needs
- a coherent visual system that can later be mapped into tokens and reusable components

Do not design this like a generic CRUD admin.
Do not copy Metronic visually.
But do cover the same breadth of reference and starter surfaces a premium starter kit would include:
component showcase, typography, color roles, spacing, forms, data views, navigation, feedback states,
auth screens, onboarding, dashboard, settings, and utility/system screens.
```

---

## Trend Notu

Asagidaki trend sentezi, **gorsel mikro-komut** degil, yuksek seviye atmosfer brief'i olarak kullanilabilir.

Bu bolum, 2026-04-04 tarihinde yapilan genel internet arastirmasi sonrasi guncellenmistir.
Trend notlari; 2025 ve 2026 odakli UI/UX kaynaklari ile Apple HIG, Android adaptive quality, WCAG 2.2 ve W3C Web Sustainability Guidelines gibi resmi best-practice kaynaklarinin sentezidir.

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

- dashboard gürültüsü yerine daha sakin bilgi hiyerarsisi
- moduler ama asiri kartlasmamis layout sistemleri
- hover, focus, keyboard ve context-menu davranislarini ciddiye alan desktop-grade etkileşim
- AI / search / command / assist yuzeylerini sadece urun mantigi destekliyorsa on plana alma
- performans ve sürdürülebilirlik dusuncesiyle asset, motion ve veri yogunlugunu kontrollu tutma
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

### Evrensel guardrail'ler

- WCAG 2.2 dusuncesiyle erisilebilir kontrast, focus gorunurlugu ve keyboard erisimi koru
- gereksiz tam ekran yukleme ve hata yuzeylerinden kac; uygun oldugunda section-level veya inline feedback kullan
- reduced motion ihtiyacini dusun; motion anlam katmiyorsa azalt
- dark pattern, addictive loop ve dikkat dagitici sonsuz gorsel gosterileri default'a cevirmeme
- AI veya personalisation kullaniliyorsa duzeltme, geri alma veya override yolu dusun

### Web guardrail'leri

- performans ve sürdürülebilirlik icin asset, medya ve script yogunlugunu kontrollu tut
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

## Onerilen Stil Notu

Bu not, her prompt'un basina konulabilecek en guvenli ortak stil brief'idir:

```text
Design style: A premium, modern product boilerplate reference experience.
Clean, focused, and high-trust.
Strategic minimalism over decorative noise.
Use strong hierarchy, polished depth, and modular composition where appropriate.
The overall feel should be refined, production-minded, and system-driven rather than generic or template-like.
Use contemporary 2025-2026 quality cues without feeling trend-chasing or ornamental.
Allow subtle human warmth and tactility only when it does not reduce clarity, trust, or usability.
```

Bu not:

- kalite seviyesini tanimlar
- agent'e ve Stitch'in tasarim zekasina alan birakir
- exact gorsel karar vermez

---

## Ajana Ne Verilir

Her ekran veya run icin agent modele yalnizca su 5 katman verilir:

1. **Boilerplate baglami**
2. **Ekranin adi**
3. **Ekranin isi**
4. **Data fields / actions / flow**
5. **Gerekli state'ler**

Opsiyonel 6. katman:

6. **Yuksek seviye vibe note**

Opsiyonel 7. katman:

7. **Device ve locale notu**

---

## Ajana Ne Verilmez

- exact color palettes
- exact font names
- exact spacing scale
- px cinsinden olculer
- kolon sayisi
- breakpoint dayatmasi
- component ic hiyerarsisinin piksel tarifi
- "Metronic gibi gorunsun" gibi kopya gorsel brief

Coverage mantigini referans al.
Gorunusu kopyalatma.

---

## Platform, Device ve Dil Kurali

Her prompt'ta hedef platformu acik yaz:

- `web`
- `mobile`
- `both` sadece gercekten ayni semantic yuzey iki platformda da degismeden tasinabiliyorsa

Varsayilan cihaz stratejisi:

- component gallery, typography, color, spacing, navigation, form, data-pattern gibi web-odakli reference ekranlari icin `Desktop`
- `Splash`, `Force Update`, `Biometric Prompt`, `Welcome Slides`, `Permission Primer` gibi mobile-semantic ekranlar icin `Mobile`
- cross-platform starter ekranlarda once ana hedef platformu sec, sonra gerekiyorsa ikinci platform icin ayri prompt ac

Karar agaci:

1. Bu ekranin semantic merkezi web shell mi? `Desktop`
2. Bu ekranin semantic merkezi native mobile akisi mi? `Mobile`
3. Bu ekran her iki platformda da var ama farkli primitive'lerle yasiyorsa:
   once birincil platformu sec, sonra ikinci platform varyantini ayrica iste

Sebep:

- boilerplate pipeline'i hedef platformun briefing icinde acik olmasini bekler
- mobile-only semantic ekranlar desktop mantigiyla briefing edilmemelidir
- cross-platform parity, ayni canvas'i zorlayarak degil dogru semantic platform secimiyle korunur

Dil / locale stratejisi:

- prompt'ta hangi dili kullanacagini acikca soyle
- bir ekranda diller karismasin
- eger proje locale'i daha net tanimli degilse internal test ekranlarinda Turkce placeholder copy kullanabilirsin
- uluslararasi demo gerekiyorsa English sec ama bunu prompt'ta acik yaz

---

## Agent Session Baslangic Komutu

Yeni bir Codex / Claude Code oturumu acarken su instruction block kullanilabilir.
Ancak tek girisli kullanim icin asagidaki `RUN THIS EXACT AGENT PROMPT` blogu bunu zaten kapsar.

```text
You are not being asked to manually obey fixed visual design decisions.
Use your own design intelligence.

Your job is to turn the project context and screen requirements into a coherent, professional UI system.
Do not wait for pixel-level instructions.
Do not ask for exact colors, exact font names, exact spacing, or exact layout coordinates.

Prioritize:
- coherence
- hierarchy
- usability
- accessibility-minded structure
- premium product quality
- reusable design-system thinking

This work is for a cross-platform boilerplate.
You will use Google Stitch MCP as the screen-generation engine.
The goal is to create reference/test screens and starter screens that can later be translated into tokens and reusable components.
```

---

## Hemen Calistirilabilir Akis

Agent + Stitch MCP akisini gercekten calistirmak icin bu sirayla ilerle:

1. Eger varsa mevcut `DESIGN.md` dosyasini agent oturumuna ekle.
2. Asagidaki `RUN THIS EXACT AGENT PROMPT` blogunu tek parca olarak Codex veya Claude Code CLI'ya ver. Bu blok icerisinde tum ekranlarin detayli brief'leri mevcuttur; ek ekran prompt'u gerekmez.
3. Agent'in Google Stitch MCP araclariyla zorunlu ekran ailelerini otonom sekilde tamamlamasina izin ver.
4. Ilk tam tur bittikten sonra ancak gerekiyorsa `Iterative Single-Screen Build` moduna gec.
5. Tutarlilik olustugunda `DESIGN.md` export al.

Kisa kural:

- once master prompt ile baseline'i kur
- sonra gerekirse tekil iterasyon yap

### Timeout Yonetimi ve Ardisik Ekran Olusturma Kurallari

Bu kurallar hem autonomous full build hem de iterative build sirasinda gecerlidir.
Bu kurallar ayni zamanda `RUN THIS EXACT AGENT PROMPT` icerisinde de agent'a verilmistir.

**Timeout ≠ basarisizlik.**
Timeout almak, ekran olusturma isleminin baslamadigini veya basarisiz oldugunu gostermez.
Stitch arka planda tasarimi olusturmaya baslamis olabilir.

**Her ekran icin zorunlu akis:**

1. **Olustur:** Ekran olusturma komutunu gonder.
2. **Bekle:** Olusturma tamamlanmasi icin yeterli sure bekle. Hemen ardisik bir sonraki ekrani olusturmaya baslaMA.
3. **Dogrula:** Ekranin basariyla olusup olusmadigini kontrol et (`list_screens` veya `get_screen` ile).
4. **Karar ver:**
   - Olustuysa → bir sonraki ekrana gec (adim 1'e don).
   - Timeout aldiysa → belli araliklarla tekrar kontrol et. Olustuysa ilerle. Olusmadiysa hatayi degerlendir.
   - Gercek hata aldiysa → durumu degerlendir, gerekirse duraklat.

**Kesinlikle yapMA:**

- Timeout sonrasi ayni ekrani hemen tekrar olusturma. Bu **duplicate ekranlara** yol acar.
- Ardisik ekranlari arasinda bekleme ve dogrulama yapmadan arka arkaya olusturma. Bu hem **timeout riskini arttirir** hem de **her ardisik ekranda tasarim kalitesini dusurur**.
- Ayni anda birden fazla ekran olusturma komutu gonderme.

---

## RUN THIS EXACT AGENT PROMPT

Bu blok, dosyanin asil calistirilabilir parcasidir.
Oldugu gibi kopyalanip Codex, Claude Code CLI veya benzeri agent modele tek girdi olarak verilebilir.

```text
You are an execution agent such as Codex or Claude Code.
You are creating the complete baseline UI system for a cross-platform product boilerplate by using Google Stitch MCP as the design execution layer.
Work autonomously from this single brief.
Do not wait for additional screen-by-screen prompts unless you are truly blocked by a missing artifact.
If an existing DESIGN.md is attached, continue from it and preserve system continuity.
If no DESIGN.md is attached, establish a new coherent baseline design system.

Use Google Stitch MCP tools to create and refine screens.
When useful, use the available Stitch MCP capabilities for text-to-screen generation, site/screen building, design-context extraction, and visual verification.
Do not ask the user to manually operate Stitch if the agent can do it through MCP.

You are not being asked to manually obey fixed visual design decisions.
Use your own design intelligence.
Do not ask for exact colors, exact font names, exact spacing, exact layout coordinates, or fixed component geometry.

Primary objective:
Create a serious, reusable, production-minded boilerplate UI foundation.
This is not a one-off mockup.
This is not a generic CRUD admin.
This is not a Metronic clone.

Design style:
A premium, modern product boilerplate reference experience.
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

Core product context:
This project is a cross-platform product boilerplate built for React web and React Native / Expo mobile.
It is documentation-first, quality-gated, token-first, and design-system-driven.
The goal is a reusable UI foundation that can later be mapped into semantic tokens and reusable components.

The boilerplate assumes:
- reusable component thinking
- semantic token-first thinking
- light and dark mode readiness
- accessibility-minded structure
- Apple HIG sensitivity on mobile
- strong loading, empty, error, success, and recovery states
- auth, onboarding, settings, dashboard, and vertical-slice starter screens

Autonomous execution rules:
- complete the mandatory baseline screen families without waiting for additional prompts
- preserve one coherent design system across the whole run
- make reasonable UX assumptions quietly and proceed
- prefer platform-natural behavior over fake parity
- if a screen exists on both web and mobile but should not share the exact same structure, create platform-appropriate variants under the same design system
- do not stop after only one family or one screen
- after generating each screen, visually inspect and verify it through the Stitch MCP workflow before moving to the next

Screen creation pacing and timeout rules [CRITICAL]:
- after sending each screen creation command, wait for completion before starting the next screen
- do not fire multiple screen creation commands back to back without verifying each one
- if a timeout occurs, it does NOT mean the screen failed — the design may still be generating in the background
- after a timeout, check whether the screen was actually created (use list_screens or get_screen) before deciding to retry
- never blindly retry a timed-out screen creation — this causes duplicate screens
- if a screen was created despite the timeout, move on to the next screen
- if a screen truly was not created after verification, evaluate the error and retry once or pause for user input
- rushing through screens degrades design quality on each successive screen — pacing is mandatory, not optional
- execution flow for each screen: CREATE → WAIT → VERIFY → DECIDE (next / check again / pause)

Language rule:
- use Turkish placeholder copy consistently across this run
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

Mandatory build order:
1. System / utility screens
2. Auth screens
3. Onboarding screens
4. Main shell screens
5. Vertical slice reference screens
6. Foundation / reference test screens

Mandatory screen inventory with per-screen briefs:

Each screen below includes its platform target, semantic purpose, required content, key states, and user flow.
Use this information as the brief for each screen. Do not ask for additional briefs.
Follow the mandatory build order above. Create one screen at a time. Verify before moving to the next.

=== FAMILY 1: SYSTEM / UTILITY SCREENS ===

--- Splash Screen ---
Platform: Mobile
Purpose: Brand entry point, shown briefly during app cold start.
Content: brand logo or mark, optional tagline, minimal background.
States: default display only.
Flow: Appears on cold start, transitions automatically to app bootstrap loading.

--- Full-screen App Bootstrap Loading Screen ---
Platform: both
Purpose: Show that the app is initializing, loading configuration, checking auth state.
Content: loading indicator, optional brand mark, optional status text.
States: loading in progress, transition to next state.
Flow: After splash, leads to force update check, maintenance check, offline check, error, or auth entry.

--- Force Update Screen ---
Platform: both
Purpose: Block the user when the current app version is no longer supported.
Content: clear title, explanation text, primary update action linking to store, optional secondary dismiss if soft update.
States: hard block (no dismiss), soft update (dismissable).
Flow: User updates or is blocked.

--- Maintenance Screen ---
Platform: both
Purpose: Inform the user that the service is temporarily unavailable for scheduled maintenance.
Content: maintenance title, explanation, estimated return time if available, visual cue distinguishing from error.
States: default maintenance, optional countdown.
Flow: User waits and retries later.

--- No Internet / Offline Screen ---
Platform: both
Purpose: Clear, calm, recoverable full-screen offline state when the app cannot continue because network access is unavailable.
Content: clear offline message, short explanation text, retry action, optional secondary guidance for checking connection, visual state distinguishing from maintenance or generic error.
States: initial offline, retry in progress, auto-recovery ready state.
Flow: User opens or returns to the app without connectivity, understands the issue quickly, retries, and recovers when the connection returns.

--- Full-screen Error Screen ---
Platform: both
Purpose: Catch-all for unexpected fatal errors during bootstrap or runtime.
Content: error title, explanation, retry action, optional support/report link.
States: generic error, retry in progress.
Flow: User encounters unexpected failure, retries or contacts support.

--- Not Found / 404 Screen ---
Platform: web
Purpose: Dead-end-safe screen when a route or destination cannot be found.
Content: clear not-found title, short explanation, primary action to go home, secondary action to go back if useful.
States: default not-found state, optional deep-link context hint if useful.
Flow: User lands on a missing route and can recover immediately without confusion.

=== FAMILY 2: AUTH SCREENS ===

--- Login Screen ---
Platform: both
Purpose: Primary sign-in entry point for unauthenticated users. Should feel simple, credible, accessible, and production-ready.
Content: email input, password input with visibility toggle, primary sign-in action, forgot password link, register link, optional social sign-in area, optional biometric continuation area if it fits the system.
States: default, validation errors, credential failure, loading on submit, success / redirect-ready.
Flow: User enters credentials, understands failures inline, and proceeds into the main app shell on success.

--- Register Screen ---
Platform: both
Purpose: New account creation.
Content: name input, email input, password input with strength indicator, confirm password, terms acceptance, register action, login link.
States: default, field validation, server error, loading, success.
Flow: User creates account, validates fields inline, proceeds to verification or onboarding.

--- Forgot Password Screen ---
Platform: both
Purpose: Initiate password recovery.
Content: email input, submit action, back to login link, explanation text.
States: default, validation, loading, success confirmation.
Flow: User requests password reset, receives confirmation, checks email.

--- Reset Password Screen ---
Platform: both
Purpose: Set a new password from a recovery link.
Content: new password input with strength indicator, confirm password, submit action.
States: default, validation, token expired/invalid, loading, success.
Flow: User arrives from email link, sets new password, redirected to login.

--- Email Verification / OTP Screen ---
Platform: both
Purpose: Let the user enter a one-time verification code after registration or a protected auth flow.
Content: short explanatory title, masked destination hint if appropriate, segmented OTP entry pattern, resend code affordance, countdown timer, inline error messaging.
States: waiting for code, invalid code, resend locked, resend available, verification success.
Flow: User receives a code, enters or pastes it, sees clear validation, and proceeds on success.

--- Biometric Prompt Screen ---
Platform: Mobile
Purpose: Offer biometric authentication as a quick re-entry method.
Content: biometric icon/animation, explanation text, authenticate action, fallback to password link.
States: waiting, authentication in progress, success, failure with fallback.
Flow: User authenticates biometrically or falls back to password.

=== FAMILY 3: ONBOARDING SCREENS ===

--- Welcome Slides ---
Platform: both
Purpose: Introduce the product system in a short onboarding flow with 3 to 5 slides. Teach product shape quickly, not a marketing microsite.
Content: concise title and supporting text per slide, illustration or visual storytelling area, progress indication, next / continue action, skip option, final primary CTA.
States: first slide, intermediate slide, final CTA slide.
Flow: User quickly understands the product and moves into the next required onboarding or auth step.

--- Permission Primer ---
Platform: Mobile
Purpose: Explain the value of a system permission in plain language before the system dialog appears.
Content: one permission focus at a time, icon or symbolic cue, simple why-this-matters explanation, primary allow action, secondary not-now action.
States: push notification primer, location primer, camera or media primer.
Flow: User understands why permission is needed and makes an informed decision before the native system prompt.

--- Profile Setup ---
Platform: both
Purpose: Collect initial profile information after registration.
Content: avatar upload area, display name input, optional bio or role, save action, skip option.
States: default, uploading, validation, saving, success.
Flow: User completes basic profile, proceeds to main shell.

=== FAMILY 4: MAIN SHELL SCREENS ===

--- Home / Dashboard ---
Platform: both
Purpose: Authenticated user's default landing screen, showing a welcoming overview, quick actions, and starter content regions. Reusable shell dashboard, not a product-specific analytics page.
Content: welcome area, quick action cards, recent activity or recent items section, one or two content modules that can later be replaced by real product modules, navigation-aware shell feeling.
States: first-use but authenticated, normal populated starter state, section-level loading, section-level empty state.
Flow: User lands after auth, understands the shell quickly, and moves deeper into the product.

--- Profile ---
Platform: both
Purpose: View own profile information.
Content: avatar, display name, email, role/bio, edit profile action, account stats if useful.
States: default, loading.
Flow: User views profile, taps edit if needed.

--- Edit Profile ---
Platform: both
Purpose: Edit profile fields.
Content: avatar change, display name, bio/role, save and cancel actions, validation.
States: default, dirty, validation errors, saving, success, unsaved changes warning.
Flow: User edits fields, saves or cancels.

--- Settings ---
Platform: both
Purpose: Reusable settings hub covering account, notifications, appearance, security, about, and destructive actions. Should feel structured, calm, and highly scannable.
Content: grouped settings sections, navigation items, in-place toggles where appropriate, theme and language preferences, biometric preference entry, destructive zone for sign out and delete account.
States: default, saving / toggling, permission-disabled banner if relevant, destructive confirmation entry point.
Flow: User scans grouped settings, updates preferences confidently, and navigates into deeper sub-settings when needed.

--- Notification Preferences ---
Platform: both
Purpose: Granular notification control.
Content: grouped notification categories, toggle switches, push/email channel control, save action.
States: default, permission disabled, saving.
Flow: User adjusts notification preferences by category.

--- Change Password ---
Platform: both
Purpose: Update account password.
Content: current password input, new password input with strength indicator, confirm password, save action.
States: default, validation errors, wrong current password, loading, success.
Flow: User changes password securely.

--- Delete Account ---
Platform: both
Purpose: Irreversible account deletion with proper friction.
Content: warning explanation, consequences list, confirmation input or checkbox, delete action, cancel action.
States: default warning, confirmation required, deleting, success/goodbye.
Flow: User understands consequences, confirms deliberately, account deleted.

--- About / Legal ---
Platform: both
Purpose: App info, version, legal links.
Content: app name and version, terms of service link, privacy policy link, licenses, support/contact link.
States: default.
Flow: User reviews app information and legal links.

=== FAMILY 5: VERTICAL SLICE REFERENCE SCREENS ===

--- List Screen ---
Platform: both
Purpose: Reusable paginated list screen pattern that can support real product data later. Should demonstrate a serious list experience with loading, empty, error, and pagination thinking.
Content: page title and context header, filter/search affordance, list items or cards, pagination or infinite-loading logic cues, empty state, inline retry area for list-level failure.
States: first load, populated list, no results, empty source data, list failure, next-page loading.
Flow: User enters the list, understands content status quickly, browses items, and can recover from empty or failed states.

--- Detail Screen ---
Platform: both
Purpose: Reusable detail view for a single entity.
Content: header with entity identity, key information sections, action buttons (edit, delete, share), related items area.
States: loading, populated, not found, action in progress.
Flow: User views entity details, takes actions, navigates back to list.

--- Create / Edit Form Screen ---
Platform: both
Purpose: Reusable create/edit form pattern with validation, dirty-state thinking, submit lifecycle, and success/error handling.
Content: form header with clear mode awareness, text fields, textarea or long-form input, select or picker field, media or attachment placeholder if useful, save and cancel actions, validation guidance.
States: create mode, edit mode, validation errors, submitting, submit success, submit failure, unsaved changes warning.
Flow: User can create or edit an entity, understand inline validation, complete submission, and safely handle navigation away.

=== FAMILY 6: FOUNDATION / REFERENCE TEST SCREENS ===

These are internal reference screens for design system breadth and component coverage.
Design them as desktop-first web reference surfaces.

--- UI Kit / Component Gallery ---
Purpose: Show the core reusable UI building blocks in one internal reference screen so design and implementation can share the same visual vocabulary.
Content: button variants and sizes, text fields, password field, textarea, select, search, checkbox, radio, switch, cards, badges, chips, list items, avatars, banners, toast examples, tabs, segmented controls, header patterns, empty state and error state blocks, a small table/list preview.
States: default, hover / focus / pressed where meaningful, disabled, loading, error / validation.
Coverage target: Avatar, Badge, Card, Chip, ListItem, Button, Checkbox, Radio, Select, Switch, TextArea, TextField.

--- Typography Reference ---
Purpose: Show the typographic hierarchy, text roles, weight spectrum, helper text language, caption rhythm, and readability behavior used by the boilerplate.
Content: display, screen title, section title, body, helper, caption, overline, status text examples, weight variations, long-form paragraph sample, button label and form label samples, dark and light readability snippets if useful.
States: default text roles, emphasized vs muted text, success / warning / error text examples.

--- Color Roles and Theme Reference ---
Purpose: Semantic color roles, theme behavior, light/dark contrast.
Content: primary, secondary, surface, background, error, warning, success, info color roles, text-on-surface combinations, dark mode equivalents.
States: light theme, dark theme.

--- Spacing / Radius / Elevation Reference ---
Purpose: Spatial rhythm, corner radius scale, elevation/shadow levels.
Content: spacing scale examples, radius scale examples, elevation/shadow levels, padding and margin demonstrations.
States: default reference display.

--- Iconography and Symbol Reference ---
Purpose: Icon set preview and usage patterns.
Content: common icons grouped by category (navigation, action, status, social), icon sizing scale, icon + text pairing examples.
States: default reference display.

--- Navigation Patterns Reference ---
Purpose: Navigation component coverage.
Content: header patterns, tab bar, segmented control, step indicator, breadcrumb, sidebar/drawer entry, bottom sheet navigation.
States: active, inactive, disabled, badge/notification indicator.
Coverage target: Header, SegmentedControl, StepIndicator, TabBar.

--- Form Patterns and Validation Reference ---
Purpose: Advanced form input coverage and validation patterns.
Content: password field with strength, phone input, search bar, date picker, slider, form group, field shell, inline validation examples, form-level error summary.
States: default, focused, valid, invalid, disabled, loading.
Coverage target: PasswordField, PhoneInput, SearchBar, DatePicker, Slider, FormActions, FormGroup, FieldShell.

--- Data Display Patterns Reference ---
Purpose: Data presentation component coverage.
Content: table/list views, data cards, stat blocks, key-value pairs, timeline/activity feed, avatar + metadata patterns.
States: populated, loading, empty.

--- Feedback States Reference ---
Purpose: Show how loading, empty, error, success, warning, and recovery states should appear across the boilerplate.
Content: full-screen loading, section-level loading, empty state with CTA, no-results empty state, error state with retry, success confirmation examples, inline validation examples, banner and toast examples, destructive confirmation example.
States: full-screen state, section-level state, inline state, transient feedback state.
Coverage target: Banner, ConsentBanner, NetworkStatusBanner, Toast, EmptyState, ErrorState, LoadingState, ProgressBar, Skeleton, Spinner.

--- Overlay Patterns Reference ---
Purpose: Overlay and dialog component coverage.
Content: action sheet, bottom sheet, confirm dialog, drawer, modal, popover, tooltip examples.
States: open, closed, nested overlay.
Coverage target: ActionSheet, BottomSheet, ConfirmDialog, Drawer, Modal, Popover, Tooltip.

--- Motion and Interaction Reference ---
Purpose: Interaction quality, motion restraint, and state transitions.
Content: hover, focus, pressed, and selected examples, accordion or disclosure interaction, modal/sheet/popover entry/exit example, loading-to-content transition example, swipe or gesture-aware pattern if useful for mobile, reduced-motion-friendly behavior cues.
States: hover state, focus-visible state, pressed state, expanded state, loading transition state, reduced-motion-friendly state.
Coverage target: Accordion, PullToRefreshWrapper, InfiniteScrollList.

--- Accessibility and Contrast Reference ---
Purpose: Accessibility readiness and contrast-aware design behavior.
Content: focus-visible examples, readable text contrast examples, disabled vs inactive distinction, large-text / dynamic type stress cases, form error readability, keyboard and screen-reader friendly interaction cues.
States: default readable state, focus-visible state, disabled state, error readability state, large-text stress state.
Coverage target: SkipToContent, focus-visible, dynamic type, contrast-sensitive surfaces.

--- Utility and Quality Patterns Reference ---
Purpose: Non-feature but production-critical UI patterns.
Content: app lock or protected-entry pattern, network status banner, consent/banner examples, sticky footer pattern, skip-to-content or accessibility utility cue, webview placeholder or embedded-content fallback, countdown timer, divider with label.
States: protected state, warning banner state, fallback placeholder state, utility action state.
Coverage target: AppLockScreen, StickyFooter, WebViewPlaceholder, CountdownTimer, DividerWithLabel.

Starter flow logic:
- Splash -> App Bootstrap Loading
- From bootstrap, handle Force Update, Maintenance, Offline, Full-screen Error, or Auth entry
- Auth -> Login / Register / Forgot Password / Reset Password / OTP / Biometric
- After first successful entry, continue into Welcome Slides -> Permission Primer -> Profile Setup when relevant
- Then land in Main Shell
- Settings must connect to Notification Preferences, Change Password, Delete Account, and About / Legal
- Vertical slice screens should demonstrate how real product features would plug into the shell

Foundation coverage intent:
Use the internal reference screens to make the design system and component breadth visible.
Ensure coverage for data, feedback, form, input, navigation, overlay, quality, state, and utility patterns.
Make sure the reference layer visibly supports patterns like password fields, phone input, date picker, slider, tab bar, step indicator, action sheets, bottom sheets, dialogs, drawers, tooltips, banners, toasts, empty states, error states, loading states, skeletons, progress, accordion, infinite scroll, pull-to-refresh, sticky footer, skip-to-content, app lock, and webview fallback patterns.

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
- do not copy Metronic visually
- do not over-index on analytics dashboards
- do not make every screen card-heavy just because bento layouts are trendy
- do not create decorative marketing hero sections where utility screens are needed
- do not force all problems into full-screen states
- do not ask for pixel-level clarification unless truly blocked

Completion standard:
Do not consider the run complete until:
- the full baseline flow exists from system entry to main shell
- auth and onboarding are both covered
- settings subflows are present
- at least one credible vertical slice path exists
- internal reference screens cover the reusable UI breadth
- the whole set feels like one serious boilerplate system
- if the environment supports DESIGN.md export, finish with that export or clearly state that export remains as the next step
```

---

## Tek Ekran Kurali

Bu kural artik **ilk autonomous full build sonrasi** icin gecerlidir.

Varsayilan iterasyon kurali:

- her prompt'ta tek ekran
- her iterasyonda 1 ana problem

Neden:

- Stitch, tek ekran ve net brief ile daha guclu sonuc verir
- system consistency daha iyi korunur
- bozulma ve scope drift azalir
- **ardisik hizli olusturmalarda her ekranin tasarim kalitesi duser** — bu gozlemlenmis bir davranistir

Istisna:

- yakin iliskili internal reference ekran ailesi bazen ayni oturumda ardarda uretilip ayni system'e baglanabilir
- ama yine de ayni prompt icinde 3-4 ana ekran istemek tavsiye edilmez

Timeout ve dogrulama kurali:

- her ekran olusturulduktan sonra basarili olup olmadigini dogrula, ancak ondan sonra siradakine gec
- timeout alindiysa ayni ekrani hemen tekrar olusturma — once gercekten olusup olusmadigi kontrol edilmeli
- timeout sonrasi duplicate ekran olusturma **kesinlikle yasaktir**
- detayli akis icin `Hemen Calistirilabilir Akis > Timeout Yonetimi ve Ardisik Ekran Olusturma Kurallari` bolumune bak

---

## Prompt Mimarisi

Bu mimari, ilk autonomous full build sonrasi yapilan iteratif prompt'lar icindir.

Tum prompt'lar su formulu izlemelidir:

```text
Design style: [HIGH_LEVEL_STYLE_NOTE]

Project context:
[BOILERPLATE_CONTEXT]

Platform:
[web / mobile]

Device:
[Desktop / Mobile]

Screen:
[SCREEN_NAME]

Purpose:
[WHAT_THIS_SCREEN_DOES]

This screen should include:
- [FIELD_OR_REGION_1]
- [FIELD_OR_REGION_2]
- [FIELD_OR_REGION_3]

User actions:
- [ACTION_1]
- [ACTION_2]
- [ACTION_3]

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
[SHORT_FLOW]

Do not make this screen about:
- [NOT_THIS_1]
- [NOT_THIS_2]
```

Kural:

- bir ekran iki platformda da yasayacaksa varsayilan olarak iki ayri prompt ac
- `both` sadece ayni semantic yuzeyin neredeyse degismeden tasinabildigi durumlarda kullan

---

## Copy-Paste Prompt Bloklari

Bu rehberi calistirilabilir yapan ana kural:

- `RUN THIS EXACT AGENT PROMPT` ilk tam tur icin kullanilir
- asagidaki `Iterative Tam Prompt` ise ilk tur tamamlandiktan sonra tek ekranlik iterasyonlar icin kullanilir
- asagidaki bolumlerde yer alan ornekler ise `Compact Semantic Core` olarak okunur
- compact ornekleri agent modele vermeden once `Standart Footer` ile tamamla

### Iterative Tam Prompt

```text
Design style: A premium, modern product boilerplate reference experience.
Clean, focused, and high-trust.
Strategic minimalism over decorative noise.
Use strong hierarchy, polished depth, and modular composition where appropriate.
The overall feel should be refined, production-minded, and system-driven rather than generic or template-like.
Use contemporary 2025-2026 quality cues without feeling trend-chasing or ornamental.

Project context:
[PASTE_RELEVANT_BOILERPLATE_CONTEXT]

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

### Compact Semantic Core Kurali

Asagidaki ornek promptlarin cogu, okunabilirligi korumak icin kisaltilmis semantic cekirdeklerdir.
Onlari birebir degil, `Iterative Tam Prompt` ya da `Standart Footer` ile birlikte kullan.

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
- Coverage mantigi, kopya tasarim mantigina kaydi mi?
- Ekran boilerplate mantigina mi hizmet ediyor, yoksa gereksiz product-specific mi oldu?

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

Prompt icinde su tur netlik ver:

```text
Use section-level loading and error states where only part of the screen is affected.
Use full-screen states only when the screen's primary job cannot continue.
```

Bu ayrim, `25-error-empty-loading-states.md` ile uyumlu kalmak icin zorunludur.

---

## Coverage Felsefesi

Bu boilerplate icin hedef, genis ama sistematik bir starter kit coverage'i yaratmaktir.

Bu kapsama su aileler dahildir:

1. Foundation / reference test ekranlari
2. System / utility ekranlari
3. Auth ekranlari
4. Onboarding ekranlari
5. Main app shell ekranlari
6. Vertical slice referans ekranlari

Bu aileler, `docs/design-system/39-default-screens-and-components-spec.md` ve ilgili design-system belgeleriyle uyumludur.

---

## Onerilen Uretim Sirasi

### Varsayilan siralama: Boilerplate Baseline Build

1. System / utility starter screens
2. Auth starter screens
3. Onboarding starter screens
4. Main shell starter screens
5. Vertical slice reference screens
6. Foundation / reference test UIs
7. Feedback-state ve coverage genisletme turu

Bu, boilerplate'in canonical baslangic siralamasidir.

### Istege bagli siralama: Reference Expansion

1. Foundation / reference test UIs
2. Feedback-state reference screens
3. Coverage eksigi kalan component aileleri
4. Sonra yeniden starter screen ailesine donus

Bu mod yalnizca design vocabulary veya component coverage denetimi yapiyorsan erken kullanilir.

---

## Starter Flow Haritasi

Boilerplate ekranlari birbirinden bagimsiz vitrinler degil, bir akisin parcalaridir.

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
5. Ilk kullanim sonrasi onboarding:
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
8. Feature referans akisi:
   - `List Screen`
   - `Detail Screen`
   - `Create / Edit Form Screen`

Kural:

- her ekran yalnizca kendi semantigini tasimaz
- ayni zamanda bu akista nereye baglandigi da briefing icinde gorunmelidir

---

## 1. Foundation / Reference Test Ekranlari

Bu ekranlar internal'dir.
Ama tum starter sistemin kalitesini belirler.

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

Foundation ekranlari, `@project/ui` kapsamiyla eslestirilerek dusunulmelidir.

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
  erisilebilirlik ve okunabilirlik aileleri: `SkipToContent`, focus-visible, dynamic type, contrast-sensitive surfaces
- `Utility and Quality Patterns Reference`
  kalite ve utility aileleri: `AppLockScreen`, `StickyFooter`, `WebViewPlaceholder`, `CountdownTimer`, `DividerWithLabel`

Eger bu ailelerden biri Stitch turetilen ekranlarda hic gorunmuyorsa, coverage eksik sayilir.

### Ornek prompt — UI Kit / Component Gallery

```text
Design style: A premium, modern product boilerplate reference experience.
Clean, focused, and high-trust.
Strategic minimalism over decorative noise.
Use strong hierarchy, polished depth, and modular composition where appropriate.

Project context:
This is a cross-platform product boilerplate built for React web and React Native / Expo mobile.
The goal is a reusable UI foundation, not a one-off mockup.
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

### Ornek prompt — Typography Reference

```text
Design style: A premium, modern product boilerplate reference experience.
Clean, focused, and high-trust.

Project context:
This is a cross-platform product boilerplate with token-first design-system goals.
This screen is an internal typography and readability reference.

Screen:
Typography Reference

Purpose:
Show the typographic hierarchy, text roles, weight spectrum, helper text language, caption rhythm, and readability behavior used by the boilerplate.

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

### Ornek prompt — Feedback States Reference

```text
Design style: A premium, modern product boilerplate reference experience.
Clean, focused, and high-trust.
Strategic minimalism with proactive UX.

Project context:
This boilerplate treats loading, empty, error, success, and recovery states as a first-class quality system.
This is an internal reference screen.

Screen:
Feedback States Reference

Purpose:
Show how loading, empty, error, success, warning, and recovery states should appear across the boilerplate.

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

### Ornek prompt — Motion and Interaction Reference

```text
Design style: A premium, modern product boilerplate reference experience.
Clean, focused, and high-trust.

Project context:
This is an internal boilerplate reference screen for interaction quality, motion restraint, and state transitions.
Motion should support clarity, not decoration.

Screen:
Motion and Interaction Reference

Purpose:
Show how hover, pressed, focus, expand/collapse, sheet/dialog entry, loading transition, and gesture-aware feedback should feel across the boilerplate.

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
Design style: A premium, modern product boilerplate reference experience.
Clean, focused, and high-trust.

Project context:
This is an internal boilerplate reference screen focused on accessibility readiness and contrast-aware design behavior.

Screen:
Accessibility and Contrast Reference

Purpose:
Show how readable hierarchy, focus visibility, disabled states, contrast-sensitive surfaces, large text behavior, and assistive-friendly UI patterns should appear in the boilerplate.

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
Design style: A premium, modern product boilerplate reference experience.
Clean, focused, and high-trust.

Project context:
This is an internal boilerplate reference screen covering utility, quality, and protection-oriented UI patterns.

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

## 2. System / Utility Starter Screens

Bu grup, `39-default-screens-and-components-spec.md` icindeki system katmanina dayanir.

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
Design style: A premium, modern product boilerplate reference experience.
Clean, focused, and high-trust.
Strategic minimalism over decorative noise.

Project context:
This is a cross-platform product boilerplate.
This screen is a system-level utility screen, not a feature screen.

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
Design style: A premium, modern product boilerplate reference experience.
Clean, focused, and high-trust.

Project context:
This is a cross-platform boilerplate utility screen for a missing route or missing destination.

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

## 3. Auth Starter Screens

Bu grup, boilerplate'in auth katmanini temsil eder.

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

### Ornek prompt — Login Screen

```text
Design style: A premium, modern product boilerplate reference experience.
Clean, focused, and high-trust.
Refined, professional, and product-minded rather than template-like.

Project context:
This is a cross-platform boilerplate auth starter screen.
It should feel simple, credible, accessible, and production-ready.

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
Design style: A premium, modern product boilerplate reference experience.
Clean, focused, and high-trust.

Project context:
This is a cross-platform auth verification screen.

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

## 4. Onboarding Starter Screens

Bu grup, ilk deneyim ve izin akisini temsil eder.

### Zorunlu onboarding ekranlari

1. `Welcome Slides`
2. `Permission Primer`
3. `Profile Setup`

### Bu ekranlarda ana vurgu

- kisa ve net olmak
- asiri pazarlama olmamak
- kullaniciyi zorlamamak
- native quality hissi vermek

### Ornek prompt — Welcome Slides

```text
Design style: A premium, modern product boilerplate reference experience.
Clean, focused, and high-trust.
Strategic minimalism with contemporary product polish.

Project context:
This is a cross-platform boilerplate onboarding starter surface.
The goal is to teach the product shape quickly, not to create a marketing microsite.

Screen:
Welcome Slides

Purpose:
Introduce the product system in a short onboarding flow with 3 to 5 slides.

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
Design style: A premium, modern product boilerplate reference experience.
Clean, focused, and high-trust.

Project context:
This is a mobile-oriented permission pre-prompt screen inside a cross-platform boilerplate.
It should explain why a permission matters before the system dialog appears.

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

## 5. Main App Shell Starter Screens

Bu grup, authenticated kullanicinin ana uygulama kabugunu temsil eder.

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

### Ornek prompt — Home / Dashboard

```text
Design style: A premium, modern product boilerplate reference experience.
Clean, focused, and high-trust.
Use strategic minimalism and modular composition where appropriate.

Project context:
This is a cross-platform boilerplate main-app starter screen.
It should behave like a reusable shell dashboard, not a product-specific analytics page.

Screen:
Home / Dashboard

Purpose:
Serve as the authenticated user's default landing screen, showing a welcoming overview, quick actions, and starter content regions.

This screen should include:
- welcome area
- quick action cards
- recent activity or recent items section
- one or two content modules that can later be replaced by real product modules
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
- domain-specific analytics
- full admin-table density everywhere
```

### Ornek prompt — Settings

```text
Design style: A premium, modern product boilerplate reference experience.
Clean, focused, and high-trust.

Project context:
This is a cross-platform boilerplate settings starter screen.
It should feel structured, calm, and highly scannable.

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

## 6. Vertical Slice Referans Ekranlari

Bu grup, boilerplate'in gercek feature implementasyonu icin referans ispat ekranlaridir.

### Zorunlu vertical slice ekranlari

1. `List Screen`
2. `Detail Screen`
3. `Create / Edit Form Screen`

### Bu ekranlar neden kritik

- TanStack Query davranisini somutlastirir
- loading / empty / error state kullanimini gosterir
- form submit lifecycle mantigini gosterir
- yeni feature yazacak kisi icin referans olur

### Ornek prompt — List Screen

```text
Design style: A premium, modern product boilerplate reference experience.
Clean, focused, and high-trust.
Use polished depth and strong hierarchy without over-designing.

Project context:
This is a vertical-slice reference screen for a cross-platform boilerplate.
It should demonstrate a serious list experience with loading, empty, error, and pagination thinking.

Screen:
List Screen

Purpose:
Show a reusable paginated list screen pattern that can support real product data later.

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
Design style: A premium, modern product boilerplate reference experience.
Clean, focused, and high-trust.

Project context:
This is a vertical-slice reference form screen for a cross-platform boilerplate.

Screen:
Create / Edit Form Screen

Purpose:
Show a reusable create/edit form pattern with validation, dirty-state thinking, submit lifecycle, and success/error handling.

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
- cancel
- recover from validation or submit errors

Important states:
- create mode
- edit mode
- validation errors
- submitting
- submit success
- submit failure
- unsaved changes warning

User flow:
The user can create or edit an entity, understand inline validation, complete submission, and safely handle navigation away.

Do not make this screen about:
- full dashboard behavior
- system-level maintenance or offline handling
```

---

## Baslangic Ekran Envanteri

Bu liste, Stitch tarafinda ilk turda kapsanmasi tavsiye edilen minimum ekran envanteridir.

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

---

## "Metronic Ornegi" Icin Dogru Yorum

Metronic benzeri bir starter kit'ten alinacak ana ders:

- kapsam genisligi
- referans ekran zenginligi
- test UI / utility UI varligi
- reusable component coverage
- starter shell mantigi

Metronic'den alinmayacak sey:

- gorsel kopya
- ayni admin-template dili
- ayni dashboard yogunlugu
- ayni grafik / tablo default'u

Kural:

**Metronic coverage mantigi = evet.**
**Metronic gorsel kopyasi = hayir.**

---

## Iterasyon Kurallari

Ilk ekran ciktiktan sonra `edit_screens` icin su mantikla ilerle:

- tek seferde tek problem
- same design system
- same semantic role
- same quality level
- **her iterasyondan sonra sonucu dogrula, sonra siradakine gec** — timeout alindiysa ayni edit'i hemen tekrarlama

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
Make this feel more like a serious reusable starter screen and less like a generic template demo.
```

```text
Keep the same design language.
Increase the sense of polish and structure without adding decorative clutter.
```

---

## DESIGN.md ve Token Mantigi

Bu boilerplate'te Stitch, design-to-code pipeline'in ilk halkasidir.
Ama son otorite degildir.

Kritik kural:

- Stitch tasarim uretir
- DESIGN.md export edilir
- sonra bu kararlar boilerplate token sistemine map edilir

Yani prompt icinde sunlari isteme:

- exact token adlari
- Tailwind class detaylari
- NativeWind implementation detaylari

Bunlar Stitch prompt konusu degil.
Bunlar tasarimdan koda gecis asamasinin konusu.

---

## Final Kalite Kontrolu

Bir ekrani onaylamadan once sunlari sor:

- Bu ekran kendi semantic rolunu acik tasiyor mu?
- Bu ekran reusable starter screen gibi mi gorunuyor?
- Coverage amaci yerine getirildi mi?
- Loading / empty / error / success dusunuldu mu?
- Ekran generic CRUD ya da eski admin template gibi mi hissettiriyor?
- Gorsel kalite yuksek ama yine de sistematik mi?
- Gereksiz dekorasyon var mi?
- Stitch'in kendi zekasi calismis mi, yoksa brief fazla ezmis mi?
- Bu ekran starter flow haritasinda dogru yere oturuyor mu?
- Bu ekran ilgili component ailesi coverage'ine katki sagliyor mu?

Bir boilerplate batch'i onaylamadan once sunlari da sor:

- system -> auth -> onboarding -> main shell zinciri var mi?
- ayarlar alt akislari eksiksiz mi?
- en az bir vertical slice referansi var mi?
- internal reference ekranlariyla `@project/ui` coverage'i gorunur hale geldi mi?
- export alinabilecek kadar tutarli bir Stitch sistemi olustu mu?

Eger sorun semantic ise prompt'u duzelt.
Eger sorun sadece okunabilirlik / vurgu / yogunluk ise `edit_screens` ile iterasyon yap.

---

## Ic Referans Dokumanlar

Bu rehber, su boilerplate dokumanlarinin mantigiyla uyumludur:

- `docs/governance/46-stitch-pipeline-spec.md`
- `docs/design-system/03-ui-ux-quality-standard.md`
- `docs/design-system/04-design-system-architecture.md`
- `docs/design-system/05-theming-and-visual-language.md`
- `docs/design-system/25-error-empty-loading-states.md`
- `docs/design-system/39-default-screens-and-components-spec.md`
- `packages/ui/README.md`

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
- Canva: 2026 design trends
- Adobe: 2025 visual / prompt trend signals

Bu bolum, 2026-04-04 tarihinde genel internet arastirmasi ile tazelenmistir.

Bu dis referanslar yalnizca kalite tonu icindir.
Final agent talimatinda yine de Stitch'e exact tasarim komutu verilmez.
