// S08 — Login Screen (Mobile)
// Kullanici giris ekrani
import { useState } from 'react';
import { Stack, Heading, Text, TextField, Button } from '@project/ui';

export function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = () => {
    // Giris islemi burada tetiklenir
    void { email, password };
  };

  return (
    <Stack gap={6} style={{ flex: 1, justifyContent: 'center', padding: 24 }}>
      <Stack gap={2}>
        <Heading level={2}>Giris Yap</Heading>
        <Text color="secondary">Hesabiniza giris yapin</Text>
      </Stack>

      <Stack gap={4}>
        <TextField
          label="E-posta"
          placeholder="ornek@email.com"
          value={email}
          onChange={(e) => setEmail((e.target as any).value)}
        />
        <TextField
          label="Sifre"
          type="password"
          placeholder="Sifrenizi girin"
          value={password}
          onChange={(e) => setPassword((e.target as any).value)}
        />
        <Button onClick={handleSubmit} fullWidth>
          Giris Yap
        </Button>
      </Stack>

      <Text color="secondary" style={{ textAlign: 'center', fontSize: 14 }}>
        Hesabiniz yok mu? Kayit olun.
      </Text>
    </Stack>
  );
}
