// Mobile App — Provider composition root
// Provider zinciri (SPEC-IMP-001):
// 1. ErrorBoundary → 2. SafeAreaProvider → 3. ThemeProvider
// 4. QueryClientProvider → 5. NavigationContainer

import { ErrorBoundary, ThemeProvider } from '@project/ui';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AppNavigator, linking } from './navigation/AppNavigator';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 1000 * 60, retry: 1 },
  },
});

export default function App() {
  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <ThemeProvider defaultMode="system">
          <QueryClientProvider client={queryClient}>
            <NavigationContainer linking={linking}>
              <AppNavigator />
            </NavigationContainer>
          </QueryClientProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}
