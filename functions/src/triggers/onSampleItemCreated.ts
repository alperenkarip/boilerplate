// onSampleItemCreated — EXAMPLE Firestore trigger (onDocumentCreated).
//
// @MX:NOTE: [AUTO] Runs AFTER a sampleItems document is created (e.g. by createSampleItem).
// This is the canonical home (ADR-020 Section 9.2) for derived effects, denormalization,
// fan-out, or enqueueing Cloud Tasks — all of which Section 7.1 keeps OUT of the client.
// @MX:TODO: [AUTO] Replace the logger stub with real derived effects and add emulator tests

import { onDocumentCreated } from 'firebase-functions/v2/firestore';
import * as logger from 'firebase-functions/logger';
import { REGION } from '../lib/admin';

export const onSampleItemCreated = onDocumentCreated(
  {
    document: 'sampleItems/{itemId}',
    region: REGION,
  },
  async (event) => {
    const snapshot = event.data;
    if (!snapshot) {
      return; // defensive: create events always carry data, but the type is optional
    }

    const item = snapshot.data();
    logger.info('onSampleItemCreated', {
      itemId: event.params.itemId,
      ownerId: item.ownerId,
      title: item.title,
    });

    // Example follow-up (see tasks/exampleTask.ts):
    //   await enqueueExampleTask({ itemId: event.params.itemId });
  },
);
