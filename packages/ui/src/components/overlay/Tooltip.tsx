// C51 — Tooltip
// Hover/focus ile gorunen bilgi baloncugu, CSS positioning
import { type ReactNode, useId, useState } from 'react';

type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';

interface TooltipProps {
  /** Balon icerigi */
  content: string;
  /** Tooltip tetikleyici eleman */
  children: ReactNode;
  /** Konum: ustunde, altinda, solunda, saginda */
  position?: TooltipPosition;
}

/** Konuma gore pozisyon stilleri hesapla */
function getPositionStyles(position: TooltipPosition): Record<string, string> {
  const base: Record<string, string> = {
    position: 'absolute',
    zIndex: '50',
    whiteSpace: 'nowrap',
  };

  switch (position) {
    case 'top':
      return {
        ...base,
        bottom: '100%',
        left: '50%',
        transform: 'translateX(-50%)',
        marginBottom: '6px',
      };
    case 'bottom':
      return { ...base, top: '100%', left: '50%', transform: 'translateX(-50%)', marginTop: '6px' };
    case 'left':
      return {
        ...base,
        right: '100%',
        top: '50%',
        transform: 'translateY(-50%)',
        marginRight: '6px',
      };
    case 'right':
      return {
        ...base,
        left: '100%',
        top: '50%',
        transform: 'translateY(-50%)',
        marginLeft: '6px',
      };
  }
}

export function Tooltip({ content, children, position = 'top' }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const tooltipId = useId();

  return (
    <span
      style={{ position: 'relative', display: 'inline-block' }}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
    >
      {/* Tetikleyici eleman */}
      <span aria-describedby={isVisible ? tooltipId : undefined}>{children}</span>

      {/* Tooltip balonu */}
      {isVisible && (
        <span
          id={tooltipId}
          role="tooltip"
          style={{
            ...getPositionStyles(position),
            padding: '6px 10px',
            fontSize: '12px',
            lineHeight: 1.4,
            borderRadius: '6px',
            backgroundColor: 'var(--color-surface-inverse)',
            color: 'var(--color-content-inverse)',
            pointerEvents: 'none',
          }}
        >
          {content}
        </span>
      )}
    </span>
  );
}
