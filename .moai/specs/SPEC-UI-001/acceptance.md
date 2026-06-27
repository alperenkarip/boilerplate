# SPEC-UI-001 — Acceptance Criteria

> Given-When-Then senaryolari. Aciklamalar Turkce; teknik terim/komut Ingilizce.
> Must-pass kriterler: AC-01 (sifir web regresyonu) ve AC-02 (mobil crash-free render).

---

## AC-01 — Sifir Web Regresyonu [MUST-PASS]

**REQ:** REQ-PRIM-02, CP-04

- **Given** mevcut 28 web sayfasi ve Tier-1 primitive'lerin web render ciktisi (platform-split oncesi baseline),
- **When** 12 primitive `.web.tsx`/`.native.tsx`/`.types.ts` olarak ayrildiktan sonra web build (`pnpm --filter web build`) calistirildiginda,
- **Then** her web primitive ayni DOM ciktisini uretir (`Stack` -> `<div>`, `Pressable` -> `<button>`, `Text` -> `<span>` + `var(--color-content-*)`), 28 sayfanin gorunur davranisi degismez ve prop API'si (`.types.ts`) web/mobilde birebir aynidir.

## AC-02 — Mobil Crash-Free Render [MUST-PASS]

**REQ:** REQ-PRIM-04, REQ-SCREEN-01..03

- **Given** SPEC-MOBILE-001 Metro boot + Hermes/expo-doctor gate gecmis bir mobil runtime,
- **When** uygulama Hermes uzerinde acilir ve 27 ekran navigator uzerinden gezilir,
- **Then** hicbir ekran `e.target`/`<div>`/`<span>`/`<button>` cozumlemesinden dolayi crash etmez; tum ekranlar platform-split native primitive'leri render eder ve `apps/mobile/src/screens/` icinde `onClick`/`e.target`/`onChange=` grep sonucu **0**, `onPress`/`onChangeText` > 0 olur.

> Gerilim notu: SPEC-MOBILE-001 yalniz Metro boot + Hermes/doctor garanti eder; "ekranlar crash etmeden render eder" kriterini **bu SPEC** sahiplenir.

## AC-03 — Token Single-Source

**REQ:** REQ-TOKEN-01..02

- **Given** `apps/web/src/styles/globals.css` icindeki elle yazilmis hex blogu (`:root` + `[data-theme="dark"]`, `globals.css:6-50`),
- **When** web build, CSS degiskenlerini `generateCSSVariables(lightTheme)` + `generateCSSVariables(darkTheme)` ciktisindan uretir ve elle hex blogu silinir,
- **Then** uretilen CSS degisken seti eski elle hex setiyle anlamca denktir (ayni degisken adlari + ayni degerler), `globals.css` icinde semantic token degerini cogaltan elle hex literal kalmaz ve tema kaynagi tek noktadir (`packages/design-tokens`).

## AC-04 — Pilot var(--color) Migration

**REQ:** REQ-MIGRATE-01..02, REQ-TOKEN-03

- **Given** pilot primitive'ler (`Stack`, `Text`, `Button`, `Box`) ve 246 `var(--color-*)` occurrence,
- **When** pilot primitive'lerin native path'i `useTheme().tokens` lookup'a, web path'i `var(--color-*)` korunarak migrate edildiginde,
- **Then** pilot native render renkleri JS-token'dan okur (hardcoded hex yok), pilot web render `var(--color-*)` ile calismaya devam eder ve pilot-disi web occurrence'lar degismez (staged migration).

## AC-05 — Ekran Toplu Yeniden Uretim

**REQ:** REQ-SCREEN-01..03

- **Given** 3 altin sablon (`LoginScreen`/`HomeScreen`/`SettingsScreen`) ve kalan 24 ekran,
- **When** 24 ekran altin sablon deseniyle RN-native olarak yeniden uretildiginde,
- **Then** her ekran yalniz platform-split primitive tuketir, `onChange` -> `onChangeText` / `onClick` -> `onPress` donusumu tamamlanmistir, `(e.target as any).value` erisimi kalmaz ve navigator wrapper deseni (`AppNavigator.tsx:64-104`) korunur.

