// S26 — Detail Screen (Mobile)
// Vertical slice — ornek detay ekrani
import { Stack, Heading, Text, Card, Button } from '@project/ui';

interface DetailScreenProps {
  itemId?: string;
}

export function DetailScreen({ itemId }: DetailScreenProps) {
  return (
    <Stack gap={6} style={{ flex: 1, padding: 24 }}>
      <Stack gap={2}>
        <Heading level={2}>Kayit Detayi</Heading>
        <Text variant="caption" color="secondary">
          ID: {itemId ?? '1'}
        </Text>
      </Stack>

      <Card padding={4}>
        <Stack gap={3}>
          <Stack gap={1}>
            <Text variant="caption" color="secondary">
              Baslik
            </Text>
            <Text weight="semibold">Ornek Kayit</Text>
          </Stack>
          <Stack gap={1}>
            <Text variant="caption" color="secondary">
              Aciklama
            </Text>
            <Text>
              Bu bir ornek kayit detayidir. Gercek veriler backend entegrasyonu sonrasinda
              gelecektir.
            </Text>
          </Stack>
          <Stack gap={1}>
            <Text variant="caption" color="secondary">
              Olusturulma Tarihi
            </Text>
            <Text>2026-04-01</Text>
          </Stack>
          <Stack gap={1}>
            <Text variant="caption" color="secondary">
              Durum
            </Text>
            <Text>Aktif</Text>
          </Stack>
        </Stack>
      </Card>

      <Stack gap={2} style={{ flexDirection: 'row' }}>
        <Button
          variant="secondary"
          onClick={() => {
            /* Geri don */
          }}
        >
          Geri
        </Button>
        <Button
          onClick={() => {
            /* Duzenle */
          }}
        >
          Duzenle
        </Button>
      </Stack>
    </Stack>
  );
}
