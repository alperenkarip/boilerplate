// S14 — Welcome Slides Screen (Mobile)
// Onboarding karsilama slaytlari
import { useState } from 'react';
import { Stack, Heading, Text, Button } from '@project/ui';

const slides = [
  {
    title: 'Hosgeldiniz',
    description: 'Uygulamaya hosgeldiniz! Size en iyi deneyimi sunmak icin buradayiz.',
  },
  {
    title: 'Kolay Kullanim',
    description: 'Sade ve anlasilir arayuz ile ihtiyaciniz olana hizla ulasin.',
  },
  {
    title: 'Guvenli ve Hizli',
    description: 'Verileriniz guvende, performans her zaman en ust duzeyde.',
  },
];

export function WelcomeSlidesScreen() {
  const [current, setCurrent] = useState(0);
  const isLast = current === slides.length - 1;
  const slide = slides[current]!;

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
      <Stack gap={3} style={{ alignItems: 'center' }}>
        <Heading level={2}>{slide.title}</Heading>
        <Text color="secondary" style={{ textAlign: 'center' }}>
          {slide.description}
        </Text>
      </Stack>

      {/* Sayfa gostergesi */}
      <Stack
        gap={2}
        style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}
      >
        {slides.map((_, i) => (
          <Text key={i} style={{ fontSize: 24, opacity: i === current ? 1 : 0.3 }}>
            {'●'}
          </Text>
        ))}
      </Stack>

      <Stack gap={2} style={{ flexDirection: 'row', justifyContent: 'center' }}>
        {current > 0 && (
          <Button variant="ghost" onClick={() => setCurrent(current - 1)}>
            Geri
          </Button>
        )}
        <Button onClick={() => (isLast ? undefined : setCurrent(current + 1))}>
          {isLast ? 'Basla' : 'Ileri'}
        </Button>
      </Stack>
    </Stack>
  );
}
