# 32-definition-of-done.md

## Doküman Kimliği

- **Doküman adı:** Definition of Done
- **Dosya adı:** `32-definition-of-done.md`
- **Doküman türü:** Standard / completion criteria / delivery quality contract
- **Durum:** Accepted
- **Tarih:** 2026-03-31
- **Kapsam:** Bu belge, bir feature, reusable component, token/theme değişikliği, repo yapısı değişikliği, dependency değişikliği, ADR/doküman değişikliği, upgrade, security fix, observability değişikliği veya release etkili işin hangi koşullarda gerçekten tamamlanmış sayılacağını tanımlar.
- **Bağlı olduğu üst belgeler:**
  - `14-testing-strategy.md`
  - `15-quality-gates-and-ci-rules.md`
  - `20-initial-implementation-checklist.md`
  - `23-component-governance-rules.md`
  - `24-motion-and-interaction-standard.md`
  - `25-error-empty-loading-states.md`
  - `26-platform-adaptation-rules.md`
  - `27-security-and-secrets-baseline.md`
  - `28-observability-and-debugging.md`
  - `29-release-and-versioning-rules.md`
  - `30-contribution-guide.md`
  - `31-audit-checklist.md`
  - `36-canonical-stack-decision.md`
  - `37-dependency-policy.md`
  - `38-version-compatibility-matrix.md`
  - `ADR-001` → `ADR-012`
- **Doğrudan etkileyeceği belgeler:**
  - `33-visual-implementation-contract.md`
  - `34-hig-enforcement-strategy.md`
  - `35-document-map.md`

---

# 1. Bu Belgenin Revize Edilme Nedeni

Önceki sürüm done kavramını iyi seviyede kalite kontratına çevirmişti.  
Ama artık sistemde yeni bir gerçeklik var:

- canonical stack yazıldı
- ADR zinciri tamamlandı
- dependency policy yazıldı
- compatibility matrix yazıldı
- contribution ve audit rejimi daha sert hale geldi

Bu nedenle done artık yalnızca:
- kod,
- test,
- docs,
- visual proof
seviyesinde kalamaz.

Artık şu soruları da içermek zorundadır:

- canonical karar ihlal edildi mi?
- dependency policy etkisi kapandı mı?
- compatibility etkisi değerlendirildi mi?
- docs sync tamam mı?
- audit gerekip atlandı mı?

Bu revizyon bunları resmi done kontratına ekler.

---

# 2. Amaç

Bu dokümanın amacı, “done” kavramını:

- kod yazıldı
- ekran açıldı
- bende çalıştı
- testler geçti
- büyük sorun görünmüyor

seviyesinden çıkarıp;  
**quality gates, canonical stack, docs sync, dependency/compatibility etkisi, security/observability gereklilikleri ve bağlama uygun kanıt ile bağlı resmi teslim standardı** haline getirmektir.

Bu belge şu sorulara net cevap verir:

1. Done ne zaman gerçekten söylenebilir?
2. Hangi iş türü için hangi ek koşullar gerekir?
3. Dependency veya compatibility etkili iş neden ayrı dikkat ister?
4. Docs sync hangi durumlarda done’ın parçasıdır?
5. Audit gerektiren iş hangi sinyallerle anlaşılır?
6. Kısmi tamamlanmış iş neden done sayılamaz?
7. “Çalışıyor” neden yeterli değildir?

---

# 3. Temel Tez

Bu proje kapsamında temel tez şudur:

> Bir işin tamamlanmış sayılması, yalnızca implementasyonun varlığına değil; ilgili kalite standardının karşılanmasına, doğru katmanda yapılmasına, gerekli doğrulamanın tamamlanmasına, gerekiyorsa docs/ADR/dependency/compatibility etkisinin kapatılmasına ve riskine uygun kanıt sunulmasına bağlıdır.

Bu tez şu sonuçları doğurur:

1. Done, bağlamdan bağımsız tek satır kontrol listesi değildir.
2. Ama hiçbir iş “kod bitti” diye done sayılamaz.
3. Canonical stack’e dokunan işlerde çıta yükselir.
4. Docs drift bırakmak done değildir.
5. Security ve observability etkisi olan işte sanitize/visibility düşünülmeden done denmez.

---

