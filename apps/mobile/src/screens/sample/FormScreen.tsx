// S27 — Form Screen (Mobile)
// Vertical slice — ornek form ekrani (CRUD create/edit)
import { useState } from 'react';
import { Stack, Heading, Text, TextField, Button } from '@project/ui';

export function FormScreen() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = () => {
    // Kayit olusturma/guncelleme islemi
    void { title, description };
  };

  return (
    <Stack gap={6} style={{ flex: 1, padding: 24 }}>
      <Stack gap={2}>
        <Heading level={2}>Yeni Kayit</Heading>
        <Text color="secondary">Yeni bir kayit olusturmak icin formu doldurun.</Text>
      </Stack>

      <Stack gap={4}>
        <TextField
          label="Baslik"
          placeholder="Kayit basligini girin"
          value={title}
          onChange={(e) => setTitle((e.target as any).value)}
        />
        <TextField
          label="Aciklama"
          placeholder="Kayit aciklamasini girin"
          value={description}
          onChange={(e) => setDescription((e.target as any).value)}
        />
        <Stack gap={2} style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
          <Button
            variant="secondary"
            onClick={() => {
              /* Iptal / geri don */
            }}
          >
            Iptal
          </Button>
          <Button onClick={handleSubmit}>Kaydet</Button>
        </Stack>
      </Stack>
    </Stack>
  );
}
