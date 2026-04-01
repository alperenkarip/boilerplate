# 31-audit-checklist.md

## Doküman Kimliği

- **Doküman adı:** Audit Checklist
- **Dosya adı:** `31-audit-checklist.md`
- **Doküman türü:** Checklist / audit framework / implementation-to-docs conformance inspection document
- **Durum:** Accepted
- **Tarih:** 2026-03-31
- **Kapsam:** Bu belge, doküman ile implementation arasındaki uyumu, canonical stack ihlallerini, repo placement doğruluğunu, security/observability/a11y/performance/testing risklerini, release/distribution etkilerini ve contribution/review zincirinin kalitesini denetlemek için kullanılacak ana checklist’i ve severity modelini tanımlar.
- **Bağlı olduğu üst belgeler:**
  - `03-ui-ux-quality-standard.md`
  - `06-application-architecture.md`
  - `07-module-boundaries-and-code-organization.md`
  - `12-accessibility-standard.md`
  - `13-performance-standard.md`
  - `14-testing-strategy.md`
  - `15-quality-gates-and-ci-rules.md`
  - `16-tooling-and-governance.md`
  - `21-repo-structure-spec.md`
  - `23-component-governance-rules.md`
  - `25-error-empty-loading-states.md`
  - `26-platform-adaptation-rules.md`
  - `27-security-and-secrets-baseline.md`
  - `28-observability-and-debugging.md`
  - `29-release-and-versioning-rules.md`
  - `30-contribution-guide.md`
  - `36-canonical-stack-decision.md`
  - `37-dependency-policy.md`
  - `38-version-compatibility-matrix.md`
  - `ADR-001` → `ADR-011`
- **Doğrudan etkileyeceği belgeler:**
  - `32-definition-of-done.md`
  - `33-visual-implementation-contract.md`
  - `34-hig-enforcement-strategy.md`
  - `35-document-map.md`

---

# 1. Bu Belgenin Revize Edilme Nedeni

Önceki sürüm audit’i çok eksenli kalite denetimi olarak doğru konumlandırıyordu.  
Ama artık proje için kritik bir fark var:

- ADR seti tamamlandı
- canonical stack artık tek yerde kilitlendi
- dependency policy ve compatibility matrix yazıldı

Bu şu anlama gelir:

> Audit artık yalnızca “iyi mi görünüyor, bug var mı?” denetimi olamaz.  
> Audit, doğrudan canonical karar katmanına uyumu da denetlemek zorundadır.

Bu revizyonun asıl amacı budur.

---

# 2. Amaç

Bu dokümanın amacı, audit’i:

- genel kalite hissi,
- rastgele code review,
- subjektif tasarım eleştirisi,
- yalnızca bug arama

olmaktan çıkarıp;  
**doküman, canonical stack, repo placement, design system, security, observability, compatibility ve release disiplinini birlikte denetleyen resmi kalite mekanizması** haline getirmektir.

Bu belge şu sorulara net cevap verir:

1. Audit bu projede tam olarak neyi kontrol eder?
2. Audit ile code review arasındaki fark nedir?
3. Severity nasıl verilir?
4. Hangi ihlaller blocker sayılır?
5. Canonical stack ihlali nasıl tespit edilir?
6. Docs drift nasıl tespit edilir?
7. Security/observability/a11y/performance/testing/release alanları tek listede nasıl kontrol edilir?
8. Audit çıktısı nasıl yazılmalıdır?

---

# 3. Temel Tez

Bu proje kapsamında temel tez şudur:

> Audit, implementation kalitesini yalnızca çalışan koda bakarak değil; karar verilmiş belge sistemi ile uyum, boundary disiplini, tasarım sistemi otoritesi, güvenlik ve telemetry hijyeni, test ve release güvenilirliği üzerinden değerlendiren çok katmanlı denetim sürecidir.

Bu tez şu sonuçları doğurur:

1. Audit dokümanları referans alır
2. Audit canonical stack ihlallerini görünür kılar
3. Audit, review’den daha geniş ve daha sistemiktir
4. Audit çıktısı aksiyon üretecek kadar açık olmalıdır
5. “Genel olarak iyi duruyor” audit sonucu değildir

---

# 4. Severity Modeli

Audit bulguları aşağıdaki şiddet sınıflarıyla yazılmalıdır:

## 4.1. Blocker
Merge/release/bootstrap ilerlemesini durdurması gereken ihlal.

Örnek:
- canonical stack’i delen ikinci query/state/forms tool
- wrong-user leak
- auth token exposure
- compatibility matrix’e açık aykırı dependency
- root build/runtime kırığı
- HIG/a11y kritik ihlal
- docs-first otoriteyi bozan çelişki

