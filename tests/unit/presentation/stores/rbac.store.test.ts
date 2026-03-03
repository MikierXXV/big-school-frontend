/**
 * ============================================
 * UNIT TEST: RBAC Store
 * ============================================
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useRbacStore } from '@presentation/stores/rbac.store.js';

// Mock the DI container - use vi.hoisted to ensure variables are available when vi.mock factory runs
const { mockGetAdminPermissions, mockGetUserOrganizations } = vi.hoisted(() => ({
  mockGetAdminPermissions: vi.fn(),
  mockGetUserOrganizations: vi.fn(),
}));

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
      getAdminPermissionsUseCase: { execute: mockGetAdminPermissions },
      getUserOrganizationsUseCase: { execute: mockGetUserOrganizations },
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

describe('RBAC Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  describe('initial state', () => {
    it('should start with empty permissions and organizations', () => {
      const store = useRbacStore();

      expect(store.permissions).toEqual([]);
      expect(store.userOrganizations).toEqual([]);
      expect(store.isLoading).toBe(false);
      expect(store.organizationCount).toBe(0);
    });
  });

  describe('hasPermission', () => {
    it('should return true when permission exists', () => {
      const store = useRbacStore();
      store.$patch({ permissions: ['manage_users', 'manage_organizations'] });

      expect(store.hasPermission('manage_users')).toBe(true);
    });

    it('should return false when permission does not exist', () => {
      const store = useRbacStore();
      store.$patch({ permissions: ['manage_users'] });

      expect(store.hasPermission('manage_organizations')).toBe(false);
    });
  });

  describe('isMemberOf', () => {
    it('should return true when user is active member of organization', () => {
      const store = useRbacStore();
      store.$patch({
        userOrganizations: [
          { organizationId: 'org-1', organizationName: 'Hospital', organizationType: 'hospital', role: 'doctor', joinedAt: '', isActive: true },
        ],
      });

      expect(store.isMemberOf('org-1')).toBe(true);
    });

    it('should return false for non-member', () => {
      const store = useRbacStore();

      expect(store.isMemberOf('org-1')).toBe(false);
    });
  });

  describe('getRoleInOrg', () => {
    it('should return role when user is active member', () => {
      const store = useRbacStore();
      store.$patch({
        userOrganizations: [
          { organizationId: 'org-1', organizationName: 'Hospital', organizationType: 'hospital', role: 'doctor', joinedAt: '', isActive: true },
        ],
      });

      expect(store.getRoleInOrg('org-1')).toBe('doctor');
    });

    it('should return null for non-member', () => {
      const store = useRbacStore();

      expect(store.getRoleInOrg('org-1')).toBeNull();
    });
  });

  describe('isOrgAdmin', () => {
    it('should return true when user is org_admin', () => {
      const store = useRbacStore();
      store.$patch({
        userOrganizations: [
          { organizationId: 'org-1', organizationName: 'Hospital', organizationType: 'hospital', role: 'org_admin', joinedAt: '', isActive: true },
        ],
      });

      expect(store.isOrgAdmin('org-1')).toBe(true);
    });

    it('should return false when user has different role', () => {
      const store = useRbacStore();
      store.$patch({
        userOrganizations: [
          { organizationId: 'org-1', organizationName: 'Hospital', organizationType: 'hospital', role: 'doctor', joinedAt: '', isActive: true },
        ],
      });

      expect(store.isOrgAdmin('org-1')).toBe(false);
    });
  });

  describe('fetchPermissions', () => {
    it('should fetch and store permissions', async () => {
      mockGetAdminPermissions.mockResolvedValue({
        userId: 'admin-1',
        permissions: [
          { permission: 'manage_users', grantedBy: 'super-1', grantedAt: '' },
          { permission: 'manage_organizations', grantedBy: 'super-1', grantedAt: '' },
        ],
      });
      const store = useRbacStore();

      await store.fetchPermissions('admin-1');

      expect(store.permissions).toEqual(['manage_users', 'manage_organizations']);
      expect(store.isLoading).toBe(false);
    });

    it('should clear permissions on error', async () => {
      mockGetAdminPermissions.mockRejectedValue(new Error('Forbidden'));
      const store = useRbacStore();
      store.$patch({ permissions: ['manage_users'] });

      await store.fetchPermissions('admin-1');

      expect(store.permissions).toEqual([]);
    });
  });

  describe('fetchUserOrganizations', () => {
    it('should fetch and store user organizations', async () => {
      const orgs = [
        { organizationId: 'org-1', organizationName: 'Hospital', organizationType: 'hospital', role: 'doctor', joinedAt: '', isActive: true },
      ];
      mockGetUserOrganizations.mockResolvedValue(orgs);
      const store = useRbacStore();

      await store.fetchUserOrganizations('user-1');

      expect(store.userOrganizations).toEqual(orgs);
      expect(store.organizationCount).toBe(1);
    });

    it('should clear organizations on error', async () => {
      mockGetUserOrganizations.mockRejectedValue(new Error('Forbidden'));
      const store = useRbacStore();

      await store.fetchUserOrganizations('user-1');

      expect(store.userOrganizations).toEqual([]);
    });
  });

  describe('clear', () => {
    it('should reset all state', () => {
      const store = useRbacStore();
      store.$patch({
        permissions: ['manage_users'],
        userOrganizations: [
          { organizationId: 'org-1', organizationName: 'Hospital', organizationType: 'hospital', role: 'doctor', joinedAt: '', isActive: true },
        ],
      });

      store.clear();

      expect(store.permissions).toEqual([]);
      expect(store.userOrganizations).toEqual([]);
    });
  });
});
