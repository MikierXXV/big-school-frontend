/**
 * ============================================
 * COMPOSABLE: useAuth
 * ============================================
 *
 * Composable wrapper for auth store with router helpers.
 */

import { useAuthStore } from '@presentation/stores/auth.store.js';
import { useNotificationStore } from '@presentation/stores/notification.store.js';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import type { LoginDTO } from '@application/dtos/auth/login.dto.js';
import type { RegisterDTO } from '@application/dtos/auth/register.dto.js';

export function useAuth() {
  const authStore = useAuthStore();
  const notificationStore = useNotificationStore();
  const router = useRouter();

  const { user, isAuthenticated, isLoading, error } = storeToRefs(authStore);

  /**
   * Login and redirect to dashboard
   */
  async function loginAndRedirect(input: LoginDTO): Promise<void> {
    await authStore.login(input);
    notificationStore.success('Login successful. Welcome back!');
    await router.push('/dashboard');
  }

  /**
   * Register and redirect to verify email page
   * In development mode, auto-redirects to verification with token
   */
  async function registerAndRedirect(input: RegisterDTO): Promise<void> {
    const result = await authStore.register(input);

    notificationStore.success('Account created successfully!');

    // If verification token is available (development mode), redirect to verify-email with token
    if (result.verificationToken) {
      await router.push({
        path: '/verify-email',
        query: { token: result.verificationToken }
      });
    } else {
      // Production mode: redirect to login with success message
      await router.push({
        path: '/login',
        query: { registered: 'true' }
      });
    }
  }

  /**
   * Logout and redirect to login
   */
  async function logoutAndRedirect(): Promise<void> {
    await authStore.logout();
    notificationStore.info('You have been logged out.');
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
    registerAndRedirect,
    logoutAndRedirect,
  };
}
