// @MX:ANCHOR: [AUTO] DataReadPort — cross-platform Firestore read contract (ADR-020); web & mobile adapters implement this
// @MX:REASON: Public API boundary for the canonical read path (client SDK getDoc/getDocs/onSnapshot); every read adapter and data-consuming feature depends on these signatures and the SDK-agnostic query shape
//
// DataReadPort — SDK-free read/subscribe boundary (ADR-020 Sections 7.2 + 14).
//
// Canonical contract: reads happen on the client SDK directly against Firestore
// (Security Rules protected), with realtime via onSnapshot. Writes do NOT belong
// here — they flow through FunctionsCallPort (callable Cloud Functions).
//
// The query shape below is SDK-agnostic: it mirrors Firestore where/orderBy/limit
// semantics using plain string unions, so packages/core stays SDK-free while
// adapters map it onto real firebase/firestore query builders.

import type { Unsubscribe } from './types';

/** Firestore-compatible comparison operators, expressed SDK-agnostically. */
export type WhereOperator =
  | '=='
  | '!='
  | '<'
  | '<='
  | '>'
  | '>='
  | 'in'
  | 'not-in'
  | 'array-contains'
  | 'array-contains-any';

/** A single field filter (maps to a Firestore where() clause). */
export interface WhereFilter {
  field: string;
  op: WhereOperator;
  value: unknown;
}

/** Sort direction for an orderBy clause. */
export type OrderDirection = 'asc' | 'desc';

/** A single sort clause (maps to a Firestore orderBy() call). */
export interface OrderBy {
  field: string;
  direction?: OrderDirection;
}

/** SDK-agnostic query: filters, ordering, and a result cap. */
export interface DataQuery {
  where?: WhereFilter[];
  orderBy?: OrderBy[];
  limit?: number;
}

export interface DataReadPort {
  /** One-shot read of a single document by id. Resolves null when absent. */
  getDocById<T>(collection: string, id: string): Promise<T | null>;

  /** One-shot read of a collection, optionally filtered/ordered/limited. */
  listDocs<T>(collection: string, query?: DataQuery): Promise<T[]>;

  /**
   * Realtime subscription to a single document (onSnapshot equivalent).
   * onNext fires with the latest value (or null when the doc is deleted/absent).
   * Returns an Unsubscribe handle that MUST be called on cleanup (ADR-021 Section 12).
   */
  subscribeDocById<T>(
    collection: string,
    id: string,
    onNext: (doc: T | null) => void,
    onError?: (error: Error) => void,
  ): Unsubscribe;

  /**
   * Realtime subscription to a query result set (onSnapshot equivalent).
   * onNext fires with the full matching list on every change.
   * Returns an Unsubscribe handle that MUST be called on cleanup (ADR-021 Section 12).
   */
  subscribeList<T>(
    collection: string,
    query: DataQuery,
    onNext: (docs: T[]) => void,
    onError?: (error: Error) => void,
  ): Unsubscribe;
}
