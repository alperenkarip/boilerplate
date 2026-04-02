// S02 — Force Update Screen (Mobile-only)
// Zorunlu guncelleme uyarisi
import { Stack, Heading, Text, Button } from '@project/ui';

interface ForceUpdateScreenProps {
  storeUrl?: string;
}

export function ForceUpdateScreen({ storeUrl }: ForceUpdateScreenProps) {
  return (
    <Stack gap={4} style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 }}>
      <Heading level={2}>Guncelleme Gerekli</Heading>
      <Text color="secondary" style={{ textAlign: 'center' }}>
        Uygulamanin yeni bir surumu mevcut. Devam etmek icin guncellemeniz gerekmektedir.
      </Text>
      {storeUrl && (
        <Button
          onClick={() => {
            /* Linking.openURL(storeUrl) */
          }}
        >
          Guncelle
        </Button>
      )}
    </Stack>
  );
}
