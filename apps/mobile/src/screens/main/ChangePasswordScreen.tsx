// S22 — Change Password Screen (Mobile)
// Sifre degistirme ekrani
import { useState } from 'react';
import { Stack, Heading, TextField, Button } from '@project/ui';

export function ChangePasswordScreen() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = () => {
    // Sifre degistirme islemi
    void { currentPassword, newPassword, confirmPassword };
  };

  return (
    <Stack gap={6} style={{ flex: 1, padding: 24 }}>
      <Heading level={2}>Sifre Degistir</Heading>

      <Stack gap={4}>
        <TextField
          label="Mevcut Sifre"
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword((e.target as any).value)}
        />
        <TextField
          label="Yeni Sifre"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword((e.target as any).value)}
        />
        <TextField
          label="Yeni Sifre (Tekrar)"
          type="password"
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
