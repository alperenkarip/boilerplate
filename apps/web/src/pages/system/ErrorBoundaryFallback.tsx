// S06 — Full-screen Error (Error Boundary Fallback)
import { useTranslation } from 'react-i18next';
import { Stack, Heading, Text, Button } from '@project/ui';

interface Props {
  error?: Error;
  onReset?: () => void;
}

export function Component({ error, onReset }: Props) {
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
      <Heading level={2}>{t('system.error.title')}</Heading>
      <Text color="secondary">{error?.message ?? t('system.error.description')}</Text>
      {onReset && (
        <Button onClick={onReset} variant="secondary">
          {t('system.error.action')}
        </Button>
      )}
    </Stack>
  );
}
