// AuthProvider — uygulama genelinde auth durumu ve eylemleri (ADR-021).
//
// authAdapter (@react-native-firebase/auth) uzerine kurulu React context.
// Tek bir onAuthStateChanged aboneligi tum auth durumunu surur; ekranlar
// useAuth() ile eylemlere ve sanitize edilmis AuthSummary'ye erisir.

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import { authAdapter } from '../firebase/authAdapter';
import type { AuthSummary } from '@project/core';

interface AuthContextValue {
  /** En guncel auth ozeti; ilk auth-state sinyaline kadar null. */
  summary: AuthSummary | null;
  /** Oturum acik mi. */
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  sendEmailVerification: () => Promise<void>;
  updatePassword: (newPassword: string) => Promise<void>;
  updateProfile: (input: {
    displayName?: string | null;
    photoURL?: string | null;
  }) => Promise<void>;
  deleteAccount: () => Promise<void>;
  confirmPasswordReset: (oobCode: string, newPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }): React.JSX.Element {
  const [summary, setSummary] = useState<AuthSummary | null>(() => authAdapter.getCurrentUser());

  useEffect(() => {
    // Uygulama omru boyunca tek abonelik; cleanup'ta detach edilir.
    const unsubscribe = authAdapter.onAuthStateChanged(setSummary);
    return unsubscribe;
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      summary,
      isAuthenticated: summary?.status === 'authenticated',
      signIn: async (email, password) => {
        await authAdapter.signIn(email, password);
      },
      signUp: async (email, password) => {
        await authAdapter.signUp(email, password);
      },
      signOut: () => authAdapter.signOut(),
      sendPasswordReset: (email) => authAdapter.sendPasswordReset(email),
      sendEmailVerification: () => authAdapter.sendEmailVerification(),
      updatePassword: (newPassword) => authAdapter.updatePassword(newPassword),
      updateProfile: (input) => authAdapter.updateProfile(input),
      deleteAccount: () => authAdapter.deleteAccount(),
      confirmPasswordReset: (oobCode, newPassword) =>
        authAdapter.confirmPasswordReset(oobCode, newPassword),
    }),
    [summary],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/** Auth context erisim hook'u — AuthProvider disinda kullanilirsa hata firlatir. */
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth, AuthProvider icinde kullanilmalidir.');
  }
  return context;
}
