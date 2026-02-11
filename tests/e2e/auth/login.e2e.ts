/**
 * ============================================
 * E2E TEST: Login Flow
 * ============================================
 *
 * Tests End-to-End para el flujo de login.
 *
 * TODO: Implementar tests completos
 */

import { test, expect } from '@playwright/test';

test.describe('Login Flow', () => {
  test('should display login form', async ({ page }) => {
    await page.goto('/login');

    await expect(page.getByRole('textbox', { name: /email/i })).toBeVisible();
    await expect(page.getByRole('textbox', { name: /password/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /login/i })).toBeVisible();
  });

  test.skip('should login successfully with valid credentials', async ({ page }) => {
    // TODO: Implementar test con mock API
    await page.goto('/login');

    await page.fill('input[type="email"]', 'user@example.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');

    // await expect(page).toHaveURL('/dashboard');
  });

  test.skip('should show error with invalid credentials', async ({ page }) => {
    // TODO: Implementar test con mock API
  });

  // TODO: Agregar mas tests de flujo de login
});
