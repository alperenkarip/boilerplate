// C31 — KeyValueRow
interface KeyValueRowProps {
  label: string;
  value: string | number;
}

// @MX:ANCHOR: [AUTO] Label/value row component — used by 3+ files for detail and summary views
// @MX:REASON: fan_in=3; prop shape (label/value) is a contract relied on by every key-value display
export function KeyValueRow({ label, value }: KeyValueRowProps) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        padding: '8px 0',
        borderBottom: '1px solid var(--color-border-subtle)',
      }}
    >
      <span style={{ fontSize: '14px', color: 'var(--color-content-secondary)' }}>{label}</span>
      <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-content-primary)' }}>
        {value}
      </span>
    </div>
  );
}
