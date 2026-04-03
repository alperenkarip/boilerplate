// S03 — Offline Screen (Mobile)
// Internet baglantisi olmayan durumlarda gosterilir
import { Stack, Heading, Text, Button } from '@project/ui';

export function OfflineScreen() {
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
      <Heading level={2}>Baglanti Yok</Heading>
      <Text color="secondary" style={{ textAlign: 'center' }}>
        Internet baglantiniz bulunamadi. Lutfen baglantinizi kontrol edip tekrar deneyin.
      </Text>
      <Button
        variant="secondary"
        onClick={() => {
          /* NetInfo.fetch() veya reload tetiklenebilir */
        }}
      >
        Tekrar Dene
      </Button>
    </Stack>
  );
}
