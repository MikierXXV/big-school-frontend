/**
 * ============================================
 * E2E TEST: Admin Routes & RBAC Guards
 * ============================================
 *
 * Tests RBAC guard behavior for admin-only routes.
 */

import { test, expect } from '@playwright/test';

test.describe('Admin Routes & RBAC Guards', () => {
  test.describe('Unauthenticated Access', () => {
    test('should redirect to login when accessing /admin without auth', async ({ page }) => {
      await page.goto('/admin');
      await expect(page).toHaveURL(/\/login(\?.*)?$/);
    });

    test('should redirect to login when accessing /admin/organizations without auth', async ({ page }) => {
      await page.goto('/admin/organizations');
      await expect(page).toHaveURL(/\/login(\?.*)?$/);
    });

    test('should redirect to login when accessing /admin/organizations/:id without auth', async ({ page }) => {
      await page.goto('/admin/organizations/org-1');
      await expect(page).toHaveURL(/\/login(\?.*)?$/);
    });

    test('should redirect to login when accessing /admin/users without auth', async ({ page }) => {
      await page.goto('/admin/users');
      await expect(page).toHaveURL(/\/login(\?.*)?$/);
    });

    test('should redirect to login when accessing /admin/users/:userId/permissions without auth', async ({ page }) => {
      await page.goto('/admin/users/user-1/permissions');
      await expect(page).toHaveURL(/\/login(\?.*)?$/);
    });
  });

  test.describe('Protected RBAC Routes', () => {
    test('should redirect to login when accessing /my-organizations without auth', async ({ page }) => {
      await page.goto('/my-organizations');
      await expect(page).toHaveURL(/\/login(\?.*)?$/);
    });

    test('should redirect to login when accessing /forbidden without auth', async ({ page }) => {
      await page.goto('/forbidden');
      await expect(page).toHaveURL(/\/login(\?.*)?$/);
    });
  });
});
