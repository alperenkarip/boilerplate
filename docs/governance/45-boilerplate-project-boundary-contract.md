# 45-boilerplate-project-boundary-contract.md

## Doküman Kimliği

- **Doküman adı:** Boilerplate-Project Boundary Contract
- **Dosya adı:** `45-boilerplate-project-boundary-contract.md`
- **Doküman türü:** Governance / boundary contract
- **Durum:** Accepted
- **Tarih:** 2026-04-01
- **Kapsam:** Bu belge, boilerplate'ten türetilen (derived) projelerin hangi kuralları zorunlu olarak miras alacağını, hangilerini yapısal çerçevede genişletebileceğini, hangilerini proje-özel yorumlayabileceğini ve hangilerini hiçbir koşulda override edemeyeceğini tanımlar. Override süreci, audit entegrasyonu ve anti-pattern tanımlarını içerir.
- **Bağlı olduğu üst dokümanlar:**
  - `00-project-charter.md`
  - `01-working-principles.md`
  - `36-canonical-stack-decision.md`
  - `37-dependency-policy.md`
- **Doğrudan etkileyeceği dokümanlar:**
  - `35-document-map.md`
  - `31-audit-checklist.md`
  - `43-derived-project-creation-guide.md`

---

# 1. Amac

Bu belgenin amaci, boilerplate ile ondan turetilen projeler arasindaki kural miras iliskisini belirsizlikten cikarip resmi bir sozlesmeye donusturmektir.

Boilerplate, mimari kararlari, kalite esiklerini, dependency politikalarini ve design system disiplinini tek yerde kilitler. Ancak derived project olusturuldugunda su sorular hemen ortaya cikar:

1. Bu kurallardan hangilerini degistirebilirim?
2. Proje-ozel ihtiyac icin override yapabilir miyim?
3. Yeni kural ekleyebilir miyim?
4. Bir kurali tamamen kaldirabilir miyim?
5. Override istersem sureç nedir, onay mekanizmasi nedir?
6. Proje-ozel ADR yazabilir miyim, boilerplate ADR'leri ile catisirsa ne olur?

Bu sorularin her biri cevapsiz kaldiginda iki sey olur:

- Ya derived project boilerplate kurallarini sessizce deler ve zamanla iki ayri sistem olusur.
- Ya da derived project gereksiz yere katilasir, proje-ozel esneklikten faydalanamaz.

Bu belge her iki durumu da onlemek icin yazilmistir. Bu belge "kurallarimiz bunlar, uyun" metni degildir. Bu belge, **hangi kuralin ne kadar esnek oldugunu, esnekligin sinirini ve sinir asildiginda ne yapilacagini** tanimlayan boundary contract'tir.

---

# 2. Temel Tez

Boilerplate kararlarinin derived project'e aktarilmasi tek bir modelle degil, **uc katmanli miras modeli** ile yonetilir.

Her boilerplate kurali su uc miras tipinden birine aittir:

| Miras Tipi | Anlami | Override | Extend | Yorum |
|---|---|---|---|---|
| Zorunlu miras | Kural oldugu gibi gecerlidir | Yasak | Sinirli | Yok |
| Yapisal miras | Yapi/hiyerarsi sabittir, icerik proje-ozel olabilir | Yasak | Serbest | Sinirli |
| Felsefi miras | Prensip baglar, uygulama proje-ozel olabilir | Yasak | Serbest | Serbest |

Bu modelin temel ilkesi sudur:

> Hicbir miras tipinde base kurallar kaldirilamaz. Derived project sadece **ust katman ekleyebilir**, alt katmani cikaramaz.

Bu ilke istisnasizdir. Override talebi bile bu ilkeyi gecersiz kilmaz; override sureci base kuralin kaldirilmasini degil, belirli kosullarda farkli uygulanmasini mumkun kilar (bkz. bolum 7).

---

# 3. Miras Tipleri Tanimi

## 3.1. Zorunlu Miras

