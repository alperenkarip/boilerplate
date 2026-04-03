# @project/design-tokens

Cross-platform design token sistemi. Tum renk, tipografi, spacing, radius, border, elevation, motion ve opacity degerleri bu paketten yonetilir. Web ve mobile uygulamalar bu token'lari tuketir.

## Token Hiyerarsisi

Token sistemi uc katmanli bir hiyerarsiye sahiptir. Bu yapi degistirilemez:

1. **Raw (Palette)** -- Ham degerler. Renk kodlari, piksel degerleri, sure degerleri gibi sabit primitifler. `src/raw/` altinda tanimlanir.
2. **Semantic (Roles)** -- Anlam tasiyan roller. `color.background.primary`, `spacing.md` gibi kullanim amacina gore isimlenir. `src/semantic/` altinda tanimlanir.
3. **Component (Consumption)** -- Component'ler semantic token'lari tuketir. Hicbir component dogrudan raw degere erismemelidir.

## Dosya Yapisi

```
src/
  raw/                  # Ham degerler (palette)
    colors.ts           # Renk paleti
    typography.ts       # Font aileleri, boyutlar, agirliklar
    spacing.ts          # Spacing olcekleri
    radius.ts           # Border radius degerleri
    border.ts           # Border genislikleri ve stilleri
    elevation.ts        # Golge ve yukseklik degerleri
    motion.ts           # Animasyon sureleri ve easing fonksiyonlari
    opacity.ts          # Seffaflik degerleri
    index.ts            # Barrel export
  semantic/             # Semantic roller
    index.ts            # Semantic token tanimlari
    types.ts            # TypeScript tip tanimlari
  themes/               # Tema varyantlari
    light.ts            # Acik tema semantic degerleri
    dark.ts             # Koyu tema semantic degerleri
    index.ts            # Barrel export
  css.ts                # CSS variable generation
  theme.css.ts          # CSS theme dosyasi uretimi
  index.ts              # Ana barrel export
```

## Kullanim

```typescript
import { lightTheme, darkTheme, rawTokens } from '@project/design-tokens';
```

## Yeni Token Ekleme

Yeni bir token eklemek icin su siralamayi takip edin:

1. `src/raw/` altindaki ilgili dosyaya ham degeri ekleyin (ornegin yeni bir renk icin `colors.ts`)
2. `src/semantic/index.ts` dosyasinda semantic role atayin (ornegin `color.background.tertiary`)
3. `src/themes/light.ts` ve `src/themes/dark.ts` dosyalarinda tema bazinda degerleri tanimlayin

Bu siralama bozulmamalidir. Semantic token olmadan raw deger kullanilmaz, tema dosyasinda degeri olmayan semantic token uretilmez.

## Light/Dark Tema

`themes/light.ts` ve `themes/dark.ts` dosyalari ayni semantic token anahtarlarini kullanir ancak farkli raw degerlere referans verir. Ornegin `color.background.primary` light temada beyaza, dark temada koyu griye isaret eder.

ThemeProvider tema gecisini runtime'da yonetir.

## Projeye Ozel Branding

Boilerplate'i yeni bir proje icin ozellestirirken:

1. `src/raw/colors.ts` dosyasindaki renk paletini proje markasina gore degistirin
2. Semantic roller otomatik olarak yeni raw degerleri tuketir
3. Gerekiyorsa `typography.ts` dosyasindaki font ailelerini guncelleyin

Semantic veya tema katmanlarinda ek degisiklik gerekmez -- raw katmandaki degisiklik tum sisteme yansir.

## Referans Dokumanlar

- Token spesifikasyonu: `docs/design-system/22-design-tokens-spec.md`
- Component governance: `docs/design-system/23-component-governance-rules.md`
- Platform adaptasyon: `docs/design-system/26-platform-adaptation-rules.md`
