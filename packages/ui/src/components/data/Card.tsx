// C28 — Card
// @MX:ANCHOR: [AUTO] Content container component — used by 15+ files for grouped content display
// @MX:REASON: Primary surface component; padding/border changes affect all card-based layouts
import { type HTMLAttributes, type ReactNode } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  padding?: number;
}

export function Card({ children, padding = 4, style, ...rest }: CardProps) {
  return (
    <div
      style={{
        padding: `${padding * 4}px`,
        borderRadius: '12px',
        backgroundColor: 'var(--color-surface-elevated)',
        border: '1px solid var(--color-border-subtle)',
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}
