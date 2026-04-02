// C43 — Modal / Dialog
// Web: native dialog element kullanir
// Mobile: react-native Modal ile degistirilecek (platform adaptation)
import { type ReactNode, useEffect, useRef } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dialogRef = useRef<any>(null);

  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;
    if (isOpen && !el.open) el.showModal();
    else if (!isOpen && el.open) el.close();
  }, [isOpen]);

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      style={{
        maxWidth: '480px',
        width: '90vw',
        borderRadius: '12px',
        border: '1px solid var(--color-border-default)',
        backgroundColor: 'var(--color-surface-elevated)',
        padding: '24px',
        color: 'var(--color-content-primary)',
      }}
    >
      {title && <h2 style={{ margin: '0 0 16px', fontSize: '20px', fontWeight: 600 }}>{title}</h2>}
      {children}
    </dialog>
  );
}
