// C34 — Skeleton
interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  rounded?: boolean;
}

export function Skeleton({ width = '100%', height = 16, rounded = false }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      style={{
        width,
        height,
        borderRadius: rounded ? '50%' : '4px',
        backgroundColor: 'var(--color-surface-subtle)',
        animation: 'skeleton-pulse 1.5s ease-in-out infinite',
      }}
    />
  );
}
