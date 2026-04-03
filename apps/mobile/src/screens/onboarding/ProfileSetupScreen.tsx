// S16 — Profile Setup Screen (Mobile)
// Yeni kullanici profil tamamlama formu
import { useState } from 'react';
import { Stack, Heading, Text, TextField, Button } from '@project/ui';

export function ProfileSetupScreen() {
  const [displayName, setDisplayName] = useState('');
  const [phone, setPhone] = useState('');
  const [birthDate, setBirthDate] = useState('');

  const handleSubmit = () => {
    // Profil kaydetme islemi
    void { displayName, phone, birthDate };
  };

  return (
    <Stack gap={6} style={{ flex: 1, padding: 24 }}>
      <Stack gap={2}>
        <Heading level={2}>Profilini Tamamla</Heading>
        <Text color="secondary">Birka bilgi daha ve hazirsin!</Text>
      </Stack>

      <Stack gap={4}>
        <TextField
          label="Gorunen Ad"
          placeholder="Adinizi girin"
          value={displayName}
          onChange={(e) => setDisplayName((e.target as any).value)}
        />
        <TextField
          label="Telefon"
          placeholder="+90 5XX XXX XXXX"
          value={phone}
          onChange={(e) => setPhone((e.target as any).value)}
        />
        <TextField
          label="Dogum Tarihi"
          placeholder="GG/AA/YYYY"
          value={birthDate}
          onChange={(e) => setBirthDate((e.target as any).value)}
        />
        <Button onClick={handleSubmit} fullWidth>
          Tamamla
        </Button>
      </Stack>
    </Stack>
  );
}
