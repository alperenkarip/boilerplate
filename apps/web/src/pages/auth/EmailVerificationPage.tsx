// S12 — Email Verification Screen (Firebase Auth action-code wiring)
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { Stack, Heading, Text, Button, Toast } from '@project/ui';
import { authAdapter, applyEmailActionCode } from '../../firebase/authAdapter';

type VerifyState = 'idle' | 'verifying' | 'verified' | 'failed';

export function Component() {
  const { t } = useTranslation('auth');
  const [searchParams] = useSearchParams();
  const oobCode = searchParams.get('oobCode');
  const [verifyState, setVerifyState] = useState<VerifyState>(oobCode ? 'verifying' : 'idle');
  const [resent, setResent] = useState(false);
  const [resendError, setResendError] = useState<string | null>(null);

  // Apply the email-verification action code when arriving from the email link.
  useEffect(() => {
    if (!oobCode) return;
    let cancelled = false;
    applyEmailActionCode(oobCode)
      .then(() => {
        if (!cancelled) setVerifyState('verified');
      })
      .catch(() => {
        if (!cancelled) setVerifyState('failed');
      });
    return () => {
      cancelled = true;
    };
  }, [oobCode]);

  const onResend = async () => {
    setResendError(null);
    try {
      await authAdapter.sendEmailVerification();
      setResent(true);
    } catch {
      setResendError('Dogrulama e-postasi gonderilemedi. Lutfen tekrar giris yapin.');
    }
  };

  return (
    <Stack
      gap={6}
      style={{ maxWidth: 400, margin: '0 auto', padding: '48px 24px', textAlign: 'center' }}
    >
      <Heading level={2}>{t('emailVerification.title')}</Heading>
      <Text color="secondary">{t('emailVerification.description')}</Text>

      {verifyState === 'verifying' && <Toast variant="info" message="E-postaniz dogrulaniyor..." />}
      {verifyState === 'verified' && (
        <Toast variant="success" message="E-postaniz dogrulandi. Artik giris yapabilirsiniz." />
      )}
      {verifyState === 'failed' && (
        <Toast
          variant="error"
          message="E-posta dogrulamasi basarisiz. Baglantinin suresi dolmus olabilir."
        />
      )}
      {resent && <Toast variant="success" message="Dogrulama e-postasi gonderildi." />}
      {resendError && <Toast variant="error" message={resendError} />}

      <Button variant="secondary" onClick={onResend}>
        {t('emailVerification.resend')}
      </Button>
    </Stack>
  );
}