**Tanim:** Derived project bu kurali oldugu gibi miras alir. Kuralda degisiklik yapilmasi, gevsetilmesi veya atlanmasi yasaktir. Degisiklik yalnizca boilerplate seviyesinde ADR revision ile mumkundur.

**Kapsam:** Canonical stack kararlari, dependency politikasinin base kurallari, compatibility matrix'in base satirlari, accessibility minimum esigi.

**Ozellikler:**

- Override yapilmasi yasaktir, talep bile acilsa boilerplate ADR revision surecindan gecmek zorundadir.
- Derived project bu kurallari sikilastirabilir ama gevsetemez.
- CI/lint/audit katmanlarinda bu kurallarin denetlenmesi otomatik olmalidir.

**Ornek:** ADR-001'de React/Expo/Next.js stack'i kilitlendiyse, derived project Vue'ya gecemez. ADR-008'de Vitest kilitlendiyse, derived project Jest'e gecemez.

## 3.2. Yapisal Miras

**Tanim:** Yapi, hiyerarsi ve naming convention sabittir. Derived project bu yapinin icinde proje-ozel icerik uretebilir, ek convention ekleyebilir, ama base yapiyi kaldiramaz veya degistiremez.

**Kapsam:** Design token hiyerarsisi, component governance naming ve lifecycle kurallari, CI kalite kapilari, Definition of Done base maddeleri.

**Ozellikler:**

- Yapi (dosya hiyerarsisi, naming pattern, lifecycle adimlari) sabittir.
- Icerik (token degerleri, proje-ozel component'ler, ek quality gate'ler) proje tarafindan belirlenir.
- Derived project ek convention ekleyebilir ama base convention'i kaldiramaz.
- Sikilastirma her zaman serbesttir, gevsetme her zaman yasaktir.

**Ornek:** `22-design-tokens-spec.md`'deki raw -> semantic -> component token hiyerarsisi degistirilemez, ama token degerleri (renkler, spacing birimleri) proje-ozel olabilir. `15-quality-gates-and-ci-rules.md`'deki quality gate'ler sikilastirabilir (ornegin coverage esigi %80'den %90'a cikartilabilir) ama gevsetilemez (%80'den %60'a dusurulemez).

## 3.3. Felsefi Miras

**Tanim:** Prensip olarak baglar, ama uygulamasi proje-ozel yorumlanabilir. Prensiple celismemek kaydiyla proje farkli yaklasimlari benimseyebilir.

**Kapsam:** Calisma prensipleri, dusunce modeli, karar alma refleksi.

**Ozellikler:**

- Prensip oldugu gibi gecerlidir, yorumlanamaz degildir ama celisilemez.
- Proje-ozel uygulama prensibin ruhuna uygun olmak zorundadir.
- Celiskinin tespiti audit sirasinda yapisal olarak degerlendirilir.

**Ornek:** `01-working-principles.md`'deki "documentation-first" prensibi derived project'te de gecerlidir. Ancak derived project, dokumantasyon formatini, yazilas tonunu veya dosya yapisini proje-ozel olarak belirleyebilir -- dokumantasyonu atlamak veya "gereksiz" ilan etmek mumkun degildir.

---

# 4. Kural Kaynagi x Miras Tipi x Override Izni Tablosu

Asagidaki tablo, her kural kaynaginin miras tipini ve override iznini tek yerde gosterir.

