// S10 — Forgot Password Screen (Mobile)
// Sifre sifirlama talep ekrani
import { useState } from 'react';
import { Stack, Heading, Text, TextField, Button } from '@project/ui';

export function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');

  const handleSubmit = () => {
    // Sifre sifirlama e-postasi gonder
    void email;
  };

  return (
    <Stack gap={6} style={{ flex: 1, justifyContent: 'center', padding: 24 }}>
      <Stack gap={2}>
        <Heading level={2}>Sifremi Unuttum</Heading>
        <Text color="secondary">
          E-posta adresinizi girin, size sifre sifirlama baglantisi gonderelim.
        </Text>
      </Stack>

      <Stack gap={4}>
        <TextField
          label="E-posta"
          type="email"
          placeholder="ornek@email.com"
          value={email}
          onChange={(e) => setEmail((e.target as any).value)}
        />
        <Button onClick={handleSubmit} fullWidth>
          Sifirlama Baglantisi Gonder
        </Button>
      </Stack>
    </Stack>
  );
}
