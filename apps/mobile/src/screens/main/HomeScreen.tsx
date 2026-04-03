// S17 — Home Screen (Mobile)
// Ana sayfa / dashboard
import { Stack, Heading, Text, Card, Button } from '@project/ui';

export function HomeScreen() {
  return (
    <Stack gap={6} style={{ flex: 1, padding: 24 }}>
      <Stack gap={2}>
        <Heading level={1}>Ana Sayfa</Heading>
        <Text color="secondary">Hosgeldiniz! Uygulamanizi buradan yonetin.</Text>
      </Stack>

      <Card padding={4}>
        <Stack gap={3}>
          <Text weight="semibold">Hizli Islemler</Text>
          <Stack gap={2} style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            <Button
              variant="secondary"
              onClick={() => {
                /* Kayitlari goruntule */
              }}
            >
              Kayitlari Gor
            </Button>
            <Button
              onClick={() => {
                /* Yeni kayit olustur */
              }}
            >
              Yeni Olustur
            </Button>
          </Stack>
        </Stack>
      </Card>

      <Card padding={4}>
        <Stack gap={3}>
          <Text weight="semibold">Navigasyon</Text>
          <Stack gap={2}>
            <Text color="secondary">• Profil</Text>
            <Text color="secondary">• Ayarlar</Text>
            <Text color="secondary">• Hakkinda</Text>
          </Stack>
        </Stack>
      </Card>
    </Stack>
  );
}
