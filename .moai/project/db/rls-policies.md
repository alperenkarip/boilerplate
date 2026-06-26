# Access Control — Firestore Security Rules

> **Note:** This project uses **Firebase / Cloud Firestore**, which has **no row-level security
> (RLS)**. RLS is a relational/PostgreSQL concept. The Firestore equivalent is **Security Rules**
> (`firestore.rules` + `storage.rules`), evaluated against `request.auth` (Firebase Auth identity,
> ADR-021). The filename is kept for continuity, but all content below describes Security Rules.

Authorization model (ADR-020 Section 7, ADR-021 Section 7):
- **Read** is allowed directly from the client SDK, gated by Firestore Security Rules.
- **Write** is forbidden from the client by default; all writes go through Cloud Functions running
  in a service-account context. Functions enforce authorization via `context.auth`.

---

## Firestore Security Rules

Rules live in `firestore.rules` and are versioned with the repo. Default posture: **deny client
writes**, allow reads only to authorized identities.

<!--
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Default deny — nothing is open unless a rule below allows it
    match /{document=**} {
      allow read, write: if false;
    }

    // users/{uid}: owner-only read; all writes go through Cloud Functions (deny client write)
    match /users/{uid} {
      allow read:  if request.auth != null && request.auth.uid == uid;
      allow write: if false; // writes only via callable Cloud Functions (context.auth)
    }

    // posts/{postId}: public read of published posts; client write denied
    match /posts/{postId} {
      allow read:  if resource.data.status == 'published'
                   || (request.auth != null && request.auth.uid == resource.data.authorUid);
      allow write: if false; // create/update/delete only via Cloud Functions
    }
  }
}
-->

| Path | Operation | Condition (`request.auth`) | Notes |
|------|-----------|----------------------------|-------|
| _TBD_ | _TBD_ | _TBD_ | _TBD_ |

<!--
Example:
| users/{uid}      | read  | request.auth.uid == uid              | Owner-only profile read |
| users/{uid}      | write | false                                | Client write denied; Functions only |
| posts/{postId}   | read  | status == 'published' or owner        | Public feed + owner drafts |
| posts/{postId}   | write | false                                | Mutations via callable Function |
-->

---

## Storage Security Rules

Object storage (Cloud Storage for Firebase, ADR-020 Section 11) is guarded by `storage.rules`,
also against `request.auth`.

| Path | Operation | Condition | Notes |
|------|-----------|-----------|-------|
| _TBD_ | _TBD_ | _TBD_ | _TBD_ |

<!--
Example:
| user-uploads/{uid}/{file} | read  | request.auth.uid == uid | Owner-only object read |
| user-uploads/{uid}/{file} | write | request.auth.uid == uid && request.resource.size < 5 * 1024 * 1024 | Owner upload, 5MB cap |
-->

---

## Access Control Matrix

Map identities to permitted operations per collection. "Write" is always via Cloud Functions
(`context.auth`), never client-direct.

| Collection | anonymous | authenticated (other) | authenticated (owner) | Cloud Function (service) |
|------------|-----------|-----------------------|-----------------------|--------------------------|
| _TBD_ | _TBD_ | _TBD_ | _TBD_ | _TBD_ |

<!--
Example:
| users  | NONE          | NONE                 | READ (own doc)        | ALL (validated writes) |
| posts  | READ (published) | READ (published)  | READ (own drafts)     | ALL (validated writes) |
-->
