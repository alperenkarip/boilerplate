# @project/functions

Cloud Functions for Firebase — the **canonical write path and server logic** for the
boilerplate (ADR-020). Clients never write to Firestore directly; every
`create` / `update` / `delete` and all business logic runs here behind the Admin SDK.

## What's inside

```
functions/
├── src/
│   ├── index.ts                     # deploy entrypoint (re-exports every function)
│   ├── lib/
│   │   ├── admin.ts                 # Admin SDK singleton, db, serverTimestamp, REGION
│   │   └── errors.ts                # zod -> 'invalid-argument', auth -> 'unauthenticated'
│   ├── sample/                      # callable write path (web + mobile call these)
│   │   ├── createSampleItem.ts      # ({ title, description? }) -> { id }
│   │   ├── updateSampleItem.ts      # ({ id, title?, description?, status? }) -> { id }
│   │   └── deleteSampleItem.ts      # ({ id }) -> { id }
│   ├── scheduled/cleanupArchived.ts # EXAMPLE Cloud Scheduler cron (onSchedule)
│   ├── tasks/exampleTask.ts         # EXAMPLE Cloud Tasks queue (onTaskDispatched + enqueue)
│   └── triggers/onSampleItemCreated.ts # EXAMPLE Firestore trigger (onDocumentCreated)
├── tsconfig.json                    # CommonJS, nodejs20, outDir lib/
└── eslint.config.mjs                # standalone @typescript-eslint flat config
```

## Callable contract

All three sample callables require `request.auth` (else `unauthenticated`), validate
input with zod (else `invalid-argument`), and set `ownerId` from the auth identity —
never from the payload. `updateSampleItem` / `deleteSampleItem` enforce ownership
(`ownerId != auth.uid` -> `permission-denied`). Error codes line up 1:1 with
`packages/core` `CallableErrorCode`, so the web/mobile adapters get a stable shape.

## Region

All functions deploy to **`us-central1`** (single source: `REGION` in `src/lib/admin.ts`).
This matches both clients out of the box:

- **web** uses `VITE_FIREBASE_FUNCTIONS_REGION` (Firebase defaults to `us-central1` when unset)
- **mobile** (`@react-native-firebase`) calls the `us-central1` default with no override

If you change `REGION`, also update the web/mobile region config and redeploy.

## Develop locally (emulator)

From the repo root (or this directory):

```bash
pnpm --filter @project/functions build      # compile TypeScript to lib/
pnpm --filter @project/functions serve      # build + firebase emulators:start --only functions
```

The Functions emulator listens on port **5001** (see `firebase.json`). The web/mobile
apps auto-connect to the emulator suite in development.

## Deploy

```bash
pnpm --filter @project/functions deploy     # firebase deploy --only functions
```

`firebase.json` runs `lint` + `build` as a deploy `predeploy` hook.

## Notes

- **Runtime:** Node.js 20 (`firebase.json` `runtime: nodejs20`). `firebase-admin` is
  pinned to `^13` and `firebase-functions` to `^6`; `firebase-admin@14` is intentionally
  avoided because it requires Node `>=22`, which conflicts with the canonical `nodejs20` runtime.
- **No external job queues:** scheduled work uses Cloud Scheduler (`onSchedule`) and async
  work uses Cloud Tasks (`onTaskDispatched`). Inngest / BullMQ are forbidden (ADR-020 §10.3).
- **cleanupArchived** needs a composite index `(status ASC, updatedAt ASC)` in
  `firestore.indexes.json` before it can run its retention query in production.
