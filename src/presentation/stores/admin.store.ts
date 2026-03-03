/**
 * ============================================
 * STORE: Admin (Pinia)
 * ============================================
 *
 * State management for admin operations (promote/demote, permissions).
 */

import { defineStore } from 'pinia';
import { ref } from 'vue';
import { createContainer } from '@infrastructure/di/container.js';
import type { AdminDTO, AdminPermissionsDTO, PaginatedUsersDTO } from '@application/dtos/admin/admin.dto.js';

const { useCases } = createContainer();

export const useAdminStore = defineStore('admin', () => {
  // ============================================
  // State
  // ============================================
  const admins = ref<AdminDTO[]>([]);
  const adminPermissions = ref<AdminPermissionsDTO | null>(null);
  const usersList = ref<PaginatedUsersDTO | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // ============================================
  // Actions
  // ============================================
  async function fetchAdmins(): Promise<void> {
    try {
      isLoading.value = true;
      error.value = null;
      const result = await useCases.listAdminsUseCase.execute();
      admins.value = result.admins;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch admins';
    } finally {
      isLoading.value = false;
    }
  }

  async function fetchUsers(query: { page?: number; limit?: number; search?: string } = {}): Promise<void> {
    try {
      isLoading.value = true;
      error.value = null;
      usersList.value = await useCases.listUsersUseCase.execute(query);
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch users';
    } finally {
      isLoading.value = false;
    }
  }

  async function promoteUser(userId: string): Promise<void> {
    try {
      isLoading.value = true;
      error.value = null;
      await useCases.promoteAdminUseCase.execute({ userId });
      await fetchAdmins();
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to promote user';
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function demoteUser(userId: string): Promise<void> {
    try {
      isLoading.value = true;
      error.value = null;
      await useCases.demoteAdminUseCase.execute({ userId });
      admins.value = admins.value.filter((a) => a.userId !== userId);
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to demote user';
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function fetchPermissions(userId: string): Promise<void> {
    try {
      isLoading.value = true;
      error.value = null;
      adminPermissions.value = await useCases.getAdminPermissionsUseCase.execute(userId);
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch permissions';
    } finally {
      isLoading.value = false;
    }
  }

  async function grantPermissions(userId: string, permissions: string[]): Promise<void> {
    try {
      isLoading.value = true;
      error.value = null;
      adminPermissions.value = await useCases.grantPermissionsUseCase.execute({ userId, permissions });
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to grant permissions';
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function revokePermission(userId: string, permission: string): Promise<void> {
    try {
      isLoading.value = true;
      error.value = null;
      adminPermissions.value = await useCases.revokePermissionUseCase.execute({ userId, permission });
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to revoke permission';
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
    admins,
    adminPermissions,
    usersList,
    isLoading,
    error,

    // Actions
    fetchAdmins,
    fetchUsers,
    promoteUser,
    demoteUser,
    fetchPermissions,
    grantPermissions,
    revokePermission,
    clearError,
  };
});
