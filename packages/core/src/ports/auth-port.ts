// @MX:ANCHOR: [AUTO] AuthPort — cross-platform auth contract (ADR-021); web & mobile adapters implement this
// @MX:REASON: Public API boundary consumed by every app auth adapter (firebase/auth, @react-native-firebase/auth) and all UI auth gating; a signature change breaks all auth adapters and consumers
//
// AuthPort — SDK-free authentication boundary (ADR-021).
//
// packages/core defines this interface only; it imports NO Firebase SDK.
// Adapters live in app code:
//   - apps/web    -> firebase/auth
//   - apps/mobile -> @react-native-firebase/auth
//
// Boundary contract (ADR-021 Section 11):
//   - The port returns sanitized AuthSummary objects, never raw SDK user objects.
//   - getIdToken() exposes the raw ID token ONLY for outbound request
//     authorization (callable adapter / 3rd-party REST). The token must not be
//     persisted to generic state, UI, or logs.

import type { AuthSummary } from '../auth/types';
import type { Unsubscribe } from './types';

export interface AuthPort {
  /** Current sanitized auth summary, or null before the first auth-state signal. */
  getCurrentUser(): AuthSummary | null;

  /**
   * Subscribe to auth-state changes (Firebase onAuthStateChanged equivalent).
   * The callback receives a sanitized summary on every transition.
   * Returns an Unsubscribe handle that MUST be called on cleanup.
   */
  onAuthStateChanged(callback: (summary: AuthSummary) => void): Unsubscribe;

  /** Sign in with email + password. Resolves with the sanitized summary. */
  signIn(email: string, password: string): Promise<AuthSummary>;

  /** Create a new account with email + password. Resolves with the sanitized summary. */
  signUp(email: string, password: string): Promise<AuthSummary>;

  /** Sign out the current user. Triggers deterministic cleanup (LogoutCleanupContract). */
  signOut(): Promise<void>;

  /** Send a password-reset email to the given address. */
  sendPasswordReset(email: string): Promise<void>;

  /** Send an email-verification message to the current user. */
  sendEmailVerification(): Promise<void>;

  /**
   * Update the current user's password.
   * Requires a recently-authenticated session: if the last sign-in is too old
   * the SDK rejects with a requires-recent-login error and the caller must
   * re-authenticate (e.g. re-sign-in) before retrying. Re-authentication is not
   * yet part of this port; it is a deliberate follow-up.
   */
  updatePassword(newPassword: string): Promise<void>;

  /**
   * Update the current user's profile fields. Passing null clears the
   * corresponding field; omitting a field leaves it unchanged. Only the
   * provider-agnostic displayName / photoURL fields are exposed here.
   */
  updateProfile(input: { displayName?: string | null; photoURL?: string | null }): Promise<void>;

  /**
   * Permanently delete the current user account. Destructive and irreversible.
   * Like updatePassword, may reject with requires-recent-login when the session
   * is stale, in which case the caller must re-authenticate first.
   */
  deleteAccount(): Promise<void>;

  /**
   * Complete a password reset using the out-of-band code (oobCode) delivered by
   * the reset email / deep link, setting the account's new password. This is an
   * unauthenticated flow — it does not require a signed-in user.
   */
  confirmPasswordReset(oobCode: string, newPassword: string): Promise<void>;

  /**
   * Return the current Firebase ID token for outbound authorization, or null
   * when unauthenticated. Pass forceRefresh=true to bypass the SDK token cache.
   * Callers MUST treat the token as a transient secret (no UI/state/log persistence).
   */
  getIdToken(forceRefresh?: boolean): Promise<string | null>;
}
