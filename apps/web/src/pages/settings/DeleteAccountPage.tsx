// S23 — Delete Account Screen (destructive action + onay)
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Stack, Heading, Text, Button, TextField, Banner, ConfirmDialog } from '@project/ui';

export function Component() {
  const { t } = useTranslation('shell');
  const [confirmation, setConfirmation] = useState('');
  const [showDialog, setShowDialog] = useState(false);

  const canDelete = confirmation === 'SIL';

  return (
    <Stack gap={6} style={{ maxWidth: 480, padding: '24px 0' }}>
      <Heading level={2}>{t('deleteAccount.title')}</Heading>

      <Banner variant="error">{t('deleteAccount.warning')}</Banner>

      <Text color="secondary">{t('deleteAccount.description')}</Text>

      <TextField
        label={t('deleteAccount.confirmLabel')}
        placeholder={t('deleteAccount.confirmPlaceholder')}
        value={confirmation}
        onChange={(e) => setConfirmation(e.target.value)}
      />

      <Button
        variant="destructive"
        isDisabled={!canDelete}
        onClick={() => setShowDialog(true)}
        fullWidth
      >
        {t('deleteAccount.submit')}
      </Button>

      <ConfirmDialog
        isOpen={showDialog}
        onClose={() => setShowDialog(false)}
        onConfirm={() => {}}
        title={t('deleteAccount.dialogTitle')}
        message={t('deleteAccount.dialogMessage')}
        confirmLabel={t('deleteAccount.dialogConfirm')}
        variant="destructive"
      />
    </Stack>
  );
}
