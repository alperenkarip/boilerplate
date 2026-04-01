# 44-exception-and-exemption-policy.md

## Doküman Kimliği

- **Doküman adı:** Exception and Exemption Policy
- **Dosya adı:** `44-exception-and-exemption-policy.md`
- **Doküman türü:** Governance / exception management policy
- **Durum:** Accepted
- **Tarih:** 2026-04-01
- **Kapsam:** Bu belge, proje genelinde kural ve standartlardan geçici (exception) veya kalıcı (exemption) sapmaların nasıl tanımlanacağını, kayıt altına alınacağını, onaylanacağını, izleneceğini ve yaşam döngüsü boyunca yönetileceğini tanımlar. Tracking formatını, approval workflow'unu, budget mekanizmasını ve CI entegrasyonunu kapsar.
- **Bağlı olduğu üst dokümanlar:**
  - `31-audit-checklist.md`
  - `16-tooling-and-governance.md`
  - `15-quality-gates-and-ci-rules.md`
- **Doğrudan etkileyeceği dokümanlar:**
  - `35-document-map.md`
  - `30-contribution-guide.md`

---

# 1. Amaç

Bu belgenin amacı, kural sapmalarının:

- **görünür** olmasını,
- **izlenebilir** olmasını,
- **süreli** olmasını,
- **gerekçelendirilmiş** olmasını,
- **onaylanmış** olmasını

sağlayan resmi mekanizmayı tanımlamaktır.

`16-tooling-and-governance.md` exception governance'ı kavramsal düzeyde tanımlar.
`15-quality-gates-and-ci-rules.md` exception kaydında olması gereken bilgileri listeler.
Bu belge ise her iki dokümanın öngördüğü exception yönetimini **operasyonel tracking formatı, onay akışı, budget sistemi ve yaşam döngüsü** olarak somutlaştırır.

---

# 2. Temel Tez

> Yönetilmeyen istisna, teknik borçtur. Birikmiş teknik borç, kural sisteminin güvenilirliğini yok eder.

Bu tez şu sonuçları doğurur:

1. İstisna her zaman olacaktır; hiçbir kural sistemi %100 uyumla yaşamaz.
2. İstisnanın varlığı değil, görünmezliği tehlikelidir.
3. Her istisna bir maliyettir; bu maliyet bilinçli olarak kabul edilmelidir.
4. Kontrolsüz istisna yığılması, kural sisteminin tümünü geçersiz kılar.
5. İstisna yönetimi, kural sisteminin kalitesinin doğrudan göstergesidir.

---

# 3. Exception vs Exemption Tanımı

## 3.1. Exception (Geçici Sapma)

- Belirli bir kuraldan **geçici** olarak ayrılma.
- Süresi vardır; `expiry` tarihi zorunludur.
- Süre dolduğunda otomatik olarak sona erer.
- Süre sonunda ya çözülmüş olmalı ya da uzatma/exemption dönüşümü yapılmalıdır.
- Uzatma en fazla **1 kez** yapılabilir.

## 3.2. Exemption (Kalıcı Sapma)

- Belirli bir kuraldan **kalıcı** olarak ayrılma.
- Gerekçesi exception'dan daha güçlü olmalıdır.
- `expiry` tarihi yoktur, ancak **periyodik review** zorunludur (varsayılan: 6 ayda bir).
- Review'da hâlâ geçerli olduğu teyit edilmezse kapatılır.
- Her exemption, açılışında en az tech lead onayı gerektirir.

## 3.3. Kritik Fark

| Özellik | Exception | Exemption |
|---|---|---|
| Süre | Süreli, max 60 gün | Kalıcı, periyodik review |
| Uzatma | Max 1 kez | Review ile devam |
| Onay | Severity'ye göre değişir | Her zaman tech lead+ |
| Kapanış | Otomatik (süre sonu) | Review sonucu karar |
| Amaç | Geçici köprü | Bilinen kabul edilmiş sapma |

---

# 4. Exception Kayıt Formatı

Tüm exception ve exemption kayıtları YAML formatında tutulur.

## 4.1. Exception YAML Şablonu

