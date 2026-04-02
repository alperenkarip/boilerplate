// C08 — Icon primitive: ikon wrapper (semantic label)
import { type SVGAttributes, type ReactNode } from 'react';

interface IconProps extends SVGAttributes<SVGSVGElement> {
  children: ReactNode;
  /** Boyut (px) */
  size?: number;
  /** Semantic renk rolu */
  color?:
    | 'primary'
    | 'secondary'
    | 'disabled'
    | 'success'
    | 'warning'
    | 'error'
    | 'info'
    | 'inverse';
  /** A11y: dekoratif mi yoksa anlamli mi */
  accessibilityLabel?: string;
}

/**
 * Icon wrapper. Children olarak SVG path veya icon component alir.
 * accessibilityLabel verilmediyse aria-hidden olur.
 */
export function Icon({
  children,
  size = 24,
  color = 'primary',
  accessibilityLabel,
  style,
  ...rest
}: IconProps) {
  const isDecorative = !accessibilityLabel;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      role={isDecorative ? 'presentation' : 'img'}
      aria-hidden={isDecorative}
      aria-label={accessibilityLabel}
      style={{
        color: `var(--color-content-${color})`,
        flexShrink: 0,
        ...style,
      }}
      {...rest}
    >
      {children}
    </svg>
  );
}
