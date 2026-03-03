/**
 * ============================================
 * UNIT TEST: Admin Store
 * ============================================
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useAdminStore } from '@presentation/stores/admin.store.js';

const {
  mockListAdmins,
  mockListUsers,
  mockPromoteAdmin,
  mockDemoteAdmin,
  mockGetAdminPermissions,
  mockGrantPermissions,
  mockRevokePermission,
} = vi.hoisted(() => ({
  mockListAdmins: vi.fn(),
  mockListUsers: vi.fn(),
  mockPromoteAdmin: vi.fn(),
  mockDemoteAdmin: vi.fn(),
  mockGetAdminPermissions: vi.fn(),
  mockGrantPermissions: vi.fn(),
  mockRevokePermission: vi.fn(),
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
      promoteAdminUseCase: { execute: mockPromoteAdmin },
      demoteAdminUseCase: { execute: mockDemoteAdmin },
      listAdminsUseCase: { execute: mockListAdmins },
      grantPermissionsUseCase: { execute: mockGrantPermissions },
      revokePermissionUseCase: { execute: mockRevokePermission },
      listUsersUseCase: { execute: mockListUsers },
    },
  }),
}));

const mockAdmin = {
  userId: 'admin-1',
  email: 'admin@test.com',
  fullName: 'Admin User',
  systemRole: 'admin',
  promotedAt: '2024-01-01',
  promotedBy: 'super-1',
};

const mockAdmin2 = {
  userId: 'admin-2',
  email: 'admin2@test.com',
  fullName: 'Admin Two',
  systemRole: 'admin',
  promotedAt: '2024-01-02',
  promotedBy: 'super-1',
};

const mockPermissions = {
  userId: 'admin-1',
  permissions: [
    { permission: 'manage_users', grantedBy: 'super-1', grantedAt: '2024-01-01' },
    { permission: 'manage_organizations', grantedBy: 'super-1', grantedAt: '2024-01-01' },
  ],
};

describe('Admin Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  describe('initial state', () => {
    it('should have correct initial state', () => {
      const store = useAdminStore();
      expect(store.admins).toEqual([]);
      expect(store.adminPermissions).toBeNull();
      expect(store.usersList).toBeNull();
      expect(store.isLoading).toBe(false);
      expect(store.error).toBeNull();
    });
  });

  describe('fetchAdmins', () => {
    it('should fetch and store admins', async () => {
      mockListAdmins.mockResolvedValue({ admins: [mockAdmin, mockAdmin2] });
      const store = useAdminStore();

      await store.fetchAdmins();

      expect(store.admins).toEqual([mockAdmin, mockAdmin2]);
      expect(store.isLoading).toBe(false);
    });

    it('should set error on failure', async () => {
      mockListAdmins.mockRejectedValue(new Error('Network error'));
      const store = useAdminStore();

      await store.fetchAdmins();

      expect(store.error).toBe('Network error');
    });
  });

  describe('fetchUsers', () => {
    it('should fetch and store users list', async () => {
      const mockUsers = {
        users: [{ id: 'u-1', email: 'user@test.com', fullName: 'User One', systemRole: 'user', emailVerified: true }],
        total: 1,
        page: 1,
        limit: 20,
        totalPages: 1,
        hasNext: false,
        hasPrevious: false,
      };
      mockListUsers.mockResolvedValue(mockUsers);
      const store = useAdminStore();

      await store.fetchUsers({ page: 1, limit: 20 });

      expect(store.usersList).toEqual(mockUsers);
      expect(mockListUsers).toHaveBeenCalledWith({ page: 1, limit: 20 });
    });

    it('should set error on failure', async () => {
      mockListUsers.mockRejectedValue(new Error('Forbidden'));
      const store = useAdminStore();

      await store.fetchUsers();

      expect(store.error).toBe('Forbidden');
    });
  });

  describe('promoteUser', () => {
    it('should promote user and refresh admins', async () => {
      mockPromoteAdmin.mockResolvedValue(undefined);
      mockListAdmins.mockResolvedValue({ admins: [mockAdmin] });
      const store = useAdminStore();

      await store.promoteUser('user-1');

      expect(mockPromoteAdmin).toHaveBeenCalledWith({ userId: 'user-1' });
      expect(mockListAdmins).toHaveBeenCalled();
    });

    it('should set error and rethrow on failure', async () => {
      mockPromoteAdmin.mockRejectedValue(new Error('Promote failed'));
      const store = useAdminStore();

      await expect(store.promoteUser('user-1')).rejects.toThrow('Promote failed');
      expect(store.error).toBe('Promote failed');
    });
  });

  describe('demoteUser', () => {
    it('should demote user and remove from admins list', async () => {
      mockDemoteAdmin.mockResolvedValue(undefined);
      const store = useAdminStore();
      store.$patch({ admins: [mockAdmin, mockAdmin2] });

      await store.demoteUser('admin-1');

      expect(mockDemoteAdmin).toHaveBeenCalledWith({ userId: 'admin-1' });
      expect(store.admins).toHaveLength(1);
      expect(store.admins[0].userId).toBe('admin-2');
    });

    it('should set error and rethrow on failure', async () => {
      mockDemoteAdmin.mockRejectedValue(new Error('Demote failed'));
      const store = useAdminStore();

      await expect(store.demoteUser('admin-1')).rejects.toThrow('Demote failed');
      expect(store.error).toBe('Demote failed');
    });
  });

  describe('fetchPermissions', () => {
    it('should fetch and store admin permissions', async () => {
      mockGetAdminPermissions.mockResolvedValue(mockPermissions);
      const store = useAdminStore();

      await store.fetchPermissions('admin-1');

      expect(store.adminPermissions).toEqual(mockPermissions);
      expect(mockGetAdminPermissions).toHaveBeenCalledWith('admin-1');
    });

    it('should set error on failure', async () => {
      mockGetAdminPermissions.mockRejectedValue(new Error('Not found'));
      const store = useAdminStore();

      await store.fetchPermissions('admin-1');

      expect(store.error).toBe('Not found');
    });
  });

  describe('grantPermissions', () => {
    it('should grant permissions and update state', async () => {
      const updatedPermissions = {
        ...mockPermissions,
        permissions: [...mockPermissions.permissions, { permission: 'assign_members', grantedBy: 'super-1', grantedAt: '2024-01-03' }],
      };
      mockGrantPermissions.mockResolvedValue(updatedPermissions);
      const store = useAdminStore();

      await store.grantPermissions('admin-1', ['assign_members']);

      expect(store.adminPermissions).toEqual(updatedPermissions);
      expect(mockGrantPermissions).toHaveBeenCalledWith({ userId: 'admin-1', permissions: ['assign_members'] });
    });

    it('should set error and rethrow on failure', async () => {
      mockGrantPermissions.mockRejectedValue(new Error('Grant failed'));
      const store = useAdminStore();

      await expect(store.grantPermissions('admin-1', ['manage_users'])).rejects.toThrow('Grant failed');
      expect(store.error).toBe('Grant failed');
    });
  });

  describe('revokePermission', () => {
    it('should revoke permission and update state', async () => {
      const updatedPermissions = {
        userId: 'admin-1',
        permissions: [{ permission: 'manage_organizations', grantedBy: 'super-1', grantedAt: '2024-01-01' }],
      };
      mockRevokePermission.mockResolvedValue(updatedPermissions);
      const store = useAdminStore();

      await store.revokePermission('admin-1', 'manage_users');

      expect(store.adminPermissions).toEqual(updatedPermissions);
      expect(mockRevokePermission).toHaveBeenCalledWith({ userId: 'admin-1', permission: 'manage_users' });
    });

    it('should set error and rethrow on failure', async () => {
      mockRevokePermission.mockRejectedValue(new Error('Revoke failed'));
      const store = useAdminStore();

      await expect(store.revokePermission('admin-1', 'manage_users')).rejects.toThrow('Revoke failed');
      expect(store.error).toBe('Revoke failed');
    });
  });

  describe('clearError', () => {
    it('should clear the error', () => {
      const store = useAdminStore();
      store.$patch({ error: 'Some error' });

      store.clearError();

      expect(store.error).toBeNull();
    });
  });
});
