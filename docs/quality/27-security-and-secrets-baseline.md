# 27-security-and-secrets-baseline.md

## Doküman Kimliği

- **Doküman adı:** Security and Secrets Baseline
- **Dosya adı:** `27-security-and-secrets-baseline.md`
- **Doküman türü:** Baseline / security hygiene / secrets governance / client-runtime safety standard
- **Durum:** Accepted
- **Tarih:** 2026-03-31
- **Kapsam:** Bu belge, boilerplate kapsamında güvenlik hijyenini, secret yönetimini, environment ayrımını, client-side güvenlik sınırlarını, repo ve runtime saklama kurallarını, auth/session hassasiyetlerini, observability ve analytics tarafındaki veri sızıntısı risklerini, secure storage ilkelerini ve güvenlikle ilgili minimum merge standardını tanımlar.
- **Bağlı olduğu üst belgeler:**
  - `00-project-charter.md`
  - `01-working-principles.md`
  - `06-application-architecture.md`
  - `09-state-management-strategy.md`
  - `10-data-fetching-cache-sync.md`
  - `15-quality-gates-and-ci-rules.md`
  - `16-tooling-and-governance.md`
  - `17-technology-decision-framework.md`
  - `21-repo-structure-spec.md`
  - `36-canonical-stack-decision.md`
  - `37-dependency-policy.md`
  - `38-version-compatibility-matrix.md`
  - `ADR-009 — Observability Stack`
  - `ADR-010 — Auth, Session and Secure Storage Baseline`
- **Doğrudan etkileyeceği belgeler:**
  - `28-observability-and-debugging.md`
  - `29-release-and-versioning-rules.md`
  - `30-contribution-guide.md`
  - `31-audit-checklist.md`
  - `32-definition-of-done.md`
  - `35-document-map.md`

---

# 1. Bu Belgenin Revize Edilme Nedeni

Önceki sürüm güvenlik hijyenini genel olarak iyi çerçeveliyordu.  
Ama artık proje farklı bir aşamada:

- auth/session baseline yazıldı,
- observability baseline yazıldı,
- dependency policy yazıldı,
- compatibility matrix yazıldı,
- canonical stack kararı kapandı.

Bu nedenle güvenlik belgesi artık yalnızca “iyi pratikler” listesi olamaz.  
Artık şu soruya daha sert cevap vermek zorundadır:

> Bu repo ve bu boilerplate içinde hangi bilgi nereye girebilir, hangi bilgi asla giremez ve bunu merge seviyesinde nasıl enforce ederiz?

Bu revizyonun amacı tam olarak budur.

---

# 2. Amaç

Bu dokümanın amacı, güvenliği:

- backend takımı işi,
- sonradan bakılacak alan,
- birkaç env dosyası ve `.gitignore` konusu,
- “token’ı local storage’a koyma” seviyesinde basit bir öneri seti

olmaktan çıkarıp;  
**repo, client runtime, auth/session, observability, analytics, storage, debugging ve release disiplinini etkileyen resmi kalite alanı** haline getirmektir.

Bu belge şu sorulara net cevap verir:

1. Client-side güvenliğin gerçek sınırı nedir?
2. Secret ile public config nasıl ayrılır?
3. Repo içinde ve runtime içinde hangi veriler hangi sınıfta ele alınır?
4. Auth/session artefact’ları generic state veya convenience storage’a neden giremez?
5. Web ve mobile tarafında persistence neden aynı mantıkla ele alınamaz?
6. Logs, analytics, Sentry ve debug yüzeylerinde hangi veriler asla görünmemelidir?
7. Environment ve secret yönetimi nasıl organize edilmelidir?
8. Güvenlik açısından merge öncesi minimum çıta nedir?
9. Hangi davranışlar bu projede doğrudan zayıf ve kabul edilemez sayılır?

---

# 3. Temel Tez

Bu proje kapsamında temel tez şudur:

> Client-side güvenlik, “gizliyi istemci içinde saklama” sanatı değildir; hangi bilginin istemciye geldikten sonra artık gizli kabul edilemeyeceğini açıkça kabul etmek, gerçekten korunması gereken veriyi yanlış yüzeylere koymamak, auth/session lifecycle’ını deterministic kurmak, observability/analytics/logging yüzeylerini sanitize etmek ve repo ile runtime hijyenini enforce etmektir.

Bu tez şu sonuçları doğurur:

1. Client’e gelen veri gerçek secret kabul edilmez.
2. Secret ile public config aynı şey değildir.
3. Token ve session artefact’ları UI state değildir.
4. Secure storage ile convenience storage aynı şey değildir.
5. Debug/analytics gözlemlenebilirlik yüzeyleri güvenlikten bağımsız düşünülemez.
6. Security hygiene, contribution ve DoD zincirinin resmi parçasıdır.

---

# 4. Kapsam ve Kapsam Dışı

## 4.1. Bu belge neyi kapsar?

- repo-level secret hijyeni
- env ve config ayrımı
- client runtime güvenlik sınırları
- web ve mobile persistence ayrımı
- auth/session artefact handling
- logs / analytics / observability sanitization
- secure storage ilkeleri
- debug surface güvenliği
- release ve preview ortamlarında güvenlik hijyeni
- merge ve audit seviyesinde minimum kontroller

## 4.2. Bu belge neyi tam çözmez?

- backend auth protocol tasarımının tüm detaylarını
- tam OWASP kontrol listesini
- network edge / CDN / WAF mimarisini
- server-side authorization mantığını
- enterprise compliance belgelerini
- pen-test planını
- cryptographic implementation spesifiklerini

Bu belge bir **client/runtime/repo security baseline** belgesidir.

---

# 5. En Kritik İlke: Client Secret Saklama Yeri Değildir

Bu belgenin en önemli cümlesi şudur:

> **Client runtime, gerçek secret saklama yeri değildir.**

Bu cümle şu anlama gelir:

- web bundle içine giren hiçbir değer secret değildir
- mobile binary içine gömülen hiçbir değer gerçek secret değildir
- JS tarafından erişilebilen token gerçek secret gibi ele alınamaz
- `.env` dosyasına yazılmış olması bir değeri “güvenli” yapmaz
- source map, crash dump, logs, screenshots ve debug tools veri sızdırabilir

Bu ilke kabul edilmeden güvenlik politikası kurulamaz.

---

# 6. Veri Sınıflandırma Modeli

Bu repo içinde veriler en az aşağıdaki sınıflarda düşünülmelidir.

## 6.1. Public Build Config
Örnek:
- public API base URL
- public feature flags default values
- app version labels
- public analytics environment labels
- public sentry DSN benzeri secret olmayan public identifiers

Bunlar gizli olmak zorunda değildir.  
Ama yanlış yorumlanmamalıdır.

## 6.2. Sensitive Client Data
Örnek:
- user identifiers
- auth/session summary
- PII içerebilecek bazı user profile alanları
- limited business data
- device-bound settings
- drafts

Bunlar her zaman “secret” değildir.  
Ama careless logging veya analytics ile sızdırılmamalıdır.

## 6.3. Secret / Credential Class Data
Örnek:
- API private keys
- service credentials
- raw auth tokens
- refresh tokens
- client secrets
- signing keys
- private internal service endpoints with credentials
- certificate materials

Bu veri sınıfı repo veya generic runtime yüzeylerine girmemelidir.

## 6.4. Session Artefacts
Örnek:
- access token
- refresh token
- backend-managed cookie session handle
- secure auth restore handles

Bunlar secret sınıfına yakın hassasiyette ele alınır.  
UI state veya debug metadatası değildir.

---

# 7. Secret ile Public Config Ayrımı

## 7.1. En yaygın hata
Bir değerin `.env` içinde olması onun secret olduğu sanılır.  
Bu yanlıştır.

## 7.2. Doğru ayrım
Bir değer şu soruyla değerlendirilir:

> Bu değer istemciye gönderildiğinde zarar görmeden açık kalabilir mi?

Cevap evetse:
- bu değer public config olabilir

Cevap hayırsa:
- bu değer istemci runtime’a gitmemelidir

## 7.3. Örnekler

### Public config olabilir
- public API base URL
- public Sentry DSN
- public build environment label
- locale defaults
- public feature flag seed data

### Secret olarak ele alınmalı
- admin API keys
- backend service private secrets
- refresh token signing material
- provider client secret
- internal credentials

---

# 8. Repo Hijyeni Politikası

## 8.1. Kural

Repo, secret mezarlığı değildir.

## 8.2. Asla commit edilmemesi gerekenler
- gerçek `.env` secrets
- service account credentials
- raw token dumps
- local debug screenshots with sensitive data
- copied production payloads containing PII
- real webhook secrets
- encryption/signing keys
- internal admin endpoints with auth material

## 8.3. Gerekli olanlar
- env example/template dosyaları
- açıklayıcı comments
- required variable list
- public vs secret ayrımı
- local setup instructions
- redacted examples

## 8.4. Zayıf davranışlar
- “şimdilik koydum sonra silerim”
- `.env.local` dosyasını paylaşıma dahil etmek
- debug için gerçek user payload’ı repo’ya koymak
- redaction yapmadan JSON örneği eklemek

---

# 9. Environment Yönetimi Politikası

## 9.1. Kural

Environment yönetimi convenience-first değil, classification-first yapılmalıdır.

## 9.2. Ayrım yapılması gereken ana sınıflar
- local development
- test
- preview
- staging
- production

## 9.3. Her ortam için açık olmalı
- hangi değişken public config
- hangi değişken secret
- hangi değişken build-time
- hangi değişken runtime-injected
- hangi değişken app içinde görünür
- hangi değişken yalnızca CI/secrets manager tarafından sağlanır

## 9.4. Zayıf davranışlar
- local env ile prod env ayrımını bulanık bırakmak
- preview ortamında gerçek production secrets kullanmak
- public/private ayrımını naming convention’a bile bağlamamak

## 9.5. `.env` Dosya Yapısı ve Konvansiyonu

Repo kök dizininde **`.env.example`** dosyası bulunur. Bu dosya, projede kullanılan **tüm** environment variable’ları listeler. Ancak değerler gerçek değil, placeholder veya boştur. Her değişkenin hemen üstünde yorum satırıyla ne olduğu, hangi ortamda zorunlu olduğu ve ne işe yaradığı açıklanır.

Örnek `.env.example` içeriği:

```
# API base URL — backend API’nin adresi (tüm ortamlarda zorunlu)
VITE_API_URL=https://api.example.com

# Sentry DSN — hata izleme için (production’da zorunlu, local’de opsiyonel)
VITE_SENTRY_DSN=

# Feature flag: yeni profil sayfası aktif mi (varsayılan: false)
VITE_FEATURE_NEW_PROFILE=false

# Analytics tracking ID — analytics servisi için (production’da zorunlu)
VITE_ANALYTICS_ID=

# Public app version label — build bilgisi için
VITE_APP_VERSION=0.0.0-dev
```

Bu dosyanın amacı:
- Yeni bir geliştirici projeyi clone ettiğinde hangi variable’lara ihtiyacı olduğunu anında görsün.
- Hiçbir variable "ağızdan ağıza" aktarılmasın; tamamı bu dosyada belgelenmiş olsun.
- Değer eklenmesi gereken yerler boş bırakılır veya `YOUR_VALUE_HERE` gibi açık placeholder konur.
- Opsiyonel variable’lar `(opsiyonel)` etiketi ile işaretlenir.

Bu dosya **repo’ya commit edilir** ve güncel tutulması zorunludur.

## 9.6. `.env.local` — Geliştiricinin Kendi Değerleri

Geliştirici, `.env.example` dosyasını kopyalayarak `.env.local` dosyasını oluşturur:

```bash
cp .env.example .env.local
```

Ardından `.env.local` içindeki placeholder değerleri kendi ortamına uygun gerçek değerlerle doldurur.

