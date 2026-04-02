// C39 — LoadingState
import { Spinner } from './Spinner';

interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message = 'Yukleniyor...' }: LoadingStateProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '12px',
        padding: '48px 24px',
      }}
    >
      <Spinner size={32} />
      <p style={{ margin: 0, fontSize: '14px', color: 'var(--color-content-secondary)' }}>
        {message}
      </p>
    </div>
  );
}
