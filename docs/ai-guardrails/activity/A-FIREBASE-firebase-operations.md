---
id: A-FIREBASE
type: activity
name: Firebase / Firestore İşlemi
tetiklenen-domain-guardrails: [D-FIR, D-SEC, D-DAT]
araç-zorunlulukları:
  spec: ihtiyaca göre
  stitch: —
  codex: zorunlu
son-güncelleme: 2026-04-02
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

## Firestore Index Yönetimi
7. Tüm composite index'ler `firestore.indexes.json` dosyasında tanımlı olmalı — manuel console üzerinden oluşturma yasak
8. CI'da `firebase deploy --only firestore:indexes` ile index deployment doğrulanmalı
9. Yeni sorgu eklenmesi → gerekli index tanımı aynı PR'a eklenir
10. Index eksikliği: Emülatör loglarında uyarı olarak görünür — build öncesi kontrol edilmeli
11. **Quarterly bakım:** Kullanılmayan index'ler temizlenmeli — gereksiz index performans ve maliyet etkisi yaratır

## DoD Ek Maddeleri
- [ ] Security rules yazılmış (default deny)
- [ ] Doküman yapısı Zod/TypeScript ile tanımlı
- [ ] Query'lerde limit var
- [ ] Listener cleanup yapılıyor
- [ ] PII koruması sağlanmış
- [ ] Yeni sorgu için gerekli index `firestore.indexes.json`'a eklenmiş
- [ ] Index deployment CI'da doğrulanmış
