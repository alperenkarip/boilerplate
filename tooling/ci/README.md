# CI/CD Pipeline Dokumantasyonu

Bu dizin, GitHub Actions workflow sablonlarini icerir. Sablonlar `tooling/ci/` altinda tutulur ve `.github/workflows/` altina kopyalanarak aktif hale gelir.

Referans: `docs/governance/15-quality-gates-and-ci-rules.md`

## Workflow Dosyalari

### ci.yml — Ana CI Pipeline

**Tetikleme:** PR acildiginda ve `main` branch'e push yapildiginda otomatik calisir.

**Concurrency:** Ayni branch icin esanli calisma engellenir (`cancel-in-progress: true`).

**Job'lar:**

| Job           | Aciklama                                                                                                                                          | Bagimlilik                  |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------- |
| `repo-mode`   | Repo modunu tespit eder (docs-only veya bootstrap-ready). `package.json`, `pnpm-lock.yaml` ve `pnpm-workspace.yaml` varsa bootstrap-ready sayilir | -                           |
| `docs-sanity` | Markdown dosyalarindaki kirik linkleri ve bulunamayan dosya tokenlerini kontrol eder                                                              | `repo-mode`                 |
| `setup`       | pnpm install ve node_modules cache. Sadece bootstrap-ready repoda calisir                                                                         | `repo-mode`                 |
| `typecheck`   | TypeScript tip kontrolu (`pnpm typecheck`)                                                                                                        | `setup`                     |
| `lint`        | ESLint kontrolu (`pnpm lint`)                                                                                                                     | `setup`                     |
| `test`        | Testleri calistirir (`pnpm test`)                                                                                                                 | `setup`                     |
| `build`       | Tum workspace'i derler (`pnpm build`)                                                                                                             | `typecheck`, `lint`, `test` |
| `boundary`    | Import yon dogrulamasi: `packages/` dizininden `apps/` dizinine import olmamali                                                                   | `setup`                     |
| `security`    | Dependency guvenlik taramasi (`pnpm audit`) ve kaynak kodda secret leak tespiti                                                                   | `setup`                     |

**Akis sirasi:**

```
repo-mode
  |
  +-- docs-sanity
  |
  +-- [bootstrap-ready degilse] → repo-not-bootstrapped (bilgi mesaji)
  |
  +-- [bootstrap-ready ise]
       |
       setup
         |
         +-- typecheck --|
         +-- lint -------|-- build
         +-- test -------|
         +-- boundary
         +-- security
```

### scheduled-audit.yml — Periyodik Kalite Denetimi

**Tetikleme:** Haftalik, her Pazartesi 09:00 UTC. Manuel tetikleme de desteklenir (`workflow_dispatch`).

**Job'lar:**

| Job                    | Aciklama                                                                                                                                                                | Kosul           |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------- |
| `repo-mode`            | Repo modunu tespit eder                                                                                                                                                 | -               |
| `dependency-audit`     | Guvenlik acigi taramasi, kullanilmayan dependency kontrolu, lisans uyumluluk kontrolu                                                                                   | Bootstrap-ready |
| `compatibility-check`  | Node versiyon kontrolu ve canonical stack versiyon baseline kontrolu                                                                                                    | Bootstrap-ready |
| `doc-freshness`        | 6 aydan eski belgeleri tespit eder ve recursive referans butunlugunu kontrol eder                                                                                       | Her zaman       |
| `upstream-drift-check` | Derived projede upstream boilerplate ile fark tespiti. BOUNDARY.md ve .sync-config.yaml uzerinden calisir. Zorunlu miras drift'i P0, yapisal drift P1 olarak raporlanir | Her zaman       |
| `exception-audit`      | Suresi dolmus exception kayitlarini tespit eder (`exceptions/` dizini)                                                                                                  | Her zaman       |

### deploy.yml — Deploy Pipeline (`.github/workflows/` altinda)

**Tetikleme:** Manuel (`workflow_dispatch`). Deploy hedefi secilerek baslatilir.

**Hedef secenekleri:** `web-preview`, `web-production`, `mobile-preview`, `mobile-production`

**Job'lar:**

| Job             | Aciklama                                    | Kosul                           |
| --------------- | ------------------------------------------- | ------------------------------- |
| `web-deploy`    | Vite build ve hosting deploy                | Hedef `web-*` ile basliyorsa    |
| `mobile-deploy` | EAS Build ile App Store / Play Store deploy | Hedef `mobile-*` ile basliyorsa |

Web deploy icin hosting entegrasyonu (Vercel/Netlify/custom) proje tarafindan yapilandirilmalidir. Mobile deploy icin `EXPO_TOKEN` secret'i gereklidir.

### notify-derived-projects.yml — Derived Proje Bildirimi (`.github/workflows/` altinda)

**Tetikleme:** Boilerplate repoda `bp-v*` formatinda tag push'landiginda otomatik calisir.

**Isleyis:**

1. Release tag bilgilerini cikarir (tag adi, mesaj, severity)
2. Severity belirleme: MAJOR degisiklik = P0 (2 sprint), MINOR = P1 (4 sprint), PATCH = INFO
3. `tooling/sync/derived-projects.txt` dosyasindaki her repo icin GitHub issue acar
4. Issue icerigi: Tag, severity, deadline, aksiyon checklist'i ve referans linkler

**Gereksinimler:** `CROSS_REPO_TOKEN` secret'i (derived repo'larda issue acabilmek icin).

## Ortam Degiskenleri

Tum workflow'larda kullanilan ortak degiskenler:

| Degisken       | Deger | Aciklama          |
| -------------- | ----- | ----------------- |
| `NODE_VERSION` | `20`  | Node.js versiyonu |
| `PNPM_VERSION` | `10`  | pnpm versiyonu    |

## Docs-Only / Pre-Bootstrap Mod

Repo henuz bootstrap edilmemisse (package.json, pnpm-lock.yaml veya pnpm-workspace.yaml yoksa), kod kalitesi job'lari atlanir ve sadece dokumantasyon kontrolleri calisir. Bu sayede boilerplate repo docs-only asamada da CI kullanilabilir.

## Derived Projede Kullanim

Derived proje olusturulurken `tooling/ci/` altindaki sablonlar `.github/workflows/` altina kopyalanir. `create-project.sh` script'i scope ve proje referanslarini otomatik gunceller.

Upstream sync sirasinda CI sablonlari **adaptive** modda guncellenir: 3-way merge yapilir ve `.sync-config.yaml` degiskenleriyle substitution uygulanir.
