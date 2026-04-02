---
id: D-AIX
type: domain
name: AI/Intelligence UX, ML Entegrasyon, AI İçerik Sunumu
kaynak-dokümanlar: 34, Apple HIG — Design for Intelligence
miras-tipi: yapısal
son-güncelleme: 2026-04-01
---

# D-AIX: AI/Intelligence UX Guardrail

## Bu Guardrail Ne Zaman Aktif?
- AI/ML özelliği entegrasyonu (A-AI-FEAT)
- AI tarafından üretilen içerik gösterimi
- Yapay zeka önerileri, tahminleri veya otomatik tamamlama
- Apple Intelligence API'ları (Writing Tools, Image Playground, App Intents) entegrasyonu
- Üçüncü parti AI/LLM servisi entegrasyonu
- Kullanıcı verisinin AI işlemesine gönderildiği her akış

---

## 1. Temel Prensipler (Apple HIG — Design for Intelligence)

### 1.1. Şeffaflık (Transparency)
1. [ZORUNLU] AI tarafından oluşturulan veya değiştirilen içerik açıkça belirtilmeli
2. [ZORUNLU] Kullanıcı, bir içeriğin AI tarafından üretildiğini bilmeli
3. [YAPILMALI] AI işleme sürecinde hangi verilerin kullanıldığı açıklanmalı
4. [YAPILMAMALI] AI içeriğini insan tarafından üretilmiş gibi gösterme
5. [YAPILMAMALI] AI özelliklerini "sihir" gibi sunma — mekanizma şeffaf olmalı

### 1.2. Kullanıcı Kontrolü
6. [ZORUNLU] AI önerileri zorlayıcı olmamalı — kullanıcı her zaman reddetebilmeli
7. [ZORUNLU] AI tarafından yapılan değişiklikler geri alınabilir (undo) olmalı
8. [YAPILMALI] AI önerilerini düzenleme imkanı sun
9. [YAPILMALI] AI özelliklerini devre dışı bırakma seçeneği sun
10. [YAPILMAMALI] Kullanıcı onayı olmadan AI ile otomatik eylem gerçekleştirme
11. [YAPILMAMALI] AI kullanmayı zorlama — her zaman manuel yol olmalı

### 1.3. Gizlilik Önceliği (Privacy-First)
12. [ZORUNLU] On-device ML işleme tercih et — sunucu gönderimi son çare
13. [ZORUNLU] Sunucu tarafı AI işleme için kullanıcıdan açık onay al
14. [ZORUNLU] Hassas verileri (sağlık, finans, kişisel) AI işlemesine açık onay olmadan gönderme
15. [YAPILMALI] On-device vs cloud AI işleme ayrımını kullanıcıya bildir
16. [YAPILMALI] Privacy Nutrition Label / gizlilik politikasında AI kullanımını açıkla
17. [YAPILMAMALI] Kullanıcı verisini AI model eğitimi için izinsiz kullanma

### 1.4. Bağlamsal Zeka
18. [YAPILMALI] AI özellikleri kullanıcının mevcut bağlamını anlayarak uygun zamanda devreye girmeli
19. [YAPILMALI] Önerilerin zamanlaması doğal olmalı — kullanıcıyı rahatsız etmemeli
20. [YAPILMAMALI] Uygunsuz zamanda veya bağlamda AI önerileri gösterme

---

## 2. AI İçerik Sunumu & Etiketleme

### 2.1. Görsel İşaretleme
21. [ZORUNLU] AI tarafından üretilen metin/görsel/ses açıkça etiketlenmeli
22. [YAPILMALI] Tutarlı görsel kimlik kullan — "AI tarafından oluşturuldu" ikonu/badge'i
23. [YAPILMALI] AI glow/shimmer efekti ile AI içeriğini ayırt edilebilir kıl (Apple Intelligence stili)
24. [YAPILMAMALI] AI etiketini gizleme veya küçük/okunaksız yapma

