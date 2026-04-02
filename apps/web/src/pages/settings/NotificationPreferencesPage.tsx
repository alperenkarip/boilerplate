// S21 — Notification Preferences Screen
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Stack, Heading, Text, Card, Switch } from '@project/ui';

export function Component() {
  const { t } = useTranslation('shell');
  const [prefs, setPrefs] = useState({ push: true, email: true, marketing: false });

  const toggle = (key: keyof typeof prefs) => setPrefs((p) => ({ ...p, [key]: !p[key] }));

  return (
    <Stack gap={6} style={{ maxWidth: 480, padding: '24px 0' }}>
      <Stack gap={2}>
        <Heading level={2}>{t('notificationPrefs.title')}</Heading>
        <Text color="secondary">{t('notificationPrefs.subtitle')}</Text>
      </Stack>

      <Card padding={4}>
        <Stack gap={4}>
          <Switch
            checked={prefs.push}
            onChange={() => toggle('push')}
            label={t('notificationPrefs.push')}
          />
          <Switch
            checked={prefs.email}
            onChange={() => toggle('email')}
            label={t('notificationPrefs.email')}
          />
          <Switch
            checked={prefs.marketing}
            onChange={() => toggle('marketing')}
            label={t('notificationPrefs.marketing')}
          />
        </Stack>
      </Card>
    </Stack>
  );
}
