// Sample feature — TanStack Query hooks.
//
// Reads use one-shot queries against the Firestore read adapter; writes use
// callable Cloud Functions. The realtime alternative (dataReadAdapter.subscribeList)
// is available if live updates are needed. Query keys + invalidation are
// preserved from the previous mock implementation.
// Q.2.7 — Observability signal (analytics event).
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  listSampleItems,
  getSampleItem,
  createSampleItem,
  updateSampleItem,
  deleteSampleItem,
} from './api';
import { analytics } from '../../observability/analytics';
import type { CreateSampleItemInput, UpdateSampleItemInput } from './types';

const QUERY_KEY = ['sample-items'] as const;

export function useSampleItems() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: listSampleItems,
  });
}

export function useSampleItem(id: string) {
  return useQuery({
    queryKey: [...QUERY_KEY, id],
    queryFn: () => getSampleItem(id),
    enabled: !!id,
  });
}

export function useCreateSampleItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateSampleItemInput) => createSampleItem(input),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      // Q.2.7 — Observability: analytics event
      analytics.track({ name: 'sample_item_created', properties: { itemId: result.id } });
    },
    onError: (error) => {
      analytics.track({ name: 'sample_item_create_failed', properties: { error: error.message } });
    },
  });
}

export function useUpdateSampleItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateSampleItemInput) => updateSampleItem(input),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: [...QUERY_KEY, result.id] });
    },
  });
}

export function useDeleteSampleItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteSampleItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
}
