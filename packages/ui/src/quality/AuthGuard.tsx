// AuthGuard (C54) — Auth-aware route korumasi
// Auth durumuna gore children veya fallback gosterir

import { type ReactNode } from 'react';

type AuthStatus = 'authenticated' | 'unauthenticated' | 'refreshing' | 'expired';

interface AuthGuardProps {
  children: ReactNode;
  /** Mevcut auth durumu */
  status: AuthStatus;
  /** Auth olmayan kullanicilar icin fallback (login redirect vb.) */
  fallback: ReactNode;
  /** Token yenilenirken gosterilecek loading */
  loading?: ReactNode;
}

/**
 * Auth-aware route korumasi.
 * authenticated -> children, unauthenticated/expired -> fallback, refreshing -> loading
 */
export function AuthGuard({ children, status, fallback, loading }: AuthGuardProps) {
  switch (status) {
    case 'authenticated':
      return <>{children}</>;
    case 'refreshing':
      return <>{loading ?? children}</>;
    case 'unauthenticated':
    case 'expired':
      return <>{fallback}</>;
  }
}

export type { AuthStatus };
