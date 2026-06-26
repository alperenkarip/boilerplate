// Mobile App — Provider composition root
// Provider zinciri (SPEC-IMP-001 + ADR-021):
// 1. ErrorBoundary -> 2. SafeAreaProvider -> 3. ThemeProvider
// 4. QueryClientProvider -> 5. AuthProvider -> 6. NavigationContainer

import { ErrorBoundary, ThemeProvider } from '@project/ui';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AppNavigator, linking } from './navigation/AppNavigator';
import { AuthProvider } from './auth/AuthProvider';
import { connectFirebaseEmulators } from './firebase/config';
import { calculateRetryDelay, setupOfflineQueue, shouldRetryOnError } from './state/offlineQueue';

// Herhangi bir adapter SDK'ya dokunmadan once emulator suite'ine baglan (yalnizca DEV).
connectFirebaseEmulators();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 1000 * 60, retry: 1 },
    // Callable yazma mutasyonlari: cevrimdisi/ag hatasinda exponential backoff ile retry.
    mutations: {
      retry: (failureCount, error) => failureCount < 3 && shouldRetryOnError(error),
      retryDelay: calculateRetryDelay,
    },
  },
});

// Callable mutasyonlarini ag gecislerinde duraklatip yeniden oynat (offline yazma kuyrugu).
setupOfflineQueue(queryClient);

export default function App() {
  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <ThemeProvider defaultMode="system">
          <QueryClientProvider client={queryClient}>
            <AuthProvider>
              <NavigationContainer linking={linking}>
                <AppNavigator />
              </NavigationContainer>
            </AuthProvider>
          </QueryClientProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}
