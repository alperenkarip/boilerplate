---
id: SPEC-UI-001
version: 0.1.0
status: draft
created: 2026-06-05
updated: 2026-06-05
author: alp
priority: P0
issue_number: 0
---

# SPEC-UI-001 — Gercek cross-platform UI (Yol B)

> Platform-split primitive + design-tokens JS-token baglama + 27 mobil ekran toplu yeniden uretim.

## HISTORY

- **2026-06-05 (v0.1.0)**: Ilk taslak. Velocity remediation roadmap (Faz 2, deps: SPEC-MOBILE-001) temel alindi. Cross-platform karari Yol B (RN-native primitive + `.native.tsx`/`.web.tsx` split). react-native-web REDDEDILDI (ADR-007), NativeWind v5 ertelendi (PDR-001, JS-token fallback). Mobil ekran portu karari: "altin sablon + toplu yeniden uretim".

---

## Overview

### Amac (Why)

`@project/ui` paketi su an **%100 web-only**. Tier-1 primitive'ler raw HTML render ediyor: `Stack` -> `<div>` (`packages/ui/src/primitives/Stack.tsx:16`), `Pressable` -> `<button>` (`Pressable.tsx:24`), `Text` -> `<span>` + `var(--color-content-${color})` (`Text.tsx:36-38`). `packages/ui/package.json` icinde `react-native` bagimliligi YOK ve `0` adet `.native.tsx`/`.web.tsx` split var. 27 mobil ekran bu web-only primitive'leri import ettigi icin SPEC-MOBILE-001 Metro'yu boot etse bile her ekran Hermes'te `e.target`/`<div>` cozumlemesinde **crash eder** (`apps/mobile/src/screens/auth/LoginScreen.tsx:24` `onChange={(e) => setEmail((e.target as any).value)}`).

Bu SPEC, **gercek cross-platform UI**'i Yol B ile kurar: ayni semantic token sozlesmesinin (`SemanticTokenSet`, fan_in=5) iki platformda farkli tuketildigi, prop-API'si paylasilan ama render'i ayrilan primitive seti. **Web olдugu gibi korunur** (Tailwind CSS 4 + CSS variable), mobil RN-native eklenir.

### Yaklasim (How — ozet)

