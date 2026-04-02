# 42-branching-and-merge-strategy.md

## Doküman Kimliği

- **Doküman adı:** Branching and Merge Strategy
- **Dosya adı:** `42-branching-and-merge-strategy.md`
- **Doküman türü:** Process / branching policy
- **Durum:** Accepted
- **Tarih:** 2026-04-01
- **Kapsam:** Bu belge, boilerplate monorepo kapsamında Git branching modelini, merge politikasını, release branch yönetimini, hotfix sürecini, branch bazlı CI tetikleme kurallarını ve monorepo özel branching disiplinini tanımlar.
- **Bağlı olduğu üst dokümanlar:**
  - `30-contribution-guide.md`
  - `29-release-and-versioning-rules.md`
  - `15-quality-gates-and-ci-rules.md`
- **Doğrudan etkileyeceği dokümanlar:**
  - `35-document-map.md`
  - `20-initial-implementation-checklist.md`

---

# 1. Amaç

Bu belgenin amacı, branching ve merge sürecini:

- kişisel alışkanlıklara bağlı dallanma,
- uzun ömürlü feature branch'lerde sessiz sapma,
- merge günü kaos,
- "main kırıldı ama düzeltiriz" kültürü

olmaktan çıkarıp;
**kısa ömürlü, CI-uyumlu, review-zorunlu, monorepo-aware ve release-safe branching disiplini** haline getirmektir.

Bu belge şu sorulara net cevap verir:

1. Bu projede hangi branching modeli kullanılır?
2. Branch isimlendirme convention'ı nedir?
3. Merge politikası nedir; squash mı, rebase mı, merge commit mı?
4. Release branch ne zaman açılır, nasıl yönetilir?
5. Hotfix süreci nasıl işler?
6. CI hangi branch'te ne çalıştırır?
7. Monorepo özelinde branching kuralları nelerdir?
8. Hangi branching davranışları doğrudan zayıf ve kabul edilemezdir?

---

# 2. Temel Tez

Bu proje kapsamında temel tez şudur:

> Branching modeli basit, kısa ömürlü ve CI-uyumlu olmalıdır. `main` branch her zaman deployable kalmalıdır. Feature branch'ler kısa ömürlü olmalı, merge öncesinde tüm kalite kapıları geçilmelidir. Karmaşık branching modelleri (GitFlow vb.) monorepo yapısında gereksiz sürtünme yaratır; trunk-based development with short-lived branches bu proje için doğru modeldir.

Bu tez şu sonuçları doğurur:

1. `main` tek gerçek kaynaktır; her zaman yeşil kalır.
2. Feature branch ömrü 2-3 günü aşmamalıdır.
3. Direct push to main yasaktır; her değişiklik PR üzerinden girer.
4. Squash merge varsayılan stratejidir; temiz ve okunabilir commit history sağlar.
5. CI, branch tipine göre farklı seviyelerde çalışır.
6. Release branch yalnızca gerektiğinde açılır; gereksiz yere açılmaz.

---

# 3. Branching Modeli

## 3.1. Model: Trunk-Based Development with Short-Lived Feature Branches

Bu proje trunk-based development modelini benimser. Temel ilkeler:

- **`main` branch** tek trunk'tır. Production-ready kod her zaman buradadır.
- **Feature branch'ler** `main`'den açılır, kısa sürede (1-3 gün) `main`'e geri merge edilir.
- **Release branch'ler** yalnızca release stabilization gerektiğinde açılır.
- **Hotfix branch'ler** production'da kritik sorun olduğunda `main`'den açılır.

## 3.2. Neden Bu Model?

GitFlow gibi karmaşık branching modelleri:

- monorepo'da birden fazla package'ın aynı anda dallanmasıyla yönetilemez karmaşıklık yaratır,
- uzun ömürlü branch'ler merge conflict biriktirir,
- develop/main ayrımı CI pipeline'ını gereksiz karmaşıklaştırır,
- release dalı yönetimi bağımsız package versiyonlamasıyla çelişir.

Trunk-based development:

- `main` her zaman deployable olduğu için CI/CD basit kalır,
- kısa ömürlü branch'ler conflict riskini minimize eder,
- monorepo'da `turbo --filter` ile affected package testi doğal çalışır,
- review süreci kısa ve odaklı kalır.

## 3.3. Branch Tipleri