| # | Kural Kaynagi | Miras Tipi | Override Izni | Aciklama |
|---|---|---|---|---|
| 1 | ADR-001 → ADR-012 (canonical stack) | Zorunlu miras | Override yasak, sadece ADR revision ile | Teknoloji secimi, mimari omurga, testing/styling/state/data/auth/i18n/navigation kararlari degistirilemez |
| 2 | `37-dependency-policy.md` | Zorunlu miras | Ek kural eklenebilir, base kaldirilamaz | Proje-ozel dependency kural ekleyebilir (ornegin "X kategorisinde sadece Y kullanilir") ama base policy gevsetilemez |
| 3 | `38-version-compatibility-matrix.md` | Zorunlu miras | Extend edilebilir, base kaldirilamaz | Proje ek satir ekleyebilir (proje-ozel dependency icin), ama boilerplate'in base satir ve bantlari degistirilemez |
| 4 | `22-design-tokens-spec.md` (token hiyerarsisi) | Yapisal miras | Token degerleri proje-ozel, hiyerarsi sabit | raw -> semantic -> component katman yapisi degistirilemez. Naming convention degistirilemez. Degerler (renkler, spacing, radius vb.) proje-ozel |
| 5 | `23-component-governance-rules.md` (naming, lifecycle) | Yapisal miras | Proje ek convention ekleyebilir | Component acma kriterleri, lifecycle adimlari, API disiplini base olarak gecerli. Proje ek adim, ek convention ekleyebilir ama base kaldirilamaz |
| 6 | `15-quality-gates-and-ci-rules.md` (CI kurallari) | Yapisal miras | Sikilastirabilir, gevsetilemez | Coverage esigi, lint severity, a11y check, type-check, build validation base olarak gecerli. Yalnizca yukari dogru (daha siki) degistirilebilir |
| 7 | `32-definition-of-done.md` (is turu maddeleri) | Yapisal miras | Proje ek madde ekleyebilir, base kaldirilamaz | Base DoD maddeleri her derived project'te gecerli. Proje-ozel maddeler (ornegin "compliance check") eklenebilir |
| 8 | `12-accessibility-standard.md` (WCAG AA) | Zorunlu miras | Sikilastirabilir (AAA), gevsetilemez | WCAG AA minimum esiktir. Proje AAA hedefleyebilir ama AA'nin altina dusulemez |
| 9 | `01-working-principles.md` | Felsefi miras | Proje-ozel yorumlanabilir ama celisilemez | Prensipler baglar, uygulamalar proje-ozel olabilir. "Documentation-first" atlanamaz, ama format proje-ozel olabilir |
| 10 | `36-canonical-stack-decision.md` | Zorunlu miras | Override yasak, ADR revision ile | Bu belge ADR serisinin ozet kilitlemesidir, bagimsiz override mumkun degildir |
| 11 | `27-security-and-secrets-baseline.md` | Zorunlu miras | Sikilastirabilir, gevsetilemez | Guvenlik baseline'i asagi cekilemez |
| 12 | `21-repo-structure-spec.md` | Yapisal miras | Proje ek dizin ekleyebilir, base yapi kaldirilamaz | Monorepo root yapisi, packages/ hiyerarsisi, apps/ yapisi sabittir. Proje-ozel dizinler eklenebilir |
| 13 | `29-release-and-versioning-rules.md` | Yapisal miras | Proje ek release kanali ekleyebilir, base kurallar gecerli | Versioning semantigi, changelog disiplini, release pipeline base kurallari sabittir |
| 14 | `30-contribution-guide.md` | Yapisal miras | Proje ek akis ekleyebilir, base akis kaldirilamaz | PR sureci, review kurallari, commit convention base olarak gecerli |

---

# 5. Derived Project'in Kendi ADR'lerini Yazma Politikasi

## 5.1. Hak

Derived project kendi ADR'lerini yazma hakkina sahiptir. Bu hak sinirlanmaz.

## 5.2. Yapi

Derived project ADR'leri su dizin yapisinda tutulur:

```
project-root/
  docs/
    adr/
      PROJECT-ADR-001-*.md
      PROJECT-ADR-002-*.md
      ...
  boilerplate/         # boilerplate referans ADR'leri (read-only)
    ADR-001-*.md
    ADR-002-*.md
    ...
```

**Kurallar:**

- Proje ADR'leri `PROJECT-ADR-` on ekiyle baslar. Boilerplate ADR'leri ile numara catismasi onlenir.
- Boilerplate ADR dosyalari derived project icerisinde read-only olarak tutulur. Degisiklik yapilmaz.
- Her proje ADR'si, boilerplate ADR'leri ile catismazlik beyanini icerir.

