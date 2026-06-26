// Web App — Provider composition root
// Provider zinciri sirasi (SPEC-IMP-001 Faz J):
// 1. ErrorBoundary (en dis)
// 2. ThemeProvider
// 3. QueryClientProvider
// 4. I18nProvider (i18next init import)
// 5. AuthProvider (Firebase Auth context)
// 6. RouterProvider (en ic)

import { ErrorBoundary, ThemeProvider } from '@project/ui';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from './auth/AuthProvider';
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

// @MX:ANCHOR: [AUTO] Provider composition root — fixed ordering (ErrorBoundary > ThemeProvider > QueryClientProvider > Router) is a contract; reordering breaks error capture and query/theme context availability.
// @MX:REASON: Single app mount point (fan_in=1: main.tsx). Provider nesting order is an invariant per SPEC-IMP-001 Faz J; downstream hooks assume this chain.
export function App() {
  return (
    <ErrorBoundary fallback={ErrorFallback}>
      <ThemeProvider defaultMode="system">
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <RouterProvider router={router} />
          </AuthProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
