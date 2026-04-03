// C18.5 — Slider — Kaydirici bileseni (native HTML range input wrapper)
import { type ChangeEvent, type InputHTMLAttributes, forwardRef, useId } from 'react';

interface SliderProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type' | 'onChange' | 'value'
> {
  /** Mevcut deger */
  value?: number;
  /** Degisim handler'i */
  onChange?: (value: number) => void;
  /** Minimum deger */
  min?: number;
  /** Maksimum deger */
  max?: number;
  /** Adim buyuklugu */
  step?: number;
  /** Alan etiketi */
  label?: string;
  /** Deger gostergesi gorunur mu */
  showValue?: boolean;
}

/**
 * Slider — Native HTML range input wrapper.
 * Deger gostergesi, semantic token kullanimi ve a11y destegi icerir.
 */
export const Slider = forwardRef<HTMLInputElement, SliderProps>(function Slider(
  {
    value = 50,
    onChange,
    min = 0,
    max = 100,
    step = 1,
    label,
    showValue = true,
    id,
    disabled,
    style,
    ...rest
  },
  ref,
) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;

  /** Input degisim handler'i */
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange?.(Number((e.target as any).value));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      {/* Etiket ve deger gostergesi */}
      {(label || showValue) && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
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
          {showValue && (
            <span
              aria-live="polite"
              style={{
                fontSize: '14px',
                fontWeight: 600,
                color: 'var(--color-content-primary)',
                minWidth: '32px',
                textAlign: 'right',
              }}
            >
              {value}
            </span>
          )}
        </div>
      )}

      {/* Range input */}
      <input
        ref={ref}
        id={fieldId}
        type="range"
        value={value}
        onChange={handleChange}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-label={label}
        style={{
          width: '100%',
          height: '24px',
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.4 : 1,
          accentColor: 'var(--color-brand-primary)',
          ...style,
        }}
        {...rest}
      />

      {/* Min/Max etiketleri */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <span
          style={{
            fontSize: '12px',
            color: 'var(--color-content-secondary)',
          }}
        >
          {min}
        </span>
        <span
          style={{
            fontSize: '12px',
            color: 'var(--color-content-secondary)',
          }}
        >
          {max}
        </span>
      </div>
    </div>
  );
});
