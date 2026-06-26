// S10 — Forgot Password Screen (Mobile)
// Sifre sifirlama talep ekrani — AuthProvider.sendPasswordReset ile baglandi
import { useState } from 'react';
import { Stack, Heading, Text, TextField, Button, Banner } from '@project/ui';
import { useNavigation } from '@react-navigation/native';

import { useAuth } from '../../auth/AuthProvider';
import type { AuthStackScreenProps } from '../../navigation/types';

export function ForgotPasswordScreen() {
  const navigation = useNavigation<AuthStackScreenProps<'ForgotPassword'>['navigation']>();
  const { sendPasswordReset } = useAuth();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setError(null);
    setIsSubmitting(true);
    try {
      await sendPasswordReset(email);
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sifirlama baglantisi gonderilemedi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Stack gap={6} style={{ flex: 1, justifyContent: 'center', padding: 24 }}>
      <Stack gap={2}>
        <Heading level={2}>Sifremi Unuttum</Heading>
        <Text color="secondary">
          E-posta adresinizi girin, size sifre sifirlama baglantisi gonderelim.
        </Text>
      </Stack>

      {error !== null && <Banner variant="error">{error}</Banner>}
      {sent && (
        <Banner variant="success">
          Sifirlama baglantisi gonderildi. Lutfen gelen kutunuzu kontrol edin.
        </Banner>
      )}

      <Stack gap={4}>
        <TextField
          label="E-posta"
          type="email"
          autoCapitalize="none"
          placeholder="ornek@email.com"
          value={email}
          onChange={(e) => setEmail((e.target as unknown as { value: string }).value)}
        />
        <Button
          onClick={() => {
            void handleSubmit();
          }}
          fullWidth
          isLoading={isSubmitting}
          isDisabled={isSubmitting}
        >
          Sifirlama Baglantisi Gonder
        </Button>
      </Stack>

      <Button variant="ghost" onClick={() => navigation.navigate('Login')}>
        Giris ekranina don
      </Button>
    </Stack>
  );
}
