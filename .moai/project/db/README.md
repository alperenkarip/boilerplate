# .moai/project/db/

Backend & data platform: **Firebase / Cloud Firestore** (canonical, ADR-020).

---

## Purpose

This directory is the **authoritative source** for Firestore data-model documentation, deploy
history (Security Rules + indexes), access-control policies, query patterns, and seed-data
strategy for this project.

Files are maintained in two ways:
1. **Auto-sync**: The `moai-domain-db-docs` PostToolUse hook detects changes to Firestore rule /
   index / Functions files (see `migration_patterns` in `db.yaml`) and regenerates schema
   documentation automatically (10-second debounce).
2. **Manual edit**: Any file in this directory can be edited directly. Re-running `/moai db init`
   will **preserve** your edits and only warn — it will not overwrite user-modified files
   (see Auto-sync Policy below and SPEC-DB-CMD-001 for enforcement details).

---

## Platform Model (ADR-020 / ADR-021)

- **Database**: Cloud Firestore (NoSQL document store). Collection-centric modelling, not tables.
- **Read path**: Client SDK reads directly from Firestore (`getDoc` / `getDocs` / `onSnapshot`),
  guarded by Security Rules. Realtime via `onSnapshot`.
- **Write path**: All `create` / `update` / `delete` and business logic go through Cloud Functions
  (callable `onCall` / HTTPS `onRequest`). **Client direct writes are forbidden.**
- **Authorization**: Firestore Security Rules (`request.auth`) on the read side; Cloud Functions
  `context.auth` on the write side. There is **no row-level security (RLS)** — RLS is a relational
  concept; Firestore uses Security Rules instead (see `rls-policies.md`).
- **No SQL / no ORM**: SQL ORMs (Prisma/Drizzle) and relational migrations are not canonical
  (ADR-020 Section 15). Schema, authorization, and indexes live in `firestore.rules`,
  `firestore.indexes.json`, and `functions/`.

---

## Auto-sync Policy

| Trigger | Action |
|---------|--------|
| Rule/index/Functions file saved (matches `migration_patterns` in `db.yaml`) | `moai-domain-db-docs` regenerates `schema.md` and `erd.mmd` |
| Files in `.moai/project/db/**` saved | **Excluded** — no recursive trigger |
| Files in `.moai/cache/**` saved | Excluded |
| `**/*.lock` files saved | Excluded |

Debounce: 10 seconds (configurable via `db.auto_sync.debounce_seconds` in `db.yaml`).
User approval required before applying auto-generated changes (`require_user_approval: true`).

---

## Update Workflow

```
1. Edit a Firestore artifact (firestore.rules, firestore.indexes.json, or functions/**)
2. PostToolUse hook fires -> moai-domain-db-docs analyzes changes
3. Proposed updates presented via AskUserQuestion
4. On approval: schema.md and erd.mmd are updated
5. Manual review: rls-policies.md, queries.md, seed-data.md (not auto-updated)
```

For conflicts (e.g., you edited `schema.md` manually and a rules/index change also altered the
model), MoAI calls `AskUserQuestion` to resolve the conflict before writing.

---

## File Responsibilities

| File | Purpose | Auto-updated? |
|------|---------|---------------|
| `schema.md` | Collections, documents, subcollections, relationships, indexes | Yes (via hook) |
| `erd.mmd` | Mermaid diagram — visual representation of the collection model | Yes (via hook) |
| `migrations.md` | Rules/index deploy history (Firebase CLI), pending deploys, rollback notes | Partial (deploy list) |
| `rls-policies.md` | Firestore Security Rules and access-control matrix (replaces RLS) | No — edit manually |
| `queries.md` | Common reads (client SDK) and writes (callable Functions) | No — edit manually |
| `seed-data.md` | Seed strategy via Emulator Suite / Admin SDK, fixtures, dev vs prod data | No — edit manually |

---

## Excluded Patterns

The following paths are excluded from auto-sync triggering (see `db.yaml`):

```
.moai/project/db/**    # This directory — prevents recursive hook loops
.moai/cache/**         # Cache files
**/*.lock              # Lock files (package-lock.json, yarn.lock, etc.)
```

---

## Configuration

Database documentation behavior is controlled by `.moai/config/sections/db.yaml`.

Key settings:
- `db.enabled` — `true` (Firebase/Firestore canonical, ADR-020)
- `db.engine` — `Firestore`
- `db.orm` — `Firebase SDK` (Firestore has no ORM; access via port/adapter, ADR-020 Section 14)
- `db.migration_tool` — `Firebase (firestore.rules + firestore.indexes.json deploy)`

---

_Last reviewed: 2026-06-26 (ADR-020 / ADR-021 alignment)_
_Populated by: `/moai db init` interview_
