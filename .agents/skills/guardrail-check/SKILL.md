---
name: guardrail-check
description: >
  TRIGGER: Herhangi bir kod üretimi veya düzenleme görevi başladığında 
  OTOMATİK tetiklenir. Kullanıcı bir dosya oluşturma, düzenleme, yeni 
  feature/component/ekran/hook/API geliştirme, form, Firebase, refactoring, 
  dependency değişikliği veya herhangi bir kodlama görevi istediğinde 
  bu skill MUTLAKA ilk adımda çalışmalıdır. İş türünü belirler, ilgili 
  aktivite ve domain guardrail dokümanlarını okur, uyulması gereken 
  kuralları özetler. Guardrail okumadan KOD ÜRETME.
allowed-tools:
  - Read
  - Glob
  - Grep
---

# Guardrail Kontrolü — Otomatik Tetikleme

Bu skill her kodlama görevi başladığında OTOMATİK çalışır.
Kullanıcının `/guardrail-check` yazmasını BEKLEME — iş geldiğinde hemen tetikle.

## Ne Zaman Tetiklenir?

- Kullanıcı yeni dosya/component/ekran/feature/hook/API oluşturmasını istediğinde
- Kullanıcı mevcut kodu düzenlemesini istediğinde
- Kullanıcı form, Firebase, auth, navigation, state, styling işi istediğinde
- Kullanıcı refactoring, dependency değişikliği, migration istediğinde
- Kullanıcı bug fix istediğinde
- Kısaca: HER kodlama görevi başlangıcında

## Adımlar

1. **İş türünü belirle:** Kullanıcının isteğini analiz et ve en uygun aktiviteyi seç:

   | Anahtar kelimeler | Aktivite |
   |---|---|
   | component, button, input, card, modal | A-NEW-COMP |
   | ekran, sayfa, screen, page | A-NEW-SCRN |
   | feature, modül, yeni özellik | A-NEW-FEAT |
   | hook, use*, utility, helper | A-NEW-HOOK |
   | API, endpoint, fetch, query | A-NEW-API |
   | form, input, validation, submit | A-FORM |
   | firebase, firestore, collection, document | A-FIREBASE |
   | state, store, zustand, slice | A-STATE |
   | navigation, route, deep link, modal | A-NAV |
   | style, theme, tailwind, renk, token | A-STYLE |
   | refactor, temizle, iyileştir | A-REFACTOR |
   | dependency, paket, install, upgrade | A-DEP |
   | auth, login, session, token | A-AUTH |
   | config, CI, env, build, pipeline | A-CONFIG |
   | migration, taşı, dönüştür | A-MIGRATION |
   | third-party, SDK, entegrasyon | A-3RD |
   | doküman, ADR, docs | A-DOCS |
   | bug, fix, düzelt, hata | A-FIX |
   | upload, dosya, media, resim | A-MEDIA |
   | realtime, websocket, push, notification | A-REALTIME |
   | analytics, event, tracking | A-ANALYTICS |
   | offline, cache, sync | A-OFFLINE |
   | release, versiyon, deploy | A-RELEASE |

2. **Aktivite guardrail'ini oku:** `docs/ai-guardrails/activity/A-XXX-*.md` dosyasını bul ve oku.

3. **Tetiklenen domain guardrail'leri oku:** Aktivite dokümanının frontmatter'ındaki `tetiklenen-domain-guardrails` listesini al. Her birini `docs/ai-guardrails/domain/D-XXX-*.md` dosyasından oku.

4. **Kısa özet sun:**

```
## Guardrail Aktif: [İş Türü]
Aktivite: A-XXX | Domain'ler: D-XXX, D-YYY

### Kritik Kurallar
- [en önemli 5-7 kural]

### Kontrol Listesi
- [ ] [maddeler]

### Araç Zorunlulukları
- SPEC/Stitch/Codex durumu
```

5. **Sonra kodlamaya geç.** Bu özeti sunduktan sonra kodlama işine başla.
