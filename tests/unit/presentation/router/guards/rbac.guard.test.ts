/**
 * ============================================
 * UNIT TEST: RBAC Guard
 * ============================================
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { rbacGuard } from '@presentation/router/guards/rbac.guard.js';
import { useAuthStore } from '@presentation/stores/auth.store.js';
import { useRbacStore } from '@presentation/stores/rbac.store.js';
import type { RouteLocationNormalized, NavigationGuardNext } from 'vue-router';

// Mock the DI container
vi.mock('@infrastructure/di/container.js', () => ({
  createContainer: () => ({
    useCases: {
      loginUseCase: { execute: vi.fn() },
      registerUseCase: { execute: vi.fn() },
      logoutUseCase: { execute: vi.fn() },
      refreshSessionUseCase: { execute: vi.fn() },
      verifyEmailUseCase: { execute: vi.fn() },
      requestPasswordResetUseCase: { execute: vi.fn() },
      confirmPasswordResetUseCase: { execute: vi.fn() },
      getAdminPermissionsUseCase: { execute: vi.fn() },
      getUserOrganizationsUseCase: { execute: vi.fn() },
      createOrganizationUseCase: { execute: vi.fn() },
      listOrganizationsUseCase: { execute: vi.fn() },
      getOrganizationUseCase: { execute: vi.fn() },
      updateOrganizationUseCase: { execute: vi.fn() },
      deleteOrganizationUseCase: { execute: vi.fn() },
      assignMemberUseCase: { execute: vi.fn() },
      listMembersUseCase: { execute: vi.fn() },
      changeMemberRoleUseCase: { execute: vi.fn() },
      removeMemberUseCase: { execute: vi.fn() },
      promoteAdminUseCase: { execute: vi.fn() },
      demoteAdminUseCase: { execute: vi.fn() },
      listAdminsUseCase: { execute: vi.fn() },
      grantPermissionsUseCase: { execute: vi.fn() },
      revokePermissionUseCase: { execute: vi.fn() },
      listUsersUseCase: { execute: vi.fn() },
    },
  }),
}));

function createRoute(meta: Record<string, any> = {}): RouteLocationNormalized {
  return {
    path: '/test',
    fullPath: '/test',
    name: 'test',
    hash: '',
    query: {},
    params: {},
    matched: [],
    redirectedFrom: undefined,
    meta,
  };
}

describe('rbacGuard', () => {
  let next: NavigationGuardNext;
  const from = createRoute();

  beforeEach(() => {
    setActivePinia(createPinia());
    next = vi.fn();
  });

  it('should pass through when no RBAC requirements', () => {
    const to = createRoute({});

    rbacGuard(to, from, next);

    expect(next).toHaveBeenCalledWith();
  });

  it('should redirect to login when not authenticated and role required', () => {
    const to = createRoute({ requiresRole: ['admin'] });

    rbacGuard(to, from, next);

    expect(next).toHaveBeenCalledWith({ name: 'login', query: { redirect: '/test' } });
  });

  it('should redirect to forbidden when user lacks required role', () => {
    const authStore = useAuthStore();
    authStore.$patch({
      user: { id: '1', email: 'test@test.com', firstName: 'Test', lastName: 'User', fullName: 'Test User', status: 'active', systemRole: 'user', emailVerified: true },
      accessToken: 'token',
    });
    const to = createRoute({ requiresRole: ['admin', 'super_admin'] });

    rbacGuard(to, from, next);

    expect(next).toHaveBeenCalledWith({ name: 'forbidden' });
  });

  it('should pass when user has required role', () => {
    const authStore = useAuthStore();
    authStore.$patch({
      user: { id: '1', email: 'test@test.com', firstName: 'Admin', lastName: 'User', fullName: 'Admin User', status: 'active', systemRole: 'admin', emailVerified: true },
      accessToken: 'token',
    });
    const to = createRoute({ requiresRole: ['admin', 'super_admin'] });

    rbacGuard(to, from, next);

    expect(next).toHaveBeenCalledWith();
  });

  it('should bypass permission check for super_admin', () => {
    const authStore = useAuthStore();
    authStore.$patch({
      user: { id: '1', email: 'test@test.com', firstName: 'Super', lastName: 'Admin', fullName: 'Super Admin', status: 'active', systemRole: 'super_admin', emailVerified: true },
      accessToken: 'token',
    });
    const to = createRoute({ requiresRole: ['super_admin', 'admin'], requiresPermission: 'manage_organizations' });

    rbacGuard(to, from, next);

    expect(next).toHaveBeenCalledWith();
  });

  it('should redirect to forbidden when admin lacks required permission', () => {
    const authStore = useAuthStore();
    authStore.$patch({
      user: { id: '1', email: 'test@test.com', firstName: 'Admin', lastName: 'User', fullName: 'Admin User', status: 'active', systemRole: 'admin', emailVerified: true },
      accessToken: 'token',
    });
    const to = createRoute({ requiresRole: ['admin', 'super_admin'], requiresPermission: 'manage_organizations' });

    rbacGuard(to, from, next);

    expect(next).toHaveBeenCalledWith({ name: 'forbidden' });
  });

  it('should pass when admin has required permission', () => {
    const authStore = useAuthStore();
    const rbacStore = useRbacStore();
    authStore.$patch({
      user: { id: '1', email: 'test@test.com', firstName: 'Admin', lastName: 'User', fullName: 'Admin User', status: 'active', systemRole: 'admin', emailVerified: true },
      accessToken: 'token',
    });
    rbacStore.$patch({ permissions: ['manage_organizations', 'manage_users'] });
    const to = createRoute({ requiresRole: ['admin', 'super_admin'], requiresPermission: 'manage_organizations' });

    rbacGuard(to, from, next);

    expect(next).toHaveBeenCalledWith();
  });
});
