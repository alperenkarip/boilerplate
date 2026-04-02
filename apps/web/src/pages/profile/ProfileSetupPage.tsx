// S16 — Profile Setup Screen
// Yeni kullanici profil tamamlama formu
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { Stack, Heading, Text, TextField, Button } from '@project/ui';

interface ProfileSetupData {
  displayName: string;
  phone: string;
  birthDate: string;
}

export function Component() {
  const { t } = useTranslation('shell');
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileSetupData>();

  const onSubmit = (data: ProfileSetupData) => {
    void data;
  };

  return (
    <Stack gap={6} style={{ maxWidth: 480, margin: '0 auto', padding: '48px 24px' }}>
      <Stack gap={2}>
        <Heading level={2}>{t('profileSetup.title')}</Heading>
        <Text color="secondary">{t('profileSetup.subtitle')}</Text>
      </Stack>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack gap={4}>
          <TextField
            label={t('profileSetup.fields.displayName')}
            placeholder={t('profileSetup.placeholders.displayName')}
            error={errors.displayName?.message}
            {...register('displayName', { required: t('validation:required') })}
          />
          <TextField
            label={t('profileSetup.fields.phone')}
            type="tel"
            placeholder={t('profileSetup.placeholders.phone')}
            {...register('phone')}
          />
          <TextField
            label={t('profileSetup.fields.birthDate')}
            type="date"
            {...register('birthDate')}
          />
          <Button type="submit" fullWidth>
            {t('profileSetup.submit')}
          </Button>
        </Stack>
      </form>
    </Stack>
  );
}