Kurallar:
- `.env.local` dosyası **`.gitignore` içinde** yer alır ve **asla commit edilmez**.
- Bu dosya tamamen geliştiriciye özeldir. Her geliştirici kendi local backend URL’ini, kendi test API key’ini vb. buraya yazar.
- Takım arkadaşıyla `.env.local` dosyası paylaşılmaz. Paylaşılması gereken bilgi `.env.example` içinde belgelenir.
- Eğer yeni bir environment variable eklendiyse, `.env.example` dosyasına da eklenmesi **zorunludur**. Bu adımı atlamak, diğer geliştiricilerin ortamlarının sessizce bozulmasına yol açar.

## 9.7. `.env.staging` ve `.env.production` — CI/CD Ortam Dosyaları

Bu dosyalar **repo’da BULUNMAZ**. Staging ve production ortamlarına ait environment variable’lar CI/CD secret store üzerinden inject edilir.

Neden repo’da bulunmazlar:
- Production API key’leri, database URL’leri, signing secret’ları gibi değerler bu dosyalarda yer alır.
- Bunlar gerçek secret sınıfındadır ve repo’ya commit edilmeleri güvenlik ihlali sayılır.
- Herhangi bir geliştirici bu dosyaları local’de oluştursa bile `.gitignore` tarafından engellenmelidir.

Ortam değişkenleri nereden gelir:
- **GitHub Actions**: Repository Settings → Secrets and Variables → Actions Secrets
- **Vercel**: Project Settings → Environment Variables (ortam bazlı: Production, Preview, Development)
- **EAS Build (Expo)**: `eas secret:create` komutu ile oluşturulan secret’lar

Her ortam için ayrı secret set’i tanımlanır. Staging ortamı production secret’larını **asla** kullanmaz.

## 9.8. Build-time vs Runtime Ayrımı

Bu ayrımın anlaşılması kritiktir çünkü yanlış anlaşıldığında secret’lar client bundle’a gömülür.

**Build-time injection (Vite):**
- Vite’da `VITE_` prefix’i ile başlayan tüm environment variable’lar build sırasında bundle’a **fiziksel olarak gömülür**.
- Bu demektir ki `VITE_API_KEY=abc123` yazarsanız, bu değer production JS bundle’ı içinde **açık metin olarak** yer alır.
- Bundle’ı indiren herkes bu değeri görebilir (DevTools → Sources → bundle dosyası).
- Bu nedenle `VITE_` prefix’li variable’lara **yalnızca public config** yazılır.
- Gerçek secret (ör: admin API key, service account credential, database URL) asla `VITE_` prefix’li variable’a konmaz.

**Runtime secret — backend’de tutulmalı:**
- Gerçek API key’ler, service credential’lar, signing key’ler backend tarafında tutulur.
- Client, bu secret’lara doğrudan erişmez; backend üzerinden proxy edilir.
- Örnek: Üçüncü parti ödeme API key’i client’a verilmez. Client, backend’e istek atar, backend kendi key’i ile üçüncü parti servise bağlanır.

**Sık yapılan hata:**
```
# YANLIŞ — bu secret build-time’da bundle’a gömülür, herkes görebilir
VITE_STRIPE_SECRET_KEY=sk_live_xxx

# DOĞRU — yalnızca public identifier client’a verilir
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_xxx
```

## 9.9. Expo’da Environment Variable Yönetimi

Expo/React Native tarafında environment variable yönetimi web’den farklı mekanizmalarla çalışır.

**`app.config.ts` ile build-time injection:**
- Expo’da `app.config.ts` (veya `app.config.js`) dosyası build-time’da `process.env` üzerinden environment variable’lara erişir.
- Bu değerler `expo-constants` aracılığıyla runtime’da okunabilir hale gelir.

```typescript
// app.config.ts
export default {
  expo: {
    name: "MyApp",
    extra: {
      apiUrl: process.env.API_URL,
      sentryDsn: process.env.SENTRY_DSN,
      featureNewProfile: process.env.FEATURE_NEW_PROFILE === "true",
    },
  },
};
```

```typescript
// uygulama içinde erişim
import Constants from "expo-constants";

const apiUrl = Constants.expoConfig?.extra?.apiUrl;
```

**EAS Build ile ortam farkı:**
- `eas.json` dosyasında her build profili için farklı environment variable set’i tanımlanır.

```json
{
  "build": {
    "development": {
      "env": {
        "API_URL": "https://dev-api.example.com",
        "SENTRY_DSN": ""
      }
    },
    "staging": {
      "env": {
        "API_URL": "https://staging-api.example.com"
      }
    },
    "production": {
      "env": {
        "API_URL": "https://api.example.com"
      }
    }
  }
}
```

- Secret değerler (ör: signing credential) `eas.json` içine **yazılmaz**. Bunlar `eas secret:create` ile EAS secret store’a eklenir ve build sırasında otomatik inject edilir.

**Kritik nokta:** Expo’da da web’deki ile aynı ilke geçerlidir — `extra` alanına yazılan her şey uygulamanın binary’sine gömülür. Binary reverse-engineer edilebilir. Bu nedenle `extra` alanına yalnızca public config yazılır, gerçek secret yazılmaz.

## 9.10. Zorunlu vs Opsiyonel Variable Ayrımı ve Build-time Validation

Bazı environment variable’lar olmadan uygulama çalışamaz (ör: API URL). Bazıları ise opsiyoneldir (ör: analytics tracking ID — yoksa analytics çalışmaz ama uygulama çalışır).

**Fail-fast ilkesi:**
Zorunlu variable eksikse build **başlamadan önce** hata verilmelidir. Uygulamanın ayağa kalkıp runtime’da belirsiz hatalar vermesi kabul edilmez.

**Validation script:**
Proje kök dizininde `scripts/validate-env.ts` (veya `.js`) dosyası bulunmalıdır. Bu script build pipeline’ının ilk adımı olarak çalışır.

```typescript
// scripts/validate-env.ts

// Zorunlu variable listesi — burada tanımlanan her variable’ın
// build ortamında mevcut olması gerekir, yoksa build fail olur
const requiredVariables = [
  "VITE_API_URL",
  "VITE_APP_VERSION",
];

// Opsiyonel ama önerilen variable’lar — eksikse uyarı verir ama build fail olmaz
const recommendedVariables = [
  "VITE_SENTRY_DSN",
  "VITE_ANALYTICS_ID",
];

const missing: string[] = [];
const warnings: string[] = [];

for (const varName of requiredVariables) {
  if (!process.env[varName]) {
    missing.push(varName);
  }
}

for (const varName of recommendedVariables) {
  if (!process.env[varName]) {
    warnings.push(varName);
  }
}

if (warnings.length > 0) {
  console.warn(
    `⚠ Opsiyonel ama önerilen variable’lar eksik: ${warnings.join(", ")}`
  );
}

if (missing.length > 0) {
  console.error(
    `✖ Zorunlu environment variable’lar eksik: ${missing.join(", ")}`
  );
  console.error("Build iptal edildi. .env.example dosyasını kontrol edin.");
  process.exit(1);
}

console.log("✔ Tüm zorunlu environment variable’lar mevcut.");
```

Bu script `package.json`’da build komutunun önüne eklenir:

```json
{
  "scripts": {
    "validate-env": "tsx scripts/validate-env.ts",
    "build": "npm run validate-env && vite build",
    "build:mobile": "npm run validate-env && eas build"
  }
}
```

CI/CD pipeline’ında da aynı script çalıştırılarak secret eksikliği anında tespit edilir.

## 9.11. Secret Injection — CI/CD Ortamında

Gerçek secret değerler hiçbir zaman dosya olarak repo’da bulunmaz. CI/CD pipeline’ında şu kaynaklardan inject edilir:

**GitHub Actions:**
```yaml
# .github/workflows/deploy.yml
env:
  VITE_API_URL: ${{ secrets.VITE_API_URL }}
  VITE_SENTRY_DSN: ${{ secrets.VITE_SENTRY_DSN }}
```
- Secret’lar GitHub repository settings’te tanımlanır.
- GitHub Actions, secret değerleri log output’unda otomatik olarak `***` ile maskeler.
- Yine de dikkatli olunmalıdır: secret’ı bir komutun argümanı olarak geçirmek bazı durumlarda log’a sızabilir. Daima environment variable olarak geçirmek tercih edilir.

**Vercel:**
- Vercel dashboard’da Environment Variables bölümünden eklenir.
- Her ortam (Production, Preview, Development) için ayrı değer atanabilir.
- Build sırasında otomatik inject edilir.

**EAS Build (Expo):**
```bash
eas secret:create --name API_URL --value "https://api.example.com" --scope project
```
- Secret’lar EAS cloud’da şifreli saklanır.
- Build sırasında `process.env` üzerinden erişilebilir olur.
- Local development’ta bu secret’lar mevcut olmaz; local için `.env.local` kullanılır.

**Genel kurallar:**
- Secret değerler **asla** CI/CD log output’unda açık metin olarak görünmemelidir.
- Pipeline’da `echo $SECRET_VALUE` veya `printenv` gibi komutlar **yasaktır**.
- Secret rotation (periyodik değiştirme) planı olmalıdır. Rotation yapıldığında tüm ortamlar güncellenir.

## 9.12. Environment Yönetiminde Hatalı Yaklaşımlar

Aşağıdaki davranışlar bu proje kapsamında açıkça yanlış ve kabul edilmez:

1. **`.env.production` dosyasını repo’ya commit etmek:** Bu dosya gerçek production secret’ları içerir. Repo’ya girmesi durumunda tüm secret’lar compromise olmuş sayılır ve derhal rotate edilmelidir.

2. **API key’i client-side variable’a koymak:** `VITE_STRIPE_SECRET_KEY`, `VITE_DATABASE_URL` gibi gerçek secret’lar build-time’da bundle’a gömülür. Bu değerler herkes tarafından görülebilir. Gerçek secret’lar backend’de tutulmalıdır.

3. **`.env.example` dosyasını güncel tutmamak:** Yeni bir environment variable eklendikten sonra `.env.example` güncellenmezse, diğer geliştiriciler bu variable’ın varlığından haberdar olmaz. Uygulamaları sessizce bozulur veya eksik konfigürasyonla çalışır. `.env.example` güncellemesi, variable ekleyen PR’ın **parçası** olmalıdır.

4. **Tüm ortamlarda aynı değerleri kullanmak:** Development, staging ve production ortamları farklı API URL’lerine, farklı analytics ID’lerine ve farklı feature flag değerlerine sahip olmalıdır. Tüm ortamlarda aynı değer kullanmak, yanlışlıkla production verisini development’ta işlemek veya test verisini production’a göndermek riskini yaratır.

5. **Secret’ı Slack, e-posta veya ticket sisteminde paylaşmak:** Secret değerler yalnızca secret manager (GitHub Secrets, Vercel Environment Variables, EAS Secrets, 1Password, Vault vb.) üzerinden paylaşılır. Mesajlaşma kanalları güvenli değildir.

6. **Environment variable’ı hardcode etmek:** Kod içinde `const API_URL = "https://api.prod.example.com"` yazmak, ortam değişikliğini imkansız kılar ve secret sızıntısı riski yaratır. Tüm ortam bağımlı değerler environment variable üzerinden gelmelidir.

---

# 10. Web Tarafında Session ve Secret Sınırları

## 10.1. Canonical yaklaşım
`ADR-010` ile hizalı olarak web tarafında tercih edilen model:
- backend-managed secure cookie session

## 10.2. Neden?
Çünkü:
- raw token’ı JS yüzeyine gereksiz çıkarmaz
- local storage convenience modeline göre daha kontrollüdür
- auth artefact visibility surface’i daha küçük olur

## 10.3. Kural
Web’de access/refresh token modeli kaçınılmazsa:
- bu açık bir fallback kararıdır
- baseline değil istisnadır
- deterministic cleanup, observability sanitization ve storage risk değerlendirmesi ister

## 10.4. Zayıf davranışlar
- raw token’ı localStorage’a yazmak
- auth material’i generic Zustand store’a koymak
- session expiry olduğunda stale protected data’yı ekranda bırakmak

---

# 11. Mobile Tarafında Secure Storage Politikası

## 11.1. Canonical yaklaşım
`ADR-010` ile hizalı olarak mobile tarafında:
- secure storage adapter
- Expo-first baseline için secure store sınıfı çözüm

