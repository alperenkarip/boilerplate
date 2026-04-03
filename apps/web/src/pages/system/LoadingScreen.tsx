// S07 — Full-screen Loading (App Bootstrap)
import { useTranslation } from 'react-i18next';
import { Stack, Spinner } from '@project/ui';

export function Component() {
  const { t } = useTranslation('shell');

  return (
    <Stack gap={4} style={{ minHeight: '100vh', justifyContent: 'center', alignItems: 'center' }}>
      <Spinner size={40} label={t('system.loading.title')} />
    </Stack>
  );
}
