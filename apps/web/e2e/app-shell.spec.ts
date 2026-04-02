// E2E — App Shell ekranlari (S14-S24)
import { test, expect } from '@playwright/test';

test.describe('Onboarding', () => {
  test('S14 — welcome slides yuklenebilir', async ({ page }) => {
    await page.goto('/onboarding');
    await expect(page.getByRole('heading')).toBeVisible();
  });

  test('S15 — permission primer yuklenebilir', async ({ page }) => {
    await page.goto('/onboarding/permissions');
    await expect(page.getByRole('heading')).toBeVisible();
  });
});

test.describe('Profile', () => {
  test('S16 — profile setup yuklenebilir', async ({ page }) => {
    await page.goto('/onboarding/profile-setup');
    await expect(page.getByRole('heading')).toBeVisible();
  });

  test('S18 — profile sayfa yuklenebilir', async ({ page }) => {
    await page.goto('/profile');
    await expect(page.getByRole('heading')).toBeVisible();
  });

  test('S19 — edit profile yuklenebilir', async ({ page }) => {
    await page.goto('/profile/edit');
    await expect(page.getByRole('heading')).toBeVisible();
  });
});

test.describe('Settings', () => {
  test('S20 — settings yuklenebilir', async ({ page }) => {
    await page.goto('/settings');
    await expect(page.getByRole('heading')).toBeVisible();
  });

  test('S21 — notification prefs yuklenebilir', async ({ page }) => {
    await page.goto('/settings/notifications');
    await expect(page.getByRole('heading')).toBeVisible();
  });

  test('S22 — change password yuklenebilir', async ({ page }) => {
    await page.goto('/settings/change-password');
    await expect(page.getByRole('heading')).toBeVisible();
  });

  test('S23 — delete account yuklenebilir', async ({ page }) => {
    await page.goto('/settings/delete-account');
    await expect(page.getByRole('heading')).toBeVisible();
  });

  test('S24 — about yuklenebilir', async ({ page }) => {
    await page.goto('/about');
    await expect(page.getByRole('heading')).toBeVisible();
  });
});
