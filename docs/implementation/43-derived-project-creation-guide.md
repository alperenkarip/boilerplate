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

| On Kosul                          | Aciklama                                                                                                                                                                    |
| --------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Node.js 20.x                      | `.nvmrc` ile kilitlenen exact hat. `nvm use` veya esdeger runtime hint ile dogrulanir                                                                                       |
| pnpm 10.x                         | Workspace manager. `corepack enable && corepack prepare` ile saglanir                                                                                                       |
| Git                               | Versiyon kontrol sistemi. Repo baslatmak icin zorunlu                                                                                                                       |
| Turborepo 2.x                     | Build orchestrator. pnpm ile birlikte gelir (`turbo` komutu erisebilir olmali)                                                                                              |
| Boilerplate erisimi               | Boilerplate repo'sunun clone/fork edilebilir olmasi veya scaffold script'inin mevcut olmasi                                                                                 |
| Turkce dokumantasyon              | Tum proje belgeleri Turkce yazilir. Bu kural boilerplate'in felsefi miras katmanindan gelir                                                                                 |
| Boundary contract bilgisi         | `45-boilerplate-project-boundary-contract.md` belgesi okunmus ve anlasimis olmali                                                                                           |
| Firebase CLI (`firebase-tools`)   | Canonical backend (ADR-020) icin zorunlu. `npm i -g firebase-tools` veya `pnpm dlx firebase-tools` ile kurulur, `firebase login` ile kimlik dogrulanir                      |
| Firebase hesabi ve faturalandirma | Firebase Console erisimi gerekli. Cloud Functions deploy icin **Blaze (pay-as-you-go)** plani zorunludur; emulator suite ise plan gerektirmez                               |
| Mobil development build           | `@react-native-firebase` native modul kullanir. **Expo Go DESTEKLENMEZ** — iOS/Android development build (EAS veya yerel) zorunludur (ADR-020 Bolum 16 / ADR-002 amendment) |

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
5. **Boilerplate'i upstream remote olarak ekle** (upstream sync icin zorunlu):
   ```bash
   git remote add upstream <boilerplate-repo-url>
   git fetch upstream --tags
   ```
6. **`.sync-config.yaml` dosyasini olustur** (upstream sync degiskenleri):
   ```yaml
   upstream_repo: 'github.com/<org>/boilerplate'
   project_name: '<yeni-proje-adi>'
   org_scope: '@<org>'
   ```
7. **`tooling/sync/derived-projects.txt`'e yeni projeyi ekle** (boilerplate reposunda):
   Boilerplate maintainer'a bildir veya PR ac.

**Dogrulama:**

- [ ] Repo fiziksel olarak mevcut ve proje adi root `package.json`'da dogru
- [ ] Git gecmisi temiz veya fork olarak baglantili
- [ ] Remote origin dogru repo'ya isaret ediyor
- [ ] Upstream remote tanimli: `git remote get-url upstream` basarili
- [ ] `.sync-config.yaml` proje-spesifik degerlerle doldurulmus

---

## Adim 2: Temel Config Dogrula

**Amac:** Boilerplate'ten gelen temel konfigurasyonlarin saglikli ve guncel oldugunu dogrula.

**Kontrol edilecek dosyalar:**

| Dosya                                  | Dogrulama                                                                          |
| -------------------------------------- | ---------------------------------------------------------------------------------- |
| `.nvmrc`                               | Node versiyonu `20.19.x` hattinda mi?                                              |
| `pnpm-workspace.yaml`                  | Workspace tanimlari (`apps/*`, `packages/*`, `tooling/*`) mevcut mu?               |
| `turbo.json`                           | Task pipeline (`build`, `lint`, `typecheck`, `test`) tanimli mi?                   |
| `tsconfig.base.json`                   | TypeScript baseline ayarlari boilerplate ile uyumlu mu?                            |
| `eslint.config.js`                     | Flat config yapisi mevcut mu? Shared config zincirleri dogru mu?                   |
| `.prettierrc` veya `prettier.config.*` | Format kurallari tanimli mi?                                                       |
| `.gitignore`                           | Standart ignore pattern'leri mevcut mu? (`node_modules`, `.env.local`, `dist` vb.) |

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

## Adim 3.5: Firebase Proje Kurulumu (Canonical Backend)

