// C15 — TextField
// @MX:ANCHOR: [AUTO] Primary text input component — used by 18+ files for all form inputs
// @MX:REASON: Core form primitive with a11y integration; prop changes affect every form screen
import { type InputHTMLAttributes, forwardRef } from 'react';

interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  hint?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(function TextField(
  { label, error, hint, size = 'md', id, style, ...rest },
  ref,
) {
  const fieldId = id ?? `field-${label?.replace(/\s/g, '-').toLowerCase()}`;
  const heights: Record<string, string> = { sm: '32px', md: '40px', lg: '48px' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      {label && (
        <label
          htmlFor={fieldId}
          style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-content-primary)' }}
        >
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={fieldId}
        aria-invalid={!!error}
        aria-describedby={error ? `${fieldId}-error` : hint ? `${fieldId}-hint` : undefined}
        style={{
          height: heights[size],
          padding: '0 12px',
          fontSize: '16px',
          borderRadius: '8px',
          border: `1px solid ${error ? 'var(--color-border-error)' : 'var(--color-border-default)'}`,
          backgroundColor: 'var(--color-surface-default)',
          color: 'var(--color-content-primary)',
          outline: 'none',
          ...style,
        }}
        {...rest}
      />
      {error && (
        <span
          id={`${fieldId}-error`}
          role="alert"
          style={{ fontSize: '12px', color: 'var(--color-content-error)' }}
        >
          {error}
        </span>
      )}
      {hint && !error && (
        <span
          id={`${fieldId}-hint`}
          style={{ fontSize: '12px', color: 'var(--color-content-secondary)' }}
        >
          {hint}
        </span>
      )}
    </div>
  );
});
