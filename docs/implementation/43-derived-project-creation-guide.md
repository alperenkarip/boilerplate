# 43-derived-project-creation-guide.md

## Doküman Kimliği

- **Doküman adı:** Derived Project Creation Guide
- **Dosya adı:** `43-derived-project-creation-guide.md`
- **Doküman türü:** Guide / project creation process
- **Durum:** Accepted
- **Tarih:** 2026-04-01
- **Kapsam:** Boilerplate'ten yeni proje türetme süreci, adımlar, kontrol noktaları, başlangıç dosya seti
- **Bağlı olduğu üst dokümanlar:**
  - `20-initial-implementation-checklist.md`
  - `21-repo-structure-spec.md`
  - `45-boilerplate-project-boundary-contract.md`
- **Doğrudan etkileyeceği dokümanlar:**
  - `35-document-map.md`

---

# 1. Amac

Bu belgenin amaci, boilerplate'ten yeni bir proje turetme (derive) surecini:

- "ilk gunku kaos",
- kisisel tercihlere dayali scaffold,
- eksik config'lerle baslanmis repo,
- boundary contract habersiz baslangic,
- kalite kapilari olmadan feature gelistirme

gibi hatalardan koruyup; **tekrarlanabilir, kontrol edilebilir ve boundary contract'a uygun bir baslangic sureci** haline getirmektir.

Bu belge su temel soruyu cevaplar:

> "Boilerplate'ten yeni bir proje nasil baslatilir?"

Bu soru basit gorunur ama yanlis cevaplandiginda projenin ilk gununden itibaren boilerplate ile baglantisi kopar, teknik borc gorundugu an birikmeye baslar ve audit'lerde surekli blocker bulgular cikar.

---

# 2. Temel Tez

Bu proje kapsaminda temel tez sudur:

> Her yeni proje ayni temelden baslamalidir. Sapmalar bilincsiz degil, bilincli ve belgelenmis olmalidir.

Bu tez su sonuclari dogurur:

1. Turetme sureci adim adim izlenen bir checklist'tir, kisisel yorum alani degildir.
2. Boilerplate'in zorunlu miras katmani (bkz. `45-boilerplate-project-boundary-contract.md`) ilk gunden itibaren gecerlidir.
3. Proje-ozel yapilandirma, boundary contract'in izin verdigi alanda yapilir.
4. Her adimin tamamlanmasi icin dogrulama kriteri vardir.
5. Adimlar atlanamaz; atlanan adim audit'te blocker olarak doner.

---

# 3. On Kosullar

Turetme surecine baslamadan once asagidaki on kosullar saglanmis olmalidir:

| On Kosul | Aciklama |
|---|---|
| Node.js 20.x | `.nvmrc` ile kilitlenen exact hat. `nvm use` veya esdeger runtime hint ile dogrulanir |
| pnpm 10.x | Workspace manager. `corepack enable && corepack prepare` ile saglanir |
| Git | Versiyon kontrol sistemi. Repo baslatmak icin zorunlu |
| Turborepo 2.x | Build orchestrator. pnpm ile birlikte gelir (`turbo` komutu erisebilir olmali) |
| Boilerplate erisimi | Boilerplate repo'sunun clone/fork edilebilir olmasi veya scaffold script'inin mevcut olmasi |
| Turkce dokumantasyon | Tum proje belgeleri Turkce yazilir. Bu kural boilerplate'in felsefi miras katmanindan gelir |
| Boundary contract bilgisi | `45-boilerplate-project-boundary-contract.md` belgesi okunmus ve anlasimis olmali |

On kosullar saglanmadan turetme sureci baslatilmaz.

---

# 4. Turetme Adimlari

## Adim 1: Repo Olustur

**Amac:** Projenin fiziksel reposunu boilerplate'ten turet.

**Yapilacaklar:**

1. Boilerplate repo'sunu fork/clone et veya scaffold script calistir
2. Temiz baslangic isteniyorsa git gecmisini temizle (`rm -rf .git && git init`)
3. Root `package.json` icindeki proje adini (`@<org>/<yeni-proje-adi>`) ve description'i guncelle
4. Remote origin'i yeni repo'ya bagla (`git remote add origin <url>`)

**Dogrulama:**
- [ ] Repo fiziksel olarak mevcut ve proje adi root `package.json`'da dogru
- [ ] Git gecmisi temiz veya fork olarak baglantili
- [ ] Remote origin dogru repo'ya isaret ediyor

---

## Adim 2: Temel Config Dogrula

