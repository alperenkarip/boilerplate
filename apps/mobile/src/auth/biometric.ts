// L.1.8 — expo-local-authentication entegrasyonu
// L.1.9 — Security level ayrimi
// L.1.10 — Fallback mekanizmasi (zorunlu)
// L.1.11 — Token-unlock akisi
// @MX:ANCHOR: Biometric auth katmani — tum biometric islemleri bu modul uzerinden yapilir
// @MX:REASON: ADR-010 + D-BIO guardrail; biometric ASLA tek auth yontemi olamaz

import * as LocalAuthentication from 'expo-local-authentication';

// ─── Tipler ────────────────────────────────────────────────

/** Biometric donanim durumu */
export interface BiometricCapability {
  /** Cihazda biometric donanim var mi */
  hasHardware: boolean;
  /** Cihazda kayitli biometric (parmak izi, yuz vb.) var mi */
  isEnrolled: boolean;
  /** Desteklenen biometric turleri */
  supportedTypes: BiometricType[];
  /** Guvenlik seviyesi */
  securityLevel: BiometricSecurityLevel;
}

export type BiometricType = 'fingerprint' | 'facial' | 'iris';

/** L.1.9 — Security level */
export type BiometricSecurityLevel =
  | 'biometricStrong' // Class 3 — token unlock ve hassas islemler
  | 'biometricWeak' // Class 2 — sadece convenience unlock
  | 'none'; // Biometric yok veya kontrol edilemedi

/** Biometric dogrulama secenekleri */
export interface BiometricAuthOptions {
  /** Kullaniciya gosterilecek prompt mesaji (i18n key olmali) */
  promptMessage?: string;
  /** Iptal butonu etiketi (i18n key olmali) */
  cancelLabel?: string;
  /** Cihaz PIN/sifre fallback'i aktif mi (varsayilan: true — D-BIO #5) */
  disableDeviceFallback?: boolean;
  /** Fallback buton etiketi (i18n key olmali) */
  fallbackLabel?: string;
}

/** Biometric dogrulama sonucu */
export interface BiometricAuthResult {
  success: boolean;
  error?: BiometricErrorCode;
  /** Kullaniciya gosterilebilir hata mesaji */
  errorMessage?: string;
}

/** D-BIO hata kodlari */
export type BiometricErrorCode =
  | 'NOT_AVAILABLE' // Donanim yok
  | 'NOT_ENROLLED' // Kayitli biometric yok
  | 'CANCELLED' // Kullanici iptal etti
  | 'LOCKOUT' // Cok fazla basarisiz deneme
  | 'SYSTEM_ERROR' // Sistem hatasi
  | 'FALLBACK'; // Kullanici fallback secti

// ─── i18n key sabitleri ───────────────────────────────────
// i18n (ADR-011) entegre edildiginde bu default degerler i18next namespace'i ile degistirilmeli
// Namespace: biometric:
// @MX:TODO: i18n entegrasyonu sonrasi bu sabitleri i18next key'lerine donustur

const BIOMETRIC_STRINGS = {
  /** biometric:prompt.message */
  promptMessage: 'Kimliginizi dogrulayin',
  /** biometric:prompt.cancel */
  cancelLabel: 'Iptal',
  /** biometric:prompt.fallback */
  fallbackLabel: 'Sifre ile gir',
  /** biometric:error.not_available */
  errorNotAvailable: 'Biometric dogrulama bu cihazda kullanilabilir degil',
  /** biometric:error.not_enrolled */
  errorNotEnrolled: 'Cihazda kayitli biometric yok. Cihaz ayarlarindan biometric ekleyin.',
  /** biometric:error.cancelled */
  errorCancelled: 'Biometric dogrulama iptal edildi',
  /** biometric:error.lockout */
  errorLockout: 'Cok fazla basarisiz deneme. Lutfen daha sonra tekrar deneyin.',
  /** biometric:error.fallback */
  errorFallback: 'Sifre ile devam ediliyor',
  /** biometric:error.system */
  errorSystem: 'Biometric dogrulama sirasinda bir hata olustu',
  /** biometric:error.no_hardware */
  errorNoHardware: 'Cihazda biometric donanim bulunamadi',
} as const;

// ─── SDK tip eslestirme yardimcisi ────────────────────────

/** expo-local-authentication AuthenticationType -> BiometricType eslestirmesi */
function mapAuthType(sdkType: LocalAuthentication.AuthenticationType): BiometricType {
  switch (sdkType) {
    case LocalAuthentication.AuthenticationType.FINGERPRINT:
      return 'fingerprint';
    case LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION:
      return 'facial';
    case LocalAuthentication.AuthenticationType.IRIS:
      return 'iris';
    default:
      return 'fingerprint';
  }
}

/** expo-local-authentication SecurityLevel -> BiometricSecurityLevel eslestirmesi */
function mapSecurityLevel(sdkLevel: LocalAuthentication.SecurityLevel): BiometricSecurityLevel {
  switch (sdkLevel) {
    case LocalAuthentication.SecurityLevel.BIOMETRIC_STRONG:
      return 'biometricStrong';
    case LocalAuthentication.SecurityLevel.BIOMETRIC_WEAK:
      return 'biometricWeak';
    default:
      return 'none';
  }
}

// ─── Public API ────────────────────────────────────────────