```yaml
id: EXC-001
type: exception
rule: no-hardcoded-colors
file: apps/web/src/components/LegacyBanner.tsx
reason: "Üçüncü parti widget renkleri, token sisteme geçirilene kadar"
severity: minor
created: 2026-04-01
expiry: 2026-06-01
approver: tech-lead
ticket: PROJ-123
status: active
```

## 4.2. Exemption YAML Şablonu

```yaml
id: EXP-001
type: exemption
rule: boundary-no-cross-import
file: packages/legacy-adapter/src/bridge.ts
reason: "Legacy sistem entegrasyonu, adapter katmanı boundary dışından erişim gerektiriyor"
severity: major
created: 2026-04-01
expiry: null
review_interval: 6months
next_review: 2026-10-01
approver: tech-lead
ticket: PROJ-456
adr: ADR-007
status: active
```

## 4.3. Alan Açıklamaları

- `id` (zorunlu): Benzersiz tanımlayıcı. Exception: `EXC-NNN`, Exemption: `EXP-NNN`
- `type` (zorunlu): `exception` veya `exemption`
- `rule` (zorunlu): İhlal edilen kural adı
- `file` (zorunlu): Etkilenen dosya veya dizin yolu
- `reason` (zorunlu): Sapma gerekçesi; tek cümle yetmez, bağlam verilmeli
- `severity` (zorunlu): `minor`, `major` veya `blocker`
- `created` (zorunlu): Oluşturulma tarihi (YYYY-MM-DD)
- `expiry` (exception: zorunlu): Sona erme tarihi; exemption için `null`
- `review_interval` / `next_review` (exemption: zorunlu): Periyodik review sıklığı ve tarihi
- `approver` (zorunlu): Onay veren kişi/rol
- `ticket` (major/blocker: zorunlu): İlgili issue/ticket referansı
- `adr` (varsa): İlgili ADR referansı
- `status` (zorunlu): `active`, `expired`, `closed`, `extended`

---

# 5. Severity Sınıflandırması

Exception/exemption severity'si, ihlal edilen kuralın etkisine göre belirlenir.
`31-audit-checklist.md` Bölüm 4'teki severity modeli ile uyumludur.

- **Minor:** Kod kalitesini düşürür ama sistemi bozmaz. Risk düşük ve izole. Örnek: tek dosyada lint disable.
- **Major:** Sürdürülebilirlik, boundary veya design system otoritesini zayıflatır. Yayılma potansiyeli var. Örnek: boundary ihlali, DS dışı styling.
- **Blocker:** Canonical stack, security, a11y veya mimari bütünlüğü doğrudan tehdit eder. Acil çözüm gerektirir. Örnek: canonical stack dışı araç, auth token exposure.

---

# 6. Approval Workflow

| Severity | Onay | Gereksinim | Süre limiti |
|---|---|---|---|
| Minor | PR reviewer | YAML kaydı | Max 30 gün |
| Major | Tech lead | YAML + ticket | Exception max 60 gün, exemption periyodik review |
| Blocker | Mimari toplantı + ADR | YAML + ticket + ADR | Exception max 30 gün, exemption ancak ADR ile |

## 6.1. Workflow Özeti

```
Minor:   Geliştirici → YAML kaydı → PR reviewer onayı → Merge
Major:   Geliştirici → YAML + ticket → Tech lead onayı → Merge
Blocker: Geliştirici → YAML + ticket → Mimari toplantı → ADR değerlendirmesi → Merge
```

---

# 7. Exception Budget

## 7.1. Neden budget gerekir?

`15-quality-gates-and-ci-rules.md` warning budget kavramını tanımlar.
Exception budget aynı mantığı istisnalara uygular:
sınırsız istisna, kural sistemini geçersiz kılar.

## 7.2. Budget limitleri

| Kategori | Aktif exception limiti | Aktif exemption limiti |
|---|---|---|
| Proje geneli (toplam) | 20 | 10 |
| Tek uygulama (app) | 10 | 5 |
| Tek paket (package) | 5 | 3 |

## 7.3. Budget kuralları

1. Budget aşıldığında yeni exception/exemption açılamaz.
2. Yeni istisna açabilmek için önce mevcut bir istisna kapatılmalı veya çözülmelidir.
3. Budget limitleri proje olgunluğuna göre revize edilebilir, ancak revizyon ADR veya governance kararı gerektirir.
4. CI, budget durumunu her PR'da raporlamalıdır.

