// C33 — Banner
import { type ReactNode } from 'react';

type BannerVariant = 'success' | 'error' | 'warning' | 'info';

interface BannerProps {
  children: ReactNode;
  variant?: BannerVariant;
  onDismiss?: () => void;
}

export function Banner({ children, variant = 'info', onDismiss }: BannerProps) {
  const bgMap: Record<BannerVariant, string> = {
    success: 'var(--color-surface-success-soft)',
    error: 'var(--color-surface-error-soft)',
    warning: 'var(--color-surface-warning-soft)',
    info: 'var(--color-surface-info-soft)',
  };
  return (
    <div
      role="alert"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px 16px',
        borderRadius: '8px',
        backgroundColor: bgMap[variant],
      }}
    >
      <div style={{ flex: 1, fontSize: '14px', color: 'var(--color-content-primary)' }}>
        {children}
      </div>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Kapat"
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--color-content-secondary)',
          }}
        >
          ✕
        </button>
      )}
    </div>
  );
}
