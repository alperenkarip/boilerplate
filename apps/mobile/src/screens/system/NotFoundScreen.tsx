// S05 — Not Found Screen (Mobile)
// Gecersiz rota veya bulunamayan icerik icin
import { Stack, Heading, Text } from '@project/ui';

export function NotFoundScreen() {
  return (
    <Stack
      gap={4}
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
      }}
    >
      <Heading level={2}>Sayfa Bulunamadi</Heading>
      <Text color="secondary" style={{ textAlign: 'center' }}>
        Aradiginiz icerik bulunamadi veya kaldirilmis olabilir.
      </Text>
    </Stack>
  );
}
