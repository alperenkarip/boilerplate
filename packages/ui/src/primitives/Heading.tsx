// C02 — Heading primitive: baslik seviyeleri (h1-h6)
// @MX:ANCHOR: [AUTO] Typography heading primitive — used by 47+ files for all heading elements
// @MX:REASON: Second highest fan_in; level/color prop changes affect entire UI hierarchy
import { type HTMLAttributes, type ReactNode } from 'react';

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  children: ReactNode;
  level?: HeadingLevel;
  color?: 'primary' | 'secondary' | 'inverse';
}

const sizeMap: Record<HeadingLevel, string> = {
  1: '36px',
  2: '30px',
  3: '24px',
  4: '20px',
  5: '18px',
  6: '16px',
};

export function Heading({ children, level = 2, color = 'primary', style, ...rest }: HeadingProps) {
  const Tag = `h${level}` as const;
  return (
    <Tag
      style={{
        color: `var(--color-content-${color})`,
        fontSize: sizeMap[level],
        fontWeight: 700,
        margin: 0,
        ...style,
      }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
