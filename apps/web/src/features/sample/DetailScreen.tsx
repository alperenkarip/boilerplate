// S26 — Detail Screen
// Dogrulanan katmanlar: Navigation, query, UI, i18n
import { useTranslation } from 'react-i18next';
import { useParams, Link } from 'react-router-dom';
import {
  Stack,
  Heading,
  Text,
  Card,
  KeyValueRow,
  Badge,
  LoadingState,
  ErrorState,
  Button,
} from '@project/ui';
import { useSampleItem } from './hooks';

export function Component() {
  const { t } = useTranslation('shell');
  const { id } = useParams<{ id: string }>();
  const { data: item, isLoading, error, refetch } = useSampleItem(id ?? '');

  if (isLoading) return <LoadingState message={t('sample.detail.loading')} />;
  if (error) return <ErrorState message={error.message} onRetry={() => refetch()} />;
  if (!item) return <ErrorState message={t('sample.detail.notFound')} />;

  return (
    <Stack gap={4} style={{ padding: '24px 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Link to="/sample">
          <Button variant="ghost">{`← ${t('sample.detail.back')}`}</Button>
        </Link>
      </div>

      <Card padding={6}>
        <Stack gap={4}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Heading level={2}>{item.title}</Heading>
            <Badge variant={item.status === 'active' ? 'success' : 'default'}>
              {item.status === 'active'
                ? t('sample.form.statusOptions.active')
                : t('sample.form.statusOptions.archived')}
            </Badge>
          </div>
          <Text color="secondary">{item.description}</Text>
          <KeyValueRow label={t('sample.detail.createdAt')} value={item.createdAt} />
          <KeyValueRow
            label={t('sample.detail.status')}
            value={
              item.status === 'active'
                ? t('sample.form.statusOptions.active')
                : t('sample.detail.archivedStatus')
            }
          />
        </Stack>
      </Card>
    </Stack>
  );
}
