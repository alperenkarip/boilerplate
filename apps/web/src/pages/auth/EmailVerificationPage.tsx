// S12 — Email Verification Screen
import { useTranslation } from 'react-i18next';
import { Stack, Heading, Text, Button } from '@project/ui';

export function Component() {
  const { t } = useTranslation('auth');

  return (
    <Stack
      gap={6}
      style={{ maxWidth: 400, margin: '0 auto', padding: '48px 24px', textAlign: 'center' }}
    >
      <Heading level={2}>{t('emailVerification.title')}</Heading>
      <Text color="secondary">{t('emailVerification.description')}</Text>
      <Button variant="secondary" onClick={() => {}}>
        {t('emailVerification.resend')}
      </Button>
    </Stack>
  );
}
