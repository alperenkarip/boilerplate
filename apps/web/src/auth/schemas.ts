// Auth form validation schemas (react-hook-form + Zod).
// User-facing validation messages are Turkish per language.yaml (error_messages: tr).
import { z } from 'zod';

export const loginSchema = z.object({
  email: z.email('Gecerli bir e-posta adresi girin'),
  password: z.string().min(1, 'Sifre zorunludur'),
});
export type LoginFormData = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  name: z.string().min(1, 'Ad Soyad zorunludur'),
  email: z.email('Gecerli bir e-posta adresi girin'),
  password: z.string().min(8, 'Sifre en az 8 karakter olmalidir'),
});
export type RegisterFormData = z.infer<typeof registerSchema>;

export const forgotPasswordSchema = z.object({
  email: z.email('Gecerli bir e-posta adresi girin'),
});
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    newPassword: z.string().min(8, 'Sifre en az 8 karakter olmalidir'),
    confirmPassword: z.string().min(1, 'Sifre tekrari zorunludur'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Sifreler eslesmiyor',
    path: ['confirmPassword'],
  });
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
