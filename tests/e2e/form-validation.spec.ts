/**
 * ============================================
 * E2E TEST: Form Validation
 * ============================================
 *
 * Tests real-time form validation across all forms.
 */

import { test, expect } from '@playwright/test';

test.describe('Form Validation', () => {
  test.describe('Login Form Validation', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/login');
    });

    test('should show required field errors on blur', async ({ page }) => {
      const emailInput = page.locator('input[type="email"]');
      const passwordInput = page.locator('input[type="password"]');

      // Focus and blur email without entering value
      await emailInput.focus();
      await emailInput.blur();

      // Should show required error
      await expect(page.locator('text=Email is required')).toBeVisible();

      // Focus and blur password without entering value
      await passwordInput.focus();
      await passwordInput.blur();

      // Should show required error
      await expect(page.locator('text=Password is required')).toBeVisible();
    });

    test('should validate email format in real-time', async ({ page }) => {
      const emailInput = page.locator('input[type="email"]');

      // Enter invalid email
      await emailInput.fill('invalid');
      await emailInput.blur();

      // Should show format error
      await expect(page.locator('text=Invalid email format')).toBeVisible();

      // Fix email
      await emailInput.fill('valid@example.com');
      await emailInput.blur();

      // Error should disappear
      await expect(page.locator('text=Invalid email format')).not.toBeVisible();
    });

    test('should clear errors when field becomes valid', async ({ page }) => {
      const emailInput = page.locator('input[type="email"]');

      // Trigger required error
      await emailInput.focus();
      await emailInput.blur();
      await expect(page.locator('text=Email is required')).toBeVisible();

      // Fill valid email
      await emailInput.fill('test@example.com');
      await emailInput.blur();

      // Error should be cleared
      await expect(page.locator('text=Email is required')).not.toBeVisible();
    });
  });

  test.describe('Register Form Validation', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/register');
    });

    test('should validate all required fields', async ({ page }) => {
      // Wait for form to be interactive
      await page.waitForSelector('button[type="submit"]:not([disabled])', {
        state: 'visible',
        timeout: 10000
      });

      // Submit empty form
      await page.click('button[type="submit"]');

      // Should show all required errors with explicit timeout
      await expect(page.locator('text=First name is required')).toBeVisible({ timeout: 5000 });
      await expect(page.locator('text=Last name is required')).toBeVisible();
      await expect(page.locator('text=Email is required')).toBeVisible();
      await expect(page.locator('text=Password is required')).toBeVisible();
    });

    test('should validate minimum length for names', async ({ page }) => {
      const firstNameInput = page.locator('input[name="firstName"]');
      const lastNameInput = page.locator('input[name="lastName"]');

      // Enter single character
      await firstNameInput.fill('A');
      await firstNameInput.blur();

      // Should show minimum length error
      await expect(page.locator('text=/at least.*characters|too short/i')).toBeVisible();

      // Fix with valid name
      await firstNameInput.fill('John');
      await firstNameInput.blur();

      // Error should clear
      await expect(page.locator('text=/at least.*characters|too short/i')).not.toBeVisible();
    });

    test('should validate password confirmation match', async ({ page }) => {
      const passwordInput = page.locator('input[type="password"]').first();
      const confirmPasswordInput = page.locator('input[type="password"]').last();

      // Wait for fields to be visible
      await passwordInput.waitFor({ state: 'visible' });
      await confirmPasswordInput.waitFor({ state: 'visible' });

      // Enter mismatched passwords
      await passwordInput.fill('Password123!');
      await confirmPasswordInput.fill('DifferentPassword123!');
      await confirmPasswordInput.blur();

      // Wait for validation to trigger (debounce)
      await page.waitForTimeout(500);

      // Should show mismatch error
      await expect(page.locator('text=Passwords must match')).toBeVisible({ timeout: 3000 });

      // Fix confirmation
      await confirmPasswordInput.fill('Password123!');
      await confirmPasswordInput.blur();

      // Error should clear
      await expect(page.locator('text=Passwords must match')).not.toBeVisible();
    });

    test('should show password strength feedback', async ({ page }) => {
      const passwordInput = page.locator('input[type="password"]').first();

      // Very weak password
      await passwordInput.fill('abc');
      await page.locator('text=/very weak|weak/i').waitFor({
        state: 'visible',
        timeout: 2000
      });

      // Medium password
      await passwordInput.fill('Password1');
      await page.locator('text=/medium|fair/i').waitFor({
        state: 'visible',
        timeout: 2000
      });

      // Strong password
      await passwordInput.fill('StrongPassword123!');
      await page.locator('text=/strong|very strong/i').waitFor({
        state: 'visible',
        timeout: 2000
      });
    });

    test('should validate terms acceptance', async ({ page }) => {
      const termsCheckbox = page.locator('input[type="checkbox"]');

      // Submit without checking terms
      await page.click('button[type="submit"]');

      // Should show terms error - use specific selector to avoid ambiguity
      await expect(
        page.locator('[role="alert"], .error-message, .text-error-600, .text-red-500').filter({ hasText: /must accept.*terms/i })
      ).toBeVisible();

      // Check terms
      await termsCheckbox.check();

      // Error should clear (if form is resubmitted or validated)
      await page.click('button[type="submit"]');
      await page.waitForTimeout(100);

      // Terms error should not be shown anymore (other required fields will show)
      const termsErrors = await page.locator('[role="alert"]').filter({ hasText: /must accept.*terms/i }).count();
      expect(termsErrors).toBe(0);
    });

    test('should update validation state reactively', async ({ page }) => {
      const passwordInput = page.locator('input[type="password"]').first();
      const confirmPasswordInput = page.locator('input[type="password"]').last();

      // Set initial password
      await passwordInput.fill('Password123!');
      await confirmPasswordInput.fill('Password123!');

      // Passwords match - no error
      await confirmPasswordInput.blur();
      await expect(page.locator('text=Passwords must match')).not.toBeVisible();

      // Change password (now they don't match)
      await passwordInput.fill('NewPassword123!');
      await passwordInput.blur();

      // Should show mismatch error now
      await expect(page.locator('text=Passwords must match')).toBeVisible();
    });
  });

  test.describe('Forgot Password Form Validation', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/forgot-password');
    });

    test('should validate email required', async ({ page }) => {
      const emailInput = page.locator('input[type="email"]');

      // Focus and blur without value
      await emailInput.focus();
      await emailInput.blur();

      // Should show required error
      await expect(page.locator('text=Email is required')).toBeVisible();
    });

    test('should validate email format', async ({ page }) => {
      const emailInput = page.locator('input[type="email"]');

      // Enter invalid email
      await emailInput.fill('not-an-email');
      await emailInput.blur();

      // Should show format error
      await expect(page.locator('text=Invalid email format')).toBeVisible();

      // Fix email
      await emailInput.fill('valid@example.com');
      await emailInput.blur();

      // Error should clear
      await expect(page.locator('text=Invalid email format')).not.toBeVisible();
    });
  });

  test.describe('Reset Password Form Validation', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/reset-password?token=test-token');
    });

    test('should validate password required', async ({ page }) => {
      const passwordInput = page.locator('input[type="password"]').first();

      // Focus and blur without value
      await passwordInput.focus();
      await passwordInput.blur();

      // Should show required error
      await expect(page.locator('text=Password is required')).toBeVisible();
    });

    test('should validate password strength requirements', async ({ page }) => {
      const passwordInput = page.locator('input[type="password"]').first();

      // Enter weak password
      await passwordInput.fill('weak');
      await passwordInput.blur();

      // Should show strength error or warning
      await expect(page.locator('text=/weak|requirements|strength/i')).toBeVisible();

      // Enter strong password
      await passwordInput.fill('StrongPassword123!');
      await passwordInput.blur();

      // Should show strong indicator
      await expect(page.locator('text=/strong/i')).toBeVisible();
    });

    test('should validate confirmation match', async ({ page }) => {
      const passwordInput = page.locator('input[type="password"]').first();
      const confirmPasswordInput = page.locator('input[type="password"]').last();

      // Set mismatched passwords
      await passwordInput.fill('Password123!');
      await confirmPasswordInput.fill('Different123!');
      await confirmPasswordInput.blur();

      // Should show mismatch error
      await expect(page.locator('text=Passwords must match')).toBeVisible();

      // Fix match
      await confirmPasswordInput.fill('Password123!');
      await confirmPasswordInput.blur();

      // Error should clear
      await expect(page.locator('text=Passwords must match')).not.toBeVisible();
    });
  });

  test.describe('General Validation Behavior', () => {
    test('should not show errors on untouched fields', async ({ page }) => {
      await page.goto('/register');

      // Initially, no errors should be visible
      await expect(page.locator('.text-red-500, .text-error-600')).not.toBeVisible();
    });

    test('should show errors only after field interaction', async ({ page }) => {
      await page.goto('/login');

      const emailInput = page.locator('input[type="email"]');

      // No error initially
      await expect(page.locator('text=Email is required')).not.toBeVisible();

      // Interact with field
      await emailInput.focus();
      await emailInput.blur();

      // Now error should show
      await expect(page.locator('text=Email is required')).toBeVisible();
    });

    test('should re-validate on field change', async ({ page }) => {
      await page.goto('/login');

      const emailInput = page.locator('input[type="email"]');

      // Trigger error
      await emailInput.fill('invalid');
      await emailInput.blur();
      await expect(page.locator('text=Invalid email format')).toBeVisible();

      // Fix error
      await emailInput.fill('valid@example.com');
      await page.waitForTimeout(300);

      // Error should clear automatically
      await expect(page.locator('text=Invalid email format')).not.toBeVisible();
    });

    test('should prevent form submission with validation errors', async ({ page }) => {
      await page.goto('/login');

      // Submit with invalid data
      await page.fill('input[type="email"]', 'invalid-email');
      await page.fill('input[type="password"]', 'pw');

      await page.click('button[type="submit"]');

      // Form should not submit (validation errors present)
      // Should still be on login page (ignore query params)
      await expect(page).toHaveURL(/\/login(\?.*)?$/);
      await expect(page.locator('text=Invalid email format')).toBeVisible();
    });
  });
});
