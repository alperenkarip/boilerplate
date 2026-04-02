// C05 — Inline primitive: yatay layout (gap-based)
import { type HTMLAttributes, type ReactNode } from 'react';

interface InlineProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  /** Gap (spacing token scale, *4px) */
  gap?: number;
  /** Dikey hizalama */
  align?: 'start' | 'center' | 'end' | 'baseline' | 'stretch';
  /** Yatay dagitim */
  justify?: 'start' | 'center' | 'end' | 'between';
  /** Wrap davranisi */
  wrap?: boolean;
}

export function Inline({
  children,
  gap = 2,
  align = 'center',
  justify = 'start',
  wrap = false,
  style,
  ...rest
}: InlineProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        gap: `${gap * 4}px`,
        alignItems: align === 'start' ? 'flex-start' : align === 'end' ? 'flex-end' : align,
        justifyContent:
          justify === 'between' ? 'space-between' : justify === 'end' ? 'flex-end' : justify,
        flexWrap: wrap ? 'wrap' : 'nowrap',
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}
