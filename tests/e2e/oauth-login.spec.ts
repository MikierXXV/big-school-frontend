/**
 * ============================================
 * E2E TEST: OAuth Login Flow
 * ============================================
 *
 * Tests the Google and Microsoft OAuth login buttons on the login page,
 * and the OAuth callback page behavior.
 */

import { test, expect } from '@playwright/test';

test.describe('OAuth Login — Login page buttons', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    // Wait for the form to be ready
    await page.locator('button[type="submit"]').waitFor({ state: 'visible' });
  });

  test('should display Google and Microsoft OAuth buttons', async ({ page }) => {
    await expect(page.locator('[data-testid="oauth-btn-google"]')).toBeVisible();
    await expect(page.locator('[data-testid="oauth-btn-microsoft"]')).toBeVisible();
  });

  test('should display "Or continue with" divider', async ({ page }) => {
    await expect(page.locator('text=Or continue with')).toBeVisible();
  });

  test('should call initiate-oauth endpoint when Google button is clicked', async ({ page }) => {
    // Track whether the API was called
    const apiRequestPromise = page.waitForRequest((req) =>
      req.url().includes('/auth/oauth/google/authorize')
    );

    // Mock the backend initiate-oauth endpoint (abort external navigation)
    await page.route('**/api/auth/oauth/google/authorize**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            authorizationUrl: 'https://accounts.google.com/o/oauth2/v2/auth?mock=1',
            state: 'mock-state-token',
          },
        }),
      });
    });

    // Abort external provider navigation
    await page.route('https://accounts.google.com/**', (route) => route.abort());

    await page.locator('[data-testid="oauth-btn-google"]').click();

    // Verify the initiate-oauth API was called
    const req = await apiRequestPromise;
    expect(req.url()).toContain('/auth/oauth/google/authorize');
  });

  test('should call initiate-oauth endpoint when Microsoft button is clicked', async ({ page }) => {
    const apiRequestPromise = page.waitForRequest((req) =>
      req.url().includes('/auth/oauth/microsoft/authorize')
    );

    await page.route('**/api/auth/oauth/microsoft/authorize**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            authorizationUrl: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize?mock=1',
            state: 'mock-state-token-ms',
          },
        }),
      });
    });

    // Abort external provider navigation
    await page.route('https://login.microsoftonline.com/**', (route) => route.abort());

    await page.locator('[data-testid="oauth-btn-microsoft"]').click();

    const req = await apiRequestPromise;
    expect(req.url()).toContain('/auth/oauth/microsoft/authorize');
  });

  test('should show error message when OAuth initiation fails', async ({ page }) => {
    await page.route('**/api/auth/oauth/google/authorize**', async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({
          success: false,
          error: { code: 'INTERNAL_ERROR', message: 'OAuth service unavailable' },
        }),
      });
    });

    await page.locator('[data-testid="oauth-btn-google"]').click();

    await expect(page.locator('[role="alert"]')).toBeVisible({ timeout: 5000 });
  });
});

test.describe('OAuth Callback page', () => {
  test('should show error if code or state missing', async ({ page }) => {
    await page.goto('/oauth/callback');
    await expect(page.locator('text=Invalid callback')).toBeVisible({ timeout: 5000 });
  });

  test('should show error if state does not match sessionStorage', async ({ page }) => {
    // Set a different state in sessionStorage on the same origin
    await page.goto('/login');
    await page.evaluate(() => {
      sessionStorage.setItem('oauth_state', 'expected-state');
      sessionStorage.setItem('oauth_provider', 'google');
    });

    await page.goto('/oauth/callback?code=mycode&state=wrong-state');
    await expect(page.locator('text=OAuth state mismatch')).toBeVisible({ timeout: 5000 });
  });

  test('should show error on provider oauth error param', async ({ page }) => {
    await page.goto('/oauth/callback?error=access_denied');
    await expect(page.locator('text=OAuth error')).toBeVisible({ timeout: 5000 });
  });

  test('should complete login and redirect to dashboard on success', async ({ page }) => {
    // Seed sessionStorage with matching state on same origin
    await page.goto('/login');
    await page.evaluate(() => {
      sessionStorage.setItem('oauth_state', 'valid-state-123');
      sessionStorage.setItem('oauth_provider', 'google');
    });

    // Mock the callback endpoint — status must be 'ACTIVE' (UserStatus enum value)
    await page.route('**/api/auth/oauth/callback', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            user: {
              id: 'a1b2c3d4-e5f6-4890-abcd-ef1234567890',
              email: 'oauth@example.com',
              firstName: 'OAuth',
              lastName: 'User',
              status: 'ACTIVE',
              systemRole: 'user',
              emailVerified: true,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
            tokens: {
              accessToken: 'mock-access-token',
              refreshToken: 'mock-refresh-token',
              tokenType: 'Bearer',
              expiresIn: 18000,
              expiresAt: new Date(Date.now() + 18000000).toISOString(),
              refreshExpiresIn: 259200,
            },
          },
        }),
      });
    });

    // Navigate to callback with matching state
    await page.goto('/oauth/callback?code=auth-code-xyz&state=valid-state-123');

    // Should redirect to dashboard
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 10000 });
  });
});
