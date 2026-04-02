// S05 — Not Found (404) Screen
import { useTranslation } from 'react-i18next';
import { Stack, Heading, Text } from '@project/ui';

export function Component() {
  const { t } = useTranslation('shell');

  return (
    <Stack gap={4} style={{ padding: 48, textAlign: 'center' }}>
      <Heading level={2}>{t('system.notFound.title')}</Heading>
      <Text color="secondary">{t('system.notFound.description')}</Text>
    </Stack>
  );
}
