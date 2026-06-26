// Sample hooks tests — TanStack Query reads/mutations over the mocked api layer.
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createElement, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import type { SampleItem } from './types';

vi.mock('./api', () => ({
  listSampleItems: vi.fn(),
  getSampleItem: vi.fn(),
  createSampleItem: vi.fn(),
  updateSampleItem: vi.fn(),
  deleteSampleItem: vi.fn(),
}));

import { useSampleItems, useSampleItem, useCreateSampleItem } from './hooks';
import { listSampleItems, getSampleItem, createSampleItem } from './api';

const ITEM: SampleItem = {
  id: '1',
  ownerId: 'u1',
  title: 'A',
  description: null,
  status: 'active',
  createdAt: '2026-04-01T00:00:00.000Z',
  updatedAt: '2026-04-01T00:00:00.000Z',
};

function makeWrapper() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return function Wrapper({ children }: { children: ReactNode }) {
    return createElement(QueryClientProvider, { client: queryClient }, children);
  };
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe('sample hooks', () => {
  it('useSampleItems returns data from listSampleItems', async () => {
    vi.mocked(listSampleItems).mockResolvedValue([ITEM]);

    const { result } = renderHook(() => useSampleItems(), { wrapper: makeWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual([ITEM]);
  });

  it('useSampleItem reads a single item by id', async () => {
    vi.mocked(getSampleItem).mockResolvedValue(ITEM);

    const { result } = renderHook(() => useSampleItem('1'), { wrapper: makeWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(ITEM);
  });

  it('useCreateSampleItem calls createSampleItem and resolves with the new id', async () => {
    vi.mocked(createSampleItem).mockResolvedValue({ id: 'new' });

    const { result } = renderHook(() => useCreateSampleItem(), { wrapper: makeWrapper() });
    const created = await result.current.mutateAsync({ title: 'New', description: 'desc' });

    expect(createSampleItem).toHaveBeenCalledWith({ title: 'New', description: 'desc' });
    expect(created).toEqual({ id: 'new' });
  });
});
