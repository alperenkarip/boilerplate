// C10 — ScrollContainer primitive: scroll sarmalayici
import { type HTMLAttributes, type ReactNode } from 'react';

interface ScrollContainerProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  /** Scroll yonu */
  direction?: 'vertical' | 'horizontal' | 'both';
  /** Maks yukseklik */
  maxHeight?: string | number;
}

export function ScrollContainer({
  children,
  direction = 'vertical',
  maxHeight,
  style,
  ...rest
}: ScrollContainerProps) {
  return (
    <div
      style={{
        overflowX: direction === 'horizontal' || direction === 'both' ? 'auto' : 'hidden',
        overflowY: direction === 'vertical' || direction === 'both' ? 'auto' : 'hidden',
        WebkitOverflowScrolling: 'touch',
        ...(maxHeight !== undefined ? { maxHeight } : {}),
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}
