// M.2.1 — Zustand + MMKV persist middleware (ADR-019)
// M.2.2 — Version & migration lifecycle
// M.2.3 — onRehydrateStorage hook
//
// partialize ZORUNLU — store'un tamami degil, yalnizca kalici alanlar persist edilir.
// Auth token'lari MMKV'ye YAZILMAZ → SecureStore'a gider.

import { type StateCreator } from 'zustand';
import { persist, createJSONStorage, type PersistOptions } from 'zustand/middleware';
import { plainStorage } from '../storage/mmkv';

/**
 * Zustand store'a MMKV persist ekler.
 * M.2.1 — partialize zorunlu
 * M.2.2 — version + migrate lifecycle
 * M.2.3 — onRehydrateStorage hook
 */
export function createPersistedStore<T extends object>(
  name: string,
  version: number,
  initializer: StateCreator<T, [['zustand/persist', unknown]]>,
  options: {
    /** Hangi alanlar persist edilecek — tum store YASAK */
    partialize: (state: T) => Partial<T>;
    /** Eski versiyon → yeni versiyon migration */
    migrate?: (persistedState: unknown, version: number) => T;
    /** Rehydration tamamlandiginda callback */
    onRehydrateStorage?: (state: T) => void;
  },
) {
  const persistOptions: PersistOptions<T, Partial<T>> = {
    name,
    version,
    storage: createJSONStorage(() => ({
      getItem: (key) => plainStorage.getItem(key),
      setItem: (key, value) => plainStorage.setItem(key, value),
      removeItem: (key) => plainStorage.removeItem(key),
    })),
    partialize: options.partialize,
    migrate: options.migrate as PersistOptions<T, Partial<T>>['migrate'],
    onRehydrateStorage: options.onRehydrateStorage
      ? () => (state) => {
          if (state) options.onRehydrateStorage!(state);
        }
      : undefined,
  };

  return persist(initializer, persistOptions);
}

/**
 * Ornek: Tema store'u persist ile
 *
 * const useThemeStore = create(
 *   createPersistedStore('theme', 1,
 *     (set) => ({ mode: 'system' as const, setMode: (m) => set({ mode: m }) }),
 *     {
 *       partialize: (state) => ({ mode: state.mode }), // sadece mode persist
 *     },
 *   ),
 * );
 *
 * YASAK PATTERN:
 * partialize: (state) => state  // tum store persist — ASLA YAPMA
 *
 * Ephemeral state (modal acik/kapali, hover, scroll position) persist EDILMEZ.
 * Auth token'lari MMKV'ye YAZILMAZ.
 */
