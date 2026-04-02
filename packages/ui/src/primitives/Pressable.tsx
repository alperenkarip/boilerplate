// C07 — Pressable primitive: tiklanabilir yuzey (a11y-aware)
import { type ButtonHTMLAttributes, type ReactNode } from 'react';

interface PressableProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  /** Tiklanma callback */
  onPress?: () => void;
  /** Devre disi */
  isDisabled?: boolean;
  /** A11y label */
  accessibilityLabel?: string;
}

export function Pressable({
  children,
  onPress,
  isDisabled = false,
  accessibilityLabel,
  style,
  onClick,
  ...rest
}: PressableProps) {
  return (
    <button
      type="button"
      disabled={isDisabled}
      onClick={onPress ?? onClick}
      aria-label={accessibilityLabel}
      aria-disabled={isDisabled}
      style={{
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        opacity: isDisabled ? 0.4 : 1,
        background: 'none',
        border: 'none',
        padding: 0,
        font: 'inherit',
        color: 'inherit',
        ...style,
      }}
      {...rest}
    >
      {children}
    </button>
  );
}
