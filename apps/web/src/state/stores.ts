// App-global Zustand stores (Faz M)
// Local-first yaklasim — server state buraya kopyalanmaz

import { create } from 'zustand';

// Tema/gorunum store
interface AppearanceState {
  density: 'comfortable' | 'compact';
  setDensity: (density: 'comfortable' | 'compact') => void;
}

export const useAppearanceStore = create<AppearanceState>((set) => ({
  density: 'comfortable',
  setDensity: (density) => set({ density }),
}));

// Locale/dil store
interface LocaleState {
  locale: string;
  setLocale: (locale: string) => void;
}

export const useLocaleStore = create<LocaleState>((set) => ({
  locale: 'tr',
  setLocale: (locale) => set({ locale }),
}));