## 11.2. Neden?
Çünkü mobile cold start/session restore gerçekliği vardır.  
Ama bu ihtiyaç generic non-secure storage ile çözülemez.

## 11.3. Kural
Session artefact’ları:
- AsyncStorage benzeri convenience storage’a yazılmaz
- UI preference storage ile aynı katmana koyulmaz
- random helper’lardan erişilmez

## 11.4. Zayıf davranışlar
- auth token’ı theme preference ile aynı store’da taşımak
- secure storage erişimini feature dosyalarına saçmak
- logout sonrası secure store cleanup’i belirsiz bırakmak

---

# 12. Generic State ile Security İlişkisi

## 12.1. Kural

Security açısından şu ayrım zorunludur:

- auth/session artefact
- sanitized UI-facing summary

Bu iki şey aynı state alanında yaşamaz.

## 12.2. UI-facing summary örnekleri
- `isAuthenticated`
- `sessionExpired`
- `userDisplayName`
- `workspaceSummary`
- `capabilitySummary`

## 12.3. State’e girmemesi gerekenler
- raw access token
- refresh token
- provider session internals
- credential materials
- confidential auth claims

## 12.4. Neden?
Çünkü:
- persistence yanlışlıkla açılabilir
- debug/devtools/analytics/log yüzeylerine sızabilir
- wrong-user leak riskini büyütür

---

# 13. Query Cache ve Security İlişkisi

## 13.1. Kural
Query cache convenience nedeniyle güvenlikten bağımsız düşünülemez.

## 13.2. Riskli durumlar
- user-bound data cache’inin logout sonrası kalması
- workspace switch sonrası eski veri görünmesi
- background refresh hatasında eski protected data’nın ekranda kalması
- persisted query cache açılıp wrong-user leak üretilmesi

## 13.3. Kural
Auth/session lifecycle:
- query cache lifecycle’ı etkiler
- cleanup deterministik olmalıdır

---

# 14. Formlar ve Hassas Veri

## 14.1. Kural
Formlar özellikle hassas veri sızıntısına açık yüzeydir.

## 14.2. Riskli alanlar
- login forms
- signup forms
- password reset
- MFA
- payment-like input patterns
- personal information forms

## 14.3. Asla yapılmaması gerekenler
- form values’u analytics event olarak göndermek
- raw validation payload’larını logs’a dökmek
- Sentry context içine tam form nesnesi koymak
- debug için gerçek credential value saklamak

## 14.4. Kural
Form debug çıktıları:
- sanitize edilmeli
- redacted olmalı
- default olarak kapalı olmalı

---

# 15. Logging Güvenliği

## 15.1. Kural
Log, güvenlikten bağımsız alan değildir.

## 15.2. Yasaklı veya çok riskli log içerikleri
- access token
- refresh token
- password
- email+password kombinasyonu
- raw auth response
- full user profile dumps
- full API response with PII
- credit-card-like or credential-like fields
- secure storage content
- raw session cookies

## 15.3. Structured logging neden önemli?
Çünkü:
- tam object dump yerine kontrollü alanlar loglanır
- redaction uygulanabilir
- severity sınıflanabilir
- noise ve leak riski düşer

## 15.4. Zayıf davranışlar
- `console.log(user)`
- `console.log(error.response)`
- `console.log(formValues)`
- prod ortamında debug spam

---

# 16. Error Tracking Güvenliği

## 16.1. Kural
Error tracking visibility sağlar; veri çöplüğü toplama sistemi değildir.

## 16.2. `ADR-009` ile hizalı ana ilke
Sentry veya eşdeğer araçlara:
- sanitized context gider
- raw secrets gitmez
- raw credentials gitmez
- unnecessary full payload gitmez

## 16.3. Özellikle dikkat edilmesi gereken alanlar
- custom error metadata
- request/response enrichment
- breadcrumbs
- user context
- tags
- release context
- device info

## 16.4. Zayıf davranışlar
- request body’yi olduğu gibi issue context’e eklemek
- auth failure’da token’ı loglamak
- custom error helper içinde PII taşıyan object geçirmek

---

# 17. Analytics Güvenliği

## 17.1. Kural
Analytics event’leri PII toplama sistemi değildir.

## 17.2. `ADR-009` ile hizalı ana ilke
Analytics:
- event contract-first
- payload minimal
- privacy-safe
olmalıdır.

## 17.3. Yasaklı payload eğilimleri
- free-text user input
- auth credentials
- full form payload
- full user object
- raw error messages from backend
- hidden internal identifiers not needed for business meaning

## 17.4. Doğru payload yaklaşımı
- coarse outcome
- step number
- event class
- feature surface id
- selected option type
- status classification

---

# 18. Debug Surface Güvenliği

## 18.1. Kural
Debug screen, panel veya diagnostics yüzeyleri güvenlikten muaf değildir.

## 18.2. Riskli yüzeyler
- build info panels
- network inspectors
- query cache viewers
- auth diagnostics
- feature flag screens
- support/debug menus

## 18.3. Güvenli tasarım ilkeleri
- dev/test ortamında daha görünür
- prod’da kapalı veya çok kontrollü
- secrets göstermez
- raw tokens göstermez
- full payload dump etmez
- support için bile gereksiz hassas veri açmaz

## 18.4. Zayıf davranışlar
- production debug drawer
- support panelinde raw auth/session data
- query cache complete JSON dump
- environment panelinde secrets görünmesi

---

# 19. Secure Defaults Politikası

## 19.1. Kural
Varsayılanlar güvenli olmalıdır; güvenlik ek seçenek olmamalıdır.

## 19.2. Ne anlama gelir?
- logs default redacted olur
- auth artefact generic state’e gitmez
- analytics minimal payload ile başlar
- prod diagnostics minimal olur
- env template public/private ayrımı açık verir
- preview/release ortamları gerçek secrets’i gereksiz paylaşmaz

## 19.3. Zayıf davranış
“İstersen güvenli kullanırsın” modeli.  
Bu proje için yetersizdir.

---

# 20. Dependency Güvenliği

## 20.1. Kural
Security-sensitive dependency’ler yüksek riskli sınıftır.

## 20.2. Özellikle dikkat gerektiren aileler
- auth SDK’ları
- storage libraries
- analytics SDK’ları
- observability SDK’ları
- crypto helpers
- native bridges
- network middleware / interceptors

## 20.3. `37-dependency-policy.md` ile bağ
Bu belgede security-sensitive dependency kararı:
- normal utility addition sayılmaz
- explicit review gerektirir
- bazen ADR gerektirir

---

# 21. Version Drift ve Security

## 21.1. Kural
Güncel olmayan dependency yalnızca DX sorunu değildir; security riski de olabilir.

## 21.2. Ama dikkat
“En yeni sürüm = otomatik güvenlik” gibi yüzeysel yaklaşım da doğru değildir.

## 21.3. Doğru model
- `38-version-compatibility-matrix.md` içindeki canonical hat korunur
- security patch gerekirse kontrollü upgrade yapılır
- compatibility ve regression riski birlikte değerlendirilir

---

# 22. Wrong-User Leak Politikası

## 22.1. En kritik pratik güvenlik riski
Bu repo için en önemli istemci tarafı risklerden biri:
- **wrong-user leak**

## 22.2. Nasıl oluşur?
- logout sonrası cache temizlenmez
- user switch sonrası drafts kalır
- workspace switch sonrası eski data görünür
- persisted summary state yanlış scope ile tutulur
- app restore akışı eski kullanıcı datasını kısa süre gösterir

## 22.3. Kural
Logout, user switch, workspace switch ve expiry:
- cleanup contract ile ele alınmalıdır

Bu alan yalnızca UX konusu değil; security/privacy konusudur.

---

# 23. Environment-Specific Behavior

## 23.1. Local
- daha fazla diagnostics olabilir
- ama gerçek secrets repo’ya veya paylaşılabilir dosyalara taşınmaz

## 23.2. Test
- deterministic test secrets / fixtures kullanılabilir
- gerçek production credentials kullanılmaz

## 23.3. Preview
- gerçek prod secret erişimi minimumda tutulur
- sanitize edilmiş integrations tercih edilir
- preview linkleri hassas veri saçmamalıdır

## 23.4. Staging
- prod-benzeri olabilir
- ama diagnostics ve access kontrolü düşünülmelidir

## 23.5. Production
- observability kontrollü
- debug yüzeyleri minimal
- secrets runtime/client yüzeyine açılmaz

---

# 24. Security Incident Visibility

## 24.1. Kural
Güvenlik riski yaratabilecek failure’lar görünmez bırakılmaz.

## 24.2. Örnek sınıflar
- repeated auth restore failure
- refresh loop
- permission mismatch anomaly
- unexpected protected data visibility
- secure storage read/write anomalies
- redaction failure class
- observability payload sanitation issues

## 24.3. Not
Bu tam security monitoring sistemi değildir.  
Ama görünmez güvenlik bozulması da kabul edilmez.

---

# 25. Merge Öncesi Minimum Güvenlik Kontrolleri

Her güvenlik açısından anlamlı değişiklikte şu sorular zorunludur:

1. Bu değişiklik yeni bir secret surface açıyor mu?
2. Bu veri istemciye geldikten sonra gerçekten gizli kalabilir mi?
3. Auth/session artefact generic state veya unsafe storage’a sızıyor mu?
4. Logs / analytics / Sentry context sanitize mi?
5. Logout/user switch cleanup etkileniyor mu?
6. Query cache veya persisted data wrong-user leak riski taşıyor mu?
7. Yeni dependency security-sensitive sınıfta mı?
8. Env/public/private ayrımı açık mı?

---

# 26. Audit ve DoD Etkisi

Bu belge aşağıdaki operasyonel sonuçları doğurur:

## 26.1. `31-audit-checklist.md`
Aşağıdaki yeni explicit kontrol ailelerini taşımalıdır:
- secret leakage
- wrong-user leak
- observability payload hygiene
- auth artefact misuse
- environment classification drift

## 26.2. `32-definition-of-done.md`
Security-relevant change için done koşulları içinde şunlar aranmalıdır:
- storage/state review
- logging/analytics sanitization
- cleanup path validation
- docs sync if security boundary changed

---

# 27. KVKK / GDPR Uyumu Standardı

## 27.1. Nedir?

**KVKK** (Kişisel Verilerin Korunması Kanunu) Türkiye’de yürürlükte olan, kişisel verilerin işlenmesini düzenleyen kanundur (6698 sayılı kanun).  
**GDPR** (General Data Protection Regulation) Avrupa Birliği’nde geçerli olan, kişisel verilerin korunmasına ilişkin kapsamlı düzenlemedir.

Her iki düzenlemenin ortak noktası şudur: Kişisel veri toplayan, işleyen veya saklayan her uygulama bu yasalara uymak **zorundadır**. Uygulamanın büyüklüğü, kullanıcı sayısı veya ticari amacı bu zorunluluğu ortadan kaldırmaz.

Kişisel veri tanımı geniştir:
- Ad, soyad, e-posta adresi, telefon numarası
- IP adresi, cihaz kimliği, konum bilgisi
- Kullanıcı davranış verileri (tıklama, gezinme, arama geçmişi)
- Profil fotoğrafı, biyometrik veri
- Sağlık, din, etnik köken gibi özel nitelikli veriler (bu kategoride ek koruma gerekir)

## 27.2. Bu Projeyi Neden İlgilendirir?

Bu boilerplate ile geliştirilen uygulamalar büyük olasılıkla şu verileri işleyecektir:

- **Kullanıcı kaydı:** E-posta, şifre, ad-soyad, telefon numarası gibi kişisel bilgiler toplanır.
- **Profil bilgisi:** Kullanıcının kendisi hakkında girdiği bilgiler (biyografi, profil fotoğrafı, konum vb.) kişisel veridir.
- **Analytics verisi:** Google Analytics, Mixpanel, Amplitude gibi araçlar kullanıcı davranışlarını izler. Bu veriler cookie, device ID veya kullanıcı ID’si ile ilişkilendirildiğinde kişisel veri haline gelir.
- **Hata izleme logları:** Sentry gibi araçlar hata anında kullanıcı bilgisini (e-posta, kullanıcı ID, cihaz bilgisi) toplayabilir.
- **Üçüncü parti SDK’lar:** Firebase, Facebook SDK, reklam SDK’ları gibi araçlar kendi veri toplama mekanizmalarına sahiptir.

