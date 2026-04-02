# 46-stitch-pipeline-spec.md

## Doküman Kimliği

- **Doküman adı:** Stitch Pipeline Specification
- **Dosya adı:** `46-stitch-pipeline-spec.md`
- **Doküman türü:** Specification / design-to-code pipeline / token integration document
- **Durum:** Accepted
- **Tarih:** 2026-04-01
- **Kapsam:** Google Stitch'in boilerplate design-to-code pipeline'ı olarak konumunu, DESIGN.md üretim ve tüketim kurallarını, Stitch MCP entegrasyonunu, stitch-to-react skill akışını, token eşleme mekanizmasını (CSS değişkenleri → Tailwind config → NativeWind) ve kalite kapılarını tanımlar.
- **Bağlı olduğu üst dokümanlar:**
  - `22-design-tokens-spec.md`
  - `ADR-007-styling-tokens-and-theming-implementation.md`
  - `04-design-system-architecture.md`
  - `40-ai-workflow-and-tooling.md`
- **Doğrudan etkileyeceği dokümanlar:**
  - `22-design-tokens-spec.md`
  - `23-component-governance-rules.md`
  - `35-document-map.md`

---

# 1. Amac

Bu dokuman, Google Stitch'in boilerplate ekosistemindeki rolunu, calisma prensiplerini ve uretim akisini tanimlar. Stitch'ten cikarilan tasarim kararlari (renk, tipografi, spacing, component pattern) nasil boilerplate token katmanlarina donusturulur, bu donusum sirasinda hangi kurallar gecerlidir, hangi araclar kullanilir ve sonucta uretilen component'ler hangi kalite kapilarindan gecer -- tum bu sorulara somut cevap verir.

Doküman su temel ihtiyaclari karsilar:

- Stitch ciktisinin boilerplate'in token sistemiyle (`22-design-tokens-spec.md`) nasil eslestigi
- DESIGN.md dosyasinin yasam dongusunu (uretim, guncelleme, tuketim)
- Stitch MCP araclarinin Claude Code ile entegrasyonunu
- Token donusum mekanizmasinin (CSS degiskenleri --> Tailwind --> NativeWind) somut adimlarini
- Kalite kapilarini ve dogrulama stratejisini

---

# 2. Temel Tez

**Stitch, boilerplate'in design-to-code pipeline'idir.**

DESIGN.md uzerinden tasarim kararlarini kodlanabilir token'lara, component yapilarına ve ekran layout'larina donusturur. Stitch, tasarim asamasinda tek kaynak (single source of design truth) gorevi gorur; ancak token sistemi acisindan nihai otorite her zaman `22-design-tokens-spec.md`'dir.

Bu iliskinin ozeti:

| Kaynak                   | Rol                                   | Otorite                          |
| ------------------------ | ------------------------------------- | -------------------------------- |
| Stitch canvas            | Tasarim uretim araci                  | Tasarim iterasyonunda birincil   |
| DESIGN.md                | Tasarim kararlarinin yapisal export'u | Stitch ile kod arasi kopru       |
| 22-design-tokens-spec.md | Token sistemi spesifikasyonu          | Token catismasinda nihai otorite |
| packages/design-tokens/  | Uygulama katmani token dosyalari      | Calisma zamani kaynak            |

**Kural:** DESIGN.md ile `22-design-tokens-spec.md` arasinda catisma oldugunda, `22-design-tokens-spec.md` kazanir. Bu kural `40-ai-workflow-and-tooling.md` bolum 4.2 tarafindan tanimlanir ve bu dokumanda da gecerlidir.

---

# 3. Pipeline Genel Akisi

Stitch pipeline'i alti adimdan olusur. Her adim bir oncekinin ciktisini tuketir.

```
Giris Noktalari
      |
      v
[Adim 1] Stitch'te Tasarim Olusturma
      |
      v
[Adim 2] DESIGN.md Export
      |
      v
[Adim 3] Stitch MCP ile Claude Code Entegrasyonu
      |
      v
[Adim 4] Component Uretimi
      |
      v
[Adim 5] Token Eslestirme (KRITIK)
      |
      v
[Adim 6] Dogrulama (Quality Gates)
```

---

## 3.1. Giris Noktalari

Pipeline uc farkli noktadan baslatilabilir:

**a) Tasarim briefing'i:**
Boilerplate dokumanlarindan (04, 05, 22) turetilen tasarim gereksinimleri dogal dil olarak Stitch'e verilir. Ornek: "Koyu tema, mavi tonlarda, 4pt grid, Inter fontu kullanan bir dashboard ekrani."

**b) Mevcut DESIGN.md (iterasyon):**
Daha once uretilmis bir DESIGN.md dosyasi Stitch'e yuklenerek mevcut tasarim kararlari korunur ve iteratif gelistirme yapilir. Bu, tutarlilik icin tercih edilen yontemdir.

**c) Referans gorsel:**
Mevcut bir ekran goruntusu veya tasarim referansi Stitch'e upload edilir. Stitch, gorselden tasarim DNA'sini cikarir ve buna dayali yeni ekranlar olusturur.

---

## 3.2. Adim 1 -- Stitch'te Tasarim Olusturma

