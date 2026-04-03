// Navigation tip tanimlari
// Tum stack ve ekran parametreleri burada merkezi olarak tanimlanir

import type { NavigatorScreenParams } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

// --- Auth Stack ---
export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  ResetPassword: { token?: string };
  EmailVerification: { email?: string };
};

// --- Onboarding Stack ---
export type OnboardingStackParamList = {
  WelcomeSlides: undefined;
  PermissionPrimer: undefined;
  ProfileSetup: undefined;
};

// --- Main Stack (Tab simulasyonu stack ile) ---
export type MainStackParamList = {
  Home: undefined;
  Profile: undefined;
  Settings: undefined;
  EditProfile: undefined;
  ChangePassword: undefined;
  DeleteAccount: undefined;
  NotificationPrefs: undefined;
  About: undefined;
};

// --- Sample Stack ---
export type SampleStackParamList = {
  List: undefined;
  Detail: { itemId?: string };
  Form: { itemId?: string };
};

// --- System Stack (modal) ---
export type SystemStackParamList = {
  Error: { message?: string };
  Maintenance: undefined;
  Offline: undefined;
  NotFound: undefined;
};

// --- Root Stack ---
export type RootStackParamList = {
  Splash: undefined;
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Onboarding: NavigatorScreenParams<OnboardingStackParamList>;
  Main: NavigatorScreenParams<MainStackParamList>;
  Sample: NavigatorScreenParams<SampleStackParamList>;
  System: NavigatorScreenParams<SystemStackParamList>;
  BiometricPrompt: undefined;
  ForceUpdate: { iosStoreUrl?: string; androidStoreUrl?: string };
};

// --- Ekran prop tipleri ---
export type RootStackScreenProps<T extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  T
>;

export type AuthStackScreenProps<T extends keyof AuthStackParamList> = NativeStackScreenProps<
  AuthStackParamList,
  T
>;

export type OnboardingStackScreenProps<T extends keyof OnboardingStackParamList> =
  NativeStackScreenProps<OnboardingStackParamList, T>;

export type MainStackScreenProps<T extends keyof MainStackParamList> = NativeStackScreenProps<
  MainStackParamList,
  T
>;

export type SampleStackScreenProps<T extends keyof SampleStackParamList> = NativeStackScreenProps<
  SampleStackParamList,
  T
>;

export type SystemStackScreenProps<T extends keyof SystemStackParamList> = NativeStackScreenProps<
  SystemStackParamList,
  T
>;

// --- React Navigation global tip entegrasyonu ---
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace ReactNavigation {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface RootParamList extends RootStackParamList {}
  }
}
