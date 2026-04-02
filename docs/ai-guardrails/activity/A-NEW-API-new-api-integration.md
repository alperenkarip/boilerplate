---
id: A-NEW-API
type: activity
name: Yeni API Endpoint / Entegrasyon
tetiklenen-domain-guardrails: [D-DAT, D-SEC, D-TST]
araç-zorunlulukları:
  spec: ihtiyaca göre
  stitch: —
  codex: zorunlu
son-güncelleme: 2026-04-02
---

# A-NEW-API: Yeni API Entegrasyonu Guardrail

## Aktiviteye Özel Kurallar
1. ADR-005 uyarınca veri erişim modeline entegre et; complexity threshold aşıldıysa TanStack Query kullan
2. Response type'ı TypeScript/Zod ile tanımla
3. Error handling: network, server, timeout ayrı handle et (D-ERR)
4. Integration test zorunlu (D-TST)
5. Auth gerektiriyorsa token management doğru mu kontrol et (D-SEC)
6. Rate limiting düşün
7. Custom hook ile sarma — component'ten doğrudan çağırma

## API Timeout ve Retry Default'ları
8. Tüm API çağrıları için varsayılan timeout ve retry konfigürasyonu:

| Parametre | Varsayılan | Override Durumu |
|-----------|-----------|----------------|
| Timeout | 30s | Upload: 120s, Health check: 5s |
| Retry sayısı | 3 | Non-idempotent POST: 0 |
| Retry stratejisi | Exponential backoff (1s → 2s → 4s) | — |
| Retry koşulu | Network error + 5xx | 4xx retry yapılmaz |

9. **Circuit breaker:** 5 ardışık hata → 30s bekleme süresi (sonraki istekler anında fail)
10. **AbortController:** Component unmount'ta bekleyen istekler iptal edilmeli — memory leak önlenir

## DoD Ek Maddeleri
- [ ] ADR-005 kararı görünür (fetch-first veya TanStack Query)
- [ ] Response type tanımlı (Zod/TS)
- [ ] Error handling (network/server/timeout)
- [ ] Timeout konfigürasyonu tanımlı
- [ ] Retry stratejisi uygulanmış (non-idempotent POST: retry yok)
- [ ] AbortController ile unmount cleanup var
- [ ] Integration test yazılmış
- [ ] Auth token yönetimi doğru
