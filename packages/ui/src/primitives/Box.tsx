// C03 — Box primitive: generic container
import { type HTMLAttributes, type ReactNode } from 'react';

interface BoxProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  as?: 'div' | 'section' | 'article' | 'aside' | 'main' | 'nav' | 'header' | 'footer';
  /** Semantic surface rengi */
  surface?: 'default' | 'subtle' | 'elevated' | 'sunken' | 'inverse';
  /** Border */
  bordered?: boolean;
  /** Padding (spacing token scale) */
  padding?: number;
  /** Border radius */
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

export function Box({
  children,
  as: Tag = 'div',
  surface,
  bordered = false,
  padding,
  rounded,
  style,
  ...rest
}: BoxProps) {
  return (
    <Tag
      style={{
        ...(surface ? { backgroundColor: `var(--color-surface-${surface})` } : {}),
        ...(bordered ? { border: '1px solid var(--color-border-default)' } : {}),
        ...(padding !== undefined ? { padding: `${padding * 4}px` } : {}),
        ...(rounded ? { borderRadius: radiusMap[rounded] } : {}),
        ...style,
      }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

const radiusMap: Record<string, string> = {
  none: '0px',
  sm: '4px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  full: '9999px',
};
