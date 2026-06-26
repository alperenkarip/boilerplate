// S25 — List Screen (Mobile)
// Vertical slice — owner-scoped Firestore okumasi (onSnapshot, ownerId == uid)
import { useEffect, useState } from 'react';
import { Stack, Heading, Text, Card, Button, Spinner, EmptyState, Banner } from '@project/ui';
import { useNavigation } from '@react-navigation/native';

import { useAuth } from '../../auth/AuthProvider';
import { dataReadAdapter } from '../../firebase/dataReadAdapter';
import { SAMPLE_ITEMS_COLLECTION, type SampleItem } from '../../firebase/sampleItems';
import type { SampleStackScreenProps } from '../../navigation/types';

export function ListScreen() {
  const navigation = useNavigation<SampleStackScreenProps<'List'>['navigation']>();
  const { summary } = useAuth();
  const ownerId = summary?.userId ?? null;
  // null = yukleniyor, [] = bos liste.
  const [items, setItems] = useState<SampleItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (ownerId === null) {
      setItems([]);
      return;
    }
    setError(null);
    // Owner-scoped gercek zamanli okuma (Security Rules ownerId == uid zorunlu kilar).
    const unsubscribe = dataReadAdapter.subscribeList<SampleItem>(
      SAMPLE_ITEMS_COLLECTION,
      {
        where: [{ field: 'ownerId', op: '==', value: ownerId }],
        orderBy: [{ field: 'createdAt', direction: 'desc' }],
      },
      setItems,
      (err) => {
        setError(err.message);
      },
    );
    return unsubscribe;
  }, [ownerId]);

  return (
    <Stack gap={4} style={{ flex: 1, padding: 24 }}>
      <Stack
        gap={2}
        style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
      >
        <Heading level={2}>Kayitlar</Heading>
        <Button size="sm" onClick={() => navigation.navigate('Form', {})}>
          Yeni
        </Button>
      </Stack>

      {error !== null && <Banner variant="error">{error}</Banner>}

      {items === null && <Spinner size={32} />}

      {items !== null && items.length === 0 && (
        <EmptyState
          title="Kayit yok"
          description="Ilk kaydinizi olusturmak icin Yeni'ye dokunun."
        />
      )}

      {items !== null && items.length > 0 && (
        <Stack gap={3}>
          {items.map((item) => (
            <Card
              key={item.id}
              padding={4}
              onClick={() => navigation.navigate('Detail', { itemId: item.id })}
            >
              <Stack gap={1}>
                <Text weight="semibold">{item.title}</Text>
                {item.description ? (
                  <Text variant="caption" color="secondary">
                    {item.description}
                  </Text>
                ) : null}
              </Stack>
            </Card>
          ))}
        </Stack>
      )}
    </Stack>
  );
}
