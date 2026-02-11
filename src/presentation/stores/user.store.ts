/**
 * ============================================
 * STORE: User (Pinia)
 * ============================================
 *
 * Estado global de datos de usuario.
 *
 * TODO: Implementar store completo
 */

import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useUserStore = defineStore('user', () => {
  // State
  const loading = ref(false);

  // Actions
  async function fetchUserProfile(): Promise<void> {
    // TODO: Implementar fetch user profile
    loading.value = true;
    try {
      // await getUserProfile()
    } finally {
      loading.value = false;
    }
  }

  return {
    loading,
    fetchUserProfile,
  };
});
