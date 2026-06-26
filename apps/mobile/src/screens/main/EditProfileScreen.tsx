// S19 — Edit Profile Screen (Mobile)
// Profil duzenleme formu — AuthProvider.updateProfile (displayName) ile baglandi
import { useState } from 'react';
import { Stack, Heading, TextField, Button, Banner } from '@project/ui';
import { useNavigation } from '@react-navigation/native';

import { useAuth } from '../../auth/AuthProvider';
import type { MainStackScreenProps } from '../../navigation/types';

export function EditProfileScreen() {
  const navigation = useNavigation<MainStackScreenProps<'EditProfile'>['navigation']>();
  const { summary, updateProfile } = useAuth();
  const [displayName, setDisplayName] = useState(summary?.displayName ?? '');
  // Telefon Firebase Auth profilinde tutulmaz; yalnizca UI alani (persist edilmez).
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setError(null);
    setSuccess(false);
    if (displayName.trim().length === 0) {
      setError('Gorunen ad bos olamaz.');
      return;
    }
    setIsSaving(true);
    try {
      await updateProfile({ displayName: displayName.trim() });
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Profil guncellenemedi.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Stack gap={6} style={{ flex: 1, padding: 24 }}>
      <Heading level={2}>Profili Duzenle</Heading>

      {error !== null && <Banner variant="error">{error}</Banner>}
      {success && <Banner variant="success">Profiliniz guncellendi.</Banner>}

      <Stack gap={4}>
        <TextField
          label="Gorunen Ad"
          value={displayName}
          onChange={(e) => setDisplayName((e.target as unknown as { value: string }).value)}
        />
        <TextField
          label="Telefon"
          value={phone}
          onChange={(e) => setPhone((e.target as unknown as { value: string }).value)}
        />
        <Stack gap={2} style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
          <Button variant="secondary" isDisabled={isSaving} onClick={() => navigation.goBack()}>
            Iptal
          </Button>
          <Button
            onClick={() => {
              void handleSave();
            }}
            isLoading={isSaving}
            isDisabled={isSaving}
          >
            Kaydet
          </Button>
        </Stack>
      </Stack>
    </Stack>
  );
}