### 2.2. Güven Düzeyi İletişimi
25. [YAPILMALI] Düşük güvenli AI tahminleri belirsiz ifadelerle ve kolay reddedilebilir şekilde sun
26. [YAPILMALI] Yüksek güvenli tahminler varsayılan olarak uygulanabilir ancak geri alınabilir olmalı
27. [YAPILMALI] AI hata payı olabileceğini kullanıcıya bildir — kesin ifadeler kullanma
28. [YAPILMAMALI] Düşük güvenli AI çıktısını kesin bilgi gibi gösterme

### 2.3. Hata Yönetimi
29. [YAPILMALI] AI özelliği kullanılamadığında graceful fallback sağla
30. [YAPILMALI] AI servisi başarısız olduğunda uygulamanın geri kalanı çalışmaya devam etmeli
31. [YAPILMALI] AI zaman aşımı durumlarında kullanıcıyı bilgilendir ve alternatif sun
32. [YAPILMAMALI] AI hatası durumunda tüm işlevi durma noktasına getirme

---

## 3. Apple Intelligence Özel Kuralları

### 3.1. Writing Tools Entegrasyonu
33. [YAPILMALI] Metin alanlarında Writing Tools desteğini etkin bırak (varsayılan davranış)
34. [YAPILMALI] `isWritingToolsActive` ile Writing Tools aktifliğini algıla, uygun davran
35. [YAPILMAMALI] Writing Tools'u gereksiz yere devre dışı bırakma (`writingToolsBehavior: .none`)
36. [YAPILMALI] Writing Tools'un desteklediği eylemler: Proofread, Rewrite (ton değiştirme), Summary

### 3.2. App Intents & Siri Entegrasyonu
37. [YAPILMALI] Uygulamanın ana eylemlerini App Intents olarak tanımla
38. [YAPILMALI] Parametre tanımları açık ve anlaşılır olmalı
39. [YAPILMALI] Siri yanıtları kısa, net ve eyleme dönüştürülebilir olmalı
40. [YAPILMALI] Spotlight ve Shortcuts ile keşfedilebilirlik sağla

### 3.3. Bildirim Özetleme
41. [YAPILMALI] AI bildirim özetlemesini optimize et — önemli bilgileri koruyarak
42. [YAPILMALI] Kritik bildirimler (güvenlik, acil durum) özetleme dışında tutulabilmeli
43. [YAPILMAMALI] Özetlendiğinde anlam kaybı yaşanacak bildirimleri uygun şekilde işaretleme

### 3.4. Image Playground / AI Görsel Üretimi
44. [YAPILMALI] AI ile oluşturulan görseller belirli bir stil çerçevesinde sunulmalı
45. [YAPILMALI] Kullanıcı oluşturulan görseli düzenleyebilmeli veya silebilmeli
46. [YAPILMAMALI] Gerçekçi (photorealistic) insan görseli üretimi — etik sınırlara uy
47. [YAPILMALI] Üretilen görsellerde AI belirteci bulunmalı

---

## 4. AI Öneri & Tahmin Sistemi

### 4.1. Öneri Sunumu
48. [YAPILMALI] Öneriler mevcut bağlama uygun ve zamanında sunulmalı
49. [YAPILMALI] Öneri reddetme tek dokunuşla mümkün olmalı
50. [YAPILMALI] Reddedilen önerilerden öğren — aynı öneriyi tekrar tekrar sunma
51. [YAPILMAMALI] Önerileri ekranın kritik alanlarını kapatacak şekilde gösterme

### 4.2. Otomatik Tamamlama & Tahmin
52. [YAPILMALI] Otomatik tamamlama önerileri visual olarak ayrışık gösterilmeli (dim text, farklı renk)
53. [YAPILMALI] Kabul: tek dokunuş/tab, red: devam yazma veya dismiss
54. [YAPILMAMALI] Otomatik tamamlamayı kullanıcı tercihi olmadan zorunlu uygulama
55. [YAPILMAMALI] Otomatik tamamlama önerisi ile kullanıcının yazdığı metin karışmamalı

