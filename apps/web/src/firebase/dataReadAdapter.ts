// DataReadPort adapter — firebase/firestore implementation (ADR-020 Section 7.2 + 14).
//
// Canonical read path: client SDK reads against Firestore (Security Rules
// protected), with realtime via onSnapshot. Writes do NOT live here — they go
// through FunctionsCallPort. The SDK-agnostic DataQuery is translated into real
// firebase/firestore query constraints below.
//
// Firestore Timestamps are normalized to ISO strings so the port yields plain,
// serializable documents (T) rather than leaking SDK value types to callers.

import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query as buildQuery,
  where,
  orderBy,
  limit as limitTo,
  Timestamp,
  type DocumentData,
  type QueryConstraint,
} from 'firebase/firestore';
import type { DataReadPort, DataQuery, Unsubscribe } from '@project/core';
import { db } from './config';

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (value === null || typeof value !== 'object') return false;
  const proto = Object.getPrototypeOf(value) as object | null;
  return proto === Object.prototype || proto === null;
}

/** Recursively convert Firestore Timestamps to ISO strings; leave other types intact. */
function normalize(value: unknown): unknown {
  if (value instanceof Timestamp) return value.toDate().toISOString();
  if (Array.isArray(value)) return value.map(normalize);
  if (isPlainObject(value)) {
    const out: Record<string, unknown> = {};
    for (const [key, inner] of Object.entries(value)) {
      out[key] = normalize(inner);
    }
    return out;
  }
  return value;
}

/** Merge the document id with normalized data into the caller's shape T. */
function mapDoc<T>(id: string, data: DocumentData): T {
  return { id, ...(normalize(data) as Record<string, unknown>) } as T;
}

function toConstraints(query?: DataQuery): QueryConstraint[] {
  const constraints: QueryConstraint[] = [];
  if (query?.where) {
    for (const filter of query.where) {
      constraints.push(where(filter.field, filter.op, filter.value));
    }
  }
  if (query?.orderBy) {
    for (const order of query.orderBy) {
      constraints.push(orderBy(order.field, order.direction ?? 'asc'));
    }
  }
  if (typeof query?.limit === 'number') {
    constraints.push(limitTo(query.limit));
  }
  return constraints;
}

export const dataReadAdapter: DataReadPort = {
  async getDocById<T>(collectionName: string, id: string): Promise<T | null> {
    const snapshot = await getDoc(doc(db, collectionName, id));
    return snapshot.exists() ? mapDoc<T>(snapshot.id, snapshot.data()) : null;
  },

  async listDocs<T>(collectionName: string, query?: DataQuery): Promise<T[]> {
    const ref = buildQuery(collection(db, collectionName), ...toConstraints(query));
    const snapshot = await getDocs(ref);
    return snapshot.docs.map((document) => mapDoc<T>(document.id, document.data()));
  },

  subscribeDocById<T>(
    collectionName: string,
    id: string,
    onNext: (doc: T | null) => void,
    onError?: (error: Error) => void,
  ): Unsubscribe {
    return onSnapshot(
      doc(db, collectionName, id),
      (snapshot) => onNext(snapshot.exists() ? mapDoc<T>(snapshot.id, snapshot.data()) : null),
      (error) => onError?.(error),
    );
  },

  subscribeList<T>(
    collectionName: string,
    query: DataQuery,
    onNext: (docs: T[]) => void,
    onError?: (error: Error) => void,
  ): Unsubscribe {
    const ref = buildQuery(collection(db, collectionName), ...toConstraints(query));
    return onSnapshot(
      ref,
      (snapshot) =>
        onNext(snapshot.docs.map((document) => mapDoc<T>(document.id, document.data()))),
      (error) => onError?.(error),
    );
  },
};
