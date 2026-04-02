// Typography scale — font aileleri, boyutlar, agirliklar

export const fontFamily = {
  sans: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  mono: '"SF Mono", "Fira Code", "Fira Mono", "Roboto Mono", monospace',
} as const;

export const fontSize = {
  xs: '12px',
  sm: '14px',
  base: '16px',
  lg: '18px',
  xl: '20px',
  '2xl': '24px',
  '3xl': '30px',
  '4xl': '36px',
} as const;

export const fontWeight = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
} as const;

export const lineHeight = {
  tight: '1.25',
  normal: '1.5',
  relaxed: '1.625',
} as const;

export const letterSpacing = {
  tight: '-0.025em',
  normal: '0em',
  wide: '0.025em',
} as const;
