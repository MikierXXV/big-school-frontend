/**
 * ============================================
 * STORE: Auth (Pinia)
 * ============================================
 *
 * Global authentication state management.
 * Wired to application use cases via DI container.
 * Persists session in localStorage for page reload resilience.
 */

import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { createContainer } from '@infrastructure/di/container.js';
import type { RegisterDTO } from '@application/dtos/auth/register.dto.js';
import type { LoginDTO } from '@application/dtos/auth/login.dto.js';
import type { UserDTO } from '@application/dtos/user.dto.js';

const { useCases } = createContainer();

const USER_STORAGE_KEY = 'auth_user';

/**
 * Serializable user data stored in the auth state.
 * Includes fullName for convenience.
 */
export interface AuthUser {
  readonly id: string;
  readonly email: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly fullName: string;
  readonly status: string;
  readonly emailVerified: boolean;
}

/**
 * Converts a UserDTO from use cases into an AuthUser for the store.
 */
function toAuthUser(dto: UserDTO): AuthUser {
  return {
    id: dto.id,
    email: dto.email,
    firstName: dto.firstName,
    lastName: dto.lastName,
    fullName: `${dto.firstName} ${dto.lastName}`,
    status: dto.status,
    emailVerified: dto.emailVerified,
  };
}

/**
 * Persists user data to localStorage.
 */
function persistUser(authUser: AuthUser): void {
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(authUser));
}

/**
 * Restores user data from localStorage.
 */
function restoreUser(): AuthUser | null {
  const stored = localStorage.getItem(USER_STORAGE_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored) as AuthUser;
  } catch {
    localStorage.removeItem(USER_STORAGE_KEY);
    return null;
  }
}

/**
 * Clears persisted user data from localStorage.
 */
function clearPersistedUser(): void {
  localStorage.removeItem(USER_STORAGE_KEY);
}

export const useAuthStore = defineStore('auth', () => {
  // ============================================
  // State - Restore from localStorage if available
  // ============================================
  const storedUser = restoreUser();
  const storedAccessToken = localStorage.getItem('accessToken');
  const storedRefreshToken = localStorage.getItem('refreshToken');

  const user = ref<AuthUser | null>(storedUser);
  const accessToken = ref<string | null>(storedAccessToken);
  const refreshToken = ref<string | null>(storedRefreshToken);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // ============================================
  // Getters
  // ============================================
  const isAuthenticated = computed(() => !!user.value && !!accessToken.value);

  // ============================================
  // Actions
  // ============================================
  async function login(input: LoginDTO): Promise<void> {
    try {
      isLoading.value = true;
      error.value = null;

      const result = await useCases.loginUseCase.execute(input);

      const authUser = toAuthUser(result.user);
      user.value = authUser;
      accessToken.value = result.tokens.accessToken;
      refreshToken.value = result.tokens.refreshToken;

      // Persist user data (tokens already persisted by LoginUseCase)
      persistUser(authUser);
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Login failed';
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function register(input: RegisterDTO): Promise<{
    requiresEmailVerification: boolean;
    verificationToken: string | undefined;
  }> {
    try {
      isLoading.value = true;
      error.value = null;

      const result = await useCases.registerUseCase.execute(input);

      const authUser = toAuthUser(result.user);
      user.value = authUser;

      return {
        requiresEmailVerification: result.requiresEmailVerification,
        verificationToken: result.verificationToken,
      };
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Registration failed';
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function logout(): Promise<void> {
    try {
      isLoading.value = true;
      error.value = null;

      await useCases.logoutUseCase.execute();

      user.value = null;
      accessToken.value = null;
      refreshToken.value = null;

      // Clear persisted user data (tokens cleared by LogoutUseCase)
      clearPersistedUser();
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Logout failed';
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function refreshSession(): Promise<void> {
    if (!refreshToken.value) {
      throw new Error('No refresh token available');
    }

    try {
      const result = await useCases.refreshSessionUseCase.execute({
        refreshToken: refreshToken.value,
      });

      accessToken.value = result.accessToken;
      refreshToken.value = result.refreshToken;
    } catch (err) {
      // Clear session on refresh failure
      user.value = null;
      accessToken.value = null;
      refreshToken.value = null;
      clearPersistedUser();
      throw err;
    }
  }

  async function verifyEmail(token: string): Promise<void> {
    try {
      isLoading.value = true;
      error.value = null;

      const result = await useCases.verifyEmailUseCase.execute({ token });

      const authUser = toAuthUser(result.user);
      user.value = authUser;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Email verification failed';
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function requestPasswordReset(email: string): Promise<void> {
    try {
      isLoading.value = true;
      error.value = null;

      await useCases.requestPasswordResetUseCase.execute({ email });
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Password reset request failed';
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function confirmPasswordReset(input: {
    token: string;
    newPassword: string;
    passwordConfirmation: string;
  }): Promise<void> {
    try {
      isLoading.value = true;
      error.value = null;

      await useCases.confirmPasswordResetUseCase.execute(input);
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Password reset confirmation failed';
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
    user,
    accessToken,
    refreshToken,
    isLoading,
    error,

    // Getters
    isAuthenticated,

    // Actions
    login,
    register,
    logout,
    refreshSession,
    verifyEmail,
    requestPasswordReset,
    confirmPasswordReset,
    clearError,
  };
});
