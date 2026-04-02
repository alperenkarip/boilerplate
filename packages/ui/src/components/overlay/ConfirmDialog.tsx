// C44 — ConfirmDialog
import { Modal } from './Modal';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'default' | 'destructive';
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Onayla',
  cancelLabel = 'Iptal',
  variant = 'default',
}: ConfirmDialogProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <p style={{ margin: '0 0 24px', fontSize: '14px', color: 'var(--color-content-secondary)' }}>
        {message}
      </p>
      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
        <button
          type="button"
          onClick={onClose}
          style={{
            padding: '8px 16px',
            borderRadius: '8px',
            border: '1px solid var(--color-border-default)',
            background: 'var(--color-surface-default)',
            cursor: 'pointer',
            color: 'var(--color-content-primary)',
          }}
        >
          {cancelLabel}
        </button>
        <button
          type="button"
          onClick={() => {
            onConfirm();
            onClose();
          }}
          style={{
            padding: '8px 16px',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            backgroundColor:
              variant === 'destructive'
                ? 'var(--color-feedback-error)'
                : 'var(--color-interactive-primary-bg)',
            color: 'white',
            fontWeight: 600,
          }}
        >
          {confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
