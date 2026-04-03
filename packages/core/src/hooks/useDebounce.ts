// @MX:TODO: [AUTO] No test file — debounce timing, cleanup, and edge cases are untested
import { useEffect, useState } from 'react';

/**
 * Verilen degeri belirtilen gecikme suresi kadar debounce eder.
 * Gecikme suresi dolmadan deger tekrar degisirse zamanlayici sifirlanir.
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Unmount veya deger degistiginde onceki zamanlayiciyi temizle
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
