// S23 — Delete Account Screen (Mobile)
// Hesap silme ekrani — yikici islem onay mekanizmasi
import { useState } from 'react';
import { Stack, Heading, Text, TextField, Button, Card } from '@project/ui';

export function DeleteAccountScreen() {
  const [confirmation, setConfirmation] = useState('');
  const canDelete = confirmation === 'SIL';

  return (
    <Stack gap={6} style={{ flex: 1, padding: 24 }}>
      <Heading level={2}>Hesabi Sil</Heading>

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
        onChange={(e) => setConfirmation((e.target as any).value)}
      />

      <Button
        variant="destructive"
        isDisabled={!canDelete}
        onClick={() => {
          // Hesap silme islemi
        }}
        fullWidth
      >
        Hesabi Kalici Olarak Sil
      </Button>
    </Stack>
  );
}
