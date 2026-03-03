/**
 * ============================================
 * STORE: RBAC (Pinia)
 * ============================================
 *
 * State management for RBAC permissions and user organizations.
 */

import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { createContainer } from '@infrastructure/di/container.js';
import type { UserOrganizationDTO } from '@application/dtos/organization/membership.dto.js';

const { useCases } = createContainer();

export const useRbacStore = defineStore('rbac', () => {
  // ============================================
  // State
  // ============================================
  const permissions = ref<string[]>([]);
  const userOrganizations = ref<UserOrganizationDTO[]>([]);
  const isLoading = ref(false);

  // ============================================
  // Getters
  // ============================================
  const organizationCount = computed(() => userOrganizations.value.length);

  // ============================================
  // Methods
  // ============================================
  function hasPermission(permission: string): boolean {
    return permissions.value.includes(permission);
  }

  function isMemberOf(organizationId: string): boolean {
    return userOrganizations.value.some(
      (org) => org.organizationId === organizationId && org.isActive,
    );
  }

  function getRoleInOrg(organizationId: string): string | null {
    const membership = userOrganizations.value.find(
      (org) => org.organizationId === organizationId && org.isActive,
    );
    return membership?.role ?? null;
  }

  function isOrgAdmin(organizationId: string): boolean {
    return getRoleInOrg(organizationId) === 'org_admin';
  }

  async function fetchPermissions(userId: string): Promise<void> {
    try {
      isLoading.value = true;
      const result = await useCases.getAdminPermissionsUseCase.execute(userId);
      permissions.value = result.permissions.map((p) => p.permission);
    } catch {
      permissions.value = [];
    } finally {
      isLoading.value = false;
    }
  }

  async function fetchUserOrganizations(userId: string): Promise<void> {
    try {
      isLoading.value = true;
      const result = await useCases.getUserOrganizationsUseCase.execute(userId);
      userOrganizations.value = result;
    } catch {
      userOrganizations.value = [];
    } finally {
      isLoading.value = false;
    }
  }

  function clear(): void {
    permissions.value = [];
    userOrganizations.value = [];
  }

  return {
    // State
    permissions,
    userOrganizations,
    isLoading,

    // Getters
    organizationCount,

    // Methods
    hasPermission,
    isMemberOf,
    getRoleInOrg,
    isOrgAdmin,
    fetchPermissions,
    fetchUserOrganizations,
    clear,
  };
});
