// S24 — About / Legal Screen
import { useTranslation } from 'react-i18next';
import { Stack, Heading, Text, Card, ListItem, KeyValueRow, Divider } from '@project/ui';

export function Component() {
  const { t } = useTranslation('shell');

  return (
    <Stack gap={6} style={{ maxWidth: 480, padding: '24px 0' }}>
      <Heading level={2}>{t('about.title')}</Heading>

      <Card padding={4}>
        <Stack gap={0}>
          <KeyValueRow label={t('about.appVersion')} value="0.0.1" />
          <KeyValueRow label={t('about.buildNumber')} value="1" />
          <KeyValueRow label={t('about.platform')} value="Web" />
        </Stack>
      </Card>

      <Card padding={0}>
        <ListItem title={t('about.privacyPolicy')} onPress={() => {}} />
        <ListItem title={t('about.termsOfService')} onPress={() => {}} />
        <ListItem title={t('about.licenses')} onPress={() => {}} />
      </Card>

      <Text variant="caption" color="tertiary" style={{ textAlign: 'center' }}>
        {t('about.copyright')}
      </Text>
    </Stack>
  );
}