## 5.3. Catismazlik Kurali

Proje ADR'si boilerplate ADR'si ile catisiyorsa:

1. **Catisma otomatik olarak boilerplate ADR lehine cozulur.** Proje ADR'si gecersiz sayilir.
2. Eger derived project gercekten farkli bir karar almak istiyorsa, bu kararla ilgili boilerplate ADR'sinin revision sureci baslatilmalidir (bkz. bolum 7).
3. Proje ADR'si boilerplate ADR'sinin kapsamadibi bir alani kapsiyorsa catisma yoktur, proje ADR'si gecerlidir.

## 5.4. Proje ADR Sablonu Ek Alanlari

Proje ADR'leri `18-adr-template.md`'deki sablonu kullanir ve su ek alanlari icerir:

- **Boilerplate ADR catisma kontrolu:** Hangi boilerplate ADR'leri ile iliskili, catisma var mi.
- **Miras tipi etkisi:** Bu karar hangi miras tipini etkiliyor, izin dahilinde mi.
- **Override talebi gerekli mi:** Eger zorunlu veya yapisal miras alanina dokunuyorsa override sureci baslatildi mi.

---

# 6. Override Izin Matrisi

Miras tiplerine gore override izinlerinin detayli matrisi:

| Eylem | Zorunlu Miras | Yapisal Miras | Felsefi Miras |
|---|---|---|---|
| Base kurali oldugu gibi kullanma | Zorunlu | Zorunlu | Zorunlu |
| Base kurali sikilastirma | Serbest | Serbest | Uygulanamaz |
| Base kurali gevsetme | Yasak | Yasak | Yasak |
| Base kurali kaldirma | Yasak | Yasak | Yasak |
| Ek kural/madde/convention ekleme | Sinirli (sadece extend izni olan satirlarda) | Serbest | Serbest |
| Proje-ozel deger atama | Uygulanamaz | Serbest (icerik katmaninda) | Uygulanamaz |
| Proje-ozel yorumlama | Yasak | Sinirli | Serbest |
| Override talebi acma | Mumkun (ADR revision sureci) | Mumkun (onay ile) | Gereksiz |

---

# 7. Override Sureci

## 7.1. Override Ne Degildir

Override, kurali sessizce atlamak, CI'da disable etmek, "gecici" etiketiyle bypass etmek veya "sonra duzeltilecek" notuyla ertelemek degildir. Bunlarin hepsi ihlaldir.

## 7.2. Override Talebi Acma

Bir derived project boilerplate kuralini override etmek istediginde su sureci takip eder:

**Adim 1 — Etki analizi**

Override talebi acan kisi su sorulara yazili cevap verir:

- Hangi boilerplate kurali override edilmek isteniyor? (Belge adi, bolum numarasi)
- Bu kural hangi miras tipine ait? (Zorunlu / Yapisal / Felsefi)
- Override nedeni nedir? (Teknik zorunluluk / is gerekliligi / performans / uyumluluk)
- Override edilmezse ne olur?
- Override edilirse hangi baska kurallar etkilenir?
- Override sureli mi, kalici mi?

**Adim 2 — Dokumantasyon**

Override talebi proje ADR formati ile belgelenir:

```
PROJECT-ADR-XXX-override-[kural-adi].md
```

Bu ADR su ek alanlari icerir:

- Override edilen boilerplate kurali referansi
- Miras tipi etkisi
- Risk degerlendirmesi (dusuk / orta / yuksek / kritik)
- Geri donus plani (override kaldirildiginda ne yapilacak)
- Zaman siniri (sureli override icin son tarih)

**Adim 3 — Onay**

| Miras Tipi | Onay Mekanizmasi |
|---|---|
| Zorunlu miras | Boilerplate ADR revision sureci baslatilir. Derived project tek basina onaylayamaz. |
| Yapisal miras | Proje tech lead + boilerplate maintainer onaylar. |
| Felsefi miras | Override gereksiz, proje-ozel yorumlama yeterli. Celisirse audit'te tespit edilir. |

