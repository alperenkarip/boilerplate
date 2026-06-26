// exampleTask — EXAMPLE task queue function (Cloud Tasks + onTaskDispatched).
//
// This is the canonical async / deferred queue pattern (ADR-020 Section 10.2): work
// is pushed onto a managed Cloud Tasks queue and processed by a Cloud Function. It is
// the boilerplate's replacement for external job queues (Inngest / BullMQ forbidden,
// ADR-020 Section 10.3). enqueueExampleTask() is the producer; exampleTask is the worker.
//
// @MX:WARN: [AUTO] Task handlers can be retried / replayed by Cloud Tasks
// @MX:REASON: retryConfig means the same payload may run more than once; the body MUST stay idempotent (ADR-020 Section 9.3) or retries will double-apply side effects.
// @MX:TODO: [AUTO] Replace the logger stub with real idempotent work and add emulator tests

import { onTaskDispatched } from 'firebase-functions/v2/tasks';
import { getFunctions } from 'firebase-admin/functions';
import * as logger from 'firebase-functions/logger';
import { z } from 'zod';
import { REGION } from '../lib/admin';

const ExampleTaskPayloadSchema = z.object({
  itemId: z.string().min(1),
  reason: z.string().max(500).optional(),
});

export type ExampleTaskPayload = z.infer<typeof ExampleTaskPayloadSchema>;

export const exampleTask = onTaskDispatched<ExampleTaskPayload>(
  {
    region: REGION,
    retryConfig: { maxAttempts: 5, minBackoffSeconds: 60 },
    rateLimits: { maxConcurrentDispatches: 6 },
  },
  async (request) => {
    // Re-validate even queued payloads: tasks may be replayed and must not trust input.
    const payload = ExampleTaskPayloadSchema.parse(request.data);
    logger.info('exampleTask: processing', payload);
    // ... perform idempotent async work here (e.g. derived writes, fan-out, notifications) ...
  },
);

/**
 * Producer helper — enqueue a payload onto the exampleTask queue from any other
 * function (callable / trigger / scheduled). The full resource path pins the target
 * to REGION so the queue and worker stay co-located.
 *
 * NOTE: intentionally NOT re-exported from index.ts — only CloudFunction triggers
 * belong there. Exporting this plain helper as a "function" would confuse deploy.
 */
export async function enqueueExampleTask(
  payload: ExampleTaskPayload,
  scheduleDelaySeconds = 0,
): Promise<void> {
  const queue = getFunctions().taskQueue(`locations/${REGION}/functions/exampleTask`);
  await queue.enqueue(payload, { scheduleDelaySeconds });
}
