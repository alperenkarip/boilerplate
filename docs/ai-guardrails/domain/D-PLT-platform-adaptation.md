---
id: D-PLT
type: domain
name: Platform Adaptation (Web ↔ Mobile)
kaynak-dokümanlar: 26, ADR-001, ADR-002
miras-tipi: yapısal
son-güncelleme: 2026-04-01
---

# D-PLT: Platform Adaptation Guardrail

## Bu Guardrail Ne Zaman Aktif?
- Yeni ekran (A-NEW-SCRN) — cross-platform ise
- Yeni component (A-NEW-COMP) — her iki platformda kullanılacaksa
- Platform-specific kod yazılırken

## Zorunlu Kurallar

### Canonical Runtime
1. [ZORUNLU] Web: React + Vite + React Router 7.x (ADR-001)
2. [ZORUNLU] Mobile: React Native + Expo SDK 55.x (ADR-002)

### Platform Parity
3. [YAPILMALI] Aynı feature web ve mobile'da tutarlı davranmalı (behavior parity)
4. [YAPILMALI] Platform-specific farklar gerekçelendirilmeli (design parity esnek, behavior parity sıkı)
5. [YAPILMAMALI] Bir platformda olan feature'ı diğerinde sessizce atlama

### Kod Organizasyonu
6. [YAPILMALI] Platform-specific kod doğru dizinde olmalı: `apps/web/`, `apps/mobile/`
7. [YAPILMALI] Shared kod `packages/` altında olmalı
8. [YAPILMAMALI] Platform-specific kodu shared package'a koyma
9. [YAPILMAMALI] `.web.tsx` / `.native.tsx` uzantıları shared package'da gereksiz yere çoğaltma

### Platform Convention
10. [YAPILMALI] iOS: Apple HIG convention'larına uy (D-UIX)
11. [YAPILMALI] Web: Standart web convention'ları (keyboard navigation, cursor, hover)
12. [YAPILMAMALI] iOS'ta Material Design pattern kullanma
13. [YAPILMAMALI] Mobile'da hover-dependent UI tasarlama

### Responsive & Adaptive
14. [YAPILMALI] Web'de responsive layout düşün
15. [YAPILMALI] Mobile'da safe area ve device variety düşün
16. [YAPILMAMALI] Tek breakpoint'e göre UI tasarlama

### Apple HIG Platform-Specific Detay

#### iOS (iPhone)
17. [YAPILMALI] Tek elle kullanım odaklı, thumb zone ergonomisi
18. [YAPILMALI] Edge-to-edge tasarım, Dynamic Island/notch uyumu
19. [YAPILMALI] Tab bar (alt) + Navigation bar (üst) — standart iOS idiom
20. [YAPILMALI] Gesture-driven etkileşim (swipe back, pull-to-refresh)
21. [YAPILMALI] Haptic geri bildirim entegrasyonu

#### iPadOS
22. [YAPILMALI] Multitasking: Split View, Slide Over, Stage Manager uyumu
23. [YAPILMALI] Sidebar navigasyonu büyük ekranlarda
24. [YAPILMALI] Pointer (trackpad/mouse) hover efektleri
25. [YAPILMALI] Keyboard shortcuts ve tab navigasyonu
26. [YAPILMALI] Drag and drop desteği

#### Web (macOS Odaklı)
27. [YAPILMALI] Menü bar, toolbar, sidebar pattern'leri
28. [YAPILMALI] Keyboard-first etkileşim, sağ tık / bağlam menüleri
29. [YAPILMALI] Pencere yönetimi uyumlu responsive layout
30. [YAPILMALI] Yüksek bilgi yoğunluğu layout'ları desteklenmeli

### AI/Intelligence Platform Uyumu
31. [YAPILMALI] AI özellikleri tüm platformlarda tutarlı davranmalı (behavior parity)
32. [YAPILMALI] Writing Tools desteği iOS/iPadOS/macOS'ta etkin olmalı
33. [YAPILMALI] App Intents iOS/iPadOS/macOS'ta tanımlı olmalı
34. [YAPILMAMALI] AI özelliklerini tek platforma sınırlama (geçerli neden olmadan)

## Anti-pattern'ler
1. [ZAYIF] Platform-specific kod packages/ altında — apps/ altına taşınmalı
2. [ZAYIF] Mobile'da hover-dependent UI — mobile'da hover yok
3. [ZAYIF] iOS'ta Material Design bottom navigation bar
4. [ZAYIF] Web'de tek breakpoint sabit layout — responsive değil
5. [ZAYIF] Bir platformda feature var, diğerinde sessizce atlanmış
6. [ZAYIF] iPhone'da iPadOS layout'u — ekran boyutuna adapte değil
7. [ZAYIF] iPadOS'ta Sidebar yok — iPhone layout direkt taşınmış
8. [ZAYIF] iPadOS'ta pointer hover efekti yok
9. [ZAYIF] Web'de keyboard shortcuts tanımsız
10. [ZAYIF] AI özelliği tek platformda, diğerinde yok (gerekçe olmadan)

## Kontrol Listesi
- [ ] Platform-specific kod doğru dizinde mi?
- [ ] Cross-platform feature'da behavior parity var mı?
- [ ] Platform convention'ına uyuluyor mu?
- [ ] Shared kod gerçekten shared mi?
- [ ] iOS: Tab bar + Navigation bar + gesture desteği var mı?
- [ ] iPadOS: Sidebar, pointer hover, keyboard shortcuts var mı?
- [ ] iPadOS: Multitasking uyumu test edildi mi?
- [ ] Web: Responsive, keyboard-first, context menu var mı?
- [ ] AI özellikleri tüm platformlarda tutarlı mı?

## Kaynak
- Platform adaptation → docs/design-system/26-platform-adaptation-rules.md
- Web runtime → docs/adr/ADR-001-web-runtime-and-application-shell.md
- Mobile runtime → docs/adr/ADR-002-mobile-runtime-and-native-strategy.md
- Apple HIG Platforms → developer.apple.com/design/human-interface-guidelines/designing-for-ios
- AI/Intelligence UX → docs/ai-guardrails/domain/D-AIX-ai-intelligence-ux.md
