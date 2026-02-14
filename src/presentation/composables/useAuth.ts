/**
 * ============================================
 * COMPOSABLE: useAuth
 * ============================================
 *
 * Composable wrapper for auth store with router helpers.
 */

import { useAuthStore } from '@presentation/stores/auth.store.js';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import type { LoginInputDTO } from '@application/dtos/auth/login.dto.js';
import type { RegisterInputDTO } from '@application/dtos/auth/register.dto.js';

export function useAuth() {
  const authStore = useAuthStore();
  const router = useRouter();

  const { user, isAuthenticated, isLoading, error } = storeToRefs(authStore);

  /**
   * Login and redirect to dashboard
   */
  async function loginAndRedirect(input: LoginInputDTO): Promise<void> {
    await authStore.login(input);
    await router.push('/dashboard');
  }

  /**
   * Logout and redirect to login
   */
  async function logoutAndRedirect(): Promise<void> {
    await authStore.logout();
    await router.push('/login');
  }

  return {
    // State
    user,
    isAuthenticated,
    isLoading,
    error,

    // Store actions
    login: authStore.login,
    register: authStore.register,
    logout: authStore.logout,
    refreshSession: authStore.refreshSession,
    verifyEmail: authStore.verifyEmail,
    requestPasswordReset: authStore.requestPasswordReset,
    confirmPasswordReset: authStore.confirmPasswordReset,
    clearError: authStore.clearError,

    // Helper actions with routing
    loginAndRedirect,
    logoutAndRedirect,
  };
}
