// Session logout best-effort davranis testi (L.1.7 wrong-user leak onleme)
import { describe, it, expect, vi, afterEach } from 'vitest';
import { logout } from './session';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('session.logout', () => {
  it('fetch reject ettiginde hata firlatmaz (best-effort)', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValueOnce(new Error('network down'));

    // Server logout best-effort olmali: fetch reject etse de logout() reject etmemeli
    await expect(logout()).resolves.toBeUndefined();
  });

  it('fetch basariliyken de hata firlatmaz', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(new Response(null, { status: 200 }));

    await expect(logout()).resolves.toBeUndefined();
  });
});
