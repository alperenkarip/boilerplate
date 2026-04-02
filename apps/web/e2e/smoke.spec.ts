// E2E Smoke Test — uygulama ayaga kalkiyor mu?
import { test, expect } from '@playwright/test';

test('ana sayfa yuklenebilir', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Boilerplate' })).toBeVisible();
});

test('404 sayfasi calisir', async ({ page }) => {
  await page.goto('/olmayan-sayfa');
  await expect(page.getByText('Sayfa Bulunamadi')).toBeVisible();
});

test('login sayfasi yuklenebilir', async ({ page }) => {
  await page.goto('/auth/login');
  await expect(page.getByRole('heading', { name: /Giri/i })).toBeVisible();
});
