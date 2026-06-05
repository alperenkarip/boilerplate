// Sample feature — veri erisim katmani (mock)
import type { SampleItem } from './types';

// Degismez kaynak (single source of truth). mockItems bundan turetilir.
const INITIAL_ITEMS: readonly SampleItem[] = [
  {
    id: '1',
    title: 'Ilk Kayit',
    description: 'Ornek aciklama metni',
    status: 'active',
    createdAt: '2026-04-01',
  },
  {
    id: '2',
    title: 'Ikinci Kayit',
    description: 'Baska bir aciklama',
    status: 'active',
    createdAt: '2026-04-02',
  },
  {
    id: '3',
    title: 'Arsivlenmis Kayit',
    description: 'Bu kayit arsivde',
    status: 'archived',
    createdAt: '2026-03-15',
  },
];

// INITIAL_ITEMS'in derin kopyasi — caller'lar orijinalleri mutate edemez.
function freshInitialItems(): SampleItem[] {
  return INITIAL_ITEMS.map((item) => ({ ...item }));
}

let mockItems: SampleItem[] = freshInitialItems();

/**
 * Mock veriyi baslangic durumuna (INITIAL_ITEMS) dondurur.
 * Test izolasyonu ve tuketiciler arasi state sizintisini onler.
 */
export function resetSampleItems(): void {
  mockItems = freshInitialItems();
}

// Fetch-style API — TanStack Query ile tuketilecek
export async function fetchSampleItems(): Promise<SampleItem[]> {
  await delay(500);
  return [...mockItems];
}

export async function fetchSampleItem(id: string): Promise<SampleItem | null> {
  await delay(300);
  return mockItems.find((item) => item.id === id) ?? null;
}

// @MX:WARN: [AUTO] Mutates module-level mutable state (mockItems.push) — shared array persists across the app session; resetSampleItems() now mitigates leakage but the mutation itself remains.
// @MX:REASON: This mock mutation still leaks state between consumers until resetSampleItems() is called; when replaced by a real API the in-memory write must be removed or it will mask server-side persistence bugs.
export async function createSampleItem(
  data: Omit<SampleItem, 'id' | 'createdAt'>,
): Promise<SampleItem> {
  await delay(400);
  const newItem: SampleItem = {
    ...data,
    id: String(Date.now()),
    createdAt: new Date().toISOString().split('T')[0]!,
  };
  mockItems.push(newItem);
  return newItem;
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