## 4.2. Major
Ciddi kalite, sürdürülebilirlik veya UX riski oluşturan ama anlık blocker olmayan ihlal.

## 4.3. Minor
Düzeltilmesi gereken, fakat sistemin yönünü bozmayacak daha küçük ihlal.

## 4.4. Note / Watch
Şu an ihlal değil ama büyüme potansiyeli olan risk.

## 4.5. Severity Karar Matrisi

Aşağıdaki matris, bir bulgunun severity seviyesini ihlal tipi ve etki katmanına göre mekanik şekilde belirlemeyi amaçlar:

| İhlal Tipi | Karar Katmanı İhlali | Operasyonel İhlal | Görsel/UX İhlal |
|---|---|---|---|
| Canonical stack sapma | Blocker | - | - |
| Dependency policy ihlali | Blocker | Major | - |
| Import yönü ihlali | - | Blocker | - |
| Hardcoded token kullanımı | - | Major | Minor |
| A11y eksikliği | - | Major | Major |
| Test eksikliği | - | Major | Minor |
| Docs sync eksikliği | - | Major | Minor |
| Naming convention ihlali | - | Minor | Minor |
| Performance budget aşımı | - | Major | Minor |

Bir bulgu birden fazla katmanı etkiliyorsa, en yüksek severity geçerlidir.

---

# 5. Audit Çıktısı Formatı

Her bulgu şu bilgileri taşımalıdır:

1. başlık
2. severity
3. etkilenen dosya/alan
4. hangi belge/ADR’ye aykırı olduğu
5. problemin teknik açıklaması
6. kullanıcı/operasyon etkisi
7. önerilen düzeltme yönü

Bu format olmadan audit notu yeterince kullanılabilir değildir.

---

# 6. Audit Türleri

## 6.1. Foundation audit
Repo bootstrap ve foundation katmanı sonrası
- **Tetiklenme kriteri:** Repo bootstrap sonrası veya çekirdek yapıda (runtime, monorepo topology, build pipeline) değişiklik olduğunda zorunlu

## 6.2. Feature audit
Belirli feature veya vertical slice için
- **Tetiklenme kriteri:** 3+ ekran veya 2+ domain akışını kapsayan feature'larda zorunlu

## 6.3. UI/DS audit
Görsel doğruluk, DS ve a11y odaklı
- **Tetiklenme kriteri:** Yeni reusable component, token değişikliği veya theme güncellemesinde zorunlu

## 6.4. Security/observability audit
Auth, telemetry, logging ve storage odaklı
- **Tetiklenme kriteri:** Auth, session, storage veya environment değişikliğinde zorunlu

## 6.5. Compatibility/release audit
Upgrade veya stack-sensitive release öncesi
- **Tetiklenme kriteri:** Canonical stack dependency upgrade'inde zorunlu

---

# 7. Canonical Stack Audit Ailesi

Bu revizyonun en kritik yeni bölümü budur.

## 7.1. Soru
Implementation mevcut canonical stack ile uyumlu mu?

## 7.2. Kontrol maddeleri

- [ ] Web runtime React + Vite + React Router çizgisine aykırı mı?
- [ ] Mobile runtime Expo-first baseline’ı deliyor mu?
- [ ] Monorepo/pnpm/turbo rejimine aykırı local kararlar var mı?
- [ ] Zustand policy ihlali var mı?
- [ ] TanStack Query yerine ad-hoc fetch/state duplication var mı?
- [ ] RHF + Zod dışında ikinci forms/validation yönü açılmış mı?
- [ ] Tailwind/NativeWind + token authority dışı styling otoritesi oluşmuş mu?
- [ ] Jest/Vitest/Playwright baseline’ı dışında dağınık testing tool sprawl var mı?
- [ ] Sentry + analytics abstraction modeli delinmiş mi?
- [ ] Auth/session baseline ihlali var mı?
- [ ] i18n baseline yerine inline literal culture geri mi dönmüş?

## 7.3. Severity önerisi
Bu ailede ihlaller çoğu zaman en az major, sıkça blocker’dır.

---

# 8. Dependency Policy Audit Ailesi

## 8.1. Soru
Yeni dependency’ler `37-dependency-policy.md` ile uyumlu mu?

## 8.2. Kontrol maddeleri

- [ ] Yeni dependency justification yazılmış mı?
- [ ] Aynı problemi çözen ikinci araç mı eklendi?
- [ ] Utility adı altında gereksiz paket çoğalması var mı?
- [ ] Security-sensitive dependency review edilmiş mi?
- [ ] Wrapper/adapter gerekip atlanmış mı?
- [ ] New package family canonical stack’i zayıflatıyor mu?

