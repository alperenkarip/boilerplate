---
id: A-NEW-API
type: activity
name: Yeni API Endpoint / Entegrasyon
tetiklenen-domain-guardrails: [D-DAT, D-SEC, D-TST]
araç-zorunlulukları:
  spec: ihtiyaca göre
  stitch: —
  codex: zorunlu
son-güncelleme: 2026-06-26
---

# A-NEW-API: Yeni API Entegrasyonu Guardrail

## Canonical: Yeni API = Yeni Cloud Function (ADR-020)

"Yeni API" varsayılan olarak yeni bir Cloud Function (callable `onCall` / HTTPS) anlamına gelir. Client `FunctionsCallPort` ile çağırır; kendi Node backend'i (Hono vb.) açılmaz.

- [ZORUNLU] Yazma/iş mantığı içeren her yeni API bir Cloud Function olarak tanımlanır (`functions/` dizini)
- [ZORUNLU] Sadece okuma gerektiren erişim için ayrı endpoint açma — Firestore client SDK + `DataReadPort` kullan (D-DAT)
- [YASAK] Inngest, BullMQ, custom Node/Express backend — server logic Cloud Functions canonical

## Aktiviteye Özel Kurallar (Cloud Function)

1. Callable input'u Zod ile validate et — geçersizse `HttpsError('invalid-argument', ...)` ile reddet
2. Response type'ı TypeScript/Zod ile tanımla
3. Error mapping: `HttpsError` ile tipli kodlar döndür (unauthenticated, permission-denied, not-found, internal); client tarafında map et (D-ERR)
4. Integration test zorunlu — emülatör (functions + firestore) ile (D-TST)
5. Yetki: auth gerektiren callable'da `context.auth` null kontrolü zorunlu (D-SEC, ADR-021)
6. Rate limiting / abuse koruması düşün (App Check, Cloud Functions concurrency limit)
7. Client'tan `FunctionsCallPort` ile çağır — component'ten doğrudan `httpsCallable` çağırma, custom hook ile sar

## Harici REST İstisnası

8. Üçüncü taraf REST/GraphQL API'ye erişim istisnadır ve aşağıdaki kurala uyar:
   - [ZORUNLU] Gizli anahtar gerektiren veya iş mantığı içeren harici çağrı server-side (Cloud Functions) wrapper üzerinden yapılır — client'tan doğrudan çağrılmaz
   - [YAPILMALI] Yalnızca public/anahtarsız harici servisler client'tan çağrılabilir; bu durumda da `packages/core` adapter üzerinden sarılır
   - [YAPILMALI] Harici çağrı için timeout + retry + circuit breaker uygula (aşağıdaki tablo)

## Timeout ve Retry Default'ları

9. Callable ve harici çağrılar için varsayılan timeout ve retry konfigürasyonu:

| Parametre                       | Varsayılan                               | Override Durumu                                       |
| ------------------------------- | ---------------------------------------- | ----------------------------------------------------- |
| Callable timeout (client)       | 30s                                      | Upload/ağır işlem: 120s                               |
| Cloud Function timeout (server) | 60s                                      | Batch/uzun işlem: 540s (max)                          |
| Retry sayısı                    | 3                                        | Non-idempotent yazma callable: 0                      |
| Retry stratejisi                | Exponential backoff (1s → 2s → 4s)       | —                                                     |
| Retry koşulu                    | Network error + `internal`/`unavailable` | `invalid-argument`/`permission-denied` retry yapılmaz |

10. **Circuit breaker:** Harici REST wrapper'da 5 ardışık hata → 30s bekleme süresi (sonraki istekler anında fail)
11. **Cancellation:** Component unmount'ta bekleyen callable ve `onSnapshot` listener'lar iptal edilmeli — memory leak önlenir

## DoD Ek Maddeleri

- [ ] Yeni API bir Cloud Function (callable) olarak tanımlı (custom backend yok)
- [ ] Callable input Zod ile validate ediliyor
- [ ] Response type tanımlı (Zod/TS)
- [ ] Error mapping `HttpsError` ile yapılıyor
- [ ] Timeout konfigürasyonu tanımlı (client + server)
- [ ] Retry stratejisi uygulanmış (non-idempotent yazma: retry yok)
- [ ] Unmount cleanup (callable cancellation / listener unsubscribe) var
- [ ] Integration test (emülatör) yazılmış
- [ ] `context.auth` ile yetki doğrulanıyor
- [ ] Harici REST varsa server-side wrapper üzerinden
