// Session logout best-effort davranis testi (L.1.7 wrong-user leak onleme)
import { describe, it, expect, vi, afterEach } from 'vitest';
import { checkSession, logout } from './session';

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

describe('session.checkSession', () => {
  it('network hatasinda kurtarilabilir statu dondurur (unauthenticated DEGIL) ve loglar', async () => {
    // Offline/network failure: kullaniciyi login ekranina zorlamamali.
    vi.spyOn(globalThis, 'fetch').mockRejectedValueOnce(new Error('network down'));
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const result = await checkSession();

    // Kurtarilabilir statu olmali — 'unauthenticated' hard-redirect tetikler, bu yanlis.
    expect(result.status).not.toBe('unauthenticated');
    expect(result.status).toBe('expired');
    expect(result.userId).toBeNull();
    // Hata sessizce yutulmamali — debug edilebilirlik icin loglanmali.
    expect(warnSpy).toHaveBeenCalled();
  });

  it('401 hala unauthenticated dondurur', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(new Response(null, { status: 401 }));

    const result = await checkSession();

    expect(result.status).toBe('unauthenticated');
    expect(result.userId).toBeNull();
  });
});
