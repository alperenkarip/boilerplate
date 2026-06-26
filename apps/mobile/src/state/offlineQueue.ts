// M.3.5 — Offline yazma kuyrugu (ADR-019 + ADR-020)
// Canonical yazma yolu callable Cloud Functions oldugundan, offline yazma =
// callable mutasyonlarinin (functionsAdapter.call) yeniden oynatma kuyrugudur.
// Client dogrudan Firestore'a YAZMAZ; TanStack Query mutasyonlari, ag geri
// geldiginde otomatik olarak duraklatilip yeniden oynatilir (onlineManager +
// exponential backoff). Mutasyon retry/retryDelay varsayilanlari App.tsx'te
// bu modulun calculateRetryDelay/shouldRetryOnError yardimcilarina baglanir.
//
// @react-native-community/netinfo install sonrasi ag tespiti netinfo'ya tasinacak.

import { onlineManager, type QueryClient } from '@tanstack/react-query';

// @MX:WARN: [AUTO] mutates global `onlineManager` state and registers globalThis online/offline listeners without lifecycle ownership
// @MX:REASON: Calling this more than once stacks duplicate listeners; the cleanup closure is returned to onlineManager, so callers cannot detach them, risking a listener leak
/**
 * Offline queue yapilandirmasi.
 * QueryClient'a baglanir, ag durumuna gore mutation pause/resume yapar.
 *
 * Exponential backoff: 0s → 1s → 2s → 4s → max 30s
 * Error classification:
 *   - Network error → retry
 *   - 401 → token refresh
 *   - 400/409 → retry yok
 *   - Idempotent (PUT/DELETE) → retry guvenli
 *   - Non-idempotent (POST) → dikkatli
 */
export function setupOfflineQueue(_queryClient: QueryClient) {
  // @react-native-community/netinfo install sonrasi:
  //
  // import NetInfo from '@react-native-community/netinfo';
  //
  // onlineManager.setEventListener((setOnline) => {
  //   return NetInfo.addEventListener((state) => {
  //     setOnline(!!state.isConnected);
  //   });
  // });

  // Su an web-only fallback: navigator.onLine
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const g = globalThis as any;
  if (typeof g.addEventListener !== 'undefined') {
    onlineManager.setEventListener((setOnline) => {
      const onlineHandler = () => setOnline(true);
      const offlineHandler = () => setOnline(false);
      g.addEventListener('online', onlineHandler);
      g.addEventListener('offline', offlineHandler);
      return () => {
        g.removeEventListener('online', onlineHandler);
        g.removeEventListener('offline', offlineHandler);
      };
    });
  }
}

/** Exponential backoff hesaplama */
export function calculateRetryDelay(attemptIndex: number): number {
  return Math.min(1000 * 2 ** attemptIndex, 30000);
}

/** Error classification — retry yapilmali mi? */
export function shouldRetryOnError(error: unknown): boolean {
  if (error instanceof Error && 'status' in error) {
    const status = (error as { status: number }).status;
    // 4xx client error → retry yok (400, 409 vb.)
    if (status >= 400 && status < 500 && status !== 408 && status !== 429) {
      return false;
    }
  }
  // Network error, 5xx, timeout → retry
  return true;
}
