/**
 * ============================================
 * STORE: Auth (Pinia)
 * ============================================
 *
 * Estado global de autenticacion.
 *
 * ESTADO:
 * - user: Usuario autenticado o null
 * - tokens: Access y Refresh tokens
 * - isAuthenticated: Computed
 *
 * ACCIONES:
 * - login: Iniciar sesion
 * - logout: Cerrar sesion
 * - refreshToken: Renovar tokens
 *
 * TODO: Implementar store completo
 */

import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { User } from '@domain/entities/user.entity.js';

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null);
  const accessToken = ref<string | null>(null);

  // Getters
  const isAuthenticated = computed(() => !!user.value && !!accessToken.value);

  // Actions
  async function login(email: string, password: string): Promise<void> {
    // TODO: Implementar login via use case
    console.log('Login', email, password);
  }

  async function logout(): Promise<void> {
    // TODO: Implementar logout
    user.value = null;
    accessToken.value = null;
  }

  return {
    user,
    accessToken,
    isAuthenticated,
    login,
    logout,
  };
});
