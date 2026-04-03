// C23 — FormGroup
// Form alanlarini gruplayan container, fieldset + legend semantigi
import { type ReactNode } from 'react';

interface FormGroupProps {
  /** Grup icerigi (form alanlari) */
  children: ReactNode;
  /** Grup etiketi (legend olarak gosterilir) */
  label?: string;
  /** Grup seviyesinde hata mesaji */
  error?: string;
}

export function FormGroup({ children, label, error }: FormGroupProps) {
  return (
    <fieldset
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        border: '1px solid var(--color-border-subtle)',
        borderRadius: '8px',
        padding: '16px',
        margin: 0,
      }}
    >
      {/* Grup basligi */}
      {label && (
        <legend
          style={{
            fontSize: '14px',
            fontWeight: 600,
            color: 'var(--color-content-primary)',
            padding: '0 4px',
          }}
        >
          {label}
        </legend>
      )}

      {/* Grup icerigi */}
      {children}

      {/* Grup seviyesi hata mesaji */}
      {error && (
        <span role="alert" style={{ fontSize: '12px', color: 'var(--color-content-error)' }}>
          {error}
        </span>
      )}
    </fieldset>
  );
}
