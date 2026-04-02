// C06 — Spacer primitive: controlled bosluk
interface SpacerProps {
  /** Boyut (spacing token scale, *4px) */
  size?: number;
  /** Yon */
  direction?: 'vertical' | 'horizontal';
}

export function Spacer({ size = 2, direction = 'vertical' }: SpacerProps) {
  const px = `${size * 4}px`;
  return (
    <div
      aria-hidden="true"
      style={{
        ...(direction === 'vertical' ? { height: px } : { width: px }),
        flexShrink: 0,
      }}
    />
  );
}
