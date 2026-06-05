// Analytics privacy denylist enforcement testi (ADR-009)
import { describe, it, expect, vi, afterEach } from 'vitest';
import { analytics, setAnalyticsAdapter } from './analytics';

afterEach(() => {
  // Adapter'i no-op'a geri dondur (test izolasyonu) — yeni no-op mock yeterli
  setAnalyticsAdapter({
    track: () => {},
    identify: () => {},
    reset: () => {},
  });
});

describe('analytics privacy denylist', () => {
  it('track: denied property (password) strip edilir, masum property (userName) korunur', () => {
    const track = vi.fn();
    setAnalyticsAdapter({ track, identify: () => {}, reset: () => {} });

    analytics.track({ name: 'x', properties: { password: 'p', userName: 'safe' } });

    expect(track).toHaveBeenCalledTimes(1);
    const sentEvent = track.mock.calls[0]![0];
    // 'password' denied -> gonderilmemeli
    expect(sentEvent.properties).not.toHaveProperty('password');
    // 'userName' 'name' icerir ama denied bir anahtar DEGIL -> korunmali
    expect(sentEvent.properties).toHaveProperty('userName', 'safe');
  });

  it('identify: denied trait (email) strip edilir, masum trait (plan) korunur', () => {
    const identify = vi.fn();
    setAnalyticsAdapter({ track: () => {}, identify, reset: () => {} });

    analytics.identify('user-1', { email: 'a@b.com', plan: 'pro' });

    expect(identify).toHaveBeenCalledTimes(1);
    const [userId, sentTraits] = identify.mock.calls[0]!;
    expect(userId).toBe('user-1');
    // 'email' denied -> gonderilmemeli
    expect(sentTraits).not.toHaveProperty('email');
    // 'plan' masum -> korunmali
    expect(sentTraits).toHaveProperty('plan', 'pro');
  });

  it('track: tum denied anahtarlar (token, secret, creditCard, ssn) substring eslesmesiyle strip edilir', () => {
    const track = vi.fn();
    setAnalyticsAdapter({ track, identify: () => {}, reset: () => {} });

    analytics.track({
      name: 'y',
      properties: {
        authToken: 'tok', // 'token' substring
        apiSecret: 's', // 'secret' substring
        creditCard: '4111', // tam eslesme
        ssn: '123', // tam eslesme
        itemCount: 3, // masum
      },
    });

    const props = track.mock.calls[0]![0].properties;
    expect(props).not.toHaveProperty('authToken');
    expect(props).not.toHaveProperty('apiSecret');
    expect(props).not.toHaveProperty('creditCard');
    expect(props).not.toHaveProperty('ssn');
    expect(props).toHaveProperty('itemCount', 3);
  });
});
