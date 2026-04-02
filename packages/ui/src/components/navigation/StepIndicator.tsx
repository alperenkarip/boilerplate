// C18.2 — StepIndicator
// Multi-step akis gostergesi: adim numaralari, tamamlanmis/aktif/bekleyen gorunum

interface StepIndicatorProps {
  /** Adim etiketleri */
  steps: string[];
  /** Su anki adim indeksi (0 tabanli) */
  currentStep: number;
}

export function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <nav
      aria-label="Adim gostergesi"
      style={{ display: 'flex', alignItems: 'center', width: '100%' }}
    >
      {steps.map((label, index) => {
        const isCompleted = index < currentStep;
        const isActive = index === currentStep;

        return (
          <div
            key={label}
            style={{
              display: 'flex',
              alignItems: 'center',
              flex: index < steps.length - 1 ? 1 : undefined,
            }}
          >
            {/* Adim dairesi */}
            <div
              aria-current={isActive ? 'step' : undefined}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                fontSize: '14px',
                fontWeight: isActive || isCompleted ? 600 : 400,
                color:
                  isCompleted || isActive
                    ? 'var(--color-text-on-primary)'
                    : 'var(--color-text-subtle)',
                backgroundColor: isCompleted
                  ? 'var(--color-interactive-primary-bg)'
                  : isActive
                    ? 'var(--color-interactive-primary-bg)'
                    : 'var(--color-surface-subtle)',
                border: isActive
                  ? '2px solid var(--color-interactive-primary-border)'
                  : '2px solid transparent',
                transition: 'background-color 200ms, color 200ms, border-color 200ms',
              }}
              title={label}
            >
              {/* Tamamlanmis adim icin onay isareti, diger icin numara */}
              {isCompleted ? '\u2713' : index + 1}
            </div>

            {/* Adimlar arasi baglanti cizgisi */}
            {index < steps.length - 1 && (
              <div
                style={{
                  flex: 1,
                  height: '2px',
                  margin: '0 8px',
                  backgroundColor:
                    index < currentStep
                      ? 'var(--color-interactive-primary-bg)'
                      : 'var(--color-border-subtle)',
                  transition: 'background-color 200ms',
                }}
              />
            )}
          </div>
        );
      })}
    </nav>
  );
}
