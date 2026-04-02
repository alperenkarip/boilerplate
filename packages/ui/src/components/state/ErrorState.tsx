// C38 — ErrorState
import { type ReactNode } from 'react';

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  action?: ReactNode;
}

export function ErrorState({
  title = 'Bir hata olustu',
  message,
  onRetry,
  action,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '12px',
        padding: '48px 24px',
        textAlign: 'center',
      }}
    >
      <h3
        style={{
          margin: 0,
          fontSize: '18px',
          fontWeight: 600,
          color: 'var(--color-content-error)',
        }}
      >
        {title}
      </h3>
      <p style={{ margin: 0, fontSize: '14px', color: 'var(--color-content-secondary)' }}>
        {message}
      </p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          style={{
            padding: '8px 16px',
            borderRadius: '8px',
            border: '1px solid var(--color-border-default)',
            background: 'var(--color-surface-default)',
            cursor: 'pointer',
            color: 'var(--color-content-primary)',
          }}
        >
          Tekrar Dene
        </button>
      )}
      {action}
    </div>
  );
}
