# tooling/ — Proje Arac ve Sablon Dizini

Bu dizin, boilerplate projesinin gelistirme, CI/CD, turetme ve governance araclarini barindirir. Tum alt dizinler hem boilerplate hem de derived (turetilmis) projelerde kullanilir.

## Dizin Yapisi

```
tooling/
  agents/       Claude Code AGENTS.md dosyalari
  ci/           CI/CD workflow sablonlari (GitHub Actions)
  derive/       Boilerplate'ten yeni proje turetme araci
  governance/   Governance sablonlari (exception kayitlari)
  pnpm/         pnpm guvenlik yapilandirma ornekleri
  sync/         Upstream sync araclari
```

## Alt Dizinler

### agents/

Claude Code ve Codex icin AGENTS.md tanimlama dosyalari. Her dosya belirli bir workspace icin AI code review kurallarini ve talimatlarini icerir.

- `apps-web-AGENTS.md` — Web uygulamasi (apps/web) icin AI review kurallari
- `apps-mobile-AGENTS.md` — Mobil uygulama (apps/mobile) icin AI review kurallari
- `packages-ui-AGENTS.md` — UI paketi (packages/ui) icin AI review kurallari

Bu dosyalar upstream sync sirasinda adaptive modda guncellenir. Proje-spesifik duzenlemeler korunur.

### ci/

GitHub Actions workflow sablonlari. Boilerplate repoda `tooling/ci/` altinda sablon olarak tutulur, `.github/workflows/` altina kopyalanarak aktif hale gelir.

- `ci.yml` — PR ve push tetiklemeli ana CI pipeline
- `scheduled-audit.yml` — Haftalik periyodik kalite denetimi

Detay icin: [tooling/ci/README.md](ci/README.md)

### derive/

Boilerplate'ten yeni proje turetme araci. Tek bir script ile tum yapilandirma dosyalarindaki boilerplate referanslarini proje-ozel degerlerle degistirir.

- `create-project.sh` — Proje turetme script'i

Detay icin: [tooling/derive/README.md](derive/README.md)

### governance/

Governance surecleri icin sablon dosyalari.

- `exception-template.yaml` — Exception/exemption kayit sablonu. Kural ihlali gerektiginde bu sablon kopyalanarak `exceptions/` dizinine yerlestirilir.

Referans: `docs/governance/44-exception-and-exemption-policy.md`

### pnpm/

pnpm guvenlik yapilandirmasi icin ornek dosyalar.

- `pnpm-workspace.security.example.yaml` — `minimumReleaseAge`, `trustPolicy` ve `allowBuilds` ayarlari icin ornek. Derived proje kendi `pnpm-workspace.yaml` dosyasina bu ayarlari uyarlar.

Referans: `docs/governance/37-dependency-policy.md`

### sync/

Upstream sync araclari. Boilerplate guncellemelerini derived projelere tasimak icin kullanilir.

- `upstream-sync.sh` — Ana sync script'i. Belirtilen tag'e kadar olan degisiklikleri manifest'e gore sync eder
- `partial-merge.sh` — Sentinel-based kismi birlestirme araci. CLAUDE.md ve AGENTS.md gibi karisik icerikli dosyalar icin
- `upstream-sync-manifest.yaml` — Sync edilecek dosyalarin canonical tanimlamasi (exact/partial/adaptive modlar)
- `derived-projects.txt` — Boilerplate release'inde bildirim gonderilecek derived proje listesi

Referans: `docs/governance/49-upstream-sync-strategy.md`
