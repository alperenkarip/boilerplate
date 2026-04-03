# @project/testing

Paylasilan test altyapisi paketi. Tum workspace genelinde kullanilan test yardimcilari, mock nesneleri ve factory fonksiyonlari bu pakette toplanir.

## Amac

Tekrarlayan test kurulumlarini merkezilestirmek ve paketler arasi tutarli test altyapisi saglamak. Web testleri Vitest 4.x, mobile testleri Jest 30.x kullanir; bu paket her iki ortamda da calisan ortak araclari barindirir.

## Dosya Yapisi

```
src/
  index.ts              # Ana barrel export
```

Paket su an minimal yapiyla baslatilmistir. Asagidaki kategorilerde buyumesi beklenmektedir:

- **Test helper'lar** -- render wrapper'lar, provider wrapper'lar, custom matcher'lar
- **Mock nesneleri** -- API mock'lari, navigation mock'lari, storage mock'lari
- **Factory fonksiyonlari** -- Test verisi uretimi icin factory'ler (kullanici, urun, siparis vb.)
- **Fixture'lar** -- Sabit test verileri

## Kullanim

```typescript
import {} from /* test yardimcilari */ '@project/testing';
```

## Yeni Test Yardimcisi Ekleme

1. `src/` altinda ilgili kategori dizinini olusturun (ornegin `src/mocks/`, `src/factories/`)
2. Yardimci fonksiyonu yazin
3. `src/index.ts` dosyasindan export edin

## Referans Dokumanlar

- Test stratejisi: `docs/quality/11-test-strategy.md`
- Performans standardi: `docs/quality/13-performance-standard.md`
