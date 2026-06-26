---
id: A-FIREBASE
type: activity
name: Firebase / Firestore İşlemi
tetiklenen-domain-guardrails: [D-FIR, D-SEC, D-DAT]
araç-zorunlulukları:
  spec: ihtiyaca göre
  stitch: —
  codex: zorunlu
son-güncelleme: 2026-06-26
---

# A-FIREBASE: Firebase İşlemi Guardrail

## Ön Koşullar

1. ADR-020 (Backend & Data Platform = Firebase) ve ADR-021 (Firebase Auth) kararlarını oku — Firebase zorunlu canonical
2. D-FIR guardrail'ini oku — Firebase/Firestore kuralları
3. Koleksiyon yapısını, Security Rules'u ve Cloud Functions sınırlarını planla

## Aktif Domain Guardrail'ler

- **D-FIR** → Veri modelleme, güvenlik kuralları, query, batch, offline
- **D-SEC** → Secret yönetimi, auth, PII koruması
- **D-DAT** → Firebase port modeli (okuma DataReadPort / yazma FunctionsCallPort), cache stratejisi

## Canonical Read/Write Contract (ADR-020)

Bu kontrat tüm Firestore işlemlerinin en kritik kuralıdır:

- **Okuma (read):** Client SDK doğrudan Firestore'dan okur (Security Rules korumalı) + realtime için `onSnapshot`. Okuma `DataReadPort` üzerinden tüketilir.
- **Yazma (write) + iş mantığı:** create/update/delete ve tüm iş mantığı yalnızca Cloud Functions (callable `onCall` / HTTPS) üzerinden yapılır. Client `FunctionsCallPort` ile çağırır.
- [ZORUNLU] Client doğrudan Firestore'a YAZMAZ — Security Rules'ta write varsayılan-reddet (`allow write: if false`), yazma yetkisi yalnızca Cloud Functions service account'ındadır.
- [YASAK] Client-direct-write, custom Node backend (Hono vb.), Inngest, BullMQ — server logic Cloud Functions canonical'dır.

## Aktiviteye Özel Kurallar

1. Koleksiyon adı: kebab-case, çoğul
2. Doküman yapısı TypeScript/Zod ile tanımla — callable input'ları da Zod ile validate edilir
3. Security rules: write default-deny (yalnızca Cloud Functions yazar), read owner-based access (`request.auth`)
4. Query'lerde limit + pagination
5. Snapshot listener (`onSnapshot`) cleanup (component unmount)
6. Cron işleri = Cloud Scheduler + scheduled Functions; async/background = Cloud Tasks (Inngest/BullMQ YASAK)
7. Okuma `DataReadPort`, yazma `FunctionsCallPort` üzerinden — UI/feature kodu SDK'yı doğrudan import etmez

## Firestore Rules ve Index Yönetimi

8. Tüm composite index'ler `firestore.indexes.json` dosyasında tanımlı olmalı — manuel console üzerinden oluşturma yasak
9. CI'da `firebase deploy --only firestore:indexes` ile index deployment doğrulanmalı
10. Yeni sorgu eklenmesi → gerekli index tanımı aynı PR'a eklenir
11. Index eksikliği: Emülatör loglarında uyarı olarak görünür — build öncesi kontrol edilmeli
12. `firestore.rules` her PR'da CI'da `firebase deploy --only firestore:rules` ile doğrulanmalı; Rules unit test'leri (`@firebase/rules-unit-testing`) write default-deny davranışını kanıtlamalı
13. **Quarterly bakım:** Kullanılmayan index'ler temizlenmeli — gereksiz index performans ve maliyet etkisi yaratır

## Cloud Functions Deploy Doğrulaması

14. Tüm yazma/iş mantığı Cloud Functions'ta — callable fonksiyonlar `functions/` dizininde tanımlı olmalı
15. CI'da `firebase deploy --only functions` (veya emülatör dry-run/lint) ile fonksiyon deploy doğrulanmalı
16. Cloud Functions secret/config: `defineSecret` / functions env üzerinden — `.env` değeri koda veya repoya gömülmez (D-SEC)
17. Callable error mapping: `HttpsError` ile tipli hata kodları döndürülmeli (client tarafında map edilebilir)

## DoD Ek Maddeleri

- [ ] Security rules yazılmış (write default-deny, read owner-based)
- [ ] Yazma yalnızca Cloud Functions callable üzerinden (client-direct-write yok)
- [ ] Okuma DataReadPort, yazma FunctionsCallPort üzerinden
- [ ] Doküman + callable input yapısı Zod/TypeScript ile tanımlı
- [ ] Query'lerde limit var
- [ ] Listener (`onSnapshot`) cleanup yapılıyor
- [ ] PII koruması sağlanmış
- [ ] Yeni sorgu için gerekli index `firestore.indexes.json`'a eklenmiş
- [ ] Index + rules + functions deployment CI'da doğrulanmış
