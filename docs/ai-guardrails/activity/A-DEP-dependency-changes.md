---
id: A-DEP
type: activity
name: Dependency Ekleme / Kaldırma / Upgrade
tetiklenen-domain-guardrails: [D-3RD, D-SEC]
araç-zorunlulukları:
  spec: —
  stitch: —
  codex: zorunlu
son-güncelleme: 2026-04-01
---

# A-DEP: Dependency Değişikliği Guardrail

## Ön Koşullar
1. docs/governance/37-dependency-policy.md oku
2. docs/governance/38-version-compatibility-matrix.md kontrol et
3. Canonical stack'teki kütüphanelerin alternatiflerini ÖNERİYORSAN DUR — yasak

## Aktif Domain Guardrail'ler
- **D-3RD** → Wrapper pattern, lisans, güvenlik
- **D-SEC** → Güvenlik taraması

## Aktiviteye Özel Kurallar

### Ekleme
1. Dependency policy onayı al (37)
2. Bundle size etkisini ölç
3. Lisans uyumluluğunu kontrol et
4. `pnpm audit` ile güvenlik taraması
5. Wrapper/abstraction katmanı oluştur
6. Compatibility matrix'e ekle (38)

### Upgrade
7. Breaking change listesini oku
8. Compatibility matrix ile doğrula
9. Mevcut testleri çalıştır
10. Migration gerekiyorsa migration planı yaz

### Kaldırma
11. Kullanım taraması yap — gerçekten kullanılmıyor mu?
12. Import'ları temizle
13. Wrapper/abstraction'ı da kaldır

## DoD Ek Maddeleri
- [ ] Dependency policy (37) kontrol edilmiş
- [ ] Compatibility matrix (38) güncel
- [ ] Bundle size etkisi kabul edilebilir
- [ ] Güvenlik taraması geçmiş
- [ ] Testler geçiyor
