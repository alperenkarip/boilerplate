---
engine: Firestore
orm: Firebase SDK
last_synced_at: _TBD_
manifest_hash: _TBD_
---

# Firestore Data Model

Cloud Firestore (NoSQL document store, ADR-020). Model is **collection-centric**: collections hold
documents, documents may hold subcollections. Modelling is driven by **read patterns**, not
relational normalization. Cross-document consistency and derived fields are maintained by Cloud
Functions (never by client direct writes).

_Edit this file directly, or let the auto-sync hook populate it from `firestore.rules` /
`firestore.indexes.json` / `functions/**` changes._

---

## Collections

| Collection | Document ID | Description |
|------------|-------------|-------------|
| _TBD_ | _TBD_ | _TBD_ |

<!--
Example:
| users                  | uid (auth)        | Core user profile — keyed by Firebase Auth uid |
| posts                  | auto-id           | User-authored content items |
| posts/{postId}/comments| auto-id           | Subcollection: comments under a post |
-->

---

## Document Shape

Describe key fields per collection. Firestore is schemaless, so the documented shape is a
convention enforced by Cloud Functions + Security Rules, not by the database.

### _TBD_ Collection

| Field | Type | Notes |
|-------|------|-------|
| _TBD_ | _TBD_ | _TBD_ |

<!--
Example: users/{uid}
| uid         | string    | Matches Firebase Auth uid (also the document ID) |
| displayName | string    | Public display name |
| email       | string    | Owner-only read via Security Rules |
| createdAt   | timestamp | Server timestamp, set by Cloud Function on create |
-->

---

## Relationships (References)

Firestore has no foreign keys. Relationships are modelled by reference fields, subcollections, or
denormalized copies (maintained by Cloud Functions).

| From | To | Pattern | Link | Notes |
|------|----|---------|------|-------|
| _TBD_ | _TBD_ | _TBD_ | _TBD_ | _TBD_ |

<!--
Cardinality patterns: reference-field | subcollection | denormalized
Example:
| posts | users | reference-field | posts.authorUid -> users/{uid} | Author of a post |
| posts | comments | subcollection | posts/{postId}/comments | A post owns its comments |
| users | roles | denormalized | users.roles: string[] | Roles copied onto the user doc by a Function |
-->

---

## Indexes

Composite indexes are declared in `firestore.indexes.json` and versioned with the repo
(ADR-020 Section 8.2). Single-field indexes are automatic.

| Collection | Fields | Order | Purpose |
|------------|--------|-------|---------|
| _TBD_ | _TBD_ | _TBD_ | _TBD_ |

<!--
Example:
| posts | authorUid, createdAt | ASC, DESC | Paginated posts for a given author |
| posts | status, createdAt    | ASC, DESC | Published-feed query |
-->

---

## Constraints and Invariants

Firestore has no CHECK/UNIQUE constraints. Invariants are enforced by Cloud Functions (write path)
and Security Rules (read/write guards).

| Collection | Invariant | Enforced by | Definition |
|------------|-----------|-------------|-----------|
| _TBD_ | _TBD_ | _TBD_ | _TBD_ |

<!--
Example:
| users | uid uniqueness        | Document ID = auth uid | One profile per authenticated user |
| posts | status in enum        | Cloud Function validation | status in ('draft','published','archived') |
| posts | authorUid immutable    | Security Rules          | authorUid cannot change after create |
-->
