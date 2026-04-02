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

let currentAdapter: AnalyticsAdapter = noopAdapter;

export function setAnalyticsAdapter(adapter: AnalyticsAdapter) {
  currentAdapter = adapter;
}

export const analytics = {
  track: (event: AnalyticsEvent) => currentAdapter.track(event),
  identify: (userId: string, traits?: Record<string, string>) =>
    currentAdapter.identify(userId, traits),
  reset: () => currentAdapter.reset(),
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
