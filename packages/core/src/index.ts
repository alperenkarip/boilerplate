// @project/core — DOM-free main surface (platform-agnostic).
// This barrel is mobile-safe: it pulls NO DOM-bound code (no fetch/DOMException/
// AbortSignal.timeout) into a consumer's TypeScript program. React Native apps
// (lib: ES2022, no DOM) can import it directly.
// The DOM-bound HTTP client lives behind the "./http" subpath (api/client.ts),
// which only web / external-REST consumers import (ADR-020).
// This package contains no UI, routing, storage, or auth-provider SDK access.

export type { AuthStatus, AuthSummary, LogoutCleanupContract } from './auth/types';
export { useDebounce, useThrottle, usePrevious, useAsync } from './hooks';
export {
  isEmail,
  isPhoneNumber,
  isStrongPassword,
  isURL,
  isEmpty,
  minLength,
  maxLength,
} from './validation';

// Firebase port/adapter contracts — SDK-free (ADR-020, ADR-021).
// Apps (web/mobile) implement these with their respective Firebase SDKs.
export { CallableError } from './ports';
export type {
  AuthPort,
  DataReadPort,
  DataQuery,
  WhereFilter,
  WhereOperator,
  OrderBy,
  OrderDirection,
  FunctionsCallPort,
  CallableErrorCode,
  Unsubscribe,
} from './ports';
