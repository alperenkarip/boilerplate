// C12 — KeyboardAvoidingContainer primitive: klavye kacinma wrapper
// Web: minimal — form elementleri native scroll davranisi kullanir
// Mobile: React Native KeyboardAvoidingView ile sarmalanmali (platform adaptation)
import { type HTMLAttributes, type ReactNode } from 'react';

interface KeyboardAvoidingContainerProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  /** Aktif mi */
  enabled?: boolean;
}

/**
 * Web tarafinda minimal wrapper.
 * Mobile tarafinda KeyboardAvoidingView ile degistirilmeli (platform adaptation).
 */
export function KeyboardAvoidingContainer({
  children,
  enabled = true,
  style,
  ...rest
}: KeyboardAvoidingContainerProps) {
  if (!enabled) {
    return <>{children}</>;
  }

  return (
    <div
      style={{
        flex: 1,
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}
