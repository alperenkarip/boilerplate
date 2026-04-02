// Ana sayfa — bootstrap proof
import { useTranslation } from 'react-i18next';
import { Stack, Heading, Text } from '@project/ui';

export function Component() {
  const { t } = useTranslation('common');

  return (
    <Stack gap={4} style={{ paddingBlock: 48 }}>
      <Heading level={1}>{t('home.title')}</Heading>
      <Text color="secondary">{t('home.description')}</Text>
    </Stack>
  );
}
