// C18.1 — DatePicker — Tarih secici bileseni (native HTML date input wrapper)
import { type InputHTMLAttributes, forwardRef, useId } from 'react';

interface DatePickerProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  /** Alan etiketi */
  label?: string;
  /** Mevcut deger (YYYY-MM-DD formati) */
  value?: string;
  /** Degisim handler'i */
  onChange?: (value: string) => void;
  /** Hata mesaji */
  error?: string;
  /** Minimum tarih (YYYY-MM-DD) */
  min?: string;
  /** Maksimum tarih (YYYY-MM-DD) */
  max?: string;
}

/**
 * DatePicker — Native HTML date input wrapper.
 * FieldShell pattern'ine uygun: label + error gosterimi.
 * forwardRef ile ref destegi saglar.
 */
export const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>(function DatePicker(
  { label, value, onChange, error, min, max, id, style, disabled, ...rest },
  ref,
) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;

  /** Input degisim handler'i */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.value);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      {label && (
        <label
          htmlFor={fieldId}
          style={{
            fontSize: '14px',
            fontWeight: 500,
            color: 'var(--color-content-primary)',
          }}
        >
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={fieldId}
        type="date"
        value={value}
        onChange={handleChange}
        min={min}
        max={max}
        disabled={disabled}
        aria-invalid={!!error}
        aria-describedby={error ? `${fieldId}-error` : undefined}
        style={{
          height: '40px',
          padding: '0 12px',
          fontSize: '16px',
          borderRadius: '8px',
          border: `1px solid ${error ? 'var(--color-border-error)' : 'var(--color-border-default)'}`,
          backgroundColor: 'var(--color-surface-default)',
          color: 'var(--color-content-primary)',
          outline: 'none',
          opacity: disabled ? 0.4 : 1,
          cursor: disabled ? 'not-allowed' : 'pointer',
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
    </div>
  );
});
