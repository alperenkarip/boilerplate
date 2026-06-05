// Mobile analytics abstraction — vendor-agnostic (ADR-009)
// Web'deki analytics.ts pattern'i ile ayni interface

/** Analytics event tipi */
interface AnalyticsEvent {
  name: string;
  properties?: Record<string, string | number | boolean>;
}

/** Vendor-agnostic analytics adapter interface */
interface AnalyticsAdapter {
  track: (event: AnalyticsEvent) => void;
  trackScreen: (screenName: string, properties?: Record<string, string>) => void;
  identify: (userId: string, traits?: Record<string, string>) => void;
  reset: () => void;
}

// Gizlilik icin filtrelenmesi gereken property anahtarlari
export const privacyDenylist = ['password', 'token', 'creditCard', 'ssn', 'email'] as const;

type DenylistKey = (typeof privacyDenylist)[number];

/** Event property'lerinden hassas alanlari temizler */
function sanitizeProperties(
  properties?: Record<string, string | number | boolean>,
): Record<string, string | number | boolean> | undefined {
  if (!properties) return undefined;

  const sanitized: Record<string, string | number | boolean> = {};

  for (const [key, value] of Object.entries(properties)) {
    const isDenied = privacyDenylist.some((denied: DenylistKey) =>
      key.toLowerCase().includes(denied.toLowerCase()),
    );
    if (!isDenied) {
      sanitized[key] = value;
    }
  }

  return sanitized;
}

// Varsayilan no-op adapter — gercek vendor daha sonra baglanacak
const noopAdapter: AnalyticsAdapter = {
  track: () => {},
  trackScreen: () => {},
  identify: () => {},
  reset: () => {},
};

let currentAdapter: AnalyticsAdapter = noopAdapter;

// @MX:WARN: [AUTO] mutates module-level mutable singleton `currentAdapter` (global state mutation)
// @MX:REASON: Shared process-wide singleton; a late or duplicate call silently reroutes all analytics traffic with no per-caller isolation
/** Vendor-specific analytics adapter'i ayarlar */
export function setAnalyticsAdapter(adapter: AnalyticsAdapter): void {
  currentAdapter = adapter;
}

/** Bir analytics eventi gonderir (privacy denylist uygulanir) */
export function trackEvent(event: AnalyticsEvent): void {
  currentAdapter.track({
    name: event.name,
    properties: sanitizeProperties(event.properties),
  });
}

/** Ekran goruntulenme eventi gonderir */
export function trackScreen(screenName: string, properties?: Record<string, string>): void {
  currentAdapter.trackScreen(screenName, properties);
}

/** Kullanici kimligini ayarlar */
export function setUserId(userId: string, traits?: Record<string, string>): void {
  currentAdapter.identify(userId, traits);
}

/** Analytics oturumunu sifirlar (logout vb.) */
export function reset(): void {
  currentAdapter.reset();
}

export const analytics = {
  trackEvent,
  trackScreen,
  setUserId,
  reset,
};
