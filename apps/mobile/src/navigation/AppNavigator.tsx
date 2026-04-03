// AppNavigator — Merkezi navigation yapilandirmasi
// React Navigation 7.x native-stack tabanli
// Bottom tabs paketi mevcut olmadigindan tum yapilar stack navigator ile kurulmustur

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { LinkingOptions } from '@react-navigation/native';

import type {
  RootStackParamList,
  AuthStackParamList,
  OnboardingStackParamList,
  MainStackParamList,
  SampleStackParamList,
  SystemStackParamList,
  RootStackScreenProps,
  SampleStackScreenProps,
  SystemStackScreenProps,
} from './types';

// --- Auth ekranlari ---
import { LoginScreen } from '../screens/auth/LoginScreen';
import { RegisterScreen } from '../screens/auth/RegisterScreen';
import { ForgotPasswordScreen } from '../screens/auth/ForgotPasswordScreen';
import { ResetPasswordScreen } from '../screens/auth/ResetPasswordScreen';
import { EmailVerificationScreen } from '../screens/auth/EmailVerificationScreen';

// --- Onboarding ekranlari ---
import { WelcomeSlidesScreen } from '../screens/onboarding/WelcomeSlidesScreen';
import { PermissionPrimerScreen } from '../screens/onboarding/PermissionPrimerScreen';
import { ProfileSetupScreen } from '../screens/onboarding/ProfileSetupScreen';

// --- Main ekranlari ---
import { HomeScreen } from '../screens/main/HomeScreen';
import { ProfileScreen } from '../screens/main/ProfileScreen';
import { SettingsScreen } from '../screens/main/SettingsScreen';
import { EditProfileScreen } from '../screens/main/EditProfileScreen';
import { ChangePasswordScreen } from '../screens/main/ChangePasswordScreen';
import { DeleteAccountScreen } from '../screens/main/DeleteAccountScreen';
import { NotificationPrefsScreen } from '../screens/main/NotificationPrefsScreen';
import { AboutScreen } from '../screens/main/AboutScreen';

// --- Sample ekranlari ---
import { ListScreen } from '../screens/sample/ListScreen';
import { DetailScreen } from '../screens/sample/DetailScreen';
import { FormScreen } from '../screens/sample/FormScreen';

// --- System ekranlari ---
import { ErrorScreen } from '../screens/system/ErrorScreen';
import { MaintenanceScreen } from '../screens/system/MaintenanceScreen';
import { OfflineScreen } from '../screens/system/OfflineScreen';
import { NotFoundScreen } from '../screens/system/NotFoundScreen';

// --- Root ekranlar ---
import { SplashScreen } from '../screens/SplashScreen';
import { BiometricPromptScreen } from '../screens/BiometricPromptScreen';
import { ForceUpdateScreen } from '../screens/ForceUpdateScreen';

// ============================================================
// Navigator-uyumlu sarmalayicilar (wrapper)
// Props alan ekranlari route.params ile eslestiren adaptorler
// ============================================================

/** BiometricPromptScreen — navigator route'undan callback'leri saglayan wrapper */
function BiometricPromptWrapper(): React.JSX.Element {
  const navigation = useNavigation<RootStackScreenProps<'BiometricPrompt'>['navigation']>();
  return (
    <BiometricPromptScreen
      onAuthenticate={() => {
        // Basarili biyometrik dogrulama — Main'e yonlendir
        navigation.reset({ index: 0, routes: [{ name: 'Main' }] });
      }}
      onSkip={() => {
        // Sifre ile giris — Auth'a yonlendir
        navigation.navigate('Auth', { screen: 'Login' });
      }}
    />
  );
}

/** ForceUpdateScreen — store URL param'larini route'dan alan wrapper */
function ForceUpdateWrapper(): React.JSX.Element {
  const route = useRoute<RootStackScreenProps<'ForceUpdate'>['route']>();
  return (
    <ForceUpdateScreen
      iosStoreUrl={route.params?.iosStoreUrl}
      androidStoreUrl={route.params?.androidStoreUrl}
    />
  );
}

/** DetailScreen — itemId param'ini route'dan alan wrapper */
function DetailScreenWrapper(): React.JSX.Element {
  const route = useRoute<SampleStackScreenProps<'Detail'>['route']>();
  return <DetailScreen itemId={route.params?.itemId} />;
}

/** ErrorScreen — hata bilgisini route param'dan alan wrapper */
function ErrorScreenWrapper(): React.JSX.Element {
  const route = useRoute<SystemStackScreenProps<'Error'>['route']>();
  const errorMessage = route.params?.message;
  const error = errorMessage ? new Error(errorMessage) : undefined;
  return <ErrorScreen error={error} />;
}

// ============================================================
// Stack Navigator tanimlari
// ============================================================

const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const OnboardingStack = createNativeStackNavigator<OnboardingStackParamList>();
const MainStack = createNativeStackNavigator<MainStackParamList>();
const SampleStack = createNativeStackNavigator<SampleStackParamList>();
const SystemStack = createNativeStackNavigator<SystemStackParamList>();
const RootStack = createNativeStackNavigator<RootStackParamList>();

// --- Varsayilan ekran ayarlari (kendi Header component'imiz oldugu icin gizli) ---
const defaultScreenOptions = { headerShown: false } as const;

// ============================================================
// Alt stack navigator'lar
// ============================================================

