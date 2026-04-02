// Mobile App — Provider composition root
// Provider zinciri (SPEC-IMP-001):
// 1. ErrorBoundary → 2. SafeAreaProvider → 3. ThemeProvider
// 4. QueryClientProvider → 5. NavigationContainer

import { ErrorBoundary, ThemeProvider, Stack, Heading, Text } from '@project/ui';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 1000 * 60, retry: 1 },
  },
});

const NativeStack = createNativeStackNavigator();

function HomeScreen() {
  return (
    <Stack gap={4} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Heading level={1}>Boilerplate</Heading>
      <Text color="secondary">Mobile uygulama basariyla ayaga kalkti.</Text>
    </Stack>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <ThemeProvider defaultMode="system">
          <QueryClientProvider client={queryClient}>
            <NavigationContainer>
              <NativeStack.Navigator screenOptions={{ headerShown: false }}>
                <NativeStack.Screen name="Home" component={HomeScreen} />
              </NativeStack.Navigator>
            </NavigationContainer>
          </QueryClientProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}
