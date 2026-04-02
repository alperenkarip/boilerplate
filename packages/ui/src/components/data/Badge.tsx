// C26 — Badge
import { type ReactNode } from 'react';

type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'info';

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
}

const bgMap: Record<BadgeVariant, string> = {
  default: 'var(--color-surface-subtle)',
  success: 'var(--color-surface-success-soft)',
  warning: 'var(--color-surface-warning-soft)',
  error: 'var(--color-surface-error-soft)',
  info: 'var(--color-surface-info-soft)',
};
const fgMap: Record<BadgeVariant, string> = {
  default: 'var(--color-content-secondary)',
  success: 'var(--color-content-success)',
  warning: 'var(--color-content-warning)',
  error: 'var(--color-content-error)',
  info: 'var(--color-content-info)',
};

export function Badge({ children, variant = 'default' }: BadgeProps) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '2px 8px',
        borderRadius: '9999px',
        fontSize: '12px',
        fontWeight: 500,
        backgroundColor: bgMap[variant],
        color: fgMap[variant],
      }}
    >
      {children}
    </span>
  );
}
