// S09 — Register Screen
import { useTranslation } from 'react-i18next';
import { Stack, Heading, TextField, Button, Text } from '@project/ui';

export function Component() {
  const { t } = useTranslation('auth');

  return (
    <Stack gap={6} style={{ maxWidth: 400, margin: '0 auto', padding: '48px 24px' }}>
      <Stack gap={2}>
        <Heading level={2}>{t('register.title')}</Heading>
        <Text color="secondary">{t('register.subtitle')}</Text>
      </Stack>

      <form onSubmit={(e) => e.preventDefault()}>
        <Stack gap={4}>
          <TextField
            label={t('fields.name')}
            placeholder={t('placeholders.name')}
            autoComplete="name"
          />
          <TextField
            label={t('fields.email')}
            type="email"
            placeholder={t('placeholders.email')}
            autoComplete="email"
          />
          <TextField
            label={t('fields.password')}
            type="password"
            placeholder={t('placeholders.newPassword')}
            autoComplete="new-password"
          />
          <Button type="submit" fullWidth>
            {t('register.submit')}
          </Button>
        </Stack>
      </form>

      <Text color="secondary" style={{ textAlign: 'center', fontSize: '14px' }}>
        {t('register.hasAccount')}
      </Text>
    </Stack>
  );
}
