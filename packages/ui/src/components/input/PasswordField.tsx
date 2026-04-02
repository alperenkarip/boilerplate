// C18.6 — PasswordField — Sifre giris alani, goster/gizle toggle destegi
import { type InputHTMLAttributes, forwardRef, useState, useId } from 'react';

interface PasswordFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /** Alan etiketi */
  label?: string;
  /** Hata mesaji */
  error?: string;
  /** Yardimci metin */
  hint?: string;
  /** Goster/gizle toggle gosterilsin mi */
  showToggle?: boolean;
  /** Autofill hint tipi */
  autoComplete?: 'current-password' | 'new-password';
}

/**
 * PasswordField — TextField uzerine kurulu, sifre girisine ozel bilesen.
 * Show/hide toggle (goz ikonu) ve password manager autofill destegi icerir.
 */
export const PasswordField = forwardRef<HTMLInputElement, PasswordFieldProps>(
  function PasswordField(
    {
      label,
      error,
      hint,
      showToggle = true,
      autoComplete = 'current-password',
      id,
      style,
      disabled,
      ...rest
    },
    ref,
  ) {
    const generatedId = useId();
    const fieldId = id ?? generatedId;
    const [visible, setVisible] = useState(false);

    /** Toggle butonuna tiklandiginda sifre gorunurlugunu degistir */
    const handleToggle = () => {
      setVisible((prev) => !prev);
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
        <div
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <input
            ref={ref}
            id={fieldId}
            type={visible ? 'text' : 'password'}
            autoComplete={autoComplete}
            disabled={disabled}
            aria-invalid={!!error}
            aria-describedby={error ? `${fieldId}-error` : hint ? `${fieldId}-hint` : undefined}
            style={{
              width: '100%',
              height: '40px',
              padding: showToggle ? '0 40px 0 12px' : '0 12px',
              fontSize: '16px',
              borderRadius: '8px',
              border: `1px solid ${error ? 'var(--color-border-error)' : 'var(--color-border-default)'}`,
              backgroundColor: 'var(--color-surface-default)',
              color: 'var(--color-content-primary)',
              outline: 'none',
              opacity: disabled ? 0.4 : 1,
              cursor: disabled ? 'not-allowed' : 'text',
              ...style,
            }}
            {...rest}
          />
          {showToggle && (
            <button
              type="button"
              aria-label={visible ? 'Sifreyi gizle' : 'Sifreyi goster'}
              onClick={handleToggle}
              disabled={disabled}
              style={{
                position: 'absolute',
                right: '0px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: '44px',
                minHeight: '44px',
                padding: 0,
                border: 'none',
                borderRadius: '4px',
                backgroundColor: 'transparent',
                color: 'var(--color-content-secondary)',
                cursor: disabled ? 'not-allowed' : 'pointer',
                fontSize: '14px',
              }}
            >
              {/* Goz ikonu — SVG yerine metin tabanli gosterim */}
              {visible ? '◉' : '◎'}
            </button>
          )}
        </div>
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
  },
);
