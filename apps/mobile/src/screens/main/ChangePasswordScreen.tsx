// S22 — Change Password Screen (Mobile)
// Sifre degistirme ekrani — AuthProvider.updatePassword ile baglandi
import { useState } from 'react';
import { Stack, Heading, TextField, Button, Banner } from '@project/ui';

import { useAuth } from '../../auth/AuthProvider';

export function ChangePasswordScreen() {
  const { updatePassword } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setError(null);
    setSuccess(false);
    // currentPassword UX icin / ileride reauthenticate() adimi icin toplanir.
    // AuthPort.updatePassword taze oturuma dayanir, aksi halde
    // 'auth/requires-recent-login' firlatir (reauth henuz port'ta yok).
    if (currentPassword.length === 0) {
      setError('Mevcut sifrenizi girin.');
      return;
    }
    if (newPassword.length < 6) {
      setError('Yeni sifre en az 6 karakter olmali.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Yeni sifreler eslesmiyor.');
      return;
    }
    setIsSubmitting(true);
    try {
      await updatePassword(newPassword);
      setSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sifre guncellenemedi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Stack gap={6} style={{ flex: 1, padding: 24 }}>
      <Heading level={2}>Sifre Degistir</Heading>

      {error !== null && <Banner variant="error">{error}</Banner>}
      {success && <Banner variant="success">Sifreniz guncellendi.</Banner>}

      <Stack gap={4}>
        <TextField
          label="Mevcut Sifre"
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword((e.target as unknown as { value: string }).value)}
        />
        <TextField
          label="Yeni Sifre"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword((e.target as unknown as { value: string }).value)}
        />
        <TextField
          label="Yeni Sifre (Tekrar)"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword((e.target as unknown as { value: string }).value)}
        />
        <Button
          onClick={() => {
            void handleSubmit();
          }}
          fullWidth
          isLoading={isSubmitting}
          isDisabled={isSubmitting}
        >
          Sifreyi Guncelle
        </Button>
      </Stack>
    </Stack>
  );
}
