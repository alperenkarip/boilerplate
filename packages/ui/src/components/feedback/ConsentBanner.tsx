// C56 — ConsentBanner (Web-only GDPR/KVKK)
// Cerez/izleme izni icin alt kisimda sabit konumlu banner

interface ConsentBannerProps {
  /** Tum cerezleri kabul et callback'i */
  onAcceptAll: () => void;
  /** Tum cerezleri reddet callback'i */
  onRejectAll: () => void;
  /** Tercih yonetimi ekranini ac callback'i */
  onManagePreferences: () => void;
  /** Gizlilik politikasi sayfasi URL'i */
  privacyPolicyUrl?: string;
}

export function ConsentBanner({
  onAcceptAll,
  onRejectAll,
  onManagePreferences,
  privacyPolicyUrl,
}: ConsentBannerProps) {
  return (
    <div
      role="dialog"
      aria-label="Cerez izin banner'i"
      aria-modal="false"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        backgroundColor: 'var(--color-surface-elevated)',
        borderTop: '1px solid var(--color-border-subtle)',
        boxShadow: '0 -2px 12px rgba(0, 0, 0, 0.1)',
        padding: '16px 24px',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        {/* Bilgilendirme metni */}
        <div style={{ flex: 1, minWidth: '280px' }}>
          <p
            style={{
              margin: 0,
              fontSize: '14px',
              lineHeight: 1.6,
              color: 'var(--color-content-primary)',
            }}
          >
            Deneyiminizi iyilestirmek icin cerezler ve benzer teknolojiler kullaniyoruz.{' '}
            {privacyPolicyUrl && (
              <a
                href={privacyPolicyUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Gizlilik politikasi (yeni sekmede acilir)"
                style={{
                  color: 'var(--color-interactive-primary-bg)',
                  textDecoration: 'underline',
                }}
              >
                Gizlilik Politikasi
              </a>
            )}
          </p>
        </div>

        {/* Buton grubu */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {/* Tercihleri Yonet */}
          <button
            type="button"
            onClick={onManagePreferences}
            aria-label="Cerez tercihlerini yonet"
            style={{
              height: '40px',
              padding: '0 16px',
              fontSize: '14px',
              fontWeight: 600,
              borderRadius: '8px',
              border: '1px solid var(--color-border-subtle)',
              cursor: 'pointer',
              backgroundColor: 'transparent',
              color: 'var(--color-content-primary)',
            }}
          >
            Tercihleri Yonet
          </button>

          {/* Reddet */}
          <button
            type="button"
            onClick={onRejectAll}
            aria-label="Tum cerezleri reddet"
            style={{
              height: '40px',
              padding: '0 16px',
              fontSize: '14px',
              fontWeight: 600,
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              backgroundColor: 'var(--color-interactive-secondary-bg)',
              color: 'var(--color-interactive-secondary-fg)',
            }}
          >
            Reddet
          </button>

          {/* Tumunu Kabul Et */}
          <button
            type="button"
            onClick={onAcceptAll}
            aria-label="Tum cerezleri kabul et"
            style={{
              height: '40px',
              padding: '0 16px',
              fontSize: '14px',
              fontWeight: 600,
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              backgroundColor: 'var(--color-interactive-primary-bg)',
              color: 'var(--color-interactive-primary-fg)',
            }}
          >
            Tumunu Kabul Et
          </button>
        </div>
      </div>
    </div>
  );
}
