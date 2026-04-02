// M.2.1 — MMKV persist middleware (ADR-019)
// M.2.4 — Encrypted vs Plain MMKV ayrimi
//
// react-native-mmkv install sonrasi gercek MMKV instance baglanacak.
// Su an tip-guvenli interface ve pattern tanimlari.

/** Plain MMKV — genel tercihler (tema, dil) */
export interface PlainStorage {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
  removeItem: (key: string) => void;
}

/** Encrypted MMKV — hassas tercihler (konum, bildirim) */
export interface EncryptedStorage extends PlainStorage {
  /** Encryption key SecureStore'da saklanir */
  readonly encrypted: true;
}

// react-native-mmkv install sonrasi:
// import { MMKV } from 'react-native-mmkv';
//
// export const plainStorage = new MMKV({ id: 'app-plain' });
// export const encryptedStorage = new MMKV({
//   id: 'app-encrypted',
//   encryptionKey: await getEncryptionKeyFromSecureStore(),
// });

// Gecici in-memory fallback (install oncesi)
const memoryStore = new Map<string, string>();

export const plainStorage: PlainStorage = {
  getItem: (key) => memoryStore.get(`plain:${key}`) ?? null,
  setItem: (key, value) => memoryStore.set(`plain:${key}`, value),
  removeItem: (key) => memoryStore.delete(`plain:${key}`),
};

export const encryptedStorage: EncryptedStorage = {
  encrypted: true,
  getItem: (key) => memoryStore.get(`enc:${key}`) ?? null,
  setItem: (key, value) => memoryStore.set(`enc:${key}`, value),
  removeItem: (key) => memoryStore.delete(`enc:${key}`),
};
