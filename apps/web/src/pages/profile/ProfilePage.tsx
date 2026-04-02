// S18 — Profile Screen
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Stack, Heading, Text, Avatar, Card, KeyValueRow, Button } from '@project/ui';

export function Component() {
  const { t } = useTranslation('shell');

  return (
    <Stack gap={6} style={{ padding: '24px 0' }}>
      <Card padding={6}>
        <Stack gap={4} style={{ alignItems: 'center' }}>
          <Avatar name="Kullanici Adi" size={80} />
          <Stack gap={1} style={{ textAlign: 'center' }}>
            <Heading level={3}>{t('profile.displayName')}</Heading>
            <Text color="secondary">kullanici@email.com</Text>
          </Stack>
          <Link to="/profile/edit">
            <Button variant="secondary">{t('profile.edit')}</Button>
          </Link>
        </Stack>
      </Card>

      <Card padding={4}>
        <Stack gap={0}>
          <KeyValueRow label={t('profile.fields.email')} value="kullanici@email.com" />
          <KeyValueRow label={t('profile.fields.phone')} value="+90 555 123 4567" />
          <KeyValueRow label={t('profile.fields.joinDate')} value="2026-04-01" />
        </Stack>
      </Card>
    </Stack>
  );
}
