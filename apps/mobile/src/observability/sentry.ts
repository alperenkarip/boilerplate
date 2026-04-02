// J.2.4 — Sentry baseline init (react-native) — ADR-009
// @sentry/react-native install sonrasi aktiflesecek.

// import * as Sentry from '@sentry/react-native';

// Expo ortaminda EXPO_PUBLIC_ prefix'li env degiskenleri kullanilir
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const g = globalThis as any;
const SENTRY_DSN: string | undefined = g.process?.env?.EXPO_PUBLIC_SENTRY_DSN;

export function initSentry() {
  if (!SENTRY_DSN) return;

  // @sentry/react-native install sonrasi:
  // Sentry.init({
  //   dsn: SENTRY_DSN,
  //   beforeSend(event) {
  //     if (event.request?.headers) {
  //       delete event.request.headers['Authorization'];
  //     }
  //     return event;
  //   },
  // });
}
