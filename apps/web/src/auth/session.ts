// L.1.3 — Web: Cookie-preferred session yonu (ADR-010)
// HttpOnly cookie backend tarafindan set edilir.
// Frontend token'a dogrudan erismez — sadece cookie varligini kontrol eder.

import type { AuthStatus } from '@project/core';

/**
 * Session durumunu kontrol eder.
 * Backend /api/auth/me endpoint'ine istek atar.
 * HttpOnly cookie otomatik gonderilir.
 */
// @MX:ANCHOR: [AUTO] External system integration point — backend /api/auth/me session check; relies on HttpOnly cookie (frontend never touches the token, ADR-010). Return-shape {status,userId} is the auth boundary contract.
// @MX:REASON: Backend integration boundary (fan_in=1: useAuth.ts). Cookie-preferred design and the 401->unauthenticated / other->expired mapping are invariants downstream auth state depends on.
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
  } catch (err) {
    // Network/offline/DNS/CORS hatasi != oturum kapali. Kullaniciyi login'e
    // zorlamamak icin kurtarilabilir 'expired' statusu dondur ve hatayi logla
    // (sessiz yutma debug'i imkansiz kilar).
    console.warn(
      '[Auth] checkSession failed (network/offline), returning recoverable status:',
      err,
    );
    return { status: 'expired', userId: null };
  }
}

/**
 * Logout — backend'e istek at, cookie'yi temizle.
 * Best-effort: server logout basarisiz olsa bile (network/5xx) bu fonksiyon
 * hata firlatmaz, boylece cagiran taraftaki client teardown (cache temizleme,
 * state reset) her zaman calisir (L.1.7 wrong-user leak onleme).
 */
export async function logout(): Promise<void> {
  try {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
  } catch (err) {
    // Server logout best-effort — hata yutulur ve loglanir, rethrow yok.
    // Client tarafi teardown'in atlanmamasi icin promise reject etmemeli.
    console.warn('[auth] server logout failed (best-effort, ignored):', err);
  }
}
