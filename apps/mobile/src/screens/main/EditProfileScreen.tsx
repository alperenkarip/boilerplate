// S19 — Edit Profile Screen (Mobile)
// Profil duzenleme formu
import { useState } from 'react';
import { Stack, Heading, TextField, Button } from '@project/ui';

export function EditProfileScreen() {
  const [displayName, setDisplayName] = useState('Kullanici Adi');
  const [phone, setPhone] = useState('+90 555 123 4567');

  const handleSave = () => {
    // Profil guncelleme islemi
    void { displayName, phone };
  };

  return (
    <Stack gap={6} style={{ flex: 1, padding: 24 }}>
      <Heading level={2}>Profili Duzenle</Heading>

      <Stack gap={4}>
        <TextField
          label="Gorunen Ad"
          value={displayName}
          onChange={(e) => setDisplayName((e.target as any).value)}
        />
        <TextField
          label="Telefon"
          value={phone}
          onChange={(e) => setPhone((e.target as any).value)}
        />
        <Stack gap={2} style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
          <Button
            variant="secondary"
            onClick={() => {
              /* Geri don */
            }}
          >
            Iptal
          </Button>
          <Button onClick={handleSave}>Kaydet</Button>
        </Stack>
      </Stack>
    </Stack>
  );
}
