// S16 — Profile Setup Screen (Mobile)
// Yeni kullanici profil tamamlama formu — AuthProvider.updateProfile (displayName) ile baglandi
import { useState } from 'react';
import { Stack, Heading, Text, TextField, Button, Banner } from '@project/ui';
import { useNavigation } from '@react-navigation/native';

import { useAuth } from '../../auth/AuthProvider';
import type { OnboardingStackScreenProps, RootStackScreenProps } from '../../navigation/types';

export function ProfileSetupScreen() {
  const navigation = useNavigation<OnboardingStackScreenProps<'ProfileSetup'>['navigation']>();
  const { updateProfile } = useAuth();
  const [displayName, setDisplayName] = useState('');
  // Telefon ve dogum tarihi Firebase Auth profilinde tutulmaz; yalnizca UI alani.
  const [phone, setPhone] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setError(null);
    if (displayName.trim().length === 0) {
      setError('Gorunen ad bos olamaz.');
      return;
    }
    setIsSubmitting(true);
    try {
      await updateProfile({ displayName: displayName.trim() });
      // Onboarding tamamlandi — kok navigator'i Main'e sifirla.
      navigation
        .getParent<RootStackScreenProps<'Onboarding'>['navigation']>()
        ?.reset({ index: 0, routes: [{ name: 'Main' }] });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Profil kaydedilemedi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Stack gap={6} style={{ flex: 1, padding: 24 }}>
      <Stack gap={2}>
        <Heading level={2}>Profilini Tamamla</Heading>
        <Text color="secondary">Birka bilgi daha ve hazirsin!</Text>
      </Stack>

      {error !== null && <Banner variant="error">{error}</Banner>}

      <Stack gap={4}>
        <TextField
          label="Gorunen Ad"
          placeholder="Adinizi girin"
          value={displayName}
          onChange={(e) => setDisplayName((e.target as unknown as { value: string }).value)}
        />
        <TextField
          label="Telefon"
          placeholder="+90 5XX XXX XXXX"
          value={phone}
          onChange={(e) => setPhone((e.target as unknown as { value: string }).value)}
        />
        <TextField
          label="Dogum Tarihi"
          placeholder="GG/AA/YYYY"
          value={birthDate}
          onChange={(e) => setBirthDate((e.target as unknown as { value: string }).value)}
        />
        <Button
          onClick={() => {
            void handleSubmit();
          }}
          fullWidth
          isLoading={isSubmitting}
          isDisabled={isSubmitting}
        >
          Tamamla
        </Button>
      </Stack>
    </Stack>
  );
}