- **Platform-split**: 12 primitive icin `Primitive.web.tsx` (mevcut web render korunur) + `Primitive.native.tsx` (RN render) + paylasilan `Primitive.types.ts` (tek prop interface). Metro/bundler `.native.tsx`'i mobilde, `.web.tsx`'i webde otomatik secer.
- **Token single-source onarimi**: `apps/web/src/styles/globals.css` icindeki **elle yazilmis hex kopyasi** (`globals.css:6-50`) silinir; web CSS degiskenleri `generateCSSVariables(lightTheme/darkTheme)` (`packages/design-tokens/src/css.ts:27`) ciktisindan build-time uretilir. Boylece tema degisikligi tek kaynaktan akar.
- **JS-token consumption**: Mobil primitive'ler renk/spacing'i `useTheme().tokens` (`packages/ui/src/providers/ThemeProvider.tsx:99`) uzerinden okur; `getThemeTokens` (`nativewindStrategy.ts:21`) JS-token fallback'i kanonik kabul edilir (NativeWind v5 ertelendi, PDR-001).
- **Ekran yeniden uretim**: 3 altin sablon (`LoginScreen`/`HomeScreen`/`SettingsScreen`) RN-native olarak **mukemmellestirilir**; kalan 24 ekran bu desenle **toplu yeniden uretilir** (kademeli migrate degil — cogunun gercek is-mantigi yok, iskelet). `onChange` -> `onChangeText`, `onClick` -> `onPress`, `(e.target as any).value` kaldirilir.
- **Lint anlamlandirma**: `eslint-plugin-bp` RN kurallarini (`no-raw-pressable`/`no-raw-rn-text`/`require-design-token`) bu projenin gercek primitive desenine gore anlamli hale getir; `no-hardcoded-color` kademeli `warn` -> `error` (enforcement zamanlamasi SPEC-TEST-001'e devredilir).

### Brownfield Delta

Bu bir **BROWNFIELD** degisikliktir. Etkilenen mevcut varliklar ve delta isaretleri requirement'larda `[DELTA:*]` ile belirtilir.

---

## Constraints

- **CP-01 (Yol B baglayici)**: react-native-web KULLANILMAZ. Web stack (Tailwind CSS 4 + CSS variable) bozulmaz. Kaynak: ADR-007, roadmap §Cross-Platform Stratejik Karari.
- **CP-02 (NativeWind ertelendi)**: Mobil primitive'ler NativeWind v5 className tuketmez; JS-token (`useTheme().tokens` / `getThemeTokens`) kanonik. NativeWind v5 ADR-007 §43 gate'ine kadar kapsam disi. Kaynak: PDR-001.
- **CP-03 (Semantic token stabil)**: `SemanticTokenSet` sekli (kategori ekle/cikar) DEGISTIRILMEZ (fan_in=5, `semantic/types.ts:64`). Mevcut token rolleri korunur.
- **CP-04 (Sifir web regresyonu)**: Web primitive render ciktisi ve 28 web sayfasinin gorunur davranisi degismez. `.types.ts` prop interface'i web ve mobilde ayni kalir (API drift yok).
- **CP-05 (Bagimlilik on-kosulu)**: SPEC-MOBILE-001 (babel/metro/asset/bootstrap) TAMAMLANMIS olmali; bu SPEC babel/metro config'e dokunmaz.

---

## Requirements (EARS)

> EARS terimleri ve teknik isimler Ingilizce; aciklamalar Turkce. Toplam 5 modul.

### REQ-PRIM — Platform-Split Primitive Seti

- **REQ-PRIM-01 (Ubiquitous)**: The UI package **shall** provide each of the 12 Tier-1 primitives as a triad of `Primitive.web.tsx`, `Primitive.native.tsx`, and a shared `Primitive.types.ts` exporting a single prop interface consumed by both platform files. `[DELTA:MODIFIED]` (mevcut tekil `Primitive.tsx` dosyalari `packages/ui/src/primitives/`)
- **REQ-PRIM-02 (Ubiquitous)**: For any primitive, the `.web.tsx` and `.native.tsx` implementations **shall** import their prop type exclusively from the shared `.types.ts`, so the public prop API is identical across platforms. `[DELTA:NEW]`
- **REQ-PRIM-03 (State-Driven)**: **While** the bundler resolves modules for the web target, the system **shall** select `Primitive.web.tsx`; **while** resolving for the native target, it **shall** select `Primitive.native.tsx`. `[DELTA:NEW]`
- **REQ-PRIM-04 (Unwanted)**: **If** a `.native.tsx` primitive renders a web-only DOM element (`div`, `span`, `button`) or reads a DOM-only field (`e.target`, `e.currentTarget`), **then** the system **shall** treat it as a defect and the build **shall not** ship it. `[DELTA:NEW]`

### REQ-TOKEN — Token Single-Source & JS-Token Binding

- **REQ-TOKEN-01 (Event-Driven)**: **When** the web app is built, the system **shall** generate the CSS custom properties block from `generateCSSVariables(lightTheme)` and `generateCSSVariables(darkTheme)`, replacing the hand-maintained hex block in `apps/web/src/styles/globals.css`. `[DELTA:MODIFIED]` (`globals.css:6-50` elle hex)
- **REQ-TOKEN-02 (Unwanted)**: **If** a hand-edited hex color literal duplicating a semantic token value exists in `globals.css` after the build wiring, **then** the system **shall** be considered to have a single-source violation and **shall not** pass acceptance. `[DELTA:MODIFIED]`
- **REQ-TOKEN-03 (Event-Driven)**: **When** a native primitive needs a color or spacing value, the system **shall** resolve it from `useTheme().tokens` (or `getThemeTokens(mode)` outside provider scope) rather than a hardcoded literal. `[DELTA:NEW]`

### REQ-MIGRATE — `var(--color)` Pilot Migration

- **REQ-MIGRATE-01 (Event-Driven)**: **When** migrating the pilot primitives (`Stack`, `Text`, `Button`, `Box`), the system **shall** replace direct `var(--color-*)` reads in the native path with `useTheme().tokens` lookups while keeping the web path on `var(--color-*)`. `[DELTA:MODIFIED]` (246 `var(--color)` occurrence; pilot subset)
- **REQ-MIGRATE-02 (Optional)**: **Where** a non-pilot `var(--color-*)` occurrence remains on the web path, the system **shall** leave it unchanged in this SPEC (staged migration; full sweep deferred). `[DELTA:UNCHANGED]`

### REQ-SCREEN — Altin Sablon + Toplu Yeniden Uretim

- **REQ-SCREEN-01 (Ubiquitous)**: The system **shall** establish 3 golden-template screens (`LoginScreen`, `HomeScreen`, `SettingsScreen`) as RN-native reference implementations that consume only platform-split primitives and JS-token styling. `[DELTA:MODIFIED]`
- **REQ-SCREEN-02 (Event-Driven)**: **When** regenerating the remaining 24 screens, the system **shall** reproduce them from the golden-template pattern (full RN-native rewrite, not incremental migration), replacing every `onChange` with `onChangeText`, every `onClick` with `onPress`, and removing every `(e.target as any).value` access. `[DELTA:MODIFIED]` (27 ekran, 50 onClick/e.target/onChange, 0 onPress)
- **REQ-SCREEN-03 (Unwanted)**: **If** any of the 27 screens still imports a web-only primitive render path or uses a DOM event handler after regeneration, **then** the system **shall** flag it as a render-crash risk and the screen **shall not** be marked done. `[DELTA:MODIFIED]`

### REQ-LINT — eslint-plugin-bp Anlamlandirma

- **REQ-LINT-01 (Event-Driven)**: **When** the project's RN screen files are linted, the rules `no-raw-pressable`, `no-raw-rn-text`, and `require-design-token` **shall** flag this codebase's actual anti-patterns (raw RN element usage and non-token styling in native paths), not produce dead/no-op coverage. `[DELTA:MODIFIED]` (`packages/eslint-plugin-bp/src/rules/`)
- **REQ-LINT-02 (State-Driven)**: **While** this SPEC is in effect, `no-hardcoded-color` **shall** remain at `warn` severity for the migration surface; the `warn` -> `error` promotion and CI enforcement timing **shall** be owned by SPEC-TEST-001. `[DELTA:MODIFIED]` (`recommended.js:9` su an `error`)

---

## Exclusions (What NOT to Build) / Kapsam Disi

- **EX-01**: NativeWind v5 production wiring. JS-token (`useTheme().tokens`) kanonik kalir; NativeWind ADR-007 §43 gate'ine kadar yazilmaz (PDR-001).
- **EX-02**: Mobil babel/metro/asset/bootstrap. SPEC-MOBILE-001 on-kosulu; bu SPEC config dosyalarina dokunmaz.
- **EX-03**: Auth/sample is-mantigi wiring (form submit, mutation, AuthProvider). Ekranlar gorunum + handler imzasi seviyesinde yeniden uretilir; veri/auth akisi SPEC-AUTH-001 / SPEC-API-001'e aittir.
- **EX-04**: `SemanticTokenSet` sekil degisikligi. Token kategorisi ekleme/cikarma yok (stabil, fan_in=5).
- **EX-05**: 246 `var(--color)` occurrence'in tamaminin tek seferde migrate'i. Sadece pilot (`Stack`/`Text`/`Button`/`Box`) bu SPEC kapsaminda; kalan kademeli/sonraki.
- **EX-06**: `no-hardcoded-color` `error` enforcement ve CI lint gate kilidi (SPEC-TEST-001).
- **EX-07**: react-native-web — Storybook dahil hicbir uretim/test yolunda kullanilmaz (ADR-007).

---

## Dependencies

- **SPEC-MOBILE-001** (P0, Faz 1) — Metro boot + babel worklet + Hermes/expo-doctor gate. Bu SPEC "ekranlar Hermes'te crash etmeden render eder" kriterini devralir.

## Downstream (bu SPEC'i bekleyenler)

- **SPEC-AUTH-001** (form canlandirma, ekranlar uzerine provider/guard) — `deps: API, UI`.
- **SPEC-TEST-001** (lint gate + coverage + E2E) — `no-hardcoded-color` enforcement ve plugin self-test.
