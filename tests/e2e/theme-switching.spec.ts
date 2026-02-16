/**
 * ============================================
 * E2E TEST: Theme Switching
 * ============================================
 *
 * Tests dark/light mode toggle and persistence.
 */

import { test, expect } from '@playwright/test';

test.describe('Theme Switching', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should default to light mode', async ({ page }) => {
    const html = page.locator('html');
    const classList = await html.getAttribute('class');

    // Should NOT have dark class by default
    expect(classList).not.toContain('dark');
  });

  test('should toggle to dark mode when clicking theme toggle', async ({ page }) => {
    // Open theme menu
    await page.click('[data-testid="theme-toggle-button"]');

    // Click dark mode option
    await page.click('[data-testid="theme-option-dark"]');

    // Check html has dark class
    const html = page.locator('html');
    const classList = await html.getAttribute('class');
    expect(classList).toContain('dark');
  });

  test('should toggle to light mode when clicking light option', async ({ page }) => {
    // First set to dark
    await page.click('[data-testid="theme-toggle-button"]');
    await page.click('[data-testid="theme-option-dark"]');

    // Then toggle back to light
    await page.click('[data-testid="theme-toggle-button"]');
    await page.click('[data-testid="theme-option-light"]');

    // Check html does NOT have dark class
    const html = page.locator('html');
    const classList = await html.getAttribute('class');
    expect(classList).not.toContain('dark');
  });

  test('should persist theme preference in localStorage', async ({ page }) => {
    // Set to dark mode
    await page.click('[data-testid="theme-toggle-button"]');
    await page.click('[data-testid="theme-option-dark"]');

    // Check localStorage
    const theme = await page.evaluate(() => localStorage.getItem('theme'));
    expect(theme).toBe('dark');
  });

  test('should restore theme from localStorage on page reload', async ({ page }) => {
    // Set to dark mode
    await page.click('[data-testid="theme-toggle-button"]');
    await page.click('[data-testid="theme-option-dark"]');

    // Reload page
    await page.reload();

    // Check dark mode is still applied
    const html = page.locator('html');
    const classList = await html.getAttribute('class');
    expect(classList).toContain('dark');
  });

  test('should use system preference when system option is selected', async ({ page }) => {
    // Set color scheme preference to dark BEFORE navigation
    await page.emulateMedia({ colorScheme: 'dark' });

    // Reload page to apply system preference
    await page.goto('/');

    // Click system option
    await page.click('[data-testid="theme-toggle-button"]');
    await page.click('[data-testid="theme-option-system"]');

    // Wait for DOM to react to matchMedia listener
    await page.waitForTimeout(200);

    // Should apply dark mode based on system preference
    const html = page.locator('html');
    await expect(html).toHaveClass(/dark/);
  });

  test('should update when system preference changes (system mode)', async ({ page }) => {
    // Set to system mode first
    await page.click('[data-testid="theme-toggle-button"]');
    await page.click('[data-testid="theme-option-system"]');

    // Start with light system preference
    await page.emulateMedia({ colorScheme: 'light' });
    await page.waitForTimeout(200);

    await expect(page.locator('html')).not.toHaveClass(/dark/);

    // Change system preference to dark
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.waitForTimeout(200);

    await expect(page.locator('html')).toHaveClass(/dark/);
  });
});
