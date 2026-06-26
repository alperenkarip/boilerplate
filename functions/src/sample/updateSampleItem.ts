// updateSampleItem — callable write path for editing a sampleItem (ADR-020 Section 7.1).
//
// @MX:NOTE: [AUTO] Canonical write contract: updateSampleItem({ id, title?, description?, status? }) -> { id }.
// Ownership is enforced server-side: a doc whose ownerId != request.auth.uid yields
// 'permission-denied'. Only provided fields are written; updatedAt is always bumped.
// @MX:TODO: [AUTO] Add Firebase emulator tests (ownership denial, partial update, description=null clears field)

import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { z } from 'zod';
import { db, serverTimestamp, REGION } from '../lib/admin';
import { requireAuth, parseInput } from '../lib/errors';

const COLLECTION = 'sampleItems';

const UpdateSampleItemSchema = z.object({
  id: z.string().min(1, 'id is required'),
  title: z.string().trim().min(1, 'title must not be empty').max(200).optional(),
  // Present-and-null clears the field; absent leaves it untouched.
  description: z.string().max(2000).nullish(),
  status: z.enum(['active', 'archived']).optional(),
});

export const updateSampleItem = onCall<unknown>({ region: REGION }, async (request) => {
  const uid = requireAuth(request);
  const input = parseInput(UpdateSampleItemSchema, request.data);

  const docRef = db.collection(COLLECTION).doc(input.id);
  const snapshot = await docRef.get();
  if (!snapshot.exists) {
    throw new HttpsError('not-found', 'The requested item does not exist.');
  }
  if (snapshot.get('ownerId') !== uid) {
    throw new HttpsError('permission-denied', 'You do not have access to this item.');
  }

  // Build a partial update: only fields the client actually sent, plus updatedAt.
  const update: Record<string, unknown> = { updatedAt: serverTimestamp() };
  if (input.title !== undefined) {
    update.title = input.title;
  }
  if (input.description !== undefined) {
    update.description = input.description; // may be an explicit null (clears it)
  }
  if (input.status !== undefined) {
    update.status = input.status;
  }

  await docRef.update(update);
  return { id: input.id };
});
