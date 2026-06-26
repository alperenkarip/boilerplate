// Sample feature — data model.
//
// SampleItem mirrors the Firestore `sampleItems` document shape (ADR-020 read
// model). `id` is the document id; `createdAt`/`updatedAt` are ISO strings
// (Firestore Timestamps are normalized to ISO by the read adapter).
export type SampleItemStatus = 'active' | 'archived';

export interface SampleItem {
  id: string;
  ownerId: string;
  title: string;
  description: string | null;
  status: SampleItemStatus;
  createdAt: string;
  updatedAt: string;
}

// Callable write inputs (ADR-020 canonical write path via Cloud Functions).
// createSampleItem({ title, description? }) -> { id }
export interface CreateSampleItemInput {
  title: string;
  description?: string | null;
}

// updateSampleItem({ id, title?, description?, status? }) -> { id }
export interface UpdateSampleItemInput {
  id: string;
  title?: string;
  description?: string | null;
  status?: SampleItemStatus;
}

/** Shape returned by the create/update/delete callables. */
export interface SampleItemRef {
  id: string;
}
