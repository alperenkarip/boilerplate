// S11 — Reset Password Screen (Mobile)
// Yeni sifre belirleme ekrani — AuthProvider.confirmPasswordReset (action-code) ile baglandi.
// oobCode, sifirlama derin baglantisindan route param 'token' ile gelir.
import { useState } from 'react';
import { Stack, Heading, Text, TextField, Button, Banner } from '@project/ui';
import { useNavigation, useRoute } from '@react-navigation/native';

import { useAuth } from '../../auth/AuthProvider';
import type { AuthStackScreenProps } from '../../navigation/types';

export function ResetPasswordScreen() {
  const navigation = useNavigation<AuthStackScreenProps<'ResetPassword'>['navigation']>();
  const route = useRoute<AuthStackScreenProps<'ResetPassword'>['route']>();
  const { confirmPasswordReset } = useAuth();
  const oobCode = route.params?.token;
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setError(null);
    if (oobCode === undefined || oobCode.length === 0) {
      setError('Gecersiz veya eksik sifirlama baglantisi.');
      return;
    }
    if (newPassword.length < 6) {
      setError('Yeni sifre en az 6 karakter olmali.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Sifreler eslesmiyor.');
      return;
    }
    setIsSubmitting(true);
    try {
      await confirmPasswordReset(oobCode, newPassword);
      // Sifre guncellendi — yeni sifreyle giris icin Login'e don.
      navigation.navigate('Login');
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Sifreniz guncellenemedi. Baglanti suresi dolmus olabilir.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Stack gap={6} style={{ flex: 1, justifyContent: 'center', padding: 24 }}>
      <Stack gap={2}>
        <Heading level={2}>Yeni Sifre Belirle</Heading>
        <Text color="secondary">Yeni sifrenizi girin.</Text>
      </Stack>

      {error !== null && <Banner variant="error">{error}</Banner>}

      <Stack gap={4}>
        <TextField
          label="Yeni Sifre"
          type="password"
          placeholder="Yeni sifrenizi girin"
          value={newPassword}
          onChange={(e) => setNewPassword((e.target as unknown as { value: string }).value)}
        />
        <TextField
          label="Sifre Tekrar"
          type="password"
          placeholder="Sifrenizi tekrar girin"
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
