// Sample feature — TanStack Query hooks
// Q.2.7 — Observability sinyali (analytics event)
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchSampleItems, fetchSampleItem, createSampleItem } from './api';
import { analytics } from '../../observability/analytics';
import type { SampleItem } from './types';

const QUERY_KEY = ['sample-items'] as const;

export function useSampleItems() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: fetchSampleItems,
  });
}

export function useSampleItem(id: string) {
  return useQuery({
    queryKey: [...QUERY_KEY, id],
    queryFn: () => fetchSampleItem(id),
    enabled: !!id,
  });
}

export function useCreateSampleItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<SampleItem, 'id' | 'createdAt'>) => createSampleItem(data),
    onSuccess: (newItem) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      // Q.2.7 — Observability: analytics event
      analytics.track({
        name: 'sample_item_created',
        properties: { itemId: newItem.id, status: newItem.status },
      });
    },
    onError: (error) => {
      analytics.track({ name: 'sample_item_create_failed', properties: { error: error.message } });
    },
  });
}
