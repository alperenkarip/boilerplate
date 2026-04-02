# 49-upstream-sync-strategy.md

## Doküman Kimliği

- **Doküman adı:** Upstream Sync Strategy
- **Dosya adı:** `49-upstream-sync-strategy.md`
- **Doküman türü:** Governance / upstream sync / versioning
- **Durum:** Accepted
- **Tarih:** 2026-04-02
- **Kapsam:** Boilerplate değişikliklerinin derived projelere yansıtılma süreci, versiyonlama, sync manifest, sync mekanizması, drift detection ve CI entegrasyonu
- **Bağlı olduğu üst dokümanlar:**
  - `45-boilerplate-project-boundary-contract.md`
  - `43-derived-project-creation-guide.md`
  - `29-release-and-versioning-rules.md`
- **Doğrudan etkileyeceği dokümanlar:**
  - `35-document-map.md`
  - `43-derived-project-creation-guide.md`

---

# 1. Amaç

Bu belge, boilerplate'te yapılan değişikliklerin derived (türetilmiş) projelere **kontrollü, izlenebilir ve otomatik** olarak yansıtılmasını sağlayan upstream sync stratejisini tanımlar.

`45-boilerplate-project-boundary-contract.md` Bölüm 11 güncelleme yayılım sürelerini, Bölüm 15 BOUNDARY.md hash takibini kavramsal olarak tanımlamıştır. Bu belge o kavramların **implementasyon spesifikasyonu**dur: versiyonlama, manifest, script, drift detection ve CI entegrasyonu ile birlikte çalışan eksiksiz bir mekanizma tanımlar.

---

# 2. Temel Tez

> Boilerplate → derived proje akışı tek yönlüdür. Derived proje boilerplate'i değiştiremez (upstream pressure anti-pattern, bkz. 45 Bölüm 10.4). Boilerplate güncellemelerinin derived projelere yansıtılması ise bu belgede tanımlanan mekanizma ile yapılır.

Bu tezin sonuçları:

1. Boilerplate versiyonlanır — her anlamlı değişiklik bir tag ile işaretlenir.
2. Hangi dosyanın nasıl sync edileceği bir manifest dosyasında tanımlanır (source of truth).
3. Derived projede tek bir script ile sync işlemi yapılır.
4. CI'da otomatik drift detection, sapmaları tespit eder ve severity'ye göre uyarır veya bloklar.
5. Boilerplate release'inde derived projelere otomatik bildirim gönderilir.

---

# 3. Versiyonlama Sistemi

## 3.1. Tag Formatı

```
bp-v<MAJOR>.<MINOR>.<PATCH>
```

- `bp-v` prefiksi: "boilerplate version" anlamında. Derived projenin kendi versiyonlarıyla karışmasını önler.
- **MAJOR:** Zorunlu miras kurallarında değişiklik (yeni ADR, ADR revision, canonical stack değişikliği, dependency policy base değişikliği). Derived projeler bu değişikliği **2 sprint** (max 4 hafta) içinde uygulamak zorundadır.
- **MINOR:** Yapısal miras değişikliği (yeni guardrail, governance dokümanı, CI güncellemesi, design system yapısal değişikliği). **4 sprint** (max 8 hafta) içinde uygulanması beklenir.
- **PATCH:** Felsefi miras, typo düzeltmeleri, açıklama iyileştirmeleri. Bilgilendirme amaçlı, zorunlu yansıtma süresi yoktur.

Bu süreler `45-boilerplate-project-boundary-contract.md` Bölüm 11'deki yayılım kurallarıyla birebir eşleşir.

## 3.2. Tag Oluşturma Kuralı

Her tag annotated tag olarak oluşturulur:

```bash
git tag -a bp-v1.1.0 -m "Yapısal: Yeni guardrail D-OFL eklendi, CI drift detection eklendi"
```

Tag mesajında değişiklik kategorisi (Zorunlu/Yapısal/Felsefi) ve kısa açıklama belirtilir.

## 3.3. Başlangıç Versiyonu

Mevcut repo durumu `bp-v1.0.0` olarak etiketlenir. Bu, tüm derived projelerin referans alacağı ilk stable noktadır.

---

# 4. Sync Manifest

## 4.1. Tanım

Sync manifest, hangi dosyanın hangi miras tipinde ve hangi modda sync edileceğini tanımlayan **tek source-of-truth** dosyasıdır. Sync scripti, drift detection CI job'u ve dokümanlar bu dosyayı referans alır.

**Dosya yolu:** `tooling/sync/upstream-sync-manifest.yaml`

## 4.2. Sync Modları

