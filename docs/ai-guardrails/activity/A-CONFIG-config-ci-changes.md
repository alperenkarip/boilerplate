---
id: A-CONFIG
type: activity
name: Build / Env / CI Config Değişikliği
tetiklenen-domain-guardrails: [D-SEC]
araç-zorunlulukları:
  spec: —
  stitch: —
  codex: zorunlu
son-güncelleme: 2026-04-02
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

## Config Değişiklik Blast Radius Analizi
7. Her config değişikliğinde etki alanı belirlenmelidir:

| Değişen Config | Etki Alanı |
|----------------|-----------|
| `tsconfig.json` | Tüm TypeScript dosyaları |
| ESLint config | Tüm lint kapsamındaki dosyalar |
| `app.json` / `app.config.ts` | Native build (iOS + Android) |
| CI workflow dosyaları | Tüm pipeline |
| `turbo.json` | Cache invalidation, tüm task'lar |

8. PR description'da **"Bu değişiklik şunları etkiler: ..."** ifadesi zorunlu
9. Risk seviyesi belirlenmeli:
   - **Low:** Tek workspace etkisi
   - **Medium:** Monorepo geneli etkisi
   - **High:** CI + native build etkisi

## DoD Ek Maddeleri
- [ ] Pipeline kırılma riski değerlendirilmiş
- [ ] Secret exposure riski yok
- [ ] Build başarılı
- [ ] .env.example güncel
- [ ] Quality gate gevşetilmemiş
- [ ] Blast radius analizi yapılmış
- [ ] PR description'da etki alanı belirtilmiş
- [ ] Risk seviyesi (Low/Medium/High) belirlenmiş
