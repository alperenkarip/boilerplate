// C18.4 — SegmentedControl
// Tab benzeri yatay secici, aktif segment vurgulu

interface SegmentedControlOption {
  value: string;
  label: string;
}

interface SegmentedControlProps {
  /** Secenekler listesi */
  options: SegmentedControlOption[];
  /** Secili degerin value'su */
  value: string;
  /** Secimdeki degisiklik callback'i */
  onChange: (value: string) => void;
}

export function SegmentedControl({ options, value, onChange }: SegmentedControlProps) {
  return (
    <div
      role="tablist"
      style={{
        display: 'inline-flex',
        borderRadius: '8px',
        backgroundColor: 'var(--color-surface-subtle)',
        padding: '2px',
        gap: '2px',
      }}
    >
      {options.map((option) => {
        const isSelected = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="tab"
            aria-selected={isSelected}
            onClick={() => onChange(option.value)}
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: isSelected ? 600 : 400,
              color: isSelected ? 'var(--color-text-on-primary)' : 'var(--color-text-default)',
              backgroundColor: isSelected ? 'var(--color-interactive-primary-bg)' : 'transparent',
              transition: 'background-color 150ms, color 150ms, font-weight 150ms',
            }}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
