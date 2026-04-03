// S15 — Permission Primer Screen (Mobile)
// Izin on-bilgilendirme ekrani — bildirim, konum, kamera
import { Stack, Heading, Text, Button, Card } from '@project/ui';

const permissions = [
  {
    key: 'notifications',
    icon: '🔔',
    title: 'Bildirimler',
    description: 'Onemli guncellemelerden haberdar olun.',
  },
  { key: 'location', icon: '📍', title: 'Konum', description: 'Size yakin hizmetleri gosterelim.' },
  {
    key: 'camera',
    icon: '📷',
    title: 'Kamera',
    description: 'Profil fotografi cekmek icin kullanilir.',
  },
];

export function PermissionPrimerScreen() {
  return (
    <Stack gap={6} style={{ flex: 1, padding: 24 }}>
      <Stack gap={2} style={{ alignItems: 'center' }}>
        <Heading level={2}>Izinler</Heading>
        <Text color="secondary" style={{ textAlign: 'center' }}>
          En iyi deneyim icin asagidaki izinlere ihtiyacimiz var.
        </Text>
      </Stack>

      <Stack gap={3}>
        {permissions.map((p) => (
          <Card key={p.key} padding={4}>
            <Stack gap={1}>
              <Text style={{ fontSize: 24 }}>{p.icon}</Text>
              <Text weight="semibold">{p.title}</Text>
              <Text variant="caption" color="secondary">
                {p.description}
              </Text>
            </Stack>
          </Card>
        ))}
      </Stack>

      <Stack gap={2}>
        <Button
          fullWidth
          onClick={() => {
            /* Izin isteklerini tetikle */
          }}
        >
          Devam Et
        </Button>
        <Button
          variant="ghost"
          fullWidth
          onClick={() => {
            /* Atla */
          }}
        >
          Simdilik Atla
        </Button>
      </Stack>
    </Stack>
  );
}