## 7.4. Budget aşım prosedürü

Budget dolu olduğunda: (1) mevcut liste gözden geçirilir, (2) süresi dolmuş/çözülmüş kayıtlar kapatılır, (3) hâlâ yer yoksa en düşük öncelikli istisna çözüme zorlanır. Acil durumlarda tech lead geçici budget+1 onayı verebilir; bu bir sonraki sprint'te çözülmelidir.

---

# 8. Tracking Mekanizması

## 8.1. Dizin yapısı

Tüm exception ve exemption kayıtları proje kökündeki `exceptions/` dizini altında tutulur.

```
exceptions/
  EXC-001.yaml
  EXC-002.yaml
  EXP-001.yaml
  EXP-002.yaml
```

Her dosya tek bir kayıt içerir. Dosya adı, kayıt ID'si ile aynıdır.

## 8.2. CI entegrasyonu

CI pipeline'ında exception tracking için aşağıdaki kontroller çalışmalıdır:

1. **Süre dolum kontrolü:** Süresi dolmuş exception'lar warning, 7+ gün geçmişler error. Her PR ve scheduled pipeline'da çalışır.
2. **Budget kontrolü:** Aktif sayı budget'a karşı kontrol edilir. Aşım warning, %90 doluluk info.
3. **Format doğrulama:** YAML şema uyumu kontrol edilir. Zorunlu alan eksikliği error.
4. **Orphan kontrolü:** `file` alanındaki dosya artık mevcut değilse warning. Kural mevcut değilse info.

## 8.3. Scheduled audit

Haftalık veya sprint bazlı scheduled pipeline'da:

1. Tüm aktif exception'ların süre durumu kontrol edilir.
2. Exemption'ların `next_review` tarihleri kontrol edilir.
3. Budget doluluk oranı raporlanır.
4. Trend raporu üretilir: yeni açılan, kapatılan, uzatılan istisna sayıları.

Bu çıktılar `16-tooling-and-governance.md` scheduled tooling bölümündeki stale exception raporları ile uyumludur.

---

# 9. Exception Lifecycle

## 9.1. Yaşam döngüsü diyagramı

```
Açılış → Aktif → Süresi Dolmuş → Kapatılmış
                ↘ Uzatılmış (max 1 kez) → Süresi Dolmuş → Kapatılmış / Exemption'a Dönüşüm
```

## 9.2. Durum geçişleri

- **Açılış → Aktif:** YAML kaydı oluşturulur, gerekli onay alınır, `status: active`.
- **Aktif → Süresi Dolmuş:** `expiry` tarihine ulaşılır, CI tespit eder ve raporlar.
- **Süresi Dolmuş → Kapatılmış:** İhlal giderilmiştir; `status: closed`, kapanış tarihi ve çözüm notu eklenir.
- **Süresi Dolmuş → Uzatılmış:** Max 1 kez, uzatma süresi orijinal süreden fazla olamaz, `status: extended`, gerekçe eklenir.
- **Uzatılmış → Kapatılmış:** Uzatılmış süre içinde çözülmüştür.
- **Uzatılmış → Exemption'a Dönüşüm:** Çözüm hâlâ mümkün değilse yeni `EXP-NNN` kaydı açılır, eski kayıt kapatılıp referans eklenir. Exemption kendi onay kurallarına tabidir (bkz. Bölüm 6).

## 9.3. Exemption yaşam döngüsü

```
Açılış → Aktif → Review → Devam / Kapatılmış
```

- Her `next_review` tarihinde review yapılır.
- Review sonucunda exemption hâlâ geçerliyse `next_review` güncellenir.
- Artık gerekli değilse `status: closed` olarak kapatılır.

---

# 10. Anti-Pattern'ler

Aşağıdaki davranışlar exception yönetiminde kabul edilemez:

## 10.1. Exception'ı belgesiz bırakmak

`eslint-disable` yorumu koymak ama YAML kaydı oluşturmamak.
Kod içinde inline suppress varsa `exceptions/` dizininde karşılığı olmalıdır.

## 10.2. Süresi dolmuş exception'ı ignore etmek

