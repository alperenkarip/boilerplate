# @project/core

Paylasilan is mantigi ve yardimci fonksiyonlar paketi. API istemcisi, ortak hook'lar, dogrulama kurallari ve kimlik dogrulama tip tanimlarini icerir. Hem web hem mobile uygulamalar bu paketi kullanir.

## Kullanim

```typescript
import { createApiClient } from '@project/core';
import { useDebounce, useAsync } from '@project/core';
import { isEmail, isStrongPassword } from '@project/core';
```

## Dosya Yapisi

```
src/
  api/
    client.ts           # createApiClient -- API istemcisi
    types.ts             # API tip tanimlari (istek, yanit, hata)
    index.ts

  auth/
    types.ts             # Kimlik dogrulama tip tanimlari

  hooks/
    useAsync.ts          # Asenkron islem yonetimi
    useDebounce.ts       # Debounce hook'u
    usePrevious.ts       # Onceki deger izleme
    useThrottle.ts       # Throttle hook'u
    index.ts

  validation/
    rules.ts             # Dogrulama fonksiyonlari
    index.ts

  index.ts               # Ana barrel export
```

## API Client

`createApiClient()` fonksiyonu yapilandirilabilir bir API istemcisi olusturur:

- Base URL `.env` dosyasindan alinir
- Otomatik retry mantigi icerir
- AbortController destegi ile iptal edilebilir istekler
- Tip-guvenli istek ve yanit yapisi

```typescript
const api = createApiClient();
```

## Hook'lar

| Hook          | Aciklama                                                       |
| ------------- | -------------------------------------------------------------- |
| `useAsync`    | Asenkron islemlerin yukleme, hata ve sonuc durumlarini yonetir |
| `useDebounce` | Degeri belirtilen sure kadar geciktirerek gunceller            |
| `usePrevious` | Bir degerin bir onceki render'daki halini dondurur             |
| `useThrottle` | Degeri belirtilen sure araliginda en fazla bir kez gunceller   |

## Dogrulama Kurallari

`validation/rules.ts` dosyasinda tanimli fonksiyonlar:

| Fonksiyon          | Aciklama                     |
| ------------------ | ---------------------------- |
| `isEmail`          | E-posta format dogrulamasi   |
| `isPhoneNumber`    | Telefon numarasi dogrulamasi |
| `isStrongPassword` | Guclu sifre kontrolu         |
| `isURL`            | URL format dogrulamasi       |
| `isEmpty`          | Bos deger kontrolu           |
| `minLength`        | Minimum uzunluk kontrolu     |
| `maxLength`        | Maksimum uzunluk kontrolu    |

Bu fonksiyonlar Zod schema ile birlikte veya bagimsiz olarak kullanilabilir.

## Test Durumu

6 dosyada `@MX:TODO` etiketi bulunmaktadir -- test dosyalari henuz yazilmamistir. Yeni katki yapanlar bu dosyalari oncelikli olarak ele alabilir.

## Referans Dokumanlar

- Guvenlik: `docs/quality/27-security-and-secrets-baseline.md`
- Performans: `docs/quality/13-performance-standard.md`
