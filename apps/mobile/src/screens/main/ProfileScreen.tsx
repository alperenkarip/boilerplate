// S18 — Profile Screen (Mobile)
// Kullanici profil goruntuleme ekrani — AuthProvider ile baglandi (kullanici + cikis)
import { useState } from 'react';
import { Stack, Heading, Text, Card, Button, Banner } from '@project/ui';
import { useNavigation } from '@react-navigation/native';

import { useAuth } from '../../auth/AuthProvider';
import type { MainStackScreenProps, RootStackScreenProps } from '../../navigation/types';

export function ProfileScreen() {
  const navigation = useNavigation<MainStackScreenProps<'Profile'>['navigation']>();
  const { summary, signOut } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const displayName = summary?.displayName ?? 'Kullanici';
  const userId = summary?.userId ?? '-';

  const handleLogout = async () => {
    setError(null);
    setIsSigningOut(true);
    try {
      await signOut();
      // Cikis sonrasi kok navigator'i Auth akisina sifirla.
      navigation
        .getParent<RootStackScreenProps<'Main'>['navigation']>()
        ?.reset({ index: 0, routes: [{ name: 'Auth' }] });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Cikis yapilamadi.');
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <Stack gap={6} style={{ flex: 1, padding: 24 }}>
      {error !== null && <Banner variant="error">{error}</Banner>}

      <Card padding={6}>
        <Stack gap={4} style={{ alignItems: 'center' }}>
          {/* Avatar placeholder */}
          <Stack
            style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              backgroundColor: 'var(--color-surface-elevated)',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text style={{ fontSize: 32 }}>{displayName.slice(0, 1).toUpperCase()}</Text>
          </Stack>
          <Stack gap={1} style={{ alignItems: 'center' }}>
            <Heading level={3}>{displayName}</Heading>
            <Text variant="caption" color="secondary">
              ID: {userId}
            </Text>
          </Stack>
          <Button variant="secondary" onClick={() => navigation.navigate('EditProfile')}>
            Profili Duzenle
          </Button>
        </Stack>
      </Card>

      <Button
        variant="destructive"
        fullWidth
        onClick={() => {
          void handleLogout();
        }}
        isLoading={isSigningOut}
        isDisabled={isSigningOut}
      >
        Cikis Yap
      </Button>
    </Stack>
  );
}
