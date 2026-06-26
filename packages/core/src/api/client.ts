// API client — fetch-first (ADR-005), 3rd party bagimlilik yok
//
// @deprecated-for-internal-data (ADR-020): This REST client is NOT the canonical
// path for internal app data. Canonical internal data flows through the core ports:
//   - reads  -> DataReadPort      (client SDK Firestore + onSnapshot)
//   - writes -> FunctionsCallPort (callable Cloud Functions)
// Keep this client ONLY for external / 3rd-party REST integrations (ADR-020 exception).
// Still exported for backward compatibility; do not use it for Firestore-backed data.
//
// @MX:ANCHOR: [AUTO] Central HTTP client factory — all API calls flow through createApiClient()
// @MX:REASON: Single entry point for data fetching; retry/timeout/auth logic affects every API consumer
// @MX:WARN: [AUTO] Complex async retry loop with exponential backoff — 210 lines, multiple error paths
// @MX:REASON: Retry logic interacts with AbortSignal, timeout, and 401 callback; changes need careful testing
// @MX:TODO: [AUTO] No test file — createApiClient(), retry logic, and error handling are untested

import type { ApiClient, ApiClientConfig, ApiResponse, RequestOptions } from './types';
import { ApiError } from './types';

/** Varsayilan zaman asimi suresi (ms) */
const DEFAULT_TIMEOUT = 30_000;

/** Retry yapilandirmasi */
const MAX_RETRIES = 3;
const INITIAL_BACKOFF_MS = 1_000;

/** Retry yapilabilecek HTTP metotlari (idempotent) */
const RETRYABLE_METHODS = new Set(['GET', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS']);

/** Retry yapilabilecek HTTP durum kodlari (5xx sunucu hatalari) */
function isRetryableStatus(status: number): boolean {
  return status >= 500;
}

/** Ag hatasi kontrolu (fetch basarisiz olursa) */
function isNetworkError(error: unknown): boolean {
  return error instanceof TypeError;
}

/**
 * API istemcisi olusturur.
 * fetch-first yaklasim: native fetch API kullanir, ek kutuphane gerekmez.
 */
export function createApiClient(config: ApiClientConfig): ApiClient {
  const {
    baseURL,
    timeout = DEFAULT_TIMEOUT,
    headers: defaultHeaders = {},
    onUnauthorized,
  } = config;

  /**
   * Temel istek fonksiyonu — retry mantigi dahil.
   * Non-idempotent metotlarda (POST) retry yapilmaz.
   */
  async function request<T>(
    method: string,
    url: string,
    body?: unknown,
    options?: RequestOptions,
  ): Promise<ApiResponse<T>> {
    const fullURL = `${baseURL}${url}`;
    const canRetry = RETRYABLE_METHODS.has(method);
    const maxAttempts = canRetry ? MAX_RETRIES : 1;

    let lastError: unknown;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      // Exponential backoff: ilk denemede bekleme yok
      if (attempt > 0) {
        const backoffMs = INITIAL_BACKOFF_MS * Math.pow(2, attempt - 1);
        await delay(backoffMs);
      }

      try {
        const result = await executeRequest<T>(
          method,
          fullURL,
          body,
          defaultHeaders,
          timeout,
          options,
        );

        // 401 durumunda callback'i cagir
        if (result.status === 401 && onUnauthorized) {
          onUnauthorized();
        }

        return result;
      } catch (error: unknown) {
        lastError = error;

        // Retry yapilabilir mi kontrol et
        const shouldRetry = canRetry && attempt < maxAttempts - 1 && isRetryableError(error);

        if (!shouldRetry) {
          throw error;
        }

        // Kullanici istegi iptal ettiyse retry yapma
        if (options?.signal?.aborted) {
          throw error;
        }
      }
    }

    // Buraya ulasilmamali, ama TypeScript icin gerekli
    throw lastError;
  }

  return {
    get<T>(url: string, options?: RequestOptions): Promise<ApiResponse<T>> {
      return request<T>('GET', url, undefined, options);
    },

    post<T>(url: string, body?: unknown, options?: RequestOptions): Promise<ApiResponse<T>> {
      return request<T>('POST', url, body, options);
    },

    put<T>(url: string, body?: unknown, options?: RequestOptions): Promise<ApiResponse<T>> {
      return request<T>('PUT', url, body, options);
    },

    patch<T>(url: string, body?: unknown, options?: RequestOptions): Promise<ApiResponse<T>> {
      return request<T>('PATCH', url, body, options);
    },

    delete<T>(url: string, options?: RequestOptions): Promise<ApiResponse<T>> {
      return request<T>('DELETE', url, undefined, options);
    },
  };
}

/**
 * Tek bir HTTP istegi calistirir.
 * Zaman asimi AbortSignal.timeout() ile yonetilir.
 */
async function executeRequest<T>(
  method: string,
  url: string,
  body: unknown,
  defaultHeaders: Record<string, string>,
  timeout: number,
  options?: RequestOptions,
): Promise<ApiResponse<T>> {
  // Zaman asimi ve kullanici sinyalini birlestir
  const timeoutSignal = AbortSignal.timeout(timeout);
  const signals: AbortSignal[] = [timeoutSignal];

  if (options?.signal) {
    signals.push(options.signal);
  }

  const combinedSignal = AbortSignal.any(signals);

  const requestHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...defaultHeaders,
    ...options?.headers,
  };

  const fetchOptions: RequestInit = {
    method,
    headers: requestHeaders,
    signal: combinedSignal,
  };

  if (body !== undefined) {
    fetchOptions.body = JSON.stringify(body);
  }

  let response: Response;

  try {
    response = await fetch(url, fetchOptions);
  } catch (error: unknown) {
    // Zaman asimi hatasini ozel olarak ele al
    if (error instanceof DOMException && error.name === 'TimeoutError') {
      throw new ApiError(0, `Istek zaman asimina ugradi: ${timeout}ms`);
    }

    // Iptal hatasini ozel olarak ele al
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new ApiError(0, 'Istek iptal edildi');
    }

    // Ag hatasi
    throw error;
  }

  // Yanit govdesini parse et
  let data: T;

  try {
    data = (await response.json()) as T;
  } catch {
    // JSON parse edilemezse bos obje dondur
    data = {} as T;
  }

  // Basarisiz HTTP durum kodlari icin hata firlat
  if (!response.ok) {
    throw new ApiError(response.status, `HTTP ${response.status}: ${response.statusText}`, data);
  }

  return { data, status: response.status };
}

/** Retry yapilabilecek hata mi kontrol eder */
function isRetryableError(error: unknown): boolean {
  // Ag hatalari (TypeError — fetch basarisiz)
  if (isNetworkError(error)) return true;

  // 5xx sunucu hatalari
  if (error instanceof ApiError && isRetryableStatus(error.status)) return true;

  return false;
}

/** Belirtilen sure kadar bekler */
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
