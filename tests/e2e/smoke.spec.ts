import { expect, test } from '@playwright/test';

test('landing page renders with a button and Auth0 login link', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Template App' })).toBeVisible();
  await expect(page.getByRole('link', { name: /Login with Auth0/i })).toBeVisible();
});
