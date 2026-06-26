// createSampleItem — callable write path for new sampleItems (ADR-020 Section 7.1).
//
// @MX:NOTE: [AUTO] Canonical write contract: createSampleItem({ title, description? }) -> { id }.
// ownerId is taken from request.auth (never the client payload), status defaults to
// 'active', and createdAt/updatedAt are server timestamps. Mirrors apps/web + apps/mobile.
// @MX:TODO: [AUTO] Add Firebase emulator tests (auth required, ownerId from auth, invalid-argument on bad input)

import { onCall } from 'firebase-functions/v2/https';
import { z } from 'zod';
import { db, serverTimestamp, REGION } from '../lib/admin';
import { requireAuth, parseInput } from '../lib/errors';

const COLLECTION = 'sampleItems';

const CreateSampleItemSchema = z.object({
  title: z.string().trim().min(1, 'title must not be empty').max(200),
  // string | null | undefined — omitted/null both persist as null.
  description: z.string().max(2000).nullish(),
});

export const createSampleItem = onCall<unknown>({ region: REGION }, async (request) => {
  const ownerId = requireAuth(request);
  const input = parseInput(CreateSampleItemSchema, request.data);

  const now = serverTimestamp();
  const ref = await db.collection(COLLECTION).add({
    ownerId,
    title: input.title,
    description: input.description ?? null,
    status: 'active',
    createdAt: now,
    updatedAt: now,
  });

  return { id: ref.id };
});
