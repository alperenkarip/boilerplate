// J.2.4 — Sentry baseline init (react-native) — ADR-009
// @MX:ANCHOR: Observability entrypoint — tum error tracking bu modul uzerinden yapilir
// @MX:REASON: ADR-009 zorunlu; vendor-agnostic abstraction icin tek giris noktasi
//
// NOT: @sentry/react-native henuz package.json'da dependency olarak eklenmedi.
// Paket yuklendiginde asagidaki conditional import otomatik olarak aktif olacak.
// Paket yuklu degilse tum fonksiyonlar guvenli bir sekilde no-op olarak calisir.
//
// Paket eklendikten sonra:
// 1. `pnpm --filter @project/mobile add @sentry/react-native`
// 2. Bu dosyadaki `SentrySDK` interface'ini kaldir, gercek Sentry tiplerini import et
// 3. `loadSentry()` fonksiyonundaki try-catch'i kaldir, dogrudan import kullan

// ─── Sentry SDK Abstraction ───────────────────────────────
// Paket yuklu olmadiginda tip guvenligini saglamak icin minimal interface
// Paket eklendiginde bu kisim gercek @sentry/react-native tipleriyle degistirilmeli

/** Sentry event minimum yapisi (PII temizleme icin) */
interface SentryEvent {
  request?: {
    headers?: Record<string, string>;
    data?: string;
  };
  breadcrumbs?: Array<SentryBreadcrumb>;
}

/** Sentry breadcrumb minimum yapisi */
interface SentryBreadcrumb {
  category?: string;
  data?: Record<string, unknown>;
}

/** Sentry init secenekleri */
interface SentryInitOptions {
  dsn: string;
  environment: string;
  debug: boolean;
  tracesSampleRate: number;
  beforeSend: (event: SentryEvent) => SentryEvent | null;
  beforeBreadcrumb: (breadcrumb: SentryBreadcrumb) => SentryBreadcrumb | null;
}

/** Sentry SDK modulu — sadece kullandigimiz fonksiyonlarin interface'i */
interface SentrySDK {
  init: (options: SentryInitOptions) => void;
  captureException: (error: Error, options?: { extra?: Record<string, unknown> }) => void;
  captureMessage: (message: string, level?: string) => void;
  setUser: (user: { id: string; segment?: string } | null) => void;
}

// ─── Konfigürasyon ────────────────────────────────────────

/** Ortam tespiti — __DEV__ React Native global degiskeni */
const IS_DEV: boolean = typeof __DEV__ !== 'undefined' ? __DEV__ : true;

/** Performance sampling oranlari (D-OBS)
 * Prod: %10 — maliyet kontrolu
 * Dev: %100 — tam gozlemlenebilirlik
 */
const TRACES_SAMPLE_RATE: number = IS_DEV ? 1.0 : 0.1;

// ─── PII Temizleme ────────────────────────────────────────

/** Hassas header'lari temizle (D-SEC #16, D-OBS #9)
 * Authorization, Cookie gibi hassas bilgiler Sentry'ye sizmamali
 */
const SENSITIVE_HEADERS: readonly string[] = [
  'authorization',
  'cookie',
  'set-cookie',
  'x-api-key',
  'x-auth-token',
];

/** Hassas veri alanlari — request body'den temizlenecek */
const SENSITIVE_FIELDS: readonly string[] = [
  'password',
  'token',
  'secret',
  'credential',
  'creditCard',
];

/** Sentry event'inden hassas verileri temizle
 * @MX:WARN: Bu fonksiyon bypass edilmemeli — PII sizintisi olusur
 * @MX:REASON: D-SEC #16 — Sentry payload'larinda hassas veri YASAK
 */
function sanitizeEvent(event: SentryEvent): SentryEvent | null {
  // Request header'larindan hassas bilgileri temizle
  if (event.request?.headers) {
    const sanitizedHeaders: Record<string, string> = {};
    for (const [key, value] of Object.entries(event.request.headers)) {
      if (SENSITIVE_HEADERS.includes(key.toLowerCase())) {
        sanitizedHeaders[key] = '[FILTERED]';
      } else {
        sanitizedHeaders[key] = value;
      }
    }
    event.request.headers = sanitizedHeaders;
  }

  // Request data'dan hassas alanlari temizle
  if (event.request?.data && typeof event.request.data === 'string') {
    try {
      const parsed: unknown = JSON.parse(event.request.data);
      if (parsed && typeof parsed === 'object' && parsed !== null) {
        const obj = parsed as Record<string, unknown>;
        for (const field of SENSITIVE_FIELDS) {
          if (field in obj) {
            obj[field] = '[FILTERED]';
          }
        }
        event.request.data = JSON.stringify(obj);
      }
    } catch {
      // JSON parse edilemezse oldugu gibi birak
    }
  }

  // Breadcrumb'lardaki hassas verileri temizle
  if (event.breadcrumbs) {
    for (const breadcrumb of event.breadcrumbs) {
      if (breadcrumb.data) {
        // URL'deki token parametrelerini temizle
        if (typeof breadcrumb.data['url'] === 'string') {
          breadcrumb.data['url'] = breadcrumb.data['url'].replace(
            /([?&])(token|key|secret|auth)=[^&]*/gi,
            '$1$2=[FILTERED]',
          );
        }
      }
    }
  }

  return event;
}

