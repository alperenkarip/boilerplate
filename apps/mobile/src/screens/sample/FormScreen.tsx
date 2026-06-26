// S27 — Form Screen (Mobile)
// Vertical slice — callable create/update (yazma yalnizca Cloud Functions)
// useMutation kullanir; offline yazmalar offlineQueue ile duraklatilip yeniden oynatilir.
import { useEffect, useState } from 'react';
import { Stack, Heading, Text, TextField, Button, Banner } from '@project/ui';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useMutation } from '@tanstack/react-query';

import { CallableError } from '@project/core';
import { dataReadAdapter } from '../../firebase/dataReadAdapter';
import {
  createSampleItem,
  SAMPLE_ITEMS_COLLECTION,
  updateSampleItem,
  type SampleItem,
} from '../../firebase/sampleItems';
import type { SampleStackScreenProps } from '../../navigation/types';

export function FormScreen() {
  const navigation = useNavigation<SampleStackScreenProps<'Form'>['navigation']>();
  const route = useRoute<SampleStackScreenProps<'Form'>['route']>();
  const itemId = route.params?.itemId;
  const isEdit = itemId !== undefined;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Duzenleme modunda mevcut kaydi yukleyip formu doldur.
  useEffect(() => {
    if (itemId === undefined) return;
    let active = true;
    const load = async () => {
      const existing = await dataReadAdapter.getDocById<SampleItem>(
        SAMPLE_ITEMS_COLLECTION,
        itemId,
      );
      if (active && existing !== null) {
        setTitle(existing.title);
        setDescription(existing.description ?? '');
      }
    };
    void load();
    return () => {
      active = false;
    };
  }, [itemId]);

  const mutation = useMutation({
    mutationFn: () => {
      const trimmedDescription = description.length > 0 ? description : undefined;
      return itemId === undefined
        ? createSampleItem({ title, description: trimmedDescription })
        : updateSampleItem({ id: itemId, title, description: trimmedDescription });
    },
    onSuccess: () => {
      navigation.navigate('List');
    },
    onError: (err) => {
      setError(err instanceof CallableError ? err.message : 'Kayit kaydedilemedi.');
    },
  });

  const handleSubmit = () => {
    setError(null);
    mutation.mutate();
  };

  return (
    <Stack gap={6} style={{ flex: 1, padding: 24 }}>
      <Stack gap={2}>
        <Heading level={2}>{isEdit ? 'Kaydi Duzenle' : 'Yeni Kayit'}</Heading>
        <Text color="secondary">
          {isEdit
            ? 'Kayit bilgilerini guncelleyin.'
            : 'Yeni bir kayit olusturmak icin formu doldurun.'}
        </Text>
      </Stack>

      {error !== null && <Banner variant="error">{error}</Banner>}

      <Stack gap={4}>
        <TextField
          label="Baslik"
          placeholder="Kayit basligini girin"
          value={title}
          onChange={(e) => setTitle((e.target as unknown as { value: string }).value)}
        />
        <TextField
          label="Aciklama"
          placeholder="Kayit aciklamasini girin"
          value={description}
          onChange={(e) => setDescription((e.target as unknown as { value: string }).value)}
        />
        <Stack gap={2} style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
          <Button variant="secondary" onClick={() => navigation.navigate('List')}>
            Iptal
          </Button>
          <Button
            onClick={handleSubmit}
            isLoading={mutation.isPending}
            isDisabled={mutation.isPending || title.length === 0}
          >
            Kaydet
          </Button>
        </Stack>
      </Stack>
    </Stack>
  );
}
