/**
 * ============================================
 * STORE: Organization (Pinia)
 * ============================================
 *
 * State management for organization CRUD and member management.
 */

import { defineStore } from 'pinia';
import { ref } from 'vue';
import { createContainer } from '@infrastructure/di/container.js';
import type { OrganizationDTO, CreateOrganizationDTO, UpdateOrganizationDTO, PaginatedOrganizationsDTO } from '@application/dtos/organization/organization.dto.js';
import type { MembershipDTO, AssignMemberDTO, ChangeMemberRoleDTO } from '@application/dtos/organization/membership.dto.js';

const { useCases } = createContainer();

export const useOrganizationStore = defineStore('organization', () => {
  // ============================================
  // State
  // ============================================
  const organizations = ref<OrganizationDTO[]>([]);
  const currentOrganization = ref<OrganizationDTO | null>(null);
  const members = ref<MembershipDTO[]>([]);
  const pagination = ref<{ total: number; page: number; limit: number; totalPages: number }>({
    total: 0, page: 1, limit: 20, totalPages: 0,
  });
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // ============================================
  // Actions
  // ============================================
  async function fetchOrganizations(query: { page?: number; limit?: number; type?: string; active?: boolean } = {}): Promise<void> {
    try {
      isLoading.value = true;
      error.value = null;
      const result: PaginatedOrganizationsDTO = await useCases.listOrganizationsUseCase.execute(query);
      organizations.value = result.organizations;
      pagination.value = {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
      };
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch organizations';
    } finally {
      isLoading.value = false;
    }
  }

  async function fetchOrganization(id: string): Promise<void> {
    try {
      isLoading.value = true;
      error.value = null;
      currentOrganization.value = await useCases.getOrganizationUseCase.execute(id);
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch organization';
    } finally {
      isLoading.value = false;
    }
  }

  async function createOrganization(data: CreateOrganizationDTO): Promise<OrganizationDTO> {
    isLoading.value = true;
    error.value = null;
    try {
      const org = await useCases.createOrganizationUseCase.execute(data);
      organizations.value.push(org);
      return org;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to create organization';
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function updateOrganization(id: string, data: UpdateOrganizationDTO): Promise<void> {
    try {
      isLoading.value = true;
      error.value = null;
      const updated = await useCases.updateOrganizationUseCase.execute(id, data);
      currentOrganization.value = updated;
      const index = organizations.value.findIndex((o) => o.id === id);
      if (index !== -1) organizations.value[index] = updated;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to update organization';
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function deleteOrganization(id: string): Promise<void> {
    try {
      isLoading.value = true;
      error.value = null;
      await useCases.deleteOrganizationUseCase.execute(id);
      organizations.value = organizations.value.filter((o) => o.id !== id);
      if (currentOrganization.value?.id === id) currentOrganization.value = null;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to delete organization';
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function fetchMembers(organizationId: string): Promise<void> {
    try {
      isLoading.value = true;
      error.value = null;
      members.value = await useCases.listMembersUseCase.execute(organizationId);
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch members';
    } finally {
      isLoading.value = false;
    }
  }

  async function assignMember(organizationId: string, data: AssignMemberDTO): Promise<void> {
    try {
      isLoading.value = true;
      error.value = null;
      const member = await useCases.assignMemberUseCase.execute(organizationId, data);
      members.value.push(member);
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to assign member';
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function changeMemberRole(organizationId: string, userId: string, data: ChangeMemberRoleDTO): Promise<void> {
    try {
      isLoading.value = true;
      error.value = null;
      const updated = await useCases.changeMemberRoleUseCase.execute(organizationId, userId, data);
      const index = members.value.findIndex((m) => m.userId === userId);
      if (index !== -1) members.value[index] = updated;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to change member role';
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function removeMember(organizationId: string, userId: string): Promise<void> {
    try {
      isLoading.value = true;
      error.value = null;
      await useCases.removeMemberUseCase.execute(organizationId, userId);
      members.value = members.value.filter((m) => m.userId !== userId);
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to remove member';
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  function clearError(): void {
    error.value = null;
  }

  return {
    // State
    organizations,
    currentOrganization,
    members,
    pagination,
    isLoading,
    error,

    // Actions
    fetchOrganizations,
    fetchOrganization,
    createOrganization,
    updateOrganization,
    deleteOrganization,
    fetchMembers,
    assignMember,
    changeMemberRole,
    removeMember,
    clearError,
  };
});