---

# 9. Compatibility Matrix Audit Ailesi

## 9.1. Soru
Dependency sürümleri `38-version-compatibility-matrix.md` ile uyumlu mu?

## 9.2. Kontrol maddeleri

- [ ] Node baseline uyumlu mu?
- [ ] pnpm ve Turbo hatları uyumlu mu?
- [ ] Expo/RN/React chain korunuyor mu?
- [ ] Vite/React/Router zinciri korunuyor mu?
- [ ] Tailwind/NativeWind major track’leri doğru mu?
- [ ] TS baseline izinsiz açılmış mı?
- [ ] React Navigation stable vs watchlist sınırı bozulmuş mu?
- [ ] upgrade compatibility revalidation yapılmış mı?

## 9.3. Severity
Çekirdek zincir ihlalleri çoğu zaman blocker’dır.

---

# 10. Repo Placement Audit Ailesi

## 10.1. Soru
Kod doğru fiziksel katmanda mı?

## 10.2. Kontrol maddeleri

- [ ] Feature code yanlışlıkla package’a mı taşınmış?
- [ ] Shared foundation app içine gömülmüş mü?
- [ ] `shared/common/utils` çöplüğü var mı?
- [ ] UI package içine feature-specific surface sızmış mı?
- [ ] core package içine UI/router/storage vendor logic girmiş mi?
- [ ] tooling ile runtime code karışmış mı?

---

# 11. State / Query / Forms Boundary Audit

## 11.1. Kontrol maddeleri

- [ ] server-state generic store’a kopyalanmış mı?
- [ ] form state generic app store’a taşınmış mı?
- [ ] derived state gereksiz saklanmış mı?
- [ ] mutation sonrası invalidation eksik mi?
- [ ] state placement local-first ilkesini bozuyor mu?
- [ ] form validation copy ve backend error mapping dağınık mı?

---

# 12. Styling / Design System Audit

## 12.1. Kontrol maddeleri

- [ ] raw color/raw spacing/raw typography kaçakları var mı?
- [ ] semantic token yerine raw palette kullanılmış mı?
- [ ] StyleSheet/inline style escape hatch gereksiz açılmış mı?
- [ ] component variant sistemi bozulmuş mu?
- [ ] screen-level styling feature logic yerine stil icadı yapıyor mu?
- [ ] dark mode/contrast/focus state görünürlüğü yetersiz mi?

---

# 13. Visual / HIG / A11y Audit

## 13.1. Kontrol maddeleri

- [ ] touch target yetersiz mi?
- [ ] safe area ihlali var mı?
- [ ] focus order/focus visibility bozuk mu?
- [ ] assistive labels eksik mi?
- [ ] loading/error/empty states okunabilir mi?
- [ ] reduced motion dikkate alınmış mı?
- [ ] premium feel adına usability bozulmuş mu?
- [ ] mobile’de HIG ile bariz çelişen davranış var mı?

---

# 14. Security Audit Ailesi

## 14.1. `27` ve `ADR-010` ile bağ
Kontrol maddeleri:

- [ ] secret leakage riski var mı?
- [ ] token/state/storage misuse var mı?
- [ ] secure storage yerine convenience storage kullanılmış mı?
- [ ] wrong-user leak riski var mı?
- [ ] logout/user-switch cleanup eksik mi?
- [ ] full payload logging veya telemetry leak var mı?
- [ ] env/public-private ayrımı bozuk mu?

---

# 15. Observability Audit Ailesi

## 15.1. `28` ve `ADR-009` ile bağ
Kontrol maddeleri:

- [ ] Sentry yanlış kullanılıyor mu?
- [ ] analytics payload’ları noise üretiyor mu?
- [ ] structured logging yerine dump culture var mı?
- [ ] release/build metadata görünür mü?
- [ ] prod debug surface sızıntısı var mı?
- [ ] auth/query/forms observability sınıflandırması doğru mu?
- [ ] privacy-safe telemetry korunmuş mu?

---

# 16. Testing Audit Ailesi

## 16.1. Kontrol maddeleri

- [ ] riskine uygun test katmanı seçilmiş mi?
- [ ] snapshot misuse var mı?
- [ ] relevant integration / E2E boşluğu kritik alanlarda var mı?
- [ ] manual visual audit gereken yerde atlanmış mı?
- [ ] flaky test davranışı normalleştirilmiş mi?
- [ ] mobile vs web quality parity bozulmuş mu?

---

# 17. i18n / Copy Audit Ailesi