# 4. Done Kararının Genel Formülü

Bir iş ancak aşağıdaki 9 sorudan en az 7'sine olumlu yanıt veriyorsa ve hiçbir blocker düzeyde eksik yoksa done sayılır:

1. Doğru problemi çözdü mü?
2. Doğru katmanda mı çözdü?
3. Canonical stack ile uyumlu mu?
4. Quality gates geçti mi?
5. Riskine uygun doğrulama yapıldı mı?
6. Gerekli docs sync yapıldı mı?
7. Dependency/compatibility etkisi değerlendirildi mi?
8. Security/observability/a11y parity etkisi kapatıldı mı?
9. Reviewer’a net kanıt sunulabiliyor mu?

---

# 5. Evrensel Zorunlu Done Maddeleri

İş türü ne olursa olsun aşağıdakiler minimum ortak done ailesidir:

- [ ] İşin amacı ve kapsamı net
- [ ] Değişiklik doğru katmanda
- [ ] Canonical stack ile çelişki yok
- [ ] İlgili lint/type/test/verify adımları geçiyor
- [ ] Bariz docs drift bırakılmadı
- [ ] Security/privacy ihlali üretilmedi
- [ ] Relevant review bağlamı açık
- [ ] PR veya teslim çıktısı anlaşılır
- [ ] HIG major veya blocker seviyesinde ihlal bulunmamış olmalıdır (ilgili iş türünde HIG etkisi varsa, `34-hig-enforcement-strategy.md` severity modeline göre değerlendirilir)

Bu maddeler her işte temel zorunludur.

---

# 6. İş Türlerine Göre Done Kriteri Farklılaşır

Done tek tip değildir.  
Aşağıdaki iş aileleri ayrı değerlendirilmelidir:

1. Feature
2. Reusable UI component
3. Design token / theme / styling runtime change
4. State/query/forms foundation change
5. Auth/session/security change
6. Observability change
7. Dependency addition/change
8. Compatibility/upgrade work
9. Repo structure / tooling / governance work
10. Docs / ADR work
11. Bug fix
12. Release-impacting work

---

# 7. Feature Done Kriteri

Bir feature ancak aşağıdakiler sağlanıyorsa done sayılabilir:

- [ ] Mutlu akış çalışıyor
- [ ] Loading / empty / error / retry davranışı düşünüldü
- [ ] Relevant query/state/form sınırları doğru
- [ ] Copy/i18n etkisi kapandı
- [ ] Accessibility temel şartları karşılandı
- [ ] Riskine uygun test yazıldı
- [ ] Web/mobile parity değerlendirmesi yapıldı
- [ ] Observability etkisi gerekiyorsa işlendi
- [ ] Docs sync gerekiyorsa yapıldı

### Done olmayan feature örneği
- ekranda açılıyor ama error/empty state yok
- form submit oluyor ama invalidation bozuk
- mobile’da farklı davranıyor
- inline string ve hardcoded UI ile geçiştirilmiş

---

# 8. Reusable UI Component Done Kriteri

Bir reusable component ancak aşağıdakiler sağlanıyorsa done sayılır:

- [ ] Primitive/component rolü net
- [ ] Token/semantic token kullanımı doğru
- [ ] Variant sistemi kontrollü
- [ ] State matrix düşünülmüş (hover/focus/pressed/disabled/error vs)
- [ ] Accessibility semantics doğru
- [ ] Visual proof veya component-level doğrulama var
- [ ] Raw style kaçakları açıklanmış veya yok
- [ ] Feature logic component içine sızmamış
- [ ] İlgili docs veya usage contract net

### Done olmayan reusable component örneği
- görsel çalışıyor ama DS authority’yi deliyor
- `className` override çöplüğüne dönmüş
- a11y unutulmuş
- state matrix belirsiz

---

# 9. Token / Theme / Styling Change Done Kriteri

- [ ] Token authority bozulmadı
- [ ] Semantic role mantığı korundu
- [ ] Web ve mobile tüketim etkisi değerlendirildi
- [ ] Dark mode / contrast etkisi düşünüldü
- [ ] Visual regression riski değerlendirildi
- [ ] Raw style escape hatch oluştuysa justification var
- [ ] İlgili docs güncellendi

