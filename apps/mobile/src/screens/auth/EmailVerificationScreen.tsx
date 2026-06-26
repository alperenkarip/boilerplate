// S12 — Email Verification Screen (Mobile)
// E-posta dogrulama bekleme ekrani — AuthProvider.sendEmailVerification ile baglandi
import { useState } from 'react';
import { Stack, Heading, Text, Button, Banner } from '@project/ui';

import { useAuth } from '../../auth/AuthProvider';

export function EmailVerificationScreen() {
  const { sendEmailVerification } = useAuth();
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleResend = async () => {
    setError(null);
    setIsSubmitting(true);
    try {
      await sendEmailVerification();
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Dogrulama e-postasi gonderilemedi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Stack
      gap={6}
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
      }}
    >
      <Heading level={2}>E-posta Dogrulama</Heading>
      <Text color="secondary" style={{ textAlign: 'center' }}>
        Kayit oldugunuz e-posta adresine bir dogrulama baglantisi gonderdik. Lutfen gelen kutunuzu
        kontrol edin.
      </Text>

      {error !== null && <Banner variant="error">{error}</Banner>}
      {sent && <Banner variant="success">Dogrulama e-postasi yeniden gonderildi.</Banner>}

      <Button
        variant="secondary"
        onClick={() => {
          void handleResend();
        }}
        isLoading={isSubmitting}
        isDisabled={isSubmitting}
      >
        Tekrar Gonder
      </Button>
    </Stack>
  );
}
