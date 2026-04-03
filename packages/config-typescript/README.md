# @project/config-typescript

Monorepo genelinde paylasilan TypeScript konfigurasyonu. Farkli ortamlar icin ozellestirilmis 4 tsconfig dosyasi icerir.

## Dosya Yapisi

```
tsconfig.base.json      # Tum paketler icin temel konfigurasyion
tsconfig.web.json       # Web uygulamasi icin (DOM, JSX)
tsconfig.mobile.json    # Mobile uygulama icin (React Native)
tsconfig.library.json   # Paylasilan paketler icin
package.json
```

## Konfigurasyonlar

### tsconfig.base.json

Tum diger konfigurasyonlarin miras aldigi temel ayarlar. Strict mode zorunludur. Ortak compiler seceneklerini icerir:

- `strict: true`
- `noUncheckedIndexedAccess: true`
- Module resolution, target ve diger paylasilabilir ayarlar

### tsconfig.web.json

Web uygulamasi (`apps/web`) icin. `tsconfig.base.json` uzerine:

- DOM ve DOM.Iterable lib tanimlari
- JSX transform ayarlari (react-jsx)
- Vite ortamina uygun module resolution

### tsconfig.mobile.json

Mobile uygulama (`apps/mobile`) icin. `tsconfig.base.json` uzerine:

- React Native JSX ayarlari
- Metro bundler uyumlu module resolution
- Expo SDK tip tanimlari

### tsconfig.library.json

Paylasilan paketler (`packages/*`) icin. `tsconfig.base.json` uzerine:

- Declaration dosyasi uretimi
- Composite project referanslari
- Paketler arasi bagimliliklara uygun ayarlar

## Kullanim

Paketinizin veya uygulamanizin `tsconfig.json` dosyasinda:

```json
{
  "extends": "@project/config-typescript/tsconfig.library.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src"]
}
```

Web uygulamasi icin `tsconfig.web.json`, mobile icin `tsconfig.mobile.json`, shared paketler icin `tsconfig.library.json` kullanin.

## Strict Mode

TypeScript strict mode tum konfigurasyonlarda zorunludur. `any` tipi kullanimi yasaktir. Bu kural proje genelinde gecerlidir ve override edilemez.

## Referans Dokumanlar

- Kodlama standartlari: `docs/standards/04-coding-standards.md`
- Versiyon uyumlulugu: `docs/governance/38-version-compatibility-matrix.md`
