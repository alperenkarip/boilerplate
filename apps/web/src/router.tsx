// Web router — React Router 7.x
// Tum ekranlar: S01-S27 + App Shell

import { createBrowserRouter } from 'react-router-dom';
import { RootLayout } from './layouts/RootLayout';

export const router = createBrowserRouter([
  // Onboarding (S14-S16)
  { path: '/onboarding', lazy: () => import('./pages/onboarding/WelcomeSlidesPage') },
  {
    path: '/onboarding/permissions',
    lazy: () => import('./pages/onboarding/PermissionPrimerPage'),
  },
  { path: '/onboarding/profile-setup', lazy: () => import('./pages/profile/ProfileSetupPage') },

  // Auth (S08-S12)
  {
    path: '/auth',
    children: [
      { path: 'login', lazy: () => import('./pages/auth/LoginPage') },
      { path: 'register', lazy: () => import('./pages/auth/RegisterPage') },
      { path: 'forgot-password', lazy: () => import('./pages/auth/ForgotPasswordPage') },
      { path: 'reset-password', lazy: () => import('./pages/auth/ResetPasswordPage') },
      { path: 'verify-email', lazy: () => import('./pages/auth/EmailVerificationPage') },
    ],
  },

  // Protected (main) — App Shell (S17-S24 + S25-S27)
  {
    path: '/',
    element: <RootLayout />,
    children: [
      // S17 Home/Dashboard
      { index: true, lazy: () => import('./pages/HomePage') },

      // S18-S19 Profile
      { path: 'profile', lazy: () => import('./pages/profile/ProfilePage') },
      { path: 'profile/edit', lazy: () => import('./pages/profile/EditProfilePage') },

      // S20-S23 Settings
      { path: 'settings', lazy: () => import('./pages/settings/SettingsPage') },
      {
        path: 'settings/notifications',
        lazy: () => import('./pages/settings/NotificationPreferencesPage'),
      },
      {
        path: 'settings/change-password',
        lazy: () => import('./pages/settings/ChangePasswordPage'),
      },
      { path: 'settings/delete-account', lazy: () => import('./pages/settings/DeleteAccountPage') },

      // S24 About
      { path: 'about', lazy: () => import('./pages/settings/AboutPage') },

      // S25-S27 Vertical Slice
      { path: 'sample', lazy: () => import('./features/sample/ListScreen') },
      { path: 'sample/new', lazy: () => import('./features/sample/FormScreen') },
      { path: 'sample/:id', lazy: () => import('./features/sample/DetailScreen') },
    ],
  },

  // System (S03-S05)
  { path: '/offline', lazy: () => import('./pages/system/OfflineScreen') },
  { path: '/maintenance', lazy: () => import('./pages/system/MaintenancePage') },
  { path: '*', lazy: () => import('./pages/system/NotFoundPage') },
]);
