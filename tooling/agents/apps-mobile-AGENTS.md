# apps/mobile/ Codex Talimatları

> Bu dosya bootstrap sırasında `apps/mobile/AGENTS.md` konumuna taşınır.
> Kök AGENTS.md ile çelişmez, yalnızca ek kısıtlama getirir.

## Mobile App Review Rules

### Platform-Specific
- Mobile runtime: React Native + Expo SDK 55.x (ADR-002)
- Styling: NativeWind 5.x candidate track (ADR-007) — release-status doğrulaması zorunlu
- Auth: Expo SecureStore (ADR-010)
- AsyncStorage'da token saklama → REDDET
- Navigation: React Navigation 7.x (ADR-012)

### Apple HIG Uyumu (D-UIX)
- Touch target: minimum 44×44pt → ihlal P0
- Safe area: kök yüzeyler SafeAreaView kullanıyor mu? → ihlal P0
- iOS back gesture çalışıyor mu?
- Navigation bar HIG uyumlu mu?
- Modal/sheet presentation iOS convention'a uygun mu?

### Mobile-Specific A11y
- accessibilityLabel her interactive öğede var mı?
- accessibilityRole tanımlı mı?
- Dynamic Type / font scaling destekleniyor mu?
- Reduced motion guard var mı?

### Performance (Mobile-Specific)
- FlatList/VirtualizedList büyük listelerde kullanılıyor mu?
- Image boyutları optimize mi?
- Snapshot listener cleanup yapılıyor mu?
- Memory leak riski var mı (listener/subscription)?
