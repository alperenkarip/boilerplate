---
id: A-DEP
type: activity
name: Dependency Ekleme / Kaldırma / Upgrade
tetiklenen-domain-guardrails: [D-3RD, D-SEC]
araç-zorunlulukları:
  spec: —
  stitch: —
  codex: zorunlu
son-güncelleme: 2026-04-02
---

# A-DEP: Dependency Değişikliği Guardrail

## Ön Koşullar
1. docs/governance/37-dependency-policy.md oku
2. docs/governance/38-version-compatibility-matrix.md kontrol et
3. Canonical stack'teki kütüphanelerin alternatiflerini ÖNERİYORSAN DUR — yasak

## Aktif Domain Guardrail'ler
- **D-3RD** → Wrapper pattern, lisans, güvenlik
- **D-SEC** → Güvenlik taraması

## Kaynak Doküman Referansları
- 37-dependency-policy.md — Dependency onay ve yönetim politikası
- 38-version-compatibility-matrix.md — Versiyon uyumluluk matrisi

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

## Bundle Size Impact Raporu
14. Her dependency ekleme/upgrade PR'ında bundle size impact raporu zorunlu:

| Bilgi | Açıklama |
|-------|---------|
| Paket adı | Eklenen/güncellenen paket |
| Gzip boyutu | Paketin sıkıştırılmış boyutu |
| Tree-shaking | Tree-shakeable mi? |
| Bundle farkı | Önceki vs sonraki toplam bundle boyutu |

15. CI action (bundlesize veya size-limit) ile otomatik kontrol
16. **Eşik değerler:**
    - **+100KB:** Uyarı — gerekçe açıklanmalı
    - **+500KB:** PR bloklanır — alternatif araştırılmalı
17. Daha hafif alternatif varsa PR'da önerilmeli

## DoD Ek Maddeleri
- [ ] Dependency policy (37) kontrol edilmiş
- [ ] Compatibility matrix (38) güncel
- [ ] Bundle size etkisi kabul edilebilir
- [ ] Bundle size impact raporu PR'da mevcut
- [ ] Güvenlik taraması geçmiş
- [ ] +500KB eşiği aşılmamış (veya gerekçelenmiş)
- [ ] Testler geçiyor