Bu nedenle KVKK/GDPR uyumu “ileride düşünülecek” bir konu değil, **mimari seviyede baştan ele alınması gereken** bir gerekliliktir.

## 27.3. Temel İlkeler

### 27.3.1. Lawful Basis (Hukuki Dayanak)

Kişisel veri toplamak için meşru bir hukuki gerekçe olmalıdır. GDPR altında altı hukuki dayanak vardır:

1. **Açık rıza (Consent):** Kullanıcı bilgilendirilmiş ve özgür iradesiyle onay vermiştir.
2. **Sözleşme (Contract):** Veri işleme, kullanıcıyla yapılan sözleşmenin ifası için gereklidir (ör: e-ticaret siparişi için adres bilgisi).
3. **Yasal yükümlülük (Legal obligation):** Vergi kanunu gereği fatura bilgilerinin saklanması gibi.
4. **Hayati menfaat (Vital interest):** Acil sağlık durumlarında kişinin hayatını kurtarmak için.
5. **Kamu görevi (Public task):** Kamu otoritelerinin yasal görevlerini yerine getirmesi.
6. **Meşru menfaat (Legitimate interest):** Veri sorumlusunun meşru çıkarları (ör: dolandırıcılık önleme). Kullanıcının hakları ile dengelenmeli.

Her veri toplama noktasında hangi hukuki dayanak kullanıldığı **belgelenmeli** ve gizlilik politikasında açıkça belirtilmelidir.

KVKK’da benzer şekilde açık rıza, sözleşme, yasal yükümlülük, kamu güvenliği, meşru menfaat gibi dayanaklar mevcuttur (KVKK md. 5).

### 27.3.2. Purpose Limitation (Amaç Sınırlılığı)

Toplanan veri yalnızca **belirtilen amaç** için kullanılabilir.

- Kullanıcıdan “hesap oluşturmak için” toplanan e-posta adresi, ayrı rıza alınmadan pazarlama e-postası göndermek için kullanılamaz.
- “İleride lazım olabilir” gerekçesiyle veri toplanmaz.
- Veri toplama amacı değişirse kullanıcı yeniden bilgilendirilmeli ve gerekiyorsa yeniden rıza alınmalıdır.

### 27.3.3. Data Minimization (Veri Minimizasyonu)

Yalnızca **gerçekten gerekli olan** veri toplanır.

- Kayıt formunda zorunlu olmayan alanlar opsiyonel olmalıdır.
- Cinsiyet, doğum tarihi, telefon numarası gibi alanlar hizmet için gerekli değilse toplanmamalıdır.
- API response’larında client’a yalnızca gerekli alanlar gönderilir (over-fetching yapılmaz).
- Analytics event’lerinde yalnızca iş anlamı taşıyan coarse data toplanır, granüler kişisel veri toplanmaz.

### 27.3.4. Storage Limitation (Saklama Sınırı)

Veri, amacı için gerekli olan süreden fazla saklanamaz.

- Her veri türü için retention period (saklama süresi) tanımlanmalıdır.
- Süre dolduğunda veri silinmeli veya anonimleştirilmelidir.
- “Her şeyi sonsuza kadar saklayalım” yaklaşımı hem yasalara aykırıdır hem de güvenlik yüzeyini büyütür.
- Detaylı retention süreleri bu belgenin **Data Retention Politikası** bölümünde tanımlanmıştır.

### 27.3.5. Accuracy (Doğruluk)

Kişisel veri doğru ve güncel tutulmalıdır.

- Kullanıcıya kendi bilgilerini görüntüleme ve güncelleme imkanı sunulmalıdır (profil düzenleme sayfası).
- Yanlış veya eksik veri düzeltilmelidir.
- Kullanıcı talep ettiğinde yanlış verilerin düzeltilmesi gerekir.

### 27.3.6. Integrity and Confidentiality (Bütünlük ve Gizlilik)

Kişisel veri güvenli saklanmalı, yetkisiz erişime, kazara kayba veya tahribe karşı korunmalıdır.

- Veri aktarımı TLS/HTTPS üzerinden yapılmalıdır.
- Hassas veriler (şifre) hash’lenerek saklanmalıdır.
- Veritabanı erişimi yetkilendirme ile kontrol edilmelidir.
- Client-side’da kişisel veri SecureStore / EncryptedStorage gibi güvenli mekanizmalarda tutulmalıdır.
- Bu belgenin diğer bölümlerinde tanımlanan tüm güvenlik ilkeleri bu maddenin uygulanmasına katkı sağlar.

## 27.4. Uygulama Gereksinimleri

### 27.4.1. Gizlilik Politikası

Web ve mobile uygulamada erişilebilir bir gizlilik politikası sayfası **zorunludur**.

Gizlilik politikası şunları açıkça belirtmelidir:
- Hangi kişisel veriler toplanıyor (ör: e-posta, ad, IP adresi, cihaz bilgisi, kullanım verileri)
- Her veri neden toplanıyor (ör: hesap oluşturma, hata izleme, kullanım analizi)
- Veriler kimlerle paylaşılıyor (ör: Sentry, Google Analytics, ödeme sağlayıcısı)
- Veriler ne kadar süre saklanıyor
- Kullanıcının hakları nelerdir (erişim, düzeltme, silme, taşınabilirlik, itiraz)
- Veri sorumlusunun iletişim bilgileri
- Cookie kullanımı ve yönetimi

Gizlilik politikası:
- Anlaşılır dilde yazılmalıdır (hukuk jargonu minimumda tutulmalı).
- Kayıt sayfasından, footer’dan ve uygulama ayarlarından erişilebilir olmalıdır.
- Güncellendiğinde kullanıcılar bilgilendirilmelidir.
- App Store ve Google Play Store yayın gereksinimleri gereği de zorunludur.

### 27.4.2. Açık Rıza (Consent)

Kişisel veri toplanmadan önce kullanıcıdan **açık rıza** alınmalıdır.

Kurallar:
- Rıza checkbox’ı varsayılan olarak **İŞARETSİZ** olmalıdır. Pre-checked consent (önceden işaretli kutu) hem GDPR hem KVKK kapsamında **geçersizdir**.
- Rıza metni açık ve anlaşılır olmalıdır. “Koşulları kabul ediyorum” gibi belirsiz ifadeler yetersizdir.
- Farklı amaçlar için ayrı rıza alınmalıdır. “Hepsini kabul et” sunulabilir ama her amaç ayrı ayrı da seçilebilmelidir.
- Rıza geri alınabilir olmalıdır. Kullanıcı daha önce verdiği onayı her zaman geri çekebilmelidir.
- Rıza kaydı tutulmalıdır: kim, ne zaman, hangi amaç için onay verdi. Bu kayıt denetim (audit) için gereklidir.

### 27.4.3. Veri Erişim Hakkı (Right of Access)

Kullanıcı, kendisi hakkında hangi kişisel verilerin toplandığını ve işlendiğini öğrenme hakkına sahiptir.

- Kullanıcı talep ettiğinde kendisine ait tüm kişisel veriler sunulmalıdır.
- GDPR’da bu talebe **30 gün** içinde yanıt verilmesi zorunludur.
- KVKK’da “makul süre” ifadesi kullanılır; pratikte 30 gün uygulanır.
- Uygulama içinde “Verilerimi görüntüle” veya “Veri dışarı aktarımı” özelliği sunulması önerilir.

### 27.4.4. Silme Hakkı (Right to Be Forgotten)

Kullanıcı, kişisel verilerinin silinmesini talep edebilir.

- Kullanıcı hesabını silmek istediğinde tüm kişisel verileri **tüm sistemlerden** silinmelidir.
- “Tüm sistemler” şunları kapsar:
  - Primary database (kullanıcı tablosu, profil, içerik)
  - Analytics verileri (kullanıcıya bağlı event’ler)
  - Error tracking logları (Sentry’de kullanıcı bilgisi)
  - Backup’lar (backup retention süresi içinde silme planlanmalı)
  - Üçüncü parti servisler (e-posta servisi, CRM, ödeme sağlayıcısı)
  - Cache (Redis, CDN cache)
  - Log dosyaları
- Silme işlemi onaylandıktan sonra 30 gün içinde tamamlanmalıdır.
- Yasal zorunluluk gereği saklanması gereken veriler (ör: fatura bilgileri) bu haktan muaf tutulabilir, ancak kullanıcıya bilgi verilmelidir.

### 27.4.5. Veri Taşınabilirliği (Right to Data Portability)

Kullanıcı, kişisel verilerini **makine-okunur formatta** (JSON, CSV) dışarı aktarabilmelidir.

- Kullanıcı “Verilerimi indir” özelliği ile kendi verilerini alabilmelidir.
- Format yapılandırılmış ve yaygın kullanılan olmalıdır (JSON tercih edilir, CSV alternatif).
- Export edilen veri: profil bilgileri, oluşturulan içerikler, tercihler, aktivite geçmişi.
- Export edilen veride diğer kullanıcıların kişisel verisi **bulunmamalıdır**.

### 27.4.6. Veri İhlali Bildirimi

Kişisel veri ihlali (data breach) durumunda bildirim zorunluluğu vardır.

- **GDPR:** Yetkili kuruma (Supervisory Authority) **72 saat** içinde bildirim zorunlu. Eğer ihlal kullanıcılar için yüksek risk oluşturuyorsa kullanıcılara da bildirim yapılmalıdır.
- **KVKK:** Kişisel Verileri Koruma Kurulu’na ve ilgili kişilere **en kısa sürede** bildirim zorunlu.

Bildirimde şunlar yer almalıdır:
- İhlalin niteliği (hangi veriler etkilendi)
- Etkilenen kişi sayısı (tahmini olabilir)
- Olası sonuçlar
- Alınan ve alınacak önlemler

Bu nedenle bir **incident response planı** hazırlanmalıdır.

## 27.5. Frontend’de Dikkat Edilecekler

Bu bölüm, KVKK/GDPR uyumunun doğrudan frontend geliştirme sürecini etkilediği noktaları detaylandırır.

- **Analytics event’lerinde kişisel veri gönderme:**
  - Analytics event payload’larına e-posta adresi, telefon numarası, ad-soyad gibi kişisel veriler **eklenmez**.
  - Kullanıcı tanımlaması gerekiyorsa anonimleştirilmiş ID kullanılır.
  - Yanlış: `analytics.track(“purchase”, { email: “user@mail.com”, phone: “5551234567” })`
  - Doğru: `analytics.track(“purchase”, { userId: “hash_abc123”, itemCount: 3 })`

- **Sentry’de kullanıcı bilgisi redaction:**
  - Sentry’ye gönderilen error context’inde kişisel veri **redact** edilmelidir.
  - `beforeSend` hook’u kullanılarak hassas alanlar temizlenir.
  - Kullanıcı e-postası, IP adresi, request body içindeki kişisel veriler Sentry’ye gitmemelidir.

- **localStorage / AsyncStorage’da kişisel veri:**
  - Kişisel veri client-side’da mümkün olduğunca **saklanmamalıdır**.
  - Saklanması gerekiyorsa şifreli tutulmalıdır (SecureStore, EncryptedStorage).
  - Oturum sonlandığında kişisel veri temizlenmelidir.

- **Üçüncü parti SDK’ların GDPR uyumu:**
  - Kullanılan her üçüncü parti SDK’nın (Google Analytics, Firebase, Facebook SDK, Sentry, Mixpanel vb.) GDPR-uyumlu olduğu doğrulanmalıdır.
  - SDK’ların Data Processing Agreement (DPA) sunduğundan emin olunmalıdır.
  - SDK’ların veri toplamaya kullanıcı consent’i vermeden **başlamaması** sağlanmalıdır.

