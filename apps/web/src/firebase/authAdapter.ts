// AuthPort adapter — firebase/auth implementation (ADR-021 Section 11).
//
// Maps the Firebase Auth SDK onto the SDK-free AuthPort contract. The port only
// ever exposes sanitized AuthSummary objects; the raw firebase User never
// crosses this boundary. getIdToken() is the single exception that returns the
// raw token, strictly for outbound request authorization.
//
// confirmPasswordReset is now part of AuthPort (authAdapter.confirmPasswordReset).
// The trailing confirmPasswordResetWithCode helper is kept as a thin
// compatibility wrapper that delegates to the port method, so existing reset
// pages keep working. applyEmailActionCode stays adapter-only (email-verification
// action code), keeping all firebase/auth imports inside this adapter module.

import {
  onAuthStateChanged as fbOnAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as fbSignOut,
  sendPasswordResetEmail,
  sendEmailVerification as fbSendEmailVerification,
  updatePassword as fbUpdatePassword,
  updateProfile as fbUpdateProfile,
  deleteUser,
  confirmPasswordReset,
  applyActionCode,
  type User,
} from 'firebase/auth';
import type { AuthPort, AuthSummary, Unsubscribe } from '@project/core';
import { auth } from './config';

/** Map a firebase User (or null) onto the sanitized AuthSummary boundary type. */
function toSummary(user: User | null): AuthSummary {
  if (!user) {
    return { status: 'unauthenticated', userId: null, displayName: null };
  }
  return {
    status: 'authenticated',
    userId: user.uid,
    displayName: user.displayName ?? user.email ?? null,
  };
}

export const authAdapter: AuthPort = {
  getCurrentUser(): AuthSummary | null {
    const user = auth.currentUser;
    return user ? toSummary(user) : null;
  },

  onAuthStateChanged(callback: (summary: AuthSummary) => void): Unsubscribe {
    return fbOnAuthStateChanged(auth, (user) => callback(toSummary(user)));
  },

  async signIn(email: string, password: string): Promise<AuthSummary> {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    return toSummary(credential.user);
  },

  async signUp(email: string, password: string): Promise<AuthSummary> {
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    return toSummary(credential.user);
  },

  async signOut(): Promise<void> {
    await fbSignOut(auth);
  },

  async sendPasswordReset(email: string): Promise<void> {
    await sendPasswordResetEmail(auth, email);
  },

  async sendEmailVerification(): Promise<void> {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('Cannot send email verification without a signed-in user');
    }
    await fbSendEmailVerification(user);
  },

  async updatePassword(newPassword: string): Promise<void> {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('Cannot update password without a signed-in user');
    }
    await fbUpdatePassword(user, newPassword);
  },

  async updateProfile(input: {
    displayName?: string | null;
    photoURL?: string | null;
  }): Promise<void> {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('Cannot update profile without a signed-in user');
    }
    await fbUpdateProfile(user, input);
  },

  async deleteAccount(): Promise<void> {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('Cannot delete account without a signed-in user');
    }
    await deleteUser(user);
  },

  async confirmPasswordReset(oobCode: string, newPassword: string): Promise<void> {
    // Unauthenticated action-code flow; no currentUser required.
    await confirmPasswordReset(auth, oobCode, newPassword);
  },

  async getIdToken(forceRefresh?: boolean): Promise<string | null> {
    const user = auth.currentUser;
    if (!user) return null;
    return user.getIdToken(forceRefresh);
  },
};

/**
 * Complete a password reset using the oobCode from the reset email link.
 * Thin compatibility wrapper that delegates to the AuthPort method; kept so the
 * reset page import stays stable.
 */
export async function confirmPasswordResetWithCode(
  oobCode: string,
  newPassword: string,
): Promise<void> {
  await authAdapter.confirmPasswordReset(oobCode, newPassword);
}

/** Apply an email-verification action code from the verification link. */
export async function applyEmailActionCode(oobCode: string): Promise<void> {
  await applyActionCode(auth, oobCode);
}