### Done olmayan örnek
- token eklendi ama semantic mapping yok
- web düzeldi, mobile bozuldu
- renk değişti ama contrast düşünülmedi

---

# 10. State / Query / Forms Foundation Change Done Kriteri

- [ ] `ADR-004/005/006` ile uyumlu
- [ ] server-state/store separation korunuyor
- [ ] form state generic store’a gitmiyor
- [ ] invalidation/submit lifecycle düşünülmüş
- [ ] relevant tests var
- [ ] docs impact varsa işlendi
- [ ] regressions ve migration etkisi değerlendirildi

---

# 11. Auth / Session / Security Change Done Kriteri

- [ ] `ADR-010` ile uyumlu
- [ ] secret leakage yok
- [ ] wrong-user leak riski değerlendirilmiş
- [ ] logout/user-switch/session-expiry cleanup etkisi düşünülmüş
- [ ] storage/state misuse yok
- [ ] logs/analytics/Sentry yüzeyleri sanitize
- [ ] güvenlik etkisi olan docs güncellendi
- [ ] gerekiyorsa audit yapılmış veya audit notu var

### Done olmayan örnek
- auth flow çalışıyor ama token generic state’te
- logout sonrası query cache temizlenmiyor
- debug panelde session bilgisi sızıyor

---

# 12. Observability Change Done Kriteri

- [ ] `ADR-009` ve `28` ile uyumlu
- [ ] signal gerçekten gerekli
- [ ] analytics/logging/error tracking doğru ayrılmış
- [ ] payload sanitize
- [ ] noise üretmiyor
- [ ] release/build metadata etkisi düşünülmüş
- [ ] docs/event taxonomy etkisi kapandı

### Done olmayan örnek
- event eklendi ama neden gerektiği belli değil
- Sentry context’e fazla veri gidiyor
- logging dump şeklinde

---

# 13. Dependency Change Done Kriteri

- [ ] `37-dependency-policy.md` kontrol edildi
- [ ] neden gerekli açık yazıldı
- [ ] mevcut stack neden yetmedi açıklandı
- [ ] security/privacy etkisi değerlendirildi
- [ ] compatibility matrix etkisi değerlendirildi
- [ ] gerekli ise docs/ADR güncellendi
- [ ] duplicate tool veya sprawl üretilmedi

### Done olmayan örnek
- package eklendi ama justification yok
- compatibility etkisi hiç düşünülmedi
- new dependency küçük diye süreç atlandı

---

# 14. Compatibility / Upgrade Work Done Kriteri

- [ ] `38-version-compatibility-matrix.md` etkisi değerlendirildi
- [ ] exact upgraded chain açık
- [ ] ilgili test/revalidation yapıldı
- [ ] release risk notu hazır
- [ ] docs sync tamam
- [ ] stack-sensitive ise changelog/release note etkisi işlendi

### Done olmayan örnek
- package bump geçti ama matrix güncellenmedi
- Expo/React/Vite zinciri değişti ama revalidation yok

---

# 15. Repo Structure / Tooling / Governance Work Done Kriteri

- [ ] `21-repo-structure-spec.md` ile uyumlu
- [ ] exact placement rationale doğru
- [ ] tooling/runtime karışmadı
- [ ] contribution/audit/DoD etkisi düşünüldü
- [ ] docs güncellendi
- [ ] repo ergonomisi ve maintainability yükseldi

---

# 16. Docs / ADR Work Done Kriteri

- [ ] Belge authority zincirine uygun
- [ ] İlgili başka belgeyi boşa düşürmüyor
- [ ] Terminology drift üretmiyor
- [ ] Eğer canonical karar veriyorsa açık yazıyor
- [ ] Eğer policy belgesiyse operational etkileri görünür
- [ ] Document map gerekirse güncellendi

### Done olmayan örnek
- belge yazıldı ama diğer 3 belge ile çelişiyor
- yeni ADR eklendi ama map güncellenmedi
- revizyon yapıldı ama otorite sırası bulanık kaldı

---

# 17. Bug Fix Done Kriteri

- [ ] gerçekten root cause anlaşıldı
- [ ] yalnızca semptom gizlenmedi
- [ ] relevant tests/proof eklendi
- [ ] repeat risk azaltıldı
- [ ] docs/guideline etkisi varsa işlendi
- [ ] regression riski düşünüldü

