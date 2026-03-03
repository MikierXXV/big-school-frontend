/**
 * ============================================
 * GUARD: RBAC Navigation Guard
 * ============================================
 *
 * Protege rutas basándose en roles y permisos.
 *
 * LOGICA:
 * - requiresRole: Verifica que el usuario tenga uno de los roles indicados
 * - requiresPermission: Verifica que el usuario tenga el permiso (SuperAdmin bypasea)
 * - Si no cumple, redirige a /forbidden
 */

import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';
import { useAuthStore } from '@presentation/stores/auth.store.js';
import { useRbacStore } from '@presentation/stores/rbac.store.js';

export function rbacGuard(
  to: RouteLocationNormalized,
  _from: RouteLocationNormalized,
  next: NavigationGuardNext
): void {
  const { requiresRole, requiresPermission } = to.meta;

  // If no RBAC requirements, pass through
  if (!requiresRole && !requiresPermission) {
    next();
    return;
  }

  const authStore = useAuthStore();

  // Must be authenticated for RBAC checks
  if (!authStore.isAuthenticated || !authStore.user) {
    next({ name: 'login', query: { redirect: to.fullPath } });
    return;
  }

  const userRole = authStore.user.systemRole;

  // Check role requirement
  if (requiresRole && requiresRole.length > 0) {
    if (!requiresRole.includes(userRole)) {
      next({ name: 'forbidden' });
      return;
    }
  }

  // Check permission requirement (SuperAdmin bypasses)
  if (requiresPermission) {
    if (userRole === 'super_admin') {
      next();
      return;
    }

    const rbacStore = useRbacStore();
    if (!rbacStore.hasPermission(requiresPermission)) {
      next({ name: 'forbidden' });
      return;
    }
  }

  next();
}
