<!--
  ============================================
  VIEW: Login
  ============================================

  Pagina de login.

  TODO: Implementar view completo
-->

<script setup lang="ts">
import { LoginForm } from '@presentation/components/auth/index.js';
import { BaseCard } from '@presentation/components/ui/index.js';
import { RouterLink } from 'vue-router';
</script>

<template>
  <div class="login-view">
    <BaseCard class="max-w-md mx-auto">
      <h1 class="text-2xl font-bold text-center text-gray-900 dark:text-gray-100 mb-6">Sign in</h1>
      <LoginForm />

      <p class="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
        <RouterLink
          to="/"
          class="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400"
        >
          &larr; Back to home
        </RouterLink>
      </p>
    </BaseCard>
  </div>
</template>

<style scoped>
.login-view {
  @apply container mx-auto px-4 py-8;
}
</style>
