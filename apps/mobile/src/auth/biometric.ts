// L.1.8 — expo-local-authentication entegrasyonu
// L.1.9 — Security level ayrimi
// L.1.10 — Fallback mekanizmasi (zorunlu)
// L.1.11 — Token-unlock akisi
//
// NOT: expo-local-authentication henuz install edilmedi.
// Bu dosya tip-guvenli interface ve akim tanimlarini icerir.
// Install sonrasi gercek implementasyon baglanacak.

/** Biometric donanim durumu */
export interface BiometricCapability {
  hasHardware: boolean;
  isEnrolled: boolean;
  supportedTypes: BiometricType[];
}

export type BiometricType = 'fingerprint' | 'facial' | 'iris';

/** L.1.9 — Security level */
export type BiometricSecurityLevel =
  | 'biometricStrong' // Class 3 — token unlock ve hassas islemler
  | 'biometricWeak'; // Class 2 — sadece convenience unlock

/** L.1.8 — Donanim kontrol fonksiyonlari */
export async function checkBiometricCapability(): Promise<BiometricCapability> {
  // expo-local-authentication install sonrasi:
  // const hasHardware = await LocalAuthentication.hasHardwareAsync();
  // const isEnrolled = await LocalAuthentication.isEnrolledAsync();
  // const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
  return { hasHardware: false, isEnrolled: false, supportedTypes: [] };
}

/** L.1.11 — Token-unlock akisi */
export async function authenticateWithBiometric(): Promise<{
  success: boolean;
  error?: string;
}> {
  // Akis:
  // 1. Biometric enrollment kontrol
  // 2. Biometric aktif + kullanici onay → biometric prompt
  // 3. Basarili → SecureStore'dan token oku
  // 4. Token gecerlilik kontrol (expired ise refresh)
  // 5. Basarisiz/iptal → PIN/sifre fallback
  //
  // KURAL: Biometric dogrulama ≠ backend session gecerliligi
  // Biometric yalnizca local secure storage kapisi

  const capability = await checkBiometricCapability();
  if (!capability.hasHardware || !capability.isEnrolled) {
    return { success: false, error: 'Biometric kullanilabilir degil' };
  }

  // expo-local-authentication install sonrasi:
  // const result = await LocalAuthentication.authenticateAsync({
  //   promptMessage: 'Kimliginizi dogrulayin',
  //   cancelLabel: 'Iptal',
  //   disableDeviceFallback: false, // L.1.10 — fallback her zaman mevcut
  // });
  // return { success: result.success, error: result.error };

  return { success: false, error: 'expo-local-authentication henuz kurulmadi' };
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
