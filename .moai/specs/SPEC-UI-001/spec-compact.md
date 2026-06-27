# SPEC-UI-001 (Compact)

**Baslik:** Gercek cross-platform UI (Yol B) — platform-split primitive + design-tokens JS-token baglama + 27 mobil ekran toplu yeniden uretim.
**Oncelik:** P0 | **Faz:** 2 | **Deps:** SPEC-MOBILE-001 | **Tip:** BROWNFIELD

**Karar:** Yol B (`.native.tsx`/`.web.tsx` split + paylasilan `.types.ts`). react-native-web REDDEDILDI (ADR-007). NativeWind v5 ertelendi -> JS-token fallback (PDR-001).

---

## Requirements (EARS, 5 modul)

| ID | Tip | Ozet |
|----|-----|------|
| REQ-PRIM-01 | Ubiquitous | 12 primitive: `.web.tsx` + `.native.tsx` + paylasilan `.types.ts` triad. |
| REQ-PRIM-02 | Ubiquitous | Iki platform dosyasi prop tipini SADECE `.types.ts`'ten alir (API drift yok). |
| REQ-PRIM-03 | State-Driven | Bundler web target -> `.web.tsx`, native target -> `.native.tsx` secer. |
| REQ-PRIM-04 | Unwanted | Native primitive DOM elementi/`e.target` render ederse defekt; ship edilmez. |
| REQ-TOKEN-01 | Event-Driven | Web build CSS degiskenlerini `generateCSSVariables(light/dark)`'tan uretir. |
| REQ-TOKEN-02 | Unwanted | `globals.css`'te elle hex kopyasi kalirsa single-source ihlali; gecmez. |
| REQ-TOKEN-03 | Event-Driven | Native renk/spacing `useTheme().tokens` / `getThemeTokens`'tan, hardcoded degil. |
| REQ-MIGRATE-01 | Event-Driven | Pilot (`Stack`/`Text`/`Button`/`Box`) native path -> token lookup; web path `var(--color-*)` kalir. |
| REQ-MIGRATE-02 | Optional | Pilot-disi `var(--color-*)` web occurrence'lar bu SPEC'te degismez (staged). |
| REQ-SCREEN-01 | Ubiquitous | 3 altin sablon (`LoginScreen`/`HomeScreen`/`SettingsScreen`) RN-native referans. |
| REQ-SCREEN-02 | Event-Driven | 24 ekran altin sablondan yeniden uret; `onChange`->`onChangeText`, `onClick`->`onPress`, `e.target` kaldir. |
| REQ-SCREEN-03 | Unwanted | Ekran web-only primitive/DOM handler tutarsa crash-risk; done degil. |
| REQ-LINT-01 | Event-Driven | `no-raw-pressable`/`no-raw-rn-text`/`require-design-token` gercek anti-pattern flag eder (no-op degil). |
| REQ-LINT-02 | State-Driven | `no-hardcoded-color` `warn` kalir; `error` promosyonu SPEC-TEST-001'de. |

---

## Acceptance (ozet)

- **AC-01 [MUST]**: Sifir web regresyonu — 28 sayfa + primitive web render degismez.
- **AC-02 [MUST]**: Mobil crash-free render — 27 ekran Hermes'te crash etmez; `onClick`/`e.target` grep=0.
- **AC-03**: Token single-source — `globals.css` elle hex silindi, `generateCSSVariables`'tan uretiliyor.
- **AC-04**: Pilot migration — native token lookup, web `var(--color-*)` korunur.
- **AC-05**: 3 altin sablon + 24 ekran yeniden uretildi.
- **AC-06**: Lint anlamli; `no-hardcoded-color` `warn`.

---

## Degisecek / Eklenecek Dosyalar

| Dosya | Islem |
|-------|-------|
| `packages/ui/src/primitives/*.tsx` (12) | SPLIT -> `*.web.tsx` + `*.native.tsx` + `*.types.ts` |
| `packages/ui/src/primitives/index.ts` | Barrel platform-agnostik kontrol |
| `packages/ui/package.json` | `react-native` dependency EKLE (su an YOK) |
| `apps/web/src/styles/globals.css` | Elle hex blok (`:6-50`) SIL -> build-time uretim |
| `packages/design-tokens/src/css.ts` | `generateCSSVariables` web build'e BAGLA (wiring) |
| `apps/mobile/src/screens/**/*.tsx` (27) | YENIDEN URET (3 altin + 24 toplu; DOM-event -> RN) |
| `packages/eslint-plugin-bp/src/rules/{no-raw-pressable,no-raw-rn-text,require-design-token}.js` | ANLAMLANDIR |
| `packages/eslint-plugin-bp/src/configs/recommended.js` | `no-hardcoded-color` -> `warn` (migration surface) |

**Dokunulmaz:** `packages/design-tokens/src/semantic/types.ts` (`SemanticTokenSet`, fan_in=5).

---

## Kapsam Disi (What NOT to Build)

- **EX-01**: NativeWind v5 production (JS-token kanonik, ADR-007 §43 gate'e kadar).
- **EX-02**: Mobil babel/metro/asset/bootstrap (SPEC-MOBILE-001 on-kosulu).
- **EX-03**: Auth/sample is-mantigi wiring (SPEC-AUTH-001 / SPEC-API-001).
- **EX-04**: `SemanticTokenSet` sekil degisikligi (stabil).
- **EX-05**: 246 `var(--color)` tamaminin tek seferde migrate'i (sadece pilot).
- **EX-06**: `no-hardcoded-color` `error` + CI lint gate (SPEC-TEST-001).
- **EX-07**: react-native-web (Storybook dahil hicbir yolda).
