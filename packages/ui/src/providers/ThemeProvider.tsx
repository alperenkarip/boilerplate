// ThemeProvider — Light/Dark tema yonetimi
// Platform-agnostik: typeof window/document kontrolu ile web/mobile uyumlu

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import { lightTheme, darkTheme, type SemanticTokenSet } from '@project/design-tokens';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextValue {
  /** Aktif tema modu */
  mode: ThemeMode;
  /** Cozumlenmis tema (system -> gercek light/dark) */
  resolvedMode: 'light' | 'dark';
  /** Aktif semantic token seti */
  tokens: SemanticTokenSet;
  /** Tema modunu degistir */
  setMode: (mode: ThemeMode) => void;
  /** Tema toggle (light <-> dark) */
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const g = typeof globalThis !== 'undefined' ? (globalThis as any) : {};

function getSystemPreference(): 'light' | 'dark' {
  if (typeof g.window !== 'undefined' && g.window.matchMedia) {
    return g.window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return 'light';
}

function resolveMode(mode: ThemeMode): 'light' | 'dark' {
  if (mode === 'system') {
    return getSystemPreference();
  }
  return mode;
}

interface ThemeProviderProps {
  children: ReactNode;
  /** Baslangic tema modu */
  defaultMode?: ThemeMode;
}

// @MX:ANCHOR: [AUTO] Theme context root — provides resolved mode + design tokens to the entire app tree
// @MX:REASON: fan_in=7; every styled subtree depends on this provider wrapping the app; context value shape is a contract
export function ThemeProvider({ children, defaultMode = 'system' }: ThemeProviderProps) {
  const [mode, setModeState] = useState<ThemeMode>(defaultMode);
  const [resolvedMode, setResolvedMode] = useState<'light' | 'dark'>(() =>
    resolveMode(defaultMode),
  );

  const setMode = useCallback((newMode: ThemeMode) => {
    setModeState(newMode);
    setResolvedMode(resolveMode(newMode));
  }, []);

  const toggle = useCallback(() => {
    setMode(resolvedMode === 'light' ? 'dark' : 'light');
  }, [resolvedMode, setMode]);

  // Sistem tercih degisikligini dinle (sadece web)
  useEffect(() => {
    if (mode !== 'system') return;
    if (typeof g.window === 'undefined' || !g.window.matchMedia) return;

    const mq = g.window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: { matches: boolean }) => {
      setResolvedMode(e.matches ? 'dark' : 'light');
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [mode]);

  // Web: data-theme attribute guncelle
  useEffect(() => {
    if (typeof g.document !== 'undefined' && g.document.documentElement) {
      g.document.documentElement.setAttribute('data-theme', resolvedMode);
    }
  }, [resolvedMode]);

  const tokens = resolvedMode === 'light' ? lightTheme : darkTheme;

  return (
    <ThemeContext.Provider value={{ mode, resolvedMode, tokens, setMode, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * Aktif tema bilgisine eris
 * ThemeProvider icerisinde kullanilmali
 */
// @MX:ANCHOR: [AUTO] Theme access hook — sole supported way to read mode/tokens/setMode/toggle from context
// @MX:REASON: fan_in=3; return-shape is a contract for consumers; throws when used outside ThemeProvider
export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme: ThemeProvider icerisinde kullanilmali');
  }
  return ctx;
}
