// S07 — Full-screen Loading (App Bootstrap)
import { Stack, Spinner } from '@project/ui';

export function Component() {
  return (
    <Stack gap={4} style={{ minHeight: '100vh', justifyContent: 'center', alignItems: 'center' }}>
      <Spinner size={40} />
    </Stack>
  );
}
