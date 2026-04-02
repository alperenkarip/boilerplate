# PDR-001 — TanStack Query: Adopt Karari

**Tarih:** 2026-04-02
**Durum:** Kabul edildi
**Referans:** ADR-005 (fetch-first + TanStack Query conditional track)

## Karar

TanStack Query **adopt** edildi. Faz E'de install edilecek, Faz J'de provider zinciri baglancak.

## Gerekce

- SPEC-IMP-001 Faz Q- (System & Auth Screens) query lifecycle, mutation ve error handling gerektiriyor
- Fetch-first defer yolu Q- oncesinde yeterli olmayacak
- ADR-005 conditional karar mekanizmasi bu secenegi acikca taniyor
- Early adopt, tum ekranlarda tutarli data fetching pattern saglar

## Etki

- Faz J: QueryClientProvider app shell provider zincirine eklenir
- Faz M: Query key policy, mutation + invalidation, error handling zinciri kurulur
- Faz Q-: System/Auth ekranlarinda query hook'lari kullanilir

## React Compiler Karari

Default-off watch policy. Adopt edilmedi, watchlist'te.

## Biome 2.x Karari

Pilot/watchlist. ESLint + Prettier mevcut stack olarak devam ediyor. Biome 2.x stabil oldugunda pilot degerlendirme yapilacak.

## NativeWind 5.x Karari

Candidate track olarak kabul edildi. Release status Faz J oncesinde tekrar dogrulanacak.
Pre-release ise written fallback karari acilacak.
