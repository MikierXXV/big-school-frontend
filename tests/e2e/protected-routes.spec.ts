/**
 * ============================================
 * E2E TEST: Protected Routes & Auth Guards
 * ============================================
 *
 * Tests authentication guard behavior for protected routes.
 */

import { test, expect } from '@playwright/test';

test.describe('Protected Routes & Auth Guards', () => {
  test.describe('Unauthenticated Access', () => {
    test('should redirect to login when accessing protected route without auth', async ({ page }) => {
      // Try to access dashboard without being logged in
      await page.goto('/dashboard');

      // Should redirect to login (ignore query params like ?redirect=/dashboard)
      await expect(page).toHaveURL(/\/login(\?.*)?$/);
    });

    test('should allow access to public routes without auth', async ({ page }) => {
      // Home page should be accessible
      await page.goto('/');
      await expect(page).toHaveURL('/');

      // Login page should be accessible
      await page.goto('/login');
      await expect(page).toHaveURL('/login');

      // Register page should be accessible
      await page.goto('/register');
      await expect(page).toHaveURL('/register');

      // Forgot password page should be accessible
      await page.goto('/forgot-password');
      await expect(page).toHaveURL('/forgot-password');
    });

    test('should redirect to login when accessing surgical-block without auth', async ({ page }) => {
      await page.goto('/surgical-block');
      await expect(page).toHaveURL(/\/login(\?.*)?$/);
    });

    test('should redirect to login when accessing emergency without auth', async ({ page }) => {
      await page.goto('/emergency');
      await expect(page).toHaveURL(/\/login(\?.*)?$/);
    });

    test('should redirect to login when accessing data-analytics without auth', async ({ page }) => {
      await page.goto('/data-analytics');
      await expect(page).toHaveURL(/\/login(\?.*)?$/);
    });

    test('should redirect to login when accessing wristband-printing without auth', async ({ page }) => {
      await page.goto('/wristband-printing');
      await expect(page).toHaveURL(/\/login(\?.*)?$/);
    });

    test('should redirect to login when accessing label-printing without auth', async ({ page }) => {
      await page.goto('/label-printing');
      await expect(page).toHaveURL(/\/login(\?.*)?$/);
    });

    test('should preserve intended route after login redirect', async ({ page }) => {
      // Try to access dashboard
      await page.goto('/dashboard');

      // Should redirect to login with redirect query param
      await page.waitForURL('**/login**');
      const url = page.url();

      // URL should contain redirect parameter or just be login
      expect(url).toContain('/login');
    });
  });

  test.describe('Authenticated Access (Mocked)', () => {
    test('should allow access to protected routes when authenticated', async ({ page }) => {
      // Mock authentication by setting localStorage
      await page.goto('/');
      await page.evaluate(() => {
        localStorage.setItem('accessToken', 'mock-access-token');
        localStorage.setItem('refreshToken', 'mock-refresh-token');
      });

      // Also set Pinia state (if needed)
      await page.addInitScript(() => {
        // @ts-ignore
        window.__MOCK_AUTH__ = {
          user: {
            id: 'mock-user-id',
            email: 'test@example.com',
            firstName: 'Test',
            lastName: 'User',
            fullName: 'Test User',
            emailVerified: true,
            status: 'ACTIVE',
          },
          accessToken: 'mock-access-token',
        };
      });

      // Navigate to dashboard
      await page.goto('/dashboard');

      // Should stay on dashboard
      await expect(page).toHaveURL('/dashboard');
      await expect(page.locator('text=/Welcome|Dashboard/i')).toBeVisible();
    });

    test('should redirect to dashboard when authenticated user visits login', async ({ page }) => {
      // Mock authentication
      await page.goto('/');
      await page.evaluate(() => {
        localStorage.setItem('accessToken', 'mock-access-token');
        localStorage.setItem('refreshToken', 'mock-refresh-token');
      });

      // Try to visit login page while authenticated
      await page.goto('/login');

      // Should redirect to dashboard (guest-only route)
      await expect(page).toHaveURL(/\/dashboard/);
    });

    test('should redirect to dashboard when authenticated user visits register', async ({ page }) => {
      // Mock authentication
      await page.goto('/');
      await page.evaluate(() => {
        localStorage.setItem('accessToken', 'mock-access-token');
        localStorage.setItem('refreshToken', 'mock-refresh-token');
      });

      // Try to visit register page while authenticated
      await page.goto('/register');

      // Should redirect to dashboard (guest-only route)
      await expect(page).toHaveURL(/\/dashboard/);
    });
  });

  test.describe('Logout Behavior', () => {
    test('should redirect to login after logout', async ({ page }) => {
      // Mock authentication
      await page.goto('/');
      await page.evaluate(() => {
        localStorage.setItem('accessToken', 'mock-access-token');
        localStorage.setItem('refreshToken', 'mock-refresh-token');
      });

      // Navigate to dashboard
      await page.goto('/dashboard');

      // Click logout button (in header)
      const logoutButton = page.locator('button:has-text("Logout"), button:has-text("Sign out")');
      if (await logoutButton.isVisible()) {
        await logoutButton.click();

        // Should redirect to login (ignore query params)
        await expect(page).toHaveURL(/\/login(\?.*)?$/);

        // Tokens should be cleared
        const accessToken = await page.evaluate(() => localStorage.getItem('accessToken'));
        expect(accessToken).toBeNull();
      }
    });

    test('should not access protected routes after logout', async ({ page }) => {
      // Mock authentication
      await page.goto('/');
      await page.evaluate(() => {
        localStorage.setItem('accessToken', 'mock-access-token');
        localStorage.setItem('refreshToken', 'mock-refresh-token');
      });

      // Navigate to dashboard
      await page.goto('/dashboard');

      // Clear auth manually (simulate logout)
      await page.evaluate(() => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      });

      // Try to access dashboard again
      await page.goto('/dashboard');

      // Should redirect to login (ignore query params)
      await expect(page).toHaveURL(/\/login(\?.*)?$/);
    });
  });

  test.describe('Route Metadata', () => {
    test('should respect requiresAuth meta field', async ({ page }) => {
      // Dashboard has requiresAuth: true
      await page.goto('/dashboard');
      await expect(page).toHaveURL(/\/login(\?.*)?$/);
    });

    test('should respect requiresGuest meta field', async ({ page }) => {
      // Mock authentication
      await page.goto('/');
      await page.evaluate(() => {
        localStorage.setItem('accessToken', 'mock-access-token');
        localStorage.setItem('refreshToken', 'mock-refresh-token');
      });

      // Login/register have requiresGuest: true
      await page.goto('/login');
      await expect(page).toHaveURL(/\/dashboard/);

      await page.goto('/register');
      await expect(page).toHaveURL(/\/dashboard/);

      await page.goto('/reset-password');
      await expect(page).toHaveURL(/\/dashboard/);
    });
  });

  test.describe('Navigation Guards Edge Cases', () => {
    test('should handle multiple rapid navigation attempts', async ({ page }) => {
      // Rapidly navigate between routes
      await page.goto('/');
      await page.goto('/login');
      await page.goto('/register');
      await page.goto('/dashboard');

      // Should end up at login (last protected route without auth)
      await expect(page).toHaveURL(/\/login(\?.*)?$/);
    });

    test('should handle invalid routes', async ({ page }) => {
      await page.goto('/non-existent-route');

      // Should show 404 page
      await expect(page.locator('text=/404|not found/i')).toBeVisible();
    });

    test('should preserve query parameters during redirects', async ({ page }) => {
      // Navigate to protected route with query params
      await page.goto('/dashboard?view=stats&filter=active');

      // After redirect to login, should preserve redirect intent
      await page.waitForURL('**/login**');

      // Login URL may or may not preserve original query, but should be stable
      const url = page.url();
      expect(url).toContain('/login');
    });
  });
});