## 27.6. Hatalı Yaklaşımlar

1. **”Biz küçük bir projeyiz, KVKK/GDPR bizi ilgilendirmez”:** Yanlış. Tek bir kullanıcının kişisel verisini işleseniz bile bu yasalar geçerlidir. Yaptırımlar ciddidir: GDPR kapsamında yıllık cironun %4’üne kadar veya 20 milyon Euro’ya kadar ceza; KVKK kapsamında 1.966.862 TL’ye kadar idari para cezası (2024 güncellemesi).

2. **Gizlilik politikası olmadan launch etmek:** Hem yasal zorunluluktur hem de App Store/Google Play Store yayın gereksinimlerinden biridir. Gizlilik politikası olmadan uygulama yayınlanamaz veya yayından kaldırılabilir.

3. **Pre-checked consent checkbox:** Kullanıcı hiçbir işlem yapmadan checkbox’ın işaretli gelmesi, GDPR kapsamında geçerli rıza sayılmaz. Checkbox varsayılan olarak **boş** olmalıdır.

4. **Silme talebinde veriyi yalnızca DB’den silip log/analytics’te bırakmak:** Silme hakkı tüm sistemleri kapsar. Kullanıcı verisinin Sentry’de, analytics platformunda, backup’larda ve log dosyalarında kalması ihlaldir. Silme işlemi tüm veri noktalarını kapsamalıdır.

5. **”Veriyi anonimleştirdik” demek ama gerçekten anonimleştirmemek:** Pseudonymization (takma ad verme) ile anonymization (anonim hale getirme) farklı şeylerdir. Kullanıcı ID’sini hash’lemek ama diğer alanlardan (IP, cihaz, davranış) kişiyi yeniden tanımlamak mümkünse veri hâlâ kişisel sayılır.

---

# 28. Cookie Consent Yönetimi

## 28.1. Nedir?

Cookie consent (çerez onayı), web uygulamasının kullanıcının tarayıcısına cookie (çerez) yerleştirmeden **önce** izin alması gerekliliğidir. Bu gereklilik GDPR ve ePrivacy Directive (2002/58/EC, “Cookie Directive” olarak da bilinir) kapsamında zorunludur.

Cookie, web sitesi tarafından kullanıcının tarayıcısına yerleştirilen küçük metin dosyalarıdır. Oturum yönetimi, tercih hatırlama, analiz ve reklam hedefleme gibi amaçlarla kullanılır. Ancak kullanıcının bilgisi ve onayı olmadan cookie yerleştirmek hukuka aykırıdır.

## 28.2. Cookie Kategorileri

Tüm cookie’ler aynı hassasiyette değildir. Dört ana kategori vardır ve her kategorinin rıza gerekliliği farklıdır:

### 28.2.1. Essential (Zorunlu) Cookie’ler

**Tanım:** Web uygulamasının temel işlevselliği için zorunlu olan cookie’ler.

**Örnekler:**
- Oturum yönetimi cookie’si (session ID)
- CSRF (Cross-Site Request Forgery) koruma token’ı
- Yük dengeleme (load balancer) cookie’si
- Cookie consent tercih kaydı (consent cookie’nin kendisi)
- Güvenlik cookie’leri

**Rıza durumu:** Bu cookie’ler için **ayrıca rıza gerekmez**. Ancak kullanıcı bu cookie’lerin kullanıldığı konusunda **bilgilendirilmelidir**.

### 28.2.2. Analytics (Analitik) Cookie’ler

**Tanım:** Ziyaretçi istatistikleri, sayfa görüntüleme sayıları, kullanıcı davranış analizi gibi verileri toplamak için kullanılan cookie’ler.

**Örnekler:**
- Google Analytics cookie’leri (`_ga`, `_gid`, `_gat`)
- Mixpanel cookie’leri
- Hotjar, Clarity gibi oturum kayıt araçları

**Rıza durumu:** **Rıza gerekir.** Kullanıcı onay vermeden bu cookie’ler yerleştirilemez ve ilgili script’ler çalıştırılamaz.

### 28.2.3. Marketing (Pazarlama) Cookie’ler

**Tanım:** Reklam hedefleme, retargeting (yeniden hedefleme), kullanıcı profili oluşturma amacıyla kullanılan cookie’ler.

**Örnekler:**
- Facebook Pixel cookie’leri
- Google Ads remarketing cookie’leri
- LinkedIn Insight Tag
- Twitter Pixel

**Rıza durumu:** **Rıza gerekir.** Kullanıcı onay vermeden bu cookie’ler yerleştirilemez.

### 28.2.4. Functional (İşlevsel) Cookie’ler

**Tanım:** Uygulamanın temel işlevselliği dışında kalan ek özellikleri destekleyen cookie’ler.

**Örnekler:**
- Dil tercihi cookie’si
- Tema tercihi (dark/light mode)
- Son görüntülenen ürünler listesi
- Chat widget tercihleri

**Rıza durumu:** **Genellikle rıza gerekir.** Bu cookie’ler olmadan site çalışabilir; sadece bazı ek özellikler eksik kalır.

## 28.3. Cookie Consent Banner

Kullanıcı web uygulamasına ilk kez geldiğinde cookie consent banner’ı gösterilir.

### 28.3.1. Banner İçeriği

Banner şu bilgileri içermelidir:
- Hangi cookie kategorilerinin kullanıldığının kısa açıklaması
- Her kategorinin ne amaçla kullanıldığı
- Detaylı bilgi için gizlilik politikasına / cookie politikasına link

### 28.3.2. Banner Butonları

Banner’da şu butonlar bulunmalıdır:

1. **”Tümünü Kabul Et”**: Tüm cookie kategorilerine onay verir. Kullanıcı tek tıkla kabul edebilir.
2. **”Yalnızca Zorunluları Kabul Et”**: Yalnızca essential cookie’lere izin verir. Analytics, marketing ve functional cookie’ler yerleştirilmez.
3. **”Tercihleri Yönet”** (veya “Ayarlar”): Kullanıcıyı detaylı tercih paneline yönlendirir; her kategoriyi ayrı ayrı açıp kapatabilir.

**Kritik:** “Tümünü Kabul Et” ve “Yalnızca Zorunluları Kabul Et” butonları **eşit görünürlükte** olmalıdır. Birini büyük, diğerini küçük veya soluk yapmak dark pattern sayılır.

### 28.3.3. Banner Davranışı

- Banner, kullanıcı bir seçim yapana kadar görünür kalır.
- Kullanıcı seçim yapmadan sayfayı kaydırması veya başka bir sayfaya geçmesi **onay sayılmaz**.
- Banner kapatma (X) butonu varsa, kapatma “yalnızca zorunlu” olarak değerlendirilir.
- Banner, kullanıcı tercih yaptıktan sonra kaybolur ve bir sonraki ziyarette tekrar gösterilmez (tercih cookie’de saklanır).

## 28.4. Tercih Yönetimi

Kullanıcı ilk seçimden sonra da tercihlerini değiştirebilmelidir.

- Web sitesinin footer bölümünde **”Cookie Tercihleri”** veya **”Çerez Ayarları”** linki bulunmalıdır.
- Bu link tıklandığında tercih paneli açılır ve kullanıcı her kategoriyi ayrı ayrı açıp kapatabilir.
- Değişiklik kaydedildiğinde ilgili cookie’ler anında silinmeli veya eklenmeli; sayfa yenilendiğinde yeni tercihler geçerli olmalıdır.
- Tercih panelinde her kategorinin açıklaması ve o kategorideki cookie listesi gösterilmelidir.
- Essential cookie’ler panelde gösterilir ama kapatılamaz (toggle disabled).

## 28.5. Teknik İmplementasyon

### 28.5.1. Consent State Yönetimi

Kullanıcının cookie tercihi `localStorage` veya bir essential cookie içinde saklanır. Bu saklama işleminin kendisi essential kategorisinde sayılır (consent kaydı, sitenin düzgün çalışması için gereklidir).

Örnek consent state yapısı:

```typescript
interface CookieConsent {
  essential: true; // her zaman true, değiştirilemez
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
  timestamp: string; // ISO 8601 formatında onay zamanı
  version: string; // consent politikası versiyonu
}
```

### 28.5.2. Conditional Script Loading

Analytics ve marketing script’leri **yalnızca ilgili kategori onaylandıktan SONRA** yüklenir. Bu kural kesindir.

```typescript
// DOĞRU — consent kontrolü sonrası yükleme
if (cookieConsent.analytics) {
  loadGoogleAnalytics();
}

if (cookieConsent.marketing) {
  loadFacebookPixel();
}

// YANLIŞ — consent kontrolü olmadan yükleme
// <script src=”https://www.googletagmanager.com/gtag/js” /> ← sayfa yüklendiğinde direkt çalışır
```

**Consent verilmeden şu servisler ÇALIŞMAMALIDUR:**
- Google Analytics / Google Tag Manager
- Facebook Pixel
- Hotjar / Microsoft Clarity
- LinkedIn Insight Tag
- Herhangi bir reklam/retargeting script’i
- Üçüncü parti analytics SDK’ları

### 28.5.3. Google Tag Manager (GTM) ile Entegrasyon

GTM kullanılıyorsa consent mode v2 entegrasyonu yapılmalıdır:

```javascript
// Varsayılan olarak tüm rıza tipleri “denied”
gtag(“consent”, “default”, {
  analytics_storage: “denied”,
  ad_storage: “denied”,
  ad_user_data: “denied”,
  ad_personalization: “denied”,
  functionality_storage: “denied”,
});

// Kullanıcı onay verdikten sonra güncelleme
gtag(“consent”, “update”, {
  analytics_storage: “granted”, // analytics kategorisi onaylandıysa
  ad_storage: “granted”, // marketing kategorisi onaylandıysa
});
```

## 28.6. Mobile Uygulamalarda Cookie Consent

Native mobile uygulamalarda (iOS, Android) browser cookie kavramı doğrudan geçerli değildir. Ancak **kullanıcı izleme (tracking)** için benzer rıza mekanizmaları zorunludur.

### 28.6.1. iOS — App Tracking Transparency (ATT)

- iOS 14.5’ten itibaren **ATT framework** zorunludur.
- Uygulama, IDFA (Identifier for Advertisers) kullanmadan önce kullanıcıdan açıkça izin istemelidir.
- ATT prompt’u sistem tarafından gösterilir; özelleştirilemez, yalnızca açıklama metni değiştirilebilir.
- Kullanıcı reddederse uygulama kullanıcıyı **izleyemez** (IDFA erişilemez olur).
- ATT reddedildiğinde: analytics anonim modda çalışır, reklam hedefleme yapılamaz, üçüncü parti SDK’lara user tracking ID gönderilmez.
- App Store, ATT gerekliliğini karşılamayan uygulamaları reddedebilir.

### 28.6.2. Android — GAID ve Consent

- Android’de GAID (Google Advertising ID) kullanımı için kullanıcı bilgilendirilmeli ve tercih sunulmalıdır.
- Google Play Store politikaları gereği kullanıcı GAID’yi sıfırlayabilmeli veya kişiselleştirilmiş reklamları kapatabilmelidir.
- Firebase Analytics ve Google Ads SDK’ları consent mode destekler.

## 28.7. Consent Kaydı (Audit Trail)

Hangi kullanıcı, ne zaman, hangi kategorilere onay verdiği **kaydedilmelidir**. Bu kayıt GDPR audit trail gerekliliğidir.

Kayıtta yer alması gereken bilgiler:
- **Timestamp:** Onayın verildiği tarih ve saat (UTC, ISO 8601)
- **IP adresi:** Onay anındaki IP (opsiyonel ama önerilen)
- **Consent scope:** Hangi kategoriler onaylandı, hangileri reddedildi
- **Consent version:** Gizlilik politikasının / consent metninin hangi versiyonu gösterildi
- **User agent:** Tarayıcı ve cihaz bilgisi

Bu kayıtlar backend’de saklanır ve denetim talep edildiğinde sunulabilir hale getirilir. Client-side’da yalnızca mevcut tercih saklanır; audit trail backend sorumluluğudur.

