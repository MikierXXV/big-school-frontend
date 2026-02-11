/**
 * ============================================
 * GUARD: Auth Navigation Guard
 * ============================================
 *
 * Protege rutas que requieren autenticacion.
 *
 * LOGICA:
 * - requiresAuth: Redirige a /login si no autenticado
 * - requiresGuest: Redirige a /dashboard si autenticado
 *
 * TODO: Implementar guard completo
 */

import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';
import { useAuthStore } from '@presentation/stores/auth.store.js';

export function authGuard(
  to: RouteLocationNormalized,
  _from: RouteLocationNormalized,
  next: NavigationGuardNext
): void {
  const authStore = useAuthStore();

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'login', query: { redirect: to.fullPath } });
    return;
  }

  if (to.meta.requiresGuest && authStore.isAuthenticated) {
    next({ name: 'dashboard' });
    return;
  }

  next();
}
