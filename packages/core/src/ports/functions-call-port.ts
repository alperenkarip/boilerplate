// @MX:ANCHOR: [AUTO] FunctionsCallPort — cross-platform callable write contract (ADR-020); web & mobile adapters implement this
// @MX:REASON: Public API boundary for the canonical write path (callable Cloud Functions); every mutation in the app flows through call() and depends on this signature plus the CallableError mapping
//
// FunctionsCallPort — SDK-free callable Cloud Functions boundary (ADR-020 Sections 7.1 + 14).
//
// Canonical write path: all create/update/delete and business logic run as
// callable Cloud Functions (onCall). Clients NEVER write to Firestore directly.
// Adapters map this onto firebase/functions httpsCallable (web) and
// @react-native-firebase/functions (mobile).

/**
 * Callable error codes, aligned 1:1 with Firebase Functions HttpsError codes
 * but expressed SDK-agnostically so packages/core carries no SDK dependency.
 */
export type CallableErrorCode =
  | 'ok'
  | 'cancelled'
  | 'unknown'
  | 'invalid-argument'
  | 'deadline-exceeded'
  | 'not-found'
  | 'already-exists'
  | 'permission-denied'
  | 'resource-exhausted'
  | 'failed-precondition'
  | 'aborted'
  | 'out-of-range'
  | 'unimplemented'
  | 'internal'
  | 'unavailable'
  | 'data-loss'
  | 'unauthenticated';

/**
 * Normalized callable error. Adapters catch the SDK-specific callable error
 * (e.g. Firebase HttpsError) and re-throw this so callers handle one shape.
 */
export class CallableError extends Error {
  readonly code: CallableErrorCode;
  readonly details: unknown;

  constructor(code: CallableErrorCode, message: string, details?: unknown) {
    super(message);
    this.name = 'CallableError';
    this.code = code;
    this.details = details;
  }
}

export interface FunctionsCallPort {
  /**
   * Invoke a callable Cloud Function by name with a typed payload.
   * Resolves with the typed response, or rejects with a CallableError.
   */
  call<TReq, TRes>(name: string, payload: TReq): Promise<TRes>;
}
