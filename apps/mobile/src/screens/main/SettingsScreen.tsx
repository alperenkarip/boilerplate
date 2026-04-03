// S20 — Settings Screen (Mobile)
// Ayarlar ekrani — gorunum, hesap, bilgi bolumleri
import { Stack, Heading, Text, Card } from '@project/ui';

export function SettingsScreen() {
  return (
    <Stack gap={6} style={{ flex: 1, padding: 24 }}>
      <Heading level={2}>Ayarlar</Heading>

      <Card padding={4}>
        <Stack gap={3}>
          <Text weight="semibold">Gorunum</Text>
          <Stack
            gap={0}
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Text>Karanlik Mod</Text>
            <Text color="secondary">Acik / Kapali</Text>
          </Stack>
        </Stack>
      </Card>

      <Card padding={4}>
        <Stack gap={3}>
          <Text weight="semibold">Hesap</Text>
          <Text color="secondary">Profil</Text>
          <Text color="secondary">Bildirim Tercihleri</Text>
          <Text color="secondary">Sifre Degistir</Text>
        </Stack>
      </Card>

      <Card padding={4}>
        <Stack gap={3}>
          <Text weight="semibold">Bilgi</Text>
          <Text color="secondary">Hakkinda</Text>
          <Text color="secondary">Hesabi Sil</Text>
        </Stack>
      </Card>
    </Stack>
  );
}