**Amac:** Projenin canonical backend'i olan Firebase'i (ADR-020 / ADR-021) turetilen proje icin olustur ve bagla. Backend = Firestore (DB) + Cloud Functions (canonical yazma/is mantigi) + Firebase Auth + Storage + FCM. Bu adim atlanamaz; Firebase zorunlu miras katmanidir (bkz. Bolum 7.8).

**Mimari ozet:**

- Yazma yolu: client direct-write YOK. Tum create/update/delete callable Cloud Functions uzerinden Admin SDK ile yapilir (`firestore.rules` icinde `allow write: if false`).
- Okuma yolu: client SDK Firestore okumasi, ownership ile sinirli (`isOwner` kurali).
- Web: `firebase` JS SDK, config `.env.local` icindeki `VITE_FIREBASE_*` degiskenlerinden okunur.
- Mobil: `@react-native-firebase`, config native `google-services.json` (Android) ve `GoogleService-Info.plist` (iOS) dosyalarindan **otomatik** okunur. Mobil tarafta Firebase icin `.env` degiskeni KULLANILMAZ.

**Yapilacaklar:**

1. Firebase CLI'ye giris yap: `firebase login`

2. Firebase Console'da (`console.firebase.google.com`) yeni proje olustur. Proje ID'sini not al.

3. Uygulamalari kaydet ve config dosyalarini indir:
   - **Web app** ekle → web config nesnesini (`apiKey`, `authDomain`, `projectId`, `storageBucket`, `messagingSenderId`, `appId`) al.
   - **iOS app** ekle (bundle identifier: `com.<org>.<app>`) → `GoogleService-Info.plist` indir.
   - **Android app** ekle (package name: `com.<org>.<app>`) → `google-services.json` indir.
   - Bundle ID / package name, Adim 4'te ve `apps/mobile/app.json` icinde tanimli degerle ayni olmalidir.

