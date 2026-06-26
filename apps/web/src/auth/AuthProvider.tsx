// AuthProvider — app-wide auth context backed by useAuth (Firebase Auth).
//
// Provides a single reactive auth state + actions (login/register/logout) to the
// whole tree. Mount inside QueryClientProvider (useAuth depends on the query
// client for logout cache teardown) and outside RouterProvider.

import { createContext, useContext, type ReactNode } from 'react';
import { useAuth, type UseAuthResult } from './useAuth';

const AuthContext = createContext<UseAuthResult | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

/** Read the auth context. Throws if used outside an AuthProvider. */
export function useAuthContext(): UseAuthResult {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}
