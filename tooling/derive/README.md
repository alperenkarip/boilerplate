# create-project.sh — Proje Turetme Araci

Boilerplate'ten yeni proje turetmek icin kullanilan script. Tek komutla tum yapilandirma dosyalarindaki boilerplate referanslarini proje-ozel degerlerle degistirir, gerekli dosyalari olusturur ve dogrulama yapar.

Referans: `docs/implementation/43-derived-project-creation-guide.md`

## On Kosullar

- Node.js 20.x
- pnpm 10.x
- jq (JSON isleme araci)
- Git

## Kullanim

Script, boilerplate reposunun kok dizininde calistirilmalidir.

### Temel kullanim (zorunlu parametreler)

```bash
./tooling/derive/create-project.sh \
  --name "myapp" \
  --scope "@myapp" \
  --display-name "My App" \
  --bundle-id "com.myorg.myapp" \
  --domain "myapp.com"
```

### Tam kullanim (tum parametreler)

```bash
./tooling/derive/create-project.sh \
  --name "myapp" \
  --scope "@myapp" \
  --display-name "My App" \
  --bundle-id "com.myorg.myapp" \
  --domain "myapp.com" \
  --description "Uygulama aciklamasi" \
  --upstream-url "https://github.com/org/boilerplate.git" \
  --skip-install \
  --skip-verify
```

## Parametreler

### Zorunlu

| Parametre        | Aciklama                                   | Ornek             |
| ---------------- | ------------------------------------------ | ----------------- |
| `--name`         | Proje slug'i (kucuk harf, tire, alt cizgi) | `myapp`           |
| `--scope`        | npm scope                                  | `@myapp`          |
| `--display-name` | Insan-okur proje adi                       | `My App`          |
| `--bundle-id`    | iOS/Android bundle identifier              | `com.myorg.myapp` |
| `--domain`       | Deep link ve Universal Links domain'i      | `myapp.com`       |

### Opsiyonel

| Parametre        | Aciklama                                    | Varsayilan               |
| ---------------- | ------------------------------------------- | ------------------------ |
| `--description`  | Proje aciklamasi                            | (bos)                    |
| `--upstream-url` | Boilerplate repo URL (upstream remote icin) | (bos, sonra eklenebilir) |
| `--skip-install` | pnpm install adimini atla                   | `false`                  |
| `--skip-verify`  | Dogrulama adimini atla                      | `false`                  |

## Script Fazlari

Script 6 faz halinde calisir:

### Faz 1: Kimlik Donusumu

- Tum `package.json` dosyalarinda `@project/` scope'u yeni scope ile degistirilir
- Kok `package.json` name alani guncellenir
- Kaynak koddaki (`apps/`, `packages/`) import referanslarindaki `@project/` ifadeleri yeni scope'a cevrilir

### Faz 2: Platform Yapilandirmasi

- `apps/mobile/app.json`: Expo name, slug, scheme, bundleIdentifier, associatedDomains, package, intentFilters guncellenir
- `apps/web/index.html`: HTML title guncellenir
- `.env.example`: `VITE_APP_NAME` guncellenir
- `.moai/config/sections/project.yaml`: MoAI proje adi ve aciklamasi guncellenir
- CI workflow dosyalarindaki scope ve proje referanslari guncellenir

### Faz 3: Dokumantasyon Uyarlama

- `.sync-config.yaml` olusturulur (upstream sync degiskenleri)
- `BOUNDARY.md` olusturulur (boundary contract ve sync durumu)
- `CHANGELOG.md` uyarlanir (proje-ozel ilk giris)
- `CLAUDE.md` Proje Kimligi bolumu guncellenir
- `AGENTS.md` basligi guncellenir
- `derived-projects.txt` temizlenir
- `notify-derived-projects.yml` workflow_dispatch only yapilir

### Faz 4: Upstream Remote Kurulumu

- `--upstream-url` verildiyse upstream remote eklenir ve tag'ler fetch edilir
- Verilmediyse uyari gosterilir, daha sonra manuel eklenebilir

### Faz 5: Bagimlilik Kurulumu

- `--skip-install` degilse `pnpm install` calistirilir

### Faz 6: Dogrulama

- `--skip-verify` degilse asagidaki kontroller yapilir:
  - Kalan `@project/` referansi taramas
  - Config dosyalarinda kalan `boilerplate` referansi taramasi
  - Zorunlu dosyalarin (`BOUNDARY.md`, `.sync-config.yaml`) varlik kontrolu
  - `pnpm typecheck` ve `pnpm build` calistirilir (install yapildiysa)

## Troubleshooting

### jq bulunamadi

Script baslarken `jq bulunamadi` hatasi aliyorsaniz:

```bash
# macOS
brew install jq

# Linux (Debian/Ubuntu)
sudo apt install jq
```

### BOUNDARY.md zaten mevcut

Bu proje daha once turetilmis olabilir. Script onay sorar. Devam etmek istiyorsaniz `e` tusuna basin.

### @project/ referansi kaliyor

Dogrulama asamasinda bazi dosyalarda hala `@project/` referansi kaldigina dair uyari alirsaniz, bu dosyalari manuel olarak guncelleyin. Ozellikle:

- `pnpm-lock.yaml` icinde kalan referanslar `pnpm install` ile otomatik duzeltilir
- `node_modules/` icindeki referanslar gozardi edilir

### typecheck basarisiz

Genellikle scope degisikliginden kaynaklanan tip hatalarini gosterir. `pnpm install` tekrar calistirin, ardindan `pnpm typecheck` ile kontrol edin. Hala hatalar varsa package.json dosyalarindaki dependency referanslarini kontrol edin.

## Script Sonrasi Yapilacaklar

1. `.env.example` dosyasini `.env.local` olarak kopyalayin ve ortam degiskenlerini doldurun
2. Design token'lari projeye ozel degerlerle guncelleyin: `packages/design-tokens/src/`
3. Upstream remote ekleyin (eger `--upstream-url` vermediyseniz): `git remote add upstream <boilerplate-repo-url>`
4. Ilk commit'i olusturun: `git add -A && git commit -m 'Proje olusturuldu: <display-name>'`
5. `README.md` dosyasini projeye ozel iceriginizle guncelleyin
6. MoAI proje dokumanlarini uretin: `/moai project && /moai codemaps`
