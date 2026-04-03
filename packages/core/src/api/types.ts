// API client tip tanimlari

/** API istemci yapilandirmasi */
export interface ApiClientConfig {
  /** Tum isteklerin onune eklenen temel URL */
  baseURL: string;
  /** Istek zaman asimi (ms) — varsayilan: 30000 */
  timeout?: number;
  /** Her istekte gonderilecek varsayilan basliklar */
  headers?: Record<string, string>;
  /** 401 yaniti alindiginda cagrilacak callback */
  onUnauthorized?: () => void;
}

/** API istemci arayuzu */
export interface ApiClient {
  get<T>(url: string, options?: RequestOptions): Promise<ApiResponse<T>>;
  post<T>(url: string, body?: unknown, options?: RequestOptions): Promise<ApiResponse<T>>;
  put<T>(url: string, body?: unknown, options?: RequestOptions): Promise<ApiResponse<T>>;
  patch<T>(url: string, body?: unknown, options?: RequestOptions): Promise<ApiResponse<T>>;
  delete<T>(url: string, options?: RequestOptions): Promise<ApiResponse<T>>;
}

/** Istek secenekleri */
export interface RequestOptions {
  /** Istege ozel ek basliklar */
  headers?: Record<string, string>;
  /** Istegi iptal etmek icin AbortSignal */
  signal?: AbortSignal;
}

/** Basarili API yaniti */
export interface ApiResponse<T> {
  data: T;
  status: number;
}

/**
 * API hata sinifi.
 * HTTP hatalari ve ag hatalarini temsil eder.
 */
export class ApiError extends Error {
  readonly status: number;
  readonly data: unknown;

  constructor(status: number, message: string, data?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}