**Adim 4 — Uygulama ve izleme**

- Onaylanan override CI/lint konfigurasyonunda acikca isaretlenir.
- Override'in sureli olmasi durumunda, son tarih CI'da kontrol edilir.
- Her audit doneminde aktif override'lar gozden gecirilir.

## 7.3. Acil Override (Emergency Override)

Uretim ortaminda kritik sorun nedeniyle aninda override gerektiren durumlarda:

1. Override yapilir ve aninda belgelenir.
2. 48 saat icerisinde tam override sureci (Adim 1-4) tamamlanir.
3. Tamamlanmazsa override otomatik olarak gecersiz sayilir ve geri alinir.
4. Acil override kullanimi audit raporunda ozel olarak isaretlenir.

---

# 8. Audit Entegrasyonu

## 8.1. Boundary Contract Uyum Denetimi

`31-audit-checklist.md`'deki mevcut audit mekanizmasina su ek denetim katmanlari eklenir:

**Denetim 1 — Zorunlu miras ihlali taramasi**

- Canonical stack disinda teknoloji kullanimi var mi?
- Dependency policy base kurallari gevsetilmis mi?
- Compatibility matrix base satirlari degistirilmis mi?
- Accessibility esigi AA'nin altina dusurulmus mu?
- Security baseline gevsetilmis mi?

**Denetim 2 — Yapisal miras uyumu**

- Token hiyerarsisi (raw -> semantic -> component) bozulmus mu?
- Component naming convention degistirilmis mi?
- CI quality gate'leri gevsetilmis mi (coverage, lint, type-check)?
- DoD base maddeleri cikarilmis mi?
- Repo base yapisi degistirilmis mi?

**Denetim 3 — Felsefi miras celiskisi**

- Working principles ile dogrudan celisen proje uygulamasi var mi?
- Documentation-first prensibi atlanmis mi?
- Karar alma disiplini (ADR, dokumantasyon) bypass edilmis mi?

**Denetim 4 — Override hijyeni**

- Onaysiz override var mi?
- Sureli override'larin son tarihi gecmis mi?
- Override ADR'si eksik mi?
- Acil override 48 saat kurali ihlal edilmis mi?

## 8.2. Severity Modeli

Boundary contract ihlalleri icin severity tanimlari:

| Severity | Tanim | Ornek |
|---|---|---|
| Blocker | Zorunlu miras ihlali | Canonical stack disinda teknoloji kullanimi, AA altina dusme |
| Critical | Yapisal miras base kurali kaldirma | DoD base maddesi cikarilmis, CI gate gevsetilmis |
| Major | Onaysiz override | Override ADR'si yazilmadan kural degistirilmis |
| Minor | Felsefi miras gerginligi | Prensiple tam celismeyen ama ruhuna uymayan uygulama |

## 8.3. Audit Frekansi

- **Her sprint sonu:** Override hijyeni kontrolu (Denetim 4)
- **Her ay:** Tam boundary contract audit (Denetim 1-4)
- **Her major release oncesi:** Kapsamli boundary contract uyum raporu

---

# 9. Derived Project Yapisinda Boundary Contract Gosterimi

Derived project icerisinde boundary contract'in gorunur olmasi icin su yapisal gereksinimler gecerlidir:

## 9.1. Boundary Manifest Dosyasi

Her derived project root dizininde bir `BOUNDARY.md` dosyasi bulundurur:

```markdown
# Boundary Contract Manifest

## Boilerplate Surumu
[Boilerplate referans commit hash veya versiyonu]

## Aktif Override'lar
| Override ADR | Kural | Miras Tipi | Onay Durumu | Son Tarih |
|---|---|---|---|---|
| PROJECT-ADR-003 | CI coverage esigi | Yapisal | Onaylandi | 2026-06-01 |

## Proje-Ozel Eklemeler
| Alan | Eklenen Kural/Convention | Referans |
|---|---|---|
| DoD | Compliance check maddesi | PROJECT-ADR-005 |
| Token | Proje-ozel renk paleti | design-tokens/project/ |

## Son Audit Tarihi
[Tarih ve sonuc ozeti]
```

