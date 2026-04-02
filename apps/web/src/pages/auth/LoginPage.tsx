// S08 — Login Screen
import { useTranslation } from 'react-i18next';
import { Stack, Heading, TextField, Button, Text } from '@project/ui';

export function Component() {
  const { t } = useTranslation('auth');

  return (
    <Stack gap={6} style={{ maxWidth: 400, margin: '0 auto', padding: '48px 24px' }}>
      <Stack gap={2}>
        <Heading level={2}>{t('login.title')}</Heading>
        <Text color="secondary">{t('login.subtitle')}</Text>
      </Stack>

      <form onSubmit={(e) => e.preventDefault()}>
        <Stack gap={4}>
          <TextField
            label={t('fields.email')}
            type="email"
            placeholder={t('placeholders.email')}
            autoComplete="email"
          />
          <TextField
            label={t('fields.password')}
            type="password"
            placeholder={t('placeholders.password')}
            autoComplete="current-password"
          />
          <Button type="submit" fullWidth>
            {t('login.submit')}
          </Button>
        </Stack>
      </form>

      <Text color="secondary" style={{ textAlign: 'center', fontSize: '14px' }}>
        {t('login.noAccount')}
      </Text>
    </Stack>
  );
}
