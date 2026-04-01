# SPEC-GAP-001 — Dokümantasyon Boşluk Kapatma Planı

## Spec Kimliği

- **SPEC ID:** SPEC-GAP-001
- **Başlık:** Kapsamlı Dokümantasyon Boşluk Kapatma
- **Durum:** Completed
- **Tarih:** 2026-04-01
- **Kapsam:** Mevcut boilerplate doküman setinde tespit edilen eksik alanların (push notification, deep linking, OTA update, in-app purchase, GDPR/KVKK, biometric auth, ASO, haptic feedback, background tasks, observability derinleştirmesi, security genişletmesi, CI/CD detaylandırması, dark mode derinleştirmesi, onboarding/retention, on-device AI, PWA, clipboard/share, app clips) kapatılması
- **Hariç Tutulan Alanlar:** Feature Flags / Remote Config (1.6), Real-time İletişim Derinleştirmesi (2.3)

---

## 1. Amaç

Bu SPEC, 2026 internet araştırması ve mevcut doküman seti karşılaştırması sonucu tespit edilen boşlukların sistematik olarak kapatılmasını planlar. Hedef, kapsamlı bir cross-platform (web + mobile) ürünün ihtiyaç duyduğu tüm altyapı ve operasyonel konuların dokümante edilmesidir.

---

## 2. Kapsam Tablosu

### 2.1. Yeni ADR'ler (5 adet)

| ADR | Dosya Adı | Kapsam |
|-----|-----------|--------|
| ADR-013 | `ADR-013-push-notification-strategy.md` | FCM/APNs entegrasyonu, izin yönetimi, rich notification, silent push, analitik |
| ADR-014 | `ADR-014-deep-linking-and-universal-links.md` | Universal Links (iOS), App Links (Android), deferred deep linking, URI scheme, smart link |
| ADR-015 | `ADR-015-ota-update-strategy.md` | EAS Update, staged rollout, rollback, JS bundle vs native ayrımı, update channel |
| ADR-016 | `ADR-016-in-app-purchase-and-subscription.md` | RevenueCat/react-native-iap, subscription lifecycle, receipt validation, cross-platform sync |
| ADR-017 | `ADR-017-privacy-and-data-protection-framework.md` | GDPR, KVKK, consent management, data retention, SDK governance, privacy manifest |

### 2.2. Mevcut ADR Genişletmesi (1 adet)

| ADR | Eklenen Bölüm |
|-----|---------------|
| ADR-010 | Biometric Authentication — Face ID, Touch ID, Fingerprint, fallback, passkey |

### 2.3. Mevcut Doküman Genişletmeleri (8 adet)

| Doküman | Eklenen Bölüm |
|---------|---------------|
| `24-motion-and-interaction-standard.md` | Haptic feedback tipleri, expo-haptics, Reanimated 4 worklet haptic, platform farkları |
| `27-security-and-secrets-baseline.md` | CSP, rate limiting, OWASP API Security Top 10, certificate pinning, jailbreak/root detection |
| `28-observability-and-debugging.md` | OpenTelemetry, structured logging, RUM, Core Web Vitals, crash-free session rate |
| `15-quality-gates-and-ci-rules.md` | Fastlane, EAS Build profilleri, code signing, preview deployment |
| `05-theming-and-visual-language.md` | System preference sync, theme transition, CSS light-dark(), contrast enforcement |
| `29-release-and-versioning-rules.md` | OTA güncelleme disiplini, ASO, store listing, store review guideline |
| `26-platform-adaptation-rules.md` | Background tasks, geofencing, share extension, app clips/instant apps, clipboard |
| `39-default-screens-and-components-spec.md` | Onboarding gamification, retention hedefleri, tooltip/coach mark, personalized onboarding |

### 2.4. Yeni Domain Guardrail'ler (5 adet)

| Guardrail | Dosya Adı | Kapsam |
|-----------|-----------|--------|
| D-NTF | `D-NTF-push-notification.md` | Push notification kuralları |
| D-DPL | `D-DPL-deep-linking.md` | Deep linking kuralları |
| D-PAY | `D-PAY-payment-subscription.md` | Ödeme/abonelik kuralları |
| D-PRI | `D-PRI-privacy-compliance.md` | Veri gizliliği kuralları |
| D-BIO | `D-BIO-biometric-auth.md` | Biyometrik kimlik doğrulama kuralları |

### 2.5. Yeni Activity Guardrail'ler (5 adet)

| Guardrail | Dosya Adı | Kapsam |
|-----------|-----------|--------|
| A-NOTIFICATION | `A-NOTIFICATION-push-notification.md` | Push notification geliştirme |
| A-DEEPLINK | `A-DEEPLINK-deep-linking.md` | Deep link implementasyonu |
| A-PAYMENT | `A-PAYMENT-in-app-purchase.md` | Ödeme/abonelik entegrasyonu |
| A-OTA | `A-OTA-over-the-air-update.md` | OTA güncelleme |
| A-PRIVACY | `A-PRIVACY-compliance.md` | Gizlilik uyum çalışması |

### 2.6. Meta Güncellemeler

| Doküman | Değişiklik |
|---------|------------|
| `35-document-map.md` | Yeni ADR'ler ve belge referansları |
| `47-ai-guardrail-governance.md` | Yeni guardrail'ler aktivasyon tablosuna ekleme |
| `CLAUDE.md` | Yeni ADR referansları |

---

## 3. Uyumluluk Kısıtları

1. Mevcut canonical stack kararları (ADR-001 → ADR-017) korunacak, çelişilmeyecek
2. Mevcut otorite hiyerarşisi korunacak (00 > 01 > alan standardı > ADR > governance)
3. Yeni ADR'ler mevcut ADR'lerin üstüne geçmeyecek, onları tamamlayacak
4. Mevcut doküman genişletmelerinde orijinal yapı ve bölüm numaraları korunacak, yeni bölümler sona eklenecek
5. Yeni guardrail'ler mevcut guardrail formatına uyacak
6. Dependency önerileri 37-dependency-policy.md kurallarına uyacak
7. Versiyon referansları 38-version-compatibility-matrix.md ile tutarlı olacak
8. Tüm dokümanlar Türkçe yazılacak (teknik terimler hariç)

---

## 4. Bağımlılık Sırası

1. Önce yeni ADR'ler yazılır (karar katmanı)
2. Sonra mevcut doküman genişletmeleri yapılır (uygulama katmanı)
3. Sonra yeni guardrail'ler yazılır (denetim katmanı)
4. En son meta güncellemeler yapılır (navigasyon katmanı)

---

## 5. Başarı Kriterleri

1. Tüm yeni ADR'ler 18-adr-template.md formatına uygun
2. Mevcut doküman genişletmeleri orijinal yapıyı bozmadan entegre
3. Yeni guardrail'ler mevcut D-*/A-* formatına uygun
4. Document map güncel ve tutarlı
5. CLAUDE.md yeni ADR referanslarını içeriyor
6. Hiçbir mevcut canonical karar çelişilmiyor
