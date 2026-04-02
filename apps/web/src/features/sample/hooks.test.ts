// Query/state/form davranis testi (P.2 done kriteri)
import { describe, it, expect, vi } from 'vitest';
import { fetchSampleItems, fetchSampleItem, createSampleItem } from './api';

describe('Sample API', () => {
  it('fetchSampleItems mock veri dondurur', async () => {
    const items = await fetchSampleItems();
    expect(items.length).toBeGreaterThan(0);
    expect(items[0]).toHaveProperty('id');
    expect(items[0]).toHaveProperty('title');
    expect(items[0]).toHaveProperty('status');
  });

  it('fetchSampleItem id ile tek kayit dondurur', async () => {
    const item = await fetchSampleItem('1');
    expect(item).not.toBeNull();
    expect(item?.id).toBe('1');
  });

  it('fetchSampleItem olmayan id icin null dondurur', async () => {
    const item = await fetchSampleItem('non-existent');
    expect(item).toBeNull();
  });

  it('createSampleItem yeni kayit olusturur', async () => {
    const newItem = await createSampleItem({
      title: 'Test Kayit',
      description: 'Test aciklama',
      status: 'active',
    });
    expect(newItem.id).toBeTruthy();
    expect(newItem.title).toBe('Test Kayit');
  });
});
