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
import type { AdminDTO, AdminPermissionsDTO, PaginatedUsersDTO, UserStatsDTO } from '@application/dtos/admin/admin.dto.js';

const { useCases } = createContainer();

export const useAdminStore = defineStore('admin', () => {
  // ============================================
  // State
  // ============================================
  const admins = ref<AdminDTO[]>([]);
  const adminPermissions = ref<AdminPermissionsDTO | null>(null);
  const usersList = ref<PaginatedUsersDTO | null>(null);
  const userStats = ref<UserStatsDTO | null>(null);
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

  async function fetchUsers(query: { page?: number; limit?: number; search?: string; role?: string } = {}): Promise<void> {
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

  async function fetchUserStats(): Promise<void> {
    try {
      isLoading.value = true;
      error.value = null;
      userStats.value = await useCases.getUserStatsUseCase.execute();
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch user stats';
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

  async function deleteUser(userId: string): Promise<void> {
    await useCases.deleteUserUseCase.execute(userId);
  }

  async function deleteUsers(userIds: string[]): Promise<void> {
    await Promise.allSettled(userIds.map((id) => useCases.deleteUserUseCase.execute(id)));
  }

  async function hardDeleteUsers(userIds: string[]): Promise<void> {
    await Promise.allSettled(userIds.map((id) => useCases.hardDeleteUserUseCase.execute(id)));
  }

  async function bulkUpdateUserStatus(userIds: string[], status: 'ACTIVE' | 'SUSPENDED' | 'DEACTIVATED'): Promise<{ succeeded: number; failed: number }> {
    const results = await Promise.allSettled(
      userIds.map((id) => useCases.updateUserStatusUseCase.execute({ userId: id, status }))
    );
    const succeeded = results.filter((r) => r.status === 'fulfilled').length;
    return { succeeded, failed: results.length - succeeded };
  }

  async function updateUserStatus(userId: string, status: 'ACTIVE' | 'SUSPENDED' | 'DEACTIVATED'): Promise<void> {
    isLoading.value = true;
    try {
      await useCases.updateUserStatusUseCase.execute({ userId, status });
      if (usersList.value) {
        const user = usersList.value.users.find((u) => u.id === userId);
        if (user) (user as Record<string, unknown>).status = status;
      }
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
    userStats,
    isLoading,
    error,

    // Actions
    fetchAdmins,
    fetchUsers,
    fetchUserStats,
    promoteUser,
    demoteUser,
    deleteUser,
    deleteUsers,
    hardDeleteUsers,
    bulkUpdateUserStatus,
    updateUserStatus,
    fetchPermissions,
    grantPermissions,
    revokePermission,
    clearError,
  };
});
