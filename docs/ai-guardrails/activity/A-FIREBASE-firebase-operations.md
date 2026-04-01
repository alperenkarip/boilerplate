---
id: A-FIREBASE
type: activity
name: Firebase / Firestore İşlemi
tetiklenen-domain-guardrails: [D-FIR, D-SEC, D-DAT]
araç-zorunlulukları:
  spec: ihtiyaca göre
  stitch: —
  codex: zorunlu
son-güncelleme: 2026-04-01
---

# A-FIREBASE: Firebase İşlemi Guardrail

## Ön Koşullar
1. D-FIR guardrail'ini oku — Firebase/Firestore kuralları
2. Koleksiyon yapısını ve güvenlik kurallarını planla

## Aktif Domain Guardrail'ler
- **D-FIR** → Veri modelleme, güvenlik kuralları, query, batch, offline
- **D-SEC** → Secret yönetimi, auth, PII koruması
- **D-DAT** → ADR-005 veri erişim modeli, cache stratejisi

## Aktiviteye Özel Kurallar
1. Koleksiyon adı: kebab-case, çoğul
2. Doküman yapısı TypeScript/Zod ile tanımla
3. Security rules: default deny, owner-based access
4. Query'lerde limit + pagination
5. Snapshot listener cleanup (component unmount)
6. Chosen query/cache modeli ile cache koordinasyonu

## DoD Ek Maddeleri
- [ ] Security rules yazılmış (default deny)
- [ ] Doküman yapısı Zod/TypeScript ile tanımlı
- [ ] Query'lerde limit var
- [ ] Listener cleanup yapılıyor
- [ ] PII koruması sağlanmış
