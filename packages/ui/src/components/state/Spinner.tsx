// C35 — Spinner
// @MX:ANCHOR: [AUTO] Loading indicator component — used by 4+ files for async state feedback
// @MX:REASON: Shared loading UI; animation/size changes affect all loading states
interface SpinnerProps {
  size?: number;
  color?: string;
  label?: string;
}

export function Spinner({
  size = 24,
  color = 'var(--color-interactive-primary-bg)',
  label = 'Yukleniyor',
}: SpinnerProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      role="status"
      aria-label={label}
      style={{ animation: 'spin 1s linear infinite' }}
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke={color}
        strokeWidth="3"
        strokeDasharray="31.4 31.4"
        strokeLinecap="round"
      />
    </svg>
  );
}
