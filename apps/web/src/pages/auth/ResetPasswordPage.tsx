// S11 — Reset Password Screen
import { useTranslation } from 'react-i18next';
import { Stack, Heading, TextField, Button, Text } from '@project/ui';

export function Component() {
  const { t } = useTranslation('auth');

  return (
    <Stack gap={6} style={{ maxWidth: 400, margin: '0 auto', padding: '48px 24px' }}>
      <Stack gap={2}>
        <Heading level={2}>{t('resetPassword.title')}</Heading>
        <Text color="secondary">{t('resetPassword.subtitle')}</Text>
      </Stack>

      <form onSubmit={(e) => e.preventDefault()}>
        <Stack gap={4}>
          <TextField
            label={t('fields.newPassword')}
            type="password"
            placeholder={t('placeholders.newPassword')}
            autoComplete="new-password"
          />
          <TextField
            label={t('fields.confirmPassword')}
            type="password"
            placeholder={t('placeholders.confirmPassword')}
            autoComplete="new-password"
          />
          <Button type="submit" fullWidth>
            {t('resetPassword.submit')}
          </Button>
        </Stack>
      </form>
    </Stack>
  );
}
