// C19 — Radio
// Radyo buton grubu, secenekler arasinda tek secim
import { useId } from 'react';

interface RadioOption {
  /** Secenegin degeri */
  value: string;
  /** Secenegin gorunen etiketi */
  label: string;
}

interface RadioProps {
  /** Secenek listesi */
  options: RadioOption[];
  /** Secili deger */
  value: string;
  /** Degisiklik callback'i */
  onChange: (value: string) => void;
  /** Grup adi (HTML name attribute) */
  name: string;
  /** Hata mesaji */
  error?: string;
}

export function Radio({ options, value, onChange, name, error }: RadioProps) {
  const groupId = useId();

  return (
    <div
      role="radiogroup"
      aria-labelledby={`${groupId}-label`}
      aria-describedby={error ? `${groupId}-error` : undefined}
      style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
    >
      {options.map((option) => {
        const isSelected = option.value === value;
        const optionId = `${groupId}-${option.value}`;

        return (
          <label
            key={option.value}
            htmlFor={optionId}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
            }}
          >
            {/* Ozel radyo buton gorunumu */}
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                border: `2px solid ${error ? 'var(--color-border-error)' : isSelected ? 'var(--color-interactive-primary-bg)' : 'var(--color-border-default)'}`,
                transition: 'border-color 150ms',
                flexShrink: 0,
              }}
              aria-hidden="true"
            >
              {/* Secili gostergesi */}
              {isSelected && (
                <span
                  style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--color-interactive-primary-bg)',
                  }}
                />
              )}
            </span>

            {/* Gizli native radio input — erisebilirlik icin */}
            <input
              type="radio"
              id={optionId}
              name={name}
              value={option.value}
              checked={isSelected}
              onChange={() => onChange(option.value)}
              style={{
                position: 'absolute',
                width: '1px',
                height: '1px',
                overflow: 'hidden',
                clip: 'rect(0,0,0,0)',
                whiteSpace: 'nowrap',
                border: 0,
              }}
            />

            {/* Etiket */}
            <span style={{ fontSize: '14px', color: 'var(--color-content-primary)' }}>
              {option.label}
            </span>
          </label>
        );
      })}

      {/* Hata mesaji */}
      {error && (
        <span
          id={`${groupId}-error`}
          role="alert"
          style={{ fontSize: '12px', color: 'var(--color-content-error)' }}
        >
          {error}
        </span>
      )}
    </div>
  );
}
