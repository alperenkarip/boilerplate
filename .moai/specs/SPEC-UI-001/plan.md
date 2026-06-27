# SPEC-UI-001 — Implementation Plan

> Gercek cross-platform UI (Yol B): platform-split primitive + design-tokens JS-token baglama + 27 mobil ekran toplu yeniden uretim.
> Aciklamalar Turkce, teknik terim/komut Ingilizce. Sure tahmini yok — oncelik etiketi (P) ve faz sirasi kullanilir.

---

## Teknoloji & Surum

| Alan | Karar | Kaynak / Dogrulama |
|------|-------|--------------------|
| Cross-platform stratejisi | Yol B: `.native.tsx`/`.web.tsx` split + paylasilan `.types.ts` | ADR-007, roadmap §Cross-Platform |
| Web styling | Tailwind CSS 4 + CSS custom properties (KORUNUR) | `apps/web/src/styles/globals.css:1` `@import "tailwindcss"` |
| Mobil styling | JS-token: `useTheme().tokens` / `getThemeTokens(mode)` | `ThemeProvider.tsx:99`, `nativewindStrategy.ts:21` |
| NativeWind | ERTELENDI (v5 pre-release, SDK55 dogrulanmamis) | PDR-001, ADR-007 §43 gate |
| Token kaynagi | `generateCSSVariables(lightTheme/darkTheme)` build-time | `packages/design-tokens/src/css.ts:27` |
| Token sozlesmesi | `SemanticTokenSet` (stabil, fan_in=5) | `semantic/types.ts:64` |
| Lint | `eslint-plugin-bp` ESLint 9 flat config | `packages/eslint-plugin-bp/src/configs/recommended.js` |
| Bundler split | Metro (native) / Vite (web) platform extension resolution | Metro `sourceExts`, Vite default `.web.` |

---

## Gorev Decomposition (sirali)

> Sira: primitive split -> token baglama -> 3 altin sablon -> 24 ekran toplu yeniden uretim -> lint anlamlandirma.
> Multi-file decomposition kurali (3+ dosya) geregi mantiksal birimlere bolundu.

### M1 — Platform-Split Primitive Altyapisi (P0)

**REQ:** REQ-PRIM-01..04

1. Her 12 primitive icin `Primitive.types.ts` cikar: mevcut tekil dosyadaki prop interface'i (orn. `StackProps`, `PressableProps`, `TextProps`) buraya tasi. Web/mobil ortak tek kaynak.
   - Reference: `packages/ui/src/primitives/Stack.tsx:6-12` (StackProps), `Text.tsx:8-24` (TextProps), `Pressable.tsx:4-12` (PressableProps).
2. Mevcut tekil dosyalari `Primitive.web.tsx`'e tasi (render aynen korunur — sifir web regresyon). Import'lari `.types.ts`'ten al.
3. `Primitive.native.tsx` yaz: RN `View`/`Text`/`Pressable` ile ayni prop sozlesmesini implement et; renk/spacing `useTheme().tokens`'tan.
4. `index.ts` barrel'i platform-agnostik tut (uzanti vermeden import — bundler cozer).
   - Reference: `packages/ui/src/primitives/index.ts:3-14`.
5. `packages/ui/package.json`'a `react-native` peer/dev dependency ekle (su an YOK — bu yuzden native import'lar cozulmuyor).

**Pilot oncelik (M3 ile ortak):** `Stack`, `Text`, `Button`, `Box` ilk split edilir (en yuksek fan_in).

### M2 — Token Single-Source Onarimi + JS-Token Baglama (P0)

**REQ:** REQ-TOKEN-01..03, REQ-MIGRATE-01..02

1. `globals.css` elle hex blogunu (`globals.css:6-50` `:root` + `[data-theme="dark"]`) build-time uretime cevir: `generateCSSVariables(lightTheme)` -> `:root`, `generateCSSVariables(darkTheme)` -> `[data-theme="dark"]`. Vite plugin veya prebuild script ile `globals.css`'e enjekte et.
   - Reference: `packages/design-tokens/src/css.ts:27` (`generateCSSVariables`), `themes/light.ts` + `themes/dark.ts`.
2. Elle hex kopyasini sil; tek kaynak `design-tokens` paketi olsun (REQ-TOKEN-02 single-source dogrulamasi).
3. Pilot primitive'lerin native path'ini `useTheme().tokens` lookup'a baglar (web path `var(--color-*)` kalir).
   - Reference: `Text.tsx:38` `var(--color-content-${color})` -> native: `tokens.content[color]`.
4. `getThemeTokens` fallback'i kanonik kabul et (provider disi senaryolar).
   - Reference: `nativewindStrategy.ts:21`.

### M3 — 3 Altin Sablon (P0)

**REQ:** REQ-SCREEN-01

1. `LoginScreen` (auth) mukemmellestir: `(e.target as any).value` (`LoginScreen.tsx:24,30`) kaldir, `TextField` `onChangeText`, `Button` `onPress`. Sadece platform-split primitive tuket.
2. `HomeScreen` (main) mukemmellestir: `onClick` -> `onPress`.
   - Reference: raw research "HomeScreen.tsx:3,19,26 onClick".
