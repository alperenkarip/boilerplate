// C25 — Avatar
interface AvatarProps {
  name: string;
  src?: string;
  size?: number;
}

export function Avatar({ name, src, size = 40 }: AvatarProps) {
  const initials = name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
  return src ? (
    <img
      src={src}
      alt={name}
      width={size}
      height={size}
      style={{ borderRadius: '50%', objectFit: 'cover' }}
    />
  ) : (
    <div
      aria-label={name}
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        backgroundColor: 'var(--color-interactive-primary-bg)',
        color: 'var(--color-interactive-primary-fg)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: size * 0.4,
        fontWeight: 600,
      }}
    >
      {initials}
    </div>
  );
}
