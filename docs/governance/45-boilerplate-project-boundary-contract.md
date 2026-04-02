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
| 1 | ADR-001 → ADR-019 (canonical stack) | Zorunlu miras | Override yasak, sadece ADR revision ile | Teknoloji secimi, mimari omurga, testing/styling/state/data/auth/i18n/navigation kararlari degistirilemez |
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
| 15 | `docs/ai-guardrails/domain/` (AI domain guardrail ailesi) | Zorunlu miras | Ek guardrail eklenebilir, base kaldirilmaz/gevsetilemez | Domain guardrail dokümanlari derived project'e aktarilir. Proje ek domain guardrail yazabilir (GP-XXX formati) ama base guardrail'leri gevsetemez |
| 16 | `docs/ai-guardrails/activity/` (AI aktivite guardrail ailesi) | Yapisal miras | Proje ek aktivite ekleyebilir, base kaldirilamaz | Aktivite guardrail'leri base olarak gecerli. Proje-ozel aktiviteler eklenebilir |
| 17 | CLAUDE.md guardrail protokolü | Zorunlu miras | Protokol kaldirilamaz, genisletilebilir | Guardrail aktivasyon tablosu ve protokol derived project CLAUDE.md'sine zorunlu olarak aktarilir |
| 18 | `.claude/skills/` (guardrail skill'leri) | Yapisal miras | Proje ek skill ekleyebilir, base skill kaldirilamaz | Guardrail skill dosyalari derived project'e aktarilir |
| 19 | `.claude/settings.json` (hook tanimlari) | Yapisal miras | Proje ek hook ekleyebilir, base hook devre disi birakilamaz | PreToolUse/PostToolUse guardrail hook'lari korunur |
| 20 | AGENTS.md guardrail bolumleri | Zorunlu miras | Ek kural eklenebilir, base kaldirilamaz | Guardrail compliance review kurallari derived project'te gecerli |

## 4.1. Gevsetme Siniri Matrisi

Yukaridaki tablo her kuralin miras tipini ve override iznini gosterir, ancak **her kural alani icin gevsetme sinirinin nerede basladigi ve nerede bittigi** belirsiz kalabilir. Bu alt bolum, kural alanlarini "ne kadar esneklik var, sinir nedir" perspektifinden detaylandirir.

**Terminoloji:**

- **%0 — override yasak:** Kural hicbir kosulda degistirilemez; yalnizca boilerplate ADR revision ile mumkundur.
- **%0 — sadece sikilastirabilir:** Kural gevsetilemez veya kaldirilamaz, ancak daha siki hale getirilebilir.
- **Daraltilabilir:** Ek kural/convention/madde eklenebilir, mevcut cikarilmaz. Yapi korunur, kapsam genisletilebilir.
- **Uyarlanabilir:** Temel model ve prensip korunmak kaydiyla, proje-ozel uygulama detaylari proje tarafindan belirlenebilir.

| # | Kural Alani | Kaynak Dokuman | Miras Turu | Gevsetme Izni | Sikilastirma Izni | Sinir Aciklamasi |
|---|---|---|---|---|---|---|
| 1 | Canonical stack (teknoloji secimi) | ADR-001 → ADR-019, 36 | Zorunlu | %0 — override yasak | Uygulanamaz | Teknoloji secimleri (React, Expo, Zustand, TanStack Query, Zod, Tailwind, Vitest, Sentry vb.) hicbir kosulda degistirilemez. Alternatif onerme, degerlendirme veya deneme yasaktir. Degisiklik yalnizca boilerplate ADR revision sureci ile mumkundur. |
| 2 | Dependency policy (base kurallar) | 37-dependency-policy.md | Zorunlu | %0 — override yasak | Daraltilabilir | Base paket ekleme/cikarma kurallari, minimumReleaseAge, allowBuilds, trustPolicy degistirilemez. Proje ek kategorik kisitlama ekleyebilir (ornegin "analytics kategorisinde sadece X kullanilir") ama base policy'nin hicbir maddesi gevsetilemez veya kaldirilmaz. |
| 3 | Compatibility matrix (base satirlar) | 38-version-compatibility-matrix.md | Zorunlu | %0 — override yasak | Daraltilabilir | Boilerplate tarafindan tanimlanan versiyon bantlari (orn. Expo SDK 55.x ↔ React Native 0.79.x) degistirilemez. Proje ek dependency icin yeni satir ekleyebilir, mevcut satirlari daraltabilir (bant daralir), ama mevcut bantlari genisletemez veya kaldiramaz. |
| 4 | WCAG AA accessibility baseline | 12-accessibility-standard.md | Zorunlu | %0 — sadece sikilastirabilir | AAA'ya yukseltilebilir | WCAG AA minimum esiktir; AA altina dusurme, AA kriterlerinden herhangi birini atlama veya "proje-ozel istisna" ilan etme yasaktir. Proje WCAG AAA hedefleyebilir, ek accessibility standartlari (ornegin platforma ozel VoiceOver/TalkBack testleri) ekleyebilir. |
| 5 | Security baseline | 27-security-and-secrets-baseline.md | Zorunlu | %0 — sadece sikilastirabilir | Ek guvenlik kurali eklenebilir | Mevcut guvenlik kurallari (secret yonetimi, auth token politikasi, Sentry payload hassasiyet kurallari, .env korumasi) gevsetilemez veya kaldirilmaz. Proje ek guvenlik katmani ekleyebilir (ornegin ek encryption, daha siki CSP, ek penetrasyon testi gereksinimleri). |
| 6 | Design token naming convention | 22-design-tokens-spec.md | Yapisal | Daraltilabilir | Ek prefix/suffix eklenebilir | raw → semantic → component katman hiyerarsisi ve mevcut naming convention (ornegin `color-primary-500`, `spacing-md`) degistirilemez. Proje ek prefix/suffix ekleyebilir (ornegin `brand-color-primary-500`), ek token kategorisi tanimlayabilir, ama mevcut convention'i rename edemez veya katman sirasini bozamaz. |
| 7 | Component governance (naming, lifecycle) | 23-component-governance-rules.md | Yapisal | Daraltilabilir | Ek governance kurali eklenebilir | Component acma kriterleri, lifecycle adimlari (proposal → draft → stable → deprecated), API disiplini ve naming convention base olarak gecerlidir. Proje ek lifecycle adimi (ornegin "compliance-review" adimi), ek naming convention (ornegin proje prefix'i) ekleyebilir ama mevcut adimlari cikaramaz veya gevsetemez. |
| 8 | Testing strategy (coverage esikleri) | 14-testing-strategy.md, ADR-008 | Yapisal | Daraltilabilir | Ek test turu eklenebilir, esikler yukseltilebilir | Mevcut coverage esikleri (orn. %80 unit, %70 integration) dusurulemez. Test framework secimleri (Vitest/Jest/Playwright) canonical stack oldugu icin degistirilemez. Proje ek test turu (orn. visual regression, contract test, chaos test) ekleyebilir, mevcut esikleri yukseltebilir (orn. %80 → %90). |
| 9 | Branching strategy | 42-branching-and-merge-strategy.md | Yapisal | Uyarlanabilir | Ek branch tipi eklenebilir | Trunk-based development modeli korunmalidir; long-lived feature branch, GitFlow veya benzeri modele gecis yasaktir. Branch naming convention (feature/, fix/, hotfix/, release/, chore/) base olarak gecerlidir. Proje ek branch tipi ekleyebilir (ornegin experiment/, spike/), merge strategy detaylarini uyarlayabilir, ama trunk-based modeli terk edemez. |
| 10 | CI quality gates | 15-quality-gates-and-ci-rules.md | Yapisal | Daraltilabilir | Gate eklenebilir, esikler yukseltilebilir | Mevcut gate'ler (type-check, lint, unit test, build validation, a11y check) kaldirilmaz veya gevsetilmez. Proje ek gate ekleyebilir (ornegin security scan, bundle size check, license audit). Mevcut gate'lerin esikleri yalnizca yukari dogru (daha siki) degistirilebilir. |
| 11 | i18n baseline | ADR-011 | Yapisal | Daraltilabilir | Ek locale ve namespace eklenebilir | i18next framework secimi canonical'dir (degistirilemez). Namespace-based yaklasim korunmalidir; flat key yapisi veya namespace'siz yaklasima gecis yasaktir. Proje ek locale ekleyebilir, ek namespace tanimlayabilir, fallback stratejisini daraltabilir (daha siki), ama mevcut namespace yapisini bozamaz veya base locale destegini kaldiramaz. |
| 12 | Observability baseline | ADR-009 | Yapisal | Daraltilabilir | Ek metric/alert eklenebilir | Sentry entegrasyonu canonical'dir (kaldirilmaz, devre disi birakilmaz). Vendor-agnostic analytics abstraction katmani korunmalidir. Proje ek observability araci ekleyebilir (ornegin custom dashboard, ek APM), ek metric ve alert tanimlayabilir, ama Sentry baseline'ini kaldiramaz veya analytics abstraction katmanini bypass edemez. |

> **Not:** Bu matristeki "override yasak" ifadesi, degisikligin mumkun olmadigi anlamina gelmez. Degisiklik yalnizca **boilerplate ADR revision sureci** ile yapilabilir (bkz. bolum 7.2). Derived project tek basina override uygulayamaz.

---

# 5. Derived Project'in Kendi ADR'lerini Yazma Politikasi

## 5.1. Hak

Derived project kendi ADR'lerini yazma hakkina sahiptir. Bu hak sinirlanmaz.

## 5.2. Yapi

Derived project ADR'leri su dizin yapisinda tutulur:

```
project-root/
  docs/
    adr/                # boilerplate ADR'leri (read-only reference set)
      ADR-001-*.md
      ADR-002-*.md
      ...
  project/
    adr/                # proje-özel ADR'ler
      PROJECT-ADR-001-*.md
      PROJECT-ADR-002-*.md
      ...
```

**Kurallar:**

- Proje ADR'leri `PROJECT-ADR-` on ekiyle baslar. Boilerplate ADR'leri ile numara catismasi onlenir.
- Boilerplate ADR dosyalari `docs/adr/` altinda read-only olarak tutulur. Degisiklik yapilmaz.
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

Her derived project root dizininde bir `BOUNDARY.md` dosyasi bulundurur. Bu dosya boilerplate doküman arşivinin parçası değil, türetilen projenin bootstrap çıktısıdır:

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

Boilerplate guncellendiginde derived project'lere yayilim su kurallarla yonetilir.

**Implementasyon:** Bu bolumun tam implementasyonu `49-upstream-sync-strategy.md`'de tanimlanmistir. Versiyonlama (bp-v tag sistemi), sync manifest, sync script, drift detection CI job'u ve bildirim workflow'u bu belgeye referansla calisir.

## 11.1. Zorunlu Miras Guncellemeleri

- Derived project'lere zorunlu olarak yansitilir.
- Yansitma suresi: Boilerplate release'inden itibaren 2 sprint (maximum 4 hafta).
- Yansitilmayan derived project audit'te blocker alir.
- **Tag mapping:** `bp-v` tag'inde MAJOR versiyon artisi (bkz. `49-upstream-sync-strategy.md` Bolum 3)

## 11.2. Yapisal Miras Guncellemeleri

- Derived project'lere onerilerek yansitilir.
- Proje-ozel icerik etkilenmez, yalnizca yapisal degisiklikler uygulanir.
- Yansitma suresi: 4 sprint (maximum 8 hafta).
- **Tag mapping:** `bp-v` tag'inde MINOR versiyon artisi

## 11.3. Felsefi Miras Guncellemeleri

- Derived project'lere bilgilendirme olarak iletilir.
- Proje-ozel yorum guncellenmesi projenin insiyatifindedir.
- Zorunlu yansitma suresi yoktur, ancak audit'te celiski kontrolu yapilir.
- **Tag mapping:** `bp-v` tag'inde PATCH versiyon artisi

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

---

# 15. BOUNDARY.md Otomatik Güncelleme (2026-04-02 Eki)

Bu bölüm, derived project'lerdeki BOUNDARY.md dosyasının güncelliğini sağlayan otomatik kontrol mekanizmasını tanımlar.

## 15.1. Haftalık CI Job

Haftalık çalışan CI job aşağıdaki kontrolleri yapar:

| Kontrol | Açıklama | Başarısızlık Aksiyonu |
|---------|----------|----------------------|
| BOUNDARY.md mevcut mu | Derived project kökünde dosya varlığı | P0 uyarı issue aç |
| Zorunlu kurallar geçerli mi | Zorunlu miras kurallarının BOUNDARY.md'de listelendiği | P0 uyarı issue aç |
| Son güncelleme tarihi | BOUNDARY.md'nin son güncelleme tarihi | 90 gün aşıldıysa uyarı issue aç |
| Upstream hash karşılaştırma | Boilerplate'in güncel commit hash'i ile BOUNDARY.md'deki hash | Farklılık varsa "boundary-sync" etiketli issue aç |

## 15.2. Upstream Hash Karşılaştırma

- BOUNDARY.md dosyasında `boilerplate_upstream_hash` alanı tutulur.
- Bu alan, derived project'in en son senkronize olduğu boilerplate commit hash'idir.
- CI job, boilerplate'in güncel main hash'i ile bu değeri karşılaştırır.
- Farklılık varsa:
  - Uyarı seviyeli issue açılır.
  - Issue, değişen dosyaların listesini ve etki analizini içerir.
  - Zorunlu miras kuralı değişikliği varsa severity P0, yapısal miras ise P1.

## 15.3. BOUNDARY.md Minimum İçeriği

```markdown
# BOUNDARY.md
<!-- boilerplate_upstream_hash: abc123def456 -->
<!-- last_sync_date: 2026-04-02 -->

## Zorunlu Miras Kuralları
- [ ] TypeScript strict mode aktif
- [ ] ESLint canonical rules uygulanıyor
- [ ] Canonical stack kullanılıyor
- [ ] Import yönü kuralları korunuyor

## Yapısal Miras Kuralları
- [ ] Test coverage eşiği: ...%
- [ ] Design token kullanımı: semantic-only

## Override Kayıtları
(Override ADR referansları)
```

---

# 16. Boundary İhlal Raporu (2026-04-02 Eki)

Bu bölüm, derived project'lerdeki boundary ihlallerinin tespiti ve raporlanması için kontrol matrisini tanımlar.

## 16.1. Kontrol Matrisi

| Alan | Kontrol | İhlal Tipi | Severity | Kontrol Yöntemi |
|------|---------|-----------|----------|----------------|
| TS strict | `tsconfig.json` strict:true | Zorunlu | P0 — Blocker | CI: tsconfig parse |
| Lint | ESLint canonical rules aktif | Zorunlu | P0 — Blocker | CI: eslint config doğrulama |
| Coverage eşik | Minimum test coverage karşılanıyor | Yapısal | P1 — Major | CI: coverage raporu |
| Yasaklı dep | dependency policy ihlali | Zorunlu | P0 — Blocker | CI: dependency scan |
| Dizin yapısı | Canonical dizin yapısına uyum | Yapısal | P1 — Major | CI: dizin yapısı kontrolü |
| Token kullanım | Hardcoded değer yok, semantic token zorunlu | Yapısal | P1 — Major | CI: grep/lint |
| Import yönü | packages → apps import yok | Zorunlu | P0 — Blocker | CI: import analizi |
| i18n | Inline user-facing string yok | Yapısal | P1 — Major | CI: lint rule |

## 16.2. Severity Kuralları

- **Zorunlu miras ihlali = P0 (Blocker):** CI'ı bloklar, merge yapılamaz. Düzeltme veya onaylı override gerekir.
- **Yapısal miras ihlali = P1 (Major):** CI uyarı verir, sprint içinde çözülmelidir. Override ile gevşetilemez, yalnızca sıkılaştırılabilir.

## 16.3. Rapor Formatı

CI çıktısında boundary ihlal raporu aşağıdaki formatta sunulur:

```
=== BOUNDARY İHLAL RAPORU ===
Tarih: 2026-04-02
Proje: derived-project-x

[P0] TS strict: tsconfig.json strict:false → ZOR UNLU
[P1] Coverage: %62 (minimum %70) → YAPISAL
[PASS] Lint: ESLint canonical rules aktif
[PASS] Import yönü: İhlal yok
===
Toplam: 1 P0, 1 P1, 2 PASS
Sonuç: BLOK — P0 ihlal mevcut
```
