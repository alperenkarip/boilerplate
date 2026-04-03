// C16 — TextArea
// Cok satirli metin girdisi, label + error + hint destegi
import { type TextareaHTMLAttributes, forwardRef } from 'react';

interface TextAreaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'children'> {
  /** Alan etiketi */
  label?: string;
  /** Hata mesaji */
  error?: string;
  /** Yardimci metin */
  hint?: string;
  /** Gorunur satir sayisi */
  rows?: number;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(function TextArea(
  { label, error, hint, rows = 4, placeholder, id, style, ...rest },
  ref,
) {
  const fieldId = id ?? `textarea-${label?.replace(/\s/g, '-').toLowerCase()}`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      {/* Etiket */}
      {label && (
        <label
          htmlFor={fieldId}
          style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-content-primary)' }}
        >
          {label}
        </label>
      )}

      {/* Textarea alani */}
      <textarea
        ref={ref}
        id={fieldId}
        rows={rows}
        placeholder={placeholder}
        aria-invalid={!!error}
        aria-describedby={error ? `${fieldId}-error` : hint ? `${fieldId}-hint` : undefined}
        style={{
          padding: '8px 12px',
          fontSize: '16px',
          lineHeight: 1.5,
          borderRadius: '8px',
          border: `1px solid ${error ? 'var(--color-border-error)' : 'var(--color-border-default)'}`,
          backgroundColor: 'var(--color-surface-default)',
          color: 'var(--color-content-primary)',
          outline: 'none',
          resize: 'vertical',
          fontFamily: 'inherit',
          ...style,
        }}
        {...rest}
      />

      {/* Hata mesaji */}
      {error && (
        <span
          id={`${fieldId}-error`}
          role="alert"
          style={{ fontSize: '12px', color: 'var(--color-content-error)' }}
        >
          {error}
        </span>
      )}

      {/* Yardimci metin */}
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
