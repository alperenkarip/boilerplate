// Sample CRUD feature — domain tipleri + tipli callable sarmalayicilari (ADR-020).
//
// Okuma: dataReadAdapter (client SDK, owner-scoped, onSnapshot).
// Yazma: yalnizca callable Cloud Functions (functionsAdapter); client direct-write yok.

import type { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { functionsAdapter } from './functionsAdapter';

/** Firestore collection adi — owner-scoped okumalar (ownerId == uid). */
export const SAMPLE_ITEMS_COLLECTION = 'sampleItems';

export type SampleItemStatus = 'active' | 'archived';

/** Bir sample item dokumani (Firestore `sampleItems` collection). */
export interface SampleItem {
  id: string;
  ownerId: string;
  title: string;
  description: string | null;
  status: SampleItemStatus;
  createdAt?: FirebaseFirestoreTypes.Timestamp;
  updatedAt?: FirebaseFirestoreTypes.Timestamp;
}

// --- Callable giris/cikis sozlesmeleri (functions/ tarafiyla hizali) ---

export interface CreateSampleItemInput {
  title: string;
  description?: string;
}

export interface UpdateSampleItemInput {
  id: string;
  title?: string;
  description?: string;
  status?: SampleItemStatus;
}

export interface SampleItemMutationResult {
  id: string;
}

/** createSampleItem callable — yeni kayit olusturur, id doner. */
export function createSampleItem(input: CreateSampleItemInput): Promise<SampleItemMutationResult> {
  return functionsAdapter.call<CreateSampleItemInput, SampleItemMutationResult>(
    'createSampleItem',
    input,
  );
}

/** updateSampleItem callable — mevcut kaydi gunceller, id doner. */
export function updateSampleItem(input: UpdateSampleItemInput): Promise<SampleItemMutationResult> {
  return functionsAdapter.call<UpdateSampleItemInput, SampleItemMutationResult>(
    'updateSampleItem',
    input,
  );
}

/** deleteSampleItem callable — kaydi siler, id doner. */
export function deleteSampleItem(input: { id: string }): Promise<SampleItemMutationResult> {
  return functionsAdapter.call<{ id: string }, SampleItemMutationResult>('deleteSampleItem', input);
}

/** Firestore Timestamp'i okunabilir tarihe cevirir (UI yardimcisi). */
export function formatTimestamp(value: FirebaseFirestoreTypes.Timestamp | undefined): string {
  if (value === undefined) return '-';
  return value.toDate().toLocaleString();
}
