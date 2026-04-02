// S22 — Change Password Screen
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Stack, Heading, TextField, Button, Toast } from '@project/ui';

interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export function Component() {
  const { t } = useTranslation('shell');
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ChangePasswordData>();

  const onSubmit = (data: ChangePasswordData) => {
    void data;
    navigate('/settings');
  };

  return (
    <Stack gap={6} style={{ maxWidth: 480, padding: '24px 0' }}>
      <Heading level={2}>{t('changePassword.title')}</Heading>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack gap={4}>
          <TextField
            label={t('changePassword.currentPassword')}
            type="password"
            error={errors.currentPassword?.message}
            {...register('currentPassword', { required: t('validation:required') })}
          />
          <TextField
            label={t('changePassword.newPassword')}
            type="password"
            error={errors.newPassword?.message}
            {...register('newPassword', {
              required: t('validation:required'),
              minLength: { value: 8, message: t('validation:minLength', { min: 8 }) },
            })}
          />
          <TextField
            label={t('changePassword.confirmPassword')}
            type="password"
            error={errors.confirmPassword?.message}
            {...register('confirmPassword', {
              validate: (v) => v === watch('newPassword') || t('validation:passwordMatch'),
            })}
          />
          <Button type="submit" fullWidth>
            {t('changePassword.submit')}
          </Button>
        </Stack>
      </form>
    </Stack>
  );
}