## 9.2. CI Entegrasyonu

Boundary contract uyumu CI pipeline'inda su sekilde denetlenir:

- `boundary-check` adiminda zorunlu miras ihlalleri taranir.
- Override'larin suresi kontrol edilir.
- BOUNDARY.md dosyasinin guncelligi dogrulanir.
- Ihlal tespit edildiginde pipeline blocker olarak durdurulur.

---

# 10. Anti-pattern'ler

Asagidaki davranislar boundary contract ihlali olarak tanimlanir ve audit'te blocker veya critical severity ile raporlanir.

## 10.1. Sessiz Override

**Tanim:** Boilerplate kuralini hicbir dokumantasyon veya onay olmadan degistirme.

**Belirtileri:**
- CI konfigurasyonunda boilerplate kuralinin disable edilmesi
- Lint rule'larinin `.eslintrc` uzerinden sessizce kapatilmasi
- Coverage esiginin `vitest.config` icerisinde dusurulmesi
- Type-check'in CI'dan cikarilmasi

**Neden anti-pattern:** Override sureci atlandigi icin degisiklik gorunmez kalir, audit yakalamadigi surece etkisi bilinmez, geri donus plani yoktur.

## 10.2. Gecici Istisna Suistimali

**Tanim:** "Gecici" etiketiyle override yapip suresiz olarak birakma.

**Belirtileri:**
- `// TODO: gecici, sonra duzeltilecek` yorumuyla kural bypass'i
- Override ADR'sinde son tarih belirtilmemesi
- Sureli override'in son tarihi gecmesine ragmen geri alinmamasi

**Neden anti-pattern:** "Gecici" etiketi kaliciliga donusur, teknik borc gorunmez birikir.

## 10.3. Fork-and-Forget

**Tanim:** Boilerplate'ten fork edip boundary contract'i tamamen yok sayma.

**Belirtileri:**
- BOUNDARY.md dosyasinin olmamasi
- Boilerplate ADR'lerinin read-only kopyasinin tutulmamasi
- Proje ADR'lerinde boilerplate catisma kontrolu yapilmamasi
- Audit'te boundary contract kalemlerinin atlanmasi

**Neden anti-pattern:** Derived project zamanla boilerplate ile baglantisini kaybeder, iki bagimsiz ve uyumsuz sistem olusur.

## 10.4. Yukari Dogru Bask (Upstream Pressure)

**Tanim:** Derived project ihtiyaclarini boilerplate'e override talebi yerine dogrudan degisiklik olarak itme.

**Belirtileri:**
- Proje-ozel bir ihtiyac icin boilerplate ADR'sinin degistirilmesi
- Tek bir derived project'in ihtiyacini tum boilerplate ekosistemine dayatma
- Boilerplate kuralinin tek proje lehine gevsetilmesi

**Neden anti-pattern:** Boilerplate tum derived project'lerin ortak paydasi olmalidir, tek projenin ihtiyacina gore sekillenmemelidir.

## 10.5. Katman Atlama

**Tanim:** Felsefi miras alanindaki esnekligi zorunlu miras alanina tasima.

**Belirtileri:**
- "Biz prensipleri farkli yorumluyoruz" gerekçesiyle canonical stack'i degistirme
- "Prensibin ruhuna uygun" savunmasiyla dependency policy'yi bypass etme
- Felsefi esnekligi teknik override icin kullanma

**Neden anti-pattern:** Miras tipleri birbirinden bagamsiz katmanlardir. Bir katmanin esnekligi baska katmanin kuralini gevsetmez.

---

# 11. Boilerplate Guncelleme Yayilimi

Boilerplate guncellendiginde derived project'lere yayilim su kurallarla yonetilir:

## 11.1. Zorunlu Miras Guncellemeleri

