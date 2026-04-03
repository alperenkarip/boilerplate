// 18.14 — AppLockScreen (Mobile-only)
// PIN veya biyometrik ile uygulama kilitleme ekrani

import { useState, useCallback } from 'react';

interface AppLockScreenProps {
  /** Biyometrik dogrulama callback'i */
  onBiometricAuth: () => void;
  /** PIN girisi tamamlandiginda callback */
  onPinSubmit: (pin: string) => void;
  /** Biyometrik dogrulama cihazda mevcut mu */
  biometricAvailable: boolean;
  /** Hata mesaji (yanlis PIN vb.) */
  errorMessage?: string;
  /** PIN hanesi — 4 veya 6 (varsayilan: 4) */
  pinLength?: 4 | 6;
}

/** Sayi tuslarini olusturan yardimci fonksiyon */
function getKeypadNumbers(): Array<string | null> {
  // 1-9, bos, 0, sil
  return ['1', '2', '3', '4', '5', '6', '7', '8', '9', null, '0', 'delete'];
}

export function AppLockScreen({
  onBiometricAuth,
  onPinSubmit,
  biometricAvailable,
  errorMessage,
  pinLength = 4,
}: AppLockScreenProps) {
  const [pin, setPin] = useState('');

  // PIN girisi tamamlandiginda otomatik gonder
  const handleDigitPress = useCallback(
    (digit: string) => {
      const newPin = pin + digit;
      if (newPin.length <= pinLength) {
        setPin(newPin);
        if (newPin.length === pinLength) {
          onPinSubmit(newPin);
          // Gonderildikten sonra sifirla
          setPin('');
        }
      }
    },
    [pin, pinLength, onPinSubmit],
  );

  // Son haneyi sil
  const handleDelete = useCallback(() => {
    setPin((prev) => prev.slice(0, -1));
  }, []);

  const keypadItems = getKeypadNumbers();

  return (
    <div
      role="dialog"
      aria-label="Uygulama kilidi ekrani"
      aria-modal="true"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        minHeight: '100vh',
        padding: '24px',
        backgroundColor: 'var(--color-surface-default)',
      }}
    >
      {/* Baslik */}
      <h2
        style={{
          fontSize: '20px',
          fontWeight: 700,
          color: 'var(--color-content-primary)',
          marginBottom: '8px',
          textAlign: 'center',
        }}
      >
        Uygulama Kilitli
      </h2>

      {/* Aciklama */}
      <p
        style={{
          fontSize: '14px',
          color: 'var(--color-content-secondary)',
          marginBottom: '32px',
          textAlign: 'center',
        }}
      >
        Devam etmek icin PIN kodunuzu girin
      </p>

      {/* PIN gosterge noktalari */}
      <div
        role="status"
        aria-label={`${pin.length} / ${pinLength} hane girildi`}
        style={{
          display: 'flex',
          gap: '16px',
          marginBottom: '16px',
        }}
      >
        {Array.from({ length: pinLength }).map((_, i) => (
          <div
            key={i}
            aria-hidden="true"
            style={{
              width: '16px',
              height: '16px',
              borderRadius: '50%',
              backgroundColor:
                i < pin.length ? 'var(--color-interactive-primary-bg)' : 'transparent',
              border: `2px solid ${
                i < pin.length
                  ? 'var(--color-interactive-primary-bg)'
                  : 'var(--color-border-subtle)'
              }`,
              transition: 'background-color 150ms, border-color 150ms',
            }}
          />
        ))}
      </div>

      {/* Hata mesaji */}
      {errorMessage && (
        <div
          role="alert"
          style={{
            fontSize: '13px',
            color: 'var(--color-feedback-error)',
            marginBottom: '16px',
            textAlign: 'center',
          }}
        >
          {errorMessage}
        </div>
      )}

      {/* Sayi tuslari */}
      <div
        role="group"
        aria-label="PIN giris tuslari"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 72px)',
          gap: '12px',
          marginBottom: '24px',
        }}
      >
        {keypadItems.map((item, idx) => {
          // Bos hucre
          if (item === null) {
            return <div key={idx} />;
          }

          // Silme tusu
          if (item === 'delete') {
            return (
              <button
                key={idx}
                type="button"
                onClick={handleDelete}
                aria-label="Son haneyi sil"
                disabled={pin.length === 0}
                style={{
                  width: '72px',
                  height: '72px',
                  borderRadius: '50%',
                  border: 'none',
                  backgroundColor: 'transparent',
                  cursor: pin.length === 0 ? 'not-allowed' : 'pointer',
                  opacity: pin.length === 0 ? 0.3 : 1,
                  fontSize: '20px',
                  color: 'var(--color-content-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                ←
              </button>
            );
          }

          // Sayi tusu
          return (
            <button
              key={idx}
              type="button"
              onClick={() => handleDigitPress(item)}
              aria-label={`Rakam ${item}`}
              disabled={pin.length >= pinLength}
              style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                border: '1px solid var(--color-border-subtle)',
                backgroundColor: 'var(--color-surface-elevated)',
                cursor: pin.length >= pinLength ? 'not-allowed' : 'pointer',
                fontSize: '24px',
                fontWeight: 500,
                color: 'var(--color-content-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background-color 100ms',
              }}
            >
              {item}
            </button>
          );
        })}
      </div>

      {/* Biyometrik dogrulama butonu */}
      {biometricAvailable && (
        <button
          type="button"
          onClick={onBiometricAuth}
          aria-label="Biyometrik dogrulama ile kilit ac"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            height: '44px',
            padding: '0 20px',
            borderRadius: '22px',
            border: '1px solid var(--color-border-subtle)',
            backgroundColor: 'transparent',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 600,
            color: 'var(--color-interactive-primary-bg)',
          }}
        >
          {/* Face ID / Touch ID ikonu (Unicode) */}
          <span aria-hidden="true" style={{ fontSize: '20px' }}>
            🔐
          </span>
          Biyometrik ile Gir
        </button>
      )}
    </div>
  );
}
