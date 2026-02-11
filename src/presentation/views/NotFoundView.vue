<!--
  ============================================
  VIEW: Not Found
  ============================================

  Pagina 404.
-->

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

function goHome(): void {
  router.push('/');
}
</script>

<template>
  <div class="not-found-view">
    <h1 class="text-6xl font-bold">404</h1>
    <p class="mt-4 text-xl">Page not found</p>
    <button class="mt-8 px-6 py-3 bg-primary-600 text-white rounded" @click="goHome">
      Go Home
    </button>
  </div>
</template>

<style scoped>
.not-found-view {
  @apply container mx-auto px-4 py-8 text-center;
}
</style>
