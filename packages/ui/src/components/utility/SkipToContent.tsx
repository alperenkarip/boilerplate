// C55 — SkipToContent (Web-only a11y)
// Klavye navigasyonu icin "Icerigi Atla" linki
// Varsayilan olarak gorsel olarak gizli, focus alindiginda gorunur olur
// NOT: Bu component sadece web'de calisir — React Native'de render edilmez

interface SkipToContentProps {
  /** Atlanacak icerik alani id'si */
  targetId: string;
  /** Link metni — varsayilan: "Icerigi atla" */
  label?: string;
}

/** sr-only stili — varsayilan olarak gizli */
const srOnlyStyle: Record<string, string | number> = {
  position: 'absolute',
  width: '1px',
  height: '1px',
  padding: 0,
  margin: '-1px',
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  borderWidth: 0,
};

/** Focus alindiginda gorunur stil */
const visibleStyle: Record<string, string> = {
  position: 'fixed',
  top: '8px',
  left: '8px',
  width: 'auto',
  height: 'auto',
  padding: '12px 24px',
  margin: '0',
  overflow: 'visible',
  clip: 'auto',
  whiteSpace: 'normal',
  zIndex: '9999',
  backgroundColor: 'var(--color-surface-elevated)',
  color: 'var(--color-interactive-primary-bg)',
  fontSize: '14px',
  fontWeight: '600',
  borderRadius: '8px',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
  textDecoration: 'none',
  outline: '2px solid var(--color-interactive-primary-bg)',
  outlineOffset: '2px',
};

/** DOM element'ten style objesine guvenli erisim (mobile tsconfig uyumu) */
function applyStyle(target: EventTarget, style: Record<string, string>): void {
  const el = target as unknown as { style: Record<string, string> };
  Object.assign(el.style, style);
}

export function SkipToContent({ targetId, label = 'İçeriğe atla' }: SkipToContentProps) {
  return (
    <a
      href={`#${targetId}`}
      role="link"
      aria-label={label}
      style={srOnlyStyle}
      onFocus={(e) => applyStyle(e.currentTarget, visibleStyle)}
      onBlur={(e) =>
        applyStyle(e.currentTarget, {
          position: 'absolute',
          width: '1px',
          height: '1px',
          padding: '0',
          margin: '-1px',
          overflow: 'hidden',
          clip: 'rect(0, 0, 0, 0)',
          whiteSpace: 'nowrap',
          borderWidth: '0',
          zIndex: 'auto',
          backgroundColor: '',
          color: '',
          fontSize: '',
          fontWeight: '',
          borderRadius: '',
          boxShadow: '',
          textDecoration: '',
          outline: '',
          outlineOffset: '',
          top: '',
          left: '',
        })
      }
    >
      {label}
    </a>
  );
}
