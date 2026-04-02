// Web router — React Router 7.x
// Auth gate / guest / main route ayirimi

import { createBrowserRouter } from 'react-router-dom';
import { RootLayout } from './layouts/RootLayout';

export const router = createBrowserRouter([
  // Public (guest) routes — Auth ekranlari (S08-S12)
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

  // Protected (main) routes
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, lazy: () => import('./pages/HomePage') },
      // Vertical slice — Sample feature (S25-S27)
      { path: 'sample', lazy: () => import('./features/sample/ListScreen') },
      { path: 'sample/new', lazy: () => import('./features/sample/FormScreen') },
      { path: 'sample/:id', lazy: () => import('./features/sample/DetailScreen') },
    ],
  },

  // System routes (S03-S05)
  { path: '/offline', lazy: () => import('./pages/system/OfflineScreen') },
  { path: '/maintenance', lazy: () => import('./pages/system/MaintenancePage') },
  { path: '*', lazy: () => import('./pages/system/NotFoundPage') },
]);
