// C11 — SafeAreaContainer primitive: safe area (notch, status bar)
// Mobile-primary, web'de env() CSS kullaniyor
import { type HTMLAttributes, type ReactNode } from 'react';

interface SafeAreaContainerProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  /** Hangi kenarlar korunacak */
  edges?: Array<'top' | 'bottom' | 'left' | 'right'>;
}

export function SafeAreaContainer({
  children,
  edges = ['top', 'bottom'],
  style,
  ...rest
}: SafeAreaContainerProps) {
  return (
    <div
      style={{
        ...(edges.includes('top') ? { paddingTop: 'env(safe-area-inset-top, 0px)' } : {}),
        ...(edges.includes('bottom') ? { paddingBottom: 'env(safe-area-inset-bottom, 0px)' } : {}),
        ...(edges.includes('left') ? { paddingLeft: 'env(safe-area-inset-left, 0px)' } : {}),
        ...(edges.includes('right') ? { paddingRight: 'env(safe-area-inset-right, 0px)' } : {}),
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}
