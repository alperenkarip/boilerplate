// Sample API mock state izolasyon testi — resetSampleItems ile state sizintisi onleme
import { describe, it, expect, afterEach } from 'vitest';
import { fetchSampleItems, createSampleItem, resetSampleItems } from './api';

afterEach(() => {
  // Her testten sonra mock veriyi baslangic durumuna dondur (test izolasyonu)
  resetSampleItems();
});

describe('sample api mock state', () => {
  it('createSampleItem sonrasi liste buyur, resetSampleItems ile orijinal 3 kayda doner', async () => {
    const initial = await fetchSampleItems();
    expect(initial).toHaveLength(3);

    await createSampleItem({ title: 'Yeni Kayit', description: 'aciklama', status: 'active' });

    const afterCreate = await fetchSampleItems();
    expect(afterCreate).toHaveLength(4);

    resetSampleItems();

    const afterReset = await fetchSampleItems();
    expect(afterReset).toHaveLength(3);
  });

  it('resetSampleItems derin kopya dondurur — caller orijinalleri mutate edemez', async () => {
    const items = await fetchSampleItems();
    items[0]!.title = 'MUTATED';

    resetSampleItems();
    const fresh = await fetchSampleItems();

    expect(fresh[0]!.title).not.toBe('MUTATED');
  });
});
