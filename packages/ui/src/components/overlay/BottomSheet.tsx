// C42 — BottomSheet (web simülasyonu — mobile'da native sheet kullanilacak)
import { type ReactNode } from 'react';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
}

export function BottomSheet({ isOpen, onClose, children, title }: BottomSheetProps) {
  if (!isOpen) return null;
  return (
    <>
      <div
        onClick={onClose}
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'var(--color-overlay-backdrop)',
          zIndex: 40,
        }}
      />
      <div
        role="dialog"
        aria-modal="true"
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          maxHeight: '80vh',
          borderRadius: '16px 16px 0 0',
          backgroundColor: 'var(--color-surface-elevated)',
          padding: '24px',
          zIndex: 50,
          overflow: 'auto',
        }}
      >
        <div
          style={{
            width: '36px',
            height: '4px',
            borderRadius: '2px',
            backgroundColor: 'var(--color-border-default)',
            margin: '0 auto 16px',
          }}
        />
        {title && (
          <h3
            style={{
              margin: '0 0 16px',
              fontSize: '18px',
              fontWeight: 600,
              color: 'var(--color-content-primary)',
            }}
          >
            {title}
          </h3>
        )}
        {children}
      </div>
    </>
  );
}
