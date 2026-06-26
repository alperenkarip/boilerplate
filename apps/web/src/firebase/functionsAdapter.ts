// FunctionsCallPort adapter — firebase/functions implementation (ADR-020 Section 7.1 + 14).
//
// Canonical write path: every create/update/delete and all business logic run
// as callable Cloud Functions. The Firebase HttpsError (code prefixed with
// "functions/") is normalized into the SDK-free CallableError so callers handle
// a single, stable error shape.

import { httpsCallable } from 'firebase/functions';
import { CallableError, type CallableErrorCode, type FunctionsCallPort } from '@project/core';
import { functions } from './config';

// Runtime-checkable list of the SDK-agnostic callable error codes.
const CALLABLE_ERROR_CODES: readonly CallableErrorCode[] = [
  'ok',
  'cancelled',
  'unknown',
  'invalid-argument',
  'deadline-exceeded',
  'not-found',
  'already-exists',
  'permission-denied',
  'resource-exhausted',
  'failed-precondition',
  'aborted',
  'out-of-range',
  'unimplemented',
  'internal',
  'unavailable',
  'data-loss',
  'unauthenticated',
];

function isCallableErrorCode(code: string): code is CallableErrorCode {
  return (CALLABLE_ERROR_CODES as readonly string[]).includes(code);
}

/** Normalize a thrown callable error (Firebase HttpsError or unknown) to CallableError. */
function toCallableError(error: unknown): CallableError {
  if (error && typeof error === 'object' && 'code' in error) {
    const rawCode = String((error as { code: unknown }).code);
    // Firebase HttpsError codes look like "functions/invalid-argument".
    const code = rawCode.startsWith('functions/') ? rawCode.slice('functions/'.length) : rawCode;
    const message = error instanceof Error ? error.message : 'Callable function error';
    const details = (error as { details?: unknown }).details;
    return new CallableError(isCallableErrorCode(code) ? code : 'unknown', message, details);
  }
  return new CallableError(
    'unknown',
    error instanceof Error ? error.message : 'Unknown callable function error',
  );
}

export const functionsAdapter: FunctionsCallPort = {
  async call<TReq, TRes>(name: string, payload: TReq): Promise<TRes> {
    try {
      const callable = httpsCallable<TReq, TRes>(functions, name);
      const result = await callable(payload);
      return result.data;
    } catch (error) {
      throw toCallableError(error);
    }
  },
};
