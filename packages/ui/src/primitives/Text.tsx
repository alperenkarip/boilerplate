// C01 — Text primitive: tipografi temel birimi
import { type HTMLAttributes, type ReactNode } from 'react';

type TextVariant = 'body' | 'caption' | 'label' | 'overline';

interface TextProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
  variant?: TextVariant;
  /** Semantic renk rolu */
  color?:
    | 'primary'
    | 'secondary'
    | 'tertiary'
    | 'disabled'
    | 'success'
    | 'warning'
    | 'error'
    | 'info';
  /** Kalin yazi */
  weight?: 'regular' | 'medium' | 'semibold' | 'bold';
  as?: 'span' | 'p' | 'label';
}

export function Text({
  children,
  variant = 'body',
  color = 'primary',
  weight,
  as: Tag = 'span',
  style,
  ...rest
}: TextProps) {
  return (
    <Tag
      style={{
        color: `var(--color-content-${color})`,
        fontSize: variantToSize(variant),
        fontWeight: weight,
        ...style,
      }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

function variantToSize(variant: TextVariant): string {
  const map: Record<TextVariant, string> = {
    body: '16px',
    caption: '12px',
    label: '14px',
    overline: '11px',
  };
  return map[variant];
}
