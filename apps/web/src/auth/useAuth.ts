// Auth hook — Firebase Auth backed (ADR-021).
//
// Owns reactive auth state via onAuthStateChanged, the sign-in/sign-up actions,
// and the deterministic logout cleanup contract (L.1.5 + L.1.7): on logout the
// query cache is cleared to prevent wrong-user data leaks, regardless of whether
// the server-side sign-out succeeds.

import { useState, useCallback, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import type { AuthSummary } from '@project/core';
import { authAdapter } from '../firebase/authAdapter';
import { logout as logoutSession } from './session';

const UNAUTHENTICATED: AuthSummary = {
  status: 'unauthenticated',
  userId: null,
  displayName: null,
};

export interface UseAuthResult extends AuthSummary {
  /** Sign in with email + password; reactive state updates via the auth listener. */
  login: (email: string, password: string) => Promise<AuthSummary>;
  /** Create an account with email + password; reactive state updates via the listener. */
  register: (email: string, password: string) => Promise<AuthSummary>;
  /** Sign out and run the deterministic client teardown (cache clear + state reset). */
  logout: () => Promise<void>;
  /** True until the first auth-state signal resolves. */
  isLoading: boolean;
}

// @MX:ANCHOR: [AUTO] Public auth API boundary — owns session bootstrap (onAuthStateChanged), sign-in/up actions, and logout cleanup contract (L.1.5/L.1.7: queryClient.clear() on logout).
// @MX:REASON: Auth contract surface consumed app-wide via AuthProvider (fan_in: AuthProvider + auth pages). The cache-clear-on-logout invariant must be preserved to prevent cross-user data leaks.
export function useAuth(): UseAuthResult {
  const [summary, setSummary] = useState<AuthSummary>(UNAUTHENTICATED);
  const [isLoading, setIsLoading] = useState(true);
  const queryClient = useQueryClient();

  // Subscribe to auth-state transitions for the lifetime of the provider.
  useEffect(() => {
    const unsubscribe = authAdapter.onAuthStateChanged((next) => {
      setSummary(next);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const login = useCallback(
    (email: string, password: string) => authAdapter.signIn(email, password),
    [],
  );

  const register = useCallback(
    (email: string, password: string) => authAdapter.signUp(email, password),
    [],
  );

  // L.1.5 — logout cleanup contract (deterministic teardown).
  const logout = useCallback(async () => {
    try {
      // 1. End the Firebase session (best-effort — session.logout swallows errors).
      await logoutSession();
    } catch (err) {
      // Defense in depth: even if sign-out rejects, teardown must still run so
      // the caller never observes a failed logout and the UI stays consistent.
      console.warn('[Auth] logout request failed; client teardown continues:', err);
    } finally {
      // 2. Clear the query cache (L.1.7 — wrong-user leak prevention).
      queryClient.clear();
      // 3. Reset auth state. The onAuthStateChanged listener also fires, but we
      //    reset eagerly so consumers do not flash stale authenticated state.
      setSummary(UNAUTHENTICATED);
    }
  }, [queryClient]);

  return { ...summary, login, register, logout, isLoading };
}
