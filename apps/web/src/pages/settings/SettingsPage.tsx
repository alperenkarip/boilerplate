// S20 — Settings Screen
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { Stack, Heading, Card, ListItem, Switch, SectionHeader, Button } from '@project/ui';
import { useTheme } from '@project/ui';
import { useAuthContext } from '../../auth/AuthProvider';

export function Component() {
  const { t } = useTranslation('shell');
  const { resolvedMode, toggle } = useTheme();
  const { logout } = useAuthContext();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/auth/login');
  };

  return (
    <Stack gap={6} style={{ padding: '24px 0' }}>
      <Heading level={2}>{t('settings.title')}</Heading>

      <Card padding={0}>
        <SectionHeader title={t('settings.sections.appearance')} />
        <div
          style={{
            padding: '12px 16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span>{t('settings.darkMode')}</span>
          <Switch checked={resolvedMode === 'dark'} onChange={toggle} />
        </div>
      </Card>

      <Card padding={0}>
        <SectionHeader title={t('settings.sections.account')} />
        <Link to="/profile" style={{ textDecoration: 'none', color: 'inherit' }}>
          <ListItem title={t('settings.profile')} />
        </Link>
        <Link to="/settings/notifications" style={{ textDecoration: 'none', color: 'inherit' }}>
          <ListItem title={t('settings.notifications')} />
        </Link>
        <Link to="/settings/change-password" style={{ textDecoration: 'none', color: 'inherit' }}>
          <ListItem title={t('settings.changePassword')} />
        </Link>
      </Card>

      <Card padding={0}>
        <SectionHeader title={t('settings.sections.info')} />
        <Link to="/about" style={{ textDecoration: 'none', color: 'inherit' }}>
          <ListItem title={t('settings.about')} />
        </Link>
        <Link to="/settings/delete-account" style={{ textDecoration: 'none', color: 'inherit' }}>
          <ListItem title={t('settings.deleteAccount')} />
        </Link>
      </Card>

      <Button variant="destructive" fullWidth onClick={handleLogout}>
        Cikis Yap
      </Button>
    </Stack>
  );
}
