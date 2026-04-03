// S09 — Register Screen (Mobile)
// Yeni kullanici kayit ekrani
import { useState } from 'react';
import { Stack, Heading, Text, TextField, Button } from '@project/ui';

export function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = () => {
    // Kayit islemi burada tetiklenir
    void { name, email, password };
  };

  return (
    <Stack gap={6} style={{ flex: 1, justifyContent: 'center', padding: 24 }}>
      <Stack gap={2}>
        <Heading level={2}>Kayit Ol</Heading>
        <Text color="secondary">Yeni bir hesap olusturun</Text>
      </Stack>

      <Stack gap={4}>
        <TextField
          label="Ad Soyad"
          placeholder="Adinizi girin"
          value={name}
          onChange={(e) => setName((e.target as any).value)}
        />
        <TextField
          label="E-posta"
          type="email"
          placeholder="ornek@email.com"
          value={email}
          onChange={(e) => setEmail((e.target as any).value)}
        />
        <TextField
          label="Sifre"
          type="password"
          placeholder="Sifre belirleyin"
          value={password}
          onChange={(e) => setPassword((e.target as any).value)}
        />
        <Button onClick={handleSubmit} fullWidth>
          Kayit Ol
        </Button>
      </Stack>

      <Text color="secondary" style={{ textAlign: 'center', fontSize: 14 }}>
        Zaten hesabiniz var mi? Giris yapin.
      </Text>
    </Stack>
  );
}
