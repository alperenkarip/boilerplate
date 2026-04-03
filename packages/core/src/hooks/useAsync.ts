// @MX:WARN: [AUTO] Async state hook with AbortController and unmount guard — race condition risk
// @MX:REASON: Manages concurrent async calls; incorrect abort handling can cause stale state updates
// @MX:TODO: [AUTO] No test file — abort, unmount cleanup, and error normalization paths are untested
import { useCallback, useEffect, useRef, useState } from 'react';

/** useAsync hook'unun dondurdugu durum tipi */
interface AsyncState<T> {
  data: T | null;
  error: Error | null;
  loading: boolean;
}

/**
 * Async fonksiyonlari yonetmek icin generic hook.
 * AbortController ile onceki istekleri iptal eder.
 * Unmount sirasinda aktif istegi temizler.
 */
export function useAsync<T>(
  asyncFn: (signal: AbortSignal) => Promise<T>,
  deps: unknown[],
): AsyncState<T> {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    error: null,
    loading: true,
  });

  // Unmount durumunu takip et — state guncellemeyi engelle
  const mountedRef = useRef(true);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // asyncFn referans degisikliginden bagimsiz calissin
  const stableAsyncFn = useCallback(asyncFn, deps);

  useEffect(() => {
    const abortController = new AbortController();

    setState((prev) => ({ ...prev, loading: true, error: null }));

    stableAsyncFn(abortController.signal)
      .then((data) => {
        if (mountedRef.current && !abortController.signal.aborted) {
          setState({ data, error: null, loading: false });
        }
      })
      .catch((error: unknown) => {
        if (mountedRef.current && !abortController.signal.aborted) {
          const normalizedError = error instanceof Error ? error : new Error(String(error));
          setState({ data: null, error: normalizedError, loading: false });
        }
      });

    // Re-render veya unmount'ta onceki istegi iptal et
    return () => {
      abortController.abort();
    };
  }, [stableAsyncFn]);

  return state;
}
