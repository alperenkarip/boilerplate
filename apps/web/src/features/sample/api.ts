// Sample feature — data access (ADR-020).
//
// Reads:  client SDK Firestore via DataReadPort, ALWAYS owner-scoped
//         (where ownerId == auth uid) to satisfy owner-scoped Security Rules.
// Writes: callable Cloud Functions via FunctionsCallPort. Clients never write to
//         Firestore directly (`allow write: if false`).
//
// Ordering is applied client-side (createdAt desc) to avoid requiring a
// composite Firestore index for the owner filter + sort combination.

import type { DataQuery } from '@project/core';
import { dataReadAdapter } from '../../firebase/dataReadAdapter';
import { functionsAdapter } from '../../firebase/functionsAdapter';
import { authAdapter } from '../../firebase/authAdapter';
import type {
  SampleItem,
  SampleItemRef,
  CreateSampleItemInput,
  UpdateSampleItemInput,
} from './types';

const COLLECTION = 'sampleItems';

/** Resolve the current owner uid; reads are impossible without an auth identity. */
function requireOwnerId(): string {
  const user = authAdapter.getCurrentUser();
  if (!user?.userId) {
    throw new Error('Cannot read sampleItems without an authenticated user');
  }
  return user.userId;
}

/** Owner-scoped query (Security Rules require ownerId == request.auth.uid). */
function ownerQuery(ownerId: string): DataQuery {
  return { where: [{ field: 'ownerId', op: '==', value: ownerId }] };
}

// --- Reads (client SDK Firestore) ------------------------------------------

export async function listSampleItems(): Promise<SampleItem[]> {
  const items = await dataReadAdapter.listDocs<SampleItem>(
    COLLECTION,
    ownerQuery(requireOwnerId()),
  );
  // Newest first; createdAt is an ISO string so lexical compare is chronological.
  return items.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function getSampleItem(id: string): Promise<SampleItem | null> {
  return dataReadAdapter.getDocById<SampleItem>(COLLECTION, id);
}

// --- Writes (callable Cloud Functions) -------------------------------------

export function createSampleItem(input: CreateSampleItemInput): Promise<SampleItemRef> {
  return functionsAdapter.call<CreateSampleItemInput, SampleItemRef>('createSampleItem', input);
}

export function updateSampleItem(input: UpdateSampleItemInput): Promise<SampleItemRef> {
  return functionsAdapter.call<UpdateSampleItemInput, SampleItemRef>('updateSampleItem', input);
}

export function deleteSampleItem(id: string): Promise<SampleItemRef> {
  return functionsAdapter.call<{ id: string }, SampleItemRef>('deleteSampleItem', { id });
}
