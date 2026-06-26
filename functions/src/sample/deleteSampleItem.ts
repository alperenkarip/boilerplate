// deleteSampleItem — callable write path for removing a sampleItem (ADR-020 Section 7.1).
//
// @MX:NOTE: [AUTO] Canonical write contract: deleteSampleItem({ id }) -> { id }.
// Same ownership rule as updateSampleItem: ownerId != request.auth.uid -> 'permission-denied'.
// @MX:TODO: [AUTO] Add Firebase emulator tests (ownership denial, not-found, happy path)

import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { z } from 'zod';
import { db, REGION } from '../lib/admin';
import { requireAuth, parseInput } from '../lib/errors';

const COLLECTION = 'sampleItems';

const DeleteSampleItemSchema = z.object({
  id: z.string().min(1, 'id is required'),
});

export const deleteSampleItem = onCall<unknown>({ region: REGION }, async (request) => {
  const uid = requireAuth(request);
  const { id } = parseInput(DeleteSampleItemSchema, request.data);

  const docRef = db.collection(COLLECTION).doc(id);
  const snapshot = await docRef.get();
  if (!snapshot.exists) {
    throw new HttpsError('not-found', 'The requested item does not exist.');
  }
  if (snapshot.get('ownerId') !== uid) {
    throw new HttpsError('permission-denied', 'You do not have access to this item.');
  }

  await docRef.delete();
  return { id };
});