**Ortam:** [stitch.withgoogle.com](https://stitch.withgoogle.com)
**Motor:** Gemini 3.1 modeli (Mart 2026 itibariyle)

Stitch'te tasarim olusturma sureci:

1. **Proje olusturma veya mevcut projeye devam:** Yeni bir Stitch projesi acilin veya mevcut DESIGN.md yuklenerek devam edilir.

2. **Dogal dil veya gorsel girdi:** Tasarim istekleri dogal dilde yazilir veya referans gorsel yuklenir. Stitch, bu girdileri yorumlayarak ekran tasarimi olusturur.

3. **Multi-screen generation:** Tek bir oturumda birden fazla ekran tasarlanabilir. Akis tasarimi (navigation flow) icin bu ozellik kullanilir. Ekranlar arasi tutarlilik Stitch tarafindan saglanir.

4. **AI canvas ile iterasyon:** Olusturulan tasarim uzerinde dogal dille degisiklik talep edilir. Stitch, mevcut tasarimi koruyarak istenen degisiklikleri uygular.

5. **Mevcut token yukleme:** Eger boilerplate'in token seti halihazirda tanimli ise, bu token'lar Stitch'e yuklenebilir. Stitch, uretilen tasarimlarda bu token'lari uygular, boylece tutarlilik baslangiç noktasindan saglanir.

**Onemli:** Stitch'e girdi olarak verilen tasarim briefing'i, boilerplate'in canonical stack kararlariyla uyumlu olmalidir. React/React Native hedefi, Tailwind CSS kullanimi ve semantic token-first yaklasimi briefing'de belirtilmelidir.

---

## 3.3. Adim 2 -- DESIGN.md Export

Stitch canvas'indan DESIGN.md dosyasi uretilir. Bu dosya, tasarim kararlarinin yapisal temsilini icerir.

### DESIGN.md Icerigi

DESIGN.md asagidaki bolumleri icerir:

| Bolum               | Aciklama                                      | Ornek                                                                               |
| ------------------- | --------------------------------------------- | ----------------------------------------------------------------------------------- |
| Color palette       | Ham renk degerleri                            | `--color-blue-500: #3B82F6`                                                         |
| Color roles         | Anlamsal renk atamalari                       | `--color-primary: var(--color-blue-500)`                                            |
| Typography          | Font ailesi, boyut, agirlik, satir yuksekligi | `--font-heading: Inter, 24px, 700`                                                  |
| Spacing             | Bosluk degerleri                              | `--spacing-md: 16px`                                                                |
| Border radius       | Kose yaricap degerleri ve semantik rolleri    | `--radius-md: 8px`, `--radius-full: 9999px`                                         |
| Shadows / Elevation | Golge ve derinlik tanimlari, yuzey ayrimi     | `--shadow-sm: 0 1px 2px rgba(0,0,0,0.05)`, `--shadow-md: 0 4px 6px rgba(0,0,0,0.1)` |
| Component patterns  | Component yapisi ve varyantlari               | Button: primary, secondary, ghost                                                   |

### DESIGN.md Kurallari

1. **Stitch tarafindan uretilir, elle duzenlenmez.** Manuel degisiklik Stitch ile senkronizasyonu bozar.
2. **Proje kokune yerlestirilir:** `./DESIGN.md`
3. **Her Stitch export'unda tarih etiketlenir:** Export tarihi DESIGN.md icerisinde commit mesajina yazilir.
4. **Versiyon kontrolunde tutulur:** DESIGN.md git'e commit edilir, degisiklikleri PR review kapsamindadir.

---

## 3.4. Adim 3 -- Stitch MCP ile Claude Code Entegrasyonu

Stitch MCP (Model Context Protocol), Stitch canvas'indaki tasarim verilerini Claude Code'a aktarmak icin kullanilir.

### MCP Kurulumu

#### a) Otomatik Kurulum (Onerilen)

Asagidaki komut gcloud kurulumunu, OAuth yapilandirmasini, kimlik bilgilerini ve proje konfigurasyonunu otomatik yapar:

```bash
npx @_davideast/stitch-mcp init
```

Bu komut:

- Google Cloud projesini yapilandirir
- OAuth credential'larini olusturur
- `.claude/settings.json`'a MCP server konfigurasyonunu ekler
- Ilk baglanti testini gerceklestirir

#### b) Manuel Konfigurasyon

Otomatik kurulum kullanilamiyorsa, `.claude/settings.json` dosyasina asagidaki konfigurasyon elle eklenir:

```json
{
  "mcpServers": {
    "stitch": {
      "command": "npx",
      "args": ["@_davideast/stitch-mcp", "proxy"]
    }
  }
}
```

Alternatif olarak Claude Code CLI ile:

```bash
claude mcp add -e GOOGLE_CLOUD_PROJECT=YOUR_PROJECT_ID -s user stitch -- npx -y @_davideast/stitch-mcp proxy
```

### Kimlik Dogrulama

Stitch MCP iki kimlik dogrulama yontemi destekler:

| Yontem              | Kullanim Senaryosu                                | Yapilandirma                                                                                                  |
| ------------------- | ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| **API Key**         | Kisisel kullanim, hizli baslangic                 | Stitch arayuzunde Profil > Stitch Settings > API Key bolumunden olusturulur. Ortam degiskeni olarak ayarlanir |
| **Service Account** | Takim kullanimi, CI/CD, otomatik token yenilemesi | Google Cloud Managed Projects uzerinden yapilandirilir. Token yenilemesi otomatiktir                          |

**Onemli:** API Key kisisel ve gizlidir, `.env` dosyasinda saklanir, git'e commit edilmez. `27-security-and-secrets-baseline.md` kurallari gecerlidir.

### Kullanilabilir MCP Araclari

| Arac                        | Islem                       | Kullanim                                                                                                                |
| --------------------------- | --------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `extract_design_context`    | Design DNA cikarimi         | Stitch canvas'indan renk, tipografi, spacing bilgilerini yapisal olarak dondurur                                        |
| `fetch_screen_code`         | Ekran kodu indirme          | Belirli bir ekranin HTML/CSS, Tailwind CSS veya React/JSX kodunu dondurur                                               |
| `fetch_screen_image`        | Ekran goruntusu indirme     | Ekranin PNG screenshot'ini indirir, gorsel dogrulama icin kullanilir                                                    |
| `generate_screen_from_text` | Metin tabanli ekran uretimi | Dogal dil prompt'u ile yeni ekran olusturur                                                                             |
| `build_site`                | Site scaffold uretimi       | Birden fazla ekrani route'lara eslestirerek site yapisi olusturur. Turetilen projelerde hizli bootstrap icin degerlidir |

### MCP Kullanim Akisi

```
1. extract_design_context --> Tasarim DNA'sini al
2. fetch_screen_code --> Hedef ekranin kodunu al (Tailwind CSS format)
3. Claude Code ile DESIGN.md'ye gore token eslestirmesi yap
4. Component uretimini baslat (Adim 4)
```

**Onemli:** MCP araclari sadece Stitch canvas'indaki veriye erisim saglar. Token donusumu ve eslestirme islemleri Claude Code tarafinda gerceklestirilir.

---

## 3.5. Adim 4 -- Component Uretimi

Stitch ciktisinin boilerplate component'lerine donusturulmesi iki yontemle yapilir:

### a) stitch-to-react Skill ile Otomatik Donusum

```bash
npx skills add google-labs-code/stitch-skills --skill react:components
```

Bu skill, Stitch canvas'indaki ekran tasarimlarini React component'lerine donusturur. Olusturulan component'ler boilerplate'in dosya yapisina (`packages/ui/src/components/`) yerlestirilir.

Skill ciktisi:

- React/JSX component dosyalari
- Tailwind CSS class'lari ile stillendirilmis
- Temel prop interface'leri

### b) Claude Code ile DESIGN.md Referansli Uretim

Claude Code, DESIGN.md'yi okuyarak ve `22-design-tokens-spec.md`'deki token kurallarini referans alarak component uretir. Bu yontem daha fazla kontrol saglar:

1. Claude Code, DESIGN.md'deki tasarim kararlarini okur
2. `22-design-tokens-spec.md`'deki token katmanlariyla eslestirir
3. Boilerplate'in component governance kurallarini (`23-component-governance-rules.md`) uygular
4. Accessibility, responsive ve platform adaptation gereksinimlerini karsilar

**Tercih sirasi:** Ilk iterasyonda stitch-to-react skill kullanilir, ardindan Claude Code ile refinement yapilir. Bu iki asamali yaklasim hem hiz hem kalite saglar.

---

## 3.6. Adim 5 -- Token Eslestirme

> **Bu bolum pipeline'in en kritik adimidir.** Stitch ciktisindaki tasarim degerlerinin boilerplate token katmanlarina dogru sekilde eslestigi burada garanti altina alinir.

### 3.6.1. Eslestirme Tablosu

Stitch DESIGN.md ciktisi ile boilerplate token katmanlari arasindaki eslestirme:

| Stitch Ciktisi      | Boilerplate Token Katmani | Ornek Donusum                                                 |
| ------------------- | ------------------------- | ------------------------------------------------------------- |
| Color roles         | Semantic color tokens     | `--color-primary` --> `colors.primary.DEFAULT`                |
| Color palette       | Primitive color tokens    | `--color-blue-500` --> `colors.blue.500`                      |
| Typography mapping  | Typography tokens         | `--font-heading` --> `fontSize.heading`, `fontFamily.heading` |
| Spacing scale       | Spacing tokens            | `--spacing-md` --> `spacing.4` (16px)                         |
| Border radius       | Radius tokens             | `--radius-md` --> `radius.md` (8px)                           |
| Shadows / Elevation | Elevation tokens          | `--shadow-sm` --> `shadow.sm`, surface tier eslesmesi         |
| Component patterns  | Component tokens          | Button varyantlari --> component token seti                   |

### 3.6.2. Somut Donusum Mekanizmasi

Donusum bes asamadan olusur:

**a) Stitch DESIGN.md CSS degiskenleri --> packages/design-tokens/ kaynak dosyalar**

Stitch'in DESIGN.md dosyasindaki CSS degiskenleri (ornegin `--color-primary: #3B82F6`) alinir ve `packages/design-tokens/` altindaki kaynak dosyalara yazilir.

Ornek donusum:

```
DESIGN.md icerigi:
  --color-primary: #3B82F6
  --color-secondary: #8B5CF6
  --color-background: #FFFFFF
  --color-surface: #F8FAFC

Token kaynak dosyasi (packages/design-tokens/colors.ts):
  export const semanticColors = {
    primary: { DEFAULT: '#3B82F6' },
    secondary: { DEFAULT: '#8B5CF6' },
    background: { DEFAULT: '#FFFFFF' },
    surface: { DEFAULT: '#F8FAFC' },
  };
```

**b) Kaynak dosyalar --> tailwind.config.js (web) + NativeWind config (mobile)**

Token kaynak dosyalari, Tailwind CSS konfigurasyonuna ve NativeWind konfigurasyonuna donusturulur:

```javascript
// tailwind.config.js
const { semanticColors } = require('./packages/design-tokens/colors');

module.exports = {
  theme: {
    extend: {
      colors: semanticColors,
      // ... diger token'lar
    },
  },
};
```

NativeWind icin ayni token kaynak dosyalari kullanilir; platform farkliliklari NativeWind'in kendi donusum katmaninda ele alinir.

**c) Donusum yontemi**

Donusum iki sekilde yapilabilir:

1. **Claude Code talimati:** Claude Code, DESIGN.md'yi okur ve token kaynak dosyalarini otomatik gunceller. Bu yontem kucuk degisiklikler icin uygundur.

2. **Donusum scripti:** `tooling/ai/stitch/` dizininde bulunan donusum scripti, DESIGN.md'yi parse ederek token kaynak dosyalarini otomatik olusturur. Bu yontem buyuk olcekli token guncellemeleri icin tercih edilir.

```
tooling/ai/stitch/
  ├── transform.ts          # DESIGN.md --> token kaynak donusturucusu
  ├── validate.ts           # Token tutarlilik dogrulamasi
  └── exports/              # Stitch export arsivi
      └── {tarih}-{ekran}/  # Tarihli export dizinleri
```

**d) Eslesmeven token'lar**

Stitch ciktisinda var olan ancak `22-design-tokens-spec.md`'de karsiligi bulunmayan token'lar icin:

1. Uyari uretilir (CI veya Claude Code ciktisinda)
2. Token'in 22'ye eklenmesi gerekir -- bu bir PR gerektir
3. Ekleme yapilana kadar eslesmeven token kullanilmaz
4. Gecici olarak hard-coded deger kullanilmasi **yasaktir**

**e) Catisma kurali**

DESIGN.md ile `22-design-tokens-spec.md` arasinda catisma oldugunda:

> **22 kazanir.** Bu kural mutlaktir.

Ornek: DESIGN.md `--color-primary: #3B82F6` derken, 22'de `primary.DEFAULT: '#2563EB'` tanimli ise, `#2563EB` kullanilir. DESIGN.md guncellenmek uzere Stitch'te yeniden export edilir.

### 3.6.3. Token Katmani Hiyerarsisi

Token eslestirmesinde katman hiyerarsisi asagidaki gibidir:

```
Primitive (ham degerler)
    |
    v
Semantic (anlamsal atamalar)
    |
    v
Component (component'e ozgu token'lar)
```

Stitch ciktisi oncelikle semantic katmana eslenir. Eger semantic katmanda karsiligi yoksa, primitive katmana dusulur. Component katmani, semantic token'larin component bazinda ozellestirilmesi icin kullanilir.

---

## 3.7. Adim 6 -- Dogrulama

Pipeline'in son adimi, uretilen tum ciktilarin kalite kapilarindan gecmesidir.

### Dogrulama Kontrol Listesi

- [ ] Uretilen component'ler boilerplate component governance kurallarini karsiliyar mi? (23)
- [ ] Token'lar `22-design-tokens-spec.md` ile senkron mu?
- [ ] Accessibility gereksinimleri karsilanmis mi? (WCAG 2.1 AA minimum)
- [ ] Responsive davranis dogru mu? (web ve mobile icin)
- [ ] Platform adaptation uygulanmis mi? (React Native icin)
- [ ] Eslesmeven token uyarisi var mi? Varsa 22'ye ekleme PR'i acilmis mi?

### Dogrulama Yontemleri

1. **Codex review:** Uretilen component'ler Codex ile bagimsiz denetimden gecer. Codex, DESIGN.md ve 22 arasindaki tutarliligi dogrular.

2. **CI token tutarlilik kontrolu:** CI pipeline'inda DESIGN.md ile `packages/design-tokens/` arasindaki uyum otomatik olarak kontrol edilir.

3. **Gorsel dogrulama:** `fetch_screen_image` MCP araci ile Stitch'teki tasarim, uretilen component'in render ciktisiyla kiyaslanir.

---

# 4. Kalite Kapilari

Pipeline'in her asamasinda gecerli olan kalite kapilari:

## 4.1. DESIGN.md Kalitesi

| Kriter             | Aciklama                                           | Basarisizlik Durumu            |
| ------------------ | -------------------------------------------------- | ------------------------------ |
| Token tamligi      | Tum renk, tipografi, spacing degerleri tanimli mi? | Export tekrar edilir           |
| Katman eslesmesi   | Boilerplate token katmanlariyla uyumlu mu?         | Eslestirme tablosu guncellenir |
| Format tutarliligi | CSS degiskeni formati dogru mu?                    | Stitch'te duzeltme yapilir     |

## 4.2. Component Kalitesi

| Kriter              | Aciklama                           | Basarisizlik Durumu             |
| ------------------- | ---------------------------------- | ------------------------------- |
| Accessibility       | WCAG 2.1 AA, semantik HTML, ARIA   | Component reddedilir            |
| Responsive          | Mobile-first, breakpoint davranisi | Duzeltme gerekli                |
| Platform adaptation | Web ve mobile varyantlari          | NativeWind uyumu kontrol edilir |
| Token kullanimi     | Hard-coded deger yerine token      | Hard-coded degerler yasak       |

## 4.3. Token Tutarliligi

| Kriter            | Aciklama                                            | Basarisizlik Durumu               |
| ----------------- | --------------------------------------------------- | --------------------------------- |
| Stitch-22 senkron | Stitch ciktisi ile packages/design-tokens/ ayni mi? | Donusum scripti calistirilir      |
| Eslesmeven token  | Stitch'te var, 22'de yok                            | 22'ye ekleme PR'i gerekli         |
| Catisma           | DESIGN.md ile 22 farklı deger                       | 22 kazanir, DESIGN.md guncellenir |

---

# 5. Dosya ve Cikti Organizasyonu

Pipeline boyunca uretilen ve tuketilen dosyalarin konumlari:

```
proje-koku/
├── DESIGN.md                              # Stitch export'u, proje koku
├── packages/
│   ├── design-tokens/                     # Token kaynak dosyalari
│   │   ├── colors.ts                      # Renk token'lari
│   │   ├── typography.ts                  # Tipografi token'lari
│   │   ├── spacing.ts                     # Spacing token'lari
│   │   └── index.ts                       # Token barrrel export
│   └── ui/
│       └── src/
│           └── components/                # Uretilen paylasilan component'ler
├── tooling/
│   └── ai/
│       └── stitch/
│           ├── transform.ts               # DESIGN.md --> token donusturucusu
│           ├── validate.ts                # Token tutarlilik dogrulamasi
│           └── exports/                   # Stitch export arsivi
│               ├── 2026-04-01-dashboard/  # Tarihli export
│               ├── 2026-04-05-profile/
│               └── ...
└── tailwind.config.js                     # Token'larin tuketim noktasi
```

### Export Arsivi Kurallari

