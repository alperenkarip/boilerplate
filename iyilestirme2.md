Doküman setinin mevcut durumu hakkında dürüst bir değerlendirme:
Bu set 2.7MB, 184 dosya, 17 ADR, 25 domain guardrail, 28 activity guardrail içeriyor. Canonical stack versiyonları %100 tutarlı. Bu seviyede bir spec-first doküman seti, kurumsal projelerin büyük çoğunluğunun sahip olmadığı bir olgunluk. Bunu teslim etmek lazım.
Ama asıl soru şu: bu proje henüz bir satır kod üretmedi.
Şimdi realist bir gözle bakarsam:

Doküman inflasyonu riski var. 42 kör nokta tespit ettim, hepsini kapatmaya çalışırsan 250+ dosyalık, 4MB+ bir doküman seti olur ve hiçbir zaman bootstrap'a geçemezsin. Spec-first yaklaşım doğru ama spec-only tuzağına düşmemeli. Doküman yazma döngüsü bir noktada diminishing returns'e girer — sen o noktaya yakınsın.
42 kör noktanın gerçekçi sınıflandırması:
Tespit ettiğim şeylerin çoğu "olsa iyi olur" kategorisinde, blocker değil. Realist filtreden geçireyim:
Bootstrap'ı engelleyen gerçek blocker'lar (3 tane):
İlki New Architecture zorunluluğu. SDK 55'te eski mimari kapatılamıyor. İlk npx create-expo-app çalıştırdığında Fabric/JSI/TurboModules aktif olacak. ADR-002 bunu yansıtmıyor. Bu bir paragraf güncelleme — ayrı bir ADR değil. ADR-002'ye "SDK 55 itibariyle New Architecture kapatılamaz, tüm dependency'ler NArch uyumlu olmalıdır" cümlesi yeterli.
İkincisi AGENTS.md sync eksikliği. Claude Code ile çalışıyorsun. AGENTS.md'de ADR-013..017 yok, auth'ta biometric eksik. Agent yanlış bilgiyle kod üretecek. Bu 15 dakikalık bir düzeltme.
Üçüncüsü 35-document-map.md. 63+ dosya haritada yok. Agent veya yeni geliştirici doküman bulamayacak. Bu da mekanik bir iş.
Bootstrap sonrası ilk sprint'te lazım olacaklar (5 tane):
Bunlar kod yazılmaya başladığında hemen karşına çıkacak konular: MMKV vs AsyncStorage kararı (Zustand persistence için gerekecek), FlashList vs FlatList karar kriteri (ilk liste ekranında gerekecek), startup time hedefi (performans standardı somut rakam vermeli — "<2s cold start 4G" gibi), Sentry RN SDK kurulum reçetesi (observability dokümanı araç seçmiş ama kurulum yok), keyboard handling pattern (ilk form ekranında karşılaşılacak).
Ama bunların hiçbiri için ayrı ADR yazmana gerek yok. Mevcut dokümanların ilgili bölümlerine birer paragraf veya karar notu eklemek yeterli.
Kod yazarken organik olarak çözülecekler (20+ tane):
React 19 hook'ları, responsive layout, onboarding flow, skeleton pattern, bottom sheet standardı, share API, clipboard, AppState lifecycle — bunların hepsi "implementation sırasında pattern oluştur, sonra dokümanla" kategorisinde. Şu an bunlar için doküman yazarsan, kod yazılmadan yazılmış spec olur ve büyük ihtimalle implementasyonda revize edilir. Çift iş.
Şu an gerek olmayan, gelecekte lazım olabilecekler (15+ tane):
Penetration testing, SBOM, license audit, home widgets, app clips, on-device AI, passkeys, canary release, WebView stratejisi — bunlar ya v1.0 sonrası konular ya da derived project ihtiyacına göre şekillenecek şeyler. Şu an doküman yazarsan, hayali senaryolara spec yazmış olursun.