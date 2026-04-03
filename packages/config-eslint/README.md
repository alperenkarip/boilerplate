# @project/config-eslint

Monorepo genelinde paylasilan ESLint konfigurasyonu. Flat config yapisini (ESLint 9.x) kullanir.

## Dosya Yapisi

```
eslint.config.js        # Ana flat config dosyasi
package.json
```

## Kullanim

Diger paketler ve uygulamalar bu konfigurasyonu `extends` ile kullanir. Paketin veya uygulamanin kendi `eslint.config.js` dosyasinda:

```javascript
import baseConfig from '@project/config-eslint';

export default [
  ...baseConfig,
  // Projeye ozel ek kurallar buraya eklenebilir
];
```

## Kapsam

Konfigurasyonda tanimli temel kurallar:

- TypeScript strict mode uyumu
- React/React Native lint kurallari
- Import siralama ve duzenleme
- Erisilebilirlik (a11y) kontrolleri
- Kullanilmayan degisken ve import tespiti

## Kural Degisiklikleri

Kural ekleme veya degistirme islemleri tum workspace'i etkiler. Degisiklik yapmadan once:

1. Degisikligin tum paketler ve uygulamalar uzerindeki etkisini degerlendirin
2. `pnpm lint` komutuyla tum workspace'te test edin
3. Gerekirse paket bazinda override tanimlayin

## Referans Dokumanlar

- Kodlama standartlari: `docs/standards/04-coding-standards.md`
- Exception politikasi (eslint-disable kullanimlari icin): `docs/governance/44-exception-and-exemption-policy.md`