/** Breadcrumb'dan hassas verileri temizle */
function sanitizeBreadcrumb(breadcrumb: SentryBreadcrumb): SentryBreadcrumb | null {
  // Console log breadcrumb'larini prod'da filtrele
  if (!IS_DEV && breadcrumb.category === 'console') {
    return null;
  }

  if (breadcrumb.data) {
    const data = { ...breadcrumb.data };
    // URL'deki token parametrelerini temizle
    if (typeof data['url'] === 'string') {
      data['url'] = data['url'].replace(/([?&])(token|key|secret|auth)=[^&]*/gi, '$1$2=[FILTERED]');
    }
    return { ...breadcrumb, data };
  }

  return breadcrumb;
}

// ─── Sentry SDK yukleme ───────────────────────────────────

/** Cache'lenmis Sentry modulu — tekrar tekrar yuklemek icin */
let cachedSentry: SentrySDK | null = null;
let loadAttempted = false;

/** Sentry SDK'yi yukle
 * Paket yuklu degilse null doner
 * Bir kez denenir, sonuc cache'lenir
 */
function loadSentry(): SentrySDK | null {
  if (cachedSentry) return cachedSentry;
  if (loadAttempted) return null;

  loadAttempted = true;
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    cachedSentry = require('@sentry/react-native') as SentrySDK;
    return cachedSentry;
  } catch {
    // @sentry/react-native yuklu degil
    return null;
  }
}

// ─── DSN ──────────────────────────────────────────────────

/** Expo ortaminda EXPO_PUBLIC_ prefix'li env degiskenleri
 * Expo bundler tarafindan derleme zamaninda inline edilir
 * React Native'de process.env erisilebilir degil, Expo Constants kullanilir
 */
function getSentryDSN(): string | undefined {
  try {
    // Expo Constants uzerinden env degiskeni
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const Constants = require('expo-constants') as {
      default: { expoConfig?: { extra?: Record<string, unknown> } };
    };
    const dsn = Constants.default.expoConfig?.extra?.['EXPO_PUBLIC_SENTRY_DSN'];
    return typeof dsn === 'string' ? dsn : undefined;
  } catch {
    // expo-constants yuklu degil veya hata — fallback yok
    return undefined;
  }
}

// ─── Public API ────────────────────────────────────────────

/** Sentry'yi baslat
 * Uygulama acilisinda (App.tsx veya entry point) bir kez cagirilmali.
 * DSN tanimli degilse veya paket yuklu degilse guvenli no-op.
 */
export function initSentry(): void {
  const dsn = getSentryDSN();

  if (!dsn) {
    if (IS_DEV) {
      // eslint-disable-next-line no-console
      console.info('[Sentry] DSN tanimli degil — error tracking devre disi');
    }
    return;
  }

  const Sentry = loadSentry();
  if (!Sentry) {
    if (IS_DEV) {
      // eslint-disable-next-line no-console
      console.warn('[Sentry] @sentry/react-native yuklu degil — error tracking devre disi');
    }
    return;
  }

  Sentry.init({
    dsn,
    environment: IS_DEV ? 'development' : 'production',
    debug: IS_DEV,
    tracesSampleRate: TRACES_SAMPLE_RATE,
    beforeSend(event: SentryEvent) {
      return sanitizeEvent(event);
    },
    beforeBreadcrumb(breadcrumb: SentryBreadcrumb) {
      return sanitizeBreadcrumb(breadcrumb);
    },
  });
}

/** Manuel hata yakalama (unexpected error'lar icin)
 * D-OBS #10: Sadece unexpected hatalari gonder — expected hatalari gonderme
 */
export function captureError(
  error: Error,
  context?: Record<string, string | number | boolean>,
): void {
  const Sentry = loadSentry();
  if (Sentry) {
    Sentry.captureException(error, { extra: context });
  } else if (IS_DEV) {
    // eslint-disable-next-line no-console
    console.error('[Sentry fallback]', error, context);
  }
}

/** Manuel mesaj yakalama (ozel event tracking icin) */
export function captureMessage(
  message: string,
  level: 'info' | 'warning' | 'error' = 'info',
): void {
  const Sentry = loadSentry();
  if (Sentry) {
    Sentry.captureMessage(message, level);
  } else if (IS_DEV) {
    // eslint-disable-next-line no-console
    console.info(`[Sentry fallback] [${level}]`, message);
  }
}

/** Kullanici baglamini ayarla (PII icermeyen bilgiler)
 * @MX:WARN: userId hash'lenmis olmali, email/telefon YASAK
 * @MX:REASON: D-SEC #16 — Sentry'de PII bulunmamali
 */
export function setUserContext(user: { id: string; segment?: string }): void {
  const Sentry = loadSentry();
  if (Sentry) {
    Sentry.setUser({
      id: user.id,
      segment: user.segment,
      // email, username, ip_address gibi PII alanlari BILEREK eklenmedi
    });
  }
}

/** Kullanici baglamini temizle (logout)
 * LogoutCleanupContract ile uyumlu
 */
export function clearUserContext(): void {
  const Sentry = loadSentry();
  if (Sentry) {
    Sentry.setUser(null);
  }
}
