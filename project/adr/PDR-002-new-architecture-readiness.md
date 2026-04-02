# PDR-002 — New Architecture Readiness Raporu

**Tarih:** 2026-04-03
**Durum:** Dogrulanmis
**Referans:** ADR-018, SPEC-IMP-001 Faz D.5

## Dogrulama Sonuclari

### expo-doctor: 17/17 PASS

Tum dependency'ler Expo SDK 55 ile uyumlu, critical uyari yok.

### Hermes

- Expo SDK 55'te Hermes varsayilan JS engine'dir
- app.json'da `jsEngine` override yok → Hermes aktif
- Bytecode precompilation Expo managed workflow'da otomatik

### Fabric + New Architecture

- `expo-build-properties` plugin ile `newArchEnabled: true` (iOS + Android)
- Expo SDK 55 Fabric renderer'i varsayilan olarak destekler

### Legacy API Taramasi

- `setNativeProps`: kullanim yok ✓
- `findNodeHandle`: kullanim yok ✓
- `UIManager.dispatchViewManagerCommand`: kullanim yok ✓
- `requireNativeComponent`: kullanim yok ✓
- `NativeModules` (legacy bridge): kullanim yok ✓

### JSI Kutuphane Uyumlulugu

| Kutuphane                      | Versiyon | JSI/Fabric   | Durum          |
| ------------------------------ | -------- | ------------ | -------------- |
| react-native-reanimated        | 3.x      | JSI + Fabric | ✓ Expo bundled |
| react-native-mmkv              | 3.3.3    | JSI          | ✓ Kurulu       |
| react-native-gesture-handler   | 2.x      | Fabric       | ✓ Kurulu       |
| react-native-screens           | 4.23.x   | Fabric       | ✓ Kurulu       |
| react-native-safe-area-context | 5.6.x    | Fabric       | ✓ Kurulu       |

### Uyumsuz Paket / Fallback

Su an projede Fabric uyumsuz third-party paket bulunmamaktadir.
Gelecekte eklenen paketler icin:

1. React Native Directory'de "New Architecture" badge kontrolu zorunlu
2. Uyumsuz paket bulunursa → 44-exception-and-exemption-policy.md ile exception kaydı
3. Alternatif Fabric-uyumlu paket aranir

## Runtime Dogrulama

`global.HermesInternal` kontrolu ve Fabric renderer crash testi, development build olusturulunca yapilacaktir.
