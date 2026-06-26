// cleanupArchived — EXAMPLE scheduled function (Cloud Scheduler + onSchedule).
//
// This is the canonical cron pattern (ADR-020 Section 10.1): scheduled work runs as
// a Cloud Function triggered by Cloud Scheduler. It is the boilerplate's replacement
// for external job queues — Inngest / BullMQ are forbidden by ADR-020 Section 10.3.
//
// It deletes sampleItems that have been 'archived' for longer than the retention
// window, in bounded batches.
//
// @MX:WARN: [AUTO] Unattended PERMANENT deletion on a schedule
// @MX:REASON: Runs with Admin privileges and no human in the loop; a wrong predicate or retention value would silently destroy user data. Keep the query owner-agnostic ONLY because it targets a global retention policy, and keep the batch bounded.
// @MX:TODO: [AUTO] Add a composite index (status ASC, updatedAt ASC) to firestore.indexes.json before enabling, and add emulator tests for the retention boundary

import { onSchedule } from 'firebase-functions/v2/scheduler';
import * as logger from 'firebase-functions/logger';
import { db, REGION } from '../lib/admin';

const COLLECTION = 'sampleItems';
const RETENTION_DAYS = 30;
// Stay safely under Firestore's 500-writes-per-batch ceiling.
const BATCH_LIMIT = 400;

export const cleanupArchived = onSchedule(
  {
    schedule: 'every day 03:00',
    timeZone: 'Etc/UTC',
    region: REGION,
  },
  async () => {
    const cutoff = new Date(Date.now() - RETENTION_DAYS * 24 * 60 * 60 * 1000);

    // NOTE: this status + updatedAt range query requires a composite index.
    const stale = await db
      .collection(COLLECTION)
      .where('status', '==', 'archived')
      .where('updatedAt', '<', cutoff)
      .limit(BATCH_LIMIT)
      .get();

    if (stale.empty) {
      logger.info('cleanupArchived: no archived items past retention');
      return;
    }

    const batch = db.batch();
    stale.docs.forEach((doc) => batch.delete(doc.ref));
    await batch.commit();

    logger.info(`cleanupArchived: deleted ${stale.size} archived item(s)`);
  },
);
