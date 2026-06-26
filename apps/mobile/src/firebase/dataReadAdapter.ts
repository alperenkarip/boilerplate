// DataReadPort adapter'i — @react-native-firebase/firestore (ADR-020 Bolum 7.2 + 14).
//
// @MX:NOTE: [AUTO] Canonical okuma yolu: client SDK getDoc/getDocs + onSnapshot. Yazma BURADA degil; callable Cloud Functions (FunctionsCallPort) uzerinden akar.
// Security Rules owner-scoped oldugundan, liste cagrilari her zaman ownerId == uid
// filtresiyle yapilmalidir (cagiran tarafin sorumlulugu).
// @MX:TODO: [AUTO] jest-expo + firestore mock'lari ile adapter testleri eklenmeli

import firestore, { type FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import type { DataQuery, DataReadPort, Unsubscribe } from '@project/core';

/**
 * SDK -> domain sinir donusumu. Firestore gevsek tipli DocumentData dondurur;
 * T sozlesmesi cagirana aittir. Domain nesnelerinin Firestore key'ini tasimasi
 * icin dokuman id'si data ile birlestirilir.
 */
function mapDoc<T>(id: string, data: FirebaseFirestoreTypes.DocumentData | undefined): T {
  return { id, ...(data ?? {}) } as unknown as T;
}

/** SDK-agnostik DataQuery'yi bir Firestore collection referansina uygular. */
function applyQuery(
  ref: FirebaseFirestoreTypes.CollectionReference,
  query?: DataQuery,
): FirebaseFirestoreTypes.Query {
  let q: FirebaseFirestoreTypes.Query = ref;
  if (query?.where) {
    for (const filter of query.where) {
      q = q.where(filter.field, filter.op, filter.value);
    }
  }
  if (query?.orderBy) {
    for (const order of query.orderBy) {
      q = q.orderBy(order.field, order.direction ?? 'asc');
    }
  }
  if (query?.limit !== undefined) {
    q = q.limit(query.limit);
  }
  return q;
}

export const dataReadAdapter: DataReadPort = {
  async getDocById<T>(collection: string, id: string): Promise<T | null> {
    const snapshot = await firestore().collection(collection).doc(id).get();
    if (!snapshot.exists) return null;
    return mapDoc<T>(snapshot.id, snapshot.data());
  },

  async listDocs<T>(collection: string, query?: DataQuery): Promise<T[]> {
    const snapshot = await applyQuery(firestore().collection(collection), query).get();
    return snapshot.docs.map((doc) => mapDoc<T>(doc.id, doc.data()));
  },

  subscribeDocById<T>(
    collection: string,
    id: string,
    onNext: (doc: T | null) => void,
    onError?: (error: Error) => void,
  ): Unsubscribe {
    return firestore()
      .collection(collection)
      .doc(id)
      .onSnapshot(
        (snapshot) => {
          onNext(snapshot.exists ? mapDoc<T>(snapshot.id, snapshot.data()) : null);
        },
        (error) => {
          onError?.(error);
        },
      );
  },

  subscribeList<T>(
    collection: string,
    query: DataQuery,
    onNext: (docs: T[]) => void,
    onError?: (error: Error) => void,
  ): Unsubscribe {
    return applyQuery(firestore().collection(collection), query).onSnapshot(
      (snapshot) => {
        onNext(snapshot.docs.map((doc) => mapDoc<T>(doc.id, doc.data())));
      },
      (error) => {
        onError?.(error);
      },
    );
  },
};