3. `SettingsScreen` (main) mukemmellestir: liste/satir etkilesimleri `onPress`.
4. Bu 3 ekran kanonik desen dokumantasyonu olur (M4 girdisi).

### M4 — 24 Ekran Toplu Yeniden Uretim (P0)

**REQ:** REQ-SCREEN-02..03

1. Kalan 24 ekrani M3 deseniyle RN-native olarak **yeniden uret** (kademeli migrate degil): auth (4), main (6), onboarding, sample, system (5), Splash/Biometric/ForceUpdate.
   - Reference: `apps/mobile/src/screens/` (27 dosya: auth/5, main/8, system/5, + onboarding/sample/3 tekil).
2. Her ekranda: `onChange` -> `onChangeText`, `onClick` -> `onPress`, `(e.target as any).value` kaldir (toplam 50 DOM-event occurrence).
3. Navigator wrapper deseni korunur (`AppNavigator.tsx:64-104` route.params -> props adapteri).
4. Is-mantigi wiring YAPILMAZ (EX-03) — handler imzasi + gorunum.

### M5 — Lint Anlamlandirma (P0/P1 sinirinda)

**REQ:** REQ-LINT-01..02

1. `no-raw-pressable` / `no-raw-rn-text` kurallarini bu projenin gercek desenine gore gozden gecir (su an RN `import { Pressable }` yakalar; native primitive yolu hedeflenmeli).
   - Reference: `packages/eslint-plugin-bp/src/rules/no-raw-pressable.js:48-62`.
2. `require-design-token` Tailwind-default-renk yakalamasini native primitive hardcoded-renk desenine genislet/anlamlandir.
   - Reference: `require-design-token.js:11-12` (TAILWIND_DEFAULT_COLOR_REGEX).
3. `no-hardcoded-color` `warn` tut (REQ-LINT-02); `error` promosyonu + CI gate SPEC-TEST-001'e birak.
   - Reference: `recommended.js:9` (`no-hardcoded-color: 'error'` -> migration surface'te `warn`).

---

## Risk & Azaltma

| Risk | Etki | Azaltma |
|------|------|---------|
| **Web regresyonu** (en yuksek) | 28 web sayfasi bozulur, ADR-007 ihlali | Web path AYNEN korunur (`.web.tsx` = mevcut dosya); `.types.ts` prop API drift'ini engeller; pilot-first kademeli; acceptance'ta sifir-regresyon must-pass. |
| Token build wiring web'i bozar | CSS degisken eksik -> tum renkler kayip | `generateCSSVariables` ciktisi elle blokla byte-denk dogrulanir (snapshot) silmeden once; build sirasi (token uret -> globals.css yaz) garanti. |
| Ekran yeniden uretim is-mantigi sizdirir | Scope creep, SPEC-AUTH-001 ile cakisma | EX-03 net sinir: sadece handler imzasi + gorunum; mutation/provider yok. |
| `.native.tsx` Hermes crash | Mobil app acilmaz | REQ-PRIM-04 + REQ-SCREEN-03 unwanted: DOM elementi/`e.target` yasak; acceptance crash-free render must-pass. |
| Lint kuralı yanlis pozitif | Web kodu hatali flag | M5 once gozden gecir, `warn` ile basla; enforcement SPEC-TEST-001. |
| SemanticTokenSet drift | 5 tuketici kirilir | EX-04 + CP-03: sekil dondurulur; sadece tuketim degisir. |

---

## MX Tag Plani

| Hedef | Tag | Gerekce |
|-------|-----|---------|
| Her `Primitive.types.ts` (paylasilan prop interface) | `@MX:ANCHOR` + `@MX:REASON` | Web+native iki render'in sozlesmesi; degisiklik iki platformu birden kirar. |
| `Stack.types.ts` | `@MX:ANCHOR` (mevcut `Stack.tsx:2` ANCHOR'i tasi) | fan_in 51+ (en yuksek layout primitive). |
| `Text.types.ts` | `@MX:ANCHOR` (mevcut `Text.tsx:2` ANCHOR'i tasi) | fan_in 46+ tipografi. |
| Token build wiring (globals.css uretici) | `@MX:NOTE` | Single-source intent; elle hex'e geri donulmemeli uyarisi. |
| `*.native.tsx` DOM-kullanim noktalari (gecici) | `@MX:WARN` + `@MX:REASON` | Hermes crash danger zone; native'de DOM API yasak. |
| Yeniden uretilen ekranlarda eksik wiring | `@MX:TODO` | Auth/sample handler govdesi SPEC-AUTH-001'de baglanacak. |

> `SemanticTokenSet` (`semantic/types.ts:62`) ANCHOR'i DEGISMEZ — fan_in=5 korunur, sadece referans edilir.

---

## Dogrulama Stratejisi (ozet — detay acceptance.md)

- Web build snapshot: `generateCSSVariables` ciktisi == eski elle hex (byte/anlamca denk).
- Mobil: 27 ekran Hermes'te crash-free render (SPEC-MOBILE-001 Metro boot uzerine).
- Grep gate: `apps/mobile/src/screens/` icinde `onClick`/`e.target`/`onChange=` -> 0.
- Lint: pilot primitive native path'inde hardcoded renk -> kural tetiklenir.
