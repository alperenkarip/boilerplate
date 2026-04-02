// CSS custom properties uretici
// Semantic token'lari CSS degiskenlerine donusturur
import type { SemanticTokenSet } from './semantic/types';

type FlatTokens = Record<string, string>;

function flattenTokens(tokens: SemanticTokenSet, prefix = 'color'): FlatTokens {
  const result: FlatTokens = {};

  for (const [category, values] of Object.entries(tokens)) {
    for (const [key, value] of Object.entries(values as Record<string, string>)) {
      const cssVar = `--${prefix}-${category}-${camelToKebab(key)}`;
      result[cssVar] = value;
    }
  }

  return result;
}

function camelToKebab(str: string): string {
  return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

/**
 * Semantic token'lari CSS custom property formatinda uretir
 */
export function generateCSSVariables(tokens: SemanticTokenSet): string {
  const flat = flattenTokens(tokens);
  return Object.entries(flat)
    .map(([key, value]) => `  ${key}: ${value};`)
    .join('\n');
}

export { flattenTokens };
