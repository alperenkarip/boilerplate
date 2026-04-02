// Auth boundary tipleri — platform-agnostik
// Auth provider SDK erisimi packages/core'da YASAK (21-repo-structure-spec.md)
// Bu dosya sadece UI-facing sanitized tipler icerir

export type AuthStatus = 'authenticated' | 'unauthenticated' | 'refreshing' | 'expired';

/** UI'a sunulan temiz auth ozeti */
export interface AuthSummary {
  status: AuthStatus;
  userId: string | null;
  displayName: string | null;
}

/** Logout temizlik sozlesmesi (Faz L) */
export interface LogoutCleanupContract {
  clearQueryCache: () => void;
  resetStores: () => void;
  clearSecureStorage: () => void;
  resetNavigation: () => void;
}
