// M.2.1 — MMKV persist middleware (ADR-019)
// M.2.4 — Encrypted vs Plain MMKV ayrimi
// @MX:ANCHOR: Local storage katmani — Zustand persist ve genel tercihler bu modul uzerinden yapilir
// @MX:REASON: ADR-019 canonical; MMKV varsayilan non-secure persistence, AsyncStorage yeni kodda YASAK

import { MMKV } from 'react-native-mmkv';
import { getToken, saveToken } from '../auth/secureStorage';

// ─── Tipler ────────────────────────────────────────────────

/** Zustand persist middleware ile uyumlu storage interface */
export interface ZustandPersistStorage {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
  removeItem: (key: string) => void;
}

// ─── Plain MMKV ────────────────────────────────────────────

/** Plain MMKV — genel tercihler (tema, dil, bildirim ayarlari)
 * Sifreleme gerektirmeyen, sik okunan veriler icin.
 * @MX:WARN: Auth token veya credential ASLA bu instance'a yazilmamali
 * @MX:REASON: D-OFL #11 — auth artefaktlari icin SecureStore zorunlu
 */
const plainMMKV = new MMKV({
  id: 'app-plain',
});

export const plainStorage: ZustandPersistStorage = {
  getItem: (key: string): string | null => {
    return plainMMKV.getString(key) ?? null;
  },
  setItem: (key: string, value: string): void => {
    plainMMKV.set(key, value);
  },
  removeItem: (key: string): void => {
    plainMMKV.delete(key);
  },
};

// ─── Encrypted MMKV ───────────────────────────────────────

/** Encrypted MMKV instance — lazy init pattern
 * Encryption key SecureStore'dan alinir (D-OFL #34)
 * Async oldugu icin lazy initialization gereklidir
 */
let encryptedMMKV: MMKV | null = null;

/** Kriptografik olarak guvenli rastgele 32 karakter encryption key uret
 * Hermes V1 (ADR-018) crypto.getRandomValues API'si kullanilir
 * Fallback olarak Math.random kullanilir ama bu durum dev'de uyari uretir
 */
function generateEncryptionKey(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const length = 32;

  // Hermes V1 crypto.getRandomValues destegi (ADR-018 zorunlu)
  // globalThis.crypto Hermes V1'de mevcut ama TypeScript lib:ES2022'de tanimli degil
  const cryptoObj = (globalThis as unknown as Record<string, unknown>)['crypto'] as
    | { getRandomValues?: (array: Uint8Array) => Uint8Array }
    | undefined;

  if (typeof cryptoObj?.getRandomValues === 'function') {
    const randomBytes = new Uint8Array(length);
    cryptoObj.getRandomValues(randomBytes);
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(randomBytes[i]! % chars.length);
    }
    return result;
  }

  // Fallback — Math.random (kriptografik olarak guvenli degil)
  if (typeof __DEV__ !== 'undefined' && __DEV__) {
    // eslint-disable-next-line no-console
    console.warn('[MMKV] crypto.getRandomValues mevcut degil — encryption key guvenli olmayabilir');
  }
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/** Encrypted MMKV instance'ini baslat
 * Uygulama acilisinda bir kez cagirilmali.
 * Encryption key SecureStore'da saklanir (D-OFL #34, D-OFL #36)
 */
export async function initEncryptedStorage(): Promise<void> {
  if (encryptedMMKV) return; // Zaten baslatilmis

  // SecureStore'dan encryption key'i al
  let encryptionKey = await getToken('MMKV_ENCRYPTION_KEY');

  // Ilk calistirmada key olustur ve SecureStore'a kaydet
  if (!encryptionKey) {
    encryptionKey = generateEncryptionKey();
    await saveToken('MMKV_ENCRYPTION_KEY', encryptionKey);
  }

  encryptedMMKV = new MMKV({
    id: 'app-encrypted',
    encryptionKey,
  });
}

/** Encrypted MMKV — hassas tercihler (konum, bildirim, ozel ayarlar)
 * AES-256 ile sifrelenmis MMKV instance.
 * initEncryptedStorage() cagirilmadan kullanilamaz.
 *
 * @MX:WARN: initEncryptedStorage() cagrilmadan erisilemez
 * @MX:REASON: Encryption key async olarak SecureStore'dan alinmali
 */
export const encryptedStorage: ZustandPersistStorage & { readonly encrypted: true } = {
  encrypted: true as const,
  getItem: (key: string): string | null => {
    if (!encryptedMMKV) {
      // initEncryptedStorage() henuz cagirilmamis — guvenli varsayilan
      return null;
    }
    return encryptedMMKV.getString(key) ?? null;
  },
  setItem: (key: string, value: string): void => {
    if (!encryptedMMKV) {
      // initEncryptedStorage() henuz cagirilmamis — sessizce atla
      // Bu durum uygulama acilisinda initEncryptedStorage() cagirarak onlenir
      return;
    }
    encryptedMMKV.set(key, value);
  },
  removeItem: (key: string): void => {
    if (!encryptedMMKV) return;
    encryptedMMKV.delete(key);
  },
};

// ─── Cleanup ──────────────────────────────────────────────

/** Tum MMKV verilerini temizle (logout / user switch)
 * LogoutCleanupContract.resetStores() ile uyumlu (ADR-010)
 * D-OFL #28: Logout'ta tum kullaniciya ozel persist edilmis veri temizlenmeli
 */
export function clearAllStorage(): void {
  plainMMKV.clearAll();
  if (encryptedMMKV) {
    encryptedMMKV.clearAll();
  }
}

// ─── Dogrudan MMKV erisimi (ozel durumlar icin) ───────────

/** Plain MMKV instance'ina dogrudan erisim
 * Zustand persist disindaki ozel durumlar icin
 */
export function getPlainMMKV(): MMKV {
  return plainMMKV;
}

/** Encrypted MMKV instance'ina dogrudan erisim
 * initEncryptedStorage() cagirilmis olmali
 */
export function getEncryptedMMKV(): MMKV | null {
  return encryptedMMKV;
}
