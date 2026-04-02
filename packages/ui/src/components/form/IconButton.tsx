// C14 — IconButton
import { type ButtonHTMLAttributes, type ReactNode } from 'react';

type IconButtonSize = 'sm' | 'md' | 'lg';

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  accessibilityLabel: string;
  size?: IconButtonSize;
  variant?: 'default' | 'ghost';
  isDisabled?: boolean;
}

const sizes: Record<IconButtonSize, number> = { sm: 32, md: 40, lg: 48 };

export function IconButton({
  icon,
  accessibilityLabel,
  size = 'md',
  variant = 'default',
  isDisabled = false,
  style,
  ...rest
}: IconButtonProps) {
  const dim = sizes[size];
  return (
    <button
      type="button"
      disabled={isDisabled}
      aria-label={accessibilityLabel}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: dim,
        height: dim,
        borderRadius: '50%',
        border: 'none',
        padding: 0,
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        opacity: isDisabled ? 0.4 : 1,
        backgroundColor:
          variant === 'ghost' ? 'transparent' : 'var(--color-interactive-secondary-bg)',
        color: 'var(--color-content-primary)',
        ...style,
      }}
      {...rest}
    >
      {icon}
    </button>
  );
}
