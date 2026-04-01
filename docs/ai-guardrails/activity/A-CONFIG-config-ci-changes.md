---
id: A-CONFIG
type: activity
name: Build / Env / CI Config Değişikliği
tetiklenen-domain-guardrails: [D-SEC]
araç-zorunlulukları:
  spec: —
  stitch: —
  codex: zorunlu
son-güncelleme: 2026-04-01
---

# A-CONFIG: Config/CI Değişikliği Guardrail

## Ön Koşullar
1. Değişikliğin pipeline kırma riskini değerlendir
2. Secret/credential exposure riski var mı kontrol et

## Aktif Domain Guardrail'ler
- **D-SEC** → Secret yönetimi, environment güvenliği

## Aktiviteye Özel Kurallar
1. CI pipeline değişikliği → tüm job'lar çalıştığını doğrula
2. Environment variable ekleme → .env.example güncelle, .gitignore kontrol et
3. Build config değişikliği → build başarılı mı doğrula
4. Quality gate (15) gevşetme → YASAK (yapısal miras)
5. Repo yapısı değişikliği → 21-repo-structure-spec.md ile uyumlu mu?
6. Secret'ı CI log'a yazdırma — maskeleme kontrol et

## DoD Ek Maddeleri
- [ ] Pipeline kırılma riski değerlendirilmiş
- [ ] Secret exposure riski yok
- [ ] Build başarılı
- [ ] .env.example güncel
- [ ] Quality gate gevşetilmemiş
