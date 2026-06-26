// Sample API tests — owner-scoped Firestore reads + callable Cloud Function writes.
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { AuthSummary } from '@project/core';
import type { SampleItem } from './types';

// Mock the firebase port adapters (no real SDK).
vi.mock('../../firebase/dataReadAdapter', () => ({
  dataReadAdapter: {
    listDocs: vi.fn(),
    getDocById: vi.fn(),
    subscribeList: vi.fn(),
    subscribeDocById: vi.fn(),
  },
}));
vi.mock('../../firebase/functionsAdapter', () => ({
  functionsAdapter: { call: vi.fn() },
}));
vi.mock('../../firebase/authAdapter', () => ({
  authAdapter: { getCurrentUser: vi.fn() },
}));

import {
  listSampleItems,
  getSampleItem,
  createSampleItem,
  updateSampleItem,
  deleteSampleItem,
} from './api';
import { dataReadAdapter } from '../../firebase/dataReadAdapter';
import { functionsAdapter } from '../../firebase/functionsAdapter';
import { authAdapter } from '../../firebase/authAdapter';

function makeItem(id: string, createdAt: string): SampleItem {
  return {
    id,
    ownerId: 'u1',
    title: `Item ${id}`,
    description: null,
    status: 'active',
    createdAt,
    updatedAt: createdAt,
  };
}

const SIGNED_IN: AuthSummary = { status: 'authenticated', userId: 'u1', displayName: null };

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(authAdapter.getCurrentUser).mockReturnValue(SIGNED_IN);
});

describe('sample api reads (owner-scoped Firestore via DataReadPort)', () => {
  it('listSampleItems queries with ownerId == current uid and sorts newest first', async () => {
    const older = makeItem('1', '2026-04-01T00:00:00.000Z');
    const newer = makeItem('2', '2026-04-05T00:00:00.000Z');
    vi.mocked(dataReadAdapter.listDocs).mockResolvedValue([older, newer]);

    const result = await listSampleItems();

    expect(dataReadAdapter.listDocs).toHaveBeenCalledWith('sampleItems', {
      where: [{ field: 'ownerId', op: '==', value: 'u1' }],
    });
    expect(result.map((item) => item.id)).toEqual(['2', '1']);
  });

  it('listSampleItems throws when unauthenticated (no owner scope possible)', async () => {
    vi.mocked(authAdapter.getCurrentUser).mockReturnValue(null);

    await expect(listSampleItems()).rejects.toThrow();
    expect(dataReadAdapter.listDocs).not.toHaveBeenCalled();
  });

  it('getSampleItem reads a single document by id', async () => {
    const item = makeItem('1', '2026-04-01T00:00:00.000Z');
    vi.mocked(dataReadAdapter.getDocById).mockResolvedValue(item);

    const result = await getSampleItem('1');

    expect(dataReadAdapter.getDocById).toHaveBeenCalledWith('sampleItems', '1');
    expect(result).toEqual(item);
  });
});

describe('sample api writes (callable Cloud Functions via FunctionsCallPort)', () => {
  it('createSampleItem invokes the createSampleItem callable', async () => {
    vi.mocked(functionsAdapter.call).mockResolvedValue({ id: 'new' });

    const result = await createSampleItem({ title: 'New', description: 'desc' });

    expect(functionsAdapter.call).toHaveBeenCalledWith('createSampleItem', {
      title: 'New',
      description: 'desc',
    });
    expect(result).toEqual({ id: 'new' });
  });

  it('updateSampleItem invokes the updateSampleItem callable', async () => {
    vi.mocked(functionsAdapter.call).mockResolvedValue({ id: '1' });

    await updateSampleItem({ id: '1', status: 'archived' });

    expect(functionsAdapter.call).toHaveBeenCalledWith('updateSampleItem', {
      id: '1',
      status: 'archived',
    });
  });

  it('deleteSampleItem invokes the deleteSampleItem callable', async () => {
    vi.mocked(functionsAdapter.call).mockResolvedValue({ id: '1' });

    await deleteSampleItem('1');

    expect(functionsAdapter.call).toHaveBeenCalledWith('deleteSampleItem', { id: '1' });
  });
});
