/**
 * ============================================
 * E2E HELPER: Test Data
 * ============================================
 *
 * Datos de prueba para tests E2E.
 */

export const TEST_USERS = {
  VALID: {
    email: 'test@example.com',
    password: 'TestPassword123!',
    firstName: 'Test',
    lastName: 'User',
  },
  INVALID: {
    email: 'invalid@example.com',
    password: 'wrongpassword',
  },
} as const;

export const TEST_ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
} as const;
