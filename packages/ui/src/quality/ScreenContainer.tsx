// ScreenContainer (C47) — Safe area + layout wrapper
// Web: max-width + padding, Mobile: SafeAreaView wrapper

import { type ReactNode, type CSSProperties } from 'react';

interface ScreenContainerProps {
  children: ReactNode;
  /** Yatay padding uygulansin mi */
  padded?: boolean;
  /** Scroll davranisi */
  scrollable?: boolean;
  /** Ek CSS stil */
  style?: CSSProperties;
}

/**
 * Ekran seviyesi container.
 * Web tarafinda max-width ve padding saglar.
 * Mobile tarafinda SafeAreaView ile sarmalanmalidir (platform adaptation).
 */
export function ScreenContainer({
  children,
  padded = true,
  scrollable = false,
  style,
}: ScreenContainerProps) {
  const containerStyle: CSSProperties = {
    flex: 1,
    width: '100%',
    maxWidth: 1200,
    marginInline: 'auto',
    ...(padded ? { paddingInline: 16 } : {}),
    ...(scrollable ? { overflow: 'auto' } : {}),
    ...style,
  };

  return <div style={containerStyle}>{children}</div>;
}
