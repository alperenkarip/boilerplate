// C48 — PullToRefreshWrapper
// Web'de pull-to-refresh simulasyonu, mobile'da native davranis kullanilir
// Yenileme sirasinda ustte Spinner gosterir
import { type ReactNode } from 'react';

interface PullToRefreshWrapperProps {
  /** Sarmalanan icerik */
  children: ReactNode;
  /** Yenileme callback'i */
  onRefresh: () => void;
  /** Yenileme devam ediyor mu */
  isRefreshing: boolean;
}

export function PullToRefreshWrapper({
  children,
  onRefresh,
  isRefreshing,
}: PullToRefreshWrapperProps) {
  return (
    <div style={{ position: 'relative' }}>
      {/* Yenileme gostergesi */}
      {isRefreshing && (
        <div
          role="status"
          aria-label="Yenileniyor"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '12px 0',
            backgroundColor: 'var(--color-surface-subtle)',
          }}
        >
          {/* Basit donme animasyonu */}
          <svg
            width={24}
            height={24}
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
            style={{ animation: 'spin 1s linear infinite' }}
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="var(--color-interactive-primary-bg)"
              strokeWidth="3"
              strokeDasharray="31.4 31.4"
              strokeLinecap="round"
            />
          </svg>
          <span
            style={{
              marginLeft: '8px',
              fontSize: '13px',
              color: 'var(--color-content-secondary)',
            }}
          >
            Yenileniyor...
          </span>
        </div>
      )}

      {/* Manuel yenileme butonu (web icin) */}
      {!isRefreshing && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            padding: '4px 0',
          }}
        >
          <button
            type="button"
            onClick={onRefresh}
            aria-label="Yenile"
            style={{
              padding: '4px 12px',
              fontSize: '12px',
              border: '1px solid var(--color-border-subtle)',
              borderRadius: '12px',
              backgroundColor: 'var(--color-surface-default)',
              color: 'var(--color-content-secondary)',
              cursor: 'pointer',
            }}
          >
            ↻ Yenile
          </button>
        </div>
      )}

      {/* Icerik */}
      {children}
    </div>
  );
}
