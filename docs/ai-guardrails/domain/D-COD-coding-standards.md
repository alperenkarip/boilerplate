---
id: D-COD
type: domain
name: Kodlama Standartlari & Dosya Konvansiyonlari
kaynak-dokümanlar: 50, 51, 52, 07, ADR-020
miras-tipi: zorunlu
son-güncelleme: 2026-06-26
---

# D-COD: Kodlama Standartlari Guardrail

## Bu Guardrail Ne Zaman Aktif?

- Her turlu kod uretimi veya duzenleme
- Yeni dosya olusturma
- Yeni component, hook, service, utility yazimi
- Refactoring (A-REFACTOR)
- Feature gelistirme (A-NEW-FEAT, A-NEW-COMP, A-NEW-SCRN, A-NEW-HOOK, A-NEW-API)

## Zorunlu Kurallar

### Dosya Boyut Limitleri

1. [ZORUNLU] Dosya satir sayisi hedefi: ≤300 satir
2. [ZORUNLU] Dosya satir sayisi uyari esigi: >500 satir — bolme GEREKLI
3. [ZORUNLU] Dosya satir sayisi hard limit: >800 satir — KABUL EDILMEZ
4. [ZORUNLU] Fonksiyon satir sayisi hedefi: ≤50 satir
5. [ZORUNLU] Fonksiyon parametre sayisi: ≤3 hedef, >6 YASAK
6. [ZORUNLU] Bos satirlar ve yorumlar sayima DAHIL EDILMEZ
7. [ISTISNA] Test dosyalari: max-lines kural kapali
8. [ISTISNA] Theme/token tanimlari: max-lines ve token kurallari kapali

### Naming Conventions

9. [ZORUNLU] Component dosyalari: PascalCase (`UserProfile.tsx`)
10. [ZORUNLU] Hook dosyalari: camelCase, use prefix (`useUserProfile.ts`)
11. [ZORUNLU] Service/utility dosyalari: camelCase, verbNoun (`fetchUsers.ts`)
12. [ZORUNLU] Klasor isimleri: kebab-case
13. [ZORUNLU] Boolean degiskenler: is/has/should/can prefix
14. [ZORUNLU] Constant: SCREAMING_SNAKE_CASE
15. [ZORUNLU] Type/Interface: PascalCase, `I` prefix YASAK
16. [ZORUNLU] Event handler: handle/on prefix

### Import Kurallari

17. [ZORUNLU] Barrel import YASAK: `*/index` pattern engellenmeli
18. [ZORUNLU] Cross-feature import YASAK: feature → feature erisilmemeli
19. [ZORUNLU] Import siralamasi: React → 3rd party → @project/\* → @/ → type
20. [ZORUNLU] Import gruplari arasinda bos satir
21. [ZORUNLU] Circular import YASAK
22. [ZORUNLU] Deep import YASAK: Feature internal'ina erisim yok

### Mimari Katman Kurallari

23. [ZORUNLU] UI/component katmanindan dogrudan repository/data access veya Firebase SDK (firebase / @react-native-firebase) cagrisi YASAK — okuma DataReadPort, yazma FunctionsCallPort uzerinden (ADR-020)
24. [ZORUNLU] Akis: UI → Hook → UseCase → Repository → Port (DataReadPort/FunctionsCallPort) → Firebase SDK adapter
25. [ZORUNLU] Repository'de business logic YASAK (saf veri operasyonu)
26. [ZORUNLU] UseCase'de UI bagimliligi YASAK (toast, navigation, React hook yok)
27. [ZORUNLU] Her UseCase tek sorumluluk (Single Responsibility)

### TypeScript Kurallari

28. [ZORUNLU] `any` tipi YASAK — `unknown` + type guard kullan
29. [ZORUNLU] Gizli any tipleri YASAK: `Record<string, any>`, `object`, `{}`, `Function`
30. [ZORUNLU] `// @ts-ignore` YASAK — exception policy gerektirir (44)
31. [ZORUNLU] TypeScript strict mode aktif olmali

### Design Token Kurallari

32. [ZORUNLU] Hardcoded renk YASAK: `#FF0000`, `rgb()` → semantic token kullan
33. [ZORUNLU] Hardcoded spacing YASAK: `padding: 16` → token kullan
34. [ZORUNLU] Hardcoded font-size YASAK: `fontSize: 14` → token kullan
35. [ZORUNLU] Hardcoded font-weight YASAK: `fontWeight: 700` → token kullan
36. [ZORUNLU] Tailwind default renk class'lari YASAK → `bp-` prefix token kullan
37. [ZORUNLU] Token kategorisi uyumu: text-only, bg-only, border-only dogru eşlesmeli

### Component Kurallari

38. [ZORUNLU] Raw platform primitive YASAK (Pressable, TouchableOpacity, RN Text)
39. [ZORUNLU] Component facade pattern kullan (Button, Text, Modal wrapper)
40. [ZORUNLU] JSX derinligi: ≤4 katman hedef
41. [ZORUNLU] Component props: ≤7 hedef, >10 refactor sinyali

### Form Kurallari

