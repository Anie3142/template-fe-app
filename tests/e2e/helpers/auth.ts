import { expect, type Page } from '@playwright/test';

/**
 * Dev-bypass helper. Backend must be running with `DEV_AUTH_BYPASS=true` so
 * the API accepts requests without a real Auth0 token. The frontend reads
 * `NEXT_PUBLIC_DEV_AUTH_BYPASS=true` from env and skips the Auth0 roundtrip.
 *
 * Usage:
 *
 *   test.beforeEach(async ({ page }) => {
 *     await devBypassLogin(page);
 *   });
 */
export async function devBypassLogin(page: Page) {
  await page.goto('/');
  // Confirm the landing page rendered before we start interacting.
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
}
