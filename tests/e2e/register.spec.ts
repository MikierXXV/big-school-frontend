/**
 * ============================================
 * E2E TEST: Registration Flow
 * ============================================
 *
 * Tests user registration, validation errors, password strength.
 */

import { test, expect } from '@playwright/test';

test.describe('Registration Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/register');
  });

  test('should display registration form with all fields', async ({ page }) => {
    // Check page title
    await expect(page.locator('h1')).toContainText('Create your account');

    // Check all form fields exist
    await expect(page.locator('input[name="firstName"]')).toBeVisible();
    await expect(page.locator('input[name="lastName"]')).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]').first()).toBeVisible();
    await expect(page.locator('input[type="password"]').last()).toBeVisible();
    await expect(page.locator('input[type="checkbox"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('should show validation errors for empty form', async ({ page }) => {
    // Click submit without filling form
    await page.click('button[type="submit"]');

    // Check for validation errors
    await expect(page.locator('text=First name is required')).toBeVisible();
    await expect(page.locator('text=Last name is required')).toBeVisible();
    await expect(page.locator('text=Email is required')).toBeVisible();
    await expect(page.locator('text=Password is required')).toBeVisible();
  });

  test('should show password strength meter', async ({ page }) => {
    const passwordInput = page.locator('input[type="password"]').first();

    // Fill password
    await passwordInput.fill('weak');

    // Password strength meter should be visible
    await expect(page.locator('[data-testid="password-strength-meter"]')).toBeVisible();
  });

  test('should update password strength as user types', async ({ page }) => {
    const passwordInput = page.locator('input[type="password"]').first();

    // Weak password
    await passwordInput.fill('abc');
    await expect(page.locator('text=/Very weak|Weak/i')).toBeVisible();

    // Medium password
    await passwordInput.fill('Password1');
    await page.waitForTimeout(300);
    await expect(page.locator('text=/Medium|Fair/i')).toBeVisible();

    // Strong password
    await passwordInput.fill('Password123!');
    await page.waitForTimeout(300);
    await expect(page.locator('text=/Strong|Very strong/i')).toBeVisible();
  });

  test('should show error when passwords do not match', async ({ page }) => {
    const passwordInput = page.locator('input[type="password"]').first();
    const confirmPasswordInput = page.locator('input[type="password"]').last();

    await passwordInput.fill('Password123!');
    await confirmPasswordInput.fill('DifferentPassword123!');

    // Blur confirm password to trigger validation
    await page.locator('input[name="firstName"]').click();

    // Should show mismatch error
    await expect(page.locator('text=Passwords must match')).toBeVisible();
  });

  test('should show error when terms are not accepted', async ({ page }) => {
    // Fill all fields except terms checkbox
    await page.fill('input[name="firstName"]', 'John');
    await page.fill('input[name="lastName"]', 'Doe');
    await page.fill('input[type="email"]', 'john.doe@example.com');
    await page.fill('input[type="password"]').first().fill('Password123!');
    await page.fill('input[type="password"]').last().fill('Password123!');

    // Submit without checking terms
    await page.click('button[type="submit"]');

    // Should show terms error
    await expect(page.locator('text=/must accept|terms/i')).toBeVisible();
  });

  test('should successfully submit registration with valid data', async ({ page }) => {
    // Fill all fields
    await page.fill('input[name="firstName"]', 'Jane');
    await page.fill('input[name="lastName"]', 'Smith');
    await page.fill('input[type="email"]', 'jane.smith@example.com');

    const passwordInput = page.locator('input[type="password"]').first();
    const confirmPasswordInput = page.locator('input[type="password"]').last();

    await passwordInput.fill('SecurePassword123!');
    await confirmPasswordInput.fill('SecurePassword123!');

    // Accept terms
    await page.check('input[type="checkbox"]');

    // Submit form
    await page.click('button[type="submit"]');

    // Should show loading state
    await expect(page.locator('button[type="submit"]:disabled')).toBeVisible();
  });

  test('should show error for already registered email', async ({ page }) => {
    // Fill form with existing email
    await page.fill('input[name="firstName"]', 'Existing');
    await page.fill('input[name="lastName"]', 'User');
    await page.fill('input[type="email"]', 'existing@example.com');
    await page.fill('input[type="password"]').first().fill('Password123!');
    await page.fill('input[type="password"]').last().fill('Password123!');
    await page.check('input[type="checkbox"]');

    // Submit form
    await page.click('button[type="submit"]');

    // Wait for error message
    await expect(page.locator('text=/already exists|already registered/i')).toBeVisible({
      timeout: 5000,
    });
  });

  test('should toggle password visibility for both password fields', async ({ page }) => {
    const passwordToggles = page.locator('[data-testid="password-toggle"]');

    // Click first password toggle
    await passwordToggles.first().click();

    // First password field should be text type
    await expect(page.locator('input[name="password"][type="text"]')).toBeVisible();

    // Click second password toggle
    await passwordToggles.last().click();

    // Second password field should be text type
    await expect(page.locator('input[name="passwordConfirmation"][type="text"]')).toBeVisible();
  });

  test('should have link to login page', async ({ page }) => {
    const loginLink = page.locator('a[href="/login"]');

    await expect(loginLink).toBeVisible();
    await expect(loginLink).toContainText(/Sign in|Log in/i);

    // Click link
    await loginLink.click();

    // Should navigate to login page
    await expect(page).toHaveURL('/login');
  });

  test('should validate email format in real-time', async ({ page }) => {
    const emailInput = page.locator('input[type="email"]');

    // Enter invalid email
    await emailInput.fill('invalid-email');

    // Blur to trigger validation
    await page.locator('input[name="firstName"]').click();

    // Should show validation error
    await expect(page.locator('text=Invalid email format')).toBeVisible();

    // Fix email
    await emailInput.fill('valid@example.com');
    await page.locator('input[name="firstName"]').click();

    // Error should disappear
    await expect(page.locator('text=Invalid email format')).not.toBeVisible();
  });
});
