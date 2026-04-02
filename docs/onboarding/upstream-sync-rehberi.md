# Upstream Sync Rehberi — Hızlı Başlangıç

> Boilerplate güncellemelerini derived projene nasıl alırsın? Bu rehber tek sayfa.

---

## Ne Zaman Sync Yapmalısın?

- GitHub'da `upstream-sync` etiketli issue açıldığında (otomatik bildirim)
- CI'da `upstream-drift-check` uyarı/hata verdiğinde
- Boilerplate'te yeni ADR, guardrail veya governance kuralı eklendiğinde

---

## İlk Kurulum (Bir Kez)

```bash
# 1. Boilerplate'i upstream remote olarak ekle
git remote add upstream <boilerplate-repo-url>

# 2. .sync-config.yaml oluştur (proje root'unda)
cat > .sync-config.yaml << 'EOF'
upstream_repo: "github.com/<org>/boilerplate"
project_name: "benim-projem"
org_scope: "@org"
EOF

# 3. Tag'leri çek
git fetch upstream --tags
```

---

## Sync Yapma (Her Güncelleme İçin)

```bash
# 1. Mevcut tag'leri gör
git fetch upstream --tags
git tag -l 'bp-v*' --sort=-v:refname

# 2. Sync çalıştır
./tooling/sync/upstream-sync.sh bp-v1.2.0

# 3. Değişiklikleri incele
git diff

# 4. Conflict varsa çöz
grep -rn '<<<<<<< derived-proje' . --include='*.md'
# Her conflict dosyasını aç, <<<<<<< / ======= / >>>>>>> satırlarını düzenle

# 5. Commit ve PR
git add -A
git commit -m 'chore: upstream sync bp-v1.2.0'
git push origin chore/upstream-sync-bp-v1.2.0
gh pr create --title 'chore: upstream sync bp-v1.2.0'
```

---

## Sync Nasıl Çalışır?

Script 3 modda dosya sync eder:

| Mod | Ne Yapar | Örnek Dosyalar |
|-----|----------|----------------|
| **exact** | 3-way merge: derived projedeki değişiklikler korunur, conflict varsa marker bırakılır | ADR'ler, guardrail'ler, governance dokümanları |
| **partial** | Sentinel yorumlarıyla işaretli bölümler güncellenir, proje-spesifik bölümlere dokunulmaz | CLAUDE.md, AGENTS.md |
| **adaptive** | 3-way merge + proje değişkenleri otomatik yerleştirilir | CI dosyaları |

### 3-Way Merge Nedir?

3 versiyon karşılaştırılır:

```
base   = son sync'teki boilerplate versiyonu
ours   = derived projedeki mevcut dosya (senin değişikliklerin)
theirs = boilerplate'in yeni versiyonu
```

- Senin değişikliğin farklı bölümde, boilerplate'inki farklı bölümde → **otomatik birleşir**
- Aynı bölümü ikisi de değiştirmişse → **conflict marker** bırakılır, sen çözersin
- Sen dosyayı hiç değiştirmemişsen → boilerplate versiyonu olduğu gibi gelir

### Sentinel Yorumları Nedir? (CLAUDE.md / AGENTS.md)

```markdown
<!-- UPSTREAM-SYNC-START: Canonical Kararlar -->
## Canonical Kararlar
[Bu bölüm boilerplate'ten otomatik güncellenir]
<!-- UPSTREAM-SYNC-END: Canonical Kararlar -->

<!-- PROJECT-SPECIFIC-START: Proje Kimligi -->
## Proje Kimliği
[Bu bölüme sync dokunmaz — istediğini yaz]
<!-- PROJECT-SPECIFIC-END: Proje Kimligi -->
```

---

## Deadline'lar

| Tag Değişiklik Tipi | Anlamı | Deadline |
|---------------------|--------|----------|
| MAJOR artışı (bp-v**2**.0.0) | Zorunlu miras değişti (yeni ADR, canonical stack) | **2 sprint** (max 4 hafta) |
| MINOR artışı (bp-v1.**1**.0) | Yapısal miras değişti (yeni guardrail, CI) | **4 sprint** (max 8 hafta) |
| PATCH artışı (bp-v1.0.**1**) | Felsefi/typo | Zorunlu süre yok |

---

## Sorun Giderme

### "upstream remote tanımlı değil" hatası
```bash
git remote add upstream <boilerplate-repo-url>
```

### "tag bulunamadı" hatası
```bash
git fetch upstream --tags
```

### Conflict çözülemiyor
Dosyayı aç, `<<<<<<< derived-proje` ile `>>>>>>> boilerplate-bp-v1.x.x` arasındaki her iki versiyonu da oku. Hangisinin doğru olduğuna karar ver veya ikisini birleştir. Marker satırlarını sil.

### CI'da drift uyarısı ama sync yapılmış
BOUNDARY.md'deki `boilerplate_upstream_hash` değerinin güncel olduğunu kontrol et.

---

## İlgili Dokümanlar

| Doküman | Ne İçin |
|---------|---------|
| `49-upstream-sync-strategy.md` | Tam teknik strateji |
| `45-boilerplate-project-boundary-contract.md` | Miras modeli ve override kuralları |
| `43-derived-project-creation-guide.md` | Derived proje oluşturma (ilk kurulum) |
| `CHANGELOG.md` | Boilerplate değişiklik kaydı |
| `tooling/sync/upstream-sync-manifest.yaml` | Hangi dosya nasıl sync ediliyor |
