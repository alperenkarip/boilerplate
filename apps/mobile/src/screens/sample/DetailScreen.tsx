// S26 — Detail Screen (Mobile)
// Vertical slice — Firestore tekil okuma (onSnapshot) + callable delete
import { useEffect, useState } from 'react';
import { Stack, Heading, Text, Card, Button, Spinner, EmptyState, Banner } from '@project/ui';
import { useNavigation } from '@react-navigation/native';

import { CallableError } from '@project/core';
import { dataReadAdapter } from '../../firebase/dataReadAdapter';
import {
  deleteSampleItem,
  formatTimestamp,
  SAMPLE_ITEMS_COLLECTION,
  type SampleItem,
} from '../../firebase/sampleItems';
import type { SampleStackScreenProps } from '../../navigation/types';

interface DetailScreenProps {
  itemId?: string;
}

export function DetailScreen({ itemId }: DetailScreenProps) {
  const navigation = useNavigation<SampleStackScreenProps<'Detail'>['navigation']>();
  const [item, setItem] = useState<SampleItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (itemId === undefined) {
      setLoading(false);
      return;
    }
    const unsubscribe = dataReadAdapter.subscribeDocById<SampleItem>(
      SAMPLE_ITEMS_COLLECTION,
      itemId,
      (doc) => {
        setItem(doc);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      },
    );
    return unsubscribe;
  }, [itemId]);

  const handleDelete = async () => {
    if (itemId === undefined) return;
    setError(null);
    setIsDeleting(true);
    try {
      // Yazma yalnizca callable uzerinden (client direct-write yok).
      await deleteSampleItem({ id: itemId });
      navigation.navigate('List');
    } catch (err) {
      setError(err instanceof CallableError ? err.message : 'Kayit silinemedi.');
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <Stack gap={4} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Spinner size={32} />
      </Stack>
    );
  }

  if (item === null) {
    return (
      <Stack gap={4} style={{ flex: 1, padding: 24 }}>
        {error !== null && <Banner variant="error">{error}</Banner>}
        <EmptyState title="Kayit bulunamadi" description="Bu kayit silinmis veya erisilemiyor." />
        <Button variant="secondary" onClick={() => navigation.navigate('List')}>
          Listeye don
        </Button>
      </Stack>
    );
  }

  return (
    <Stack gap={6} style={{ flex: 1, padding: 24 }}>
      <Stack gap={2}>
        <Heading level={2}>Kayit Detayi</Heading>
        <Text variant="caption" color="secondary">
          ID: {item.id}
        </Text>
      </Stack>

      {error !== null && <Banner variant="error">{error}</Banner>}

      <Card padding={4}>
        <Stack gap={3}>
          <Stack gap={1}>
            <Text variant="caption" color="secondary">
              Baslik
            </Text>
            <Text weight="semibold">{item.title}</Text>
          </Stack>
          <Stack gap={1}>
            <Text variant="caption" color="secondary">
              Aciklama
            </Text>
            <Text>{item.description ?? '-'}</Text>
          </Stack>
          <Stack gap={1}>
            <Text variant="caption" color="secondary">
              Olusturulma Tarihi
            </Text>
            <Text>{formatTimestamp(item.createdAt)}</Text>
          </Stack>
          <Stack gap={1}>
            <Text variant="caption" color="secondary">
              Durum
            </Text>
            <Text>{item.status === 'active' ? 'Aktif' : 'Arsivlenmis'}</Text>
          </Stack>
        </Stack>
      </Card>

      <Stack gap={2} style={{ flexDirection: 'row' }}>
        <Button variant="secondary" onClick={() => navigation.navigate('List')}>
          Geri
        </Button>
        <Button onClick={() => navigation.navigate('Form', { itemId: item.id })}>Duzenle</Button>
        <Button
          variant="destructive"
          onClick={() => {
            void handleDelete();
          }}
          isLoading={isDeleting}
          isDisabled={isDeleting}
        >
          Sil
        </Button>
      </Stack>
    </Stack>
  );
}