## 28.8. Hatalı Yaklaşımlar

1. **Cookie wall:** “Cookie’leri kabul etmezseniz siteye giremezsiniz” yaklaşımı. Bu, çoğu AB ülkesinde yasadışıdır çünkü rızanın **özgürce** verilmesi gerekir. Siteye erişimi cookie kabulüne bağlamak rızayı zorlamaktır.

2. **”Hepsini Kabul Et” butonunu büyük, “Reddet”i küçük yapmak:** Bu bir dark pattern’dır. GDPR düzenleyici otoriteleri bu tür tasarımları ihlal olarak değerlendirmektedir. Fransa’daki CNIL, Google ve Facebook’a bu nedenle ceza kesmiştir. Kabul ve reddet seçenekleri eşit erişilebilirlikte olmalıdır.

3. **Consent banner’ı göstermeden cookie set etmek:** Kullanıcı henüz bir tercih belirtmemişken analytics veya marketing cookie’lerini yerleştirmek doğrudan ihlaldir. İlk sayfa yüklenmesinde essential dışında **hiçbir cookie** set edilmemelidir.

4. **Consent kayıtlarını tutmamak:** GDPR, veri sorumlusunun rıza alındığını **ispat etmesini** gerektirir. Consent kaydı yoksa rıza alındığı ispatlanamaz ve bu ihlal sayılır.

5. **Consent banner’ı yalnızca AB kullanıcılarına göstermek:** Coğrafi hedefleme (geo-targeting) ile yalnızca AB IP’lerine banner göstermek risklidir. VPN, roaming, yanlış IP tespiti gibi durumlar sorun yaratır. En güvenli yaklaşım: tüm kullanıcılara banner göstermektir.

6. **Sayfayı kaydırmayı veya gezinmeyi “onay” saymak:** “Siteyi kullanmaya devam ederek cookie’leri kabul etmiş olursunuz” ifadesi GDPR kapsamında geçerli rıza **sayılmaz**. Kullanıcı aktif bir eylem (buton tıklama) ile onay vermelidir.

---

# 29. Data Retention Politikası

## 29.1. Nedir?

Data retention politikası, toplanan verilerin **ne kadar süre saklanacağını** ve süre dolduğunda **nasıl silineceğini veya anonimleştirileceğini** tanımlayan resmi politikadır.

Bu politika yalnızca bir “iyi niyet” beyanı değildir; KVKK/GDPR’ın “storage limitation” (saklama sınırı) ilkesinin doğrudan uygulanmasıdır. Veri, toplandığı amaç için gerekli olan süreden fazla saklanamaz.

## 29.2. Neden Gerekli?

Data retention politikası birden fazla kritik ihtiyacı karşılar:

1. **Yasal zorunluluk:** KVKK (md. 7) ve GDPR (md. 5/1-e) gereği veri gerektiğinden fazla saklanamaz. Retention politikası olmaması başlı başına bir ihlaldir.

2. **Güvenlik yüzeyi küçültme:** Ne kadar çok veri saklanırsa, bir veri ihlali durumunda etkilenen veri miktarı o kadar büyük olur. Gereksiz veriyi silmek, ihlal riskinin etkisini azaltır.

3. **Storage maliyeti:** Özellikle analytics verileri, loglar ve backup’lar zamanla büyük hacimler oluşturur. Retention politikası gereksiz depolama maliyetini kontrol altında tutar.

4. **Hukuki risk azaltma:** Elde tutulmayan veri, dava veya soruşturma sürecinde sorun oluşturamaz. Gereksiz veri saklamak, olası hukuki süreçlerde riski artırır.

5. **Kullanıcı güveni:** Kullanıcılara verilerin ne kadar süre saklanacağını açıkça belirtmek güven oluşturur ve şeffaflık ilkesini destekler.

## 29.3. Veri Türlerine Göre Retention Süreleri

Aşağıdaki tablo, veri türü bazında önerilen retention sürelerini ve süre dolduğundaki eylemi tanımlar. Bu süreler proje ihtiyaçlarına ve yasal gerekliliklere göre ayarlanabilir, ancak burada belirtilen değerler **varsayılan baseline** olarak kabul edilir.

### 29.3.1. Application Logs (Error, Debug, Info)

- **Retention süresi:** 90 gün
- **Süre dolduğunda:** Otomatik silme
- **Gerekçe:** Hata tespiti ve debugging için 90 gün yeterlidir. Daha eski loglar nadiren incelenir ve gereksiz güvenlik yüzeyi oluşturur.
- **Not:** Log’larda kişisel veri varsa (kullanıcı ID, IP, e-posta) bu loglar da retention’a tabidir. Mümkünse loglar anonimleştirilmiş veya pseudonymize edilmiş halde tutulmalıdır.

### 29.3.2. Analytics Event Verileri

- **Retention süresi:** 12 ay
- **Süre dolduğunda:** Anonimleştirme veya silme
- **Gerekçe:** İş analizi ve ürün kararları için 12 aylık veri genellikle yeterlidir. 12 ay sonra kişisel tanımlayıcılar kaldırılarak veri anonim hale getirilir; bu şekilde istatistiksel analiz yapılmaya devam edilebilir.
- **Not:** Google Analytics’in kendi retention ayarları vardır (14 ay, 26 ay, 38 ay, 50 ay veya otomatik silme yok). Bu ayar GDPR uyumluluğu için yapılandırılmalıdır.

### 29.3.3. Kullanıcı Hesap Verileri

- **Retention süresi:** Hesap aktif olduğu sürece + hesap silindikten sonra **30 gün** (grace period)
- **Süre dolduğunda:** Kalıcı silme (hard delete)
- **Gerekçe:** 30 günlük grace period, kullanıcının yanlışlıkla silme durumunda hesabını geri almasını sağlar. 30 gün sonunda tüm kişisel veri kalıcı olarak silinir.
- **Not:** Aktif olmayan hesaplar (ör: 24 aydır giriş yapılmamış) için kullanıcıya uyarı e-postası gönderildikten sonra hesap silinebilir veya anonim hale getirilebilir.

### 29.3.4. Finansal / Ödeme Verileri

- **Retention süresi:** Yasal zorunluluğa göre değişir
  - Türkiye: Vergi Usul Kanunu gereği **10 yıl**
  - AB: Ülkeye ve düzenlemeye göre **6-10 yıl** aralığında
- **Süre dolduğunda:** Kalıcı silme
- **Gerekçe:** Yasal zorunluluk nedeniyle uzun süre saklanması gerekir. Ancak bu veriler client-side’da **saklanmaz**. Backend ve güvenli veritabanında tutulur.
- **Not:** Kredi kartı numarası, CVV gibi hassas ödeme verileri uygulama tarafından **hiçbir zaman** saklanmaz; PCI DSS uyumlu ödeme sağlayıcısı (Stripe, Iyzico vb.) üzerinden işlenir.

### 29.3.5. Backup Verileri

- **Retention süresi:** Primary veriden silindikten sonra en fazla **30 gün** içinde backup’tan da silme
- **Süre dolduğunda:** Backup döngüsü ile otomatik silme
- **Gerekçe:** Silme hakkı (right to be forgotten) tüm kopyaları kapsar. Primary veritabanından silinen kişisel veri, backup’larda sonsuza kadar kalamaz.
- **Not:** Bu süre, backup rotation stratejisiyle hizalanmalıdır. 30 günlük rolling backup kullanan bir sistemde, 30 gün sonra en eski backup otomatik olarak silinecektir.

### 29.3.6. Session Verileri

- **Retention süresi:** Oturum sonlanmasıyla birlikte silme
- **Süre dolduğunda:** Anında silme
- **Gerekçe:** Session verileri yalnızca aktif oturum süresince anlamlıdır. Oturum kapandığında (logout, expiry, cihaz değişimi) session verileri temizlenmelidir.
- **Not:** Server-side session store (Redis, Memcached) TTL ile otomatik temizlenmelidir. Client-side session token’ları logout akışında silinmelidir.

### 29.3.7. Temporary Upload / Draft Verileri

- **Retention süresi:** 7 gün (kullanıcı bilgilendirilir)
- **Süre dolduğunda:** Otomatik silme
- **Gerekçe:** Kullanıcının kaydetmediği taslaklar ve geçici yüklemeler (ör: tamamlanmamış form, yüklenen ama gönderilmemiş dosya) 7 gün sonra silinir.
- **Not:** Kullanıcıya “Taslağınız 7 gün içinde otomatik olarak silinecektir” şeklinde bilgilendirme yapılmalıdır. Kullanıcı isterse taslağı daha erken silebilir.

## 29.4. Silme Yöntemleri

Veri silme işlemi farklı yöntemlerle yapılabilir. Her yöntemin kullanım yeri ve amacı farklıdır.

### 29.4.1. Soft Delete

- Veri veritabanında kalır ancak **”silinmiş” olarak işaretlenir** (ör: `deleted_at` timestamp eklenir).
- Uygulama bu veriyi sorgularda dışlar; kullanıcıya gösterilmez.
- **Grace period** boyunca (genellikle 30 gün) geri alma mümkündür.
- Grace period dolduğunda **hard delete** uygulanır.
- Kullanım yeri: Kullanıcı hesap silme, içerik silme gibi geri alınabilir olması gereken işlemler.

### 29.4.2. Hard Delete

- Veri veritabanından **fiziksel olarak** silinir.
- Geri alma mümkün değildir (backup’tan restore hariç).
- Silme işlemi tüm ilişkili tablolarda cascade olarak uygulanmalıdır.
- Kullanım yeri: Soft delete grace period’u dolan veriler, retention süresi dolan loglar, yasal silme talepleri.

### 29.4.3. Anonimleştirme

- Kişisel tanımlayıcılar kaldırılır veya geri dönüşü mümkün olmayacak şekilde değiştirilir.
- İstatistiksel veri kalır; kişiye bağlantı kurulamaz.
- Kullanım yeri: Analytics verileri retention süresi dolduğunda, istatistiksel analiz devam etmek istendiğinde.
- **Dikkat:** Anonimleştirme gerçek olmalıdır. Kullanıcı ID’sini hash’lemek ama diğer alanlardan (IP, cihaz, tarih, davranış) kişiyi yeniden tanımlamak mümkünse veri **anonim değildir**, pseudonymize edilmiştir. Pseudonymize veri hâlâ kişisel veri sayılır.

## 29.5. Otomasyon

Retention süreleri **otomatik olarak** uygulanmalıdır. Manuel silmeye güvenilmez çünkü:

- Unutulur.
- Tutarsız uygulanır.
- İnsan hatasına açıktır.
- Ölçeklenmez.

Otomasyon yöntemleri:

- **Cron job / Scheduled task:** Günlük veya haftalık çalışan bir job, retention süresi dolan verileri siler veya anonimleştirir.
- **Database TTL:** Bazı veritabanları (ör: MongoDB, DynamoDB, Redis) TTL (Time-to-Live) özelliği sunar. Belirtilen süre sonunda veri otomatik silinir.
- **Log rotation:** Log dosyaları logrotate veya benzeri araçlarla belirtilen süre sonunda otomatik silinir.
- **Cloud storage lifecycle rules:** AWS S3, Google Cloud Storage gibi servislerde lifecycle rule tanımlanarak belirtilen süre sonunda dosyalar otomatik silinir veya arşivlenir.

Her retention kuralının otomasyonu kurulduktan sonra **test edilmelidir**. Otomasyonun çalışıp çalışmadığı periyodik olarak kontrol edilmelidir.

## 29.6. Client-side Retention

Retention politikası yalnızca backend ve veritabanı ile sınırlı değildir. Client-side’da saklanan veriler de retention’a tabidir.

