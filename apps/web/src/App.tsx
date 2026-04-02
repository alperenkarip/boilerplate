// Web App — Provider composition root
// Provider zinciri sirasi (SPEC-IMP-001 Faz J):
// 1. ErrorBoundary (en dis)
// 2. ThemeProvider
// 3. QueryClientProvider
// 4. I18nProvider (i18next init import)
// 5. AuthProvider (Faz L'de eklenecek)
// 6. RouterProvider (en ic)

import { ErrorBoundary, ThemeProvider } from '@project/ui';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';

// i18n bootstrap — import side-effect olarak init calistirir
import './i18n/config';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60,
      retry: 1,
    },
  },
});

function ErrorFallback(error: Error, reset: () => void) {
  return (
    <div role="alert" style={{ padding: 24, textAlign: 'center' }}>
      <h2>Beklenmeyen bir hata olustu</h2>
      <p style={{ color: 'var(--color-content-secondary)' }}>{error.message}</p>
      <button onClick={reset} type="button">
        Tekrar dene
      </button>
    </div>
  );
}

export function App() {
  return (
    <ErrorBoundary fallback={ErrorFallback}>
      <ThemeProvider defaultMode="system">
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
