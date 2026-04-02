---
id: A-DOCS
type: activity
name: Doküman / ADR Yazımı
tetiklenen-domain-guardrails: []
araç-zorunlulukları:
  spec: —
  stitch: —
  codex: —
son-güncelleme: 2026-04-02
---

# A-DOCS: Doküman Yazımı Guardrail

## Ön Koşullar
1. 41-ai-instruction-standards.md oku — doküman format kuralları
2. ADR yazılıyorsa 18-adr-template.md kullan

## Aktiviteye Özel Kurallar
1. Doküman dili: Türkçe (CLAUDE.md dil kuralları)
2. Doküman otorite hiyerarşisine uy — üst dokümanla çelişme
3. ADR: 18-adr-template.md formatını kullan
4. Yeni doküman: 35-document-map.md'ye ekle
5. Mevcut doküman güncellemesi: son-güncelleme tarihini revize et
6. CLAUDE.md güncellemesi: 500 satır sınırına dikkat et

## Doküman Freshness Kontrolü
7. Kaynak kod değiştiğinde, o koda referans veren dokümanlar da güncellenmeli
8. **CI uyarısı:** "Bu PR, X.md'ye referans veren kodu değiştirdi — doküman güncel mi?" şeklinde otomatik uyarı
9. PR author değerlendirir ve gerekiyorsa dokümanı günceller
10. **Exception:** Typo düzeltme, import yolu değişikliği, refactoring gibi dokümanı anlamsal olarak etkilemeyen değişiklikler freshness kontrolünden muaftır

## DoD Ek Maddeleri
- [ ] Format standartlarına uygun
- [ ] Otorite hiyerarşisi ile çelişmiyor
- [ ] Document map güncellenmiş (yeni doküman ise)
- [ ] İlgili kaynak kod değişmişse doküman freshness kontrolü yapılmış
