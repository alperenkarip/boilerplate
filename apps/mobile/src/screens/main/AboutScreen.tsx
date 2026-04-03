// S24 — About Screen (Mobile)
// Hakkinda / yasal bilgiler ekrani
import { Stack, Heading, Text, Card } from '@project/ui';

export function AboutScreen() {
  return (
    <Stack gap={6} style={{ flex: 1, padding: 24 }}>
      <Heading level={2}>Hakkinda</Heading>

      <Card padding={4}>
        <Stack gap={3}>
          <Stack gap={1}>
            <Text variant="caption" color="secondary">
              Uygulama Surumu
            </Text>
            <Text>0.0.1</Text>
          </Stack>
          <Stack gap={1}>
            <Text variant="caption" color="secondary">
              Build Numarasi
            </Text>
            <Text>1</Text>
          </Stack>
          <Stack gap={1}>
            <Text variant="caption" color="secondary">
              Platform
            </Text>
            <Text>Mobile</Text>
          </Stack>
        </Stack>
      </Card>

      <Card padding={4}>
        <Stack gap={3}>
          <Text
            color="secondary"
            onClick={() => {
              /* Gizlilik Politikasi */
            }}
          >
            Gizlilik Politikasi
          </Text>
          <Text
            color="secondary"
            onClick={() => {
              /* Kullanim Kosullari */
            }}
          >
            Kullanim Kosullari
          </Text>
          <Text
            color="secondary"
            onClick={() => {
              /* Lisanslar */
            }}
          >
            Acik Kaynak Lisanslari
          </Text>
        </Stack>
      </Card>

      <Text variant="caption" color="tertiary" style={{ textAlign: 'center' }}>
        © 2026 Boilerplate. Tum haklari saklidir.
      </Text>
    </Stack>
  );
}
