// S17 — Home / Dashboard Screen (tam app shell hali)
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Stack, Heading, Text, Card, SectionHeader, ListItem, Button } from '@project/ui';

export function Component() {
  const { t } = useTranslation('common');

  return (
    <Stack gap={6} style={{ padding: '24px 0' }}>
      <Stack gap={2}>
        <Heading level={1}>{t('home.title')}</Heading>
        <Text color="secondary">{t('home.description')}</Text>
      </Stack>

      <Card padding={4}>
        <Stack gap={3}>
          <SectionHeader title={t('home.quickActions')} />
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <Link to="/sample">
              <Button variant="secondary">{t('home.viewRecords')}</Button>
            </Link>
            <Link to="/sample/new">
              <Button>{t('home.createNew')}</Button>
            </Link>
          </div>
        </Stack>
      </Card>

      <Card padding={0}>
        <SectionHeader title={t('home.navigation')} />
        <Link to="/profile" style={{ textDecoration: 'none', color: 'inherit' }}>
          <ListItem title={t('home.profile')} />
        </Link>
        <Link to="/settings" style={{ textDecoration: 'none', color: 'inherit' }}>
          <ListItem title={t('home.settings')} />
        </Link>
        <Link to="/about" style={{ textDecoration: 'none', color: 'inherit' }}>
          <ListItem title={t('home.about')} />
        </Link>
      </Card>
    </Stack>
  );
}
