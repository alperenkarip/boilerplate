// S06 — Error Screen (Mobile)
// Beklenmedik hata durumlarinda gosterilen fallback ekran
import { Stack, Heading, Text, Button } from '@project/ui';

interface ErrorScreenProps {
  error?: Error;
  onReset?: () => void;
}

export function ErrorScreen({ error, onReset }: ErrorScreenProps) {
  return (
    <Stack
      gap={4}
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
      }}
    >
      <Heading level={2}>Bir Hata Olustu</Heading>
      <Text color="secondary" style={{ textAlign: 'center' }}>
        {error?.message ?? 'Beklenmedik bir hata meydana geldi. Lutfen tekrar deneyin.'}
      </Text>
      {onReset && (
        <Button variant="secondary" onClick={onReset}>
          Tekrar Dene
        </Button>
      )}
    </Stack>
  );
}
