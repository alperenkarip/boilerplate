---
id: A-AI-FEAT
type: activity
name: AI/ML Feature Entegrasyonu
tetiklenen-domain-guardrails: [D-AIX, D-UIX, D-SEC, D-PLT, D-PRI, D-TST, D-OBS]
araç-zorunlulukları:
  spec: zorunlu
  stitch: ihtiyaca göre
  codex: zorunlu
son-güncelleme: 2026-04-02
---

# A-AI-FEAT: AI/ML Feature Guardrail

## Ön Koşullar
1. SPEC oluştur (`/moai plan`) — zorunlu
2. `D-AIX`, `D-UIX`, `D-SEC`, `D-PLT`, `D-PRI`, `D-TST`, `D-OBS` guardrail'lerini oku
3. On-device mi, cloud-backed mi, hybrid mi olduğunu netleştir
4. Kullanıcı verisinin model işleme hattına girip girmediğini belirle
5. Third-party model/SDK kullanılacaksa `A-3RD` ve `37-dependency-policy.md` kontrolünü tamamla

## Aktiviteye Özel Kurallar
1. Kullanıcıya AI/ML kullanımını açıkça bildir — sessiz otomasyon yasak
2. AI çıktısı geri alınabilir / reddedilebilir olmalı; zorlayıcı varsayılan yasak
3. Prompt, inference input'u ve model output'u log'larda PII içermeyecek şekilde redakte edilmeli
4. Cloud inference varsa açık privacy/consent akışı zorunlu
5. Confidence düşükse UI bunu belirsizlik diliyle göstermeli; kesinlik iddiası yasak
6. Failure mode graceful fallback ile tasarlanmalı; AI servisi çöktüğünde temel ürün akışı çalışmaya devam etmeli
7. Test katmanı en az: prompt shaping / business rule unit testleri + render/integration + privacy/security regression kontrolleri
8. Analytics yalnızca izinli, minimize edilmiş ve privacy uyumlu sinyal göndermeli
9. Model/vendor lock-in yaratacak doğrudan kullanım yerine abstraction katmanı tercih edilmeli

## Model Versioning ve A/B Test
10. **Model identifier formatı:** `model_name@version` (ör: `sentiment@v2.1`) — her model sürümü benzersiz tanımlayıcıya sahip olmalı
11. **Feature flag entegrasyonu:** `ai_model_variant` flag'i ile A/B split yönetimi
12. **Ölçüm metrikleri:** accuracy, latency, user satisfaction — her variant için ayrı takip
13. **Rollout stratejisi:** Winner variant %100'e çıkarılır, kaybeden variant kaldırılır
14. **Fallback mekanizması:** Performans düşükse önceki versiyona instant revert — otomatik veya manuel tetikleme

## DoD Ek Maddeleri
- [ ] SPEC yazılmış ve ölçülebilir kabul kriterleri tanımlanmış
- [ ] İlgili domain guardrail'leri okunmuş ve checklist'e işlenmiş
- [ ] Privacy/compliance etkisi değerlendirilmiş (ADR-017 uyumu)
- [ ] Failure/fallback akışı tasarlanmış ve test edilmiş
- [ ] Log/telemetry redaction kontrolü yapılmış
- [ ] Model identifier formatı uygulanmış (model_name@version)
- [ ] A/B test metrikleri tanımlanmış
- [ ] Fallback/revert mekanizması hazır
- [ ] Codex review geçmiş
