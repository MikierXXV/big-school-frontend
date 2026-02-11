/**
 * ============================================
 * E2E HELPER: API Mocking
 * ============================================
 *
 * Utilidades para mockear la API en tests E2E.
 *
 * TODO: Implementar helpers de API mocking
 */

import type { Page } from '@playwright/test';

export async function mockLoginSuccess(page: Page): Promise<void> {
  // TODO: Implementar mock de login exitoso
  await page.route('**/api/auth/login', (route) => {
    route.fulfill({
      status: 200,
      body: JSON.stringify({
        user: { id: '1', email: 'test@example.com' },
        tokens: { accessToken: 'mock-token', refreshToken: 'mock-refresh' },
      }),
    });
  });
}

export async function mockLoginFailure(page: Page): Promise<void> {
  // TODO: Implementar mock de login fallido
  await page.route('**/api/auth/login', (route) => {
    route.fulfill({
      status: 401,
      body: JSON.stringify({
        error: 'Invalid credentials',
      }),
    });
  });
}
