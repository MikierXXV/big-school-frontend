/**
 * ============================================
 * E2E TEST: Password Reset Flow
 * ============================================
 *
 * Tests password reset request → reset confirmation flow.
 */

import { test, expect } from '@playwright/test';

test.describe('Password Reset Flow', () => {
  test.describe('Request Password Reset', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/forgot-password');
    });

    test('should display forgot password form', async ({ page }) => {
      // Check page title
      await expect(page.locator('h1')).toContainText(/Forgot|Reset/i);

      // Check form fields exist
      await expect(page.locator('input[type="email"]')).toBeVisible();
      await expect(page.locator('button[type="submit"]')).toBeVisible();
    });

    test('should show validation error for empty email', async ({ page }) => {
      // Click submit without filling email
      await page.click('button[type="submit"]');

      // Check for validation error
      await expect(page.locator('text=Email is required')).toBeVisible();
    });

    test('should show validation error for invalid email format', async ({ page }) => {
      // Enter invalid email
      await page.fill('input[type="email"]', 'invalid-email');

      // Blur to trigger validation
      await page.click('button[type="submit"]');

      // Check for validation error
      await expect(page.locator('text=Invalid email format')).toBeVisible();
    });

    test('should successfully submit password reset request', async ({ page }) => {
      // Fill email
      await page.fill('input[type="email"]', 'user@example.com');

      // Submit form
      await page.click('button[type="submit"]');

      // Should show loading state
      await expect(page.locator('button[type="submit"]:disabled')).toBeVisible();

      // Should show success message (eventually)
      await expect(page.locator('text=/check your email|sent/i')).toBeVisible({
        timeout: 5000,
      });
    });

    test('should have link to login page', async ({ page }) => {
      const loginLink = page.locator('a[href="/login"]');

      await expect(loginLink).toBeVisible();
      await expect(loginLink).toContainText(/back to|Sign in/i);

      // Click link
      await loginLink.click();

      // Should navigate to login page
      await expect(page).toHaveURL('/login');
    });

    test('should always show success message (security)', async ({ page }) => {
      // Even for non-existent email, should show success (don't leak user existence)
      await page.fill('input[type="email"]', 'nonexistent@example.com');
      await page.click('button[type="submit"]');

      // Should still show success message
      await expect(page.locator('text=/check your email|sent/i')).toBeVisible({
        timeout: 5000,
      });
    });
  });

  test.describe('Confirm Password Reset', () => {
    test.beforeEach(async ({ page }) => {
      // Navigate to reset confirmation with token
      await page.goto('/reset-password?token=test-reset-token-123');
    });

    test('should display reset password form with token', async ({ page }) => {
      // Check page title
      await expect(page.locator('h1')).toContainText(/Reset|New password/i);

      // Check form fields exist
      await expect(page.locator('input[type="password"]').first()).toBeVisible();
      await expect(page.locator('input[type="password"]').last()).toBeVisible();
      await expect(page.locator('button[type="submit"]')).toBeVisible();
    });

    test('should show error when token is missing', async ({ page }) => {
      // Navigate without token
      await page.goto('/reset-password');

      // Should show error message
      await expect(page.locator('text=/token.*missing|invalid.*link/i')).toBeVisible();

      // Form should not be visible
      await expect(page.locator('button[type="submit"]')).not.toBeVisible();
    });

    test('should show password strength meter', async ({ page }) => {
      const passwordInput = page.locator('input[type="password"]').first();

      // Fill password
      await passwordInput.fill('NewPassword123!');

      // Password strength meter should be visible
      await expect(page.locator('[data-testid="password-strength-meter"]')).toBeVisible();
    });

    test('should show validation errors for empty form', async ({ page }) => {
      // Click submit without filling form
      await page.click('button[type="submit"]');

      // Check for validation errors
      await expect(page.locator('text=Password is required')).toBeVisible();
    });

    test('should show error when passwords do not match', async ({ page }) => {
      const passwordInput = page.locator('input[type="password"]').first();
      const confirmPasswordInput = page.locator('input[type="password"]').last();

      await passwordInput.fill('NewPassword123!');
      await confirmPasswordInput.fill('DifferentPassword123!');

      // Blur to trigger validation
      await page.click('h1'); // Click outside

      // Should show mismatch error
      await expect(page.locator('text=Passwords must match')).toBeVisible();
    });

    test('should show error for weak password', async ({ page }) => {
      const passwordInput = page.locator('input[type="password"]').first();
      const confirmPasswordInput = page.locator('input[type="password"]').last();

      // Enter weak password
      await passwordInput.fill('weak');
      await confirmPasswordInput.fill('weak');

      // Submit form
      await page.click('button[type="submit"]');

      // Should show weak password error
      await expect(page.locator('text=/weak|strong|requirements/i')).toBeVisible();
    });

    test('should successfully submit password reset with valid data', async ({ page }) => {
      const passwordInput = page.locator('input[type="password"]').first();
      const confirmPasswordInput = page.locator('input[type="password"]').last();

      // Fill strong password
      await passwordInput.fill('NewSecurePassword123!');
      await confirmPasswordInput.fill('NewSecurePassword123!');

      // Submit form
      await page.click('button[type="submit"]');

      // Should show loading state
      await expect(page.locator('button[type="submit"]:disabled')).toBeVisible();
    });

    test('should show error for invalid/expired token', async ({ page }) => {
      await page.goto('/reset-password?token=invalid-or-expired-token');

      const passwordInput = page.locator('input[type="password"]').first();
      const confirmPasswordInput = page.locator('input[type="password"]').last();

      // Fill valid password
      await passwordInput.fill('NewPassword123!');
      await confirmPasswordInput.fill('NewPassword123!');

      // Submit form
      await page.click('button[type="submit"]');

      // Should show invalid/expired token error
      await expect(page.locator('text=/invalid.*token|expired.*token|link.*expired/i')).toBeVisible({
        timeout: 5000,
      });
    });

    test('should toggle password visibility', async ({ page }) => {
      const passwordToggles = page.locator('[data-testid="password-toggle"]');

      // Click first password toggle
      await passwordToggles.first().click();

      // Password field should be text type
      await expect(page.locator('input[name="newPassword"][type="text"]')).toBeVisible();

      // Click second password toggle
      await passwordToggles.last().click();

      // Confirm password field should be text type
      await expect(page.locator('input[name="passwordConfirmation"][type="text"]')).toBeVisible();
    });
  });
});
