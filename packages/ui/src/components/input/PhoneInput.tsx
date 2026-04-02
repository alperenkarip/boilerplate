// C18.7 — PhoneInput — Ulke kodu secici + telefon numarasi giris alani
import { type ChangeEvent, useId } from 'react';

/** Ulke kodu secenegi */
interface CountryOption {
  code: string;
  dialCode: string;
  label: string;
}

/** PhoneInput deger tipi */
interface PhoneValue {
  countryCode: string;
  number: string;
}

interface PhoneInputProps {
  /** Mevcut deger */
  value?: PhoneValue;
  /** Degisim handler'i */
  onChange?: (value: PhoneValue) => void;
  /** Varsayilan ulke kodu */
  defaultCountry?: string;
  /** Alan etiketi */
  label?: string;
  /** Hata mesaji */
  error?: string;
  /** Devre disi durumu */
  disabled?: boolean;
  /** Telefon numarasi placeholder */
  placeholder?: string;
}

/** Varsayilan ulke kodlari listesi */
const DEFAULT_COUNTRIES: CountryOption[] = [
  { code: 'TR', dialCode: '+90', label: 'Turkiye (+90)' },
  { code: 'US', dialCode: '+1', label: 'ABD (+1)' },
  { code: 'GB', dialCode: '+44', label: 'Ingiltere (+44)' },
  { code: 'DE', dialCode: '+49', label: 'Almanya (+49)' },
  { code: 'FR', dialCode: '+33', label: 'Fransa (+33)' },
  { code: 'NL', dialCode: '+31', label: 'Hollanda (+31)' },
  { code: 'IT', dialCode: '+39', label: 'Italya (+39)' },
  { code: 'ES', dialCode: '+34', label: 'Ispanya (+34)' },
  { code: 'AZ', dialCode: '+994', label: 'Azerbaycan (+994)' },
  { code: 'SA', dialCode: '+966', label: 'Suudi Arabistan (+966)' },
];

/**
 * PhoneInput — Ulke kodu secici ve telefon numarasi giris alani bilesimi.
 * Varsayilan ulke kodu: +90 (TR).
 */
export function PhoneInput({
  value,
  onChange,
  defaultCountry = 'TR',
  label,
  error,
  disabled = false,
  placeholder = '5XX XXX XX XX',
}: PhoneInputProps) {
  const generatedId = useId();
  const fieldId = generatedId;

  /** Secili ulke kodu — value varsa onu kullan, yoksa defaultCountry */
  const currentDialCode =
    value?.countryCode ??
    DEFAULT_COUNTRIES.find((c) => c.code === defaultCountry)?.dialCode ??
    '+90';

  /** Ulke kodu degistiginde */
  const handleCountryChange = (e: ChangeEvent<HTMLSelectElement>) => {
    onChange?.({
      countryCode: e.target.value,
      number: value?.number ?? '',
    });
  };

  /** Telefon numarasi degistiginde */
  const handleNumberChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange?.({
      countryCode: currentDialCode,
      number: e.target.value,
    });
  };

  return (
    <div
      role="group"
      aria-label={label ?? 'Telefon numarasi'}
      style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}
    >
      {label && (
        <label
          htmlFor={`${fieldId}-number`}
          style={{
            fontSize: '14px',
            fontWeight: 500,
            color: 'var(--color-content-primary)',
          }}
        >
          {label}
        </label>
      )}
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        {/* Ulke kodu secici */}
        <select
          aria-label="Ulke kodu"
          value={currentDialCode}
          onChange={handleCountryChange}
          disabled={disabled}
          style={{
            height: '40px',
            padding: '0 8px',
            fontSize: '16px',
            borderRadius: '8px',
            border: `1px solid ${error ? 'var(--color-border-error)' : 'var(--color-border-default)'}`,
            backgroundColor: 'var(--color-surface-default)',
            color: 'var(--color-content-primary)',
            minWidth: '120px',
            opacity: disabled ? 0.4 : 1,
            cursor: disabled ? 'not-allowed' : 'pointer',
          }}
        >
          {DEFAULT_COUNTRIES.map((country) => (
            <option key={country.code} value={country.dialCode}>
              {country.label}
            </option>
          ))}
        </select>

        {/* Telefon numarasi girisi */}
        <input
          id={`${fieldId}-number`}
          type="tel"
          inputMode="tel"
          value={value?.number ?? ''}
          onChange={handleNumberChange}
          placeholder={placeholder}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={error ? `${fieldId}-error` : undefined}
          style={{
            flex: 1,
            height: '40px',
            padding: '0 12px',
            fontSize: '16px',
            borderRadius: '8px',
            border: `1px solid ${error ? 'var(--color-border-error)' : 'var(--color-border-default)'}`,
            backgroundColor: 'var(--color-surface-default)',
            color: 'var(--color-content-primary)',
            outline: 'none',
            opacity: disabled ? 0.4 : 1,
            cursor: disabled ? 'not-allowed' : 'text',
          }}
        />
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
    </div>
  );
}
