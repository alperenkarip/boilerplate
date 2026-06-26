// useAuth tests — Firebase Auth state + logout cleanup contract (L.1.5 + L.1.7).
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createElement, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, act, waitFor } from '@testing-library/react';
import type { AuthSummary } from '@project/core';

const AUTHENTICATED: AuthSummary = { status: 'authenticated', userId: 'u1', displayName: 'User' };

// Mock the firebase auth adapter and the session module.
vi.mock('../firebase/authAdapter', () => ({
  authAdapter: {
    onAuthStateChanged: vi.fn(),
    signIn: vi.fn(),
    signUp: vi.fn(),
  },
}));
vi.mock('./session', () => ({ logout: vi.fn() }));

import { useAuth } from './useAuth';
import { authAdapter } from '../firebase/authAdapter';
import { logout as logoutSession } from './session';

function makeWrapper(queryClient: QueryClient) {
  return function Wrapper({ children }: { children: ReactNode }) {
    return createElement(QueryClientProvider, { client: queryClient }, children);
  };
}

beforeEach(() => {
  vi.clearAllMocks();
  // Default: emit an authenticated state immediately on subscribe.
  vi.mocked(authAdapter.onAuthStateChanged).mockImplementation((cb) => {
    cb(AUTHENTICATED);
    return vi.fn();
  });
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('useAuth', () => {
  it('reflects authenticated state from onAuthStateChanged', async () => {
    const queryClient = new QueryClient();
    const { result } = renderHook(() => useAuth(), { wrapper: makeWrapper(queryClient) });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.status).toBe('authenticated');
    expect(result.current.userId).toBe('u1');
  });

  it('login delegates to authAdapter.signIn', async () => {
    vi.mocked(authAdapter.signIn).mockResolvedValueOnce(AUTHENTICATED);
    const queryClient = new QueryClient();
    const { result } = renderHook(() => useAuth(), { wrapper: makeWrapper(queryClient) });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    await act(async () => {
      await result.current.login('a@b.com', 'pw');
    });

    expect(authAdapter.signIn).toHaveBeenCalledWith('a@b.com', 'pw');
  });

  it('register delegates to authAdapter.signUp', async () => {
    vi.mocked(authAdapter.signUp).mockResolvedValueOnce(AUTHENTICATED);
    const queryClient = new QueryClient();
    const { result } = renderHook(() => useAuth(), { wrapper: makeWrapper(queryClient) });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    await act(async () => {
      await result.current.register('a@b.com', 'pw123456');
    });

    expect(authAdapter.signUp).toHaveBeenCalledWith('a@b.com', 'pw123456');
  });

  it('logout clears the query cache and resets state even if sign-out rejects', async () => {
    // L.1.7 — wrong-user leak prevention must hold even on a failed sign-out.
    vi.mocked(logoutSession).mockRejectedValueOnce(new Error('logout down'));
    const queryClient = new QueryClient();
    const clearSpy = vi.spyOn(queryClient, 'clear');
    const { result } = renderHook(() => useAuth(), { wrapper: makeWrapper(queryClient) });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    await act(async () => {
      await result.current.logout();
    });

    expect(clearSpy).toHaveBeenCalledTimes(1);
    expect(result.current.status).toBe('unauthenticated');
    expect(result.current.userId).toBeNull();
  });

  it('logout teardown also runs when sign-out succeeds', async () => {
    vi.mocked(logoutSession).mockResolvedValueOnce(undefined);
    const queryClient = new QueryClient();
    const clearSpy = vi.spyOn(queryClient, 'clear');
    const { result } = renderHook(() => useAuth(), { wrapper: makeWrapper(queryClient) });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    await act(async () => {
      await result.current.logout();
    });

    expect(clearSpy).toHaveBeenCalledTimes(1);
    expect(result.current.status).toBe('unauthenticated');
  });
});