## AC-06 — Lint Anlamlandirma

**REQ:** REQ-LINT-01..02

- **Given** `eslint-plugin-bp` RN kurallari (`no-raw-pressable`/`no-raw-rn-text`/`require-design-token`) ve `no-hardcoded-color`,
- **When** mobil ekran/primitive dosyalari lint edildiginde,
- **Then** kurallar bu projenin gercek anti-pattern'lerini (native path'te raw RN element / hardcoded renk) flag eder (dead/no-op degil), `no-hardcoded-color` `warn` seviyesinde kalir ve `error` promosyonu bu SPEC'te zorlanmaz (SPEC-TEST-001'e devredilir).

---

## Edge Cases

- **EC-01 (Bundler resolution belirsizligi)**: Web target yanlislikla `.native.tsx`'i (veya tersi) secerse — beklenen: web sadece `.web.tsx`, native sadece `.native.tsx` cozer; yanlis secim build hatasi/regresyon olarak yakalanir.
- **EC-02 (Provider disi token erisimi)**: Bir native primitive `ThemeProvider` agacinin disinda kullanilirsa — beklenen: `useTheme()` throw eder (`ThemeProvider.tsx:102`); bu senaryolarda `getThemeTokens(mode)` fallback kullanilir.
- **EC-03 (Tema degisikligi runtime)**: `toggle()` ile light<->dark gecisinde — beklenen: web `data-theme` attribute + native `useTheme().tokens` ayni anda dogru tema verir; iki platform da senkron.
- **EC-04 (Eksik react-native dependency)**: `packages/ui/package.json`'da `react-native` eklenmezse — beklenen: native import cozulemez; build/typecheck bunu acikca raporlar (sessiz no-op degil).
- **EC-05 (Is-mantigi olmayan iskelet ekran)**: Gercek is-mantigi olmayan ekran yeniden uretildiginde — beklenen: handler imzasi dogru (`onPress`/`onChangeText`) ama govde bos/placeholder; `@MX:TODO` ile SPEC-AUTH-001'e devredilir (scope creep yok).

---

## Definition of Done

- [ ] 12 primitive `.web.tsx` + `.native.tsx` + paylasilan `.types.ts` olarak ayrildi.
- [ ] Web primitive render ciktisi degismedi (AC-01 must-pass).
- [ ] 27 ekran Hermes'te crash-free render eder (AC-02 must-pass).
- [ ] `globals.css` elle hex silindi; CSS degiskenleri build-time `generateCSSVariables`'dan uretiliyor (AC-03).
- [ ] Pilot primitive (`Stack`/`Text`/`Button`/`Box`) native path JS-token, web path `var(--color-*)` (AC-04).
- [ ] 3 altin sablon + 24 ekran yeniden uretildi; `onClick`/`e.target`/`onChange=` grep -> 0 (AC-05).
- [ ] `eslint-plugin-bp` RN kurallari anlamli; `no-hardcoded-color` `warn` (AC-06).
- [ ] `SemanticTokenSet` sekli degismedi (CP-03).
- [ ] MX tag plani uygulandi (ANCHOR `.types.ts`'lere tasindi).

---

## Quality Gate (TRUST 5)

- **Tested**: Web primitive snapshot esitligi + mobil smoke render (SPEC-MOBILE-001 setup'i uzerine); pilot native token lookup birim testi. Tam coverage threshold SPEC-TEST-001.
- **Readable**: Prop interface tek kaynak (`.types.ts`); web/native render ayrik ve okunabilir.
- **Unified**: Tutarli platform-split adlandirma (`.web.tsx`/`.native.tsx`/`.types.ts`); barrel export degismedi.
- **Secured**: Token degeri tek kaynak (single-source); hardcoded renk sizintisi yok.
- **Trackable**: MX ANCHOR/NOTE/WARN/TODO plani; REQ-AC izlenebilirligi; SPEC-MOBILE-001/AUTH-001/TEST-001 sinirlari net.
