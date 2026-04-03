// S04 — Maintenance Screen (Mobile)
// Bakim modu aktifken gosterilir
import { Stack, Heading, Text } from '@project/ui';

export function MaintenanceScreen() {
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
      <Heading level={2}>Bakim Calismasi</Heading>
      <Text color="secondary" style={{ textAlign: 'center' }}>
        Uygulama su anda bakim nedeniyle gecici olarak kullanilamaz. Lutfen daha sonra tekrar
        deneyin.
      </Text>
    </Stack>
  );
}