/** Auth akisi — giris, kayit, sifre sifirlama */
function AuthNavigator(): React.JSX.Element {
  return (
    <AuthStack.Navigator screenOptions={defaultScreenOptions}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Register" component={RegisterScreen} />
      <AuthStack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <AuthStack.Screen name="ResetPassword" component={ResetPasswordScreen} />
      <AuthStack.Screen name="EmailVerification" component={EmailVerificationScreen} />
    </AuthStack.Navigator>
  );
}

/** Onboarding akisi — ilk kullanim, izin isteme, profil olusturma */
function OnboardingNavigator(): React.JSX.Element {
  return (
    <OnboardingStack.Navigator screenOptions={defaultScreenOptions}>
      <OnboardingStack.Screen name="WelcomeSlides" component={WelcomeSlidesScreen} />
      <OnboardingStack.Screen name="PermissionPrimer" component={PermissionPrimerScreen} />
      <OnboardingStack.Screen name="ProfileSetup" component={ProfileSetupScreen} />
    </OnboardingStack.Navigator>
  );
}

/** Ana ekranlar — home, profil, ayarlar ve alt sayfalari */
function MainNavigator(): React.JSX.Element {
  return (
    <MainStack.Navigator screenOptions={defaultScreenOptions}>
      <MainStack.Screen name="Home" component={HomeScreen} />
      <MainStack.Screen name="Profile" component={ProfileScreen} />
      <MainStack.Screen name="Settings" component={SettingsScreen} />
      <MainStack.Screen name="EditProfile" component={EditProfileScreen} />
      <MainStack.Screen name="ChangePassword" component={ChangePasswordScreen} />
      <MainStack.Screen name="DeleteAccount" component={DeleteAccountScreen} />
      <MainStack.Screen name="NotificationPrefs" component={NotificationPrefsScreen} />
      <MainStack.Screen name="About" component={AboutScreen} />
    </MainStack.Navigator>
  );
}

/** Ornek CRUD akisi — liste, detay, form */
function SampleNavigator(): React.JSX.Element {
  return (
    <SampleStack.Navigator screenOptions={defaultScreenOptions}>
      <SampleStack.Screen name="List" component={ListScreen} />
      <SampleStack.Screen name="Detail" component={DetailScreenWrapper} />
      <SampleStack.Screen name="Form" component={FormScreen} />
    </SampleStack.Navigator>
  );
}

/** Sistem ekranlari — hata, bakim, cevrimdisi, 404 (modal olarak sunulur) */
function SystemNavigator(): React.JSX.Element {
  return (
    <SystemStack.Navigator screenOptions={defaultScreenOptions}>
      <SystemStack.Screen name="Error" component={ErrorScreenWrapper} />
      <SystemStack.Screen name="Maintenance" component={MaintenanceScreen} />
      <SystemStack.Screen name="Offline" component={OfflineScreen} />
      <SystemStack.Screen name="NotFound" component={NotFoundScreen} />
    </SystemStack.Navigator>
  );
}

// ============================================================
// Deep Linking yapilandirmasi
// ============================================================

export const linking: LinkingOptions<RootStackParamList> = {
  prefixes: ['boilerplate://', 'https://boilerplate.app'],
  config: {
    screens: {
      Splash: 'splash',
      Auth: {
        screens: {
          Login: 'login',
          Register: 'register',
          ForgotPassword: 'forgot-password',
          ResetPassword: 'reset-password',
          EmailVerification: 'email-verification',
        },
      },
      Onboarding: {
        screens: {
          WelcomeSlides: 'welcome',
          PermissionPrimer: 'permissions',
          ProfileSetup: 'profile-setup',
        },
      },
      Main: {
        screens: {
          Home: '',
          Profile: 'profile',
          Settings: 'settings',
          EditProfile: 'profile/edit',
          ChangePassword: 'settings/change-password',
          DeleteAccount: 'settings/delete-account',
          NotificationPrefs: 'settings/notifications',
          About: 'about',
        },
      },
      Sample: {
        screens: {
          List: 'samples',
          Detail: 'samples/:itemId',
          Form: 'samples/form',
        },
      },
      System: {
        screens: {
          Error: 'error',
          Maintenance: 'maintenance',
          Offline: 'offline',
          NotFound: '*',
        },
      },
      BiometricPrompt: 'biometric',
      ForceUpdate: 'force-update',
    },
  },
};

// ============================================================
// Root Navigator
// ============================================================

/** Kok navigator — tum alt stack'leri ve bagimsiz ekranlari birlestirir */
export function AppNavigator(): React.JSX.Element {
  return (
    <RootStack.Navigator screenOptions={defaultScreenOptions}>
      {/* Splash — uygulama acilisinda ilk ekran */}
      <RootStack.Screen name="Splash" component={SplashScreen} />

      {/* Auth akisi */}
      <RootStack.Screen name="Auth" component={AuthNavigator} />

      {/* Onboarding akisi */}
      <RootStack.Screen name="Onboarding" component={OnboardingNavigator} />

      {/* Ana ekranlar */}
      <RootStack.Screen name="Main" component={MainNavigator} />

      {/* Ornek CRUD akisi */}
      <RootStack.Screen name="Sample" component={SampleNavigator} />

      {/* Biyometrik dogrulama */}
      <RootStack.Screen name="BiometricPrompt" component={BiometricPromptWrapper} />

      {/* Zorunlu guncelleme */}
      <RootStack.Screen name="ForceUpdate" component={ForceUpdateWrapper} />

      {/* Sistem ekranlari — modal sunumu */}
      <RootStack.Group screenOptions={{ presentation: 'modal' }}>
        <RootStack.Screen name="System" component={SystemNavigator} />
      </RootStack.Group>
    </RootStack.Navigator>
  );
}
