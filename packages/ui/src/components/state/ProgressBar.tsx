// C36 — ProgressBar
interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
}

export function ProgressBar({ value, max = 100, label }: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-label={label}
      style={{
        width: '100%',
        height: '6px',
        borderRadius: '3px',
        backgroundColor: 'var(--color-surface-subtle)',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          width: `${pct}%`,
          height: '100%',
          borderRadius: '3px',
          backgroundColor: 'var(--color-interactive-primary-bg)',
          transition: 'width 300ms',
        }}
      />
    </div>
  );
}
