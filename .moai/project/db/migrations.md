# Rules & Index Deploys

> Cloud Firestore has **no SQL migrations**. The schema is schemaless; what gets versioned and
> deployed are **Security Rules** (`firestore.rules`, `storage.rules`) and **composite indexes**
> (`firestore.indexes.json`). Deploys are performed with the **Firebase CLI**
> (`firebase deploy --only firestore:rules,firestore:indexes,storage`). Local validation runs
> against the **Firebase Emulator Suite**.

The `Applied Deploys` table is partially auto-updated by the `moai-domain-db-docs` hook when rule /
index / Functions files change (see `migration_patterns` in `db.yaml`).

---

## Applied Deploys

| Artifact | Deployed At | Checksum | Summary |
|----------|-------------|----------|---------|
| _TBD_ | _TBD_ | _TBD_ | _TBD_ |

<!--
Example rows:
| firestore.rules         | 2026-01-01T10:00:00Z | sha256:abc123 | Initial deny-all + users owner read |
| firestore.indexes.json  | 2026-01-15T14:30:00Z | sha256:def456 | Add posts(authorUid, createdAt) index |
| storage.rules           | 2026-02-01T09:15:00Z | sha256:ghi789 | Owner-only user-uploads |
-->

---

## Pending Deploys

Rule or index changes that exist in the repo but have not yet been deployed to the live project.

| Artifact | Created At | Description | Blocking? |
|----------|-----------|-------------|-----------|
| _TBD_ | _TBD_ | _TBD_ | _TBD_ |

<!--
Example:
| firestore.indexes.json | 2026-03-01 | Add composite index for comments feed | No |
| firestore.rules        | 2026-03-10 | Tighten posts write guard | Yes — review before deploy |
-->

---

## Rollback Notes

Document how to revert risky rule/index changes. Index builds can take time on large collections;
tightening rules can break clients if mis-scoped.

| Artifact | Risk Level | Rollback Steps | Client Impact? |
|----------|-----------|----------------|----------------|
| _TBD_ | _TBD_ | _TBD_ | _TBD_ |

<!--
Example:
| firestore.indexes.json | Low    | Redeploy previous firestore.indexes.json; index auto-rebuilds | No |
| firestore.rules        | High   | Redeploy previous firestore.rules (test in emulator first)    | Possible — read/write denials |
| storage.rules          | Medium | Redeploy previous storage.rules                                | Possible — upload/download denials |
-->

---

## Deploy Workflow

```
1. Edit firestore.rules / firestore.indexes.json / storage.rules
2. Validate locally: firebase emulators:start (rules unit tests + index checks)
3. Deploy: firebase deploy --only firestore:rules,firestore:indexes,storage
4. Record the deploy in the Applied Deploys table above
```
