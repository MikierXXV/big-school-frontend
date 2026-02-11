/**
 * ============================================
 * UNIT TEST: useAuth Composable
 * ============================================
 *
 * Tests para el composable useAuth.
 *
 * TODO: Implementar tests completos
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useAuth } from '@presentation/composables/useAuth.js';

describe('useAuth', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('should return auth state and methods', () => {
    const { user, isAuthenticated, login, logout } = useAuth();

    expect(user).toBeDefined();
    expect(isAuthenticated).toBeDefined();
    expect(login).toBeTypeOf('function');
    expect(logout).toBeTypeOf('function');
  });

  it('should start with no authenticated user', () => {
    const { isAuthenticated } = useAuth();
    expect(isAuthenticated.value).toBe(false);
  });

  // TODO: Test login flow
  // TODO: Test logout flow
  // TODO: Test isAuthenticated computed
});
