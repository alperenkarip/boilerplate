// H.1.5 — NativeWind 5.x token consumption strategy
// H.1.6 — Semantic token mapping mobile runtime'a
// H.1.8 — Light/dark switching mobile shell'de
//
// NativeWind 5.x candidate track (ADR-007).
// Release status Faz J oncesinde dogrulanmali.
// Pre-release ise fallback karari acilir (PDR-001).
//
// Strateji:
// 1. NativeWind 5.x CSS variable destegi kullanilir
// 2. design-tokens paketindeki ayni CSS variables mobile'da da gecerli
// 3. ThemeProvider resolvedMode'a gore NativeWind tema degistirir
// 4. userInterfaceStyle: "automatic" (app.json'da ayarli)

import { lightTheme, darkTheme, type SemanticTokenSet } from '@project/design-tokens';

/**
 * Aktif temanin token'larini dondurur.
 * NativeWind kurulmadan once JS sabitleri olarak tuketilebilir.
 */
export function getThemeTokens(mode: 'light' | 'dark'): SemanticTokenSet {
  return mode === 'light' ? lightTheme : darkTheme;
}

/**
 * NativeWind theme config ornegi (install sonrasi).
 *
 * // tailwind.config.js (mobile)
 * module.exports = {
 *   theme: {
 *     extend: {
 *       colors: {
 *         content: {
 *           primary: 'var(--color-content-primary)',
 *           secondary: 'var(--color-content-secondary)',
 *         },
 *         surface: {
 *           default: 'var(--color-surface-default)',
 *           subtle: 'var(--color-surface-subtle)',
 *         },
 *       },
 *     },
 *   },
 * };
 */
