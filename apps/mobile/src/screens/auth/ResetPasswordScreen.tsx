// S11 — Reset Password Screen (Mobile)
// Yeni sifre belirleme ekrani
import { useState } from 'react';
import { Stack, Heading, Text, TextField, Button } from '@project/ui';

export function ResetPasswordScreen() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = () => {
    // Sifre sifirlama islemi burada tetiklenir
    void { newPassword, confirmPassword };
  };

  return (
    <Stack gap={6} style={{ flex: 1, justifyContent: 'center', padding: 24 }}>
      <Stack gap={2}>
        <Heading level={2}>Yeni Sifre Belirle</Heading>
        <Text color="secondary">Yeni sifrenizi girin.</Text>
      </Stack>

      <Stack gap={4}>
        <TextField
          label="Yeni Sifre"
          type="password"
          placeholder="Yeni sifrenizi girin"
          value={newPassword}
          onChange={(e) => setNewPassword((e.target as any).value)}
        />
        <TextField
          label="Sifre Tekrar"
          type="password"
          placeholder="Sifrenizi tekrar girin"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword((e.target as any).value)}
        />
        <Button onClick={handleSubmit} fullWidth>
          Sifreyi Guncelle
        </Button>
      </Stack>
    </Stack>
  );
}
