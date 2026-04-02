// S15 — Permission Primer Screen (Mobile-primary)
// Push notification, konum, kamera izni on-bilgilendirme
import { useTranslation } from 'react-i18next';
import { Stack, Heading, Text, Button, Card } from '@project/ui';

export function Component() {
  const { t } = useTranslation('shell');

  const permissions = [
    { key: 'notifications', icon: '🔔' },
    { key: 'location', icon: '📍' },
    { key: 'camera', icon: '📷' },
  ];

  return (
    <Stack gap={6} style={{ maxWidth: 480, margin: '0 auto', padding: '48px 24px' }}>
      <Stack gap={2} style={{ textAlign: 'center' }}>
        <Heading level={2}>{t('permissions.title')}</Heading>
        <Text color="secondary">{t('permissions.subtitle')}</Text>
      </Stack>

      <Stack gap={3}>
        {permissions.map((p) => (
          <Card key={p.key} padding={4}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 24 }}>{p.icon}</span>
              <Stack gap={1} style={{ flex: 1 }}>
                <Text weight="semibold">{t(`permissions.${p.key}.title`)}</Text>
                <Text variant="caption" color="secondary">
                  {t(`permissions.${p.key}.description`)}
                </Text>
              </Stack>
            </div>
          </Card>
        ))}
      </Stack>

      <Button fullWidth>{t('permissions.continue')}</Button>
      <Button variant="ghost" fullWidth>
        {t('permissions.skip')}
      </Button>
    </Stack>
  );
}
