// Session tests — Firebase Auth backed checkSession + best-effort logout.
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { AuthSummary } from '@project/core';

// Mock the firebase auth adapter so no real SDK is initialized.
vi.mock('../firebase/authAdapter', () => ({
  authAdapter: {
    onAuthStateChanged: vi.fn(),
    signOut: vi.fn(),
  },
}));

import { checkSession, logout } from './session';
import { authAdapter } from '../firebase/authAdapter';

beforeEach(() => {
  vi.clearAllMocks();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('session.checkSession', () => {
  it('resolves with the first auth-state summary and unsubscribes', async () => {
    const unsubscribe = vi.fn();
    const summary: AuthSummary = { status: 'authenticated', userId: 'u1', displayName: 'User' };
    vi.mocked(authAdapter.onAuthStateChanged).mockImplementation((cb) => {
      // Fire asynchronously, mirroring Firebase's initial-state behavior.
      queueMicrotask(() => cb(summary));
      return unsubscribe;
    });

    const result = await checkSession();

    expect(result).toEqual(summary);
    // The one-shot bootstrap must detach its listener after the first signal.
    expect(unsubscribe).toHaveBeenCalledTimes(1);
  });

  it('resolves with an unauthenticated summary when no user is restored', async () => {
    const summary: AuthSummary = { status: 'unauthenticated', userId: null, displayName: null };
    vi.mocked(authAdapter.onAuthStateChanged).mockImplementation((cb) => {
      queueMicrotask(() => cb(summary));
      return vi.fn();
    });

    const result = await checkSession();

    expect(result.status).toBe('unauthenticated');
    expect(result.userId).toBeNull();
  });
});

describe('session.logout', () => {
  it('resolves even when signOut rejects (best-effort) and logs', async () => {
    vi.mocked(authAdapter.signOut).mockRejectedValueOnce(new Error('sign-out down'));
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    await expect(logout()).resolves.toBeUndefined();
    expect(warnSpy).toHaveBeenCalled();
  });

  it('resolves when signOut succeeds', async () => {
    vi.mocked(authAdapter.signOut).mockResolvedValueOnce(undefined);

    await expect(logout()).resolves.toBeUndefined();
  });
});
