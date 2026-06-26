// S23 — Delete Account Screen (Mobile)
// Hesap silme ekrani — yikici islem onay mekanizmasi + AuthProvider.deleteAccount
import { useState } from 'react';
import { Stack, Heading, Text, TextField, Button, Card, Banner } from '@project/ui';
import { useNavigation } from '@react-navigation/native';

import { useAuth } from '../../auth/AuthProvider';
import type { MainStackScreenProps, RootStackScreenProps } from '../../navigation/types';

export function DeleteAccountScreen() {
  const navigation = useNavigation<MainStackScreenProps<'DeleteAccount'>['navigation']>();
  const { deleteAccount } = useAuth();
  const [confirmation, setConfirmation] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const canDelete = confirmation === 'SIL';

  const handleDelete = async () => {
    setError(null);
    setIsDeleting(true);
    try {
      await deleteAccount();
      // Hesap silindi (kullanici da oturumdan dustu) — kok navigator'i Auth'a sifirla.
      navigation
        .getParent<RootStackScreenProps<'Main'>['navigation']>()
        ?.reset({ index: 0, routes: [{ name: 'Auth' }] });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Hesap silinemedi.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Stack gap={6} style={{ flex: 1, padding: 24 }}>
      <Heading level={2}>Hesabi Sil</Heading>

      {error !== null && <Banner variant="error">{error}</Banner>}

      <Card padding={4} style={{ backgroundColor: 'var(--color-surface-error)' }}>
        <Text color="error">
          Bu islem geri alinamaz! Hesabiniz ve tum verileriniz kalici olarak silinecektir.
        </Text>
      </Card>

      <Text color="secondary">
        Hesabinizi silmek istediginizden eminseniz, asagidaki alana &quot;SIL&quot; yazin.
      </Text>

      <TextField
        label="Onay"
        placeholder="SIL yazin"
        value={confirmation}
        onChange={(e) => setConfirmation((e.target as unknown as { value: string }).value)}
      />

      <Button
        variant="destructive"
        isDisabled={!canDelete || isDeleting}
        isLoading={isDeleting}
        onClick={() => {
          void handleDelete();
        }}
        fullWidth
      >
        Hesabi Kalici Olarak Sil
      </Button>
    </Stack>
  );
}