- Derived project'lere zorunlu olarak yansitilir.
- Yansitma suresi: Boilerplate release'inden itibaren 2 sprint (maximum 4 hafta).
- Yansitilmayan derived project audit'te blocker alir.

## 11.2. Yapisal Miras Guncellemeleri

- Derived project'lere onerilerek yansitilir.
- Proje-ozel icerik etkilenmez, yalnizca yapisal degisiklikler uygulanir.
- Yansitma suresi: 4 sprint (maximum 8 hafta).

## 11.3. Felsefi Miras Guncellemeleri

- Derived project'lere bilgilendirme olarak iletilir.
- Proje-ozel yorum guncellenmesi projenin insiyatifindedir.
- Zorunlu yansitma suresi yoktur, ancak audit'te celiski kontrolu yapilir.

---

# 12. Karar Agaci

Derived project'te bir kural degisikligi yapilmak istendiginde su karar agaci izlenir:

```
Degistirmek istedigim kural hangi miras tipine ait?
|
+-- Zorunlu miras
|   |
|   +-- Sikilastirma mi? --> Serbest, dogrudan uygula
|   +-- Gevsetme/kaldirma/degistirme mi? --> Override talebi ac (bolum 7)
|       |
|       +-- Override onaylandi mi?
|           +-- Evet --> Override ADR yaz, CI'da isaretle, BOUNDARY.md guncelle
|           +-- Hayir --> Kural oldugu gibi kalir
|
+-- Yapisal miras
|   |
|   +-- Ek convention/madde/rule ekleme mi? --> Serbest, dogrudan uygula
|   +-- Base convention/madde/rule kaldirma mi? --> Override talebi ac
|   +-- Sikilastirma mi? --> Serbest, dogrudan uygula
|   +-- Gevsetme mi? --> Override talebi ac
|
+-- Felsefi miras
    |
    +-- Proje-ozel yorum mu? --> Serbest, prensiple celismedigini dogrula
    +-- Prensiple celisen degisiklik mi? --> Yasak, override bile mümkün degil
```

---

# 13. Sorumluluk Matrisi

| Rol | Sorumluluk |
|---|---|
| Derived project tech lead | Override talebi acma, proje ADR'leri yazma, BOUNDARY.md guncelleme |
| Boilerplate maintainer | Override talebi degerlendirme, zorunlu miras guncellemelerini yayma |
| Audit gorevlisi | Boundary contract uyum denetimi, severity atama, rapor yazma |
| CI pipeline | Otomatik boundary check, override suresi kontrolu, BOUNDARY.md dogrulama |

---

# 14. Onay Kriterleri

Bu belge asagidaki kosullar saglandiginda uygulamaya hazir kabul edilir:

- [ ] Uc miras tipi (zorunlu, yapisal, felsefi) tanimlanmis ve orneklendirilmistir
- [ ] Kural kaynagi x miras tipi x override izni tablosu eksiksiz doldurulmustur
- [ ] Override sureci adimlari net olarak tanimlanmistir
- [ ] Acil override mekanizmasi ve 48 saat kurali belirtilmistir
- [ ] Derived project ADR yapisi ve catismazlik kurali aciklanmistir
- [ ] Audit entegrasyonu (4 denetim katmani) tanimlanmistir
- [ ] Severity modeli (blocker → minor) olusturulmustur
- [ ] Anti-pattern listesi en az 5 madde icermektedir
- [ ] Karar agaci derived project ekipleri tarafindan izlenebilir niteliktedir
- [ ] BOUNDARY.md manifest formati orneklendirilmistir
- [ ] Boilerplate guncelleme yayilim kurallari (miras tipine gore sureler) belirlenmistir
- [ ] `31-audit-checklist.md`'ye ek denetim katmanlari olarak entegre edilebilir niteliktedir
- [ ] `35-document-map.md`'de bu belgenin yeri isaretlenmistir
- [ ] `43-derived-project-creation-guide.md` ile uyumlu ve referans verilebilir yapidadir
