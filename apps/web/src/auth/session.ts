// L.1.3 — Web: Cookie-preferred session yonu (ADR-010)
// HttpOnly cookie backend tarafindan set edilir.
// Frontend token'a dogrudan erismez — sadece cookie varligini kontrol eder.

import type { AuthStatus } from '@project/core';

/**
 * Session durumunu kontrol eder.
 * Backend /api/auth/me endpoint'ine istek atar.
 * HttpOnly cookie otomatik gonderilir.
 */
export async function checkSession(): Promise<{ status: AuthStatus; userId: string | null }> {
  try {
    const res = await fetch('/api/auth/me', { credentials: 'include' });
    if (res.ok) {
      const data = await res.json();
      return { status: 'authenticated', userId: data.userId };
    }
    if (res.status === 401) {
      return { status: 'unauthenticated', userId: null };
    }
    return { status: 'expired', userId: null };
  } catch {
    return { status: 'unauthenticated', userId: null };
  }
}

/**
 * Logout — backend'e istek at, cookie'yi temizle.
 */
export async function logout(): Promise<void> {
  await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
}
