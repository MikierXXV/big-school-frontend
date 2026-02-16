/**
 * ============================================
 * TEST: Auth Navigation Guard
 * ============================================
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import type { RouteLocationNormalized, NavigationGuardNext } from 'vue-router';
import { authGuard } from '@presentation/router/guards/auth.guard.js';
import { useAuthStore } from '@presentation/stores/auth.store.js';

const createMockRoute = (
  path: string,
  meta: Record<string, unknown> = {}
): RouteLocationNormalized => {
  return {
    path,
    fullPath: path,
    name: path.slice(1) || 'home',
    params: {},
    query: {},
    hash: '',
    matched: [],
    redirectedFrom: undefined,
    meta,
  } as RouteLocationNormalized;
};

const createMockNext = (): NavigationGuardNext => {
  return vi.fn() as unknown as NavigationGuardNext;
};

describe('authGuard', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  describe('Public Routes', () => {
    it('should allow access to public routes when not authenticated', () => {
      const authStore = useAuthStore();
      authStore.user = null;

      const to = createMockRoute('/about');
      const from = createMockRoute('/');
      const next = createMockNext();

      authGuard(to, from, next);

      expect(next).toHaveBeenCalledWith();
      expect(next).toHaveBeenCalledOnce();
    });

    it('should allow access to public routes when authenticated', () => {
      const authStore = useAuthStore();
      authStore.user = {
        id: '1',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        status: 'ACTIVE',
        fullName: 'Test User',
        emailVerified: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      authStore.accessToken = 'valid-access-token';

      const to = createMockRoute('/about');
      const from = createMockRoute('/');
      const next = createMockNext();

      authGuard(to, from, next);

      expect(next).toHaveBeenCalledWith();
      expect(next).toHaveBeenCalledOnce();
    });
  });

  describe('Protected Routes (requiresAuth)', () => {
    it('should allow access to protected routes when authenticated', () => {
      const authStore = useAuthStore();
      authStore.user = {
        id: '1',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        status: 'ACTIVE',
        fullName: 'Test User',
        emailVerified: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      authStore.accessToken = 'valid-access-token';

      const to = createMockRoute('/dashboard', { requiresAuth: true });
      const from = createMockRoute('/');
      const next = createMockNext();

      authGuard(to, from, next);

      expect(next).toHaveBeenCalledWith();
      expect(next).toHaveBeenCalledOnce();
    });

    it('should redirect to login when accessing protected route without authentication', () => {
      const authStore = useAuthStore();
      authStore.user = null;

      const to = createMockRoute('/dashboard', { requiresAuth: true });
      const from = createMockRoute('/');
      const next = createMockNext();

      authGuard(to, from, next);

      expect(next).toHaveBeenCalledWith({
        name: 'login',
        query: { redirect: '/dashboard' },
      });
      expect(next).toHaveBeenCalledOnce();
    });

    it('should include redirect query parameter when redirecting to login', () => {
      const authStore = useAuthStore();
      authStore.user = null;

      const to = createMockRoute('/protected/resource', { requiresAuth: true });
      const from = createMockRoute('/');
      const next = createMockNext();

      authGuard(to, from, next);

      expect(next).toHaveBeenCalledWith({
        name: 'login',
        query: { redirect: '/protected/resource' },
      });
    });
  });

  describe('Guest-Only Routes (requiresGuest)', () => {
    it('should allow access to guest routes when not authenticated', () => {
      const authStore = useAuthStore();
      authStore.user = null;

      const to = createMockRoute('/login', { requiresGuest: true });
      const from = createMockRoute('/');
      const next = createMockNext();

      authGuard(to, from, next);

      expect(next).toHaveBeenCalledWith();
      expect(next).toHaveBeenCalledOnce();
    });

    it('should redirect to dashboard when accessing guest routes while authenticated', () => {
      const authStore = useAuthStore();
      authStore.user = {
        id: '1',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        status: 'ACTIVE',
        fullName: 'Test User',
        emailVerified: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      authStore.accessToken = 'valid-access-token';

      const to = createMockRoute('/login', { requiresGuest: true });
      const from = createMockRoute('/');
      const next = createMockNext();

      authGuard(to, from, next);

      expect(next).toHaveBeenCalledWith({ name: 'dashboard' });
      expect(next).toHaveBeenCalledOnce();
    });

    it('should redirect authenticated users from register page', () => {
      const authStore = useAuthStore();
      authStore.user = {
        id: '1',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        status: 'ACTIVE',
        fullName: 'Test User',
        emailVerified: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      authStore.accessToken = 'valid-access-token';

      const to = createMockRoute('/register', { requiresGuest: true });
      const from = createMockRoute('/');
      const next = createMockNext();

      authGuard(to, from, next);

      expect(next).toHaveBeenCalledWith({ name: 'dashboard' });
    });
  });
});
