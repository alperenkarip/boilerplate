// C46 — Drawer
import { type ReactNode } from 'react';

type DrawerSide = 'left' | 'right';
interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  side?: DrawerSide;
  width?: number;
}

export function Drawer({ isOpen, onClose, children, side = 'left', width = 320 }: DrawerProps) {
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
          top: 0,
          bottom: 0,
          [side]: 0,
          width,
          backgroundColor: 'var(--color-surface-elevated)',
          zIndex: 50,
          overflow: 'auto',
          padding: '24px',
          boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
        }}
      >
        {children}
      </div>
    </>
  );
}
