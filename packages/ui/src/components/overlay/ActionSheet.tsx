// C45 — ActionSheet
import { BottomSheet } from './BottomSheet';

interface ActionSheetAction {
  label: string;
  onPress: () => void;
  destructive?: boolean;
}
interface ActionSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  actions: ActionSheetAction[];
}

export function ActionSheet({ isOpen, onClose, title, actions }: ActionSheetProps) {
  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title={title}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {actions.map((action) => (
          <button
            key={action.label}
            type="button"
            onClick={() => {
              action.onPress();
              onClose();
            }}
            style={{
              padding: '14px 16px',
              textAlign: 'left',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px',
              background: 'none',
              color: action.destructive
                ? 'var(--color-content-error)'
                : 'var(--color-content-primary)',
            }}
          >
            {action.label}
          </button>
        ))}
        <button
          type="button"
          onClick={onClose}
          style={{
            padding: '14px 16px',
            textAlign: 'center',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 600,
            background: 'var(--color-surface-subtle)',
            color: 'var(--color-content-primary)',
            marginTop: '8px',
          }}
        >
          Iptal
        </button>
      </div>
    </BottomSheet>
  );
}
