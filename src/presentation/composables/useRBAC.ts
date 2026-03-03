/**
 * ============================================
 * COMPOSABLE: useRBAC
 * ============================================
 *
 * Central composable for RBAC checks.
 * Combines auth store role info with rbac store permissions.
 */

import { useAuthStore } from '@presentation/stores/auth.store.js';
import { useRbacStore } from '@presentation/stores/rbac.store.js';
import { storeToRefs } from 'pinia';

export function useRBAC() {
  const authStore = useAuthStore();
  const rbacStore = useRbacStore();

  const { isSuperAdmin, isAdmin, hasElevatedRole } = storeToRefs(authStore);
  const { permissions, userOrganizations, isLoading, organizationCount } = storeToRefs(rbacStore);

  function canAccess(role?: string[], permission?: string): boolean {
    if (!authStore.user) return false;

    const userRole = authStore.user.systemRole;

    // Check role
    if (role && role.length > 0 && !role.includes(userRole)) {
      return false;
    }

    // Check permission (SuperAdmin bypasses)
    if (permission) {
      if (userRole === 'super_admin') return true;
      return rbacStore.hasPermission(permission);
    }

    return true;
  }

  function canManageOrg(organizationId: string): boolean {
    if (isSuperAdmin.value) return true;
    if (rbacStore.hasPermission('manage_organizations')) return true;
    return rbacStore.isOrgAdmin(organizationId);
  }

  const hasPermission = (permission: string): boolean => {
    if (isSuperAdmin.value) return true;
    return rbacStore.hasPermission(permission);
  };

  return {
    // From auth store
    isSuperAdmin,
    isAdmin,
    hasElevatedRole,

    // From rbac store
    permissions,
    userOrganizations,
    isLoading,
    organizationCount,

    // Composable methods
    canAccess,
    canManageOrg,
    hasPermission,
  };
}
