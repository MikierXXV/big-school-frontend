/**
 * ============================================
 * STORE: Auth (Pinia)
 * ============================================
 *
 * Global authentication state management.
 * Wired to application use cases via DI container.
 */

import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { User } from '@domain/entities/user.entity.js';
import { createContainer } from '@infrastructure/di/container.js';
import type { RegisterInputDTO } from '@application/dtos/auth/register.dto.js';
import type { LoginInputDTO } from '@application/dtos/auth/login.dto.js';

const { useCases } = createContainer();

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null);
  const accessToken = ref<string | null>(null);
  const refreshToken = ref<string | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // Getters
  const isAuthenticated = computed(() => !!user.value && !!accessToken.value);

  // Actions
  async function login(input: LoginInputDTO): Promise<void> {
    try {
      isLoading.value = true;
      error.value = null;

      const result = await useCases.loginUseCase.execute(input);

      user.value = result.user as unknown as User; // UserDTO → User (simplified)
      accessToken.value = result.tokens.accessToken;
      refreshToken.value = result.tokens.refreshToken;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Login failed';
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function register(input: RegisterInputDTO): Promise<void> {
    try {
      isLoading.value = true;
      error.value = null;

      const result = await useCases.registerUseCase.execute(input);

      user.value = result.user as unknown as User; // UserDTO → User
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
      throw err;
    }
  }

  async function verifyEmail(token: string): Promise<void> {
    try {
      isLoading.value = true;
      error.value = null;

      const result = await useCases.verifyEmailUseCase.execute({ token });

      user.value = result.user as unknown as User;
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
