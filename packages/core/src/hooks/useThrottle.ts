// @MX:TODO: [AUTO] No test file — throttle interval, timer cleanup, and rapid-fire inputs are untested
import { useEffect, useRef, useState } from 'react';

/**
 * Verilen degeri belirtilen aralik suresinde throttle eder.
 * Aralik suresi icinde gelen guncellemeler biriktirilir ve
 * aralik sonunda en son deger uygulanir.
 */
export function useThrottle<T>(value: T, interval: number): T {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const lastUpdated = useRef<number>(Date.now());
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const now = Date.now();
    const elapsed = now - lastUpdated.current;

    if (elapsed >= interval) {
      // Aralik suresi dolmus, hemen guncelle
      lastUpdated.current = now;
      setThrottledValue(value);
    } else {
      // Aralik dolana kadar bekle, sonra guncelle
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        lastUpdated.current = Date.now();
        setThrottledValue(value);
        timeoutRef.current = null;
      }, interval - elapsed);
    }

    return () => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [value, interval]);

  return throttledValue;
}
