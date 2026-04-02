// C21 — Select / Picker
import { type SelectHTMLAttributes, forwardRef } from 'react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  options: SelectOption[];
  label?: string;
  error?: string;
  placeholder?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { options, label, error, placeholder, size = 'md', id, style, ...rest },
  ref,
) {
  const fieldId = id ?? `select-${label?.replace(/\s/g, '-').toLowerCase()}`;
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
      <select
        ref={ref}
        id={fieldId}
        aria-invalid={!!error}
        style={{
          height: heights[size],
          padding: '0 12px',
          fontSize: '16px',
          borderRadius: '8px',
          border: `1px solid ${error ? 'var(--color-border-error)' : 'var(--color-border-default)'}`,
          backgroundColor: 'var(--color-surface-default)',
          color: 'var(--color-content-primary)',
          ...style,
        }}
        {...rest}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <span role="alert" style={{ fontSize: '12px', color: 'var(--color-content-error)' }}>
          {error}
        </span>
      )}
    </div>
  );
});
