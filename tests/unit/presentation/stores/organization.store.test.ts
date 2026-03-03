/**
 * ============================================
 * UNIT TEST: Organization Store
 * ============================================
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useOrganizationStore } from '@presentation/stores/organization.store.js';

const {
  mockCreateOrganization,
  mockListOrganizations,
  mockGetOrganization,
  mockUpdateOrganization,
  mockDeleteOrganization,
  mockAssignMember,
  mockListMembers,
  mockChangeMemberRole,
  mockRemoveMember,
} = vi.hoisted(() => ({
  mockCreateOrganization: vi.fn(),
  mockListOrganizations: vi.fn(),
  mockGetOrganization: vi.fn(),
  mockUpdateOrganization: vi.fn(),
  mockDeleteOrganization: vi.fn(),
  mockAssignMember: vi.fn(),
  mockListMembers: vi.fn(),
  mockChangeMemberRole: vi.fn(),
  mockRemoveMember: vi.fn(),
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
      getAdminPermissionsUseCase: { execute: vi.fn() },
      getUserOrganizationsUseCase: { execute: vi.fn() },
      createOrganizationUseCase: { execute: mockCreateOrganization },
      listOrganizationsUseCase: { execute: mockListOrganizations },
      getOrganizationUseCase: { execute: mockGetOrganization },
      updateOrganizationUseCase: { execute: mockUpdateOrganization },
      deleteOrganizationUseCase: { execute: mockDeleteOrganization },
      assignMemberUseCase: { execute: mockAssignMember },
      listMembersUseCase: { execute: mockListMembers },
      changeMemberRoleUseCase: { execute: mockChangeMemberRole },
      removeMemberUseCase: { execute: mockRemoveMember },
      promoteAdminUseCase: { execute: vi.fn() },
      demoteAdminUseCase: { execute: vi.fn() },
      listAdminsUseCase: { execute: vi.fn() },
      grantPermissionsUseCase: { execute: vi.fn() },
      revokePermissionUseCase: { execute: vi.fn() },
      listUsersUseCase: { execute: vi.fn() },
    },
  }),
}));

const mockOrg = {
  id: 'org-1',
  name: 'Hospital Central',
  type: 'hospital',
  description: 'Main hospital',
  address: '123 Main St',
  contactEmail: 'contact@hospital.com',
  contactPhone: '555-0100',
  active: true,
  createdAt: '2024-01-01',
  updatedAt: '2024-01-01',
};

const mockOrg2 = {
  id: 'org-2',
  name: 'Clinic Norte',
  type: 'clinic',
  description: 'North clinic',
  address: '456 North Ave',
  contactEmail: 'contact@clinic.com',
  contactPhone: '555-0200',
  active: true,
  createdAt: '2024-01-02',
  updatedAt: '2024-01-02',
};

const mockMember = {
  id: 'mem-1',
  userId: 'user-1',
  organizationId: 'org-1',
  role: 'doctor',
  email: 'doc@hospital.com',
  firstName: 'John',
  lastName: 'Doe',
  isActive: true,
  joinedAt: '2024-01-01',
  createdBy: 'admin-1',
  createdAt: '2024-01-01',
  updatedAt: '2024-01-01',
};

describe('Organization Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  describe('initial state', () => {
    it('should have correct initial state', () => {
      const store = useOrganizationStore();
      expect(store.organizations).toEqual([]);
      expect(store.currentOrganization).toBeNull();
      expect(store.members).toEqual([]);
      expect(store.pagination).toEqual({ total: 0, page: 1, limit: 20, totalPages: 0 });
      expect(store.isLoading).toBe(false);
      expect(store.error).toBeNull();
    });
  });

  describe('fetchOrganizations', () => {
    it('should fetch and store organizations with pagination', async () => {
      const result = {
        organizations: [mockOrg, mockOrg2],
        total: 2,
        page: 1,
        limit: 20,
        totalPages: 1,
        hasNext: false,
        hasPrevious: false,
      };
      mockListOrganizations.mockResolvedValue(result);
      const store = useOrganizationStore();

      await store.fetchOrganizations();

      expect(store.organizations).toEqual([mockOrg, mockOrg2]);
      expect(store.pagination).toEqual({ total: 2, page: 1, limit: 20, totalPages: 1 });
      expect(store.isLoading).toBe(false);
    });

    it('should pass query params to use case', async () => {
      mockListOrganizations.mockResolvedValue({
        organizations: [],
        total: 0,
        page: 2,
        limit: 10,
        totalPages: 0,
        hasNext: false,
        hasPrevious: true,
      });
      const store = useOrganizationStore();

      await store.fetchOrganizations({ page: 2, limit: 10, type: 'hospital' });

      expect(mockListOrganizations).toHaveBeenCalledWith({ page: 2, limit: 10, type: 'hospital' });
    });

    it('should set error on failure', async () => {
      mockListOrganizations.mockRejectedValue(new Error('Network error'));
      const store = useOrganizationStore();

      await store.fetchOrganizations();

      expect(store.error).toBe('Network error');
      expect(store.isLoading).toBe(false);
    });
  });

  describe('fetchOrganization', () => {
    it('should fetch and store a single organization', async () => {
      mockGetOrganization.mockResolvedValue(mockOrg);
      const store = useOrganizationStore();

      await store.fetchOrganization('org-1');

      expect(store.currentOrganization).toEqual(mockOrg);
      expect(mockGetOrganization).toHaveBeenCalledWith('org-1');
    });

    it('should set error on failure', async () => {
      mockGetOrganization.mockRejectedValue(new Error('Not found'));
      const store = useOrganizationStore();

      await store.fetchOrganization('org-1');

      expect(store.error).toBe('Not found');
    });
  });

  describe('createOrganization', () => {
    it('should create organization and add to list', async () => {
      mockCreateOrganization.mockResolvedValue(mockOrg);
      const store = useOrganizationStore();

      const result = await store.createOrganization({
        name: 'Hospital Central',
        type: 'hospital',
        description: 'Main hospital',
        address: '123 Main St',
        contactEmail: 'contact@hospital.com',
        contactPhone: '555-0100',
      });

      expect(result).toEqual(mockOrg);
      expect(store.organizations).toContainEqual(mockOrg);
    });

    it('should set error and rethrow on failure', async () => {
      mockCreateOrganization.mockRejectedValue(new Error('Validation error'));
      const store = useOrganizationStore();

      await expect(store.createOrganization({
        name: 'Test',
        type: 'hospital',
        description: 'Desc',
        address: 'Addr',
        contactEmail: 'e@e.com',
        contactPhone: '555',
      })).rejects.toThrow('Validation error');
      expect(store.error).toBe('Validation error');
    });
  });

  describe('updateOrganization', () => {
    it('should update organization and refresh current and list', async () => {
      const updated = { ...mockOrg, name: 'Updated Hospital' };
      mockUpdateOrganization.mockResolvedValue(updated);
      const store = useOrganizationStore();
      store.$patch({ organizations: [mockOrg], currentOrganization: mockOrg });

      await store.updateOrganization('org-1', { name: 'Updated Hospital' });

      expect(store.currentOrganization?.name).toBe('Updated Hospital');
      expect(store.organizations[0].name).toBe('Updated Hospital');
    });

    it('should set error and rethrow on failure', async () => {
      mockUpdateOrganization.mockRejectedValue(new Error('Update failed'));
      const store = useOrganizationStore();

      await expect(store.updateOrganization('org-1', { name: 'X' })).rejects.toThrow('Update failed');
      expect(store.error).toBe('Update failed');
    });
  });

  describe('deleteOrganization', () => {
    it('should delete organization and remove from list', async () => {
      mockDeleteOrganization.mockResolvedValue(undefined);
      const store = useOrganizationStore();
      store.$patch({ organizations: [mockOrg, mockOrg2], currentOrganization: mockOrg });

      await store.deleteOrganization('org-1');

      expect(store.organizations).toHaveLength(1);
      expect(store.organizations[0].id).toBe('org-2');
      expect(store.currentOrganization).toBeNull();
    });

    it('should not clear currentOrganization if different org is deleted', async () => {
      mockDeleteOrganization.mockResolvedValue(undefined);
      const store = useOrganizationStore();
      store.$patch({ organizations: [mockOrg, mockOrg2], currentOrganization: mockOrg });

      await store.deleteOrganization('org-2');

      expect(store.currentOrganization).toEqual(mockOrg);
    });

    it('should set error and rethrow on failure', async () => {
      mockDeleteOrganization.mockRejectedValue(new Error('Delete failed'));
      const store = useOrganizationStore();

      await expect(store.deleteOrganization('org-1')).rejects.toThrow('Delete failed');
      expect(store.error).toBe('Delete failed');
    });
  });

  describe('fetchMembers', () => {
    it('should fetch and store members', async () => {
      mockListMembers.mockResolvedValue([mockMember]);
      const store = useOrganizationStore();

      await store.fetchMembers('org-1');

      expect(store.members).toEqual([mockMember]);
      expect(mockListMembers).toHaveBeenCalledWith('org-1');
    });

    it('should set error on failure', async () => {
      mockListMembers.mockRejectedValue(new Error('Failed'));
      const store = useOrganizationStore();

      await store.fetchMembers('org-1');

      expect(store.error).toBe('Failed');
    });
  });

  describe('assignMember', () => {
    it('should assign member and add to list', async () => {
      mockAssignMember.mockResolvedValue(mockMember);
      const store = useOrganizationStore();

      await store.assignMember('org-1', { userId: 'user-1', role: 'doctor' });

      expect(store.members).toContainEqual(mockMember);
    });

    it('should set error and rethrow on failure', async () => {
      mockAssignMember.mockRejectedValue(new Error('Already exists'));
      const store = useOrganizationStore();

      await expect(store.assignMember('org-1', { userId: 'user-1', role: 'doctor' })).rejects.toThrow('Already exists');
      expect(store.error).toBe('Already exists');
    });
  });

  describe('changeMemberRole', () => {
    it('should update member role in list', async () => {
      const updatedMember = { ...mockMember, role: 'nurse' };
      mockChangeMemberRole.mockResolvedValue(updatedMember);
      const store = useOrganizationStore();
      store.$patch({ members: [mockMember] });

      await store.changeMemberRole('org-1', 'user-1', { role: 'nurse' });

      expect(store.members[0].role).toBe('nurse');
    });

    it('should set error and rethrow on failure', async () => {
      mockChangeMemberRole.mockRejectedValue(new Error('Role change failed'));
      const store = useOrganizationStore();

      await expect(store.changeMemberRole('org-1', 'user-1', { role: 'nurse' })).rejects.toThrow('Role change failed');
    });
  });

  describe('removeMember', () => {
    it('should remove member from list', async () => {
      mockRemoveMember.mockResolvedValue(undefined);
      const store = useOrganizationStore();
      store.$patch({ members: [mockMember] });

      await store.removeMember('org-1', 'user-1');

      expect(store.members).toHaveLength(0);
    });

    it('should set error and rethrow on failure', async () => {
      mockRemoveMember.mockRejectedValue(new Error('Remove failed'));
      const store = useOrganizationStore();

      await expect(store.removeMember('org-1', 'user-1')).rejects.toThrow('Remove failed');
    });
  });

  describe('clearError', () => {
    it('should clear the error', () => {
      const store = useOrganizationStore();
      store.$patch({ error: 'Some error' });

      store.clearError();

      expect(store.error).toBeNull();
    });
  });
});
