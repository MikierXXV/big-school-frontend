/**
 * ============================================
 * E2E TEST: Login Flow
 * ============================================
 *
 * Tests user login, invalid credentials, remember me.
 */

import { test, expect } from '@playwright/test';

test.describe('Login Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('should display login form', async ({ page }) => {
    // Check page title
    await expect(page.locator('h1')).toContainText('Sign in to your account');

    // Check form fields exist
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('should show validation errors for empty form', async ({ page }) => {
    // Click submit without filling form
    await page.click('button[type="submit"]');

    // Check for validation errors
    await expect(page.locator('text=Email is required')).toBeVisible();
    await expect(page.locator('text=Password is required')).toBeVisible();
  });

  test('should show validation error for invalid email', async ({ page }) => {
    // Enter invalid email
    await page.fill('input[type="email"]', 'invalid-email');
    await page.fill('input[type="password"]', 'SomePassword123!');

    // Blur email field to trigger validation
    await page.locator('input[type="password"]').click();

    // Check for email validation error
    await expect(page.locator('text=Invalid email format')).toBeVisible();
  });

  test('should show error message for invalid credentials', async ({ page }) => {
    // Fill form with invalid credentials
    await page.fill('input[type="email"]', 'wrong@example.com');
    await page.fill('input[type="password"]', 'WrongPassword123!');

    // Submit form
    await page.click('button[type="submit"]');

    // Wait for error message
    await expect(page.locator('text=/Invalid credentials|Invalid email or password/i')).toBeVisible({
      timeout: 5000,
    });
  });

  test('should successfully login with valid credentials', async ({ page }) => {
    // Note: This test requires a test user in the backend
    // For now, we'll test the UI behavior (submission)

    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'Password123!');

    // Submit form
    await page.click('button[type="submit"]');

    // Should show loading state
    await expect(page.locator('button[type="submit"]:disabled')).toBeVisible();
  });

  test('should toggle password visibility', async ({ page }) => {
    const passwordInput = page.locator('input[type="password"]');
    const toggleButton = page.locator('[data-testid="password-toggle"]');

    // Initially password type
    await expect(passwordInput).toHaveAttribute('type', 'password');

    // Click toggle
    await toggleButton.click();

    // Should change to text type
    await expect(page.locator('input[type="text"]').first()).toBeVisible();

    // Click toggle again
    await toggleButton.click();

    // Should change back to password
    await expect(passwordInput).toHaveAttribute('type', 'password');
  });

  test('should have remember me checkbox', async ({ page }) => {
    const rememberMeCheckbox = page.locator('input[type="checkbox"]');

    await expect(rememberMeCheckbox).toBeVisible();
    await expect(page.locator('text=Remember me')).toBeVisible();

    // Should be unchecked by default
    await expect(rememberMeCheckbox).not.toBeChecked();

    // Can be checked
    await rememberMeCheckbox.check();
    await expect(rememberMeCheckbox).toBeChecked();
  });

  test('should have forgot password link', async ({ page }) => {
    const forgotPasswordLink = page.locator('a[href="/forgot-password"]');

    await expect(forgotPasswordLink).toBeVisible();
    await expect(forgotPasswordLink).toContainText('Forgot password');
  });

  test('should navigate to register page', async ({ page }) => {
    const registerLink = page.locator('a[href="/register"]');

    await expect(registerLink).toBeVisible();
    await expect(registerLink).toContainText(/Sign up|Create account/i);

    // Click link
    await registerLink.click();

    // Should navigate to register page
    await expect(page).toHaveURL('/register');
  });

  test('should disable submit button while loading', async ({ page }) => {
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'Password123!');

    // Submit form
    await page.click('button[type="submit"]');

    // Button should be disabled immediately
    const submitButton = page.locator('button[type="submit"]');
    await expect(submitButton).toBeDisabled();
  });
});
