// S02 — Force Update Screen (Mobile-only)
// Zorunlu guncelleme uyarisi
import { Platform, Linking } from 'react-native';
import { Stack, Heading, Text, Button } from '@project/ui';

interface ForceUpdateScreenProps {
  /** iOS App Store URL'i */
  iosStoreUrl?: string;
  /** Android Play Store URL'i */
  androidStoreUrl?: string;
}

/** Platform'a gore dogru store URL'ini belirle */
function getStoreUrl(iosStoreUrl?: string, androidStoreUrl?: string): string | undefined {
  if (Platform.OS === 'ios') {
    return iosStoreUrl;
  }
  if (Platform.OS === 'android') {
    return androidStoreUrl;
  }
  return undefined;
}

export function ForceUpdateScreen({ iosStoreUrl, androidStoreUrl }: ForceUpdateScreenProps) {
  const storeUrl = getStoreUrl(iosStoreUrl, androidStoreUrl);

  return (
    <Stack gap={4} style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 }}>
      <Heading level={2}>Guncelleme Gerekli</Heading>
      <Text color="secondary" style={{ textAlign: 'center' }}>
        Uygulamanin yeni bir surumu mevcut. Devam etmek icin guncellemeniz gerekmektedir.
      </Text>
      {storeUrl && (
        <Button
          onClick={() => {
            Linking.openURL(storeUrl);
          }}
        >
          Guncelle
        </Button>
      )}
    </Stack>
  );
}
