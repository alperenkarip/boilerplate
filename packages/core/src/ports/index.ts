// Port/adapter contracts — SDK-free (ADR-020 Section 14, ADR-021 Section 11).
// packages/core defines these interfaces; app-level adapters implement them.

export type { Unsubscribe } from './types';
export type { AuthPort } from './auth-port';
export type {
  DataReadPort,
  DataQuery,
  WhereFilter,
  WhereOperator,
  OrderBy,
  OrderDirection,
} from './data-read-port';
export type { FunctionsCallPort, CallableErrorCode } from './functions-call-port';
export { CallableError } from './functions-call-port';
