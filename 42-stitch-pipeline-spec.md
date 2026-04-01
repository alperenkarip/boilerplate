# 42-stitch-pipeline-spec.md

## Dokuman Kimligi

- **Dokuman adi:** Stitch Pipeline Specification
- **Dosya adi:** `42-stitch-pipeline-spec.md`
- **Dokuman turu:** Specification / design-to-code pipeline / token integration document
- **Durum:** Accepted
- **Tarih:** 2026-04-01
- **Kapsam:** Google Stitch'in boilerplate design-to-code pipeline'i olarak konumunu, DESIGN.md uretim ve tuketim kurallarini, Stitch MCP entegrasyonunu, stitch-to-react skill akisini, token eslestirme mekanizmasini (CSS degiskenleri --> Tailwind config --> NativeWind) ve kalite kapilarini tanimlar.
- **Bagli oldugu ust dokumanlar:**
  - `22-design-tokens-spec.md`
  - `ADR-007-styling-tokens-and-theming-implementation.md`
  - `04-design-system-architecture.md`
  - `40-ai-workflow-and-tooling.md`
- **Dogrudan etkileyecegi dokumanlar:**
  - `22-design-tokens-spec.md`
  - `23-component-governance-rules.md`
  - `33-ai-guidelines.md`
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

| Kaynak | Rol | Otorite |
|--------|-----|---------|
| Stitch canvas | Tasarim uretim araci | Tasarim iterasyonunda birincil |
| DESIGN.md | Tasarim kararlarinin yapisal export'u | Stitch ile kod arasi kopru |
| 22-design-tokens-spec.md | Token sistemi spesifikasyonu | Token catismasinda nihai otorite |
| packages/design-tokens/ | Uygulama katmani token dosyalari | Calisma zamani kaynak |

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

| Bolum | Aciklama | Ornek |
|-------|----------|-------|
| Color palette | Ham renk degerleri | `--color-blue-500: #3B82F6` |
| Color roles | Anlamsal renk atamalari | `--color-primary: var(--color-blue-500)` |
| Typography | Font ailesi, boyut, agirlik, satir yuksekligi | `--font-heading: Inter, 24px, 700` |
| Spacing | Bosluk degerleri | `--spacing-md: 16px` |
| Component patterns | Component yapisi ve varyantlari | Button: primary, secondary, ghost |

### DESIGN.md Kurallari

1. **Stitch tarafindan uretilir, elle duzenlenmez.** Manuel degisiklik Stitch ile senkronizasyonu bozar.
2. **Proje kokune yerlestirilir:** `./DESIGN.md`
3. **Her Stitch export'unda tarih etiketlenir:** Export tarihi DESIGN.md icerisinde commit mesajina yazilir.
4. **Versiyon kontrolunde tutulur:** DESIGN.md git'e commit edilir, degisiklikleri PR review kapsamindadir.

---

## 3.4. Adim 3 -- Stitch MCP ile Claude Code Entegrasyonu

Stitch MCP (Model Context Protocol), Stitch canvas'indaki tasarim verilerini Claude Code'a aktarmak icin kullanilir.

### MCP Konfigurasyonu

`.claude/settings.json` dosyasina asagidaki konfigurasyon eklenir:

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

### Kullanilabilir MCP Araclari

| Arac | Islem | Kullanim |
|------|-------|----------|
| `extract_design_context` | Design DNA cikarimi | Stitch canvas'indan renk, tipografi, spacing bilgilerini yapisal olarak dondurur |
| `fetch_screen_code` | Ekran kodu indirme | Belirli bir ekranin HTML/CSS, Tailwind CSS veya React/JSX kodunu dondurur |
| `fetch_screen_image` | Ekran goruntusu indirme | Ekranin PNG screenshot'ini indirir, gorsel dogrulama icin kullanilir |
| `generate_screen_from_text` | Metin tabanli ekran uretimi | Dogal dil prompt'u ile yeni ekran olusturur |

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

| Stitch Ciktisi | Boilerplate Token Katmani | Ornek Donusum |
|----------------|---------------------------|---------------|
| Color roles | Semantic color tokens | `--color-primary` --> `colors.primary.DEFAULT` |
| Color palette | Primitive color tokens | `--color-blue-500` --> `colors.blue.500` |
| Typography mapping | Typography tokens | `--font-heading` --> `fontSize.heading`, `fontFamily.heading` |
| Spacing scale | Spacing tokens | `--spacing-md` --> `spacing.4` (16px) |
| Component patterns | Component tokens | Button varyantlari --> component token seti |

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

| Kriter | Aciklama | Basarisizlik Durumu |
|--------|----------|---------------------|
| Token tamligi | Tum renk, tipografi, spacing degerleri tanimli mi? | Export tekrar edilir |
| Katman eslesmesi | Boilerplate token katmanlariyla uyumlu mu? | Eslestirme tablosu guncellenir |
| Format tutarliligi | CSS degiskeni formati dogru mu? | Stitch'te duzeltme yapilir |

## 4.2. Component Kalitesi

| Kriter | Aciklama | Basarisizlik Durumu |
|--------|----------|---------------------|
| Accessibility | WCAG 2.1 AA, semantik HTML, ARIA | Component reddedilir |
| Responsive | Mobile-first, breakpoint davranisi | Duzeltme gerekli |
| Platform adaptation | Web ve mobile varyantlari | NativeWind uyumu kontrol edilir |
| Token kullanimi | Hard-coded deger yerine token | Hard-coded degerler yasak |

## 4.3. Token Tutarliligi

| Kriter | Aciklama | Basarisizlik Durumu |
|--------|----------|---------------------|
| Stitch-22 senkron | Stitch ciktisi ile packages/design-tokens/ ayni mi? | Donusum scripti calistirilir |
| Eslesmeven token | Stitch'te var, 22'de yok | 22'ye ekleme PR'i gerekli |
| Catisma | DESIGN.md ile 22 farklı deger | 22 kazanir, DESIGN.md guncellenir |

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
