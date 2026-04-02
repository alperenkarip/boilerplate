// C32 — Toast
import { type ReactNode } from 'react';

type ToastVariant = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  message: string;
  variant?: ToastVariant;
  action?: ReactNode;
  onDismiss?: () => void;
}

const variantColors: Record<ToastVariant, { bg: string; border: string }> = {
  success: { bg: 'var(--color-surface-success-soft)', border: 'var(--color-border-success)' },
  error: { bg: 'var(--color-surface-error-soft)', border: 'var(--color-border-error)' },
  warning: { bg: 'var(--color-surface-warning-soft)', border: 'var(--color-border-warning)' },
  info: { bg: 'var(--color-surface-info-soft)', border: 'var(--color-border-focus)' },
};

export function Toast({ message, variant = 'info', action, onDismiss }: ToastProps) {
  const c = variantColors[variant];
  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px 16px',
        borderRadius: '8px',
        borderLeft: `3px solid ${c.border}`,
        backgroundColor: c.bg,
        fontSize: '14px',
        color: 'var(--color-content-primary)',
      }}
    >
      <span style={{ flex: 1 }}>{message}</span>
      {action}
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Kapat"
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '4px',
            color: 'var(--color-content-secondary)',
          }}
        >
          ✕
        </button>
      )}
    </div>
  );
}
