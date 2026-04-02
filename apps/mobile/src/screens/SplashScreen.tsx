// S01 — Splash Screen (Mobile-only)
// App acilis, branding, rehydration bekleme
import { Stack, Heading, Spinner } from '@project/ui';

export function SplashScreen() {
  return (
    <Stack
      gap={4}
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'var(--color-surface-default)',
      }}
    >
      <Heading level={1}>Boilerplate</Heading>
      <Spinner size={32} />
    </Stack>
  );
}
