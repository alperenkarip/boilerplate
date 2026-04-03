// C52 — Popover
// Click ile acilan detay paneli, dialog semantigi
import { type ReactNode, useId, useRef, useEffect } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const g = globalThis as any;

interface PopoverProps {
  content: ReactNode;
  children: ReactNode;
  isOpen: boolean;
  onToggle: () => void;
}

export function Popover({ content, children, isOpen, onToggle }: PopoverProps) {
  const popoverId = useId();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const containerRef = useRef<any>(null);

  useEffect(() => {
    if (!isOpen || typeof g.document === 'undefined') return;

    function handleClickOutside(event: { target: unknown }) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        onToggle();
      }
    }

    const timer = setTimeout(() => {
      g.document.addEventListener('mousedown', handleClickOutside);
    }, 0);

    return () => {
      clearTimeout(timer);
      g.document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onToggle]);

  useEffect(() => {
    if (!isOpen || typeof g.document === 'undefined') return;

    function handleEscape(event: { key: string }) {
      if (event.key === 'Escape') onToggle();
    }

    g.document.addEventListener('keydown', handleEscape);
    return () => g.document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onToggle]);

  return (
    <div ref={containerRef} style={{ position: 'relative', display: 'inline-block' }}>
      <span
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        aria-controls={isOpen ? popoverId : undefined}
        style={{ cursor: 'pointer' }}
      >
        {children}
      </span>

      {isOpen && (
        <div
          id={popoverId}
          role="dialog"
          aria-label="Detay paneli"
          style={{
            position: 'absolute',
            top: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            marginTop: '8px',
            minWidth: '200px',
            padding: '12px 16px',
            borderRadius: '8px',
            border: '1px solid var(--color-border-default)',
            backgroundColor: 'var(--color-surface-elevated)',
            color: 'var(--color-content-primary)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            zIndex: 50,
          }}
        >
          {content}
        </div>
      )}
    </div>
  );
}
