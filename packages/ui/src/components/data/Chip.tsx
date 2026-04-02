// C27 — Chip / Tag
interface ChipProps {
  label: string;
  onRemove?: () => void;
  selected?: boolean;
}

export function Chip({ label, onRemove, selected = false }: ChipProps) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        padding: '4px 12px',
        borderRadius: '9999px',
        fontSize: '13px',
        border: '1px solid var(--color-border-default)',
        backgroundColor: selected
          ? 'var(--color-interactive-primary-bg)'
          : 'var(--color-surface-default)',
        color: selected ? 'var(--color-interactive-primary-fg)' : 'var(--color-content-primary)',
      }}
    >
      {label}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          aria-label={`${label} kaldir`}
          style={{
            background: 'none',
            border: 'none',
            padding: 0,
            cursor: 'pointer',
            color: 'inherit',
            fontSize: '14px',
          }}
        >
          ✕
        </button>
      )}
    </span>
  );
}