---

# 18. Release-Impacting Work Done Kriteri

- [ ] `29-release-and-versioning-rules.md` etkisi değerlendirildi
- [ ] release note / changelog etkisi düşünüldü
- [ ] rollback/hotfix ihtimali düşünülmüş
- [ ] observability visibility mevcut
- [ ] breaking change varsa açık yazılmış

---

# 19. Docs Sync Kuralı

Aşağıdaki durumlarda docs sync done’ın parçasıdır ve opsiyonel değildir:

- yeni ADR
- existing standard etkisi
- dependency policy etkisi
- compatibility impact
- repo structure change
- security boundary change
- observability signal contract change
- i18n/copy governance change
- contribution/audit/DoD etkisi

### Kural
Docs sync yapılmadan “teknik olarak bitti” demek bu repo için geçerli değildir.

---

# 20. Audit Kuralı

Her iş audit gerektirmez.  
Ama aşağıdaki durumlarda audit done’ın bir parçası olabilir veya olmalıdır:

- foundation/runtime/security/observability değişikliği
- stack-sensitive upgrade
- DS/styling authority change
- large feature or vertical slice
- repeated regression area
- auth/session/storage impact
- canonical stack ihlali riski taşıyan refactor

---

# 21. Proof / Evidence Kuralı

Done iddiası kanıtsız olamaz.

## 21.1. Kabul edilebilir kanıt örnekleri
- lint/type/test output
- visual proof
- route/flow demonstration
- audit result
- docs diff
- compatibility note
- release note preview
- sanitized telemetry evidence
- cleanup path explanation

## 21.2. Zayıf kanıt örnekleri
- “bende çalıştı”
- “sorun görünmüyor”
- “zaten küçük işti”
- “review’da bakarız”

---

# 22. Done Olmayan Ama Genelde Done Sanılan Şeyler

Aşağıdaki durumlar tek başına done değildir:

1. Kod yazılmış olması
2. Uygulamanın compile olması
3. CI’ın yeşil olması
4. Ekranın açılması
5. Bir tek mutlu akışın çalışması
6. Reviewer’ın büyük sorun görmemesi
7. Paket kurulmuş olması
8. Belge yazılmış ama diğer belgelerle senkron olmaması

---

# 23. Done Kararını Düşüren Kırmızı Bayraklar

Aşağıdaki durumlardan biri varsa done iddiası zayıflar veya düşer:

- canonical stack ihlali
- docs drift
- dependency justification eksikliği
- compatibility etkisini düşünmemek
- security leak
- observability noise/leak
- wrong-user leak riski
- raw style / DS authority ihlali
- a11y kritik eksik
- test/proof boşluğu
- release impact gizlenmiş olması

---

# 24. Reviewer için Done Kontrol Soruları

1. İş doğru katmanda mı?
2. İlgili belge/ADR ile uyumlu mu?
3. Docs sync gerekiyor muydu, yapıldı mı?
4. Dependency/compatibility etkisi var mı?
5. Riskine uygun test/proof var mı?
6. Security/observability etkisi düşünülmüş mü?
7. Release impact varsa görünür mü?
8. Bu iş gerçekten kapatılmış mı, yoksa yarım mı?

---

# 25. Anti-Pattern Listesi

Aşağıdaki davranışlar bu proje kapsamında doğrudan zayıf kabul edilir:

1. “Kod bitti, done”
2. “CI geçti, done”
3. “Küçük işti, docs gerekmez”
4. “Dependency küçük, süreç işletmedim”
5. “Compatibility etkisi yoktur herhalde”
6. “A11y sonra”
7. “Security sonra”
8. “Visual proof gereksiz”
9. “Audit gerekmez, ben baktım”
10. “Reviewer eksik kalan kısmı düşünür”

---

# 26. AI Destekli İş İçin Ek DoD Maddeleri

AI aracıyla gerçekleştirilen iş için standart DoD maddelerine ek olarak:

