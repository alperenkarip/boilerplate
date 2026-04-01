## Özet

<!-- Bu PR'ın ne yaptığını 1-3 cümleyle açıklayın -->

## Değişiklik türü

- [ ] Yeni özellik (feature)
- [ ] Hata düzeltme (bug fix)
- [ ] Yeniden yapılandırma (refactor)
- [ ] Stil / tasarım sistemi değişikliği
- [ ] Dependency ekleme / güncelleme / kaldırma
- [ ] Doküman güncellemesi
- [ ] CI / tooling değişikliği
- [ ] Test ekleme / güncelleme

## Canonical Stack Uyumu

- [ ] Bu değişiklik `36-canonical-stack-decision.md` ile uyumludur
- [ ] Yeni dependency eklendiyse `37-dependency-policy.md` kabul kriterleri karşılanmıştır
- [ ] `38-version-compatibility-matrix.md` ile çelişen versiyon yoktur

## Mimari Sınır Kontrolü

- [ ] `packages/` → `apps/` yönünde import yoktur
- [ ] `apps/` içindeki feature kodu `packages/`'a taşınmadıysa shared-by-proof ilkesi gözetilmiştir
- [ ] Modül sınırları `07-module-boundaries-and-code-organization.md` ile uyumludur

## Design System Uyumu

- [ ] Hardcoded renk, spacing, font değeri yoktur — semantic token kullanılmıştır
- [ ] Component `23-component-governance-rules.md` naming convention'ına uygundur
- [ ] Tema (light/dark) desteği test edilmiştir (varsa)

## Kalite Kontrol (Definition of Done)

- [ ] TypeScript derlemesi başarılı (`pnpm typecheck`)
- [ ] Lint kontrolü geçiyor (`pnpm lint`)
- [ ] İlgili testler yazıldı ve geçiyor (`pnpm test`)
- [ ] Build başarılı (`pnpm build`)
- [ ] Erişilebilirlik (a11y) gereksinimleri karşılanmıştır
- [ ] Platform uyumu kontrol edilmiştir (web + mobile, varsa)

## Doküman Senkronizasyonu

- [ ] Bu değişiklik mevcut bir dokümanı etkiliyor mu? Evetse güncellendi mi?
- [ ] Yeni ADR gerekli mi? (`18-adr-template.md` referans)
- [ ] `32-definition-of-done.md` iş türüne göre tüm maddeler karşılandı mı?

## Test Kanıtı

<!-- Aşağıdakilerden uygun olanları ekleyin: -->
<!-- - Ekran görüntüsü / video -->
<!-- - Test çıktısı -->
<!-- - Lighthouse / performance raporu -->

## Notlar

<!-- Reviewer'lar için ek bağlam, dikkat edilmesi gereken noktalar -->
