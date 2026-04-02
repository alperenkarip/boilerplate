// C18.9 — WebViewPlaceholder
// Web tarafinda iframe wrapper, mobile'da react-native-webview ile degistirilecek
// Sandbox attribute'leri guvenlik icin uygulanir

interface WebViewPlaceholderProps {
  /** Yuklenecek URL */
  uri: string;
  /** iframe basligi (a11y icin) */
  title?: string;
  /** iframe yuksekligi */
  height?: string | number;
}

export function WebViewPlaceholder({
  uri,
  title = 'Gomulu icerik',
  height = 400,
}: WebViewPlaceholderProps) {
  const resolvedHeight = typeof height === 'number' ? `${height}px` : height;

  return (
    <div
      style={{
        width: '100%',
        borderRadius: '8px',
        overflow: 'hidden',
        border: '1px solid var(--color-border-subtle)',
        backgroundColor: 'var(--color-surface-default)',
      }}
    >
      <iframe
        src={uri}
        title={title}
        // Guvenlik: sadece gerekli izinler verilir
        sandbox="allow-scripts allow-same-origin allow-popups"
        referrerPolicy="no-referrer"
        loading="lazy"
        style={{
          width: '100%',
          height: resolvedHeight,
          border: 'none',
          display: 'block',
        }}
      />
    </div>
  );
}