- [ ] **SPEC varsa:** SPEC kabul kriterleri karşılanmış mı? (SPEC = `.moai/specs/<SPEC-ID>.md` — MoAI-ADK ile oluşturulan görev spesifikasyonu. Karmaşık görevlerde `/moai plan` komutuyla üretilir. Basit görevlerde SPEC zorunlu değildir.)
- [ ] AI aracına verilen talimat, ilgili spec ve ADR ile tutarlı mı?
- [ ] **Stitch çıktısı kullanıldıysa:** `DESIGN.md` güncel mi? (`DESIGN.md` = Stitch MCP aracıyla Figma'dan export edilen tasarım verisi dosyasıdır. Component üretiminde referans alınır.) `22-design-tokens-spec.md` ile eşleşiyor mu?
- [ ] **Codex review yapıldı mı?** P0/P1 bulgu kalmadı mı? (Codex = OpenAI Codex CLI — `AGENTS.md` talimatlarına göre kod inceleme yapan terminal AI ajanıdır.)
- [ ] **Talimat dosyaları güncellendi mi?** `CLAUDE.md` (Claude Code proje talimatı — her oturumda otomatik okunur) ve `AGENTS.md` (Codex CLI review kuralları) değişikliğe göre güncellendi mi?
- [ ] AI aracının bypass ettiği lint/type/test kontrolü yok mu? (`eslint-disable`, `@ts-ignore`, `--no-verify`)
- [ ] `.env`, secret veya credential bilgisi AI aracının context'ine sızmamış mı? (`.claudeignore` dosyası exclude listesini tanımlar)

Detaylar: `ai-integration-documentation-plan.md`

---

# 27. Onay Kriterleri

Bu belge yeterli kabul edilir eğer:

1. Done artık canonical stack ve docs-first rejimle bağlı tanımlanmışsa
2. dependency/compatibility/docs sync etkileri açıkça done kriterine girmişse
3. iş türlerine göre done farklılaşması netse
4. security/observability/release etkileri görünürse
5. kanıt/evidence zorunluluğu açık yazılmışsa
6. bu belge teslim standardı olarak gerçek kullanımda uygulanabilecek netlikteyse
7. AI destekli iş için ek DoD maddeleri tanımlanmışsa

---

# 28. AI Guardrail DoD Maddeleri

AI araçlarıyla geliştirilen her iş için `47-ai-guardrail-governance.md` çerçevesine uyum, Definition of Done'un parçasıdır.

## 28.1. Tüm İş Türleri İçin (Universal)

- [ ] İlgili aktivite guardrail dokümanı okundu ve uygulandı
- [ ] İlgili domain guardrail kontrol listesi karşılandı
- [ ] Universal guardrail kuralları sağlandı (hardcoded değer yok, any yok, import yönü doğru, i18n key kullanıldı)
- [ ] Guardrail ihlali varsa düzeltildi veya exception kaydı açıldı (44)

## 28.2. İş Türüne Özel Ek Maddeler

Aşağıdaki maddeler ilgili aktivite guardrail dokümanında tanımlanan DoD ekleridir:

- Yeni component (A-NEW-COMP): Component governance (23) uyumu, a11y prop'lar, render testi
- Yeni ekran (A-NEW-SCRN): SPEC yazılmış, 4 durum (loading/error/empty/success), route tanımlı
- Yeni feature (A-NEW-FEAT): SPEC yazılmış, modül izolasyonu, i18n namespace, test coverage
- Bug fix (A-FIX): Root cause belirlenmiş, regression test yazılmış
- Dependency değişikliği (A-DEP): Policy (37) kontrol edilmiş, compatibility matrix (38) güncel
- Form (A-FORM): Zod schema, React Hook Form, label, submit lifecycle
- Firebase (A-FIREBASE): Security rules (default deny), doküman yapısı tanımlı
- Auth (A-AUTH): ADR-010 uyumu, güvenli token saklama

Tam DoD ek maddeleri için ilgili aktivite guardrail dokümanına bakılmalıdır.

---

# 29. Kısa Sonuç

Bu repo’da done demek şunların birlikte sağlanması demektir:

- doğru problem çözüldü
- doğru katmanda çözüldü
- canonical kararlar ihlal edilmedi
- riskine uygun doğrulama yapıldı
- gerekli docs sync kapandı
- dependency ve compatibility etkisi değerlendirildi
- security, observability, a11y ve release etkisi gerektiği kadar işlendi
- reviewer’a açık kanıt sunulabildi

Bunlardan biri kritik seviyede eksikse iş done değildir.
