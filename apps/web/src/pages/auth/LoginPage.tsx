// S08 — Login Screen (Firebase Auth wiring)
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Stack, Heading, TextField, Button, Text, Toast } from '@project/ui';
import { useAuthContext } from '../../auth/AuthProvider';
import { loginSchema, type LoginFormData } from '../../auth/schemas';

export function Component() {
  const { t } = useTranslation('auth');
  const navigate = useNavigate();
  const { login } = useAuthContext();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data: LoginFormData) => {
    setSubmitError(null);
    try {
      await login(data.email, data.password);
      navigate('/');
    } catch {
      setSubmitError('Giris basarisiz. E-posta ve sifrenizi kontrol edin.');
    }
  };

  return (
    <Stack gap={6} style={{ maxWidth: 400, margin: '0 auto', padding: '48px 24px' }}>
      <Stack gap={2}>
        <Heading level={2}>{t('login.title')}</Heading>
        <Text color="secondary">{t('login.subtitle')}</Text>
      </Stack>

      {submitError && <Toast variant="error" message={submitError} />}

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
          <TextField
            label={t('fields.password')}
            type="password"
            placeholder={t('placeholders.password')}
            autoComplete="current-password"
            error={errors.password?.message}
            {...register('password')}
          />
          <Button type="submit" fullWidth isLoading={isSubmitting}>
            {t('login.submit')}
          </Button>
        </Stack>
      </form>

      <Link to="/auth/register" style={{ textAlign: 'center', textDecoration: 'none' }}>
        <Text color="secondary" style={{ fontSize: '14px' }}>
          {t('login.noAccount')}
        </Text>
      </Link>
    </Stack>
  );
}
