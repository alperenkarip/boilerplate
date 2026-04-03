// C49 — InfiniteScrollList
// IntersectionObserver ile sonsuz scroll, listenin altinda yukleme gostergesi
import { type ReactNode, useRef, useEffect, useCallback } from 'react';

interface InfiniteScrollListProps {
  /** Liste icerigi */
  children: ReactNode;
  /** Daha fazla veri yukleme callback'i */
  onLoadMore: () => void;
  /** Yuklenecek daha fazla oge var mi */
  hasMore: boolean;
  /** Yukleme devam ediyor mu */
  isLoading: boolean;
}

export function InfiniteScrollList({
  children,
  onLoadMore,
  hasMore,
  isLoading,
}: InfiniteScrollListProps) {
  const sentinelRef = useRef<HTMLDivElement>(null);

  // IntersectionObserver ile listenin sonunu izle (web-only, mobile'da FlatList kullanilacak)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const IO = (globalThis as any).IntersectionObserver;

  const handleIntersect = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (entries: any[]) => {
      const entry = entries[0];
      if (entry?.isIntersecting && hasMore && !isLoading) {
        onLoadMore();
      }
    },
    [onLoadMore, hasMore, isLoading],
  );

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !IO) return;

    const observer = new IO(handleIntersect, {
      root: null,
      rootMargin: '100px',
      threshold: 0,
    });

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [handleIntersect, IO]);

  return (
    <div>
      {/* Liste icerigi */}
      {children}

      {/* Gozetleme noktasi (sentinel) — IntersectionObserver bunu izler */}
      <div ref={sentinelRef} style={{ height: '1px' }} />

      {/* Yukleme gostergesi */}
      {isLoading && (
        <div
          role="status"
          aria-label="Daha fazla yukleniyor"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px 0',
          }}
        >
          <svg
            width={20}
            height={20}
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
            style={{ animation: 'spin 1s linear infinite' }}
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="var(--color-interactive-primary-bg)"
              strokeWidth="3"
              strokeDasharray="31.4 31.4"
              strokeLinecap="round"
            />
          </svg>
          <span
            style={{
              marginLeft: '8px',
              fontSize: '13px',
              color: 'var(--color-content-secondary)',
            }}
          >
            Yukleniyor...
          </span>
        </div>
      )}

      {/* Liste sonu mesaji */}
      {!hasMore && !isLoading && (
        <div
          style={{
            textAlign: 'center',
            padding: '12px 0',
            fontSize: '13px',
            color: 'var(--color-content-tertiary)',
          }}
        >
          Tum ogeler yuklendi
        </div>
      )}
    </div>
  );
}
