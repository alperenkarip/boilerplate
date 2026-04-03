// S18 — Profile Screen (Mobile)
// Kullanici profil goruntuleme ekrani
import { Stack, Heading, Text, Card, Button } from '@project/ui';

export function ProfileScreen() {
  return (
    <Stack gap={6} style={{ flex: 1, padding: 24 }}>
      <Card padding={6}>
        <Stack gap={4} style={{ alignItems: 'center' }}>
          {/* Avatar placeholder */}
          <Stack
            style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              backgroundColor: 'var(--color-surface-elevated)',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text style={{ fontSize: 32 }}>KA</Text>
          </Stack>
          <Stack gap={1} style={{ alignItems: 'center' }}>
            <Heading level={3}>Kullanici Adi</Heading>
            <Text color="secondary">kullanici@email.com</Text>
          </Stack>
          <Button
            variant="secondary"
            onClick={() => {
              /* Profil duzenle navigasyonu */
            }}
          >
            Profili Duzenle
          </Button>
        </Stack>
      </Card>

      <Card padding={4}>
        <Stack gap={3}>
          <Stack gap={1}>
            <Text variant="caption" color="secondary">
              E-posta
            </Text>
            <Text>kullanici@email.com</Text>
          </Stack>
          <Stack gap={1}>
            <Text variant="caption" color="secondary">
              Telefon
            </Text>
            <Text>+90 555 123 4567</Text>
          </Stack>
          <Stack gap={1}>
            <Text variant="caption" color="secondary">
              Katilim Tarihi
            </Text>
            <Text>2026-04-01</Text>
          </Stack>
        </Stack>
      </Card>
    </Stack>
  );
}
