// C18 — Checkbox
// Isaretleme kutusu + etiket, erisebilirlik destegi
import { useId } from 'react';

interface CheckboxProps {
  /** Isaretli mi */
  checked: boolean;
  /** Degisiklik callback'i */
  onChange: (checked: boolean) => void;
  /** Etiket metni */
  label?: string;
  /** Devre disi durumu */
  isDisabled?: boolean;
  /** Hata mesaji */
  error?: string;
}

export function Checkbox({ checked, onChange, label, isDisabled = false, error }: CheckboxProps) {
  const id = useId();
  const checkboxId = `checkbox-${id}`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      <label
        htmlFor={checkboxId}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          cursor: isDisabled ? 'not-allowed' : 'pointer',
          opacity: isDisabled ? 0.4 : 1,
        }}
      >
        {/* Ozel checkbox gorunumu */}
        <span
          role="checkbox"
          aria-checked={checked}
          aria-disabled={isDisabled}
          aria-describedby={error ? `${checkboxId}-error` : undefined}
          tabIndex={isDisabled ? -1 : 0}
          onClick={() => {
            if (!isDisabled) onChange(!checked);
          }}
          onKeyDown={(e) => {
            if (e.key === ' ' || e.key === 'Enter') {
              e.preventDefault();
              if (!isDisabled) onChange(!checked);
            }
          }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '20px',
            height: '20px',
            borderRadius: '4px',
            border: `2px solid ${error ? 'var(--color-border-error)' : checked ? 'var(--color-interactive-primary-bg)' : 'var(--color-border-default)'}`,
            backgroundColor: checked ? 'var(--color-interactive-primary-bg)' : 'transparent',
            transition: 'background-color 150ms, border-color 150ms',
            flexShrink: 0,
          }}
        >
          {/* Isaret ikonu */}
          {checked && (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path
                d="M2 6L5 9L10 3"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </span>

        {/* Etiket metni */}
        {label && (
          <span style={{ fontSize: '14px', color: 'var(--color-content-primary)' }}>{label}</span>
        )}
      </label>

      {/* Hata mesaji */}
      {error && (
        <span
          id={`${checkboxId}-error`}
          role="alert"
          style={{ fontSize: '12px', color: 'var(--color-content-error)', marginLeft: '28px' }}
        >
          {error}
        </span>
      )}
    </div>
  );
}
