// S27 — Create/Edit Form Screen
// RHF + Zod validation + mutation + error handling
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Stack, Heading, TextField, Button, Select, Toast } from '@project/ui';
import { useCreateSampleItem } from './hooks';
import { sampleItemSchema, type SampleItemFormData } from './schema';

export function Component() {
  const { t } = useTranslation('shell');
  const navigate = useNavigate();
  const mutation = useCreateSampleItem();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SampleItemFormData>({
    resolver: zodResolver(sampleItemSchema),
    defaultValues: { title: '', description: '', status: 'active' },
  });

  const onSubmit = (data: SampleItemFormData) => {
    mutation.mutate(data, { onSuccess: () => navigate('/sample') });
  };

  return (
    <Stack gap={6} style={{ maxWidth: 480, padding: '24px 0' }}>
      <Heading level={2}>{t('sample.form.title')}</Heading>

      {mutation.error && <Toast variant="error" message={mutation.error.message} />}

      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack gap={4}>
          <TextField
            label={t('sample.form.fields.title')}
            placeholder={t('sample.form.placeholders.title')}
            error={errors.title?.message}
            {...register('title')}
          />
          <TextField
            label={t('sample.form.fields.description')}
            placeholder={t('sample.form.placeholders.description')}
            error={errors.description?.message}
            {...register('description')}
          />
          <Select
            label={t('sample.form.fields.status')}
            options={[
              { value: 'active', label: t('sample.form.statusOptions.active') },
              { value: 'archived', label: t('sample.form.statusOptions.archived') },
            ]}
            error={errors.status?.message}
            {...register('status')}
          />
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
            <Button variant="secondary" onClick={() => navigate('/sample')} type="button">
              {t('sample.form.cancel')}
            </Button>
            <Button type="submit" isLoading={mutation.isPending}>
              {t('sample.form.save')}
            </Button>
          </div>
        </Stack>
      </form>
    </Stack>
  );
}
