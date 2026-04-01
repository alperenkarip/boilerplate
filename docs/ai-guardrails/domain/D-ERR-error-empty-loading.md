---
id: D-ERR
type: domain
name: Error, Empty, Loading States & Recovery
kaynak-dokümanlar: 25
miras-tipi: yapısal
son-güncelleme: 2026-04-01
---

# D-ERR: Error/Empty/Loading States Guardrail

## Bu Guardrail Ne Zaman Aktif?
- Yeni ekran (A-NEW-SCRN) — her ekran bu durumları tanımlamalı
- Yeni API entegrasyonu (A-NEW-API) — loading/error zorunlu
- Form geliştirme (A-FORM) — submit lifecycle
- Firebase/Firestore işlemi (A-FIREBASE)

## Zorunlu Kurallar

### Her Ekran İçin
1. [ZORUNLU] Her veri çeken ekran 4 durumu handle etmeli: loading, success, error, empty
2. [YAPILMAMALI] Sadece success durumunu implement edip diğerlerini atlamak

### Loading
3. [YAPILMALI] Loading süresi 100ms'den uzunsa loading indicator göster
4. [YAPILMALI] Skeleton/placeholder tercih et — spinner en son çare
5. [YAPILMAMALI] Boş beyaz ekran gösterme — kullanıcıya geri bildirim ver

### Error
6. [YAPILMALI] Hata mesajı kullanıcı dostu olmalı — teknik jargon kullanma
7. [YAPILMALI] Retry/refresh mekanizması sun — kullanıcıyı çıkmaza sokma
8. [YAPILMALI] Error tiplerine göre farklı feedback: network, server, validation, permission
9. [YAPILMAMALI] Generic "Bir hata oluştu" mesajıyla tüm hataları karşılama

### Empty
10. [YAPILMALI] Boş liste/sonuç durumunda açıklayıcı empty state göster
11. [YAPILMALI] Empty state'te aksiyon butonu sun (oluştur, ara, filtre temizle)
12. [YAPILMAMALI] Boş ekran — "veri yok" tek satır metin

### Recovery
13. [YAPILMALI] Pull-to-refresh veya retry butonu ile recovery yolu sun
14. [YAPILMALI] Partial failure durumunda başarılı kısmı göster, başarısız kısmı belirt
15. [YAPILMAMALI] Hata durumunda tüm ekranı gizleme — ne kadar gösterilebilirse göster

### Feedback Yüzeyleri
16. [YAPILMALI] Feedback seviyesini doğru seç: full-screen, section-level, inline, field-level
17. [YAPILMAMALI] Her hatayı full-screen error olarak gösterme

### Apple HIG Hata Durumları
18. [YAPILMALI] Alert dialog'larda: kısa başlık (ne oldu) + açıklama + çözüm önerisi
19. [YAPILMALI] Buton metinleri net eylem ifadesi taşımalı ("Tamam" yerine "Tekrar Dene", "Ayarlara Git")
20. [YAPILMALI] Yıkıcı eylem butonu kırmızı ile vurgulanmalı, iptal butonu her zaman olmalı
21. [YAPILMAMALI] Teknik hata mesajları gösterme ("Error 500", "nil exception", "timeout")
22. [YAPILMAMALI] Kullanıcıyı suçlayan dil kullanma ("Yanlış girdiniz", "Hatalı işlem")

### Apple HIG Boş Durumlar (Empty States)
23. [YAPILMALI] İlk kullanım (first run): hoş geldin mesajı + ilk eyleme yönlendiren CTA
24. [YAPILMALI] Sonuç yok: alternatif öneriler (farklı arama, filtre değişikliği)
25. [YAPILMALI] Boş koleksiyon: açıklayıcı ikon/illüstrasyon + doğrudan ekleme butonu
26. [YAPILMALI] İçerik silindi: geri alma seçeneği (varsa) + alternatif yönlendirme

### Apple HIG Yükleme Durumları (Loading States)
27. [YAPILMALI] Belirsiz yükleme: spinner + uzun süren işlemlerde açıklama metni
28. [YAPILMALI] Belirli yükleme: progress bar + yüzde/kalan süre gösterimi
29. [YAPILMALI] Skeleton screen: shimmer/pulse animasyonu, gerçek içerik yapısıyla uyumlu
30. [YAPILMAMALI] Spinner'ı sonsuza kadar döndürme — timeout ve fallback sağla
31. [YAPILMAMALI] Yükleme sırasında tüm kullanıcı etkileşimini engelleme

### Apple HIG Banner & Inline Hatalar
32. [YAPILMALI] Ağ hatası: sayfa üstü/altı banner + otomatik yeniden deneme
33. [YAPILMALI] Form hatası: inline, alanın hemen altında, kırmızı + exclamation ikon
34. [YAPILMALI] Hata düzeltildiğinde otomatik temizleme
35. [YAPILMALI] Hata kodlarını kullanıcıya değil loglara yaz

## Anti-pattern'ler
1. [ZAYIF] Sadece success durumu implement edilmiş — loading/error/empty atlanmış
2. [ZAYIF] Boş beyaz ekran — loading indicator yok
3. [ZAYIF] "Bir hata oluştu" tek generic mesaj — error tipi ayrımı yok
4. [ZAYIF] Empty state'te "Veri yok" tek satır — aksiyon butonu yok
5. [ZAYIF] Hata durumunda tüm ekran gizli — partial content gösterilmiyor
6. [ZAYIF] Teknik hata mesajı gösteriliyor ("Error 500", "nil exception")
7. [ZAYIF] Kullanıcıyı suçlayan dil ("Yanlış girdiniz")
8. [ZAYIF] Alert dialog'da "Tamam" / "İptal" belirsiz buton metinleri
9. [ZAYIF] Spinner sonsuza kadar dönüyor — timeout yok
10. [ZAYIF] İlk kullanım (first run) empty state tasarlanmamış

## Kontrol Listesi
- [ ] Loading, error, empty, success durumları handle ediliyor mu?
- [ ] Loading indicator uygun sürede gösteriliyor mu?
- [ ] Error mesajı kullanıcı dostu mu (teknik jargon yok)?
- [ ] Retry/recovery mekanizması var mı?
- [ ] Empty state açıklayıcı mı, aksiyon sunuyor mu?
- [ ] Alert dialog buton metinleri net eylem ifadesi mi?
- [ ] Yıkıcı eylem butonu kırmızı mı, iptal butonu var mı?
- [ ] İlk kullanım (first run) durumu tasarlandı mı?
- [ ] Skeleton screen gerçek layout yapısıyla uyumlu mu?
- [ ] Spinner timeout'u tanımlı mı?
- [ ] Form hataları inline (alan yanında) mı?
- [ ] Hata düzeltildiğinde otomatik temizleme var mı?

## Kaynak
- Error/empty/loading states → docs/design-system/25-error-empty-loading-states.md
- Apple HIG Providing Feedback → developer.apple.com/design/human-interface-guidelines/providing-feedback
