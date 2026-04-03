// 18.12 — NetworkStatusBanner
// Cevrimdisi veya yavas baglanti durumunu gosteren kalici banner

interface NetworkStatusBannerProps {
  /** Cihaz cevrimdisi mi */
  isOffline: boolean;
  /** Baglanti yavas mi */
  isSlowConnection?: boolean;
  /** Yeniden baglanti deneme callback'i */
  onRetry?: () => void;
}

export function NetworkStatusBanner({
  isOffline,
  isSlowConnection = false,
  onRetry,
}: NetworkStatusBannerProps) {
  // Her iki durum da false ise render etme
  if (!isOffline && !isSlowConnection) {
    return null;
  }

  // Offline durumu error, yavas baglanti durumu warning
  const isError = isOffline;
  const bgColor = isError ? 'var(--color-surface-error-soft)' : 'var(--color-surface-warning-soft)';
  const textColor = 'var(--color-content-primary)';
  const message = isError
    ? 'Internet baglantiniz yok. Lutfen baglantinizi kontrol edin.'
    : 'Internet baglantiniz yavas. Bazi islemler daha uzun surebilir.';
  const iconSymbol = isError ? '⚠' : '⏳';

  return (
    <div
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      style={{
        position: 'sticky',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9998,
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '10px 16px',
        backgroundColor: bgColor,
      }}
    >
      {/* Durum ikonu */}
      <span aria-hidden="true" style={{ fontSize: '16px' }}>
        {iconSymbol}
      </span>

      {/* Mesaj */}
      <span
        style={{
          flex: 1,
          fontSize: '14px',
          color: textColor,
          lineHeight: 1.4,
        }}
      >
        {message}
      </span>

      {/* Tekrar dene butonu */}
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          aria-label="Baglantiyi tekrar dene"
          style={{
            height: '32px',
            padding: '0 12px',
            fontSize: '13px',
            fontWeight: 600,
            borderRadius: '6px',
            border: 'none',
            cursor: 'pointer',
            backgroundColor: isError
              ? 'var(--color-feedback-error)'
              : 'var(--color-feedback-warning)',
            color: isError ? 'white' : 'var(--color-content-primary)',
            whiteSpace: 'nowrap',
          }}
        >
          Tekrar Dene
        </button>
      )}
    </div>
  );
}
