// S10 — Forgot Password Screen (Firebase Auth wiring)
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Stack, Heading, TextField, Button, Text, Toast } from '@project/ui';
import { authAdapter } from '../../firebase/authAdapter';
import { forgotPasswordSchema, type ForgotPasswordFormData } from '../../auth/schemas';

export function Component() {
  const { t } = useTranslation('auth');
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setSubmitError(null);
    try {
      await authAdapter.sendPasswordReset(data.email);
      setSent(true);
    } catch {
      setSubmitError('Sifirlama baglantisi gonderilemedi. Lutfen tekrar deneyin.');
    }
  };

  return (
    <Stack gap={6} style={{ maxWidth: 400, margin: '0 auto', padding: '48px 24px' }}>
      <Stack gap={2}>
        <Heading level={2}>{t('forgotPassword.title')}</Heading>
        <Text color="secondary">{t('forgotPassword.subtitle')}</Text>
      </Stack>

      {submitError && <Toast variant="error" message={submitError} />}
      {sent && (
        <Toast
          variant="success"
          message="E-posta adresinize sifre sifirlama baglantisi gonderildi."
        />
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack gap={4}>
          <TextField
            label={t('fields.email')}
            type="email"
            placeholder={t('placeholders.email')}
            autoComplete="email"
            error={errors.email?.message}
            {...register('email')}
          />
          <Button type="submit" fullWidth isLoading={isSubmitting}>
            {t('forgotPassword.submit')}
          </Button>
        </Stack>
      </form>
    </Stack>
  );
}
