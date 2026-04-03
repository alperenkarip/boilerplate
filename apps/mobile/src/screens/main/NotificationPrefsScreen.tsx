// S21 — Notification Preferences Screen (Mobile)
// Bildirim tercih ayarlari
import { useState } from 'react';
import { Stack, Heading, Text, Card } from '@project/ui';

interface PrefItem {
  key: string;
  label: string;
  enabled: boolean;
}

export function NotificationPrefsScreen() {
  const [prefs, setPrefs] = useState<PrefItem[]>([
    { key: 'push', label: 'Push Bildirimleri', enabled: true },
    { key: 'email', label: 'E-posta Bildirimleri', enabled: true },
    { key: 'marketing', label: 'Pazarlama Bildirimleri', enabled: false },
  ]);

  const toggle = (key: string) => {
    setPrefs((prev) => prev.map((p) => (p.key === key ? { ...p, enabled: !p.enabled } : p)));
  };

  return (
    <Stack gap={6} style={{ flex: 1, padding: 24 }}>
      <Stack gap={2}>
        <Heading level={2}>Bildirim Tercihleri</Heading>
        <Text color="secondary">Hangi bildirimleri almak istediginizi secin.</Text>
      </Stack>

      <Card padding={4}>
        <Stack gap={4}>
          {prefs.map((p) => (
            <Stack
              key={p.key}
              gap={0}
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Text>{p.label}</Text>
              <Text color="secondary" style={{ cursor: 'pointer' }} onClick={() => toggle(p.key)}>
                {p.enabled ? 'Acik' : 'Kapali'}
              </Text>
            </Stack>
          ))}
        </Stack>
      </Card>
    </Stack>
  );
}
