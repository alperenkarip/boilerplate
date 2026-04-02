// C22 — FieldShell — form alani sarmalayicisi
import { type ReactNode } from 'react';

interface FieldShellProps {
  children: ReactNode;
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  htmlFor?: string;
}

export function FieldShell({ children, label, error, hint, required, htmlFor }: FieldShellProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      {label && (
        <label
          htmlFor={htmlFor}
          style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-content-primary)' }}
        >
          {label}
          {required && (
            <span style={{ color: 'var(--color-content-error)', marginLeft: '2px' }}>*</span>
          )}
        </label>
      )}
      {children}
      {error && (
        <span role="alert" style={{ fontSize: '12px', color: 'var(--color-content-error)' }}>
          {error}
        </span>
      )}
      {hint && !error && (
        <span style={{ fontSize: '12px', color: 'var(--color-content-secondary)' }}>{hint}</span>
      )}
    </div>
  );
}
