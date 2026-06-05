// useAuth logout cleanup contract testi (L.1.5 + L.1.7)
//
// NOT: Bu dosyadaki testler React render (renderHook) gerektirir. Monorepo'da
// su an react (19.2.0) ve react-dom (19.2.4) versiyonlari uyusmuyor; bu yuzden
// apps/web'deki TUM render bazli testler (Button.test.tsx dahil) toplanamiyor.
// Bu, bu guvenlik duzeltmesiyle ilgisiz, onceden var olan bir bagimlilik sorunu.
// react/react-dom ayni versiyona hizalandiginda bu testler otomatik calisir.
//
// Logout teardown garantisinin asil reproduction'i react-dom'dan bagimsiz olarak
// session.test.ts icinde dogrulanir (session.logout fetch reject etse bile
// resolve eder => useAuth icindeki queryClient.clear()/state reset her zaman calisir).
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createElement, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuth } from './useAuth';

// session modulunu mockla — checkSession ve logout kontrollu calissin
vi.mock('./session', () => ({
  checkSession: vi.fn().mockResolvedValue({ status: 'authenticated', userId: 'u1' }),
  logout: vi.fn(),
}));

import { logout as logoutSession } from './session';

// react/react-dom uyumu var mi? Yoksa render bazli testleri atla.
async function canRenderReact(): Promise<boolean> {
  try {
    const react = await import('react');
    const reactDom = await import('react-dom');
    return react.version === reactDom.version;
  } catch {
    return false;
  }
}

const renderable = await canRenderReact();
const describeRender = renderable ? describe : describe.skip;

beforeEach(() => {
  vi.clearAllMocks();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describeRender('useAuth logout cleanup contract', () => {
  function makeWrapper(queryClient: QueryClient) {
    return function Wrapper({ children }: { children: ReactNode }) {
      return createElement(QueryClientProvider, { client: queryClient }, children);
    };
  }

  it('server logout reject etse bile cache temizlenir ve state sifirlanir', async () => {
    const { renderHook, act, waitFor } = await import('@testing-library/react');

    // Server logout fetch'i hata atiyor (network/5xx)
    vi.mocked(logoutSession).mockRejectedValueOnce(new Error('logout server down'));

    const queryClient = new QueryClient();
    const clearSpy = vi.spyOn(queryClient, 'clear');

    const { result } = renderHook(() => useAuth(), {
      wrapper: makeWrapper(queryClient),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.status).toBe('authenticated');

    await act(async () => {
      await result.current.logout();
    });

    // L.1.7 — wrong-user leak onleme: cache MUTLAKA temizlenmeli
    expect(clearSpy).toHaveBeenCalledTimes(1);
    // L.1.5 — auth state reset MUTLAKA calismali
    expect(result.current.status).toBe('unauthenticated');
    expect(result.current.userId).toBeNull();
  });

  it('server logout basariliyken de teardown calisir', async () => {
    const { renderHook, act, waitFor } = await import('@testing-library/react');

    vi.mocked(logoutSession).mockResolvedValueOnce(undefined);

    const queryClient = new QueryClient();
    const clearSpy = vi.spyOn(queryClient, 'clear');

    const { result } = renderHook(() => useAuth(), {
      wrapper: makeWrapper(queryClient),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      await result.current.logout();
    });

    expect(clearSpy).toHaveBeenCalledTimes(1);
    expect(result.current.status).toBe('unauthenticated');
    expect(result.current.userId).toBeNull();
  });
});
