// @MX:TODO: [AUTO] No test file — initial undefined return and ref update timing are untested
import { useEffect, useRef } from 'react';

/**
 * Onceki render'daki degeri dondurur.
 * Ilk render'da undefined doner.
 */
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T | undefined>(undefined);

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}