- **localStorage / AsyncStorage:** Burada tutulan kişisel veri (kullanıcı tercihleri, draft’lar, cache) retention süresine uymalıdır.
- **Session verileri:** Oturum sonlandığında temizlenmelidir. `sessionStorage` kullanımı tab kapandığında otomatik temizlenme sağlar; ancak `localStorage`’da saklanan session verileri açıkça silinmelidir.
- **SecureStore / EncryptedStorage:** Burada saklanan auth token’ları ve credential’lar logout akışında silinmelidir.
- **Persist edilen veriler:** Zustand persist, React Query persist gibi mekanizmalarla client’a persist edilen veriler, kullanıcı değişikliğinde (logout, user switch) temizlenmelidir.
- **Offline cache:** Offline-first uygulamalarda cache’lenen veri de retention’a tabidir. Belirli bir süre sonra stale data temizlenmelidir.

## 29.7. Hatalı Yaklaşımlar

1. **”Her şeyi sonsuza kadar saklayalım, lazım olur”:** Bu yaklaşım hem yasalara aykırıdır hem de güvenlik yüzeyini gereksiz yere büyütür. Veri ihlali durumunda etkilenen veri miktarını katlar. Her veri türünün bir yaşam süresi olmalıdır.

2. **Retention policy tanımlamadan veri toplamak:** Veri toplamaya başlamadan önce “bu veriyi ne kadar süre saklayacağız?” sorusunun cevabı hazır olmalıdır. Cevap yoksa veri toplanmamalıdır.

3. **Silme işlemini yalnızca primary DB’de yapıp replica / backup / log’ları unutmak:** Silme hakkı tüm kopyaları kapsar. Primary veritabanından silinen veri, read replica’larda, backup’larda, analytics platformunda, log dosyalarında ve cache’lerde de silinmelidir.

4. **Kullanıcıya retention süresi hakkında bilgi vermemek:** Gizlilik politikasında her veri türünün ne kadar süre saklanacağı belirtilmelidir. Kullanıcı bu bilgiye erişme hakkına sahiptir.

5. **Anonimleştirme yerine yalnızca soft delete yapmak:** Soft delete, veriyi veritabanında bırakır. Retention süresi dolduysa soft delete yeterli değildir; hard delete veya anonimleştirme uygulanmalıdır.

6. **Retention süresini sadece “yasal zorunluluk” ile gerekçelendirmek:** Yasal zorunluluk yalnızca finansal/vergisel veriler gibi belirli kategoriler için geçerlidir. Diğer veriler için “iş ihtiyacı” gerekçesi yasal zorunlulukla aynı süreyi gerektirmez. Her veri türü kendi amacına uygun süreyle saklanmalıdır.

---

# 30. Rate Limiting ve Abuse Prevention

## 30.1. Nedir?

Rate limiting, API endpoint’lerine ve kullanıcı etkileşimlerine **belirli bir zaman aralığında izin verilen istek sayısını sınırlama** mekanizmasıdır. Abuse prevention (kötüye kullanım önleme) ise rate limiting’in yanı sıra CAPTCHA, brute force koruması, debounce/throttle gibi ek mekanizmaları kapsayan geniş bir disiplindir.

Bu mekanizmalar birlikte çalışarak uygulamanın güvenli, adil ve sürdürülebilir şekilde kullanılmasını sağlar.

## 30.2. Neden Gerekli?

Rate limiting ve abuse prevention şu tehditleri ve sorunları ele alır:

1. **DoS (Denial of Service) saldırıları:** Tek bir kaynaktan (IP, kullanıcı) aşırı istek göndererek hizmeti kullanılamaz hale getirme girişimi. Rate limiting bu tür saldırıların etkisini sınırlar.

2. **Brute force login denemeleri:** Saldırgan, olası şifre kombinasyonlarını otomatik olarak deneyerek hesaba erişmeye çalışır. Rate limiting ve hesap kilitleme bu saldırıyı engeller.

3. **API maliyeti kontrolü:** Özellikle ücretli üçüncü parti API’ler kullanıyorsanız (ör: OpenAI, Google Maps, SMS servisi), kontrol dışı istek sayısı beklenmeyen maliyet doğurur.

4. **Fair use (adil kullanım):** Tüm kullanıcıların hizmetten eşit faydalanmasını sağlar. Tek bir kullanıcının tüm kaynakları tüketmesini engeller.

5. **Spam önleme:** Form submit, yorum gönderme, mesaj atma gibi işlemlerde spam’i engellemek için rate limiting gereklidir.

6. **Scraping önleme:** Uygulamanın verilerinin toplu olarak çekilmesini (scraping) zorlaştırır.

## 30.3. Rate Limiting Türleri

### 30.3.1. IP-based Rate Limiting

**Tanım:** Aynı IP adresinden gelen istekleri sınırlar.

**Avantajları:**
- Basit uygulanır.
- Authentication gerektirmez (login endpoint’i de korunabilir).
- Anonim saldırıları engeller.

**Dezavantajları:**
- NAT (Network Address Translation) arkasındaki kullanıcılar aynı IP’yi paylaşır. Bir ofisteki 100 çalışan tek IP ile çıkıyorsa, hepsi birlikte sınırlanır.
- VPN ve proxy kullanan saldırganlar IP değiştirerek sınırı aşabilir.
- Mobil ağlarda IP sık değişebilir.

**Kullanım yeri:** Login, register, password reset gibi kimlik doğrulaması öncesi endpoint’ler.

### 30.3.2. User-based Rate Limiting

**Tanım:** Kimliği doğrulanmış (authenticated) kullanıcı bazında istekleri sınırlar.

**Avantajları:**
- Daha adildir; her kullanıcı kendi limitini kullanır.
- NAT arkasındaki kullanıcıları haksız yere etkilemez.
- Kullanıcı bazlı kota yönetimi sağlar.

**Dezavantajları:**
- Yalnızca authenticated endpoint’lerde çalışır.
- Saldırgan birden fazla hesap oluşturarak sınırı aşabilir.

**Kullanım yeri:** Genel API endpoint’leri, CRUD operasyonları, dosya yükleme.

### 30.3.3. Endpoint-based Rate Limiting

**Tanım:** Her endpoint için ayrı sınır tanımlar. Hassas endpoint’lere daha düşük limit, genel endpoint’lere daha yüksek limit uygulanır.

**Avantajları:**
- Hassas operasyonlar (login, password reset, ödeme) ekstra korunur.
- Genel okuma operasyonları gereksiz yere kısıtlanmaz.
- Granüler kontrol sağlar.

**Kullanım yeri:** Tüm API’de varsayılan olarak uygulanmalıdır.

## 30.4. Örnek Rate Limit Değerleri

Aşağıdaki değerler baseline öneridir. Uygulamanın gerçek kullanım paternine göre ayarlanmalıdır.

| Endpoint / İşlem | Limit | Pencere | Birim | Aşıldığında |
|---|---|---|---|---|
| Login | 5 deneme | 15 dakika | IP başına | 15 dakika bekleme (cooldown) |
| Register | 3 deneme | 1 saat | IP başına | 1 saat bekleme |
| Password reset | 3 deneme | 1 saat | IP başına | 1 saat bekleme |
| Genel API (read) | 100 istek | 1 dakika | Kullanıcı başına | 429 yanıtı + Retry-After |
| Genel API (write) | 30 istek | 1 dakika | Kullanıcı başına | 429 yanıtı + Retry-After |
| Dosya yükleme | 10 yükleme | 1 saat | Kullanıcı başına | 429 yanıtı |
| Form submit | 10 submit | 1 dakika | IP başına | 429 yanıtı |
| SMS / E-posta gönderimi | 5 gönderim | 1 saat | Kullanıcı başına | 429 yanıtı |

## 30.5. Frontend’in Rolü

**Temel ilke:** Frontend rate limit’i **enforce etmez**. Client-side sınırlama her zaman bypass edilebilir (kullanıcı DevTools ile kodu değiştirebilir, doğrudan API’ye istek atabilir). Rate limiting asıl olarak **backend tarafında** uygulanır.

Ancak frontend’in iki kritik sorumluluğu vardır:

1. **Backend’den gelen rate limit yanıtlarını doğru handle etmek** (HTTP 429).
2. **UX düzeyinde gereksiz istekleri azaltmak** (debounce, throttle, çift tıklama engeli).

## 30.6. HTTP 429 (Too Many Requests) Handling

Backend rate limit aşıldığında HTTP **429 Too Many Requests** yanıtı döner. Frontend bu yanıtı özel olarak handle etmelidir.

### 30.6.1. `Retry-After` Header’ını Okuma

Backend, 429 yanıtıyla birlikte `Retry-After` header’ı gönderir. Bu header, client’ın kaç saniye beklemesi gerektiğini belirtir.

```typescript
// API interceptor’da 429 handling örneği
if (response.status === 429) {
  const retryAfter = response.headers.get(“Retry-After”);
  const waitSeconds = retryAfter ? parseInt(retryAfter, 10) : 60; // varsayılan 60 saniye
  
  // Kullanıcıya bilgi ver
  showRateLimitMessage(waitSeconds);
}
```

### 30.6.2. Kullanıcıya Bilgi Verme

Rate limit aşıldığında kullanıcıya **açık ve spesifik** bir mesaj gösterilmelidir.

**Doğru:**
- “Çok fazla deneme yaptınız. Lütfen 2 dakika sonra tekrar deneyin.”
- “Çok fazla istek gönderildi. 45 saniye sonra tekrar deneyebilirsiniz.”

**Yanlış:**
- “Bir hata oluştu. Lütfen daha sonra tekrar deneyin.” (ne kadar bekleneceği belli değil)
- “Hata 429” (kullanıcı için anlamsız)
- Hiçbir mesaj göstermemek (kullanıcı ne olduğunu anlamaz)

### 30.6.3. UI Geri Bildirimi

- Submit butonu **disable** edilmeli ve countdown (geri sayım) gösterilmelidir.
- Countdown süresi `Retry-After` header’ından alınır.
- Süre dolduğunda buton otomatik olarak tekrar aktif olur.

```typescript
// Basitleştirilmiş örnek
const [cooldownSeconds, setCooldownSeconds] = useState(0);
const isDisabled = cooldownSeconds > 0;

// 429 alındığında
function handleRateLimit(waitSeconds: number) {
  setCooldownSeconds(waitSeconds);
  
  const interval = setInterval(() => {
    setCooldownSeconds((prev) => {
      if (prev <= 1) {
        clearInterval(interval);
        return 0;
      }
      return prev - 1;
    });
  }, 1000);
}
```

### 30.6.4. Otomatik Retry Yapılmamalı

429 yanıtı alındığında client **otomatik retry YAPMAMALIDIR**.

Neden:
- Otomatik retry, rate limiter’ı daha da tetikler ve cooldown süresini uzatır.
- Kullanıcı farkında olmadan backend’e yük bindirir.
- Sonsuz retry loop’a girebilir.

Doğru yaklaşım: Kullanıcıya bekleme süresi gösterilir ve tekrar deneme kararı kullanıcıya bırakılır.

## 30.7. CAPTCHA / Challenge Mekanizması

Ardışık başarısız denemelerden sonra CAPTCHA gösterilmesi, bot saldırılarını engellemek için etkili bir yöntemdir.

### 30.7.1. CAPTCHA Ne Zaman Gösterilir?

- Login endpoint’inde ardışık **3 başarısız** denemeden sonra.
- Register endpoint’inde her zaman (bot kayıtlarını önlemek için) veya şüpheli aktivite tespit edildiğinde.
- Password reset endpoint’inde her zaman.
- Form submit’te spam şüphesi varsa.

### 30.7.2. CAPTCHA Seçenekleri

1. **reCAPTCHA v3 (Invisible):** Tercih edilen yöntem. Kullanıcıya görünmez; arka planda risk skoru hesaplar. UX’i bozmaz. Skor düşükse ek doğrulama istenir.

2. **reCAPTCHA v2 (Checkbox):** “Ben robot değilim” checkbox’ı. Fallback olarak kullanılır (reCAPTCHA v3 skoru düşük geldiğinde).

3. **hCaptcha:** GDPR-dostu alternatif. Google’a veri göndermez. Avrupa merkezli projelerde tercih edilebilir.

4. **Cloudflare Turnstile:** Kullanıcı etkileşimi gerektirmeyen, gizlilik odaklı alternatif.

### 30.7.3. CAPTCHA İmplementasyon İlkeleri

