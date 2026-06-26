// S09 — Register Screen (Firebase Auth wiring)
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Stack, Heading, TextField, Button, Text, Toast } from '@project/ui';
import { useAuthContext } from '../../auth/AuthProvider';
import { registerSchema, type RegisterFormData } from '../../auth/schemas';

export function Component() {
  const { t } = useTranslation('auth');
  const navigate = useNavigate();
  const { register: signUp } = useAuthContext();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '' },
  });

  const onSubmit = async (data: RegisterFormData) => {
    setSubmitError(null);
    try {
      await signUp(data.email, data.password);
      navigate('/');
    } catch {
      setSubmitError('Kayit basarisiz. Lutfen tekrar deneyin.');
    }
  };

  return (
    <Stack gap={6} style={{ maxWidth: 400, margin: '0 auto', padding: '48px 24px' }}>
      <Stack gap={2}>
        <Heading level={2}>{t('register.title')}</Heading>
        <Text color="secondary">{t('register.subtitle')}</Text>
      </Stack>

      {submitError && <Toast variant="error" message={submitError} />}

      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack gap={4}>
          <TextField
            label={t('fields.name')}
            placeholder={t('placeholders.name')}
            autoComplete="name"
            error={errors.name?.message}
            {...register('name')}
          />
          <TextField
            label={t('fields.email')}
            type="email"
            placeholder={t('placeholders.email')}
            autoComplete="email"
            error={errors.email?.message}
            {...register('email')}
          />
          <TextField
            label={t('fields.password')}
            type="password"
            placeholder={t('placeholders.newPassword')}
            autoComplete="new-password"
            error={errors.password?.message}
            {...register('password')}
          />
          <Button type="submit" fullWidth isLoading={isSubmitting}>
            {t('register.submit')}
          </Button>
        </Stack>
      </form>

      <Link to="/auth/login" style={{ textAlign: 'center', textDecoration: 'none' }}>
        <Text color="secondary" style={{ fontSize: '14px' }}>
          {t('register.hasAccount')}
        </Text>
      </Link>
    </Stack>
  );
}
