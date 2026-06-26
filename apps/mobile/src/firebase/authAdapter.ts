// AuthPort adapter'i — @react-native-firebase/auth (ADR-021).
//
// @MX:NOTE: [AUTO] packages/core AuthPort sozlesmesinin mobile implementasyonu; AuthProvider bu adapter uzerinden tum auth akisini yurutur
// Sinir kurali (ADR-021 Bolum 11):
//   - Ham SDK User nesnesi disari sizmaz; yalnizca sanitize edilmis AuthSummary doner.
//   - getIdToken() ham token'i yalnizca outbound yetkilendirme icin acar;
//     token UI'a, generic state'e veya log'a yazilmaz.
// @MX:TODO: [AUTO] jest-expo + native modul mock'lari ile adapter testleri eklenmeli

import auth, { type FirebaseAuthTypes } from '@react-native-firebase/auth';
import type { AuthPort, AuthSummary, Unsubscribe } from '@project/core';

/** Ham Firebase user'i SDK-free AuthSummary'ye donusturur. */
function toSummary(user: FirebaseAuthTypes.User | null): AuthSummary {
  if (user === null) {
    return { status: 'unauthenticated', userId: null, displayName: null };
  }
  return { status: 'authenticated', userId: user.uid, displayName: user.displayName };
}

export const authAdapter: AuthPort = {
  getCurrentUser(): AuthSummary | null {
    const user = auth().currentUser;
    // Ilk auth-state sinyalinden once / oturum kapaliyken null doner.
    return user === null ? null : toSummary(user);
  },

  onAuthStateChanged(callback: (summary: AuthSummary) => void): Unsubscribe {
    return auth().onAuthStateChanged((user) => {
      callback(toSummary(user));
    });
  },

  async signIn(email: string, password: string): Promise<AuthSummary> {
    const credential = await auth().signInWithEmailAndPassword(email, password);
    return toSummary(credential.user);
  },

  async signUp(email: string, password: string): Promise<AuthSummary> {
    const credential = await auth().createUserWithEmailAndPassword(email, password);
    return toSummary(credential.user);
  },

  async signOut(): Promise<void> {
    await auth().signOut();
  },

  async sendPasswordReset(email: string): Promise<void> {
    await auth().sendPasswordResetEmail(email);
  },

  async sendEmailVerification(): Promise<void> {
    const user = auth().currentUser;
    if (user === null) {
      throw new Error('E-posta dogrulamasi icin oturum acmis kullanici yok.');
    }
    await user.sendEmailVerification();
  },

  async updatePassword(newPassword: string): Promise<void> {
    const user = auth().currentUser;
    if (user === null) {
      throw new Error('Sifre guncellemek icin oturum acmis kullanici yok.');
    }
    // Eski oturumlarda 'auth/requires-recent-login' firlatabilir; cagiran taraf
    // gerekirse yeniden giris yapip tekrar denemeli (reauth henuz port'ta yok).
    await user.updatePassword(newPassword);
  },

  async updateProfile(input: {
    displayName?: string | null;
    photoURL?: string | null;
  }): Promise<void> {
    const user = auth().currentUser;
    if (user === null) {
      throw new Error('Profil guncellemek icin oturum acmis kullanici yok.');
    }
    await user.updateProfile(input);
  },

  async deleteAccount(): Promise<void> {
    const user = auth().currentUser;
    if (user === null) {
      throw new Error('Hesap silmek icin oturum acmis kullanici yok.');
    }
    await user.delete();
  },

  async confirmPasswordReset(oobCode: string, newPassword: string): Promise<void> {
    // Yetkilendirme gerektirmeyen action-code akisi; currentUser sart degil.
    await auth().confirmPasswordReset(oobCode, newPassword);
  },

  async getIdToken(forceRefresh?: boolean): Promise<string | null> {
    const user = auth().currentUser;
    if (user === null) return null;
    return user.getIdToken(forceRefresh);
  },
};
