// S03 — No Internet / Offline Screen
import { useTranslation } from 'react-i18next';
import { Stack, Heading, Text, Button } from '@project/ui';

export function Component() {
  const { t } = useTranslation('shell');

  return (
    <Stack
      gap={4}
      style={{
        padding: 48,
        textAlign: 'center',
        minHeight: '60vh',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Heading level={2}>{t('system.offline.title')}</Heading>
      <Text color="secondary">{t('system.offline.description')}</Text>
      <Button onClick={() => globalThis.location?.reload()} variant="secondary">
        {t('system.offline.action')}
      </Button>
    </Stack>
  );
}
