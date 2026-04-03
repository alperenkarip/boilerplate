// S12 — Email Verification Screen (Mobile)
// E-posta dogrulama bekleme ekrani
import { Stack, Heading, Text, Button } from '@project/ui';

export function EmailVerificationScreen() {
  return (
    <Stack
      gap={6}
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
      }}
    >
      <Heading level={2}>E-posta Dogrulama</Heading>
      <Text color="secondary" style={{ textAlign: 'center' }}>
        Kayit oldugunuz e-posta adresine bir dogrulama baglantisi gonderdik. Lutfen gelen kutunuzu
        kontrol edin.
      </Text>
      <Button
        variant="secondary"
        onClick={() => {
          // Dogrulama e-postasini yeniden gonder
        }}
      >
        Tekrar Gonder
      </Button>
    </Stack>
  );
}
