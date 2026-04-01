---
name: dep-check
description: >
  TRIGGER: pnpm add, pnpm install (yeni paket), dependency ekleme/upgrade 
  veya package.json düzenleme işlemi yapılmadan ÖNCE otomatik tetiklenir.
  Kullanıcı "paket ekle", "install", "dependency", "kütüphane" dediğinde 
  veya package.json değişikliği istendiğinde çalışmalıdır.
  37-dependency-policy.md ve 38-version-compatibility-matrix.md kurallarına 
  uyumu kontrol eder.
allowed-tools:
  - Read
  - Bash
  - Grep
---

# Dependency Policy Kontrolü — Otomatik Tetikleme

Bu skill dependency değişikliği yapılmadan ÖNCE OTOMATİK çalışır.
Kullanıcının `/dep-check` yazmasını BEKLEME — dependency işi geldiğinde hemen tetikle.

## Ne Zaman Tetiklenir?

- `pnpm add`, `pnpm install <paket>` çalıştırılmadan önce
- package.json'a yeni dependency eklenirken
- Dependency upgrade yapılırken
- Kullanıcı "şu paketi ekle", "şu kütüphaneyi kur" dediğinde

## Adımlar

1. **Paket bilgisini al:** Kullanıcının eklenmesini istediği paket adını belirle.

2. **Canonical stack kontrolü — EN KRİTİK ADIM:**
   Eklenmek istenen paket canonical stack'teki bir kararın alternatifi mi?
   
   Hızlı kontrol listesi:
   - State management → Zustand 5.x (ADR-004). Redux, MobX, Jotai vb. → **REDDET**
   - Data fetching → TanStack Query 5.x (ADR-005). SWR, Apollo vb. → **REDDET**
   - Forms → React Hook Form 7.x + Zod 4.x (ADR-006). Formik, Yup vb. → **REDDET**
   - Styling → Tailwind CSS 4.x + NativeWind 5.x (ADR-007). Styled-components, Emotion vb. → **REDDET**
   - Testing → Vitest 4.x + Jest 30.x (ADR-008). Mocha, Jasmine vb. → **REDDET**
   - i18n → i18next 26.x (ADR-011). react-intl, formatjs vb. → **REDDET**
   - Navigation → React Router 7.x / React Navigation 7.x (ADR-012). Alternatif → **REDDET**
   
   Canonical alternatif ise → kullanıcıya açıkla ve **REDDET**.

3. **Dependency policy:** `docs/governance/37-dependency-policy.md` oku. Kategoriye göre kuralları kontrol et.

4. **Compatibility:** `docs/governance/38-version-compatibility-matrix.md` kontrol et.

5. **Güvenlik:** `pnpm audit` bilinen açık var mı?

6. **Rapor üret ve sonuç bildir:**

```
## Dependency Kontrol: [paket-adı]

- Canonical Stack Çakışması: VAR/YOK
- Policy Uyumu: UYGUN / UYGUN DEĞİL
- Güvenlik: TEMİZ / RİSK
- Sonuç: ONAYLA / REDDET
- Gerekçe: ...
```