**Amac:** Boilerplate'ten gelen temel konfigurasyonlarin saglikli ve guncel oldugunu dogrula.

**Kontrol edilecek dosyalar:**

| Dosya | Dogrulama |
|---|---|
| `.nvmrc` | Node versiyonu `20.19.x` hattinda mi? |
| `pnpm-workspace.yaml` | Workspace tanimlari (`apps/*`, `packages/*`, `tooling/*`) mevcut mu? |
| `turbo.json` | Task pipeline (`build`, `lint`, `typecheck`, `test`) tanimli mi? |
| `tsconfig.base.json` | TypeScript baseline ayarlari boilerplate ile uyumlu mu? |
| `eslint.config.js` | Flat config yapisi mevcut mu? Shared config zincirleri dogru mu? |
| `.prettierrc` veya `prettier.config.*` | Format kurallari tanimli mi? |
| `.gitignore` | Standart ignore pattern'leri mevcut mu? (`node_modules`, `.env.local`, `dist` vb.) |

**Dogrulama:**
- [ ] Tum config dosyalari mevcut ve icerik olarak beklenen baseline'i karsiiliyor
- [ ] Hicbir config dosyasi bos veya placeholder degil
- [ ] Config dosyalari arasinda celiski yok

---

## Adim 3: Environment Kurulumu

**Amac:** Gelistirme ortamini calisir hale getir.

**Yapilacaklar:**

1. `.env.example` → `.env.local` kopyala ve proje-ozel degerlerle doldur (API base URL, auth credentials, Sentry DSN, i18n default locale vb.)
2. `pnpm install` calistir
3. `pnpm turbo run build --dry-run` ile saglik kontrolu yap

**Dogrulama:**
- [ ] `.env.local` olusturuldu, eksik degisken yok
- [ ] `pnpm install` peer warning veya error olmadan tamamlandi
- [ ] Dry-run basariyla cikti uretti

---

## Adim 4: Proje-Ozel Yapilandirma

**Amac:** Boilerplate'in proje-ozel alanlarini turetilen projeye uyarla.

**Guncellenecek dosyalar:**

| Dosya | Yapilacak |
|---|---|
| `CLAUDE.md` | Proje adi, ozel kurallar ve canonical kararlari proje baglamina guncelle |
| `AGENTS.md` | Proje-ozel review kurallari ekle (alt dizinlere de yerlestirilebilir) |
| `.github/CODEOWNERS` | Ekip yapisina gore sahiplik tanimlarini duzenle |
| `.claudeignore` | Hassas dosya pattern'lerini dogrula (`.env*`, `*.pem`, `*.key` vb.) |
| Root ve alt `package.json`'lar | Proje adi, description, repository URL guncelle |

**Dogrulama:**
- [ ] AI talimat dosyalari (CLAUDE.md, AGENTS.md) proje-ozel bilgilerle guncellendi
- [ ] CODEOWNERS ekip yapisini yansitiyor
- [ ] Tum `package.json` dosyalarindaki proje adi tutarli

---

## Adim 5: Boilerplate Sinirlarini Gozden Gecir

**Amac:** Boundary contract'i oku, zorunlu miras kurallarini kabul et, override gereksinimlerini belirle.

**Yapilacaklar:**

