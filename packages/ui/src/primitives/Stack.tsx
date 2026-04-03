// C04 — Stack primitive: dikey layout (gap-based)
// @MX:ANCHOR: [AUTO] Core layout primitive — used by 51+ files across web and mobile screens
// @MX:REASON: Highest fan_in in UI layer; signature changes break all screen layouts
import { type HTMLAttributes, type ReactNode } from 'react';

interface StackProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  /** Gap (spacing token scale, *4px) */
  gap?: number;
  /** Hizalama */
  align?: 'start' | 'center' | 'end' | 'stretch';
}

export function Stack({ children, gap = 2, align = 'stretch', style, ...rest }: StackProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: `${gap * 4}px`,
        alignItems: align === 'start' ? 'flex-start' : align === 'end' ? 'flex-end' : align,
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}
