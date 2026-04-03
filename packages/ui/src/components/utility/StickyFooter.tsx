// C50 — StickyFooter
// Sayfa altina yapisan footer, position: sticky kullanir
import { type ReactNode } from 'react';

interface StickyFooterProps {
  /** Footer icerigi */
  children: ReactNode;
}

export function StickyFooter({ children }: StickyFooterProps) {
  return (
    <footer
      style={{
        position: 'sticky',
        bottom: 0,
        zIndex: 10,
        padding: '12px 16px',
        backgroundColor: 'var(--color-surface-default)',
        borderTop: '1px solid var(--color-border-subtle)',
      }}
    >
      {children}
    </footer>
  );
}
