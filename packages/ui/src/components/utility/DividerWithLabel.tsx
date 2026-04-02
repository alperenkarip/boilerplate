// C18.10 — DividerWithLabel
// Yatay cizgi ortasinda label gosterimi (ornegin "Veya" ayiricisi)

interface DividerWithLabelProps {
  /** Cizgi ortasinda gorunecek metin */
  label: string;
}

export function DividerWithLabel({ label }: DividerWithLabelProps) {
  return (
    <div
      role="separator"
      style={{
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        gap: '12px',
      }}
    >
      {/* Sol cizgi */}
      <div
        style={{
          flex: 1,
          height: '1px',
          backgroundColor: 'var(--color-border-subtle)',
        }}
      />

      {/* Ortadaki label */}
      <span
        style={{
          fontSize: '13px',
          fontWeight: 500,
          color: 'var(--color-text-subtle)',
          whiteSpace: 'nowrap',
          userSelect: 'none',
        }}
      >
        {label}
      </span>

      {/* Sag cizgi */}
      <div
        style={{
          flex: 1,
          height: '1px',
          backgroundColor: 'var(--color-border-subtle)',
        }}
      />
    </div>
  );
}
