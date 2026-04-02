// S14 — Welcome/Onboarding Slides
// Mobile-primary, web'de de gosterilebilir
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Stack, Heading, Text, Button } from '@project/ui';

const slides = [
  { titleKey: 'onboarding.slide1.title', descKey: 'onboarding.slide1.description' },
  { titleKey: 'onboarding.slide2.title', descKey: 'onboarding.slide2.description' },
  { titleKey: 'onboarding.slide3.title', descKey: 'onboarding.slide3.description' },
];

export function Component() {
  const { t } = useTranslation('shell');
  const [current, setCurrent] = useState(0);
  const isLast = current === slides.length - 1;

  return (
    <Stack
      gap={6}
      style={{
        maxWidth: 480,
        margin: '0 auto',
        padding: '64px 24px',
        textAlign: 'center',
        minHeight: '80vh',
        justifyContent: 'center',
      }}
    >
      <Stack gap={3}>
        <Heading level={2}>{t(slides[current]!.titleKey)}</Heading>
        <Text color="secondary">{t(slides[current]!.descKey)}</Text>
      </Stack>

      <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
        {slides.map((_, i) => (
          <div
            key={i}
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor:
                i === current
                  ? 'var(--color-interactive-primary-bg)'
                  : 'var(--color-border-default)',
            }}
          />
        ))}
      </div>

      <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
        {current > 0 && (
          <Button variant="ghost" onClick={() => setCurrent(current - 1)}>
            {t('common:app.back')}
          </Button>
        )}
        <Button onClick={() => (isLast ? undefined : setCurrent(current + 1))}>
          {isLast ? t('onboarding.getStarted') : t('common:app.next')}
        </Button>
      </div>
    </Stack>
  );
}