### 4.3. Akıllı Sıralama & Önceliklendirme
56. [YAPILMALI] AI ile sıralanan içerikte sıralama nedenini belirt ("Sizin için önerilen", "Trend")
57. [YAPILMALI] Manuel sıralama seçeneğini her zaman sun (tarihe göre, isme göre, vb.)
58. [YAPILMAMALI] AI sıralamasını tek seçenek olarak sunma — kullanıcı kontrolü koru

---

## 5. Üçüncü Parti AI Entegrasyonu

59. [ZORUNLU] Üçüncü parti AI modeli (ChatGPT, vb.) kullanımında açık kullanıcı onayı al
60. [ZORUNLU] Gönderilen veri kapsamını kullanıcıya göster
61. [YAPILMALI] Üçüncü parti AI sağlayıcısının kimliğini belirt
62. [YAPILMALI] Üçüncü parti AI yanıtlarını kendi içeriğinden görsel olarak ayır
63. [YAPILMAMALI] Kullanıcı verisini bilgilendirmeden üçüncü parti AI'a gönderme

---

## 6. AI Erişilebilirlik

64. [ZORUNLU] AI tarafından üretilen içerik screen reader tarafından okunabilir olmalı
65. [YAPILMALI] AI etiketleri (badge, ikon) erişilebilir name taşımalı ("AI tarafından oluşturuldu")
66. [YAPILMALI] AI önerileri VoiceOver/TalkBack ile reddetme/kabul edilebilir olmalı
67. [YAPILMALI] AI animasyonları reduced motion tercihine saygı göstermeli
68. [YAPILMAMALI] AI özelliklerini sadece görsel geri bildirimle sunma — çoklu kanal kullan

---

## Kalite Eşikleri
- [MİNİMUM] AI içerik etiketlemesi (şeffaflık)
- [MİNİMUM] Kullanıcı kontrolü (reddetme, geri alma)
- [MİNİMUM] Gizlilik onayı (sunucu tarafı AI işleme)
- [MİNİMUM] Graceful fallback (AI yoksa çalışmaya devam)
- [ÖNERİLEN] On-device ML tercih
- [ÖNERİLEN] App Intents / Siri entegrasyonu
- [ÖNERİLEN] Writing Tools desteği

## Anti-pattern'ler
1. [ZAYIF] AI içeriğini etiketlemeden sunma
2. [ZAYIF] AI önerilerini geri alınamaz şekilde uygulama
3. [ZAYIF] Kullanıcı verisini izinsiz AI'a gönderme
4. [ZAYIF] Writing Tools'u gereksiz yere devre dışı bırakma
5. [ZAYIF] AI hata payını göz ardı eden kesin ifadeler kullanma
6. [ZAYIF] AI özelliğini devre dışı bırakma seçeneği sunmama
7. [ZAYIF] AI servisi hatasında tüm uygulamanın durması
8. [ZAYIF] Üçüncü parti AI sağlayıcısını gizleme
9. [ZAYIF] AI önerilerini aşırı agresif (ekran kaplayan, kesintici) sunma
10. [ZAYIF] AI içerik etiketini screen reader'dan gizleme

## Kontrol Listesi
- [ ] AI içerik etiketlemesi yapıldı mı?
- [ ] Kullanıcı AI önerilerini reddedebiliyor mu?
- [ ] AI değişiklikleri geri alınabiliyor mu?
- [ ] Gizlilik onayı alınıyor mu (sunucu tarafı AI)?
- [ ] Graceful fallback tanımlı mı?
- [ ] On-device vs cloud AI ayrımı belirtiliyor mu?
- [ ] Writing Tools desteği etkin mi?
- [ ] App Intents tanımlı mı?
- [ ] AI etiketleri screen reader erişilebilir mi?
- [ ] Üçüncü parti AI kullanılıyorsa sağlayıcı belirtiliyor mu?
- [ ] AI öneri reddi tek dokunuşla mı?
- [ ] AI hata durumunda fallback var mı?
- [ ] Güven düzeyi iletişimi yapılıyor mu?
- [ ] AI animasyonları reduced motion'a uyuyor mu?
- [ ] On-device model boyutu bütçe içinde mi?
- [ ] Inference ana thread'i blokluyor mu?
- [ ] Model dosyası repo'da mı yoksa CDN'de mi?
- [ ] Cihaz kapasitesi kontrolü var mı?
- [ ] Model versiyonlama stratejisi tanımlı mı?

