// @project/core/http — DOM-bound HTTP surface (web / external-REST only).
//
// Separated from the main "." barrel so that DOM-free consumers (apps/mobile,
// lib: ES2022 without DOM) never pull fetch / DOMException / AbortSignal.timeout
// / AbortSignal.any into their TypeScript program (ADR-020).
//
// createApiClient is NOT the canonical internal data path. Internal app data
// flows through the core ports (DataReadPort reads, FunctionsCallPort writes).
// Use this HTTP client ONLY for external / 3rd-party REST integrations.
export { createApiClient, ApiError } from './api';
export type { ApiClient, ApiClientConfig, ApiResponse, RequestOptions } from './api';
