// C09 — Divider primitive: gorsel ayirici
interface DividerProps {
  /** Yon */
  direction?: 'horizontal' | 'vertical';
  /** Border renk rolu */
  color?: 'default' | 'subtle' | 'strong';
  /** Kenar bosluk (spacing *4px) */
  spacing?: number;
}

export function Divider({ direction = 'horizontal', color = 'subtle', spacing = 0 }: DividerProps) {
  const isHorizontal = direction === 'horizontal';

  return (
    <hr
      aria-hidden="true"
      style={{
        border: 'none',
        margin: 0,
        ...(isHorizontal
          ? {
              height: '1px',
              width: '100%',
              backgroundColor: `var(--color-border-${color})`,
              marginBlock: `${spacing * 4}px`,
            }
          : {
              width: '1px',
              height: '100%',
              backgroundColor: `var(--color-border-${color})`,
              marginInline: `${spacing * 4}px`,
            }),
      }}
    />
  );
}
