// S19 — Edit Profile Screen
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Stack, Heading, TextField, Button } from '@project/ui';

interface EditProfileData {
  displayName: string;
  phone: string;
}

export function Component() {
  const { t } = useTranslation('shell');
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm<EditProfileData>({
    defaultValues: { displayName: 'Kullanici Adi', phone: '+90 555 123 4567' },
  });

  const onSubmit = (data: EditProfileData) => {
    void data;
    navigate('/profile');
  };

  return (
    <Stack gap={6} style={{ maxWidth: 480, padding: '24px 0' }}>
      <Heading level={2}>{t('editProfile.title')}</Heading>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack gap={4}>
          <TextField label={t('editProfile.fields.displayName')} {...register('displayName')} />
          <TextField label={t('editProfile.fields.phone')} type="tel" {...register('phone')} />
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <Button variant="secondary" onClick={() => navigate('/profile')} type="button">
              {t('common:app.cancel')}
            </Button>
            <Button type="submit">{t('common:app.save')}</Button>
          </div>
        </Stack>
      </form>
    </Stack>
  );
}
