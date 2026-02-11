<!--
  ============================================
  VIEW: Dashboard
  ============================================

  Pagina principal del dashboard.

  TODO: Implementar view completo
-->

<script setup lang="ts">
import { useAuth } from '@presentation/composables/useAuth.js';

const { user } = useAuth();
</script>

<template>
  <div class="dashboard-view">
    <h1 class="text-3xl font-bold">Dashboard</h1>
    <p v-if="user" class="mt-4">Welcome, {{ user.fullName }}</p>
  </div>
</template>

<style scoped>
.dashboard-view {
  @apply container mx-auto px-4 py-8;
}
</style>
