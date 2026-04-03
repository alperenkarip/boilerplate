// L.1.4 — Mobile: Expo SecureStore adapter (ADR-010)
// Token'lar YALNIZCA SecureStore'da saklanir — MMKV'ye YAZILMAZ
// @MX:ANCHOR: Auth token persistence katmani — tum token islemleri bu modul uzerinden yapilir
// @MX:REASON: ADR-010 zorunlu boundary; SecureStore disinda token saklama YASAK

import * as SecureStore from 'expo-secure-store';

/** SecureStore key tanimlari */
export const SECURE_KEYS = {
  ACCESS_TOKEN: 'auth_access_token',
  REFRESH_TOKEN: 'auth_refresh_token',
  /** MMKV encrypted instance icin sifreleme anahtari (ADR-019) */
  MMKV_ENCRYPTION_KEY: 'mmkv_encryption_key',
} as const;

/** SecureStore key tipi */
export type SecureStorageKey = keyof typeof SECURE_KEYS;

/** SecureStore hata tipleri */
export class SecureStorageError extends Error {
  constructor(
    message: string,
    public readonly operation: 'save' | 'get' | 'delete',
    public readonly key: SecureStorageKey,
    public readonly cause?: unknown,
  ) {
    super(message);
    this.name = 'SecureStorageError';
  }
}

/** Token kaydet */
export async function saveToken(key: SecureStorageKey, value: string): Promise<void> {
  try {
    await SecureStore.setItemAsync(SECURE_KEYS[key], value);
  } catch (error: unknown) {
    throw new SecureStorageError(
      `SecureStore yazma hatasi: ${SECURE_KEYS[key]}`,
      'save',
      key,
      error,
    );
  }
}

/** Token oku */
export async function getToken(key: SecureStorageKey): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync(SECURE_KEYS[key]);
  } catch (error: unknown) {
    throw new SecureStorageError(
      `SecureStore okuma hatasi: ${SECURE_KEYS[key]}`,
      'get',
      key,
      error,
    );
  }
}

/** Token sil */
export async function deleteToken(key: SecureStorageKey): Promise<void> {
  try {
    await SecureStore.deleteItemAsync(SECURE_KEYS[key]);
  } catch (error: unknown) {
    throw new SecureStorageError(
      `SecureStore silme hatasi: ${SECURE_KEYS[key]}`,
      'delete',
      key,
      error,
    );
  }
}

/** Tum auth token'larini temizle (logout / user switch)
 * LogoutCleanupContract.clearSecureStorage() ile uyumlu
 */
export async function clearAllTokens(): Promise<void> {
  // Her iki token'i bagimsiz olarak silmeye calis;
  // birinin hatasi digerini engellememeli
  const results = await Promise.allSettled([
    deleteToken('ACCESS_TOKEN'),
    deleteToken('REFRESH_TOKEN'),
  ]);

  // Basarisiz islemleri topla
  const failures = results.filter((r): r is PromiseRejectedResult => r.status === 'rejected');

  if (failures.length > 0) {
    throw new SecureStorageError(
      `Token temizleme sirasinda ${String(failures.length)} hata olustu`,
      'delete',
      'ACCESS_TOKEN',
      failures.map((f) => f.reason),
    );
  }
}