CI uyarısını görmezden gelmek, süresi dolmuş kaydı kapatmadan devam etmek.
Bu davranış, exception sisteminin tamamını güvensiz kılar.

## 10.3. Exception'ı DoD bypass aracı olarak kullanmak

Definition of Done kriterlerini karşılamak yerine exception açarak merge'i hızlandırmak.
Exception, DoD'nin alternatifi değildir; DoD'nin bilinçli ve geçici istisnasıdır.

## 10.4. Budget'ı kalıcı olarak dolu tutmak

Budget sürekli dolu veya doluyken budget artırımı talep etmek.
Bu, istisnaların çözülmediğinin ve teknik borcun biriktiğinin göstergesidir.

## 10.5. Aynı exception'ı tekrar tekrar açmak

Kapatılan exception'ın aynı kural ve dosya için yeniden açılması.
Bu durum, kalıcı bir çözüm yerine döngüsel erteleme yapıldığını gösterir.
3 kez aynı exception açılırsa zorunlu olarak exemption değerlendirmesine alınır.

## 10.6. Gerekçesiz "legacy" bahanesi

"Bu eski kod" demek yeterli gerekçe değildir.
Legacy exception'ın da net kapanış koşulu ve migration planı referansı olmalıdır.

## 10.7. Onay atlamak

Severity'ye uygun onay almadan exception açmak.
PR review'da YAML kaydının onay durumu kontrol edilmelidir.

---

# 11. İlgili Dokümanlarla Entegrasyon

- **`16-tooling-and-governance.md`:** Exception governance kavramı ve istisna türleri Bölüm 20'de tanımlanmıştır. Bu belge, o bölümün operasyonel implementasyonudur.
- **`15-quality-gates-and-ci-rules.md`:** Exception kaydında olması gereken bilgiler Bölüm 25'te listelenmiştir. Bu belge, o listeyi YAML formatına dönüştürür ve CI entegrasyonunu tanımlar.
- **`31-audit-checklist.md`:** Audit sürecinde exception kayıtları kontrol maddesi olarak değerlendirilmelidir: kayıtsız suppress, süresi dolmuş kayıtlar, budget durumu, exemption review'ları.
- **`30-contribution-guide.md`:** Yeni exception açma prosedürünü geliştirici perspektifinden anlatmalıdır.
- **`32-definition-of-done.md`:** DoD kontrol listesinde exception durumu yer almalıdır: YAML kaydı, etki analizi, budget kontrolü.

---

# 12. Onay Kriterleri

Bu belge yeterli kabul edilir eğer:

1. Exception ve exemption ayrımı net tanımlanmışsa,
2. YAML kayıt formatı operasyonel ve kullanılabilir düzeydeyse,
3. Severity sınıflandırması mevcut proje severity modeliyle uyumluysa,
4. Approval workflow severity'ye göre kademeli olarak tanımlanmışsa,
5. Exception budget mekanizması somut limitlerle belirtilmişse,
6. Tracking için dizin yapısı, CI entegrasyonu ve scheduled audit tanımlanmışsa,
7. Exception lifecycle durum geçişleri açıkça modellenmiş ve uzatma/dönüşüm kuralları netse,
8. Anti-pattern'ler somut örneklerle listelenmiş ve neden kabul edilemez olduğu açıklanmışsa,
9. İlgili dokümanlarla (`16`, `15`, `31`, `30`, `32`) entegrasyon noktaları belirtilmişse,
10. Bu belge gerçek exception yönetimi sürecinde referans alınabilecek netlikteyse.

---

# 13. Kısa Sonuç

Bu proje için exception ve exemption yönetimi standardı şudur:

- Her istisna görünür, gerekçeli ve onaylıdır.
- Exception geçicidir; süresi biter, çözülür veya exemption'a dönüşür.
- Exemption kalıcıdır ama periyodik review ile yaşar.
- Budget sistemi, istisna yığılmasını engeller.
- `exceptions/` dizini tek kaynak noktasıdır.
- CI, süre dolumu ve budget aşımını otomatik olarak raporlar.
- Exception yönetimi, kural sisteminin sağlığının doğrudan göstergesidir.

> İstisna yönetilmezse kural yoktur; kural yoksa kalite sistemi yoktur.
