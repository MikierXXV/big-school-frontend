<!--
  ============================================
  ROOT COMPONENT
  ============================================

  Componente raiz de la aplicacion.
  Renderiza el router-view principal.
-->

<script setup lang="ts">
// TODO: Setup global providers si es necesario
</script>

<template>
  <div id="app-container" class="min-h-screen flex flex-col">
    <router-view />
  </div>
</template>

<style>
/* Global styles handled in main.css */
</style>
