// S08 — Login Screen (Mobile)
// Kullanici giris ekrani — AuthProvider.signIn ile baglandi
import { useState } from 'react';
import { Stack, Heading, Text, TextField, Button, Banner } from '@project/ui';
import { useNavigation } from '@react-navigation/native';

import { useAuth } from '../../auth/AuthProvider';
import type { AuthStackScreenProps, RootStackScreenProps } from '../../navigation/types';

export function LoginScreen() {
  const navigation = useNavigation<AuthStackScreenProps<'Login'>['navigation']>();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setError(null);
    setIsSubmitting(true);
    try {
      await signIn(email, password);
      // Basarili giris — kok navigator'i Main'e sifirla (geri tusu login'e donmez).
      navigation
        .getParent<RootStackScreenProps<'Auth'>['navigation']>()
        ?.reset({ index: 0, routes: [{ name: 'Main' }] });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Giris yapilamadi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Stack gap={6} style={{ flex: 1, justifyContent: 'center', padding: 24 }}>
      <Stack gap={2}>
        <Heading level={2}>Giris Yap</Heading>
        <Text color="secondary">Hesabiniza giris yapin</Text>
      </Stack>

      {error !== null && <Banner variant="error">{error}</Banner>}

      <Stack gap={4}>
        <TextField
          label="E-posta"
          type="email"
          autoCapitalize="none"
          placeholder="ornek@email.com"
          value={email}
          onChange={(e) => setEmail((e.target as unknown as { value: string }).value)}
        />
        <TextField
          label="Sifre"
          type="password"
          placeholder="Sifrenizi girin"
          value={password}
          onChange={(e) => setPassword((e.target as unknown as { value: string }).value)}
        />
        <Button
          onClick={() => {
            void handleSubmit();
          }}
          fullWidth
          isLoading={isSubmitting}
          isDisabled={isSubmitting}
        >
          Giris Yap
        </Button>
      </Stack>

      <Button variant="ghost" onClick={() => navigation.navigate('Register')}>
        Hesabiniz yok mu? Kayit olun.
      </Button>
    </Stack>
  );
}
