// FunctionsCallPort adapter'i — @react-native-firebase/functions (ADR-020 Bolum 7.1 + 14).
//
// @MX:NOTE: [AUTO] Canonical yazma yolu: tum create/update/delete callable Cloud Functions ile calisir. Client dogrudan Firestore'a YAZMAZ.
// RNFB HttpsError, SDK-free CallableError'a normalize edilir; boylece cagiranlar tek hata sekliyle ugrasir.
// @MX:TODO: [AUTO] jest-expo + functions mock'lari ile adapter testleri eklenmeli

import functions from '@react-native-firebase/functions';
import { CallableError, type CallableErrorCode, type FunctionsCallPort } from '@project/core';

// RNFB FunctionsErrorCode degerleri, core CallableErrorCode ile birebir aynidir.
const CALLABLE_ERROR_CODES: ReadonlySet<CallableErrorCode> = new Set<CallableErrorCode>([
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
]);

/** Bilinmeyen bir degerin string-anahtarli nesne olup olmadigini daraltir. */
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

/** Ham RNFB HttpsError'i SDK-free CallableError'a donusturur. */
function toCallableError(error: unknown): CallableError {
  if (isRecord(error)) {
    const rawCode = error.code;
    const code: CallableErrorCode =
      typeof rawCode === 'string' && CALLABLE_ERROR_CODES.has(rawCode as CallableErrorCode)
        ? (rawCode as CallableErrorCode)
        : 'unknown';
    const message =
      typeof error.message === 'string' && error.message.length > 0
        ? error.message
        : 'Callable cagrisi basarisiz oldu.';
    return new CallableError(code, message, error.details);
  }
  return new CallableError('unknown', 'Callable cagrisi basarisiz oldu.');
}

export const functionsAdapter: FunctionsCallPort = {
  async call<TReq, TRes>(name: string, payload: TReq): Promise<TRes> {
    try {
      const callable = functions().httpsCallable<TReq, TRes>(name);
      const result = await callable(payload);
      return result.data;
    } catch (error: unknown) {
      throw toCallableError(error);
    }
  },
};
