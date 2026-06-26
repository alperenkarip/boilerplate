# Query & Mutation Patterns

Cloud Firestore access patterns (ADR-020 Section 7). The read/write contract is canonical:

- **Reads** use the client SDK directly against Firestore (`getDoc` / `getDocs` / `onSnapshot`),
  guarded by Security Rules.
- **Writes** are never client-direct. They go through **callable Cloud Functions** (`onCall`),
  which own validation, derived fields, and authorization (`context.auth`).

Code examples use the web `firebase` modular SDK (v11.x). Mobile uses the equivalent
`@react-native-firebase` API; `packages/core` stays SDK-free behind `DataReadPort` /
`FunctionsCallPort` (ADR-020 Section 14).

---

## Reads (Client SDK)

Direct Firestore reads, gated by Security Rules.

### _TBD_ Read Name

```ts
// Purpose: _TBD_
// Returns: _TBD_
// Guarded by: firestore.rules (request.auth)

import { doc, getDoc } from 'firebase/firestore';
const snap = await getDoc(doc(db, '_TBD_', '_TBD_'));
const data = snap.exists() ? snap.data() : null;
```

<!--
Example: paginated posts for an author
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';

const q = query(
  collection(db, 'posts'),
  where('authorUid', '==', uid),
  orderBy('createdAt', 'desc'),
  limit(20),
);
const snap = await getDocs(q);
const posts = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
// Requires composite index posts(authorUid, createdAt) in firestore.indexes.json
-->

---

## Realtime (onSnapshot)

Live subscriptions for server-owned data (ADR-005 alignment). Every subscription MUST be torn down
on logout / user switch (LogoutCleanupContract, ADR-021 Section 12).

### _TBD_ Subscription Name

```ts
// Purpose: _TBD_
// Cleanup: call unsubscribe() on logout / unmount

import { collection, query, where, onSnapshot } from 'firebase/firestore';

const unsubscribe = onSnapshot(
  query(collection(db, '_TBD_'), where('_TBD_', '==', '_TBD_')),
  (snap) => {
    const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    // update query cache / UI
  },
);
// later: unsubscribe();
```

---

## Writes (Callable Cloud Functions)

All mutations go through callable Functions. The client never calls `setDoc` / `addDoc` /
`updateDoc` / `deleteDoc` directly (forbidden, ADR-020 Section 7.1).

### _TBD_ Mutation Name

```ts
// Purpose: _TBD_
// Authorization: enforced server-side via context.auth in the Function
// Validation: enforced server-side (do not trust client payload)

import { getFunctions, httpsCallable } from 'firebase/functions';

const fn = httpsCallable(getFunctions(), '_TBD_');
const result = await fn({ /* payload */ });
```

<!--
Example: create a post
const createPost = httpsCallable(getFunctions(), 'createPost');
await createPost({ title, body });
// The createPost Function validates input, sets authorUid from context.auth.uid,
// stamps createdAt server-side, and writes to Firestore in a service-account context.
-->

---

## Aggregations & Reports

Firestore aggregation queries (`count()`, `sum()`, `average()`) for lightweight metrics; heavier
reporting is precomputed by Cloud Functions (scheduled `onSchedule`, ADR-020 Section 10) into a
summary collection that clients read.

### _TBD_ Aggregation Name

```ts
// Purpose: _TBD_
// Strategy: live aggregation query | precomputed summary doc

import { collection, query, where, getCountFromServer } from 'firebase/firestore';

const snap = await getCountFromServer(
  query(collection(db, '_TBD_'), where('_TBD_', '==', '_TBD_')),
);
const total = snap.data().count;
```

<!--
Example: precomputed report
- A scheduled Cloud Function aggregates nightly into reports/{period}
- Clients read reports/{period} directly (cheap, indexed, Security-Rules guarded)
- Avoids fan-out reads and keeps heavy work off the client
-->
