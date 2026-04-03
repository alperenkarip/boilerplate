// S25 — List Screen (Mobile)
// Vertical slice — ornek liste ekrani
import { Stack, Heading, Text, Card } from '@project/ui';

interface SampleItem {
  id: string;
  title: string;
  description: string;
}

const mockItems: SampleItem[] = [
  { id: '1', title: 'Ornek Kayit 1', description: 'Bu birinci ornek kayittir.' },
  { id: '2', title: 'Ornek Kayit 2', description: 'Bu ikinci ornek kayittir.' },
  { id: '3', title: 'Ornek Kayit 3', description: 'Bu ucuncu ornek kayittir.' },
  { id: '4', title: 'Ornek Kayit 4', description: 'Bu dorduncu ornek kayittir.' },
  { id: '5', title: 'Ornek Kayit 5', description: 'Bu besinci ornek kayittir.' },
];

export function ListScreen() {
  return (
    <Stack gap={4} style={{ flex: 1, padding: 24 }}>
      <Heading level={2}>Kayitlar</Heading>

      <Stack gap={3}>
        {mockItems.map((item) => (
          <Card
            key={item.id}
            padding={4}
            onClick={() => {
              // Detay ekranina navigasyon
            }}
          >
            <Stack gap={1}>
              <Text weight="semibold">{item.title}</Text>
              <Text variant="caption" color="secondary">
                {item.description}
              </Text>
            </Stack>
          </Card>
        ))}
      </Stack>
    </Stack>
  );
}