| Branch tipi | Kaynak | Hedef | Ömür | Açıklama |
|---|---|---|---|---|
| `main` | — | — | Kalıcı | Tek trunk; her zaman deployable |
| `feature/*` | `main` | `main` | 1-3 gün | Yeni özellik geliştirme |
| `fix/*` | `main` | `main` | 1-2 gün | Bug fix |
| `hotfix/*` | `main` | `main` | Saatler | Production kritik düzeltme |
| `release/*` | `main` | `main` | Günler | Release stabilization |
| `chore/*` | `main` | `main` | 1-2 gün | Refactor, dependency update, config vb. |

---

# 4. Branch İsimlendirme Convention'ı

## 4.1. Format

```
<tip>/<kisa-aciklama>
```

## 4.2. Kurallar

- Küçük harf kullanılır.
- Kelimeler tire (`-`) ile ayrılır.
- Açıklama kısa ve anlaşılır olmalıdır (2-5 kelime).
- Türkçe karakter kullanılmaz (`ş`, `ç`, `ğ`, `ü`, `ö`, `ı` yerine ASCII karşılıkları).
- Kişi adı, tarih veya ticket numarası branch adına eklenmez (ticket referansı PR'da verilir).

## 4.3. Örnekler

| Tip | Örnek |
|---|---|
| Feature | `feature/user-profile-screen` |
| Feature | `feature/dark-mode-toggle` |
| Fix | `fix/login-redirect-loop` |
| Fix | `fix/token-expiry-handling` |
| Hotfix | `hotfix/crash-on-launch` |
| Release | `release/v1.0.0` |
| Release | `release/v1.2.0` |
| Chore | `chore/upgrade-react-19` |
| Chore | `chore/eslint-config-cleanup` |

## 4.4. Geçersiz Örnekler

| Geçersiz | Neden |
|---|---|
| `Feature/UserProfile` | Büyük harf kullanımı |
| `fix_login_bug` | Alt çizgi kullanımı |
| `alperen/login-fix` | Kişi adı ile prefix |
| `feature/çok-güzel-özellik` | Türkçe karakter |
| `temp` | Tip prefix'i yok |
| `feature/implement-the-new-user-profile-screen-with-dark-mode-support-and-avatar-upload` | Çok uzun |

---

# 5. Merge Politikası

## 5.1. Varsayılan Strateji: Squash Merge

Bu projede varsayılan merge stratejisi **squash merge**'dir.

Squash merge şu avantajları sağlar:

- `main` history'si temiz ve okunabilir kalır.
- Her PR tek bir commit olarak görünür.
- WIP commit'ler, typo düzeltmeleri, deneme-yanılma commit'leri history'yi kirletmez.
- `git log` ile değişiklik geçmişi PR bazında takip edilebilir.

## 5.2. Merge Commit Kullanılan İstisnalar

Aşağıdaki durumlarda merge commit (no-ff) tercih edilebilir:

- Release branch'ten `main`'e geri merge
- Hotfix branch'ten `main`'e merge (gerektiğinde)

Bu istisnalar merge noktasını history'de görünür kılar.

## 5.3. PR Zorunlulukları

Her merge için PR zorunludur. PR'ın merge edilebilmesi için:

1. **CI gates geçmeli:** Lint, typecheck, test ve build adımları başarılı olmalıdır (`15-quality-gates-and-ci-rules.md` referans).
2. **Review onayı:** En az bir reviewer onayı gereklidir.
3. **Conflict yok:** Base branch ile conflict olmamalıdır.
4. **Branch güncel:** PR branch'i hedef branch'in son haliyle güncel olmalıdır.

## 5.4. Direct Push Yasağı

`main` branch'e direct push kesinlikle yasaktır. Bu kural branch protection rule ile teknik olarak da uygulanır:

- `main` branch'te `Require pull request reviews before merging` aktif olmalıdır.
- `Require status checks to pass before merging` aktif olmalıdır.
- `Include administrators` aktif olmalıdır (admin'ler de kural dışı değildir).
- Force push yasaktır.

---

# 6. Release Branch Yönetimi

## 6.1. Ne Zaman Açılır?

Release branch yalnızca şu durumlarda açılır:

- Planlı bir release öncesinde stabilization dönemi gerektiğinde.
- `main` üzerinde yeni feature geliştirme devam ederken, belirli bir noktanın release'e hazırlanması gerektiğinde.
- Birden fazla package'ın koordineli release gerektirdiği durumlarda.

Release branch gereksiz yere açılmaz. `main` zaten her zaman deployable olduğu için, tek bir PR ile yapılabilecek release'ler için branch açmaya gerek yoktur.

## 6.2. İsimlendirme

```
release/v<major>.<minor>.<patch>
```

Örnek: `release/v1.2.0`

Versiyon numarası `29-release-and-versioning-rules.md` belgesindeki semver kurallarına uyar.

## 6.3. Yaşam Döngüsü

1. `main`'den `release/vX.Y.Z` açılır.
2. Yalnızca bug fix ve stabilization commit'leri alınır. Yeni feature eklenmez.
3. Release branch üzerinde CI full pipeline çalışır.
4. Test ve QA tamamlandığında release tag atılır.
5. Release branch `main`'e merge commit ile geri merge edilir.
6. Release branch silinir.

## 6.4. Cherry-Pick Politikası

Release branch açıldıktan sonra `main`'de yapılan bir fix'in release'e dahil edilmesi gerekiyorsa:

- Fix önce `main`'e merge edilir (normal PR süreci ile).
- Ardından ilgili commit release branch'e cherry-pick edilir.
- Cherry-pick edilen commit'in release branch üzerinde CI'dan geçmesi zorunludur.
- Doğrudan release branch'e feature commit push edilmez.

---

# 7. Hotfix Süreci

## 7.1. Ne Zaman Uygulanır?

Hotfix süreci yalnızca production'da kritik sorun olduğunda uygulanır:

- Uygulama crash'i
- Güvenlik açığı
- Veri kaybı riski
- Kritik iş akışını engelleyen bug

Kosmetik hatalar, minor UI sorunları veya performans iyileştirmeleri hotfix değildir; normal `fix/*` branch süreci ile ele alınır.

## 7.2. Hotfix Akışı

1. `main`'den `hotfix/<kisa-aciklama>` branch'i açılır.
2. Düzeltme yapılır. Düzeltme minimal ve odaklı olmalıdır; ek refactor veya feature eklenmez.
3. PR açılır. Hızlandırılmış review süreci uygulanır (tek reviewer yeterli, review süresi kısaltılır).
4. CI gates geçtikten sonra `main`'e merge edilir.
5. Aktif bir release branch varsa, hotfix commit release branch'e backport (cherry-pick) edilir.
6. Hotfix branch silinir.

## 7.3. Hotfix Review Kuralları

- Review zorunludur; hotfix olması review'ı atlamak için geçerli neden değildir.
- Ancak review süresi kısaltılabilir: reviewer atandıktan sonra 2 saat içinde review beklenir.
- CI gates kısaltılamaz; tüm kalite kapıları geçmelidir.

---

# 8. CI Entegrasyonu

## 8.1. Branch Bazlı CI Trigger Kuralları

CI pipeline branch tipine göre farklı seviyede çalışır:

| Branch tipi | Tetiklenen CI adımları |
|---|---|
| `main` | Full CI: lint + typecheck + test + build + security scan + staging/production deploy |
| `feature/*`, `fix/*`, `chore/*` | Temel CI: lint + typecheck + unit test + affected build |
| `release/*` | Full CI: lint + typecheck + test + build + security scan + staging deploy |
| `hotfix/*` | Full CI: lint + typecheck + test + build + security scan |

## 8.2. PR CI Kuralları

- PR açıldığında CI otomatik tetiklenir.
- PR'a yeni commit push edildiğinde CI yeniden tetiklenir.
- CI başarısız olan PR merge edilemez (`15-quality-gates-and-ci-rules.md` referans).

## 8.3. Main Branch Koruması

`main` branch'e merge sonrası:

- Full CI pipeline çalışır.
- Tüm testler geçmelidir.
- Build başarılı olmalıdır.
- CI başarısız olursa ilgili PR sahibi ve reviewer bilgilendirilir; düzeltme öncelikli olarak ele alınır.

---

# 9. Monorepo Özel Kuralları

## 9.1. Affected Packages Only Testing

Bu proje pnpm workspace + Turborepo yapısında çalışır (`ADR-003` referans). Feature branch'lerde tüm monorepo'yu test etmek gereksiz ve yavaştır. Bu yüzden:

- CI, değişen dosyalara göre etkilenen package'ları tespit eder.
- Yalnızca etkilenen package'lar ve onların bağımlıları test edilir.
- `turbo --filter=...[origin/main]` komutu ile affected package detection yapılır.

## 9.2. Turbo Filter Kullanımı

```bash
# Yalnızca main'den bu yana değişen package'ları test et
pnpm turbo test --filter=...[origin/main]

# Yalnızca değişen package'ları build et
pnpm turbo build --filter=...[origin/main]

# Belirli bir package ve bağımlılarını test et
pnpm turbo test --filter=@project/ui...
```

## 9.3. Cross-Package Değişiklikler

Birden fazla package'ı etkileyen değişikliklerde:

- Tüm etkilenen package'ların testleri geçmelidir.
- PR açıklamasında hangi package'ların etkilendiği belirtilmelidir.
- Shared package değişiklikleri (ör. `packages/ui`, `packages/shared`) daha dikkatli review gerektirir çünkü etki alanı geniştir.

## 9.4. Package Bazlı Branch Stratejisi

Monorepo'da tüm package'lar aynı branch modelini kullanır. Package başına ayrı branch stratejisi uygulanmaz. Bunun nedenleri:

- Branch yönetiminin basit kalması
- CI pipeline'ının tutarlı çalışması
- Review sürecinin standart olması

---

# 10. Anti-Pattern'ler

Aşağıdaki branching davranışları bu projede doğrudan zayıf ve kabul edilemez sayılır:

## 10.1. Uzun Ömürlü Feature Branch

- **Sorun:** 1 haftadan uzun yaşayan feature branch, main'den sapar, merge conflict biriktirir, review zorlaşır.
- **Kural:** Feature branch ömrü 3 günü aşmamalıdır. Büyük özellikler feature flag arkasında küçük PR'lar ile parçalanır.

## 10.2. Direct Push to Main

- **Sorun:** CI ve review bypass edilir, kırık kod main'e girer.
- **Kural:** Branch protection ile teknik olarak engellenir. İstisna yoktur.

## 10.3. Force Push to Shared Branch

- **Sorun:** Diğer geliştiricilerin çalışmasını bozar, history kaybolur.
- **Kural:** `main`, `release/*` branch'lerine force push kesinlikle yasaktır. Feature branch'lerde yalnızca tek kişi çalışıyorsa force push kabul edilebilir.

## 10.4. Merge Commit Karmaşası

- **Sorun:** Gereksiz merge commit'ler history'yi karmaşıklaştırır, `git log` okunmaz hale gelir.
- **Kural:** Squash merge varsayılan stratejidir. Merge commit yalnızca belgelenmiş istisnalarda kullanılır.

## 10.5. Stale Branch Birikimi

- **Sorun:** Merge edilmiş veya terk edilmiş branch'ler repo'da birikerek karmaşa yaratır.
- **Kural:** Merge edilen branch'ler otomatik silinir (GitHub "Automatically delete head branches" ayarı aktif). Terk edilen branch'ler 2 hafta sonra temizlenir.

## 10.6. Feature Branch Üzerinden Feature Branch

- **Sorun:** Bir feature branch'ten başka bir feature branch açmak, bağımlılık zinciri ve merge karmaşası yaratır.
- **Kural:** Tüm feature branch'ler `main`'den açılır. İstisnai durumlarda (bağımlı iş) PR sırası ile main'e sıralı merge tercih edilir.

## 10.7. Release Branch'te Feature Geliştirme

- **Sorun:** Release branch'in amacı stabilization'dır; yeni feature eklenmesi release riskini artırır.
- **Kural:** Release branch'e yalnızca bug fix ve stabilization commit'leri alınır.

## 10.8. Review'sız Hotfix

- **Sorun:** Aciliyet bahanesiyle review atlanması, yeni hata riski yaratır.
- **Kural:** Hotfix'te review zorunludur. Süre kısaltılır ama atlanmaz.

---

# 11. Onay Kriterleri

Bu belge aşağıdaki koşullar sağlandığında onaylı kabul edilir:

1. **Branch protection kuralları uygulandı:** `main` branch'te PR zorunluluğu, status check zorunluluğu ve force push yasağı teknik olarak aktif.
2. **CI pipeline branch-aware çalışıyor:** Branch tipine göre farklı CI adımları tetikleniyor.
3. **İsimlendirme convention'ı uygulanıyor:** Yeni açılan branch'ler `<tip>/<kisa-aciklama>` formatına uyuyor.
4. **Squash merge varsayılan:** Repository merge ayarlarında squash merge varsayılan olarak seçili.
5. **Otomatik branch silme aktif:** Merge edilen branch'ler otomatik siliniyor.
6. **Monorepo filter çalışıyor:** CI'da `turbo --filter` ile affected package detection aktif.
7. **Ekip bilgilendirildi:** Tüm katkıda bulunanlar bu belgeyi okudu ve branching convention'ını benimsedi.
8. **Release ve hotfix süreçleri test edildi:** En az bir release branch ve bir hotfix branch başarıyla açılıp merge edildi.
9. **Anti-pattern'ler tanımlı:** Ekip hangi branching davranışlarının kabul edilemez olduğunu biliyor.

---

# 12. Stacked PR Workflow (2026-04-02 Eki)

Bu bölüm, büyük değişikliklerin bölünerek yönetilmesi için stacked PR (zincirleme PR) workflow'unu tanımlar.

## 12.1. Ne Zaman Kullanılır

- 500+ satır değişiklik içeren PR'lar
- Birden fazla mantıksal commit gerektiren işler
- Farklı reviewer'lar tarafından incelenmesi gereken bağımsız parçalar
- Hem altyapı hem feature değişikliği içeren işler

## 12.2. Araç

- **graphite** (önerilen): Stacked PR yönetimini otomatikleştiren CLI aracı
- **git rebase bazlı** (alternatif): Manuel branch yönetimi ile stacking

## 12.3. Akış

```
main
 └── feature/ISSUE-123-part-1-veritabani-sema (base: main)
      └── feature/ISSUE-123-part-2-api-katmani (base: part-1)
           └── feature/ISSUE-123-part-3-ui-entegrasyonu (base: part-2)
```

- Her PR bağımsız review alır ve bağımsız CI çalıştırır.
- Alt PR merge olunca üst PR'lar otomatik rebase edilir (graphite ile otomatik, manuel workflow'da elle yapılır).
- Her PR'ın kendi başına mantıklı ve test edilebilir olması zorunludur.

## 12.4. Naming Convention

```
feature/ISSUE-XXX-part-N-kisa-aciklama
```

Örnek:
- `feature/ISSUE-123-part-1-veritabani-sema`
- `feature/ISSUE-123-part-2-api-katmani`
- `feature/ISSUE-123-part-3-ui-entegrasyonu`

## 12.5. Kurallar

- Part-1 review almadan part-2 açılabilir, ancak part-2 merge edilmesi part-1'in merge edilmesine bağlıdır.
- Her part PR'ı tek bir mantıksal değişikliğe odaklanır.
- Toplam part sayısı 5'i geçmemelidir; geçiyorsa iş tanımı daraltılmalıdır.
- PR açıklamasında stack dizisi belirtilir: `Stack: part 1/3 → part 2/3 → part 3/3`

---

# 13. Merge Queue Entegrasyonu (2026-04-02 Eki)

Bu bölüm, concurrent merge çakışmalarını önlemek için GitHub merge queue entegrasyonunu tanımlar.

## 13.1. Problem

Birden fazla PR aynı anda merge edilmeye çalışıldığında:
- Son merge edilen PR, önceki merge ile çakışabilir.
- CI tüm PR'lar için ayrı ayrı yeşil gösterse bile, birleşik durumda kırılma olabilir.
- Bu durum özellikle monorepo'larda shared package değişikliklerinde yaşanır.

## 13.2. Çözüm: GitHub Merge Queue

- GitHub repository ayarlarında merge queue aktifleştirilir.
- PR'lar merge queue'ya eklenir; queue sırasıyla her PR'ı main'in güncel haliyle test eder.
- Test başarılıysa merge yapılır, başarısızsa PR queue'dan çıkarılır.

## 13.3. Konfigürasyon

| Ayar | Değer | Gerekçe |
|------|-------|---------|
| Merge method | Squash merge | Temiz history |
| Queue timeout | 60 dakika | Uzun CI süreleri için yeterli |
| Max batch size | 5 | Reasonable throughput |
| Require branches to be up to date | Evet | Stale branch merge koruması |
| Branch protection | Require merge queue | Direct merge engellenir |

## 13.4. Workflow

1. PR review tamamlanır ve approved olur.
2. PR merge queue'ya eklenir ("Merge when ready" butonu).
3. Queue, PR'ı main'in güncel haliyle birleştirerek CI çalıştırır.
4. CI yeşilse merge yapılır, kırmızıysa PR owner bilgilendirilir.
5. Başarısız PR düzeltilip tekrar queue'ya eklenir.

---

# 14. Referanslar

| Belge | İlişki |
|---|---|
| `30-contribution-guide.md` | PR açma, review ve katkı sürecini tanımlar |
| `29-release-and-versioning-rules.md` | Release versioning, changelog ve semver kurallarını tanımlar |
| `15-quality-gates-and-ci-rules.md` | CI kalite kapılarını ve blocker/major/minor ayrımını tanımlar |
| `21-repo-structure-spec.md` | Monorepo topolojisini ve package yapısını tanımlar |
| `ADR-003` | Monorepo, pnpm ve Turborepo kararını tanımlar |