## İhlal Durumunda
- Şeffaflık ihlali (etiketleme yok) → hemen düzelt (blocker)
- Gizlilik ihlali (izinsiz veri gönderimi) → hemen düzelt (blocker)
- Kullanıcı kontrolü ihlali (geri alınamaz AI eylemi) → hemen düzelt (blocker)
- Graceful fallback eksikliği → düzelt (major)
- Erişilebilirlik eksikliği → düzelt (major)
- Güven düzeyi iletişimi eksikliği → düzelt veya gerekçelendir

---

## 7. On-Device AI/ML Geliştirme Rehberi

On-device AI, yapay zeka modellerinin sunucuya gönderilmeden doğrudan kullanıcının cihazında (telefon, tablet) çalıştırılması anlamına gelir. Bu yaklaşım gizlilik, gecikme (latency) ve çevrimdışı çalışabilirlik açısından sunucu tabanlı AI'a göre belirgin avantajlar sunar.

### 7.1. Neden On-Device AI?

1. **Gizlilik:** Kullanıcı verisi cihazdan çıkmaz. GDPR/KVKK uyumu açısından sunucu tarafı veri işleme riskini ortadan kaldırır.
2. **Düşük gecikme:** Ağ round-trip süresi (genellikle 100-500ms) elimine edilir. Cihaz üzerinde inference genellikle 10-50ms arasında tamamlanır.
3. **Çevrimdışı çalışma:** İnternet bağlantısı olmadan da AI özelliği kullanılabilir.
4. **Maliyet:** Sunucu tarafı GPU/TPU maliyeti yoktur. Ölçeklendirme kullanıcı cihazlarına dağılır.
5. **Apple HIG uyumu:** Apple, on-device ML'i açıkça tercih eder (Core ML, Create ML, Apple Intelligence).

### 7.2. React Native'de On-Device AI Araçları

#### 7.2.1. TensorFlow Lite (TFLite)
- **Ne yapar:** Eğitilmiş TensorFlow modellerini mobil cihazlarda çalıştırır
- **React Native entegrasyonu:** `react-native-tflite` veya `expo-tflite` kütüphanesi
- **Desteklediği görevler:** Görüntü sınıflandırma, nesne algılama, metin sınıflandırma, poz tahmini
- **Model boyutu:** Tipik olarak 1-50MB arası (quantized modeller daha küçük)
- **New Architecture uyumu:** JSI tabanlı native modül ile uyumlu
- **Performans:** GPU delegate ile donanım hızlandırma (iOS Metal, Android GPU)

#### 7.2.2. PyTorch Mobile (ExecuTorch)
- **Ne yapar:** PyTorch modellerini mobil cihazlarda çalıştırır
- **React Native entegrasyonu:** `react-native-executorch` kütüphanesi
- **Avantaj:** PyTorch ekosistemiyle doğal uyum — Python'da eğitilen model doğrudan mobile deploy edilebilir
- **New Architecture uyumu:** TurboModule tabanlı

#### 7.2.3. MLC LLM (Machine Learning Compilation)
- **Ne yapar:** Büyük dil modellerini (LLM) doğrudan cihazda çalıştırır
- **Desteklediği modeller:** Llama 2/3, Mistral, Phi, Gemma gibi açık kaynak LLM'ler
- **React Native entegrasyonu:** `react-native-mlc-llm` (deneysel)
- **Gereksinim:** Minimum 4GB RAM, tercihen 6-8GB+
- **Kısıtlama:** Yalnızca yeni nesil cihazlarda (A15+ chip, Snapdragon 8 Gen 2+) kabul edilebilir performans