## 17.1. Kontrol maddeleri

- [ ] inline user-facing strings var mı?
- [ ] semantics-first key yaklaşımı bozulmuş mu?
- [ ] formatting string concat ile çözülmüş mü?
- [ ] locale switch/fallback davranışı zayıf mı?
- [ ] a11y copy unutulmuş mu?
- [ ] product terminology drift var mı?

---

# 18. Release / Versioning Audit Ailesi

## 18.1. Kontrol maddeleri

- [ ] stack-sensitive changes docs/release görünürlüğü taşıyor mu?
- [ ] changelog doğru mu?
- [ ] breaking change sessiz geçmiş mi?
- [ ] rollback düşünülmüş mü?
- [ ] compatibility revalidation yapıldı mı?
- [ ] hotfix misuse var mı?

---

# 19. Docs Sync Audit Ailesi

## 19.1. Soru
Kod ile belge sistemi hâlâ aynı şeyi mi söylüyor?

## 19.2. Kontrol maddeleri

- [ ] ilgili ADR güncel mi?
- [ ] related standard belgesi güncel mi?
- [ ] dependency/compatibility etkisi işlenmiş mi?
- [ ] document map kırık mı?
- [ ] file naming/reference drift var mı?

## 19.3. Not
Bu proje docs-first olduğu için docs drift major veya blocker olabilir.

---

# 20. Contribution Quality Audit Ailesi

## 20.1. Kontrol maddeleri

- [ ] PR açıklaması yeterli mi?
- [ ] dependency/package gerekçesi yazılmış mı?
- [ ] docs sync düşünülmüş mü?
- [ ] reviewer’a sürpriz yapısal değişiklik bırakılmış mı?
- [ ] canonical stack’i delen bir değişiklik ADR’siz mi gelmiş?

---

# 21. Audit Zamanlaması

Audit en az aşağıdaki anlarda güçlü adaydır:

1. first bootstrap sonrası
2. first vertical slice sonrası
3. stack-sensitive upgrade öncesi/sonrası
4. release candidate öncesi
5. major refactor sonrası
6. repeated regression gözleniyorsa
7. security/observability issue çıkmışsa

---

# 22. Audit Remediation SLA

Her severity seviyesi için düzeltme beklentisi:

| Severity | Etki | Düzeltme Beklentisi | Escalation |
|---|---|---|---|
| Blocker | Merge'i engeller | PR merge öncesi zorunlu düzeltme | Anında |
| Major | Merge sonrası sprint içi | Mevcut sprint içinde düzeltme planı oluşturulmalı | Sprint review |
| Minor | Backlog'a alınır | Sonraki 2 sprint içinde ele alınmalı | Quarterly review |
| Note/Watch | Bilgi amaçlı | Trend olarak izlenir, aksiyon gerekli değildir | Audit raporu |

Blocker bulgusu olan PR merge edilemez. Major bulgusu olan PR, düzeltme planı (ticket) ile merge edilebilir.

---

# 23. Audit Anti-Pattern Listesi

Aşağıdaki audit davranışları zayıf kabul edilir:

1. yalnızca çalışan hatalara bakmak
2. canonical stack ihlalini göz ardı etmek
3. belgeyi hiç referans almamak
4. severity vermeden not bırakmak
5. “genel olarak iyi” gibi boş sonuç yazmak
6. docs drift’i önemsiz görmek
7. security ve observability’yi ayrı audit dışına itmek
8. visual/a11y alanını subjektif beğeniye indirmek
9. release/compatibility etkisini denetlememek
10. bulguyu aksiyona çevirmemek

---

# 24. Onay Kriterleri

Bu belge yeterli kabul edilir eğer:

1. canonical stack, dependency policy ve compatibility matrix audit kapsamına açıkça alınmışsa
2. security, observability, release, docs sync ve contribution kalitesi ayrı aileler olarak denetleniyorsa
3. severity modeli netse
4. checklist operasyonel ve tekrar kullanılabilir düzeydeyse
5. implementation-to-docs conformance ana hedeflerden biri olarak görünüyorsa
6. bu belge gerçek denetimlerde kullanılabilecek netlikteyse

---

# 25. Kısa Sonuç

Bu proje için audit standardı şudur:

- audit yalnızca bug arama değildir
- docs-first sistem ile implementation arasındaki uyumu denetler
- canonical stack ihlallerini görünür kılar
- dependency ve compatibility drift’i yakalar
- design system, security, observability, testing, i18n ve release disiplinini aynı kalite sistemine bağlar
- severity ve aksiyon üretmeyen audit değerli sayılmaz