1. Her Stitch export'u `tooling/ai/stitch/exports/` altinda tarih ve ekran adi ile arsivlenir.
2. Arsiv formatı: `{YYYY-MM-DD}-{ekran-adi}/`
3. Arsiv icerigi: Stitch'ten export edilen ham dosyalar (HTML/CSS, React/JSX, goruntuler)
4. Arsiv dosyalari referans amaclidir, uretimde dogrudan kullanilmaz.

---

# 6. DESIGN.md Evrim Stratejisi

Proje buyudukce DESIGN.md ve Stitch pipeline'i nasil evrilir:

## 6.1. Erken Asama (Proje Baslangici)

- Tek DESIGN.md dosyasi, temel renk paleti ve tipografi
- Stitch'te 3-5 ekran tasarimi
- Token seti minimal, semantic katman agirlikli
- Pipeline tamamen manuel (Claude Code talimati ile donusum)

## 6.2. Buyume Asamasi (10+ Ekran)

- DESIGN.md genisler, component pattern'leri eklenir
- Token seti buyur, primitive ve component katmanlari eklenir
- Donusum scripti (`tooling/ai/stitch/transform.ts`) devreye girer
- CI'da token tutarlilik kontrolu aktif edilir

## 6.3. Olgunluk Asamasi (Uretim)

- DESIGN.md kararli, degisiklikler seyrek ve kontrollü
- Token seti tam, tum katmanlar tanimli
- Pipeline tamamen otomatik: Stitch export --> script --> CI --> deploy
- DESIGN.md degisiklikleri icin resmi degisiklik yonetimi sureci

## 6.4. Multi-Platform Genisleme

- Web ve mobile icin ayri Stitch projeleri, ortak DESIGN.md
- Platform'a ozgu token override'lari `packages/design-tokens/` icinde yonetilir
- NativeWind ile mobile token uyumu otomatik

---

# 7. Anti-pattern'ler

Asagidaki uygulamalar Stitch pipeline'inda **yasaktir**:

## 7.1. Stitch'i DESIGN.md Olmadan Kullanmak

**Neden yasak:** Her Stitch oturumunda farkli tasarim kararlari uretilir. DESIGN.md olmadan tutarlilik saglanamaz.

**Dogru yaklasim:** Her zaman mevcut DESIGN.md yuklenerek baslanir. Ilk oturumda DESIGN.md yoksa, olusturulur ve commit edilir.

## 7.2. DESIGN.md'yi Elle Duzenlemek

**Neden yasak:** Manuel duzenleme Stitch ile DESIGN.md arasindaki senkronizasyonu bozar. Bir sonraki Stitch export'u manuel degisikliklerin ustune yazar.

**Dogru yaklasim:** Degisiklik Stitch'te yapilir, DESIGN.md yeniden export edilir. Token sistemiyle ilgili degisiklikler dogrudan `22-design-tokens-spec.md` ve `packages/design-tokens/` uzerinden yapilir.

## 7.3. Token Eslestirmesi Yapmadan Stitch Ciktisini Kullanmak

**Neden yasak:** Stitch ciktisindaki ham CSS degerleri boilerplate'in token sistemiyle uyumsuz olabilir. Dogrudan kullanim, hard-coded degerlere ve token tutarsizligina yol acar.

**Dogru yaklasim:** Her Stitch ciktisi Adim 5 (Token Eslestirme) uzerinden gecirilir. Eslesmeven token'lar belirlenir ve 22'ye ekleme sureci baslatilir.

## 7.4. Canonical Stack Disi Framework Hedefi Vermek

**Neden yasak:** Boilerplate'in canonical stack'i React + React Native + Tailwind CSS + NativeWind'dir. Stitch'e Vue, Angular veya baska bir framework hedefi vermek, uretilen kodun boilerplate ile uyumsuz olmasina neden olur.

**Dogru yaklasim:** Stitch'e her zaman React/JSX ve Tailwind CSS export formati belirtilir. NativeWind donusumu ayri adimda yapilir.

## 7.5. Stitch Export'unu Dogrudan Component Olarak Kullanmak

**Neden yasak:** Stitch'in urettigi React kodu boilerplate'in component governance kurallarina (23) uygun olmayabilir. Accessibility, prop interface'leri ve test coverage eksik olabilir.

**Dogru yaklasim:** Stitch export'u baslangic noktasidir. Claude Code ile refinement yapilir, governance kurallari uygulanir, testler yazilir.

---

# 8. Onay Kriterleri

Bu doküman asagidaki kosullar saglandiginda "Accepted" statüsündedir:

1. **Pipeline tanimli:** Alti adimli pipeline acik ve uygulanabilir sekilde tanimlanmistir.
2. **Token eslestirme mekanizmasi somut:** CSS degiskenleri --> token kaynak dosyalari --> Tailwind/NativeWind config donusum zinciri orneklerle gosterilmistir.
3. **Catisma kurali net:** DESIGN.md ile 22 catistığinda 22'nin kazandigi acikca belirtilmistir.
4. **MCP entegrasyonu tanimli:** Stitch MCP konfigurasyonu ve araclari dokumante edilmistir.
5. **Kalite kapilari olculebilir:** Her kalite kriteri icin basarisizlik durumu ve aksiyon tanimlanmistir.
6. **Anti-pattern'ler listeli:** Yasak uygulamalar ve dogru alternatifler belirtilmistir.
7. **Dosya organizasyonu net:** Tum pipeline ciktilari icin konum bilgisi verilmistir.
8. **Bagli dokumanlarla tutarli:** 22, 04, 23 ve ADR-007 ile celismez.

---

# 9. Kisa Sonuc

Stitch, boilerplate'in tasarim-kod pipeline'inda merkezi bir arac olarak konumlanir. DESIGN.md uzerinden tasarim kararlarini yapisal olarak aktarir, Stitch MCP ve stitch-to-react skill ile Claude Code entegrasyonu saglar. Ancak, token sistemi acisindan nihai otorite `22-design-tokens-spec.md`'dir. Bu doküman, bu iki kaynak arasindaki iliskiyi, donusum mekanizmasini ve kalite kapilarini tanimlar.

Pipeline'in basarisi, token eslestirme adiminin titizlikle uygulanmasina baglidir. Stitch ciktisi dogrudan kullanilmaz, her zaman boilerplate token katmanlariyla eslestirilir. Eslesmeven token'lar uyari uretir ve 22'ye ekleme sureci baslatilir. Bu disiplin, tasarim tutarliliginin ve token otoritesinin korunmasini saglar.

---

# 10. Figma Plugin Entegrasyonu (2026-04-02 Eki)

Bu bölüm, Figma Dev Mode API üzerinden Stitch pipeline'ına veri akışını ve component/token mapping sürecini tanımlar.

## 10.1. Veri Akışı

```
Figma Design File
    │
    ▼
Figma Dev Mode API
    │
    ▼
Stitch (Token + Component çıkarımı)
    │
    ├── Token mapping (Figma style → semantic token)
    │   └── 22-design-tokens-spec.md ile eşleştirme
    │
    └── Component mapping (Figma component → React component)
        └── packages/ui/ ile eşleştirme
    │
    ▼
DESIGN.md güncelleme
    │
    ▼
PR oluşturma → Review → Merge
```

## 10.2. Token Mapping

| Figma Kaynak          | Stitch Çıktısı       | Boilerplate Token            |
| --------------------- | -------------------- | ---------------------------- |
| Color Style           | CSS custom property  | `color.{semantic}.{variant}` |
| Text Style            | Font shorthand       | `typography.{role}.{size}`   |
| Effect Style          | Box shadow / blur    | `shadow.{elevation}`         |
| Spacing (Auto Layout) | Gap / padding değeri | `spacing.{scale}`            |
| Corner Radius         | Border radius        | `radius.{size}`              |

- Eşleşmeyen Figma style → uyarı üretilir, `22-design-tokens-spec.md`'ye ekleme talebi açılır.
- Eşleşme oranı %90'ın altındaysa, tasarım review gerekir.