4. Firebase urunlerini etkinlestir: **Authentication** (kullanilacak provider'lari sec), **Firestore Database**, **Cloud Functions** (Blaze plani gerekebilir), **Storage**.

5. `.firebaserc` dosyasindaki `default` proje ID'sini gercek deger ile degistir (`"your-project-id"` → gercek proje ID).

6. `.env.local` dosyasina web config degerlerini gir. Asagidaki degiskenlerin tamami gereklidir:

   ```
   VITE_FIREBASE_API_KEY=
   VITE_FIREBASE_AUTH_DOMAIN=<project-id>.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=<project-id>
   VITE_FIREBASE_STORAGE_BUCKET=<project-id>.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=
   VITE_FIREBASE_APP_ID=
   VITE_FIREBASE_FUNCTIONS_REGION=us-central1
   VITE_FIREBASE_USE_EMULATOR=true
   ```

   `VITE_FIREBASE_USE_EMULATOR=true` gelistirmede emulator suite'ine baglanir; production build'de `false` yapilir veya kaldirilir.

7. Mobil native config dosyalarini yerlestir:
   - Indirilen `google-services.json`'i `apps/mobile/google-services.json` olarak kopyala (sablon: `apps/mobile/google-services.example.json`).
   - Indirilen `GoogleService-Info.plist`'i `apps/mobile/GoogleService-Info.plist` olarak kopyala (sablon: `apps/mobile/GoogleService-Info.example.plist`).
   - Bu iki dosya `.gitignore` icindedir ve **commit edilmez** (ADR-020). Her gelistirici kendi makinesine indirir.

8. Lokal emulator suite ile calistir: `firebase emulators:start`. Portlar `firebase.json` ile sabittir — Auth 9099, Firestore 8080, Functions 5001, Storage 9199, Emulator UI 4000. Web `VITE_FIREBASE_USE_EMULATOR=true` ile, mobil ise `__DEV__` modunda (Android `10.0.2.2`, iOS `localhost`) emulator'a otomatik baglanir.

9. Cloud Functions'i build edip deploy et:

   ```bash
   pnpm --filter @project/functions build
   firebase deploy --only functions
   ```

10. Firestore kurallari + indeksleri ve Storage kurallarini deploy et:
    ```bash
    firebase deploy --only firestore:rules,firestore:indexes,storage
    ```

**Dogrulama:**

- [ ] Firebase projesi olusturuldu; web + iOS + Android app kayitli
- [ ] `.firebaserc` gercek proje ID'sine isaret ediyor (artik `your-project-id` degil)
- [ ] `.env.local` icindeki tum `VITE_FIREBASE_*` degiskenleri dolu
- [ ] `apps/mobile/google-services.json` ve `apps/mobile/GoogleService-Info.plist` yerlestirildi (gitignore'da, commit edilmedi)
- [ ] `firebase emulators:start` 4000 portunda UI aciyor; web ve mobil emulator'a baglaniyor
- [ ] Cloud Functions build + deploy basarili; `firestore:rules`, `firestore:indexes`, `storage` deploy edildi

---

## Adim 4: Proje-Ozel Yapilandirma

**Amac:** Boilerplate'in proje-ozel alanlarini turetilen projeye uyarla.

**Guncellenecek dosyalar:**

| Dosya                          | Yapilacak                                                                |
| ------------------------------ | ------------------------------------------------------------------------ |
| `CLAUDE.md`                    | Proje adi, ozel kurallar ve canonical kararlari proje baglamina guncelle |
| `AGENTS.md`                    | Proje-ozel review kurallari ekle (alt dizinlere de yerlestirilebilir)    |
| `.github/CODEOWNERS`           | Ekip yapisina gore sahiplik tanimlarini duzenle                          |
| `.claudeignore`                | Hassas dosya pattern'lerini dogrula (`.env*`, `*.pem`, `*.key` vb.)      |
| Root ve alt `package.json`'lar | Proje adi, description, repository URL guncelle                          |

**Dogrulama:**

- [ ] AI talimat dosyalari (CLAUDE.md, AGENTS.md) proje-ozel bilgilerle guncellendi
- [ ] CODEOWNERS ekip yapisini yansitiyor
- [ ] Tum `package.json` dosyalarindaki proje adi tutarli

---

## Adim 5: Boilerplate Sinirlarini Gozden Gecir

**Amac:** Boundary contract'i oku, zorunlu miras kurallarini kabul et, override gereksinimlerini belirle.

**Yapilacaklar:**

1. `45-boilerplate-project-boundary-contract.md` belgesini oku. Ozellikle Bolum 3 (miras tipleri), Bolum 4 (override izin tablosu) ve Bolum 10 (anti-pattern'ler) onemli.

2. Zorunlu miras kurallarini kabul et: canonical technical decision layer (ADR-001 → ADR-019), dependency policy (`37-dependency-policy.md`), compatibility matrix (`38-version-compatibility-matrix.md`), WCAG AA esigi, security baseline (`27-security-and-secrets-baseline.md`).

3. Override gereksinimlerin varsa Bolum 7'deki sureci baslat ve `44-exception-and-exemption-policy.md` ile uyumlu sekilde belgele.

4. Root dizinde `BOUNDARY.md` dosyasini olustur. Bu dosya boilerplate surumunu, aktif override'lari, proje-ozel eklemeleri ve son audit tarihini icerir. `BOUNDARY.md` bu rehberin hedef cikti dosyasidir; bu arşivde hazır gelmesi beklenmez. Ornek format icin `45-boilerplate-project-boundary-contract.md` Bolum 9.1'e bak.

5. **Upstream sync altyapisini dogrula** (bkz. `49-upstream-sync-strategy.md`):
   - Adim 1'de eklenen `upstream` remote'un tanimli oldugunu dogrula
   - En guncel `bp-v*` tag'ini `BOUNDARY.md`'ye yaz (`boilerplate_upstream_hash`, `upstream_version`)
   - `tooling/sync/upstream-sync.sh` ve `tooling/sync/partial-merge.sh` scriptlerinin calisir durumda oldugunu dogrula
   - CLAUDE.md ve AGENTS.md'deki sentinel yorumlarinin (`UPSTREAM-SYNC-START/END`, `PROJECT-SPECIFIC-START/END`) mevcut oldugunu dogrula

**Dogrulama:**

- [ ] Boundary contract okundu ve zorunlu miras kurallari kabul edildi
- [ ] Override gereksinimleri belirlendi ve belgelendi (varsa)
- [ ] `BOUNDARY.md` root dizinde olusturuldu
- [ ] Upstream sync altyapisi hazir: remote tanimli, scriptler calisir, sentinel yorumlari mevcut

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
4. Docs dizinini organize et: `docs/adr/` (boilerplate ADR'leri, read-only), `docs/onboarding/` (yeni gelistirici rehberleri). `project/` altindaki adlar bu türetilen proje icin olusturulur; boilerplate doküman arşivinde fiziksel olarak bulunmak zorunda degildir.

**Dogrulama:**

- [ ] `project/adr/` dizini mevcut ve naming convention belirli
- [ ] Docs dizini organize edildi

---

## Adim 10: Ilk Vertical Slice

**Amac:** Tum sistemin birlikte calistigini gosteren ilk end-to-end feature'u implement et.

**Yapilacaklar:**

1. Basit ama anlamli bir feature sec (ornek: `39-default-screens-and-components-spec.md` S25 List → S26 Detail → S27 Form akisi).

2. Feature su katmanlari kapsamali: route entry, UI primitives kullanimi, loading/error/empty/success state'leri, en az bir form interaction (RHF + Zod), i18n copy (inline string yok), auth/session-aware shell, test coverage, a11y degerlendirmesi. Backend canonical Firebase oldugu icin (ADR-020) data akisi su uc parcayi mutlaka icermelidir:
   - **En az bir Firestore okuma** — client SDK ile, ownership ile sinirli (ornek: `sampleItems` koleksiyonu okuma, bkz. `firestore.rules`).
   - **En az bir callable yazma** — Cloud Function uzerinden (ornek: `createSampleItem` callable). Client direct-write (`setDoc`/`addDoc`/`updateDoc`/`deleteDoc`) YASAKTIR; tum yazma callable Functions ile yapilir (ADR-020 Bolum 7.1).
   - **Firebase Auth login akisi** — gercek bir kimlik dogrulama akisi (web `firebase/auth`, mobil `@react-native-firebase/auth`). Session-aware shell bu kimlige bagli calismali.

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

Proje ADR'si hicbir durumda boilerplate ADR'sini gecersiz kilamaz. Canonical stack kararlari (ADR-001 → ADR-019) degistirilemez. Override sureci bile kurallari kaldirmaz, sadece belirli kosullarda farkli uygulanmasini mumkun kilar.

---

# 6. Kontrol Noktasi Checklist'i

Her adim sonrasi asagidaki kontrol noktasi checklist'i uygulanir:

| Adim               | Kontrol Noktasi                                                                          | Dogrulama Yontemi                                  |
| ------------------ | ---------------------------------------------------------------------------------------- | -------------------------------------------------- |
| 1. Repo olustur    | Repo fiziksel, proje adi dogru, remote bagli                                             | `git remote -v`, `package.json` kontrolu           |
| 2. Temel config    | Tum config dosyalari mevcut ve uyumlu                                                    | Dosya varlik kontrolu, icerik incelemesi           |
| 3. Environment     | `.env.local` tamam, install basarili                                                     | `pnpm install` exit code, dry-run                  |
| 3.5. Firebase      | Proje olusturuldu, `.firebaserc` + `.env.local` + native config dolu, emulator calisiyor | `firebase emulators:start`, `.firebaserc` kontrolu |
| 4. Proje-ozel      | CLAUDE.md, AGENTS.md, CODEOWNERS guncellendi                                             | Dosya icerik incelemesi                            |
| 5. Boundary        | Contract okundu, BOUNDARY.md olusturuldu                                                 | `BOUNDARY.md` varlik ve icerik kontrolu            |
| 6. Token'lar       | Proje degerleri girildi, hiyerarsi korundu                                               | Token build, gorsel inceleme                       |
| 7. Bootstrap       | Faz A-C tamamlandi, done kanitlari mevcut                                                | Faz bazli done kaniti kontrolu                     |
| 8. Kalite          | Tum kalite komutlari pass, CI aktif                                                      | `pnpm typecheck && lint && test && build`          |
| 9. Belgeler        | project/adr/ hazir, docs organize                                                        | Dizin yapisi kontrolu                              |
| 10. Vertical slice | End-to-end calisiyor, DoD karsilandi                                                     | PR review, CI gecisi                               |

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

## 7.8. Firebase Yerine Baska Backend Secmek

**Hata:** Canonical backend Firebase (ADR-020) iken, turetilen projede alternatif bir backend secmek — ornegin SQL veritabani (Postgres/MySQL), custom HTTP API (Hono/Express/Fastify), ayri bir job queue (Inngest/BullMQ) veya farkli bir auth saglayicisi. Firestore + Cloud Functions + Firebase Auth + Storage yerine bunlari koymak.

**Sonuc:** Zorunlu miras ihlali. ADR-020 canonical stack'ten override sureci olmadan sapma, boundary contract'ta blocker bulgu uretir. Proje audit'te gecemez; iki uyumsuz backend modeli olusur.

**Cozum:** Firebase zorunlu mirastir. Backend ihtiyaclari Firebase primitifleriyle karsilanir: kalici veri → Firestore, is mantigi/yazma → callable Cloud Functions, kimlik → Firebase Auth, dosya → Storage, zamanlanmis is → Cloud Scheduler/Tasks, bildirim → FCM. Gercekten farkli bir backend gerekiyorsa `45-boilerplate-project-boundary-contract.md` Bolum 7 override sureci ve bir ADR revision zorunludur; aksi halde sapma gecersizdir.

---

# 8. AI Guardrail Kurulumu (Türetilen Proje)

Türetilen proje oluşturulurken AI guardrail çerçevesi de kurulmalıdır (`47-ai-guardrail-governance.md`).

## 8.1. Guardrail Dosyalarını Kopyala

```
# Boilerplate'den türetilen projeye kopyalanacak dosyalar:
docs/ai-guardrails/domain/          → read-only olarak kopyala
docs/ai-guardrails/activity/         → read-only olarak kopyala
.claude/skills/                      → kopyala (yapısal miras)
.claude/settings.json                → kopyala (yapısal miras)
```

## 8.2. CLAUDE.md'ye Guardrail Protokolünü Aktar

Boilerplate CLAUDE.md'deki "AI Guardrail Protokolü" bölümünü türetilen proje CLAUDE.md'sine zorunlu olarak aktar. Bu protokol kaldırılamaz.

## 8.3. AGENTS.md Guardrail Bölümlerini Aktar

Boilerplate AGENTS.md'deki "Guardrail Compliance Review" bölümünü türetilen proje AGENTS.md'sine aktar.

## 8.4. Proje-Spesifik Guardrail Ekleme (Opsiyonel)

Proje ihtiyacına göre `docs/ai-guardrails/project/GP-XXX-*.md` formatında ek guardrail'ler oluşturulabilir. Bu guardrail'ler base guardrail'lerle çelişemez.

## 8.5. Doğrulama

- [ ] `docs/ai-guardrails/domain/` dizini mevcut ve base dokümanlarla güncel
- [ ] `docs/ai-guardrails/activity/` dizini mevcut ve base dokümanlarla güncel
- [ ] `.claude/skills/` dizini mevcut, skill'ler çalışır durumda
- [ ] `.claude/settings.json` mevcut, hook'lar tanımlı
- [ ] CLAUDE.md'de guardrail protokolü var
- [ ] AGENTS.md'de guardrail review kuralları var

---

# 9. Tek Komut Fork + Customize Stratejisi

## 9.1. Amac

Derived project olusturma surecini mumkun oldugunca otomatize etmek, insan hatasini azaltmak ve her derived project'in tutarli bir baslangic noktasindan baslamasini garanti etmek. Bu bolum, tek komut ile boilerplate'ten derived project olusturma otomasyon stratejisini tanimlar.

## 9.2. Otomasyon Yaklasimi

Iki ana otomasyon secenegi degerlendirilir:

**Secenek 1: `degit` + Custom Script**
`degit` araci, boilerplate repo'sunu git history olmadan (shallow clone) indirir. Ardindan custom bir setup script calistirilarak proje-ozel yapilandirma yapilir.

```bash
# Ornek kullanim
npx degit <org>/boilerplate <yeni-proje-adi>
cd <yeni-proje-adi>
node scripts/setup-derived.js
```

**Secenek 2: Custom CLI (`create-derived-project`)**
Boilerplate ekibi tarafindan gelistirilmis bir CLI araci ile interaktif proje olusturma:

```bash
# Ornek kullanim
npx create-derived-project
```

## 9.3. Otomasyon Adimlari

Otomatize edilen islem akisi su adimlari kapsar:

| Adim                  | Aciklama                                                                                                                         | Otomasyon                                            |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| 1. Clone              | Boilerplate repo'su indirilir (git history olmadan)                                                                              | `degit` veya custom downloader                       |
| 2. Rename             | Root `package.json`'da proje adi, description ve tum alt paketlerde scope guncellenir                                            | Script: `find & replace`                             |
| 3. Brand Config       | Renk paleti, font ailesi, uygulama ikonu ve splash screen template'leri icin sorular sorulur                                     | Interaktif prompt (inquirer/prompts)                 |
| 4. Bundle ID          | iOS bundle identifier ve Android application ID belirlenir                                                                       | Script: `app.json` guncelleme                        |
| 5. Firebase Config    | `.firebaserc` proje ID'si ve `.env.local` icindeki `VITE_FIREBASE_*` degiskenleri doldurulur                                     | Script: `.firebaserc` + `.env.local` injection       |
| 6. Firebase Native    | `google-services.json` ve `GoogleService-Info.plist`, ornek dosyalardan kopyalanir; bundle/package ve proje ID degerleri yazilir | Script: example → gercek dosya, placeholder degisimi |
| 7. Desteklenen Diller | Varsayilan locale ve desteklenen diller sorulur, i18n namespace dosyalari olusturulur                                            | Script: locale dosyalari uretimi                     |
| 8. Dependency Install | `pnpm install` calistirilir                                                                                                      | Otomatik                                             |
| 9. CI Setup           | `.github/workflows/` icindeki workflow dosyalarinda proje adlari guncellenir                                                     | Script: sed/replace                                  |
| 10. BOUNDARY.md       | Boilerplate surumu, tarih ve proje adi ile `BOUNDARY.md` otomatik olusturulur                                                    | Template dosyasi + degisken injection                |
| 11. Git Init          | Temiz git gecmisi baslatilir ve ilk commit olusturulur                                                                           | `git init && git add . && git commit`                |

## 9.4. Interaktif Konfigurasyon Sorulari

Setup script'i calistirildiginda asagidaki sorular sorulur:

```
? Proje adi (kebab-case): my-awesome-app
? Organizasyon scope (@org): @myapp
? Uygulama goruntuleme adi: My Awesome App
? iOS Bundle Identifier: com.myapp.awesome
? Android Application ID: com.myapp.awesome
? Varsayilan dil: tr
? Ek desteklenen diller (virgul ile): en,de
? Birincil marka rengi (hex): #2563EB
? Firebase Project ID: my-awesome-app
? Firebase Web API Key: AIza...
? Firebase Messaging Sender ID (project number): 123456789012
? Firebase Web App ID: 1:123456789012:web:abc123
? Firebase Functions Region (varsayilan us-central1): us-central1
? Sentry DSN (bos birakilabilir):
```

`authDomain` ve `storageBucket` ayri sorulmaz; script bunlari Firebase Project ID'den turetir (`<project-id>.firebaseapp.com` ve `<project-id>.appspot.com`).

Bu bilgiler toplanarak ilgili dosyalara yansitilir: `package.json` (proje adi/scope), `app.json` (bundle ID/slug/scheme), `.firebaserc` (proje ID), `.env.local` (`VITE_FIREBASE_*`), `apps/mobile/google-services.json` + `GoogleService-Info.plist` (native config), `packages/design-tokens` (marka rengi) ve i18n namespace dosyalari. Sablon dosyalari (`.env.example`, `*.example.json`, `*.example.plist`) degistirilmez; script yeni dosyalar uretir.

## 9.5. Git History Temizleme

Boilerplate'in commit gecmisi derived project'e tasinmaz. Bunun nedenleri:

- Boilerplate commit'leri derived project baglami icin anlamsizdır.
- Git blame ve log sonuclari yaniltici olur.
- Derived project kendi commit gecmisini temiz baslatmalidir.

Temizleme islemi `rm -rf .git && git init` ile yapilir. Ilk commit mesaji "Boilerplate v<sürüm>'den derived project olusturuldu" formatinda olur.

## 9.6. BOUNDARY.md Otomatik Olusturma

Setup script'i, `45-boilerplate-project-boundary-contract.md` Bolum 9.1'deki formata uygun bir `BOUNDARY.md` dosyasi otomatik olusturur:

```markdown
# BOUNDARY.md

## Boilerplate Surumu

- Kaynak: <org>/boilerplate
- Surum: v<sürüm>
- Turetme tarihi: <tarih>

## Aktif Override'lar

(Henuz yok — override gerektiginde bu bolum guncellenir)

## Proje-Ozel Eklemeler

(Boilerplate'te olmayan, projeye ozel eklenen dependency/config/kural)

## Son Audit

- Tarih: <turetme-tarihi>
- Sonuc: Baslangic — ilk audit henuz yapilmadi
```

## 9.7. Firebase Yapilandirma Injection

Setup script'i (`scripts/setup-derived.js`) Firebase yapilandirmasini turetilen projeye enjekte eder. Bu, canonical backend'in (ADR-020) ilk gunden dogru baglanmasini garanti eder.

Script'in Firebase ile ilgili sorumluluklari:

| Hedef                                  | Islem                                                                                                                                                                                        |
| -------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `.firebaserc`                          | `projects.default` degeri Firebase Project ID ile degistirilir (`your-project-id` → gercek deger)                                                                                            |
| `.env.local`                           | `.env.example` sablonundan uretilir; `VITE_FIREBASE_*` degiskenleri toplanan degerlerle (apiKey, authDomain, projectId, storageBucket, messagingSenderId, appId, functionsRegion) doldurulur |
| `apps/mobile/google-services.json`     | `google-services.example.json`'dan kopyalanir; `PLACEHOLDER_PROJECT_ID`, `PLACEHOLDER_PROJECT_NUMBER`, `package_name` gercek degerlerle degistirilir                                         |
| `apps/mobile/GoogleService-Info.plist` | `GoogleService-Info.example.plist`'ten kopyalanir; `PLACEHOLDER_PROJECT_ID`, `PLACEHOLDER_PROJECT_NUMBER`, `BUNDLE_ID` gercek degerlerle degistirilir                                        |
| `apps/mobile/app.json`                 | `bundleIdentifier`, Android `package`, `name`, `slug`, `scheme` proje degerlerine guncellenir                                                                                                |

**Onemli kisitlar (script bir turetme aracidir, boilerplate'i kirmamalidir):**

- Sablon dosyalari (`.env.example`, `*.example.json`, `*.example.plist`) hicbir kosulda degistirilmez veya silinmez.
- Script idempotenttir: ayni degerlerle tekrar calistirildiginda ek degisiklik uretmez.
- API key ve native config gibi gizli degerler commit edilen sablonlara yazilmaz; yalnizca gitignore'daki gercek dosyalara (`.env.local`, `google-services.json`, `GoogleService-Info.plist`) yazilir.
- `--dry-run` modunda hicbir dosya degistirilmeden planlanan degisiklikler raporlanir.
- Web Firebase config `.env.local`'den okunur; mobil Firebase config native dosyalardan okunur. Mobil tarafta Firebase icin `.env` degiskeni enjekte EDILMEZ.

---

# 10. Boundary Contract Otomatik Audit

## 10.1. Amac

Derived project olusturulduktan sonra ve yasam suresi boyunca, boilerplate boundary contract'ina uyumun surekli olarak dogrulanmasi gerekir. Bu bolum, otomatik audit mekanizmasini tanimlar.

## 10.2. Ilk CI Calistirmasinda Uyum Dogrulamasi

Derived project'in ilk CI pipeline calistirmasinda asagidaki boundary contract kontrolleri otomatik olarak yapilir:

| Kontrol                           | Ne Denetlenir                                                                                                | Basarisizlik Durumu                       |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------ | ----------------------------------------- |
| **Canonical dependency kontrolu** | `package.json`'lardaki core dependency'lerin `38-version-compatibility-matrix.md` ile uyumu                  | CI warning (ilk hafta), CI fail (sonrasi) |
| **Zorunlu dosya varligi**         | `BOUNDARY.md`, `CLAUDE.md`, `AGENTS.md`, `.claudeignore` dosyalarinin varligi                                | CI fail                                   |
| **Config uyumu**                  | `tsconfig.base.json`, `eslint.config.js` dosyalarinin boilerplate baseline'i ile uyumu                       | CI warning                                |
| **Token hiyerarsi kontrolu**      | `packages/design-tokens/` altinda raw → semantic → component hiyerarsisinin korunuyor olmasi                 | CI fail                                   |
| **Yasak dependency kontrolu**     | `37-dependency-policy.md`'de yasaklanan dependency'lerin (orn. moment.js, lodash full bundle) yuklu olmamasi | CI fail                                   |

## 10.3. Quarterly Scheduled Audit

Her ceyrekte (quarterly) otomatik veya yari-otomatik bir boundary audit yurutulur:

### Audit Kapsami

1. **Dependency drift:** Canonical dependency'lerin versiyonlari boilerplate'in guncel compatibility matrix'i ile karsilastirilir. Major versiyon farki varsa guncelleme plani olusturulur.

2. **Zorunlu miras ihlali taramasi:** Boilerplate zorunlu miras katmanindaki kurallardan (WCAG AA, security baseline, TypeScript strict mode, hardcoded deger yasagi) sapma taranir.

3. **Override denetimi:** `BOUNDARY.md`'de kayitli override'larin hala gecerli oldugu, surelerinin dolup dolmadigi ve ilgili exception kaydinin (`44-exception-and-exemption-policy.md`) guncel oldugu kontrol edilir.

4. **Yeni boilerplate kurallari:** Son ceyrekte boilerplate'e eklenen yeni kurallar veya ADR'lerin derived project'e yansitilip yansitilmadigi kontrol edilir.

### Audit Ciktisi

Audit sonuclari `BOUNDARY.md`'nin "Son Audit" bolumune yazilir:

```markdown
## Son Audit

- Tarih: 2026-07-01
- Sonuc: PASS (2 uyari)
- Uyarilar:
  - @project/ui paketinde 85 export var (uyari esigi: 100)
  - react-native-reanimated versiyonu matrix'ten 1 minor geride
- Blocker: Yok
```

## 10.4. Audit Otomasyonu

Quarterly audit'in mumkun oldugunca otomatize edilmesi hedeflenir:

- **Dependency drift:** `npm outdated` veya custom script ile otomatik tespit.
- **Zorunlu miras kontrolu:** ESLint kurallari, TypeScript strict mode kontrolu ve CI kalite kapilari ile otomatik.
- **Override suresi:** `BOUNDARY.md` parse edilerek tarihleri gecmis override'lar otomatik raporlanir.
- **Manuel kontrol:** Domain-spesifik kurallar (a11y uyumu, design system token kullanimi) yari-otomatik audit gerektirir.

---

# 11. Onay Kriterleri

Bu belge asagidaki kosullar saglandiginda uygulamaya hazir kabul edilir:

- [ ] Turetme surecinin amaci ve temel tezi net olarak ifade edilmistir
- [ ] On kosullar (Node, pnpm, Git, boundary contract bilgisi) tanimlanmistir
- [ ] 10 adimlik turetme sureci eksiksiz ve siralii olarak yazilmistir
- [ ] Her adim icin yapilacaklar ve dogrulama kriterleri belirtilmistir
- [ ] Boundary contract entegrasyonu (Adim 5) belgeye islenmiistir
- [ ] Firebase canonical backend kurulumu (Adim 3.5) belgeye islenmistir; `.firebaserc`, `.env.local`, mobil native config ve emulator adimlari tanimlidir
- [ ] `BOUNDARY.md` manifest formati orneklendirilmistir
- [ ] Proje-ozel ADR politikasi (dizin yapisi, catismazlik kurali, sablon) tanimlanmistir
- [ ] Kontrol noktasi checklist'i her adim icin olusturulmustur
- [ ] En az 5 anti-pattern tanimlanmis ve cozumleriyle birlikte yazilmistir
- [ ] `20-initial-implementation-checklist.md` ile uyumlu referans verilmistir
- [ ] `21-repo-structure-spec.md` ile uyumlu dizin yapisi referans verilmistir
- [ ] `45-boilerplate-project-boundary-contract.md` ile tutarli miras modeli kullanilmistir
- [ ] Belge, yeni bir ekip uyesinin tek basina takip edebilecegi netlikte yazilmistir
- [ ] `35-document-map.md`'de bu belgenin yeri isaretlenmistir
