// Cloud Functions entrypoint (ADR-020). Every symbol re-exported here is deployed as
// a function; deploy region is set per-function via REGION in lib/admin.ts.
//
// Only CloudFunction triggers belong in this file. Plain helpers (e.g.
// enqueueExampleTask) are imported directly by other modules, never re-exported here.

// --- Callable write path (canonical) — sampleItems CRUD ---------------------
export { createSampleItem } from './sample/createSampleItem';
export { updateSampleItem } from './sample/updateSampleItem';
export { deleteSampleItem } from './sample/deleteSampleItem';

// --- Scheduled (Cloud Scheduler) — example cron -----------------------------
export { cleanupArchived } from './scheduled/cleanupArchived';

// --- Task queue (Cloud Tasks) — example async worker ------------------------
export { exampleTask } from './tasks/exampleTask';

// --- Firestore trigger — example post-write effect --------------------------
export { onSampleItemCreated } from './triggers/onSampleItemCreated';
