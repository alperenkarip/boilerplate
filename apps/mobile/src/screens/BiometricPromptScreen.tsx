// S13 — Biometric Prompt Screen (Mobile-only)
// Biometric dogrulama ekrani — L.1.8-L.1.11 ile entegre
import { Stack, Heading, Text, Button } from '@project/ui';

interface BiometricPromptScreenProps {
  onAuthenticate: () => void;
  onSkip: () => void;
}

export function BiometricPromptScreen({ onAuthenticate, onSkip }: BiometricPromptScreenProps) {
  return (
    <Stack gap={6} style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 }}>
      <Heading level={2}>Hizli Giris</Heading>
      <Text color="secondary" style={{ textAlign: 'center' }}>
        Parmak izi veya yuz tanima ile hizlica giris yapin.
      </Text>
      <Button onClick={onAuthenticate}>Biyometrik ile Giris</Button>
      <Button variant="ghost" onClick={onSkip}>
        Sifre ile Giris
      </Button>
    </Stack>
  );
}
