/**
 * ============================================
 * UNIT TEST: useRBAC Composable
 * ============================================
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useRBAC } from '@presentation/composables/useRBAC.js';
import { useAuthStore } from '@presentation/stores/auth.store.js';
import { useRbacStore } from '@presentation/stores/rbac.store.js';

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

describe('useRBAC', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  describe('canAccess', () => {
    it('should return false when user is not authenticated', () => {
      const { canAccess } = useRBAC();

      expect(canAccess(['admin'])).toBe(false);
    });

    it('should return true when user has required role', () => {
      const authStore = useAuthStore();
      authStore.$patch({
        user: { id: '1', email: 'a@b.com', firstName: 'A', lastName: 'B', fullName: 'A B', status: 'active', systemRole: 'admin', emailVerified: true },
        accessToken: 'token',
      });
      const { canAccess } = useRBAC();

      expect(canAccess(['admin', 'super_admin'])).toBe(true);
    });

    it('should return false when user lacks required role', () => {
      const authStore = useAuthStore();
      authStore.$patch({
        user: { id: '1', email: 'a@b.com', firstName: 'A', lastName: 'B', fullName: 'A B', status: 'active', systemRole: 'user', emailVerified: true },
        accessToken: 'token',
      });
      const { canAccess } = useRBAC();

      expect(canAccess(['admin'])).toBe(false);
    });

    it('should bypass permission check for super_admin', () => {
      const authStore = useAuthStore();
      authStore.$patch({
        user: { id: '1', email: 'a@b.com', firstName: 'A', lastName: 'B', fullName: 'A B', status: 'active', systemRole: 'super_admin', emailVerified: true },
        accessToken: 'token',
      });
      const { canAccess } = useRBAC();

      expect(canAccess(undefined, 'manage_organizations')).toBe(true);
    });

    it('should check permission for non-super_admin', () => {
      const authStore = useAuthStore();
      const rbacStore = useRbacStore();
      authStore.$patch({
        user: { id: '1', email: 'a@b.com', firstName: 'A', lastName: 'B', fullName: 'A B', status: 'active', systemRole: 'admin', emailVerified: true },
        accessToken: 'token',
      });
      rbacStore.$patch({ permissions: ['manage_users'] });
      const { canAccess } = useRBAC();

      expect(canAccess(undefined, 'manage_users')).toBe(true);
      expect(canAccess(undefined, 'manage_organizations')).toBe(false);
    });
  });

  describe('canManageOrg', () => {
    it('should return true for super_admin', () => {
      const authStore = useAuthStore();
      authStore.$patch({
        user: { id: '1', email: 'a@b.com', firstName: 'A', lastName: 'B', fullName: 'A B', status: 'active', systemRole: 'super_admin', emailVerified: true },
        accessToken: 'token',
      });
      const { canManageOrg } = useRBAC();

      expect(canManageOrg('org-1')).toBe(true);
    });

    it('should return true for admin with manage_organizations permission', () => {
      const authStore = useAuthStore();
      const rbacStore = useRbacStore();
      authStore.$patch({
        user: { id: '1', email: 'a@b.com', firstName: 'A', lastName: 'B', fullName: 'A B', status: 'active', systemRole: 'admin', emailVerified: true },
        accessToken: 'token',
      });
      rbacStore.$patch({ permissions: ['manage_organizations'] });
      const { canManageOrg } = useRBAC();

      expect(canManageOrg('org-1')).toBe(true);
    });

    it('should return true for org_admin of that organization', () => {
      const authStore = useAuthStore();
      const rbacStore = useRbacStore();
      authStore.$patch({
        user: { id: '1', email: 'a@b.com', firstName: 'A', lastName: 'B', fullName: 'A B', status: 'active', systemRole: 'user', emailVerified: true },
        accessToken: 'token',
      });
      rbacStore.$patch({
        userOrganizations: [
          { organizationId: 'org-1', organizationName: 'Hospital', organizationType: 'hospital', role: 'org_admin', joinedAt: '', isActive: true },
        ],
      });
      const { canManageOrg } = useRBAC();

      expect(canManageOrg('org-1')).toBe(true);
    });

    it('should return false for regular member', () => {
      const authStore = useAuthStore();
      const rbacStore = useRbacStore();
      authStore.$patch({
        user: { id: '1', email: 'a@b.com', firstName: 'A', lastName: 'B', fullName: 'A B', status: 'active', systemRole: 'user', emailVerified: true },
        accessToken: 'token',
      });
      rbacStore.$patch({
        userOrganizations: [
          { organizationId: 'org-1', organizationName: 'Hospital', organizationType: 'hospital', role: 'doctor', joinedAt: '', isActive: true },
        ],
      });
      const { canManageOrg } = useRBAC();

      expect(canManageOrg('org-1')).toBe(false);
    });
  });

  describe('hasPermission', () => {
    it('should return true for super_admin regardless of permissions', () => {
      const authStore = useAuthStore();
      authStore.$patch({
        user: { id: '1', email: 'a@b.com', firstName: 'A', lastName: 'B', fullName: 'A B', status: 'active', systemRole: 'super_admin', emailVerified: true },
        accessToken: 'token',
      });
      const rbac = useRBAC();

      expect(rbac.hasPermission('manage_users')).toBe(true);
    });
  });
});
