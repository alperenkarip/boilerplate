// L.1.4 — Mobile: Expo SecureStore adapter (ADR-010)
// Token'lar YALNIZCA SecureStore'da saklanir — MMKV'ye YAZILMAZ
//
// expo-secure-store install sonrasi gercek implementasyon baglanacak.

/** SecureStore key tanimlari */
const KEYS = {
  ACCESS_TOKEN: 'auth_access_token',
  REFRESH_TOKEN: 'auth_refresh_token',
} as const;

/** Token kaydet */
export async function saveToken(key: keyof typeof KEYS, value: string): Promise<void> {
  // await SecureStore.setItemAsync(KEYS[key], value);
  void key;
  void value;
}

/** Token oku */
export async function getToken(key: keyof typeof KEYS): Promise<string | null> {
  // return await SecureStore.getItemAsync(KEYS[key]);
  void key;
  return null;
}

/** Token sil */
export async function deleteToken(key: keyof typeof KEYS): Promise<void> {
  // await SecureStore.deleteItemAsync(KEYS[key]);
  void key;
}

/** Tum auth token'larini temizle (logout) */
export async function clearAllTokens(): Promise<void> {
  await deleteToken('ACCESS_TOKEN');
  await deleteToken('REFRESH_TOKEN');
}