1. `45-boilerplate-project-boundary-contract.md` belgesini oku. Ozellikle Bolum 3 (miras tipleri), Bolum 4 (override izin tablosu) ve Bolum 10 (anti-pattern'ler) onemli.

2. Zorunlu miras kurallarini kabul et: canonical stack (ADR-001 → ADR-012), dependency policy (`37-dependency-policy.md`), compatibility matrix (`38-version-compatibility-matrix.md`), WCAG AA esigi, security baseline (`27-security-and-secrets-baseline.md`).

3. Override gereksinimlerin varsa Bolum 7'deki sureci baslat ve `44-exception-and-exemption-policy.md` ile uyumlu sekilde belgele.

4. Root dizinde `BOUNDARY.md` dosyasini olustur. Bu dosya boilerplate surumunu, aktif override'lari, proje-ozel eklemeleri ve son audit tarihini icerir. Ornek format icin `45-boilerplate-project-boundary-contract.md` Bolum 9.1'e bak.

**Dogrulama:**
- [ ] Boundary contract okundu ve zorunlu miras kurallari kabul edildi
- [ ] Override gereksinimleri belirlendi ve belgelendi (varsa)
- [ ] `BOUNDARY.md` root dizinde olusturuldu

---

## Adim 6: Design System ve Token'lar

**Amac:** Proje-ozel gorsel kimlik degerlerini design token sistemine gir.

**Yapilacaklar:**

1. `packages/design-tokens/` dizininde proje degerlerini gir: raw palette (renkler), semantic roles (surface, text, border, accent), spacing scale, typography scale (font ailesi, boyut, satir yuksekligi), radius/border/motion degerleri.

2. Token hiyerarsisini koru — bu yapisal miras katmanindan gelir ve degistirilemez:
   `raw (palette) → semantic (roles) → component (consumption)`

3. Light/dark tema degerlerini proje-ozel olarak belirle.

4. `pnpm --filter design-tokens build` ile token export surface'ini dogrula.

**Dogrulama:**
- [ ] Proje-ozel degerler tanimli, hiyerarsi (raw → semantic → component) bozulmamis
- [ ] Token paketi basariyla build ediliyor
- [ ] Light/dark tema degerleri tanimli

---

## Adim 7: Bootstrap Checklist'i Baslat

**Amac:** `20-initial-implementation-checklist.md` belgesindeki fazlari sistematik olarak takip et.

**Yapilacaklar:**

1. **Faz A — Environment and Toolchain Lock:** Exact Node/pnpm/Turbo hatti dogrulanmis olmali (Adim 2'de yapildi).

2. **Faz B — Root Repo Bootstrap:** Monorepo ust alanlari (`apps/`, `packages/`, `docs/`, `project/`, `tooling/`, `scripts/`) fiziksel olarak mevcut ve workspace tanimilariyla bagli olmali.

3. **Faz C — Core Config Packages and Root Config:** Config paketleri (`packages/config-typescript`, `packages/config-eslint`) kurulu, tsconfig ve eslint zinciri calisiyor olmali.

4. Sonraki fazlar (D-R) projenin ilerleme hizina gore sirayla tamamlanir. Her faz icin `20-initial-implementation-checklist.md`'deki done kanitlari toplanir.

**Onemli:** Faz A-C tamamlanmadan sonraki fazlara gecilemez. Bu siralama zorunludur.

**Dogrulama:**
- [ ] Faz A tamamlandi, done kaniti mevcut
- [ ] Faz B tamamlandi, done kaniti mevcut
- [ ] Faz C tamamlandi, done kaniti mevcut
- [ ] Sonraki fazlar icin plan olusturuldu

---

## Adim 8: Ilk Kalite Kontrolu

**Amac:** Temel kalite kapilarinin calistigini dogrula.

**Yapilacaklar:**

1. `pnpm typecheck && pnpm lint && pnpm test && pnpm build` calistir. Tumunun pass etmesi zorunlu.
2. Basarisiz olan varsa hatanin kaynagini belirle (config mi, kod mu), duzelt ve tekrar calistir.
3. CI pipeline'i aktif et: `.github/workflows/` altinda workflow dosyasi, push/PR event'lerinde 4 kalite adimi, branch protection kurallari.

**Dogrulama:**
- [ ] Tum kalite komutlari (`typecheck`, `lint`, `test`, `build`) basarili
- [ ] CI pipeline aktif ve push/PR'da calisiyor
- [ ] Branch protection kurallari aktif

---

## Adim 9: Proje Belgelerini Baslat

**Amac:** Proje-ozel dokumantasyon yapisini olustur.

**Yapilacaklar:**

1. `project/` ve `project/adr/` dizinlerini olustur. ADR naming convention: `PROJECT-ADR-001-<karar-adi>.md`
2. ADR sablonu olarak `18-adr-template.md` kullanilir. Ek alanlar: boilerplate ADR catisma kontrolu, miras tipi etkisi, override talebi gerekli mi.
3. Proje charter'i yaz (opsiyonel): `project/project-charter.md` — amac, kapsam, hedef kitle, basari kriterleri.
4. Docs dizinini organize et: `docs/adr/` (boilerplate ADR'leri, read-only), `docs/onboarding/` (yeni gelistirici rehberleri).

**Dogrulama:**
- [ ] `project/adr/` dizini mevcut ve naming convention belirli
- [ ] Docs dizini organize edildi

---

## Adim 10: Ilk Vertical Slice

**Amac:** Tum sistemin birlikte calistigini gosteren ilk end-to-end feature'u implement et.

**Yapilacaklar:**

1. Basit ama anlamli bir feature sec (ornek: `39-default-screens-and-components-spec.md` S25 List → S26 Detail → S27 Form akisi).

2. Feature su katmanlari kapsamali: route entry, UI primitives kullanimi, en az bir query fetch (TanStack Query), loading/error/empty/success state'leri, en az bir form interaction (RHF + Zod), en az bir mutation, i18n copy (inline string yok), auth/session-aware shell, test coverage, a11y degerlendirmesi.

3. Full DoD (`32-definition-of-done.md`) uygula ve ilk PR template'ini kullanarak PR ac.

**Dogrulama:**
- [ ] Vertical slice end-to-end calisiyor, tum katmanlar dahil
- [ ] DoD maddeleri karsilaniyor ve CI tum kontrolleri gecti

---

# 5. Proje-Ozel ADR Politikasi

Derived project kendi ADR'lerini yazma hakkina sahiptir. Bu hak sinirlanmaz. Ancak su kurallar gecerlidir:

## 5.1. Dizin Yapisi

Proje ADR'leri `project/adr/` altinda, boilerplate ADR'leri `docs/adr/` altinda read-only olarak tutulur. Proje ADR'leri `PROJECT-ADR-` on ekiyle baslar, boilerplate ADR'leri ile numara catismasi onlenir.

## 5.2. Catismazlik Kurali

- Catisma otomatik olarak **boilerplate ADR lehine** cozulur. Proje ADR'si gecersiz sayilir.
- Farkli karar alinmak isteniyorsa boilerplate ADR revision sureci baslatilmalidir (`45-boilerplate-project-boundary-contract.md` Bolum 7).
- Boilerplate ADR'sinin kapsamadigi alanlarda catisma yoktur, proje ADR'si gecerlidir.

## 5.3. Sablon ve Ek Alanlar

Proje ADR'leri `18-adr-template.md` sablonunu kullanir. Ek zorunlu alanlar: boilerplate ADR catisma kontrolu, miras tipi etkisi, override talebi gerekli mi.

## 5.4. Celiski Yasagi

Proje ADR'si hicbir durumda boilerplate ADR'sini gecersiz kilamaz. Canonical stack kararlari (ADR-001 → ADR-012) degistirilemez. Override sureci bile kurallari kaldirmaz, sadece belirli kosullarda farkli uygulanmasini mumkun kilar.

---

# 6. Kontrol Noktasi Checklist'i

Her adim sonrasi asagidaki kontrol noktasi checklist'i uygulanir:

| Adim | Kontrol Noktasi | Dogrulama Yontemi |
|---|---|---|
| 1. Repo olustur | Repo fiziksel, proje adi dogru, remote bagli | `git remote -v`, `package.json` kontrolu |
| 2. Temel config | Tum config dosyalari mevcut ve uyumlu | Dosya varlik kontrolu, icerik incelemesi |
| 3. Environment | `.env.local` tamam, install basarili | `pnpm install` exit code, dry-run |
| 4. Proje-ozel | CLAUDE.md, AGENTS.md, CODEOWNERS guncellendi | Dosya icerik incelemesi |
| 5. Boundary | Contract okundu, BOUNDARY.md olusturuldu | `BOUNDARY.md` varlik ve icerik kontrolu |
| 6. Token'lar | Proje degerleri girildi, hiyerarsi korundu | Token build, gorsel inceleme |
| 7. Bootstrap | Faz A-C tamamlandi, done kanitlari mevcut | Faz bazli done kaniti kontrolu |
| 8. Kalite | Tum kalite komutlari pass, CI aktif | `pnpm typecheck && lint && test && build` |
| 9. Belgeler | project/adr/ hazir, docs organize | Dizin yapisi kontrolu |
| 10. Vertical slice | End-to-end calisiyor, DoD karsilandi | PR review, CI gecisi |

**Kural:** Bir adim tamamlanmadan sonraki adima gecilmesi onerilmez. Adim 1-5 kesinlikle sirayla tamamlanmalidir. Adim 6-10 arasinda sinirli paralellik mumkundur (ornegin Adim 6 ve Adim 9 paralel ilerleyebilir).

---

# 7. Sik Yapilan Hatalar

Asagidaki anti-pattern'ler turetme surecinde en sik karsilasilan hatalardir. Bu hatalarin her biri projenin ilk gununen itibaren teknik borc biriktirmesine yol acar.

## 7.1. Fork-and-Forget

**Hata:** Boilerplate'ten fork edip boundary contract'i tamamen yok saymak. `BOUNDARY.md` olusturmamak, boilerplate ADR'lerini read-only olarak tutmamak.

**Sonuc:** Proje zamanla boilerplate ile baglantisini kaybeder, iki bagimsiz ve uyumsuz sistem olusur. Audit'te surekli blocker bulgu cikar.

**Cozum:** Adim 5'i atlamayin. `BOUNDARY.md` ilk gunden itibaren olmali.

## 7.2. Config Kopyala-Yapistir

**Hata:** Config dosyalarini boilerplate'ten kopyalayip icerigi anlamadan kullanmak. Ozellikle `tsconfig.base.json` ve `eslint.config.js` icin gecerli.

**Sonuc:** Config'ler arasinda celiski olusur, lint ve typecheck beklenmedik sonuclar uretir.

**Cozum:** Adim 2'de her config dosyasini bilinçli olarak dogrulayin.

## 7.3. Environment Degiskenlerini Atlamak

**Hata:** `.env.example` → `.env.local` kopyasini yapmamak veya eksik degiskenlerle baslamak.

**Sonuc:** Runtime'da beklenmedik hatalar, undefined API call'lar, Sentry'nin calismamasi.

**Cozum:** Adim 3'te tum degiskenleri doldurun ve dry-run ile dogrulayin.

## 7.4. Kalite Kapilarini "Sonraya" Birakmak

**Hata:** "Simdilik CI'yi sonra kurariz" diyerek kalite kapilarini ertelemek. Feature gelistirmeye baslamadan CI'nin aktif olmasini beklememek.

**Sonuc:** Kalite kapilari olmadan yazilan kod, sonradan lint/type/test'e uyumlu hale getirmek icin buyuk refactor gerektirir.

**Cozum:** Adim 8, Adim 10'dan (vertical slice) once tamamlanmalidir. Bu siralama zorunludur.

## 7.5. Token Hiyerarsisini Bozmak

**Hata:** `raw → semantic → component` token hiyerarsisini bypass ederek dogrudan raw degerler kullanmak veya hiyerarsiyi degistirmek.

**Sonuc:** Tema degisimi calismaz, design system tutarsizlasir, yapisal miras ihlali olusur.

**Cozum:** Adim 6'da hiyerarsiyi koruyun. Sadece degerler proje-ozel olabilir, yapi degismez.

## 7.6. Proje ADR'sini Boilerplate ADR'si ile Catistirmak

**Hata:** Proje-ozel ADR yazarken boilerplate ADR'leri ile catisma kontrolu yapmamak. Ornegin canonical stack disinda teknoloji secimi icin proje ADR'si yazmak.

**Sonuc:** Proje ADR'si gecersiz sayilir, audit'te blocker bulgu cikar, zaman kaybedilir.

**Cozum:** Her proje ADR'sinde boilerplate ADR catisma kontrolu zorunlu alandir (bkz. Bolum 5.3).

## 7.7. Vertical Slice'i Mock ile Gecistirmek

**Hata:** Ilk vertical slice'i sadece statik mock verilerle yapmak, gercek query/mutation/form lifecycle'i test etmemek.

**Sonuc:** Sistemin birlikte calistigi sanilir ama gercek veri akisinda sorunlar gorulmez.

**Cozum:** Adim 10'da vertical slice en az bir gercek query fetch, bir mutation ve bir form interaction icermeli.

---

# 8. Onay Kriterleri

Bu belge asagidaki kosullar saglandiginda uygulamaya hazir kabul edilir:

- [ ] Turetme surecinin amaci ve temel tezi net olarak ifade edilmistir
- [ ] On kosullar (Node, pnpm, Git, boundary contract bilgisi) tanimlanmistir
- [ ] 10 adimlik turetme sureci eksiksiz ve siralii olarak yazilmistir
- [ ] Her adim icin yapilacaklar ve dogrulama kriterleri belirtilmistir
- [ ] Boundary contract entegrasyonu (Adim 5) belgeye islenmiistir
- [ ] `BOUNDARY.md` manifest formati orneklendirilmistir
- [ ] Proje-ozel ADR politikasi (dizin yapisi, catismazlik kurali, sablon) tanimlanmistir
- [ ] Kontrol noktasi checklist'i her adim icin olusturulmustur
- [ ] En az 5 anti-pattern tanimlanmis ve cozumleriyle birlikte yazilmistir
- [ ] `20-initial-implementation-checklist.md` ile uyumlu referans verilmistir
- [ ] `21-repo-structure-spec.md` ile uyumlu dizin yapisi referans verilmistir
- [ ] `45-boilerplate-project-boundary-contract.md` ile tutarli miras modeli kullanilmistir
- [ ] Belge, yeni bir ekip uyesinin tek basina takip edebilecegi netlikte yazilmistir
- [ ] `35-document-map.md`'de bu belgenin yeri isaretlenmistir
