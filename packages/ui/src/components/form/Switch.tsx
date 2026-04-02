// C20 — Switch
interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  isDisabled?: boolean;
}

export function Switch({ checked, onChange, label, isDisabled = false }: SwitchProps) {
  return (
    <label
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        opacity: isDisabled ? 0.4 : 1,
      }}
    >
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        disabled={isDisabled}
        onClick={() => onChange(!checked)}
        style={{
          width: '44px',
          height: '24px',
          borderRadius: '12px',
          border: 'none',
          padding: '2px',
          cursor: 'inherit',
          backgroundColor: checked
            ? 'var(--color-interactive-primary-bg)'
            : 'var(--color-border-default)',
          transition: 'background-color 200ms',
          position: 'relative',
        }}
      >
        <span
          style={{
            display: 'block',
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            backgroundColor: 'white',
            transform: checked ? 'translateX(20px)' : 'translateX(0)',
            transition: 'transform 200ms',
          }}
        />
      </button>
      {label && (
        <span style={{ fontSize: '14px', color: 'var(--color-content-primary)' }}>{label}</span>
      )}
    </label>
  );
}
