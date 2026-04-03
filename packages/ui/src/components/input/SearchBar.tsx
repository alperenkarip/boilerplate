// C18.14 — SearchBar — Arama cubugu bileseni
// NOT: Performans icin debounce uygulamasi onerilir.
// Ornek: lodash.debounce veya custom useDebounce hook ile
// onChange handler'ini sarmalayin (ornegin 300ms gecikme).
import { type ChangeEvent, type InputHTMLAttributes, forwardRef, useId } from 'react';

interface SearchBarProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  /** Arama degeri */
  value?: string;
  /** Degisim handler'i */
  onChange?: (value: string) => void;
  /** Placeholder metni */
  placeholder?: string;
  /** Temizle butonuna tiklandiginda */
  onClear?: () => void;
}

/**
 * SearchBar — Arama cubugu bileseni.
 * Sol tarafta arama ikonu, sag tarafta temizle butonu icerir.
 * Debounce uygulamasi icin disaridan sarmalama onerilir.
 */
export const SearchBar = forwardRef<HTMLInputElement, SearchBarProps>(function SearchBar(
  { value, onChange, placeholder = 'Ara...', onClear, id, style, ...rest },
  ref,
) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;

  /** Input degisim handler'i */
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange?.((e.target as any).value);
  };

  /** Temizle butonuna tiklandiginda */
  const handleClear = () => {
    onClear?.();
    onChange?.('');
  };

  /** Temizle butonu gorunur mu */
  const showClear = value && value.length > 0;

  return (
    <div
      role="search"
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      {/* Arama ikonu — sol taraf */}
      <span
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: '12px',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--color-content-secondary)',
          fontSize: '16px',
          pointerEvents: 'none',
        }}
      >
        ⌕
      </span>

      <input
        ref={ref}
        id={fieldId}
        type="search"
        role="searchbox"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        aria-label={placeholder}
        style={{
          width: '100%',
          height: '40px',
          padding: showClear ? '0 36px 0 36px' : '0 12px 0 36px',
          fontSize: '16px',
          borderRadius: '20px',
          border: '1px solid var(--color-border-default)',
          backgroundColor: 'var(--color-surface-sunken)',
          color: 'var(--color-content-primary)',
          outline: 'none',
          ...style,
        }}
        {...rest}
      />

      {/* Temizle butonu — sag taraf */}
      {showClear && (
        <button
          type="button"
          aria-label="Aramayi temizle"
          onClick={handleClear}
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
            borderRadius: '50%',
            backgroundColor: 'transparent',
            color: 'var(--color-content-secondary)',
            cursor: 'pointer',
            fontSize: '12px',
          }}
        >
          ✕
        </button>
      )}
    </div>
  );
});
