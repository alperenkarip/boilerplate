// C37 — EmptyState
import { type ReactNode } from 'react';

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
  icon?: ReactNode;
}

export function EmptyState({ title, description, action, icon }: EmptyStateProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '12px',
        padding: '48px 24px',
        textAlign: 'center',
      }}
    >
      {icon && <div style={{ color: 'var(--color-content-tertiary)' }}>{icon}</div>}
      <h3
        style={{
          margin: 0,
          fontSize: '18px',
          fontWeight: 600,
          color: 'var(--color-content-primary)',
        }}
      >
        {title}
      </h3>
      {description && (
        <p style={{ margin: 0, fontSize: '14px', color: 'var(--color-content-secondary)' }}>
          {description}
        </p>
      )}
      {action && <div style={{ marginTop: '8px' }}>{action}</div>}
    </div>
  );
}
