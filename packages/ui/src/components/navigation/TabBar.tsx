// C41 — TabBar
// Alt navigasyon cubugu (mobil tarzi), sekme listesi
import { useId } from 'react';
import { type ReactNode } from 'react';

interface TabBarItem {
  /** Benzersiz sekme anahtari */
  key: string;
  /** Sekme etiketi */
  label: string;
  /** Opsiyonel ikon (ReactNode olarak) */
  icon?: ReactNode;
}

interface TabBarProps {
  /** Sekme listesi */
  items: TabBarItem[];
  /** Aktif sekme anahtari */
  activeKey: string;
  /** Sekme secim callback'i */
  onSelect: (key: string) => void;
}

export function TabBar({ items, activeKey, onSelect }: TabBarProps) {
  const groupId = useId();

  return (
    <nav
      role="tablist"
      aria-label="Alt navigasyon"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        height: '56px',
        backgroundColor: 'var(--color-surface-default)',
        borderTop: '1px solid var(--color-border-subtle)',
        padding: '0 8px',
      }}
    >
      {items.map((item) => {
        const isActive = item.key === activeKey;

        return (
          <button
            key={item.key}
            type="button"
            role="tab"
            id={`${groupId}-tab-${item.key}`}
            aria-selected={isActive}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onSelect(item.key)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '2px',
              flex: 1,
              height: '100%',
              border: 'none',
              backgroundColor: 'transparent',
              cursor: 'pointer',
              padding: '4px 0',
              color: isActive
                ? 'var(--color-interactive-primary-bg)'
                : 'var(--color-content-secondary)',
              transition: 'color 150ms',
            }}
          >
            {/* Ikon */}
            {item.icon && (
              <span aria-hidden="true" style={{ fontSize: '20px', lineHeight: 1 }}>
                {item.icon}
              </span>
            )}

            {/* Etiket */}
            <span style={{ fontSize: '10px', fontWeight: isActive ? 600 : 400 }}>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
