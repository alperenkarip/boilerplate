// C18.3 — Accordion
// Genisletilebilir panel: baslik tiklaninca icerik acilir/kapanir

import { type ReactNode, useId, useState, useRef, useEffect } from 'react';

interface AccordionProps {
  /** Panel basligi */
  title: string;
  /** Panel icerigi */
  children: ReactNode;
  /** Varsayilan olarak acik mi */
  defaultOpen?: boolean;
}

export function Accordion({ title, children, defaultOpen = false }: AccordionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState<number>(0);
  const id = useId();
  const headerId = `${id}-header`;
  const panelId = `${id}-panel`;

  // Icerik yuksekligini olcup animasyon icin kullan
  useEffect(() => {
    if (contentRef.current) {
      setContentHeight((contentRef.current as unknown as { scrollHeight: number }).scrollHeight);
    }
  }, [children, isOpen]);

  return (
    <div
      style={{
        borderRadius: '8px',
        border: '1px solid var(--color-border-subtle)',
        overflow: 'hidden',
      }}
    >
      {/* Baslik butonu */}
      <button
        type="button"
        id={headerId}
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={() => setIsOpen((prev) => !prev)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          padding: '12px 16px',
          border: 'none',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: 600,
          color: 'var(--color-text-default)',
          backgroundColor: 'var(--color-surface-elevated)',
          textAlign: 'left',
        }}
      >
        <span>{title}</span>
        {/* Chevron ikonu — acik/kapali durumuna gore doner */}
        <span
          aria-hidden="true"
          style={{
            display: 'inline-block',
            transition: 'transform 200ms ease',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            fontSize: '12px',
            lineHeight: 1,
          }}
        >
          &#9660;
        </span>
      </button>

      {/* Icerik paneli — CSS transition ile animasyonlu yukseklik */}
      <div
        id={panelId}
        role="region"
        aria-labelledby={headerId}
        style={{
          maxHeight: isOpen ? `${contentHeight}px` : '0px',
          overflow: 'hidden',
          transition: 'max-height 250ms ease',
        }}
      >
        <div
          ref={contentRef}
          style={{
            padding: '12px 16px',
            color: 'var(--color-text-default)',
            backgroundColor: 'var(--color-surface-default)',
            fontSize: '14px',
            lineHeight: 1.6,
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