42. [ZORUNLU] 2+ input iceren formlarda react-hook-form + Zod ZORUNLU
43. [ZORUNLU] useState ile form state yonetimi YASAK (2+ input icin)
44. [ZORUNLU] Manuel validasyon (if/else) YASAK

### Error Handling

45. [ZORUNLU] Async fonksiyonlarda try/catch ZORUNLU
46. [ZORUNLU] Promise chain (.then) YASAK → async/await kullan
47. [ZORUNLU] Listener/subscription cleanup ZORUNLU
48. [ZORUNLU] DomainError hierarchy kullan (typed error)

### Guvenlik

49. [ZORUNLU] `eval()` YASAK
50. [ZORUNLU] `dangerouslySetInnerHTML` YASAK (exception policy gerektirir)
51. [ZORUNLU] `eslint-disable` YASAK (exception policy gerektirir — 44)
52. [ZORUNLU] Secret/credential commit YASAK
53. [ZORUNLU] localStorage'da token YASAK

### Console ve Logging

54. [ZORUNLU] `console.log` production'da YASAK — yapisal logger kullan
55. [ZORUNLU] Debug ifadeleri commit'lenmemeli

### i18n

56. [ZORUNLU] Inline user-facing string YASAK — i18n key kullan
57. [ZORUNLU] Accessibility label/hint i18n key ile

### Klasor Yapisi

58. [ZORUNLU] Klasor acma kriteri: 3+ iliskili dosya
59. [ZORUNLU] Tek dosya icin klasor YASAK
60. [ZORUNLU] Max nested seviye: 4
61. [ZORUNLU] Bos klasor YASAK

## Kalite Esikleri

| Metrik                 | Minimum     | Onerilen |
| ---------------------- | ----------- | -------- |
| Dosya satir sayisi     | ≤800 (hard) | ≤300     |
| Fonksiyon satir sayisi | ≤150 (hard) | ≤50      |
| Fonksiyon parametre    | ≤6 (hard)   | ≤3       |
| JSX derinlik           | ≤7 (hard)   | ≤4       |
| Import sayisi          | ≤30 (hard)  | ≤15      |
| Cyclomatic complexity  | ≤25 (hard)  | ≤10      |
| Component props        | ≤15 (hard)  | ≤7       |

## Anti-Pattern'ler

- [ZAYIF] 1000+ satir "god file" — bolunmeli
- [ZAYIF] `data`, `temp`, `stuff`, `misc` gibi anlamsiz isimler
- [ZAYIF] Screen component'ten dogrudan Firebase SDK (Firestore/Functions) cagrisi — DataReadPort/FunctionsCallPort kullan
- [ZAYIF] Repository'de business validation
- [ZAYIF] UseCase'de toast/navigation cagrisi
- [ZAYIF] 500+ satir mega-component
- [ZAYIF] 15+ prop interface
- [ZAYIF] useState ile form state (2+ input)
- [ZAYIF] useEffect icerisinde state set loop
- [ZAYIF] Hardcoded hex renk veya magic number
- [ZAYIF] Barrel import ile lazy coupling

## Kontrol Listesi

- [ ] Dosya ≤500 satir mi? (hedef ≤300)
- [ ] Naming convention'lara uygun mu?
- [ ] Import siralamasi ve yonu dogru mu?
- [ ] Barrel import yok mu?
- [ ] Cross-feature import yok mu?
- [ ] any tipi yok mu?
- [ ] Hardcoded renk/spacing/font yok mu?
- [ ] bp- prefix token kullanilmis mi?
- [ ] Raw platform primitive kullanilmamis mi?
- [ ] Component'ten dogrudan Firebase SDK cagrisi yok mu (DataReadPort/FunctionsCallPort kullanildi mi)?
- [ ] Form: react-hook-form + Zod kullanilmis mi?
- [ ] Async: try/catch var mi?
- [ ] Listener/subscription cleanup var mi?
- [ ] console.log yok mu?
- [ ] i18n key kullanilmis mi?
- [ ] eslint-disable yok mu?

## Ihlal Durumunda

- P0 (hard limit asildi): Dosya >800 satir, any tipi, eval(), eslint-disable → HEMEN duzelt
- P1 (zorunlu kural ihlali): Naming, import yonu, barrel import, raw primitive → Ayni PR icerisinde duzelt
- P2 (kalite esigi asildi): 500+ satir dosya, 80+ satir fonksiyon → Sonraki iterasyonda bolme plani olustur

## Kaynak

- [50-coding-standards-and-file-conventions.md](../../architecture/50-coding-standards-and-file-conventions.md) — Ana kodlama standartlari
- [51-service-layer-patterns.md](../../architecture/51-service-layer-patterns.md) — Servis katmani pattern'leri
- [52-ai-development-standards.md](../../governance/52-ai-development-standards.md) — AI gelistirme standartlari
- [07-module-boundaries-and-code-organization.md](../../architecture/07-module-boundaries-and-code-organization.md) — Modul sinirlari
- [ESLint Plugin BP](../../../packages/eslint-plugin-bp/) — Custom ESLint kurallari
