// S07 — Loading Screen (Mobile)
// Uygulama yukleme/bootstrap sirasinda gosterilir
import { Stack, Spinner } from '@project/ui';

export function LoadingScreen() {
  return (
    <Stack
      gap={4}
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Spinner size={40} />
    </Stack>
  );
}
