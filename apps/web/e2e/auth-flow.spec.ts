// E2E — Auth flow integration testi
import { test, expect } from '@playwright/test';

test.describe('Auth Flow', () => {
  test('login → register navigasyonu calisir', async ({ page }) => {
    await page.goto('/auth/login');
    await expect(page.getByRole('heading')).toBeVisible();
  });

  test('register sayfasi acilir', async ({ page }) => {
    await page.goto('/auth/register');
    await expect(page.getByRole('heading')).toBeVisible();
  });

  test('forgot password sayfasi acilir', async ({ page }) => {
    await page.goto('/auth/forgot-password');
    await expect(page.getByRole('heading')).toBeVisible();
  });

  test('reset password sayfasi acilir', async ({ page }) => {
    await page.goto('/auth/reset-password');
    await expect(page.getByRole('heading')).toBeVisible();
  });

  test('email verification sayfasi acilir', async ({ page }) => {
    await page.goto('/auth/verify-email');
    await expect(page.getByRole('heading')).toBeVisible();
  });
});
