// C29 — ListItem
import { type ReactNode } from 'react';

interface ListItemProps {
  title: string;
  subtitle?: string;
  leading?: ReactNode;
  trailing?: ReactNode;
  onPress?: () => void;
}

export function ListItem({ title, subtitle, leading, trailing, onPress }: ListItemProps) {
  const Tag = onPress ? 'button' : 'div';
  return (
    <Tag
      onClick={onPress}
      type={onPress ? 'button' : undefined}
      style={
        {
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '12px 16px',
          width: '100%',
          textAlign: 'left',
          background: 'none',
          border: 'none',
          cursor: onPress ? 'pointer' : 'default',
          borderBottom: '1px solid var(--color-border-subtle)',
          color: 'var(--color-content-primary)',
          font: 'inherit',
        } as React.CSSProperties
      }
    >
      {leading}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: '16px', fontWeight: 500 }}>{title}</div>
        {subtitle && (
          <div
            style={{ fontSize: '14px', color: 'var(--color-content-secondary)', marginTop: '2px' }}
          >
            {subtitle}
          </div>
        )}
      </div>
      {trailing}
    </Tag>
  );
}
