// Web session — Firebase Auth backed (ADR-021).
//
// Replaces the previous cookie/`/api/auth/me` design. The authoritative initial
// auth state comes from Firebase's first onAuthStateChanged signal (which fires
// after persisted-session restoration). Sign-out is best-effort so the caller's
// client teardown (cache clear, state reset) always runs.

import type { AuthSummary, Unsubscribe } from '@project/core';
import { authAdapter } from '../firebase/authAdapter';

/**
 * Resolve the initial session by awaiting the first auth-state signal.
 * Firebase invokes the listener once persisted-session restoration completes,
 * yielding either an authenticated or unauthenticated summary.
 */
// @MX:ANCHOR: [AUTO] Session bootstrap boundary — resolves the first Firebase auth-state signal into an AuthSummary one-shot; intended for route loaders/guards that need a single authoritative session check.
// @MX:REASON: Public auth boundary replacing the prior /api/auth/me contract (reactive state lives in useAuth's onAuthStateChanged subscription instead). "Wait for the first onAuthStateChanged emission" is the invariant that prevents premature unauthenticated redirects during session restore.
export function checkSession(): Promise<AuthSummary> {
  return new Promise((resolve) => {
    const unsubscribe: Unsubscribe = authAdapter.onAuthStateChanged((summary) => {
      unsubscribe();
      resolve(summary);
    });
  });
}

/**
 * Sign the user out (Firebase Auth). Best-effort: a failed sign-out is logged
 * and swallowed, never rethrown, so the caller's logout teardown still runs.
 */
export async function logout(): Promise<void> {
  try {
    await authAdapter.signOut();
  } catch (err) {
    // Best-effort sign-out — swallow and log so client teardown is never skipped.
    console.warn('[auth] sign-out failed (best-effort, ignored):', err);
  }
}