- CAPTCHA **her form’a** konmaz. Yalnızca risk altındaki endpoint’lerde kullanılır. Her yere koymak UX’i ciddi şekilde düşürür.
- CAPTCHA token’ı backend’de doğrulanır. Client-side doğrulama yetersizdir.
- CAPTCHA başarısız olduğunda kullanıcıya yeni bir CAPTCHA sunulur; işlem bloklanmaz.

## 30.8. Brute Force Koruması

Brute force saldırısı, bir hesabın şifresini tahmin etmek için binlerce veya milyonlarca kombinasyonun otomatik olarak denenmesidir.

### 30.8.1. Hesap Kilitleme Mekanizması

- Aynı hesapta ardışık **5 başarısız login** denemesi → hesap **geçici olarak kilitlenir** (15 dakika).
- Kilitleme süresi boyunca doğru şifre girilse bile giriş yapılamaz.
- Kilitleme süresi her ardışık başarısız denemede artırılabilir (progressive lockout): 15 dakika → 30 dakika → 1 saat → 24 saat.

### 30.8.2. Kullanıcı Bildirimi

- Hesap kilitlendiğinde kullanıcıya e-posta bildirimi gönderilir: “Hesabınızda çok sayıda başarısız giriş denemesi tespit edildi. Hesabınız güvenlik nedeniyle geçici olarak kilitlendi.”
- Bu bildirim kullanıcının şüpheli aktiviteden haberdar olmasını sağlar.
- Bildirimde şifre sıfırlama linki sunulabilir.

### 30.8.3. Güvenlik Loglama

- Ardışık başarısız denemeler Sentry veya güvenlik loglama sistemine raporlanır.
- Log kaydı: timestamp, IP adresi, kullanıcı adı/e-posta (hash’lenmiş), deneme sayısı, user agent.
- Bu loglar şüpheli aktivite analizi için kullanılır.
- Belirli bir IP’den çok sayıda farklı hesaba saldırı tespit edilirse (credential stuffing), IP bazlı blok uygulanabilir.

## 30.9. Frontend Abuse Prevention Mekanizmaları

Frontend tarafında kötüye kullanımı azaltan ve UX’i iyileştiren mekanizmalar uygulanmalıdır.

### 30.9.1. Debounce

Arama input’u gibi her tuş vuruşunda API çağrısı yapılmaması gereken yerlerde **debounce** uygulanır.

- Arama input’u: **300ms** debounce. Kullanıcı yazmayı bıraktıktan 300ms sonra API çağrısı yapılır.
- Autocomplete: **200-300ms** debounce.
- Filter/sort değişikliği: **150-200ms** debounce.

```typescript
// Debounce hook kullanım örneği
const debouncedSearch = useDebouncedCallback(
  (query: string) => searchAPI(query),
  300
);
```

Neden önemli: Debounce olmadan her tuş vuruşu bir API çağrısı üretir. “react” yazmak 5 API çağrısı demektir (r, re, rea, reac, react). Bu hem backend’e gereksiz yük bindirir hem de rate limit’e çarpma olasılığını artırır.

### 30.9.2. Throttle

Sürekli tetiklenen event’lerde (scroll, resize, mousemove) handler’ların çok sık çalışmasını engellemek için **throttle** uygulanır.

- Scroll event handler: **100-200ms** throttle.
- Resize event handler: **200ms** throttle.
- Map drag/zoom: **100ms** throttle.

Debounce ile farkı: Debounce son tetiklenmeden sonra belirtilen süre beklenir. Throttle ise belirtilen sürede en fazla bir kez çalıştırılır. Scroll gibi sürekli tetiklenen event’lerde throttle, arama gibi “bitince çalıştır” durumlarında debounce tercih edilir.

### 30.9.3. Çift Tıklama / Çoklu Submit Engeli

Form submit sonrası butonun **anında disable** edilmesi gerekir. Aksi halde kullanıcı butona birden fazla kez tıklayarak aynı işlemi tekrar tekrar tetikleyebilir.

```typescript
// Basit çift tıklama engeli
const [isSubmitting, setIsSubmitting] = useState(false);

async function handleSubmit() {
  if (isSubmitting) return; // çift tıklama engeli
  setIsSubmitting(true);
  
  try {
    await submitForm();
  } finally {
    setIsSubmitting(false); // işlem bitince butonu tekrar aktif et
  }
}
```

Bu durum özellikle şu senaryolarda kritiktir:
- Ödeme formu (çift ödeme)
- Sipariş verme (çift sipariş)
- Mesaj gönderme (çift mesaj)
- Davet gönderme (çift davet)

### 30.9.4. Clipboard / Paste Bomb Koruması

Kullanıcının input alanına çok büyük metin yapıştırması (paste) durumunda uygulama performansı düşebilir veya backend’e aşırı büyük payload gönderilebilir.

- Input alanlarında **maxLength** tanımlanmalıdır.
- Textarea’larda karakter limiti belirlenmeli ve kullanıcıya gösterilmelidir.
- Çok büyük paste işlemi truncate edilmeli (kesilmeli) ve kullanıcıya bilgi verilmelidir.
- Rich text editörlerinde paste işlemi sanitize edilmelidir (zararlı HTML, script injection önleme).

## 30.10. Hatalı Yaklaşımlar

1. **Rate limiting’i yalnızca backend’e bırakıp frontend’de 429’u handle etmemek:** Backend rate limiting uygulansa bile frontend 429 yanıtını özel olarak handle etmezse kullanıcı “bir hata oluştu” gibi belirsiz bir mesaj görür. Ne olduğunu ve ne kadar beklemesi gerektiğini anlamaz.

2. **Kullanıcıya “bir hata oluştu” gibi belirsiz mesaj vermek:** Rate limit aşıldığında kullanıcıya **ne kadar beklenmesi gerektiği** açıkça söylenmelidir. Belirsiz mesaj, kullanıcının tekrar tekrar denemesine (ve rate limit’i daha da tetiklemesine) neden olur.

3. **CAPTCHA’yı her form’a koymak:** CAPTCHA kullanıcı deneyimini düşürür. Yalnızca gerçekten risk altındaki endpoint’lerde (login, register, password reset) kullanılmalıdır. Profil güncelleme, ayar değiştirme gibi düşük riskli formlarda CAPTCHA gereksizdir.

4. **Client-side rate limiting’e güvenmek:** Client-side’da yapılan tüm sınırlamalar (debounce, throttle, buton disable) kullanıcı deneyimini iyileştirir ama güvenlik mekanizması **değildir**. DevTools ile devre dışı bırakılabilir, doğrudan API’ye istek atılabilir. Asıl güvenlik backend’dedir.

5. **Rate limit bilgisini response header’da dönmemek:** Backend, her response’ta `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset` header’larını dönmelidir. Frontend bu bilgiyi kullanarak proaktif önlem alabilir (ör: limit yaklaşınca uyarı gösterme).

6. **Login brute force korumasında yalnızca IP’ye güvenmek:** Saldırgan farklı IP’lerden (botnet, proxy farm) aynı hesaba saldırabilir. Bu nedenle hem IP-based hem de account-based kilitleme birlikte uygulanmalıdır.

7. **Hesap kilitleme süresini kullanıcıya bildirmemek:** “Hesabınız kilitlendi” mesajı yetersizdir. “Hesabınız 15 dakika süreyle kilitlendi. Saat 14:30’dan sonra tekrar deneyebilirsiniz.” şeklinde spesifik bilgi verilmelidir.

---

# 31. Anti-Pattern Listesi

Aşağıdaki davranışlar bu proje kapsamında doğrudan zayıf kabul edilir:

1. Secret’ı repo’ya koymak
2. Token’ı localStorage veya generic convenience storage’a yazmak
3. Auth artefact’ı Zustand veya generic UI state içinde taşımak
4. Full API response’u loglamak
5. Form values’u analytics event olarak göndermek
6. Sentry context içine hassas payload eklemek
7. Production debug panel açmak
8. Logout sonrası user-bound cache’i bırakmak
9. Workspace switch sonrası stale data göstermek
10. Public config ile secret’ı aynı şey sanmak
11. Preview/staging ortamında gerçek prod credential dökmek
12. “Sonra temizleriz” diyerek hassas test verisini repo’ya bırakmak

---

# 32. AI Araç Güvenlik Kuralları

Bu bölüm, AI araçlarının (Claude Code, MoAI-ADK, Codex CLI, Google Stitch) güvenlik kapsamındaki kurallarını tanımlar. Detaylı AI workflow kuralları `40-ai-workflow-and-tooling.md` tarafından yönetilir.

## 32.1. Context güvenliği

- `.env`, credentials, API key ve secret dosyaları AI aracının context'ine girmemelidir.
- `.claudeignore` dosyasında sensitive path'ler tanımlanmalıdır (`.env*`, `*.pem`, `*.key`, `credentials.*` vb.).
- Claude Code hooks ile pre-tool-call'da sensitive path kontrolü yapılandırılabilir.

## 32.2. Ajan hafıza güvenliği

- `.moai/memory/` dizini `.gitignore`'da tutulmalıdır — sensitive veri içerebilir.
- MoAI-ADK ajan hafızasında secret, credential veya kişisel veri saklanmamalıdır.

## 32.3. Tasarım veri güvenliği

- Google Stitch'e yüklenen tasarımlarda gerçek kullanıcı verisi kullanılmamalıdır.
- Stitch'e gönderilen içerik üçüncü parti sunucularda işlenir; IP-sensitive tasarımlarda dikkatli olunmalıdır.

## 32.4. Denetim güvenliği

- Codex CLI review sırasında AGENTS.md'deki `## Review guidelines` bölümüne secret pattern tarama kuralı eklenmelidir.
- `@codex review` sırasında Codex'in repo'nun tamamına erişimi vardır; `.env` dosyalarının `.gitignore`'da olması yeterli değildir, commit geçmişinde de olmamalıdır.

## 32.5. Üçüncü parti risk bilinci

Bu projede 4 farklı şirketin AI aracı kullanılır (Anthropic, OpenAI, Google, modu-ai). Her aracın veri işleme politikası bilinmeli ve proje-spesifik compliance gereksinimleriyle (KVKK, GDPR vb.) uyumu doğrulanmalıdır.

---

# 33. Onay Kriterleri

Bu belge yeterli kabul edilir eğer:

1. Secret/public config/client-sensitive ayrımı netse
2. Web ve mobile persistence güvenliği ayrılmışsa
3. `ADR-010` ve `ADR-009` ile açık hizalama kurulmuşsa
4. Auth/session, observability, analytics ve logging yüzeyleri güvenlik açısından net tanımlanmışsa
5. Wrong-user leak resmi risk olarak görünürse
6. Merge, audit ve DoD etkileri yazılmışsa
7. Bu belge repo ve runtime güvenlik hijyenini yönetecek netlikteyse
8. AI araçlarının güvenlik kuralları (context, hafıza, tasarım verisi, denetim ve üçüncü parti risk) tanımlanmışsa

---

# 34. Kısa Sonuç

Bu proje için güvenlik baseline’ı şudur:

- client gerçek secret saklama yeri değildir
- secret ile public config ayrımı classification-first yapılır
- auth/session artefact’ları generic state ve convenience storage’a girmez
- web tarafında cookie-preferred model, mobile tarafında secure storage adapter yaklaşımı kullanılır
- logs, analytics, Sentry ve debug yüzeyleri sanitize edilir
- wrong-user leak güvenlik ve gizlilik ihlali olarak ele alınır
- dependency, compatibility, audit ve DoD katmanları security hygiene ile doğrudan bağlıdır
- KVKK/GDPR uyumu mimari seviyede ele alınır; gizlilik politikası, açık rıza, silme hakkı ve veri taşınabilirliği sağlanır
- cookie consent yönetimi GDPR ve ePrivacy Directive gerekliliklerine uygun şekilde implemente edilir
- data retention politikası her veri türü için tanımlanır ve otomatik olarak uygulanır
- rate limiting ve abuse prevention mekanizmaları backend’de enforce edilir, frontend’de doğru handle edilir
