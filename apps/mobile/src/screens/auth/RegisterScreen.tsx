// S09 — Register Screen (Mobile)
// Yeni kullanici kayit ekrani — AuthProvider.signUp ile baglandi
import { useState } from 'react';
import { Stack, Heading, Text, TextField, Button, Banner } from '@project/ui';
import { useNavigation } from '@react-navigation/native';

import { useAuth } from '../../auth/AuthProvider';
import type { AuthStackScreenProps, RootStackScreenProps } from '../../navigation/types';

export function RegisterScreen() {
  const navigation = useNavigation<AuthStackScreenProps<'Register'>['navigation']>();
  const { signUp, updateProfile } = useAuth();
  // signUp(email, password) ad alanini tasimaz; displayName, signUp sonrasi
  // updateProfile ile best-effort persist edilir.
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setError(null);
    setIsSubmitting(true);
    try {
      await signUp(email, password);
      const trimmedName = name.trim();
      if (trimmedName.length > 0) {
        // Best-effort: hesap zaten olusturuldu; displayName hatasi kayit akisini bozmamali.
        await updateProfile({ displayName: trimmedName }).catch(() => undefined);
      }
      // Firebase signUp kullaniciyi otomatik oturum acar — kok navigator'i Main'e sifirla.
      navigation
        .getParent<RootStackScreenProps<'Auth'>['navigation']>()
        ?.reset({ index: 0, routes: [{ name: 'Main' }] });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kayit olusturulamadi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Stack gap={6} style={{ flex: 1, justifyContent: 'center', padding: 24 }}>
      <Stack gap={2}>
        <Heading level={2}>Kayit Ol</Heading>
        <Text color="secondary">Yeni bir hesap olusturun</Text>
      </Stack>

      {error !== null && <Banner variant="error">{error}</Banner>}

      <Stack gap={4}>
        <TextField
          label="Ad Soyad"
          placeholder="Adinizi girin"
          value={name}
          onChange={(e) => setName((e.target as unknown as { value: string }).value)}
        />
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
          placeholder="Sifre belirleyin"
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
          Kayit Ol
        </Button>
      </Stack>

      <Button variant="ghost" onClick={() => navigation.navigate('Login')}>
        Zaten hesabiniz var mi? Giris yapin.
      </Button>
    </Stack>
  );
}
