// C40 — Header
// Sayfa basligi + sol/sag aksiyonlar, sticky top bar pattern
import { type ReactNode } from 'react';

interface HeaderProps {
  /** Sayfa basligi */
  title: string;
  /** Sol taraftaki aksiyon (ornegin geri butonu) */
  leftAction?: ReactNode;
  /** Sag taraftaki aksiyon (ornegin ayarlar butonu) */
  rightAction?: ReactNode;
  /** Alt cizgi gosterilsin mi */
  bordered?: boolean;
}

export function Header({ title, leftAction, rightAction, bordered = true }: HeaderProps) {
  return (
    <header
      role="banner"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '56px',
        padding: '0 16px',
        backgroundColor: 'var(--color-surface-default)',
        borderBottom: bordered ? '1px solid var(--color-border-subtle)' : 'none',
      }}
    >
      {/* Sol aksiyon alani */}
      <div style={{ display: 'flex', alignItems: 'center', minWidth: '40px' }}>
        {leftAction ?? null}
      </div>

      {/* Baslik */}
      <h1
        style={{
          flex: 1,
          textAlign: 'center',
          fontSize: '17px',
          fontWeight: 600,
          color: 'var(--color-content-primary)',
          margin: 0,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {title}
      </h1>

      {/* Sag aksiyon alani */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          minWidth: '40px',
          justifyContent: 'flex-end',
        }}
      >
        {rightAction ?? null}
      </div>
    </header>
  );
}
