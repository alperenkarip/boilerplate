// Analytics abstraction — vendor-agnostic (Faz O)
// ADR-009: Sentry + vendor-agnostic analytics

/** Analytics event tipi */
interface AnalyticsEvent {
  name: string;
  properties?: Record<string, string | number | boolean>;
}

/** Vendor-agnostic analytics interface */
interface AnalyticsAdapter {
  track: (event: AnalyticsEvent) => void;
  identify: (userId: string, traits?: Record<string, string>) => void;
  reset: () => void;
}

// Varsayilan no-op adapter — gercek vendor Faz O'da baglanacak
const noopAdapter: AnalyticsAdapter = {
  track: () => {},
  identify: () => {},
  reset: () => {},
};

// Privacy-safe denylist — bu event property'leri gonderilmez
export const privacyDenylist = [
  'password',
  'token',
  'secret',
  'creditCard',
  'ssn',
  'email',
] as const;

type DenylistKey = (typeof privacyDenylist)[number];

/**
 * Event property'lerinden / trait'lerden hassas alanlari temizler.
 * Substring eslesmesi: key.toLowerCase().includes(denied.toLowerCase())
 * (mobile analytics.ts ile ayni mantik).
 */
function sanitizeProperties<T>(properties?: Record<string, T>): Record<string, T> | undefined {
  if (!properties) return undefined;

  const sanitized: Record<string, T> = {};

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

let currentAdapter: AnalyticsAdapter = noopAdapter;

// @MX:WARN: [AUTO] Mutates module-level mutable state (currentAdapter); a process-global singleton swap.
// @MX:REASON: Global adapter reassignment has no guard against late/repeat calls — if invoked after events fire, earlier events silently go to the no-op adapter; concurrent test isolation can also leak state across cases.
export function setAnalyticsAdapter(adapter: AnalyticsAdapter) {
  currentAdapter = adapter;
}

// @MX:ANCHOR: [AUTO] Vendor-agnostic analytics facade (ADR-009) — the only sanctioned observability entry point; all event tracking must route through here, never a vendor SDK directly.
// @MX:REASON: Public observability API boundary (fan_in=1: features/sample/hooks.ts, will grow). Indirection through currentAdapter keeps the codebase vendor-swappable; privacyDenylist is now enforced here via sanitizeProperties before forwarding to currentAdapter.
export const analytics = {
  track: (event: AnalyticsEvent) =>
    currentAdapter.track({
      name: event.name,
      properties: sanitizeProperties(event.properties),
    }),
  identify: (userId: string, traits?: Record<string, string>) =>
    currentAdapter.identify(userId, sanitizeProperties(traits)),
  reset: () => currentAdapter.reset(),
};