#### 7.2.4. React Native AI
- **Ne yapar:** Callstack tarafından geliştirilen, on-device AI entegrasyonunu kolaylaştıran çerçeve
- **Kapsam:** Metin, görüntü ve ses AI görevleri için birleşik API
- **Durum (2026):** Aktif geliştirme aşamasında, API değişebilir

#### 7.2.5. Apple Core ML (iOS)
- **Ne yapar:** Apple'ın native ML framework'ü, iOS cihazlarda optimize edilmiş inference
- **React Native entegrasyonu:** Custom native module veya config plugin ile
- **Avantaj:** Apple Neural Engine (ANE) donanım hızlandırması, en düşük güç tüketimi
- **Kısıtlama:** Yalnızca iOS

### 7.3. On-Device AI Guardrail Kuralları

69. [ZORUNLU] Model boyutu uygulama boyutuna orantısız olmamalı — 50MB üzeri model ayrı indirme (on-demand download) ile sağlanmalı
70. [ZORUNLU] On-device inference ana thread'i (UI thread) bloklamamalı — arka plan thread veya WorkManager kullanılmalı
71. [ZORUNLU] Model dosyaları (.tflite, .mlmodel, .bin) git repo'ya commit edilmemeli — CDN veya asset server'dan indirilmeli
72. [YAPILMALI] İlk kullanımda model indirme durumunda ilerleme göstergesi göster
73. [YAPILMALI] Cihaz kapasitesini kontrol et (RAM, işlemci) — yetersizse fallback sağla (sunucu tarafı veya basit heuristik)
74. [YAPILMALI] Model versiyonlama yap — yeni model sürümü OTA ile güncellenebilmeli
75. [YAPILMALI] Inference sonuçlarını cache'le — aynı input için tekrar inference çalıştırma
76. [YAPILMAMALI] Kullanıcıyı AI model indirmesine zorlamak — opsiyonel ve onay tabanlı olmalı
77. [YAPILMAMALI] On-device model eğitimi (training) yapmak — yalnızca inference canonical
78. [YAPILMAMALI] Model dosyasını uygulama binary'sine gömüp uygulama boyutunu şişirmek (50MB+ modeller için)

### 7.4. Mimari Pattern: On-Device AI Servisi

```
┌──────────────────────┐
│     UI Layer         │  → AI sonuçlarını gösterir
│  (React Component)   │
├──────────────────────┤
│    AI Service        │  → Platform-agnostic API sunar
│  (TypeScript)        │  → useAIClassification(), useAICompletion()
├──────────────────────┤
│  Platform Adapter    │  → iOS: Core ML, Android: TFLite
│  (Native Module)     │  → Model yükleme, inference, lifecycle
├──────────────────────┤
│  Model Storage       │  → CDN'den indirilen model dosyaları
│  (File System)       │  → Versiyonlama, cache, cleanup
└──────────────────────┘
```

### 7.5. Performans Bütçesi

- Model yükleme (ilk kez): < 2 saniye (cold load)
- Model yükleme (cache'ten): < 200ms
- Tek inference çağrısı: < 100ms (görüntü sınıflandırma), < 50ms (metin sınıflandırma)
- Bellek kullanımı: Model boyutu + %20 overhead
- Batarya etkisi: Sürekli inference (real-time kamera gibi) batarya tüketimini %15-30 artırabilir — kullanıcı bilgilendirilmeli

---

## Kaynak
- Apple HIG — Design for Intelligence → developer.apple.com/design/human-interface-guidelines/machine-learning
- Apple Intelligence → developer.apple.com/apple-intelligence/
- App Intents → developer.apple.com/documentation/appintents
- Writing Tools → developer.apple.com/documentation/writingtools
- HIG enforcement → docs/design-system/34-hig-enforcement-strategy.md
- Güvenlik baseline → docs/quality/27-security-and-secrets-baseline.md
