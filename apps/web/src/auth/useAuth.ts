// Auth hook — web platform
// Cookie-preferred session yonu (ADR-010)
// L.1.5 Logout cleanup contract implementasyonu
// L.1.6 Session restore/bootstrap akisi
// L.1.7 Wrong-user leak onleme

import { useState, useCallback, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import type { AuthStatus, AuthSummary } from '@project/core';
import { checkSession, logout as logoutSession } from './session';

export function useAuth(): AuthSummary & {
  login: () => void;
  logout: () => void;
  isLoading: boolean;
} {
  const [status, setStatus] = useState<AuthStatus>('unauthenticated');
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const queryClient = useQueryClient();

  // L.1.6 — Session restore/bootstrap akisi
  useEffect(() => {
    let cancelled = false;
    async function restore() {
      const result = await checkSession();
      if (!cancelled) {
        setStatus(result.status);
        setUserId(result.userId);
        setIsLoading(false);
      }
    }
    restore();
    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(() => {
    setStatus('authenticated');
  }, []);

  // L.1.5 — Logout cleanup contract (deterministik temizlik)
  const logout = useCallback(async () => {
    // 1. Backend session sonlandir
    await logoutSession();

    // 2. Query cache temizle (L.1.7 — wrong-user leak onleme)
    queryClient.clear();

    // 3. Auth state reset
    setStatus('unauthenticated');
    setUserId(null);

    // 4. Navigation reset — router seviyesinde yapilir
    // window.location.href = '/auth/login' veya router.navigate
  }, [queryClient]);

  return {
    status,
    userId,
    displayName: status === 'authenticated' ? 'Kullanici' : null,
    login,
    logout,
    isLoading,
  };
}
