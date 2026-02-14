<!--
  ============================================
  ROOT COMPONENT
  ============================================

  Componente raiz de la aplicacion.
  Renderiza el router-view principal.
-->

<script setup lang="ts">
import NotificationContainer from '@presentation/components/NotificationContainer.vue';
</script>

<template>
  <div id="app-container" class="min-h-screen flex flex-col">
    <router-view />

    <!-- Global Notification Container -->
    <NotificationContainer />
  </div>
</template>

<style>
/* Global styles handled in main.css */
</style>