/** L.1.8 — Biometric donanim ve enrollment kontrol
 * D-PLT: Capability-based detection — Platform.OS yerine gercek donanim sorgulama
 */
export async function checkBiometricCapability(): Promise<BiometricCapability> {
  try {
    const [hasHardware, isEnrolled, sdkTypes, sdkLevel] = await Promise.all([
      LocalAuthentication.hasHardwareAsync(),
      LocalAuthentication.isEnrolledAsync(),
      LocalAuthentication.supportedAuthenticationTypesAsync(),
      LocalAuthentication.getEnrolledLevelAsync(),
    ]);

    return {
      hasHardware,
      isEnrolled,
      supportedTypes: sdkTypes.map(mapAuthType),
      securityLevel: mapSecurityLevel(sdkLevel),
    };
  } catch {
    // Donanim sorgulama basarisiz — guvenli varsayilan don
    return {
      hasHardware: false,
      isEnrolled: false,
      supportedTypes: [],
      securityLevel: 'none',
    };
  }
}

/** L.1.11 — Biometric dogrulama (token-unlock akisi)
 *
 * Akis:
 * 1. Biometric enrollment kontrol (D-BIO #11)
 * 2. Biometric prompt goster
 * 3. Basarili → SecureStore'dan token okunabilir
 * 4. Basarisiz/iptal → fallback (PIN/sifre)
 *
 * KURAL: Biometric dogrulama ≠ backend session gecerliligi
 * Biometric yalnizca local secure storage kapisi
 *
 * @MX:WARN: Biometric sonucu Sentry/analytics'e gonderilmemeli (D-BIO #8)
 * @MX:REASON: Privacy kurali — biometric basari/basarisizlik verisi disariya sizmamali
 */
export async function authenticateWithBiometric(
  options?: BiometricAuthOptions,
): Promise<BiometricAuthResult> {
  // 1. Enrollment kontrol — prompt gostermeden once (D-BIO #11)
  const capability = await checkBiometricCapability();

  if (!capability.hasHardware) {
    return {
      success: false,
      error: 'NOT_AVAILABLE',
      errorMessage: BIOMETRIC_STRINGS.errorNoHardware,
    };
  }

  if (!capability.isEnrolled) {
    return {
      success: false,
      error: 'NOT_ENROLLED',
      errorMessage: BIOMETRIC_STRINGS.errorNotEnrolled,
    };
  }

  // 2. Biometric prompt goster
  try {
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: options?.promptMessage ?? BIOMETRIC_STRINGS.promptMessage,
      cancelLabel: options?.cancelLabel ?? BIOMETRIC_STRINGS.cancelLabel,
      // D-BIO #5: Fallback her zaman mevcut — disableDeviceFallback varsayilan false
      disableDeviceFallback: options?.disableDeviceFallback ?? false,
      fallbackLabel: options?.fallbackLabel ?? BIOMETRIC_STRINGS.fallbackLabel,
    });

    if (result.success) {
      return { success: true };
    }

    // Hata kodunu eslestir
    const errorCode = mapErrorCode(result.error);
    return {
      success: false,
      error: errorCode,
      errorMessage: getErrorMessage(errorCode),
    };
  } catch {
    return {
      success: false,
      error: 'SYSTEM_ERROR',
      errorMessage: BIOMETRIC_STRINGS.errorSystem,
    };
  }
}

/** L.1.10 — Fallback mekanizmasi
 * Biometric her zaman opsiyonel — zorunlu kilinamaz.
 * PIN/sifre/pattern alternatifi her zaman mevcut.
 * Accessibility: biometric kullanamayan kullanicilar icin alternatif yol.
 */
export function isBiometricRequired(): false {
  // Biometric ASLA zorunlu degildir (ADR-010)
  return false;
}

// ─── Dahili yardimcilar ────────────────────────────────────

/** expo-local-authentication hata string'ini BiometricErrorCode'a eslestir */
function mapErrorCode(error: string | undefined): BiometricErrorCode {
  if (!error) return 'SYSTEM_ERROR';

  // expo-local-authentication hata string'leri
  if (error.includes('user_cancel') || error.includes('cancel')) return 'CANCELLED';
  if (error.includes('lockout')) return 'LOCKOUT';
  if (error.includes('user_fallback') || error.includes('fallback')) return 'FALLBACK';
  if (error.includes('not_enrolled')) return 'NOT_ENROLLED';
  if (error.includes('not_available')) return 'NOT_AVAILABLE';

  return 'SYSTEM_ERROR';
}

/** Hata koduna gore kullaniciya gosterilebilir mesaj
 * i18n entegrasyonu sonrasi bu fonksiyon t('biometric:error.xxx') ile degistirilmeli
 */
function getErrorMessage(code: BiometricErrorCode): string {
  switch (code) {
    case 'NOT_AVAILABLE':
      return BIOMETRIC_STRINGS.errorNotAvailable;
    case 'NOT_ENROLLED':
      return BIOMETRIC_STRINGS.errorNotEnrolled;
    case 'CANCELLED':
      return BIOMETRIC_STRINGS.errorCancelled;
    case 'LOCKOUT':
      return BIOMETRIC_STRINGS.errorLockout;
    case 'FALLBACK':
      return BIOMETRIC_STRINGS.errorFallback;
    case 'SYSTEM_ERROR':
      return BIOMETRIC_STRINGS.errorSystem;
  }
}
