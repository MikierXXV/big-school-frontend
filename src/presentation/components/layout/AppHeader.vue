<!--
  ============================================
  COMPONENT: AppHeader
  ============================================

  Header principal de la aplicacion.

  TODO: Implementar componente completo
-->

<script setup lang="ts">
import { useAuth } from '@presentation/composables/useAuth.js';

const { isAuthenticated, logout } = useAuth();
</script>

<template>
  <header class="app-header">
    <div class="container mx-auto px-4 py-4">
      <nav class="flex justify-between items-center">
        <h1 class="text-2xl font-bold">Big School</h1>
        <div v-if="isAuthenticated">
          <button @click="logout">Logout</button>
        </div>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.app-header {
  @apply bg-white shadow;
}
</style>
