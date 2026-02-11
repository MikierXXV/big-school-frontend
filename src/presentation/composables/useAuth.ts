/**
 * ============================================
 * COMPOSABLE: useAuth
 * ============================================
 *
 * Composable para manejar autenticacion en componentes.
 * Abstrae el acceso al store de auth.
 *
 * RETORNA:
 * - user: Usuario actual
 * - isAuthenticated: Estado de autenticacion
 * - login: Funcion de login
 * - logout: Funcion de logout
 *
 * TODO: Implementar composable completo
 */

import { useAuthStore } from '@presentation/stores/auth.store.js';
import { storeToRefs } from 'pinia';

export function useAuth() {
  const authStore = useAuthStore();
  const { user, isAuthenticated } = storeToRefs(authStore);

  return {
    user,
    isAuthenticated,
    login: authStore.login,
    logout: authStore.logout,
  };
}
