// C18.8 — CountdownTimer
// Geri sayim bileseni: OTP timeout, flash sale vb. icin

import { useEffect, useState, useCallback } from 'react';

interface CountdownTimerProps {
  /** Geri sayim suresi (saniye) */
  seconds: number;
  /** Geri sayim tamamlandiginda cagrilacak callback */
  onComplete?: () => void;
  /** Gosterim formati: dakika:saniye veya sadece saniye */
  format?: 'mm:ss' | 'ss';
}

/**
 * Kalan saniyeyi formata gore string'e donusturur
 */
function formatTime(remaining: number, format: 'mm:ss' | 'ss'): string {
  if (format === 'ss') {
    return `${remaining}`;
  }
  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export function CountdownTimer({ seconds, onComplete, format = 'mm:ss' }: CountdownTimerProps) {
  const [remaining, setRemaining] = useState(seconds);

  // seconds prop'u degistiginde sayaci sifirla
  useEffect(() => {
    setRemaining(seconds);
  }, [seconds]);

  const handleComplete = useCallback(() => {
    onComplete?.();
  }, [onComplete]);

  // Her saniye geri sayimi guncelle
  // @MX:WARN: [AUTO] setTimeout(handleComplete, 0) is not tracked by cleanup — fires parent callback even after unmount
  // @MX:REASON: only the interval is cleared on unmount; the deferred onComplete timer can run on a torn-down component
  useEffect(() => {
    if (remaining <= 0) {
      handleComplete();
      return;
    }

    const interval = setInterval(() => {
      setRemaining((prev) => {
        const next = prev - 1;
        if (next <= 0) {
          clearInterval(interval);
          // Tamamlanma callback'ini bir sonraki tick'te cagir
          setTimeout(handleComplete, 0);
          return 0;
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [remaining, handleComplete]);

  const isExpired = remaining <= 0;
  const isWarning = remaining > 0 && remaining <= 10;

  return (
    <time
      aria-live="polite"
      aria-label={`Kalan sure: ${formatTime(remaining, format)}`}
      style={{
        fontFamily: 'monospace',
        fontSize: '16px',
        fontWeight: 600,
        color: isExpired
          ? 'var(--color-text-subtle)'
          : isWarning
            ? 'var(--color-feedback-error-text)'
            : 'var(--color-text-default)',
        transition: 'color 200ms',
      }}
    >
      {formatTime(remaining, format)}
    </time>
  );
}
