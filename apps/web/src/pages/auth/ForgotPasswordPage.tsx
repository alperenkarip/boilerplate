// S10 — Forgot Password Screen
import { useTranslation } from 'react-i18next';
import { Stack, Heading, TextField, Button, Text } from '@project/ui';

export function Component() {
  const { t } = useTranslation('auth');

  return (
    <Stack gap={6} style={{ maxWidth: 400, margin: '0 auto', padding: '48px 24px' }}>
      <Stack gap={2}>
        <Heading level={2}>{t('forgotPassword.title')}</Heading>
        <Text color="secondary">{t('forgotPassword.subtitle')}</Text>
      </Stack>

      <form onSubmit={(e) => e.preventDefault()}>
        <Stack gap={4}>
          <TextField
            label={t('fields.email')}
            type="email"
            placeholder={t('placeholders.email')}
            autoComplete="email"
          />
          <Button type="submit" fullWidth>
            {t('forgotPassword.submit')}
          </Button>
        </Stack>
      </form>
    </Stack>
  );
}
