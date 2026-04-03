// C24 — FormActions
// Form alt buton alani (submit + cancel), saga hizali flex container
import { type ReactNode } from 'react';

interface FormActionsProps {
  /** Buton icerikleri (genellikle Button component'leri) */
  children: ReactNode;
}

export function FormActions({ children }: FormActionsProps) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        gap: '8px',
        paddingTop: '16px',
        borderTop: '1px solid var(--color-border-subtle)',
        marginTop: '8px',
      }}
    >
      {children}
    </div>
  );
}
