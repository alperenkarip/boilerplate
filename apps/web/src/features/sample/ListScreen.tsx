// S25 — List Screen
// Dogrulanan katmanlar: Query, state, UI primitives, i18n, a11y
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import {
  Stack,
  Heading,
  Text,
  Card,
  Badge,
  LoadingState,
  ErrorState,
  EmptyState,
  Button,
} from '@project/ui';
import { useSampleItems } from './hooks';

export function Component() {
  const { t } = useTranslation('shell');
  const { data: items, isLoading, error, refetch } = useSampleItems();

  if (isLoading) return <LoadingState message={t('sample.list.loading')} />;
  if (error) return <ErrorState message={error.message} onRetry={() => refetch()} />;
  if (!items?.length)
    return (
      <EmptyState
        title={t('sample.list.empty.title')}
        description={t('sample.list.empty.description')}
        action={
          <Link to="/sample/new">
            <Button>{t('sample.list.empty.action')}</Button>
          </Link>
        }
      />
    );

  return (
    <Stack gap={4} style={{ padding: '24px 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Heading level={2}>{t('sample.list.title')}</Heading>
        <Link to="/sample/new">
          <Button>{t('sample.list.addNew')}</Button>
        </Link>
      </div>

      <Stack gap={3}>
        {items.map((item) => (
          <Link
            key={item.id}
            to={`/sample/${item.id}`}
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <Card>
              <div
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}
              >
                <Stack gap={1}>
                  <Text weight="semibold">{item.title}</Text>
                  <Text variant="caption" color="secondary">
                    {item.description}
                  </Text>
                </Stack>
                <Badge variant={item.status === 'active' ? 'success' : 'default'}>
                  {item.status === 'active'
                    ? t('sample.form.statusOptions.active')
                    : t('sample.form.statusOptions.archived')}
                </Badge>
              </div>
            </Card>
          </Link>
        ))}
      </Stack>
    </Stack>
  );
}