## 10.3. Component Mapping

| Figma Component | React Component      | Eşleşme Yöntemi               |
| --------------- | -------------------- | ----------------------------- |
| Button (Figma)  | `packages/ui/Button` | İsim + variant eşleştirme     |
| Input (Figma)   | `packages/ui/Input`  | İsim + prop eşleştirme        |
| Card (Figma)    | `packages/ui/Card`   | İsim eşleştirme               |
| Yeni component  | Scaffold önerisi     | Governance kuralları (23) ile |

## 10.4. Değişiklik Algılama Akışı

1. Figma dosyasında değişiklik yapılır.
2. Stitch, Figma Dev Mode API üzerinden değişikliği algılar (webhook veya polling).
3. Değişiklik analiz edilir: token değişikliği mi, component değişikliği mi, her ikisi mi.
4. DESIGN.md güncellenir.
5. Otomatik PR açılır; PR açıklamasında değişiklik özeti ve etkilenen component'ler listelenir.
6. Review ve merge süreci başlar.

---

# 11. Design-to-Code Diff Raporu (2026-04-02 Eki)

Bu bölüm, Stitch çıktısı ile mevcut implementasyon arasındaki uyumsuzlukların tespiti ve raporlanması mekanizmasını tanımlar.

## 11.1. Amaç

Figma'daki tasarım ile kod tabanındaki implementasyon arasındaki farkları görünür kılmak. Bu farklar:

- Token değeri uyumsuzluğu (Figma'da farklı renk, kodda farklı token)
- Component yapısı farkı (Figma'da ek variant, kodda eksik)
- Spacing/sizing tutarsızlığı
- Yeni eklenen ama implement edilmemiş component'ler

## 11.2. Rapor Mekanizması

- Stitch pipeline her çalıştığında, mevcut implementasyon ile yeni Stitch çıktısı karşılaştırılır.
- Farklar PR comment olarak otomatik eklenir.
- Rapor formatı:

```markdown
### Design-to-Code Diff Raporu

| Tür       | Öğe                | Figma Değeri | Kod Değeri | Durum        |
| --------- | ------------------ | ------------ | ---------- | ------------ |
| Token     | color.primary.500  | #2563EB      | #3B82F6    | ⚠️ Uyumsuz   |
| Component | Button.outline     | Mevcut       | Eksik      | ❌ Eksik     |
| Spacing   | card.padding       | 24px         | 20px       | ⚠️ Uyumsuz   |
| Token     | typography.body.lg | 18/28        | 18/28      | ✅ Eşleşiyor |

**Token Eşleşme Oranı:** %87 (hedef: %90)
**Sonuç:** Tasarım review gerekli
```

## 11.3. Eşleşme Eşikleri

| Oran   | Sonuç                  | Aksiyon                                        |
| ------ | ---------------------- | ---------------------------------------------- |
| ≥%95   | Mükemmel               | Otomatik merge için uygun                      |
| %90-95 | Kabul edilebilir       | PR review yeterli                              |
| %80-90 | Tasarım review gerekli | Tasarımcı + geliştirici review                 |
| <%80   | Blokleyici             | Tasarım-kod senkronizasyonu toplantısı gerekli |

---

# 12. Stitch Skill Ekosistemi (2026-04-02 Eki)

Bu bolum, Stitch'in resmi agent skill'lerini, her birinin pipeline'daki rolunu, kurulum yontemini ve kullanim senaryolarini tanimlar.

## 12.1. Skill Nedir?

Stitch skill'leri, Stitch canvas verilerini yapisal ciktilara donusturen, AI gelistirme ortamlarinda (Claude Code, Cursor, Gemini CLI, Antigravity) calisabilen otomatik araclardir. Her skill belirli bir pipeline adimini otomatiklestirir.

## 12.2. Skill Envanteri

| #   | Skill              | Kurulum Komutu                                                             | Pipeline Adimi              | Cikti                                                                                                                                                            |
| --- | ------------------ | -------------------------------------------------------------------------- | --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | `design-md`        | `npx skills add google-labs-code/stitch-skills --skill design-md --global` | Adim 2 (DESIGN.md Export)   | Stitch projesini analiz ederek Semantic Design System formatinda DESIGN.md dosyasi sentezler. CSS/Tailwind degerlerini betimleyici, dogal tasarim diline cevirir |
| 2   | `react:components` | `npx skills add google-labs-code/stitch-skills --skill react:components`   | Adim 4 (Component Uretimi)  | Stitch ekranlarini modular React/JSX + Tailwind CSS component paketlerine donusturur. TypeScript interface, event handler ayirimi ve mock data ayirimi yapar     |
| 3   | `enhance-prompt`   | `npx skills add google-labs-code/stitch-skills --skill enhance-prompt`     | Adim 1 (Tasarim Olusturma)  | Kullanicinin dogal dil prompt'unu zenginlestirir: platform hedefi, renk paleti, grid sistemi, tipografi gibi detaylari otomatik ekler                            |
| 4   | `stitch-design`    | `npx skills add google-labs-code/stitch-skills --skill stitch-design`      | Adim 1 (Tasarim Iterasyonu) | Mevcut Stitch canvas uzerinde dogal dille degisiklik talep eder ve uygular. Iteratif tasarim dongusu icin                                                        |
| 5   | `stitch-loop`      | `npx skills add google-labs-code/stitch-skills --skill stitch-loop`        | Tum Pipeline                | Surekli tasarim-kod dongusu: Stitch'te tasarla → export et → koda donustur → dogrula → geri bildirim → yeniden tasarla. Tam otomasyon icin                       |
| 6   | `stitch-to-figma`  | Stitch arayuzunde tek tikla export                                         | Cikti dagilimi              | Stitch canvas'ini Figma formatina aktarir. Hibrit workflow (Stitch ideation → Figma refinement) icin                                                             |
| 7   | `stitch-site`      | `npx skills add google-labs-code/stitch-skills --skill stitch-site`        | Adim 4+ (Site scaffold)     | `build_site` MCP araci ile eslesen skill; ekranlari route yapisiyla birlikte scaffold eder                                                                       |

## 12.3. Skill Kullanim Matrisi

| Senaryo                | Onerilen Skill Kombinasyonu                            | Aciklama                                            |
| ---------------------- | ------------------------------------------------------ | --------------------------------------------------- |
| Ilk tasarim (sifirdan) | `enhance-prompt` → Stitch canvas → `design-md`         | Prompt zenginlestir, tasarla, token export et       |
| Iteratif duzeltme      | `stitch-design` → `design-md`                          | Canvas'ta degisiklik yap, DESIGN.md guncelle        |
| Component uretimi      | `react:components` → Claude Code refinement            | Otomatik donusum + governance uygulamasi            |
| Tam otomasyon          | `stitch-loop`                                          | Tasarim-kod dongusunu kesintisiz calistir           |
| Multi-ekran proje      | `enhance-prompt` → Stitch multi-screen → `stitch-site` | Prompt zenginlestir, 5 ekran uret, site scaffold et |
| Figma hibrit           | Stitch canvas → `stitch-to-figma` → Figma refinement   | Hizli ideation + piksel hassasiyeti                 |

## 12.4. Skill ve Boilerplate Governance Iliskisi

Skill'ler dogrudan uretim kodu uretmez; baslangic noktasi saglar. Uretilen ciktilar su governance adimlarindan gecer:

1. **Token eslestirme:** Skill ciktisindaki degerler `22-design-tokens-spec.md` katmanlariyla eslestirilir
2. **Component governance:** `23-component-governance-rules.md` kurallari uygulanir (prop interface, accessibility, test coverage)
3. **Platform adaptation:** `26-platform-adaptation-rules.md` gereksinimleri karsilanir
4. **Guardrail dogrulama:** D-DSY, D-STY, D-UIX domain guardrail'leri uygulanir

**Kural:** Hicbir skill ciktisi dogrudan uretim kodu olarak kabul edilmez. Governance pipeline'indan gecmeden merge edilmez.

## 12.5. Skill Versiyon ve Uyumluluk

- Skill'ler `@_davideast/stitch-mcp` ve `google-labs-code/stitch-skills` repository'lerinden dagitilir
- Her bootstrap oturumunda `npx skills list` ile guncel skill versiyonlari kontrol edilir
- Skill ciktisi format degisikliklerinde `tooling/ai/stitch/transform.ts` donusum scripti guncellenir
- Skill'ler Labs asama urunudur; kararsizlik durumunda manuel pipeline'a geri donulur (bolum 3.4-3.5 referans)

---

# 13. Gelismis Tasarim Workflow'lari (2026-04-02 Eki)

Stitch 2.0 (Mart 2026) ile gelen yeni tasarim modlari ve bunlarin pipeline'a entegrasyonu.

## 13.1. Voice Canvas

**Tanim:** Sesli komutlarla Stitch canvas'i uzerinde tasarim iterasyonu yapma yetkinligi.

**Calisma prensibi:**

1. Stitch canvas'i acilir, mevcut DESIGN.md yuklenir
2. Mikrofon aktif edilir
3. Sesli tasarim komutu verilir: "Bu ekranin ust kismindaki header'i daha kompakt yap, metrik kartlarini 2x2 grid yerine yatay scroll'a cevir"
4. Stitch komutu yorumlar ve canvas'i gunceller
5. Sonuc gorsel olarak dogrulanir
6. DESIGN.md yeniden export edilir

**Pipeline entegrasyonu:**

- Adim 1 (Tasarim Olusturma) ve iterasyon asamasinda kullanilir
- Voice Canvas ciktisi standart Stitch canvas ciktisiyla aynidir; DESIGN.md export sureci degismez
- UX designer'lar icin eller serbest, hizli iterasyon saglar

**Kisitlamalar:**

- Piksel duzeyinde hassas komutlar icin uygun degildir
- Karmasik layout degisiklikleri icin metin prompt daha etkili olabilir

## 13.2. Vibe Design

**Tanim:** Wireframe veya teknik spesifikasyon yerine, is hedefi ve hissiyat tanimi ile tasarim yonlendirme modu.

**Calisma prensibi:**

1. Stitch'e hissiyat tabanli briefing verilir: "Profesyonel, guvenilir, minimal. Fintech uygulamasi hissi. Koyu tonlar, temiz tipografi, genis bosluklar"
2. Stitch, hissiyati gorsel dile cevirir: renk paleti, tipografi secimi, spacing sistemi, yuzey hiyerarsisi
3. Sonuc olarak tutarli bir tasarim dili icerisinde ekranlar uretilir

**Pipeline entegrasyonu:**

- Adim 1'de giris noktasi olarak kullanilir (tasarim briefing'i yerine veya tamamlayicisi olarak)
- `enhance-prompt` skill'i ile birlikte kullanildiginda prompt kalitesi artar
- Vibe Design ciktisi DESIGN.md'ye normal akisla export edilir
- Boilerplate'in semantic token-first yaklasimi ile dogal uyumluluk saglar: hissiyat → semantic roller → token'lar

**Onerilen kullanim:**

- Proje baslangicinda tasarim dili kesfetme
- Farkli tema alternatifleri olusturma (A/B tasarim)
- Marka kimligini tasarim diline cevirme

**Uyari:** Vibe Design ciktisi dogrudan uretim karari degildir. Uretilen tasarim dili `22-design-tokens-spec.md` katmanlariyla eslestirilmeli ve token otoritesine tabi olmalidir.

## 13.3. Multi-Screen Generation

**Tanim:** Tek bir Stitch oturumunda birbirine bagli 5 ekrana kadar tasarim uretimi.

**Calisma prensibi:**

1. Stitch'e ekran akisi briefing'i verilir: "Login → Dashboard → Profil → Ayarlar → Detay ekrani. Ekranlar arasi tutarli gorsel dil, ortak navigation pattern"
2. Stitch, tum ekranlari ayni tasarim DNA'si ile uretir
3. Ekranlar arasi gecis (navigation flow) tanimlanir
4. Her ekran bagimsiz olarak export edilebilir

**Pipeline entegrasyonu:**

- Adim 1'de toplu tasarim uretimi icin kullanilir
- `build_site` MCP araci ile eslenerek route yapisi scaffold edilir
- Her ekranin DESIGN.md'si tek bir tutarli dosyada birlestirilir
- `stitch-site` skill'i ile site scaffold otomatik olusturulur
- Turetilen projelerin hizli bootstrap'i icin ideal

**Kisitlama:** Maksimum 5 ekran/oturum. Daha fazla ekran icin birden fazla oturum kullanilir, ancak DESIGN.md yuklenerek tutarlilik korunur.

## 13.4. AI-Native Infinite Canvas

**Tanim:** Fikirlerin sketch'ten prototipe donustugu sonsuz canvas ortami.

**Calisma prensibi:**

- Canvas uzerinde serbest konumlandirma, gruplama ve iliskilendirme
- Sketch/el cizimi → AI yorumlama → yapisal tasarim donusumu
- Birden fazla ekran varyantini yan yana karsilastirma
- Prototip onizleme ve ekranlar arasi gecis testi

**Pipeline entegrasyonu:**

- Kesfetme (exploration) ve ideation asamasinda kullanilir
- Canvas'taki finalize edilmis ekranlar normal pipeline'dan gecer (DESIGN.md export → token eslestirme → component uretimi)
- Kesfetme asamasindaki calismalar `tooling/ai/stitch/exports/` altinda referans olarak arsivlenir

---

# 14. Kapasite Planlamasi ve Uretim Limitleri (2026-04-02 Eki)

## 14.1. Stitch Uretim Modlari ve Aylik Limitler

Stitch (Nisan 2026 itibariyle) tamamen ucretsizdir. Ucretli planlar Q4 2026'da beklenmektedir.

| Mod              | Aylik Limit       | AI Motoru        | Kalite Seviyesi | Onerilen Kullanim                               |
| ---------------- | ----------------- | ---------------- | --------------- | ----------------------------------------------- |
| **Standard**     | 350 uretim        | Gemini 2.5 Flash | Iyi             | Hizli prototip, iterasyon, kesfetme             |
| **Pro**          | 200 uretim        | Gemini 3.1       | Yuksek          | Uretim kalitesinde ekran tasarimi, final export |
| **Experimental** | 50 uretim         | En yeni model    | Degisken        | Yeni ozellik testi, deneysel calisma            |
| **Toplam**       | **600 uretim/ay** | -                | -               | -                                               |

## 14.2. Kapasite Planlama Stratejisi

### Mod Secim Matrisi

| Calisma Turu                        | Onerilen Mod | Neden                                        |
| ----------------------------------- | ------------ | -------------------------------------------- |
| Ilk ideation ve kesfetme            | Standard     | Hiz oncelikli, cok sayida iterasyon gerekir  |
| DESIGN.md export icin final tasarim | Pro          | Kalite oncelikli, token tutarliligi onemli   |
| Yeni Stitch ozellik testi           | Experimental | Kararsiz ama en guncel model                 |
| Vibe Design ile tema kesfetme       | Standard     | Birden fazla alternatif uretilecek           |
| Multi-screen generation             | Pro          | 5 ekranin tutarli olmasi icin kalite gerekli |
| Bug fix / kucuk duzeltme            | Standard     | Tek ekran, hizli iterasyon                   |

### Aylik Dagitim Onerisi (Tek Proje)

| Donem                      | Standard Kullanim | Pro Kullanim | Aciklama                                    |
| -------------------------- | ----------------- | ------------ | ------------------------------------------- |
| Proje baslangici (1. ay)   | ~200              | ~100         | Yogun tasarim uretimi, tema kesfetme        |
| Aktif gelistirme (2-4. ay) | ~100              | ~50          | Yeni ekranlar ve iterasyon                  |
| Bakim donemii (5+ ay)      | ~30               | ~20          | Kucuk degisiklikler, yeni feature ekranlari |

### Limit Asimi Durumu

- Aylik limit doldiginda Stitch uretim yapamaz; sonraki ayin basini beklemek gerekir
- **Onlem:** Her ay baslangicinda kalan kredi kontrol edilir
- **Fallback:** Limit dolmadan once kritik export'larin yapilmis olmasi saglanir
- **Alternatif:** Figma + manuel token export ile pipeline calismaya devam edebilir (bolum 10 referans)

## 14.3. Birden Fazla Turetilen Proje Durumu

Her Google hesabi bagimsiz limite sahiptir. Birden fazla proje icin:

1. **Paylasilan DESIGN.md:** Ortak design system olan projelerde ayni DESIGN.md yuklenerek tutarlilik saglanir, gereksiz yeniden uretim onlenir
2. **Takim hesaplari:** Birden fazla takim uyesi farkli hesaplarla giris yaparak toplam kapasiteyi artirabilir
3. **Export arsivleme:** Her basarili export `tooling/ai/stitch/exports/` altinda arsivlenir, gereksiz tekrar export onlenir

---

# 15. React Native Platform Sinirliliklari (2026-04-02 Eki)

## 15.1. Temel Sinirlilik

**Stitch'in dogrudan React Native export'u yoktur.** Bu, boilerplate icin en onemli platform sinirliligidur.

- Stitch'in ana cikti formatlari: HTML/CSS, Tailwind CSS, React/JSX
- React Native / NativeWind formatinda dogrudan export destegi mevcut degil
- GitHub Issue #41 olarak resmi olarak talep edilmis, henuz cozulmemis (Nisan 2026)

## 15.2. Cozum Stratejisi: NativeWind Donusum Zinciri

Boilerplate'in canonical stack'i NativeWind 5.x candidate track'tir (ADR-007). Bu karar, Stitch sinirliligini dolayili olarak cozer:

```
Stitch Canvas
    |
    v
Tailwind CSS ciktisi (web format)
    |
    v
Token Eslestirme (Adim 5)
    |
    v
packages/design-tokens/ (ortak kaynak)
    |
    ├── Web: tailwind.config.ts --> Tailwind CSS class'lari
    |
    └── Mobile: tailwind.config.native.ts --> NativeWind class'lari
```

**Kritik nokta:** Token kaynak dosyalari (`packages/design-tokens/`) her iki platform icin ortaktir. Platform farkliliklari Tailwind/NativeWind config katmaninda ele alinir, token katmaninda degil.

## 15.3. Platform Donusum Kurallari

| Stitch Ciktisi                      | Web Karsiligi | Mobile (NativeWind) Karsiligi         | Not                                      |
| ----------------------------------- | ------------- | ------------------------------------- | ---------------------------------------- |
| `className="bg-primary"`            | Ayni          | Ayni (NativeWind destekler)           | Dogrudan uyumlu                          |
| `className="hover:bg-primary-dark"` | Ayni          | `className="active:bg-primary-dark"`  | Hover → active/pressed donusumu          |
| `className="grid grid-cols-3"`      | Ayni          | `className="flex flex-row flex-wrap"` | CSS Grid → Flexbox donusumu              |
| `className="shadow-md"`             | Ayni          | Platform-specific shadow              | NativeWind shadow uyumu kontrol edilmeli |
| `min-h-screen`                      | Ayni          | `flex-1` veya SafeAreaView            | Viewport → SafeArea donusumu             |
| `cursor-pointer`                    | Ayni          | Kaldirilir (mobilde anlamsiz)         | Platform-specific temizlik               |

## 15.4. Donusum Sorumlulugu

Stitch → NativeWind donusumu **Claude Code tarafindan** gerceklestirilir:

1. `stitch-to-react` skill'i web formatinda React component uretir
2. Claude Code, component'i NativeWind uyumlu hale getirir
3. Platform-specific farkliliklar uygulanir (`26-platform-adaptation-rules.md`)
4. `D-PLT` (platform guardrail) ve `D-STY` (styling guardrail) dogrulamasi yapilir

**Gelecek beklentisi:** Stitch'in resmi React Native skill'i ciktiginda (GitHub Issue #41), bu donusum adimi otomatiklestirilebilir. Ancak governance kurallari ve token eslestirme adimi her durumda gecerli kalir.

---

# 16. DESIGN.md Sablon ve Briefing Rehberi (2026-04-02 Eki)

Bu bolum, turetilen projelerin Stitch'ten ilk DESIGN.md'yi nasil uretecegini, briefing formatini ve beklenen cikti yapisini tanimlar.

## 16.1. DESIGN.md Uretim Oncesi Kontrol Listesi

Stitch'e girmeden once asagidaki hazirliklarin tamamlanmis olmasi gerekir:

- [ ] Projenin hedef platformu belirlendi (web, mobile, her ikisi)
- [ ] Marka kimligi veya tasarim referanslari hazir (renk paleti, logo, referans gorsel)
- [ ] `22-design-tokens-spec.md` okundu, token katmanlari (raw, semantic, context, component) anlasildi
- [ ] `04-design-system-architecture.md` okundu, design system hiyerarsisi anlasildi
- [ ] `05-theming-and-visual-language.md` okundu, light/dark theme gereksinimleri anlasildi
- [ ] Hedef ekran listesi belirlendi (minimum 3, maksimum 5 ilk oturumda)

## 16.2. Stitch Briefing Formati

Stitch'e verilecek briefing asagidaki yapida olmalidir. Bu format `enhance-prompt` skill'i ile birlikte kullanildiginda en iyi sonucu verir.

### Sablonun Yapisi

```
[PROJE KIMLIGI]
Proje adi: {proje_adi}
Platform: React + Tailwind CSS (web) / React Native + NativeWind (mobile) / Her ikisi
Hedef kullanici: {kullanici_profili}

[TASARIM DILI]
Hissiyat: {2-4 sifat} (ornek: "Profesyonel, guvenilir, minimal, modern")
Renk paleti: {temel renkler veya referans} (ornek: "Koyu tonlar, mavi vurgu, acik gri yuzeyler")
Tipografi: {font ailesi tercihi} (ornek: "Inter veya SF Pro, temiz ve okunabilir")
Grid sistemi: {grid tercihi} (ornek: "4pt base grid, 8pt spacing scale")
Kose yaricap: {radius tercihi} (ornek: "Orta yuvarlaklık (8px), butonlarda tam yuvarlak (full)")
Derinlik: {shadow/elevation tercihi} (ornek: "Minimal golge, tonal kontrast ile yuzey ayrimi")

[EKRAN LISTESI]
1. {ekran_adi}: {ekranin amaci ve icerik ozeti}
2. {ekran_adi}: {ekranin amaci ve icerik ozeti}
3. {ekran_adi}: {ekranin amaci ve icerik ozeti}
(Maksimum 5 ekran)

[KISITLAMALAR]
- Apple HIG uyumlu olmali (touch target 44x44pt, safe area, Dynamic Type)
- Semantic token-first yaklasim (hardcoded deger yasak)
- Light ve dark tema destegi (1:1 parity)
- WCAG 2.1 AA kontrast (minimum 4.5:1)
- Responsive davranis (mobile-first)
```

### Ornek Briefing

```
[PROJE KIMLIGI]
Proje adi: FinTrack
Platform: React + Tailwind CSS (web) ve React Native + NativeWind (mobile)
Hedef kullanici: Bireysel finansal takip yapan 25-45 yas arasi profesyoneller

[TASARIM DILI]
Hissiyat: Profesyonel, guvenilir, sakin, modern
Renk paleti: Koyu lacivert (#0F172A) ana arka plan, mavi (#3B82F6) vurgu, yesil (#10B981) pozitif, kirmizi (#EF4444) negatif, gri tonlari yuzey ayrimi
Tipografi: Inter, temiz ve okunabilir, guclu hiyerarsi
Grid sistemi: 4pt base grid, 8pt spacing scale
Kose yaricap: Orta (8px) kartlar, kucuk (4px) inputlar, tam yuvarlak butonlar
Derinlik: Minimal golge, border ve tonal kontrast ile yuzey ayrimi

[EKRAN LISTESI]
1. Dashboard: Ozet metrikler (gelir, gider, net), son islemler listesi, kategori dagilim grafigi
2. Islem Listesi: Filtrelenebilir islem gecmisi, arama, kategori filtreleri
3. Islem Detay: Tek islemin tam detayi, duzenleme secenegi
4. Profil: Kullanici bilgileri, tercihler, bildirim ayarlari
5. Login: E-posta + sifre, biyometrik giris secenegi

[KISITLAMALAR]
- Apple HIG uyumlu (touch target 44x44pt, safe area, Dynamic Type)
- Semantic token-first (hardcoded deger yasak)
- Light ve dark tema (1:1 parity)
- WCAG 2.1 AA kontrast (4.5:1)
- Mobile-first responsive
```

## 16.3. Beklenen DESIGN.md Cikti Yapisi

Stitch'ten export edilen DESIGN.md dosyasi asagidaki 7 bolumleri icermelidir:

| #   | Bolum                   | Icerik                                                           | 22-Token Katman Eslesmesi          |
| --- | ----------------------- | ---------------------------------------------------------------- | ---------------------------------- |
| 1   | **Color Palette**       | Ham renk degerleri, tonal scale                                  | Raw tokens (color)                 |
| 2   | **Color Roles**         | Anlamsal renk atamalari (primary, secondary, surface, error vb.) | Semantic tokens (color)            |
| 3   | **Typography**          | Font ailesi, boyut olcegi, agirlik, satir yuksekligi             | Raw + Semantic tokens (typography) |
| 4   | **Spacing**             | Bosluk degerleri scale'i                                         | Raw + Semantic tokens (spacing)    |
| 5   | **Border Radius**       | Kose yaricap degerleri ve semantik rolleri                       | Raw + Semantic tokens (radius)     |
| 6   | **Shadows / Elevation** | Golge tanimlari, yuzey derinlik seviyeleri                       | Raw + Semantic tokens (elevation)  |
| 7   | **Component Patterns**  | Component yapisi, varyantlari, state tanimlari                   | Component token mappings           |

### Bolum Detaylari

**1. Color Palette (Raw)**

```css
/* DESIGN.md formati */
--color-blue-50: #eff6ff;
--color-blue-100: #dbeafe;
--color-blue-500: #3b82f6;
--color-blue-900: #1e3a8a;
--color-neutral-50: #f8fafc;
--color-neutral-900: #0f172a;
```

**2. Color Roles (Semantic)**

```css
--color-primary: var(--color-blue-500);
--color-on-primary: var(--color-neutral-50);
--color-background: var(--color-neutral-50);
--color-surface: #ffffff;
--color-error: var(--color-red-500);
--color-success: var(--color-green-500);
```

**3. Typography**

```css
--font-family-default: 'Inter', system-ui, sans-serif;
--font-size-xs: 12px;
--font-size-sm: 14px;
--font-size-md: 16px;
--font-size-lg: 18px;
--font-size-xl: 20px;
--font-size-2xl: 24px;
--font-size-3xl: 30px;
--font-weight-regular: 400;
--font-weight-medium: 500;
--font-weight-bold: 700;
--line-height-tight: 1.25;
--line-height-normal: 1.5;
```

**4. Spacing**

```css
--spacing-1: 4px;
--spacing-2: 8px;
--spacing-3: 12px;
--spacing-4: 16px;
--spacing-6: 24px;
--spacing-8: 32px;
--spacing-12: 48px;
--spacing-16: 64px;
```

**5. Border Radius**

```css
--radius-sm: 4px;
--radius-md: 8px;
--radius-lg: 12px;
--radius-xl: 16px;
--radius-full: 9999px;
```

**6. Shadows / Elevation**

```css
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
```

**7. Component Patterns**

```
Button:
  Variants: primary, secondary, ghost, destructive
  Sizes: sm, md, lg
  States: default, hover, active, disabled, loading

Input:
  Variants: default, error, success
  Sizes: sm, md, lg
  States: default, focused, disabled, readonly
```

## 16.4. DESIGN.md Uretim Sonrasi Kontrol Listesi

DESIGN.md export edildikten sonra asagidaki kontroller yapilir:

- [ ] 7 bolumun tamami mevcut mu?
- [ ] Color Roles, `22-design-tokens-spec.md`'deki semantic token isimlendirme kurallarina uyuyor mu?
- [ ] Typography scale, `05-theming-and-visual-language.md`'deki hiyerarsi beklentisiyle uyumlu mu?
- [ ] Spacing scale, 4pt/8pt base grid ile tutarli mi?
- [ ] Border radius degerleri sistematik mi (rastgele degerler yok mu)?
- [ ] Shadow tanimlari yuzey hiyerarsisini dogru yansitip yansitmiyor?
- [ ] Light ve dark tema icin renk rolleri 1:1 parity sagliyor mu?
- [ ] WCAG AA kontrast (4.5:1) karsilaniyor mu?
- [ ] Component pattern'leri, `23-component-governance-rules.md`'deki primitive/component ayrimi ile uyumlu mu?
- [ ] DESIGN.md proje kokune (`./DESIGN.md`) yerlestirildi mi?
- [ ] Git'e commit edildi mi?

## 16.5. DESIGN.md ve Token Otorite Iliskisi (Hatirlatma)

Bu rehber boyunca gecerli olan temel otorite kurali:

> **DESIGN.md, `22-design-tokens-spec.md`'nin turevidir, alternatifi degildir.**
> Catisma durumunda `22` kazanir. DESIGN.md Stitch'te yeniden export edilir.

Bu kural `40-ai-workflow-and-tooling.md` tarafindan tanimlanir ve bu dokumandaki tum bolumlerde gecerlidir.

---

# 17. Revizyon Gecmisi

| Tarih      | Revizyon                        | Kapsam                                                                                                                                                                                                                                                                                                                                                                                                   |
| ---------- | ------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2026-04-01 | Ilk yayin                       | Pipeline tanimı, MCP entegrasyonu, token eslestirme, dogrulama, anti-pattern'ler                                                                                                                                                                                                                                                                                                                         |
| 2026-04-02 | Figma Plugin ve Diff Raporu eki | Bolum 10-11: Figma Dev Mode API entegrasyonu, design-to-code diff raporu                                                                                                                                                                                                                                                                                                                                 |
| 2026-04-02 | Kapsamli guncelleme             | Bolum 12-16: Stitch Skill Ekosistemi, Gelismis Tasarim Workflow'lari (Voice Canvas, Vibe Design, Multi-screen, Infinite Canvas), Kapasite Planlamasi, React Native Sinirliliklari, DESIGN.md Sablon ve Briefing Rehberi. Ayrica: DESIGN.md bolumleri guncellendi (Border Radius, Shadows/Elevation eklendi), MCP araclarina build_site eklendi, MCP kimlik dogrulama ve otomatik kurulum rehberi eklendi |