| Mod | Açıklama | Kullanım Alanı |
|-----|----------|----------------|
| `exact` | 3-way merge ile sync edilir. Derived projede değişiklik yoksa birebir kopyalanır; değişiklik varsa otomatik merge denenir, conflict varsa marker bırakılır | ADR'ler, guardrail'ler, governance dokümanları |
| `partial` | Sentinel yorumlarıyla işaretlenmiş bölümler sync edilir, proje-spesifik bölümler korunur | CLAUDE.md, AGENTS.md |
| `adaptive` | 3-way merge + `.sync-config.yaml`'daki değişkenlerle substitution yapılır | CI dosyaları, agent talimatları |

## 4.3. 3-Way Merge Mekanizması

Tüm sync modlarında (partial hariç) 3-way merge kullanılır. Bu, derived projenin yaptığı değişikliklerin korunmasını sağlar.

**3 versiyon:**
- **base:** Derived projenin en son sync ettiği boilerplate versiyonu (BOUNDARY.md'deki eski hash)
- **ours:** Derived projedeki mevcut dosya (proje değişiklikleri dahil)
- **theirs:** Boilerplate'in yeni versiyonu

**Sonuçlar:**

| Durum | Sonuç |
|-------|-------|
| Dosya derived projede hiç değiştirilmemiş | Boilerplate versiyonu olduğu gibi alınır |
| Dosya derived projede değiştirilmiş, boilerplate'te farklı bölümler değişmiş | Otomatik merge — her iki tarafın değişiklikleri birleşir |
| Dosya derived projede ve boilerplate'te aynı bölümler değişmiş | Conflict marker bırakılır (`<<<<<<<` / `=======` / `>>>>>>>`), geliştirici elle çözer |
| Dosya derived projede mevcut değil | Boilerplate'ten kopyalanır |

**Conflict çözme:** Sync script conflict'li dosyaları raporlar. Geliştirici marker'ları bulur (`grep -rn '<<<<<<< derived-proje'`), elle çözer ve commit eder.

## 4.3. Kategoriler

Manifest üç kategori tanımlar:

- **mandatory:** Zorunlu miras kapsamındaki dosyalar. 2 sprint deadline. Override yasak.
- **structural:** Yapısal miras kapsamındaki dosyalar. 4 sprint deadline. Sıkılaştırılabilir, gevşetilemez.
- **project_specific:** Sync edilmeyecek dosyalar. Derived proje kendi oluşturur.

## 4.4. Manifest Dosyasının Güncelliği

Boilerplate'e yeni dosya eklendiğinde veya mevcut dosyanın miras tipi değiştiğinde manifest güncellenir. Manifest güncellemesi, ilgili tag release'inden önce yapılır.

---

# 5. Changelog Disiplini

## 5.1. Format

**Dosya yolu:** `CHANGELOG.md` (boilerplate root)

Her entry bir git tag'e karşılık gelir. Değişiklikler miras tipine göre **ZORUNLU**, **YAPISAL**, **FELSEFİ** kategorileriyle gruplandırılır. Her entry'nin sonunda etkilenen dosya listesi yer alır.

## 5.2. Oluşturma Kuralı

Yeni tag oluşturulmadan önce changelog entry'si yazılır. `git log bp-v<önceki>..HEAD --oneline` çıktısı referans alınarak her değişiklik ilgili miras kategorisine yerleştirilir.

## 5.3. Derived Proje İçin Anlam

Derived proje ekibi, changelog'u okuyarak:
- Hangi değişikliklerin zorunlu olduğunu (ve deadline'ını)
- Hangi dosyaların etkilendiğini
- Sync script çalıştırmadan önce nelere dikkat etmesi gerektiğini anlayabilir.

---

# 6. Sync Mekanizması

## 6.1. Genel Yaklaşım

Derived projede `upstream` adında ikinci bir git remote tanımlanır. Bu remote boilerplate reposuna işaret eder. Sync işlemi `git fetch upstream` + manifest-driven selective file checkout/merge ile yapılır.

```bash
# Derived projede ilk kurulum (bir kez yapılır)
git remote add upstream <boilerplate-repo-url>
```

Git history temizlenmiş derived projelerde bu yöntem çalışır — `git fetch` unrelated histories'den bağımsız olarak dosya içeriği çekebilir, `git checkout <tag> -- <dosya>` ile selective sync yapılabilir.

## 6.2. Sync Script

**Dosya yolu:** `tooling/sync/upstream-sync.sh`

Script derived projede çalıştırılır:

```bash
./tooling/sync/upstream-sync.sh bp-v1.2.0
```

**Akış:**

1. Upstream remote varlığını kontrol et, yoksa hata ver
2. `git fetch upstream --tags` ile güncel tag'leri çek
3. Hedef tag'in varlığını doğrula
4. BOUNDARY.md'den mevcut `boilerplate_upstream_hash` değerini oku
5. Zaten güncel ise çık
6. Sync branch oluştur: `chore/upstream-sync-<tag>`
7. Manifest'i oku, her entry için:
   - `exact` → `git checkout <tag> -- <dosya>`
   - `partial` → `partial-merge.sh` ile sentinel-based merge
   - `adaptive` → checkout + `.sync-config.yaml` değişken substitution
8. BOUNDARY.md'yi güncelle (hash, tarih, versiyon, sync geçmişi)
9. Commit oluştur, PR talimatı göster

## 6.3. Partial Sync Protokolü

CLAUDE.md ve AGENTS.md gibi hem boilerplate hem proje-spesifik içerik barındıran dosyalar için sentinel yorumları kullanılır:

```markdown
<!-- UPSTREAM-SYNC-START: Bölüm Adı -->
## Bölüm Başlığı
[boilerplate'ten sync edilen içerik]
<!-- UPSTREAM-SYNC-END: Bölüm Adı -->

<!-- PROJECT-SPECIFIC-START: Bölüm Adı -->
## Bölüm Başlığı
[proje-spesifik içerik — sync dokunmaz]
<!-- PROJECT-SPECIFIC-END: Bölüm Adı -->
```

**Yardımcı script:** `tooling/sync/partial-merge.sh`

Bu script:
1. Hedef dosyanın mevcut içeriğini okur
2. `UPSTREAM-SYNC-START/END` blokları arasındaki içeriği boilerplate'ten gelen güncel versiyonla değiştirir
3. `PROJECT-SPECIFIC-START/END` bloklarına dokunmaz
4. Sonucu dosyaya yazar

## 6.4. Adaptive Sync

CI dosyaları ve agent talimatları gibi dosyalar boilerplate'ten çekildikten sonra proje-spesifik değişkenlerle güncellenir.

Derived projede `.sync-config.yaml` dosyası tutulur:

```yaml
# .sync-config.yaml (derived proje root)
upstream_repo: "github.com/<org>/boilerplate"
project_name: "my-awesome-app"
org_scope: "@myapp"
```

Sync script bu dosyadan değişkenleri okuyarak `{{REPO_NAME}}`, `{{ORG_SCOPE}}` gibi placeholder'ları gerçek değerlerle değiştirir.

---

# 7. Drift Detection

## 7.1. CI Job

Derived projede haftalık çalışan CI job, boilerplate ile derived proje arasındaki farkı (drift) tespit eder.

**Job adı:** `upstream-drift-check`
**Çalışma:** `tooling/ci/scheduled-audit.yml` içinde tanımlı

**Akış:**
1. Upstream remote'u ekle/fetch et
2. BOUNDARY.md'den mevcut sync hash'ini oku
3. En güncel `bp-v*` tag'ini bul
4. Hash'ler eşleşiyorsa → PASS
5. Eşleşmiyorsa → değişen dosyaları listele
6. Dosyaları miras tipine göre kategorize et
7. Zorunlu miras drift varsa → CI FAIL (P0)
8. Yapısal miras drift varsa → CI WARNING (P1)
9. Felsefi drift varsa → CI INFO

## 7.2. Drift Severity Modeli

| Drift Türü | Tespit Koşulu | CI Davranışı | Aksiyon Süresi |
|------------|---------------|-------------|----------------|
| Zorunlu miras drift | `docs/adr/ADR-*`, governance base dosyaları, security/a11y baseline değişmiş | CI FAIL | 2 sprint |
| Yapısal miras drift | Architecture, design system, foundation dosyaları değişmiş | CI WARNING | 4 sprint |
| Felsefi/minor drift | Diğer dosyalar değişmiş | CI INFO | Süresiz |
| Tag drift | 2+ major veya 4+ minor tag geride | CI FAIL | Acil sync planı |

## 7.3. Drift Bildirimi

CI job başarısız olursa veya uyarı üretirse GitHub Issue otomatik açılır:
- Etiketler: `upstream-sync`, `priority-<severity>`
- İçerik: değişen dosya listesi, miras tipi kategorisi, beklenen sync süresi

---

# 8. Boilerplate Release Bildirimi

Boilerplate'te yeni `bp-v*` tag push'ı yapıldığında, `notify-derived-projects.yml` workflow'u tetiklenir.

**Dosya yolu:** `.github/workflows/notify-derived-projects.yml`

**Akış:**
1. Tag mesajından kategori bilgisini çıkar
2. CHANGELOG.md'den ilgili bölümü çıkar
3. `tooling/sync/derived-projects.txt` dosyasından derived proje listesini oku
4. Her derived projede `upstream-sync` etiketli issue aç

**Derived proje listesi:** `tooling/sync/derived-projects.txt`

Bu dosya boilerplate maintainer tarafından güncellenir. Yeni derived proje oluşturulduğunda bu listeye eklenir.

---

# 9. BOUNDARY.md Güncelleme Protokolü

Sync script başarılı çalıştıktan sonra BOUNDARY.md otomatik güncellenir:

- `boilerplate_upstream_hash` → yeni commit hash
- `last_sync_date` → sync tarihi
- `upstream_version` → hedef tag
- `Sync Geçmişi` tablosuna yeni satır eklenir

Bu format `45-boilerplate-project-boundary-contract.md` Bölüm 15.3'teki minimum içerik formatıyla uyumludur.

---

# 10. Derived Proje Kurulum Gereksinimleri

Derived proje oluşturulurken (`43-derived-project-creation-guide.md`) upstream sync altyapısı da kurulur:

1. Boilerplate `upstream` remote olarak eklenir
2. `tooling/sync/` dizini boilerplate'ten kopyalanır (manifest + scriptler)
3. `.sync-config.yaml` proje-spesifik değerlerle oluşturulur
4. CLAUDE.md ve AGENTS.md'ye sentinel yorumları eklenir (setup script tarafından)
5. BOUNDARY.md oluşturulur (ilk upstream hash ile)

---

# 11. Sorumluluk Matrisi

| Rol | Sorumluluk |
|-----|------------|
| Boilerplate maintainer | Tag oluşturma, changelog yazma, manifest güncelleme, derived-projects.txt güncelleme |
| Derived proje tech lead | Sync issue'larını takip etme, `upstream-sync.sh` çalıştırma, PR oluşturma, BOUNDARY.md doğrulama |
| CI pipeline | Haftalık drift detection, issue açma, severity raporlama |
| Boilerplate release workflow | Tag push'ta derived projelere otomatik bildirim |

---

# 12. Anti-pattern'ler

## 12.1. Sync Bypass

**Tanım:** Manifest'teki dosyaları elle değiştirerek veya sync script'ini atlatarak güncelleme yapma.

**Neden anti-pattern:** Drift detection'ı yanıltır, BOUNDARY.md ile gerçek durum arasında tutarsızlık oluşur.

## 12.2. Manifest Dışı Dosya Sync'i

**Tanım:** Manifest'te tanımlı olmayan dosyaları elle boilerplate'ten kopyalama.

**Neden anti-pattern:** İzlenemeyen sync, audit'te tespit edilemez, geri dönüşü zor.

## 12.3. Sentinel Kırma

**Tanım:** CLAUDE.md veya AGENTS.md'deki sentinel yorumlarını silme veya değiştirme.

**Neden anti-pattern:** Partial merge çalışamaz hale gelir, bir sonraki sync başarısız olur.

## 12.4. Tag Atlama

**Tanım:** Ara tag'leri atlayarak sadece en son tag'e sync yapma.

**Neden anti-pattern:** Zorunlu miras değişikliklerinin deadline'ı aşılmış olabilir, audit'te blocker alınır.

---

# 13. Mevcut Dokümanlarla Uyum

| Mevcut Doküman | Bu Stratejideki Karşılık | Uyum |
|----------------|-------------------------|------|
| 45 Bölüm 11 (yayılım süreleri: 2/4 sprint) | Tag MAJOR/MINOR/PATCH semantiği | Birebir eşleşir |
| 45 Bölüm 15 (BOUNDARY.md upstream hash) | BOUNDARY.md otomatik güncelleme | Format korundu |
| 45 Bölüm 9.1 (BOUNDARY.md manifest formatı) | Genişletilmiş BOUNDARY.md formatı | Sync geçmişi bölümü eklendi |
| 43 Adım 5 (boundary contract okuma) | Upstream remote setup + sync config | Genişletme |
| 43 Bölüm 9 (tek komut fork stratejisi) | `.sync-config.yaml` + upstream remote | Uyumlu |
| 29 (release rules, changelog) | CHANGELOG.md formatı | Uyumlu |

---

# 14. Onay Kriterleri

Bu belge aşağıdaki koşullar sağlandığında uygulamaya hazır kabul edilir:

- [ ] Versiyonlama sistemi (bp-v tag formatı, semantic mapping) tanımlanmıştır
- [ ] Sync manifest formatı ve modları (exact/partial/adaptive) tanımlanmıştır
- [ ] Sync script akışı adım adım belirtilmiştir
- [ ] Partial sync protokolü (sentinel yorumlar) tanımlanmıştır
- [ ] Drift detection severity modeli (P0/P1/INFO) tanımlanmıştır
- [ ] CI entegrasyonu (drift detection job, notification workflow) tanımlanmıştır
- [ ] BOUNDARY.md güncelleme protokolü tanımlanmıştır
- [ ] Derived proje kurulum gereksinimleri listelenmiştir
- [ ] Sorumluluk matrisi oluşturulmuştur
- [ ] Anti-pattern'ler tanımlanmıştır
- [ ] Mevcut dokümanlarla uyum matrisi oluşturulmuştur
- [ ] `35-document-map.md`'de bu belgenin yeri işaretlenmiştir
