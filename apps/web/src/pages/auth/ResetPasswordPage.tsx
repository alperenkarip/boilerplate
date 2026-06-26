// S11 — Reset Password Screen (Firebase Auth action-code wiring)
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Stack, Heading, TextField, Button, Text, Toast } from '@project/ui';
import { confirmPasswordResetWithCode } from '../../firebase/authAdapter';
import { resetPasswordSchema, type ResetPasswordFormData } from '../../auth/schemas';

export function Component() {
  const { t } = useTranslation('auth');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const oobCode = searchParams.get('oobCode');
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { newPassword: '', confirmPassword: '' },
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    setSubmitError(null);
    if (!oobCode) {
      setSubmitError('Gecersiz veya eksik islem baglantisi.');
      return;
    }
    try {
      await confirmPasswordResetWithCode(oobCode, data.newPassword);
      setDone(true);
      setTimeout(() => navigate('/auth/login'), 1500);
    } catch {
      setSubmitError('Sifreniz guncellenemedi. Baglantinin suresi dolmus olabilir.');
    }
  };

  return (
    <Stack gap={6} style={{ maxWidth: 400, margin: '0 auto', padding: '48px 24px' }}>
      <Stack gap={2}>
        <Heading level={2}>{t('resetPassword.title')}</Heading>
        <Text color="secondary">{t('resetPassword.subtitle')}</Text>
      </Stack>

      {submitError && <Toast variant="error" message={submitError} />}
      {done && (
        <Toast variant="success" message="Sifreniz guncellendi. Artik giris yapabilirsiniz." />
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack gap={4}>
          <TextField
            label={t('fields.newPassword')}
            type="password"
            placeholder={t('placeholders.newPassword')}
            autoComplete="new-password"
            error={errors.newPassword?.message}
            {...register('newPassword')}
          />
          <TextField
            label={t('fields.confirmPassword')}
            type="password"
            placeholder={t('placeholders.confirmPassword')}
            autoComplete="new-password"
            error={errors.confirmPassword?.message}
            {...register('confirmPassword')}
          />
          <Button type="submit" fullWidth isLoading={isSubmitting} isDisabled={done}>
            {t('resetPassword.submit')}
          </Button>
        </Stack>
      </form>
    </Stack>
  );
}
