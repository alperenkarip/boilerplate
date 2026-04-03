// C13 — Button
// @MX:ANCHOR: [AUTO] Primary interactive component — used by 37+ files for all user actions
// @MX:REASON: Most-used form component; variant/size API changes break action flows across app
import { type ButtonHTMLAttributes, type ReactNode } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'destructive';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  isDisabled?: boolean;
  fullWidth?: boolean;
}

const sizeStyles: Record<ButtonSize, { height: string; padding: string; fontSize: string }> = {
  sm: { height: '32px', padding: '0 12px', fontSize: '14px' },
  md: { height: '40px', padding: '0 16px', fontSize: '16px' },
  lg: { height: '48px', padding: '0 24px', fontSize: '16px' },
};

const variantStyles: Record<ButtonVariant, { bg: string; fg: string; hover: string }> = {
  primary: {
    bg: 'var(--color-interactive-primary-bg)',
    fg: 'var(--color-interactive-primary-fg)',
    hover: 'var(--color-interactive-primary-hover)',
  },
  secondary: {
    bg: 'var(--color-interactive-secondary-bg)',
    fg: 'var(--color-interactive-secondary-fg)',
    hover: 'var(--color-interactive-secondary-hover)',
  },
  ghost: {
    bg: 'transparent',
    fg: 'var(--color-content-primary)',
    hover: 'var(--color-interactive-secondary-bg)',
  },
  destructive: {
    bg: 'var(--color-feedback-error)',
    fg: 'white',
    hover: 'var(--color-feedback-error)',
  },
};

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  isDisabled = false,
  fullWidth = false,
  style,
  ...rest
}: ButtonProps) {
  const s = sizeStyles[size];
  const v = variantStyles[variant];
  const disabled = isDisabled || isLoading;

  return (
    <button
      type="button"
      disabled={disabled}
      aria-busy={isLoading}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: s.height,
        padding: s.padding,
        fontSize: s.fontSize,
        fontWeight: 600,
        borderRadius: '8px',
        border: 'none',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.4 : 1,
        backgroundColor: v.bg,
        color: v.fg,
        width: fullWidth ? '100%' : 'auto',
        transition: 'background-color 200ms',
        ...style,
      }}
      {...rest}
    >
      {isLoading ? 'Yukleniyor...' : children}
    </button>
  );
}
